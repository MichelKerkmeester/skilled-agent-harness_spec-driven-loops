---
title: "Acceptance Criteria: Alignment fixes for private-skill guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/009-alignment-fixes"
    last_updated_at: "2026-10-27T19:51:43Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with its observed evidence"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-l1-private-guard-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Alignment fixes for private-skill guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `009-alignment-fixes`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the replay library lists the skills root, When `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` runs, Then it exits 0 | `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs:37`; Observed: `skill-root reader inventory coverage passed`, exit 0; exit 1 at HEAD | Met | - |
| AC-002 | REQ-002 | Given an untrusted `local-*` link to a folder outside the tree, When both surface readers run, Then neither returns it | `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs:164`; `declared-surfaces-parity.test.cjs` `pass 3`; plugin vitest `4 passed`, `1 failed` on the HEAD plugin; repro prints `["fallback:OMEGA"]`, `["specific:EVIL","fallback:OMEGA"]` at HEAD | Met | - |
| AC-003 | REQ-003 | Given a private entry in a mirror tree, When `findOrphans` runs, Then it is not an orphan, and the CLI check still passes | `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs:37`; `sync-runtime-mirrors.test.mjs` `pass 2`, exit 1 with the skip deleted; `--check` prints `PASS: 194 mirrors` | Met | - |
| AC-004 | REQ-004 | Given the private-skill-root prompt, When `advisor_recommend` runs, Then `system-skill-advisor` is top-1 and the gates match the baseline | `.skilled/skills/system-skill-advisor/graph-metadata.json:79`; Probe: `system-skill-advisor` 0.8666 first, `sk-git` 0.8223 second; regression 42/42 before and after; validate 0.8103 before and after | Met | - |
| AC-006 | REQ-002 | Given Node 20.19.5, When the parity test, the plugin vitest and the trusted-link repro run, Then a declared-root link is kept and an untrusted one dropped | `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.cjs:71`; parity `ok 3` on Node 20.19.5 and 26; plugin vitest 95 of 95 on both; repro `["specific:GOOD","fallback:OMEGA"]` on both | Met | - |
| AC-005 | REQ-005 | Given `canary-router.cjs`, When the NUL bytes become `'\0'`, Then `file` reports text, the route gold is identical and the tests pass | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:188`; `UTF-8 text`; `cmp` of the gold silent; compiled-route tests `pass 95`; sync check `all 55 served copies match` | Met | - |

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

Every criterion is Met with evidence observed in this session.
<!-- /ANCHOR:closure -->
