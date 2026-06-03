---
title: Universal Debugging Methodology
description: Stack-agnostic 5-phase debugging approach applicable to any technology.
---

# Universal Debugging Methodology

Stack-agnostic debugging framework that applies to any technology: frontend, backend, infrastructure, data, or mobile.

---

## 1. OVERVIEW

### Purpose

Provides a universal debugging methodology that works across all technology stacks. Whether debugging JavaScript in a browser, Python on a server, Go microservices, Docker containers, or SQL queries - the same 5-phase approach applies.

### When to Use

- Debugging any code issue (frontend, backend, infrastructure)
- When `@debug` is dispatched via the Task tool (dispatch requires explicit user/operator opt-in; `@debug` is never auto-dispatched)
- After 3+ failed fix attempts on the same error, which justifies *offering* `@debug` to the operator — not dispatching automatically
- When systematic debugging approach is needed

### Core Principle

**Find root cause BEFORE fixing.** Symptom fixes are failure.

---

## 2. THE FIVE PHASES

Complete each phase before proceeding to the next.

**Hard boundary:** Do not edit source files before Phase 5. Phases 1-4 observe, analyze, hypothesize, and challenge; any command run before Phase 5 must gather evidence, not mutate source.

### Phase 1: OBSERVE

**Goal:** Capture complete context before attempting any fix.

| Action | How |
|--------|-----|
| Capture full error output | Copy complete error message, stack trace, logs |
| Document reproduction steps | Exact sequence to trigger the issue |
| Identify affected locations | Files, functions, line numbers |
| Note environment details | Versions, configs, platform |

**Key questions:**
- What is the exact error message?
- Can I reproduce this consistently?
- What changed recently? (git log, deploys, configs)
- What's working vs. what's broken?

### Phase 2: ANALYZE

**Goal:** Understand the pattern before forming hypotheses.

| Action | How |
|--------|-----|
| Find working examples | Similar code that works correctly |
| Read documentation | Official docs, API references |
| List differences | What's different between working and broken? |
| Map dependencies | What does this code depend on? |

**Key questions:**
- Is there similar code that works?
- What does the documentation say?
- What assumptions is the code making?
- What dependencies might be involved?

### Phase 3: HYPOTHESIZE

**Goal:** Form and test specific theories.

| Action | How |
|--------|-----|
| State hypothesis clearly | "X causes Y because Z" |
| Make minimal change | Test ONE variable at a time |
| Verify result | Did it work or not? |
| Iterate or conclude | Form new hypothesis if needed |

**Rules:**
- One hypothesis at a time
- Form ranked theories; do NOT edit source code in this phase
- Any command run here gathers evidence, it does not mutate source
- If hypothesis fails, form a NEW one (don't add more fixes)

### Phase 4: CHALLENGE / RE-RANK

**Goal:** Adversarially challenge the ranked hypotheses before any fix.

| Action | How |
|--------|-----|
| Challenge each hypothesis | Ask "what would disprove this?" and look for counter-evidence |
| Re-rank by surviving evidence | Demote theories with counter-evidence; promote those that survive |
| Use prior failed attempts as evidence | Treat past failures as counter-evidence, not as the starting hypothesis |
| Confirm the leading theory | Proceed to Phase 5 with the post-challenge ranking, not the original |

**Rules:**
- No source edits in this phase — only read-only searches, inspection, reproductions, or non-mutating tests
- Do not let a prior failed attempt become the starting hypothesis; use it to challenge or deprioritize theories

### Phase 5: FIX

**Goal:** Implement and verify the root cause fix.

| Action | How |
|--------|-----|
| Fix root cause | Not the symptom |
| Verify thoroughly | Test across relevant contexts |
| Document why | Explain the fix in comments/commits |
| Check for regressions | Did fixing this break something else? |

**If 3+ fixes fail:** STOP. Question the architecture:
- Is the approach fundamentally sound?
- Are we fighting against the platform/framework?
- Should we refactor instead of patch?

---

## 3. VERIFICATION CHECKLIST

After any debugging session:

```
□ Root cause identified and documented
□ Fix addresses cause, not symptom
□ Tested in relevant contexts
□ No new errors introduced
□ Code comments explain WHY fix was needed
□ Single fix resolved issue (not multiple attempts)
```

---

## 4. COMMON PITFALLS

| Pitfall | Solution |
|---------|----------|
| Skipping to fix without understanding | Complete Phase 1-2 first |
| Testing multiple changes at once | One variable at a time |
| Fixing symptoms | Trace back to root cause |
| Ignoring error messages | Read the FULL message and stack trace |
| Assuming you know the cause | Verify with evidence |
| Continuing after 3+ failed fixes | Stop and question approach |

---

## 5. WHEN TO ESCALATE

Escalate by *offering* `@debug` to the operator (dispatch via the Task tool requires explicit user/operator opt-in — `@debug` is never auto-dispatched) when:
- Same error persists after 3+ fix attempts (this justifies offering `@debug`, not dispatching it automatically)
- Need fresh perspective on complex issue
- Stuck in a debugging loop
- Issue requires specialized knowledge

---

## 6. STACK-SPECIFIC NOTES

The 5-phase methodology is universal. Tools vary by stack:

| Stack | Error Capture | Debugging Tools |
|-------|---------------|-----------------|
| Browser/JS | DevTools Console | Chrome DevTools, debugger |
| Node.js | console, process | node --inspect, debugger |
| Python | traceback, logging | pdb, IDE debugger |
| Go | log, panic output | dlv (Delve) |
| Rust | Result/Error, panic | rust-analyzer, LLDB |
| Docker | container logs | docker logs, compose logs |
| SQL | query errors | EXPLAIN ANALYZE |

The methodology stays the same: **Observe → Analyze → Hypothesize → Challenge/Re-rank → Fix**.

---

## 7. RELATED RESOURCES

### Commands

| Command | Purpose |
|---------|---------|
| `Task tool -> @debug` | Delegate debugging to the fresh-perspective specialist with full context |

### Templates

| Template | Purpose |
|----------|---------|
| `debug-delegation.md` | Debug report template for sub-agent handoff |
