import type { PrismaClient, Task, TaskHistory } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

type TaskWithRelations = TaskHistory & {
	task: Task | null;
};

export function TaskHistoryDTO(tasks: TaskWithRelations[]) {
	return tasks.map((task) => ({
		id: task.id,
		taskId: task.taskId,
		changedBy: task.changedBy,
		oldStatus: task.oldStatus,
		newStatus: task.newStatus,
		changedAt: task.changedAt,
	}));
}

export class GetHistoryByTaskIdController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
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
				const tasks = await this.prisma.taskHistory.findMany({
					where: {
						taskId: Number(id),
						task: {
							assignedTo: userId,
						},
					},
					include: {
						task: true,
					},
				});

				const formatted = TaskHistoryDTO(tasks);

				return reply.status(200).send({ history: formatted });
			}

			const tasks = await this.prisma.taskHistory.findMany({
				where: {
					taskId: Number(id),
				},
				include: {
					task: true,
				},
			});

			const formatted = TaskHistoryDTO(tasks);

			return reply.status(200).send({ history: formatted });
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
