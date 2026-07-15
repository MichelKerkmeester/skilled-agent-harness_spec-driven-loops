---
title: "Implementation Summary: System Spec Kit Codegraph Residue Audit"
description: "Audited system-spec-kit user-facing docs after the code-graph extraction, redirected stale ownership and package-path references to system-code-graph, and preserved intentional historical/cross-skill mentions."
trigger_phrases:
  - "012 codegraph residue audit summary"
  - "system spec kit code graph residue complete"
  - "post 014 code graph docs cleanup complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-026-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-15T13:30:00Z"
    last_updated_by: "main-agent-026-phase2"
    recent_action: "phase2_complete_strict_validate_passed"
    next_safe_action: "commit_phase2"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/install_guides/README.md"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_debug.yaml"
      - ".opencode/commands/doctor/mcp.md"
      - ".vscode/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-026-residue-audit-phase2"
      parent_session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-system-spec-kit-codegraph-residue-audit |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The audit separated stale system-spec-kit Code Graph ownership residue from legitimate cross-skill runtime references. Root docs now describe Code Graph as owned by the sibling `.opencode/skills/system-code-graph/` skill, while feature catalog and manual playbook records keep their useful historical/test content with paths redirected to the extracted package.

### 4-Bucket Triage

Counts are raw scoped grep matches from user-facing markdown docs, not file counts.

| Bucket | Count | Treatment |
|--------|-------|-----------|
| STALE_REMOVE | 28 | Removed from root docs where system-spec-kit claimed embedded Code Graph package ownership or detailed old implementation behavior. |
| STALE_REWRITE | 70 | Rewritten to `.opencode/skills/system-code-graph/` paths or sibling-skill ownership prose. |
| LEGITIMATE_HISTORICAL | 128 | Preserved in delivered feature catalog and manual playbook records where the historical feature or scenario remains useful. |
| LEGITIMATE_CROSS_SKILL | 86 | Preserved where system-spec-kit startup, resume, memory, hooks, or operator playbooks intentionally consume stable `code_graph_*`, `detect_changes`, or `ccc_*` surfaces. |
| **Total references found** | **312** | Initial scoped survey total before cleanup. |

### Specific Edits Made

Root ownership docs:

- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/README.md`
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md`

Feature catalog redirects:

- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/feature_catalog/03--discovery/04-detect-changes-preflight.md`
- `.opencode/skills/system-spec-kit/feature_catalog/04--maintenance/03-doctor-router-and-manifest-dispatch.md`
- `.opencode/skills/system-spec-kit/feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md`
- `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/25-code-graph-phase-dag-runner.md`
- `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md`
- `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md`

Manual playbook redirects:

- `.opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/271-code-graph-phase-dag-runner.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md`

Packet docs:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/graph-metadata.json`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed on `main`, avoided editing `.opencode/skills/system-code-graph/`, and kept unrelated dirty worktree changes out of the intended staging set. A self-check caught unrelated Skill Advisor catalog/playbook deletions during the session; those files and the manual playbook index row were restored before verification. Git staging then failed because the sandbox could not create `.git/index.lock`, so the changes remain unstaged and `COMMIT_SHA=uncommitted`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve stable tool-ID mentions | Startup and recovery surfaces still expose `code_graph_*`, `detect_changes`, and `ccc_*` as cross-skill runtime affordances. Removing those would make operator docs less accurate. |
| Rewrite package paths instead of deleting historical playbooks | The playbooks still document useful validation contracts, but their source anchors needed to point at `system-code-graph`. |
| Leave DB env-var docs untouched | `SPECKIT_CODE_GRAPH_DB_DIR` style references are legitimate cross-skill plumbing and were explicitly out of cleanup scope. |
| Use current package layout | The sibling skill currently owns `mcp_server/lib/`, `handlers/`, `tools/`, `tests/`, and `tool-schemas.ts`; redirected docs use those paths. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-check `ls .../013-system-code-graph-extraction/ \| grep '^012-'` | PASS, no existing `012-*` folder. |
| `git branch --show-current` | PASS, `main`. |
| Initial scoped raw grep | PASS, 312 raw matches classified. |
| Stale-residue grep for old paths, namespace, and "code-graph subsystem" wording | PASS, exit 1 with no scoped markdown matches. |
| Post-cleanup raw grep | PASS, 284 remaining matches, all categorized as historical or cross-skill. |
| `git add -- <scoped files>` | FAIL, sandbox denied `.git/index.lock` creation with `Operation not permitted`; no 012 files were staged. |
| `git diff --cached --name-only` | PASS for this packet, no 012 files or sibling `system-code-graph` paths staged; cached diff is empty. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit --strict` | PASS, exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Raw Code Graph mentions remain by design.** The audit goal was stale residue cleanup, not erasing every code-graph term from system-spec-kit docs. Cross-skill runtime and historical validation references remain documented.
2. **Git commit is blocked in this sandbox.** Staging failed before commit because `.git/index.lock` could not be created. The requested commit message is not applied; report `COMMIT_SHA=uncommitted`.
3. **Parallel packet dirt remains outside this packet.** The worktree already contained unrelated changes and pre-existing cached files. They were not modified for this audit.
<!-- /ANCHOR:limitations -->

---

## Phase 2 — Install Guide + Doctor Coverage (added 2026-05-15)

### Scope Delivered

Authored `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` (336 lines, 9 sections, `sk-doc-template: skill_reference_install_guide`) so the standalone `mk_code_index` MCP server has parity with `mcp-coco-index` and `system-skill-advisor`. Patched the master install README to include both `mk_code_index` and `mk_skill_advisor` in §7.1 Component Matrix, §7.3 Bundles, new §10.4/§10.5 Phase 3 subsections, §19 Related Documents, and reconciled aggregate counts at lines 17, 58, 60, 1573. Patched `/doctor:mcp install` and `/doctor:mcp debug` surfaces: added `diagnose_mk_code_index()` and `diagnose_mk_skill_advisor()` to `mcp-doctor.sh`, fixed the latent line-533 typo (`diagnose_mk-spec-memory` → `diagnose_mk_spec_memory`), extended `valid_values` and server-definition / repair_actions blocks in both YAML assets, and updated `mcp.md` help copy from "all 4" to "all 6 MCP servers". Fixed the broken `.vscode/mcp.json` entry that still wired `system_code_graph` → deleted `.opencode/bin/system-code-graph-launcher.cjs`; renamed to `mk_code_index` with the canonical `_NOTE_1_DB` / `_NOTE_2_TOOLS` / `_NOTE_3_INDEX_DEFAULTS` convention and inserted the previously-missing `mk_skill_advisor` block. Final server order matches the canonical `opencode.json`: sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, cocoindex_code, code_mode.

### Phase 2 Verification Evidence

| Check | Result |
|-------|--------|
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` exists with sk-doc template marker | PASS — 1 marker, balanced ANCHOR pairs |
| `.vscode/mcp.json` no longer references `system-code-graph-launcher.cjs` | PASS — `grep -c 'system-code-graph-launcher' .vscode/mcp.json` returns 0 |
| `.vscode/mcp.json` references `mk-code-index-launcher.cjs` and has all 6 server entries | PASS — entries: sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, cocoindex_code, code_mode |
| All 6 runtime configs reference `mk_code_index` | PASS — opencode.json(3), .claude/mcp.json(3), .codex/config.toml(4), .gemini/settings.json(3), .devin/config.json(3), .vscode/mcp.json(3) |
| `mcp-doctor.sh` registers `diagnose_mk_code_index()` and `diagnose_mk_skill_advisor()` | PASS — `grep -cE '^diagnose_(mk_code_index\|mk_skill_advisor)\(\)'` returns 2 |
| `mcp-doctor.sh` line-533 hyphen typo fixed | PASS — `should_run "mk-spec-memory" && diagnose_mk_spec_memory` |
| `mcp-doctor.sh --help` lists 6 MCP servers | PASS — names line + 6 entries in Servers Checked block |
| `mcp-doctor.sh --server mk_code_index --json` runs end-to-end | PASS — exit 0/1/2, `mk_code_index` appears in checks array |
| `doctor_mcp_install.yaml` valid_values + servers + install_guides include both | PASS — 6 entries each |
| `doctor_mcp_debug.yaml` valid_values + repair_actions + install_guides include both | PASS — 6 entries each |
| `mcp.md` help copy reads "all 6 MCP servers" | PASS — lines 61, 115, 146 |
| Master install README §7.1, §7.3, §10.4, §10.5, §19 + aggregate counts | PASS — `grep -c '"all 4 MCP"' .opencode/install_guides/README.md` returns 0 |
| Strict packet validate | PASS — exit 0, errors 0, warnings 0 |

### Phase 2 Files Changed

```
NEW    .opencode/skills/system-code-graph/INSTALL_GUIDE.md            (336 lines)
MOD    .opencode/install_guides/README.md                             (+50 lines / -8)
MOD    .opencode/commands/doctor/scripts/mcp-doctor.sh                (+200 lines, fixed line-533 typo)
MOD    .opencode/commands/doctor/assets/doctor_mcp_install.yaml       (+50 lines)
MOD    .opencode/commands/doctor/assets/doctor_mcp_debug.yaml         (+40 lines)
MOD    .opencode/commands/doctor/mcp.md                               (+8 lines)
MOD    .vscode/mcp.json                                               (-14 / +28 lines: rename + mk_skill_advisor insert)
MOD    .opencode/specs/...026.../026-system-spec-kit-codegraph-residue-audit/spec.md             (Phase 2 scope block)
MOD    .opencode/specs/...026.../026-system-spec-kit-codegraph-residue-audit/plan.md             (Phase 2 plan block)
MOD    .opencode/specs/...026.../026-system-spec-kit-codegraph-residue-audit/tasks.md            (21 P2 tasks)
MOD    .opencode/specs/...026.../026-system-spec-kit-codegraph-residue-audit/implementation-summary.md (this section)
```
