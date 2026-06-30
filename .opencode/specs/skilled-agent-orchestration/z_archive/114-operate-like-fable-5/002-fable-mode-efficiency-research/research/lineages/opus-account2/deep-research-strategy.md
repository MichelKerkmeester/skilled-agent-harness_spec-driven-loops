---
title: Deep Research Strategy - opus-account2 lineage (Fable-5 efficiency, round 2)
description: Persistent research brain for the opus-account2 fan-out lineage. Tracks focus, what worked/failed, ruled-out directions, and next focus across iterations.
trigger_phrases:
  - "fable-5 efficiency research"
  - "opus-account2 lineage"
  - "fable mode surface map"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — opus-account2 lineage

Runtime strategy for the `opus-account2` fan-out lineage (executor: cli-claude-code model=claude-opus-4-8). Independent full loop; merged later with the codex-xhigh lineage.

---

## 2. TOPIC

Extract every net-new fable-5 technique/mechanism in `external/fable-mode-main/` (62KB forensic behavioral profile + `/fable-mode` command) and `external/opus-fable-mode-main/` (CLAUDE.md governor block + `UserPromptSubmit` reinject hook + `leak_test.py` measurement harness + Opus recursion-control), deduped against `external/Fable5.md` and round-1's shipped set. Map every adjustable Public-repo surface by read-reliability per runtime (OpenCode / Claude / Codex). Produce a ranked, tiered (A doctrine / B mechanism / C measurement) surface×delta recommendation set scored by behavioral-leverage / (cost + blast-radius). Research-only — recommend, do not edit framework surfaces.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1 (EXTRACT-1): What net-new fable-5 techniques live in `fable-mode-main/` (forensic profile + command) vs Fable5.md and round-1's shipped doctrine? Tag each doctrine|ritual|mechanism|measurement|model-specific. — ANSWERED iter 1 (15 net-new: F1–F15).
- [x] Q2 (EXTRACT-2): What net-new mechanisms/measurement/model-specific logic live in `opus-fable-mode-main/` (governor, reinject hook, leak_test, recursion-control)? — ANSWERED iter 2 (9 net-new: G1–G9).
- [x] Q3 (SURFACE MAP): What are the adjustable Public-repo surfaces and their read-reliability per runtime? — ANSWERED iter 3 (read-reliability matrix; per-turn hook = firing thermostat; ~76-line AGENTS.md headroom; 16-rule constitutional; agent-prompt = only subagent surface).
- [x] Q4 (OPTIMIZE): What is the ranked surface×delta set, tiered A/B/C, scored by leverage/(cost+blast), deduped vs round 1? — ANSWERED iter 4 (11 ranked recs; top cluster #1-#3 = governor-on-hook / mutation-check / recursion-control).
- [x] Q5 (FOLLOW-UPS + GAPS): Re-assess the carried round-1 follow-ups; document gaps/open questions. — ANSWERED iter 5 (both follow-ups confirmed still-open by grep-absence; new rec #12 fail-loud-on-model-mismatch; gap list + 4 merge questions).

---

## 4. NON-GOALS
- Implementing any recommendation (deferred to a gated, owner-approved follow-up).
- Re-recommending round-1's shipped set (AGENTS.md Operating Discipline subsection; the 2 constitutional rules regression-baseline-and-delta.md + finding-is-a-hypothesis.md; the main-branch-direct-push.md fold; the sk-code Baseline & blast-radius line).
- Cross-lineage merge/synthesis (the parent orchestrator merges opus-account2 + codex-xhigh).
- Editing any framework surface this round.

---

## 5. STOP CONDITIONS
- All 5 key questions answered with evidence-backed findings, OR
- maxIterations (5) reached, OR
- newInfoRatio composite convergence with legal-stop gates passing (source diversity, focus alignment, key-question coverage).

---

## 6. ANSWERED QUESTIONS
- Q1 (EXTRACT-1) — iter 1. 15 net-new fable-5 techniques from fable-mode-main, deduped vs Fable5.md + round-1: F1 mutation-as-epistemology, F2 verification ladder, F3 adversarial-review-at-scale + forced evidence schema, F4 scar-tissue ledger, F5 cold-successor handoff protocol, F6 staleness-into-tests, F7 fail-closed-by-construction, F8 decision economy / named seam / never-a-dead-control, F9 brief-sovereign letter-vs-intent, F10 two-register voice + lexicon + averted-disaster framing, F11 multi-agent house rules (LEAF + typed status + two-stage review), F12 reproduce-before-fix + second-break + suspect-self, F13 measurement integrity, F14 ration-live-actions / harnesses / cleanup-as-privacy, F15 worst-first severity buckets. Root conviction + cost guardrail captured.
- Q2 (EXTRACT-2) — iter 2. 9 net-new from opus-fable-mode-main: G1 Opus recursion-control governor (8 rules, "reason about the problem not yourself", depth-limit-1), G2 three-layer persistence (setpoint CLAUDE.md → thermostat UserPromptSubmit reinject → measurement leak_test; hook is subagent-BLIND — inject into agent briefs separately), G3 leak_test harness (median words/msg, tool:text ratio, caveat%, self-opener% from JSONL logs), G4 prompt-vs-weights honesty (governor steers style not capability; capability lever = task-structure + orchestration), G5 quantified Fable signature (words 47→18, tool:text 1.41→3.91, result-first openers), G6 extended-thinking caption test, G7 reject-wrong-framings + outward turn, G8 "beautiful dead end" guardrail, G9 anti-recursion self-check + toggle/scope mechanics.
- Q3 (SURFACE MAP) — iter 3. Read-reliability matrix across OpenCode/Claude/Codex. Repo-verified: AGENTS.md≡CLAUDE.md 424 lines/7 sections/~76-line headroom; 16 constitutional rules + README; the live Claude UserPromptSubmit hook (user-prompt-submit.js, timeout 3) ALREADY re-injects a per-turn reminder carrying a constitutional line (= the firing thermostat / ride-along point); executor-config.ts confirmed; 12 agents across 3 drifting mirrors. Conclusions: (1) per-turn hook = highest-read-reliability, decay-proof, low-blast — but Claude-only + subagent-blind; (2) subagents governable only via agent prompts/renderPromptPack; (3) AGENTS.md decays → pair doc with thermostat; (4) constitutional = durable auto-surfacing doctrine home; (5) executor-config/post-dispatch-validate/renderPromptPack = where mechanisms/measurement get ENFORCED. Staleness candidate: dead skill-advisor-hook.md pointer in AGENTS.md.
- Q4 (OPTIMIZE) — iter 4. 11 ranked surface×delta recs, tiered A/B/C, scored leverage/(cost+blast), all deduped vs round 1. Top cluster (score 1.67): #1 ride the live per-turn hook with a compact fable-5 governor [B], #2 mutation-check/claim-falsifier into sk-code [B], #3 recursion-control constitutional rule + xhigh briefs [B]. Mid (1.0-1.5): #4 staleness-into-tests, #6 small doctrine-spine in AGENTS.md (paired with #1), #8 scar-tissue into handover, #9 verification ladder, #11 decision-economy/fail-closed. Cost-heavy: #5 governor into agent prompts (subagent surface; needs sync), #7 leak_test-style metric [C] as /doctor or deep:*-benchmark. #10 adversarial-schema + machine-checkable evidence contract = round-1 carried follow-up (highest leverage, highest cost → dedicated packet). Efficiency core = #1 + #3 (style/persistence levers; capability lever stays task-structure + orchestration per G4).
- Q5 (FOLLOW-UPS + GAPS) — iter 5. Both carried round-1 follow-ups confirmed STILL OPEN by grep-absence: (A) machine-checkable evidence contract — zero hits for its named fields across deep-loop-runtime + system-spec-kit/references (= rec #10); (B) codex SIGKILL / silent gpt-5 fallback — no model-verification/fail-loud code in the runtime (only generic env fallback + "corrupt lines silently dropped"); 002 mitigates it operationally (pre-flight smoke + verify-model-in-logs), not structurally → new rec #12 (fail-loud on model mismatch in executor-audit, Tier B). Gaps: OpenCode/Codex hook read-reliability unverified; numeric scores coarse; leak_test multi-runtime port unscoped; leak_test not run (research-only). 4 merge questions logged.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Pairing the `/fable-mode` command (distilled actionable layer) with the 62KB profile (evidence layer) — gives technique + provenance quote together (iteration 1).
- Pre-loading the round-1 dedup baseline (Fable5.md + impl-summary + changelog) before extraction kept findings filtered to net-new (iteration 1).
- Reading governor + long-form directive + hook + harness *together* exposed the setpoint/thermostat/measurement triad as one designed system; reading `reinject.sh`'s header comment caught the subagent-blindness constraint a README-only read would miss (iteration 2).
- Verifying surfaces against the real repo (not the spec's enumeration) caught two things prose alone would miss: the per-turn hook already carries a constitutional reminder (the ride-along is proven, not hypothetical), and a dead `skill-advisor-hook.md` pointer in AGENTS.md (iteration 3).

---

## 8. WHAT FAILED
- Nothing material in iteration 1.

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS
- Re-recommending round-1's shipped set (Operating Discipline subsection, 2 constitutional rules, the fold, the sk-code line): out of scope per 002 spec (iter 1, evidence: 149/001-initial-refinement/implementation-summary.md:56-81).
- Importing Fable's em-dash habit or its monotonic decision-log bloat: these are Fable's own failure modes (costs), not techniques to adopt (iter 1, evidence: fable-mode-profile.md:491-507).
- Verbatim copy of `governor-block.md` into our CLAUDE.md: byte-synced twin set already at ~500-line budget post round-1; verbatim paste bloats it (iter 2, evidence: governor-block.md:1-13; 149/001 changelog.md:22).
- Porting `leak_test.py` as-is: targets `claude-*` model ids + `~/.claude/projects` layout; multi-runtime port needs runtime-aware bucketing (iter 2, evidence: leak_test.py:38-44).
- AGENTS.md/CLAUDE.md as the *sole* home for a persistent governor: the setpoint decays (G2); a doc-only governor repeats round-1's advisory-only weakness — must pair with the thermostat (iter 3, evidence: opus README.md:69-77).
- Hand-editing the 3 agent mirrors as a first move without a sync mechanism: 3-runtime-mirror drift risk (iter 3, evidence: 149/001 impl-summary.md:101).
- Adopting F14 (ration live actions / harnesses-over-production / cleanup-as-privacy) as a rec: low relevance, no shared production box, partially covered by name-the-rollback (iter 4).
- A standalone F12 rec (suspect-yourself-first / reproduce-before-fix): already covered by round-1's finding-is-a-hypothesis + Fable5.md reproduce-before-cause; folded as reinforcement only (iter 4).
- G7/G8 as standalone recs: folded into rec #3's governor as guardrails (iter 4).

---

## 11. NEXT FOCUS
LOOP COMPLETE (5/5 iterations, 5/5 questions answered, newInfoRatio 0.95→0.15 monotone descent, stopReason=maxIterationsReached, legal-stop gates pass). SYNTHESIS done → `research.md` written for the opus-account2 lineage. Handoff: the parent orchestrator merges this lineage with codex-xhigh (see the 4 merge questions in iteration-005.md) and produces the packet `recommendations.md`.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**Dedup baseline — round-1 (`149/001-initial-refinement`) shipped set (DO NOT re-recommend):**
1. AGENTS.md/CLAUDE.md §1 "Operating Discipline — Claim Legibility & Blast-Radius" subsection (9 bullets); Barter read-only-git variant.
2. Two constitutional rules: `regression-baseline-and-delta.md`, `finding-is-a-hypothesis.md` (Public + Barter + .claude mirror).
3. `main-branch-direct-push.md` 5th "How to apply" bullet (non-git outward/irreversible actions).
4. `sk-code/SKILL.md` "Baseline & blast-radius" line after the Iron Law.
5. (Barter) removed contradictory main-branch-direct-push.md copy.

**Round-1 doctrine baseline (`external/Fable5.md`):** verify-before-claim, confirmed-vs-inferred legibility, baseline-before-no-regressions + delta, finding-is-a-hypothesis, run-the-real-thing, stay-in-scope, name-the-rollback before irreversible/outward, restore-known-good-on-regress, match-effort-to-blast-radius, name-what-speaks-the-old-contract, lead-with-recommendation-at-a-fork, ground-in-project-data, change-one-axis-per-round, narrate-cadence-close-with-state, the "Before you send" re-read checklist.

**Carried round-1 follow-ups to re-assess (Q5):**
- Machine-checkable shared evidence contract (claim_class / evidence / would_confirm / baseline / gate_delta / scope_state / child_result_verified) wired into post-dispatch-validate.
- codex SIGKILL on 2nd+ dispatch + silent native gpt-5 fallback in executor-audit → make it fail loud.

**New mechanism-rich sources (the EXTRACT inputs):**
- `external/fable-mode-main/`: fable-mode-profile.md (62KB forensic behavioral profile), fable-mode.md (/fable-mode command), README.md.
- `external/opus-fable-mode-main/`: fable-mode.md, governor-block.md (CLAUDE.md governor), reinject.sh (UserPromptSubmit reinject hook), leak_test.py (measurement harness), README.md, install/settings-hook-snippet.json, LICENSE.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage's research.md)
- Lineage: new, generation 1, sessionId fanout-opus-account2-1781514394068-103t44
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Started: 2026-06-15T09:08:30Z
