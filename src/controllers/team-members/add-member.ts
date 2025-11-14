import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class AddMemberController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { teamId, memberId } = request.params as {
			teamId: number;
			memberId: number;
		};

		try {
			const team = await this.prisma.team.findUnique({
				where: {
					id: Number(teamId),
				},
			});

			if (!team) {
				return reply.status(404).send({
					message: "Team not found.",
				});
			}

			const user = await this.prisma.user.findUnique({
				where: {
					id: Number(memberId),
				},
			});

			if (!user) {
				return reply.status(404).send({
					message: "User not found.",
				});
			}

			await this.prisma.teamMember.create({
				data: {
					teamId: Number(teamId),
					userId: Number(memberId),
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
