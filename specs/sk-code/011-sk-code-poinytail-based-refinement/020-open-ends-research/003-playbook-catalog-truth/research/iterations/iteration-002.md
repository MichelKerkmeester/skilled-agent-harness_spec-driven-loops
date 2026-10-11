# Iteration 002 — Q3: The lightest self-check for scenario options/expected answers and catalog code anchors

## Focus

Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?

Iteration 1 established where drift hides and which checks touch code today: the playbook validator resolves links only, the catalog validator checks file existence with line suffixes stripped, and `cite-drift-scan.mjs` already resolves `path:line` citations across both corpora but no CI runs it [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:115]. This iteration tested candidate self-checks against the actual drift exemplar (the fixed `--phase-count` scenario and its catalog twin) and against the existing resolver surface.

## Actions Taken

1. Read the exemplar pair — `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md` and its catalog entry — to see where options and expected answers physically live (fenced `### Commands` blocks, `### Expected` blocks, SOURCE FILES rows).
2. Inspected the catalog validator's anchor handling: `LINE_RANGE_SUFFIX_RE` strips `:line` / `:line-end` before existence checks in both SOURCE FILES cells [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] and prose paths [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:332].
3. Read the scanner's entry contract and classified surfaces: exported `resolveCitation` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374], `main()` exit semantics [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1178], `--advise` path [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1212].
4. Searched for any existing CLI-flag extractor over scenario commands (targeted `extractFlag|OPTION_FLAGS|KNOWN_OPTIONS` search across `.skilled/skills`) — no hit; the playbook package ships only the validator and templates, no runner.
5. Verified the expected-answer literal anchoring hypothesis against the corrected exemplar: `PROVIDE-DESCRIPTIVE-SLUG` and the warning prefix exist in the producing script [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1636].
6. Confirmed the reuse precedent: `check-source-tags-helper.mjs` already imports the scanner's regexes, tracked-file listing, redirects and resolver [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:24], and `validate_document.py` already shells `cite-drift-scan.mjs --advise` per document [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1843].

## Findings

### F1 — The catalog validator throws the anchor away before checking it

Both anchor paths strip the `:line` / `:line-end` suffix before resolution: SOURCE FILES cells [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] and prose paths [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:332]. Catalog prose cites line ranges heavily — e.g. `canonical-first-spec-root-resolution.md` carries a dozen `path.ts:start-end` citations [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md:47]. So the lightest catalog-anchor check is not a new tool but a retained suffix: keep the parsed range, resolve it with the already-exported `resolveCitation` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374], and fail the classes that mean the anchor is dead (`past_end`, `moved_past_end`, `unresolved`). Two wiring options, lightest first: (a) a local bounds test in the Python validator (`1 <= start <= end <= line_count`) — a few lines, covers the `past_end` class only; (b) invoke the scanner's existing `--advise <leaf>` mode, which `validate_document.py` already does [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1843], for the full verdict taxonomy at the cost of one zero-model-call subprocess per leaf.

### F2 — No check extracts CLI flags from scenario commands; the static extraction is cheap

A targeted search for flag/option extraction over the sk-doc and system-spec-kit trees returns nothing; the playbook validator's only command-related rule is the section-presence check `REQUIRED_COMMAND_SEQUENCE` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:254]. The lightest option check is fully static and needs no registry: extract `--flag` tokens from fenced command blocks, identify the script each command invokes, and require every flag to appear as a `case` label in that script — `create.sh` shows the canonical shape [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:186]. This is the doc-side mirror of the runtime contract the `018-create-sh-unknown-options` fix installed: unknown options are now rejected at execution, and this check would reject them at authoring time. It belongs in `validate-playbook-package.cjs` beside the existing marker checks, Node-only, zero execution.

### F3 — Expected answers are anchorable as literal tokens in the producing script

The exemplar's `### Expected` block asserts literal output (`PROVIDE-DESCRIPTIVE-SLUG`, `[speckit] Warning: Falling back to generic phase name`, exit code `0`), and both distinctive literals exist in the producing script [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1636]. The lightest expected-answer check is therefore literal presence: distinctive literals extracted from `### Expected` (all-caps tokens, bracketed prefixes, backticked strings) must appear in at least one script named by the scenario's own Commands block. This is the same shape as the existing doc-to-code cross-check `validate-doc-model-refs.js` (doc literal resolved against a code-owned canonical set), and it is the lightest partial answer to "expected answers tested against code": it catches renamed or removed output strings, not semantically wrong expectations.

### F4 — The scanner is report-only; any gate needs a consumer that interprets verdicts

`main()` returns 0 once the report prints, and `--advise` returns 0 unless the invocation itself is bad [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1178]. `check-source-tags-helper.mjs` is the existing consumer shape: it imports the resolver, emits `WARN <doc>:<line> <citation> <class>` records, and exits 0 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:24]. So "wiring the scanner into CI" is really "adding one strict consumer", and the same consumer pattern is what a playbook/catalog anchor gate would reuse.

### F5 — The playbook package has no runner, so the lightest check must be static

The package ships only `validate-playbook-package.cjs` and the two templates; there is no harness that executes scenario commands. This reinforces iteration 1's ruled-out direction: the lightest self-check is static extraction and resolution, not execution.

## Questions Answered

- answered: Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
  - **Catalog code anchors**: stop stripping the `:line`/`:line-end` suffix [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593] and resolve anchors through the exported `resolveCitation` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374] — locally as a bounds test, or via the `--advise` shell-out the repo already uses [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1843] — failing `past_end`/`moved_past_end`/`unresolved`.
  - **Scenario options**: a static flag-token extraction in `validate-playbook-package.cjs` — every `--flag` in fenced command blocks must be a `case` label of the script the command invokes [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:186] — mirroring the runtime rejection the 018 fix installed. No registry, no execution.
  - **Scenario expected answers**: literal-token anchoring — distinctive literals in `### Expected` must exist in the producing script named by the Commands block, verified on the exemplar [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1636]; the pattern copies the existing `validate-doc-model-refs.js` doc-literal-to-code-set cross-check.
  - Overall: two in-place validator extensions (one Node function in the playbook validator; one retained-suffix resolution in the catalog validator or its scanner consumer). No new tool, no execution, no new registry.

## Questions Remaining

- Q4: Which drift classes would that lightest check still miss, and what would catch each one?
- Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

## Next Focus

Q4, seeded by this iteration's boundaries: expected answers that are textually present but semantically wrong (values, counts, exit codes, ordering), flag values that are wrong while the flag name exists, in-range content drift behind an anchor that still resolves, and steps that invoke skills/agents rather than repo scripts and so have no option surface at all. For each, name the cheapest catcher — and the honest "nothing cheap catches this" where that is the answer.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
