# Iteration 009 — Verification pass: the census denominator corrected, the link basis restated, and the resolution ladder that makes or breaks the inline check

- Run: `2026-10-11T16:24:27.869Z` | Iteration 9 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: all five strategy key questions remain answered; no box is re-ticked. This iteration executes the dispatch's widening mandate with a verification edge: re-measure iteration 8's headline numbers against the tree, restate the anchor replay with a corrected extractor, and extend the measured surface to the resolution ladder the implementation spec must specify. It closes no key question; it corrects two earlier numbers, adds one drift case, and records the extractor regression set.

## Focus

1. Re-measure the playbook census denominator in both scopes (exact manual-testing-playbook trees vs the path-substring population) and re-derive conformance.
2. Re-measure the markdown-link half with per-file resolution and code-artifact filtering.
3. Measure the inline-citation resolution ladder end to end and decompose the residual into expected-unresolved families.
4. Replay the catalog anchor scan with a corrected extractor, adjudicate every fire, and pin the canonical true positive to its actual line.
5. Re-measure the prose file-line-N form and record the extractor regression set.

## Actions Taken

1. Corpus truth pass over `.skilled/skills`: 8,686 `.md` files total, 1,465 in the 57 exact `manual-testing-playbook` trees, 2,682 under a path-substring match (`broadOnly` 1,217); counted `SCENARIO CONTRACT` carriers per scope.
2. Link replay: extracted every markdown-link target in the exact tree, classified by target shape, resolved relative targets against the containing file directory, and separated directory targets and code-block artifacts.
3. Inline ladder pass: extracted 12,959 inline backticked candidate tokens (3,952 distinct) and resolved each through repo root, skill root, skill/scripts, skill/runtime, skill-subtree basename, and global basename, decomposing the residual.
4. Catalog replay: re-ran the `path:line` anchor scan over 611 catalog files with a leading-dot-capable extractor and corrected skill bases; bounds-checked every anchor; ran a token-at-line test using backticked identifiers from the citing row; pinned every mismatch to the token's actual line.
5. Prose pass and grep adjudication: re-extracted the backtick-separated line form with a complete extension set, and confirmed the create.sh, advisor-status, advisor-tool-schemas, skill-advisor-cli, advisor-recommend, and spec-folder-mutex anchors by direct grep.

## Findings

### F1 — The census denominator is corrected: exact trees hold 1,465 files (93.9% conformance), the 2,682 figure is the path-substring population [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/iterations/iteration-008.md:22]

Iteration 8's F1/F5 pair used 2,682 `.md` files as the corpus. That number is reproducible only as the path-substring population (any path containing `manual-testing-playbook`, including benchmark report trees); the 57 exact trees hold 1,465 files. The `SCENARIO CONTRACT` pair iteration 8 printed, 1,382 of 2,682, is itself the broad-scope pair (51.5%); in the exact tree the count is 1,375 of 1,465, or 93.9%. The broad-only 1,217 files are 925 cli-external-orchestration benchmark reports, 65 sk-design-diagram benchmark reports, and similar run-record corpora — none are playbook packages, and the validator discovers packages as `<skillsRoot>/<filter>/manual-testing-playbook` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:610], with `skillsRoot` defaulting to `<repo>/.skilled/skills` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:81]. Consequence for the spec: the corpus scope rule is the exact-tree rule, and every rate in this iteration uses the 1,465-file denominator.

### F2 — The link half is relative, not prefixed: 4,986 instances / 1,987 distinct, zero `.skilled`/`.opencode` targets, one deliberate missing-link fixture

The exact tree carries no `.skilled`- or `.opencode`-prefixed markdown-link target at all; iteration 8's 1,271 prefixed links do not reproduce. What exists is 4,986 relative link instances over 1,987 distinct targets; all but one resolve against the containing file's directory. The single unresolved target is `./definitely-missing-link-target-for-guard-verification.md` in the link-integrity guard scenario [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md:1] — a guard-verification target by its own name, so the extractor needs a code-fence/instruction exclusion if the gate is ever hardened. Nine targets are directories and seven are code-block artifacts (`{`, `input,`). The healthy-links conclusion survives, but the mechanism is per-file relative resolution, not repo-root prefix resolution.

### F3 — The inline check lives or dies on the resolution ladder: 14.7% root-only vs 87.0% with the ladder; residual is 1,678 instances in expected families

Over the exact tree: 12,959 inline token instances, 3,952 distinct. Resolved from repo root only: 1,906 instances (14.7%). With the ladder — skill root 2,744, skill/scripts 158, skill/runtime 59, skill-subtree basename 5,840, global basename 574 — resolution rises to 11,281 instances (87.0%), 1,678 dead (773 distinct). The dead instances decompose cleanly: placeholder/glob 449, scratch (`/tmp`, `$VAR`, `</dev/null`) 370, bare basenames absent anywhere 565, other 233, runtime/generated 46, migrated-named 12, provenance 3. Two spec-relevant facts: the load-bearing stage is skill-subtree basename resolution (5,840 instances, 45% of the corpus), and the residual is dominated by categories a check must treat as expected-unresolved, not drift. This is the false-positive estimate the earlier residue asked for: without the ladder a gate fires on ~85% of tokens; with it, ~13%, none of which is a code anchor.

### F4 — Catalog replay, corrected extractor: 34/36 anchors resolve, bounds fires 0/36, token-at-line fires 9/36, and the canonical true positive is pinned to spec-folder-mutex.ts:22

Replayed over 611 catalog files: 36 anchors in 6 files. Resolution: 26 repo-root, 5 skill/runtime, 3 skill-root, 2 unresolved — both annotated `(removed with the memory server)` rows [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:66]. Bounds check fires 0/36; the token-at-line test fires 9/36. Reproduced live: the three stale anchors — `compiledRoute` cited at `advisor-tool-schemas.ts:221`, actually at 268 [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:268]; the advisor-status contract cited at 89-94, actually at 344/345 [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:345]; the `-32602` handling cited at `skill-advisor-cli.ts:1420-1440`, actually at 1500/1501 [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1500] — plus the four loose anchors from iteration 7 (including `includeCompiledRoute` at `advisor-recommend.ts:551` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:551]), one newly adjudicated loose anchor (`advisor_rebuild` claimed inside `tools/index.ts:37-43`, actually at 59 [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/index.ts:59]), and the canonical true positive, now pinned: the row at `code-standards-alignment.md:76` cites `runtime/handlers/save/spec-folder-mutex.ts:10`; line 10 is `import { createHash, randomUUID } from 'node:crypto'` and `SPEC_FOLDER_LOCKS` is defined at line 22 [SOURCE: .skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts:22]. Nine fires, zero from bounds checks: the check's discriminating power is entirely the judgment-bound token tier, with a warn-only posture.

### F5 — The prose `file` line N form is not a singleton: 13 instances, one of them the code-file case [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:138]

With a complete extension set the backtick-separated line form numbers 13 instances across 12 files: seven `../../SKILL.md` line N references in cli-external-orchestration trees, `.hermes/SYNC.md` line 1, mcp-code-mode SKILL.md 232-233, sk-code SKILL.md 78-90, stack-detection.md 50-62, the self-referential rollback-lifecycle.md 1-72, debug.md 60-89, and the create.sh line 1084 triage line. Iteration 8's 'exactly 1' was an artifact of an extension set missing `md`. The literal-naming case remains the only code-file instance, and its target is stale: `create.sh` carries `PROVIDE-DESCRIPTIVE-SLUG` at 1060 and 1636 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060], not at 1084. The extractor needs a branch for this form; the other 12 point at documentation files and need the same resolution ladder.

### F6 — Extractor defects are the recurring failure mode; the spec must ship them as regression fixtures

Four distinct extractor defects have now skewed headline numbers before correction: `js` before `json` truncation (iteration 7), the backtick-separated line form (iteration 8), leading-dot loss in the anchor regex plus a prefix off-by-one in the skill-base resolver and a missing `md` in the extension set (iteration 9). The implementation spec must define 'candidate token' precisely (full extension set, optional line/range/anchor suffix, backticked, first whitespace token, code-fence exclusion) and pin corpus fixtures — including the stale trio, the loose set, the prose instances, and the guard missing-link target — as extractor regression tests.

## Questions Answered

- None: all five strategy key questions stay ticked from earlier iterations; no box is re-ticked.

## Questions Remaining

- No open questions. Synthesis residue for the implementation-ready spec, updated: corpus scope = exact `manual-testing-playbook` trees under `.skilled/skills`; base-resolution ladder in order repo root -> specs fallback -> skill root -> skill/scripts -> skill/runtime -> skill-subtree basename -> global basename, with trailing-argument and anchor stripping; expected-unresolved families = placeholder/glob, scratch paths, historical provenance, runtime/generated, migrated-named, annotated removals, directory targets, code-fence artifacts; anchor formats = `path:line`, `path:start-end`, inline backticked, prose file-line-N, markdown links resolved per-file; checks = existence (warn), bounds (objective, 0 corpus fires), token-at-line (warn-only, judgment-bound); fixtures = stale trio plus new `tools/index.ts:59` case, spec-folder-mutex 10->22, prose set of 13, guard missing-link target, and the extractor regression set; insertion points = `validate-playbook-package.cjs` for the playbook side and `validate_catalog_package.py` for the catalog side, with the CI wiring decision still the operator's.
- Rate denominators to restate in the final packet: all playbook-side rates use 1,465 files / 12,959 inline instances / 3,952 distinct tokens.

## Next Focus

- Iteration 10: synthesis. Fold the corrected numbers (F1, F3), the restated link basis (F2), the re-verified anchor cluster (F4), the prose class (F5), and the extractor regression set (F6) into the implementation-ready spec alongside iterations 7-8 evidence; decide with the operator whether the catalog fixture test is wired into CI.

## SCOPE VIOLATIONS

None against researched files. One instrumental temp file, `.iter-009-event.json` in the run directory, carried the single iteration record to the append gateway; all other writes were the three allowed artifacts.