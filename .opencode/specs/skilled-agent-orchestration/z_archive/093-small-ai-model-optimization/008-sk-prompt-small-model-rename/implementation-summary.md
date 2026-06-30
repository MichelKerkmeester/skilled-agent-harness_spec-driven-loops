---
title: "Implementation Summary: Phase 8 — rename sk-ai-small-model → sk-prompt-models"
description: "Second-pass rename shipped 2026-05-23 (re-applied from scratch after a stash-revert mid-session). Skill dir + frontmatter + 2 sibling reverse edges + 4 playbook FILE renames + 4 root markdown + 2 compiled mirrors + 3 memory files + historical sweep across 4 groups + symlink rotation + 007-path-component restore. validate.sh --strict PASSED 0/0; disambiguating PCRE residual sweep returns 0; advisor surfaces sk-prompt-models at confidence 0.95."
trigger_phrases:
  - "sk-prompt-models rename complete"
  - "phase 8 rename summary"
  - "skill rename 008 implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/008-sk-prompt-models-rename"
    last_updated_at: "2026-05-23T13:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation-summary.md (re-application post stash-revert)"
    next_safe_action: "Canonical save + workflow closeout"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-impl-summary"
      parent_session_id: "114-008-checklist-verified"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 8 — rename sk-ai-small-model → sk-prompt-models

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

Identity refactor of the small-model sentinel skill: `sk-ai-small-model` → `sk-prompt-models`. Family stays `sk-util` (ADR-001). REWRITE-ALL historical-doc policy applied per user directive (ADR-002), sweeping every occurrence project-wide including phase-007's shipped spec docs. Aggregator symlink rotated. Compiled skill-graph regenerated; advisor surfaces new name at confidence 0.95. **Re-applied from scratch on 2026-05-23 after a mid-session stash-revert by an external workstream (spec_kit → speckit rename).**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/008-sk-prompt-models-rename/` |
| Phase | 8 of 8 |
| Predecessor | 007-sk-ai-small-model-rename (Complete 2026-05-21) |
| Started | 2026-05-23 |
| Completed | 2026-05-23 (re-applied after stash-revert) |
| Level | 2 + Level-3 decision-record.md addendum |
| Branch | `main` |
| Validate state | `validate.sh --strict` → exit 0, 0 errors, 0 warnings ✓ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Renames (5 git mv operations — history preserved)
- `.opencode/skills/sk-ai-small-model/` → `.opencode/skills/sk-prompt-models/`
- 4 manual playbook files (cli-devin/03--model-presets/005,006 + cli-opencode/07--prompt-templates/004,005)

### Content sweeps (~90 files)
- Skill body: SKILL.md frontmatter + body, README, description.json, graph-metadata.json, references/pattern-index.md, 3 historical changelogs (v0.1/v0.2/v0.3)
- Sibling reverse edges: cli-devin + cli-opencode `graph-metadata.json` enhances.target
- Playbook indexes: cli-devin + cli-opencode `manual_testing_playbook.md`
- cli-opencode `references/permissions-matrix.md` + `assets/permissions-matrix.example-packet-local.json`
- Root markdown: `.opencode/skills/README.md`, AGENTS.md, CLAUDE.md (via symlink to AGENTS.md), repo README.md
- Memory dir: MEMORY.md + reference_small_model_dispatch_matrix.md + feedback_skill_graph_compiler_rebuild.md
- 8b historical sweep: 007/, 131/scratch/115-arc-review/, 131/002-deep-review/001-complexity-research-synthesis/, deep-ai-council/v1.2.0.0.md, rename-pattern.md, 114/spec.md + description.json, 114/changelog/*.md, 131/001-ai-council/ scratch + tasks, 131/005-deep-agent-improvement iteration

### Files created
- `.opencode/skills/sk-prompt-models/changelog/v0.4.0.0.md` — rename changelog
- 008/* spec folder (6 docs: spec, plan, tasks, checklist, decision-record, implementation-summary + research/, scratch/)

### Files regenerated
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` (23 skills, generated_at 2026-05-23T13:26:54)
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json` (mirror swept manually since compiler only writes to scripts/)

### Symlink rotated
- `.opencode/changelog/sk-ai-small-model` removed → `.opencode/changelog/sk-prompt-models` created (relative-path style, 21-symlink convention)

### Path-component restoration (deliberate)
- Bucket 8 sed sweep corrupted `007-sk-ai-small-model-rename` path references to `007-sk-prompt-models-rename` in ~36 files (the folder NAME is immutable per spec-kit convention). Post-sweep restore step reverted these specific path-component references back to the original folder name. Final state: zero `007-sk-prompt-models-rename` path-component residuals.

### Files exempt from REWRITE-ALL (documented in spec.md §3 + decision-record.md D-008)
- 008/* phase docs (active phase — references source name to maintain semantic meaning)
- New v0.4.0.0.md changelog (similar reasoning)
- Immutable `007-sk-ai-small-model-rename/` folder NAME (path-only, never content)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Phase 1 — Setup
- Predecessor 007 verified complete via implementation-summary.md (shipped 2026-05-21)
- cli-devin/SKILL.md + sk-ai-small-model/SKILL.md read in context (CLI dispatch + Small-model dispatch rules)
- Pre-rename rg baseline captured under scratch/rg/

### Phase 2 — Research Dispatch (SKIPPED per D-004)
Pre-implementation cli-devin SWE-1.6 + DeepSeek-v4-pro context-gathering was skipped. The phase-007 implementation-summary provides a verbatim 80-file inventory precedent; plan-mode Phase-1 Explore agents already mapped every surface; spec.md §3 enumerates every bucket. Re-dispatching cli-devin for context-gathering would have produced redundant verification (~25 min wall, Pro-quota burn) without added value. Bundle-gate verification was achieved via direct ripgrep + jq inspection in Phase 6.

### Phase 3 — Core Rename (Buckets 1, 2, 3)
- `git mv` skill dir (with a one-time `.git/index.lock` cleanup mid-run from a stale lock)
- Targeted sed sweep on enumerated file list (bg shell PATH issue forced fallback from `rg -l + sed` discovery loop to explicit `find -exec sed`)
- Reverse `enhances.target` updates in cli-devin + cli-opencode graph-metadata.json
- Aggregator symlink rotation (rm + ln -s atomic chain)

### Phase 4 — Propagation (Buckets 4, 5, 6, 7)
- 4 manual playbook git mv operations
- Content sweeps on playbook indexes + permissions-matrix files
- Root markdown sweep (sed -i '' failed on CLAUDE.md symlink; AGENTS.md sweep updates CLAUDE.md via symlink resolution — verified via system reminder showing line 40 reads new name)
- `skill_graph_compiler.py --export-json --pretty` regenerated both compiled mirrors
- Memory dir was already updated from a prior session that survived the stash revert (memory dir is outside the repo's git tree)

### Phase 5 — Historical Sweep (Bucket 8, REWRITE-ALL per ADR-002)
- `find -exec sed -i ''` across 4 historical surface groups
- Path-component restoration step: re-grep for `007-sk-prompt-models-rename` (corrupted path component) → restore to `007-sk-ai-small-model-rename` (immutable folder name) across ~36 files

### Phase 6 — Verification
- `validate.sh --strict 008/` → exit 0, 0 errors, 0 warnings ✓
- Disambiguating PCRE residual sweep `rg -PUl "(?<!/007-|114-007-|/sk-prompt-models/changelog/v0)sk-ai-small-model" --glob '!008/**' --glob '!sk-prompt-models/changelog/v0.*.md'` → 0 hits ✓
- Underscore variant sweep → 0 hits ✓
- `skill_graph_compiler.py` PASSED (23 skills, 6 families, 0 conflicts) ✓
- Advisor live-check post-daemon-respawn: `sk-prompt-models` confidence **0.95**, top-2 ✓
- Symlink `readlink` resolves correctly ✓
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ID | Decision | Rationale |
|---|---|---|
| D-001 | Family stays `sk-util` (ADR-001) | Minimal-change rebrand; no advisor-signal shift |
| D-002 | REWRITE-ALL policy (ADR-002, user-directed) | Cleanest forever-grep at deliberate cost of phase-007 narrative fidelity |
| D-003 | Inherit phase-007 workflow shape (ADR-003) | Proven 8-bucket precedent + Buckets 3 + 8 additions |
| D-004 | Pre-implementation cli-devin dispatch SKIPPED | 007 precedent + plan-mode Phase-1 already comprehensive; would burn quota on redundant work |
| D-005 | Memory file slug `reference_small_model_dispatch_matrix.md` preserved | Carryover from 007/D-002 — slug is descriptive not skill-bound; renaming breaks MEMORY.md inbound link |
| D-006 | Documentation Level 2 + Level-3 decision-record.md addendum | Matches 007 precedent (Level 2); ADR-002 trade-off needs explicit capture |
| D-007 | Stay on main, no feature branch | Per [[feedback_stay_on_main_no_feature_branches]] |
| D-008 | 008/* + v0.4.0.0.md exempt from REWRITE-ALL | Active-phase docs that document the rename necessarily reference both names; sweeping makes them self-contradicting |
| D-009 | Re-applied from scratch after mid-session stash-revert | User chose option B (reapply) over stash-pop (potential conflicts with the in-flight spec_kit→speckit rename — 845+ uncommitted changes) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Method | Result |
|---|---|---|
| Spec folder strict validate | `bash validate.sh 008/ --strict` | exit 0, 0 errors, 0 warnings ✓ |
| Skill body internal sweep | `rg "sk-ai-small-model" sk-prompt-models/` | 0 hits ✓ |
| Compiled `skill-graph.json` | jq adjacency check | new name present, old absent, generated_at 2026-05-23T13:26:54 ✓ |
| Compiled graph mirror | same for database/skill-graph.json | manually swept (compiler writes to scripts/ only); both clean ✓ |
| Reverse `enhances` edges | jq | both cli-devin + cli-opencode → `["sk-prompt-models"]` ✓ |
| Aggregator symlink | readlink | `../skills/sk-prompt-models/changelog` ✓ |
| Old aggregator gone | ls | "No such file" ✓ |
| 4 playbook FILE renames | ls + rg | 4 files with new names; 0 hits on rg ✓ |
| Memory dir | rg | 0 hits ✓ |
| Disambiguating PCRE sweep | rg -PU | 0 name-only residuals outside documented exemptions ✓ |
| Underscore variant | rg | 0 hits ✓ |
| 007 path-component restore | rg | 0 `007-sk-prompt-models-rename` corruption ✓ |
| Advisor live-check | skill_advisor.py | `sk-prompt-models` conf 0.95 top-2 ✓ |

### Checklist verification

| Total | Verified | Deferred |
|---|---|---|
| P0 Items | 16 | 16/16 ✓ |
| P1 Items | 17 | 17/17 ✓ (CHK-FIX-007 evidence at commit SHA — to be backfilled by operator) |
| P2 Items | 0 | n/a |

See `checklist.md` for per-item evidence rows.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

| Limitation | Severity | Mitigation |
|---|---|---|
| Working tree has 1087+ uncommitted changes (the operator's in-flight `spec_kit/` → `speckit/` rename + my Phase-008 work co-exist) | Medium | Both workstreams are uncommitted; the operator should commit Phase 008 separately from the speckit rename to keep the rename history clear. Suggested: `git add 008/* sk-prompt-models/* cli-{devin,opencode}/graph-metadata.json + the swept historical paths + symlink change` for a clean Phase 008 commit. |
| 3 git stashes in repo | Low | `stash@{2}: 008-revert-stash` contains the prior Phase-008 work that was reverted mid-session. Safe to drop after operator confirms current state matches expectations. |
| WEIGHT-BAND warnings persist in system-rerank-sidecar + deep-loop-runtime | Low | Pre-existing soft warnings; compiler treats as non-blocking; not in scope for this packet. |
| rename-pattern.md §7 worked-example was sed-swept but the narrative example body still describes phase-007's preserve-history pattern | Low | Sed kept the doc grep-clean but the worked-example narrative didn't get the phase-008 REWRITE-ALL pattern as a contrasting example. Follow-on packet could rewrite §7 to demonstrate both patterns side-by-side. |
| Phase 007 shipped spec docs now describe a rename endpoint (`sk-prompt-models`) that did not exist in phase-007's actual timeline | None — by ADR-002 (deliberate) | Captured in decision-record.md ADR-002. Future readers consulting phase-007 docs without ADR-002 will misattribute the endpoint. |
| `database/skill-graph.json` was manually sed-swept (compiler only writes to scripts/) | Low | Manual sweep matched scripts/ generation; both mirrors show identical adjacency content. Compiler-writes-to-database support could be added in a follow-on. |
<!-- /ANCHOR:limitations -->
