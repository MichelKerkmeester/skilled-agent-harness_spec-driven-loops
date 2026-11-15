# Review Iteration 007

## Dispatcher

- Route: `mode=review`; `target_agent=deep-review`; `execution=single_review_iteration`; `state_source=externalized_files`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Run/session: `2026-11-15T17:33:23.837Z`, generation 1, `lineageMode=restart`.
- Iteration derivation: six canonical `type:"iteration"` records in the state log plus one = **7**; matches the dispatched number.
- Focus: **traceability — carried-finding consolidation and synthesis prep**.
- Budget: 24 tool calls, 10 minutes.
- BINDING: target=specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration
- BINDING: maxIterations=10
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration

Operator focus addressed: residual 1 (old-path sweep) and residual 4 (66-character bound) are recorded BLOCKED directions, so they were **not re-entered**; their standing is tested by a zero-drift HEAD check and the iteration-6 equality proof. Residual 2 (never-run CI engine step) and residual 3 (schema-file silent skip) were re-anchored directly and still reproduce. The phase-1 harness `hop-recall.sh:18` old path is recorded as **known**, owned by phase 008 task T002, not as a finding.

## Dimension

Traceability, executed as consolidation: all four dimensions were completed in iterations 1-4, so this pass re-anchored every active finding at HEAD and closed the one remaining evidence gap (the legacy-matcher fixture trace) instead of opening a new sweep. No BLOCKED direction was retried.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `.github/workflows/spec-kit-check.yml` | 1-44, 255-309 | Trigger filters (P2-002) and engine step + install set (P1-001) |
| `.skilled/hooks/session-handover/history/package.json` | 1-15 | Build script anchor for P1-001 |
| `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts` | 205-254 | Required evidence: legacy-matcher fixture trace |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | 125-156 | Schema-file silent skip (P2-003) |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 55-89 | Runtime-label interpolation (P2-001) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | 140-189 | Retired test anchors and Vibe omission (P2-001, P2-002) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | 1-40 | No-offer hop claim (P2-003) |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | 1-120 | Review doctrine loaded before severity calls |
| HEAD drift check | 8 anchor paths | `git diff 1c7bc3d9d63..HEAD` + `git status` over every carried anchor |

## Findings - New

### P0 Findings

None. No new blocker was found, and no carried P0 exists.

### P1 Findings

None new. The single carried P1 remains active and was re-anchored, not re-raised.

### P2 Findings

None new. All seven carried P2 findings remain active and reproduce or are unchanged at HEAD.

### Carried Finding Re-verification

| ID | Sev | Anchor | HEAD status | Evidence |
|----|-----|--------|-------------|----------|
| `I1-P1-001` | P1 | `.skilled/hooks/session-handover/history/package.json:11` | **Active** | Build runs `../../../skills/system-spec-kit/node_modules/.bin/tsc`; the CI install set at `.github/workflows/spec-kit-check.yml:273-286` installs `.opencode/skills/system-spec-kit`, `.skilled` and the skill-advisor runtime, never `.skilled/skills/system-spec-kit`, so the engine step at `:301` fails on a clean runner. |
| `I1-P2-002` | P2 | `.github/workflows/spec-kit-check.yml:6-44, 47-75` | **Active** | Both `push` and `pull_request` path filters cover the spec-kit runtime, commands, agents and scripts but omit `.skilled/hooks/**`, so an engine-only change never triggers the workflow and the engine suites never run. |
| `I1-P2-003` | P2 | `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142` | **Active (latent)** | A missing `history-entry.schema.json` registers a skipped test instead of failing, so the suite stays green without schema validation. The schema exists today, so the gap is latent. |
| `I1-P2-004` | P2 | `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:276-284` | **Active (unchanged)** | Not re-read line by line because the constant-drift direction is BLOCKED; the iteration-6 read (`SL-604`) proved both copies are 66 with identical quoting, and `git diff` shows no drift. |
| `I2-P2-001` | P2 | `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:69-70` | **Active** | The offer interpolates `${locator.runtime}` raw into the model-pasted command (`SPECKIT_RUNTIME=${locator.runtime} `) while the session id and handle are `shellQuote`d; no in-tree producer sends an unsafe label. |
| `I3-P2-001` | P2 | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` | **Active** | Both rows still name `.skilled/skills/system-spec-kit/runtime/tests/...`; the moved counterparts exist under `.skilled/hooks/session-handover/history/tests/`, and the other nine rows in the same table resolve. |
| `I3-P2-002` | P2 | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147, 166` | **Active** | Both lines say "Claude Code or Codex" only, while `:26`, `:30` and `:93` include Vibe. |
| `I3-P2-003` | P2 | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18` | **Active** | `:18` says "the hop prints no lookup offer" while `:22` says "The claim prints a `## History Lookup` section for the sender's session"; the offer withholds only when a gate fails (`lookup-offer.ts:137-143`). |

## Traceability Checks

| Protocol | Level | Result | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass (carried) | Shipped engine path and behavior match the parent phase intent; no target drift at HEAD. |
| `checklist_evidence` | core | pass (carried) | Phase 008 remains Draft with T001-T011 unchecked; T002's negative pattern matches the owned harness line, so it is non-vacuous. |
| `skill_agent` | overlay | notApplicable | No `SKILL.md`, command document or agent definition inside the declared target. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror path inside the declared target. |
| `feature_catalog_code` | overlay | pass (carried) | Cap 600, command, prefix rule and refusal exit 2 traced in iterations 3 and 5; catalog anchors unchanged at HEAD. |
| `playbook_capability` | overlay | **fail** | `I3-P2-001`, `I3-P2-002` and `I3-P2-003` still reproduce at the cited lines. |

## Integration Evidence

Exact surfaces checked, not inferred:

- `.github/workflows/spec-kit-check.yml` — both trigger blocks (`:6-44`, `:47-75`) and the engine step plus install set (`:273-302`).
- `.skilled/hooks/session-handover/history/package.json` — the build/typecheck/test scripts (`:9-14`).
- `.skilled/hooks/shared/tests/session-readers/project.test.mjs` — the schema-existence branch (`:141-155`).
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` — the command body (`:68-76`) and the quoted bound (`:56-59`).
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` and `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` — the carried traceability overlays.
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md` — severity and evidence doctrine.

## Edge Cases

1. **HEAD is one commit past the range end.** `HEAD=5bd9d54ef96`; `1c7bc3d9d63..HEAD` is a single docs commit touching only `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/goal.md` and `graph-metadata.json`, both outside the declared target. All eight carried anchors are zero-drift, so carried evidence remains valid.
2. **Scope-count ambiguity.** Config lists 63 `reviewScopeFiles`; `git diff --name-only 169da2e8cba..1c7bc3d9d63` returns 54. The likeliest cause is default rename detection collapsing each old→new path pair to one name. Recorded as scope-metadata ambiguity, not a finding: the reviewed anchor set is unaffected.
3. **BLOCKED directions.** The repo-wide old-path sweep (residual 1) and the 66-character constant drift (residual 4) remain BLOCKED. They were not retried; the zero-drift check plus `SL-604` carry their standing honestly rather than converting missing re-reads into a pass.
4. **Legacy-matcher fixture trace closed.** `history-projection.vitest.ts:228` states "The earlier core path stays because older transcripts still hold it", and `:229-232` asserts both the old runtime path and the moved path. This is documented backward compatibility, consistent with `history.ts:330-335`, not stale drift.
5. **Known, not new.** The phase-1 harness `hop-recall.sh:18` old-path reference is owned by phase 008 task T002 and is excluded from findings by the operator instruction.

## Confirmed-Clean Surfaces

- The engine build script's relative-path arithmetic resolves correctly once the spec-kit install exists; the defect is provisioning, not path arithmetic.
- The legacy-matcher fixture asserts both the old and moved paths, so it cannot silently pass on only one.
- The nine other Source Files anchors in the handoff-lookup playbook resolve.
- No new production source in the target changed behavior at HEAD; the review target's active findings are state claims, not fresh regressions.

## Ruled Out

- **The old-path fixture is stale drift** — ruled out; the fixture comment and the paired-path assertion document compatibility.
- **The engine trigger filter includes the hook tree** — ruled out; both filters omit `.skilled/hooks/**`, so `I1-P2-002` stands.
- **The CI engine step passes as written** — ruled out; the install set never provisions the `tsc` path the build script invokes.
- **The carried P1/P2s were fixed at HEAD** — ruled out; each reproduces at its anchor or is unchanged with a clean drift check.
- **A fresh dimension remains** — ruled out; all four dimensions are complete and the registry has no unread target source.

## SCOPE VIOLATIONS

None. Writes were limited to `iterations/iteration-007.md`, `deltas/iter-007.jsonl` and the in-place strategy update; `deep-review-state.jsonl` is written only by the append gateway. No review target, config, registry, reducer output, command, skill, canonical agent or mirror file was modified.

## Next Focus

- Dimension: consolidation / synthesis prep; all four dimensions complete.
- Focus area: re-confirm the active carried P1 and seven P2s from the refreshed registry at the next HEAD, without re-entering any BLOCKED direction.
- Reason: this pass re-anchored every active finding against an unchanged tree and closed the legacy-matcher fixture trace; no unread target source remains.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` remain active (0 resolved).
- Required evidence: the refreshed `deep-review-findings-registry.json` and a HEAD drift check over the eight anchors.
- Recovery note: a second zero-ratio pass reaches the `stuckThreshold=2` boundary; `stopPolicy=max-iterations` keeps iterations 8-10 running, but remaining passes are consolidation only and must not invent findings.

## Verdict

P0: 0, P1: 1 active, P2: 7 active, 0 new this iteration. Promotion is blocked by the active P1; the review remains CONDITIONAL with advisories.

Review verdict: CONDITIONAL
