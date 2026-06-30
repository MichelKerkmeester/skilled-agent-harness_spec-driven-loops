READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = the remaining cross-skill DOC references (deep-context skill internals, cli-* sibling skills, sk-prompt, system-spec-kit constitutional + shared cli refs, scripts READMEs).

## shared current_focus — iteration 8 of 10 — SLICE cluster 6: cross-skill docs + constitutional
Read + line-resolve every ACTIVE cli-devin site (skip benchmark state/*.jsonl + changelog/* = historical):
1. deep-context skill internals: `.opencode/skills/deep-context/SKILL.md` (Pairs-with), `references/protocol/loop_protocol.md`, `references/guides/quick_reference.md`, `feature_catalog/02--by-model-parallel-sweep/cli-council-seats.md`.
2. cli-* sibling skill docs: `.opencode/skills/cli-opencode/README.md`, `cli-opencode/references/context-budget.md` (12 hits — read, classify each: active cross-ref vs comparison-prose), `.opencode/skills/cli-codex/README.md`, `.opencode/skills/cli-claude-code/README.md`, `.opencode/skills/sk-prompt/README.md`.
3. system-spec-kit constitutional + shared cli refs: `.opencode/skills/system-spec-kit/constitutional/cli-dispatch-skill-preload.md`, `constitutional/post-implementation-deep-review.md` (6 hits), `references/cli/shared_smart_router.md`, `references/cli/memory_handback.md`.
4. scripts READMEs: `.opencode/scripts/README.md`, `.opencode/skills/sk-prompt-models/changelog/*` (classify: changelog=historical).
5. Grep the WHOLE `.opencode/skills/` for any remaining ACTIVE cli-devin doc site not yet mapped in iters 1-7 (exclude cli-devin/ own dir, **/changelog/**, **/benchmarks/**/state/**, **/specs/**).

## known-context
Iters 1-7 mapped: the skill dir, runtime code (executor-config/audit/fanout-run/dispatch-model/profile-validator), the 5 deep-loop YAMLs + command docs, sk-prompt-models cluster, skill-graph + advisor + CI scripts, agents (3 runtimes), governance docs. THIS iteration mops up the remaining doc-layer references. For cli-opencode/context-budget.md: distinguish active "see cli-devin for X" cross-refs (edit) from descriptive "unlike cli-devin" comparison prose (may keep but flag).

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"...", "kind":"integration_point|dependency|gap", "reuse":"remove|leave",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring|historical-record", "verified":true,
    "editType":"inline-edit|delete-paragraph|leave", "notes":"exact edit OR why-historical" } ] }
```
BINDING lines first (slice=cross-skill-docs). Tool budget ~10-12.
