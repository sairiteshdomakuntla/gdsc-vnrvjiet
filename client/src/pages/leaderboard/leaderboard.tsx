import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../../Apis/juries";
import { getDate } from "date-fns";
import acmlogo from "../images/acmlogo.png";

interface Teams {
  _id?: string;
  teamName?: string;
  teamLead?: string;
  metrics: {
    creativity: number;
    Ideation: number;
    Presentation: number;
    FutureScope: number;
  };
}

const Leaderboard = () => {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard();
      setTeams(response.payload);
      await setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    getData();

    const intervalId = setInterval(() => {
      getData();
    }, 120000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const calculateTotalScore = (team: Teams) => {
    const { creativity, FutureScope, Ideation, Presentation } = team.metrics;
    return creativity + FutureScope + Ideation + Presentation;
  };

  return (
    <div className="container mx-auto p-6">
      <div>
        {/* <div className="flex flex-row items-center  ">
        <img
          className="gdsc_logo h-8"
          src="https://cdn-images-1.medium.com/max/578/1*vZVM7utCuRiZ6-HDsNeYUA@2x.png"
          width="50"
          height="50"
        />
        <h1 className="px-2 font-bolder"> X </h1>
      <img src={acmlogo} className="h-10" alt=""  />
        </div> */}

        <div className="flex flex-row ">
          <h1 className="text-2xl font-bold mb-4">Webathon Leaderboard</h1>

          <button className="mx-auto text-2xl" onClick={() => getData()}>
            🔃
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <p>Loading...</p>
            <img
              src="https://hadibuttt.github.io/GDSC-Portfolio-Site/img/main.png"
              alt="image"
              className="w-[75vw] md:w-[40vw]"
            />
          </div>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Sno
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Team Name
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Creativity
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Future Scope
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Ideation
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Presentation
                </th>
                <th className="px-1 py1 text-xs  md:text-lg md:px-4 md:py-2">
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody>
              {teams &&
                teams
                  .slice()
                  .sort(
                    (a: Teams, b: Teams) =>
                      calculateTotalScore(b) - calculateTotalScore(a)
                  )
                  .map((team: Teams, index: number) => (
                    <tr key={team._id}>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {index + 1}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {team.teamName}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {team.metrics.creativity}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {team.metrics.FutureScope}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {team.metrics.Ideation}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {team.metrics.Presentation}
                      </td>
                      <td className="border px-1 py1 text-xs md:text-lg md:px-4 md:py-2">
                        {calculateTotalScore(team)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
