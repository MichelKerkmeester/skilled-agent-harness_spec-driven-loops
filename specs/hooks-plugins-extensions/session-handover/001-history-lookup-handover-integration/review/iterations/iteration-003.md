# Iteration 003 — Traceability (spec, catalog, checklist and playbook claims)

## Dimension

Traceability, on the six declared protocols: `spec_code` and `checklist_evidence` (core) and `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay). Operator focus carried in addition: the four named residuals and the known phase-1 harness line. How the operator focus was addressed:

- Residual 1 (old-path sweep): not re-entered. The direction is exhausted in iteration 1 (live surfaces clean; the only executable hit is the known harness line). This iteration checked the *adjacent* miss the sweep could not see — references to the retired runtime **test** paths — and found two in the handoff-lookup playbook (Finding 1).
- Residual 2 (CI engine step): re-confirmed against the current workflow; no new evidence, `I1-P1-001` and `I1-P2-002` carried.
- Residual 3 (silent schema skip): `I1-P2-003` carried; the resolved schema path still exists, so the branch is latent.
- Residual 4 (66-character bound): carried as verified equal in iterations 1-2; the direction stays exhausted.
- Known harness line 18: recorded as known and owned by phase 008 T002. This iteration adds evidence that T002's verification is non-vacuous.

## Dispatcher

- Mode: review, native LEAF execution, no delegation.
- Iteration: 3 of 10 (JSONL-derived: 2 prior `type:"iteration"` records; matches the dispatch number).
- Run / sessionId: `2026-11-15T17:33:23.837Z`, generation 1, lineageMode `restart`.
- Target: files changed in `169da2e8cba..1c7bc3d9d63` (63 declared files; traceability-relevant subset read).
- Node budget: 24 tool calls; 18 used for analysis, 6 reserved for the artifacts.

## Files Reviewed

| File | Lines / focus |
|------|---------------|
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md` | 42-58 (status and handoff criteria), 96-145 (files-to-change table, phase map, transition rules) |
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/spec.md` | 36-51 (phase context and dependency path), 80-124 (scope, requirements), 145-156 |
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/tasks.md` | 26-71 (notation, T001-T011, completion criteria) |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md` | 17-106 (behavior claims, source files, tests, metadata) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | 16-197 (contract, commands, expected, source anchors) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | 16-164 (overview, objective, procedure, recorded rows, anchors) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md` | 16-160 (overview, procedure, recorded rows, anchors) |
| `.github/workflows/spec-kit-check.yml` | 3-85 (trigger filters), 247-302 (runtime-vitest and the engine step) |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 20-36 (command, 600 cap, 66 bound), 52-73 (quote, prefix, template) |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | 592-597 (exit-code mapping) |
| `.skilled/hooks/session-handover/history/package.json` | 9-13 (build and test scripts) |
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh` | 18 (known old path; checked for T002 only) |

Reference-only (prior-iteration evidence, not re-read): `hook-state.ts:271-307`, `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-155`.

## Findings — New

### P0 Findings

None.

### P1 Findings

None new. `I1-P1-001` (the engine CI build cannot resolve `tsc` on a clean runner) remains active and is carried, not re-derived here.

### P2 Findings

1. **The handoff-lookup playbook still points at the retired runtime test paths** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` -- The Source Files table names the CLI refusal suite as `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` and the locator suite as `.skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts`. Both paths are absent; the suites shipped with the engine move at `.skilled/hooks/session-handover/history/tests/history-lookup-cli.vitest.ts` and `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts`. Every other anchor in the same table (lines 176-184 and 187) resolves, so these two rows are the surviving pre-move references.
Case: an operator or a follow-up agent follows the playbook's Source Files table to the refusal or locator suite; the path does not exist after the engine move, so the documented test-to-capability link cannot be followed.
Finding class: instance-only
Scope proof: both listed paths fail an existence check; both moved counterparts exist. The same file's other nine anchors resolve, and the hop-recall pair anchors the harness rather than these suites, so the drift is confined to these two rows.
Affected surface hints: ["manual-testing-playbook handoff lookup", "history test anchors", "playbook Source Files table"]

2. **Two capability lines in the handoff-lookup playbook drop Vibe** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147,166` -- The scenario contract, overview, expected signals and step 4 name Claude Code, Codex **or Vibe** (lines 26, 30, 44, 46 and 93, including the `SPECKIT_RUNTIME=vibe` prefix). The Expected paragraph at line 147 says the section appears only for "a Claude Code or Codex session", and Failure Triage at line 166 says "The sender must be Claude Code or Codex". The file therefore states a narrower capability twice than the contract it presents.
Case: an operator running the Vibe sender case reads the Expected or Failure Triage line, concludes only Claude Code and Codex are supported, and either skips the supported Vibe check or records a correct Vibe offer as an unexplained result.
Finding class: instance-only
Scope proof: enumerated every runtime list in the file; the three capability sites (26, 30, 93) include Vibe while lines 147 and 166 omit it. No other file in the target repeats the omission.
Affected surface hints: ["manual-testing-playbook handoff lookup", "capability statement", "failure triage"]

3. **The hop-recall pair still describes a hop that prints no lookup offer** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18,33` and `hop-recall-baseline-conversation.md:18,81` -- The lookup arm's overview says "the hop prints no lookup offer, so this arm records whether the receiver finds and runs the CLI on its own", and its objective measures whether the receiver "reaches for the history lookup unprompted". The same pages at lines 22 and 77 and the recorded `claim offer` rows at line 112 state the opposite: the claim prints the `## History Lookup` section when the core is built, and step 1 requires the core. The baseline page's "no offer either way" carries the same pre-offer wording.
Case: an operator runs the lookup arm under the current claim, the claim prints the section, and the run can no longer separate an unprompted lookup from a lookup the offer invited; the observed `lookup_attempted` is scored against a premise the run does not satisfy.
Finding class: cross-consumer
Scope proof: both pages' overview and expected paragraphs were read; the offer path withholds only when a gate fails (`lookup-offer.ts:137-143`) and the claim-offer rows at line 112 were measured with the section printed. No other scenario page in the target describes the hop.
Affected surface hints: ["hop-recall scenario pair", "lookup arm objective", "observed-line interpretation"]

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | pass | The shipped behavior matches the parent phase intent: the engine lives at `.skilled/hooks/session-handover/history/` (`lookup-offer.ts:20`), the printed command names that entry, and phase-008 dependencies name the same build path (`008/spec.md:44`). The parent files-to-change table at `spec.md:102` still names the pre-move engine path, but line 97 labels that table a "phase-level file summary" of the action taken, and the action was a move away from that path. Reclassified from iterations 1-2 on that evidence; not a present code/doc mismatch. |
| `checklist_evidence` (core) | pass | `008/spec.md` is Draft and all T001-T011 in `008/tasks.md:36-61` are unchecked, so no completion claim exists to falsify. T002's negative check `rg -c 'runtime/dist/hooks/lib/history'` matches the harness line it is meant to remove (`hop-recall.sh:18` = `.../runtime/dist/hooks/lib/history/cli.js`), so the check is non-vacuous once the task runs. |
| `skill_agent` (overlay) | notApplicable | No `SKILL.md`, command document, or agent definition is inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror path (`.claude/`, `.codex/`, `.pi/`, `.devin/`, `.vibe/`) is inside the declared target. |
| `feature_catalog_code` (overlay) | pass (spot-checked) | The catalog's core claims resolve: 600-character section cap (`lookup-offer.ts:21`), printed command (`lookup-offer.ts:20`), Claude no prefix / Codex-Vibe prefix (`lookup-offer.ts:69`), refusal exit 2 (`cli.ts:597`), and both reader tests it cites exist (`matrix.test.mjs`, `side-effects.test.mjs`). The success-path exit 0 is not traced this iteration (edge case). |
| `playbook_capability` (overlay) | fail | Three drift findings: retired test anchors (Finding 1), Vibe omitted from two capability lines (Finding 2), and the hop-recall objective describing a no-offer hop (Finding 3). The operational commands themselves resolve. |
| Residual 1: old-path sweep | exhausted, not re-entered | Iteration 1 ruled out live drift; this pass checked the adjacent retired **test** paths and found Finding 1. The known harness line stays known. |
| Residual 2: CI engine step would pass as written | fail, carried | `I1-P1-001` (build cannot resolve `tsc`) and `I1-P2-002` (engine-only commits never reach the step) remain active; this iteration adds no CI evidence. |
| Residual 3: missing schema becomes a silent skip | latent, carried | `I1-P2-003` remains active; the resolved schema path exists, so the skip branch is not live today. |
| Residual 4: 66-character bound equals the engine bound | pass, carried | Both copies are 66 with an identical quoted-form transform (iterations 1-2), and the pin gap is `I1-P2-004`. |
| Known harness line | known, not a finding | `001-hop-recall-baseline/scratch/harness/hop-recall.sh:18`; owned by phase 008 T002, outside this target. |
| Playbook command path | pass | The step-2 invocation `(cd .skilled/hooks/session-handover/history && ../../../node_modules/.bin/vitest ...)` resolves to `.skilled/node_modules/.bin/vitest`, which exists and matches the package's own test script (`history/package.json:13`). |

## Integration Evidence

- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:20-25,43,51` with `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:20-21,69` and `.skilled/hooks/session-handover/history/lib/cli.ts:597` — the catalog's cap, command, prefix and refusal-code claims match the shipped constants and exit mapping.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186` — the two anchors that still resolve to the retired runtime tree, checked against the moved suites under `.skilled/hooks/session-handover/history/tests/`.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:112` with `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:137-143` — the recorded `claim offer` rows and the withhold-on-gate behavior, which contradict the page's "no offer" overview.
- `008-wider-hop-recall-measurement/spec.md:44` and `tasks.md:26,37` with `hop-recall.sh:18` — the phase names the new build path and its T002 check matches the one stale line it owns.
- `.github/workflows/spec-kit-check.yml:296-302` with `.skilled/hooks/session-handover/history/package.json:11` — the workflow step and the hardcoded `tsc` path behind the carried P1.

## Edge Cases

- **Phase-008 `plan.md`, `description.json` and `graph-metadata.json` were not read.** The 24-call ceiling was consumed by the specs, the catalog, the three playbooks and the path checks. Plan-to-spec consistency for phase 008 rests on `spec.md` and `tasks.md` only; recorded as deferred evidence for the maintainability pass, not as a pass.
- **The catalog's success-path exit code is inferred, not read.** `cli.ts:592-593` assigns the operation's exit code, and the refusal path maps to 2; success 0 is the conventional path but was not traced. Recorded as a residual, not counted as a verified pass.
- **Vibe support was not verified in the mint or reader code.** Finding 2 rests on the playbook contradicting its own scenario contract, so it holds whether or not the code supports Vibe; the code check is deferred.
- **The parent files-to-change row is historical.** `spec.md:97-98` labels the table a phase-level file summary of the action taken, so the old path at line 102 records the move's source rather than a live destination. `spec_code` is reclassified pass on that evidence; this supersedes the partial status from iterations 1-2.
- **The known harness line stays known.** It is outside the declared target and owned by phase 008 T002; recorded only to confirm T002's check matches it.
- **All three new findings are documentation-only.** No runtime behavior, test result or CI gate changes because of them; they affect operator procedure and test traceability, which is why they stay P2.

## Confirmed-Clean Surfaces

- The catalog's implementation table resolves to the moved engine, and its two reader-test anchors exist.
- The catalog's 600-character cap, printed command, runtime prefix rule and refusal exit 2 match the shipped constants and exit mapping.
- Phase 008 makes no completion claim: Status Draft, all tasks unchecked, completion criteria unchecked.
- The parent phase map marks children 1-7 Complete and child 8 Draft, consistent with the 008 metadata and the parent handoff criteria.
- The playbook's step-2 Vitest invocation resolves and matches the package test script.
- `skill_agent` and `agent_cross_runtime` have no surface inside the declared target.

## Ruled Out

- **The feature catalog still names retired paths** — every implementation and test anchor spot-checked resolves to the moved engine or an existing reader test (`compaction-history-lookup.md:69-76,82-93`).
- **The playbook's `../../../node_modules/.bin/vitest` path is broken** — it resolves to `.skilled/node_modules/.bin/vitest`, which exists, and equals the package test script (`history/package.json:13`).
- **Phase 008 T002's negative check is vacuous** — the pattern `runtime/dist/hooks/lib/history` matches the harness's actual line 18, so the check flips from one hit to none when the owned line is fixed.
- **The catalog's reader test anchors are dead** — `matrix.test.mjs` and `side-effects.test.mjs` both exist under `.skilled/hooks/shared/tests/session-readers/`.
- **A live old-path reference remains outside the playbooks** — the iteration 1 sweep conclusion stands; this pass adds only the retired test-path rows inside one playbook.

## Next Focus

- Dimension: maintainability.
- Focus area: `pages.ts` internals (the one engine module not read), the duplicated offer/state arithmetic across `hook-state.ts` and `lookup-offer.ts`, the moved package's README and build/test wiring, and the deferred eager-search-index measurement (`navigator.ts:490-503`).
- Reason: traceability is covered with three documentation findings and one carried P1; maintainability is the last uncovered dimension and the only one that can still close the deferred `pages.ts` and unbounded-resource evidence gaps.
- Rotation status: D1 correctness, D2 security and D3 traceability reviewed; D4 maintainability next.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, plus new `I3-P2-001` to `I3-P2-003` stay active. Finding 1's upgrade trigger is a producer passing an unvalidated runtime label.
- Required evidence: `pages.ts` in full, `loads.ts`, `history.ts`, the engine README, package config, and a measured search-index workload or a documented reason the measurement stays deferred.
- Recovery note: none; no approach is exhausted for maintainability.

## Verdict

Three new P2 findings, all documentation traceability drift in the manual testing playbooks; no new P0 or P1. `spec_code` is reclassified pass and `checklist_evidence` passes on the Draft phase evidence. The carried `I1-P1-001` remains active, so the iteration verdict is CONDITIONAL. `hasAdvisories` is true (seven active P2s).

Review verdict: CONDITIONAL
