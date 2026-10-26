---
title: "Feature Specification: Phase 21: ci-gate-regressions"
description: "Two CI gates fail on main after packet 054 landed: changed-packet validation grades 104 benchmark-result packets under a scratch folder and blocks on 81 of them, and the divergence ratchet sees /deep:research :auto prompts route to system-spec-kit. This phase fixes both at the source and clears the in-range P1 and P2 findings from the same audit run."
trigger_phrases:
  - "ci gate regressions"
  - "phase 21 ci gate regressions"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: ci-gate-regressions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-alignment-audit-fixes |
| **Successor** | None |
| **Handoff Criteria** | The changed-packet selection replay grades no `scratch/` packet, the divergence ratchet passes 9 of 9, and `validate.sh` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of packet 054. A local alignment audit run over `ac2be31ec6..HEAD` (6,737 files, 56 commits) ended with a completeness critic. The critic found two CI gates failing on main, X1 changed-packet validation and X2 Routing Registry Drift, plus in-range P1 and P2 findings in files 054 touched.

**Scope Boundary**: the files a finding names, the compiled skill graph its owner's compiler rewrites, the system-spec-kit release note and version, and this phase's own docs. Nothing outside the audit's findings is edited.

**Dependencies**:
- Phase 011 committed the benchmark-result packets under `011-authoring-speed-research/scratch/speed-loop/results/`, which X1 grades.
- Phase 020 added the advisor phrase `draft auto-repair`, which X2 traces to.

**Deliverables**:
- The X1 workflow fix and its two tests, and the X2 advisor phrase fix with the recompiled graph
- The B-01, B-03 to B-05, A-1, X6 and X7 fixes, with the cli-pi briefs in `scratch/briefs/` and runs in `scratch/runs/`
- The `v2.12.2.0` release note for system-spec-kit

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`changed-packet-validation.yml` grades every changed packet, including the benchmark-result copies under `scratch/`, whose `description.json` names a `zz-bench-authoring/...` sandbox, so they fail `METADATA_DISK_PATH_CONSISTENCY` and CI run 40380947180 on `b51a341a07` failed with 81 "New packet does not validate" errors (Measured Behavior below). The divergence ratchet in `routing-registry-drift.yml` failed too, because the system-spec-kit intent signal `draft auto-repair` hands spec-kit the token `auto`, which pulls `/deep:research :auto` prompts away from system-deep-loop.

### Purpose
Both gates pass on the current tree for the right reason, and the audit's in-range P1 and P2 findings are fixed in their owning files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
CI run on b51a341a07 (read with gh, saved log):
$ gh run view 40380947180 --json conclusion,headSha,name
{"conclusion":"failure","headSha":"b51a341a072a1eb47d82b4e80dff26a5964ce4a4","name":"Changed Packet Validation"}
$ grep -c 'New packet does not validate' run.log
82        (81 ##[error] annotations plus the one script line that prints the call)

Selection-loop replay over b51a341a07^2..b51a341a07 (packets graded, packets under scratch/):
old loop: 111 graded, 104 under scratch/
new loop:   7 graded,   0 under scratch/

Divergence ratchet, from system-skill-advisor/runtime, after the fix:
$ npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts
 Test Files  1 passed (1)
      Tests  9 passed (9)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Skip any changed file under a whole `scratch/` path segment in the changed-packet selection loop, and prove it with two tests: a scratch copy is not graded, a packet merely named with "scratch" still is.
- Replace the system-spec-kit intent signal `draft auto-repair` with `spec docs` in both lists of `graph-metadata.json`, and recompile `skill-graph.json`.
- Fix B-01 (authoring card separators and heading), B-03 to B-05 (`decision-record.md` is a lazy add-on), A-1 (ESLint ignores every `dist/`), X6 (dead checklist paths) and X7 (`validate.sh --help` Level 2 line).
- Bump system-spec-kit to `2.12.2.0` with a compact release note, and regenerate the Hermes copy.

### Out of Scope
- A scorer change that ignores `:auto` mode flags - it would let Draft auto-repair prompts route to spec-kit again, but it touches the shared scorer and every hub's ratchet.
- The 244 lint problems left after A-1 - they predate 054 and no CI step runs that lint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/changed-packet-validation.yml` | Modify | Skip `*/scratch/*` in the selection loop (X1) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modify | Two selection tests (X1) |
| `.skilled/skills/system-spec-kit/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | `spec docs` in place of `draft auto-repair`, recompiled graph (X2) |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Section separators, `## 1. OVERVIEW AND BOUNDS` (B-01) |
| `.skilled/skills/system-spec-kit/references/validation/{validation-rules,path-scoped-rules}.md`, `references/templates/level-selection-guide.md` | Modify | Level 3 row names `decision-record.md` a lazy add-on (B-03, B-04, B-05) |
| `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs` | Modify | `**/dist/**` ignore (A-1) |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Real `sk-code-skilled` checklist paths (X6) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | `--help` Level 2 line (X7) |
| `.skilled/skills/system-spec-kit/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md`, `changelog/v2.12.2.0.md` | Modify, Create | Version 2.12.2.0 and its release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The changed-packet selection loop grades no packet under a `scratch/` path segment and still grades a packet whose name contains "scratch": `ci-rule-set-comparison.vitest.ts` prints `Tests 17 passed (17)`, and its scratch-copy test fails against the old workflow |
| REQ-002 | `tests/parity/local-native-divergence-ratchet.vitest.ts` from `system-skill-advisor/runtime` prints `Tests 9 passed (9)`, and `skill-graph-freshness.cjs --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | B-01: `validate_document.py` on the authoring card prints `Total issues: 0`, and `check-card-sync.sh` prints `CARD SYNC OK` |
| REQ-004 | B-03 to B-05, A-1, X6 and X7 are fixed in their owning files, each confirmed by the check its brief or finding names |
| REQ-005 | system-spec-kit is `2.12.2.0` in both `SKILL.md` copies, and `sync-skills-hermes.cjs --check` prints `PASS: 67` |
| REQ-006 | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: Replaying the selection loop over `b51a341a07^2..b51a341a07` grades 7 packets and none under `scratch/`, where the old loop graded 111, 104 of them under `scratch/`.
- **SC-002**: The divergence ratchet prints `Tests 9 passed (9)`, and the live advisor ranks system-deep-loop first for the rr-iter3-149 prompt, "Run /deep:research :auto for the routing hardening packet and stop on convergence."
- **SC-003**: ESLint over `runtime/` reports 244 problems and none in a `dist/` file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The repo convention that scratch is never validated (`path-scoped-rules.md:57`, `validation-rules.md:322`) | If the convention were wrong, the skip would hide real packets | The skip matches the validator's own folder discovery, and only a whole `scratch` path segment matches |
| Risk | The skip lets a broken real packet through | High | A test proves `001-scratch-notes` is still graded and still blocks |
| Risk | Dropping `draft auto-repair` stops prompts that name only Draft auto-repair from reaching spec-kit | Low | Recorded as a known limit; the pre-054 routing had the same behavior |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

- **NFR-R01**: `validate.sh` keeps mode `-rwxr-xr-x`.
- **NFR-R02**: No added line in the tracked diff holds an em dash.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a diff whose only changed packets sit under `scratch/` prints `No spec packets changed by this PR.` and exits 0.
- Maximum input: the b51a341a07 diff, with 104 scratch packets and 7 real ones, grades exactly the 7.
- Failure path: a real packet named `001-scratch-notes` with a new failing rule still prints its `::error` annotation and exits 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 13 tracked files and one new release note, about 75 changed lines, one CI workflow and the advisor graph |
| Risk | 10/25 | A CI gate's selection changes; guarded by a negative test |
| Research | 6/20 | Both causes confirmed by replay and rescoring |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the scorer ignore `:auto` mode flags, so Draft auto-repair prompts can route to spec-kit again? Open for the operator; it is a shared scorer change outside this phase.
<!-- /ANCHOR:questions -->

---
