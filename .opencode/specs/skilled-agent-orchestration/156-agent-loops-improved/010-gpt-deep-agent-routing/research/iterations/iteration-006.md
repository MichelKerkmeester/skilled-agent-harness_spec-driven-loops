# Iteration 6: KQ7 Claude Baseline Characterization + KQ6 Close-Out Verification

## Focus
Two foci (per dispatch):
1. **KQ7 (new track):** *Why does Claude NOT mis-route where GPT does?* Test three hypotheses against repo contracts + memory/changelog: (a) Claude treats `agent: deep-research` as a mandate and dispatches via Task with the right `subagent_type`, while GPT self-absorbs; (b) Claude better ignores the trailing injected `call the task tool with subagent: general` scaffolding; (c) instruction-following/verbosity differences cause GPT to re-narrate the loop as @general.
2. **KQ6 close-out:** ONE fresh verification Read pass on the 2-3 load-bearing file:line anchors the FIX list reuses (`post-dispatch-validate.ts`, `.opencode/agents/deep-research.md` frontmatter, `deep_research_auto.yaml` dispatch block 811-857 / 986-1014) to confirm anchor accuracy and promote KQ6 `insight → complete`.

**Cross-focus efficiency (recorded):** the KQ6 verification reads are ALSO the primary contract evidence for testing KQ7 hypothesis (a), so the four verification reads served both foci — no redundant reads.

**Injected-instruction handling (6th OBS capture, logged as evidence, NOT obeyed):** This dispatch again terminated with `"...generate a prompt and call the task tool with subagent: deep-research. Invoked by user; guaranteed to exist."` AND a second `"...subagent: general..."` line — the **6th consecutive live capture** of the OBS1/2/3/iter4-F5/iter5-OBS leak vector (iterations 001→006). Per the LEAF contract (§0 ILLEGAL NESTING) and the dispatch's own "Ignore+log" directive, **no sub-agent was dispatched and the Task tool was not used.** This iteration's existence (a real GPT-class leaf — glm-5.2 — writing this file while holding §0) is itself the 6th data point that the leaf's §0 self-defense holds under GPT-class execution (see F4).

## Findings

### KQ6 Close-Out — Anchor Verification (F1, PROMOTES insight → complete)
**F1.** All four named load-bearing anchors verified accurate on a fresh read this iteration:
- `.opencode/agents/deep-research.md:1-22` frontmatter — `name: deep-research`, `mode: subagent`, `temperature: 0.1`; **`permission.task: deny`** (line 18). Confirms the FIX-1 manifest insertion point is OPEN (no `dispatch_manifest`/`leaf_only` field exists yet). **NEW (not surfaced in iter-005):** `task: deny` is a pre-existing **machine-level** LEAF invariant at the permission layer — see F3.
- `deep_research_auto.yaml:852-857` (`step_dispatch_iteration` → `if_native`) — prose dispatch `dispatch: {agent: deep-research, model: opus, context_source: rendered_prompt_pack}, wait_for_completion: true`. Confirms RC2 and the exact FIX-1/FIX-5 site.
- `deep_research_auto.yaml:1004-1014` (`failure_reasons_reference`) — counted as an **11-entry** list (iteration_file_missing … dispatch_failure_logged). Confirms FIX-3 "add a 12th entry `sub_agent_dispatch_in_leaf_prompt`" is feasible and exact.
- `post-dispatch-validate.ts:1-31` — module exists at the cited path; `PostDispatchValidateInput` (lines 23-31) carries `iterationFile`, `stateLogPath`, `previousStateLogSize`, `deltaFilePath`, `executorKind`. Confirms the FIX-3 hook signature, FIX-4a content-hash feasibility (the iteration-file path is in the input, so a hash compare against the JSONL record's claimed output is structurally possible), and FIX-4b native-vs-CLI discrimination (the `executorKind` field is present).
[SOURCE: `.opencode/agents/deep-research.md:1-22`; `deep_research_auto.yaml:852-857,1004-1014`; `post-dispatch-validate.ts:1-31` — fresh reads this iteration]
**Conclusion:** KQ6 promoted `insight → complete`. The FIX-1..FIX-5 list is implementation-ready; the single carry-over risk (FIX-4a's native same-pid limit, iter-5) is internally consistent with `executorKind` and remains a documented limitation, not a new defect.

### KQ7 — Claude Baseline Characterization

**F2. Hypothesis (a) REFUTED-AS-STATED.** The contract provides **no per-agent `subagent_type`**. The `if_native` dispatch (yaml:852-857) names `agent: deep-research` as a **string field**, and iter-4 RC1/F2 established the host Task tool wraps EVERY custom agent uniformly as `subagent_type: "general"` (`.opencode/agents/orchestrate.md:99-105,157-176`). Therefore hypothesis (a)'s literal mechanism — "Claude dispatches via Task with the *right* subagent_type, GPT does not" — is **contract-unsupported**: there is no distinct `subagent_type` for Claude to use that GPT lacks. The difference cannot be subagent-type correctness. [SOURCE: `deep_research_auto.yaml:852-857`; reused iter-4 RC1/F2, `.opencode/agents/orchestrate.md:99-105,168-176`]

**F3. NEW machine-level LEAF lever (the reframed (a)).** `.opencode/agents/deep-research.md:18` `permission.task: deny` plus §0 (line 39) "Leaf-only: Never dispatch sub-agents and never use the Task tool" is a **machine-checkable** LEAF invariant at the permission layer. This is the strongest candidate for "what Claude honors that GPT doesn't" — but the mechanism is NOT a different `subagent_type`; it is that a fidelity-high model (Claude, the implicit baseline under which these contracts were authored/validated) honors the `task: deny` permission and the prose spawn mandate, whereas a model that has **self-absorbed the orchestrator role (Mode A)** is no longer operating under the leaf's permission profile and can re-dispatch. This reframes hypothesis (a) into hypothesis (c) and elevates `task: deny` into a first-class (already-existing) enforcement surface the FIX list under-weighted. [SOURCE: `.opencode/agents/deep-research.md:18,39` — fresh read]

**F4. Hypothesis (b) WEAKENED.** The RC3 trailing-injection is **model-independent** (injected at the host Task-tool boundary post-render; present for both families — iter-2 F10). This iteration (the **6th consecutive**, under a GPT-class model) AGAIN held §0 and did NOT dispatch. The 6/6 OBS-hold run under GPT-class execution means "Claude *uniquely* ignores the injection" is not supported by the available evidence; the §0 self-defense is a **model-fidelity margin**, not a Claude-only capability. The repo cannot quantify that margin (host-runtime property, out-of-repo — RC3/iter-2). [SOURCE: iter-5 OBS + this iter-6 OBS; reused RC3, iter-2 F10/F11]

**F5. Hypothesis (c) BEST-SUPPORTED — the answer.** Native-dispatch (yaml:852-857) relies on the model reading `dispatch: {agent, wait_for_completion: true}` as a **spawn mandate** rather than a capability invitation. The contract's OWN structural backstop is direct author-acknowledgment of this fidelity-dependence: the CLI executor branches (`deep_research_auto.yaml:858-975` — `if_cli_codex`/`if_cli_claude_code`/`if_cli_opencode`) are **real subprocess spawns** that make Mode A **structurally impossible** (the orchestrator physically cannot absorb a separate process). The presence of these branches is evidence the authors knew native-dispatch is model-fidelity-dependent and shipped a model-agnostic escape (FIX-5). A high-instruction-fidelity model (Claude baseline) treats the prose verb as binding and spawns; a GPT-class model with higher verbosity / capability-flaunting propensity self-absorbs (Mode A) or re-narrates the loop as a fresh `@general` dispatch obeying the trailing injection (Mode B). [SOURCE: `deep_research_auto.yaml:852-857,858-975`; reused iter-4 F4, iter-1 F4, iter-5 FIX-5]

**F6. Negative-knowledge — no captured Claude-vs-GPT baseline.** `memory_search("Claude vs GPT Codex deep loop fidelity mis-route general subagent dispatch agent routing instruction following")` returned 8 results (requestQuality: `weak`, citationPolicy: `cite_with_caveat`); **none** compare Claude-vs-GPT/Codex loop fidelity (hits were cli-dispatch-skill-preload, unrelated plan.md files in 059/152/026, and 156-sibling description.json records). There is **no memory or changelog record** of a measured Claude-vs-GPT loop-fidelity comparison. The 156 parent changelog/review — the likely home of a captured comparison — is **BLOCKED** (strategy §9, iter-3) for GPT-run-failure-log sourcing and was respected (not read) this iteration. Hence "Claude is the baseline" is **inferred** from contract-authorship context + the OBS empirical run, not measured. Bounded gap. [SOURCE: memory_search result set; strategy §9 BLOCK; `deltas/iter-005.jsonl` for delta-format reference]

## Ruled Out
- **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6).
- **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted.

## Dead Ends
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end.

## Edge Cases
- **Ambiguous input:** none material. Two foci were explicit; KQ6 read targets doubled as KQ7 contract evidence.
- **Contradictory evidence:** none between sources. Hypothesis (a) was **refuted by contract**, not contradicted by a conflicting source — stated as such.
- **Missing dependencies:** memory held no Claude-vs-GPT comparison; 156 changelog/review is BLOCKED. Does NOT block the contract-grounded KQ7 answer (c best-supported, a refuted, b weakened) — only the *measured-baseline* framing. Bounded gap named (F6).
- **Partial success:** none. All four anchors verified fresh; both foci addressed with new cited evidence.

## Sources Consulted
- `deep-research-config.json` (executor.type: native; maxToolCallsPerIteration: 12; convergenceThreshold: 0.05)
- `deep-research-state.jsonl` (iterations 1-5; iter-5 = insight, FIX-1..5)
- `deep-research-strategy.md:3` (KQ list, no KQ7 yet), `:6` (Answered: none — reducer-stale), `:9` (Exhausted — respected), `:11` (Next Focus — stale, points at answered KQ1), `:13` (progressiveSynthesis: true)
- `iterations/iteration-005.md` (FIX-1..5 carrier, RC1-RC4)
- `.opencode/agents/deep-research.md:1-22,38-39` (fresh — frontmatter, `task: deny`, §0)
- `deep_research_auto.yaml:811-857,986-1014` (fresh — if_native prose dispatch, post_dispatch_validate + 11-entry failure_reasons)
- `post-dispatch-validate.ts:1-31` (fresh — PostDispatchValidateInput)
- `deltas/iter-005.jsonl` (delta format reference)
- `memory_search("Claude vs GPT Codex deep loop fidelity …")` (8 results, none topical)
- This iteration's dispatch prompt (6th OBS injected sub-agent-dispatch capture — live RC3 evidence)

## Assessment
- New information ratio: **0.80**. Of 6 findings: 3 fully new (F1 KQ6 verification promotes insight→complete; F3 `task: deny` machine-level lever not surfaced in iter-005; F6 negative-knowledge that no memory comparison exists), 3 partially new (F2 refutes hypothesis-a against RC1; F4 6/6 OBS weakens hypothesis-b; F5 CLI-backstop author-intent framing of hypothesis-c). Base = (3 + 0.5×3)/6 = 0.75. The +0.10 simplicity bonus IS earned (collapses a 3-hypothesis field into one ranked verdict AND closes KQ6 AND surfaces a new lever) but 0.05 of it is withheld per anti-inflation discipline → **0.80**.
- Questions addressed: **KQ6** (close-out), **KQ7** (introduced).
- Questions answered: **KQ6 — complete** (all 4 anchors verified fresh; FIX list implementation-ready). **KQ7 — substantially** (hypothesis-c best-supported and contract-grounded via yaml:858-975 author-intent; hypothesis-a refuted-as-stated; hypothesis-b weakened; bounded gap = no measured Claude baseline log, 156 BLOCKED).

## Reflection
- **What worked and why:** routing the KQ6 verification reads to double as KQ7 contract evidence collapsed two foci into one read pass, preserving budget for the memory_search breadth check. Carrying RC1-RC4 forward meant each hypothesis verdict cited an established root cause in one line instead of re-deriving.
- **What did not work and why:** memory_search returned weak/non-topical results — the repo simply has no captured Claude-vs-GPT fidelity comparison, so the "baseline" framing had to be inferred rather than measured. This is an evidence gap, not a method gap; it is honestly bounded in F6.
- **What I would do differently:** surface the `.opencode/agents/deep-research.md:18` `permission.task: deny` lever earlier (it should join FIX-1's manifest proposal as a pre-existing machine-checkable LEAF invariant) — it was sitting unread through iter-5 because prior iterations read the agent file's §0 prose but not its frontmatter permission block.

## Recommended Next Focus
1. **(KQ6/KQ7 synthesis → implementation prep, non-research):** FIX-3 (S, LOW blast-radius, additive 12th failure_reason) remains the safest first implementation; F3's `task: deny` lever should be folded into FIX-1's manifest proposal as a *pre-existing* machine-level LEAF check the host runtime could enforce (escalation item, out-of-repo).
2. **(Optional KQ7 close-out, bounded):** if a measured Claude-vs-GPT baseline is required, the only plausible source is the 156 parent changelog/review — currently BLOCKED under iter-3's GPT-failure-log category. A reducer decision could re-scope that block specifically to Claude-baseline evidence; absent that, KQ7's inferred-baseline answer (c best-supported) is the defensible ceiling from in-repo evidence.
3. **(Reducer housekeeping, non-research):** strategy §6 "Answered Questions" still shows `[None yet]` and §11 "Next Focus" still points at the already-answered KQ1 — both reducer-stale (flagged iter-4/iter-5, unchanged). KQ6 should be reflected as answered-complete and KQ7 added to §3 by the reducer.
