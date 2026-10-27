---
title: "Feature Specification: Phase 11: alignment-fixes"
description: "The alignment audit left routing, advisor and documentation faults open: typed doctor targets lost to their defaults, run requests abstained, CI aliases caught git releases and missed cost requests, and several docs lagged the code. This phase fixes each one at its cause."
trigger_phrases:
  - "alignment fixes"
  - "phase 11 alignment fixes"
  - "typed doctor target containing marker"
  - "sk-code ci cost aliases"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: alignment-fixes

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
| **Branch** | `worktrees/234-routing-advisor-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-alignment-audit |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --recursive --strict` on this folder prints `RESULT: PASSED`, and every row of `acceptance-criteria.md` reads Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the quality-agnostic gate packet. It fixes the routing, advisor and sk-code documentation findings the alignment audit recorded.

**Scope Boundary**: The advisor's explicit-command matcher and read-only classifier, the sk-code-ci aliases in the sk-code hub, the router sync verifier header, the sk-code feature catalog, one line of the root README and the missing packet-local changelog for phase 002. Other lanes own the replay library, the advisor plugin, the advisor's `graph-metadata.json`, the review scripts, the document validator, the CI workflows and the quality README.

**Dependencies**:
- Phase 010 recorded the findings and their evidence.

**Deliverables**:
- Code fixes with a test that fails before and passes after, alias changes with probes, the catalog entries, the README line, three component changelogs and the phase 002 changelog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On the advisor's Python path a bare default marker such as `/doctor:ci` matched before its sibling `/doctor:ci toggle`, because the matcher returned the first substring hit. The read-only classifier did not count `run`, `turn off` or `disable` as write verbs, so "run the quality gate and tell me" abstained. The sk-code-ci aliases `release workflow` and `deploy workflow` caught plain git releases, no alias caught a CI cost request, and four docs lagged the code.

### Purpose
Each finding is fixed at its producer and proved by a test or a probe that read the fault before the fix and the fixed behavior after it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -c "import skill_advisor as a; ..." (runtime/scripts)
/doctor:ci toggle -> command-doctor-ci-report [('command-doctor-ci-report', 0.95), ('command-doctor-ci-toggle', 0.95), ...]
/doctor:git standards -> command-doctor-git-setup [('command-doctor-git-setup', 0.95), ('command-doctor-git-standards', 0.95), ...]
/doctor:sk-code quality -> command-doctor-sk-code-setup [('command-doctor-sk-code-setup', 0.95), ('command-doctor-sk-code-quality', 0.88), ...]

$ node run.cjs <worktree> probes.json   (advisor CLI, before the alias change)
fail  P04  want=sk-code/sk-code-ci got=sk-doc 0.82 next=sk-code 0.82
fail  O03  want=sk-git got=sk-code/sk-code-ci 0.82
fail  O05  want=sk-git got=sk-code/sk-code-ci 0.82
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Let a typed command marker replace the current match only when it contains it, in `detect_explicit_command_intent`, with Python and TypeScript tests for the four sibling targets.
- Widen the write verbs of `isReadOnlyExplainer` to run, rerun, execute, enable, disable and turn or switch on or off, with a test and an accuracy baseline before and after.
- Anchor the release and deploy aliases on GitHub Actions and add the CI cost aliases, then regenerate the compiled manifest and the skill graph.
- Add release vocabulary to sk-git so a git release prompt reaches it, and replay each new phrase against unrelated tag and publish phrases.
- Add the module header to `verify-router-sync.cjs`, five feature-catalog entries, the ninth setup leg in the root README and the phase 002 changelog.

### Out of Scope
- The read-only floor for a pure report request such as "report which workflows are enabled and show me" - no write verb is involved, so the classifier is right to hold it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Containing-marker match |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | Modify | Wider write verbs |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Tagged-release anchor |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/tagged-release-intent.vitest.ts` | Create | Anchor cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Sibling target case |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts` | Modify | Sibling target pin |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/read-only-explainer.vitest.ts` | Create | Write-verb cases |
| `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `ROUTER.md` | Modify | sk-code-ci aliases |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived copy | Modify | Regenerated manifest |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled graph |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Module header |
| `.skilled/skills/sk-code/feature-catalog/` | Modify/Create | Root sections and five leaves |
| `README.md` | Modify | Quality leg |
| `.skilled/skills/sk-git/graph-metadata.json`, `SKILL.md`, `changelog/v1.10.1.0.md` | Modify/Create | Release vocabulary and its release record |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-002-builtin-runner.md` | Create | Phase 002 changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `detect_explicit_command_intent` returns the sibling target for `/doctor:ci toggle`, `/doctor:ci scaffold`, `/doctor:git standards` and `/doctor:sk-code quality`, and `analyze_request` ranks it first |
| REQ-002 | `isReadOnlyExplainer` returns false for a prompt that asks to run, turn off or disable something, and the corpus accuracy numbers do not drop |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A git release prompt that names the release workflow no longer routes to `sk-code-ci` and reaches sk-git |
| REQ-004 | A CI cost prompt, in general wording, routes to `sk-code-ci`, the meeting-minutes and cheaper-method phrases do not, and the compiled manifest guard reports fresh |
| REQ-005 | `verify-router-sync.cjs` carries a `MODULE:` header like its siblings |
| REQ-006 | The sk-code feature catalog covers the quality gate, the quality config, `/doctor:sk-code`, `/doctor:ci` and review reach, and its package validator passes |
| REQ-007 | The root README names the quality leg of `/doctor:sk-code setup` |
| REQ-008 | Phase 002 has a packet-local changelog written by the nested generator |
| REQ-009 | A tag-and-publish release prompt reaches sk-git, no new sk-git phrase carries the bare word `release` or catches an unrelated tag request, and sk-git carries a changelog entry |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 runtime/tests/python/test_skill_advisor.py` prints `Summary: pass=87, fail=0`.
- **SC-002**: The advisor vitest parity, golden and scorer suites pass with more tests than the baseline and the same corpus accuracy.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon serves `dist/`, not the TypeScript source | A probe reads the old scorer | Rebuild the runtime before every probe |
| Risk | A new alias catches unrelated work | A request leaves its owner | Replay each alias against an unrelated phrase and record what it catches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The matcher change keeps one pass over the same markers.

### Security
- **NFR-S01**: N/A. No input crosses a trust boundary in these changes.

### Reliability
- **NFR-R01**: The corpus top-1 accuracy holds at 154/195 and the holdout at 49/66.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no slash marker still returns no explicit intent.
- Maximum input: two separate commands in one prompt keep bridge insertion order, so the first bridge that matched wins.
- Failure path: a bare `/doctor:ci` still resolves to the report target.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 20 files across the advisor, the sk-code hub and docs |
| Risk | 8/25 | Routing vocabulary and a scorer rule, both covered by suites |
| Research | 4/20 | The findings carried their evidence |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. O03 reaches sk-git through the tagged-release anchor (`tasks.md` T017).
<!-- /ANCHOR:questions -->

---
