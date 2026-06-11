---
title: "Debug-delegation scaffold generator"
description: "scaffold-debug-delegation.sh generates a structured debug-delegation.md from a failure trail, versions filenames on collision, and never auto-dispatches @debug so the operator keeps explicit control of escalation."
trigger_phrases:
  - "debug-delegation scaffold generator"
  - "scaffold-debug-delegation.sh"
  - "generate debug-delegation"
  - "debug handoff document"
  - "failure trail scaffold"
---

# Debug-delegation scaffold generator

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

scaffold-debug-delegation.sh generates a structured debug-delegation.md from a failure trail, versions filenames on collision, and never auto-dispatches @debug so the operator keeps explicit control of escalation.

The script is the structured-handoff half of the failure-threshold offer flow. After three or more task failures during `/speckit:implement` or `/speckit:complete`, the workflow YAML surfaces a y/n/skip prompt asking the operator whether they want a pre-filled debug handoff document. On opt-in, the operator runs the scaffold script, which writes a `debug-delegation.md` into the spec folder with a known schema. The operator then dispatches the Task tool to @debug themselves, using the scaffold as the structured handoff payload. The workflow never invokes @debug autonomously.

---

## 2. HOW IT WORKS

### Core Behavior

The generator lives at `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`. It accepts `--spec-folder`, `--task-id`, `--error-category`, `--error-message`, `--affected-files`, `--hypothesis`, and `--errors-json`, populates a five-section markdown body, and writes the file into the named spec folder.

The output file always carries five numbered H2 headings: `PROBLEM SUMMARY`, `ATTEMPTED FIXES`, `CONTEXT FOR SPECIALIST`, `RECOMMENDED NEXT STEPS`, and `HANDOFF CHECKLIST`. Each attempt row in `--errors-json` produces a corresponding approach/result entry under ATTEMPTED FIXES. The frontmatter includes a `_memory.continuity` block with `packet_pointer` set to the spec folder relative path and `last_updated_by: "scaffold-debug-delegation.sh"` so continuity reads can locate the handoff.

### Edge Cases & Caveats

Filename versioning is collision-driven, not timestamp-driven. The first invocation produces `debug-delegation.md`. A second invocation in the same spec folder produces `debug-delegation-002.md`, the third produces `debug-delegation-003.md`, and so on. The original file is never overwritten so prior handoffs remain reviewable.

### Async & Safety

The two workflow YAMLs that drive the offer flow are `spec_kit_implement_auto.yaml` and `spec_kit_complete_auto.yaml`. Each contains a `debug_delegation` or `debug_escalation` block whose action is to prompt the operator with `y / continue manually / skip` and never to call the Task tool with `subagent_type: "debug"`. Together with the bash-only scaffold script, this preserves the user-invoked-only contract for @debug while still giving repeat-failure flows a clean handoff path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Script | Generates the five-section debug-delegation markdown from failure-trail flags and JSON attempt rows, with collision-driven file versioning |
| `.opencode/commands/speckit/assets/spec_kit_implement_auto.yaml` | Workflow asset | Carries the debug_delegation block that prompts the operator with y / continue manually / skip after the failure threshold |
| `.opencode/commands/speckit/assets/spec_kit_complete_auto.yaml` | Workflow asset | Carries the debug_escalation block that prompts the operator without autonomous @debug dispatch |
| `.opencode/agents/debug.md` | Agent | Defines the Debug Context Handoff schema that the scaffold script writes against |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/debug-delegation-scaffold-generator.md` | Manual playbook | Playbook scenario DBG-SCAF-001 covering scaffold generation, versioned filenames, schema parity with the debug agent, and absence of autonomous routing |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/debug-delegation-scaffold-generator.md`
Related references:
- [spec-folder-literal-naming-ai-derived-slugs.md](spec-folder-literal-naming-ai-derived-slugs.md) — Spec folder literal naming: AI-derived slugs
- [mcp-daemon-rebuild-restart-live-probe.md](mcp-daemon-rebuild-restart-live-probe.md) — MCP daemon rebuild, restart, and live-probe protocol
