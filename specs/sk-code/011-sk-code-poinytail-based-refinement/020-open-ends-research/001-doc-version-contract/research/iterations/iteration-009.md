# Iteration 9: Broaden Verification — Fleet-Wide Gate, Hook Entry Point, and Verify Breadth

## Focus

"Broaden: verify remaining evidence gaps." All five key questions were answered by iteration 7 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67], and iteration 8 executed the load-bearing claims for the three skills the run had measured (775 files). Before the iteration-10 consolidation, this iteration widens the empirical base along four axes without opening new questions: (a) execute gate across the 11 previously unmeasured skill directories; (b) execute the hook's literal entry point — the wrapper the router pins — rather than the engine directly; (c) extend verify execution to two previously unmeasured skills; (d) check whether the enforced set (router) and the checked set (engine) agree, and census the one asymmetry the sources expose. The live edit probe remains out of scope because it would mutate a researched file.

## Actions Taken

1. Read state: config, strategy, the state-log projection (8 iteration records plus the iteration-9 start sentinel), iteration-008.md, iteration-007.md (Recommended Next Focus), and findings-registry.json (5/5 questions resolved). Boundary check: iteration-009.md and deltas/iter-009.jsonl absent before writing; packet root is the resolved write zone.
2. Read the router's constants and matcher: the frontmatterVersions constant pins the wrapper [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38]; row 3 assembles args ['--skill', skillName] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:207-209]; the mirror set and its comment [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:46-54]; the versioned-doc matcher [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:120-121] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131-139].
3. Executed the hook's literal entry point: bash .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh --skill sk-code -> EXIT=0, "[gate] 340 files | ok=337 skip-no-frontmatter=3" (stdout captured under /tmp, outside the repo) [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13].
4. Executed gate for the 11 previously unmeasured skill dirs (cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-design, sk-git, sk-prompt, sk-vision, system-deep-loop, system-spec-kit): all EXIT=0; 2,134 files total, 2,131 ok, 3 skip-no-frontmatter, 0 failures.
5. Executed verify for two previously unmeasured skills (sk-prompt, sk-git): both EXIT=1; FAIL-line counts 36 of 37 and 74 of 75 documents respectively.
6. Read the engine's scope definition and dual-form acceptance [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:53-57] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:236]; censused subtree roots across .skilled/skills: 0 underscore-form directories vs 86 hyphen-form directories today.
7. Recorded the iteration through the append gateway (Step 8) and wrote the delta file (Step 9). Skipped research/research.md: progressive synthesis is enabled, but the dispatch's allowed-write list contains only the iteration narrative and the delta file, so synthesis stays with the workflow (same rationale as iteration 8).

## Findings

1. **Gate green is now fleet-wide, not a three-skill sample: all 14 skill directories executed, 2,909 in-scope docs, 7 skips, 0 failures.** Previously measured (iteration 8): sk-code 340 files (337 ok, 3 skip), sk-doc 320 (319, 1), system-skill-advisor 115 (115, 0). New this pass: cli-classifier 49/49; cli-external-orchestration 433/433; cli-orca 30/30; mcp-code-mode 43/43; mcp-tooling 569/569; sk-design 200 (198, 2); sk-git 75/75; sk-prompt 37/37; sk-vision 47/47; system-deep-loop 444/444; system-spec-kit 207 (206, 1). Every invocation exited 0; the output shape confirms the counted-actions contract [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:468-472]. The packet spec's 340/320/115 figures are a three-skill subset (775 files) of this 2,909-file fleet. New — first execution beyond the three benchmarked skills.

2. **The hook's literal entry point executes green: running the wrapper the router pins produces the identical gate result.** check-frontmatter-versions.sh --skill sk-code exited 0 with "[gate] 340 files | ok=337 skip-no-frontmatter=3", byte-identical in substance to iteration 8's direct engine invocation. The router constant resolves the checker to exactly this wrapper [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38] and passes ['--skill', skillName] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:207-209]; the wrapper execs the shared engine in gate mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13]. This converts iteration 8's code+doc hook evidence into code+doc+execution of the routing target; a live edit probe is the only remaining leg and stays out of scope. Partially new — the wiring was cited before, the execution of the pinned path is new.

3. **Verify-red generalizes beyond the three benchmarked skills, and verify is per-skill red because at least one doc mismatches — not because every doc is wrong.** verify --skill sk-prompt exited 1 with 36 FAIL lines over 37 files; verify --skill sk-git exited 1 with 74 FAIL lines over 75 files [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:451-461]. Combined with iteration 6's 713 flagged files across the three skills, the measured red population is now 823 flagged docs across 5 executed skills. One document per newly measured skill currently matches its derived value, so the value comparison is falsifiable at doc level; exit 1 is driven by at least one mismatch per skill. Nothing automated runs verify (Q5), so this population remains telemetry rather than a live gate. New — first verify execution outside the three measured skills.

4. **The enforced set and the checked set agree in source and in the tree today; one latent underscore-form asymmetry is bounded to zero instances.** The engine's scope array [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57] carries a comment stating both underscore and hyphen root forms stay in scope during the naming migration [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:53-56], with dual-form acceptance in code [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:236]. The router's mirror set cross-references the engine explicitly [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:46-48], but its canonical map is hyphen-keyed [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:49-54] and the matcher resolves segments only through that map [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:120-121] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131-139]. Census: 0 underscore-form vs 86 hyphen-form directories today, so there is no live divergence; if an underscore-form root returns during the migration, the engine would check it while the router would not trigger an edit-time check for docs under it — a fix-phase caveat, not a current violation. New.

5. **Synthesis: the run's last breadth gap is closed — both halves of the topic claim now hold at fleet scale.** Gate-green holds across 14/14 skill dirs (2,909 docs, exit 0; failures require only presence/format regressions), and verify-red holds on 5/5 skills measured (823 flagged docs), with nothing automated running it. The enforceable invariant is therefore presence/format only, already green fleet-wide; the stored-vs-derived mismatch population is measured but unenforced. Partially new — no new external evidence; folds this iteration's breadth results into the consolidation frame. [INFERENCE: from executed gate and verify results across 14 and 5 skills respectively, versus iterations 6 and 8's three-skill samples.]

## Ruled Out

- **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead.
- **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step.

## Dead Ends

- None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280].
- No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated.

## Edge Cases

- Ambiguous input: none — "broaden" was resolved to four concrete executions/checks (fleet gate, hook entry point, verify breadth, set consistency).
- Contradictory evidence: none. The one asymmetry (engine dual-form tolerance vs router hyphen-keyed map) is a bounded asymmetry measured by census, not a contradiction.
- Missing dependencies: none. All scripts and sources were available.
- Partial success: none; all checks completed. One evidence-hygiene caution: the engine summary line lacks a trailing newline, so a merged FAIL-line count rendered as "ok=136" and "ok=174"; the arithmetic reconciled as 36+1=37 and 74+1=75, recorded in Reflection.

## Questions Answered

- None at the key-question level (Q1-Q5 remain resolved [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67]). This iteration answers a breadth meta-question: do the executed claims generalize beyond the three sampled skills? Yes for gate (14/14 skill dirs) and for verify (5/5 measured).

## Questions Remaining

- None at the key-question level. Iteration 10 remains under the max-iterations stop policy; the productive direction is the single decision record (see Recommended Next Focus).

## Sources Consulted

- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs (451-461 verify exit rule; 468-472 summary shape; 53-57 scope subtrees; 236 dual-form acceptance)
- .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs (38 checker path pin; 46-54 mirror set and map; 120-121, 131-139 matcher; 200-211 row 3)
- .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh (line 13: execs engine in gate mode)
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md (63-67 key questions; 128-280 exhausted approaches)
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-008.md and iteration-007.md (prior execution claims and next-focus recommendations)
- Command outputs: gate loop over 11 unmeasured skills (EXIT=0 each; 2,134 files, 3 skips); wrapper check-frontmatter-versions.sh --skill sk-code (EXIT=0, 340 files); verify --skill sk-prompt (EXIT=1, 36 FAIL/37 files); verify --skill sk-git (EXIT=1, 74 FAIL/75 files); subtree census (0 underscore / 86 hyphen directories); readlink of .opencode/skills -> ../.skilled/skills

## Assessment

- New information ratio: 0.75 — (3 fully new + 0.5 x 1 partially new) / 5 = 0.70, plus a +0.05 simplicity credit for folding the breadth question into fleet-wide executed facts. Fully new: fleet-wide gate execution (F1), verify breadth (F3), enforced/checked-set census (F4). Partially new: hook entry-point execution (F2). Synthesis: F5 counted in the credit, not double-counted. Redundant: none.
- Questions addressed: the breadth meta-question; no key questions newly answered.
- Questions answered: none at the key-question level.

## Reflection

- What worked and why: broadening by execution rather than rereading. The fleet gate loop and two verify runs took about 20 seconds and converted "three sampled skills" into "all 14 skill dirs green" and "5 skills measured red" — the marginal cost of breadth was near zero, which is exactly why the earlier three-skill sample left it undone. Running the wrapper the router actually pins closed the last routing leg without touching a file. Reading both scope definitions and adding a directory census bounded the only asymmetry to zero live instances instead of leaving it as speculation.
- What did not work and why: nothing failed. One output-hygiene slip: the summary line has no trailing newline, so the merged FAIL-line count rendered as "ok=136"/"ok=174"; arithmetic reconciliation (36+1=37, 74+1=75) resolved it, but separated streams would have avoided the reconstruction.
- What I would do differently: capture FAIL lines and the summary as two separate reads instead of merging stderr and stdout through 2>&1, so the summary count is read verbatim rather than reconstructed.

## Recommended Next Focus

Iteration 10 (final; stopPolicy max-iterations): assemble the single decision record, now with fleet-scale anchors: (a) gate green 14/14 skill dirs (2,909 docs, exit 0; presence/format only), with the hook rerunning the same engine through the router-pinned wrapper on every in-scope edit [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:207-211]; (b) verify red on 5/5 measured skills, 823 flagged docs, nothing automated running it; (c) fix-phase items — the frontmatter-less skip class, the changelog coverage divergence, and the now-bounded underscore-form scope asymmetry (0 instances today); (d) Q4's removal recommendation and Q2's reversal condition. No new questions; consolidation only.

## SCOPE VIOLATIONS

None. All writes stayed inside the allowed paths (iterations/iteration-009.md, deltas/iter-009.jsonl, and the gateway's own writes via a single-record temp file under /tmp); every researched file was read-only; no banned operation ran; gate, wrapper, and verify executions wrote no repository file.
