import { app } from "@/server";
import supertest from "supertest";

describe("Login Controller", () => {
	it("should login an existing user.", async () => {
		const result = await supertest(app.server).post("/login").send({
			email: "john@gmail.com",
			password: "123456",
		});

		expect(result.statusCode).toEqual(200);
		expect(result.body).toHaveProperty("token");
	});

	it("should return 401 when email does not exist", async () => {
		const result = await supertest(app.server).post("/login").send({
			email: "johnn@gmail.com",
			password: "123456",
		});

		expect(result.statusCode).toEqual(401);
	});

	it("should return 401 when password is incorrect", async () => {
		const result = await supertest(app.server).post("/login").send({
			email: "johnn@gmail.com",
			password: "12345678",
		});

		expect(result.statusCode).toEqual(401);
	});
});
