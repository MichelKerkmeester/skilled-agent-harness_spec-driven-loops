---
title: "Research Plan: Three-Model Deep-Research Fan-Out"
description: "Methodology for the 137 research phase: three deep-research lineages (GPT-5.6-SOL xhigh, GPT-5.6-LUNA max, GLM-5.2), five iterations each, dispatched through cli-codex and cli-opencode, then reconciled into one synthesis."
trigger_phrases:
  - "three model deep research plan"
  - "parallel git research methodology"
  - "sol luna glm fan-out"
importance_tier: "important"
contextType: "implementation"
status: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Defined the three-model fan-out methodology"
    next_safe_action: "Initialize lineage directories and run iteration 1 for each model"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "parallel-session-git-autosync-research-preparation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Three-Model Deep-Research Fan-Out

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Method** | Independent multi-lineage deep research, reconciled into one synthesis |
| **Lineages** | Three, one per model configuration |
| **Iterations** | Five per lineage; fifteen total |
| **Executors** | GPT via `cli-codex`; GLM via `cli-opencode` |
| **Output** | Per-lineage `research.md` plus a cross-lineage `research/research.md` synthesis |

### Overview

Run three independent research lineages over the same charter question, one per model. Each lineage runs five iterations that accumulate cited findings, then produces a lineage-level synthesis. A final reconciliation merges the three into one synthesis that notes agreement, disagreement, and unique evidence, and records the architecture decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Coverage | Every research question has cited findings | Manual review against the charter |
| Cross-model | Agreement and divergence are recorded | `fanout-attribution.md` + synthesis |
| Structure | Spec docs valid | `validate.sh --recursive --strict` on the packet |
| Honesty | Confidence labels present; contradictions surfaced not hidden | Synthesis review |
| No-loss | Recommendation documents how it avoids overwriting/orphaning uncommitted work | Decision record cross-check against REQ-003 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Lineages and models

| Lineage | Model config | Executor | Dispatch resolution | Iterations |
|---------|--------------|----------|---------------------|------------|
| `parallel-git-sol` | GPT-5.6-SOL, effort `xhigh`, tier `fast` | `cli-codex` | `--model gpt-5.6-sol -c model_reasoning_effort="xhigh" -c service_tier="fast"` | 5 |
| `parallel-git-luna` | GPT-5.6-LUNA, effort `max`, tier `fast` | `cli-codex` | `--model gpt-5.6-luna -c model_reasoning_effort="max" -c service_tier="fast"` | 5 |
| `parallel-git-glm` | GLM-5.2 | `cli-opencode` | opencode run with the GLM-5.2 model id | 5 |

Dispatch contracts are frozen for the phase: read `cli-external-orchestration/cli-codex/SKILL.md` and `cli-external-orchestration/cli-opencode/SKILL.md` before composing any dispatch. Each dispatch runs read-only (research, no repo mutation) except writing its own lineage iteration file.

### Lineage layout

Each lineage owns a directory under `research/lineages/<lineage>/`:

- `iterations/iteration-00N.md` — one file per iteration: findings, sources, confidence, and open threads.
- `findings-registry.json` — accumulated, de-duplicated findings for the lineage.
- `research.md` — the lineage synthesis after iteration five.

Top-level `research/`:

- `research.md` — the reconciled cross-lineage synthesis and the architecture recommendation.
- `fanout-attribution.md` — which lineage and model produced which load-bearing finding.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Setup

Confirm executor availability and auth, probe each model id with one cheap dispatch, initialize the three lineage directories, and freeze the dispatch contracts.

### Phase B — Iteration loop (per lineage, iterations 1 through 5)

1. Load the charter question and the prior iteration's open threads.
2. Investigate the assigned research questions with current sources; prefer primary docs, real tooling, and reproducible commands.
3. Record findings with a source and a confidence label; mark contradictions explicitly.
4. Write `iteration-00N.md` and update the lineage findings registry.
5. Check the stop conditions (convergence or the five-iteration cap).

After five iterations, write the lineage `research.md`.

### Phase C — Synthesis and decision

- Reconcile the three lineage syntheses into `research/research.md`: agreement, disagreement, and unique evidence per research question.
- Recommend one default architecture with trade-offs versus the runner-up strategies.
- Record the decision (chosen strategy, alternatives, consequences) in the phase decision record.
- List testable acceptance conditions for a future implementation phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Coverage | Every research question has cited findings | Manual review against the charter |
| Cross-model | Agreement and divergence are recorded | `fanout-attribution.md` + synthesis |
| Structure | Spec docs valid | `validate.sh --recursive --strict` on the packet |
| Honesty | Confidence labels present; contradictions surfaced not hidden | Synthesis review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` + Codex CLI (GPT-5.6 SOL/LUNA) | External | Required | GPT lineages cannot run |
| `cli-opencode` + OpenCode runtime (GLM-5.2) | External | Required | GLM lineage cannot run |
| ChatGPT OAuth / provider auth | External | Required | Dispatches fail at auth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A model is unavailable, an executor cannot authenticate, or a lineage produces no usable findings.
- **Procedure**: Record the gap honestly in the affected lineage, continue with the remaining lineages, and note reduced cross-model coverage in the synthesis rather than fabricating findings.
<!-- /ANCHOR:rollback -->
