import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import Router from "next/router";
import Link from "next/link";

const Issues = () => {
  const { data, isLoading } = trpc.useQuery(["issue.get-all-issues"]);
  const { data: userData, isLoading: userLoading } = trpc.useQuery([
    "user.get-all-users",
  ]);
  if (isLoading || !data) return <div>Loading ....</div>;
  if (userLoading || !userData) return <div>Loading ....</div>;

  let user = localStorage.getItem("user");
  if (!user) {
    Router.push("/");
  }

  return (
    <>
      <Link href="my-issues">
        <button>My Issues</button>
      </Link>
      <Link href="create-issues">
        <button>Create Issues</button>
      </Link>
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

export default Issues;
