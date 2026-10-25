---
title: Deep Research Strategy - sk-code-quality mode research
description: Session tracking for the ten-iteration deep-research run on making sk-code-quality more repo-agnostic, more useful and better integrated with sibling and user-authored modes.
trigger_phrases:
  - "sk-code-quality research strategy"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this research session. Records what to investigate, what worked, what failed and where to focus next.

### Usage

- **Init:** written by the workflow from the strategy template, config and the packet plan.
- **Per iteration:** the iteration reads Next Focus and writes evidence; the reducer refreshes the machine-owned sections.
- **Protection:** analyst-owned sections stay stable; machine-owned sections are reducer-owned.

### Question Injection Surface

External questions go to `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/inbox.jsonl`, one JSON object per line.

---

## 2. TOPIC
How to make sk-code-quality more repo-agnostic, more useful and better integrated with sibling and user-authored modes

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which repo-bound assumptions does sk-code-quality hold, and how should each be removed, made configurable or isolated so the mode works in a repository without this framework's layout?
- [x] What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts?
- [x] How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?
- [x] How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?
- [x] Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any file under `.skilled/`. Recommendations are ranked, not applied.
- sk-code-review as a subject. It is read only to describe the boundary with quality. The sibling phase `002-review-mode-research` owns it, and its `research/` folder is not read.
- Relaxing the P0 floor, the missing Write and Task authority, or the advisory-only status of the CODE_QUALITY_RESULT envelope.
- Implementing a recommendation, adding tests or running a benchmark.
- Fetching anything from the network. Outside knowledge is labelled INFERRED.

---

## 5. STOP CONDITIONS
- Exactly ten iterations, one plan angle each (stop policy `max-iterations`; convergence is telemetry only before iteration ten).
- Stop early only on an infrastructure halt (three consecutive dispatch failures, lost lock, or a gateway refusal), recorded with its evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which repo-bound assumptions does sk-code-quality hold, and how should each be removed, made configurable or isolated so the mode works in a repository without this framework's layout?
- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts?
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Re-deriving the rankings from scratch.** Ruled out: this iteration's mandate is claim verification, and a fresh ranking would duplicate the first pass without adding an independent check. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Re-deriving the rankings from scratch.** Ruled out: this iteration's mandate is claim verification, and a fresh ranking would duplicate the first pass without adding an independent check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the rankings from scratch.** Ruled out: this iteration's mandate is claim verification, and a fresh ranking would duplicate the first pass without adding an independent check.

### **Treating the absence of a generator reference as proof the map is hand-kept.** Ruled out as proof; recorded as DERIVED instead, because a generator could live outside the read range. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Treating the absence of a generator reference as proof the map is hand-kept.** Ruled out as proof; recorded as DERIVED instead, because a generator could live outside the read range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the absence of a generator reference as proof the map is hand-kept.** Ruled out as proof; recorded as DERIVED instead, because a generator could live outside the read range.

### No implementation or checklist authoring was attempted because this is a research iteration. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No implementation or checklist authoring was attempted because this is a research iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation or checklist authoring was attempted because this is a research iteration.

### No implementation or quality-checklist authoring was attempted because this is a research iteration. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No implementation or quality-checklist authoring was attempted because this is a research iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation or quality-checklist authoring was attempted because this is a research iteration.

### No network research was attempted because the strategy lists network fetching as a non-goal. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No network research was attempted because the strategy lists network fetching as a non-goal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No network research was attempted because the strategy lists network fetching as a non-goal.

### No network research was attempted because the strategy's non-goals prohibit it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No network research was attempted because the strategy's non-goals prohibit it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No network research was attempted because the strategy's non-goals prohibit it.

### Re-deriving the rankings from scratch — out of scope, and already recorded as blocked in iteration 11. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Re-deriving the rankings from scratch — out of scope, and already recorded as blocked in iteration 11.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-deriving the rankings from scratch — out of scope, and already recorded as blocked in iteration 11.

### Testing installation by file existence alone: the `core.hooksPath` result shows it is not sufficient. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Testing installation by file existence alone: the `core.hooksPath` result shows it is not sufficient.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Testing installation by file existence alone: the `core.hooksPath` result shows it is not sufficient.

### Treating the single `.github` hit as proof quality names no workflow target at all: the enforcement-gate row does name one file, so the claim was narrowed to "no `.github/` *checklist* target and no CI surface" rather than "no mention". -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating the single `.github` hit as proof quality names no workflow target at all: the enforcement-gate row does name one file, so the claim was narrowed to "no `.github/` *checklist* target and no CI surface" rather than "no mention".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the single `.github` hit as proof quality names no workflow target at all: the enforcement-gate row does name one file, so the claim was narrowed to "no `.github/` *checklist* target and no CI surface" rather than "no mention".

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No implementation or checklist authoring was attempted because this is a research iteration. (iteration 7)
- No network research was attempted because the strategy's non-goals prohibit it. (iteration 7)
- No implementation or quality-checklist authoring was attempted because this is a research iteration. (iteration 8)
- No network research was attempted because the strategy lists network fetching as a non-goal. (iteration 8)
- **Re-deriving the rankings from scratch.** Ruled out: this iteration's mandate is claim verification, and a fresh ranking would duplicate the first pass without adding an independent check. (iteration 11)
- **Treating the absence of a generator reference as proof the map is hand-kept.** Ruled out as proof; recorded as DERIVED instead, because a generator could live outside the read range. (iteration 11)
- Re-deriving the rankings from scratch — out of scope, and already recorded as blocked in iteration 11. (iteration 12)
- Testing installation by file existence alone: the `core.hooksPath` result shows it is not sufficient. (iteration 12)
- Treating the single `.github` hit as proof quality names no workflow target at all: the enforcement-gate row does name one file, so the claim was narrowed to "no `.github/` *checklist* target and no CI surface" rather than "no mention". (iteration 12)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? (iteration 1)
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? (iteration 1)
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? (iteration 1)
- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts? (iteration 1)
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] (iteration 2)
- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39] (iteration 2)
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40] (iteration 2)
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] (iteration 2)
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? The handoff portion is addressed here; the checklist boundary remains open. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40] `How should sk-code-quality hand off to verify, debug and sk-code-review` (iteration 5)
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality` (iteration 5)
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax` (iteration 5)
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `[ ] Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?` (iteration 9)
- Rank 4's envelope half — whether `checker_outputs` still admits `N/A` — was **NOT TESTED** this iteration; only the workflow sentence at `SKILL.md:135` was opened. (iteration 12)
- The checklist boundary between quality and review remains open, as recorded in iterations 5 and 11. (iteration 12)
- Which manifest name and merge rule should a repository without a surface packet use? The operator's decision, and rank 10 waits on it. (iteration 13)
- Where should the boundary between the quality and review checklists sit? Carried from iterations 5 and 11; untouched here. (iteration 13)
- Should the house-style P0 items stay P0 for this repository's own `.js` files? The operator's decision, and rank 1 waits on it. (iteration 13)
- Who consumes the `code-quality/v1` schema id outside this repository, and would a gitignored local skill that parses it be invisible to a token-literal search? (open question 5, narrowed here) (iteration 13)
- Who consumes the `code-quality/v1` schema id outside this repository? Narrowed in iteration 13; unchanged here. (iteration 14)
- What does the CI surface do once selected alone? Whether its packet carries procedural guidance that lets an agent fix a workflow, or only reference material, is unread. (new, from the rank 8 leg-B replay) (iteration 14)
- Does a stage-two intent match a `yagni` or `simplify` prompt, and which instrument can observe it? The keyword comparison says no; no runtime replay has shown it. (open question 4, stage-two half) (iteration 14)
- Which of `ROUTER.md`'s two CODE_QUALITY lists is authoritative — the prose row at line 54 or the keyword row at line 243? Rank 12's fix depends on the answer. (iteration 14)
- **Which of `ROUTER.md`'s two CODE_QUALITY lists is authoritative — the prose row or the keyword row?** Rank 12's fix depends on it, and iteration 14 showed the disagreement is inside one file as much as across two stages. (iteration 15)
- **Who consumes the `code-quality/v1` schema id outside this repository?** Unchanged since iteration 13. (iteration 15)
- **Where should the boundary between the quality and review checklists sit?** Open since iterations 5 and 11, untouched in 12, 13 and here. (iteration 15)
- **Does the CI packet carry procedural guidance, or only reference material?** Iteration 14 opened this; it now decides my rank 1. A packet that can only inform cannot act as the workflow primary a "fix this workflow" prompt needs. (iteration 15)
- **Does a stage-two intent match a `yagni` or `simplify` prompt, and which instrument observes it?** Stage one is confirmed by replay; stage two remains UNKNOWN at runtime. (iteration 15)
- **NEW — is the `.opencode/specs/` key duplicated anywhere beyond the two sites found here?** Two were found by reading the map and the tier table; a token search across the packet would settle whether a third exists. (iteration 15)
- **NEW — does any shared-doctrine instruction tell quality to run the dist checker with `--all`?** Rank 14 attributes `--all` to the session-start hook. I did not open that hook, so the attribution is **NOT TESTED**. (iteration 15)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Subject: `.skilled/skills/sk-code/sk-code-quality/` (`SKILL.md`, `scripts/`, `assets/code-quality-checklist/`, `benchmark/reports/`, `manual-testing-playbook/`, `changelog/`).
- Hub routing files: `.skilled/skills/sk-code/SKILL.md`, `mode-registry.json`, `ROUTER.md`, `hub-router.json`, `leaf-manifest.json`.
- Shared doctrine: `.skilled/skills/sk-code/shared/references/stack-detection.md`, `phase-detection.md`, `workflow-verify.md`.
- Siblings read for boundaries only: `sk-code-review/`, `sk-code-skilled/` (owns the surface checklists), `sk-code-ci/`.
- Extension path for user-authored modes: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` sections 6 and 7, and `.skilled/repo-rules/skill-hub-routing.md`.
- Private-mode precedent: `specs/sk-code/013-private-surface-skills/spec.md`.
- Fixed inputs (packet goal D3): the P0 floor, the missing Write and Task authority, and the advisory-only CODE_QUALITY_RESULT envelope. A recommendation that needs one changed says so.

### Frozen angle order (packet `plan.md` section 3, child goal D1)

| Iter | Angle |
|------|-------|
| 1 | Repo-bound inventory |
| 2 | The UNKNOWN-surface path |
| 3 | Checker portability |
| 4 | Usefulness evidence |
| 5 | Handoff to verify and debug |
| 6 | Quality and review boundary |
| 7 | Surface packets |
| 8 | User-authored modes |
| 9 | Repo-local configuration |
| 10 | Floors and proof |

### Executor schedule (parent decision D4)

Odd iterations: cli-codex, `gpt-6-luna`, reasoning `max`, service tier `fast`. Even iterations: cli-pi, `deepseek-v4.1-flash-1017` through llmgateway, thinking `max`. The DevPass route answered `402 daily pacing allowance` at the pre-run probe on 2026-10-25, so each even slot re-probes pi first and runs on cli-codex when the refusal persists, until three failures stop retrying pi.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 24 tool calls, 20 minutes wall clock (executor timeout 1200 seconds)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-10-25T08:48:55Z
