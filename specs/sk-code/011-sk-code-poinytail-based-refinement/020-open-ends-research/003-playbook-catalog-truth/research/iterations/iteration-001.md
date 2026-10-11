# Iteration 001 -- Where playbook scenarios and catalog entries drift, and what catches it

- Run: `2026-10-11T16:24:27.869Z` | Iteration 1 of 10 | Mode: research | Route: @deep-research (native)
- Grounding: prior drift cases recorded in Known Context (the `--phase-count` option accepted silently by `create.sh`; the DOC-331 admission scenario whose expected answer disagreed with the router) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/deep-research-strategy.md:165].

## Focus

Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift?
Carried in passing: Q2, because both validators had to be read in full to answer Q1's "what catches it".

## Actions Taken

1. Read `validate-playbook-package.cjs` (846 lines) end to end and mapped every check family: sections, required content markers, filename slugs, link paths, evergreen/placeholder rules, verdict vocabulary, prompt sync, root-index census, duplicate IDs [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:662].
2. Read `validate_catalog_package.py` (1042 lines) end to end: root-leaf bijection, SOURCE FILES path existence, prose path existence, taxonomy, root-leaf parity, packet-history ban, shipped-label cross-check, workflowMode parity [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:897].
3. Traced enforcement wiring: which CI workflow runs which checker, and which checker has no workflow at all.
4. Located the repository's existing line-level citation scanner, `cite-drift-scan.mjs` (1450 lines), and read its extraction, resolution and corpus logic [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:219], [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:677].
5. Sampled the sk-doc corpus (scenarios SD-021/SD-022, catalog leaf FCR-003) to confirm anchor conventions in practice.

## Findings

### F1 -- The playbook validator tests document shape and link existence, never behavior

Its only checks that touch the repository are local-markdown-link resolutions: a cited local link that is missing, differs only by case, escapes the repo, or resolves through a symlink gets `PATH_MISSING` / `PATH_CASE_MISMATCH` / `PATH_OUTSIDE_REPO` / `PATH_SYMLINK_OUTSIDE_REPO` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:339]. Everything else is document-level: required sections and order, presence markers for prompt/command sequence/expected signals/evidence/pass-fail/triage, forbidden verdict vocabulary, and a warning when prompt copies disagree [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:559]. A scenario's Exact Command Sequence is only required to exist; the `REQUIRED_COMMAND_SEQUENCE` check accepts any text, including `agent:` steps the validator never executes [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:254]. This gate does run fleet-wide in CI on every PR, push and nightly schedule, and separately asserts every fail-closed root is still discovered [SOURCE: .github/workflows/playbook-operator-contract.yml:61], so link-level drift in playbook scenarios is caught hard. Option/expected-answer drift against the code is not.

### F2 -- The catalog validator's code-touching surface is best-effort path existence only

`check_source_file_paths` accepts a SOURCE FILES cell only when it is a doc-relative markdown link or a bare path starting with one of four prefixes ('.skilled/', '.opencode/', '.claude/', '.codex/') [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:547]; a trailing `:123` or `:123-145` locator is stripped before the existence check, so line anchors are never validated [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:552]. Prose path tokens are limited to the same four prefixes [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:488]. Any other repo path in a catalog (a `scripts/`, `src/`, or unlisted tree) is a coverage gap the script documents as intentional, "an unresolved cell is a coverage gap, never a false violation" [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:561]. Titles, descriptions, taxonomy, packet history and shipped labels are all cross-file document parity, and the shipped-label check compares the label to the presence of implementation rows, not to code [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:749]. The mode's own docs say the remaining verification is manual: source-anchor accuracy "still require[s] manual review" [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:378], and the validator machine-checks structure "but not cross-file link targets or source-anchor accuracy" [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:343].

### F3 -- A line-level citation scanner already exists and already covers both corpora -- but nothing in CI runs it

`cite-drift-scan.mjs` extracts every `path:line` or `path:line-end` span outside fenced blocks, one entry per occurrence, and resolves each against the committed tree, classifying in_range / past_end / moved_in_range / moved_past_end / basename_only / ambiguous / unresolved / refused [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:219]. Its skills corpus is every tracked `.md` under `.skilled/skills/`, grouped per skill [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:677] -- which already includes the scenario files and the feature-catalog leaves. `past_end` means the cited line sits past the target's last line; `moved_*` needs a rename vouched for by the redirect table [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:358]. The default run makes zero model calls. No workflow references `cite-drift` (grep over `.github/workflows/` returns nothing). Its per-document form is only a trailing advisory in `validate_document.py`, and system-spec-kit's SOURCE-tag rule imports it for spec docs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:30].

### F4 -- Enforcement is asymmetric and line-window-blind

Playbook drift is gated on every PR/push/schedule; the catalog package validator is referenced by no workflow at all -- only its own tests run in CI [SOURCE: .github/workflows/sk-doc-script-tests.yml:53] -- so catalog anchor drift is caught when an author chooses to run it, plus review. Even where existence is checked, a citation whose target content moved downwards but stayed within the file's line count resolves `in_range`: the scanner tests only that the line is within bounds, and a moved-content citation can only be detected via the rename table for whole files, never for shifted lines inside a file [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374]. Nothing today compares a cited line's content to the claim that cites it.

### F5 -- The one existing doc-to-code registry cross-check is the shape to copy

`validate-doc-model-refs.js` loads canonical model names from a code registry (`system-spec-kit/shared/embeddings/registry.ts`) and flags markdown that cites a non-canonical model name as default; its header states the mandate plainly: it "detects doc drift where markdown cites a non-canonical model name as default" [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:5]. It runs report-only in the advisory CI job [SOURCE: .github/workflows/advisory-checks.yml:40]. It shows the lightest in-repo pattern for a playbook/catalog self-check: do not execute the corpus, resolve cited identifiers against a canonical set that the code owns.

## Questions Answered

- answered: Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift?
  - Drift classes today: (a) behavior/option/expected-answer drift vs the CLI or router -- caught only by manual execution and review (the historic `--phase-count` and DOC-331 cases in Known Context); (b) inline `path:line` citations drifting dead or moved -- caught by `cite-drift-scan.mjs` when someone runs it (past_end / moved_*), never enforced; (c) scenario link/citation drift where the target file is gone -- caught hard for playbooks by the CI gate, at author time for catalogs; (d) catalog source-anchor existence drift -- best-effort at author time, prefix-limited, lines stripped; (e) in-range content drift -- caught by nothing.
- answered: Q2: What do the sk-create-manual-testing-playbook and sk-create-feature-catalog validators check today, and which of those checks touch the code rather than the document shape?
  - Playbook validator: only local link resolution touches the filesystem (existence, case, symlink escape) [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:339]; all other checks are document shape, vocabulary, census or internal prompt consistency. Catalog validator: filesystem-touching checks are root-leaf bijection, SOURCE FILES existence (four-prefix allowlist, line suffix stripped), and prose path existence plus git check-ignore classification [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:422]. Everything else is document parity (title/description, taxonomy, labels) [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:897].

## Questions Remaining

- Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
- Q4: Which drift classes would that lightest check still miss, and what would catch each one?
- Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

## Next Focus

Q3, weighted by two iteration-1 results: the scanner already reaches both corpora but validates only line bounds, and the doc-model-refs pattern shows a canonical-registry cross-check that runs cheaply. The next iteration should test whether extending `cite-drift-scan.mjs` (or a thin consumer of it) to fail on `past_end` and to resolve a declared anchor token is the lightest path, and whether the catalog validator's four-prefix allowlist and line-suffix stripping are the first extensions worth making.

## SCOPE VIOLATIONS

None -- all target files were read-only; writes were confined to this iteration's narrative, delta file, and the gateway event temp file.
