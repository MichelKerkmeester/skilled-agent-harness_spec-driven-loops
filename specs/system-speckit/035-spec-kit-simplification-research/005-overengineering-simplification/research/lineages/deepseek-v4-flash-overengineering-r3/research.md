# Deep Research Synthesis — deepseek-v4-flash-overengineering-r3 (ROUND THREE)

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | lineage: deepseek-v4-flash-overengineering-r3 | generation 1 | executions: 5/5 | stopReason: **maxIterationsReached** | convergence: telemetry only (threshold 3 unreachable on a 0..1 scale; per dispatch instructions convergence is not a stop signal and no early convergence occurred — exactly 5 iterations, one angle each, in the mandated order)

Source lineages: `glm-5-3-flash-overengineering` (round one, 10 iterations) and `deepseek-v4-flash-overengineering` (round two, 10 iterations); census: `research/confirmed-findings.md` (read once in iteration 1). Every confirmed row of both rounds was remediated in 011/012/017; nothing below re-reports a census-fixed/kept/recorded row, and no earlier count was reused — all counts were measured in this run against the checked-in source (dist/ untracked and stale, never read; no node/validate/git executed; no writes outside the lineage directory).

Scope of this round: angles the first two rounds covered thinly or not at all — rule-level value by registry row, command-surface step overlap, references-corpus reachability, neighbour-skill coupling.

# Defect-and-simplification ledger (19 findings: 1 P1, 18 P2)

## Angle 1 — Rule value, registry rows 1-12 (iteration 1)

**F3-01 [P2] FILE_EXISTS / LEVEL_MATCH — one defect class, two rows.**
- Claim: registry row 1 "Validates required spec documents for the declared documentation level" (validator-registry.json) and row 21 "Checks required files match the declared documentation level". Actual: two rows, two scripts (check-files.sh 106 lines vs check-level-match.sh 254 lines + utils/template-structure.js) with no registry-visible split. check-level-match.sh's header (1-12) carries no Rule/Severity/Description block at all, so the code cannot explain the difference either.
- Severity: P2. Recommendation: **merge** (verify behaviorally; if distinct, re-describe both rows and fix the header).

**F3-02 [P2] FRONTMATTER_MEMORY_BLOCK / FRONTMATTER_VALID — two validators over one document zone, split undocumented.**
- Claim: row 10 (ts) validates "canonical _memory continuity frontmatter blocks"; row 19 (script) "YAML frontmatter structure and required semantic values". Actual: disjointness by object (generated _memory payload vs authored top-level frontmatter) is plausible from the headers (check-frontmatter.sh:8-11) but stated in neither; nothing in either header names the other surface.
- Severity: P2. Recommendation: **document** (one line each) — or merge if the scans turn out to overlap.

**F3-03 [P2] check-files.sh header omits Level 2 and the closure document.**
- Claim: header lines 9-13 enumerate only "Level 1: spec.md, plan.md, tasks.md" and "Level 3: Level 2 + decision-record.md". Actual: post-011 the L2+ distinguishing document is acceptance-criteria.md; a level table that never names it cannot guide a reader (or, if the body omits it too, the rule is wrong).
- Severity: P2. Recommendation: **fix** the comment per body (or body per contract).

Verified correct (rows 1-12): every row has ≥1 test file naming its id (FILE_EXISTS 9, PLACEHOLDER_FILLED 4, COMMENT_HYGIENE_MARKER 1, SCAFFOLD_NEVER_TOUCHED 2, STATUS_CROSS_DOC_CONSISTENCY 1, LEVEL_DECLARED 3, AC_COVERAGE 1, AC_CLOSURE 1, ANCHORS_VALID 7, FRONTMATTER_MEMORY_BLOCK 2, MERGE_LEGALITY 2, SPEC_DOC_SUFFICIENCY 1) — no row 1-12 has both an overlapping sibling and no test; the placeholder/hygiene dual-lane splits are documented in their headers; census-kept rows (F6 level/AC info rows, F8 ts five-rule family) were not re-reported.

## Angle 2 — Rule value, registry rows 13-39 (iteration 2)

**F3-04 [P2] Metadata family: 8 rows over 2 files; the strict bridge re-implements the shell rows.**
- Claim: validation/generated-metadata-integrity.ts:3-6 — the strict bridge validates description.json and graph-metadata.json "through the shared schemas plus the path-prefix and status-enum invariants". Actual: check-graph-metadata-shape.sh (row 25, warn), check-description-shape.sh (row 27, warn, 0 tests) and check-metadata-disk-consistency.sh (row 26, error) claim overlapping invariants over the same two objects; only the enforcement layer and grandfather mode differ.
- Severity: P2. Recommendation: **merge** (one schema checker; retire/fold the three shell rows) or name the split in each header.

**F3-05 [P2] check-spec-doc-integrity.sh (row 29) violates the rule-script header convention.**
- Claim: registry row 29, severity error. Actual: header (1-8) has no Rule/Severity/Description block, no "Sourced by validate.sh" line, no rule id — the only such script among the 20 headers read; first substantive line shells to `git rev-parse`.
- Severity: P2. Recommendation: **fix** (header per convention or explicit standalone marker; state the git dependency).

**F3-06 [P2] Six rule ids named by zero test files: TOC_POLICY, AI_PROTOCOLS, GRAPH_METADATA_CHILD_IDENTITY, DESCRIPTION_SHAPE, SPEC_DOC_INTEGRITY, IMPROVEMENT_ARTIFACTS.**
- Claim/test: the id-string grep over runtime/cli/tests + runtime/tests returned 0 for each; 33 of 39 rows have ≥1 naming test (TEMPLATE_SOURCE's 39 is an env-var-string inflation; counts are id-string based, behavior tests could exist without the string — caveat stands).
- Severity: P2. Recommendation: **fix** (naming test or fold into a family test).

**F3-07 [P2] ANCHORS_VALID (row 9) and GREP_CONVENTION (row 20) both validate anchor grammar.**
- Claim: row 9 "anchor syntax, pairing, order, and uniqueness"; check-grep-convention.sh:8-11 includes "anchor grammar" in the greppable-corpus convention. Actual: two surfaces (orchestrator native vs validate.sh shell; 7 vs 1 test files) split by execution layer only; neither header names the other.
- Severity: P2. Recommendation: **document** the layer split, or **merge**.

**F3-08 [P2] The error-severity children_ids checker is the untested one.**
- Claim: check-graph-metadata-child-identity.sh:3-8 guards stale rename residue ("the writer ... previously never dropped those entries" — the non-self-healing half); 0 naming tests. Sibling check-graph-metadata-child-drift.sh (warn, flag-gated): 1.
- Severity: P2. Recommendation: **fix** (rename-residue fixture test).

**F3-09 [P2] check-canonical-save.sh:5-7 grandfather windows expired 2026-05-01 (today 2026-09-07).**
- Claim: "Temporary rollout allowlist expires at 2026-05-01T00:00:00Z; save_lineage enforcement becomes hard ... on/after 2026-05-01T00:00:00Z". Actual: body unread (header-only mandate) — if the time branches still execute, they are four-month-dead code; if graduated, the comment is stale.
- Severity: P2. Recommendation: **verify then merge** (graduate or delete the window branch; fix the comment).

Verified correct (rows 13-39): the children trio (DRIFT/IDENTITY/SHAPE) is not redundant — each header names a distinct condition and the same documented writer semantics; canonical-save's five-rows-one-script shape is the census-kept F8 with per-row failure attribution still stated; acceptance pair stands; command and template-origin rules (COMPLEXITY_MATCH, FOLDER_NAMING, TEMPLATE_SOURCE, TOC_POLICY) name distinct defect classes. F3-02 resolved toward "undocumented split" (downgraded from duplication), and F3-01 gained the check-level-match.sh header evidence.

## Angle 3 — Command surface step overlap (iteration 3)

**F3-10 [P2] /speckit:complete is the union of plan and implement plus two steps.**
- Claim: complete-auto.yaml:622,651,681,728,886,926,948,969,1078,1155,1201 vs plan-auto.yaml:494,515,522,558 and implement-auto.yaml:590,626. Actual: 12 of complete's 16 step names exist verbatim in plan or implement with identical order; only 5_acceptance_criteria(742), 11_acceptance_verify(1047) and the two autopilot steps are unique. Every contract change (like 011) must be edited in all three.
- Severity: P2. Recommendation: **merge** (complete references plan's and implement's phases as sub-workflows/shared includes).

**F3-11 [P2] save_context is the only step in all three lifecycle commands — six duplicated copies, two placeholder conventions.**
- Claim: plan:695 (`{spec_path}`), implement:601 and complete:1155 (`[spec-folder-path]`) each own the generate-context.js node; the tail sequence carries two handover names (handover_check vs session_handover_check, plan:720/implement:626/complete:1201).
- Severity: P2. Recommendation: **merge** (one shared tail asset; one placeholder convention).

**F3-12 [P2] validate.sh [SPEC_FOLDER] --strict occurs 4× (plan), 3× (implement), 7× (complete) — 14 identical full 39-rule gate runs.**
- Claim: per-workflow grep counts. Actual: each run re-validates the same folder after a different write; no note explains the cadence; post-011 each run is heavier (AC_CLOSURE + AC_COVERAGE + strict trio).
- Severity: P2. Recommendation: **document** the cadence per site or **consolidate** (per-write milestone gates).

**F3-13 [P2] plan/implement/complete each keep auto and confirm twins (6 files, 700-1300 lines each) differing only in present_options_to_user insertion points.**
- Claim: step-name extraction shows auto ≡ confirm for all three (resume-confirm genuinely differs: memory_selection + split present steps).
- Severity: P2. Recommendation: **merge** (one asset per command with an execution-mode branch and a declared checkpoint list).

Verified correct: resume is genuinely distinct; autopilot steps are activation-gated; no checklist.md residue remains in the step surfaces (011 fixes landed); step order is internally consistent per command.

## Angle 4 — References corpus reachability (iteration 4)

**F3-14 [P2] 17 of 45 corpus files are browse-only: named nowhere in SKILL.md, no README nav, no command-asset path.**
- Claim: SKILL.md:82-95 describes discovery-based routing over the whole corpus. Actual: references/ holds zero READMEs; command assets hold zero references/ paths; 28 of 45 files are reachable (26 in RESOURCE_MAP, 2 prose-linked at SKILL.md:428). Browse-only, grouped by directory: workflows/ 4 (agent-io-contract — repo-root-reachable; auto-mode-contract, execution-methods, goal-set-string-playbook — reachable from nothing in the repo's docs), templates/ 3 (level-selection-guide, level-specifications, template-style-guide), structure/ 3 (folder-routing, folder-structure — repo-root-reachable; phase-system), validation/ 3 (decision-format, five-checks, path-scoped-rules), cli/ 3 (daemon-cli-reference, memory-handback, shared-smart-router), assets/ 1 (parallel-dispatch-config).
- Severity: P2. Recommendation: **fix** (link from quick-reference.md / add intents) or **remove** the genuinely unreferenced ones (candidates: phase-system.md vs phase-definitions/phase-checklists; level-selection-guide vs level-specifications/template-guide; five-checks vs validation-rules — bodies not read).

**F3-15 [P2] SKILL.md:95 promises manifest/RESOURCE_MAP coherence that does not hold: 45 enumerated, 26 emitted.**
- Claim: "every one is enumerated in leaf-manifest.json … The RESOURCE_MAP below emits those exact leaf paths". Actual: leaf-manifest.json enumerates all 45 corpus files; RESOURCE_MAP emits 26; 19 leaves are emitted by no intent and can never be router-loaded. The keep-in-sync instruction governs a corpus that already violates it.
- Severity: P2. Recommendation: **fix** (state manifest = inventory, RESOURCE_MAP = routed subset) or add intents.

Verified correct: 28/45 reachable (26 routed + 2 linked); the references/protocol mention is the tail of a correct ../system-deep-loop pointer; the domain block describes all nine groups; exclusions (runtime/, shared/, feature-catalog/) match the corpus layout; commands carry no stale references/ links.

## Angle 5 — Neighbour-skill coupling (iteration 5)

**F3-16 [P2] Deep-loop resource-map emission couples to a lib module inside system-spec-kit's runtime tree.**
- Claim: resource-map-emission.md:39,59 + playbook:91 call runtime/cli/resource-map/extract-from-evidence.cjs a "shared script". Actual: no dist entry point, no CLI contract, no exported API; its test lives in the same tree (runtime/scripts/tests/resource-map-extractor.vitest.ts) while deep-loop owns system-deep-loop/runtime/.
- Severity: P2. Recommendation: **document** (declare a stable contract) or **move**.

**F3-17 [P2] The graph-convergence verdict is produced by system-spec-kit/runtime/handlers/coverage-graph/convergence.ts.**
- Claim: graph-convergence.md:43 "MCP handler — produces the graph convergence verdict". Actual: the module is inside the other skill's package; deep-research SKILL.md §8's "this hub's own runtime infrastructure layer" doesn't say which tree that is, and both exist.
- Severity: P2. Recommendation: **document** or **move**.

**F3-18 [P2] Deep-loop behavior is verified by five test files inside system-spec-kit's runtime tree.**
- Claim: feature-catalog ×5 + playbook index 922-923 cite runtime/cli/tests/{deep-research-reducer, deep-research-contract-parity, graph-aware-stop, coverage-graph-cross-layer}.vitest.ts + runtime/scripts/tests/resource-map-extractor.vitest.ts. Actual: the runtime move is documented (integration-points.md:161) but the test-home coupling is stated nowhere as coupling.
- Severity: P2. Recommendation: **document** (name the test home in deep-research SKILL.md) or **move**.

**F3-19 [P1] Both fanout playbook verification commands are broken.**
- Claim: fanout-single-executor-parity-research.md:51 — `cd .opencode/skills/system-spec-kit/runtime && npx vitest run ../../runtime//tests/unit/` ("Confirm 197/197 pass"); fanout-cli-lineages-research.md:54 — same with `…/tests/unit/fanout-run.vitest.ts` ("Confirm 5/5 pass"). Actual: `../../runtime/` resolves to the nonexistent `.opencode/skills/runtime`; `tests/unit/` exists nowhere under system-spec-kit/runtime (flat tests); no `fanout-run*.vitest.ts` exists outside dist/ (find confirmed).
- Severity: P1 (a verification instruction that verifies nothing; the fan-out parity claims rest on it). Recommendation: **fix** (point at the real test file or delete the steps and state the gap).

Verified correct: generate-context.js consistently the documented save boundary (memory-save.md:27 + loop-protocol.md:571); optimizer manifest is a config-referenced data contract (census F23 recorded keep — not re-reported); **sk-doc has zero references to system-spec-kit/runtime** — the cleaner neighbour boundary; integration-points.md documents the runtime move and its stubs.

# Convergence report

- Stop reason: **maxIterationsReached** (5/5; convergenceThreshold=3 is structurally unreachable on the 0..1 novelty scale — telemetry only, and per dispatch instructions convergence was never a stop signal; no early convergence, exactly 5 iterations).
- Iterations: 5. Findings: 19 (1 P1, 18 P2) — F3-01..F3-19.
- newInfoRatio per iteration: 0.60, 0.70, 0.75, 0.80, 0.70 (mean 0.71; no convergence trend toward 0 within the cap — each angle produced unrecorded material).
- Questions answered ratio: 5/5 angles answered with cited evidence; residual gaps are per-iteration open questions (test bodies not read for 6 rows; 8 rule headers beyond the 12-read cap; validate.sh cadence per site; fanout test home; the 14 document-orphan bodies).
- Non-goals respected: no edits, no node/validate/git execution, no census program, no scripts written; all writes inside the lineage directory; every count measured in this run.

# Open questions (from the loop, consolidated)

1. Are FILE_EXISTS and LEVEL_MATCH behaviorally identical (which one owns the complete per-level set)?
2. Are the 6 zero-naming-test rows behavior-untested, or tested without the id string?
3. Is check-spec-doc-integrity.sh sourced by validate.sh or standalone, and does check-canonical-save.sh still execute an expired time branch?
4. Are validate.sh's 7 occurrences in complete each after a distinct write?
5. Do plan's and complete's duplicated step bodies carry identical prose, and is the auto/confirm twin generation scripted or manual?
6. Which of the 14 document orphans are genuinely unneeded vs. documentation of capabilities no intent covers?
7. Where do the fanout unit tests live today (no fanout-run*.vitest.ts found outside dist), and were the playbook's npx steps ever runnable?
