import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class FetchMembersByTeamIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as {
			id: number;
		};

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

			const members = await this.prisma.teamMember.findMany({
				where: {
					teamId: Number(id),
				},
				include: {
					user: true,
				},
			});

			const membersFormatted = members.map((member) => {
				return {
					id: member.id,
					name: member.user.name,
					email: member.user.email,
					createdAt: member.createdAt,
				};
			});

			return reply.status(200).send({
				teamId: Number(id),
				members: membersFormatted,
			});
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
