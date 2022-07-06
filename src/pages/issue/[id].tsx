import { useState, useEffect, useRef, FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Router from "next/router";

const CommentCreator: FC<{ id: any; userId: any }> = ({ id, userId }) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const client = trpc.useContext();
	const { mutate, isLoading } = trpc.useMutation("comment.create-comment", {
		onSuccess: () => {
			client.invalidateQueries([
				"comment.get-all-comments",
				{ issueId: id },
			]);
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
				placeholder="Write a comment..."
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						mutate({
							comment: event.currentTarget.value,
							issueId: id,
							userId,
						});
						event.currentTarget.value = "";
					}
				}}
			/>
		</div>
	);
};

const Issue = () => {
	const { query } = useRouter();
	const { id } = query;

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

	if (!id || typeof id !== "string") {
		return <div>No ID</div>;
	}

	const { data: issue, isLoading: issueLoading } = trpc.useQuery([
		"issue.get-issue",
		{ id },
	]);
	const { data: comments, isLoading: commentLoading } = trpc.useQuery([
		"comment.get-all-comments",
		{ issueId: id },
	]);
	const { data: userData, isLoading: userLoading } = trpc.useQuery([
		"user.get-all-users",
	]);
	if (userLoading || !userData) return <div>Loading ....</div>;

	if (issueLoading || !issue) return <div>Loading ....</div>;
	if (commentLoading || !comments) return <div>Loading ....</div>;

	return (
		<div className="bg-zinc-200 flex flex-col p-6 min-h-screen">
			<div className="flex justify-between">
				<h1 className="text-2xl text-blue-600 font-bold">Issue</h1>
				<div>
					<Link href="/all-issues">
						<button className="font-medium text-slate-900 hover:text-sky-700 font">
							All Issues
						</button>
					</Link>
					<Link href="/my-issues">
						<button className="font-medium text-slate-900 hover:text-sky-700 font px-3">
							My Issues
						</button>
					</Link>
				</div>
			</div>
			<h1 className="text-2xl font-bold px-6 my-6">{issue[0]?.title}</h1>
			<p className="bg-white p-3 rounded-md my-6">
				{issue[0]?.description}
			</p>
			<ul role="list" className="divide-y divide-slate-200">
				{comments.map((comment) => {
					let userName = userData.find(
						(user) => user.id === comment.userId
					)?.name;
					return (
						<li key={comment.id} className="flex flex-col my-3">
							<div className="bg-white p-3 rounded-md">
								{comment?.comment}
							</div>
							<span>by {userName}</span>
						</li>
					);
				})}
			</ul>
			<CommentCreator id={id} userId={userId} />
		</div>
	);
};

export default Issue;
