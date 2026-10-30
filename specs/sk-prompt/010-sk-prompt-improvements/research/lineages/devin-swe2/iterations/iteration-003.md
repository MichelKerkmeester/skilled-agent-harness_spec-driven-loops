# Iteration 3: Public-improver validation — do REQ-002..011 hold against the surveyed sources?

## Focus

Re-fetch the load-bearing public sources and judge each REQ: what replaces DEPTH (REQ-002), early exit (REQ-003), deliver-first (REQ-004), framework skeleton (REQ-008), craft checks (REQ-009), model profiles (REQ-010), growth cap + change report (REQ-011), and quality judging (REQ-007). steer.md checked before start: absent.

## Actions Taken

1. Fetched Anthropic prompting best practices — re-verified the survey's three CONFIRMED quotes in place plus per-model prompting pages.
2. Fetched OpenAI prompt-generation guide — extracted the production meta-prompt's full guideline and output skeleton.
3. Fetched Gemini prompting strategies — verified few-shot-always, delimiter consistency, constraints-first/question-last ordering.
4. Fetched christabone/claude-prompt-improvement README + CHECKLIST.md + SKILL.md — the closest public analog to REQ-002's design.
5. Fetched severity1/claude-code-prompt-improver README — the pass-through/ask-when-vague interaction model.

## Findings

1. **REQ-002 validated, with a sharper checklist than the REQ names.** Anthropic's live page still carries "Prefer general instructions over prescriptive steps" and "verify your answer against [test criteria]" — the one-pass check + self-check shape is the vendor-endorsed form. The closest public analog (christabone) runs exactly REQ-002's protocol: a fixed ~10-technique list, per-item present?/benefit?/how-to-apply verdicts with 1-2 sentence rationale in visible `<thinking>`, mixed script checks (XML tags, variables) and judgment checks, then the rewrite, then a summary. Its component set differs from REQ-002's — it has variables, chain-of-thought and task-decomposition but no success-criteria, contradiction or model-fit rows — so checklist membership is a design choice, the one-pass-verdict protocol is the invariant. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices (lines ~490,780,783); https://raw.githubusercontent.com/christabone/claude-prompt-improvement/main/skills/improve-prompt/CHECKLIST.md; .../SKILL.md]
2. **REQ-003 validated by two independent pass-through designs.** severity1's hook spends ~189 tokens evaluating every prompt and proceeds immediately on clear ones ("zero skill overhead"), asking 1-6 grounded questions only on vague ones; OpenAI's meta-prompt orders "Minimal Changes: improve it only if it's simple … without altering the original structure"; christabone bans "over-engineer prompts that are already effective" and per-technique "Skip if" rows. A prompt that already passes gets minimal edits — convergent. [SOURCE: https://raw.githubusercontent.com/severity1/claude-code-prompt-improver/main/README.md; https://developers.openai.com/api/docs/guides/prompt-generation]
3. **REQ-004 validated with one boundary caveat.** Vendor improvers ask nothing (OpenAI meta-prompt takes taskOrPrompt and emits; christabone edits in place); the sibling's deliver-first+open-items matches them. But severity1 shows a third defensible model — evaluate, pass on clear, ask grounded questions on vague — "only ask when genuinely unclear; never block." So "deliver first, ask only when nothing can be defaulted" is right for sk-prompt's stated goals, while an *ask-when-vague* mode is the honest alternative to name, not dismiss. [SOURCE: severity1 README design philosophy; OpenAI meta-prompt; iteration-2 findings]
4. **REQ-008 validated — and OpenAI's own meta-prompt IS the counter-example to framework sprawl.** Its output contract is one fixed skeleton (concise instruction → details → optional #Steps → #Output Format → #Examples → #Notes). No surveyed vendor names acronym frameworks; all describe components (role/context/task/examples/format/constraints). The seven sk-prompt frameworks collapse into one skeleton; keeping names as internal labels at most is consistent with agent-contract compatibility (FRAMEWORK field still emits a name). Caveat carried from iteration 1: `framework-registry.json` is benchmark scaffold, so the acceptance criterion should target SKILL.md §3 + patterns-evaluation.md §2, not that file. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-generation; iteration-1 finding 7]
5. **REQ-009 mostly validated; the "3 to 5 examples" count is too confident.** Anthropic says 3-5 varied examples in `<example>` tags; OpenAI's skeleton says 1-3 with placeholders; Gemini says always few-shot but "experiment with the number" and warns of overfitting. A range with a default (≥1, typical ~3, up to 5 for complex tasks) is more defensible than a fixed 3-5. The contradiction check is supported by Anthropic's correctness/zero-contradiction language and OpenAI's reasoning-order rules; the plain-language rule is verbatim Anthropic ("CRITICAL: You MUST…" → "Use this tool when…"). [SOURCE: Anthropic best practices lines ~490; OpenAI meta-prompt # Examples; Gemini prompting-strategies lines ~531-543]
6. **REQ-010 validated and strengthened.** Every current Claude model now has its own prompting page documenting measured differences (effort calibration, thinking-block handling, verification behavior, literal instruction-following); OpenAI ships model-specific meta-prompts per output type; Gemini's strategies doc prescribes ordering (context/system instructions first, question last) and delimiter discipline. Per-model profiles should be keyed to model *versions* (Opus 5 vs 5.5 diverge on self-check instructions), which the REQ's three-vendor split supports structurally. [SOURCE: Anthropic best-practices model-guidance table; Gemini prompting-strategies lines ~800-803; OpenAI guide]
7. **REQ-011 validated almost verbatim.** christabone: "aim for <3x original length" and "typically 150-300%"; its summary emits Added/Modified/Removed + Techniques-Applied + Techniques-Skipped + High/Medium/Low confidence — exactly the "added, changed, removed and skipped" report REQ-011 asks for. OpenAI: "Preserve User Content … entirely, or as closely as possible." [SOURCE: christabone SKILL.md success criteria + constraints + Step-4 format; OpenAI meta-prompt]
8. **REQ-007's direction validated; its strongest sources are the ones least re-verifiable.** The eval-first posture (test inputs before self-score) is consistent with everything verified (Anthropic self-check line, vendor eval tabs, optimizer guides) and the survey's CONFIRMED rows (OpenAI optimizer needing ≥3 graded rows; Evals API read-only 2026-10-31, shutdown 2026-11-30 — which means sk-prompt must not depend on it anyway). But skill-creator, promptfoo and DSPy claims remain the delegate's readings — flagged as partially verified, not refuted. CLEAR surviving as a short screen has sibling precedent (CLEAR 40/50 kept for text even as EVOKE/VISUAL were added). [SOURCE: scratch/prompt-improver-survey.md:22,25,27-29; sk-prompt-improver/SKILL.md:174-187]
9. **The surveyed tools converge on visible-reasoning transparency, not process metadata.** christabone exposes `<thinking>` verdicts; severity1 exposes injected context; the sibling exposes open items. sk-prompt's proof-through-output (Mode/Framework/Perspectives/CLEAR) is heavier than all of them — the rebuild's transparency report should carry the change list + open items + confidence, which is lighter and matches REQ-011. [INFERENCE: from findings 2,5,7 and iteration-1 finding 4]
10. **Ranking verdict: REQ ordering holds with two re-scopings.** P0 REQ-002/003 correct (blockers, convergent evidence). P1: REQ-004/005/006 strongly supported by sibling+public precedent; REQ-008 correct but re-aim its artifact criterion; REQ-009 correct with a softened example count; REQ-010 correct and upgraded by per-version model pages; REQ-011 correct verbatim; REQ-007 correct in direction — flag its eval dependency risk (OpenAI Evals is sunsetting) and its partially-verified sources. No REQ refuted. [INFERENCE: synthesis of findings 1-8]

## Ruled Out

- A fixed "3-5 examples" rule as universal: vendor ranges conflict (1-3 OpenAI, 3-5 Anthropic, experiment Gemini) — ruled out as written, replaced by a ranged rule.
- Treating ask-when-vague (severity1 model) as inferior without evidence: it is a legitimate third interaction model; REQ-004's deliver-first is still the better fit for sk-prompt's stated goals but the alternative is named, not dismissed.
- Depending on OpenAI Evals API for the REQ-007 quick test: read-only 2026-10-31, shutdown 2026-11-30 (survey CONFIRMED) — a local 2-3-input quick test is the durable design.

## Dead Ends

- melodic-software prompt-improvement: marked UNVERIFIED in the ledger, carries no requirement — not re-fetched (low expected yield against budget).
- Vertex optimizer detail, DSPy GEPA detail: UNVERIFIED in ledger — not re-fetched; recorded as partially-verified rather than evidence.

## Edge Cases

- Contradictory evidence: example-count guidance conflicts across vendors (finding 5) — preserved all three, resolved as a ranged rule.
- Missing dependencies: skill-creator/promptfoo/DSPy/Vertex not re-fetched this run — REQ-007 leg marked partially verified.
- Partial success: 5 of 8 ledger source-groups re-verified live; the rest stand on the ledger's own CONFIRMED/delegate markings.

## Sources Consulted

- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices (model-specific table; "Prefer general instructions…"; CRITICAL-softening; self-check line)
- https://developers.openai.com/api/docs/guides/prompt-generation (meta-prompt: Minimal Changes, Preserve User Content, fixed output skeleton, reasoning-order)
- https://ai.google.dev/gemini-api/docs/prompting-strategies (few-shot always; delimiter consistency; context-first/question-last; component breakdown)
- https://raw.githubusercontent.com/christabone/claude-prompt-improvement/main/README.md
- https://raw.githubusercontent.com/christabone/claude-prompt-improvement/main/skills/improve-prompt/CHECKLIST.md
- https://raw.githubusercontent.com/christabone/claude-prompt-improvement/main/skills/improve-prompt/SKILL.md
- https://raw.githubusercontent.com/severity1/claude-code-prompt-improver/main/README.md
- specs/sk-prompt/010-sk-prompt-improvements/scratch/prompt-improver-survey.md (CONFIRMED vs delegate markings)

## Assessment

- New information ratio: 0.90 (9 of 10 findings fully new external evidence; finding 10 partially new — the verdict synthesis)
- Questions addressed: all five key questions now have complete evidence legs
- Questions answered: all five — exact question texts carried into the delta's answeredQuestions

## Reflection

- What worked: fetching the *implementation files* (CHECKLIST.md, SKILL.md, meta-prompt body) rather than landing pages — the verdict-relevant rules live in the contracts, not the marketing copy.
- What did not work: nothing material; the melodic-software and Vertex leads were deliberately deprioritized as UNVERIFIED.
- What I would do differently: fetch christabone's SKILL.md one iteration earlier — it is the single best public analog for the whole rebuild.

## Recommended Next Focus

Synthesis: compile the three iterations into research.md — the checklist design, the interaction contract, the caller-compat map, per-REQ verdicts, and the divergences the build must resolve (1-vs-3 cycles, in-prompt assumption tags vs open items, energy-level replacement).
