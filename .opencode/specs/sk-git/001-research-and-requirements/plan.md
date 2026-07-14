---
title: "Research Plan: Two-Model Deep-Research Fan-Out"
description: "Methodology for the 137 research phase: two deep-research lineages (GPT-5.6-SOL xhigh, GPT-5.6-LUNA max), five iterations each via cli-codex, reconciled into one synthesis and hardened by a three-pass verification. A planned GLM-5.2 lineage was dropped for safety."
trigger_phrases:
  - "two model deep research plan"
  - "parallel git research methodology"
  - "sol luna fan-out"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/137-parallel-session-git-autosync/001-research-and-requirements"
    last_updated_at: "2026-07-14T11:35:37Z"
    last_updated_by: "claude"
    recent_action: "Recorded the two-model fan-out methodology as executed"
    next_safe_action: "Carry the decision record into the first implementation phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "parallel-session-git-autosync-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Two-Model Deep-Research Fan-Out

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Method** | Independent multi-lineage deep research, reconciled into one synthesis, then hardened by a three-pass verification |
| **Lineages** | Two completed (SOL, LUNA); a third (GLM) was planned and dropped for safety |
| **Iterations** | Five per lineage; ten total |
| **Executors** | GPT via `cli-codex` (through the sanctioned `deep-research` fan-out) |
| **Output** | Per-lineage `research.md` plus a cross-lineage `research/research.md`, `fanout-attribution.md`, and `decision-record.md` |

### Overview

Run independent research lineages over the same charter question, one per model. Each lineage runs five iterations that accumulate cited findings, then produces a lineage-level synthesis. A final reconciliation merges them into one synthesis noting agreement, disagreement, and unique evidence, records the architecture decision, and is hardened by a three-pass verification before freeze.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Coverage | Every research question has cited findings | Manual review against the charter |
| Cross-model | Agreement and divergence are recorded | `fanout-attribution.md` + synthesis |
| Structure | Spec docs valid | `validate.sh --recursive --strict` on the packet |
| Honesty | Confidence labels present; contradictions surfaced not hidden | Synthesis review + verification chain |
| No-loss | Recommendation documents how it avoids overwriting/orphaning uncommitted work | Decision record cross-check against REQ-003 |
| Never-behind | The primary-never-behind invariant is stated, proven, and costed | `research/research.md` §4 + ADR-003 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Lineages and models

| Lineage | Model config | Executor | Dispatch resolution | Iterations | Status |
|---------|--------------|----------|---------------------|------------|--------|
| `parallel-git-sol` | GPT-5.6-SOL, effort `xhigh`, tier `fast` | `cli-codex` | `--model gpt-5.6-sol -c model_reasoning_effort="xhigh" -c service_tier="fast"` | 5 | Complete |
| `parallel-git-luna` | GPT-5.6-LUNA, effort `max`, tier `fast` | `cli-codex` | `--model gpt-5.6-luna -c model_reasoning_effort="max" -c service_tier="fast"` | 5 | Complete |
| `parallel-git-glm` | GLM-5.2 | `cli-opencode` | opencode run with the GLM-5.2 model id | 0 | Dropped for safety |

The fan-out ran through the sanctioned `deep-research` mode packet (`fanout-run.cjs --executors`), not a raw `codex exec` loop. Dispatch contracts were frozen for the phase: read `cli-external-orchestration/cli-codex/SKILL.md` before composing any dispatch. Each lineage ran read-only research (writing only its own lineage iteration files). GLM was dropped because its executor required `--dangerously-skip-permissions` on the shared dirty tree.

### Lineage layout

Each lineage owns `research/lineages/<lineage>/`:

- `iterations/iteration-00N.md` — one file per iteration: findings, sources, confidence, open threads.
- `research.md` — the lineage synthesis after iteration five.

Top-level `research/`:

- `research.md` — the reconciled cross-lineage synthesis + architecture recommendation.
- `fanout-attribution.md` — which lineage/model produced which load-bearing finding + the verification chain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Setup

Confirm executor availability and auth, probe each model id with one cheap dispatch, initialize the lineage directories, and freeze the dispatch contracts.

### Phase B — Iteration loop (per lineage, iterations 1 through 5)

1. Load the charter question and the prior iteration's open threads.
2. Investigate the assigned research questions with current sources; prefer primary docs, real tooling, reproducible commands.
3. Record findings with a source and a confidence label; mark contradictions explicitly.
4. Write `iteration-00N.md`.
5. Check the stop conditions (convergence or the five-iteration cap).

After five iterations, write the lineage `research.md`.

### Phase C — Synthesis, verification, and decision

- Reconcile the lineage syntheses into `research/research.md`: agreement, disagreement, unique evidence per research question.
- Verify in three passes (SOL synthesis → Fable-5 → SOL verify-of-Fable); fold the confirmed findings and blocking prerequisites into the recommendation.
- Recommend one default architecture with trade-offs; answer RQ-8 (primary never behind).
- Record the decision (chosen strategy, alternatives, consequences) and honest caveats in `decision-record.md`.
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
| Honesty | Confidence labels present; contradictions surfaced not hidden | Synthesis + three-pass verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` + Codex CLI (GPT-5.6 SOL/LUNA) | External | Used | GPT lineages cannot run |
| `deep-research` fan-out (`fanout-run.cjs`) | Internal | Used | The sanctioned multi-lineage mechanism |
| `cli-opencode` + OpenCode runtime (GLM-5.2) | External | Dropped for safety | GLM lineage not run |
| ChatGPT OAuth / provider auth | External | Used | Dispatches fail at auth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A model is unavailable, an executor cannot authenticate, or a lineage produces no usable findings.
- **Procedure**: Record the gap honestly in the affected lineage, continue with the remaining lineages, and note reduced cross-model coverage in the synthesis rather than fabricating findings. (Realized: the GLM lineage was dropped for safety and the reduced coverage is recorded.)
<!-- /ANCHOR:rollback -->
