---
title: "Acceptance Criteria: env secret guard for every runtime"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "env secret guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks-plugins-extensions/hook-injection-pipeline/007-env-secret-guard"
    last_updated_at: "2026-11-10T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Re-cited every criterion after the alignment-run fixes"
    next_safe_action: "Recheck the alignment run, then commit after operator review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-env-secret-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: env secret guard for every runtime

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** hook-injection-pipeline/007-env-secret-guard
**Level:** 2
**Status:** Complete
**Date:** 2026-11-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a read, write, edit, delete or grep call naming `.env`, `.env.local` or a symlink to one, When any of the seven runtimes runs it, Then the call is denied and `.env.example` is allowed | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:73`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:48`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:54`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:183`, `.skilled/hooks/env-secret-guard/tests/dsh-env-secret-guard.test.mjs:20`, `.opencode/plugins/tests/env-secret-guard.test.cjs:24` | Met | - |
| AC-002 | REQ-002 | Given a patch whose Add, Update, Delete, Move to or unified header names a dotenv file, When it runs, Then it is denied | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:62`, `.opencode/plugins/tests/env-secret-guard.test.cjs:24` | Met | - |
| AC-003 | REQ-003 | Given `cat .env`, `grep KEY .env`, `echo X >> .env` or Codex argv `[bash, -lc, cat .env]`, When the shell tool runs it, Then it is denied, and `node --env-file=.env app.js` is allowed | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:90`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:107`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:114`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:145`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:153`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:165`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:183`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:192`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:211` | Met | - |
| AC-004 | REQ-004 | Given a dotenv file in the project, When keys are listed through the OpenCode tool or the CLI, Then the keys and a validity flag come back | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:226`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:376`, `.opencode/plugins/tests/env-secret-guard.test.cjs:63` | Met | - |
| AC-005 | REQ-005 | Given a file with a bad line, When it is validated, Then the line number comes back | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:226`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:248`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:260` | Met | - |
| AC-006 | REQ-006 | Given `ENV_SECRET_GUARD_PEPPER`, When one key is fingerprinted, Then a 64-hex HMAC comes back, equal for equal values, and without a pepper the request is refused | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:234`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:248`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:260`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:273` | Met | - |
| AC-007 | REQ-007 | Given a non-dotenv file or a dotenv file outside the project, When it is inspected, Then the request is refused | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:125`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:280` | Met | - |
| AC-008 | REQ-008 | Given `SYSTEM_ENV_SECRET_GUARD_DISABLED=1`, When a refused call runs, Then it is allowed and the OpenCode tools report disabled | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:351`, `.skilled/hooks/env-secret-guard/tests/dsh-env-secret-guard.test.mjs:52`, `.opencode/plugins/tests/env-secret-guard.test.cjs:95` | Met | - |
| AC-009 | REQ-009 | Given a dotenv file holding a known secret, When every inspection path and deny message runs, Then the secret appears in none of them | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:226`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:234`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:260`, `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs:376`, `.opencode/plugins/tests/env-secret-guard.test.cjs:63` | Met | - |
| AC-010 | REQ-010 | Given the registry entry, When both sync checks run, Then each prints PASS | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1681`, and both `--check` runs print PASS (35-hook registry, 252 mirrors) | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met. The three independent reviews and the alignment run are triaged, and every confirmed guard defect is fixed and tested.
<!-- /ANCHOR:closure -->
