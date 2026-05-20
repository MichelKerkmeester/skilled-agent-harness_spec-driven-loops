---
title: "Debug-delegation scaffold generator"
description: "scaffold-debug-delegation.sh generates a structured debug-delegation.md from a failure trail, versions filenames on collision, and never auto-dispatches @debug so the operator keeps explicit control of escalation."
---

# Debug-delegation scaffold generator

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

scaffold-debug-delegation.sh generates a structured debug-delegation.md from a failure trail, versions filenames on collision, and never auto-dispatches @debug so the operator keeps explicit control of escalation.

The script is the structured-handoff half of the failure-threshold offer flow. After three or more task failures during `/spec_kit:implement` or `/spec_kit:complete`, the workflow YAML surfaces a y/n/skip prompt asking the operator whether they want a pre-filled debug handoff document. On opt-in, the operator runs the scaffold script, which writes a `debug-delegation.md` into the spec folder with a known schema. The operator then dispatches the Task tool to @debug themselves, using the scaffold as the structured handoff payload. The workflow never invokes @debug autonomously.

---

## 2. CURRENT REALITY

The generator lives at `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`. It accepts `--spec-folder`, `--task-id`, `--error-category`, `--error-message`, `--affected-files`, `--hypothesis`, and `--errors-json`, populates a five-section markdown body, and writes the file into the named spec folder.

The output file always carries five numbered H2 headings: `PROBLEM SUMMARY`, `ATTEMPTED FIXES`, `CONTEXT FOR SPECIALIST`, `RECOMMENDED NEXT STEPS`, and `HANDOFF CHECKLIST`. Each attempt row in `--errors-json` produces a corresponding approach/result entry under ATTEMPTED FIXES. The frontmatter includes a `_memory.continuity` block with `packet_pointer` set to the spec folder relative path and `last_updated_by: "scaffold-debug-delegation.sh"` so continuity reads can locate the handoff.

Filename versioning is collision-driven, not timestamp-driven. The first invocation produces `debug-delegation.md`. A second invocation in the same spec folder produces `debug-delegation-002.md`, the third produces `debug-delegation-003.md`, and so on. The original file is never overwritten so prior handoffs remain reviewable.

The two workflow YAMLs that drive the offer flow are `spec_kit_implement_auto.yaml` and `spec_kit_complete_auto.yaml`. Each contains a `debug_delegation` or `debug_escalation` block whose action is to prompt the operator with `y / continue manually / skip` and never to call the Task tool with `subagent_type: "debug"`. Together with the bash-only scaffold script, this preserves the user-invoked-only contract for @debug while still giving repeat-failure flows a clean handoff path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Script | Generates the five-section debug-delegation markdown from failure-trail flags and JSON attempt rows, with collision-driven file versioning |
| `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml` | Workflow asset | Carries the debug_delegation block that prompts the operator with y / continue manually / skip after the failure threshold |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Workflow asset | Carries the debug_escalation block that prompts the operator without autonomous @debug dispatch |
| `.opencode/agents/debug.md` | Agent | Defines the Debug Context Handoff schema that the scaffold script writes against |

### Validation And Tests

| File | Focus |
|------|-------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md` | Playbook scenario DBG-SCAF-001 covering scaffold generation, versioned filenames, schema parity with the debug agent, and absence of autonomous routing |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/41-debug-delegation-scaffold-generator.md`
