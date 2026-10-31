---
title: "Feature Specification: Phase 14: sk-design-doc-and-routing-check"
description: "sk-design's rule 6 says the hub is outside compiled routing while the live front door routes it. The md-generator docs promise an 80-point isPass the code does not have, and no routing accuracy number exists for the hub. This phase plans the rule rewrite, puts the gate to the owner as two options and records the first accuracy number from existing tools."
trigger_phrases:
  - "sk-design rule 6 stale"
  - "sk-design compiled routing rule"
  - "md-generator 80-point gate"
  - "md-generator isPass docs"
  - "sk-design routing accuracy"
  - "sk-design playbook routing replay"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: sk-design-doc-and-routing-check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27, from `../007-classifier-deep-research/research/research.md` section 8 (F: sk-design), rows 91 and 93 and open question 47 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 17 |
| **Predecessor** | 013-sk-prompt-framework-docs |
| **Successor** | 015-fanout-merge-and-steering-fixes |
| **Handoff Criteria** | This spec records the owner's choice between the two gate options before any md-generator file changes, and `validate.sh --strict` passes on this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the cli-jev workflow integration specification. It turns section 8 of the round-3 synthesis into three owner fixes for `sk-design`. None uses a classifier and none makes a model call.

**Scope Boundary**: Files under `.skilled/skills/sk-design/`: the hub `SKILL.md`, the md-generator's gate prose (and its code only if the owner picks that option), one new run folder under `benchmark/reports/` with its index row and the SD-007 fix the owner approves. The one file outside it is sk-design's activation manifest, and only if the SD-007 fix changes `hub-router.json`. The compiled-routing runtime code, the admission harness and every scenario prompt stay unchanged.

**Dependencies**:
- The owner's choice on the gate (section 10) before any md-generator edit.
- A working `node .skilled/bin/compiled-route.cjs` at build time. Checked 2026-09-27: it routes sk-design.

**Deliverables**:
- Rule 6 of `.skilled/skills/sk-design/SKILL.md` rewritten from a build-time live rerun
- The md-generator gate prose, or its code, brought to one truth under the owner's chosen option
- A dated run folder under `.skilled/skills/sk-design/benchmark/reports/` holding the first routing accuracy number and its raw captures, indexed in `benchmark/README.md`
- A diagnosis of the SD-007 drift and the smallest fix the owner approves, after which the admission harness scores 4 of 4

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. That folder does not exist (checked 2026-09-27 at build close), so there is nothing to refresh.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rule 6 at `.skilled/skills/sk-design/SKILL.md:202-203` says "Never quote a compiled routing decision for this hub. It is not in the compiled closure, and the call returns a legacy sentinel rather than a route." That is false today. `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` returned `"action":"route"` to `sk-design-chart` on 2026-09-27, and a DESIGN.md prompt routed to `sk-design-md-generator`. sk-design is in `DEFAULT_ON_HUBS` (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:36-44`, the entry at `:43`) and in `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:5-13` (the entry at `:12`). Commit `f5a89115b1` (2026-09-22) rewrote the callout at `SKILL.md:48-52` for compiled routing and left rule 6 behind, so the file now contradicts itself.

The md-generator documents an 80-point gate the code does not have. `isValidationPass` in `backend/scripts/validate.ts:699-701` passes on zero hard failures, and the CLI exits on it at `:765`. A `claimsScore` below 80 only prints an advisory line (`:730-732`). The docs say `isPass` needs `score >= 80` and `claimsScore >= 80` (`references/quality-checklist.md:29`, `:476-479`, `SKILL.md:309`, `assets/design-md-prompt-template.md:74`, plus the sites listed in section 3). No function named `isPass` exists, and the "critical failure" the checklist names at `:477` has no counterpart in `validate.ts` or `schema-v3.ts`.

No routing accuracy number exists for the hub. `benchmark/README.md:26-27` says no hub-level Lane C run was archived before that harness was retired.

### Purpose
The hub's rules match its live routing, the md-generator's docs and code state one gate and the hub has its first recorded routing accuracy number.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rerun the live compiled-route check at build time, then rewrite rule 6 to match what it returns.
- Put the gate to the owner as two options, record the choice here and apply only the chosen option.
- Replay the playbook scenarios through the compiled router with the tools that exist and record the first accuracy number.
- Diagnose why SD-007 routes wrong, then apply the smallest vocabulary or gold fix the owner approves.

### Out of Scope
- Any code change under `.skilled/bin/`, including the admission harness and the compiled-routing engine. They are another owner's, and the replay only reads them. The only allowed write there is re-minting `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json` with the routing owner's own tool, needed only when the SD-007 fix changes `hub-router.json`.
- Adding `expected_workflow_mode` gold to the 49 mode scenarios. The admission harness reads only the hub-level playbook, so that gold would not be read without a harness change.
- Any classifier, Deem or Jev call. Research rows 84 and 91 dropped a classifier for sk-design routing and for its gate.
- `classify_intents` pseudocode in `sk-design-fundamentals/SKILL.md:197`. Row 84 dropped it and this phase's brief does not name it.
- `report-gen.ts:196-199`. Its "Pass" band at 80 is only reached when the hard-failure count is 0 (`report-gen.ts:280` prints `Hard Fail` otherwise), and with zero failures `score` is 100 (`validate.ts:662`). The label never contradicts the gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/SKILL.md` | Modify | Rewrite rule 6 (`:202-203`) to match the build-time rerun and the callout at `:48-52` |
| `.skilled/skills/sk-design/sk-design-md-generator/SKILL.md` | Modify (option A) | `:309`, `:395`: describe the zero-hard-failure gate |
| `.skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md` | Modify (option A) | `:29`, `:476-479` (VS-05) |
| `.skilled/skills/sk-design/sk-design-md-generator/assets/design-md-prompt-template.md` | Modify (option A) | `:74` |
| `.skilled/skills/sk-design/sk-design-md-generator/assets/cardinal-rules-card.md` | Modify (option A) | `:51` |
| `.skilled/skills/sk-design/sk-design-md-generator/feature-catalog/validate/validate.md` | Modify (option A) | `:21`, `:67`, `:86` |
| `.skilled/skills/sk-design/sk-design-md-generator/feature-catalog/feature-catalog.md` | Modify (option A) | `:127` |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/manual-testing-playbook.md` | Modify (option A) | `:216`, `:222`, `:223`, `:229`: gate wording only, prompts unchanged |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/validate/phantom-hex-detection.md` | Modify (option A) | `:44`, `:59`, `:60`, `:62`, `:78`, `:88`, `:110`: gate wording only |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/fidelity/verbatim-value-fidelity.md` | Modify (option A) | `:91`: gate wording only |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/authoring-boundary/authoring-boundary.md` | Modify (option A) | `:80` |
| `.skilled/skills/sk-design/sk-design-md-generator/manual-testing-playbook/source-of-truth/source-of-truth-card.md` | Modify (option A) | `:80` |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/validate.ts` | Modify (option B only) | `isValidationPass` at `:699-701` takes the documented 80-point rule |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/validate.test.ts` | Modify (option B only) | Cases for the 80-point rule |
| `.skilled/skills/sk-design/benchmark/reports/<YYYY-MM-DD>--manual-testing-playbook--hub-routing-replay/` | Create | `skill-benchmark-report.md` plus `raw/` with the run script and its captures |
| `.skilled/skills/sk-design/benchmark/README.md` | Modify | One row in section 2 naming the run, per its own section 3 |
| `.skilled/skills/sk-design/hub-router.json` | Modify (SD-007 vocabulary option) | The smallest keyword or class change the diagnosis names |
| `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | Modify (SD-007 gold option) | Frontmatter gold only (`expected_workflow_mode` and `expected_leaf_resources`). The prompt stays |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json` | Modify (SD-007 vocabulary option) | Re-minted by the routing owner's tool so the new policy hash serves instead of falling back to legacy |

The option A rows are the same-class inventory from `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` on 2026-09-27: 26 lines in 11 files, every one a statement of the 80-point gate or a `claims >= 80` expected signal. The same pattern over the whole hub found no other file. The build reruns it and edits every hit it still finds.

### Owners

| Surface | Owner | Contract the build follows |
|---------|-------|----------------------------|
| Hub `SKILL.md`, `benchmark/` | `sk-design` | `.skilled/skills/sk-design/SKILL.md` rules 1 to 5 and `benchmark/README.md` section 3 |
| md-generator docs and backend | `sk-design` mode `sk-design-md-generator` | Its `SKILL.md`, `references/quality-checklist.md` and the backend vitest suite (`backend/package.json` `test`) |
| Compiled front door and admission harness (read only) | the compiled-routing runtime under `.skilled/bin/` | `.skilled/bin/compiled-route.cjs` and `.skilled/bin/compiled-route-admission.cjs` usage headers |
| sk-design activation manifest (SD-007 vocabulary option only) | the compiled-routing runtime under `.skilled/bin/` | Re-mint through its own tool, which the build names after reading `.skilled/bin/compiled-route-manifest.cjs` and `compiled-route-sync.cjs`. UNKNOWN today which subcommand re-mints one hub |
| Run report shape | `sk-doc` mode `sk-create-benchmark` | The existing playbook-run precedent at `.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/` |

`git log -5` on 2026-09-27: hub `SKILL.md` last changed in `f5a89115b1` (2026-09-22), md-generator in `29c9b0e411` (2026-09-26, changelogs only), `validate.ts` in `ec33385ae5` (2026-09-17, a move), `benchmark/` and the hub playbook in `02589c0bfd` (2026-09-18). `git status --porcelain` showed no uncommitted sk-design or `.skilled/bin` file in any of the four worktrees. No in-flight collision was found.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Rerun `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` at build time and keep its stdout. On `"action":"route"`, rewrite rule 6 so it tells the reader to take the mode from that call and to fall back to the routing section on a legacy sentinel or an error, matching the callout at `SKILL.md:48-52`. On a legacy sentinel, leave rule 6 as it is and report the result instead |
| REQ-002 | Record the owner's choice between option A (docs follow the code) and option B (the code enforces the 80-point rule) in section 10 of this spec, with the date, before any md-generator file changes |
| REQ-006 | Make no classifier or model call, and change no file outside `.skilled/skills/sk-design/` and this phase folder, except generated derivatives of in-scope sources: the `sync-skills-hermes.cjs` copies under `.hermes/skills/` of changed sk-design `SKILL.md` files, and sk-design's activation manifest with its `specs/sk-doc/019` mirror, which the route-remint gate re-mints. No other `.skilled/bin` file changes (amended at close, see `goal.md`). Code the build writes carries no spec path, packet or phase number or requirement id in a comment |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Apply the chosen option only. Option A: rewrite every same-class doc site to say the gate passes on zero hard failures in the `target`, `schema` and `provenance` categories, and leave `validate.ts` unchanged. Option B: change `isValidationPass` to the documented rule and add a vitest case for each side of it |
| REQ-004 | Run `node .skilled/bin/compiled-route-admission.cjs --hub sk-design --json` and keep its output as the gold-scored part of the replay. On 2026-09-27 it scored the 4 hub-level scenarios as 3 pass and 1 drift (SD-007, `wrong-mode`) and exited 1 |
| REQ-005 | Replay the 49 mode-playbook scenarios through the compiled front door with a run script in the report's `raw/` folder, one prompt per scenario copied verbatim, each scored against the mode whose playbook holds it. Write the report with the first accuracy number as N of M scored scenarios and index it in `benchmark/README.md` section 2 |
| REQ-007 | Refresh this phase's documents with the build's evidence, and `validate.sh --strict` on this phase prints `RESULT: PASSED` |
| REQ-008 | After the replay records its baseline, diagnose SD-007 by reading the scenario, its compiled route and the hub's routing vocabulary in `hub-router.json`, and write the cause into the report. Then plan the smallest fix, a vocabulary change or a gold correction, and apply it only after the sk-design owner says yes. Afterward `compiled-route-admission.cjs --hub sk-design` scores 4 of 4 and exits 0, and a rerun of the replay shows no other scenario routing worse than the baseline |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints 0 while the live front door still routes sk-design.
- **SC-002**: Under option A, `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` returns no match. Under option B, the backend vitest suite exits 0 with the new cases.
- **SC-003**: One run folder under `.skilled/skills/sk-design/benchmark/reports/` states a routing accuracy over all 53 playbook scenarios, with every n/a and every miss named.
- **SC-004**: After the SD-007 fix, the admission harness scores 4 of 4 and no replayed scenario routes worse than the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The owner's gate choice | REQ-003 cannot start | Rule 6 and the replay do not depend on it and go first |
| Dependency | Option B needs the backend's dev dependencies | `backend/node_modules` is absent in this worktree (checked 2026-09-27), so the vitest suite cannot run without an install | Installs need a named rollback (delete `backend/node_modules`) and the operator's yes. Option A needs no install |
| Risk | The front door stops routing sk-design before the build | Med | REQ-001's legacy branch keeps rule 6 and reports it rather than writing a false rule |
| Risk | A mode scenario tests a boundary to another mode, so its owning mode is the wrong gold | Med | The report names each miss with the scenario's own expected mode where the scenario states one, and says which gold it scored against |
| Risk | `parent-skill-check.cjs` is red before any change | Low | It exited 1 on 2026-09-27 on `12-lib` (`Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'`). Per the coordinator it fails that way on every hub in this worktree for a provisioning reason, so it is not an sk-design fault. Phase `018-worktree-provision-shared-link` plans that fix. Until it lands, the build compares against this baseline, not against 0. At the build baseline (`6f47c32dce`, after the main merge) it exited 0 with 0 warnings, so the build compared against 0 |
| Risk | The SD-007 fix moves other routes | Med | A vocabulary change is compiled for the whole hub. The replay reruns after the fix and any scenario that routes worse blocks the fix |
| Risk | The SD-007 gold is the fault, not the router | Med | The prompt is `Improve doc quality and add flowcharts for the new feature docs.` and names no data chart, while the gold expects chart and diagram. The diagnosis decides between a vocabulary change and a gold correction and puts the choice to the owner |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The replay makes one `compiled-route.cjs` call per scenario, 53 calls in all. It makes no network call.
- **NFR-P02**: No model call of any kind. Parent D1's backends are not used by this phase.

### Security
- **NFR-S01**: The run script reads playbook files and calls local node scripts only. It needs no credential and opens no `.env` file.
- **NFR-S02**: The raw captures hold prompts and routing JSON only. No secret, token or local absolute path from outside the repository.

### Reliability
- **NFR-R01**: The replay is deterministic. Two runs on the same commit print the same routes.
- **NFR-R02**: Rule 6 changes only when the build-time rerun agrees with it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a scenario with no extractable prompt counts as n/a and is named in the report, as the admission harness does for `no-prompt`.
- Maximum length: prompts are copied verbatim. None is truncated.
- Invalid format: a scenario whose prompt uses neither the `Real user request:` bullet nor the `Exact Prompt` table cell is read by hand and named in the report.

### Error Scenarios
- External service failure: none is called.
- Network timeout: not applicable. The front door is a local node script.
- Concurrent access: the admission harness writes nothing without `--out`, and the run script writes only its own capture file.

### State Transitions
- Partial completion: rule 6 and the replay can close while the gate waits on the owner. The phase stays open until REQ-003 is met or waived.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One rule, 11 doc files with a word-level change under option A, one new report folder, one routing fix |
| Risk | 5/25 | Docs only under option A. Option B changes a pass rule other docs cite |
| Research | 4/20 | The facts are already measured. The build reruns them |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Owner choice on the md-generator gate. Made.** Recorded on the next line, which starts with `Owner choice:`, then the letter, the date and who chose.
Owner choice: A, 2026-09-27, the operator, releasing this phase "with gate option A" in the orchestrating session
  - Option A, docs follow the code. Rewrite the doc sites in section 3 to say the gate passes on zero hard failures, and print the dual score as information. Cost: 26 lines in 11 doc files, no code, no install.
  - Option B, the code enforces 80. Replace `isValidationPass` with `score >= 80 && claimsScore >= 80` plus a no-critical-failure clause, add vitest cases and install the backend's dev dependencies to run them. Cost: a code change, an install and a looser gate.
  - **Recommendation: option A.** The code's gate is stricter than the documented one, so enforcing 80 would loosen it. `score` drops 5 points per hard failure (`validate.ts:662`), so a document with one to four hard failures outside `provenance` scores 80 to 95 with `claimsScore` 100 and passes the documented rule, while the code fails it today. `claimsScore` drops 10 points per `provenance` failure (`:661`) and `provenance` is a hard category (`schema-v3.ts:9`), so `claimsScore < 80` already implies at least three hard failures. The tests pin the current contract: `validate.test.ts:176-199` passes an advisory-only document and fails one with a single phantom hex at score 95, and `schema-v3.test.ts:250-257` keeps corpus divergence advisory. The docs' "critical failure" has no counterpart in the code.
- **Owner yes on the SD-007 fix. Given.** Recorded on the next line, which starts with `SD-007 fix approved:`, then the option, the date and who approved.
SD-007 fix approved: option (b), the frontmatter-only gold correction to `sk-design-diagram`, 2026-09-27, the operator, answering "Correct the gold (Recommended)" after the diagnosis in the replay report
<!-- /ANCHOR:questions -->

---

