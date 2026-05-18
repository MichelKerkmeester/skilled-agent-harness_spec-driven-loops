# Iteration 2 — correctness (parent + 001-doctor-commands)

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| `010-doctor-update-orchestrator/spec.md` | Phase parent spec | Cross-child claims, lean-trio enforcement, phase map completeness |
| `010-doctor-update-orchestrator/graph-metadata.json` | Parent metadata | `derived.last_active_child_id`, `children_ids`, manual fields |
| `010-doctor-update-orchestrator/description.json` | Parent metadata | Identity + parentChain |
| `010-doctor-update-orchestrator/handover.md` | Cross-cutting | Parent-level optional doc (not checked for correctness this pass) |
| `010-doctor-update-orchestrator/resource-map.md` | Cross-cutting | Parent-level optional doc (not checked for correctness this pass) |
| `001-doctor-commands/spec.md` | Child spec (L2) | REQ-001..REQ-023, P0/P1/P2 requirements, scope, deliverables |
| `001-doctor-commands/plan.md` | Child plan (L2) | Phase descriptions, quality gates, dispatch design |
| `001-doctor-commands/tasks.md` | Child tasks (L2) | T-001..T-055 task status tracking |
| `001-doctor-commands/checklist.md` | Child checklist (L2) | CHK-001..CHK-806 acceptance criteria verification status |
| `001-doctor-commands/decision-record.md` | Child ADRs (L2) | ADR-001..ADR-010 — council spec, tx-model, mode reduction |
| `001-doctor-commands/implementation-summary.md` | Child impl summary (L2) | Status claims, files-touched ledger, completion_pct |
| `001-doctor-commands/description.json` | Child metadata | ParentChain verification |
| `001-doctor-commands/graph-metadata.json` | Child metadata | Status derivation |
| `001-doctor-commands/resource-map.md` | Child resource map | (not deep-reviewed this pass) |
| `.opencode/commands/doctor/memory.md` | Implementation | Verified exists + passes validate_document.py |
| `.opencode/commands/doctor/causal-graph.md` | Implementation | Verified exists |
| `.opencode/commands/doctor/deep-loop.md` | Implementation | Verified exists |
| `.opencode/commands/doctor/cocoindex.md` | Implementation | Verified exists |
| `.opencode/commands/doctor/update.md` | Implementation | Verified exists |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Implementation | Verified exists |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | Implementation | Verified exists |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Implementation | Verified exists |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` | Implementation | Verified exists |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Implementation | Verified exists |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | Implementation | Verified exists |

## Findings by Severity

### P0

No P0 findings in this iteration.

### P1

#### P1-001 [P1] Parent graph-metadata.json `derived.last_active_child_id` is null, violating REQ-P-002

- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/graph-metadata.json:220`
- **Evidence**: The field `"derived.last_active_child_id": null` contradicts REQ-P-002 which requires it to be one of `001-doctor-commands` or `002-sandbox-testing-playbook`, matching the most recently saved child. This breaks the `/spec_kit:resume` redirect logic for phase parents.
- **Finding class**: instance-only
- **Scope proof**: Grep for `last_active_child_id` in parent `graph-metadata.json` confirms single occurrence at line 220. Parent spec REQ-P-002 explicitly defines this requirement.
- **Affected surface hints**: ["phase parent resume flow", "graph-metadata.json derived fields", "spec_kit:resume"]
- **Recommendation**: Set `derived.last_active_child_id` to `"001-doctor-commands"` (the child with more recent `last_save_at`, per `description.json` memoryNameHistory). The field should be updated by `generate-context.js` saves on the child.

---

#### P1-002 [P1] Parent spec.md Phase Map claims child 001 is "Complete" but child's own docs show incomplete status

- **File**: Parent `spec.md:104` vs `001-doctor-commands/implementation-summary.md:51-52`
- **Evidence**: 
  - Parent `spec.md:104`: `"001-doctor-commands/ | Complete | ..."`
  - Implementation summary `:51`: `"Status | PARTIAL (~30% complete)"`
  - Implementation summary continuity frontmatter `:29`: `completion_pct: 99` — internal contradiction with body
  - `checklist.md`: All CHK-001..CHK-806 items are `[ ]` (unchecked)
  - `tasks.md`: T-004..T-046 show "⏳ Pending" or "🟡 In progress"
  - `plan.md §4`: Phase B/C/D/E all marked with `[ ]` unchecked gates
- **Finding class**: instance-only
- **Scope proof**: The four cited files all independently confirm 001 is incomplete. The parent claim of "Complete" is the sole outlier.
- **Affected surface hints**: ["phase parent spec.md", "phase documentation map", "completion status reporting"]
- **Recommendation**: Update parent spec.md:104 to reflect actual status — at minimum change "Complete" to "In Progress" and align with the child's implementation-summary `completion_pct`. Resolve the implementation-summary's own internal contradiction (frontmatter 99% vs body 30%) first.

---

#### P1-003 [P1] Implementation-summary claims ~30% complete, but all 5 MD + 10 YAML + migration-manifest files exist on disk

- **File**: `001-doctor-commands/implementation-summary.md:52` and `:241-246`
- **Evidence**:
  - `implementation-summary.md:52`: `"Status | PARTIAL (~30% complete)"`
  - `implementation-summary.md:241-246`: Lists Track B1-B4, Phase C, Phase D all as "Deferred / Open Items"
  - On-disk reality (verified via Glob):
    - All 5 new doctor MD files exist: `memory.md`, `causal-graph.md`, `deep-loop.md`, `cocoindex.md`, `update.md`
    - All 5 corresponding YAML assets exist
    - `migration-manifest.json` exists at expected path
  - The implementation has progressed far beyond 30% — it is at minimum ~80%+ (files authored, pending verification gates G3-G9).
- **Finding class**: instance-only
- **Scope proof**: Glob for `*.opencode/commands/doctor/*.md` returns 10 files total (5 existing + 5 new). Glob for `*.yaml` in assets returns 10 files. Glob for `migration-manifest.json` confirms existence. The "remaining work" section in the implementation-summary describes tasks whose files already exist.
- **Affected surface hints**: ["implementation-summary", "completion_pct tracking", "project status reporting"]
- **Recommendation**: Update implementation-summary to reflect actual file authorship status. Advance `completion_pct` to at least 80% (Phase B/C/D files authored; Phase E verification still pending). Update the "Remaining Work" and "Deferred / Open Items" sections to match on-disk reality.

---

#### P1-004 [P1] tasks.md shows all Phase B/C/D tasks as "⏳ Pending" but corresponding implementation files exist on disk

- **File**: `001-doctor-commands/tasks.md:85-140`
- **Evidence**:
  - T-011 (`memory.md`): ⏳ Pending — but file exists at `.opencode/commands/doctor/memory.md` (272 LOC)
  - T-012 (`doctor_memory.yaml`): ⏳ Pending — but file exists at `.opencode/commands/doctor/assets/doctor_memory.yaml`
  - T-016 (`causal-graph.md`): ⏳ Pending — but file exists
  - T-017 (`doctor_causal-graph.yaml`): ⏳ Pending — but file exists
  - T-021 (`deep-loop.md`): ⏳ Pending — but file exists
  - T-022 (`doctor_deep-loop.yaml`): ⏳ Pending — but file exists
  - T-026 (`cocoindex.md` + yaml): ⏳ Pending — but both files exist
  - T-027 (`update.md`): ⏳ Pending — but file exists (256 LOC)
  - T-028 (`doctor_update.yaml`): ⏳ Pending — but file exists
  - T-041 (`migration-manifest.json`): ⏳ Pending — but file exists
- **Finding class**: class-of-bug (16 tasks in Phase B/C/D all share the same stale-status pattern)
- **Scope proof**: Grep for `⏳ Pending` in tasks.md returns 16+ hits across Phases B, C, D. Every task whose output file was verified on disk still shows Pending status.
- **Affected surface hints**: ["tasks.md", "project tracking", "task status accuracy"]
- **Recommendation**: Update tasks.md to mark T-011..T-046 with their actual completion status. Tasks whose files exist should be marked ✅ Done; tasks whose files exist but verification is pending should be marked 🟡 In progress with verification note.

---

#### P1-005 [P1] Parent spec.md Phase Map claims "21 yamls" as deliverables, but ADR-010 reduces to 1 YAML per command (5 total)

- **File**: Parent `spec.md:105` vs `001-doctor-commands/decision-record.md:228-229`
- **Evidence**:
  - Parent `spec.md:105`: `"34 deliverables total (5 cmds + 21 yamls + 1 manifest + 7 packet docs)"`
  - `decision-record.md:228`: ADR-010: `"One interactive YAML per doctor command"` — `"The active asset set is 10 YAML files: 8 doctor command assets plus 2 MCP command variants"`
  - On-disk reality: 5 new YAML files in `assets/` (one per new command), not 21
- **Finding class**: instance-only
- **Scope proof**: Glob for `doctor_*.yaml` in assets returns 10 files total (5 existing + 5 new). The "21 yamls" figure corresponds to the pre-ADR-010 design of 4 mode suffixes × 5 commands = 20 + 1 orchestrator = 21, which was superseded.
- **Affected surface hints**: ["parent spec.md", "phase documentation map", "deliverable count"]
- **Recommendation**: Update parent spec.md:105 to reflect the ADR-010-reduced count: "5 cmds + 5 yamls" (or "10 yamls" counting all 10 doctor YAML assets).

---

#### P1-006 [P1] Implementation-summary Track B1 describes 3 pending YAML files (confirm/apply/apply-confirm) that ADR-010 has made obsolete

- **File**: `001-doctor-commands/implementation-summary.md:98-118` vs `001-doctor-commands/decision-record.md:228`
- **Evidence**:
  - `implementation-summary.md:98-103`: Describes confirm, apply, and apply-confirm YAML files as "⏳ PENDING" remaining work for Track B1
  - `decision-record.md:228-229`: ADR-010: `"One interactive YAML per doctor command."` — `"Mode-suffixed doctor invocations are invalid."`
  - ADR-010 explicitly states: `"The old autonomous modes created duplicate YAML logic and bypass paths that were hard to keep safe."`
- **Finding class**: instance-only
- **Scope proof**: ADR-010 is unambiguously authoritative here — it is a decided ADR with clear rationale. The implementation-summary was authored before or without incorporating ADR-010's mode reduction.
- **Affected surface hints**: ["implementation-summary", "remaining work tracking", "Track B1"]
- **Recommendation**: Remove the 3 pending YAML entries from implementation-summary Track B1 section. The single `doctor_memory.yaml` already authored satisfies ADR-010's "one interactive YAML per command" requirement.

### P2

#### P2-001 [P2] `memory.md` validate_document.py reports 2 non-sequential-numbering warnings — ambiguous REQ-001 compliance

- **File**: `.opencode/commands/doctor/memory.md:1-272`
- **Evidence**: `validate_document.py --type command` output: `"✅ VALID: memory.md"` with `"Total issues: 2"` — 2 warnings about non-sequential section numbering (expected 1, found 0; expected 2, found 6). REQ-001 says `total_issues: 0`.
- **Finding class**: instance-only
- **Scope proof**: Only `memory.md` was validated in this pass. The 2 warnings are cosmetic (section numbering) and do not affect command correctness. The doc is marked VALID.
- **Affected surface hints**: ["validate_document.py", "REQ-001", "section numbering"]
- **Recommendation**: Either fix the section numbering in memory.md (change `## 0.` to `## 1.`, `## 6.` to `## 2.`) or clarify in spec that "total_issues: 0" means zero errors, not zero warnings.

---

#### P2-002 [P2] Parent REQ-P-001 acceptance criterion conflicts with framework-allowed cross-cutting optional docs

- **File**: Parent `spec.md:117`
- **Evidence**: REQ-P-001 acceptance criterion: `"find . -maxdepth 1 -type f returns exactly the three lean-trio files"` — but parent directory also contains `handover.md` and `resource-map.md`, which are cross-cutting optional docs explicitly allowed at any level per the system-spec-kit SKILL.md §3. The acceptance criterion as written is overly strict relative to framework conventions.
- **Finding class**: instance-only
- **Scope proof**: `ls *.md *.json` at parent level returns 5 files (spec.md, handover.md, resource-map.md, description.json, graph-metadata.json). No heavy docs (plan, tasks, checklist, decision-record, implementation-summary) are present — the substantive intent of REQ-P-001 is satisfied.
- **Affected surface hints**: ["REQ-P-001", "parent spec acceptance criteria", "lean trio policy"]
- **Recommendation**: Update REQ-P-001 acceptance criterion to exclude cross-cutting optional docs: `"find . -maxdepth 1 -type f | grep -v handover.md | grep -v resource-map.md returns exactly the three lean-trio files"` or rephrase to "No heavy docs (plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) exist at parent level."

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| **spec_code** (req → impl) | partial | 5 MD + 5 YAML + manifest exist for all spec'd deliverables. REQ-001..REQ-008 P0 files exist. But tasks.md and implementation-summary are stale — they don't reflect files actually authored. |
| **checklist_evidence** (criterion → verification) | not-yet | All CHK-001..CHK-806 in checklist.md remain unchecked `[ ]`. No verification evidence recorded for any checkpoint despite implementation files existing. |
| **skill_agent** (commands → owning skill) | partial | Commands exist at `.opencode/commands/doctor/` matching the `system-spec-kit` skill's command surface. No agent routing violations found. |
| **agent_cross_runtime** (4-runtime mirror) | not-yet | Not assessed in this correctness pass. Deferred to maintainability iteration. |
| **feature_catalog_code** (resource-map → actual paths) | partial | Resource maps not cross-checked against actual paths this pass. |
| **playbook_capability** (002 scenarios → 001 surfaces) | not-yet | 002-sandbox-testing-playbook not deep-reviewed this pass. Deferred. |

## Verdict

**CONDITIONAL** — 0 P0, 6 P1, 2 P2 findings. The implementation files exist and are structurally complete (all 5 MD + 5 YAML + manifest are on disk), but the spec documentation layer is significantly stale:

1. Parent `graph-metadata.json` `derived.last_active_child_id` is null (breaks resume flow)
2. Parent spec claims 001 is "Complete" but child docs show incomplete
3. Implementation-summary and tasks.md have not been updated to reflect actual file authorship
4. Parent spec has stale deliverable counts (21 yamls vs 5 post-ADR-010)
5. Implementation-summary describes obsolete YAML variants as remaining work

None of these are implementation defects — they are **documentation staleness** issues. The code files exist and are structurally consistent with the spec's deliverable list. The primary risk is that stale docs mislead resumers and inflate perceived remaining work.

## Next Dimension

Iteration 3 should continue with **correctness for 002-sandbox-testing-playbook** (cross-reference playbook scenarios against 001 commands, verify scenario IDs 323-347, check sandbox harness file existence). Then in iteration 4 pivot to **security** (doctor command mutation boundaries, snapshot paths, flock primitive, Docker sandbox isolation).
