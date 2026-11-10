---
title: "Feature Specification: Phase 10: decision-routing-vocabulary"
description: "A request such as \"record this as a decision\" routes to no skill today. The native advisor returns an empty recommendation list, because system-spec-kit's routing metadata names no decision vocabulary. This phase adds four decision phrases to its intent signals and a DECISION intent to its ROUTER.md, so the request reaches the skill that owns the save step."
trigger_phrases:
  - "decision routing vocabulary"
  - "phase 10 decision routing vocabulary"
  - "record this as a decision routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: decision-routing-vocabulary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-chat-answer-evidence |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance criterion is Met, the six native probes meet REQ-003 and REQ-004 on a live index, and the freshness panel reports no signal drift. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the decision-capture series. It acts on gap 1 in `../research/research.md` §3, as corrected by the §13 addendum, and on findings P2-1 to P2-4 in `../research/synthesis-review.md`.

**Scope Boundary**: system-spec-kit's `graph-metadata.json` `intent_signals`, its `ROUTER.md` (the §2 bullets and the machine `INTENT_SIGNALS` and `RESOURCE_MAP` dicts), the generated Hermes copy of that router, and the compiled advisor artifacts (`skill-graph.json` and the SQLite index). No advisor code, no scorer change, no regression-corpus row and no trigger-index rebuild. The parent goal admits this surface through its D1 amendment of 2026-11-03 (`../goal.md`, D1).

**Dependencies**:
- `../research/research.md` §3 and §13. Where they disagree, §13 wins.
- `../research/synthesis-review.md` P2-1 to P2-4.
- 008-project-scoped-state ships first. Routing more decision requests to the save step before 008 lands would lead users into the shared-state bug (`../research/research.md` §6).
- Precedent: packet 031 added `environment variables` to the same metadata file (`specs/system-skill-advisor/routing-and-scoring/004-routing-and-launcher-hardening/implementation-summary.md:81`).

**Deliverables**:
- Four new intent signals on system-spec-kit.
- A DECISION intent in `ROUTER.md`, in the human bullets and in both machine dicts.
- A re-exported graph, a rebuilt SQLite index and six native probes at their targets.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator who types "record this as a decision" or "Record my chat reply as a decision" gets no skill recommendation, so the session never loads the save workflow that writes operator decisions. system-spec-kit's 31 intent signals name no decision, answer or decision record. The trigger index returns zero rows for both prompts as well.

### Purpose
A decision request routes to system-spec-kit at confidence 0.8 or higher, and the prompts that route to sk-design or sk-git today keep their routes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run read-only on 2026-11-03 against advisor generation 2138, which reported `freshness: stale` (reason `advisor-server-watcher-reindex`). The `jq` filter only projects fields of the full response.

```text
$ jq '.intent_signals | length' .skilled/skills/system-spec-kit/graph-metadata.json
31
$ F='{freshness:.data.freshness,generation:.data.trustState.generation,recommendations:[.data.recommendations[]|{skillId,confidence,uncertainty}]}'
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Record my chat reply as a decision"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"record this as a decision"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"decision tree"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[{"skillId":"sk-design","confidence":0.82,"uncertainty":0.16}]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"colour decision"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[{"skillId":"sk-design","confidence":0.8461,"uncertainty":0.16}]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"decision branch"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[{"skillId":"sk-git","confidence":0.9365,"uncertainty":0.12},{"skillId":"sk-design","confidence":0.8416,"uncertainty":0.16}]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"architecture decision"}' --format json | jq -c "$F"
{"freshness":"stale","generation":2138,"recommendations":[{"skillId":"sk-design","confidence":0.82,"uncertainty":0.3}]}
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "Record my chat reply as a decision" | jq -c '.results'; echo "exit=${pipestatus[1]}"
[]
exit=1
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "record this as a decision" | jq -c '.results'; echo "exit=${pipestatus[1]}"
[]
exit=1
$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict | rg 'STALE COMPILED|SIGNAL DRIFT'; echo "exit=${pipestatus[1]}"
  STALE COMPILED: none (generated_at 2026-11-02T17:16:24.537300+00:00, newest source stamp 2026-10-26T00:00:00Z)
  SIGNAL DRIFT compiled vs disk: none
exit=0
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check system-spec-kit | rg 'C7|C8|C9|^Result'
C7  PASS    Router equivalence: Parsed 21 intent signal groups and 21 resource-map entries.
C8  INFO    Advisor home: Skill graph validates and its compiled view is fresh. Advisor queries completed; the skill appeared in 3 of 3 result(s).
C9  PASS    Runtime mirrors: Runtime mirror status: Claude:pass, OpenCode:pass, Pi:pass, Devin:pass, Hermes:pass, Codex:n/a, Cursor:n/a.
Result: PASS
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --skill system-spec-kit | rg '^FAIL|^PASS|^RESULT'
FAIL system-spec-kit              declared= 39 wrong-hub=  0 outranked=  0 no-reach=  0 allowed=  0 probe-error= 39 operator-local=  0
RESULT: FAILED
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check | tail -3
PASS: 65 Hermes skill copies in sync
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh | tail -1
CARD SYNC OK
```

The reach check could not judge any phrase, because every probe met a stale advisor and the check refuses a degraded answer. T002 rebuilds the index and records a live control before any edit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add four intent signals to system-spec-kit's `graph-metadata.json`: "as a decision", "decision record", "operator decision" and "record my answer".
- Add a DECISION intent to `ROUTER.md` §2 and to its machine `INTENT_SIGNALS` and `RESOURCE_MAP`, loading `references/memory/save-workflow.md` and `references/validation/decision-format.md`.
- Regenerate the Hermes copy of the router, re-export `skill-graph.json` and rebuild the SQLite index with `advisor_rebuild`.
- Prove the route on the native advisor for the two decision prompts, and prove the four collision prompts keep their routes.

### Out of Scope
- A bare `decision` signal or keyword - it fires on every prompt that mentions a decision, and sk-design already owns that word (`../research/research.md` §8).
- Advisor code, including a `PHRASE_INTENT_BOOSTERS` entry - a metadata signal is the smaller change, and packet 031 used it.
- New rows in the advisor regression corpus - research §13 places that corpus with the Python fallback scorer, and D1's amendment admits only routing metadata and compiled artifacts.
- A `trigger_phrases` entry for a decision-record doc and the trigger-index rebuild it needs - see Open Questions.
- Fixing other router phrases the reach check reports - they are outside this child's four phrases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modify | Add the four intent signals |
| `.skilled/skills/system-spec-kit/ROUTER.md` | Modify | Add DECISION to §2, `INTENT_SIGNALS` and `RESOURCE_MAP` |
| `.hermes/skills/system-spec-kit/ROUTER.md` | Regenerate | `sync-skills-hermes.cjs` output |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | `skill_graph_compiler.py --export-json` output |
| `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` | Rebuild | `advisor_rebuild` output, gitignored |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | system-spec-kit's `intent_signals` holds the four phrases "as a decision", "decision record", "operator decision" and "record my answer", holds no bare "decision", and counts 35. |
| REQ-002 | `ROUTER.md` declares DECISION in the §2 bullets, in `INTENT_SIGNALS` with the same four phrases, and in `RESOURCE_MAP` with `references/memory/save-workflow.md` and `references/validation/decision-format.md`. `sk-skill-check.cjs check system-spec-kit` reports C7 with 22 intent signal groups and 22 resource-map entries, and `Result: PASS`. |
| REQ-003 | After the graph export and `advisor_rebuild`, `advisor_recommend` for "Record my chat reply as a decision" and for "record this as a decision" each lists `system-spec-kit` first, at confidence 0.8 or higher and uncertainty 0.35 or lower, with `freshness` `live`. |
| REQ-004 | On the same live index, "decision tree", "colour decision", "decision branch" and "architecture decision" each return the same ordered skill list as the live pre-change control recorded in T002. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `skill-graph-freshness.cjs --strict` exits 0 and prints `STALE COMPILED: none` and `SIGNAL DRIFT compiled vs disk: none`. |
| REQ-006 | `sync-skills-hermes.cjs --check` prints `PASS`, and `sk-skill-check.cjs check system-spec-kit` reports C9 PASS. |
| REQ-007 | On a live advisor, `ci-router-vocabulary-reach.cjs --skill system-spec-kit` prints no wrong-hub, outranked or probe-error row for any of the four new phrases. |
| REQ-008 | The router's other readers still pass: `check-card-sync.sh` prints `CARD SYNC OK` and `generate-leaf-manifest.cjs --check .skilled/skills/system-spec-kit` prints `leaf-manifest.json OK`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two decision prompts that return `"recommendations":[]` in Measured Behavior return `system-spec-kit` first at confidence 0.8 or higher on a live index.
- **SC-002**: The four collision prompts return the same skill list as the live control, and `validate.sh` on this folder prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A live advisor index | The probes and the reach check cannot prove anything on a stale index, as Measured Behavior shows | T002 runs `advisor_rebuild` first and records a live control, so a route change from the rebuild alone is not blamed on this child |
| Risk | The graph export reads every skill's `graph-metadata.json` in the working tree | Med: uncommitted edits to other skills would ride into `skill-graph.json` | Before export, `git status --short .skilled/skills/*/graph-metadata.json` must list only system-spec-kit. A diff of the export against HEAD must change only system-spec-kit's entry |
| Risk | A new phrase pulls prompts away from sk-design or sk-git | Med: a design or git request would load the save workflow | No bare `decision`. REQ-004 compares four collision prompts against the live control |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the change adds four strings to metadata and one entry to each router dict. No code path changes.

### Security
- **NFR-S01**: N/A: no credential, no path handling and no code. The change is routing text only.

### Reliability
- **NFR-R01**: A revert restores routing completely once the export and `advisor_rebuild` run again. No user data and no persisted format changes.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt that says only "decision" gains no new signal, because REQ-001 adds no single-word phrase.
- Maximum input: a long prompt with "architecture decision record" holds "decision record" and may now route to system-spec-kit. That is intended, because `decision-record.md` is a spec-kit file. T012 records the probe result.
- Failure path: if `advisor_status` still reports `stale` after `advisor_rebuild`, the probes cannot meet REQ-003, and the worker stops and reports the status payload.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two source files and about 15 lines, plus one mirror and two compiled artifacts |
| Risk | 6/25 | Routing shifts for every prompt holding the four phrases. Four collision probes guard it |
| Research | 2/20 | Done in `../research/research.md` §3 and §13 |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a decision-record doc gain a `trigger_phrases` entry so the trigger index finds it? Decision (planning, recommended): no. Once the advisor routes, the DECISION intent already loads both docs. Regenerating the committed index rebuilds it from every doc's frontmatter in the working tree, so unrelated uncommitted frontmatter would ride into this child's diff. D1's amendment also admits routing metadata, not reference-doc frontmatter. The lookup's exit 1 on the two prompts stays expected. Revisit only if a live session routes to system-spec-kit and still misses the Operator Decisions section of `save-workflow.md`.
- Does D1's amendment cover the generated Hermes copy of `ROUTER.md`? Decision (planning): yes, because the copy is generated from `ROUTER.md`, and the C9 mirror row fails without it. The operator may overrule.
<!-- /ANCHOR:questions -->

---
