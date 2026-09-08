---
title: "Feature Specification: One cache extension covering every Pi model, with measured economics and paid-retry guards"
description: "Pi runs two cache extensions with a hand-maintained ownership split: one covers two DeepSeek-direct models, the other covers everything else and is deliberately blind to those two. The split costs a duplicated allowlist, a shared fixture and a cross-fork composition test, and leaves cost reporting and retry guards available on two models only. One extension should cover every model and carry those capabilities for all of them."
trigger_phrases:
  - "cache optimizer deep pi absorption"
  - "deepseek direct ownership reclaim"
  - "pi cache economics reporting"
  - "pi paid retry loop guard"
  - "hash verified edits pi"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase decomposition against a read of both extensions"
    next_safe_action: "Execute 004-port-hash-verified-edits"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".pi/extensions/shared/deepseek-ownership.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-cache-optimizer-absorbs-deep-pi"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Workspace: the operator chose the current branch, because the Pi runtime loads extensions from this checkout's .pi/ tree and the vendored dependencies exist only here"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: One cache extension covering every Pi model, with measured economics and paid-retry guards

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Phase score** | 40 / 50 (≥ 25) |
| **Level score** | 83 / 100 → Level 3 (≥ 3) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi loads two cache extensions whose responsibilities are divided by a hand-maintained model
allowlist. `deep-pi` acts on exactly two models — provider `deepseek`, ids `deepseek-v4-flash` and
`deepseek-v4-pro` — and is dormant everywhere else. `pi-cache-optimizer` acts on every other model
and carries an explicit predicate, `isDeepPiOwned`, whose only job is to make it return early on
those same two.

That division has three costs.

**The boundary is duplicated and has to be policed.** The same allowlist is written twice, once in
each extension. A shared fixture (`.pi/extensions/shared/deepseek-ownership.json`), a shared
composition helper (`.pi/extensions/shared/composition/one-owner.ts`) and a cross-extension test
that loads both at once exist for no reason other than to prove the two copies have not drifted
apart. None of that machinery serves a user.

**Capability is uneven.** Measured cache economics — cache-read versus uncached tokens, hit rate,
actual input cost, estimated savings against fully uncached input, prefix churn — are available on
two models. So are the paid-retry loop guard and the hash-verified edit path. Every other model,
including DeepSeek reached through `opencode-go`, `openrouter` or `cline-pass`, gets prompt
reordering and footer counters only.

**The split is fragile in one direction.** Removing either extension without addressing the
allowlist leaves models with no cache handling at all: the carve-out is unconditional, so
`pi-cache-optimizer` will keep declining the two DeepSeek-direct models whether or not anything
else is there to take them.

### Purpose

One extension handles cache behavior for every model Pi can reach, and the capabilities that
currently exist for two models — cost accounting, retry guarding, verified edits — are available
across that whole surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The `isDeepPiOwned` predicate, its six hook call sites, and its export in `pi-cache-optimizer`.
- The duplicated allowlist and the machinery that exists to police it: the shared ownership fixture, the one-owner composition helper, and the cross-extension composition tests in both extensions.
- Cache economics reporting: measurement, persistence and a command surface, for every model.
- A paid-retry loop guard and a hash-verified edit path, for every model.
- The `deep-pi` extension directory, its entry in `.pi/settings.json`, and the live references that point at it.

### Out of Scope

- **Historical records that name the extension**: prior spec packets, changelogs, benchmark reports and the append-only dispatch audit log. They record work that really happened; editing them would make a true record false.
- **`pi-cache-optimizer`'s existing non-DeepSeek behavior**: prompt reordering, `prompt_cache_key` fallback, proxy compat warnings, footer stats and `/cache-optimizer fix` are unchanged except where a phase explicitly extends them.
- **Upstream re-publication.** The fork's provenance record is updated in place; nothing is pushed to the public fork.
- **Other Pi extensions**, including `pi-fast-mode-w-subagent-support` and `pi-blackhole`.

### Files to Change

Enumerated per phase in each child's own `spec.md`. The surfaces this decomposition touches:

| Surface | Role |
|---------|------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | The single 9,378-line extension entry point that gains the capabilities and loses the carve-out |
| `.pi/extensions/pi-cache-optimizer/tests/**` | Ownership, hook-guard and behavior suites |
| `.pi/extensions/shared/**` | Fixture and composition helper that exist only to police the split |
| `.pi/extensions/deep-pi/**` | The extension being retired once its capabilities are covered |
| `.pi/settings.json` | The enabled-package list |
| `.pi/PLUGINS.md`, `.pi/SYNC.md` | Live inventory documents |
| `.opencode/scripts/**` | Fork-provenance checker and the boundary runner that names both extensions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-reclaim-deepseek-direct-ownership/` | Delete the carve-out predicate, its six early returns and the machinery that policed the duplicated allowlist, so one extension covers every model | Complete |
| 2 | `002-port-cache-economics/` | Measured economics for every model: cache-read vs uncached tokens, hit rate, real input cost, estimated savings, prefix churn, and a command that reports them | Complete |
| 3 | `003-port-retry-loop-guard/` | Detect and break paid retry loops so a failing turn stops re-billing the same request | Complete |
| 4 | `004-port-hash-verified-edits/` | Hash-verified line edits, so an edit that no longer matches what the model was shown fails instead of applying to moved content | Planned |
| 5 | `005-remove-deep-pi/` | Retire the extension directory, its enabled-package entry and every live reference, leaving historical records intact | Planned |
| 6 | `006-reconcile-extension-documentation/` | Bring the root README and every other README or inventory that documents Pi extensions in line with what actually ships, once 001-005 are done and tested | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | No model is unowned: the extension acts on DeepSeek-direct again, and no test asserts a two-extension split | Extension suite green; the two model ids reach the hooks |
| 002 | 003 | Economics are measured and reported for a non-DeepSeek model, not only computed | Command output shows hit rate, cost and savings from real usage records |
| 003 | 004 | A repeated failing request is broken rather than re-billed | Guard test drives a retry storm and asserts it stops |
| 004 | 005 | Verified edits reject a stale hash instead of applying to moved content | Edit test asserts refusal on drift |
| 005 | 006 | The extension is gone, nothing live references it, and the capabilities it carried are still available | Extension suite green; residue sweep clean outside historical records |
| 006 | — | Every README and inventory describing Pi extensions matches the shipped state | Documentation validators green; no README names a retired extension as live |

**Ordering is a safety property, not a preference.** Phase 005 removes the extension only after
phases 001–004 have made its capabilities available elsewhere. Reversing that order would leave the
two DeepSeek-direct models with no cache handling for the duration. Phase 006 runs last by the same
logic: documentation describes what shipped, so it is written once the behavior is done and tested,
not alongside it.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:execution-contract -->
## EXECUTION CONTRACT

Frozen by operator instruction. A phase that cannot honor a row here raises an amendment rather
than substituting a different route.

| Concern | Route |
|---------|-------|
| Implementation | `deepseek-v4-flash-max` through **cli-devin**. Confirmed on the devin roster and in the enforced allowlist; on devin the max thinking tier is baked into the uid, so no thinking flag is passed |
| Cache-optimizer testing | `deepseek-v4-flash-vision-exp` through **cli-pi**, routed to **llmgateway (DevPass)**. This is the DevPass route for DeepSeek V4 Flash and it is already policy-pinned to the `max` effort tier, which is what "flash max" means on this surface |
| Workspace | Current branch, `skilled/v4.0.0.0` |

**Two id notes worth carrying, because guessing either one produces an off-roster dispatch.**
There is no `deepseek-v4-flash-max` on the pi surface: devin bakes the tier into the id, while pi
reaches the same tier through the effort pin on the bare literal. And LLM Gateway takes the bare id,
so the selector is two-segment (`llmgateway/<id>`) — the slashed cline-pass form returns 400.

**One live risk.** The roster records the DevPass monthly usage window returning 429 on 2026-09-07.
If testing hits that, the phase reports the blocker rather than silently switching provider.
| 005-remove-deep-pi | 006-reconcile-extension-documentation | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:execution-contract -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the shared composition helper has any consumer beyond the two-extension split. If it does, phase 001 keeps it; the phase resolves this by reading its importers rather than assuming.
- Whether economics reporting should surface per-provider or per-model. Phase 002 decides from what the usage records actually carry.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
