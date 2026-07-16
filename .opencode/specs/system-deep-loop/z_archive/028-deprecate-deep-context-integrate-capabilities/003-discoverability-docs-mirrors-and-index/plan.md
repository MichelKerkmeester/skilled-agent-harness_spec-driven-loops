---
title: "Implementation Plan: Discoverability Docs Mirrors And Index Cleanup"
description: "Plan registry, advisor, active docs, mirror, and generated-index cleanup after the standalone deep-context public route is closed."
trigger_phrases:
  - "deep-context registry cleanup plan"
  - "deep-context advisor cleanup plan"
  - "deep-context docs cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/003-discoverability-docs-mirrors-and-index"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Executed registry-outward discoverability cleanup"
    next_safe_action: "Proceed to phase 004 runtime cleanup."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-003-plan"
      parent_session_id: "2026-07-04-phase-003-contract-authoring"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Do not edit historical specs for cosmetic cleanup."
      - "Use deprecation stubs for active deep-context agent mirrors instead of deleting them."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Discoverability Docs Mirrors And Index Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, JSON registry/index files, TypeScript/Python advisor projection files |
| **Framework** | deep-loop-workflows registry, system-skill-advisor, OpenCode/Claude agent docs, SpecKit metadata |
| **Storage** | `.opencode/skills/`, `.opencode/agents/`, `.claude/agents/`, root docs, `.opencode/specs/` generated indexes |
| **Testing** | Grep/Glob inventory, advisor drift guard, generated metadata refresh, SpecKit strict validation |

### Overview

Phase 003 updates discoverability only after phase 002 proves new `/deep:context` runs are closed. The work proceeds from the central registry outward: registry decision, advisor projections, parent skill docs, active user docs, orchestrator mirror docs, then generated indexes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 redirect verification recorded.
- [x] Fresh active-doc grep inventory captured.
- [x] Mirror file existence confirmed with Glob/Grep.
- [x] Advisor projection regeneration path identified.

### Definition of Done
- [x] Registry and advisor projections agree on standalone context removal or deprecation.
- [x] Active docs no longer advertise `/deep:context` as a live standalone mode.
- [x] Orchestrator routing no longer references missing deep-context mirror files as active dispatch targets.
- [x] Generated indexes/metadata refreshed or blocker documented.
- [x] Strict child and recursive parent validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Registry-outward discoverability cleanup.

### Key Components
- **Mode registry**: source of truth for public deep-loop mode roster.
- **Advisor projection**: Python and TypeScript routing maps derived from registry semantics.
- **Active docs**: root README/AGENTS and parent skill docs that teach current workflows.
- **Runtime mirror docs**: OpenCode and Claude orchestrator files that select agents.
- **Generated indexes**: descriptions and skill graph surfaces used by search and memory tooling.

### Data Flow

```text
Phase 002 verified redirect
  -> registry mode decision
  -> advisor projection refresh
  -> active docs and orchestrator mirrors
  -> generated indexes and metadata
  -> phase 004 cleanup can remove fixtures/runtime internals
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Public mode roster | Remove or mark standalone `context` deprecated | Registry read plus drift guard |
| `deep-loop-workflows/SKILL.md` | Parent skill discoverability | Update mode roster and replacement guidance | Grep for live-mode wording |
| `aliases.ts` and `skill_advisor.py` | Advisor projections | Regenerate or update through projection workflow | Drift guard and advisor probes |
| `skill-graph.json` | Advisor graph/index | Refresh generated skill graph | Grep/index check |
| `README.md` and `AGENTS.md` | Root current-state docs | Replace live `/deep:context` guidance | Grep active docs |
| `.opencode/agents/orchestrate.md` | OpenCode dispatch routing | Remove or redirect `@deep-context` route | Read/grep routing table |
| `.claude/agents/orchestrate.md` | Claude mirror routing | Mirror routing cleanup if active | Read/grep routing table |
| `.opencode/agents/deep-context.md` | OpenCode agent mirror | Disabled deprecation stub | Frontmatter parse and grep |
| `.claude/agents/deep-context.md` | Claude agent mirror | Disabled deprecation stub | Frontmatter parse and grep |
| `.opencode/specs/descriptions.json` | Generated spec index | Refresh or document generated-pending status | Timestamp/diff/index check |

Required inventories:
- Same-class producers: search active docs and routing files for `/deep:context`, `@deep-context`, `deep-context`, `workflowMode.*context`, and `runtimeLoopType.*context`.
- Consumers of changed symbols: search advisor tests, drift guards, compiled contracts, and generated indexes after registry edits.
- Matrix axes: registry, advisor TypeScript, advisor Python, skill graph, root docs, OpenCode orchestrator, Claude orchestrator, generated descriptions.
- Algorithm invariant: after phase 003, active current-state surfaces must not recommend standalone `deep-context` for new work.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preflight
- [x] Confirm phase 002 redirect behavior passed.
- [x] Capture fresh active discoverability grep inventory.
- [x] Confirm actual mirror file presence or absence.
- [x] Identify projection/index generation commands.

### Phase 2: Registry And Advisor
- [x] Update `mode-registry.json` according to the chosen deprecation representation.
- [x] Refresh advisor projection files.
- [x] Refresh or update `skill-graph.json` if generated by advisor tooling.
- [x] Run routing registry drift guard tests.

### Phase 3: Docs And Mirrors
- [x] Update parent deep-loop skill docs.
- [x] Update root README and AGENTS quick-reference guidance.
- [x] Update OpenCode and Claude orchestrator routing docs and active deep-context mirrors.
- [x] Leave historical archives unchanged unless they feed generated active indexes.

### Phase 4: Index And Validation
- [x] Refresh descriptions/index metadata or document owner warnings.
- [x] Run advisor probes for replacement routing.
- [x] Run active-surface grep to confirm no live standalone guidance remains.
- [x] Refresh phase metadata and run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Active docs grep | README, AGENTS, commands, agents, skills | Grep |
| Registry drift | Registry versus Python/TypeScript advisor projections | Existing drift guard test |
| Advisor behavior | Requests that used to route to standalone deep-context | Skill advisor probes |
| Mirror parity | OpenCode and Claude orchestrator routing docs | Glob, Read, Grep |
| Generated index refresh | descriptions/skill graph metadata | Owner tooling plus diff review |
| Spec validation | Phase 003 and parent packet | `validate.sh --strict`, recursive validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 redirect | Internal phase gate | Green | Redirect proof recorded before cleanup. |
| Advisor projection generation | Internal tooling | Green | Drift guard and projection check passed. |
| Mirror file inventory | Runtime docs | Green | Active OpenCode and Claude mirrors were found and disabled as stubs; Codex mirror was not found. |
| Spec index refresh | Generated metadata | Yellow | Owner tooling refreshed skill graph/indexes; health check still reports unrelated inventory-parity warnings. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor routing breaks, registry drift guard fails, or active docs lose valid replacement guidance.
- **Procedure**: Revert phase 003 registry/advisor/docs/index edits, rerun projection generation to restore prior outputs, and keep phase 002 redirect intact unless its own verification fails.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 002 redirect verified
  -> registry/advisor cleanup
  -> docs/mirror cleanup
  -> generated index refresh
  -> phase 004 can archive internals
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preflight | Phase 002 | Registry edits |
| Registry/advisor | Drift guard tooling | Docs/index consistency |
| Docs/mirrors | Registry decision | Active guidance closure |
| Index validation | All prior edits | Phase 004 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight | Medium | 30-60 minutes |
| Registry/advisor | Medium | 1-2 hours |
| Docs/mirrors | Medium | 1-2 hours |
| Index validation | Medium | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 002 verification evidence recorded.
- [ ] Pre-edit active-reference grep output captured.
- [ ] Projection/index owner commands identified.

### Rollback Procedure
1. Revert registry, advisor, docs, mirror, and index edits from phase 003.
2. Re-run advisor projection generation or drift guard to restore consistency.
3. Re-run active-doc grep to confirm rollback state is understood.
4. Leave phase 002 redirect intact unless phase 002 failed independently.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File-level revert plus generated projection/index refresh.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Redirect proof -> registry -> advisor projections -> docs/mirrors -> indexes -> validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registry decision | Phase 002 proof | Mode roster truth | Advisor/docs cleanup |
| Advisor projection | Registry decision | Routing consistency | Drift guard closure |
| Docs/mirror cleanup | Registry decision and mirror inventory | User-facing consistency | Phase 004 archive work |
| Index refresh | Docs and metadata | Search/memory consistency | Validation closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm phase 002 proof** - 15-30 minutes - CRITICAL
2. **Update registry and advisor projection** - 1-2 hours - CRITICAL
3. **Update active docs and mirrors** - 1-2 hours - CRITICAL
4. **Refresh indexes and validate** - 1-2 hours - CRITICAL

**Total Critical Path**: 3.5-6.5 hours

**Parallel Opportunities**:
- README/AGENTS copy changes can be prepared after the registry decision is known, but final wording should wait for advisor projection results.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Redirect proof accepted | Phase 002 checklist has command behavior evidence | Phase 003 start |
| M2 | Registry/advisor synchronized | Drift guard and advisor probes pass | Phase 003 |
| M3 | Active docs updated | Grep shows no live standalone guidance in current docs | Phase 003 |
| M4 | Index refreshed | Generated metadata no longer advertises active standalone mode | Phase 003 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm phase 002 redirect evidence exists before cleanup edits.
- Read registry, advisor, docs, mirrors, and generated-index owners before editing.
- Verify missing mirror file references with direct Glob before changing routing docs.
- Preserve historical records unless they are active inputs.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Update registry/advisor sources before active docs and mirrors. |
| TASK-SCOPE | Do not change fixtures, benchmarks, compiler source lists, or runtime branches in phase 003. |
| TASK-VERIFY | Run drift guards, targeted grep checks, index refresh checks, and strict validation. |

### Status Reporting Format

Use `phase=003; task=<T###>; status=<pending|in_progress|blocked|complete>; evidence=<file-or-command>`.

### Blocked Task Protocol

If BLOCKED, record the failed proof or owner-tooling gap in `implementation-summary.md`, keep dependent checklist items unchecked, and do not start phase 004.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Registry-Outward Cleanup After Redirect Proof

**Status**: Accepted

**Context**: Discoverability surfaces are downstream of runtime behavior. Updating them first can hide a still-callable command.

**Decision**: clean registry and advisor surfaces only after phase 002 proves public route closure, then update active docs, mirrors, and indexes from that registry decision.

**Consequences**:
- Users may briefly see a redirect for a documented command between phases 002 and 003.
- Cleanup follows a repeatable source-of-truth order instead of scattered text edits.

**Alternatives Rejected**:
- Docs-first cleanup: rejected because registry/advisor could still route users to the old mode.
- Advisor-only cleanup: rejected because root docs and orchestrator tables would still contradict the advisor.
