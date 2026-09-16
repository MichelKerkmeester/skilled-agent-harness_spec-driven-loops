---
title: "Goal: make the .opencode contract components work under either root"
description: "The durable directive for the phase that teaches root discovery, launchers, installers and two gates to resolve under .opencode, under .skilled and under an .opencode link before the tree moves, and the criteria that decide when it is done."
trigger_phrases:
  - "dual root phase goal"
  - "skilled contract components goal"
  - "either root completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts"
    last_updated_at: "2026-09-16T21:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive for this phase"
    next_safe_action: "Wait for phase 005 to validate, then run T001"
    blockers:
      - "Phase 005 has not validated PASSED yet"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-006-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which shape does phase 004 record for .opencode/?"
      - "Which phase owns the install-git-hooks.sh change, the .gitignore twins and the publish step that phase 004's plan assigns here?"
    answered_questions: []
---
# Goal: make the .opencode contract components work under either root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every component that defines what `.opencode` means resolves under `.opencode/`, under `.skilled/` and under an `.opencode -> .skilled` link, so the move can land as a pure rename.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Root names extend the existing sentinel logic. `repo-root.mjs` exports `.skilled` and `.opencode`, and resolvers test the sentinel under each name and hoist above either. Scripts resolve from their own directory. No new module is added. |
| D2 | The legacy spec alias keeps the single spelling `.opencode/specs`. Resolvers gain no `.skilled/specs` form and are proven in all three layouts. Detectors that must catch any on-disk spelling list all three. |
| D3 | The six MCP registrations name one path each, so they are proven by a launch probe and not edited here. Their retarget follows phase 004's shape and phase 009's rewrite. |
| D4 | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway drafts one file per short literal brief. GPT-5.6 sol on cli-codex reviews each component. The orchestrator owns every design choice, runs each unit's tests before the next unit starts and runs the move rehearsal. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 15 contract components pass their tests in three layouts: real `.opencode/`, real `.skilled/` and real `.skilled/` with `.opencode -> .skilled`. If phase 004 selects per-entry links, they also pass with `.opencode/` holding one link per moved entry
- [ ] Rows that fail on `728c4f3efc` and pass after the change cover a root resolved to its start directory, a zero-file guard pass, skipped worktree dependencies, a duplicated Codex hook, a workspace root at `.skilled` and drift sources lost to a `.skilled/` spelling
- [ ] In a `.skilled`-only clone of the rebuilt tree, the drift checker prints `[CONTRACT DRIFT] OK` and the no-spec-import guard exits 1 beside a seeded import. `test ! -e .opencode` holds after the suites
- [ ] `dist-freshness.cjs check --package <id> --json` reads `"stale":false` for every rebuilt package, and comment hygiene passes on every changed code file
- [ ] The phase validates `RESULT: PASSED` with every acceptance criterion Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this file, authored against `728c4f3efc` |
| Current-behavior probes | Done | Fixture probes in a session scratch directory covered root discovery, workspace identity, the advisor walk, the guard, the launcher paths, the hook installer, the worktree launcher, the relinker and drift-source derivation |
| Implementation | Pending | Waits on phase 005 validating PASSED (parent D1) |

### Deviations and findings

| Item | Note |
|------|------|
| Five root-discovery twins the map classed `mechanical` | Decided 2026-09-16: they join this phase (T065). Each compares a path segment with `.opencode`, so leaving them to phase 009 would misresolve under the link between the move and the rewrite |
| The dist staleness hook is not evidence | `check-dist-staleness.sh --all` always exits 0 and rebuilds a stale package on its own, so verification reads `dist-freshness.cjs check --json` directly |
| Global commit-msg hook blocks fixture commits | Seen while probing. Fixtures set `core.hooksPath` to an empty directory |
| Phase 004's shape for `.opencode/` | UNKNOWN at planning time. Its ADR-001 was Proposed and conditional on phase 003's probes: one `.opencode -> .skilled` link, or per-entry links. T001 records the Accepted shape, and REQ-015 adds the per-entry layout to the proof only if 004 selects it |
| Phase 004's plan assigns more work to this phase | Decided 2026-09-16: `install-git-hooks.sh` (T066), the `.gitignore` twins (T067) and the publish step (T070) stay here, following phase 004's cutover steps 6 to 8 |
| Layout names | Phase 004 uses L1 to L4 for its layout options, so this phase names its test layouts `today`, `skilled-only`, `whole-link` and `entry-links` |
<!-- /ANCHOR:log -->
