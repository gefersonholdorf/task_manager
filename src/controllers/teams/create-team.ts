import type { CreateTeamSchema } from "@/routes/teams-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class CreateTeamController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { name, description } = request.body as CreateTeamSchema;
		const { id } = request.profile;

		try {
			const newTeam = await this.prisma.team.create({
				data: {
					name,
					description,
				},
			});

			await this.prisma.teamMember.create({
				data: {
					teamId: newTeam.id,
					userId: id,
				},
			});

			return reply.status(201).send({
				teamId: newTeam.id,
			});
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
