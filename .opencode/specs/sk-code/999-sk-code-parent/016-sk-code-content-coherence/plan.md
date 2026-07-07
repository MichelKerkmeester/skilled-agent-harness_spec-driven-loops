---
title: "Implementation Plan: Phase 016 sk-code content coherence and reference integrity"
description: "Executed plan for sk-code content coherence: audit-driven repair/playbook/benchmark/relocation tasks verified already-satisfied after the 013 restructure (0 broken refs, STRICT 0/0, vocab-sync 0/0/0); metadata cleanup shipped in af1170c663."
trigger_phrases:
  - "sk-code content coherence plan"
  - "sk-code reference integrity plan"
  - "phase 016 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase closed by verification; sk-code STRICT 0/0"
    next_safe_action: "124 rollup"
---
# Implementation Plan: Phase 016 sk-code content coherence and reference integrity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript/TypeScript verification utilities, Python verifier script |
| **Framework** | OpenCode parent-hub skill canon and system-spec-kit phase documentation |
| **Storage** | Repository filesystem |
| **Testing** | Markdown link checker, router-sync/vocab-sync vitests, parent-skill-check strict, benchmark re-baseline review |

### Overview
This phase will turn the audit's sk-code content findings into a narrow repair sequence. It starts with a baseline of current reference and playbook failures, fixes path/reference drift and semantic stale bodies by sub-skill, refreshes hub metadata after canon vocabulary is settled, relocates the single spec-kit hooks document, and ends with deterministic link, router, vocabulary, and parent-hub verification.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 017 metadata vocabulary decision confirmed not blocking (metadata already two-axis coherent).
- [x] sk-code link-check baseline captured — 0 broken references (the audit's 30/8/5 counts predated the 013 restructure).
- [x] Playbook stale-body occurrences inventoried — none live; paths resolve post-013.
- [x] Relocation disposition selected — superseded (ADR-002); no live hooks-ref defect.

### Definition of Done
- [x] sk-code link checker reports 0 broken live references.
- [x] Router and vocabulary coverage is non-vacuous (parent-skill-check 5b/5c; vocab-sync 0/0/0).
- [x] Parent-skill-check strict remains 0 failures for sk-code.
- [x] code-quality P0, code-verify P0, and surface/shared P1 alignment findings closed (verified already-satisfied).
- [x] Benchmark baseline is intact add-only and historical benchmark evidence untouched (9b pass; no re-derivation needed).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Content-coherence repair over a canonical two-axis parent hub. Workflow packets own process behavior; surface packets own read-only evidence; hub metadata is the single advisor/skill-graph canon record.

### Key Components
- **Reference layer**: Markdown links, plain-text load paths, RESOURCE_MAP entries, and playbook body assertions across sk-code packets.
- **Hub metadata**: `description.json` and `graph-metadata.json` at sk-code root, refreshed as the copyable canon reference.
- **Surface packets**: `webflow/`, `opencode/`, and `animation/`, plus `shared/` surface-detection material.
- **Workflow packets**: code-quality and code-verify P0 alignment repairs, with review/code-implement/code-debug only touched if reference checks identify live drift.
- **Spec-kit relocation**: one hooks document moves from the OpenCode surface packet to system-spec-kit references.

### Data Flow
Audit findings seed inventories, inventories drive targeted edits, edits feed deterministic checks, and the benchmark/playbook refresh replays current nested packet paths back into user-facing validation material.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-code manual playbook | Human scenario source for routing and content checks | Re-derive stale bodies from nested packet layout | Link check plus scenario file review |
| sk-code hub metadata | Canon advisor and skill-graph reference copied by other hubs | Refresh prose to two-axis model | JSON inspection plus parent-skill-check strict |
| code-quality packet | Quality gate workflow docs | Repoint dead OpenCode checklist paths | Link check and sk-doc alignment review |
| code-verify packet | Verification workflow docs and stack-folder verifier | Re-anchor verifier and repoint instructions | Script run plus README/SKILL path checks |
| webflow/opencode/animation/shared | Surface and shared evidence docs | Close P1 path/orphan/duplicate/useless findings | Link check, router-sync, vocab-sync |
| system-spec-kit references | Correct owner for spec-kit hook docs | Receive relocated hooks doc | Reference sweep and link check |

Required inventories before edits:
- Same-class references: `rg -n 'references/(webflow|opencode|motion_dev)|code_surface_detection|assets/opencode-checklists|RESOURCE_MAP' .opencode/skills/sk-code`.
- Consumers of relocated hooks doc: `rg -n 'hooks\.md|Runtime Hooks|Spec Kit MCP Hook Entrypoints' .opencode/skills/sk-code .opencode/skills/system-spec-kit`.
- Benchmark stale paths: inspect latest sk-code benchmark baseline for flat-era path strings before adding a new baseline.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture current link-check, router-sync, vocab-sync, and parent-skill-check baselines for sk-code.
- [ ] Inventory stale playbook body references and stale benchmark baseline references.
- [ ] Confirm phase 017 canon vocabulary impact on hub metadata refresh.

### Phase 2: Core Implementation
- [ ] Repair broken, useless, and duplicate references across sk-code packets.
- [ ] Re-derive manual-testing playbook scenario bodies from current packet files.
- [ ] Close code-quality and code-verify P0 alignment findings.
- [ ] Close webflow/opencode/animation/shared P1 sk-doc alignment findings.
- [ ] Refresh sk-code `description.json` and `graph-metadata.json` as two-axis canon metadata.
- [ ] Relocate the misfiled spec-kit hooks document and repoint references.
- [ ] Add a fresh benchmark baseline against current nested paths.

### Phase 3: Verification
- [ ] Run sk-code markdown link checker and confirm 0 broken live references.
- [ ] Run router-sync and vocab-sync vitests.
- [ ] Run parent-skill-check strict for sk-code.
- [ ] Verify relocated hooks references and benchmark baseline freshness.
- [ ] Update phase checklist with evidence only after implementation checks pass.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link integrity | sk-code Markdown links and plain-text reference paths | `check-markdown-links.cjs`, targeted grep sweeps |
| Router sync | nested packet resource map and routing prose | sk-code router-sync vitest |
| Vocabulary sync | aliases, vocabulary ownership, surface bundle terms | vocab-sync vitest |
| Parent hub contract | sk-code registry, router, metadata, companion directories | `parent-skill-check` with strict mode |
| Playbook validation | scenario bodies and expected source paths | Manual review plus link/path grep |
| Benchmark freshness | new baseline path claims | Baseline artifact review and stale-path grep |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 017 canon metadata decisions | Internal | Yellow | Hub metadata refresh may need rework if vocabulary changes |
| sk-code post-013 two-axis layout | Internal | Green | Required source of truth for path re-derivation |
| Audit digest phase 016 findings | Internal | Green | Defines repair scope and evidence trace |
| Link checker and vitests | Internal | Green | Required completion gates for reference integrity |
| Benchmark generation/re-derivation path | Internal | Yellow | Must be add-only and may need current benchmark workflow confirmation |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Link, router, vocab, parent-hub, or benchmark checks regress after implementation edits.
- **Procedure**: Revert only phase 016 implementation edits in sk-code and system-spec-kit references, preserve this planning folder, and re-run the same baseline checks to confirm sk-code returns to its pre-phase state.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Audit digest and master plan phase 016 | Core Implementation |
| Core Implementation | Setup baseline and phase 017 metadata decision if applicable | Verification |
| Verification | Core Implementation | Phase 019 benchmark and promotion rollup |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Baseline and inventory across references, playbooks, benchmark, metadata |
| Core Implementation | High | Multi-packet content repair plus relocation and add-only benchmark |
| Verification | High | Link, router, vocab, parent-hub, relocation, and benchmark gates |
| **Total** | | **Large content-coherence repair** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Current baselines captured before implementation edits.
- [ ] Scope limited to sk-code content plus the single system-spec-kit relocation.
- [ ] Historical benchmark artifacts identified before adding a new baseline.

### Rollback Procedure
1. Revert implementation edits in sk-code and system-spec-kit references from the phase branch or commit.
2. Re-run link checker, router-sync, vocab-sync, and parent-skill-check strict.
3. Confirm no historical benchmark package was overwritten.
4. Restore relocation source only if the paired repoints cannot be made green.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert or targeted file restoration for Markdown, JSON, Python, and benchmark files changed during implementation.

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Audit + master plan
  -> Phase 1 baselines
  -> Phase 2 reference/playbook/sub-skill repairs
  -> Phase 2 metadata refresh and relocation
  -> Phase 2 add-only benchmark
  -> Phase 3 deterministic verification
  -> Phase 019 rollup readiness
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline inventory | Audit digest and current tree | Failure list and stale-body map | All edits |
| Reference repair | Baseline inventory | Link-clean sk-code references | Playbook, router, and parent-hub verification |
| Metadata refresh | Phase 017 decision or current canon terms | Canon two-axis metadata | Phase 019 rollup and other hub copying |
| Hooks relocation | Relocation inventory | system-spec-kit-owned hooks doc | Final link check |
| Benchmark baseline | Repaired playbook/reference paths | Fresh add-only baseline | Phase 019 benchmark comparison |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture current failure inventory** - required before any repair.
2. **Repair references and re-derive playbook bodies** - required before meaningful link/router verification.
3. **Refresh metadata and relocate hooks doc** - required before parent-hub and relocation checks.
4. **Add benchmark baseline** - required before final stale-path sweep.
5. **Run deterministic verification gates** - required before completion can be claimed.

**Total Critical Path**: Baseline -> repair -> metadata/relocation -> benchmark -> verification.

**Parallel Opportunities**:
- code-quality P0, code-verify P0, and surface/shared P1 alignment can run in separate file clusters after baseline capture.
- Benchmark baseline can begin after playbook/reference paths are stable.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Failure inventory agrees with audit or documents deltas | Start of execution |
| M2 | Content repairs complete | References, playbooks, sub-skill alignment, and relocation edits are ready for gates | Core implementation |
| M3 | Canon metadata refreshed | Hub metadata describes current two-axis model | Before final checks |
| M4 | Verification green | Link, router, vocab, parent-hub, benchmark, and relocation checks pass | Phase close |

<!-- /ANCHOR:milestones -->
---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Refresh sk-code metadata as the canon two-axis reference

**Status**: Proposed for phase execution.

**Context**: The master plan says sk-code metadata is the reference other hubs copy, but audit findings show hub-root prose still lags the two-axis model.

**Decision**: Refresh `description.json` and `graph-metadata.json` to name the registry/router model, workflowMode, packetKind, surface packets, and surfaceBundle.

**Consequences**:
- Other hubs copy the current canon rather than stale flat-era wording.
- Metadata edits must wait for or tolerate phase 017 vocabulary decisions.

**Alternatives Rejected**:
- Leave metadata to phase 019 rollup: rejected because this phase is the headline sk-code coherence phase and metadata is foundational.

---

## L3: AI Execution Protocol

### Pre-Task Checklist

- [ ] Read `spec.md`, `tasks.md`, `checklist.md`, and `decision-record.md` before implementation.
- [ ] Capture current sk-code link, router, vocab, and parent-hub baselines before edits.
- [ ] Confirm whether phase 017 metadata vocabulary decisions affect hub metadata wording.
- [ ] Confirm file ownership for each sub-skill repair cluster before editing.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Edit only sk-code content plus the single system-spec-kit hooks relocation during execution. |
| Planned state | Keep task and checklist items unchecked until implementation verification provides evidence. |
| Baseline first | Do not repair references before capturing the current failure inventory. |
| Semantic repair | Re-derive stale playbook and benchmark bodies from current packet files rather than doing only string rewrites. |
| Verification gate | Do not claim completion until link, router, vocab, parent-hub, relocation, and benchmark checks pass. |

### Status Reporting Format

Use this format for implementation handoff updates:

```text
phase: 016
status: planned | in-progress | blocked | verified
completed_tasks: T### list
next_task: T###
verification: command -> result
blockers: blocker list or none
```

### Blocked Task Protocol

If a task is blocked, leave it unchecked, add `[B]` in `tasks.md`, record the blocker in `_memory.continuity.blockers`, and state the next safe action. Do not convert a blocked item into a completed checklist item without explicit evidence or user-approved deferral.
