import { app } from "@/server";
import supertest from "supertest";

describe("Fetch Teams Controller", () => {
	let token: string;
	let teamId: number;

	beforeAll(async () => {
		const resultLogin = await supertest(app.server).post("/login").send({
			email: "john@gmail.com",
			password: "123456",
		});

		token = resultLogin.body.token;

		const resultCreateTeam = await supertest(app.server)
			.post("/teams")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Time de Desenvolvimento",
				description: "Equipe de desenvolvimento",
			});

		teamId = resultCreateTeam.body.teamId;
	});

	it("should fetch teams.", async () => {
		const result = await supertest(app.server)
			.get("/teams")
			.set("Authorization", `Bearer ${token}`);

		expect(result.statusCode).toEqual(200);
		expect(result.body.teams.length).toBeGreaterThan(0);
	});

	it("should fail to fetch a teams with invalid login credentials", async () => {
		const resultLogin = await supertest(app.server).post("/login").send({
			email: "john@gmail.com",
			password: "1234567",
		});

		const token = resultLogin.body.token;

		const result = await supertest(app.server)
			.delete(`/teams/${teamId}`)
			.set("Authorization", `Bearer ${token}`);

		expect(result.statusCode).toEqual(401);
	});

	it("should fail to fetch a teams when a member user tries.", async () => {
		const resultLogin = await supertest(app.server).post("/login").send({
			email: "jose@gmail.com",
			password: "123456",
		});

		const token = resultLogin.body.token;

		const result = await supertest(app.server)
			.get("/teams")
			.set("Authorization", `Bearer ${token}`);

		expect(result.statusCode).toEqual(403);
	});
});
