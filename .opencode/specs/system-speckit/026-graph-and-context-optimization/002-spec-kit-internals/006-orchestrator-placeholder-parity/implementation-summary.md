---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "The canonical Node validator and the legacy shell rule now apply one placeholder-detection contract, so the orchestrator path and its fallback agree on every spec doc."
trigger_phrases:
  - "placeholder parity implementation"
  - "validatePlaceholders summary"
  - "check-placeholders mustache removed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/006-orchestrator-placeholder-parity"
    last_updated_at: "2026-05-29T12:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Aligned orchestrator + shell placeholder detection, rebuilt dist, strict-validate PASSED"
    next_safe_action: "None - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/006-orchestrator-placeholder-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-orchestrator-placeholder-parity |
| **Completed** | 2026-05-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The canonical Node validator and the legacy shell rule now read placeholders the same way. Before this change the orchestrator (the active path) missed the space-variant marker and flagged markers that lived inside code fences or inline backticks, while the shell fallback flagged mustache that the orchestrator never touched. The two paths could disagree on the very same document. They now share one contract.

### Orchestrator parity

`validatePlaceholders` in `orchestrator.ts` gained three things. It detects the space variant `[NEEDS CLARIFICATION:` alongside the existing underscore and `YOUR_VALUE_HERE` markers via a single `PLACEHOLDER_MARKER_RE` constant. It tracks fenced code blocks with an `inCode` toggle and skips any line inside a fence, matching the shell rule's awk behavior where a line starting with ``` flips the state and is itself skipped. And it skips a hit when the matched marker is immediately preceded by a backtick on that line, the same narrow escape the shell rule gets from its `grep -v` of backtick-wrapped cases.

### Shell rule parity

`check-placeholders.sh` dropped its mustache `{{...}}` pattern entirely and broadened its NEEDS_CLARIFICATION match to `\[NEEDS[_ ]CLARIFICATION:`, so it now catches both the underscore and the space variant. With mustache gone and the space variant added, the shell rule is a strict superset-parity with the orchestrator: both catch YOUR_VALUE_HERE plus NEEDS_CLARIFICATION (either spelling), neither flags mustache in a spec doc, and both keep the fence and inline-backtick exclusions.

Mustache stayed out of the orchestrator on purpose. It is not the canonical spec-doc placeholder syntax, and legit spec-doc content uses `{{...}}`, so flagging it would manufacture false positives.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified | Added space variant + fence/backtick exclusions to `validatePlaceholders` |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` | Modified (build) | Rebuilt from the .ts via `npm run build` |
| `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh` | Modified | Removed mustache pattern; broadened NEEDS_CLARIFICATION to underscore + space |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I drove the parity from the shell rule's existing behavior, which already had the fence and backtick handling, then mirrored it in TypeScript. A standalone awk/grep fixture confirmed the shell side matches only the intended lines (underscore and space markers) while dropping the backtick-escaped line, the fenced line, and the mustache line. I rebuilt the mcp_server dist with `npm run build` (no hand-edits to compiled JS) and confirmed `dist/lib/validation/orchestrator.js` carries the new regex, the `inCode` toggle, and the `charAt` backtick guard. Finally `validate.sh --strict` on this packet exercised the rebuilt orchestrator end to end.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kept mustache out of the orchestrator | `{{...}}` is not canonical spec-doc placeholder syntax and real spec-doc content uses it, so flagging it would produce false positives |
| Made the shell rule a strict superset-parity | A single broadened `\[NEEDS[_ ]CLARIFICATION:` pattern is simpler than two blocks and guarantees both paths agree |
| Used a narrow "immediately preceded by backtick" escape rule | It matches the shell rule's existing grep -v intent without masking real placeholders mid-line |
| Drove parity from the shell rule, not the reverse | The shell rule already encoded the fence/backtick behavior we wanted, so it was the reference implementation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (tsc --build + finalize-dist) | PASS, no errors |
| dist regex inspection | PASS, space-variant marker + `inCode` toggle + `charAt` guard present in compiled JS |
| Standalone awk/grep fixture | PASS, matched lines 1-2 only; dropped escaped, fenced, and mustache lines |
| `validate.sh --strict` on this packet | PASS (PLACEHOLDER_FILLED clean; exercises the rebuilt orchestrator) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Backtick escape is single-backtick, left-side only.** A marker is treated as escaped only when the character immediately before the match is a backtick, matching the shell rule. A marker wrapped only by a trailing backtick with no leading backtick is still flagged, which is the intended conservative behavior.
2. **Mustache is intentionally unguarded in spec docs.** Neither validator flags `{{...}}`. If a future template ever adopts mustache as a real unfilled-placeholder syntax, both validators would need a coordinated update.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
