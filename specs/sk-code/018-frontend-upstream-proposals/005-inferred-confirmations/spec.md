---
title: "Feature Specification: Phase 5: inferred-confirmations"
description: "Four Barter-side defects in Skilled tooling are only partly proven: the leaf-route replay parser, hyphenated aliases, the trigger-index repo root and a zero-scored phase-parent save. This phase opens each with the one read or run that confirms or refutes its inferred part, and fixes only what that read confirms."
trigger_phrases:
  - "inferred confirmations"
  - "phase 5 inferred confirmations"
  - "leaf route replay tuple keywords"
  - "hyphen alias normalization"
  - "trigger index repo root"
  - "phase parent save score"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: inferred-confirmations

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-playbook-scenarios |
| **Successor** | None |
| **Handoff Criteria** | Each of the four ranks has a saved confirming run and a recorded verdict: fixed, or dropped with the evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Frontend upstream proposals from Barter's frontend practice program specification. It covers proposal ranks 10 to 13. Each one starts with a read of the code path the proposals mark INFERRED.

**Scope Boundary**: `leaf-route-replay.cjs`, the sk-code alias matcher (located by T004), `generate-trigger-index.mjs` and `generate-context.ts`, each changed only if its confirming read holds. The four ranks are independent and may run in any order.

**Dependencies**:
- None on earlier phases for ranks 10, 12 and 13. Rank 11 needs a full reach run on every hub, so it runs after phases 001 to 003 have settled the vocabulary.

**Deliverables**:
- Four saved confirming runs in `scratch/`, one per rank.
- A verdict per rank in `decision-record.md`: confirmed and fixed, or refuted and dropped.
- The fixes for confirmed ranks, each with a test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter observed four symptoms whose cause in Skilled was not traced. Stage-two probes could not score `sk-design-fundamentals/ROUTER.md`. A hyphenated repository name ("creators-mobile") missed its mode while the spaced form reached it. The trigger index held no `specs/` paths when run from a project that links Skilled in. A phase-parent save exited 0 but scored the payload 0/100. Fixing any of these without a confirming run risks changing the wrong code.

### Purpose
Each of the four ranks ends with evidence: either the defect is confirmed and fixed with a test, or it is refuted and dropped with the run that refuted it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "extractDictBody(source, 'INTENT_SIGNALS')" .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs
121:  const intents = parseIntentSignals(rootRouter.extractDictBody(source, 'INTENT_SIGNALS'));

$ grep -n "^INTENT_" .skilled/skills/sk-design/sk-design-fundamentals/ROUTER.md
112:INTENT_MODEL = {

$ sed -n 113p .skilled/skills/sk-design/sk-design-fundamentals/ROUTER.md
    "DIAGNOSE": {"keywords": [("looks off", 4), ("looks amateur", 4), ("feels cheap", 4),

$ sed -n 75p .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');

$ sed -n 101p .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
export const DEFAULT_REPO_ROOT = findRepoRoot();

$ rg -n -l "aliases" .skilled/skills/system-skill-advisor/runtime/lib/scorer
.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts
.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts
```
The replay script reads an `INTENT_SIGNALS` dict, and the fundamentals router declares `INTENT_MODEL`. That would explain the "no intent" control result better than the tuple weights the proposals name, but no replay was run, so it stays a lead for T001 to confirm.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rank 10: run `leaf-route-replay.cjs` against `sk-design-fundamentals/ROUTER.md` with a control prompt, and find whether the no-intent result comes from the `INTENT_MODEL` name, the `(phrase, weight)` tuples, or both. Then parse what the router declares, or have the root-router validator reject the grammar the replay cannot read, so both tools read one grammar.
- Rank 11: trace which code picks the sk-code mode from hub-router aliases with a hyphenated prompt. If confirmed, normalise hyphens to spaces on both sides, or have the registry compiler warn when a repository-name alias lacks its hyphenated form, then run reach on every hub.
- Rank 12: run `generate-trigger-index.mjs` from a project that links the Skilled source in, with and without `--repo-root .`, and count `specs/` paths each time. If confirmed, default the root to the caller's working-directory git root, or warn when the two roots differ.
- Rank 13: reproduce a save aimed at a phase parent that scores 0/100. If confirmed, make the save report why a payload scores 0.

### Out of Scope
- Fixing a rank whose confirming run refutes it - it is dropped with the evidence.
- The Barter `creators-mobile` alias itself - Barter-only.
- The deep-research gateway refusal of `lock_released` - Skilled works as designed there (proposals section 4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and its test | Modify, if confirmed | Read the router grammar the fundamentals router uses |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts` or `.skilled/bin/lib/compiled-route-manifest.cjs` | Modify, if confirmed | Hyphen and space treated alike, or a compiler warning |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify, if confirmed | Caller-rooted default, or a root-mismatch warning |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify, if confirmed | Report why a payload scores 0 |
| `decision-record.md` | Create | One verdict per rank |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No rank's code is edited before its confirming run is saved in `scratch/` with command, output and exit status. |
| REQ-002 | `decision-record.md` holds one verdict per rank, confirmed or refuted, each citing its saved run. |
| REQ-003 | Every confirmed rank's fix has a test that fails without the fix and passes with it. |
| REQ-004 | If rank 11 changes alias matching, reach runs on every hub at concurrency 2 and reports `outranked=  0` and `wrong-hub=  0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Rank 10: after the fix, a replay of a fundamentals control prompt resolves an intent. |
| REQ-006 | Rank 12: after the fix, an index generated from a linked project holds that project's `specs/` paths, or the run warns that the roots differ. |
| REQ-007 | Rank 13: after the fix, a zero-scored phase-parent save prints the reason the payload scored 0. |
| REQ-008 | The existing tests of every touched script exit 0 from the final state. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four confirming runs saved, four verdicts recorded.
- **SC-002**: Every fix that shipped has a test that fails when the fix is reverted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A linked project to run rank 12 from | Med | Use a temp directory that links the Skilled source, removed after the run |
| Risk | Hyphen normalisation creates new matches across hubs | High | REQ-004 full reach run, and prefer the compiler warning if reach moves |
| Risk | Changing the trigger-index default breaks callers that rely on it | Med | Inventory callers first; prefer the warning if any caller depends on the current root |
| Risk | Rank 13 cannot be reproduced | Low | Record the attempt and drop the rank |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Trigger-index generation time changes by under 10 percent, measured before and after.
- **NFR-P02**: Alias matching adds no per-prompt network or file read.

### Security
- **NFR-S01**: The rank 12 temp project lives in a scratch directory and is removed after the run.
- **NFR-S02**: N/A otherwise - no credential path is touched.

### Reliability
- **NFR-R01**: Each verdict cites a run that someone else can repeat from the saved command.
- **NFR-R02**: A refuted rank leaves its code unchanged (`git diff --stat` lists none of its files).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a router with no intent block at all still returns "no intent" rather than throwing.
- Maximum input: a prompt with several hyphenated names matches each alias once, not twice.
- Failure path: a save that scores 0 prints its reason and exits with the existing status, not a new one.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Up to four scripts across three skills |
| Risk | 14/25 | Alias normalisation and the trigger-index default change behavior for every caller |
| Research | 14/20 | Four confirming runs, one of them needing a linked project |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Rank 10: is the no-intent result caused by the `INTENT_MODEL` name, the tuples, or both? T001 decides.
- Rank 11: which code picks the sk-code mode from hub-router aliases, the advisor's `aliases.ts` or the compiled route manifest? T004 decides.
<!-- /ANCHOR:questions -->

---
