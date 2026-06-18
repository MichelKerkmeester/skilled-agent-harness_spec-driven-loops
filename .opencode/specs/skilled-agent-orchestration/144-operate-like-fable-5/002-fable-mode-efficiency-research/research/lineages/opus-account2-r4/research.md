# Research Synthesis — Fable-5 efficiency (opus-account2-r4 lineage)

**Lineage:** `opus-account2-r4` (executor cli-claude-code, model claude-opus-4-8, account2) · session `fanout-opus-account2-r4-1781525949822-w9b8qe` · generation 1.
**Status:** complete — 5/5 iterations, 5/5 key questions answered, newInfoRatio 0.95 → 0.78 → 0.58 → 0.22 → 0.14 (monotone), stopReason `maxIterationsReached`, legal-stop gates pass.
**Scope:** research-only. This is ONE lineage of a multi-lineage fanout; the parent orchestrator merges it with the sibling lineages (codex-xhigh, deepseek-v4-pro, kimi-k2p7, mimo-v25-pro, and the prior opus-account2) and produces the packet `recommendations.md`. Recommend, do not edit framework surfaces.

---

## 1. Summary

Two mechanism-rich sources were mined for net-new fable-5 logic beyond round-1's distilled `Fable5.md` doctrine: `external/fable-mode-main/` (a 531-line forensic profile of the Fable-5 engineering *method* + the `/fable-mode` command) and `external/opus-fable-mode-main/` (a toolkit that makes a *running* Opus 4.8 behave more like the suspended Fable 5 — an 8-rule disposition *governor* + a `UserPromptSubmit` re-injection hook + a `leak_test.py` measurement harness, built from 9,224 Fable + 27,685 Opus real Claude-Code messages). **24 net-new findings** were extracted (F1–F15 method, G1–G9 governor/persistence/measurement), all deduped against `Fable5.md` and round-1's shipped set. Every adjustable Public-repo surface was inventoried and rated by **read-reliability per runtime**, repo-verified. The findings were consolidated into a **12-item ranked, tiered (A doctrine / B mechanism / C measurement) surface×delta recommendation set** scored by behavioral-leverage / (cost + blast-radius). Both carried round-1 follow-ups were confirmed still-open by grep-absence.

**The efficiency core** (cheapest, highest-read-reliability, decay-proof) is three findings: **(#1)** ride the already-firing per-turn `UserPromptSubmit` hook with a compact (one-paragraph) fable-5 governor; **(#2)** import Fable's mutation-check / claim-falsifier into sk-code verification; **(#3)** add a recursion-control rule ("reason about the problem and the person, not yourself"; audit-depth-limit-1; the caption test) for the Opus anxiety on our xhigh executors. Per the source's own honesty (G4), these steer *style and persistence*, not *capability* — and the spec asked for **efficiency**, which is exactly what they buy: the measured governor signature is **median words 47→18 and tool:text 1.41→3.91** (~3× less narration per unit of work).

**Two repo-verified facts this lineage stands behind:** (a) the thermostat is **not hypothetical** — our `UserPromptSubmit` hook fired on this very research session and carried a constitutional reminder, proving the ride-along; (b) the AGENTS.md "dead pointer" is a **hyphen/underscore naming drift** (the doc exists as `skill_advisor_hook.md`), which makes the staleness rec concrete and the fix a one-character-class edit plus a pointer-resolution test.

---

## 2. EXTRACT — net-new fable-5 techniques (Pillar 1)

Deduped against `Fable5.md` (round-1 doctrine baseline) and round-1's shipped set (AGENTS.md Operating Discipline subsection, the 2 constitutional rules, the `main-branch-direct-push.md` fold, the sk-code line) [SOURCE: external/Fable5.md:5-54; 149/001-initial-refinement/changelog.md:18-39].

### 2a. From `fable-mode-main/` (engineering method) — F1–F15
| ID | Technique | Tag | Source |
|----|-----------|-----|--------|
| F1 | **Mutation-as-epistemology** — after green, break the code to confirm the test bites, then restore; mutation as a *falsifier of written claims* (green-stays-green-when-you-break-it ⇒ the claim is false); hunt vacuous green tests; compile-RED vs true-RED | mechanism/ritual | fable-mode-profile.md:111-123 |
| F2 | **Verification ladder** — unit → in-memory → on-server → live → headless, each blind spot named in advance ("in-memory-green is not production-green") | ritual/method | fable-mode-profile.md:126-139 |
| F3 | **Adversarial-review-at-scale** — claim-verifiers + adversarial recheck + completeness critic; forced `claim/verdict/evidence` triple w/ file:line; refutes own reviewers | mechanism | fable-mode-profile.md:141-146,352-360 |
| F4 | **Scar-tissue ledger** — "Traps already hit": blast site + next-bite-site + load-bearing-vs-defensive + activation condition | ritual/mechanism | fable-mode-profile.md:202-211 |
| F5 | **Cold-successor handoff protocol** — carry only non-derivable (state, sequence, scar tissue); numbered Read order; role-play reader cold; ship next brief | ritual | fable-mode-profile.md:200-216 |
| F6 | **Engineer staleness out of artifacts** — counts→greps, enumerations→table-walking tests, "today X" → an assertion that fails loud | mechanism/ritual | fable-mode-profile.md:218-232 |
| F7 | **Fail-closed by construction** — structural not disciplinary invariants; poison unsafe default; reject not strip; redundant double-enforcement; code-disjoint verifier | doctrine/mechanism | fable-mode-profile.md:243-248,280-283 |
| F8 | **Decision economy** — scope-frugal/process-expensive; named seam not bare TODO; never a dead control; scaffold the contract not the implementation | doctrine | fable-mode-profile.md:69-79,250-256 |
| F9 | **Brief-as-sovereign** — read for intent; deviate from the letter only with a recorded argument; *undocumented* deviation is the sin; contract>spec>decisions>handoff | doctrine | fable-mode-profile.md:284-291 |
| F10 | **Two-register voice + lexicon** — clipped-while-working / dense-at-boundaries; lead with verdict then receipts; importance via averted disaster not adjectives; no celebration/apology/flattery; pins/verify/trap/drift/load-bearing/seam/byte-identical | register/measurement | fable-mode-profile.md:420-461 |
| F11 | **Multi-agent house rules** — LEAF disjoint-scope; git/.md ban; typed status enum (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED); two-stage spec-then-quality review; verify-personally backstop; orchestrator commits | mechanism | fable-mode-profile.md:351-360 |
| F12 | **Reproduce-before-fix + second-break-behind-first + suspect-yourself-first** — generalize fixes so the next instance can't hide; throwaway instruments | method | fable-mode-profile.md:159-192 |
| F13 | **Measurement integrity** — an untrustworthy number is a bug even when green; fix a gate's undercount under budget | measurement | fable-mode-profile.md:316-322 |
| F14 | **Ration live/destructive actions** — harnesses over production; cleanup as a privacy ethic (verify the deletion) | doctrine | fable-mode-profile.md:328-372 |
| F15 | **Worst-first triage** — named severity buckets scored by downstream consequence to a cold reader | ritual | fable-mode-profile.md:58-67 |

**Root conviction (the doctrine spine):** *the expensive failures live exactly where confirmation is cheapest to skip — the gap between green and reality, between a doc and the truth — so spend lavishly to close those gaps* [SOURCE: fable-mode-profile.md:21-31]. Every F-finding descends from it.

**Inherited guardrail:** "Emulate the strengths, not the costs… scale rigor to blast radius… not a license to spawn fleets for a one-liner" [SOURCE: fable-mode.md:11]. Named costs: verbosity at turn boundaries, a 1,323-line monotonic decision log, process outweighing small changes, autonomy outrunning operator tolerance, em-dash non-compliance, operational slips [SOURCE: fable-mode-profile.md:491-507]. Any adoption must inherit this guardrail — and our framework already owns the matching primitive (CLAUDE.md §1 "Match effort to blast-radius").

### 2b. From `opus-fable-mode-main/` (governor + persistence + measurement) — G1–G9
| ID | Finding | Tag | Source |
|----|---------|-----|--------|
| G1 | **Opus recursion-control governor (8 rules)** — "reason about the problem and the person, never about yourself"; **audit depth-limit 1, never audit the audit**; start-later/stop-earlier; minimum honest qualifier; **commit with `// DECISION:`**; outcome over visible process; preserve real depth; act-don't-narrate | model-specific/doctrine | governor-block.md:1-13 |
| G2 | **Three-layer persistence: setpoint → thermostat → measurement** — CLAUDE.md governor decays as context grows; the `UserPromptSubmit` hook re-states it every turn to defeat decay; leak_test confirms movement. **CRITICAL: the hook is subagent-BLIND — inject the governor into agent briefs separately** | mechanism | README.md:69-77; reinject.sh:8-9 |
| G3 | **leak_test.py harness** — buckets assistant msgs by model id from JSONL logs; metrics: median words/msg, tool:text ratio, unsolicited-caveat %, "I'll/Let me" self-opener %; verdict = converging iff moved-toward AND closed-distance; INSUFFICIENT < 30 prose msgs | measurement | leak_test.py:28-159 |
| G4 | **Prompt-vs-weights honesty** — a governor suppresses the disposition's *expression*, not the weights; **no capability gain**; the capability lever is task-structure (closed prompts) + multi-LLM orchestration | doctrine | README.md:6-7,79-83 |
| G5 | **Quantified Fable signature** — median words 47→18; mean EQUAL (~100) so it's distribution not less; tool:text 1.41→3.91 (the token burn); result-first openers; cleanest tells = tool:text + opener style | measurement | README.md:13-21 |
| G6 | **Extended-thinking caption test** — captions about the problem (healthy) vs about yourself (burning the budget on self-surveillance); name a self-directed thought in ≤3 words and return | model-specific/mechanism | fable-mode.md:88-102 |
| G7 | **Reject wrong framings** — refuse a false dichotomy/bad premise and reframe; the lumpy-bit-not-armor-bit; the outward turn (ask about *their* need) | doctrine | fable-mode.md:71-84 |
| G8 | **"Beautiful dead end" guardrail** — don't follow a thread to a technically-correct conclusion that no longer helps; don't overcorrect into curtness (govern the governor) | doctrine | fable-mode.md:106-117 |
| G9 | **Anti-recursion self-check + mechanics** — one pass not a loop; toggle `FABLE_MODE_OFF=1`; hook fires on UserPromptSubmit; new-session activation | mechanism | fable-mode.md:128-137; reinject.sh:11-14 |

**Independent observation:** the `reinject.sh` payload (lines 16-18) distills the entire 8-rule governor to a **single ~90-word paragraph** — proof that a fable-5 governor on our hook needs one dense paragraph, not 13 lines. That directly answers the "won't it bloat the most-read surface?" objection.

---

## 3. SURFACE MAP — adjustable surfaces × read-reliability per runtime (Pillar 2)

Read-reliability = probability the surface is in-context at decision time. **Decay** = loses salience as context grows. All substrate claims repo-verified [SOURCE: wc -l AGENTS.md CLAUDE.md = 424/424, diff -q clean; ls constitutional/ = 16 rules+README; .claude/settings.json:14-20 + dist hook present; ls .opencode/.claude/.codex agents = 12 each; ls lib/deep-loop/*.ts].

| Surface | OpenCode | Claude | Codex | Decay | Subagent-visible | Note |
|---|---|---|---|---|---|---|
| AGENTS.md / CLAUDE.md §1-7 (setpoint) | HIGH | HIGH | HIGH | **YES** | partial | byte-synced 424-line twins; ~76-line headroom under ~500 |
| Live `UserPromptSubmit` hook reminder (thermostat) | runtime-dep | **HIGHEST** | runtime-dep | **NO** | **NO** (main-session only) | already firing on Claude, already carries a constitutional reminder = **proven ride-along (fired on this session)** |
| Constitutional memories (16) | MED | MED-HIGH | MED | partial | via memory_search | durable auto-surface; any rule wired into the hook → HIGH |
| Agent prompts (12 × 3 mirrors) | HIGH (that agent) | HIGH | HIGH | low | **YES — the only subagent surface** | must route through `agent-mirror-sync.yml`; 3-mirror drift risk |
| Skills (sk-code, sk-prompt, sk-doc, sk-git, deep-loop-workflows, system-spec-kit, system-skill-advisor) | LOW-MED | LOW-MED | LOW-MED | n/a | when invoked | high leverage, conditional |
| Commands (deep/*, speckit/*, memory/*) | HIGH when invoked | same | same | n/a | n/a | governs one workflow only when run |
| deep-loop runtime / executor-config / prompt-pack(renderPromptPack) / post-dispatch-validate / executor-audit | N/A (executable) | N/A | N/A | n/a | applies to every dispatch | where mechanisms/measurement get ENFORCED |
| skill-advisor scoring/triggers | N/A | N/A | N/A | n/a | affects what surfaces | indirect leverage on read-reliability itself |

**Conclusions:** (1) the per-turn hook is the highest-read-reliability, decay-proof, low-blast surface — but Claude-only + subagent-blind; (2) subagents are governable only via agent prompts / `renderPromptPack`, routed through `agent-mirror-sync.yml`; (3) AGENTS.md is high-read but decays — pair any doc governor with the thermostat; (4) constitutional rules are the durable auto-surfacing home for doctrine; (5) executor-config / prompt-pack / post-dispatch-validate / executor-audit are where Tier-B/C become enforced rather than advisory.

**Verified staleness candidate (sharper than a plain dead pointer):** AGENTS.md:217 cites `references/hooks/skill-advisor-hook.md` (HYPHENS); the real files are `skill_advisor_hook.md` + `skill_advisor_hook_validation.md` (UNDERSCORES) — a naming-convention drift, *the doc exists*. A grep-test asserting every AGENTS.md `references/.../*.md` pointer resolves would catch it; the fix is a one-character-class edit (exactly the rot F6 says to convert into a check).

---

## 4. OPTIMIZE — ranked, tiered surface×delta recommendations (Pillar 3)

`Score ≈ Leverage / (Cost + Blast)`, each 1–5 (ordering aid, not precision). All NET-NEW vs round 1 unless noted. Every Tier-B/C item inherits the G4 honesty (steers efficiency, not capability) and the fable-mode.md:11 blast-radius guardrail.

| # | Recommendation | Surface | Tier | Maps | Lev | Cost | Blast | Score | Dedup |
|---|----------------|---------|------|------|-----|------|-------|-------|-------|
| 1 | **Compact (one-paragraph) fable-5 governor on the live per-turn hook** | `UserPromptSubmit` reminder payload (+ OpenCode/Codex hooks) | B | G1,G2,G5,F10 | 5 | 1 | 2 | **1.67** | net-new |
| 2 | **Mutation-check / claim-falsifier discipline** | sk-code verification (+ optional rule) | B | F1,F3,F13 | 5 | 2 | 1 | **1.67** | net-new |
| 3 | **Recursion-control rule + xhigh briefs** (reason-about-problem-not-yourself; depth-limit-1; caption test) | new constitutional rule + extended-thinking executor briefs | B | G1,G6,G8 | 5 | 2 | 1 | **1.67** | net-new |
| 4 | **Engineer staleness out of artifacts** (rot→test); first fix the underscore/hyphen dead pointer + add a pointer-resolution test | new rule / fold into comment-hygiene | B | F6,F4,F13 | 4 | 2 | 2 | **1.00** | partial (sharper) |
| 5 | **Inject governor into agent prompts / renderPromptPack** (subagent surface, hook-blind) — via agent-mirror-sync | agent prompts + deep-loop prompt-pack | B | G2,G1,G6 | 5 | 3 | 3 | **0.83** | net-new (needs sync) |
| 6 | **One-line doctrine-spine in AGENTS.md §1** (root conviction + register + letter-vs-intent), paired with #1 | AGENTS.md/CLAUDE.md §1 | A | spine,F8,F9,F10 | 3 | 1 | 2 | **1.00** | net-new (NOT a restate of round-1 subsection) |
| 7 | **leak_test-style behavioral metric** (runtime-aware bucketing) | `/doctor` route or `deep:*-benchmark` dimension | C | G3,G5,F13 | 4 | 4 | 1 | **0.80** | net-new |
| 8 | **Scar-tissue + cold-successor handoff discipline** | handover.md + _memory.continuity | A/B | F4,F5 | 3 | 2 | 1 | **1.00** | net-new |
| 9 | **Verification ladder w/ pre-named blind spots** | sk-code + deep-review | B | F2 | 3 | 1 | 1 | **1.50** | partial |
| 10 | **Adversarial-review schema + machine-checkable evidence contract** | @orchestrate/@deep-review prompts + post-dispatch-validate | B | F3,F11,F15,F5 | 5 | 5 | 4 | **0.56** | = round-1 carried follow-up (dedicated packet) |
| 11 | **Decision-economy + fail-closed-by-construction doctrine** | sk-code doctrine (+ optional rule) | A | F7,F8 | 3 | 1 | 1 | **1.50** | net-new |
| 12 | **Fail-loud on model mismatch in executor-audit** (the audit already records the model; add the compare) | executor-audit.ts / dispatch | B | F7,F13,G4 | 4 | 3 | 3 | hardening | = round-1 carried follow-up (codex SIGKILL/silent-gpt-5; dedicated packet) |

**Land-first cluster (#1–#3):** high-leverage, low-cost, low-blast, squarely on "efficiency." **Durable/cheap (#4, #6, #8, #9, #11).** **High-value-real-cost (#5, #7).** **Dedicated packets (#10, #12)** — both are the carried round-1 follow-ups: highest leverage, highest cost, structural (TypeScript runtime + schema work).

**Efficiency framing:** the spec asked for efficiency; G4/G5 are decisive — the governor's *measured* gains are median words 47→18 and tool:text 1.41→3.91, i.e. ~3× less narration per unit of work and a tighter token distribution. That is exactly efficiency, and #1+#3 buy it persistently and cheaply. #2 buys a different efficiency: it kills the most expensive failure class (a green-but-vacuous test) at the cheapest point. The capability lever stays task-structure + orchestration (G4) — a separate axis we already pull.

---

## 5. Carried round-1 follow-ups — re-assessed

- **Machine-checkable evidence contract (= rec #10): STILL OPEN.** Grep for its named fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`) across `deep-loop-runtime` + `system-spec-kit/references` → zero hits [SOURCE: grep no-match]. The attachment point exists (`post-dispatch-validate.*`, `agent-io-contract.md`); the schema does not. Confirms round-1's deferral [SOURCE: 149/001 changelog.md:62].
- **codex SIGKILL / silent gpt-5 fallback (= rec #12): STILL OPEN structurally; mitigated operationally this round.** `executor-audit.ts` **records** the actual model ("Audit record with kind, model, reasoning effort, and service tier" [SOURCE: executor-audit.ts:485]) and **itself escalates SIGTERM→SIGKILL** on a hung child [SOURCE: executor-audit.ts:654,688] — so the observed SIGKILL is partly the runtime's own kill path. But there is **no requested-vs-actual model comparison and no fail-loud** [SOURCE: grep no-match]. The gate is *one comparison away*: the audit already has the `model` field; rec #12 is "diff it against the requested model and emit `error`/`blocked_stop` instead of silently proceeding." The 002 spec guards it operationally (pre-flight smoke + verify-model-in-logs) [SOURCE: 002 spec.md:99-128], not structurally.

---

## 6. Eliminated Alternatives (negative knowledge — primary output)

| Approach | Reason eliminated | Evidence | Iter |
|----------|-------------------|----------|------|
| Re-recommending round-1's shipped set (Operating Discipline subsection, 2 rules, the fold, sk-code line) | Out of scope per 002 spec | 149/001 changelog.md:18-39 | 1 |
| Importing Fable's em-dash habit / monotonic decision-log bloat | Fable's own failure modes (costs), not techniques | fable-mode-profile.md:491-507 | 1 |
| Verbatim copy of `governor-block.md` into our CLAUDE.md | Byte-synced 424-line twins, ~76-line headroom; the reinject payload proves a paragraph suffices | governor-block.md:1-13; reinject.sh:16-18 | 2 |
| Porting `leak_test.py` as-is | Targets `claude-*` ids + `~/.claude/projects` layout; multi-runtime port needs runtime-aware bucketing | leak_test.py:34,38-44,56-58 | 2 |
| AGENTS.md/CLAUDE.md as the *sole* home for a persistent governor | Setpoint decays (G2); doc-only repeats round-1's advisory-only weakness — must pair with the thermostat | opus README.md:69-77 | 3 |
| Hand-editing one agent mirror without routing through `agent-mirror-sync.yml` | 3-runtime-mirror drift risk; repo runs automated mirror sync | .github/workflows/agent-mirror-sync.yml | 3 |
| Adopting F14 (ration live actions / cleanup-as-privacy) as a rec | Low relevance; no shared production box; partially covered by name-the-rollback | iteration-001.md F14 | 4 |
| Standalone F12 / G7 / G8 recs | F12 covered by round-1 finding-is-a-hypothesis; G7/G8 folded into rec #3's governor guardrails | iteration-004.md | 4 |
| Treating codex SIGKILL as fixed because the 002 pre-flight smoke passed | Smoke is operational; the runtime captures the model but never compares/fails-loud | executor-audit.ts:485; grep no-match; 002 spec.md:125-128 | 5 |

---

## 7. Open questions & gaps (for the cross-lineage merge)

**Gaps in this lineage:**
1. OpenCode/Codex per-turn-hook read-reliability unverified (rated "runtime-dep"; only the Claude hook wiring was opened — and proven firing).
2. Numeric leverage/(cost+blast) scores are deliberately coarse; #5/#10/#12 cost-blast are estimates an implementation packet must firm up.
3. leak_test multi-runtime port unscoped (metric definitions portable; per-runtime log-location/model-id mapping not specified).
4. `leak_test.py` not run (needs real transcripts + out of research-only scope) — G5 signature cited from the source corpus, not reproduced on this repo.
5. AGENTS.md line-count discrepancy (round-1 changelog says 447; live file 424) unexplained — flagged, not chased; the ~76-line-headroom claim holds either way.

**Merge questions:**
- **Q-merge-1:** Do the sibling lineages confirm/contradict the read-reliability matrix (OpenCode/Codex hook + AGENTS.md decay)?
- **Q-merge-2:** Do the lineages independently rank the same top cluster (governor-on-hook / mutation-check / recursion-control)? (This lineage and the prior `opus-account2` lineage both rank that triad #1–#3.)
- **Q-merge-3:** Did any lineage surface a surface×delta this one missed? Union, then re-dedup vs round 1.
- **Q-merge-4:** Tier-A budget check — do the AGENTS.md/CLAUDE.md twins stay under ~500 lines after a doctrine-spine addition (#6)? (Live baseline: 424, ~76 headroom.)
- **Q-merge-5:** Does any sibling confirm the underscore/hyphen dead-pointer finding? If so, the staleness rec (#4) gets a concrete already-broken first target.

---

## 8. References

- `external/fable-mode-main/fable-mode-profile.md`, `fable-mode.md`, `README.md`
- `external/opus-fable-mode-main/governor-block.md`, `fable-mode.md`, `reinject.sh`, `leak_test.py`, `README.md`
- `external/Fable5.md` (round-1 doctrine baseline; dedup reference)
- `149/001-initial-refinement/changelog.md` (round-1 shipped set + carried follow-ups)
- Repo-verified surfaces: `AGENTS.md`/`CLAUDE.md` (wc/diff); `.opencode/skills/system-spec-kit/constitutional/*` (16 rules); `.claude/settings.json` (UserPromptSubmit hook) + `dist/hooks/claude/user-prompt-submit.js` + `system-skill-advisor/.../user-prompt-submit.js`; `.opencode/agents/` `.claude/agents/` `.codex/agents/` (12 each); `.github/workflows/agent-mirror-sync.yml`; `.opencode/skills/deep-loop-runtime/lib/deep-loop/*.ts` (executor-config, prompt-pack, post-dispatch-validate, executor-audit)
- This session's own injected `UserPromptSubmit hook additional context` (empirical thermostat proof)
- This lineage's iterations: `iterations/iteration-001.md` … `iteration-005.md`; state in `deep-research-state.jsonl`; registry in `deep-research-findings-registry.json`
- (resource-map.md not present at init; coverage gate skipped)
