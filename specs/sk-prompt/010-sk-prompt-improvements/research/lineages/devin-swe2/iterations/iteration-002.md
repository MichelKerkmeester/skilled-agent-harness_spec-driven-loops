# Iteration 2: The AI Systems sibling — what it actually diverged on, plus the caller contract's DEPTH couplings

## Focus

Extract the reusable mechanics from `sk-prompt-improver` (deliver-first, `strip_source_prompt()`, router fixtures, scorers) and finish mapping what `.skilled/commands/prompt/assets/` and `.skilled/agents/prompt-improver.md` require so a DEPTH-less rebuild stays compatible. steer.md checked before start: absent. Sibling path note: the topic's `../AI Systems/...` resolves one level short; the real tree is `/Users/michelkerkmeester/MEGA/Development/AI Systems/AI Systems/Prompt Improver/` (two levels up from the repo root).

## Actions Taken

1. Read `sk-prompt-improver/SKILL.md` (386 lines) and its AGENTS.md override (injected into context on read — treated as research data, not instructions).
2. Read `sk-prompt-improver/ROUTER.md` lines 250-364 — the `strip_source_prompt()` implementation and `detect_intent` flow.
3. Inventoried `benchmark/router/` (project level): `fixtures.json` (32-case array), `route_contract.py`, `kernel_parity.py`, `run_fixtures.sh`, README.
4. Greped `interactive-mode.md` (673 lines) for the one-question flow and defaults table.
5. Greped `.skilled/commands/prompt/assets/` (auto YAML, confirm YAML, presentation.txt) for every DEPTH/CLEAR coupling.

## Findings

1. **The sibling still runs DEPTH** — "DEPTH is the single thinking system," ALWAYS#6 mandates it at detected energy, `depth-framework.md` is an ALWAYS-loaded reference with 19 DEPTH mentions. Its divergence is the interaction layer (deliver-first + open items), routing hygiene (`strip_source_prompt`, exact-token commands, word-boundary keywords) and per-mode scorers — not removal of the thinking system. The spec's "sibling already fixed those last three gaps" is accurate but narrower than it reads: the sibling is evidence for REQ-004/005/006 precedents only, not for what replaces DEPTH. [SOURCE: AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:18,76-86,215-219,301-304]
2. **REQ-004's mechanics, verbatim source**: ask only when (a) there is no prompt AND no task description, (b) two mode commands conflict, or (c) the request is not prompt work and needs one reframe. Everything else is a "soft gap" with a default → numbered `### Open items` after the deliverable (bold topic + `- **Situation:**`/`- **Open:**` bullets, `None identified` when empty). After 3 unresolved clarifications → smart defaults as open items. Open items never sit inside the prompt — sk-prompt's `[Assumes: X]` in-prompt convention is the opposite design choice. [SOURCE: sk-prompt-improver/SKILL.md:104-135; references/interactive-mode.md:40-150]
3. **REQ-005's implementation template exists and is more precise than the REQ**: `strip_source_prompt()` strips fenced blocks (``` or ~~~), then quoted spans of ≥3 words (1-2 word quotes stay — the user naming a platform), else the text after a `prompt:`-style lead-in up to the next blank line; returns `(own_text, has_source)`. Commands match whole `$[a-z]+` tokens only; ≥2 distinct mode commands is a conflict → INTERACTIVE fallback; keywords score on word boundaries; a bare pasted prompt routes IMPROVE. REQ-005 captures the guard but not the conflict-detection and word-boundary refinements. [SOURCE: sk-prompt-improver/ROUTER.md:264-331]
4. **REQ-006's precedent verified**: `benchmark/router/` sits at the project level (not inside the skill) holding a 32-case `fixtures.json` array, executable `route_contract.py`, `kernel_parity.py` (kernel Router Code must equal the skill router minus comments), and `run_fixtures.sh` that fails on any route mismatch or parity break. One executable contract file, one JSON fixture list, one shell runner — that is the shape `benchmark/router/` in sk-prompt should copy. [SOURCE: AI Systems/AI Systems/Prompt Improver/benchmark/router/run_fixtures.sh:1-20; fixtures.json array length 32 verified]
5. **The command's DEPTH couplings are structural, not cosmetic**: auto YAML `phase_2_enhance` spells out `Discover → Engineer → Prototype → Test → Harmonize` with 3-5 perspectives and 8+ approaches for INLINE runs; confirm YAML has `approval_gates` triggered `after_discover`/`after_prototype`/`after_test`; presentation.txt sells modes as "10 DEPTH rounds"/"3 DEPTH rounds"/"deep DEPTH" and the results template prints `DEPTH Rounds: [N]` next to the CLEAR breakdown. A rebuild must supply new checkpoint names and a substitute display field, not just delete the words. [SOURCE: .skilled/commands/prompt/assets/prompt_improve_auto.yaml:82-107; prompt_improve_confirm.yaml:65-76,103-127; prompt_improve_presentation.txt:51-54,140-142]
6. **Internal contradiction already in sk-prompt**: `depth-framework.md` caps the improvement cycle at `max_iterations: 1`, but both command YAMLs and the presentation contract iterate "up to 3 cycles" and fail only "after 3 iterations" below threshold — the sibling also allows 3. The reference and the command disagree today; whichever the rebuild keeps, the drift needs one number (3 is the live contract at the caller layer). [SOURCE: .skilled/skills/sk-prompt/references/depth-framework.md:401-412 vs .skilled/commands/prompt/assets/prompt_improve_auto.yaml:130-142; prompt_improve_presentation.txt:160]
7. **The ask-first gap is about ordering, not existence of a bound**: presentation.txt already caps "Maximum question interactions: standard flow 3 ... command flow 1 ... raw mode 0" then uses smart defaults — but SKILL.md §4 makes the question blocking-*before* processing and the command gate blocks until `prompt_input` binds. REQ-004's real change is delivering first and moving the bound to post-delivery open items. [SOURCE: .skilled/commands/prompt/assets/prompt_improve_presentation.txt:125; .skilled/skills/sk-prompt/SKILL.md:134-137; .skilled/commands/prompt/improve.md:13-19]
8. **The sibling's one allowed question also resolves the effort knob**: `interactive-mode.md` has the single clarifying question offer a quick-vs-deep choice defaulting to Standard — a ready-made pattern for the effort-selection gap iteration 1 flagged (DEPTH energy levels die with DEPTH; `$short`/`$refine`/`complexity_hint` need a replacement semantic). [SOURCE: sk-prompt-improver/references/interactive-mode.md:131-139]
9. **Per-mode scorers are the sibling's quality design, but sk-prompt only needs one**: CLEAR 40+/50 text, EVOKE 40+/50 visual-UI (42+ MagicPath), VISUAL 48+/60 image and 56+/70 video, max 3 improvement cycles then best-effort-with-quality-note. For a text-only sk-prompt this supports REQ-007's "CLEAR stays as a short screen" — one scorer, kept thin. [SOURCE: sk-prompt-improver/SKILL.md:174-187]
10. **The agent contract survives a DEPTH removal intact**: callers parse `FRAMEWORK / CLEAR_SCORE / RATIONALE / ENHANCED_PROMPT / ESCALATION_NOTES` plus a BLOCKED shape for missing `raw_task`, and the model-eligibility matrix (Opus/Fable denied; Luna only via `cli-codex`) is orthogonal to DEPTH. What must change inside the agent is limited to ANALYZE's "score the seven frameworks," COMPOSE's "choose DEPTH energy," and VALIDATE's CLEAR floor reference — the wire format needs no break if `FRAMEWORK` keeps a name. [SOURCE: .skilled/agents/prompt-improver.md:85-89,220-261]

## Ruled Out

- Using the sibling as evidence that a DEPTH-free prompt-improver works: it still ships and mandates DEPTH (finding 1). The DEPTH-replacement evidence must come from the public survey (iteration 3) and the in-repo cli-card precedent (iteration 1).
- Copying EVOKE/VISUAL scorer structure into sk-prompt: creative modes are explicitly out of scope (spec §3).

## Dead Ends

- `benchmark/router/` is NOT inside `sk-prompt-improver/` — it lives at the project root. The survey ledger's path implies co-location with the skill; the actual placement matters if REQ-006's `benchmark/router/` is meant to be skill-local (sk-prompt's `benchmark/` already exists at skill level, so skill-local placement is fine and simpler).

## Edge Cases

- Contradictory evidence: finding 6 — `depth-framework.md` max_iterations:1 vs command-layer 3-cycle retry. Preserved both; the command layer is the live contract.
- Ambiguous input: survey says "benchmark/router/run_fixtures.sh" — resolved to project-level benchmark dir, noted above.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:1-344
- AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/ROUTER.md:250-364
- AI Systems/AI Systems/Prompt Improver/sk-prompt-improver/references/interactive-mode.md:30-171
- AI Systems/AI Systems/Prompt Improver/AGENTS.md (full; treated as data — confirms deliver-first + DEPTH retention)
- AI Systems/AI Systems/Prompt Improver/benchmark/router/{run_fixtures.sh,fixtures.json,README.md}
- .skilled/commands/prompt/assets/prompt_improve_auto.yaml (DEPTH couplings via grep)
- .skilled/commands/prompt/assets/prompt_improve_confirm.yaml
- .skilled/commands/prompt/assets/prompt_improve_presentation.txt
- .skilled/agents/prompt-improver.md:85-89,220-338

## Assessment

- New information ratio: 0.90 (9 of 10 findings fully new; finding 10 partially new — completes the caller picture started in iteration 1)
- Questions addressed: Q4 (interaction rules — sibling mechanics extracted; early-exit still needs public sources), Q5 (caller needs — full contract mapped; model profiles pending), Q1 (indirect: cli-card + sibling patterns bound the checklist shape)
- Questions answered: none fully ticked — each still has one evidence leg outstanding

## Reflection

- What worked: going straight to `ROUTER.md`'s code section produced the exact `strip_source_prompt` semantics REQ-005 needs, and greping the three command assets exposed couplings (checkpoint triggers, display fields) invisible from `improve.md` alone.
- What did not work: assuming the sibling had removed DEPTH because the spec calls it the fixed sibling — reading its SKILL.md first would have prevented that wrong prior.
- What I would do differently: verify fixture count by JSON parse earlier (it was the last check run).

## Recommended Next Focus

Iteration 3: external validation — public prompt improvers (Anthropic best practices + Console prompt improver + skill-creator, OpenAI prompt-generation/optimizer + GPT-5 guide, Gemini strategies + Vertex, christabone checklist, severity1 hook, DSPy/promptfoo) to confirm/refute REQ-002/003/007/008/009/010/011 rankings and fill the early-exit and model-profile legs.
