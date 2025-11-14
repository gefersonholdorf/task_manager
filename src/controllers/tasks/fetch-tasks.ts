import type { PrismaClient, Task, User, Team } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

type TaskWithRelations = Task & {
	assignee: User | null;
	team: Team;
};

export function TaskDTO(tasks: TaskWithRelations[]) {
	return tasks.map((task) => ({
		id: task.id,
		title: task.title,
		description: task.description,
		status: task.status,
		priority: task.priority,
		createdAt: task.createdAt,
		updatedAt: task.updatedAt,
		assignee: task.assignee ? task.assignee.name : null,
		team: task.team.name,
	}));
}

export class FetchTasksController {
	constructor(private readonly prisma: PrismaClient) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		const { id, role } = request.profile;

		try {
			if (role === "member") {
				const tasks = await this.prisma.task.findMany({
					where: {
						assignedTo: id,
					},
					include: {
						assignee: true,
						team: true,
					},
				});

				const formatted = TaskDTO(tasks);

				return reply.status(200).send({ tasks: formatted });
			}

			const tasks = await this.prisma.task.findMany({
				include: {
					assignee: true,
					team: true,
				},
			});

			const formatted = TaskDTO(tasks);

			return reply.status(200).send({ tasks: formatted });
		} catch (error) {
			console.log(error);
			return reply.status(500).send({
				message: "Internal server error.",
			});
		}
	}
}
