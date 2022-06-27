import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["git.get-all-users"]);

  if (isLoading || !data) return <div>Loading ....</div>;

  return (
    <>
      {data.map((user) => {
        return <div>{user.name}</div>;
      })}
    </>
  );
};

export default Home;
