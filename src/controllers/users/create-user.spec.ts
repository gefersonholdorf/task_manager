import { app } from "@/server";
import supertest from "supertest";

describe("Create User Controller", () => {
	it("should create a new user.", async () => {
		const result = await supertest(app.server).post("/users").send({
			name: "Fabio Doe",
			email: "fabio@gmail.com",
			password: "123456",
			role: "admin",
		});

		expect(result.statusCode).toEqual(201);
		expect(result.body).toHaveProperty("userId");
	});

	it("should not create a user with an existing email.", async () => {
		const result = await supertest(app.server).post("/users").send({
			name: "John Doe",
			email: "john@gmail.com",
			password: "123456",
			role: "admin",
		});

		expect(result.statusCode).toEqual(409);
	});
});
