---
title: "Verification Checklist: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "Verification Date: 2026-08-29"
trigger_phrases:
  - "verification"
  - "checklist"
  - "restraint routing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T11:36:55Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified all items, including the four post-review checks"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` section 4 carries REQ-001 through REQ-008 with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` section 3 router-not-authority pattern plus nine-row edit table]
- [x] CHK-003 [P0] Baseline captured before editing [evidence: 542 lines, `git status AGENTS.md` clean at start]
- [x] CHK-004 [P1] Existing coverage mapped so additions are net-new [evidence: `code-quality-standards.md:42` ladder and `test-quality-checklist.md:98` smells located before drafting]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Gate 2 binds on artifact type independently of advisor score (REQ-001) [evidence: `AGENTS.md:141` names code to sk-code and markdown to sk-doc with the system-spec-kit carve-out]
- [x] CHK-011 [P0] Restraint ladder reachable from AGENTS.md (REQ-002) [evidence: `AGENTS.md:283` lists six rungs and cites `code-quality-standards.md` section 1]
- [x] CHK-012 [P0] Test creation governed at author time (REQ-003) [evidence: `AGENTS.md:314` test-restraint bullet present]
- [x] CHK-013 [P1] Doctrine-amendment path present (REQ-005) [evidence: `AGENTS.md:36` step 4 under PLAN-WORKFLOW LOCK]
- [x] CHK-014 [P1] Comprehension routing present with its rationale (REQ-006) [evidence: `AGENTS.md:475` names the advisor route-exclusion as the reason the rule lives there]
- [x] CHK-015 [P1] House style matched, no new top-level section [evidence: all added lines are `- **Term** — explanation` bullets inside existing subsections]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Section headers sequential 1..10 after the edits (REQ-007) [evidence: `grep -nE '^## [0-9]+\.' AGENTS.md` returns 1..10 in order]
- [x] CHK-021 [P0] Diff within the twelve-line budget (REQ-007) [evidence: `git diff --numstat AGENTS.md` reports 9 insertions and 3 deletions]
- [x] CHK-022 [P0] Negative control: every net-new phrase absent pre-edit [evidence: `git show HEAD:AGENTS.md | grep -ic '<phrase>'` returned 0 for all 7 net-new phrases pre-edit]
- [x] CHK-023 [P0] Every cited pointer resolves (REQ-004) [evidence: `test -e` loop over all 5 cited paths reported OK for each]
- [x] CHK-024 [P1] Summarized ladder rungs match source order [evidence: rungs 1-6 in `AGENTS.md:283` match `code-quality-standards.md:42` YAGNI, stdlib, native, installed dep, one line, minimum]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every operator ask has a landing rule or a documented reason it needed none [evidence: `plan.md` section 3 table maps nine edits; simplicity and over-engineering already covered by existing lines]
- [x] CHK-FIX-002 [P0] No added line restates content its cited source owns (REQ-004) [evidence: `AGENTS.md:283` names rungs without rationale; `test-quality-checklist.md` smells and `sk-doc/SKILL.md` mode table referenced, not copied]
- [x] CHK-FIX-003 [P1] Rule-collision cases resolved in writing [evidence: `spec.md` Edge Cases covers ladder versus SCOPE LOCK, amendment versus PLAN-WORKFLOW LOCK, restraint versus the P1 coverage bar]
- [x] CHK-FIX-004 [P0] Independent review run and its claims verified, not trusted [evidence: `cursor-agent --model cursor-grok-4.6-xhigh --mode ask`; every cited line re-read before acting]
- [x] CHK-FIX-005 [P0] No added line couples the universal doc to one repo's skill taxonomy [evidence: `grep -nE 'sk-code-[a-z]+|surface=|phase=|\[mode\]' AGENTS.md` hits only the pre-existing line 518]
- [x] CHK-FIX-006 [P0] Seam rule no longer overrides SCOPE LOCK [evidence: `AGENTS.md:296` now requires naming the files and asking; SCOPE LOCK cited inline]
- [x] CHK-FIX-007 [P0] Test rule names its floor instead of an undefined bar [evidence: `AGENTS.md:314` cites `code-quality-standards.md` section 4, happy path plus one edge case]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials in the added prose [evidence: `git diff AGENTS.md` is instruction text only, no tokens or keys]
- [x] CHK-031 [P0] No ephemeral artifact ids in the instruction prose (NFR-M02) [evidence: validator `COMMENT_HYGIENE_MARKER` passes on `git diff AGENTS.md`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation-summary synchronized [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all describe the same 9 edits]
- [x] CHK-041 [P1] Packet metadata present [evidence: `description.json` and `graph-metadata.json` exist in the packet folder]
- [x] CHK-042 [P2] Operator decisions recorded [evidence: `spec.md` frontmatter answered_questions carries enforcement, scope, and line budget]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left in the repository [evidence: `git status --short` lists only `AGENTS.md` and the packet path; the edit script lives in the session scratchpad]
- [x] CHK-051 [P1] Packet path and naming valid [evidence: folder `006-restraint-and-routing-gates` matches the three-digit lowercase-hyphen pattern]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-29
**Verified By**: AI Assistant (Claude Opus 5)
<!-- /ANCHOR:summary -->
