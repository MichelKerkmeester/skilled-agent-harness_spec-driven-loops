---
title: "Tasks: Phase 3: cli-deepseek-harness-skill-packet"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli deepseek harness skill packet tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: cli-deepseek-harness-skill-packet

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

`K` is `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/`. `E` is `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/`. The plan named the orchestrating Claude session as the executor for every task. The tasks were run by a sub-agent of that session instead, and `implementation-summary.md` records the deviation. The authoring mode is `sk-doc` `sk-create-skill` unless a task names another.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load the `sk-create-skill` contract its router resolves and read `cli-pi` as the shape precedent (`.skilled/skills/cli-external-orchestration/cli-pi/`). Verify: `ls .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json` prints the path. Evidence: the path printed. Loaded `sk-create-skill` `SKILL.md`, `ROUTER.md`, `assets/parent-skill/scaffold/packet-skill-scaffold.md`, `assets/skill/skill-router-template.md`, the reference-template frontmatter rules and the root-metadata rule that a nested packet carries no `graph-metadata.json` or `description.json`, plus `sk-create-changelog` `SKILL.md` and `assets/changelog-template.md`.
- [x] T002 Confirm the phase 002 captures exist (`E/`). Verify: `test -s E/headless-help.txt && test -s E/dump-config-llmgateway.txt` exits 0. Evidence: both files are non-empty (1,541 and 13,755 bytes), and phase 002 shows six `Met` rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the mode contract (`K/SKILL.md`). Verify: `rg -c 'cli-deepseek-harness' K/SKILL.md` prints at least 1. Evidence: the name is in the frontmatter and the body, version `1.0.0.0`.
- [x] T004 [P] Write the intent map (`K/ROUTER.md`). Verify: `rg -c 'references/' K/ROUTER.md` prints at least 6. Evidence: seven intents, each in both `INTENT_SIGNALS` and `RESOURCE_MAP`, and `sk-skill-check` row C7 parsed 7 intent groups and 7 resource-map entries.
- [x] T005 Write the eleven hard rules (`K/hard-rules.json`). Verify: `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1]))' K/hard-rules.json` exits 0. Evidence: exit 0, 11 rules, shape `id`, `check`, `message`, `severity` as in `cli-pi`.
- [x] T006 Write `cli-reference.md` and `providers-and-models.md` citing `E/` files (`K/references/`). Verify: `rg -c 'UNKNOWN' K/references/providers-and-models.md` prints at least 1. Evidence: three `UNKNOWN` lines, on the OpenCode Go roster row and its endpoint subsection.
- [x] T007 [P] Write `runtime-folder-and-sync.md`, `guards-and-hooks.md`, `mcp.md` and `fanout-executor.md` (`K/references/`). Verify: `ls K/references/*.md | wc -l` prints 6. Evidence: 6.
- [x] T008 [P] Write the prompt templates (`K/assets/`). Verify: `ls K/assets | wc -l` prints at least 1. Evidence: 2, `prompt-quality-card.md` and `prompt-templates.md`.
- [x] T009 Write the operator README with `sk-create-readme` and the first changelog entry with `sk-create-changelog` (`K/README.md`, `K/changelog/`). Verify: `ls K/README.md K/changelog` exits 0. Evidence: exit 0. `validate_document.py K/README.md --type readme` reported 0 issues and `check_changelog_shape.py K/changelog/v1.0.0.0.md` printed `PASS`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the skill checker. Verify: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs K` reports no errors. Evidence: no ERROR row and C3 `Strict package validation passed`. The run prints `Result: FINDINGS (3)` and exits 1: C8 and C9 are fleet-wide and identical on `cli-pi` and `cli-hermes`, and C10 is the missing global changelog index link that hub registration adds.
- [x] T011 Scan for the eleven rule ids. Verify: a loop of `rg -q <id> K/hard-rules.json` over the eleven ids exits 0. Evidence: the loop matched `"id": "<id>"` for each id and exited 0.
- [x] T012 Run the flag loop. Verify: each `--flag` token in `K/references/cli-reference.md` is found by `rg -F -q -- <flag> E/headless-help.txt` and the loop exits 0. Evidence: the loop checked 7 app flags against the help capture and exited 0. It excludes exactly the four launcher flags `--patch`, `--dump-config`, `--dump-default-config` and `--version`, which the reference grounds in its section 4 table. A control run with no exclusions names exactly those four as missing from the help capture.
- [x] T013 Record results in the phase docs with `system-spec-kit`. Verify: `validate.sh <phase folder> --strict` prints `RESULT: PASSED`. Evidence: recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `sk-skill-check.cjs` output saved in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Frozen scope**: `../001-deep-research/research/phase-plan.md` section 4, phase `003-cli-deepseek-harness-skill-packet`
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

A task blocked because phase 002 evidence is missing is marked `[B]` and the phase waits.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (`rg -c '^\| REQ-' spec.md` prints 5)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Phase 002 acceptance rows all Met. Evidence: six `| Met |` rows in `../002-dsh-offline-contract-pin/acceptance-criteria.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `sk-skill-check.cjs` reports no errors for the packet. Evidence: no ERROR row, C3 PASS. The three FINDING rows are in `implementation-summary.md`
- [x] CHK-011 [P0] `hard-rules.json` parses with `node -e`. Evidence: exit 0, 11 rules
- [x] CHK-012 [P1] Every hard rule names a check a preflight can run. Evidence: each rule carries a `check` id equal to its rule id. The dispatch rule engine implements none of the eleven yet, which `implementation-summary.md` records as an open item
- [x] CHK-013 [P1] The packet follows the `cli-pi` folder shape (`SKILL.md`, `ROUTER.md`, `README.md`, `references/`, `assets/`, `changelog/`). Evidence: all six present, plus `hard-rules.json`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-005 met with the command named in each row
- [x] CHK-021 [P0] The flag loop exits 0
- [x] CHK-022 [P1] `providers-and-models.md` lists exactly two routes. Evidence: two roster rows, `LLM Gateway` and `OpenCode Go`, in section 2
- [x] CHK-023 [P1] Unconfirmed live behavior is marked `documented, unconfirmed`. Evidence: the completed-run exit, route answers, sandbox confinement, reasoning levels and skill-farm load carry the label in the references
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n -i 'sk-[a-z0-9]{8,}' K` finds no credential value. Evidence: one match, `task-dispatch-guard` in `references/guards-and-hooks.md`, a guard name and not a key
- [x] CHK-031 [P0] The packet names key env variables only, never values. Evidence: only `LLMGATEWAY_API_KEY`, `OPENCODE_API_KEY` and `DEEPSEEK_API_KEY` appear, as names
- [x] CHK-032 [P1] `no-repo-root-dotenv` and `dsh-home-isolated` are present in `hard-rules.json`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six references
- [x] CHK-041 [P1] `ROUTER.md` points at every reference that exists. Evidence: all six references and both assets appear in `RESOURCE_MAP`
- [x] CHK-042 [P2] `README.md` follows `sk-create-readme`. Evidence: `validate_document.py --type readme` reported 0 issues
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp file was left in the packet or the phase folder
- [x] CHK-051 [P1] No file outside `K` and this phase folder changes (`git status --short` shows only those paths). Evidence: this phase wrote only under `K` and this folder. `git status --short` also lists the sibling `ROUTER.md` edits, `.gitignore`, `.dsh/` and other spec folders, which were present at session start or belong to concurrent work
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06
<!-- /ANCHOR:summary -->

---
