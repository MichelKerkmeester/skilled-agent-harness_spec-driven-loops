---
title: "Implementation Plan: Deprecate Standalone Deep Context"
description: "Stage the deprecation of standalone deep-context surfaces, migrate reuse-first codebase context capabilities into deep-research and deep-review, then clean up routing, generated command contracts, advisor metadata, docs, and mirrors."
trigger_phrases:
  - "deep-context deprecation plan"
  - "deep-loop context cleanup"
  - "research review context snapshot"
  - "deep router context removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/038-deprecate-deep-context-integrate-capabilities"
    last_updated_at: "2026-07-04T13:24:26Z"
    last_updated_by: "opencode"
    recent_action: "Completed research synthesis"
    next_safe_action: "Implement /deep:context redirect stub"
    blockers: []
    key_files:
      - ".opencode/commands/deep/context.md"
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/commands/deep/assets/deep_context_confirm.yaml"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-deep-context-deprecation-plan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Stage deprecation before deletion."
      - "Deep-research completed 10 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deprecate Standalone Deep Context

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command/agent docs, YAML workflow assets, JSON registry/metadata, Python/TypeScript advisor code, JavaScript command-contract tooling |
| **Framework** | OpenCode skills, agents, commands, SpecKit, deep-loop runtime |
| **Storage** | Spec folders, generated descriptions, skill advisor SQLite graph/index |
| **Testing** | SpecKit strict validation, command-contract compiler tests, advisor routing probes, deep-loop runtime/unit tests, grep/mirror parity checks |

### Overview

This implementation should happen in stages: first stop new standalone context usage with a visible redirect, then add context snapshot support to research and review, then remove discoverability and stale docs once replacements are verified. The safest path avoids deleting `deep-context` internals until research/review parity and routing checks prove that no live surface still depends on it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [Source: spec.md]
- [x] Existing active surfaces inventoried enough to plan. [Source: `.opencode/skills/deep-loop-workflows/mode-registry.json`; `.opencode/commands/deep/context.md`; `.opencode/agents/deep-context.md`]
- [x] Staged deprecation chosen over hard delete. [Source: decision-record.md]
- [ ] Command-contract compiler source locations confirmed before generated command edits. [Source: pending implementation search]

### Definition of Done
- [ ] `/deep:context` no longer launches standalone context workflow. [Test: planned command routing check]
- [ ] Research/review context snapshot behavior is documented and verified. [Test: planned targeted loop or contract tests]
- [ ] Advisor routing and skill graph no longer expose standalone `deep-context`. [Test: planned skill_advisor.py probes]
- [ ] Cross-runtime mirrors and public docs no longer advertise standalone context as active. [Test: planned grep parity]
- [ ] SpecKit strict validation passes for this packet and any implementation packet updates. [Test: planned validate.sh --strict]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Staged deprecation with capability migration.

### Key Components
- **Deprecated standalone surface**: `/deep:context`, its YAML workflows, presentation asset, nested `deep-context` skill packet, and native/mirror agents.
- **Replacement capability**: context snapshot sections inside `deep-research` and `deep-review` artifacts, with reuse-first pointers and gaps.
- **Routing layer**: `deep-loop-workflows/mode-registry.json`, generated command contracts, advisor Python/TypeScript projections, skill graph/index metadata, AGENTS/README guidance.
- **Verification layer**: strict spec validation, command compiler checks, advisor probes, runtime tests, mirror parity grep.

### Data Flow

```text
User asks for codebase context
  -> quick one-shot lookup: @context
  -> multi-round investigation: /deep:research with codebase context snapshot
  -> audit/release-readiness: /deep:review with context coverage
  -> direct /deep:context: deprecation redirect, no legacy YAML execution
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/context.md` | Public standalone command router | Replace active execution path with deprecation redirect, then archive/delete after migration | Grep for legacy YAML load and direct command check |
| `.opencode/commands/deep/assets/deep_context_*.yaml` | Standalone loop workflows | Remove from active command path; archive if needed for history | Grep for references after command stub |
| `.opencode/agents/deep-context.md` | Native read-only context seat | Deprecate then remove from active agent roster | Agent inventory grep and mirror parity |
| `.claude/agents/deep-context.md` | Runtime mirror | Mirror canonical deprecation/removal | Mirror grep and diff scope |
| `.opencode/skills/deep-loop-workflows/deep-context/` | Nested mode packet | Archive/delete after replacement docs and tests pass | Directory inventory and skill advisor graph probe |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Mode source of truth | Remove or mark context inactive after redirect stage | Registry drift guard and mode projection tests |
| `.opencode/skills/deep-loop-workflows/deep-research/**` | Replacement investigation loop | Add codebase context snapshot contract | Research command/docs tests and artifact fixture |
| `.opencode/skills/deep-loop-workflows/deep-review/**` | Replacement audit loop | Add context coverage snapshot contract | Review command/docs tests and report fixture |
| `.opencode/skills/system-skill-advisor/**` | Routing/index layer | Remove standalone discoverability and refresh graph/index | `skill_advisor.py` probes and drift guard |
| Root docs and orchestrator agents | User guidance | Replace active `/deep:context` guidance with migration paths | Grep for active standalone claims |

Required inventories:
- Same-class producers: `rg -n '/deep:context|deep-context|workflowMode.*context|context-report' .opencode README.md AGENTS.md .claude`.
- Consumers of changed symbols and files: `rg -n 'deep_context|context-report|context/|@deep-context' .opencode README.md AGENTS.md .claude`.
- Matrix axes: command surface, agent surface, nested skill packet, registry/advisor, docs/mirrors, runtime tests, historical specs.
- Algorithm invariant: a deprecated command must fail closed and never launch legacy context YAML.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-run live inventory for `deep-context`, `/deep:context`, `@deep-context`, `context-report`, and `context/` references.
- [ ] Classify each hit as active runtime, active docs, generated metadata, fixture/test, historical archive, or false positive.
- [ ] Confirm command-contract compiler source files for research/review before editing generated command docs.
- [ ] Capture baseline verification failures, if any, before modifying runtime surfaces.

### Phase 2: Implementation
- [ ] Add replacement context snapshot contract to `deep-research`: reuse candidates, integration points, conventions, dependencies, gaps, evidence rules, and artifact placement.
- [ ] Add replacement context coverage contract to `deep-review`: context snapshot inputs, review report section, resource-map relationship, and gaps affecting verdict confidence.
- [ ] Stub or rewrite `/deep:context` as deprecated redirect that cannot execute legacy YAML.
- [ ] Remove active references from mode registry, hub docs, command lists, orchestrator docs, README, and mirrors in the same staged change.
- [ ] Retire or archive `deep-context` packet assets only after replacement and redirect checks pass.
- [ ] Update advisor metadata/projection/index inputs so standalone `deep-context` is not recommended as a callable mode.

### Phase 3: Verification
- [ ] Run command-contract compiler and tests for generated research/review docs.
- [ ] Run deep-loop/advisor routing tests and direct advisor probes.
- [ ] Run grep-based active-reference scan and mirror parity scan.
- [ ] Run runtime tests that cover convergence, reducer, artifact-root, and deep-loop registry behavior.
- [ ] Run strict SpecKit validation for this packet and any modified spec folders.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | New planning packet and any touched spec folders | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Command contract | Research/review command generation and router text | `node .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` plus existing tests |
| Advisor routing | `deep-loop-workflows` mode projection and absence of standalone context recommendation | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py ... --threshold 0.8` |
| Registry drift | `mode-registry.json` projection vs Python/TypeScript maps | Existing routing-registry drift guard test |
| Runtime | Deep-loop convergence/reducer/artifact-root behavior | Existing vitest or targeted package tests under deep-loop/system-skill-advisor surfaces |
| Mirror parity | OpenCode and Claude agent/doc inventories | Grep plus targeted reads/diffs |
| Manual | Direct `/deep:context` behavior | Verify redirect text and no legacy YAML execution |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loop-runtime/scripts/compile-command-contracts.cjs` | Internal tooling | Green, known file exists | Generated command docs may drift if unavailable. |
| Skill advisor SQLite graph/index | Internal metadata | Yellow, requires refresh after edits | Routing may keep stale standalone context recommendations. |
| Runtime convergence `context` support | Internal tests | Yellow, dependency must be tested | Removing internal loop type too early may break tests. |
| `.claude` mirrors | Runtime packaging | Yellow, active mirror exists | Claude runtime may still expose deprecated agent if not updated. |
| Historical specs/descriptions | Memory/index evidence | Green, preserve by default | Cosmetic cleanup could create churn and stale memory confusion. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research/review context snapshots fail to replace required behavior, `/deep:context` redirect breaks known workflows without an alternative, advisor routing becomes inconsistent, or runtime tests fail on context loop cleanup.
- **Procedure**: Revert the staged deprecation commits that touch command/registry/advisor/docs while leaving this planning packet intact. If only runtime cleanup fails, restore `context` as an internal runtime loop type while keeping the public command deprecated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 inventory
  -> Phase 2a research/review context snapshot
  -> Phase 2b /deep:context redirect
  -> Phase 2c registry/advisor/docs cleanup
  -> Phase 3 verification

Runtime loop-type removal depends on Phase 3 tests proving no live dependency.
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | All implementation changes |
| Research/review integration | Inventory | Safe command deprecation |
| Command redirect | Research/review integration | Registry/advisor cleanup |
| Registry/advisor/docs cleanup | Command redirect | Completion |
| Runtime cleanup | Passing runtime tests | Optional internal follow-up |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and baseline | Medium | 1-2 hours |
| Research/review integration | High | 4-8 hours |
| Command deprecation and docs cleanup | Medium | 2-4 hours |
| Advisor/registry/index cleanup | Medium | 2-4 hours |
| Verification and fixes | High | 3-6 hours |
| **Total** | | **12-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture baseline grep inventory for active standalone context references.
- [ ] Capture baseline advisor routing output for deep context/research/review prompts.
- [ ] Capture baseline test status for command-contract and advisor routing tests.

### Rollback Procedure
1. Restore `/deep:context` router and YAML references from git if replacement behavior is rejected.
2. Restore `mode-registry.json` context entry if registry cleanup breaks routing tests.
3. Restore advisor projection/index inputs and re-run graph refresh if skill advisor probes fail.
4. Restore `.opencode` and `.claude` agent mirrors together if one runtime loses a required surface.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert plus advisor/spec metadata regeneration as needed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Inventory -> Replacement capability -> Command redirect -> Routing cleanup -> Verification
                 |                         |                 |
                 v                         v                 v
          research/review docs      no legacy YAML       advisor/index/docs
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory | Current repository search | Active/historical classification | All edits |
| Research context snapshot | Inventory and deep-research contract | Replacement planning context | Command redirect |
| Review context coverage | Inventory and deep-review contract | Replacement audit context | Command redirect |
| Deprecated command stub | Replacement docs | Safe user-facing redirect | Registry cleanup |
| Registry/advisor cleanup | Command stub | No standalone routing | Completion |
| Runtime cleanup | Passing tests | Internal removal of `context` loop type | Optional follow-up |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory active surfaces** - 1-2 hours - CRITICAL
2. **Define and wire research/review context snapshots** - 4-8 hours - CRITICAL
3. **Convert `/deep:context` to deprecation redirect** - 1-2 hours - CRITICAL
4. **Clean registry/advisor/docs/mirrors** - 3-6 hours - CRITICAL
5. **Run and fix verification gates** - 3-6 hours - CRITICAL

**Total Critical Path**: 12-24 hours

**Parallel Opportunities**:
- Docs/reference cleanup can run after the command redirect contract is known.
- Advisor routing cleanup can be prepared while research/review contracts are being written, but should not land before command redirect behavior is final.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory complete | Every hit is classified active, generated, fixture, archive, or false positive | Phase 1 |
| M2 | Replacement behavior documented | Research/review specs name context snapshot behavior with evidence rules | Phase 2 |
| M3 | Standalone command deprecated | `/deep:context` cannot launch legacy YAML | Phase 2 |
| M4 | Routing cleanup complete | Registry/advisor/docs agree on supported modes | Phase 2 |
| M5 | Verification complete | Tests, probes, grep parity, and strict validation pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Stage deprecation and integrate capabilities

**Status**: Proposed

**Context**: `deep-context` duplicates codebase context behavior and creates extra routing/maintenance surfaces, but it contains useful concepts such as reuse-first reports, agreement-weighted findings, relevance floors, and pointers-not-bodies citations.

**Decision**: Deprecate standalone context in stages and migrate useful capabilities into research/review loops.

**Consequences**:
- Users keep context value through stronger existing loops.
- The system loses one public mode and one native seat surface.
- Implementation must prove replacement behavior before deleting the old packet.

**Alternatives Rejected**:
- Immediate hard delete: too risky because runtime tests and docs still mention context.
- Keep standalone context indefinitely: preserves duplication and advisor/doc drift.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target file immediately before editing it.
- [ ] Confirm the edit belongs to the staged phase currently being executed.
- [ ] Confirm generated surfaces are updated through their generator when available.

### Execution Rules
| Rule | Description |
|------|-------------|
| Sequence | Complete inventory before modifying public routing. |
| Scope | Do not rewrite historical archived specs unless they are active fixtures or index inputs. |
| Evidence | Every removal must have a grep-backed active-reference check. |
| Mirrors | Update OpenCode and Claude mirrors together when agent docs change. |

### Status Reporting Format
After each implementation phase, report files changed, verification run, failures, and whether runtime cleanup remains deferred.

### Blocked Task Protocol
If tests show `context` is still required internally, stop public-surface cleanup at deprecation and record internal runtime cleanup as a follow-up rather than forcing removal.
