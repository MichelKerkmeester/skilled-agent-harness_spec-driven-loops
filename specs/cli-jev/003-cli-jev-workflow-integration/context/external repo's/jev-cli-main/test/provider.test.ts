import { describe, expect, test, vi } from "vitest";
import {
  createAsk,
  OPENROUTER_LATEST,
  providerModel,
  resolveProvider,
  validateAnswers,
} from "../src/provider.js";

const questions = { q: { type: "noul", instructions: "x" } };
const yes = { type: "noul", noul: 0.9 };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("resolveProvider", () => {
  test("auto picks typesafe, then openrouter, then cloudflare", () => {
    expect(resolveProvider({ TYPESAFE_API_KEY: "ts", OPENROUTER_API_KEY: "sk-or-x" })).toBe("typesafe");
    expect(resolveProvider({ OPENROUTER_API_KEY: "sk-or-x" })).toBe("openrouter");
    expect(resolveProvider({ CLOUDFLARE_API_TOKEN: "t", CLOUDFLARE_ACCOUNT_ID: "a" })).toBe("cloudflare");
    expect(resolveProvider({ JEV_CLOUDFLARE_API_TOKEN: "t", CLOUDFLARE_ACCOUNT_ID: "a" })).toBe("cloudflare");
  });

  test("ignores blank keys and non-sk-or OpenRouter keys", () => {
    expect(() => resolveProvider({ TYPESAFE_API_KEY: "  ", OPENROUTER_API_KEY: "sk-x" })).toThrow(
      /No credentials/,
    );
  });

  test("explicit provider without credentials is an error", () => {
    expect(() => resolveProvider({}, "typesafe")).toThrow(/TYPESAFE_API_KEY/);
    expect(() => resolveProvider({}, "openrouter")).toThrow(/OPENROUTER_API_KEY/);
    expect(() => resolveProvider({ CLOUDFLARE_API_TOKEN: "t" }, "cloudflare")).toThrow(
      /CLOUDFLARE_ACCOUNT_ID/,
    );
  });
});

describe("validateAnswers", () => {
  const qs = { a: { type: "noul" }, b: { type: "choice", criteria: { x: null } } };
  const good = { a: yes, b: { type: "choice", choice: "x", probabilities: { x: 1 }, confidence: 0.9 } };

  test("passes a complete, well-typed answer set through unchanged", () => {
    expect(validateAnswers(qs, good, "m")).toBe(good);
  });

  test("rejects a body with no answers object (non-JSON or empty proxy response)", () => {
    expect(() => validateAnswers(qs, undefined, "m")).toThrow(/Malformed response from m: no answers object/);
    expect(() => validateAnswers(qs, [], "m")).toThrow(/no answers object/);
  });

  test("rejects missing answers instead of letting them read as probability 0", () => {
    expect(() => validateAnswers(qs, {}, "m")).toThrow(/no answer for a, b/);
    expect(() => validateAnswers(qs, { a: yes }, "m")).toThrow(/no answer for b\./);
  });

  test("rejects an answer whose type or payload does not match the question", () => {
    expect(() => validateAnswers(qs, { ...good, b: yes }, "m")).toThrow(
      /"b" has type noul but the question was choice/,
    );
    expect(() => validateAnswers(qs, { ...good, a: { type: "noul", noul: "0.9" } }, "m")).toThrow(
      /non-numeric noul/,
    );
    expect(() => validateAnswers(qs, { ...good, b: { type: "choice" } }, "m")).toThrow(/has no choice/);
  });
});

describe("providerModel", () => {
  test("maps aliases per provider", () => {
    expect(providerModel("typesafe", "jev-latest")).toBe("jev-latest");
    expect(providerModel("openrouter", "jev-latest")).toBe(`typesafe/${OPENROUTER_LATEST}`);
    expect(providerModel("openrouter", "jev-1.12")).toBe("typesafe/jev-1.12");
    expect(providerModel("openrouter", "typesafe/jev-1.12")).toBe("typesafe/jev-1.12");
    expect(providerModel("cloudflare", "jev-latest")).toBe("typesafe/jev");
    expect(providerModel("cloudflare", "jev-1.13")).toBe("typesafe/jev-1.13");
  });
});

describe("createAsk", () => {
  test("typesafe: posts to /v1/systemone with bearer auth through the SDK", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe("https://api.typesafe.ai/v1/systemone");
      expect(new Headers(init?.headers).get("authorization")).toBe("Bearer ts-key");
      const body = JSON.parse(String(init?.body));
      expect(body).toMatchObject({ model: "jev-latest", state: "s", questions });
      return jsonResponse({
        model: "jev-1.13.0",
        answers: { q: { type: "noul", noul: 0.4 } },
        usage: { input_tokens: 5, output_tokens: 1 },
      });
    });
    const ask = createAsk({
      provider: "auto",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { TYPESAFE_API_KEY: "ts-key" },
      fetch: fetchMock as unknown as typeof fetch,
    });
    const result = await ask("s", questions);
    expect(result).toEqual({
      answers: { q: { type: "noul", noul: 0.4 } },
      usage: { input_tokens: 5, output_tokens: 1 },
      provider: "typesafe",
      model: "jev-1.13.0",
    });
  });

  test("typesafe: honors TYPESAFE_BASE_URL", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toBe("http://127.0.0.1:9/v1/systemone");
      return jsonResponse({ model: "m", answers: { q: yes }, usage: { input_tokens: 0, output_tokens: 0 } });
    });
    const ask = createAsk({
      provider: "typesafe",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { TYPESAFE_API_KEY: "k", TYPESAFE_BASE_URL: "http://127.0.0.1:9" },
      fetch: fetchMock as unknown as typeof fetch,
    });
    await ask("s", questions);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("openrouter: posts to the decisions endpoint with the mapped slug", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe("https://openrouter.ai/api/alpha/decisions");
      expect(new Headers(init?.headers).get("authorization")).toBe("Bearer sk-or-abc");
      expect(JSON.parse(String(init?.body)).model).toBe(`typesafe/${OPENROUTER_LATEST}`);
      return jsonResponse({ answers: { q: { type: "noul", noul: 0.9 } } });
    });
    const notices: string[] = [];
    const ask = createAsk({
      provider: "auto",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { OPENROUTER_API_KEY: "sk-or-abc" },
      fetch: fetchMock as unknown as typeof fetch,
      notify: (m) => notices.push(m),
    });
    expect(notices.join("")).toMatch(/no TypeSafe key found, using openrouter.*openrouter\.ai/);
    const result = await ask("s", questions);
    expect(result.provider).toBe("openrouter");
    expect(result.answers.q.noul).toBe(0.9);
    expect(result.usage).toEqual({ input_tokens: 0, output_tokens: 0 });
  });

  test("openrouter: non-2xx becomes a readable error", async () => {
    const fetchMock = vi.fn(async () => new Response("rate limited", { status: 429 }));
    const ask = createAsk({
      provider: "openrouter",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { OPENROUTER_API_KEY: "sk-or-abc" },
      fetch: fetchMock as unknown as typeof fetch,
    });
    await expect(ask("s", questions)).rejects.toThrow(/OpenRouter decisions API 429: rate limited/);
  });

  test("cloudflare: unwraps the v4 envelope and surfaces failures", async () => {
    const ok = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe("https://api.cloudflare.com/client/v4/accounts/acct/ai/run");
      expect(JSON.parse(String(init?.body))).toMatchObject({ model: "typesafe/jev", input: { state: "s" } });
      return jsonResponse({
        success: true,
        result: {
          state: "Completed",
          result: {
            answers: { q: { type: "noul", noul: 0.2 } },
            usage: { input_tokens: 3, output_tokens: 0 },
          },
        },
      });
    });
    const env = { CLOUDFLARE_API_TOKEN: "tok", CLOUDFLARE_ACCOUNT_ID: "acct" };
    const notices: string[] = [];
    const ask = createAsk({
      provider: "auto",
      model: "jev-latest",
      timeoutMs: 5000,
      env,
      fetch: ok as unknown as typeof fetch,
      notify: (m) => notices.push(m),
    });
    expect(notices.join("")).toMatch(/api\.cloudflare\.com/);
    const result = await ask("s", questions);
    expect(result).toMatchObject({
      provider: "cloudflare",
      answers: { q: { noul: 0.2 } },
      usage: { input_tokens: 3 },
    });

    const bad = vi.fn(async () => jsonResponse({ success: false, errors: [{ message: "nope" }] }, 200));
    const failing = createAsk({
      provider: "cloudflare",
      model: "jev-latest",
      timeoutMs: 5000,
      env,
      fetch: bad as unknown as typeof fetch,
    });
    await expect(failing("s", questions)).rejects.toThrow(/Cloudflare AI run 200: .*nope/);
  });

  test("the hop notice is silent for typesafe and for a deliberate --provider", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ answers: { q: yes } }));
    const notices: string[] = [];
    const notify = (m: string) => notices.push(m);
    createAsk({
      provider: "auto",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { TYPESAFE_API_KEY: "ts-key" },
      fetch: fetchMock as unknown as typeof fetch,
      notify,
    });
    createAsk({
      provider: "openrouter",
      model: "jev-latest",
      timeoutMs: 5000,
      env: { OPENROUTER_API_KEY: "sk-or-abc" },
      fetch: fetchMock as unknown as typeof fetch,
      notify,
    });
    expect(notices).toEqual([]);
  });
});
