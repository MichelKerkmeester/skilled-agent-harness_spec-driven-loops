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
    last_updated_at: "2026-07-10T20:20:12.878Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped F7 guard-core extraction + Claude Task hook; reconciled F1-F9/O1-O4"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
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
- [x] T001 Capture a green baseline of the mk-deep-loop-guard test suite before any change (baseline captured against `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`)
- [x] T002 Confirm each targeted finding reproduces against current code (F1-F9, O1-O4 confirmed via code re-reads in `fix-design/fix-design.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [x] T003 [P1] Duplicate agent entries overwrite valid workflow modes (`.opencode/plugins/mk-deep-loop-guard.js:80`)
    - Source: iteration-1 F1, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Map each agent to the SET of its permitted workflowModes instead of a single mode object. Mismatch only when a declared mode is absent from that agent's permitted set.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
    - Evidence: set-based registry index landed in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` (loadRegistryAgents → agent-to-workflowModes Set; Check 1 uses set membership)
- [x] T004 [P1 (GPT P1 / Opus P2)] Loop counting does not establish that orchestrate originated the dispatch (`.opencode/plugins/mk-deep-loop-guard.js:399`)
    - Source: iteration-1 F2, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Do not fabricate an origin check the runtime can't support. Instead: (a) remove prompt-improver from the executor set; (b) reword the detail message so it states the observed fact (N non-command-driven hand-offs to a command-owned executor in this session) rather than asserting an unverified orchestrate origin.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
    - Evidence: prompt-improver dropped from LOOP_EXECUTOR_AGENTS and origin-neutral loop-repeat message in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T005 [P1 (GPT P1 / Opus refinement)] Reject modes silently fail open when guard dependencies fail (`.opencode/plugins/mk-deep-loop-guard.js:75`)
    - Source: iteration-1 F3, Opus verdict: adjusted · fix-design: DISPUTED (Opus calls non-issue)
    - Fix: Keep fail-open (it is correct and test-pinned). Make it observable, not silent: when a reject env var is active AND a guard dependency failed (registry unreadable, or state write failed), emit one warning-log line recording that reject enforcement was skipped due to the degraded dependency.
    - REVIEW (operator-decision): Do NOT fail-closed (regresses 2 pinned tests and needs an F2/F5 envelope that does not exist). Consensus: keep fail-open + a 'reject-mode degraded' audit line only. Final semantics is an operator decision.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)
    - Evidence: fail-open preserved; 'reject-mode degraded' audit log line on degraded dependency added in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T006 [P1 (GPT P1 / Opus P2)] Warning log can grow without bound and is not rotated by the startup sweep (`.opencode/plugins/mk-deep-loop-guard.js:218`)
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add size-based rotation independent of mtime, and run log maintenance from the session.created sweep. Rotate a single generation when the file exceeds a byte cap.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
    - Evidence: byte-cap rotation + session.created log maintenance added in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T007 [P1 (GPT P1 / Opus P2)] Loose iteration markers allow repeat-guard bypass (`.opencode/plugins/mk-deep-loop-guard.js:66`)
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Prefer a dedicated, hard-to-forge machine marker over natural-language substring detection; at minimum line-anchor both alternatives and validate iteration bounds. Because command-driven status depends on what the deep command actually renders, verify the real emitted marker before tightening.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
    - Evidence: line-anchored, bounds-validated iteration marker parsing landed in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T008 [P1 (GPT P1 / Opus P2)] Claude Code has no Task-dispatch guard counterpart (`.claude/settings.json:14`)
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Extract the guard's parsing + policy core into a runtime-agnostic shared module, then add a thin Claude PreToolUse Task hook that adapts only Claude's stdin/stdout transport. Keep registry resolution, thresholds, exemptions, warning log, and reject behavior identical.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
    - Evidence: policy core extracted to `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`; OpenCode plugin refactored to thin default-export adapter (`.opencode/plugins/mk-deep-loop-guard.js`); new Claude PreToolUse Task hook `.opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` + `.claude/settings.json` Task matcher; mirrored test `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs`

### P2 - minor bugs

- [x] T009 [P2] Sweep synchronization assumes a single process (`.opencode/plugins/mk-deep-loop-guard.js:294`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Prevent concurrent sweeps with an atomic cross-process lock (mkdir is atomic on POSIX), and shrink the live-session archival window by re-stat'ing immediately before rename. Accept the residual micro-race given the advisory nature.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
    - Evidence: mkdir-based cross-process sweep lock + pre-rename re-stat added in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T010 [P2] Case-insensitive mode extraction is followed by case-sensitive comparison (`.opencode/plugins/mk-deep-loop-guard.js:89`)
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Normalize the captured mode to lowercase at the boundary so comparison is canonical on both sides.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
    - Evidence: declared mode lowercased at the parser boundary in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T011 [P2 · Opus-new] Uppercase target-agent name silently bypasses BOTH guards (`.opencode/plugins/mk-deep-loop-guard.js:122`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Lowercase the resolved identity at the boundary in resolveTargetIdentity so all downstream case-sensitive lookups match.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
    - Evidence: resolveTargetIdentity lowercases every resolved identity in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [x] T012 [P2 · Opus-new] declaredModeFromPrompt matches the FIRST 'mode=' token anywhere, not the target-intended mode (`.opencode/plugins/mk-deep-loop-guard.js:90`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Anchor mode extraction to the Deep Route header envelope rather than a free-floating substring, so it reads the mode paired with the resolved target.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
    - Evidence: mode extraction anchored to the Deep Route header envelope (with bare-token fallback) in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`
- [ ] T013 [RECLASSIFIED: non-issue] Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard (`.opencode/plugins/mk-deep-loop-guard.js:377`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. SDK types tool.execute.before as exactly {tool,sessionID,callID}; the guard demonstrably fires in production. Optional harmless extras: lowercase tool-normalize + one SDK-shape contract fixture. No speculative id fallbacks.

### Refinements

- [x] T014 [refinement] Fixture registry omits the production registry's multiplexed-agent shape (`.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24`)
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Extend the fixture to include a multiplexed agent and add table-driven assertions covering every fix landed here.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
    - Evidence: fixture + table-driven assertions extended in `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` and mirrored in `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs`
- [x] T015 [refinement · Opus-new] Orphaned atomic-write temp files are never pruned by the sweep (`.opencode/plugins/mk-deep-loop-guard.js:163`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Have the sweep also unlink stale `*.tmp` files older than the active-retention window, in the same pass that archives stale state.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
    - Evidence: sweep now unlinks stale `*.tmp` files past the active-retention window in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T016 Re-run the mk-deep-loop-guard test suite; confirm green (plugin suite 188/189; the 1 fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not a regression)
- [x] T017 Verify each fixed finding no longer reproduces (table-driven assertions in the mirrored test files exercise each landed fix)
- [x] T018 Verify OpenCode<->Claude parity for this plugin (shared policy core consumed by both the OpenCode plugin adapter and the Claude PreToolUse Task hook; type-check 0 errors; dist rebuilt)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P1 tasks `[x]` (T003-T008 shipped)
- [x] P2 + refinements applied or deferred with rationale (T009-T012, T014-T015 shipped; T013/O3 reclassified non-issue, no code change)
- [x] Plugin tests green; no `[B]` blocked tasks (188/189; the 1 fail is a pre-existing unrelated mk-goal path artifact)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/005-mk-deep-loop-guard/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
