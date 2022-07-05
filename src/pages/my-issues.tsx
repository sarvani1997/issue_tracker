import { trpc } from "../utils/trpc";
import Router from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";

const MyIssues = () => {
  let [userId] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("user");
    }
  });

  useEffect(() => {
    if (!userId) {
      Router.push("/");
    }
  }, []);

  const { data, isLoading } = trpc.useQuery([
    "issue.get-all-your-issues",
    {
      userId,
    },
  ]);
  const { data: userData, isLoading: userLoading } = trpc.useQuery([
    "user.get-all-users",
  ]);
  if (isLoading || !data) return <div>Loading ....</div>;
  if (userLoading || !userData) return <div>Loading ....</div>;

  console.log("userId", userId);

  return (
    <div className="bg-zinc-200 p-6 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl text-blue-600 font-bold">My Issues</h1>
        <div>
          <Link href="all-issues">
            <button className="font-medium text-slate-900 hover:text-sky-700 font">
              All Issues
            </button>
          </Link>
          <Link href="create-issue">
            <button className="font-medium text-slate-900 hover:text-sky-700 font px-3">
              Create Issues
            </button>
          </Link>
        </div>
      </div>
      <ul role="list" className="p-6 divide-y divide-slate-200">
        {data.map((issue) => {
          let userName = userData.find(
            (user) => user.id === issue.userId
          )?.name;

          return (
            <li className="flex flex-col bg-white p-4" key={issue.id}>
              <Link href={`/issue/${issue.id}`}>
                <a className="font-medium text-2xl text-slate-900 hover:text-sky-700 font">
                  {issue.title}
                </a>
              </Link>
              <span>Created by {userName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyIssues;
