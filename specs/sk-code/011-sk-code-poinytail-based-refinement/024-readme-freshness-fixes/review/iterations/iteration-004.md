# Deep Review Iteration 004 — Traceability

**Dispatcher:** @deep-review, iteration 4 of 5 — run `2026-10-12T16:20:15.273Z-i4`, session `2026-10-12T16:20:15.273Z`, generation 1, lineageMode `new`, mode `review`, executor cli-devin (`deepseek-v4-1-flash-max`). Prior findings: P0=0 P1=0 P2=0.

## Dimension

Traceability — spec alignment, checklist evidence, cross-reference integrity and named integration touchpoints across the README freshness fix set: the 023 Section 11 rows F1–F23 against the 024 ledger, the ledger's proofs against the tree, the Remaining rows RM-1 to RM-3 against their evidence files, and agreement among spec, tasks, acceptance criteria, goal, summary and the phase commits.

Protocols: core `spec_code` + `checklist_evidence`; overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

## Files Reviewed

- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/spec.md:63,86-99`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/tasks.md:54-55,63,117,163,173-175`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/acceptance-criteria.md:54-59,84`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/goal.md:57-63`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/implementation-summary.md:51,57-71,85-126`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:1-365`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:3,21,119-198`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:140,175` and `goal.md:86,163`
- `README.md:24,66,80,98,125,147,421,426,785,881,933,1074,1278,1435`
- `.skilled/scripts/git-hooks/pre-commit:895-924`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1740-1884`
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:17,30,122`
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:379-439`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:39,544,764,1074-1080,1557,1574`
- `.skilled/skills/sk-git/README.md:204,267,288`, `.skilled/skills/sk-doc/README.md:220`, `.skilled/skills/system-spec-kit/README.md:49`, `.skilled/skills/system-spec-kit/runtime/README.md:26`, `.skilled/skills/system-deep-loop/runtime/README.md:25`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Phase problem statement counts "twelve related READMEs" where the packet's own fix set is eleven** -- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/spec.md:63` -- The problem statement says "The root README and twelve related READMEs still carry counts and setup lines", but the phase's Files Changed table, the ledger and the product diff all describe eleven related docs [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/spec.md:63].
   - Case: an operator reconciling the phase scope from its own docs gets twelve related READMEs from the problem statement and eleven from the Files Changed table [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/spec.md:86-99], the ledger sentence at `implementation-summary.md:51` and the review target; the product diff's 15 `diff --git` entries are the root README, eleven related docs, the checker, its test and the versioning reference [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:1].
   - Finding class: instance-only
   - Scope proof: counted from the diff file list (15 files) and both Files Changed tables; the phrase originates in the 023 synthesis description ("the root README and twelve related READMEs") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:3], while 023 Section 11's content rows F12–F23 span eleven docs — the twelfth flagged doc (`.skilled/skills/system-deep-loop/README.md`) carries only the ruled version row F28, which the operator decision keeps.
   - Affected surface hints: ["024 spec.md problem statement", "023 research.md description"]
   - Recommendation: reword to "eleven related READMEs", or name the version-only doc explicitly if the twelve is intentional.

2. **tasks.md marks "All tasks marked `[x]`" while T007 and T008 remain open** -- `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/tasks.md:63` -- The Completion Criteria block is checked complete, but Phase 3 still carries two unchecked tasks and the same file's Verification Summary reports 12 of 13 P0 and 12 of 13 P1 items verified.
   - Case: a closure reader treats the checked "All tasks marked `[x]`" box as proof the task list is done, while T007 (the five-iteration `/deep:review :auto` run and its fixes) and T008 (the goal-criteria, `check-goal.cjs` and strict `validate.sh` run) are still pending [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/tasks.md:54]; the honest state is `acceptance-criteria.md:58` (AC-005, Unmet) and `:84` (Closeable: No).
   - Finding class: instance-only
   - Scope proof: read directly in tasks.md — the contradiction is inside the single file (`:54-55` vs `:63`, summary `:173-175`); every other checklist row's evidence was checked and holds.
   - Affected surface hints: ["024 tasks.md completion criteria"]
   - Recommendation: uncheck "All tasks marked `[x]`" (or complete T007/T008) before closure; AC-005 already blocks closure independently.

## Traceability Checks

- `spec_code` (core): pass — every ledger proof reached bears out. Root README counts match the ledger text at every anchor: 11 agents (`:24`, `:66`, `:98`, `:125`, `:933`), 37 commands (`:80`, `:1074`), 41 rules / seven warn-only (`:147`, `:421`, `:426`, `:785`), 20 doctor workflows (`:1278`), the ClickUp auth rewrite and 111/35 catalog counts (`:881`, `:1435`); zero stale tokens remain (12 Specialized, Twelve specialized, 39 command, 42 rules, 42 validation, 19 underlying, 96-feature, 37-scenario, CLICKUP_API_KEY) [SOURCE: README.md:881].
- `checklist_evidence` (core): partial — tasks.md's completion block contradicts its own open tasks (finding 2); every other checklist row carries evidence that checks out (CHK-FIX-005's "23 F rows, 4 DC rows, 3 RM rows" counts match the ledger exactly).
- `skill_agent` (overlay): notApplicable — the diff changes docs and one doctor checker; no skill↔agent mapping surface moved.
- `agent_cross_runtime` (overlay): blocked — the `.codex/.cursor/.devin/.opencode/.hermes` agent trees are not materialized in this worktree (same limitation as iteration 1), so the README:933 mirror sentence rests on the orchestrator's `readlink` evidence recorded in the ledger's F11 row.
- `feature_catalog_code` (overlay): pass — the 111-feature catalog + 35-scenario playbook text at README.md:881 matches the research's re-run counts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:21].
- `playbook_capability` (overlay): pass — the sk-git README reads 9 categories at `:204`, `:267` and `:288` with zero residual "8 categories", and the unresolved scenario number is deliberately dropped [SOURCE: .skilled/skills/sk-git/README.md:204].
- Ledger counts vs the related docs: pass — F18 "Node.js 22.12 or newer" at spec-kit README `:49`, F19 "Devin, OpenCode, and Pi" at runtime README `:26`, F20 9 categories, F21 "twenty-nine forms" at sk-doc README `:220`, F23 `changelog/` tree line at deep-loop runtime README `:25`; F22's body version line is deleted in the diff [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:183].
- F1–F23 completeness vs 023 Section 11: pass — all 23 rows exist in the ledger as `Fixed` with backticked proofs, and the DC-1 to DC-4 rows cover the 13c retirement [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170].
- RM-1: corroborated — the "Unknown command: …" template and its list-tools hint path exist in the advisor CLI (`skill-advisor-cli.ts:544,764,1574,1078`), and no README claims otherwise; the exact printed string cannot be reproduced without execution, so it stays corroborated-only.
- RM-2: pass — `pre-commit:919` carries the tool-ownership-map header, a CI-only note explains why there is no body, and `exit 0` follows; the README's ten-gate count is unaffected [SOURCE: .skilled/scripts/git-hooks/pre-commit:919].
- RM-3: pass — check 13a (`checkVersionParity`) requires `ROUTER.md` and the three JSON files to carry the SKILL.md version [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849]; the standard lists `ROUTER.md` as carrying its own edition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30]; and the bump engine raises a non-SKILL doc whose body changed [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409]. The row's open-conflict framing is accurate and already declared in Known Limitations.
- Parent packet rows: pass — phase-map row 24 and the 023→024 transition row are present and consistent [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:140]; the binding row and the "024 added" log row (criterion 1 = 25, criterion 2 stays 105 until the 024 summary completes) match the phase state [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:163].
- Commit agreement: pass — tasks T003–T005 map to the named SHAs, and the ledger's four product commits match the dispatch's commit list; the spec-docs commit is packet documentation, recorded as an edge case below.

## Integration Evidence

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (doctor surface): section 13 now names exactly `13a, 13b, 13d` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1842], and `checkVersionParity` compares `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` against `SKILL.md` — the check RM-3 names.
- `.skilled/scripts/git-hooks/pre-commit` (git-hooks surface): the 919 header plus CI-only note is the "empty header" RM-2 records; `exit 0` closes the file at 924.
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (sk-doc versioning engine): `bumpDocs` keeps non-SKILL docs in scope and raises the third segment on a body change — the behavior RM-3's conflict depends on.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (advisor CLI front door): `list-tools` is a reserved command with a hint path for unknown commands — the code RM-1's observation runs through.

## Edge Cases

- AC-001 to AC-004 and AC-006 are marked `Met` while the goal.md criteria they cite remain unchecked and T008 is pending; the ledger independently substantiates the underlying facts (23 Fixed rows, no changelog entries, no 13c line), so this is a state-timing nuance, not a finding.
- The summary's "Commits:" line lists the four product commits only; the spec-docs commit is named in the dispatch but not in the ledger — recorded, not a finding (product-delivery context).
- RM-2's "stale comment" label is loose: the 919–922 note reads as current CI-only documentation; the row's operative claims are accurate.
- The `8 categories` grep hit in `.skilled/skills/sk-code/benchmark/README.md:34` is an unrelated corpus line, outside the review target.

## Confirmed-Clean Surfaces

- Root README counts and the fixed anchors, re-derived from the tree: 11/37/41/7/20 and 111/35 all match.
- Related-doc fixes F18–F23 as applied (diff hunks and current files agree).
- Product diff scope: exactly the 15 files the ledger claims, no others.
- RM-2 and RM-3 operative claims; RM-1's code path and README silence.
- Parent packet rows for phase 24.

## Ruled Out

- Ledger counts vs the READMEs: zero residual stale values in scope (targeted scans over README.md and the related docs).
- F-row completeness: no 023 Section 11 row is missing from the ledger; every row is Fixed with a proof.
- Related-doc repeat staleness: no stale repeat remains in the docs this phase touched.

## Next Focus

- **Dimension:** security (the last unchecked dimension) — credential and auth wording in the changed surface: the ClickUp auth lines, the mcp-code-mode INSTALL-GUIDE frontmatter change and the `.env.example` cross-claim; confirm no changed doc leaks or implies credential values.
- **Carry-forward:** (a) `agent_cross_runtime` mirror closure — still blocked on mirror trees not materialized in this worktree; (b) the two iteration-4 P2s are doc-state fixes for the remediation step, not review blockers.

## Verdict

P2-only; no active P0 or P1. hasAdvisories=true.

Review verdict: PASS
