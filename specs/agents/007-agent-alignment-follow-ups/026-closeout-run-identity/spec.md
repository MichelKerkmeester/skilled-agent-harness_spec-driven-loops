---
title: "Feature Specification: Phase 26: closeout-run-identity"
description: "The synthesis closeout stages its ledger rows under the artifact folder's name instead of the run's session id, so a finished review records runId and sessionId as `review`. This phase takes both from the run's config."
trigger_phrases:
  - "closeout run identity"
  - "phase 26 closeout run identity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 26: closeout-run-identity

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 29 |
| **Predecessor** | 025-stop-path-live-proof |
| **Successor** | 027-review-traceability-recording |
| **Handoff Criteria** | A closeout row carries the config's session id in review and research, a test appends it through the gateway, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the agent alignment follow-ups. It closes one follow-up phase 25 recorded.

**Scope Boundary**: `synthesis-closeout.cjs` and its tests. The two workflow steps that call it change only if the script needs a new flag.

**Dependencies**:
- Phase 25's live run, whose state log shows the wrong id

**Deliverables**:
- The closeout rows scoped by the run's own session id
- A test that appends a closeout row through the gateway
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:294` sets `scopeRunId` to the basename of the state log's folder. Every other review event the workflow appends is scoped by `{session_id}`, so the `synthesis_complete` row of a root review reads `runId: review`, `sessionId: review`. Nothing live reads that scope today, but the typed reducers reject a row whose run identity differs from the run's (`run-identity-conflict`), so the ledger holds a row its own reducer cannot fold.

### Purpose
The closeout rows name the same run as every other row of that run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -o '"runId":"[^"]*","sessionId":"[^"]*"' 025-stop-path-live-proof/review/deep-review-state.jsonl
"runId":"review","sessionId":"review"
$ sed -n 294p .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs
  const scopeRunId = basename(dirname(args.stateLog)) || mode;
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the session id from the run's config beside the state log: `sessionId` for review; `runId` from `sessionId` and `lineageId` from `parentSessionId` or `sessionId` for research, the rule `deep-research.yaml` uses at init.
- Keep the folder name only as the fallback when no config is readable.
- A test per mode, plus one that appends a staged review row through the append gateway.

### Out of Scope
- A ledger stem for the duration stop. It is pinned bookkeeping like `manualStop` (`deep-review.yaml:159`), and the `terminal_gates_recorded` row carries its stop reason; recorded as no fix in the decision record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modify | Scope rows by the config's session id |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-run-identity.vitest.ts` | Create | Cases for both modes, the fallback and the gateway append |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A review closeout row carries the run's session id. | A test reads `runId` and `sessionId` equal to the config's `sessionId`, and fails on the old rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A research closeout row carries the run's run and lineage ids. | A test reads `runId` and `lineageId` from the config |
| REQ-003 | The append gateway accepts a closeout row with the new ids, the path the workflow uses. | A test stages a review `synthesis_complete` row and appends it through `append-mode-event.cjs` with exit 0, and the projected state-log row carries the config's session id |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A lineage folder has its own config with a different session id | Medium | Read the config in the state log's own folder, so a lineage keeps its own id |
| Dependency | The config file name per mode | Low | Use the names the workflows write: `deep-review-config.json`, `deep-research-config.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The duration-stop stem is decided as no fix in this phase's decision record.
<!-- /ANCHOR:questions -->

---


