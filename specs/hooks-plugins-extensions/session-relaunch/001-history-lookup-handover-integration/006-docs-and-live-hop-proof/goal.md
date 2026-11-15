---
title: "Goal: Phase 6: docs-and-live-hop-proof"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "docs and live hop proof goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/006-docs-and-live-hop-proof"
    last_updated_at: "2026-11-15T07:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase planning docs"
    next_safe_action: "Run the doc pass, then the live hop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-docs-and-live-hop-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Where is phase 001's recorded result table?"
      - "Which command and transcript directory produced 173, 48, 25 and 3?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: docs-and-live-hop-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every doc names the in-session handover as the home of the session history lookup, and one live hop proves a receiver can read the sender's turns.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lookup is offered at `claim`, not after a compaction, and every doc states that home. |
| D2 | The two historical changelog entries keep their original text, because each records what shipped on its date. |
| D3 | Every non-changelog file the inventory returns is updated, not only the seven files the phase scope names, because one stale mention contradicts the goal. |
| D4 | User-facing text states that search matches parts of an identifier split on `-`, `.`, `/`, `:` and `_` or a case change, and gives the `live` / `delivery` example. |
| D5 | The phase 001 measurement is reported as one table with a before and an after column, holding `answer` and `lookup_ran` per arm. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration --recursive --strict --quiet` prints `RESULT: PASSED`.
- [ ] `rg -l "History Lookup" --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!.skilled/changelog/**' --glob '!.skilled/skills/system-spec-kit/changelog/**' . | wc -l` prints 15.
- [ ] `rg -n 'Offers one bounded, read-only history lookup after a compaction' --glob '*.md' --glob '!specs/**' --glob '!**/node_modules/**' .` prints nothing.
- [ ] `rg -c 'history/cli.js' specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/scratch/live-hop.md` prints 1 or more.
- [ ] `rg -c 'lookup_ran' specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/scratch/measurement.md` prints 2 or more.
- [ ] `ls .skilled/changelog/skilled/` lists the new entry after `v4.0.2.1.md`.
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
| The fifteen non-changelog docs | Pending | - |
| The changelog entry | Pending | - |
| The live hop record | Pending | - |
| The before and after table | Pending | - |
| Recursive validation | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 001's result table is absent from this checkout | Its `spec.md`, `plan.md` and `tasks.md` are scaffolds, so the before column of the rerun table has no numbers yet. |
| No file records the command behind `173`, `48`, `25` and `3` | The counts are quoted from `../spec.md:67` and from `scratch/wave-c/brief-p1.md:31`. A rerun has to name its own command and directory. |
| The inventory returns seventeen files, and the phase scope names seven of them | The other eight non-changelog files are updated too, and the two historical changelogs are not. The goal is that every doc names the new home, and decision D3 records that reading. |

### Open questions

Open question: Where is phase 001's recorded result table? Its three planning docs are scaffolds in this checkout, so the before column of the rerun table has no numbers. UNKNOWN.
Open question: Which command and which transcript directory produced the counts `173`, `48`, `25` and `3` quoted from `../spec.md:67`? No file records them. UNKNOWN.
<!-- /ANCHOR:log -->
