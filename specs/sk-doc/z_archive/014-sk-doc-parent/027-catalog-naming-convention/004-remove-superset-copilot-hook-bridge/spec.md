---
title: "Feature Specification: Remove the Superset/Copilot hook bridge from the repo"
description: "Decommission the checked-in bridge that forwarded Copilot hook lifecycle events to the operator's local ~/.superset/hooks/copilot-hook.sh. Deletes 6 pure-superset artifacts (the notify wrapper script, 3 propagated superset-notify.json config copies, the Superset webhook README, and the copilot-hook-wiring test) and surgically strips the superset call block / assertions from 5 load-bearing files (the two spec-kit Copilot lifecycle scripts, two hook docs, and the cross-runtime hook-parity test) so the spec-kit's own Copilot session-priming stays intact. Frozen spec history and z_archive references are preserved; the ~490 'superset'-the-word matches (set/type theory) are out of scope. Folded into the 027 parent per operator directive."
trigger_phrases:
  - "remove superset hook"
  - "decommission copilot hook bridge"
  - "superset-notify removal"
  - "delete superset subsystem"
  - "copilot hook parity teardown"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
    last_updated_at: "2026-07-12T11:02:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Removal executed and verified"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Blast radius corrected: the actual bridge is ~11 tracked files, not the 501 raw 'superset' string hits (most are the set/type-theory word)"
      - "session-start.sh + user-prompt-submitted.sh are spec-kit Copilot priming hooks, not superset — strip only the trailing ~/.superset call block, do not delete the file"
      - "root .github/hooks/superset-notify.json is git-excluded (.git/info/exclude:7): local only; backed up to scratchpad before rm"
      - "Operator directive: fold this decommission into the 027 parent as child 004; also purge the local untracked root config (not ~/.superset itself)"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Remove the Superset/Copilot Hook Bridge

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `003-underscore-content-folders-and-files`; successor none (final phase).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/014-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge |
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Owner skill** | system-spec-kit (owns the Copilot hook infrastructure); cross-cuts sk-code + system-skill-advisor hook docs/tests |
| **Origin** | Operator: "delete the whole subsystem" — decommission the checked-in Superset/Copilot hook bridge, after the blast radius was corrected from 501 string hits to ~11 real tracked files |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo checks in a bridge that forwards GitHub-Copilot hook lifecycle events (`sessionStart`, `sessionEnd`,
`userPromptSubmitted`, `postToolUse`) to a machine-local integration at `~/.superset/hooks/copilot-hook.sh`. The bridge
consists of a notify-wrapper script, a `superset-notify.json` config propagated into three subdirectory `.github/hooks/`
copies, a webhook README, a trailing call block inside the two spec-kit Copilot lifecycle scripts, and two tests plus
two docs that assert the wiring. The runtime brain (`~/.superset/hooks/copilot-hook.sh`) lives outside the repo, in the
operator's home directory. The operator wants the checked-in bridge removed.

### Purpose
Remove every repo-tracked artifact of the Superset/Copilot bridge while preserving the spec-kit's own Copilot
session-priming (which shares the same two lifecycle scripts), the cross-runtime hook-parity coverage for Claude and
OpenCode, and all frozen historical references. The `~/.superset/` app itself is the operator's to uninstall separately.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Delete outright (6 — pure-superset tracked artifacts):**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/hooks/scripts/superset-notify.sh` | Delete | The notify-wrapper that shells to `~/.superset/hooks/copilot-hook.sh` |
| `.opencode/skills/system-spec-kit/feature_catalog/.github/hooks/superset-notify.json` | Delete | Propagated bridge config copy |
| `.opencode/skills/system-spec-kit/mcp_server/.github/hooks/superset-notify.json` | Delete | Propagated bridge config copy |
| `.opencode/skills/system-spec-kit/scripts/.github/hooks/superset-notify.json` | Delete | Propagated bridge config copy |
| `.opencode/skills/system-spec-kit/mcp_server/.github/hooks/README.md` | Delete | "Superset Copilot Webhook Configuration" doc (entire file is about the bridge) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts` | Delete | Test that only asserts the bridge wiring |

**Edit, do not delete (5 — load-bearing, only a superset slice):**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/hooks/scripts/session-start.sh` | Modify | Remove the trailing `if [ -x ~/.superset/... ]` block; keep the spec-kit `session-prime.js` priming |
| `.github/hooks/scripts/user-prompt-submitted.sh` | Modify | Remove the trailing `~/.superset` block; keep the `user-prompt-submit.js` priming + fallback |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modify | Remove the sentence citing the `superset_notify.json` wrapper |
| `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` | Modify | Remove the three lines referencing `.github/hooks/superset-notify.json` |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts` | Modify | Drop the Copilot/superset arm (`COPILOT_SETTINGS` + its assertion); keep the Claude + OpenCode parity checks |

**Local machine (untracked):** `rm` the git-excluded root `.github/hooks/superset-notify.json` (backed up to scratchpad
first) and remove its `.git/info/exclude` line.

### Out of Scope (deliberate)
- `~/.superset/` itself (the operator's local app + `copilot-hook.sh`) — the operator uninstalls that separately.
- `cli-opencode/references/cli_reference.md:44` — documents the opencode BINARY path (`~/.superset/bin/opencode`), not
  the hook bridge; removing it would make the doc inaccurate about where the binary lives.
- All `.opencode/specs/**` and `z_archive/**` references — frozen historical record of the bridge's prior existence.
- The ~490 `superset`-the-word matches (set-theory / type-union "superset of", e.g. `deep_review_*.yaml`,
  `ensure-ready.ts`, `trust-state.ts`, `cli-capture-shared.ts`, `types.ts`, `graph-additive-recall.vitest.ts`) —
  unrelated to the bridge.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 6 pure-superset artifacts are removed from git | `git ls-files` returns none of the six paths |
| REQ-002 | Spec-kit Copilot priming survives the edits | `session-start.sh` still invokes `session-prime.js`; `user-prompt-submitted.sh` still invokes `user-prompt-submit.js` and writes the fallback; only the `~/.superset` block is gone |
| REQ-003 | The hook-parity test still passes | `hooks-parity-stress.vitest.ts` passes with the Claude + OpenCode arms; the Copilot/superset arm is removed, not left failing |
| REQ-004 | No dangling live reference to the bridge | No LIVE (non-`specs/`, non-`z_archive`) file references `superset-notify` or `~/.superset/hooks/copilot-hook.sh` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Local untracked root config purged | Root `.github/hooks/superset-notify.json` removed from disk (backup in scratchpad); `.git/info/exclude` line dropped |
| REQ-006 | Frozen history + false positives untouched | No change under `.opencode/specs/**` or `z_archive/**`; the "superset"-word files are unchanged |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live-tree grep for `superset-notify` / `.superset/hooks/copilot-hook` (excluding `specs/` + `z_archive`)
  returns zero hits.
- **SC-002**: The spec-kit MCP + skill-advisor vitest suites that touched the bridge pass (parity test green;
  wiring test removed, not orphaned).
- **SC-003**: `validate.sh --recursive --strict` is Errors 0 on the 027 parent and child 004.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-deletion of the two lifecycle scripts | Breaks spec-kit Copilot priming | Edit only the trailing `~/.superset` block; verify the `*-prime.js` / `*-submit.js` invocations remain |
| Risk | Orphaned test after removing an assertion | Red CI | Run the parity + wiring suites after the edit; wiring test is deleted whole, not half-gutted |
| Risk | Stranded reference in a live doc | Broken link / stale instruction | REQ-004 live-grep gate; markdown-link guard in verification |
| Dependency | `~/.superset/hooks/copilot-hook.sh` (out of repo) | Its callers vanish once the bridge is gone | Out of scope — operator uninstalls the app separately |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: All tracked removals land in one path-scoped commit → `git revert` fully restores the bridge.
- **NFR-R02**: The untracked root config is backed up to scratchpad before `rm`, so the local wiring is restorable.

### Safety
- **NFR-S01**: Commit is strictly path-scoped to the 11 bridge files + the 004 spec folder; the concurrent session's
  dirty files and daemon DB churn are never staged.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`.github/hooks/scripts/` becomes bridge-free but non-empty**: after deleting `superset-notify.sh`, the directory
  still holds the two lifecycle scripts — expected, not an empty-dir cleanup case.
- **Parity test's Copilot arm read a git-excluded file**: `hooks-parity-stress.vitest.ts` resolved
  `.github/hooks/superset-notify.json` (untracked) — removing that arm also removes a latent dependency on a local
  artifact, hardening the test.
- **"superset" substring collisions**: the reference sweep matches only `superset-notify` and the
  `.superset/hooks/copilot-hook` call path, never the bare word `superset`, so set/type-theory prose is safe.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the `~/.superset/bin/opencode` binary-path note in `cli_reference.md` also be scrubbed? **RESOLVED: No — it
  documents the opencode binary location, not the hook bridge, and is already hedged ("or another local bin path").**
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
