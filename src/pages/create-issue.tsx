import { trpc } from "../utils/trpc";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const IssueCreator = () => {
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate, isLoading } = trpc.useMutation("issue.create-issue", {
    onSuccess: () => {
      Router.push("/my-issues");
    },
  });

  const onSubmit = (data) => {
    mutate({ title: data.title, userId, description: data.description });
  };

  return (
    <div className="bg-zinc-200 flex flex-col p-6 min-h-screen">
      <h1 className="text-2xl text-blue-600 font-bold mb-6">Create an Issue</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          disabled={isLoading}
          className="input input-bordered w-full rounded-md p-3 mb-6"
          placeholder="Title"
          {...register("title", { required: true })}
        ></input>
        <textarea
          className="input input-bordered w-full rounded-md p-3 mb-6"
          placeholder="add description"
          rows="5"
          {...register("description", { required: true })}
        ></textarea>
        <button
          className="outline text-blue-600 outline-offset-2 outline-blue-600 rounded-md px-4 hover:bg-blue-600 hover:text-white"
          type="submit"
        >
          Create an issue
        </button>
      </form>
    </div>
  );
};

export default IssueCreator;
