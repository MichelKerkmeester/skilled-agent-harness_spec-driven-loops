---
title: "Feature Specification: Follow-Up Routing Benchmark with Floor Counter"
description: "Short follow-ups such as \"fix that too\" pass the advisor's bars only because of the 0.82 confidence floor. This phase measures how often that happens and whether such follow-ups route away from the session's task, and ships a guard only if a rule fixed before the run says so."
trigger_phrases:
  - "follow-up routing benchmark"
  - "phase 3 follow-up routing benchmark"
  - "confidence floor counter"
  - "weak follow-up guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Follow-Up Routing Benchmark with Floor Counter

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 004-crash-path-fallback |
| **Successor** | None |
| **Handoff Criteria** | The calibration bench prints the floor counts and the follow-up pair results, the decision rule in section 4 is applied to them, and `implementation-summary.md` records the outcome: guard shipped, or closed with the measurement and no guard. This is the last phase of the packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the pi-context-decisions refinement packet. It implements R3 with R5 folded into its benchmark, as `../001-deep-research/research/review-overengineering-opus-high.md` Group 1 sets out.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: Measure first, inside the existing calibration bench, with no diagnostics-schema change. Code outside the bench changes only if the decision rule says the guard ships.

**Dependencies**:
- Phase 002 lands first, so the measurement runs on the scorer with the stripping rule in place. Its exported strip function is what the bench and the guard call before `shouldFireAdvisor`.
- Phase 004 lands before this phase. Both edit `hooks/claude/user-prompt-submit.ts` and its hook test, and this phase's guard would shift every line 004 pins.
- The scorer already sets `confidenceFloored` per recommendation (`runtime/lib/scorer/fusion.ts:1394-1411`, typed at `runtime/lib/scorer/types.ts:174`, read at `runtime/lib/scorer/ambiguity.ts:73`).

**Deliverables**:
- Floor counts and follow-up pair results printed by `runtime/bench/scorer-calibration.bench.ts`.
- A recorded decision, and the guard only when the rule says ship.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A three-word follow-up such as "fix that too" fires the work-intent policy rule (`runtime/lib/prompt-policy.ts:182-185`), and three skills pass at exactly the 0.82 confidence floor. Nothing ties that route to the session's task, so the brief can steer the model away from it. Nobody knows how often that happens. The scorer marks a floored confidence, but the public output drops the flag: the recommendation schema is strict and has no such field (`runtime/schemas/advisor-tool-schemas.ts:305-332`), so no guard outside the daemon can see it.

### Purpose
Know, from a measurement fixed before it runs, whether weak follow-ups route away from the session task often enough to justify a guard, and ship that guard only if they do and it hides no correct route.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18. The first command is the public CLI. The second scores in-process from the advisor runtime folder, where the flag is still present.

```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const d=JSON.parse(s).data;console.log(d.recommendations.map(r=>r.skillId+" "+r.confidence+" floored="+r.confidenceFloored).join(", "))})'
sk-code 0.82 floored=undefined, sk-doc 0.82 floored=undefined, local-webflow 0.82 floored=undefined

$ cd .skilled/skills/system-skill-advisor/runtime && node --input-type=module -e 'const {scoreAdvisorPrompt}=await import("./dist/runtime/lib/scorer/fusion.js");const {shouldFireAdvisor}=await import("./dist/runtime/lib/prompt-policy.js");for(const p of ["fix that too","Refactor the session store module to remove duplicated locking code"]){const r=scoreAdvisorPrompt(p,{workspaceRoot:process.cwd()+"/../../../.."});const t=r.recommendations.find(x=>x.skill===r.topSkill);console.log(p+" | "+shouldFireAdvisor(p).reason+" | "+t.skill+" "+t.confidence+" floored="+(t.confidenceFloored===true))}'
fix that too | work_intent_with_meaningful_tokens | sk-code 0.82 floored=true
Refactor the session store module to remove duplicated locking code | work_intent_with_meaningful_tokens | sk-code 0.82 floored=true
```

The second line of the in-process output matters. A complete standalone task meets the same guard condition as the weak follow-up, so the simple guard would hide that correct route too.

These outputs came from the build in place before a merge at 12:27 the same day changed the scorer source. Scoring the merged source in-process under the runtime's vitest gives the same result: `sk-code`, `sk-doc` and a third skill at 0.82, all floored, for "fix that too", and `sk-code` 0.82 floored for the refactor task.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count, in the calibration bench, the labeled-corpus rows whose top-1 pass is floored, split by correct and wrong and by policy reason. Print the counts on the bench's existing JSON log line.
- Add an inline set of follow-up pairs to the same bench. Score each task and follow-up with `scoreAdvisorPrompt`, call `shouldFireAdvisor` on phase 002's stripped text, and print the result per pair.
- Call `shouldFireAdvisor` on phase 002's stripped text, never the raw prompt, in both the bench and the guard. The policy treats any `sk-`, `system-`, `cli-` or `mcp-` name as an explicit marker (`runtime/lib/prompt-policy.ts:58`) and checks that marker before work intent (`:171`). So a pasted reply that names a skill would turn the guard off on the raw prompt.
- Apply the decision rule in section 4 and record the outcome.
- Only if the rule says ship: carry `confidenceFloored` through the public recommend output, and add the guard to the shared Claude handler with one test.

### Out of Scope
- Stored route receipts (N4) - new per-session state on three runtimes. Deferred unless the simple guard over-suppresses, and even then it needs an operator decision first.
- A runtime diagnostics counter or any diagnostics-schema change - nothing reads it. The bench counter is enough.
- The guard in the OpenCode plugin - the plugin renders its own brief from the CLI output, so the shared handler does not reach it. Named as a gap if the guard ships.
- New corpus rows in `labeled-prompts.jsonl` - they would move the pinned corpus hashes. The pairs stay inline in the bench.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/bench/scorer-calibration.bench.ts` | Modify | Floor counts and inline follow-up pairs, printed on the log line |
| `runtime/schemas/advisor-tool-schemas.ts` | Modify, only if the guard ships | Optional `confidenceFloored: true` on the strict recommendation schema |
| `runtime/handlers/advisor-recommend.ts` | Modify, only if the guard ships | `publicRecommendation` copies the flag |
| `runtime/lib/subprocess.ts` | Modify, only if the guard ships | The flag on `AdvisorRecommendation` |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modify, only if the guard ships | `recommendationFromCli` keeps the flag |
| `runtime/lib/skill-advisor-brief.ts` | Modify, only if the guard ships | Export one helper that builds the skipped result through the private `result` builder, with status `skipped` and freshness `unavailable` |
| `hooks/claude/user-prompt-submit.ts` | Modify, only if the guard ships | The guard, before the brief renders |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify, only if the guard ships | One guard test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

**Decision rule, fixed before the run.** Let `N` be the number of follow-up pairs. `N = 9`, so `ceil(N / 2) = 5`. Pairs 2 and 4 have no task verb and are negative controls. They stay inside `N`.
- Harm `H` counts pairs whose follow-up fires the work-intent rule, has a floored top-1 pass and names a different top-1 skill than its task prompt.
- Collateral `C` counts labeled-corpus rows with a gold skill whose policy reason is work-intent and whose top-1 is a floored pass equal to the gold skill. These are correct routes the guard would hide.
- Ship the guard only when `H >= ceil(N / 2)` and `C = 0`, so `H >= 5`.
- When `H >= ceil(N / 2)` and `C > 0`, the simple guard over-suppresses. Close without the guard and record that N4's deferral condition is met, for the operator to decide.
- When `H < ceil(N / 2)`, close with the measurement and no guard.
- The bench prints the ids of the `C` rows.
- The bench also reports `Hsame`, the guarded pairs whose follow-up top-1 matches the task's top-1, and each follow-up's full floored set. These are reported only. The rule does not gate on them.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The bench counts floored top-1 passes on the labeled corpus | `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from `runtime/` exits 0 and its `advisor-scorer-calibration` line carries the floored counts, split by correct, wrong and work-intent |
| REQ-002 | The bench scores the follow-up pairs | The same run prints one `advisor-follow-up-routing` line with `N`, `H`, `Hsame` and, per pair, the task top-1, the follow-up top-1, the floored flag, the policy reason from the stripped text and the follow-up's full floored set |
| REQ-003 | The decision follows the rule | `implementation-summary.md` quotes `N`, `H`, `C` and the ids of the `C` rows from the run, and names the branch of the rule taken |
| REQ-004 | No diagnostics or baseline schema change | `git diff --stat` lists no change to `runtime/lib/metrics.ts` or `runtime/bench/scorer-calibration-baseline.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Only if the guard ships: the flag reaches the public output | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json` shows `"confidenceFloored": true` on the floored recommendations, after a rebuild |
| REQ-006 | Only if the guard ships: a guarded prompt gets no route | The guard returns the policy's skipped result, status `skipped` and freshness `unavailable`, built through the policy's existing skipped builder. The new hook test passes: a work-intent prompt with a floored top-1 gets the `Advisor: prompt skipped.` head and the hygiene directive, and a prompt whose top-1 is not floored keeps its route |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One bench run prints `N`, `H` and `C`, and the recorded decision matches the rule.
- **SC-002**: If the guard ships, `npx vitest run tests/hooks tests/schemas tests/handlers` from `runtime/` exits 0. The schema and handler tests are included because `AdvisorRecommendationSchema` is strict (`runtime/schemas/advisor-tool-schemas.ts:332`). If the guard does not ship, no file outside the bench changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's stripping rule changes what the scorer sees | A run before 002 lands measures a different scorer | Start this phase after 002's gates are green |
| Dependency | Commit `67782cf23f0` (`specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups`) drops floor-only ties (`runtime/lib/scorer/ambiguity.ts:100-123`). It runs only on the low-information branch (`runtime/lib/scorer/fusion.ts:1503`), which needs three or fewer meaningful tokens and no task verb (`:1494-1496`). "fix" is a task verb (`:80`). So it touches only short prompts with no task verb: it can move corpus floored counts but not the follow-up pairs | Corpus floored counts from a build older than that change are not comparable | Run the bench only on a build that includes it. The planning probe on the merged source still shows "fix that too" passing at the floor |
| Risk | The pairs are hand-written, so they can favor one outcome | Med | Fix the pair list and the decision rule in `plan.md` before the first run, and compare each follow-up to its task's measured top-1, not to a label |
| Risk | The guard hides a correct route on a short real task | High if shipped blind | The rule ships the guard only when `C = 0` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open.
- Closed 2026-11-18 by the operator: "emit nothing" means the policy's existing skipped result, status `skipped` and freshness `unavailable`. The renderer shows it as `Advisor: prompt skipped.` plus the hygiene directive (`runtime/lib/render.ts:644`, `:659`, `:663`). It is built through the policy's existing skipped builder, never a hand-written literal. `{}` is ruled out because it drops the hygiene directive.
- Closed 2026-11-18 by the operator: the ship rule stays, tightened to `H >= ceil(N / 2)` with `N = 9`, so `H >= 5`, and `C = 0`. Pairs 2 and 4 are negative controls. The bench prints the ids of the `C` rows. `Hsame` and each follow-up's full floored set are reported, not gated on.
<!-- /ANCHOR:questions -->

---
