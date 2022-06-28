import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import Link from "next/link";

const UserCreator = () => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("user.create-user", {
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
        return (
          <div key={user.id}>
            <Link href={`/all-issues`}>
              <button onClick={() => localStorage.setItem("user", user.id)}>
                {user.name}
              </button>
            </Link>
          </div>
        );
      })}
      <UserCreator />
    </>
  );
};

export default Users;
