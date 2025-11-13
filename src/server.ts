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
import { route } from "./routes/route";

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

app.register(route);

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
	console.log(`Application running on port ${port}!`);
});
