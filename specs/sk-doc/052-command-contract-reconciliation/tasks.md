---
title: "Tasks: Command contract reconciliation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command contract tasks"
  - "contract reconciliation tasks"
  - "catalog mirror check tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Command contract reconciliation

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

- [x] T001 Baseline every gate before touching anything: schema validation, per-document validation, the hub check and the contract consumer (`scratch/`)
- [x] T002 Read the one live contract consumer and its placeholder-expansion rule before shaping any path (`.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs`)
- [x] T003 [P] Inventory the shipped tree: 39 commands across 8 namespaces plus 3 root utilities, and every asset filename per family (`.opencode/commands/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the create family's `$ARGUMENTS` trailer requirement with what the router template and the document validator both say (`assets/command-contract.json`)
- [x] T005 Rewrite every family's owned-asset and execution-target path to the hyphen-joined form the tree uses, checking each against the consumer's expansion rule (`assets/command-contract.json`)
- [x] T006 Replace the create family's copied argument hint with a family shape in the register the other families use (`assets/command-contract.json`)
- [x] T007 Replace the phantom `interface` family with the `design` family that occupies its slot, and reconcile the memory, doctor and deep entries against the tree (`assets/command-contract.json`)
- [x] T008 Add `coverage`, `asset_naming` and `path_templates` metadata, and bump the contract to 2.0.0 for the family-key rename (`assets/command-contract.json`)
- [x] T009 Correct the three schema descriptions that contradict the tree or the contract's own metadata (`assets/command-contract.schema.json`)
- [x] T010 [P] Bring the templates, SKILL.md and references onto the hyphenated convention, and document the families that drop the family prefix (`assets/`, `SKILL.md`, `references/`)
- [x] T011 Write the read-only catalog and hub-metadata drift check with a two-tier exit status (`.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs`)
- [x] T012 Fix the coverage hole the negative control exposed: judge coverage on catalog table rows, not the whole document, so a usage example cannot mask a deleted row (`command-catalog-mirror-check.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the negative-control suite in a scratch copy: baseline, five staleness shapes, `--strict`, and a restore (`scratch/`)
- [x] T014 Re-run every baselined gate and compare against the recorded starting numbers
- [x] T015 Record the family-by-family divergence table and the divergences this packet could not repair (`implementation-summary.md`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available — `generate-command-routers.cjs` and `python3 jsonschema` both present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` on the new script exits 0
- [x] CHK-011 [P0] No console errors or warnings — the check prints only its own report
- [x] CHK-012 [P1] Error handling implemented — a missing commands directory, an empty tree, or unparseable metadata exits 2
- [x] CHK-013 [P1] Code follows project patterns — mirrors the agent-roster mirror check's header, `STATUS=` lines and 0/1/2 exit contract
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete — eight-case negative-control suite
- [x] CHK-022 [P1] Edge cases tested — deleted row masked by a usage example, deleted command file, added command file, stale group count
- [x] CHK-023 [P1] Error scenarios validated — `--root` at a path with no commands directory exits 2
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: the asset-path divergence is `class-of-bug` across five families, the phantom family is `instance-only`, the templates are `cross-consumer`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — `grep -rn '_auto\.yaml\|_confirm\.yaml\|_presentation\.txt' .opencode/skills/sk-doc/sk-create-command/` returns only the legitimate `_routes.yaml` filename after the change.
- [x] CHK-FIX-003 [P0] Consumer inventory completed — `grep -rn 'command-contract\.json' .opencode` finds one live consumer, the hub manifest and the hub router; all three checked.
- [x] CHK-FIX-004 [P0] Not applicable: no security, path-resolution, parser or redaction behaviour changed. The new check resolves paths only under a caller-supplied root and never writes.
- [x] CHK-FIX-005 [P1] Matrix axes listed: six families crossed with eight declared fields, plus the four catalogs and two metadata files.
- [x] CHK-FIX-006 [P1] Hostile-state variant executed — the check was driven against an alternate root holding a deliberately broken copy.
- [x] CHK-FIX-007 [P1] Evidence pinned to the observed command output recorded in `implementation-summary.md`, not to a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented — `--root` and `--strict` are the only arguments; anything else exits 2
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable; the check reads local files with the caller's own permissions
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate — the script opens with why it exists and why each tier drives the exit status it does
- [x] CHK-042 [P2] README updated (if applicable) — deferred: the doctor script index lives under `.opencode/commands/`, outside this packet's ownership
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion — the throwaway copy of the command tree was deleted after the negative control ran; `scratch/contract-paths.cjs` is kept deliberately, because AC-002 cites it as the way to reproduce the asset-path assertion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-04
<!-- /ANCHOR:summary -->

---
