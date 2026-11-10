# Review Iteration 010 — Security (Silent-Input Sweep, Slice 10/10)

## Dispatcher
- Route: mode=review; target_agent=deep-review; single review iteration (10 of 10); state externalized.
- Dimension: security; slice 10 of 10 (orchestrator-assigned): system-spec-kit runtime CLI — spec/ (15 files), validation/ (6), sweep/ (1), templates/ (2), utils/ (1), validate-command-tree-parity.sh, runtime/scripts (2), shared/scripts (1) — 29 files.
- Charter (two defect classes): (1) an unknown or misspelled option accepted silently; (2) exit 0 on a detected problem, or a header/usage that documents an option the parser rejects.
- Stop policy: max-iterations — this is the final iteration; convergence is telemetry only.
- Registry at start: 64 open findings (P0=0, P1=17, P2=47). All 64 were checked against this slice's 29 files by file + title; none of this slice's files carries a prior finding, so nothing was re-reported.

## Dimension
Security — the CLI input contract as an abuse surface: option tokens silently swallowed or mis-consumed, and checks that report success without having run, across the spec/validation/sweep/templates/scripts clusters.

## Files Reviewed
- .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:36 — strict `-*)` reject, exit 2
- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:713 — `*` reject, exit 1; all documented options handled (:690, :694, :698, :706, :710)
- .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:57 — unknown → exit 2
- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:617 — unknown → UsageError → exit 2 (:791-794)
- .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:657 — `argv[2]` treated as root; extra args ignored
- .skilled/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh:94 — unknown → exit 1; documented options handled (:81-88)
- .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:55 — unknown → exit 2
- .skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts:426 — unknown → plan error → exit 1 (:484-487)
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:515 — unknown → throw → exit 2 (:528-531)
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:596 — unknown → throw → exit 2 (:645-647)
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141 — no option parsing at all
- .skilled/skills/system-spec-kit/runtime/cli/spec/test-validation.sh:10 — `exec … "$@"` forwarder
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:167 — unknown → exit 2; `--layout-map` handled at :1768
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh:333 — `-*` reject, exit 1; all documented options handled (:303-331)
- .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:100 — `-*` reject, exit 1; usage options all handled (:92-99)
- .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80 — valueless `--roots` consumes the next token
- .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:242 — unknown `--` flags filtered out
- .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258 — unknown `--` flags filtered out
- .skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js:969 — unknown command → usage + exit 2
- .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114 — dangling `--left`/`--right` falls back to the default mirror check
- .skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:596 — unknown → throw → exit 1/2 (:635-639)
- .skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456 — every non-`--json` token becomes a target
- .skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473 — only `--folder=` read; unknown tokens ignored
- .skilled/skills/system-spec-kit/runtime/cli/validation/generated-metadata-drift.ts:65 — unknown → throw → exit 2 (:100-102)
- .skilled/skills/system-spec-kit/runtime/cli/validation/generated-metadata-integrity.ts:62 — unknown → throw → exit 2 (:97-99)
- .skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56 — flags filtered from the file list
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:24 — argv passthrough to run-tests.mjs
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:100 — unknown first token falls through to vitest argv (:105-106)
- .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116 — mode fallback to the print branch

## Findings by Severity

### P0 Findings
None. No CI/hook/workflow path in this slice reports success after *detecting* a failure it relies on. The two detection-blind defects found below are silent no-ops before detection; no P0.

### P1 Findings

1. **R10-P1-001 A misspelled `--check` on env-reader-table.mjs falls through to the print branch: the README-table drift gate is silently skipped with exit 0** — .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116 (`const mode = process.argv[2] ?? '--print'`; branches at :118 `--check`, :125 `--write`, :131 `else` print) — [SOURCE: .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116]
   - Case: a caller runs the documented check command with a misspelled or unknown mode (`--chek`, `--bogus-xyz`, `--check=1`); the token is never rejected, no branch matches, the derived table is printed to stdout, and the process exits 0 — the drift the real `--check` reports at exit 1 goes unreported. The same shape silently turns a `--write` typo into a no-op: the README is not rewritten and the run still exits 0.
   - Evidence: repro A/B/C (executed on a scratch copy of the script under `$TMPDIR`, README without the table): `--check` → stdout `README configuration table drifted from the code.` + expected table, exit 1; `--chek` → table header on stdout, exit 0; `--bogus-xyz` → table header on stdout, exit 0.
   - User impact: the CLI is documented as the drift gate for the shared README table (shared/scripts/README.md:43, :55 document `--check … exits 1 on drift`); a single typo in a scripted invocation converts a detected drift into a clean exit 0, and a `--write` typo converts a regeneration into a silent no-op.
   - Finding class: class-of-bug.
   - Scope proof: the file has no usage/help text and no known-flag rejection anywhere; :116-133 is the whole mode dispatch. `rg -n "env-reader-table" .skilled` shows only README documentation and `shared/tests/readme-env-readers.test.ts:11`, which imports `checkReadme()` directly (the npm-test gate therefore stays intact); no located CI/hook invokes the CLI itself.
   - Affected surface hints: ["shared/README.md generated table", "scripts/env-reader-table.mjs --check CLI gate", "--write regeneration path"]
   - Recommendation: reject an unrecognized mode token with a usage line and non-zero exit before the branch, and keep the print branch reachable only for a zero-argument run.

```json
{
  "type": "claim-adjudication",
  "claim": "env-reader-table.mjs selects its mode from process.argv[2] with branches only for --check and --write and an unguarded print fallback; a misspelled or unknown mode token is silently discarded and the process exits 0 without running the drift check or the rewrite.",
  "evidenceRefs": [".skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116", ".skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:118", ".skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:125", ".skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:131", "repro A/B/C: --check exit=1 drift, --chek exit=0 table, --bogus-xyz exit=0 table"],
  "counterevidenceSought": "Searched the repo for CLI invocations (rg 'env-reader-table' .skilled): only README documentation and a test that imports checkReadme() directly; no CI or hook invokes the CLI with --check, so the npm-test gate is unaffected. Verified the script has no usage/help text and no unknown-token branch (:116-133 is the entire dispatch).",
  "alternativeExplanation": "The fall-through print branch could be an intended friendly default for zero-argument runs. That intent does not justify accepting a typo'd or unknown mode token for a check/rewrite CLI: the documented modes are --check and --write, and a caller typing --chek receives exit 0 with neither run, so the silent acceptance is the defect rather than the default itself.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If no workflow, hook, CI job or script invokes this CLI for its --check/--write modes (i.e. the only real gate is the direct-import test), or a caller-visible unknown-mode rejection is added ahead of the branch, downgrade to P2."
}
```

### P2 Findings

1. **R10-P2-001 Unknown `--`-prefixed options are silently dropped by both inline-gate renderers** — .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258-262 (fallback mirror .sh:242-246) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258]
   - Case: `inline-gate-renderer.sh --level 2 --bogus-xyz file.tmpl` renders exactly as without the stray flag and exits 0; the parse collects only `--level`, `--out-dir` and non-`--` positionals, so any other `--flag` (typo, removed option) is discarded with no diagnostic.
   - Evidence: repro A/B (executed via the shipped .sh wrapper): outputs byte-identical (`Hello <!-- IF level:2 -->TWO<!-- /IF -->`), both exit 0; `--out-dir` control wrote the rendered file, exit 0.
   - User impact: a caller's mistyped option silently changes nothing instead of failing, so a wrapper that believes it passed an option (e.g. an output-format or safety flag) gets default behavior with a success status.
   - Finding class: class-of-bug.
   - Scope proof: both parse functions filter with `return !arg.startsWith('--')` and have no unknown-flag branch (ts :258-262, sh :242-246).
   - Affected surface hints: ["templates/inline-gate-renderer.sh shell callers", "scaffold-debug-delegation.sh:138", "template rendering pipelines"]
   - Recommendation: reject unrecognized `--`-prefixed tokens with the usage error before rendering.

2. **R10-P2-002 unactioned-recorded-failure-audit swallows flag-shaped arguments and counts unreadable inputs as clean** — .skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56 (filter `!a.startsWith('-')`), read errors at :64-68 `catch { continue; }` — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56]
   - Case: `node … --bogus-xyz package.json` exits 0 with `0 unactioned recorded failure(s).` — the flag is removed from the file list and never named; a typo'd/missing path (`does-not-exist-r10.md`) is skipped by the catch and also reports 0 failures with exit 0, so "nothing readable" is indistinguishable from "checked and clean".
   - Evidence: two executions, both exit 0 with the same `0 unactioned recorded failure(s).` summary line.
   - User impact: an audit invoked with a stray flag or a mistyped path reports a clean result it never verified.
   - Finding class: class-of-bug.
   - Scope proof: :55-75 is the whole main(); no unknown-flag branch and no diagnostic for unreadable inputs exists.
   - Affected surface hints: ["validation/unactioned-recorded-failure-audit.mjs callers", "CI failure-routing checks"]
   - Recommendation: reject flag-shaped tokens with the usage error and emit a diagnostic for unreadable inputs (or exit non-zero when every input failed to read).

3. **R10-P2-003 ephemeral-pointer-audit treats an unknown option as a target path and reports it as clean** — .skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456-458 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456]
   - Case: `node … --bogus-xyz` exits 0 with `0 ephemeral-pointer violation(s)`: every argument except `--json` is kept as a target, so an option-shaped token (or a `--folde`-style typo of a path) is audited as a nonexistent path and counted as clean, against the header's contract that the script exits nonzero on any hit so CI/pre-commit can gate on it.
   - Evidence: execution: exit 0, `0 ephemeral-pointer violation(s)`.
   - User impact: a mistyped or unknown argument produces a passing hygiene gate over nothing.
   - Finding class: class-of-bug.
   - Scope proof: :455-464 is the whole argument handling; no rejection branch exists, and the aggregate counts only findings.
   - Affected surface hints: ["ephemeral-pointer-audit.mjs CI/pre-commit invocation", "comment-hygiene gates"]
   - Recommendation: reject unrecognized flag-shaped tokens and fail when a named target does not exist.

4. **R10-P2-004 validate-command-tree-parity.sh silently runs the default mirror check when only one of `--left`/`--right` is given** — .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114-125 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114]
   - Case: `--left <dir>` (or `--right` alone) satisfies `[[ -z "$LEFT" || -z "$RIGHT" ]]`, so the provided path is ignored and the script falls into the default generated-mirror policy check instead of rejecting the incomplete pair; the caller believes their two-tree comparison ran.
   - Evidence: repro (executed on a scratch copy so the repo's sync checker was never run): dangling `--left` → `ERROR: runtime mirror validator not found: <copy>/runtime-mirrors/sync-runtime-mirrors.cjs`, exit 1 (proves the default branch was selected and `--left` was ignored); control with both dirs → `PASS: command trees are byte-identical`, exit 0.
   - User impact: a half-specified comparison silently changes meaning; a pass from the default policy check can be read as a pass of the intended comparison.
   - Finding class: class-of-bug.
   - Scope proof: :114 is the only branch selecting compare mode; `--left`/`--right` are parsed at :31-32 with empty-string defaults and no pairing validation.
   - Affected surface hints: ["validate-command-tree-parity.sh --left/--right callers", "runtime-mirrors parity checks"]
   - Recommendation: when exactly one of `--left`/`--right` is provided, fail with the usage error (exit 64) before entering the default path.

5. **R10-P2-005 template-phrase-lint ignores every CLI argument, including `--help`** — .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141-142 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141]
   - Case: the script has no option parsing; `process.argv` is read only for the direct-run guard, and `main()` takes no parameters, so any argument — a typo, a removed flag, `--help` — is silently discarded and the staged-phrase lint runs unchanged.
   - Evidence: code read (not executed: the script invokes git, and this dispatch bars executing git-invoking scripts): :115-139 `async function main()` with no argv parameter; :141-142 the only `process.argv` use.
   - User impact: a caller expecting option-driven behavior (or help) gets the default lint run with no signal that the argument was ignored.
   - Finding class: class-of-bug.
   - Scope proof: the file contains no `parseArgs`, `getopts`, or `argv` indexing beyond the guard line.
   - Affected surface hints: ["pre-commit staged-phrase gate", "gate:template-phrase-lint invocations"]
   - Recommendation: reject surplus arguments with a usage error, or document that the script takes none and reject `-`-prefixed tokens.

6. **R10-P2-006 strict-pass-freshness silently inspects nothing when `--roots` has no value** — .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80-84 (also `--baseline` :90-97) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80]
   - Case: `--roots --baseline=base.json` stores the next flag as the roots value; the path does not exist, is filtered out at :334, the sweep runs over zero folders, prints a JSON payload with `inspected: 0`, and exits 0 — a regression sweep that silently checked nothing. `--baseline` has the same no-value shape.
   - Evidence: execution: exit 0, payload `"roots": [], "inspected": 0`; control `--bogus-xyz` → exit 2 `Unknown argument: --bogus-xyz`.
   - User impact: a CI job calling the sweep with a missing value passes without inspecting any packet.
   - Finding class: class-of-bug.
   - Scope proof: :80-108 consumes values with `argv[index + 1] ?? ''` / `?? null` and never rejects a flag-shaped value; no post-filter guard fails on an empty root set (:334).
   - Affected surface hints: ["strict-pass-freshness regression sweep", "CI freshness gate"]
   - Recommendation: reject a missing or `--`-prefixed option value at parse time and fail when the resolved root set is empty.

7. **R10-P2-007 repo-era.mjs treats a stray argument as the repository root** — .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:656-658 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:657]
   - Case: `node repo-era.mjs --help` prints a full era report for root `…/--help` with `packetCount: 0` and exits 0; any extra or option-shaped argument silently becomes the scanned root, and arguments after the first are ignored.
   - Evidence: execution: exit 0, JSON report `"root": "…/--help", "packetCount": 0`.
   - User impact: a mistyped invocation returns a plausible-looking empty report instead of an error.
   - Finding class: class-of-bug.
   - Scope proof: :656-658 is the entire CLI entry; there is no option parsing or root validation.
   - Affected surface hints: ["repo-era.mjs manual diagnostics", "era-report consumers"]
   - Recommendation: reject flag-shaped arguments and require the root to exist before reporting.

8. **R10-P2-008 evidence-marker-audit ignores unknown flags and the space-separated `--folder <path>` form** — .skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473-475 (default-root fallback :483-497) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473]
   - Case: only the `--folder=` form is read; `--bogus-xyz` is ignored (audit proceeds, exit 0 on a clean tree), and `--folder <path>` is ignored entirely, silently falling back to the hard-coded default root — when that root exists, the report describes the wrong tree while looking like the requested audit.
   - Evidence: execution: `--folder=<scratch> --bogus-xyz` → scratch-folder report, exit 0, flag ignored; `--folder <scratch>` → `Default root not found: …/026-graph-and-context-optimization`, exit 2 (default root absent in this worktree, proving the space form was not read).
   - User impact: an audit gate pointed at the wrong tree can report exit 0 on an unrelated clean tree.
   - Finding class: class-of-bug.
   - Scope proof: :472-475 reads only `--folder=`, `--rewrap`, `--json`; no unknown-token branch exists.
   - Affected surface hints: ["validation/evidence-marker-audit.ts CI invocation", "spec-doc evidence-marker gate"]
   - Recommendation: accept both `--folder=` and `--folder <path>`, and reject unrecognized `--`-prefixed tokens.

## Traceability Checks
- Core protocols (spec_code, checklist_evidence): not applicable — this slice contains implementation CLI scripts with no spec document making per-line code claims, and no tasks.md/checklist items reference these files. Every finding is backed by an executed repro or, where execution is barred (git-invoking `template-phrase-lint.mjs`), an explicit code-read proof.
- Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not applicable to a code sweep; skill surfaces appear only as callers (e.g. `scaffold-debug-delegation.sh:138` renders through the inline-gate wrapper) and were cited as context, not checked.
- Untrusted-content guard: no reviewed file contained instruction-like text aimed at the reviewer; nothing embedded was acted on.
- Repo hygiene: `git status --porcelain` after all repros shows only the review packet (`?? …/review/`); every write landed under `$TMPDIR` scratch or the allowed review paths.

## Verdict
CONDITIONAL — 1 P1 (no P0) this iteration. Sixteen of the 29 files are strict parsers that reject unknown options with a non-zero exit (quality-audit, recommend-level, refresh-track-roots, repair-derived, sweep-track-roots, sync-phase-map-status, template-phrase-census, template-phrase-cleanup, upgrade-legacy, upgrade-level, validate.sh, continuity-freshness, generated-metadata-drift, generated-metadata-integrity, scaffold-debug-delegation, template-structure); the remaining defects cluster in audit/report helpers that silently absorb stray or mis-consumed tokens, plus one documented check-mode CLI (`env-reader-table --check`) that a typo converts into an exit-0 no-op.

## Next Dimension
None — iteration 10 of 10 completes the sweep. All four dimensions (correctness, security, traceability, maintainability) and all 10 slices are covered; the final synthesis reads the registry, not this file.

Review verdict: CONDITIONAL
