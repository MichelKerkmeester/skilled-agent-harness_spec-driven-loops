---
title: "Feature Specification: Phase 23: vibe-review-remediation"
description: "A ten-iteration deep review of packet 004 returned CONDITIONAL with one P1: phase 022 claims 26 live passes, but VIB-HK-005, 006 and 007 failed when rerun on the shipped code. This phase fixes the three scenarios and the runner's unpinned model, hardens the compaction detector, corrects the doc drift the review found, and reruns the affected scenarios live."
trigger_phrases:
  - "vibe review remediation"
  - "phase 23 vibe review remediation"
  - "vibe compaction scenario rerun"
  - "vibe runner model pin"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: vibe-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-vibe-hook-playbook-and-live-scenarios |
| **Successor** | None |
| **Handoff Criteria** | Every review finding is fixed or closed with a reason, the affected scenarios pass live on the shipped code with the model recorded, and the parent validates recursively |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The findings in `../review/review-report.md` and the live evidence they put in doubt. No new hook behavior beyond what a finding requires.

**Dependencies**:
- Phase 022 (`022-vibe-hook-playbook-and-live-scenarios`): the scenarios, the runner's Vibe adapter and the verdict table this phase corrects.
- The deep review in `../review/`: the finding ids and their dispositions.

**Deliverables**:
- The runner pins `deepseek-flash` in its Vibe home and records the model each run used.
- VIB-HK-005, 006 and 007 rewritten so they test the hook rather than the model's mood, then passed live.
- Compaction detector fixes with tests, and the docs the review found wrong corrected.
- A disposition for every finding, recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 022 records 26 scenarios as passing live, but three of them last passed before the automatic hand-over tier changed `turn-start.mjs`, `turn-end.mjs` and `compaction-post-tool.mjs`. Rerun on the shipped code, all three failed, and the review traced each failure to the scenario or the runner rather than the hooks. The same review found smaller defects in the compaction detector and several docs that describe the hooks wrongly.

### Purpose
The Vibe playbook's live evidence holds for the code on the branch, names the model each run used, and the detector and docs match what the code does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
Rerun on the shipped code, 2026-11-15 18:42 to 18:52 local, GLM-5.3 Flash (no model pinned):
VIB-HK-005  FAIL 0/2  screen: "Where does the uploader live?" after the scripted answer
VIB-HK-006  FAIL 2/3  screen: Error: session/turn/enqueue failed: [conflict] Context compaction is already running
VIB-HK-007  FAIL 1/3  last post-tool size 210411 predates the compaction at sequence 65; no tool call followed
VIB-HK-004  PASS 2/2
VIB-HK-008  PASS 2/2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pin the runner's Vibe home to `deepseek-flash` and record the model from the session's own `meta.json` in `result.json`.
- Rewrite VIB-HK-005, 006 and 007 so each waits for or forces the event it judges, then rerun every scenario whose evidence predates a change to its hook.
- Harden the compaction detector: the seen list, the empty journal directory and the payload folder, with tests and the documented rationale for the watermark order.
- Correct the goal READMEs, the session-lifecycle README, the `turn-start.mjs` header, `guards-and-hooks.md`, the two feature catalogs and the playbook's verdict pointer.
- Correct the live-verdict claims in phase 022 and the parent.

### Out of Scope
- The hand-over `arm` cwd and the relaunch state directory fallback - the Claude and Codex adapters share both, `skilled-loop` checks the cwd before it changes into it, and `ensureStateDir` already refuses a directory it does not own.
- Whether the model follows the skill advisor's brief inside Vibe - the review deferred it, and it needs its own scenario.
- The post-tool binding's re-read of the session store on a grown journal - a cost the review asserted but did not measure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modify | Pin the Vibe model in the home config and record the session's model |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.test.cjs` | Modify | Cover the pin and the recorded model |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md` | Modify | Seed the uploader module |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md` | Modify | Wait for the compaction to finish |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md` | Modify | Force a tool call after the compaction in the same turn; replace the model pin instead of prepending a second one |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Modify | Seen list, empty journal directory, payload folder check, rationale comments |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` | Modify | Empty-section, seen-list, empty-directory and folder tests |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modify | Withdraw only on a turn that carries an operator prompt |
| Goal, session-lifecycle and mode docs named in the review | Modify | Correct the drift |
| `022-vibe-hook-playbook-and-live-scenarios/` records and the parent `spec.md` | Modify | Correct the live-verdict claims |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No phase 022 or parent record claims a live pass that a run on the current code has not shown |
| REQ-002 | VIB-HK-005, 006 and 007 pass live on the shipped code with `deepseek-flash`, and each `result.json` records the model |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The runner's Vibe home pins `deepseek-flash` without breaking a scenario that pins its own model |
| REQ-004 | The compaction detector records every compaction it consumed, measures an empty journal directory as 0 and keeps its state under the payload folder only when that folder exists |
| REQ-005 | Every doc the review found wrong states what the code does |
| REQ-006 | Every finding in `../review/review-report.md` has a recorded disposition |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/live/VIB-HK-005`, `-006` and `-007` under phase 022 each hold a `result.json` with `"verdict": "PASS"` and `"vibe_model": "deepseek-flash"` (`compaction-probe` for 007).
- **SC-002**: The session-lifecycle, session-handover and runner test suites pass with the new tests included.
- **SC-003**: `validate.sh` on the parent with `--recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Mistral subscription serving `deepseek-flash` | Live reruns cannot run | Stop and report; the unit work stands on its own |
| Risk | A live model still makes an unscripted move | Medium | Each scenario forces the event it judges, and a rerun records the model so a drift is visible |
| Risk | Advancing the watermark only once text exists would re-arm the advisor directive on every turn of a session with no goal | High | Keep the watermark ahead of the text and pin that with a test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The post-tool binding still exits after one directory read and the size stats when the journal did not grow.

### Security
- **NFR-S01**: The compaction state never lands in a folder the payload names unless that folder already exists as a directory.

### Reliability
- **NFR-R01**: Every changed hook path still fails open: an error yields no text and never throws.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session with no goal and no handoff note consumes the compaction and injects nothing, and a second call does nothing.
- Maximum input: a catch-up over more than 64 compactions keeps the newest 64 ids.
- Failure path: a payload folder that does not exist falls back to the checkout's state directory.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 15 files across hooks, the runner, three scenarios and docs |
| Risk | 8/25 | Hook changes fail open; the runner change touches every Vibe scenario |
| Research | 6/20 | Causes already traced by the review |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The watermark order is decided in this spec's risk table: it stays ahead of the text.
<!-- /ANCHOR:questions -->

---
