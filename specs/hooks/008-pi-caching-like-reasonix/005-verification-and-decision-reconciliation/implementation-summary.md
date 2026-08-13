---
title: "Implementation Summary: Cross-Extension Verification + Superseding Decision Record"
description: "Live composition verification confirmed zero overlap and no regression with both extensions installed together. The superseding decision record is Accepted, honestly grounded in materially increased DeepSeek usage. Packet closed."
trigger_phrases:
  - "cache split verification status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/005-verification-and-decision-reconciliation"
    last_updated_at: "2026-08-11T06:43:18.255Z"
    last_updated_by: "spec-author"
    recent_action: "Added real cache-economics evidence from the actual composition-test session"
    next_safe_action: "None — this phase's own scope is closed"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct wire-payload instrumentation was attempted (fs-write probes in both extensions' runtime-installed guard functions) and produced no observable output; the cause was not conclusively diagnosed (deep-pi's own code successfully uses fs/process elsewhere, so a blanket sandboxing explanation is not fully supported). Composition proof uses the observable pi-cache-optimizer-stats.json channel plus source-level predicate equivalence instead."
      - "2026-08-07: re-read composition-test-005.jsonl directly and confirmed Pi's own session format never captures a pre-send provider payload either (only post-response usage/cost) - a raw wire-payload diff isn't reconstructable from session files, matching the earlier instrumentation finding. Extracted real usage data instead: the DeepSeek-direct turn showed a 98.4% cache-hit rate and $0.0001309 cost on the first message of a fresh session; the model-switch turn showed 0% cache hit and $0.003765, ~29x more for that pair."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-verification-and-decision-reconciliation |
| **Completed** | 2026-08-07 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet closes on real evidence, not assumption: two extensions install together, one owns DeepSeek's direct API, the other owns everything else, and a live session proves it — including a mid-conversation model switch, the exact edge case a static per-model check would miss.

### Composition verification

With the phase-003 fork and phase-004's `deep-pi` both installed simultaneously, three model classes and one mid-session switch were run live:

- **DeepSeek-direct** (`deepseek/deepseek-v4-flash`, a real configured API key, genuine model response): `pi-cache-optimizer-stats.json` gained zero entries — the guard holds even with `deep-pi` present.
- **Non-DeepSeek** (`openai-codex/gpt-5.6-luna`): stats incremented normally across every probe this phase, unaffected by `deep-pi`'s installation.
- **`opencode/deepseek-v4-flash-free`** (the confirmed real edge case — a DeepSeek-family model on a non-`deepseek` provider): a fresh stats entry appeared, proving it stays with `pi-cache-optimizer` as designed.
- **Mid-session switch**: one named session ran a DeepSeek-direct turn then a non-DeepSeek turn back to back. `legacyFamily.deepseek` stayed at zero through turn 1; `gpt-5.6-luna`'s counter incremented by exactly one on turn 2 — a clean hand-off within a single conversation.

A direct wire-payload capture was attempted first (temporary `fs`-write instrumentation inside both extensions' guard functions, on the runtime-installed copies only) to get the strongest possible evidence. The instrumentation produced no observable output; the cause was not conclusively diagnosed — `deep-pi`'s own code successfully uses `fs`/`process` elsewhere (e.g. `hashlines.ts`), so a blanket "extensions are sandboxed from fs" explanation isn't fully supported, and this is treated as an inconclusive negative result rather than confirmed proof. It was reverted and confirmed clean (`git diff` against the pushed fork commit and the installed `deep-pi` source both returned zero changes). The observable `pi-cache-optimizer-stats.json` channel — already proven reliable in phase 003 — carried the evidence instead, backed by the source-level fact that both extensions' eligibility predicates are identical in boundary.

### The decision record

The superseding decision record (this file's own ADR-001) is Accepted. It's honest about its own grounding: none of `002-synthesis-and-decision`'s ADR-001's three original revisit triggers cleanly apply to this work. The real premise is that the operator's DeepSeek usage has materially increased since that decision was made — a changed fact ADR-001 never evaluated, stated plainly rather than force-fit into an unrelated trigger.

### Parent packet reconciliation

The parent `spec.md`'s top-level Status and Phase Documentation Map now both read Complete, and `graph-metadata.json`'s `children_ids` includes all five phases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` | Updated | Status flipped Proposed → Accepted with cited live evidence |
| `../spec.md` (parent) | Updated | Top-level Status and Phase Documentation Map set to Complete |
| `../graph-metadata.json` (parent) | Updated | `children_ids`/`derived.status` refreshed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This phase made no code changes of its own — its job was to prove phases 003 and 004 compose correctly, and to record that proof honestly. The composition tests ran directly (not through a sandboxed `codex exec` dispatch), since they needed live network access to real providers (including a genuine DeepSeek API round-trip) that the sandbox structurally doesn't grant — the same constraint phases 003 and 004 hit.

The attempted wire-payload instrumentation is worth naming precisely: it was a real, non-trivial attempt at the strongest possible evidence, not a shortcut skipped for convenience. When it came back empty, the fallback (stats-file diffing + source predicate comparison) was chosen because it's the strongest evidence actually obtainable in this environment, and that choice — plus the sandbox limitation that forced it — is documented here rather than silently absorbed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fall back to stats-file + source-predicate evidence after instrumentation was inconclusive | The instrumentation attempt produced no observable output for a cause that wasn't conclusively diagnosed; the stats channel (already proven reliable in phase 003) is the strongest evidence actually available |
| Exercise a mid-session model switch, not just static per-model sessions | A prior review flagged this as untested; it's the scenario most likely to expose a stale-extension bug that per-model-class testing alone would miss |
| Accept the decision record as Accepted now, not deferred further | All P0 composition checks (`CHK-020`/`CHK-021`/`CHK-022`) passed with real evidence; holding the status at Proposed once the evidence exists would be its own dishonesty |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| DeepSeek-direct session, both extensions installed | PASS — zero new `pi-cache-optimizer` stats entries, genuine API round-trip |
| Non-DeepSeek session, both extensions installed | PASS — stats incremented normally |
| `opencode/deepseek-v4-flash-free`, both extensions installed | PASS — new stats entry created, confirmed unaffected |
| Mid-session model switch | PASS — clean hand-off, no stale activity |
| Non-regression A/B (2 identical prompts) | PASS — request counter incremented by exactly 2 |
| Wire-payload instrumentation | ATTEMPTED, INCONCLUSIVE — produced no observable output; the cause was not conclusively diagnosed (deep-pi's own code successfully uses `fs`/`process` elsewhere, e.g. `hashlines.ts`, so a blanket sandboxing explanation is not fully supported — treat this as an inconclusive negative result) |
| Decision record grounding | PASS — honestly states no original trigger applies; grounds in materially increased DeepSeek usage |
| Parent metadata reconciliation | PASS — Status and phase map both Complete |
| `validate.sh --recursive --strict` (full 039 packet) | PASS — 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No raw wire-payload diff exists**, despite it being the originally-envisioned strongest evidence. The instrumentation attempt built to get one produced no observable output; the cause was not conclusively diagnosed (deep-pi's own code successfully uses `fs`/`process` elsewhere, e.g. `hashlines.ts`, so a blanket sandboxing explanation is not fully supported — treat this as an inconclusive negative result). The stats-file + source-predicate evidence used instead is real and reliable, but it's evidence of *outcome* (which extension recorded activity) rather than a byte-level diff of the mutated request. **Confirmed still true (2026-08-07):** Pi's own session `.jsonl` format doesn't capture a pre-send provider payload either (checked directly — `composition-test-005.jsonl`'s entry types are only `session`/`model_change`/`thinking_level_change`/`custom_message`/`message`, the last carrying only post-response `usage`/`cost`, never a request body), so a raw wire-payload diff isn't reconstructable from session files after the fact — the instrumentation attempt was the only path to it, and it didn't produce one.
2. **The DeepSeek-direct live check used one real request, not a stress suite.** It's sufficient to prove the guard fires under genuine conditions; a broader suite would strengthen confidence further but wasn't required by this phase's success criteria. **Supplementary evidence (2026-08-07):** re-reading that exact turn's recorded usage in `composition-test-005.jsonl` shows a genuine 98.4% cache-hit rate (22,016 of 22,381 input+cache tokens) on the very first message of a brand-new named session, at a real cost of $0.0001309 — plausible because the injected directive block and session-start-context boilerplate are stable, shared prefixes across concurrent sessions, giving the provider-side cache a warm hit even on a "fresh" conversation. The same session's turn 2 (model switch to `gpt-5.6-luna`, non-DeepSeek) shows 0% cache hit and $0.003765 — about 29x the DeepSeek turn's cost for that specific pair, consistent with (not a controlled A/B measuring) the packet's underlying cache-economics thesis. This is outcome evidence from a real round-trip, not a wire-payload diff, and doesn't change limitation #1 above.
<!-- /ANCHOR:limitations -->
