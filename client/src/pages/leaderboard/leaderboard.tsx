import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../../Apis/juries";
import { getDate } from "date-fns";
import acmlogo from "../images/acmlogo.png";

interface Teams {
  _id: number;
  teamName: string;
  records: {
    juryId: number;
    scores: {
      [key: string]: number;
    };
    totalScore: number;
    juryName: string;
  }[];
}

const Leaderboard = () => {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayJury1, setDisplayJury1] = useState(false);
  const [displayJury2, setDisplayJury2] = useState(false);
  const [showDetailedColumns, setShowDetailedColumns] = useState(false);

  const handleJuryClick = (juryNumber: number) => {
    if (juryNumber === 1) {
      setDisplayJury1(!displayJury1);
    } else if (juryNumber === 2) {
      setDisplayJury2(!displayJury2);
    }
  };

  const handleToggleDetailedColumns = () => {
    setShowDetailedColumns(!showDetailedColumns);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard();
      setTeams(response.payload);
      setLoading(false);
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
    const totalScore1 = team.records[0]?.totalScore || 0;
    const totalScore2 = team.records[1]?.totalScore || 0;

    const totalScore =
      (totalScore1 + totalScore2) / (totalScore1 && totalScore2 ? 2 : 1);

    return totalScore;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-row ">
        <h1 className="text-lg lg:text-2xl font-bold mb-4">
          Webathon 2.0 Leaderboard
        </h1>
        <button
          className="mx-auto text-2xl"
          onClick={() => getData()}
          disabled={loading}
        >
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
        <>
          <button onClick={handleToggleDetailedColumns} className="bg-yellow-400 rounded-md px-3 my-2 text-sm">
            {showDetailedColumns ? "Hide Detailed Metrics" : "Show Detailed Metrics"}
          </button>
          <table className="table-auto w-full text-xs md:text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight">
                  Sno
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight">
                  Team Name
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight"
                  onClick={() => handleJuryClick(1)}>
                  Jury 1
                </th>
                {showDetailedColumns && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight">
                    Jury 1 Detailed
                  </th>
                )}
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight"
                  onClick={() => handleJuryClick(2)}>
                  Jury 2
                </th>
                {showDetailedColumns && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight">
                    Jury 2 Detailed
                  </th>)}
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-tight">
                  Average
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {teams &&
                teams
                  .slice()
                  .sort(
                    (a: Teams, b: Teams) =>
                      calculateTotalScore(b) - calculateTotalScore(a)
                  )
                  .map((team: Teams, index: number) => (
                    <tr key={team._id}>
                      <td className="border px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                        {index + 1}
                      </td>
                      <td className="border px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                        {team.teamName}
                      </td>
                      <td className="border px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                        {team.records[0]?.totalScore !== undefined &&
                        team.records[0]?.totalScore !== null
                          ? team.records[0]?.totalScore
                          : "-"}
                        {displayJury1 &&
                          team.records[0]?.juryName &&
                          ` (${team.records[0]?.juryName})`}
                      </td>
                      {showDetailedColumns && (
                        <td className="border px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                          {/* Render detailed scores here */}
                          {showDetailedColumns && (
                            <td className=" px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                              {team.records[0]?.scores && (
                                <ul>
                                  {Object.entries(team.records[0].scores).map(([metric, score]) => (
                                    <li key={metric}>
                                      {metric}: {score}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          )}
                        </td>
                      )}
                      <td className="border px-1 py1 text-xs lg:text-md md:px-4 md:py-2">
                        {team.records[1]?.totalScore !== undefined &&
                        team.records[1]?.totalScore !== null
                          ? team.records[1]?.totalScore
                          : "-"}
                        {displayJury2 &&
                          team.records[1]?.juryName &&
                          ` (${team.records[1]?.juryName})`}
                      </td>
                      {showDetailedColumns && (
                        <td className="border px-1 py-1 text-xs lg:text-md md:px-4 md:py-2">
                          {/* Render detailed scores here */}
                          {showDetailedColumns && (
                          <td className=" px-1 py-1 text-xs lg:text-md md:px-2 md:py-2">
                              {team.records[1]?.scores && (
                                <ul>
                                  {Object.entries(team.records[1].scores).map(([metric, score]) => (
                                    <li key={metric}>
                                      {metric}: {score}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          )}
                        </td>
                      )}
                      <td className="border px-1 py1 text-xs lg:text-nd md:px-4 md:py-2">
                        {calculateTotalScore(team)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
