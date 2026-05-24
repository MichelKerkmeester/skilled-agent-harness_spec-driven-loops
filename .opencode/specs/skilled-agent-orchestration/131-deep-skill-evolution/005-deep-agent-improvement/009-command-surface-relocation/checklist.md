---
title: "Verification Checklist: Deep Agent Improvement Command Surface Relocation"
description: "Checklist for command relocation, stale reference cleanup, runtime mirror alignment, and spec validation."
trigger_phrases:
  - "verification checklist deep agent command relocation"
  - "old improve command reference gate"
  - "prompt command verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T07:06:34Z"
    last_updated_by: "codex"
    recent_action: "recorded root README and runtime mirror audit evidence"
    next_safe_action: "report final status"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - ".opencode/commands/README.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000012"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim done until complete |
| **[P1]** | Required | Must complete or be explicitly reported |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] OpenCode agent assets moved to `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_{auto,confirm}.yaml`. Evidence: `find .opencode/commands/deep/assets`.
- [x] CHK-002 [P0] `the legacy OpenCode improve command folder` removed. Evidence: asset/deleted-folder test plan command passed.
- [x] CHK-003 [P0] `the legacy Gemini improve command folder` removed. Evidence: asset/deleted-folder test plan command passed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-004 [P0] Agent command entrypoint uses `/deep:start-agent-improvement-loop` and new asset names. Evidence: `.opencode/commands/deep/start-agent-improvement-loop.md`.
- [x] CHK-005 [P0] Prompt command entrypoint uses `/prompt`. Evidence: `.opencode/commands/prompt.md`.
- [x] CHK-006 [P1] Gemini mirrors point at the canonical OpenCode command specs. Evidence: `.gemini/commands/deep/start-agent-improvement-loop.toml`, `.gemini/commands/prompt.toml`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-010 [P0] Zero-old-reference gate returns no matches. Evidence: requested hidden-file `rg` gate exited with no output.
- [x] CHK-011 [P1] Positive-reference gate shows `/deep:start-agent-improvement-loop`, `/prompt`, and `deep_start-agent-improvement-loop`. Evidence: positive hidden-file `rg` gate returned current command/docs surfaces.
- [x] CHK-012 [P1] Command index no longer advertises an `improve/` command group. Evidence: `.opencode/commands/README.txt` lists deep/root surfaces, and root `README.md` now reports 24 commands with deep/root ownership.
- [x] CHK-013 [P1] Prompt-improver agent mirrors reference `/prompt` and `.opencode/commands/prompt.md`. Evidence: `.opencode`, `.claude`, `.codex`, and `.gemini` prompt-improver agent files were rewritten.
- [x] CHK-014 [P1] Runtime command surfaces checked across OpenCode, Gemini, Claude, and Codex. Evidence: OpenCode has canonical Markdown commands; Claude commands symlink to OpenCode; Gemini has deep/root TOML mirrors; Codex has no command mirror directory in this repo snapshot.

## Spec Checks

- [x] CHK-020 [P0] Child phase validates with `validate.sh .../009-command-surface-relocation --strict`. Evidence: strict child validation passed.
- [x] CHK-021 [P0] Parent phase validates recursively with `validate.sh .../005-deep-agent-improvement --strict --recursive`. Evidence: recursive parent validation passed.
- [x] CHK-022 [P1] Parent phase map and graph metadata include `009-command-surface-relocation`. Evidence: parent `spec.md` phase map and `graph-metadata.json` children list include child `009`.

## Routing Checks

- [x] CHK-030 [P1] Skill advisor routes "run the deep agent improvement loop" to `deep-agent-improvement`. Evidence: smoke test returned `deep-agent-improvement` above threshold.
- [x] CHK-031 [P1] Skill advisor routes "improve this prompt" to `sk-prompt` or a prompt-improvement route. Evidence: smoke test returned `sk-prompt` above threshold.
- [x] CHK-032 [P1] OpenCode alignment drift check was run and result recorded. Evidence: command executed and failed before drift evaluation with `FileNotFoundError` for `.opencode/skill/mcp-chrome-devtools/scripts/install.sh`; the file exists under `.opencode/skills/...`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Removed command surface classified as cross-consumer string migration. Evidence: `plan.md` producer and consumer inventory.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with exact `rg` gates. Evidence: `plan.md` §4.
- [x] CHK-FIX-003 [P0] Consumer inventory covers command specs, mirrors, agents, skills, specs, archives, and changelogs. Evidence: `plan.md` §4.
- [x] CHK-FIX-004 [P1] Matrix axes are command name, file path, asset name, runtime mirror, and spec metadata. Evidence: `spec.md` requirements and acceptance scenarios.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P1] No secret-bearing files were created. Evidence: migration edits are docs, command specs, TOML wrappers, and YAML asset moves.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-050 [P1] Spec/plan/tasks/checklist/decision/summary are synchronized after final verification.
- [x] CHK-051 [P1] Parent phase map includes child `009`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-060 [P1] Runtime assets live under `.opencode/commands/deep/assets/`. Evidence: asset file check.
- [x] CHK-061 [P1] Root prompt command lives at `.opencode/commands/prompt.md`. Evidence: file exists and Gemini wrapper points there.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

- [x] CHK-900 [P0] All P0 checks are complete.
- [x] CHK-901 [P1] Remaining P1 results are complete or explicitly reported.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-ARCH-001 [P1] Command family ownership is deep/root, not improve. Evidence: `.opencode/commands/README.txt`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-PERF-001 [P2] No runtime performance path changed; migration is command/docs/assets only.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] All command files and mirrors exist in their canonical locations.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-COMP-001 [P1] User-required zero-reference gate is clean.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-DOCS-001 [P1] Strict child and recursive parent spec validation are recorded.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] CHK-SIGN-001 [P1] Final implementation summary records pass/fail evidence.
<!-- /ANCHOR:sign-off -->
