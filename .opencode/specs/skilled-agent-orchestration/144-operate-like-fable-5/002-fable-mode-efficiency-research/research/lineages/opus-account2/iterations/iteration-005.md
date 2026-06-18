# Iteration 5: FOLLOW-UPS + GAPS — carried round-1 follow-ups re-assessed; lineage gaps & merge questions

## Focus
Q5 (FOLLOW-UPS + GAPS): Re-assess the two carried round-1 follow-ups against the current repo, document this lineage's gaps and open questions for the cross-lineage merge. Research-only.

## Findings

### Carried follow-up A — the machine-checkable shared evidence contract (= rec #10)
- **Status: STILL OPEN (verified by absence).** A grep for the contract's named fields (`claim_class` / `claimClass`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`, "evidence contract") across `.opencode/skills/deep-loop-runtime` and `.opencode/skills/system-spec-kit/references` returned **zero hits**. [SOURCE: grep (no matches) over deep-loop-runtime + system-spec-kit/references] This confirms round-1's note that it was "intentionally deferred as a future packet, not attempted" [SOURCE: 149/001 implementation-summary.md:130].
- **Re-assessment:** This is the same item as rec #10 (adversarial-review schema + machine-checkable evidence contract). Fable's forced `claim / verdict / evidence` triple (F3) + typed status enum (F11) is the *content* of that contract; the framework already has the *attachment point* (`validateIterationOutputs` / `post-dispatch-validate` per loop_protocol.md:243-248, and the `agent-io-contract.md` advisory metadata referenced in AGENTS.md). **Recommendation stands: a dedicated packet** that wires a `claim_class / evidence / would_confirm / baseline / gate_delta / scope_state / child_result_verified` schema into post-dispatch validation, turning the doctrine from prose into a mechanical gate. Highest leverage, highest cost (iter-4 #10).

### Carried follow-up B — codex SIGKILL on 2nd+ dispatch + silent gpt-5 fallback
- **Status: STILL OPEN structurally (verified by absence); mitigated operationally this round.** A grep for model-verification / fail-loud / SIGKILL handling (`silent`, `fall.?back`, `fail.?loud`, `verify.*model`, `model.*mismatch`, `expectedModel`, `actualModel`, `sigkill`) across the deep-loop runtime + deep-research scripts found **no model-verification or fail-loud mechanism** — only generic env-parse `fallback` helpers and a `reduce-state.cjs` note that "corrupt lines are silently dropped." [SOURCE: grep over deep-loop-runtime/scripts + deep-research/scripts] So the runtime still cannot detect or fail-loud on a silent model substitution.
- **However**, the 002 `spec.md` mitigates it *operationally* for this round: R-001 requires "codex lineage on gpt-5.5 (not silent gpt-5)" with mitigation "Pre-flight smoke (passed); verify lineage model in logs; fail loud" [SOURCE: 002 spec.md:99-102, 125-128]. So this round guards against the bug by process, not by a runtime fix.
- **Re-assessment → new recommendation #12 (Tier B mechanism, hardening):** Make `appendExecutorAuditToLastRecord` / the executor-audit path **fail loud on a model mismatch** — compare the requested `config.executor.model` against the model actually reported in the executor audit, and emit an `error`/`blocked_stop` event (never a silent native substitution). This is the round-1 follow-up made structural. Leverage HIGH (a silent gpt-5 substitution invalidates a whole lineage and is invisible — exactly the "no silent wrong data" value, F-rank #2 in the profile); Cost MED (TypeScript runtime work); Blast MED (touches dispatch/audit). Distinct from rec #10. **This is also a direct expression of Fable's F7 "fail closed by construction" + F13 "a number/result you can't trust is a bug even when green."**

### This lineage's gaps (carry to the merge)
1. **OpenCode/Codex per-turn-hook read-reliability unverified.** Iter-3 verified only the Claude `UserPromptSubmit` hook wiring directly; OpenCode/Codex per-turn-reinjection equivalents were rated "runtime-dep" without opening their hook configs. **Impact:** recs #1/#5 (governor on the hook) are confirmed viable on Claude but only inferred for OpenCode/Codex. The merge should reconcile this against the codex-xhigh lineage, which may have probed the other runtimes.
2. **Numeric scores are deliberately coarse.** The leverage/(cost+blast) 1–5 model collides several recs in the same band; ordering within a band rests on the worst-first/best-first prose, not the number. The cost/blast of #5 (agent-prompt sync) and #10 (evidence contract) are estimates an implementation packet must firm up.
3. **leak_test multi-runtime port unscoped.** Rec #7 needs a runtime-aware transcript-log parser (Claude `~/.claude/projects`, plus OpenCode/Codex equivalents and their model-id conventions). The metric definitions are portable (iter-2 G3); the log-location/model-id mapping per runtime is not yet specified.
4. **Could not run `leak_test.py`** (needs real transcripts + out of research-only scope) — so the quantified Fable signature (G5: words 47→18, tool:text 1.41→3.91) is cited from the source's own corpus, not independently reproduced on this repo's logs. The metric is a *recommendation to build*, not a measured baseline.

### Open questions for the cross-lineage merge
- **Q-merge-1:** Does the codex-xhigh lineage confirm or contradict the read-reliability matrix (esp. OpenCode/Codex hook behavior and the AGENTS.md decay claim)? Reconcile any divergence on surface read-reliability before the merged ranking.
- **Q-merge-2:** Do both lineages independently rank the same top cluster (governor-on-hook / mutation-check / recursion-control)? Agreement across two heterogeneous models strengthens the owner's confidence per item.
- **Q-merge-3:** Did either lineage surface a surface×delta this one missed (e.g., a skill or command not in the 002 enumeration)? Union the candidate sets, then re-dedup vs round 1.
- **Q-merge-4:** Final tier-A budget check — if the merged set lands a doctrine-spine line in AGENTS.md (#6), confirm the byte-synced twins stay under ~500 lines after the addition.

## Sources Consulted
- grep for evidence-contract fields across deep-loop-runtime + system-spec-kit/references (no hits → confirmed open)
- grep for model-verification / fail-loud / SIGKILL handling across deep-loop runtime + deep-research scripts (no hits → confirmed open)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` (service-tier handling; no model-mismatch guard)
- 149/001 implementation-summary.md:130 + changelog.md:61-62 (round-1 carried follow-ups)
- 002 spec.md:99-128 (R-001 operational mitigation this round)
- iterations 1–4 (this lineage's finding + recommendation base)

## Assessment
- **newInfoRatio: 0.15** — Lowest of the run, as expected for a re-assessment + gap-documentation iteration. Genuinely new: the two by-absence verifications (both follow-ups confirmed still-open structurally), the new hardening recommendation #12 (fail-loud on model mismatch), the explicit gap list, and the four merge questions. No new source techniques.
- **Novelty justification:** Closes the loop on the spec's "assess carried round-1 follow-ups" requirement with repo-verified status, and hands the merge a clean gap/question set.
- **Confidence:** HIGH that both follow-ups are still open (grep-by-absence is strong negative evidence for named identifiers; the runtime fail-loud claim is corroborated by the spec routing the mitigation through process this round). MEDIUM on the OpenCode/Codex hook gap (rated unverified, not asserted).

## Reflection
- **What worked:** Grep-by-absence on the specific contract field names + the fail-loud identifiers gave a defensible "still open" verdict cheaply, rather than reading every runtime file.
- **What failed:** The grep can only prove absence of those *exact* identifiers — a differently-named partial implementation could exist; I bounded the claim to the named fields/identifiers to avoid overclaiming.
- **Ruled out:** Treating the codex SIGKILL issue as fixed because the 002 pre-flight smoke passed — the smoke is an *operational* guard for this round, not a structural fix; the runtime still has no model-mismatch fail-loud (rec #12 stands).

## Recommended Next Focus
Loop at maxIterations (5/5); 5/5 key questions answered; newInfoRatio descended 0.95 → 0.78 → 0.60 → 0.25 → 0.15 (monotone). Proceed to SYNTHESIS: compile `research.md` for the opus-account2 lineage with the full finding catalogue (F1–F15, G1–G9), the read-reliability matrix, the 12-item ranked recommendation set, the Eliminated Alternatives table, and the merge questions.
