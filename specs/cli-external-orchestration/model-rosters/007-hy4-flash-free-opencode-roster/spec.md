---
title: "Feature Specification: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels"
description: "The opencode-go gateway ships Hy4 Flash Free, but the cli-opencode roster does not list it, so an operator cannot ask for it by name. This packet adds it on the opencode-go provider at its two thinking levels."
trigger_phrases:
  - "hy4 flash free opencode roster"
  - "add hy4 flash free to the cli opencode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The opencode-go gateway lists `hy4-flash-free` (Hy4 Flash Free), released 2026-11-16, but the cli-opencode roster does not name it. The roster is closed, so an operator cannot dispatch it through cli-opencode.

### Purpose
An operator can ask cli-opencode for `opencode-go/hy4-flash-free` by name at either of its thinking levels, `none` or `high`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ opencode1 models opencode-go | rg -i hy
opencode-go/hy3
opencode-go/hy4
opencode-go/hy4-flash-free
opencode-go/hy4-preview

$ opencode1 models opencode-go --verbose   (hy4-flash-free entry)
name "Hy4 flash Free", cost input 0 output 0, context 1048576, output 65536,
reasoning true, image input true, variants none/high, release_date 2026-11-16

$ pi --list-models | rg -i hy4
opencode-go  hy4                          1.0M     65.5K    yes       yes
opencode-go  hy4-preview                  1.0M     64K      yes       no

$ opencode1 run -m opencode-go/hy4-flash-free --variant none "Reply with exactly: OK" </dev/null
> build · hy4-flash-free
OK            (exit 0)
$ opencode1 run -m opencode-go/hy4-flash-free --variant high "Reply with exactly: OK" </dev/null
> build · hy4-flash-free
OK            (exit 0)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `opencode-go/hy4-flash-free` row to the cli-opencode opencode-go roster table, naming both thinking levels.
- Add Hy4 to the list of families that section says the gateway fronts.

### Out of Scope
- cli-pi roster - the operator chose this, and Pi does not list `hy4-flash-free`.
- `hy4`, `hy4-preview` and `hy3` - the operator chose the flash-free id only.
- Deep-loop fan-out code - cli-opencode has no model allowlist in code, only a default model.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Add the roster row and the family name |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The cli-opencode roster lists `opencode-go/hy4-flash-free` with its `none` and `high` levels | `rg -n 'hy4-flash-free' .../cli-opencode/references/providers-and-models.md` prints the row, and the row names `none` and `high` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The listed id answers at both levels | `opencode1 run -m opencode-go/hy4-flash-free --variant none` and `--variant high` each print `OK` and exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'opencode-go/hy4-flash-free' .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` prints 1 or more.
- **SC-002**: A live one-turn dispatch at each level prints `OK` and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go Go-plan login on OpenCode 1 | Dispatch fails without it | The row names the `opencode providers login opencode-go` step |
| Risk | A "free" id can be withdrawn or repriced by the gateway | Med | The row says the price is the catalog's, dated, and names the paid `hy4` sibling |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
