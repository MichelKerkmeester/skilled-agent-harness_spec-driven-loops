---
title: "Implementation Summary: Parent-hub remediation program (plan)"
description: "Authored the remediation plan for all 18 review findings — nine ordered work units, six operator decision forks with recommended defaults, and a 4/4-canon-clean done-bar. Execution is gated on the fork resolutions."
trigger_phrases:
  - "parent hub remediation summary"
  - "014 sk-doc phase 023 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/023-parent-hub-remediation"
    last_updated_at: "2026-07-07T19:45:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed WU1-4,6-9 (8/9); all pushed; 4/4 canon-clean; WU5 gated"
    next_safe_action: "Run WU5 command-bridge once advisor scorer track is operator-cleared"
    blockers:
      - "WU5 gated on the operator-owned advisor scorer track (projection.ts/explicit.ts/skill_advisor.py) + its gated 193-row parity re-baseline; dead-id evidence captured"
    key_files:
      - ".opencode/specs/sk-doc/014-sk-doc-parent/023-parent-hub-remediation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 89
    open_questions:
      - "WU5: run the command-bridge lane once the advisor scorer track is operator-cleared / confirmed quiet for the re-baseline"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-parent-hub-remediation |
| **Completed** | 2026-07-07 (plan + execution: 8/9 WUs shipped; WU5 gated) |
| **Level** | 1 |
| **Deliverable** | `plan.md` + WU1-4/6-9 shipped across 8 commits (`f788c86932`…`1fc620e83e`) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A prioritized, decision-forked remediation plan covering all 18 findings from the 022 deep review. Every finding (PS-01…PS-18) maps to one of nine ordered work units; the plan names the fix approach, target files (file:line where the review pinned them), the verification gate, and — for six of them — the operator decision that must land first.

### The nine work units (order = priority + dependency)

1. **WU1 (P0)** — canonize the `transport` axis (enum + doctrine + templates + checker) and resolve `feature_catalog/`; restores a 4/4 canon-clean fleet.
2. **WU2 (P1)** — make `surfaceBundle` conditional in doctrine; add base-outcome checks.
3. **WU3 (P1)** — close the one-identity ingestion hole (hub-boundary stop / nested-identity hard error + `node_modules` skip).
4. **WU4 (P1)** — repair sk-code tool contracts (code-review mutation; drop hub `Task`; two checker rules).
5. **WU5 (P1)** — put the advisor command-bridge lane under contract + a drift guard; refresh the dead command ids.
6. **WU6 (P1+P2)** — sk-design one-file truth pass (routing contract, scaffold prose, versions, discriminator, aliases).
7. **WU7 (P2)** — doctrine refresh sweep (surface naming, 4-hub matrix, extension template, multiplexing, sk-code formula).
8. **WU8 (P2)** — checker hardening batch (folder==packetSkillName, alias uniqueness, base outcomes, defaultMode, packet files, tie-break; drop stale `'context'`).
9. **WU9 (P2)** — metadata dialect convergence (description.json duplicate, family shoehorn, orphan fields, `command-metadata.json`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `plan.md` | Add | The nine-work-unit program + decision forks + done-bar |
| `spec.md`, `tasks.md`, this file | Add | Level-1 packet docs |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly from the 022 review-report.md, which already carried a nine-step prioritized fix list with file:line evidence and explicit decision forks. The plan preserves that ordering (P0 first — it is the only current hard failure — then the P1 correctness/enforcement units, then the P2 reconciliation sweeps), attaches a verification gate to each unit (`parent-skill-check.cjs` on all four hubs after every unit; advisor drift-guard + parity vitests for the command-bridge unit; a planted-fixture red test for the ingestion unit), and consolidates the six decisions into one table with a recommended default each so the P2 work can start on defaults while the operator rules on the P0/P1 forks.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Move toward the checker + majority practice, not the doctrine | For surfaceBundle and naming, 3/4 hubs + the checker embody the sane contract; only the doctrine is stale |
| Extend the canon for the transport axis (don't remodel it away) | The transport packet is principled and documented; the doctrine simply never caught up |
| One work unit per fix-list step; P0 lands + verifies before dependents | WU1 touches the enum in five places — highest blast radius, must be proven 4/4 first |
| Surface six forks with defaults rather than pre-deciding | Three (D2/D3/D4) change advisor/tool semantics the operator owns |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Finding coverage | Pass | PS-01…PS-18 each mapped to a work unit; no orphan |
| Fork completeness | Pass | Six forks (D1/D1b/D2/D3/D4/D5/D6) each carry a recommended default |
| Plan validity | Pass | `validate.sh --strict` passes for this folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Executed 2026-07-07** — WU1-WU4 + WU6-WU9 shipped + pushed (8 commits); final canon sweep is 4/4 "all hard invariants passed, 0 warnings". D1-D6 resolved via "Execute all on my defaults" (D1 refined to allowlist `feature_catalog`; D5 refined to bless the top-level `deprecatedModes` location).
2. **WU5 is the one gated unit** — the command-bridge lane (PS-06, PS-07) touches the operator-owned system-skill-advisor scorer track (`projection.ts`/`explicit.ts`/`skill_advisor.py`) and its gated 193-row parity re-baseline. The dead command ids (`/deep:start-{research,review,model-benchmark}-loop` → live `/deep:{research,review,model-benchmark}`) and the TS(8)/Python(35)/registry(10) `create:*` coverage skew are CONFIRMED as evidence; the fix is held for operator/advisor-track coordination so it does not collide with the pending re-baseline.
3. **Reindex pending** — the sk-design `sk-hub` family and lowercased-alias derived tokens in generated `graph-metadata.json` refresh on the next (operator-gated) memory/graph reindex; the source files are correct now.

<!-- /ANCHOR:limitations -->
