---
title: "Feature Specification: Phase 1: second-pass-subjects-and-attribution"
description: "Second rewrite pass: every subject normalized to the grammar with a packet keyword, one Spec line per touched packet, and every Co-Authored-By, Claude-Session and Anthropic attribution line stripped from history and forbidden by the hooks."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: second-pass-subjects-and-attribution

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The first pass gave every commit an address but left the subjects, the multi-packet commits and the attribution lines as they were. This pass fixes all three in one rewrite, with a deterministic rule set for subjects, a swarm for the cases the rules cannot decide, and the operator's review of the before-and-after table before anything is pushed.

**Key Decisions**: deterministic subject rules first, swarm judgment only for residuals; strip attribution from trailers, list prose mentions; same window discipline as the first pass

**Critical Dependencies**: the first pass on origin; the operator's table review; a quiet window and a fresh yes

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-git-workflow-run-failures |
| **Successor** | None |
| **Handoff Criteria** | Origin carries the second pass, the hooks refuse attribution lines, citations remapped, packet validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Crawlable commit history specification.

**Scope Boundary**: the rewrite tooling under 005's scripts, the two hooks, and the messages on main and skilled/v4.0.0.0. Nothing else.

**Dependencies**:
- `../005-history-rewrite/scripts/` for the plan, callback, runner and remapper
- The commit-msg grammar as the acceptance test for every new subject

**Deliverables**:
- `scripts/build-subject-plan.py` and its subject-plan.jsonl with a before-and-after review table
- Swarm shards for residual subjects, merged into the plan
- Callback and runner extensions: subject replacement, multi-Spec, attribution strip, three new invariants
- Hook changes with harness cases
- The second window and the citation remap

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
2,466 subjects fail the grammar the hook enforces today, 2,912 carry a packet number or a slash as their scope, 572 run past 100 characters, and none carries a word from the packet it belongs to. 2,313 multi-packet commits name only one packet. 7,572 commits carry a Co-Authored-By line and 3,895 a Claude-Session link that the operator does not want in history.

### Purpose
After this pass every subject reads and searches the same way, a packet query finds every commit that touched it, and no attribution line exists or can be added.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Subject rules R1 to R7 below, applied to all 9,167 subjects, residuals judged by the swarm
- One Spec line per touched packet, dominant first
- Attribution trailer lines stripped and forbidden
- The window, the push, the remap

### Out of Scope
- Rewording subjects beyond the rules - a human rewrite of 9,000 lines is not deterministic
- Stripping prose that mentions Anthropic - listed for the operator, not decided here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/build-subject-plan.py` | Create | Rules R1 to R7, residual marking, review table |
| `../005-history-rewrite/scripts/stamp-callback.py`, `rewrite-run.sh` | Modify | Subject replacement, multi-Spec, attribution strip, invariants |
| `.opencode/scripts/git-hooks/commit-msg`, `prepare-commit-msg` | Modify | Refuse and strip attribution lines |
| `specs/**/*.md` | Modify | Citations remapped again |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every non-exempt subject in the plan passes the commit-msg grammar, the numeric-scope check, the lowercase check, the vague list and the length cap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The operator approves the before-and-after table before the rewrite |
| REQ-003 | After the push, zero attribution trailer lines remain on the two lines and the hooks refuse new ones |
| REQ-004 | Every multi-packet commit carries one Spec line per packet, dominant first |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: the runner's new invariants pass on the mirror and on origin
- **SC-002**: a subject search for a packet's slug word hits its commits
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | swarm on cli-pi | residuals stay unjudged | rules-only plan with residuals left unchanged |
| Risk | a rule rewrites a subject into nonsense | Med | the table review and the grammar check |
| Risk | the branch moves during the window | Med | pin, re-fetch, refuse |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: the plan builder runs in one pass over history

### Security
- **NFR-S01**: the runner never pushes; the operator's yes gates the push

### Reliability
- **NFR-R01**: the subject plan is frozen before the rewrite and reproducible from the pinned tip

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a subject the rules empty out becomes a residual
- Maximum length: the keyword is skipped rather than trimmed past 100

### Error Scenarios
- External service failure: a swarm shard that fails is rerun alone
- Network timeout: same

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 9,167 messages, four scripts, two hooks |
| Risk | 25/25 | second force-push |
| Research | 5/20 | rules decided |
| Multi-Agent | 15/15 | swarm shards |
| Coordination | 15/15 | table review, window |
| **Total** | **78/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A subject loses meaning under the rules | M | M | Table review, rules keep the words |

---

## 11. USER STORIES

### US-001: Subjects that search (Priority: P0)

**As a** maintainer, **I want** every subject to carry its type, a real scope and a packet word, **so that** a subject search finds packet work.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: No attribution in history (Priority: P0)

**As the** operator, **I want** no Co-Authored-By, Claude-Session or Anthropic line anywhere, **so that** the history carries the work and nothing else.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 11b. SUBJECT RULES

Applied in order to every subject that is not git-generated. Each row of the plan records which rules fired.

| Rule | What it does |
|------|--------------|
| R1 | `Merge `, `Revert "`, `fixup! `, `squash! `, `amend! ` subjects are untouched |
| R2 | A subject without `type(` gets a type from its files: docs when only documents changed, test when only tests, otherwise by the verb: fix, repair, correct, restore to fix; add, create, implement, introduce to feat; rename, move, restructure, extract to refactor; else chore. Legacy types map: spec, research, review to docs; config, commit to chore |
| R3 | A scope that is numeric, contains a slash, space or uppercase, or is empty, is replaced by the owning subsystem from the touched paths in the skill's order: a skill name, git-hooks, agents, commands, config, readme, specs, docs, the dominant top-level component, repo. Nothing derivable marks a residual |
| R4 | The summary starts lowercase, has no double spaces, no trailing punctuation, and loses process labels such as Phase 2, W1.3, WU3, wave 3, tranche, swarm and N tasks, and any leading packet-number label. An emptied summary marks a residual |
| R5 | When the commit's dominant packet slug has words of four letters or more and none appears in the subject, ` for <slug words>` is appended. Skipped when it would pass 100 characters |
| R6 | A subject over 100 characters is trimmed at a word boundary to 97 or fewer, keeping the type and scope |
| R7 | The result must pass the hook's grammar, numeric-scope, lowercase, vague-summary and length checks, or the row is a residual |

## 12. OPEN QUESTIONS

- Whether the 40 prose mentions of Anthropic in bodies are stripped, kept, or reworded: listed in the review table for the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


