---
title: "Implementation Plan: Phase 7: generated-surfaces"
description: "Regenerate the scorer eval baseline and the trigger index with its three fixtures through their own generators, add four exact-path allowlist rows for the index outputs after proving they carry only specs/ history, and run every check mode from the final tree. The trigger index is regenerated last, after every markdown write, because its fixtures hash the corpus bytes."
trigger_phrases:
  - "generated surfaces plan"
  - "trigger index regeneration order"
  - "generator check modes"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Phase 7: generated-surfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON generator output (the trigger index, three retrieval fixtures, the scorer eval baseline), one hand-edited JSON allowlist, one JSONL labels file on a yes; Node.js ESM generators and checks; one Python compiler check |
| **Framework** | The spec-kit trigger index generator, the advisor scorer capture and its Vitest ratchets, the lane residue check, the skill-graph compiler and freshness panel, the sk-doc cite-drift scan and gate |
| **Storage** | None. The capture scores against an empty temporary database directory; no database or runtime file changes |
| **Testing** | Generator check modes, a byte compare against a fresh generation, the `derived` assertion, the residue check, three ratchets, the capture-date test, the routing corpus gate, the bridges, leaf manifest and link checks, two node test suites |

### Overview
Two generators run: `capture-scorer-eval-baseline.mjs --write` once after a clean advisor build, and `generate-trigger-index.mjs` after the last markdown file is added and the last `trigger_phrases` list is edited. Between them, four exact-path rows go into the residue allowlist, because a fresh index still carries `specs/` history, and the five label rows change only on the conductor's yes. The proof is each check mode exiting 0, every score field equal, and `derived` printing `outside=0` before the residue check exits 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Right after the regeneration, `cmp` prints nothing for the four outputs against a fresh `--out` copy. From the final tree: `generate-trigger-index.mjs --check` exits 0 with 0 stale, 0 obsolete and 0 untrusted; `samecontent` prints `equal=4`; `derived` prints `outside=0`; `sweep-lane-residue.mjs repo` exits 0 with `live : 0`; `scorecheck "$S"` prints `score fields=21 differing=0`; the three ratchets pass 7, 9 and 6 and the capture-date test 2; the routing corpus exits 0 with `overall_pass: true`; `skill-graph-freshness.cjs --strict` exits 0 and `--validate-only` prints `VALIDATION PASSED`; `cite-drift-scan.mjs` exits 0 (option A) or prints only `S`'s label line (option B, waived); bridges `--check` exits 0, both leaf manifests print `OK`, the link check prints `0 broken`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Regenerate, then prove: each generated file is its generator's output, and each claim about it is a check-mode exit.

### Key Components
- **Trigger index generator** (`$RT/generate-trigger-index.mjs`): walks every markdown doc outside the exclusions (`**/scratch/**` among them), writes `$K/runtime/data/trigger-index.json` and, beside it in `$RT/fixtures/`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. Its `--check` compares phrases per document and only notes a manifest hash difference, so the three fixtures are proven by a byte compare with a fresh `--out` generation, the method `trigger-index-rebuild.yml` uses.
- **Scorer capture** (`$R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`): imports the built `dist/`, replays the recorded `capturedAt` date, and with `--write` rewrites `scorer-eval-baseline.json`. The ratchet (`$R/tests/parity/scorer-eval-baseline-ratchet.vitest.ts`) reads `capturedAt`, the three fixture hashes and the `correct` and `value` counts, never `env` or `capturedAtSha`.
- **Residue check and allowlist** (`$RT/sweep-lane-residue.mjs`, `$RT/fixtures/lane-residue-allowlist.json`): content-greps every tracked file outside `specs/`, including the raw index. Rows are exact paths with reasons.
- **Skill-graph export checks** (`$R/scripts/skill_graph_compiler.py --validate-only`, `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict`): the compiler has no check flag, so these two CI steps and a scratch export compare are its check mode. Phase 006 wrote the export.
- **Cite-drift label gate** (`$SD/shared/scripts/cite-drift-scan.mjs`, default run): reads each row of `cite-drift-labels.jsonl` at its pinned commit and exits 2 on a hash mismatch. `cite-drift-gate.mjs`, the CI step, checks citations in skill docs and never reads the labels.

### Data Flow
The clean build feeds the capture, which writes the baseline; `scorecheck` compares it field by field with `S`. The allowlist rows and, on a yes, the label rows are hand edits to files no generator writes. The trigger index generator then reads the corpus as it stands; its four outputs are byte-compared with a fresh copy in `T` before any doc edit, and `derived` reads that copy and the allowlist. The residue check reads the tree, the allowlist included, and must exit 0. The packet docs are filled and validated after that, as body edits only, and the final tree is proven with `--check` and `samecontent`, which ignores the two hash fields a body edit moves. Verification output goes to `T` and `$F/scratch/`, both outside the corpus.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The allowlist and the score baseline are shared gates, so each surface is listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `$K/runtime/data/trigger-index.json` and three `$RT/fixtures/` sidecars | Retrieval index and its snapshot record, read by `lookup-trigger-index.mjs` and Gate 1 | Regenerate (ADR-005) | `--check` exit 0; `cmp` against `T` prints nothing |
| `$RT/fixtures/lane-residue-allowlist.json` | Exact-path exemptions for the residue check | Update: four rows (ADR-002) | Row count `N0` plus 4; `unusedAllowlistRows` empty; residue exit 0 |
| `$R/scripts/routing-accuracy/scorer-eval-baseline.json` | Frozen score baseline for the ratchet and five scorer tests | Regenerate (ADR-003) | `scorecheck` 21 of 21 equal; ratchet 7; capture-date 2 |
| Readers of the baseline: `doctor-phrase-reach.cjs`, `ambiguity-slice`, `doctor-bridge-isolation`, `doctor-handoff-command`, `doctor-routing-slice`, `holdout-independent` | Read `capturedAt` and score fields | Unchanged; not consumers of `env` or `capturedAtSha` | `git grep -n capturedAtSha -- ':!specs'` names no reader of this file |
| `$K/runtime/cli/retrieval/fixtures/residue-allowlist.json` 137 | Memory sweep row for the baseline, reason "never rewritten" | Update: the reason reworded (conductor resolution, spec.md section 10) | The row matches by path, so the memory sweep result does not change |
| `$SD/shared/scripts/cite-drift-labels.jsonl` | Operator-labeled rows pinned to commit `ebcc68e8edb` | Update five `doc` fields on a yes, else unchanged (ADR-004) | Scan exit 0 with the repair; rows `live-14` and `constructed-16` unchanged either way |
| `$R/scripts/skill-graph.json`, `$A/leaf-manifest.json`, `$A/leaf-aliases.json` | Regenerated by phase 006 | Not a consumer here (ADR-006) | Freshness, validation and scratch-export compare; leaf manifest `OK`; `git diff "$S"` lists none |
| CI `trigger-index-rebuild.yml`, `advisory-checks.yml`, `routing-registry-drift.yml`, `sk-doc-script-tests.yml` | Run these check modes after merge | Not a consumer; the same commands run here | The commands in `tasks.md` are copied from those steps |

Required inventories:
- Same-class producers: `node $RT/sweep-lane-residue.mjs repo --json` at `S`, expected to list exactly the five generated paths (T001).
- Consumers of changed values: `git grep -n -E 'scorer-eval-baseline|capturedAtSha' -- ':!specs'` for the baseline; the four generator outputs have one writer and are read only through `lookup-trigger-index.mjs` and the check.
- Matrix axes: generated file (index, three fixtures, baseline) by proof (generator output, check mode, residue state).
- Invariant: every generated file equals its generator's output for the final tree, and every lane term an allowlisted generated file holds traces to `specs/` or to an allowlisted file. Adversarial cases: a doc outside `specs/` that still names the lane (caught by `derived` and at its source), a new markdown file or phrase edit after regeneration (caught by `--check` in T017 and T019), a body edit after regeneration (tolerated by T019's `samecontent`, which ignores only the two hash fields), a stale `dist` (caught by `scorecheck`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phase 006 is committed, checks that the residue list is exactly the five generated paths, records every check's start result and rebuilds the advisor clean. Implementation regenerates the scorer baseline, adds the four allowlist rows, applies the conductor's answer on the labels, then regenerates the trigger index. Verification runs every check mode from that tree, fills and validates the packet docs as body edits only, then proves the final tree against a fresh generation.

The ordered work and each task's verify command are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The baseline field by field (`scorecheck`); the four index outputs against a fresh copy (`cmp`); every lane term in them (`derived`); `hits` on the baseline and the export | `node` with the residue check's exported patterns, `cmp`, `git show` |
| Integration | `generate-trigger-index.mjs --check`; the residue check in repo mode; the three ratchets, the capture-date test and the routing corpus gate; skill-graph freshness and validation; the cite-drift scan, gate and two node suites; bridges, leaf manifests and links | The repository's own check scripts, Vitest, `node --test`, Python 3 |
| Manual | Read the baseline diff (two lines) and the allowlist diff (four rows); read `derived`'s output for any path outside `specs/` | `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 committed, with its allowlist rows and its export regeneration | Internal | Yellow | T001 halts on any live path beyond the five; 006 is planned, not built |
| The conductor's answer to open question 1 | Internal | Yellow | REQ-006 stays Unmet; the packet cannot close until A is applied or B waives the row |
| A clean advisor build (`npm run build` in `$R`, which builds `system-spec-kit/shared` first) | Internal | Green | The capture would score stale code; `scorecheck` halts on any metric difference |
| `node` 22, `python3`, `git` | External | Green | The generators and checks cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any score field differs after T005, a ratchet or the routing corpus moves, `derived` prints a path outside `specs/` that is not allowlisted, or any check mode stays red after three fix rounds.
- **Procedure**: before the commit, `git restore` the five generated files, the allowlist and the labels file from `S`; no generator writes outside the tree except into `T`, which `rm -rf "$T"` removes. A moved score is restored, never recaptured, and the baseline then gets one exact-path allowlist row instead (ADR-003). After the commit, revert the one phase commit. No tag, release, database or runtime file is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (start commit, five-path residue check, baselines, clean build) | Phase 006 committed | Implementation |
| Implementation (baseline, allowlist rows, labels on a yes, packet docs, index last) | Setup; the conductor's answer for T007 | Verification |
| Verification (every check mode, then the final regeneration and its checks) | Implementation | Phase 008 |
<!-- /ANCHOR:phase-deps -->
