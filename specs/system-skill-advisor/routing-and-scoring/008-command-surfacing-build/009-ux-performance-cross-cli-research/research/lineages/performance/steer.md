# Lineage focus: performance

Angle: performance and cost. Hook wall time (cold and warm), daemon vs no-daemon paths, embedder cost and cold start (use measure-embedder-cost.mjs and the measured-2026-11-12.txt file), token cost of the brief per prompt and per session, caching and precompute opportunities. Measure with commands that are read-only and do not start/stop ollama; report baseline and expected delta.

Rulings from the lead (bind inside this lineage):
- Phases 005-008 of the parent packet are PLANNED, not built. Read their plan.md and tasks.md first and do not re-recommend what they already plan.
- Every recommendation names the exact file it changes, the measurable gain (with the number you measured or the baseline it moves) and the verification command or check.
- Never read or print rows of command-prompts.jsonl or any corpus file whose split is holdout.
- Do not run pi, do not touch ollama, do not kill processes, do not run the full vitest suite, read-only git only. A measurement you cannot take under these rules is recorded as a gap, not guessed.
- Other lineages cover the other two angles; stay on yours and note cross-angle findings only briefly.
