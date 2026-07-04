---
title: "Feature Specification: Dist Freshness Enforcement"
description: "A shared freshness-check utility, a validate.sh hard backstop, a Claude Code PostToolUse hook, and an OpenCode plugin that together prevent compiled dist/ output from silently going stale relative to its TypeScript source."
trigger_phrases:
  - "dist freshness enforcement"
  - "validate.sh stale dist backstop"
  - "stale dist hook plugin"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement"
    last_updated_at: "2026-07-04T16:29:00.013Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented dist freshness guards"
    next_safe_action: "Run final freshness verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh"
      - ".opencode/skills/sk-code/scripts/check-dist-staleness.sh"
      - ".opencode/plugins/mk-dist-freshness-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fail closed (exit 3, clear rebuild message) on staleness, never silent auto-rebuild -- confirmed by the parent packet's constraints."
---
# Feature Specification: Dist Freshness Enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 |
| **Predecessor** | None |
| **Successor** | 002-repo-wide-remediation-sweep |
| **Handoff Criteria** | validate.sh fails closed (exit 3) only when the `system-spec-kit/mcp_server` validation orchestrator dist is stale, passes through when fresh; Claude hook and OpenCode plugin both emit non-blocking warnings; validation harnesses pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate.sh`'s default path (`run_node_orchestrator()`, `scripts/spec/validate.sh:975-989`) only checks `[[ -f "$orchestrator_js" ]]` -- file existence -- before trusting the compiled `mcp_server/dist/lib/validation/orchestrator.js`. There is no mtime/hash comparison against the TypeScript source, unlike the CLI shims (`.opencode/bin/spec-memory.cjs:87-102`'s `ensureFreshDist()`, also used by `code-index.cjs`/`skill-advisor.cjs`), which already implement this correctly (exit `69`, retryable). `dist/` sat ~2 weeks stale while 3 real commits landed on `orchestrator.ts`, and even the existing CLI-shim watch lists never covered `lib/validation/` -- the exact subtree that broke.

### Purpose
Close this gap for every dist-producing package in the repo (not just `mcp_server`), and add two ergonomic, non-blocking early-warning layers (a Claude Code hook and an OpenCode plugin) so a stale dist is caught the moment it happens, not discovered downstream via a confusing validate.sh failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared, reusable freshness-check utility covering: `system-spec-kit/{shared,scripts,mcp_server}` (mcp_server's watch list extended to include `lib/validation/`), `mcp-code-mode/mcp_server`, `system-skill-advisor/mcp_server`, `system-code-graph/mcp_server`, `sk-design/design-md-generator/backend`.
- A hard backstop inside `validate.sh`'s `run_node_orchestrator()`: fail closed with exit `3` (validate.sh's existing "system error" code) and an explicit rebuild command when the `system-spec-kit/mcp_server` validation orchestrator dist is stale.
- A Claude Code PostToolUse hook extending `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` with a sibling `check-dist-staleness.sh`, mirroring `check-comment-hygiene.sh`'s always-exit-0 warning-banner shape.
- An OpenCode plugin `.opencode/plugins/mk-dist-freshness-guard.js`, mirroring `mk-deep-loop-guard.js`'s `tool.execute.before` shape, warning (non-blocking) before a Bash call matching `opencode run` / direct `validate.sh` invocation, plus a `session.created`-based one-time per-session summary.
- Test coverage for all of the above.

### Out of Scope
- Auto-rebuilding dist on staleness (explicitly rejected -- see parent packet constraints).
- Any change to the actual validator rule logic itself (that is `deep-loops/030-agent-loops-improved` phase 011 child 006's scope, not this packet's).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:acceptance -->
## 4. ACCEPTANCE CRITERIA

- [x] Shared freshness utility correctly detects staleness for all 7 confirmed dist-producing packages.
- [x] `validate.sh` exits 3 with a clear rebuild message when the `system-spec-kit/mcp_server` validation orchestrator dist is stale; passes through unaffected when fresh.
- [x] Claude Code PostToolUse hook prints a `STALE DIST WARNING` banner (never blocks) when an edited file lands in a watched source tree and dist is now stale.
- [x] OpenCode plugin warns (never blocks) before a Bash call matching `opencode run` / `validate.sh` when watched dist is stale.
- [x] New plugin test suite passes; `test-validation-extended.sh` passes with the updated compact-fixture warning expectation.

### Acceptance Scenarios

- **Scenario 1**: **Given** the validation orchestrator source is newer than compiled dist, **when** `validate.sh` runs through the Node orchestrator path, **then** it exits `3` and prints `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`.
- **Scenario 2**: **Given** watched package dist is stale, **when** Claude or OpenCode warning layers run, **then** they emit `STALE DIST WARNING` without throwing or blocking the user action.
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared freshness utility covers all 7 dist-producing packages | Function correctly flags a synthetic stale case and a synthetic fresh case for each package |
| REQ-002 | `validate.sh` fails closed on stale validation orchestrator dist | Synthetic stale-dist fixture exits 3 with an actionable rebuild message |
| REQ-003 | No silent auto-rebuild | Code review confirms no `tsc --build`/`npm run build` call fires automatically from the backstop, hook, or plugin |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Claude Code PostToolUse hook warns without blocking | Hook always exits 0; prints `STALE DIST WARNING` banner only when the edited file's package is stale |
| REQ-005 | OpenCode plugin warns before risky swarm dispatch | `tool.execute.before` hook detects `opencode run`/`validate.sh` in a Bash command and warns (non-blocking) when any watched dist is stale |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: A developer who edits `orchestrator.ts` and immediately runs `validate.sh` without rebuilding gets a clear, actionable exit-3 failure instead of silently stale results.
- **SC-002**: The same edit, made through Claude Code, produces an immediate in-context warning before `validate.sh` is ever run.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False positives blocking legitimate fresh-dist validate runs | Blocks unrelated work | Fixture-test both stale and fresh cases before shipping; fail open on utility errors |
| Risk | Auto-rebuild temptation reintroducing cross-session contamination | Repeats today's incident in a new form | Explicitly out of scope (see Constraints in parent spec.md); enforced via code review |
| Dependency | `.opencode/bin/spec-memory.cjs`'s `ensureFreshDist()` pattern | Reference implementation to generalize | Already proven in production for 3 CLI shims |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the shared utility also cover packages discovered later (e.g. via a config file) rather than a hardcoded table? Deferred -- start with the 7 known packages, revisit if a new one causes a repeat incident.

<!-- /ANCHOR:questions -->

---

## 9. IMPLEMENTED FILES

Primary implementation files are `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skills/sk-code/scripts/check-dist-staleness.sh`, `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`, and `.opencode/plugins/mk-dist-freshness-guard.js`.

---

## 10. PACKAGE COVERAGE

The shared utility covers `system-spec-kit/shared`, `system-spec-kit/scripts`, `system-spec-kit/mcp_server`, `mcp-code-mode/mcp_server`, `system-skill-advisor/mcp_server`, `system-code-graph/mcp_server`, and `sk-design/design-md-generator/backend`.

---

## 11. VALIDATE.SH BACKSTOP

`validate.sh` checks freshness before loading `mcp_server/dist/lib/validation/orchestrator.js` and maps stale utility exit `69` to validator exit `3`.

---

## 12. CLAUDE HOOK BEHAVIOR

The Claude PostToolUse path delegates edited-file freshness checks to `check-dist-staleness.sh` and always exits `0` after warning.

---

## 13. OPENCODE PLUGIN BEHAVIOR

The OpenCode plugin uses `tool.execute.before` for risky Bash commands and `event` for one-time session summaries. It warns only and default-exports only.

---

## 14. CLI SHIM ALIGNMENT

The three daemon CLI shims now call the shared utility so stale-dist behavior stays aligned across Spec Memory, Code Graph, and Skill Advisor entrypoints.

---

## 15. BUILD MANIFEST ALIGNMENT

The mcp_server finalize-dist manifest no longer expects the removed OpenCode hook artifact, so rebuild verification matches the current hook layout.

---

## 16. TEST-DIST-FRESHNESS COVERAGE

`test-dist-freshness.sh` verifies both the stale exit-3 path and the fresh pass-through path while restoring source and dist mtimes on exit.

---

## 17. PLUGIN TEST COVERAGE

`mk-dist-freshness-guard.test.cjs` verifies export shape, risky-command matching, session-created summary behavior, fresh-dist silence, and malformed-input fail-open behavior.

---

## 18. EXTENDED VALIDATION COVERAGE

`test-validation-extended.sh` passes `113/113` after fixture 053 metadata and evidence were refreshed and the compact Level 2 section-count advisory was made explicit.

---

## 19. FIXTURE 053 STATE

Fixture 053 now has fresh generated metadata, same-line checklist evidence markers, completion continuity, and acceptance scenarios for the rebuilt validator path.

---

## 20. FIXTURE 054 STATE

Fixture 054 remains the intentional warning fixture for extra-header behavior and now avoids unrelated scaffold-marker failures.

---

## 21. NO AUTO-REBUILD GUARANTEE

The backstop, hook, plugin, and CLI utility report rebuild commands but do not invoke build commands automatically.

---

## 22. EXIT CODE CONTRACT

The shared utility uses stale exit `69`; `validate.sh` converts only the validation-orchestrator stale case to exit `3` and fails open on utility errors.

---

## 23. WARNING CONTRACT

Claude and OpenCode warning paths must never block the user action. Their value is early visibility; validate.sh remains the enforcement gate.

---

## 24. REBUILD COMMAND

The hard-stop message includes `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` so the operator has a direct recovery command.

---

## 25. HANDOFF STATE

This child is complete and hands off to `002-repo-wide-remediation-sweep` with the freshness backstop available for subsequent validator remediation work.
