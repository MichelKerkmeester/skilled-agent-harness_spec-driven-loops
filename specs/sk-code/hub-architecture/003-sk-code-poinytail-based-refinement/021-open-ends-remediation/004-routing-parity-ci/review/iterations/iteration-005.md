# Iteration 005 — Correctness (final)

## Dimension

correctness (iteration 5 of 5, final). Read-only dispatch: no repository gate was executed; every claim below is a code-read observation or a read-only probe — a faithful python3 replay of the widened gate's family/overlap logic over the live tree, fixture statistics, symbol and line existence checks, a declared-consumer existence scan and a workflow grep. Execution of the two rewritten vitest gates remains the operator's verification step.

## Files Reviewed

- .github/workflows/routing-registry-drift.yml:264-303 — the setup-python step and the two new blocking steps; whole-file grep for continue-on-error and the trigger paths.
- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:1-427 — full file: regime header, REQUIRE_PYTHON, ledgerScoringInstant, indexFreshSkillGraph, beforeAll/afterAll, all seven tests.
- .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:1-368 — full file: SCORING_SURFACES, NON_SCORING_REFERENCES, loadCorpusFamilies, surfaceOverlap, the three declaration tests, the provenance test and the baseline test.
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1-774 — 74 entries, 14 distinct approvedAt dates, newest 2026-10-11.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:1-220 — env freeze, capturedAt stamping, ledger merge rules.
- .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts:31-41 — the now-dependent multiplier the pin exists for.
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:136,566,964 — DB_FILENAME, closeDb, indexSkillMetadata.
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70 — module-load read of SYSTEM_SKILL_ADVISOR_DB_DIR.
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:259-267 — the same override resolved at import by the Python side.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:1-138 — holdout assembly, family dedup and training-collision drop.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1-66 — 66 rows.
- specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:1-158 — requirements, success criteria, Files to Change.

## Findings by Severity

### P0

None new; the registry carries none active.

### P1

None new. The registry carries active R3-P1-001 (no skill version bump or changelog entry); the commit touches no SKILL.md or changelog file, so it is not re-derived here.

### P2

None new. The registry's nine active P2s remain as recorded by iterations 1-4; none was re-observed as a new instance, and none is re-reported.

## Verification Performed (why this pass adds no finding)

1. Widened declaration gate replayed green. I reimplemented normalizeFamily, loadCorpusFamilies, surfaceOverlap and both new declaration tests [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:306] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:322] in python3 over the live tree — same corpora, same seven corpus-reference families, same surface table. Result: 66 holdout rows (40 holdout-regression / 20 holdout-harder / 6 holdout-delegation); undeclared overlaps: none; stale declarations: none; holdout rows colliding with the training corpus: 0. Each cross-corpus reason claim verifies: harder∩delegation = 2, intent∩delegation = 2, holdout-harder rows in delegation = 2, holdout-regression rows in golden = 5. The _schema line in gate2-golden-prompts.jsonl is skipped exactly as the loader's string filter does. This closes the residual question left by iteration 1's rg-only replay: the two overlap tests are green as committed, so the new blocking step [SOURCE: .github/workflows/routing-registry-drift.yml:289] is not red on the current tree.
2. approvedAt format hypothesis eliminated. The capture script stamps approvedAt from capturedAt = a date-only slice [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:169] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:181], and ledgerScoringInstant builds a Date from the template [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:222] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:224]. A full-ISO stamp would poison that template; the probe shows 74/74 fixture entries carry bare YYYY-MM-DD (14 distinct dates, none containing T). Format mismatch between capture output and the replay pin is ruled out.
3. REQ-001 mechanics hold. The workflow contains no continue-on-error (whole-file grep: none), and the three new steps are ordinary blocking run steps [SOURCE: .github/workflows/routing-registry-drift.yml:271] [SOURCE: .github/workflows/routing-registry-drift.yml:278] [SOURCE: .github/workflows/routing-registry-drift.yml:289]. The tracked .opencode/skills symlink resolves the working directory, and all 21 declared SCORING_SURFACES consumers exist on disk, so the new missing-consumer assertion is satisfied. The setup-python pin matches the lean job's [SOURCE: .github/workflows/routing-registry-drift.yml:143].
4. The fresh-graph and Python-side helper surface exists exactly as relied upon: DB_FILENAME = skill-graph.sqlite [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:136], closeDb and indexSkillMetadata are exported, projection.ts reads SYSTEM_SKILL_ADVISOR_DB_DIR at module load [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70], and skill_advisor.py resolves the same override at import [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:259]. R4-P2-001 keeps the arrange-never-assert gap open.
5. Holdout provenance is consistent: build-holdout.mjs assigns source_type and origin_fixture exactly as the committed jsonl shows and drops training collisions [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:112]; the jsonl is 66 rows, at or above MIN_HOLDOUT_ROWS (60).

## Ruled Out This Iteration

- approvedAt format drift between the capture script and the ratchet's pin template (evidence above; capture writes date-only, fixture is date-only).
- Widened declaration gate red on the committed tree: the replay shows 0 undeclared, 0 stale, 0 labeled collisions, so the just-added blocking step is green as committed.
- Consumer-side declaration staleness (a declared consumer that stops reading its corpus, or a declared corpus nobody reads, is not detected — the stale test covers allowedOverlap only): this is the same remaining gap already registered as R1-P2-002 (declarations are proven referenced, never true). Noted, not re-filed.
- The one-sided clock pin (native pinned, the Python subprocess on the wall clock): swept in iteration 1 (Python scoring is time-invariant); not re-opened.

## Traceability Checks

- spec_code: pass. The commit modifies exactly the three Files to Change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:81] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:82]; R1, R3, R5 and R8 remain implemented as iterations 1-3 recorded. REQ-005 has no matching change (R3-P1-001).
- checklist_evidence: fail, carried from iterations 3-4 and unchanged: implementation-summary.md is still the template with no ledger rows and no Tests table, so SC-001 and REQ-002/003/004 have no recorded evidence (R3-P2-001). The commit touches none of it (git show --stat f34b01bf0a: three files).
- skill_agent: notApplicable — no SKILL.md contract about these internal gates; the only obligation is the REQ-005 version line (R3-P1-001).
- agent_cross_runtime: notApplicable — carried from iteration 3; no agent definition references the changed paths.
- feature_catalog_code: notApplicable — the catalog's only related claim (the holdout top-1 percentage) is untouched; no floor changed.
- playbook_capability: notApplicable — no parity-gate capability entry exists to update.

## Verdict

No P0 and no P1 findings this iteration, and no new P2. The registry still carries the active P1 R3-P1-001, so the run-level release gate remains conditional even though this iteration's own line is PASS. Residual risk, unchanged in kind: the two rewritten gates were not executed in this read-only dispatch — the commit message's verification claims (ratchet 7 passed with no built graph and with the clock at 2031-01-01; holdout fails on an injected overlap) are consistent with the code reads and the replay, but were not independently re-run. SC-002 therefore remains execution-unverified, and SC-001 stays blocked on implementation-summary.md.

## Next Dimension

None — iteration 5 of 5; all four dimensions are covered. Synthesis and the release-readiness decision follow.

Review verdict: PASS
