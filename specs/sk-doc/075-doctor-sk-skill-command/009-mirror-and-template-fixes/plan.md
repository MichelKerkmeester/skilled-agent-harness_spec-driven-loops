---
title: "Implementation Plan: Phase 9: mirror-and-template-fixes"
description: "Add the Hermes skills check to the /doctor:runtime-mirrors route and YAML with a contract test, and replace the stale in-SKILL.md router wording in the leaf-manifest config template, proved by route-validate, the new test and a repository sweep."
trigger_phrases:
  - "mirror and template fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: mirror-and-template-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML route manifest and workflow, JSON template, Node.js test |
| **Framework** | Doctor command family, sk-create-skill assets |
| **Storage** | None |
| **Testing** | `node --test`, `route-validate.sh`, `rg` sweep |

### Overview
Two small fixes. The runtime-mirrors route gains the Hermes skills check in its manifest line and its workflow, and a new contract test pins both. The leaf-manifest config template loses its stale router wording, and a sweep proves no other template still has it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: none; `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` runs from the repository root

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and `rg -n "in-SKILL.md router" .skilled/skills` exits 1
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest line plus workflow step.

### Key Components
- **Runtime-mirrors route and YAML**: one more check-only checker, same verdict mapping as the eight existing ones.
- **Leaf-manifest config template**: one string in `_template`.

### Data Flow
`route-validate.py` requires every `script_invocations` script to be invoked by the YAML (`.skilled/commands/doctor/scripts/route-validate.py:12-33`), so the manifest line and the YAML step land together.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_routes.yaml` runtime-mirrors route | Lists the checkers | update | `route-validate.sh` exit 0 |
| `doctor-runtime-mirrors.yaml` | Runs the checkers, prints repairs | update | contract test |
| `skill-leaf-manifest-config-template.json` | Hand-authoring scaffold | update | `rg` sweep, JSON parse, `create-journey-proof.test.cjs` |
| `doctor-runtime-mirrors-presentation.txt` | Renders one row per checker run | not a consumer of the change (generic table) | read of its section 2 |

Required inventories:
- Same-class producers: `rg -n -i "SKILL\.md.{0,20}router|router.{0,20}in SKILL\.md" .skilled/skills/*/assets .skilled/skills/*/*/assets .skilled/skills/system-spec-kit/templates`.
- Consumers of changed symbols: `rg -n "skill-leaf-manifest-config-template" .skilled`.
- Matrix axes: `.hermes/` present or absent by mirror in sync or drifted.
- Algorithm invariant: the route never runs a generator in write mode.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation makes the two fixes and the test, and Verification runs the gates and the sweep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Route and YAML carry the Hermes check | `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` |
| Integration | Route table and template consumers | `route-validate.sh`, `run-all.sh`, `create-journey-proof.test.cjs` |
| Manual | `/doctor:runtime-mirrors` with one Hermes copy edited, then restored | Agent runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared` | Internal | Green | The Hermes check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: route-validate or the doctor suite fails after the change.
- **Procedure**: Revert the phase commit; both edits are independent lines.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 10 |
<!-- /ANCHOR:phase-deps -->

---

