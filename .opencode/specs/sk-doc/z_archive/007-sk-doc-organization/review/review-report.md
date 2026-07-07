# Deep Review Report: 068-sk-doc-organization

**Review packet**: `.opencode/specs/skilled-agent-orchestration/z_archive/054-sk-doc-organization/review/`
**Iterations run**: 7 of 7 (hard cap)
**Convergence streak (consecutive iterations with 0 new in-scope P0/P1)**: 3 (iter 5, 6, 7)
**Executor**: cli-copilot (`claude-opus-4.7`) — fallback from cli-codex which stalled 3× in this session
**Date**: 2026-05-05

---

## 1. Verdict

**CONDITIONAL → REMEDIATE_AND_SHIP**

Score: 1 P0 = 0, 1 P1 = 1, P2 in-scope = 2, P2 OOS = 1. Per strategy recommendation logic, 1 P1 finding warrants a remediation phase before marking the packet final.

---

## 2. Iteration Summary

| Iter | Focus | Verdict | New P0/P1/P2 | Notes |
|------|-------|---------|--------------|-------|
| 1 | Phase 1 relocations + Phase 2 canonical substring coverage | PASS | 0/0/0 | All 4 git mv operations correct; agents/ rmdir confirmed; substitution coverage 100% on 24 canonical files; rename detection preserved |
| 2 | Cross-runtime mirror parity + TOML structural integrity | PASS | 0/0/0 | Symlinks confirmed (.claude/commands ↔ .opencode/command, .codex/prompts ↔ .opencode/command); 5 .toml files parse via tomllib; agent byte-identity holds |
| 3 | Spec folder structural soundness + path-reference completeness | CONDITIONAL | 0/1/1 | validate.sh --strict PASS; lean trio at parent; **P1-003-A: broken `../agents/command_template.md` link in frontmatter_templates.md:770** (relative-path Phase-2 sweep miss); P2-003-A: illustrative examples in skill template |
| 4 | Documentation alignment + functional regression risk | CONDITIONAL | 0/1/0 | YAML execution paths resolve cleanly; **iter4-F1: quick_reference.md:174-188 tree diagram still depicts pre-reorg layout** (filed as P1 by iter4; reclassified P2 by iter7 Skeptic — doc-only, not runtime-breaking) |
| 5 | Git history integrity + out-of-scope respect | PASS | 0/0/0 | 4 commits on main lineage; rename detection preserved; out-of-scope folders (barter/, z_archive/, specs/iterations|logs|research|review/, dist/, observability/, .tmp/, changelog/v[0-9]*.md) untouched |
| 6 | Hunter (adversarial — what's missing?) | PASS | 0/0/1 | 9 adversarial vectors run; zero new in-scope findings beyond known P1-003-A; P2-006-A filed as OOS-locked router-measurement JSONL |
| 7 | Skeptic (cross-reference claim verification) | PASS | 0/0/0 | All implementation-summary claims verified against disk; symlink discovery confirmed; 3 random absolute paths resolve; convergence streak 3 |

---

## 3. Cumulative Findings

### P0 — Blockers
None.

### P1 — Required (need fix before ship)

**P1-003-A: Broken cross-link in `frontmatter_templates.md`**
- File: `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md:770`
- Current: `- [command_template.md](../agents/command_template.md) - Command file templates`
- Resolves to: `.opencode/skills/sk-doc/assets/agents/command_template.md` (does not exist; agents/ rmdir'd in Phase 1)
- Fix: change `(../agents/command_template.md)` to `(../command_template.md)`
- Root cause: Phase 2 substring sweep used pattern `assets/agents/command_template`, but the relative-path link uses `../agents/command_template` (no `assets/` prefix). The sed pattern only matched the prefixed form.
- Dimension: traceability + correctness (broken doc reference)

### P2 — Suggestion (in-scope, optional)

**iter4-F1 (reclassified P2 by Skeptic): quick_reference.md outdated tree diagram**
- File: `.opencode/skills/sk-doc/references/global/quick_reference.md:174-188`
- Issue: project-structure tree depicts `assets/documentation/feature_catalog/`, `assets/documentation/testing_playbook/`, and `assets/agents/{agent_template.md,command_template.md}` (pre-reorg layout)
- Fix: rewrite tree to show `feature_catalog/` and `testing_playbook/` at `assets/` root and `agent_template.md` + `command_template.md` at `assets/` root, with no `assets/agents/` directory
- Root cause: structured tree diagrams are not amenable to substring substitution; Phase 2's sed pass cannot rewrite ASCII trees
- Dimension: maintainability (doc accuracy)

**P2-003-A: Illustrative `assets/agents/` examples in skill creation guidance**
- Files:
  - `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
  - `.opencode/skills/sk-doc/references/specific/skill_creation.md`
- Issue: example/template listings of common `assets/<category>/` subdirs include `assets/agents/`. Not broken refs (don't resolve to a path), but post-reorg sk-doc itself no longer uses an `assets/agents/` subdir, so the example is inconsistent with current layout
- Fix: replace `assets/agents/` example with another generic category name OR update to mention `agent_template.md` at root
- Dimension: maintainability (cosmetic doc consistency)

### P2 — Out of Scope (locked, no action)

**P2-006-A: Stale path strings in router-measurement JSONL**
- File: `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl:57,182`
- Issue: captured `predictedRoute` payloads still reference `assets/documentation/testing_playbook/...` from pre-relocation runs
- Status: explicitly out-of-scope per strategy ("Build artifacts (.tmp/, dist/, observability/*.jsonl)")
- Reason: historical experimental records, not a runtime regression; no consumer reads filesystem paths from these JSONL records
- Action: none for this packet; will naturally refresh when smart-router measurement is re-run

---

## 4. Convergence Analysis

**Strategy threshold**: 2 consecutive iterations with 0 new in-scope P0/P1 findings.
**Actual streak**: 3 (iter 5, 6, 7) — exceeded.
**newFindingsRatio (severity-weighted, iter 7)**: 0.00 vs. threshold 0.10.

Hunter pass (iter 6) ran 9 distinct adversarial scans (relative paths, absolute paths, no-prefix tokens, JSON/YAML keys, dynamic script construction, alternate asset subdirs, cross-runtime mirrors, agent files across all 4 runtimes, JSON config) and found no new in-scope findings beyond P1-003-A.

Skeptic pass (iter 7) cross-verified every claim in 001/002/003 implementation-summaries against disk reality. All claims hold; symlink discovery confirmed; 3 random absolute paths resolve; graph-metadata `derived.status="complete"` matches actual on parent + 3 children.

Convergence is robust.

---

## 5. Recommendation

**REMEDIATE_AND_SHIP** via 068/004-remediation phase.

### 004-remediation scope

P0 (must-fix):
- (none)

P1 (fix in 004):
- Fix P1-003-A: change `frontmatter_templates.md:770` link from `../agents/command_template.md` to `../command_template.md`

P2 (bundle in 004 if low effort):
- Fix iter4-F1 (P2): rewrite `quick_reference.md:174-188` tree diagram to show new flat layout
- Fix P2-003-A: update illustrative examples in `skill_md_template.md` and `skill_creation.md` to remove stale `assets/agents/` reference

### 004 acceptance criteria

- [ ] P1-003-A fixed (link resolves to existing file)
- [ ] iter4-F1 P2 fixed (tree diagram matches `ls .opencode/skills/sk-doc/assets/`)
- [ ] P2-003-A fixed (illustrative examples updated)
- [ ] validate.sh --strict on parent 068 still exits 0
- [ ] One commit on main: `feat(sk-doc): remediate review findings (068/004)`
- [ ] After 004 ships: 068 packet marked final

---

## 6. Executor Notes

**cli-codex stalled 3× in this session** (zero output, zero file writes after 5+ min wait each time, both with and without `--sandbox workspace-write`). Fallback to cli-copilot (`claude-opus-4.7`) per memory rule "cli-codex primary + cli-copilot fallback" worked reliably for all 7 iterations (60-90s response per iteration).

**Concurrency cap respected**: 3 parallel cli-copilot dispatches max (per memory "Copilot CLI max 3 concurrent dispatches"). Iter 1+2+3 in parallel, iter 4+5+6 in parallel, iter 7 alone.

**Per-iteration delta JSONL** at `deltas/iter-NNN.jsonl` avoids shared-write races across parallel iterations.

---

## 7. Files

- **Strategy**: `review/deep-review-strategy.md`
- **Config**: `review/deep-review-config.json`
- **State log**: `review/deep-review-state.jsonl`
- **Iterations**: `review/iterations/iteration-{001..007}.md`
- **Deltas**: `review/deltas/iter-{001..007}.jsonl`
- **This report**: `review/review-report.md`

Next: scaffold `068/004-remediation/` and execute fix.
