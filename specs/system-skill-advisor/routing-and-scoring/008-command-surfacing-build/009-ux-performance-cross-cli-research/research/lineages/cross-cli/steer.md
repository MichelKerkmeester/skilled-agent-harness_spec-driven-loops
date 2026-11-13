# Lineage focus: cross-cli

Angle: usefulness across the six CLIs (claude, codex, opencode, pi, devin, dsh). Use runs-pre.jsonl and the score-command-transcripts.mjs --summary output to establish, per runtime, whether a model starts an offered command and what stops it (hook not wired, brief not injected, command not discoverable, model declines, capped, unsafe). Read each runtime hook/pointer surface to find the cause. Rank fixes by expected start-rate gain per runtime.

Rulings from the lead (bind inside this lineage):
- Phases 005-008 of the parent packet are PLANNED, not built. Read their plan.md and tasks.md first and do not re-recommend what they already plan.
- Every recommendation names the exact file it changes, the measurable gain (with the number you measured or the baseline it moves) and the verification command or check.
- Never read or print rows of command-prompts.jsonl or any corpus file whose split is holdout.
- Do not run pi, do not touch ollama, do not kill processes, do not run the full vitest suite, read-only git only. A measurement you cannot take under these rules is recorded as a gap, not guessed.
- Other lineages cover the other two angles; stay on yours and note cross-angle findings only briefly.
