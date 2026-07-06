---
title: "PB-004: Motion Procedure Selection Proof"
description: "Verify motion mode selects the interaction-states procedure card and preserves the read-only motion tool surface."
version: 1.0.0.0
---

# PB-004: Motion Procedure Selection Proof

## 1. OVERVIEW

This scenario verifies that a public `motion` request with state feedback needs selects the private interaction-states card without exposing the card as a public mode.

## 2. SCENARIO CONTRACT

**Realistic user request**: A product team needs hover, focus, active, loading, disabled, and reduced-motion behavior for a command menu before implementation handoff.

**Exact prompt**:
```text
motion: define hover, focus, active, loading, disabled, and reduced-motion behavior for this command menu. Before giving timing guidance, state the public sk-design mode, the internal procedure card you selected, and why that card fits.
```

**Expected mode resolution**: `motion`.

**Expected procedure card**: `design-motion/procedures/interaction_states_pass.md`.

**Why**:
- `SKILL.md` section `Procedure Card Selection` maps hover, active, focus, disabled, loading, selected, navigation, forms, custom widgets, and missing feedback to `procedures/interaction_states_pass.md`.
- `SKILL.md` section `Context, Proof, And Direct Fallback` requires public mode, loaded references, selected card, affected states, motion budget, reduced-motion bar, and verification risks before a ready or handoff claim.

**Expected tool surface**: read-only. The `motion` mode may use Read, Glob, and Grep only.

## 3. TEST EXECUTION

### Preconditions

1. `design-motion/SKILL.md` contains `Procedure Card Selection` and `Context, Proof, And Direct Fallback`.
2. `design-motion/procedures/interaction_states_pass.md` exists.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the resolved `workflowMode`, selected procedure card, loaded resources, tool calls, context basis, proof line, and response in `/tmp/skd-PB004-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design`, resolved mode is `motion`, the response names `design-motion/procedures/interaction_states_pass.md`, the rationale ties it to interaction states and reduced-motion behavior, the context basis appears before timing guidance, and no mutating tool is used.
- **FAIL** iff the card is omitted, a private procedure becomes a public route, the response uses Write/Edit/Bash/Task, or timing guidance appears before the context/proof basis.

### Failure Triage

1. Re-read `design-motion/SKILL.md` section `Procedure Card Selection`.
2. Confirm the exact prompt includes interaction-state vocabulary rather than generic animation vocabulary.
3. Compare observed tool calls against the read-only `motion` surface.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md`
- `.opencode/skills/sk-design/mode-registry.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
