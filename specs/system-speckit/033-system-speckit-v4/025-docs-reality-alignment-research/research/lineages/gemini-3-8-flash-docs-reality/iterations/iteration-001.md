# Iteration 1: Manual-Testing-Playbook Fidelity Audit

## Focus
Auditing `manual-testing-playbook` scenarios across `context-preservation`, `lifecycle`, `plugins-and-hooks`, `retrieval`, and `ux-hooks` against live runtime source code and command behavior.

---

## Findings

### Finding 1: Autopilot Contract Test Path Non-Existent Directory
- **Doc path:line**: `manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md:41`
- **Claimed behavior**: "2. Run `bash: cd .opencode/skills/runtime/ && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/speckit-autopilot-contract.vitest.ts` and require EXIT 0."
- **Actual behavior**: `.opencode/skills/runtime/` does not exist. The directory was merged into `.opencode/skills/system-deep-loop/runtime/` (documented in `.opencode/skills/system-deep-loop/SKILL.md:14` and line 75 of this playbook file). Running the command verbatim fails with `cd: .opencode/skills/runtime/: No such file or directory`.
- **Severity**: P1
- **One-line fix**: Update `cd .opencode/skills/runtime/` to `cd .opencode/skills/system-deep-loop/runtime/`.

---

### Finding 2: Dist Freshness Guard Watched Package Count and Enumeration Mismatch
- **Doc path:line**: `manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md:27-29, 107`
- **Claimed behavior**: "against a fixed registry of seven watched packages (`system-spec-kit/shared`, `system-spec-kit/runtime/cli`, `system-spec-kit/runtime`, `mcp-code-mode/mcp-server`, `sk-design/sk-design-md-generator/backend`)." and line 107: "Expected: JSON `{"status": "stale"|"fresh"|"degraded", "results": [...]}` for the 7 packages;"
- **Actual behavior**: In `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:23-143`, `DIST_PACKAGES` defines exactly 6 packages (`system-spec-kit/shared`, `system-spec-kit/runtime/cli`, `system-spec-kit/runtime`, `mcp-code-mode/mcp-server`, `system-skill-advisor/mcp-server`, `sk-design-md-generator/backend`). The doc claims 7 packages while listing only 5 in the parenthetical, omitting `system-skill-advisor/mcp-server` and giving an incorrect root path for `sk-design-md-generator`.
- **Severity**: P1
- **One-line fix**: Update the documented package count to 6 and enumerate all 6 packages matching `DIST_PACKAGES` in `dist-freshness.cjs`.

---

### Finding 3: Speckit Completion Exposer Playbook Script ReferenceError and Phantom Spec Paths
- **Doc path:line**: `manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md:81-87`
- **Claimed behavior**: Step 3 script in lines 86-87:
  ```javascript
  console.log("=== Level-2 EVIDENCE_MISSING ===");
  console.log(await exec({ specFolder: level2Incomplete }, { directory: process.cwd() }));
  ```
- **Actual behavior**: In lines 81-82, only `level2Complete` and `level3` are declared. `level2Incomplete` is undeclared, causing Node to throw `ReferenceError: level2Incomplete is not defined` when executing step 3. Furthermore, the path `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync` does not exist because `.opencode/specs` does not exist in the repository (specs are under `specs/`).
- **Severity**: P0
- **One-line fix**: Declare `level2Incomplete` with an existing spec folder and update spec fixture paths from `.opencode/specs/` to `specs/`.

---

### Finding 4: Transport-Down Playbook Phantom Session Adapter and Miscounted Hook
- **Doc path:line**: `manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:59, 92`
- **Claimed behavior**: Line 59: "- Both hooks exit 0 well inside their timeouts..." and Line 92 table: `| runtime/hooks/claude/session-prime.ts | Claude session adapter using the warm paths |`
- **Actual behavior**: Line 14 explicitly notes that session-prime was decommissioned with the memory server and that the advisor hook is the sole consumer of this contract. The command in line 49 executes only one hook (`user-prompt-submit.js`). `runtime/hooks/claude/session-prime.ts` has no socket or IPC fallback logic.
- **Severity**: P2
- **One-line fix**: Update line 59 to refer to the single advisor hook and remove `session-prime.ts` from the implementation table.

---

### Finding 5: Comment Hygiene Baseline Phantom Context Server File
- **Doc path:line**: `manual-testing-playbook/ux-hooks/comment-hygiene-checker-baseline.md:31, 52`
- **Claimed behavior**: Step 5: `python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/runtime/context-server.ts; echo "EXIT:$?"`
- **Actual behavior**: `.opencode/skills/system-spec-kit/runtime/context-server.ts` does not exist on disk (decommissioned with the memory MCP server). Running the command against this non-existent path errors out.
- **Severity**: P1
- **One-line fix**: Replace `.opencode/skills/system-spec-kit/runtime/context-server.ts` with a surviving clean production TypeScript file.

---

### Finding 6: Comment Hygiene PostToolUse Hook Uses Obsolete Script Target
- **Doc path:line**: `manual-testing-playbook/ux-hooks/comment-hygiene-claude-code-hook.md:52, 75`
- **Claimed behavior**: Step 2: `... | python3 .opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh; echo "EXIT:$?"` and Table 75 lists `claude-posttooluse.sh`.
- **Actual behavior**: In `.claude/settings.json:175`, the live `PostToolUse` hook command is `node .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`. The old python script `claude-posttooluse.sh` is no longer the wired hook and fails to print `COMMENT HYGIENE WARNING` in the step 2 test.
- **Severity**: P1
- **One-line fix**: Change the step 2 test command and table anchor to target `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`.

---

### Finding 7: Resource Map Template Playbook Lists Unmatched CLAUDE.md Target
- **Doc path:line**: `manual-testing-playbook/context-preservation/resource-map-template.md:76, 80`
- **Claimed behavior**: Line 76: `rg -n "resource-map\\.md" ... CLAUDE.md`. Line 80: "Matches in every target, including SKILL.md, README.md, references/templates/level-specifications.md, runtime/lib/config/spec-doc-paths.ts, and CLAUDE.md"
- **Actual behavior**: `CLAUDE.md` has 0 matches for `resource-map.md`. The command fails when requiring matches in every target.
- **Severity**: P2
- **One-line fix**: Remove `CLAUDE.md` from the grep target list or add the reference into `CLAUDE.md`.

---

### Finding 8: Authored Continuity Snapshot Playbook Cites Phantom OpenLTM Test Suite
- **Doc path:line**: `manual-testing-playbook/feature-flag-reference/authored-continuity-snapshot.md:87`
- **Claimed behavior**: Line 87 table: `| runtime/tests/openltm-continuity-resilience.vitest.ts | Snapshot and disabled-mode regression coverage |`
- **Actual behavior**: `runtime/tests/openltm-continuity-resilience.vitest.ts` does not exist on disk (decommissioned with the memory system). The surviving continuity tests are `continuity-freshness.vitest.ts` and `thin-continuity-record.vitest.ts`.
- **Severity**: P2
- **One-line fix**: Replace `openltm-continuity-resilience.vitest.ts` with `runtime/tests/thin-continuity-record.vitest.ts`.

---

### Finding 9: Trigger Index Lookup Comment Cites Phantom Hybrid-Search Source
- **Doc path:line**: `runtime/cli/retrieval/lookup-trigger-index.mjs:6-8`
- **Claimed behavior**: "// Resolves a prompt against the committed trigger index using the same candidate gate, score classes and scope filter as the substring trigger lane in runtime/lib/search/hybrid-search.ts, so results from the two can be diffed directly."
- **Actual behavior**: `runtime/lib/search/hybrid-search.ts` does not exist. Only `folder-discovery.ts` exists under `runtime/lib/search/`.
- **Severity**: P2
- **One-line fix**: Update the comment in `lookup-trigger-index.mjs` to remove the reference to `hybrid-search.ts`.
