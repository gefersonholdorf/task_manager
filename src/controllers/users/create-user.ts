import type { FastifyReply, FastifyRequest } from "fastify";

export class CreateUserController {
	async handle(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(200).send({
			message: "Ok",
		});
	}
}
