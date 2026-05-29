---
title: "Implementation Plan: Deep-loop empty archive-dir fix"
description: "Minimal command-YAML edits to stop eager archive-root creation in deep-research/deep-review, make restart archive lazily/guarded, plus regression tests and cleanup of existing empty archive dirs."
trigger_phrases:
  - "deep loop archive plan"
  - "archive root lazy restart"
  - "deep-research init mkdir"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/006-deep-loop-empty-archive-dir-fix"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned + executed the 6-edit fix + 2 regression tests + empties sweep"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-archive-fix-20260529"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-loop empty archive-dir fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode command-workflow YAML + Vitest (TypeScript) |
| **Surface** | `.opencode/commands/deep/assets/*.yaml` (deep-research / deep-review loops) |
| **Shared resolver** | `system-spec-kit/shared/review-research-paths.cjs` (`resolveArtifactRoot`, no mkdir) |
| **Testing** | Vitest contract-parity + resolver suites |

### Overview
The deep-research init step pre-created `{state_paths.archive_root}` alongside the packet runtime dirs. Because the archive root is only used on a `restart` move, fresh/resume runs left an empty `research_archive/`. The fix removes the archive root from init and makes the restart branch create it lazily, guarded on an existing packet, immediately before the `mv`. Deep-review init was already clean; its restart branch gets the same guarded form for symmetry and to close the orphan edge case.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (research init eager mkdir; introduced in commit `537cd82d26`)
- [x] Independent cross-check via cli-opencode `openai/gpt-5.5-fast` read-only deep-trace
- [x] Restart-safety reasoned through (lazy creation required after init change)

### Definition of Done
- [x] No init mkdir contains `archive_root`; all 4 restart branches lazy+guarded
- [x] Contract-parity + resolver suites pass (26/26)
- [x] Existing empty archive dirs removed; populated ones untouched
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative OpenCode workflow steps interpreted by the loop executor. Init (`phase_init.step_create_directories`) creates packet-owned runtime dirs; the restart branch (`on_restart` / `on_restart_choice`) archives the prior tree.

### Key Components
- **step_resolve_artifact_root**: `node -e resolveArtifactRoot(...)` → resolves `artifact_dir` + `artifact_archive_root` (no mkdir).
- **step_create_directories**: creates `prompts/ iterations/ deltas/` — must NOT include the archive root.
- **restart branch**: lazily `mkdir -p {archive_root} && mv {packet_dir} {archive_root}/{timestamp_slug}`, guarded on `[ -d {packet_dir} ]`.

### Data Flow
1. Resolve paths (no side effects).
2. Fresh/resume init creates only packet runtime dirs.
3. On restart: if the packet exists, create the archive root and move the packet under `{archive_root}/{timestamp_slug}`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigate
- [x] Trace every `*_archive` creator (git archaeology + cli-opencode gpt-5.5 read-only deep-trace)
- [x] Confirm research-init eager mkdir; confirm review init never created it

### Phase 2: Fix
- [x] Remove `{state_paths.archive_root}` from research init (auto:154, confirm:138)
- [x] Convert all 4 restart branches to lazy guarded `command:`
- [x] Add regression assertions to both contract-parity suites

### Phase 3: Verify & Clean
- [x] YAML validity + grep invariants + fresh/restart simulation
- [x] Vitest suites green (26 tests)
- [x] Remove 5 empty `*_archive` dirs (untracked); keep 5 populated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | YAML parse + grep invariants | python yaml, ripgrep |
| Behavioral | Fresh-init / restart-present / restart-absent | bash simulation |
| Contract | Parity + resolver suites + regression assertions | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review-research-paths.cjs` resolver | Internal | Green | Path resolution unchanged (no mkdir) |
| Vitest (mcp_server/node_modules) | Internal | Green | Cannot run contract tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A deep-loop restart fails to archive, or a fresh run regresses.
- **Procedure**:
  1. `git checkout` the 4 command YAMLs + 2 test files to the prior revision.
  2. Re-run the contract-parity + resolver suites to confirm baseline.
<!-- /ANCHOR:rollback -->
