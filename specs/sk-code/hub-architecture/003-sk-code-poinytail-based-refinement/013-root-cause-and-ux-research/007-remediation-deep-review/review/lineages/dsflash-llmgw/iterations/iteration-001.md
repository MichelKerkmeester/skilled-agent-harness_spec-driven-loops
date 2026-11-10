# Review Iteration 001

Dispatcher: fan-out lineage `dsflash-llmgw`, executor cli-pi (deepseek-v4.1-flash), session `fanout-dsflash-llmgw-1791667148881-n911tj`.
Mode: review. Stop policy: max-iterations (5). Convergence 0.10 recorded as telemetry only.

## Dimension

Correctness + regression inventory (D1), first pass. Focus: the Pi dispatch guard's deny path, the compiled-routing authored-to-served rebuild wiring, the two changed test pins, the canary fixture removal, README node floor, hook stdin late-write test.

## Files Reviewed

- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:184-185,243-258` — ambiguous branch and the new deny reason (READ)
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:243-263,270-295` — `hasDispatchEvidence` / `inspectDispatch`, the classifier the guard calls (READ, context)
- `.skilled/bin/compiled-route-sync.cjs:117-176,757-808,1001-1021` — closure trace and authored-to-served copy loop (READ)
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs:64` — the changed `sourceInputs()` line (READ)
- `.../008-cli-classifier/fixtures/canary-cases.v1.json` (authored) vs `.skilled/bin/lib/compiled-routing/.../008-cli-classifier/fixtures/canary-cases.v1.json` (served) — byte diff (READ)
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` — `generatedFrom`, copied file list (READ)
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:46-49,159-163,455-475,1124-1145` (READ)
- `.skilled/bin/tests/compiled-route-admission.test.cjs:26-33` (READ)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:28-43,102-129,228-283` (READ)
- `README.md:157-162` (READ)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Authored cli-classifier fixture still expects the removed cli-deem mode, so the next documented rebuild reinstalls a fixture that fails its own gold** -- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70` -- Commit `fde8a56d87` removed the stale `cli-deem` source mapping from the authored harness so the authored closure resolves again, but the authored fixture beside that harness still carries `deem-choice-single` (expected mode `cli-deem`) and `deem-verb-narrowness` (prompt "deem this plan acceptable and ship it"), while the served fixture has no deem cases and instead carries `classifier-verb-narrowness` ("judge this plan acceptable and ship it") [SOURCE: fixture diff, authored lines 70-85 and 107-108 vs served lines 69 and 91-92]. Executing the authored hub against its own fixture throws `gold mismatch for deem-choice-single: action defer but expected route` [SOURCE: probe `probe/authored-classifier-canary-probe.cjs` output]. The rebuild path copies every traced authored closure file into the served tree byte-for-byte, and `--check` lists `009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` among the 55 traced files [SOURCE: `.skilled/bin/compiled-route-sync.cjs:795-806` and `--check` output line 30], so the next rebuild overwrites the corrected served fixture with the stale authored one; the classifier canary then throws where it currently reports 8 cases, 0 failures. The served closure manifest already records the fixture as a copied closure file (`fileCount 62`, `generatedFrom specs/sk-doc/019-...`), confirming fixtures travel through the copy step [SOURCE: `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`].

   Finding class: incomplete fix / latent correctness break.
   Scope proof: the changed manifest file is the authored harness the fix edited; the stale fixture is its sibling input, traced and copied by the same rebuild the phase declares as its deliverable ("A rebuild that traces every hub from the authored source").
   Affected surface hints: authored + served classifier fixtures, `compiled-route-sync.cjs` build copy step, `all-canaries.cjs` classifier row, the served closure manifest.
   Case: run `node specs/sk-code/011-.../003-hub-surface-precedence/scratch/all-canaries.cjs` after any `compiled-route-sync.cjs` rebuild: the cli-classifier hub evaluates the authored fixture because the rebuild copied it over the served one, and the hub throws `GOLD_MISMATCH` instead of reporting 0 failures.

   Claim adjudication:
   ```json
   {
     "type": "incomplete_fix",
     "claim": "A documented rebuild after fde8a56d87 copies the stale authored classifier fixture into the served tree, where it fails gold evaluation, so the rebuild does not produce a healthy serving tree.",
     "evidenceRefs": [
       "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70",
       ".skilled/bin/compiled-route-sync.cjs:795-806",
       ".skilled/bin/lib/compiled-routing/serving-closure.manifest.json",
       "probe/authored-classifier-canary-probe.cjs (GOLD_MISMATCH for deem-choice-single)"
     ],
     "counterevidenceSought": "Ran compiled-route-sync --check (exit 0), the manifest suite (42/42), the admission suite (29/29), and all served canaries (0 failures); read the phase-001 spec, which scopes the fix to two files and marks the served copy out of scope. None of these evaluates the authored fixture's cases, which is why the gap survives every stated verification.",
     "alternativeExplanation": "The authored fixture might be intended as frozen history that a rebuild never copies. Refuted: the served closure manifest lists the fixture as a copied closure file, and commit 003 established the across-copies-identical convention by removing its stale case from both copies.",
     "finalSeverity": "P1",
     "confidence": 0.85,
     "downgradeTrigger": "The real rebuild is run in an isolated copy and the classifier canary still reports 0 failures because the copy set excludes fixtures or the fixture is regenerated first."
   }
   ```

2. **The Pi guard denies benign shell commands whenever a variable expansion and a `-p`/`--print` token coexist, and the new deny text misdiagnoses them as failed dispatches** -- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249` -- `hasDispatchEvidence` classifies a segment as a dispatch candidate when any token is shell-expanded and any token in the whole command is `-p`/`--print` (`variableExecutor`) [SOURCE: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:260`], and `shouldDenyPiDispatch` denies every `ambiguous` inspection unconditionally [SOURCE: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:185`]. This review run's own setup command `mkdir -p "$LIN/prompts" "$LIN/iterations" ...` was blocked live with exactly the new message, and the classifier probe confirms the class: `mkdir -p "$LIN/prompts"` -> `ambiguous`, `cp -p "$SRC" "$DST"` -> `ambiguous`, `node -p "$EXPR"` -> `ambiguous`, while the literal-path control `mkdir -p specs/x/prompts` -> `none` [SOURCE: `probe/guard-probe.ts` output]. Commit `7cd3e8e5db` then tells those callers to "Call one executor by its literal name", which is inapplicable guidance for a copy or a directory creation; the guard's own README documents "ambiguous denied" as policy but offers no test or narrowing for the benign class [SOURCE: `.skilled/hooks/dispatch/README.md:72`].

   Finding class: correctness / false-positive authorization denial (UX regression on the changed message path).
   Scope proof: the manifest includes `dispatch-preflight-lint.ts` and its test; the deny branch the new text lives in is the same branch that produces the false positive, and the classifier that feeds it is cited as context evidence.
   Affected surface hints: `lib/dispatch-audit.mjs` `hasDispatchEvidence`, Pi `tool_call` preflight, `dispatch-preflight-lint.test.ts` deny matrix (no benign `$VAR` + `-p` negative case).
   Case: under the Pi runtime, run a bash command such as `mkdir -p "$DIR"` or `cp -p "$SRC" "$DST"` with any user request other than an executor override: the call is blocked with the ambiguous-dispatch reason even though it invokes no CLI executor.

   Claim adjudication:
   ```json
   {
     "type": "correctness_false_positive",
     "claim": "Any Pi bash command combining a shell variable expansion with a -p/--print token anywhere is classified ambiguous and denied, including commands that dispatch no executor, and the new deny reason gives those callers unusable guidance.",
     "evidenceRefs": [
       ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:185",
       ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249-253",
       ".skilled/hooks/dispatch/lib/dispatch-audit.mjs:260-262",
       "probe/guard-probe.ts output (mkdir/cp/node -p all ambiguous)",
       "live denial of this lineage's own setup command"
     ],
     "counterevidenceSought": "Read the guard README, which documents ambiguous-denied as intended policy; searched the skill and dispatch docs for a documented benign-class carve-out and found none; checked the deny matrix test, which only covers a real variable executor (`$CLI -p task`) and no benign variable-plus-`-p` command.",
     "alternativeExplanation": "The classifier may be deliberately over-inclusive so no disguised dispatch escapes; the observed denials are then the intended cost. That explains the policy but not the absence of the benign-class carve-out or tests, and the new message still misdirects those callers, so the finding stands as an incomplete fix.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "A documented decision that every variable-plus-print-flag command must be denied, with the guidance text amended to cover the non-dispatch case."
   }
   ```

### P2 Findings

None this iteration.

## Traceability Checks

- `spec_code` (core): partial. Phase 001: REQ-001 `--check` exit 0 confirmed; REQ-002 manifest suite `fail 0` confirmed (42/42, `MANIFEST_EXIT=0`); SC-001 authored and served harness byte-identical confirmed (`diff` empty); SC-002 hub-count literal confirmed removed (`HUB_COUNT = sync.HUBS.length`, `.skilled/bin/tests/compiled-route-manifest.test.cjs:49`). Phase 002: pin at 86 confirmed by the passing suite; the pin's 86 could not be re-derived independently inside this lineage (the evidence report lives in the phase folder). Phase 003: canary removal confirmed in both fixture copies; served canaries 0 failures. Phase 006: version 2.7.2.1 present in canonical and Hermes SKILL.md and changelog; hook stdin suite 40/40.
- `checklist_evidence` (core): notApplicable. Level 1 folder has no `checklist.md`.

## Integration Evidence

- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` was executed with the node test runner: `tests 40 / pass 40 / fail 0`, including `a short-deadline entry drops a payload its host writes after the deadline` (551 ms).
- `compiled-route-sync.cjs --check` exit 0, "all 7 hubs resolve", 55 closure files traced under the authored root.
- `compiled-route-manifest.test.cjs` 42/42 and `compiled-route-admission.test.cjs` 29/29.
- `all-canaries.cjs` (seven hubs) exit 0, 0 failures.
- `.pi/extensions/dispatch-preflight-lint.ts` is byte-identical to the canonical `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`, so the commit-004 message reaches the runtime copy.

## Edge Cases

- Observation channel for the guard denial: the block reason was returned instead of command output, and the same command re-issued without the `$VAR`+`-p` combination succeeded, isolating the trigger.
- Authored-fixture probe throws instead of returning a failure count, so the authored hub cannot even summarize its own failures; recorded as the finding's observable symptom.
- The Pi preflight vitest suite (`dispatch-preflight-lint.test.ts`) was not rerun inside this lineage: vitest writes a cache outside the lineage write surface. The new test's target phrase and the deny branch were verified by direct read and by the classifier probe instead; the commit's own `36 passed` claim stays unconfirmed by an independent run (task-quality caveat, not a finding).

## Confirmed-Clean Surfaces

- README states `Node.js 20.19+ (22.12+ for the spec-kit runtime CLI)` and no longer names 20.11 [SOURCE: `README.md:160`].
- The authored and served harness copies are byte-identical after the fix; no `cli-deem` reference remains in either harness or in the served classifier tree.
- Both `004-cli-external-orchestration` fixture copies (served and archived) lost the stale `jev-transport-single` case identically; the removal is symmetric as claimed.
- Canonical and Hermes system-spec-kit SKILL.md differ only in generated-copy header and relative-link rewriting; version 2.7.2.1 matches.

## Ruled Out

- **Derived `HUB_COUNT` hides a dropped hub.** Ruled out: `resolver.DEFAULT_ON_HUBS` is an independent seven-name hardcoded set [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:37-45`], and `.skilled/bin/tests/compiled-route-manifest.test.cjs:1128` asserts its size equals `HUB_COUNT`, so a hub dropped from `sync.HUBS` fails the suite. This mirrors the risk row the phase-001 spec already accepted.
- **Manifest-test literal replacement is tautological against its own message.** Ruled out: `sync.HUBS` is the pinned served list [SOURCE: `.skilled/bin/compiled-route-sync.cjs:51-59`], and the assertions still cross-check the trace against a separate list (`FIXED_HUBS`, engine children).
- **Admission pin at 86 is wrong.** Ruled out: suite 29/29 passes with the pin; the corpus count is asserted by the suite itself.
- **Served canaries regressed from the fixture removal.** Ruled out: 0 failures across seven hubs.

## Next Focus

- Dimension: security (D2), with the deny-path trust boundary as the opening lens.
- Focus area: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` authorization logic, the dispatch-audit classifier's expanded-token handling, secret exposure in the audit log path, and the compiled-route test harness's spawn surface.
- Reason: iteration 1 confirmed two D1 findings on the deny path and the rebuild wiring; D2 must check whether the classifier's tokenizer or the audit writer admits injection or disclosure.
- Rotation status: D1 reviewed (findings open).
- Blocked/productive carry-forward: none blocked; the archived-fixture angle is productive and will be re-checked in the traceability pass.
- Required evidence: file:line for every finding plus a runnable repro.
- Recovery note: none.

Review verdict: CONDITIONAL
