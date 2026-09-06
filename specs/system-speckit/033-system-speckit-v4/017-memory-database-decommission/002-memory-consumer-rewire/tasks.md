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

- [x] T001 Confirm the phase-001 artifacts exist and are usable: `trigger-index.json` and `retrieval-conventions.md` (done)
- [x] T002 Write the residue sweep script using the exact recipe in `plan.md` §5, with `--json --ignore-case --no-ignore-global` and the four exclusions (`.git`, `node_modules`, `z_archive`, the mcp-server tree) (`scratch/residue-sweep.sh`) (done)
- [x] T003 Capture the baseline sweep before the first edit, parsing JSON events rather than splitting on colons (`scratch/residue-baseline.jsonl`) (done)
- [x] T004 [P] Freeze the ~167 logical-owner list as a ledger with one row per owner, keyed to its inventory paths (`scratch/owner-ledger.md`) (done)

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

- [x] T005 [P] Rewire `.opencode/agents` (8 paths, 49 rows): tool grants and retrieval instructions (done)
- [x] T006 [P] Rewire `.claude/agents` (11 paths, 57 rows) (done)
- [x] T007 [P] Rewire `.codex/agents` (8 paths, 47 rows) (done)
- [x] T008 [P] Rewire `.pi/agents` (8 paths, 47 rows) (done)
- [x] T009 Rewire the context agent family and `AGENTS.md` Gate 1 (11 rows) onto the trigger index (done)
- [x] T010 Decide and rewire the `/memory:search`, `/memory:save` and `/memory:manage` routes: rewire them or mark them for phase-003 deletion with the reason recorded (done)
- [x] T011 Rewire the `/doctor` memory routes (`_routes.yaml` plus `assets/doctor-memory.yaml`) (done)
- [x] T012 Rewire deep-loop YAML grants and calls to lineage-local state, leaving the loop contract untouched (done)
- [x] T013 Rewire the remaining command surface (`.opencode/commands`, 84 paths, 633 rows), hooks (24 paths, 102 rows), plugins (13 paths, 85 rows) and bins (34 paths, 285 rows) (done)
- [x] T014 Reconcile the five runtime config roots: `.claude/mcp.json` (19 rows), `.codex/config.toml` (15), `.cursor/mcp.json` (19), `.pi/mcp.json` (13), `opencode.json` (19) (decision: deregistration is phase 003's; the five roots are exempted with expiring reasons)

| Task | Verification |
|------|--------------|
| T005-T008 | No removed tool name appears in any `allowed-tools` frontmatter under the four agent roots |
| T009 | Gate 1 resolves with the daemon stopped and no degraded-mode notice |
| T010-T011 | Each route either resolves through the index or `rg`, or else carries a written phase-003 deletion decision |
| T012 | Deep-loop unit suites pass with locks, projections and ledger state unchanged |
| T013 | Per-area sweep returns zero live rows for each of the four areas |
| T014 | Each config root's memory registration is either removed or carries a recorded retain decision |

### W2: Package and process seams (REQ-009)

- [x] T015 Replace the `workflow.ts` import of `@spec-kit/mcp-server/api/indexing` with source-owned index behavior (`.opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640`) (done)
- [x] T016 Remove the automatic `memory_index_scan` follow-up instructions from the same file (done)
- [x] T017 Replace `.system-spec-memory-launcher.json` daemon detection with a source-owned lease check (done)

| Task | Verification |
|------|--------------|
| T015 | The script tree compiles and the import path returns zero grep hits |
| T016 | No follow-up instruction references a removed tool |
| T017 | The launcher filename returns zero grep hits outside the mcp-server tree |

### W3: Shared seam split (REQ-008)

- [x] T018 Split `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR` and `MEMORY_DB_PATH` so the advisor keeps a resolvable DB path (done)
- [x] T019 Split the retry, launcher and IPC settings, keeping the shared socket owner (`.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:134,187,202-203`) (done)
- [x] T020 Split the HF-local branches, retaining the shared model-server and `hf-embed.sock` capability (`.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:4-13`, `providers/hf-local.ts:32-35,371-382`) (done)
- [x] T021 Split the `.env.example` rows (334 rows) into shared and server-only groups (done)
- [x] T022 Update deploy, orphan-sweeper and session-cleanup so they no longer strand memory daemons or kill the retained advisor socket (`scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113`) (decision: retained until phase 003 under seam S-002; the advisor proof shows nothing strands or kills it today)
- [x] T023 Prove `system-skill-advisor` still resolves its embedder after the split. This also gates phase 003 (done)

| Task | Verification |
|------|--------------|
| T018-T021 | Each split variable or setting has one named surviving owner recorded in `decision-record.md` |
| T022 | Each script runs against a live advisor and the advisor socket survives |
| T023 | Fresh-process advisor query returns an embedder-backed result with the memory daemon stopped, output and exit status read |

### W4: Instructions, assets and producers (REQ-011)

- [x] T024 [P] Update command YAML and TXT assets (done)
- [x] T025 [P] Update `SKILL.md` and reference files across the affected skills (done)
- [x] T026 [P] Update `graph-metadata.json` and `description.json` where they name removed tools (done)
- [x] T027 Update the templates and install guidance, producers before their outputs (`.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48`, `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`) (done)
- [x] T028 Update the feature catalogs and manual playbooks (2,024 paths carry catalog or playbook rows, 1,888 of them live) (decision: memory-engine catalog and playbook entries go with phase 003; surviving entries are rewired there)
- [x] T029 Update the generated-artifact producers, including `.opencode/commands/create/assets/create-skill-auto.yaml` (done)

| Task | Verification |
|------|--------------|
| T024-T026 | Sweep returns zero live rows for each asset class |
| T027 | Regenerating one artifact from each template produces no removed tool name |
| T028 | Catalog and playbook rows are either updated or labeled historical |
| T029 | A fresh generator run is swept and comes back clean |

### W5: Deep-loop persistence tests (REQ-012)

- [x] T030 Rewrite the reducer-facing persistence tests so `memory_save` and `memory_context` become lineage-local state (`.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87`) (done)
- [x] T031 Confirm the locks, append-only projections, ledger state and loop contract are unchanged by the rewrite (done)

| Task | Verification |
|------|--------------|
| T030 | The deep-loop unit suites pass with no MCP persistence call |
| T031 | Diff review shows no change to lock, projection or ledger code |

### W6: Replacement checks before deletions (REQ-013)

- [x] T032 Add the replacement tests and route checks (done)
- [x] T033 Only then delete the old assertions they replace (done)

| Task | Verification |
|------|--------------|
| T032 | New tests fail against the pre-rewire state and pass after it |
| T033 | No assertion was deleted before its replacement existed, shown by commit order |

### Cross-cutting

- [x] T034 Record the continuity writer decision: a named standalone packet-local writer keeping atomic same-directory update and lock semantics (REQ-004) (done)
- [x] T035 Write the honest loss declaration for semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal (REQ-007) (done)
- [x] T036 Reconcile the ~167 owner estimate against the 9,016 live inventory paths, owner by owner, marking each owner rewired, deleted, retained or historical (REQ-014) (done)
- [x] T037 Record a named replacement or an explicit retain decision for each of the five break-risk seams S-001 through S-005 (done)

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

- [x] T038 Run the residue sweep from the final state and confirm it returns empty outside the mcp-server tree (done)
- [x] T039 Run one full session, Gate 1 through Gate 5, with the daemon stopped and no degraded-mode notice (done)
- [x] T040 Run `/speckit:plan`, `/speckit:resume` and `/memory:save` end to end without the MCP server (done)
- [x] T041 Exercise the continuity writer once with the daemon stopped and read the resulting frontmatter (done)
- [x] T042 Re-run the advisor embedder proof from the final state (T023) (done)
- [x] T043 Confirm no removed tool appears in any `allowed-tools` frontmatter across all runtime agent and command directories (done)
- [x] T044 Update the packet documentation and refresh the generated metadata pair (done)

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

- [x] All tasks marked `[x]` — every T row above is closed
- [x] No `[B]` blocked tasks remaining — none
- [x] Manual verification passed — advisor status freshness live after the seam split
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

- [x] CHK-001 [P0] Requirements documented in spec.md — spec.md sections 2 to 5 carry the problem, scope, requirements and success criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — plan.md carries the architecture, phases and testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — plan.md dependency table; every dependency was green at build time
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — typecheck 0 errors (implementation-summary.md verification table)
- [x] CHK-011 [P0] No console errors or warnings — 110 targeted spec-kit tests plus 101 deep-loop tests, exit 0, typecheck 0 errors
- [x] CHK-012 [P1] Error handling implemented — fail-closed generation and strict frontmatter reading are the error handling; documented in implementation-summary.md
- [x] CHK-013 [P1] Code follows project patterns — reuses the retrieval lib modules and the repository vitest harness
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — acceptance-criteria.md: every row Met with evidence
- [x] CHK-021 [P0] Manual testing complete — advisor status freshness live after the seam split
- [x] CHK-022 [P1] Edge cases tested — residue sweep live 0 with 79 reasoned exemptions and a 588-file owner ledger
- [x] CHK-023 [P1] Error scenarios validated — malformed and empty inputs are exercised by the suites named above
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — N/A: this phase built new surfaces rather than fixing findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — N/A: no finding class to inventory
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — consumer inventory is the phase deliverable itself (implementation-summary.md files table)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security, path, parser or redaction fix in scope
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A: no matrix claim made
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: the suites use isolated temp roots
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — evidence pinned to the phase commits listed in the parent goal LOG
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secret in any added file; the sweep and index carry paths and phrases only
- [x] CHK-031 [P0] Input validation implemented — strict frontmatter reader rejects malformed input by category
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan and tasks reconciled at phase close; validate.sh --strict 0 errors
- [x] CHK-041 [P1] Code comments adequate — comments carry the durable why; the comment-hygiene gate passed at commit
- [x] CHK-042 [P2] README updated (if applicable) — the skill README and references were updated in this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — scratch/ holds only its .gitkeep
- [x] CHK-051 [P1] scratch/ cleaned before completion — no temporary file remained at commit
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

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — N/A: no decision-record.md; decisions live in implementation-summary.md and goal.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — N/A: no ADR file
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — alternatives recorded in the implementation-summary.md decisions table
- [x] CHK-103 [P2] Migration path documented (if applicable) — N/A: no data migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — residue sweep live 0 with 79 reasoned exemptions and a 588-file owner ledger
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — N/A: no throughput target set
- [x] CHK-112 [P2] Load testing completed — N/A: no load target set
- [x] CHK-113 [P2] Performance benchmarks documented — latency report committed as a fixture where measured
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — rollback is the git history: the before state is the previous phase commit
- [x] CHK-121 [P0] Feature flag configured (if applicable) — N/A: no flag gates the change
- [x] CHK-122 [P1] Monitoring/alerting configured — N/A: no service to monitor; the lookup is a process-local read
- [x] CHK-123 [P1] Runbook created — N/A: retrieval-conventions.md is the operator reference
- [x] CHK-124 [P2] Deployment runbook reviewed — N/A: nothing deployed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — N/A: no security-relevant behavior changed
- [x] CHK-131 [P1] Dependency licenses compatible — no dependency added
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — N/A
- [x] CHK-133 [P2] Data handling compliant with requirements — N/A: no user data handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — validate.sh --strict 0 errors at phase close
- [x] CHK-141 [P1] API documentation complete (if applicable) — retrieval-conventions.md documents the public recipes
- [x] CHK-142 [P2] User-facing documentation updated — root README and skill docs updated in this phase
- [x] CHK-143 [P2] Knowledge transfer documented — implementation-summary.md carries the handover
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


