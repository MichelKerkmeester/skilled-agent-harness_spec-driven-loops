---
title: "Acceptance Criteria: Phase 2: router-file-tooling"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "router file tooling acceptance criteria"
  - "router resolver closure"
  - "dual declaration rejection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling"
    last_updated_at: "2026-10-29T08:40:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the acceptance criteria for this packet, and every row is Unmet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/freshness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: router-file-tooling

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-router-file-tooling
**Level:** 1
**Status:** Draft
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a skill root whose `ROUTER.md` carries a machine-router section with an assignment header and whose `SKILL.md` carries none, When the resolver runs, Then it returns that section with source `ROUTER.md` | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` prints one passing case for this verdict | Unmet | - |
| AC-002 | REQ-001 | Given a skill root with no `ROUTER.md` whose `SKILL.md` section declares assignments, When the resolver runs, Then it returns that section with source `SKILL.md` | The same suite prints one passing case for this verdict | Unmet | - |
| AC-003 | REQ-003 | Given a skill whose `ROUTER.md` and `SKILL.md` both declare assignments, When the resolver runs, Then it returns the dual-declaration verdict, no text, and both paths, and replay reports `parseable` false with that `routerSource` | The same suite and `node --test .../verify-router-sync.test.cjs` each print a passing dual-declaration case | Unmet | - |
| AC-004 | REQ-002 | Given a fixture skill whose router sits only in `ROUTER.md`, When router replay parses it, Then `routerSource` is `ROUTER.md` and the maps are non-empty | The replay case prints `routerSource` `ROUTER.md` | Unmet | - |
| AC-005 | REQ-004 | Given the live `.skilled/skills` tree, When the source probe runs, Then it prints `{"hub-router.json":7,"inline":6}` | The `node -e` probe in `spec.md` section 2 prints that string | Unmet | - |
| AC-006 | REQ-006 | Given the live sk-code hub, When router sync runs, Then every check passes and no call site builds a `SKILL.md` path | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `5/5 checks passed` | Unmet | - |
| AC-007 | REQ-005 | Given the live `.skilled/skills` tree, When the dead-route scan runs with `--check-router`, Then it prints `Findings: 0` over 5419 files, and a fixture whose `ROUTER.md` names a missing leaf prints one `ROUTER-DEAD-PATH` | `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` prints `Findings: 0`, and `python3 .../test_verify_alignment_drift.py` prints `OK` | Unmet | - |
| AC-008 | REQ-007 | Given a generated Hermes copy carrying `ROUTER.md`, When that copy's `ROUTER.md` is edited and the generator runs with `--check`, Then it reports `DRIFT` for that skill | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints the drifted name | Unmet | - |
| AC-009 | REQ-008 | Given a fixture workspace with one skill, When only its `ROUTER.md` changes, Then `computeAdvisorSourceSignature` returns a different value, and a skill without the file returns the same value as before the change | `vitest run tests/legacy/advisor-freshness.vitest.ts` passes with that case | Unmet | - |
| AC-010 | REQ-009 | Given the parity suite and a plugin signature with the `ROUTER.md` probe removed, When the suite runs, Then it fails on the missing probe | `vitest run tests/parity/router-signature-parity.vitest.ts` passes, and fails when the probe is deleted | Unmet | - |
| AC-011 | REQ-010 | Given a skill directory holding `ROUTER.md`, When the watcher discovers targets, Then one target names that file with reason `router-md` | `vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` prints a passing case for it | Unmet | - |

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

**Closeable:** No

The phase is planned and no code has changed, so AC-001 is the first row a build has to satisfy.
<!-- /ANCHOR:closure -->

---
