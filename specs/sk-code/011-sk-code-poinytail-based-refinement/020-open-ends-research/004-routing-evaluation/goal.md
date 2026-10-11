---
title: "Goal: Phase 4: routing-evaluation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "routing evaluation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation"
    last_updated_at: "2026-10-11T17:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the research run against every criterion"
    next_safe_action: "A later fix phase starts from R1 in research/research.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: routing-evaluation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recommend a realistic held-out evaluation set and a cross-path parity check for system-skill-advisor that stay cheap and honest.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder. No product file changes. |
| D2 | The run uses the `/deep:research` workflow for 10 iterations. A convergence stop before 10 is not done. |
| D3 | Each row of `research/research.md` reads `\| R<n> \| <recommendation> \| <path:line evidence> \| <move> \| <why the cheaper move fails> \|`, ranked so R1 matters most. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md: it names its move and, above Build nothing, says what fails at the cheaper move. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line before the synthesis uses it. |
| D6 | No recommendation proposes a fix for probe P4, probe P7 or admission scenario DOC-331. Their fix is in flight elsewhere, so their current state is treated as moving. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research -name deep-research-state.jsonl -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least one line, and every line it prints is 10.
- [x] `grep -cE '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/research.md`, run from the repository root, prints 1 or more.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every recommendation row cites a path:line.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/research.md | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every row names its move from the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation --strict`, run from the repository root, prints RESULT: PASSED.
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
| deep-research run | Done | 10 iteration records; all 10 on `llmgateway/deepseek-v4.1-flash` at `--thinking max`; no redispatch, no containment advisory, no usage limit |
| Spot-check of cited lines | Done | Orchestrator reread every path:line in the R table and ran the CI grep, the ratchet under vitest and a live daemon probe; log in `research/research.md` section 13 |
| Criterion 1, iteration count | Pass | `find ... -exec grep -c` prints one line: `10` |
| Criterion 2, R rows | Pass | `9` |
| Criterion 3, rows without path:line | Pass | `0` |
| Criterion 4, rows without a move | Pass | `0` |
| Criterion 5, strict validation | Pass | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Prompt deviation | The single-executor cli-pi branch sends the bare prompt pack. cli-pi requires the child preamble and an inlined persona, so both were prepended to each rendered prompt. Proposed amendment: the `if_cli_pi` branch of `deep-research-auto.yaml` should prepend them itself |
| Corrected prediction | Iterations 9 and 10 predicted the ratchet would fail rule (c) on `rr-iter3-168`. Under vitest it passes 6/6; the replay ran outside the VITEST fixture-vector regime. Recast as recommendations R3 and R8 |
| Scope restore | The continuity writer refreshed activity timestamps in two parent `graph-metadata.json` files; both were restored from HEAD to keep writes inside this folder |
| D6 | No recommendation proposes a fix for P4, P7 or DOC-331 |
<!-- /ANCHOR:log -->
