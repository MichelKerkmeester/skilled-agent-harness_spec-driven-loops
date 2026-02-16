# SpecKit Refinement: ECP Analysis & Improvements
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->
<!-- SPECKIT_STATUS: COMPLETE -->
<!-- SPECKIT_LAST_MODIFIED: 2024-12-23T14:00:00Z -->

## 1. Overview

| Field | Value |
|-------|-------|
| **Feature Name** | SpecKit Refinement Based on ECP Research |
| **Type** | Research / System Improvement |
| **Priority** | High |
| **Status** | Research Complete |
| **Created** | 2024-12-23 |
| **Spec Folder** | specs/004-speckit/010-speckit-refinement |

---

## 2. Research Source: Extended Context Protocol (ECP)

### 2.1 ECP Core Philosophy

> "Conversation context is volatile, but the filesystem is persistent. So instead of relying on Claude to remember everything, you externalize project state to files."

> "The goal is to stay in one conversation and branch infinitely. When context fills up, you don't start over. You branch back to a checkpoint."

### 2.2 ECP Key Features

1. **Three State Files:**
   - `PROJECT_SPEC.md` - Requirements + decisions made + decisions rejected with reasons
   - `PROJECT_TASKS.md` - Full task breakdown with dependency mapping
   - `PROJECT_STATE.md` - Real-time progress, file completion status, current attempt

2. **Completion Markers:** Every generated file ends with a status marker

3. **Minimal Handoff:** ~50 word continuation format:
   ```
   CONTINUATION - Attempt 2
   Interrupted file: auth.ts:42
   Next action: Implement validateUser()
   ```

4. **Rigorous Q&A:** Three-tier questions (Strategic/Tactical/Operational)

5. **Pattern Synthesis:** After 10+ decisions, identify patterns for auto-application

6. **Project Type Modules:** Domain-specific coherence requirements

---

## 3. Gap Analysis Summary

### 3.1 Critical Gaps (P0)

| Gap | ECP Solution | SpecKit Current | Impact |
|-----|--------------|-----------------|--------|
| No real-time state tracking | PROJECT_STATE.md | Distributed across memory/checklist | **9/10** |
| No in-file completion markers | Markers on every file | External checklist.md only | **7/10** |
| Heavyweight handoffs | ~50 word minimal format | 67-line handover.md or 300+ line memory | **6/10** |
| Gate 0 lacks continuation guidance | Baked-in branch protocol | "Await user instruction" | **6/10** |

### 3.2 Important Gaps (P1)

| Gap | ECP Solution | SpecKit Current | Impact |
|-----|--------------|-----------------|--------|
| No decision rejection tracking | Explicit rejection log | Only in Level 3 decision-record.md | **5/10** |
| No continuation validation | State file verification | Validation only at completion | **5/10** |
| Implicit task dependencies | Explicit DAG mapping | Inline text mentions | **4/10** |
| Unstructured discovery | Tiered Q&A protocol | Optional [NEEDS CLARIFICATION] | **4/10** |

### 3.3 SpecKit Strengths (Keep)

| Feature | ECP Lacks | Why It's Better |
|---------|-----------|-----------------|
| Semantic Memory System | No semantic search | Searchable context across all sessions |
| Multi-Level Docs (1-3) | One-size-fits-all | Right-sized documentation to task |
| P0/P1/P2 Priority System | Binary complete/incomplete | Nuanced completion verification |
| Gate-Based Workflow | Manual discipline | Automated enforcement with hooks |
| Sub-folder Versioning | Manual file management | Clean iteration separation |

---

## 4. Recommendations

### 4.1 Priority Matrix

| Priority | Recommendation | Effort | Impact | ROI |
|----------|---------------|--------|--------|-----|
| **P0** | Add STATE.md template | 3/10 | 9/10 | **Highest** |
| **P0** | Add quick-continue.md template | 2/10 | 6/10 | High |
| **P0** | Enhance Gate 0 with branch protocol | 2/10 | 6/10 | High |
| **P1** | Add completion markers to templates | 2/10 | 7/10 | High |
| **P1** | Add decision rejection section to spec.md | 1/10 | 5/10 | High |
| **P1** | Add Gate 0.5 continuation validation | 3/10 | 5/10 | Medium |
| **P2** | Structured Q&A protocol | 5/10 | 4/10 | Low |
| **P2** | Task dependency mapping | 4/10 | 4/10 | Low |
| **Skip** | Pattern synthesis | 6/10 | 5/10 | Low |
| **Skip** | Project type modules | 7/10 | 3/10 | Negative |

### 4.2 The "80/20" Win

**Single highest-impact change:** Add `STATE.md` template

This captures 80% of ECP's benefit because:
- Eliminates "where was I?" problem
- Provides real-time project status visibility
- Enables sub-30-second session resumption
- Minimal disruption to existing workflows

---

## 5. Scope

### 5.1 In Scope

**Phase 1: Core State Tracking (P0)**
- [ ] Create STATE.md template
- [ ] Create quick-continue.md template
- [ ] Update Gate 0 with branch protocol

**Phase 2: Handover Command System (P0)**
- [ ] Create `/handover` command with variants (`:quick`, `:full`, `:auto`)
- [ ] Implement parallel Sonnet agent for full handover generation
- [ ] Add Gate 7: Context Health Monitoring (progressive enforcement)

**Phase 3: Template & Gate Enhancements (P1)**
- [ ] Add completion markers to existing templates
- [ ] Add "Decisions Rejected" section to spec.md
- [ ] Add Gate 0.5 continuation validation
- [ ] Integrate STATE.md auto-update with generate-context.js

### 5.2 Out of Scope

- Pattern synthesis feature (premature - usage patterns don't support)
- Project type modules (over-engineering risk)
- Checkpoint-based branching (already solved by sub-folders)
- Full ECP replication (different philosophies)

---

## 6. Success Criteria

- [ ] Session resumption time < 30 seconds (vs current ~5 minutes)
- [ ] No more "where was I?" questions after context recovery
- [ ] Real-time project status visible in single file
- [ ] Gate 0 compaction triggers actionable branch instructions
- [ ] Handover gets created in 80%+ of long sessions (enforcement works)
- [ ] `/handover` provides immediate quick-continue + background full handover
- [ ] All P0/P1 recommendations implemented

---

## 7. Handover System Design (Deep Analysis)

### 7.1 Problem Statement

Current handover "barely gets used" because:
1. **Reactive, not proactive**: Gate 0 triggers AFTER compaction, not before
2. **No urgency signal**: AI doesn't know when context is filling up
3. **Manual process**: User must request handover, AI doesn't auto-suggest
4. **Heavy template**: 67 lines is too much when context is already constrained

### 7.2 Solution: Progressive Enforcement + Parallel Execution

**Enforcement Mechanism (Gate 7: Context Health Monitor)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 7: CONTEXT HEALTH MONITOR [PROGRESSIVE]                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ SOFT TRIGGER (15 exchanges):                                                │
│   Display: "⚠️ 15+ exchanges in session. Consider /handover soon."         │
│   Action: Reminder only, continue work                                      │
│                                                                             │
│ FIRM TRIGGER (25 exchanges):                                                │
│   Display: "📋 25 exchanges reached. Recommend /handover now."              │
│   Action: Must acknowledge (A: Create now, B: Continue, C: Disable)         │
│                                                                             │
│ HARD TRIGGER (35 exchanges):                                                │
│   Display: "🛑 35 exchanges. Handover required before proceeding."          │
│   Action: Must create handover OR explicitly decline with reason            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Keyword Detection (Proactive Suggestion)**

When detected AND exchange count > 10, suggest handover:
- Session ending: "stopping", "done", "finished", "break", "later", "tomorrow"
- Context concern: "forgetting", "remember", "context", "long session"
- Complexity: "complicated", "complex", "many files", "lot of changes"
- Frustration: "again", "already said", "repeat", "told you"

### 7.3 Command Design: `/handover`

**Variants:**
| Command | Behavior |
|---------|----------|
| `/handover` | Quick-continue (immediate) + Full handover (Sonnet agent) |
| `/handover:quick` | Quick-continue only (fastest) |
| `/handover:full` | Quick + Sonnet agent for full handover.md |
| `/handover:auto` | Enable proactive handover triggers for session |

**Workflow: /handover (default)**

```
STEP 1: VALIDATE (immediate)
├─ Check: Is there an active spec folder?
│   └─ NO: "No active spec folder. Use /spec_kit:plan first."
└─ YES: Proceed

STEP 2: UPDATE STATE.md (immediate, main session)
├─ Phase: [current phase from plan.md]
├─ Active File: [last file touched]
├─ Last Action: [timestamp + brief description]
└─ Next Action: [inferred from context]

STEP 3: CREATE quick-continue.md (immediate, main session)
├─ CONTINUATION - Attempt [N]
├─ Interrupted: [file:line]
├─ Next: [single sentence]
├─ Load: STATE.md, checklist.md
└─ Blockers: [from conversation]

STEP 4: DISPLAY IMMEDIATE HANDOFF (to user)
├─ Show quick-continue content
├─ "Start new session with: /spec_kit:resume [spec-folder]"
└─ "Full handover generating in background..."

STEP 5: DISPATCH SONNET AGENT (parallel, background)
├─ Agent reads: spec.md, plan.md, tasks.md, STATE.md, 
│   quick-continue.md, checklist.md, recent memory files
├─ Agent creates: Full handover.md using template
├─ Agent saves: To spec folder
└─ Returns: "Full handover.md created at [path]"
```

**User Experience:**
- **Immediate (2-5s)**: Quick handoff displayed, ready to branch
- **Background (30-60s)**: Full handover notification when complete

### 7.4 Why Parallel Sonnet Agent?

**Arguments FOR:**
1. Context preservation - Main session doesn't consume tokens generating handover
2. Speed - Sonnet is faster than Opus for structured document generation
3. Parallel work - User can continue while handover generates
4. Fallback - Quick handoff works even if agent fails

**How Agent Gets Context:**
- Agent reads spec folder files (STATE.md, plan.md, tasks.md, etc.)
- Agent reads quick-continue.md (just created by main session)
- Agent infers session state from files
- No need to pass full conversation history

### 7.5 Gate Integration

**Gate 0 Enhancement:**
```
GATE 0: COMPACTION CHECK [HARD BLOCK] - ENHANCED

Current trigger: "Please continue the conversation from where we left it off..."

NEW Action: Display BRANCH PROTOCOL:

"⚠️ CONTEXT COMPACTION DETECTED

To continue efficiently, start a new conversation with this handoff:

CONTINUATION - Attempt [N]
Spec: [CURRENT_SPEC_PATH]
Last: [MOST_RECENT_COMPLETED_TASK]
Next: [NEXT_PENDING_TASK]
Verify: STATE.md, checklist.md

In the new session, run: /spec_kit:resume [spec-path]

Full handover available at: [spec-folder]/handover.md"
```

**Gate 5 Enhancement:**
- Auto-update STATE.md when saving context via generate-context.js

---

## 8. Refined Implementation Approach (Phased)

After deep analysis using Sequential Thinking, the full design may be over-engineered. Recommend a phased approach:

### 8.1 Phase 1: Minimum Viable Handover (MVP)
**Goal:** Solve 80% of the problem with 20% of the effort

| Component | Description | LOC |
|-----------|-------------|-----|
| quick-continue.md template | 10-line minimal handoff | 30 |
| /handover command (simple) | Creates quick-continue.md, no variants | 60 |
| Gate 0 enhancement | Auto-create quick-continue on compaction | 20 |
| Gate 7 (soft only) | Single heuristic-based reminder | 30 |

**Total:** ~140 LOC

**Key Simplifications:**
- No STATE.md initially (quick-continue covers 80%)
- No Sonnet agent (can add in Phase 3)
- No progressive enforcement (single soft reminder)
- No exchange counting (use heuristics instead)

### 8.2 Phase 2: Enhanced State Tracking
**Goal:** Add real-time state visibility (ECP's 80/20 win)

| Component | Description | LOC |
|-----------|-------------|-----|
| STATE.md template | Real-time project state | 60 |
| generate-context.js update | Auto-update STATE.md on save | 40 |
| /spec_kit:resume integration | Read STATE.md for resume | 30 |

**Total:** ~130 LOC (cumulative: ~270 LOC)

### 8.3 Phase 3: Full Handover System
**Goal:** Complete the vision if users request

| Component | Description | LOC |
|-----------|-------------|-----|
| /handover:full variant | Sonnet agent for comprehensive handover | 100 |
| Gate 7 progressive | 15/25/35 exchange thresholds | 50 |
| Gate 0.5 validation | Continuation state verification | 40 |
| Keyword detection | Proactive suggestion triggers | 30 |

**Total:** ~220 LOC (cumulative: ~490 LOC)

### 8.4 Phasing Rationale

**Why phase?**
1. **Validate before building:** Phase 1 tests if users actually use /handover
2. **Reduce risk:** Smaller changes are easier to test and rollback
3. **User feedback:** Phase 2/3 scope informed by Phase 1 usage
4. **Faster delivery:** Phase 1 can ship in 1-2 sessions

**Phase Triggers:**
- Phase 2: After Phase 1 validated AND users request "where am I" visibility
- Phase 3: After Phase 2 validated AND users request automatic enforcement

---

## 9. Technical Refinements

### 9.1 Exchange Counter: Heuristic Approach

**Problem:** Claude is stateless - can't count exchanges reliably.

**Solution:** Use observable heuristics instead:

```
GATE 7 HEURISTICS (no state needed):

Signals of "long session":
- Tool calls: 20+ in conversation history
- Files modified: 5+ unique files
- Time indicators: User mentions "been at this", "long session"
- Complexity: Multiple phases completed
- Frustration: "already said", "repeat", "told you"

Self-assessment (before complex actions):
"Session health check:
- Estimated tool calls: [scan history]
- Files modified: [list from context]
- Complexity: [low/medium/high]
- Recommendation: [none/consider/suggest handover]"
```

### 9.2 File Relationship Clarity

**Hierarchy:**
```
spec-folder/
├── spec.md            # WHAT (requirements)
├── plan.md            # HOW (approach)  
├── tasks.md           # BREAKDOWN (items)
├── checklist.md       # VERIFY (L2+)
├── STATE.md           # WHERE (current position) [Phase 2]
├── quick-continue.md  # BRANCH (minimal handoff) [Phase 1]
├── handover.md        # TRANSFER (comprehensive) [existing, optional]
└── memory/
    └── *.md           # HISTORY (conversation logs)
```

**Key Distinction:**
| File | Purpose | When Created | Typical Size |
|------|---------|--------------|--------------|
| STATE.md | Current position RIGHT NOW | Auto on save | 40-60 lines |
| quick-continue.md | How to continue in NEW session | On /handover | 10-15 lines |
| handover.md | Everything next person needs | On /handover:full | 100-150 lines |
| memory/*.md | What happened in PAST sessions | On /memory:save | 200-500 lines |

### 9.3 Integration with Existing Workflows

```
WORKFLOW INTEGRATION:

/handover (new)
├─ Creates quick-continue.md
├─ Phase 2: Also creates/updates STATE.md
├─ Phase 3: Optionally dispatches Sonnet → handover.md
└─ Does NOT auto-save memory (separate concern)

/memory:save (existing)
├─ Creates memory/*.md
├─ Phase 2: Also updates STATE.md
└─ Does NOT create handover

/spec_kit:resume (existing, enhanced)
├─ PRIORITY 1: Read quick-continue.md (if exists)
├─ PRIORITY 2: Read STATE.md (if exists)
├─ PRIORITY 3: Read handover.md (if exists, <24h old)
├─ PRIORITY 4: Read recent memory/*.md
└─ Synthesize context from available sources

Gate 0 (enhanced)
├─ Auto-creates quick-continue.md
├─ Displays content
└─ Instructs: "/spec_kit:resume [path]"
```

### 9.4 Edge Cases

| Edge Case | Handling |
|-----------|----------|
| No spec folder | Prompt to create/select before /handover |
| Sonnet agent fails | Quick-continue already saved, fail gracefully |
| STATE.md stale (>24h) | Warn user, offer reset/continue/review |
| Conflicting state | Gate 0.5 catches, asks for resolution |
| User disables Gate 7 | Honor for session, re-enable at critical threshold |
| Multiple quick-continue | Overwrite (only latest matters) |
| handover.md exists | Archive with timestamp, create new |

### 9.5 Sonnet Agent Prompt (Phase 3)

```yaml
role: Session Handover Specialist
purpose: Create comprehensive handover from spec folder state

instructions: |
  READ from {spec_folder}:
  - spec.md, plan.md, tasks.md
  - STATE.md, quick-continue.md (if exist)
  - checklist.md (if exists)
  - memory/*.md (last 2-3 files)
  
  CREATE handover.md with:
  1. Executive Summary (3-5 sentences)
  2. Current State (phase, progress %, last/next action)
  3. Key Decisions Made (list with rationale)
  4. Blockers & Challenges
  5. Files Modified (list with change description)
  6. Context for Next Session
  7. Incomplete Verification Items (from checklist.md)
  
  Target: 100-150 lines, concise but complete.

input:
  spec_folder: string
  
output:
  handover_path: string
  summary: string
```

---

## 10. Research Methodology

### 10.1 Agents Deployed

| Agent | Focus Area | Key Finding |
|-------|-----------|-------------|
| Agent 1 | State Management | STATE.md is critical gap |
| Agent 2 | Branching/Continuation | Gate 0 needs branch protocol |
| Agent 3 | Pattern Synthesis | Defer - premature for usage patterns |
| Agent 4 | Discovery/Q&A | Questions should be mandatory gates |
| Agent 5 | Synthesis | "80/20" win is STATE.md |

### 10.2 Source Materials Analyzed

- ECP description (user-provided research)
- `.opencode/skill/system-spec-kit/SKILL.md` (717 lines)
- `AGENTS.md` (624 lines)
- `AGENTS (Universal).md` (616 lines)
- `.opencode/skill/system-spec-kit/templates/handover.md` (67 lines)
- `.opencode/command/spec_kit/resume.md` (375 lines)
- All 9 SpecKit templates
- All 5 SpecKit command workflows

---

## 9. Related Specs

- `specs/004-speckit/` - Parent SpecKit improvement area
- `specs/005-memory/` - Memory system (complementary)
- `specs/006-opencode/` - OpenCode configuration

---

## 10. Appendix: ECP vs SpecKit Comparison Matrix

| Feature | ECP | SpecKit | Winner |
|---------|-----|---------|--------|
| Dedicated state tracking | PROJECT_STATE.md | Distributed | **ECP** |
| File completion markers | Every file | External checklist | **ECP** |
| Decision rejection tracking | Explicit in SPEC | Level 3 only | **ECP** |
| Semantic memory | None | Full MCP system | **SpecKit** |
| Multi-level documentation | One size | L1/L2/L3 | **SpecKit** |
| Workflow enforcement | Manual | Gates + Hooks | **SpecKit** |
| Priority-based verification | Binary | P0/P1/P2 | **SpecKit** |
| Session handoff | 50 words | 67-300+ lines | **ECP** |
| Resume workflow | Manual | /spec_kit:resume | **SpecKit** |
| Iteration management | Manual files | Sub-folders | **SpecKit** |

**Overall Assessment:** Hybrid approach optimal - adopt ECP's state tracking while keeping SpecKit's semantic memory and workflow enforcement.
