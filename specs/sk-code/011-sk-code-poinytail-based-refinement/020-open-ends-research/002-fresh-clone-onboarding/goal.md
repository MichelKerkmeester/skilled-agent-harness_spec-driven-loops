---
title: "Goal: Phase 2: fresh-clone-onboarding"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fresh clone onboarding goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding"
    last_updated_at: "2026-10-11T16:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: fresh-clone-onboarding

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Rank every stumble a fresh clone hits on the way to its first routed request and first spec packet, and recommend the smallest fixes in order of user impact.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run writes only under this folder, plus throwaway clones in a temporary directory it removes. No product file changes. |
| D2 | The run uses the `/deep:research` workflow for 10 iterations. A convergence stop before 10 is not done. |
| D3 | Each row of `research/research.md` reads `\| R<n> \| <recommendation> \| <path:line evidence> \| <move> \| <why the cheaper move fails> \|`, ranked so R1 matters most. |
| D4 | Every recommendation passes .skilled/repo-rules/prevent-overengineering.md: it names its move and, above Build nothing, says what fails at the cheaper move. |
| D5 | An executor's report is a claim. The orchestrator reads every cited path:line before the synthesis uses it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research -name deep-research-state.jsonl -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least one line, and every line it prints is 10.
- [x] `grep -cE '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/research.md`, run from the repository root, prints 1 or more.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every recommendation row cites a path:line.
- [x] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/research.md | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every row names its move from the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding --strict`, run from the repository root, prints RESULT: PASSED.
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
| deep-research run | Done | 10 iteration records in `research/deep-research-state.jsonl`; stop reason maxIterationsReached; every iteration passed `verify-iteration.cjs` |
| Executor route | Done | cli-pi, `llmgateway/deepseek-v4.1-flash` at thinking max (DevPass) for all 10 iterations, per `research/dispatch-receipts/`; no usage limit, cline-pass fallback unused |
| Synthesis | Done | `research/research.md`, 14 Recommendations rows in the D3 format, each with a reversal-cost move |
| Spot-check of cited path:line (REQ-005) | Done | Orchestrator read every cited line in the synthesis and the Recommendations table, and re-ran the advisor failure, the Code Mode Node 24 refusal and the root-file count on a pristine clone |
| Criterion 1 (10 iteration records) | Pass | `find ... -exec grep -c` printed `10` |
| Criterion 2 (R rows exist) | Pass | printed `14` |
| Criterion 3 (every row cites path:line) | Pass | printed `0` |
| Criterion 4 (every row names its move) | Pass | printed `0` |
| Criterion 5 (strict validation) | Pass | `RESULT: PASSED`, Errors 0, Warnings 1 (four iteration-file `SOURCE_TAGS` cite `deep-research-config.json:15` without its directory) |
| check-goal.cjs | Pass | `RESULT: PASSED (5/5 checks)` |

### Deviations and findings

| Item | Note |
|------|------|
| Iteration 4 finding 1 corrected | Its "advisor answers from a degraded local scorer" probe ran on an already-installed clone; on a pristine clone `advisor_recommend` exits 1. Recorded in `research/research.md` section 8 |
| Iteration 3 finding 6(c) corrected | `.skilled/plugins/sk-vision.js` exists as a second dangling symlink; the doc path is right |
| Executor timeout 1800s | Raised from the 900s default because iterations install and build inside the clone |
| Coverage graph database in the scratchpad | `DEEP_LOOP_COVERAGE_DB_DIR` pointed at the scratchpad so no write left the packet folder |
| Prompt carries the child-dispatch preamble and inlined persona | The cli-pi contract requires both; the auto YAML's single-executor branch sends only the prompt pack |
| Parent graph metadata left at base | The continuity save also touched the two parent `graph-metadata.json` files; they were restored to the base content to keep the diff inside this folder |
<!-- /ANCHOR:log -->
