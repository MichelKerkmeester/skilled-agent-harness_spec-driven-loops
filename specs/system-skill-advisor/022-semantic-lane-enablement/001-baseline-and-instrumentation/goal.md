---
title: "Goal: Baseline and Instrumentation"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/001-baseline-and-instrumentation"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-001-baseline-and-instrumentation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Baseline and Instrumentation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short, because goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Record the real starting numbers for the semantic lane and make its contribution readable, so every later phase argues from measurement.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Coverage means a row in the active `vec_<dim>` table, which is what `loadSkillEmbeddings` reads |
| D2 | Nothing in this phase writes to the graph database or changes a score |
| D3 | The corpora are adopted as frozen gates and pinned by hash, never edited to suit a result |
| D4 | A command counts as evidence only after its output and its exit status are read from a file |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path.

- [ ] `sqlite3 "file:<db>?mode=ro" "select id from skill_nodes where id not in (select skill_id from vec_768);"` prints the same five names the baseline document lists
- [ ] `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` prints six metrics that match the recorded table
- [ ] `advisor_status` returns a vector count equal to `select count(*) from vec_768;`
- [ ] Twenty timed corpus calls are recorded, each with its own output file and its own exit status file
- [ ] The document states whether any run scores real embeddings, naming it or recording its absence
- [ ] `validate.sh <this folder> --strict` reports `RESULT: PASSED` with zero errors
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
| Coverage counted from the active table | Pending | None yet |
| Scorer baseline re-captured | Pending | None yet |
| Corpora hashed and pinned | Pending | None yet |
| Status instrumentation added | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| Planning-time reading of coverage | A read-only query on 2026-09-03 returned 14 nodes, 9 rows in `vec_768` and 0 in the retired column. The phase re-runs it rather than trusting this number |
| Planning-time reading of the lane weight | `advisor_status` reported `semantic_shadow: 0.05` against a live total of 1.00 |
<!-- /ANCHOR:log -->
