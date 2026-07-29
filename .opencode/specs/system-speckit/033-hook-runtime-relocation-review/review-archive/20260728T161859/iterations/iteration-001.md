# Deep Review Iteration 001

## Dimension

Inventory. This pass mapped the relocated hook cores, live runtime registrations, discovery mirrors, validation surfaces, and stale-path risk before the dimension-specific passes.

## Files Reviewed

- `.opencode/runtime-hooks/README.md:20-116`
- `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2`
- `.claude/settings.json:15-189`
- `.codex/hooks.json:53-110`
- `.cursor/hooks.json:48-99`
- `.devin/hooks.v1.json:51-123`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:77-110`
- `.opencode/plugins/README.md:19-23,75-77,141-150,251-261`
- `.pi/extensions/README.md:44-60`
- All 17 runtime discovery symlinks named in the review scope were checked for both symlink type and a resolving target.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R1-P2-001: The new runtime-hook validation command mixes incompatible test runners

- File: `.opencode/runtime-hooks/README.md:100`
- Evidence: The README runs three test files under one `node --test` command and says all suites pass. `dispatch-audit.test.mjs` explicitly imports Vitest and documents `npx vitest run` as its runner at `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2`. Running the documented command failed with `TypeError: Cannot read properties of undefined (reading 'config')`; running `npx vitest run .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs` passed all 38 tests.
- Finding class: matrix/evidence
- Scope proof: The failure was reproduced with the exact README command. The two Node-runner suites passed in that invocation, isolating the mismatch to the Vitest file.
- Recommendation: Split the validation recipe into a `node --test` command for the Node-runner suites and a separate `npx vitest run` command for `dispatch-audit.test.mjs`.

#### R1-P2-002: The Claude hook reference table still names the removed pre-relocation post-edit path

- File: `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:89`
- Evidence: The table says it reflects live `.claude/settings.json` wiring but points to `python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh`. Live wiring now invokes `node .opencode/runtime-hooks/post-edit-quality/claude/claude-posttooluse.cjs` at `.claude/settings.json:175`. The old row was the only old-runtime-path hit found across the changed scope.
- Finding class: cross-consumer
- Scope proof: Exact stale-root search over every changed file found this row and no executable consumer still using a moved root. The line predates this commit, but the relocation updates adjacent rows in the same live-wiring table and leaves this moved-hook consumer inaccurate.
- Affected surface hints: `Claude hook documentation`, `post-edit-quality relocation`
- Recommendation: Replace the row's command with the current Node command from `.claude/settings.json`.

#### R1-P2-003: The plugin architecture rules still place all shared cores under owning skills

- File: `.opencode/plugins/README.md:23`
- Evidence: Lines 23, 75, and 146 state that plugin shared cores live under an owning skill. The same changed README now links the relocated portable cores under `.opencode/runtime-hooks/` at line 260, and the new runtime-hooks README defines that directory as their owner. The architecture and boundary prose therefore contradicts the relocation it documents.
- Finding class: cross-consumer
- Scope proof: The contradiction occurs in the modified plugin README itself and applies to the five reviewed plugins whose imports moved to `.opencode/runtime-hooks/`.
- Affected surface hints: `OpenCode plugin architecture`, `runtime-hooks ownership`
- Recommendation: Qualify those rules so skill-coupled cores stay under skills while portable runtime-hook cores live under `.opencode/runtime-hooks/`.

## Traceability Checks

- `spec_code`: partial. Live runtime configs point to the relocated tree, all 17 discovery symlinks resolve, and the five changed OpenCode plugin entrypoints import successfully. Full behavioral/spec acceptance alignment remains for the traceability iteration.
- `checklist_evidence`: pending. Inventory established the validation mismatch but did not adjudicate the implementation packet checklist.
- `skill_agent`: partial. The old-root scan found one stale documentation consumer and no executable consumer in the changed scope.
- `agent_cross_runtime`: partial. Claude, Codex, Cursor, Devin, OpenCode, and Pi wiring surfaces were inventoried; runtime behavior parity remains for later dimensions.
- `feature_catalog_code`: pending.
- `playbook_capability`: pending.

## Verdict

PASS with advisories. No P0 or P1 was confirmed. Three P2 documentation/verification defects should be corrected before treating the relocation map as authoritative.

## Next Dimension

Correctness: inspect every changed adapter's relative import depth and payload translation, then run the complete concern-level and plugin regression suites under their intended runners.

Review verdict: PASS
