# Review Iteration 008 — Maintainability (Silent-Input Sweep, Slice 8/10)

## Dispatcher
- Route: mode=review; target_agent=deep-review; single review iteration (8 of 10); state externalized.
- Dimension: maintainability; slice 8 of 10 (orchestrator-assigned): `.skilled/skills/system-skill-advisor/scripts` + `.skilled/skills/system-spec-kit/runtime/cli/**`, 32 files.
- Stop policy: max-iterations (convergence is telemetry only).
- Charter (two defect classes): (1) unknown or misspelled options accepted silently; (2) exit 0 on a detected problem, or a header that documents an option the parser rejects or never reads.
- State: registry held R1..R7 (14 P1 + 36 P2) at iteration start; no slice-8 file carried a prior finding; nothing was re-reported.

## Dimension
Maintainability — the CLI input contract: option parsing vs documented options, and exit codes as promised.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/scripts/doctor.sh:25` (parser)
- `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197`
- `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:411`
- `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs:55`
- `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:29`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:234`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-research-metadata.ts:272`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts:288`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/validate-memory-quality.ts:40`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:488`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:666`
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs:29`
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:45`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.mjs:29`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts:26`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/parse-bool-flag.sh:17`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/shell-common.sh:78`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:26`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:37`
- `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:362`
- `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882`
- `.skilled/skills/system-spec-kit/runtime/cli/ops/process-memory-harness.ts:587`
- `.skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249`
- `.skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs:1014`
- `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs:44`
- `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs:29`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:583`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:281`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:275`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:277`

## Findings by Severity
### P0 Findings
None. No CI/hook/workflow path in this slice reports success after detecting a failure.

### P1 Findings
1. **R8-P1-001 Unrecognized options are silently swallowed by the continuity save writer; a misspelled --session-id or --planner-mode is discarded and the save proceeds** — .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962 (push of every unrecognized token), :965 (only two positionals destructured), :939-958 (exact-match options only) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962]
- Case: a caller runs `generate-context.js /tmp/save.json <spec-folder> --sessoin-id <uuid>` (or `--planner-modee full-auto`); the token is neither rejected nor consumed as a flag: it is appended to filteredArgv and then discarded by the two-element destructure, so the save continues with sessionId null / planner mode plan-only and no diagnostic.
- Evidence: the flag loop copies every token except exact `--session-id`/`--planner-mode`/`--full-auto` into filteredArgv (:962), and only `[primaryArg, secondaryArg]` are read (:965). Repro A1 (executed): `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --json '' 999-repro-folder --bogus-xyz` vs the same command without the flag → both print `Starting memory skill...` then `{"error":"VALIDATION_ERROR","message":"Empty --json input"}` and exit 1, byte-identical (OUTPUT-IDENTICAL); neither run mentions an unknown option. The parser also throws for malformed values of the options it recognizes (:943, :952), so the silence is not deferred validation.
- User impact: a mistyped save option silently changes what is written (no explicit session id; plan-only instead of full-auto continuity fields) while a valid payload exits 0 — the typo is invisible until the saved metadata is audited.
- Finding class: class-of-bug.
- Scope proof: `rg -n "filteredArgv" generate-context.ts` shows the single push/destructure pair; the parser is the only flag gate before the workflow, and all HELP_TEXT options (:80-87) are read (:183, :940, :949, :958, :970), so the defect is the missing unknown-token branch.
- Affected surface hints: ["/speckit:save", "deep-* workflow save steps", "session-lifecycle autosave", "continuity frontmatter"]
- Recommendation: reject unknown tokens with a usage error (exit 2), matching the sibling continuity scripts.

```json
{
  "type": "claim-adjudication",
  "claim": "generate-context.ts parseArguments (:939-963) never rejects unknown tokens; only exact --session-id/--planner-mode/--full-auto are read and every other token is pushed into filteredArgv (:962), of which only the first two are used (:965). A trailing misspelled --session-id/--planner-mode is silently discarded and the save proceeds under defaults, with no diagnostic. The script is the continuity save writer for /speckit:save and the deep-* workflows.",
  "evidenceRefs": [
    "generate-context.ts:939-963 (flag loop; unrecognized tokens pushed)",
    "generate-context.ts:965 (destructure discards argv past the two positionals)",
    "generate-context.ts:940-956 (validation only for exact option spellings)",
    "repro A1: node .../dist/continuity/generate-context.js --json '' 999-repro-folder --bogus-xyz vs control -> byte-identical output {'error':'VALIDATION_ERROR','message':'Empty --json input'}, exit 1 both; no unknown-argument message"
  ],
  "counterevidenceSought": "Read the full parser (:931-990) and HELP_TEXT (:72-181): all documented options are read; no unknown-token branch exists. Checked leading-position behavior: an unknown first token becomes the data-file argument and the loader fails non-zero, so silence is limited to positions the destructure drops. Searched .skilled/commands for callers: the save workflows pass a data file plus spec folder, and --session-id/--planner-mode are part of the documented surface.",
  "alternativeExplanation": "Trailing tokens could be ignored deliberately for forward compatibility, but the same parser throws for malformed values of the options it does know, so silently dropping a mistyped option is inconsistent with its own validation contract and changes what gets saved.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If every caller passes a fixed zero-option argv (no --session-id/--planner-mode/--full-auto forms) or the parser documents trailing-token tolerance, reduce to P2."
}
```

2. **R8-P1-002 smart-router-measurement.ts ignores unknown options; a --no-record-telemetry typo silently re-enables telemetry recording** — .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882 (recordTelemetry via args.includes), :874-890 (argValue parser, no unknown branch) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882]
- Case: `--no-record-telemtry` (typo) → `includes('--no-record-telemetry')` is false → recordTelemetry true → the run appends compliance records to `.skilled/skills/.state/smart-router-telemetry/compliance.jsonl` although the operator asked for a no-write measurement.
- Evidence: flags are looked up by exact string (`argValue`/`includes`, :875-889) and never enumerated; `recordTelemetry` is default-on (:882). Repro F3 (executed): `node .skilled/skills/system-spec-kit/runtime/cli/dist/observability/smart-router-measurement.js --workspace-root /tmp/missing-smr-root-xyz --bogus-xyz` and the control without the flag both fail with the same corpus ENOENT error (exit 1) and NO-UNKNOWN-MENTION — the token was accepted and discarded rather than rejected. The recording call itself was not executed (its sink is inside the repository), so the flag-to-default coupling is proven by read.
- User impact: typo'd quarantine flags (--no-record-telemetry, --limit, --output) silently fall back to defaults for a tool that writes telemetry state.
- Finding class: class-of-bug.
- Scope proof: `rg -n "args\.(includes|indexOf)|argValue" smart-router-measurement.ts` shows one parser family with no unknown-token branch; the analyze sibling shares the shape (R8-P2-005).
- Affected surface hints: ["smart-router telemetry state", "measurement harness", "routing-accuracy reports"]
- Recommendation: strict parseArgs with an allow-list, exit 2 on unknown tokens.

```json
{
  "type": "claim-adjudication",
  "claim": "smart-router-measurement.ts parses flags by exact-string lookup (argValue / args.includes, :875-890) and never rejects unknown tokens; recordTelemetry is !args.includes('--no-record-telemetry') (:882), so a typo of that flag silently re-enables telemetry recording into .skilled/skills/.state/smart-router-telemetry/compliance.jsonl.",
  "evidenceRefs": [
    "smart-router-measurement.ts:875-890 (argValue + includes; no unknown branch)",
    "smart-router-measurement.ts:882 (recordTelemetry default-on via includes)",
    "repro F3: node .../dist/observability/smart-router-measurement.js --workspace-root /tmp/missing-smr-root-xyz --bogus-xyz -> exit 1, output identical to control, NO-UNKNOWN-MENTION"
  ],
  "counterevidenceSought": "Read the whole main/parse region (:874-894) and the default telemetry path (:150-152): no other flag validator exists and no wrapper pre-validates. The recording call itself was not executed because its sink is inside the repository; the flag-to-default coupling is a code read scoped to the includes-expression.",
  "alternativeExplanation": "Loose flag parsing may be deliberate for a developer harness, but this flag is the run's only no-write control while the default appends state records, so a typo changes persistence behavior - the registered R6-P1-003/R6-P1-004 shape on sibling scripts.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "Documentation declaring unknown flags benign for this harness AND a non-repo default telemetry sink would reduce this to P2."
}
```

### P2 Findings
3. **R8-P2-001 Unknown options are silently ignored by generate-command-routers.cjs; a --write typo silently runs the read-only check and reports clean with exit 0** — .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:411-412 (parser), :386-404 (write branch), :35-38 (documented modes) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:412]
- Case: a caller runs `--writ` (or any stray flag) intending the normalize-write; `args.includes('--write')` is false, runCheck executes instead, prints `routers=33 clean=33 path-drift=0 shape-drift=0`, and exits 0 — the intended writes never happened and nothing says so.
- Evidence: repro B (executed): `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --bogus-xyz` and the control print the identical summary and exit 0 (OUTPUT-IDENTICAL); no unknown-option diagnostic. The write branch is reachable only via the exact `--write` token. `--check` is documented (:36-38) but never read; its effect equals the check default, so it is not a doc mismatch.
- Impact: silent no-op of an intended normalization; drift persists until the next check. No workflow/hook caller found (grep of .skilled/hooks, .skilled/bin, .skilled/commands, .github), which keeps this at P2.
- Finding class: class-of-bug. Affected surface hints: ["generate-command-routers CLI", "command routers OWNED ASSETS tables"].
- Recommendation: allow-list parse (--check|--write); exit 2 on anything else.

4. **R8-P2-002 dist-freshness.cjs reports check errors but exits 0; only staleness produces a non-zero code** — .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970-971 (exit decision), :923/:926-928 (error prints), :934-967 (CLI) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970]
- Case: `check --package not-a-real-package` prints `DIST FRESHNESS CHECK ERROR: Unknown dist package: not-a-real-package` and exits 0; `check-file --file <missing>` prints `Edited file is not under a watched dist-producing source tree` and exits 0. A caller keying on the exit code cannot tell "checked" from "could not check".
- Evidence: repro C2 (executed) exit 0 with the error line; repro C1 (executed) exit 0; stale results exit 69 (:970) and the check-all control exited 0 fresh. Header lines 5-6 ("without rebuilding or blocking on checker bugs") document advisory intent, which bounds severity at P2.
- Finding class: class-of-bug. Affected surface hints: ["dist-freshness CLI", "shim freshness guards", "doctor routes"].
- Recommendation: exit non-zero on status error (or document error-as-success explicitly).

5. **R8-P2-003 dist-freshness.cjs ignores unknown options after the command token** — .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:913 (unrecognized tokens pushed to positional), :936 (only positional[0] read) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:913]
- Case: `check-all --bogus-xyz` runs as plain check-all (identical output, exit 0); a `--jsn` typo meant for machine output is silently dropped.
- Evidence: repro C3 (executed): bogus and control outputs identical, exit 0 both; repro C4: a flag in command position is rejected (`Unknown dist freshness command: --bogus-xyz`, exit 64) — only trailing tokens are silent.
- Finding class: class-of-bug. Affected surface hints: ["dist-freshness CLI checks"].
- Recommendation: reject unknown `--` tokens instead of treating them as positionals.

6. **R8-P2-004 check-markdown-links.cjs silently ignores unknown options on the whole-repo link guard** — .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197 (sole argv read) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197]
- Case: `--bogus-xyz` (or a `--self-tes` typo of the self-test flag) is accepted; the guard runs the corpus check and exits 0 on a clean corpus, so a mistyped self-test invocation reports success without exercising the matcher.
- Evidence: repro D1 (executed): `--bogus-xyz` exits 0 with `check-markdown-links: 7744 files, 13870 links checked, 0 broken` and no flag diagnostic; control and `--self-test` (repro D2) exit 0. The CI job (.github/workflows/markdown-link-integrity.yml:45-59) invokes the guard bare, so the CI verdict is unaffected.
- Finding class: class-of-bug. Affected surface hints: ["markdown-link CI guard", "self-test entry"].
- Recommendation: reject unknown tokens with exit 2.

7. **R8-P2-005 smart-router-analyze.ts ignores unknown options; --input/--output typos silently fall back to defaults** — .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:357-360 (argValue), :362-375 (main) — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:357]
- Case: a `--outpt <path>` typo writes the report to the default path; an `--input` typo analyzes the default telemetry file instead of the requested one. Exit 0 either way.
- Evidence: repro F4 (executed): `node .skilled/skills/system-spec-kit/runtime/cli/dist/observability/smart-router-analyze.js --workspace-root /tmp/missing-smr-root-xyz --bogus-xyz` exits 0, runs the analysis and writes a report under the given root; no unknown-option mention (control differs only in the timestamped filename).
- Finding class: class-of-bug. Affected surface hints: ["smart-router analysis report", "telemetry analyzer CLI"].
- Recommendation: strict parseArgs; fail on unknown flags.

8. **R8-P2-006 process-sweep.ts and process-memory-harness.ts ignore unknown flags after the subcommand** — .skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249-250 and .skilled/skills/system-spec-kit/runtime/cli/ops/process-memory-harness.ts:587-588 — [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249]
- Case: `plan --bogus-xyz` / `snapshot --bogus-xyz` run normally with exit 0 and no diagnostic; a `--prety` typo is silently dropped.
- Evidence: repro E1 (executed): `node .skilled/skills/system-spec-kit/runtime/cli/dist/ops/process-sweep.js plan --bogus-xyz` exits 0 and emits the full plan (`"mode":"plan","dryRun":true`); repro E2: harness `snapshot --bogus-xyz` exits 0. Unknown tokens in command position are rejected as unknown commands with exit 2 (:257-261, :594-598), so only trailing flags are silent.
- Finding class: class-of-bug. Affected surface hints: ["process sweep plan/apply parsing", "process harness snapshot"].
- Recommendation: allow-list flags per subcommand; reject unknown flags with exit 2.

## Traceability Checks
- Core spec_code: 7 of 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); R8-P2-002 is the slice's single Class 2 instance (detected error reported on stderr, exit 0).
- Core checklist_evidence: executed repros A1/A2, B, C1-C4, D1-D2, E1-E2, F1-F4 plus strict-parser controls; exit codes recorded (A1 1/1, B 0/0, C1 0, C2 0, C3 0/0, C4 64, D1 0, D2 0/0, E1 0/0, E2 0/0, F1 exit 2 rejected message, F2 all reject, F3 1/1, F4 0/0). Both P1 findings carry fenced claim-adjudication blocks. Scripts that sync/publish/apply were not executed: sync-*.cjs, process-sweep apply, generate-trigger-index publish mode.
- Overlay skill_agent: consumer surfaces verified — markdown-link CI guard (.github/workflows/markdown-link-integrity.yml:45-59), pre-commit hermes mirrors (.skilled/scripts/git-hooks/pre-commit:273-274), save pipeline callers (speckit-save-context-tail.yaml:16; deep-review-auto.yaml:2404; deep-research-auto.yaml:2356; deep-ai-council-auto.yaml:212), dist-freshness consumers (.skilled/bin/skill-advisor.cjs:24).
- Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature catalogs or playbook references in the reviewed files).

## Integration Evidence
- R8-P1-001 sits on the save pipeline every /speckit:save and deep-* workflow invokes via `dist/continuity/generate-context.js`.
- R8-P2-004's guard runs bare in CI, and its own broken-link exit 1 (:221) is intact — the silent-option surface is operator-level only.
- The hermes sync checkers used by pre-commit are strict parsers; their `--check` drift path sets exitCode 1 (verified by read at sync-prompts-hermes.cjs:196-199 and sync-skills-hermes.cjs:249-257).

## Edge Cases
- check-markdown-links: a `--self-tes` typo silently substitutes the corpus check for the self-test (the inverse of a lost diagnostic); CI invokes the guard bare, so CI is unaffected.
- dist-freshness header (:5-6) documents "without blocking on checker bugs"; R8-P2-002 stays P2 because that intent conflicts with the CLI's own stale-69 contract (:970).
- generate-context leading unknown tokens are not silent: they become the data-file argument and the loader fails non-zero; R8-P1-001 is scoped to tokens the destructure drops.
- template-utils.sh:45 silently maps any unrecognized level to level-1; an internal shell function, not a CLI option surface, so recorded here and not filed.
- process-sweep apply was not executed (only plan); the harness help documents that it never sends signals, and eligibility refuses unknown owners.
- No prompt-injection-style directives were found in the reviewed files; all reviewed content was treated as data.

## Confirmed-Clean Surfaces
- doctor.sh:25-31 — `--strict` only; `*) Unknown arg: $1 >&2; exit 1`; documented exit codes (0/1/20/26) match the code.
- Strict unknown-option rejection: backfill-frontmatter.ts:234, backfill-research-metadata.ts:272, migrate-trigger-phrase-residual.ts:288, backfill-graph-metadata.ts:488-490, migrate-generated-json.ts:666, generate-trigger-index.mjs:609 (repro F1: `unknown argument: --bogus-xyz`), lookup-trigger-index.mjs:281, measure-cold-lookup.mjs:275, rg-wrapper.mjs:277, retrofit-convention.mjs:1033 (repro F2: all four print `unknown argument: --bogus-xyz`).
- The six sync-*.cjs (codex ×2, pi ×2, hermes ×2) are single-flag parsers that throw on anything else and exit non-zero on drift.
- generate-command-routers.cjs check mode still exits 1 on path/shape drift (:301-303); check-markdown-links.cjs exits 1 on broken links (:221).
- parse-bool-flag.sh:9-27 — deliberate three-outcome flag parser (unrecognized values keep the rule enabled and are named in SPECKIT_FLAG_UNRECOGNIZED).
- esm-entry.ts/.mjs, shell-common.sh, status-classifier.sh — helpers with no option surface.

## Ruled Out
- Class 2 for the strict-parser cluster: every failure branch inspected returns 1/2 (dist-freshness stale exits 69).
- Documented-option-rejected-or-unread: none in this slice — generate-context HELP_TEXT options are all read; dist-freshness usage maps to :940-966; the retrieval trio usage blocks and retrofit-convention's header match their parsers.
- `--owner-token`/`--ownerToken` in process-memory-harness.ts:119-128 are owner-marker strings matched against other processes' command lines, not harness options; the harness has no signal path (help :582).

## Not Proven
- validate-memory-quality.ts:40 reads only argv[2]; trailing flags are never read. Not filed: no safe run reached a valid memory file with exit 0 this slice.
- The telemetry write under a --no-record-telemetry typo was not executed (its sink is inside the repository); only the flag-ignore half (repro F3) is execution-proven.
- Whether any workflow invokes generate-command-routers.cjs --write (no caller found in the searched surfaces).

## Verdict
2 P1 and 6 P2 new findings; 0 P0. Active P1 findings remain open; no active P0.

## Next Dimension
Slice 9 of 10 (orchestrator-assigned); stopPolicy=max-iterations, so the sweep continues.

Review verdict: CONDITIONAL