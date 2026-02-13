# Implementation Plan: Remaining Deferred Work

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (AI agent knowledge base files) |
| **Framework** | Barter AI agent system (8 agents, thin orchestrator pattern) |
| **Storage** | File-based knowledge base per agent |
| **Testing** | Manual verification sweeps + grep-based consistency checks |

### Overview

This plan covers two deferred work streams: (1) a full audit and bug-fix pass on both LinkedIn agents (Nigel de Lange and Pieter Bertram) using the same 21-category taxonomy from the TikTok audit, and (2) creating a global token budget document (M-05) at `0. Global (Shared)/system/`. The LinkedIn audits run in parallel; M-05 is independent and can run alongside.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] TikTok audit taxonomy available as reference (specs/003-tiktok-audit/)

### Definition of Done
- [ ] All acceptance criteria met (zero CRITICAL/HIGH findings)
- [ ] Verification sweeps pass at 100%
- [ ] Docs updated (spec/plan/tasks reflect final state)
- [ ] Token budget documentation complete as global shared doc (M-05)

---

## 3. ARCHITECTURE

### Pattern
File-based knowledge base with AGENTS.md thin orchestrator and System Prompt as single source of truth.

### Key Components
- **AGENTS.md**: Thin orchestrator per agent (role, boundaries, reading instructions)
- **System Prompt**: Core routing, rules, scoring, commands
- **Knowledge Base**: Rules, context, voice, templates per agent
- **Global Shared**: Human Voice base rules, Brand Context base, Canonical Stats Registry, Token Budget (M-05)

### Data Flow
User request → AGENTS.md (role enforcement) → System Prompt (routing) → Knowledge Base documents (loaded per routing logic) → Output

---

## 4. IMPLEMENTATION PHASES

### Phase 1: LinkedIn Audits — Nigel & Pieter (PARALLEL)

**Nigel de Lange:**
- [ ] Read all Nigel knowledge base files (system, rules, context, voice)
- [ ] Apply 21-category bug taxonomy from TikTok audit
- [ ] Produce audit report with severity ratings
- [ ] Categorize findings: CRITICAL / HIGH / MEDIUM / LOW

**Pieter Bertram (in parallel):**
- [ ] Read all Pieter knowledge base files (system, rules, context, voice)
- [ ] Apply same 21-category bug taxonomy
- [ ] Produce audit report with severity ratings
- [ ] Note shared patterns between Nigel and Pieter findings

### Phase 2: LinkedIn Bug Fixes
- [ ] Fix all CRITICAL findings (both agents)
- [ ] Fix all HIGH findings (both agents)
- [ ] Fix all MEDIUM findings (both agents)
- [ ] Fix all LOW findings (both agents)
- [ ] Run verification sweep per agent

### Phase 3: Token Budget Documentation (M-05)
- [ ] Research token budget patterns across all agents using DEPTH
- [ ] Draft token budget document following Global shared file conventions (metadata header, Loading Condition, Purpose, Scope)
- [ ] Create `0. Global (Shared)/system/System - Token Budget - v0.100.md`
- [ ] Add symlinks or loading references in applicable agent AGENTS.md / system prompts
- [ ] Verify document is discoverable by all DEPTH-using agents

### Phase 4: Final Verification
- [ ] Verification sweep: Nigel de Lange (all fixes confirmed)
- [ ] Verification sweep: Pieter Bertram (all fixes confirmed)
- [ ] Verification sweep: Global token budget doc exists at `0. Global (Shared)/system/` and is referenced
- [ ] No regressions in previously fixed agents
- [ ] Update spec/plan/tasks to reflect completion

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Cross-reference consistency across all files | grep/rg |
| Section audit | Section numbering, header format, metadata | Manual read + grep |
| Diff check | Before/after comparison of edited files | Manual review |
| Regression | Spot-check TikTok, Copywriter, etc. unchanged | grep for known patterns |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TikTok audit taxonomy (specs/003-tiktok-audit/) | Internal | Green | Cannot start audit without reference methodology |
| Sessions 3-5 refactoring completed | Internal | Green | Files must be in current state |
| Sequential Thinking MCP | Tool | Green | Used for audit analysis |

---

## 7. ROLLBACK PLAN

- **Trigger**: Audit fixes introduce regressions or break existing agent behavior
- **Procedure**: Git revert to pre-fix state, re-audit the specific file

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Nigel + Pieter Audit, PARALLEL) ──► Phase 2 (Bug Fixes) ──┐
                                                                     ├──► Phase 4 (Final Verification)
Phase 3 (M-05 Token Budget) ───────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: LinkedIn Audits (PARALLEL) | None | Phase 2 |
| Phase 2: Bug Fixes | Phase 1 | Phase 4 |
| Phase 3: M-05 Token Budget | None | Phase 4 |
| Phase 4: Final Verification | Phase 2, Phase 3 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: LinkedIn Audits (PARALLEL) | Medium | 1-2 sessions |
| Phase 2: Bug Fixes | High | 2-3 sessions |
| Phase 3: M-05 Token Budget | Low | 1 session |
| Phase 4: Final Verification | Low | 0.5 session |
| **Total** | | **4.5-6.5 sessions** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Current file state verified before edits
- [ ] Git branch created for audit fixes
- [ ] Backup exists in z — Back-up/ for reference

### Rollback Procedure
1. Identify the specific file and fix that caused regression
2. Git revert the specific commit or manually restore from backup
3. Re-run verification sweep to confirm rollback
4. Document the issue and revise the fix approach

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are to markdown files, fully reversible via git

---
