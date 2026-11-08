---
title: "Feature Specification: Phase 7: doctor-ux-research"
description: "Five-iteration cli-devin deep research on how the doctor overlay logic and the external-repo onboarding experience can improve, ranked by user impact."
trigger_phrases:
  - "doctor ux research"
  - "phase 7 doctor ux research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: doctor-ux-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/330-doctor-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-setup-guide |
| **Successor** | None |
| **Handoff Criteria** | research/research.md holds a ranked, code-verified recommendation list |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Research how system-skilled-doctor, its commands, the overlay logic and the external-repo user experience can improve specification.

**Scope Boundary**: Research only. The run reads code, docs and tests and writes nothing outside `research/` and this packet.

**Dependencies**:
- Phases 002 to 006, which built the overlay engine, re-pin, guard hook, Barter parity and the install guide.

**Deliverables**:
- `research/research.md` with ranked recommendations, plus the iteration files and state log.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The doctor overlay engine and the external-repo onboarding path grew over six phases. Nobody has checked them end to end from the point of view of a new external repository. Gaps between the code, the messages and the docs would surface first as a confused user or a lost overlay on re-pin.

### Purpose
A ranked list of improvements, each tied to a file and line, that a later phase can plan and build.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
N/A: research packet. The baseline is the doctor test suite on this base:
node --test .skilled/commands/doctor/scripts/tests/  ->  tests 1072, pass 1072, fail 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Audit `overlay-engine.cjs` status, apply, capture, repin and rollback against its docs and tests.
- Walk the external-repo path through `INSTALL-SKILLED.md`, `/doctor:install`, `/doctor:symlink`, `/doctor:setup` and `/doctor:helper`.
- Rank every recommendation by user impact in `research/research.md`.

### Out of Scope
- Implementing fixes - a later phase plans and builds them.
- Barter files - Barter is never committed from here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research state, iterations and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 5 deep-research iterations with cli-devin `deepseek-v4-1-flash-max` | `research/iterations/` holds iteration-001.md to iteration-005.md and the state log holds 5 iteration records |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Synthesize ranked recommendations | `research/research.md` exists and each top recommendation cites a file and line that a reader confirmed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `ls research/iterations | wc -l` prints 5.
- **SC-002**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `devin` CLI and its DeepSeek route | No iterations run | Report the failure; never fall back to another executor silently |
| Risk | A flash model reports wrong line numbers or fixed issues as new | Med | Verify the top findings against the code before synthesis is trusted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- How can system-skilled-doctor, its /doctor commands, the overlay logic and the external-repo user experience be improved? Deep research is active for this topic; `research/research.md` stays canonical.

### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which stays canonical. Five cli-devin iterations ranked 22 recommendations. Tier 1, each confirmed against the code:

1. The copy path in `INSTALL-SKILLED.md` exports no builds and skips the finishing steps.
2. Re-pin backups land in `<overlayDir>/repin-runs/`, inside the folder the guide says to commit.
3. `status` never checks the tree against `pin.commit`, and re-pin trusts that field as its drift base.
4. The overlay guard allows every write it cannot judge.
5. Rollback overwrites the live tree without a diff.
6. The `.env` prefix rule blocks `.env.example` with no escape hatch.

Q2 (command messages) and Q5 (docs against code) are partly answered; `/doctor:helper` was not examined.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


