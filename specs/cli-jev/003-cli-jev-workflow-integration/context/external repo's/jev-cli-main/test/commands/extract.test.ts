import { describe, expect, test } from "vitest";
import { extractFailed, findCandidates, parseFieldSpec, runExtract } from "../../src/core/extract.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, pick } from "../helpers/fake-ask.js";

describe("extract: core", () => {
  test("parseFieldSpec: builtin, custom regex, aliased builtin, errors", () => {
    expect(parseFieldSpec("email").name).toBe("email");
    const inv = parseFieldSpec("invoice=/INV-\\d+/:the invoice number");
    expect(inv.description).toBe("the invoice number");
    expect("INV-12".match(inv.pattern)?.[0]).toBe("INV-12");
    expect(parseFieldSpec("po=/PO\\d+/").description).toBe("the po");
    const sender = parseFieldSpec("sender=email:the sender's address");
    expect(sender.name).toBe("sender");
    expect(sender.description).toBe("the sender's address");
    expect(() => parseFieldSpec("bogus")).toThrow(/Unknown field/);
    expect(() => parseFieldSpec("x=/[/")).toThrow(/invalid regex/);
    expect(() => parseFieldSpec("x=nope")).toThrow(/not a builtin/);
    expect(() => parseFieldSpec("bad name=email")).toThrow(/Field name/);
  });

  test("number: a hyphen glued to a word is not a minus sign", () => {
    expect(findCandidates("Invoice INV-20931 total 12, balance -7", parseFieldSpec("number"))).toEqual([
      "20931",
      "12",
      "-7",
    ]);
  });

  test("findCandidates dedupes and keeps order", () => {
    expect(findCandidates("a@x.com b@y.org a@x.com", parseFieldSpec("email"))).toEqual([
      "a@x.com",
      "b@y.org",
    ]);
  });

  test("normalizers are deterministic and timezone-safe", () => {
    const text =
      "Total $1,250.00 due Sept 30, 2026 or 2026-10-01. Call +1 (555) 123-4567. 15% off. https://a.b/c.";
    expect(parseFieldSpec("amount").normalize!("$1,250.00")).toEqual({ value: 1250, currency: "USD" });
    expect(parseFieldSpec("amount").normalize!("40 EUR")).toEqual({ value: 40, currency: "EUR" });
    const date = parseFieldSpec("date");
    expect(findCandidates(text, date)).toEqual(["Sept 30, 2026", "2026-10-01"]);
    expect(date.normalize!("Sept 30, 2026")).toBe("2026-09-30");
    expect(date.normalize!("2026-10-01")).toBe("2026-10-01");
    expect(date.normalize!("3rd March 2026")).toBe("2026-03-03");
    expect(parseFieldSpec("phone").normalize!("+1 (555) 123-4567")).toBe("+15551234567");
    expect(parseFieldSpec("percent").normalize!("15%")).toBe(15);
    expect(parseFieldSpec("url").normalize!("https://a.b/c.")).toBe("https://a.b/c");
    expect(parseFieldSpec("number").normalize!("1,234.5")).toBe(1234.5);
  });

  test("runExtract selects, normalizes, and reports none / no-candidates", async () => {
    const text = "From billing@acme.com and ops@acme.com. Amount $20.";
    const { ask, calls } = fakeAsk({ sender: pick("c1", 0.9), amount: pick("none", 0.8) });
    const out = await runExtract(ask, {
      text,
      fields: [parseFieldSpec("sender=email:the sender"), parseFieldSpec("amount"), parseFieldSpec("date")],
      minConfidence: 0.6,
    });
    expect(Object.keys(calls[0]!.questions)).toEqual(["sender", "amount"]); // date had no candidates
    expect(out.fields.sender).toMatchObject({
      value: "ops@acme.com",
      normalized: "ops@acme.com",
      action: "auto",
      candidates: 2,
    });
    expect(out.fields.amount).toMatchObject({ value: null, action: "none", candidates: 1 });
    expect(out.fields.date).toMatchObject({ value: null, action: "none", candidates: 0 });
    expect(extractFailed(out, ["missing"])).toBe(true);
    expect(extractFailed(out, ["review"])).toBe(false);
  });

  test("low confidence flags review", async () => {
    const { ask } = fakeAsk({ email: pick("c0", 0.3) });
    const out = await runExtract(ask, {
      text: "a@b.co",
      fields: [parseFieldSpec("email")],
      minConfidence: 0.6,
    });
    expect(out.fields.email!.action).toBe("review");
    expect(extractFailed(out, ["review"])).toBe(true);
  });

  test("no candidates for any field skips the API entirely", async () => {
    const { ask, calls } = fakeAsk({});
    const out = await runExtract(ask, {
      text: "nothing here",
      fields: [parseFieldSpec("email")],
      minConfidence: 0.6,
    });
    expect(calls).toHaveLength(0);
    expect(out.fields.email!.action).toBe("none");
  });

  test("duplicate field names are rejected", async () => {
    const { ask } = fakeAsk({});
    await expect(
      runExtract(ask, {
        text: "x",
        fields: [parseFieldSpec("email"), parseFieldSpec("email")],
        minConfidence: 0.6,
      }),
    ).rejects.toThrow(/Duplicate/);
  });
});

describe("extract: cli", () => {
  const h = cliHarness(); // choice -> first candidate (c0) at 0.88

  test("builtins and a custom regex, selected and normalized", async () => {
    const text = "Invoice INV-2231 for $1,250.00 due Sept 30, 2026. Contact billing@acme.com.";
    const r = await h.run([
      "extract",
      text,
      "--want",
      "amount,date,email",
      "--want",
      "invoice=/INV-\\d+/:the invoice number",
      "--json",
    ]);
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.fields.amount).toMatchObject({
      value: "$1,250.00",
      normalized: { value: 1250, currency: "USD" },
      action: "auto",
    });
    expect(out.fields.date.normalized).toBe("2026-09-30");
    expect(out.fields.email.value).toBe("billing@acme.com");
    expect(out.fields.invoice.value).toBe("INV-2231");
    const sent = h.api().requests[0]!.body as { state: { candidates: Record<string, string[]> } };
    expect(sent.state.candidates.invoice).toEqual(["INV-2231"]);
  });

  test("text table; missing field is none; --fail-on missing exits 2 without calling the API", async () => {
    const r = await h.run(["extract", "no contact info here", "--want", "email", "--fail-on", "missing"]);
    expect(r.code).toBe(2);
    expect(r.stdout).toMatch(/email\s+-\s+.*none \(no candidates/);
    expect(h.api().requests).toHaveLength(0);
  });

  test("--dry-run shows candidates found per field", async () => {
    const r = await h.run(["extract", "mail a@b.co", "--want", "email,phone", "--dry-run"]);
    const body = JSON.parse(r.stdout);
    expect(body.state.candidates).toEqual({ email: ["a@b.co"], phone: [] });
    expect(Object.keys(body.questions)).toEqual(["email"]);
  });

  test("usage errors", async () => {
    expect((await h.run(["extract", "x"])).stderr).toMatch(/at least one --want/);
    expect((await h.run(["extract", "x", "--want", "bogus"])).stderr).toMatch(/Unknown field/);
  });
});
