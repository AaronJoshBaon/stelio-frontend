import { describe, it, expect } from "vitest";
import { nightsBetween } from "./date";

describe("nightsBetween", () => {
  it("counts nights within the same month", () => {
    expect(nightsBetween("2026-01-10", "2026-01-15")).toBe(5);
  });

  it("counts correctly across a month boundary (the payment bug)", () => {
    // Apr 28 -> May 2 is 4 nights. The old getDate() subtraction gave -26,
    // which zeroed the total via Math.max(0, price * nights).
    expect(nightsBetween("2026-04-28", "2026-05-02")).toBe(4);
  });

  it("counts correctly across a year boundary", () => {
    expect(nightsBetween("2025-12-30", "2026-01-02")).toBe(3);
  });

  it("returns 0 for a same-day range", () => {
    expect(nightsBetween("2026-03-01", "2026-03-01")).toBe(0);
  });

  it("returns 0 (never negative) for an inverted range", () => {
    expect(nightsBetween("2026-05-02", "2026-04-28")).toBe(0);
  });

  it("accepts Date objects", () => {
    expect(
      nightsBetween(new Date("2026-06-01"), new Date("2026-06-08")),
    ).toBe(7);
  });

  it("returns 0 for invalid input instead of NaN", () => {
    expect(nightsBetween("not-a-date", "2026-01-01")).toBe(0);
  });
});
