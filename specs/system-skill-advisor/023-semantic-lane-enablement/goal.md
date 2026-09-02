---
title: "Goal: Semantic Lane Enablement"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and its phase binding"
    next_safe_action: "Execute 001-baseline-and-instrumentation against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-semantic-lane-enablement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Semantic Lane Enablement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the advisor's semantic lane contribute real signal, with vectors for every hub and a weight chosen by measurement, behind a switch that reverts in one command.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lane is live at weight 0.05, not shadow-only. The earlier reading is corrected on the record rather than carried forward |
| D2 | Coverage is read from the active `vec_<dim>` table, never from the retired `skill_nodes.embedding` column |
| D3 | No weight, flag or vector changes before phase 004. Phases 001 to 003 measure and plan |
| D4 | The scorer-eval ratchet may not lose a row. A gain is re-captured deliberately, a drop is a stop |
| D5 | Gate B is re-measured on the frozen 180-row corpus, never on a corpus rewritten so it lands |
| D6 | Coverage moves first and weight second, so a weight is never chosen against missing vectors |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-baseline-and-instrumentation | `001-baseline-and-instrumentation/goal.md` |
| 002-embedding-population | `002-embedding-population/goal.md` |
| 003-weight-and-fusion-research | `003-weight-and-fusion-research/goal.md` |
| 004-gated-enable | `004-gated-enable/goal.md` |
| 005-verification-and-closeout | `005-verification-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail, and child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path, so a criterion
left only here is invisible to whatever judges completion.

- [ ] `sqlite3 "file:.opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite?mode=ro" "select (select count(*) from skill_nodes) - (select count(*) from vec_768);"` prints `0`
- [ ] `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 with no metric below its committed baseline
- [ ] The Gate B re-measurement on the frozen 180-row corpus reports at least 30 of 172 top-only, with its raw replies kept
- [ ] Five named canary prompts each return their intended hub at `recommendations[0]`
- [ ] Unsetting one environment variable and restarting the daemon returns every ratchet metric to its pre-enable value
- [ ] `validate.sh specs/system-skill-advisor/023-semantic-lane-enablement --strict --recursive` reports `RESULT: PASSED` for all six folders
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet planned as five phases | Done | `recommend-level.sh --loc 800 --files 18 --architectural --api --db` returns level 3, phase score 30 |
| 001 baseline and instrumentation | Pending | None yet |
| 002 embedding population | Pending | None yet |
| 003 weight and fusion research | Pending | None yet |
| 004 gated enable | Pending | None yet |
| 005 verification and closeout | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| The lane was described as shadow-only | `lane-registry.ts` declares `semantic_shadow` with `live: true`, so fusion never marks it shadow-only. The packet corrects the premise it was scoped on |
| Coverage was described as zero of fourteen | The retired column is empty, but the active `vec_768` table holds nine rows. Five hubs are genuinely missing |
| The suggested phase count was two | `recommend-level.sh` suggests two phases in the 25 to 34 band. Five were authored because measurement, population, research, enable and closeout each carry their own gate |
| The ratchet cannot see a real embedding change | The baseline capture sets `VITEST=true`, which substitutes deterministic fixture vectors. Phase 001 owns finding a second run that scores real vectors |
<!-- /ANCHOR:log -->
