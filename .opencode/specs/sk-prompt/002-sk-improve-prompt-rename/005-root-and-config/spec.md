---
title: "Feature Specification: Phase 005 Root and Config"
description: "Update root-facing documentation, active install guides, active changelog references, and observability outputs for the sk-prompt rename. Handles only root and active config surfaces after skill and runtime consumers are updated."
trigger_phrases:
  - "082 phase 005"
  - "sk-improve-prompt root config"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/005-root-and-config"
    last_updated_at: "2026-05-06T13:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase complete via direct sed (CLI dispatch unreliability rule applied)"
    next_safe_action: "Phase 006 advisor rebuild + strict validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
# Feature Specification: Phase 005 Root and Config

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 005 of 006 |
| **Handoff Criteria** | Root docs, active config, active changelog, and forward-facing observability refs use `sk-prompt`; scoped root grep returns 0 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After code and runtime consumers are renamed, user-facing docs and active config surfaces may still advertise `sk-improve-prompt`. Leaving those refs behind creates broken setup guidance and stale skill catalog entries.

### Purpose
Phase 005 updates root docs, install guides, skill catalog docs, active changelogs, and forward-facing observability references so external readers see the new `sk-prompt` name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update root `README.md`, install guides, `.opencode/skills/README.md`, and listed active changelogs.
- Update smart-router observability JSONL forward-facing IDs only.
- Update smart-router measurement report reference.

### Out of Scope
- Editing skill folder internals, `.opencode/` advisor internals, or runtime mirrors.
- Rewriting frozen historical specs, archived changelogs, generated binary databases, or git history.
- Changing observability measurements beyond forward-facing IDs.
- Running final advisor probe battery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Root skill references |
| `.opencode/install_guides/SET-UP - AGENTS.md`, `.opencode/install_guides/README.md` | Modify | Install guide refs |
| `.opencode/skills/README.md` | Modify | Skill catalog entry refs |
| `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md` | Modify | Active changelog ref |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | Modify | Forward-facing IDs only |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` | Modify | Observability report ref |
| `.opencode/changelog/agent-orchestration/v2.4.0.0.md` | Modify | Active orchestration changelog refs |
<!-- /ANCHOR:scope -->

---


<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase scope is mechanical reference rotation. Acceptance criteria covered in HANDOFF CRITERIA.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All in-scope files have zero `sk-improve-prompt` literal references
- Phase folder strict validation passes
- Advisor / runtime continues to dispatch correctly to `sk-prompt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Race against parallel orchestration sessions touching overlapping files (mitigated: direct sed under heavy parallelism, per memory rule)
- Generated index files (`descriptions.json`) cannot be hand-rotated; refresh via `generate-context.js` during final memory save
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at completion.
<!-- /ANCHOR:questions -->

---


<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should update only the listed root and active config surfaces, preserve historical wording outside scope, and treat observability JSONL edits as forward-facing ID corrections only.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- Listed root docs and active config files no longer contain `sk-improve-prompt`.
- Observability JSONL/report updates are limited to forward-facing IDs.
- Active changelog refs in the listed files point to `sk-prompt`.

```bash
rg 'sk-improve-prompt' README.md AGENTS*.md .opencode/install_guides/ .opencode/skills/README.md .opencode/skills/system-spec-kit/changelog/v3.4.0.0.md
rg 'sk-improve-prompt' .opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl .opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md .opencode/changelog/agent-orchestration/v2.4.0.0.md
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/005-root-and-config --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../004-runtime-mirrors/spec.md](../004-runtime-mirrors/spec.md)
- **Successor Phase**: [../006-advisor-and-validate/spec.md](../006-advisor-and-validate/spec.md)
<!-- /ANCHOR:related -->
