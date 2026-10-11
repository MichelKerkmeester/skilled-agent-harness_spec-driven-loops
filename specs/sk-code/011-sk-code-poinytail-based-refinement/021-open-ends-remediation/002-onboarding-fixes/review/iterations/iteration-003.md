# Deep-Review Iteration 003 - traceability

Session r2-onboarding-review-2026-10-11T19-30Z, generation 1, lineage new. Route: mode=review, target_agent=deep-review (pre-resolved). Agent definition .skilled/agents/deep-review.md loaded; severity calls follow .skilled/skills/sk-code/sk-code-review/references/review-core.md.

Review target: commit range 0039903bde..HEAD (dd001838f0, 54a2e9abbc, 424f28b8fc) on worktrees/113-rem-onboarding-fixes.

BINDING: target=0039903bde..HEAD (dd001838f0, 54a2e9abbc, 424f28b8fc)
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes

## Dimension

Primary: traceability. Every claim the three commits make was mapped to the code that carries it: the README and CONTRIBUTING Node ranges, the Quick Start step commands and ordering note, the hook trust key, the First Use runtime spellings, the Pi and Codex build notices, the sk-vision Bun setup, and the version and changelog bumps. Test quality (each new test fails before the change) and the five carried P2 findings were re-checked. Result: no P0, no P1, no new P2; all five carried P2s remain open.

## Files Reviewed

| File | What was checked |
| --- | --- |
| README.md (154-234) | Prerequisites, steps 1-5, Git Hooks section, First Use spellings |
| CONTRIBUTING.md (22-28) | Node requirement row against the engines fields |
| .skilled/skills/system-spec-kit/package.json | build script and workspaces |
| .skilled/skills/system-spec-kit/tsconfig.json | project references and outputs |
| .skilled/skills/mcp-code-mode/mcp-server/package.json | engines range named in README |
| .skilled/skills/system-spec-kit/runtime/cli/package.json | engines range named in README |
| .skilled/skills/system-skill-advisor/runtime/package.json | engines, build script and shared dependency |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts | notice path and trigger condition |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts | dist path the notice mirrors |
| .skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts | both notice branches |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | defaultMessage per runtime |
| .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts | registry-to-file assertion |
| .codex/hooks.json | regenerated fallback text |
| .skilled/skills/sk-vision/SKILL.md | Setup paragraph |
| .skilled/skills/sk-vision/vision-runtime/package.json | build script and bun engine |
| .skilled/skills/sk-vision/vision-runtime/scripts/build.ts | declared dist outputs |
| .skilled/bin/lib/mirror-sync-verify.cjs | lazy parser load and not-checkable code |
| .skilled/bin/check-agent-mirror-sync.cjs | exit 3 emission site |
| .skilled/bin/check-agent-mirror-sync.vitest.ts | unbuilt-parser case |
| .skilled/scripts/git-hooks/pre-commit | trust read and exit-3 branch |
| .skilled/hooks/git/pre-commit | exit-3 branch |
| .skilled/scripts/git-hooks/tests/pre-commit.test.sh | cases 64-65 |
| .skilled/skills/system-spec-kit/changelog/v2.7.11.0.md | change-to-version mapping |
| .skilled/skills/sk-vision/changelog/v0.3.6.0.md | change-to-version mapping |
| .skilled/skills/sk-vision/README.md | version carrier (carried finding) |
| .codex/prompts/speckit-complete.md, .cursor/commands/speckit-complete.md, .pi/prompts/speckit-complete.md, .hermes/prompts/speckit-complete.md, .opencode/commands/speckit/complete.md, .claude/commands/speckit/complete.md, .devin/SYNC.md | First Use command spellings |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

No new P2 this iteration. The five active P2s were re-checked against the current tree and all remain open:

1. R1-P2-001, sk-vision README version carrier stale. .skilled/skills/sk-vision/README.md:10 still reads version 0.3.5.0 while the skill, its Hermes copy and changelog v0.3.6.0 all say 0.3.6.0.
2. R1-P2-002, Pi unbuilt notice can misdiagnose a non-root cwd. .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49 still joins ctx.cwd, unchanged.
3. R1-P2-003, README trust-skip comment overstates skipped gates. README.md:181 says a second clone "skips every gate"; the commit-msg message contract runs outside the trust block (.skilled/scripts/git-hooks/README.md:32).
4. R1-P2-004, new warn tests do not assert the build remediation. .skilled/scripts/git-hooks/tests/pre-commit.test.sh:901 asserts only the not-checkable line; the build line at .skilled/scripts/git-hooks/pre-commit:196 is unasserted.
5. R2-P2-001, hook READMEs still document the mirror gate as block-or-allow. .skilled/hooks/git/README.md:28 and .skilled/scripts/git-hooks/README.md:110 unchanged on the exit-3 skip.

## Traceability Checks

Claim-by-claim map of the three commits (spec_code, core protocol):

1. Node ranges. README.md:160 and CONTRIBUTING.md:25 state Node 24.x. All twelve package.json engines fields accept it: .skilled/skills/mcp-code-mode/mcp-server/package.json:43 requires >=24.0.0 <25.0.0, .skilled/skills/system-spec-kit/runtime/cli/package.json:8 requires >=22.12.0, .skilled/skills/system-skill-advisor/runtime/package.json:7 requires ^20.19.0 || >=22.12.0, and the rest accept >=20.11.x. Verified. [SOURCE: README.md:160]
2. Steps 2 and 3. .skilled/skills/system-spec-kit/package.json:15 builds with tsc --build; .skilled/skills/system-spec-kit/tsconfig.json:17 references shared, runtime and runtime/cli; the two outputs the step comment names exist in the tree: shared/dist/frontmatter/parse-frontmatter.js and runtime/dist/hooks/claude/session-prime.js. The mirror checker loads that shared parser. Verified. [SOURCE: .skilled/skills/system-spec-kit/package.json:15]
3. Step 4 ordering. .skilled/skills/system-skill-advisor/runtime/package.json:11 runs npm --prefix ../../system-spec-kit/shared run build first, and :19 depends on file:../../system-spec-kit/shared, so the note "run it after step 2" is accurate. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:11]
4. Step 5 trust key. .skilled/scripts/git-hooks/pre-commit:44 reads git config --local --bool skilled.trustRepoHooks, and :53 prints the same setting as the remediation; README.md:182 sets it with an accepted value. Wording nuance stays tracked as R1-P2-003. [SOURCE: .skilled/scripts/git-hooks/pre-commit:44]
5. First Use spellings. README.md:224 names seven runtimes. Prompt files exist for Codex (.codex/prompts/speckit-complete.md), Cursor (.cursor/commands/speckit-complete.md), Pi (.pi/prompts/speckit-complete.md) and Hermes (.hermes/prompts/speckit-complete.md), while OpenCode and Claude carry .opencode/commands/speckit/complete.md and .claude/commands/speckit/complete.md. .devin/SYNC.md:20 documents the whole-directory skills link exposed as the /system-spec-kit skill with no command surface. All seven verified. [SOURCE: README.md:224]
6. Pi notice. .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12 names the same build output the adapter library spawns (claude-hook-adapter.ts:43), and :47-50 fires the notice only when the adapter returned no context and the file is missing. The test asserts both branches (session-start-context-pi-extension.vitest.ts:49, :64). The named build output exists. Verified. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12]
7. Codex message. .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23 matches .codex/hooks.json:8 text; the sync test asserts every registry defaultMessage names the spec-kit runtime and none says "installer" (hook-registration-sync.vitest.ts:60). The changelog claim that Claude, Cursor and Devin already did the same matches registry lines 8, 36 and 52. Verified. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23]
8. sk-vision Setup. .skilled/skills/sk-vision/SKILL.md:14 names Bun 1.0+ and bun install && bun run build in vision-runtime/; vision-runtime/package.json:11 builds with bun run scripts/build.ts, engines.bun >=1.0.0 at :46, and scripts/build.ts:68 declares dist/plugin.js and dist/vision-cli.js. Both plugin symlinks target the missing dist, and .cursor/commands/vision.md:32 runs the missing CLI, matching the paragraph. Verified. [SOURCE: .skilled/skills/sk-vision/SKILL.md:14]
9. Exit 3. .skilled/bin/check-agent-mirror-sync.cjs:111 is the only emission site; both hooks special-case exactly 3 (.skilled/scripts/git-hooks/pre-commit:194, .skilled/hooks/git/pre-commit:100) and block every other non-zero with exit 1. bash -n passes on both edited hooks. No collision found; this re-confirms iteration 2's ruling. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:111]
10. Version and changelog hygiene. system-spec-kit and sk-vision SKILL.md frontmatter, the Hermes copies and changelog v2.7.11.0.md / v0.3.6.0.md all agree; only .skilled/skills/sk-vision/README.md:10 lags (R1-P2-001). [SOURCE: .skilled/skills/sk-vision/changelog/v0.3.6.0.md:15]

Test-quality checks (checklist_evidence, core protocol):

- Pi notice test fails before the change (no notice) and passes after; the second case proves silence when the adapter file exists.
- Mirror checker test fails before (exit 1 with DRIFT) and passes after (exit 3 with NOT CHECKABLE and no DRIFT).
- Registry sync test fails before on the old codex message and passes after on the new wording.
- pre-commit cases 64 and 65 fail before the hook change on the exit-3 case and pass after; the remediation line stays unasserted (R1-P2-004).

Protocol status:

- spec_code (core): pass, iterations 1-3.
- checklist_evidence (core): pass, iterations 1-3.
- skill_agent (overlay): pass, iteration 1; Hermes copies carry the new versions.
- agent_cross_runtime (overlay): pass, iterations 1-3.
- feature_catalog_code (overlay): pass-with-advisory; R1-P2-001 remains open.
- playbook_capability (overlay): not applicable; no manual-testing-playbook behavior changed.

## Edge Cases

- Exit-code 3 collision beyond the checker's own branch was searched and ruled out (single emission site; hooks special-case exactly 3; Node's internal bootstrap exit 3 is not reachable from user-script syntax errors).
- The regenerated .codex/hooks.json fallback names the spec-kit build even for adapters the build cannot restore (worktree-guard.sh, mcp-route-guard.cjs, and others). The stderr drift line names the failing adapter and the message offers "restore the missing adapter", so the build hint reads as a first repair, not a false remedy. Recorded as ruled out, not as a finding.
- The advisor line "needs 20.19+ or 22.12+" compresses a caret range that excludes Node 21 and 23. The operative Node 24 recommendation is exact; noted, no finding.

## Confirmed-Clean Surfaces

- Engines parity: every package.json engines field in the repository accepts Node 24.
- Build-output paths named by the Pi notice, the Codex hooks and the mirror checker all exist in the same build tree.
- Cross-runtime First Use spellings verified against real command and prompt files for all seven runtimes.
- Changelog and version mapping consistent across SKILL.md frontmatter, Hermes copies and changelog files.
- Shell syntax of both edited hooks (bash -n) and single-site exit 3.

## Ruled Out

- Exit-code 3 collision with another meaning (re-confirmed; iteration 2 ruling stands).
- Stale duplicated remediation text: no remaining "builds its own runtime", "Node 18" or "codex hooks installer" strings outside the sync test's negative assertion.
- Codex generic fallback wording for non-runtime adapters as a reportable defect (see Edge Cases).
- The advisor "20.19+" summary as a reportable defect (see Edge Cases).

## Scope Violations

None. All writes stayed inside iterations/iteration-003.md, deltas/iter-003.jsonl, deep-review-strategy.md and the append gateway's own run-directory writes; no reviewed file was modified.

## Verdict

PASS with advisories. No P0 or P1, no new P2; the five carried P2s were re-checked and none resolved.

## Next Dimension

Iteration 4: maintainability - patterns, clarity, documentation quality and safe follow-on change cost across the changed surfaces; re-check the five carried P2s. R1-P2-001 is the closest to closure, alongside the next version bump.

Review verdict: PASS
