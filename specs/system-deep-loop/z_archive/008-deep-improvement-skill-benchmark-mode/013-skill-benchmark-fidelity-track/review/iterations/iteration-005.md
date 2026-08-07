# Iteration 005 — Maintainability

**Dimension:** maintainability
**Prior cumulative:** P0=0 P1=2 P2=4 (across iterations 1–4; iter 3+4 errored/timed out)

---

## Files Reviewed

- `SKILL.md:1-543`
- `changelog/v1.11.0.0.md:1-41`
- `scripts/skill-benchmark/d4-ablation.cjs:1-245`
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-351`
- `scripts/skill-benchmark/build-report.cjs:1-172`
- `scripts/skill-benchmark/live-executor.cjs:1-263`
- `scripts/skill-benchmark/run-skill-benchmark.cjs:1-293`
- `scripts/model-benchmark/dispatch-model.cjs:1-666`
- `scripts/model-benchmark/sweep-benchmark.cjs:1-651`
- `scripts/skill-benchmark/README.md:1-199`
- `scripts/model-benchmark/README.md:1-149`
- `scripts/agent-improvement/score-candidate.cjs:1-40`
- `scripts/model-benchmark/scorer/score-model-variant.cjs` (existence check)

---

## Findings by Severity

### P0 — None

### P1 — None

### P2 — Suggestions

**R5-P2-001: Duplicated JSONL event-stream parsing across 3 files**

- **File:** `scripts/model-benchmark/dispatch-model.cjs:253`, `scripts/model-benchmark/sweep-benchmark.cjs:346`, `scripts/skill-benchmark/live-executor.cjs:110`
- **Claim:** Three independent implementations parse the same cli-opencode JSONL event-stream format. `parseOpencodeStream` (dispatch-model) extracts assistant text + usage. `extractAssistantText` (sweep-benchmark) extracts assistant text only. `parseEvents` (live-executor) returns raw events. All iterate lines, JSON.parse, filter `type === 'text'`, sort by `part.time.start`.
- **Impact:** If the event-stream schema changes, three files need synchronized updates. The usage-probing logic in `parseOpencodeStream` is the most complete but is not reused by the other two. A shared `parse-event-stream.cjs` in `scripts/lib/` would eliminate drift risk.
- **Fix:** Extract a shared `parseEventStream(stdout)` helper into `scripts/lib/event-stream.cjs` that returns `{ events, parts, output }`. Each consumer imports it and applies its own post-processing (usage probing, observed-result shaping, etc.).

**R5-P2-002: Duplicated git-root resolution across 2 files**

- **File:** `scripts/model-benchmark/dispatch-model.cjs:164`, `scripts/model-benchmark/sweep-benchmark.cjs:624`
- **Claim:** Both `repoRoot()` and `gitRoot()` implement the same logic: try `DEEP_AGENT_REPO_ROOT` env, then `execSync('git rev-parse --show-toplevel')`, then a hardcoded fallback. Two separate functions with different names for identical behavior.
- **Impact:** Minor drift risk. If the fallback path logic changes, both must be updated.
- **Fix:** Move to a shared `scripts/lib/repo-root.cjs` or reuse `dispatch-model.cjs`'s `repoRoot()` from sweep-benchmark.

**R5-P2-003: Stale JSDoc `scripts/dispatch-model.cjs` path**

- **File:** `scripts/model-benchmark/dispatch-model.cjs:8`
- **Claim:** The JSDoc block says `scripts/dispatch-model.cjs` but the file is at `scripts/model-benchmark/dispatch-model.cjs` (moved during the lane-restructure). The comment at line 47-51 acknowledges the deeper depth but the JSDoc `@file` path was not updated.
- **Impact:** Developers searching for the file by its documented path will not find it. Minor confusion.
- **Fix:** Update line 8 to `scripts/model-benchmark/dispatch-model.cjs`.

**R5-P2-004: model-benchmark README exports table is incomplete**

- **File:** `scripts/model-benchmark/README.md:85`, `scripts/model-benchmark/dispatch-model.cjs:651-665`
- **Claim:** The README says `dispatch-model.cjs` exports `dispatch, dispatchReal, dispatchMock, buildSpawnSpec, KNOWN_EXECUTORS, and pause-sentinel helpers`. The actual module exports 12 symbols: those listed plus `buildEnvelope`, `parseOpencodeStream`, `deriveProvider`, `resolveStateDir`, `buildResumeHint`, `writeCapableOptIn`. The README omits 6 exported functions.
- **Impact:** Consumers discovering the API from the README may miss useful exports (especially `buildEnvelope` and `parseOpencodeStream` which are used by sweep-benchmark and tests).
- **Fix:** Update the exports table in the README to list all 12 exported symbols, or explicitly note which are internal/test-only.

**R5-P2-005: `clamp01` utility duplicated in d4-ablation.cjs**

- **File:** `scripts/skill-benchmark/d4-ablation.cjs:39`
- **Claim:** `clamp01(x)` is a simple `Math.max(0, Math.min(1, ...))` clamping utility defined locally. This pattern is common enough to warrant a shared utility, especially if more scoring modules need it.
- **Impact:** Very minor — the function is 1 line. Low risk of behavioral drift. Noting for completeness.
- **Fix:** Optional: move to `scripts/lib/math-utils.cjs` if additional scoring modules need it.

---

## Traceability Checks

| Check | Status | Detail |
|---|---|---|
| SKILL.md §3 MODE 2 script paths match actual files | ✅ PASS | `scripts/agent-improvement/scan-integration.cjs`, `score-candidate.cjs` etc. all exist |
| SKILL.md §11 script references match actual files | ✅ PASS | All 14 listed scripts verified on disk |
| SKILL.md §4 Lane B path accuracy | ✅ PASS | `scripts/model-benchmark/dispatch-model.cjs`, `run-benchmark.cjs` exist |
| changelog/v1.11.0.0.md vs code | ✅ PASS | D4-R instrument, deferred-asset lane, advisorySignals all match |
| README directory trees vs actual files | ⚠️ MINOR | model-benchmark README omits `lib/`, `tests/`, `MODES.md` from tree; exports table incomplete (R5-P2-004) |
| SKILL.md version field | ✅ PASS | `version: 1.11.0.0` matches changelog |
| Header/JSDoc accuracy post-reformat | ⚠️ MINOR | dispatch-model.cjs:8 stale path (R5-P2-003) |

---

## Verdict

**PASS** — No P0 or P1 findings. Five P2 maintainability suggestions focused on code deduplication and documentation completeness. The codebase is well-structured with consistent box-header formatting across all `.cjs` files and accurate lane separation. The primary maintainability debt is the duplicated event-stream parsing logic (R5-P2-001) which is the highest-value consolidation target.

---

## New Findings Ratio

5/5 = 1.0 (all findings are genuinely new; no prior-findings overlap)

---

## Next Dimension

**Traceability** (remaining dimension — verify code-to-docs alignment at deeper level, changelog accuracy, trigger_phrase coverage)
