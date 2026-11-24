# Iteration 001 — Correctness

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1, lineageMode new
- Executor: this process (cli-claude-code, claude-opus-5-5), inline per the fan-out contract
- Dimension: correctness
- Operator focus (every phase's shipped work against its goal criteria): this pass re-ran the parent goal criteria 2-5 and the command-checkable completion criteria of phases 002, 003, 004 and 005 against the current tree, instead of trusting the ticked boxes.
- Sources: no `steer.md` present in the lineage.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`, `spec.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/00{2,3,4,5}-*/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md`, `spec.md`, `scratch/after-stage1.jsonl`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/tasks.md`
- `.skilled/skills/mcp-browser-use/mode-registry.json`, `.skilled/skills/mcp-tooling/mode-registry.json`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md`, `.utcp_config.json`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`, `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`, `.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh`, `.skilled/scripts/git-hooks/pre-commit`
- `.skilled/bin/tests/mcp-installers.test.cjs`, `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Phase 013 broke phase 003's installer-test criterion: the two `_utils.sh` copies now differ** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160` -- `node --test .skilled/bin/tests/mcp-installers.test.cjs` now fails its first test, "both copies of the helper library are identical" (`.skilled/bin/tests/mcp-installers.test.cjs:49-55`). 013's T008 raised the Node minimum to 20 in the Chrome DevTools copy only (`013-.../tasks.md:50`, commit `1a350b1512b` touches only that copy), while `.skilled/skills/mcp-code-mode/scripts/_utils.sh:160` still reads `min_version="${1:-18}"` and line 164 still hard-codes "Node.js 18+". The test header states the rule outright: "change both copies together". Phase 003's goal criterion (`003-mode-relocation/goal.md:61`) requires this test to exit 0, so a shipped, previously passing criterion is now false, and 013's verification (`bash -n` plus one `rg` line) never ran the suite that guards the file it edited.
   Finding class: regression (cross-phase).
   Scope proof: `diff` of the two copies prints exactly two hunks, lines 160 and 164; the test run reports the assertion at `mcp-installers.test.cjs:51`.
   Affected surface hints: `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh`, `.skilled/bin/tests/mcp-installers.test.cjs`, 013 tasks T008 verify step.
   Case: run `node --test .skilled/bin/tests/mcp-installers.test.cjs` on the current tree; the identical-copies test fails with the "change both copies together" message.

```json
{"type":"regression","claim":"013 changed only the Chrome DevTools _utils.sh copy, so mcp-installers.test.cjs fails and 003 goal criterion 4 no longer holds","evidenceRefs":[".skilled/bin/tests/mcp-installers.test.cjs:49",".skilled/skills/mcp-code-mode/scripts/_utils.sh:160",".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160","specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/tasks.md:50","specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:61"],"counterevidenceSought":"Checked whether the test was retired or whether the code-mode copy was intentionally left at 18: the test is live and its header requires lockstep changes; no decision record exempts the code-mode copy","alternativeExplanation":"Code Mode may genuinely support Node 18, but then the test and the shared-library design must change; as shipped, the gate fails","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade to P2 if a recorded decision intentionally splits the two helpers and the test is updated to match"}
```

### P2 Findings

2. **Phases 003 and 004 are marked Complete but every completion criterion in their goal.md is unchecked** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:58` -- Lines 58-62 of 003's goal and lines 59-63 of 004's goal are all `- [ ]`, while the parent phase map lists both as Complete (`spec.md:118-119`). Re-run here, 003's criteria 1, 2, 3 and 5 and 004's criteria 1-4 hold; 003's criterion 4 is false (finding 1). The goal file is the only source of goal state, so a reader cannot tell done from not-done without re-running everything.
   Finding class: traceability-drift.
   Scope proof: `grep -n '^- \[ \]'` over both goal files prints ten lines; the parent `spec.md` phase map rows 3 and 4 say Complete.
   Affected surface hints: `003-mode-relocation/goal.md`, `004-bladebro-mode/goal.md`, parent `spec.md` phase map.
   Case: an operator reads 003's goal to decide whether the phase is closed; all five boxes are empty although the phase is reported Complete.

3. **005 goal criterion 1 is ticked though its own evidence shows mcp-tooling still passing the threshold** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/goal.md:59` -- The criterion reads "returns mcp-browser-use above threshold ... and mcp-tooling for none of them" and is `[x]`. The phase's evidence file records `"mcp_tooling_passing": true` for all three mode requests (`005-.../scratch/after-stage1.jsonl:1-3`), and the summary concedes mcp-tooling is "Still listed at 0.54 to 0.58" (`005-.../implementation-summary.md:133`). `005-.../spec.md:23` honestly records REQ-003 as met only at the default threshold; the goal checkbox drops that qualifier.
   Finding class: traceability-drift.
   Scope proof: three of three stage-one rows carry `mcp_tooling_passing: true`.
   Affected surface hints: `005-routing-and-surfaces/goal.md`, parent `goal.md` progress row for 005.
   Case: replay the first prompt with `--threshold 0.5`; mcp-tooling passes, contradicting the ticked criterion.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Parent criteria 2-5 hold: registry counts 3 and 6 (`.skilled/skills/mcp-browser-use/mode-registry.json`), stale-path `rg` empty, `parent-skill-check.cjs` OK for both hubs, advisor plus compiled route return `mcp-browser-use` with `action: route`. 003 criterion 4 fails (finding 1). |
| checklist_evidence | partial | 003/004 goal boxes unchecked (finding 2); 005 criterion 1 ticked against its own evidence (finding 3). |

## Integration Evidence

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` on `.skilled/skills/mcp-browser-use`: "OK: parent-skill-check — all hard invariants passed, 0 warnings".
- `.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh`: "Results: 51 passed, 0 failed", with an `mcp-browser-use/mcp-other` case at line 145.
- `.skilled/bin/skill-advisor.cjs advisor_recommend` for a Bladebro attach request: `mcp-browser-use` 0.928 with `compiledRoute.action: route`, `selectionKind: single`.
- `.utcp_config.json` holds a `bladebro` stdio manual with `args: ["mcp"]`.

## Edge Cases

- 003's goal lists `check-mcp-mutation-class.test.sh` at no path; it lives under `scripts/tests/`. Resolved by search, not a finding.
- 004 criterion 5 (`git diff --stat` on Aside prints nothing) is a point-in-time check that later phases (008, 013) legitimately invalidate; treated as historical, not re-scored.

## Confirmed-Clean Surfaces

- Hub registry: three modes, each `packetKind workflow`, `backendKind cli-plus-mcp`, `advisorRouting.routingClass metadata`, no `extensions` key (002 criteria 2-3).
- Mutation guard: manifest `skill_dir` lines 45, 61, 68 point under `mcp-browser-use`; pre-commit regex line 726 and `HOOK_PATTERN`/`DISCOVERY_GLOBS` name `mcp-browser-use/`.
- Bladebro SKILL.md: `name: mcp-bladebro`, `command -v bladebro` lane check, six R-SEC mentions.

## Ruled Out

- Stale `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` paths under `.skilled` outside changelog/benchmark reports: none.
- Browser mode ids in mcp-tooling's own six root files: none.

## Next Focus

- Dimension: security
- Focus area: 004 R-SEC rules vs spec section 3 text, Bladebro/Aside install and doctor scripts, `.utcp_config.json` env handling, shell scripts in the hub (`shared/`, `scripts/`).
- Reason: the hub ships executable install scripts and a stealth/real-browser driver; trust boundaries not yet covered.
- Rotation status: correctness done; security, traceability, maintainability remain.
- Required evidence: file:line in scripts and R-SEC text comparison.

Review verdict: CONDITIONAL
