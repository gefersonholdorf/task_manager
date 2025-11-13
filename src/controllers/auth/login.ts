import type { LoginSchema } from "@/routes/auth-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";

export class LoginController {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly app: FastifyInstance,
	) {}

	async handle(
		request: FastifyRequest<{ Body: LoginSchema }>,
		reply: FastifyReply,
	) {
		const { email, password } = request.body;

		try {
			const existingUserByEmail = await this.prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!existingUserByEmail) {
				return reply.status(401).send({
					message: "Credentials invalid.",
				});
			}

			const isPasswordValid = await bcrypt.compare(
				password,
				existingUserByEmail.password,
			);

			if (!isPasswordValid) {
				return reply.status(401).send({
					message: "Credentials invalid.",
				});
			}

			const token = await this.app.jwt.sign(
				{
					userId: existingUserByEmail.id,
					role: existingUserByEmail.role,
				},
				{
					expiresIn: "1d",
				},
			);

			return reply.status(200).send({
				token,
			});
		} catch (error) {
			console.error(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
