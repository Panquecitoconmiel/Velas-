import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/config/prisma.js";
import { app, createUser, login, resetDb } from "./helpers.js";

beforeEach(async () => {
  await resetDb();
});

describe("temporada del sitio", () => {
  it("solo la administradora la cambia y la tienda la publica", async () => {
    await createUser("cliente@example.com");
    await createUser("admin@example.com", "ADMIN");
    const customer = await login("cliente@example.com");
    expect((await request(app).put("/api/v1/admin/settings/season").send({ season: "NAVIDAD" })).status).toBe(401);
    expect((await customer.put("/api/v1/admin/settings/season").send({ season: "NAVIDAD" })).status).toBe(403);

    const admin = await login("admin@example.com");
    const ok = await admin.put("/api/v1/admin/settings/season").send({ season: "MUERTOS" });
    expect(ok.status).toBe(200);
    expect((await request(app).get("/api/v1/store")).body.settings.season).toBe("MUERTOS");
    expect(await prisma.auditLog.count({ where: { action: "settings.season" } })).toBe(1);
  });

  it("rechaza temporadas que no existen", async () => {
    await createUser("admin@example.com", "ADMIN");
    const admin = await login("admin@example.com");
    expect((await admin.put("/api/v1/admin/settings/season").send({ season: "HALLOWEEN" })).status).toBe(400);
    expect((await admin.put("/api/v1/admin/settings/season").send({ season: "NAVIDAD", storeName: "X" })).status).toBe(400);
  });
});
