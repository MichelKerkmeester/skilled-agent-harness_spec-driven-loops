# Iteration 008 — Traceability: phases 010/011 spec versus code, and the parent goal criteria after the merge
BINDING: target=Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic (phases 002-011), the merge 144b1d339e and its 8 hand-resolved conflicts, then 9a74576ccc and 5d9c970447
BINDING: maxIterations=10; convergence=0.1; mode=review; dimensions=traceability; specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review

## Dimension
traceability — core spec_code and checklist_evidence plus the four overlays. Walked all 15 child implementation-summary.md files of `010-round-three-remediation` (7) and `011-round-four-remediation` (8) against the code on main and the live commands they name; reran the parent goal.md completion criteria from the current working tree (HEAD 5d9c970447 plus three tracked modifications plus the untracked 012 packet); inventoried every Known Limitations section and rechecked which ones later children closed; ran the criterion-5/6 mirror and drift surfaces live.

## Files Reviewed
| File | What was checked | Result |
|------|------------------|--------|
| `specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:92-94` | criteria 1-3 rerun live on the worktree | criterion 1: 11 PASSED / 2 FAILED (expected 13/0); criterion 2: 35 (expected 36); criterion 3: 0 and a dirty tree (expected 37 and clean) — R8-TRA-001 |
| 7 x `010-round-three-remediation/*/implementation-summary.md` | version, deletion, fixture, hook and count claims vs code | hold; exceptions: 010-001 limitation 5 remains a documented deviation (REQ-004/T125) |
| 8 x `011-round-four-remediation/*/implementation-summary.md` | the same | hold except 011-005's test count — R8-TRA-002 |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` | live `grep -c '^test('` and iteration 7 run | 12 tests declared, 12 pass; summary claims 10 total — R8-TRA-002 |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs:81` | `--root is not a directory` usage line, exit 2 | confirmed by read and test names 9-11 |
| `.skilled/skills/sk-code/hub-router.json:7` | tieBreak order | `quality, review, opencode, obsidian, webflow` — 011-003 order claim confirmed |
| `.skilled/skills/sk-code{,-review,-webflow,-quality,-opencode}/SKILL.md:1` | versions | 2.2.7.0 / 1.7.1.0 / 1.1.2.0 / 1.2.0.0 / 1.2.1.0, each matching the latest child claim |
| `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23`, `runtime/hooks/lib/hook-adapter-shared.mjs:17` | 500 ms constant | both 500 — 011-007 claim confirmed |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | 010-007 limitation 1 (excluded 16th reader) | `readSync` count 0 — limitation closed by 011-007 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:82`, `check-review-findings.js:22` | extra spaces after `Not checked:`; heading-shaped findings | confirmed; fixture set of four present |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs:7` | margin-aware parser | `parseIterationMarkdownFindings` present; limitation 4 of 010-006 closed by 011-006 |
| `.skilled/skills/sk-code/shared/` | deleted `assets/patterns` copies | directory absent |
| `010-.../001-shared-and-hub-docs/tasks.md:45,163` | T121 orchestrator evidence rerun | both sk-doc README suites exit 0 live (`manifest=reproducible`, `PARITY PASS`) |
| `.skilled/skills/sk-code/sk-code-webflow/**` | 010-004 limitation 1 (59 underscore labels) | 0 remaining underscore link labels — closed by 011-002 |
| `011-.../006-deep-loop-findings-parser/scratch/` | 011-006 limitation 3 (leftover `before/`) | `scratch/before` absent; nothing tracked below it |
| `.skilled/skills/system-deep-loop/.../check-agent-mirror-sync.cjs --all`; `.skilled/skills/system-spec-kit/.../sync-runtime-mirrors.cjs --check` | criterion 6 | exit 0: 12 agents in sync; 187 mirrors across 8 trees in sync |

## Findings by Severity
### P0 Findings
None.
### P1 Findings
None.
### P2 Findings
1. **R8-TRA-001 — The parent goal's completion criteria do not hold at the reviewed state (three of three fail as printed)** — [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:92]
   Criterion 1 (goal.md:92) expects `validate.sh --recursive --strict` to print `RESULT: PASSED` 13 times and `RESULT: FAILED` 0 times. Live run at HEAD 5d9c970447: exit 2, **11 PASSED / 2 FAILED**. Failing folders: the epic parent (3 errors — `SPEC_DOC_SUFFICIENCY`: goal durable slice 4054 chars > 4000; `GENERATED_METADATA_INTEGRITY`: graph-metadata.json `SOURCE_FINGERPRINT_MISMATCH`; `GENERATED_METADATA_DRIFT`: description drift) and `012-post-merge-deep-review` (2 errors — `GENERATED_METADATA_INTEGRITY` + `GENERATED_METADATA_DRIFT`, 1 warning; the validator names `repair-derived.cjs --folder ...` as the recompute).
   Criterion 2 (goal.md:93) expects 36; live `grep -lr --include=implementation-summary.md 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement | grep -vc /001-ponytail` prints **35**. The missing file is the 012 packet's own summary, still at scaffold `completion_pct: 0` (`012-post-merge-deep-review/implementation-summary.md`).
   Criterion 3 (goal.md:94) expects `git rev-list --count main..HEAD` to print 37 with a clean `git status --short`. Live: **0** and a dirty tree (3 modified spec files plus the untracked 012 packet). The statement that this criterion "no longer applies once the epic is on main" lives only in the volatile Log (goal.md:138), which the goal itself declares "not part of the directive"; the binding section still demands it.
   Case: a reader applying the goal verbatim to declare the epic done cannot get the printed evidence the goal requires.
   Finding class: completion-criteria traceability / packet metadata freshness (instance across one goal and two packets).
   Scope proof: the goal's own three commands run live this iteration; full validator output at `/tmp/validate-011.log` lines 8-18 (parent), 686-699 (012).
   Affected surface hints: ["specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md", "specs/sk-code/011-sk-code-poinytail-based-refinement/graph-metadata.json", "specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/implementation-summary.md"]
   Recommendation: re-derive the two folders' metadata (`repair-derived.cjs --apply`), cut the goal durable slice below 4000 chars, re-run both criteria to green, and either amend criterion 3's binding text to the post-merge state or move that clause to the Log; finish 012's summary only when the review actually completes.
   Severity rationale: no shipped-code defect (all functional gates rerun green this iteration), the repair path is documented, and part of the failure is the in-flight 012 packet; but the epic's own definition of done currently fails its three printed commands.
2. **R8-TRA-002 — The 011-005 implementation summary undercounts its own test suite: claims "10 in total", the live suite declares 12** — [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md:61]
   The summary's Files Changed row says "Four new test cases, 10 in total"; the 010-005 summary says "Six tests" (010-.../005-opencode-and-guards/implementation-summary.md:61). Live: `grep -c '^test(' .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` prints **12**, and iteration 7 executed the suite as 12 pass / 0 fail. 6 + 4 = 10 does not account for two of the twelve top-level cases.
   Case: a later reader auditing claim coverage from the summaries undercounts the suite by two; the "Four new test cases" attribution cannot be reconciled with the live file from the summaries alone.
   Finding class: spec/code count drift (one file, two summaries).
   Scope proof: live count plus the twelve `^test(` names; iteration-007.md table row "12 pass, 0 fail".
   Affected surface hints: [".skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs", "011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md"]
   Recommendation: correct the count (or the "10 in total" phrase) in both summaries, or name the two extra cases so the summary arithmetic closes.

## Traceability Checks
- core `spec_code`: **partial** — all 15 phase-010/011 child summaries walked against code on main; two mismatches registered (R8-TRA-001 for the parent goal; R8-TRA-002 for the suite count). Every other spot check held (versions, deletions, hook constants, parser, routes).
- core `checklist_evidence`: **partial** — T121's orchestrator evidence re-verified live (both sk-doc README suites exit 0); T125's deviation re-confirmed as documented at `010-.../001-shared-and-hub-docs/spec.md:141` and `tasks.md:194`. Per-task re-runs across all 15 children were not repeated at this budget.
- overlay `skill_agent`: **partial** — the five sk-code-family SKILL.md versions and the hub release chain (2.2.5.0 → 2.2.6.0 → 2.2.7.0) confirmed; canary pin set read but not re-run.
- overlay `agent_cross_runtime`: **covered** — `check-agent-mirror-sync.cjs --all` exit 0 (12 agents in sync); `sync-runtime-mirrors.cjs --check` exit 0 (187 mirrors, 8 trees).
- overlay `feature_catalog_code`: **not covered** — planned for iterations 9/10.
- overlay `playbook_capability`: **partial** — the two playbook-root overview additions and the surviving `document_type_fallback` warnings confirmed from summaries and validators; capability walk stays for the follow-up.

## Known Limitations — what the summaries leave open
- Closed by later children or the orchestrator (verified live): 010-004 #1 and #4 (underscore labels: 0 left; Webflow playbook root now has its overview), 010-005 #1-#5 (doc-claims labels/anchors/`--root`/semicolons fixed by 011-005), 010-006 #4 (parser follow-up built by 011-006), 010-007 #1 (16th reader fixed by 011-007), 010-001 #1-#3 (compiled manifest fresh, both README fixtures exit 0, both mirror checks exit 0).
- Open and documented, no finding: 010-001 #5 — REQ-004 and T125 still read as a literal check that cannot pass; the REQ row was amended after the build (spec.md:141) and T125 records the deviation, so intent and records agree while the task's literal command stays false.
- Open by design (residual risk, already visible where noted): 011-001 #1 label pins catch renames not rewrites; 011-003 #1 archived route-gold not rebuilt and #2 jev canary red (registered R6-COR-001); 011-004 #2-#3 unmapped Obsidian checklists and no playbook scenario; 011-005 #1 rare heading forms unresolved; 011-006 #1 F### restated under a different id counts twice; 011-007 #1-#4 host-timeout races and the overflow path; 011-008 #1 hint not enforced for a caller that omits the flag and #3 null-options throw; 010-003 #3-#5 kept schema/keyword/legacy items and reconstructed baselines.

## Confirmed-Clean Surfaces
- All four criterion-5/6 functional gates rerun green this iteration: compiled-route-guard exit 0 with sk-code `fresh`; the route probe returns `"action":"route"` with no `servingAuthority`; both mirror checks exit 0; both sk-doc README suites exit 0. Iterations 6 and 7 already reran check-rule-copies and the four drift guards green.
- Version chain across the five sk-code SKILL.md files matches the newest child claims exactly; hub-router tieBreak reads quality → review → opencode → obsidian → webflow.
- `verified at the reviewed commit range`: the 37-commit range and the merge are present in history; the two post-merge commits (9a74576ccc, 5d9c970447) are documentation/index-only.
- Comment hygiene: no comment in the walked files embeds a spec path, packet number or task id; spec-path literals appear only in code constants and fixture paths reported by prior iterations.

## Ruled Out
- "011-002's 59-label repair is incomplete": live `rg` finds 0 remaining underscore-form link labels under `.skilled/skills/sk-code/sk-code-webflow` (changelog excluded).
- "010-001 limitations 1-3 still open": disproved by the live guard run, both fixture suites, and both mirror checks (see Files Reviewed).
- "010-007's excluded sixteenth reader still blocks": `readSync` is gone from `claude/user-prompt-submit.ts`.
- "011-006 left `scratch/before/reduce-state.cjs` in the packet": `scratch/before` is absent and nothing under it is tracked.
- "The 011 children's version claims are stale": all five SKILL.md versions match the newest summary claims.

## Not Proven
- Whether the parent folder's three validation errors also exist at the committed snapshot. `validate.sh` reads the working tree, which carries three tracked modifications (goal.md, spec.md, graph-metadata.json) and the untracked 012 packet; validating the committed state would require modifying or duplicating the tree, outside this iteration's write scope.

## SCOPE VIOLATIONS
None. No file outside the three allowed state artifacts was written; the reviewed tree was read-only.

## Next Dimension
- Iteration 9: maintainability — sk-code docs commits ceb8ff216c, 52c31dcc12, f3377faef9, bcf0dfa653, 16641fcf05, 644cabc980; known items: 36 HVR hard blockers in sk-code SKILL.md and the advisor battery 13/17 with 2/5 false positives.
- Iteration 10 (last): traceability — agents, repo rules and runtime mirrors: 3617968e35, 8fdb66cc1b, 864a3bccd8, 40fc64d9cd, b5927055b0.

## Verdict
Two new P2 findings, no P0 and no P1 this iteration. The phase-010/011 child summaries are almost entirely faithful to the code on main; the residue is the parent goal's own completion criteria failing as printed (R8-TRA-001) and one suite-count claim mismatch (R8-TRA-002). Per the severity mapping, P2-only yields PASS.

Review verdict: PASS
