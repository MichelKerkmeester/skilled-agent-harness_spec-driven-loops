---
title: "Tasks: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces"
description: "Ordered tasks to add the Claude-only Haiku Explore override, pin the context agent to Haiku, exempt Explore from mirroring, and verify the mirrors."
trigger_phrases:
  - "haiku explore and context agents tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Haiku-default Explore override and haiku-pinned context agent across Claude and sibling runtime surfaces

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the docs on Explore model resolution and confirm the override mechanism (claude-code-guide report)
- [x] T002 Capture a baseline of the five mirror and sync checks before any repo edit (all passed, 187 mirrors, 12 agents per tree)
- [x] T003 Write the user-level override (`~/.claude/agents/Explore.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the Claude-dialect file (`.claude/agents/Explore.md`)
- [x] T005 Try mirroring Explore to the other runtimes, find the Codex generator rejects a capitalised filename, and remove the copies (`.skilled`, `.pi`, `.cursor`, `.devin`)
- [x] T006 Add the Claude-only exemption and one test (`agent-roster-mirror-check.cjs`, `sync-runtime-mirrors.cjs`, `agent-roster-mirror-check.test.cjs`)
- [x] T007 Add `model: haiku` to the context and markdown agents (`.claude/agents/context.md`, `.claude/agents/markdown.md`)
- [x] T008 Update the Claude agents README and the mirror crosswalk (`.claude/agents/README.txt`, the crosswalk reference)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the five checks and compare against the baseline (all pass, counts unchanged)
- [x] T010 Confirm no `settings.json` gained a subagent model variable (grep found none)
- [x] T011 Run `validate.sh --strict` on this packet and read `RESULT: PASSED` (after rebuilding the stale runtime dist and re-deriving the packet's graph metadata)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed for everything this session can run (the live spawn check in a new session is operator-only and recorded in the summary)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: baseline of five checks passed before edits]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Agent files parse: frontmatter has `name`, `description` and `tools:` [EVIDENCE: `.claude/agents/Explore.md` loaded by the agent-mirror-sync and roster runs without error, `head -8` shows all three keys]
- [x] CHK-011 [P0] No em dash in any file written [EVIDENCE: zero em dashes in both Explore files and in the added diff lines after two re-wrapped crosswalk dashes became commas]
- [x] CHK-012 [P1] Error handling implemented (not applicable, the only executable change is a set filter) [EVIDENCE: the only executable change is one set filter in two list builders]
- [x] CHK-013 [P1] New files follow the sibling agents' dialect for their tree [EVIDENCE: `tools:` allow-list matches the `review.md` Claude dialect]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: `acceptance-criteria.md` rows AC-001 to AC-006]
- [x] CHK-021 [P0] Roster check reports `STATUS=OK` [EVIDENCE: output shows 12 agents on every surface, exit 0]
- [x] CHK-022 [P1] Edge case tested: a Claude-only agent present in `.claude/agents` alone does not break the roster [EVIDENCE: node test run, 9 of 9 pass]
- [x] CHK-023 [P1] Cursor and Devin exposure to `model: haiku` recorded as UNKNOWN [EVIDENCE: spec.md sections 6 and 10, summary limitation 3]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `cross-consumer`, because every runtime tree consumes the roster and two tools build it. [EVIDENCE: plan.md affected surfaces table]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [EVIDENCE: the two list builders are `canonicalRoster` in the roster check and `listAgentNames` in the symlink sync, both edited, and `check-agent-mirror-sync.cjs` builds from `.opencode/agents` so needs no change).
- [x] CHK-FIX-003 [P0] Consumer inventory completed [EVIDENCE: Pi and Codex generators read `.skilled`, which has no Explore, and their `--check` runs pass).
- [x] CHK-FIX-004 [P0] Adversarial table tests: not applicable, no security, path, parser or redaction code changed. [EVIDENCE: git diff touches no parser, path or security code]
- [x] CHK-FIX-005 [P1] Matrix axes listed: six runtime trees by five checks, all rerun after the change. [EVIDENCE: five check outputs recorded in implementation-summary.md]
- [x] CHK-FIX-006 [P1] Hostile env variant: not applicable, no code reads process-wide state. [EVIDENCE: git diff touches no env or global-state read]
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range: working tree against `4f659bdd4c`, uncommitted. [EVIDENCE: git diff 4f659bdd4c against the working tree]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the changed files hold prose, a set literal and a frontmatter line]
- [x] CHK-031 [P0] The Explore override has no Write or Edit tool [EVIDENCE: `tools: Read, Grep, Glob, Bash`]
- [x] CHK-032 [P1] Auth/authz not applicable, no auth surface touched [EVIDENCE: git diff touches no auth file]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three describe the Claude-only design after the Codex finding]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: both constants carry a comment that states the durable reason]
- [x] CHK-042 [P2] Agent README and crosswalk updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: scratch probes lived in the session scratchpad outside the repo]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: only `.gitkeep` remains]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---
