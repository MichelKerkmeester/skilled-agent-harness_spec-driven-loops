---
title: "Negative knowledge"
description: "Carries ruled-out approaches and dead ends through iteration files, reducer sync, and final synthesis."
trigger_phrases:
  - "negative knowledge"
  - "ruled-out approaches"
  - "dead ends tracking"
  - "eliminated alternatives table"
  - "ruledOut array"
version: 1.14.0.10
---

# Negative knowledge

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries ruled-out approaches and dead ends through iteration files, reducer sync, and final synthesis.

Negative knowledge keeps failed paths visible instead of letting them disappear between iterations. It is a first-class part of the packet, not an optional appendix.

---

## 2. HOW IT WORKS

The live iteration contract requires `Ruled Out` and `Dead Ends` sections whenever an iteration eliminates a path. JSONL iteration records may also carry a structured `ruledOut` array with approach, reason, and evidence. That means dead paths are captured in both prose and machine-readable form during the loop, not reconstructed only at the end.

The reducer and synthesis phases keep that information alive. `reduce-state.cjs` promotes ruled-out directions into the strategy and findings registry so future iterations can avoid retrying blocked paths. Final synthesis then consolidates those eliminated paths into the required `Eliminated Alternatives` table inside `research/research.md`, which turns negative knowledge into a durable research output.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/agents/deep-research.md` | Agent | Requires `Ruled Out` and `Dead Ends` sections in iteration files and records ruled-out paths in JSONL. |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_format.md` | Reference | Defines the `ruledOut` JSONL payload and iteration-file requirements. |
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Reference | Defines the `Eliminated Alternatives` synthesis contract. |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reducer | Promotes ruled-out directions into synchronized strategy and registry state. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/ruled-out-directions-in-synthesis.md` | Manual playbook | Verifies ruled-out directions survive into final synthesis. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Vitest | Verifies reducer output retains ruled-out directions in the synchronized packet surfaces. |

---

## 4. SOURCE METADATA

- Group: Research output
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--research-output/negative-knowledge.md`
Related references:
- [progressive-synthesis.md](progressive-synthesis.md) — Progressive synthesis
