---
title: "Feature Specification: Phase 10: sk-prompt"
description: "Read every in-scope doc of .skilled/skills/sk-prompt for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "sk prompt"
  - "phase 10 sk prompt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: sk-prompt

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-04 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 13 |
| **Predecessor** | 009-sk-git |
| **Successor** | 011-system-deep-loop |
| **Handoff Criteria** | Luna passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers `.skilled/skills/sk-prompt`: 9 docs, listed in `scratch/scope.txt`.

**Scope Boundary**: the files in `scratch/scope.txt`. Changelogs, playbooks, feature catalogs, benchmarks and tests stay out.

**Dependencies**:
- The render checks in `validate_document.py` and the review rubric in the parent `spec.md`.

**Deliverables**:
- The refined docs, `scratch/findings.md`, the review rounds and `scratch/gate-after.txt`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The docs of `.skilled/skills/sk-prompt` were never read as a whole for readability, layout and structure. The render checks reported `files=9 render_warnings=2 invalid=0` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/scope.txt
files=9 render_warnings=2 invalid=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit each doc against the parent rubric with Luna 6 xhigh on the fast tier, read-only.
- Apply the findings with DeepSeek V4.1 Flash high on the DevPass route.
- Re-read the diff with Luna until it passes, at most three rounds.

### Out of Scope
- Changing what a rule, contract or example says - the program refines form only.
- Headings other files link to - `scratch/inbound-anchors.txt` lists them and they keep their text.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-prompt/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/assets/format-guide-json.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/assets/format-guide-markdown.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/assets/format-guide-yaml.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/references/improvement-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-prompt/references/patterns-evaluation.md` | Modify | Readability, layout and structure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope doc stays valid with no render warning | `scope-gate.py` prints `render_warnings=0 invalid=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A second model family passes the diff | The last `scratch/review-N.md` opens `VERDICT: PASS` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scope gate prints `render_warnings=0 invalid=0`.
- **SC-002**: Luna's last review opens `VERDICT: PASS`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | codex Luna and pi DevPass DeepSeek | A step cannot run | On a quota stop, stop and ask; never re-route a GPT model |
| Risk | A fix changes a claim while moving text | Med | Luna's review checks claims against the diff each round |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


