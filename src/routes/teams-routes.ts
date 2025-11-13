import { LoginController } from "@/controllers/auth/login";
import { prisma } from "@/database/prisma/client";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export async function authRoutes(app: FastifyInstance) {
	const loginController = new LoginController(prisma, app);

	app.post(
		"/login",
		{
			schema: {
				summary: "Login",
				body: loginSchema,
				response: {
					200: z.object({
						token: z.string(),
					}),
					401: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		loginController.handle.bind(loginController),
	);
}
