---
title: "Acceptance Criteria: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claude user hook sync acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/009-claude-user-hook-sync"
    last_updated_at: "2026-11-16T10:18:26Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-claude-user-hook-sync"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `009-claude-user-hook-sync`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the switch is unset, When a SessionStart run happens, Then the user file is unchanged and nothing is printed | `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:83` passes in `node --test` (8 pass, 0 fail); the switch check is `.skilled/bin/sync-claude-user-hooks.mjs:150` | Met | - |
| AC-002 | REQ-002 | Given the switch is on in the primary checkout, When a run happens, Then owned hooks equal the project `hooks` block, non-owned hooks and other keys stay, and a second run writes nothing | `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:93`, `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:122` and `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:149` pass; a sync over a copy of the real user file removed 20 owned, added 36, kept 16 non-owned, kept non-hook keys and Orca hooks equal, and a second `--check` printed OK | Met | - |
| AC-003 | REQ-003 | Given a folder with no `.skilled` entry, When each rendered Claude command runs there, Then each exits 0 with no output, and the project file matches the registry | 36 of 36 commands exit 0 with no output; `sync-hook-registrations.cjs --check` prints PASS; the guard case `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:134` passes, 9/9 | Met | - |
| AC-004 | REQ-004 | Given a linked worktree, When session mode runs, Then nothing is written, and When a manual write runs without `--allow-worktree`, Then it refuses with a message | `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:156` passes; the check is `.skilled/bin/sync-claude-user-hooks.mjs:157`, and removing it makes that case fail | Met | - |
| AC-005 | REQ-005 | Given a first write, When the sync writes, Then `<target>.pre-skilled-hook-sync` holds the old file and a later sync keeps it; every write goes through a temp file and a rename | `.skilled/bin/tests/sync-claude-user-hooks.test.cjs:135` passes, and removing the backup-once rule at `.skilled/bin/sync-claude-user-hooks.mjs:198` makes it fail; `atomicWrite` is `.skilled/bin/lib/user-hook-file.mjs:154` | Met | - |
| AC-006 | REQ-006 | Given the moved helpers, When the Codex suite and check run, Then both match the baseline | `install-codex-hooks-source-root.test.cjs` 20/0 before and after; the import is `.skilled/bin/install-codex-hooks.mjs:34`; `--check` OK on main and worktree | Met | - |
| AC-007 | REQ-007 | Given the env catalogue, When it is checked, Then `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED` is listed in `ENV-REFERENCE.md`, `doctor-env.yaml`, `.env.example` and `hook-flags.env.example` | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:112` lists it; `env-reference-drift.vitest.ts` 5/5; `rg -l 'SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED'` over the four files prints 4 | Met | - |
| AC-008 | REQ-002 | Given the change is pushed and the operator approves, When the switch is enabled in the primary checkout and one session starts, Then no Skilled hook in `~/.claude/settings.json` differs from `.claude/settings.json` | `node .skilled/bin/sync-claude-user-hooks.mjs --check` in the primary checkout prints OK. Live in the primary checkout on `c459501a3fb`: `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED=1` in `.skilled/hooks/hook-flags.env`, one `--session-start` run exited 0, `--check` printed `OK /Users/michelkerkmeester/.claude/settings.json`, the backup `settings.json.pre-skilled-hook-sync` was written, and the 36 Skilled hooks equal the project's with every other key and hook unchanged. A headless `claude -p` debug log then showed each of six Skilled hooks, the sync step included, run once, and no drift fallback fired. Session step registered at `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1799` | Met | - |

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

Every criterion is Met. AC-008 was met live after the push, in the primary checkout.
<!-- /ANCHOR:closure -->
