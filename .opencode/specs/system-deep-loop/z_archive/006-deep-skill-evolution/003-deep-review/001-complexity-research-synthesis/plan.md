---
title: "Implementation Plan: Deep Review Complexity Research"
description: "Plan for an evidence-only 15-iteration deep-research run that investigates why deep-review can miss bugs found by focused bug-hunt research loops. The run uses cli-codex with gpt-5.5, high then continuation xhigh reasoning, and fast service tier."
trigger_phrases:
  - "deep-review complexity plan"
  - "deep-research bug finding plan"
  - "review depth research plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/001-complexity-research-synthesis"
    last_updated_at: "2026-05-22T08:35:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed 15-iteration auto-mode research execution."
    next_safe_action: "Use synthesis to scope follow-up implementation packet."
    blockers: []
    key_files:
      - "research/deep-research-config.json"
      - "research/deep-research-state.jsonl"
      - "research/iterations/"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "116-deep-review-complexity-auto-research"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep Review Complexity Research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML workflows, TypeScript/Node support scripts |
| **Framework** | OpenCode Spec Kit, deep-loop skills, Codex CLI executor |
| **Storage** | Packet-local markdown, JSONL state, JSON metadata |
| **Testing** | `validate.sh`, artifact inspection, memory index scan |

### Overview
This plan prepares a populated Level 3 packet and runs the deep-research auto workflow against the deep-review depth problem. The output is a research synthesis and prioritized recommendation backlog, not implementation changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2-4.
- [x] Success criteria measurable. Evidence: `spec.md` section 5.
- [x] Dependencies identified. Evidence: `spec.md` section 6 and this plan section 6.

### Definition of Done
- [x] 15 deep-research iterations complete or a workflow-owned halt reason is recorded.
- [x] Research artifacts include config, state log, per-iteration markdown, deltas, dashboard, registry, and synthesis.
- [x] Final synthesis ranks findings and recommendations.
- [x] Packet metadata validates after continuation updates.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-owned iterative research loop with externalized state and fresh executor context per iteration.

### Key Components
- **Spec packet**: Defines scope, acceptance criteria, and verification evidence.
- **Deep-research workflow**: Owns state, prompts, iteration artifacts, convergence, reducer updates, and synthesis.
- **CLI Codex executor**: Runs initial iterations with `gpt-5.5`, `high`, and `fast`; continuation iterations use `gpt-5.5`, `xhigh`, and `fast`.
- **Research synthesis**: Consolidates iteration findings into a recommendation backlog for deep-review improvements.

### Data Flow
Spec docs establish the research charter. The workflow initializes `research/` state, renders a prompt pack per iteration, dispatches Codex, validates required artifacts, reduces state, then synthesizes `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research packet, so actions below are inspection-only until a follow-up implementation packet is approved.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-review/` | Defines review skill behavior and constraints. | Inspect for shallow-review causes. | Iteration citations and synthesis references. |
| `.opencode/agents/deep-review.md` | Single-iteration review agent contract. | Inspect focus, tool budget, output pressure, and LEAF constraints. | Iteration citations and synthesis references. |
| `.opencode/commands/deep/start-review-loop.md` | Entrypoint and setup behavior for review loop. | Inspect setup defaults and command constraints. | Iteration citations and synthesis references. |
| `.opencode/commands/deep/assets/deep_start-review-loop_*.yaml` | Deep-review state machine and convergence behavior. | Inspect iteration focus, validation, and synthesis gates. | Iteration citations and synthesis references. |
| `.opencode/skills/deep-research/` | Comparative workflow that may find more bugs. | Identify transferable bug-hunt mechanics. | Cross-workflow comparison in synthesis. |

Required inventories:
- Same-class producers: search for `deep-review`, `bug`, `finding`, `focus`, `convergence`, `severity`, `class-of-bug`, and `evidence` across deep-loop surfaces.
- Consumers of changed symbols: deferred until implementation recommendations target concrete files.
- Matrix axes: workflow phase, prompt constraints, iteration focus, evidence requirements, convergence signals, and synthesis behavior.
- Algorithm invariant: deep-review should force adversarial bug discovery and class-of-bug coverage before declaring convergence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Repair and Metadata
- [x] Replace scaffold placeholders with concrete research scope.
- [x] Generate `description.json` and refresh `graph-metadata.json`.
- [x] Validate packet docs.

### Phase 2: Implementation
- [x] Initialize `research/` state with executor settings.
- [x] Run iterations 001-015 through the command-owned workflow semantics.
- [x] Validate narrative, state-log, and delta artifacts for each iteration.

### Phase 3: Verification
- [x] Generate or update `research/research.md` from iteration evidence.
- [ ] Index packet artifacts with Spec Kit Memory after continuation updates.
- [ ] Present continuation findings and recommendations to the user.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Packet docs and metadata | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Artifact validation | Iteration files, JSONL state, deltas, synthesis | Read/inspection plus reducer output |
| Indexing validation | Memory visibility for packet docs | `memory_index_scan` |
| Git safety | Confirm implementation surfaces were not modified | `git diff -- .opencode/skills/deep-review .opencode/commands/spec_kit` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `codex` CLI | External CLI | To preflight before loop | Cannot satisfy requested executor route. |
| OpenAI auth or Codex OAuth | External auth | To preflight before loop | Codex iterations fail. |
| `/deep:start-research-loop` workflow assets | Internal | Available | Loop state and artifacts cannot be produced without them. |
| Deep-review source surfaces | Internal | Available | Research cannot compare actual review behavior. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Metadata generation or research initialization corrupts packet state.
- **Procedure**: Stop, preserve errors, and repair only this packet's spec docs or `research/` artifacts. Do not modify deep-review implementation surfaces.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Packet Repair -> Deep-Research Execution -> Synthesis and Reporting
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet Repair | Existing spec folder | Deep-Research Execution |
| Deep-Research Execution | Valid metadata and Codex auth | Synthesis and Reporting |
| Synthesis and Reporting | Iteration artifacts | User-facing recommendations |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet Repair | Medium | 20-40 minutes |
| Deep-Research Execution | High | 15 iteration runtimes |
| Synthesis and Reporting | Medium | 30-60 minutes |
| **Total** | | **Time dominated by Codex iteration duration** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment involved.
- [x] No implementation changes planned in this packet.
- [ ] Preserve research state before any restart.

### Rollback Procedure
1. Stop the research loop.
2. Keep existing artifacts for diagnosis.
3. If a fresh run is needed, archive `research/` under packet-local archive storage before restarting.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove or archive generated packet-local research artifacts only if the user approves.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Spec docs
  -> description.json + graph-metadata.json
  -> research/deep-research-config.json
  -> prompts/iteration-NNN.md
  -> Codex iteration output
  -> state log + deltas
  -> reducer dashboard + registry
  -> research/research.md
  -> user synthesis
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec packet | User request | Scope and requirements | Research init |
| Research init | Spec packet and workflow assets | Config, strategy, state log | Iteration dispatch |
| Codex executor | Auth and prompt pack | Iteration findings | Reducer and synthesis |
| Reducer | Valid JSONL and deltas | Registry, dashboard, strategy | Final synthesis |
| Synthesis | Iteration evidence | Recommendations | User delivery |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Packet repair** - Required before metadata/indexing.
2. **Codex preflight** - Required before executor dispatch.
3. **Iterations 001-010** - Sequential because each iteration consumes reduced state from the previous pass.
4. **Final synthesis** - Requires all available iteration evidence.

**Total Critical Path**: Packet repair plus 10 sequential Codex iterations plus synthesis.

**Parallel Opportunities**:
- None for iteration execution because the deep-research workflow is stateful and sequential.
- Metadata validation and git safety checks can run after synthesis in either order.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet ready | Spec docs populated and metadata exists | Before iteration 001 |
| M2 | Research complete | 10 iteration artifacts or documented halt | After iteration 010 |
| M3 | Recommendations ready | Synthesis ranks findings and next actions | Final response |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use Deep Research Before Changing Deep Review

**Status**: Accepted

**Context**: The user reported that deep-research sometimes finds more bugs than deep-review when the research loop is aimed at bug finding.

**Decision**: Run an evidence-only deep-research loop before implementing any deep-review changes.

**Consequences**:
- Improves confidence that follow-up changes target real workflow gaps.
- Costs one research cycle before remediation, but avoids speculative workflow edits.

**Alternatives Rejected**:
- Directly modify deep-review prompts now: rejected because the likely depth failure modes need evidence first.
