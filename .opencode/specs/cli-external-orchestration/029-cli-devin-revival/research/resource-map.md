---
title: "Resource Map — What further hook refinements, upgrades, or additions should the cli-devin and cli-cursor CLI hook adapter layers get, now that Devin's hooks are confirmed to fire live (corrected .devin/hooks.v1.json nested schema -- no top-level version/hooks wrapper, each event is an array of {matcher, hooks:[{type,command,timeout}]} -- 6 of 8 lifecycle events observed firing with real payloads: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SessionEnd; PermissionRequest and PostCompaction did not occur in that session) and Cursor's hook layer is independently built and wired via .cursor/hooks.json? Investigate: (1) coverage gaps against the full Claude/Codex hook inventory for both runtimes; (2) hardening opportunities now that live Devin payloads are observable -- e.g. whether the previously-tolerant field-name fallbacks in task-dispatch-guard.cjs/spec-gate-enforce.mjs/mcp-route-guard.cjs (written when tool_input shapes were unconfirmed) can now be tightened to the confirmed real shapes without losing safety; (3) whether PermissionRequest and PostCompaction not firing in the one observed session is expected (event genuinely didn't occur) or worth a further live-verification pass, and how to design that follow-up test; (4) mcp-route-guard.cjs's dormancy status for both Devin and Cursor now that MCP servers may be independently registrable per-runtime; (5) any Devin or Cursor CLI feature shipped since the original research (docs.devin.ai, docs.cursor.com or equivalent) that these two packets haven't accounted for yet; (6) concrete opportunities to reduce duplication between the two packets' hook adapters now that both are structurally very similar (same 4-runtime hook-directory pattern, same fail-open contract, same guard-core wrapping). Ground every finding in the CURRENT on-disk state of both packets (read .opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md, and the equivalent Cursor packet docs under .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/ and 010-hook-code-style-cross-runtime/) rather than re-deriving already-settled facts from scratch. The Cursor packet was JUST reorganized (phases 009-015 consolidated into a 009-cursor-hooks-lifecycle/ phase-parent with 6 children, 016-018 renumbered to 011-013) -- use the current folder structure, not any older numbering."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 0
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 029-cli-devin-revival
- **Generated**: 2026-07-27T04:40:35.501Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.
