import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";

const UserCreator = () => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("user.create", {
    onSuccess: () => {
      client.invalidateQueries(["user.get-all-users"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });
  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          mutate({ name: event.currentTarget.value });
          event.currentTarget.value = "";
        }
      }}
    ></input>
  );
};

const Users = () => {
  const { data, isLoading } = trpc.useQuery(["user.get-all-users"]);

  if (isLoading || !data) return <div>Loading ....</div>;

  return (
    <>
      {data.map((user) => {
        return <div>{user.name}</div>;
      })}
      <UserCreator />
    </>
  );
};

export default Users;
