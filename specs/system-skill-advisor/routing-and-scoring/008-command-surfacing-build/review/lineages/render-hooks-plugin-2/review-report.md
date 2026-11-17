# Review Report: render-hooks-plugin-2 (pass two)

Lineage: `render-hooks-plugin-2` of the command-surfacing pass-two fan-out.
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/render-hooks-plugin-2/`.
Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`.

## 1. Executive Summary

- **Overall verdict: PASS.**
- `hasAdvisories: true` — five active P2 advisories, no active P0 or P1.
- Counts: P0 = 0, P1 = 0, P2 = 5 active (one P2 withdrawn and resolved in-run).
- **Review scope:** the 59 `render-hooks-plugin` rows of `review/review-scope-2.txt` — the OpenCode advisor plugin, the shared session readers, the advisor hook handler and fallback, the runtime render/process/metrics modules, the feature-catalog leaves that describe them, and the shared docs those surfaces depend on. Pass one's 43-finding table was read first for this area.
- **Operator review focus (verbatim):** "Code review of command surfacing, PASS TWO. First read /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/5227d078-62ce-41ed-b96c-d1d6535a01ff/scratchpad/review-instructions-2.txt and follow it exactly. Scope file: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/5227d078-62ce-41ed-b96c-d1d6535a01ff/scratchpad/review-scope-2.txt (area TAB path TAB changed-since-pass-one). Review the files whose area equals render-hooks-plugin, plus shared docs that describe them. Pass one is closed: its findings and fixes are in specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report-pass-1.md. Check each pass-one fix in this area holds, review every file marked yes line by line, then look for new defects. Every finding is P0, P1 or P2 with file:line and a concrete input. Never read or print holdout prompt text. Change no code, write only inside this lineage folder."
- **Pass-one fix verification:** all twelve pass-one findings in this area were re-read against the committed code. Eleven fixes hold. The twelfth (`R3-P2-002--16e5737e0e56`) is the refuted finding the pass-two instructions exclude. One finding raised in iteration 2 was withdrawn in iteration 4 after a closer read (see §8).
- **Headline:** the command-surfacing work is functionally sound in this area. The five advisories are one removal residue (the compiled-route line deleted in pass one left an inert option, an orphaned per-prompt summary, and a misleading jsdoc), one reliability trade-off in the new stderr cap, one documentation-citation drift, and one missing test for the new CLI field pass-through.

## 2. Planning Trigger

`/speckit:plan` is **not required** by this lineage: the verdict is PASS with P2 advisories only. A follow-on cleanup plan may schedule the advisories below, but none blocks a merge or release decision.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "iter2-P2-inert-bounded-summary-option", "severity": "P2", "file": ".opencode/plugins/system-skill-advisor.js:379"},
    {"id": "iter2-P2-stderr-cap-hides-busy", "severity": "P2", "file": ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:144"},
    {"id": "iter4-P2-advisor-recommend-stale-line-refs", "severity": "P2", "file": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33"},
    {"id": "iter5-P2-field-pass-through-untested", "severity": "P2", "file": ".skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49"},
    {"id": "iter5-P2-orphaned-route-summary", "severity": "P2", "file": ".opencode/plugins/system-skill-advisor.js:657"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Finish the compiled-route removal", "findings": ["iter2-P2-inert-bounded-summary-option", "iter5-P2-orphaned-route-summary"], "priority": "advisory"},
    {"id": "WS-2", "title": "Keep the busy marker under the output cap", "findings": ["iter2-P2-stderr-cap-hides-busy"], "priority": "advisory"},
    {"id": "WS-3", "title": "Re-anchor the catalog citations", "findings": ["iter4-P2-advisor-recommend-stale-line-refs"], "priority": "advisory"},
    {"id": "WS-4", "title": "Pin the field pass-through", "findings": ["iter5-P2-field-pass-through-untested"], "priority": "advisory"}
  ],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["consumer-removal residue", "cross-consumer", "documentation traceability", "test-coverage gap"],
  "affectedSurfacesSeed": [
    ".opencode/plugins/system-skill-advisor.js",
    ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts",
    ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md",
    ".skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

| Id | Severity | Title | Dimension | Location | Finding class | Disposition |
|---|---|---|---|---|---|---|
| iter2-P2-inert-bounded-summary-option | P2 | The bounded-route option now controls nothing the plugin emits | maintainability | `.opencode/plugins/system-skill-advisor.js:379` | consumer-removal residue | advisory |
| iter2-P2-stderr-cap-hides-busy | P2 | Capping stderr at 1 MiB hides a SQLITE_BUSY marker written past the cap | correctness / reliability | `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:144` | cross-consumer | advisory |
| iter4-P2-advisor-recommend-stale-line-refs | P2 | Five line citations in `advisor-recommend.md` point at unrelated code | traceability | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` | documentation traceability | advisory |
| iter5-P2-field-pass-through-untested | P2 | The new CLI field pass-through has no test on either delivery path | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49` | test-coverage gap | advisory |
| iter5-P2-orphaned-route-summary | P2 | The removed compiled-route line left its per-prompt summary computation without a consumer | maintainability | `.opencode/plugins/system-skill-advisor.js:657` | consumer-removal residue | advisory |

**1. iter2-P2-inert-bounded-summary-option.** Evidence: `boundedCompiledRouteSummary` is resolved at `:379-395` from the option or `SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING`, documented as "Bound long compiled-route target lists" at `:1080`, and reported at `:1704`; the only consumer (the compiled-route transform block) was deleted. Case: `MkSkillAdvisorPlugin(ctx, { boundedCompiledRouteSummary: true })` with a ten-target summary emits one head block and status still says `bounded_compiled_route_summary=true`. Impact: an operator sees a knob that no longer bounds anything. Fix: delete the option, env const, jsdoc line and status field, or make the jsdoc say the field is status-only as `skill-advisor-hook.md:176` already does. Scope proof: `rg` over `.opencode` returns only the resolver, jsdoc and status line. Affected surfaces: option resolver, status tool output, plugin test matrix.

**2. iter2-P2-stderr-cap-hides-busy.** Evidence: `capOutput` drops bytes after `MAX_OUTPUT_CHARS` on both streams (`:144-150`, `:250-255`) and the busy pattern is matched against the truncated `stderr`. Case: an advisor child writes 1,048,577 bytes of warnings then `SQLITE_BUSY`; the hook returns `NON_ZERO_EXIT` with `retriesAttempted: 0` where the pre-cap code retried. Impact: a busy daemon stops being retried on the rare large-stderr path. Fix: keep a bounded tail (or scan each chunk for the marker before capping) so classification still sees the last line. Scope proof: `capOutput` is the only accumulator; no side channel retains the tail. Affected surfaces: retry classification, degraded path, `subprocess-output-cap` test.

**3. iter4-P2-advisor-recommend-stale-line-refs.** Evidence: `:310` cites the `command` field that lives at `:321`; `:287` cites `includeCompiledRoute` at `:295`; `:290` cites `compiledRouteTopOnly` at `:298`; `:563-565` and `:632-634` cite skip branches that live at `:630-632` and `:705-707`. Case: a reader follows `:287` and finds `workspaceRoot`. Impact: the catalog's line anchors cannot be trusted. Fix: re-anchor the five citations. Scope proof: every cited line was read and the token at each is named in the iteration file. Affected surfaces: the enrichment section and both option paragraphs.

**4. iter5-P2-field-pass-through-untested.** Evidence: `recommendationFromCli` forwards `command`/`policy`/`ownerSkillId`/`needsMode` (`hooks/lib/skill-advisor-cli-fallback.ts:365-390`) and the plugin mapper mirrors them (`system-skill-advisor.js:574-585`); the envelope test's command-bearing case sends none of them and the plugin's 42 tests assert none. Case: deleting the four spreads keeps every test green, which is exactly the pass-one defect they fix. Impact: an unguarded fix. Fix: one case per path that sends the four fields on a CLI row and asserts the rendered head names the command, policy and owner. Scope proof: grep over both test files returns no assertion on the four fields. Affected surfaces: both mappers and both test files.

**5. iter5-P2-orphaned-route-summary.** Evidence: `compiledRouteSummary(data)` still runs at `:657` and stores `metadata.compiledRouteSummary` at `:669`; no `.opencode` code reads the field after the transform block was deleted at `:1582-1590`. Case: a delivered brief with a five-target route builds and stores a summary nothing consumes. Impact: per-prompt work and a misleading field. Fix: remove the call and field with the deleted block, or name the consumer that should read it. Scope proof: `rg` over `.opencode/plugins` returns producer, call, field, digest helper and test-local factory only. Affected surfaces: brief metadata, the helper, the plugin test helper.

## 4. Remediation Workstreams

Advisory only; order reflects shared cause, not severity.

- **WS-1 — Finish the compiled-route removal.** One removal produced two advisories. Either delete `boundedCompiledRouteSummary`, its env const, its jsdoc line and its status field, and drop `compiledRouteSummary()`/`metadata.compiledRouteSummary`; or keep them and correct the jsdoc to say the field and knob are status-only. Owner: `.opencode/plugins/system-skill-advisor.js` plus `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:176`.
- **WS-2 — Keep the busy marker under the output cap.** Bound the stderr tail or scan chunks for `SQLITE_BUSY`/`database is locked` before capping; then flip `tests/subprocess-output-cap.vitest.ts:47-66` to assert the retry fires. Owner: `runtime/lib/subprocess.ts` and its test.
- **WS-3 — Re-anchor the catalog citations.** Update the five references in `advisor-recommend.md` to `advisor-tool-schemas.ts:295`, `:298`, `:321` and `handlers/advisor-recommend.ts:630-632`, `:705-707`. Owner: the catalog leaf.
- **WS-4 — Pin the field pass-through.** Add one envelope case and one plugin mapper case that send `command`, `policy`, `ownerSkillId` and `needsMode` on a CLI row and assert the rendered head. Owner: both test files.

## 5. Spec Seed

- Record in the command-surfacing spec that the compiled-route summary line was removed from the OpenCode transform and that `boundedCompiledRouteSummary` is a compatibility flag whose only remaining effect is the status field, or remove the flag and say so.
- Record that `runAdvisorSubprocess` caps both streams at 1 MiB characters and that retry classification reads the capped buffer; state whether a busy marker past the cap must still retry.
- Record that `recommendationFromCli` and the plugin mapper both carry `command`, `policy`, `ownerSkillId` and `needsMode`, and that both are part of the renderer contract.

## 6. Plan Seed

- Task 1: delete or re-document the bounded-route option and the orphaned summary in `system-skill-advisor.js`; update `skill-advisor-hook.md:176` and the plugin test that reports the status field.
- Task 2: change `capOutput` to retain a bounded tail (or pre-scan chunks), then assert `retriesAttempted > 0` in the busy-marker test.
- Task 3: re-anchor the five citations in `advisor-recommend.md`.
- Task 4: add the two missing pass-through tests and run `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` plus `node --test tests/system-skill-advisor.test.cjs`.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | pass | Every changed doc claim in this area was matched to its code line across iterations 1-6; the command label, brief head forms, degraded contract and hook request options all match. | None beyond finding 3's citations. |
| `checklist_evidence` | notApplicable | The parent spec folder has no checklist row governing this code pass; pass-one findings are the baseline. | None. |

`AC_COVERAGE`: **exempt**. The parent spec folder has no `acceptance-criteria.md`; the child phases own theirs.

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | No agent definition is in this area's changed set. |
| `agent_cross_runtime` | pass | The six named runtimes resolve to the shared handler (claude, codex, cursor, devin, pi, dsh) or the OpenCode plugin; both delivery paths carry the same four command fields, and the child-session rule is tested against `isChildSession`. |
| `feature_catalog_code` | partial | The catalog leaf matches the code in substance; finding 3 is its citation drift. |
| `playbook_capability` | pass | `hooks/skill-advisor-hook-validation.md` was checked; the changed health-record sentence holds at every hook exit, and the withdrawn finding records why. |

## 8. Deferred Items

- **`R2-P1-001` remains deferred from pass one.** The child downgrade still has no per-request input in `SkillAdvisorBriefOptions`; a host that serves a child in-process without setting `AI_SESSION_CHILD` renders a parent brief. Unchanged by this pass.
- **`iter2-P2-hook-health-doc-scope` withdrawn.** Raised in iteration 2 as a doc-scope mismatch, withdrawn in iteration 4: the changed sentence is about hook runs, every hook adapter persists (the Codex, Cursor and Devin shims set `SPECKIT_RUNTIME` before spawning the compiled handler — `system-spec-kit/runtime/hooks/devin/shared.ts:95-110`), and the OpenCode plugin is a separate delivery path with its own playbook step. Recorded resolved in the registry.
- **`run` commands that write.** `/doctor:deep-loop` and `/doctor:speckit` are `run` with class `add-only`; whether that is intended stays a decision, not a fix. The renderer's child downgrade now treats them as parent-named.
- **dsh install path.** `/doctor:install` cannot link a dsh runtime because `symlink-manifest.json` has no `dsh` row. Feature decision, unchanged.
- **Command-start table in `skill-advisor-hook.md:104-115`.** The per-runtime model tool reach (for example 33 of 45 names in Claude Code) cannot be verified from repository artifacts; recorded unverified, not a finding.

## Dimension Expansion Map

- All four dimensions covered: correctness (iterations 1, 3, 6), security (iteration 2), traceability (iteration 4), maintainability (iteration 5).
- Divergence state is empty: no pivot started, completed or failed, no audited override, no saturated direction, no remaining frontier.
- Selected review directions: pass-one fix replay per cluster, mutating-command and holdout safety, doc-code agreement, and removal-residue maintainability.
- This map records breadth only and changes no verdict.

## 9. Search Ledger

| Field | Value |
|---|---|
| `searchCoverage` rows | 0 (legacy v1 records; no v2 search-depth contract was emitted) |
| `candidateCoverage` rows | 0 |
| `searchDebt` | 0 |
| `ruledOutCandidates` | 0 |
| `cleanSearchProof` | 0 |
| `graphCoverageMode` | unavailable (graphless fallback; direct reads only) |

*No search-depth state captured (legacy v1 record).* `hasSearchDebt: false`.

## 10. Audit Appendix

### Convergence

| Metric | Value |
|---|---|
| Iterations | 6 |
| Stop reason | `converged` |
| Convergence threshold | 0.10 |
| Last new-findings ratio | 0.00 |
| Convergence score | 1 |
| Open findings | 5 P2 |
| Resolved findings | 1 |
| Release-readiness state | `converged` |

Novelty per iteration: 0.00, 1.00, 0.00, 1.00, 1.00, 0.00.

### Coverage

| Dimension | Iterations | Result |
|---|---|---|
| correctness | 1, 3, 6 | pass |
| security | 2 | pass |
| traceability | 4 | pass |
| maintainability | 5 | pass |

### Ruled Out

- Deleting the compiled-route line dropped a documented feature — the README sentence still holds for the fallback renderer.
- The new compiled-route request leaks the prompt — the payload stays on stdin inside the already-spawned CLI.
- Hook latency with the new route request exceeds the fallback budget — measured 88-98 ms without the route and 134-160 ms with top-only, under the 250 ms budget.
- The DSH decoder/reader path split is a new defect — format selection from the locator name predates the change.
- `readSession` dropping `injected` hides a fix — the README states the split; raw consumers use `loadSession`.
- The plugin's orphaned summary changes the emitted brief — it never reaches `output.system`.
- Any open finding is a P0/P1 — all five are advisory with named concrete inputs.

### Sources Reviewed

Iterations 001-006 of this lineage, their deltas, the reducer-owned registry and dashboard, and the pass-one report sections 3.1 and 8. Every file cited in §3 was read directly in the iteration that raised its finding, and every open finding's anchor was re-read in iteration 6.

### Cross-Reference Appendix

**Core Protocols**

- `spec_code`: pass — six iterations matched doc claims to code; the only drift is finding 3.
- `checklist_evidence`: notApplicable — no checklist row for this code pass.

**Overlay Protocols**

- `skill_agent`: notApplicable — no agent definition in the changed set.
- `agent_cross_runtime`: pass — six runtimes share the handler or plugin; the label fields and child rule agree.
- `feature_catalog_code`: partial — substance matches, citations drift (finding 3).
- `playbook_capability`: pass — the validation playbook's changed claims hold.
