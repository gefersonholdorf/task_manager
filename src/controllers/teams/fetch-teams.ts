/** biome-ignore-all lint/suspicious/noExplicitAny: <"explanation"> */
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply } from "fastify";

export class FetchTeamsController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(_: any, reply: FastifyReply) {
		try {
			const teams = await this.prisma.team.findMany();

			return reply.status(200).send({
				teams,
			});
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
