import { faker } from "@faker-js/faker";
import supertest from "supertest";

import app from "./../app.js";
import { prisma } from "../database.js";

import { deleteAllData } from "./factories/scenarioFactory.js";

const agent = supertest(app);

beforeEach(async () => {
	await deleteAllData();
});

describe("recommendations tests", () => {
	it("should create rocommendaion", async () => {
		const recommendation = {
			name: faker.name.findName(),
			youtubeLink: "https://www.youtube.com/watch?v=dGMB7oeIbqw",
		};

		await agent.post("/recommendations").send(recommendation);

		const recommendationCreated = await prisma.recommendation.findFirst({
			where: {
				name: recommendation.name,
			},
		});

		expect(recommendationCreated).not.toBeNull();
	});

	it("given an invalid req.body it should return status 422", async () => {
		const recommendation = {};

		const response = await agent.post("/recommendations").send(recommendation);

		expect(response.status).toEqual(422);
	});
});

afterAll(async () => {
	await prisma.$disconnect();
});
