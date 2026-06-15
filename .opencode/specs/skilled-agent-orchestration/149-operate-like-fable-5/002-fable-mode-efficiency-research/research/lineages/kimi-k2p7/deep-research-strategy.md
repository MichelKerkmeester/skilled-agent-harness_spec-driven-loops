---
title: Deep Research Strategy - Fable-5 Efficiency Surface Map (kimi-k2p7 lineage)
description: Strategy and session tracking for the kimi-k2p7 fan-out lineage researching fable-mode and opus-fable-mode adjustable Public-repo surfaces.
trigger_phrases:
  - "fable-5 efficiency research"
  - "kimi-k2p7 lineage"
  - "fable mode surface map"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Fable-5 Efficiency Surface Map

Lineage: `kimi-k2p7` | Session: `fanout-kimi-k2p7-1781518620710-yepc7q`

## 1. OVERVIEW

### Purpose

Produce a ranked, tiered, sign-off-ready map of surface×delta recommendations that move any AI working in this repo toward fable-5 efficiency. The research is read-only this round: extract mechanisms, map adjustable Public-repo surfaces by runtime read-reliability, and score recommendations by leverage / (cost + blast-radius), all deduped against round 1's shipped set.

---

## 2. TOPIC

Fable-5 efficiency — map every adjustable Public-repo surface and optimization from `external/fable-mode-main/` and `external/opus-fable-mode-main/`, deduped against round 1 (`001-initial-refinement`).

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q5: What are the risks, dependencies, and open questions for the top recommendations?

---

## 4. NON-GOALS

- No implementation this round; recommendations only.
- No re-recommendation of round 1's shipped set (Operating Discipline subsection, `regression-baseline-and-delta.md`, `finding-is-a-hypothesis.md`, `main-branch-direct-push.md` 5th bullet, `sk-code/SKILL.md` baseline line).
- No edits to framework surfaces.
- No production testing or live dispatch.

---

## 5. STOP CONDITIONS

- Average newInfoRatio across the last 3 iterations falls below 0.05.
- All 5 key questions answered with cited evidence.
- Max 5 iterations reached.
- Two consecutive iterations find no net-new mechanisms or surfaces.

---

## 6. ANSWERED QUESTIONS

- [x] Q1: What net-new fable-5 techniques/rituals/mechanisms/measurements exist in fable-mode-main and opus-fable-mode-main vs Fable5.md and round 1? (both source sets answered; 22 net-new findings, 2 partial overlaps)
- [x] Q2: What adjustable Public-repo surfaces exist and what is their read-reliability per runtime? (8 surfaces mapped with read-reliability matrix)
- [x] Q3: Which surface×delta recommendations are highest leverage/lowest blast-radius, tiered A/B/C, deduped vs round 1? (14 recommendations ranked/tiered/deduped)
- [x] Q4: What concrete measurement surface can host a leak_test-style behavioral metric? (`/doctor fable-leak` or `deep:model-benchmark`; transcript-derived metrics)

---

<!-- MACHINE-OWNED: START -->

## 7. WHAT WORKED

- Direct source-to-round-1 diff tagging worked: every finding from `fable-mode-profile.md` was checked against `Fable5.md` and `001-initial-refinement/implementation-summary.md`, giving a clean dedup column.
- Categorizing each finding as doctrine/ritual/mechanism/measurement/model-specific made tiering signals obvious: most are Tier B mechanisms; voice/lexicon are Tier A doctrine; measurement/execution mechanics are Tier C.
- opus-fable-mode-main's `governor-block.md` is a ready-to-embed surface; `leak_test.py` is a ready-to-port harness.
- Surface mapping by runtime read-reliability revealed that the `UserPromptSubmit` hook is the highest-leverage, lowest-blast mechanism surface because it is prompt-time, fail-open, and already wired across Claude/Codex/OpenCode.
- Score formula `Leverage*2 - Blast - Cost` produced a clean separation: B1/B2 at the top, B5/B4/B10 at the bottom.

---

## 8. WHAT FAILED

- Attempting to extract from `fable-mode-main/README.md` yielded only install instructions; not a useful source of doctrine.
- Attempting to extract from `opus-fable-mode-main/reinject.sh` yielded only a deployment helper; not a research mechanism.

---

## 9. EXHAUSTED APPROACHES (do not retry)

- Do not re-read `fable-mode-main/README.md` for mechanisms.
- Do not re-read `opus-fable-mode-main/reinstall.sh` or `README.md` for mechanisms.

---

## 10. RULED OUT DIRECTIONS

- `fable-mode-main/README.md` is install-only; no doctrine to extract (iteration 1).
- `fable-mode.md` command overlay is self-contained; no hidden mechanisms beyond the profile (iteration 1).
- `opus-fable-mode-main/reinject.sh` is a deployment helper, not a mechanism (iteration 2).
- `opus-fable-mode-main/README.md` is install-only (iteration 2).
- `opus-fable-mode-main/LICENSE` is not relevant to research (iteration 2).
- `.opencode/commands/create/*.md` are scaffolding templates; not suitable for behavioral governor injection (iteration 3).
- `Barter/ai-speckit/coder/AGENTS.md` git-posture contradiction is pre-existing and needs owner resolution before any fable-5 delta there (iteration 3).
- Direct AGENTS.md expansion for Tier A is ruled out by the ~500-line budget (iteration 4).
- Non-Opus model governors are out of scope for this round (iteration 4).

---

## 11. NEXT FOCUS

Iteration 5: Final gap check and risk/dependency table for the top recommendations. Verify convergence quality guards (source diversity, focus alignment, no single-weak-source) and answer Q5.

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Round 1 shipped set (do NOT re-recommend)

Round 1 (`001-initial-refinement`) distributed the distilled `Fable5.md` doctrine surgically:

- `AGENTS.md` / `CLAUDE.md` §1 gained an `Operating Discipline — Claim Legibility & Blast-Radius` subsection (9 bullets): confirmed-vs-inferred claims, baseline before "no regressions" + report delta, finding-as-hypothesis until cited code is opened, scope lock, rollback before irreversible/outward actions, match effort to blast radius, name what still speaks the old contract.
- Two new constitutional rules: `regression-baseline-and-delta.md` and `finding-is-a-hypothesis.md`.
- `main-branch-direct-push.md` gained a 5th "How to apply" bullet for non-git outward/irreversible actions (deploy, send, migrate, overwrite shared state): name rollback, stop for yes.
- `sk-code/SKILL.md` gained a "Baseline & blast-radius" line after the Iron Law.
- Explicitly dropped: sk-git embedding (already covered), orchestrate.md §5 hard-checklist (superseded by constitutional rule), machine-checkable shared evidence contract (deferred follow-up).

### New sources for round 2

1. **`external/Fable5.md`** — distilled doctrine (already partially shipped): verify before claim, claim legibility, baseline+delta, finding-as-hypothesis, scope, rollback, match effort.

2. **`external/fable-mode-main/`** — a behavioral profile + command overlay:
   - `fable-mode-profile.md`: forensic profile of Claude Fable 5 (62KB). Core conviction: expensive failures live where confirmation is cheapest to skip. Behaviors: recon before design, plan the turn, test-first with mutation check, verification ladder (unit → in-memory → on-server → live → headless), distrust own prior output, worst-first triage by downstream consequence, scope-frugal/process-expensive, fail-closed construction, scar-tissue curation, cold-successor handoff, turn rotting lists into self-auditing tests, reuse maps, single-event blast-radius lists, two-register voice (clipped colon-terminated while working; dense at turn boundaries), lexicon (pin, verify, trap, drift, deliberate, load-bearing, seam, byte-identical, fixpoint).
   - `fable-mode.md`: command overlay that activates the persona temporarily. Guardrails: user's own instructions win; do not let process dwarf a small task.

3. **`external/opus-fable-mode-main/`** — a governor for Opus 4.8 + measurement harness:
   - `fable-mode.md`: "Reason about the problem and the person. Never about yourself." Recursion control: start claims later, stop earlier, one audit then done (depth limit 1), hand back genuine uncertainty. Output shape: minimum honest qualifier, commit decisions with `// DECISION:`, outcome over visible process. Orientation: look outward, lumpy bit not armor bit, reject wrong framings. Execution mechanics: batch tool calls (~4 actions per prose block), median ~18 words/msg, result-first openings.
   - `governor-block.md`: shorter form of the same governor for permanent CLAUDE.md embedding.
   - `leak_test.py`: measurement harness for Claude Code transcripts. Metrics: median words/message, tool:text ratio, unsolicited-caveat %, "I'll/Let me" opener %. Compares `opus_pre`, `opus_post`, `fable` buckets.

### Coverage note

`resource-map.md` not present at init; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-06-15T12:17:00Z
