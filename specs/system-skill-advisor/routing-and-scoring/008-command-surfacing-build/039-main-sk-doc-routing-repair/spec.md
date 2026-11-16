---
title: "Feature Specification: Phase 39: main-sk-doc-routing-repair"
description: "Merging origin/main brought sk-doc README trigger phrases that pull bare git, mirror and other prompts away from their owners, so seven advisor tests fail on the branch and on main alike. This phase narrows those phrases so README requests still reach their templates, and recompiles the skill graph."
trigger_phrases:
  - "main sk doc routing repair"
  - "phase 39 main sk doc routing repair"
  - "hook readme phrases git hooks"
  - "skill graph signal drift sk-doc"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 39: main-sk-doc-routing-repair

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 39 of 39 |
| **Predecessor** | 038-alignment-p1-remediation |
| **Successor** | None |
| **Handoff Criteria** | The seven inherited advisor tests pass, the suite reports 0 failed both ways, and the compiled skill graph matches the sk-doc metadata |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 39** of the command surfacing build. Merging origin/main as `e91faf28b8c` brought seven failing advisor tests. Each fails the same way on a clean origin/main `2005499d504`, and the branch suite was 2347 passed 0 failed before the merge. The operator chose, through the ask tool on 2026-11-16, to fix the regression on this branch, to recompile the skill graph here and to add `TEMP` and `TMP` to the operator-local surface map, which is done.

**Scope Boundary**: the README intents main added to `sk-doc/ROUTER.md` and `sk-doc/sk-create-readme/ROUTER.md`, the `intent_signals_generated` list derived from them, the compiled `skill-graph.json` and the sk-doc route manifest the commit hook re-mints. No advisor scorer, threshold, corpus row, baseline or ledger change.

**Dependencies**:
- Main's commits `fad83abd791` (root guide and skill README intents), `f6f242c1392` (hook, plugin and runtime folder README intents) and `3dc90eb8e01` (named hook README phrases)
- The merged HEAD's gate evidence in the session scratchpad, `after-merge-final.txt`

**Deliverables**:
- Narrowed README intents, regenerated intent signals, a recompiled skill graph and the gate evidence
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Main's README intents gave sk-doc words that other skills own. The named hook phrases, such as `git-hooks-check hook readme`, give sk-doc the words `git` and `hooks`, so "git hooks", "git rules" and "git standards" route nowhere. `hook mirror readme` and `runtime folder readme` give it `runtime` and `mirror`, so "runtime mirror drift" tops sk-doc instead of `/doctor:runtime-mirrors`. One ratchet row's native top moved from mcp-tooling to sk-doc, and the independent holdout fell to 48 of 63 against a baseline of 49. Main also changed the sk-doc metadata without recompiling the skill graph, so the strict freshness check reports signal drift.

### Purpose
README requests keep reaching their templates, the prompts that routed before main's change route as they did, and the compiled graph matches its sources.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ npx vitest run      (advisor runtime, merged HEAD e91faf28b8c, and clean origin/main 2005499d504)
Tests  7 failed | 2342 passed | 8 skipped
FAIL doctor-bridge-isolation > git hooks / git standards / git rules / git hooks broken
FAIL doctor-routing-slice: doctor-a-10 "runtime mirror drift" top=sk-doc, doctor-control-11/12/14 top=null
FAIL local-native-divergence-ratchet: rr-iter3-069 nativeTop ledger=mcp-tooling current=sk-doc
FAIL holdout-independent: live=48/63 baseline=49

$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict
SIGNAL DRIFT compiled vs disk: sk-doc        (exit 1, on HEAD and on origin/main)

bisect on origin/main: green before fad83abd791; fad83abd791 fails the holdout; 3dc90eb8e01 adds the isolation, slice and ratchet failures
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Narrow the named hook README phrases so none brings a bare `git` or `hooks` word to sk-doc, while a request for a named hook's README still tops sk-doc
- Narrow the runtime and mirror README phrases the same way
- Find, by row id and expected skill only, which new intent moved the holdout row and the ratchet row, and narrow it
- Regenerate `intent_signals_generated`, recompile `skill-graph.json` and let the commit hook re-mint the sk-doc manifest
- Record each step in the goal log

### Out of Scope
- Any advisor scorer, weight or threshold change
- Re-capturing a baseline or re-approving a ledger row to absorb a regression
- Any other change main made
- Reading holdout prompt text (D6)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/ROUTER.md` | Modify | Narrow the README intent keywords |
| `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md` | Modify | The same where the mode router repeats them |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modify | Regenerated intent signals |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled graph |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor suite reports 0 failed with `AI_SESSION_CHILD` unset and set to 1, and `FLOOR` prints 24/44, 0/35 and 2/44 |
| REQ-002 | "git hooks", "git rules", "git standards" and "git hooks broken" route to sk-git, and "runtime mirror drift" tops `command-doctor-runtime-mirrors`, with no test or baseline edited |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A request for a named hook's README, such as "README for the session-handover hook", and one for a runtime folder's README still top sk-doc |
| REQ-004 | The holdout returns to 49 of 63 or more and `rr-iter3-069` returns to its ledger top, both by narrowing a phrase main added |
| REQ-005 | `skill-graph-freshness.cjs --strict` exits 0 and `generate-router-intent-signals.cjs --check` passes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: the seven tests that fail on the merged HEAD pass, and no other test changes state
- **SC-002**: `EVAL` prints `[160,49,21,5]` or better and the stored sets stay unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A narrower phrase stops a named hook README request reaching sk-doc | Medium | REQ-003 checks named hook and runtime folder README prompts through the advisor CLI |
| Risk | The edit conflicts with main's README-template work at the next merge | Medium | The change is limited to keyword lists, and the merge commit names it |
| Risk | Finding the holdout row tempts tuning on it | Medium | Only the row id and expected skill are read, and only main's own new phrases are narrowed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Fewer keywords, so scoring does no more work

### Security
- **NFR-S01**: No holdout or command prompt text is read or printed
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: Earlier phases' committed evidence stays unchanged

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README request that names no hook still reaches the general readme intent
- Maximum input: a request naming a git hook by its full folder name still reaches sk-doc
- Failure path: a bare `git hooks` request with no README word goes to sk-git
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Keyword lists and two generated files |
| Risk | 9/25 | Routing for README requests and for git prompts |
| Research | 6/20 | Bisect done, the holdout row still to find |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
