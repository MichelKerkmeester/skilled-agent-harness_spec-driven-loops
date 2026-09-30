---
title: "Iteration 4: The top reduction seam as a slice — the offline compaction deletion arm"
trigger_phrases: []
---
# Iteration 4: The top reduction seam as a slice — the offline compaction deletion arm

**Angle:** swe-04 · **Lens:** code-level slice design · **Maps to:** C

## Sibling check (W2 contract)

| Sibling | Newest read | Carried forward |
|---|---|---|
| mimo | `mimo/iterations/iteration-001.md` (only file) | Counted context baseline: tool results are 28.6% of a 649 MB input-side payload, but per-turn carry is dominated by harness-held context; tool-output pruning verdicted **later**; re-read avoidance **later** |
| deepseek | `iteration-004.md` (named by angle) + `iteration-009.md` (newest) | F2: PreCompact's real budget is `HOOK_TIMEOUT_MS = 1800` under a 3 s hook with skip-on-exhaustion (`shared.ts:11-12`, `compact-inject.ts:494`); live keep-or-drop in the command hook stays unflipped, `precompute` is the better home. F5: no averaging, no mid-run failover between backends. F6: no build-now on judgment quality — census first |
| grok | `iteration-010.md` (newest) | Ship no new classifier phase; the only phase that ships model-free is the R19 zero-call census. Contests my N-swe-01-1's build-now *timing* (a client with no caller cuts nothing), not its shape |
| glm | `iteration-001.md` (only file) | One surviving candidate: the 0.8B as a **second scorer on an already-designed census**, gated on printed agreement ≥0.68 and flip ≤0.10; latency flips nothing |

Taken together the siblings converge on one shape: **the model never goes live first — it rides an existing offline census as a second arm, behind a printed keep rule.** That is exactly the design this iteration produces for the best-counted seam.

## The top reduction seam, counted

| Seam | Counted size | Source |
|---|---|---|
| **Compaction keep-or-drop** | 212 `compact_boundary` records in 93 main-session files + 14 in 999 subagent files; sessions compacting at `preTokens` ≥ 450,019; p50 wait ≈ 104 s per boundary | `005-compaction-recall-harness/spec.md:60` (problem statement) |
| Leaf routing (swe-03) | ~3–4k tokens/sk-doc route (est., unmeasured) | iteration-003 |
| Tool-output pruning | 28.6% of input payload but later (mimo) | mimo-001 |

Compaction wins by two orders of magnitude on counted tokens and already owns a spec'd harness. The slice is therefore **the deletion arm that 005's stop line gates** — an amendment to phase 005, not a new phase.

## What 005 already gives (angle Q3)

`005-compaction-recall-harness/spec.md` + `plan.md` (both read whole this iteration):

- `parseTranscript()` closed-whitelist streaming parser, `findBoundaries()`, `readStockSummary()`, `readRecordedBrief()` — `plan.md:64-67`
- **`toMessages()`** — rebuilds inter-boundary records into the vendored `Message`/`ToolCall` shapes (`plan.md:69`) — the exact input the arm's question builder consumes
- The **fit port** (`estimateTokens`/`fitState`, `state.ts:31-41`,`:198-306`) and the **offline reduction upper bound**: every unpinned tool result cut to the 300-char head, newest 6 pinned, **no model** (`spec.md:83-84`, `plan.md:70-71`)
- Five must-survive recall rules over summary+brief (`spec.md:85`) — these double as the arm's safety labels
- The stop line (`spec.md:170-178`): `arm may be specified` only when `fit_throws < 0.50`, `offline_reduction_upper_bound ≥ 0.25`, `kept_tokens_ratio ≤ 3`

The arm adds the one thing the census refuses: a **model in the keep/drop loop** — offline, behind the stop line.

## The arm in code terms (the vendored procedure it ports)

`context/external repo's/jev-cli-main/src/vendor/compaction/` (opened this iteration):

- `questionsFor(call)` emits two `noul` per tool call — `call_<id>`, `result_<id>` (`compact.ts:58-67`); `result` asks whether output "should stay in the history verbatim"
- `batchCalls` packs questions until `maxRequestTokens` beside the fitted state (`compact.ts:73-101`)
- `askBatch` posts `{model, state, questions}` once per batch via `buildJevRequest` (`compact.ts:120-136`, `request.ts:17-39`); `noulAnswer` reads `answers.<name>.noul` as a **probability float** (`request.ts:69-83`)
- `decideCall`: pinned→keep; `keepResult ≥ keepThreshold(0.5)`→keep; `keepCall ≥ 0.5`→`drop_result`; else `drop_call` (`compact.ts:104-118`)
- `applyDecisions` rebuilds: `drop_call` removes call+result, `drop_result` keeps a `[fast-jev-compaction truncated N chars]` head+note, emptied messages removed (`compact.ts:138-228`)

### The slice: `deletion-arm.mjs`, a sibling in the census folder

```text
.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/
  score-compaction-recall.mjs   (005's census — untouched)
  deletion-arm.mjs              (NEW ~300 LOC)
runtime/tests/deletion-arm.vitest.ts   (NEW ~150 LOC, 8 cases)
```

Functions (all pure except `probeBackend`/`askBackend`):

| Function | Signature | Notes |
|---|---|---|
| `probeBackend(flag)` | `('--deem'|'--jev'|'--both'|'none') → {backend, model, endpoint} | null` | Deem: `GET /health` 200 + `status=="ok"` + `backend` in allowlist `{torch}` or `ensemble:*` sans `stub` + `model=="deem-0.8-v1"` (deepseek-04 F10's gate, quoted). Jev: D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Default order: **Deem first** — this payload is the operator's own transcripts, the packet's highest privacy class (`spec.md:91`); Jev egresses the fitted state |
| `questionsFor(call)` | vendored port | verbatim intent: `call_<id>` keep-call, `result_<id>` keep-verbatim (`compact.ts:58-67`) |
| `batchCalls(calls, stateTokens)` | vendored port (`compact.ts:73-101`) | |
| `askBackend(state, questions)` | posts `{state, questions}` envelope; Deem path reads `answers.<name>.value`, Jev path reads `answers.<name>.noul` — the wire asymmetry swe-01 measured; malformed/missing → throw → boundary row `arm_error`, never a default decision | |
| `decideCall(call, answer)` | vendored port, `keepThreshold` 0.5 (`compact.ts:104-118`) | |
| `applyDecisions(messages, decisions, calls)` | vendored port (`compact.ts:152-228`) | |
| `measureArm(boundary)` | returns `{additional_reduction, dropped_calls, dropped_results, must_survive_hits}` where `additional_reduction = 1 − estTokens(applied)/estTokens(truncated)` — the delta over the census's no-model bound | |

Entry: `node deletion-arm.mjs --transcripts <named> --report <census.json>`; refuses to run when the census report's stop line isn't `arm may be specified` (prints `arm: gated (<stop line>)`, exit 0). With no backend probing healthy: `arm: skipped (no backend)` — the census rows are unchanged, exit 0.

### Keep/kill rule — checkable logic

```text
gate: census stop == "arm may be specified"             else print gated, exit 0
per boundary: additional_reduction = 1 - arm/truncated
labels: operator's 3-session read (005 RQ27) + the five must-survive rules
print exactly one:
  "arm: kill (median_additional < 0.05)"      if median additional_reduction < 0.05
  "arm: kill (must_survive dropped)"          if any drop_call/drop_result removes a rule-1..5 item
  "arm: kill (agree < 0.68)"                  if labeled keep/drop agreement < 0.68   (glm-01/BASE2 power line)
  "arm: kill (flip > 0.10)"                   if the same fixed boundary set re-run flips > 0.10 of decisions (BASE2 C1)
  "arm: keep (median_additional=<x>, agree=<y>, flips=<z>)" otherwise
```

Every clause is a printed comparison, not a judgment.

## Idea record

### N-swe-04-1 — offline deletion arm as a 005 amendment

| Field | |
|---|---|
| **Idea** | `noul`×2 per unpinned tool call over the census's `toMessages()` reconstruction; batched `{state, questions}` per boundary; decisions applied offline and measured against the no-model truncation bound. Type: `noul`, batched (the vendored `run`-style envelope) |
| **Question** | C |
| **Builds on** | BASE1 R19 (its "later" arm half — the census half is already phase 005); R11's brief column; vendored `compact.ts` |
| **Value** | First measured answer to "does a model keep-or-drop beat 300-char truncation" — the question every live-compaction idea (rows 5, 19) collapsed into |
| **Seam** | `runtime/scripts/compaction-recall/deletion-arm.mjs` (new); consumes `score-compaction-recall.mjs`'s report + `toMessages()` port; vendored source `compact.ts:58-228`, `request.ts:17-83` |
| **Metric, baseline, harness** | `median additional_reduction` over truncation-only; baseline = census's `offline_reduction_upper_bound` column (spec.md:84). Harness = the census itself + labeled 3-session read |
| **Savings** | UNKNOWN until the census prints; counted envelope: ≤226 boundaries × per-boundary carried tokens (450k+ `preTokens` scale) — est. the largest single context lever in the packet if `additional_reduction` is real |
| **Cost, latency, privacy** | Offline, no deadline. ~2 `noul` per unpinned call, batched to `maxRequestTokens` (`compact.ts:86-94`); a 50-call boundary ≈ 2–4 batch posts. **Deem preferred**: transcript text never leaves the machine; Jev egresses the fitted state — the payload class 005 calls the packet's highest (`spec.md:91`) and its Jev arm still needs "the operator's acceptance of its payload" |
| **Two-backend gate** | `--arm-backend deem|jev|both|none`, default `none`→skip. Probes per the gate text above; on probe failure, malformed answer, or `noul` non-finite → `arm_error:<boundary>` row + continue; `skipped (no backend)` when neither. No default decision is ever synthesized for a failed call — that boundary's calls stay `unasked` |
| **Rough LOC** | ~300 arm script (vendored ports ~140, backend adapter ~80, gate/report ~80) + ~150 tests (8 cases: gated stop line, both-backend probe matrix, malformed answer, must-survive drop detection, batching split, `drop_result` head shape, empty boundaries, no-backend skip) |
| **Verdict** | **next** — every sibling converges here: census first (zero-call, build-now as 005 spec'd), arm second, gated on the printed stop line. Not build-now because the arm has no purpose until `arm may be specified` prints |
| **Confidence** | Confirmed shape (vendored code read end to end; census contract read whole); the arm's measured value is by construction unknown until run |

## Ruled out

- **Any live-form placement** (PreCompact command hook, SessionStart): deepseek-04 F2 counted the 1,800 ms merge budget with built-in skip-on-exhaustion; a model call on that path competes with the merge and BASE1 row 5 stays dropped. The `precompute` form is deepseek-08's lane, not this slice.
- **A standalone deletion tool independent of the census**: duplicates `toMessages()`/fit/`KNOWN_TYPES` — and loses the stop line that decides whether it should exist.
- **`choice` keep|drop|truncate over `noul`**: the vendored contract is two independent probabilities per call (call-level and result-level keep) — a 3-way `choice` collapses a decision that legitimately mixes (keep call + drop result = the common case).

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The deletion arm's question shape is 2 `noul` floats per tool call (`call_`, `result_`), batched beside a ≤25k-token fitted state; keepThreshold 0.5; drop_call removes call+result | **new** for round 3 (vendored source opened) | `compact.ts:58-118`, `request.ts:69-83` |
| The arm is buildable purely as a 005 amendment: census already owns parser, `toMessages()`, fit port, and the truncation bound the arm must beat | **new** | `plan.md:64-71`, `spec.md:83-87` |
| Deem (not Jev) is the preferred backend *for this arm specifically* on privacy grounds — fitted transcript state is the packet's highest payload class | **new** (contests deepseek-09 F5's general "Jev for typed judgments" ordering in this one case) | `spec.md:91`, `request.ts:26-37` (state+questions egress), LOCAL:51 |
| The arm's keep/kill rule reduces to printed comparisons: median additional reduction ≥0.05, zero must-survive drops, agreement ≥0.68, flip ≤0.10 | **new** | assembled: `spec.md:170-178` stop-line pattern + glm-001's quoted BASE2 thresholds |
| Sibling convergence: census-first/arm-second is the only build ordering four lineages independently reached | **new** | grok-010, deepseek-009 F6, glm-001, mimo-001 |

## Hand-off

- swe-05: sk-prompt/sk-design routers — check whether leaf gold exists for them before proposing any arm (sk-code had only 2).
- swe-06: validator residue — reuse this iteration's "second arm on an existing harness" shape: residue scanners ride `validate_document.py`/`hvr_scan.py` outputs, never replace them.
- swe-07/08: `probeBackend`'s allowlist+pin contract (deepseek-04 F10) and the `arm: skipped`/`arm_error` line vocabulary are the shared pieces to standardize.
- swe-09/10: build order is now concrete — census (005) → this arm → leaf-route replay; the first PR-sized slice is likely the census itself, not an arm.
