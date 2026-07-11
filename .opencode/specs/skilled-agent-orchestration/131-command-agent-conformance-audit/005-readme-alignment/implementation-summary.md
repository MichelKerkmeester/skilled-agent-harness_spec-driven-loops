---
title: "Implementation Summary: Phase 5: Align Repo READMEs With Current Reality"
description: "All 5 confirmed-stale changed-surface targets fixed, CMD-09 cross-checked as already-landed by phase 002, and a bounded broader sweep across 58 in-scope README files fixed 6 additional genuine defects surfaced during the sweep (stale /prompt invocation, broken links, naming drift, a missing agent entry, a duplicate-link bug)."
trigger_phrases:
  - "implementation"
  - "summary"
  - "readme alignment summary"
  - "005-readme-alignment implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/005-readme-alignment"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed 11 READMEs, swept 58 in-scope files, 0 retired-name regressions"
    next_safe_action: "006 closeout: roll up parent, refresh changelog entry for phase 005"
    blockers: []
    key_files:
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/mcp-code-mode/README.md"
      - ".opencode/bin/README.md"
      - ".opencode/agents/README.txt"
      - ".claude/agents/README.txt"
      - ".opencode/commands/README.txt"
      - ".opencode/commands/create/README.txt"
      - ".opencode/commands/speckit/README.txt"
      - ".opencode/skills/sk-doc/README.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full ~370-README universe swept or changed-surface only? Changed-surface set fixed first, then a bounded 58-file broader sweep (13 hub/index + 31 mode-packet + 5 command-index + 1 top-level + 2 agent + 6 misc-root READMEs), individually read or grep-swept; remaining ~321 deep per-dir dev-note READMEs pattern-grepped clean but not individually read (see Known Limitations)."
      - ".codex/agents/ (.toml) sibling removed from both agent README.txt files, per phase 004's operator-confirmed REMOVE decision (AGT-05)."
---
# Implementation Summary: Phase 5: Align Repo READMEs With Current Reality

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-readme-alignment |
| **Completed** | 2026-07-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Aligned the repo's authored READMEs to the corrected command/agent/skill surface phases 002-004 produced. Fixed the 5 confirmed-stale changed-surface targets from research.md, cross-checked CMD-09 as already landed by phase 002 (no re-fix needed), and ran a bounded broader sweep across 58 in-scope README files (13 hub/index + 31 mode-packet + 5 command-index + 1 top-level + 2 agent + 6 misc-root) that surfaced and fixed 6 additional genuine defects beyond the original research.md finding list.

### Confirmed-stale changed-surface fixes

**Install-guide "Current Skills" catalog** (`install_guides/README.md:884-896`) — the 9-row flat table with retired pinned versions (`mcp-code-mode v1.0.7.0`, `system-spec-kit v2.2.26.0`, `mcp-chrome-devtools v1.0.7.0`) and missing hubs (sk-design, system-code-graph, system-deep-loop, system-skill-advisor, mcp-click-up, mcp-figma) is now a 12-row Hub/Modes/Purpose table matching every hub verified on disk via `ls .opencode/skills/`, with no pinned version numbers to go stale again.

**mcp-code-mode Related-Skills table** (`mcp-code-mode/README.md:136-144`) — added the missing `mcp-figma` row and reframed all three rows under the `mcp-tooling/` hub prefix with a lead-in sentence, matching the confirmed hub-owns-mode topology.

**bin/README.md naming** (`bin/README.md:168`) — this was NOT a `system-speckit`/`system-spec-kit` naming typo as research.md assumed. Investigation confirmed `.opencode/specs/system-speckit/` (no hyphen) is the correct on-disk spec-track name, distinct from the skill folder `.opencode/skills/system-spec-kit/` (hyphenated) the other 6 hits correctly reference. Renaming to `system-spec-kit` would have pointed the reference at a path that does not exist. The real defect was a stale packet number (`030-...` does not exist on disk); fixed to the current re-nested path `system-speckit/028-memory-search-intelligence/002-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement`, confirmed to exist.

**Both agent README.txt files** (`.opencode/agents/README.txt:8`, `.claude/agents/README.txt:8`) — removed the `.codex/agents/ (.toml)` sibling-runtime claim per phase 004's operator-confirmed REMOVE decision (AGT-05); `.codex/agents` grep across both files now returns 0. Also fixed a genuine gap found in the same enumeration: both files were missing the `design` agent (a 12th live agent on disk in both `.opencode/agents/` and `.claude/agents/`, confirmed via `ls`), added between `deep-review` and `markdown`, matching top-level README.md's "12 custom specialist agents" claim.

### CMD-09 cross-check

Verified `folder_readme.md` and `create_agent_verified` are already fully remediated by phase 002 (`grep` returns 0 hits for both across the 3 readme-workflow asset files; `create_readme_verified` present at all 4 sites). No re-fix needed — this was a cross-check per the dispatch contract, not a re-fix task.

### Broader sweep: 6 additional genuine defects found and fixed

1. **Stale `/prompt` invocation (7 files, 8 sites total).** The command file `commands/prompt.md` was renamed to `commands/prompt-improve.md` in commit `5afd2f6522`; the command's own body self-documents `/prompt-improve` at 3 internal sites (README, argument-hint, closing example), but `README.md` (top-level, 2 sites), `commands/README.txt` (5 sites: intro example, root-group table, Root Commands table, instructions prose, usage example) and `cli-external/cli-claude-code/README.md` (1 site) still said `/prompt`. Fixed all 8 sites to `/prompt-improve`. Left CLAUDE.md and ~40 other repo-wide non-README references untouched — see Known Limitations.
2. **Dead `/deep:context` reference** — `commands/README.txt`'s STRUCTURE tree listed `deep/context.md` as a live command file; git history confirms it was deleted in commit `a73c78e655`, superseded by the `@context` agent (per CLAUDE.md's own Quick Reference). Removed the entry and corrected the deep-group count from 8 to 7.
3. **Missing `/goal_opencode` root command** — `commands/README.txt` documented only 2 of the 3 root-level command files (`agent_router.md`, `prompt-improve.md`), omitting `goal_opencode.md` entirely from the OVERVIEW table, STRUCTURE tree, and Root Commands table, despite it being a real, live command already documented correctly in top-level `README.md`'s own Goal Plugin section. Added it in all three places; root count corrected 2 -> 3.
4. **Incomplete Doctor Commands table** — `commands/README.txt` listed only 2 of `doctor/`'s 3 command files (`mcp.md`'s `debug`/`install` verbs), omitting the `/doctor <target>` router (backed by `doctor/speckit.md`, confirmed via its own frontmatter description "Router for /doctor <target>") and `/doctor:update`. Added both rows, matching top-level README.md's existing accurate Doctor section.
5. **3 broken relative links + a naming-drift bug in `speckit/README.txt`** — the folder is `speckit/` (no underscore) and its YAML assets are `speckit_*.yaml`, but the file repeatedly said `spec_kit/` and `spec_kit_<command>_auto.yaml` (5 sites) — fixed to match the on-disk folder and file names. Also fixed 3 broken relative links: `../README.md` -> `../README.txt` (parent index does not have a `.md` variant), `../../skill/system-spec-kit/SKILL.md` -> `../../skills/system-spec-kit/SKILL.md` (typo: singular "skill"), `../memory/README.md` -> `../memory/README.txt`.
6. **Duplicate-link bug in `sk-doc/README.md`** — two adjacent Related Documents rows both linked to `create-readme/references/README.md`, one correctly labeled "README creation workflow and standards," the other mislabeled "Five-phase install guide standards and validation checkpoints" while pointing at the same wrong target. Retargeted the second row to the real install-guide reference file, `create-readme/references/install_guide/quality_and_standards.md`.

Also fixed a smaller duplicate-entry bug in `commands/create/README.txt`'s troubleshooting table (`.opencode/agents/` listed twice, `.claude/agents/` once, no `.codex/agents/` — a leftover from the AGT-05 removal elsewhere in the repo) — corrected to list each runtime path once.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/install_guides/README.md` | Modified | Confirmed-stale: rewrote "Current Skills" catalog to hub-owns-mode topology, 12/12 hubs |
| `.opencode/skills/mcp-code-mode/README.md` | Modified | Confirmed-stale: added `mcp-figma` row, reframed under `mcp-tooling` hub |
| `.opencode/bin/README.md` | Modified | Confirmed-stale (deviated from literal REQ-003): fixed stale spec-folder packet path, not a naming typo |
| `.opencode/agents/README.txt` | Modified | Confirmed-stale: removed `.codex/agents` claim (AGT-05 REMOVE); added missing `design` agent |
| `.claude/agents/README.txt` | Modified | Confirmed-stale: removed `.codex/agents` claim (AGT-05 REMOVE); added missing `design` agent |
| `.opencode/commands/README.txt` | Modified | Broader sweep: deep count 8->7 (dead context.md removed), added `goal_opencode.md` (root 2->3), 5x `/prompt`->`/prompt-improve`, fixed broken Prompt Command link, expanded Doctor Commands table |
| `README.md` (top-level) | Modified | Broader sweep: 2x `/prompt`->`/prompt-improve` |
| `.opencode/skills/sk-doc/README.md` | Modified | Broader sweep: fixed duplicate-link bug in Related Documents (install-guide reference row) |
| `.opencode/skills/cli-external/cli-claude-code/README.md` | Modified | Broader sweep: `/prompt`->`/prompt-improve` in agent table |
| `.opencode/commands/create/README.txt` | Modified | Broader sweep: fixed duplicate `.opencode/agents/` entry in troubleshooting table |
| `.opencode/commands/speckit/README.txt` | Modified | Broader sweep: 5x `spec_kit`->`speckit` naming drift, 3 broken relative links |
| `.opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/005-readme-alignment/{spec,tasks}.md` | Modified | Status set to Complete; all tasks marked with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read spec.md/plan.md/tasks.md and research.md §7 first, confirmed all three predecessor phases (002/003/004) show Status=Complete, and confirmed phase 004's AGT-05 operator decision (REMOVE) directly from its `implementation-summary.md` before touching either agent README.txt. Fixed the 5 confirmed-stale targets first (re-confirming every cited line/version/path against the live file before editing, since research.md's own citations were flagged as possibly drifted). Cross-checked CMD-09 against the live files (0 hits for both dead patterns) rather than re-fixing already-landed work.

For the broader sweep: ran the scoped `find` inventory from plan.md Phase 2 (379 files, excluding node_modules/.worktrees/dist/.venv/__pycache__/.opencode-specs/z_archive), classified hits against spec.md §3's In Scope categories, then worked the confirmed in-scope set: read the top-level README.md and `skills/README.md` in full; read all 12 hub READMEs in full; grep-swept all 31 mode-packet READMEs for retired-name/stale-`/prompt`/CMD-09 patterns and spot-read 3 in full; read all 4 named command-index READMEs plus `create/readme.md` in full; read the 2 already-fixed agent READMEs; grep-swept 6 more top-level `.opencode/{hooks,plugins,bin,scripts,install_guides}` READMEs (including two one-level-deep siblings). Every fix beyond the confirmed-stale set was independently discovered during this read-through (not pre-listed in research.md) — each was verified against a primary source (git history, the command file's own self-documented invocation, `ls` on the actual filesystem) before editing, never assumed from surrounding prose. A final repo-wide grep for the classic retired-name pattern (`cli-codex|cli-gemini|cli-devin|mcp-magicpath`) across the full 379-file universe (z_archive/specs excluded by design) confirmed 0 hits, including the one expected exception inside `z_archive/cli-codex-retired/README.md` (an archived skill's own retirement record, correctly out of scope).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Did NOT rename `system-speckit` to `system-spec-kit` on `bin/README.md:168` despite REQ-003's literal wording | Ground-truth check (`ls .opencode/specs/system-speckit` vs `ls .opencode/specs/system-spec-kit`) proved the hyphen-free form is the correct on-disk spec-track name; blindly renaming would have broken a working reference into a non-existent path. Fixed the actual defect (stale packet number) instead and documented the deviation. |
| Fixed `/prompt` -> `/prompt-improve` in-scope README files, left ~47 out-of-scope repo files (including CLAUDE.md and command bodies) untouched | The command's own body confirms `/prompt-improve` is the live invocation (3 self-documenting sites), so this is a real, confirmed defect — but fixing the out-of-scope files would exceed the doc-only README SCOPE LOCK (command bodies, project instructions) this phase's spec.md explicitly forbids touching. Documented as a deferred cross-cutting finding instead of silently leaving it or silently exceeding scope. |
| Treated CMD-09 as verify-only, not re-fix | Dispatch contract explicitly frames this as "a cross-check, not a re-fix"; phase 002's own `implementation-summary.md` documents the fix with evidence, and a live re-grep confirmed 0 residual hits. |
| Added the missing `design` agent to both README.txt files even though AGT-05 didn't name it | It's a genuine, separate gap in the same enumeration already being edited for the confirmed AGT-05 fix (both files list only 11 of the 12 live on-disk agents) — fixing it here avoids leaving a known-stale line untouched in a file already open for editing on the same section. |
| Did not individually read the ~321 deep per-dir dev-note READMEs (mcp_server/**, scripts/**, tests/**, etc.) | Explicitly out of scope per spec.md §3 ("deep per-dir dev-note READMEs that track code not surface") and the dispatch contract's bounded-sweep instruction; the repo-wide pattern grep (0 hits) provides confidence without the cost of an exhaustive read. Logged honestly below rather than silently claiming full coverage. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SC-001 `grep -rEn "cli-codex\|cli-gemini\|cli-devin\|mcp-magicpath"` across in-scope READMEs | PASS, 0 hits |
| SC-001 same pattern across the full 379-file README universe (z_archive/specs excluded) | PASS, 0 hits (the 1 expected exception, `z_archive/cli-codex-retired/README.md`, is out of scope by design and was excluded from this count) |
| REQ-001 `grep -n "v1.0.7.0\|v2.2.26.0" install_guides/README.md` | PASS, 0 hits |
| REQ-003 `grep -c "mcp-figma" mcp-code-mode/README.md` | PASS, 1 hit |
| REQ-003 (deviated) `ls -d .opencode/specs/system-speckit/028-.../050-.../001-dist-freshness-enforcement` | PASS, path exists on disk |
| REQ-004 `grep -n "\.codex/agents" .claude/agents/README.txt .opencode/agents/README.txt` | PASS, 0 hits both files |
| REQ-004 both README.txt agent enumerations list 12/12 on-disk agents | PASS, `design` added to both, byte-identical enumeration |
| REQ-005 (CMD-09) `grep -rn "folder_readme.md"` over the 2 YAMLs | PASS, 0 hits (already landed by phase 002) |
| REQ-005 (CMD-09) `grep -rln "create_agent_verified"` over the 3 readme-workflow assets | PASS, 0 hits (already landed by phase 002) |
| Broader sweep `grep -nE '/prompt\b'` across in-scope READMEs, excluding `/prompt-improve`/`/prompt-models` | PASS, 0 residual hits post-fix |
| Broader sweep `grep -n "spec_kit" speckit/README.txt` | PASS, 0 hits post-fix |
| Broader sweep link targets (`../README.txt`, `../../skills/system-spec-kit/SKILL.md`, `../memory/README.txt`) | PASS, all 3 confirmed to exist via `ls` |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` | PASS, exit 0, `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` (44 checks green, including SCAFFOLD_NEVER_TOUCHED, EVIDENCE_CITED, GENERATED_METADATA_DRIFT, and CONTINUITY_FRESHNESS, after `generate-description.js` + `backfill-graph-metadata.js` regen) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ~321 deep per-dir dev-note READMEs were pattern-grepped, not individually read.** Files under `mcp_server/**`, `scripts/**`, `tests/**`, `benchmark/**`, `references/**`, `assets/**`, `shared/**` (nested 2+ levels under each hub) were covered by the repo-wide retired-name grep sweep (0 hits) but not read line-by-line for subtler drift (broken relative links, stale counts). This is an explicit, honest deferral per the dispatch contract's bounded-sweep instruction, not a silent gap.
2. **The confirmed `/prompt` -> `/prompt-improve` fix is scoped to in-scope README files only.** Approximately 47 other repo files still reference the stale `/prompt` invocation, including `AGENTS.md` (project root), `commands/deep/model-benchmark.md` and `commands/deep/agent-improvement.md` (command bodies), several `presentation.txt` assets, historical changelog entries (correctly left as historical record), and 4 files under `cli-external/cli-opencode` and `cli-external/cli-claude-code` `SKILL.md`/`references/`. Fixing these is out of this doc-only phase's SCOPE LOCK (command bodies, project instructions, non-README reference docs) — flagged here for an operator-directed follow-up, not silently fixed or silently ignored.
3. **This phase edits documentation prose only.** No SKILL.md logic, command YAML behavior, agent bodies, or scripts were touched, per the hard scope lock in spec.md §3.
<!-- /ANCHOR:limitations -->
