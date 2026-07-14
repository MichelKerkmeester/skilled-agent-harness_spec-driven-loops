---
title: Deep Research Strategy - opus-account2-r4 lineage (Fable-5 efficiency, round 2)
description: Persistent research brain for the opus-account2-r4 fan-out lineage. Tracks focus, what worked/failed, ruled-out directions, and next focus across iterations.
trigger_phrases:
  - "fable-5 efficiency research"
  - "opus-account2-r4 lineage"
  - "fable mode surface map"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — opus-account2-r4 lineage

Runtime strategy for the `opus-account2-r4` fan-out lineage (executor: cli-claude-code model=claude-opus-4-8, account2). Independent full loop; merged later with the sibling lineages (codex-xhigh, deepseek-v4-pro, kimi-k2p7, mimo-v25-pro, and the prior opus-account2).

---

## 2. TOPIC

Extract every net-new fable-5 technique/mechanism in `external/fable-mode-main/` (62KB forensic behavioral profile + `/fable-mode` command) and `external/opus-fable-mode-main/` (CLAUDE.md governor block + `UserPromptSubmit` reinject hook + `leak_test.py` measurement harness + Opus recursion-control), deduped against `external/Fable5.md` and round-1's shipped set. Map every adjustable Public-repo surface by read-reliability per runtime (OpenCode / Claude / Codex). Produce a ranked, tiered (A doctrine / B mechanism / C measurement) surface×delta recommendation set scored by behavioral-leverage / (cost + blast-radius). Research-only — recommend, do not edit framework surfaces.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1 (EXTRACT-1): What net-new fable-5 techniques live in `fable-mode-main/` (forensic profile + command) vs Fable5.md and round-1's shipped doctrine? Tag each doctrine|ritual|mechanism|measurement|model-specific. — ANSWERED iter 1 (15 net-new: F1–F15).
- [x] Q2 (EXTRACT-2): What net-new mechanisms/measurement/model-specific logic live in `opus-fable-mode-main/` (governor, reinject hook, leak_test, recursion-control)? — ANSWERED iter 2 (9 net-new: G1–G9).
- [x] Q3 (SURFACE MAP): What are the adjustable Public-repo surfaces and their read-reliability per runtime? — ANSWERED iter 3 (read-reliability matrix; per-turn hook = firing thermostat proven on THIS session; 424-line AGENTS≡CLAUDE; 16 constitutional rules; 12 agents × 3 mirrors; underscore/hyphen dead-pointer drift).
- [x] Q4 (OPTIMIZE): What is the ranked surface×delta set, tiered A/B/C, scored by leverage/(cost+blast), deduped vs round 1? — ANSWERED iter 4 (12 ranked recs; top cluster = governor-on-hook / mutation-check / recursion-control).
- [x] Q5 (FOLLOW-UPS + GAPS): Re-assess the carried round-1 follow-ups; document gaps/open questions. — ANSWERED iter 5 (both follow-ups confirmed still-open by grep-absence; rec #12 fail-loud; gap list + 5 merge questions).

---

## 4. NON-GOALS
- Implementing any recommendation (deferred to a gated, owner-approved follow-up).
- Re-recommending round-1's shipped set (AGENTS.md Operating Discipline subsection; the 2 constitutional rules regression-baseline-and-delta.md + finding-is-a-hypothesis.md; the main-branch-direct-push.md fold; the sk-code Baseline & blast-radius line).
- Cross-lineage merge/synthesis (the parent orchestrator merges the lineages and writes the packet `recommendations.md`).
- Editing any framework surface this round.

---

## 5. STOP CONDITIONS
- All 5 key questions answered with evidence-backed findings, OR
- maxIterations (5) reached, OR
- newInfoRatio composite convergence with legal-stop gates passing (source diversity, focus alignment, key-question coverage).

---

## 6. ANSWERED QUESTIONS
- Q1 (EXTRACT-1) — iter 1. 15 net-new fable-5 techniques from fable-mode-main, deduped vs Fable5.md + round-1: F1 mutation-as-epistemology (claim-falsifier), F2 verification ladder with pre-named blind spots, F3 adversarial-review-at-scale + forced claim/verdict/evidence schema + completeness critic, F4 scar-tissue ledger (blast-site + next-bite-site + load-bearing-vs-defensive + activation), F5 cold-successor handoff protocol (carry only non-derivable; numbered Read-order; role-play-cold; ship next brief), F6 engineer-staleness-out (counts→greps, lists→table-walking tests), F7 fail-closed-by-construction, F8 decision economy (named seam not TODO; never a dead control; scaffold-the-contract-not-the-implementation), F9 brief-sovereign letter-vs-intent dialectic, F10 two-register voice + lexicon + averted-disaster framing, F11 multi-agent house rules (LEAF disjoint-scope; git/.md ban; typed status enum; two-stage spec-then-quality review; verify-personally backstop; orchestrator-commits), F12 reproduce-before-fix + second-break-behind-first + suspect-yourself-first + throwaway instruments, F13 measurement integrity (untrustworthy number is a bug even green), F14 ration-live-actions/harnesses-over-production/cleanup-as-privacy, F15 worst-first triage by downstream-consequence-to-a-cold-reader. Root conviction + the command's own blast-radius guardrail captured.
- Q2 (EXTRACT-2) — iter 2. 9 net-new from opus-fable-mode-main: G1 Opus recursion-control governor (8 rules; reason-about-problem-and-person-not-yourself; audit depth-limit 1; commit-with-`// DECISION:`; minimum-honest-qualifier; outcome-over-visible-process), G2 three-layer persistence (setpoint CLAUDE.md → thermostat UserPromptSubmit reinject → measurement leak_test; hook is subagent-BLIND — inject into agent briefs separately), G3 leak_test harness (median words/msg, tool:text ratio, caveat%, self-opener% bucketed by model id from JSONL; verdict = moved-toward AND closed-distance; INSUFFICIENT < 30 prose msgs), G4 prompt-vs-weights honesty (governor steers expression not weights; no capability gain; capability lever = task-structure (closed prompts) + multi-LLM orchestration), G5 quantified Fable signature (median words 47→18, mean EQUAL so it's distribution-not-less, tool:text 1.41→3.91 = the token burn, result-first openers; cleanest tells = tool:text + opener), G6 extended-thinking caption test (captions about the problem healthy vs about yourself = burning budget on self-surveillance; name a self-directed thought in ≤3 words and return), G7 reject-wrong-framings + outward-turn + lumpy-bit-not-armor-bit, G8 beautiful-dead-end guardrail + don't-overcorrect-into-curtness (govern the governor), G9 anti-recursion self-check (one pass not a loop) + toggle FABLE_MODE_OFF + new-session activation.
- Q3 (SURFACE MAP) — iter 3. Read-reliability matrix across OpenCode/Claude/Codex. Repo-verified: AGENTS.md ≡ CLAUDE.md at 424 lines (byte-identical, diff -q clean), ~76-line headroom under ~500 soft budget; 16 constitutional rules + README; the live Claude `UserPromptSubmit` hook (`.claude/settings.json:14-20` → `dist/hooks/claude/user-prompt-submit.js`, a thin shim delegating to system-skill-advisor's hook) ALREADY re-injects a per-turn reminder carrying the comment-hygiene HARD-BLOCK constitutional line + the advisor brief — PROVEN by this very session's injected context (the thermostat fired on me); 12 agents across 3 byte-or-near-mirrored runtime dirs (.opencode/.claude/.codex); executor-config.ts / prompt-pack.ts (renderPromptPack) / post-dispatch-validate.* confirmed in deep-loop-runtime/lib/deep-loop. Sharper staleness finding than a plain dead-pointer: AGENTS.md:217 cites `references/hooks/skill-advisor-hook.md` (HYPHENS) but the real files are `skill_advisor_hook.md` + `skill_advisor_hook_validation.md` (UNDERSCORES) — a naming-convention drift, the doc exists under a different name.
- Q4 (OPTIMIZE) — iter 4. 12 ranked surface×delta recs, tiered A/B/C, scored leverage/(cost+blast), all deduped vs round 1. Top cluster: #1 ride the live per-turn hook with a compact fable-5 governor [B], #2 mutation-check/claim-falsifier into sk-code [B], #3 recursion-control rule + xhigh briefs [B]. Efficiency core = #1 + #3 (style/persistence levers; capability lever stays task-structure + orchestration per G4).
- Q5 (FOLLOW-UPS + GAPS) — iter 5. Both carried round-1 follow-ups confirmed STILL OPEN by grep-absence: (A) machine-checkable evidence contract — zero hits for its named fields (claim_class/would_confirm/gate_delta/scope_state/child_result_verified) across deep-loop-runtime + system-spec-kit/references (= rec #10); (B) codex SIGKILL / silent gpt-5 fallback — executor-audit.ts records the actual model (kind/model/reasoningEffort/serviceTier) and itself escalates SIGTERM→SIGKILL on timeout, but performs NO requested-vs-actual model comparison and NO fail-loud → the attachment point exists, the gate doesn't (= new rec #12, Tier B). Gaps + 5 merge questions logged.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Pairing the `/fable-mode` command (distilled actionable layer) with the 62KB profile (evidence layer) — gives technique + provenance quote together (iteration 1).
- Pre-loading the round-1 dedup baseline (Fable5.md + impl-summary + changelog) before extraction kept findings filtered to net-new (iteration 1).
- Reading governor + long-form directive (opus fable-mode.md) + reinject.sh header + leak_test.py + README *together* exposed the setpoint/thermostat/measurement triad as one designed system; the reinject.sh header comment (lines 8-9) is where the subagent-blindness constraint is stated explicitly (iteration 2).
- Verifying surfaces against the real repo caught two things prose alone would miss: the per-turn hook is firing on THIS session (the thermostat is proven, not hypothetical — its reminder appears in my own injected context), and the dead-pointer is a hyphen/underscore naming drift (the doc exists), a sharper finding than "missing file" (iteration 3).
- Grep-absence as a positive signal for the carried follow-ups: zero hits for the evidence-contract field names = the contract is genuinely unbuilt; the SIGKILL hits in executor-audit.ts are the runtime's OWN kill mechanism, not a model-mismatch guard (iteration 5).

---

## 8. WHAT FAILED
- Nothing material. (Iteration 3's first surface-verification bash batch was rejected by the shell-safety guard for compound piping; re-running as simpler single-purpose commands worked — a tooling friction, not a research failure.)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS
- Re-recommending round-1's shipped set (Operating Discipline subsection, 2 constitutional rules, the fold, the sk-code line): out of scope per 002 spec (iter 1, evidence: 149/001-initial-refinement/changelog.md:22-26).
- Importing Fable's em-dash habit or its monotonic decision-log bloat: these are Fable's own failure modes (costs), not techniques to adopt (iter 1, evidence: fable-mode-profile.md:491-507).
- Verbatim copy of `governor-block.md` into our CLAUDE.md: byte-synced twin set at 424 lines with only ~76 headroom; verbatim paste of a 13-line block into the most-read surface burns the budget round-1 already loaded (iter 2, evidence: governor-block.md:1-13; wc -l AGENTS.md=424).
- Porting `leak_test.py` as-is: targets `claude-*`/`claude-fable-5` model ids + `~/.claude/projects` JSONL layout; multi-runtime port needs runtime-aware bucketing + per-runtime log locations (iter 2, evidence: leak_test.py:34,38-44,56-58).
- AGENTS.md/CLAUDE.md as the *sole* home for a persistent governor: the setpoint decays (G2/README.md:72-77); a doc-only governor repeats round-1's advisory-only weakness — must pair with the thermostat (iter 3).
- Hand-editing the 3 agent mirrors as a first move without a sync mechanism: 3-runtime-mirror drift risk; the repo already runs an agent-mirror-sync workflow, so any agent-prompt rec must route through it (iter 3, evidence: .github/workflows/agent-mirror-sync.yml present in git status).
- Adopting F14 (ration live actions / harnesses-over-production / cleanup-as-privacy) as a rec: low relevance, no shared production box, partially covered by name-the-rollback (iter 4).
- A standalone F12 rec (suspect-yourself-first / reproduce-before-fix): already covered by round-1's finding-is-a-hypothesis + Fable5.md reproduce-before-cause; folded as reinforcement only (iter 4).
- G7/G8 as standalone recs: folded into rec #3's governor as guardrails (iter 4).

---

## 11. NEXT FOCUS
LOOP COMPLETE (5/5 iterations, 5/5 questions answered, newInfoRatio 0.95→0.78→0.58→0.22→0.14 monotone descent, stopReason=maxIterationsReached, legal-stop gates pass). SYNTHESIS done → `research.md` written for the opus-account2-r4 lineage. Handoff: the parent orchestrator merges this lineage with its siblings (see the 5 merge questions in iteration-005.md and the registry) and produces the packet `recommendations.md`.

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
- `external/fable-mode-main/`: fable-mode-profile.md (62KB / 531-line forensic behavioral profile), fable-mode.md (/fable-mode command, 35 lines), README.md.
- `external/opus-fable-mode-main/`: fable-mode.md (136-line long-form directive), governor-block.md (13-line CLAUDE.md governor), reinject.sh (UserPromptSubmit reinject hook), leak_test.py (162-line measurement harness), README.md, install/settings-hook-snippet.json, LICENSE.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage's research.md)
- Lineage: new, generation 1, sessionId fanout-opus-account2-r4-1781525949822-w9b8qe
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Started: 2026-06-15T14:20:00Z
