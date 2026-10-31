---
title: "Feature Specification: Phase 27: alignment-preexisting-gaps"
description: "Three gaps the alignment runs on the phase 25 commit exposed predate phase 25 and were left out of scope in phase 26: the README checkers report hundreds of false failures, the advisor routes packet-local changelog requests to system-spec-kit, and the alignment aggregator crashes on numeric ids and ignores critic verdicts. The operator brought all three into scope, and this phase fixes them."
trigger_phrases:
  - "alignment preexisting gaps"
  - "phase 27 alignment preexisting gaps"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 27: alignment-preexisting-gaps

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
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-alignment-findings-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict` on this phase prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of packet 054. It fixes the three gaps that phase 26 recorded as pre-existing and out of its scope. The operator directed fixing all three.

**Scope Boundary**: the items R1, R2, A1, T1 and T2 in `scratch/items.md`, with the tests and evidence each lane names there.

**Dependencies**:
- The two alignment runs on commit `5b9509576a` in the alignment run output (gitignored), run `20261027T154036Z` with DeepSeek lanes and run `20261027T171418Z` with Opus high lanes.

**Deliverables**:
- README checkers that resolve slash commands and skip prose that makes no count claim, sk-doc winning packet-local changelog requests without stealing spec-kit prompts, and an aggregator that accepts numeric ids and applies critic overrides.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two alignment runs on the phase 25 commit exposed three gaps that predate phase 25. Phase 26 recorded them as out of scope, and the operator has now brought them in. First, `check_readme_references.py` reads an inline slash command such as `/speckit:resume` as a file path and `check_derived_readme_counts.py` reads prose such as "one file" as a count claim, so the root README alone reports 305 unresolved references and 41 failed count claims. Second, the advisor ranks system-spec-kit above sk-doc for packet-local changelog requests, which sk-doc's sk-create-changelog mode is built to refuse and redirect. Third, the operator-local alignment aggregator crashes on numeric finding ids and keeps a finding at its lane severity after the critic overturns it.

### Purpose
The README checkers fail only on real broken paths and wrong counts, sk-doc wins the four packet-local changelog probes while the four spec-kit probes stay on system-spec-kit, and the aggregator applies the critic's verdicts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py README.md
  line 44: inline '/speckit:resume': path does not exist
  line 76: inline 'goal.md': path does not exist
  line 137: command 'skill-advisor.cjs': path does not exist
  line 180: command '/doctor:setup': path does not exist
FAIL README.md: references=418 unresolved=305 examples=0
rc=1
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py README.md
  line 221: numeric count for 'file': Gate 3 requires a spec folder answer before any file modification begins. Only a trivial fix of a few characters in one file is exempt.
FAIL README.md: claims=41 failures=41
rc=1
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Create a changelog entry for this spec folder"}' --format json
  "skillId": "system-spec-kit", "score": 0.867136
  "skillId": "sk-doc", "score": 0.30563, "packetId": "sk-create-changelog"
```
The aggregator crash (`a.id.localeCompare is not a function`) and the overturned findings come from the two run folders named in Phase Context. The aggregator is gitignored, so its evidence lives in the run output, not in git.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix `check_readme_references.py` so a slash command resolves against `.skilled/commands/<group>/<name>.md`, and classify and fix the other false-positive classes at the checker (R1).
- Narrow `check_derived_readme_counts.py` so prose with no count claim passes and a wrong count still fails (R2).
- Add focused tests for each fixed class plus one real broken path and one wrong count, and report before and after counts on the seven READMEs.
- Make sk-doc win the four packet-local changelog probes through its routing vocabulary and graph-metadata, keep the four spec-kit probes on system-spec-kit, and lock all eight in the advisor corpus (A1).
- Coerce numeric finding ids to strings in the aggregator and make it apply a new critic `overrides` array, with both workflow YAMLs and the presentation contract asking for it (T1, T2).

### Out of Scope
- Scorer changes in system-skill-advisor - items.md bars them. If A1 needs one, the lane stops and reports why. **Amended 2026-10-27:** one narrow scorer rule is now in scope, see the scope amendment below. The original text above is kept.
- README content edits - every false positive is fixed at the checker, never by rewording a README. **Amended 2026-10-27:** README lines that the stricter checker exposed as real broken references or shorthand are now in scope, see the scope amendment below. The original text above is kept.

### Scope Amendment (2026-10-27)

> **Amendment (2026-10-27):** The A1 metadata fix alone moved only 2 of the 4 packet-local changelog probes to sk-doc. The operator directed "fix not fixed items" and then "fix all", and the conductor approved one narrow scorer rule: a changelog-from-packet exception in `primaryIntentBonus` (`fusion.ts`) plus two constants in `scoring-constants.ts`. When a verb directly governs a changelog noun phrase and the prompt names a packet, a nested folder or a spec folder, sk-doc gets +0.12 and system-spec-kit gets -0.12. Other skills fall through to the later bonuses, and the corpus-study rule is skipped for these prompts. Separately, the operator's "fix all, perfect it" brought in the README lines the stricter reference checker exposed as real broken references or shorthand: a moved spec path, `checklist.md` changed to `acceptance-criteria.md`, the stale `shared/contracts/` and `evidence-marker-lint.ts` rows, example fences marked, shorthand paths written in full or as bracketed spec-folder placeholders, the false `.opencode/specs` compat-symlink claim removed, and three root README lines reworded so non-paths are not code-formatted. Every checker false positive is still fixed at the checker.

### Scope Amendment: merge with sk-doc/071 (2026-10-27)

> **Amendment (2026-10-27):** While this phase closed, main shipped `specs/sk-doc/071-readme-reference-debt`, an independent rewrite of the same two checkers built on `readme-check` marker blocks and built-in self-tests. The rebase conflicted on both scripts, and the operator chose "Merge both". The merged checkers keep every 071 rule, marker block and self-test, and add this phase's slash-command, bare-name, template and placeholder resolution and its folder-verified count claims. Where the two designs disagree on one input, 071's output format is kept and the stricter correct verdict wins. Three READMEs that name a removed command on purpose gained an `allow-ref` entry with its reason, the root README dropped five `allow-ref` lines that no longer match anything, and READMEs whose prose or counts the merged checkers proved wrong were corrected, each count the checkers cannot prove recorded in an `allow-count` entry with a checked reason. Two fresh Opus high reviews then drove two rounds of checker fixes. Main then shipped a third rewrite, `specs/sk-doc/070-repo-doc-debt/007-alignment-fixes`, which checks every link, inventory row and tree line and fixed README debt across the repository. A fresh Opus high compared the two on both test suites and a full README sweep and recommended adopting main's checkers and porting only what they lacked: slash-command checks, placeholder and shortened-label handling, more count claim shapes and test-file names, and a deleted tracked file failing. That port replaced this branch's merged checkers, a third fresh Opus high review drove one more fix round, and READMEs naming retired commands were reworded as prose. Main also took this branch's planned release numbers more than once, so the entries became spec-kit v2.12.13.0, sk-doc v2.3.24.0, sk-create-readme v1.3.4.0 and advisor v0.17.16.0.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modify | Resolve slash commands against the command tree and fix the other false-positive classes (R1) |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modify | Stop reading count-free prose as a numeric claim (R2) |
| `.skilled/skills/sk-doc/scripts/tests/test_*.py` | Create or Modify | Pin each fixed class and the two still-failing cases |
| sk-doc and sk-create-changelog routing vocabulary and `graph-metadata.json`, plus the outputs their generators compile | Modify | Make sk-doc win packet-local changelog requests (A1) |
| The advisor regression corpus or golden prompts under `.skilled/skills/system-skill-advisor/runtime/tests/` | Modify | Lock the eight A1 probes |
| The alignment command's aggregator (gitignored, operator-local) | Modify (gitignored) | Coerce ids and apply critic overrides (T1, T2) |
| The alignment command's two workflow YAMLs and its presentation contract (gitignored, operator-local) | Modify (gitignored) | Ask the critic for `overrides` and document the contract (T2) |
| The Hermes mirror | Regenerate | Conductor gate |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` and `scoring-constants.ts` | Modify | **Amended 2026-10-27:** the changelog-from-packet rule in `primaryIntentBonus` and its two constants |
| `README.md`, `.skilled/bin/README.md`, `.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-doc/sk-create-frontmatter/README.md` and `.skilled/skills/system-spec-kit/README.md` | Modify | **Amended 2026-10-27:** the real broken references and shorthand the stricter checker exposed |
| `.skilled/skills/cli-external-orchestration/benchmark/README.md`, `.skilled/skills/sk-code/benchmark/README.md` and `specs/sk-doc/z_archive/019-skill-routing-refactor/research/post-019-angles/README.md` | Modify | **Amended 2026-10-27 (merge):** an `allow-ref` entry for a removed command each README names on purpose |
| The other READMEs the merged checkers flagged, listed in `implementation-summary.md` | Modify | **Amended 2026-10-27 (merge):** prose fixes for real defects, and `allow-count` or `allow-ref` entries with checked reasons for correct text no rule can prove |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | R1: `check_readme_references.py` resolves an inline slash command against `.skilled/commands/<group>/<name>.md` and reports it only when that file is missing, every other false-positive class is fixed at the checker, and a real broken path still fails. |
| REQ-002 | A1: the advisor ranks sk-doc first for the four packet-local changelog probes in `scratch/items.md` and system-spec-kit first for the four spec-kit probes, with no scorer change, and all eight are locked in the advisor corpus or golden prompts. **Amended 2026-10-27:** the one scorer rule in the scope amendment is allowed, and no other scorer change. The original text above is kept. |
| REQ-003 | T2: the aggregator applies a critic `overrides` array: a refuted or duplicate finding leaves the counts and is listed under "Overturned by the critic", a pre-existing finding moves to the outside-scope section, and a severity override changes the severity and keeps the note. Both workflow YAMLs ask the critic for `overrides`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | R2: `check_derived_readme_counts.py` passes prose such as "one file" and "a few characters in one file", and a real wrong count still fails. |
| REQ-005 | Lane R tests and report: a test pins each fixed class plus one broken path and one wrong count, in a location `sk-doc-script-tests.yml` runs, and the lane reports before and after counts on the seven READMEs with every residual failure judged real or not. |
| REQ-006 | T1: a lane file with numeric finding ids aggregates without a crash, each id coerced to a string and prefixed with the lane id when bare. |
| REQ-007 | Conductor gates: the sk-doc script tests, the advisor gates listed in `scratch/items.md`, the system-spec-kit CLI suite only if spec-kit code changed, the Hermes sync, strict validation of this phase and a fresh Opus medium review all pass. |
| REQ-008 | Closeout gates: strict recursive validation of packet 054 passes, the change is committed on the worktree branch, the branch is rebased onto main with this branch's release entries renumbered past every version main has shipped, and the trigger index is rebuilt after the rebase. |
| REQ-009 | **Added 2026-10-27 (merge):** the final checkers pass main's tests, their self-tests and this phase's tests, and no tracked README fails under them that passes under main's checkers. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check_readme_references.py README.md` reports far fewer than 305 unresolved references, and each residual is listed and judged real or not.
- **SC-002**: The advisor ranks sk-doc first on the four packet-local changelog probes and system-spec-kit first on the four spec-kit probes.
- **SC-003**: The aggregator rerun on a copy of the DeepSeek run with overrides for CR-1, CR-2 and CR-5 shows D2 outside scope, PRB-01 to PRB-03 and A-2 under "Overturned by the critic", and the counts lower by those findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor generators and compiled-route gates | A1 lands vocabulary that the compiled routes do not pick up | Compile through the normal generators and run every advisor gate in items.md |
| Risk | A1 vocabulary pulls true spec-kit prompts to sk-doc | High | The four spec-kit probes sit in the locked corpus next to the four changelog probes |
| Risk | R1 and R2 loosen the checkers until a real error passes | Med | One test each pins a real broken path and a real wrong count as failing |
| Risk | The gitignored aggregator diverges from the main checkout copy | Low | The conductor syncs the main checkout copy after Lane T and diffs the two |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change edits two checkers, routing metadata and a local aggregator, with no service and no measurable runtime cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README with no references and no count claims passes both checkers, and a critic with no `overrides` array aggregates as before.
- Maximum input: the root README, with 418 references and 41 count claims, runs through both checkers in one call.
- Failure path: a slash command with no command file, a real broken path or a wrong count makes its checker exit 1, and an override naming an unknown id is reported and ignored.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two checkers and their tests, sk-doc routing metadata and the advisor corpus, one aggregator and three workflow files |
| Risk | 8/25 | Routing changes can move other prompts, and checker changes can hide real errors |
| Research | 6/20 | R1 needs a class breakdown of 305 failures, and A1 needs the right vocabulary layer |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. If A1 needs a scorer change, Lane A stops and reports why instead of making it. **Amended 2026-10-27:** Lane A stopped and reported that metadata fixed only 2 of 4 probes, and the conductor approved the one scorer rule in the scope amendment.
<!-- /ANCHOR:questions -->
