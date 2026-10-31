# system-spec-kit docs-reality alignment — synthesis

**lineage:** `gemini-3-8-flash-docs-reality` · **session:** `fanout-gemini-3-8-flash-docs-reality-1788685236772-ivz16y` · **loop:** research (max-iterations) · **iterations:** 2/2 · **stopReason:** `maxIterationsReached`

Audit of the `system-spec-kit` documentation (`manual-testing-playbook/**`, `feature-catalog/**`, `references/**`) against its runtime implementation (`.opencode/skills/system-spec-kit/runtime/`, `shared/`, `templates/`, `SKILL.md`, `.opencode/commands/speckit/*.md`). Every finding cites both a doc location and a code location. No files outside this lineage directory were edited.

---

## Summary

19 distinct doc-vs-code mismatches across 19 findings, focusing on documents the first lane never opened:
- **Iteration 1**: manual-testing-playbook scenarios in `context-preservation`, `lifecycle`, `plugins-and-hooks`, `retrieval`, and `ux-hooks`.
- **Iteration 2**: `references/cli`, `references/config`, `references/debugging`, `references/memory`, `references/templates`, and `feature-catalog` sections.

### Key Systematic Root Causes
1. **Broken Test Scenarios in Playbooks**: Playbook instructions contain undeclared variables throwing runtime exceptions (`level2Incomplete` in `speckit-completion-exposer.md`), references to non-existent root paths (`.opencode/specs/` instead of `specs/`, `.opencode/skills/runtime/` instead of `.opencode/skills/system-deep-loop/runtime/`), and testing against decommissioned files (`context-server.ts`).
2. **Obsolete Hook Integrations**: Playbooks test against obsolete Python hook wrappers (`claude-posttooluse.sh`) instead of active JS/CJS hooks wired in `.claude/settings.json` (`claude-posttooluse.cjs`).
3. **Advertising Retired Capabilities as Active**: Documentation describes `/speckit:search` as providing epistemic baselines, causal graph analysis, and evaluation dashboards when those stateful database features are explicitly declared unsupported in the command contract.
4. **Residue of Decommissioned Memory Architecture**: Continued references to `[spec]/memory/*.md` support artifacts, semantic search in template style guides, `DB_UPDATED_FILE` touching during saves, `memory/` folders in AI execution checklists, and fictitious `config.jsonc` `memory.triggers` configuration.
5. **Specification Contradictions with System Canon**: Dual-threshold readiness math `(confidence >= 0.70) AND (uncertainty <= 0.35)` in `epistemic-vectors.md` directly contradicts the single unified confidence scale mandated by `AGENTS.md` Gate 1.

**Distribution:** 2 × P0 (wrong/harmful/broken execution), 10 × P1 (misleading/outdated/non-executable), 7 × P2 (cosmetic/duplicate/stale reference).

---

## P0 — Wrong / Harmful / Breaks Execution

### G-P0-01 · Speckit Completion Exposer Playbook Script Throws ReferenceError and Targets Phantom Spec Paths
- **Doc path:line**: [SOURCE: manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md:81-87]
- **Claimed behavior**: In test execution Step 3, lines 86-87 execute:
  ```javascript
  console.log("=== Level-2 EVIDENCE_MISSING ===");
  console.log(await exec({ specFolder: level2Incomplete }, { directory: process.cwd() }));
  ```
- **Actual behavior**: In lines 81-82, only `level2Complete` and `level3` are declared. `level2Incomplete` is undeclared, causing Node to throw `ReferenceError: level2Incomplete is not defined` [SOURCE: manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md:87]. Furthermore, the path `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync` does not exist because `.opencode/specs` does not exist in the repository (specs are located under `specs/` [SOURCE: specs/]).
- **Severity**: P0
- **One-line fix**: Declare `const level2Incomplete = "specs/..."` with an existing spec folder and update spec fixture paths from `.opencode/specs/` to `specs/`.

### G-P0-02 · /speckit:search Advertises Retired Capabilities as Live
- **Doc path:line**: [SOURCE: references/memory/save-workflow.md:144]
- **Claimed behavior**: "`/speckit:search  # Unified retrieval + analysis: search, epistemic baselines, causal graph, evaluation`"
- **Actual behavior**: In `.opencode/commands/speckit/search.md:111-120` [SOURCE: .opencode/commands/speckit/search.md:111-120], epistemic baselines, causal graph analysis, evaluation dashboards, and semantic search are explicitly declared unsupported retired capabilities from the decommissioned database. The `/speckit:search` command is a thin lexical router over the trigger index and ripgrep only.
- **Severity**: P0
- **One-line fix**: Update the description of `/speckit:search` to "Continuity retrieval: trigger-index lookup and ripgrep lexical scan".

---

## P1 — Misleading / Outdated / Broken Scenarios

### G-P1-01 · Autopilot Contract Test Path Targets Non-Existent Directory
- **Doc path:line**: [SOURCE: manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md:41]
- **Claimed behavior**: "2. Run `bash: cd .opencode/skills/runtime/ && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/speckit-autopilot-contract.vitest.ts` and require EXIT 0."
- **Actual behavior**: `.opencode/skills/runtime/` does not exist. The directory was merged into `.opencode/skills/system-deep-loop/runtime/` [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:14; test located at .opencode/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts]. Running the command verbatim fails with `cd: .opencode/skills/runtime/: No such file or directory`.
- **Severity**: P1
- **One-line fix**: Change `cd .opencode/skills/runtime/` to `cd .opencode/skills/system-deep-loop/runtime/`.

### G-P1-02 · Dist Freshness Guard Watched Package Count and Enumeration Mismatch
- **Doc path:line**: [SOURCE: manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md:27-29, 107]
- **Claimed behavior**: "against a fixed registry of seven watched packages (`system-spec-kit/shared`, `system-spec-kit/runtime/cli`, `system-spec-kit/runtime`, `mcp-code-mode/mcp-server`, `sk-design/sk-design-md-generator/backend`)." and line 107: "Expected: JSON `{"status": "stale"|"fresh"|"degraded", "results": [...]}` for the 7 packages;"
- **Actual behavior**: In `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:23-143` [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:23-143], `DIST_PACKAGES` defines exactly 6 packages (`system-spec-kit/shared`, `system-spec-kit/runtime/cli`, `system-spec-kit/runtime`, `mcp-code-mode/mcp-server`, `system-skill-advisor/mcp-server`, `sk-design-md-generator/backend`). The doc asserts 7 packages while listing only 5 in text.
- **Severity**: P1
- **One-line fix**: Update the documented package count to 6 and enumerate all 6 packages matching `DIST_PACKAGES` in `dist-freshness.cjs`.

### G-P1-03 · Comment Hygiene Baseline Tests Phantom Context Server File
- **Doc path:line**: [SOURCE: manual-testing-playbook/ux-hooks/comment-hygiene-checker-baseline.md:31, 52]
- **Claimed behavior**: Step 5: `python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/runtime/context-server.ts; echo "EXIT:$?"`
- **Actual behavior**: `.opencode/skills/system-spec-kit/runtime/context-server.ts` does not exist on disk (decommissioned with the memory MCP server). Running the checker on this missing file causes an error and fails the test.
- **Severity**: P1
- **One-line fix**: Replace `.opencode/skills/system-spec-kit/runtime/context-server.ts` with a surviving clean production TypeScript file (e.g. `runtime/lib/discovery/spec-document-finder.ts`).

### G-P1-04 · Comment Hygiene PostToolUse Hook Playbook Uses Obsolete Python Script
- **Doc path:line**: [SOURCE: manual-testing-playbook/ux-hooks/comment-hygiene-claude-code-hook.md:52, 75]
- **Claimed behavior**: Step 2: `... | python3 .opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh; echo "EXIT:$?"` and Table 75 lists `claude-posttooluse.sh` as the primary implementation anchor.
- **Actual behavior**: In `.claude/settings.json:175` [SOURCE: .claude/settings.json:175], the wired `PostToolUse` hook command is `node .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`. The legacy Python script `claude-posttooluse.sh` is no longer the active hook and fails to emit `COMMENT HYGIENE WARNING` in the step 2 test.
- **Severity**: P1
- **One-line fix**: Update the step 2 command and table anchor to target `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`.

### G-P1-05 · Epistemic Vectors Claims Decommissioned Memory Search and Contradicts AGENTS.md Gate 1 Scale
- **Doc path:line**: [SOURCE: references/memory/epistemic-vectors.md:210, 315, 333, 338, 390-392]
- **Claimed behavior**: Lines 210, 333, 338 advise agents to "Search memory for prior work" and "Broader memory search". Line 315 claims: `READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)` and lines 390-392 claim this dual-threshold validation is enforced in Gate 1 of `AGENTS.md`.
- **Actual behavior**: Memory search is decommissioned. In `AGENTS.md:88-97` [SOURCE: AGENTS.md:88-97], Gate 1 defines Confidence Thresholds using a single scale (`≥80%`, `40-79%`, `<40%`, `Override`) and explicitly commands: "that table is the single scale; do not carry a second one."
- **Severity**: P1
- **One-line fix**: Remove references to searching memory and align readiness with the single confidence scale in `AGENTS.md`.

### G-P1-06 · Template Guide Claims Save Touches DB_UPDATED_FILE and Re-indexes Database
- **Doc path:line**: [SOURCE: references/templates/template-guide.md:619-620]
- **Claimed behavior**: "and then reindexes the packet docs for recovery. When that save updates indexed state, the runtime also touches `DB_UPDATED_FILE` so long-lived readers can rebind instead of serving stale packet data."
- **Actual behavior**: `runtime/cli/continuity/generate-context.ts` [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts] (the sole save continuity writer) has zero references to `DB_UPDATED_FILE`, does not update any SQLite database, and does not re-index packet docs into a database.
- **Severity**: P1
- **One-line fix**: Remove the claim that saves touch `DB_UPDATED_FILE` and re-index a database.

### G-P1-07 · Template Style Guide Documents Decommissioned memory/*.md and Semantic Search
- **Doc path:line**: [SOURCE: references/templates/template-style-guide.md:213, 217-229]
- **Claimed behavior**: Line 213 specifies frontmatter for "Generated continuity support artifacts (`memory/*.md`)", and lines 217-229 document frontmatter with `title: [Descriptive title for semantic search]`, `sessionId`, `triggers`, and `importanceTier`.
- **Actual behavior**: The `[spec]/memory/*.md` directory and files were decommissioned in Phase 018 (as documented in `save-workflow.md:255` [SOURCE: references/memory/save-workflow.md:255]), semantic search is decommissioned, and continuity is written directly into `implementation-summary.md` (`_memory.continuity`).
- **Severity**: P1
- **One-line fix**: Remove the `memory/*.md` frontmatter section and replace with `implementation-summary.md` `_memory.continuity` frontmatter.

### G-P1-08 · Level Specifications Instructs Verifying Non-Existent memory/ Folder
- **Doc path:line**: [SOURCE: references/templates/level-specifications.md:420]
- **Claimed behavior**: In the Level 3+ Pre-Task Checklist: "7. Verify memory/ folder for context from previous sessions".
- **Actual behavior**: The `memory/` folder in spec folders was decommissioned. Continuity context lives in `_memory.continuity` inside `implementation-summary.md` and in `handover.md` [SOURCE: references/memory/save-workflow.md:255].
- **Severity**: P1
- **One-line fix**: Update step 7 to "Verify handover.md and implementation-summary.md for continuity context".

### G-P1-09 · Trigger Config Documents Unimplemented config.jsonc Memory Triggers
- **Doc path:line**: [SOURCE: references/memory/trigger-config.md:220-241]
- **Claimed behavior**: "Create or modify `config.jsonc` in your project root: `{\"memory\": {\"triggers\": {\"custom\": [...]}}}`".
- **Actual behavior**: No file in `runtime/` or `shared/` reads or parses `config.jsonc` for `memory.triggers`. Triggers are extracted from spec-doc and skill-doc markdown frontmatter by `generate-trigger-index.mjs` [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs].
- **Severity**: P1
- **One-line fix**: Remove the `config.jsonc` memory trigger configuration block or mark it as retired.

### G-P1-10 · Troubleshooting Reference Commands Cite Non-Existent .opencode/specs Path
- **Doc path:line**: [SOURCE: references/debugging/troubleshooting.md:155, 158, 161, 182, 183]
- **Claimed behavior**: Debugging commands instruct:
  - `grep -c "<!-- ANCHOR:" .opencode/specs/<track>/<NNN-name>/implementation-summary.md`
  - `find .opencode/specs -name "*.md"`
- **Actual behavior**: Spec folders live at `specs/`, not `.opencode/specs/` (`.opencode/specs` does not exist [SOURCE: specs/]). Running `find .opencode/specs` fails with `find: .opencode/specs: No such file or directory`.
- **Severity**: P1
- **One-line fix**: Replace `.opencode/specs` with `specs` in all debugging command examples.

---

## P2 — Cosmetic / Duplicate / Stale References

### G-P2-01 · Transport-Down Playbook Phantom Session Adapter and Miscounted Hook
- **Doc path:line**: [SOURCE: manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:59, 92]
- **Claimed behavior**: Line 59: "- Both hooks exit 0 well inside their timeouts..." and Line 92 table: `| runtime/hooks/claude/session-prime.ts | Claude session adapter using the warm paths |`
- **Actual behavior**: Line 14 explicitly notes that session-prime was decommissioned with the memory server and that the advisor hook is the sole consumer of this contract. The command in line 49 executes only one hook (`user-prompt-submit.js`). `runtime/hooks/claude/session-prime.ts` [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts] has no socket or IPC fallback logic.
- **Severity**: P2
- **One-line fix**: Update line 59 to refer to the single advisor hook and remove `session-prime.ts` from the implementation table.

### G-P2-02 · Resource Map Template Playbook Lists Unmatched CLAUDE.md Target
- **Doc path:line**: [SOURCE: manual-testing-playbook/context-preservation/resource-map-template.md:76, 80]
- **Claimed behavior**: Line 76: `rg -n "resource-map\\.md" ... CLAUDE.md`. Line 80: "Matches in every target, including SKILL.md, README.md, references/templates/level-specifications.md, runtime/lib/config/spec-doc-paths.ts, and CLAUDE.md"
- **Actual behavior**: `CLAUDE.md` [SOURCE: CLAUDE.md] contains 0 matches for `resource-map.md`. The command fails when requiring matches in every target.
- **Severity**: P2
- **One-line fix**: Remove `CLAUDE.md` from the grep target list or add the reference into `CLAUDE.md`.

### G-P2-03 · Authored Continuity Snapshot Playbook Cites Phantom OpenLTM Test Suite
- **Doc path:line**: [SOURCE: manual-testing-playbook/feature-flag-reference/authored-continuity-snapshot.md:87]
- **Claimed behavior**: Line 87 table: `| runtime/tests/openltm-continuity-resilience.vitest.ts | Snapshot and disabled-mode regression coverage |`
- **Actual behavior**: `runtime/tests/openltm-continuity-resilience.vitest.ts` does not exist on disk (decommissioned with the memory system). The surviving continuity tests are `continuity-freshness.vitest.ts` and `thin-continuity-record.vitest.ts` [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/].
- **Severity**: P2
- **One-line fix**: Replace `openltm-continuity-resilience.vitest.ts` with `runtime/tests/thin-continuity-record.vitest.ts`.

### G-P2-04 · Trigger Index Lookup Comment Cites Phantom Hybrid-Search Source
- **Doc path:line**: [SOURCE: runtime/cli/retrieval/lookup-trigger-index.mjs:6-8]
- **Claimed behavior**: "// Resolves a prompt against the committed trigger index using the same candidate gate, score classes and scope filter as the substring trigger lane in runtime/lib/search/hybrid-search.ts, so results from the two can be diffed directly."
- **Actual behavior**: `runtime/lib/search/hybrid-search.ts` does not exist [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/search/]. Only `folder-discovery.ts` exists under `runtime/lib/search/`.
- **Severity**: P2
- **One-line fix**: Update the comment in `lookup-trigger-index.mjs` to remove the reference to `hybrid-search.ts`.

### G-P2-05 · Troubleshooting Reference Cites Removed CONTINUE SESSION Section
- **Doc path:line**: [SOURCE: references/debugging/troubleshooting.md:355]
- **Claimed behavior**: Line 355 table recommends: "Incomplete Handover | Missing continuation context | Review the CONTINUE SESSION section in handover.md".
- **Actual behavior**: `CONTINUE SESSION` was removed from the active ladder in `handover.md` (documented in `manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md:5` [SOURCE: manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md:5]).
- **Severity**: P2
- **One-line fix**: Replace "CONTINUE SESSION section" with "Session summary and next steps in handover.md".

### G-P2-06 · Daemon CLI Reference Duplicates OPENCODE_PROMPT_TIME
- **Doc path:line**: [SOURCE: references/cli/daemon-cli-reference.md:114]
- **Claimed behavior**: "...runtime prompt-time markers such as `OPENCODE_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, and `CLAUDE_CODE_PROMPT_TIME`."
- **Actual behavior**: `OPENCODE_PROMPT_TIME` is repeated twice consecutively in the enumeration [SOURCE: references/cli/daemon-cli-reference.md:114].
- **Severity**: P2
- **One-line fix**: Remove the duplicate `OPENCODE_PROMPT_TIME` entry.

### G-P2-07 · Level Specifications and Selection Guide Duplicate acceptance-criteria.md Lines
- **Doc path:line**: [SOURCE: references/templates/level-specifications.md:32-33, 191-192, 237-238] and [SOURCE: references/templates/level-selection-guide.md:210-211]
- **Claimed behavior**: Duplicate lines in file trees and lists:
  - Lines 191-192:
    `- acceptance-criteria.md (NEW at Level 2) - The criteria that gate packet closure`
    `- acceptance-criteria.md (required at Level 2) - the criteria that decide whether the packet may close`
  - Lines 237-238:
    `- templates/addons/acceptance-criteria.md.tmpl`
    `- templates/addons/acceptance-criteria.md.tmpl`
- **Actual behavior**: The lines are exact or near-exact duplicates accidentally repeated in the document templates.
- **Severity**: P2
- **One-line fix**: Deduplicate the consecutive `acceptance-criteria.md` entries in both documents.
