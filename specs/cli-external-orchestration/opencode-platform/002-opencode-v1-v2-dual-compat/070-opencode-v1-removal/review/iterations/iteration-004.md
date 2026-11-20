# Review Iteration 004

## Dispatcher

- Mode: review, target agent `@deep-review` (LEAF, single iteration)
- Run: sessionId `2026-11-20T10:07:53.884Z`, generation 3, lineageMode `restart`
- Iteration derived from `review/deep-review-state.jsonl` (3 prior `type:"iteration"` records) = 4. Matches the dispatched number.
- Budget: 24 tool calls; 15 used for analysis, 6 reserved for the three output artifacts and verification.

## Dimension

**maintainability** — the last uncovered dimension (correctness, security and traceability are closed at iterations 1-3).

Focus areas carried from strategy "Next Focus", all reviewed this iteration:

1. Test brittleness in the suites the merge touched: `dispatch-rule-checks.test.mjs`, the skilled-loop wrapper tests and harness, the plugin tests that build hooks through the `.factory` property, the fanout-run and `opencode-dual-dispatch` vitest suites, and the session-reader tests.
2. Leftover `dual` / `opencode2` / v1 names in file names, identifiers and comments.
3. Doc accuracy of `cli-opencode/SKILL.md`, `README.md`, `references/install-and-versions.md` and `changelog/v2.0.0.0.md` against the merged code.
4. The CI workflow `.github/workflows/opencode-v2-battery.yml` and its `README.md` entry.
5. Duplicated version-parsing logic between `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`.

**How the operator focus was addressed this iteration.** The operator focus (prior fixes hold, OpenCode 2 is the only supported major, no v1 path survives outside the justified list, packet evidence matches the code, and the skilled-loop justified-list gap from `f6aa8dc052b` is confirmed rather than re-reported) is a correctness/security/traceability focus that iterations 1-3 closed. This iteration tested the *maintainability* half of the same claims: the version rule has a live differential guard (Finding 3 shows the guard is narrower than it should be, which is why the *claim* still holds while the guard's coverage is thin), the documented pin `2.3.2` matches the code on both sides that read it, and the naming residue the removal left behind is bounded to three specific identifiers. The `f6aa8dc052b` skilled-loop justification was **not** re-reported — it is confirmed in iteration 3's clean surfaces and is not in scope for a maintainability re-check.

## Files Reviewed

| File | Lines |
|---|---|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | 178-212 (twin comment, `parseOpencodeVersion`, major mapping) |
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | 145-175 (`parseOpencodeVersion`) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | 108, 119-123, 256-257, 520-528 |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` | 74, 1412-1480 |
| `.skilled/hooks/shared/tests/session-readers/opencode.test.mjs` | 42-112, 149-150 |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs` | 137, 166 (shim argv handling) |
| `.github/workflows/opencode-v2-battery.yml` | 1-140 (triggers, test step, install, battery) |
| `.github/workflows/README.md` | 30-42, 71-112 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs` | 1-20 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | 10, 30, 40-41, 195-245, 437-462 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | 51, 148, 284 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | 218-228 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md` | 1-60, 160-178, 200-236 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | 130 |
| `.opencode/plugins/lib/v2-bridge.js` | 300-360 (`dualPlugin`, `setup`) |
| `.opencode/plugins/ARCHITECTURE.md` | 57, 61, 112-131 |
| `.opencode/plugins/*.js` (20 entry files) | default-export line each |
| `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` | 1-15 (13 entries) |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The only test of the `remove-v1` destructive mode is not run by any workflow, while the workflow that its file triggers states the opposite invariant** -- `.github/workflows/opencode-v2-battery.yml:122-123` -- The battery workflow names four `node --test` files and runs them before OpenCode is installed. `opencode-setup-classify.test.cjs` is not among them. That file is the *only* suite that exercises `sh opencode-setup.sh remove-v1` end to end; its own header says so: "The remove-v1 refusal runs the whole helper against a throwaway HOME with a fake npm first on PATH" [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs:7-9]. But the workflow lists `.skilled/skills/cli-external-orchestration/cli-opencode/**` and its `.opencode/` overlay as trigger paths [SOURCE: .github/workflows/opencode-v2-battery.yml:26,51], so an edit to `opencode-setup.sh` — the file whose `rm`/`mv` sequence is the highest-consequence code in this merge — starts the workflow, and no step in it tests the helper. The workflow's own comment states the invariant that this breaks: "Some of the trigger paths are unit tests, and a trigger path no step runs starts the workflow without checking the change that started it" [SOURCE: .github/workflows/opencode-v2-battery.yml:110-113]. A repo-wide search found no other runner: no workflow, and no `scripts` entry in either `package.json`, invokes the file (both `package.json` scripts objects are empty). The test exists in both the canonical and the `.opencode/` overlay tree, so the gap is coverage wiring, not a missing test.
   - Finding class: test-inventory / CI coverage gap
   - Scope proof: the workflow, the test file and both `package.json` files are all inside the declared review scope; the claim is a negative existence check over the workflow set, discharged by grep over `.github/` and both package manifests.
   - Affected surface hints: `.github/workflows/opencode-v2-battery.yml` test step; `.github/workflows/README.md:41` (the sentence describing which tests that workflow runs); `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs` (the overlay copy that must move with any fix)
   - Case: A PR edits `maybe_move_aside` or `check_v1_launcher` in `opencode-setup.sh` so the preserve-aside path stops restoring the user's `opencode` entry, or so a foreign regular file is removed instead of refused. The battery workflow fires on that path change, the four named tests pass because none of them loads the setup script, and CI reports green on a `remove-v1` regression that would delete a user's file.

2. **The CJS/ESM parser parity test is bounded by a 9-element hand-written list while the same file already loads a 13-entry corpus that covers five of those cases and all of the interesting ones** -- `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:527` -- The `parseOpencodeVersion` bodies in the ESM and CJS copies are currently byte-identical [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:187-212] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:149-175], and the ESM copy carries a comment naming its twin and its parity case, which is correct and well placed [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:178-180]. The guard that keeps them in step iterates `VERSION_OUTPUTS` — nine constants [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:108]. Fifteen lines above it the file parses `opencode-version-corpus.json` into `VERSION_CORPUS` (13 `{output, family}` rows) and another assertion already loops over it [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:119-123,256-257]. The corpus rows the parity loop does not necessarily reach include `v1.19.3`, `opencode 1.19.3`, `1.19.3-beta.1`, `3.0.0`, `0.9.1`, `"\n1.19.3"` and `WARN: falling back to defaults\n1.19.3` — that last one is the multi-line warning-prefixed shape the token scan exists to handle. So the one direction that matters for a duplicated rule (one side drifts, the other does not) is only provable over the narrower list, and the fix is one expression: iterate `VERSION_CORPUS.map((entry) => entry.output)`.
   - Finding class: duplicated-rule guard breadth
   - Scope proof: both parser copies and the parity test are named review-scope files; the corpus is loaded by the test under review, so its content is evidence, not a new target.
   - Affected surface hints: whichever of the two parsers a future edit touches; `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` as the shared fixture the parity loop should consume
   - Case: Someone fixes the token scan in `opencode-version.cjs` only — say, to stop returning `unknown` on `WARN: …\n2.x` — and adds no fixture. The parity test compares both parsers over the nine constants, none of which has a warning prefix, so the two sides diverge on the corpus's warning row and the suite stays green.

3. **The merged tree's primary plugin export builder is still named `dualPlugin`, and its own contract comment now describes a single-target builder** -- `.opencode/plugins/lib/v2-bridge.js:327` -- Every plugin entry file builds its default export with `dualPlugin(id, factory)` — 20 of them, e.g. [SOURCE: .opencode/plugins/session-cleanup.js:375], [SOURCE: .opencode/plugins/opencode-goal.js:3764]. The name is a direct carry-over from the v1/v2 dual-compat era this packet removed. The function's own JSDoc contradicts the name: "Build the OpenCode 2 plugin definition around a hook factory. The host reads the enumerable `{ id, setup }` shape; the factory rides along as a non-enumerable `factory` property" [SOURCE: .opencode/plugins/lib/v2-bridge.js:317-326]. The only "dual" left is host-entry versus test-entry, which the comment states as a per-property detail rather than as the module's purpose, and `ARCHITECTURE.md` describes the same function the same single-target way [SOURCE: .opencode/plugins/ARCHITECTURE.md:112,123]. The concrete cost is that a maintainer reading any entry file's last line cannot tell from the name whether a second major is still routed there, and has to open `lib/v2-bridge.js` to learn that it is not — which is exactly the question a v1-removal merge should have made answerable from the call site. This is **distinct from** the open P2 about `opencode2` remaining a live launcher name in tests and docs: different identifier, different files, different fix, so it is a new finding and not a re-report of that one.
   - Finding class: naming residue / comprehension cost
   - Scope proof: `v2-bridge.js` and the entry files are named review-scope files; the claim is a grep-verified import census plus a direct read of the builder contract.
   - Affected surface hints: all 20 `.opencode/plugins/*.js` entry files' import and default-export lines; `.opencode/plugins/ARCHITECTURE.md:57,61,112,123`; `.opencode/plugins/tests/v2-registration.test.cjs` and the suites that reach the non-enumerable `.factory` property
   - Case: A maintainer is asked whether OpenCode 1 is still supported and greps the plugin tree for the entry contract. Every plugin answers `dualPlugin(...)`. They must then read `lib/v2-bridge.js` and its JSDoc, and cross-check `ARCHITECTURE.md`, to establish that no v1 branch exists. A rename to something like `v2Plugin` (or a bridge-contract name) would answer it at the call site.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The maintainability claims this iteration rests on are code-side only: the parity guard's breadth (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:527`) and the duplicated rule's twin comment (`.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:178-180`) agree with each other, and the documented pin matches the code that reads it — README says the repository pins 2.3.2 and the helper installs exactly that pin [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51], the helper declares `V2_PKG="@opencode/cli@2.3.2"` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:30], and the CI job pins the same string [SOURCE: .github/workflows/opencode-v2-battery.yml:86]. |
| `checklist_evidence` | notApplicable (this dimension) | Acceptance-criteria evidence was run to closure in iteration 3 and is not re-run here; no AC row is a maintainability claim. Recorded as `applicable:false` for this iteration rather than deferred, because nothing is outstanding. |
| `skill_agent` | pass | The `cli-opencode` skill contract's own version and setup statements match the code: `README.md:51` (2.3.2 pin, v1 = `unsupported`), `references/install-and-versions.md:218-228` (the `remove-v1` section's refusal order — "a symlink, a folder or a file that does not run the old package is refused, and nothing is changed" — matches `check_v1_launcher` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:222-240], which refuses the symlink first, returns early when the launcher is absent, and then refuses a non-regular or non-`opencode-ai` file), and `changelog/v2.0.0.0.md`'s per-change claims (battery drops its v1 legs, wrapper keeps only the v2 form, two dispatch rules retired) all match the merged code. `SKILL.md:130` keeps one deliberate v1 reference — the stdin-hang reproduction is recorded on v1.14.39 with no v2 reproduction — which is accurate rather than stale. |
| `agent_cross_runtime` | notApplicable (this dimension) | The runtime-mirror parity check is a traceability protocol closed by 003 AC-011; nothing in the maintainability findings turns on a mirror. Recorded `applicable:false`. |
| `feature_catalog_code` | pass | `feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md`'s claims about the resolver families were validated in iteration 3; this iteration adds the guard's existence and breadth (Finding 2), which is consistent with the catalog's statement that the two copies are kept in parity. |
| `playbook_capability` | pass | The cli-opencode manual testing playbook documents `remove-v1` as a capability, and the helper's mode dispatch still offers exactly `<v2|remove-v1|check>` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:10,439-461]. Finding 1 is about that capability going untested in CI, not about it being undocumented or unsupported. |

## Integration Evidence

Exact surfaces named and checked this iteration:

- `/deep:review` loop owner: `.skilled/commands/deep/review.md` — not re-read this iteration; the packet boundary it set (iteration 4 of 5, maintainability) was honored as dispatched.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — read-only by contract; not invoked by this agent.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — invoked once with `--mode review` against the resolved run directory; receipt required before this iteration counts as durable.
- CI surface actually reviewed: `.github/workflows/opencode-v2-battery.yml` plus its row in `.github/workflows/README.md:41`, and the workflow's participation in the sparse-checkout and gating tables at `README.md:71,89,108,112` — all five README statements match the workflow body (sparse-checkout exclusions, `SKILLED_CI`/`SKILLED_CI_TESTS` gating, the `./.github/actions/setup` use, and the four named unit tests).
- Hook surface: `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and its deep-loop twin `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, checked against their shared guard in `runtime/tests/unit/opencode-dual-dispatch.vitest.ts`.
- Plugin surface: `.opencode/plugins/lib/v2-bridge.js` and its 20 consumers, checked against `.opencode/plugins/ARCHITECTURE.md`.

## Edge Cases

- **Schema-versus-implementation priority.** The dispatch asked for the v2 search-depth fields on the record whenever scope is standard or complex. This run's `deep-review-config.json` carries no `scopeClass`, and the preceding three iterations recorded v1-shaped records that the reducer accepted. Resolved by writing the richer v1 shape plus `reviewDepthSchemaVersion: 2` and the four v2 blocks, so the record satisfies both readings; if a post-dispatch validator rejects the v2 blocks it can ignore them, whereas a missing v1 field would be unrecoverable.
- **`VERSION_CORPUS` in the mandated `targetSelection` versus a review-scope file.** `opencode-version-corpus.json` is itself a review-scope file, so nothing was invented for it. The finding uses it only as evidence about the test's own fixture inventory.
- **`dualPlugin` naming could be read as intentional** — "dual" = host entry plus non-enumerable test entry. Kept at P2 and, to make the severity defensible, the finding rests on the JSDoc's single-target framing and on the cost to a maintainer at the call site, not on a claim that the name is wrong. `downgradeTrigger`: if a maintainer can cite a place where the name still describes live two-major routing, the finding is a non-issue and should be dropped.
- **Finding 1 severity.** A CI coverage gap is invisible to users and breaks no documented behavior *today*, so P2 is the ceiling. It stays an active finding rather than a note because the untested code is the one path in this merge that deletes files, and the workflow's own comment defines the invariant it breaks.
- **Prior-iteration carried P2s were not re-investigated.** The five open P2s (opencode2 launcher name, battery bind address, unmapped hook key, event-capture header, CHK-041 proof command) were read from the registry for dedupe only. Findings 1-3 are new and none of them restates one of those five.

## Confirmed-Clean Surfaces

- `dispatch-rule-checks.test.mjs` is deliberately written against identifiers rather than counts, and says why in place: "Assert the ids, not a bare count: this line read `length, 1` while the packet had…" [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs:74]. Its rule loops also fail loudly on an empty rule set rather than passing vacuously [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs:1421,1480].
- The session-reader suite asserts structural facts (locator kind, per-item roles and text, tool-call pairing, error codes such as `session_mismatch` and `store_unreadable`) rather than a snapshot of the whole tree [SOURCE: .skilled/hooks/shared/tests/session-readers/opencode.test.mjs:42-50,66-69,94-97,107-112,149-150]. Nothing in it is pinned to a v1 storage shape.
- The skilled-loop wrapper harness derives its argv from `process.argv.slice(1)` and reads the marker selector instead of hard-coding an invocation list [SOURCE: .skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs:137,166], so it does not have to be edited when a wrapper test adds a case.
- The workflow's trigger paths, the sparse-checkout exclusions and the gating variables each match their README description, and the four unit tests the workflow names all exist. The README's `opencode-v2-battery.yml` row is accurate on the pin, the prefix install and the test list [SOURCE: .github/workflows/README.md:41].
- No changed code comment carries a packet, requirement or task id in a way that violates comment hygiene; the iteration-3 sweep over that class was not reopened and this iteration's reads of `v2-bridge.js`, `opencode-version.mjs`, `opencode-setup.sh` and the workflows found only durable WHY comments (e.g. why the parity comment names its twin, why the battery installs into its own prefix, why the sparse checkout skips `specs/`).
- The `remove-v1` documentation is accurate against the code on the refusal order, the "nothing was changed" ordering, and the data-file non-removal claim [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:226-228].

## Ruled Out

- **"The duplicated version rule has no parity guard at all."** Ruled out: `it('keeps CJS parsing in parity with the ESM parser for every fixture')` exists and compares both implementations over a shared fixture list [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:520-528]. Residual defect is the fixture list's breadth, filed as DR4-P2-002.
- **"`VERSION_PATTERN` drifted between the two copies."** Ruled out: both declare the identical regex, character for character [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24].
- **"The battery workflow's README row overstates what it runs."** Ruled out: the row names the pin (2.3.2), the own-prefix install, the version battery and the four unit tests, and the workflow body does exactly that [SOURCE: .github/workflows/README.md:41].
- **"A v1 branch survives in a plugin entry file under a dual-shaped export."** Ruled out: `dualPlugin` builds one `{id, setup}` definition whose `setup(ctx)` reads only `ctx.location.directory` and the v2 hook surface; no entry file carries a second default export or a version switch [SOURCE: .opencode/plugins/lib/v2-bridge.js:327-357].
- **"The `.opencode/` overlay drifted from the canonical tree in the files this merge touched."** Ruled out for the evidence surfaces read: the setup-classify test exists in both trees, and the battery workflow names both overlay paths symmetrically [SOURCE: .github/workflows/opencode-v2-battery.yml:26,51].
- **"Doc residue presents v1 as still supported."** Ruled out: every v1 mention read in `README.md`, `install-and-versions.md`, `SKILL.md` and the changelog is historical, migration, or a recorded-reproduction note [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51,148,284] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:218-228].

## SCOPE VIOLATIONS

None. No mutation was attempted or required outside the three permitted artifact paths and the append gateway's own run-directory writes.

## Next Focus

- Dimension: maintainability (closing) — iteration 5 is the final permitted iteration.
- Focus area: the two documentation defects carried from iteration 3 (DR3-P2-001, DR3-P2-002) re-read against their files, and the three findings filed here re-read for severity consistency before synthesis. No new dimension remains; the rotation is complete.
- Reason: all four configured dimensions have now been reviewed at least once (correctness 1, security 2, traceability 3, maintainability 4). What iteration 5 can still buy is a consistency pass over the open P2 set rather than a new direction.
- Rotation status: complete. `dimensionCoverage` is 4/4 after this iteration.
- Blocked/productive carry-forward: reuse "read the guard together with the fixture it iterates" — it is what turned an apparent clean parity test into Finding 2, and it is the cheapest way to re-check DR3-P2-002 in iteration 5.
- Required evidence: file:line for each of the five open P2s as they stand on the merged tree, and a stated verdict on whether any of the eight (five carried plus three new) has since been fixed by `f6aa8dc052b` or by later main-branch commits.
- Recovery note: not applicable — this iteration completed inside budget with no stuck count.

Review verdict: PASS
