import { AssignTaskToAUserController } from "@/controllers/tasks/assign-task-to-a-user";
import { CreateTaskController } from "@/controllers/tasks/create-task";
import { DeleteTaskByIdController } from "@/controllers/tasks/delete-task-by-id";
import { FetchTasksController } from "@/controllers/tasks/fetch-tasks";
import { GetHistoryByTaskIdController } from "@/controllers/tasks/get-history-by-task-id";
import { UpdateTaskByIdController } from "@/controllers/tasks/update-task-by-id";
import { prisma } from "@/database/prisma/client";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { isAuthorized } from "@/middlewares/isAuthorized";
import type { FastifyInstance } from "fastify";
import z from "zod";

export const createTaskSchema = z.object({
	title: z.string().min(3, "Minimum of 3 characters."),
	description: z.string().min(3, "Minimum of 3 characters."),
	priority: z.enum(["high", "medium", "low"]),
	teamId: z.number(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
	title: z.string().min(3, "Minimum of 3 characters."),
	description: z.string().min(3, "Minimum of 3 characters."),
	status: z.enum(["pending", "in_progress", "completed"]),
	priority: z.enum(["high", "medium", "low"]),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export async function taskRoutes(app: FastifyInstance) {
	const createTaskController = new CreateTaskController(prisma);
	const fetchTasksController = new FetchTasksController(prisma);
	const updateTaskByIdController = new UpdateTaskByIdController(prisma);
	const deleteTaskByIdController = new DeleteTaskByIdController(prisma);
	const assignTaskToAUserController = new AssignTaskToAUserController(prisma);
	const getHistoryByTaskIdController = new GetHistoryByTaskIdController(prisma);

	app.post(
		"/tasks",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Tasks"],
				summary: "Create Task",
				body: createTaskSchema,
				response: {
					201: z.object({
						taskId: z.number(),
					}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		createTaskController.handle.bind(createTaskController),
	);

	app.get(
		"/tasks",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin", "member"])],
			schema: {
				tags: ["Tasks"],
				summary: "Fetch Tasks",
				response: {
					200: z.object({
						tasks: z.array(
							z.object({
								id: z.number(),
								title: z.string(),
								description: z.string(),
								status: z.string(),
								priority: z.string(),
								createdAt: z.date(),
								updatedAt: z.date(),
								assignee: z.string().nullable(),
								team: z.string(),
							}),
						),
					}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		fetchTasksController.handle.bind(fetchTasksController),
	);

	app.get(
		"/tasks/:id/history",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin", "member"])],
			schema: {
				tags: ["Tasks"],
				summary: "Get History By Task Id",
				response: {
					200: z.object({
						history: z.array(
							z.object({
								id: z.number(),
								taskId: z.number(),
								changedBy: z.number(),
								oldStatus: z.string(),
								newStatus: z.string(),
								changedAt: z.date(),
							}),
						),
					}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		getHistoryByTaskIdController.handle.bind(getHistoryByTaskIdController),
	);

	app.put(
		"/tasks/:id",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin", "member"])],
			schema: {
				tags: ["Tasks"],
				summary: "Update Task by Id",
				body: updateTaskSchema,
				response: {
					204: z.object({}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		updateTaskByIdController.handle.bind(updateTaskByIdController),
	);

	app.put(
		"/tasks/:taskId/assign/:userId",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin", "member"])],
			schema: {
				tags: ["Tasks"],
				summary: "Assign Task to a User",
				response: {
					200: z.object({
						message: z.string(),
					}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		assignTaskToAUserController.handle.bind(assignTaskToAUserController),
	);

	app.delete(
		"/tasks/:id",
		{
			preHandler: [isAuthenticated(app), isAuthorized(["admin"])],
			schema: {
				tags: ["Tasks"],
				summary: "Delete Task by Id",
				response: {
					204: z.object({}),
					401: z.object({
						message: z.string(),
					}),
					403: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		deleteTaskByIdController.handle.bind(deleteTaskByIdController),
	);
}
