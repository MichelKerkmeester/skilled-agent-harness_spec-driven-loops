# Deep Research Strategy — mimo-v25-pro lineage

## Topic
Fable-5 efficiency: map every adjustable Public-repo surface and optimization that moves our AIs toward fable-5 efficiency, from the fable-mode and opus-fable-mode sources. This lineage runs on `xiaomi/mimo-v2.5-pro` via `cli-opencode`.

## Key Questions
1. What net-new surfaces or optimization angles does a non-Anthropic model perspective reveal that the codex-xhigh and opus-account2 lineages may have missed?
2. How portable are the fable-5 mechanisms (governor, thermostat, measurement) across OpenCode, Claude Code, and Codex runtimes — what are the actual wiring gaps?
3. What is the implementation path for the top-ranked recommendation (governor-on-hook) specifically in the OpenCode runtime?
4. How can the leak_test.py measurement concept be adapted for non-Claude-Code runtimes (OpenCode JSONL logs, Codex transcripts)?
5. What are the cross-model behavioral differences when a non-Opus model (mimo-v2.5-pro) consumes fable-5 directives — does the governor transfer, or is it Opus-specific?

## Known Context
- resource-map.md not present; skipping coverage gate
- Round 1 shipped: Operating Discipline subsection, 2 constitutional rules, main-branch-direct-push.md fold, sk-code line
- Prior lineages (codex-xhigh, opus-account2) produced 30 findings, converged on governor-on-hook + measurement + executor-fail-loud as the land-first cluster
- The merged research.md already exists at `research/research.md`
- Sources: `external/fable-mode-main/` (62KB behavioral profile + command), `external/opus-fable-mode-main/` (governor + reinject hook + leak_test.py), `external/Fable5.md` (round-1 doctrine)

## Non-Goals
- Implementing any recommendation (research-only)
- Re-recommending round-1's shipped set
- Editing any framework surface

## Stop Conditions
- All 5 key questions answered with evidence
- Convergence (newInfoRatio < 0.05) or max iterations (5) reached
- Findings deduped against the existing 30-finding registry

## What Worked
- grep for UserPromptSubmit across .opencode revealed the full cross-runtime hook architecture (iteration 1)
- Reading the skill_advisor_hook.md reference directly clarified the OpenCode plugin bridge mechanism
- Glob of constitutional memories + agent prompts revealed the full surface count (iteration 2)
- grep for renderPromptPack/post-dispatch-validate in deep-loop-runtime found enforcement surfaces (iteration 2)
- Analyzing executor-config.ts schema directly revealed the governor attachment point (iteration 3)
- Reading prompt_pack_iteration.md.tmpl revealed the template variable mechanism (iteration 3)
- Recognizing that deep-loop state JSONL is already cross-runtime measurement infrastructure (iteration 4)

## What Failed
(none)

## Exhausted Approaches
- leak_test.py adaptation (too coupled to Claude-specific paths; standalone harness is the right approach)
- Constitutional memories as behavioral surfaces (they're rule-level, not style-level)
- renderPromptPack as the sole governor surface (only covers deep-loop iterations)

## Next Focus
Final synthesis: review all 20 findings (M1-M20), identify gaps, check convergence. Answer: what has this lineage uniquely contributed vs. the codex-xhigh and opus-account2 lineages?

## Active Risks
- mimo-v2.5-pro may have lower capability ceiling than the prior lineages' models
- Cross-runtime hook wiring data is sparse (only Claude hook was verified)
