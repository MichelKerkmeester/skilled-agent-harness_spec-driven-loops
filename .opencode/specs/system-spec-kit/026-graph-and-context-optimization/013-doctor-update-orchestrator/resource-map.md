---
title: "Resource Map: 013 Doctor Update Orchestrator"
description: "Path catalog for the 013 packet: 5 new commands, 21 YAML assets, 1 migration manifest, 8 packet docs, plus existing pattern sources (read-only references)."
trigger_phrases:
  - "013 resource map"
  - "doctor update paths"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored resource map ledger"
    next_safe_action: "Author decision-record.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 47
- **By category**: READMEs=0, Documents=10, Commands=5, Agents=0, Skills=0, Specs=2, Scripts=0, Tests=0, Config=21, Meta=9
- **Missing on disk**: 0 (all PLANNED entries are intentional new files)
- **Scope**: All files created, updated, analyzed, or cited during packet `013-doctor-update-orchestrator` — covers the 5 new doctor commands, 21 YAML assets, 1 migration manifest, packet docs, and read-only pattern sources.
- **Generated**: 2026-05-09T11:30:00+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents — 013 packet-local

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-.../013-.../spec.md` | Created | OK | Level 2 spec (REQ-001..REQ-023) |
| `.opencode/specs/system-spec-kit/026-.../013-.../plan.md` | Created | OK | 5-phase plan + dispatch design |
| `.opencode/specs/system-spec-kit/026-.../013-.../tasks.md` | Created | OK | T-001..T-059 task graph |
| `.opencode/specs/system-spec-kit/026-.../013-.../checklist.md` | Created | OK | P0/P1/P2 verification checklist |
| `.opencode/specs/system-spec-kit/026-.../013-.../resource-map.md` | Created | OK | This file |
| `.opencode/specs/system-spec-kit/026-.../013-.../decision-record.md` | Created | PLANNED | 7 council ADRs + tx-model ADR-001 |
| `.opencode/specs/system-spec-kit/026-.../013-.../implementation-summary.md` | Created | PLANNED | Authored Phase E close (T-056) |
| `.opencode/specs/system-spec-kit/026-.../013-.../description.json` | Created | PLANNED | Auto via `generate-context.js` (T-008) |
| `.opencode/specs/system-spec-kit/026-.../013-.../graph-metadata.json` | Created | PLANNED | Auto via `generate-context.js` (T-008) |
| `.opencode/specs/system-spec-kit/026-.../013-.../scratch/` | Created | OK | Smoke-test logs + dispatch logs (Phase B + E) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands — 5 new doctor commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/doctor/memory.md` | Created | PLANNED | `/doctor:memory` entrypoint (Track B1) |
| `.opencode/commands/doctor/causal-graph.md` | Created | PLANNED | `/doctor:causal-graph` entrypoint (Track B2) |
| `.opencode/commands/doctor/deep-loop.md` | Created | PLANNED | `/doctor:deep-loop` entrypoint (Track B3) |
| `.opencode/commands/doctor/cocoindex.md` | Created | PLANNED | `/doctor:cocoindex` entrypoint (Track B4) |
| `.opencode/commands/doctor/update.md` | Created | PLANNED | `/doctor:update` orchestrator (Track C, council 10-line spec) |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:config -->
## 9. Config — YAML assets + migration manifest

### Per-mode YAML assets (21 files)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/doctor/assets/doctor_memory_{auto,confirm,apply,apply-confirm}.yaml` | Created | PLANNED | 4 assets for `/doctor:memory` |
| `.opencode/commands/doctor/assets/doctor_causal-graph_{auto,confirm,apply,apply-confirm}.yaml` | Created | PLANNED | 4 assets for `/doctor:causal-graph` |
| `.opencode/commands/doctor/assets/doctor_deep-loop_{auto,confirm,apply,apply-confirm}.yaml` | Created | PLANNED | 4 assets for `/doctor:deep-loop` |
| `.opencode/commands/doctor/assets/doctor_cocoindex_{auto,confirm,apply,apply-confirm}.yaml` | Created | PLANNED | 4 assets for `/doctor:cocoindex` |
| `.opencode/commands/doctor/assets/doctor_update_{default,auto,confirm,apply,apply-confirm}.yaml` | Created | PLANNED | 5 assets for `/doctor:update` orchestrator |

### Migration manifest

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | Created | PLANNED | Per-version deprecations + script declarations (3.3.0.0 → 3.4.1.0 chain) |

### Per-version migration scripts (optional, REQ-020)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/*.{py,sh,ts}` | Created | PLANNED | One script per declared version step (optional) |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta — runtime artifacts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.flock` | Created | PLANNED (runtime) | OS-level lock for orchestrator (auto-managed) |
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.lock` | Created | PLANNED (runtime) | PID-file fallback for stale-detection |
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json` | Created | PLANNED (runtime) | State-log per `/doctor:update` invocation |
| `.opencode/skills/system-spec-kit/mcp_server/database/<name>.sqlite.pre-doctor-update.<version>.<timestamp>.bak` | Created | PLANNED (runtime) | VACUUM INTO snapshots; auto-cleanup > 30 days |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:specs -->
## 6. Specs — sibling + parent context

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json` | Updated | OK | Parent — `derived.last_active_child_id` ← `013-doctor-update-orchestrator` (T-008); manual fields restored after save |
| `.opencode/specs/system-spec-kit/026-.../012-causal-graph-channel-routing/spec.md` | Cited | OK | Predecessor packet; provides causal_edges starting state for /doctor:causal-graph gold-battery |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:reuse -->
## Pattern Sources (read-only references)

| Path | Purpose |
|------|---------|
| `.opencode/commands/doctor/code-graph.md` | Canonical Markdown entrypoint shape (frontmatter + Execution Protocol + Constraints + Unified Setup Phase) |
| `.opencode/commands/doctor/assets/doctor_code-graph_{auto,confirm,apply,apply-confirm}.yaml` | Canonical YAML workflow shape (validate_targets, snapshot, mutate, post-verify, rollback) |
| `.opencode/commands/doctor/skill-advisor.md` | Reference for less-mutating `:auto/:confirm` doctor commands |
| `.opencode/commands/doctor/assets/doctor_skill-advisor_{auto,confirm}.yaml` | Reference for `:auto` and `:confirm` modes only |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Pattern for command-side Python utilities |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` + `mcp-doctor-lib.sh` | Pattern for shell-script libraries |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` | Pattern for repo-rooted `cd $REPO_ROOT && python3 ...` invocation |
| `.opencode/skills/system-spec-kit/mcp_server/database/README.md` | Database directory contract (auto-init behavior, env var overrides) |
<!-- /ANCHOR:reuse -->

---

<!-- ANCHOR:per-command-impact -->
## Per-Command Blast Radius

| Command | New files | Modified files | New runtime artifacts |
|---------|-----------|----------------|----------------------|
| `/doctor:memory` | 1 md + 4 yaml | none | Snapshots of context-index*.sqlite |
| `/doctor:causal-graph` | 1 md + 4 yaml | causal_edges table (add-only) | Snapshot of context-index.sqlite |
| `/doctor:deep-loop` | 1 md + 4 yaml | deep-loop-graph.sqlite | Snapshot |
| `/doctor:cocoindex` | 1 md + 4 yaml | CocoIndex external store | Snapshot (CocoIndex paths) |
| `/doctor:update` (orchestrator) | 1 md + 5 yaml | All of the above | flock + state-log + N snapshots |
<!-- /ANCHOR:per-command-impact -->

---

<!--
RESOURCE-MAP + L2 (~140 lines)
- 47 references across Documents, Commands, Config (YAML + manifest), Meta (runtime), Specs, Pattern Sources
- Per-command blast radius table for at-a-glance impact assessment
- Action/Status vocabulary follows v1.1 template
-->
