READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all references. THIS iteration = FINAL boundary confirmation + dependency-ordered touch list + deletion-safety.

## shared current_focus — iteration 10 of 10 — closure
1. DELETION SAFETY: Is anything OUTSIDE cli-devin/ a symlink INTO cli-devin, or does any retained file `import`/`require`/`read` a `cli-devin/` path at RUNTIME (not just doc cross-links)? Grep retained code (*.ts, *.cjs, *.js, *.json, hook scripts) for `cli-devin/` path reads. Confirm the skill dir can be deleted once the mapped edits land. Specifically re-confirm: after re-homing context-budget.md, does anything still read `cli-devin/references/context-budget.md` or `cli-devin/assets/*` at runtime?
2. DEPENDENCY ORDERING: Which edits MUST happen BEFORE `rm -rf .opencode/skills/cli-devin/` to avoid a broken intermediate state? (e.g., CI scripts check-prompt-quality-card-sync.sh + the prompt_quality_card path; context-budget.md re-home; skill-graph.sqlite rebuild AFTER graph-metadata edits.) Order the phases.
3. FINAL TALLY: Do a fresh whole-repo grep `rg -l 'cli-devin|cli_devin' --glob '!**/cli-devin/**'` and a `rg -l '\bdevin\b|DEVIN_'` (excluding cli-devin/, changelog, specs, benchmark state) and reconcile against the mapped active-wiring set (iters 1-9). List any path that appears in grep but is NOT in the known set below — those are residual gaps.
4. Confirm the HISTORICAL set is correctly excluded (specs/**, changelog/**, benchmark state/eval) and note the count left intentionally untouched.

## known active-wiring set (iters 1-9) — reconcile against this
Runtime code: executor-config.ts, executor-audit.ts, fanout-run.cjs, dispatch-model.cjs, profile-validator.cjs, advisor-runtime-values.ts, hooks/devin/user-prompt-submit.ts(+dist), .devin/hooks.v1.json, run-deep-review-arc.sh, check-prompt-quality-card-sync.sh.
YAML/cmd: deep_start-research/review_auto + review_confirm + context_auto/confirm yamls; start-research/review/context/model-benchmark/agent-improvement-loop.md.
Registry/graph: sk-prompt-models (SKILL.md, model-profiles.json, graph-metadata.json, 5 model refs, _index, pattern-index, README, cli_prompt_quality_card.md); skill-advisor graph-metadata + 2 skill-graph.json + sqlite + SKILL.md + INSTALL_GUIDE + ARCHITECTURE + README + freshness_contract + skill_advisor_hook + runtime-parity test + playbook CL-006; sibling graph-metadata (cli-opencode/codex/claude-code/sk-prompt).
Docs: AGENTS.md, CLAUDE.md, README.md, .opencode/skills/README.md, deep-context(SKILL.md:391 + loop_protocol + quick_reference + cli-council-seats), cli-* sibling READMEs+SKILLs+refs, sk-prompt/README, system-spec-kit constitutional (cli-dispatch-skill-preload + post-implementation-deep-review) + shared_smart_router + memory_handback, scripts/README, deep-improvement (SKILL + feature_catalog + model-dispatcher + README + grader prompts), deep-loop-runtime fanout-run.md, context-budget.md sentinel + prompt_templates.
Structural decisions: swe-1.6 remove/retire; context-budget canonical re-home; deep-review successor executor.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"residual-gap|ordering|deletion-safety|tally", "kind":"gap|integration_point", "reuse":"remove|leave|order",
    "evidence":"path:line OR grep result", "relevance":0.0, "classification":"active-wiring|historical-record", "verified":true,
    "editType":"...", "notes":"residual gaps NOT in the known set; OR the phase ordering; OR deletion-safety verdict; OR final tally counts" } ] }
```
BINDING lines first (slice=closure). Tool budget ~10-12.
