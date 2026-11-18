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
| **Status** | Planned |
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

**This spec is provisional.** Phase 010 fixes the design. The Files to Change table and the REQ rows below are the most likely design the code supports today. Task T001 rewrites them from `../010-route-receipts-research/research/research.md` before any build task starts. If phase 010's premise check takes the no-guard branch, this phase does not build.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: The receipt and its guard live in the shared hook path. The scorer, the routing corpus and the OpenCode plugin stay unchanged unless phase 010 says otherwise.

**Dependencies**:
- Phase 010 closed on the over-suppresses branch, with Q1 to Q5 answered.
- Phase 009 complete, so the hook lines this phase edits no longer move.
- The strip function `stripLeadingPastedReply` (`runtime/lib/prompt-policy.ts:242-249`) as phase 006 leaves it.

**Deliverables**:
- A receipt module, its store and one pure decision function the hook and the bench both call.
- The `confidenceFloored` flag carried to the hook, which today stops at the scorer.
- The guard in the shared handler, tests for false carry and expiry, plus a receipt line in the calibration bench.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five of nine weak follow-ups send the brief to a different skill than their session task, all on the 0.82 floor (`../003-follow-up-routing-benchmark/implementation-summary.md:97`). The guard phase 003 planned keyed only on the prompt, and it would hide 19 correct corpus routes (`:96`), so it was not built (`:80`). The hook has no memory of the earlier route. It builds the result (`hooks/claude/user-prompt-submit.ts:366-378`) and renders it (`:388`) from the current prompt alone. The directive-lifecycle record keeps directives and transcript evidence, not a route (`hooks/lib/directive-lifecycle-contract.ts:21-26`).

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
- Amend this spec's Files to Change table and REQ rows from phase 010's `research/research.md` before any build (T001).
- Carry `confidenceFloored` from the scorer to the hook, along the path `heldBelow` already takes.
- Add a receipt module with a bounded per-session store and one pure decision function.
- Write a receipt after a confident route and apply the decision before the brief renders, in the shared handler, with the policy reason read from stripped text.
- Pass the session id from the Pi adapter, which sends none today (`hooks/pi/prompt-advisor.ts:289-294`).
- Measure the receipt decision on the nine follow-up pairs and the false-carry pair in the calibration bench.

### Out of Scope
- The OpenCode plugin. It spawns the CLI itself (`.opencode/plugins/system-skill-advisor.js:137`, `:694`) and keeps its own per-session state (`:229-246`), so the shared handler does not reach it. Named as a gap unless phase 010 brings it in.
- Any change to the scorer, the routing corpus or the calibration baseline. A receipt is session state, and the scorer has no session.
- Reply text in the scoring lanes. It pulls the lanes toward every skill the reply names (`../001-deep-research/research/research.md` section 5).

### Files to Change

**Provisional until 010 closes.** T001 rewrites this table from `../010-route-receipts-research/research/research.md`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `hooks/lib/route-receipt.ts` | Create | Receipt type, an in-memory store for tests, a file store in a `route-receipts/` folder under the directive state base with temp-file-and-rename writes and a 64-session bound, plus the pure decision function |
| `hooks/claude/user-prompt-submit.ts` | Modify | Read the receipt and apply the decision before the brief renders at `:388`. Write the receipt after a confident route |
| `hooks/pi/prompt-advisor.ts` | Modify | Pass `session_id: sessionIdFromContext(ctx)` in the handler input at `:290-294` |
| `runtime/schemas/advisor-tool-schemas.ts` | Modify | Optional `confidenceFloored: z.literal(true)` on the strict schema, shaped like `needsMode` at `:331` |
| `runtime/handlers/advisor-recommend.ts` | Modify | `publicRecommendation` copies the flag beside `heldBelow` at `:286` |
| `runtime/lib/subprocess.ts` | Modify | The flag on `AdvisorRecommendation` at `:39-56` |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modify | `recommendationFromCli` keeps the flag beside `heldBelow` at `:379` |
| `runtime/lib/skill-advisor-brief.ts` | Modify, only if 010 picks suppress | Export one helper that builds the skipped result through the private `result` builder (`:321`, `:432-442`) |
| `runtime/bench/scorer-calibration.bench.ts` | Modify | Run the nine pairs and the false-carry pair through the decision function and print one `advisor-follow-up-receipts` line |
| `runtime/tests/hooks/route-receipt.vitest.ts` | Create | Decision, false-carry and expiry tests |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Hook replay: a task then its follow-up on one session id, and the no-receipt case |
| `runtime/tests/hooks/prompt-advisor.vitest.ts` | Modify | Pi passes its session id to the handler |
| `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modify | `recommendationFromCli` keeps `confidenceFloored` from a CLI row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

**Provisional until 010 closes.** T001 replaces each provisional value with the one `../010-route-receipts-research/research/research.md` freezes. In this section `A` is `runtime/`. In `tasks.md`, `A` is the skill root. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from `A`. `GATES` is phase 002's corpus gate command, `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `A`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The receipt decision meets 010's success threshold on the nine follow-up pairs | `BENCH` exits 0 and prints one `advisor-follow-up-receipts` line. Provisional threshold: `"H":0`, where `H` counts guarded pairs that still deliver a top-1 other than their task's top-1, with pairs 7 and 8 keeping their route and the negative controls 2 and 4 unchanged |
| REQ-002 | A floored topic change keeps its own route | The false-carry test passes, and it failed before the decision function landed. Provisional case: after "Update the advisor README to document the new corpus file layout" leaves an `sk-doc` receipt, "Refactor the session store module to remove duplicated locking code" still delivers `sk-code` and is not suppressed |
| REQ-003 | A receipt expires | The expiry test passes: a receipt is not used after a lifecycle boundary, after the transcript shrinks or past its age limit. Provisional age limit: the value 010's Q3 sets |
| REQ-004 | The hook suite stays green | `npx vitest run tests/hooks tests/schemas tests/handlers` from `A` exits 0. The schema and handler tests are included because `AdvisorRecommendationSchema` is strict (`runtime/schemas/advisor-tool-schemas.ts:332`) |
| REQ-005 | 0 changes on the routing corpus | `GATES` exits 0, `git diff --stat -- A/scripts/routing-accuracy A/bench/scorer-calibration-baseline.json` prints nothing, and the `advisor-scorer-calibration` line's `collateral` equals 010's Q0 value |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | No receipt means today's output | A hook test with no session id, and one with an empty store, each return `additionalContext` equal to the output before this phase |
| REQ-007 | The guard reads stripped text | The hook replay of pair 9, whose pasted reply names `sk-doc` and `sk-git`, gives the same decision as pair 1 |
| REQ-008 | Pi reaches the receipt | The Pi test asserts the handler input carries the session id from `sessionIdFromContext` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One edit in the shared handler covers Claude, DSH, Vibe and Codex, and the Pi adapter change brings in Pi. OpenCode is named as a gap.
- **SC-002**: `git diff --stat` lists only the files in the amended Files to Change table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 010's design | Building this provisional table would build an unchosen design | T001 runs first and rewrites the table and REQ rows. No build task starts while `rg -n 'Provisional until 010 closes' spec.md` prints a line |
| Dependency | Phase 009 edits the same hook file | Pinned lines move | Build after 009, and re-read the hook before writing any brief |
| Risk | A receipt carries the old route into a new topic | High | REQ-002's false-carry test lands first and must fail before the decision function exists |
| Risk | Vibe drops a repeated head-only brief (`hooks/vibe/prompt-advisor.mjs:185`) | A reused head could be swallowed on Vibe | The hook replay covers a Vibe-shaped repeat, or 010's Q4 names the interaction |
| Risk | Pi passes no transcript path, so transcript-shrink expiry never fires there | Med | The age limit and Pi's own `session_start` and `session_compact` events (`hooks/pi/prompt-advisor.ts:248-254`) bound a Pi receipt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Reuse the earlier route or suppress with the policy's skipped result? Recommended default: suppress, which is the operator's 2026-11-18 meaning of "emit nothing" for phase 003. Phase 010's Q1 decides.
- Does the receipt reuse the directive-lifecycle store or get its own folder? Recommended default: its own folder under the same state base, as Vibe's head receipts do (`hooks/vibe/prompt-advisor.mjs:68-77`). Reusing the lifecycle record needs a schema bump in the Python helper (`hooks/lib/directive-lifecycle-store.py:179`). Phase 010's Q2 decides.
- OpenCode in or out? Recommended default: out, named as a gap. Phase 010's Q4 decides.
<!-- /ANCHOR:questions -->

---
