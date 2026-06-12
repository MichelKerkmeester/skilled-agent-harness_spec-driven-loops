# tri-016 Fix Verdict — CLI Save-Lane Secret Scrubber

VERDICT: CLOSED

Adversarial verification of the uncommitted fix wiring the fail-closed secret scrubber into the CLI save lane (`scripts/core/workflow.ts` → generate-context). Primary threat model checked first: any weakening of the 228-line scrubber during the move to `shared/`. None found — the shared copy is byte-identical to the original, all 13 patterns live at runtime through the re-export chain, and fail-closed propagation aborts the save before any persistence.

---

## 1. Scrubber integrity (primary) — PASS, no weakening

- `git diff HEAD -- mcp_server/lib/parsing/secret-scrubber.ts`: full 228-line module replaced by an 11-line pure re-export (`export * from '@spec-kit/shared/parsing/secret-scrubber'`) — no logic remains in the old location, nothing partially copied.
- `git show HEAD:mcp_server/lib/parsing/secret-scrubber.ts | diff - shared/parsing/secret-scrubber.ts` → **BYTE-IDENTICAL** (zero diff output). All patterns, the `SecretScrubberError` fail-closed throw, telemetry counters, and `__secretScrubberTestables` are intact verbatim.
- Runtime confirmation through the re-export chain (`mcp_server/dist/lib/parsing/secret-scrubber.js`): `scrubSecretsDetailed`, `SecretScrubberError`, `getRedactionStats` all resolve as functions; `__secretScrubberTestables.defaultPatterns.length` = **13**, matching the original pattern count (private-key ×2, aws-secret-access-key, aws-access-key-id, github-token ×2, anthropic, openai, google, slack, jwt, bearer, credential-assignment).
- Single physical module: `node_modules/@spec-kit/shared` is a workspace **symlink** to `../../shared` (no stale copy; `instanceof SecretScrubberError` stays consistent across mcp_server and scripts).

## 2. Fail-closed — PASS

- The scrub helpers (`scripts/core/workflow.ts:231-274`) contain no try/catch; `SecretScrubberError` from `scrubSecretsDetailed` propagates unwrapped.
- The scrub call site (`workflow.ts:1491-1504`) sits in `runWorkflow`'s main body. The only enclosing handler is `withWorkflowRunLock`'s try/**finally** (`workflow.ts:517-524`), which releases locks and re-throws.
- Every try/catch after the scrub site pairs locally with a different operation: description tracking (`1661/1734`), graph refresh (`1753/1777` — and that one re-throws), post-save review (`1849/1857`), retry queue (`1864/1880`). None encloses line 1491.
- CLI entry: `generate-context.ts:856` awaits `runWorkflow` inside `main()`'s try; the catch (`generate-context.ts:875-888`) prints the error and `process.exit(1)`. A scrubber failure therefore aborts the save before any payload persistence. The error message contains no secret material (only the failure reason).

## 3. Placement — PASS

The scrub at `workflow.ts:1491` precedes every persistence consumer of the scrubbed fields:

| Consumer | Location | Scrubbed input |
|---|---|---|
| description.json `memoryNameHistory` (savePFD) | `workflow.ts:1708,1716` | `rawCtxFilename` ✓ |
| graph-metadata refresh | `workflow.ts:1775` | disk-derived only |
| Step 11.5 auto-index | `workflow.ts:1834` | disk docs only |
| post-save quality review | `workflow.ts:1851` | scrubbed `collectedData` ✓ (read-only, prints) |
| phase-parent pointer write | `generate-context.ts:558` (`updatePhaseParentPointer`) | folder ids + timestamps only |

- Pre-scrub region (`workflow.ts:890-1490`) contains **no payload persistence** — only lock-metadata writes (`workflow.ts:433,546`: pid/timestamp) and spec-folder existence checks/creation.
- Git-context enrichment (`enrichCapturedSessionData`, merged ~line 1207) — which can pull commit-message text into collectedData — happens **before** the scrub, so enriched content is covered by the tree scrub.
- Note: workflow.ts no longer writes the legacy `[spec]/memory/*.md` artifact (Path A retirement, `workflow.ts:1648`); the dominant payload-derived durable surface in this lane is the description.json filename history, and it is scrubbed.

## 4. Coverage gaps (honest accounting)

None of these blocks closure — the fields that actually reach durable storage in this lane are scrubbed — but they are real and reported plainly:

1. **Pre-scrub value flows past the scrub point** — `workflow.ts:1524`: `description: explicitMemoryText.description ?? memoryDescription` passes the **unscrubbed** explicit description (captured at line 1481, before the scrub) to `findPredecessorMemory`. Verified read-only today (`core/find-predecessor-memory.ts` imports only `open`/`readdir` — matching, no writes, no telemetry), so no leak — but it silently bypasses the scrubbed `memoryDescription` and becomes a leak the day that module gains logging or query persistence. Should use the scrubbed value; one-line fix.
2. **`\b` boundary evasion (inherited, not introduced)** — live-verified: `f__github_pat_…` passes `scrubWorkflowSavePayloadTextFields` unredacted because `\b` fails between `_` and `g`. Relevant here because `rawCtxFilename` is composed as `${DATE}_${TIME}__${contentSlug}.md` — a slug-leading raw secret would evade the filename scrub while the slug itself gets redacted. Mitigated in practice: `slugify` (`utils/slug-utils.ts:104` → `toUnicodeSafeSlug`) lowercases/hyphenates, so raw token shapes rarely survive into the slug. Identical behavior exists in the MCP lane (scrubber is byte-identical); this is a pattern-set limitation, not a fix regression.
3. **Object keys are not scrubbed** — `scrubWorkflowTextTree` scrubs values only (`Object.fromEntries` preserves keys, `workflow.ts:247-254`). No current persistence consumer of raw tree keys exists in this lane; the MCP lane covers keys because it scrubs serialized text at parse-head. Parity nit.
4. **Pre-scrub aliases** — `conversations`/`decisions`/`diagrams` (extracted from collectedData ~line 1340, before the scrub) retain unscrubbed strings; today only counts and in-memory quality scoring consume them, nothing persists them.
5. **Transformed secrets survive slugification** — a secret lowercased/hyphenated into `contentSlug` no longer matches any raw-token pattern yet is trivially reversible (e.g. lowercased AWS key id) and persists via `memoryNameHistory`. Shared limitation of regex scrubbing in both lanes; follow-on only.

## 5. Consumers — PASS

- All 5 mcp_server consumers keep their original import paths unchanged: `handlers/memory-save.ts:30`, `handlers/memory-crud-update.ts:26`, `handlers/memory-crud-health.ts:21`, `lib/parsing/memory-parser.ts:38`, `lib/storage/write-provenance.ts:5`.
- `npx vitest run tests/secret-scrubber.vitest.ts` (mcp_server): **27/27 passed** — exercises the full pattern set through the re-export chain (`../lib/parsing/secret-scrubber`).
- New scripts-side test `tests/workflow-save-secret-scrub.vitest.ts`: **1/1 passed** (AWS + GitHub tokens redacted across all six payload fields, warn callback fired).
- `tests/architecture-boundary-enforcement.vitest.ts` (scripts import-policy guard): **9/9 passed** with the new `@spec-kit/shared/parsing/secret-scrubber` import.
- Compiled dists are current (Jun 12 13:39): mcp_server dist is the re-export, scripts dist imports `@spec-kit/shared/parsing/secret-scrubber` and contains/exports `scrubWorkflowSavePayloadTextFields` (`scripts/dist/core/workflow.js:29,154,1135,1511`).

## 6. Runtime resolution — PASS

- `node -e "import('./dist/core/workflow.js').then(m=>console.log(typeof m.scrubWorkflowSavePayloadTextFields))"` from `scripts/` → prints **`function`**.
- Live behavioral smoke through the real dist chain: AWS access key, Anthropic key, bearer token, aws-secret assignment, and Slack token all redacted to typed `[REDACTED:<kind>]` markers (the single non-redaction was the `__`+`\b` boundary case documented in gap 2).
- No live generate-context save was run against the DB (per protocol step 7).

## Follow-ons

- **F1 (small, recommended):** `workflow.ts:1524` — pass the scrubbed `memoryDescription` to `findPredecessorMemory` instead of `explicitMemoryText.description ?? memoryDescription`; also derive any future predecessor inputs from post-scrub values only.
- **F2 (pattern hardening, both lanes):** consider tolerating a leading `_` before vendor-prefixed tokens (e.g. `(?<![A-Za-z0-9])` lookbehind instead of `\b`) so composed contexts like `…__github_pat_…` can't evade; change belongs in the shared canonical module so both lanes move together.
- **F3 (optional):** extend `scrubWorkflowTextTree` to scrub object keys for parity with the MCP lane's serialized-text scrub.
- **F4 (tracking only):** transformed-secret survival through slugification is a known regex-scrubber limitation; no cheap fix, document rather than patch.
