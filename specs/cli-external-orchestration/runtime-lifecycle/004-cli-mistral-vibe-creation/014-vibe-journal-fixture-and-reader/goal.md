---
title: "Goal: Phase 14: vibe-journal-fixture-and-reader"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe journal fixture and reader goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/014-vibe-journal-fixture-and-reader"
    last_updated_at: "2026-11-14T22:50:00Z"
    last_updated_by: "code"
    recent_action: "Recorded the four journal facts and built the Vibe reader with its tests"
    next_safe_action: "Hand the facts to phases 016, 017 and 018"
    blockers: []
    key_files:
      - ".vibe/plugins/repo-guards/fixtures/run-fixture.sh"
      - ".skilled/hooks/shared/session-readers/index.mjs"
      - ".skilled/hooks/shared/session-readers/vibe.mjs"
      - "specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/014-vibe-journal-fixture-and-reader/scratch/facts.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: the reply is on disk at post_agent start as a completion record, not yet in the projection"
      - "Q2: a deny retries with its reason, three retries cap the turn, and turn_id is stable"
      - "Q3: a compaction is a checkpoint entry with kind compaction and details.trigger"
      - "Q4: post_tool for ask_user_question is interactive-only, with an operator procedure"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: vibe-journal-fixture-and-reader

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace the source-reading guesses behind the Vibe turn-end, capture and compaction designs with observed facts, and give those hooks one tested reader for the session journal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A fact counts as settled only with a recorded run's journal excerpt, or an explicit interactive-only verdict with operator steps |
| D2 | One reader module knows the journal format. No hook parses the journal itself |
| D3 | The reader is read-only, and returns a failure code rather than an empty success on an unknown format |
| D4 | No new hook is registered in `.vibe/hooks.toml` in this phase |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c '^## Q' scratch/facts.md` prints 4, and every section has `Answer:` and `Consequence:` lines
- [ ] `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` prints `fail 0`
- [ ] `node -e "import('./.skilled/hooks/shared/session-readers/index.mjs').then(m => console.log(m.capabilities.vibe.status))"` prints `gated`
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
| Plan | Done | Spec, plan and tasks authored from the Fable gap designs and the orchestrator's source checks |
| Probes | Done | `scratch/facts.md` and `scratch/journal-excerpts/` |
| Reader | Done | `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` prints `fail 0` |

### Deviations and findings

| Item | Note |
|------|------|
| Version check | `meta.json` has no version field, and `export.json` holds `vibe_version` only after the run ends. So the reader checks record shapes instead of a version |
| Reply timing | The reply is on disk at `post_agent` start as a `completion_succeeded` record, but the projection's assistant message is appended after the hook. The reader reads the completion first |
| Fixture config | `allowed_models` matches a row's `name`, not its alias, so the compaction row reuses a configured model name and takes its own alias |

Answered: Q1 - the reply is on disk as a completion record, not yet in the projection; feeds phase 016's turn-end read.

Answered: Q2 - a deny retries with its reason, three retries cap the turn, and `turn_id` is stable across them; feeds phase 016's once-per-turn key.

Answered: Q3 - a compaction is a `checkpoint` entry with `kind: "compaction"` and `details.trigger`; feeds phase 018's compaction match.

Answered: Q4 - `post_tool` for `ask_user_question` is interactive-only, with the operator procedure in `scratch/facts.md`; feeds phase 017's journal fallback.
<!-- /ANCHOR:log -->
