---
title: "Implementation Plan: CLI Per-Command Help, Aliases, and Errors [template:level_1/plan.md]"
description: "Mirror the skill-advisor per-command help pattern into spec-memory and code-index, unify snake/kebab/camel aliases with a collision test, and add a list-tools hint plus closest-match suggestion to unknown-command errors."
trigger_phrases:
  - "002-cli-help-aliases-errors plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors"
    last_updated_at: "2026-06-11T01:10:42Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed planned CLI help, alias, and error-hint work"
    next_safe_action: "Sub-phase complete; continue with sibling CLI tooling UX phases as needed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts"
      - ".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-002-cli-help-aliases-errors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The existing skill-advisor per-command help shape was mirrored into spec-memory and code-index."
      - "Alias collision guardrails are covered by focused unit tests for all three CLIs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Per-Command Help, Aliases, and Errors

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript CLI shims (spec-memory, code-index, skill-advisor) |
| **Framework** | Daemon-backed CLI front-doors over mk-* MCP daemons |
| **Storage** | n/a (offline help + arg parsing) |
| **Testing** | vitest (alias collision + help + error-hint coverage) |

### Overview
Copy the skill-advisor per-command help pattern into spec-memory and code-index, declare a unified snake/kebab/camel alias map across all three with a collision test, and extend the shared unknown-command catch paths to emit a "try list-tools" hint and a closest-match suggestion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror an existing proven pattern (skill-advisor per-command help) across two more CLIs; additive alias and error-hint changes guarded by tests.

### Key Components
- **Per-command help**: tool-scoped schema printer in `spec-memory-cli.ts` and `code-index-cli.ts`
- **Alias map**: shared snake/kebab/camel resolver with a collision test
- **Error hints**: shared unknown-command catch path adds a list-tools hint + nearest-match suggestion

### Data Flow
`<tool> --help` -> tool-scoped schema from registry -> stdout; unknown command -> catch path -> structured JSON error + hint + nearest match.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces and verification live in the spec Files-to-Change table and the tasks below. Alias collisions must fail the build (assessment #3 guardrail).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-memory-cli.ts:750-755` | global usageText only | Add per-command help | `spec-memory <tool> --help` prints schema, exit 0 |
| `code-index-cli.ts:898-903` | global usageText only | Add per-command help | `code-index <tool> --help` prints schema, exit 0 |
| alias maps (`:222-228`, `:241-247`, manifest `:142-151`) | uneven snake/kebab/camel | Unify + collision test | Collision test green; aliases consistent |
| unknown-command catch paths | structured error, no hint | Add hint + nearest match | Typo returns hint + suggestion |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture the skill-advisor per-command help shape as the pattern to mirror
- [x] Enumerate current aliases for all three CLIs and identify gaps

### Phase 2: Core
- [x] Add per-command help/schema to spec-memory and code-index
- [x] Declare a unified snake/kebab/camel alias map across all three
- [x] Add list-tools hint + closest-match suggestion to unknown-command errors

### Phase 3: Verification
- [x] Per-command help prints offline for spec-memory and code-index
- [x] Alias collision test is green
- [x] Unknown-command error includes hint + nearest match
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-command help output | vitest |
| Unit | Alias collision detection | vitest |
| Unit | Closest-match suggestion | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| skill-advisor help pattern (`skill-advisor-cli.ts:661-674`) | Internal | Available | Mirror it instead of inventing a new shape |
| Sub-phase 005 (completion) reads the same alias map | Internal | Planned | Land aliases first so completion stays consistent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Alias collision regressions or help output breakage.
- **Procedure**: Revert the alias map / help printer; changes are additive to existing parsing.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
