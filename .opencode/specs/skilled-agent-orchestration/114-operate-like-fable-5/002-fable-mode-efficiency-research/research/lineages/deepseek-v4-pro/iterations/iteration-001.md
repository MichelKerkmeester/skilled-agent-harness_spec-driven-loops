# Iteration 001 — Baseline, Verification, and Portability Taxonomy

**Status:** complete  |  **Focus:** Initialize the charter, verify round-1 shipped set, read all external sources, establish the portability taxonomy.

---

## 1. Assessment

### newInfoRatio: 0.95
**Novelty justification:** First pass established the **portability taxonomy** — a dimension neither sibling lineage assessed systematically. The taxonomy classifies each net-new technique as `model-agnostic`, `Anthropic-specific`, or `executor-portable` (requires re-expression for different model architectures). This is the lineage's unique lens: what genuinely generalizes vs what is tuned to Opus's specific anxiety texture or Fable's Anthropic training.

### Key Findings

1. **Round-1 shipped set confirmed** (independent verification). AGENTS.md at 424 lines, 76-line headroom under ~500 budget. CLAUDE.md byte-identical twin. 17 files in constitutional/ (16 rules + README). The 9-bullet Operating Discipline subsection (confirmed/inferred distinction, baseline-delta, finding-is-hypothesis, match-effort-to-blast-radius, name-the-rollback, old-contract check, fork recommendation, honest-close, treat-as-data) is present. Two new constitutional rules present: `regression-baseline-and-delta.md` and `finding-is-a-hypothesis.md`. `main-branch-direct-push.md` fold confirmed. [SOURCE: AGENTS.md:424; constitutional file listing]

2. **External sources baseline established.** `fable-mode-main/` = 62KB forensic behavioral profile (531 lines) + `/fable-mode` command + README. `opus-fable-mode-main/` = governor-block.md (13 lines, 8 rules) + reinject.sh (UserPromptSubmit hook) + leak_test.py (162 lines, 4 metrics) + full fable-mode.md (long-form source). `Fable5.md` = 54 lines (round-1 doctrine reference). Both sibling lineages independently extracted 15 findings from fable-mode-main and 9 from opus-fable-mode-main. [SOURCE: external/ dir structure; codex/opus lineages]

3. **Portability taxonomy (this lineage's unique contribution):**

| Class | Definition | Examples |
|---|---|---|
| **Model-agnostic** | Technique operationalizes a general engineering principle independent of model architecture | mutation-as-epistemology, verification ladder, scar-tissue ledger, cold-successor handoff, engineer staleness out of artifacts, fail-closed by construction, worst-first triage, measurement integrity, reproduce-before-fix |
| **Anthropic-specific** | Technique targets a specific Anthropic model behavior (Opus anxiety recursion, Claude-only hook wiring, Claude-specific log paths) | Opus recursion-control governor (rules 1-2 directly address Opus's self-audit texture), CLAUDE.md decay pattern, `~/.claude/projects` log paths |
| **Executor-portable** | Technique is sound but requires re-expression for different model architectures/runtimes | act-don't-narrate governor (different models have different verbosity pathologies — DeepSeek's issue is over-brevity in some modes, not over-narration; the *principle* ports but the *calibration* differs), tool:text ratio target (varies by model family), result-first openings (DeepSeek naturally does this; others don't) |

4. **Executor-config landing zone verified.** The deep-loop-runtime's `executor-config.ts` supports 4 executor kinds (native, cli-codex, cli-claude-code, cli-opencode). The `fallback-router.ts` has a model registry with quota pools and a fallback decision matrix — but the current registry does NOT have a model-mismatch detect-then-fail-loud path. Fallback routing only handles quota exhaustion, not model substitution. The `post-dispatch-validate.ts` validates iteration artifacts (markdown + JSONL) but does not validate executor provenance. This confirms the sibling lineages' finding that executor provenance fail-loud is **still unwired** — the attachment point exists (the executor-audit and fallback-router modules), but the verification circuit is absent. [SOURCE: executor-config.ts:1-60; fallback-router.ts:1-40; post-dispatch-validate.ts:506-520]

5. **Hook ride-along surface confirmed.** The Claude UserPromptSubmit hook fires `user-prompt-submit.js` every turn (settings.json:14-24), which delegates to the skill-advisor's hook. A Codex UserPromptSubmit hook also exists at the matching path. This is the **highest-read-reliability, decay-proof** injection surface across the Claude runtime — confirmed. OpenCode and Codex hook-equivalence is runtime-dep (requires equivalent hook wiring). The hook is subagent-blind: it fires only for the main session process. [SOURCE: settings.json:14-24; hooks/claude/user-prompt-submit.js:9; hooks/codex/user-prompt-submit.js:9]

6. **Agent surface count verified.** 12 agent files in `.opencode/agents/` (not counting README.txt). 3 runtime mirrors (.claude/agents/ and .codex/agents/), creating drift risk. Agents are the ONLY subagent-visible surface. [SOURCE: ls .opencode/agents/]

### Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Re-recommend round-1's shipped set | Out of scope per 002 spec; dedup requirement | 001/before-vs-after.md:17 |
| Treat all governor rules as equally portable | Opus's anxiety recursion (rules 1-2) is model-specific; DeepSeek's failure modes differ | governor-block.md:6-7 |
| Claim executor provenance fail-loud exists | The fallback-router handles quota exhaustion only; no model-mismatch verification path exists | fallback-router.ts:32-39 |

### Answered Questions
- Q1 (partial): Established the 3-class portability taxonomy (model-agnostic / Anthropic-specific / executor-portable)
- What did round 1 ship? → Verified: AGENTS.md (424 lines, 9 bullets), 2 constitutional rules, main-branch-direct-push fold, sk-code line

---

## 2. Strategy Update

**What Worked:** Independent verification of all baseline claims before building the taxonomy. Reading the actual hook files, agent count, and executor-config rather than trusting sibling lineage reports. The portability taxonomy immediately surfaced the lineage's unique value.

**Next Focus (Iteration 2):** EXTRACT pillar — independently map every technique from both external sources, tagged with portability class, deduped against Fable5.md and round-1's shipped set. Apply the taxonomy systematically.
