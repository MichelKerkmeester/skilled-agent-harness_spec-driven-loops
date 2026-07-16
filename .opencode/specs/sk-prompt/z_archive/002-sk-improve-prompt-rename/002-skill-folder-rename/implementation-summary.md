---
title: "Implementation Summary: Phase 002 Skill Folder Rename + Skill Internals"
description: "Phase 002 renamed the prompt skill folder, updated skill-local references and advisor graph keys, retargeted the changelog symlink, and rebuilt advisor state."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-06T11:00:06Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: folder renamed, 9 files updated, advisor rebuilt"
    next_safe_action: "Phase 003 opencode internals"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/README.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/changelog/sk-prompt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-skill-folder-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 002 Skill Folder Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-skill-folder-rename |
| **Completed** | 2026-05-06 |
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

The prompt skill now has its canonical folder and self-identity at `sk-prompt`, so downstream Phase 003 consumers have a real target path to point at. This phase kept the change narrow: skill-local self references, advisor graph keys, and the changelog symlink moved together, then advisor state was rebuilt immediately.

### Folder Rename And Skill Internals

The physical skill folder moved from `.opencode/skills/sk-improve-prompt/` to `.opencode/skills/sk-prompt/`. The eight listed skill-local files now use `sk-prompt` for frontmatter, skill IDs, trigger phrases, path embeds, changelog references, and fast-path prompt quality card guidance.

The changelog convention was preserved. Sibling changelog entries are symlinks, so `.opencode/changelog/sk-prompt` now points to `../skill/sk-prompt/changelog`, and the old `.opencode/changelog/sk-improve-prompt` path is gone.

### Advisor Graph Refresh

`skill-graph.json` now uses `sk-prompt` in the Phase 002 graph locations: family membership, adjacency keys and values, signal keys, and advisor enhancement references. The native advisor rebuild ran through the compiled handler after the JSON edits because the MCP tool calls were cancelled by the tool layer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-improve-prompt/` -> `.opencode/skills/sk-prompt/` | Renamed | Canonical skill folder moved to the new name |
| `.opencode/skills/sk-prompt/SKILL.md` (453 lines) | Modified | Frontmatter `name:` now reads `sk-prompt` |
| `.opencode/skills/sk-prompt/README.md` (368 lines) | Modified | Skill title, trigger phrase, overview, and structure refs moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/graph-metadata.json` (151 lines) | Modified | `skill_id`, key files, entity names, and path refs moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` (119 lines) | Modified | Fast-path card self references moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/references/depth_framework.md` (444 lines) | Modified | DEPTH reference self reference moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/changelog/v1.0.0.0.md` (9 lines) | Modified | Historical skill self reference moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` (28 lines) | Modified | Historical path refs moved to `sk-prompt` |
| `.opencode/skills/sk-prompt/changelog/v1.2.0.0.md` (31 lines) | Modified | Historical path refs moved to `sk-prompt` |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` (366 lines) | Modified | Advisor graph keys and values moved to `sk-prompt` |
| `.opencode/changelog/sk-prompt` | Created symlink | Points to `../skill/sk-prompt/changelog` |
| `.opencode/changelog/sk-improve-prompt` | Removed symlink | Old dangling changelog path removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The change was delivered as a mechanical rename plus literal replacement in the scoped files. `git mv` was attempted first but the sandbox blocked `.git/index.lock`; the physical move was completed with `mv`, which leaves Git to detect delete/add until staging is available.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Preserve existing user edits in scoped files | `graph-metadata.json` and `skill-graph.json` already had unrelated Phase 001/adjacent edits; Phase 002 layered only the prompt-skill rename on top. |
| Retarget the changelog symlink | Sibling skills use `.opencode/changelog/<skill>` symlinks, so `sk-prompt` should keep that convention. |
| Use compiled advisor rebuild handler | MCP calls were cancelled by the tool layer; the compiled handler is the local equivalent and returned a generation bump. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `ls .opencode/skills/sk-improve-prompt/` | PASS before rename; folder existed. |
| `git mv .opencode/skills/sk-improve-prompt .opencode/skills/sk-prompt` | FAIL due sandbox: `Unable to create .../.git/index.lock: Operation not permitted`. |
| `mv .opencode/skills/sk-improve-prompt .opencode/skills/sk-prompt` | PASS; physical folder rename completed. |
| `rg -n "sk-improve-prompt" .opencode/skills/sk-prompt .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | PASS; exit 1 with no matches. |
| `jq . .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | PASS; JSON parsed successfully. |
| `sed -n '1,12p' .opencode/skills/sk-prompt/SKILL.md` | PASS; frontmatter shows `name: sk-prompt`. |
| `ls -l .opencode/changelog/sk-prompt .opencode/changelog/sk-improve-prompt` | PASS; `sk-prompt -> ../skill/sk-prompt/changelog`, old path absent. |
| `node --input-type=module ... handleAdvisorRebuild({ force: true })` | PASS; final rebuild true, generation `1213 -> 1214`, freshness `stale -> live`. Warnings remain for Phase 003 references outside this scope. |
| `node --input-type=module ... handleAdvisorStatus(...)` | PASS; freshness `live`, generation `1214`. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-prompt` | PASS; scanned 1 file, 0 findings, 0 warnings, 0 violations. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/002-skill-folder-rename --strict` | PASS; Errors: 0, Warnings: 0, `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **MCP tool calls were unavailable.** `memory_match_triggers`, `advisor_status`, and `advisor_rebuild` were cancelled by the tool layer, so the advisor rebuild and status verification used the compiled local handler.
2. **Phase 003 references still exist.** Advisor rebuild diagnostics still mention `sk-improve-prompt` in out-of-scope files such as `deep-agent-improvement/graph-metadata.json` and `skill_advisor/graph-metadata.json`; these are intentionally left for Phase 003.
3. **Git rename staging is not available in this sandbox.** The physical rename is complete, but `git mv` could not write `.git/index.lock`.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
