# Iteration 5: FOLLOW-UPS + GAPS — carried round-1 follow-ups re-assessed; gaps + merge questions

## Focus
Q5 (FOLLOW-UPS + GAPS): re-assess the two carried round-1 follow-ups against the live runtime (grep-absence verification), document this lineage's gaps, and log the merge questions for the parent orchestrator's reconciliation with the sibling lineages.

## Carried round-1 follow-ups — re-assessed against the live runtime

### Follow-up A — Machine-checkable shared evidence contract (= rec #10): **STILL OPEN.**
Grep for the contract's named fields across `deep-loop-runtime` + `system-spec-kit/references`:
```
grep -rn "claim_class|would_confirm|gate_delta|scope_state|child_result_verified" \
  .opencode/skills/deep-loop-runtime .opencode/skills/system-spec-kit/references
→ ZERO hits
```
The schema is genuinely unbuilt. [SOURCE: grep no-match]. The *attachment point* exists — `post-dispatch-validate.*` and `agent-io-contract.md` are present (iter 3) — so this is a wiring-and-schema packet, not a greenfield one. Confirms round-1's deferral [SOURCE: 149/001 changelog.md:62].

### Follow-up B — codex SIGKILL / silent gpt-5 fallback (= rec #12): **STILL OPEN structurally.**
The live `executor-audit.ts` does two relevant things and is missing a third:
1. It **records** the actual model: "Audit record with kind, model, reasoning effort, and service tier" [SOURCE: executor-audit.ts:485]. So the actual model is *captured*.
2. It **itself escalates SIGTERM→SIGKILL** after a grace period and calls `killProcessGroup(child.pid, 'SIGKILL')` [SOURCE: executor-audit.ts:654, 688]. So the SIGKILL the round-1 follow-up observed is partly *the runtime's own kill mechanism* on a hung/timed-out child — a 2nd-dispatch hang would be SIGKILLed by exactly this path.
3. It does **NOT** compare requested-vs-actual model or fail loud:
```
grep -n "requested|actualModel|verifyModel|gpt-5|substitut" executor-audit.ts
→ only the doc-comment at :485; no requested-vs-actual compare, no fail-loud
```
[SOURCE: grep no-match for the compare]. **The gate is one comparison away from existing:** the audit already has the `model` field; rec #12 is "diff it against the requested model and emit `error`/`blocked_stop` instead of silently proceeding." This is a *sharper* read than "the runtime lacks any model handling" — it has the data, it just doesn't act on the mismatch.

The 002 spec guards this **operationally** for this round (pre-flight smoke + verify-model-in-logs) [SOURCE: 002 spec.md:99-128, 125-128], not **structurally**. Rec #12 makes it structural.

## This lineage's gaps (for the merge)
1. **OpenCode/Codex per-turn-hook read-reliability is unverified.** Only the Claude hook wiring was opened and proven firing (this session). The matrix rates OpenCode/Codex "runtime-dep" — a sibling on those runtimes should confirm whether an equivalent thermostat exists.
2. **Numeric leverage/(cost+blast) scores are deliberately coarse** (ordering aid, 1–5). #5/#10/#12 cost/blast are estimates an implementation packet must firm up.
3. **leak_test multi-runtime port is unscoped.** The metric definitions are portable; the per-runtime log-location + model-id bucketing is not specified (Claude = `~/.claude/projects/**/*.jsonl` + `claude-*` ids; OpenCode/Codex layouts unmapped).
4. **`leak_test.py` was not run** (research-only + needs real transcripts). G5's signature numbers are cited from the source corpus, not reproduced on this repo.
5. **The AGENTS.md line-count discrepancy** (round-1 changelog says 447; live file is 424) is unexplained — likely a later trim. Flagged, not chased (out of scope); the ~76-line-headroom claim holds either way.

## Merge questions (for the parent orchestrator)
- **Q-merge-1:** Do the sibling lineages confirm or contradict the read-reliability matrix — especially the OpenCode/Codex per-turn-hook rating and the AGENTS.md-decay claim?
- **Q-merge-2:** Do the lineages independently converge on the same top cluster (governor-on-hook / mutation-check / recursion-control)? (This lineage and the prior `opus-account2` lineage both rank that triad #1–#3 — a convergence signal worth recording.)
- **Q-merge-3:** Did any lineage surface a surface×delta this one missed? Union the rec sets, then re-dedup vs round 1.
- **Q-merge-4:** Tier-A budget check — do the AGENTS.md/CLAUDE.md twins stay under the ~500-line soft budget after a doctrine-spine addition (#6)? (Live baseline: 424 lines, ~76 headroom.)
- **Q-merge-5:** Does any sibling confirm the **underscore/hyphen dead-pointer** finding (AGENTS.md:217 → `skill-advisor-hook.md` vs the real `skill_advisor_hook.md`)? If so, the staleness rec (#4) gets a concrete, already-broken first target — strengthening the case for a pointer-resolution test.

## Sources Consulted
- `.opencode/skills/deep-loop-runtime` + `system-spec-kit/references` (grep-absence: evidence-contract fields)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` (model-record + SIGKILL escalation; no compare/fail-loud)
- `149/001-initial-refinement/changelog.md` (carried follow-ups; line-count baseline)
- `002 spec.md` (operational mitigation for the codex risk)
- This lineage's iterations 1–4

## Assessment
- **newInfoRatio: 0.14** — Re-assessment + gap-doc iteration. New: both carried follow-ups confirmed still-open by grep, the *sharper* read on rec #12 (the audit already has the model field; the SIGKILL is the runtime's own kill path), the AGENTS.md line-count discrepancy, the gap list, and 5 merge questions. No new source techniques.
- **Novelty justification:** the grep-absence confirmations and the "one comparison away" framing of rec #12 are net-new verification product; the merge questions structure the cross-lineage reconciliation.
- **Confidence:** HIGH on the grep-absence (zero hits is unambiguous); HIGH on the executor-audit reads (cited line numbers).

## Reflection
- **What worked:** Grep-absence as a positive signal — zero hits = genuinely unbuilt; and reading executor-audit.ts directly distinguished "the runtime's own SIGKILL escalation" from "an external SIGKILL of codex," sharpening rec #12.
- **What failed:** Nothing material.
- **Ruled out:** Treating the codex risk as fixed because the 002 pre-flight smoke passed — smoke is an operational guard for this round; the runtime still lacks the model-mismatch fail-loud comparison (the data is captured but unacted-on).

## Recommended Next Focus
LOOP COMPLETE — 5/5 key questions answered; newInfoRatio descended 0.95→0.14 (monotone). Proceed to SYNTHESIS: write this lineage's `research.md`, dashboard, and findings registry; hand the 5 merge questions to the parent orchestrator.
