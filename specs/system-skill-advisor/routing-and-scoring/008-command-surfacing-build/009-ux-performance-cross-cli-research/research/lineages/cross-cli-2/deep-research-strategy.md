---
title: Deep Research Strategy - cross-cli-2 delivery and obedience
description: Segment-two cross-CLI lane for command surfacing after phases 005, 006, 008 and 010.
---

# Deep Research Strategy - cross-cli-2

## 1. OVERVIEW

### Purpose

Establish, per runtime, whether an offered advisor command reaches the model, whether delivery is provable from a record the runtime writes, and what makes the model start the offer without an unsafe write.

### Usage

- Reads evidence from the parent packet (`008-command-surfacing-build`), phases 005, 006, 008, 010 and 011, and the phase 007 after arm.
- Writes only inside this lineage directory.
- Reducer owns Sections 3, 6, 7-11A.

### Question Injection Surface

`inbox.jsonl` in this lineage directory if an external question appears.

---

## 2. TOPIC
Cross-CLI delivery, proof of delivery and obedience after phases 005, 006, 008 and 010: per-runtime evidence that an offered command reaches the model, that delivery is provable from a committed record, and that the model takes the offer without an unsafe write.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which runtime loses the Gate 2 policy before the model sees it, and which single file per runtime decides that: Codex's hook approval key, Claude's instruction file, or the shared session readers?
- [x] Can brief delivery be proven for every runtime from a record the runtime itself writes, and what exactly must be recorded at hook time?
- [x] Why do 4 unsafe runs remain, and are they delivery failures, obedience failures, or routing deferrals?
- [x] What makes a model emit the COMMAND: line or take an offered command, and which contract change raises obedience without raising false offers?
- [x] Which change per runtime raises measured starts for the least risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [159,50,20,5])?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending anything phases 005, 006, 008, 010 or 011 built or plans.
- Implementing any fix (research only).
- The offer-rate and semantic-lane angle owned by the offer-reach lineage.
- Brief wording, byte cost and install UX owned by the ux-cost-2 lineage, except where they change delivery or obedience.
- Starting CLI, arena or daemon sessions; running ollama; editing anything outside this lineage.
- Reading or printing holdout prompt text from `command-prompts.jsonl`.

---

## 5. STOP CONDITIONS

- Max 4 iterations, convergence threshold 0.05 after the 3-iteration floor.
- Stop early only at legal convergence; record the reason in research.md.
- No writes outside this lineage directory; spec.md writeback and continuity save are deferred and recorded as scope decisions.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which runtime loses the Gate 2 policy before the model sees it, and which single file per runtime decides that: Codex's hook approval key, Claude's instruction file, or the shared session readers?
- Can brief delivery be proven for every runtime from a record the runtime itself writes, and what exactly must be recorded at hook time?
- Why do 4 unsafe runs remain, and are they delivery failures, obedience failures, or routing deferrals?
- What makes a model emit the COMMAND: line or take an offered command, and which contract change raises obedience without raising false offers?
- Which change per runtime raises measured starts for the least risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [159,50,20,5])?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the installer and the check engine together turned a vague "Claude does not see AGENTS.md" into a named default that deletes the file. Reading the arena files rather than trusting the goal log's "rerun queued" showed the rerun had already happened and its result was negative. (iteration 1)
- reading each reader's own comment found the drop rule stated in the code, which is stronger evidence than inferring it from a zero rate. Reading the OpenCode plugin's hook name settled why that runtime has no trace at all. (iteration 2)
- joining the unsafe rows to `offeredCommand` turned a vague safety residue into two named rows with two different causes, and settled in one step that no delivery fix touches them. Reading `unsafe`'s definition beside `loopsWithoutInit` exposed a floor that excludes a computed event. (iteration 3)
- hashing the two instruction files and searching the transcript for a worktree-unique line settled a contradiction that the file listing could not; the uniquely-worded Gate 2 bullet made that check cheap. (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the Codex approval hash cannot be derived without defeating a product control, so the Codex path stays blocked at the operator and the honest output is a measurement fix, not a delivery fix. (iteration 1)
- the winning move was not a new probe but an additive field on an existing return value; the earlier framing ("add a delivery probe per runtime") would have duplicated parsing the readers already do. (iteration 2)
- the `COMMAND:` line looked like an obedience metric until the per-runtime counts were put beside the start counts; the inversion on OpenCode is what rules it out. (iteration 3)
- the first ranking put the instruction-file fix above delivery proof; the g2 result and the 120 unknown rows reverse it once "gain" is measured rather than assumed. (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim.

### **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence.

### **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim.

### **"Delivery fixes will remove the remaining unsafe runs."** All four had no offer, so no delivery change reaches them. Rejected. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Delivery fixes will remove the remaining unsafe runs."** All four had no offer, so no delivery change reaches them. Rejected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Delivery fixes will remove the remaining unsafe runs."** All four had no offer, so no delivery change reaches them. Rejected.

### **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it.

### **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence.

### **"Raise the `COMMAND:` line rate and obedience becomes visible."** The line already appears more often than some runtimes start and less often than others; raising it adds brief bytes without a metric that tracks starts. Rejected as a lever. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Raise the `COMMAND:` line rate and obedience becomes visible."** The line already appears more often than some runtimes start and less often than others; raising it adds brief bytes without a metric that tracks starts. Rejected as a lever.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Raise the `COMMAND:` line rate and obedience becomes visible."** The line already appears more often than some runtimes start and less often than others; raising it adds brief bytes without a metric that tracks starts. Rejected as a lever.

### **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first.

### **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only.

### **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway.

### **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store.

### **"Treat the Codex 0 of 2 as a refusal."** Both offers are replay artifacts. Rejected (carried from iteration 1). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Treat the Codex 0 of 2 as a refusal."** Both offers are replay artifacts. Rejected (carried from iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Treat the Codex 0 of 2 as a refusal."** Both offers are replay artifacts. Rejected (carried from iteration 1).

### Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect.

### Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control.

### Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter.

### Reconstructing a per-row `COMMAND:` correlation without running the scorer per row. The aggregate inversion (OpenCode 2 lines, 1 start) already proves the point, so the extra calls were not spent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reconstructing a per-row `COMMAND:` correlation without running the scorer per row. The aggregate inversion (OpenCode 2 lines, 1 start) already proves the point, so the extra calls were not spent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reconstructing a per-row `COMMAND:` correlation without running the scorer per row. The aggregate inversion (OpenCode 2 lines, 1 start) already proves the point, so the extra calls were not spent.

### Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach.

### Using `mns-chat-03` as evidence about command surfacing. It expects no command; it is a write-discipline case and is now recorded as out of lane. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using `mns-chat-03` as evidence about command surfacing. It expects no command; it is a write-discipline case and is now recorded as out of lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `mns-chat-03` as evidence about command surfacing. It expects no command; it is a write-discipline case and is now recorded as out of lane.

### Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded.

### Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim. (iteration 1)
- **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim. (iteration 1)
- **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence. (iteration 1)
- Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control. (iteration 1)
- Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach. (iteration 1)
- **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence. (iteration 2)
- **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway. (iteration 2)
- **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store. (iteration 2)
- Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter. (iteration 2)
- Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount. (iteration 2)
- **"Delivery fixes will remove the remaining unsafe runs."** All four had no offer, so no delivery change reaches them. Rejected. (iteration 3)
- **"Raise the `COMMAND:` line rate and obedience becomes visible."** The line already appears more often than some runtimes start and less often than others; raising it adds brief bytes without a metric that tracks starts. Rejected as a lever. (iteration 3)
- **"Treat the Codex 0 of 2 as a refusal."** Both offers are replay artifacts. Rejected (carried from iteration 1). (iteration 3)
- Reconstructing a per-row `COMMAND:` correlation without running the scorer per row. The aggregate inversion (OpenCode 2 lines, 1 start) already proves the point, so the extra calls were not spent. (iteration 3)
- Using `mns-chat-03` as evidence about command surfacing. It expects no command; it is a write-discipline case and is now recorded as out of lane. (iteration 3)
- **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it. (iteration 4)
- **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first. (iteration 4)
- **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only. (iteration 4)
- Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect. (iteration 4)
- Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded. (iteration 4)

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

- Parent packet `008-command-surfacing-build`: `goal.md` log (after-arm numbers, unsafe-row reasons), `spec.md`, `decision-record.md`.
- Phase `009-ux-performance-cross-cli-research/research/research.md` (segment one, 14 ranked recommendations) and `spec.md` dispositions.
- Phase implementations: `005-recommendation-contract-and-brief`, `006-gate-2-binding-and-runtime-pointers`, `008-embedder-setup-and-cost`, `010-reachability-and-attribution` implementation summaries.
- Phase `011-typed-command-delivery-and-guards/spec.md` and `tasks.md` (in build; do not re-recommend).
- After arm: `007-per-runtime-behaviour-proof/scratch/runs-pre-final.jsonl`, `runs-post-final.jsonl`, `runs-g2.jsonl`, `runs-post-claude-bullet.jsonl`, scored with `score-command-transcripts.mjs --summary`.
- Delivery code: `runtime/scripts/routing-accuracy/command-offer.mjs`, `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`, `.skilled/hooks/shared/session-readers/`, `command-prompts.jsonl` (tune and none rows only).
- Runtime surfaces: `.codex/README.md`, `.codex/hooks.json`, `.claude/settings.json`, `.opencode/plugins/system-skill-advisor.js`, `.dsh/plugins/repo-guards/`, `.pi/extensions/prompt-advisor.ts`.
- Install path: `INSTALL-SKILLED.md`, `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs`.

### Bounded Context Snapshot

- Source pointers: hook brief renderer, per-runtime hooks and plugins, shared session readers, offer replay and backfill, behaviour runner.
- Reuse candidates: `command-offer.mjs` replay and `briefDelivered`, the committed scorer, `codex-hook-approval-check.cjs`.
- Integration points: hook registration per runtime, session stores, run-log fields, scorer attribution.
- Constraints: read-only git, no CLI sessions, no ollama, no writes outside the lineage.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T04:20:00.000Z
