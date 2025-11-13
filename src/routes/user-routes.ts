import { CreateUserController } from "@/controllers/users/create-user";
import { prisma } from "@/database/prisma/client";
import type { FastifyInstance } from "fastify";
import z from "zod/v4";

export const createUserSchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string(),
	role: z.enum(["admin", "member"]),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;

export async function userRoutes(app: FastifyInstance) {
	const createUserController = new CreateUserController(prisma);

	app.post(
		"/users",
		{
			schema: {
				summary: "Create User",
				body: createUserSchema,
				response: {
					201: z.object({
						userId: z.number(),
					}),
					409: z.object({
						message: z.string(),
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
