---
title: "Progressive synthesis"
description: "Keeps research/research.md current during the loop while preserving workflow ownership of the final synthesis pass."
trigger_phrases:
  - "progressive synthesis"
  - "research.md live update"
  - "progressiveSynthesis flag"
  - "incremental research document"
  - "iteration-time synthesis writes"
version: 1.14.0.11
---

# Progressive synthesis

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keeps `research/research.md` current during the loop while preserving workflow ownership of the final synthesis pass.

Progressive synthesis is the live writing path for the research document. It lets the packet stay readable during the loop without moving ownership of the final result away from the workflow.

---

## 2. HOW IT WORKS

`progressiveSynthesis` defaults to `true` in the shipped config template. When that flag is enabled, the iteration agent may create or extend `research/research.md` after each pass by adding new findings to the relevant sections. The agent may read and edit that file, but only under the progressive-synthesis rule set and only after reading config first.

The final workflow still owns synthesis. After convergence, the synth phase reads all iteration files and the final strategy state, deduplicates overlap, and cleans the document into the canonical 17-section structure. If `progressiveSynthesis` is disabled, the loop skips iteration-time writes and creates `research/research.md` from scratch during synthesis, but the file remains the workflow-owned final research surface in both modes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json` | Asset | Sets `progressiveSynthesis` to `true` by default in the live config template. |
| `.opencode/agents/deep-research.md` | Agent | Defines when the iteration agent may create or update `research/research.md`. |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_format.md` | Reference | Defines progressive update rules for `research/research.md`. |
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Reference | Defines the final synthesis cleanup pass that consolidates the document. |
| `.opencode/commands/speckit/deep-research.md` | Command | Publishes `research/research.md` as a canonical loop output. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/progressive-synthesis-behavior-for-research-md.md` | Manual playbook | Verifies iteration-time updates respect the progressive-synthesis contract. |
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/final-synthesis-memory-save-and-guardrail-behavior.md` | Manual playbook | Verifies final synthesis still owns the terminal research document. |

---

## 4. SOURCE METADATA

- Group: Research output
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--research-output/progressive-synthesis.md`
Related references:
- [negative-knowledge.md](negative-knowledge.md) — Negative knowledge
