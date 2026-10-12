---
title: "Implementation Summary"
description: "Two ten-iteration lineages and the orchestrator's own copy runs found that a user's sk-code surface outranks sk-code-opencode with no new field: insert it ahead of opencode in tieBreak. The real gap is that deleting the obsidian and webflow examples is not a supported path."
trigger_phrases:
  - "external surface priority research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research"
    last_updated_at: "2026-10-12T21:30:00Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran round two: two more ten-iteration lineages, merged all four"
    next_safe_action: "Orchestrator writes the merged two-round synthesis over all 40 iterations"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-025-external-surface-priority-research"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "R5: should sk-code-opencode keep generic language keywords"
    answered_questions:
      - "Q1 to Q6, see research/research.md sections 3 to 7"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-external-surface-priority-research |
| **Completed** | 2026-10-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a checked answer to how Skilled should treat the sk-code surfaces for external users. A user's own surface outranks sk-code-opencode without any new field: it goes ahead of opencode in the one `tieBreak` list the compiler already reads, and the shipped order already ranks the native surface ahead of the two examples, so the operator's repository keeps its order unchanged. The real gap is that deleting the obsidian and webflow examples is not a supported path today.

### Phase 25: external-surface-priority-research

`research/research.md` holds 33 checked findings (F1 to F33), five ranked recommendations (R1 to R5), nine rejected ideas (X1 to X9) and four proposed phases (P1 to P4), plus a section on where the two lineages disagreed and how each point was settled. No skill, script, command or README changed.

### Round two

Round two ran two more ten-iteration lineages, `swe2max-devin` and `luna-max-fast-r2`, on the gaps round one left (F10, F18, F20, R1 to R4) plus the operator's added focus on the external user's journey, automation and guides. Both lineages' iterations, deltas and registries are on disk, `fanout-merge.cjs` merged all four lineages and the fan-out resource map was regenerated from 40 delta sources. The merged synthesis of both rounds is not written yet: the orchestrator's synthesis and verification passes write it, and round one's `research/research.md` is unchanged until then.

The orchestrator's own copy run confirmed two round-two claims. A hand-added surface fails seven parent-skill-check legs, the five round one named minus 5k-alias (which passes when the aliases are class keywords) plus 10b and 10d; the `update --surfaces` writes clear all but 5k-canary; and a surface inserted ahead of `sk-code-opencode` in `tieBreak` leads a tie with it after refresh, once both the activation manifest and the canary fixture are copied to their authored paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged, checked synthesis |
| `research/lineages/` (two lineages: config, state, iterations, deltas, prompts, receipts, strategy, registry, dashboard, ledgers) | Created | Each lineage's loop state and ten iterations |
| `research/deep-research-config.json`, `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Created | Fan-out config and the merge outputs |
| `spec.md` | Modified | Status, pre-init research context and the findings fence |
| `implementation-summary.md`, `goal.md`, `tasks.md`, `plan.md` | Modified | Outcome, log and task state |
| `research/lineages/swe2max-devin/`, `research/lineages/luna-max-fast-r2/` | Created | Round two loop state and ten iterations each |
| `research/findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Modified | Round two merge over four lineages |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator executed the `/deep:research` auto YAML step by step, as the 023 run did, with a two-lineage fan-out laid out as `research/lineages/<label>/`. Each iteration was one foreground dispatch per lineage, lineage A then lineage B: the YAML's `cli-devin` branch through `buildLineageCommand`, and its `if_cli_codex` branch, both through `runAuditedExecutorCommand`. All twenty iterations passed `verify-iteration.cjs` on the first dispatch. `fanout-merge.cjs` merged the two registries and the reducer wrote the resource map. The orchestrator then reread every cited anchor and ran its own full-tree throwaway copy: a control run, a delete run, a data-removal run and a `tieBreak` reorder with re-mint.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Side with lineage B against a rank field | A `tieBreak` reorder plus re-mint was observed to route a non-native surface first; a rank field adds a second order source and does not separate the operator's order from an external one |
| Reject an example-free starter payload | `PUBLIC-RELEASE.md:3`: the public repository is the operator's tree; no publish step exists to carry a different payload |
| Run delete experiments in a full-tree copy | Both lineages' copies excluded `specs/`, where the compiled-routing authored closure lives, so the re-mint could not be judged there |
| Fixed per-dispatch timeout of 570 s | The brief requires foreground dispatches, and one foreground call is capped at ten minutes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records per lineage | 10 and 10 `"type":"iteration"` records |
| `verify-iteration.cjs` | Exit 0 for all twenty iterations, no redispatch |
| Dispatch receipts | Lineage A: `devin --model deepseek-v4-1-flash-max`, all exit 0. Lineage B: `codex --model gpt-6-luna`, effort max, tier fast; iterations 4 and 5 ended by SIGTERM at 570 s after writing their artifacts |
| Out-of-scope writes | `git status` after every iteration showed no change outside this folder |
| Orchestrator copy runs | Control green; deletion 113 doctor failures and routes to deleted packets; drift guards exit 1 on ENOENT; reorder plus re-mint routes webflow first with guard, sync and doctor green |
| Round two iteration records | 10 and 10 `"type":"iteration"` records in `swe2max-devin` and `luna-max-fast-r2` |
| Round two out-of-scope writes | One breach, in lineage C iteration 6, restored by the orchestrator; every later dispatch left 0 out-of-scope entries (see `goal.md` log) |
| Goal criteria and strict validation | See `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two-round synthesis is pending.** `research/research.md` still holds round one only.
2. **Lineage D changed executor at iteration 5.** Iterations 1 to 4 ran on cli-codex at max, 5 to 10 on cli-pi at xhigh; each dispatch receipt records the executor that ran.
3. **R5 stays as is.** The operator ruled that sk-code-opencode keeps its generic language keywords.
4. **Two workflow steps were simplified.** The single-loop status-ledger rows were not written and the executor block was not patched into the state projection, matching the 023 precedent; no gate reads them. Lineage A's graph upsert for iteration 5 failed on a foreign key and was skipped; lineage B emitted no graph events.
<!-- /ANCHOR:limitations -->

---
