---
title: "Implementation Plan: Phase 1: concurrent-daemon-corruption-fix [template:level_1/plan.md]"
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
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix"
    last_updated_at: "2026-05-18T04:46:08Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-concurrent-daemon-corruption-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: concurrent-daemon-corruption-fix

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

- **Trigger**: Production launcher refuses to start when it should (false-positive lease detection), OR new WAL pragma causes regression in a test/dev environment.
- **Procedure**: `git revert <commit-sha>` then restart `mk_skill_advisor` MCP server. Lease file `.mk-skill-advisor-launcher.json` survives the revert harmlessly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Output | Consumer |
|-------|-----------|--------|----------|
| 1. Lease hoist | `lib/daemon/lease.ts` (existing) | `isLeaseHeld()` helper export | Launcher CJS |
| 2. Launcher exit-on-lease-held | Phase 1 | Exit code 0 + log line | Phase 4 (test) |
| 3. WAL + busy_timeout pragma | `lib/skill-graph/skill-graph-db.ts` (existing) | `openDb()` initializes pragmas | All DB consumers |
| 4. Spawn-twice + WAL assertion tests | Phases 1–3 | Green vitest suite | CI |
| 5. Reference doc update | Phases 1–3 | `daemon-lease-contract.md §2` patch | Future readers |
| 6. Changelog entry | Phases 1–5 | `changelog/006-*.md` | Release notes |

No external dependencies. All work is inside `.opencode/skills/system-skill-advisor/`.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Lines of Code | Time |
|-------|--------------:|------|
| 1. Lease hoist (`isLeaseHeld` helper) | 15–25 | 15 min |
| 2. Launcher exit-on-lease-held | 20–30 | 20 min |
| 3. WAL + busy_timeout pragma | 5–10 | 10 min |
| 4. Vitest: spawn-twice + WAL | 60–90 | 45 min |
| 5. `daemon-lease-contract.md §2` patch | 20–40 | 10 min |
| 6. Changelog entry | 30–50 | 10 min |
| **Total authoring** | **150–245** | **~110 min** |
| 7. Strict validate + final review | n/a | 15 min |
| 8. 24-hour soak (background) | n/a | 24h elapsed, ~5 min hands-on |
| **Total wall-clock to claim done** | — | **2–3 hours active + 24h soak** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Condition | Detection | Action | Recovery Time |
|-----------|-----------|--------|---------------|
| Launcher refuses to start in dev workflow | Operator reports MCP unavailable | Set env `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER=0`, restart | <1 min |
| Spawn-twice test flakes in CI | CI fails on the new test only | Increase timing tolerance from 2s → 5s in the test | <5 min |
| WAL pragma breaks read-only mount | EACCES on `journal_mode=WAL` | Fallback already coded: drops to `journal_mode=DELETE` with warning | Automatic |
| False stale-reclaim on PID-reuse | Lease file owner = unrelated process | `rm .mk-skill-advisor-launcher.json`, restart launcher | <1 min |
| Regression in advisor scorer ranking | `advisor_recommend` returns different top-1 | `git revert` → rerun benchmark to confirm baseline restored | <10 min |

Full revert path: `git revert <sha-of-006-fix>` then restart MCP server. The lease file format is unchanged across revert, so no migration is required either direction.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

