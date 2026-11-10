---
title: "Tasks: Phase 14: playbook-docs-and-closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "playbook docs and closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: playbook-docs-and-closeout

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

`H` is `.skilled/skills/cli-external-orchestration/`. `PK` is `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation`. Every task runs in the orchestrating Claude session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Validate each child 002 to 013 (`PK/0*/`). Verify: each `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `evidence/recursive-strict-final-2026-11-06.txt:423`, `:477`, `:530`, `:583`, `:635`, `:688`, `:740`, `:792`, `:844`, `:897`, `:950` and `:1002` record the child results.
- [ ] T002 Record the "seven" sweep baseline (`scratch/seven-before.txt`). Verify: the `rg -c` output from `spec.md` Measured Behavior is saved.
- [x] T003 [P] Read phase 013 evidence for each route's verified status (`PK/013-dsh-live-contract-pin/evidence/`). Verify: each route has a status to copy.
  - Evidence: `../013-dsh-live-contract-pin/evidence/latency-and-tokens.md` records LLM Gateway `deepseek-v4.1-flash-1017` as verified and OpenCode Go `deepseek-v4.1-flash` as configured, not verified. The docs copy those two statuses.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the playbook and run each scenario (`H/cli-deepseek-harness/manual-testing-playbook/`). sk-doc `sk-create-manual-testing-playbook`. Verify: every scenario row has a result or a blocked reason. Evidence: `evidence/playbook-run/summary.md` records 21 PASS, one initial FAIL rerun to PASS, and three key-gated SKIPs with reasons.
- [x] T005 Link the playbook from `.dsh/` and add the hub playbook entry (`.dsh/manual-testing-playbook`, `H/`). Verify: `ls -L .dsh/manual-testing-playbook` resolves.
  - Evidence: `evidence/keyless-docs-sweep.txt` records the resolving relative symlink and the hub playbook pointer.
- [x] T006 [P] Finalize the feature-catalog text (`H/feature-catalog/`). sk-doc `sk-create-feature-catalog`. Verify: route status matches the available phase 013 status. Evidence: `evidence/keyless-docs-sweep.txt` confirms the feature remains Experimental/configured, not verified.
- [x] T007 [P] Add packet, hub and repo changelog entries (`H/cli-deepseek-harness/changelog/`, `H/changelog/`, `.skilled/changelog/skilled/`). sk-doc `sk-create-changelog`. Verify: each new entry names `cli-deepseek-harness`.
  - Evidence: `evidence/keyless-docs-sweep.txt` names the packet v1.0.0.0, existing hub v1.8.0.0 and root v4.0.2.0 entries. Each names the mode and records the unverified status.
- [ ] T008 Reconcile governance docs (`AGENTS.md`, `README.md`, `SECURITY.md`, `.skilled/skills/README.txt`, `.skilled/CROSS-CLI.md`). sk-doc `sk-create-readme`. Verify: the "seven" sweep prints only historical changelog lines.
- [x] T009 Add env names (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`). Verify: `rg -n 'DSH_HOME\|LLMGATEWAY_API_KEY\|OPENCODE_API_KEY'` matches, with no value after `=` in `.env.example`. Evidence: `evidence/env-names-2026-11-06.txt` shows all three names in both files and no value after `=`.
- [x] T010 Regenerate `agents-md-manifest.json` and update the sk-doc code-folder manifests (`.skilled/commands/doctor/assets/`, `.skilled/skills/sk-doc/scripts/tests/code-folder/`). sk-code. Verify: the `/doctor:agents-md` check and code-folder tests pass.
  - Evidence: `evidence/keyless-docs-sweep.txt` records the in-sync agents check and passing code-folder manifest, parity and fixture tests.
- [x] T011 Rebuild the trigger index (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). sk-code. Verify: the `deepseek harness` lookup returns the packet.
  - Evidence: `evidence/keyless-docs-sweep.txt` records a successful rebuild, zero-stale `--check` and lookup results within the 085 packet tree.
- [x] T012 Reconcile completion metadata in the parent `spec.md`, `goal.md` and every child (`PK/`). system-spec-kit. Verify: status and completion agree in each `spec.md`, `implementation-summary.md` and `goal.md`. Evidence: parent phase map, child status fields, acceptance criteria and goal progress logs were reconciled against their saved phase evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the "seven" sweep again. Verify: only historical changelog entries match.
- [x] T014 Run the recursive strict validation on `PK`. Verify: it prints `RESULT: PASSED`. Evidence: `evidence/recursive-strict-results.txt:4` records all 15 folder results; the full command output is in `evidence/recursive-strict-final-2026-11-06.txt`.
- [x] T015 Clean `scratch/` in this phase. Verify: `ls scratch` prints nothing beyond a placeholder. Evidence: the closeout `ls -la scratch` command returned only `.gitkeep`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The recursive strict validation of the parent prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/research.md` Section 15 touch list
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

A key-gated playbook scenario without phase 013 evidence is marked blocked with its reason, which counts as recorded.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available: every child 002 to 013 validates strict. Evidence: `evidence/recursive-strict-final-2026-11-06.txt:423` through `:1002` records all child results.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited JSON manifest parses
  - Evidence: `evidence/keyless-docs-sweep.txt` records successful JSON parsing for all six edited JSON files.
  - Verified: 2026-11-06
- [x] CHK-011 [P0] Generated files come from their generators with zero diff on rerun
  - Evidence: `evidence/keyless-docs-sweep.txt` records zero-drift manifest checks and trigger-index `--check` with no stale documents or obsolete paths.
  - Verified: 2026-11-06
- [x] CHK-012 [P1] Docs follow the sk-doc template for their type
  - Evidence: every touched Markdown file reports VALID from `validate_document.py`. `tasks.md` and `acceptance-criteria.md` use `--type spec` because automatic path detection defaults them to README rules.
  - Verified: 2026-11-06
- [x] CHK-013 [P1] No doc calls a route "supported" without phase 013 evidence. Evidence: `evidence/keyless-docs-sweep.txt` records the feature catalog and changelogs as Experimental/configured, not verified.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The recursive strict validation passes. Evidence: `evidence/recursive-strict-results.txt:4` records all 15 folder results; the full command output is in `evidence/recursive-strict-final-2026-11-06.txt`.
- [x] CHK-022 [P1] The `/doctor:agents-md` check and code-folder tests pass
  - Evidence: `evidence/keyless-docs-sweep.txt` records STATUS=OK, all A1-A12 PASS, and zero code-folder test failures.
  - Verified: 2026-11-06
- [x] CHK-023 [P1] The trigger-index lookup returns the packet
  - Evidence: `evidence/keyless-docs-sweep.txt` records exit 0 and results from the 085 packet tree for the `deepseek harness` query.
  - Verified: 2026-11-06
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `.env.example` holds names only, with no key value. Evidence: `evidence/env-names-2026-11-06.txt`
- [x] CHK-031 [P0] No playbook result or doc prints a key. Evidence: the closeout key-pattern scan over `evidence/playbook-run/` returned no matching files; `evidence/playbook-run/summary.md` records that no environment values were recorded.
- [x] CHK-032 [P1] `SECURITY.md` names the approval and key-handling rules for dsh
  - Evidence: `SECURITY.md` documents the dsh approval policy, scratch working directory and disposable `DSH_HOME`. Details are summarized in `evidence/keyless-docs-sweep.txt`.
  - Verified: 2026-11-06
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Completion metadata agrees across the parent and every child. Evidence: parent phase map and every child's spec/summary status fields now agree; phases 006-012 remain In Progress, 013 Planned and 014 In Progress.
- [x] CHK-042 [P2] `.skilled/CROSS-CLI.md` lists the runtime beside cli-pi and cli-hermes
  - Evidence: `.skilled/CROSS-CLI.md` includes the `.dsh/` external target row beside the runtime surfaces. The row labels dsh as an external run surface, not a repository-opening runtime. See `evidence/keyless-docs-sweep.txt`.
  - Verified: 2026-11-06
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Sweep baselines live in `scratch/` only
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the closeout `ls -la scratch` command returned only the placeholder `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 10 | 8/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. The documentation, manifest, playbook-result and recursive strict checks are recorded. Key-gated checks, the required seven-count expectation, .env.example inspection, and scratch baseline requirement remain open.
<!-- /ANCHOR:summary -->

---
