# Alignment audit findings (read-only audit of worktree 071, main at 089693d899)

Scope: the 130 files the cli-jev 003 packet created between f9d701bd13 and 089693d899, minus 42 code
files inside `.skilled/skills/system-deep-loop/runtime`, `.skilled/skills/system-skill-advisor/runtime`
and `.skilled/skills/system-spec-kit/runtime`, which another session's align packets own. Our feature
catalog entries, playbook scenarios and changelogs inside those three skills stay in scope.
Scope list: 89 markdown docs, 35 code files (31 scripts and tests, 4 cli-classifier json).

## What already passes (baseline, 2026-09-30)

- sk-code drift verifier, default mode (`verify_alignment_drift.py --fail-on-warn` on the 35 code files):
  PASS, 0 findings.
- Comment hygiene (`check-comment-hygiene.sh` run as python3, one file at a time): 31 of 31 clean.
- Numbered ALL-CAPS section dividers: present in every non-test script over 150 lines.
- camelCase function names: no snake_case function in any JS file. Python: every function has a
  return type hint, no bare `except:`.
- sk-doc `validate_document.py`: 89 of 89 VALID, 0 errors. The three cli-classifier index files
  also pass with `--type feature_catalog` and `--type playbook`.
- DQI (`extract_structure.py`): all 89 at 78 or above, band good or excellent.
- `quick_validate.py`: cli-classifier and cli-classifier/cli-deem valid.
- `parent-skill-check.cjs .skilled/skills/cli-classifier`: all hard invariants passed, 0 warnings.
- Catalog package validator: cli-classifier, cli-classifier/cli-deem, cli-classifier/cli-usage PASS.
- Playbook package validator: 10 of 11 packages holding our scenarios PASS or SKIP.

## Findings to fix

### C1. Code file headers (sk-code-opencode box header rule, operator decision 2026-09-30)

The operator chose the minimal fix: "Keep the box where the neighbors use it. Only fix the 10 files the
sk-code checker fails." The bar is `verify_alignment_drift.py --check-exact-headers`, which wants a
`MODULE:` or `COMPONENT:` marker in the first 40 lines of every non-test file. Files keep the header
style their folder's older files use. A box header stays a box and gains the marker on its name line.
Test files under a `tests/` folder are exempt from that check and do not change.

The 10 files the check fails, and the fix for each:
- Box with a plain name line: rewrite the name line as `// ║ COMPONENT: <name> — <description> ... ║`,
  padded so the closing `║` stays in the same column as the box's other lines. If the text no longer
  fits, keep `COMPONENT: <name>` in the box and move the description to one `// ` comment line right
  under the box. Files:
  - .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  - .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs
  - .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs
  - .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
  - .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
  - .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  - .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs
- Python divider without the marker: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`
  line 3 becomes `# COMPONENT: HVR READER-NEEDED LENS — samples the tells a machine cannot settle`.
- No header at all: `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`
  gains the three-line divider its sibling `judge-agreement.mjs:2-4` uses, with
  `// MODULE: Reply Judge Agreement Tests`, as its first lines.
- Exempt, no change: `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh`
  is recorded run evidence and stays byte-identical.

Proof: `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over a staged copy of the
34 in-scope code files (the raw evidence script left out) moves from 9 errors to 0.

### C2. Bracketed stderr diagnostics (sk-code-opencode, P1 bracketed logging rule)

Standard: `assets/checklists/javascript-checklist.md` §3 "Bracketed Logging": console and stderr
diagnostics carry a `[component]` tag. Today most scripts write bare `error: ...` lines.
Fix: the default stderr writer, or each direct `process.stderr.write` diagnostic, prefixes
`[<script-name>] ` (the file's base name without extension). Injected `deps.err` writers in tests stay
untouched. Report lines on stdout are program output, not logging, and do not change.

Files:
- .skilled/hooks/goal/lib/build-verifier-fixture.cjs (lines 383-413, six writes)
- .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs (lines 424-456, five writes)
- .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs (line 52)
- .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
- .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs
- .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs (line 1518 default writer)
- .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs (line 1529 default writer)
- .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs (line 1436 default writer)
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
- .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs (line 1474 default writer)

Already tagged: lint-goal-criteria.cjs and score-goal-lint.cjs (`TAG` constant).
Exempt: cli-deem.mjs writes one JSON object per error line to stderr, a machine contract its callers
parse. It keeps that form.

Proof: each touched script's own test suite passes unchanged (the tests match stderr with
`includes`, so a prefix keeps them green). Any test that asserts an exact stderr string is updated
in the same step.

### D1. Playbook scenarios with dated run transcripts (sk-create-manual-testing-playbook, fail closed)

`validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook`
fails with two BAKED_RUN_TRANSCRIPT errors:
- hub-routing/alias-still-resolves.md:71 (section "### Recorded Result", lines 67-72)
- hub-routing/judgment-request-routes-to-transport.md:74 (section "### Recorded Result", lines 70-75)
Scenario files state what to run and what passing looks like. Dated observations belong in a
benchmark report. Fix: remove the dated "Observed on ..." paragraphs. Keep the expected answer shape
(single route, `workflowMode` `cli-jev`, `packetId` `cli-usage`) in the scenario's expected-result
wording, with no date, run id or policy hash. The dated runs already live under
`.skilled/skills/cli-classifier/benchmark/reports/`.
Proof: the package validator exits 0 with status PASS for cli-classifier.

### D2. Feature catalog entries with packet-history lines (sk-create-feature-catalog)

`validate_catalog_package.py --json` flags `packet_history_metadata` on four of our entries:
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md:111
- .skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md:77
- .skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md:77
- .skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md:84
Each is a `- Feature ID: F0NN` bullet. Fix: delete that one bullet line. Nothing else changes.
Proof: the validator's JSON lists no violation whose leaf is one of our 28 catalog entries.

### D3. Human Voice Rules hard blockers in authored prose (sk-create-with-human-voice)

`hvr_scan.py --json` over the 89 docs: 20 hard blockers. Real ones to fix:
- Semicolons in prose: sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md
  lines 32 and 47; system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md:98;
  system-spec-kit/changelog/v4.2.0.0.md:28; cli-classifier/benchmark/reports/README.md:27.
  Split into two sentences or use a comma where the grammar allows.
- The word "harness" in prose: cli-classifier/manual-testing-playbook/manual-testing-playbook.md:143
  ("replayed by the rollout harness") and the prose lines of
  sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md
  (68, 74, 192, 205, 231, 235). Use "script", "runner" or "check" to match what the thing is.
False positives, no change: "harness" inside a path or link target (the folder is named
`reply-harness`), for example offline-judge-census-stops-at-label-gate.md lines 68 and 69.
Proof: `hvr_scan.py` hard blockers on those files fall to the false-positive count only.

### D4. READMEs for the new code folders (sk-create-readme)

- `.skilled/skills/cli-classifier/benchmark/injection-screen/` holds a script, a tests folder and two
  label files and has no README. Every sibling benchmark folder with a script has one
  (for example `.skilled/skills/sk-communication/benchmark/reply-harness/README.md`). Add a
  code-folder README in that shape: what the check measures, the files, how to run it, the label gate.
- `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` lists `judge-agreement.mjs`
  but not its test `judge-agreement.test.mjs`. Add the row.
Proof: `validate_document.py` VALID on both, DQI good or better.

## Recorded, not fixed (P2 or outside this packet)

- sk-code conflict: `javascript-checklist.md` §2 asks for a plain-name `╔═╗` box and calls the
  COMPONENT form retired. `javascript/style-guide.md` §2 asks new files for the `MODULE:` divider and
  accepts the box only where it already exists. The verifier's `--check-exact-headers` accepts either
  as long as the marker is there. About 20 of our files use the box because their folder's older files
  do. The operator chose to keep that (2026-09-30). Both sk-code documents are out of scope.
- sk-doc conflict: `extract_structure.py`'s README checklist fails a README without a TABLE OF
  CONTENTS, while `sk-create-readme/SKILL.md:217` forbids one. Our READMEs follow the authoring rule.
- `check_authored_name_kebab.py` fails `cli-classifier/ROUTER.md`. The hub canon names that file in
  capitals in every hub, so this is a checker false positive.
- cli-classifier SKILL.md and cli-deem SKILL.md descriptions are 155 and 151 characters, over the soft
  130 target (a warning, not an error). Trimming changes a routing input and forces a routing remint,
  so it is recorded rather than done here.
- 28 HVR soft deductions (do, make, get, good, take, craft) across our docs: advisory.
- 526 HVR "oxford-comma-candidate" review items: advisory, reviewer judgment.
- JSDoc on public functions (P2 in the JS checklist) and docstrings on six small Python methods in
  hvr_reader_lens.py: recommended, deferred.
- Package-level playbook warnings on roots we did not create (missing result-persistence marker,
  hand-typed census, unsynced prompts in sk-doc, deep-review, runtime, skill-advisor, spec-kit roots),
  and the sk-communication catalog failure on `provider-and-privacy/external-cli-provider.md`: pre-existing.
- `sk-create-with-human-voice/scripts/README.md` starts its numbering at `## 0.`: pre-existing
  (commit ec33385ae5, before this packet).
