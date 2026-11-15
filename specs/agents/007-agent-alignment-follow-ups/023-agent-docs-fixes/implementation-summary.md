---
title: "Implementation Summary"
description: "Every doc that phase 20 found describing the agents wrongly now matches the files: eight agent trees in every runtime list and table, the thought status, the real tool lines and agent classes, and citations that land on their rules."
trigger_phrases:
  - "agent docs fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/023-agent-docs-fixes"
    last_updated_at: "2026-11-15T17:50:57Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Build phase 024, the terminal gates script"
    packet_purpose: "Purpose: A reader who opens any of these docs learns where the agents live, how they sync and what they do, as the files show today."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:06805dc6080947e713b25de86b15b501191b24b5e0f44efc7c9eb9c142de9f17"
      session_id: "scaffold-023-agent-docs-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T17:50:57Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-agent-docs-fixes |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader who opens the root README, the crosswalk, `CROSS-CLI.md`, the agents README or either deep-loop skill now learns that eight trees ship the agents and which are generated, forked or linked. The status, tool and dispatcher notes match the agent files, and the playbook citations land on the rules they name.

### Phase 23: agent-docs-fixes

Every phase 20 doc finding is now closed:

| Finding | Outcome |
|---------|---------|
| A1 `README.md` runtime list | Fixed: names the generated, forked and linked trees |
| A2 crosswalk "six trees" | Fixed: eight trees in the opening, the tree table and every per-key table |
| A3 `CROSS-CLI.md` canonical list | Fixed: adds the DSH and Vibe copies |
| A4 `.skilled/agents/README.txt` | Fixed: four generated trees; the fork and the links |
| A5, B5 doctor roster check | Fixed in phase 22 |
| A6 deep-loop skill path lines | Fixed: no Copilot tree; points at the crosswalk |
| B1 crosswalk subagent count | Fixed in phase 22: ten subagents and one primary once markdown became a subagent |
| B2, B3 `.vibe/SYNC.md` | Fixed: `README.txt`; `mode` travels as `agent_type` on ten profiles |
| B4 mirror check header comment | Fixed: `.skilled/agents` is the source, `.opencode` links to it |
| B6 WebSearch grant | Fixed in phase 22 |
| D1 deep-review status enum | Fixed in the skill and in `loop-state-and-gates.md` |
| D2 deep-research tool line | Fixed: points at the permission map instead of a list that drifts |
| D3 `claude-tools.md` agent classes | Fixed: one primary, ten subagents, with each command that dispatches one |
| D4 "read-only on code" | Fixed: "changes no code", the reading that holds |
| E1, E2 sandboxes | Fixed in phase 22 |
| E3, E4 citations | Fixed: `:425-465` and `:40`, the lineage-only E4 confirmed first |
| E5 `speckit.toml` path | Fixed: removed from the inspect list; the evidence block that records it missing stays |

Two doctor docs that still described the old roster check were fixed too: the doctor scripts README and `doctor-runtime-mirrors.yaml`. The council name drift left open by phase 16 needed no edit: `deep-ai-council.md` now appears only in generated index files, not in any live doc.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/agent-mirror-crosswalk.md` | Modified | Eight trees |
| `README.md`, `.skilled/CROSS-CLI.md`, `.skilled/agents/README.txt` | Modified | Runtime lists; Deep Review wording |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.../deep-review/SKILL.md` | Modified | Path lines; status enum |
| `.skilled/bin/check-agent-mirror-sync.cjs` | Modified | Header comment |
| `.vibe/SYNC.md` | Modified | README name, mode table, role sentence |
| `.../deep-review/references/protocol/loop-state-and-gates.md`, `.../deep-research/README.md`, `.../cli-claude-code/references/claude-tools.md` | Modified | Status enum, tool line, agent classes |
| Two deep-research playbook pages, one system-spec-kit playbook page | Modified | Citations |
| `.skilled/commands/doctor/scripts/README.markdown`, `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | Roster check wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was re-measured against the tree after phase 22, because merges and phase 22's frontmatter edit had moved lines. DeepSeek V4.1 Flash at `--thinking max` through cli-pi applied the edits in three parallel dispatches on disjoint files, each brief giving the facts and the exact text. The conductor read every diff, checked each new citation against the agent file, ran `node --check` on the commented script and parsed the doctor YAML.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Point the deep-research tool line at the permission map instead of listing tools | A copied list drifted once already; the map is the one place the tools are declared |
| Fix D4 by wording rather than record no fix | "Changes no code" is the reading that holds, and the old phrase read as a tool claim |
| Leave two general runtime counts alone | They count runtimes, not agent trees, and whether DSH and Vibe count as full runtimes is a product claim not checked here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 search over the in-scope agent docs | PASS: no agent-tree count of five or six, no Copilot tree |
| E3 and E4 citations | PASS: line 40 is the no-recovery rule; `## 6. RULES` spans 425 to 465 |
| `node --check .skilled/bin/check-agent-mirror-sync.cjs` | PASS |
| YAML parse of `doctor-runtime-mirrors.yaml` | PASS |
| `check-agent-mirror-sync.cjs` | PASS: 11 agents in sync |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two general runtime counts stay.** `.skilled/CROSS-CLI.md:18` says six runtime directories and `README.md:184` says six runtimes, while `.dsh` and `.vibe` also exist. They count runtimes rather than agent trees, so they need a decision on whether DSH and Vibe are full runtimes before they change.
2. **Citations move on the next agent edit.** The playbook line citations are correct today and will drift with the next edit above them.
<!-- /ANCHOR:limitations -->

---
