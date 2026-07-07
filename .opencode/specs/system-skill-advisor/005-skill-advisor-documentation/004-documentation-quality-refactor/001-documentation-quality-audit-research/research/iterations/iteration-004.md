# Iter 004 — INSTALL_GUIDE.md command-by-command smoke vs reality

## Question

Do the commands documented in INSTALL_GUIDE.md actually work? Which paths/flags drift from current reality?

## Evidence (file:line citations required)

**Evidence 1: INSTALL_GUIDE.md npm command enumeration**
- Grep found 19 matches for npm|node|bash|devin|codex patterns in INSTALL_GUIDE.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="45-275" />
- Installation commands: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server install` and `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="60-61" />
- Launcher command: `node .opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="67" />
- Native package checks: typecheck, build, test commands all use `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="104-106" />

**Evidence 2: INSTALL_GUIDE.md path enumeration**
- Grep found 29 matches for `.opencode/skills/` pattern in INSTALL_GUIDE.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="36-292" />
- Hook paths documented: claude, codex, gemini, devin user-prompt-submit.ts files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="131-134" />
- Compat path documented: `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="140" />
- Built compat path documented: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/compat/index.js` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="146" />
- Plugin bridge path documented: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="182" />
- Built server entrypoint documented: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="188" />
- Manual testing playbook path documented: `.opencode/skills/system-skill-advisor/mcp_server/manual_testing_playbook/manual_testing_playbook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="254" />
- Regression fixtures path documented: `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="292" />

**Evidence 3: Actual hook file existence verification**
- Claude hook exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" lines="1-246" />
- Codex hook exists with additional files: user-prompt-submit.ts, prompt-wrapper.ts, lib/codex-hook-policy.ts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts" lines="1-425" />
- Gemini hook exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts" lines="1-260" />
- Devin hook exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts" lines="1-252" />

**Evidence 4: Package.json build command verification**
- package.json exists at `.opencode/skills/system-skill-advisor/mcp_server/package.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" lines="1-22" />
- Build script defined: `"build": "../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json"` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" line="7" />
- Typecheck script defined: `"typecheck": "../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.build.json"` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" line="8" />
- Test script defined: `"test": "../../system-spec-kit/mcp_server/node_modules/.bin/vitest run"` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" line="9" />
- Build commands reference system-spec-kit tooling, not standalone tooling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" lines="7-9" />

**Evidence 5: Launcher script existence verification**
- Launcher script exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-skill-advisor-launcher.cjs" />
- INSTALL_GUIDE documents launcher command: `node .opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="67" />
- Launcher path matches documentation exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="67" />

**Evidence 6: Python shim script existence verification**
- skill_advisor.py exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py" />
- skill_advisor_regression.py exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py" />
- INSTALL_GUIDE documents regression command with fixtures path that doesn't exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="291-292" />

**Evidence 7: Missing directory verification**
- compat directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- dist directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- plugin_bridges directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- fixtures directory NOT found in scripts via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts" />
- manual_testing_playbook directory NOT found in system-skill-advisor via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor" />

**Evidence 8: OpenCode plugin existence verification**
- OpenCode plugin exists: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-skill-advisor.js` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-skill-advisor.js" />
- INSTALL_GUIDE documents plugin bridge path that doesn't exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="182" />

**Evidence 9: Devin hook environment variable drift**
- INSTALL_GUIDE documents environment variable: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="48, 202-209" />
- Devin hook source code uses different variable: `MK_SKILL_ADVISOR_HOOK_DISABLED` with fallback to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts" lines="91-94" />
- Other hooks (claude, codex, gemini) use only `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" line="125" />

**Evidence 10: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, not INSTALL_GUIDE command verification <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 focused on README.md marketing voice gap audit, not INSTALL_GUIDE command accuracy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-002.md" lines="1-119" />
- Iteration-003 focused on ARCHITECTURE.md vs source code drift, found build command references wrong package but did not examine INSTALL_GUIDE <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="1-113" />
- None of the prior iterations verified INSTALL_GUIDE command paths or checked for missing directories <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-001.md" lines="1-77" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Missing compat directory (P0, impact-rank 10, sub-phase-target: 004)**
- INSTALL_GUIDE documents compat path: `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="140" />
- INSTALL_GUIDE documents built compat path: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/compat/index.js` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="146" />
- compat directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- dist directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- Documentation references OpenCode bridge entrypoint that doesn't exist, breaking the documented integration path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="137-147" />

**Finding 2: Missing plugin_bridges directory (P0, impact-rank 9, sub-phase-target: 004)**
- INSTALL_GUIDE documents plugin bridge path: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="182" />
- plugin_bridges directory NOT found in mcp_server via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server" />
- OpenCode plugin exists at `.opencode/plugins/mk-skill-advisor.js` but documented bridge path doesn't exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-skill-advisor.js" />
- Documentation describes cross-process gateway architecture that doesn't exist in current codebase <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="135, 179-183" />

**Finding 3: Missing manual_testing_playbook directory (P1, impact-rank 8, sub-phase-target: 005)**
- INSTALL_GUIDE documents manual testing playbook path: `.opencode/skills/system-skill-advisor/mcp_server/manual_testing_playbook/manual_testing_playbook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="254" />
- manual_testing_playbook directory NOT found in system-skill-advisor via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor" />
- INSTALL_GUIDE references OP-001 and OP-002 operator scenarios that live in this playbook <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="248, 261" />
- Missing playbook removes documented operator guidance for degraded/quarantined states <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="248-262" />

**Finding 4: Missing regression fixtures directory (P1, impact-rank 7, sub-phase-target: 005)**
- INSTALL_GUIDE documents regression command with fixtures path: `--dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="291-292" />
- fixtures directory NOT found in scripts via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts" />
- skill_advisor_regression.py script exists but documented dataset path doesn't <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py" />
- Documented regression command will fail due to missing fixtures directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="290-293" />

**Finding 5: Build command cross-package dependency (P0, impact-rank 9, sub-phase-target: 004)**
- INSTALL_GUIDE npm commands use `--prefix .opencode/skills/system-skill-advisor/mcp_server` which references local package.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="60-61, 104-106" />
- Local package.json build scripts reference system-spec-kit tooling: `../../system-spec-kit/node_modules/.bin/tsc` and `../../system-spec-kit/mcp_server/node_modules/.bin/vitest` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" lines="7-9" />
- This contradicts INSTALL_GUIDE's description of system-skill-advisor as "standalone MCP server" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="10" />
- Build commands will fail if system-spec-kit is not available or at expected relative path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json" lines="7-9" />
- Iteration-003 found similar drift in ARCHITECTURE.md build command, confirming this is a cross-document issue <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="57-61" />

**Finding 6: Devin hook environment variable inconsistency (P1, impact-rank 6, sub-phase-target: 004)**
- INSTALL_GUIDE documents rollback control as `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` for all runtimes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="202-209" />
- Devin hook source code checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first, then falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts" lines="91-94" />
- Other hooks (claude, codex, gemini) only check `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" line="125" />
- Documentation doesn't mention the Devin-specific `MK_SKILL_ADVISOR_HOOK_DISABLED` variable <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="202-223" />
- Operators using documented variable may not disable Devin hook as expected <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts" lines="91-94" />

**Finding 7: Hook paths accurate (P2, impact-rank 2, sub-phase-target: 004)**
- INSTALL_GUIDE documents Claude hook path correctly: `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="131" />
- INSTALL_GUIDE documents Codex hook path correctly with additional files: prompt-wrapper.ts and lib/codex-hook-policy.ts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="133" />
- INSTALL_GUIDE documents Gemini hook path correctly: `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="132" />
- INSTALL_GUIDE documents Devin hook path correctly: `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="134" />
- All documented hook files exist at expected paths <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts" lines="1-246" />

**Finding 8: Launcher script path accurate (P2, impact-rank 2, sub-phase-target: 004)**
- INSTALL_GUIDE documents launcher command: `node .opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="67" />
- Launcher script exists at documented path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-skill-advisor-launcher.cjs" />
- Path matches exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="67" />

**Finding 9: Python shim scripts exist (P2, impact-rank 2, sub-phase-target: 004)**
- INSTALL_GUIDE documents skill_advisor.py path correctly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="159-160" />
- skill_advisor.py exists at documented path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py" />
- skill_advisor_regression.py exists at documented path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py" />
- Scripts exist but regression command references non-existent fixtures <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="291-292" />

**Finding 10: OpenCode plugin exists but bridge missing (P1, impact-rank 8, sub-phase-target: 004)**
- INSTALL_GUIDE documents OpenCode plugin at `.opencode/plugins/mk-skill-advisor.js` which exists <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="135" />
- OpenCode plugin file exists at documented path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-skill-advisor.js" />
- INSTALL_GUIDE documents cross-process gateway bridge that doesn't exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="135" />
- Plugin may work without documented bridge, but documentation describes non-existent architecture <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" lines="135, 179-183" />

## Gaps for next iter

1. **Gap 1**: Determine if the missing compat, plugin_bridges, and manual_testing_playbook directories represent a future architecture that was planned but not implemented, or if they were removed and documentation wasn't updated.

2. **Gap 2**: Investigate whether the OpenCode plugin at `.opencode/plugins/mk-skill-advisor.js` actually works without the documented plugin_bridges cross-process gateway, or if the plugin is also non-functional.

3. **Gap 3**: Check if there are alternative locations for the regression fixtures and manual testing playbook that were moved but documentation wasn't updated to reflect new paths.

4. **Gap 4**: Verify if the build command cross-package dependency on system-spec-kit is intentional (shared infrastructure) or if system-skill-advisor should have its own toolchain for true standalone operation.

5. **Gap 5**: Determine the correct environment variable name for Devin hook disable control and whether documentation should document both MK_SKILL_ADVISOR_HOOK_DISABLED and SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.

## JSONL delta row

```json
{"type":"iteration","iteration":4,"timestamp_utc":"2026-05-16T10:10:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"INSTALL_GUIDE.md command-by-command smoke vs reality","findings_count":10,"gaps_count":5,"newInfoRatio":0.90,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/package.json","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts"]}
```
