---
title: "DOC-344 -- Doctor rebuild tier-aware default"
description: "Manual scenario validating default /doctor:rebuild tier-aware prompt behavior across short, medium, and long-pole steps."
version: 1.6.0.5
id: doctor-commands-doctor-rebuild-tier-aware-default
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-344 -- Doctor rebuild tier-aware default

## 1. OVERVIEW

This scenario validates default `/doctor:rebuild` behavior with no mode suffix. The single interactive mode must be tier-aware: short initialization steps run silently, medium work shares one combined prompt, and the long-pole memory rebuild gets an explicit ETA prompt before execution.

The user-facing safety point is pacing. A casual default update should not silently start a 5-15 minute memory rebuild.

---

## 2. SCENARIO CONTRACT

- Objective: Default-mode tier-aware prompts and step classification.
- Playbook ID: DOC-344.
- Real user request: `Run /doctor:rebuild (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.`
- Prompt: `Run /doctor:rebuild (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.`
- Preconditions: Mixed-state subsystems where at least one short, one medium, and the long-pole memory step are recommended for action.
- Expected execution process: Run `/doctor:rebuild`, capture Q0/default prompt behavior and phase prompts, approve safe branches, and verify prompt sequence against tier classification.
- Expected signals: skill-graph and deep-loop init run silently; code-graph and eval share one combined prompt; memory rebuild prompt includes `5-15 min runtime, proceed?` or equivalent ETA language.
- Desired user-visible outcome: A prompt-sequence verdict proving single interactive mode protects long work while avoiding noisy prompts for short steps.
- Pass/fail: PASS if prompt sequence and step classification match the tier-aware contract.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:rebuild (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA.
```

### Commands

1. Prepare a disposable workspace with mixed subsystem states.
2. Confirm the default command has no suffix and no obsolete mode-suffix invocation.
3. Run `/doctor:rebuild` through the real runtime.
4. Capture the initial Q0/default-mode prompt if emitted.
5. Continue with tier-aware update.
6. Capture the prompt sequence for short, medium, and long-pole steps.
7. Capture the final dashboard and `.doctor-rebuild.last-run.json`.

### Expected

The command loads `doctor-rebuild.yaml` and uses tier-aware interactive mode. Short steps such as deep-loop graph initialization run without individual prompts. Medium steps are grouped into a single combined proceed prompt. Any step the manifest marks long-pole gets an explicit prompt with an ETA before it begins. The memory context-index and vector rebuild that used to be the long pole is gone from the manifest along with its database.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Prompt sequence and step classification match the tier-aware contract.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If no ETA prompt appears before memory rebuild, inspect `doctor-rebuild.yaml` `prompt_tiers.long_pole_eta`. If medium steps are prompted separately, inspect the combined prompt policy. If short steps require approval, compare observed behavior to ADR-006 default-mode tiering.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/rebuild.md](../../../../commands/doctor/rebuild.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-rebuild.yaml](../../../../commands/doctor/assets/doctor-rebuild.yaml)
- Migration manifest: [specs/system-speckit/026-graph-and-context-optimization/.../scratch/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

Provenance: manual only - /doctor:rebuild

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-344
- Feature name: Doctor rebuild tier-aware default
- Command mode: `/doctor:rebuild`
- YAML asset: `doctor-rebuild.yaml`
- Prompt policy: short silent, medium combined, long-pole ETA.
- Runtime policy: Real interactive prompt capture only.
- Destructive: Potentially; disposable workspace only.
- Feature file path: `doctor-commands/doctor-rebuild-tier-aware-default.md`
