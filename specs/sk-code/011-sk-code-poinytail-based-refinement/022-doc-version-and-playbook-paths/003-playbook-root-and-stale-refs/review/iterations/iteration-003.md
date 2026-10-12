# Deep Review — Iteration 003 (D3 Traceability)

- Run: run-001 · Session: 2026-10-12T10:01:23.529Z · Generation 1 · Lineage: new
- Target: the playbook root and stale reference commits `b4d4e90192..HEAD` on `worktrees/121-playbook-root-refs` (56 files), verified against the ledger in `implementation-summary.md` and the parent binding

## Dimension

Traceability. The dispatch carried four questions: (1) does every ledger row RR-1, RR-2.01–RR-2.13 and SR-1–SR-6 trace to an actual change, and does its proof command print what the row claims when run; (2) do the child `goal.md` completion criteria each print what they claim; (3) is RM-1 justified; (4) do the parent 022 goal criteria counts (57 ledger rows, 3, 3, 4 PASSED) match the tree.

## Files Reviewed

- `specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md` (criteria at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57] through `:63`), `acceptance-criteria.md` ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md:54]), `implementation-summary.md` (ledger [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:79], RM-1 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:106]), `spec.md`, `tasks.md` ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/tasks.md:54])
- Parent binding: `specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md` (continuity [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:24], criteria [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:81], log [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:104]), `spec.md` ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/spec.md:23], phase map [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/spec.md:97])
- Package proofs: the 13 root `manual-testing-playbook.md` files via `validate-playbook-package.cjs --strict --package`; SR targets: `cli-codex/references/codex-tools.md`, the 14 sk-vision feature-catalog files, the cli-cursor root and its two hook scenarios, the DAC-002 scenario, `sk-design-diagram/references/import-export/export.md`, the doctor update test environment scenario
- RM-1 citations: cli-cursor root playbook [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:361], scenario [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15], 002 RM-1 row [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md:117]
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md` (severity doctrine)

## Findings by Severity

### P0 — none

No P0 findings this iteration.

### P1 — none

No P1 findings this iteration.

### P2

#### R3-P2-001 [P2] Parent continuity claims completion while its own criteria are unchecked and pending

- **Case:** an operator or resume automation reads the parent packet's continuity and sees it integrated and complete — `completion_pct: 100`, `recent_action: "Integrated both children and raised the repaired docs"`, `next_safe_action: "Operator review of the integration branch, then merge to main"` ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:24], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/spec.md:23]) — while the same goal's completion criteria are unchecked and its own criterion 2 cannot print the claimed 3 on this tree, and the parent spec phase map says phase 3 is In Progress ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/spec.md:97]).
- **File:** [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:24] (completion_pct), [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:81] (criterion 2), [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md:23] (003 at 90).
- **Evidence (OBSERVED):** the pre-image at `b4d4e90192` carried checked criteria (37 / 2 / 2) and parent spec `**Status** | Complete`; scaffold commit `d8188fdf35`, inside this diff, added 003 to the binding table, reset the goal criteria to unchecked (57 / 3 / 3 / 4), and set the parent spec to In Progress — but neither file's continuity block was updated. Measured on the tree: criterion 1 prints **57** ✓, criterion 2 prints **2** (claim: 3) ✗, criterion 3 prints **3** ✓, criterion 4 exits **0** ✓, criterion 5 prints **4 PASSED / 0 FAILED** ✓; `grep -l 'completion_pct: 100'` over the child summaries returns 001 and 002 only, 003 is at 90. Residual "two children"/"two phases" wording survives at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/goal.md:48] and [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/spec.md:59] after the same commit declared three build phases.
- **Counterevidence sought:** whether `completion_pct: 100` denotes only the 001+002 integration milestone. The same goal's criterion 2 counts all three children's summaries and the parent spec now says "three build phases", so the field reads as whole-packet state; the residual "two" wording supports the milestone reading but does not make the 100 true of the packet.
- **Alternative explanation considered:** continuity may intentionally lag until 003 closes. That is the remediation, not a defense: until it happens the goal doc contradicts itself and any consumer of `completion_pct` reads the parent as done while criterion 2 fails.
- **User impact:** low, docs-only, no runtime or checker effect; the resumed-state and merge-readiness signals mislead by one phase.
- **Finding class:** instance-only (two continuity blocks, one root cause in the scaffold commit).
- **Scope proof:** `grep -rn 'completion_pct'` over the parent folder places a 100 only in the parent goal and spec continuity blocks plus the two legitimately complete children; the 003 summary is the sole 90.
- **Affected surface hints:** ["parent goal continuity", "parent spec continuity", "scaffold commit d8188fdf35"]
- **riskScore:** 2 (advisory only)
- **Confidence:** high (pre-image vs post-image diff plus the five measured criteria).
- **Upgrade trigger:** any gate or automation that consumes `completion_pct` to mark the parent complete without running the criteria → P1. **Downgrade trigger:** none below P2; leaving it unfixed keeps the parent doc pair self-contradictory.
- **Recommendation:** set parent `goal.md` and `spec.md` continuity to the current true state (completion near 90, recent action "003 build reviewed; awaiting closure and integration") and restore 100 only after the five criteria pass; optionally refresh the D2/"two phases" wording to three children.

## Verified Clean (ruled out this iteration)

1. **Every ledger row traces to an actual change (OBSERVED).** The 56-file diff carries each row's target: RR-1 → `validate-playbook-package.cjs` plus its test; RR-2.01–RR-2.13 → exactly 13 root `manual-testing-playbook.md` files; SR-1 → `codex-tools.md`; SR-2 → 14 sk-vision catalog files; SR-3 → cli-cursor root plus two hook scenarios; SR-4 → the DAC-002 scenario; SR-5 → `export.md`; SR-6 → the doctor scenario; plus the declared sk-doc 2.3.9.0 release surfaces (SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json, changelog, `.hermes` mirror, compiled manifests).
2. **Every proof command re-run prints what its row claims (OBSERVED).** All 13 `--package` runs exit 0: 12 print 0 `BACKTICK_PATH_UNRESOLVED`; cli-cursor prints exactly the 2 its row declares (root RM-1 at `:361` plus 002's scenario RM-1). SR-1: 0 stale lines, 4 `.codex/config.toml` successor lines. SR-2: 0 stale files, 14 successor files. SR-3: 0. SR-4: exit 0, `1 passed | 21 skipped`, old binary absent under `system-spec-kit/runtime`. SR-5: 0. SR-6: `ls` prints 6 and the scenario now says "the six".
3. **All seven child goal criteria print their claimed output (OBSERVED).** 1 → `n=1 m=1 r=1` then `ok`; 2 → `20`; 3 → `0` and `0`; 4 → `ok`; 5 → `0`; 6 → exactly `.skilled/skills/sk-doc/changelog/v2.3.9.0.md`; 7 → `RESULT: PASSED`.
4. **Parent criteria match the tree except criterion 2 (OBSERVED).** 57 / **2** / 3 / exit 0 / 4 PASSED 0 FAILED. The single mismatch is the honest pending state of 003 (completion_pct 90) and is filed above as the continuity contradiction, not as a criterion defect.
5. **RM-1 is justified (OBSERVED).** `.cursor/worktrees.json` is absent from the repo; the root playbook cites it at `:361`; the scenario deliberately checks whether it is present or absent without creating a worktree ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:15]); 002's Remaining row names the same path ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md:117]). Keeping the row is the correct narrowest change.
6. **RR-2.07 edit arithmetic reconciles (OBSERVED).** The mcp-click-up root diff is 47 changed lines = 38 catalog rows + 7 cupt module rows + version line + explanatory line; the spec's "37 files" versus the ledger's "38 rows" reconciles as distinct-files versus edited-rows. The baseline "44" is the builder's pre-change measurement and is not independently reproducible on this tree because the root check did not exist at `b4d4e90192`; its successor claim (`--package` run prints 0) is observed.
7. **RR-1's revert counterfactual was not re-executed, by design.** Its proof includes reverting the validator line, which would modify the frozen review target; the iteration 1 derivation (zero root-scan call sites at the parent, so the new assertion fails without the change) is unaffected by this iteration's read-only constraint. The positive half (test exits 0) was re-run via goal criterion 4.
8. **PROMPT_UNSYNCED noise is pre-existing and out of scope.** The validator prints 3 such lines for cli-codex, 19 for mcp-click-up and 9 for sk-design-chart; all sit in root↔scenario prompt pairs this phase did not touch, and the strategy's non-goals declare non-path root drift out of scope. No finding.

## Traceability Checks

- **core `spec_code` — pass (OBSERVED).** All seven child goal criteria ran verbatim and print their claims; parent criteria 1, 3, 4 and 5 pass (57, 3, exit 0, 4 PASSED / 0 FAILED) and criterion 2's pending 2 is explained and filed.
- **core `checklist_evidence` — pass (OBSERVED).** Every RR/SR ledger row was traced to a changed file and its proof re-executed where the command is replayable; the one non-replayable counterfactual (RR-1 revert) is derived from the unchanged pre-image, and the ledger's own evidence rows match.
- **overlay `playbook_capability` — pass.** The 13 packages exit 0 with the warning counts their ledger rows claim.
- **overlay `feature_catalog_code` — pass.** SR-2's 14 catalog files all carry `hooks/pi/sk-vision.ts`; no stale short form remains.
- **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified; no other cross-runtime contract changed this iteration.
- **overlay `skill_agent` — partial.** Criterion 6 pins the only added changelog to sk-doc v2.3.9.0; the release value/mirror surfaces were audited in iterations 1–2 and were not re-audited here.

## Evidence Log

| # | Check | Command (verbatim where practical) | Result (OBSERVED) |
|---|-------|------------------------------------|-------------------|
| 1 | Child criteria 1–7 | commands from `goal.md:57-63` | ok / 20 / 0,0 / ok / 0 / one changelog path / `RESULT: PASSED` |
| 2 | Parent criteria 1–5 | commands from parent `goal.md:81-85` | 57 / 2 / 3 / exit 0 / 4 PASSED, 0 FAILED |
| 3 | Package proofs | `validate-playbook-package.cjs --strict --package <p>` ×13 | all rc=0; 12 × 0 unresolved; cli-cursor 2 (its documented pair) |
| 4 | SR-1 | `grep -c 'codex/settings.json' codex-tools.md` | 0 stale, 4 successor |
| 5 | SR-2 | `grep -rlE '^.{3}pi/sk-vision' ... \| wc -l` | 0 stale, 14 successor |
| 6 | SR-3 | `grep -rE "Phase [0-9]{3}'s" ... \| wc -l` | 0 |
| 7 | SR-4 | vitest `-t "council deliberation"` | rc=0, 1 passed, 21 skipped; old binary absent |
| 8 | SR-5 | `grep -c 'assets/index.html' export.md` | 0 |
| 9 | SR-6 | `ls doctor-update-*.yaml \| wc -l` | 6; scenario says six |
| 10 | RM-1 | `test -e .cursor/worktrees.json` | absent; scenario checks presence/absence by design |
| 11 | Change set | `git diff --name-only b4d4e90192..HEAD` | 56 files, maps to rows + declared release surfaces |

## Verdict

No P0 or P1 findings this iteration. One new P2 (R3-P2-001) joins the still-open R1-P2-001 and R2-P2-001; all three are advisory. The traceability dispatch answers clean on observed evidence: every ledger row traces and its replayable proof prints its claim, all seven child criteria and four of five parent criteria pass, and RM-1 is justified.

## Next Dimension

security, then maintainability.

Review verdict: PASS
