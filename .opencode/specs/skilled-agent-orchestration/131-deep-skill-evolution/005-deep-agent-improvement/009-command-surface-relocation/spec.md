---
title: "Feature Specification: Deep Agent Improvement Command Surface Relocation"
description: "Moves the deep-agent-improvement command out of the removed improve command group and makes root /prompt the canonical prompt-improvement entrypoint. The phase covers command assets, runtime mirrors, routing docs, and repo-wide stale-reference cleanup."
trigger_phrases:
  - "deep agent improvement command relocation"
  - "start agent improvement loop command"
  - "prompt command relocation"
  - "remove improve command group"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T06:55:51Z"
    last_updated_by: "codex"
    recent_action: "completed command surface relocation and recorded validation evidence"
    next_safe_action: "report alignment-drift verifier caveat"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/prompt.md"
      - ".opencode/commands/README.txt"
      - ".gemini/commands/deep/start-agent-improvement-loop.toml"
      - ".gemini/commands/prompt.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000009"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The user chose a full repo rewrite, including archives and changelogs."
      - "No compatibility alias is retained for the legacy agent-improvement command or the legacy prompt-improvement command."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

## Executive Summary

The legacy improve command family is removed from the live command surface. Deep-agent-improvement now belongs to `/deep:start-agent-improvement-loop`, prompt improvement belongs to root `/prompt`, and runtime mirrors/docs must not point users at removed command folders.

**Key Decisions**: remove compatibility aliases, keep deep-agent-improvement under the existing 005 phase parent, and rewrite historical references because the requested policy is repo-wide consistency.

**Critical Dependencies**: command assets, Gemini mirrors, skill-advisor routing, prompt-improver agents, and parent spec metadata must stay aligned.

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Last Updated** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Spec** | `131-deep-skill-evolution/005-deep-agent-improvement` |
| **Handoff Criteria** | Old-reference gate returns no matches; strict spec validation passes for this phase and recursive parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

The legacy agent-improvement command was moved to the deep command family and renamed, while the legacy prompt-improvement command was moved to root `/prompt`. Several command docs, runtime mirrors, prompt-improver agents, skill docs, and historical packet references still used the old names or file paths, which would keep directing operators toward deleted command files.

### Purpose

Make `/deep:start-agent-improvement-loop` and `/prompt` the only documented command surfaces for these workflows, with assets and mirrors named consistently and the obsolete `improve/` folders removed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Move deep-agent-improvement YAML assets into `.opencode/commands/deep/assets/` with `deep_start-agent-improvement-loop_*` names.
- Update `.opencode/commands/deep/start-agent-improvement-loop.md` to load the new asset paths and advertise `/deep:start-agent-improvement-loop`.
- Update `.opencode/commands/prompt.md` and prompt-improver runtime agents to advertise `/prompt`.
- Remove `the legacy OpenCode improve command folder` and `the legacy Gemini improve command folder`.
- Add Gemini root/deep command mirrors and remove stale prompt mirror drift where it exposes non-canonical command syntax.
- Rewrite repo-wide references to the removed improve command family, including archives and changelogs.
- Update parent phase metadata so `009-command-surface-relocation` is visible under `005-deep-agent-improvement`.

### Out of Scope

- Reintroducing compatibility aliases for `the legacy agent-improvement command` or `the legacy prompt-improvement command`; the migration intentionally removes them.
- Reworking deep-agent-improvement evaluator behavior, scoring formulas, or promotion policy.
- Changing the semantics of `sk-prompt` beyond the root command surface rename.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify/Create | Canonical deep agent command entrypoint |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Move/Rename | Autonomous workflow asset |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Move/Rename | Confirm workflow asset |
| `.opencode/commands/prompt.md` | Modify/Create | Canonical root prompt command entrypoint |
| `.opencode/commands/README.txt` | Modify | Top-level command index |
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Move/Modify | Gemini deep command mirror |
| `.gemini/commands/prompt.toml` | Create/Modify | Gemini root prompt command mirror |
| `the legacy OpenCode improve command folder` | Delete | Removed obsolete command group |
| `the legacy Gemini improve command folder` | Delete | Removed obsolete Gemini mirror group |
| Repo docs/specs/archives | Modify | Exact old command/path reference rewrite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `/deep:start-agent-improvement-loop` is the canonical agent improvement command | Command file exists under `.opencode/commands/deep/`, examples use the new syntax, and YAML loads point at `deep_start-agent-improvement-loop_*` assets |
| REQ-002 | `/prompt` is the canonical prompt-improvement command | Root command file exists and examples/setup/error text use `/prompt` |
| REQ-003 | Obsolete improve command groups are removed | Deleted-folder checks pass for the OpenCode and Gemini command groups |
| REQ-004 | Old improve references are removed repo-wide | The zero-reference `rg` gate for removed command names, command paths, and asset names returns no matches |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Runtime mirrors align with canonical surfaces | Gemini mirror files point at `.opencode/commands/deep/start-agent-improvement-loop.md` and `.opencode/commands/prompt.md` |
| REQ-006 | Routing and skill docs remain discoverable | Skill-advisor smoke tests still route deep agent improvement and prompt improvement to the expected skills |
| REQ-007 | Spec documentation is connected to the parent phase map | Parent `005-deep-agent-improvement` lists child `009` in `spec.md` and `graph-metadata.json` |
| REQ-008 | OpenCode command alignment is checked | `verify_alignment_drift.py --root .opencode` is run and any failures are reported |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| AS-001 | Operator runs the old-reference grep gate | No results are returned |
| AS-002 | Operator lists new assets | Both `deep_start-agent-improvement-loop_auto.yaml` and `deep_start-agent-improvement-loop_confirm.yaml` exist |
| AS-003 | Operator reads command indexes | No `improve/` command group is advertised; `/deep:start-agent-improvement-loop` and `/prompt` are visible |
| AS-004 | Gemini command mirror is inspected | It delegates to the matching OpenCode command spec instead of embedding stale improve command text |
| AS-005 | Parent phase is resumed or recursively validated | Child `009-command-surface-relocation` appears as part of the parent phase set |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broad archive rewrites can alter historical wording | Medium | User explicitly requested repo-wide rewriting, including archives and changelogs |
| Hidden runtime mirrors can keep stale command names alive | High | Search hidden files and inspect `.gemini/commands` concrete mirrors |
| Command index drift can confuse operators even after files move | Medium | Patch `.opencode/commands/README.txt` and run alignment drift check |
| Existing dirty worktree can mix unrelated changes with this migration | Medium | Do not revert unrelated changes; report only migration-relevant work |
<!-- /ANCHOR:risks -->

---

## NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NFR-001 | Search gates must run over hidden files and archives | Commands use `rg --hidden --glob '!.git'` |
| NFR-002 | Runtime mirrors should delegate to canonical command specs | Gemini TOML wrappers read the OpenCode Markdown command specs |
| NFR-003 | Existing unrelated worktree state must be preserved | No reset or checkout is used |

---

## EDGE CASES

| Case | Handling |
|------|----------|
| Historical archive mentions old command text | Rewrite because the user selected repo-wide consistency |
| Gemini mirror exists without an OpenCode peer | Remove the stale mirror or point it at the canonical root command |
| Broad replacements create wrong root/deep paths | Run manual command-index inspection after replacements |

---

## COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Repo-wide docs, archives, command assets, mirrors, and specs |
| Risk | 17/25 | Hidden mirrors and broad historical rewrites |
| Research | 8/20 | Exact strings known; context gathering already bounded |
| **Total** | **47/70** | Level 3 selected because public command surfaces and runtime mirrors are involved |

---

## RISK MATRIX

| Risk | Probability | Impact | Response |
|------|-------------|--------|----------|
| Stale hidden mirror remains | Medium | High | Search hidden files and list `.gemini/commands` |
| Spec docs reintroduce banned old strings | Medium | Medium | Run the exact zero-reference gate after writing docs |
| Recursive parent validation fails on existing child drift | Medium | Medium | Report the exact failing child if unrelated to this packet |

---

## USER STORIES

| ID | Story | Acceptance |
|----|-------|------------|
| US-001 | As an operator, I can run the agent improvement loop from the deep command family | `/deep:start-agent-improvement-loop` is documented in command specs and skill docs |
| US-002 | As an operator, I can improve prompts with a short root command | `/prompt` is documented in root command and prompt-improver agents |
| US-003 | As a maintainer, I can grep for the removed command family and get no hits under the requested gate | Zero-old-reference gate exits with no matches |

---

<!-- ANCHOR:verification-plan -->
## 7. Verification Plan

- Asset/file checks for deleted improve folders and new deep assets.
- Zero-old-reference grep gate across the repo, including hidden files and archives.
- Positive-reference grep gate for `/deep:start-agent-improvement-loop`, `/prompt`, and `deep_start-agent-improvement-loop`.
- Strict validation for this child phase and recursive validation for the parent phase.
- Skill-advisor smoke tests for deep agent improvement and prompt improvement.
- OpenCode alignment drift check.
<!-- /ANCHOR:verification-plan -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## Related Documents

- Parent phase: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/spec.md`
- Command entrypoint: `.opencode/commands/deep/start-agent-improvement-loop.md`
- Prompt command: `.opencode/commands/prompt.md`
- Deep agent skill: `.opencode/skills/deep-agent-improvement/SKILL.md`
