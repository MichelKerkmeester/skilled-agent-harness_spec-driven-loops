---
title: "Feature Specification: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "The advisor's explicit lane counted a bare word once per field that declared it, so a surface that lists browser or css as both a keyword and an intent signal outranked the hub that declares the exact phrase browser agent or css extraction."
trigger_phrases:
  - "advisor phrase calibration"
  - "declared phrase specificity"
  - "explicit lane duplicate author phrase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `245-advisor-phrase-calibration` (worktree) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor's explicit-author lane scores every declared phrase that the prompt mentions, reading a skill's graph-metadata `intent_signals` and its SKILL.md keyword list one after the other with no check for repeats. A surface that declares the bare word `browser` or `css` in both places scores that one word twice (0.7 + 0.7, clamped to 1.0), while the hub that declares the exact phrase `browser agent` or `css extraction` scores 0.88. An outside repository's surface linked into an operator's skills tree has exactly that shape, so typing `browser agent` ranks it above mcp-tooling and `css extraction` ranks it above sk-design. The Python mirror has the same fault: its keyword pass and its graph-signal pass both boost the same word.

### Purpose
An exact multi-word phrase a skill declares outranks a bare word another skill repeats across its fields, in both the TypeScript scorer and the Python mirror. Both sides collapse only single-word repeats; a multi-word phrase declared in both fields keeps both counts, because collapsing those flipped `help me with markdown notes in this repo` from mcp-tooling to sk-doc. In TypeScript a repeated bare word always counts once. In Python it is skipped only when another skill matched an exact multi-word signal holding the word, because the unconditional collapse cost the Python scorer two gold-correct corpus rows (ADR-001).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A scratch probe kept outside the repository loads this worktree's real projection through the built `dist/`, adds one fixture skill shaped like the outside surface (bare words `html`, `css`, `javascript`, `browser` as intent signals, `browser` and `css` as keywords, a front-end description, domains and derived fields), and prints each recommendation's `laneContributions` from `scoreAdvisorPrompt` under the pinned eval regime (empty `SYSTEM_SKILL_ADVISOR_DB_DIR`, built-in semantic off, `VITEST=true`). No operator-local skill is read. The checked-in proof is the fixture test, `tests/scorer/declared-phrase-specificity.vitest.ts`.
```text
$ node probe.mjs real
=== "browser agent" top=fixture-generic-surface
  fixture-generic-surface conf=0.82 unc=0.2 score=0.544667 pass=true
     explicit_author raw=1.000 w=0.420 ev=["author:browser","author:browser"]
     lexical raw=0.333 w=0.093 ev=["token:browser"]
     derived_generated raw=0.150 w=0.018 ev=[]
     semantic_shadow raw=0.267 w=0.013 ev=["shadow:test-fallback"]
  mcp-tooling conf=0.82 unc=0.16 score=0.533608 pass=true
     explicit_author raw=0.880 w=0.370 ev=["author:browser agent"]
     lexical raw=0.333 w=0.093 ev=["token:browser"]
     derived_generated raw=0.478 w=0.057 ev=["derived:browser"]
     semantic_shadow raw=0.267 w=0.013 ev=["shadow:test-fallback"]

=== "css extraction" top=fixture-generic-surface
  fixture-generic-surface conf=0.8444 unc=0.16 score=0.603467 pass=true
     explicit_author raw=1.000 w=0.420 ev=["author:css","author:css"]
  sk-design conf=0.8333 unc=0.16 score=0.582933 pass=true
     explicit_author raw=0.880 w=0.370 ev=["author:css extraction"]
```
With the bare words declared in only one field the same fixture scores explicit 0.700 and both hubs win (`node probe.mjs signals`: mcp-tooling 0.533608 over 0.400667, sk-design 0.582933 over 0.400667). The repeat is the cause, not the bare word.

The Python mirror on a three-skill temp skills root (the same shape the Python fixture test builds):
```text
=== 'css extraction'
  fixture-generic-surface conf=0.78 unc=0.3 pass=False Matched: !css(keyword), !css(signal)
  fixture-design-hub conf=0.69 unc=0.3 pass=False Matched: !css extraction(signal)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count a repeated single-word author phrase once per skill in the TypeScript explicit lane, leaving multi-word repeats as they were.
- Skip a single-word SKILL.md keyword in the Python mirror when it already matched as that skill's graph signal and another skill matched an exact multi-word signal holding it.
- Add a fixture test on each side that fails before the change and passes after it, plus one vitest that runs both scorers on the same fixture skills root.
- Add four guard prompts to the harder corpus the divergence ratchet reads, and recapture the divergence ledger.
- Record the decision and the rejected calibrations in `decision-record.md`.
- Write the system-skill-advisor changelog entry and step its version.

### Out of Scope
- Capping the sum of distinct bare-word hits - measured in ADR-001 and not needed for the confirmed cause.
- Editing any skill's metadata, including the outside surface - the fault is in the scorer, and an outside repository's metadata is not this repository's to change.
- Re-tuning lane weights or confidence floors - they are shared by every prompt and the confirmed cause is narrower.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Count a repeated single-word author phrase once per skill |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Return matched graph signals; skip a repeated one-token keyword that is a word of another skill's matched multi-word signal |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts` | Create | TypeScript fixture tests and the cross-scorer test |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | Modify | Four guard prompts |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Recaptured ledger: one new approved row, scoring instant 2026-10-27 |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Python fixture test |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.15.0.md` | Create | Changelog entry |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Version carrier |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With a fixture skill that declares `browser` and `css` as both keywords and intent signals, the TypeScript scorer's top skill for `browser agent` and `css extraction` is the fixture hub that declares that exact phrase. |
| REQ-002 | The Python mirror ranks the same fixture hubs first for the same two prompts. |
| REQ-003 | No gate regresses against its pre-change baseline: the advisor vitest suite, the Python suite, the parity and divergence ratchets, the routing-accuracy baseline, `doctor-phrase-reach.cjs` and `ci-router-vocabulary-reach.cjs`; and the 320-prompt repeat probe moves no TypeScript top-1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each new test fails on the unchanged scorer and passes on the changed one. |
| REQ-005 | The decision and its alternatives are recorded with measured numbers. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/scorer/declared-phrase-specificity.vitest.ts` passes after the change and fails before it.
- **SC-002**: `capture-scorer-eval-baseline.mjs` prints the same corpus, holdout and ambiguity numbers before and after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The built runtime `dist/` | CLI-based gates read stale scoring until rebuilt | Rebuild with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` before every CLI-based gate |
| Risk | A shipped skill relies on a word declared in two fields scoring twice | Med | Run every accuracy, parity and reach gate before and after; ship nothing that moves a number down |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The collapse adds one tokenize and one set lookup per declared phrase per skill, with no new pass over the prompt.

### Security
- **NFR-S01**: N/A. The change reads the same metadata and writes nothing.

### Reliability
- **NFR-R01**: TypeScript and Python keep the same top-1 on every parity corpus row they agreed on before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no declared phrases scores nothing in the author pass, as before.
- Maximum input: in TypeScript a bare word repeated in every field still counts once; a multi-word phrase counts once per field as before; two different matched words still add.
- Failure path: a bare word that differs only by case or surrounding space is the same word and counts once. In Python a repeat with no rival multi-word signal, and any multi-word repeat, keeps its second boost, as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two scorer files, two test files, one changelog |
| Risk | 12/25 | Shared routing scorer; every accuracy gate re-run |
| Research | 10/20 | Cause confirmed by lane breakdown before the change |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None that block. ADR-001 records why distinct bare words still add.
<!-- /ANCHOR:questions -->

---
