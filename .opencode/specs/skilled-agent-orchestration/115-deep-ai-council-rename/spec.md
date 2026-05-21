---
title: "Feature Specification: 115 — rename deep-ai-council (skill + agent) repo-wide"
description: "Phase-parent for the arc that renames the `deep-ai-council` skill → `sk-ai-council` and the `deep-ai-council` agent → `ai-council` across all four runtime mirrors (.opencode, .claude, .codex, .gemini), updates every live cross-reference surface (sibling skill graph metadata, TypeScript code, root behavioral docs, git hooks, skills-index README), regenerates the compiled skill-graph.json, and verifies the advisor surfaces both renamed identities on canonical prompts. 375 total rg hits across the repo; ~125 of those are live surfaces in scope, ~250 are historical surfaces under 101 (creator packet) + 026 (research track) preserved as provenance."
trigger_phrases:
  - "rename deep-ai-council"
  - "sk-ai-council"
  - "ai-council agent"
  - "deep ai council rename arc"
  - "council skill rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-deep-ai-council-rename"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115 parent spec.md"
    next_safe_action: "Author 115/001 preflight"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/"
      - ".opencode/agents/deep-ai-council.md"
      - ".claude/agents/deep-ai-council.md"
      - ".codex/agents/deep-ai-council.toml"
      - ".gemini/agents/deep-ai-council.md"
      - ".github/hooks/scripts/pre-push-council.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000115"
      session_id: "115-parent-init"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should historical feature_catalog/manual_testing_playbook slugs naming the prior 2026-05-10 rename event keep their slugs?"
      - "Should mcp-coco-index/mcp_server/benchmarks/per-probe.jsonl lines that name deep-ai-council be edited or kept frozen as bench fixtures?"
    answered_questions:
      - "Skill rename: deep-ai-council → sk-ai-council (sk-util family prefix; aligns with sk-code/sk-doc/sk-prompt/sk-git/sk-ai-small-model)"
      - "Agent rename: deep-ai-council → ai-council (drops 'deep-' prefix; agents do not use 'sk-' prefix per existing convention)"
      - "Phase count: 6 (1 preflight + 4 parallel work + 1 final reindex)"
      - "Branch policy: stay on main per [[feedback_stay_on_main_no_feature_branches]]"
      - "History policy: git mv preserves rename history; DELETE old names, no stubs per [[feedback_delete_not_archive_or_comment]]"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 115 — rename deep-ai-council (skill + agent) repo-wide

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft (parent scaffold + 001 preflight authoring in progress) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Spec** | `..` (skilled-agent-orchestration track root) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 114-small-ai-model-optimization (sister rename arc shipped 2026-05-21 via 114/007) |
| **Successor** | None planned |
| **Handoff Criteria** | Phase 001 emits resource-map.md + rename-plan.json; phases 002-005 each pass `validate.sh --strict`; phase 006 confirms `skill_graph_compiler.py` regenerated graph + `advisor_recommend` surfaces both renamed identities at confidence ≥ 0.7; final live-surface rg returns zero + historical-surface rg unchanged from baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `deep-ai-council` skill (shipped from `101-deep-multi-ai-council-skill/`) and the co-named `@deep-ai-council` agent share a `deep-*` naming pattern that conflates two different conventions:
- **Skills** use either `sk-*` for the utility family (sk-code, sk-doc, sk-prompt, sk-git, sk-ai-small-model after 114/007) or `deep-*` for the autonomous-loop family (deep-research, deep-review, deep-agent-improvement).
- **Agents** use bare slugs (@code, @debug, @review, @context, @markdown, @orchestrate, @prompt-improver) or the matching `@deep-*` slug for the autonomous-loop agents (@deep-research, @deep-review, @deep-agent-improvement).

The Council is NOT an "autonomous loop" — it does not iterate to convergence the way deep-research and deep-review do. It is a planning sentinel skill with deliberative seats; closer to sk-prompt's role than to a deep-loop's. The agent counterpart should also drop the `deep-` prefix because the Council's identity is "AI Council", not "Deep Anything".

### Purpose
Rename the skill `deep-ai-council` → `sk-ai-council` (sk-util family) and the agent `deep-ai-council` → `ai-council` (simple slug). Propagate the new identities across every live reference surface and regenerate the compiled skill-graph index. Preserve all historical research/review/spec artifacts under 101 (originating packet) and 026 (research track) as provenance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — LIVE surfaces (~125 files; MUST update)
1. **Skill body** (~80 files inside `.opencode/skills/deep-ai-council/`): SKILL.md frontmatter `name`, README.md (3 occurrences), description.json (`name`, keywords, path fields), graph-metadata.json (`skill_id`, entities, key_files), `references/*.md` (command_wiring, folder_layout, output_schema, etc.), `assets/*.json`, `scripts/*` (Bash/Python + READMEs), `feature_catalog/**.md` body content (historical slugs preserved), `manual_testing_playbook/**.md` body content (slugs preserved). Create `changelog/v3.0.0.0.md`; preserve `v1.0.0.0.md` and `v2*.md`.
2. **Agent runtime mirrors** (4 files + 4 README.txt): `.opencode/agents/deep-ai-council.md` → `ai-council.md`; `.claude/agents/deep-ai-council.md` → `ai-council.md`; `.codex/agents/deep-ai-council.toml` → `ai-council.toml`; `.gemini/agents/deep-ai-council.md` → `ai-council.md`; the 4 corresponding `README.txt` inventory tables; each agent body references the renamed skill path `Read(.opencode/skills/sk-ai-council/SKILL.md)`.
3. **Cross-skill graph metadata** (4 sibling files): `deep-research/graph-metadata.json`, `deep-agent-improvement/graph-metadata.json`, `system-spec-kit/graph-metadata.json`, `system-skill-advisor/graph-metadata.json`.
4. **TypeScript code + tests** (2 files): `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` (10 hits — likely a routing string constant) + `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` (7 hits — parity assertions across 4 runtimes).
5. **Root behavioral docs** (3 files; CLAUDE.md is a symlink to AGENTS.md): `README.md` line 935 skill catalog entry, `AGENTS.md` line 162 Quick Reference Workflow row + line 336 Agent Definition.
6. **Git hook**: `.github/hooks/scripts/pre-push-council.sh` — `CHANGED_FILES` glob updated to match `sk-ai-council` + `ai-council` paths.
7. **Skills index README**: `.opencode/skills/README.md`.
8. **Sibling skill mention-only refs** (~8 files with 1-7 hits each in sk-code-review, sk-doc, cli-devin, deep-review, system-code-graph, etc.).

### Out of Scope — HISTORICAL surfaces (~250 files; MUST NOT edit)
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/**` (63 files; originating packet)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` (150 files; research track)
- 113/103/110/108/102/027/114/099/... spec folders (mixed historical)
- `.opencode/skills/deep-ai-council/changelog/v1.0.0.0.md + v2*.md` (historical version notes)
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-{19,20}/per-probe.jsonl` (frozen bench fixtures recording prior-name state)
- Skill behavior, dispatch matrix, MCP wiring — identity rename only

### Files to Change (parent-level summary; full lists per child spec.md §3)

| Phase | Folder | Estimated files |
|-------|--------|-----------------|
| 001 | `001-preflight-scope-map/` | 0 mutations outside the 001 spec folder; emits `scratch/resource-map.md` + `scratch/rename-plan.json` |
| 002 | `002-skill-dir-rename/` | ~80 internal skill files + 1 dir rename |
| 003 | `003-agent-runtime-rename/` | 4 agent rename + 4 README.txt + ~8 frontmatter/body edits |
| 004 | `004-cross-skill-edges-and-code/` | 4 sibling graphs + 2 TS files |
| 005 | `005-root-docs-hooks-and-readmes/` | 3 root docs + 1 git hook + 1 skills index |
| 006 | `006-reindex-validate-reconcile/` | 0 source mutations; 1 compiled JSON regen + parent metadata refresh |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. Phases 002-005 touch disjoint file sets and are designed to run in parallel after 001 emits the rename-plan.json contract. Phase 006 is sequential after 002-005.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-preflight-scope-map/` | Sequential. rg baseline + per-file live/historical classification + `resource-map.md` + `rename-plan.json` (per-phase scope locks). cli-devin SWE-1.6 × 3 parallel context-gathering dispatches scoped per surface group. ~30 min. | Planned |
| 002 | `002-skill-dir-rename/` | **Parallel after 001.** `git mv .opencode/skills/deep-ai-council .opencode/skills/sk-ai-council`. ~80 internal file updates + new v3.0.0.0.md changelog. ~40 min. | Planned |
| 003 | `003-agent-runtime-rename/` | **Parallel after 001.** 4 `git mv` operations + 4 agent README.txt updates + frontmatter `name:` (→ ai-council) + body refs to renamed skill path. Honors [[feedback_new_agent_mirror_all_runtimes]]. ~25 min. | Planned |
| 004 | `004-cross-skill-edges-and-code/` | **Parallel after 001.** 4 sibling graph-metadata.json + 2 TypeScript files (string constants + vitest assertions). ~20 min. | Planned |
| 005 | `005-root-docs-hooks-and-readmes/` | **Parallel after 001.** README.md + AGENTS.md (CLAUDE.md symlink) + `.github/hooks/scripts/pre-push-council.sh` glob + `.opencode/skills/README.md`. ~15 min. | Planned |
| 006 | `006-reindex-validate-reconcile/` | **Sequential after 002-005.** Compiler rerun + advisor smoke + parity vitest + `validate.sh --strict` + parent reconcile + nested changelog. ~20 min. | Planned |

**Total wall-clock estimate**: ~150 min sequential / ~80 min when 002-005 run in true parallel.

### Phase Transition Rules

- 001 MUST complete + emit `resource-map.md` + `rename-plan.json` BEFORE 002-005 are eligible.
- 002, 003, 004, 005 touch disjoint file sets per the rename-plan.json contract; the contract is the conflict-prevention mechanism.
- 006 requires ALL of 002-005 to validate clean before the compiler runs.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Parent (115) | 001 | Parent + 001 scaffold validates; rg counts captured | `validate.sh --strict 115` exit 0; `ls 001/scratch/rg-baseline-before.txt` |
| 001 | 002-005 | `001/scratch/resource-map.md` + `rename-plan.json` exist; per-phase scope locks emitted; cli-devin bundle gates pass | `jq` on rename-plan.json shows 4 disjoint phase-scoped file lists |
| 002-005 | 006 | Each phase's `validate.sh --strict` exits 0; per-phase rg returns 0 live-surface hits in that phase's scope | aggregate exit-code matrix |
| 006 | Parent close | Advisor surfaces both renamed identities at conf ≥ 0.7; compiled skill-graph.json fresh; final repo-wide rg clean | `advisor_recommend` output; `jq .generated_at` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill dir renamed; old path gone | `ls .opencode/skills/deep-ai-council 2>&1` is no-such-file; `git log --follow .opencode/skills/sk-ai-council/SKILL.md` traces back |
| REQ-002 | All 4 runtime agent files renamed via `git mv`; old paths gone | per-runtime `ls` checks |
| REQ-003 | Skill SKILL.md frontmatter `name:` is `sk-ai-council` | `rg "^name: sk-ai-council" SKILL.md` matches |
| REQ-004 | Agent frontmatter `name:` is `ai-council` (NOT `sk-ai-council`) in all 4 runtime files | per-runtime grep |
| REQ-005 | Sibling skill graph metadata updated | jq assertions for deep-research, deep-agent-improvement, system-spec-kit, system-skill-advisor |
| REQ-006 | TypeScript code updated; vitest passes | rg on 2 TS files = 0; `npx vitest run multi-ai-council-runtime-parity.vitest.ts` passes |
| REQ-007 | Compiled skill-graph.json regenerated; advisor surfaces `sk-ai-council` | `jq .families` includes sk-ai-council; `advisor_recommend` returns sk-ai-council top-3 conf ≥ 0.7 |
| REQ-008 | Live-surface rg returns zero `deep-ai-council` hits | rg with historical-allow-list excludes returns 0 |
| REQ-009 | Historical surfaces preserved | `git diff --stat` on 101/** + 026/** + changelog/v1+v2 = 0 |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Root README.md + AGENTS.md (CLAUDE.md symlink) updated | grep verification |
| REQ-011 | `.github/hooks/scripts/pre-push-council.sh` glob updated | grep on hook script |
| REQ-012 | All 4 runtime agent README.txt updated | per-runtime grep |
| REQ-013 | nested-changelog.js generates per-phase changelogs | ls changelog/ |
| REQ-014 | `bash validate.sh --strict` exits 0 for parent + all 6 children | aggregate matrix |
| REQ-015 | cli-devin SWE-1.6 × 3 dispatches in 001 follow SKILL.md rules (RCAF, medium pre-plan, bundle-gate standard, smoke-runnable verification) | logs under `001/scratch/cli-devin/` + bundle verification per [[feedback_cli_devin_bundle_verification]] |

### P2 — Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-016 | Bench-fixture classification decision documented | decision-record.md ADR |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After rename + reindex, `advisor_recommend({input: "multi-seat AI Council deliberation"})` returns `sk-ai-council` in top-3 with confidence ≥ 0.7.
- **SC-002**: Each of the 4 runtime agent files is at the new path `ai-council.{md,toml}`; old paths physically gone.
- **SC-003**: `rg "deep-ai-council"` on the live-surface allow-list returns zero hits.
- **SC-004**: Historical surface preservation: `git diff --stat` on 101/** + 026/** + changelog/v1+v2 = 0.
- **SC-005**: `validate.sh --strict` exits 0 for parent + all 6 children.
- **SC-006**: `npx vitest run multi-ai-council-runtime-parity.vitest.ts` passes after updates.
- **SC-007**: `.github/hooks/scripts/pre-push-council.sh` triggers correctly on the renamed paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Threshold |
|----|----------|-------------|-----------|
| NFR-001 | Safety | Rename does NOT alter behavior | diff of body sections (excluding name/title/H1/path-self-refs) empty |
| NFR-002 | Reversibility | `git revert` restores prior state cleanly | trial revert preview |
| NFR-003 | Provenance | Historical surfaces byte-identical | post-rename `git diff --stat` = 0 |
| NFR-004 | Advisor freshness | Compiler timestamps move forward; new names in keys, old names absent | `jq` checks |
| NFR-005 | Parallelism | Phases 002-005 have disjoint scopes | jq intersection check on rename-plan.json |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 6.5 EDGE CASES

| Case | Behavior | Handling |
|------|----------|----------|
| explicit.ts string constant referenced by regex elsewhere | Routing breaks if not updated | Pre-edit grep across scorer/ + lanes/ |
| Agent README.txt is auto-generated | Manual edit doesn't regenerate cleanly | Inspect each; run generator if found |
| `pre-push-council.sh` CHANGED_FILES glob mismatch | Hook stops firing | Phase 005 explicit edit + smoke test |
| Bench JSONL has serialized data with old name | Editing corrupts historical record | Defer per REQ-016; ADR explains |
| Skill changelog v1+v2 has dozens of old-name mentions | Historical version state | Preserve; new v3.0.0.0.md is forward-link |
| Parity vitest runs before all 4 mirrors complete in 003 | False FAIL | Sequence: all 4 mirror edits then vitest in 006 |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 6.7 COMPLEXITY ASSESSMENT

| Factor | Score | Notes |
|--------|-------|-------|
| **Domain Count** | 5 (skills + agents + tests + hooks + docs) | Broader than 114/007 |
| **File Count** | 375 rg hits; ~125 live + ~250 historical | Largest rename arc in repo |
| **LOC Estimate** | ~500 LOC + 5 dir renames | Mostly literal substitutions |
| **Parallel Opportunity** | High (4 of 6 phases parallel-eligible) | Disjoint file sets enforced |
| **Task Type** | Moderate-to-complex (cross-runtime + TS code + git hook + 4-mirror parity) | Phase 004 trickiest |

**Overall**: Level 3 is correct. Decision-record.md captures naming convention rationale.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `explicit.ts` string constant has hidden regex deps | High | Pre-edit grep + post-edit vitest + advisor smoke |
| Risk | 4-runtime parity vitest fails mid-execution | Medium | Phase 003 completes all 4 mirrors atomically before vitest in 006 |
| Risk | Historical 101/** + 026/** accidentally edited | High | Explicit out-of-scope allow-list; pre/post `git diff --stat` |
| Risk | cli-devin dispatch flakiness ≥3 concurrent | Medium | 3 jobs max per [[feedback_cli_dispatch_unreliability]] |
| Risk | Compiler blocker (like 007's category bug) | Low-Medium | Phase 006 retry protocol with incidental fix permission |
| Dependency | `git mv` works on 5 renames (1 dir + 4 agents) | Hard block | Pre-flight git status clean for those paths |
| Dependency | `skill_graph_compiler.py` validates symmetrically | Hard block | Phase 006 handles incidental fixes |
| Dependency | `vitest` runs cleanly in mcp_server | Hard block for 006 | Pre-flight `npm install` if needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the historical feature_catalog slug `01-runtime-agent-renamed-to-deep-ai-council.md` keep its slug? **Tentative**: YES — slug is historical evidence of the prior 2026-05-10 rename event.
- Should manual_testing_playbook entries' BODY content reflect the new skill name? **Tentative**: YES — playbooks test live behavior.
- Should `.github/hooks/scripts/pre-push-council.sh` itself be renamed? **Tentative**: NO — "council" is the cross-cutting subject.
- Should `multi-ai-council-runtime-parity.vitest.ts` be renamed? **Tentative**: NO — describes the subject area.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-preflight-scope-map/`, `002-skill-dir-rename/`, `003-agent-runtime-rename/`, `004-cross-skill-edges-and-code/`, `005-root-docs-hooks-and-readmes/`, `006-reindex-validate-reconcile/`
- **Predecessor**: `../114-small-ai-model-optimization/007-sk-ai-small-model-rename/` (sister rename arc; pattern reference)
- **Skill origin**: `../101-deep-multi-ai-council-skill/**`
- **Research track citing the skill**: `../../system-spec-kit/026-graph-and-context-optimization/**`
- **Memory rules**: [[feedback_skill_graph_compiler_rebuild]], [[feedback_cli_devin_bundle_verification]], [[feedback_bundle_gate_smoke_run]], [[feedback_cli_dispatch_unreliability]], [[feedback_stay_on_main_no_feature_branches]], [[feedback_delete_not_archive_or_comment]], [[feedback_new_agent_mirror_all_runtimes]], [[feedback_rename_grep_case_insensitive]]


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-009
REQ-010
REQ-011
REQ-012
REQ-013
REQ-014
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
