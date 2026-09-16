---
title: "Goal: map every row the .skilled move touches"
description: "The durable directive for the phase that mapped every symlink, runtime file and reference per runtime and per area, and the criteria it closed against."
trigger_phrases:
  - "skilled reference map phase goal"
  - "per runtime map goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map"
    last_updated_at: "2026-09-16T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the directive this completed phase ran against"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - "research/maps/map-a-symlinks.tsv"
      - "research/maps/map-c-references.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-002-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: map every row the .skilled move touches

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce one reconciled, row-level map of every symlink, runtime file, home-level path and tracked reference the move touches, each classified and cited.

### Decisions

Frozen; changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two lanes map from a deterministic seed inventory: swe-2-max on cli-devin and deepseek-v4.1-flash on cli-pi, ten iterations each, convergence allowed. |
| D2 | Where the lanes disagree, the tree decides, and every row records the rule that decided it. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The maps hold 435 links, 231 runtime files, 36 home-level paths and 4,029 references, reconciled against the seed
- [x] No disagreement between the lanes is left unresolved
- [x] The regenerated trigger index holds no lineage path under `specs/`
- [x] The phase validates PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Maps and synthesis | Done | `research/maps/`; committed at `fa4362d5dc`, lane working tables renamed to kebab-case at `728c4f3efc` |

### Deviations and findings

| Item | Note |
|------|------|
| Seed inventory missed two binary-detected files | Added during reconciliation; the true tracked total is 4,260 |
<!-- /ANCHOR:log -->
