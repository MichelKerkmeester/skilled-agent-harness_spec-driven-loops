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
    last_updated_at: "2026-10-29T10:56:00Z"
    last_updated_by: "pi"
    recent_action: "Recorded a command and its observed output against all 11 criteria, and every row is Met"
    next_safe_action: "Build 003-check-and-template-canon"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/freshness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
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
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a skill root whose `ROUTER.md` carries a machine-router section with an assignment header and whose `SKILL.md` carries none, When the resolver runs, Then it returns that section with source `ROUTER.md` | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` printed `pass 7 fail 0`, and its first case asserts verdict `router-md` with the `ROUTER.md` path at `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs:74` | Met | - |
| AC-002 | REQ-001 | Given a skill root with no `ROUTER.md` whose `SKILL.md` section declares assignments, When the resolver runs, Then it returns that section with source `SKILL.md` | The same run, whose second case asserts verdict `skill-md` with the `SKILL.md` path at `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs:96` | Met | - |
| AC-003 | REQ-003 | Given a skill whose `ROUTER.md` and `SKILL.md` both declare assignments, When the resolver runs, Then it returns the dual-declaration verdict, no text, and both paths, and replay reports `parseable` false with that `routerSource` | The same run, whose third case asserts the verdict with `source` and `text` null at `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs:108`, and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` printed `pass 11 fail 0` including the case at `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:130` where a skill that declares twice routes nothing | Met | - |
| AC-004 | REQ-002 | Given a fixture skill whose router sits only in `ROUTER.md`, When router replay parses it, Then `routerSource` is `ROUTER.md` and the maps are non-empty | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` printed `pass 11 fail 0`, including `leg 1b reads the machine router from a ROUTER.md section` at `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:100`, which passes only once the doc that file names is routed | Met | - |
| AC-005 | REQ-004 | Given the live `.skilled/skills` tree, When the source probe runs, Then it prints `{"hub-router.json":7,"inline":6}` | The `node -e` probe in `spec.md` section 2 printed that exact string before and after the change, recorded at `spec.md:88` | Met | - |
| AC-006 | REQ-006 | Given the live sk-code hub, When router sync runs, Then every check passes and no call site reads a `SKILL.md` to find the router, apart from the skill-root existence guard at `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:185` | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` printed `router-sync: 5/5 checks passed`, and `readSkillRouter` calls `lib.parseRouter(null, dir)` at `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:49` so every leg hands the resolver a root, and that guard's `SKILL.md` path is an existence check that only decides whether a hub packet is a skill root | Met | - |
| AC-007 | REQ-005 | Given the live `.skilled/skills` tree, When the dead-route scan runs with `--check-router`, Then it prints `Findings: 0` over 5420 files, and a fixture whose `ROUTER.md` names a missing leaf prints one `ROUTER-DEAD-PATH` | `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` printed `[alignment-drift] PASS`, `Scanned files: 5420` and `Findings: 0`, and `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` printed `Ran 36 tests` and `OK` including the case at `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py:297` that prints one `ROUTER-DEAD-PATH` for a leaf named in `ROUTER.md` | Met | - |
| AC-008 | REQ-007 | Given a generated Hermes copy carrying `ROUTER.md`, When that copy's `ROUTER.md` is edited and the generator runs with `--check`, Then it reports `DRIFT` for that skill | `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` printed `pass 7 fail 0`, whose copied-file case at `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs:122` asserts `DRIFT hub` for an edited copy and again for a missing one, and the live sync wrote 7 of 65 copies with `--check` printing `PASS: 65 Hermes skill copies in sync` | Met | - |
| AC-009 | REQ-008 | Given a fixture workspace with one skill, When only its `ROUTER.md` changes, Then `computeAdvisorSourceSignature` returns a different value, and a skill without the file returns the same value as before the change | The advisor `vitest` run over the freshness, watcher and parity suites reported `3 files, 20 tests passed`, the probe sits at `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:169`, and the parity case at `.skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts:317` restores both signatures byte for byte once the file is removed | Met | - |
| AC-010 | REQ-009 | Given the parity suite and a plugin signature with the `ROUTER.md` probe removed, When the suite runs, Then it fails on the missing probe | The case at `.skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts:305` changes both signatures when only the router file is edited and passed inside that same run, and the evidence records that it fails when the plugin probe at `.opencode/plugins/system-skill-advisor.js:346` is removed, checked by the worker that wrote it | Met | - |
| AC-011 | REQ-010 | Given a skill directory holding `ROUTER.md`, When the watcher discovers targets, Then one target names that file with reason `router-md` | The same run reported `3 files, 20 tests passed` with no failing case, and its watcher case at `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts:154` asserts one `router-md` target for the skill that ships the file and none for its sibling | Met | - |

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

All 11 criteria are `Met`, and each row names the command that decided it plus the output that command printed. No row needed a waiver, so this packet carries no decision record.
<!-- /ANCHOR:closure -->

---
