---
title: "Feature Specification: Phase 5: integration"
description: "A skill that passes the format gate can still be unreachable: the advisor has not scanned it, the compiled skill graph is stale, the Hermes mirror lacks it and no changelog link exists, and no script writes the changelog link. This phase adds integration rows I1 to I6 to convert and an opt-in --skill flag to the router reach script."
trigger_phrases:
  - "phase 5 integration"
  - "convert advisor hermes changelog integration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: integration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-convert-plain-skill |
| **Successor** | 006-convert-plumbing |
| **Handoff Criteria** | In a temp repo, Hermes `--check` PASS, freshness `--strict` exit 0 and the changelog link resolves; fleet reach output is byte-identical with and without the change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: Step V9, the integration rows I1 to I6 of design section 3, plus an opt-in `--skill <id>` on `ci-router-vocabulary-reach.cjs`. The convert YAML and advisor bridge activation for the command itself are phase 006.

**Dependencies**:
- Phase 004: convert ends with V8 passing; integration never runs after a failed V8.
- `skill-advisor.cjs skill_graph_scan --trusted`, `skill_graph_compiler.py --export-json`, `skill-graph-freshness.cjs --strict`, `sync-skills-hermes.cjs`, `skill_advisor_regression.py`.

**Deliverables**:
- V9 in `sk-skill-convert.cjs`, one plan line per row I1 to I6
- `--skill <id>` on `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`, default fleet output unchanged
- Temp-repo integration tests

**Delivered as**: `lib/sk-skill-integrate.cjs`, one exported function per row plus the plan and apply entry
points, because the plain-skill phase owns the convert script and its test file in parallel. `sk-skill-convert.cjs`
plans the rows beside the conversion and applies them only after both format validators pass.
`implementation-summary.md` records the deviation and its evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor reads only direct children of `.skilled/skills` holding `graph-metadata.json` (`projection.ts:1536-1556`), the compiled `skill-graph.json` is CI-gated for freshness (`routing-registry-drift.yml:241-246`), Hermes holds generated skill copies by frontmatter name (`sync-skills-hermes.cjs:150-152`), and the changelog index is a set of relative links that no script writes. The reach script probes hubs only (`ci-router-vocabulary-reach.cjs:107-114`), so a standalone root has no reach report.

### Purpose
After V8, convert scans the skill into the advisor, refreshes the compiled graph, syncs Hermes, proposes regression rows, creates the changelog file and link, and reports the skill's reach, each as its own named plan line.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -c -- "'--skill'" .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
0

$ ls -la .skilled/changelog/sk-git
lrwxr-xr-x@ 1 michelkerkmeester  staff  26 30 Oct 06:20 .skilled/changelog/sk-git -> ../skills/sk-git/changelog
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- I1 advisor discovery: run `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted`; print `/doctor:skill-advisor rebuild` as the fallback, never run it unasked (parent D5).
- I2 compiled skill graph: run `skill_graph_compiler.py --export-json` (`skill-graph-freshness.cjs:195`), named in the plan as a tracked-file write.
- I3 reach and budget: `advisor_recommend --warm-only` on three approved phrases with the rank reported, plus the budget row; add opt-in `--skill <id>` to the reach script.
- I4 regression corpus: print proposed case rows; append to `skill-advisor-regression-cases.jsonl` only for a framework skill in this repository, and for an adopter skill write them to the skill's own `benchmark/advisor-cases.jsonl`, the skill-local home this phase establishes (parent D2). `package_skill.py --check --strict` must accept that file, with a test, and `skill_advisor_regression.py --dataset <skill>/benchmark/advisor-cases.jsonl` must run it.
- I5 runtime mirrors: `sync-skills-hermes.cjs` then `--check`; skip with n/a when `.hermes/` is absent (parent D4). Claude, OpenCode, Pi and Devin are whole-directory links and need no write.
- I6 changelog: create `changelog/v<version>.md` when absent and the relative link `.skilled/changelog/<name> -> ../skills/<name>/changelog`.

### Out of Scope
- The convert YAML, presentation states and command bridge - phase 006.
- Hub changelog layout (`<hub>/parent` plus per-packet links) - hubs are refused.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modify | V9 rows I1 to I6, each a separate plan line |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Modify | Spawn wrappers for scan, compiler, Hermes sync and regression runner |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modify | Opt-in `--skill <id>` for a standalone root |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Modify | Temp-repo integration cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In a temp repo with `HERMES_SKILLS_OUTPUT_DIR` set (`sync-skills-hermes.cjs:19-20`), `sync-skills-hermes.cjs --check` passes after convert. |
| REQ-002 | In that temp repo with `SKILL_GRAPH_FRESHNESS_ROOT` set, `skill-graph-freshness.cjs --strict` exits 0 after convert. |
| REQ-003 | `.skilled/changelog/<name>` resolves to the skill's real `changelog/` folder holding `v<version>.md`. |
| REQ-004 | The reach script's fleet output is byte-identical with and without the `--skill` change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | With `.hermes/` absent, I5 reports n/a and creates no directory. |
| REQ-006 | For an adopter skill, I4 writes nothing to `skill-advisor-regression-cases.jsonl` and prints the rows plus the `--dataset` command. |
| REQ-007 | I1 never runs `advisor_rebuild`; it prints `/doctor:skill-advisor rebuild` as the fallback. |
| REQ-008 | An adopter skill's rows land in its own `benchmark/advisor-cases.jsonl`; `package_skill.py --check --strict` passes with the file present, and `skill_advisor_regression.py --dataset` on it exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The temp-repo run ends with Hermes `--check` PASS, freshness `--strict` exit 0 and a resolving changelog link.
- **SC-002**: `cmp` of fleet reach output before and after the change reports no difference.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor daemon for `--warm-only` | Exit 75 when the backend is down | Report UNKNOWN, never a pass |
| Risk | A duplicate frontmatter name makes Hermes sync throw (`sync-skills-hermes.cjs:224-226`) | Med | V0 collision refusal from phase 003 runs first |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: I3 probes exactly three approved phrases.
- **NFR-P02**: N/A: no throughput target applies.

### Security
- **NFR-S01**: The I2 tracked-file write is named in the plan before it runs.
- **NFR-S02**: No integration step writes outside the skill folder, `.skilled/changelog/`, the Hermes output and the compiled graph.

### Reliability
- **NFR-R01**: An absent runtime directory is n/a, never created.
- **NFR-R02**: Reach default output does not change.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no prior `changelog/` gets `changelog/v<version>.md` created with an exclusive create.
- Maximum input: an existing `.skilled/changelog/<name>` link that already resolves is left as is.
- Failure path: Hermes sync without `@spec-kit/shared` exits 2 with the provision command (design R9); warm-only exit 75 reports UNKNOWN.
- Hermes absent: I5 prints n/a (parent D4).
- Adopter skill: I4 prints rows and the `skill_advisor_regression.py --dataset <jsonl>` command (`skill_advisor_regression.py:8`) and writes nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Six integration rows and one shared script flag |
| Risk | 12/25 | Tracked compiled graph write and a shared CI script |
| Research | 6/20 | Mechanisms cited in design section 3 |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Parent D2, D4 and D5 settle the regression home, absent runtimes and scan versus rebuild.
<!-- /ANCHOR:questions -->

---

