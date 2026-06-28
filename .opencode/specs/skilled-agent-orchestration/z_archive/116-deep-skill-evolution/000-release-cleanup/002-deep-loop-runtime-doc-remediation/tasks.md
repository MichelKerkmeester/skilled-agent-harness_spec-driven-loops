---
title: "Tasks: deep-loop-runtime doc-remediation"
description: "Finding→edit row per finding (DR-001..DR-037 + 4 test-coverage gaps) grouped by batch. Marked [x] · YYYY-MM-DD · evidence as each closes."
trigger_phrases:
  - "deep-loop-runtime doc-remediation tasks"
  - "finding to edit mapping"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/001-doc-remediation"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "compose-batch-a-prompt-pack"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000131000603"
      session_id: "131-000-001-001-doc-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: deep-loop-runtime doc-remediation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (finding-ref → file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read parent Phase 5 synthesis + replacement-string packages (iteration-007.md §C, iteration-009.md)
- [x] T002 Author `spec.md` (Level 2)
- [x] T003 Author `plan.md`
- [x] T004 Author `tasks.md` (this file)
- [ ] T005 Author `checklist.md`
- [ ] T006 Author `decision-record.md` (4 ADRs)
- [ ] T007 Author `implementation-summary.md` skeleton
- [x] T008 Copy 3 schemas from parent `schemas/`
- [ ] T009 Author `description.json` + `graph-metadata.json` manually
- [ ] T010 Run `validate.sh --strict` on packet → exit 0
- [ ] T011 Run `validate.sh --strict` on parent `001-deep-loop-runtime/` → exit 0 (tolerant phase-parent policy)

---

## Phase 2: Implementation

### Batch A — Consolidated cleanup (one cli-devin SWE-1.6 RCAF dispatch)

- [ ] T020 Read mandatory pre-flight: `cli-devin/SKILL.md`, `sk-prompt-models/SKILL.md`
- [ ] T021 Compose `prompts/batch-a-prompt.md` (RCAF + medium-density pre-plan, ≤4 steps; paste replacement strings verbatim)
- [ ] T022 Pre-flight: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*`
- [ ] T023 Dispatch `devin --print --prompt-file prompts/batch-a-prompt.md --model swe-1.6 --permission-mode auto -p </dev/null` → capture to `logs/batch-a-stdout.txt`
- [ ] T024 Bundle gate: `rg -F` every replacement string in target files; smoke-run any validation commands cited
- [ ] T025 Verify SC-007 invariant
- [ ] T026 `validate.sh --strict` on packet + parent → exit 0
- [ ] T027 Mark closed findings in tasks.md below

**Findings closed by Batch A (mark [x] after T023 + T024 succeed):**

- [ ] DR-001 [P1] (`README.md:3, :82` "22 vitest files" → "27")
- [ ] DR-002 [P2] (lib/README.md domain README list missing deep-loop)
- [ ] DR-003 [P1] (`README.md:242` STRUCTURE changelog tree missing v1.1.0.0.md)
- [ ] DR-004 [P1] (`README.md:438` §9 RELATED DOCUMENTS missing v1.1.0.0.md link)
- [ ] DR-005 [P2] (graph-metadata.json `last_updated_at` stale)
- [ ] DR-006 [P1] (graph-metadata.json `derived.key_topics` omits 5 council modules)
- [ ] DR-008 [P2] (orientation prose drift in graph-metadata domains)
- [ ] DR-009 [P1] (README self-inconsistency: §4 says "18 manual-test scenarios", §9 says "17 entries" → standardize)
- [ ] DR-010 [P2] (SKILL.md prose drift on council)
- [ ] DR-011 [P1] (`SKILL.md:266` §8 still cites changelog/v1.0.0.0.md only)
- [ ] DR-016 [P1] (graph-metadata.json domains + key_topics + entities council omission consolidation)
- [ ] DR-017 [P1] (integration_points.md missing /deep:ask-ai-council command refs)
- [ ] DR-018 [P1] (integration_points.md missing deep-ai-council scripts/orchestrate-*.cjs 8 require() refs)
- [ ] DR-019 [P1] (integration_points.md missing /doctor _routes.yaml)
- [ ] DR-020 [P1] (integration_points.md missing /doctor update.md backup pattern)
- [ ] DR-021 [P1] (integration_points.md missing system-code-graph playbook 009/010)
- [ ] DR-022 [P1] (integration_points.md missing system-spec-kit/mcp_server/lib/deep-loop/README + handlers/coverage-graph/README)
- [ ] DR-023 [P1] (cross-package vitest discovery — informational; documentation update in integration_points.md)
- [ ] DR-024 [P1] (integration_points.md missing 3 commands/doctor/assets/ + deep-agent-improvement/scripts/lib/README)
- [ ] DR-027 [P1] (`lib/README.md:31` per-domain README list omits lib/deep-loop/README.md)
- [ ] DR-030 [P2] (graph-metadata.json `derived.source_docs` missing changelog/v1.0.0.0.md + v1.1.0.0.md)
- [ ] DR-031 [P2] (graph-metadata.json `derived.causal_summary` missing council mention)
- [ ] DR-033 [P1] (graph-metadata.json `manual.related_to` missing deep-ai-council)
- [ ] DR-035 [P1] (`README.md:194` review-node-kind: fabricated "code-surface" + 5 omissions)
- [ ] DR-036 [P2] (`references/coverage_graph_schema.md:36` same fabrication in prose)
- [ ] DR-037 [P1] (cross-arc citation: 6 phrases at 5 sites: SKILL.md:144 ×2, README.md:198 / :247 / :417, changelog/v1.1.0.0.md:63 — supersedes DR-029)

### Batch B — Description-drift full-17 sweep

- [ ] T030 Read mandatory pre-flight (already loaded from Batch A)
- [ ] T031 Compose `prompts/batch-b-prompt.md` (RCAF; instructs devin to emit 17-row drift-status table + apply fixes)
- [ ] T032 SIGKILL cleanup before dispatch
- [ ] T033 Dispatch `devin --print --prompt-file prompts/batch-b-prompt.md ...` → capture
- [ ] T034 Bundle gate
- [ ] T035 SC-007 check
- [ ] T036 strict validate
- [ ] T037 Mark closed findings

**Findings closed by Batch B:**

- [ ] DR-025 [P2] (feature_catalog/01--executor/03-fallback-router.md description drift vs JSDoc)
- [ ] DR-026 [P2] (feature_catalog/05--scoring/01-bayesian-scorer.md description drift vs JSDoc)
- [ ] DR-028 [P2] (feature_catalog/03--validation/01-post-dispatch-validate.md description drift vs JSDoc)
- [ ] (14 unchecked features: drift-status row emitted in iteration-001.md attachment; corrections applied where drift exists)

### Batch C — DR-034 council surface expansion (NEW 12 files + UPDATED 7)

- [ ] T040 Read mandatory pre-flight + sk-doc templates
- [ ] T041 Compose `prompts/batch-c-prompt.md` (RCAF; paste 4-section feature_catalog template + 5-section playbook template verbatim from sk-doc references)
- [ ] T042 SIGKILL cleanup
- [ ] T043 Dispatch → capture
- [ ] T044 Bundle gate
- [ ] T045 `validate_document.py` per each of 12 new files
- [ ] T046 SC-007 check
- [ ] T047 strict validate on packet + parent
- [ ] T048 Mark closed

**Findings closed by Batch C:**

- [ ] DR-034 [P1] (council surface absent from catalog + playbook despite ADR-001 mandate)
  - [ ] NEW `feature_catalog/08--council/index.md` (or root entry; per sk-doc template)
  - [ ] NEW `feature_catalog/08--council/01-multi-seat-dispatch.md`
  - [ ] NEW `feature_catalog/08--council/02-round-state-jsonl.md`
  - [ ] NEW `feature_catalog/08--council/03-adjudicator-verdict-scoring.md`
  - [ ] NEW `feature_catalog/08--council/04-cost-guards.md`
  - [ ] NEW `feature_catalog/08--council/05-session-state-hierarchy.md`
  - [ ] NEW `manual_testing_playbook/08--council/multi-seat-dispatch.md`
  - [ ] NEW `manual_testing_playbook/08--council/round-state-jsonl.md`
  - [ ] NEW `manual_testing_playbook/08--council/adjudicator-verdict-scoring.md`
  - [ ] NEW `manual_testing_playbook/08--council/cost-guards.md`
  - [ ] NEW `manual_testing_playbook/08--council/session-state-hierarchy.md`
  - [ ] UPDATED `feature_catalog/feature_catalog.md` (add §8 + coverage row)
  - [ ] UPDATED `manual_testing_playbook/manual_testing_playbook.md` (add §13 + coverage row + TOC)
  - [ ] UPDATED `README.md` §4 STRUCTURE tree (add `feature_catalog/08--council/` + `manual_testing_playbook/08--council/`)

### Batch D — Test coverage gaps (SC-007 partial relaxation: tests/ permitted)

- [ ] T050 Read mandatory pre-flight + existing test pattern from `tests/unit/executor-config.vitest.ts`
- [ ] T051 Compose `prompts/batch-d-prompt.md` (RCAF; references executor-config.vitest.ts style + each lib module's public surface)
- [ ] T052 SIGKILL cleanup
- [ ] T053 Dispatch → capture
- [ ] T054 Run `pnpm vitest run` on 4 test files → exit 0
- [ ] T055 SC-007 partial check: `git diff --stat` returns ONLY `tests/` paths
- [ ] T056 strict validate
- [ ] T057 Mark closed

**Findings closed by Batch D:**

- [ ] DR-012 [P1] (NEW `tests/unit/coverage-graph-query.vitest.ts` — 8+ tests targeting `lib/coverage-graph/coverage-graph-query.ts`)
- [ ] DR-013 [P1] (NEW `tests/unit/coverage-graph-signals.vitest.ts` — 8+ tests targeting `lib/coverage-graph/coverage-graph-signals.ts`)
- [ ] DR-014 [P2] (UPDATED `tests/council/multi-seat-dispatch.vitest.ts` — expand from 2 tests to 6+ with 20+ expects)
- [ ] DR-015 [P2] (UPDATED `tests/council/round-state-jsonl.vitest.ts` — expand from 2 tests to 6+ with 20+ expects)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation Summary

The Phase 2 work is sequenced above as Batches A → B → C → D under `Phase 1: Setup`'s lifecycle. Each batch follows the RCAF dispatch pattern. Per-batch exit gates: bundle gate, SC-007 check, strict validate on packet + parent, SIGKILL cleanup before next batch.

Effort: ~6-10 min total cli-devin dispatch wall-clock + per-batch orchestrator-side verification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T070 Author `changelog/v1.2.0.0.md` per `changelog-entry.schema.json` (frontmatter + sections + audit_finding_refs cite DR-001..DR-037)
- [ ] T071 Bump `SKILL.md` frontmatter `version: 1.1.0` → `1.2.0`
- [ ] T072 Run `skill_graph_compiler.py --export-json --pretty`
- [ ] T073 Run `validate_document.py --type readme` on `.opencode/skills/deep-loop-runtime/README.md` → exit 0
- [ ] T074 Run `pnpm vitest run` on 4 Batch D files → exit 0 (final confirmation)
- [ ] T075 Final `validate.sh --strict` on new packet → exit 0
- [ ] T076 Final `validate.sh --strict` on parent `001-deep-loop-runtime/` → exit 0
- [ ] T077 Fill `implementation-summary.md` (no template placeholders)
- [ ] T078 Update parent `resource-map.md` Phase-5 Augmentation: mark each merged finding `[closed]` with batch ref
- [ ] T079 Update parent `implementation-summary.md` §1 Phase-5 paragraph to note "remediation packet 001-doc-remediation closed all 36 findings, ships v1.2.0"
- [ ] T080 `/memory:save` writes continuity update
- [ ] T081 Verify `skill_advisor.py "deep-loop-runtime" --threshold 0.8` returns the skill
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All findings rows above marked `[x]` or `[B]` with deferral rationale
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict validate exits 0 on packet + parent
- [ ] `pnpm vitest run` exits 0 on Batch D files
- [ ] SC-007 invariant verified: lib/scripts/storage/reduce-state diff empty
- [ ] `implementation-summary.md` filled (no placeholders)
- [ ] `changelog/v1.2.0.0.md` authored + SKILL.md version 1.2.0
- [ ] Parent docs reconciled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Schemas**: `schemas/*.json`
- **Parent Phase 5 synthesis**: `../research/research.md`
- **Replacement-string source**: `../research/iterations/iteration-007.md` §C + `../research/iterations/iteration-009.md`
<!-- /ANCHOR:cross-refs -->
