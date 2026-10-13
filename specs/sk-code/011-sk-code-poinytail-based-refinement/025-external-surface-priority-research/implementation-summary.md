---
title: "Implementation Summary"
description: "Four ten-iteration lineages over two rounds, a merged synthesis and a fresh verification pass found that a user's sk-code surface outranks sk-code-opencode with no new field: the scaffold must place it ahead of the existing surfaces in tieBreak. The real gaps are a verified removal path, honest messages and a single external-user guide; seven final recommendations in four phases."
trigger_phrases:
  - "external surface priority research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research"
    last_updated_at: "2026-10-13T12:00:00Z"
    last_updated_by: "verification-pass"
    recent_action: "Verified the synthesis and set final recommendations"
    next_safe_action: "Operator picks which of phases P8 to P11 in research/research.md section 14 to scaffold"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-025-external-surface-priority-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 to Q12, see research/research.md sections 3 to 14"
      - "R5: decided by the operator, sk-code-opencode keeps its generic language keywords"
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

Round two ran two more ten-iteration lineages, `swe2max-devin` and `luna-max-fast-r2`, on the gaps round one left (F10, F18, F20, R1 to R4) plus the operator's added focus on the external user's journey, automation and guides. Both lineages' iterations, deltas and registries are on disk, `fanout-merge.cjs` merged all four lineages and the fan-out resource map was regenerated from 40 delta sources. A fresh synthesizer then merged both rounds into `research/research.md`: F1 to F82, R1 to R10, X1 to X19 and P1 to P7.

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
| `research/research.md` | Modified | Merged two-round synthesis, then the verification pass: inline corrections, F83 to F96, X20 to X24, sections 13 and 14 |
### Verification pass

A fresh verifier checked the merged synthesis claim by claim against the 40 iteration files and the repository, with its own throwaway copies (section 13 of `research/research.md`). It checked 105 claims. Thirteen findings were corrected, and four of them change the plan. ROUTER.md section 11 is hand-maintained (`ROUTER.md:309`), so the README's hand-edit step is right and the removal must edit that map. The doctor stays red until it is. The generic debugging prompt defers in the pristine tree too, so R6 had nothing to fix. The pre-commit gate already re-mints and copies the activation manifest at commit, which no lineage had found.

The pass added F83 to F96 and X20 to X24, withdrew X19, merged F45 into F18 and rejected R6 and R10. It narrowed R1, R2 and R8. Section 14 now holds the final list: R1, R9, R3, R2, R7, R4 and R8, in four phases. P8 is scaffold placement and handoff, P9 the doctor, guard and sync messages, P10 the example-tolerant drift guards, and P11 the external-user guide and example markers, which depends on the other three.

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
| Verification pass | 105 claims checked; 13 corrected, 4 refined, 8 unconfirmed; experiments V0 to V7 in six throwaway copies, all deleted afterwards |
| Goal criteria and strict validation | See `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some claims stay unconfirmed.** Eight claims were not rerun by the verification pass, among them the advisor's confidence after deletion and the orchestrator's add-surface runs; section 13.2 lists them.
2. **Lineage D changed executor at iteration 5.** Iterations 1 to 4 ran on cli-codex at max, 5 to 10 on cli-pi at xhigh; each dispatch receipt records the executor that ran.
3. **R5 stays as is.** The operator ruled that sk-code-opencode keeps its generic language keywords.
4. **Two workflow steps were simplified.** The single-loop status-ledger rows were not written and the executor block was not patched into the state projection, matching the 023 precedent; no gate reads them. Lineage A's graph upsert for iteration 5 failed on a foreign key and was skipped; lineage B emitted no graph events.
<!-- /ANCHOR:limitations -->

---
