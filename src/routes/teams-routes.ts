import { CreateTeamController } from "@/controllers/teams/create-team";
import { DeleteTeamByIdController } from "@/controllers/teams/delete-team-by-id";
import { FetchTeamsController } from "@/controllers/teams/fetch-teams";
import { UpdateTeamByIdController } from "@/controllers/teams/update-team-by-id";
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

export const updateTeamSchema = z.object({
	name: z.string().min(3, "Minimum of 3 characters."),
	description: z.string().min(3, "Minimum of 3 characters."),
});

export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;

export async function teamRoutes(app: FastifyInstance) {
	const createTeamController = new CreateTeamController(prisma);
	const fetchTeamsController = new FetchTeamsController(prisma);
	const updateTeamByIdController = new UpdateTeamByIdController(prisma);
	const deleteTeamByIdController = new DeleteTeamByIdController(prisma);

	app.post(
		"/teams",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Teams"],
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
				tags: ["Teams"],
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

	app.put(
		"/teams/:id",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Teams"],
				summary: "Update Team by Id",
				body: updateTeamSchema,
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
		updateTeamByIdController.handle.bind(updateTeamByIdController),
	);

	app.delete(
		"/teams/:id",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Teams"],
				summary: "Delete Team by Id",
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
		deleteTeamByIdController.handle.bind(deleteTeamByIdController),
	);
}
