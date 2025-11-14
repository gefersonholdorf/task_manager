import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	jsonSchemaTransformObject,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env";
import fastifyApiReference from "@scalar/fastify-api-reference";
import { userRoutes } from "./routes/user-routes";
import { authRoutes } from "./routes/auth-routes";
import fastifyJwt from "@fastify/jwt";
import { teamRoutes } from "./routes/teams-routes";
import { teamMembersRoutes } from "./routes/team-members-routes";
import { taskRoutes } from "./routes/task-routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "*",
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		openapi: "3.0.0",
		info: {
			title: "Task Manager",
			description: "Official documentation for the Task Manager application.",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter your token.",
				},
			},
		},
		security: [],
	},
	transform: jsonSchemaTransform,
	transformObject: jsonSchemaTransformObject,
});

app.register(fastifyApiReference, {
	routePrefix: "/docs",
});

app.register(fastifyJwt, {
	secret: env.API_KEY,
});

app.register(userRoutes);
app.register(authRoutes);
app.register(teamRoutes);
app.register(teamMembersRoutes);
app.register(taskRoutes);

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
	console.log(`Application running on port ${port}!`);
});
