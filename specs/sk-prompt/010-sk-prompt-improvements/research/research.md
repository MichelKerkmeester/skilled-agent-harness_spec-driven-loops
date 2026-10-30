# Deep Research Synthesis — Rebuilding sk-prompt without DEPTH

**Lineage:** `devin-swe2` (cli-devin / swe-2-max) · **Session:** `fanout-devin-swe2-1793339054661-ddx0ri` · **Spec:** `specs/sk-prompt/010-sk-prompt-improvements` · **Iterations:** 3 of 3 (stopPolicy: max-iterations)

---

## 1. Research Metadata

| Field | Value |
|---|---|
| Topic | How sk-prompt should be rebuilt without the DEPTH thinking framework; validate/refute/extend REQ-002..011 |
| Method | 3 iterations: (1) current-state contract, (2) AI Systems sibling comparison + caller contract, (3) public-improver validation |
| Evidence base | 10 repo files read in full, 3 command asset YAMLs, sibling skill+router+benchmark tree, 5 public source groups fetched live |
| Stop reason | maxIterationsReached |

## 2. Executive Summary

The spec's thesis survives contact with the evidence: **no surveyed vendor or community prompt improver runs a scripted multi-round, multi-perspective ritual** — they converge on one assessment pass, a fixed component skeleton, visible-reasoning transparency, and evaluation against real inputs. All ten requirements (REQ-002..011) are directionally validated; none is refuted. Two need re-scoping: REQ-008's acceptance criterion aims at the wrong artifact (`framework-registry.json` is benchmark scaffold, not the selection surface), and REQ-009's fixed "3 to 5 examples" is overconfident against conflicting vendor ranges. Three extensions emerge that no REQ currently covers: (a) the command layer's DEPTH-phase checkpoint names and "DEPTH Rounds" display are structural couplings, not prose; (b) sk-prompt already disagrees with itself on CLEAR retry count (reference says 1, callers say 3); (c) DEPTH energy levels are the hidden contract behind `$short`/`$refine`/`complexity_hint`/`dispatch_mode` and need a named replacement, not silent deletion. The sibling `sk-prompt-improver` is NOT evidence a DEPTH-free design works — it still mandates DEPTH; it is proof for the deliver-first, paste-guard and router-fixture improvements only.

## 3. Research Question & Objectives

Primary: what exactly replaces DEPTH, validated against the ranked REQs, the source ledger, the AI Systems sibling, and public improvers. Sub-questions (all answered): checklist contents; seven-framework collapse; quality judging; deliver-first vs ask-first + early exit; caller compatibility incl. model profiles and change-report fit.

## 4. Method

Iteration 1 mapped the real DEPTH surface: `ROUTER.md` default-load, `depth-framework.md` internals, `SKILL.md` pipeline/rules, agent + command contracts, measured DEPTH footprints. Iteration 2 read the sibling's SKILL/ROUTER/interactive-mode/AGENTS/benchmark tree and the command asset YAMLs. Iteration 3 re-fetched the load-bearing public sources (Anthropic best practices, OpenAI prompt-generation, Gemini prompting-strategies, christabone improve-prompt SKILL+CHECKLIST, severity1 hook) and judged each REQ. Sources marked CONFIRMED in the ledger were re-verified live where fetched; UNVERIFIED ledger items stayed un-elevated.

## 5. What DEPTH Is Today — the Coupling Surface

- **Router default load**: `references/depth-framework.md` is `DEFAULT_RESOURCE` — every intent except FRAMEWORK/RAW loads it, including UNKNOWN_FALLBACK. Removal needs a new default or none. [ROUTER.md:116,254]
- **Command checkpoints**: confirm YAML `approval_gates` trigger `after_discover/after_prototype/after_test`; auto `phase_2_enhance` spells out all five phases inline; presentation sells "10/3/deep DEPTH rounds" and prints `DEPTH Rounds: [N]`. [improve assets]
- **Agent internals**: ANALYZE scores seven frameworks, COMPOSE chooses DEPTH energy from `complexity_hint`, VALIDATE applies CLEAR floors. [prompt-improver.md:85-89]
- **Reference internals**: 4 energy levels, blocking 3–5 perspectives, 5 techniques, RICCE→CLEAR sequence, floors C7/L7/E10/A7/R3, proof-through-output metadata. [depth-framework.md:45-398]
- **Footprint**: 25/29 playbook files name DEPTH-or-depth-framework (spec's "25" confirmed); SKILL.md 18, ROUTER.md 11+, agent 8, improve.md 3.

## 6. What Replaces DEPTH — the One-Pass Checklist (Q1)

**Answer: a fixed component-verdict pass, not a process.** The convergent form across Anthropic ("prefer general instructions over prescriptive steps" + "verify your answer against [test criteria]"), christabone (10-technique present?/benefit?/how-to-apply verdicts with 1–2-sentence rationale in visible `<thinking>`), OpenAI (fixed guideline list → fixed output skeleton), and sk-prompt's own `cli-prompt-quality-card.md` (task→framework table + CLEAR 5-question check) is:

1. **Check once** against a fixed component list — verdict per component: present / missing-and-needed / deliberately-skipped, each with a one-line reason.
2. **Write the prompt** from the component skeleton.
3. **Self-check once** against stated criteria (Anthropic's verbatim mechanism), then deliver with a change report.

Checklist membership is a design choice; the protocol is the invariant. REQ-002's ~10 components cover the convergent core (role, task, context, examples, format, constraints, clarity/length, success criteria, contradictions, model fit). Additions worth taking from christabone: **variables/templating** and **task-decomposition** ("should this be split?") as optional rows; from DEPTH itself: **assumption surfacing** and **mechanism-first (WHY before WHAT)** fold into the context/clarity rows — the checklist absorbs RICCE's parts-check and Test's contradiction concern while dropping perspectives, techniques and energy scaling *by decision, not oversight*.

## 7. The Framework Skeleton Question (Q2)

**Answer: collapse to one skeleton; names survive as internal labels at most.** OpenAI's production meta-prompt emits exactly one fixed skeleton (concise instruction → details → optional #Steps → #Output Format → #Examples → #Notes); no vendor names RCAF/COSTAR-style acronyms; all describe the same component vocabulary. The seven frameworks collapse into one skeleton where each former "framework" is at most a density/style preset. On the spec's Open Question (aliases vs outright removal): **keep the names as internal labels** — the agent wire contract's `FRAMEWORK:` field can keep emitting a name without breaking callers, and REQ-008's own text says "internal labels at most." Re-scoping needed: retire the SKILL.md §3 selection matrix + patterns-evaluation §2 selection role; `assets/framework-registry.json` is data-only benchmark scaffold (slot templates), so "retired or reduced to aliases" should not target it.

## 8. How Quality Should Be Judged (Q3)

**Answer: test inputs first, CLEAR stays as a short screen — with one caveat.** Direction validated: every verified source emphasizes evaluation against real inputs (Anthropic self-check, vendor eval surfaces, optimizer/eval tooling); the sibling kept CLEAR for text while adding per-mode scorers, proving a thin screen survives redesign. The REQ-007 "quick test" concretely = an optional run of 2–3 realistic inputs through old and new prompt (christabone's test/ dir + sibling's best-effort-with-note are the templates), with CLEAR scoring kept *after* the test as a short screen with the reason written before each score (visible-reasoning precedent). **Caveats**: the skill-creator/promptfoo/DSPy citations in the ledger remain delegate-marked (partially verified, not refuted), and the OpenAI Evals API the ledger cites is read-only 2026-10-31 and shuts down 2026-11-30 — the quick test must be local, never Evals-dependent.

## 9. Deliver-First vs Ask-First + Early Exit (Q4)

**Answer: deliver first with numbered open items; early exit on already-passing prompts; ask only when nothing can be defaulted.** Sibling mechanics (REQ-004's source): ask only when (a) no prompt AND no task description, (b) two mode commands conflict, (c) non-prompt work needing one reframe — everything else is a soft gap → numbered `### Open items` after the deliverable, never inside the prompt; 3 unresolved clarifications → smart defaults. Vendor improvers ask nothing at all. The gap in sk-prompt is *ordering* (question blocks before processing) not bound-existence (presentation already caps question interactions at 3/1/0). Early exit (REQ-003) is doubly precedented: severity1's ~189-token eval passes clear prompts with zero overhead; OpenAI's "Minimal Changes" clause and christabone's "Skip if"/over-engineering ban do the same inside the checklist. **Named alternative**: severity1's evaluate-then-pass-or-ask is a legitimate third model — deliver-first fits sk-prompt's goals better, but the build should acknowledge rather than dismiss it. Non-interactive runs are unaffected either way (already proceed on stated assumptions).

## 10. What the Callers Need (Q5)

**Answer: the wire contract survives; the internals need three substitutions.**

- `@prompt-improver`: keep `FRAMEWORK / CLEAR_SCORE / RATIONALE / ENHANCED_PROMPT / ESCALATION_NOTES` + BLOCKED shape + model-eligibility matrix (Opus/Fable denied, Luna cli-codex-only — orthogonal, untouched). Substitute: ANALYZE's seven-framework scoring → skeleton+preset selection; COMPOSE's "DEPTH energy" → a 2–3-level effort knob (sibling precedent: the one allowed question offers quick-vs-deep defaulting Standard); VALIDATE's CLEAR floors → short-screen + quick-test line.
- `/prompt:improve` command: input gate's `prompt_input` blocking stays for missing input but must not block on answerable gaps; auto YAML `phase_2` gets new step names; confirm approval gates need non-DEPTH checkpoint anchors (e.g., after-checklist / after-draft / after-score); presentation needs a "rounds" field replacement (checklist verdicts + score + test line) and mode-menu wording minus "DEPTH rounds"; CLEAR retry count needs ONE number — callers already run 3 while the reference says 1 (contradiction to resolve, 3 is the live contract).
- Transparency: proof-through-output (Mode/Framework/Perspectives/Score) → change report (added/changed/removed/skipped + open items + confidence) per christabone + sibling — lighter and REQ-011-compliant.
- Model profiles (REQ-010) fit the contract via `target_cli`/`target_model`: validated and strengthened — every current Claude model has its own prompting page (Opus 5 vs 5.5 even diverge on self-check instructions), so profiles should key to model *versions*, one short section each (Claude: XML sections, context-first, no "show reasoning" on thinking models; GPT: one Markdown skeleton, no contradictions; Gemini: one delimiter style, constraints-first/question-last).

## 11. Recommendations — per-REQ verdicts

| REQ | Verdict | Notes |
|---|---|---|
| REQ-001 | Unchanged (out of research scope) | Two stale references — mechanical fix, not researched |
| REQ-002 | **Validated (P0 correct)** | One-pass checklist is the convergent form; adopt christabone's present/benefit/skip verdict protocol + Anthropic self-check; absorb RICCE + contradiction + success-criteria + model-fit rows; consider variables and task-decomposition rows |
| REQ-003 | **Validated (P0 correct)** | Two independent pass-through precedents; the checklist's per-row "Skip if" IS the early-exit mechanism |
| REQ-004 | **Validated** | Deliver-first + numbered open items; keep the one-question bound for no-prompt-no-task; name severity1's ask-when-vague as the rejected alternative |
| REQ-005 | **Validated; extend** | Port `strip_source_prompt()` semantics wholesale — including 1–2-word quote retention, `prompt:` lead-in fallback, whole-`$token` matching, ≥2-command conflict → disambiguation, word-boundary scoring, bare-pasted-prompt → IMPROVE — all of which the REQ text does not mention |
| REQ-006 | **Validated** | Copy the sibling shape: executable route contract + JSON fixture list + shell runner + (if a kernel copy ever exists) parity gate; place under skill-local `benchmark/router/` |
| REQ-007 | **Validated with caveats** | Right direction (test inputs before self-score); weakest-sourced REQ (key citations still delegate-marked); quick test must be local — OpenAI Evals is sunsetting; CLEAR stays as short screen with reason-before-score |
| REQ-008 | **Validated; re-aim criterion** | Collapse to one skeleton confirmed by OpenAI's fixed output contract; keep names as internal labels; acceptance criterion should target SKILL.md §3 + patterns-evaluation §2, not `framework-registry.json` |
| REQ-009 | **Validated; soften one number** | Contradiction + plain-language checks verbatim Anthropic; example count should be ranged (≥1, ~3 typical, ≤5 complex) — vendors conflict (1–3 / 3–5 / experiment) |
| REQ-010 | **Validated; strengthen** | Per-model → per-*version* profiles (Opus 5 vs 5.5 diverge on self-check); `target_model` field selects one short profile section |
| REQ-011 | **Validated verbatim** | `<3x` cap + Added/Modified/Removed/Skipped report + preserve-user-content all confirmed in christabone + OpenAI |

**Extensions the REQs do not cover (recommend adding):** (1) rename confirm-mode checkpoints + the `DEPTH Rounds` display field; (2) resolve the 1-vs-3 CLEAR retry contradiction (live contract is 3); (3) define the post-DEPTH effort knob for `$short`/`$refine`/`complexity_hint`/`dispatch_mode`; (4) drop in-prompt `[Assumes: X]` tags in favor of open items (sibling convention); (5) pick ONE canonical CLEAR home (patterns-evaluation §10 is the richer copy).

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Keep DEPTH as optional reference | Router loads it by default for nearly every intent; "optional" requires the same removal work anyway | ROUTER.md:116,254 | 1 |
| Sibling as proof DEPTH-free works | Sibling still mandates DEPTH — divergence was interaction/routing/scorers | sk-prompt-improver SKILL.md:76-86 | 2 |
| Copy EVOKE/VISUAL scorer structure | Creative modes explicitly out of scope | spec.md §3 | 2 |
| framework-registry.json as selection surface | It is benchmark scaffold data; selection lives in SKILL.md §3 + patterns §2 | registry JSON header | 1,3 |
| Fixed "3–5 examples" universal rule | Vendor ranges conflict (1–3/3–5/experiment) | OpenAI, Anthropic, Gemini docs | 3 |
| Ask-when-vague dismissed | Legitimate shipped third model; REQ-004 still better fit but must be named | severity1 README | 3 |
| OpenAI Evals-backed quick test | Evals read-only 2026-10-31, shutdown 2026-11-30 | survey CONFIRMED rows | 3 |
| In-prompt `[Assumes: X]` tags retained | Sibling's open-items convention is cleaner and already proven | interactive-mode.md | 2 |
| Pipeline living in runtime mirrors | Canonical pipeline is `.skilled/commands/prompt/assets/*.yaml` | command tree | 1 |
| melodic-software / Vertex / GEPA as evidence | UNVERIFIED in ledger; carries no requirement | survey | 3 |
| Ask-first preserved for interactive runs | Vendor improvers ask nothing; severity1 asks only on vague; presentation already bounds questions at 3/1/0 | OpenAI, severity1, presentation.txt | 2,3 |

## Divergence Map

- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0 (convergenceMode: default — no divergent pivots)
- Saturated: none recorded
- Remaining frontier: (a) UNVERIFIED ledger sources (skill-creator internals, promptfoo, DSPy/GEPA, Vertex loop detail, melodic-software) — each would only sharpen REQ-007, not change verdicts; (b) whether the vendored AI Systems copy gets re-synced post-build (spec Open Question 2); (c) effort-knob naming (`$deep` token exists in sibling's registry but not sk-prompt's).

## Open Questions

1. Effort knob naming post-DEPTH: reuse sibling's quick/standard/deep vocabulary, or keep `$short`-style mode tokens? (extension #3)
2. CLEAR canonical home: patterns-evaluation §10 vs a new short-screen doc — one must win to stop dual specification (extension #5)
3. Should framework names remain callable by users ("use COSTAR") as aliases, or internal-only? (spec Open Question 1 — research recommends internal labels with the FRAMEWORK field still emitting a name)
4. Vendored-copy resync ownership for `AI Systems/.skilled/skills/sk-prompt` (spec Open Question 2 — out of research scope)

## Risks & Caveats

- **Delegate-marked evidence**: REQ-007's skill-creator/promptfoo/DSPy legs are the survey's readings, not re-verified here; verdicts stand on convergent evidence regardless.
- **Single-lineage view**: this is one fan-out lineage of N; merge may add contradictory evidence from sibling lineages.
- **Injection-screened sources**: vendor prompt guides are literally AI-directed text; all were treated as data and none drove tool calls.
- **Sibling AGENTS.md was injected into context on read** and treated as research material, not instructions — its deliver-first text corroborates the SKILL.md findings.
- **Spec-write steps skipped by scope**: bounded spec.md mutation (pre-init + findings write-back) is outside this lineage's write authority; recorded as `spec_synthesis_deferred` rather than executed.

## Appendix: Convergence Report

- Stop reason: **maxIterationsReached** (config.stopPolicy: max-iterations; convergence signals were telemetry only)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0 (4 open questions logged above are forward-looking, not unanswered key questions)
- Last 3 iteration summaries: run 1 — current-state contract (0.90); run 2 — sibling + caller couplings (0.90); run 3 — public validation + verdicts (0.90)
- Convergence threshold: 0.05 (telemetry only); final newInfoRatio 0.90; reducer convergenceScore 0.9
- Divergence summary: no divergent pivots recorded

## References

- specs/sk-prompt/010-sk-prompt-improvements/spec.md; scratch/prompt-improver-survey.md
- .skilled/skills/sk-prompt/{SKILL.md,ROUTER.md,references/depth-framework.md,references/patterns-evaluation.md,assets/framework-registry.json,assets/cli-prompt-quality-card.md}
- .skilled/agents/prompt-improver.md; .skilled/commands/prompt/{improve.md,assets/*}
- AI Systems/AI Systems/Prompt Improver/{AGENTS.md,benchmark/router/*}; sk-prompt-improver/{SKILL.md,ROUTER.md,references/interactive-mode.md,references/depth-framework.md}
- platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- developers.openai.com/api/docs/guides/prompt-generation
- ai.google.dev/gemini-api/docs/prompting-strategies
- github.com/christabone/claude-prompt-improvement (README, skills/improve-prompt/{SKILL.md,CHECKLIST.md})
- github.com/severity1/claude-code-prompt-improver (README)

## Orchestrator Verification

The orchestrating session checked the lineage's new load-bearing claims against the repository after the run. Each was confirmed:

- `ROUTER.md:116` sets `DEFAULT_RESOURCE = "references/depth-framework.md"`.
- The CLEAR retry count disagrees: `SKILL.md:273`, `.skilled/agents/prompt-improver.md:88` and `references/depth-framework.md:165` allow one retry, while `.skilled/commands/prompt/assets/prompt_improve_auto.yaml:98,142` and `prompt_improve_confirm.yaml:118,162` allow 3 cycles.
- `assets/framework-registry.json` describes itself as "Code-task benchmark scaffolds", so it is not the selection surface.
- `prompt_improve_confirm.yaml:19` declares `checkpoints: [after_discover, after_prototype, after_test]`, and `prompt_improve_presentation.txt:140` prints `DEPTH Rounds: [N]`.

Run notes: the first lineage on `deepseek-v4-1-flash-max` exited 1 after 16 seconds with Devin's `resource_exhausted` weekly-quota error and wrote no iteration; it was removed and the run repeated on `swe-2-max`, the operator's named alternative. The runner flagged 2 of 7 lineage state rows as timestamped after the run window (06:05 and 06:10 against an end at 05:56), so those timestamps were likely written by the model rather than read from a clock.

## Second Opinion: codex-luna (GPT-6 Luna, max reasoning, fast tier)

A fresh one-iteration lineage (`lineages/codex-luna/research.md`) rechecked the verdicts above. It agrees on REQ-002 to REQ-007 and REQ-010, confirms all four uncovered build items, and differs in four places:

- **REQ-008 is partly inference.** Vendor guides share components but do not tell anyone to retire named frameworks, and the AI Systems Prompt Improver still selects one. Keep one default skeleton plus optional presets or aliases, and remove presets only once tests show they add nothing.
- **REQ-009 needs re-scoping.** Use examples when they help rather than a fixed count, and soften capitalised constraints without banning them.
- **REQ-011 is overstated.** OpenAI says to preserve guidelines and examples "entirely, or as closely as possible", not word for word, and the 3x cap comes from one community tool. Treat 3x as a warning, and keep text verbatim only when the user asks.
- **Two factual corrections to the synthesis above.** "No surveyed improver runs a multi-round process" does not hold for the AI Systems sibling, which still mandates DEPTH. The sibling's router benchmark sits at the project root (`Prompt Improver/benchmark/router/`), not inside the skill folder.

New points: the checklist rows should be marked present, absent or not needed, so no prompt is forced to carry every component. The quick test should report NOT RUN when no target model is available. `target_model` should be separate from `target_cli`. The effort input should change checklist breadth and whether a test runs, not a hidden round count. The agent and command descriptions still advertise frameworks and DEPTH.

Orchestrator check: the OpenAI wording and the sibling benchmark path were confirmed on 2026-10-30. The run's containment advisory named `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/description.json`, which a concurrent session's continuity save wrote at 06:24 UTC; the lineage did not write it.
