---
title: "Implementation Plan: Phase 5: alignment-report-fixes"
description: "Fix the ten distinct findings of the alignment report in five groups, the agent packet first and the generated outputs last, and prove each with the command the report used to find it."
trigger_phrases:
  - "alignment report fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: alignment-report-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents, two YAML workflow files, JSON routing metadata |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The checker each finding quotes, the advisor replay, the roster and mirror checks, and a re-run of the alignment battery |

### Overview
Ten findings, five groups. The agent packet comes first, because its step text is what the command, the playbook and the READMEs then repeat. The `/create:agent` workflow and the `@markdown` agent come second. The hub routing vocabulary is third and is the only group that can move another skill's routing, so it is replayed before and after. The harness line and the release notes are single edits. The trigger-index outputs are regenerated last, from the final tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The alignment report is copied to `scratch/alignment-report/`
- [x] The two P1 findings are reproduced by a command from this session
- [x] The baseline of every check in section 5 is saved in `scratch/baseline.txt` before the first edit

### Definition of Done
- [x] Every requirement in `spec.md` section 4 holds
- [x] A re-run of the alignment battery reports no failing row
- [x] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and the mirror check exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation and workflow alignment. No runtime code changes.

### Key Components
- **The `sk-create-agent` packet**: `SKILL.md` holds the creation workflow. Its README, playbook and changelog describe it and move with it.
- **The `/create:agent` workflow files**: two YAML files, one per mode, and a presentation file. They run their own six steps and gain one sub-step and one check.
- **The `@markdown` agent**: executes `/create:*` workflows inside a hard write boundary. The boundary gains the registry and the generated rosters, for `/create:agent` only.
- **The `sk-doc` hub routing surfaces**: the mode registry, the hub router, the hub's graph metadata and the advisor's skill graph carry the agent mode's vocabulary.

### Data Flow
An author runs `/create:agent`. The workflow writes the agent file, then, for a file under `.skilled/agents/`, adds the registry record and rewrites the rosters. Validation runs the roster check, which compares the agent files with the registry. The advisor reaches the mode through the hub's vocabulary, so a prompt about the registry has to match a phrase the hub carries.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup saves the baseline of every check. Implementation runs the five groups in the order the summary gives. Verification replays the advisor prompts, runs the roster, mirror, playbook, changelog and version checks, regenerates the trigger index, re-runs the alignment battery and validates the packet.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each finding is closed by the command that found it. `check_changelog_shape.py` must pass on both changelog entries. The advisor must return `sk-doc` first for the two registry prompts, and the report's thirteen probes must still pass. `sync-agent-roster.cjs --check` and `check-agent-mirror-sync.cjs` must exit 0 after the `@markdown` edit. `check-release-coverage.cjs` must print `missing=0`. `generate-trigger-index.mjs --check` must print no hash note. The alignment battery is then re-run on the branch, and its failing rows are compared with the one it had before.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `python3` and `rg`. No new package. The `sk-doc` hub's version rule and the hub routing rule in `.skilled/repo-rules/skill-hub-routing.md` both apply, because the vocabulary edit is to a mode inside a hub.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the advisor's regression suite or the routing drift guard fails on main after the merge, or the new workflow step blocks `/create:agent`. Revert the phase's commits with `git revert`. The routing vocabulary ships in the `sk-doc` commit with the skill's keyword line, because the hub vocabulary check requires the two to agree in every commit.
<!-- /ANCHOR:rollback -->

---
