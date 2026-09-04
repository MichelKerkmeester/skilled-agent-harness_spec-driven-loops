---
title: "Goal: Embedding Population"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/002-embedding-population"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-002-embedding-population"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Embedding Population

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short, because goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every skill node a current vector in the active table, and write down why five of them had none.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The active pointer stays as it is. Changing the model re-embeds everything for a reason this packet does not have |
| D2 | Embedding runs against the local backend, so no hub description leaves the machine |
| D3 | The mechanism is reproduced before anything is fixed. A fix aimed at a guess is worse than no fix |
| D4 | Coverage is verified by counting the table, never by reading the refresh result |
| D5 | The corpus is re-measured at the unchanged weight, so coverage and weight never move together |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path.

- [ ] `select (select count(*) from skill_nodes) - (select count(*) from vec_768);` returns `0`
- [ ] A second refresh reports `embedded: 0` and no row timestamp moves
- [ ] A refresh against a stopped backend leaves the copied table's row count unchanged
- [ ] Deleting one row makes `tests/skill-graph/refresh-roundtrip.vitest.ts` exit non-zero
- [ ] The reproduced skip is named with a file and a line in `research/population.md`
- [ ] The 180-row corpus is re-measured at weight 0.05 and its count recorded beside the 8 of 172 baseline
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
| Skip reproduced | Pending | None yet |
| Coverage full | Pending | None yet |
| Hash guard proven both ways | Pending | None yet |
| Corpus re-measured at unchanged weight | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| The simplest explanation is already ruled out | All five uncovered hubs carry a description in their `SKILL.md` frontmatter as of 2026-09-03, so the empty-description delete path does not explain them |
| Two write batches, not one | Stored timestamps show six rows written on 2026-08-02 and three on 2026-08-21, and the missing five are not a contiguous range in identifier order |
<!-- /ANCHOR:log -->
