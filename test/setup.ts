import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { app } from "@/server";

const prisma = new PrismaClient();

beforeEach(async () => {
	await prisma.$connect();
});

beforeAll(async () => {
	console.log("[SETUP] Ambiente de testes iniciado.");
	await app.ready();
});

afterAll(async () => {
	await prisma.$disconnect();
	await app.close();
	console.log("[TEARDOWN] Conexão fechada.");
});
