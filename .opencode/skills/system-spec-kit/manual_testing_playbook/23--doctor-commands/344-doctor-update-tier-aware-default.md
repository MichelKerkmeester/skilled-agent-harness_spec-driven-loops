---
title: "DOC-344 -- Doctor update tier-aware default"
description: "Manual scenario validating default /doctor:update tier-aware prompt behavior across short, medium, and long-pole steps."
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

- Prompt transcript showing single interactive mode selection and tier-aware behavior.
- Evidence that short steps ran without individual prompts.
- Combined medium prompt covering code-graph and eval.
- Long-pole memory prompt including `5-15 min` or equivalent ETA language.
- State log mapping steps to tiers and outcomes.

### Pass / Fail

- **PASS**: short steps run silently, medium steps share one combined prompt, the memory rebuild prompt includes explicit ETA language, and the observed tier classification matches the command contract.
- **FAIL**: single interactive mode behaves like an unattended run, prompts every step individually, silently starts the memory rebuild, or misclassifies the documented tiers.
- **SKIP**: the sandbox cannot produce mixed subsystem states that exercise all three tiers.
- **UNAUTOMATABLE**: the runtime cannot invoke default `/doctor:update` interactively.

### Failure Triage

If no ETA prompt appears before memory rebuild, inspect `doctor_update.yaml` `prompt_tiers.long_pole_eta`. If medium steps are prompted separately, inspect the combined prompt policy. If short steps require approval, compare observed behavior to ADR-006 default-mode tiering.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../mcp_server/database/migration-manifest.json)
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
- Feature file path: `23--doctor-commands/344-doctor-update-tier-aware-default.md`
