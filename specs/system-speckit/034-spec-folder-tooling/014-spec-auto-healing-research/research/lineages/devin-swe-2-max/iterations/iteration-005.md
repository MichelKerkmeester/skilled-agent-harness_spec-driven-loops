# Iteration 5: Q3 - old-version detection surfaces and the /doctor:update boundary

## Focus

How an older or pre-v4 repo is detected today (template staleness checker, manifest migration policy, pre-v4 layout refusal), and whether `/doctor:update` wires corpus healing to a tooling upgrade.

## Actions Taken

1. Re-read `steer.md` sections 3-5 (sources, output shape, iteration plan).
2. Read `check-template-staleness.sh` in full.
3. Read `templates/MIGRATION.md` and `templates/CONTRACT.md` in full.
4. Read `.skilled/commands/doctor/update.md` router contract.
5. Grepped all `doctor-update-*.yaml`, `doctor-update-presentation.txt`, `release-update.cjs`, and `doctor-speckit` assets for `upgrade-legacy|upgrade|legacy|heal|migrat|corpus|specs/` references.

## Findings

1. `templates/MIGRATION.md` codifies the migration-safety policy: legacy `SPECKIT_TEMPLATE_SOURCE` markers (e.g. `spec-core | v2.1`) remain supported indefinitely; readers must parse but must not reject historical packets; writers always emit the current manifest version; and "The derived list is read-only compatibility data. Do not rewrite old packets only to normalize marker style". CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24-40]
2. `check-template-staleness.sh` is the per-folder version detector: it reads the `SPECKIT_TEMPLATE_SOURCE` marker within spec.md's first 30 lines and compares it to `spec-kit-docs.json`'s `versions["spec.md.tmpl"]`; a folder with no marker is classed `none` and counted stale, a missing spec.md is `missing` and non-fatal; its `find` does not exclude `z_archive`, so archived packets are censused while repair tools skip them by default. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:67-90,96-108,143-168,247]
3. `--auto-upgrade` in the staleness checker sed-rewrites only the version token of `SPECKIT_TEMPLATE_SOURCE:` in seven known doc basenames, preserving the template id - but it writes a version the document was never rendered from. If the marker is provenance ("this doc came from template X vY"), this invents history; if it means "target contract", the same line is a claim the doc now conforms to a contract nobody checked. CONFIRMED (behavior); INFERRED (provenance falsity - confirming check: whether any reference defines the marker as rendered-by provenance rather than contract target) [SOURCE: check-template-staleness.sh:171-186; MIGRATION.md:27]
4. `/doctor:update` is a checkout-unit alignment tool: five actions (check/align/apply/rollback/record-base) routed to YAMLs driving `release-update.cjs`; its apply workflow re-verifies generated files (trigger index, runtime mirrors, prompt syncs) but no step touches the spec corpus. CONFIRMED [SOURCE: .skilled/commands/doctor/update.md:16,37-42,68-72; .skilled/commands/doctor/assets/doctor-update-apply.yaml:155-189]
5. Corpus migration is orphaned: a grep across `doctor-update-*.yaml`, the presentation asset, `release-update.cjs`, and all doctor-speckit assets finds zero references to `upgrade-legacy`, healing, or spec-folder migration - the only corpus-adjacent line in the whole stack is a fixtures-path exclusion regex in `release-update.cjs`. CONFIRMED [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:105 (only corpus-adjacent hit); absence verified across assets/doctor-update-*.yaml and assets/doctor-speckit-*]
6. The hook point for migration guidance already exists: `doctor-update-check.yaml` carries status-specific next-step explanations ("databases: Name /doctor:skill-advisor rebuild ..."), so a "corpus migration" status can slot into the existing presentation contract without inventing a channel. CONFIRMED [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:142-144]
7. Repo-era signals are scattered across three tools with no unified detector: `.opencode/specs` layout (upgrade-legacy root refusal), absent marker (staleness `none`), legacy marker version (staleness stale + MIGRATION.md grandfathering), missing `description.json`/`graph-metadata.json` (validator FILE_EXISTS/GENERATED_METADATA_INTEGRITY). CONFIRMED (the four signal sites); INFERRED (no single era-detection module exists - confirming check: a module grep for a function combining these signals; none seen in any file read) [SOURCES: upgrade-legacy.mjs:151-162; check-template-staleness.sh:82-90,165-168; MIGRATION.md:24-25; validator-registry.json rules]
8. `CONTRACT.md` establishes `spec-kit-docs.json` as the private contract source mapping public Levels to document sets and section gates - which means a pre-v4 packet's missing/extra docs are mechanically derivable by comparing on-disk basenames against the level's manifest set; MIGRATION.md section 2 already encodes that derivation rule for legacy packets. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/templates/CONTRACT.md:39-48,16; MIGRATION.md:31-38]

## Ruled Out

- Making `/doctor:update apply` run corpus repair automatically as part of the release apply: apply's own contract says it "applies selected decisions and verifies the resulting checkout" for release units; silently mutating thousands of packet docs inside a tooling upgrade violates the action's stated mutation boundary and the derived-vs-authored rule. Guidance, not auto-repair.
- Rewriting old packets to normalize marker style: explicitly prohibited by MIGRATION.md line 40.

## Dead Ends

None.

## Edge Cases

- Contradictory evidence: the staleness checker's `--auto-upgrade` writes a version claim vs MIGRATION.md's "writers always emit the current manifest-backed marker version" - the two can be reconciled only under a "target contract" reading of the marker, which no file yet read defines. Recorded as finding 3 with its confirming check named.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R5.1 | Add a corpus-migration guidance step to `/doctor:update check` and `apply` verify: run `upgrade-legacy.mjs` (no --apply) after a release bump and surface "N packets failing / M repairable / K would be recorded" in the existing status-explanation slot | Q3 | doctor-update-check.yaml + doctor-update-apply.yaml verify steps + presentation txt | M | Low: dry-run only, read-only report; reversal = remove step | 2 YAMLs, presentation.txt, tests | upgrade-legacy.mjs:464-473 dry-run path; doctor-update-check.yaml:142-144 slot | CONFIRMED gap; INFERRED UX fit |
| R5.2 | Restrict `check-template-staleness.sh --auto-upgrade` (or rename `--retarget-marker`): bump the marker only for docs whose anchor set matches the target template (heal-spec-docs evidence standard), else report "needs re-render or heal-spec-docs"; never sed a version into a doc that cannot prove it | Q3 | check-template-staleness.sh:171-186 | M | Med: behavior change to an existing flag; reversal = keep old flag name as alias | staleness script + its test | findings 2-3 above | CONFIRMED risk; INFERRED anchor-match reuse |
| R5.3 | Ship a single `repo-era` detector emitting a structured report (v3 layout present? unmarked docs count? missing generated metadata count?) consumed by `/doctor:update check` and by `upgrade-legacy` before its first validation pass | Q3 | new `spec/repo-era.mjs` + doctor-update-check step | M | Low: read-only aggregation; reversal = delete module | new module + check YAML | finding 7's four signal sites | INFERRED |
| R5.4 | Align archive policy between census and repair: staleness checker counts z_archive folders while healers skip them; document one rule ("census includes archives, repair is opt-in via --include-archive") in README + tool headers | Q1/Q3 | check-template-staleness.sh header + README-repair-derived.md | S | Low: docs only | 2 doc files | finding 2 scope contrast | CONFIRMED |

Idempotency/reversal/meaning: R5.1 is a read-only invocation (no write). R5.2 narrows what may be rewritten (strictly safer; reversal = flag alias). R5.3 is pure aggregation. R5.4 is documentation. None changes what a document says.

## Sources Consulted

- `steer.md` (lead brief)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` (full, 251 lines)
- `.skilled/skills/system-spec-kit/templates/MIGRATION.md` (full, 53 lines)
- `.skilled/skills/system-spec-kit/templates/CONTRACT.md` (full, 109 lines)
- `.skilled/commands/doctor/update.md` (full, 72 lines)
- `.skilled/commands/doctor/assets/doctor-update-{check,align,apply,rollback,record-base}.yaml` (grep)
- `.skilled/commands/doctor/scripts/release-update.cjs` (grep)
- `.skilled/commands/doctor/assets/doctor-speckit-*` (grep)

## Assessment

- New information ratio: 0.8 (findings 1-6 new; 7-8 synthesize prior reads)
- Questions addressed: Q3 (detection surfaces + doctor:update boundary now mapped end to end)
- Questions answered: Q3's detection leg effectively answered; the "how to migrate safely" leg rests on upgrade-legacy + MIGRATION.md policy (iterations 8-9 will confirm reversibility/backup mechanics)

## Reflection

- What worked: the grep-for-absence was decisive - corpus healing is genuinely orphaned, not merely hard to find.
- What did not: `doctor-speckit` turned out to be retrieval-health only, not corpus repair; assumed breadth corrected.
- Do differently: verify whether `upgrade-baseline.json` recording is itself the migration-completion signal a future `/doctor:update check` could read.

## Recommended Next Focus

Iteration 6 (Q1 start): map each phase-013 one-off script (`fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `val-detail.sh`, `fix-queue.sh`, worker lanes) to the permanent tool that should own it, using the scratchpad sources.
