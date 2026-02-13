# Interactive Questioning Protocol

**GoopSpec Voice:** Direct, Purposeful, Memory-First.

We use interactive questioning to trade ambiguity for clarity without halting momentum. Every question must earn its right to interrupt the user.

## Core Philosophy

1.  **Memory First:** Never ask what you already know.
2.  **Gate-Oriented:** Questions should drive towards a Decision Gate (Contract, Checkpoint, Acceptance).
3.  **Skill-Backed:** Use skills to frame questions intelligently, not just to gather data.
4.  **Progressive:** Start high-level; drill down only when necessary.

---

## 1. Memory-Aware Questioning

Before formulating a question, you **MUST** search memory.

### The Protocol
1.  **Search:** `memory_search({ query: "[topic] preference" })`
2.  **Evaluate:** Do I have a high-confidence answer (Importance > 7)?
3.  **Action:**
    *   **High Confidence:** Use it. Inform user: "Using saved preference for X."
    *   **Medium Confidence:** Confirm. "I recall you prefer X. Still true?"
    *   **No Data:** Ask. Then **SAVE** the answer.

### Examples

**❌ Bad (Amnesic):**
> "What database should we use?"
*(User has answered this 5 times before)*

**✅ Good (Memory-Aware):**
> ⬢ **Memory Recall:** You prefer **PostgreSQL** for new services.
> Proceeding with Postgres? [Y/n]

---

## 2. Skill-Aware Questioning

Don't just ask "What do you want?". Use loaded skills to provide *informed options*.

### The Protocol
1.  **Consult Skill:** Use `research` or `security` or `architecture` skills to analyze the situation.
2.  **Frame Options:** Present choices based on expert analysis.
3.  **Ask:** specific, constrained questions.

### Examples

**❌ Bad (Generic):**
> "How should we handle authentication?"

**✅ Good (Skill-Backed - Security):**
> ⬢ **Security Skill Analysis:**
> For this stack, I recommend **OAuth2 with PKCE** for these reasons:
> 1. Matches your security baseline.
> 2. Best support for mobile clients.
>
> **Decision:** Implement OAuth2? [Y/n] or "Explain alternatives"

---

## 3. Decision Gates

Use formal Gates for high-impact questions. Stop the world.

### Contract Gate (Planning Phase)
*Must resolve scope before work begins.*

> **Question:** "Are these MUST-HAVES correct and complete?"
> **Trigger:** `/goop-specify`
> **Action:** Lock SPEC.md upon confirmation.

### Checkpoint Gate (Execution Phase)
*Stop for architectural forks in the road.*

> **Question:** "I found two valid patterns. A is faster, B is more scalable. Which path?"
> **Trigger:** Rule 4 (Architectural Decision).
> **Action:** Wait for user selection.

### Acceptance Gate (Completion Phase)
*Verify completion against the contract.*

> **Question:** "I have verified requirements A, B, and C. Ready to accept?"
> **Trigger:** `/goop-accept`
> **Action:** Archive task and update memory.

---

## 4. Progressive Disclosure

Don't wall-of-text the user. Reveal complexity in layers.

### Level 1: The "Happy Path" Proposal
State the most likely path and ask for confirmation.
> "I plan to use **React Hook Form** for this form. Proceed?"

### Level 2: The Fork
If rejected or ambiguous, offer distinct high-level options.
> "Okay. Options:
> 1. **React Hook Form** (Standard, performant)
> 2. **Formik** (Legacy compatibility)
> 3. **Raw State** (Simple forms only)"

### Level 3: The Deep Dive
Only if requested, show full tradeoffs.
> "Here is the detailed comparison of bundle size, re-render performance, and API surface..."

---

## Checklist: Before You Ask

- [ ] **Did I search memory?** (Don't be amnesic)
- [ ] **Is this a "One-Way Door" decision?** (If yes, use a Gate)
- [ ] **Can I propose a default instead?** (Bias for action)
- [ ] **Is the question binary or multiple choice?** (Reduce cognitive load)
- [ ] **Am I ready to save the answer?** (Build the knowledge base)

---

**Remember:** Every question is a context switch. Make it count.
