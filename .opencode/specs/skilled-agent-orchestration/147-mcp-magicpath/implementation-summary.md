---
title: "Implementation Summary: mcp-magicpath"
description: "Vendored the MagicPath agent skill into the framework as mcp-magicpath, with a house README, schema-2 graph metadata, a CLI installer, catalog registration, and advisor-graph routing."
trigger_phrases:
  - "magicpath summary"
  - "install magicpath"
  - "mcp-magicpath"
  - "skill install summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-mcp-magicpath"
    last_updated_at: "2026-06-13T11:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped mcp-magicpath skill install and registration"
    next_safe_action: "Operator runs magicpath-ai login when ready to use it"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-magicpath/SKILL.md"
      - ".opencode/skills/mcp-magicpath/README.md"
      - ".opencode/skills/mcp-magicpath/graph-metadata.json"
      - ".opencode/skills/mcp-magicpath/scripts/install.sh"
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-147-mcp-magicpath"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Install target: framework .opencode/skills"
      - "Skill name: mcp-magicpath"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 147-mcp-magicpath |
| **Completed** | 2026-06-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

MagicPath is now a first-class skill in the framework. You can ask the agent to find, inspect, install or author MagicPath UI components, and the advisor routes the request to `mcp-magicpath`, which drives the `magicpath-ai` CLI. The skill came from the upstream `MagicPathAI/agent-skills` repo and was reshaped to fit this repository's conventions rather than dropped in raw.

### The vendored skill, restructured to the house template

The upstream content was vendored and then reshaped to pass `sk-doc`'s `package_skill.py` skill-creation standard. The upstream `SKILL.md` was 7,239 words with no house sections, which fails the standard (required sections missing, over the 5,000-word cap). So the full upstream operational body was relocated verbatim into `references/magicpath_operations.md` (nothing lost), and a lean house-template `SKILL.md` (1.8k words) was authored with the required sections: `WHEN TO USE`, `SMART ROUTING` (with detection, loading levels, and a guarded Smart Router pseudocode block), `HOW IT WORKS`, `RULES` (ALWAYS/NEVER/ESCALATE), `REFERENCES`, plus the recommended `SUCCESS CRITERIA`, `INTEGRATION POINTS`, and `RELATED RESOURCES`. The three upstream reference docs were renamed to the house snake_case convention (`cli_reference.md`, `working_with_repositories.md`, `working_with_embedded_browsers.md`). All four references were then conformed to the sk-doc reference template: 5-field frontmatter, a 1-2 sentence intro, a `## 1. OVERVIEW` section, and numbered ALL-CAPS sections; internal anchor links were rewritten to match the renumbered headings. `package_skill.py` reports the skill valid with zero warnings, `validate_document.py --type reference` passes on all four references, and the runtime lists the skill as user-invocable.

### The framework adapter layer

A house-voice `README.md` explains the skill in the standard nine sections and is honest that this is a CLI-only surface with no MCP server, so the `mcp-` prefix does not mislead. A schema-2 `graph-metadata.json` gives the advisor a node with intent signals, an `enhances` edge to `sk-code`, and a loose `related_to` link to `mcp-chrome-devtools`. The skills catalog index gained a row under External Tool Surfaces with its counts bumped.

### The CLI installer

`scripts/install.sh` makes the `magicpath-ai` command available globally, the same way `mcp-click-up` ships `cupt` and `mcp-chrome-devtools` ships `bdg`. It checks Node and npm, installs via `npm install -g magicpath-ai`, verifies the version, prints the login steps, and is idempotent on re-run. The skill also vendors the CLI in-folder via `mcp-servers/magicpath-cli/` (a `package.json` + `setup.sh` that run `npm install` into a local `node_modules`), mirroring `mcp-click-up/mcp-servers/`; this was verified by running `setup.sh` and executing the local binary (2.3.2), then cleaned back to the manifest-only convention (no committed `node_modules`). If the global binary is ever missing, the docs fall back to `npx -y magicpath-ai`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-magicpath/SKILL.md` | Created | Lean house-template runtime instructions (WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES) |
| `.opencode/skills/mcp-magicpath/references/magicpath_operations.md` | Created | Full upstream operational guide, relocated verbatim from the upstream SKILL.md body |
| `.opencode/skills/mcp-magicpath/references/cli_reference.md` | Created | Full `magicpath-ai` command reference (upstream, snake_cased name) |
| `.opencode/skills/mcp-magicpath/references/working_with_repositories.md` | Created | Repo import/recreate guidance (upstream, snake_cased name) |
| `.opencode/skills/mcp-magicpath/references/working_with_embedded_browsers.md` | Created | Embedded-browser canvas guidance (upstream, snake_cased name) |
| `.opencode/skills/mcp-magicpath/README.md` | Created | House-voice nine-section README |
| `.opencode/skills/mcp-magicpath/graph-metadata.json` | Created | Schema-2 advisor graph node |
| `.opencode/skills/mcp-magicpath/scripts/install.sh` | Created | Global `magicpath-ai` CLI installer |
| `.opencode/skills/mcp-magicpath/mcp-servers/magicpath-cli/` | Created | In-skill CLI vendor (`package.json` + `setup.sh` + code-template `README.md`), mirroring `mcp-click-up/mcp-servers/` |
| `.opencode/skills/mcp-magicpath/INSTALL_GUIDE.md` | Created | Phased install guide (sk-doc install_guide template): install paths, auth, verification |
| `.opencode/skills/mcp-magicpath/scripts/README.md` | Created | Code-folder README for the scripts directory (sk-doc readme_code template) |
| `.opencode/skills/mcp-magicpath/changelog/v1.0.0.0.md` | Created | First changelog (Initial Release), modeled on the sibling skill changelogs |
| `.opencode/changelog/mcp-magicpath` | Created | Symlink to `../skills/mcp-magicpath/changelog`, matching the other skills' changelog symlinks |
| `.opencode/skills/README.md` | Modified | Catalog row + count reconciliation to 22 (mcp-* 3->4, cli-* 4->3 stale-count fix) |
| `README.md` (repo root) | Modified | mcp-magicpath added to the MCP Integration skill list and the public-template skills table; "21 skills" -> "22 skills" (3 places) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every layer was verified before the done claim. The downloaded `SKILL.md` matched the installed copy by SHA before adaptation. The README passed the sk-doc readme validator with zero issues. The advisor `skill_graph_scan` indexed one new node with zero rejected edges, `skill_graph_validate` returned `errorCount: 0`, and `advisor_recommend` ranked `mcp-magicpath` as the top match (confidence 0.8943, uncertainty 0.12 on a clear prompt, which passes Gate 2). The installer ran to a successful global install and `magicpath-ai --version` resolved to 2.3.2 on PATH.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Named it `mcp-magicpath`, not `magicpath` | Kept the framework's family-prefix convention consistent; the operator chose the prefix over upstream parity |
| Relocated the upstream SKILL.md body to `references/magicpath_operations.md` | The upstream SKILL.md (7.2k words, no house sections) fails `package_skill.py`; moving the body into a reference preserves it 100% while letting SKILL.md be a lean, conformant house-template file under the 5k-word cap |
| Renamed references to snake_case | `package_skill.py` flags kebab-case reference names; snake_case matches the convention used by `mcp-click-up` and the other skills |
| Shipped a global installer plus an `npx` fallback | Matches how other mcp-* skills make their CLI available, while staying usable on machines without a global install |
| Corrected the `cli-* (4)` catalog drift to `(3)` | Adding mcp-magicpath surfaced a cross-file count conflict (root README said 21, catalog said 23, truth is 22). Reconciling both READMEs to the verified 22 (skill_graph checkedNodes=22) required fixing the stale cli count so the family sum is honest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py` (skill-creation standard) | PASS, "Skill is valid", 0 warnings |
| `validate_document.py --type reference` (all 4 references) | PASS, 0 issues each (frontmatter + OVERVIEW + numbered sections) |
| `validate_document.py` (scripts/README.md, magicpath-cli/README.md) | PASS, 0 issues (sk-doc readme_code template) |
| `validate_document.py` (INSTALL_GUIDE.md) | VALID; 2 non-blocking numbering notes inherent to the 0-based install_guide template (identical to mcp-click-up) |
| `validate_document.py --type changelog` (v1.0.0.0.md) | PASS, 0 issues |
| Changelog symlink resolves | PASS, `.opencode/changelog/mcp-magicpath` -> `../skills/mcp-magicpath/changelog` -> `v1.0.0.0.md` |
| Internal anchor links after renumbering (`magicpath_operations.md`) | PASS, all 5 resolve to headings |
| In-skill CLI vendor (`mcp-servers/magicpath-cli/setup.sh`) | PASS, `npm install` vendored 2.3.2, local binary ran, cleaned to manifest-only |
| Upstream body parity (relocated to `magicpath_operations.md`) | PASS, full upstream content preserved, only sibling link paths snake_cased |
| sk-doc readme validator | PASS, 0 issues |
| graph-metadata.json parse | PASS, valid JSON |
| skill_graph_scan | PASS, 1 node indexed, 0 rejected edges, embedding generated |
| skill_graph_validate | PASS, errorCount 0 (23 pre-existing warnings, none new-only) |
| advisor_recommend (clear prompt) | PASS, top match, confidence 0.82 / uncertainty 0.22, Gate 2 |
| installer + `magicpath-ai --version` | PASS, 2.3.2 on PATH, idempotent on re-run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live MagicPath operations until you authenticate.** Run `magicpath-ai login` (or `--code` for headless) before any search/inspect/add/code call. There is no offline mode.
2. **The `mcp-` prefix is organizational, not literal.** MagicPath ships no MCP server; everything goes through the `magicpath-ai` CLI. The README and graph summary say so explicitly.
3. **One pre-existing graph note remains.** Every skill, including this one, lacks a `sanitizer_version` in its derived block (a repo-wide condition that predates this packet). The catalog's stale `cli-* (4)` count was corrected to `(3)` during README reconciliation, so the skill count is now an accurate 22 across both READMEs.
<!-- /ANCHOR:limitations -->
