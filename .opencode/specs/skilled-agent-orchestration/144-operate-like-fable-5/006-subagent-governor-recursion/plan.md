---
title: "Implementation Plan: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field [template:level_3/plan.md]"
description: "Implements the subagent-visible governor channel: a recursion-control constitutional rule, a {governor_block} token in prompt-pack.ts plus the two deep-loop iteration templates, the governor injected into canonical agent prompts, and an optional governor field on executorConfigSchema. Depends on phase 005 for the governor capsule text."
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
    packet_pointer: "scaffold/006-subagent-governor-recursion"
    last_updated_at: "2026-06-15T14:06:38Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-subagent-governor-recursion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | TypeScript (deep-loop-runtime), Markdown (constitutional rule, agent prompts, iteration templates) |
| **Framework** | Zod schema validation; deep-loop prompt-pack token renderer; GitHub Actions for mirror sync |
| **Storage** | None - static doctrine text and config schema; no persistence change |
| **Testing** | `vitest` for executor-config and prompt-pack; `validate.sh` for spec-doc gates |

### Overview
This phase opens the only channels a sub-agent can see and routes the phase-005 governor capsule through them. It adds a `{governor_block}` token to `prompt-pack.ts` and the two deep-loop iteration templates so every rendered iteration carries the governor, injects the governor into the canonical `.opencode/agents/*.md` prompts (propagated to mirrors by `agent-mirror-sync.yml`), creates a `recursion-control.md` constitutional rule for xhigh executors, and adds an optional `governor` field to `executorConfigSchema`. The approach is structural-first: enforced code and templates, not advisory read-surface text that decays and is subagent-blind.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md sections 2-3)
- [ ] Success criteria measurable (SC-001, SC-002)
- [ ] Phase 005 governor capsule text available as the injection payload

### Definition of Done
- [ ] All acceptance criteria (REQ-001 to REQ-008) met
- [ ] `vitest` executor-config and prompt-pack suites pass; existing renders unchanged when no governor is configured
- [ ] `recursion-control.md` created and surfaced; three agent mirrors consistent after `agent-mirror-sync.yml`
- [ ] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Token-substitution injection. The governor capsule is a single dense paragraph that flows into every subagent-visible surface through one named token (`{governor_block}`) and one optional config field, rather than being duplicated per surface.

### Key Components
- **`recursion-control.md`**: New constitutional rule. Carries the "reason about the problem and the person, not yourself" doctrine, audit-depth-limit-1, and the caption test for extended-thinking xhigh executors.
- **`prompt-pack.ts` + iteration templates**: The deep-loop injection channel. `renderPromptPack` substitutes `{governor_block}`; the deep-research and deep-review iteration templates declare the slot.
- **Canonical agent prompts (`.opencode/agents/*.md`)**: The Task-dispatched subagent channel; the governor lives in the prompt body and is mirrored by the sync workflow.
- **`executorConfigSchema`**: Optional `governor` field for per-lineage tuning, parsed by `parseExecutorConfig`.

### Data Flow
Phase 005 produces the governor capsule text. That text becomes the `{governor_block}` value supplied to `renderPromptPack` (for deep-loop iterations) and the optional `governor` field on the executor config (for per-lineage runs); it is also embedded directly in the canonical agent prompt bodies. The recursion-control rule is read by xhigh executors at audit time. No data is persisted; everything is rendered or read at dispatch time.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `renderPromptPack` (`prompt-pack.ts`) | Substitutes `{token}` values into iteration templates | update - render the `{governor_block}` token | prompt-pack vitest; `validatePromptPackTemplate` reports the token present |
| deep-research / deep-review iteration templates | Declare the tokens a rendered iteration carries | update - add the `{governor_block}` slot | grep both `.md.tmpl` files for `{governor_block}`; render check |
| `executorConfigSchema` / `parseExecutorConfig` (`executor-config.ts`) | Parses and defaults deep-loop executor config | update - add optional `governor` field | executor-config vitest: present/absent/malformed cases |
| `lineageExecutorSchema` / `fanoutConfigSchema` | Extend `executorConfigSchema` for fan-out | update - inherits the new optional field automatically | confirm fan-out config parse still passes; vitest green |
| Canonical agent prompts (`.opencode/agents/*.md`) | Subagent-visible instruction body | update - embed the governor | grep agent prompts for the governor marker |
| `.claude/agents/*.md`, `.codex/agents/*.toml` | Runtime mirrors of the canonical prompts | not hand-edited; produced by sync | `agent-mirror-sync.yml` run; mirror consistency check |
| `recursion-control.md` consumers | Constitutional rules surfaced to executors | update - add the rule + surfacing pointer | grep the constitutional pointer for the new rule |

Required inventories:
- Same-class producers: `rg -n 'renderPromptPack|\{governor_block\}' .opencode/skills/deep-loop-runtime .opencode/skills/deep-loop-workflows`.
- Consumers of changed symbols: `rg -n 'executorConfigSchema|parseExecutorConfig|governor' . --glob '*.ts' --glob '*.md.tmpl' --glob '*.md'`.
- Matrix axes: governor present vs absent vs malformed (executor-config); token present vs missing (prompt-pack); deep-research vs deep-review template; the three agent mirrors.
- Schema invariant: the optional `governor` field MUST default safely so that a config without it parses identically to pre-change behavior, and `lineageExecutorSchema`/`fanoutConfigSchema` inherit the field without a separate edit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 005 has landed and read its governor capsule text as the single injection source.
- [ ] Capture a baseline: run the existing executor-config and prompt-pack `vitest` suites green before any edit, so the post-change delta is provable.

### Phase 2: Core Implementation (ordered)
- [ ] Step 1 - Create `.opencode/skills/system-spec-kit/constitutional/recursion-control.md` with the doctrine, audit-depth-limit-1, and the caption test; add it to the constitutional surfacing pointer. Verify: grep the pointer for the new rule; `validate.sh` clean.
- [ ] Step 2 - Add the `{governor_block}` slot to `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` and `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl`. Verify: grep both templates for the token.
- [ ] Step 3 - Wire `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` to supply the `governor_block` variable (defaulting to empty when no governor). Verify: prompt-pack `vitest`; `validatePromptPackTemplate` reports the token present in both templates.
- [ ] Step 4 - Add the optional `governor` field to `executorConfigSchema` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` with a safe default; confirm `lineageExecutorSchema`/`fanoutConfigSchema` inherit it. Verify: TypeScript compile.
- [ ] Step 5 - Extend `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` to cover present/absent/malformed governor. Verify: `vitest` green.
- [ ] Step 6 - Inject the governor into the relevant canonical `.opencode/agents/*.md` prompts (deep-loop agents first). Verify: grep agent prompts for the governor marker. Do NOT hand-edit the Claude/Codex mirrors.

### Phase 3: Verification
- [ ] Run the full executor-config and prompt-pack `vitest` suites; confirm no regression against the Phase 1 baseline.
- [ ] Confirm a no-governor deep-loop render and parse match pre-change behavior (backward compatibility).
- [ ] Run `agent-mirror-sync.yml` and confirm `.claude/agents/*.md` + `.codex/agents/*.toml` match the canonical edit.
- [ ] Run `validate.sh <phase-folder> --strict`; update spec/plan/tasks/checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `executorConfigSchema` governor field (present/absent/malformed); `renderPromptPack` + `validatePromptPackTemplate` for the `{governor_block}` token | `vitest` |
| Integration | A full deep-research and deep-review iteration render carries the governor; a no-governor run renders/parses unchanged | `vitest` + render check |
| Manual | Grep the two iteration templates and the canonical agent prompts for the governor marker; confirm mirror consistency after `agent-mirror-sync.yml` | grep, workflow run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 governor capsule | Internal | Yellow (must land first) | No payload to inject; this phase cannot complete |
| `agent-mirror-sync.yml` | Internal | Green | Mirrors would have to be hand-edited, risking drift |
| `vitest` (deep-loop-runtime) | Internal | Green | Cannot verify schema/render changes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A deep-loop render or parse breaks for a no-governor run, the prompt-pack/executor-config vitest regresses, or the recursion rule stalls legitimate work.
- **Procedure**: Revert the `prompt-pack.ts`, `executor-config.ts`, and template edits; remove `recursion-control.md` and its surfacing pointer line; revert the agent-prompt edits and re-run `agent-mirror-sync.yml` to restore the mirrors. Each change is additive (a new optional field, a new token defaulting to empty, a new file), so reverting is a clean git revert with no data migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: 005 landed + baseline) ──► Phase 2 (Core: rule, templates, schema, agents) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 governor capsule | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour (confirm 005, capture baseline) |
| Core Implementation | Med | 3-5 hours (rule, two templates, prompt-pack, schema + test, agent prompts) |
| Verification | Low | 1-2 hours (vitest, backward-compat render, mirror sync, validate.sh) |
| **Total** | | **4.5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data changes - nothing to back up
- [ ] No feature flag needed - the governor token defaults to empty and the config field is optional, so the change is inert until a governor is supplied
- [ ] Baseline vitest captured before edits

### Rollback Procedure
1. Revert the `prompt-pack.ts`, `executor-config.ts`, and iteration-template edits via git revert.
2. Delete `recursion-control.md` and remove its line from the constitutional surfacing pointer.
3. Revert the canonical agent-prompt edits and re-run `agent-mirror-sync.yml` to restore the mirrors.
4. Run the executor-config and prompt-pack vitest suites to confirm the pre-change baseline is restored.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - all changes are additive text/schema with safe defaults; git revert is sufficient.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  Phase 005   │────►│  recursion-control.md │────►│             │
│  capsule     │     ├──────────────────────┤     │   Verify    │
└──────────────┘     │  templates +          │────►│  (vitest +  │
                     │  prompt-pack.ts       │     │   mirror    │
                     ├──────────────────────┤     │   sync)     │
                     │  executor-config +    │────►│             │
                     │  vitest               │     └─────────────┘
                     ├──────────────────────┤
                     │  agent prompts ──► mirror-sync
                     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 005 capsule | None (prior phase) | governor text | All injection work |
| `recursion-control.md` | Capsule doctrine | constitutional rule | Verify |
| Iteration templates + `prompt-pack.ts` | Capsule | rendered governor in iterations | Verify |
| `executor-config.ts` + vitest | None | optional governor field | Verify |
| Agent prompts + mirror sync | Capsule | governed sub-agents | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 005 capsule available** - prerequisite - CRITICAL
2. **Iteration templates + `prompt-pack.ts` `{governor_block}`** - 1.5-2 hours - CRITICAL (the core subagent channel)
3. **Verify renders + backward-compat + mirror sync** - 1-2 hours - CRITICAL

**Total Critical Path**: ~3-4 hours after 005 lands

**Parallel Opportunities**:
- `recursion-control.md` creation and the `executor-config.ts` schema change can run alongside the template/prompt-pack work; they share no files.
- Agent-prompt edits can be drafted while the schema vitest runs, but the mirror-sync run must wait until the canonical prompt edits are final.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Channel open | `{governor_block}` renders in both deep-loop iteration templates | After Phase 2 step 3 |
| M2 | Schema + rule done | `governor` field parses (present/absent/malformed); `recursion-control.md` exists and surfaces | After Phase 2 step 5 |
| M3 | Sub-agents governed | Canonical agent prompts carry the governor; three mirrors consistent; all vitest green | After Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Inject the governor through structural channels, not the subagent-blind hook

**Status**: Proposed

**Context**: The per-turn skill-advisor hook (phase 005) does not fire for sub-agents, so deep-loop iterations and Task-dispatched agents never see the governor. We needed a channel they can actually read.

**Decision**: Inject the governor through `renderPromptPack` (the deep-loop iteration path) and the canonical agent prompt bodies, propagated to mirrors by `agent-mirror-sync.yml`, with an optional `governor` field on the executor config for per-lineage tuning.

**Consequences**:
- The governor reaches the long-running, token-heavy work where efficiency matters most, and survives because it is enforced code/text rather than a decaying read surface.
- The new token must default safely so existing renders are unchanged. Mitigation: default `{governor_block}` to empty and keep the executor-config field optional.

**Alternatives Rejected**:
- AGENTS-only governor: setpoint decays without the thermostat and is still subagent-blind.
- Hand-editing the three agent mirrors: drifts without a sync mechanism; the existing workflow is the correct propagation path.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
