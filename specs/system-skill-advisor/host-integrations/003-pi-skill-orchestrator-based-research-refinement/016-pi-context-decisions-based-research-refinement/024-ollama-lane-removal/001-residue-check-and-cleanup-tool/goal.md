---
title: "Goal: residue check and cleanup tool"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool"
    last_updated_at: "2026-11-20T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: residue check and cleanup tool

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the lane residue check and the unwired cleanup tool, and record every gate's baseline, so later phases start from measured evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The residue check stays report-only, and the cleanup tool stays unwired until phase 008. |
| D2 | Allowlist rows name exact paths, never folders. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The residue check in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/`, in report-only mode, exits 1 and its live plus allowlisted count equals 336: the 332 tracked files outside `specs/` that both vocabularies match, the tracked embeddings symlink that `git grep` cannot see, and the check's own three files (its script, allowlist and test).
- [ ] No file under `.skilled/commands/doctor/` calls the cleanup tool.
- [ ] The residue check and the cleanup tool each have a test file, and those tests exit 0.
- [ ] `implementation-summary.md` records a pass baseline for each gate that phases 002 to 008 must hold: advisor typecheck, test and build; shared and spec-kit builds and tests; `run-all.sh`; `derive-command-bridges.cjs --check`; the trigger-index check; the markdown link check; the four routing ratchets; and the advisor stress suite.
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
| Phase 001 | Pending | Parent phase map row 1 |

### Deviations and findings

| Item | Note |
|------|------|
| Sources | This goal follows parent phase map row 1 and handoff row 001 to 002, because `spec.md` and `implementation-summary.md` are unfilled scaffolds. |
<!-- /ANCHOR:log -->
