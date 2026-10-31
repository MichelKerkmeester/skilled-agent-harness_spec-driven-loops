# Iteration 15: Ranked recommendations and synthesis

## Focus

Close the loop: rank every recommendation across all five questions, record the answers, and synthesize the lineage's `research.md`. The terminal record carries `stopReason: maxIterationsReached` as the stop policy requires.

## Actions Taken

- Compiled the ranked table from iterations 1 to 14 and wrote `research.md` as the lineage synthesis.
- Reconciled the iteration-4 anchor claim with the iteration-14 refutation.
- Recorded all five key questions as answered with their supporting iterations.

## Findings

1. The highest-value recommendation is the template anchor fix plus the doc-versus-code resolution: it stops a defect that regenerates in every new Level 2/3 packet and settles which contract owns nesting. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] CONFIRMED
2. The highest-volume fix is the post-move re-derive in `archive.sh` and `restore_spec`, which settles the class that produced 2,898 baseline occurrences; it must cover both the description and graph writers. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277] CONFIRMED
3. The migration answer is already built: detection by evidence, dry-run pipeline, baseline ledger, never-recorded derivable rules, archive recorded not rewritten. What is missing is exposure through the doctor surface and a per-class census. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:497] CONFIRMED
4. The branch hardening answer is concrete and small: stage all generator outputs and add a postcondition to the rebuild workflow; single-source phrase lists and Gate 3 menus; route cleanup skips; add an applied-state audit to replace sampled diff review. [SOURCE: .github/workflows/trigger-index-rebuild.yml:36] CONFIRMED
5. The Q5 placement answer: per-change regression gating already exists; add deterministic unit tests (scaffold render, Gate 3 constants, phrase extraction) to the path-filtered suites, keep corpus sweeps in the weekly/advisory report, and add base-revision checks to pre-push or CI advisory only. [SOURCE: .github/workflows/README.md:38] CONFIRMED
6. The lineage's answer quality is bounded by one corrected premise: the nested `questions` anchor does not fail ANCHORS_VALID today, because the implementation checks pairing and duplicates only; the recommendation stands on extraction semantics and the documented contract, not on a validator error. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:698] CONFIRMED

## Ruled Out

- Synthesizing before the cap: the stop policy is max-iterations, and iterations 11 to 14 added real hardening and a refutation, so an earlier synthesis would have shipped the wrong anchor premise.
- Leaving the ranked table only in `research.md`: the iteration narrative carries it too, so a reader of the deltas sees the same ranking without opening the synthesis.

## Dead Ends

- None; the synthesis pass only consolidated.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the iteration-4 versus iteration-14 anchor contradiction is resolved in favor of the implementation, and both records remain in the lineage.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- Iterations 1 to 14 and their deltas in this directory.
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/pi-deepseek-flash-max/steer.md`
- All inline sources cited in `research.md`.

## Assessment

- New information ratio: 0.30 (synthesis and ranking; no new external evidence this iteration)
- Questions addressed: all five
- Questions answered: all five

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-008 | Fix the template `questions` anchor and resolve the no-nesting contract (with R-039) | Q1, Q2 | template, validator, reference doc | S-M | Med | Template, check, doc | Template:184/399/425; render sample:128; rule doc:389 | CONFIRMED | Yes | Revert commit | Markers only |
| R-005 | Post-move re-derive in archive and restore, both writers (with R-040 test) | Q1, Q2 | `archive.sh`, tests | S | Low | Archive script, test | archive.sh:277/403; writers split | CONFIRMED | Yes | Revert commit | Derived fields only |
| R-014 | Anchor-structure repair step, prose-preserving, after heal | Q1, Q2 | pipeline, shared rules | M | Med | New module, pipeline | No anchor step; fix-dup-anchors rules | CONFIRMED | Yes | Revert commit | Marker lines only |
| R-021 | Evidence-based pre-v4 census with shared classifier and per-class routing (with R-023, R-024, R-026, R-027, R-028) | Q3, Q5 | census mode, doctor presentation | M | Low | New mode, docs | Measured classes; exclusion pitfall | CONFIRMED | Yes | Delete script | No |
| R-020 | Corpus-heal check in the doctor update battery; document update vs heal split (with R-022) | Q3, Q4 | apply YAML, docs | M | Med | Workflow YAML, docs | Battery pattern; unit model | CONFIRMED | Yes | Revert commit | No |
| R-029 | Rebuild-workflow hardening: all outputs staged, post-commit check, push retry, ruleset alternates | Q4, Q5 | workflow | S | Low | Workflow | Generator outputs vs staged path | CONFIRMED | Yes | Revert commit | No |
| R-017 | Permanent heal modes from the nine lane rules (reconstruction stays a lane, R-015) | Q1, Q3 | heal tool, pipeline | M-L | Med | Heal tool, tests | Lane brief; phase NFRs | CONFIRMED | Yes | Revert commit | Structure only |
| R-030 | Single-source phrase lists and Gate 3 menus; drift tests (with R-031, R-036) | Q4, Q5 | templates, judge, seeder, gate core | M/S | Low-Med | Lists, menus, tests | create.sh:403; constants partially consumed | CONFIRMED | Yes | Revert commit | Wording only |
| R-035 | Scaffold-render anchor test in the spec-kit suite | Q5, Q2 | cli tests | S | Low | Test | No render check exists | CONFIRMED | Yes | Delete test | No |
| R-032 | Route cleanup skips to fill-frontmatter; applied-state audit; CI/pre-push diff rule (with R-033, R-034, R-038) | Q4, Q5 | cleanup tool, CI, pre-push | M | Med | Tooling, checks | Cleanup report; 21 skips; sampling control | CONFIRMED | Yes | Revert commit | No |
| R-009 | Scaffold-time structural self-check and frontmatter heal class (with R-012) | Q1, Q2 | create.sh, heal | S-M | Low-Med | Script, heal tool | Broken scaffold shipped | CONFIRMED | Yes | Revert commit | No |
| R-041 | State the status-alignment exception honestly; keep phrase warnings advisory (with R-013) | Q3, Q4 | docs, policy | S | Low | Docs | Lane rule 7; judge refusal | CONFIRMED | n/a | n/a | Docs only |

## Reflection

- What worked and why: the 15-iteration order (inventory, causes, mapping, migration, hardening, checks, adversarial, synthesis) kept every claim attached to a file, and the adversarial pass caught a premise error before it reached the terminal answer.
- What did not work and why: the per-iteration recommendation tables repeated some rows; the final table deduplicates them, but earlier iterations could have carried only deltas.
- What I would do differently: run the rule-implementation read before citing rule documentation for any validation claim, the exact error iteration 4 made.

## Recommended Next Focus

None: the stop policy cap is reached; the terminal synthesis record and `research.md` carry the closed recommendations.
