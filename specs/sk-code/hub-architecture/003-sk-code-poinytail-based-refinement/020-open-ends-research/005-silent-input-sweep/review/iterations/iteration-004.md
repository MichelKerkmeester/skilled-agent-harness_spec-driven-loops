# Iteration 004 — maintainability (silent-input sweep, slice 4/10)

## Dispatcher
- Resolved route: mode=review target_agent=deep-review; one review iteration; leaf agent; state externalized.
- Run: rvw-020-005-silent-input-20261011T162455Z; generation 1; lineage new.
- Focus: slice 4 of 10 of the CLI scope — 26 sk-doc scripts, checked for (1) unknown/misspelled options accepted silently, (2) exit 0 after a detected problem, or a header documenting an option the parser rejects.

## Dimension
maintainability — argument parsing, usage-text honesty and exit-code behavior.

## Files Reviewed
- .skilled/skills/sk-doc/shared/scripts/quick_validate.py:334
- .skilled/skills/sk-doc/shared/scripts/reference_checker.py:96
- .skilled/skills/sk-doc/shared/scripts/reference_rewrite_executor.py:149
- .skilled/skills/sk-doc/shared/scripts/rename_tooling_fixture_harness.py:84
- .skilled/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py:193
- .skilled/skills/sk-doc/shared/scripts/semantic_rename_engine.py:99
- .skilled/skills/sk-doc/shared/scripts/validate_document.py:1980
- .skilled/skills/sk-doc/shared/scripts/validation_switch.py:123
- .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs:83
- .skilled/skills/sk-doc/sk-create-diff/scripts/create_diff.py:1731
- .skilled/skills/sk-doc/sk-create-diff/scripts/validate_report.py:290
- .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:1042
- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:741
- .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs:636
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:846
- .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py:1059
- .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py:297
- .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py:288
- .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:253
- .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:622
- .skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py:705
- .skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py:511
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:181
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:265
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:83
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:686

## Findings by Severity

### P0 Findings
None. No path in this slice reports success after detecting a failure on a CI, hook or workflow path.

### P1 Findings

**R4-P1-001 — build-rule-cards.cjs: an unknown/misspelled flag silently selects the write path; a "--check" typo regenerates and deletes rule cards with exit 0** — .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:41-44 (parseRootArg reads only --root; every other token is ignored) and :228 (argv.includes('--check') is the only mode switch), :207 (write) and :210-213 (delete unexpected cards).

- Repro (from the repository root; the scratch tree lives under $TMPDIR): `d=$(mktemp -d); touch "$d/REPO RULES.md"; mkdir -p "$d/.skilled/repo-rules"; cp "$(ls .skilled/repo-rules/*.md | head -1)" "$d/.skilled/repo-rules/"; node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs --root "$d" --chekc; echo exit=$?; ls "$d/.skilled/repo-rules/cards"`
- Observed: exit=0; stdout `[rule-cards] cards=1 written=1 unchanged=0 deleted=0 dir=.skilled/repo-rules/cards`; the scratch cards dir contains answer-the-actual-request.md. No unknown-option error was printed.

Claim adjudication:

```json
{
  "claim": "build-rule-cards.cjs parses only --root and reads --check through argv.includes, so any unknown or misspelled option is silently accepted. With a --check typo (probe: --chekc) the script skips cardDrift and runs writeCards, which writes generated cards and unlinks cards the current rules do not expect, then exits 0. An operator intending a read-only check mutates the target rules tree instead.",
  "evidenceRefs": [
    ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:41-44",
    ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:228",
    ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:207",
    ".skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:210-213",
    "repro: node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs --root <scratch> --chekc -> exit=0, '[rule-cards] cards=1 written=1 unchanged=0 deleted=0', scratch card file created"
  ],
  "counterevidenceSought": "Searched the file for an unknown-argument rejection or usage/help gate (none: parseRootArg only tests argv.indexOf('--root') and no branch throws on an unknown token). Checked callers: check-repo-rules.cjs requires renderCard as a module; no hook, workflow or bin wrapper calls the generator CLI, so no automated caller constrains the flag set.",
  "alternativeExplanation": "Ignoring stray arguments could be deliberate for a small generator, and regeneration is idempotent when committed cards already match. The defect survives that reading because the write path also deletes cards the current rules do not expect (lines 210-213), so a mistyped check can remove committed artifacts, and exit 0 gives the caller no signal.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the write path is proven unreachable from any read-only intent (e.g. --check is only ever passed by a wrapper that rejects typos) or the cards directory is proven non-committed and fully disposable, downgrade to P2."
}
```

### P2 Findings

1. **R4-P2-001 — lint-goal-criteria.cjs: an unknown option aborts the lint but exits 0, against the parser's stated hard-error intent** — .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs:559 (throw), :585-588 (catch returns 0), :628-635 (exitCode forced to 0).
   - Repro: `o=$(mktemp); e=$(mktemp); node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --alu >"$o" 2>"$e"; echo exit=$?; head -c 300 "$e"`
   - Observed: exit=0; stderr `[lint-goal-criteria] ERROR unknown option: --alu`; stdout empty — the lint never ran. The parser comment at :531-534 promises an unknown option is a hard error "because a silently ignored flag would lint a different tree than the caller asked for"; the catch converts it into a successful no-op.
2. **R4-P2-002 — ci-leaf-manifest-freshness.cjs: unknown options are silently ignored and a valueless --skills-dir falls back to the default tree** — :50-56 (parseArgs has no else), :118 (args.skillsDir || default).
   - Repro: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --bogus-xyz 2>&1 | tail -3; echo exit=${PIPESTATUS[0]}`
   - Observed: exit=0; `checked=14 fresh=14 failed=0` — the full fleet was walked despite the bogus flag, with no error line.
3. **R4-P2-003 — ci-skill-derived-freshness.cjs: unknown options are silently ignored** — :32-36 (argv loop handles --skills-dir only).
   - Repro: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --bogus-xyz 2>&1 | tail -2; echo exit=${PIPESTATUS[0]}`
   - Observed: exit=0; `checked=14 fresh=14 stale=0 errored=0`.
4. **R4-P2-004 — ci-skill-root-metadata.cjs: unknown options are silently ignored; --format values are also unvalidated** — :77-88 (argv loop), :684-685 (dispatch). This is both a CI gate (.github/workflows/routing-registry-drift.yml:199) and the hook repair command (.skilled/bin/git-primary-reconcile.sh:125, .skilled/bin/git-sync.sh:88).
   - Repro: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --bogus-xyz 2>&1 | tail -2; echo exit=${PIPESTATUS[0]}`
   - Observed: exit=0; `checked=14 passed=14 failed=0 fixed=0`.
5. **R4-P2-005 — check-repo-rules.cjs: unknown options are silently ignored by the CI corpus guard** — :60-63 (parseRootArg), :594 (call site); wired as GUARD in .github/workflows/repo-rules-corpus.yml:40.
   - Repro: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs --bogus-xyz 2>&1 | tail -2; echo exit=${PIPESTATUS[0]}`
   - Observed: exit=0; `[repo-rules-check] RESULT: PASSED (11/11 checks)`.
6. **R4-P2-006 — ci-router-vocabulary-reach.cjs: unknown options are silently ignored** — :167-170 (flags read only via args.includes/indexOf).
   - Repro: `CI=1 node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --bogus-xyz --limit 1 2>&1 | head -2; echo exit=${PIPESTATUS[0]}`
   - Observed: exit=2; stderr `--limit is refused under CI: a sampled run cannot gate a build` — execution reached the CI guard with --bogus-xyz present, proving the unknown flag passed parsing unchallenged.

## Traceability Checks
- core_spec_code: deferred — the slice scripts are CLI implementations; no spec item governs their flag sets or exit codes; the sweep charter is the defect definition.
- core_checklist_evidence: not-applicable — no checklist governs CLI flags/exit codes in this packet.
- overlay_skill_agent: checked — invocation surfaces verified by rg this iteration; see Integration Evidence.
- overlay_agent_cross_runtime: partial — routing-registry-drift.yml runs the .opencode mirrors of the ci-* gates; the .skilled copies reviewed here are canonical.
- overlay_feature_catalog_code: not-checked.
- overlay_playbook_capability: not-checked.

## Integration Evidence
- ci-skill-root-metadata.cjs is invoked with --fix from git hooks (.skilled/bin/git-primary-reconcile.sh:125, .skilled/bin/git-sync.sh:88) and documented in .skilled/hooks/git-primary-reconcile/README.md:53; the three sk-create-skill ci-* gates run in .github/workflows/routing-registry-drift.yml:199-201; check-repo-rules.cjs is the GUARD in .github/workflows/repo-rules-corpus.yml:40.
- build-rule-cards.cjs is consumed by check-repo-rules.cjs as a module (renderCard); its CLI write path has no automated caller, so R4-P1-001 is an operator-path defect.

## Edge Cases
- A valueless --skills-dir silently falls back to the default tree in ci-leaf-manifest-freshness.cjs (:53) and ci-skill-root-metadata.cjs (:82), and a valueless --hub broadens ci-router-vocabulary-reach.cjs to all hubs (:168).
- validate-playbook-package.cjs exits 0 without --strict only because strict defaults to true (:56) and --no-strict is explicit — documented at :49-50; not a defect.
- validate_document.py excludes/skips paths with exit 0 by design and points at --no-exclude (:1902-1909).
- validation_switch.py / validation-switch.cjs exit 0 only behind the explicit SKDOC_SKIP_VALIDATION switch.

## Confirmed-Clean Surfaces
- quick_validate.py, reference_checker.py, reference_rewrite_executor.py, rename_tooling_fixture_harness.py, resolve_skill_markdown_links.py, semantic_rename_engine.py, validate_document.py, validation_switch.py, validation-switch.cjs, create_diff.py, validate_report.py, validate_catalog_package.py, check-goal.cjs, validate-playbook-package.cjs, audit_readmes.py, check_derived_readme_counts.py, check_readme_references.py, measure-rule-compliance.py, rule-experiment.py — argparse-based parsers reject unknown flags with exit 2; documented Usage/help options match the parsers; exit contracts match implementation (create_diff.py implements EXIT_NO_BASELINE=4 and EXIT_IO=5 as documented at :34-35; validate_report.py treats a flag as a missing path and exits 1, never a silent pass).

## Ruled Out
- The "documented option the parser rejects" class: none found across the 26 files.
- audit_readmes.py always exits 0 on findings: an audit reporter by design, with no exit contract in its docstring and no hook/CI caller reading a failure exit.

## Not Proven
- ci-router-vocabulary-reach.cjs `--hub` with a missing value silently disables the hub filter (:168); proving it needs an advisor probe across every hub, which this iteration did not run.
- ci-skill-root-metadata.cjs `--fix` write failures counting toward the exit code was not proven (run body past :657 not fully traced).

## Next Dimension
Continue maintainability with slice 5 (remaining sk-doc scripts): re-test unknown-option rejection, valueless options and detected-error-to-exit mapping.

## Verdict
- Findings: P0=0, P1=1, P2=6 → CONDITIONAL (one active P1).
Review verdict: CONDITIONAL
