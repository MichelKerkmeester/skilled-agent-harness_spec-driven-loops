# Research Synthesis: Stored Route Receipts for Weak Follow-Ups

This synthesis covers a single-lineage `/deep:research` run on 2026-11-18, session `2026-11-18T19:04:03Z`. Claude Opus 5.5 ran 3 iterations at high effort through cli-claude-code on the operator's second Claude account, from the worktree `474-advisor-pasted-context-and-crash-fallback` at `cd525086034`. It answers Q1 to Q5 of the Research Brief in `../spec.md`. Q0 was closed before the run and was not rerun: over-suppresses branch, stripped-text `H=5`, raw-text `H=4`, `Hsame=2`, `C=19`, `N=9` (`../implementation-summary.md`, Verification table).

The iterations could not run the append gateway or any `node` probe, because the headless permission layer asked for approval and no one could give it. The orchestrator recorded each iteration's unchanged delta record through the gateway. Section 10 lists the citation check.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Scope, Method and Inputs](#2-scope-method-and-inputs)
- [3. Q1 Receipt Contents and the Guard's Action](#3-q1-receipt-contents-and-the-guards-action)
- [4. Q2 The State Store](#4-q2-the-state-store)
- [5. Q3 Expiry](#5-q3-expiry)
- [6. Q4 Runtime Reach](#6-q4-runtime-reach)
- [7. Q5 The Measurement](#7-q5-the-measurement)
- [8. Amendment for Phase 011](#8-amendment-for-phase-011)
- [Eliminated Alternatives](#eliminated-alternatives)
- [Divergence Map](#divergence-map)
- [9. Open Questions](#9-open-questions)
- [10. Citation Verification Ledger](#10-citation-verification-ledger)
- [11. Evidence Quality and Caveats](#11-evidence-quality-and-caveats)
- [12. References](#12-references)
- [13. Convergence Report](#13-convergence-report)

---

## 1. Executive Summary

A route receipt is a small per-session file that records the last unfloored top-1 skill the advisor delivered. It also records the lifecycle clock at that moment and the transcript size. On a later turn the hook suppresses the brief (`Advisor: prompt skipped.`) only when five things hold: the receipt is fresh, the stripped follow-up reads as work intent, its top-1 is floored, its top-1 differs from the receipt, and the prompt has the shape of a weak follow-up. That shape means at least one back-reference word and at most 3 content words.

- **Q1:** suppress, do not reuse. Only unfloored `ok` turns write a receipt. The guard calls the policy on stripped text itself (iterations 1 and 3).
- **Q2:** a pure-TypeScript store in a `route-receipts/` folder beside the lifecycle and Vibe stores, under the shared state base. It writes a temp file and renames it, with no lock and no Python helper change. The bound reuses `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` (iteration 2).
- **Q3:** expire on a lifecycle clock mismatch or a transcript shrink. No age limit and no turn count. If the clock's spawn cost is rejected, fall back to shrink plus a 30-minute age limit (iterations 2 and 3).
- **Q4:** Claude, Codex and Vibe are in. DSH is in with one boundary call added. Pi and OpenCode are out, for reasons stated in section 6 (iteration 3).
- **Q5:** both a pure decision function the bench calls and a hook-level replay. The threshold is `H_after = 0` of 5, with `Hsame`, the negative controls and `C_after = 0` all unchanged. One false-carry pair is frozen (iteration 3).

The largest open risk sits under Q5. Nobody has measured whether the five harm-pair **task** tops are unfloored. A floored task writes no receipt, so the guard cannot fire for that pair. Phase 011 must measure this first and stop if any of the five is floored (section 7).

## 2. Scope, Method and Inputs

- **Lineage:** one, 3 iterations, stop policy `max-iterations`, convergence threshold 0.05. The run stopped on `maxIterationsReached` with all 5 key questions answered.
- **Focus by iteration:**

| Run | Focus | newInfoRatio | Answered |
|---|---|---|---|
| 1 | Q1, first pass at Q2 | 0.83 | Q1 |
| 2 | Q2 closure, Q3 bridge through the lifecycle clock | 0.81 | Q2 |
| 3 | Q3 closure, Q4, Q5 | 0.78 | Q3, Q4, Q5 |

- **Read:** the shared handler `hooks/claude/user-prompt-submit.ts` as phase 009 leaves it, the prompt policy, brief, render and scorer code, the bench, the directive-lifecycle TypeScript and Python stores, the Pi, DSH, Vibe and Codex adapters, the Claude and Codex session-lifecycle hooks, the OpenCode plugin and the host hook configs. Full list in section 12.
- **Not read:** the extension under `../context/pi-context-decisions-main/`. None of the five designs depends on it. The brief names its two bounded context channels as reference only.
- **Not run:** any in-process probe. Iteration 1 tried one through `dist/` and the permission layer refused it, so the weak-follow-up separator table is hand-worked (section 3).

## 3. Q1 Receipt Contents and the Guard's Action

### Findings

1. **The hook's skip gate reads the raw prompt.** `skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt)`, with `prompt` only normalized, and `skippedAdvisorResultFor` calls `shouldFireAdvisor(prompt)` unchanged [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:435] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:457] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:420-423]. The explicit-marker branch wins over work intent [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:171-191]. The guard must call `shouldFireAdvisor(stripLeadingPastedReply(prompt))` itself, as the bench does [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:231]. CONFIRMED from code.
2. **The floor flag stops at the scorer.** The scorer sets `confidenceFloored` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1397-1414]. An `rg -n confidenceFloored` over the schema, handler, subprocess type and CLI fallback returns nothing. CONFIRMED (the orchestrator reran the `rg` with exit 1, no lines). Phase 011's five carry edits stay.
3. **Suppress has a render path; reuse needs a full recommendation.** A skipped `unavailable` result renders `Advisor: prompt skipped.` plus the directive block [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:644-665]. A normal brief needs `skill`, `confidence`, `uncertainty`, `passes_threshold`, `command`/`needsMode` and the payload's `skillLabel` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:530-561]. `skippedAdvisorResultFor` returns `null` whenever the policy fires [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:423], and a weak follow-up always fires, so suppress needs a new exported helper over the private result builder. CONFIRMED from code. That reuse would print an old score as if new is INFERRED from the render contract.
4. **Membership in the floored passing set does not separate the cases; prompt shape does.** The policy floor is 3 meaningful tokens, and the stop words and work verbs are listed in the policy data [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:95-113]. Iteration 1 counted by hand:

   | Prompt (stripped) | Meaningful tokens | Back-reference words | Content words |
   |---|---|---|---|
   | pair 1/9 `fix that too` | 3 | that, too | 0 |
   | pair 3 `add one more task there` | 5 | there | 3 |
   | pair 5 `update it again with the new name` | 4 | it, again | 2 |
   | pair 6 `now fix the remaining ones` | 4 | remaining, ones | 1 |
   | pair 7 `apply that change to the second file as well` | 7 | that, as, well | 3 |
   | pair 8 `add tests for it as well` | 4 | it, as, well | 1 |
   | false carry `Refactor the session store module to remove duplicated locking code` | 8 | none | 6 |

   INFERRED: the counts are hand-worked. Running the table through `shouldFireAdvisor` and the tokenizer after a rebuild would confirm it.
5. **Negative controls stay out.** Pair 2 reads `length_and_token_threshold` and pair 4 reads `below_prompt_policy_threshold`. The bench's stripped-reason check already drops both [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:232]. CONFIRMED.
6. **Phase 011's hook anchors are stale.** After phase 009 the result build is at `:457-470`, the render at `:480-482` and the dedup at `:483` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:457-483]. CONFIRMED.

### Recommended design

- **Receipt fields (final, after iterations 2 and 3 amended them):** `version: 1`, `sessionId`, `skill` (the delivered top-1 skill id), `storeGeneration` and `lifecycleEpoch` from `state.clock(sessionId)`, and `transcriptBytes` (or `null`). No confidence, uncertainty, prompt hash, `floored` or `writtenAt` field: nothing reads them.
- **Turns that write:** only a turn with `status: 'ok'`, a non-null rendered brief and an unfloored top-1. Skipped, degraded, fail-open, no-match, crash and guarded turns write nothing, so a run of floored follow-ups cannot drift the receipt.
- **Guard predicate, all must hold:** (a) a fresh receipt exists (section 5); (b) `shouldFireAdvisor(stripLeadingPastedReply(prompt)).reason === 'work_intent_with_meaningful_tokens'`; (c) the delivered top-1 is floored; (d) the top-1 differs from `receipt.skill`, so pairs 7 and 8 pass through; (e) `isWeakFollowUp(stripped)`, meaning at least one word from the closed list `that, it, this, there, them, those, these, same, again, too, also, well, remaining, ones` and at most 3 content words.
- **Action: suppress.** Emit the skipped result through a new exported helper with policy reason `weak_follow_up_receipt`. INFERRED, a judgment from the error asymmetry: a false carry under suppress withholds a route, while under reuse it pushes the wrong one. The earlier brief is already in context.

## 4. Q2 The State Store

### Findings

1. **The lifecycle record cannot carry a receipt.** The schema is version 2 [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:9]. `evaluate` rebuilds the record from fixed keys plus the clock [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:250-256], and `write_record` copies only those keys [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:235-241]. A `skill` field would be dropped on the next matched turn. CONFIRMED.
2. **The helper's atomic, locked write is private to it.** Temp file with `O_CREAT | O_EXCL | O_NOFOLLOW`, `fsync`, same-directory `rename` and a directory `fsync` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:121-143], under one exclusive `flock` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:353-362], with a fixed op table [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:276-309]. CONFIRMED.
3. **Each helper call is a `python3` spawn capped at 750 ms** [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:22] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:113-145]. CONFIRMED.
4. **The lifecycle state is split by `cwd`** [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:79-81]. CONFIRMED. `.skilled/skills/.state/` is ruled out because it is repo-scoped while the other per-session stores live under the temp base. INFERRED.
5. **Vibe's head receipts share the base and show the plain-file pattern.** Both resolve `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, defaulting to `join(tmpdir(), 'speckit-advisor')` [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:69-70] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:46-48]. Vibe evicts by `mtime` at the cap and swallows write errors [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:89-108]. The lifecycle bound is `MAX_DIRECTIVE_LIFECYCLE_SESSIONS = 64` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:8], evicted by `mtime` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:215-226], with stale temp files removed after 5 minutes [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:199-212]. CONFIRMED.
6. **The guard fails toward delivery, so no lock is needed.** A missing, torn, evicted or stale receipt means no guard, which is today's behavior. Two writers on one session each leave a valid unfloored route. INFERRED from the predicate and the POSIX same-directory `rename` guarantee. A two-writer test in 011 confirms it.

### Recommended design

- **Location:** `route-receipts/` under the shared state base, resolved like the lifecycle and Vibe stores. One `<sha256(sessionId)[:16]>.json` per session, directory mode `0o700`, file mode `0o600`.
- **Writes:** pure TypeScript in `hooks/lib/route-receipt.ts`. Write a temp file in the same folder with `wx`, then `renameSync` it onto the target. No `flock` and no new Python op. Refuse a symlinked base or folder and a receipt over 4 KiB. That the symlink check carries weight on Linux's shared `/tmp` is INFERRED.
- **Reads:** parse it, check `version === 1` and the field types. Any failure means no receipt, so the turn delivers.
- **Bound:** import `MAX_DIRECTIVE_LIFECYCLE_SESSIONS`. On a new target, evict the oldest `*.json` by `mtime` to the cap minus one, and remove temp files older than 5 minutes.
- **Clock cost:** call `state.clock()` on the read side only after the cheap predicates (b) to (e) hold, and on the write side only on an `ok`, unfloored turn. That one extra spawn per delivered turn is acceptable is unmeasured. Section 5 gives the fallback.

## 5. Q3 Expiry

### Findings

1. **A boundary rotates the stored clock.** `advance-session` deletes the session record and writes a fresh epoch, and `advance-generation` resets every session [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:297-308]. The boundary adapter calls one of them whatever the boundary name [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:31-37] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:183-191]. CONFIRMED. A clock-bound receipt expires on every boundary with no change to the boundary path.
2. **The prompt hook's dropped `clear` does not leak.** `lifecycleEventFor` maps only `startup`, `resume` and `compact` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:227-237], and only feeds `forceFull` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:334-343]. Claude's SessionStart passes the host `source`, `clear` included, straight to the boundary [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:262-267] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:37]. CONFIRMED for Claude.

### Recommended design

- **Expire on clock mismatch or transcript shrink.** The guard fires only when the receipt's `{storeGeneration, lifecycleEpoch}` equals `state.clock(sessionId)`. When both byte counts are numbers, the current transcript bytes must also be at least `receipt.transcriptBytes`. A `null` clock means no guard. The shrink check catches a host rewind with no boundary. INFERRED: no rewind path was traced.
- **No turn count:** a run of weak follow-ups should keep suppressing against the same route, and a counter would need a write on guarded turns. **No age limit while the clock is present:** on Claude, Codex and Vibe every event that removes the earlier brief from context rotates the clock. Both are INFERRED design judgments.
- **Fallback, only if 011 measures the `clock` spawn and rejects it:** drop the clock fields and expire on transcript shrink plus a 30-minute age limit from a `writtenAt` field. INFERRED: 30 minutes is a judgment, not a measurement.

## 6. Q4 Runtime Reach

### Findings

1. **Claude** rotates the clock on every SessionStart source and on PreCompact for the session. It skips sub-agent payloads, and falls back to a no-session boundary without stdin [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:262-267] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:578-588] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:350-351]. CONFIRMED.
2. **Codex** forwards its whole input to the Claude adapters for the prompt and for SessionStart [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:90-115] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts:34-41]. CONFIRMED. Codex PreCompact with input was read only at its no-input branch [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:34]. INFERRED.
3. **Vibe** rotates the clock on compaction before the turn's advisor text [SOURCE: .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:52-64] [SOURCE: .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:288-293], and its prompt path passes `session_id` and `transcript_path` [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:229-237]. CONFIRMED. That missing start and resume boundaries are safe for Vibe is INFERRED: a new session has a new id, and a resumed one keeps the earlier route in context.
4. **DSH** passes `session_id` but no transcript [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:168-173]. Its `agent/created` and `compaction/end` handlers clear only its in-process map [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:59-61] [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:148-155]. CONFIRMED: no boundary reaches its file-store clock, so a DSH receipt would survive compaction. INFERRED: adding `advanceDirectiveLifecycleBoundary` calls there changes no directive delivery, because the shared store never dedups a DSH turn without a transcript [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:133].
5. **Pi** calls the handler with `prompt`, `cwd` and `hook_event_name` only [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:289-294], and the handler takes the session from `input.session_id` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:318-320]. CONFIRMED: predicate (a) can never hold for Pi.
6. **OpenCode** spawns the CLI's `advisor_recommend` and never runs the shared handler [SOURCE: .opencode/plugins/system-skill-advisor.js:137] [SOURCE: .opencode/plugins/system-skill-advisor.js:692-694]. It keeps its own boundary state in memory [SOURCE: .opencode/plugins/system-skill-advisor.js:229-246]. CONFIRMED.
7. **Vibe's head receipt fits suppress.** For a head-only context it delivers nothing on a repeated head, and otherwise stores the new head [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:173-187]. CONFIRMED. Two guarded turns in a row show `Advisor: prompt skipped.` once and then nothing. The next real route has a new head and is delivered. INFERRED: a route, guard, guard, route replay confirms it.

### Recommended design

| Host | In 011? | Session id to handler | Clock rotation | 011 change |
|---|---|---|---|---|
| Claude | In | Yes | SessionStart (all sources) and PreCompact | None beyond the hook guard |
| Codex | In | Yes, the whole input is forwarded | Through `session-prime.js` | None |
| Vibe | In | Yes, plus transcript | Compaction through `compaction-context.mjs` | A route, guard, guard, route replay test |
| DSH | In, with a boundary call | Yes, no transcript | None today | Call `advanceDirectiveLifecycleBoundary` in the `agent/created` and `compaction/end` handlers |
| Pi | Out, named deferral | No | Its own in-memory reset only | None. The deferral names three changes: pass `sessionIdFromContext(ctx)`, and add a boundary call in both reset handlers |
| OpenCode | Out | Does not run the handler | Plugin memory | None. The guard lives in the hook |

## 7. Q5 The Measurement

### Findings

1. **The bench records the task's top skill but not whether it was floored** [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:227]. Harm counts `floored && policyReason === WORK_INTENT_REASON` against the task top [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:230-234]. CONFIRMED. **UNKNOWN:** whether the tasks of harm pairs 1, 3, 5, 6 and 9 are unfloored. Under the Q1 write rule, a floored task writes no receipt and the guard cannot fire for that pair.
2. **`C` does not apply without a receipt.** Each corpus row is a single prompt with no session [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:256-262], and predicate (a) needs a fresh receipt, so a turn with no receipt always delivers. INFERRED. Running the pure function with `receipt = null` over the 19 `C` rows confirms it.

### Recommended design (frozen for 011)

- **Harness, both layers:**
  1. A pure `decideRouteReceiptGuard(receipt, clock, transcriptBytes, strippedPrompt, policyReason, top1, floored) -> 'deliver' | 'suppress'` in `hooks/lib/route-receipt.ts`. The bench's follow-up block calls it with a synthetic receipt built from the task's top, written only when that top is unfloored, and with a fixed matching clock.
  2. A hook-level replay in `runtime/tests/hooks/route-receipt.vitest.ts`. It runs each pair's task and then its follow-up through `handleClaudeUserPromptSubmit` on one session id, with `InMemoryDirectiveLifecycleStore`, an in-memory receipt store and the scorer fixed to the bench's recorded tops.
- **New bench output:** per pair `taskFloored`, `receiptWritten` and `guard`, plus `H_after`.
- **Success threshold, literal:** `H_after = 0` of `H = 5`, with pairs 1, 3, 5, 6 and 9 all `suppress`. `Hsame = 2` pairs (7, 8) `deliver`. Negative controls 2 and 4 `deliver`. `C_after = 0` suppressions over the 19 `C` rows with `receipt = null`.
- **Precondition, first:** `receiptWritten = true` for pairs 1, 3, 5, 6 and 9. If any is `false`, 011 stops and reports it, and does not lower the threshold.
- **Scorer isolation:** `rg -n 'route-receipt|routeReceipt|weak_follow_up' .skilled/skills/system-skill-advisor/runtime/lib/scorer/` prints nothing, and the `scoreAdvisorPrompt` signature and cache key are unchanged in the diff.
- **False-carry case, literal:** session task `Update the advisor README to document the new corpus file layout` (receipt `sk-doc`, if unfloored), then follow-up `Refactor the session store module to remove duplicated locking code`. The follow-up is floored `sk-code` with reason `work_intent_with_meaningful_tokens` (`../spec.md` Measured Behavior, third block). Predicate (e) fails: no back-reference word, 6 content words. **Expected: `sk-code` delivered**, and no `weak_follow_up_receipt` reason recorded.
- **Expiry rows:** pair 1 with the session epoch advanced between task and follow-up, and pair 1 with the transcript bytes shrunk. Both expect `sk-code` delivered.

## 8. Amendment for Phase 011

Phase 011's T001 applies these to `../../011-route-receipts-build/`. They are consolidated from the three iterations' "011 changes" lists, and later iterations override earlier ones.

### Files to Change

| File | Change | Description |
|---|---|---|
| `hooks/lib/route-receipt.ts` | Create | Pure-TypeScript receipt store in `route-receipts/` under the shared state base: `wx` temp file plus `renameSync`, no lock, bound from `MAX_DIRECTIVE_LIFECYCLE_SESSIONS`, `mtime` eviction on a new target, temp cleanup after 5 minutes, symlink refusal and a 4 KiB cap. Receipt fields `version`, `sessionId`, `skill`, `storeGeneration`, `lifecycleEpoch`, `transcriptBytes`. Exports `isWeakFollowUp` (closed back-reference list, content-word cap 3) and the pure `decideRouteReceiptGuard` |
| `hooks/claude/user-prompt-submit.ts` | Modify | Guard between the result build and the render, re-anchored to `:457-483` after phase 009. Writes a receipt only on `ok`, unfloored, rendered turns |
| `runtime/lib/skill-advisor-brief.ts` | Modify (now unconditional) | Exported helper over the private result builder that returns a skipped result with policy reason `weak_follow_up_receipt` |
| Schema, `publicRecommendation`, `AdvisorRecommendation`, `recommendationFromCli` | Modify (keep) | Carry `confidenceFloored` to the hook |
| `hooks/dsh/prompt-advisor.mjs` | Modify (new row) | `advanceDirectiveLifecycleBoundary(defaultDirectiveLifecycleStore(), { sessionId, boundary })` in the `agent/created` and `compaction/end` handlers |
| `runtime/bench/scorer-calibration.bench.ts` | Modify (new row) | Per-pair `taskFloored`, `receiptWritten`, `guard`, plus `H_after`, calling `decideRouteReceiptGuard`. Scorer untouched |
| `runtime/tests/hooks/route-receipt.vitest.ts` | Create | The hook replay, the frozen threshold, the false-carry pair, two expiry rows, the Vibe route-guard-guard-route row, two writers on one session, eviction past the bound and stale temp cleanup |

### REQ rows to add

- The guard reads its policy reason from stripped text through its own `shouldFireAdvisor` call, never the hook's `skippedResult`.
- A missing, unreadable, oversized, wrong-version or clock-mismatched receipt, or a `null` clock, means the guard does not fire and the turn delivers as today.
- The guard fires only when the stored clock equals `state.clock(sessionId)` and the transcript has not shrunk. There is no age or turn limit.
- No edit to `hooks/lib/directive-lifecycle-store.py`, and no change to `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION`.
- Pi and OpenCode are out of scope, for the reasons in section 6.
- The Q5 threshold, precondition and scorer-isolation `rg` as written in section 7, with the precondition checked first.

## Eliminated Alternatives

| Alternative | Why eliminated | Run |
|---|---|---|
| Floored-passing-set membership as the weak-follow-up separator | The refactor task's floored set also holds `sk-doc` | 1 |
| A raw meaningful-token cut | Separates pair 7 (7) from the refactor task (8) by one token | 1 |
| Reusing the hook's `skippedResult` as the guard's policy reason | It is computed on raw text | 1 |
| Reuse the earlier route on a guarded turn | Pushes a wrong route on a false carry, needs four more fields, prints an old score | 1 |
| Store the receipt in the lifecycle record | The helper rebuilds and copies fixed keys only | 2 |
| Ride the helper's `flock` | Needs a new helper op and spawn; the fail-to-deliver direction needs no lock | 2 |
| Clear receipts from the boundary adapter | Storing the clock expires them with no boundary change | 2 |
| `.skilled/skills/.state/` | Repo-scoped, unlike the other per-session stores | 2 |
| Turn-count expiry | Cuts off a legitimate run of weak follow-ups and needs a write on guarded turns | 3 |
| Age limit on top of the clock | Adds no safety where the clock rotates, adds a field | 3 |
| OpenCode in scope | The guard runs in the hook; the plugin calls the CLI | 3 |

## Divergence Map

- Saturated directions: none recorded. The run used `convergence_mode: default`, and no divergent pivot ran.
- Pivots taken, failures and audited overrides: none.
- Remaining frontier: the three unconfirmed claims in section 9. They are checks on the chosen design, not new directions.

## 9. Open Questions

No design question is open. Three claims need checking, and 011's first bench run or a rebuilt-`dist/` probe settles each one:

1. **UNKNOWN, blocks 011's threshold:** whether the tasks of harm pairs 1, 3, 5, 6 and 9 are unfloored (section 7, finding 1).
2. **INFERRED:** the hand-worked separator table (section 3, finding 4).
3. **INFERRED:** that Codex PreCompact notifies a boundary with the session id when it has input (section 6, finding 2).

## 10. Citation Verification Ledger

The orchestrator extracted every `[SOURCE: path:line]` tag from `iterations/iteration-001.md` to `iteration-003.md` and checked that each path exists and each line range is inside the file. **75 unique tags: 75 resolved, 0 failed.** A resolved tag proves only that the path and line exist.

To check content, the orchestrator also opened the tags behind each recommended design. Each one says what the iteration claims:

| Tag | Checked content | Result |
|---|---|---|
| `user-prompt-submit.ts:435`, `:457` | `prompt = normalizePrompt(input.prompt)`; `skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt)` | resolved, matches |
| `skill-advisor-brief.ts:420-423` | `skippedAdvisorResultFor` calls `shouldFireAdvisor(prompt)` and returns `null` when it fires | resolved, matches |
| `scorer-calibration.bench.ts:227-234` | `taskTop` is the skill only; harm uses `floored && policyReason === WORK_INTENT_REASON` on stripped text | resolved, matches |
| `directive-lifecycle-store.py:250-256` | Candidate built from fixed keys plus the clock, `schemaVersion: 2` | resolved, matches |
| `directive-lifecycle-contract.ts:8-9` | `MAX_DIRECTIVE_LIFECYCLE_SESSIONS = 64`, schema version 2 | resolved, matches |
| `vibe/prompt-advisor.mjs:69-70`, `directive-lifecycle-file-store.ts:46-48` | Both default to `join(tmpdir(), 'speckit-advisor')` under the env override | resolved, matches |
| `dsh/prompt-advisor.mjs:168-173` | `session_id` passed, no `transcript_path` | resolved, matches |
| `pi/prompt-advisor.ts:289-294` | Handler called with `prompt`, `cwd`, `hook_event_name` only | resolved, matches |
| `session-prime.ts:262-267` | Host `source` passed as the boundary, keyed by session id | resolved, matches |
| `system-skill-advisor.js:692-694` | Plugin builds `advisor_recommend` CLI args | resolved, matches |
| `confidenceFloored` absence | `rg` over schema, handler, subprocess, CLI fallback: exit 1, no lines | confirmed |

The full per-tag list of the 75 is not reproduced here. Rerun the extraction over `iterations/` to regenerate it.

### Conductor verification note

The conductor ran its own pass after the loop, at `cd525086034`. It extracted every `[SOURCE: ...]` tag from this file (57 unique citations), checked each path and line range, and printed the cited lines next to the claim.

- **Resolved, content matches:** 56 of 57. Every tag behind a recommended design in sections 3 to 8 opens on the code the finding quotes.
- **Resolved, line off:** 1. `directive-lifecycle-store.py:79-81` (section 4, finding 4) opens on the `except` cleanup. The per-`cwd` split it describes is at `:76`, `project = hashlib.sha256(os.getcwd().encode("utf-8")).hexdigest()[:12]`. The finding holds at the corrected line.
- **Failed:** 0. A 58th extracted string, the `path:line` placeholder in this section's first paragraph, is not a citation.
- **Unchecked:** none.

The conductor also ran the two probes the iterations could not run, in process on `dist/` built from `98a58b6245b`, the last code commit:

- **Section 7 precondition, was UNKNOWN, now OBSERVED: all five harm-pair tasks are unfloored.** Pairs 1 and 9 `sk-doc` 0.9373, pair 3 `system-spec-kit` 0.95, pair 5 `mcp-tooling` 0.8569, pair 6 `system-deep-loop` 0.929, each `floored=false`. The task tops that are floored are pair 4 `sk-design` 0.82, a negative control, and pair 8 `sk-code` 0.82, an `Hsame` pair, so neither writes a receipt and both deliver as the threshold expects. Phase 011 still runs the precondition check first, as section 7 says.
- **Section 3 separator table, was INFERRED, now OBSERVED for the meaningful-token column.** `shouldFireAdvisor(stripLeadingPastedReply(p))` returns `work_intent_with_meaningful_tokens` for all six follow-ups and the false-carry follow-up, with meaningful counts 3, 5, 4, 4, 7, 4 and 8, the same as the hand-worked table. The back-reference and content-word columns stay hand-worked, and phase 011's `isWeakFollowUp` tests settle them.

## 11. Evidence Quality and Caveats

- Code reads carry the iterations' CONFIRMED tags. Every recommendation that rests on judgment is marked INFERRED in its section: suppress over reuse, no turn count, no age limit, the 30-minute fallback and the lock-free safety argument.
- No runtime probe ran. The iterations could not run `node` or the append gateway under the headless permission layer, so the separator table and the floored state of the task tops are unmeasured.
- Opus planned phases 003 and 011 and researched this design too, so the design judgments are a single model's lens. The 011 tests named in section 7 are the external check.
- The line anchors are at worktree commit `cd525086034` and will move with later edits.

## 12. References

- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts`, `runtime/data/prompt-policy.default.json`, `runtime/lib/skill-advisor-brief.ts`, `runtime/lib/render.ts`, `runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts`
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `directive-lifecycle-contract.ts`, `directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py`, `hooks/claude/directive-lifecycle-boundary.ts`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `hooks/dsh/prompt-advisor.mjs`, `hooks/vibe/prompt-advisor.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`, `compact-inject.ts`, `directive-lifecycle-boundary.ts`; `runtime/hooks/codex/shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `compact-inject.ts`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/directive-lifecycle/README.md`
- `.opencode/plugins/system-skill-advisor.js`; `.claude/settings.json`, `.codex/hooks.json`, `.vibe/hooks.toml`
- `../spec.md` (Research Brief, Measured Behavior), `../implementation-summary.md` (Q0), `../../011-route-receipts-build/spec.md`
- Iteration files: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`; resource map: `resource-map.md`

## 13. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: Q1 Receipt contents and the guard's action, with Q2 The state store if budget allows (0.83); run 2: Q2 The state store (closure), with the lifecycle clock as the bridge into Q3 (0.81); run 3: Q3 Expiry (closure), Q4 Runtime reach and Q5 The measurement (0.78)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- The final stop decision recorded `sourceDiversity` as a blocker that the terminal cap bypasses.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
