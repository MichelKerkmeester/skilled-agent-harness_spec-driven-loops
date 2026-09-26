---
title: "Implementation Summary: Research Phase for Pi Skill Orchestrator Against System Skill Advisor"
description: "Both lineages ran to their fixed counts, 10 MiMo and 5 SWE-2 MAX iterations, and the merged synthesis ranks twelve recommendations with every citation checked. Nine were built in phases 2 to 4. The workflow close waits on one contract gap."
trigger_phrases:
  - "pi skill orchestrator research status"
  - "fan-out research summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research"
    last_updated_at: "2026-09-26T13:55:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Recorded the run outcome; the workflow close is blocked on the fan-out dashboard invariant"
    next_safe_action: "Resolve the dashboard invariant, then close"
    blockers:
      - "step_convergence_report requires research/deep-research-dashboard.md, which a fan-out run never writes at the root"
    key_files:
      - "research/research.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Executor split fixed by the operator: 10 iterations MiMo v2.6 Pro high via cli-pi, 5 iterations SWE-2 MAX via cli-devin."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Research Phase for Pi Skill Orchestrator Against System Skill Advisor

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-research |
| **Completed** | Research and synthesis 2026-09-26; the workflow close is pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research ran as planned: two independent model families read both codebases, and one merged synthesis ranks twelve recommendations with every cited line checked. The operator adopted nine of them, R1 to R7, R11 and R12, and phases 2 to 4 built them.

### Phase 1: deep-research

- **Two lineages.** MiMo v2.6 Pro at high effort through cli-pi ran 10 iterations, and SWE-2 MAX through cli-devin ran 5. Both stopped on `maxIterationsReached`, as the fixed-count stop policy intends.
- **One synthesis.** `research/research.md` answers RQ1 to RQ7, records where the lineages agree and diverge, and ranks R1 to R12. R8, R9 and R10 each wait on a replay or an A/B test.
- **A checked ledger.** Section 14 checks 576 cited ranges: 548 resolved, 20 drifted and 8 failed. Both lineages had reported zero failures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../spec.md` | Created | Phase parent purpose, scope and phase map |
| `spec.md` | Created | Research brief, questions and requirements |
| `plan.md` | Created | Fan-out invocation and data flow |
| `tasks.md` | Created | Run and verification steps |
| `research/` | Created | Lineage state, iterations, merged registry and `research.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The folder was scaffolded with `create.sh --phase` and each document was written against its template. The fan-out ran through `/deep:research:auto` with two lineages at a concurrency of 2, and Opus 5.5 at max effort wrote the synthesis from both lineages' iterations, opening every cited range itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One research child with two lineages, not one child per executor | The fan-out runner merges lineages into a single synthesis, which is where the cross-model agreement record comes from |
| Stop policy `max-iterations` | The operator fixed the counts at 10 and 5, so convergence is recorded but does not end a lineage early |
| Shared verdicts count once | SWE-2 MAX read MiMo's synthesis before writing its own verdicts, so agreement between them is not independent |
| Do not record the convergence event yet | The contract's invariant would log `synthesis_incomplete` for a dashboard the fan-out path never writes, which misstates a complete synthesis |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Devin preflight | PASS: `devin auth status` printed `Logged in (via Devin)` |
| MiMo preflight | PASS: `pi -p --offline --model llmgateway/mimo-v2.6-pro --thinking high` replied `OK` |
| Lineage runs | 2 of 2 succeeded: 10 and 5 iteration records, both `maxIterationsReached` |
| Citation ledger | 576 ranges: 548 resolved, 20 drifted, 8 failed, 0 not checked |
| Convergence invariant, run without recording | Every findings invariant passes: 50 registry findings, 0 missing structured findings, 0 reconstruction gaps. The only failure is `missing_synthesis_artifacts` for `research/deep-research-dashboard.md` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | RESULT: PASSED in all five folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow close waits on a contract gap.** `step_convergence_report` in `.skilled/commands/deep/assets/deep-research-auto.yaml` checks for a root `research/deep-research-dashboard.md`, but a fan-out run writes dashboards only inside each lineage, so the check fails closed on every fan-out run. Until that is decided, section 17 of `research.md` stays empty, the config stays `initialized`, and the findings write-back and continuity save have not run.
2. **Lineage timestamps are unreliable.** The orchestration summary flags anomalies in 11 of 11 MiMo records and 2 of 7 SWE-2 MAX records.
3. **The synthesis read code; it ran nothing** except the measurements in section 14. Phases 2 to 4 confirmed its runtime claims before building on them.
<!-- /ANCHOR:limitations -->

---
