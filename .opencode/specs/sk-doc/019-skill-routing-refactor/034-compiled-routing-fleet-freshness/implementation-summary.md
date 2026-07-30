---
title: "Implementation Summary: Compiled-Routing Fleet Freshness Repair"
description: "In progress: the three compile-blocking defects are root-caused and fixed at the authored source (all seven hubs load through the authored engine) and the four stale runtime manifests are re-minted; full green is gated on the operator-authorized fenced-CAS re-activation that lets the mirror rebuild propagate the fixes."
trigger_phrases:
  - "fleet freshness summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony blocked: activation layer never committed"
    next_safe_action: "Reconstruct activation modules in a dedicated phase"
    blockers:
      - "Mirror rebuild gated on re-binding the authored activation manifests (fence-epoch advance) — operator ceremony"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Dedicated reconstruction phase: rebuild the never-committed activation modules, commit them, re-baseline the seven canaries, then activate, sync, and finalize"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 60% — root causes fixed and stale manifests re-minted; mirror rebuild gated on the operator ceremony |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fleet-wide compiled-routing red — all seven activated hubs unhealthy, identically in worktree, main, and live CI — is root-caused, and everything short of the promotion ceremony is repaired.

### Three compile-blocking defects, fixed at the authored source

All three are one class: authored shadow-child artifacts stale against fleet evolution.

| Hub | Real error (surfaced beneath the swallowed cause code) | Fix |
|-----|--------------------------------------------------------|-----|
| `cli-external-orchestration` | undefined read — `cli-pi/SKILL.md` absent from the harness fixture map (executor added after the harness was written) | one fixture entry added |
| `sk-prompt` | ENOENT on `prompt-improve/SKILL.md` — pre-rename packet path | harness paths re-keyed to the `sk-`prefixed packet dirs |
| `sk-doc` | `bundleRules[1] references missing mode create-quality-control` — supplemental bundle rules hardcode pre-rename mode ids | four rules re-keyed to live `sk-create-*` ids |

After the fixes, **all seven hubs load through the authored engine (7/7 OK)** and the live routing gates are untouched (capture pins exact).

### Four stale manifests re-minted

`mcp-tooling`, `sk-code`, `sk-design`, `system-deep-loop` re-minted `fresh: true` through the shipped refresh verb — which surfaced the next layer: `authored-drift` (the promoted runtime mirror differs from the now-fixed authored source).

### The gated remainder

The manifest tooling compiles through the **promoted mirror**, which still carries the pre-fix harness code, so the three repaired hubs cannot re-mint until the mirror rebuild (`compiled-route-sync`) propagates the authored fixes — and that rebuild's closure trace requires the **authored activation manifests** to resolve, which they cannot: they pin superseded policy generations (e.g. sk-code generation 2). Re-binding them is the router-unification program's fenced-CAS ceremony (`activate-hub` driver). On operator authorization the ceremony was attempted and stopped by a decisive finding: the driver cannot even load — its shared governance modules (the frozen-scorer digest contract and the per-hub lock) were **never committed**, and they are absent from both working trees, every stash, and all git history. Independently, all seven rollout-child canaries fail against months of accumulated, individually-gated fleet drift and require adjudicated re-baselines (mechanical rename/hash deltas separated from behavioral route changes) before activation could be honest. The last mile is therefore a reconstruction phase, not a button press.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verdict recorded identically across three environments first; then each swallowed `compile-error` was surfaced by loading the hub through the authored engine directly; fixes were held to the minimum restoring compilability and verified by re-loading all seven hubs; the guard and capture were re-run after every step by exit code. No engine, compiler, resolver, or guard code was changed, and no manifest was hand-edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix at the authored source, not the promoted mirror | The mirror is a build product; patching it would be overwritten by the next sync and hide the real defect |
| Hold the re-activation ceremony for the operator | It advances fence epochs on the live serving authority — rollout governance, not mechanical repair |
| Keep the four runtime re-mints | They follow the guard's own prescription, are tracked and revertible, and move the fleet strictly closer to green |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All seven hubs via authored engine | 7/7 load OK after the three fixes |
| Four stale hubs re-minted | `fresh: true` each, via the shipped tooling |
| Live routing untouched | scorer-eval capture pins exact after every step |
| Guard state | still red by design — remaining causes are `authored-drift` (4) + mirror-stale compile path (3), both resolved by the gated ceremony + rebuild |
| `validate.sh <folder> --strict` | Errors: 0 at this in-progress close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The guard is not yet green.** By design: the last mile is the operator-authorized re-activation of the seven authored manifests, then the mirror rebuild, then re-minting the three repaired hubs, then live-CI confirmation — tracked as the blocked tasks in `tasks.md`.
2. **The four re-minted runtime manifests will be re-derived by the eventual rebuild.** Expected and harmless: the rebuild recomputes from the same (now-fixed) authored inputs.
<!-- /ANCHOR:limitations -->
