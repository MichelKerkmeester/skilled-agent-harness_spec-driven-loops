---
title: "Tasks: Phase 3: remediation-doctor"
description: "One task per DR-01..DR-06 finding-fix step, grouped P1 then P2, each fix followed by a [P] grep/route-validate verification task, closing with a full route-validate.sh + validate.sh --strict pass."
trigger_phrases:
  - "tasks"
  - "doctor remediation tasks"
  - "route-validate extension tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/003-remediation-doctor"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "markdown-agent"
    recent_action: "T001-T021 all [x] with evidence; DR-01..DR-06 fixed"
    next_safe_action: "006-validation-closeout: run read-only /doctor target proof"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 3: remediation-doctor

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

**Task Format**: `T### [P?] <FINDING-ID>: <one-line fix> (file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

P1 fix — doctor discoverability (DR-01).

- [x] T001 DR-01: Add `skill-graph-freshness` row to the Workflow Assets table, between `parent-skill` and `fable-mode` (`.opencode/commands/doctor/speckit.md:29-39`)
  - **Evidence**: row added at `speckit.md:39` (`| \`skill-graph-freshness\` | \`.opencode/commands/doctor/assets/doctor_skill-graph-freshness.yaml\` |`); table now lists all 10 `_routes.yaml` targets.
- [x] T002 [P] DR-01: Add `skill-graph-freshness` to the numbered startup menu, "Valid targets:" line, and subsystem manifest table; renumber every option after the insertion point and the "Accepted answers" table and "Press 1-N, 0, or X." prompt (`.opencode/commands/doctor/assets/doctor_speckit_presentation.txt:8-41,79,95-105`)
  - **Evidence**: menu option `10) Check Skill-Graph freshness`, `fable-mode` renumbered `10`→`11`; Accepted-answers row `\`10\` | target = \`skill-graph-freshness\``; Help Block row + renumbered Fable Mode row; "Press 1-11, 0, or X."; "Valid targets:" line and subsystem table row both updated (`doctor_speckit_presentation.txt:21-22,41-42,67-68,75,82,108`).
- [x] T003 [P] Verify REQ-001: `grep -c 'skill-graph-freshness' speckit.md` ≥1; `grep -c 'skill-graph-freshness' doctor_speckit_presentation.txt` ≥3 (menu, valid-targets, subsystem table); `bash .opencode/commands/doctor/scripts/route-validate.sh` exits 0
  - **Evidence**: `grep -c` results = 1 and 3 respectively (confirmed live); full `route-validate.sh` run after all fixes landed = exit 0 (see T019).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

P2 fixes — schema uniformity, header honesty, validator extension, manifest reclassification (DR-06, DR-05, DR-04, DR-02, DR-03).

### DR-06 (independent, single file)
- [x] T004 DR-06: Replace prose `read_only_invariant:` with a `mutation_boundaries:` block matching `doctor_embeddings.yaml:34-40` (`.opencode/commands/doctor/assets/doctor_fable-mode.yaml:20-24`)
  - **Evidence**: `doctor_fable-mode.yaml` now has `mutation_boundaries: {read_only: true, allowed_targets: [], forbidden_targets: ["**/*"], invariant: "<original prose verbatim>"}`.
- [x] T005 [P] Verify REQ-006: `grep -c 'mutation_boundaries:' doctor_fable-mode.yaml` = 1 (was 0); `grep -c 'read_only_invariant:' doctor_fable-mode.yaml` = 0 (was 1); `route-validate.sh` exits 0
  - **Evidence**: both grep counts confirmed live (1 and 0); full-suite `route-validate.sh` = exit 0 (see T019).

### DR-05 (independent, header/message honesty)
- [x] T006 DR-05: Rewrite `_routes.yaml`'s header `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)` claim to state doctor `trigger_phrases` are not currently harvested by either advisor implementation (`.opencode/commands/doctor/_routes.yaml:1-24`)
  - **Evidence**: `_routes.yaml:7-15` now reads "Consumed by: NOT currently harvested by either Skill Advisor implementation..." plus the corrected `trigger_phrases` schema-comment line.
- [x] T007 [P] DR-05: Soften the G1 "advisor will lose recall" assertion message so it no longer implies advisor consumption of doctor `trigger_phrases` (`.opencode/commands/doctor/scripts/route-validate.py:~245`)
  - **Evidence**: `route-validate.py` G1 message now reads "schema requires >=1 descriptive phrase per route" (no advisor-consumption implication).
- [x] T008 [P] Verify REQ-005: `grep -n 'Consumed by' _routes.yaml` states the true (unharvested) scope; `grep -c 'will lose recall' route-validate.py` = 0
  - **Evidence**: `grep -n 'Consumed by' _routes.yaml` → `7:# Consumed by: NOT currently harvested by either Skill Advisor implementation.`; `grep -c 'will lose recall' route-validate.py` → 0.

### DR-04, part 1 — extend the validator BEFORE the manifest fix (sequencing constraint: must land before T014-T017)
- [x] T009 DR-04: Add assertion I (route→script existence: resolve every route's `script_invocations` and fail on a missing script path) (`.opencode/commands/doctor/scripts/route-validate.py`, new section after existing H at ~260)
  - **Evidence**: `SCRIPT_PATH_RE` constant + assertion I block added; `route-validate.sh` output shows `PASS: I1: all route script_invocations resolve to existing local scripts`.
- [x] T010 DR-04: Add assertion J (target-set parity: `_routes.yaml` routes vs `speckit.md` Workflow Assets table vs presentation menu/valid-targets/subsystem-table target sets must match) (`route-validate.py`, new section)
  - **Evidence**: `parse_speckit_targets`/`parse_presentation_targets` helpers + assertion J block added; output shows `PASS: J1: _routes.yaml routes, speckit.md table, and all 3 presentation displays are in parity`.
- [x] T011 DR-04: Add assertion K (read-only mutation-policy: fail any `mutating: read-only` route whose YAML declares a file/DB write or a mutating MCP tool) (`route-validate.py`, new section)
  - **Evidence**: `WRITE_ACTIVITY_RE`/`KNOWN_MUTATING_MCP_TOOLS` constants + assertion K block added; output shows `PASS: K1/K2: no read-only route declares a write or grants a mutating MCP tool` post-fix.
- [x] T012 DR-04: Add `--self-test` fixtures for I/J/K (missing-script, target-set-mismatch, read-only-with-write) alongside the existing 3 fixtures (`.opencode/commands/doctor/scripts/route-validate.sh`)
  - **Evidence**: 3 new fixture heredocs added to `route-validate.sh`; self-test loop now iterates 6 fixtures.
- [x] T013 [P] Verify DR-04 pre-fix proof: run `route-validate.sh` against the still-unfixed `_routes.yaml`; confirm assertion K FAILS for `memory`/`causal-graph`/`code-graph`/`deep-loop` (the "would have caught it" evidence REQ-004 requires) and `route-validate.sh --self-test` passes all 6 fixtures (3 original + 3 new)
  - **Evidence**: ran with DR-01/05/06/04 landed but DR-02/03 NOT yet applied → exit 1, `K1` FAIL for `memory`/`causal-graph`/`code-graph`/`deep-loop`, `K2` FAIL for `memory` (`memory_index_scan`); A/B/C/D/E/F/G/I/J all PASS. Saved to `scratch/pre-fix-K-proof.txt`. `--self-test` at this point: all 6 fixtures correctly rejected, exit 0.

### DR-02 + DR-03 — route-manifest reclassification (depends on T009-T012 landing first)
- [x] T014 DR-02: Change `mutating: read-only` → `mutating: add-only` for `memory` (27-32), `causal-graph` (60-65), `code-graph` (76-84), `deep-loop` (100-105); set each `gate3_location` to the concrete `<packet_scratch>/...` path already named in that route's own `outputs` (`.opencode/commands/doctor/_routes.yaml`)
  - **Evidence**: all 4 routes now `mutating: add-only` with concrete `gate3_location` (memory: report+state paths joined with ` + `; causal-graph/deep-loop: state-log path; code-graph: `{packet_scratch}/code-graph-diagnostic-{timestamp}.md`, preserving that route's own literal path style). No `n/a` remains on any of the 4.
- [x] T015 DR-03: Remove `mcp__mk_spec_memory__memory_index_scan` from the `memory` route's `mcp_tools` list (`.opencode/commands/doctor/_routes.yaml:27-39`)
  - **Evidence**: `grep -n memory_index_scan _routes.yaml` → 0 matches (was present at old line 35).
- [x] T016 DR-03: Remove `mcp__mk_spec_memory__memory_index_scan` from `speckit.md`'s frontmatter `allowed-tools` (`.opencode/commands/doctor/speckit.md:4`); leave `doctor_update.yaml:399`'s usage untouched (its legitimate home)
  - **Evidence**: `grep -c memory_index_scan speckit.md` → 0; `doctor_update.yaml:399` still reads `action: "memory_index_scan({ incremental: false, force: true })"` (untouched).
- [x] T017 [P] DR-02: Align descriptive wording in the four target YAMLs' `phase_3_report`/`phase_2_proposal` sections with the new `add-only` classification (`doctor_memory.yaml:202-225`, `doctor_causal-graph.yaml:210-217`, `doctor_code-graph.yaml:174-186`, `doctor_deep-loop.yaml:227-235`)
  - **Evidence**: each route's `Write to`/`Write state log to`/`Write report to` activity line now carries a trailing `(mutation class: add-only per _routes.yaml; ... stays read-only)` annotation; also updated the presentation Subsystem Manifest Display's Mutation Class column for the same 4 rows (direct consequence of the same edit, in-scope same-file follow-through).
- [x] T018 Verify REQ-002/REQ-003: `grep -A1 'target: <name>'` shows `add-only` + concrete `gate3_location` for all 4 routes; `grep -n memory_index_scan _routes.yaml` absent from the `memory` block; `grep -c memory_index_scan speckit.md` = 0; assertion K now PASSES for all 4 routes
  - **Evidence**: all 4 routes confirmed `add-only` + non-`n/a` `gate3_location` (see T014); `_routes.yaml`/`speckit.md` greps both 0 matches (see T015/T016); post-fix `route-validate.sh` shows `PASS: K1/K2: no read-only route declares a write or grants a mutating MCP tool`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run `bash .opencode/commands/doctor/scripts/route-validate.sh` full pass — expect exit 0 with assertions A-K all passing
  - **Evidence**: `OK: route-validate — 10 routes validated, 3 warnings`; exit 0. A/A2/B1/B2/C1/D1/E1/F2/G1/I1/J1/K1-K2 all PASS; the 3 WARN are pre-existing informational H1 flag-collision notices, unrelated to DR-01..DR-06.
- [x] T020 Run `bash .opencode/commands/doctor/scripts/route-validate.sh --self-test` — expect all 6 fixtures (3 original + 3 new) to correctly fail their negative cases
  - **Evidence**: `INFO: All self-tests passed.`; exit 0; all 6 fixtures (`missing-key`, `missing-asset`, `duplicate-target`, `missing-script`, `target-set-mismatch`, `read-only-with-write`) correctly rejected.
- [x] T021 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/003-remediation-doctor --strict` — expect exit 0
  - **Evidence**: `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`, exit 0 (after `generate-description.js` + `backfill-graph-metadata.js` regen following the final checklist.md edits).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T021 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `route-validate.sh` exits 0 (T019)
- [x] `route-validate.sh --self-test` passes all fixtures (T020)
- [x] `validate.sh --strict` exits 0 for this spec folder (T021) — see implementation-summary.md
- [x] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings Source**: `../001-conformance-deep-research/research/research.md` §3.2 (DR-01..DR-06)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~90 lines source / 21 real tasks)
- Core + Level 2 detail
- Finding-driven (DR-01..DR-06), sequenced per plan.md
- Explicit verification tasks per requirement
-->
