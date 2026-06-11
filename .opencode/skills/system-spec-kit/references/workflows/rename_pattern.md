---
title: "Rename Pattern — mechanical refactor template for skill/agent identity changes"
description: Reusable mechanical pattern and checklist for repo-wide skill and agent identity rename refactors.
trigger_phrases:
  - "rename pattern checklist"
  - "mechanical rename refactor"
  - "skill identity rename"
  - "rename surface taxonomy"
importance_tier: normal
contextType: implementation
---

# Rename Pattern — mechanical refactor template

For any rename refactor that touches multiple surfaces (skill dir, agent files, sibling references, root docs, memory, compiled indexes), follow this pattern. First fully proven in `114-small-ai-model-optimization/007-sk-prompt-small-model-rename/` (2026-05-21).

---

## 1. OVERVIEW

### Purpose

Define the reusable workflow and checklist for mechanical rename refactors across skills, agents, docs, memory, indexes, and runtime mirrors.

### When to Use

Load this reference before a repo-wide rename that touches more than one live surface or when auditing whether historical surfaces should be preserved.

### Core Principle

Rename live truth, preserve historical provenance, and regenerate compiled indexes instead of hand-editing them.

---

## 2. SURFACE TAXONOMY

Every rename touches some subset of these categories. Map each before starting.

| Category | Examples | How to handle |
|---|---|---|
| **The thing being renamed** | `.opencode/skills/<old>/` dir or `.opencode/agents/<old>.md` | `git mv` (preserves history) |
| **Live cross-references** | Sibling skill `graph-metadata.json` `enhances`/`related_to`, command files, manual playbooks | Literal substitution |
| **Live runtime mirrors** | `.claude/agents/`, `.codex/agents/` + corresponding READMEs | `git mv` + literal substitution |
| **Live root behavioral docs** | `AGENTS.md`, `CLAUDE.md` (often symlinked), `README.md` | Literal substitution |
| **Live auto-memory** | `~/.claude/projects/.../memory/MEMORY.md` index + current-state memory files | Literal substitution; preserve filename slugs to avoid breaking inbound `[[wikilinks]]` |
| **Live compiled indexes** | `skill-graph.json`, SQLite caches | REGENERATE (never hand-edit) |
| **Historical narrative** | Memory feedback entries describing past incidents under the old name | Tag inline: `(renamed <new> YYYY-MM-DD)` — keep dates intact |
| **Historical spec docs** | Originating packet's `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` | PRESERVE — do not edit |
| **Historical research/review iterations** | Deep-research / deep-review `iterations/*.md`, `deltas/*.jsonl` | PRESERVE — do not edit |
| **Historical version notes** | Renamed skill's prior `changelog/v*.md` | PRESERVE — add a NEW `vN+1.0.0.md` as forward-link |
| **Frozen bench fixtures** | `benchmarks/.../per-probe.jsonl` recording prior-name state | PRESERVE |

**Rule of thumb**: If the surface describes work as it happened in the past, preserve. If the surface describes what is true NOW, update.

---

## 3. WORKFLOW

### Phase A — Pre-flight (sequential)
1. Capture a rg baseline: `rg -l "<old-name>" --hidden -g '!node_modules' -g '!.git/**' -g '!**/skill-graph*.sqlite*' > scratch/rg/rg-baseline-before-files.txt`
2. Classify every hit into live vs historical using the surface taxonomy above. Write `scratch/resource-map.md` + `scratch/rename-plan.json` (the contract — disjoint phase scopes).
3. Read the cli-X SKILL.md file before composing any cli-X dispatch (per AGENTS.md CLI dispatch rule).

### Phase B — Optional CLI verification
Dispatch 2-4 parallel read-only CLI jobs (e.g. cli-codex or cli-opencode) to verify the rename plan against each surface group. Read the chosen executor's SKILL.md before composing the dispatch (per AGENTS.md CLI dispatch rule). Apply bundle gate per [[feedback_bundle_gate_smoke_run]]. Aggregate verified bundles.

### Phase C — Execute renames (parallel-eligible across disjoint surface groups)
1. `git mv` dir/file renames (preserves rename history; `git log --follow` traces back).
2. Bulk literal substitution via `sed -i ''` (macOS) on the in-scope file list. Use `find -exec` for atomicity across many files.
3. Special-case the historical-narrative file with surgical edits (insert `(renamed <new> YYYY-MM-DD)` tag rather than rewriting).
4. Memory files: filename slugs are sticky (preserve `[[wikilinks]]`); only edit body content.

### Phase D — Reindex
1. Regenerate compiled `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` via `python3 skill_graph_compiler.py --export-json --pretty` (per [[feedback_skill_graph_compiler_rebuild]]).
2. If the compiler hits a pre-existing blocker (wrong category, asymmetric sibling, etc.), fix it incidentally — document as out-of-scope-but-on-critical-path.
3. Run `advisor_recommend` MCP smoke on a canonical prompt for the renamed thing; expect new name in top-3 confidence ≥ 0.7.

### Phase E — Validate
1. Post-edit `rg "<old-name>"` on the live-surface allow-list → expect 0 hits.
2. Post-edit `rg "<old-name>"` on the historical-surface allow-list → expect SAME count as baseline-before (provenance preserved).
3. `bash validate.sh --strict <spec-folder>` → exit 0.
4. Reconcile parent metadata via `generate-context.js` (refreshes `children_ids` + `derived.last_active_child_id`).

---

## 4. CASE-SENSITIVITY GOTCHA

Per [[feedback_rename_grep_case_insensitive]]: the final-gate grep MUST use `rg -il` (case-insensitive). UPPERCASE / Title-Case / underscore variants are easy to miss. Always also check for the underscore variant of any hyphenated identifier (e.g., `sk_small_model` next to `sk-small-model`) — Python pseudocode in SKILL.md examples often uses underscores.

---

## 5. BRANCH POLICY

Per [[feedback_stay_on_main_no_feature_branches]] — stay on `main`. `create.sh` auto-branches; switch back to `main` and delete the auto-created branch (carry uncommitted changes; cherry-pick any orphan continuity commits first).

Rename refactors are reversible via `git revert` since `git mv` history is preserved. No need to feature-branch.

---

## 6. PER-PHASE-CHILD SCOPE DISCIPLINE

When the rename arc is a phase-parent with multiple children:
- Each phase child's `spec.md` §3 In Scope + Out of Scope is the conflict-prevention contract.
- The rename-plan.json from preflight enforces disjoint file scopes across phase children.
- Phases that touch disjoint file sets can be executed in parallel by separate operators.

---

## 7. ANTI-PATTERNS TO AVOID

| Anti-pattern | Why it's wrong | Do this instead |
|---|---|---|
| Hand-editing compiled `skill-graph.json` | Compiled artifact gets overwritten next compile | Regenerate via `skill_graph_compiler.py` |
| Renaming auto-memory file slugs | Breaks inbound `[[wikilinks]]` in MEMORY.md and other memory files | Preserve slug; edit body content only |
| Rewriting historical narrative to use new name | Falsifies past-tense provenance | Insert `(renamed <new> YYYY-MM-DD)` tag |
| Editing the renamed skill's own `changelog/v1+v2*.md` | Historical version state | Add NEW `vN+1.0.0.md` as forward-link |
| Creating a feature branch | Out of policy ([[feedback_stay_on_main_no_feature_branches]]) | Stay on `main`; `git revert` is the rollback path |
| Forgetting case variants | Misses `sk_small_model` (underscore), `Sk-Small-Model` (title), `SK-SMALL-MODEL` (banner) | Use `rg -il` and dedicated 2nd sed pass for underscore identifiers |

---

## 8. WORKED EXAMPLE — 114/007

See `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename/` for the full applied pattern:
- spec.md §3 In Scope / Out of Scope is the model classifier
- plan.md §4 IMPLEMENTATION PHASES (A through G) is the workflow timeline
- implementation-summary.md §What Was Built lists the actual surface counts (22 live files, 5 dir/file renames, 1 new changelog)
- review-report.md (deep-review 9-iter PASS+advisories) verifies the pattern's correctness

---

## 9. CHECKLIST (copy into spec packet)

- [ ] rg baseline captured to `scratch/rg/rg-baseline-before-files.txt`
- [ ] Per-file live/historical classification written to `scratch/resource-map.md`
- [ ] Disjoint phase scopes in `scratch/rename-plan.json` (jq intersection check = empty)
- [ ] cli-X SKILL.md read before composing any cli-X dispatch
- [ ] All `git mv` renames execute cleanly
- [ ] `sed -i ''` bulk pass (hyphenated form)
- [ ] Second sed pass for underscore variants (where applicable)
- [ ] Auto-memory filename slugs preserved; only body content edited
- [ ] Historical-narrative files tagged inline, not rewritten
- [ ] New `vN+1.0.0.md` changelog created on the renamed skill
- [ ] Compiled `skill-graph.json` regenerated via `skill_graph_compiler.py`
- [ ] `advisor_recommend` smoke confirms new name surfaces ≥ 0.7
- [ ] Live-surface rg returns 0 hits
- [ ] Historical-surface rg returns SAME count as baseline-before
- [ ] `validate.sh --strict <spec-folder>` exit 0
- [ ] Parent metadata reconciled via `generate-context.js`
- [ ] Packet-local changelog generated via `nested-changelog.js`
- [ ] `git log --follow` traces renamed file back to original
