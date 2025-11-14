import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class DeleteTeamByIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
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

			await this.prisma.teamMember.deleteMany({
				where: {
					teamId: Number(id),
				},
			});

			await this.prisma.team.delete({
				where: {
					id: Number(id),
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
