---
title: "Resource Map — Session relaunch loop as shipped on main through phases 024-032 (.skilled/bin/skilled-loop, .skilled/bin/skilled-loop-shell.sh, .skilled/hooks/session-relaunch/ lib, bin, claude, codex, hermes and pi adapters, .opencode/plugins session-relaunch, .hermes/plugins/repo-guards, .skilled/commands/speckit/handoff.md, their tests, README, feature catalog and playbooks). Find remaining defects and missing test coverage in four areas: (1) goal persistence across a hop on all seven runtimes (goal_packet in note and record, SESSION_RELAUNCH_GOAL_PACKET and HERMES_SPEC_FOLDER export and restore, SESSION_RELAUNCH_GOAL=0, receiver rebind); (2) model, provider and effort persistence (launch-flag capture and replay per runtime, live values from Claude log, Codex rollout, Cursor cli-config.json, Pi arm and Hermes post_api_request, precedence, validation and drop warnings, carry to later hops, OpenCode 2 and Devin limits); (3) OpenCode 2 --standalone first launch and relaunch, --server handling; (4) operator UX and edge cases: warnings and messages, manual claim command, nested runs, hop cap, cancel and withdraw, stale or racing records, odd paths and quoting, missing binaries, concurrent sessions. Every finding must cite file:line and say whether a test covers it."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 16
- **By category**: READMEs=1, Documents=2, Commands=1, Agents=0, Skills=0, Specs=2, Scripts=5, Tests=5, Config=0, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 023-session-relaunch-loop
- **Generated**: 2026-10-25T12:04:30.077Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/session-relaunch/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skilled-loop | Cited | OK | Citations=7; Iterations=7 |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-129,374-399 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks/023-session-relaunch-loop/032-opencode2-standalone-replay/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Cited | OK | Citations=7; Iterations=7 |
| .skilled/hooks/session-relaunch/lib/withdraw.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/pi/session-relaunch.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125,2477-2516 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/hooks/session-relaunch/tests/withdraw.test.cjs | Cited | OK | Citations=1; Iterations=1 |

---
