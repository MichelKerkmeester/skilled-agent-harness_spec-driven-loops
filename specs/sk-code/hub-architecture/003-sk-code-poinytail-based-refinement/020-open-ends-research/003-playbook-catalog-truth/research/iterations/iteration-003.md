# Iteration 003 — Q3 tested against the code: the lightest check's calibration and its blind spots

- Run: `2026-10-11T16:24:27.869Z` | Iteration 3 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: the dispatch focus named Q3, while the findings registry marks Q3 resolved at iteration 2 and iteration 2's own Next Focus named Q4. Treated as a stale focus projection; this iteration executed Q3's proposed checks against the corpus as read-only experiments (turning the design claims into observed behavior) and then answered Q4 with the miss inventory those experiments produced. Recorded as an observation, not a halt — the run is unattended.

## Focus

Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
Carried and answered in passing: Q4, seeded by the boundaries iteration 2 declared (textually-present-but-wrong expected text, wrong flag values, in-range content drift, agent/skill steps without an option surface).

## Actions Taken

1. Extracted `create.sh`'s executable option surface: the `case` labels (lines 80–257, including `--level` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:83], `--phases` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:186], `--phase-names` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:204], `--short-name` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:243]), its value validation (`--level` against `1, 2, 3, 3+, phase-parent, review, research` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:95]; `--phases` positive integer [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:198]) and its unknown-option catch-all that exits 1 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351].
2. Ran the proposed flag check by hand over the corrected literal-naming exemplar: every flag it passes to `create.sh` (`--short-name`, `--level`, `--phase`, `--phases`, `--path`, `--phase-names`) is a `case` label, and no unknown option would fire. The check resolves clean on the exemplar.
3. Compared the exemplar's `### Expected` block [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90] with the producer's exact warning string [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637] and with the same document's own `### Evidence` block [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119].
4. Took a corpus-wide `--flag` inventory over `.skilled/skills/*/manual-testing-playbook/**/*.md` (grep counts, read-only). The top of the inventory is dominated by non-repo executable flags: `--json` 191, `--porcelain` 165, `--format` 79, `--scope` 65, `--dry-run` 64, `--ff-only` 20, `--no-verify` 20.
5. Located where those flags live besides command fences: the exemplar's evidence block carries four `node --trace-warnings` lines [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:123], and a sk-git scenario carries `--no-verify` in description and objective prose [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/safety-refusals/no-verify-bypass-refused.md:28].
6. Read the consumer-side verdict semantics: `resolveTracked` declares `in_range` on a line-count bound alone [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:294], and `classify()` returns null (pass) for `in_range` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:282]. No code anywhere compares cited content to the cited line.
7. Checked command carriers other than fenced blocks: a playbook command row lives in a markdown table cell with `agent:` steps inside it [SOURCE: .skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md:50].
8. Confirmed a canonical mode set exists for agent/skill steps: the mode registry declares itself the single source of truth for `workflowMode` identity [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:5].

## Findings

### F1 — Q3's option check resolves on the corrected exemplar; executable attribution, not token extraction, is the load-bearing step

Every flag the exemplar passes to `create.sh` is a `case` label, and the unknown-option branch now fails execution closed [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351], so name-level static checking mirrors the runtime contract exactly. But a check that extracts `--flag` tokens without naming the invoked executable would collide with the corpus: non-repo flags dominate the inventory (`--porcelain`, `--ff-only`, `--no-verify`), and flag-like tokens appear in evidence output [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:123] and prose [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/safety-refusals/no-verify-bypass-refused.md:28]. The check must scope extraction to command carriers (fenced command blocks and command-table cells) and attribute each flag to the executable the step invokes, skipping steps whose executable is not a tracked repo script.

### F2 — The exemplar carries a live Expected-vs-producer drift that a token-presence check would pass

The `### Expected` block shows the warning lines ending `Provide --phase-names with literal slugs.` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90], while `create.sh` emits `Provide --phase-names with literal slugs describing the concrete work.` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637], and the same document's `### Evidence` block shows the full phrase [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119]. Either the Expected text is truncated (drift) or deliberately abbreviated — as written the document disagrees with its producer and with its own evidence. Iteration 2's literal-token check passes all three because the distinctive tokens match; an expected-line check normalizing dynamic segments (`'$_child_slug'`, `$$`, `[123]`) and requiring the remainder to appear in a script-emitted string catches exactly this case. This is the calibration case for the expected-answer half of Q3; reported, not fixed.

### F3 — Wrong values split by runtime coverage: validated options already fail closed, free-form values have no catcher

`--level` rejects anything outside `1, 2, 3, 3+, phase-parent, review, research` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:95] and `--phases` rejects non-positive-integers [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:198], so those value classes are caught at execution by the producer. A static name check sees none of this; the cheapest shift-left is to read the enumerated values out of the script's own validation where it enumerates them, and to accept runtime-only coverage where values are free-form.

### F4 — Nothing anywhere compares cited content: `in_range` is a bounds verdict, and every consumer treats it as passing

`resolveTracked` returns `in_range` when the line fits the file's line count [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:294], and the existing consumer's `classify()` returns null for it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:282]. A catalog anchor whose target content changed in place resolves green. The cheapest candidate catcher reuses data the scanner already extracts — the citation's `sentence` and `claim` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:229] — by requiring a distinctive claim token at the cited line; it can only be advisory, because anchor prose legitimately paraphrases.

### F5 — Miss inventory and catchers for the lightest check (Q4 answer)

1. **Valid flag name, wrong value** — value-grammar extraction where the script enumerates values; runtime catches the rest at execution (F3).
2. **Expected text present as tokens but the full expected line wrong** — whole-expected-line anchoring with dynamic-segment normalization (F2); token presence alone is insufficient.
3. **Semantically wrong expectation while every literal exists** (wrong branch, count, ordering, exit code) — nothing cheap; it needs execution, and the playbook package ships no runner, so this stays out of reach for any static check.
4. **In-range content drift behind a resolvable anchor** — the claim-token advisory (F4); nothing fail-closed.
5. **Flags of non-repo executables** — no in-repo source of truth; attribution and skip is the only correct treatment (F1).
6. **Commands outside fenced blocks and steps invoking skills/agents** — command-table cells exist today [SOURCE: .skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md:50], so extraction scope must include them; `agent:`/skill steps have no option surface, and only their mode names are checkable, against the mode registry [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:5].
7. **Catalog wiring coverage differs by option** — a local bounds test in the Python validator covers only the four-prefix paths the validator already resolves [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593], while a scanner consumer reaches every tracked path [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374]; the miss inventory should be stated per wiring option.

## Questions Answered

- answered: Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
  - Now tested against the code, not just designed: the option check resolves clean on the corrected exemplar and must attribute flags to invoked repo scripts (F1); the expected-answer check must anchor whole expected lines, because the live exemplar case shows token presence is not enough (F2); the catalog anchor check retains the `:line` suffix and resolves it, failing dead verdicts, with content-at-line explicitly out of scope (F4). Lightest overall stays three in-place extensions — `validate-playbook-package.cjs` beside its existing marker checks [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:254], the catalog validator's retained suffix [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593], and reuse of the scanner's resolver [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374]. No new tool, no execution, no new registry.
- answered: Q4: Which drift classes would that lightest check still miss, and what would catch each one?
  - The seven classes in F5, each with its catcher or the honest "nothing cheap catches this" for semantic expectations that need execution.

## Questions Remaining

- Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

## Next Focus

Q5, with the candidate set already visible: `validate-playbook-package.cjs` (one function beside `REQUIRED_COMMAND_SEQUENCE`), `validate_catalog_package.py` (retain the stripped suffix), `cite-drift-scan.mjs` (resolver and the `sentence`/`claim` data), `check-source-tags-helper.mjs` (consumer shape), `validate_document.py` (existing `--advise` invocation), and the mode registry's drift-guard precedent for agent-step mode names. One calibration question rides along: the exact wildcard normalization for whole-expected-line anchoring, since F2's catch depends on it.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
