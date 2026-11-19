---
title: "Feature Specification: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider"
description: "The opencode-go gateway serves GLM-5.3, the full model, but the cli-pi roster does not list it and the cli-opencode row was a bare list entry. This packet rosters it on opencode-go only, on both CLIs, with its low/high/max ladder."
trigger_phrases:
  - "glm 5 3 opencode go roster"
  - "add glm 5 3 to the cli pi"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The opencode-go gateway lists `glm-5.3`, the full GLM-5.3 model, not the flash one. The cli-pi roster does not name it, so an operator cannot ask Pi for it by name. The cli-opencode roster names it only as a list-verified id with no ladder, price or limits.

### Purpose
An operator can ask cli-pi and cli-opencode for GLM-5.3 by name, on the opencode-go provider only, at its `low`, `high` or `max` level.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ opencode1 models opencode-go --verbose   (glm-5.3 entry)
name "GLM-5.3", status active, cost input 1.4 output 4.4 cache read 0.26,
context 1000000, output 131072, reasoning true, image input false,
variants low/high/max, release_date 2026-08-14

$ pi --list-models | rg '^opencode-go +glm'
opencode-go  glm-5.2                      1M       131.1K   yes       no
opencode-go  glm-5.3                      1M       131.1K   yes       no
opencode-go  glm-5.3-flash                1M       131.1K   yes       yes

$ opencode1 run -m opencode-go/glm-5.3 --variant <low|high|max> "Reply with exactly: OK"
Error: Model access is disabled. Change model access at https://opencode.ai/console/...   (exit 1, each level)
$ pi --offline --model opencode-go/glm-5.3 --thinking <low|high|max> -p "Reply with exactly: OK"
403: {"type":"permission_error","message":"Model access is disabled. ..."}   (exit 1, each level)
```
The operator confirmed the Go plan's usage was exhausted and asked for the rows to go in without a live reply.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the `opencode-go/glm-5.3` row in the cli-opencode roster with its ladder, limits, price and verification status.
- Add a `glm-5.3` row to the cli-pi opencode-go roster table.

### Out of Scope
- `glm-5.3-flash` - the operator asked for the full model, not flash.
- The `opencode/glm-5.3` and `mistral/zai-glm-5-3` routes - the operator asked for opencode-go only.
- Deep-loop fan-out wiring in `PI_SUPPORTED_MODELS` - the row is direct dispatch only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Rewrite the GLM-5.3 row |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Add the GLM-5.3 row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both rosters list GLM-5.3 on opencode-go with its `low`/`high`/`max` ladder | `rg -n 'Z.AI GLM-5.3, the full model'` on each roster file prints one row, and the row names `low`, `high` and `max` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The listed id answers at each level | Deferred with operator approval on 2026-11-19: the Go plan is out of usage. Both rows say they are not dispatch-verified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'Z.AI GLM-5.3, the full model'` prints 1 on each roster file.
- **SC-002**: Each row states it is not dispatch-verified and why, until a live turn answers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Go plan usage | Dispatch is refused until usage resets | The rows record the refusal and its cause |
| Risk | The ladder is from the catalog, not a live turn | Low | Re-run one turn per level after the reset and update both rows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
