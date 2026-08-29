---
title: "Tasks: CLI and MCP transport playbook remediation"
description: "Ordered tasks: measure fourteen roots, remediate by class, route the grader defect to the grader, revert the workaround, re-measure."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cli and mcp transport playbook remediation tasks"
  - "transport playbook per-root tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code/031-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-code/031-playbook-family-remediation/002-cli-and-mcp-transports"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the transport tasks; fourteen roots re-measured at zero"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration"
      - ".opencode/skills/mcp-tooling"
    session_dedup:
      fingerprint: "sha256:8d4dedbfa8aa6d66a94b9264e4b2347e3ad7c35fd425b12560ceea2845bb463e"
      session_id: "2026-08-29-sk-code-031-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: CLI and MCP transport playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Measure each of the six CLI orchestration roots with its own `--package <root> --strict` run. Evidence: `cli-opencode` 306, `cli-claude-code` 301, `cli-devin` 226, `cli-cursor` 168, `cli-codex` 163, `cli-pi` 157, for 1,321 across the family.
- [x] T-002 Measure each of the eight MCP tooling roots the same way. Evidence: `mcp-figma` 126, `mcp-mobbin` 126, `mcp-chrome-devtools` 117, `mcp-refero` 115, `mcp-click-up` 112, `mcp-aside-devtools` 105, `mcp-notion` 103, `mcp-obsidian` 33, for 837 and a phase total of 2,158.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Remediate the six CLI orchestration roots by violation class. Evidence: final census `PASS package=cli-external-orchestration/cli-opencode scenarios=55 categories=13 violations=0` and the same shape for `cli-claude-code` 52 across 12, `cli-codex` 42 across 11, `cli-cursor` 40 across 13, `cli-pi` 37 across 11, `cli-devin` 35 across 11.
- [x] T-004 Remediate the eight MCP tooling roots by violation class. Evidence: final census `violations=0` for `mcp-click-up` 44 across 10, `mcp-notion` 33 across 8, `mcp-chrome-devtools` 30 across 7, `mcp-obsidian` 30 across 6, `mcp-aside-devtools` 29 across 8, `mcp-mobbin` 18 across 6, `mcp-figma` 17 across 6, `mcp-refero` 17 across 5.
- [x] T-005 Classify the `mcp-notion` link violations as a grader defect and route the durable fix out of this phase. Evidence: the Code Mode call form `notion["notion_tool"]({...})` was read as a markdown link across 34 files; the repair shipped in `032-authoring-hardening` phase `002-validator-false-positives`, and no call syntax was rewritten to satisfy the scan.
- [x] T-006 Revert the sample-code workaround two remediation agents had introduced. Evidence: the spaced form `hooks['x'] (...)` was inserted into sample JavaScript to stop the link scan firing, and was removed once the grader was fixed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Re-measure all fourteen roots individually and read each census line. Evidence: every root reports `tier=FAIL_CLOSED` with `violations=0` and `routing_gold_excluded=0`.
- [x] T-008 Confirm `mcp-notion` reached zero without rewriting its documented invocation syntax. Evidence: the bracket-index Code Mode call form is still present in `mcp-notion/manual-testing-playbook/`, and the package reports `scenarios=33 categories=8 violations=0 warnings=0`.
- [x] T-009 Confirm the spaced workaround form is absent from the shipped tree. Evidence: a recursive search for the `hooks['<key>'] (` pattern across `.opencode/skills/` with `--include="*.md"` returns no matches.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All fourteen transport roots report `violations=0` at `tier=FAIL_CLOSED` under their own runs.
- The one grader defect found here was fixed in the grader, and the documents it had wrongly accused are unchanged.
- The workaround that contorted real sample code to satisfy that defect is gone from the tree, checked rather than assumed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent packet and phase map: `../spec.md`.
- Predecessor phase: `../001-sk-code-family/`.
- Successor phase: `../003-deep-loop-and-spec-kit/`.
- The grader fix this phase depends on: `../../032-authoring-hardening/002-validator-false-positives/`.
<!-- /ANCHOR:cross-refs -->
