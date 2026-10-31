---
title: "Goal: sk-doc Validator Notices and Dead Playbook Citations"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/012-sk-doc-validator-and-reference-fixes"
    last_updated_at: "2026-09-27T19:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Ticked all five criteria from the build evidence of a9dbac98ef"
    next_safe_action: "None. The phase is Complete; the orchestrator commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-phase-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: sk-doc Validator Notices and Dead Playbook Citations

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sk-doc's `validate_document.py` say when it falls back to README rules and its `quick_validate.py` block a non-qualified MCP tool token for skills as it does for commands, and repoint or remove the four dead `file:line` citations in the deep-research and spec-kit playbooks, each under its owner's contract.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The README fallback gets a non-blocking `document_type_fallback` warning. No exit code of `validate_document.py` changes and no detection rule is added |
| D2 | A non-qualified MCP tool token blocks in `quick_validate.py` for every package kind. No other rule in that file changes |
| D3 | Only the four counted dead citations are fixed, by hand. A recorded capture keeps its original count line and says in its note what was removed |
| D4 | New tests go in the owner's existing files `test_structure_validation.py` and `test_quick_validate_086.py`. The owner suite's four failures from before this phase are not fixed here |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `validate_document.py` without `--type` exits 0 on `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` and 1 on `.skilled/repo-rules/communication.md`, and both outputs hold a `document_type_fallback` warning
- [x] `quick_validate.py` exits 1 on a skill whose `allowed-tools` holds `mcp__code_mode` and exits 0 when it holds `mcp__code_mode__call_tool_chain`
- [x] `rg -n -e 'deep/research\.md:307' -e 'deep/research\.md:176' -e 'regressions\.vitest\.ts:67' -e 'regressions\.vitest\.ts:109' .skilled/skills` prints nothing, and the two deep-research rows cite `deep-research-presentation.txt:379-388` and `deep-research-presentation.txt:233-236`
- [x] `run-script-tests.sh` under `.skilled/skills/sk-doc/scripts/tests/` prints `PASS` for `test_structure_validation.py` and `test_quick_validate_086.py` and fails no file other than `test_create_skill_contract.py`, `test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py` and `test_root_name_consumer_matrix.py`
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored on 2026-09-27 from the orchestrator brief's section for this phase and `007-classifier-deep-research/research/research.md` rows `:468-469`, `:478` and ledger rows 101, 103 and 110 to 112 |
| Cited lines reopened | Done | 2026-09-27: `validate_document.py:255-256`, `quick_validate.py:239-251`, `research.md` 160 lines, `memory-pipeline-regressions.vitest.ts` 63 lines. New targets read at `deep-research-presentation.txt:233-236` and `:379-388` |
| Baselines | Done | Owner suite exit 1 with 4 failing files. Fallback probes exit 0 and 1 as `readme`. Non-qualified MCP tokens in 226 tracked `allowed-tools` files outside `specs/`: 0. The four dead citations found by `rg`: 4 |
| Owner history | Done | Last commits at planning: `validate_document.py` `aa07fae5fa` (2026-09-18, since superseded by `666abc1a22e`, see below), `quick_validate.py` `db8af052ca`, deep-research playbook files `e14d5b196b`, spec-kit playbook file `56772cb93c` (all 2026-09-17). No uncommitted change on any of them. No open packet plans an edit to either validator |
| Build baseline | Done | 2026-09-27, orchestrator, at build-start HEAD `6f47c32dce` (after the main merge `d6e512e6b5`): no uncommitted change on the eight paths. Owner suite 24 PASS, 2 FAIL (`test_readme_manifest.py`, `test_rename_tooling_fixture_harness.py`), exit 1. Playbook probe exit 0 as `readme`, `warnings` `[]`. `communication.md` exit 1 as `readme`, no fallback entry. Non-qualified MCP tokens: 0 |
| Build | Done | 2026-09-27: six briefs from `scratch/briefs/`, each verified by the orchestrator. 01 fallback warning (codex gpt-5.5 medium, 120 s), 02 MCP token blocking (cursor grok-4.7-xhigh-fast, 116 s), 03 README row, 04 and 05 citations, 06 dead rows (pi deepseek-v4.1-flash thinking max, 91, 32, 23 and 47 s). Commit `a9dbac98ef` |
| Verification | Done | 2026-09-27, orchestrator: dead-citation `rg` prints nothing, exit 1. Full suite 24 PASS and the same 2 FAIL by name, exit 1, with `PASS test_structure_validation.py` and `PASS test_quick_validate_086.py`. Playbook probe exit 0 with one `document_type_fallback`, `communication.md` exit 1 with it, `--type readme` none. AC-002 fixture exits 1 then 0. The three playbook files `VALID` as `playbook_feature`, exit 0 |
| Cross-family review | Done | 2026-09-27, a Claude reviewer over code written by GPT and Grok: no P0 or P1. Each new test fails on the pre-build code. JSON keys and exit codes match old and new; none of 307 skill folders changes verdict. One P2 predating the phase, recorded below |
| Phase docs | Done | 2026-09-27: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence, and the stale pins are rewritten. `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` exits 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title and phase count | The scaffold named this "Phase 3" and "12 of 17". The folder is phase 12, and 18 phase folders exist on disk, so the docs say "12 of 18" and carry a descriptive title |
| Owner suite red before the phase | The brief asks for a green owner suite. It failed four files before any change, one on a missing `@spec-kit/shared/frontmatter/parse-frontmatter.js` module, so the criterion compares the failing set by name instead |
| Spec-kit rows removed, not repointed | The brief allows removal when the content is gone. The cited `../../shared/embeddings` import no longer exists in the test file, and the rows sit in a recorded capture, so the plan removes them and extends the capture's own note |
| Executor for brief 02 (build) | Brief 02 ran on cursor Grok 4.7 (`grok-4.7-xhigh-fast`) instead of codex gpt-5.5, because codex hit its usage limit mid-wave. Source: the codex error "You've hit your usage limit ... try again at 10:43 PM" |
| Owner suite failing set (build) | REQ-006 and criterion 4 name four failing files from the planning run. At the build baseline on 2026-09-27 only two failed, `test_readme_manifest.py` and `test_rename_tooling_fixture_harness.py`, so the comparison is by name against that two-file set, a subset of the four. Source: the orchestrator's baseline run |
| Dispatch briefs kept (build) | `scratch/briefs/` stays as the record of what each executor was sent, so `scratch/` is not emptied to `.gitkeep` as T019 asked. Source: the orchestrator's build evidence |
| Baselines not in scratch (build) | T003 and T004 named `scratch/suite-baseline.txt` and `scratch/fallback-baseline.txt`. The baselines are recorded by name in the orchestrator's build evidence and in this log instead. Source: `ls -la scratch/` shows only `.gitkeep` and `briefs/` |
| Stale planning pins (build) | `validate_document.py` changed after planning (`666abc1a22e`, `e33f1a6ff3e`), moving its pins by 11 lines: README default `:266-267`, `detect_document_type` `:221-267`, `validate_document()` `:1574-1678`. `research.md` has 159 lines, not 160, and `memory-pipeline-regressions.vitest.ts` 62, not 63. Three test files import `detect_document_type`, not five. `spec.md`, `plan.md` and `tasks.md` now say so, citing by function name where the build shifts a line. Source: `scratch/briefs/00-index.md` premises section |
| Parent changelog (build) | `spec.md` Phase Context asks for a refresh of `../changelog/`. `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist, so there was nothing to refresh. Source: the orchestrator's build evidence |
| `total_issues` on a fallback (build) | The notice joins the result's issue list, so `total_issues` rises by 1 on a fallback document (0 to 1 for the playbook root index). Every JSON key stays, as NFR-R02 requires, and no caller that omits `--type` reads `total_issues`. Source: `scratch/briefs/00-index.md` design note |
| Quoted MCP token (review finding, P2) | `quick_validate.py` strips only whitespace from `allowed-tools` tokens, so a quoted token such as `"mcp__code_mode"` still passes. It predates this phase and sits outside REQ-002, so it is recorded for the `sk-doc` owner, not fixed. Source: the cross-family review |
<!-- /ANCHOR:log -->
