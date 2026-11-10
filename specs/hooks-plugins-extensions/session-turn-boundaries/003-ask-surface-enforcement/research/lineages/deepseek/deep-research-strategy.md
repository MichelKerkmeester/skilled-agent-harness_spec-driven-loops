---
title: Deep Research Strategy - Ask-Surface Enforcement
description: Strategy packet for the deepseek fan-out lineage researching native ask-question surfaces and turn-end enforcement.
---

# Deep Research Strategy - Ask-Surface Enforcement

## 1. OVERVIEW

### Purpose

Persistent brain for the `deepseek` lineage. Records what to investigate, what worked, what failed, and where to focus next across five iterations.

### Mutability

Analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Make an agent ask the operator for a decision through its runtime's native ask-question tool instead of ending a turn with a prose A/B/C option menu: prove the tool and the enforceable turn-end event for Claude Code, Codex, Pi, OpenCode, Devin, Cursor, DSH and Hermes, define a low-false-positive detector, wire it through the hook registry, and amend the rule text.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Per runtime: does an ask tool exist, what is its exact name, and is it always available or gated by a mode or flag?
- [x] Per runtime: which hook or plugin event can deterministically detect a turn that ends in a prose option menu with no ask-tool call, and block or re-prompt it? Which events can only observe?
- [x] What detector heuristic works (lettered or numbered option list plus a question near the end of the last assistant message, with no ask-tool call in the turn), and what is its false-positive risk on ordinary numbered steps, summaries and code blocks?
- [x] How should this be wired through hook-registry.json, sync-hook-registrations.cjs and the .skilled/hooks/<name>/<runtime>/ layout, reusing the decision-capture adapters, with the loop guard, sync versus async, and the escape hatch?
- [x] What exact rule-text amendments should go into communication-handoff.md §4/§5 and AGENTS.md Gate 3 inside the REPO RULES.md ask-surface carve-out, and should the prose fallback stay for runtimes without a tool?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not implementing the hook in this run; report findings, wiring design and a ranked plan only.
- Not editing any rule file, hook registry or settings file outside the lineage directory.
- Not re-litigating whether the operator wants enforcement; that decision is already made.

---

## 5. STOP CONDITIONS

- Five iterations completed (`max-iterations` stop policy).
- No new evidence available for a question after two consecutive iterations on the same focus.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Per runtime: does an ask tool exist, what is its exact name, and is it always available or gated by a mode or flag?
- Per runtime: which hook or plugin event can deterministically detect a turn that ends in a prose option menu with no ask-tool call, and block or re-prompt it? Which events can only observe?
- What detector heuristic works (lettered or numbered option list plus a question near the end of the last assistant message, with no ask-tool call in the turn), and what is its false-positive risk on ordinary numbered steps, summaries and code blocks?
- How should this be wired through hook-registry.json, sync-hook-registrations.cjs and the .skilled/hooks/<name>/<runtime>/ layout, reusing the decision-capture adapters, with the loop guard, sync versus async, and the escape hatch?
- What exact rule-text amendments should go into communication-handoff.md §4/§5 and AGENTS.md Gate 3 inside the REPO RULES.md ask-surface carve-out, and should the prose fallback stay for runtimes without a tool?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the platform docs beside the live settings file settled the (iteration 1)
- the decision-capture sweeps are a per-runtime registry of proven tool (iteration 2)
- reading each runtime's own adapter table gave a tool name and a gate in (iteration 3)
- reading the detector's constants first made the false-positive analysis (iteration 4)
- the carve-out sentence is the binding constraint, and reading it beside (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed. The transcript route was rejected on doc evidence (iteration 1)
- the Codex Stop question could not be closed locally. The repo's (iteration 2)
- Cursor and Devin have no local hook-block contract, so their (iteration 3)
- nothing failed. The detector's option grammar is the one real gap, (iteration 4)
- nothing failed. The registry's runtime coverage was the one (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the

### **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn

### **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a

### **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the

### **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but

### **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming

### **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on

### **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope", -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope",
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope",

### **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that

### **Reading `transcript_path` to recover the last message.** The hooks reference states the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading `transcript_path` to recover the last message.** The hooks reference states the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `transcript_path` to recover the last message.** The hooks reference states the

### **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and

### **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate

### **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so

### Codex Stop blocking: no repository contract, and a web search for the upstream hook contract -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Codex Stop blocking: no repository contract, and a web search for the upstream hook contract
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Codex Stop blocking: no repository contract, and a web search for the upstream hook contract

### Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc

### None this iteration. The Claude path is fully evidenced. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None this iteration. The Claude path is fully evidenced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. The Claude path is fully evidenced.

### None. The detector's limits are documented in its own constants and tests. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None. The detector's limits are documented in its own constants and tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The detector's limits are documented in its own constants and tests.

### None. The wiring surface is fully mapped. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None. The wiring surface is fully mapped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The wiring surface is fully mapped.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but (iteration 1)
- **Reading `transcript_path` to recover the last message.** The hooks reference states the (iteration 1)
- None this iteration. The Claude path is fully evidenced. (iteration 1)
- **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a (iteration 2)
- **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the (iteration 2)
- **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so (iteration 2)
- Codex Stop blocking: no repository contract, and a web search for the upstream hook contract (iteration 2)
- **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming (iteration 3)
- **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on (iteration 3)
- **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope", (iteration 3)
- Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc (iteration 3)
- **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn (iteration 4)
- **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate (iteration 4)
- None. The detector's limits are documented in its own constants and tests. (iteration 4)
- **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the (iteration 5)
- **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that (iteration 5)
- **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and (iteration 5)
- None. The wiring surface is fully mapped. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `.skilled/repo-rules/communication-handoff.md` §4-§5, `AGENTS.md` §2 Gate 3, `REPO RULES.md` §4 ask-surface carve-out, `.claude/settings.json` hooks, `.skilled/hooks/decision-capture/`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `sync-hook-registrations.cjs`.
- Reuse candidates: `completion-evidence-stop` Stop sentinel (Claude/Codex/Devin) and its Cursor `afterAgentResponse` sibling; the `decision-capture` per-runtime adapters and transcript readers; `chat-questions.mjs` option-line detector.
- Integration points: hook registry entry, generated `.claude/settings.json` / `.codex/hooks.json` / `.cursor/hooks.json` / `.devin/hooks.v1.json`, Pi extension symlink, OpenCode plugin.
- Constraints: read-only outside the lineage; Hermes may no longer exist in this repo.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-08T10:19:14Z
