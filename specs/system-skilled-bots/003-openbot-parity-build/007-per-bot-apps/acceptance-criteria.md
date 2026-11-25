---
title: "Acceptance Criteria: Phase 7: per-bot-apps"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "per bot apps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/007-per-bot-apps"
    last_updated_at: "2026-11-25T07:13:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-bot-apps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: per-bot-apps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `007-per-bot-apps`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a BOT.md whose frontmatter holds `apps: [github]`, When `parseDefinition` reads it, Then `posture.apps` is `["github"]`; and given `apps: github` or `apps: [""]`, Then it is refused as `apps-invalid` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` passes the parse cases | Unmet | - |
| AC-002 | REQ-002 | Given a bot declaring `apps: [github, nosuchserver]` and a `.utcp_config.json` holding `github`, When `resolveApps` runs, Then it refuses as `apps-unknown-server` and the detail names `nosuchserver` and not `github` | `grep -n 'apps-unknown-server' .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` prints one line, and the `apps.vitest.ts` unknown-name case passes | Unmet | - |
| AC-003 | REQ-003 | Given a run of a bot declaring `apps: [github]`, When the run reaches dispatch, Then `<runFolder>/utcp.json` exists and its `manual_call_templates` holds exactly one entry named `github`, with every other top-level key equal to the repository config's | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` passes the written-file case | Unmet | - |
| AC-004 | REQ-004 | Given a completed run, When its record is read, Then `posture.apps` is the honored names, and for a bot declaring none it is `[]` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` passes the record cases | Unmet | - |
| AC-005 | REQ-005 | Given a run that reaches dispatch, When the environment handed to `dispatchHeadless` is read, Then `UTCP_CONFIG_FILE` is the absolute path of that run's filtered config, and the deep-loop common allowlist admits the key | `grep -c 'UTCP_CONFIG_FILE' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 1, and the `apps.vitest.ts` environment case passes | Unmet | - |
| AC-006 | REQ-006 | Given a repository whose bot declares a server the config does not hold, When `bot-check.cjs` runs, Then it prints a line starting `FAIL: apps-unknown-server:` and exits 1 | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` exits 1 and prints that line | Unmet | - |
| AC-007 | REQ-007 | Given a bot whose `apps` cannot be honored, When the run starts, Then it is refused before dispatch as `apps-refused` with failure class `author`, exits 4, and no `<runFolder>/utcp.json` is written | `grep -c 'apps-refused' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 1, and the `apps.vitest.ts` refusal case passes | Unmet | - |
| AC-008 | REQ-008 | Given the shipped template, When it is read, Then it carries `apps: null` with its default named in a comment | `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line | Unmet | - |
| AC-009 | REQ-009 | Given the author reference and the two feature-catalog files, When they are read, Then each names the `apps` field, and the checker file names `apps-unknown-server` | `grep -l 'apps' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md .skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md .skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` prints all three paths | Unmet | - |
| AC-010 | REQ-006 | Given the clean fixture, When `bot-check.cjs` runs, Then it still exits 0, so the new invariant refuses nothing the old checker passed | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0 | Unmet | - |
| AC-011 | REQ-003 | Given a bot declaring no `apps`, When the run reaches dispatch, Then `<runFolder>/utcp.json` exists with an empty `manual_call_templates` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` passes the absent-declaration case | Unmet | - |
| AC-012 | REQ-002 | Given a bot declaring `apps` and a checkout with no `.utcp_config.json`, When `resolveApps` runs, Then it refuses as `utcp-config-missing` rather than passing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` passes the missing-config case | Unmet | - |

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

AC-001 is unmet: the `apps` key does not parse yet, so no other criterion can be reached.
<!-- /ANCHOR:closure -->
