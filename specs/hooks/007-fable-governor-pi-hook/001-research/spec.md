---
title: "Research Phase: Fable Governor Hook Usefulness + Pi-Only Subagent Dispatch Directive"
description: "Three-model parallel research (GPT-5.6 Luna max x5 via native subagent, GLM 5.2 high x3 via cli-devin, Grok 4.5 Max x2 via cli-cursor) evaluating whether the fable governor per-turn hook should be kept, updated, or replaced with AGENTS.md governor logic, and designing a pi-only per-turn directive mandating the native pi-subagents plugin for subagent dispatch unless the user explicitly requests a cli-* skill mode. No early convergence: every track runs its full iteration count."
trigger_phrases:
  - "fable governor research"
  - "governor hook usefulness"
  - "pi subagent directive"
  - "cli-devin glm"
  - "cli-cursor grok"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/001-research"
    last_updated_at: "2026-08-04T23:30:00Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed ten research iterations and recorded the synthesis evidence"
    next_safe_action: "Continue with the implementation follow-up phases"
    blockers: []
    key_files:
      - "evidence/iterations.md"
      - "evidence/synthesis.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Fable Governor Hook + Pi Subagent Dispatch Directive

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of N |
| **Predecessor** | None |
| **Successor** | 002-governor-parity |
| **Handoff Criteria** | Verdict (keep/update/replace) + pi directive design, all 10 iterations logged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fable governor per-turn hook re-states a compact disposition capsule ("thermostat") on every turn, while AGENTS.md now carries the durable governor doctrine plus the proof-over-appearance protocol (§Operating Discipline, terminal discipline §4). It is unknown whether the capsule duplicates, complements, or contradicts the AGENTS.md text, and whether it should be updated or replaced. Separately, pi sessions get no per-turn directive about subagent dispatch: nothing tells pi to prefer the native pi-subagents plugin over ad-hoc dispatch or cli-* skill routes unless the user explicitly names a cli skill mode.

### Purpose
Produce an evidence-backed verdict on the governor hook and a ready-to-implement design for the pi-only subagent dispatch directive.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read fable governor doctrine, capsule injection chain (all runtimes: pi prompt-advisor.ts, mk-skill-advisor.js, render.ts, hook docs), AGENTS.md governor/proof sections, pi-subagents plugin dispatch surface
- 10 research iterations across three model tracks (5/3/2), each fresh-context, logged per iteration
- Synthesis after all tracks finish (no early convergence)

### Out of Scope
- Implementing the verdict or the pi directive (follow-up phases)
- Touching hook code or AGENTS.md content
- Other runtimes' subagent policies (pi only)

### Files to Change (evidence only)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/evidence/iterations.md` | Create | Per-iteration logs for all three tracks |
| `001-research/evidence/synthesis.md` | Create | Final verdict + pi directive design |
| `001-research/scratch/` | Create | Working notes per track |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 10 iterations: 5x GPT-5.6 Luna (max thinking), 3x GLM 5.2 (high, via cli-devin), 2x Grok 4.5 Max (via cli-cursor) | Evidence log shows 10 entries with model, route, iteration number, date |
| REQ-002 | No early convergence: no track is terminated early because another track converged | Evidence log ordering shows each track ran its full count |
| REQ-003 | Each iteration examines: fable-governor.md, the capsule injection chain, AGENTS.md governor + proof sections, pi-subagents dispatch surface | Per-iteration findings reference at least two of the four evidence targets |
| REQ-004 | Verdict on governor hook: keep / update / replace, with concrete evidence per option | synthesis.md states verdict + file:line evidence + cost/benefit |
| REQ-005 | Pi-only subagent dispatch directive designed: exact wording, injection point in pi hook chain, guardrails (user override via explicit cli-* request) | synthesis.md contains draft directive text + injection point + override semantics |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Track the overlap/contradiction matrix between capsule and AGENTS.md text | synthesis.md lists overlaps, contradictions, gaps |
| REQ-007 | Document the cli-dispatch-skill-preload interplay (existing rule) with the new pi directive | synthesis.md explains precedence between explicit cli-* request and default pi-subagents |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 iterations logged with evidence; no track truncated
- **SC-002**: synthesis.md answers both research questions with file:line evidence
- **SC-003**: Packet validates: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin + cli-cursor skills functional | Track B/C cannot run | Preload both SKILL.md contracts; fall back to documenting the failure |
| Dependency | gpt-5.6-luna enabled + auth | Track A cannot run | Model is in enabledModels (settings.json); verify before dispatch |
| Risk | External CLI runs are slow | Long wall-clock | Async dispatches; log checkpoint per iteration |
| Risk | Models converge on one answer early | False confidence | Mandated full iteration counts per track |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration bounded to one focused pass; no unbounded re-reading
- **NFR-P02**: Iteration logs written after each iteration, not batched at the end

### Security
- **NFR-S01**: No repo files modified outside `evidence/` and `scratch/`

### Reliability
- **NFR-R01**: Every iteration records model + route + iteration number
- **NFR-R02**: Failed track reported honestly, not silently skipped
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- cli-devin/cli-cursor unavailable: track marked failed in evidence, verdict still derived from remaining tracks + explicit gap note
- GLM 5.2 model id resolution: `z-ai/glm-5.2` via openrouter route (per cli-devin skill contract) or the repo's GLM-5-2 packet config

### Error Scenarios
- External CLI hangs: timeout, log partial, continue other tracks
- Subagent dispatch fails auth: report, continue remaining tracks

### State Transitions
- Partial completion: phase stays In Progress until all 10 iterations + synthesis exist
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Evidence-only; 3 model tracks |
| Risk | 8/25 | External CLI dependency |
| Research | 18/20 | The core deliverable is the research itself |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which composition point injects the capsule per-turn in pi (`hooks/pi/prompt-advisor.ts` vs `mk-skill-advisor.js` fallback)?
- Does the repo's `024-glm-5-2-support` packet define the GLM 5.2 route for cli-devin?
<!-- /ANCHOR:questions -->
