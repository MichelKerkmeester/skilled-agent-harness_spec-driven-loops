---
title: "Tasks: Phase 11: hub-registration-and-routing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub registration and routing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: hub-registration-and-routing

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

`H` is `.skilled/skills/cli-external-orchestration/`. `CR` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the packet from phase 003 exists (`H/cli-deepseek-harness/SKILL.md`). Verify: `ls H/cli-deepseek-harness/SKILL.md` prints the path. Evidence: `evidence/checks.txt:55`.
- [x] T002 Record the seven-mode baseline (`H/mode-registry.json`). Verify: the committed baseline count prints `7`. Evidence: `evidence/checks.txt:7`.
- [ ] T003 [P] Run the advisor parity and scorer suites before any edit to capture a baseline (`.skilled/skills/system-skill-advisor/runtime/tests/`). Verify: the vitest run output is saved in `scratch/`. Open: no pre-edit suite transcript was saved; the post-edit rerun and scorer recapture cannot reconstruct it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the mode entry with aliases `dsh`, `dsh headless`, `deepseek harness`, `delegate to dsh` and update the count wording (`H/mode-registry.json`, `H/hub-router.json`). sk-code `sk-code-skilled`, executor cli-codex. Verify: the `node -e` count prints `8`. Evidence: `evidence/closeout-mode-registry.txt:2`.
- [x] T005 Regenerate the leaf manifest and graph metadata, then update `H/description.json` (`H/leaf-manifest.json`, `H/graph-metadata.json`). sk-code, executor cli-codex. Verify: `rg -c cli-deepseek-harness H/leaf-manifest.json` prints at least 1. Evidence: `evidence/checks.txt:10`.
- [x] T006 Update the hub `SKILL.md`, `ROUTER.md` and `README.md` mode tables and counts (`H/SKILL.md`, `H/ROUTER.md`, `H/README.md`). sk-doc `sk-create-skill` hub conventions, orchestrating Claude session. Verify: `rg -n -i 'seven' H/SKILL.md H/ROUTER.md H/README.md` prints nothing. Evidence: `evidence/checks.txt:11` and `evidence/closeout-parent-skill-check.txt:40`.
- [x] T007 [P] Add the feature catalog index row, extend the two runtime lists and author one new entry (`H/feature-catalog/`). sk-doc `sk-create-feature-catalog`, orchestrating Claude session. Verify: the catalog index and entries name the mode. Evidence: `evidence/checks.txt:13`.
- [x] T008 [P] Update sibling mode tables (`H/cli-*/README.md`). sk-doc, orchestrating Claude session. Verify: `rg -L cli-deepseek-harness H/cli-*/README.md` prints nothing. Evidence: `evidence/checks.txt:12`.
- [x] T009 Add the hub changelog entry (`H/changelog/`). sk-doc `sk-create-changelog`. Verify: the new file names `cli-deepseek-harness`. Evidence: `evidence/checks.txt:15`.
- [x] T010 Add the packet to the card-sync list and regenerate the advisor graph (`check-prompt-quality-card-sync.sh`, `skill-graph.json`). sk-code, executor cli-codex. Verify: the script exits 0. Evidence: `evidence/card-sync.txt:19`.
- [x] T011 Add selection and conflict cases plus the scorer assertion (`executor-delegation-cases.json`, `executor-delegation.vitest.ts`). sk-code, executor cli-codex. Verify: the scorer suite passes. Evidence: `evidence/scorer-executor-delegation.txt:6`.
- [x] T012 Add the packet source entry and canary cases, including "use cli-opencode with deepseek-v4.1-flash" to `cli-opencode` (`CR/harness/build-artifacts.cjs`, `CR/fixtures/canary-cases.v1.json`). sk-code, executor cli-codex. Verify: the remint and route canaries pass. Evidence: `evidence/remint-after-doc-edits.txt:17`.
- [x] T013 Add the model row, card row and executor table rows (`.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`, `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`). sk-doc, orchestrating Claude session. Verify: `rg -l cli-deepseek-harness` lists all four files. Evidence: `evidence/checks.txt:14`.
- [x] T014 Regenerate the agent mirrors with their generator (`.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.hermes/agents/`). Verify: the mirror check exits 0. Evidence: `evidence/agent-mirror-sync.txt:1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the compiled-routing build (`CR/harness/build-artifacts.cjs`). Verify: remint and manifest checks pass after the packet doc edits. Evidence: `evidence/remint-after-doc-edits.txt:17` and `evidence/closeout-compiled-route-manifest-rerun.txt:141`.
- [x] T016 Run the advisor for a dsh prompt and a `cli-pi` prompt (`.skilled/bin/skill-advisor.cjs`). Verify: both name `cli-external-orchestration`, with `cli-pi` reachable. Evidence: `evidence/checks.txt:24` and `evidence/checks.txt:26`.
- [x] T017 Run the card-sync script and both advisor suites (`check-prompt-quality-card-sync.sh`, vitest). Verify: current runs exit 0; the scorer ratchet passes after baseline recapture. Evidence: `evidence/card-sync.txt:19`, `evidence/closeout-advisor-parity-scorer.txt:6` and `evidence/scorer-baseline-recapture.txt:4`.
- [x] T018 Validate this phase folder (`spec.md`). Verify: strict validation prints `RESULT: PASSED` with no warnings (`evidence/closeout-validation.txt:51`, `evidence/closeout-validation.txt:53`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. Open: T003 has no saved pre-edit suite transcript.
- [x] No `[B]` blocked tasks remain.
- [x] Manual verification passed. Evidence: `evidence/closeout-rerun.txt:9`.
- [x] The registry count prints `8` and compiled-routing verification passes. Evidence: `evidence/closeout-mode-registry.txt:2` and `evidence/closeout-compiled-route-manifest-rerun.txt:141`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/phase-plan.md` and `../001-deep-research/research/research.md` Section 15
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

A `[B]` task records its blocker and the phase it waits on in the task line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` Section 4.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available: `ls H/cli-deepseek-harness/SKILL.md` succeeds (`evidence/checks.txt:55`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited JSON file parses (`evidence/checks.txt:18`).
- [x] CHK-011 [P0] The advisor suites and recaptured scorer ratchet pass (`evidence/closeout-advisor-parity-scorer.txt:6`, `evidence/scorer-baseline-recapture.txt:4`).
- [x] CHK-012 [P1] Generated files were reminted after the packet edits and the manifest tests pass (`evidence/remint-after-doc-edits.txt:17`, `evidence/closeout-compiled-route-manifest-rerun.txt:141`).
- [x] CHK-013 [P1] The registry entry copies the `cli-hermes` shape (`evidence/checks.txt:9`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] The advisor call for "run this task through dsh headless" names `cli-external-orchestration` (`evidence/advisor-dsh-headless.json:12`).
- [x] CHK-022 [P1] The `cli-opencode` DeepSeek canary resolves to `cli-opencode` (`evidence/closeout-compiled-route-opencode-deepseek.txt:1`).
- [x] CHK-023 [P1] Each of the seven existing modes resolves for its own canary (`evidence/checks.txt:32`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The registry and router scan finds no key value (`evidence/checks.txt:16`).
- [x] CHK-031 [P0] No alias is a bare model word such as `deepseek` (`evidence/checks.txt:8`).
- [x] CHK-032 [P1] The kind stays out of default routing until phase 013; the hub router has no default mode (`evidence/closeout-parent-skill-check.txt:36`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Open: `plan.md` still marks phases 003 and 006 as Red; this closeout does not edit the plan.
- [ ] CHK-041 [P1] `rg -n -i 'seven (cli|runtime|mode)' H --glob '!changelog/**'` prints nothing. Open: one stale count remains in an out-of-scope sibling catalog (`evidence/checks.txt:17`).
- [x] CHK-042 [P2] Sibling `README.md` mode tables list eight modes (`evidence/checks.txt:12`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline logs live in `scratch/` only. Open: check outputs are in `evidence/`, as the dispatch requested.
- [x] CHK-051 [P1] `scratch/` is clean; it contains only `.gitkeep` (`evidence/closeout-rerun.txt:12`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 7/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. Strict validation passed with 0 warnings (`evidence/closeout-validation.txt:51`, `:53`). Open P1 items: CHK-040, CHK-041 and CHK-050.
<!-- /ANCHOR:summary -->

---
