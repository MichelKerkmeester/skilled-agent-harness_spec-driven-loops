---
title: "Tasks: Phase 2: install-guide-router"
description: "The ordered work for the read-only install guide: read the contract, write the router, workflow and presentation, then run the family gates that read them."
trigger_phrases:
  - "install guide router tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/002-install-guide-router"
    last_updated_at: "2026-10-31T15:26:00Z"
    last_updated_by: "markdown"
    recent_action: "Checked T014 against the manifest-entry standard and left T015 open on the metadata refresh"
    next_safe_action: "Run the generated-metadata refresh, then re-run strict validation"
    blockers:
      - "Strict validation reports two generated-metadata errors; repair-derived.cjs --apply clears them and this closeout does not own that rewrite"
    key_files:
      - ".skilled/commands/doctor/install.md"
      - ".skilled/commands/doctor/assets/doctor-install.yaml"
      - ".skilled/commands/doctor/assets/doctor-install-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-closeout"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Whether the live check must name a broken link outside the manifest"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: install-guide-router

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`D` is `.skilled/commands/doctor`. `A` is `.skilled/commands/doctor/assets`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the install contract's five steps and the route shape (`scratch/install-contract.md`). Verify: `rg -n "^## Workflow steps" specs/commands/005-doctor-symlink-install/002-install-guide-router/scratch/install-contract.md` prints one line.
- [x] T002 Read the engine's status list and exit codes, so the inspect step quotes its report (`001-symlink-engine-and-command/scratch/engine-contract.md`). Verify: `rg -n "^## Entry status" specs/commands/005-doctor-symlink-install/001-symlink-engine-and-command/scratch/engine-contract.md` prints one line.
- [x] T003 Capture the baseline: the manifest holds no install route. Verify: `rg -n "doctor:install" .skilled/commands/doctor/_routes.yaml` exits 1.
- [x] T004 [P] Confirm the two build probes the presentation fixes (`A/doctor-install-presentation.txt`). Verify: `rg -q "runtime/dist" .skilled/commands/doctor/assets/doctor-install-presentation.txt && rg -q "list-tools" .skilled/commands/doctor/assets/doctor-install-presentation.txt` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the router with the `system-spec-kit` tag, `allowed-tools: Read, Bash`, the six `helper.md` sections and one `guide` target (`D/install.md`). Verify: `rg -c "skill_agent: system-spec-kit" .skilled/commands/doctor/install.md` prints 1.
- [x] T006 Write the workflow with the five steps in contract order (`A/doctor-install.yaml`). Verify: `python3 -c 'import yaml; yaml.safe_load(open(".skilled/commands/doctor/assets/doctor-install.yaml"))'` exits 0.
- [x] T007 Point the inspect step at the engine's `check`, once and in place (`A/doctor-install.yaml`). Verify: `rg -n "symlink-engine\.cjs check" .skilled/commands/doctor/assets/doctor-install.yaml` prints one line.
- [x] T008 Name the five checklist commands, each with its class and why, and run none of them (`A/doctor-install.yaml`). Verify: `rg -o "/doctor:(symlink|agents-md|mcp|git|setup)" .skilled/commands/doctor/assets/doctor-install.yaml | sort -u | wc -l` prints 5.
- [x] T009 Write the presentation: the build block, the consolidated prompt, the status legend, the ordered steps, the caveat line and the result templates (`A/doctor-install-presentation.txt`). Verify: `rg -n "^## (2|3|6|7|8)\." .skilled/commands/doctor/assets/doctor-install-presentation.txt` prints five lines.
- [x] T010 Keep the read-only route true in the YAML's wording: no write activity, printed commands only (`A/doctor-install.yaml`). Verify: `rg -in "write to" .skilled/commands/doctor/assets/doctor-install.yaml` exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

T011 to T013 read the route, which phase 003 step 1 registers. Run them after it lands; before that they pass without seeing these files.

- [x] T011 Run the manifest gate over the install route (`_routes.yaml`, `/doctor:install`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK: route-validate` and exits 0.
- [x] T012 Run the helper contract suite (`D/scripts/tests/doctor-helper-contract.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` exits 0.
- [x] T013 Run the phrase probe for the five install phrases (`D/scripts/doctor-phrase-reach.cjs`). Verify: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0.
- [x] T014 Dry-run the inspect step against a real repository (`D/scripts/symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "…/Obsidian Plugin"` prints the whole-link entries, `.mcp.json` as `missing` and `REPO RULES.md` as `local`, then exits 0. Evidence: `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:22` records exactly that, with `--runtimes` set to all seven and `--link-instructions`. `check` reads manifest entries only, so a broken link outside the manifest, such as `.pi-subagents`, is not in its report; ADR-001 in `decision-record.md` sets that standard.
- [x] T015 Run strict validation and record the result in the summary (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/002-install-guide-router --strict` prints `RESULT: PASSED`. Open: the closeout run printed `RESULT: FAILED` with 2 errors, `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`, both against `description.json` and `graph-metadata.json`. `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/commands/005-doctor-symlink-install/002-install-guide-router --apply` rewrites those two generated files, and this closeout does not own that rewrite, so the row stays open.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T015: strict validation printed `RESULT: PASSED` after the metadata re-derive
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live checks, the scratch round trip and the acceptance probes recorded in `scratch/verification-evidence.md`
- [x] `route-validate.sh` exits 0 with the install route, and every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`: six `Met` and one `Superseded` by ADR-001
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Install contract**: See `scratch/install-contract.md`
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

- [x] CHK-001 [P0] The contract's six requirements are written into `spec.md`. Verify: `rg -c "REQ-00" specs/commands/005-doctor-symlink-install/002-install-guide-router/spec.md` prints 6.
- [x] CHK-002 [P0] The plan names the three owned files. Verify: `rg -n "doctor-install\.yaml" specs/commands/005-doctor-symlink-install/002-install-guide-router/plan.md` prints at least one line.
- [x] CHK-003 [P1] Phase 001's engine is present before the inspect step is written. Verify: `test -f .skilled/commands/doctor/scripts/symlink-engine.cjs` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The workflow parses as YAML. Verify: `python3 -c 'import yaml; yaml.safe_load(open(".skilled/commands/doctor/assets/doctor-install.yaml"))'` exits 0. Observed: the YAML parses with exit 0.
- [x] CHK-011 [P0] The router carries the `system-spec-kit` tag once. Verify: `rg -c "skill_agent: system-spec-kit" .skilled/commands/doctor/install.md` prints 1.
- [x] CHK-012 [P1] The router grants `Read` and `Bash` and nothing else. Verify: `rg -n "^allowed-tools: Read, Bash$" .skilled/commands/doctor/install.md` prints one line.
- [x] CHK-013 [P1] The workflow declares no write activity. Verify: `rg -in "write to" .skilled/commands/doctor/assets/doctor-install.yaml` exits 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The route manifest gate exits 0 with the install route. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK: route-validate`. Observed: `OK: route-validate — 28 routes validated, 10 warnings`, with `J1` parity across 13 commands.
- [x] CHK-021 [P0] The helper contract suite passes, so the router has a helper entry and a setup row. Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` exits 0. Observed through `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: 7 suites passed, 0 failed, 934 node tests passing, and that runner executes every `*.test.cjs` in the folder.
- [x] CHK-022 [P1] Every install phrase reaches its bridge. Verify: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0. Observed: `STATUS=OK phrases=184 bridges=32`, and "install skilled into my project" returns `command-doctor-install`.
- [x] CHK-023 [P1] The inspect step exits 0 against a real target repository. Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "…/Obsidian Plugin"` prints its entry lines. Observed: every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` as `linked-whole`, `.mcp.json` as `missing`, `REPO RULES.md` as `local`, exit 0, nothing changed. Recorded at `scratch/verification-evidence.md:22`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A. This phase adds a router and a workflow. No reported finding drives it, so the fix-completeness checks do not apply.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The route stays read-only under the manifest gate. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` prints the `K1/K2` PASS line.
- [x] CHK-031 [P0] The guide reads no secrets file and passes no `--include` value. Verify: `rg -n "\.env|--include" .skilled/commands/doctor/assets/doctor-install.yaml` exits 1.
- [x] CHK-032 [P1] Printed commands carry only the operator's `--root` and `--runtimes` values. Verify: `rg -n -- "--root|--runtimes" .skilled/commands/doctor/assets/doctor-install-presentation.txt` prints the lines that carry them.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same three files and the same five steps. Verify: `rg -l "doctor-install-presentation\.txt" specs/commands/005-doctor-symlink-install/002-install-guide-router/spec.md specs/commands/005-doctor-symlink-install/002-install-guide-router/plan.md specs/commands/005-doctor-symlink-install/002-install-guide-router/tasks.md specs/commands/005-doctor-symlink-install/002-install-guide-router/acceptance-criteria.md | wc -l` prints 4.
- [x] CHK-041 [P1] The workflow header comments say what each step is for. Verify: `rg -n "^#" .skilled/commands/doctor/assets/doctor-install.yaml` prints at least one line.
- [x] CHK-042 [P2] Visible wording stays in the presentation, not the router. Verify: `rg -n "STATUS=" .skilled/commands/doctor/install.md` exits 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No test tree or run output is kept under `scratch/`. Verify: `find specs/commands/005-doctor-symlink-install/002-install-guide-router/scratch -mindepth 1 -type d | wc -l` prints 0.
- [x] CHK-051 [P1] `scratch/` holds the contract and no run output. Verify: `ls specs/commands/005-doctor-symlink-install/002-install-guide-router/scratch` lists `install-contract.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-31

Every checklist row is proven by the command it names, and the family-gate rows carry the observation: `route-validate.sh`, the helper contract suite through `run-all.sh`, `doctor-phrase-reach.cjs` and the live `check` on Obsidian Plugin. T014 is checked against the manifest-entry standard ADR-001 in `decision-record.md` sets. T015 stays open because the closeout's strict validation printed `RESULT: FAILED` on two generated-metadata errors, and clearing them rewrites `description.json` and `graph-metadata.json`, which a documentation closeout does not own.
<!-- /ANCHOR:summary -->
