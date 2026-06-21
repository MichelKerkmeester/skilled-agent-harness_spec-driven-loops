---
title: "Implementation Summary: New-Feature Research and Build"
description: "The TRACK B arc is closed. The deleted-10 teachings drove research that found 4 candidates, eval-v2 was built and kept as the measurability gate, 3 features were built default-off and fresh-Opus held, and the append-not-displace truncation finding deferred the only path to a tail-additive flip."
trigger_phrases:
  - "028 new feature research build summary"
  - "028 track b new feature outcome"
  - "028 eval-v2 kept three features held"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/023-new-feature-research-build"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the TRACK B arc, eval-v2 kept and three features held"
    next_safe_action: "Treat this phase as the authoritative TRACK B new-feature outcome for 028"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-summary-028-023-new-feature-research-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "eval-v2 was built and kept as measurability infrastructure independent of any feature flip."
      - "The three built features are held default-off, none flips on prod-mode evidence."
      - "The append-not-displace pattern is the key architectural finding that defers a tail-additive flip."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory/023-new-feature-research-build |
| **Completed** | 2026-06-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The TRACK B arc is closed. The flag-resolution reckoning deleted ten switches, and each deletion taught something exact about why a lever fails to move live recall. Those teachings were the research input, not the end of the road. The research read them and found four candidate features that might earn a flip where the deleted ten did not. The arc then ran research to eval-v2 to build to benchmark to a fresh-Opus hold. eval-v2 was built and kept. Three features were built default-off and held. None flips. A reader looking at TRACK B today sees a kept measurability gate and three honestly-held switches, each with a measured reason and a next step.

### eval-v2, the measurability gate, built and kept

The old eval harness had hidden the deleted features behind eval-saturation, so a new candidate measured on it would repeat the same mistake. eval-v2 is the fix and it earns its keep on its own merit. It adds three non-self-recall classes so a feature cannot win by recalling the query back to itself: `thematic_multi_target`, `causal_chain` and `hard_negative`. It adds a completeRecall@K metric at K of 3, 5 and 8 that scores whether the full target set is recovered rather than a single hit. It runs in a dual mode that measures eval-mode and prod-mode fidelity side by side. The headline is the fidelity gap it exposed: eval-mode completeRecall@8 is 0.212 against prod-mode 0.036, a +0.176 gap. That gap is the eval-saturation that had hidden the deleted features, and surfacing it is the win that keeps eval-v2 in the tree even though no feature it measured flipped.

### The three features, built default-off and held

Each was built and benchmarked in prod mode, and the fresh-Opus gate held each one on its prod-mode number.

- **`deterministic_multihop`** held on a prod completeRecall delta of 0.000. The appended hop-2 docs land at the tail and prod truncation cuts them, so the multi-hop recall a reader would want never reaches the prod result window.
- **`lane_champion_backfill`** held on a 0.000 delta because it is structurally redundant with RRF, which already absorbs every lane champion. Reserving a backfill slot duplicates work the fuser already does.
- **`true_citation_emitter`** held as a clean default-off shadow that produces the corpus's missing negatives, but its positive label depends on the assistant literally echoing the memory id, so positives are under-counted and the measured signal cannot credit it yet.

### The key architectural finding

The append-not-displace pattern is the only non-regressing architecture the campaign found, and it carries a property that decides the multihop result. It appends to the tail, and prod confidence-truncation keeps about three results, so the tail-additive content is cut before it reaches the reader. Tail-additive recall is 0 at prod K by construction, not by defect. Capturing it requires injecting ahead of the truncation point, which is a displacement decision that trades a baseline row for the new content, and that decision is deferred. This is why a feature can be correct, additive and safe and still read as zero at prod K.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../graph-metadata.json` | Edited | Add 008 to the parent children_ids |
| `../spec.md` | Edited | Add the 008 row to the phase documentation map |
| `../feature-flags.md` | Edited | Add the 3 built-but-held flags and the eval-v2 kept-infrastructure note |
| `../changelog/001-speckit-memory/changelog-001-root.md` | Edited | Add the TRACK B milestone row |
| `../changelog/001-speckit-memory/changelog-001-023-new-feature-research-build.md` | Created | The TRACK B leaf changelog |
| `../changelog/README.md` | Edited | Reflect the new leaf in the memory-track count and narrative |
| `../timeline.md` | Edited | Add the TRACK B research-and-build arc |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | This phase folder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The arc was built to refuse a plausible-but-wrong keep, the same discipline the flag-resolution reckoning used. The measurability gate came first on purpose. Building eval-v2 before the features meant a candidate was judged on a metric that resists eval-saturation, so a feature could not win by recalling the query back to itself. Each feature was then built default-off, benchmarked in prod mode and taken through a fresh-Opus hold decision that read the prod-mode number rather than the inflated eval-mode number. All three held. The prod-mode evidence was unambiguous for two of them, deterministic-multihop at 0.000 and lane-champion at 0.000, and the third held on a label limitation rather than a measured failure, since the true-citation emitter produces the right shadow output but cannot be scored positive until the label stops depending on the assistant echoing the memory id. eval-v2 and the three feature builds shipped during the build before this phase recorded the outcome, so the documentation describes a reached state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build eval-v2 before any feature | The old harness hid the deleted features behind eval-saturation, so a new candidate measured on it would repeat the mistake |
| Keep eval-v2 even though no feature flipped | The +0.176 eval-vs-prod fidelity gap is the measurability win, independent of any feature decision |
| Hold deterministic-multihop on the prod number | The appended hop-2 docs land at the tail and prod truncation cuts them, so prod completeRecall delta is 0.000 |
| Retire the lane-champion investment | It is structurally redundant with RRF, which already absorbs every lane champion |
| Hold the citation-emitter on a label limit, not a failure | It produces the missing negatives cleanly, but its positive label under-counts until content-attribution replaces id-echo |
| Defer the truncation-exemption probe | Capturing tail-additive recall requires injecting ahead of truncation, a displacement decision out of this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| eval-v2 disposition | DONE: built and kept, fidelity gap eval 0.212 versus prod 0.036 at completeRecall@8 recorded |
| Per-feature disposition | DONE: 3 held default-off, each with a prod-mode number and a next step |
| Truncation finding | DONE: append-not-displace zero-at-prod-K-by-construction documented prominently |
| Cross-doc consistency | DONE: child map, feature-flags, changelog and timeline carry the same outcome |
| HVR scan | PASS: 0 em-dashes, 0 prose semicolons and 0 Oxford commas in the reconciled docs |
| Strict validation | exit 0 for this child folder and the 028 root |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Multihop needs a displacement decision to flip.** Its next step is a scoped truncation-exemption probe on the causal_chain class with displacement accounting. The probe either earns the flip on that class or proves tail-recall structurally doomed at prod K.
2. **Lane-champion retires its investment.** It is redundant with RRF and has no path to a flip, so the next step is to retire the candidate rather than tune it.
3. **The citation-emitter label is under-counted.** Its next step is to fix the positive label with content-attribution and run a one-shot offline mining pass before any collection decision.
4. **No commit made.** The edits are staged in the working tree only. Committing is the dispatcher's decision.
<!-- /ANCHOR:limitations -->
