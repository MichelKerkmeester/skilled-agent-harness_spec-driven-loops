---
title: "Implementation Summary"
description: "The after-compaction pointer now names the handoff note date and asks for git log and git status before the session trusts Remaining work, on Claude, Pi and OpenCode."
trigger_phrases:
  - "compaction pointer staleness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness"
    last_updated_at: "2026-10-25T15:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built the dated after-compaction pointer and its tests"
    next_safe_action: "Orchestrator reviews and commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-compaction-pointer-staleness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-compaction-pointer-staleness |
| **Status** | Complete |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that compacts after writing its handoff note now learns when that note was written and checks git for work done since, before it trusts the note's Remaining work. Before this, the pointer sent the session straight back to Remaining work with no age, so work committed after the note could be done twice.

### Phase 7: compaction-pointer-staleness

After a compaction the pointer adds one step before "Continue the work". With a date it reads: the note was written at `<created_at>`, run `git log --since='<created_at>'` and `git status`, and compare them with Remaining work before you trust it. A note with an empty or missing `created_at` gets the same step without a date and never prints `undefined` or `null`. The relaunch seed text is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | `seedText` takes `createdAt` and adds the dated or undated git step after compaction only |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modified | Note helper returns `{ specFolder, createdAt }` from its one read and passes the date |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | Options type gains `createdAt`, note helper widened, compaction handler passes the date |
| `.opencode/plugins/session-relaunch.js` | Modified | Note helper widened and `compactionSeed` passes the date |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Dated, hostile-date and undated pointer tests |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Fixed fixture date and the adapter date test |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | Fixture date and the adapter date test |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | Fixture date and the adapter date test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The five new tests ran red first, each failing on an assertion against the old pointer text, then the producer and the three callers changed and all went green. The relaunch text was compared with the committed `nudge.cjs` over 24 option combinations and matched byte for byte. A negative control showed the same comparison does see the after-compaction change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shell-quote the date inside the git command | The session pastes the command into a shell, so a frontmatter value with a quote or semicolon must stay one argument |
| Treat empty, missing and non-string `created_at` the same | The parser stores trimmed strings, so an empty key and an absent one mean the same thing: no usable date |
| Rename each adapter's `noteSpecFolder` to `noteFields` | It now returns two fields, and the old name would mislead the next reader |
| Insert the step before "Continue the work" and renumber after it | The check has to happen before the session acts on Remaining work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 896 tests, 896 pass, 0 fail, exit 0 (baseline 892 tests, 886 pass, 6 fail, all six in other phases' in-flight tests) |
| `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | PASS: 59 passed, exit 0 (baseline 54) |
| `tsc -p tsconfig.pi.json --noEmit` (local TypeScript 5.9.3) | PASS: exit 0 |
| `node --check` on the six edited JS files | PASS |
| Relaunch text against HEAD `nudge.cjs`, 24 rows | PASS: 0 byte differences |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hook does not check that the date is valid.** A malformed `created_at` reaches the session as text, and git reports the bad date when the session runs the command.
2. **The check is advice to the session.** The hook runs no git command itself, so a session can still skip the step.
<!-- /ANCHOR:limitations -->

---
