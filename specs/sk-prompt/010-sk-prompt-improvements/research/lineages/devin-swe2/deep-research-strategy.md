# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Lineage `devin-swe2` of the fan-out research run for `specs/sk-prompt/010-sk-prompt-improvements`. Executor: cli-devin / swe-2-max. Session: `fanout-devin-swe2-1793339054661-ddx0ri`.

## 2. TOPIC

How should sk-prompt (.skilled/skills/sk-prompt) be rebuilt without the DEPTH thinking framework? Validate, refute or extend the ranked recommendations REQ-002 to REQ-011 in specs/sk-prompt/010-sk-prompt-improvements/spec.md and the source ledger scratch/prompt-improver-survey.md: what exactly replaces DEPTH (one-pass checklist contents), whether the seven named frameworks should collapse into one component skeleton, how quality should be judged (CLEAR self-score vs test inputs), deliver-first vs ask-first, model profiles, and what the callers .skilled/agents/prompt-improver.md and .skilled/commands/prompt/ need. Compare against the AI Systems Prompt Improver (../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver) and public prompt improvers. Read-only research: write only inside the research lineage directory.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What exactly replaces DEPTH: what are the contents of the one-pass checklist (which components, yes/no+reason marking, the self-check step), and does REQ-002's ~10-component list match what surveyed improvers and sk-prompt's own references actually check?
- [x] Should the seven named frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) collapse into one component skeleton, and should the names survive as user-facing aliases or be removed outright (REQ-008 + spec Open Question 1)?
- [x] How should quality be judged: CLEAR self-score vs test inputs first — what does REQ-007's "quick test" concretely look like, and does CLEAR survive as a short screen?
- [x] Deliver-first vs ask-first plus the early exit for already-good prompts: what are the exact interaction rules, and do they hold for both interactive and agent (non-interactive) runs (REQ-003, REQ-004)?
- [x] What do the callers need — .skilled/agents/prompt-improver.md structured output block + model eligibility, and .skilled/commands/prompt/ modes — for the rebuild to stay compatible, and do per-model output profiles (REQ-010) and the change report/length cap (REQ-011) fit that contract?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any recommendation (research only; the operator decides the build).
- Modifying sk-prompt, its callers, or any file outside the lineage directory.
- The vendored AI Systems copy of sk-prompt (sync owned by that repo).
- Prompt Improver's creative modes ($vibe, $image, $video) — no requirement asks sk-prompt to grow into them.
- spec.md mutations (bounded spec write-back is out of this lineage's write scope; recorded as a skipped step instead).

## 5. STOP CONDITIONS

- config.stopPolicy = max-iterations: run all 3 iterations; convergence signals are telemetry only.
- All key questions answered with cited evidence before iteration 3 → still complete the remaining iterations by broadening review angles.
- A required write escaping the lineage directory → record the conflict in the iteration, do not execute the write.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What exactly replaces DEPTH: what are the contents of the one-pass checklist (which components, yes/no+reason marking, the self-check step), and does REQ-002's ~10-component list match what surveyed improvers and sk-prompt's own references actually check?
- Should the seven named frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) collapse into one component skeleton, and should the names survive as user-facing aliases or be removed outright (REQ-008 + spec Open Question 1)?
- How should quality be judged: CLEAR self-score vs test inputs first — what does REQ-007's "quick test" concretely look like, and does CLEAR survive as a short screen?
- Deliver-first vs ask-first plus the early exit for already-good prompts: what are the exact interaction rules, and do they hold for both interactive and agent (non-interactive) runs (REQ-003, REQ-004)?
- What do the callers need — .skilled/agents/prompt-improver.md structured output block + model eligibility, and .skilled/commands/prompt/ modes — for the rebuild to stay compatible, and do per-model output profiles (REQ-010) and the change report/length cap (REQ-011) fit that contract?

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
### `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler).

### A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule.

### Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo.

### Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3).

### Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design.

### melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget).

### None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed).

### Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7]

### Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed.

### Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1).

### Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming `.claude/commands` or other mirrors carry the pipeline: the command's DEPTH lives in `.skilled/commands/prompt/assets/*.yaml`, canonical in-repo. (iteration 1)
- None definitive yet; playbook file-count basis was ambiguous until measured three ways (17 files bare `DEPTH`, 24 `depth-framework`, 25 either token — spec's 25 confirmed). (iteration 1)
- Treating `framework-registry.json` as the framework *selection* surface REQ-008 implies: it is benchmark scaffold data; the selection surface is SKILL.md §3's matrix + patterns-evaluation §2. [evidence: finding 7] (iteration 1)
- `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler). (iteration 2)
- Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3). (iteration 2)
- Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1). (iteration 2)
- A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule. (iteration 3)
- Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design. (iteration 3)
- melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget). (iteration 3)
- Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed. (iteration 3)
- Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence. (iteration 3)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Bounded snapshot (pointer-based):

- Spec packet: `specs/sk-prompt/010-sk-prompt-improvements/spec.md` — REQ-001..REQ-011 ranked recommendations; REQ-002/003 P0. Source ledger: `specs/sk-prompt/010-sk-prompt-improvements/scratch/prompt-improver-survey.md` (delegate survey; 3 quotes CONFIRMED, rest delegate readings; UNVERIFIED items carry no requirement).
- Research target: `.skilled/skills/sk-prompt/` — SKILL.md (322 lines; DEPTH pipeline §3, rules §4, agent contract §7), ROUTER.md, references/depth-framework.md, references/patterns-evaluation.md, assets/cli-prompt-quality-card.md, assets/framework-registry.json (named in REQ-008), benchmark/, manual-testing-playbook/ (25 files naming DEPTH).
- Callers: `.skilled/agents/prompt-improver.md` (structured output block FRAMEWORK/CLEAR_SCORE/RATIONALE/ENHANCED_PROMPT/ESCALATION_NOTES; model-eligibility matrix), `.skilled/commands/prompt/` (4 files incl. improve.md naming DEPTH 3×).
- Sibling: `../AI Systems/AI Systems/Prompt Improver/sk-prompt-improver` (v1.0.1.0, kernel v1.0.1) — deliver-first, strip_source_prompt(), benchmark/router/run_fixtures.sh PASSED 32/32, creative modes out of scope.
- resource-map.md not present at spec folder; skipping coverage gate.
- Prior related packets: `specs/sk-prompt/z_archive/004-sk-prompt-small-model-optimization/`, `specs/sk-prompt/z_archive/005-sk-prompt-knowledge-layering/` (archived; background only).

## 13. RESEARCH BOUNDARIES
- Max iterations: 3 (minIterations 3; stopPolicy max-iterations)
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Per-iteration budget: 24 tool calls max, 10 minutes
- Progressive synthesis: true — research.md updated per iteration inside the lineage dir
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `<lineage>/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-30T05:47:18Z
