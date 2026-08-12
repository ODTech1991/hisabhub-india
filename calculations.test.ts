import { describe, expect, it } from "vitest";
import { gstExclusive, gstInclusive, emi, sip, profitMargin } from "./calculations";

describe("HisabHub calculation engine", () => {
  it("calculates exclusive GST", () => {
    const r = gstExclusive(10000,18);
    expect(r.gst).toBe(1800);
    expect(r.total).toBe(11800);
  });
  it("reverses inclusive GST", () => {
    const r = gstInclusive(11800,18);
    expect(r.taxable).toBeCloseTo(10000,8);
    expect(r.gst).toBeCloseTo(1800,8);
  });
  it("calculates EMI", () => {
    const r = emi(1000000,8.5,60);
    expect(r.emi).toBeGreaterThan(20000);
    expect(r.emi).toBeLessThan(21000);
  });
  it("calculates SIP", () => {
    const r = sip(5000,12,10);
    expect(r.invested).toBe(600000);
    expect(r.maturity).toBeGreaterThan(r.invested);
  });
  it("calculates profit margin", () => {
    const r = profitMargin(100,125);
    expect(r.profit).toBe(25);
    expect(r.margin).toBe(20);
    expect(r.markup).toBe(25);
  });
});