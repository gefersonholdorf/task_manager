import { AddMemberController } from "@/controllers/team-members/add-member";
import { FetchMembersByTeamIdController } from "@/controllers/team-members/fetch-members-by-team-id";
import { RemoveMemberController } from "@/controllers/team-members/remove-member";
import { prisma } from "@/database/prisma/client";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { isAuthorized } from "@/middlewares/isAuthorized";
import type { FastifyInstance } from "fastify";
import z from "zod";

export async function teamMembersRoutes(app: FastifyInstance) {
	const addMemberController = new AddMemberController(prisma);
	const removeMemberController = new RemoveMemberController(prisma);
	const fetchMembersByTeamIdController = new FetchMembersByTeamIdController(
		prisma,
	);

	app.post(
		"/teams/:teamId/members/:memberId",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Teams"],
				summary: "Add Team Members",
				response: {
					204: z.object(),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		addMemberController.handle.bind(addMemberController),
	);

	app.get(
		"/teams/:id/members",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin", "member"])],
			schema: {
				tags: ["Teams"],
				summary: "Fetch Team Members",
				response: {
					200: z.object({
						teamId: z.number(),
						members: z.array(
							z.object({
								id: z.number(),
								name: z.string(),
								email: z.email(),
								createdAt: z.date(),
							}),
						),
					}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		fetchMembersByTeamIdController.handle.bind(fetchMembersByTeamIdController),
	);

	app.delete(
		"/teams/:teamId/members/:memberId",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Teams"],
				summary: "Delete Team Member by ID",
				response: {
					204: z.object({}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		removeMemberController.handle.bind(removeMemberController),
	);
}
