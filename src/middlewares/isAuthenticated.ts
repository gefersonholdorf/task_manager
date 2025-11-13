import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function isAuthenticated(app: FastifyInstance) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			return reply.status(401).send({
				message: "Token not provided.",
			});
		}

		const [, token] = authHeader.split(" ");

		try {
			const decode = await app.jwt.verify(token);

			const { userId, role } = decode as {
				userId: number;
				role: "admin" | "member";
			};

			request.profile = {
				id: userId,
				role,
			};
		} catch (error) {
			console.log(error);
			return reply.status(401).send({
				message: "Token invalid.",
			});
		}
	};
}
