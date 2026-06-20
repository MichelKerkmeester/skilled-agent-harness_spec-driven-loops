# Grounding Evidence — AI Output: Command vs Natural Conversation

> Seeded from a live cross-model test this session. These are **verified**
> observations and **open** problems for improving AI output quality when prompted
> through slash-commands versus natural conversation. Start from this evidence.

## Verified this session (live `/memory:search` across 3 models)

The same query was driven through `opencode run --command memory/search "<q>"` and via
direct natural-language prompts, on three models, against one shared daemon:

- **DeepSeek v4-pro** — clean `--command` adherence: consumed `$ARGUMENTS`, rendered
  the full `MEMORY:SEARCH` presentation block both times.
- **Kimi K2.7** (`kimi-for-coding/k2p7`) — under `--command` it **read the command's
  presentation asset but then asked the startup question** ("What would you like to
  retrieve or analyze?") instead of executing — it did NOT bind `$ARGUMENTS`. Via a
  **direct natural prompt** it searched correctly and reported `requestQuality` /
  `citationPolicy` more precisely than DeepSeek.
- **MiMo v2.5 Pro** (`xiaomi/mimo-v2.5-pro`) — **mixed**: one query searched (handled
  the empty-result fallback well, surfaced triggered + constitutional rows, asked to
  narrow), the other dropped to the startup question.

**Key signal:** slash-command argument adherence varies sharply by model. The
command contract (`.opencode/commands/memory/assets/search_presentation.txt`) says
"if `$ARGUMENTS` is empty, ask the startup question" — and weaker instruction-followers
mis-read a populated `$ARGUMENTS` as empty, falling to the startup path.

## Open problems to research (the actual ask)

1. **Command-argument robustness across models.** Why do Kimi/MiMo drop to the
   startup question under `--command` when DeepSeek doesn't? Is it the `$ARGUMENTS`
   injection point, the "ask when empty" instruction, or model instruction-following?
   Design a command-contract pattern that survives weaker models (explicit arg echo,
   no-empty-guard, imperative "execute now, do not ask").
2. **`--command` vs direct-prompt vs natural conversation** — when should a slash
   command be a deterministic renderer (no model latitude) vs a model-driven flow?
   The presentation-contract approach (render from a fixed shape) reduces variance;
   quantify output quality/consistency across the three surfaces.
3. **Startup-question fallback** is a correctness hazard under `--command` (it
   silently swallows the query). Should commands distinguish "invoked with args" from
   "invoked bare" structurally rather than by `$ARGUMENTS` emptiness heuristics?
4. **Natural-conversation output** — for the same retrieval, models render different
   fields (DeepSeek showed confidence 0.36, Kimi showed similarity 0.68 for the same
   row). Which fields should the contract mandate so conversational answers are
   comparable and trustworthy?
5. **Prompt-framework fit per model** (DeepSeek/Kimi/MiMo) for command-style vs
   conversational tasks — see `sk-prompt-small-model` per-model profiles; does the
   right framework reduce the command-adherence gap?

## Where to look
- Command contract: `.opencode/commands/memory/search.md` + `assets/search_presentation.txt`.
- cli-opencode `--command` mechanics: `.opencode/skills/cli-opencode/SKILL.md`
  ("Registered command dispatch" note — `$ARGUMENTS` expands like `"$@"`).
- Per-model prompt profiles: `.opencode/skills/sk-prompt-small-model/references/models/`.
- Live repro: `opencode run --command memory/search "<q>"` vs a direct prompt, per model.
