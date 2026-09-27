---
title: "Implementation Plan: Phase 14: sk-design-doc-and-routing-check"
description: "Rerun the live sk-design route and rewrite rule 6 to match, record the owner's gate choice and apply only that option, then score the 53 playbook scenarios with the existing admission harness and the compiled front door and record the first accuracy number."
trigger_phrases:
  - "sk-design rule 6 rewrite plan"
  - "md-generator gate option plan"
  - "sk-design routing replay plan"
  - "compiled-route-admission sk-design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: sk-design-doc-and-routing-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs. TypeScript in the md-generator backend only under option B |
| **Framework** | The compiled-routing front door `.skilled/bin/compiled-route.cjs` and harness `.skilled/bin/compiled-route-admission.cjs`, both read only |
| **Storage** | None. The run report and its raw captures are files under `benchmark/reports/` |
| **Testing** | Shell checks with `grep`, `rg` and `git`. The backend's vitest suite under option B |

### Overview
Three independent fixes, all owned by `sk-design`. Rule 6 is rewritten from a live rerun of the front door. The md-generator gate waits on the owner's choice between docs-follow-code and code-enforces-80, and only the chosen option is applied. The first routing accuracy number comes from tools that already exist: the admission harness scores the 4 hub-level scenarios that carry gold, and a run script in the report's `raw/` folder routes the 49 mode scenarios through the front door. Once that baseline is recorded, the SD-007 drift is diagnosed and fixed with the owner's yes, then both runs repeat to prove 4 of 4 and no regression.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The owner's gate choice is recorded in `spec.md` section 10 before step 3 starts

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation correction plus a read-only measurement. No new component.

### Key Components
- **Compiled front door** (`.skilled/bin/compiled-route.cjs`): prints a route or the legacy sentinel for `--hub sk-design --prompt <text>`. Its answer decides rule 6 and scores the mode scenarios.
- **Admission harness** (`.skilled/bin/compiled-route-admission.cjs`): reads `expected_workflow_mode` gold from the hub's own `manual-testing-playbook/` only (`.skilled/bin/lib/compiled-route-admission.cjs:182-199`), calls the engine directly and writes nothing without `--out`. It is the existing harness for this job. It cannot see the mode playbooks, whose 49 scenarios carry no gold frontmatter.
- **Run script** (new, in the report's `raw/` folder): one `probe` line per mode scenario, the shape of `.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing-run.sh`.

### Data Flow
Scenario prompt, copied verbatim, goes to the front door. The route JSON goes to the capture file. The report compares each routed mode with the scenario's gold and states N of M.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate.ts` `isValidationPass` (`:699-701`) | Owns the gate: zero hard failures | Unchanged under option A. Replaced under option B | `git diff --stat` on the file |
| md-generator docs (11 files, 26 lines) | State an 80-point `isPass` | Rewritten under option A | `rg -n 'isPass[^A-Za-z]\|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` |
| `report-gen.ts` `valScoreLabel` (`:196-199`) | Labels a zero-failure score, always 100 | Unchanged: `:280` prints `Hard Fail` for any failure first | Read of `:280` |
| Hub `SKILL.md` rule 6 (`:202-203`) | Tells the reader compiled routing does not apply | Rewritten after the rerun | `grep -c "not in the compiled closure"` |
| Hub `SKILL.md` callout (`:48-52`) | Already states the compiled front door | Unchanged. Rule 6 is aligned to it | Read |
| Admission harness, front door, playbook prompts | Read by the replay | Unchanged | `git diff --stat -- .skilled/bin` shows at most the sk-design activation manifest |
| `hub-router.json` vocabulary | Feeds the compiled policy for all four modes | Changed only under the SD-007 vocabulary option | Admission 4 of 4 and the replay diff |
| SD-007 frontmatter gold | Read by the admission harness | Changed only under the SD-007 gold option, prompt untouched | `git diff` on the scenario shows frontmatter lines only |
| sk-design activation manifest | Pins the served policy hash | Re-minted only under the vocabulary option | `node .skilled/bin/compiled-route-status.cjs --hub sk-design` reports `compiled-serving` |

Required inventories:
- Same-class producers: `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` (26 lines, 11 files on 2026-09-27), and `rg -n "compiled closure|legacy sentinel" .skilled/skills/sk-design` for other rule-6 wording.
- Consumers of changed symbols: under option B only, `rg -n 'isValidationPass' .skilled/skills/sk-design` (`validate.ts:733`, `:765` and three test files on 2026-09-27).
- Matrix axes: rule 6 has two rows (route, legacy sentinel). The gate has two options. The replay has two sources (hub scenarios with gold, mode scenarios scored against their owning mode).
- Algorithm invariant: not a path, parser or security fix.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step and the check that proves it:

| Step | Work | Observable check |
|------|------|------------------|
| 1 | Baselines: rerun the two live routes, the admission harness, `parent-skill-check.cjs` and the same-class `rg` | Outputs saved under this phase's `scratch/`. Expected: `"action":"route"` for both prompts, admission `3 pass, 1 drift` exit 1, `parent-skill-check` exit 1 on `12-lib`, 26 `rg` lines |
| 2 | Rewrite rule 6 (route branch), or keep it and report (legacy branch) | `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints 0 on the route branch |
| 3 | After the owner's choice is in `spec.md`, apply option A or B | Option A: the `rg` returns no match and `git diff --stat -- .skilled/skills/sk-design/sk-design-md-generator/backend` is empty. Option B: backend `npm test` exits 0 |
| 4 | Run the admission harness with `--json` into the report's `raw/` | The capture holds 4 scenario rows and a verdict |
| 5 | Write and run the mode run script into `raw/` | The capture holds 49 `### ` blocks, one per mode scenario |
| 6 | Write the report and its index row | The report states N of M over 53 scenarios. `grep -c` of the run label in `benchmark/README.md` is 1 or more |
| 7 | Diagnose SD-007 from the scenario, its compiled route and `hub-router.json`, write the cause into the report and record the owner's yes on the chosen fix in `spec.md` | The report names the cause. `grep -n "SD-007 fix approved:"` on `spec.md` prints one line |
| 8 | Apply the approved fix, re-mint the activation manifest if `hub-router.json` changed, then rerun the admission harness and the replay | Admission prints 4 pass and exits 0. A diff of the new `raw/mode-routing.txt` against the baseline capture shows no scenario that matched its gold before and misses now |
| 9 | Close the phase docs | `validate.sh --strict` on this phase prints `RESULT: PASSED` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Option B only: one vitest case at each side of the 80-point rule, plus the existing phantom-hex case | `npm test` in `sk-design-md-generator/backend` |
| Integration | Rule 6 against the live front door: happy path `route`, edge case a legacy sentinel under `SPECKIT_COMPILED_ROUTING=0` | `compiled-route.cjs` |
| Integration | SD-007 fix: happy path SD-007 passes, edge case every other gold and replayed scenario keeps its baseline result | `compiled-route-admission.cjs`, the run script |
| Manual | Read each replay miss against its scenario text, and each rewritten doc line against `validate.ts:699-701` | Reader |

The kill-switch edge case is read only: `SPECKIT_COMPILED_ROUTING=0 node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` printed `{"servingAuthority":"legacy","hubId":"sk-design"}` with exit 0 on 2026-09-27, which the rewritten rule 6 must tell the reader to handle.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Owner's gate choice | Internal | Red: not made | Step 3 waits. Steps 1, 2 and 4 to 6 proceed |
| Compiled front door | Internal | Green: routed sk-design on 2026-09-27 | Rule 6 stays and the replay reports legacy for every scenario |
| Backend dev dependencies | External | Absent in this worktree | Option B only. Needs the operator's yes and the rollback in section 7 |
| Owner's yes on the SD-007 fix | Internal | Red: diagnosis not run | Step 8 waits. The rest of the phase proceeds |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewritten line misstates the gate or the route, the backend suite fails under option B or the report's numbers do not match its raw captures.
- **Procedure**: The build lands as one path-scoped commit under `.skilled/skills/sk-design/`. `git revert <that commit>` restores every doc, the rule, the report, the SD-007 change and a re-minted activation manifest. After a revert, `compiled-route-status.cjs --hub sk-design` must report `compiled-serving` again. An option B install is undone by deleting `.skilled/skills/sk-design/sk-design-md-generator/backend/node_modules`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baselines ──┬──► Rule 6 ─────────────┐
            ├──► Replay + report ──► SD-007 fix ──┼──► Close
Owner choice ──► Gate option ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baselines | None | Rule 6, Replay |
| Rule 6 | Baselines | Close |
| Replay + report | Baselines | SD-007 fix |
| SD-007 fix | Replay + report, owner's yes | Close |
| Gate option | Owner choice | Close |
| Close | Rule 6, Gate option, SD-007 fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 2 to 3 hours: copying 49 prompts, reading misses and the SD-007 diagnosis and fix |
| Verification | Low | 30 minutes |
| **Total** | | **3 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): not needed, git holds every file
- [ ] Feature flag configured: not needed, no runtime behavior changes under option A
- [ ] Monitoring alerts set: not needed

### Rollback Procedure
1. Revert the phase commit with `git revert <sha>`.
2. Under option B, delete `backend/node_modules` if it was installed for this phase.
3. Rerun `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` and the same-class `rg` to confirm the old text is back.
4. Tell the operator which commit was reverted and why.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
