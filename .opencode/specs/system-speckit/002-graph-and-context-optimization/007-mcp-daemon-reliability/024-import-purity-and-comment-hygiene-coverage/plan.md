---
title: "Implementation Plan: Import purity and comment-hygiene checker coverage"
description: "Defer the code-index launcher's require-time env side effects behind the entrypoint guard, and extend the comment-hygiene checker for the missed RC/DR/phase/seat label classes plus inline comments, with the daemon-reliability backlog scrubbed."
trigger_phrases:
  - "import purity plan"
  - "comment hygiene checker plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage"
    last_updated_at: "2026-06-07T19:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded packet and dispatched 2 gpt-5.5 agents for the two fixes"
    next_safe_action: "Verify agent outputs, reconcile docs, commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-024-import-purity-and-comment-hygiene-coverage"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Import purity and comment-hygiene checker coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launchers, Python linter, TypeScript vitest |
| **Framework** | None; standalone CLI launchers and a Python script |
| **Storage** | None |
| **Testing** | vitest for the launchers, a self-contained shell test for the checker |

### Overview
Two independent fixes run in parallel. The first moves the code-index launcher's env loading and maintainer-mode mutation behind the existing entrypoint guard so importing the module is side-effect-free. The second extends the comment-hygiene checker with the missed label patterns and inline-comment scanning, then scrubs the daemon-reliability labels those patterns surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (require-purity test, checker test, watchdog suite)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone launcher scripts plus a pure-helper export surface, with a separate linter script.

### Key Components
- **mk-code-index-launcher.cjs**: process entrypoint and exporter of pure bridge/classify helpers.
- **check-comment-hygiene.sh**: Python linter invoked by the PostToolUse hook over changed files.

### Data Flow
On import, the launcher should expose only pure helpers; env loading happens only when it is the entrypoint. The checker reads a file, finds comment text (full-line and inline), and reports perishable-label matches that survive the allow-list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-code-index-launcher.cjs` env block | Loads env and mutates `process.env` at module top level | Move into the entrypoint guard | `node -e "require(...)"` prints nothing; require-purity test |
| `mk-code-index-launcher.cjs` exports | Pure bridge/classify helpers imported by tests | Unchanged; must still resolve after the move | require-purity test asserts exports present |
| `check-comment-hygiene.sh` patterns | Flags perishable labels in comments | Add RC/DR-single/phase-hyphen/seat; scan inline | checker test flags should-flag set, clears should-pass set |
| Daemon-reliability comments | Carry RC/DR/phase/F labels | Scrub to durable WHY | extended checker returns exit 0 on the four files |

Required inventories:
- Consumers of the launcher exports: `rg -n 'bridgeStdioThroughSessionProxy|classifyCodeIndexFrame' .opencode --glob '*.cjs' --glob '*.ts'`.
- Blast radius of new patterns measured up front: RC-N 8, DR-N single 43, phase-hyphen 3, P-Seat 2, F\d+ 92 (excluded).
- Algorithm invariant: importing the launcher must leave `process.env` byte-identical; the checker must never flag an allow-listed or `hygiene-ok` line.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded at Level 2
- [x] Blast radius and dependency tracing completed
- [x] Two gpt-5.5 agents dispatched on disjoint files

### Phase 2: Core Implementation
- [ ] Defer launcher env side effects behind the entrypoint guard
- [ ] Extend checker patterns and inline scanning
- [ ] Scrub daemon-reliability perishable labels

### Phase 3: Verification
- [ ] Require-purity and checker tests pass
- [ ] Four scrubbed files clean under the extended checker
- [ ] Documentation updated and packet validated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Launcher require-purity and helper exports | vitest |
| Unit | Checker should-flag and should-pass cases | shell test |
| Regression | Watchdog suite after the label scrub | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex CLI (gpt-5.5) | External | Green | Orchestrator applies the fix manually |
| sk-code surface references | Internal | Green | Agents fall back to existing launcher conventions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verification failure or a regression in the entrypoint path or watchdog suite.
- **Procedure**: Revert the packet commit; both changes are additive and isolated to the listed files.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Medium | Two parallel agents |
| Verification | Low | Syntax, tests, checker, validate |
| **Total** | | One working session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Working tree clean before dispatch (apart from the untracked owner lease)
- [ ] Both agent diffs reviewed
- [ ] Verification green before commit

### Rollback Procedure
1. Identify the packet commit hash.
2. `git revert` the commit, or reset it if not yet pushed.
3. Re-run `node --check` and the launcher suites to confirm the revert is clean.
4. No stakeholder notification needed; the changes are internal tooling.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
