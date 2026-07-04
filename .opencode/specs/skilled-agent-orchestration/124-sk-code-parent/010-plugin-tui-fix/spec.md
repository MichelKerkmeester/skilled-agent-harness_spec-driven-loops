---
title: "Feature Specification: Phase 10 — plugin TUI-overlay fix"
description: "Stop the mk-dist-freshness-guard OpenCode plugin from writing stale-dist warnings to the terminal, where the OpenCode TUI paints them over the chat input. Rechannel the warn-only signal to bounded system-context injection plus an append-only log, keep fail-open semantics, and land the durable no-TUI-overlay rule in the sk-code OpenCode surface."
trigger_phrases:
  - "mk-dist-freshness-guard TUI overlay"
  - "opencode plugin no stdout stderr"
  - "plugin warning over chat input"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rechanneled the plugin off console.* to system-context injection + log; updated tests, docs, and the sk-code rule"
    next_safe_action: "Commit file-scoped; full Level-2 docs + strict-validate finalized in phase 014 roll-up"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-dist-freshness-guard.js"
      - ".opencode/plugins/tests/mk-dist-freshness-guard.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10 — plugin TUI-overlay fix

<!-- SPECKIT_LEVEL: 2 -->

## Overview

The `mk-dist-freshness-guard` OpenCode plugin warned about stale local `dist/`
by calling `console.warn` / `console.error`. OpenCode's TUI paints plugin
console output onto the prompt input line during `tool.execute.before`, where it
sticks until a redraw and corrupts the interactive chat input. This phase kills
that overlay while preserving the guard's warn-only, fail-open behavior.

## Problem

- `console.*` from a plugin reaches the TUI process stdout/stderr, which OpenCode
  renders over the chat input — a persistent visual corruption with no env
  kill-switch.
- The freshness signal is still valuable; it must reach the agent and the
  operator without touching the terminal.

## Goals / Non-Goals

- **Goal:** zero plugin writes to stdout/stderr; the stale-dist signal reaches
  the agent (actionable) and an audit log (durable).
- **Goal:** encode the rule durably in the sk-code OpenCode surface so future
  plugins do not reintroduce the overlay.
- **Non-Goal:** changing the freshness detection itself, the watched-package set,
  or the hard `validate.sh` backstop.

## Scope (FROZEN)

- `.opencode/plugins/mk-dist-freshness-guard.js` — rechannel.
- `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` — retarget assertions.
- `.opencode/plugins/README.md`, `.opencode/bin/README.md` §6 — channel wording.
- `sk-code` `code-implement/references/opencode/javascript/quality_standards.md` §10
  + `code-quality/assets/opencode-checklists/javascript_checklist.md` — durable rule.

## Requirements

- R1: The plugin never calls `console.warn/error/log`; the test traps console and
  asserts zero calls.
- R2: Stale dist is surfaced via `experimental.chat.system.transform` as a
  bounded `output.system` entry, and appended to
  `.opencode/logs/dist-freshness-guard.log`.
- R3: Single default export preserved; session dedupe preserved; never throws
  (fail-open) on malformed input or logging errors.
- R4: The durable "never overlay the TUI" rule lands at both router-loaded homes
  (quality standards §10 + JS checklist P0).

## Verification

- Plugin test suite green with the retargeted assertions (0 console writes, log
  deltas, transform injection).
- All 7 dist packages report fresh (no stale-warning trigger).
- Advisor CLI resolves its native dist entrypoint (no `NATIVE_DIST_MISSING`
  fallback).
- Full Level-2 doc completion + `validate.sh --strict` deferred to the phase 014
  roll-up per the program plan.
