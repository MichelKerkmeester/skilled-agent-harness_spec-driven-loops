

---
title: "Orchestrator vs Shell Placeholder-Detection Parity"
description: "The canonical Node validator and the legacy shell rule now apply one placeholder-detection contract, so the orchestrator path and its fallback agree on every spec doc."
trigger_phrases:
  - "orchestrator placeholder parity"
  - "validatePlaceholders divergence"
  - "NEEDS CLARIFICATION space variant"
  - "check-placeholders mustache removed"
  - "placeholder fenced code exclusion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/006-orchestrator-placeholder-parity` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals`

### Summary

The canonical Node validator and the legacy shell rule now read placeholders the same way. Before this change the orchestrator (the active path) missed the space-variant marker and flagged markers that lived inside code fences or inline backticks, while the shell fallback flagged mustache that the orchestrator never touched. The two paths could disagree on the very same document. They now share one contract.

### Added

- `PLACEHOLDER_MARKER_RE` constant captures the space-variant `[NEEDS CLARIFICATION:` alongside underscore and `YOUR_VALUE_HERE` markers.
- `inCode` toggle tracks fenced code block boundaries and skips any line inside a fence, matching the shell rule awk behavior.
- `charAt` backtick guard skips a hit when the character immediately before the match is a backtick, matching the shell rule escape logic.

### Changed

- Removed `{{...}}` mustache pattern from `check-placeholders.sh`, broadened NEEDS_CLARIFICATION match to `\[NEEDS[_ ]CLARIFICATION:` so the shell rule catches both underscore and space variants.
- `orchestrator.ts` validatePlaceholders now applies fence and inline-backtick exclusions that the shell rule already had.

### Fixed

- Orchestrator no longer flags markers inside fenced code blocks or preceded by an inline backtick, eliminating false positives that the shell rule never flagged.
- Shell rule no longer flags mustache `{{...}}` since neither validator should treat it as a placeholder in canonical spec docs.

### Verification

- `npm run build` (tsc --build + finalize-dist) - PASS, no errors.
- `dist/lib/validation/orchestrator.js` inspection - PASS, space-variant marker, `inCode` toggle, and `charAt` backtick guard present in compiled JS.
- Standalone awk/grep fixture - PASS, matched lines 1-2 only, dropped escaped, fenced, and mustache lines.
- `validate.sh --strict` on this packet - PASS (PLACEHOLDER_FILLED clean, exercises the rebuilt orchestrator).

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified | Added space-variant detection, fence toggle, and backtick escape guard to validatePlaceholders |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` | Modified (build) | Rebuilt from source via `npm run build` |
| `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh` | Modified | Removed mustache pattern, broadened NEEDS_CLARIFICATION to cover underscore and space variants |

### Follow-Ups

- Backtick escape is single-backtick, left-side only. A marker is treated as escaped only when the character immediately before the match is a backtick, matching the shell rule. A marker wrapped only by a trailing backtick with no leading backtick is still flagged, which is the intended conservative behavior.
- Mustache `{{...}}` is intentionally unguarded in spec docs. Neither validator flags it. If a future template ever adopts mustache as a real unfilled-placeholder syntax, both validators would need a coordinated update.
