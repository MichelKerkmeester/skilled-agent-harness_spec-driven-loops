# Feature Specification: Claude Code Compaction Resilience

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

After context compaction events in Claude Code, the model ignores CLAUDE.md rules and the user's last instruction because the compaction summary biases toward "continue working." This spec formalizes a zero-code, instruction-based mitigation: a ~20-line CLAUDE.md section that forces Claude to stop, summarize state, and wait for user confirmation after any compaction event. The problem is attention/salience, not data loss -- CLAUDE.md persists architecturally but loses behavioral weight when rich conversation history is replaced with a sparse summary.

**Key Decisions**: CLAUDE.md as primary location (not MEMORY.md); "Stop and Confirm" pattern (not hook-based automation); Structured numbered format (not narrative prose)

**Critical Dependencies**: Research completed at `../compaction-research/research.md`

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-11 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
After context compaction, Claude Code violates CLAUDE.md instructions and ignores the user's most recent behavioral constraints (e.g., "discuss, don't execute"). The compaction summary's default "continue making progress" framing overrides careful behavioral anchoring. Multiple GitHub issues (#6354, #4017, #19471) confirm this affects production users -- 11+ compactions in a single session caused complete rule amnesia.

### Purpose
Eliminate post-compaction autonomous drift by adding structured instructions to CLAUDE.md and MEMORY.md that force a mandatory stop-summarize-confirm cycle after every compaction event.

---

## 3. SCOPE

### In Scope
- CLAUDE.md section (~20 lines) with compaction behavior instructions
- MEMORY.md entry (2 lines) as secondary reinforcement pointer
- Verification protocol for testing compaction resilience
- Workflow documentation for manual /compact usage
- Decision records for architectural choices

### Out of Scope
- PreCompact/PostCompact hook implementation - deferred as future enhancement (ADR-002)
- Custom compaction API `instructions` parameter configuration - requires API-level access
- Session Memory system modifications - platform-controlled feature
- Changes to the compaction algorithm itself - Anthropic-controlled

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` | Modify | Add ~20-line "Context Compaction Behavior" section |
| `~/.claude/projects/<project>/memory/MEMORY.md` | Modify | Add 2-line "Compaction Recovery" entry |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CLAUDE.md contains "Context Compaction Behavior" section with CRITICAL/STOP markers | Section present, starts with `CRITICAL:`, includes numbered steps 1-5 |
| REQ-002 | Post-compaction instruction includes mandatory STOP before any action | Step 1 explicitly says "STOP -- do not take any action, do not use any tools" |
| REQ-003 | Post-compaction instruction requires re-reading CLAUDE.md | Step 2 explicitly says "Re-read this CLAUDE.md file completely" |
| REQ-004 | Post-compaction instruction requires state summary presentation to user | Step 3-4 require summarizing task, files, errors, git state AND waiting for confirmation |
| REQ-005 | CLAUDE.md section specifies what to preserve during compaction | "When compacting, always preserve:" block lists file paths, errors, instructions, git state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | MEMORY.md contains compaction recovery pointer | Entry under "## Compaction Recovery" references CLAUDE.md section |
| REQ-007 | Manual /compact workflow documented with 70% trigger threshold | Workflow includes context monitoring, focus instructions, confirmation step |
| REQ-008 | Multi-compaction session guidance included | After 2+ compactions, recommend /clear and fresh start |

---

## 5. SUCCESS CRITERIA

- **SC-001**: After simulated compaction, Claude stops and presents a state summary before taking any action (verified in 5/5 test runs)
- **SC-002**: CLAUDE.md compaction section is under 25 lines and under 500 tokens
- **SC-003**: Post-compaction state summary includes: current task, user's last instruction, modified files, git branch
- **SC-004**: Zero autonomous tool calls between compaction event and user confirmation

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Research complete | Blocks all work | Already completed at `../compaction-research/research.md` |
| Dependency | CLAUDE.md write access | Blocks REQ-001 | Standard file, no permission issues |
| Risk | Instructions ignored under heavy compaction | High | Multi-layer reinforcement (CLAUDE.md + MEMORY.md + numbered format) |
| Risk | CLAUDE.md token budget exceeded | Medium | Keep section under 500 tokens; audit total CLAUDE.md size |
| Risk | Instructions conflict with existing CLAUDE.md rules | Low | Review existing sections before insertion |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: CLAUDE.md compaction section adds < 500 tokens to system prompt (measured via token counter)

### Portability
- **NFR-S01**: Instructions are model-agnostic -- work with any Claude model version (Opus, Sonnet, Haiku)

### Maintainability
- **NFR-R01**: Section is self-contained and can be updated independently of other CLAUDE.md content

---

## 8. EDGE CASES

### Compaction Scenarios
- Single compaction in a short session: Claude should still stop and confirm
- Multiple compactions (2+): Claude should recommend /clear after the second
- Manual /compact with custom focus: Instructions still apply after manual compaction
- Compaction during subagent execution: Subagent context is separate; main session rules apply

### Content Boundaries
- CLAUDE.md already has compaction-related content: Deduplicate and consolidate
- MEMORY.md at 200-line limit: Entry is only 2 lines; audit existing content if near limit
- User has conflicting instructions (e.g., "always continue without asking"): CLAUDE.md compaction section takes precedence for safety

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~25, Systems: 2 (CLAUDE.md, MEMORY.md) |
| Risk | 12/25 | Auth: N, API: N, Breaking: N, Behavioral validation: Y |
| Research | 15/20 | Full research completed, community patterns analyzed |
| Multi-Agent | 5/15 | Workstreams: 1 (documentation only) |
| Coordination | 8/15 | Dependencies: 1 (research), Cross-ref: spec documents |
| **Total** | **48/100** | **Level 3** (architecture decisions require ADRs) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Post-compaction instructions ignored by model | H | M | Multi-layer reinforcement: CLAUDE.md (primary) + MEMORY.md (secondary) + CRITICAL/STOP markers for salience |
| R-002 | CLAUDE.md grows too large, reducing overall instruction compliance | M | L | Budget: section < 500 tokens; periodic CLAUDE.md audit |
| R-003 | Instructions conflict with future Claude Code compaction improvements | M | M | Self-contained section; easy to update or remove |
| R-004 | Verification protocol produces false positives (appears to work but fails in real usage) | H | L | 5-run test protocol with varied task types; monitor real sessions |
| R-005 | User fatigue from mandatory post-compaction confirmation | L | M | After 2+ compactions, recommend /clear instead of repeated confirmations |

---

## 11. USER STORIES

### US-001: Post-Compaction Safety Stop (Priority: P0)

**As a** Claude Code user in a long session, **I want** Claude to stop and summarize its understanding after compaction, **so that** I can verify it hasn't lost critical context before it takes any action.

**Acceptance Criteria**:
1. Given a compaction event occurs, When Claude resumes, Then it presents a state summary without executing any tools
2. Given the summary is presented, When the user confirms, Then Claude proceeds with the confirmed understanding
3. Given the summary is presented, When the user corrects it, Then Claude updates its understanding before proceeding

---

### US-002: Behavioral Constraint Preservation (Priority: P0)

**As a** Claude Code user who set constraints like "plan only, don't execute", **I want** those constraints preserved and re-stated after compaction, **so that** Claude doesn't start executing code autonomously.

**Acceptance Criteria**:
1. Given the user said "discuss, don't execute" before compaction, When compaction occurs, Then Claude's post-compaction summary includes "User's last instruction: discuss, don't execute"
2. Given the constraint is re-stated, When Claude continues, Then it follows the constraint until explicitly changed

---

### US-003: Manual Compaction Workflow (Priority: P1)

**As a** power user monitoring context usage, **I want** guidance on when and how to manually trigger /compact, **so that** I maintain control over context quality.

**Acceptance Criteria**:
1. Given context reaches ~70%, When the user checks MEMORY.md, Then they find the manual /compact workflow
2. Given the workflow is followed, When /compact is run with focus instructions, Then the resulting summary preserves task-relevant details

---

### US-004: Multi-Compaction Session Recovery (Priority: P1)

**As a** Claude Code user who has experienced 2+ compactions, **I want** Claude to recommend starting fresh, **so that** I avoid cumulative context degradation.

**Acceptance Criteria**:
1. Given 2+ compactions have occurred, When Claude presents its post-compaction summary, Then it includes a recommendation to /clear and start fresh
2. Given the recommendation is shown, When the user decides to continue, Then Claude proceeds normally (recommendation is advisory, not blocking)

---

## 12. OPEN QUESTIONS

- None -- all questions resolved during research phase (see `../compaction-research/research.md`)

---

## RELATED DOCUMENTS

- **Research**: See `../compaction-research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
