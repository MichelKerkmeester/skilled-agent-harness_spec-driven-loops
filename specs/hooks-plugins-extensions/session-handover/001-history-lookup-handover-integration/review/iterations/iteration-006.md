# Review Iteration 006 — Recovery, function-level correctness and consolidation

## Dispatcher
- Route proof: `mode=review`, `target_agent=deep-review`, `execution=single_review_iteration`, `agent_definition_loaded=true`.
- Iteration derived from the state log: five canonical `type:"iteration"` records (iterations 1–5) → current iteration **6**; matches the dispatch value.
- Recovery mode: stuck count 2 with two consecutive ratios of 0.0. Granularity changed from file-level to function/line-level inside the twice-deferred `history.ts`, plus a consolidation pass over the carried advisories and the four operator residuals.
- Packet boundary: writes are confined to this iteration narrative, the strategy sections, the delta file and the append gateway's own refresh. Config, registry, reducer outputs and all reviewed files were read-only.

## Dimension
- Primary: **correctness** (recovery granularity: function-level, then line-level).
- Consolidated: cross-reference across the carried P1/P2 advisories and the operator's four known residuals.
- Operator focus addressed in `## Integration Evidence`, `## Edge Cases` and `## Ruled Out`.

## Files Reviewed
- `.skilled/hooks/session-handover/history/lib/history.ts:1-360`
- `.skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts:1-79`
- `.skilled/hooks/session-handover/history/package.json:1-15`
- `.skilled/package.json:1-25`
- `.github/workflows/spec-kit-check.yml:247-302`
- `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-155`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:255-319`
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:15-89`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:1-130`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:135-197`
- Combined sweep surfaces: `.skilled`, `.github`, `.opencode`, and the repository outside `specs/` and `node_modules`.

## Findings — New

New findings this iteration: **0** (P0=0, P1=0, P2=0). Carried active state remains P0=0, P1=1, P2=7.

### P0 Findings
None.

### P1 Findings
None new. Carried `I1-P1-001` (the history-engine CI step cannot resolve `tsc` on a clean runner) was re-confirmed against the current tree.

Evidence chain: the engine build script resolves `../../../skills/system-spec-kit/node_modules/.bin/tsc` from `history/package.json`, i.e. `.skilled/skills/system-spec-kit/node_modules/.bin/tsc` [SOURCE: .skilled/hooks/session-handover/history/package.json:11]. The `runtime-vitest` job installs only `.opencode/skills/system-spec-kit` and `.skilled` [SOURCE: .github/workflows/spec-kit-check.yml:273-286], then invokes the engine build and tests [SOURCE: .github/workflows/spec-kit-check.yml:296-302]. `.skilled/package.json` declares no `workspaces`, no `postinstall` and no `typescript` dependency [SOURCE: .skilled/package.json:1-25], so the `.skilled` install cannot provision `.skilled/skills/system-spec-kit/node_modules`. The local binary exists only from a separate manual install and is not reproduced by either `npm ci` target.

Claim adjudication (carried re-confirmation, not a new finding):

```json
{"type":"correctness","claim":"The runtime-vitest history-engine build step fails on a clean GitHub runner because its hardcoded tsc path is never installed.","evidenceRefs":[".skilled/hooks/session-handover/history/package.json:11",".github/workflows/spec-kit-check.yml:273-302",".skilled/package.json:1-25"],"counterevidenceSought":"Checked whether .skilled declares workspaces or a postinstall that would reach the nested package, whether the workflow installs .skilled/skills/system-spec-kit, and whether the tsc path is a workspace-resolved binary; all three are absent.","alternativeExplanation":"A pre-provisioned runner image could carry the nested node_modules, but the workflow targets GitHub-hosted ubuntu-latest and tracks no such provisioning.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A workflow install step that provisions .skilled/skills/system-spec-kit/node_modules, or a build script resolving tsc from an installed package."}
```

### P2 Findings
None new. Carried advisories re-confirmed where the operator asked for a recheck:

| Finding | Status | Evidence |
|---|---|---|
| `I1-P2-003` silent schema skip | active | `project.test.mjs:141-142` still turns a missing schema into `{ skip: ... }`; the schema exists today, so the branch is latent [SOURCE: .skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142]. |
| `I1-P2-004` one-sided 66-char pin | active | Both copies are 66 with the identical quote transform and quoted-length predicate [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278] [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:33]. Equality holds; only the engine-side suite pins it, so the one-directional pin remains. |
| `I2-P2-001` unquoted runtime label | active | `SPECKIT_RUNTIME=${locator.runtime}` is interpolated raw while session and handle go through `shellQuote` [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:68-70]. In-tree producers still restrict the label, so severity stays P2. |
| `I3-P2-001` retired test anchors | active | `compaction-history-lookup.md:185-186` still name `.skilled/skills/system-spec-kit/runtime/tests/...` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186]. |
| `I3-P2-002` Vibe omitted | active | Lines 147 and 166 still say "Claude Code or Codex" while lines 26, 30 and 93 include Vibe [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:166]. |
| `I3-P2-003` no-offer hop description | active | Line 18 says the hop prints no lookup offer, while line 22 says the claim prints the section in the lookup arm [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:22]. |
| `I1-P2-002` engine-only trigger filter | carried, not re-measured | The workflow trigger filter was outside this pass; no status change is claimed. |

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | The shipped engine, CI step and package scripts match the phase intent; no new path or contract drift was found this iteration. |
| `checklist_evidence` | core | pass | Phase 008 remains Draft with T001–T011 unchecked; T002's negative pattern is non-vacuous against the owned harness line (iteration 3 evidence carried). |
| `skill_agent` | overlay | notApplicable | No SKILL.md, command document or agent definition sits inside the declared target. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime-mirror path sits inside the declared target. |
| `feature_catalog_code` | overlay | pass | Catalog cap, command, prefix, refusal exit 2 and success exit 0 were traced end to end in iterations 3 and 5; anchors resolve. |
| `playbook_capability` | overlay | fail | `I3-P2-001`, `I3-P2-002` and `I3-P2-003` remain active in the handoff-lookup and hop-recall pages. |

## Integration Evidence
- CI integration: the `runtime-vitest` job's `History lookup engine build and suites` step is [SOURCE: .github/workflows/spec-kit-check.yml:296-302]; its install set is [SOURCE: .github/workflows/spec-kit-check.yml:273-286].
- Package integration: engine `build`, `typecheck` and `test` scripts [SOURCE: .skilled/hooks/session-handover/history/package.json:9-13]; canonical root manifest with no workspace link [SOURCE: .skilled/package.json:1-25].
- Bound integration: hook-state's pinned 66-character quoted-id bound [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:271-284] versus the engine's exported bound and shell quoting [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:24-59].
- Paging integration: the engine still recognizes older transcripts that ran the retired CLI tail, alongside the current entry and dist core [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:330-345]; this is deliberate compatibility, documented in the same block.
- Playbook integration: the two stale test anchors [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186] and the hop-recall pair's contradictory offer statement [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18].

## Edge Cases
1. **Escaped legacy token defeats a plain-text sweep.** The old-path sweep `rg -n "runtime/hooks/lib/history"` over `.skilled`, `.github` and `.opencode` returned zero hits, and the full retired path sweep over the repository outside `specs/` also returned zero. However, `history.ts:335` encodes `hooks\/lib\/history\/cli\.js` as an escaped regex, so a plain-text search cannot see it. It is intentional backward compatibility for older transcripts [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:330-335], not stale drift; recorded so a future sweep does not treat the zero-hit result as proof that no old-path token exists anywhere.
2. **CI failure is statically proven, not observed red.** The engine step has never run on GitHub and this read-only pass did not execute it; the provisioning proof is the strongest available evidence until the first workflow run.
3. **Silent skip is latent.** The schema file exists today, so the skip branch does not fire. This is not reclassified as a pass; the test still cannot fail if the schema disappears [SOURCE: .skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142].
4. **Bound equality is behavioural, not compile-time.** Both copies read 66 and both quote identically, but the equality is maintained by a sweep test rather than a shared import, so a future edit to one copy can drift before the test reports it.
5. **Tail-incomplete projection is intentional.** `projectHistoryEntries` drops an unpaired model turn only when it is the final exchange and does not throw [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:301-308]; this matches the documented branch-end rationale and was not raised as a finding.
6. **`I1-P2-002` not re-measured.** The workflow trigger filter was outside the files read this iteration; its status is carried without a fresh verdict.

## Confirmed-Clean Surfaces
- `history.ts` type/schema derivation: published key list, required-key list and both compile-time completeness guards agree in both directions, and the contract suite asserts the same against the JSON Schema [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:70-105] [SOURCE: .skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts:34-43].
- `history.ts` projection guards: duplicate tool calls, orphan results, mismatched results, duplicate results and incomplete exchanges followed by more entries all throw or are handled as documented [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:252-324].
- Role conditionals: the contract suite proves `toolCallId` is required for `toolResult` and rejected for user turns, and that unknown root/block fields fail [SOURCE: .skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts:57-73].
- Paging predicate: string and argument-vector forms are both recognized, and recursion is depth-capped at 3 [SOURCE: .skilled/hooks/session-handover/history/lib/history.ts:337-345].
- Bound arithmetic: `hook-state.ts:281-284` and `lookup-offer.ts:52-58` compute the quoted form with the same replacement and the same `<= 66` test.
- Repo-wide old-path sweep: no live reference to `runtime/hooks/lib/history` or the full retired path outside `specs/`.

## Ruled Out
- **Contract derivation or validation drift in `history.ts`.** The key lists, required lists, schema comparison and role conditionals all agree; no finding.
- **The two 66-character copies disagree.** Both are 66 with identical quoting and predicate; no finding.
- **A live import or entry still loads the retired engine tree.** The repo-wide sweep returned no hit outside the intentional legacy matcher.
- **The projection schema skip is currently firing.** The schema exists; the gap remains latent (carried P2), not a live failure.
- **The three playbook P2s were fixed.** All three still reproduce at the cited lines.
- **The CI engine step would pass as written.** Ruled out; the carried P1 is re-confirmed by the install set.
- **The legacy CLI regex is stale drift.** The surrounding comment states it exists for older transcripts, so it is compatibility rather than a stale path; no finding.

## Next Focus
- Dimension: consolidation / synthesis prep (all four dimensions are complete; four iterations remain under `stopPolicy=max-iterations`).
- Focus area: re-verify `I1-P1-001` and the seven P2s against HEAD without re-entering any BLOCKED direction; read `history-projection.vitest.ts:215-244` to close the legacy-matcher fixture trace; prepare synthesis.
- Reason: iteration 6 closed the twice-deferred `history.ts` source and all four operator residuals; remaining value is carried-finding consolidation, not new discovery.
- Rotation status: D1 correctness, D2 security, D3 traceability, D4 maintainability and cross-reference all reviewed.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004`, `I2-P2-001`, `I3-P2-001` to `I3-P2-003` remain active.
- Required evidence: `history-projection.vitest.ts:215-244`; HEAD diff over `history/package.json`, `spec-kit-check.yml` and the two playbook pages.
- Recovery note: no new findings again; the recovery pass changed granularity as required and found the source clean. Treat the stuck count as saturation, not as permission to retry the recorded BLOCKED directions.

## Verdict
CONDITIONAL — active carried P1 `I1-P1-001`; no new P0/P1 this iteration; `hasAdvisories=true` (seven carried P2s).

Review verdict: CONDITIONAL
