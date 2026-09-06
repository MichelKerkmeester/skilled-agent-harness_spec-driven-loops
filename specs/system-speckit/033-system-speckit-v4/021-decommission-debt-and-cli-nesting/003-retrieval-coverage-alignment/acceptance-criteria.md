---
title: "Acceptance Criteria: Phase 3: retrieval-coverage-alignment"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/003-retrieval-coverage-alignment"
    last_updated_at: "2026-09-05T06:13:06Z"
    last_updated_by: "claude-code"
    recent_action: "Verified all four criteria Met with proving commands"
    next_safe_action: "Proceed to phase 004-save-and-resume-freshness"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-003-retrieval-coverage-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: retrieval-coverage-alignment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/003-retrieval-coverage-alignment
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
| AC-001 | REQ-001 | Given `corpus.mjs` and `retrieval-conventions.md`'s current roots/exclusions, When the divergence table is completed, Then every current difference (`scratch`, `research/lineages`, `tests/fixtures`, packet-fixture directories, `.opencode/skills`-versus-`.opencode` root scope) has a named reason or a converging fix | `spec.md` §2 Resolution table + `retrieval-conventions.md` §9; `scratch` converged (`lib/rg-lane.mjs`/`rg-wrapper.mjs` `GLOBS` and every Section 2 recipe), `research/lineages` and fixture-directories documented as reasoned divergences | Met | - |
| AC-002 | REQ-002 | Given root `README.md`, the five mirrors, and `.opencode/install-guides`, When the coverage decision is made, Then `spec.md` states, for each, whether it joins the trigger index, stays ripgrep-only, or joins neither | `spec.md` §2 Resolution: `.opencode/install-guides` joins the trigger-index corpus (`CORPUS_ROOTS` in `lib/corpus.mjs`); `README.md` and the five mirrors join neither lane | Met | - |
| AC-003 | REQ-003 | Given the converged or documented policy, When the parity test runs, Then it fails on an injected divergence and passes on the converged state | `scripts/tests/retrieval-coverage-parity.vitest.ts`: 7/7 pass on the converged state; with a temporary `'undocumented-temp-dir'` added to `EXCLUDED_DIR_NAMES` (no matching divergence-table entry), the "agrees on every universally-excluded directory name" test fails and names it; reverted (byte-identical diff) and reran clean | Met | - |
| AC-004 | REQ-004 | Given an unchanged corpus, When `generate-trigger-index.mjs` runs twice consecutively, Then both runs report identical `corpusHash` and `indexSha256` | `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs --json` run twice post-change: both report `indexSha256 959b3263cecdae12c1b23bc99141b29f302b1c7d20bcffcaaadbb30def535790` and the same `manifestHash` | Met | - |

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

All four criteria are Met. The coverage decision is recorded, the exclusion divergence is converged where safe and documented where not, the parity test is in place and proven by a negative control, and two post-change index runs hash identically.
<!-- /ANCHOR:closure -->
