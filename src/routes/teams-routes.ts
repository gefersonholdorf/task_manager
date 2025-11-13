import { CreateTeamController } from "@/controllers/teams/create-team";
import { FetchTeamsController } from "@/controllers/teams/fetch-teams";
import { prisma } from "@/database/prisma/client";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { isAuthorized } from "@/middlewares/isAuthorized";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const createTeamSchema = z.object({
	name: z.string().min(3, "Minimum of 3 characters."),
	description: z.string().min(3, "Minimum of 3 characters."),
});

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;

export async function teamRoutes(app: FastifyInstance) {
	const createTeamController = new CreateTeamController(prisma);
	const fetchTeamsController = new FetchTeamsController(prisma);

	app.post(
		"/teams",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				summary: "Create Team",
				body: createTeamSchema,
				response: {
					201: z.object({
						teamId: z.number(),
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
		createTeamController.handle.bind(createTeamController),
	);

	app.get(
		"/teams",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				summary: "Fetch Teams",
				response: {
					200: z.object({
						teams: z.array(
							z.object({
								id: z.number(),
								name: z.string(),
								description: z.string(),
								createdAt: z.date(),
								updatedAt: z.date(),
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
		fetchTeamsController.handle.bind(fetchTeamsController),
	);
}
