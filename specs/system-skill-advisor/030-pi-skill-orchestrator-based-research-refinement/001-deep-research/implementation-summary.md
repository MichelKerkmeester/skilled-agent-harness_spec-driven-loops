---
title: "Implementation Summary: Research Phase for Pi Skill Orchestrator Against System Skill Advisor"
description: "Both lineages ran to their fixed counts, 10 MiMo and 5 SWE-2 MAX iterations, and the merged synthesis ranks twelve recommendations with every citation checked. Nine were built in phases 2 to 4, and the workflow close ran after a fix to its fan-out dashboard check."
trigger_phrases:
  - "pi skill orchestrator research status"
  - "fan-out research summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research"
    last_updated_at: "2026-09-26T14:05:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Fixed the fan-out dashboard check and ran the workflow close"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:2e7e7de1d7417d122aed09a4852206ed1a52bc4d4dfe724e40eb20d61f6ad57c"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
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
| **Completed** | 2026-09-26 |
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
- **A fixed close.** The research workflows' convergence step demanded a dashboard at the root of `research/`, which a fan-out run never writes, so every fan-out run would have logged a finished synthesis as incomplete. Both workflows now ask for the root dashboard only when there are no lineage logs. The close then ran: the convergence report, `synthesis_complete` through the append gateway, the findings block in `spec.md` and config status `complete`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../spec.md` | Created | Phase parent purpose, scope and phase map |
| `spec.md` | Created | Research brief, questions and requirements; the generated findings block |
| `plan.md` | Created | Fan-out invocation and data flow |
| `tasks.md` | Created | Run and verification steps |
| `research/` | Created | Lineage state, iterations, merged registry, `research.md` and the close's ledger events |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Root dashboard required only without lineage logs |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modified | The same rule in the confirm workflow |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Regenerated | Source digests of the two workflows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modified | Fan-out and no-lineage dashboard cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The folder was scaffolded with `create.sh --phase` and each document was written against its template. The fan-out ran through `/deep:research:auto` with two lineages at a concurrency of 2, and Opus 5.5 at max effort wrote the synthesis from both lineages' iterations, opening every cited range itself.

GPT-6 Luna at max effort wrote the dashboard fix through cli-codex, tests first: the new fan-out case failed with exit 2 before the change. The orchestrator reread the diff, reran the tests, reverted the change to watch the fan-out case fail, and regenerated the compiled command contract whose digests cover both workflows. It then ran the close steps from the fixed workflow, with the step's own command rendered from the YAML.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One research child with two lineages, not one child per executor | The fan-out runner merges lineages into a single synthesis, which is where the cross-model agreement record comes from |
| Stop policy `max-iterations` | The operator fixed the counts at 10 and 5, so convergence is recorded but does not end a lineage early |
| Shared verdicts count once | SWE-2 MAX read MiMo's synthesis before writing its own verdicts, so agreement between them is not independent |
| Fix the workflow instead of writing a root dashboard | A stand-in dashboard would satisfy the check once and leave it wrong for every later fan-out run; the operator approved the fix |
| Leave the deep-review workflows unchanged | They carry the same line, but whether a fan-out review writes a root dashboard was not checked |
| Put the findings block under the Open Questions anchor | It is one of the host locations the spec-check protocol names, and the open question it sits under is the one the findings answer |
| Append the report under the existing section 17 heading | The step's template opens with its own `## Convergence Report`, which would have duplicated the heading the synthesis already wrote |
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
| Convergence step, from the fixed workflow | Exit 0: `synthesis_complete` at ledger sequence 1 with 15 iterations and 7 of 7 questions; before the fix the only failure had been `missing_synthesis_artifacts` for the root dashboard |
| Findings write-back | One fence under the `questions` anchor; `spec_mutation` at ledger sequence 2; targeted validation `RESULT: PASSED` |
| Dashboard fix tests, `npx vitest run` on the nine files that read the research workflows | 146 of 146. Reverting the auto workflow fails the fan-out case and nothing else, 1 failed and 8 passed in that file |
| `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | RESULT: PASSED in all five folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The deep-review workflows keep the root dashboard check.** `deep-review-auto.yaml` and `deep-review-confirm.yaml` carry the same line; if a fan-out review also skips the root dashboard, it has the same false `synthesis_incomplete`.
2. **Lineage timestamps are unreliable.** The orchestration summary flags anomalies in 11 of 11 MiMo records and 2 of 7 SWE-2 MAX records.
3. **The synthesis read code; it ran nothing** except the measurements in section 14. Phases 2 to 4 confirmed its runtime claims before building on them.
<!-- /ANCHOR:limitations -->

---
