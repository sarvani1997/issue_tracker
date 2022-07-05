import { useRef } from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const UserCreator = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("user.create-user", {
    onSuccess: () => {
      client.invalidateQueries(["user.get-all-users"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });
  return (
    <div>
      <input
        ref={inputRef}
        disabled={isLoading}
        className="input input-bordered w-full rounded-md p-3"
        placeholder="To create user enter your name here..."
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            mutate({ name: event.currentTarget.value });
            event.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

const Users = () => {
  const { data, isLoading } = trpc.useQuery(["user.get-all-users"]);

  if (isLoading || !data) return <div>Loading ....</div>;

  return (
    <div className="bg-zinc-200 flex flex-col p-6 min-h-screen">
      <h1 className="text-2xl text-blue-600 font-bold">Select User</h1>
      <ul role="list" className="p-6 divide-y divide-slate-200">
        {data.map((user) => {
          return (
            <li key={user.id} className="flex py-1 first:pt-0 last:pb-0">
              <Link href={`/all-issues`}>
                <button
                  className="font-medium text-slate-900 hover:text-sky-700 font"
                  onClick={() => localStorage.setItem("user", user.id)}
                >
                  {user.name}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
      <UserCreator />
    </div>
  );
};

export default Users;
