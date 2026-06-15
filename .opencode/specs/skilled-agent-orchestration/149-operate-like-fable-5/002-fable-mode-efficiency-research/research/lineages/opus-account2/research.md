# Research Synthesis — Fable-5 efficiency (opus-account2 lineage)

**Lineage:** `opus-account2` (executor cli-claude-code, model claude-opus-4-8) · session `fanout-opus-account2-1781514394068-103t44` · generation 1.
**Status:** complete — 5/5 iterations, 5/5 key questions answered, newInfoRatio 0.95 → 0.78 → 0.60 → 0.25 → 0.15 (monotone), stopReason `maxIterationsReached`, legal-stop gates pass.
**Scope:** research-only. This is ONE lineage of a 2-lineage fanout; the parent orchestrator merges it with the `codex-xhigh` lineage and produces the packet `recommendations.md`. Recommend, do not edit framework surfaces.

---

## 1. Summary

Two new mechanism-rich sources were mined for net-new fable-5 logic beyond round-1's distilled `Fable5.md` doctrine: `external/fable-mode-main/` (a 62KB forensic behavioral profile of the engineering *method* + the `/fable-mode` command) and `external/opus-fable-mode-main/` (an Opus-4.8 disposition *governor* + a `UserPromptSubmit` re-injection hook + a `leak_test.py` measurement harness). 24 net-new findings were extracted (F1–F15 method, G1–G9 governor/persistence/measurement), all deduped against `Fable5.md` and round-1's shipped set. Every adjustable Public-repo surface was inventoried and rated by **read-reliability per runtime**, repo-verified. The findings were consolidated into a **12-item ranked, tiered (A doctrine / B mechanism / C measurement) surface×delta recommendation set** scored by behavioral-leverage / (cost + blast-radius). Both carried round-1 follow-ups were confirmed still-open by grep-absence.

**The efficiency core** (cheapest, highest-read-reliability, decay-proof) is three Tier-B mechanisms: **(#1)** ride the already-firing per-turn `UserPromptSubmit` hook with a compact fable-5 governor; **(#2)** import Fable's mutation-check / claim-falsifier into sk-code verification; **(#3)** add a recursion-control rule ("reason about the problem and the person, not yourself"; audit-depth-limit-1; the caption test) for the Opus anxiety on our xhigh executors. Per the source's own honesty (G4), these steer *style and persistence*, not *capability* — and the spec asked for **efficiency**, which is exactly what they buy (less token burn, less context decay, more result-first output).

---

## 2. EXTRACT — net-new fable-5 techniques (Pillar 1)

Deduped against `Fable5.md` (round-1 doctrine baseline) and round-1's shipped set (AGENTS.md Operating Discipline subsection, the 2 constitutional rules, the `main-branch-direct-push.md` fold, the sk-code line) [SOURCE: external/Fable5.md:1-55; 149/001-initial-refinement/implementation-summary.md:56-81].

### 2a. From `fable-mode-main/` (engineering method) — F1–F15
| ID | Technique | Tag | Source |
|----|-----------|-----|--------|
| F1 | **Mutation-as-epistemology** — after green, break the code to confirm the test bites, then restore; mutation as a falsifier of *written claims*; hunt vacuous green tests; compile-RED vs true-RED | mechanism/ritual | fable-mode-profile.md:111-123 |
| F2 | **Verification ladder** — unit → in-memory → on-server → live → headless, each blind spot named in advance ("in-memory-green is not production-green") | ritual/method | fable-mode-profile.md:126-139 |
| F3 | **Adversarial-review-at-scale** — claim-verifiers + adversarial recheck + completeness critic; forced `claim/verdict/evidence` triple w/ file:line; refute own reviewers | mechanism | fable-mode-profile.md:141-146,352-360 |
| F4 | **Scar-tissue ledger** — "Traps already hit": blast site + next-bite-site + load-bearing-vs-defensive + activation condition | ritual/mechanism | fable-mode-profile.md:202-211 |
| F5 | **Cold-successor handoff protocol** — carry only non-derivable (state, sequence, scar tissue); numbered Read order; role-play reader cold; ship next brief | ritual | fable-mode-profile.md:200-216 |
| F6 | **Engineer staleness out of artifacts** — counts→greps, enumerations→table-walking tests, "today X" → an assertion that fails loud | mechanism/ritual | fable-mode-profile.md:218-232 |
| F7 | **Fail-closed by construction** — structural not disciplinary invariants; poison unsafe default; reject not strip; redundant double-enforcement | doctrine/mechanism | fable-mode-profile.md:243-248,280-283 |
| F8 | **Decision economy** — scope-frugal/process-expensive; named seam not bare TODO; never a dead control; scaffold the contract not the implementation | doctrine | fable-mode-profile.md:69-79,250-256 |
| F9 | **Brief-as-sovereign** — read for intent; deviate from the letter only with a recorded argument; undocumented deviation is the sin; contract>spec>decisions>handoff | doctrine | fable-mode-profile.md:284-291 |
| F10 | **Two-register voice + lexicon** — clipped-while-working / dense-at-boundaries; lead with verdict then receipts; importance via averted disaster not adjectives; no celebration/apology/flattery; pins/verify/trap/drift/load-bearing/seam/byte-identical | register/measurement | fable-mode-profile.md:420-461 |
| F11 | **Multi-agent house rules** — LEAF disjoint-scope; git/.md ban; typed status enum (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED); two-stage spec-then-quality review; verify-personally backstop; orchestrator commits | mechanism | fable-mode-profile.md:351-360 |
| F12 | **Reproduce-before-fix + second-break-behind-first + suspect-yourself-first** — generalize fixes so the next instance can't hide; throwaway instruments | method | fable-mode-profile.md:159-192 |
| F13 | **Measurement integrity** — an untrustworthy number is a bug even when green; fix a gate's undercount under budget | measurement | fable-mode-profile.md:316-322 |
| F14 | **Ration live/destructive actions** — harnesses over production; cleanup as a privacy ethic (verify the deletion) | doctrine | fable-mode-profile.md:328-372 |
| F15 | **Worst-first triage** — named severity buckets scored by downstream consequence to a cold reader | ritual | fable-mode-profile.md:58-67 |

**Root conviction (the doctrine spine):** *the expensive failures live exactly where confirmation is cheapest to skip — the gap between green and reality, between a doc and the truth — so spend lavishly to close those gaps* [SOURCE: fable-mode-profile.md:21-31]. Every F-finding descends from it.

**Inherited guardrail:** "Emulate the strengths, not the costs… scale rigor to blast radius… not a license to spawn fleets for a one-liner" [SOURCE: fable-mode.md:11]. Named costs: verbosity at turn boundaries, a 1,323-line monotonic decision log, process outweighing small changes, autonomy outrunning operator tolerance [SOURCE: fable-mode-profile.md:491-507]. Any adoption must inherit this guardrail or it imports the cost with the strength.

### 2b. From `opus-fable-mode-main/` (governor + persistence + measurement) — G1–G9
| ID | Finding | Tag | Source |
|----|---------|-----|--------|
| G1 | **Opus recursion-control governor (8 rules)** — "reason about the problem and the person, never about yourself"; **audit depth-limit 1, never audit the audit**; start-later/stop-earlier; minimum honest qualifier; **commit with `// DECISION:`**; outcome over visible process; preserve real depth; act-don't-narrate | model-specific/doctrine | governor-block.md:1-13 |
| G2 | **Three-layer persistence: setpoint → thermostat → measurement** — CLAUDE.md governor decays as context grows; the `UserPromptSubmit` hook re-states it every turn to defeat decay; leak_test confirms movement. **CRITICAL: the hook is subagent-BLIND — inject the governor into agent briefs separately** | mechanism | README.md:69-77; reinject.sh:8-9 |
| G3 | **leak_test.py harness** — buckets assistant msgs by model id from JSONL logs; metrics: median words/msg, tool:text ratio, unsolicited-caveat %, "I'll/Let me" self-opener %; verdict = converging iff moved-toward AND closed-distance; INSUFFICIENT < 30 prose msgs | measurement | leak_test.py:28-159 |
| G4 | **Prompt-vs-weights honesty** — a governor suppresses the disposition's *expression*, not the weights; **no capability gain**; the capability lever is task-structure (closed prompts) + multi-LLM orchestration | doctrine | README.md:6-7,79-83 |
| G5 | **Quantified Fable signature** — median words 47→18; mean EQUAL (~99-100) so it's distribution not less; tool:text 1.41→3.91 (the token burn); result-first openers; cleanest tells = tool:text + opener style | measurement | README.md:13-21 |
| G6 | **Extended-thinking caption test** — captions about the problem (healthy) vs about yourself (burning the budget on self-surveillance); name a self-directed thought in ≤3 words and return | model-specific/mechanism | fable-mode.md:88-102 |
| G7 | **Reject wrong framings** — refuse a false dichotomy/bad premise and reframe; the lumpy-bit-not-armor-bit; the outward turn (ask about *their* need) | doctrine | fable-mode.md:71-84 |
| G8 | **"Beautiful dead end" guardrail** — don't follow a thread to a technically-correct conclusion that no longer helps; don't overcorrect into curtness (govern the governor) | doctrine | fable-mode.md:106-117 |
| G9 | **Anti-recursion self-check + mechanics** — one pass not a loop (did I answer or narrate difficulty; every qualifier load-bearing; made decisions or handed back; any sentence about me; 0/1 honest lump); toggle `FABLE_MODE_OFF=1`; hook timeout 5; new-session activation | mechanism | fable-mode.md:128-137; reinject.sh:11-14 |

---

## 3. SURFACE MAP — adjustable surfaces × read-reliability per runtime (Pillar 2)

Read-reliability = probability the surface is in-context at decision time. **Decay** = loses salience as context grows. All substrate claims repo-verified [SOURCE: AGENTS.md wc=424, diff≡CLAUDE.md; ls constitutional/=16 rules+README; .claude/settings.json:14-24; ls .opencode/agents/=12; executor-config.ts present].

| Surface | OpenCode | Claude | Codex | Decay | Subagent-visible | Note |
|---|---|---|---|---|---|---|
| AGENTS.md / CLAUDE.md §1-7 (setpoint) | HIGH | HIGH | HIGH | **YES** | partial | byte-synced twin; ~76-line headroom under ~500 |
| Live `UserPromptSubmit` hook reminder (thermostat) | runtime-dep | **HIGHEST** | runtime-dep | **NO** | **NO** (main-session only) | already firing on Claude, already carries a constitutional reminder = proven ride-along |
| Constitutional memories (16) | MED | MED-HIGH | MED | partial | via memory_search | durable auto-surface; any rule wired into the hook → HIGH |
| Agent prompts (12 agents, 3 mirrors) | HIGH (that agent) | HIGH | HIGH | low | **YES — the only subagent surface** | 3 drifting mirrors = drift risk |
| Skills (sk-code, sk-prompt, sk-doc, sk-git, deep-loop-workflows, system-spec-kit, system-skill-advisor) | LOW-MED | LOW-MED | LOW-MED | n/a | when invoked | high leverage, conditional |
| Commands (deep/*, speckit/*, memory/*) | HIGH when invoked | same | same | n/a | n/a | governs one workflow only when run |
| deep-loop runtime / executor-config / renderPromptPack / post-dispatch-validate | N/A (executable) | N/A | N/A | n/a | applies to every dispatch | where mechanisms/measurement get ENFORCED |
| skill-advisor scoring/triggers | N/A | N/A | N/A | n/a | affects what surfaces | indirect leverage on read-reliability itself |

**Conclusions:** (1) the per-turn hook is the highest-read-reliability, decay-proof, low-blast surface — but Claude-only + subagent-blind; (2) subagents are governable only via agent prompts / `renderPromptPack`; (3) AGENTS.md is high-read but decays — pair any doc governor with the thermostat; (4) constitutional rules are the durable auto-surfacing home for doctrine; (5) executor-config / post-dispatch-validate / renderPromptPack are where Tier-B/C become enforced rather than advisory. **Verified staleness candidate:** AGENTS.md cites `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md`, which does not exist — a dead pointer in the most-read surface (exactly the rot F6 says to convert into a check).

---

## 4. OPTIMIZE — ranked, tiered surface×delta recommendations (Pillar 3)

`Score ≈ Leverage / (Cost + Blast)`, each 1–5 (ordering aid, not precision). All NET-NEW vs round 1 unless noted. Every Tier-B/C item inherits the G4 honesty (steers efficiency, not capability) and the fable-mode.md:11 blast-radius guardrail.

| # | Recommendation | Surface | Tier | Maps | Lev | Cost | Blast | Score | Dedup |
|---|----------------|---------|------|------|-----|------|-------|-------|-------|
| 1 | **Compact fable-5 governor on the live per-turn hook** | `user-prompt-submit.js` reminder (+ OpenCode/Codex hooks) | B | G1,G2,G5,F10 | 5 | 1 | 2 | **1.67** | net-new |
| 2 | **Mutation-check / claim-falsifier discipline** | sk-code verification (+ optional rule) | B | F1,F3,F13 | 5 | 2 | 1 | **1.67** | net-new |
| 3 | **Recursion-control rule + xhigh briefs** (reason-about-problem-not-yourself; depth-limit-1; caption test) | new constitutional rule + extended-thinking executor briefs | B | G1,G6,G8 | 5 | 2 | 1 | **1.67** | net-new |
| 4 | **Engineer staleness out of artifacts** (rot→test); fix the dead hook pointer first | new rule / fold into comment-hygiene | B | F6,F4,F13 | 4 | 2 | 2 | **1.00** | partial |
| 5 | **Inject governor into agent prompts / renderPromptPack** (subagent surface) | agent prompts + deep-loop render | B | G2,G1,G6 | 5 | 3 | 3 | **0.83** | net-new (needs sync) |
| 6 | **Small doctrine-spine line in AGENTS.md §1** (root conviction + register + letter-vs-intent), paired with #1 | AGENTS.md/CLAUDE.md §1 | A | spine,F8,F9,F10 | 3 | 1 | 2 | **1.00** | net-new (NOT a restate of round-1 subsection) |
| 7 | **leak_test-style behavioral metric** | `/doctor` route or `deep:*-benchmark` dimension | C | G3,G5,F13 | 4 | 4 | 1 | **0.80** | net-new |
| 8 | **Scar-tissue + cold-successor handoff discipline** | handover.md + _memory.continuity | A/B | F4,F5 | 3 | 2 | 1 | **1.00** | net-new |
| 9 | **Verification ladder w/ named blind spots** | sk-code + deep-review | B | F2 | 3 | 1 | 1 | **1.50** | partial |
| 10 | **Adversarial-review schema + machine-checkable evidence contract** | @orchestrate/@deep-review prompts + post-dispatch-validate | B | F3,F11,F15,F5 | 5 | 5 | 4 | **0.56** | = round-1 carried follow-up (dedicated packet) |
| 11 | **Decision-economy + fail-closed-by-construction doctrine** | sk-code doctrine (+ optional rule) | A | F7,F8 | 3 | 1 | 1 | **1.50** | net-new |
| 12 | **Fail-loud on model mismatch in executor-audit** | executor-audit / dispatch | B | F7,F13,G4 | 4 | 3 | 3 | hardening | = round-1 carried follow-up (codex SIGKILL/silent-gpt-5; dedicated packet) |

**Land-first cluster (#1–#3):** high-leverage, low-cost, low-blast, and squarely on "efficiency." **Durable/cheap (#4, #6, #8, #9, #11).** **High-value-real-cost (#5, #7).** **Dedicated packets (#10, #12)** — both are the carried round-1 follow-ups: highest leverage, highest cost, and structural (TypeScript runtime + schema work), not surgical drops.

---

## 5. Carried round-1 follow-ups — re-assessed

- **Machine-checkable evidence contract (= rec #10): STILL OPEN.** Grep for its named fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`, "evidence contract") across `deep-loop-runtime` + `system-spec-kit/references` → zero hits [SOURCE: grep no-match]. The attachment point exists (`validateIterationOutputs` / post-dispatch-validate; `agent-io-contract.md`); the schema does not. Confirms round-1's deferral [SOURCE: 149/001 implementation-summary.md:130].
- **codex SIGKILL / silent gpt-5 fallback (= rec #12): STILL OPEN structurally; mitigated operationally this round.** No model-verification / fail-loud / SIGKILL handling in the runtime — only generic env `fallback` + a "corrupt lines silently dropped" note [SOURCE: grep no-match over deep-loop-runtime/scripts + deep-research/scripts]. The 002 spec guards it by process (pre-flight smoke + verify-model-in-logs) [SOURCE: 002 spec.md:99-128], not by a runtime fix. Rec #12 makes it structural: compare requested vs actual model in the executor audit and emit `error`/`blocked_stop` rather than silently substitute.

---

## 6. Eliminated Alternatives (negative knowledge — primary output)

| Approach | Reason eliminated | Evidence | Iter |
|----------|-------------------|----------|------|
| Re-recommending round-1's shipped set (Operating Discipline subsection, 2 rules, the fold, sk-code line) | Out of scope per 002 spec | 149/001 implementation-summary.md:56-81 | 1 |
| Importing Fable's em-dash habit / monotonic decision-log bloat | Fable's own failure modes (costs), not techniques | fable-mode-profile.md:491-507 | 1 |
| Verbatim copy of `governor-block.md` into our CLAUDE.md | Byte-synced twin set already near the ~500-line budget; verbatim paste bloats the most-read surface | governor-block.md:1-13; 149/001 changelog.md:22 | 2 |
| Porting `leak_test.py` as-is | Targets `claude-*` ids + `~/.claude/projects` layout; multi-runtime port needs runtime-aware bucketing | leak_test.py:38-44 | 2 |
| AGENTS.md/CLAUDE.md as the *sole* home for a persistent governor | Setpoint decays (G2); doc-only repeats round-1's advisory-only weakness — must pair with the thermostat | opus README.md:69-77 | 3 |
| Hand-editing the 3 agent mirrors as a first move without a sync mechanism | 3-runtime-mirror drift risk | 149/001 implementation-summary.md:101 | 3 |
| Adopting F14 (ration live actions / cleanup-as-privacy) as a rec | Low relevance; no shared production box; partially covered by name-the-rollback | iteration-001.md F14 | 4 |
| Standalone F12 / G7 / G8 recs | F12 covered by round-1 finding-is-a-hypothesis; G7/G8 folded into rec #3's governor guardrails | iteration-004.md | 4 |
| Treating codex SIGKILL as fixed because the 002 pre-flight smoke passed | Smoke is an operational guard for this round; the runtime still lacks model-mismatch fail-loud | grep no-hits; 002 spec.md:125-128 | 5 |

---

## 7. Open questions & gaps (for the cross-lineage merge)

**Gaps in this lineage:**
1. OpenCode/Codex per-turn-hook read-reliability unverified (rated "runtime-dep"; only the Claude hook wiring was opened directly).
2. Numeric leverage/(cost+blast) scores are deliberately coarse; #5/#10/#12 cost-blast are estimates an implementation packet must firm up.
3. leak_test multi-runtime port unscoped (metric definitions portable; per-runtime log-location/model-id mapping not specified).
4. `leak_test.py` not run (needs real transcripts + out of research-only scope) — G5 signature cited from the source corpus, not reproduced on this repo.

**Merge questions:**
- **Q-merge-1:** does codex-xhigh confirm/contradict the read-reliability matrix (OpenCode/Codex hook + AGENTS.md decay)?
- **Q-merge-2:** do both lineages independently rank the same top cluster (governor-on-hook / mutation-check / recursion-control)?
- **Q-merge-3:** did either lineage surface a surface×delta this one missed? Union, then re-dedup vs round 1.
- **Q-merge-4:** tier-A budget check — do the AGENTS.md/CLAUDE.md twins stay under ~500 lines after a doctrine-spine addition (#6)?

---

## 8. References

- `external/fable-mode-main/fable-mode-profile.md`, `fable-mode.md`, `README.md`
- `external/opus-fable-mode-main/governor-block.md`, `fable-mode.md`, `reinject.sh`, `leak_test.py`, `install/settings-hook-snippet.json`, `README.md`
- `external/Fable5.md` (round-1 doctrine baseline; dedup reference)
- `149/001-initial-refinement/implementation-summary.md`, `changelog.md` (round-1 shipped set + carried follow-ups)
- Repo-verified surfaces: `AGENTS.md`/`CLAUDE.md`; `.opencode/skills/system-spec-kit/constitutional/*` (16 rules); `.claude/settings.json` (UserPromptSubmit hook); `.opencode/agents/*` (12 agents); `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- This lineage's iterations: `iterations/iteration-001.md` … `iteration-005.md`; state in `deep-research-state.jsonl`; registry in `deep-research-findings-registry.json`
- (resource-map.md not present at init; coverage gate skipped)
