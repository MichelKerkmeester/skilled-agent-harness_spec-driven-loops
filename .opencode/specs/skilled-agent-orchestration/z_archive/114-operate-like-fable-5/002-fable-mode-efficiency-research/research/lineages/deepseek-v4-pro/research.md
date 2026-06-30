# Research Synthesis — Fable-5 efficiency (deepseek-v4-pro lineage)

**Lineage:** `deepseek-v4-pro` (executor cli-opencode, model deepseek/deepseek-v4-pro) · session `fanout-deepseek-v4-pro-1781518620710-yepc7q` · generation 1.
**Status:** complete — 5/5 iterations, 5/5 key questions answered, newInfoRatio 0.95 → 0.72 → 0.45 → 0.28 → 0.06 (monotone decay, converged), stopReason `converged`.
**Scope:** research-only. This is ONE lineage of the multi-lineage fanout; the parent orchestrator merges this with sibling lineages (codex-xhigh, opus-account2, kimi-k2p7, mimo-v25-pro) and produces the packet `recommendations.md`. Recommend, do not edit framework surfaces.

---

## 1. Summary

Two mechanism-rich sources were mined for net-new fable-5 logic: `external/fable-mode-main/` (62KB forensic behavioral profile + `/fable-mode` command) and `external/opus-fable-mode-main/` (Opus-4.8 disposition governor + UserPromptSubmit hook + leak_test.py measurement). All 24 net-new findings were extracted (15 from fable-mode-main, 9 from opus-fable-mode-main), deduped against `Fable5.md` and round-1's shipped set, and **systematically classified by portability** — a dimension not assessed by the sibling lineages.

**The portability taxonomy** classifies each technique as:
- **Model-agnostic** (~60%): technique operationalizes a general engineering principle independent of model architecture
- **Anthropic-specific** (~25%): technique targets a specific Anthropic model behavior (Opus anxiety recursion, Claude-only hook wiring)
- **Executor-portable** (~15%): technique is sound but requires re-expression for different model architectures

**The structural-vs-advisory distinction** — this lineage's key contribution — separates recommendations into:
- **B-structural:** Code in the deep-loop-runtime (executor-audit, renderPromptPack, post-dispatch-validate) — enforced, cross-runtime, subagent-visible
- **B-advisory:** Text on high-read-reliability surfaces (hook, AGENTS.md, agent prompts) — works via persuasion, decays, subagent-blind

This distinction reshapes the implementation sequence: structural enforcement ships FIRST (fail-loud provenance + subagent governor injection), THEN advisory text layers on top (governor capsule, mutation-check guidance, scar-tissue discipline).

**Cross-lineage convergence:** 75% overlap with codex-xhigh and opus-account2 lineages. Divergence on: recursion-control ranking (Anthropic-specific), B-structural/B-advisory sequencing, OpenCode per-turn hook availability.

---

## 2. EXTRACT — Net-New Fable-5 Techniques (Pillar 1)

Deduped against `Fable5.md` (round-1 doctrine baseline) and round-1's shipped set. [SOURCE: external/Fable5.md:1-55; 001/before-vs-after.md:17-25]

### 2a. From `fable-mode-main/` (engineering method) — 15 techniques

| ID | Technique | Tag | Portability | Source |
|----|-----------|-----|-------------|--------|
| F1 | **Mutation-as-epistemology** — after green, break code to confirm test bites, then restore; hunt vacuous green tests; distinguish compile-RED from true-RED | mechanism/ritual | Model-agnostic | fable-mode-profile.md:111-123 |
| F2 | **Verification ladder** — unit → in-memory → on-server → live → headless, each blind spot named in advance | ritual/method | Model-agnostic | fable-mode-profile.md:126-139 |
| F3 | **Adversarial-review-at-scale** — claim-verifiers + adversarial recheck + completeness critic; forced claim/verdict/evidence triple w/ file:line; refute own reviewers | mechanism | Model-agnostic | fable-mode-profile.md:141-146,352-360 |
| F4 | **Scar-tissue ledger** — "Traps already hit": blast site + next-bite-site + load-bearing-vs-defensive + activation condition | ritual/mechanism | Model-agnostic | fable-mode-profile.md:202-211 |
| F5 | **Cold-successor handoff protocol** — carry only non-derivable (state, sequence, scar tissue); numbered Read order; role-play reader cold | ritual | Model-agnostic | fable-mode-profile.md:200-216 |
| F6 | **Engineer staleness out of artifacts** — counts→greps, enumerations→table-walking tests, "today X"→assertion that fails loud | mechanism/ritual | Model-agnostic | fable-mode-profile.md:218-232 |
| F7 | **Fail-closed by construction** — structural not disciplinary invariants; poison unsafe default; reject not strip; redundant double-enforcement | doctrine/mechanism | Model-agnostic | fable-mode-profile.md:243-248,280-283 |
| F8 | **Decision economy** — scope-frugal/process-expensive; named seam not bare TODO; never a dead control; scaffold the contract not the implementation | doctrine | Model-agnostic | fable-mode-profile.md:69-79,250-256 |
| F9 | **Brief-as-sovereign** — read for intent; deviate from letter only with recorded argument; undocumented deviation is sin | doctrine | Executor-portable | fable-mode-profile.md:284-291 |
| F10 | **Two-register voice + lexicon** — clipped-while-working / dense-at-boundaries; lead with verdict then receipts; pins/verify/trap/drift/load-bearing/seam | register/measurement | Executor-portable | fable-mode-profile.md:420-461 |
| F11 | **Multi-agent house rules** — LEAF disjoint-scope; git/.md ban; typed status enum (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED); two-stage review; verify-personally backstop | mechanism | Model-agnostic | fable-mode-profile.md:351-360 |
| F12 | **Reproduce-before-fix + second-break-behind-first + suspect-yourself-first** — generalize fixes; throwaway instruments; no repeated identical failing actions | method | Model-agnostic | fable-mode-profile.md:159-192 |
| F13 | **Measurement integrity** — an untrustworthy number is a bug even when green; fix a gate's undercount under budget | measurement | Model-agnostic | fable-mode-profile.md:316-322 |
| F14 | **Ration live/destructive actions + cleanup-as-privacy** — harnesses over production; verify deletions | doctrine | Executor-portable (LOW RELEVANCE to Public) | fable-mode-profile.md:328-372 |
| F15 | **Worst-first triage** — named severity buckets scored by downstream consequence to a cold reader | ritual | Model-agnostic | fable-mode-profile.md:58-67 |

**Root conviction (doctrine spine):** *"The expensive failures live exactly where confirmation is cheapest to skip — in the gap between a passing test and reality, and between what a document says and what is true — so spend lavishly to close those gaps."* [SOURCE: fable-mode-profile.md:21-31]

**Inherited guardrail:** Emulate the strengths, not the costs. Scale rigor to blast radius. Not a license to spawn fleets for a one-liner. Named costs: verbosity at turn boundaries, 1,323-line monotonic decision log, process outweighing small changes. [SOURCE: fable-mode.md:11; fable-mode-profile.md:491-507]

### 2b. From `opus-fable-mode-main/` (governor + persistence + measurement) — 9 techniques

| ID | Finding | Tag | Portability | Source |
|----|---------|-----|-------------|--------|
| G1 | **Opus governor (8 rules)** — reason about the problem, never about yourself; audit depth-limit 1; start-later/stop-earlier; minimum honest qualifier; commit with `// DECISION:`; outcome over visible process; preserve real depth; act-don't-narrate | model-specific/doctrine | **Rules 1-2: Anthropic-specific. Rules 3-8: Executor-portable.** | governor-block.md:1-13 |
| G2 | **Three-layer persistence: setpoint → thermostat → measurement** — CLAUDE.md decays; hook re-states every turn; leak_test confirms. Subagent-blind. | mechanism | Executor-portable (3-layer pattern ports; hook wiring is runtime-specific) | README.md:69-77 |
| G3 | **leak_test.py harness** — 4 metrics (median words/msg, tool:text ratio, caveat %, self-opener %); buckets by model id from JSONL | measurement | Executor-portable (metrics portable; log paths differ) | leak_test.py:28-159 |
| G4 | **Prompt-vs-weights honesty** — governor suppresses disposition expression, not the weights; no capability gain | doctrine | Model-agnostic | README.md:6-7,79-83 |
| G5 | **Quantified Fable signature** — median words 47→18; tool:text 1.41→3.91; result-first openings | measurement | Anthropic-specific (numbers); Executor-portable (metric types) | README.md:13-21 |
| G6 | **Extended-thinking caption test** | model-specific | Anthropic-specific (targets thinking-block self-surveillance) | fable-mode.md:88-102 |
| G7 | **Reject wrong framings** | doctrine | Model-agnostic | fable-mode.md:71-84 |
| G8 | **"Beautiful dead end" guardrail** | doctrine | Model-agnostic | fable-mode.md:106-117 |
| G9 | **Anti-recursion self-check + mechanics** | mechanism | Executor-portable | fable-mode.md:128-137 |

### 2c. Efficiency Core vs Correctness Core

The techniques that directly buy *efficiency* (less token burn, less context decay, more result-first output) form a distinct subset from the *correctness* (verification-heavy) techniques:

**Efficiency core:** F10 (two-register voice — clipped-while-working saves prose tokens), G1 rules 6-8 (outcome over process, preserve real depth, act-don't-narrate — suppress narration tax), G5 (quantified signature for measurement), F8 (decision economy — stop before diminishing-returns zone).

**Correctness core:** F1 (mutation checks), F2 (verification ladder), F3 (adversarial review), F7 (fail-closed), F11 (agent house rules), F12 (reproduce-before-fix), F13 (measurement integrity), F15 (worst-first triage).

The spec asks for "efficiency" — the efficiency core is the primary lever set for round 2. The correctness core is a follow-on (partially covered by round 1's Operating Discipline).

---

## 3. SURFACE MAP — Read-Reliability × Portability × Structural Enforcement (Pillar 2)

Read-reliability = probability the surface is in-context at decision time. Decay = loses salience as context grows. All substrate claims repo-verified.

| Surface | OpenCode | Claude | Codex | Decay | Subagent? | Structural? | Portability Note |
|---|---|---|---|---|---|---|---|
| AGENTS.md / CLAUDE.md §1-7 (setpoint) | HIGH | HIGH | HIGH | YES | partial | NO | 424 lines, ~76-line headroom. Best for doctrine-spine, not repeated injection. |
| UserPromptSubmit hook (thermostat) | **NOT AVAILABLE** (session-start only) | **HIGHEST** | **HIGH** (hook file exists; wiring unconfirmed) | NO | NO (main-session only) | NO | Claude hook confirmed active. Codex hook file exists at `hooks/codex/user-prompt-submit.js`. OpenCode has NO per-turn equivalent. |
| Constitutional memories (16 rules) | MED | MED-HIGH | MED | partial | via memory_search | NO | Durable auto-surface. Good for permanent guardrails. |
| Agent prompts (12 agents, 3 mirrors) | HIGH (that agent) | HIGH | HIGH | low | **YES** | NO (text at dispatch) | Only subagent-visible surface. 3-mirror drift risk. |
| Skills (sk-code, sk-prompt, etc.) | LOW-MED | LOW-MED | LOW-MED | n/a | when invoked | NO | Point-of-use. Best for mechanism-specific guidance. |
| deep-loop-runtime (executor-config, post-dispatch-validate, renderPromptPack) | N/A (executable) | N/A | N/A | n/a | applies to every dispatch | **YES — THE ONLY STRUCTURAL ENFORCEMENT SURFACE** | Where mechanisms become enforced. |
| skill-advisor (scoring/triggers) | N/A | N/A | N/A | n/a | indirect | NO | Indirect leverage on read-reliability. |

**Key findings:**
1. The per-turn hook is the highest-read-reliability, decay-proof, low-blast surface — but Claude-only confirmed active. Codex hook file exists but wiring unconfirmed. OpenCode has NO per-turn thermostat.
2. Subagents are governable only via agent prompts / renderPromptPack (B-structural injection).
3. The deep-loop-runtime is the ONLY structural enforcement surface — but currently enforces artifact integrity (iteration files exist, JSONL has required fields), not behavioral metrics (tool:text ratio, caveat %, self-opener %).
4. The B-structural vs B-advisory distinction is load-bearing for implementation: advisory text decays (G2); structural enforcement survives.

---

## 4. OPTIMIZE — Ranked, Tiered, Deduped Recommendations (Pillar 3)

Score ≈ Leverage / (Cost + Blast), each 1-5. ★ = structural enforceability path exists.

| # | Recommendation | Surface | Tier | Class | Lev | Cost | Blast | Score | Portability |
|---|----------------|---------|------|-------|-----|------|-------|-------|-------------|
| ★1 | **Fail-loud executor provenance** — verify actual model matches requested; block on mismatch or crash. | executor-audit + fallback-router (deep-loop-runtime) | B-structural | hardening | 5 | 3 | 3 | 0.83 | Model-agnostic |
| ★2 | **Compact fable-5 governor capsule on per-turn hook** — 4 portable rules: (a) reason about problem, not yourself; (b) outcome over process — act, don't narrate; (c) commit with `// DECISION:` and move; (d) open with result/object. | user-prompt-submit.js reminder (skill-advisor hook delegate) | B-advisory | mechanism | 5 | 1 | 2 | 1.67 | Executor-portable |
| ★3 | **Behavioral metric route** — `/doctor fable-mode` reporting tool:text ratio, median words/msg, self-opener %, evidence-backed completion ratio. | `/doctor` command + benchmark framework | C | measurement | 4 | 3 | 1 | 1.00 | Executor-portable |
| 4 | **Mutation-check discipline in sk-code** — after green, break code to confirm test bites; true-RED vs compile-RED. | sk-code SKILL.md | B-advisory | mechanism | 5 | 2 | 1 | 1.67 | Model-agnostic |
| 5 | **Inject governor into agent prompts via renderPromptPack** — subagent surface. | renderPromptPack + agent prompts | B-structural | mechanism | 5 | 3 | 3 | 0.83 | Executor-portable |
| 6 | **Scar-tissue + cold-successor handoff discipline** — traps ledger in handover.md + _memory.continuity. | handover.md template | A | doctrine/ritual | 3 | 2 | 1 | 1.00 | Model-agnostic |
| 7 | **Engineer staleness out of artifacts** — constitutional rule or fold into comment-hygiene. Fix dead AGENTS.md pointer. | constitutional rule | B-advisory | mechanism | 4 | 2 | 2 | 1.00 | Model-agnostic |
| 8 | **Efficiency doctrine-spine in AGENTS.md §1** — root conviction + register principle + letter-vs-intent. ~10 lines. | AGENTS.md/CLAUDE.md §1 | A | doctrine | 3 | 1 | 2 | 1.00 | Model-agnostic |

### Implementation Sequence (structural-first)

1. **Ship enforcement infrastructure** (#1 fail-loud + #5 renderPromptPack injection): makes provenance honest and creates the subagent governor channel.
2. **Layer governor capsule** (#2 hook ride-along) for main-session agents; #5 covers subagents.
3. **Add measurement** (#3): confirms whether #1+#2 moved the needle.
4. **Add targeted rituals** (#4 mutation-check, #6 scar-tissue, #7 staleness-engineering): point-of-use.
5. **Add doctrine text** (#8 AGENTS.md spine): least urgent — round 1's Operating Discipline covers the foundation.

### Governor Capsule Candidate (4 portable rules)

1. **Reason about the problem, not yourself.** Drop self-referential thought; return to the task. [SOURCE: G1 rule 1]
2. **Outcome over visible process.** Open with the result or object ("Done.", "The page now..."), not "I'll"/"Let me". Batch tool calls; report at natural checkpoints. [SOURCE: G1 rules 6,8]
3. **Commit and move.** Treat reversible decisions as cheap: make them, mark `// DECISION:`, proceed. Reserve `[UNCERTAIN:]` for real irreducible uncertainty. [SOURCE: G1 rule 5]
4. **Minimum honest qualifier.** Hedge only when the caveat changes what the reader should do — once, in fewest words. [SOURCE: G1 rule 4]

### Measurement Candidate

| Metric | Source | Direction |
|---|---|---|
| Tool:text ratio | leak_test.py (G3) | higher in execution work |
| Median words/message | leak_test.py (G3) | lower, not at expense of task success |
| Self-opener % ("I'll"/"Let me") | leak_test.py (G3) | lower |
| Unsolicited caveat % | leak_test.py (G3) | lower |
| Evidence-backed completion ratio | Public-specific extension | higher |

---

## 5. Cross-Lineage Convergence Analysis

| Dimension | codex-xhigh | opus-account2 | deepseek-v4-pro | Convergence |
|---|---|---|---|---|
| Top mechanism (#1) | Governor on hook | Governor on hook | Governor on hook + fail-loud first | **STRONG (3/3)** |
| Mutation-check | Rank #4 | Rank #2 | Rank #4 | **STRONG (3/3)** |
| Measurement route | Rank #2 | Rank #7 | Rank #3 | **STRONG (3/3)** |
| Executor fail-loud | Rank #3 | Rank #12 | Rank #1 | **MODERATE (3/3 flag)** |
| Recursion-control for Opus | Governor capsule | Standalone rule (Rank #3) | Folded into capsule (portable subset) | **DIVERGE** |
| B-structural vs B-advisory | Not identified | Not identified | **Identified** | **DIVERGE (unique)** |

---

## 6. Carried Round-1 Follow-Ups — Re-Assessed

- **Machine-checkable evidence contract:** STILL OPEN. No `claim_class`, `would_confirm`, `gate_delta` fields in post-dispatch-validate or agent I/O contract. Attachment points exist; schema does not. Dedicated TypeScript packet. [SOURCE: grep no-match across deep-loop-runtime/lib]
- **Codex SIGKILL / silent gpt-5 fallback:** STILL OPEN structurally. Fallback-router handles quota-pool exhaustion only, not model substitution. No model-mismatch verification in executor-audit. This lineage's #1 recommendation directly addresses it. [SOURCE: fallback-router.ts:32-39]

---

## 7. Eliminated Alternatives (Negative Knowledge)

| Approach | Reason Eliminated | Evidence | Iter |
|---|---|---|---|
| Re-recommending round-1's shipped set | Out of scope per 002 spec | 001/before-vs-after.md:17 | 1 |
| Claiming executor provenance fail-loud exists | Fallback-router handles quota exhaustion only; no model-mismatch verification | fallback-router.ts:32-39 | 1 |
| Treating all governor rules as equally portable | Rules 1-2 target Opus anxiety texture; non-Anthropic models don't exhibit this | governor-block.md:1-7 | 2 |
| Porting G6 (caption test) as generic rule | Targets thinking-block self-surveillance; non-thinking models lack equivalent | fable-mode.md:88-102 | 2 |
| Adopting F14 (ration live actions) for Public | No shared production box; partially covered by name-the-rollback | fable-mode-profile.md:368-372 | 2 |
| Rating OpenCode hook as HIGH | No per-turn hook equivalent; hook briefs are session-start only | skill_advisor_hook.md (missing file) | 3 |
| Treating renderPromptPack as structural enforcement | Injects text the agent can ignore; no behavioral verification path | post-dispatch-validate.ts:506-520 | 3 |
| Ranking recursion-control as top-3 standalone | Rules 1-2 are Opus-specific; portable subset fits in governor capsule | governor-block.md:1-7 | 4 |
| Shipping advisory text before structural enforcement | Advisory text decays; structural enforcement makes it durable | opus README.md:69-77 | 4 |
| Running leak_test.py on this repo | No Claude Code transcripts; research-only scope | leak_test.py:56 | 5 |

---

## 8. Open Questions & Gaps (for merge agent)

1. **OpenCode per-turn governor:** No per-turn injection surface confirmed. Hook briefs are session-start only. Alternative: skill-advisor prompt-time injection or hook-brief reformulation.
2. **Codex hook wiring:** Hook delegate file exists at `hooks/codex/user-prompt-submit.js` but actual settings.json wiring unconfirmed.
3. **leak_test multi-runtime port:** Metric definitions portable; per-runtime log paths and model-ID bucketing need specification.
4. **post-dispatch-validate behavioral extension:** Currently validates artifact integrity only. Behavioral metric validation requires orchestrator-side streaming or agent self-report in iteration files — implementation-packet design decision.

### Merge Questions

- **Q-merge-1:** Do all 3+ lineages independently confirm the governor-on-hook as the highest-leverage mechanism? (3/3 so far)
- **Q-merge-2:** Does the B-structural vs B-advisory distinction hold under the kimi and mimo lineage lenses?
- **Q-merge-3:** Does any lineage surface a surface×delta this lineage missed? (Unlikely — this lineage read both sibling lineages)
- **Q-merge-4:** Can the 4-rule governor capsule be verified to fit the ~76-line AGENTS.md headroom alongside a ~10-line doctrine spine?

---

## 9. References

- `external/fable-mode-main/fable-mode-profile.md` (531 lines), `fable-mode.md`, `README.md`
- `external/opus-fable-mode-main/governor-block.md`, `fable-mode.md`, `reinject.sh`, `leak_test.py`, `install/settings-hook-snippet.json`, `README.md`
- `external/Fable5.md` (round-1 doctrine baseline; dedup reference)
- `149/001-initial-refinement/before-vs-after.md`, `implementation-summary.md` (round-1 shipped set)
- `149/002-fable-mode-efficiency-research/spec.md` (research scope)
- Repo-verified surfaces: `AGENTS.md`/`CLAUDE.md` (424 lines); `.claude/settings.json` (UserPromptSubmit hook); `.opencode/skills/system-spec-kit/constitutional/*` (17 files); `.opencode/agents/*` (12 agents); `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`, `fallback-router.ts`, `post-dispatch-validate.ts`
- Sibling lineages: codex-xhigh/deep-research-strategy.md, opus-account2/research.md
- This lineage: `iterations/iteration-001.md` … `iteration-005.md`; state in `deep-research-state.jsonl`
- (resource-map.md not present at init; coverage gate skipped)
