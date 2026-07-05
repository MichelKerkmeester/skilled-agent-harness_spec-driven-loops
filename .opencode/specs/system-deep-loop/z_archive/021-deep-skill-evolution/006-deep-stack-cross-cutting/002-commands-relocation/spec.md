---
title: "Feature Specification: 131/007 — Deep-* Commands Relocation"
description: "Level 3 spec for relocating deep-* command assets and updating cross-runtime references to the deep:* command family."
trigger_phrases:
  - "deep commands relocation"
  - "deep:review assets"
  - "deep:research assets"
  - "deep:ai-council assets"
  - "spec_kit deep-* migration"
  - "131/007"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-commands-relocation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Scaffolded Level 3 packet with all 6 spec docs, metadata, and parent updates."
    next_safe_action: "Proceed to WAVE 1: asset relocation."
---
# Feature Specification: 131/007 — Deep-* Commands Relocation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The 3 deep-* slash-command MD files (`deep:review`, `deep:research`, `deep:ai-council`) already relocated to `.opencode/commands/deep/` and are live skill names in the registry. However, 6 workflow asset YAMLs, 2 Gemini TOML wrappers, and ~25 live operator-facing references still use the old `/speckit:deep-*` slash syntax or `spec_kit/assets/spec_kit_deep-*` asset paths. Additionally, ~5,267 historical spec-doc references need updating.

This packet documents the 6-wave relocation: scaffold (WAVE 0), asset moves (WAVE 1), live reference updates (WAVE 2), graph/advisor/vitest recompile (WAVE 3), historical bulk-sed (WAVE 4), and closure (WAVE 5).

**Key Decision**: ADR-001 mandates co-locating assets alongside their commands under `commands/deep/assets/` using skill-consistent naming (`deep_ai-council_*` matching the `deep:ai-council` skill name) rather than the legacy `spec_kit_deep-council_*` form.

**Critical Dependencies**: WAVE 3 depends on WAVE 1+2 completing cleanly. WAVE 4 is optional but user-confirmed in scope. Executor: cli-opencode + `deepseek/deepseek-v4-pro --variant high --pure --format json` with sequential dispatch per cli-* memory rule.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Active |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../../spec.md` |
| **Phase** | 7 of 7 |
| **Predecessor** | `../006-deep-skills-differentiation/001-unique-value-differentiation/spec.md` |
| **Successor** | None planned |
| **Estimated LOC** | ~0 (refactor-only; no new code) |
| **Executor** | cli-opencode + `deepseek/deepseek-v4-pro --variant high --pure --format json` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 3 deep-* slash-command MD files moved to `.opencode/commands/deep/` and are registered as live skill names (`deep:review`, `deep:research`, `deep:ai-council`). But the asset ecosystem still points to the old `spec_kit/` namespace:

1. **6 workflow YAMLs** still at `.opencode/commands/speckit/assets/speckit_deep-{review,research,council}_{auto,confirm}.yaml` (~440 KB total). The 3 command MD files still load these from the old path.
2. **2 Gemini TOMLs** still at `.gemini/commands/speckit/deep-{review,research}.toml`. No `ai-council.toml` exists at either location.
3. **~25 live references** across SKILL.md files, `skill_advisor.py` routing tables, agent definitions (4 runtimes), root docs (CLAUDE.md, AGENTS.md, README.md), install guides, and 9 `graph-metadata.json` files still use `/speckit:deep-*` slash syntax or `spec_kit/assets/spec_kit_deep-*` paths.
4. **~5,267 historical spec-doc references** across `.opencode/specs/` and `.opencode/skills/` changelogs/playbooks carry old paths and slash syntax.

### Purpose

Complete the relocation: move workflow assets to co-located `commands/deep/assets/`, migrate Gemini TOML wrappers, update all live operator-facing references to the new paths and slash syntax, recompile the skill-graph, run vitest smoke, and (optionally) mass-sed historical spec-doc references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (6 Waves)

| Wave | Label | Description |
|------|-------|-------------|
| WAVE 0 | Scaffold | Create 131/007 Level 3 packet (this folder). |
| WAVE 1 | Asset Relocation | Move 6 YAMLs to `commands/deep/assets/`; rename to `deep_*` slug; update 3 command MD internal asset-path blocks; migrate 2 Gemini TOMLs + author new `ai-council.toml`. |
| WAVE 2 | Live Reference Updates | Update ~25 files: 3 SKILL.md, `skill_advisor.py` routing + trigger phrases, 12 agent definitions (4 runtimes × 3 skills), 3 root docs, 2 install guides, 9 `graph-metadata.json`. |
| WAVE 3 | Recompile + Smoke | `skill_graph_compiler.py`, advisor smoke tests (3 prompts), vitest sweep (4 suites). |
| WAVE 4 | Historical Bulk-Sed | Mass sed ~5,267 spec docs + ~800 doc-narrative refs. Optional but user-confirmed. |
| WAVE 5 | Closure | Fill `implementation-summary.md`, strict-validate, update parent `graph-metadata.json`. |

### Out of Scope

- Touching non-deep `commands/speckit/` workflows (`complete`, `plan`, `implement`, `resume`) — they stay.
- Renaming the `116-deep-skill-evolution` packet itself.
- Renaming `deep:start-agent-improvement-loop` (lives at `.opencode/commands/deep/`, unaffected).
- Modifying deep-* skill source code (code-level logic stays unchanged).
- Any `.codex/commands/` edits (symlink to `.opencode/commands/`, auto-resolves).

### Files to Change (cumulative, waves 1-4)

| File Path | Wave | Change Type | Description |
|-----------|------|-------------|-------------|
| `.opencode/commands/speckit/assets/speckit_deep-{review,research,council}_{auto,confirm}.yaml` × 6 | 1 | Move + Rename | → `.opencode/commands/deep/assets/deep_{review,research,ai-council}_{auto,confirm}.yaml` |
| `.opencode/commands/deep/{review,research,ai-council}.md` × 3 | 1 | Modify | Update internal asset-path load blocks |
| `.gemini/commands/speckit/deep-{review,research}.toml` × 2 | 1 | Move | → `.gemini/commands/deep/{review,research}.toml` |
| `.gemini/commands/deep/ai-council.toml` × 1 | 1 | Create | New Gemini TOML for ai-council |
| `.opencode/skills/deep-{review,research,ai-council}/SKILL.md` × 3 | 2 | Modify | Update asset path + slash syntax refs |
| `.opencode/skills/system-skill-advisor/.../skill_advisor.py` × 1 | 2 | Modify | Routing tables + trigger-phrase scoring |
| `.opencode/agents/{ai-council,deep-research,deep-review}.md` × 3 | 2 | Modify | Update slash syntax |
| `.claude/agents/{ai-council,deep-research,deep-review}.md` × 3 | 2 | Modify | Update slash syntax |
| `.codex/agents/{ai-council,deep-research,deep-review}.toml` × 3 | 2 | Modify | Update slash syntax |
| `.gemini/agents/{ai-council,deep-research,deep-review}.md` × 3 | 2 | Modify | Update slash syntax |
| `CLAUDE.md`, `AGENTS.md`, `README.md` × 3 | 2 | Modify | Update slash syntax |
| `.opencode/install_guides/*.md` × 2 | 2 | Modify | Update slash syntax |
| 9 `graph-metadata.json` files | 2 | Modify | Update skill edges + asset_path arrays |
| ~5,267 `.opencode/specs/**/*.md` | 4 | sed | Historical reference update |
| ~800 `.opencode/skills/**/*.md` | 4 | sed | Changelog/playbook/fc reference update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 6 YAML assets co-located with commands at `commands/deep/assets/`, named with `deep_` slug matching skill names | `ls .opencode/commands/deep/assets/` shows exactly 6 `deep_*.yaml` files; `ls .opencode/commands/speckit/assets/speckit_deep-*` returns 0 hits. |
| REQ-002 | 3 command MD files reference new asset paths | `rg "spec_kit/assets/" .opencode/commands/deep/` returns 0 hits. |
| REQ-003 | 2 Gemini TOMLs migrated + 1 authored at `.gemini/commands/deep/` | `ls .gemini/commands/deep/{review,research,ai-council}.toml` all exist. |
| REQ-004 | ~25 live operator-facing references updated to new paths and `/deep:*` slash syntax | `rg "/speckit:deep-(review\|research\|council\|ai-council)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/ CLAUDE.md AGENTS.md README.md` returns 0 hits. |
| REQ-005 | Skill-graph recompiles cleanly; advisor surfaces correct skills; vitest sweep 100% PASS | `skill_graph_compiler.py` exits 0; 3 smoke prompts return correct skill; vitest sweep passes all 4 suites. |
| REQ-006 | Historical spec-doc references bulk-sed'd with ≤ 10 residual edge cases | `rg "/speckit:deep-(review\|research\|council)\|spec_kit_deep-" .opencode/ --type-add 'docs:*.md' --type docs \| grep -v "z_archive\|changelog/v[01]" \| wc -l` returns ≤ 10. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Verification |
|----|-----------|--------------|
| SC-001 | File-system state clean: assets at new paths, old paths empty | `ls` + `rg` checks per REQ-001 through REQ-003 |
| SC-002 | Reference cleanliness: 0 live old-path refs in operator-facing surfaces | `rg` checks per REQ-004 |
| SC-003 | Runtime smoke: skill-graph compiles, advisor resolves, vitest passes | WAVE 3 verification gate |
| SC-004 | Spec validation: strict-validate PASS on 131/007 | `bash validate.sh .../007-deep-commands-relocation --strict` exits 0 with 0 errors + 0 warnings |
| SC-005 | No scope creep: git diff shows only expected file paths | `git diff --stat` per-wave review |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DeepSeek-v4-pro context budget on WAVE 2 (25-file edit) | H | Split into 2 sub-batches: skills+advisor first, then agents+root-docs. Sequential per cli-* memory rule. |
| Risk | `skill_advisor.py` trigger-phrase semantic edit (~340 lines of scoring) | M | Use semantic-review pass via Edit tool, NOT bulk sed. Preserve unrelated trigger phrases. |
| Risk | Gemini TOML format differs from `.md` command format | M | Use existing `.gemini/commands/speckit/deep-review.toml` as template; explicit TOML-preserves-frontmatter reminder in dispatch prompt. |
| Dependency | WAVE 3 depends on WAVE 1-2 file-system state | H | Gate WAVE 3 on `ls` + `rg` checks passing before dispatch. |
| Dependency | `.codex/commands/` is symlink to `.opencode/commands/` | L | Edits flow through `.opencode/`; no separate `.codex/` path edits needed. |
| Dependency | `.claude/commands/deep/` mirrors `.opencode/commands/deep/` via symlinks | L | Verify symlinks auto-resolve after WAVE 1; re-create if broken. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | Wall-clock time ≤ 90 minutes for all 6 waves | WAVE 0 (5 min), WAVE 1 (15 min), WAVE 2 (20 min), WAVE 3 (10 min), WAVE 4 (20 min), WAVE 5 (5 min) = ~75 min nominal |
| NFR-R01 | Sequential cli-opencode dispatch discipline | ONE cli-* dispatch at a time across the cli-* family; main agent commits per wave |
| NFR-T01 | Vitest 100% PASS after WAVE 3 | All 4 test suites pass with 0 failures |
| NFR-R02 | No runtime regression | All existing deep-* workflows (`/deep:start-review-loop`, `/deep:start-research-loop`, `/deep:ask-ai-council`) continue to execute after WAVE 1-3 |
| NFR-R03 | Symlink integrity preserved | `.codex/commands/` → `.opencode/commands/` and `.claude/commands/deep/` mirrors remain functional |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Codex symlink to `.opencode/commands/`**: Do not edit `.codex/commands/` directly — edits flow through `.opencode/`. The symlink auto-resolves.
- **`.claude/commands/deep/` already mirrors**: May be folder of symlinks; verify they resolve correctly to new `commands/deep/assets/` after WAVE 1.
- **Gemini `ai-council.toml` missing entirely**: Need to author from scratch using existing `deep-review.toml` as template; not a simple move.
- **`skill_advisor.py` has ~340 lines of trigger-phrase scoring**: Bulk sed risks breaking unrelated phrases. Semantic review via Edit tool required.
- **WAVE 4 bulk-sed collision risk**: Apply sed patterns in order: `spec_kit_deep-council_` first (most specific), then `spec_kit_deep-review_`, then `spec_kit_deep-research_`, then path-prefix, then slash-syntax. Exclude `.git/`, `z_archive/`, and pre-v1 changelogs.
- **Asset naming convention decision**: `deep_ai-council_*` (skill-name consistent) vs `deep_council_*` (shorter). ADR-001 resolves to the former for sibling consistency with `deep:ai-council` skill name.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | 6 YAML moves, ~25 live ref updates, ~5,267 historical sed, graph recompile, vitest sweep |
| Risk | 14/25 | Context budget risk on WAVE 2, semantic-editor risk on skill_advisor.py |
| Research | 8/20 | Explore reports already produced; architecture is known |
| Multi-Agent | 14/15 | 4 CLI runtimes (opencode, claude, codex, gemini) + 5 skills + skill-graph + advisor |
| Coordination | 17/15 | 6 sequential waves; single-executor dispatch discipline; gate checks per wave |
| **Total** | **65/100** | **Level 3 warranted.** Routine refactor with multi-runtime sync complexity. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | DeepSeek-v4-pro context budget exhausted on WAVE 2 (25 files) | H | M | Split WAVE 2 into 2 sub-batches; sequential dispatch; fallback to cli-devin SWE-1.6 for tight-context micro-batches |
| R-002 | `skill_advisor.py` trigger-phrase edit breaks unrelated routing | M | M | Semantic-review via Edit tool with surrounding-context uniqueness checks; verify with `skill_advisor.py` smoke after WAVE 3 |
| R-003 | Gemini TOML format mismatch causes `ai-council.toml` parse failure | M | L | Use existing `deep-review.toml` as template with field-level mirroring; validate TOML syntax before commit |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator Types `/deep:start-review-loop` Consistently Across Runtimes

**As a** CLI operator, **I want** to invoke deep-* commands using a consistent `/deep:<skill>` slash syntax across all runtimes (opencode, claude, codex, gemini), **so that** I don't need to remember whether a particular runtime uses `/speckit:deep-review` vs `/deep:start-review-loop`.

**Acceptance Criteria**:
1. Given I am in an opencode session, When I type `/deep:start-review-loop`, Then the deep-review workflow executes.
2. Given I am in a claude session, When I type `/deep:start-research-loop`, Then the deep-research workflow executes.
3. Given I am in any runtime, When I search for old `/speckit:deep-*` references in agent docs, Then I find zero live matches.
4. Given the skill advisor receives "deep review packet", Then `deep-review` surfaces in the top recommendations.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

(none — fully specified)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Phase Map**: `../../spec.md`
- **Canonical Wave Plan**: `~/.claude/plans/fix-minor-drift-afterwards-twinkly-melody.md`
- **Explore Reports**: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/ai-council/explore/`
<!-- /ANCHOR:related-docs -->
