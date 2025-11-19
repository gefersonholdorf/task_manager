import { prisma } from "@/database/prisma/client";
import type { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

export async function userSeed(prisma: PrismaClient) {
	await prisma.user.createMany({
		data: [
			{
				name: "John Albert",
				email: "john@gmail.com",
				password: hashSync("123456"),
				role: "admin",
			},
			{
				name: "José Talles",
				email: "jose@gmail.com",
				password: hashSync("123456"),
				role: "member",
			},
		],
	});
}

userSeed(prisma);
