---
title: "Feature Specification: Deprecate Standalone Deep Context"
description: "Deprecate the standalone deep-context command, agent, and nested mode while moving its useful codebase-context capabilities into deep-research and deep-review. The change must preserve reuse-first code discovery without keeping a separate callable context loop."
trigger_phrases:
  - "deep-context deprecation"
  - "deprecate /deep:context"
  - "integrate context report into deep research"
  - "integrate context report into deep review"
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
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/commands/deep/context.md"
      - ".opencode/agents/deep-context.md"
      - ".opencode/skills/deep-loop-workflows/deep-context/SKILL.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/SKILL.md"
      - ".opencode/skills/deep-loop-workflows/deep-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-deep-context-deprecation-plan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "User approved creating this planning packet with 'Run plan'."
      - "Deep-research completed 10 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deprecate Standalone Deep Context

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The deep-loop framework currently exposes a separate `context` workflow through `deep-loop-workflows`, `/deep:context`, `@deep-context`, command YAML assets, and a nested `deep-context` skill packet. This duplicates codebase-discovery behavior that can be folded into the existing `deep-research` and `deep-review` loops, while keeping the reuse-first Context Report ideas that made the context loop valuable.

**Key Decisions**: stage deprecation instead of deleting blindly; integrate reusable context capabilities into research and review rather than keeping `@deep-context` as a callable dependency.

**Critical Dependencies**: command-contract generation for research/review, advisor routing projection and skill graph refresh, cross-runtime agent/docs mirror parity, runtime tests that still know about `loop_type='context'`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-04 |
| **Branch** | Current workspace branch |
| **Spec Folder** | `.opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`deep-context` is still a live workflow mode in `.opencode/skills/deep-loop-workflows/mode-registry.json`, has a callable `/deep:context` router, owns separate workflow YAML assets, and has canonical plus mirrored agents. It creates a third codebase-analysis lane beside `deep-research` and `deep-review`, while the research/review agents already expose code graph and repository search capabilities.

### Purpose

Deprecate standalone `deep-context` surfaces while preserving useful codebase-context features as shared context-snapshot behavior inside `deep-research` and `deep-review`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Stage a soft deprecation for `/deep:context` with a clear redirect to `deep-research` or `deep-review` based on user intent.
- Retire or archive the standalone `@deep-context` agent, nested `deep-context` skill packet, command assets, behavior benchmarks, feature catalog, manual playbook, reducer, and context-specific references after parity checks pass.
- Remove or adjust `context` mode entries in `mode-registry.json`, `deep-loop-workflows` hub docs, advisor routing notes, command lists, orchestrator docs, README sections, and runtime mirrors.
- Add a shared codebase context snapshot concept to `deep-research` and `deep-review`: reuse candidates, integration points, conventions, dependency edges, gaps, and cited file pointers.
- Keep runtime `context` loop-type cleanup as a separately verified internal phase if existing convergence tests still rely on it.

### Out of Scope

- Rewriting historical archived specs solely to remove old `deep-context` mentions. Historical packets stay as records unless they are active fixtures or index inputs.
- Replacing the general `@context` retrieval agent. That one-shot retrieval surface remains separate from deep-loop deprecation.
- Changing `deep-ai-council` or `deep-improvement` behavior except for documentation lists that enumerate available modes.
- Implementing a new standalone context loop under another name.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/context.md` | Modify then retire/archive | First becomes a deprecation stub, later removed or archived after redirect parity is verified. |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modify/archive | Stop executing new standalone context runs; preserve only if needed for migration evidence. |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Modify/archive | Same staged handling as auto workflow. |
| `.opencode/commands/deep/assets/deep_context_presentation.txt` | Modify/archive | Replace active presentation with deprecation/redirect messaging or archive with command. |
| `.opencode/agents/deep-context.md` | Modify/archive/delete | Remove callable native seat after research/review context snapshots cover the use case. |
| `.claude/agents/deep-context.md` | Modify/archive/delete | Keep mirror parity with canonical agent change. |
| `.opencode/skills/deep-loop-workflows/deep-context/` | Archive/delete | Retire nested mode packet and associated references/assets after migration. |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Modify | Remove or mark `workflowMode: context` after command redirect is stable. |
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Modify | Document four active workflow families and context capabilities inside research/review. |
| `.opencode/skills/deep-loop-workflows/deep-research/**` | Modify | Add codebase-context snapshot contract and report integration. |
| `.opencode/skills/deep-loop-workflows/deep-review/**` | Modify | Add context-snapshot audit inputs and review report integration. |
| `.opencode/commands/deep/research.md` | Regenerate | Command contract must expose context snapshot flags/behavior if added to compiled sources. |
| `.opencode/commands/deep/review.md` | Regenerate | Same generated command contract sync for review. |
| `.opencode/skills/system-skill-advisor/**` | Modify/reindex | Remove stale deep-context metadata routing assumptions and refresh advisor graph/index fixtures. |
| `AGENTS.md`, `README.md`, `.opencode/agents/deep-loop.md`, `.opencode/agents/orchestrate.md`, `.claude/agents/*` mirrors | Modify | Remove live standalone context recommendations and redirect users to research/review/context agent alternatives. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the value of codebase context gathering. | `deep-research` or `deep-review` can produce a cited context snapshot with reuse candidates, integration points, conventions, dependencies, and gaps. |
| REQ-002 | Prevent new standalone `deep-context` runs after the soft-deprecation stage. | `/deep:context` no longer launches the legacy YAML loop and instead explains the supported replacement route. |
| REQ-003 | Keep command and skill routing consistent. | `mode-registry.json`, generated command contracts, advisor projections, and user-facing docs agree on the supported deep-loop modes. |
| REQ-004 | Keep cross-runtime agent parity. | OpenCode and Claude agent inventories either both remove `deep-context` or both mark it as deprecated with equivalent body/frontmatter intent. |
| REQ-005 | Avoid breaking historical recovery. | Existing archived `context/` artifacts remain readable as history; no script assumes they are rewritten or deleted. |
| REQ-006 | Verify runtime/test impact before removing `runtimeLoopType: context`. | Tests and runtime helpers that mention `context` are either updated or the registry cleanup is deferred with a named follow-up. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Inventory all live standalone surfaces before deletion. | A grep/glob-backed inventory distinguishes retire, archive, redirect, and rewrite-as-integrated-capability actions. |
| REQ-008 | Preserve context report schema where it is useful. | Research/review docs name the subset they consume: pointers not bodies, reuse-first order, relevance labels, and gaps. |
| REQ-009 | Remove advisor/database/index references that make `deep-context` discoverable as a standalone skill. | Skill advisor routing checks no longer recommend standalone `deep-context`; broad context requests route to `@context`, `deep-research`, or `deep-review` based on intent. |
| REQ-010 | Update docs and mirrors that currently advertise `/deep:context`. | `AGENTS.md`, `README.md`, orchestrator agents, and deep-loop agent tables no longer present standalone context as active. |
| REQ-011 | Add migration notes for users who remember `/deep:context`. | Deprecated command or docs explain replacement paths: `@context` for one-shot retrieval, `/deep:research` for investigation, `/deep:review` for audit. |
| REQ-012 | Keep generated command contracts source-controlled and reproducible. | Research/review command docs are regenerated through the existing compiler, not manually forked. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/deep:context` is no longer an active standalone workflow entrypoint after the deprecation stage.
- **SC-002**: `deep-research` documents and verifies codebase context snapshot behavior for planning-oriented investigations.
- **SC-003**: `deep-review` documents and verifies context snapshot behavior for audit/release-readiness runs.
- **SC-004**: Advisor routing and deep-loop registry tests pass without exposing `deep-context` as a standalone routed mode.
- **SC-005**: Cross-runtime mirrors and README/AGENTS guidance agree on replacement paths.
- **SC-006**: Strict SpecKit validation passes for this packet before implementation completion is claimed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Command-contract compiler | Manual edits to generated research/review commands could drift. | Update source contracts and run the compiler. |
| Dependency | Skill advisor graph/index | JSON metadata changes may not affect live routing until reindexed. | Run advisor reindex/scan and routing probes. |
| Dependency | Deep-loop runtime tests | `context` may still be part of convergence enum/tests. | Separate public deprecation from internal runtime cleanup if needed. |
| Risk | Deleting unique context features | Users lose reuse-first mapping and agreement-weighted confidence. | Move these features into research/review before removing the old packet. |
| Risk | Historical search churn | Archived specs and descriptions contain many old mentions. | Do not rewrite history except active fixture/index inputs. |
| Risk | Mirror drift | `.opencode` and `.claude` agent docs can diverge. | Treat mirror parity as a P0/P1 checklist item. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Replacement context snapshots should not add a new default deep-loop iteration unless a context snapshot is requested or the target lacks sufficient known context.
- **NFR-P02**: Advisor routing probes should remain below existing prompt-time expectations; no runtime registry reads on the advisor hot path unless a separate performance packet approves it.

### Security
- **NFR-S01**: Decommissioning must not widen write permissions for research/review agents. Code under investigation remains read-only except each loop's own artifact folder.
- **NFR-S02**: No generated docs, metadata, or archived context artifacts may include secrets or environment values.

### Reliability
- **NFR-R01**: If context snapshot integration fails, research/review loops should continue without fabricating context coverage and should name the missing evidence.
- **NFR-R02**: Deprecated command behavior must fail closed with a redirect message, not partial legacy execution.

---

## 8. EDGE CASES

### Existing Context Artifacts
- Existing `{spec_folder}/context/` outputs remain historical evidence. New docs must not claim they are migrated automatically.
- Active tests or fixtures that read `context/` outputs need explicit update or exemption.

### User Intent Routing
- If a user asks for a quick codebase lookup, route to `@context`, not `deep-research`.
- If a user asks for multi-round investigation, route to `/deep:research` with codebase context snapshot support.
- If a user asks for release-readiness, defect discovery, or spec/code alignment, route to `/deep:review`.
- If a user explicitly invokes `/deep:context`, show the deprecation redirect and do not silently run the old loop.

### Runtime Cleanup
- Removing `workflowMode: context` from the registry is public-surface cleanup.
- Removing `context` from deep-loop runtime convergence enums is internal cleanup and can happen later if runtime tests prove it is safe.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Commands, agents, nested skill packet, registry, advisor, docs, mirrors. |
| Risk | 15/25 | Public command deprecation and routing behavior. |
| Research | 14/20 | Requires inventory of active vs historical references. |
| Multi-Agent | 8/15 | Mirror and agent surfaces are affected but implementation can stay sequential. |
| Coordination | 12/15 | Generated command contracts and advisor indexes need coordinated verification. |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `/deep:context` keeps running legacy YAML after docs say deprecated. | High | Medium | Stub command first and test invocation/routing text. |
| R-002 | Research/review context snapshots become vague prose instead of cited pointers. | High | Medium | Require file:line evidence, pointers not bodies, and reuse-first sections. |
| R-003 | Advisor still surfaces `deep-context` through stale graph metadata. | Medium | Medium | Reindex advisor graph and probe routing after metadata changes. |
| R-004 | Runtime tests fail because `context` loop type is removed too early. | Medium | Medium | Keep runtime cleanup as later phase if tests prove dependency. |
| R-005 | Cross-runtime mirrors disagree. | Medium | High | Include `.claude` mirror checks in verification. |

---

## 11. USER STORIES

### US-001: Replacement Route for Former Context Users (Priority: P0)

**As an** operator who previously used `/deep:context`, **I want** a clear replacement path, **so that** I can still gather codebase context without invoking a deprecated loop.

**Acceptance Criteria**:
1. Given `/deep:context` is invoked, When the command is evaluated, Then it does not launch legacy context YAML and instead names the supported replacements.
2. Given docs mention deep-loop modes, When a user reads them, Then standalone context is not listed as an active mode.

---

### US-002: Research With Codebase Context (Priority: P0)

**As a** planner running deep research, **I want** reusable codebase context captured inside research artifacts, **so that** planning can extend existing code instead of rediscovering it later.

**Acceptance Criteria**:
1. Given `/deep:research` runs on a codebase-backed topic, When context snapshot behavior is enabled or required, Then research artifacts include cited reuse candidates, integration points, conventions, dependencies, and gaps.
2. Given a context snapshot cites files, When the final synthesis runs, Then every cited code fact has file:line evidence or is clearly labeled as an inference.

---

### US-003: Review With Context Coverage (Priority: P0)

**As a** reviewer running deep review, **I want** context coverage inside the review loop, **so that** findings account for touched surfaces and likely integration points without a separate context command.

**Acceptance Criteria**:
1. Given `/deep:review` targets a spec or implementation, When the loop initializes, Then it can seed review strategy with codebase context and resource-map coverage when present.
2. Given review synthesis completes, When context gaps affected confidence, Then `review-report.md` names those gaps instead of presenting a false PASS.

---

### US-004: Advisor and Registry Consistency (Priority: P1)

**As a** maintainer, **I want** advisor metadata, registry data, and generated command docs to agree, **so that** routing does not send users to a retired mode.

**Acceptance Criteria**:
1. Given advisor routing probes run, When prompts mention deep research or deep review, Then they route to `deep-loop-workflows` with the intended mode.
2. Given prompts mention deep context, When probes run after deprecation, Then they do not recommend standalone `deep-context` as a callable skill.

---

### US-005: Historical Context Preservation (Priority: P1)

**As a** maintainer using memory search, **I want** old context artifacts to remain interpretable, **so that** prior decisions and archived evidence still make sense.

**Acceptance Criteria**:
1. Given archived specs contain `deep-context` references, When this change is applied, Then historical records are not rewritten solely for cosmetic cleanup.
2. Given active generated indexes contain deep-context descriptions, When implementation reaches metadata cleanup, Then only active index inputs are regenerated.

---

### US-006: Safe Runtime Cleanup (Priority: P1)

**As a** runtime maintainer, **I want** `context` loop-type removal separated from public deprecation if needed, **so that** tests reveal real dependencies before internal cleanup.

**Acceptance Criteria**:
1. Given runtime tests still assert `context`, When public deprecation is complete, Then internal cleanup remains a documented follow-up rather than a broken partial deletion.
2. Given runtime cleanup is attempted, When tests pass, Then the `context` loop type and reducer assumptions can be removed in the same verified change.

---

## 12. OPEN QUESTIONS

- None blocking. The approved strategy is staged deprecation plus integration of useful context features into research and review.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
