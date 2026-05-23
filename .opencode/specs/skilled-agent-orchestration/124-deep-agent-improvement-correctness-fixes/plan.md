---
title: "Implementation Plan: Packet 124 deep-agent-improvement correctness fixes"
description: "Level 3 implementation plan for 5 P0 and 3 P1 deep-agent-improvement correctness fixes."
trigger_phrases:
  - "packet 124 plan"
  - "deep-agent-improvement plan"
  - "DAI correctness plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-deep-agent-improvement-correctness-fixes"
    recent_action: "Planned packet 124 source fixes and verification gates."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run final validation and reconcile evidence."
---
# Implementation Plan: Packet 124 deep-agent-improvement correctness fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Technical context:

| Aspect | Value |
| --- | --- |
| Surface | OPENCODE |
| Languages | CommonJS, YAML, JSON, Markdown |
| Primary Skill | `.opencode/skills/deep-agent-improvement/` |
| Command Workflow | `.opencode/commands/improve/assets/improve_deep-agent-improvement_*.yaml` |
| Tests | Vitest files under `scripts/tests/`, `node --check`, strict spec validation |

The implementation repairs eight high-priority findings with surgical changes. Error typing is centralized in a small helper; scoring null-handling stays inside `score-candidate.cjs`; path fixes are constrained to the scanner and workflow/config references; documentation changes align to source behavior rather than inventing new runtime semantics.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Definition of Ready:

- [x] Packet 123 research, roadmap, and applicability docs read.
- [x] `deep-agent-improvement` source files read before editing.
- [x] `cli-guards.cjs` pattern read for typed exit-code style.
- [x] Level 3 templates read.

Definition of Done:

- [x] 5 P0 and 3 P1 findings patched.
- [x] Modified `.cjs` scripts pass syntax checks.
- [x] Existing `deep-agent-improvement` tests run or documented if unavailable.
- [x] Alignment drift check passes for the target skill.
- [x] Strict spec validation passes with 0 errors and 0 warnings.
- [x] Commit Handoff is present in `implementation-summary.md`.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The packet keeps the existing script architecture:

- `generate-profile.cjs` remains the profile builder and now emits typed child-process error payloads.
- `score-candidate.cjs` remains the 5D scorer and now consumes typed profile errors plus explicit null dimension states.
- `scan-integration.cjs` remains the integration surface scanner and now resolves plural OpenCode paths.
- `promote-candidate.cjs` remains the guarded promotion helper and gains an opt-in runtime mirror sync flag.
- Workflow YAML remains the orchestration surface and points to the actual manifest filename.

Data flow:

```text
candidate path
  -> generate-profile.cjs
      -> typed error helper on failure
  -> score-candidate.cjs
      -> 5 dimensions
      -> null if a dimension has no checks
      -> recommendation blocks improvement when unscored
  -> promotion path
      -> existing evidence gates
      -> optional runtime mirror sync abort
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Read packet 123 evidence and roadmap.
- Read target scripts, docs, YAML workflows, changelogs, and validation templates.
- Confirm `improvement-journal.cjs` stop-reason enum is source of truth.

### Phase 2: Implementation

- Add typed error helper and wire profile/scorer error handling.
- Replace zero-check perfect scoring with explicit null scoring.
- Fix scanner plural OpenCode paths and OpenCode mirror coverage.
- Add opt-in mirror sync flag and packet-127 TODO in promotion.
- Align README, SKILL version, v1.4 changelog, manifest paths, and workflow YAML.
- Author Level 3 spec docs.

### Phase 3: Verification

- Run `node --check` on modified `.cjs` files.
- Run targeted behavior checks for profile failure typing, scoring, and integration scanning.
- Run existing `deep-agent-improvement` tests.
- Run OpenCode alignment drift check.
- Run strict spec validation and patch any warnings/errors.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Purpose |
| --- | --- | --- |
| Script syntax | `node --check <modified .cjs>` | Prove changed CommonJS parses. |
| Profile missing file | `node generate-profile.cjs --agent=/tmp/does-not-exist-agent.md` | Prove `FILE_NOT_FOUND` and exit code 3. |
| Real scoring smoke | `node score-candidate.cjs --candidate=.opencode/agents/deep-agent-improvement.md ...` | Prove normal dynamic scoring still emits a scored result. |
| Scanner smoke | `node scan-integration.cjs --agent=deep-agent-improvement` | Prove plural paths discover commands/skills/mirrors. |
| Existing tests | `find ... "*.vitest.ts" ...` plus test runner | Preserve existing behavior. |
| Alignment | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` | OpenCode surface alignment. |
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | Level 3 doc compliance. |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Notes |
| --- | --- | --- | --- |
| Node.js | Runtime | Available | Required for `.cjs` scripts and syntax checks. |
| Vitest config | Test tooling | To verify | Existing tests determine exact runner. |
| system-spec-kit validator | Validation | Available | Strict Level 3 gate. |
| sk-code alignment verifier | Validation | Available | Required OPENCODE verification. |
| Packet 123 docs | Context | Read | Source of findings and packet sequencing. |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is file-level revert of packet 124 changes only. If a script regression appears, revert the changed `deep-agent-improvement` script and helper files together because `generate-profile.cjs` and `score-candidate.cjs` share the typed error helper. If workflow manifest paths regress, revert YAML/config filename changes as one unit. Do not touch packets 125-128 or sibling skills.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

```text
Phase 1: Setup
  -> Phase 2: Implementation
      -> Phase 3: Verification
```

| Phase | Depends On | Blocks |
| --- | --- | --- |
| Setup | Existing packet 123 evidence | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Completion claim |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Workstream | Estimate | Actual Notes |
| --- | --- | --- |
| Source fixes | Medium | Multiple small script/docs/YAML fixes. |
| Level 3 docs | Medium | Full ADR/checklist/metadata required. |
| Verification | Medium | Syntax, tests, alignment, strict validation. |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

Rollback checkpoints:

- Before source patches: existing `deep-agent-improvement` behavior.
- After script patches: run `node --check` before continuing.
- After docs: run strict validation and patch docs only if needed.

If null scoring breaks a downstream consumer, revert the null-weighted-score logic in `score-candidate.cjs` while keeping typed profile errors isolated for separate evaluation. If mirror sync flag causes promotion disruption, remove only the opt-in flag block and leave the packet-127 TODO documented in ADR history.

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 11. DEPENDENCY GRAPH

```text
typed-errors.cjs
  -> generate-profile.cjs
  -> score-candidate.cjs

target_manifest.jsonc path
  -> workflow YAML
  -> improvement_config.json
  -> score/promote script invocations

scan-integration.cjs plural paths
  -> scoreDimIntegration()

promote-candidate.cjs mirror flag
  -> packet 127 full runtime parity
```

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 12. CRITICAL PATH

The critical path is DAI-009 plus DAI-010: profile errors feed scoring, and scoring feeds promotion decisions. Documentation truth and path fixes can run alongside, but completion cannot be claimed until the scorer proves both normal scoring and failure typing are visible.

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 13. MILESTONES

| Milestone | Deliverable | Status |
| --- | --- | --- |
| M1 | Source files read and findings mapped | Complete |
| M2 | 5 P0 fixes implemented | Complete |
| M3 | 3 P1 fixes implemented | Complete |
| M4 | Level 3 docs authored | Complete |
| M5 | Validation gates passed | Complete |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adr -->
## 14. ADR

ADR-001 in `decision-record.md` records the typed error taxonomy, explicit null scoring policy, and packet-124 cross-runtime sync mechanism. It includes five-checks evaluation and rejected alternatives.

<!-- /ANCHOR:adr -->
