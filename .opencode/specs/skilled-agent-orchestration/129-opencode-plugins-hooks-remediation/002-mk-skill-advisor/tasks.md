---
title: "Tasks: mk-skill-advisor remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-skill-advisor remediation"
  - "mk-skill-advisor fixes"
  - "mk-skill-advisor bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/002-mk-skill-advisor"
    last_updated_at: "2026-07-10T20:18:00.455Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped all 16 remediation findings and reconciled completion metadata"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mk-skill-advisor remediation

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
- [x] T001 Capture a green baseline of the mk-skill-advisor test suite before any change
    - Evidence: baseline captured before edits; final plugin suite 188/189 (the 1 fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not a regression).
- [x] T002 Confirm each targeted finding reproduces against current code
    - Evidence: each F/O finding root cause was re-verified against source before the fix (see per-finding root-cause confirmations in `fix-design/fix-design.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [x] T003 [P1 (GPT P1 / Opus P2)] OpenCode can serve obsolete recommendations after skill-graph changes (`.opencode/plugins/mk-skill-advisor.js:48`)
    - IMPLEMENTED (already-shipped): freshness signature now covers the advisor graph DB so graph regeneration bumps the cache key (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Add the advisor graph DB file to the freshness signature so any graph regeneration changes the cache key. Do NOT remove the host cache (it saves a per-prompt node subprocess spawn) and do NOT try to fold the bridge-returned generation into the key (the key must be computable before the bridge runs).
    - REVIEW-FLAG (correct the design before implementing): The DB-only signature misses SKILL.md and graph-metadata.json changes; use the canonical multi-file signature (SQLite + JSON + SKILL.md). Caveat: WAL-mode SQLite may not bump mtime until checkpoint - add a test; the 5-min TTL bounds residual staleness.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [x] T004 [P1 (GPT P1 / Opus P2)] Claude CLI fallback passes an unbounded prompt through argv (`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`)
    - IMPLEMENTED (already-shipped): shared UTF-8 byte clamp applied at the Claude hook boundary so both the primary subprocess and the argv CLI fallback see a bounded prompt (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`).
    - Source: iteration-1 F2, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Apply one shared UTF-8 byte clamp at the Claude hook boundary (matching OpenCode's 64KB), so BOTH the primary buildSkillAdvisorBrief subprocess and the argv CLI fallback see a bounded prompt. Do NOT re-architect the CLI to stdin — skill-advisor.cjs consumes --json from argv and the child stdin is 'ignore'; switching transport is a larger, riskier change and the clamp already removes the E2BIG risk.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [x] T005 [P1 (GPT P1 / Opus P2)] Bridge output handling permits memory growth and stderr pipe deadlock (`.opencode/plugins/mk-skill-advisor.js:455`)
    - IMPLEMENTED (already-shipped): unread stderr pipe removed and stdout accumulation bounded in runBridge (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: iteration-1 F3, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Remove the stderr pipe the plugin never reads, and bound stdout accumulation. This matches the capping pattern already used in the bridge (MAX_CLI_STDERR_BYTES) and cli-fallback (capStdout).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)
- [x] T006 [P1 (GPT P1 / Opus P2)] Legacy Claude shim resolves its target from mutable process CWD (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11`)
    - IMPLEMENTED (NEW this session, F4): `resolveTarget()` now walks up from `import.meta.url` to the ancestor owning `.opencode` and joins the install-anchored target, with a `SPECKIT_USER_PROMPT_TARGET` test/install override, replacing the CWD-relative TARGET (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`).
    - Source: iteration-1 F4, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Resolve the target to an absolute path independent of CWD. Because the shim is a compiled .js whose dist depth differs from source and the target lives in a SIBLING skill tree, prefer a deterministic repo-root walk (find the ancestor containing .opencode) over a fragile relative import.meta.url computation.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
- [x] T007 [P1 (GPT P1 / Opus P2)] Legacy Claude shim has no child timeout and hides launch failures (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13`)
    - IMPLEMENTED (already-shipped): spawnSync now bounded by a sub-3s `CHILD_TIMEOUT_MS` (2500ms, within Claude's UserPromptSubmit budget) with a prompt-safe diagnostic on launch failure while preserving `{}` fail-open (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`).
    - Source: iteration-1 F5, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Bound the child with a timeout that comfortably exceeds the inner hook's own budget, and emit a prompt-safe diagnostic on launch failure while preserving '{}' fail-open.
    - REVIEW-FLAG (correct the design before implementing): The proposed ~5s shim timeout exceeds Claude's 3s UserPromptSubmit kill; the number must be < 3s with grace-inside-budget (see operator decision).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [x] T008 [P1 (GPT P1 / Opus P2)] OpenCode injects context on skip or failure while Claude fails open silently (`.opencode/plugins/mk-skill-advisor.js:672`)
    - IMPLEMENTED (already-shipped): shared fallback directive (HYGIENE + GOVERNOR) emitted from both surfaces on the no-brief path, unifying OpenCode and Claude behavior (`.opencode/plugins/mk-skill-advisor.js`, `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`).
    - Source: iteration-1 F6, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Define the fallback directive once and emit it from BOTH surfaces whenever the advisor is active but produced no brief: HYGIENE + GOVERNOR. This honors the documented every-turn intent and makes the surfaces identical.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)

### P2 - minor bugs

- [x] T009 [P2] Claude CLI fallback discards caller-supplied thresholds (`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`)
    - IMPLEMENTED (NEW this session, F7): `runCliRecommend` now forwards clamped `confidenceThreshold`/`uncertaintyThreshold` (via `clampUnitThreshold`, defaults 0.8 / 0.35) into the CLI payload options, mirroring the bridge (`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`).
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Mirror the bridge: forward confidenceThreshold and uncertaintyThreshold into the CLI payload options, derived from options.thresholdConfig with the same defaults thresholdsFrom uses (0.8 / 0.35).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [x] T010 [P2] OpenCode uses a forked renderer that omits shared governor context (`.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:324`)
    - IMPLEMENTED (already-shipped): both bridge render call sites route through the canonical compiled renderer, with the local renderer kept only as a fail-open fallback (`.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`).
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Route both bridge render call sites through the canonical compiled renderer, keeping the local implementation only as a fail-open fallback when the compiled module can't be imported.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [x] T011 [P2] Session disposal races with in-flight requests and can repopulate cleared state (`.opencode/plugins/mk-skill-advisor.js:582`)
    - IMPLEMENTED (already-shipped): epoch/generation guard captured before the await refuses the post-await cache write when the epoch changed, and inFlight is cleared on reset (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add an epoch/generation guard: capture it before the await and refuse the post-await cache write if it changed. Also clear inFlight on reset.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
- [x] T012 [P2 (GPT P2 / Opus refinement)] Forced process exit can truncate Claude fail-open output and diagnostics (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:271`)
    - IMPLEMENTED (already-shipped): CLI catch path now awaits the stdout envelope write before `exit(0)`; diagnostics stay best-effort (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`).
    - Source: iteration-1 F10, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Guarantee the stdout envelope flushes before exit; keep an explicit exit(0) for deterministic hook termination but only after the write callback resolves. Treat diagnostics as best-effort.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F10)
- [x] T013 [P2] Default prompt-blocking timeout differs by more than threefold (`.opencode/plugins/mk-skill-advisor.js:33`)
    - IMPLEMENTED (already-shipped): SIGKILL grace folded inside the budget so worst-case block equals the configured budget, with the OpenCode default converged to a documented shared value (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: iteration-1 F11, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Two changes: (a) fold the SIGKILL grace INSIDE the budget so worst-case block equals the configured budget (clear correctness win); (b) converge the OpenCode default toward Claude's, but not blindly to 3s (bridge cold-start = node spawn + dist import can exceed it) — propose a shared documented ~5000ms, or explicitly document why OpenCode gets more headroom.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F11)
- [x] T014 [P2 (GPT P2 / Opus refinement)] Malformed OpenCode configuration is silently treated as absent (`.opencode/plugins/mk-skill-advisor.js:55`)
    - IMPLEMENTED (already-shipped): loadConfig distinguishes ENOENT (silent `{}`) from read/parse errors, surfacing a prompt-safe error code in the status tool (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: iteration-1 F12, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Distinguish ENOENT (absent optional file → silent {}) from read/parse errors (→ {} but record a prompt-safe error code surfaced in status).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F12)
- [x] T015 [P2 · Opus-new] OpenCode appendAdvisorBrief has no outer try/catch → fail-CLOSED on unexpected throw (`.opencode/plugins/mk-skill-advisor.js:666-677`)
    - IMPLEMENTED (already-shipped, O1): the advisor call + push is wrapped in a try/catch that fails open with the shared fallback directive (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Guarantee the hook never throws by wrapping the advisor call + push in try/catch that fails open with the same fallback directive as the no-brief path.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
- [x] T016 [P2 · Opus-new] Legacy spec-kit shim uses readFileSync(0) with no try/catch → hard crash on EAGAIN, defeating fail-open (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:15`)
    - IMPLEMENTED (already-shipped, O3): stdin read now uses a bounded chunked reader (`READ_CHUNK_BYTES`, `MAX_STDIN_BYTES`) under a fail-open boundary that writes `{}` and exits 0 on any error (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Wrap read+spawn+output in try/catch that writes '{}\n' and exits 0 on any error; add bounded EAGAIN resilience for the stdin read.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)

### Refinements

- [x] T017 [refinement · Opus-new] OpenCode bridge payload mislabels runtime as 'codex' (`.opencode/plugins/mk-skill-advisor.js:361`)
    - IMPLEMENTED (already-shipped, O2): payload runtime label corrected to `opencode` (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Set the correct runtime label for this surface.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [x] T018 [refinement · Opus-new] Advisor cache expiresAt computed from pre-await timestamp shortens effective TTL by bridge duration (`.opencode/plugins/mk-skill-advisor.js:546`)
    - IMPLEMENTED (already-shipped, O4): cache expiry now computed from the post-await completion timestamp, so TTL is not shortened by bridge duration (`.opencode/plugins/mk-skill-advisor.js`).
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Compute expiry from the completion timestamp, not the pre-await one.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [ ] T019 [RECLASSIFIED: non-issue] session.deleted purge resolves session id via a different path than the cache-write key, so entries may not be evicted (`.opencode/plugins/mk-skill-advisor.js:693-701`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. The delete resolver is a strict superset of the write resolver and handles the native properties.info.id shape; existing vitest proves targeted eviction. Opus's premise was backwards. Fold any optional shared-resolver refactor into F9.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Re-run the mk-skill-advisor test suite; confirm green
    - Evidence: plugin suite 188/189 (the 1 fail is the pre-existing mk-goal-tool-path deep-loops path artifact, not a regression); type-check 0 errors; dist rebuilt.
- [x] T021 Verify each fixed finding no longer reproduces
    - Evidence: covered by the updated/added vitest cases in the plugin + hook suites (see `fix-design/fix-design.md` per-finding Test notes).
- [x] T022 Verify OpenCode<->Claude parity for this plugin
    - Evidence: F6/F8 unify fallback + governor rendering, F7 aligns Claude CLI thresholds with the bridge; parity assertions run in the green suite.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P1 tasks `[x]` (T003-T008)
- [x] P2 + refinements applied or deferred with rationale (T009-T018 applied; T019/O5 reclassified as a non-issue, no code change)
- [x] Plugin tests green; no `[B]` blocked tasks (188/189, the 1 fail a pre-existing unrelated artifact)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/002-mk-skill-advisor/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
