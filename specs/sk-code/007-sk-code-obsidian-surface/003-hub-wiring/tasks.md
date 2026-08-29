---
title: "Tasks: sk-code-obsidian hub wiring"
description: "Task breakdown for wiring OBSIDIAN into the registry, router, and detection reference, refreshing the manifest, and proving it live."
trigger_phrases:
  - "sk-code-obsidian hub wiring tasks"
  - "obsidian surface routing task breakdown"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/003-hub-wiring"
    last_updated_at: "2026-08-28T21:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Wired OBSIDIAN surface into hub"
    next_safe_action: "Author skill references"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/mode-registry.json"
      - "$HUB/.opencode/skills/sk-code/hub-router.json"
      - "$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md"
      - "$HUB/.opencode/skills/sk-code/leaf-manifest.json"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code-obsidian hub wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Read the live `mode-registry.json` and `hub-router.json` schemas in full before editing (`$HUB/.opencode/skills/sk-code/mode-registry.json`, `hub-router.json`)
- [x] T002 [P] Read the approved design plan for the proposed alias set, signal weight/classes, and detection precedence (`../001-surface-design-plan/mode-design-plan.md`)
- [x] T003 [P] Read the measured audit for the plugin markers the OBSIDIAN detection branch cites (`../002-repo-convention-audit/audit.json`)
- [x] T004 Run the negative-control route before any edit to capture the pre-change baseline (`compiled-route.cjs --hub sk-code --prompt "fix the table renderer in the obsidian note database plugin src/views"`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Append the sixth `modes[]` entry `sk-code-obsidian` and extend `extensions.surface-axis.surfaces` to 4 entries (`$HUB/.opencode/skills/sk-code/mode-registry.json`)
- [x] T011 Verify the 5 proposed aliases against every existing alias in the live registry before landing them (script-verified: 34 existing aliases across 5 modes, 0 clashes)
- [x] T012 Add `routerSignals["sk-code-obsidian"]`, the two `code-obsidian-*` vocabulary classes, and the `routerPolicy.tieBreak` slot (`$HUB/.opencode/skills/sk-code/hub-router.json`)
- [x] T013 Rewrite `stack-detection.md`'s surface table and five-way precedence order, add the numbered OBSIDIAN detection branch, and bump `version:` 4.1.0.10 -> 4.2.0.0 (`$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md`)
- [x] T014 Add the symlink-resolution guard so `OPENCODE` holds only when the resolved real path lands inside the hub's own `.opencode/` directory, and add the 5 new test-case rows proving it (`stack-detection.md`)
- [x] T015 Refresh the generated manifest with `refresh` after discovering `mint` returns `already-exists` and performs no update (`compiled-route-manifest.cjs refresh --hub sk-code --skill-root .opencode/skills/sk-code`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm the manifest status transitioned `causeCode: stale-manifest` (policy hash `eeae98f8…` vs. current `834a0e38…`) -> `causeCode: compiled-serving` (fingerprint `82764d6d…`), and `refresh` returned `fresh=true`
- [x] T021 Route the negative-control prompt again plus 3 more plugin-flavored prompts (screenshot scenario, `.db-*` class rename, code-quality review) and confirm all 4 resolve to `sk-code-obsidian`
- [x] T022 Route the 3 regression prompts (`app-mobile`, Webflow, `.opencode/skills`) and confirm each still resolves to `sk-code-mobile-cli`, `sk-code-webflow`, and `sk-code-opencode` respectively
- [x] T023 Run `ci-skill-root-metadata.cjs`, confirm the first run fails with `STALE_GENERATED_FILE: leaf-manifest.json is stale`, then re-run with `--fix` and confirm `checked=14 passed=14 failed=0`, exit code 0
- [x] T024 Confirm the hub-side diff is exactly 5 modified files plus the new untracked packet directory — no file outside the wiring scope was touched
- [x] T025 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and write `implementation-summary.md`; grep for residual scaffold markers — none remain

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Hub files wired**: `$HUB/.opencode/skills/sk-code/{mode-registry.json,hub-router.json,shared/references/stack-detection.md,leaf-manifest.json}`

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
- [x] CHK-003 [P1] Dependencies (design plan, measured audit, hub CLIs) identified and read/run

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `mode-registry.json` and `hub-router.json` remain valid JSON after editing (confirmed by a successful live parse and read)
- [x] CHK-011 [P0] The new `sk-code-obsidian` mode entry matches the field shape of the hub's 5 existing modes exactly (`packetKind`, `backendKind`, `toolSurface`, `aliases`, `advisorRouting`)
- [x] CHK-012 [P1] `stack-detection.md`'s precedence statement and detection branch use early-return logic — later branches do not overwrite earlier matches
- [x] CHK-013 [P1] The symlink guard is stated as changing how the detection test is performed, not which surface wins for a genuine hub file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Negative control captured before the change: `defer` with empty targets
- [x] CHK-021 [P0] All 4 positive-routing prompts resolve to `sk-code-obsidian` after the change
- [x] CHK-022 [P0] All 3 regression prompts resolve to their original, unchanged surfaces
- [x] CHK-023 [P1] Manifest `refresh` (not `mint`) confirmed as the correct verb for an existing manifest, and the trap recorded
- [x] CHK-024 [P1] Fleet gate fails before the refresh and passes clean (`14/14`, exit 0) after `--fix`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Same-class producer inventory completed: alias disjointness checked against every one of the hub's 34 existing aliases across its 5 other modes, not merely eyeballed
- [x] CHK-FIX-002 [P0] Consumer inventory completed: the change was verified against the compiled router's actual serving path (the generated manifest), not only the source JSON files an editor would see
- [x] CHK-FIX-003 [P0] The detection-branch fix (the symlink guard) is proven with an adversarial case: a target several directories below a symlinked `.opencode/` at the plugin repo root, confirmed to still resolve `OBSIDIAN`
- [x] CHK-FIX-004 [P1] Matrix axes listed before completion was claimed: 4 positive routes x 3 regression routes x 1 manifest-lifecycle check x 1 fleet-gate check
- [x] CHK-FIX-005 [P1] Evidence is pinned to the specific command outputs captured during this phase (manifest fingerprints, gate counts, exact prompts), not a generic "it works now" claim
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any edited hub file
- [x] CHK-031 [P0] The new `sk-code-obsidian` mode's declared tool surface stays read-only (`allowed: [Read, Bash, Grep, Glob]`, `forbidden: [Write, Edit, Task]`, `mutatesWorkspace: false`)
- [x] CHK-032 [P1] `grandfatheredFolderMismatch: false` confirms the new packet does not rely on a legacy folder-naming exception
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the measured proof (negative control, positive routes, regression routes, manifest transition, gate result)
- [x] CHK-041 [P1] No spec path, requirement id, task id, or checklist id introduced into any hub file
- [x] CHK-042 [P2] `stack-detection.md`'s `version:` frontmatter bump (4.1.0.10 -> 4.2.0.0) is recorded as evidence, not merely implied
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the 4 named hub files plus the generated manifest were modified; no file was created under `sk-code-obsidian/` by this phase
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
