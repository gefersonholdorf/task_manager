import type { CreateTaskSchema } from "@/routes/task-routes";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export class CreateTaskController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { title, description, priority, teamId } =
			request.body as CreateTaskSchema;

		try {
			const team = await this.prisma.team.findUnique({
				where: {
					id: teamId,
				},
			});

			if (!team) {
				return reply.status(404).send({
					message: "Team not found.",
				});
			}

			const newTask = await this.prisma.task.create({
				data: {
					title,
					description,
					priority,
					teamId,
				},
			});

			return reply.status(201).send({
				taskId: newTask.id,
			});
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
