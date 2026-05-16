---
title: "Feature Specification: 003 RM-8 013 remediation — doc honesty + security hardening + cross-runtime mirror"
description: "Close out the CONDITIONAL verdict from the 013 deep-review (commit 8d794afad) by resolving all 30 P1 + 30 P2 findings in four batches: doc honesty, security hardening, cross-runtime command mirror, and P2 cleanup."
trigger_phrases:
  - "013 remediation"
  - "rm8 013 remediation"
  - "013 doctor commands fixes"
  - "013 deep-review remediation"
  - "013 CONDITIONAL → PASS"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "013-doctor-update-orchestrator/002-rm8-013-remediation-doc-honesty-security"
    last_updated_at: "2026-05-11T08:00:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored spec from 013 review-report.md findings"
    next_safe_action: "Dispatch Batch A via cli-codex gpt-5.5 high fast"
    blockers: []
    key_files:
      - "review-report.md (commit 8d794afad)"
    session_dedup:
      fingerprint: "sha256:003-rm8-013-rem-spec-2026-05-11"
      session_id: "main-003-2026-05-11"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 003 RM-8 013 Remediation — Doc Honesty + Security Hardening + Cross-Runtime Mirror

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-sandbox-testing-playbook |
| **Successor** | None |
| **Handoff Criteria** | All 30 P1 findings (clusters A-I) resolved with evidence; all 30 P2 findings (cluster J) resolved or formally deferred; checklist marked complete; 013 verdict moves from CONDITIONAL → PASS on re-review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of `013-doctor-update-orchestrator`. The 10-iteration deep-review (commit `8d794afad`, 2026-05-11) emitted a **CONDITIONAL** verdict with 0 P0, 30 P1, and 30 P2 findings against the 013 phase parent + 001 + 002. This packet closes those findings out.

**Scope Boundary**: only the surfaces called out by `review-report.md` §3 clusters A-J. No new architecture, no scope expansion beyond what review-report.md identified.

**Dependencies**:
- `review-report.md` commit `8d794afad` is the source-of-truth for finding-by-cluster grouping
- `generate-context.js` (for cluster A regeneration) — needs network access for Voyage embeddings
- `cli-codex` skill with `gpt-5.5 --reasoning-effort high --service-tier fast` for batch dispatches

**Deliverables**:
- Batch A: doc-honesty fixes (clusters A-F + part of cluster D)
- Batch B: security hardening (clusters G + H)
- Batch C: cross-runtime command mirror (cluster I)
- Batch D: P2 cleanup (cluster J)

**Changelog**: refresh `../changelog/<003-rm8-013-remediation>.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 013 deep-review identified that 013 + 001 + 002 spec docs lie about completion state (checklists 100% unchecked while implementation-summaries claim 95% complete; `last_active_child_id` null despite handover claiming it is set; resource-maps say "PLANNED" while files are on disk). The doctor command surface has minor security hardening opportunities (`npm install --no-audit`, mkdir-lock TOCTOU, broad docker-compose mount, missing cap_drop). The doctor commands exist only under `.opencode/commands/doctor/` instead of all four runtimes.

### Purpose
Move 013 from CONDITIONAL → PASS by resolving all 60 findings: documentation reconciled to reality, doctor commands hardened against known attack patterns, cross-runtime mirror complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Batch A — Doc honesty (P1 clusters A-F + part of D)**:
- Re-run `generate-context.js` on `001-doctor-commands` to fix `description.json.specFolder` (cluster E)
- Re-run `generate-context.js` on `002-sandbox-testing-playbook` to refresh `last_active_child_id` (cluster A) — verify post-regen that parent metadata stays correct (per memory `feedback_generate_context_regenerates_parent_metadata.md`)
- Manually patch parent `graph-metadata.json` `derived.status: "planned"` → `"in_progress"`
- Reconcile 001 `implementation-summary.md` to consistent ~95% completion: title + body table + continuity `completion_pct` aligned (cluster B)
- Reconcile 002 `implementation-summary.md` to consistent ~95% completion: continuity `completion_pct: 70` → `95` (cluster C)
- Fix 002 `spec.md` SC-001 "25 scenarios" → "23 scenarios" (cluster C)
- Fix parent `spec.md:105` Phase Map "21 yamls" → "10 yamls" (or actual on-disk count) (cluster D)
- Mark `001-doctor-commands/checklist.md` items with `[x]` + evidence anchors where verified (clusters B)
- Mark `002-sandbox-testing-playbook/checklist.md` items with `[x]` + evidence anchors where verified (cluster C)
- Bulk replace `Status: PLANNED` → `Status: OK` in 001 + 002 `resource-map.md` for files verified on disk (cluster F)
- Drop the stale `.opencode/skill` symlink row from parent `resource-map.md` (cluster F)
- Drop ADR-010-obsolete confirm/apply/apply-confirm YAML mentions from 001 `implementation-summary.md` Track B1 (cluster B)
- Update 001 `tasks.md` to mark T-011..T-046 with actual completion status per evidence (cluster B)
- Fix 4 doc locations in 002 that claim `last_active_child_id` is set to 002 — drop the claim or note it's tracked at parent (cluster A)

**Batch B — Security hardening (P1 clusters G + H)**:
- Drop `npm install --no-audit` flag in `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` (cluster G — R4-P1-002)
- Replace `mkdir`-based lock primitive with `flock(2)` in `doctor-runtime-bootstrap.sh` (cluster G — R4-P1-004)
- Narrow docker-compose volume mount from repo-root read-write to only writable paths (cluster H — R5-P1-001)
- Add `cap_drop: [ALL]` + `cap_add: [<minimal set>]` to sandbox container config (cluster H — R5-P1-002)

**Batch C — Cross-runtime command mirror (P1 cluster I)**:
- Mirror 5 doctor commands from `.opencode/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md` to:
  - `.claude/commands/doctor/`
  - `.codex/commands/doctor/` (TOML frontmatter conversion per codex convention)
  - `.gemini/commands/doctor/`
- Add `<!-- skill_agent: system-spec-kit -->` (or appropriate owner) anchor at top of each doctor command MD across all 4 runtimes (cluster I — R7-P1-001)
- Update root `README.md` doctor command count if applicable per `feedback_new_agent_mirror_all_runtimes.md`

**Batch D — P2 cleanup (cluster J, 30 findings)**:
- Refresh stale continuity blocks (`last_updated_at` field) in 001 + 002 + parent docs (cluster J)
- Switch sandbox Dockerfile base from `debian:bookworm` to `debian:bookworm-slim` if applicable (cluster J — R5-P2-001)
- Sandbox guard: return `SKIP` instead of `success` when guard cannot run (cluster J — R5-P2-002)
- Relax parent `spec.md:117` REQ-P-001 acceptance criterion to allow cross-cutting docs (handover.md, resource-map.md) at parent level
- Remove dead `.opencode/skill` symlink row from parent resource-map (already in Batch A)
- Other stale `packet_pointer` fixes across 001 child docs (R9-P2-004)
- Other small doc-code drift fixes from iter-009 (R9-P2-001..009)

### Out of Scope
- Re-running deep-review post-remediation (operator decision; recommend after all 4 batches commit)
- Runtime scope guard for cli-opencode dispatches (separate packet, deferred per `cli-opencode/references/destructive_scope_violations.md` §4)
- Architectural changes to doctor command surface (commands stay as they are; only mirror + metadata reconciliation)
- Any P0 findings (none survived adjudication)

### Files to Change

Approximate list (final list confirmed at each batch dispatch):

| File Path | Change Type | Batch |
|-----------|-------------|-------|
| `.../013-doctor-update-orchestrator/graph-metadata.json` | Modify (derived.status, derived.last_active_child_id) | A |
| `.../013-doctor-update-orchestrator/spec.md` | Modify (Phase Map yaml count + REQ-P-001) | A + D |
| `.../013-doctor-update-orchestrator/resource-map.md` | Modify (drop .opencode/skill row) | A |
| `.../001-doctor-commands/description.json` | Regenerate via generate-context.js | A |
| `.../001-doctor-commands/spec.md` | Modify (continuity refresh) | A + D |
| `.../001-doctor-commands/tasks.md` | Modify (T-011..T-046 status) | A |
| `.../001-doctor-commands/checklist.md` | Modify (mark items with evidence) | A |
| `.../001-doctor-commands/implementation-summary.md` | Modify (reconcile completion state) | A |
| `.../001-doctor-commands/resource-map.md` | Modify (PLANNED → OK bulk) | A |
| `.../002-sandbox-testing-playbook/spec.md` | Modify (SC-001 scenario count, continuity) | A + D |
| `.../002-sandbox-testing-playbook/checklist.md` | Modify (mark items with evidence) | A |
| `.../002-sandbox-testing-playbook/implementation-summary.md` | Modify (continuity completion_pct) | A |
| `.../002-sandbox-testing-playbook/resource-map.md` | Modify (PLANNED → OK bulk) | A |
| `.../002-sandbox-testing-playbook/handover.md` | Modify (drop bogus last_active_child_id claim) | A |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | Modify (--no-audit drop + flock) | B |
| `.opencode/commands/doctor/<sandbox>/docker-compose.yml` (exact path TBC during dispatch) | Modify (mount + cap_drop) | B |
| `.claude/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md` | Create | C |
| `.codex/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.toml` | Create | C |
| `.gemini/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md` | Create | C |
| `.opencode/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md` | Modify (skill_agent anchor) | C |
| `README.md` | Modify (doctor count update if needed) | C |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 30 P1 findings from `review-report.md` §3 (clusters A-I) resolved with evidence | Re-grep / re-validate confirms each finding's symptom is gone; checklist.md marks each P1 with `[x]` + evidence anchor citing the fix commit |
| REQ-002 | All 4 Batch B security hardening items applied | doctor-runtime-bootstrap.sh has no `--no-audit`; uses flock; docker-compose mount narrowed; cap_drop:[ALL] + minimal cap_add present |
| REQ-003 | Cross-runtime mirror complete | `find .opencode .claude .codex .gemini -path '*/commands/doctor/*.md' -o -path '*/commands/doctor/*.toml'` returns 5×4 = 20 entries (5 commands × 4 runtimes); each opencode command has a skill_agent anchor |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All 30 P2 findings (cluster J) resolved or formally deferred | Each P2 in checklist either marked `[x]` with fix evidence OR marked `[~]` with a "deferred to follow-on packet" note |
| REQ-005 | RM-8 scope hygiene maintained during batch dispatches | All 4 cli-codex dispatches show zero out-of-scope writes (writes only inside the files listed in §3 above + 003 packet docs); use `--sandbox workspace-write` + appropriate network flag |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-rm8-013-remediation-doc-honesty-security --strict` exits 0.
- **SC-002**: Re-run of `/spec_kit:deep-review:auto` on `013-doctor-update-orchestrator` (post-remediation, optional) emits a PASS or PASS-with-advisories verdict, with the 30 P1 findings closed.
- **SC-003**: `001-doctor-commands/checklist.md` and `002-sandbox-testing-playbook/checklist.md` show `[x]` on items with disk evidence; no `[ ]` items where evidence exists.
- **SC-004**: `find .opencode .claude .codex .gemini -path '*/commands/doctor/*'` shows 5 commands × 4 runtimes = 20 files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `generate-context.js` on a phase child regenerates parent metadata, potentially overwriting `last_active_child_id` | Medium | Per memory `feedback_generate_context_regenerates_parent_metadata.md`: after regen, manually restore `parent_id`, `manual.depends_on`, `derived.status`, and `derived.last_active_child_id` |
| Risk | cli-codex `--sandbox workspace-write` blocks subprocess network for `generate-context.js` (Voyage embeddings, OpenAI API) | High (Batch A breaks silently) | Pass `-c sandbox_workspace_write.network_access=true` for Batch A dispatches; per memory `feedback_codex_sandbox_blocks_network.md` |
| Risk | Parallel cli-codex dispatches silently fail or partially revert | Medium | Per memory `feedback_cli_dispatch_unreliability.md`: dispatch batches SEQUENTIALLY, not in parallel. Verify each batch before dispatching next. |
| Risk | Cross-runtime mirror frontmatter conversion may break codex TOML parsing | Medium | Per memory `feedback_codex_toml_body_drift.md`: hand-inspect codex TOML body after Batch C dispatch |
| Risk | Bulk PLANNED→OK rewrite could miss legitimately-still-planned entries | Low | Cross-check against disk reality (file existence) before mark; use targeted sed only for entries with confirmed on-disk files |
| Dependency | `cli-codex` skill availability | Active in this session | Confirmed via `which codex` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — review-report.md §6 already prescribes the priority order. The 4-batch split below is the implementation execution plan.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 NOTES
- Adds checklist.md per Level 2 contract (created separately when verification starts)
- All other sections are spec-core inherited from Level 1
-->
