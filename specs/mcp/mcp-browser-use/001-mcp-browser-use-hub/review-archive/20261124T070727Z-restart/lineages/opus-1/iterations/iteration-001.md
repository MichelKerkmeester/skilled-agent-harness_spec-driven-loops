# Iteration 001 - Correctness: phase goal criteria re-run on the current tree

## Dispatcher
- Lineage opus-1, session fanout-opus-1-1795495435655-lf6jf3, generation 2. Executor: this process (cli-claude-code, claude-opus-5-5), inline.
- Dimension: correctness. Review focus (operator): every phase's shipped work against its goal criteria. This iteration addressed the focus directly by re-running each goal's executable criteria read-only against today's tree, parent first, then 002-013 child goals.
- steer.md: not present.

## Files Reviewed
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:73-81 (parent completion criteria)
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/0{02..13}-*/goal.md completion sections
- .skilled/skills/mcp-browser-use/mode-registry.json, .skilled/skills/mcp-tooling/mode-registry.json
- .skilled/bin/tests/mcp-installers.test.cjs:48-56
- .skilled/skills/mcp-code-mode/scripts/_utils.sh:160-164, .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160-164
- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:327,467,472,499,826
- .skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md, .utcp_config.json (bladebro manual)
- .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45-68, .skilled/scripts/git-hooks/pre-commit:726, .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:148-157
- .skilled/skills/sk-code/ROUTER.md:193
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs/implementation-summary.md:105-120

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **Phase 013 changed one copy of the shared installer helper library, so the mcp-installers parity test fails and phase 003's goal criterion no longer holds** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160 -- Commit 1a350b1512b raised `check_node`'s default from 18 to 20 and rewrote the install hint in the Chrome DevTools copy only. `.skilled/skills/mcp-code-mode/scripts/_utils.sh:160` still says 18. `.skilled/bin/tests/mcp-installers.test.cjs:49-55` asserts both copies are byte-identical ("change both copies together"); `node --test .skilled/bin/tests/mcp-installers.test.cjs` now exits 1 with `tests 5, pass 4, fail 1`. Phase 003's goal names that test exiting 0 as a completion criterion, and 013's verification table (implementation-summary.md:105-120) lists no run of it.
   Finding class: cross-consumer drift (shared copy edited in one place).
   Scope proof: the drifted file and the test are both in review-scope-files.txt; the test is the 003 goal's own gate.
   Affected surface hints: mcp-code-mode/scripts/_utils.sh, mcp-chrome-devtools/scripts/_utils.sh, bin/tests/mcp-installers.test.cjs, 013 implementation-summary verification table.
   Case: run `node --test .skilled/bin/tests/mcp-installers.test.cjs` on the current tree; it reports "both copies of the helper library are identical" as failed.

```json
{"type":"claim-adjudication","findingId":"O1-I1-P1-001","claim":"013 edited only the Chrome DevTools copy of _utils.sh, breaking the byte-parity test that 003's goal requires to exit 0","evidenceRefs":[".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160",".skilled/skills/mcp-code-mode/scripts/_utils.sh:160",".skilled/bin/tests/mcp-installers.test.cjs:49"],"counterevidenceSought":"Checked whether the test was retired or the parity requirement relaxed (test still asserts equality); checked 013 verification table for a run of the test (none); confirmed via git show that 1a350b1512b touched only one copy","alternativeExplanation":"Code Mode may legitimately still support Node 18, but then the test's parity contract must change; either way a named gate is red","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"The parity test is intentionally retired or the two copies are made identical"}
```

### P2 Findings
2. **Phase 011's completion criterion no longer reproduces: the guide count is 5, not 3** -- .skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:327 -- 011 goal criterion 1 says `rg -c 'Session target not found|returnByValue'` on the guide prints 3. 013 added lines 327 and 826, so it prints 5 today. The criterion box stays checked with an evidence command that now contradicts it.
   Finding class: stale verification evidence.
   Scope proof: guide and 011 goal are in scope.
   Affected surface hints: 011-bdg-eval-port-note/goal.md completion criteria and implementation-summary evidence.
   Case: a reader re-running 011's criterion gets 5 and cannot tell whether 011 regressed.
3. **Phases 003 and 004 are marked Complete while every goal criterion box is unchecked** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md -- Both goals list five `- [ ]` criteria while their spec.md metadata reads `Status: Complete`. Spot checks show 004's criteria hold (name, 4 `command -v bladebro`, 6 R-SEC hits, bladebro stdio manual args ["mcp"]) and four of 003's five hold; the fifth (mcp-installers test) fails per finding 1. The goal file is the only goal-state source, so the packets disagree with themselves.
   Finding class: goal-state drift.
   Scope proof: both goal.md files are in scope.
   Affected surface hints: 003-mode-relocation/goal.md, 004-bladebro-mode/goal.md.
   Case: a resume reading 003's goal.md sees zero criteria met for a phase the parent map calls Complete.

## Traceability Checks
- spec_code: partial. Parent criteria 1-4 re-verified (12 iteration records; 3 and 6 modes; criterion-3 rg pair prints nothing; parent-skill-check mcp-browser-use OK, 0 warnings). 003 criterion 4 fails (finding 1).
- checklist_evidence: partial. 011 criterion evidence stale (finding 2); 003/004 checkboxes unset (finding 3). 009 ROUTER row (ROUTER.md:193), 010 stale-pointer grep (0), 013 positional `bdg cdp` grep (no match) all confirmed.

## Integration Evidence
- Ran read-only: `parent-skill-check.cjs` on mcp-browser-use, mcp-tooling, sk-code (all exit 0); `node --test .skilled/bin/tests/mcp-installers.test.cjs` (exit 1). `git status` showed no tracked file changed by these runs.

## Edge Cases
- Parent criteria 5 (advisor replay) and 7 (validate.sh --recursive) were not re-run: the advisor may start a daemon and validate.sh is barred by the lineage write limits. Recorded as not re-run, not as pass.
- One scratch file was written to /tmp (test output capture) outside the lineage; no repo file touched.

## Confirmed-Clean Surfaces
- Hub registry shape (002 criteria), mutation-guard patterns (003 criterion 5), Bladebro packet rules (004), sk-code frontend row (009), mcp-tooling pointers (010), bdg cdp positional sweep (013 criterion 2).

## Ruled Out
- Stale mcp-tooling/mcp-*-devtools paths under .skilled: none.

## Next Focus
- Dimension: security. Focus: Bladebro and Aside safety rules (R-SEC-1/2/3), teardown and install scripts, own-Chrome attach lift in the advisor (013), against their goals. Rotation: correctness done. Required evidence: file:line in scripts and SKILL.md.

Review verdict: CONDITIONAL
