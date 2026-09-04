---
title: "Acceptance Criteria: Phase 4: cross-hub-vocabulary"
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
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Re-ran the criteria verifications and recorded each result"
    next_safe_action: "None; the criteria are settled"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: cross-hub-vocabulary

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/004-cross-hub-vocabulary
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given duplicate uncompiled entries under bare executor names, When they are removed, Then the compiled route wins | Re-run 2026-09-02: six bare executor names (codex, opencode, cursor, devin, pi, claude code) each return `cli-external-orchestration` at rank one carrying a compiled route, and no routeless bare-name entry appears at any rank. The before state is recorded in `08eb67a0de` and in `executor-delegation.ts:1` | Met | |
| AC-002 | REQ-002 | Given a vocabulary change, When both hubs are re-measured, Then neither loses a prompt it owned | Re-run 2026-09-02: `capture-scorer-eval-baseline.mjs:1` re-scores the corpus and returns metrics and fixture hashes identical to `scorer-eval-baseline.json:1`, captured at `8bb9011584` after the routing edits. The ratchet moves on any lost row, so none moved. A direct read of the 46 sk-doc and sk-code gold rows puts 40 at rank one, which is the same figure the frozen baseline already carries | Met | |
| AC-003 | REQ-003 | Given any routing file edit, When the phase closes, Then manifests are fresh and canaries green in the same commit | Re-run 2026-09-02: `compiled-route-manifest.cjs freshness` returns `"fresh":true` for cli-external-orchestration, mcp-tooling, sk-code, sk-doc and system-deep-loop, and all five `harness/validate-canary.cjs:1` runs exit 0 | Met | |

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

All three criteria were re-verified against the current tree rather than accepted from the
commit log. The compiled route wins under every bare executor name, the ratchet baseline
re-captures identical, manifests are fresh for all five hubs and the five canaries exit 0.
What was consciously left out is the part the phase measured and could not reach: the 94 of
180 realistic prompts that contain none of the declared words in any form. That is a scoring
change, forbidden here by the parent packet's D2, and it moves to its own packet.
<!-- /ANCHOR:closure -->
