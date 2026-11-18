---
title: "Feature Specification: Route Receipts Build"
description: "Weak follow-ups such as \"fix that too\" route away from the session's task on the 0.82 floor, and the guard that stops them without session state hides 19 correct corpus routes. This phase stores the earlier turn's route per session and judges a weak follow-up against it, to the design phase 010 fixes."
trigger_phrases:
  - "route receipts build"
  - "phase 11 route receipts build"
  - "stored route receipts"
  - "weak follow-up receipt guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Route Receipts Build

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 13 |
| **Predecessor** | 010-route-receipts-research |
| **Successor** | 013-drift-guard-probe-script-errors |
| **Handoff Criteria** | The receipt measurement on the nine follow-up pairs meets the threshold phase 010 froze, the false-carry and expiry tests pass, the hook, schema and handler suites are green and the routing corpus shows 0 changes. Phase 011 builds after 009 because both edit `hooks/claude/user-prompt-submit.ts` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the pi-context-decisions open-item closure. It builds N4, stored route receipts. A route receipt is a small per-session record of the route the advisor showed on an earlier turn. A weak follow-up is a short work-intent prompt whose top route passes only on the confidence floor.

The design comes from phase 010's `research/research.md` sections 3 to 8. Task T001 applied it on 2026-11-18, with the corrections listed under Design Corrections below. Phase 010 closed on the over-suppresses branch, so this phase builds.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: The receipt and its guard live in the shared hook path, plus one boundary call in the DSH adapter. The scorer, the routing corpus, the Pi adapter and the OpenCode plugin stay unchanged.

**Dependencies**:
- Phase 010 closed on the over-suppresses branch, with Q1 to Q5 answered.
- Phase 009 complete, so the hook lines this phase edits no longer move.
- The strip function `stripLeadingPastedReply` (`runtime/lib/prompt-policy.ts:247`) as phase 006 leaves it.

**Deliverables**:
- A receipt module with a file store, an in-memory store, `isWeakFollowUp` and the pure `decideRouteReceiptGuard`, which the hook and the bench both call.
- The `confidenceFloored` flag carried to the hook, which today stops at the scorer.
- The guard and the receipt write in the shared handler, a DSH boundary call, and a receipt line in the calibration bench.

### Design Corrections

Checked against the code before the build. Each changes a literal in research section 8.

- **DSH boundary call.** Section 8 gives `advanceDirectiveLifecycleBoundary(defaultDirectiveLifecycleStore(), { sessionId, boundary })`. The function takes `(state, sessionId?: string | null)` (`hooks/lib/directive-lifecycle.ts:183-191`), so an object argument normalizes to an empty id and calls `state.advanceGeneration()`, which resets every session. The adapter calls it with the session id string, and only when that id is a non-empty string, the same guard `forgetReceipt` uses (`hooks/dsh/prompt-advisor.mjs:59-61`). The `session/event` handler reads `session?.id`, not `agent?.session?.id`.
- **DSH import.** The adapter imports only `runtime/dist/hooks/claude/user-prompt-submit.js` (`hooks/dsh/prompt-advisor.mjs:17-20`), which exports neither lifecycle function. The adapter gets a second injectable import of `runtime/dist/hooks/lib/directive-lifecycle.js`.
- **Weak follow-up words.** A conductor probe from `dist/` at `98a58b6245b` printed each follow-up's tokens. `it` is a policy stop word, so back-reference words are read from all tokens, not the meaningful ones. `as` is not in the closed list. A content word is a meaningful token that is neither a back-reference word nor a work-intent verb. Observed content counts: pair 1 and 9 `0`, pair 3 `3`, pair 5 `2`, pair 6 `1`, pair 7 `4`, pair 8 `2`, false carry `6`. The policy's stop-word and work-verb sets are private to `runtime/lib/prompt-policy.ts`, so that file exports one token helper rather than the receipt module copying the sets.
- **Decision signature.** `decideRouteReceiptGuard` takes one input object, and its clock is a function called only after the cheap predicates hold, so a turn that is not a weak follow-up pays no clock spawn.
- **Pi out.** Pi passes no session id and no lifecycle boundary reaches the file-store clock (research section 6, finding 5), so the Pi adapter row, its test row and its requirement are dropped. The deferral names three changes: pass `sessionIdFromContext(ctx)`, and add a boundary call in both Pi reset handlers.
- **`C_after` dropped from the bench.** Every corpus row has no receipt, so a count of suppressions there is 0 by construction and tests nothing. REQ-005's corpus gates are the corpus check.
- **Amended at T026, from the refutation pass.** Three findings were confirmed against the code and fixed. The additive words `also`, `too` and `well` left the back-reference list, because a probe from `dist/` read "Also, create a birthday party plan", "Create a birthday party plan too" and "Write a deploy script as well" as weak follow-ups although each names new work. No bench follow-up depends on those words. A receipt is kept and read only for a confirmed session identity, by the same rule `applyDirectiveLifecycle` uses (`hooks/claude/user-prompt-submit.ts:413-414`). The file store also refuses a base or receipt folder that another user owns or that grants group or other access, the rule the lifecycle store holds its own state to (`hooks/lib/directive-lifecycle-store.py:38-41`). That rule, not a symlink check on every parent, covers a folder reached through a symlinked parent: the default macOS temp folder already sits under the symlinked `/var`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five of nine weak follow-ups send the brief to a different skill than their session task, all on the 0.82 floor (`../003-follow-up-routing-benchmark/implementation-summary.md:97`). The guard phase 003 planned keyed only on the prompt, and it would hide 19 correct corpus routes (`:96`), so it was not built (`:80`). The hook has no memory of the earlier route. It builds the result (`hooks/claude/user-prompt-submit.ts:458-470`) and renders it (`:480`) from the current prompt alone. The directive-lifecycle record keeps directives and transcript evidence, not a route (`hooks/lib/directive-lifecycle-contract.ts:21-26`).

The guard also cannot see the floor today. The scorer sets `confidenceFloored`, but the strict public recommendation schema has no such field (`runtime/schemas/advisor-tool-schemas.ts:305-332`), `publicRecommendation` copies `heldBelow` and not the flag (`runtime/handlers/advisor-recommend.ts:286`), the hook's recommendation type lacks it (`runtime/lib/subprocess.ts:39-56`) and `recommendationFromCli` drops it (`hooks/lib/skill-advisor-cli-fallback.ts:379`).

### Purpose
A weak follow-up in a session with a recent, different route no longer steers the model away from the session's task, while a prompt with no receipt routes exactly as it does today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 at `84a2d1eb697`, from `.skilled/skills/system-skill-advisor/runtime`. The probe reads `dist/`. It shows the false-carry hazard this phase must not create: after pair 1's task routes `sk-doc` with no floor, a complete refactor task is a floored work-intent prompt, the same shape as "fix that too".

```text
$ node --input-type=module -e 'const {scoreAdvisorPrompt}=await import("./dist/runtime/lib/scorer/fusion.js");const {shouldFireAdvisor}=await import("./dist/runtime/lib/prompt-policy.js");for(const p of ["Refactor the session store module to remove duplicated locking code","Update the advisor README to document the new corpus file layout"]){const r=scoreAdvisorPrompt(p,{workspaceRoot:process.cwd()+"/../../../.."});const t=r.recommendations.find(x=>x.skill===r.topSkill);console.log(p+" | "+shouldFireAdvisor(p).reason+" | "+(t?t.skill+" "+t.confidence+" floored="+(t.confidenceFloored===true):"none"))}'
Refactor the session store module to remove duplicated locking code | work_intent_with_meaningful_tokens | sk-code 0.82 floored=true
Update the advisor README to document the new corpus file layout | work_intent_with_meaningful_tokens | sk-doc 0.9373 floored=false
```

The follow-up numbers themselves, `N=9 H=5 Hsame=2 C=19` on the same commit, are in `../010-route-receipts-research/spec.md` Measured Behavior. Phase 010's Q0 replaces them with the post-006 values.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Carry `confidenceFloored` from the scorer to the hook, along the path `heldBelow` already takes.
- Add a receipt module with a bounded per-session file store, an in-memory store, `isWeakFollowUp` and the pure `decideRouteReceiptGuard`.
- In the shared handler, apply the guard after the result is built and write a receipt after an `ok`, rendered, unfloored route, each in its own try, with the policy reason read from stripped text.
- Rotate the lifecycle clock in the DSH adapter on `agent/created` and on `compaction/end`, so a DSH receipt expires there as it does on Claude, Codex and Vibe.
- Measure the guard on the nine follow-up pairs and the false-carry pair in the calibration bench.

### Out of Scope
- The Pi adapter. It passes no session id to the handler (`hooks/pi/prompt-advisor.ts:289-294`) and no boundary reaches the file-store clock, so predicate (a) never holds there (`../010-route-receipts-research/research/research.md` section 6, finding 5). Named as a gap with three changes: pass `sessionIdFromContext(ctx)`, and add a boundary call in both reset handlers.
- The OpenCode plugin. It spawns the CLI itself (`.opencode/plugins/system-skill-advisor.js:137`, `:692-694`) and keeps its own per-session state (`:229-246`), so the shared handler does not reach it (research section 6, finding 6). Named as a gap.
- Any change to the scorer, the routing corpus or the calibration baseline. A receipt is session state, and the scorer has no session.
- `hooks/lib/directive-lifecycle-store.py` and `DIRECTIVE_LIFECYCLE_SCHEMA_VERSION`. The receipt reads the clock and never rides the lifecycle record (research section 4, finding 1).
- Reply text in the scoring lanes. It pulls the lanes toward every skill the reply names (`../001-deep-research/research/research.md` section 5).

### Files to Change

From `../010-route-receipts-research/research/research.md` section 8, corrected as listed under Design Corrections.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `hooks/lib/route-receipt.ts` | Create | `RouteReceipt` (`version`, `sessionId`, `skill`, `storeGeneration`, `lifecycleEpoch`, `transcriptBytes`), `RouteReceiptStore`, `InMemoryRouteReceiptStore`, `FileRouteReceiptStore` in `route-receipts/` under the shared state base (`wx` temp file then `renameSync`, no lock, bound from `MAX_DIRECTIVE_LIFECYCLE_SESSIONS`, `mtime` eviction on a new target, temp cleanup after 5 minutes, refusal of a symlinked folder or one another user owns or can open, 4 KiB cap), `defaultRouteReceiptStore`, `isWeakFollowUp` and `decideRouteReceiptGuard` |
| `runtime/lib/prompt-policy.ts` | Modify | Export `promptPolicyTokens(prompt)`, returning the policy's tokens, meaningful tokens and work-intent verbs, so `isWeakFollowUp` reads the same sets the policy reason does |
| `hooks/claude/user-prompt-submit.ts` | Modify | Optional `routeReceiptStore` dependency beside `directiveLifecycleStore` (`:136`). The guard runs after the result build (`:458-470`) and before the metrics spread. The receipt write runs after the render (`:480`). The clock comes from `dependencies.directiveLifecycleStore ?? defaultDirectiveLifecycleStore()` |
| `runtime/lib/skill-advisor-brief.ts` | Modify | Export `skippedWeakFollowUpResult()`, the skipped result with policy reason `weak_follow_up_receipt`, built through the private `result` builder (`:321`) |
| `runtime/schemas/advisor-tool-schemas.ts` | Modify | Optional `confidenceFloored: z.literal(true)` on the strict schema, beside `needsMode` (`:331`) |
| `runtime/handlers/advisor-recommend.ts` | Modify | `publicRecommendation` copies the flag when true, beside `heldBelow` (`:286`) |
| `runtime/lib/subprocess.ts` | Modify | Optional `confidenceFloored` on `AdvisorRecommendation` (`:39-56`) |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modify | `recommendationFromCli` keeps the flag beside `heldBelow` (`:379`) |
| `hooks/dsh/prompt-advisor.mjs` | Modify | Exported `advanceBoundary(sessionId, load)` over `runtime/dist/hooks/lib/directive-lifecycle.js`, a no-op without a non-empty id. Called from the `agent/created` and `compaction/end` handlers through an injectable `core.advanceBoundary` |
| `hooks/tests/dsh-prompt-advisor.test.mjs` | Modify | The boundary runs with the session id on both events, never without one, and directive delivery is unchanged |
| `runtime/bench/scorer-calibration.bench.ts` | Modify | Per pair `taskFloored`, `receiptWritten` and `guard`, plus `H_after` and the false-carry result, through `decideRouteReceiptGuard`, printed as one `advisor-follow-up-receipts` line. Scorer untouched |
| `runtime/tests/hooks/route-receipt.vitest.ts` | Create | `isWeakFollowUp` on the seven probed prompts, the decision predicates, false carry, clock and shrink expiry, and the file store on a `mkdtemp` base: round trip, rejected reads, folders other users can open, two writers, a reader and three writers overlapping in separate processes, eviction past the bound, stale temp cleanup |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | The hook replay: task then follow-up on one session id with in-memory stores, pair 9's pasted form, false carry, epoch and shrink expiry, and the no-receipt and throwing-store cases |
| `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modify | `recommendationFromCli` keeps `confidenceFloored` from a CLI row |
| `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modify | Route, guard, guard, route: Vibe delivers the route, the skipped head once, nothing on the repeat, then the next route |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

In this section `A` is `runtime/`. In `tasks.md`, `A` is the skill root. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from `A`. `GATES` is phase 002's corpus gate command, `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `A`. `HOOKS` is `npx vitest run tests/hooks tests/schemas tests/handlers` from `A`. `DSH` is `node --test hooks/tests/dsh-prompt-advisor.test.mjs` from the skill root, run after a build, because the adapter loads `runtime/dist/`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard meets research section 7's frozen threshold on the nine follow-up pairs | `BENCH` exits 0 and prints one `advisor-follow-up-receipts` line. Checked first: `receiptWritten` is `true` for pairs 1, 3, 5, 6 and 9, and if any is `false` the phase stops and reports it without lowering the threshold. Then `"H_after":0` of `"H":5`, `guard` is `suppress` for pairs 1, 3, 5, 6 and 9, `deliver` for the `Hsame` pairs 7 and 8 and `deliver` for the negative controls 2 and 4 |
| REQ-002 | A floored topic change keeps its own route | After "Update the advisor README to document the new corpus file layout" leaves an `sk-doc` receipt, "Refactor the session store module to remove duplicated locking code" decides `deliver`, in `route-receipt.vitest.ts` and in the hook replay, and the bench's `falseCarry.guard` is `deliver`. Negative control: with predicate (e) removed from `decideRouteReceiptGuard`, the unit case fails, and it passes again once (e) is back |
| REQ-003 | A receipt expires on the lifecycle clock and on transcript shrink | The guard decides `deliver` when the stored `storeGeneration` or `lifecycleEpoch` differs from the current clock, when the clock is `null`, and when both transcript byte counts are numbers and the current one is smaller. There is no age limit and no turn limit, provided T004's clock measurement meets its pre-set bound |
| REQ-004 | The hook, schema and handler suites stay green | `HOOKS` exits 0. The schema and handler tests are included because `AdvisorRecommendationSchema` is strict (`runtime/schemas/advisor-tool-schemas.ts:332`) |
| REQ-005 | 0 changes on the routing corpus | `GATES` exits 0, `git diff --stat -- A/scripts/routing-accuracy A/bench/scorer-calibration-baseline.json` prints nothing, the `advisor-scorer-calibration` line's `collateral` is 19, and `rg -n 'route-receipt|routeReceipt|weak_follow_up' A/lib/scorer/` prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | No receipt means today's output | Hook tests with no session id, with an unconfirmed or ambiguous session identity, with an empty receipt store and with a store whose `read` throws each return `additionalContext` equal to the same follow-up's output with no receipt |
| REQ-007 | The guard reads stripped text | The guard calls `shouldFireAdvisor(stripLeadingPastedReply(prompt))` itself, never the hook's `skippedResult`, and the hook replay of pair 9, whose pasted reply names `sk-doc` and `sk-git`, gives the same decision as pair 1 |
| REQ-008 | A bad receipt is no receipt | A missing, unreadable, oversized (over 4 KiB), wrong-version or wrong-session file, a symlinked receipt folder, or a base or receipt folder another user owns or can open, reads as `null` and takes no write. Two writers on one session leave one valid receipt, and writers in separate processes that overlap on one session never show a reader a missing or torn receipt once one has landed. A new session past 64 evicts the oldest file by `mtime`, and a temp file older than 5 minutes is removed |
| REQ-009 | DSH rotates its clock on its own boundaries | `DSH` exits 0. Its tests show `advanceBoundary` called with the session id on `agent/created` and on a clean `compaction/end`, never called without a non-empty id, and the delivered notices unchanged |
| REQ-010 | Vibe's head receipt fits the guard | The Vibe replay of route, guard, guard, route delivers the route, the skipped head once, nothing on the repeated skipped head, then the next route |
| REQ-011 | The flag reaches the live hook | From a daemon started after the build, `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json` shows `"confidenceFloored": true` on each floored recommendation. Amended at T019: the CLI's local-scorer path is the Python scorer, which has no confidence floor, so it never sets the flag and the guard never fires there. That path delivers as it did before this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One edit in the shared handler covers Claude, Codex, Vibe and DSH. The DSH boundary call gives DSH the clock rotation the other three already have. Pi and OpenCode are named as gaps.
- **SC-002**: `git diff --stat` lists only the files in the Files to Change table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 009 edits the same hook file | Pinned lines move | T003 re-read the hook after 009. The anchors above are from that read |
| Risk | A receipt carries the old route into a new topic | High | REQ-002's false-carry case, with its predicate (e) negative control |
| Risk | The DSH boundary call without an id resets every session | High | `advanceBoundary` returns before the import when the id is not a non-empty string, and REQ-009 tests that case |
| Risk | A receipt fault reaches the outer catch and the turn shows the timeout fallback | Med | The guard and the write each sit in their own try that keeps the result, and REQ-006 tests a throwing store |
| Risk | The clock spawn adds latency to every delivered turn | Med | T004 measures it against a bound set before the measurement. Over the bound, the design falls back to shrink plus a 30-minute age limit (research section 5) |
| Risk | Hook tests that inject no receipt store write real receipts | Low | Vitest points `TMPDIR` at a per-run folder (`runtime/vitest.config.ts:17`), existing fixtures carry no floored flag so the guard cannot fire in them, and every new test injects `InMemoryRouteReceiptStore` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Phase 010 answered all three provisional questions: suppress rather than reuse (Q1), its own `route-receipts/` folder rather than the lifecycle record (Q2), and OpenCode out (Q4). Pi also moved out under Q4.
<!-- /ANCHOR:questions -->

---
