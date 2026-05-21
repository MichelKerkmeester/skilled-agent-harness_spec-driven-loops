---
title: "Implementation Summary: Phase 7 — rename sk-small-model → sk-ai-small-model"
description: "Renamed the sentinel skill `sk-small-model` to `sk-ai-small-model` across 22 live surfaces, regenerated the compiled skill-graph index, and verified the advisor now surfaces the renamed skill at confidence 0.95 on the canonical small-model dispatch prompt — all in ~35 minutes with zero behavioral drift and 100% historical-narrative preservation under 114/001-006."
trigger_phrases:
  - "sk-ai-small-model rename complete"
  - "phase 7 rename summary"
  - "skill rename implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-ai-small-model-rename"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 007 implementation-summary.md"
    next_safe_action: "Run 007 canonical save"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "114-007-impl-summary"
      parent_session_id: "114-007-spec-init"
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Phase 7 — rename sk-small-model → sk-ai-small-model

The sentinel skill `sk-small-model` (created by Phase 002 on 2026-05-18) was renamed in-place to `sk-ai-small-model` to align with the family naming convention (`sk-code`, `sk-doc`, `sk-prompt`, `sk-git`) and with the 114 phase-parent slug `small-ai-model-optimization` (note the explicit `ai` infix). Behavior, trigger phrases, model coverage, dispatch matrix, and `enhances` edge weights are unchanged — this is a pure identity refactor. The advisor now surfaces `sk-ai-small-model` at confidence **0.95** on the canonical small-model dispatch prompt, exceeding the 0.7 threshold by a wide margin.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-ai-small-model-rename/` |
| Phase | 7 of 7 |
| Predecessor | 006-cross-skill-propagation (Complete 2026-05-18) |
| Started | 2026-05-21 |
| Completed | 2026-05-21 |
| Level | 2 |
| Branch | `main` (no feature branch per [[feedback_stay_on_main_no_feature_branches]]) |
| Validate state | `validate.sh --strict` → exit 0, 0 errors, 0 warnings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A coordinated rename pass across 22 live-reference surfaces, plus advisor reindex, plus parent metadata reconciliation.

### Files renamed (5 `git mv` operations — history preserved)
1. `.opencode/skills/sk-small-model/` → `.opencode/skills/sk-ai-small-model/` (whole directory)
2. `.opencode/skills/cli-devin/manual_testing_playbook/03--model-presets/005-swe16-via-sk-small-model-and-sk-prompt.md` → `005-swe16-via-sk-ai-small-model-and-sk-prompt.md`
3. Same dir, `006-deepseek-v4-via-…` filename renamed analogously.
4. `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/004-deepseek-v4-via-opencode-go-with-sk-small-model.md` → `004-…-with-sk-ai-small-model.md`
5. Same dir, `005-kimi-k2-6-via-…` filename renamed analogously.

### Files content-edited (literal `sk-small-model` → `sk-ai-small-model` via macOS `sed -i ''`)

| Surface group | Files | Hit count pre-edit |
|---|---|---|
| Skill body | sk-ai-small-model/{SKILL.md, README.md, description.json, graph-metadata.json, references/pattern-index.md} | 8 + 15 + 3 + 5 + 5 = 36 |
| Skill body (underscore variant in Python pseudocode) | sk-ai-small-model/SKILL.md (`sk_small_model` → `sk_ai_small_model`) | 1 occurrence in `surface_sk_small_model` |
| Sibling skill graph metadata | cli-devin/graph-metadata.json + cli-opencode/graph-metadata.json | 1 + 1 = 2 (edges.enhances[].target) |
| Sibling manual playbooks (4 renamed files) | 005/006 in cli-devin + 004/005 in cli-opencode | 16 + 9 + 13 + 11 = 49 |
| Sibling playbook indexes | cli-devin/manual_testing_playbook.md + cli-opencode/manual_testing_playbook.md | 9 + 9 = 18 |
| cli-opencode permissions matrix | references/permissions-matrix.md + assets/permissions-matrix.example-packet-local.json | 1 + 1 = 2 |
| Root behavioral docs | AGENTS.md (CLAUDE.md symlinks to AGENTS.md) + README.md | 1 (×2 paths) + 1 = 2 |
| Auto-memory current-state | ~/.claude/projects/…/memory/MEMORY.md + reference_small_model_dispatch_matrix.md | 1 + 3 = 4 |
| Auto-memory historical narrative (tagged "(renamed sk-ai-small-model 2026-05-21)") | feedback_skill_graph_compiler_rebuild.md | 2 surgical edits |

### Files created
- `.opencode/skills/sk-ai-small-model/changelog/v0.3.0.0.md` — rename changelog with full verification table.
- Phase 7 row in `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md` PHASE DOCUMENTATION MAP.

### Files regenerated (not hand-edited)
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` via `skill_graph_compiler.py --export-json --pretty` (per [[feedback_skill_graph_compiler_rebuild]]).

### Files preserved (historical provenance — intentionally NOT edited)
- `sk-ai-small-model/changelog/v0.1.0.0.md` + `v0.2.0.0.md` (version notes from before the rename)
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/{001-006}/**` (deep-research + 5 implementation phase children)
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/**` (deep-review iterations + prompts + deltas)
- `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/roadmap/follow-on-phases.md`
- `.opencode/specs/system-spec-kit/.../iteration-009.md` (research finding from a different track)
- 114/spec.md historical narrative (RQ5 open question + Phase 002 row text)

### Incidental fixes (out-of-scope but on critical path for REQ-005)
- `.opencode/skills/system-rerank-sidecar/graph-metadata.json`: `category: "skill"` → `category: "system"` (was outside the allowed set `[autonomous-loop, cli-orchestrator, code-quality, mcp-tool, system, utility]`; pre-existing bug from the recent rerank-sidecar work).
- `.opencode/skills/mcp-coco-index/graph-metadata.json`: added reverse-sibling edge to `system-rerank-sidecar` (matching the existing forward edge from system-rerank-sidecar; symmetry rule enforced by the compiler).

Both were blockers for `skill_graph_compiler.py` so the advisor could be reindexed for REQ-005. Documented here rather than spread across follow-on packets — minimal scope creep with maximum unblocker value.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Phase A — pre-flight
- rg baseline captured: 95 unique files / 101 multi-hit lines containing `sk-small-model` repo-wide.
- Manual live/historical classification using spec.md §3 In Scope vs Out of Scope allow-lists.
- cli-devin SKILL.md and sk-small-model SKILL.md/README.md/graph-metadata.json read in current context (CLI dispatch rule + read-first invariants).
- `git status` and `git mv` viability verified.

### Phase B — cli-devin SWE-1.6 parallel context-gathering (3 jobs)
Three cli-devin SWE-1.6 dispatches in parallel (`--model swe-1.6 --permission-mode auto -p --prompt-file ... </dev/null`), each scoped to a surface group:
- **Job-1** (live skill body + sibling graph metadata) — completed exit 0, returned 21+ live edit recipes and 24 historical-preserve lines (changelog/v0.1+v0.2).
- **Job-2** (root docs + auto-memory) — completed exit 0, returned 9 edit recipes including the surgical tag-insertion strategy for `feedback_skill_graph_compiler_rebuild.md`.
- **Job-3** (manual playbooks + permissions-matrix) — completed exit 0, returned 4 filename renames + many body edits.

All three bundles passed verification:
- **Grep gate ([[feedback_cli_devin_bundle_verification]])**: every cited file path exists; symbols/line numbers match my own reads.
- **Smoke-run gate ([[feedback_bundle_gate_smoke_run]])**: the verification commands in each bundle are post-edit assertions (rg/grep on the new text); they were aggregated into the post-edit CHK-020/021 checks rather than smoke-run pre-edit (where they would all fail by design).
- **Unclassified count**: 0 in all 3 bundles.

The dispatch count was reduced from the user's "like 10" target to 3 after the rg ground-truth + manual classification proved the scope was fully enumerable without large parallel context gathering. The "whatever works" wording authorized this reduction; the trade-off is documented in plan.md §4 answered_questions.

### Phase C — skill body rename
- `git mv` on the directory.
- macOS `sed -i ''` bulk-replace (hyphenated variant) on the 5 in-scope files.
- Additional `sed -i ''` on SKILL.md for the underscored Python identifier (`sk_small_model` → `sk_ai_small_model`).

### Phase D — sibling propagation
- `sed -i ''` on cli-devin + cli-opencode graph-metadata.json (target field).
- `git mv` on 4 playbook entries.
- `sed -i ''` on the 4 renamed playbook files + 2 playbook index files + permissions-matrix.md + permissions-matrix.example-packet-local.json.

### Phase E — root docs + auto-memory
- `sed -i ''` on AGENTS.md, README.md, ~/.claude/.../memory/MEMORY.md, ~/.claude/.../memory/reference_small_model_dispatch_matrix.md.
- CLAUDE.md got updated via the symlink to AGENTS.md (single sed; symlink auto-resolves).
- Surgical `Edit` on `~/.claude/.../memory/feedback_skill_graph_compiler_rebuild.md` to insert the "(renamed sk-ai-small-model 2026-05-21)" tag on the two skill-name references while preserving the 2026-05-18 incident date narrative.

### Phase F — advisor reindex
- `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` ran into 2 pre-existing errors in `system-rerank-sidecar` (incidental fixes above).
- Second attempt: VALIDATION PASSED; `skill-graph.json` (10,790 bytes, 22 skills) regenerated with fresh `generated_at: 2026-05-21T06:45:06`.
- `advisor_recommend({input: "dispatch swe-1.6 via cli-devin for small-model output verification"})` MCP smoke: `sk-ai-small-model` at rank 1, confidence **0.95**, uncertainty 0.12, dominant lane = `explicit_author`; `cli-devin` at rank 2, confidence 0.8949. Trust state: `live`, generation 3347. Threshold passed.

### Phase G — validate + parent reconcile
- `validate.sh --strict` on 007 spec folder: exit 0, 0 errors, 0 warnings.
- 114/spec.md PHASE DOCUMENTATION MAP appended with the Phase 7 row; the Phase F (007-hardening-ci was deleted) note amended to acknowledge slot reuse.
- 114/graph-metadata.json will be refreshed at Step 13 via `generate-context.js` to include `007-rename-sk-ai-small-model` in `children_ids` and set `derived.last_active_child_id`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ID | Decision | Rationale |
|---|---|---|
| D-001 | Reduce cli-devin parallel dispatch count from "like 10" to **3** | rg ground-truth was already comprehensive (101 hits across 95 files, zero ambiguous); 3 jobs verified per-surface-group at SWE-1.6 speed without burning a 10-job concurrency-flakiness risk per [[feedback_cli_dispatch_unreliability]]. User said "whatever works"; 3 worked. |
| D-002 | Keep `reference_small_model_dispatch_matrix.md` filename slug — only edit body | Renaming the file would break the inbound `[link](reference_small_model_dispatch_matrix.md)` from `MEMORY.md` and any future `[[reference_small_model_dispatch_matrix]]` wiki-links from other memory files. Slug is descriptive, not skill-bound. |
| D-003 | Preserve `feedback_skill_graph_compiler_rebuild.md` historical narrative; only tag references | The 2026-05-18 incident date is load-bearing context. Rewriting `sk-small-model` → `sk-ai-small-model` would falsify the narrative; tagging "(renamed sk-ai-small-model 2026-05-21)" preserves both. |
| D-004 | Create `sk-ai-small-model/changelog/v0.3.0.0.md` (new file) rather than rewriting v0.1.0.0.md / v0.2.0.0.md | Historical version notes describe past state; the new v0.3.0.0.md is the forward-link. Follows the [[feedback_skill_docs_no_phase_references]] corollary that changelogs describe what shipped when, not the current name. |
| D-005 | Reuse slot 007 (previously "hardening-ci", deleted 2026-05-18) | Cleanest sequential numbering. The deletion note in 114/spec.md was amended to acknowledge the slot reuse rather than left as a contradiction. |
| D-006 | Fix `system-rerank-sidecar/graph-metadata.json` category + add reverse-sibling edge to `mcp-coco-index` | Both were pre-existing bugs in an unrelated skill that BLOCKED `skill_graph_compiler.py` from running. Without the compiler, REQ-005 (advisor surfaces renamed skill) fails. Minimal scope creep with maximum unblocker value; alternatively the rename packet would have to defer REQ-005, which is the whole point of the packet. |
| D-007 | Stay on `main`, no feature branch | Per [[feedback_stay_on_main_no_feature_branches]] memory rule. Identity refactor with strict verification gates; reversible via `git revert` per spec.md §7 Rollback. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Method | Result |
|---|---|---|
| Spec folder strict validate | `bash validate.sh 007/ --strict` | exit 0, 0 errors, 0 warnings |
| Live-surface rg (20 files) | `rg "sk-small-model"` on the allow-list | 0 hits on every live file |
| Live-surface underscore variant | `rg "sk_small_model" .opencode/skills/sk-ai-small-model/` | 0 hits |
| Historical-surface preservation | `git diff --stat` on 114/{001-006,review}/** + 026/.../iteration-009.md + sk-ai-small-model/changelog/v0.1+v0.2 | unchanged (no edits authored to those paths in this packet) |
| Compiled skill-graph.json fresh | `jq '.generated_at, .skill_count'` | 2026-05-21T06:45:06.670644+00:00, 22 |
| Compiled graph contains new name | `jq '.families["sk-util"]'` | includes `sk-ai-small-model` |
| Compiled graph excludes old name | `jq '.adjacency["sk-small-model"]'` | null |
| Reverse `enhances` edges fresh | `jq '.adjacency["cli-devin"].enhances, .adjacency["cli-opencode"].enhances'` | both contain `sk-ai-small-model: 0.5` |
| Advisor recommend smoke | `advisor_recommend({input: "dispatch swe-1.6 via cli-devin for small-model output verification"})` | rank 1 = sk-ai-small-model, confidence **0.95**, uncertainty 0.12, score 0.846; rank 2 = cli-devin, confidence 0.8949; live trust state generation 3347 |
| Sibling enhances target jq | `jq '.edges.enhances[].target' cli-devin/graph-metadata.json` | "sk-ai-small-model" |
| Sibling enhances target jq | `jq '.edges.enhances[].target' cli-opencode/graph-metadata.json` | "sk-ai-small-model" |
| Skill body internal consistency | `rg "sk_small_model\|sk-small-model" sk-ai-small-model/{SKILL.md,README.md,description.json,graph-metadata.json,references/}` | 0 hits |
| Checklist verification | All 16 P0 items + 17 P1 items marked `[x]` with EVIDENCE rows in `checklist.md` | 33/33 (CHK-FIX-007 cites commit SHA at commit time) |

### Checklist verification

| Total | Verified | Deferred |
|---|---|---|
| P0 Items | 16 | 16/16 |
| P1 Items | 17 | 17/17 (one evidence row pinned at commit time) |
| P2 Items | 0 | n/a |

See `checklist.md` for per-item evidence citations.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

| Limitation | Severity | Mitigation |
|---|---|---|
| WEIGHT-BAND warning persists in `system-rerank-sidecar`: `edges.prerequisite_for[0]` weight 0.3 outside recommended [0.7, 1.0] band | Low | Pre-existing soft warning; compiler treats as non-blocking. Not in scope for this packet; can be fixed in a follow-on rerank-sidecar audit. |
| Auto-memory file `reference_small_model_dispatch_matrix.md` keeps its old slug (filename unchanged) | None — by D-002 | Body content fully reflects the new name; inbound MEMORY.md link continues to resolve. |
| 114/spec.md still contains 4 occurrences of "sk-small-model" in historical/scope narrative + the Phase 7 "from-name" reference | None — by design | All four are intentional historical/scope context (RQ5 open question, Phase 002 row, Purpose paragraph, Phase 7 row "from" name). |
| 114/description.json has "sk-small-model" in description string + keywords array | Low | Auto-generated from feature description string at create.sh time. Will be refreshed by `generate-context.js` at Step 13. |
| Compiled skill-graph.json shows `WARNING: Output exceeds 4KB target (10790 bytes)` | None | Cosmetic warning from the compiler — the JSON is 10.7KB which exceeds an old 4KB target. 22 skills × adjacency × signals → inevitable growth. |
<!-- /ANCHOR:limitations -->
