---
title: "Goal: Phase 1: template-drift-census-and-baseline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template drift census and baseline goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline"
    last_updated_at: "2026-10-24T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Closed phase 001 with the verified ledger and baseline"
    next_safe_action: "Start phase 002 from the verified ledger"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: template-drift-census-and-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a verified ledger of every defect in the system-spec-kit templates, examples and authoring docs, and measure how well DeepSeek V4.1 Flash authors a Level 2 packet before any template changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes no file under `.skilled/`. Its writes land in this phase folder and in the throwaway tracks `specs/zz-bench-authoring/` and `specs/zz-bench-hints/`, which are deleted after use. |
| D2 | Three census lanes run at once: templates without examples, examples, and references with `SKILL.md`. |
| D3 | A ledger row is kept only when its evidence command reproduces on the start commit. |
| D4 | The baseline is three serial runs of the frozen task in `tasks.md` T009 on `llmgateway/deepseek-v4.1-flash-1017` at max. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/ledger/ledger.jsonl` parses with `jq`, and rerunning every row's `evidence_cmd` on the start commit prints its `evidence_expect`
- [x] `scratch/ledger/ledger.jsonl` holds at least 18 leaked-description rows for example files, plus at least one row each for the `Checklist.md fully verified` lines, the write recipe's `<spec-folder>` line, the authoring checklist's `<spec-folder>` line and the style guide's `Why Bulleted Lists` heading
- [x] `scratch/baseline/baseline.json` holds 3 runs, each with `strict_passed`, `leftover_hints`, `missing_anchors`, `out_of_scope_writes` and `seconds`
- [x] `validate.sh` on this phase folder with `--strict` prints `RESULT: PASSED`
- [x] `git status --porcelain` at phase close lists no changed path outside this phase folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | Worktree `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring`, branch `worktrees/217-weak-model-spec-authoring`, provisioned with 11 installed, 5 built, 0 failed. |
| Start commit | `ac2be31ec60c3a15db527b3d8400ae68b373984a` | `git rev-parse HEAD` on the worktree before the first phase write. |
| T001 tools and provider | Done | `rg -c 'deepseek-v4.1-flash-1017' opencode.json` printed `3`; `which jq rg` printed `/usr/bin/jq` and `/opt/homebrew/bin/rg`. |
| T002 worktree validation | Done | `validate.sh specs/system-speckit/041-write-recipe-fixes/001-fix-write-recipe-backfill-flag --strict` printed `RESULT: PASSED`, pipeline exit `0`. |
| T003 start state | Done | `status-start.txt` written; Start commit recorded. The suite finished with `exit=0` and `Results: 12 passed, 0 failed (of 12)` in `suite-start.txt` after a third run with `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`. |
| T004 census lanes | Done | Three Task subagents returned `[T004-A] DONE - 22 rows`, `[T004-B] DONE - 31 rows`, `[T004-C] DONE - 28 rows`; `jq -c .` parsed all three lane files. |
| T005 lane coverage | Done | `coverage.txt`: lane-a 28 of 29, lane-b 26 of 26, lane-c 16 of 16; `under90=0`. Lane A's one unread file is `templates/scratch/.gitkeep`. |
| T006 reduce to verified rows | Done | `candidates.jsonl` 81, `ledger.jsonl` 73, `dropped.jsonl` 0, `unsafe.jsonl` 8. Every non-quarantined row reproduced. |
| T007 five confirmed defects | Done | leaked examples 18; `Checklist.md fully verified` 3; write-recipe placeholder 1; authoring-checklist placeholder 1; style-guide rows 2. |
| T008 hint list | Done | `hints-v2.2.txt` 87 lines; anchors spec 10, plan 11, tasks 15, acceptance-criteria 3; `specs/zz-bench-hints` deleted. |
| T009 baseline runs | Done | Three serial Task subagents returned `RESULT: PASSED`; replies in `scratch/runs/T009-1.txt`, `T009-2.txt`, `T009-3.txt`. |
| T010 measure runs | Done | `baseline.json` holds 3 runs, each with 6 keys: (1,1,0,0,133), (1,0,0,0,181), (1,0,0,0,368). |
| T013 baseline.md | Done | Three table rows; min and max recorded for all five metrics. |
| T011 frontier review | Done | The detached codex rerun finished with `exit=0` and wrote 47 findings to `T011.txt`: 0 P0, 6 P1, 41 P2. The first timeout transcript is `T011-run1-timeout.err`. |
| T012 review disposition | Done | 47 T012 lines match 47 findings. `L-C-003` was removed as a false positive and `L-C-013` had its expected text corrected; 45 findings are recorded with reasons. |
| T014 phase close | Done | `validate.sh --strict` printed `RESULT: PASSED`; the status diff outside this phase folder printed 0; all six acceptance criteria are `Met`; `implementation-summary.md` is rewritten. |

### Deviations and findings

| Item | Note |
|------|------|
| check-placeholders.sh false positive | The scan prints `FAIL - 4 placeholder pattern(s) found` and exits 1 on four bracket strings inside fenced code blocks in `tasks.md`. A fenced block is not an unfilled placeholder, so the docs keep the literal commands and this entry records the scan result. |
### T012 review disposition

T012-RECORDED L-A-002 P2: The path defect is real, but Phase 2 excludes core templates and `[PACKET-ID]` is not a packet-relative path. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-003 P2: The path defect is real, but Phase 2 excludes core templates and `[PACKET-ID]` is not a packet-relative path. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-004 P2: The path defect is real, but Phase 2 excludes core templates and `[PACKET-ID]` is not a packet-relative path. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-005 P2: The stale `.opencode/specs/**` path is real, but Phase 2 excludes add-on templates. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-007 P2: `specs/example` is not a valid tracked packet path or an existing example, so the proposed command still fails. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-008 P2: `specs/example` is not a valid tracked packet path or an existing example, so the proposed command still fails. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-A-015 P1: The required `risk-matrix` gate has no source anchor; owner 003 only converts placeholders, while Phase 4 plans to remove the example anchor. Not applied because it needs an operator or phase-owner decision before the ledger row changes.
T012-RECORDED L-A-016 P1: The required `user-stories` gate has no source anchor; owner 003 only converts placeholders, while Phase 4 plans to remove the example anchor. Not applied because it needs an operator or phase-owner decision before the ledger row changes.
T012-RECORDED L-B-029 P1: This maps REQ-006 to security review, but Level 3 REQ-006 is invalid login; owner 003 excludes examples and `OWNED BY PHASE` is not a finished replacement. Not applied because it needs an operator or phase-owner decision before the ledger row changes.
T012-RECORDED L-B-030 P1: This maps REQ-007 to invalid login, but Level 3 REQ-007 is session persistence; owner 003 excludes examples and `OWNED BY PHASE` is not a finished replacement. Not applied because it needs an operator or phase-owner decision before the ledger row changes.
T012-RECORDED L-B-031 P1: Owner 003 excludes examples, and `OWNED BY PHASE` leaves REQ-008 through REQ-011 without criteria. Not applied because it needs an operator or phase-owner decision before the ledger row changes.
T012-APPLIED L-C-003 removed from the ledger as a false positive; the generic <track> metavariable is valid guidance.
T012-RECORDED L-C-004 P2: The proposed heading still omits that implementation-summary.md becomes required only after implementation starts. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-005 P2: The hard-block claim is false because decision-record.md is a lazy add-on; owner 003 does not edit this reference and the expected text is only a sentinel. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-006 P2: Level 3 does not require decision-record.md; owner 003 does not edit this reference and the expected text is only a sentinel. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-007 P2: Replacing “bulleted list” with “Markdown table” overgeneralizes; the guide permits format exceptions. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-008 P2: The claim that levels never change add-ons contradicts the Level 1 versus Level 2+ acceptance-criteria entries; owner 003 excludes this file. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-011 P2: The proposed replacement still restricts research and decision records to Level 3, though both are lazy add-ons at every numbered level. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-012 P2: Level 3 does not require decision-record.md; owner 003 excludes this workflow and `OWNED BY PHASE` is not a correction. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-APPLIED L-C-013 expected_text corrected to 10 numbered steps with two substeps.
T012-RECORDED L-C-014 P2: `create.sh` does not accept `--sharded`; owner 003 excludes this file and the expected text is only a sentinel. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-015 P2: The renderer does not accept the listed flags, including `--dry-run`, `--verbose`, `--force`, and `--verify`; owner 003 excludes this file. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-019 P2: The replacement fixes only this occurrence; `/spec_kit:plan` and `/spec_kit:implement` remain at lines 113, 125, and 167. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-020 P2: Level 3 does not require an ADR; owner 003 excludes this file and `OWNED BY PHASE` is not a correction. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-021 P2: The proposed replacement leaves `/spec_kit:*` references at line 191. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-023 P2: `specs/007-feature/` omits the required track segment. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-025 P2: The validator checks anchor integrity and order, not fixed per-document counts; owner 003 excludes this file and Phase 041-006 excludes Step 6. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-027 P2: `specs/007-feature/` omits the required track segment. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED L-C-028 P2: No implementation reads or writes an intake lock; owner 003 excludes this file and `OWNED BY PHASE` is not a correction. Not applied because the ledger row is a verified defect and the exact replacement belongs to its owner phase.
T012-RECORDED NEW-01 missed defect at .skilled/skills/system-spec-kit/references/templates/level-specifications.md:29: The diagram places source templates at the templates root, but they live under core, addons, and packet-types. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-02 missed defect at .skilled/skills/system-spec-kit/references/templates/level-specifications.md:372: The 80–100 auto-detected Level 3+ band conflicts with the level-selection guide, which defines 3+ as an override on Level 3. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-03 missed defect at .skilled/skills/system-spec-kit/references/templates/template-guide.md:39: The placeholder instructions use `[PLACEHOLDER]`, while current template hints use `[YOUR_VALUE_HERE: ...]`. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-04 missed defect at .skilled/skills/system-spec-kit/references/templates/template-guide.md:90: “Optional Templates (Level 3 Only)” conflicts with lazy add-ons being available at every level. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-05 missed defect at .skilled/skills/system-spec-kit/references/templates/template-guide.md:99: The scaffold example writes to `specs/###-name`, omitting the required track directory. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-06 missed defect at .skilled/skills/system-spec-kit/references/templates/template-guide.md:1031: The example repeats `cli-opencode-alignment/` instead of showing a distinct second subfolder. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-07 missed defect at .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:43: It says enforcement is manual, while the same guide names `validate.sh --strict` and `check-completion.sh` as enforcement. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-08 missed defect at .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:69: The scaffold command uses `specs/###-name`, omitting the required track directory. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-09 missed defect at .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:449: The placeholder checklist names obsolete markers instead of the current `[YOUR_VALUE_HERE: ...]` token. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-10 missed defect at .skilled/skills/system-spec-kit/references/workflows/execution-methods.md:35: The validation examples use root-level `specs/001-feature/` paths instead of tracked packet paths. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-11 missed defect at .skilled/skills/system-spec-kit/references/workflows/worked-examples.md:71: The generated packet path omits the required track directory. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-12 missed defect at .skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md:191: The cross-command example still uses the obsolete `/spec_kit:*` prefix. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-13 missed defect at .skilled/skills/system-spec-kit/references/workflows/nested-changelog.md:30: The command examples use the obsolete `/spec_kit:*` prefix. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-14 missed defect at .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:108: The resume instruction uses the obsolete `/spec_kit:resume` command. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-15 missed defect at .skilled/skills/system-spec-kit/templates/packet-types/review.spec.md.tmpl:95: Section 8 follows section 4 with no sections 5–7, violating the sequential numbering rule. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-16 missed defect at .skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl:12: The default packet_pointer points to the template source directory, not the packet. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-17 missed defect at .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md:78: The command uses an unresolved `<folder>` shell argument with no substitution instructions. Not added because the exact locator and evidence row must be constructed by the owner phase.
T012-RECORDED NEW-18 missed defect at .skilled/skills/system-spec-kit/SKILL.md:563: The validation example omits the required track directory. Not added because the exact locator and evidence row must be constructed by the owner phase.

<!-- /ANCHOR:log -->
