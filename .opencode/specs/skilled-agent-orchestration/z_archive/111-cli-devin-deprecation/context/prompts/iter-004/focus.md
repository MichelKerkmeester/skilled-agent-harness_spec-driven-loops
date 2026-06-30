READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = the `sk-prompt-models` cluster (the model-routing registry that names cli-devin most) AND resolve the CRITICAL swe-1.6 question.

## shared current_focus — iteration 4 of 10 — SLICE cluster 2: sk-prompt-models registry + swe-1.6 decision
1. `.opencode/skills/sk-prompt-models/assets/model-profiles.json` — for EACH model (swe-1.6, deepseek-v4-pro, kimi-k2.6, glm-5.1) list the `executors[]` entries; identify which have a `cli-opencode` (or any non-cli-devin) executor path and which are cli-devin-ONLY. Give exact line numbers per executor object.
2. `.opencode/skills/sk-prompt-models/SKILL.md` — every cli-devin site (description, when-to-use, dispatch matrix, ownership/boundary map, NEVER rules, Related Resources links to cli-devin/assets|references). Exact lines + edit per site.
3. `.opencode/skills/sk-prompt-models/graph-metadata.json` — edges.enhances/related_to entries targeting cli-devin + causal_summary.
4. `.opencode/skills/sk-prompt-models/references/models/{swe-1.6,deepseek-v4-pro,kimi-k2.6,glm-5.1,_index}.md` + `pattern-index.md` — cli-devin executor refs + dead cross-links to cli-devin/.
5. `.opencode/skills/sk-prompt-models/README.md` — cli-devin mentions.

## THE CRITICAL QUESTION (answer explicitly as a `gap` finding)
Is `swe-1.6` reachable via ANY executor other than cli-devin? Grep the WHOLE repo for `swe-1.6` provider/executor wiring (model-profiles.json, any opencode-go / provider config, .utcp_config, opencode.json). Conclude with evidence: (a) swe-1.6 is cli-devin-EXCLUSIVE → recommend remove-entirely-or-mark-retired; or (b) swe-1.6 has another path → only remove the cli-devin executor row. State which, with the deciding evidence line(s).

## known-context
Iter1: model-profiles.json cli-devin executors at ~12 (swe-1.6, cognition-free), 58 (deepseek-v4-pro, cognition-pro), 118 (kimi-k2.6), 217 (glm-5.1). deepseek/kimi/glm believed to retain cli-opencode (opencode-go) paths; swe-1.6 believed cognition-exclusive. VERIFY all four precisely.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"...", "kind":"integration_point|dependency|gap", "reuse":"remove|leave|decision",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring", "verified":true,
    "editType":"delete-map-entry|delete-paragraph|inline-edit|decision",
    "notes":"exact edit OR (for the swe-1.6 gap) the remove-vs-retire recommendation with deciding evidence" } ] }
```
BINDING lines first (slice=sk-prompt-models). Tool budget ~10-12.
