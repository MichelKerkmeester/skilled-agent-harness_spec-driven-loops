---
title: "Implementation Summary: Router Consistency Hardening [template:examples/level_1/implementation-summary.md]"
description: "Delivery evidence for qualifying bare MCP tool names across 7 routers and correcting the sk-doc command_template router standard."
trigger_phrases:
  - "router consistency hardening summary"
  - "qualify allowed-tools summary"
  - "command template accuracy summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening"
    last_updated_at: "2026-06-12T14:15:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Committed 0c6c2bf897; render re-test 4/4 PASS under --command"
    next_safe_action: "None; phase complete"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `008-router-consistency-hardening` |
| **Completed** | 2026-06-12 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Completed the #44 tool-naming normalization across the command tree and corrected the sk-doc command standard so it matches shipped reality. Finding A: seven routers still carried bare or mixed MCP names in `allowed-tools` (the same defect #44 fixed in `resume.md`/`search.md`); they are now fully qualified to `mcp__<server>__<tool>`. Finding B: `command_template.md` §11 had claimed all five split families share one six-section shape and own `_auto`/`_confirm` YAML — false for the YAML-less `memory` and `doctor` families — so it now describes the common core, the workflow-backed subset, the direct-router exception, and the `mcp__` `allowed-tools` rule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/ask-ai-council.md` | Modified | Qualify 4 bare MCP names |
| `.opencode/commands/deep/start-context-loop.md` | Modified | Qualify 4 bare MCP names |
| `.opencode/commands/deep/start-research-loop.md` | Modified | Qualify 4 bare MCP names |
| `.opencode/commands/deep/start-review-loop.md` | Modified | Qualify 4 bare MCP names |
| `.opencode/commands/speckit/complete.md` | Modified | Qualify bare `memory_context` |
| `.opencode/commands/speckit/implement.md` | Modified | Qualify bare `memory_context`, `memory_search` |
| `.opencode/commands/speckit/plan.md` | Modified | Qualify bare `memory_context`, `memory_search` |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modified | §11 accuracy: two router variants + `mcp__` rule |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each router's `allowed-tools` line was edited in place to prefix `memory_*`/`code_graph_*` with the documented `mcp__mk_spec_memory__` / `mcp__mk_code_index__` namespaces; only that one frontmatter line changed per file, leaving the body prose (which legitimately uses bare tool IDs as call syntax) untouched. The §11 rewrite split the prose into a common-core block, a workflow-backed-families block, and a reference-shape paragraph that names the direct-router exception. The canonical direction was verified against `opencode.json` (which documents the `mcp__<server>__*` namespace) and the #44 commit before applying.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Qualify to `mcp__<server>__<tool>` (not strip to bare) | Matches the `opencode.json` namespace, the #44 decision, and the already-qualified majority of routers; works under both runtimes |
| Frontmatter-only; leave body prose bare IDs | Body bare IDs are intentional, stable call-syntax; changing them risks behavior and is unnecessary |
| Fix the template to describe two variants, not re-section routers | The families' adapted shapes are valid; documenting reality is the minimal correct fix, re-sectioning 26 routers is out of scope |
| Defer the `start-skill-benchmark-loop` frontmatter nit | Its `skill:`-vs-`allowed-tools` issue is a separate P3; out of this scope |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Bare-name scan | Pass | Zero bare MCP names in any router `allowed-tools` after the edits |
| Reference integrity | Pass | Referenced vs on-disk `_presentation.txt` unchanged at 24/24, zero orphans |
| Body prose unchanged | Pass | Per-file diffs limited to the `allowed-tools` line |
| `validate.sh --strict` | Pass | This folder: 0 errors / 0 warnings |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Section-header style still varies across families (numbered vs un-numbered, Title Case vs ALL-CAPS). This is now documented as acceptable variation in §11 rather than normalized; full re-sectioning is deliberately out of scope.
2. The `start-skill-benchmark-loop` command still declares `skill:` with no `allowed-tools`; left as a deferred P3 consistency nit.

<!-- /ANCHOR:limitations -->
