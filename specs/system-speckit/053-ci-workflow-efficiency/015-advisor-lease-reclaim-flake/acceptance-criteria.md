---
title: "Acceptance Criteria: Phase 15: advisor-lease-reclaim-flake"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor lease reclaim flake acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/015-advisor-lease-reclaim-flake"
    last_updated_at: "2026-10-28T01:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Every criterion met with observed evidence"
    next_safe_action: "None; the conductor lands the commit"
    blockers: []
    key_files:
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-015-advisor-lease-reclaim-flake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 15: advisor-lease-reclaim-flake

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/015-advisor-lease-reclaim-flake
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fixture daemon's boot delayed 400 ms, When two launchers reclaim a stale lease, Then the test waits for the child and passes | HEAD test and launcher: 0 of 10, all `expected null to deeply equal Any<Number>`. Fixed test and launcher: 10 of 10; with the launcher also slowed 300 ms before the bootstrap lock: 10 of 10. Readiness wait at `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:480` | Met | - |
| AC-002 | REQ-002 | Given an empty owner-lease file, When a launcher claims, Then it becomes the owner and never names itself the holder, and no claim exposes a half-written lease | HEAD launcher: `expected 97276 not to be 97276` and `expected [ 'unreadable' ] to not include 'unreadable'`. Fixed: both pass. Publish at `.skilled/bin/system-skill-advisor-launcher.cjs:476`, tests at `.skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts:147` and `.skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts:199` | Met | - |
| AC-003 | REQ-003 | Given a stale lease, When a peer publishes a live lease after this launcher read the stale one, Then the claim returns not acquired, names the peer and leaves its lease intact | Round-0 launcher: `expected true to be false`. Fixed: passes, holder `process.ppid`, file text unchanged. Set-aside at `.skilled/bin/system-skill-advisor-launcher.cjs:630`, test at `.skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts:159` | Met | - |
| AC-004 | REQ-004 | Given an owner whose daemon opens its socket 1500 ms late, When a second client starts, Then it bridges and is served, and the owner's child is not reaped; a holder past the grace is still respawned | Round-0 launcher: the second launcher logged `requesting respawn` and `reaping recorded skill-advisor daemon pid 80454`, and child 80472 replaced it. Fixed: the starting-owner test passes and the missing-socket test logs `is still starting; waiting up to` and then respawns. Wait at `.skilled/bin/system-skill-advisor-launcher.cjs:942`, tests at `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:533` and `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:600` | Met | - |
| AC-005 | REQ-005 | Given any two-launcher run, When it settles, Then one launcher, one advisor-server, a live owner and matching leases remain | The stale-reclaimer and starting-owner tests assert all four; 20 of 20 sequential and 20 of 20 four-at-a-time runs print `Tests  9 passed (9)`. Assertions at `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:452` and `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:533` | Met | - |
| AC-006 | REQ-005 | Given the CI preparation steps, When the advisor default and stress suites run, Then they pass | After `npm run build`: `Test Files  153 passed (153)`, 1306 tests passed and 8 skipped of 1314, exit 0. Stress: `Test Files  21 passed (21)`, `Tests  65 passed (65)`, exit 0. The two system-spec-kit launcher tests: 57 passed. CI steps at `.github/workflows/skill-advisor-stress.yml:86` and `.github/workflows/skill-advisor-stress.yml:91` | Met | - |
| AC-007 | REQ-006 | Given a young owner with no socket, When a second client starts with `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`, Then it prints `LEASE_HELD_BY` for the owner without waiting | Without the guard: the test fails in 7203 ms with the wait log printed. With it: passes in 315 ms against a 7000 ms grace, exit 0. Guard at `.skilled/bin/system-skill-advisor-launcher.cjs:945`, matching `.skilled/bin/lib/launcher-ipc-bridge.cjs:488`; test at `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:572` | Met | - |

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

Every criterion is met with evidence observed on the final code.
<!-- /ANCHOR:closure -->
