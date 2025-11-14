import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class AssignTaskToAUserController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { taskId, userId } = request.params as {
			taskId: number;
			userId: number;
		};

		try {
			const task = await this.prisma.task.findUnique({
				where: {
					id: Number(taskId),
				},
			});

			if (!task) {
				return reply.status(404).send({
					message: "Task not found.",
				});
			}

			const user = await this.prisma.user.findUnique({
				where: {
					id: Number(userId),
				},
			});

			if (!user) {
				return reply.status(404).send({
					message: "User not found.",
				});
			}

			await this.prisma.task.update({
				where: {
					id: Number(taskId),
				},
				data: {
					...task,
					assignedTo: Number(userId),
				},
			});

			return reply.status(200).send({
				message: "Task assigned successfully.",
			});
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
