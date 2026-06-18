---
title: "Tasks: CLI Front-Door Safety Remediation"
description: "One task per deep-review finding in this sub-phase (6 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T15:20:00Z"
    last_updated_by: "cli-frontdoor-remediation"
    recent_action: "Fixed 5 CLI front-door findings; T002 refuted then hardened"
    next_safe_action: "Operator review; run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Front-Door Safety Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] 004-S1 Capture the subsystem test/validation baseline. Baseline (CLI suites): spec-memory 13 (3 files), code-index 19 (4 files), skill-advisor 13 (4 files) — all green.
- [x] 004-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing. All 6 read; T002 confirmed already-gated by `assertTrustedForMutation` (refuted), other 5 confirmed real.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [x] 004-T001 · `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:753` — FIXED. Added `assertSocketPerimeter()` (lstat dir → reject symlink, require current-uid ownership when getuid exists, reject group/world-writable, lstat socket node → reject symlink + foreign owner), called from `ensureSocketEnvironment()`. Mirrors the server-side fence in `lib/ipc/socket-server.ts:274-298`. Test: `tests/spec-memory-cli-socket-perimeter.vitest.ts` (4 cases). _[downgraded→P2]_
- [x] 004-T002 · `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:353` — REFUTED (Round-2 confirmed: `assertTrustedForMutation` at line 659 already gates mutations and `trusted` defaults false), THEN HARDENED per directive as defense-in-depth. Added `promptTime` boolean (`defaultPromptTime()` env helper + `--prompt-time` flag) threaded into `assertTrustedForMutation`, which now rejects mutations at prompt-time regardless of `--trusted`. Test: `tests/skill-advisor-cli-trusted-prompt-time.vitest.ts` (prompt-time block cases). _[refuted-Round2 → hardened]_
- [x] 004-T003 · `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:18` — FIXED. Added `normalizeToolName()` (strip `-`/`_`, lowercase — same fold as code-index-cli `normalizeName`) and a normalized `MAINTENANCE_TOOLS` set; `runCli` now checks `MAINTENANCE_TOOLS.has(normalizeToolName(toolName))`, blocking snake+kebab+camel (`codeGraphScan`/`codeGraphApply`/`codeGraphVerify`). Test: `tests/mk-code-graph-bridge-maintenance-block.vitest.ts` (9 alias casings + 1 negative control). _[downgraded→P2]_
- [x] 004-T004 · `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:924` — FIXED. Same `assertSocketPerimeter()` perimeter check as T001, called from `ensureSocketEnvironment()`. Test: `tests/code-index-cli-socket-perimeter.vitest.ts` (4 cases). _[downgraded→P2]_
- [x] 004-T005 · `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:982` — FIXED. Added `isErrorPayload()` helper (status==='error') and changed line 982 to `return isError || isErrorPayload(payload) ? EXIT_RUNTIME : EXIT_SUCCESS;` (code-index style). Tests: vitest `status:error` payload → exit 1 + `status:ok` → exit 0 (`tests/spec-memory-cli.vitest.ts`); shell exit-code assertion against the real `dist/spec-memory-cli.js` process → error-payload exit 1, ok-payload exit 0 (PASS). _[downgraded→P2]_
- [x] 004-T006 · `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:428` — FIXED. `--trusted`/`--maintainer` now honor an inline boolean via the same `parseInlineBoolean` used by `--warm-only`; `--trusted=false` and `--trusted=0` yield `trusted:false`. Test: `tests/skill-advisor-cli-trusted-prompt-time.vitest.ts` (inline-boolean cases incl. gate proof). _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] 004-V1 vitest + shell exit-code assertions across the three CLIs. New vitest: spec-memory perimeter (4) + exit-code (2); code-index perimeter (4) + bridge maintenance-block (10); skill-advisor trusted/prompt-time (12). Shell exit-code assertion on real `dist/spec-memory-cli.js`: error-payload→1, ok-payload→0 (PASS).
- [x] 004-V2 Whole-gate delta reported (no regressions). spec-memory CLI 13→23, code-index CLI 19→37, skill-advisor CLI 13→35 (all green; deltas are added tests, zero regressions). Typecheck clean on all three packages; comment-hygiene clean on all 4 source files; alignment verifier PASS on the bridge scope.
- [x] 004-V3 Per-finding status recorded in this sub-phase (tasks.md Phase 2 + implementation-summary.md). The root `review/fresh-regression-75/` registry is out of this sub-phase's SCOPE LOCK and intentionally left unmodified.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 6 findings resolved: 5 fixed (T001, T003, T004, T005, T006), 1 refuted-then-hardened (T002). Verification gate green across all three CLI packages.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
