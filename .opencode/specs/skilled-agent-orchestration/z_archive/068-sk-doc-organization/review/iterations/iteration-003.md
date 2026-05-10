# Iteration 003 — Spec Structural Soundness + Path-Reference Completeness

- **Date:** 2026-05-05
- **Executor:** cli-copilot / claude-opus-4.7
- **Focus:** Dimension 5 (spec folder structural soundness) + Dimension 6 (path-reference completeness)
- **Mode:** READ-ONLY

## Evidence

### 1. Parent folder layout (lean trio + 3 children)
```
ls .opencode/specs/skilled-agent-orchestration/068-sk-doc-organization/
→ 001-relocate/  002-update-and-mirror/  003-verify-and-ship/
  description.json  graph-metadata.json  spec.md  review/
```
Lean trio present. ✓

### 2. Each child has all 6 Level-1 files
All three children: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` → **OK** (18/18). ✓

### 3. `validate.sh --strict` on parent 068
```
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
Phase-parent lean template shape accepted; frontmatter, anchors, sufficiency, graph-metadata all green. ✓

### 4. Phase parent forbidden heavy docs
None of `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` exist at the parent. ✓

### 5. `graph-metadata.json` linkage
Parent `children_ids` = `["001-relocate","002-update-and-mirror","003-verify-and-ship"]`; each child's `parent_id` = `"068-sk-doc-organization"`. Bidirectional linkage clean. ✓

### 6. Status fields
Parent `derived.status = complete`; all three children `derived.status = complete`. ✓

### 7. Path-reference sweep (relocated folders) — active scope
Targeted regex `assets/(documentation/(feature_catalog|testing_playbook)|agents/(agent|command)_template)` against `.opencode .claude .codex .gemini` (excluding specs, archives, dist, observability, tmp, barter, changelog history, node_modules):
**ZERO hits.** ✓

### 8. Broader sweep (sk-doc only, excluding changelog)
- `rg "agents/(agent|command)_template" .opencode/skills/sk-doc/` ⇒ **1 active hit:**
  - `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md:770` →
    `- [command_template.md](../agents/command_template.md) - Command file templates`
  - Resolved path `assets/agents/command_template.md` does **not exist** (Phase 1 `git rm -r assets/agents/`); current location is `assets/command_template.md`.
- `rg "assets/agents/" .opencode/skills/sk-doc/` ⇒ 2 hits, both **illustrative examples** in skill-creation guidance (`assets/skill/skill_md_template.md`, `references/specific/skill_creation.md`) — they describe a generic `assets/<category>/` convention for arbitrary skills, not references to the relocated files. Not broken refs.

### 9. Scripts hits (`assets` token in `sk-doc/scripts/`)
All hits are generic scaffolding (`init_skill.py`, `package_skill.py`, `extract_structure.py`, `validate_document.py`). The only resolved path used at runtime is `assets/template_rules.json`, which still exists. No regressions. ✓

## Findings

### P0 — None

### P1 — 1 finding (NEW)

**P1-003-A: Broken cross-link in `frontmatter_templates.md` to relocated agent template**
- File: `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md:770`
- Current: `- [command_template.md](../agents/command_template.md) - Command file templates`
- Resolves to: `.opencode/skills/sk-doc/assets/agents/command_template.md` (does not exist; `assets/agents/` rmdir'd in Phase 1)
- Correct path post-reorg: `../command_template.md` (now at `assets/command_template.md`)
- Dimension: traceability + correctness
- Impact: in-skill doc cross-link is dead; readers following the link from frontmatter guidance get a 404. Not runtime-breaking (no script consumes this link), but it is a real broken reference inside active documentation that escaped Phase 2's substring substitution sweep — pattern `agents/command_template` was apparently not in the substitution set, or the file was filtered out.
- Suggested fix: rewrite link to `../command_template.md` (and audit for an analogous missing `agent_template.md` link if intended).

### P2 — 1 finding (NEW, advisory)

**P2-003-A: Illustrative `assets/agents/` examples may mislead skill authors**
- Files: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`, `.opencode/skills/sk-doc/references/specific/skill_creation.md`
- These are template/example listings of common `assets/<category>/` subdirs. They are not broken refs (they don't resolve to a path), but post-reorg sk-doc itself no longer uses an `assets/agents/` subdir, so the example is now inconsistent with sk-doc's own layout. Cosmetic — fix opportunistically.

## Verdict
**CONDITIONAL — 1 P1 broken link surfaced.** Spec folder structural soundness is fully clean (validate strict PASS, lean trio, linkage, status); however path-reference completeness for the active scope reveals one genuine broken doc cross-link that the Phase 2 substring sweep missed. Recommend remediation in a small follow-up commit (single-line edit) or fold into a `004-remediation/` phase per strategy.

## Convergence Signal
- New P0: 0
- New P1: 1
- New P2: 1
- This is the first iteration to file a non-zero P1; convergence streak (consecutive iterations with 0 new P0/P1) **resets to 0**. Continue to iteration 4.
