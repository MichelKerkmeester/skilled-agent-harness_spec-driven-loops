---
title: "Research Record: OpenCode v1 and v2 dual compatibility research"
description: "[What is being researched and why. 2-3 sentences naming the question, the surfaces it touches and the decision the findings inform.]"
trigger_phrases:
  - "opencode v1 v2 dual compat research spec"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "scaffold/082-opencode-v1-v2-dual-compat"
    last_updated_at: "2026-10-18T09:21:48Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-082-opencode-v1-v2-dual-compat"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: OpenCode v1 and v2 dual compatibility research

<!-- SPECKIT_LEVEL: research -->
<!--
SELF-CHECK:
- Confirm the record names the research question, the surfaces in scope, and where the findings live.
- The full findings live in research/research.md. This spec.md is the lean anchor.
FAILURE MODES:
- Restating the findings here instead of pointing to research/research.md.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | [P0/P1/P2] |
| **Status** | [In Progress/Complete] |
| **Created** | 2026-10-18 |
| **Findings** | `research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What question is being researched and why. What decision do the findings inform?]

### Purpose
[One-sentence outcome statement. What will be known when the research is done?] The findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- [Surface or question 1]
- [Surface or question 2]

### Out of Scope
- [Excluded item] - [why]
<!-- /ANCHOR:scope -->


---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- [Question requiring clarification, or "None."]
- how to make the skilled repo perfectly compatible with both opencode v1 (1.19.x) and opencode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs
- Research context: deep-research is active for this topic; `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 20 of 20 iterations (`maxIterationsReached`), with 5 of 5 key questions answered.

- Each plugin default-exports one plain object `{ id, setup, server }`. v1 1.19.3 calls `server()` and v2 2.0.32 calls `setup()`, and v2 loads flat `.opencode/plugins/*.js` files (confirmed by the orchestrator).
- `opencode.json` stays in the v1 shape. v1 refuses to start on the v2 `permissions` key, and v2 translates the v1 `permission` map one way (confirmed).
- Agent frontmatter stays in the v1 shape plus `browser: deny`. Per-agent `temperature` is not sent on v2. Agent bodies should stop naming the `Task` tool.
- Both versions register every `.md` file under the commands tree. Rename or move non-command Markdown. Skills are identical on both versions (60 ids).
- The dispatch guards fail open on `opencode2` (confirmed), and `command-flag-for-slash-prompt` blocks valid v2 runs. Detect the version from parsed `--version` output, never from the binary name.
- cli-opencode needs two invocation shapes, and every v2 child must use `run --standalone`, the only mode that passes the child environment to plugins (confirmed).
- Install: v1 and v2 go in separate npm prefixes, with an `opencode2` launcher that sets `OPENCODE_DB`. `opencode upgrade --major` removes v1 (confirmed). Homebrew carries only v2.
- Gap ledger: 47 rows. 9 are portable as-is, 21 need a mechanical change, 4 need a behavioural workaround, 9 are irreducible and 4 were never established.

Still open: `allowed-tools` semantics, `-m provider/model#variant` on v1, live v2 event delivery, `plugin.check` tolerance for extra keys, and `Tool.ValueSchema`. See `research/research.md` section 12.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
