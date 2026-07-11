---
title: "Implementation Summary [005-mk-deep-loop-guard]"
description: "Shipped the mk-deep-loop-guard remediation: extracted a runtime-agnostic dispatch-guard core, refactored the OpenCode plugin to a thin adapter, and added a Claude PreToolUse Task hook for cross-runtime parity."
trigger_phrases:
  - "mk-deep-loop-guard remediation"
  - "deep-loop dispatch guard"
  - "implementation summary"
  - "claude task dispatch guard hook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/005-mk-deep-loop-guard"
    last_updated_at: "2026-07-10T20:20:12.878Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped F7 guard-core extraction + Claude Task hook and reconciled F1-F6/F8/F9/O1-O4"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs"
      - ".opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs"
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-mk-deep-loop-guard |
| **Completed** | 2026-07-10 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop dispatch guard is now cross-runtime and its accumulated Check-logic bugs are fixed. F7 was the structural change: the guard's parsing and policy core was extracted out of the OpenCode plugin into a runtime-agnostic shared module (`dispatch-guard.cjs`), the OpenCode plugin was refactored down to a thin default-export-only adapter over that core, and a new Claude PreToolUse Task hook (`task-dispatch-guard.cjs`) was added — wired into `.claude/settings.json` via a `Task` matcher — so Claude Code now performs the same mode-mismatch and loop-repeat guarding OpenCode already did. Because both surfaces consume one shared policy core, the earlier Check-logic fixes (F1-F6, F8, F9, O1, O2, O4) live in exactly one place and both runtimes inherit them. O3 was reclassified a non-issue by a 4-model review (the installed SDK types `tool.execute.before` as exactly `{tool, sessionID, callID}`), so it carries no code change.

The Check-logic fixes landed in the shared core: set-based many-modes-per-agent registry indexing (F1); origin-neutral loop-repeat messaging with `prompt-improver` dropped from the executor set (F2); a "reject-mode degraded" audit line making the fail-open path observable instead of silent (F3); byte-cap warning-log rotation plus `session.created` log maintenance (F4); line-anchored, bounds-validated iteration-marker parsing (F5); an mkdir-based cross-process sweep lock with pre-rename re-stat (F6); lowercase-at-boundary normalization for declared mode and resolved target identity (F8, O1); Deep-Route-envelope-anchored mode extraction (O2); and stale `*.tmp` orphan pruning in the sweep (O4). Test fixtures were extended to the production multiplexed-agent shape with table-driven assertions, mirrored across the OpenCode and Claude test files (F9).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` | Created | Runtime-agnostic guard parsing + policy core (all Check-logic fixes) |
| `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | Created | Claude PreToolUse Task hook adapting Claude stdin/stdout to the shared core |
| `.opencode/plugins/mk-deep-loop-guard.js` | Modified | Refactored to a thin default-export-only OpenCode adapter over the shared core |
| `.claude/settings.json` | Modified | Registered the PreToolUse `Task` matcher (outside this spec folder; not edited by this metadata packet) |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modified | Extended fixtures + table-driven assertions for the landed fixes |
| `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` | Created | Mirrored Claude-hook contract test |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Check-logic fixes landed first, directly in the shared `dispatch-guard.cjs` core, so the extraction step (F7) picked up already-fixed logic instead of porting the old bugs into a second surface. The OpenCode plugin was then thinned to a default-export-only adapter over that core, and the Claude PreToolUse Task hook was added as a second adapter and wired into `.claude/settings.json`. Confidence comes from the mirrored test files: the OpenCode suite and the new Claude-hook contract test both exercise the landed fixes against the production multiplexed-agent registry shape, the plugin suite runs 188/189 (the single failure is the unrelated pre-existing mk-goal path artifact), the type-check reports 0 errors, and the dist bundle was rebuilt after the refactor.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Extract the guard core rather than duplicate logic into a Claude hook | One shared policy module means both runtimes inherit the F1-F9/O1-O4 fixes; porting the pre-fix logic into a second surface would have reintroduced known bugs. |
| Land F7 last, after the Check-logic fixes | The extracted core had to already contain the fixes so the new Claude hook inherited fixed logic, per both models' ordering guidance. |
| Keep fail-open on degraded dependencies, add an audit line only (F3) | Failing closed regresses two pinned tests and its blast radius (blocking every dispatch when infra files are missing) is unacceptable; the only real defect was silence. |
| No code change for O3 | 4-model review confirmed the installed SDK payload shape matches the guard's field accesses; speculative field fallbacks would conceal a contract break rather than fix a defect. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Plugin test suite | Pass | 188/189; the single failure is the pre-existing mk-goal-tool-path deep-loops path artifact, not a regression from this work |
| Type-check | Pass | 0 errors |
| Dist build | Pass | dist rebuilt after the refactor |
| Cross-runtime parity | Pass | OpenCode plugin adapter and Claude PreToolUse Task hook consume the same `dispatch-guard.cjs` policy core |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One pre-existing test failure remains** — 188/189. The failing case is the mk-goal-tool-path deep-loops path artifact, unrelated to the dispatch guard and not introduced by this packet.
2. **O3 (T013) carries no code change** — reclassified a non-issue against the installed `@opencode-ai/plugin` SDK contract; a real host contract break on `tool.execute.before` would need a fresh evaluation.
3. **Producer-side envelope adoption is not owned here** — F2/F5/O2 tighten the guard's parsing; the fuller "versioned dispatch envelope" both models sketched for the orchestrate/command producers is a separate, out-of-packet concern.

<!-- /ANCHOR:limitations -->
