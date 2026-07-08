---
title: "DOC-344 -- Doctor update tier-aware default"
description: "Manual scenario validating default /doctor:update tier-aware prompt behavior across short, medium, and long-pole steps."
version: 3.6.0.5
---

# DOC-344 -- Doctor update tier-aware default

## 1. OVERVIEW

This scenario validates default `/doctor:update` behavior with no mode suffix. The single interactive mode must be tier-aware: short initialization steps run silently, medium work shares one combined prompt, and the long-pole memory rebuild gets an explicit ETA prompt before execution.

The user-facing safety point is pacing. A casual default update should not silently start a 5-15 minute memory rebuild.

---

## 2. SCENARIO CONTRACT

- Objective: Default-mode tier-aware prompts and step classification.
- Playbook ID: DOC-344.
- Real user request: `Run /doctor:update (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.`
- Prompt: `Run /doctor:update (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.`
- Preconditions: Mixed-state subsystems where at least one short, one medium, and the long-pole memory step are recommended for action.
- Expected execution process: Run `/doctor:update`, capture Q0/default prompt behavior and phase prompts, approve safe branches, and verify prompt sequence against tier classification.
- Expected signals: skill-graph and deep-loop init run silently; code-graph and eval share one combined prompt; memory rebuild prompt includes `5-15 min runtime, proceed?` or equivalent ETA language.
- Desired user-visible outcome: A prompt-sequence verdict proving single interactive mode protects long work while avoiding noisy prompts for short steps.
- Pass/fail: PASS if prompt sequence and step classification match the tier-aware contract.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.
```

### Commands

1. Prepare a disposable workspace with mixed subsystem states.
2. Confirm the default command has no suffix and no obsolete mode-suffix invocation.
3. Run `/doctor:update` through the real runtime.
4. Capture the initial Q0/default-mode prompt if emitted.
5. Continue with tier-aware update.
6. Capture the prompt sequence for short, medium, and long-pole steps.
7. Capture the final dashboard and `.doctor-update.last-run.json`.

### Expected

The command loads `doctor_update.yaml` and uses tier-aware interactive mode. Short steps such as skill-graph and deep-loop graph initialization run without individual prompts. Medium steps such as code-graph scan and spec-kit eval ablation are grouped into a single combined proceed prompt. The context-index/vector memory rebuild gets an explicit long-pole prompt with a 5-15 minute ETA before `memory_index_scan` begins.

### Evidence

- BLOCKED before invoking `/doctor:update`: Command step 1 requires `Prepare a disposable workspace with mixed subsystem states.`, but this run's allowed write paths permit edits only to `.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-tier-aware-default.md`. Preparing a disposable workspace would require creating/modifying files outside the allowed path.
- BLOCKED before invoking `/doctor:update`: the scenario metadata says `Destructive: Potentially; disposable workspace only.`
- Read of `.opencode/commands/doctor/update.md` confirmed the default command has no suffix and obsolete mode suffixes are invalid:

```text
3: argument-hint: "[--force] [--no-snapshot] [--cleanup-legacy] [--migrate] [--keep-snapshots] [--resume-bootstrap]"
38: ## Routing Rules
40: - This command is always interactive; deleted mode suffixes are invalid.
46: - Every terminal path writes the update state log defined by the YAML workflow.
```

- Read of `.opencode/commands/doctor/assets/doctor_update.yaml` confirmed running the real workflow would write outside the allowed path:

```text
18:   state_log: "mcp_server/database/.doctor-update.last-run.json"
98: mutation_boundaries:
99:   allowed_targets:
100:     - ".opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite"  # structural code graph DB (skill-local)
102:     - "mcp_server/database/context-index.sqlite"  # canonical memory DB
104:     - ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite"  # standalone advisor routing graph DB
106:     - ".opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite"  # research/review coverage graph DB
108:     - "mcp_server/database/speckit-eval.db"  # eval/ablation DB
110:     - "mcp_server/database/.doctor-update.flock"  # single-instance lock
112:     - "mcp_server/database/.doctor-update.last-run.json"  # orchestrator state log
386:   phase_5_dependency_order_execute:
397:       code-graph: "code_graph_scan({ incremental: false })"
399:         action: "memory_index_scan({ incremental: false, force: true })"
456:       skill-graph: "mk_skill_advisor.skill_graph_scan({})"
457:       advisor: "mk_skill_advisor.advisor_rebuild({ force: true }) + mk_skill_advisor.advisor_validate({})"
459:       speckit-eval: "eval_run_ablation({})"
501:   phase_10_state_log_unlock_cleanup:
503:     state.log: "write .doctor-update.last-run.json with timestamps, durations, snapshot paths"
```

- Glob check for the state log path returned an existing state log path, confirming the real command's final artifact path is outside the only allowed write path:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json
```

- No prompt transcript, tier-aware prompt sequence, final dashboard, or fresh `.doctor-update.last-run.json` was captured because invoking the real command would violate the user-provided write-path restriction and the playbook's own disposable-workspace precondition is unavailable under that restriction.

### Pass / Fail

- **BLOCKED**: the current run forbids all writes except this scenario file, while the scenario requires a disposable workspace and the real `/doctor:update` workflow writes database, lock, snapshot, and state-log artifacts outside the allowed path.

### Failure Triage

If no ETA prompt appears before memory rebuild, inspect `doctor_update.yaml` `prompt_tiers.long_pole_eta`. If medium steps are prompted separately, inspect the combined prompt policy. If short steps require approval, compare observed behavior to ADR-006 default-mode tiering.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-344
- Feature name: Doctor update tier-aware default
- Command mode: `/doctor:update`
- YAML asset: `doctor_update.yaml`
- Prompt policy: short silent, medium combined, long-pole ETA.
- Runtime policy: Real interactive prompt capture only.
- Destructive: Potentially; disposable workspace only.
- Feature file path: `23--doctor-commands/doctor-update-tier-aware-default.md`
