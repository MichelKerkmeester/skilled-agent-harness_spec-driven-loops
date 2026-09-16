---
title: "Goal: Phase 12: missing-stress-fixture-root"
description: "Restore the pruned 060 stress-test fixture in the current runtime tree shapes and make the shared sandbox setup executable again."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/012-missing-stress-fixture-root"
    last_updated_at: "2026-09-16T06:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Restored the stress-test fixture and repaired the sandbox setup script"
    next_safe_action: "Commit the restore with the runtime suite's exit code recorded"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: missing-stress-fixture-root

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `060-stress-test` fixture root named by the three agent-discipline scenario
documents exists again in the six runtime tree shapes this repository ships, and
`setup-cp-sandbox.sh` builds a sandbox in which the scenarios' helper steps run.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Restore the corpus rather than retire the scenarios. The six scenarios remain the only executable proof of the discipline boundaries the live deep-improvement agent contract still requires, and the prune was a bulk checkpoint with no recorded decision. |
| D2 | Shape the fixture as the six current runtime agent trees, dropping the retired `.gemini` mirror. |
| D3 | Do not restore the superseded `benchmark/sentinel.js`; the current benchmark-boundary scenario proves completion through the real benchmark runner's report instead of a stand-in sentinel. |
| D4 | The sandbox carries the shared package the helper scripts resolve by walking up from their own path, so a sandbox built by the script alone can execute the scenario's helper steps. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Each checkable without opening another file. Copy them into the objective: nothing
dereferences a path, so criteria left only here are invisible to whatever judges
completion.

- [x] `setup-cp-sandbox.sh --sandbox-dir /tmp/cp-proof-sandbox` exits 0 and prints `Created deep-improvement sandbox`
- [x] The sandbox carries the canonical target in all six runtime tree shapes, with the symlink mirrors resolving to the `.claude` file
- [x] `scan-integration.cjs` and `generate-profile.cjs` run from the sandbox and report the target aligned
- [x] `check-agent-mirror-sync.cjs --all` checks 12 agents and the roster check covers 12 per runtime, with no fixture agent among them
- [x] The deep-loop runtime suite exits zero with no failure to attribute
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Baseline failure reproduced | Done | Current script exits 1 before the fixture guard: `REPO_ROOT` resolved to `.opencode` |
| Corpus recovered | Done | Six pruned paths listed from `ebe7d6bb3c4^`; five reshaped and kept, `.gemini` dropped, sentinel dropped |
| Fixture restored | Done | Six tree shapes under `test-fixtures/060-stress-test/`, symlinks resolve |
| Script repaired | Done | Repo-root walk, six live required paths, shared-package provisioning; `SCRIPT_EXIT=0` |
| Sandbox helpers proven | Done | `SCAN_EXIT=0`, `PROFILE_EXIT=0` from a fresh sandbox |
| Gates run | Done | Mirror-sync OK, roster OK, codex/pi sync checks PASS, comment hygiene clean |

### Deviations and findings

| Item | Note |
|------|------|
| Brief's fixture layout was incomplete | The brief listed five pruned files; the prune commit also removed `benchmark/sentinel.js`, and the fixture lived under `deep-agent-improvement/` at prune time, not the current skill path. |
| Second setup-script failure, earlier than the brief's | The script failed on `REPO_ROOT` long before the fixture guard; the relative walk was correct at the pre-nesting path depth and went stale when the skill was nested under `system-deep-loop`. |
| Third blocker found by running | Sandboxed helper scripts resolve `@spec-kit/shared` from the skill family's `node_modules`; the sandbox needed the package plus `js-yaml`. |
| Model-dispatched runs not executed | Call A / Call B need an executor session; the sandbox and its helper steps are the proof this packet can carry. |
<!-- /ANCHOR:log -->
