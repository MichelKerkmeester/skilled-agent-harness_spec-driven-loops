---
title: "Spec: 096 - rename .opencode/{skill,agent,command}/ to plural"
description: "Phase parent for the four-phase migration that brings .opencode/skills/, .opencode/agents/, .opencode/commands/ into compliance with opencode official docs (plural). Repo-wide impact: ~9,000 files / ~670,000 occurrences."
trigger_phrases:
  - "096 plural rename"
  - "opencode skill skills rename"
  - "opencode agent agents rename"
  - "opencode command commands rename"
  - "skill discovery fix"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural"
    last_updated_at: "2026-05-07T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase parent and 4 children"
    next_safe_action: "Phase 001 cli-codex dispatch"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase ordering: skills first (largest + critical configs), then agents, then commands, then symlinks. Symlinks must be last because they depend on the renamed targets existing."
      - "Implementation executor: cli-codex with --model gpt-5.5 -c model_reasoning_effort=medium -c service_tier=fast (per user direction)."
      - "Resource map lives at parent as resource-map.md (cross-cutting optional doc); per-child docs reference it."
---

# Spec: 096 - rename .opencode/{skill,agent,command}/ to plural

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | Phase Parent |
| Priority | P1 |
| Status | Draft |
| Created | 2026-05-07 |
| Branch | `main` |
| Sub-phases | 4 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

Per opencode official docs (`https://opencode.ai/docs/skills`, `/agents`, `/commands`), opencode's project-level discovery looks for **`.opencode/skills/`**, **`.opencode/agents/`**, **`.opencode/commands/`** (all plural). This repo uses singular for all three, so opencode's built-in discovery silently fails on every dispatch. This packet aligns the repo with opencode convention.

Surfaced today during packet 095 (sk-code-review playbook execution): every `opencode run` printed `"Could not find any skills directories. Tried: <project>/.opencode/skills"` before falling through to the `opencode-skills` plugin's bridging behavior. Plural alignment removes that workaround dependency.

The migration decomposes into four phases — one per category — to keep each phase independent and verifiable.
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:children -->
## 3. SUB-PHASE CONTROL

| Order | Sub-phase | Purpose | Status |
|---|---|---|---|
| 1 | `001-skills` | Rename `.opencode/skills/` → `.opencode/skills/`; update 7,464 reference-bearing files; patch opencode.json + .claude/settings.local.json + skill_advisor.py | Pending |
| 2 | `002-agents` | Rename `.opencode/agents/` → `.opencode/agents/`; update 1,532 files; patch CLAUDE.md §5 + sk-prompt graph-metadata + runtime_capabilities.json + audit_descriptions.py (agent half) | Pending |
| 3 | `003-commands` | Rename `.opencode/commands/` → `.opencode/commands/`; update 1,811 files; patch audit_descriptions.py (command half) + target_manifest.jsonc + mcp-doctor.sh | Pending |
| 4 | `004-symlinks` | Redirect 5 symlinks in `.claude/`, `.codex/`, `.gemini/` to point at the new plural targets | Pending |
<!-- /ANCHOR:children -->

<!-- ANCHOR:scope -->
## 4. SCOPE BOUNDARY

### In scope
- `git mv` of three directories at `.opencode/` level (skill→skills, agent→agents, command→commands).
- Repo-wide reference updates across ~9,000 files (~670,000 occurrences) via bulk sed + targeted critical patches.
- Symlink redirects in `.claude/`, `.codex/`, `.gemini/` mirror runtimes.
- Resource map at parent level: `resource-map.md`.

### Out of scope
- Fixing the 19 pre-existing broken `.gemini/workflows/*` symlinks (point to wrong absolute path "Opencode Env"; pre-dates this packet).
- Renaming `.opencode/specs/` (already plural per opencode convention).
- Renaming `.opencode/changelog/` (singular per opencode convention; not a discoverable resource).
- `.opencode/install_guides/`, `.opencode/plugins/`, `.opencode/templates/` — not in opencode's discoverable-resource canon.
- `opencode-skills` plugin source (separate repo).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All three directories renamed to plural.
- SC-002: 0 remaining singular references in repo (`git grep -E '\.opencode/(skill|agent|command)/'` not in plural form returns 0 lines).
- SC-003: opencode CLI no longer prints "Could not find any skills directories" warning.
- SC-004: skill_advisor.py, validate.sh, validate_document.py, generate-context.js still work post-rename.
- SC-005: All 5 symlinks resolve (`test -e <link>` for each).
- SC-006: Strict recursive validation passes for the 096 packet.
- SC-007: All 16 root playbooks still validate via `validate_document.py`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Type | Item | Reason |
|---|---|---|
| Tooling | `git mv` | Preserves git history per file across the directory rename |
| Tooling | `find` + `grep -lZ` + `xargs -0 sed` | Bulk text replacement primitives (POSIX) |
| Executor | cli-codex (gpt-5.5 medium fast) | Implementation dispatch per user direction |
| Validation | `validate.sh --strict` | Spec-packet validation gate |
| Validation | `validate_document.py` | Playbook root validation |
| Reference | opencode official docs | Source of truth for plural convention |
<!-- /ANCHOR:dependencies -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-skills/`, `002-agents/`, `003-commands/`, `004-symlinks/`
- **Resource map**: `resource-map.md` (detailed per-phase file inventory)
- **Track parent**: `../` (`skilled-agent-orchestration`)
- **Approved plan**: `/Users/michelkerkmeester/.claude/plans/create-new-spec-in-staged-glade.md`
