# Iteration 004 — Maintainability

## Dimension

maintainability (iteration 4 of 5). Focus: the three files commit `f34b01bf0a` touches — the local-vs-native divergence ratchet (fresh skill-graph index, pinned scoring clock, regime header), the widened holdout independence check, and the two new blocking steps in the `golden-prompt-gate` job. This dispatch is read-only, so no gate was executed; every claim below is a code-read observation, and execution remains the operator's verification step.

## Files Reviewed

- `.github/workflows/routing-registry-drift.yml:264-303` — new `setup-python` step and the two new blocking steps.
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:1-428` — full file: regime header, `REQUIRE_PYTHON`, `ledgerScoringInstant`, `indexFreshSkillGraph`, `beforeAll`/`afterAll`, all seven tests.
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:1-369` — full file: `SCORING_SURFACES`, `NON_SCORING_REFERENCES`, corpus loaders, directory scan, the three declaration tests, baseline test.
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1-774` — 74 entries across 14 distinct `approvedAt` dates, newest `2026-10-11`.
- `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts:31-41` — the `now`-dependent multiplier the clock pin exists for.
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:179-183` — the sibling ratchet's `capturedAt` pin, used as the comparison idiom.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:169-181` — `capturedAt` stamping of new ledger entries.

## Findings by Severity

### P0

None.

### P1

None new. The active P1 from iteration 3 (`R3-P1-001`, the missing skill version bump/changelog) remains open in the registry; it is not re-derived here.

### P2

#### 1 [P2] R4-P2-001 — The fresh-graph regime is arranged but never asserted

- Case: the native `fusion.js` import moves back to a static import, `SYSTEM_SKILL_ADVISOR_DB_DIR` is renamed, or `indexSkillMetadata` stops writing into the temporary directory. The suite still loads and runs; because nothing asserts that `FRESH_DB_DIR` holds a populated graph, the first visible symptom is ledger-mismatch failures under rules (b)/(c) that point at ledger entries rather than at the broken arrangement. The header's promise — both scorers read a graph indexed fresh from this checkout [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:14] — would be false while the failure text gives no hint.
- File: `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:235`
- Evidence: full-file read shows `FRESH_DB_DIR` appears only at `:260` (declaration), `:290` (assignment), and `:334` (cleanup) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:260] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:290] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:334]; there is no `existsSync` or probe against it. The load-order guarantee exists only as a comment [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:209], and the `closeDb(); indexSkillMetadata(...); closeDb()` sequence at `:240-242` carries no explanation of why either close is load-bearing.
- User impact: a maintainer debugging a red gate gets the wrong first theory; a regime downgrade that still agrees with the ledger keeps the gate green without the regime its approvals describe.
- Finding class: test-isolation
- Scope proof: direct read of the full test file; the only binding between scoring and the fresh graph is import placement, which neither TypeScript nor vitest enforces. The current wiring itself was verified in iteration 1 (the `projection.ts` capture-order direction, ruled out), so this is not a claim that the wiring is broken today.
- Affected surface hints: ["ratchet beforeAll", "skill-graph indexing", "scoring regime"]
- Recommendation: after `indexSkillMetadata`, assert `existsSync(join(FRESH_DB_DIR, 'skill-graph.sqlite'))` (the filename is the module constant at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:136]) and add one sentence on why both `closeDb()` calls are load-bearing.
- confidence: medium-high
- downgradeTrigger: an assertion or probe on the graph directory is added, or evidence that a missing graph always fails loudly and unmistakably.

#### 2 [P2] R4-P2-002 — The pinned scoring instant is derived from the growing ledger, so one new approval re-pins every entry

- Case: an operator approves one new divergence and the capture script stamps it with the day it ran (`approvedAt: capturedAt` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:181]). `ledgerScoringInstant` returns the maximum of the 74 entry dates [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:223], so adding one entry dated later than the current newest (`2026-10-11`) silently re-scores every existing entry at the new instant. Age decay is time-dependent [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts:31], and the packet's own known context records a calendar-driven top-1 flip at a later instant (`rr-iter3-166` at 2027-01-01), so untouched entries can flip and rules (b)/(c) then report old entries as changed — with no message saying the pin itself moved.
- File: `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:222`
- Evidence: `ledgerScoringInstant` derivation [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:222] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:224]; fixture contains 74 entries over 14 distinct dates (measured with `python3` over the fixture); the sibling baseline ratchet pins to a field of the artifact it validates (`BASELINE.capturedAt` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:183]), which does not move when new ledger entries are appended.
- User impact: ledger growth can demand re-review of unrelated entries; the "pinned" clock is data-dependent rather than a reviewed constant.
- Finding class: test-isolation
- Scope proof: distinct from the still-open R1-P2-001 (capture vs replay regimes): that finding concerns the capture script scoring at a different clock and graph than the test; this one concerns the replay pin being unstable across ledger edits on the same code.
- Affected surface hints: ["ledger fixture", "scoring clock", "age haircut"]
- Recommendation: record the scoring instant explicitly (for example a top-level `scoringInstant` field in the fixture that only an approval updates) or pin each entry to its own `approvedAt`; at minimum print the resolved instant in the failure output so the pin move is visible.
- confidence: medium
- downgradeTrigger: per-entry pinning, an explicit fixture-level instant, or evidence that a pin move cannot flip any approved entry.

#### 3 [P2] R4-P2-003 — `SPECKIT_PARITY_REQUIRE_PYTHON=0` cannot deliver the python-less run its comment promises

- Case: `python3` is absent and the operator follows the instruction "Set `SPECKIT_PARITY_REQUIRE_PYTHON=0` only in a genuinely python-less environment" [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:42]. `beforeAll` returns at `:274` without pinning the clock or loading the corpus, and the suite then fails anyway: the new self-check asserts `SCORING_INSTANT` is non-null [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:340], and the corpus test asserts a non-trivial corpus. So the knob replaces the loud install error with two confusing assertion failures; no documented path makes the suite skippable.
- File: `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:40`
- Evidence: the comment and constant [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:40] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:43]; the early-return branch [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:274]; the self-check that fires on the empty state [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:340].
- User impact: a maintainer on a python-less machine follows the comment and gets red output whose cause is the follow-up assertions, not the missing interpreter.
- Finding class: instance-only
- Scope proof: the knob predates the commit, but the commit's new pinned-clock self-check is one of the two tests that fire on the empty state, so the comment-versus-behavior gap is now partly commit-authored; the fix is a one-file edit inside the reviewed scope.
- Affected surface hints: ["python gating", "vitest skip semantics"]
- Recommendation: either implement the skip (`describe.skipIf(!pythonReachable())` or equivalent) or correct the comment to say the knob only changes the failure mode and that a python-less machine cannot pass this gate by design.
- confidence: high
- downgradeTrigger: a skip path is found elsewhere (for example in vitest config) or the comment is confirmed to mean the narrower reading.

## Traceability Checks

- spec_code: pass for this dimension. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82], and R3/R5/R8 remain implemented as iteration 3 recorded. New findings map to the changed code, not to untouched packet docs.
- checklist_evidence: fail, carried from iteration 3 and unchanged: `implementation-summary.md` is still the template with no ledger rows and no Tests table, and nothing in this iteration's commit touched it.

## Ruled Out This Iteration

- Full-tree scan cost: 314 candidate source files under the runtime directory (node_modules, dist, coverage and .vitest skipped), reads only, no model or network calls — bounded, no finding.
- Comment hygiene: the new comments in all three files state durable WHYs; no spec paths, ADR/REQ/task ids, or ephemeral labels were found in the added comments.
- Duplicated environment-freezing and temp-db setup across the parity tests: the commit follows an established per-file pattern (`freezeNativeEnv` here, `freezeEvalEnv` in the holdout and sibling baseline ratchets) rather than introducing a new divergence; extracting a shared helper would edit frozen test files outside this change's purpose, so it is noted and not registered.
- Holdout temp-dir leak: `mkdtempSync` at holdout `:240` has no `rmSync` counterpart while the ratchet's new `afterAll` cleans up [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:334]; the leak is pre-existing, OS-temp scoped, and has no user impact — not registered.

## Next Dimension

All four declared dimensions are now covered (correctness, security, traceability, maintainability). Iteration 5 is the final round: synthesis and residual-risk sweep, with no new dimension to open.

## Verdict

No P0 and no P1 findings this iteration; three new P2 maintainability findings. The registry still carries the active P1 `R3-P1-001`, so the run-level release gate remains conditional even though this iteration's own line is PASS. Because no gate was executed in this read-only dispatch, the same residual risk from iteration 1 stands: the pass/fail behavior of the two rewritten gates is asserted from code reading, not from a run.

Review verdict: PASS
