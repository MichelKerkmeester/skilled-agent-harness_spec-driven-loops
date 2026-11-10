# Review Iteration 004

Dispatcher: fan-out lineage `dsflash-llmgw`, executor cli-pi (deepseek-v4.1-flash), session `fanout-dsflash-llmgw-1791667148881-n911tj`.
Mode: review. Stop policy: max-iterations (5).

## Dimension

Maintainability (D4). Focus: test quality of every changed test (does it fail without its fix), comment hygiene on changed lines, prevent-overengineering review of each commit, and the remaining unverified surfaces.

## Files Reviewed

- `.skilled/bin/tests/compiled-route-manifest.test.cjs:46-49,159-163,459-475,1124-1145` (READ)
- `.skilled/bin/tests/compiled-route-admission.test.cjs:26-33` (READ)
- `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:182-196` (READ)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:28-43,102-129,228-283` (READ)
- `.skilled/repo-rules/prevent-overengineering.md` (READ, standard)
- Changed-line comment scan over all six commits' code diffs (COMMAND)
- `probe/hook-early-write-probe.cjs` (probe)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. Three P1 findings remain active (`R1-P1-001`, `R1-P1-002`, `R2-P1-001`).

### P2 Findings

None new. One P2 (`R3-P2-001`) remains active.

## Test Quality Assessment (spec lens 3)

- **006 late-write test** — the sensitivity claim is now independently reproduced: a write at 100 ms makes the shim read and forward the payload (`stdout {"received":{"prompt":"early prompt"}}`, 592 ms), so the test's `stdout === '{}'` assertion fails on the mutant exactly as the phase claims [SOURCE: `probe/hook-early-write-probe.cjs` output]. The 800 ms write lands after the observed ~551 ms exit; the 2500 ms bound is the shared suite envelope.
- **004 deny-guidance test** — drives the registered `tool_call` handler through `invokeFactory` with `$CLI -p task` and asserts the guidance phrase; it fails without the text change because the old message lacks the phrase. Pass.
- **001 manifest test change** — the derived `HUB_COUNT` keeps both prior failure detections: a dropped/added hub still trips `DEFAULT_ON_HUBS.size === HUB_COUNT` (independent resolver set) and the suite still fails when `--check` cannot resolve the closure. Pass.
- **002 pin change** — one-constant change detector; the 29/29 rerun confirms the pin matches the live corpus. Pass.
- **003 fixture removal** — both copies byte-identical and zero stale references remain; the surviving `jev-alias-narrowness` case still pins the defer behavior. Pass.

## Comment Hygiene (spec lens 5)

- Scanned the added lines of all six code diffs for `specs/`, `NNN-` phase prefixes, finding ids, and "phase N" text: zero hits.

## Prevent-Overengineering (spec lens 6)

- 001: derives a constant from the existing served list and deletes one stale mapping entry — value changes, no new abstraction.
- 002: one constant re-pinned.
- 003: deletions from two existing fixtures.
- 004: one existing string extended in place, one test added.
- 005: one doc line and one goal criterion.
- 006: one optional parameter with a default on an existing test helper (one caller uses it), one test, and a version/changelog record.
- No new dependency, module, interface, config option, or fallback path appears in any commit; each change sits at or below the "extend an existing module in place" rung.

## Traceability Checks

- `spec_code` (core): pass (unchanged from iteration 3).
- `checklist_evidence` (core): notApplicable.
- Overlays: unchanged; `feature_catalog_code` and `playbook_capability` stay partial on `R3-P2-001`.

## Integration Evidence

- `probe/hook-early-write-probe.cjs`: `{"code":0,"signal":null,"elapsedMs":592,"stdout":"{\"received\":{\"prompt\":\"early prompt\"}}","sawPayload":true}`.
- `diff` of the two `004-cli-external-orchestration` fixture copies: identical; `jev-transport-single` count 0 in both.

## Edge Cases

- The guard's new reason string is a ~215-char single line. No repository linter or formatter config covers `.skilled/hooks/dispatch/pi/` (no eslint/prettier/biome config found outside package defaults), and the prior message was already a single long string, so the shape matches the file's existing convention.
- 004's vitest suite, `validate.sh --strict`, and a real `compiled-route-sync` rebuild remain un-runnable or out of scope for this lineage; their claims stay as stated by the commits.

## Confirmed-Clean Surfaces

- Changed-line comment hygiene across all six commits.
- Overengineering review across all six commits.
- The 006 test's mutant-detection claim (independently reproduced).

## Ruled Out

- **004's test pins only a phrase, not the whole guidance.** Ruled out: the phrase asserted is the actionable core; pinning the full sentence would make wording edits fail for no behavioral reason, and the commit's own before/after run covers the clause it added.
- **The long deny string violates a style gate.** Ruled out: no linter or formatter config applies to the path, and the file's existing message strings share the shape.
- **The 006 late-write test is timing-flaky by construction.** Ruled out as a new finding: the observed margin (write 800 ms vs exit 551 ms) is wider than the write delay, and the test uses the suite's existing short-host envelope; a startup slower than 800 ms would be a new machine-level failure mode for the whole suite, not this case alone.

## Next Focus

- Dimension: cross-cutting closure (D1-D4 recheck)
- Focus area: adversarial re-read of the three active P1 findings (P0 replay discipline), coverage completeness against the four dimensions and the six commits, and preparation of the synthesis inputs
- Reason: iteration 5 is the final forced iteration; per the stop policy the lane must run all five, and the closure pass must re-verify active findings rather than raise new angles
- Rotation status: all four dimensions reviewed; closure next
- Blocked/productive carry-forward: unverified 004 suite and strict validation stay caveated
- Required evidence: reread of each P1's cited lines plus its original repro
- Recovery note: none

Review verdict: CONDITIONAL
