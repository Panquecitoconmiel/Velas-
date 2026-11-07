import { describe, expect, it } from "vitest";
import { resolveSeason } from "./seasons";

describe("resolveSeason", () => {
  it("usa la temporada que eligió la administradora", () => {
    expect(resolveSeason("NAVIDAD")).toBe("NAVIDAD");
    expect(resolveSeason("MUERTOS")).toBe("MUERTOS");
    expect(resolveSeason("AMOR")).toBe("AMOR");
  });
  it("sin elección, o con un valor antiguo, usa la paleta base", () => {
    expect(resolveSeason(undefined)).toBe("BASE");
    expect(resolveSeason("AUTO")).toBe("BASE");
    expect(resolveSeason("HALLOWEEN")).toBe("BASE");
  });
});
