---
title: "Tasks: session-cleanup remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "session-cleanup remediation"
  - "session-cleanup fixes"
  - "session-cleanup bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/007-session-cleanup"
    last_updated_at: "2026-07-10T20:21:21.740Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped session-cleanup remediation; F2/O1 gated OFF by design, O3 by-design"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/session-cleanup.js"
      - ".opencode/scripts/session-cleanup.sh"
      - ".opencode/bin/check-git-hooks.sh"
      - ".opencode/bin/worktree-guard.sh"
      - ".claude/settings.json"
      - ".opencode/plugins/tests/session-cleanup.test.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: session-cleanup remediation

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
- [x] T001 Capture a green baseline of the session-cleanup test suite before any change
    - Evidence: plugin suite baseline captured before edits (plugin suite 188/189; the single fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not this subsystem).
- [x] T002 Confirm each targeted finding reproduces against current code
    - Evidence: each fix-design finding was code-verified at its cited file:line before the change (see `fix-design/fix-design.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [x] T003 [P1 (GPT P1 / Opus P2)] Claude Stop runs process cleanup after each response, not only at session teardown (`.claude/settings.json:72`)
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Claude Code has a real SessionEnd hook (fires on clear/logout/exit) — that is the true parity to OpenCode disposal. Move ONLY the process-cleanup invocation to SessionEnd; leave the per-response speckit continuity hook (session-stop.js) in Stop where it belongs.
    - IMPLEMENTED: `.claude/settings.json` now invokes `session-cleanup.sh` from a `SessionEnd` hook (settings.json:100-106), removed from `Stop`; `session-cleanup.sh` reads identity at the shared invocation point and is SessionEnd-compatible.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [ ] T004 [P1 (GPT P1 / Opus P2)] OpenCode cleanup has no OpenCode session PID and is normally a no-op (`.opencode/plugins/session-cleanup.js:54`)
    - Source: iteration-1 F2, Opus verdict: confirmed · fix-design: both models agree
    - Fix: The OpenCode plugin runs inside the OpenCode server process, which is the parent of the MCP helper children it spawns. So `process.pid` IS a valid, safe session-scoped root. Pass it explicitly via a runtime-neutral env var (see O4) that the script reads before the CLAUDE_* alias.
    - REVIEW-FLAG (correct the design before implementing): process.pid is NOT session-scoped - PluginInput is workspace/server-scoped and carries no session identity. This is the one real 'kill the wrong process' hazard. Gate behind proven ownership + dry-run staging; land O4 (neutral read-order) and O7 (blank CLAUDE_SESSION_PID) first.
    - DISPOSITION: GATED-OFF by design. Per the REVIEW-FLAG hazard, the plugin does NOT pass `process.pid` as the session root — it blanks both `SESSION_CLEANUP_PID: ''` and `CLAUDE_SESSION_PID: ''` (session-cleanup.js:158-159), so live per-session process-kill stays inactive by default until ownership is proven. The enabling infrastructure (O4 neutral read-order, O7 env sanitization) shipped; the kill itself is intentionally not armed.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [x] T005 [P1 (GPT P1 / Opus P2)] Parent-first termination can reparent nested helpers before they are killed (`.opencode/scripts/session-cleanup.sh:52`)
    - Source: iteration-1 F3, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Terminate deepest-first. Because pre-order DFS always lists a parent before its descendants, iterating the descendants array in reverse guarantees every child is signalled before its parent, eliminating the reparent-before-kill window. Keep the identity re-check.
    - IMPLEMENTED: kill loop reverses the pre-order array (`for ((i=${#descendants[@]} - 1; i >= 0; i--))`, session-cleanup.sh:167-168), signalling descendants before ancestors; the `is_descendant_of_session` identity re-check is retained.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)

### P2 - minor bugs

- [x] T006 [P2 (GPT P2 / Opus refinement)] Claimed raw lifecycle-event compatibility does not read the raw event type (`.opencode/plugins/session-cleanup.js:47`)
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: DISPUTED (GPT calls non-issue)
    - Fix: Add the raw fallback to the normalization chain.
    - REVIEW (doc-only): The plugin already uses the documented event({event}) shape; the code comment claiming raw-event compatibility is simply false. Fix = delete the false claim (no behavior change).
    - IMPLEMENTED: plugin rewritten to the canonical `dispose` lifecycle (session-cleanup.js:190) rather than guessed disposal event strings; the false raw-event compatibility claim is gone. GPT's doc-only resolution was adopted over adding speculative raw-payload code.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
- [x] T007 [P2 (GPT P2 / Opus refinement)] Subprocess failures and timeouts are silently discarded (`.opencode/plugins/session-cleanup.js:53`)
    - Source: iteration-1 F5, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Capture the result and, on failure, append a single bounded line to a plugin debug log file (never stdout/stderr — OpenCode TUI). Retain fail-open (wrap all logging in try). The script itself already logs each kill action to its own rotated log (see F9), so this only needs to catch spawn-level failures.
    - IMPLEMENTED: plugin captures subprocess output and appends a bounded, sanitized diagnostic line via `appendFileSync` inside its own try (session-cleanup.js:70-71, `boundedText` at :52); stdio stays captured, never painted to the TUI; teardown stays fail-open.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [x] T008 [P2] Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath (`.opencode/bin/check-git-hooks.sh:30`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Ask git for the real hooks directory, which honors both worktree layout and core.hooksPath.
    - IMPLEMENTED: hooks dir resolved via `git -C "$repo_root" rev-parse --git-path hooks` (check-git-hooks.sh:30), honoring linked-worktree layout and core.hooksPath, with fail-open on empty.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [x] T009 [P2 (GPT P2 / Opus refinement)] Any symlink is accepted even when broken or pointed at the wrong hook (`.opencode/bin/check-git-hooks.sh:41`)
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: For each versioned hook, verify the target is a symlink AND resolves (`-e`) AND (canonically) points at the corresponding source hook AND is executable; classify results into missing / broken / mismatched and report each bucket.
    - IMPLEMENTED: each versioned hook is now classified into missing / broken / mismatched buckets and reported per bucket (check-git-hooks.sh:68-72).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [x] T010 [P2] OpenCode has no counterpart for the Claude SessionStart safety guards (`.claude/settings.json:50`)
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add an OpenCode startup handler (in this plugin or a sibling startup plugin) that runs both guards with captured output (stdio 'pipe', never inherit → no TUI writes), then surfaces the captured stderr via experimental.chat.system.transform (system-context injection) or a bounded log file.
    - IMPLEMENTED: plugin runs both shared guards (`worktree-guard.sh`, `check-git-hooks.sh`, session-cleanup.js:32-33) at startup with captured output; warnings are bounded (`boundedText`) and routed to log/system-context, never to process stdout/stderr.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [x] T011 [P2 (GPT P2 / Opus refinement)] Session cleanup log grows without a retention bound (`.opencode/scripts/session-cleanup.sh:33`)
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Port the sweeper's rotation pattern verbatim: a LOG_MAX_BYTES config (env-overridable), an is_positive_int guard, and a rotate_log_if_needed that rolls .1/.2/.3, called at the top of emit() before appending.
    - IMPLEMENTED: `LOG_MAX_BYTES` config (session-cleanup.sh:21, env-overridable with alias + 10MB default), `is_positive_int` guard (:40), and `rotate_log_if_needed` (:44) called inside `emit()` before append (:65).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
- [ ] T012 [P2 · Opus-new] Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2) (`.opencode/scripts/session-cleanup.sh:121-124`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Two independent activation paths, chosen per runtime by what is provably safe: (a) OpenCode — supply a real session-scoped PID via process.pid (F2/O4/O7), which fully activates precise cleanup with zero cross-session risk; (b) Claude — the harness won't expose the session PID and PPID-guessing was deliberately banned (029), so the only safe activation is the orphan-ONLY sweeper. Enable it via the SessionEnd hook (from F1) exporting SPECKIT_STOP_HOOK_ORPHAN_SWEEP, starting at 'dry-run' to observe, then 'live'.
    - REVIEW-FLAG (correct the design before implementing): Keep Claude orphan sweeping in dry-run until the O3 detached-daemon-adoption survival check is proven live.
    - DISPOSITION: GATED-OFF by design. The orphan-sweep fallback code is present but defaults `off` (`ORPHAN_SWEEP_MODE="${SPECKIT_STOP_HOOK_ORPHAN_SWEEP:-off}"`, session-cleanup.sh:30) — the script default is deliberately NOT flipped. Per the REVIEW-FLAG and O3 gate, live sweeping stays disabled until the adopted/released-daemon survival check is proven; activation is scoped to an opt-in env, not global.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)

### Refinements

- [x] T013 [refinement] Tests cover only the no-PID fallback, not plugin lifecycle or process termination (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43`)
    - Source: iteration-1 F10, Opus verdict: uncertain · fix-design: both models agree
    - Fix: Add two test layers: (1) a plugin unit test with stubbed spawnSync covering wrapped/raw/non-matching events (F4), env carrying SESSION_CLEANUP_PID and blanked CLAUDE_SESSION_PID (F2/O7), and failure inspection (F5); (2) isolated shell process-tree tests using real short-lived sleep trees rooted at a synthetic SESSION_PID covering descendant collection, deepest-first order (F3), reparent skip via is_descendant_of_session, and bounded timeout/failure.
    - IMPLEMENTED: two new test layers added — plugin lifecycle/env/diagnostics unit test at `.opencode/plugins/tests/session-cleanup.test.cjs`, and real short-lived process-tree tests (descendant collection, deepest-first kill order, reparent/orphan skip-safety) at `.opencode/skills/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts`.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F10)
- [x] T014 [refinement · Opus-new] Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Prefer minimal + honest: keep the bounded synchronous spawn (teardown tolerates ≤8s and synchronous completion guarantees kills finish before the process exits) and correct the comment to 'bounded (≤8s), best-effort'. Only if teardown latency is unacceptable, switch to a detached, unref'd `spawn` with stdio 'ignore' (which would make 'never blocks' literally true but forfeits synchronous result inspection — then rely on the script's own rotated log per F9 for outcomes).
    - IMPLEMENTED: minimal + honest path taken — comment corrected to 'Best-effort and bounded: subprocesses wait at most eight seconds and hook...' (session-cleanup.js:88), matching the bounded synchronous behavior.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [ ] T015 [RECLASSIFIED: by-design] Detached daemon MCP children are structurally unreachable by the descendant walk (`.opencode/bin/mk-spec-memory-launcher.cjs:211`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. Re-election deliberately detaches shared daemons for adoption; the descendant walk is correct. Make Opus's caveat a HARD GATE: prove an adopted/released daemon is not reaped before O1 flips the orphan sweeper live.
    - DISPOSITION: BY-DESIGN, left unchecked intentionally (no code change owed). The caveat stays a hard gate on O1 going live; O1 remains gated OFF (see T012), so the gate holds.
- [x] T016 [refinement · Opus-new] OpenCode surface reuses Claude-named env and default log path (`.opencode/scripts/session-cleanup.sh:15`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Introduce runtime-neutral names read first, with the CLAUDE_* names kept as back-compat aliases; the OpenCode plugin sets the neutral vars.
    - IMPLEMENTED: neutral names read first with CLAUDE_* aliases retained — `SESSION_CLEANUP_PID` (session-cleanup.sh:19), `SESSION_CLEANUP_LOG_PATH` with neutral default (:20), `SESSION_CLEANUP_LOG_MAX_BYTES` (:21); plugin sets the neutral vars in the child env.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [x] T017 [refinement · Opus-new] OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy (`.opencode/plugins/session-cleanup.js:52`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Verify the strings against OpenCode's published event schema/constants; add a bounded, non-stdout dev-log that records the observed eventType once per session (behind SESSION_CLEANUP_DEBUG) so the real disposal event name can be confirmed empirically, then keep/adjust the matched strings.
    - REVIEW-FLAG (correct the design before implementing): Use the canonical Hooks.dispose callback (it exists in the installed API) instead of guessing global.disposed / server.instance.disposed strings.
    - IMPLEMENTED: adopted the REVIEW-FLAG resolution — cleanup now runs from the canonical, idempotent `dispose` callback (session-cleanup.js:190-192, `disposed` guard) instead of matching guessed disposal event strings.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)
- [x] T018 [refinement · Opus-new] worktree-guard only warns on main/master, missing shared-checkout sessions on other branches (`.opencode/bin/worktree-guard.sh:37`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Warn whenever the session is on a non-linked-worktree checkout regardless of branch (the early-return at sh:32-34 already excludes isolated worktrees). Provide an optional configurable allowlist for operators who intentionally run on a shared long-lived branch.
    - IMPLEMENTED: the main/master branch gate is removed — the guard now warns on any top-level shared checkout (linked worktrees still early-return at worktree-guard.sh:32-34), reporting the actual branch name in the message (:36-38); SPECKIT_WORKTREE_GUARD=off remains the opt-out.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O6)
- [x] T019 [refinement · Opus-new] spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Have the plugin set the neutral identity var explicitly AND blank the inherited CLAUDE_SESSION_PID so no leaked value is honored. Combined with O4's read-order (neutral first, then CLAUDE_* alias), this fully removes ambient-env influence.
    - IMPLEMENTED: the plugin builds an explicit child env that blanks both identity vars — `SESSION_CLEANUP_PID: ''` and `CLAUDE_SESSION_PID: ''` (session-cleanup.js:158-159) — so no leaked/foreign ambient PID can be honored via the script's fallback read-order.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O7)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Re-run the session-cleanup test suite; confirm green
    - Evidence: plugin suite 188/189 (the single fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not this subsystem); type-check 0 errors; dist rebuilt. New coverage: `.opencode/plugins/tests/session-cleanup.test.cjs` + `.opencode/skills/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts`.
- [x] T021 Verify each fixed finding no longer reproduces
    - Evidence: each shipped fix re-verified at its cited file:line (see per-task IMPLEMENTED notes); F2/O1 confirmed intentionally gated OFF, O3 confirmed by-design.
- [x] T022 Verify OpenCode<->Claude parity for this plugin
    - Evidence: shared script (`session-cleanup.sh`) drives both runtimes via neutral env names with CLAUDE_* aliases (O4); Claude runs it from `SessionEnd` (F1), OpenCode from the canonical `dispose` hook (O5); both surfaces run the same shared guards (F8).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P1 tasks `[x]` — T003 (F1), T005 (F3) shipped; T004 (F2) deferred gated-OFF by design with rationale
- [x] P2 + refinements applied or deferred with rationale — T006/T007/T008/T009/T010/T011/T014/T016/T017/T018/T019 shipped; T012 (O1) gated-OFF, T015 (O3) by-design
- [x] Plugin tests green; no `[B]` blocked tasks — plugin suite 188/189 (1 pre-existing unrelated fail); no blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/007-session-cleanup/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
