---
title: "Implementation Plan: Phase 1: lease-hardening-from-review [template:level_1/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening"
    last_updated_at: "2026-05-18T06:19:31Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-lease-hardening-from-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: lease-hardening-from-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | [e.g., TypeScript, Python 3.11] |
| **Framework** | [e.g., React, FastAPI] |
| **Storage** | [e.g., PostgreSQL, None] |
| **Testing** | [e.g., Jest, pytest] |

### Overview
[2-3 sentences: what this implements and the technical approach]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
[MVC | MVVM | Clean Architecture | Serverless | Monolith | Other]

### Key Components
- **[Component 1]**: [Purpose]
- **[Component 2]**: [Purpose]

### Data Flow
[Brief description of how data moves through the system]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Development environment ready

### Phase 2: Core Implementation
- [ ] [Core feature 1]
- [ ] [Core feature 2]
- [ ] [Core feature 3]

### Phase 3: Verification
- [ ] Manual testing complete
- [ ] Edge cases handled
- [ ] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [Components/functions] | [Jest/pytest/etc.] |
| Integration | [API endpoints/flows] | [Tools] |
| Manual | [User journeys] | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Re-probe causes legitimate single-launcher boots to exit with code 0; OR broader EACCES predicate catches errors that should propagate; OR new skill-advisor test flakes in CI.
- **Procedure**: `git revert <commit-sha>` then restart MCP servers. PID file format unchanged, lease.ts EPERM branch is backward-compat. Tests can be skipped via `.skip` while the revert is in flight.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Output | Consumer |
|-------|-----------|--------|----------|
| 1. Re-probe after write | none | Race-window close in 2 launchers | All later phases inherit |
| 2. SIGTERM child-exit refactor | Phase 1 (spec-memory edits) | Clean child shutdown ordering | Phase 9 test |
| 3. Env-var helper | none | `isStrictModeDisabled()` in 3 launchers | Phase 9 test (REQ-008) |
| 4. EPERM branch in lease.ts | none | `held: true` on EPERM | skill-advisor launcher |
| 5. Pragma order swap | none | busy_timeout before WAL | skill-graph-db open path |
| 6. Broader EACCES predicate | Phase 5 | DELETE-mode fallback now actually triggers | skill-graph-db open path |
| 7. Stdout-close gate | none | Test-isolation fix | 007 + new test files |
| 8. Strip host env in tests | Phase 3 | Test-isolation fix | 007 + new test files |
| 9. New skill-advisor subprocess test | Phases 1, 3, 4, 7, 8 | Coverage parity | CI |
| 10. Changelog | Phases 1-9 | Release notes | Future readers |

No external dependencies. All work in files already touched by 006 + 007.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Lines of Code | Time |
|-------|--------------:|------|
| 1. Re-probe (×2 launchers) | 8-12 | 10 min |
| 2. SIGTERM child-exit (spec-memory) | 20-30 | 20 min |
| 3. Env-var helper (×3 launchers) | 18-24 | 10 min |
| 4. EPERM branch (lease.ts) | 3-4 | 5 min |
| 5. Pragma order swap | 2-3 | 5 min |
| 6. Broader EACCES predicate | 5-8 | 5 min |
| 7. Stdout-close gate (×2 test files) | 14-20 | 10 min |
| 8. Strip env in spawnLauncher (×2 test files) | 8-12 | 5 min |
| 9. New skill-advisor test file | 200-280 | 40 min |
| 10. Changelog | 80-120 | 10 min |
| **Total authoring** | **358-513** | **~120 min** |
| 11. Verification + commit | n/a | 15 min |

Actual delivered via cli-codex gpt-5.5 high fast + main-agent Phase 9 race fix + Phase 10 changelog: ~410 LOC across 9 files (+261/-13). Within the upper estimate.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Condition | Detection | Action | Recovery Time |
|-----------|-----------|--------|---------------|
| Re-probe wrongly exits single-launcher case | All MCP runtimes fail to start | `git revert <sha>` then restart MCP servers | <5 min |
| New EACCES predicate catches valid errors | SQLite operations silently fall to DELETE mode | Narrow the predicate via Edit + redeploy; or `git revert` if widespread | <10 min |
| SIGTERM handler hangs | spec-memory stops responding to graceful shutdown | SIGKILL backstop fires at 5s; OR revert the handler refactor | <5 min |
| Env-var helper breaks unset case | Strict mode silently disabled | Patch `isStrictModeDisabled(undefined)` to return `false` (already does); verify test coverage | <5 min |
| New skill-advisor test flakes in CI | Single test fails repeatedly | `.skip` the failing case temporarily; investigate timing budget | <2 min |

Full revert: `git revert <sha>` then restart each MCP server. Lease file format unchanged, so no migration is required either direction.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

