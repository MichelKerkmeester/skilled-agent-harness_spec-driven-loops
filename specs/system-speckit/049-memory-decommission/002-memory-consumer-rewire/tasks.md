---
title: "Tasks: Phase 2: memory-consumer-rewire"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory consumer rewire"
  - "gate 1 rewire"
  - "continuity writer"
  - "memory tool call sites"
  - "task breakdown"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: memory-consumer-rewire

<!-- SPECKIT_LEVEL: 3 -->

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

Source inventory for every count and target below:
specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md

- [ ] T001 Confirm the phase-001 artifacts exist and are usable: `trigger-index.json` and `retrieval-conventions.md`
- [ ] T002 Write the residue sweep script using the exact recipe in `plan.md` §5, with `--json --ignore-case --no-ignore-global` and the four exclusions (`.git`, `node_modules`, `z_archive`, the mcp-server tree) (`scratch/residue-sweep.sh`)
- [ ] T003 Capture the baseline sweep before the first edit, parsing JSON events rather than splitting on colons (`scratch/residue-baseline.jsonl`)
- [ ] T004 [P] Freeze the ~167 logical-owner list as a ledger with one row per owner, keyed to its inventory paths (`scratch/owner-ledger.md`)

| Task | Verification |
|------|--------------|
| T001 | Both files exist and a hand-run lookup returns a result |
| T002 | Script runs clean and its flag set matches `plan.md` §5 exactly |
| T003 | Baseline file is non-empty and parses as JSON lines |
| T004 | Ledger row count is stated and every row names at least one inventory path |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Stage order is fixed: W1, W2, W4 and W5 rewire live consumers, then W3 splits the shared seams,
then W6 lands the replacement checks.

### W1: Live consumer families, routes and grants (REQ-010)

- [ ] T005 [P] Rewire `.opencode/agents` (8 paths, 49 rows): tool grants and retrieval instructions
- [ ] T006 [P] Rewire `.claude/agents` (11 paths, 57 rows)
- [ ] T007 [P] Rewire `.codex/agents` (8 paths, 47 rows)
- [ ] T008 [P] Rewire `.pi/agents` (8 paths, 47 rows)
- [ ] T009 Rewire the context agent family and `AGENTS.md` Gate 1 (11 rows) onto the trigger index
- [ ] T010 Decide and rewire the `/memory:search`, `/memory:save` and `/memory:manage` routes: rewire them or mark them for phase-003 deletion with the reason recorded
- [ ] T011 Rewire the `/doctor` memory routes (`_routes.yaml` plus `assets/doctor-memory.yaml`)
- [ ] T012 Rewire deep-loop YAML grants and calls to lineage-local state, leaving the loop contract untouched
- [ ] T013 Rewire the remaining command surface (`.opencode/commands`, 84 paths, 633 rows), hooks (24 paths, 102 rows), plugins (13 paths, 85 rows) and bins (34 paths, 285 rows)
- [ ] T014 Reconcile the five runtime config roots: `.claude/mcp.json` (19 rows), `.codex/config.toml` (15), `.cursor/mcp.json` (19), `.pi/mcp.json` (13), `opencode.json` (19)

| Task | Verification |
|------|--------------|
| T005-T008 | No removed tool name appears in any `allowed-tools` frontmatter under the four agent roots |
| T009 | Gate 1 resolves with the daemon stopped and no degraded-mode notice |
| T010-T011 | Each route either resolves through the index or `rg`, or else carries a written phase-003 deletion decision |
| T012 | Deep-loop unit suites pass with locks, projections and ledger state unchanged |
| T013 | Per-area sweep returns zero live rows for each of the four areas |
| T014 | Each config root's memory registration is either removed or carries a recorded retain decision |

### W2: Package and process seams (REQ-009)

- [ ] T015 Replace the `workflow.ts` import of `@spec-kit/mcp-server/api/indexing` with source-owned index behavior (`.opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640`)
- [ ] T016 Remove the automatic `memory_index_scan` follow-up instructions from the same file
- [ ] T017 Replace `.system-spec-memory-launcher.json` daemon detection with a source-owned lease check

| Task | Verification |
|------|--------------|
| T015 | The script tree compiles and the import path returns zero grep hits |
| T016 | No follow-up instruction references a removed tool |
| T017 | The launcher filename returns zero grep hits outside the mcp-server tree |

### W3: Shared seam split (REQ-008)

- [ ] T018 Split `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR` and `MEMORY_DB_PATH` so the advisor keeps a resolvable DB path
- [ ] T019 Split the retry, launcher and IPC settings, keeping the shared socket owner (`.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:134,187,202-203`)
- [ ] T020 Split the HF-local branches, retaining the shared model-server and `hf-embed.sock` capability (`.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:4-13`, `providers/hf-local.ts:32-35,371-382`)
- [ ] T021 Split the `.env.example` rows (334 rows) into shared and server-only groups
- [ ] T022 Update deploy, orphan-sweeper and session-cleanup so they no longer strand memory daemons or kill the retained advisor socket (`scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113`)
- [ ] T023 Prove `system-skill-advisor` still resolves its embedder after the split. This also gates phase 003

| Task | Verification |
|------|--------------|
| T018-T021 | Each split variable or setting has one named surviving owner recorded in `decision-record.md` |
| T022 | Each script runs against a live advisor and the advisor socket survives |
| T023 | Fresh-process advisor query returns an embedder-backed result with the memory daemon stopped, output and exit status read |

### W4: Instructions, assets and producers (REQ-011)

- [ ] T024 [P] Update command YAML and TXT assets
- [ ] T025 [P] Update `SKILL.md` and reference files across the affected skills
- [ ] T026 [P] Update `graph-metadata.json` and `description.json` where they name removed tools
- [ ] T027 Update the templates and install guidance, producers before their outputs (`.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48`, `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`)
- [ ] T028 Update the feature catalogs and manual playbooks (2,024 paths carry catalog or playbook rows, 1,888 of them live)
- [ ] T029 Update the generated-artifact producers, including `.opencode/commands/create/assets/create-skill-auto.yaml`

| Task | Verification |
|------|--------------|
| T024-T026 | Sweep returns zero live rows for each asset class |
| T027 | Regenerating one artifact from each template produces no removed tool name |
| T028 | Catalog and playbook rows are either updated or labeled historical |
| T029 | A fresh generator run is swept and comes back clean |

### W5: Deep-loop persistence tests (REQ-012)

- [ ] T030 Rewrite the reducer-facing persistence tests so `memory_save` and `memory_context` become lineage-local state (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87`)
- [ ] T031 Confirm the locks, append-only projections, ledger state and loop contract are unchanged by the rewrite

| Task | Verification |
|------|--------------|
| T030 | The deep-loop unit suites pass with no MCP persistence call |
| T031 | Diff review shows no change to lock, projection or ledger code |

### W6: Replacement checks before deletions (REQ-013)

- [ ] T032 Add the replacement tests and route checks
- [ ] T033 Only then delete the old assertions they replace

| Task | Verification |
|------|--------------|
| T032 | New tests fail against the pre-rewire state and pass after it |
| T033 | No assertion was deleted before its replacement existed, shown by commit order |

### Cross-cutting

- [ ] T034 Record the continuity writer decision: a named standalone packet-local writer keeping atomic same-directory update and lock semantics (REQ-004)
- [ ] T035 Write the honest loss declaration for semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal (REQ-007)
- [ ] T036 Reconcile the ~167 owner estimate against the 9,016 live inventory paths, owner by owner, marking each owner rewired, deleted, retained or historical (REQ-014)
- [ ] T037 Record a named replacement or an explicit retain decision for each of the five break-risk seams S-001 through S-005

| Task | Verification |
|------|--------------|
| T034 | The writer is named, exists and updates frontmatter atomically with the daemon stopped |
| T035 | Every listed capability has either a replacement or a stated no-hit behavior |
| T036 | The owner ledger has no unresolved row and its total is stated against both counts |
| T037 | `decision-record.md` holds five decisions, one per seam |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T038 Run the residue sweep from the final state and confirm it returns empty outside the mcp-server tree
- [ ] T039 Run one full session, Gate 1 through Gate 5, with the daemon stopped and no degraded-mode notice
- [ ] T040 Run `/speckit:plan`, `/speckit:resume` and `/memory:save` end to end without the MCP server
- [ ] T041 Exercise the continuity writer once with the daemon stopped and read the resulting frontmatter
- [ ] T042 Re-run the advisor embedder proof from the final state (T023)
- [ ] T043 Confirm no removed tool appears in any `allowed-tools` frontmatter across all runtime agent and command directories
- [ ] T044 Update the packet documentation and refresh the generated metadata pair

| Task | Verification |
|------|--------------|
| T038 | Sweep output and exit status read, zero live rows outside the mcp-server tree |
| T039 | Session transcript shows all five gates resolving daemon-off |
| T040 | Each command completes and its output is read |
| T041 | Frontmatter shows the new `last_updated_at` and the lock released |
| T042 | Fresh-process advisor result recorded |
| T043 | Grant scan across `.opencode`, `.claude`, `.codex` and `.pi` returns zero |
| T044 | `validate.sh <folder> --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


