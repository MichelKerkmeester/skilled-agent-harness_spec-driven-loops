---
title: "Implementation Plan: Phase 5: embeddings"
description: "Audit `/doctor:speckit embeddings` against this checkout, then apply the evidence-backed verdict: retire the route and its workflow asset, and remove the live references that would otherwise advertise a command that no longer exists."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: embeddings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command assets, YAML workflows, Bash and Python doctor scripts |
| **Framework** | The `/doctor:speckit` router over `.skilled/commands/doctor/` |
| **Storage** | Files only — the route manifest, its assets and the documentation; no database |
| **Testing** | `bash .skilled/commands/doctor/scripts/route-validate.sh`, `python3 yaml.safe_load`, the command catalog mirror check, the MCP mutation-class guard, the doctor script tests |

### Overview
Audit first, then apply. A line-numbered inventory and one read-only run establish what
`/doctor:speckit embeddings` actually does on this checkout, and the evidence supports `retire`
because the `advisor_status` contract the workflow reads no longer carries an embeddings object.
Retirement removes the route, its workflow asset, its router and presentation rows, the validator
fixtures that named it and the live documentation references to it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: audit → verdict → apply, over the command's own asset set. The doctor has no runtime of its
own, so the retirement is confined to the route manifest, the workflow asset, the router text, the
presentation, the validator fixtures and the documentation that named the target.

### Key Components
- **`_routes.yaml`**: the route manifest; the embeddings route stanza was removed here.
- **`doctor-embeddings.yaml`**: the workflow asset the verdict deletes.
- **`speckit.md` and `doctor-speckit-presentation.txt`**: the router table and all visible wording; both named the target.
- **`route-validate.sh`**: the route validator; its self-test fixtures named the embeddings target and asset.

### Data Flow
The router resolves a target against `_routes.yaml` and loads its workflow asset. Before the
retirement, `embeddings` resolved to `doctor-embeddings.yaml`, which called `advisor_status` and
read `data.embeddings.provider` and `data.embeddings.modelServer`; the strict status schema has no
such object. The audit ran the route form (exit 64, missing workspace root), the workflow form
(exit 75, sandbox IPC denial) and the validator (exit 0), then applied the removal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/_routes.yaml` (producer) | Declares the route, its flags and its CLI commands | update — embeddings stanza removed | `rg -n embedding _routes.yaml` → no matches; `route-validate.sh` → exit 0, 9 routes |
| `.skilled/commands/doctor/assets/doctor-embeddings.yaml` (producer) | The workflow the route loaded | delete | `ls` → No such file or directory |
| `.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (consumers) | Router workflow table and all visible wording | update — embeddings row and presentation entries removed | `rg -ni embedding` → no matches; the router, table and presentation parity check passes |
| `.skilled/commands/doctor/scripts/route-validate.sh` (consumer) | Self-test fixtures and route-count note | update — fixtures repointed to deep-loop; note says 9 routes | script exits 0 with 9 routes and 2 warnings |
| `README.md`, `.skilled/commands/speckit/README.txt`, `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`, `.skilled/commands/README.txt` (consumers) | Documentation that advertised `/doctor embeddings` | update — references removed or corrected | `rg -ni 'doctor embeddings'` over the four files → no live references |

Required inventories:
- Same-class producers: the route manifest and its workflow asset were the only producers for this target; `rg -ni embedding .skilled/commands/doctor/` returns no live reference to the retired target.
- Consumers of changed symbols: `speckit.md`, `doctor-speckit-presentation.txt`, `route-validate.sh`, `README.md`, `.skilled/commands/speckit/README.txt`, the doctor-commands playbook README and `.skilled/commands/README.txt`. `route-validate.sh` (exit 0, 9 routes) and the catalog mirror check (`STATUS=OK`) confirm the consumers agree.
- Matrix axes: target state (present before / removed after) × router surface (route manifest, workflow table, three presentation displays) × gate (route validator, YAML parse, catalog mirror, strict packet validation). The post-retirement run covers each row.
- Algorithm invariant: a target that no longer exists is removed from every live surface, never left advertised. The adversarial evidence is the pre-change state where `rg -ni embedding` found live references; after the change those references return no matches and the parity check still passes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Asset parse | Every doctor asset YAML and `_routes.yaml` | `python3 yaml.safe_load` → `YAML_OK` |
| Route and presentation parity | Route manifest, router table and all three presentation displays | `route-validate.sh` → exit 0, 9 routes, 2 warnings |
| Catalog and guard | Command catalog mirror; MCP mutation class | mirror check `STATUS=OK`, exit 0; `GUARD PASS` |
| Tests | Doctor script tests against the recorded baseline | `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail as they did before the batch |
| Documentation | Strict packet validation | `validate.sh … --strict` → `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A provisioned worktree | Internal | Green | The doctor scripts cannot run |
| `.skilled/commands/doctor/_routes.yaml` and its validator | Internal | Green | The route change cannot be validated |
| The `advisor_status` read-only status contract | Internal | Red — it has no embeddings output | The target could not report provider or model-server health; the verdict is retirement |
| Sandbox IPC access to the advisor socket | External | Red — the workflow-form call returned EPERM, exit 75 | Live provider and server values stay UNKNOWN and are recorded as a finding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The removed target proves to be needed by an operator, or a replacement status interface is built.
- **Procedure**: Restore the changed files from git: the route stanza in `_routes.yaml`, `doctor-embeddings.yaml`, the router and presentation rows, the validator fixtures and the four documentation files. No runtime state was written, so no data reversal is needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory and verdict ──► Apply the retirement ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory and verdict | None | Apply |
| Apply the retirement | Inventory and verdict | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and verdict | Low | Line-numbered source reads plus one read-only run |
| Apply the retirement | Med | Remove the route, asset, router and presentation rows, validator fixtures and live documentation references |
| Verification | Low | Rerun the route validator, YAML parse, catalog mirror and strict packet validation |
| **Total** | | **One focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; every changed file is tracked in git
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `git restore` the changed files listed in the rollback plan.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and confirm exit 0 with 9 routes.
3. Confirm `rg -ni embedding .skilled/commands/doctor/` returns no live reference to the retired target.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

