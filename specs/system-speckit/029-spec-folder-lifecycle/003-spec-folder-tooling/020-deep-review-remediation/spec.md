---
title: "Feature Specification: Phase 20: deep-review-remediation"
description: "Remediate the eleven findings of the deep review of phases 016 to 019, the two open search-debt items, the Hermes mirror byte diff and the phase 010 status."
trigger_phrases:
  - "deep review remediation"
  - "phase 20 deep review remediation"
  - "spec folder tooling deep review findings"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-epic-follow-up-fixes |
| **Successor** | `034/021`, a follow-up phase not yet created, holds the items moved out of this phase |
| **Handoff Criteria** | Every acceptance row Met, `validate.sh --strict` PASSED on this folder, on 019 and on the 034 parent, and the CLI suite at or above the 019 baseline of 1776 passed with 0 failed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the spec-folder tooling packet. The deep review in `review/review-report.md` ran ten iterations and returned CONDITIONAL, with 0 P0, 9 P1 and 2 P2 findings after deduplication. This phase remediates those eleven findings. The review's section 3 holds the evidence for each one, and each requirement below names its finding id.

**Scope Boundary**: The eleven findings, the two open search-debt rows the operator asked to handle, the Hermes mirror byte diff, the phase 010 status, and the parent and phase 019 evidence rows. Items the review noted but did not ask for stay out (see Out of Scope).

**Dependencies**:
- Phases 016 to 019 are committed. Phase 019 reached `main` at `079e9c34d2`, and its post-push CI is recorded in `019-epic-follow-up-fixes/scratch/evidence/post-push-ci.txt`.
- The review inspected the tests but never ran them (review section 8), so the CLI suite and the doctor suites must run before this phase closes.

**Deliverables**:
- One red-then-green regression test or stated verification per requirement, recorded in `acceptance-criteria.md`.
- The parent and phase 019 records corrected to match what was verified.

**Changelog**:
- The 034 parent now has a `changelog/` folder. It holds generated entries for phases 010, 017, 018 and 019. No entry exists for 016, whose generated file was deleted (implementation summary, Known Limitations item 17), or for 020. The operator asked to finalize all open ends, and `nested-changelog.js` writes each entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review of phases 016 to 019 found three default paths that check a name, then follow a symlink at the step that writes, reads or moves a file: the default healer, the leaf walker and the archive destination. The trigger-index workflow keeps a write credential on checkout while it runs dependency install scripts, and its retry path ignores a failed generator. Phrase cleanup can rewrite an authored eight-token trigger phrase. The parent's handoff table still reads TBD for two transitions, phase 019 is marked Complete with a CI criterion it never checked, and the child-dispatch exception that the root instructions define is missing from the routed Gate 3 contracts.

### Purpose
Close each finding with evidence that would have failed before the fix. Record the verified state in the parent and in phase 019 so that no packet document claims more than its evidence shows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The eight work lanes in `plan.md` section 3: archive.sh, the healer and its shared target helper, the leaf walker, the CI workflows, phrase cleanup provenance, the upgrade-legacy symlink audit, the Gate 3 child docs with the repo-era catalog, and this packet's doc lane.
- The open search debt the operator asked to handle: upgrade apply symlink containment (REQ-009) and workflow command log injection (REQ-007).
- The Hermes mirror byte diff (REQ-011) and the phase 010 status (REQ-015).

### Out of Scope
- The other open search-debt rows in review section 9: SL-007 (edge cases of individual lane transforms), SL-007-009 (spec-code traceability) and SL-007-010 (checklist evidence). The review notes that iterations 8 to 10 partly covered the last two. They stay open here.
- The DOC-381 manual run in phase 019, which needs a v3 fixture repository.
- The three deep-loop stress-test category READMEs that fail the document validator (phase 019, Known Limitations item 5).
- The root `AGENTS.md`, which already carries the child-dispatch exception.
- Closing phase 010 itself. REQ-015 settles only its status record.

### Files to Change

Each lane lists its files. The review's line numbers are a starting point only, and each lane re-reads its file before editing.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Lane A: confine the archive root below `specs` before copy or source removal |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Lane B: reject or confine symlinked documents on the default `--apply` path, and extract the shared target helper |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Lane B (helper reuse) and Lane F (apply and move containment) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Lane C: canonicalize and confine each start scope before `readdirSync` |
| `.github/workflows/trigger-index-rebuild.yml` | Modify | Lane D: `persist-credentials: false`, the write token only at the push step, and a retry that fails on a nonzero generator. **Amended 2026-10-10:** the in-step retry was removed by the operator's "Restructure now" decision of the same date, and the exit-checked regenerate step is the equivalent check (see the REQ-006 amendment). |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | Lane E: trim only phrases with generated provenance |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Lane G: add the child-dispatch branch to the Gate 3 section |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modify or regenerate | Lane G: the same branch, produced by the sync route the lane confirms |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Lane G: the child-dispatch branch in the Gate 3 ask-and-wait step |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md` | Modify | Lane G: the no-roots case returns unknown |
| `specs/system-speckit/034-spec-folder-tooling/spec.md` | Modify | Lane H: handoff rows, phase rows and status |
| `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/` | Modify | Lane H: SC-002 recorded as met, with its evidence file |
| `specs/system-speckit/034-spec-folder-tooling/020-deep-review-remediation/` | Create | This packet's documents and `scratch/evidence/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Each requirement names the review finding it closes, the finding class from the review, and the lane that owns it. The class decides the proof: a `class-of-bug` needs a producer inventory and adversarial cases, not one instance.

### P0 - Blockers (MUST complete)

| ID | Finding | Class | Lane | Requirement |
|----|---------|-------|------|-------------|
| REQ-001 | R2-P1-003 | instance-only | A | The archive destination is canonicalized and confined below `specs` before any copy, rename or source removal |
| REQ-002 | R2-P1-001 | class-of-bug | B | The default healer `--apply` path never writes through a symlinked packet document |
| REQ-004 | R2-P1-002 | class-of-bug | C | The leaf walker canonicalizes and confines each default and declared start scope before reading it |
| REQ-005 | R2-P1-004 | cross-consumer | D | The trigger-index workflow disables persisted checkout credentials, and the write token reaches only the push step |
| REQ-006 | R8-P1-001 | instance-only | D | A nonzero retry generation fails the job, and the four outputs are checked for content and freshness, not existence. **Amended 2026-10-10:** the operator's "Restructure now" decision of the same date removed the in-step retry. The exit-checked regenerate step, which runs under `set -euo pipefail` and fails the job before any commit when the generator exits nonzero, is the equivalent check. The verify step then regenerates into a scratch directory and compares the four outputs for content and freshness. The original text above is kept. |
| REQ-008 | R5-P1-001 | class-of-bug | E | Phrase cleanup rewrites only phrases with generated provenance, and an authored eight-token trigger stays byte-identical under `--apply` |
| REQ-010 | R7-P1-001 | cross-consumer | G | SKILL.md, its Hermes mirror and `speckit-implement.yaml` each state the child-dispatch pre-resolution of Gate 3 |
| REQ-013 | R3-P1-001 | matrix/evidence | H | The parent's handoff rows 017 to 018, 018 to 019 and 019 to 020 carry real criteria and the verification that closed them |
| REQ-014 | R3-P1-002 | matrix/evidence | H | Phase 019 SC-002, the post-push CI on `main`, is recorded as met with its receipt |
| REQ-016 | Review section 8 | matrix/evidence | H | The CLI suite and the doctor suites run and pass, and `validate.sh --strict` prints RESULT: PASSED on 020, 019 and the 034 parent |

### P1 - Required (complete OR user-approved deferral)

| ID | Finding | Class | Lane | Requirement |
|----|---------|-------|------|-------------|
| REQ-007 | SL-006-010 (search debt) | class-of-bug | D | The report producer is traced. If packet-controlled newlines can reach Actions workflow-command parsing, they are escaped, and if not, the trace is recorded as the proof |
| REQ-009 | SL-SEC-008 (search debt) | class-of-bug | F | Each apply and move path in `upgrade-legacy.mjs` refuses a symlink that leaves `specs`, with a red-then-green case |
| REQ-011 | Review section 8 (deferred) | matrix/evidence | G | The full byte diff of canonical SKILL.md against the Hermes copy is recorded, and each hunk is either fixed by REQ-010 or kept with a reason |
| REQ-015 | Parent phase 010 row | matrix/evidence | H | Phase 010's status matches its own record: its tasks T009 and T011 are closed, or the parent row stays In Progress with the open reason |

### P2 - Advisories (do not block)

| ID | Finding | Class | Lane | Requirement |
|----|---------|-------|------|-------------|
| REQ-003 | R4-P2-001 | instance-only | B | The three healer CLI entrypoints resolve `--folder`, `--roots` and the default root through one shared helper, with a parity test |
| REQ-012 | R7-P2-001 | instance-only | G | The repo-era catalog states that a repository with neither root reads as unknown, which matches the classifier |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every row in `acceptance-criteria.md` is Met, and each code row names a red run captured before its fix and a green run after it.
- **SC-002**: `validate.sh --strict` prints RESULT: PASSED on this folder, on phase 019 and on the 034 parent at closeout.
- **SC-003**: The CLI suite and the doctor suites finish with no failure beyond the 019 baseline (1776 passed, 19 skipped, 0 failed for the CLI suite).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Seven code lanes edit one shared working tree | A lane edits only its own files, and the doc lane reads each lane's evidence before it marks a row Met | Lane H marks no row Met on another lane's claim alone |
| Risk | The review ran no tests, so a fix may pass for the wrong reason | Each code row needs a red run on the unfixed code | REQ-016 runs every suite from the final state |
| Risk | The Hermes copy and the canonical SKILL.md differ beyond REQ-010 | An edit to one can silently drop the other's text | REQ-011 adjudicates each hunk before REQ-010 changes either file |
| Dependency | `actionlint` is not installed on this machine | The workflow lint named in phase 010 cannot run | REQ-015 names the install as the operator's yes, under the blast-radius rule |
| Risk | Workflow changes can only be proven on a push | A green local parse does not prove the job runs | The parse test is the stated verification, and the first push's CI is recorded as a receipt |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The CLI suite runtime changes by no more than noise from the 019 baseline.

### Security
- **NFR-S01**: No secret appears in any changed file, and the workflow token reaches only the step that pushes.

### Reliability
- **NFR-R01**: No test run leaves a folder under the real `specs/` root, as established in phase 019.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A symlink that points inside `specs` is allowed. Only a target that leaves the root is refused.
- **Amended 2026-10-10 (Code prevails):** the operator decided that the code is the reference for this rule. The healer, repair-derived and archive tools refuse a link at each point where they check for one, so an in-specs link is refused there. The upgrade-legacy tool and the leaf walker still allow a link that stays inside their own packet or skill. The original bullet above is kept. The healer case for an in-specs link (matrix row B-03) is MISSING.
- **Amended 2026-10-10 (B-03 case):** the healer case for an in-specs link now exists. The case "default healer --apply refuses a symlinked spec.md whose target sits inside the same packet" in runtime/cli/tests/heal-symlink-containment.vitest.ts asserts the refusal, and mutant gB-b03 fails it (`scratch/evidence/closure-guard-final-gB.txt`). The sentence above that says the case is MISSING is kept as the record of the earlier state.
- A dangling symlink is refused before any write, because its target cannot be confined.
- A packet title with an embedded newline is escaped before it reaches any annotation (REQ-007).

### Error Scenarios
- A retry generator that exits nonzero after writing a partial sidecar fails the job, and the stale sidecar is not committed (REQ-006). **Amended 2026-10-10:** the in-step retry was removed by the operator's "Restructure now" decision, and the exit-checked regenerate step is the equivalent check (see the REQ-006 amendment).
- A declared leaf scope that resolves outside the skill is refused, and the default roots are checked the same way (REQ-004).

### State Transitions
- A phrase trimmed by an earlier `--apply` run is not restored, and an authored phrase that matches the same shape is left alone (REQ-008).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Eight lanes over about 12 files, two of them outside the runtime CLI |
| Risk | 15/25 | Path containment on four write paths, and a CI credential |
| Research | 8/20 | One search-debt trace (REQ-007) and one byte diff (REQ-011) |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered by REQ-011: `sync-skills-hermes.cjs` generates the Hermes SKILL.md copy. The copy adds a generated header and rewrites relative links, and the byte diff holds only those hunks. The sync check reports 70 copies in sync.
- Answered by REQ-015: `actionlint` is installed (Homebrew, 1.7.12), phase 010 closes T009 and T011, and no decision record is needed.
- Answered by the operator's instruction to finalize all open ends: the 034 parent has a `changelog/` folder, and its generated entries cover phases 010, 017, 018 and 019. Entries for phases 016 and 020 are not written. The 016 entry was deleted, see the implementation summary's Known Limitations item 17.
<!-- /ANCHOR:questions -->
