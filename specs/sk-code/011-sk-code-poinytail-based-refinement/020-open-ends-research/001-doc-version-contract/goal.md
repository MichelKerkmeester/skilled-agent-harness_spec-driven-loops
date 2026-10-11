---
title: "Goal: Phase 1: doc-version-contract"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doc version contract goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract"
    last_updated_at: "2026-10-11T17:41:15Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran the ten-iteration research and checked every completion criterion"
    next_safe_action: "Fix phase: apply R1 to R4 and R6 from research/research.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: doc-version-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Explain why doc-version verification fails on every skill and recommend the smallest doc-version contract, or its removal, with path:line evidence that an external author can act on.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No product file changes. |
| D2 | The run uses the `/deep:research` workflow for 10 iterations. A convergence stop before 10 is not done. |
| D3 | Each row of `research/research.md` reads `\| R<n> \| <recommendation> \| <path:line evidence> \| <move> \| <why the cheaper move fails> \|`, ranked so R1 matters most. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md: it names its move and, above Build nothing, says what fails at the cheaper move. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research -name deep-research-state.jsonl -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least one line, and every line it prints is 10.
- [x] `grep -cE '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/research.md`, run from the repository root, prints 1 or more.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every recommendation row cites a path:line.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/research.md | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every row names its move from the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal`; strict validation passed on the scaffold commit |
| deep-research run | Done | 10 iterations, all `cli-pi` on `llmgateway/deepseek-v4.1-flash` at `--thinking max`; every iteration passed `verify-iteration.cjs`, iteration 10 on its single redispatch |
| Synthesis | Done | `research/research.md` with R1 to R7; all 46 cited path:line references resolved by the orchestrator to the claimed content (REQ-005 spot-check) |
| Criterion 1 | Pass | prints one line: `10` |
| Criterion 2 | Pass | prints `7` |
| Criterion 3 | Pass | prints `0` |
| Criterion 4 | Pass | prints `0` |
| Criterion 5 | Pass | strict validation prints `RESULT: PASSED`; see the commit's Verification section |

### Deviations and findings

| Item | Note |
|------|------|
| Executed by hand | The auto YAML has no runner script, so the sub-orchestrator executed its steps in order and ported the `cli-pi` dispatch branch verbatim |
| Prompt additions | Each rendered prompt gained the child-dispatch preamble and the inlined `deep-research` persona, per `cli-pi` SKILL.md rules 10 and 11 |
| Skipped telemetry | The single-loop status-ledger heartbeat rows were not written; observability only |
| Parent metadata | `generate-context.js` rewrote two parent `graph-metadata.json` timestamps; both were restored from HEAD to keep writes inside this packet |
| Executor claims corrected | Engine duplication (a symlink), 713 vs 710 mismatches, spec counts are file totals, and the gate branch edit iteration 10 priced; see `research/research.md` Section 13 |
<!-- /ANCHOR:log -->
