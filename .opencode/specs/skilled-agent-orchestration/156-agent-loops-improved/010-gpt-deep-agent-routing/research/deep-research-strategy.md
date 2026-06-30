# Deep Research Strategy - 010 GPT Deep-Agent Routing

## 1. OVERVIEW

### Purpose
Persistent brain for the GPT deep-agent routing fidelity investigation. Read by orchestrator and LEAF agents at every iteration.

### Research Topic
GPT-backed OpenCode deep skills (deep-research, deep-review, deep-context, deep-ai-council, deep-improvement) mis-route to the general/build agent instead of dedicated deep LEAF agents, run slower than under Claude, and drift from the workflow YAML contracts. Reproduces via @orchestrate dispatch AND from the build primary agent.

---

## 2. TOPIC
Why do GPT-backed OpenCode deep loops mis-route to the general agent, run slow, and drift from workflow contracts that Claude follows faithfully?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] KQ1: Where in OpenCode's agent/command resolution path is the "which agent runs this" decision made, and why does GPT-backed execution pick general/build instead of the named deep LEAF agent (@deep-research, @deep-review, etc.)?
- [ ] KQ2: How does the deep-loop command YAML + agent file contract express "dispatch @deep-research" vs "orchestrate the loop yourself as @general", and where does a GPT-backed model misread that boundary?
- [ ] KQ3: Why are GPT-backed deep loops slower than Claude's (dispatch latency, per-iteration tool-call overhead, reasoning/token volume, reducer/state churn)?
- [ ] KQ4: Which specific workflow-contract steps do GPT-backed runs skip or mutate (state files, prompt-pack render, reducer refresh, convergence eval, lock lifecycle) vs Claude?
- [ ] KQ5: How do the two reproduction surfaces (@orchestrate sub-agent dispatch vs build primary agent) share or differ in root cause?
- [ ] KQ6: What concrete, evidence-backed fixes would close the GPT-vs-Claude fidelity gap (prompt-packs, agent-file hardening, enforcement gates, state invariants)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing fixes in this phase (follow-on implementation phase).
- Researching non-deep skills or non-loop commands.
- Model providers beyond the GPT-backed and Claude baselines used in OpenCode.

---

## 5. STOP CONDITIONS
- All KQ1-KQ6 answered with cited evidence, OR
- 20 iterations reached, OR
- 3 consecutive stuck iterations with no recovery.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Narrow reads of the validator body plus tests gave implementation-ready line anchors without reopening blocked host-runtime directions. (iteration 9)
- Narrow source reads around the shared validator, review YAML, context YAML, and council YAML answered the scope decision without reopening blocked host-runtime directions. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- A first direct read for `deep_ai_council_auto.yaml` failed because the actual asset uses a hyphenated filename; a glob fallback resolved it. (iteration 9)
- Broad grep returned many unrelated status hits; focused reads were needed to distinguish loop iteration status from unrelated status fields. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`opencode.json` as the agent-selection source.** It defines no agents/models/agent -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`opencode.json` as the agent-selection source.** It defines no agents/models/agent
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`opencode.json` as the agent-selection source.** It defines no agents/models/agent

### **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted.

### **A config-level (opencode.json) mechanism that would make the surfaces differ** — definitively absent (F1). No further config search warranted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A config-level (opencode.json) mechanism that would make the surfaces differ** — definitively absent (F1). No further config search warranted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A config-level (opencode.json) mechanism that would make the surfaces differ** — definitively absent (F1). No further config search warranted.

### **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance, -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance,

### **Any static repo file (config / YAML workflow / agent file / command markdown -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Any static repo file (config / YAML workflow / agent file / command markdown
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any static repo file (config / YAML workflow / agent file / command markdown

### **Definitive injector attribution (host runtime wrapper vs orchestrator model -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Definitive injector attribution (host runtime wrapper vs orchestrator model
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Definitive injector attribution (host runtime wrapper vs orchestrator model

### **Definitive injector attribution (host runtime wrapper vs orchestrator model)** — remains unresolved (BLOCKED iteration-2). The live capture in F5 shows the trailing dispatch lines exist in the leaf prompt, but this iteration cannot distinguish whether the host runtime wrapper, the `@orchestrate` model, or the `/deep:research` command renderer injected them. Candidate for reducer promotion to "Exhausted Approaches" only if a future iteration also fails; for now it stays open with a named next evidence step (see Recommended Next Focus). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Definitive injector attribution (host runtime wrapper vs orchestrator model)** — remains unresolved (BLOCKED iteration-2). The live capture in F5 shows the trailing dispatch lines exist in the leaf prompt, but this iteration cannot distinguish whether the host runtime wrapper, the `@orchestrate` model, or the `/deep:research` command renderer injected them. Candidate for reducer promotion to "Exhausted Approaches" only if a future iteration also fails; for now it stays open with a named next evidence step (see Recommended Next Focus).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Definitive injector attribution (host runtime wrapper vs orchestrator model)** — remains unresolved (BLOCKED iteration-2). The live capture in F5 shows the trailing dispatch lines exist in the leaf prompt, but this iteration cannot distinguish whether the host runtime wrapper, the `@orchestrate` model, or the `/deep:research` command renderer injected them. Candidate for reducer promotion to "Exhausted Approaches" only if a future iteration also fails; for now it stays open with a named next evidence step (see Recommended Next Focus).

### **Definitive model attribution of the F16 packets.** Narrowed to "packets -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Definitive model attribution of the F16 packets.** Narrowed to "packets
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Definitive model attribution of the F16 packets.** Narrowed to "packets

### **Empirical latency measurement (run logs):** no captured Claude-vs-GPT timing comparison exists (iter-6 F6 established memory is empty; 156 changelog BLOCKED iter-3/6). KQ3 timings are therefore [INFERENCE] from contract structure + line-count arithmetic, not measured. Bounded gap, not a method gap. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Empirical latency measurement (run logs):** no captured Claude-vs-GPT timing comparison exists (iter-6 F6 established memory is empty; 156 changelog BLOCKED iter-3/6). KQ3 timings are therefore [INFERENCE] from contract structure + line-count arithmetic, not measured. Bounded gap, not a method gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Empirical latency measurement (run logs):** no captured Claude-vs-GPT timing comparison exists (iter-6 F6 established memory is empty; 156 changelog BLOCKED iter-3/6). KQ3 timings are therefore [INFERENCE] from contract structure + line-count arithmetic, not measured. Bounded gap, not a method gap.

### **Fresh file:line re-verification of every anchor this iteration** — budget-exhausted by the dispatch-mandated re-read of iterations 001–004 + state. Captured anchors are cross-iteration-consistent and reused per read-budget-freshness; a single verification pass is deferred to Next Focus #1 (NOT a BLOCKED approach — verifiable in one cheap Read). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Fresh file:line re-verification of every anchor this iteration** — budget-exhausted by the dispatch-mandated re-read of iterations 001–004 + state. Captured anchors are cross-iteration-consistent and reused per read-budget-freshness; a single verification pass is deferred to Next Focus #1 (NOT a BLOCKED approach — verifiable in one cheap Read).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fresh file:line re-verification of every anchor this iteration** — budget-exhausted by the dispatch-mandated re-read of iterations 001–004 + state. Captured anchors are cross-iteration-consistent and reused per read-budget-freshness; a single verification pass is deferred to Next Focus #1 (NOT a BLOCKED approach — verifiable in one cheap Read).

### **Host-runtime leak kill (FIX-2 source) and per-agent `subagent_type` (FIX-1 deep type).** Both require OpenCode host runtime source, which is out of repo (iter-1/iter-2 established boundary). Candidate for reducer promotion to "Exhausted Approaches" if a follow-up iteration also cannot reach the host runtime; for now the repo-resident mitigants (sentinel, manifest-audit) are the actionable subset. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Host-runtime leak kill (FIX-2 source) and per-agent `subagent_type` (FIX-1 deep type).** Both require OpenCode host runtime source, which is out of repo (iter-1/iter-2 established boundary). Candidate for reducer promotion to "Exhausted Approaches" if a follow-up iteration also cannot reach the host runtime; for now the repo-resident mitigants (sentinel, manifest-audit) are the actionable subset.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Host-runtime leak kill (FIX-2 source) and per-agent `subagent_type` (FIX-1 deep type).** Both require OpenCode host runtime source, which is out of repo (iter-1/iter-2 established boundary). Candidate for reducer promotion to "Exhausted Approaches" if a follow-up iteration also cannot reach the host runtime; for now the repo-resident mitigants (sentinel, manifest-audit) are the actionable subset.

### **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6).

### **opencode.json as a model→agent / default-model binding source** — confirmed empty (F1); reinforces iteration-1's BLOCK on opencode.json as the agent-selection source and extends it to model binding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **opencode.json as a model→agent / default-model binding source** — confirmed empty (F1); reinforces iteration-1's BLOCK on opencode.json as the agent-selection source and extends it to model binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **opencode.json as a model→agent / default-model binding source** — confirmed empty (F1); reinforces iteration-1's BLOCK on opencode.json as the agent-selection source and extends it to model binding.

### **opencode.json as a repo-resident model→dispatch lever** — confirmed empty (RC4/iter-4 F1); no further config search warranted. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **opencode.json as a repo-resident model→dispatch lever** — confirmed empty (RC4/iter-4 F1); no further config search warranted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **opencode.json as a repo-resident model→dispatch lever** — confirmed empty (RC4/iter-4 F1); no further config search warranted.

### **Per-file JSONL read for definitive F16 attribution** — already BLOCKED in iteration-3; NOT retried. The batch-grep (F6) is a strictly narrower technique (single aggregate grep, no per-file iteration-record parsing) and was explicitly requested by the dispatch as a close-out. Edge-case nuance recorded below. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Per-file JSONL read for definitive F16 attribution** — already BLOCKED in iteration-3; NOT retried. The batch-grep (F6) is a strictly narrower technique (single aggregate grep, no per-file iteration-record parsing) and was explicitly requested by the dispatch as a close-out. Edge-case nuance recorded below.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Per-file JSONL read for definitive F16 attribution** — already BLOCKED in iteration-3; NOT retried. The batch-grep (F6) is a strictly narrower technique (single aggregate grep, no per-file iteration-record parsing) and was explicitly requested by the dispatch as a close-out. Edge-case nuance recorded below.

### **Prompt-pack renderer / token substitution as the leak source.** Rendered -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Prompt-pack renderer / token substitution as the leak source.** Rendered
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt-pack renderer / token substitution as the leak source.** Rendered

### **Prompt-pack template as the leak source.** Template is clean; ends line 67 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Prompt-pack template as the leak source.** Template is clean; ends line 67
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt-pack template as the leak source.** Template is clean; ends line 67

### **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively

### **Reading the full 1556-line YAML this iteration:** budget-managed via targeted grep (step names) + fresh read of the post-dispatch block (1061-1150) + reuse of iter-1/3/6 anchors for dispatch (811-857) and convergence (1313). Cross-iteration-consistent per read-budget-freshness. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading the full 1556-line YAML this iteration:** budget-managed via targeted grep (step names) + fresh read of the post-dispatch block (1061-1150) + reuse of iter-1/3/6 anchors for dispatch (811-857) and convergence (1313). Cross-iteration-consistent per read-budget-freshness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the full 1556-line YAML this iteration:** budget-managed via targeted grep (step names) + fresh read of the post-dispatch block (1061-1150) + reuse of iter-1/3/6 anchors for dispatch (811-857) and convergence (1313). Cross-iteration-consistent per read-budget-freshness.

### **The 156 parent changelog/review folders as a source of captured GPT-run -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The 156 parent changelog/review folders as a source of captured GPT-run
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 156 parent changelog/review folders as a source of captured GPT-run

### All-loop enum hardening in the first patch: ruled out because deep-context currently records `status: "evidence"` and ai-council uses session/topic state rather than leaf iteration file semantics. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:529] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:120] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: All-loop enum hardening in the first patch: ruled out because deep-context currently records `status: "evidence"` and ai-council uses session/topic state rather than leaf iteration file semantics. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:529] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:120]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: All-loop enum hardening in the first patch: ruled out because deep-context currently records `status: "evidence"` and ai-council uses session/topic state rather than leaf iteration file semantics. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:529] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:120]

### Deep-research-only enum hardening: ruled out because deep-review explicitly shares the same six status values and the same validator hook. [SOURCE: .opencode/agents/deep-review.md:234] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:964] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Deep-research-only enum hardening: ruled out because deep-review explicitly shares the same six status values and the same validator hook. [SOURCE: .opencode/agents/deep-review.md:234] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:964]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deep-research-only enum hardening: ruled out because deep-review explicitly shares the same six status values and the same validator hook. [SOURCE: .opencode/agents/deep-review.md:234] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:964]

### Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent).

### No new dead-end category for reducer promotion. The only bounded gap is cross-skill design choice: deep-context/ai-council need separate handling because they do not currently share the research/review post-dispatch validator path. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No new dead-end category for reducer promotion. The only bounded gap is cross-skill design choice: deep-context/ai-council need separate handling because they do not currently share the research/review post-dispatch validator path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end category for reducer promotion. The only bounded gap is cross-skill design choice: deep-context/ai-council need separate handling because they do not currently share the research/review post-dispatch validator path.

### No new reducer-promotion dead end. The only standing dead end remains out-of-repo host-runtime routing/leak/provenance attribution; this iteration did not retry it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No new reducer-promotion dead end. The only standing dead end remains out-of-repo host-runtime routing/leak/provenance attribution; this iteration did not retry it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new reducer-promotion dead end. The only standing dead end remains out-of-repo host-runtime routing/leak/provenance attribution; this iteration did not retry it.

### None definitively eliminated beyond the two ruled-out items above. (No BLOCKED -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None definitively eliminated beyond the two ruled-out items above. (No BLOCKED
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitively eliminated beyond the two ruled-out items above. (No BLOCKED

### None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7).

### None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay, measured latency) remains the standing out-of-repo dead end (iter-5/6). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay, measured latency) remains the standing out-of-repo dead end (iter-5/6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay, measured latency) remains the standing out-of-repo dead end (iter-5/6).

### None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end.

### Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap).

### Reopening host-runtime routing/provenance/model attribution: ruled out by the existing exhausted-approach list and not needed for repo-resident FIX-4a planning. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Reopening host-runtime routing/provenance/model attribution: ruled out by the existing exhausted-approach list and not needed for repo-resident FIX-4a planning. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening host-runtime routing/provenance/model attribution: ruled out by the existing exhausted-approach list and not needed for repo-resident FIX-4a planning. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122]

### Retrying host-runtime routing, provenance, and model-attribution directions; these are blocked in strategy and not needed for repo-resident FIX-4a validation hardening. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Retrying host-runtime routing, provenance, and model-attribution directions; these are blocked in strategy and not needed for repo-resident FIX-4a validation hardening. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying host-runtime routing, provenance, and model-attribution directions; these are blocked in strategy and not needed for repo-resident FIX-4a validation hardening. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122]

### Treating `computeIntegrityHash` as a drop-in file hash helper; it is JSON-object integrity tooling and explicitly excludes append-only JSONL/file-stream validation use. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:231] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating `computeIntegrityHash` as a drop-in file hash helper; it is JSON-object integrity tooling and explicitly excludes append-only JSONL/file-stream validation use. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:231]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `computeIntegrityHash` as a drop-in file hash helper; it is JSON-object integrity tooling and explicitly excludes append-only JSONL/file-stream validation use. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:231]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **`opencode.json` as the agent-selection source.** It defines no agents/models/agent (iteration 1)
- **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance, (iteration 1)
- None definitively eliminated beyond the two ruled-out items above. (No BLOCKED (iteration 1)
- **Any static repo file (config / YAML workflow / agent file / command markdown (iteration 2)
- **Definitive injector attribution (host runtime wrapper vs orchestrator model (iteration 2)
- **Prompt-pack renderer / token substitution as the leak source.** Rendered (iteration 2)
- **Prompt-pack template as the leak source.** Template is clean; ends line 67 (iteration 2)
- **Definitive model attribution of the F16 packets.** Narrowed to "packets (iteration 3)
- **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively (iteration 3)
- **The 156 parent changelog/review folders as a source of captured GPT-run (iteration 3)
- **A config-level (opencode.json) mechanism that would make the surfaces differ** — definitively absent (F1). No further config search warranted. (iteration 4)
- **Definitive injector attribution (host runtime wrapper vs orchestrator model)** — remains unresolved (BLOCKED iteration-2). The live capture in F5 shows the trailing dispatch lines exist in the leaf prompt, but this iteration cannot distinguish whether the host runtime wrapper, the `@orchestrate` model, or the `/deep:research` command renderer injected them. Candidate for reducer promotion to "Exhausted Approaches" only if a future iteration also fails; for now it stays open with a named next evidence step (see Recommended Next Focus). (iteration 4)
- **opencode.json as a model→agent / default-model binding source** — confirmed empty (F1); reinforces iteration-1's BLOCK on opencode.json as the agent-selection source and extends it to model binding. (iteration 4)
- **Per-file JSONL read for definitive F16 attribution** — already BLOCKED in iteration-3; NOT retried. The batch-grep (F6) is a strictly narrower technique (single aggregate grep, no per-file iteration-record parsing) and was explicitly requested by the dispatch as a close-out. Edge-case nuance recorded below. (iteration 4)
- **Fresh file:line re-verification of every anchor this iteration** — budget-exhausted by the dispatch-mandated re-read of iterations 001–004 + state. Captured anchors are cross-iteration-consistent and reused per read-budget-freshness; a single verification pass is deferred to Next Focus #1 (NOT a BLOCKED approach — verifiable in one cheap Read). (iteration 5)
- **Host-runtime leak kill (FIX-2 source) and per-agent `subagent_type` (FIX-1 deep type).** Both require OpenCode host runtime source, which is out of repo (iter-1/iter-2 established boundary). Candidate for reducer promotion to "Exhausted Approaches" if a follow-up iteration also cannot reach the host runtime; for now the repo-resident mitigants (sentinel, manifest-audit) are the actionable subset. (iteration 5)
- **opencode.json as a repo-resident model→dispatch lever** — confirmed empty (RC4/iter-4 F1); no further config search warranted. (iteration 5)
- **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted. (iteration 6)
- **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6). (iteration 6)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end. (iteration 6)
- **Empirical latency measurement (run logs):** no captured Claude-vs-GPT timing comparison exists (iter-6 F6 established memory is empty; 156 changelog BLOCKED iter-3/6). KQ3 timings are therefore [INFERENCE] from contract structure + line-count arithmetic, not measured. Bounded gap, not a method gap. (iteration 7)
- **Reading the full 1556-line YAML this iteration:** budget-managed via targeted grep (step names) + fresh read of the post-dispatch block (1061-1150) + reuse of iter-1/3/6 anchors for dispatch (811-857) and convergence (1313). Cross-iteration-consistent per read-budget-freshness. (iteration 7)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay, measured latency) remains the standing out-of-repo dead end (iter-5/6). (iteration 7)
- Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent). (iteration 8)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7). (iteration 8)
- Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap). (iteration 8)
- No new dead-end category for reducer promotion. The only bounded gap is cross-skill design choice: deep-context/ai-council need separate handling because they do not currently share the research/review post-dispatch validator path. (iteration 9)
- Retrying host-runtime routing, provenance, and model-attribution directions; these are blocked in strategy and not needed for repo-resident FIX-4a validation hardening. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] (iteration 9)
- Treating `computeIntegrityHash` as a drop-in file hash helper; it is JSON-object integrity tooling and explicitly excludes append-only JSONL/file-stream validation use. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:231] (iteration 9)
- All-loop enum hardening in the first patch: ruled out because deep-context currently records `status: "evidence"` and ai-council uses session/topic state rather than leaf iteration file semantics. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:529] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:120] (iteration 10)
- Deep-research-only enum hardening: ruled out because deep-review explicitly shares the same six status values and the same validator hook. [SOURCE: .opencode/agents/deep-review.md:234] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:964] (iteration 10)
- No new reducer-promotion dead end. The only standing dead end remains out-of-repo host-runtime routing/leak/provenance attribution; this iteration did not retry it. (iteration 10)
- Reopening host-runtime routing/provenance/model attribution: ruled out by the existing exhausted-approach list and not needed for repo-resident FIX-4a planning. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Whether ai-council should gain an analogous session/topic artifact validator rather than reuse iteration-file semantics. (iteration 9)
- Whether deep-context should adopt the same post-dispatch validator or keep host-written state validation separate. (iteration 9)
- Whether status enum should be deep-research-only initially or should also cover review and any future generalized loop record shapes. (iteration 9)
- Whether deep-ai-council should validate seat/session artifact frontmatter statuses and session events through a dedicated council validator. (iteration 10)
- Whether deep-context should later normalize to the six-status vocabulary or keep `evidence` as a mode-specific status behind a mode-specific validator. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Whether deep-context should later normalize to the six-status vocabulary or keep `evidence` as a mode-specific status behind a mode-specific validator.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None at init (memory_context refresh deferred to the loop). Loop will refresh focused context per iteration.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branch: `new` (generation 1)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-06-30T06:30:11Z
