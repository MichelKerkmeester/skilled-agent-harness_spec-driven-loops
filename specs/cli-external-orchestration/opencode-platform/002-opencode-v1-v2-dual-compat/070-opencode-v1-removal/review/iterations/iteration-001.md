# Iteration 001: Correctness (inventory pass)

## Dispatcher

- Mode: review, target agent `@deep-review`, single iteration (1 of 5).
- Run: `2026-11-20T10:07:53.884Z`, generation 3, lineage `restart`, continuedFromRun `null`.
- Review target: `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal` (spec-folder), plus the merged code/CI/doc surfaces named in the review focus.
- Operator focus addressed in this iteration: prior-review fixes (DR4-P1-001, DR3-P1-001) re-verified; OpenCode 2 shown to be the only supported major in the shipped parsers and gates; the T021 repo sweep re-run and diffed against the justified list (including the `skilled-loop` gap fixed in `f6aa8dc052b`).

## Files Reviewed

- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:22,187-213,225-294
- .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:22,53,1091-1152
- .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:119-136,151-177,191-216
- .skilled/bin/skilled-loop:1218-1238
- .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:184-240,327-366
- .skilled/commands/doctor/scripts/opencode-version-battery.cjs:9-12,52,359-391,468-482
- .vibe/plugins/repo-guards/session-cleanup.mjs:50-63
- .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:36-38
- .opencode/plugins/lib/v2-bridge.js:318-346,594
- .opencode/plugins/ARCHITECTURE.md:112-133
- .skilled/hooks/shared/session-readers/opencode.mjs:43-58
- .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:1-28
- .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:190,240-242
- .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51,267
- specs/.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md AC-001, AC-004, AC-007
- specs/.../003-v1-docs-and-playbooks-sweep/implementation-summary.md:3,13,84-88,113
- specs/.../003-v1-docs-and-playbooks-sweep/tasks.md:70,125-126,137
- specs/.../003-v1-docs-and-playbooks-sweep/scratch/justified.txt (32 rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`opencode2` is still a live v2 launcher name in tests and docs, but the version probe no longer trusts it** -- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121-133 -- `trustedExecutables()` now resolves only `opencode` plus `OPENCODE_BIN`; the merge removed `opencode2` (diff `06d02096e90^1..06d02096e90`). A path-qualified `.../opencode2 run ...` therefore fails `trustedExecutableFor` and resolves to `unknown` instead of `v2`. Other tracked surfaces still treat `opencode2` as a legitimate v2 spelling: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs:51-53 ("`opencode` on the recommended layout and to `opencode2` where its package left that [name]"), .opencode/plugins/tests/system-dist-freshness-guard.test.cjs:196-208, .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs:267,672. The dispatch consequence is currently latent: `unknown` and `v2` both take every rule at its declared severity while `SUPPORTED_FAMILIES` is `['v2']` and every rule declares `appliesTo: ["v2"]`, so no rule outcome changes today.
   Finding class: latent-correctness / vocabulary-drift
   Scope proof: both cited names sit inside the declared review scope (runtime hook lib, cli-opencode tests, opencode plugin tests); the behavior difference is confined to the path-qualified branch of `resolveOpencodeVersionSync` because a bare name is resolved by `resolveOnPath` without the trust comparison (opencode-version.mjs:240-243, 275-277).
   Affected surface hints: cli-dispatch preflight hook (`evaluate`), any dispatch that spells a path-qualified `opencode2`, and the models-form test's `COMMAND_PATTERN` vocabulary.
   Case: an operator runs `/opt/opencode/bin/opencode2 run -m provider/model "task" </dev/null` with `OPENCODE_BIN` unset. The probe reports `unknown`; the rules still apply at declared severity, so nothing breaks until a rule declares an `appliesTo` that excludes `v2` — then the legitimate v2 binary would be held to a rule it was meant to skip.
   ```json
   {"type":"finding-adjudication","claim":"The removal of `opencode2` from `trustedExecutables()` makes a path-qualified v2 launcher named `opencode2` resolve to `unknown`, diverging from the test and doc vocabulary that still calls it a v2 spelling.","evidenceRefs":[".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:121",".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:140",".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs:51",".opencode/plugins/tests/system-dist-freshness-guard.test.cjs:196",".skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs:672"],"counterevidenceSought":"Checked whether any current hard rule distinguishes `unknown` from `v2`: dispatch-rule-checks.mjs:1119-1136 gives both every rule at declared severity because SUPPORTED_FAMILIES is ['v2'] and all four rules declare appliesTo ['v2'] (hard-rules.json:7,14,21,28). Checked whether a bare `opencode2` also fails: it does not, resolveOnPath is used without the trust comparison.","alternativeExplanation":"The name `opencode2` may have been retired together with the v1 line, and the surviving test strings may be inert fixtures. The models-form comment describing where a package 'left that name' argues against full retirement but does not prove a live install.","finalSeverity":"P2","confidence":0.6,"downgradeTrigger":"Downgrade to a note if `opencode2` is confirmed retired as a launcher name (no setup-helper mode writes it); escalate to P1 if a rule ever declares an `appliesTo` that excludes `v2`, which would turn this latent drift into a false positive on a supported binary."}
   ```

## Traceability Checks

- Core `spec_code` -- status: pass. Claimed behavior checked against implementation: "major 1 is `unsupported`, a deep-loop lineage refuses it, the dispatch guard checks it against every rule" (install-and-versions.md:190, README.md:51). Verified in .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:120-125 (throws `E_OPENCODE_UNRESOLVED` naming OpenCode 1), .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:205 (returns `unsupported`), and dispatch-rule-checks.mjs:1123-1136 (unresolved families take every rule, preserving `error` severity for all four `appliesTo:["v2"]` rules). "OpenCode 2 is the only supported major" verified at opencode-version.mjs:22 (`['v2']`), opencode-version.cjs:169-171, and opencode-version-battery.cjs:52 (`FAMILIES = ['v2']`).
- Core `checklist_evidence` -- status: pass. AC-007/T021 re-run with the recorded exclusions produces exactly 32 files, and `comm` shows no file in either difference: the sweep equals `scratch/justified.txt`. The `skilled-loop` entry (justified.txt:2) and its wrapper test (justified.txt:10) are present, confirming `f6aa8dc052b`; not re-reported. AC-004 "Met" (acceptance-criteria.md AC-004) now matches implementation-summary.md:13,88 ("AC-004 met live ... on OpenCode 2.3.2"), closing prior DR3-P1-001.

## Integration Evidence

- `@deep-review` dispatcher contract: `.skilled/commands/deep/review.md` route resolved by the prompt pack; no nested dispatch performed.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (`--mode review`) is the only writer of `review/deep-review-state.jsonl` for this iteration.
- Prior P1 DR4-P1-001 re-verified: .vibe/plugins/repo-guards/session-cleanup.mjs:51,60 call `sessionCleanupPlugin.factory(...)`; the factory is the non-enumerable property defined at .opencode/plugins/lib/v2-bridge.js:594, and .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:38 builds hooks through `plugin.factory`. No `.server(` caller remains under `.vibe/plugins/` or `.opencode/plugins/`.

## Edge Cases

- The operator focus names a merge, a closure commit and a parent fix; this iteration read the merged working tree plus targeted `git diff 06d02096e90^1 06d02096e90` slices, not the full 458-file diff. Merge-wide coverage stays open for later dimensions.
- `.skilled/output`, `.skilled/logs`, `.skilled/skills/.state` and `barter/` contain v1 spellings but are untracked/gitignored or vendored copies; the T021 sweep respects `.gitignore`, so they are outside the recorded criterion rather than unlisted survivors.
- The dispatch-instruction mismatch noted by the state summary (default `lineageMode: new` example versus config `restart`) was resolved from config: all records carry `restart`, generation 3.
- A widened personal grep (`1.19.3`, `v1.14.39`) matches .opencode/plugins/ARCHITECTURE.md, but the canonical T021 term set does not; not treated as a gap.

## Confirmed-Clean Surfaces

- Both version parsers agree byte-for-byte on `VERSION_PATTERN` and the major mapping (`1 -> unsupported`, `2 -> v2`, else `unknown`); the parity test named in both comments exists at .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts.
- Fail-open/fail-closed split is real and documented: the hook resolver returns `unknown` on any failure (opencode-version.mjs:291-293), the deep-loop resolver throws for `unsupported` and `unknown` (opencode-version.cjs:120-131).
- `skilled-loop`'s new OpenCode 1 guard reads the version through the deep-loop parser and refuses only the `unsupported` verdict, leaving a failed or timed-out probe non-blocking (.skilled/bin/skilled-loop:1225-1237).
- `opencode-setup.sh` `remove-v1` refuses a symlinked or foreign launcher before the first write (opencode-setup.sh:222-239) and preserves a v2 link that npm would delete by name.
- The session reader defaults to `opencode.db` (.skilled/hooks/shared/session-readers/opencode.mjs:58); the v1-era `opencode-v1.db` is not read.

## Ruled Out

- "An OpenCode 1 binary still passes the dispatch guard unchanged": ruled out. `unsupported` is in `UNRESOLVED_FAMILIES`, and because `SUPPORTED_FAMILIES` is `['v2']`, `appliesToAll` is true for every current rule, so the two `error` rules still block.
- "The `unknown` verdict lets a dispatch slip the version filter": ruled out for the same reason; unresolved families take every rule rather than none.
- "`opencode2` removal breaks bare-name probes": ruled out; the trust comparison runs only on the path-qualified branch.

## Next Focus

- Dimension: security.
- Focus area: the v1-removal trust seam and the live-dispatch surfaces — `trustedExecutableFor` symlink/identity handling, the `OPENCODE_BIN` override path, the `remove-v1` launcher guards, and secret handling in the doctor battery and setup helper.
- Reason: iteration 1 exhausted the correctness inventory of the version gate; the same files carry the privilege and destructive-action surfaces.
- Rotation status: correctness reviewed (score: clean, 1 latent P2); security, traceability, maintainability remain.
- Blocked/productive carry-forward: productive category "read the producer and its consumer together" (parser + rule engine + callers) should be reused for the security pass; no blocked approaches.
- Required evidence: file:line for every claim about the trust comparison, the setup helper's refusal order, and any credential surface.
- Recovery note: not applicable.

Review verdict: PASS
