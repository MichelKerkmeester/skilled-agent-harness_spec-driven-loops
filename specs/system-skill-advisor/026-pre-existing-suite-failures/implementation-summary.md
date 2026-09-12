---
title: "Implementation Summary"
description: "Three of five failures had causes and are fixed. Two were accuracy pins measuring eight days of skill restructuring, and are a decision rather than a defect."
trigger_phrases:
  - "pre-existing failures summary"
  - "three fixed two are a decision"
  - "accuracy neutral vocabulary fix"
  - "scorer baseline 152 versus 154"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/026-pre-existing-suite-failures"
    last_updated_at: "2026-09-12T10:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Three suites fixed at cause; two accuracy pins diagnosed and left for an operator decision"
    next_safe_action: "Operator decides between re-capturing the scorer baseline and recovering the two prompts"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/runtime/lib/scorer/projection.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01V4wzp8qRJRvyXdqxAYuJTi"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Re-capture the scorer baseline at 152, or spend the work recovering the two prompts"
    answered_questions:
      - "Did three failures share a cause? Yes, a rename applied to two of three descriptions"
      - "Did the fix move scorer accuracy? No, 152 measured both with and without it"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-pre-existing-suite-failures |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five failures had been carried as "pre-existing" across an eight-phase packet without anyone asking what they were. They turned out to be two unrelated problems wearing one label.

### The three with causes

`/memory:save` was retired in favour of `/speckit:save`, and one file describes those command bridges twice: once as the bridge list the scorer consults, once as an inventory projection of the same entries. The rename reached the first and not the second. That one gap failed two suites at once. A drift guard exists precisely to compare those two descriptions, and it was doing its job. A resolution guard separately found a bridge citing a slash id with no command file behind it, which was the same stale block seen from the other side. Aligning the second block fixed both.

The third was a pinned census expecting 21 declared commands where the tree holds 20. Its own comment says to recount and update rather than relax, so I recounted: three in `sk-design`, twelve in `sk-doc`, five in `system-deep-loop`. The missing one is `/deep:skill-benchmark`, removed when the skill-benchmark lane was retired. The pin now reads 20 and records why.

### The two that are not defects

Both assert the scorer still routes a fixed 195-prompt corpus exactly as well as a baseline captured on 2026-09-04. It gets 152 where the baseline says 154. The parity suite reports the same fact from the other direction, 100 where it expects 102.

Nothing is broken. Around ninety routing inputs changed between that capture and now, including a full `sk-design` restructure with a new hub router, and new hub routers for `sk-doc` and `mcp-tooling`. The corpus itself is untouched, its hash still matching. The pins are measuring eight days of legitimate work.

Worth separating: the shipped routing-accuracy gate, the one CI actually runs, still passes. It holds floors rather than exact counts, and every floor clears.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/projection.ts` | Modified | Inventory projection block aligned with the bridge block it is compared against |
| `runtime/tests/command-metadata-e2e.vitest.ts` | Modified | Census pin recounted 21 to 20, with the retirement recorded |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure was read at its assertion rather than its name, which is what separated the two kinds. The risky part was invisible: editing routing vocabulary can move scorer accuracy with no test naming the vocabulary. So the accuracy pin was measured twice, once with the change and once with the file restored from HEAD. Both gave 152. That makes accuracy-neutrality an observation rather than a hope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the second block rather than delete the retired id | The first block deliberately keeps `memory:save` as the scorer key; the retired id is vocabulary, the dead slash id was the defect |
| Recount the census instead of relaxing it | The test asks for exactly that, and a recount found a real retirement rather than a drift worth hiding |
| Leave the Python scorer's vocabulary alone | It is the fallback the parity suites measure against, so editing it moves the very numbers under discussion |
| Stop short of re-capturing the baseline | It lowers a release floor. That belongs to the operator, not to a task whose brief was to fix tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three command suites | PASS — 12 tests |
| Accuracy with the change | 152 correct of 195 |
| Accuracy with the file restored from HEAD | 152 correct of 195, so the fix is neutral |
| Shipped routing-accuracy floor gate | PASS — joint 111 true-true against a floor of 101, 3 false-true against a ceiling of 3, 1 false-false against 1 |
| Corpus and holdout hashes | Unchanged, so the data did not move |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two suites still fail, by design of this packet.** They are an operator decision, recorded with their numbers rather than silently re-pinned.
2. **The two regressed prompts were never identified individually.** The baseline stores only aggregates, so naming them needs a scored run at the baseline commit compared against one at the current tip.
3. **A pin this tight may be the wrong instrument.** Ninety routing inputs changed between captures without anyone intending a routing change, and the pin cannot tell that from a regression.
<!-- /ANCHOR:limitations -->

---
