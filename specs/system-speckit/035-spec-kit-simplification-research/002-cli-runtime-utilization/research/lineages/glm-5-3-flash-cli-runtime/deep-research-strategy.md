---
title: Deep Research Strategy - glm-5-3-flash-cli-runtime
description: Detached fan-out lineage strategy for the code-archaeology audit of the @spec-kit/cli package.
contextType: planning
version: 1.14.0.19
trigger_phrases: []
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC

The @spec-kit/cli package at .opencode/skills/system-spec-kit/runtime/cli, judged for purpose, logic, integration, and utilization, by an independent code-archaeology auditor. Every claim grounded in files actually read and callers actually traced through .opencode/commands, .opencode/bin, .opencode/hooks, .opencode/plugins, and .github/workflows.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What purpose does each directory under runtime/cli declare, and which real callers (commands, bin, hooks, plugins, workflows) actually use it? — partially (validation + continuity/core/extractors lanes done);
- [x] Which stages of the save pipeline (continuity/, core/, extractors/) still execute after the memory decommission, and which are inert?
- [x] Which scripts-registry.json entries have no matching script, which scripts have no registry entry, and which checks are duplicated (rules/ vs validation/ vs root check scripts vs package.json)?
- [x] Which directories or entry points have zero external callers, and which registry entries point at nothing?
- [x] Are the codex/, pi/, runtime-mirrors/ sync scripts and the evals/ check gate actually invoked, and by what?
- [x] Does the package framing (context generation and continuity management) match what the code does, and which helpers are duplicated across this package, ../lib/, and any shared layer?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- No file edits to the audited package; research reports findings only.
- No rewrite proposals beyond removal or merge.
- No evaluation of prose style or naming conventions for their own sake.
- No writes outside this lineage artifact directory.

## 5. STOP CONDITIONS

- Run exactly ten iterations even if convergence telemetry becomes positive; convergenceThreshold 3 on a capped-1.0 newInfoRatio scale is unreachable, so convergence is telemetry only under the max-iterations stop policy.
- Stop only after the tenth iteration or an unrecoverable workflow error.
- The terminal synthesis record must carry stopReason maxIterationsReached.
- Every no-caller claim must distinguish none-found (searched the five caller surfaces) from caller-not-checked.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Which stages of the save pipeline (continuity/, core/, extractors/) still execute after the memory decommission, and which are inert? — Iteration 4: the documented 3-layer gate (intake, router, post-save review) survives INTACT and executes single-process (generate-context.ts:15-35 → workflow.ts:12-48 → find-predecessor + post-save-review); all 12 extractors are production-wired through the second hub (workflow.ts:17-48); the inert material is residue AROUND the pipeline (continuity: rank-memories 440L, fix-memory-h1+ast-parser 65L, the 1529L migration trio, the 66L shim; core: the uncited 367L scorer; renderers/ 231L) — naming survives as vocabulary, not machinery (daemon-detect.ts:3-5 documents its own remaining justification).
- What purpose does each directory declare vs its callers? — Iterations 2-8: 35 directories, every one carries a verdict; the surprises were negatives (templates, metrics, the 12 extractors, graph/backfill: all more wired than their docs).
- Which registry entries have no matching script, which scripts have no registry entry, which checks duplicated? — Iteration 10: 0 dangling paths (existence), 1 dead-but-registered shim (trigger-extractor), 11 undiscovered subsystems, 4 wrong counts, 1 stale date; duplication: 11 exhibits, one systemic cause.
- Which directories or entry points have zero external callers? — Iterations 6+9: 19 no-caller claims, all certified at full sweep; the removal bill: ~30 files + 2 directories, each evidence-filed.
- Are the codex/pi/mirrors sync scripts and the evals/ check gate actually invoked, and by what? — Iteration 7+8: the doctor route (5 --check lines, AI-invoked, _routes.yaml:169-182), NOT the 3 promised workflows; the 6-check+allowlist+expiry gate: wired only into package.json:24 check, which no workflow anywhere runs.
- Does the framing match what the code does, and which helpers are duplicated? — Iteration 10: three partial truths; the heaviest-caller claim inverted (continuity 64 > retrieval 49-reminders > validation 11-executions); duplication: TEN exhibits, systemic cause = copies accreted where seams existed, then tests paid to patrol the difference.

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- (iteration 1) Reading package.json and scripts-registry.json side by side exposed the framing claim and the registry count fields before any directory conclusions were drawn; recounting arrays programmatically instead of trusting printed metadata caught a wrong mechanism claim the same iteration.
- (iteration 1) Grepping the registry for subsystem path prefixes (0 hits for 11 directories) sized the discovery gap in one command.
- (iteration 2) Treating "which file READS the registry" as the primary question flipped three tentative conclusions (rules/ dead→alive via the engine dispatch; validation/ audits orphaned→dispatched; scripts-registry→inert) inside one iteration.
- (iteration 2) Programmatic parity (existsSync over every script_path) turned "maybe missing" into counted facts and exposed the 6 intentional virtual entries (native:orchestrator, ts:spec-doc-structure).
- (iteration 3) Reading the ENTRY POINT'S import list (generate-context.ts:15-35) as the boundary of "wired" — every downstream liveness question became a grep; and the package's own MODULE headers (daemon-detect, validate-memory-quality, quality-scorer) settled three verdicts without inference.
- (iteration 4) Refusing to stop at the second hop: core/workflow.ts:17-48 (the conductor) was the difference between "6 extractors dead" (wrong) and "0 extractors dead, 2 hubs" (right).
- (iteration 4) The vi.mock('../renderers') at tests/task-enrichment.vitest.ts:118 flagged a production import that grepping populateTemplate then disproved (EMPTY) — test doubles carry liveness hints, not liveness proof.
- (iteration 5) Grepping the GOVERNED ARTIFACT (import-policy-allowlist.json) instead of trusting ARCHITECTURE.md:100's prose — the hooks-zone omission surfaced immediately; and reading what the lookup itself validates (shape, not freshness) converted a suspicion into a P1.

<!-- /ANCHOR:what-worked -->

- (iteration 7) Reading the promised workflows run blocks instead of their names — all three promised guardians belong to other subsystems; the real invocation surfaced one hop later in the doctor route. And ops/README.md self-declared its stubs with their mechanism, converting exploration into a 2-minute verdict.

- (iteration 8) Reading the scan predicate (check-architecture-boundaries.ts:80) before theorizing about enforcement — one line dissolved iteration-5s counterexample; and zero-caller greps INCLUDING tests and docs so that zero means zero (kpi/ earned its removal honestly).

- (iteration 9) Chasing the 19th citation instead of stopping at 18 — the treaty import (a cross-skill RELATIVE path) answered who unifies the coverage-graph copies, and the answer was a test, not a module. And the death-row certification counted SELF-mentions honestly (a 1 means alone).
- (iteration 10) Ending on verification, not discovery: the cheapest two mechanisms of the session (existsSync over the registry; the 49-file decomposition) retired the largest residual risks.

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- (iteration 1) None yet; first iteration.


- (iteration 7) None; no approach exhausted. The name-neighbor temptation (3 workflows, 3 mirrors) was checked before it could mislead — the run blocks told the truth their titles hinted away.
<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES

- (none yet)

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED-OUT DIRECTIONS

- (iteration 1) Treating the package.json:19-20 vitest-config divergence as breakage: both referenced configs exist, so it is documented-inconsistency territory, not a P0/P1.
- (iteration 2) "validate.sh implements the rules itself": it spawns the engine orchestrator which spawns the registered rules; both hops evidenced.
- (iteration 2) "rules/ is dead": 28 of 31 check-* files are dispatched through the live registry; only the 3 helpers + check-doc-pointers.sh + check-links.sh sit outside it, and check-links.sh has the hook caller.
- (iteration 3) "The post-save review layer runs as a separate command": the command YAMLs name generate-context.js alone and say nothing else runs (speckit-plan-auto.yaml:699).
- (iteration 3) "core/config.ts vs cli/config/ is accidental duplication": config/ is the documented inversion seam with 7 importers.
- (iteration 4) "6 of 12 extractors are unwired": the workflow.ts:17-48 barrel+direct purchases wire all 12.
- (iteration 4) "templates/ is undocumented-AI-only": spec/create.sh:1066 is a production caller.
- (iteration 4) "scoreRenderQuality vs scoreMemoryQuality are rival implementations of one function": different names and scoring layers; the duplication verdict stands via 0-caller evidence, not twin-implementation similarity.
- (iteration 5) "graph/ is unwired documentation-only": repair-derived.cjs:319 + the doctor pair are production callers.
- (iteration 5) "repair-derived and backfill duplicate the repair responsibility": one spawns the other under a written derived-versus-authored contract (spec/README-repair-derived.md).
- (iteration 6) "core/alignment-validator.ts and spec-folder/alignment-validator.ts are duplicates": 227L vs 712L, disjoint concerns, both wired from different halves.
- (iteration 6) "The support shell hides more stranded modules": the census complement came back short.
- (iteration 7) "agent-mirror-sync/prompt-card-sync/rule-canary-sync.yml guard the codex/pi/mirrors": they run the deep-loop, skill-advisor and sk-code checkers; the name neighbors deceive.
- (iteration 7) "ops/ is wholly inert": process-sweep.ts runs from the session-cleanup plugin; only the heal-*/runbook trio stubs.
- (iteration 8) "The .mjs lane escapes the import-policy checks": the predicate scans four extensions.
- (iteration 8) "metrics/ is stranded": the doctor fable mode invokes it.
- (iteration 8) "resource-map/extract-from-evidence.cjs backs the /deep:research resource_map": the command YAML specifies the artifact; no step names the tool.
- (iteration 9) "cli/lib/coverage-graph/ is the production copy": its own package production importers NONE-FOUND; the deep-loop copy has production neighbors.
- (iteration 9) "js-yaml backs the frontmatter parsing": that is shared/frontmatter/parse-frontmatter (11 lanes); js-yaml survives on one helper.

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:divergence-frontier -->
## 11. DIVERGENCE FRONTIER

- (none yet)

<!-- /ANCHOR:divergence-frontier -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS

Synthesis: research.md (canonical, verdict-first, ranked, two-sided-cited), resource-map.md (the evidence inventory), convergence-report.md (stopReason: maxIterationsReached, 10/10 iterations, 6/6 questions), and the terminal state records. The confirmed-findings.md the remediation child consumes is a packet-level deliverable, written outside this lineage, from this research.md.

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT (bounded, pointer-based)

- Audited target: .opencode/skills/system-spec-kit/runtime/cli (~35 directories; dist/ and node_modules/ and runtime/ are symlinks or build outputs; tests/ and test-fixtures/ are the test trees; ~129k LOC counting dist).
- package.json: name @spec-kit/cli, version 1.7.2, description: CLI tools for spec-kit context generation and continuity management; main: dist/continuity/generate-context.js; deps: @spec-kit/runtime (file:..), @spec-kit/shared (file:../../shared), js-yaml.
- scripts-registry.json: 14 script entries under scripts[] (metadata.totalScripts claims 13), 9 rule entries under rules[] (metadata.totalRules claims 14), 3 shell + 8 javascript libraries; lastUpdated 2025-12-31.
- Sibling packets in this 035 research track: 001-ripgrep-search-system, 003-shared-package-utilization, 004-template-system-and-acceptance-criteria, 005-overengineering-simplification.
