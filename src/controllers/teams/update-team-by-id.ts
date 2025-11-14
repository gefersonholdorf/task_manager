import type { UpdateTeamSchema } from "@/routes/teams-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class UpdateTeamByIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { name, description } = request.body as UpdateTeamSchema;
		const { id } = request.params as { id: number };

		try {
			const team = await this.prisma.team.findUnique({
				where: {
					id: Number(id),
				},
			});

			if (!team) {
				return reply.status(404).send({
					message: "Team not found.",
				});
			}

			await this.prisma.team.update({
				where: {
					id: Number(id),
				},
				data: {
					name,
					description,
				},
			});

			return reply.status(204).send();
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
