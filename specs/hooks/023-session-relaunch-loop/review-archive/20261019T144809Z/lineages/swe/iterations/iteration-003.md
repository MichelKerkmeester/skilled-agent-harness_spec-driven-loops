# Iteration 3: Traceability + maintainability — spec evidence vs. code, overlays, residual duplication

## Dispatcher

cli-devin `swe-2-max`, fan-out lineage `swe`, session `fanout-swe-1792349322065-8lohfl`. LEAF in-process iteration 3 of 3 (max-iterations stop policy). No steer.md present at iteration start.

## Dimension

**D3 Traceability** — spec_code and checklist_evidence protocols, plus the skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability overlays. **D4 Maintainability** — residual duplication, stale docs, test-evidence integrity.

## Files Reviewed

- `specs/hooks/023-session-relaunch-loop/spec.md` (1-134)
- `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/implementation-summary.md` (1-150)
- `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md` (31-88)
- `specs/hooks/023-session-relaunch-loop/review/` (listing: lineages/, observability-events.jsonl, orchestration-status.log — no review-report.md)
- `specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/` (incl. review-report.md)
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (640-700)
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (138-165)
- `.skilled/hooks/session-relaunch/codex/shared.mjs`, `hermes/context-nudge.mjs`, `claude/context-nudge.mjs` (helper call sites)
- `.skilled/hooks/session-relaunch/tests/{relaunch-core,killer,claude-adapters,codex-adapters,hermes-adapters}.test.cjs` (named-test citations)
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` (catalog leaf)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md` (3 leaves + index)
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (8 session-relaunch rows)
- `.claude/settings.json` (126,192,247), `.codex/hooks.json` (66,139,159), `.opencode/plugins/session-relaunch.js`, `.skilled/commands/speckit/handoff.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Parent spec prose still describes four children while five exist and are complete** — `specs/hooks/023-session-relaunch-loop/spec.md:39,51,62-65` — the metadata Handoff Criteria reads "All four children are Complete", the purpose paragraph says "The four child phases define", and In Scope lists only phases 001-004. The Phase Documentation Map at :94-98 correctly lists all five including `005-deep-review-remediation`, and the transition table has the 004→005 row, so the map updated but the narrative cells did not. A reader of the front of the file learns the wrong phase count.
   Finding class: documentation-drift
   Scope proof: spec.md:39 ("All four children are Complete"), :51 ("The four child phases define"), :62-65 (four scope bullets), :94-98 (five map rows).
   Affected surface hints: packet-level spec prose; anything generated from metadata.
   Case: a fresh session reading §1-§3 believes the packet has four phases and misses 005's existence and its scope.

2. **Phase-handoff verification cell names a path that no longer exists** — `specs/hooks/023-session-relaunch-loop/spec.md:114` — the 004→005 criterion verifies on "`review/review-report.md` exists with verdict and registry", but `review/` now holds only `lineages/`, `observability-events.jsonl` and `orchestration-status.log`; the report moved to `review-archive/20261018T184826Z/review-report.md` when this fan-out review lineage began. The criterion was honestly satisfied when checked, and the evidence survives, but the literal pointer in the spec is dangling for any verifier that re-follows it.
   Finding class: checklist-evidence-defect
   Scope proof: spec.md:114 (verification cell); `review/` listing shows no review-report.md; `review-archive/20261018T184826Z/review-report.md` exists with verdict PASS.
   Affected surface hints: spec_code/checklist_evidence verification of the 004→005 transition.
   Case: `ls specs/hooks/023-session-relaunch-loop/review/review-report.md` fails; the verification cell cannot be re-confirmed without knowing the archive path.

3. **Two `ps` process-table readers and three ancestor walks survive the helper consolidation** — `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138-165` vs `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:645-686` — the phase-005 remediation consolidated adapter process lookup into `core.readProcessTable`/`findLoopChildPid`, but the CLI still carries its own `parseProcessTable`+`readProcessTable` (:138-165) because it needs the `comm` column for the shell-child guard, and its error semantics differ (throws vs returns null). On top of that, ancestor-walking logic exists three times: `hasAncestor` (killer.cjs:124), `cliAncestorsOf`+`runtimePidFromLoop` (session-relaunch.cjs:167-188) and `findLoopChildPid` (core.cjs:668). Each differs subtly (cycle policy, root choice, column needs), so a future correctness fix in one walk will not obviously reach the others.
   Finding class: cross-consumer-duplication
   Scope proof: session-relaunch.cjs:138-165 (`ps -A -o pid=,ppid,comm=` + throw-on-error), core.cjs:645-653 (`ps -A -o pid=,ppid=` + null-on-error), core.cjs:668-686, killer.cjs:124-135.
   Affected surface hints: every process-control path — killer ancestry gate, running-work check, CLI target resolution.
   Case: a fix to the ancestor walk in `findLoopChildPid` (e.g. handling `ps` truncation) does not propagate to the CLI's or the killer's private walks.

## Traceability Checks

- **spec_code**: every file the parent spec names as created exists — `.skilled/hooks/session-relaunch/` tree, `.skilled/bin/skilled-loop`, `.skilled/commands/speckit/handoff.md`, catalog leaf, playbook leaves. `hook-registry.json` resolved at `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (8 session-relaunch rows), with rendered rows present in `.claude/settings.json` (:126,:192,:247) and `.codex/hooks.json` (:66,:139,:159). PASS.
- **checklist_evidence**: phase-005 AC evidence pointers resolve exactly — `nudge.cjs:171/183/199/24` match `notePathFromSeed`/`plannedNotePath`/`relaunchThreshold`/`DEFAULT_THRESHOLD`; named tests exist at cited lines (`relaunch-core.test.cjs:749`, `killer.test.cjs:958`, `:1074`, `:1392`, `claude-adapters.test.cjs:508`, `:558`). All twelve archived P2 advisories verified fixed in code read this run (appendLog fsync/0600/newline repair relaunch-core.cjs:555-586; transcript grace killer.cjs:157-161; owner-pid mutex takeover killer.cjs:295-304; ensureStateDir 0700 :42-47; shared helpers at call sites codex/shared.mjs:101/111, hermes/context-nudge.mjs:65/83/94, claude/context-nudge.mjs:99/109; `SPEC_FOLDER_SKIP_SUFFIX_LEGACY` nudge.cjs:16; arm-path killer respawn stop-arm.mjs:94-97, pi/session-relaunch.ts:339-343). PASS with the two P2 exceptions recorded above.
- **skill_agent**: handoff command exists (`.skilled/commands/speckit/handoff.md`); Claude hooks rendered into settings.json for PostToolUse, UserPromptSubmit and Stop. PASS.
- **agent_cross_runtime**: adapters present and wired for claude, codex, hermes, pi, opencode; Cursor/Devin command-trigger path documented in the catalog leaf. PASS.
- **feature_catalog_code**: `feature-catalog/context-preservation/session-relaunch-loop.md` describes the loop and matches code behavior (0.80 default threshold, +0.05 step, seven runtimes, `SESSION_ID_PATTERN` claim verified at nudge.cjs:25). PASS.
- **playbook_capability**: three runtime playbooks plus index entry exist under `manual-testing-playbook/plugins-and-hooks/`. PASS.

## Edge Cases

- `findLoopChildPid` returns null when `ps` fails (core.cjs:648-652) — adapters that rely on it degrade to no-target rather than a wrong target. Fail-closed.
- The catalog leaf's session-id claim `[A-Za-z0-9_-]{1,128}` matches `SESSION_ID_PATTERN` (nudge.cjs:25) — doc/code consistent.
- `review/observability-events.jsonl` interleaves `swe` and `luna` lineage events — shared observability stream, not a state violation; each lineage's own state file is separate.

## Confirmed-Clean Surfaces

- Phase-005 remediation claims verified end-to-end: all twelve archived advisories fixed in the code as described by implementation-summary.md, with named regression tests at the exact cited lines.
- Helper consolidation is real: no adapter defines its own threshold/note-path/seed parser — all call sites resolve to `lib/nudge.cjs`.
- Hook wiring is generated, not hand-edited: registry → rendered settings/hooks.json rows present for Claude and Codex.
- Catalog leaf and playbook leaves match the implementation's observable behavior.

## Ruled Out

- Treating the missing `review/review-report.md` as an unmet criterion: it existed when the transition was judged and survives in `review-archive/` — recorded as a dangling pointer (finding 2), not a failed gate.
- A second live review-report under `review/`: the fan-out contract writes reports per-lineage under `review/lineages/<lane>/`, so the flat path's absence is expected for in-flight lanes.

## Next Focus

Synthesis: aggregate 10 active findings across the three iterations (all P2), confirm dimension coverage 4/4 (correctness, security, traceability, maintainability), and record the run as max-iterations reached.

Review verdict: PASS
