import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class DeleteTaskByIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: number };

		try {
			const task = await this.prisma.task.findUnique({
				where: {
					id: Number(id),
				},
			});

			if (!task) {
				return reply.status(404).send({
					message: "Task not found.",
				});
			}

			await this.prisma.task.delete({
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
