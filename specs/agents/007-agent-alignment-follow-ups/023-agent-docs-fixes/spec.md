---
title: "Feature Specification: Phase 23: agent-docs-fixes"
description: "Phase 20 found 21 places where a README or reference describes the agents wrongly: runtime lists that omit the .dsh and .vibe trees, wrong counts in the sync docs, missing status values, wrong tool lists and stale citations. This phase fixes each one, or records why it needs no fix."
trigger_phrases:
  - "agent docs fixes"
  - "phase 23 agent docs fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: agent-docs-fixes

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
| **Phase** | 23 of 25 |
| **Predecessor** | 022-agent-source-and-drift-checks |
| **Successor** | 024-terminal-gates-script |
| **Handoff Criteria** | Every phase 20 doc finding not closed in phase 22 is fixed or recorded with its reason, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the agent alignment follow-ups. It fixes the doc findings of phase 20 that phase 22 left: A1 to A4, A6, B1 to B4, D1 to D4 and E3 to E5.

**Scope Boundary**: Docs and one code comment that describe the agents. No agent behavior changes.

**Dependencies**:
- Phase 22, which changed two agent sources the docs now describe

**Deliverables**:
- Each finding fixed, or recorded in the implementation summary with its reason
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README, the crosswalk, `CROSS-CLI.md`, the agents README and both deep-loop skills name six or fewer agent trees, while eight ship the agents. `.vibe/SYNC.md` names a `README.md` that does not exist and says no role travels into Vibe. The deep-review skill drops the `thought` status, a tool table misclassifies three agents, and three playbook citations point at lines that moved or at a file that does not exist.

### Purpose
A reader who opens any of these docs learns where the agents live, how they sync and what they do, as the files show today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git show HEAD:.skilled/bin/agent-mirror-crosswalk.md | grep -n "^Six runtime trees"
16:Six runtime trees ship the same eleven agents: `.skilled/agents/`, `.claude/agents/`,
$ git show HEAD:.vibe/SYNC.md | grep -o "`README.md` excepted"
`README.md` excepted
$ ls .skilled/agents/README*
.skilled/agents/README.txt
$ git show HEAD:.skilled/skills/system-deep-loop/deep-review/SKILL.md | grep -n "stuck | insight"
264:`complete | timeout | error | stuck | insight`
$ grep -n "insight | thought" .skilled/agents/deep-review.md | head -1
236:- Allowed `status`: `complete | timeout | error | stuck | insight | thought`.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring every runtime list and count to the eight trees, naming which are generated, which is the fork and which are links.
- Correct `.vibe/SYNC.md`, the deep-review status enum, the deep-research tool line and the Claude tools table.
- Fix three playbook citations and two doctor docs that still describe the old roster check.

### Out of Scope
- Agent behavior - phase 22 owned the two agent changes.
- Changelogs and archived packets - they record history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/agent-mirror-crosswalk.md` | Modify | Eight trees in every table |
| `README.md`, `.skilled/CROSS-CLI.md`, `.skilled/agents/README.txt` | Modify | Runtime lists |
| Both deep-loop `SKILL.md` files | Modify | Path resolution lines |
| `.skilled/bin/check-agent-mirror-sync.cjs` | Modify | Header comment only |
| `.vibe/SYNC.md` | Modify | README name and role mapping |
| deep-review `SKILL.md`, `loop-state-and-gates.md`, deep-research `README.md`, `claude-tools.md` | Modify | Status enum, tool line, agent classes |
| Three playbook pages, the doctor scripts README, `doctor-runtime-mirrors.yaml` | Modify | Citations and roster wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No in-scope doc names fewer than the eight agent trees where it lists them. | `rg -n -i 'six runtime|Copilot runtime|five runtime surfaces'` over the in-scope files prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The status enum, tool line, agent classes and citations match the agent files. | Each cited line resolves to the rule it names, and both deep-review enums list `thought` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every phase 20 doc finding is fixed or recorded with its reason.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 22's agent changes | Low | Phase 22 is committed before these docs |
| Risk | Line citations move again on the next agent edit | Low | The citations are refreshed here from the current file; the playbook check-in rule owns later drift |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


