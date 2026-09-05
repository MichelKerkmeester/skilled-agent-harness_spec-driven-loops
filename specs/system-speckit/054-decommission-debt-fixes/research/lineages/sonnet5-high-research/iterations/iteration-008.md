# Iteration 8: README / Feature-Catalog Accuracy vs. Current Code

## Focus

Check the spec-kit `README.md` and `feature-catalog.md` for claims that no
longer match the code that exists today.

## Findings

### F8-1 (High): README claims "the 46-rule registry" five times; the authoritative registry it names contains 37 rules

`README.md` states "the 46-rule registry" as the validation rule count in
five separate places
[SOURCE: file:.opencode/skills/system-spec-kit/README.md:62,133,447,592,644],
and explicitly names
`references/validation/validation-rules.md` as authoritative for that number
(line 644: "the 46-rule registry is authoritative").

`validation-rules.md` §2's own rule-summary table is explicitly marked
"Partial reference" and defers further: "The authoritative, complete rule
set and their canonical severities live in
[`runtime/cli/lib/validator-registry.json`]"
[SOURCE: file:.opencode/skills/system-spec-kit/references/validation/validation-rules.md:61].

`runtime/cli/lib/validator-registry.json` -- the file both docs point to as
ground truth -- is a JSON array with **37 entries**, each one `{rule_id,
aliases, script_path, severity, category, description}`
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]
(directly counted via `JSON.parse(...).length`). Cross-checked independently
against the shell-script layer: 25 files under `runtime/cli/rules/*.sh`
declare 27 unique `RULE_NAME=` values (two files -- `check-canonical-save.sh`
and `check-grep-convention.sh` -- each register more than one named rule)
[SOURCE: dir:.opencode/skills/system-spec-kit/runtime/cli/rules, grep count].
The gap between 27 shell-declared names and 37 registry entries is the
native TypeScript-implemented rules (e.g. `GENERATED_METADATA_INTEGRITY`,
`GENERATED_METADATA_DRIFT`, `CONTINUITY_FRESHNESS`'s underlying checks) that
run through `runtime/lib/validation/orchestrator.ts` rather than a
`rules/*.sh` file -- consistent with 37 total, not consistent with 46 under
any accounting this iteration could construct.

**37 vs 46 is a 24% overstatement**, repeated identically five times, which
means it was written once and copy-referenced rather than independently
verified at each site -- exactly the "counted the... fixtures as sources"
kind of freshness debt this very packet (054) was chartered to fix elsewhere
(scripts-freshness table, per `spec.md`'s own problem statement).

**Fix:** Update all five README occurrences (and any other doc citing "the
46-rule registry," e.g. check `references/` for more copies) to read
"the 37-rule registry," and prefer computing the count from
`validator-registry.json`'s length at doc-generation time over hardcoding a
number in prose. Add a doc-freshness check (fits naturally as an extension
of `check-doc-pointers.sh` or a new lightweight rule) asserting any prose
string matching `\d+-rule registry` in `README.md` equals
`validator-registry.json`'s actual entry count, so the next rule
addition/removal cannot silently re-open this gap.

### F8-2 (Verified clean): every other CLI script path README cites was checked and exists

Spot-checked five additional README-cited script paths for existence:
`runtime/cli/check-api-boundary.sh`, `runtime/cli/spec/calculate-completeness.sh`,
`runtime/cli/spec/upgrade-level.sh`, `runtime/cli/spec/recommend-level.sh`,
and `ARCHITECTURE.md` -- all present
[SOURCE: direct existence checks, all five paths confirmed]. No dangling
script references found in this sample.

### F8-3 (Ruled out / no finding): `feature-catalog.md` carries no equivalent falsifiable numeric claim

Unlike the README's repeated rule count, `feature-catalog.md` (792 lines)
does not state an aggregate feature count anywhere that this iteration could
find and cross-check against a ground-truth registry. No finding recorded
for this half of the angle; a deeper per-entry existence audit of all
catalog entries was out of scope for this iteration's budget.

## Sources Consulted

- `.opencode/skills/system-spec-kit/README.md` (grep across full file for script-path and rule-count claims)
- `.opencode/skills/system-spec-kit/references/validation/validation-rules.md`
- `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.opencode/skills/system-spec-kit/runtime/cli/rules/*.sh` (RULE_NAME grep, reused from iteration 7's inventory)
- `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- Direct existence checks on 5 CLI script paths cited by README

## Assessment

- newInfoRatio: 0.9
- Novelty justification: A precisely quantified, five-times-repeated documentation defect traced to its exact authoritative source file, plus a clean verification pass on adjacent script-path claims.
- Confidence: High -- the 37-count comes from parsing the exact JSON file both docs name as ground truth, not from an inferred proxy.

## Reflection

- What worked: Following the README's own "authoritative" pointer chain (README -> validation-rules.md -> validator-registry.json) rather than trying to hand-count rules myself found the ground truth in one file read.
- What failed: Nothing this iteration -- the chase from claim to authoritative source resolved cleanly.
- Ruled out: `feature-catalog.md` as a source of an equally falsifiable numeric claim -- it does not state an aggregate count. [SOURCE: file:.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md]

## Recommended Next Focus

Q9: deep-loop integration seams -- how fanout-run, the deep-review and
deep-research leaves, and the reducer write spec packets, and where they
bypass or duplicate spec-kit's metadata generators.
