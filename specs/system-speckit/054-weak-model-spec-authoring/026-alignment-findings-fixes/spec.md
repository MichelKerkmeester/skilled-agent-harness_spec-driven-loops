---
title: "Feature Specification: Phase 26: alignment-findings-fixes"
description: "Two alignment runs on the phase 25 commit found 2 P1s and about 15 P2s: the deprecated generator still creates new packet changelogs, system-spec-kit SKILL.md is over its word cap, and several docs, tests and workflows still read as if nested changelogs were live. This phase fixes all 18 recorded items."
trigger_phrases:
  - "alignment findings fixes"
  - "phase 26 alignment findings fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 26: alignment-findings-fixes

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
| **Phase** | 26 of 26 |
| **Predecessor** | 025-deprecate-nested-changelogs |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of packet 054. It closes the findings two runs of the operator-local alignment command raised against the phase 25 commit `5b9509576a`.

**Scope Boundary**: the 18 items F1 to F18 in `scratch/items.md`. The three out-of-scope findings recorded there stay open.

**Dependencies**:
- Phase 25 as committed at `5b9509576a`, and the two alignment reports in the alignment run output (gitignored), runs `20261027T154036Z` and `20261027T171418Z`.

**Deliverables**:
- The generator refuses to create a packet changelog, system-spec-kit `SKILL.md` fits its word cap, and every doc, test and workflow the reports named matches the phase 25 contract.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two alignment runs on the phase 25 commit found 2 P1s and about 15 P2s. The P1s: `nested-changelog.ts --write` still creates a new packet changelog when none exists, while seven docs say it only re-renders existing files, and system-spec-kit `SKILL.md` is 5021 words against the 5000 cap the sk-doc package validator enforces. The P2s are stale wording, a stale line pointer, a missing test, a deprecated page loaded on every `/speckit:complete`, and a dead workflow variable.

### Purpose
The phase 25 deprecation holds in code, tests and docs, and both validators that flagged it pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py .skilled/skills/system-spec-kit
    ❌ SKILL.md exceeds word limit (5021 words, max: 5000)
rc=1
$ rg -n "nested-changelog.ts:" .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts
79:    file: 'runtime/cli/spec-folder/nested-changelog.ts:589',
$ rg -n "function ensureApprovedSpecFolder|mkdirSync|writeFileSync" .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts
601:function ensureApprovedSpecFolder(specFolderPath: string): string {
819:  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
820:  fs.writeFileSync(absoluteOutputPath, generateNestedChangelogMarkdown(data), 'utf8');
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `nested-changelog.ts --write` refuse a packet with no changelog, mark the module deprecated, fix the registry pointer and pin the phase scaffold in a test (F1 to F4).
- Cut system-spec-kit `SKILL.md` under 5000 words and align its router, level-change notes, catalog, playbook, `--write` wording and unreleased changelog entry (F5 to F11).
- Align sk-create-changelog, its worked examples and playbook, the create-changelog workflows and two versioned sk-doc entries with the global-only contract (F12 to F16).
- Rebuild the trigger index, sync the Hermes mirror, and rerun the hub check, the CLI suite, strict validation and the S1 to S4 battery (F17, F18).

### Out of Scope
- The S5 README checkers reading slash commands such as `/create:changelog` as missing file paths - pre-existing, and the checker is sk-doc's.
- The advisor ranking system-spec-kit first for "packet-local changelog" requests - pre-existing, and no skill graph-metadata changed.
- The operator-local alignment command's aggregator crashing on numeric finding ids and keeping overturned findings at their severity - tooling, not this contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` and `runtime/cli/tests/nested-changelog.vitest.ts` | Modify | Refuse `--write` with no existing file, `@deprecated` tags, refusal test (F1, F2) |
| `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts` | Modify | Point at the real `ensureApprovedSpecFolder` line (F3) |
| An existing system-spec-kit phase-scaffold vitest | Modify | Assert no `**Changelog**:` line in a new phase child (F4) |
| system-spec-kit `SKILL.md`, `references/workflows/{nested-changelog,quick-reference}.md`, `references/templates/template-guide.md`, `assets/template-mapping.md` | Modify | Word cap, router intent, level-change notes, `--write` wording (F5, F6, F7, F10) |
| system-spec-kit `feature-catalog/feature-catalog.md`, `manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md`, `changelog/v2.12.13.0.md` | Modify | Catalog root entry, playbook step 7, unreleased entry (F8, F9, F11) |
| `.skilled/skills/sk-doc/sk-create-changelog/{SKILL.md,references/worked-examples.md,changelog/v1.3.6.0.md}` and its `choose-four-part-bump.md` playbook | Modify | Voice, NEVER rule, refusal branch, routing claim, stale trigger, nested output (F12, F13, F14, F16) |
| `.skilled/commands/create/assets/create-changelog-{auto,confirm}.yaml` | Modify | Drop `changelog_mode` and unwrap its guards (F15) |
| `.skilled/skills/sk-doc/changelog/v2.3.24.0.md` | Modify | Soften the routing claim (F16) |
| The generated trigger index and the Hermes mirror | Regenerate | Conductor gates (F17, F18) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F1: `nested-changelog.js --write` on a packet with no changelog throws an Error that says spec folders no longer get changelogs and names `/create:changelog`, and writes nothing. The existing write test seeds its target first, and a new test pins the refusal. |
| REQ-002 | F5: `validate_skill_package.py .skilled/skills/system-spec-kit` reports no word-limit error, with `SKILL.md` at 4990 words or fewer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | F2, F3: the generator module header and exported `main` carry `@deprecated` naming `/create:changelog`, and every `nested-changelog.ts:` line pointer in `spec-root-registry.ts` names the line it describes. |
| REQ-004 | F4: an existing phase-scaffold test asserts a `create.sh --phase` child has no `**Changelog**:` line. |
| REQ-005 | F6: the RESOURCE_MAP lists `references/workflows/nested-changelog.md` under no COMPLETE intent and under at least one other intent. |
| REQ-006 | F7: the six level-change notes point at `implementation-summary.md` or a spec.md change-log section, and none at `/create:changelog`. |
| REQ-007 | F8, F9: `validate_catalog_package.py --package system-spec-kit` reports no `root_leaf_description_mismatch`, and the resume playbook step 7 mirrors the catalog leaf wording. |
| REQ-008 | F10, F12: every doc that describes `--write` says it re-renders an existing packet changelog and refuses a packet with none, and sk-create-changelog `SKILL.md` has one voice, no conflicting NEVER rule, a refusal branch in its router and no guaranteed-routing claim. |
| REQ-009 | F11, F16: `changelog/v2.12.13.0.md` covers F1 and the doc fixes in its own voice, and `sk-doc/changelog/v2.3.24.0.md` and `sk-create-changelog/changelog/v1.3.6.0.md` make no guaranteed-routing claim. |
| REQ-010 | F13, F14: `worked-examples.md` no longer carries `packet local changelog example`, and `choose-four-part-bump.md` assumes global output only. |
| REQ-011 | F15: `rg -n "changelog_mode" .skilled/commands/create/assets/` prints nothing and both YAMLs parse. |
| REQ-012 | F17, F18: the trigger index `--check` passes, the Hermes mirror and hub check are clean, the CLI suite shows no new failure against the 025 baseline, strict recursive validation of 054 passes, and S1 to S4 rerun clean. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `nested-changelog.vitest.ts` passes with the new refusal test, which fails when the existence check is removed.
- **SC-002**: `validate_skill_package.py` on system-spec-kit and `validate_catalog_package.py --package system-spec-kit` report neither flagged error.
- **SC-003**: The CLI suite prints at least 2241 passed and no failure against the 025 baseline of 2241 passed and 20 skipped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Line numbers recorded at `5b9509576a` | A lane edits the wrong line | Each lane re-reads the file before editing, and F3 is set after F1 and F2 land |
| Risk | Cutting `SKILL.md` drops a rule a model needs | Med | Cut repeated or deprecated wording first, starting at lines 102 and 105, and read the diff |
| Risk | Lane 2 and Lane 3 both touch changelog wording | Low | Each lane owns disjoint files, and the conductor sweeps with `rg` after both land |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change adds one existence check and edits docs, with no measurable runtime cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `--write` on a packet with no `changelog/` folder throws and creates no folder or file.
- Maximum input: `--write` on a phase parent whose changelog exists re-renders it as before.
- Failure path: the refusal is a thrown Error whose message names `/create:changelog`, and the CLI exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 22 files across one generator, its tests, two workflows and docs in two skills |
| Risk | 6/25 | One new refusal in a deprecated path; the rest is wording |
| Research | 2/20 | Every item is located and confirmed by the two reports |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The three out-of-scope findings are recorded in section 3 and stay open.
<!-- /ANCHOR:questions -->
