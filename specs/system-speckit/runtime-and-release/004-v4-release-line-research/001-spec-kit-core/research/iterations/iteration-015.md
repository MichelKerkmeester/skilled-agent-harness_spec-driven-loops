# Iteration 15 — Bug and extension pass on unread runtime surfaces

## Focus

Iteration 15 focus: Bug and extension pass on surfaces not yet read. (1) Read the spec-kit runtime pieces this child has not cited yet: `runtime/cli/spec/recommend-level.sh`, `runtime/cli/spec/check-placeholders.sh` beyond lines 110-120, the continuity writer's argument handling in `runtime/cli/continuity`, and `runtime/cli/retrieval/generate-trigger-index.mjs`; for each, look for an exit code that hides a failure, a path resolved from the wrong root, or a flag documented but not parsed, and reproduce on a /tmp copy. (2) Extension: one cheap check that would have caught two or more confirmed P1s in this child.

All writes stayed inside the run directory. Repros ran against `/tmp/i15ph/`; no repository file was created, modified or staged.

## Actions Taken

1. Read `runtime/cli/spec/recommend-level.sh` — header contract (lines 1-83), arg parser (656-724), input validation (726-745), and the trailing exit-code comment block (768-780). Ran it once for the doc-versus-code comparison.
2. Read `runtime/cli/spec/check-placeholders.sh` in full (160 lines) and, because it only sources it, read the rule implementation it claims parity with: `runtime/cli/rules/check-placeholders.sh` (295 lines), plus the orchestrator's `PLACEHOLDER_FILLED` rule (`runtime/lib/validation/orchestrator.ts:748-899`).
3. Built a `/tmp/i15ph/001-draft` packet (Draft status, one v2.3-stamped `plan.md` carrying a `[YOUR_VALUE_HERE:` token, one unstamped `acceptance-criteria.md` carrying one) and ran all three readers over it: the CLI wrapper, `rules/check-placeholders.sh`'s `run_check`, and `validate.sh --strict`. The three disagree.
4. Read the continuity writer's argument handling (`generate-context.ts:80-125` help text, `:955-1045` parser + `knownOptions`, `:1172-1230` `takeProjectRootOption`). Hypothesis that `--project-root` is documented-but-unparsed was **wrong**: it is split out of argv before the parser runs.
5. Read `runtime/cli/retrieval/generate-trigger-index.mjs` header contract (25-41), `parseArgs` (583-620), `main` (655-700), `runCheck` (686-700), and `findRepoRoot` / `DEFAULT_REPO_ROOT` (85-101).
6. Attributed the placeholder drift with `git log -S` and `git tag --contains`.

## Findings

### F1 — P1 · bug/drift · The post-edit placeholder scan reports a failure the validator does not

`runtime/cli/spec/check-placeholders.sh` is the script the post-edit quality hook runs on the folder of every spec doc an author edits. Its header states the contract: "It reports what strict validation would flag: the four markers PLACEHOLDER_FILLED reads, with that rule's fence, inline-code and per-line rules for the template stamp each doc carries. A marker in a Draft packet still counts, because it is still unfilled." [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:9]

That contract is false in two independent ways, and `8b60bfc041` ("gate unfilled value tokens by template version and Draft status", first shipped in **v4.0.0.14**) is what broke it.

**(a) No Draft-token deferral.** The sourced rule defers a `[YOUR_VALUE_HERE:` token to a warning while `spec.md` says Draft [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:153], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:196], and the orchestrator runs the same branch, returning `warn` for `draftTokens` and `error` only for `findings` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:891]. The wrapper never builds a `draftTokens` list at all — it skips only `kind == "title"` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:127] and counts every remaining row into `TOTAL`, so a Draft token becomes `exit 1` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:159].

**(b) Doc reach.** The rule reads a fixed seven-name list — `spec.md plan.md tasks.md`, then `decision-record.md` if present, then three more gated on the stamp [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:146], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:185]. The wrapper instead globs every markdown file under the folder [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:134], excluding only `.backup-`, `memory/`, `scratch/`, `research/` and `review/` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:116]. An unstamped `acceptance-criteria.md`, or any hand-written extra doc, is scanned by the hook and never by the validator.

**Measured on one folder, three readers:**

```
$ bash .skilled/.../cli/spec/check-placeholders.sh /tmp/i15ph/001-draft --verbose ; echo EXIT=$?
FAIL — 2 placeholder pattern(s) found in /tmp/i15ph/001-draft
  /tmp/i15ph/001-draft/acceptance-criteria.md:3: - [ ] Threshold: [YOUR_VALUE_HERE: value]
  /tmp/i15ph/001-draft/plan.md:4: - Owner: [YOUR_VALUE_HERE: owner name]
EXIT=1

$ source .skilled/.../cli/rules/check-placeholders.sh; run_check /tmp/i15ph/001-draft 1
STATUS=warn   MSG=Found 1 unfilled value token(s) in a Draft packet   DETAILS=plan.md:4

$ bash .skilled/.../cli/spec/validate.sh /tmp/i15ph/001-draft --strict
! PLACEHOLDER_FILLED: 1 unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft
```

Two of the wrapper's two reported rows are wrong: `plan.md:4` is a warn under the rule, and `acceptance-criteria.md:3` is outside the rule's reach. The hook therefore reports FAIL on a packet whose placeholder rule passed with a warning. Severity P1: this runs on every spec-doc edit, so the false failure is the operator's most frequent signal, and its remedy ("fill the token now") is the opposite of the shipped Draft contract. Confidence 0.95 (repro run this iteration). Verify: the three commands above against a `/tmp` copy of any stamped Draft packet.

### F2 — P2 · drift · The wrapper's header comment asserts the behaviour that was removed

The sentence at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:9] ("A marker in a Draft packet still counts, because it is still unfilled") describes the pre-v4.0.0.14 rule. `8b60bfc041` changed the rule and, on the same day, `d5ce52ffac` re-scoped the placeholder fixes to v2.3 docs — first shipped in **v4.0.0.15** — but the wrapper's header was not updated and the wrapper's body was not changed to match. The comment is now the only place that states the old contract, which is what makes F1 read as intentional rather than as a defect. Confidence 0.9 (comment read, commit attributed). Verify: `git log -S 'gate unfilled value tokens' --oneline` and read the file's first 12 lines against `rules/check-placeholders.sh:191`.

### F3 — P2 · drift · `recommend-level.sh` documents two required flags and requires one

The header and `--help` both mark the inputs required: `--loc <number>   Lines of code estimate (required)` and `--files <number>   Number of files to modify (required)` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:172], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:173]. The validation is an OR, not an AND: `At least --loc or --files must be provided` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:739]. Measured: `recommend-level.sh --files 5` exits 0 with `Recommended Level: 0 (Quick) / Score: 7/100`. The response is not wrong, but a caller that reads the help will supply both, and the system prompt routes level selection to this script as "deterministic scoring" — a doc/code disagreement about which inputs are load-bearing is exactly the kind of thing the level decision should not be ambiguous about. Confidence 0.9. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --files 5; echo $?`.

Also stale: the trailing `# Exit codes:` block names one error path only, while the script has five distinct `exit 1` paths (missing value for `--loc`, `--files`, `--phase-threshold`, unknown option, non-integer input). No behavioural consequence; recorded as drift for the same reason.

### F4 — P2 · extension · One parity fixture would have caught F1 and F2 together

A difference test between the hook's scan and the rule it mirrors, over a small matrix (Draft × Complete status, stamped × unstamped doc, each of the seven rule doc names plus one non-rule `.md`), asserting that the wrapper's exit status equals `run_check`'s `RULE_STATUS != fail`. Every cell is already constructible from the sourced lib — no fixture file is needed beyond the packet itself. It belongs in `.skilled/skills/system-spec-kit/runtime/cli/spec/test-validation.sh` (exists, 670 bytes, currently a thin harness), next to whatever it already asserts. That single test fails today on two cells (`plan.md` Draft token; unstamped `acceptance-criteria.md`) and would have failed on every commit since v4.0.0.14, which is the cheapest possible fix for the class of defect the whole "mirrors check-placeholders.sh" comment keeps promising.

The same shape covers the other P1-quality divergence this child confirmed: the `--help`-versus-parser table (enumerate documented flags, assert each one is parsed and each parsed flag is documented) catches F3 and the `check-goal.cjs` argument mismatches of iteration 13 without reading either script.

### F5 — P2 · improvement · Make the parity structural instead of asserted in prose

The wrapper reimplements the scan (`placeholder_marker_lines`, the title skip, the totals) rather than calling `run_check`, which already returns `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS` and `RULE_REMEDIATION` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:283]. Since it sources that file anyway [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:1] — the `source` line is the second statement in the script — the remaining ~90 lines of duplicate scanning exist only to render text. Calling `run_check` and formatting its struct would make F1 unreachable by construction and delete the second implementation of the same rule. What breaks if removed: nothing; `--json`/`--verbose` rendering is preserved, and `RULE_DETAILS` already carries the `file:line` rows the wrapper prints.

### Verified-negative: no documented-but-unparsed flag in the other two focus files

Recorded so a later iteration does not re-walk it:

- `generate-context.ts` documents `--project-root <dir>` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:99] and it is **not** in `knownOptions` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:973], which reads like the exact bug this focus asked for. It is not: `takeProjectRootOption` splits the flag out of argv before `parseArguments` sees it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1172], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1225], and validates existence, directory-ness and containment [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1206]. Two parsers over one argv is fragile, but the pre-strip is deliberate and the ordering is documented at the call site.
- `generate-trigger-index.mjs`'s `parseArgs` refuses an unknown argument with exit 2 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:583], refuses a flag whose value starts with `--`, and additionally refuses write-only flags under `--check` rather than silently ignoring them [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:692]. `DEFAULT_REPO_ROOT` is resolved by walking up from the script for a `.git`/`specs` marker rather than a fixed hop count, with the silent-narrowing failure it avoids written out [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:101], and a caller indexing another checkout is warned on stderr. This surface is the most defensively argued of the four.

## Questions Answered

None of the two remaining key questions were answered. Q6 (upgrade preview/rollback: `align`, `apply`, `rollback`, `compat` unrun) and Q7 (`create.sh` scaffold vs `validate.sh --strict`) both need execution this focus did not spend budget on. The `--strict` run over `/tmp/i15ph/001-draft` was a hand-authored packet, not a `create.sh` scaffold, so it does not answer Q7.

## Questions Remaining

- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Eighth iteration carrying this; it remains the oldest open item with a complete read path and no execution.
- **Q7** — `create.sh` scaffold versus `validate.sh --strict` still unverified, and the template fill-note comparison against sk-doc canon untouched.
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal.
- **New from F1:** whether any *other* hook-consumed script likewise reimplements a rule it could call. `rules/*.sh` has paired `.sh`/`.cjs` implementations per the iteration-6 residual; the wrapper-to-lib pairing here is the first case found where the pair diverges behaviourally rather than stylistically.
- **New from F1(b):** whether the wrapper's broader doc reach is load-bearing anywhere — a hand-written `handover.md` or `context-save.md` carrying a token is flagged by the hook and ignored by the validator, and the reverse (a doc the validator reads that the wrapper's `find` misses) cannot happen, so the divergence is one-directional.
- **New from F3:** whether the level decision is ever taken from `--loc` alone in practice, which decides if the "required" label is merely stale or actively misleading.

## Next Focus

Final iteration (16 of 16). Close Q6 by execution rather than reading: `align --dry-run`, `apply --dry-run`, `rollback --dry-run` and `compat --dry-run` against a `/tmp` copy, recording exit status and whether the dry run writes anything. Then synthesise: the P1s this child confirmed (classifier read-only override, `create.sh` template root, goal packet resolution, `usesSpecKit` fallback, and F1's hook/rule divergence here) into one ranked remediation list with the cheap check from F4 per row.
