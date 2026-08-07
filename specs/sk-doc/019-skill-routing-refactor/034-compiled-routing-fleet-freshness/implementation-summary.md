---
title: "Implementation Summary: Compiled-Routing Fleet Freshness Repair"
description: "Complete: three compile-blocking defects fixed at the authored source, the never-committed activation governance modules reconstructed, all seven rollout canaries re-baselined green with adjudicated deltas, the fleet re-minted through the shipped sync/finalize lane, guard fully green with every routing gate exact, and the live CI routing workflow green."
trigger_phrases:
  - "fleet freshness summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T19:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony completed: canaries 7/7, guard fresh x7, gates exact, CI green"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dedicated reconstruction phase: rebuilt the never-committed activation modules, committed them, re-baselined the seven canaries, then synced, re-minted, and finalized"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 100% — guard fully green (seven hubs fresh), routing gates exact, live CI green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fleet-wide compiled-routing red — all seven activated hubs unhealthy, identically in worktree, main, and live CI — is repaired end to end: root causes at the authored source, the reconstruction of a never-committed governance layer, an adjudicated canary re-baseline, and the fleet re-mint itself.

### Three compile-blocking defects, fixed at the authored source

All three are one class: authored shadow-child artifacts stale against fleet evolution.

| Hub | Real error (surfaced beneath the swallowed cause code) | Fix |
|-----|--------------------------------------------------------|-----|
| `cli-external-orchestration` | undefined read — `cli-pi/SKILL.md` absent from the harness fixture map (executor added after the harness was written) | one fixture entry added |
| `sk-prompt` | ENOENT on `prompt-improve/SKILL.md` — pre-rename packet path | harness paths re-keyed to the `sk-`prefixed packet dirs |
| `sk-doc` | `bundleRules[1] references missing mode create-quality-control` — supplemental bundle rules hardcode pre-rename mode ids | four rules re-keyed to live `sk-create-*` ids |

### The activation governance layer, reconstructed

The ceremony driver's two shared modules were never committed on any branch: absent from both trees, all stashes, and all history. Both were reconstructed from their call-site contracts and hardened against recurrence — the frozen-scorer contract now digests the scorer surface against a **committed** pin registry with an explicit `--refreeze` CLI, and the per-hub lock reclaims stale locks by pid-liveness. A third latent defect fell out of the same dig: the decision-evaluator replay driver resolved the repository root by a fixed number of parent hops, which broke inside git worktrees; it now walks up to the repo marker.

### Seven canaries re-baselined, every delta adjudicated

Months of individually-gated fleet evolution had turned all seven rollout-child canaries red. Mechanical deltas (digest re-pins, pre-rename tokens, the certificate policy-hash fixed point) were re-pinned; all ten behavioral route deltas were adjudicated in `015-router-unification-program/009-parent-hub-rollout/ceremony-deltas.md` before any gold moved — nine accepted as authored evolution (verified against the live hub routers), one dissolved as a stale pre-rename prompt. The re-baseline surfaced two committed-red defects nobody had ever run past: the sk-code validator demanded the certificate-gated selective controller its own router deliberately dropped for legacy parity (its gate now asserts the truthful invariants — certificate handles are inert, advisor evidence is non-authoritative), and the sk-code document replay hard-coded `surfaceBundle` where the compiled policy carries per-rule kinds. Final vector: **7/7 GREEN by exit code**.

### The fleet re-mint

The seven serving manifests were synced to the policy identities the current authored inputs compile to — the same authored+runtime manifest sync lane as the previous re-mint (`e215751429c`), after the shadow-era `activate-hub` CAS correctly refused to re-activate already-graduated hubs. `compiled-route-sync` then rebuilt the promoted mirror (62 closure files) from the repaired authored tree, `--verify` confirmed all seven hubs resolve with zero reads under the spec tree, and `--finalize` retired the rollback only after the full gate battery came back exact.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verdict recorded identically across three environments first; each swallowed `compile-error` surfaced by loading the hub through the authored engine directly; fixes held to the minimum restoring compilability; canary re-baselines separated legal delta classes from behavioral changes with a written adjudication before any re-pin; every gate checked by exit code after every step. The shipped engine, compiler, resolver, guard, and sync code were never modified; no manifest was hand-edited outside the precedent sync lane.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix at the authored source, not the promoted mirror | The mirror is a build product; patching it would be overwritten by the next sync and hide the real defect |
| Reconstruct the lost modules with committed pins instead of reverting the ceremony | The originals existed only on one machine; the rebuild makes the freeze contract reproducible from the repo alone |
| Adjudicate behavioral canary deltas in writing before re-pinning | The canaries protect against silent routing drift; re-pinning without adjudication would turn them into rubber stamps |
| Re-mint via the shipped sync lane, not the shadow-era activate-hub driver | The driver's CAS correctly refuses graduated hubs; the precedent re-mint (`e215751429c`) established the manifest-sync lane |
| Repoint stale validator gates at the authored design's true invariants | Restoring the dropped selective controller would reintroduce the under-routing regression the remediation fixed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canary vector | 7/7 GREEN by exit code, twice (self-consistent state re-confirmed after generation restore) |
| Guard | all seven hubs `fresh`; "serving matches inputs, and the runtime matches its source" |
| Sync | `--verify`: 7/7 resolve, 0 spec-tree reads; `--finalize` completed, rollback retired |
| Scorer-eval capture | every pin exact: 151/195, 13, 5, 53/72, 17/24, buckets 24/31 · 27/32 · 10/11 |
| Corpus gate (CI floors) | `overall_pass: true` |
| Vitest gates | golden prompts, registry + command-bridges drift guards, parity deep-skills/deep-council, scorer-eval ratchet — 6 files, 42 tests, all green |
| CI structural steps | parent-skill-check ×7, root-metadata, leaf-manifest, derived-freshness, skill-graph — all pass locally |
| Live CI | Routing Registry Drift Guard green on `38c76ce64e` (run 30564608871) |
| `validate.sh <folder> --strict` | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `compiled-routing-consumption` vitest suite does not run in this environment** — its import chain needs the `@opencode-ai/plugin` package, which is not installed here. It is not part of the CI gate; noted, not fixed.
2. **The certificate/selective-controller machinery remains unused by the sk-code hub by design** — its canary now guards inertness rather than abstention, matching the committed router's documented legacy-parity decision. Any future re-introduction of certificate gating must revisit that gate.
<!-- /ANCHOR:limitations -->
