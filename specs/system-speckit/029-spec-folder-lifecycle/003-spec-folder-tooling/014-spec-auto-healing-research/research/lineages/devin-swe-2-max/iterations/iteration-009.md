# Iteration 9: Q3 - the pre-v4 detection story, consolidated

## Focus

Assemble every era-detection signal the codebase already has, test whether a unified detector exists, and pin down what "a v3 checkout" means concretely.

## Actions Taken

1. Re-read `steer.md`.
2. Checked the checkout for `.opencode` and `specs` roots; grepped spec-kit docs for `.opencode/specs` and v3/v4 references.
3. Read `git log` for `upgrade-legacy.mjs` provenance (introduced 2026-09-25, "no-model upgrade command for v3 spec folders").
4. Read `spec/README.md`'s upgrade-legacy row and neighboring rows (archive.sh, sweep-track-roots.mjs, refresh-track-roots.mjs contracts).
5. Grepped and read `retrieval/lib/corpus.mjs` alias folding and `rg-wrapper.mjs` source-root resolution.

## Findings

1. This checkout is itself post-migration: `.opencode/` exists but `.opencode/specs` does not; packets live under top-level `specs/`. The v3->v4 move this repo performed is the same recipe upgrade-legacy prints (`git mv .opencode/specs specs` + symlink back). CONFIRMED [SOURCE: repo root listing (`.opencode` present, `.opencode/specs` absent); upgrade-legacy.mjs:151-162]
2. `upgrade-legacy.mjs` is officially the v3-migration command: `README.md:113` names it "Upgrades a specs tree written under v3.x", introduced 2026-09-25 as "a no-model upgrade command for v3 spec folders" - i.e., deterministic, no LLM required, which directly serves the "external users on older versions are not burdened" requirement. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113; git log 6024a0813cd]
3. The retrieval stack is already dual-era aware: `corpus.mjs` folds the `.opencode/specs/` alias onto canonical `specs` for indexing, and `findSourceRoot`/`searchRootsFor` treat a checkout carrying only `.opencode` as valid ("searched there, not in a .skilled that does not exist"). So a v3 layout keeps retrieval working even before migration. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:36-47,138-152; retrieval/rg-wrapper.mjs:72-85]
4. Era signals inventory (each confirmed at its site): (a) `.opencode/specs` real directory -> upgrade-legacy refusal + recipe; (b) absent SPECKIT_TEMPLATE_SOURCE marker -> staleness `none` (counted stale); (c) legacy marker version -> staleness `stale` + MIGRATION.md indefinite read support; (d) missing description.json/graph-metadata.json -> validator FILE_EXISTS / GENERATED_METADATA_INTEGRITY; (e) failing packets under --strict = era debt, which is precisely what upgrade-legacy's validate-all enumerates. CONFIRMED [SOURCES: upgrade-legacy.mjs:151-162; check-template-staleness.sh:82-90,165-169; MIGRATION.md:24-27; validator-registry.json rule names]
5. No unified "repo era" detector exists: the signals in finding 4 live in three tools with three output shapes, and nothing answers "which era is this checkout" in one report. INFERRED (absence across all files read; confirming check: a module that consumes more than one of the signals - none observed) [SOURCES: the four signal sites listed in finding 4]
6. Legacy-era docs still instruct writers to use `.opencode/specs` as a first-class root: spec-folder-write-recipe.md:55 and spec-folder-authoring-checklist.md:26 both bless `specs/` OR `.opencode/specs/`, and auto-mode-contract.md:31 resolves paths under either - meaning a v3 checkout can keep WRITING new packets into the old root where v4 derivation tools only half-serve it (upgrade-legacy refuses it outright). CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md:55; spec-folder-authoring-checklist.md:26; auto-mode-contract.md:31; upgrade-legacy.mjs:156-163]
7. Neighboring rows in spec/README.md show archive/track mechanics that interact with migration: archive.sh refreshes the track root's children_ids after a move but leaves a phase parent's graph-metadata.json untouched ("its writer drops a child only through a reviewed prune") - so a v3-era archive layout also carries stale parent children_ids that only a sweep can reconcile. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:107-112]

## Ruled Out

- Auto-moving `.opencode/specs` inside upgrade-legacy: the tool deliberately stops and prints the recipe instead of running `git mv` itself; a migration command performing git mutations on the user's behalf (rm symlink, git mv, ln -s) crosses the tool's no-side-effects boundary. Keep it a printed recipe.
- Adding `.opencode/specs` support to the healer fleet (running v4 repair on a v3 root): the derivation tools resolve against `specs/`; half-repairing a v3 tree is worse than refusing, which is what the code does.

## Dead Ends

- `lib/corpus.mjs` lives under `retrieval/lib/`, not `cli/lib/` - path in the reference doc was relative to the retrieval dir. Resolved.

## Edge Cases

- A mixed checkout (packets split across specs/ and .opencode/specs) would be validated twice by naive discovery; upgrade-legacy's realpath dedup already handles the symlinked case, and corpus.mjs's byRealPath map handles index-side dupes.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R9.1 | Ship a `spec/repo-era.mjs` (or `upgrade-legacy --detect`) emitting one JSON era report: layout (v3 `.opencode/specs` vs v4 `specs/`), marker census (current/stale/none/missing), generated-metadata presence, failing-packet count under --strict. Consumed by /doctor:update check's next-steps and by upgrade-legacy's preflight | Q3 | new module under spec/ + check YAML routing | M | Low: read-only aggregation of existing signals | new module, doctor-update-check.yaml | finding 4 signal inventory; check.yaml:136-146 | INFERRED design, CONFIRMED signals |
| R9.2 | Narrow the write-recipe docs: on a v3 checkout, new packets must go under the post-move `specs/` (via the symlink) rather than `.opencode/specs/` - one sentence in the two authoring references prevents new-era debt in old-layout repos | Q3 | spec-folder-write-recipe.md:55 + spec-folder-authoring-checklist.md:26 | S | Low: docs only | 2 reference docs | finding 6 | CONFIRMED |
| R9.3 | Reuse `upgrade-baseline.json` as the era-debt ledger: the era report + per-packet baselines together give an external user a complete "what my repo owes" view without a running tally doc | Q3 | none new - reuse + document in README/upgrade row | S | Low: docs | README.md row 113 vicinity | upgrade-legacy.mjs:421-458; README.md:113 | CONFIRMED mechanism, INFERRED doc placement |

Idempotency/reversal/meaning: R9.1 pure read. R9.2 docs. R9.3 docs. Nothing mutates packet content or provenance.

## Sources Consulted

- `steer.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` (rows 105-115)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` (:36-47,138-152,320)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` (:65-85)
- `.skilled/skills/system-spec-kit/references/workflows/{spec-folder-write-recipe,spec-folder-authoring-checklist,auto-mode-contract}.md` (grep)
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` (:280)
- `git log` for upgrade-legacy.mjs (6024a0813cd, 2026-09-25)

## Assessment

- New information ratio: 0.8 (findings 1-4,6,7 new evidence; 5 consolidates)
- Questions addressed: Q3 detection leg now complete - signals enumerated, unified detector gap named, v3 contract defined
- Questions answered: Q1, Q3 (detection + migration vehicle + doctor integration + safety contract all evidenced; residual = no rollback manifest, era report missing)

## Reflection

- What worked: the README's own description of upgrade-legacy ("Upgrades a specs tree written under v3.x") is the authoritative statement that the Q3 vehicle exists and is no-model by design.
- What did not: corpus.mjs path assumed from a reference doc; resolved by find.
- Do differently: check `changed-packet-validation.yml` next for the CI-side drift surface feeding Q5.

## Recommended Next Focus

Iteration 10 (Q3 close + Q4 open): verify what `archive.sh`'s parent-children_ids policy means for healed archives, then pivot to the branch's own changes - start with the CI trigger-index rebuild job and token push.
