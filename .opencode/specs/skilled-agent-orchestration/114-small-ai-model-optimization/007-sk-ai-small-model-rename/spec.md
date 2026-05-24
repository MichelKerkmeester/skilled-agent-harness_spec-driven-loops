---
title: "Feature Specification: Rename sk-small-model → sk-prompt-small-model and propagate references"
description: "Phase 7 of 114-small-ai-model-optimization: rename the sentinel skill, update every live reference across docs/commands/sibling skills/memory, and rebuild the skill-advisor index so the renamed skill keeps surfacing on small-model dispatch prompts."
trigger_phrases:
  - "rename sk-small-model"
  - "sk-prompt-small-model"
  - "small-model sentinel rename"
  - "skill rename propagation"
  - "skill-advisor reindex after rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored spec.md"
    next_safe_action: "Author 007 plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-small-model/SKILL.md"
      - ".opencode/skills/sk-small-model/graph-metadata.json"
      - ".opencode/skills/cli-devin/graph-metadata.json"
      - ".opencode/skills/cli-opencode/graph-metadata.json"
      - "AGENTS.md"
      - "CLAUDE.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "114-007-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Whether the historical research/review iteration docs under 001-006 should ever back-fill the new name (current decision: NO — preserve provenance, only edit live surfaces)"
    answered_questions:
      - "Rename target name: sk-prompt-small-model (aligns with sk-code/sk-doc/sk-prompt naming family; explicit ai prefix matches phase parent slug small-ai-model-optimization)"
      - "Phase number: 007 (next free slot; the prior 007-hardening-ci was deleted 2026-05-18 per parent spec.md)"
      - "Branch policy: stay on main, no feature branch (per [[feedback_stay_on_main_no_feature_branches]])"
      - "History policy: DELETE old directory via git mv, no stub/tombstone (per [[feedback_delete_not_archive_or_comment]])"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 7 — rename sk-small-model → sk-prompt-small-model

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-cross-skill-propagation (Complete 2026-05-18) |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` exit 0; advisor still recommends the renamed skill on small-model dispatch prompts; compiled `skill-graph.json` regenerated; zero `sk-small-model` literals remain in any live surface (historical spec docs under 001-006 + review iterations + 026 research are intentionally preserved as provenance). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the 114-small-ai-model-optimization arc. Phases 001-006 shipped on 2026-05-18 and **created** the sentinel skill `sk-small-model` along with every cross-skill `enhances` edge, dispatch-matrix doc, and runtime helper. This phase performs a pure rename of that skill and propagates the new identity across every live reference surface.

**Scope Boundary**: rename + reference propagation + advisor reindex ONLY. No behavioral changes, no content rewrites of the skill's own SKILL.md beyond name fields, no edits to historical research/review iteration artifacts.

**Dependencies**:
- Predecessor phase 006 complete (verified via `006-cross-skill-propagation/implementation-summary.md` exists).
- `skill_graph_compiler.py` available at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` (verified via grep).
- `git mv` preserves rename history; no force operations required.

**Deliverables**:
- Renamed directory `.opencode/skills/sk-prompt-small-model/` (old `sk-small-model/` directory physically gone).
- Updated frontmatter `name:` field in SKILL.md.
- Updated `graph-metadata.json` for sk-prompt-small-model + cli-devin + cli-opencode (the two sibling skills whose `enhances` edges target it).
- Updated reference text in manual_testing_playbook entries + cli-opencode/references/permissions-matrix.md + cli-opencode/assets/permissions-matrix.example-packet-local.json.
- Updated AGENTS.md / CLAUDE.md / README.md and auto-memory MEMORY.md + dispatch-matrix memory entry.
- Regenerated compiled `skill-graph.json`.
- Forward-pointing note in 114/spec.md PHASE DOCUMENTATION MAP that 007 renamed the skill (history of phases 001-006 unchanged).
- `parent.graph-metadata.json.derived.last_active_child_id` updated to point at 007.

**Changelog**:
- When this phase closes, write `../changelog/changelog-114-007-rename-sk-prompt-small-model.md` via `nested-changelog.js`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sentinel skill `sk-small-model` was shipped by Phase 002 (foundation-routing) on 2026-05-18 and has been live ever since with `enhances` edges to `cli-devin` + `cli-opencode`. The skill name `sk-small-model` does not match the family naming convention used by sibling skills (`sk-code`, `sk-doc`, `sk-prompt`, `sk-git`) where the suffix is the substance the skill governs. "Small-model" reads as a category modifier rather than the substance; the surrounding 114 arc is called **small-AI-model**-optimization, with the explicit `ai` infix. Operator-facing prompts and auto-memory entries also tend to read the current name as a routing tag rather than a sentinel-skill name, leading to advisor surface ambiguity in mixed dispatches.

### Purpose
Rename the skill to `sk-prompt-small-model` so the canonical sentinel-skill name matches the phase-parent's slug (`small-ai-model-optimization`) and the family convention. Carry the rename through every live surface: skill body, sibling skill graph edges, manual-testing playbooks, root behavioral docs (AGENTS.md / CLAUDE.md / README.md), auto-memory current-state entries, and the compiled skill-graph index. Preserve every historical spec/research/review artifact under 114/001-006 as immutable provenance — those documents describe work as it happened.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (live surfaces, MUST update)
- **Skill body** (rename directory + edit frontmatter/body): `.opencode/skills/sk-small-model/` → `.opencode/skills/sk-prompt-small-model/`. Files affected: `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, `references/pattern-index.md`, `changelog/v0.1.0.0.md`, `changelog/v0.2.0.0.md`. Add `changelog/v0.3.0.0.md` documenting the rename.
- **Sibling skill graph edges** (live `enhances`/`related_to` targets): `.opencode/skills/cli-devin/graph-metadata.json`, `.opencode/skills/cli-opencode/graph-metadata.json`.
- **Sibling skill body references** (current live docs): `.opencode/skills/cli-opencode/references/permissions-matrix.md`, `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json`.
- **Manual testing playbooks** (rename + edit content):
  - `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/005-swe16-via-sk-small-model-and-sk-prompt.md` → `005-swe16-via-sk-prompt-small-model-and-sk-prompt.md`
  - `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/006-deepseek-v4-via-sk-small-model-and-sk-prompt.md` → `006-deepseek-v4-via-sk-prompt-small-model-and-sk-prompt.md`
  - `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` (index references)
  - `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/004-deepseek-v4-via-opencode-go-with-sk-small-model.md` → `004-…-with-sk-prompt-small-model.md`
  - `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/005-kimi-k2-6-via-opencode-go-with-sk-small-model.md` → `005-…-with-sk-prompt-small-model.md`
  - `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`
- **Root behavioral docs**: `AGENTS.md` (line 40 Small-model dispatch rule), `CLAUDE.md` (line 40, identical rule), `README.md` (line 912 skill catalog entry).
- **Auto-memory** (current-state entries): `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/MEMORY.md`, `…/reference_small_model_dispatch_matrix.md`, `…/feedback_skill_graph_compiler_rebuild.md` (the latter narrates a 2026-05-18 incident — update the named-skill reference but keep the historical date framing).
- **Compiled skill-graph index**: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` (do NOT edit by hand; regenerate via `skill_graph_compiler.py --export-json --pretty` per [[feedback_skill_graph_compiler_rebuild]]).
- **Phase-parent forward note**: add a single row to `114/spec.md` PHASE DOCUMENTATION MAP indicating Phase 7 renamed the skill; refresh `parent.graph-metadata.json.derived.last_active_child_id`.

### Out of Scope (historical surfaces, MUST NOT edit)
- `114/001-research-smallcode/` — deep-research iterations + plan + spec + decision-record; documents the research that PROPOSED sk-small-model. Preserving the original name preserves provenance.
- `114/002-foundation-routing/` … `114/006-cross-skill-propagation/` — completed phase children documenting how sk-small-model was created and propagated. Editing these would falsify the work record.
- `114/review/` — deep-review iterations covering the original work.
- `.opencode/specs/system-spec-kit/026/.../iteration-009.md` — a historical research finding from a different track that cited sk-small-model.
- `sk-prompt-small-model/changelog/v0.1.0.0.md` + `v0.2.0.0.md` (after rename) — these document past version state under the old name; only add a NEW `v0.3.0.0.md` for the rename rather than rewriting v0.1/v0.2.
- Skill behavior, trigger phrases, model coverage, or any non-naming substance.
- Feature branches — stay on main per [[feedback_stay_on_main_no_feature_branches]].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-small-model/` | Rename (dir) | → `.opencode/skills/sk-prompt-small-model/` via `git mv` |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Modify | `name: sk-prompt-small-model` in frontmatter; update H1 + in-body references |
| `.opencode/skills/sk-prompt-small-model/README.md` | Modify | Rename in title + body references |
| `.opencode/skills/sk-prompt-small-model/description.json` | Modify | Update `skill_id` and any `path`/`name` fields |
| `.opencode/skills/sk-prompt-small-model/graph-metadata.json` | Modify | `skill_id: sk-prompt-small-model`; entity name + path; derived.key_files paths |
| `.opencode/skills/sk-prompt-small-model/references/pattern-index.md` | Modify | Header + any self-references |
| `.opencode/skills/sk-prompt-small-model/changelog/v0.3.0.0.md` | Create | Document the rename |
| `.opencode/skills/cli-devin/graph-metadata.json` | Modify | `enhances[].target: sk-prompt-small-model` + `related_to` |
| `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/005-swe16-via-sk-small-model-and-sk-prompt.md` | Rename + modify | New filename + body refs |
| `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/006-deepseek-v4-via-sk-small-model-and-sk-prompt.md` | Rename + modify | New filename + body refs |
| `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` | Modify | Index entries point at new filenames |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | `enhances[].target: sk-prompt-small-model` + `related_to` |
| `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/004-deepseek-v4-via-opencode-go-with-sk-small-model.md` | Rename + modify | New filename + body refs |
| `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/005-kimi-k2-6-via-opencode-go-with-sk-small-model.md` | Rename + modify | New filename + body refs |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modify | Index entries |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Modify | Inline ref updates |
| `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json` | Modify | Inline ref updates |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerate | Via `skill_graph_compiler.py` — never hand-edited |
| `AGENTS.md` | Modify | Line 40 Small-model dispatch rule |
| `CLAUDE.md` | Modify | Line 40 (mirrors AGENTS.md) |
| `README.md` | Modify | Line 912 skill catalog entry |
| `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/MEMORY.md` | Modify | Dispatch-matrix entry pointer + description |
| `~/.claude/projects/.../memory/reference_small_model_dispatch_matrix.md` | Modify | All current-state mentions; rename file? — NO, the name slug is descriptive not skill-bound |
| `~/.claude/projects/.../memory/feedback_skill_graph_compiler_rebuild.md` | Modify | Update skill name reference (keep 2026-05-18 incident date) |
| `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md` | Modify (single row append) | Add Phase 7 row to PHASE DOCUMENTATION MAP |
| `.opencode/specs/.../114-small-ai-model-optimization/graph-metadata.json` | Modify | `children_ids` += 007; `derived.last_active_child_id: 007-…` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill directory renamed via `git mv`, old path physically gone | `ls .opencode/skills/sk-small-model 2>&1` returns no-such-file; `ls .opencode/skills/sk-prompt-small-model/SKILL.md` exists; `git log --follow` traces rename history |
| REQ-002 | SKILL.md frontmatter `name:` is `sk-prompt-small-model`; H1 and any in-body skill self-references updated | `rg "^name: sk-prompt-small-model" .opencode/skills/sk-prompt-small-model/SKILL.md` matches; `rg "sk-small-model" .opencode/skills/sk-prompt-small-model/` returns no live hits except inside `changelog/v0.1.0.0.md` and `v0.2.0.0.md` (historical version files) |
| REQ-003 | Sibling skill `enhances` edges updated in cli-devin + cli-opencode graph-metadata.json | `jq '.edges.enhances[].target' .opencode/skills/cli-devin/graph-metadata.json` includes `sk-prompt-small-model` and excludes `sk-small-model`; same for cli-opencode |
| REQ-004 | Root behavioral docs (AGENTS.md, CLAUDE.md, README.md) reference the new name | `rg "sk-small-model" AGENTS.md CLAUDE.md README.md` returns zero hits |
| REQ-005 | Compiled `skill-graph.json` regenerated; advisor surfaces `sk-prompt-small-model` on small-model dispatch prompts | `jq '.skills | keys[]' .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` contains `sk-prompt-small-model` and does NOT contain `sk-small-model`; `advisor_recommend` MCP call on a representative small-model prompt returns `sk-prompt-small-model` in top-3 |
| REQ-006 | `parent.graph-metadata.json` refreshed via `generate-context.js` so 007 is a registered child and `derived.last_active_child_id` points to it | `jq '.children_ids' …/114/graph-metadata.json` includes `…/007-rename-sk-prompt-small-model`; `jq '.derived.last_active_child_id' …` matches `…/007-…` |

### P1 — Required (complete or document deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | cli-devin + cli-opencode manual_testing_playbook entry files renamed + their playbook index updated | `ls` of both playbook directories shows the new filenames; `rg "sk-small-model" .opencode/skills/cli-devin/manual_testing_playbook` returns zero hits |
| REQ-008 | cli-opencode permissions-matrix references updated | `rg "sk-small-model" .opencode/skills/cli-opencode/references/permissions-matrix.md .opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json` returns zero hits |
| REQ-009 | Auto-memory current-state entries updated (MEMORY.md index + reference_small_model_dispatch_matrix.md body + feedback_skill_graph_compiler_rebuild.md skill-name reference) | `rg "sk-small-model" ~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/` returns zero hits OR only historical-narrative hits explicitly tagged "(renamed sk-prompt-small-model 2026-05-21)" |
| REQ-010 | Phase-parent forward note added to `114/spec.md` PHASE DOCUMENTATION MAP without rewriting prior phase rows | `rg "Phase 7 \(007-rename-sk-prompt-small-model\)" …/114/spec.md` matches; phases 001-006 row text unchanged from before the rename |
| REQ-011 | cli-devin context-gathering dispatched per user directive (per `cli-devin/SKILL.md` rules: RCAF framework, medium pre-planning, bundle-gate standard, `--model swe-1.6 --permission-mode auto -p --prompt-file ... </dev/null`) | Dispatch logs present under `007-…/scratch/cli-devin/`; bundle-gate verification (grep + smoke-run) applied to each returned bundle per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]] |
| REQ-012 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <007 spec folder> --strict` exits 0 | Validator output shows zero errors and zero warnings |

### P2 — Optional / can defer

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | `advisor_validate` + `advisor_recommend` MCP smoke tests captured under `007-…/scratch/advisor/` showing the new name surfacing | JSON output files present; recommend confidence ≥ 0.7 on at least one small-model trigger phrase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After rename + reindex, a fresh advisor query for a representative small-model dispatch prompt (`"dispatch swe-1.6 via cli-devin"`) returns `sk-prompt-small-model` in top-3 with confidence ≥ 0.7.
- **SC-002**: `rg "sk-small-model"` across the live surface set (skill body, sibling skills, root docs, memory) returns zero hits. Historical surfaces under 114/001-006, 114/review, and 026/ remain untouched (rg there still returns hits — by design).
- **SC-003**: `validate.sh --strict` exits 0 for 007 spec folder.
- **SC-004**: `git log --follow .opencode/skills/sk-prompt-small-model/SKILL.md` traces back to the original `sk-small-model/SKILL.md` (rename history preserved).
- **SC-005**: Parent `114/graph-metadata.json` includes 007 as a child and `derived.last_active_child_id` points to it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor live-route still serves old name from in-memory cache after compile | Medium — dispatches at the boundary of the cache refresh may transiently surface the old name | Run `advisor_rebuild` / `advisor_validate` MCP calls after `skill_graph_compiler.py --export-json --pretty`; verify with `advisor_recommend` smoke test |
| Risk | Sibling `enhances` edges point at the old skill id and fall off the graph silently | High — silent dispatch quality drop on small-model prompts | Update edges atomically in the same commit as the rename; verify with `jq` + `skill_graph_query` MCP call |
| Risk | Auto-memory index keeps stale embeddings of "sk-small-model" surfaces | Low — memory recall surfaces old-name memories but with the same content | Update current-state entries (MEMORY.md index + matrix entry); leave historical-incident entry with corrective tag; trust decay |
| Risk | cli-devin parallel dispatch flakiness per [[feedback_cli_dispatch_unreliability]] | Medium — fresh dispatches silently fail or partially revert under high parallelism | Cap concurrency at 3 cli-devin SWE-1.6 jobs; verify every returned bundle via grep + smoke-run gates per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]] |
| Risk | Historical spec/research docs under 114/001-006 get edited by accident | High — falsifies provenance | Explicit "Out of Scope" list in §3; pre-edit grep + post-edit grep MUST show the historical-hit count unchanged after live edits land |
| Dependency | `git mv` works in current repo state with no merge conflicts | Hard block if it fails | `git status` clean for sk-small-model paths verified before mv (other tracked but unrelated changes are allowed per [[feedback_worktree_cleanliness_not_a_blocker]]) |
| Dependency | `skill_graph_compiler.py` available + functional | Hard block | Verified present via `ls`; runs as documented in [[feedback_skill_graph_compiler_rebuild]] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 6.5 NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Threshold |
|----|----------|-------------|-----------|
| NFR-001 | Safety | Rename must NOT alter skill behavior (trigger phrases, model coverage, dispatch matrix, allowed-tools). Edits are name-only on live surfaces. | `diff` of pre/post sk-small-model SKILL.md body sections excluding name/title/H1 must be empty |
| NFR-002 | Reversibility | `git revert` of the rename commits must restore the prior state cleanly. | A trial `git revert --no-commit` followed by `git status` shows only the renamed paths inverted, no unrelated diff |
| NFR-003 | Provenance | Historical surfaces under 114/001-006 and 114/review remain byte-identical. | `git diff --stat` for those paths shows zero changes after the rename pass |
| NFR-004 | Advisor freshness | After `skill_graph_compiler.py --export-json --pretty`, the compiled graph timestamps (`generated_at`) move forward and the new name appears in `skills` keys. | `jq '.generated_at, (.skills \| has("sk-prompt-small-model"))'` shows a fresh timestamp + `true` |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 6.6 EDGE CASES

| Case | Behavior | Detection / Handling |
|------|----------|----------------------|
| `git mv` runs while sk-small-model SKILL.md is open in another editor | Possible stale file handle in editor | Operator-side, not a process risk; advise reload after rename |
| skill_graph_compiler.py emits the compiled JSON with the OLD name still present because it scans cached metadata | Compiled graph drifts vs live folder | Run compiler AFTER the directory rename; verify timestamps via `jq` |
| Auto-memory MEMORY.md link `[reference_small_model_dispatch_matrix.md]` becomes stale after rename | Memory index broken | Keep the memory file slug — only edit body content, NOT filename |
| Manual playbook reference such as `005-swe16-via-sk-small-model-and-sk-prompt.md` is referenced by an external runbook or by a prior screenshot | Broken inbound link | Add the new filename next to the old in `manual_testing_playbook.md` index OR keep mapping in 007 implementation-summary.md |
| Sibling `enhances` edge file gets updated AFTER `skill_graph_compiler.py` runs | Compiled graph misses edge update | Order: rename dir → update sibling graph-metadata.json → run compiler → smoke-test advisor |
| Edge case: cli-devin SWE-1.6 dispatch returns a bundle that hallucinates a path that doesn't exist | False guidance | [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]]: grep + smoke-run validation_commands per returned bundle |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 6.7 COMPLEXITY ASSESSMENT

| Factor | Score | Notes |
|--------|-------|-------|
| **Domain Count** | 2 (skills + docs) | Skill dir + reference text |
| **File Count** | ~25 live surfaces (95 total rg hits — 70 are historical, untouched) | Skill body (7) + sibling skills (10) + root docs (3) + memory (3) + parent forward note (2) |
| **LOC Estimate** | ~150 LOC of edits + 1 dir rename | Mostly literal-string substitutions; small new file for v0.3.0.0 changelog |
| **Parallel Opportunity** | High (per-surface edits are independent) | Capped at 3 concurrent cli-devin SWE-1.6 dispatches per [[feedback_cli_dispatch_unreliability]] |
| **Task Type** | Moderate (mechanical rename + advisor reindex coordination) | Reindex ordering and historical preservation invariant raise this above trivial |

**Overall**: Level 2 is the correct documentation level — small enough to be mostly mechanical, large enough across surfaces to require a verification checklist.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the auto-memory dispatch-matrix memory file slug (`reference_small_model_dispatch_matrix.md`) be renamed to `reference_ai_small_model_dispatch_matrix.md` for symmetry? **Decision**: NO — the slug is descriptive, not skill-bound; renaming would break the MEMORY.md link and break inbound `[[reference_small_model_dispatch_matrix]]` references in other memory entries. Update body content only.
- Should sk-prompt-small-model `changelog/v0.1.0.0.md` and `v0.2.0.0.md` be edited to use the new name? **Decision**: NO — those are historical version notes; add a NEW `v0.3.0.0.md` documenting the rename.
- Should the older `sk-small-model/changelog/v0.2.0.0.md` mention "renamed in 007" via a forward-pointing note? **Decision**: NO — historical version files describe past state; v0.3.0.0.md is the forward-link.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Live + Out-of-Scope surface lists are authoritative for the propagation pass
- Historical surface preservation is a P0 invariant
- cli-devin context gathering is REQ-011 (capped at 3 parallel SWE-1.6 jobs)
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
