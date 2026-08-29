---
title: "Spec: CLI and MCP transport playbook remediation"
description: "Fourteen transport playbook roots carried 2,158 operator-scenario violations, and one of the defects found there was in the grader rather than in any document."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cli and mcp transport playbook remediation"
  - "cli-external-orchestration playbook violations"
  - "mcp-tooling playbook violations"
  - "code mode call syntax false positive"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/002-cli-and-mcp-transports"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Took fourteen transport roots from 2,158 violations to zero"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration"
      - ".opencode/skills/mcp-tooling"
      - ".opencode/skills/mcp-tooling/mcp-notion/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:299076c2e43be1310f2349ae00d90b655d66ee979eceed2e3ff1a403d1e511cd"
      session_id: "2026-08-29-sk-code-031-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: CLI and MCP transport playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-and-mcp-transports |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/037-playbook-family-remediation` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | `001-sk-code-family` |
| **Successor** | `003-deep-loop-and-spec-kit` |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The two transport families are the largest block of dirty roots in the fleet. Six `cli-external-orchestration` packages carried 1,321 operator-scenario violations between them — `cli-opencode` at 306, `cli-claude-code` at 301, `cli-devin` at 226, `cli-cursor` at 168, `cli-codex` at 163, and `cli-pi` at 157. Eight `mcp-tooling` packages carried 837 more — `mcp-figma` and `mcp-mobbin` at 126 each, `mcp-chrome-devtools` at 117, `mcp-refero` at 115, `mcp-click-up` at 112, `mcp-aside-devtools` at 105, `mcp-notion` at 103, and `mcp-obsidian` at 33. Fourteen roots, 2,158 violations, and a green build over all of it.

One of those counts was not a document defect. In `mcp-notion`, the real Code Mode call syntax `notion["notion_tool"]({...})` was being read by the grader as a markdown link, because the scan for links did not exclude fenced code. The syntax is correct — it is how a Code Mode tool is actually invoked — and it appeared across 34 files, so the grader was reporting a large number of missing paths that were never paths. This is the failure mode that makes a false positive expensive: it does not merely waste a reading, it invites the reader to change correct source until the pattern stops firing.

The purpose of this phase is to take all fourteen roots to zero under their own per-root runs, and to route any violation whose cause turns out to be in the grader to the grader rather than to the document.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the six `cli-external-orchestration` mode packages and the eight `mcp-tooling` mode packages, each remediated to zero violations and verified with its own `--package <root> --strict` run; and the identification of the `mcp-notion` count as a grader defect rather than a document defect.

Out of scope: the fix to the grader itself, which is `038-authoring-hardening` phase `002-validator-false-positives`; the two family parent roots `cli-external-orchestration` and `mcp-tooling`, both registered in `routingGoldRoots` and therefore outside the operator-scenario contract; and any change to the Code Mode call syntax the playbooks document, which is real invocation syntax and not a formatting choice.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Each of the six CLI orchestration roots reports `violations=0` under its own `--package <root> --strict` run.
- **REQ-002 [P1]** Each of the eight MCP tooling roots reports `violations=0` under its own `--package <root> --strict` run.
- **REQ-003 [P1]** The `mcp-notion` markdown-link violations are resolved by fixing the grader, not by rewriting the Code Mode call syntax the playbook documents.
- **REQ-004 [P1]** No document is contorted to satisfy a grader defect. Any edit made as a workaround for a false positive is reverted once the grader is fixed.
- **REQ-005 [P2]** Both family parent roots stay registered in `routingGoldRoots`; neither is moved to change a count.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** All six CLI orchestration roots report `PASS`, `tier=FAIL_CLOSED`, `violations=0`: `cli-claude-code` at 52 scenarios across 12 categories, `cli-opencode` at 55 across 13, `cli-codex` at 42 across 11, `cli-cursor` at 40 across 13, `cli-pi` at 37 across 11, and `cli-devin` at 35 across 11.
- **SC-002** All eight MCP tooling roots report `PASS`, `tier=FAIL_CLOSED`, `violations=0`: `mcp-click-up` at 44 scenarios across 10 categories, `mcp-notion` at 33 across 8, `mcp-chrome-devtools` at 30 across 7, `mcp-obsidian` at 30 across 6, `mcp-aside-devtools` at 29 across 8, `mcp-mobbin` at 18 across 6, and `mcp-figma` and `mcp-refero` at 17 each across 6 and 5.
- **SC-003** `mcp-notion` reaches zero with its bracket-index Code Mode call syntax intact in the documents, proving the count was cleared in the grader rather than in the source.
- **SC-004** The spaced sample-code workaround is absent from the shipped tree: a search for the `hooks['<key>'] (` form across `.opencode/skills/` returns no matches.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Contorting correct source to satisfy a regex.** This risk was realised, not avoided: two remediation agents worked around the false positive by inserting a space into sample JavaScript, in the shape `hooks['x'] (...)`, so the grader would stop reading it as a link. That is a real code sample made wrong to make a report green. It was reverted once the grader was fixed, and the absence of the spaced form is now a checked criterion rather than an assumption.
- **Fixing a false positive in the wrong layer.** Editing 34 files to satisfy a defective scan would have left the defect in place for the next author. Mitigated by routing the fix to the grader in `038-authoring-hardening` and leaving the documents alone.
- **Volume hiding a single cause.** Fourteen roots and 2,158 violations invite bulk edits. Mitigated by measuring per root, so a class that spans packages is visible as a class rather than as fourteen separate backlogs.
- **Dependencies.** `validate-playbook-package.cjs` and `playbook-corpus-manifest.json`; the grader fix in `038-authoring-hardening` phase `002-validator-false-positives`. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which package's sample JavaScript carried the space-inserted workaround is UNKNOWN. The record names the shape of the edit and the fact that it was reverted, but not the file it lived in. The confirmed present-state check is the absence of the spaced form across `.opencode/skills/`.

<!-- /ANCHOR:questions -->
