---
title: "Implementation Plan: Phase 1: cross-launcher-lease-propagation [template:level_1/plan.md]"
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
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation"
    last_updated_at: "2026-05-18T05:41:21Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-cross-launcher-lease-propagation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: cross-launcher-lease-propagation

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

- **Trigger**: Production launcher refuses to start when it should (false-positive lease detection on either launcher), OR new PID-file logic causes regression in spec-memory's context-server.js spawn lifecycle.
- **Procedure**: `git revert <commit-sha>` then restart each MCP server. PID files (`.mk-code-index-launcher.json`, `.mk-spec-memory-launcher.json`) survive the revert harmlessly; the reverted launcher just ignores them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Output | Consumer |
|-------|-----------|--------|----------|
| 1. code-graph PID-file primitive | none | `isLeaseHeld()` + `writeLeaseFile()` + `clearLeaseFile()` inline in `mk-code-index-launcher.cjs` | Phase 3 test |
| 2. spec-memory PID-file primitive | mirror of Phase 1 | Same inline helpers in `mk-spec-memory-launcher.cjs` with child-aware SIGTERM | Phase 3 test |
| 3. Spawn-twice + stale-PID tests | Phases 1-2 | Two new `launcher-lease.vitest.ts` files | CI |
| 4. Reference docs | Phases 1-2 | Two new `references/launcher-lease.md` files | Future readers |
| 5. Changelog | Phases 1-4 | `changelog/007-cross-launcher-lease-propagation.md` | Release notes |

No external dependencies. All work is inside `.opencode/bin/` + the two skills' `mcp_server/tests/` and `references/`.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Lines of Code | Time |
|-------|--------------:|------|
| 1. code-graph PID-file primitive + launcher integration | 30-50 | 20 min |
| 2. spec-memory PID-file primitive (mirror + child shutdown) | 30-50 | 20 min |
| 3. Vitest spawn-twice + stale-PID tests × 2 | 120-180 | 45 min |
| 4. `references/launcher-lease.md` × 2 | 80-120 | 15 min |
| 5. Changelog entry | 80-120 | 10 min |
| **Total authoring** | **340-520** | **~110 min** |
| 6. Strict validate + final review | n/a | 10 min |
| **Total wall-clock to claim done** | — | **~2 hours active** |

Actual delivered via cli-codex gpt-5.5 high fast: 712 LOC across 7 files (+162/-22) in a single dispatch — slightly above the upper estimate because the tests came in larger than expected and the changelog is comprehensive.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Condition | Detection | Action | Recovery Time |
|-----------|-----------|--------|---------------|
| Launcher refuses to start in dev workflow | Operator reports MCP unavailable | Set `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0` or `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=0`, restart | <1 min |
| Spawn-twice test flakes in CI | CI fails on the new test only | Increase timing tolerance from 2s → 5s in the test | <5 min |
| Stale PID file blocks fresh launcher | Lease file lists a PID that does exist but is unrelated (PID reuse) | `rm .opencode/skills/<skill>/mcp_server/database/.mk-*-launcher.json`, restart launcher | <1 min |
| spec-memory child context-server.js orphaned after launcher exit | child not cleaned on SIGKILL of launcher | Kill child manually; SIGTERM path (added in Phase 2) handles SIGTERM cleanly | <1 min |
| Cross-launcher behavioral drift | Three launchers no longer share LEASE_HELD_BY format | `grep -c 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` should return 3; if not, sync the wording | <5 min |

Full revert path: `git revert <sha-of-007-fix>` then restart each MCP server. Lease file format is identical across revert (PID + startedAt JSON), so no migration is required either direction.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

