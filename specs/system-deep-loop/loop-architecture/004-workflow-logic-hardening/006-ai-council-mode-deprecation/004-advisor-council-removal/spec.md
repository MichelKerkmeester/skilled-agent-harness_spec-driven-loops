---
title: "Feature Specification: Phase 4: advisor-council-removal"
description: "The skill advisor still carries the deep council mode in its alias groups, scorer lanes, projection map, tracked commands, Python router, generated bridges, skill graph, fixtures and a parity test. This child removes those entries so a council prompt no longer scores a deep-loop mode, and keeps research and review routing unchanged."
trigger_phrases:
  - "advisor council removal"
  - "phase 4 advisor council removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: advisor-council-removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-runtime-council-removal |
| **Successor** | 005-caller-sweep-and-verification |
| **Handoff Criteria** | Child 005 starts when `npm test` and `npm run typecheck` in the advisor runtime exit 0, the routing registry drift guard exits 0 and the council prompt prints no `ai-council`, `research` or `review` mode row in `skill_advisor.py`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the ai-council mode deprecation, which retires `ai-council` as a `system-deep-loop` mode and keeps the council as a standalone agent.

**Scope Boundary**: `.skilled/skills/system-skill-advisor/runtime/` maps, scorer lanes, command bridges, the Python router, generated files, fixtures, corpora and tests, plus the corpus baseline the routing drift workflow pins. The `/speckit:ai-council` tracked row child 001 added stays.

**Dependencies**:
- Child 003 is Complete, so the registry, the hub router and the runtime agree on two modes.
- Child 001 added `/speckit:ai-council` to the tracked commands, which the bridge generator reads.

**Deliverables**:
- No `deep-ai-council` or `/deep:ai-council` entry in the advisor sources or generated files.
- A council prompt that selects no deep-loop mode in stage one and is offered `/speckit:ai-council`.
- The advisor suite, typecheck and routing registry drift guard green, with any recaptured corpus baseline at unchanged thresholds.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor is stage one of hub routing, and it still maps council words to the `ai-council` mode of `system-deep-loop` through an alias group, explicit lane anchors, a command projection, a tracked `/deep:ai-council` row and the Python router. Sixteen advisor files name the deep council mode. With the hub at two modes those entries point at a mode and a command that no longer exist.

### Purpose
The advisor names no deep council mode, a council prompt reaches neither research nor review in stage one and research and review prompts still route to their modes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command and its verbatim output:

```text
$ rg -c 'deep-ai-council|/deep:ai-council' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json; rg -l 'deep-ai-council|/deep:ai-council' .skilled/skills/system-skill-advisor/runtime -g '!**/node_modules/**' | wc -l
.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:5
.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1
.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:1
.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:2
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4
.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:3
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:15
      16
```

Run from the repository root at `81faa4614c` on 2026-11-14. Seven advisor source and generated files name the deep council mode on 31 lines in all. 16 files under the advisor runtime name it, which adds fixtures, corpora and tests.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the `deep-ai-council` alias group, the council anchors and phrases and the `command-deep-ai-council` projection from the scorer.
- Remove the `/deep:ai-council` tracked row and the council entries in `skill_advisor.py`.
- Delete the council parity test and drop council rows from fixtures and corpora.
- Regenerate the command bridges, the generated block in `command-attach.ts` and the skill graph.
- Recapture the routing corpus baseline at unchanged thresholds when its pins changed, and log each metric delta.

### Out of Scope
- The `/speckit:ai-council` tracked row - child 001 added it and it stays.
- Lowering a routing threshold to make the corpus pass - thresholds stay as they are.
- Advisor changelog files - they record history.
- Callers in other skills, hooks and CI - child 005 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts`, `lanes/explicit.ts`, `projection.ts` | Modify | No deep council alias, anchor or projection |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify/Regenerate | No `/deep:ai-council` row, generated block refreshed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | No council mode in the router, bridges, lexical order or disambiguation text |
| `runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/scripts/skill-graph.json` | Regenerate | No council entry |
| `runtime/tests/routing-parity-deep-council.vitest.ts` | Delete | It tests a removed mode |
| `runtime/tests/` fixtures and `runtime/scripts/routing-accuracy/` corpora | Modify | Council rows dropped, baseline recaptured when pins changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids come from the requirement list this phase had before it was split, so a requirement keeps its id in the child that owns it. Ids from REQ-018 up were added at the split. A new requirement takes the highest REQ id across the five children plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-019 | D6 stage one, the first half of the parent replay: for the prompt "convene an ai council to compare three migration plans", `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5 \| rg '"mode": "(ai-council\|research\|review)"' \| wc -l` prints 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-014 | Advisor: the routing registry drift guard and both deep parity suites pass with two modes, and `cd .skilled/skills/system-skill-advisor/runtime && npm test` and `npm run typecheck` exit 0, with any recaptured baseline recorded in `goal.md` at unchanged thresholds. |
| REQ-020 | `rg -l 'deep-ai-council\|/deep:ai-council' .skilled/skills/system-skill-advisor/runtime -g '!**/node_modules/**' -g '!**/changelog/**'` prints nothing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-006**: The advisor suite, typecheck and routing registry drift guard exit 0 on the final tree of this child.
- **SC-010**: The council prompt prints no deep-loop mode row in `skill_advisor.py`, and one research and one review prompt still print their modes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 003 at Status Complete | The advisor parity suites compare against the registry and the runtime, so they need both at two modes. | The setup task T097 checks the status before any edit. |
| Risk | The advisor corpus baseline pins counts that include council prompts | Med: the drift workflow fails before scoring, as the precedent found | Recapture at unchanged thresholds and record each metric delta in `goal.md`. |
| Risk | A council prompt falls through to research or review once the council alias is gone | High: the hub is offered for planning work it cannot serve | REQ-019 replays the prompt and fails on any deep-loop mode row. |
| Risk | Removing a council phrase shifts a research or review score across a threshold | Med: a kept mode routes differently | Both deep parity suites run with two modes, and one research and one review prompt are replayed. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: entries are removed from lookup maps, and no scoring path is added.

### Security
- **NFR-S01**: N/A: no auth, secret or permission surface changes.

### Reliability
- **NFR-R01**: The routing corpus passes at the same floors as at the start commit, with the baseline and final metrics logged in `goal.md`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `skill_advisor.py` with an empty prompt still prints its usual no-match output.
- Maximum input: all 16 advisor files that name the deep council mode end as edited, regenerated or deleted.
- Failure path: a stale generated bridge file makes the routing registry drift guard exit non-zero, which blocks the close.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 16 advisor files: scorer maps, one Python router, two generated files, fixtures, corpora and one deleted test. |
| Risk | 14/25 | Stage-one routing for every skill reads these maps. Thresholds must not move. |
| Research | 6/20 | The corpus baseline format needs reading before a recapture. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
