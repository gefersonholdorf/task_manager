import z from "zod/v4";

const envSchema = z.object({
	API_KEY: z.string(),
	PORT: z.coerce.number(),
});

export const env = envSchema.parse(process.env);
