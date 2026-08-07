---
title: "Implementation Summary: 018 Deep-Review Remediation"
description: "Detailed change manifest for the 14 finding fixes from packet 017's deep-review."
trigger_phrases:
  - "018 implementation summary"
  - "deep review remediation results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-032-deep-review-remediation"
    last_updated_at: "2026-05-14T21:10:00Z"
    last_updated_by: "orchestrator-remediation"
    recent_action: "Authored implementation-summary"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "018-deep-review-remediation-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 018 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `018-deep-review-remediation` |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
| **Findings Fixed** | 14 (1 P1 + 13 P2s) |
| **Findings Deferred** | 3 (F001, F017, F018) |
| **Findings Blocked** | 2 (F006/F011 — file 0 bytes) |
| **Findings Verified-Correct** | 1 (F012 — not legacy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Change Manifest

| Finding | File | Change |
|---------|------|--------|
| F002 (P1) + F003 | `.opencode/skills/system-code-graph/SKILL.md` (§7) | Added "Naming convention" paragraph clarifying dual naming: skill folder/SKILL.md `name` = `system-code-graph` (filesystem slug); MCP server + client namespace = `mk-code-index` / `mcp__mk_code_index__*` (runtime identity). Explicit explanation that hyphen-to-underscore conversion is MCP's standard namespace prefixing. |
| F004 | `.opencode/skills/system-spec-kit/README.md` (owner table line ~111) | Added `(MCP namespace: mcp__mk_code_index__*)` parenthetical next to the `system-code-graph` owner cell. |
| F005 | `.opencode/skills/system-spec-kit/SKILL.md` (§ Code Graph and Search Routing) | Added parenthetical: "(under MCP namespace `mcp__mk_code_index__*`, owned by the standalone `system-code-graph` skill)" next to the `code_graph_*` tool list. |
| F007 | `.opencode/bin/mk-code-index-launcher.cjs:162` | Error message: `"system-code-graph not found"` → `"mk-code-index skill (system-code-graph directory) not found"` — names both identities for operator clarity. |
| F008 + F015 | `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:134` | Scenario 011 description now references both `CODE_GRAPH_TOOL_SCHEMAS` (canonical export) and `TOOL_DEFINITIONS` (compat alias) at `mcp_server/tool-schemas.ts`. |
| F009 | `.opencode/bin/mk-code-index-launcher.cjs:13` (loadEnvFile) | After quote-stripping, added value-format check: reject and warn on values containing embedded newlines or NUL bytes. Defensive; existing valid .env files are unaffected. |
| F010 | `.opencode/skills/system-code-graph/README.md` (key-stats table) | "MCP server name" row now explicitly notes: `(config key `mk_code_index` — MCP converts hyphens to underscores for namespace prefixes)`. |
| F013 + F014 | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` (§1 Overview) | Added "Feature-to-tool granularity" paragraph explaining the 17-features ↔ 10-MCP-tools mapping (many features compose multiple operations on the same tool) AND clarifying that `deep_loop_graph_*` tools live in `spec-kit-memory`, not `mk-code-index`. |
| F016 + F020 | `.opencode/skills/system-code-graph/README.md` (key-stats table) | Added "Database path override" row documenting `SPECKIT_CODE_GRAPH_DB_DIR` env var, default value, and the workspace-scope guard constraint. |
| F019 | `.opencode/bin/mk-code-index-launcher.cjs:183` (acquireBootstrapLock) | Inside the EEXIST loop, before the deadline check: stat the lockdir, if `mtime` older than 5 minutes, log a warning and `rmSync` the stale dir. Keeps the 120s overall deadline as fallback. |

### Tally

- **14 fixes applied** (one source change per finding; F002 paragraph covers F003 too; F008 and F015 share the playbook edit; F010/F016/F020 share the README config-row updates; F013/F014 share the feature-catalog paragraph)
- **3 deferred** with documented rationale
- **2 blocked** (F006/F011) due to `architecture.md` being 0 bytes — needs file restoration from `1fcc5a1f5` commit if content is wanted
- **1 verified-correct** (F012) — path is actual tsc emit, not legacy
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The original plan was to dispatch via `cli-codex gpt-5.5 xhigh fast`. That dispatch failed at the UserPromptSubmit hook with an OpenAI Codex API usage-limit error (`"You've hit your usage limit. Visit https://chatgpt.com/codex/settings/usage to purchase more credits or try again at 9:15 PM."`). Pivoted to direct main-agent Edit calls per the 14-finding manifest — mechanical, surgical, no broader sweeps.

Bonus context: this is the first commit landed under the corrected git identity (`MichelKerkmeester` instead of `michelkerkmeester-barter`) after the user flagged that all prior commits in this session went out under the wrong name. Past commits retain their original author tag; future commits use the personal account.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Direct main-agent edits instead of codex dispatch | Codex API quota exhausted; user wanted same-session delivery, not a 10-minute wait. Direct edits were faster and avoided another dispatch failure. |
| Skip F006/F011 due to `architecture.md` being 0 bytes | Cannot patch line 288 of a 0-byte file. Likely parallel-session contamination. Flagged as `[B]` blocked; future packet should restore from commit `1fcc5a1f5` if the content is wanted. |
| Treat F012 as verified-correct rather than fix | Inspection of launcher.cjs:171 shows the path is the actual tsc-emit subdir (where rootDir=".." emits the skill name as a dist subdir), not a legacy package reference. Documented; no edit needed. |
| Single SKILL.md paragraph covers F002 + F003 | Both findings target the dual-naming confusion. One explicit paragraph at the top of §7 INTEGRATION POINTS addresses both contexts. |
| One feature-catalog paragraph covers F013 + F014 | Same root concern (catalog granularity vs MCP tool count + deep-loop boundary). Single explanation, two findings closed. |
| Single playbook edit covers F008 + F015 | Both want scenario 011 to reference the schema authority. Adding both `CODE_GRAPH_TOOL_SCHEMAS` and `TOOL_DEFINITIONS` aliases to scenario 011's row closes both. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| Launcher startup smoke (post-edit) | PASS — `[mk-code-index-launcher]` prefix, clean env-load output, no errors |
| F009 env-validator change preserves happy path | PASS — current .env / .env.local files load same env-var counts as before |
| F019 lock-staleness logic preserves happy path | PASS — when no lock exists, mkdirSync proceeds normally; staleness check is inside the EEXIST branch only |
| F002 paragraph in correct anchor (`integration-points`) | PASS — paragraph added before the existing consumer table |
| validate.sh --strict on 018 packet | (to run before commit) |
| git diff scope = manifested files only | (to verify before commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **F006/F011 (`architecture.md` claims 12 tools)**: Cannot patch line 288 of a 0-byte file. `architecture.md` got emptied by parallel session activity sometime after the 014 packet shipped the original 26KB content (`1fcc5a1f5`). If the architecture content is wanted again, restore via `git show 1fcc5a1f5:.opencode/skills/system-code-graph/architecture.md` and re-commit, then this finding can be addressed in a follow-up.
2. **F012 (launcher buildIfNeeded path)**: No source change. The "old package structure name" the reviewer flagged is the actual tsc-emit directory naming (`dist/system-code-graph/mcp_server/index.js`) which matches how tsc emits when `rootDir = ".."` — directory name appears as a dist subdir. Not legacy. Implementation-summary documents this for future reviewers.
3. **F017 (source maps)**: Will resolve on next clean rebuild. No action needed.
4. **F018 (per-parameter test gaps)**: Accepted as-is per the 017 reviewer's recommendation.
5. **F001 (state file cleanup)**: Already resolved during the 017 review itself (downgraded from P1 to P2 in iteration 2).
6. **History rewrite for past commits**: Out of scope for this packet. The wrong-identity attribution on commits before this one (all today's session) would need a separate filter-branch operation + force push, which is destructive and was not requested by the user.
<!-- /ANCHOR:limitations -->
