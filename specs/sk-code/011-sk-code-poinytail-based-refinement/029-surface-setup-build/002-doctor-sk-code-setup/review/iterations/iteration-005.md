# Iteration 5 — correctness

**Run:** `2026-10-13T21:11:31.000Z` · **Dimension:** correctness · **Iteration:** 5 of 5

## Dimension

Final correctness pass over the `/doctor:sk-code` setup battery. Prior iterations covered the exit-code contract, state transitions, spawn/parse error handling, path resolution, input validation, output injection, diagnostic accuracy, and the command-surface wiring; all 9 open findings are P2 advisories. This pass re-verified the executable wiring end to end (leg order, skip accounting, report contract, leg/repair binary existence) and entered two directions not previously covered: (a) repair-generation robustness when a repair helper's dependency is missing, and (b) whether the probe's pass predicate proves that *sk-code* specifically serves the compiled route.

## Files Reviewed

- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` — full read; findings at `:168-172`, `:246`
- `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` — full read; decision fixture at `:33`
- `.skilled/commands/doctor/sk-code.md:31`
- `.skilled/commands/doctor/_routes.yaml:220`
- `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:49`
- `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt:50`
- `.skilled/commands/doctor/scripts/README.md:61`
- Leg/repair binary existence sweep (all ten present): `.skilled/bin/{compiled-route-guard,compiled-route-sync,compiled-route,compiled-route-manifest}.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`, `.skilled/skills/sk-doc/sk-create-skill/scripts/{ci-skill-derived-freshness,ci-skill-root-metadata,regenerate-skill-derived}.cjs`, `.skilled/skills/sk-git/scripts/worktree-naming.sh`
- Review state: `deep-review-config.json`, `deep-review-findings-registry.json`, `deltas/iter-004.jsonl`

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R5-P2-001 — The legacy-stub repair crashes the battery when the guard module is unavailable**
- Case: a tree where `.skilled/bin/compiled-route-guard.cjs` is missing (or no longer exports `staleFix`) and the probe serves the legacy stub → `JUDGES.probe` calls `legacyStubRepair()` → `require(GUARD_MODULE)` throws inside `main`, so no per-leg table and no STATUS line print — the operator gets a stack trace instead of the report and repair lines.
- File: `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:171` (helper), called at `:248`
- Evidence: `legacyStubRepair` is the only call-time `require` of a sibling script in the battery; `GUARD_MODULE` resolves as a path at module load without throwing, so the failure surfaces only when the legacy branch runs. `spawnLeg` normalizes a missing binary to a leg failure, but repair generation has no equivalent boundary, so the report-level "never a crash" behavior the header describes does not hold on this path.
- User impact: in exactly the doubly-degraded tree the battery exists to diagnose, the full report is lost and the operator sees an internal stack trace.
- Finding class: instance-only (scope proof: full read shows this is the only repair path performing a call-time require; the spawn and parse layers already normalize failures).
- Confidence: high that the throw is unguarded; medium that the missing-guard state co-occurs with a legacy probe.
- Counter-evidence sought: checked every other repair helper in the script — none require a sibling module at call time; the guard module exists in the reviewed tree, so this is a degraded-tree robustness gap, not a live failure.
- Recommendation: wrap repair generation in try/catch and fall back to a generic repair line (for example the manifest refresh command) when the guard module cannot be loaded.

**R5-P2-002 — The probe passes on any hub's route decision; the served hubId is never checked**
- Case: if the compiled router returns `action: "route"` for a decision that names a hub other than sk-code (cross-hub fallback or a router that ignores `--hub`), the probe leg prints PASS even though sk-code itself did not route.
- File: `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:246`
- Evidence: the judge returns pass on `decision.action === 'route'` alone. Both decision shapes the suite models carry `hubId` (`.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:33` — `{"hubId":"sk-code","action":"route"}`, and the legacy fixture — `{"servingAuthority":"legacy","hubId":"sk-code"}`), so the identity field is available and unused. The leg's stated purpose is proving sk-code serves a compiled route, which the current predicate does not establish.
- User impact: a false PASS on the final leg can tell an operator that sk-code routing works when the probe was served by a different hub.
- Finding class: instance-only.
- Confidence: high that the check is absent; medium that the router can produce a mismatched hubId (compiled-route.cjs was not read this iteration).
- Counter-evidence sought: the probe is invoked with `--hub sk-code`, which likely scopes the router to sk-code, so the mismatch path is a defense-in-depth gap rather than a demonstrated live false pass.
- Recommendation: require `decision.hubId === HUB` for pass; on mismatch, fail with the served hubId named in the detail.

**Prior advisories re-checked (still present, unchanged):** R1-P2-001 (no per-leg timeout, `:76`), R1-P2-002 (`:177`), R1-P2-003 (`:155`), R1-P2-004 (test matrix still lacks the root-metadata not-built, sync-repair and malformed-JSON fallback cases), R2-P2-001 (`:138`), R2-P2-002 (`:152`), R3-P2-001 (spec Files to Change; not re-read this iteration), R4-P2-001 (`:319`), R4-P2-002 (`:15`).

## Traceability Checks

- Core protocols (`spec_code`, `checklist_evidence`) and overlay protocols completed in iteration 3; not re-entered.
- Scope confinement: both new findings cite declared review-scope files. No out-of-scope mutation was attempted.
- Command-surface cross-check: doc/router/workflow/presentation lines (`sk-code.md:31`, `_routes.yaml:220`, `doctor-sk-code-setup.yaml:34,40,48-51`, `doctor-sk-code-presentation.txt:9,50`) remain consistent with the script's eight legs, exit codes, and read-only claim.
- Leg-path existence sweep: all ten spawned or repaired binaries resolve in the reviewed tree.

## SCOPE VIOLATIONS

None.

## Verdict

PASS — no P0 or P1 findings; 2 new P2 advisories, 9 prior P2 advisories still active (`hasAdvisories=true`). Final scheduled iteration; the new findings are hardening notes on already-reviewed surfaces, consistent with a converging loop.

## Next Dimension

None — iteration 5 of 5 completes the review loop. Hand off to synthesis with verdict PASS, `hasAdvisories=true`.

Review verdict: PASS
