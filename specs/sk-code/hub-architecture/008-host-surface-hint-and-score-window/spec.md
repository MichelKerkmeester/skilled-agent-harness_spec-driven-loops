---
title: "Feature Specification: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases"
description: "A session's surface hint only reorders surfaces the prompt already matched, so a hinted surface never joins a scored route and a hinted prompt that scores nothing defers. A surface that matches three phrases scores 12 against a workflow mode's 4, so the review mode is dropped from a review request."
trigger_phrases:
  - "host surface hint and score window"
  - "let a session surface hint join a scored"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A vendoring project reported two limits of the sk-code hub router as items 8 and 9 of its second handover, copied as `specs/system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine/handover-from-barter-024.md`. Both hold in this repository.

The hint limit: `applySurfaceHint` reorders the surfaces a route already holds and adds none, so a caller that names the surface its session works in gets the same route as a caller that names nothing. A hinted prompt that scores no mode defers.

The score limit: every mode scores its matched phrases times a weight of 4, and only modes within `ambiguityDelta` 1 of the top score are kept. A surface that matches several phrases therefore drops a workflow mode that matched one. A host that adds a surface of its own loses that surface the same way.

One line of the handover does not hold here. It says `hintedFallbackSurface` in `canary-router.cjs` runs only when no mode scored. This repository has no such function at `b3c140536fb` or at the vendoring project's pin `d0fc9d719b`. The function is in the vendoring project's own overlay of the file, which also scores by merged prompt spans in place of distinct keywords.

### Purpose
A session's surface hint adds its surface to a scored route, and a request that names a workflow mode keeps that mode however many phrases a surface matches.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
$ node specs/sk-code/hub-architecture/008-host-surface-hint-and-score-window/scratch/probe-routes.cjs .
ambiguityDelta=1 weights=sk-code-quality:4,sk-code-review:4,sk-code-skilled:4,sk-code-ci:4,sk-code-frontend:4
surfaceDetection={"fallback":"sk-code-skilled","labels":{"SKILLED":"sk-code-skilled","FRONTEND":"sk-code-frontend"},"specific":["sk-code-frontend"]}
{"prompt":"review the dark mode toggle and focus trap","surfaceHint":null,"scores":[{"mode":"sk-code-frontend","score":12},{"mode":"sk-code-review","score":4}],"action":"route","targets":["sk-code-frontend"]}
{"prompt":"fix the responsive grid and the sticky header","surfaceHint":null,"scores":[{"mode":"sk-code-frontend","score":8}],"action":"route","targets":["sk-code-frontend"]}
{"prompt":"make the navbar sticky with css","surfaceHint":"FRONTEND","scores":[{"mode":"sk-code-frontend","score":8}],"action":"route","targets":["sk-code-frontend"]}
{"prompt":"review this function for bugs","surfaceHint":null,"scores":[{"mode":"sk-code-review","score":4},{"mode":"sk-code-skilled","score":4}],"action":"route","targets":["sk-code-review","sk-code-skilled"]}
{"prompt":"review this function for bugs","surfaceHint":"FRONTEND","scores":[{"mode":"sk-code-review","score":4},{"mode":"sk-code-skilled","score":4}],"action":"route","targets":["sk-code-review","sk-code-skilled"]}
{"prompt":"add a filter to the table","surfaceHint":"FRONTEND","scores":[],"action":"defer","targets":[]}
exit status: 0

$ git grep -n hintedFallbackSurface d0fc9d719b -- .skilled/bin ; git grep -n hintedFallbackSurface HEAD -- .skilled
(no output from either search)

$ rg -c hintedFallbackSurface barter/ai-speckit/skilled/barter-overlays/skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs
4
```

Line 3 is item 9: the review mode scored 4, the frontend surface 12, and the route holds the surface alone. Lines 6 and 7 are item 8: the hint changes nothing. The last probe line is the hinted prompt that defers. The two `git grep` runs searched this repository, and the `rg` run was made from the primary checkout, where the vendoring project's tree sits.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add the hinted surface to a scored route that lacks it, as the first surface after the workflow modes, when the hint names a surface the hub declares as specific.
- Score a surface so that its phrase count cannot drop a workflow mode or a second surface the prompt matched. T003 measures two candidates against the hub's case file before one is chosen.
- Route a hinted prompt that scores no mode to the hinted surface, when the hint names a surface the hub declares as specific. The operator added this on 2026-11-16.
- Make the hint a request fact, so two requests that differ only in the hint do not share a request hash.
- Say in the sk-code README what a host may change in `hub-router.json` in the meantime, a surface's `weight` and `routerPolicy.ambiguityDelta`.
- Correct the `--surface-hint` line in `.skilled/bin/README.md`.

### Out of Scope
- The vendoring project's span-merged scoring - it is a second difference in its router overlay that the handover does not list. It is named here so the operator can ask about it.
- The keyword `lcp regression` - the handover says it is not Skilled's.
- The baseline capture of item 10 - it is `specs/system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modify | The join, the surface score and the hint as a request fact |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | Pass the hint into the evaluation, since a join changes the route's kind and must be validated |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Cases for the join and for a workflow mode kept beside a surface |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modify | Tests for the join and for the hints that still change nothing |
| `.skilled/bin/README.md` | Modify | What `--surface-hint` does |
| `.skilled/skills/sk-code/README.md` | Modify | What a host may change in `hub-router.json` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modify | Authored twin of the served router. `compiled-route-sync.cjs --check` fails when the two differ, so it takes the same bytes. Added with the operator's approval on 2026-11-16 |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/compiled-route.cjs` | Modify | Authored twin of the served engine, for the same reason |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Authored twin of the served case file, for the same reason |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A hint that names a declared specific surface adds it to a scored route that lacks it | `compiled-route.cjs --hub sk-code --surface-hint FRONTEND --prompt "review this function for bugs"` lists `sk-code-review` first and `sk-code-frontend` before `sk-code-skilled` |
| REQ-002 | A workflow mode the prompt matched stays in the route when a surface matched more phrases | `compiled-route.cjs --hub sk-code --prompt "review the dark mode toggle and focus trap"` lists `sk-code-review` and `sk-code-frontend` |
| REQ-003 | Every case in `canary-cases.v1.json` keeps its route, or its change is listed with a reason in `goal.md` section 4 | The hub's harness run reports no unlisted change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A hint that names the fallback surface, a workflow mode or an unknown name changes nothing | `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `fail 0` with the existing tests unchanged |
| REQ-005 | Two requests that differ only in the hint have different request hashes | A test compares the two hashes |
| REQ-007 | A hinted prompt that scores no mode routes to the hinted specific surface | `compiled-route.cjs --hub sk-code --surface-hint FRONTEND --prompt "add a filter to the table"` returns a route to `sk-code-frontend`, and the same prompt with no hint still defers |
| REQ-006 | The two READMEs say what the hint does and what a host may change | `rg -n 'surface-hint' .skilled/bin/README.md` and `rg -n 'ambiguityDelta' .skilled/skills/sk-code/README.md` each print one line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `scratch/probe-routes.cjs` prints `sk-code-review` and `sk-code-frontend` for `review the dark mode toggle and focus trap`, and `sk-code-frontend` in the targets of the hinted `review this function for bugs`.
- **SC-002**: The second line of the handover's validation checklist holds for a hub surface: a hinted plain request routes to the hinted surface beside what the prompt scored.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The comments in `canary-router.cjs` say its scoring matches a frozen legacy replay, and a parity harness reads the result | A changed score may fail a parity gate that is still enforced. Whether it is enforced is UNKNOWN | T002 finds the gate and its command before any score changes. If it is enforced, stop and ask |
| Risk | A changed surface score moves routes nobody looked at | High. The hub routes every code request | T003 runs both candidates over every case in `canary-cases.v1.json` and lists each changed route before one is chosen |
| Risk | The compiled route is served from a published closure with an activation manifest | Medium. A router change that is not republished fails `compiled-route-guard.cjs` | T009 runs the guard and the sync check, and the plan follows `.skilled/repo-rules/skill-hub-routing.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- May a hint add a target at all? `.skilled/bin/README.md` says today that it only leads a tie. Decided by the operator on 2026-11-16: yes, for a surface the hub declares as specific.
- Should a hinted prompt that scores nothing route to the hinted surface, as the vendoring project's overlay does? Decided by the operator on 2026-11-16: yes, in this packet.
- Which surface score wins: count a surface once however many phrases match, or keep the count and select workflow modes and surfaces in separate windows? T003 decides by measurement. The first is the smaller change and also keeps a host's surface beside a hub surface. Deferred by the operator on 2026-11-16 after T003. Count once fails an existing hint test and one case. Two windows still drops a second surface. REQ-002 stays open, and the numbers are in `scratch/score-candidates.md`.
- Is parity with the legacy replay still a gate? No. T002 found the replay deleted and its harness failing, and no workflow runs it. See `scratch/parity-gate.md`.
- Should the routing model say which surfaces are shared evidence? The vendoring project asked for such a field on 2026-11-16. Its own overlay joins a hinted surface only when the matched surfaces score at a lower weight, because the model lists `sk-code-frontend` under `surfaceDetection.specific` beside a repository surface and carries nothing else that tells them apart. T003 looks at this with the score candidates. A new field needs a caller that fails without it, and upstream has one specific surface today.
<!-- /ANCHOR:questions -->

---


