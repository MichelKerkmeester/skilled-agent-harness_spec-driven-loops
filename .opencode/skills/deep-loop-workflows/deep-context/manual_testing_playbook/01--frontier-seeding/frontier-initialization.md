---
title: "FS-001 -- Frontier Initialization"
description: "This scenario validates Frontier Initialization for `FS-001`. It focuses on session classification logic and canonical state file creation before the first parallel sweep."
version: 1.2.0.3
---

# FS-001 -- Frontier Initialization

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FS-001`.

---

## 1. OVERVIEW

This scenario validates Frontier Initialization for `FS-001`. It focuses on session classification logic (fresh / resume / completed-session / invalid) and canonical state file creation before the first parallel sweep runs.

### Why This Matters

The initialization phase is the single point where an incorrect session classification can corrupt an entire context-gathering run. Misclassifying a completed session as fresh deletes prior findings; misclassifying an invalid state as resumable causes the loop to run against corrupted state. Getting this gate right protects both continuity and data integrity.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FS-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `step_classify_session` inspects existing state artifacts before writing any files, and that fresh sessions create all four canonical state artifacts from shipped templates.
- Real user request: `Validate that the deep-context initialization classifies session state correctly and only writes files on a fresh run.`
- Prompt: `As a manual-testing orchestrator, validate the session classification and state-file creation contract for deep-context against the command entrypoint, auto YAML, and asset templates. Verify step_classify_session inspects deep-context-config.json, deep-context-state.jsonl, and deep-context-strategy.md before writing, and that fresh sessions create those files from the default templates. Return a concise user-facing pass/fail verdict with the key evidence.`
- Expected execution process: Read `.opencode/commands/deep/assets/deep_context_auto.yaml` for `step_classify_session`; read `.opencode/commands/deep/context.md` for lineage mode documentation; verify `assets/deep_context_config.json` template exists; read SKILL.md §3 for session lifecycle.
- Expected signals: `step_classify_session` is present in the auto YAML; fresh/resume/completed-session/invalid outcomes are documented in the command or SKILL.md; `assets/deep_context_config.json` exists; `step_acquire_lock` is present in the YAML init phase.
- Desired user-visible outcome: The session classification check runs before any file writes on each invocation, ensuring resumed sessions skip initialization safely.
- Pass/fail: PASS if all four session outcomes are documented and `step_classify_session` appears in the auto YAML before any file-write step; FAIL if session classification is absent or the init writes are not gated on classification.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local; it is doc-verification only — stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FS-001 | Frontier Initialization | Verify session classification gates file writes | `Validate that the deep-context initialization classifies session state correctly and only writes files on a fresh run.` | 1. `rg "step_classify_session" .opencode/commands/deep/assets/deep_context_auto.yaml` -> 2. `rg "fresh\|resume\|completed-session\|invalid" .opencode/commands/deep/context.md` -> 3. `ls .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` -> 4. `rg "step_acquire_lock" .opencode/commands/deep/assets/deep_context_auto.yaml` | Step 1: `step_classify_session` found in YAML; Step 2: all four session outcomes mentioned; Step 3: template file exists; Step 4: lock step found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if any step returns no output | 1. Check YAML path is correct. 2. Search for alternative session-classification wording in the YAML. 3. Confirm `deep_context_auto.yaml` is the current YAML filename. |

### Optional Supplemental Checks

Verify that the resume path is described as "append a `resumed` event and skip to `phase_loop`" in either the command doc or SKILL.md:

```bash
rg "resumed\|skip.*phase_loop\|skip.*loop" .opencode/commands/deep/context.md .opencode/skills/deep-loop-workflows/deep-context/SKILL.md
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/01--frontier-seeding/frontier-initialization.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Primary implementation: phase_init steps including session classification and state-file creation |
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Default config template written during fresh initialization |
| `.opencode/commands/deep/context.md` | Command entrypoint documenting lineage modes and setup phase |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | Skill overview documenting session lifecycle in §3 HOW IT WORKS |

---

## 5. SOURCE METADATA

- Group: Frontier Seeding
- Playbook ID: FS-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--frontier-seeding/frontier-initialization.md`
