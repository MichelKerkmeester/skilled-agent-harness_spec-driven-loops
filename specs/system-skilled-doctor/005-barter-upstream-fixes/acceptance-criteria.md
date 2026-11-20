---
title: "Acceptance Criteria: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "barter upstream fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/005-barter-upstream-fixes"
    last_updated_at: "2026-11-18T12:44:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-barter-upstream-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Upstream fixes so Barter can drop four overlays: Code Mode disabled manuals, provider-neutral Pi config, doctor tests outside the source repo, overlay anchor placement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `005-barter-upstream-fixes`
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a config with one enabled and one disabled stdio manual, When Code Mode starts and `register_manual` runs on the disabled entry, Then only the enabled manual starts at startup and the disabled one is listed after registration and on the next call | Scripted MCP probe: `started at startup: ["live"]`, then `["live.live.ping","sleepy.sleepy.ping"]` twice. Unpatched build starts both. The filter is `.skilled/skills/mcp-code-mode/mcp-server/index.ts:435` | Met | - |
| AC-002 | REQ-002 | Given `.utcp_config.json`, When each manual's `disabled` field is read, Then exactly `clickup_official`, `mobbin` and `refero` are `True`, the only three `mcp-remote` manuals | Python read of `manual_call_templates`. Flags at `.utcp_config.json:98`, `.utcp_config.json:174` and `.utcp_config.json:233` | Met | - |
| AC-003 | REQ-003 | Given the Mobbin and Refero SKILL.md files, When `sk-skill-check` runs on each, Then both report no findings | `Result: NO FINDINGS (1 UNKNOWN)` twice. Ask steps at `.skilled/skills/mcp-tooling/mcp-mobbin/SKILL.md:84` and `.skilled/skills/mcp-tooling/mcp-refero/SKILL.md:77` | Met | - |
| AC-004 | REQ-004 | Given both `.pi` files, When compared with the consumer's overlays, Then they are byte-identical and name no `llmgateway` default or observer model | `cmp` prints nothing. The fallback is `.pi/pi-blackhole-config.json:9` | Met | - |
| AC-005 | REQ-005 | Given the vendored copy, When the six upstream-owned test files run, Then they report 0 failures, and the seven files report 166 pass with 0 skipped in the worktree | Vendored: tests 141, pass 133, fail 0, skipped 8. Worktree: tests 166, pass 166, skipped 0. The source-repo gate is `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:62` | Met | - |
| AC-006 | REQ-006 | Given a `marked-section` entry with `insertBefore`, When apply, rewrite, capture and move run, Then the block sits before the anchor and a missing anchor refuses | `overlay-engine-sync.test.cjs` 80/80, the five new tests fail on the old engine. The placement test starts at `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1670` | Met | - |
| AC-007 | REQ-001 | Given a fresh session with no OAuth tokens, When Code Mode starts, Then no browser sign-in tab opens, and `register_manual` on each of the three entries connects after the user agrees | No tokens: the shipped dist on the three shipped entries, with HOME empty and an `npx` shim that logs each call, listed no tools and logged no `mcp-remote` launch. Control: the same run with `mobbin` enabled logged `npx -y mcp-remote https://api.mobbin.com/mcp`. After the operator picked Ready, `register_manual` in a live session registered `clickup_official` (67 tools), `mobbin` (8) and `refero` (10), each `success: true`, all still listed on the next call. They connected from tokens cached under `~/.mcp-auth`, so no tab was needed. The filter is `.skilled/skills/mcp-code-mode/mcp-server/index.ts:435` | Met | - |
| AC-008 | REQ-007 | Given the Skilled worktree and a tree from before the re-export entries, When `hook-wiring-check.cjs --root` runs on each, Then the worktree exits 0 with all 22 Pi entries ok and the old tree exits 1 with 21 `pi-extension-broken` lines, and both doctor assets name the check | Worktree: `ok` for five runtimes, `{"ok":22}`, exit 0. Old tree: 21 broken, exit 1. `hook-wiring-check.test.cjs` 53/53. `doctor-setup.yaml` and `doctor-symlink-check.yaml` run it. Wired at `.skilled/commands/doctor/assets/doctor-setup.yaml:40` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37` | Met | - |
| AC-009 | REQ-008 | Given the rendered entries, When Pi's installed loader (`discoverAndLoadExtensions`, 1.5.0 and 1.5.2) loads them over the full tree, a tree without `.skilled`, a tree missing one adapter dependency and an adapter that throws, Then it reports 22 loaded, 0 errors and 37 handlers, then 0 errors with one notice for 22 entries, then one notice naming `ask-surface-guard.ts` with the other hooks intact, then `Failed to load extension: adapter factory boom` | Scratch loader probe, both Pi versions; a second load pass still gives one notice; headless sessions print the notice on stderr. The one-line entries over the missing tree gave 22 load errors. The template renderer is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:239` | Met | - |
| AC-010 | REQ-008 | Given the entries, When `sync-hook-registrations.cjs --check`, the parity vitest, `git-setup-check.cjs --tool pi` and `tsc -p tsconfig.pi.json` run, Then all pass, the parity template test and `--check` fail on an entry put back to the one-line shape, and tsc fails on a type error in an entry | `--check` PASS, 22 Pi extensions resolve. Parity 154/154, sync vitest 10/10, git-setup-check 87/87 with `pi (active): registered`. tsc exit 0 reading three entries. Negative controls: the template test fails on a re-export entry, `--check` lists 22 template drifts on the old entries, tsc fails on `notifyy`. The type gate reads `tsconfig.pi.json:13` | Met | - |
| AC-011 | REQ-009 | Given the Mobbin, Refero and ClickUp modes, When a case-insensitive grep runs for "manuals load", "load at startup", "fresh Code Mode" and "reconnect Code Mode", Then no stale claim remains outside changelogs, and `sk-skill-check` reports the same result as before the edit | Grep clean outside the changelogs. `sk-skill-check` gives `Result: NO FINDINGS (1 UNKNOWN)` on each mode, before and after. `bash -n` exits 0 on both edited scripts. The ask step reads `.skilled/skills/mcp-tooling/mcp-mobbin/INSTALL-GUIDE.md:141` | Met | - |
| AC-012 | REQ-010 | Given the source repository, When the backup-location case runs with `.skilled/output/` dropped from `.gitignore`, Then it fails, and with the line back it passes | `node --test` passes 2 of 2 with the line and fails the new case without it. The case is `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:1045` | Met | - |
| AC-013 | REQ-011 | Given a clean clone, When the workflow's steps run, Then `tsc -p tsconfig.pi.json` and `hook-wiring-check.cjs --root .` both exit 0 after provisioning, and the wiring check exits 1 without it | Clean clone: tsc 0, wiring check 0 after `provision_worktree`. Before provisioning the wiring check exits 1 naming `packet-purpose.js`. `ci-report` row has no flags and `check-gate-inputs.sh` reads `RESULT: PASSED`. The job is `.github/workflows/pi-entry-checks.yml:43`. On GitHub, Pi Entry Checks run 44351163891 on main `6c2a19d9f44` concluded success, with the type-check and resolve steps both green | Met | - |
| AC-014 | REQ-012 | Given the command routers, When `generate-command-routers.cjs --check` and the cli vitest project run, Then the check reports no drift and the typo-flags suite passes | `routers=42 clean=42 path-drift=0`. `typo-flags.vitest.ts` 34 of 34. The assets now take the contract's `create-<name>` stem. The stem table is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:665` | Met | - |

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

Every criterion is Met.
<!-- /ANCHOR:closure -->
