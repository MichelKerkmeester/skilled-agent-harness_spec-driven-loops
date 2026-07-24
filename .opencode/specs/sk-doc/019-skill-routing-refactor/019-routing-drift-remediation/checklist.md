---
title: "Verification Checklist: Post-019 routing drift remediation"
description: "Evidence-carrying verification for the six remediation items, gated on resolver ground truth and baseline deltas rather than self-report."
trigger_phrases:
  - "routing drift remediation checklist"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every checklist item with its confirming evidence"
    next_safe_action: "Repair the stale sync path"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Post-019 Routing Drift Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item was confirmed by running the named check, not by reading the diff. Survey findings were treated as
hypotheses and re-verified against the live tree before any edit. The primary gate is agreement between the
status probe and the resolver, because a self-consistent probe can still be wrong.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline captured before any edit
  - **Evidence**: manifest suite `16 pass / 1 fail`; all seven hubs reporting `compiled-serving`
- [x] CHK-002 [P0] Reported drift independently re-verified against the live tree
  - **Evidence**: `selectedPolicy.effectivePolicyHash` differed from the engine-computed hash at the same `generation`
- [x] CHK-003 [P0] Activation manifest backed up before the first write
  - **Evidence**: `manifest.json` copied to scratch before the write; restore is a `cp` of the backup
- [x] CHK-004 [P1] Co-active session's uncommitted work confirmed disjoint from every target file
  - **Evidence**: `git status --short` cross-checked against the declared file list; no overlap
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New probe gates mirror the resolver's identity check rather than approximating it
  - **Evidence**: probe compares routed `effectivePolicyHash` and `generation` to `selectedPolicy`, mirroring `resolve.cjs`
- [x] CHK-011 [P0] Both gates return a cause code and never throw into a routing hot path
  - **Evidence**: each gate sets `causeCode` and returns the record before `servingAuthority` is set
- [x] CHK-012 [P1] Refresher fallback preserves prior behaviour for hubs without a shadow child
  - **Evidence**: `shadowChildPolicyFor(...) ?? compileCanonicalParent(...)` retains the generic path
- [x] CHK-013 [P0] Generation resolved through the codebase's own normalizer
  - **Evidence**: `normalizeCurrentPolicy` handles the `activationGeneration` field name; a raw field read had written a generation the engine never routes
- [x] CHK-014 [P1] Comments state durable reasons; no ephemeral identifiers or spec paths embedded
  - **Evidence**: pre-commit `comment-hygiene` gate passed on commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Resolver ground truth checked per hub
  - **Evidence**: `resolveRoute` returns a compiled route for all seven activated hubs
- [x] CHK-021 [P0] Probe agrees with ground truth
  - **Evidence**: `compiled-route-status.cjs --all` reports `compiled-serving` for exactly those seven
- [x] CHK-022 [P0] Negative case observed rather than simulated
  - **Evidence**: parallel documentation edits staled a second hub; probe reported `stale-manifest`, re-mint restored it
- [x] CHK-023 [P0] Baseline delta compared rather than asserting no regressions
  - **Evidence**: manifest suite `16 pass / 1 fail` after the change, identical to baseline
- [x] CHK-024 [P1] Refresher confirmed working for a graduated hub
  - **Evidence**: returns `refreshed: true` / `fresh: true`
- [x] CHK-025 [P1] Leaf-manifest freshness swept across every skill that ships one
  - **Evidence**: `generate-leaf-manifest.cjs --check` reports OK for all eleven
- [x] CHK-026 [P1] Strict packaging passes for both touched packets
  - **Evidence**: `package_skill.py --check` returns PASS for each; condensed document measures 4,634 words against a 5,000 cap
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every confirmed survey finding either remediated or explicitly recorded as out of scope
  - **Evidence**: six remediated; the stale sync path recorded as an open question in `spec.md`
- [x] CHK-031 [P0] Root cause fixed, not the symptom
  - **Evidence**: fix lands in `compiled-route-status.cjs` and `compiled-route-manifest.cjs`, not in a hand-edited manifest
- [x] CHK-032 [P1] Defects discovered during remediation recorded rather than silently absorbed
  - **Evidence**: the refresher bug and the stale sync path are both documented in `implementation-summary.md`
- [x] CHK-033 [P1] No finding closed on agent self-report alone
  - **Evidence**: each item above cites a command or a `file`-level check
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No credentials, tokens, or secrets touched or logged
  - **Evidence**: diff limited to `.opencode/bin` routing code, `manifest.json` files, and documentation
- [x] CHK-041 [P0] Re-mint introduces no new policy
  - **Evidence**: selected hash equals the hash `compiledRoute` already returns
- [x] CHK-042 [P0] Fail-closed behaviour preserved
  - **Evidence**: `compile-error` and late re-read paths still return without writing
- [x] CHK-043 [P1] Delegated work ran under an explicit scope lock
  - **Evidence**: brief banned deletions and `git` write commands; verified against a pre-dispatch `git status` snapshot
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Probe cause-code contract updated for both new drift codes
  - **Evidence**: header contract in `compiled-route-status.cjs` lists `stale-manifest` and `identity-mismatch`
- [x] CHK-051 [P0] Seven hub feature catalogs corrected to default-on with the kill-switch
  - **Evidence**: no hub `feature-catalog.md` retains the off-by-default wording
- [x] CHK-052 [P1] Unresolved sync-path question recorded rather than silently dropped
  - **Evidence**: recorded in `spec.md` under Open Questions
- [x] CHK-053 [P1] Packet docs reconciled to the shipped state
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all state Complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All changed files within declared scope
  - **Evidence**: sixteen files, each listed in the `spec.md` Files to Change table
- [x] CHK-061 [P0] Staged by explicit path; co-active session's files never staged
  - **Evidence**: `git diff --cached --name-only` returned exactly the intended sixteen
- [x] CHK-062 [P1] Loop artifacts kept in sibling phase folders
  - **Evidence**: artifacts live under `017-post-019-alignment` and `018-post-019-research`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Resolver ground truth, seven hubs | Compiled |
| Probe agreement with resolver | Agrees on all seven |
| Manifest suite vs baseline | 16 / 1, unchanged |
| Leaf-manifest freshness, all skills | Pass |
| Strict packaging, touched packets | Pass |
| Word cap on condensed document | 4,634 of 5,000 |

One pre-existing failure remains in the manifest suite — the stale authored path in the sync tool — which
predates this packet and is recorded as an open question rather than counted as a regression.
<!-- /ANCHOR:summary -->
