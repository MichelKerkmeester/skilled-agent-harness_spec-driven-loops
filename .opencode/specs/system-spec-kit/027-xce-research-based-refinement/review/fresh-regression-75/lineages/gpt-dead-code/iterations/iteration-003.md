# Seat gpt-dead-code — iteration 3 (global #56)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-dead-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

## Analysis

**Scope:** `.opencode/commands/deep/assets/*_presentation.txt` vs the deep routers that load them (24-router refactor, maintainability lens).

**What I verified (read-only):**

1. **Asset inventory** — 6 presentation files on disk: `deep_{agent-improvement, ai-council, context, model-benchmark, research, review}_presentation.txt`, plus their 12 paired `_auto.yaml`/`_confirm.yaml`.

2. **Router → asset references** — 6 of the 8 deep routers declare a "Presentation source of truth" pointing at `.opencode/commands/deep/assets/deep_<name>_presentation.txt` (e.g. `research.md:99`, `review.md:71`, `context.md:72`, `ai-council.md:84`, `model-benchmark.md:123`, `agent-improvement.md:107`). Every referenced basename matches a file on disk exactly. **No router references a missing `.txt`.**

3. **Orphan check** — All 6 presentation files are referenced by their router. **No orphaned `.txt`.** The two routers without a presentation asset (`ai-system-improvement.md`, `skill-benchmark.md`) intentionally follow a different "shared deep-loop command contract" / packaging-owned-loop pattern and do **not** reference any `deep/assets/*_presentation.txt` — so no dangling reference (`ai-system-improvement.md:86`, `skill-benchmark.md:114`).

4. **Stale-name sweep** — `grep` surfaced references to *old* filenames (`deep_start-research-loop_presentation.txt` ×25, `deep_ask-ai-council_presentation.txt`, etc.) that do **not** exist on disk. I traced every one: they live exclusively in **frozen archival artifacts of other packets** — research iteration logs, `baseline/file-hashes.txt`, fanout logs under packets `148`/`152` and `z_archive/*`. These are point-in-time snapshots, not live router wiring; by convention they are not maintained. No live router or active asset carries a stale name.

5. **`.claude` mirror** — `.claude/commands/deep/assets/` carries duplicate copies (currently byte-identical, e.g. `deep_research_presentation.txt` diff = IDENTICAL). The mirrored routers hardcode the same `.opencode/...assets/` source-of-truth path and also use a relative `assets/` phrasing (`research.md:31`) that resolves within the runtime tree. This is the documented `.opencode`/`.claude` runtime-mirror convention, not a defect — assets are intentionally co-located so relative references resolve per runtime.

**Conclusion:** Within the live 24-router system, the presentation-asset wiring is consistent — no orphaned presentation `.txt`, no router pointing at a missing presentation `.txt`. The only "missing" names are confined to frozen historical logs of unrelated packets, which is expected. Nothing rises to a real maintainability defect attributable to packet 027.

```json
{"seat":"gpt-dead-code","model":"openai/gpt-5.5-fast","angle":"Command presentation .txt assets (24-router refactor): orphaned .txt with no router reference, or routers referencing a missing .txt.","verdict":"PASS","summary":"All 6 deep _presentation.txt are router-referenced and exist; no orphans, no dangling refs. Stale old names appear only in frozen archival logs of other packets.","files_reviewed":[".opencode/commands/deep/assets/deep_agent-improvement_presentation.txt",".opencode/commands/deep/assets/deep_ai-council_presentation.txt",".opencode/commands/deep/assets/deep_context_presentation.txt",".opencode/commands/deep/assets/deep_model-benchmark_presentation.txt",".opencode/commands/deep/assets/deep_research_presentation.txt",".opencode/commands/deep/assets/deep_review_presentation.txt",".opencode/commands/deep/research.md",".opencode/commands/deep/review.md",".opencode/commands/deep/context.md",".opencode/commands/deep/ai-council.md",".opencode/commands/deep/model-benchmark.md",".opencode/commands/deep/agent-improvement.md",".opencode/commands/deep/ai-system-improvement.md",".opencode/commands/deep/skill-benchmark.md",".claude/commands/deep/assets/deep_research_presentation.txt"],"findings":[]}
```
