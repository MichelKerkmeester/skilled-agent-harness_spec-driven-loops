# RCAF DEEP REVIEW — ITERATION 6 — consumer cutover deep-dive

## ROLE
Expert reviewer. Concise findings, file:line evidence.

## CONTEXT
Iter 6 of 10. Cumulative F-001..F-025. Status: 0 P0 / 12 P1 / 11 P2. Iter-5 convergence signal (1 finding) — close to STOP threshold. Continue per user direction.

## ACTION

**Focus**: deep audit of consumer-side cutover post-118.

**Step 1: deep-review SKILL.md depth check**
- Read `.opencode/skills/deep-review/SKILL.md` (v1.4.0.0).
- Verify frontmatter version is 1.4.0.0
- Verify the body content references deep-loop-runtime (not system-spec-kit) where applicable
- Verify any §Architecture, §How It Works, §References sections cite the new runtime paths
- Verify trigger_phrases haven't drifted
Cite file:line. P1 for stale paths; P2 for stylistic.

**Step 2: deep-research SKILL.md check**
- Read `.opencode/skills/deep-research/SKILL.md`. Does it reference the deep-loop runtime correctly post-118? Or did the arc miss updating deep-research?
- Check `.opencode/skills/deep-research/changelog/` — is there a corresponding v entry for the dependency switch?
Cite file:line. P1 for missing updates; P2 for stylistic.

**Step 3: Workflow YAML deep-dive (every call site)**
Re-read all 4 YAMLs:
- `spec_kit_deep-review_auto.yaml` + `_confirm.yaml`
- `spec_kit_deep-research_auto.yaml` + `_confirm.yaml`

For EACH `bash: 'node .../deep-loop-runtime/scripts/<X>.cjs ...'` invocation:
- Are CLI args complete + correctly named?
- Does it pass valid YAML interpolation tokens?
- Does the surrounding `outputs:` block declare the right names?
- Any drift between similar invocations across the 4 files?

For any non-deep-loop tooling that the YAML still calls (e.g. `mcp__cocoindex_code__search`, `mcp__mk_spec_memory__memory_*`): does the YAML correctly handle the fact that 4 deep_loop_graph_* tools were REMOVED while these other tools still exist?

Cite file:line. P0 for broken YAML / wrong tool names; P1 for arg mismatch; P2 for inconsistency across files.

**Step 4: /doctor route manifest verification**
- Read `.opencode/commands/doctor.md` + `.opencode/commands/doctor/_routes.yaml` + `.opencode/commands/doctor/update.md`
- Verify all `deep_loop_graph_*` mcp tool refs were swapped to script invocations
- Verify the route manifest classification (`read-only` / `add-only` / `mutates`) is correct for the deep-loop routes post-update
Cite file:line. P1 for breakage; P2 for stylistic.

**Step 5: system-code-graph supersession block**
- Re-read `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` (the prior commit added supersession notes for the 4 deep_loop_graph_* features).
- Verify the supersession block is structurally correct + factually accurate
- Verify the 4 feature entries still have their full description but with the "now in deep-loop-runtime/scripts/" note prominent
Cite file:line. P2 for any drift.

**Step 6: Write findings (F-026+) + delta JSONL**

`.opencode/specs/.../review/iterations/iteration-006.md` + `.../review/deltas/iter-006.jsonl`. Same structure as prior iters.

After writing both, print:
`ITER-6 DONE: <P0>/<P1>/<P2>, dimensions=consumer-cutover`
