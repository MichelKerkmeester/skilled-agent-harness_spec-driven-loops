---
title: "Feature Specification: Phase 9: legacy-lane-overlap-measurement"
description: "The 161 s legacy-lane step in spec-kit-check.yml chains twelve Node and bash harnesses, and nobody has compared their assertions with the 490 s CLI vitest project. Record both name lists and a confirmed overlap count so the operator can decide whether the lane buys coverage the project lacks."
trigger_phrases:
  - "legacy lane overlap measurement"
  - "phase 9 legacy lane overlap measurement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: legacy-lane-overlap-measurement

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 17 |
| **Predecessor** | 008-spec-kit-check-parallel-jobs |
| **Successor** | 010-sk-doc-tests-path-filter |
| **Handoff Criteria** | `scratch/legacy-lane-overlap.md` holds both name lists, one integer `Overlap count:` line and one recommendation line per lane, `scratch/measure-overlap.sh check` prints `overlap=ok`, and `validate.sh --strict --quiet` prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the specification *Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure*.

**Scope Boundary**: One measurement whose artifacts live in this packet's `scratch/` folder. The phase runs the twelve lane commands, reads the CLI vitest project's name list and writes a comparison report. It edits no test, harness, workflow or source file.

**Dependencies**:
- Research section 3 records the 161 s step duration and its commands, in `../007-test-and-ci-bloat-research/research/research.md`.
- `.opencode/skills/system-spec-kit/runtime/cli/package.json` holds the `test:legacy` and `test:validation` scripts that the step runs.
- The CLI package must be built before the lanes run, because the Node harnesses import `dist/`. `test:legacy` starts with `npm run build` for that reason.
- If phase 8 lands first, the step becomes a job of the same name and its commands do not change, so this measurement is unaffected.

**Deliverables**:
- `scratch/lane-commands.txt`: the twelve entry commands, one per line, attributed to `test:legacy` or `test:validation`.
- `scratch/cli-vitest-names.txt`: every test name the CLI vitest project declares.
- `scratch/legacy-lane-names.txt`: every name the twelve lanes report, prefixed with the lane that reported it.
- `scratch/legacy-lane-overlap.md`: both lists in full, the confirmed overlap count, each reviewed candidate pair with both source references, and one recommendation line per lane.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `Legacy module lanes and the bash validation suites` step took 161 s in run 43174399120, and it chains twelve Node and bash harnesses. The `CLI vitest project` step in the same job took 490 s and lists 2,520 test names. Nobody has compared the two, so no one can say whether the 161 s asserts behaviour the CLI project already covers or only behaviour it does not.

### Purpose
Record both name lists and a confirmed overlap count, with one recommendation line per lane, so the operator can decide whether to narrow the lane on evidence instead of guesswork.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ gh run view 43174399120 --json jobs --jq '.jobs[] | select(.name | startswith("Typecheck")) | .name, (.steps[] | select(.name | test("^(CLI vitest project|Legacy module lanes and the bash validation suites)$")) | "  \(.name): \((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)) s")'
Typecheck, import policy and test suites for the spec-kit packages
  CLI vitest project: 490 s
  Legacy module lanes and the bash validation suites: 161 s

$ node -e 'const p=require("./.opencode/skills/system-spec-kit/runtime/cli/package.json"); for (const k of ["test:legacy","test:validation"]) for (const c of p.scripts[k].split("&&").map(s=>s.trim()).filter(c=>/^(node|bash) tests\//.test(c))) console.log(k+"\t"+c)' | wc -l
12

$ ( cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest list --config ../../vitest.config.ts --project cli 2>/dev/null ) | rg -c '^\[cli\] '
2520
```

The first command fixes the 161 s and 490 s figures and the step names. The second counts the entry commands behind the lane. The third counts the names the CLI project declares, collected without running a test. The overlap itself is unmeasured, and this phase measures it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the twelve entry commands behind the lane step from the CLI package's `package.json`.
- Record every test name the CLI vitest project declares, using `vitest list` so no test runs for this list.
- Run each of the twelve lanes once and record every name it reports, attributed to its lane.
- Compare the two lists, read each candidate pair in both source files, and record the confirmed overlap.
- End the report with one `keep` or `narrow` recommendation line per lane, for the operator to act on later.

### Out of Scope
- Deleting, narrowing or editing any test, harness or workflow - the parent spec excludes deleting tests, and this phase measures only.
- Changing `.github/workflows/spec-kit-check.yml` - phase 8 owns that file and its step structure.
- Acting on the recommendation - any narrowing needs its own packet and the operator's approval.
- Re-timing the lane - research section 3 records 161 s, and this phase does not measure wall clock.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/lane-commands.txt` | Create | The twelve entry commands, one per line, each prefixed with `test:legacy` or `test:validation` |
| `scratch/cli-vitest-names.txt` | Create | Every declared CLI vitest test name, one per line |
| `scratch/lane-name-sources.md` | Create | One row per lane naming how that harness reports its test names |
| `scratch/measure-overlap.sh` | Create | `collect`, `report` and `check` subcommands; writes only inside `scratch/` |
| `scratch/legacy-lane-names.txt` | Create | One `<lane>` tab `<name>` line per reported test |
| `scratch/legacy-lane-overlap.md` | Create | Both lists in full, the overlap count, the reviewed pairs and the per-lane recommendation |

### Regression

None. The phase adds no CI step, no test and no source path, so every lane and every CLI test keeps running exactly as it does today. A narrowing adopted from the recommendation would stop catching the lane assertions with no CLI counterpart; the report names those assertions so that cost is visible before anyone acts on it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The twelve entry commands behind the lane step are recorded from the CLI package manifest. | `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-commands.txt` prints `12`. |
| REQ-002 | Every test name the CLI vitest project declares is recorded, collected without running the suite. | `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/cli-vitest-names.txt` prints `2520`. |
| REQ-003 | Each of the twelve lanes contributes at least one name to the lane list. | `awk -F'\t' '{print $1}' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-names.txt \| sort -u \| wc -l` prints `12`. |
| REQ-004 | The report holds both lists in full and one integer `Overlap count:` line. | `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check` prints `lists-match`. |
| REQ-005 | Every candidate pair carries a `same` or `different` verdict with a source reference on both sides. | `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check` prints `review-complete`. |
| REQ-006 | The reported count is reproducible from the recorded lists. | `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check` prints `overlap=ok`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The report ends with one recommendation line per lane. | `rg -c '^Recommendation: ' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md` prints `12`. |
| REQ-008 | The report states its counting basis: the name normalization, the candidate rule, and that only confirmed matches count. | `rg -c '^## 1\. Counting basis$' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md` prints `1`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The CLI name list holds 2,520 lines, one declared test name per line.
- **SC-002**: The lane name list attributes names to all twelve entry commands and no lane is missing.
- **SC-003**: `measure-overlap.sh check` prints `lists-match`, `review-complete` and `overlap=ok`, in that order.
- **SC-004**: The report ends with twelve `Recommendation:` lines, one per lane, each marked `keep` or `narrow`.
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The CLI package build that the Node lanes import `dist/` from | The lanes fail or report stale names | The harness runs `npm run build` once before collecting, as `test:legacy` does |
| Dependency | `vitest list` in the CLI workspace | The CLI list is short or empty | The collection fails loudly when the line count is below 1,000 instead of writing a partial list |
| Risk | The twelve harnesses emit names in five different shapes | Names are missed or attributed to the wrong lane | `scratch/lane-name-sources.md` records each shape, and the harness has one extractor per shape |
| Risk | A name comparison cannot prove behavioural equivalence | A low count hides real overlap | Every candidate pair is read in both files and marked before it counts |
| Risk | The same bare test name exists in two CLI files | A false exact match inflates the count | CLI keys keep file, suite and name, and each exact match is checked at its `file:line` |
| Risk | A lane creates a temporary workspace while it runs | Stray files appear in the packet | The harness captures output only into `scratch/lane-logs/`, and the lanes' own temp folders stay in the OS temp directory |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the 161 s figure change if phase 8 lands first? Decision: no re-measurement. The lane commands do not change, and the report labels 161 s as the pre-split baseline from run 43174399120.
- Should tests that skip at runtime be excluded from the CLI list? Decision: no. The list holds every declared name, and the report states that runtime skipping is not distinguished, so the comparison stays name-based on both sides.
- Should the report's lists stay in the repository? Decision: yes. They are the proof, the packet adds a few thousand lines rather than a new corpus, and phase 17 owns the wider decision about tracking `specs/` artifacts.
<!-- /ANCHOR:questions -->

---
