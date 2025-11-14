import type { UpdateTaskSchema } from "@/routes/task-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class UpdateTaskByIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { title, description, priority, status } =
			request.body as UpdateTaskSchema;

		const { id } = request.params as { id: number };

		const { role, id: userId } = request.profile;

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

			if (role === "member") {
				if (task.assignedTo && task.assignedTo === userId) {
					await this.prisma.task.update({
						data: {
							title,
							description,
							priority,
							status,
						},
						where: {
							id: Number(id),
						},
					});

					return reply.status(204).send();
				}

				return reply.status(403).send({
					message: "You do not have permission.",
				});
			}

			await this.prisma.task.update({
				data: {
					title,
					description,
					priority,
					status,
				},
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
