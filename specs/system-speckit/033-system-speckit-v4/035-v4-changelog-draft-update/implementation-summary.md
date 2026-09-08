---
title: "Implementation Summary: v4 changelog draft update"
description: "What changed in the v4.0.0.0 changelog draft, which confirmed drift rows were applied, and how the result was checked."
trigger_phrases:
  - "changelog draft update summary"
  - "v4 release notes corrections applied"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/035-v4-changelog-draft-update"
    last_updated_at: "2026-09-08T20:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Applied the confirmed corrections to the draft and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-v4-state-inventory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: v4 changelog draft update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:status -->
## 1. STATUS

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Input** | `../034-v4-state-inventory-research/research/confirmed-drift.md` |
| **Output** | `../CHANGELOG-v4.0.0.0.md`, 451 lines, rewritten to HVR |
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:changes -->
## 2. WHAT CHANGED

- Whole-document rewrite to the human voice rules in a direct, lightly promotional register: 130 em dashes and 63 prose semicolons removed, Oxford list commas dropped, active voice and direct address throughout, headings kept, `&nbsp;` and `---` structure kept.

- Intro and at-a-glance: memory commands named as retired, `/design:*` in place of `/interface:*`, six hubs, goals scoped to OpenCode, Cursor and Pi, a new bullet for the spec-kit work.
- Spec Kit section: the memory-engine and dark-flags subsections replaced by four new ones (memory database retired, runtime renamed and nested, completion gate coherence with forty rules and the acceptance-criteria and goal addons, three simplification rounds and the findings closure); template count corrected to 1,275; CI mirror parity and Dependabot zero in the closing paragraph.
- sk-doc: fourteen modes, `sk-create-diagram` replaced by `sk-create-repo-rule`, `/doc:quality` alias removed, diagrams and charts pointed at `/design:*`.
- Deep loops: alignment subsection deleted, seven ledger modes, six registry modes.
- Hooks: `SYSTEM_HOOKS_DISABLED`, 102 symlinks, twenty-two concerns. Goals: resync rule added. Pi: `pi-subagents` directive described as removed.
- Design: three `/design:*` commands with the chart catalog and diagram types; unreproduced corpus and speed numbers dropped.
- sk-code: mobile-cli and obsidian surfaces added; unreproduced benchmark numbers softened.
- Git: numbered `worktrees/` and `branches/` grammar, owner-first rejected.
- Prompt section rewritten as a standalone skill behind `/prompt:improve`.
- MCP tooling: nine modes, Notion and MagicPath listed.
- Upgrade notes: renames, repoints, removed surfaces and defaults corrected and extended.
<!-- /ANCHOR:changes -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

- `rg -n 'memory_search|/interface|alignment|prompt-models|/prompt-improve|sk-create-diagram|MK_HOOKS|ninety-six|NNNN|1,314|/doc:quality|pi-subagents|eight modes' ../CHANGELOG-v4.0.0.0.md` returns only lines that describe a removal or a correction.
- Parent `validate.sh --strict` first verdict PASSED with this child present.
- `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py ../CHANGELOG-v4.0.0.0.md`: em dashes 130 to 0, prose semicolons 63 to 0. The 31 remaining `;` hits are all `&nbsp;` entities at column 6. Soft flags left: `craft` as the noun in "prompt craft", and a handful of common verbs.
<!-- /ANCHOR:verification -->
