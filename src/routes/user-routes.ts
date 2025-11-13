import { CreateUserController } from "@/controllers/users/create-user";
import type { FastifyInstance } from "fastify";
import z from "zod/v4";

export async function userRoutes(app: FastifyInstance) {
	const createUserController = new CreateUserController();

	app.post(
		"/users",
		{
			schema: {
				summary: "Create User",
				body: z.object({
					name: z.string(),
					email: z.email(),
					password: z.string(),
				}),
				response: {
					201: z.object({
						userId: z.number(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		createUserController.handle.bind(createUserController),
	);
}
