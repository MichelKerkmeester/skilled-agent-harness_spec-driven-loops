---
title: "Iteration 10: The Consolidation Verdict"
trigger_phrases: []
---
# Iteration 10: The Consolidation Verdict

## Focus

The closing pass: the removal and merge lists ranked by the confidence that nothing documented depends on them, the framing verdict (Q6's second half), the Q3 last leg (do the registry's 14 paths even resolve; does any automated mechanism run the checks), and the residuals stated honestly.

## Actions Taken

1. Existence-verified all 14 scripts-registry paths + 9 rule paths + every libraries[] path (node existsSync over the resolution root).
2. Quantified the heaviest-caller claim: five-surface + workflow reference counts per lane (continuity 64, retrieval 49, validation 11), then decomposed the 49 (all 49 in .opencode/commands; 0 in hooks/plugins/bin/workflows — reminders, not mechanisms).
3. Assembled the ten duplication exhibits, the removal bill, and the residuals from the nine prior iterations — no new machinery; every verdict below cites its evidence iteration.

## Findings

1. Q3a (last leg): ZERO dangling paths — all 14 scripts[] paths, 9 rules[] paths, and every libraries[] path (3 shell + 8 js) exist on disk (node existsSync: 0 missing across the resolution root .opencode/skills/system-spec-kit). The registry's failure mode is therefore NOT dead pointers (f-iter001-002's discovery gap, f-iter001-003's wrong counts, and f-iter009-003's dead-but-registered shim stand, but nothing 404s) — with the caveat that 8 of the 11 library paths are dist/ outputs, which in this 046 worktree resolve through the SYMLINKED main-checkout dist (finding f-iter001-006). Severity: P2 (a corrected negative). Recommendation: document — "every registered path resolves; the failure is coverage, not existence" is the true sentence.

2. Q6 (the framing quantification): the 002 packet's problem statement — "its heaviest callers are validation and retrieval" (spec.md:84) — INVERTED by the count: continuity/save-reminders 64 command-surface files > retrieval/trigger-index 49 > validation 11. And the 49 retrieval references are REMINDERS: 49/49 sit in .opencode/commands, ZERO in hooks, plugins, bin, or workflows — the retrieval lane's only execution mechanism remains the AI's discipline (f-iter005-001's freshness hole, unchanged). The validation lane's 11, by contrast, are mostly EXECUTIONS (6 command YAMLs, 1 workflow, the completion plugin/bin/hooks pair, the completion-evidence side). Three self-descriptions (package.json:4 continuity; cli/README.md:17 lifecycle+continuity+evals; ARCHITECTURE.md:23 generation+validation+indexing+evals) each name a different third of the reality; the caller-weighted reality: a tightly-wired continuity/save core (~20k LOC, every documented stage executes — iterations 3-4), a legitimately-decisive validation dispatch (39 rules, one live registry, the ONLY coherent registry in the package — iteration 2), and then the long margin: retrieval (2 mandates + 4 ceremonies + 1 freshness hole), mirrors (doctor-checked, CI-unguarded), six measurement directories (one dead, one doctor-wired, one agent-wired, one CI-wired, one output-committed, one treaty-twin'd), delivery+ops (stubs, strays, a zero-CI test/gate estate). Severity P2. Recommendation: fix — the packet's own summary sentence, if quoted into remediation, should read "its heaviest callers are continuity reminders, then retrieval reminders, then validation executions, and its heaviest UNSUPERVISED machinery is the tests/gate estate".

3. The removal bill, ranked by confidence that nothing documented depends on it — Tier 1 (certified zero-or-self references, ship the docs lines with them): the .scan* seven + the 0-byte residue (f-iter006-002); continuity/ast-parser.ts + continuity/fix-memory-h1.mjs (f-iter003-003); kpi/ (2 files, 1=self, f-iter008-002); setup/_utils.sh (f-iter007-004); the 3 stranded evals harnesses (f-iter008-003); doctor.sh (superseded by commands/doctor, f-iter006-001); migrate-deep-research-paths.ts + seed-council-value-fixture.cjs (f-iter006-003). Tier 2 (documentation-ship-with): continuity/rank-memories.ts (440L, 5 doc-refs, f-iter003-002); spec/check-smart-router.sh + spec/sweep-track-roots.mjs (f-iter002-003); the retrieval trio retrofit-convention.mjs + sweep-memory-residue.mjs + measure-cold-lookup.mjs + their 10 frozen fixtures (f-iter005-002 — AFTER the 001-packet evidence is archived). Tier 3 (merge-first, then the leftover dies): core/quality-scorer.ts (f-iter004-002); renderers/ (f-iter004-003); — conditionally — registry-loader.sh + scripts-registry.json (f-iter002-001, if the registry decision is removal rather than regeneration). Total: ~30 files + 2 directories, every line already evidence-filed.

4. The merge list, ranked by confidence — (1) PLACEHOLDER_FILLED: rules/check-placeholders.sh vs spec/check-placeholders.sh, both wired, one rule, 69 lines apart (f-iter002-004). (2) coverage-graph: the two-skill twins + the parity treaty (f-iter009-001 — the production copy is the deep-loop's). (3) The registries: scripts-registry.json + registry-loader.sh vs the live cli/lib/validator-registry.json (f-iter002-001 — one dispatch source, one discovery catalog, disagreeing counts). (4) The quality scorers + their disambiguation test (f-iter004-002). (5) comment-hygiene: cli/rules vs sk-code/sk-code-quality, two lanes, one concept (f-iter002-005). (6) The four sweeps, four directories, two wired (f-iter008-007). (7) The three template mechanisms: templates/inline-gate-renderer (create.sh:1066), lib/template-utils.sh (6 citations), renderers/ (0 production) (f-iter004-003 + the iteration-6 census). (8) repo-root ×3: common.sh, hooks/lib/workspace, shared/paths-pending (f-iter005-003). (9) phase-parent detection ×3: the engine TS, the 200L save-path twin, the shell mirror (f-iter002-006 + f-iter003-007). (10) resource-map: extract-from-evidence.cjs INTO the /deep: research+review synthesis steps, or out (f-iter008-006). (11) js-yaml behind the shared seam (f-iter009-004). Systemic cause, stated once: WHEREVER A SEAM ALREADY EXISTS (shared/, the 2021-2023 staging shim, the barrel), the package accreted a copy anyway, then paid a test (disambiguation, parity, calibration) to Patrol the difference — the tests are the fossils of un-merged pairs.

## Positive Controls (verified, not findings)

- The two checks that could have sunk the whole audit, both passed: the death-row certification (19/19 upheld, f-iter009-002) and the path-existence sweep (32+11 paths, 0 missing — this iteration).
- The counts that COULD have been inflated, and were not: the 49 retrieval references decomposed into 49/49 command-reminders (0 mechanisms) BEFORE being quoted; the continuity 64 labeled reminder-biased.

## Questions Answered

- Q3 (COMPLETE): 0 dangling paths; the failures are coverage (11 undiscovered subsystems), counts (4 wrong), freshness (2025-12-31), and 1 dead-but-registered shim.
- Q6 (COMPLETE): the framing — three partial truths, the heaviest-caller claim inverted, the duplication cause systemic (ten exhibits, one cause), the remedy list explicit.

## Questions Remaining

- NONE of the charter's six. Residuals (honest, carried to synthesis): (a) dynamic-import discovery beyond string-constants: not swept; (b) the observability results' ultimate consumer: caller-not-verified; (c) codex/generate-command-routers.cjs's precise invocation: caller-not-verified; (d) setup/_utils.sh indirect-variable sourcing: caller-not-fully-verified; (e) the 046-worktree symlink ownership: worktree-scoped, untreated; (f) whether the 035/001 track's evidence chain consumes the observability/optimizer outputs: packet-archival question, outside this lineage's write surface.

## What Worked / What Failed

- Worked: ending on VERIFICATION, not discovery — the last two mechanisms the audit needed (existsSync over the registry, the 49-file decomposition) were the cheapest of the session and retired the largest residual risks.
- Failed: none; no approach exhausted.

## Ruled Out

- "Some registry entries point at nothing" — by existence: none; by import: exactly one (the trigger-extractor shim, f-iter009-003).
- "The heaviest callers are validation and retrieval" — continuity 64, retrieval 49 (all reminders), validation 11 (mostly executions).

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json (14+9+11 paths, existsSync: 0 missing)] [SOURCE: specs/.../002-cli-runtime-utilization/spec.md:83-85] [SOURCE: .opencode/commands (49 retrieval-reference files, 0 hooks/plugins/bin/workflows — this session)] [SOURCE: iterations 2-9 of this lineage (the removal/merge bills, each evidence-filed)] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:23] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:17]

## Next Iteration

None — this was the tenth and final iteration; the loop enters synthesis under the max-iterations stop policy (stopReason: maxIterationsReached).
