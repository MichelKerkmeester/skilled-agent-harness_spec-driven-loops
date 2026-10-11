---
title: "Goal: Phase 3: playbook-catalog-truth"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook catalog truth goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth"
    last_updated_at: "2026-10-11T17:35:00Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran the ten-iteration deep-research loop and logged every criterion with evidence"
    next_safe_action: "Plan the fix phase from research/research.md R1 to R7"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: playbook-catalog-truth

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Recommend the lightest way for playbook scenarios and feature catalog entries to check themselves against the code through their own modes and validators.

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

- [ ] `find specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research -name deep-research-state.jsonl -exec grep -c '"type":"iteration"' {} \;`, run from the repository root, prints at least one line, and every line it prints is 10.
- [ ] `grep -cE '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/research.md`, run from the repository root, prints 1 or more.
- [ ] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/research.md | grep -cvE '[A-Za-z0-9_-]\.[A-Za-z0-9]+:[0-9]+'`, run from the repository root, prints 0, so every recommendation row cites a path:line.
- [ ] `grep -E '^\| R[0-9]+ \|' specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/research.md | grep -cvE '\| (Build nothing|Change a value|Extend in place|Add a function|Add a file|Add an abstraction|Add a dependency) \|'`, run from the repository root, prints 0, so every row names its move from the reversal-cost order in .skilled/repo-rules/prevent-overengineering.md.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth --strict`, run from the repository root, prints RESULT: PASSED.
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
| deep-research run | Done | 10 iteration records in `research/deep-research-state.jsonl`; every iteration passed `verify-iteration.cjs` on first dispatch; all ten receipts in `research/dispatch-receipts/` name `llmgateway/deepseek-v4.1-flash` at `--thinking max` |
| Synthesis | Done | `research/research.md` with 10 recommendation rows, R1 to R10 |
| Spot-check of cited lines (REQ-005, D5) | Done | A script read every path:line in the recommendation rows: 22 full-path citations resolve within bounds, and the one that does not, `schemas/advisor-tool-schemas.ts:221`, is the stale catalog citation quoted as written. Direct reads confirmed `validate_catalog_package.py:593` and `:306`, `create.sh:1637` against the playbook's line 90, `spec-folder-mutex.ts:10` and `:22`, `advisor-tool-schemas.ts:268`, `cite-drift-scan.mjs:8` and `:378`, `routing-registry-drift.yml:175` and `:180` |
| Rerun commands | Done | `cite-drift-scan.mjs --corpus skills`: rc 0, 505 citations, 2 past end, 219 unresolved, 4.5 s. `validate_catalog_package.py --json`: rc 0, 29 packages, 0 failures, 2 notes. `cite-drift-scan.mjs --advise` on the two drifted catalogs: checked 2, flagged 1, not in range 7. `grep -rln cite-drift .github/workflows` and `grep -rn validate_catalog_package .github/workflows`: both exit 1 |
| Criterion 1 (iteration count) | PASS | `find ... -exec grep -c '"type":"iteration"'` printed one line: 10 |
| Criterion 2 (rows exist) | PASS | printed 10 |
| Criterion 3 (path:line per row) | PASS | printed 0 |
| Criterion 4 (move per row) | PASS | printed 0 |
| Criterion 5 (strict validation) | PASS | `validate.sh <packet> --strict` printed `Summary: Errors: 0  Warnings: 1` and `RESULT: PASSED` after `repair-derived.cjs --apply` re-derived the graph metadata. The one warning is SOURCE_TAGS on `research/iterations/iteration-007.md:49`, which cites an archive copy through the `.skilled/specs` symlink; iteration files are write-once, so it stays. |
| check-goal.cjs | PASS | `RESULT: PASSED (5/5 checks)` |

### Deviations and findings

| Item | Note |
|------|------|
| Workflow executed by the orchestrator, step by step | The auto YAML was run through scratch driver scripts that call the YAML's own commands in its order (lock, gateway, convergence telemetry, prompt pack, cli-pi branch, verify, reducer, graph upsert, telemetry). No step was substituted. |
| Child-dispatch preamble added | `cli-pi` SKILL.md ALWAYS rule 11 requires the preamble on every non-interactive prompt, and the single-executor YAML branch does not add it, so it heads each rendered `prompts/iteration-N.md`. |
| First iteration-1 attempt dispatched nothing | A driver bug redirected the node heredoc's stdin from `/dev/null`, so node ran an empty script and exited 0. The verify gate caught it (`iteration_file_missing`); the bug was fixed and iteration 1 rerun. The stray pre-dispatch `iteration_start` row it wrote was dropped by the gateway's next projection refresh. |
| Executor provenance dropped from the state log | `writeFirstRecordExecutor` patches each iteration record by direct write, and the gateway's projection refresh removes the patch. Receipts keep the route. Recorded as a workflow defect for the deep-loop owners. |
| Leaf temp files removed | Iterations 9 and 10 left `.iter-009-event.json` and `.iter-010-event.json` in `research/`; both were copies of gateway records and were deleted. |
| Lineage corrections | Five corrections are in `research/research.md` section 7, among them that the token-at-line check already exists as `flagByIdentifierOverlap`. |
<!-- /ANCHOR:log -->
