---
title: "Implementation Summary: Devin manual-testing playbook"
description: "Authored the cli-devin manual-testing playbook package: 20 DV-NNN scenarios across nine categories, grounded in this session's live-probed Devin facts rather than a blind port of a sibling CLI's categories."
trigger_phrases:
  - "devin manual testing playbook summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook"
    last_updated_at: "2026-07-27T14:44:27Z"
    last_updated_by: "claude"
    recent_action: "Authored 20 DV-NNN scenarios across nine categories."
    next_safe_action: "Execute the scenarios once devin auth is operator-completed."
    blockers: []
    key_files: ["manual-testing-playbook.md", "hooks/", "subagents/", "commands-and-skills/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "PreToolUse still fires under --permission-mode bypass, so guard coverage survives the mode this repo dispatches with; only PermissionRequest is skipped."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-devin-manual-testing-playbook |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `cli-devin` manual-testing playbook package, which until now was an empty directory holding only a `.gitkeep` despite this phase existing to author it. It follows the split-document pattern the sibling CLI playbooks use: a root index acting as operator directory and review protocol, plus one file per scenario inside category folders.

20 scenarios (`DV-001`–`DV-020`) across nine categories:

| Category | Scenarios | Focus |
|---|---|---|
| `cli-invocation/` | 4 | Default `devin -p` dispatch, availability probe, hallucination fixture, the `smart` permission-mode doc/runtime mismatch |
| `subagents/` | 4 | Built-in profile dispatch, mirrored roster-agent dispatch, roster enumeration, missing-profile negative case |
| `hooks/` | 3 | Confirmed-firing event matrix, `PermissionRequest` auto-vs-bypass, and `PreToolUse` still firing under bypass |
| `commands-and-skills/` | 3 | `devin skills list` roster, mirrored-command invocation, the unquoted-colon YAML regression |
| `permission-modes/` | 2 | Behavior across `auto` / `accept-edits` / `bypass` / `autonomous --sandbox` |
| `rules/` | 1 | `devin rules list`/`paths` confirming Cursor + Claude + Standard rule inheritance |
| `mcp-integration/` | 1 | `devin mcp` surface |
| `session-continuity/` | 1 | Resume/continue behavior |
| `cloud-handoff/` | 1 | `/handoff` surface |

The `cli-cursor` playbook also gained a new `agents-skills-rules/` category (`CU-022`–`CU-025`): agent-roster enumeration, a real mirrored-agent dispatch, command-roster invocation, and mirror integrity — the last asserting every `.cursor/agents/*.md` is a symlink resolving into `.claude/agents/` rather than a forked real file.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored by a GPT-5.6-LUNA (xhigh) agent dispatched via `cli-codex`, briefed exclusively with facts live-probed earlier in the same session — permission-mode aliases, the six confirmed-firing hook events, the agent and command roster contents, and the rules-inheritance chain. The brief explicitly forbade inventing observed results, so scenarios state what an operator should run and expect rather than asserting outcomes nobody witnessed.

The dispatch was cut off by a 10-minute timeout partway through the spec-doc pass, so the playbook content landed but this summary did not. It was written afterwards, after verifying the scenario inventory and spot-checking scenario quality against the sibling template.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Author Devin-native categories rather than port a sibling's | Devin's permission model, subagent system and skills-as-slash-commands surface have no clean analog in the Codex or Cursor category sets; a verbatim port would fabricate coverage for capabilities Devin does not have in that shape. |
| Dedicate a scenario to `PreToolUse` firing under `bypass` | The intuitive reading of "bypass" is that it disables hooks. It does not, and this repo dispatches in that mode, so an untested assumption there would be a silent enforcement gap. |
| Keep a scenario for the unquoted-colon YAML defect | That defect silently hid 12 of 36 commands from Devin's parser while lenient parsers accepted them. It is a recurrence-prone class, not a one-off. |
| Require isolated temp workspaces for config-mutating scenarios | Mirrors the sibling precedent and prevents a test run from touching the repo's live `.devin/hooks.v1.json`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package structure | PASS: root index plus nine category folders, 21 files total, matching the sibling split-document pattern |
| Scenario IDs | PASS: `DV-001`–`DV-020` contiguous and unique; `DV` prefix follows the two-letter sibling convention (CU/CX/CO/CC) |
| Grounding | PASS: spot-checked scenarios cite the session's live-probed facts; none assert an unobserved live result |
| Cursor additions | PASS: `CU-022`–`CU-025` continue the existing numbering without collision |
| Phase validation | PASS: `validate.sh --strict` 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No scenario has been executed.** This phase authored the contract; it did not run it. Execution needs `devin auth login`, an operator-only interactive OAuth flow. Every scenario is therefore unexecuted-but-runnable, and the playbook's own PASS/FAIL/SKIP discipline applies once an operator runs them.
2. `cloud-handoff/` is a single documentation-oriented scenario. `/handoff` transfers a session to a cloud VM, which is not safely reversible in a test run, so it is expected to be recorded SKIP with a named blocker rather than executed.
3. Scenario counts are lighter than the largest siblings (cli-opencode carries far more scenario references). The nine categories cover Devin's actual documented surface; padding to match a sibling's raw count would have meant inventing coverage.
<!-- /ANCHOR:limitations -->
