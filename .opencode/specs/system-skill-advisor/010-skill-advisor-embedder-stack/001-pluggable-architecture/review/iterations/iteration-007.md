---
title: "Iter 7 — observability (commit ed5eb0e56 post-impl review)"
iter_number: 7
dimension: observability
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ed5eb0e56
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — 22 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` — 18 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — 107 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — 121 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` — 266 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` — 58 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` — 34 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — 987 lines
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` — 171 lines

## 2. observability CLAIMS

1. Ollama embed operations have no log-on-entry signal. `embed()` returns early on empty input, prepares inputs, posts to Ollama, validates count, and returns vectors without emitting a structured event containing `name`, `dim`, backend, input count, or input type. Evidence: `ollama.ts:163-177`.

2. Ollama readiness checks also have no structured entry/error signal. `ready()` calls `/api/tags`, swallows fetch failures by returning `false`, and returns `false` on non-OK responses without logging model name, dim, base URL, status, or failure class. Evidence: `ollama.ts:179-193`.

3. Ollama request failures throw typed errors but are not logged by the adapter. `postJson()` throws `OllamaBackendUnreachableError` on fetch failure, and `throwForEmbeddingResponse()` throws model/mismatch/request errors, but there is no structured error log at the adapter boundary. Evidence: `ollama.ts:234-257`.

4. Registry adapter selection has no structured observability. `getAdapter()` branches by manifest backend and may return `undefined` or throw `NotImplementedError`, but does not log selected `name`, `dim`, backend, unsupported backend, or missing manifest. Evidence: `registry.ts:85-105`.

5. Schema active-embedder reads/writes expose no structured observability. `getActiveEmbedder()` silently falls back to default when pointer rows are missing/invalid, and `setActiveEmbedder()` writes `name` and `dim` without logging the active embedder transition. Evidence: `schema.ts:84-121`.

6. No direct `console.log` calls were found in the scoped files. The scoped `rg` probe found only `console.warn` calls in `skill-graph-db.ts` and `semantic-shadow.ts`.

7. Existing warnings are unstructured string logs. Skill graph warnings interpolate warning strings into `console.warn`, and semantic-shadow warning logs interpolate normalized error messages into `console.warn`. Evidence: `skill-graph-db.ts:409`, `skill-graph-db.ts:731`, `skill-graph-db.ts:739`, `skill-graph-db.ts:831`, `semantic-shadow.ts:82`, `semantic-shadow.ts:143`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

#### P2-OBS-001 — Ollama adapter failures are not logged at the adapter boundary, leaving production embedding outages opaque

The Ollama adapter has typed errors, but no log-on-entry or log-on-error instrumentation around the actual embedding and readiness operations. `embed()` performs the request and validation without structured fields such as embedder `name`, `dim`, backend, input count, or input type; `ready()` catches transport errors and returns `false` silently; `postJson()` and `throwForEmbeddingResponse()` throw without logging.

Reproduction evidence:
- Configure `OLLAMA_BASE_URL` to an unreachable host.
- Call `new OllamaAdapter(manifest).ready()`: fetch errors are caught and converted to `false` with no emitted diagnostic event (`ollama.ts:179-185`).
- Call `embed(["probe"], { inputType: "query" })`: fetch failure throws `OllamaBackendUnreachableError`, but the adapter emits no structured error event with `name`/`dim`/backend context (`ollama.ts:163-177`, `ollama.ts:234-244`).

Severity rationale: P2 because this does not corrupt behavior, but it materially slows diagnosis of embedder backend outages and violates the requested observability contract.

#### P2-OBS-002 — Registry and schema omit structured `name`/`dim` logs for active embedder selection and pointer transitions

The registry and schema are the places where embedder selection and active pointer state are resolved, but they do not emit structured logs for selected adapter, unsupported backend, missing manifest, fallback-to-default, or active embedder writes. This makes it hard to reconstruct which embedder/dimension was active during a shadow-scoring or indexing incident.

Reproduction evidence:
- Call `getAdapter("missing")`: it returns `undefined` with no log showing the requested name (`registry.ts:85-89`).
- Call `getAdapter()` for an unimplemented backend: it throws `NotImplementedError` without structured `name`, `dim`, and backend fields (`registry.ts:91-105`).
- Remove or corrupt active embedder pointer rows and call `getActiveEmbedder()`: it silently returns the default baseline without a fallback event (`schema.ts:84-95`).
- Call `setActiveEmbedder(db, name, dim)`: it writes `active_embedder_name` and `active_embedder_dim` but emits no transition event (`schema.ts:97-121`).

Severity rationale: P2 because the behavior is functional, but operational attribution across multiple embedders/dimensions is weak.

#### P2-OBS-003 — Semantic-shadow warning path can leak backend error-body content into logs

`OllamaAdapter` normalizes non-OK Ollama response bodies into the thrown error message. `withSemanticShadowPromptEmbedding()` then logs that message via `console.warn`. If the backend error body echoes prompt content or other sensitive request context, the warning can leak it into logs.

Reproduction evidence:
- Mock Ollama `/api/embed` to return HTTP 500 with JSON body `{"error":"bad input: <sensitive prompt>"}`.
- `postJson()` reads the JSON body (`ollama.ts:246-247`).
- `throwForEmbeddingResponse()` includes `normalizeErrorMessage(body)` in the thrown message (`ollama.ts:255-257`).
- `withSemanticShadowPromptEmbedding()` catches the error and logs the message directly with `console.warn` (`semantic-shadow.ts:79-83`).

Severity rationale: P2 because this requires a backend response that echoes sensitive content, but the current log path does not sanitize response-body text before emitting it.

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 3

## 5. GAPS FOR NEXT ITER

- Did not review non-scoped callers that may wrap these warnings with their own logging or telemetry.
- Did not execute live Ollama failure scenarios; reproduction is code-path based.
- Did not inspect whether the broader MCP server has a structured logger utility that these files should use.
- Did not evaluate metrics/tracing beyond log observability.

## 6. JSONL DELTA ROW

{"iter":7,"phase":"complete","timestamp":"2026-05-17T21:43:57Z","dimension":"observability","new_p0":0,"new_p1":0,"new_p2":3,"running_p0":0,"running_p1":0,"running_p2":4,"converged":false,"note":"Found 3 P2 observability gaps: missing structured adapter/registry/schema logs and a backend error-body log leak path."}