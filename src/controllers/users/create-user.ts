import type { CreateUserBody } from "@/routes/user-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";

export class CreateUserController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(
		request: FastifyRequest<{ Body: CreateUserBody }>,
		reply: FastifyReply,
	) {
		const { email, name, password, role } = request.body;

		try {
			const existingUserWithEmail = await this.prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (existingUserWithEmail) {
				return reply.status(409).send({
					message: "User already exists.",
				});
			}

			const passwordHashed = await bcrypt.hash(password, 6);

			const newUser = await this.prisma.user.create({
				data: {
					email,
					name,
					password: passwordHashed,
					role,
				},
			});

			return reply.status(201).send({
				userId: newUser.id,
			});
		} catch (error) {
			console.error(error);
			return reply.status(500).send({
				message: `Internal error. ${error}`,
			});
		}
	}
}
