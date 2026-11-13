# Review Report - hook-close-3c (PASS THREE closing round)

Lineage: `hook-close-3c` · Session: `fanout-hook-close-3c-1794596804847-827gze` · Generation 1 · Mode: `review`
Run directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/hook-close-3c`
Stop reason: `maxIterationsReached` (iteration 3 of 3; the third iteration added no new finding, so the convergence signal was also met at the cap).

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- `hasAdvisories`: false (the verdict is conditional on active P1 work, not a PASS with advisories)
- Active findings: **0 P0, 1 P1, 2 P2**
- Review scope: the final state of the doctor hook wiring check and its test, and the shared no-edit predicate with its scorer/explainer callers and its test, after commits `860610d783` and `846eab66b8`.
- Operator review focus: Code review of command surfacing, PASS THREE closing round. Review the FINAL state of (a) `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` readWords/simpleCommands/commandWords/nodeFlagSkipsScript/runsNodeOnMarker/scriptWord/runsMarker and its test file, and (b) NO_EDIT_REQUEST and isNoEditRequest in `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, their callers in `runtime/lib/scorer/fusion.ts` and `runtime/lib/scorer/text.ts`, and `runtime/tests/command-attach-guards.vitest.ts`. Settled and not re-reported: the "make no changes" safe reading, and the hook check being a wiring heuristic rather than a node or shell parser. Every finding is P0/P1/P2 with file:line and a concrete input run. Never open holdout-prompts.jsonl. Change no code; write only inside the lineage folder. This lineage reviews the doctor hook check first and the no-edit gate second.

The two fixed defects hold at the final state: attached evaluation/print/syntax flags report `hook-missing`, and the literal `make no changes` phrase rules out a change whatever follows it, with both readings pinned by tests. One safety gap survives in the same predicate: the contracted form of the same instruction (`don't make any changes`) is not in the vocabulary, so a plausible no-edit prompt is still offered `/create:agent` (policy `start`, `mutating: 'mutates'`). Two advisory diagnostic gaps remain in the hook check for hand-written command shapes. No P0.

## 2. Planning Trigger

`/speckit:plan` is **required** for the active P1; the two P2s may ride the same plan as advisory work.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["HC3-P1-001", "HC3-P2-001", "HC3-P2-002"],
  "remediationWorkstreams": [
    "WS-1 (P1): widen NO_EDIT_REQUEST with the contracted make-changes instruction and pin it in command-attach-guards.vitest.ts",
    "WS-2 (P2): complete the node flag-with-argument model for the spaced form, led by --env-file",
    "WS-3 (P2): treat shell command-start words (then/do/else/command) as prefixes in the hook check"
  ],
  "specSeed": [
    "Name the no-edit wording contract as the class 'wording that rules out a change', not a closed phrase list",
    "Record the hook check as a wiring heuristic over a named set of flag and prefix shapes"
  ],
  "planSeed": [
    "Add the contracted make-changes alternation; keep the settled safe reading and the scope-limit rows green",
    "Add two hook-check rows and fixture cases for the spaced node flag and the keyword-prefixed launch",
    "Re-run the two single test files and the hook CLI probes before commit"
  ],
  "findingClasses": {
    "HC3-P1-001": "class-of-bug",
    "HC3-P2-001": "class-of-bug",
    "HC3-P2-002": "class-of-bug"
  },
  "affectedSurfacesSeed": [
    "attachCommand hub-command gate (command-attach.ts:338)",
    "readOnlyRouteAllowed (fusion.ts:677)",
    "commandMeaningEligible (fusion.ts:881)",
    "isReadOnlyExplainer (text.ts:150)",
    "/doctor:setup and /doctor:symlink check hook legs"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### HC3-P1-001 — The contracted "make changes" instruction is not in the no-edit vocabulary

- Severity: **P1** · Dimension: security · File: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292`
- Evidence: `NO_EDIT_REQUEST` covers `(?:do not|don't) (change|edit|modify|touch)` and the literal `make no changes`, but not `don't make any changes` / `do not make changes` / `don't make changes until ...`. `isNoEditRequest` returns `false` for those prompts, and `attachCommand` returns `/create:agent` on a single-mode `sk-create-agent` route.
- Input run: `use sk-doc to create an agent called invoice-parser, don't make any changes yet` → `isNoEdit=false`, `attach=/create:agent`; siblings `... don't change anything yet` and `... make no changes to existing agents` → `true`, `null`.
- Impact: a prompt that rules out a change is offered a mutating command (`/create:agent` is `policy: 'start'`, `mutating: 'mutates'`), and the same predicate is the only guard at the three other call sites.
- Disposition: active, fix before merge.
- Finding class: `class-of-bug`
- Scope proof: `isNoEditRequest` is the single predicate (four call sites, no compensating check).
- Affected surface hints: `attachCommand`, `readOnlyRouteAllowed`, `commandMeaningEligible`, `isReadOnlyExplainer`.
- Downgrade trigger: if the maintainer declares the vocabulary closed at the pinned phrasings, downgrade to P2.

### HC3-P2-001 — A node flag with a space-separated value is read as the script word

- Severity: **P2** · Dimension: correctness · File: `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:222`
- Evidence: `NODE_FLAGS_WITH_ARGUMENT` omits `--env-file`; the two-word advance at `:277` then treats `vars` as the script word and reports the hook missing.
- Input run: `node --env-file vars <marker>` → `hook-missing claude` (exit 1); `node --env-file=vars <marker>` → `ok claude` (exit 0); `node --env-file vars -e "console.log('ENVFILE_SPACED_RAN')"` → `ENVFILE_SPACED_RAN`.
- Impact: a false repair instruction in `/doctor:setup` and `/doctor:symlink check` for a working hook.
- Disposition: active advisory.
- Finding class: `class-of-bug`
- Scope proof: the set at `:222-224` is the only table consulted by the skip at `:277`.
- Affected surface hints: doctor legs, `--json` consumer.

### HC3-P2-002 — A command after a shell keyword or `command` is not read as a command start

- Severity: **P2** · Dimension: correctness · File: `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:240`
- Evidence: `COMMAND_PREFIXES` holds only `{` and `exec`; `simpleCommands` splits only at separators, so `then node ...` and `command node ...` fail the first-word check at `:272`.
- Input run: `if [ -f vars ]; then node <marker>; fi` → `hook-missing claude` (exit 1); `command node <marker>` → `hook-missing`; `bash -c 'if [ -f vars ]; then echo IF_THEN_RAN; fi'` → `IF_THEN_RAN`; `command node -e "console.log('COMMAND_NODE_RAN')"` → `COMMAND_NODE_RAN`.
- Impact: a guarded or builtin-prefixed hook is diagnosed as missing.
- Disposition: active advisory.
- Finding class: `class-of-bug`
- Scope proof: `COMMAND_PREFIXES` at `:240` is the only prefix list; `commandWords` its only consumer.
- Affected surface hints: doctor legs, settings repair guidance.

## 4. Remediation Workstreams

**P1 (fix before merge)**

1. **WS-1 — widen the shared no-edit vocabulary for the contracted make-changes instruction.** Extend `NO_EDIT_REQUEST` so `(?:do not|don't) make (?:any )?changes?` (and, for the same reason, `without changing`) rule out a change; add the contracted row to `NOEDIT4` and a settled-phrase row to the safe-reading table. Keep the three scope-limit rows green. One edit at `command-attach.ts:292` covers all four consumers.

**P2 advisories (may ride the same plan)**

2. **WS-2 — finish the node flag-with-argument model.** Add `--env-file` to `NODE_FLAGS_WITH_ARGUMENT` and add a test row for the spaced form; the equals form already passes.
3. **WS-3 — finish the command-start word list.** Add the shell keywords (`then`, `do`, `else`) and the `command` builtin to the command-prefix handling, or strip them in `simpleCommands`; add the guarded-launch and `command node` rows.

## 5. Spec Seed

- State the no-edit contract as a class, not a closed phrase list: "wording that asks for an answer and rules out a change", with the accepted cost spelled out (the safe reading wins when the two readings cannot be told apart).
- Record the hook check's scope as a wiring heuristic over named flag and prefix shapes, and name `--env-file`-style flags and hidden `if`/keyword layouts as known limits if they are not fixed.
- Add the contracted make-changes row to the pass-three test evidence so the vocabulary's boundary is explicit.

## 6. Plan Seed

- `T1` Add the contracted `make changes` alternation and the adjacent `without changing` form to `NO_EDIT_REQUEST`; extend the guard test table.
- `T2` Add `--env-file` to `NODE_FLAGS_WITH_ARGUMENT`; add a hook-check row for `node --env-file <file> <marker>`.
- `T3` Extend the hook check's command-start words; add rows for `if ...; then node ...; fi` and `command node ...`.
- `T4` Re-run `tests/command-attach-guards.vitest.ts` and `tests/hook-wiring-check.test.cjs`, plus the CLI fixture probes, before commit.

## 7. Traceability Status

**Core Protocols**

- `spec_code` — **pass**. Commit `860610d783`'s flag-name claim and commit `846eab66b8`'s safe-reading claim were verified by probes at the final state; the packet's AC-001 (four no-edit wordings) and AC-027 (seven wrapper launches plus a quoted echo) hold. The contracted-form gap is a code gap (`HC3-P1-001`), not a mismatch with a written claim.
- `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`.
- `AC_COVERAGE` — **exempt** (no acceptance-criteria lifecycle surface at the packet root; the phase rows were read as context, not as the review gate).

**Overlay Protocols**

- `skill_agent` — **pass**. The attach and scorer call sites were read at their lines; `/doctor:setup` and `/doctor:symlink check` consume the hook check and map exit 1 to DEGRADED/WARN.
- `agent_cross_runtime` — **not applicable**. No agent definition or runtime mirror describes the changed script/library.
- `feature_catalog_code` — **pass**. `feature-catalog/scorer-fusion/command-meaning-matching.md:36` matches the pattern and `commandMeaningEligible`.
- `playbook_capability` — **not applicable**. The advisor manual-testing playbook has no scenario for this surface.

## 8. Deferred Items

- The phase-014 Known Limitations at `014-review-remediation/implementation-summary.md:158,161` are stale (they describe wrapper shapes and a `text.ts` copy that later phases fixed). Read as a historical phase snapshot, not a live claim; if packet archaeology matters, update or cross-reference them.
- The commits' suite claims ("184 files, 1798 passed") were not re-run in this lineage; only the probes and single-file assertions were exercised.
- The `sh` shell still has no hook-wiring case of its own (`017/implementation-summary.md:176`); it is read by the same list and already probed as `ok`.
- The resource-map gate is skipped because no `resource-map.md` exists at the packet root.

## Dimension Expansion Map

- Saturated directions: none. Completed pivots: none. Failed pivots: none. Audited overrides: none.
- Selected review directions: correctness of the hook check (iteration 1), security of the no-edit gate (iteration 2), traceability and maintainability of the tests/docs (iteration 3).
- Remaining frontier: none. All four configured dimensions are covered.

## Search Ledger

*No search-depth state captured (legacy v1 record)*

## Audit Appendix

- **Convergence summary**: iteration 1 introduced 2 P2 (ratio 1.00); iteration 2 introduced 1 P1 (ratio 0.71); iteration 3 introduced none (ratio 0.00). The loop ran to the 3-iteration cap, where the convergence signal was met.
- **Coverage summary**: correctness, security, traceability and maintainability each have one full iteration; all four configured dimensions are marked covered in the registry.
- **Ruled-out claims**: the flag-name fix does not regress spaced flags; the check cannot crash or hang on malformed input; the settled `make no changes` reading is not a defect; no doc claims the contracted make-changes form is covered; the stale phase-014 limitations are historical, not a live claim.
- **Sources reviewed**: `review-scope-3c.txt`; both commits (`-- .skilled`); `hook-wiring-check.cjs` and its test in full; `command-attach.ts`, `fusion.ts` (the two no-edit rule sites), `text.ts` (the explainer site) and `command-attach-guards.vitest.ts`; the two runtime READMEs; the feature-catalog page; the packet's pass-two acceptance rows and phase limitations; the live checkout's four hook files through the check.
- **Settled decisions respected**: the `make no changes` safe reading and the wiring-heuristic carve-out are not re-reported; the bounded-context probes (fixtures, `vars`, real module) are recorded in the iteration files.
