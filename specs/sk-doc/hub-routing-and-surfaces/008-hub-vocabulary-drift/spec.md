---
title: "Feature Specification: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes"
description: "Commit 7af52ef940 added nine phrases to the vocabularyClasses of two hub-router.json files and did not carry them to the hubs' root ROUTER.md. The Routing Registry Drift Guard step Hub vocabulary source failed on main with drift=9. This packet carries the nine phrases to the two root ROUTER.md files and refreshes the files derived from them."
trigger_phrases:
  - "hub vocabulary drift"
  - "add the nine hub router json phrases"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/372-hub-vocabulary-drift` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Commit 7af52ef940 (command surfacing, 2026-11-13) added nine phrases to the `vocabularyClasses` of two `hub-router.json` files and did not carry them to the hubs' root `ROUTER.md`. The Routing Registry Drift Guard step "Hub vocabulary source" therefore fails on main with `drift=9`, which blocks every change that runs that guard. The check reads only the `INTENT_SIGNALS` block of each hub's root `ROUTER.md`, never a mode packet's `ROUTER.md`.

### Purpose
The two root `ROUTER.md` files carry all nine phrases, the files derived from them are fresh and the check prints `drift=0` with `RESULT: PASSED`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs | grep -v 'stage-two-reverse '
DRIFT sk-doc                       alias=0 stage-two=6 triggers=0 packets=0 stage-two-reverse=118
  stage-two sk-create-agent: "agent definition" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two sk-create-agent: "specialist persona file" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two sk-create-command: "prompt shortcut" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two sk-create-command: "confirm flag" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two sk-create-diff: "before and after my rewrite" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two sk-create-goal: "intent file" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
DRIFT system-deep-loop             alias=0 stage-two=3 triggers=0 packets=0 stage-two-reverse=0
  stage-two research: "find out everything" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two review: "findings stop changing" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
  stage-two ai-council: "several models" routes here in hub-router.json but no ROUTER.md intent for this mode carries it
checked=7 hub(s), drift=9
RESULT: FAILED
(exit status 1, measured on origin/main 2ecb17e7a6 before any edit; the five hubs that print OK are left out)
```

The Problem Statement quotes `drift=9` from the `checked=7 hub(s), drift=9` line. The nine phrases are the `stage-two=6` lines for sk-doc and the `stage-two=3` lines for system-deep-loop. The source of this block is `scratch/measured-before.txt`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Append the six sk-doc phrases to the `INTENT_SIGNALS` keywords of the sk-doc root `ROUTER.md`.
- Append the three system-deep-loop phrases to the `INTENT_SIGNALS` keywords of the system-deep-loop root `ROUTER.md`.
- Regenerate the two hub `graph-metadata.json` files, because the step "Router intent-signal carry" requires every multi-word `ROUTER.md` phrase in the hub's `intent_signals`.
- Refresh the system-deep-loop compiled-route manifest and its archive copy, because `compiled-route-guard.cjs` reports a stale manifest once the `ROUTER.md` changes.
- Recompile the advisor skill graph and recapture the local-native divergence ledger, because both are derived from the hub intent signals.

### Out of Scope
- `scorer-eval-baseline.json`, `routing-baseline.json` and the three corpus files - the session that owns packet `system-skill-advisor/routing-and-scoring/008-command-surfacing-build` edits them on its unpushed branch.
- Both `hub-router.json` files and `mode-registry.json` - same owner, and the nine phrases are already correct there.
- The `SKILL_CREATION` line - same owner. The operator decision of 2026-11-13 for the shared sk-doc `ROUTER.md` was "Edit here, other lines". The frontmatter version line of both `ROUTER.md` files is not on this list. The pre-commit gate `doc-version-bump` raised it by itself during commit bc86b64c79 on branch `worktrees/372-hub-vocabulary-drift`: `.skilled/skills/sk-doc/ROUTER.md` from 2.4.6.0 to 2.4.7.0 and `.skilled/skills/system-deep-loop/ROUTER.md` from 1.6.8.0 to 1.6.9.0.
- Any mode packet's `ROUTER.md` - the check never reads one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/ROUTER.md` | Modify | Six keywords appended: `AGENT_CREATION` gets "agent definition" and "specialist persona file", `COMMAND_CREATION` gets "prompt shortcut" and "confirm flag", `DIFF` gets "before and after my rewrite", `GOAL_AUTHORING` gets "intent file". The pre-commit gate `doc-version-bump` raised the frontmatter version line from 2.4.6.0 to 2.4.7.0 during commit bc86b64c79 |
| `.skilled/skills/system-deep-loop/ROUTER.md` | Modify | Three keywords appended: `RESEARCH` gets "find out everything", `REVIEW` gets "findings stop changing", `AI_COUNCIL` gets "several models". The pre-commit gate `doc-version-bump` raised the frontmatter version line from 1.6.8.0 to 1.6.9.0 during commit bc86b64c79 |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modify | Written by `generate-router-intent-signals.cjs --write` |
| `.skilled/skills/system-deep-loop/graph-metadata.json` | Modify | Written by `generate-router-intent-signals.cjs --write` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Modify | Refreshed by `compiled-route-manifest.cjs refresh --hub system-deep-loop` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json` | Modify | Copy of the manifest above, written by the same refresh |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled by `skill_graph_compiler.py --export-json` |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Recaptured by `capture-local-native-divergence-ledger.mjs --write` |
| `specs/sk-doc/hub-routing-and-surfaces/graph-metadata.json` | Modify | `create.sh` added this packet to `children_ids` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Rebuilt trigger index, written by `generate-trigger-index.mjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Modify | Written by the same `generate-trigger-index.mjs` run |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Modify | Written by the same `generate-trigger-index.mjs` run |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Modify | Written by the same `generate-trigger-index.mjs` run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every phrase in a hub's `hub-router.json` `vocabularyClasses` is carried by a root `ROUTER.md` intent of the same mode | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` and `RESULT: PASSED` and exits 0 |
| REQ-002 | Every multi-word `ROUTER.md` phrase is in the hub's `intent_signals` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` prints `checked=7 hub(s), missing=0, orphans=0` and `RESULT: PASSED` and exits 0 |
| REQ-003 | No compiled-route manifest is stale | `node .skilled/bin/compiled-route-guard.cjs` reports every hub fresh and exits 0, and `node .skilled/bin/compiled-route-admission.cjs --hub system-deep-loop` reports 16 pass and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The advisor skill graph matches the hub intent signals | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` reports no SIGNAL DRIFT and exits 0, and `skill_graph_compiler.py --validate-only` prints `VALIDATION PASSED` and exits 0 |
| REQ-005 | The hub packages stay valid | `parent-skill-check.cjs` prints OK for all seven hubs and `validate_skill_package.py` prints PASS for sk-doc and system-deep-loop, each with exit 0 |
| REQ-006 | No file listed under Out of Scope is changed on this branch | `git status --short` lists none of those files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` and `RESULT: PASSED` where the Measured Behavior block shows `drift=9` and `RESULT: FAILED`.
- **SC-002**: `generate-router-intent-signals.cjs --check`, `compiled-route-guard.cjs` and `skill-graph-freshness.cjs --strict` each exit 0 on this branch.
- **SC-003**: The branch is merged by the 008-command-surfacing-build session, which recaptures `scorer-eval-baseline.json` once.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The session that owns packet `system-skill-advisor/routing-and-scoring/008-command-surfacing-build` | This branch does not go to main by itself. Until that session merges it, main keeps failing the check | Operator decision of 2026-11-13, "Commit here, land via 008": this branch is committed and handed to that session |
| Risk | Both sessions edit `.skilled/skills/sk-doc/ROUTER.md` | Medium. A merge conflict if both touch the same line | This branch edits by hand only the four intent lines named in Files to Change and leaves the `SKILL_CREATION` line alone. The pre-commit gate `doc-version-bump` raised the frontmatter version line to 2.4.7.0 in commit bc86b64c79. The command surfacing branch raises that line to the same 2.4.7.0, so both branches make an identical change to it |
| Risk | `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` is red on this branch | Low. One more holdout prompt now routes correctly, which the ratchet reports as an improvement | The 008 session recaptures `scorer-eval-baseline.json` once after the merge |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The two questions this work raised were answered by the operator on 2026-11-13 and are recorded in `implementation-summary.md` under Key Decisions.
<!-- /ANCHOR:questions -->

---
