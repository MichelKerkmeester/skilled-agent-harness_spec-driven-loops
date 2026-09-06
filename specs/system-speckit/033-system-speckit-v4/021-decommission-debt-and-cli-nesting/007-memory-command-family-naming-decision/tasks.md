---
title: "Tasks: Phase 7: memory-command-family-naming-decision"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory naming decision tasks"
  - "blast radius rg re-run"
  - "goal d7 literal precedent"
  - "command frontmatter key continuity"
  - "hard cutover no aliases"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: memory-command-family-naming-decision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run the blast-radius `rg` command from `spec.md`'s Success Criteria and confirm the 87-file count is still current — re-run at decision time returned 84 (small drift from other phases touching adjacent files, allowed by SC-002); the full list is saved at `scratch/scripts-dist-memory-blast-radius.txt`
- [x] T002 [P] Re-read `specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing/goal.md`'s D7 row to confirm the precedent this phase either extends or reopens is quoted accurately — confirmed verbatim: "Command names, paths and frontmatter keys stay literal" (goal.md D7 row)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Present both options and the current blast-radius evidence to the operator — done via this phase's `spec.md`; the operator decided directly (2026-09-05) rather than through a live A/B prompt in this session
- [x] T004 Once the operator decides, create `decision-record.md` in this folder naming the chosen option and the reasoning — `decision-record.md` ADR-001, Option B, hard cutover
- [x] T005 If Option B is chosen, open the follow-on execution packet under Gate 3, seeded with this phase's blast-radius table and `runtime/hooks/claude/session-stop.ts:73-76`'s explicit inclusion (REQ-004) — **done, with a scope amendment the operator approved directly**: rather than a separately Gate-3'd packet, Stage B executed inside `specs/system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/002-scripts-into-runtime-nesting/` (the scripts -> runtime/cli move already in flight there), since both renames touch the same tree and the same `session-stop.ts` fallback candidates. `scratch/code-path-followups.md` served as the seed; see that packet's `implementation-summary.md` for the executed change and evidence.
- [x] T004a (added) Execute Stage A of Option B: move `.opencode/commands/memory/{save,search}.md` and their presentation assets into `.opencode/commands/speckit/`, merge `memory/README.txt` into `speckit/README.txt`, delete the `memory/` command folder — done; `.opencode/commands/memory/` no longer exists
- [x] T004b (added) Rename the `/doctor memory` route to `/doctor speckit-retrieval` in `_routes.yaml`, `doctor-memory.yaml` (renamed `doctor-speckit-retrieval.yaml`), `speckit.md`, and `doctor-speckit-presentation.txt` — done; `route-validate.sh` passes 9/9 routes including self-test fixtures
- [x] T004c (added) Update every live document-level reference to the old command names (CLAUDE.md/AGENTS.md, README.md, install-guides, agent files + `.codex`/`.pi`/`.claude` mirrors, every skill's `SKILL.md`/references, `command-contract.json`) outside `scripts/`, `runtime/`, `shared/` and `specs/` — done across 91 documents (see `decision-record.md` ADR-001's blast-radius table); code paths left untouched and inventoried in `scratch/code-path-followups.md`
- [x] T004d (added) Regenerate runtime mirrors and re-validate: `sync-agents.cjs`, `sync-agents-pi.cjs`, `sync-prompts.cjs`, `sync-prompts-pi.cjs`, `sync-runtime-mirrors.cjs`, `check-agent-mirror-sync.cjs`, `generate-command-routers.cjs`, `route-validate.sh`, the trigger index (twice, identical `indexSha256`), `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`, `compiled-route-guard.cjs` (2 hubs re-minted: `cli-external-orchestration`, `mcp-tooling`) — all green; evidence in `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm `decision-record.md` exists and clearly names one of the two options — confirmed, Option B
- [x] T007 (superseded, see `spec.md` Scope Amendment) Confirm no file outside this folder's own documents (and `decision-record.md`) was modified during this phase — the original claim no longer holds under the operator-directed amendment; verified instead that no file under `scripts/`, `runtime/`, or `shared/` (system-spec-kit) and no file under `specs/` outside this phase folder was modified during Stage A
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T005 closed; Stage B executed inside 002-scripts-into-runtime-nesting per the operator-approved scope amendment
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (Stage A gates; see `implementation-summary.md`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
