---
title: "Cross-Skill Doc Polish — Implementation Summary"
description: "Aligned system-skill-advisor and system-code-graph with sk-doc canonical templates, fixed stale tool counts across 8 runtime/CLAUDE/AGENTS files, and added 4 reference docs for the code-graph skill."
trigger_phrases:
  - "021 cross-skill-doc-polish"
  - "code-graph SKILL polish"
  - "skill-advisor doc alignment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/005-cross-skill-doc-polish"
    last_updated_at: "2026-05-16T14:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Closed packet 021 with sk-doc alignment fixes"
    next_safe_action: "Commit on main citing packet 021"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/references/database-path-policy.md"
      - ".opencode/skills/system-code-graph/references/naming-conventions.md"
      - ".opencode/skills/system-code-graph/references/tool-surface.md"
      - ".opencode/skills/system-code-graph/references/readiness-and-scope-fingerprint.md"
      - ".opencode/skills/system-code-graph/references/ccc-bridge-integration.md"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - "opencode.json"
      - ".codex/config.toml"
      - ".claude/mcp.json"
      - ".gemini/settings.json"
      - ".devin/config.json"
      - ".vscode/mcp.json"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-cross-skill-doc-polish"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Smart Routing restructure depth → Lightweight (keep table as Resource Domains body)"
      - "_memory.continuity block in SKILL.md frontmatter → Remove now"
      - "Spec folder → 021-cross-skill-doc-polish under 005-code-graph (corrected from the 029 frontmatter claim)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-cross-skill-doc-polish |
| **Completed** | 2026-05-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Two system skills (`system-skill-advisor` and `system-code-graph`) had drifted from the sk-doc canonical templates, and the runtime configs were undercounting MCP tool surfaces by one to two tools each. This packet fixed both: the code-graph SKILL.md now follows the canonical 8-section structure with H3 RULES subsections and a proper SMART ROUTING section, the database path policy reflects the post-consolidation shared location, and four new reference docs were added to document the tool surface, readiness contract, CCC bridge, and naming conventions. Every runtime config and the canonical CLAUDE.md/AGENTS.md now agree that `mk_code_index` ships 11 tools (was claiming 10) and `mk_skill_advisor` ships 9 tools (was claiming 8).

### Tool-count drift fix

You can now trust the `_NOTE_2_TOOLS` strings in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `.devin/config.json`, and `.vscode/mcp.json`. All six list 11 code-graph tools (including `code_graph_classify_query_intent`, which was registered but undocumented in five of six configs) and 9 skill-advisor tools (the 1 internal `skill_graph_propagate_enhances` was missing from five of six). `AGENTS.md` line 355-356 (and `CLAUDE.md` via its symlink) now reflect the same counts.

### Code-graph SKILL.md restructure

The skill's SKILL.md now follows the canonical sk-doc shape. §2 SMART ROUTING gained three new subsections above the existing intent-tool table (now repurposed as Resource Domains): Primary Detection Signal, Phase Detection, Resource Loading Levels. §4 RULES became three H3 subsections — ALWAYS, NEVER, ESCALATE IF — replacing the prior flat bullet list. The non-canonical §8 NAMING NOTE was extracted to `references/naming-conventions.md`, with a 2-line summary linking to it from §7 INTEGRATION POINTS. The §9 RELATED RESOURCES merged into the canonical §8 REFERENCES AND RELATED RESOURCES. The `_memory.continuity` frontmatter block was removed; continuity state lives in this implementation-summary instead.

### Code-graph reference expansion

Three new references close gaps surfaced by the audit: `tool-surface.md` lists all 11 MCP tools with handler files and preconditions; `readiness-and-scope-fingerprint.md` explains the state machine and trust state that gate every read-path tool; `ccc-bridge-integration.md` documents when to use the three `ccc_*` tools alongside CocoIndex's `search`. The fourth addition, `naming-conventions.md`, consolidates the name asymmetry across skill slug, MCP server name, launcher, plugin bridge, and the deliberate hook-location asymmetry.

### Skill-advisor light touch

`system-skill-advisor` was already audit-clean. Three orphaned reference docs (`skill-graph-drift.md`, `skill-graph-extraction-plan.md`, `deferred-decisions.md`) are now linked from SKILL.md §5 and README.md §9 so operators can find them.

### Stale database-path-policy fix

The reference doc now points at the canonical shared path `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` instead of the pre-consolidation skill-local path. The migration record gained the second-migration entry (skill-local → shared spec-kit data dir) so future readers see the full history.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Restructured §2 SMART ROUTING (+3 subsections), §4 RULES (H3 ALWAYS/NEVER/ESCALATE IF), §7 INTEGRATION POINTS (naming summary), §8 REFERENCES (consolidated). Removed `_memory.continuity` block. Bumped version 1.0.3.1 → 1.0.3.2. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Added 4 new reference links in §9 RELATED DOCUMENTS. |
| `.opencode/skills/system-code-graph/references/database-path-policy.md` | Modified | Updated §2 POLICY to canonical shared path; added §5 second-migration record. |
| `.opencode/skills/system-code-graph/references/naming-conventions.md` | Created | Name map across skill folder, MCP server, launcher, plugin bridge, hook location. |
| `.opencode/skills/system-code-graph/references/tool-surface.md` | Created | 11-tool surface reference with handler files and preconditions. |
| `.opencode/skills/system-code-graph/references/readiness-and-scope-fingerprint.md` | Created | Readiness state machine + scope fingerprint contract. |
| `.opencode/skills/system-code-graph/references/ccc-bridge-integration.md` | Created | When to use `ccc_status`/`ccc_reindex`/`ccc_feedback` with CocoIndex. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | Linked 3 orphan references in §5. |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Linked same 3 orphan references in §9. |
| `opencode.json` | Modified | Fixed `mk_code_index._NOTE_2_TOOLS` count 10 → 11; added `classify_query_intent`. |
| `.codex/config.toml` | Modified | Same fix for both `mk_skill_advisor` (8 → 9) and `mk_code_index` (10 → 11). |
| `.claude/mcp.json` | Modified | Same fix for both servers. |
| `.gemini/settings.json` | Modified | Same fix for both servers. |
| `.devin/config.json` | Modified | Same fix for both servers. |
| `.vscode/mcp.json` | Modified | Same fix for both servers. |
| `AGENTS.md` (incl. CLAUDE.md symlink) | Modified | §6 MCP routing block: 8 → 9 (skill-advisor), 10 → 11 (code-graph). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Three parallel Explore-agent audits surfaced the issues, the user locked three design decisions (Smart Routing depth, frontmatter `_memory` removal, spec folder choice), and the edits shipped in one pass on `main` without a feature branch. Verification ran the spec-kit strict validator (PASS, 0 errors / 0 warnings), the sk-doc `package_skill.py --check` validator on both skills (PASS on both, only pre-existing kebab-case naming warnings), and a final grep sweep for stale tool-count strings (clean across all 8 files).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Lightweight Smart Routing restructure (keep tool table as Resource Domains body) | This skill is tool-keyed, not folder-keyed. Adding the canonical Python `INTENT_MODEL`/`RESOURCE_MAP` pseudocode would be ceremonial when no `references/<key>/` subfolders exist to feed it. The classifier (`code_graph_classify_query_intent`) and the schema array (`CODE_GRAPH_TOOL_SCHEMAS`) are the router authority; the table documents the surface. |
| Remove `_memory.continuity` from SKILL.md frontmatter | Continuity state belongs in the packet's `implementation-summary.md`, not in the skill's runtime contract. The block referenced a stale packet path (`029-system-code-graph-uplift`) that doesn't exist — corrected to the real parent (`026/005-code-graph/`). |
| Land work in a new phase child (`021-cross-skill-doc-polish`) | Keeps the audit work isolated from the active `019-system-code-graph-uplift-phase-parent` packet. Doc-only scope, no architectural change, Level 2 documentation. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 021-cross-skill-doc-polish` | PASS — 0 errors, 0 warnings. |
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-code-graph --check` | PASS — 9 warnings, all pre-existing kebab-case naming (out of scope to rename). |
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-skill-advisor --check` | PASS — 16 warnings, all pre-existing kebab-case naming. |
| Stale-string sweep: `grep -E 'Registers (8|10) tools\|Skill Advisor.*8 tools\|Code Graph.*10 tools'` across 6 runtime configs + AGENTS.md | PASS — zero hits. |
| Fresh-string presence: `grep -lE 'Registers (9|11) tools'` across 6 runtime configs | PASS — all 6 files have both fresh strings. |
| Code-graph SKILL.md section sequence | PASS — 1 WHEN_TO_USE → 2 SMART_ROUTING → 3 HOW_IT_WORKS → 4 RULES → 5 REFERENCES → 6 SUCCESS_CRITERIA → 7 INTEGRATION_POINTS → 8 REFERENCES_AND_RELATED_RESOURCES (canonical). |
| Code-graph §4 RULES subsections | PASS — H3 ALWAYS, NEVER, ESCALATE IF present. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **B8 `dist/` foreign-package mirroring (deferred).** `.opencode/skills/system-code-graph/dist/` builds compiled output for `system-spec-kit/` and `system-skill-advisor/` siblings. `.gitignore` keeps it out of git so this is a tsconfig smell, not a doc bug. A follow-on packet should tighten `tsconfig.json` `include` / `exclude` so the package's build only emits its own output.
2. **B10 F6 hook deprecation calendar (deferred).** `system-skill-advisor/references/deferred-decisions.md` records that the OLD hook locations have deprecation banners until 2026-08-16. Not a code change — calendar reminder to remove the banner + old paths once the 90-day window expires.
3. **Kebab-case warnings.** Both skills' reference filenames use kebab-case (`tool-surface.md`, `database-path-policy.md`), which the sk-doc validator advises should be snake_case. The kebab-case convention is consistent across the repo; renaming would be massive churn out of scope. Treat the warnings as advisory.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

