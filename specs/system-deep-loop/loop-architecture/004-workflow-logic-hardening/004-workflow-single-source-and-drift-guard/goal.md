---
title: "Goal: Phase 4: workflow-single-source-and-drift-guard"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "workflow single source and drift guard goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard"
    last_updated_at: "2026-11-14T11:33:22Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: workflow-single-source-and-drift-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Each of `/deep:research` and `/deep:review` runs from one workflow file whose steps, executor branches and flags are the same in both execution modes, and a test fails the suite if that stops being true.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each command has one authored workflow file that serves both execution modes, after the pattern of `.skilled/commands/speckit/assets/speckit-plan.yaml` and `.skilled/commands/speckit/plan.md`. A generator that emits a confirm file from an auto file is rejected because it still leaves two artifacts and two loads to keep in step. |
| D2 | Every executor branch, flag and step exists once and applies in both modes. Mode changes only approval checkpoints and wording. |
| D3 | Dry run works in both modes of both commands, is documented in both command docs and both presentation files and halts before any dispatch or state write. |
| D4 | Size comes down by moving inline scripts into runtime scripts both commands call and by collapsing the three pivot seat blocks into one parameterized step. No cross-command YAML include system. The cap is 140000 bytes for `deep-research.yaml` and 155000 bytes for `deep-review.yaml`. |
| D5 | A drift guard fails the suite when a second per-mode workflow file reappears, when a command doc lists a flag its workflow never reads or when a workflow reads a flag the command doc does not list. It extends `runtime/tests/unit/compile-command-contracts.vitest.ts`. |
| D6 | Everything that names the four old file names is updated in this phase: both command docs, the compiler and renderer path, `command-metadata.json`, the legacy and compiled readmes and every test. Mode skills, references, catalogs and playbooks are phase 005's. `deep-ai-council` is out of scope and belongs to sibling phase `006-ai-council-mode-deprecation`. |
| D7 | This phase runs after phases 001 to 003 and depends on all three. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `ls .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` exits 1 for each path, and `deep-research.yaml` and `deep-review.yaml` exist.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test` exits 0, including the drift guard in `tests/unit/compile-command-contracts.vitest.ts`.
- [ ] The drift guard exits non-zero on a scratch copy that restores `deep-research-confirm.yaml`, saved as `scratch/guard-negative.txt`.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0.
- [ ] `wc -c` prints at most 140000 for `deep-research.yaml` and at most 155000 for `deep-review.yaml`.
- [ ] Each of the four dry-run transcripts under `scratch/` holds a `dry_run_halt` row and no state file was written.
- [ ] `rg -n 'Retry' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints the confirm failure gate once per file.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Operator answers recorded | Done | Spec, plan, tasks, acceptance criteria and goal updated on 2026-11-14. Implementation has not started |
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14. Implementation has not started |

### Deviations and findings

| Item | Note |
|------|------|
| F14 step claim | The twins share 73 and 72 step names only when names listed under `confirm_parity.omitted_steps` are counted. Inside `workflow:` the confirm files hold 63 and 68 steps. Under D2 the 10 research and 4 review auto-only steps will also run in confirm mode |
| F14 executor claim | Confirm does carry `if_cli_claude_code`, `if_cli_opencode` and `if_native`. Five branches are missing: codex, cursor, devin, pi and deepseek harness |
| F14 failure branches | Confirm splits `if_failed` into recoverable and unrecoverable. The merge keeps the policy phase 002 settles |
| D6 file list | `command-metadata.json`, `render-command-contract.cjs` and `compiled/README.markdown` name no workflow file. `legacy/README.markdown:81-82` names the mode workflows in prose only |
| Authoring decision: file names | The single files are `deep-research.yaml` and `deep-review.yaml`, following `speckit-plan.yaml` |
| Authoring decision: flag parity rule | Flags map to workflow keys by dropping `--` and turning `-` into `_`, plus an alias table in the test such as `--no-resource-map` to `resource_map.emit` |
| Authoring decision: functional readers | Readers that would break on the rename are updated here even though D6 does not name them: `speckit-complete.yaml`, `review-mode-contract.yaml`, `check-contract-drift.cjs`, `check-ledger-stem-producers.cjs`, both ledger type files and `verify-yaml-script-paths.sh` |
| Authoring decision: size cap | 140000 and 155000 bytes, each below both twins it replaces, derived in `plan.md` section 4 from the census |

### Operator decisions

| Date | Decision |
|------|----------|
| 2026-11-14 | Phase 005 owns the docs outside the two mode packets that name the changed files: the agent definitions, the `sk-doc` and `sk-code` checklists and the speckit README. The one exception is a file a phase 004 test reads, which phase 004 updates so its own test passes. This replaces the two open questions this packet carried |
| 2026-11-14 | Confirm mode keeps the Retry, Skip or Cancel gate after three consecutive failed iterations that phase 002 specifies. It is an approval checkpoint under D2. REQ-015, T080 and T081 keep it through the merge |
| 2026-11-14 | Sibling phase `006-ai-council-mode-deprecation` retires the council mode. `deep-ai-council` stays out of scope here and that phase owns it |

<!-- /ANCHOR:log -->
