import { app } from "@/server";
import supertest from "supertest";

describe("Create Team Controller", () => {
	let token: string;
	beforeAll(async () => {
		const result = await supertest(app.server).post("/login").send({
			email: "john@gmail.com",
			password: "123456",
		});

		token = result.body.token;
	});

	it("should create a new team.", async () => {
		const result = await supertest(app.server)
			.post("/teams")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Time de Desenvolvimento",
				description: "Equipe de desenvolvimento",
			});

		expect(result.statusCode).toEqual(201);
		expect(result.body).toHaveProperty("teamId");
	});

	it("should fail to create a team with invalid login credentials", async () => {
		const resultLogin = await supertest(app.server).post("/login").send({
			email: "john@gmail.com",
			password: "1234567",
		});

		const token = resultLogin.body.token;

		const result = await supertest(app.server)
			.post("/teams")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Time de Desenvolvimento",
				description: "Equipe de desenvolvimento",
			});

		expect(result.statusCode).toEqual(401);
	});

	it("should fail to create a team when a member user tries.", async () => {
		const resultLogin = await supertest(app.server).post("/login").send({
			email: "jose@gmail.com",
			password: "123456",
		});

		const token = resultLogin.body.token;

		const result = await supertest(app.server)
			.post("/teams")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Time de Desenvolvimento",
				description: "Equipe de desenvolvimento",
			});

		expect(result.statusCode).toEqual(403);
	});
});
