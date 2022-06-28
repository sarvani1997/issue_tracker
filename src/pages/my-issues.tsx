import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import Router from "next/router";
import Link from "next/link";

const MyIssues = () => {
  let [userId] = React.useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("user");
    }
  });

  React.useEffect(() => {
    if (!userId) {
      Router.push("/");
    }
  });

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
    <>
      {data.map((issue) => {
        let userName = userData.find((user) => user.id === issue.userId)?.name;

        return (
          <div key={issue.id}>
            <Link href={`/issue/${issue.id}`}>
              <a>{issue.title}</a>
            </Link>
            <span>Created by {userName}</span>
          </div>
        );
      })}
    </>
  );
};

export default MyIssues;
