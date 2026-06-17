---
title: "Feature Specification: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field [template:level_3/spec.md]"
description: "The per-turn skill-advisor hook does not fire for sub-agents, so the fable-5 governor capsule never reaches deep-loop iterations or dispatched agents. This phase injects the governor through the only subagent-visible channels (agent prompts and renderPromptPack), adds a recursion-control constitutional rule for xhigh executors, and adds an optional governor field on executorConfigSchema."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Sub-agent governor injection via prompt-pack and agent prompts, a recursion-control rule, and an executor-config governor field

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

The fable-5 governor capsule reaches main-session agents through the live per-turn skill-advisor hook (phase 005), but that hook is subagent-blind: it never fires for deep-loop iterations or for agents dispatched through the Task tool. This phase opens the only channels a sub-agent can actually see — agent prompt bodies and the `renderPromptPack` template path — and injects the governor there, adds a `recursion-control.md` constitutional rule to damp the Opus anxiety loop on extended-thinking xhigh executors, and exposes an optional `governor` field on `executorConfigSchema` for per-lineage tuning.

**Key Decisions**: Inject the governor structurally (code + templates) rather than relying on the subagent-blind hook; ship a generic governor first and defer model-family specialization; edit the canonical `.opencode/agents/*.md` source and let `agent-mirror-sync.yml` propagate to the Claude and Codex mirrors rather than hand-editing all three.

**Critical Dependencies**: Phase 005 must land first — the governor capsule text it produces is the payload this phase injects.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 rides the live per-turn skill-advisor hook to keep the fable-5 governor capsule in front of main-session agents, but that hook does not fire for sub-agents. Deep-loop iterations rendered through `renderPromptPack` and agents dispatched via the Task tool never see the capsule, so the efficiency doctrine silently stops governing exactly the long-running, token-heavy work it matters most for. On extended-thinking xhigh executors this is compounded by the Opus "anxiety loop": the model reasons about itself and its own process instead of the task, burning tokens and producing self-referential output. The capsule's recursion rules (B3 rec 1, "reason about the problem, not yourself") are the antidote, but today they have no path into a sub-agent.

### Purpose
Sub-agents and deep-loop iterations carry the governor through the only channels they can see — agent prompts and `renderPromptPack` — and a recursion-control constitutional rule damps the xhigh anxiety loop with an audit-depth-limit and the caption test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `recursion-control.md` constitutional rule ("reason about the problem and the person, not yourself"; audit-depth-limit-1; the caption test) plus the surfacing pointer so it is discoverable.
- A `{governor_block}` injection point in `prompt-pack.ts` and the two deep-loop iteration templates (deep-research and deep-review), so every rendered iteration carries the governor.
- The governor injected into the relevant `.opencode/agents/*.md` canonical agent prompts (the subagent-visible channel), propagated to the Claude and Codex mirrors by the existing `agent-mirror-sync.yml` workflow.
- An optional `governor` field on `executorConfigSchema` with parsing and a vitest update, so a deep-loop run can carry a per-lineage governor.

### Out of Scope
- The governor capsule text itself - it is produced by phase 005 and consumed, not authored, here.
- The main-session per-turn hook reminder - phase 005 owns that surface; this phase only covers the channels the hook cannot reach.
- Behavioral measurement of the change (tool:text ratio, self-opener percentage) - that is phase 003 (baseline) and the `fable_metrics.py` measurement work (rec C1), not this phase.
- Promoting the recursion rules from generic to model-family-specific - deferred to a later parameterized layer per the deepseek portability taxonomy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/constitutional/recursion-control.md` | Create | New rule: reason about the problem and the person not yourself; audit-depth-limit-1; the extended-thinking caption test. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` | Modify | Render a `{governor_block}` token so deep-loop iterations carry the governor in their prompt pack. |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modify | Add the `{governor_block}` token to the deep-research iteration template. |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Add the `{governor_block}` token to the deep-review iteration template. |
| `.opencode/agents/*.md` | Modify | Inject the governor into the relevant canonical agent prompts (subagent-visible channel). |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Add an optional `governor` field to `executorConfigSchema` with parsing. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Modify | Cover the new `governor` field: present, absent, and malformed inputs. |
| `.github/workflows/agent-mirror-sync.yml` | Unchanged (relied upon) | Existing workflow propagates the edited `.opencode/agents/*.md` to `.claude/agents/*.md` and `.codex/agents/*.toml`; do not hand-edit the mirrors. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `renderPromptPack` output carries the governor for deep-loop iterations. | A rendered deep-research and deep-review iteration prompt contains the governor block in the `{governor_block}` slot; `validatePromptPackTemplate` reports `governor_block` present in both templates. |
| REQ-002 | The recursion-control constitutional rule exists and is discoverable. | `.opencode/skills/system-spec-kit/constitutional/recursion-control.md` exists with the "reason about the problem and the person, not yourself" doctrine, audit-depth-limit-1, and the caption test; it is referenced from the constitutional surfacing pointer so a reader can find it. |
| REQ-003 | The governor reaches sub-agents through the agent-prompt channel. | The relevant `.opencode/agents/*.md` canonical prompts carry the governor block; `agent-mirror-sync.yml` propagates the edit so the three mirrors stay consistent (no hand-edited mirror drift). |
| REQ-004 | `executorConfigSchema` accepts and parses an optional `governor` field. | `parseExecutorConfig` accepts a config with a `governor` value, defaults it when absent, and rejects a malformed value; the executor-config vitest covers all three cases and passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The governor block is sourced from the phase-005 capsule, not re-authored. | The injected text matches the phase-005 governor capsule (single dense paragraph), with no duplicate or divergent copy maintained in this phase's files. |
| REQ-006 | The recursion rule targets the xhigh anxiety loop without over-blocking. | The rule applies to extended-thinking xhigh executors via the audit-depth-limit-1 and caption test, and does not introduce a hard blocker on normal-effort runs. |
| REQ-007 | The deep-loop runtime change is backward compatible. | A deep-loop run with no `governor` field configured renders and parses exactly as before (governor defaults to empty/none); existing executor-config and prompt-pack tests still pass. |
| REQ-008 | The three agent mirrors remain byte-consistent after the sync workflow. | After `agent-mirror-sync.yml` runs, `.claude/agents/*.md` and `.codex/agents/*.toml` reflect the canonical `.opencode/agents/*.md` edit with no manual divergence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rendered deep-research and deep-review iteration prompts both carry the governor block in the `{governor_block}` slot, confirmed by `validatePromptPackTemplate`.
- **SC-002**: `recursion-control.md` exists, surfaces from the constitutional pointer, and `parseExecutorConfig` accepts the optional `governor` field with present/absent/malformed cases green in the executor-config vitest; the three agent mirrors stay consistent via `agent-mirror-sync.yml`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 governor capsule | This phase has no payload to inject if 005 has not landed | Sequence after 005; treat the capsule text as the single source and read it from the 005 output rather than re-authoring |
| Dependency | `agent-mirror-sync.yml` workflow | Manual mirror edits would drift from canonical if the workflow is bypassed | Edit only `.opencode/agents/*.md`; let the workflow propagate; verify mirror consistency after it runs |
| Risk | Prompt-pack token regression | A new required `{governor_block}` token could break existing renders that do not supply it | Med - default the token to empty/none so absent governor renders unchanged; keep existing prompt-pack tests green |
| Risk | Over-blocking recursion rule | An audit-depth limit applied too broadly could stall legitimate normal-effort work | Low - scope the rule to extended-thinking xhigh executors; keep it advisory, not a hard blocker, for normal runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The governor block adds a single dense paragraph (~90 words) per rendered iteration; prompt-pack render time stays effectively unchanged (a string substitution, no extra I/O).

### Security
- **NFR-S01**: The governor block is static doctrine text with no secrets or user input; the `{governor_block}` token is substituted by trusted runtime config, not by untrusted content.

### Reliability
- **NFR-R01**: A deep-loop run with no configured governor renders and parses identically to the pre-change behavior; the optional `governor` field defaults safely so no existing run is broken.

---

## 8. EDGE CASES

### Data Boundaries
- Empty governor: when no governor is configured, the `{governor_block}` token resolves to an empty string and the iteration renders without a governor section.
- Maximum length: the governor block is bounded to the single ~90-word capsule paragraph; the template does not concatenate multiple governors.

### Error Scenarios
- Missing token in template: if a template references `{governor_block}` but the variable is not supplied, `renderPromptPack` throws `PromptPackError` listing the missing variable rather than emitting a literal `{governor_block}`.
- Malformed governor config: a non-string or otherwise invalid `governor` value fails `executorConfigSchema` parsing with a clear `ExecutorConfigError`, never a silent default substitution.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 7 edited + 1 created, Systems: deep-loop-runtime, constitutional rules, agent prompts |
| Risk | 16/25 | Auth: N, API: N, Breaking: low (token + optional field both backward compatible) |
| Research | 4/20 | Surfaces and rec semantics already settled in 002 research |
| Multi-Agent | 6/15 | Touches all deep-loop agents and the three runtime agent mirrors via sync |
| Coordination | 12/15 | Hard ordering dependency on phase 005 + reliance on the mirror-sync workflow |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New required `{governor_block}` token breaks existing prompt-pack renders | H | M | Default the token to empty/none; keep all existing prompt-pack tests green before claiming done |
| R-002 | Hand-editing the three agent mirrors drifts them out of sync | M | M | Edit only the canonical `.opencode/agents/*.md`; let `agent-mirror-sync.yml` propagate; verify mirror consistency afterward |
| R-003 | Recursion rule over-blocks legitimate normal-effort work | M | L | Scope the audit-depth-limit and caption test to extended-thinking xhigh executors; keep it advisory for normal runs |
| R-004 | Governor text diverges between phase 005 and this phase | M | L | Treat phase 005 as the single source; reference its capsule rather than maintaining a second copy |

---

## 11. USER STORIES

### US-001: Governor reaches deep-loop iterations (Priority: P0)

**As a** deep-loop runtime, **I want** every rendered iteration prompt to carry the fable-5 governor, **so that** sub-agents that never see the per-turn hook still operate under the efficiency doctrine.

**Acceptance Criteria**:
1. **Given** a deep-research iteration is about to render, **When** `renderPromptPack` runs with the governor variable supplied, **Then** the output contains the governor block in the `{governor_block}` slot.
2. **Given** a deep-review iteration is about to render, **When** `renderPromptPack` runs, **Then** the output contains the governor block.
3. **Given** no governor is configured, **When** an iteration renders, **Then** it renders cleanly with an empty governor slot and no error.

---

### US-002: Recursion-control rule damps the xhigh anxiety loop (Priority: P0)

**As a** maintainer dispatching extended-thinking xhigh executors, **I want** a recursion-control constitutional rule, **so that** the model reasons about the problem and the person rather than itself and stops burning tokens in a self-referential loop.

**Acceptance Criteria**:
1. **Given** the constitutional directory, **When** I look for recursion guidance, **Then** `recursion-control.md` exists with the doctrine, audit-depth-limit-1, and the caption test, and is reachable from the constitutional surfacing pointer.
2. **Given** an xhigh executor begins auditing its own audit, **When** the audit-depth-limit-1 applies, **Then** it returns to the task instead of recursing further.

---

### US-003: Per-lineage governor field on executor config (Priority: P1)

**As a** deep-loop operator, **I want** an optional `governor` field on `executorConfigSchema`, **so that** I can tune the governor per lineage or model without re-authoring the prompt pack.

**Acceptance Criteria**:
1. **Given** a config that supplies a `governor` value, **When** `parseExecutorConfig` runs, **Then** the value parses and is available to the runtime; a malformed value is rejected with a clear error, and an absent value defaults safely.

---

## 12. OPEN QUESTIONS

- Which `.opencode/agents/*.md` prompts get the governor block: all deep-loop agents only, or every dispatchable agent? Recommendation: start with the deep-loop agents (deep-research, deep-review, deep-context, deep-improvement) that run through `renderPromptPack`, then widen if measurement (phase 003 / C1) shows main-session-only coverage gaps.
- Should the recursion rules ship generic now and specialize per model-family later (rules 1-2 are Anthropic-specific per the deepseek portability taxonomy), as the 002 recommendations advise? Recommendation: yes, generic first.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
