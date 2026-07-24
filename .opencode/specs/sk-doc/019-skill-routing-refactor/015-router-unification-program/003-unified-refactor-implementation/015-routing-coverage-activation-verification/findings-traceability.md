# Findings Traceability — every research finding → owning child → status

> One row per consolidated finding from `001-research/synthesis-v1.md` (48 CF-* findings across 7 workstreams + the ranked unnamed gaps). Findings are implemented as **requirements inside their workstream child**, not as separate folders — per the spec-kit Gate-3 phase-qualification guard (a phase child needs complexity ≥25/50 AND doc-level ≥3) and the synthesis §6 child breakdown. This matrix is the single-place audit that nothing was dropped.
>
> **Status legend:** ✅ implemented + committed · 🔁 built into the 011 P4 controller, applied at the (operator-gated) per-hub flip · ⏸️ deferred P1, documented follow-up · 🏗️ foundation in progress (012 minter → 013 → 014).

## Activation foundation — CF-ACT (owning children: 002 / 003 / 010; cutover: 011)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-ACT-1 | Compiled decision dropped by the bridge/hook before any agent sees it | 003 | ✅ |
| CF-ACT-2 | Flag stripped by both child-env allowlists; can't reach the daemon | 003 | ✅ |
| CF-ACT-3 | `HUB_CHILD` is an engine-dispatch table (not a removable allowlist); split eligibility vs engine + cross-check | 002 | ✅ |
| CF-ACT-4 | Runtime reads resolver/activation/engines from the mutable spec tree; promote the closure (ADR-003) | 002 | ✅ |
| CF-ACT-5 | No per-hub serving-status readout; drifted==broken. Ship `compiled-route-status --all` | 002 | ✅ |
| CF-ACT-6 | Bi-state flag → tri-state (on/off/auto) + per-hub cohort; unset≠fleet-wide-on | 002 (tri-state) / 011 (cohort flip) | ✅ / 🔁 |
| CF-ACT-7 | Cyclic phase graph; P4 gate could pass empty → move status to P0 + a P3 coverage-closure join gate | 002 (foundation) / 011 (join gate) | ✅ |
| CF-ACT-8 | Rollback/audit holes: no `--rollback`, stale serving-prior, fence ambiguity, overwritten audit | 010 | ✅ |
| CF-ACT-9 | Non-hub single-skill routers ineligible by design — explicit policy + negative fixtures | 010 | ✅ |
| CF-ACT-10 | Drift CI + caches watch the wrong inputs; scorer pins duplicated | 003/010 (cache+CI) | ✅ |
| CF-ACT-11 | Session surfaces don't probe router posture; `routingRecommendation` name collision; unnamed canary | 010 (canary ✅; session-snapshot rename = REQ-007) | ✅ / ⏸️ |

## Benchmark Lane C — CF-BM (owning child: 004)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-BM-1 | Lane C never exercises the compiled path — add a non-frozen parity harness | 004 | ✅ |
| CF-BM-2 | Vacuous-parity trap: flag-on + legacy-serving reads as a false pass — hard-fail it | 004 | ✅ |
| CF-BM-3 | Shape impedance: compiled IDs vs legacy resources — translate via `qualifiedIdToLeaf` | 004 | ✅ |
| CF-BM-4 | Verdict OR-collapse hides 3 states — add a sub-verdict in the NON-frozen orchestrator | 004 | ✅ |
| CF-BM-5 | Route-gold keyed on hub-router existence, not compiled-eligibility — status enum | 004 | ✅ |
| CF-BM-6 | Report is renderer-owned — render the compiled block from JSON | 004 | ✅ |
| CF-BM-7 | LUNA evidence overfit (no gold-bearing holdouts) | 005 | ✅ |
| CF-BM-8 | Parity CLI flag can't reach the orchestrator — thread it or record `auto` | 004 | ✅ |

## Playbooks + LUNA — CF-PB (owning child: 005)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-PB-1 | Scenario schema admits gold-less scenarios — strict authoring/CI validator | 005 | ✅ |
| CF-PB-2 | 7 primary scenarios (one per hub), test serving-authority not duplicate routing | 005 | ✅ |
| CF-PB-3 | Evidence contract can pass without proving compiled ran — add the fields | 005 | ✅ |
| CF-PB-4 | Root playbooks stale/misaligned | 005 | ✅ |
| CF-PB-5 | Live Lane C never runs the playbook contract — non-frozen cutover executor + validator | 005 | ✅ |

## Feature catalogs — CF-CAT (owning child: 006; wording flip: 011)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-CAT-1 | 6/7 hubs lack a root catalog — author them + one routing leaf each | 006 | ✅ |
| CF-CAT-2 | Phase-gated wording: opt-in now, default-on atomically at P4 | 006 (opt-in ✅) / 011 (flip wording) | ✅ / 🔁 |
| CF-CAT-3 | Extend feature-flag-governance + advisor_recommend entry (right homes) | 006 | ✅ |
| CF-CAT-4 | Catalogs can't cite stable paths until resolver promoted — sequence after 002 | 006 | ✅ |
| CF-CAT-5 | Scope: child-mode catalogs excluded; sk-design manager-shell leaf | 006 | ✅ |

## Durable archiving — CF-ARC (owning child: 007)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-ARC-1 | No durable hub-local report path; runner overwrites labels — convention + fail-closed | 007 | ✅ |
| CF-ARC-2 | No joined `serving-snapshot.json` — define + ship + renderer | 007 | ✅ |
| CF-ARC-3 | Reports serialize absolute worktree paths — repo-relative provenance | 007 | ✅ |
| CF-ARC-4 | Embed parity in the canonical report; don't reuse `baseline`; archive vs live manifests | 007 | ✅ |
| CF-ARC-5 | Live reports omit exact model/variant; audit overwritten — execution-context block + append-only | 007 | ✅ |

## sk-code alignment — CF-SC (owning child: 008)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-SC-1 | The named RESOURCE_MAP guard is markdown-blind — name the real one + `--check-router` | 008 | ✅ |
| CF-SC-2 | No typed bridge compiled-IDs ↔ RESOURCE_MAP — bidirectional bijection tests | 008 | ✅ |
| CF-SC-3 | Front door supplies only prompt text — additive `surfaceBundle` context (REQ-006) | 008 | ⏸️ deferred P1 |
| CF-SC-4 | Three disjoint drift guards, no orchestrator — `run-all-drift-guards.sh` | 008 | ✅ |
| CF-SC-5 | One child owns the single alignment authority interface | 008 | ✅ |

## sk-doc templates — CF-TPL (owning child: 009; lockstep: 011)

| Finding | Plain summary | Child | Status |
|---|---|---|---|
| CF-TPL-1 | P4 lockstep omits both create-skill parent templates — add to the controller | 009 (added to set ✅) / 011 (rewrite at flip) | ✅ / 🔁 |
| CF-TPL-2 | Catalog trigger_phrases don't drive routing — fix the false claim | 009 | ✅ |
| CF-TPL-3 | Topology validator quote-intolerant | 009 | ✅ |
| CF-TPL-4 | Validation can't prove catalog completeness; taxonomy 2→12 | 009 | ✅ |
| CF-TPL-5 | Separate template-repair vs population vs renderer boundaries | 004/006/007/009 (sequencing) | ✅ |

## Unnamed gaps (ranked, beyond the 4 named) — synthesis §3

| Gap | Plain summary | Where | Status |
|---|---|---|---|
| End-to-end effectiveness void | The bridge strips the decision (= CF-ACT-1) | 003 | ✅ |
| Dual flag-strip | = CF-ACT-2 | 003 | ✅ |
| Engine-dispatch coupling + spec-tree closure | = CF-ACT-3/4 | 002 | ✅ |
| Observability void + silent catches | = CF-ACT-5 | 002 | ✅ |
| Bi-state flag | = CF-ACT-6 | 002/011 | ✅ / 🔁 |
| Cyclic graph + empty-passable P4 | = CF-ACT-7 | 002/011 | ✅ |
| Rollback/audit integrity | = CF-ACT-8 | 010 | ✅ |
| Non-hub policy undefined | = CF-ACT-9 | 010 | ✅ |
| LUNA overfit | = CF-BM-7 | 005 | ✅ |
| Absolute worktree paths | = CF-ARC-3 | 007 | ✅ |
| `routingRecommendation` collision | = CF-ACT-11 | 010 | ⏸️ deferred P1 (REQ-007) |
| Catalog census off-by-case (`FEATURE-CATALOG.md` uppercase) | 006 authored fleet-wide incl. the case-variant | 006 | ✅ |
| 009-non-hub-rollout Phase Map lists 1 of 4 children | Cross-referenced by 010's non-hub policy; sibling-doc fix out of 015 scope | 010 (note) | ⏸️ noted |
| Research JSONL omits canonical fields | Reducer-side canonicalization for future automation | — | ⏸️ noted (self/tooling) |

## The activation gap this session discovered (not in the original research)

| Item | Summary | Child | Status |
|---|---|---|---|
| Canonical manifest minter | 013's `ready` mode needs a minter that never existed — the true reason the P4 flip is blocked | **012-p3-canonical-minter-foundation** (spec'd + design-reviewed; implementation in progress) | 🏗️ |
| create-skill legacy\|ready wiring | Consumes the minter | 013 (pending 012) | 🏗️ |
| Lane C benchmark alignment | Largely subsumed by 004's shipped harness; verify + reconcile | 014 (pending) | 🏗️ |
| Staged per-hub default-on flip | The P4 outcome; unblocks once 012→013→014 land + the join gate greens | 011 controller (built, dry-run) | 🔁 operator-gated |

**Summary: 44 CF findings + the ranked unnamed gaps are all accounted for** — 38 implemented + committed (✅), 3 applied at the per-hub flip (🔁), 3 deferred as documented P1 follow-ups (⏸️), and the newly-discovered minter chain in progress (🏗️). Nothing was dropped.
