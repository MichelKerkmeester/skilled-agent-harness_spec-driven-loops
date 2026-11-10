# Iteration 005 — Residue closure: prefix-rule surface measured, drift cases replayed, catalog CI verdict

- Run: `2026-10-11T16:24:27.869Z` | Iteration 5 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: all five strategy key questions are marked answered. The dispatch widened the focus: verify earlier claims against the tree, sample further skills' playbooks and catalogs, test the proposed check against real drift cases. No strategy box is re-ticked; this iteration closes the iteration-4 residue, not a key question.

## Focus

Residue closure over the whole proposal:
1. Measure the strict-prefix rule's comparison surface across the full playbook corpus (iteration 4 left the false-positive estimate open).
2. Replay the recorded historical drifts (`--phase-count`; the literal-naming Expected/Evidence disagreement) against the live tree.
3. Census the catalog anchor corpus and resolve a sampled anchor end-to-end.
4. Settle the catalog validator's CI/test-discovery question (iteration 4, sub-question c).

## Actions Taken

1. Corpus census over every `manual-testing-playbook` tree: `find`/`rg`/`awk` counts of trees, scenario files and `### Expected` blocks, and a Python pass classifying each block's body (fence present / ellipsis present).
2. Drift replay A — the literal-naming scenario's Expected block [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90], its own Evidence block [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119] and the producer's emitted string [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637].
3. Drift replay B — the recorded `--phase-count` drift: spec 018's problem statement [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:59], its files table [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:85], a repo-wide `rg "phase-count"` over `.skilled/skills`, and create.sh's unknown-option branch [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:350].
4. Catalog census plus one live anchor resolution: the anchor-bearing catalog file [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:47] against its cited target [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts:12], and the second citation [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:48] against [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts:43].
5. CI/test discovery audit for both host validators, and spot-verification of iteration 4's load-bearing citations. Verified: the resolver export [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374], the catalog suffix strip site [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] and the per-scenario entry [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:662] all sit where iteration 4 placed them.

## Findings

### F1 — Measured: the strict-prefix comparison surface is 13 of 1,012 Expected blocks; the fire it can produce is currently true, not false

Census (commands, not estimates): 57 `manual-testing-playbook` trees; 2,682 scenario `.md` files; 1,012 `### Expected` blocks across 990 files. Of those blocks, only 13 contain a fenced literal transcript a producer comparison could anchor into, and 26 contain an ellipsis anywhere. The remaining ~999 blocks are prose or inline text where no producer-line anchoring is attempted by construction. Example of the prose convention: `sk-prompt`'s Expected block [SOURCE: .skilled/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/depth-five-phases-order.md:51] is a single prose sentence, no literal output.

Consequence for the iteration-4 residue: the F3 prefix rule's false-positive blast radius is bounded by ≤13 blocks corpus-wide (≈1.3% of Expected blocks). The only known firing is the calibration case in F2, and the document's own evidence agrees the expected line is the truncated one — so the measured false-positive count on the corpus is 0 so far, on a surface of 13.

### F2 — Live drift case found: Expected and Evidence disagree inside one document, and the producer agrees with Evidence

The literal-naming scenario's Expected block quotes the fallback warning ending `Provide --phase-names with literal slugs.` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90]. The same document's Evidence block shows the full emission ending `...literal slugs describing the concrete work.` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119], and that is exactly what `create.sh` emits [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637]. The Expected line is a strict prefix of the emitted line with no ellipsis marker, so the F3 `EXPECTED_TRUNCATED` class fires on real, current in-tree state — this is the live replay the proposal needed, already present without authoring a fixture.

### F3 — The historical `--phase-count` drift is remediated; it is a replay fixture, not live evidence

Spec 018 records that the argument loop's catch-all appended every unrecognized argument to the title words, and that the literal-naming playbook scenario and its feature catalog entry passed `--phase-count`, which never existed, hitting the same silent path [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:59]. Its files table shows both documents corrected to `--phases` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:85]. In today's tree, `rg "phase-count"` over `.skilled/skills` returns zero hits, and the parser now rejects unknown options with exit 1 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:350]. The scenario-option check would still have caught the doc side statically (the flag is absent from create.sh's declared `case` labels), but the parser fix independently closed the silent path, so this drift can only be demonstrated as a replay fixture.

### F4 — Catalog anchor census: 6 files with line anchors, 262 with paths; the sampled anchor resolves cleanly

Of 658 `feature-catalog` markdown files, 262 contain a `.skilled/` path and only 6 carry a `path:line` or `path:line-range` anchor (all under `system-skill-advisor` and `system-spec-kit`). Retaining the parsed line range at the strip site [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] therefore changes behavior on exactly 6 files today; the path-existence half reaches up to 262. Live sample: the canonical-first-spec-root-resolution entry cites `spec-root-canonical-resolver.ts:12-18` as recognizing explicit root-qualified inputs [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:47] and `:43-72` as preserving absolute/qualified paths and falling back to an existing legacy-only packet [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:48]. The resolver's `isQualifiedSpecPath` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts:12] and `resolveSpecFolderCanonical` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts:43] match both claims, so no drift was found in the sample — the check would pass it.

### F5 — Test discovery is asymmetric: the catalog fixture test is orphaned from every runner

`run-script-tests.sh` changes into its own directory [SOURCE: .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh:7] and loops only over `test_*.py` found there [SOURCE: .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh:12]. The catalog validator's fixture test lives under its own skill tree [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py:1], which that loop never sees; no workflow references `validate_catalog_package`, `test_validator_fixtures` or `sk-create-feature-catalog` at all. The playbook validator is the opposite: CI runs it fleet-wide with `--strict` [SOURCE: .github/workflows/playbook-operator-contract.yml:61] while the sk-doc runner executes only the shared test directory [SOURCE: .github/workflows/sk-doc-script-tests.yml:53]. Verdict: a check added to `validate-playbook-package.cjs` inherits enforcement on every PR and push; a check added to `validate_catalog_package.py` inherits none until its fixture test is wired into a runner — a wiring decision this research deliberately does not make.

## Questions Answered

- No new strategy key question. All five were answered in earlier iterations and stay ticked; this iteration answers the iteration-4 residue:
  - Prefix-rule false-positive rate: surface measured at 13 of 1,012 Expected blocks, with the single firing being a true positive (F1, F2).
  - Live drift replay: the literal-naming Expected/Evidence mismatch is the live case; `--phase-count` is already remediated and becomes a fixture (F2, F3).
  - Catalog CI question (iteration-4 sub-question c): orphaned fixture test confirmed; no generic discovery job runs it (F5).

## Questions Remaining

- None. The five strategy key questions remain closed, and the residue items carried since iteration 4 are now measured or resolved. What is left is synthesis work, not open questions: assemble the check codes, insertion points and fixtures into the implementation-ready spec, and decide (outside this research) whether to wire the catalog fixture test into CI.

## Next Focus

Synthesis: assemble the three checks into an implementation-ready spec — check codes (`EXPECTED_TRUNCATED` included), the two host validators and their call sites, the reused resolver, and fixtures that use (a) the live literal-naming Expected/Evidence case and (b) the recorded `--phase-count` case as replays — while stating the catalog CI-wiring gap as a finding rather than absorbing it.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
