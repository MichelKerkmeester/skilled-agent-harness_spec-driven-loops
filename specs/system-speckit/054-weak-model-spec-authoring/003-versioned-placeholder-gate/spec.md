---
title: "Feature Specification: Phase 3: versioned-placeholder-gate"
description: "Convert every authoring hint in the core templates to a value token stamped v2.3, and make the validator treat an unfilled token as a warning while the packet is a Draft and as an error afterwards, for v2.3 docs only."
trigger_phrases:
  - "versioned placeholder gate"
  - "phase 3 versioned placeholder gate"
  - "value token lifecycle"
  - "template v2.3 stamp"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: versioned-placeholder-gate

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A fresh Level 2 scaffold holds 97 bracketed hint occurrences and `validate.sh --strict` still prints `RESULT: PASSED` on it, so a weak model can leave every hint in place and pass. This phase turns each hint of the five core templates into a `[YOUR_VALUE_HERE: ...]` token, stamps those templates v2.3, and teaches both validator implementations that an unfilled token is a warning while the spec status is Draft and an error at any other status. A doc without the v2.3 stamp keeps its old verdict exactly.

**Key Decisions**: the existing token is the only grammar, and the template stamp, not a flag, decides which docs the new lifecycle covers.

**Critical Dependencies**: phase 2 closed, because this is the first phase to edit `templates/core`, and the launch preconditions in `../spec.md` section 3.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-template-and-example-defect-repair |
| **Successor** | 004-template-section-fill-guidance |
| **Handoff Criteria** | The failing-first test passes and goes red under each mutation, recursive strict counts over `specs/` match before and after, and the five core templates hold 217 value tokens, the kept texts listed in `tasks.md` T011 and the v2.3 stamp |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Edits land only in the files listed in section 3 under `.skilled/skills/system-spec-kit/`, plus this phase folder and the throwaway track `specs/zz-bench-gate/`, which the smoke test creates and deletes. No other template, example, reference or script changes.

**Dependencies**:
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.
- Phase 2 is closed. It leaves `templates/core` untouched, so this phase starts from the original hints.
- Phase 1 produced `../001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl` and `../001-template-drift-census-and-baseline/scratch/baseline/suite-start.txt`.

**Deliverables**:
- The five templates `core/spec.md.tmpl`, `core/plan.md.tmpl`, `core/tasks.md.tmpl`, `core/implementation-summary.md.tmpl` and `addons/acceptance-criteria.md.tmpl` converted to value tokens and stamped v2.3.
- The lifecycle in the orchestrator function `validatePlaceholders` and in the shell rule `rules/check-placeholders.sh`, built and tested together.
- `runtime/cli/tests/placeholder-token-gate.vitest.ts`, which fails before the change and passes after it.
- Before and after counts of strict validation over every packet under `specs/`.
- Five corrected lines in `references/templates/template-guide.md` and a lifecycle section in `references/validation/validation-rules.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 measured a fresh Level 2 scaffold at 87 distinct hint strings and 97 occurrences, and strict validation passes it. The validator only flags the `[YOUR_VALUE_HERE:` token, and the templates do not use that token for their hints, so nothing tells a weak model, or the validator, that a hint is unfilled. Turning on a blanket error would break every existing packet and every external repo, so the gate has to apply to new docs only.

### Purpose
A packet scaffolded after this phase cannot reach a non-Draft status with an unfilled hint, and no packet written before it changes its verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert every bracketed hint in the five templates to `[YOUR_VALUE_HERE: <hint text>]` with a script, and stamp the templates v2.3.
- Add the lifecycle to the orchestrator and to the shell mirror, with the same observable behavior.
- A failing-first vitest file with a mutation check for each implementation.
- Regenerate the scaffold golden snapshot, because it renders these templates.
- Update the template manifest versions so the version parity test keeps passing.
- Fix the five `[PLACEHOLDER]` lines in `template-guide.md` and describe the lifecycle in `validation-rules.md`.
- A scaffold smoke test in the throwaway track `specs/zz-bench-gate/`.
- Before and after strict validation over every packet under `specs/`.

### Out of Scope
- Any change to a doc without the v2.3 stamp. Decision D-b keeps their verdict fixed.
- The other addon and packet-type templates, including `goal.md.tmpl` and `decision-record.md.tmpl`. They keep their v2.2 stamps and bare hints.
- Per-section fill guidance. Phase 4 owns it.
- `runtime/cli/spec/check-placeholders.sh`, the post-edit scanner. `plan.md` ADR-003 records two defects in it as operator items.
- `repo-era.mjs` and `upgrade-level.sh`. `plan.md` ADR-005 and ADR-006 record their side effects as operator items.
- `README.md` and `assets/template-mapping.md`, which also say `[PLACEHOLDER]`. Phase 7 owns the README alignment.
- Committing or pushing.

### Files to Change

All paths are under `.skilled/skills/system-spec-kit/` unless they start with `specs/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/core/spec.md.tmpl` | Modify | Hints become tokens, 3 stamp lines become v2.3 |
| `templates/core/plan.md.tmpl` | Modify | Same, 1 stamp line |
| `templates/core/tasks.md.tmpl` | Modify | Same, 1 stamp line |
| `templates/core/implementation-summary.md.tmpl` | Modify | Same, 1 stamp line |
| `templates/addons/acceptance-criteria.md.tmpl` | Modify | Same, 1 stamp line |
| `templates/spec-kit-docs.json` | Modify | Five version strings become v2.3 |
| `runtime/lib/validation/orchestrator.ts` | Modify | Replace the `validatePlaceholders` block |
| `runtime/cli/rules/check-placeholders.sh` | Modify | Replace the whole file with the mirrored lifecycle |
| `runtime/cli/tests/placeholder-token-gate.vitest.ts` | Create | Failing-first test with a shell parity check |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Regenerated with `-u` |
| `runtime/cli/tests/level-contract-resolver.vitest.ts` | Modify | One line expects the old manifest version v2.2 for `spec.md.tmpl` and becomes v2.3 |
| `runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | One line spells the plan stamp with v2.2 and becomes v2.3 |
| `references/templates/template-guide.md` | Modify | Five `[PLACEHOLDER]` lines |
| `references/validation/validation-rules.md` | Modify | One lifecycle section |
| `scratch/**` in this phase folder | Create | Tools, census files, logs, review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In the five templates, the count of `[YOUR_VALUE_HERE: ` tokens after conversion equals the count of hints before it, and a fresh Level 2 scaffold has 112 tokens and no bare hint. The 7 stamp lines read v2.3. |
| REQ-002 | For a doc stamped v2.3 or later, an unfilled token is a warning while `spec.md` has the Status Draft and an error at any other status. A `[NEEDS CLARIFICATION:` is an error in both cases. A doc stamped v2.2 keeps the error it had. The orchestrator and the shell rule agree on each case. |
| REQ-003 | `placeholder-token-gate.vitest.ts` fails before the code change with the expected message, passes after it, and goes red under each of three scripted mutations. |
| REQ-004 | Strict validation over the frozen folder list gives identical per-folder results before and after, both for the placeholder rule alone and for all rules. |
| REQ-005 | The spec-kit suite equals the phase 1 `suite-start.txt` except for one more test file and five more passing tests. |
| REQ-006 | No file outside the list in section 3 differs from the phase start commit when the phase closes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `template-guide.md` no longer says `[PLACEHOLDER]`, and `validation-rules.md` describes the lifecycle and the exact scope of each implementation. |
| REQ-008 | The scaffold smoke test shows Draft passes with a warning, Complete fails with an error and a v2.2 stamp still fails, and the throwaway track is deleted afterwards. |
| REQ-009 | A frontier review ran, and each finding is applied or recorded in `goal.md` section 4 with the reason it was not. The five operator items OP-1 to OP-5 are recorded there too. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A DeepSeek worker that scaffolds a packet and leaves a hint in place sees a validator warning at Draft and a failure once it sets a final status.
- **SC-002**: Phase 4 can write fill guidance next to each token without first converting anything, because every hint is already a token.
- **SC-003**: The recursive strict counts over `specs/` are the same before and after, so no existing packet changes verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 closed | This phase would convert templates phase 2 also reads | `tasks.md` T001 checks the phase 2 closure statement |
| Risk | `dist/` or `node_modules` in the build worktree is a link to the main checkout | The test would run the main checkout's old validator and pass or fail for the wrong reason | `tasks.md` T003 prints the real paths and the test's first case asserts them |
| Risk | The golden snapshot test fails after conversion | The suite no longer matches the start | `tasks.md` T013 regenerates the snapshot and checks that only token and stamp lines changed |
| Risk | Two existing tests hard-code the old stamp | `level-contract-resolver` and `upgrade-legacy` fail after the conversion and the suite no longer matches the start | The planning run of the cli project on a scratch copy found exactly these two new failures. `tasks.md` T013 edits one line in each and runs both |
| Risk | The version bump flips every existing packet to `legacy` in the era report | `/doctor:update check` shows the pre-v4 signal in a repo that had none | Measured in this repo as 2374 to 17824 legacy markers. `plan.md` ADR-005 records it as an operator item and the validator verdict does not change |
| Risk | `upgrade-level.sh` copies token text into a doc stamped v2.2 | Such a doc then fails strict validation | `plan.md` ADR-006 records it as an operator item |
| Risk | A conversion script rewrites a placeholder the scaffolder replaces | A scaffold keeps a token it should have filled | The script keeps the five scaffolder placeholders and `tasks.md` T010 checks the exact list of bare hints left |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rule-scoped census over all folders under `specs/` takes about one minute. The all-rules census takes about 40 minutes on three shards. A shard that has not finished in 90 minutes is stopped and rerun once.

### Security
- **NFR-S01**: No brief or script in this phase carries a credential, token or key. The only model call is the read-only frontier review.

### Reliability
- **NFR-R01**: Every number is computed by a command in `tasks.md`, so a second conductor gets the same numbers from the same tree.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a doc with no `Status` row counts as not Draft, so its tokens are errors.
- Maximum length: a stamp is read only from the first 70 lines of a doc.

### Error Scenarios
- External service failure: if the frontier review cannot run, the conductor records the error and leaves REQ-009 open.
- Network timeout: not applicable, no step uses the network except the review.
- Stale build: `validate.sh` refuses to run on a stale `dist/` and exits 3, so a missing rebuild shows as a clear error and not as a wrong verdict.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 14 changed. Systems: templates, validator, shell mirror, tests, two reference docs |
| Risk | 14/25 | Auth: N, API: N, Breaking: Y, a validator verdict could change for existing packets |
| Research | 8/20 | The code paths were read while this spec was written |
| Multi-Agent | 2/15 | No worker dispatch, one conductor and one read-only review |
| Coordination | 8/15 | Dependencies: phase 2 closed, phase 4 builds on the result |
| **Total** | **47/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The conversion changes a placeholder that `create.sh` replaces | H | M | Kept list in the script and the exact leftover list check in `tasks.md` T010 |
| R-002 | The orchestrator and the shell mirror disagree | H | M | One test file asserts both on the same folder, and a mutation of each is checked |
| R-003 | An existing packet changes verdict | H | L | Rule-scoped and all-rules census before and after |
| R-004 | The conductor runs the main checkout's code | M | M | Realpath checks in `tasks.md` T003 and in the first test case |
| R-005 | A weak model mis-pastes a code block | M | M | Each block is written by a heredoc or applied by a script that refuses unless its old text occurs once |

---

## 11. USER STORIES

### US-001: Leftover hints are caught (Priority: P0)

**As a** reviewer of a DeepSeek-authored packet, **I want** a leftover template hint to fail validation once the packet leaves Draft, **so that** an unfinished packet cannot pass as finished.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Old packets stay valid (Priority: P0)

**As the** operator of an external repo, **I want** my existing packets to validate exactly as before, **so that** `/doctor:update` does not turn a green tree red.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1 and in the ADRs in `plan.md`.
- Five operator items are recorded and not fixed here: the era report flip, the two defects in the post-edit scanner, the `upgrade-level.sh` token copy, the `[PLACEHOLDER]` text left in `README.md` and `assets/template-mapping.md` and the phase 2 commit. The conductor writes each one in `goal.md` section 4 and raises it in the closing report.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---

