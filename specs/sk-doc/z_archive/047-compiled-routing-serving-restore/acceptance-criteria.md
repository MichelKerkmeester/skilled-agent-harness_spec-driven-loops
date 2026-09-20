---
title: "Acceptance Criteria: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/047-compiled-routing-serving-restore"
    last_updated_at: "2026-09-01T05:38:12Z"
    last_updated_by: "scaffold"
    recent_action: "Verified every criterion from the final state"
    next_safe_action: "Commit the paths this packet owns"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `specs/sk-doc/047-compiled-routing-serving-restore`
**Level:** 2
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given three hubs reporting `stale-manifest`, When their authored manifests are re-pinned and the mirror rebuilt, Then all five hubs report `compiled-serving` | `node .opencode/bin/compiled-route-status.cjs --all` returned `compiled-serving` for cli-external-orchestration, mcp-tooling, sk-code, sk-doc and system-deep-loop | Met | - |
| AC-002 | REQ-002 | Given a runtime root whose hub manifest is deleted, malformed or invalid, When the sync build runs against it, Then the build refuses and names the hub | `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` reported `pass 42 fail 0`, including the three `assert.throws` cases on missing, malformed and invalid manifests | Met | - |
| AC-003 | REQ-002 | Given the promoted closure resolves every hub, When the move simulation runs, Then it reads nothing under the spec tree | `node .opencode/bin/compiled-route-sync.cjs --verify` returned `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` | Met | - |
| AC-004 | REQ-003 | Given the human voice mode's own phrases, When they are replayed through the shipped engine, Then that mode wins each one | Frozen 207-probe replay: `hvr`, `human voice`, `human voice rules`, `apply human voice`, `rewrite in human voice` and `banned word check` all route to `sk-create-with-human-voice` | Met | - |
| AC-005 | REQ-004 | Given the frozen corpus scored before the change, When it is scored against the shipped state, Then no probe loses a route except the two bare verbs removed on purpose | Ten probes changed: seven gained a route, one transferred owner, two bare verbs (`check`, `review`) now defer by design | Met | - |
| AC-006 | REQ-004 | Given a counterfactual harness standing in for the engine, When it runs an empty mutation, Then it reproduces the live engine exactly | Control run matched the live engine on 207 of 207 probes before any candidate was measured | Met | - |
| AC-007 | REQ-005 | Given a packet whose phase headings live in `tasks.md`, When the complexity rule counts them, Then it reports the real number | `_complexity_count_phases` returns 3 for this packet and for a packet whose phases sit in `plan.md`, and 0 for a fixture with the headings stripped from both | Met | - |
| AC-008 | REQ-005 | Given this packet, When `validate.sh --strict` runs from the final state, Then it reports no error | `RESULT: PASSED` with `Errors: 0  Warnings: 0` | Met | - |
| AC-010 | REQ-006 | Given a registry naming a packet that is not on disk, When the hub compiles, Then the compile fails rather than promoting an unreachable route | `deep-loop-registry-compiler.vitest.ts` reports 4 of 4 passing, covering `PACKET_NOT_FOUND`, `LEAF_NOT_FOUND` and a clean compile | Met | - |
| AC-011 | REQ-006 | Given the restored guard, When the deep-loop canary validator runs end to end, Then it reports real-green | `validate-canary.cjs` returns `"status":"real-green"` with 10 of 10 route-gold rows real-green, after five layers of stale pins and a retired-mode fixture were reconciled | Met | - |
| AC-009 | REQ-004 | Given the deep-improvement benchmark suite, When per-file failure counts are compared with the vocabulary edit stashed and restored, Then they are identical | Both runs reported the same 15 failing files with the same per-file counts, so the vocabulary change adds no failure | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 and AC-002 carried the packet: the hubs serve what they compiled, and the gate that
protects a corrupt manifest still fires, proved by its own suite rather than by argument.
Left out on purpose: the scorer weighs a three-word phrase and a one-word verb identically,
which is the mechanism behind two stranded phrases. Five hub routers carry three divergent
scoring bodies, so changing that is its own program and is recorded in the spec's Out of
Scope with the measurement behind it.
<!-- /ANCHOR:closure -->
