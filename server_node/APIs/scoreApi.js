const exp = require("express");
const scoreApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const getDBObj = require("./DBConnection");

require("dotenv").config();

scoreApp.use(exp.json());
/**
 * @swagger
 * tags:
 *   name: Score
 *   description: API endpoints related to scoring
 */

/**
 * @swagger
 * /score/post-score:
 *   post:
 *     summary: Post a new score
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               juryId:
 *                 type: number
 *               teamId:
 *                 type: number
 *               scores:
 *                 type: object
 *                 properties:
 *                   metric1:
 *                     type: number
 *                   metric2:
 *                     type: number
 *                   metric3:
 *                     type: number
 *                   metric4:
 *                     type: number
 *     responses:
 *       '200':
 *         description: Score posted successfully
 *       '500':
 *         description: Internal Server Error
 */
scoreApp.post("/post-score", async (request, response) => {
  try {
    const { juryId, teamId, scores } = request.body;

    const totalScore = Object.values(scores).reduce(
      (acc, curr) => acc + curr,
      0
    );

    const scoreCollectionObject = await getDBObj("scoreCollectionObject");
    await scoreCollectionObject.insertOne({
      juryId,
      teamId,
      scores,
      totalScore,
    });

    response.send({ message: "Score posted successfully" });
  } catch (error) {
    console.error("Error while posting score:", error);
    response.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /score/get-teams-evaluated-by-jury/{juryId}:
 *   get:
 *     summary: Retrieve scores evaluated by a specific jury
 *     tags: [Score]
 *     parameters:
 *       - in: path
 *         name: juryId
 *         required: true
 *         description: ID of the jury for which scores are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Scores evaluated by the jury retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation
 *                   example: Scores evaluated by jury
 *                 payload:
 *                   type: array
 *                   description: Array containing scores evaluated by the specified jury
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the score document
 *                       juryId:
 *                         type: integer
 *                         description: ID of the jury who evaluated the score
 *                       teamId:
 *                         type: integer
 *                         description: ID of the team being evaluated
 *                       scores:
 *                         type: object
 *                         description: Object containing the scores evaluated by the jury
 *                       totalScore:
 *                         type: integer
 *                         description: Total score calculated from individual scores
 *       '500':
 *         description: Internal Server Error
 */
scoreApp.get(
  "/get-teams-evaluated-by-jury/:juryId",
  expressAsyncHandler(async (request, response) => {
    try {
      const juryId = parseInt(request.params.juryId);
      const scoreCollectionObject = await getDBObj("scoreCollectionObject");

      const scores = await scoreCollectionObject.find({ juryId }).toArray();

      response.send({ message: "Scores evaluated by jury", payload: scores });
    } catch (error) {
      console.error("Error while retrieving scores by jury:", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 * /score/get-metrics:
 *   get:
 *     summary: Retrieve metrics for all teams
 *     tags: [Score]
 *     responses:
 *       '200':
 *         description: Metrics for all teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the operation
 *                   example: Metrics for all teams
 *
 *       '500':
 *         description: Internal Server Error
 */

scoreApp.get(
  "/get-metrics",
  expressAsyncHandler(async (request, response) => {
    try {
      const scoreCollectionObject = await getDBObj("scoreCollectionObject");
      const teamsMetrics = await scoreCollectionObject
        .aggregate([
          {
            $group: {
              _id: "$teamId",
              records: { $push: "$$ROOT" },
            },
          },
          {
            $unwind: "$records",
          },
          {
            $lookup: {
              from: "userCollectionObject",
              localField: "records.juryId",
              foreignField: "userId",
              as: "juryInfo",
            },
          },
          {
            $addFields: {
              "records.juryName": { $arrayElemAt: ["$juryInfo.name", 0] },
            },
          },
          {
            $lookup: {
              from: "teamCollectionObject",
              localField: "_id",
              foreignField: "teamId",
              as: "teamInfo",
            },
          },
          {
            $addFields: {
              teamName: { $arrayElemAt: ["$teamInfo.teamName", 0] },
            },
          },
          {
            $project: {
              "records.juryId": 1,
              teamName: 1,
              "records.juryName": 1,
              "records.scores": 1,
              "records.totalScore": 1,
            },
          },
          {
            $group: {
              _id: "$_id",
              teamName: { $first: "$teamName" },
              records: { $push: "$records" },
            },
          },
        ])
        .toArray();

      response.send({
        message: "Metrics for all teams",
        payload: teamsMetrics,
      });
    } catch (error) {
      console.error("Error while retrieving metrics:", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
  })
);

module.exports = scoreApp;
