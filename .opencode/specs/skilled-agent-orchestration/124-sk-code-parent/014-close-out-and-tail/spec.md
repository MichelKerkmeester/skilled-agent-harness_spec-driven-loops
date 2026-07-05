---
title: "Feature Specification: Close-out and tail"
description: "Backfills the close-out phase for the sk-code parent program tail: review identity cleanup, advisor scorer repair, rename-invariant repair, and deferred gated follow-ups."
trigger_phrases:
  - "sk-code close-out"
  - "review identity cleanup"
  - "advisor scorer tail"
  - "rename invariants"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/124-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/014-close-out-and-tail"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 docs for shipped close-out commits 027882bfd0, ea689d84e0, and dd9487d65d"
    next_safe_action: "Run strict validation for phase 014"
---
# Feature Specification: Close-out and tail

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `main` (code work already pushed) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code parent program had shipped its two-axis restructure, but the tail still carried stale identity labels, scorer tests from the pre-fold two-skill world, one real cli-opencode routing regression, and a committed parse error in rename-invariant tests. These issues blocked a clean close-out read of the parent program even though the remaining failures were owned by other in-flight sessions.

### Purpose
Finish the close-out tail without widening scope: retire stale `sk-code-review` identity labels now that review is a mode of `sk-code`, repair advisor scorer expectations and routing parity, fix the committed rename-invariant parse error, and document which remaining follow-ups are explicitly deferred or gated.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retire the stale `sk-code-review` skill-name label from review identity and manual-testing-playbook surfaces while keeping the search keyword where intentionally retained.
- Retarget stale advisor scorer tests to `sk-code` for review-owned prompts after the review fold-in.
- Widen the cli-opencode disambiguation penalty so explicit OpenCode CLI delegation routes to `cli-opencode` instead of saturating `sk-code`.
- Restore `.codex/config.toml` reads in `tests/rename-invariants.vitest.ts` after a previous broad replacement duplicated `const opencodeConfig` and pointed TOML assertions at a JSON file.
- Classify remaining advisor-suite failures as other sessions' in-flight work and leave them untouched.

### Out of Scope
- Canonical reindex and skill-graph recompile, because the daemon was flagged broken during this phase.
- Lane-C fresh baseline re-derivation.
- Worktree cleanup for `.worktrees/0014-sk-code-parent`.
- Phase 015 sibling alignment.
- Fixing concurrent dirty work in `skill_advisor.py`, `skill-graph.json`, `aliases.ts`, or the deep-loops/036 playbook row.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/review/SKILL.md` | Update | Rename review skill identity from `code-review` to `review` while preserving the search keyword |
| `.opencode/skills/sk-code/review/manual_testing_playbook/` | Update | Replace 77 stale `sk-code-review` identity labels with `review` across 24 playbook files |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Update | Widen cli-opencode disambiguation from `-0.5` to `-3.0` for explicit OpenCode CLI delegation framing |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-quality-049-003.vitest.ts` | Update | Retarget stale pure-review scorer expectations to `sk-code` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Update | Retarget stale ambiguous-code-problem expectations and cover cli-opencode routing |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Update | Restore `.codex/config.toml` TOML reads |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review mode identity no longer advertises stale `sk-code-review` skill-name labels | Commit `027882bfd0` updates review identity and manual-testing-playbook labels while retaining intentional search keyword coverage |
| REQ-002 | Advisor scorer expectations match the folded review mode model | Commit `ea689d84e0` retargets stale tests to `sk-code` where review is now owned by the hub |
| REQ-003 | Explicit OpenCode CLI delegation routes to `cli-opencode` | Commit `ea689d84e0` widens the disambiguation penalty and keeps the 197-prompt parity report byte-identical |
| REQ-004 | Rename-invariant tests parse and read the correct TOML source | Commit `dd9487d65d` restores `.codex/config.toml` reads and the target suite is 4/4 green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Remaining advisor-suite failures are classified without touching other sessions' work | Eight remaining failures are documented as other sessions' in-flight work and left untouched |
| REQ-006 | Verification evidence distinguishes target repairs from baseline failures | Target suites, full advisor-suite delta, parity output, and rename-invariant target suite results are recorded |
| REQ-007 | Deferred gated follow-ups are explicit | Reindex, Lane-C baseline, worktree cleanup, and phase 015 alignment are listed as open follow-ups rather than completed work |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check` strict mode exits 0 after review identity label cleanup.
- **SC-002**: `check-rule-copies` and its test exit 0 after the review label cleanup.
- **SC-003**: Review-tree links are clean after `sk-code-review` identity label retirement.
- **SC-004**: The three target advisor scorer suites report 39/39 green.
- **SC-005**: Full advisor-suite failures improve from the stashed baseline of 13 failures to 9 failures with zero new failures.
- **SC-006**: The 197-prompt advisor parity report is byte-identical after the scorer repair.
- **SC-007**: Rename-invariants target suite reports 4/4 green.

### Acceptance Scenarios

- **Scenario 1**: **Given** review is now a mode of `sk-code`, **when** review identity docs are inspected, **then** stale `sk-code-review` skill-name labels are retired and intentional keyword coverage remains.
- **Scenario 2**: **Given** an explicit prompt says to use OpenCode CLI delegation, **when** scorer lanes evaluate it, **then** `cli-opencode` wins over bare `sk-code` token saturation.
- **Scenario 3**: **Given** rename-invariant tests assert TOML behavior, **when** the target test runs, **then** it reads `.codex/config.toml` rather than JSON config.
- **Scenario 4**: **Given** concurrent sessions own unrelated advisor failures, **when** this phase closes out, **then** those files remain untouched and the failures are documented as out of scope.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-code review fold-in | Stale identity labels could reintroduce old two-skill terminology | Retire identity labels while keeping intentional search keyword coverage |
| Dependency | Advisor scorer parity | Routing fix could change broad prompt behavior | Compare 197-prompt parity report byte-for-byte and record target-suite results |
| Risk | Concurrent dirty advisor files | Full suite failures could be misattributed to this phase | Classify remaining failures and leave other sessions' files untouched |
| Risk | Broken daemon during reindex | Reindex or skill-graph rebuild could produce unreliable artifacts | Defer canonical reindex and skill-graph recompile |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Advisor scorer changes must not introduce broad parity churn; the 197-prompt parity report remains byte-identical.

### Security
- **NFR-S01**: No secrets or credentials are introduced by documentation, tests, or routing fixtures.

### Reliability
- **NFR-R01**: Targeted suites must be green for each fixed area.
- **NFR-R02**: Remaining known failures must be classified by ownership before close-out.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The string `sk-code-review` remains valid only as an intentional search keyword, not as a skill-name identity label.
- The cli-opencode fix must handle prompts with repeated bare `opencode` tokens that otherwise saturate the sk-code lane.

### Error Scenarios
- A broken daemon blocks canonical reindex and skill-graph recompile.
- Full advisor-suite failures include concurrent dirty work and must not be treated as regressions from this phase.

### Concurrent Operations
- Other sessions changed advisor and deep-loop assets at the same time. This phase only classified those failures and did not modify their files.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three shipped close-out commits across review docs, advisor scorer tests, and rename-invariant tests |
| Risk | 14/25 | Routing and identity changes affect advisor behavior and parent close-out confidence |
| Research | 9/20 | Root cause traced through git history and baseline comparison |
| **Total** | **39/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for the shipped code work.
- Deferred follow-ups remain: canonical reindex plus skill-graph recompile, Lane-C baseline re-derivation, `.worktrees/0014-sk-code-parent` cleanup, and phase 015 sibling alignment.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
