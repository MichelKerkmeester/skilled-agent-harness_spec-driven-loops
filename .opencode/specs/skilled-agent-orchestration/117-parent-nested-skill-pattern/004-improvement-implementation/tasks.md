---
title: "Tasks: Implement the improvement-research findings (make C-plus real + hardening)"
description: "Tasks for phase 004 of the parent-nested-skill-pattern epic: the four-cluster implementation of the improvement-research findings (CI gate + /doctor advisor-sync, runtime self-containment, loop-lock unification, hardening), the rename completion, and the skill-benchmark Lane C restore."
trigger_phrases:
  - "implement improvement research findings tasks"
  - "make C-plus real CI advisor-sync tasks"
  - "deep-loop runtime self-contained loop-lock tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/004-improvement-implementation"
    last_updated_at: "2026-06-15T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for the improvement-implementation phase"
    next_safe_action: "Track the codegen follow-on; close out validation"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/skills/deep-loop-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-004-improvement-implementation-tasks"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Codegen the projection maps from the registry (P1) — staged as a follow-on; A3+A4 already make drift reliably caught"
    answered_questions: []
---
# Tasks: Implement the improvement-research findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read the per-finding research verdict and confirm SOUND-architecture / no-rearchitecture framing (`../improvement-research/improvement-research.md`)
- [x] T002 Assign Cluster A to the orchestrator and Clusters B/C/D to worktree agents (independent, reversible)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 [P] Cluster A — author the PR CI gate. (`.github/workflows/routing-registry-drift.yml`) [`b08346a9bc`]
- [x] T002 [P] Cluster A — add `/doctor` advisor-sync coverage: check 4b canonical exact-match + 4c non-canonical coverage WARN for inert lexical modes. (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [`b08346a9bc`]
- [x] T003 [P] Cluster C — route research/review/ai-council through the promoted `loop-lock.cjs`; race-safe `tryReclaimStaleLoopLock` via atomic rename; atomic fan-out-merge write. (`.opencode/skills/deep-loop-runtime/scripts/`) [`3b60619fd5`]
- [x] T004 [P] Cluster D — lifecycle-taxonomy drift-guard + `userPaused` 7th stopReason; advisory benchmark mode-precision signal; stale `@deep-ai-council`→`@ai-council` doc fix; `runtime_capabilities` conformance test. (`.opencode/skills/deep-loop-runtime/`) [`3b60619fd5`]
- [x] T005 [P] Cluster B — replace 12 `system-spec-kit/node_modules` reach-ins with bare specifiers (5 lib `.ts` zod/better-sqlite3; 7 scripts `.cjs` tsx-loader `path.resolve(...)`→`require.resolve('tsx')`). (`.opencode/skills/deep-loop-runtime/lib/`, `.opencode/skills/deep-loop-runtime/scripts/`) [`07fda483b8`]
- [x] T006 [P] Cluster B — add the runtime's own `package.json` (force-added past `.opencode/.gitignore`; pinned better-sqlite3 12.10.0 / zod 4.4.3 / tsx 4.21.0) + `package-lock.json` + standalone `vitest.config.ts` + `dependency-seams.vitest.ts` guard. (`.opencode/skills/deep-loop-runtime/`) [`07fda483b8`]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 CI viability fix — rewrite the gate off `npm ci` (untracked manifest + `file:` sibling + native/ML deps) onto `npx --yes vitest@4.1.6` + `actions/setup-python`. (`.github/workflows/routing-registry-drift.yml`) [`71a066c004`]
- [x] T008 Phase-1 rename completion — repoint 4 stale runtime references left by the 152→155 rename (graph-metadata derived edges; host-driven-improvement / prompt-pack / runtime-capabilities vitest fixtures). [`808b746366`]
- [x] T009 skill-benchmark Lane C restore — fix the 5-file skills-root depth resolution (SKILLS_DIR up-3→up-4; REPO_SKILLS up-1→up-2), the deep-improvement e2e `--fixtures-dir agent-improve-001`, and 3 stale parser anchors (sk-code playbook 24→28). [`216e9448d8`]
- [x] T010 Run the `deep-loop-runtime` standalone suite (expect 349/349) and the system-spec-kit changed-import tests (expect 17 green)
- [x] T011 Verify `npm ci` clean (88 pkgs); zero `system-spec-kit/node_modules` reach-ins (both forms); 3 tsx-boot `.cjs` run end-to-end
- [x] T012 Verify routing drift-guard + parity (19/19); `parent-skill-check.cjs` all invariants pass, 0 warnings; workflow YAML valid; skill-benchmark Lane C 71/71
- [x] T013 `validate.sh --strict` on this phase folder

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All actionable findings implemented; only the deliberately-deferred codegen (#3) remains as a tracked follow-on.
- [x] No `[B]` blocked tasks remaining.
- [x] All verification suites green at HEAD (runtime 349/349; routing 19/19; Lane C 71/71; `npm ci` clean).
- [x] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision**: See `decision-record.md`
- **Research being implemented**: `../improvement-research/improvement-research.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
