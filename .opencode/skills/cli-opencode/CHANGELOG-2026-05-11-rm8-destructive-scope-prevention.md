---
title: 2026-05-11 — RM-8 destructive scope violation prevention
description: Adds documented root cause + four-layer prevention playbook for destructive scope violations when cli-opencode dispatches a long-running model that hallucinates a cleanup action.
date: 2026-05-11
version_bump: 1.3.0.0 -> 1.3.1.0
---

# 2026-05-11 — RM-8 destructive scope violation prevention

## Summary

Surfaces the **2026-05-04 destructive event** (44 files deleted across two phase folders) as documented operational risk for cli-opencode. Adds a new reference (`references/destructive_scope_violations.md`) covering the incident, the layered root cause (`--dangerously-skip-permissions` + instruction-only guard), and the four-layer prevention playbook (RM-8 prompt hardening + git worktree isolation + commit-before-dispatch + model-selection fallback).

Adds ALWAYS rule 13 to SKILL.md cross-linking the new reference, so dispatch authors hit the prevention contract on every deep-loop invocation.

## Files Changed

| File | Change |
|------|--------|
| `SKILL.md` | Version 1.3.0.0 → 1.3.1.0. New ALWAYS rule 13 (RM-8 four-layer mitigation). New reference link in §5. |
| `references/destructive_scope_violations.md` | NEW. Incident record + root cause + prevention playbook + checklist. |

## Why

Per `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/cross-phase-review-synthesis.md` §5/§6, the 2026-05-04 destructive event happened during a `/spec_kit:deep-review:auto` run on a phase parent with multiple children — the exact shape cli-opencode is dispatched into often. The user explicitly asked, on 2026-05-11, that the root cause and prevention be surfaced inside cli-opencode itself, not buried in a synthesis doc, so dispatch authors learn from it before they hit it again.

The runtime scope guard (the proper fix — pre-dispatch snapshot + post-dispatch diff-restore) is still future work. Until it ships, instruction-side hardening (already shipped in `010-template-levels/009-rm-8-prompt-hardening/`) + worktree isolation + commit safety net are the operational ceiling, and ALWAYS rule 13 makes that ceiling visible at the dispatch surface.

## Compatibility

No behavioral changes. Documentation-only.
