---
title: "Implementation Plan: Dist Freshness Enforcement"
description: "Plan for a shared freshness utility, a validate.sh backstop, a Claude Code hook, and an OpenCode plugin preventing silent dist staleness."
trigger_phrases:
  - "dist freshness enforcement plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement"
    last_updated_at: "2026-07-04T16:29:00.013Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented dist freshness plan"
    next_safe_action: "Run final freshness verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/plugins/mk-dist-freshness-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Dist Freshness Enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + Node.js (CommonJS/ESM) |
| **Framework** | validate.sh orchestrator, Claude Code hooks, OpenCode plugin runtime |
| **Testing** | bash fixture tests, vitest/CommonJS plugin test harness |

### Overview
Extract the already-proven `ensureFreshDist()` pattern (`.opencode/bin/spec-memory.cjs:87-102`) into one reusable, bash-callable freshness check covering all 7 known dist-producing packages. Wire it into `validate.sh`'s `run_node_orchestrator()` as a hard, fail-closed backstop (exit 3), and add two soft, non-blocking early-warning layers: a Claude Code PostToolUse hook and an OpenCode plugin, both warn-only and modeled on existing hooks/plugins in this repo.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed at `scripts/spec/validate.sh:975-989` (file-existence check only, no freshness check).
- [x] Reusable reference pattern confirmed at `.opencode/bin/spec-memory.cjs:87-102`.
- [x] Existing hook (`claude-posttooluse.sh`) and plugin (`mk-deep-loop-guard.js`) shapes confirmed via direct exploration.

### Definition of Done
- [x] Shared freshness utility exists and correctly flags all 7 known dist-producing packages.
- [x] `validate.sh` fails closed (exit 3, clear message) on a synthetic stale validation-orchestrator dist; passes through unaffected on a fresh-dist fixture.
- [x] Claude Code PostToolUse hook emits a non-blocking `STALE DIST WARNING` banner; always exits 0.
- [x] OpenCode plugin warns (non-blocking) before a Bash call matching `opencode run` / `validate.sh` when a watched dist is stale; registers a `session.created` one-time summary.
- [x] New tests pass; `test-validation-extended.sh` passes with the compact-fixture warning expectation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered defense: one hard backstop at the point of use (`validate.sh`), two soft nudges at the point of cause (edit-time hook, dispatch-time plugin) -- all three call into a single shared freshness-check implementation rather than duplicating the mtime/hash logic three times.

### Key Components
- **Shared freshness utility** (new): generalizes `sourceCandidates()`/`hashSourceFiles()`/the mtime-compare core from `spec-memory.cjs:87-102` into a package-agnostic function, parameterized by a table of `{sourceDirs, distEntryFile}` per known package.
- **`validate.sh` backstop**: `run_node_orchestrator()` (`scripts/spec/validate.sh`) calls the utility before the existing orchestrator file-existence check; on stale `system-spec-kit/mcp_server` validation-orchestrator dist, exit 3 with an actionable rebuild command; on fresh or utility-unavailable, proceed exactly as today (fail open on utility errors, never block a validation run because of a bug in the freshness checker itself).
- **`check-dist-staleness.sh`** (new, sibling to `check-comment-hygiene.sh`): reads `tool_input.file_path` from the same stdin JSON payload `claude-posttooluse.sh` already parses; if the path falls under a watched source tree and dist is stale, prints the warning banner; always exits 0.
- **`mk-dist-freshness-guard.js`** (new OpenCode plugin): `tool.execute.before` hook matching `input.tool === 'bash'`, regexing `output.args.command` for `opencode run` / `validate.sh`; `console.warn` only, never throws (fails open); a `session.created` handler for a one-time summary.

### Data Flow
Edit lands (Write/Edit) → Claude PostToolUse hook checks freshness for that file's package → warns if stale. Separately, at any later point, a Bash call is about to run `opencode run` or `validate.sh` → OpenCode plugin checks freshness for all watched packages → warns if any stale. If both nudges are missed (or the session is a non-Claude, non-OpenCode caller), `validate.sh` itself still fails closed at the point of use.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the full package table (source dirs + dist entry file) for all 7 known dist-producing packages by reading each `package.json` `scripts.build`.
- [x] Read `spec-memory.cjs:87-102` in full to confirm the exact reusable mtime/hash logic.

### Phase 2: Implementation
- [x] Build the shared freshness utility.
- [x] Wire the `validate.sh` backstop into `run_node_orchestrator()`.
- [x] Build `check-dist-staleness.sh` and wire it into `claude-posttooluse.sh`.
- [x] Build `mk-dist-freshness-guard.js`.

### Phase 3: Verification
- [x] Add a synthetic stale-dist bash fixture and a fresh-dist bash fixture; confirm `validate.sh` exit codes.
- [x] Add plugin tests mirroring `mk-deep-loop-guard.test.cjs`'s harness shape.
- [x] Run `test-validation-extended.sh` in full; confirm no regression after fixture expectation updates.
- [x] Rebuild all 7 packages' dist once more cleanly; confirm no residual staleness.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture | Stale-dist and fresh-dist synthetic scenarios | bash |
| Unit | Plugin hook behavior against hand-built input/output fixtures | CommonJS test harness (mirrors `mk-deep-loop-guard.test.cjs`) |
| Regression | Full extended validation harness | `test-validation-extended.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loops/030-agent-loops-improved` phase 011 child 006 | Downstream consumer | In Progress | Child 006's own re-verification should run through this backstop once available, but is not blocked by it -- can proceed with manual freshness checks in the interim |

### Downstream
`002-repo-wide-remediation-sweep`'s fix wave should be measured against a freshness-enforced `validate.sh`, so this child completes first.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the new backstop produces false positives (blocks a genuinely fresh dist) or the hook/plugin ever hard-blocks instead of warning.
- **Procedure**: revert the `validate.sh` backstop call (single call-site, easy to isolate), and/or remove `mk-dist-freshness-guard.js` (auto-unloaded, no registry entry to clean up) and the `check-dist-staleness.sh` wiring in `claude-posttooluse.sh`.
<!-- /ANCHOR:rollback -->
