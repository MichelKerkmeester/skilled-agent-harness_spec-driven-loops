# Focus

Final iteration: close Q3 with per-phase executability verdicts, adversarially re-verify every prior P0/P1, and independently sweep skill-folder readers and writers for Q1 coverage.

# Actions Taken

- Read the strategy, lineage config, prior iterations and phase task/acceptance files. The run session is 2026-10-23T08:24:54Z; the repository HEAD is 63477170833a096358ad0655f2dbd972954cb7a2.
- Re-ran the tracked-file search with fsmonitor disabled. It exited 0 and returned 1,303 paths: 1,123 under specs/, 174 under .skilled/ and 6 under .hermes/. This reproduces the broad baseline; it is not the filtered 93-file phase-002 T003 count. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:59] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md:122]
- Probed the phase-002/003 regex form against both surface names. The escaped-pipe form returned no matches; the unescaped alternation matched both names. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:54] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:54]
- Re-read the prior P0/P1 source lines and ran the documented grep/count and regex checks against the current repository. The 10 dispositions are below.
- Ran an independent code search for directory enumeration and graph-metadata consumers. No implementation files or phase docs were changed. This was a research-only pass; no tests were run.

# Findings

## Gateway projection discrepancy

**CONFIRMED.** The required append gateway returned exit 0 and committed iteration 5. Its refreshed state-log line records the iteration summary but omits runId, sessionId, lineageId and answeredQuestions; the canonical ledger frame retains runId and lineageId in its scope. The full submitted record, including all three identity fields and exact answered questions, is in the delta. No direct state-log edit was made. [SOURCE: specs/sk-code/013-private-surface-skills/research/deep-research-state.jsonl:8] [SOURCE: specs/sk-code/013-private-surface-skills/research/deep-research-ledger/frames/0000000000000008.frame:1] [SOURCE: specs/sk-code/013-private-surface-skills/research/deltas/iter-005.jsonl:1]

**INFERRED.** The projection may rely on the delta for question answers, but the state-log row does not match the full schema in this iteration prompt. The workflow projection or its validator contract needs reconciliation before state-log-only recovery can be relied on.

## Q3 — executability by phase

**DOCUMENTED — Phase 001: not fully executable under the five-part test.** Implementation tasks name their files and give proof commands, but T013 combines a symlink ignore probe with cleanup in one task. The five-part contract also fails because the task list has no consistent task-to-AC map or task-level rollback. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:132] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:135] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:137]

**DOCUMENTED — Phase 002: not fully executable under the five-part test.** Most edits name a concrete file, but T026 and T027 each group two deletions, T060 uses a broad Hermes path glob, and T063 groups suites with a live routing probe. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:163] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:167] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:311] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:326]

**DOCUMENTED — Phase 003: implementation tasks are mostly executable with their plan, but the phase does not satisfy all five criteria.** Tasks carry concrete targets and proving commands. T002 defers eleven baseline commands and later summary writing, T027 re-runs those commands plus validation, and T030 stages, commits and pushes; none has a per-task rollback, and AC mapping is not consistent. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:39] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:128] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:131]

**DOCUMENTED — Phase 004: the detailed edit catalogue makes individual edits executable, but not every task is atomic.** T007 applies six catalogue edits across three files; T008 rewrites every matching file of five extensions across both private roots. Neither task has an individual AC mapping or rollback. [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:54] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:55]

**DOCUMENTED — Phase 005: most evidence tasks specify a target file and proof, but the phase is not fully executable as written.** T005 retains an unresolved path placeholder; T008 combines a database rebuild, SQL query, three routing probes and link/mode recording; T012/T013 depend on findings produced by a separate reviewer. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:69] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:88] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:122] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:129]

A search across the five task files found AC-ID references only in two phase-005 review/completion tasks and no task-level rollback entries. Therefore no phase gives every task the full combination of exact file, one change, proof command, AC mapping and rollback, even where the work itself is otherwise well specified. The task writer still needs phase plans and acceptance criteria for context. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:122] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:141]

**Additional vague or compound tasks not named in iteration 003:** phase 001 T013; phase 002 T026, T027, T060 and T063; phase 003 T003 couples a new test with an import change; phase 004 T007 and T008; phase 005 T004 combines three different sweeps, T008 combines several live probes, and T013 is a finding-dependent repair task. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:132] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:163] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:311] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:60] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:54] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:55] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:60] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:88] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:129]

## Independent Q1 gap sweep

**CONFIRMED — additional runtime reader.** The Python advisor’s _load_source_conflict_declarations scans every immediate child of SKILLS_DIR, opens its graph-metadata.json and reads edges.conflicts_with; it has no local-* name filter. The scorer calls this reader during conflict handling. Phase 003’s inventory names the graph walker, source freshness scan, compiler, Hermes sync, root-metadata gate and doctor read, but not this Python runtime reader. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1265] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1275] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1295] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1695] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:123]

**DOCUMENTED — current local metadata has no conflict declarations.** Phase 004’s field table gives both local skills empty edges.conflicts_with arrays. This means the newly found reader does not establish a present routing change or public leak. [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/plan.md:232]

**INFERRED — P2 coverage gap.** Add the Python reader to phase 003’s inventory and either exclude local-* roots from this public graph check or add a regression proving the intended behavior. Current metadata makes the immediate route effect unlikely; a run with the completed private trees and Python runtime is what would confirm it. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:123] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/plan.md:232]

**CONFIRMED — screened CI walker.** ci-leaf-manifest-freshness.cjs recursively searches under skillsDir for leaf-manifest.json without a local-* exclusion. The phase-004 source-tree inventory found no leaf-manifest.json in either source skill tree, so this sweep did not establish a current migration effect. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:78] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:89] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:152]

## Adversarial re-verification of prior P0/P1 findings

1. **DOWNGRADED from P1 — iteration 001, f-iter001-001.** The current trigger index has 200 matches for the four removed/local surface tokens, with the observed matches in old Webflow/Obsidian source paths. T007 is evaluated after the CI rebuild, so the current pre-removal index does not prove a retained-spec self-match. Keep T007’s post-rebuild check; lower the self-match hypothesis until a rebuilt index demonstrates it. [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:948] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:81]

2. **UPHELD — iteration 002, f-iter002-001.** The fresh broad tracked grep remains 1,303 paths; the 93 baseline is filtered differently, and the four generated retrieval artifacts remain explicitly deferred. Amend phase 002 tasks.md and plan.md to state the count scopes and exceptions. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:59] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md:122]

3. **UPHELD — iteration 002, f-iter002-004.** The planned statSync-based follow of local-* symlink targets has no path containment; a link can point outside the checkout. Amend phase 003 plan.md to define allowed target roots and prove that tracked writers do not follow private links. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:61] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:733] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:126]

4. **UPHELD — iteration 003, f-iter003-001 (P0).** The controlled probe confirmed that the escaped pipe is literal in rg’s regex dialect. Replace it with unescaped alternation in phase 002 acceptance-criteria.md and phase 003 acceptance-criteria.md. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:54] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:54]

5. **UPHELD — iteration 003, f-iter003-002.** Task files still lack consistent AC-ID mapping and task-level rollback; this is a documentation finding rather than an observed implementation failure. Amend all five phase tasks.md files with per-task AC mapping and a reversible step or explicit no-rollback rationale. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:132] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:311] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:131] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:58] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:124]

6. **UPHELD — iteration 003, f-iter003-003.** The listed compound tasks remain in the current files. The per-phase additions above are further examples; split tasks or enumerate all target files and separate proofs. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:172] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:128] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:53] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:160]

7. **UPHELD — iteration 003, f-iter003-004.** T005 still contains the literal placeholder. T012 uses grep -c "^| AC-", which counts the AC-ID header as well as the eleven criterion rows, yielding one extra row. Replace the placeholder with the ten explicit paths and restrict the grep to numbered AC IDs. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:69] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:124] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:52]

8. **UPHELD — iteration 004, f-iter004-001.** Path/content sweeps occur before T017; the final push task checks status and SHA but does not re-run the sweeps against the final public tip or all generated sidecars. Amend phase 005 tasks.md and acceptance-criteria.md with a post-T017 fresh-clone sweep. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:81] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:160] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:56]

9. **UPHELD as a proof limitation — iteration 004, f-iter004-002.** T004 proves absence of named paths and surface markers. It cannot prove absence of arbitrary private bytes copied under different names; add a reachable-blob comparison for complete files, and name a separate policy for partial-content scans if those are in scope. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:60]

10. **UPHELD as a test-coverage gap — iteration 004, f-iter004-003.** T008 still runs routing checks only in the operator’s main checkout. The Obsidian Plugin dependency is documented, but its active checkout path and symlink targets remain unknown. Amend phase 005 tasks.md and acceptance-criteria.md to run link and route probes from that checkout. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/README.md:75] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:67] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:88]

## Amendment targets

- **P0 — phase 002 acceptance-criteria.md and phase 003 acceptance-criteria.md:** replace escaped-pipe alternations in every leak proof.
- **P1 — phase 002 tasks.md and plan.md:** reconcile the 93-file scoped baseline with the 1,303-path broad grep and list the four generated deferrals.
- **P1 — phase 003 plan.md:** define trusted local-* symlink target roots and show tracked outputs cannot follow private targets.
- **P1 — all five phase tasks.md files:** add per-task AC links and task-level rollback or a reason rollback does not apply.
- **P1 — phase 005 tasks.md and acceptance-criteria.md:** resolve T005’s ten-path placeholder and T012’s row count; rerun final-public-tip sweeps after T017; compare private blobs against public reachable objects; add the Obsidian Plugin checkout probe.
- **P2 — phase 003 plan.md and tasks.md:** inventory the Python advisor’s source metadata reader and test the intended treatment of local-* conflict data.
- **P2 — phase 005 spec.md and tasks.md:** retain the read-only inventory for reachable tags/releases and the live Obsidian Plugin checkout; those external contents remain unknown.
- **P2 — workflow output contract, outside packet 013:** reconcile the gateway's summary-only state-log projection with the required identity and answeredQuestions fields.
- **No amendment supported yet — phase 005 tasks.md T007:** keep the post-CI check; the current pre-removal index does not establish that the packet self-matches.

# Questions Answered

- Q1 Leak coverage: which tracked or generated surfaces that can carry or route sk-code-webflow / sk-code-obsidian (or a local-* private skill) does packet 013 miss? Check the committed trigger index, Hermes sync and .hermes/skills, runtime mirrors, compiled routing and activation manifests, skill-graph.json from --export-json, the advisor DB and scorer vocabulary, OpenCode plugins (system-skill-advisor.js surface detection), doctor checks, description / graph-metadata / changelog / README generators, CI artifacts, and the pre-commit and pre-push hooks.
- Q3 Executability by a DeepSeek writer: does every task name exact files, make one change, carry a proving command, map to acceptance criteria and a rollback? Which tasks are vague?

# Questions Remaining

- **UNKNOWN:** The active Obsidian Plugin checkout path and actual symlink targets were not verified. [SOURCE: specs/sk-code/013-private-surface-skills/research/iterations/iteration-004.md:113]
- **UNKNOWN:** Reachable tag trees and hosted release assets were not inventoried. [SOURCE: specs/sk-code/013-private-surface-skills/research/iterations/iteration-004.md:119]
- **Partial:** Phase 005’s current proof still lacks a final-public-tip sweep and arbitrary-byte comparison, as recorded above.
- The refreshed state-log summary omits stable identity and answeredQuestions even though the gateway accepted the full record; this projection discrepancy is recorded above.

# Next Focus

This is iteration 5 of 5; no sixth iteration is available in this run. A future research run should start with the actual Obsidian Plugin checkout and reachable tag/release inventory, then carry the phase 005 proof amendments forward.
