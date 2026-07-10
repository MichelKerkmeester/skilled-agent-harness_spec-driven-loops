---
title: "Tasks: mk-deep-loop-guard remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-deep-loop-guard remediation"
  - "mk-deep-loop-guard fixes"
  - "mk-deep-loop-guard bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/005-mk-deep-loop-guard"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 13 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-deep-loop-guard remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the mk-deep-loop-guard test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1] Duplicate agent entries overwrite valid workflow modes (`.opencode/plugins/mk-deep-loop-guard.js:80`)
    - Source: iteration-1 F1, Opus verdict: confirmed
    - Fix: Map each agent to a Set or array of permitted workflowMode values and reject only when the declared mode is absent from that set.
- [ ] T004 [P1 (GPT P1 / Opus P2)] Loop counting does not establish that orchestrate originated the dispatch (`.opencode/plugins/mk-deep-loop-guard.js:399`)
    - Source: iteration-1 F2, Opus verdict: adjusted
    - Fix: Require a durable dispatch-origin field before applying orchestrate repeat counting. At minimum, remove prompt-improver from this deep-loop set unless its owning command emits an independently verifiable exemption marker.
- [ ] T005 [P1 (GPT P1 / Opus refinement)] Reject modes silently fail open when guard dependencies fail (`.opencode/plugins/mk-deep-loop-guard.js:75`)
    - Source: iteration-1 F3, Opus verdict: adjusted
    - Fix: Keep default warning mode fail-open, but fail closed when the applicable reject variable is enabled. Make state persistence return success/failure so reject-loop mode can throw a clearly identified guard-unavailable error.
- [ ] T006 [P1 (GPT P1 / Opus P2)] Warning log can grow without bound and is not rotated by the startup sweep (`.opencode/plugins/mk-deep-loop-guard.js:218`)
    - Source: iteration-1 F4, Opus verdict: confirmed
    - Fix: Invoke warning-log maintenance from the session.created sweep and add size-based rotation or bounded line retention independent of mtime.
- [ ] T007 [P1 (GPT P1 / Opus P2)] Loose iteration markers allow repeat-guard bypass (`.opencode/plugins/mk-deep-loop-guard.js:66`)
    - Source: iteration-1 F5, Opus verdict: confirmed
    - Fix: Parse the exact generated state-summary envelope and require its mode to agree with the resolved target. Prefer a dedicated machine marker over natural-language substring detection.
- [ ] T008 [P1 (GPT P1 / Opus P2)] Claude Code has no Task-dispatch guard counterpart (`.claude/settings.json:14`)
    - Source: iteration-1 F7, Opus verdict: confirmed
    - Fix: Add a Claude PreToolUse Task hook backed by shared parsing and policy logic. Adapt only the hook input/output transport; keep registry resolution, thresholds, exemptions, and reject behavior shared.

### P2 - minor bugs

- [ ] T009 [P2] Sweep synchronization assumes a single process (`.opencode/plugins/mk-deep-loop-guard.js:294`)
    - Source: iteration-1 F6, Opus verdict: confirmed
    - Fix: Use a project-scoped sweep lock and per-session mutation lock, or rework archival around an atomic claim/CAS protocol that cannot move a file changed after eligibility was measured.
- [ ] T010 [P2] Case-insensitive mode extraction is followed by case-sensitive comparison (`.opencode/plugins/mk-deep-loop-guard.js:89`)
    - Source: iteration-1 F8, Opus verdict: confirmed
    - Fix: Normalize the captured mode to lowercase before comparison, or compare canonicalized values on both sides.
- [ ] T011 [P2 · Opus-new] Uppercase target-agent name silently bypasses BOTH guards (`.opencode/plugins/mk-deep-loop-guard.js:122`)
    - Source: Opus iteration-2 (new)
    - Fix: Lowercase the resolved identity (and the declared mode) at the boundary, e.g. return match[1].toLowerCase() in resolveTargetIdentity and declaredModeFromPrompt.
- [ ] T012 [P2 · Opus-new] declaredModeFromPrompt matches the FIRST 'mode=' token anywhere, not the target-intended mode (`.opencode/plugins/mk-deep-loop-guard.js:90`)
    - Source: Opus iteration-2 (new)
    - Fix: Anchor extraction to the Deep Route header envelope (parse the 'Deep Route:' line specifically) or require a dedicated machine marker, rather than a free-floating substring.
- [ ] T013 [P2 · Opus-new] Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard (`.opencode/plugins/mk-deep-loop-guard.js:377`)
    - Source: Opus iteration-2 (new)
    - Fix: Normalize tool name case-insensitively and probe multiple session-id field paths (input.sessionID ?? input.session?.id), and add a fixture mirroring a captured real OpenCode tool.execute.before payload.

### Refinements

- [ ] T014 [refinement] Fixture registry omits the production registry's multiplexed-agent shape (`.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24`)
    - Source: iteration-1 F9, Opus verdict: confirmed
    - Fix: Add duplicate-agent fixture entries and table-driven assertions for every valid deep-improvement mode, near-miss iteration text, bounded warning-log rotation, and cross-process or lock-simulation sweep behavior.
- [ ] T015 [refinement · Opus-new] Orphaned atomic-write temp files are never pruned by the sweep (`.opencode/plugins/mk-deep-loop-guard.js:163`)
    - Source: Opus iteration-2 (new)
    - Fix: Have the sweep also unlink stale `*.tmp` files older than the active-retention window.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T016 Re-run the mk-deep-loop-guard test suite; confirm green
- [ ] T017 Verify each fixed finding no longer reproduces
- [ ] T018 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/005-mk-deep-loop-guard/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
