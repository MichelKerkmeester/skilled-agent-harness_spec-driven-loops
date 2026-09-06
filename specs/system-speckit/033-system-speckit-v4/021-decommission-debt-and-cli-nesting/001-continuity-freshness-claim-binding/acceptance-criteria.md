---
title: "Acceptance Criteria: Phase 1: continuity-freshness-claim-binding"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/001-continuity-freshness-claim-binding"
    last_updated_at: "2026-09-05T06:13:04Z"
    last_updated_by: "code-agent"
    recent_action: "Marked all six acceptance criteria Met with evidence"
    next_safe_action: "None; phase closed, ready for the next phase's Gate 3 answer"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-001-continuity-freshness-claim-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: continuity-freshness-claim-binding

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/001-continuity-freshness-claim-binding
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the binding decision is implemented, When `continuity-freshness.ts` is read, Then a code comment and this spec both state that `implementation-summary.md`'s `session_dedup.fingerprint` is the sole attestation point for a completion claim | `rg -n "attestation" .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` finds two matches: the binding comment above `CONTINUITY_FRESHNESS_SKIP_CODES` and the one above `evaluateCompletionFreshness`'s attestation-candidate lookup | Met | - |
| AC-002 | REQ-002 | Given packet `052-memory-decommission-landing` (real, zero-fingerprint, Status Complete), When `SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing --json` runs, Then the result code is the completion-freshness verdict (`zero_fingerprint`), not the unrelated timestamp `stale` verdict | `SPECKIT_COMPLETION_FRESHNESS=1 node .opencode/skills/system-spec-kit/scripts/dist/validation/continuity-freshness.js --folder specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing --json` returns `"code": "zero_fingerprint"` (was `"stale"` before this phase) | Met | - |
| AC-003 | REQ-003 | Given a document with a fresh completion claim and no existing fingerprint, When the continuity writer saves it, Then `session_dedup.fingerprint` is a real, non-`ZERO_CONTINUITY_FINGERPRINT` SHA-256 value | New test `stamps a real fingerprint into implementation-summary.md when the saved packet carries a completion claim` in `generate-context-cli-authority.vitest.ts` — passes (18/18 total in that + the save-lock suite) | Met | - |
| AC-004 | REQ-004 | Given the eight skip codes, When `validate.sh --strict --json` runs on a packet in each skip state, Then the JSON output distinguishes each skip code from a verified pass, and the aggregate exit code for every packet in `049-memory-decommission/`, `052-memory-decommission-landing/` and `053-spec-kit-runtime-rename/` is unchanged from the T001 baseline | `validate.sh --strict --json` on 052/053 now shows `"details": ["code:zero_fingerprint"]` on the `CONTINUITY_FRESHNESS` entry; exit 0 on 052, 053 and all seven `049-memory-decommission/*` children, matching the T001 baseline exit codes exactly | Met | - |
| AC-005 | REQ-005 | Given the CLI opt-in gate and the exported function, When both are exercised in a test, Then the current asymmetry (CLI gated, function unguarded) is either removed or pinned as intentional by an explicit assertion | New case `gates the CLI on SPECKIT_COMPLETION_FRESHNESS while the exported function stays unguarded` in `continuity-freshness.vitest.ts` — passes | Met | - |
| AC-006 | REQ-006 | Given the four new scenarios, When `continuity-freshness.vitest.ts` runs, Then all four pass alongside the existing five passing cases and the one pre-existing `it.fails.skip` | `npx --prefix scripts vitest run --config runtime/vitest.config.ts scripts/tests/continuity-freshness.vitest.ts` → 10 passed, 1 skipped (11 total: 6 pre-existing + 4 new) | Met | - |

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

All six criteria are Met. One deviation from the plan's named file set was necessary
and is recorded in `implementation-summary.md`'s Known Limitations: fixing
`evaluateCompletionFreshness`'s attestation binding required updating two cases in a
pre-existing consumer test, `runtime/tests/continuity-freshness.vitest.ts`, that encoded
the pre-fix fall-through behavior; two unrelated, pre-existing failures in that same file
were found and left untouched.
<!-- /ANCHOR:closure -->
