import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import Link from "next/link";
import Router from "next/router";

const IssueCreator = () => {
  const { mutate, isLoading } = trpc.useMutation("issue.create-issue", {
    onSuccess: () => {
      Router.push("/my-issues");
    },
  });
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
  return (
    <input
      disabled={isLoading}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          mutate({ title: event.currentTarget.value, userId });
          event.currentTarget.value = "";
        }
      }}
    ></input>
  );
};

export default IssueCreator;
