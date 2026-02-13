# Goodspec vs System-Spec-Kit: Comprehensive Analysis Report

> **Research Date:** February 4, 2026
> **Spec Folder:** `specs/003-memory-and-spec-kit/086-speckit-memory-refinement-based-on-goodspec`
> **Research Method:** 30 parallel Opus agents analyzing all aspects of both systems

---

## Executive Summary

This analysis compares the **Goodspec** specification-driven development framework against our **System-Spec-Kit** implementation. Both systems share similar goals—structured AI-assisted development with context preservation—but differ significantly in philosophy, architecture, and user experience.

**Key Finding:** Goodspec prioritizes **simplicity and user experience** (3-step research, inline save shortcuts, "conductor" orchestration), while System-Spec-Kit emphasizes **rigor and comprehensive coverage** (9-step research, 6-tier importance, hybrid search with RRF fusion). The ideal system combines Goodspec's UX patterns with our advanced technical features.

---

## 1. Philosophy Comparison

| Principle | Goodspec | System-Spec-Kit |
|-----------|----------|-----------------|
| **Core Mantra** | "Ask, Don't Assume" | "Read First, Scope Lock, Verify, Halt" |
| **Spec Treatment** | "Spec as Contract" - locked with explicit gates | Progressive documentation levels (1-3+) |
| **Memory Approach** | "Memory-First" - search before EVERY action | Gate-triggered context loading |
| **Orchestration** | "Conductor, Not Player" - NEVER writes code | Hub-and-spoke with Task tool delegation |
| **Scaling** | "Scale to Task" - 4 modes (Quick/Standard/Comprehensive/Milestone) | Documentation levels based on LOC |
| **User Interaction** | Progressive disclosure, minimal friction | Comprehensive gates with multi-step validation |

### Philosophical Insights

**Goodspec's 5 Pillars:**
1. Ask, Don't Assume → Interactive questioning default
2. Spec as Contract → Lock before execution
3. Memory-First → Always search before acting
4. Unified Experience → Consistent UI patterns
5. Scale to Task → Lightweight for simple, heavy for complex

**Our 4 Hard Blockers:**
1. READ FIRST → Understand before modify
2. SCOPE LOCK → Only modify explicitly in-scope files
3. VERIFY → Tests must pass
4. HALT → Stop when uncertain

**Gap:** Goodspec's "Scale to Task" allows lightweight paths that bypass full process. Our system applies similar rigor to all tasks, which can feel heavy for simple fixes.

---

## 2. Architecture Comparison

### 2.1 Agent Architecture

| Aspect | Goodspec (12 Agents) | System-Spec-Kit (7+2 Agents) |
|--------|---------------------|------------------------------|
| Orchestrator | goop-orchestrator (conductor, no code) | orchestrate (commander, Task-only) |
| Planning | goop-planner | speckit |
| Execution | goop-executor | @general (built-in) |
| Research | goop-researcher | research |
| Exploration | goop-explorer | @explore (built-in) |
| Documentation | goop-librarian | - |
| Verification | goop-verifier | review |
| Debugging | goop-debugger | debug |
| Design | goop-designer | - |
| Testing | goop-tester | - |
| Writing | goop-writer | write |
| Memory | memory-distiller | - |
| Handover | - | handover |

**Gaps in Our System:**
- No dedicated **Librarian** (documentation lookup)
- No dedicated **Designer** (UI/UX specifications)
- No dedicated **Tester** (test generation/strategy)
- No **Memory Distiller** (automatic knowledge extraction)

**Our Unique Strengths:**
- Dedicated **Handover** agent (session continuation)
- **Circuit Breaker** pattern (failure isolation)
- **Saga Compensation** (rollback capability)

### 2.2 Memory System Architecture

| Feature | Goodspec | System-Spec-Kit |
|---------|----------|-----------------|
| **Search Type** | Hybrid (FTS + Vector) with RRF | Hybrid (BM25 + Vector + Graph) with RRF |
| **Fusion Method** | RRF k=60 | RRF k=60 + convergence bonus |
| **Importance** | 1-10 numeric scale | 6-tier categorical (constitutional → deprecated) |
| **Decay Model** | None documented | FSRS-based cognitive decay |
| **Retrieval** | Concepts + Title search | ANCHOR-based (93% token savings) |
| **Graph** | None | Causal memory graph (6 relationship types) |
| **Session** | Basic | Full deduplication, preflight/postflight |
| **Checkpoints** | JSON files | SQLite with named snapshots |

**Our Memory Advantages:**
- More sophisticated search (3-way fusion vs 2-way)
- Constitutional tier for always-surface rules
- FSRS-based memory decay (cognitive science backed)
- Causal linking for decision archaeology
- Session deduplication (-50% tokens on follow-up)

**Goodspec Memory Advantages:**
- Simpler mental model (1-10 scale)
- Atomic facts extraction (fact-level retrieval)
- Concept tags for semantic clustering
- Lower friction saves (inline prefixes)

### 2.3 Workflow Architecture

| Phase | Goodspec | System-Spec-Kit |
|-------|----------|-----------------|
| **Entry** | Intent Gate (classify) | Gate 1 (spec folder question) |
| **Discovery** | DISCUSS (merged into PLAN) | /spec_kit:research (9 steps) |
| **Planning** | PLAN (5-step) | /spec_kit:plan (7 steps) |
| **Specification** | SPECIFY (Contract Gate) | Embedded in plan workflow |
| **Execution** | EXECUTE (wave-based) | /spec_kit:implement (9 steps) |
| **Verification** | AUDIT | @review agent |
| **Acceptance** | CONFIRM (Accept Gate) | Completion verification rule |
| **Handover** | /goop-pause | /spec_kit:handover |
| **Recovery** | /goop-resume | /spec_kit:resume |

**Key Workflow Differences:**

1. **Contract Gates:** Goodspec has explicit SPECIFY GATE (user types "confirm") and ACCEPT GATE (user types "accept"). We rely on gate scoring thresholds.

2. **Wave Execution:** Goodspec organizes tasks into sequential waves (Foundation → Core → Integration → Polish). We use flat task lists.

3. **Deviation Rules:** Goodspec has 4 explicit rules:
   - Rule 1: Auto-fix bugs
   - Rule 2: Auto-add critical (validation, auth)
   - Rule 3: Auto-fix blocking issues
   - Rule 4: STOP for architectural decisions

   We have HALT conditions but no auto-fix classification.

4. **Quick Mode:** Goodspec's `/goop-quick` bypasses full workflow for small changes. We require Gate 1 question for all file modifications.

---

## 3. Command Comparison

### 3.1 Spec/Plan Commands

| Purpose | Goodspec | System-Spec-Kit |
|---------|----------|-----------------|
| Plan | /goop-plan | /spec_kit:plan |
| Research | /goop-research | /spec_kit:research |
| Specify | /goop-specify | (embedded in plan) |
| Execute | /goop-execute | /spec_kit:implement |
| Complete | /goop-complete | /spec_kit:complete |
| Debug | /goop-debug | /spec_kit:debug |
| Status | /goop-status | (no equivalent) |
| Amend | /goop-amend | (no equivalent) |
| Quick | /goop-quick | (no equivalent - Gate 1 D) Skip) |

### 3.2 Memory Commands

| Purpose | Goodspec | System-Spec-Kit |
|---------|----------|-----------------|
| Save | /goop-remember | /memory:save |
| Search | /goop-recall | /memory:context |
| Status | /goop-memory | /memory:manage |
| Learn | - | /memory:learn |
| Continue | - | /memory:continue |

**Goodspec UX Advantages:**
- Inline type prefixes: `decision:`, `note:`, `todo:`
- Auto-extraction of facts and concepts
- Single-command saves without validation gates
- Recent activity summary in status

**Our Unique Features:**
- Intent-aware retrieval (5 intent types)
- Correction tracking with undo
- Learning capture with stability penalties
- Checkpoint backup/restore

### 3.3 Utility Commands

| Purpose | Goodspec | System-Spec-Kit |
|---------|----------|-----------------|
| Help | /goop-help | (none - uses AGENTS.md) |
| Setup | /goop-setup | (none) |
| Map Codebase | /goop-map-codebase | (via /spec_kit:research) |
| Milestone | /goop-milestone | (none) |
| Pause | /goop-pause | /spec_kit:handover |
| Resume | /goop-resume | /spec_kit:resume |

**Missing Commands:**
- `/spec_kit:status` - Dashboard view of current state
- `/spec_kit:setup` - Guided configuration wizard
- `/spec_kit:amend` - Formal scope change management
- `/spec_kit:quick` - Lightweight path for small changes
- `/spec_kit:map` - Codebase analysis for brownfield projects

---

## 4. Template Comparison

### 4.1 Documentation Artifacts

| Purpose | Goodspec | System-Spec-Kit |
|---------|----------|-----------------|
| Specification | SPEC.md | spec.md |
| Plan | BLUEPRINT.md | plan.md |
| Tasks | (in BLUEPRINT.md) | tasks.md |
| Progress | CHRONICLE.md | (tasks.md checkboxes) |
| Research | RESEARCH.md | research.md |
| Decisions | (in SPEC.md amendments) | decision-record.md |
| Summary | SUMMARY.md | implementation-summary.md |
| Retrospective | RETROSPECTIVE.md | (none) |
| Milestone | MILESTONE.md | (none) |
| Checklist | (verification section) | checklist.md |

### 4.2 Template Structure

**Goodspec Templates:**
- Mustache syntax (`{{variable}}`)
- Wave-based execution model
- Memory persistence sections
- Amendment history tracking

**Our Templates:**
- HTML comment markers (`<!-- SPECKIT_LEVEL: 2 -->`)
- CORE + ADDENDUM architecture
- Priority-based requirements (P0/P1/P2)
- Five Checks Framework for decisions

### 4.3 Memory File Structure

**Goodspec Memory Entry:**
```json
{
  "type": "observation | decision | note",
  "title": "string",
  "content": "string",
  "facts": ["atomic", "facts"],
  "concepts": ["tags"],
  "importance": 8
}
```

**Our Memory Entry (v2.2 Template):**
- Preflight/postflight learning delta
- Session state and continuation prompt
- 10 ANCHOR sections for retrieval
- Causal links (6 relationship types)
- FSRS fields (stability, difficulty)
- Session deduplication fields

---

## 5. Quality & Verification Comparison

### 5.1 Quality Gates

| Aspect | Goodspec | System-Spec-Kit |
|--------|----------|-----------------|
| **Pre-Execution** | Research Gate (Quick/Deep) | Gate Score >= 60 |
| **Specification** | Contract Gate (user "confirm") | Gate Score >= 70 |
| **Checkpoints** | Checkpoint Gate (Rule 4) | Quality Gates >= 70 |
| **Acceptance** | Accept Gate (user "accept") | P0/P1 verification + @review |

### 5.2 Deviation Handling

**Goodspec 4-Rule System:**
| Rule | Trigger | Action |
|------|---------|--------|
| 1 | Bug found | Auto-fix, document |
| 2 | Missing critical | Auto-add, document |
| 3 | Blocking issue | Auto-fix, document |
| 4 | Architectural | STOP, ask user |

**Our System:**
- HALT conditions (file not found, syntax fail, merge conflict)
- No explicit auto-fix classification
- Circuit breaker for cascading failures
- Escalation after 3 hypotheses in debug

### 5.3 Security & Boundaries

**Goodspec 3-Tier Boundaries:**
| Tier | Action | Examples |
|------|--------|----------|
| Always | Auto-do | Run tests, follow conventions |
| Ask First | Prompt user | Schema changes, new deps |
| Never | Prohibited | Commit secrets, skip tests |

**Our System:**
- P0/P1/P2 checklist priorities
- Hard blockers in AGENTS.md
- No configurable boundary system per project

---

## 6. Skill & Reference Architecture

### 6.1 Skill Organization

**Goodspec Skills (33 total):**
- Organized by category (core, code, testing, documentation)
- `requires` field for dependencies
- Flat file or directory-based formats
- Project overrides in `.goopspec/skills/`

**Our Skills:**
- SKILL.md with frontmatter
- `references/`, `scripts/`, `assets/` structure
- Auto-discovery via frontmatter
- No explicit dependency chain

### 6.2 Reference Documentation

**Goodspec References (18 files):**
- Workflow references (specify, plan, execute, research, accept)
- Orchestration references (philosophy, subagent-protocol, dispatch-patterns)
- Quality references (deviation-rules, security-checklist, boundary-system, tdd)
- Interaction references (questioning, response-format, agent-patterns, model-profiles)

**Our References (23 files):**
- Memory references (system, save_workflow, etc.)
- Template references (level specs, style guide)
- Validation references (rules, checklists, five-checks)
- Structure references (folder naming, versioning)
- Workflow references (quick reference, examples)
- Debugging references (troubleshooting, methodology)

---

## 7. User Experience Comparison

### 7.1 Onboarding

| Aspect | Goodspec | System-Spec-Kit |
|--------|----------|-----------------|
| Setup | /goop-setup wizard (8 steps) | Manual configuration |
| Help | /goop-help with categories | AGENTS.md reference |
| Codebase Discovery | /goop-map-codebase (7 docs) | Via research workflow |
| Quick Keywords | "spec it", "finish it" | None |

### 7.2 Day-to-Day Usage

| Aspect | Goodspec | System-Spec-Kit |
|--------|----------|-----------------|
| Save Memory | `decision: Use JWT for auth` | /memory:save with validation gates |
| Quick Fixes | /goop-quick bypasses process | Gate 1 always required |
| Status Check | /goop-status dashboard | No equivalent |
| Scope Changes | /goop-amend with impact analysis | Modify spec folder directly |

### 7.3 Session Management

| Aspect | Goodspec | System-Spec-Kit |
|--------|----------|-----------------|
| Pause | /goop-pause (JSON checkpoint) | /spec_kit:handover (rich markdown) |
| Resume | /goop-resume (checkpoint ID) | /spec_kit:resume (semantic search) |
| Crash Recovery | Basic | Full with state recovery |
| Stale Detection | None | 7-day threshold with options |

---

## 8. Strengths & Weaknesses Summary

### 8.1 Goodspec Strengths

1. **Simplicity** - 3-step research, inline saves, quick mode
2. **Contract Gates** - Explicit user confirmation points
3. **Wave Execution** - Organized parallel/sequential task grouping
4. **4-Rule Deviation** - Clear autonomy boundaries
5. **Setup Wizard** - Guided onboarding
6. **Codebase Mapping** - 7-document analysis for brownfield
7. **Status Command** - Dashboard view of progress
8. **Quick Keywords** - Natural language triggers
9. **12 Specialized Agents** - More granular specialization
10. **Memory Distiller** - Automatic knowledge extraction

### 8.2 System-Spec-Kit Strengths

1. **Hybrid Search** - 3-way fusion (vector + BM25 + graph)
2. **Constitutional Tier** - Always-surface critical rules
3. **FSRS Decay** - Cognitive science-backed memory model
4. **Causal Graph** - 6 relationship types for decision archaeology
5. **Session Deduplication** - 50% token savings
6. **ANCHOR Retrieval** - 93% token savings
7. **Circuit Breaker** - Failure isolation pattern
8. **Saga Compensation** - Rollback capability
9. **Handover Agent** - Dedicated session continuation
10. **Learning Capture** - Corrections with stability penalties

### 8.3 Goodspec Weaknesses

1. Memory system "disabled by default"
2. Parallel research "planned for v0.2"
3. No causal memory tracking
4. No session deduplication
5. Simpler importance model (1-10 vs 6-tier)
6. No dedicated handover agent

### 8.4 System-Spec-Kit Weaknesses

1. High entry barrier (877-line SKILL.md)
2. No quick mode for simple fixes
3. No explicit contract gates
4. No status dashboard command
5. No setup wizard
6. No codebase mapping command
7. Missing dedicated agents (tester, designer, librarian)
8. No amend command for scope changes

---

## 9. Reddit Community Insights

From `/context/reddit_reference.md`:

### Validated Patterns
- Plan mode for non-trivial tasks ✓ (aligns with gates)
- Subagent liberation ✓ (multi-agent dispatch)
- Task file as living doc ✓ (checklist.md)
- Verify before done ✓ (completion verification)

### Novel Ideas
- **lessons.md** - Automatic learning capture on corrections
- **Staff Engineer Standard** - "Would a staff engineer approve?"
- **Diff Against Main** - Regression check before completion
- **Re-plan Protocol** - Stop and re-plan after 2-3 failures

### Tension Identified
"Don't ask for hand-holding" vs "Gate system asks questions first"

**Resolution:** Gates for PLANNING decisions, autonomy for EXECUTION within approved plan.

---

## 10. Key Metrics Comparison

| Metric | Goodspec | System-Spec-Kit |
|--------|----------|-----------------|
| Agents | 12 | 7 (+2 built-in) |
| Commands | 20 | 12 |
| Skills | 33 | ~15 |
| Templates | 7 | 67 |
| References | 18 | 23 |
| MCP Tools | ~6 | 22 |
| Research Steps | 3 | 9 |
| Memory Types | 6 | 9 cognitive types |
| Importance Levels | 10 | 6 tiers |
| Documentation Levels | 4 modes | 4 levels |

---

## 11. Conclusion

**Goodspec excels at:**
- User experience and onboarding
- Simplicity and progressive disclosure
- Contract gates with explicit confirmation
- Wave-based execution organization
- Deviation rules for autonomy boundaries

**System-Spec-Kit excels at:**
- Memory system sophistication
- Token efficiency (ANCHOR, deduplication)
- Failure resilience (circuit breaker, saga)
- Learning and correction tracking
- Causal memory for decision archaeology

**Recommended Strategy:**
Adopt Goodspec's UX patterns (contract gates, quick mode, status dashboard, setup wizard) while preserving our technical innovations (hybrid search, constitutional tier, FSRS decay, causal graph, session deduplication).

---

**Research Confidence:** HIGH
**Evidence Grade:** A (Primary sources - direct file analysis from both systems)
**Agents Used:** 30 parallel Opus agents
