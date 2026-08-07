---
title: "Tasks: Phase 6: advisor-and-integration"
description: "Execution checklist for the phase 006 active referrer sweep, generated advisor graph regeneration, and prompt-card sync verification."
trigger_phrases:
  - "phase 006 tasks"
  - "advisor integration tasks"
  - "sk-prompt-models referrer sweep"
  - "prompt card sync verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T13:53:00Z"
    last_updated_by: "opencode"
    recent_action: "Draft phase 006 tasks from scaffold"
    next_safe_action: "Execute the referrer sweep after phase 005 lands"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/006-advisor-and-integration/plan.md"
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/006-advisor-and-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "draft-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: advisor-and-integration

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phase 005 has completed the directory move and functional path/write-target updates before editing phase 006 referrers. — Evidence: phase 005 validate.sh --strict PASSED before this phase started.
- [x] T002 Capture the baseline active-path `grep -rl "sk-prompt-models"` result and classify historical spec/changelog hits separately from operational hits. — Evidence: initial sweep found 60 files; classified into historical changelogs/benchmark artifacts (skip, per the 121-program lesson) vs. live docs/code (fix).
- [x] T003 Identify the repository's advisor rebuild/compiler command that regenerates `skill-graph.json` from `graph-metadata.json`. — Evidence: `system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`. NOT run this phase — see T013.
- [x] T004 Identify the command path used by `.github/workflows/prompt-card-sync.yml` to run `check-prompt-quality-card-sync.sh`. — Evidence: `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`, invoked with repo root as arg.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update advisor/graph source metadata so folded `prompt-models` signals and the `enhances -> cli-opencode` edge survive graph regeneration. — Evidence: done in phase 005 (`sk-prompt/graph-metadata.json`); `cli-opencode/graph-metadata.json`'s dangling `enhances -> sk-prompt-models` edge repointed to `sk-prompt` this phase.
- [x] T006 Update `cli-opencode` core docs. — Evidence: both files repointed, `check-prompt-quality-card-sync.sh` CHECK 2 re-confirms both still PASS.
- [x] T007 Update `cli-opencode` assets and references. — Evidence: all 5 files repointed; `check-prompt-quality-card-sync.sh` CHECK 1 re-confirms prompt_quality_card.md still PASS.
- [x] T008 Update `cli-opencode` prompt-template playbooks. — Evidence: 3 template files + the playbook root repointed.
- [x] T009 Update `system-deep-loop/deep-improvement` docs and benchmark-profile prose. — Evidence: `SKILL.md`, `README.md`, `runtime_truth_contracts.md` repointed; `reviewer_regression.json`'s functional `outputsDir` path fixed (this one was a live config value, not prose).
- [x] T010 Update `system-skill-advisor` manual-testing playbooks. — Evidence: 5 files (skill-graph-status, corpus-df-idf, provenance-and-trust-lanes, age-haircut, supersession) repointed.
- [x] T011 Update `system-spec-kit` manual-testing playbooks. — Evidence: 2 files (cross-process-db-hot-rebinding, markdown-link-integrity-guard) repointed.
- [x] T012 Update root-level docs. — Evidence: `.opencode/skills/README.md`, `AGENTS.md`, root `README.md` repointed and link-verified (`sk-prompt/prompt-models/README.md` resolves on disk); `install_guides/{README.md,"SET-UP - AGENTS.md"}` did not actually contain `sk-prompt-models` on re-check (not in the final comprehensive sweep's hit list) — no edit needed there.
- [B] T013 Regenerate `skill-graph.json` through the advisor rebuild/compiler command; do not hand-edit the generated artifact. — DEFERRED, not executed: this file was ALREADY stale before this program started (dated 2026-07-04, predates an unrelated `deep-loop-workflows` -> `system-deep-loop` rename), and repo memory explicitly flags the canonical reindex as operator/successor-gated to avoid clobbering concurrent-session work. Regenerating it now would bundle this program's changes into a broader, higher-risk reindex outside this phase's scope. The stale `sk-prompt-models` entries in `skill-graph.json` are a known, pre-existing, flagged gap — not a new regression from this program.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Re-run the full active-path sweep. — Evidence: final comprehensive sweep (10 file extensions) returns zero hits outside `secret-scrubber.vitest.ts` (arbitrary test-fixture string, not functional), `sk-prompt/graph-metadata.json` (intentional historical context note), and the deferred `skill-graph.json` (T013).
- [x] T015 Run `check-prompt-quality-card-sync.sh` through the same path used by the CI workflow. — Evidence: `bash check-prompt-quality-card-sync.sh .` — GUARD PASS, all 4 checks clear.
- [x] T016 N/A — skill-graph.json regeneration deferred per T013; no diff to review this phase.
- [x] T017 Run the phase spec validation command. — Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../006-advisor-and-integration --strict` passed 0/0.
- [x] T018 Record evidence in `implementation-summary.md` only after the phase 006 execution tasks are actually completed. — Evidence: implementation-summary.md written after T001-T017.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 stale-reference requirements from `spec.md` are satisfied; the generated-graph requirement is explicitly deferred (T013) — Evidence: see T013/T016 rationale.
- [x] The prompt-card sync gate has been exercised successfully — Evidence: T015, GUARD PASS.
- [x] One `[B]` task remains (T013, skill-graph.json regeneration) — explicitly deferred with documented rationale, not a silent gap. All other tasks are `[x]`.
- [x] `implementation-summary.md` is written only after execution evidence exists — Evidence: T018.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
