---
title: Deep Research Strategy - cross-cli command surfacing
description: Cross-CLI usefulness angle for command surfacing after planned phases 005-008.
---

# Deep Research Strategy - cross-cli

## 1. OVERVIEW

### Purpose

Establish, per runtime (claude, codex, opencode, pi, devin, dsh), whether a model starts an advisor-offered command, what stops it, and which post-005-008 change raises the start rate for the least work.

### Usage

- Reads evidence from the parent packet (`008-command-surfacing-build`) and the pre-arm behaviour log.
- Writes only inside the lineage directory.
- Reducer owns Sections 3, 6, 7-11A.

### Question Injection Surface

`inbox.jsonl` in this lineage directory if an external question appears.

---

## 2. TOPIC
Cross-CLI command surfacing after planned phases 005-008: per-runtime evidence of whether a model starts an offered advisor command, what stops it, and which fix raises start rate.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which hook or pointer surface must each of the six runtimes have before an advisor recommendation is even offered, and which runtimes are unwired in the pre-arm log?
- [x] Why does the model start so few offered commands on each runtime (claude 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7), and what does the missing COMMAND line prove about the brief?
- [x] Which change to the brief contract or hook wiring raises start rate per runtime, and how does it extend rather than duplicate planned phases 005-008?
- [x] How must command files be laid out and installed so a fresh external repository exposes every command on every runtime, given the g5 skill.md folder-shadowing result?
- [x] What is the cheapest reliable way to measure start rate across six runtimes without running pi, ollama, or the full test suite?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending what phases 005-008 already plan.
- Implementing any fix (research only).
- The UX and performance angles owned by sibling lineages, except where they change per-runtime start behaviour.
- Re-running pi, starting or stopping ollama, or running the full vitest suite.
- Reading or printing holdout-split rows from command-prompts.jsonl.

---

## 5. STOP CONDITIONS

- Max 5 iterations, convergence threshold 0.05 after the 3-iteration floor.
- Stop early only at legal convergence; record the reason in research.md.
- No writes outside this lineage directory; spec.md writeback and continuity save are deferred and recorded as scope decisions.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which hook or pointer surface must each of the six runtimes have before an advisor recommendation is even offered, and which runtimes are unwired in the pre-arm log?
- Why does the model start so few offered commands on each runtime (claude 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7), and what does the missing COMMAND line prove about the brief?
- Which change to the brief contract or hook wiring raises start rate per runtime, and how does it extend rather than duplicate planned phases 005-008?
- How must command files be laid out and installed so a fresh external repository exposes every command on every runtime, given the g5 skill.md folder-shadowing result?
- What is the cheapest reliable way to measure start rate across six runtimes without running pi, ollama, or the full test suite?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- scoring the log before reading plans exposed that the baseline measures the wrong thing; the plan's own ADR-002 confirms it. Reading each runtime's shim rather than assuming "not wired" avoided a wrong root cause. (iteration 1)
- checking the raw transcript against the normalized one exposed a blind spot the scorer design hides; reading the runner's argv exposed the Codex trust gap that a rate alone would have blamed on the model. (iteration 2)
- reading the install guide as a user would exposed two production blockers (Codex approval, DSH absence) that a repo-internal view hides; the renderer's existing `runtime` option made the head change cheap enough to rank. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- no exported per-run score prevented an exact uncapped rate; the bound is the honest substitute. (iteration 1)
- the G5 artifact could not be tied to the real mirror path; the verification is named instead of assumed. (iteration 2)
- no artifact exists for failed host-command invocations, so that path stays a gap. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53]

### **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry.

### **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54]

### **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases.

### **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22]

### **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

### A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path.

### Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81]

### No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed.

### Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate.

### The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"The hook is not wired on most runtimes."** False: five of six have a live delivery path in the repo, and Codex/Devin proxy the same adapter as Claude. Wiring alone does not explain the rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] (iteration 1)
- **"The hook is too slow, so the brief is dropped."** Not supported by the measured data: median hook latency is about 200 ms against a 2,500 ms budget, and a warm embed is 6.57 ms median. Cold-start cost is real but unmeasured; it is not the observed cause. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:40] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] (iteration 1)
- Cursor is out of scope: its reader is gated, so it is reported as not measured by design. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:81] (iteration 1)
- Recounting starts from run-log rows alone cannot separate capped from started per row, because the scorer's per-run result is not exported. The honest output is the bound in Finding 3, not an exact uncapped rate. (iteration 1)
- **"A `COMMAND:` line proves the model saw an offer."** DSH emitted two `COMMAND:` tokens in six sampled sessions with no advisor row enabled, so the token can appear without a brief. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] (iteration 2)
- **"Codex declined the command."** It never received a brief in the arena: hooks are unapproved there and no `Advisor:` line exists in any sampled Codex transcript. [SOURCE: .codex/README.md:54] (iteration 2)
- A G5 fix cannot be verified from the existing artifacts; the definitive listing needs a throwaway repo and a temporary `CLAUDE_CONFIG_DIR`. Recording it as the verification step is more honest than treating the stand-in folder as the real path. (iteration 2)
- The scorer's `normalize` discards hook context for Claude, so post-processing transcripts cannot recover "was it offered" without either reading raw prompt records (runtime-specific) or recording the brief at hook time. (iteration 2)
- **"Add the document path to every runtime's brief."** Unnecessary token cost on Claude and OpenCode, which can resolve the command through their own surfaces; the change is worth it only on hosts with no registry. (iteration 3)
- **"Ship 005 and 006 and the start rate rises."** That is the planned path and cannot be recommended; it is also unverifiable until the two measurement facts exist. The recommendations above are what remains after those phases. (iteration 3)
- No existing artifact measures a failed host-command invocation (for example a Codex `/create:readme` typed into an exec turn). The scorer sees tool calls and text, not a rejected slash token, so this gap is recorded rather than guessed. (iteration 3)

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

Evidence pointers (read-only):

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md`, `decision-record.md`, `goal.md`.
- Child plans/tasks: `005-recommendation-contract-and-brief`, `006-gate-2-binding-and-runtime-pointers`, `007-per-runtime-behaviour-proof`, `008-embedder-setup-and-cost`.
- `007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl` scored with `score-command-transcripts.mjs --summary` (baseline: claude 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7; COMMAND line 0 everywhere).
- `007-per-runtime-behaviour-proof/scratch/g5/result.txt` (skill.md shadows sibling commands as one Skill entry on Claude Code).
- `008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt` and `measure-embedder-cost.mjs`.
- Runtime hook/pointer surfaces under `.claude/`, `.codex/`, `.opencode/`, `.pi/`, `.devin/`, `.dsh/`, and the advisor runtime `runtime/` tree.

### Bounded Context Snapshot

- Source pointers: advisor hook, brief renderer, gate-2 binding, runtime pointer installers.
- Reuse candidates: existing scorer `score-command-transcripts.mjs`, existing hooks.
- Integration points: hook brief text, command file layout, per-runtime config.
- Constraints: planned-not-built phases, read-only git, no pi/ollama.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-12T22:50:26.300Z
