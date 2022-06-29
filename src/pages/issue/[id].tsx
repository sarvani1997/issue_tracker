import { PollQuestion, Prisma, Vote } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Issue = () => {
	const { query } = useRouter();
	const { id } = query;

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

	if (issueLoading || !issue) return <div>Loading ....</div>;
	if (commentLoading || !comments) return <div>Loading ....</div>;

	return (
		<div>
			{issue.map((i) => {
				return (
					<div>
						<h3>{i.title}</h3>
					</div>
				);
			})}
		</div>
	);
};

export default Issue;
