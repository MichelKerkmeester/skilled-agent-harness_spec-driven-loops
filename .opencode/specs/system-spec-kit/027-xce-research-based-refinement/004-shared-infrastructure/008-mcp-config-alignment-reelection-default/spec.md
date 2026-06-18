---
title: "Feature Specification: MCP Config 1:1 Alignment and Daemon Re-election Default-On"
description: "The launcher's SPECKIT_DAEMON_REELECTION default was OFF in code (on only because the runtime configs set it), and the four MCP runtime configs had drifted: an invalid-JSON missing comma, ~25 _NOTE_* pseudo-comment env keys, a legacy SPECKIT_SKILL_ADVISOR_HOOK_DISABLED name, and inconsistent ordering. Flip the code default to on and sort/clean/align the configs 1:1."
trigger_phrases:
  - "mcp config alignment"
  - "reelection default on"
  - "speckit daemon reelection code default"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default"
    last_updated_at: "2026-06-14T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped reelection default-on + MCP config 1:1 alignment"
    next_safe_action: "None; complete. Adoption on next session / launcher respawn"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".claude/mcp.json"
      - "opencode.json"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-008-mcp-config-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "HF_EMBED_SERVER_URL is the shared hf-local fallback socket, not a HuggingFace-vs-Ollama switch; Ollama stays preferred via EMBEDDINGS_PROVIDER=auto, so no embedding change was needed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: MCP Config 1:1 Alignment and Daemon Re-election Default-On

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure |
| **Predecessor** | 007-ipc-client-cap-hardening |
| **Successor** | None |
| **Implementation Commit** | `c67a972b88` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Daemon re-election was "default-on" only by convention: the launcher's `daemonReelectionEnabled` returned true exclusively for an explicit `1`/`on`, so an unconfigured launcher fell back to kill-on-disposal, and every doc claimed "the launcher's code default stays off, so the runtime configs are the on-switch." Separately, the four MCP runtime configs had drifted: `.mcp.json`/`.claude/mcp.json` carried an invalid-JSON missing comma in the code-index block; all four were inflated by drift-prone `_NOTE_*` trivia (per-server token-budget estimates and full tool-list dumps) alongside the useful operational notes, all passed into the launcher's real environment; the skill-advisor block used the legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` name; `SPECKIT_ADVISOR_DOC_TRIGGERS` existed only in the codex config; and key ordering differed per file.

### Purpose
Make re-election genuinely default-on in the launcher code (disabled only by an explicit `0`/`off`), and make the four runtime configs valid, trimmed of the drift-prone note trivia, and byte-identical per server so they are trivially diffable and 1:1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip the launcher code default: `daemonReelectionEnabled` returns true unless `SPECKIT_DAEMON_REELECTION` is explicitly `0`/`off`.
- Invert the reelection unit test's default assertion and sync the five living docs that asserted code-default-off.
- Sort + align the four MCP configs 1:1: fix the JSON syntax error, trim only the drift-prone `_NOTE_*` trivia (token-budget notes + tool-list dumps) while keeping the operational/reference notes, drop the now-redundant `SPECKIT_DAEMON_REELECTION` entries, rename the legacy advisor env, align `SPECKIT_ADVISOR_DOC_TRIGGERS`, alphabetise each server's env block.

### Out of Scope
- Embedding provider changes — Ollama is already preferred via `EMBEDDINGS_PROVIDER=auto`; `HF_EMBED_SERVER_URL` is only the shared hf-local fallback socket and is kept as-is.
- Touching live daemons or sessions — config and launcher `.cjs` changes activate on the next session / launcher respawn.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | `daemonReelectionEnabled` default-on; comment rewritten |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Modify | Default assertion inverted (unset→on, `0`/`off`→off) |
| `.claude/mcp.json` (`.mcp.json` symlink) | Modify | Valid JSON, trivia notes trimmed, sorted, aligned 1:1 |
| `opencode.json`, `.codex/config.toml` | Modify | Same env content aligned 1:1 in each schema |
| `ENV_REFERENCE.md`, `README.md`, `feature_catalog.md`, `feature_catalog/14--…/daemon-ownership-reelection.md`, `manual_testing_playbook/14--…/daemon-ownership-reelection.md` | Modify | Reflect code-default-on; historical changelog left intact |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001**: `SPECKIT_DAEMON_REELECTION` is on by default in launcher code; an explicit `0`/`off` disables it; the unit suite asserts the inverted contract and passes.
- **REQ-002**: All four configs parse, and every server's env block is byte-identical (keys, values, order) across files, with the drift-prone trivia notes, the redundant reelection entry, and the legacy advisor name all absent.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003**: Every current doc reflects code-default-on; the historical changelog stays the accurate as-of-release record.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `launcher-daemon-reelection.vitest.ts` passes 5/5 with the inverted default; `daemonReelectionEnabled({})` returns true and `{…:'0'}`/`{…:'off'}` return false.
- A parse-and-compare check confirms all four configs parse and each server's env block (functional vars + kept notes) is identical across files, with the trivia notes / redundant reelection entry / legacy advisor name absent.
- Doc-sync grep finds zero stale "configs are the on-switch" claims outside the changelog; comment-hygiene is clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-election now on even with no config opt-in | Released-but-unadopted daemon lingers | Bounded by `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` idle self-exit + orphan sweeper |
| Risk | `SPECKIT_ADVISOR_DOC_TRIGGERS` aligned up | Advisor doc-harvest now active in Claude/opencode too | Low: dampened derived-lane signal, already on in codex, intended repo-wide |
| Dependency | Activation timing | Configs + launcher `.cjs` apply next session | Documented; current warm session unaffected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The Ollama/HuggingFace clarification is recorded in the continuity block and implementation summary.
<!-- /ANCHOR:questions -->
