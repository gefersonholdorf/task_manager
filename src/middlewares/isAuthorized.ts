import type { FastifyReply, FastifyRequest } from "fastify";

export function isAuthorized(roles: string[]) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.profile;

		if (!role) {
			return reply.status(401).send({
				message: "Token invalid.",
			});
		}

		if (!roles.includes(role)) {
			return reply.status(403).send({
				message: "You do not have permission.",
			});
		}

		return;
	};
}
