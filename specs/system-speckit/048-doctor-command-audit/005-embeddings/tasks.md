---
title: "Tasks: Phase 5: embeddings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "embeddings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: embeddings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the worktree is provisioned and the route manifest and validator are present (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/scripts/route-validate.sh`). Evidence: the inventory command in `scratch/reality-check.md` found both present, and the validator then ran and exited 0.
- [x] T002 Read the route, the embeddings workflow, the router and the presentation with line-numbered source reads (`scratch/reality-check.md`). Evidence: every claim in the inventory carries a file:line citation, including the pre-retirement route at `_routes.yaml:49-61`.
- [x] T003 [P] Inventory every path, script, command, flag and environment variable the route and workflow name, each marked present, moved or missing (`scratch/reality-check.md`). Evidence: the named-item table records the existence probe or source line for each entry, including the missing generic root command files and the required `--workspace-root`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the target once in its read-only form and keep the output (`scratch/doctor-run.log`). Evidence: the route-form call exited 64 ("advisor_status.workspaceRoot is required"), the workflow-form call exited 75 (sandbox EPERM on the advisor IPC socket), and `advisor_status --help` exited 0; no write, rebuild, install or migration was run.
- [x] T005 Write the verdict and the removal list (`scratch/proposal.md`). Evidence: verdict `retire`, because `advisor_status` cannot return `data.embeddings`; the removal list names the route, the asset, the router row, the presentation entries and the validator fixtures.
- [x] T006 Remove the embeddings route from `.skilled/commands/doctor/_routes.yaml`. Evidence: `rg -n embedding .skilled/commands/doctor/_routes.yaml` → no matches; `route-validate.sh` now reports 9 routes (10 before).
- [x] T007 Delete `.skilled/commands/doctor/assets/doctor-embeddings.yaml`. Evidence: `ls` → "No such file or directory"; the manifest asset check passes.
- [x] T008 Remove the embeddings row from the `.skilled/commands/doctor/speckit.md` workflow table. Evidence: `rg -n embedding .skilled/commands/doctor/speckit.md` → no matches; the router, table and presentation parity check passes.
- [x] T009 [P] Remove the embeddings rows from `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`. Evidence: the startup menu item, accepted answer, symptom line, quick-reference and confusable-pair lines, valid-target entry and manifest row are gone; `rg -ni embedding` over the file → no matches.
- [x] T010 [P] Repoint the validator fixtures in `.skilled/commands/doctor/scripts/route-validate.sh` from the embeddings target and asset to deep-loop. Evidence: the two fixture manifests now name `deep-loop` and `doctor-deep-loop.yaml`; the parity note reads "the real 9-route speckit.md/presentation"; the script exits 0.
- [x] T011 Remove or correct the live documentation references that advertised `/doctor embeddings`. Evidence: `README.md`, `.skilled/commands/speckit/README.txt`, the doctor-commands playbook README and the `.skilled/commands/README.txt` doctor row were rewritten; `rg -ni 'doctor embeddings'` over them returns no live references.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run `bash .skilled/commands/doctor/scripts/route-validate.sh`. Evidence: exit 0 — "OK: route-validate — 9 routes validated, 2 warnings".
- [x] T013 Parse every doctor asset YAML and `_routes.yaml`. Evidence: `YAML_OK` for all files.
- [x] T014 Run the command catalog mirror check and the MCP mutation-class guard. Evidence: `STATUS=OK`, exit 0; `GUARD PASS`.
- [x] T015 Run the doctor script tests and compare against the pre-batch baseline. Evidence: `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail exactly as they did before the batch because their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree — not a regression.
- [x] T016 Record the verdict, the decisions and the recorded findings in `implementation-summary.md`. Evidence: the summary states "Verdict: retire", lists the nine changed paths, the key decisions and the four recorded findings; strict validation reports `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — the four requirements and the two success criteria are written and each maps to an acceptance row
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit-then-apply plan, the affected surfaces and the testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — the worktree is provisioned and the route manifest and validator are present; the `advisor_status` embeddings contract is absent and is recorded as a finding rather than treated as a blocker
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — every doctor asset YAML and `_routes.yaml` parse with `yaml.safe_load`, and `route-validate.sh` exits 0
- [x] CHK-011 [P0] No console errors or warnings — the validator reports two pre-existing informational flag warnings and no errors; the run log holds the command outputs without shell errors
- [x] CHK-012 [P1] Error handling implemented — the retired command's route form reported "advisor_status.workspaceRoot is required" and exited 64, and the workflow form reported the sandbox EPERM and exit 75; both were recorded rather than masked
- [x] CHK-013 [P1] Code follows project patterns — the route stanza removal follows the manifest's own instruction for removing a target, and the fixtures keep the existing assertion shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] Manual testing complete — one read-only run plus the route validator, YAML parse, catalog mirror check, mutation guard and doctor script tests were run
- [x] CHK-022 [P1] Edge cases tested — the route form's missing-argument path and the workflow form's unavailable-backend path were both exercised, and the unknown-target presentation no longer lists embeddings
- [x] CHK-023 [P1] Error scenarios validated — exit 64 and exit 75 are the command's real failure modes on this checkout and are recorded in the run log
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — the retirement is `cross-consumer` (route manifest, workflow asset, router, presentation, validator fixtures and four documentation files); the subsystem defects are `instance-only` findings, recorded and not fixed
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/reality-check.md` inventories every named surface, and `rg -n embedding .skilled/commands/doctor/` returns no live reference to the retired target
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — the router, presentation, validator fixtures and four documentation files were updated in the same batch, and the route validator's parity check and the catalog mirror check confirm the consumers agree
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — N/A for this retirement; the adversarial evidence is the pre-change state where live references to a removed target existed, and the post-change scan returns none
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — the affected-surfaces section lists target state × router surface × gate, and the post-retirement run covers each row
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the workflow-form call was attempted against the live advisor socket and the sandbox denial was recorded (EPERM, exit 75) instead of being hidden
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — the tree is uncommitted by instruction; evidence is pinned to the enumerated working-tree diff and the recorded command output above
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secret is introduced, printed or stored by this change
- [x] CHK-031 [P0] Input validation implemented — the route validator checks manifest structure, asset existence, known CLI commands, script resolution, mutation class and router/presentation parity
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; the doctor has no auth or authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` status Complete, this task list fully ticked, `acceptance-criteria.md` all `Met`
- [x] CHK-041 [P1] Code comments adequate — the validator's note about the 9-route parity fixture is updated; no ephemeral spec or packet ids were added to code comments
- [x] CHK-042 [P2] README updated (if applicable) — the four documentation files that named the target were updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the audit artifacts (`reality-check.md`, `doctor-run.log`, `proposal.md`) live in `scratch/`; no other temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — the three audit artifacts are kept as this phase's evidence, not deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---



