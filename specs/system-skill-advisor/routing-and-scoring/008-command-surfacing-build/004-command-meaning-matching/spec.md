---
title: "Feature Specification: Phase 4: command-meaning-matching"
description: "A plain-chat paraphrase that shares no words with a slash command reaches nothing, so holdout plain reach is 0 of 44. This phase gives each command a vector and lets a close meaning match anchor the command."
trigger_phrases:
  - "command meaning matching"
  - "phase 4 command meaning matching"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: command-meaning-matching

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-plain-chat-command-reach |
| **Successor** | 005-recommendation-contract-and-brief |
| **Handoff Criteria** | Holdout plain reach above 0 of 44, at least 5 of 44, with false offers at 0 of 35 and typed recall at least 24 of 44, measured with the real embedding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`).

**Scope Boundary**: A vector per command, a meaning anchor that lets a close match pass the command phrase gate, and a capture that measures it with the real embedding. Skill vectors, the semantic lane weight and the command policies stay as they are.

**Dependencies**:
- Phase 003 shipped the attach rule, the authored phrases and `requireCommandPhraseAnchor` (`ADV/lib/scorer/fusion.ts:847`).
- The embedder, its active pointer, the `vec_<dim>` table and `refreshSkillEmbeddings` from the skill graph (`ADV/lib/skill-graph/skill-graph-db.ts:1211`). Packet `../../001-semantic-lane-enablement` owns them and is still Draft.
- A local Ollama with `nomic-embed-text`, the default in `ADV/lib/embedders/schema.ts`.

**Deliverables**:
- One vector per tracked command, built and refreshed by the existing embedding refresh.
- A meaning anchor in the command phrase gate, with a threshold and a margin tuned on tune rows only.
- A real-embedding mode for `capture-command-routing-baseline.mjs` and the measured result.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 made a plain prompt reach its command when the prompt reuses the command's own words. A paraphrase that shares no words with the command still reaches nothing, so holdout plain reach is 0 of 44 and the doctor family reaches 0 of 17 on both splits. The scorer has a meaning lane, but commands have no vectors in it, and `requireCommandPhraseAnchor` drops any command row that the `explicit_author` lane did not anchor.

### Purpose
A plain prompt that means what a command does reaches that command on at least 5 of 44 holdout rows, with no new false offer and no loss of typed recall. The target of 5 is about half the tune rate of 9 of 45, because holdout rows are paraphrases the tuning never sees.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
`ADV` is `.skilled/skills/system-skill-advisor/runtime`. Every command ran from `ADV` on 2026-11-12. The first one was re-run after phase 003 removed the `persona file` alias and re-captured the baseline.

```text
$ jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .attachedMetrics.plain_by_family.doctor, .metrics.false_offer' scripts/routing-accuracy/command-routing-baseline.json
{"correct":24,"total":44}
{"tune":{"own":2,"attached":7,"combined":9,"total":45},"holdout":{"own":0,"attached":0,"combined":0,"total":44}}
{"tune":{"own":0,"attached":0,"combined":0,"total":17},"holdout":{"own":0,"attached":0,"combined":0,"total":17}}
{"count":0,"total":35}

$ rg -n "process.env.VITEST = 'true'" scripts/routing-accuracy/
scripts/routing-accuracy/capture-command-routing-baseline.mjs:286:    process.env.VITEST = 'true';
scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:61:    process.env.VITEST = 'true';
scripts/routing-accuracy/derive-ambiguity-slice.mjs:54:    process.env.VITEST = 'true';
scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:77:    process.env.VITEST = 'true';

$ rg -n "semantic_shadow" lib/scorer/lane-registry.ts
13:  { id: 'semantic_shadow', defaultWeight: 0.05, defaultShadowWeight: 0.05, live: true },

$ node <phase 003 scratch>/hook-latency.mjs   # Claude hook, top-only route lookup, 44 tune prompts
{"n":44,"medianMs":235.04,"p95Ms":318.96,"minMs":185.04,"maxMs":1017.54,"nonZeroExits":0,"emptyOutputs":0}
```

The second block shows why no capture measures meaning today. Under `VITEST` the semantic lane swaps the embedding for a word-overlap stand-in (`ADV/lib/scorer/lanes/semantic-shadow.ts:111` and `:254`), and the capture also points the database at an empty folder (`capture-command-routing-baseline.mjs:273-279`).

Four more facts from the code shape the plan. Each was read on 2026-11-12.
- The semantic lane already asks for a vector for every scored row, command rows included (`semantic-shadow.ts:293` calls `loadSkillEmbeddings` with every `projection.skills` id). A command row with a stored vector is scored with no lane change.
- 45 command rows are scored, 35 of them doctor routes (`routingEnabled: true` in `ADV/lib/scorer/projection.ts`). The other 17 are hub rows that are not scored. Of the 44 holdout rows, 27 name a command with a scored row and 17 name a hub-only command, counted from `expected_command` alone. Meaning matching can reach the 27. The 17 still depend on phase 003's attach rule.
- `requireCommandPhraseAnchor` only demotes (`fusion.ts:847-861`). It never makes a row pass. With the lane weight at 0.05, a command that matches on meaning alone does not reach the confidence threshold, so the meaning anchor has to set the row passing.
- The vector table is `skill_id TEXT PRIMARY KEY REFERENCES skill_nodes(id) ON DELETE CASCADE` (`ADV/lib/embedders/schema.ts:120-121`), and the database turns foreign keys on (`skill-graph-db.ts:492`). Command ids are not in `skill_nodes`, so inserting a command row into that table fails.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build one vector per tracked command from its own text: the metadata `description`, `userIntent.job` and `userIntent.ownedSignals` with the slash string removed. A doctor route uses its command file `description` and its `_routes.yaml` `trigger_phrases`.
- Store and refresh those vectors through `refreshSkillEmbeddings`, keyed by the scored command row id, with the same content hash and outage streak. They live in a sibling table `vec_cmd_<dim>`, read by the same loader (ADR-001).
- Let a command row pass when its cosine is at or above a threshold τ and beats every other command row by a margin m, inside `requireCommandPhraseAnchor`, with its confidence raised to the threshold. A hub command attaches through its owner when the owner is the top recommendation, as phase 003 does.
- Add a real-embedding mode to `capture-command-routing-baseline.mjs` that keeps the real embedding and a scanned database, and exits 2 when either is missing.
- Tune τ and m on tune rows only, and record the measured result.

### Out of Scope
- A new embedder, a new database or a committed vector file. The skill graph already embeds, stores and refreshes vectors, and the sibling table sits in the same database.
- Changing the `vec_<dim>` skill table. Packet 001 owns it, and it needs no migration.
- Changing skill vectors, the `semantic_shadow` lane weight or the weight sweep in `001-semantic-lane-enablement`. That packet owns them.
- Resolving a hub's mode by meaning. Hub routing keeps its compiled router.
- Embedding inside the hook. The handler already embeds the prompt at `ADV/handlers/advisor-recommend.ts:590`.
- A new public output field, and any change to a command's policy or `readOnly` rule. Phase 005 owns the contract.
- A reranker model. No failure today needs one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `command-bridges.generated.json` | Modify | Emit the embedding text per command and per doctor route |
| `ADV/lib/skill-graph/skill-graph-db.ts`, `ADV/lib/embedders/schema.ts` | Modify | Create `vec_cmd_<dim>`, then refresh and load command vectors from it |
| `ADV/lib/scorer/fusion.ts` | Modify | Let a meaning match pass in `requireCommandPhraseAnchor` |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modify | Real-embedding mode with exit 2 when the embedder or vectors are absent |
| `ADV/tests/command-meaning-anchor.vitest.ts` | Create | Anchor, margin, degrade and policy-unchanged cases with injected vectors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After a skill graph scan with Ollama running, `loadSkillEmbeddings` returns one vector for each of the 45 scored command rows, keyed by the row id. A second scan with no text change re-embeds nothing. |
| REQ-002 | A command row passes `requireCommandPhraseAnchor` when its real cosine is at or above τ and beats every other command row by at least m. The test with injected vectors covers a pass, a fail under τ and a fail inside the margin. |
| REQ-003 | `capture-command-routing-baseline.mjs` in real-embedding mode prints holdout combined plain reach of at least 5 of 44, false offers 0 of 35 and typed recall at least 24 of 44. |
| REQ-004 | With the embedder or the database absent, every corpus recommendation equals today's. The default capture prints the same metrics as the committed baseline. |
| REQ-005 | `node ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` still prints `[159,50,20,5]` through the phase 003 jq projection. |
| REQ-006 | τ and m are chosen from tune rows only. The tuning script filters to `split == "tune"` before it reads any prompt text. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The Claude hook over the 44 tune prompts stays within median +25 ms and p95 +40 ms of a same-session baseline, each the middle of three runs. |
| REQ-008 | Policies and `readOnly` are unchanged. `derive-command-bridges.cjs --check` prints `fresh`, the policy rollup stays 17 ask, 7 run, 20 start, and a meaning anchor never sets `readOnlyRouteAllowed`. |
| REQ-009 | Tune combined plain reach stays at or above 9 of 45. `npm test` in `ADV` reports 0 failed. |
| REQ-010 | A command that passed on meaning ranks first only when its cosine beats the top passing skill's by m, and otherwise keeps its score position. The test with injected vectors covers both cases and a doctor row. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The real-embedding capture prints holdout combined plain reach of at least 5 of 44 with false offers at 0 of 35.
- **SC-002**: The default capture and `capture-scorer-eval-baseline.mjs` print the same numbers as before the change.
- **SC-003**: The hook timing stays inside the REQ-007 budget.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Ollama with `nomic-embed-text` on the build machine | No real vectors and no real-embedding capture | The capture exits 2 and names the missing piece. The default path degrades to today's result |
| Dependency | `001-semantic-lane-enablement`, still Draft | A weight change there shifts every semantic score | Reuse its storage and refresh only. Re-run the real-embedding capture when that packet changes the lane weight |
| Risk | Command phrasings are short, so a vague prompt sits close to several commands | High: a false offer starts a workflow nobody asked for | The margin m and the 35 must-not-start rows. A false offer above 0 blocks the phase |
| Risk | The must-not-start rows sit in split `none`, so tuning on tune rows never sees them | Med: τ tuned too low passes tune and fails the false-offer check | Run the false-offer check on every candidate τ, and pick the highest τ that holds 0 of 35 |
| Risk | Real embeddings do not run in CI | Med: the committed ratchets cannot guard the new gain | Keep the default capture as the CI ratchet. Record the real-embedding output in the packet as evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Hook median within +25 ms and p95 within +40 ms of a same-session baseline. The prompt is already embedded once per call, so the new cost is one cosine per command row. The budget is about 10 percent of the measured 235 ms median.
- **NFR-P02**: A full scan embeds each command once. A rescan with unchanged text embeds nothing.

### Security
- **NFR-S01**: The scorer opens the database read-only, as `getDbReadOnly` already does. Only the scan writes vectors.
- **NFR-S02**: Embedding text comes from tracked repository files only. The private `/local-skilled-alignment` command gets no vector.

### Reliability
- **NFR-R01**: An absent embedder, an absent database or a dimension mismatch yields today's recommendations, never an error.
- **NFR-R02**: A missing command vector leaves that command on phrase anchoring only.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt gets no embedding, so no meaning anchor fires and the result equals today's.
- Maximum input: the prompt is embedded once whatever its length, and the cosine pass covers the 45 scored command rows, 35 of them doctor routes.
- Failure path: with Ollama down, the real-embedding capture exits 2 with a message naming the embedder, and the scorer falls back with `disabledReason`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | About 6 files and 700 lines across the deriver, the skill graph, the scorer and the capture |
| Risk | 15/25 | A false offer starts a workflow. The database gains rows |
| Research | 12/20 | τ and m need a tuning sweep, and the overlap with packet 001 needs checking |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

The operator accepted all four recommendations on 2026-11-12 ("Accept all four (Recommended)"). `plan.md` records each one as an ADR.

- Where do command vectors live? Decision: in the existing vector table, keyed by the command row id (ADR-001).
- How does the meaning anchor work? Decision: a threshold τ and a margin m in the phrase-anchor check. The semantic lane weight is not raised (ADR-002).
- Do doctor routes get vectors? Decision: yes. If doctor rows cause a false offer, they lose their vectors (ADR-003).
- What is the hook budget? Decision: +25 ms median and +40 ms p95 over today's 235 ms and 319 ms (ADR-004).

The code then showed two more gaps, and the operator answered both on 2026-11-12.

- Where do command vectors live, given that `vec_<dim>` has a foreign key to `skill_nodes(id)` with foreign keys on (`ADV/lib/embedders/schema.ts:121`, `skill-graph-db.ts:492`)? Decision: "Sibling table (Recommended)". A sibling table with the same columns and no foreign key, read by the same loader. The skill table stays untouched (ADR-001, amended).
- Where does a command that passes on meaning rank? Decision: "First, on a clear margin (Recommended)". It ranks first only when its meaning score beats the top skill's by the margin m. Otherwise it keeps its score position (ADR-005).

The holdout target stays at least 5 of 44 with false offers at 0 of 35.

### Open

None.
<!-- /ANCHOR:questions -->

---
