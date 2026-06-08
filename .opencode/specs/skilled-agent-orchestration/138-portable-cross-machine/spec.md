---
title: "Feature Specification: Portable cross-machine hook paths and Barter framework sync"
description: "The framework's Claude, Codex and Devin hooks hardcode the owner's absolute path and the macOS-only /opt/homebrew node, so they fail on other machines and Linux. Make the hook commands portable and sync the recent framework work into the Barter mirror."
trigger_phrases:
  - "portable hook paths"
  - "barter framework sync"
  - "opt homebrew node hardcoded linux"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-portable-cross-machine"
    last_updated_at: "2026-06-08T06:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Portable hook fix in Public source + Barter; surgical Barter sync"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-138-portable-cross-machine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Portable cross-machine hook paths and Barter framework sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A team member running the Barter mirror hit a startup-hook failure: the hook `cd`-ed into a hardcoded absolute path that does not exist on his machine, and every hook ran `/opt/homebrew/bin/node`, which does not exist on Linux. A prior fix attempt also corrupted Barter's node path to a broken `n/bin/node`. The same hardcoding lives in the Public source configs.

### Purpose
Make the Claude, Codex and Devin hook commands portable across machines and operating systems, and bring the Barter mirror up to date with the recent framework work without disturbing its own skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite hook commands to resolve the project root from the runtime's own env var with a `$PWD` fallback, and to run `node` from PATH.
- Apply the fix to the Public tracked source (`.codex/hooks.json`, `.devin/hooks.v1.json`) and to the three corrupted Barter hook configs.
- Sync the last 100 commits of Public framework changes into Barter, excluding sk-code, sk-git, the Barter-only skills, runtime configs and junk.

### Out of Scope
- Modifying Barter's runtime configs (opencode.json, .codex/config.toml, mcp.json) - preserved per the Barter mirror convention.
- Public's `.claude/settings.local.json` - gitignored and per-machine; the owner's working copy is left alone.
- The unrelated deep-review packet-init report in the same screenshot.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/hooks.json` | Modify | Portable cd + PATH node |
| `.devin/hooks.v1.json` | Modify | PATH node (cd already portable) |
| Barter `.claude/settings.local.json` | Modify | Portable cd + PATH node (separate repo) |
| Barter `.codex/hooks.json` | Modify | Portable cd + PATH node (separate repo) |
| Barter `.devin/hooks.v1.json` | Modify | PATH node (separate repo) |
| Barter `.opencode/**` (322 files) | Sync | Surgical copy of changed framework files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook commands carry no hardcoded machine path or homebrew node | grep finds no `/opt/homebrew` or absolute `/Users/...` cd in the fixed hook configs |
| REQ-002 | Barter sync preserves sk-code and sk-git | Those skill dirs are unmodified after the sync |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Corruption removed | No `n/bin/node` remains in any Barter hook config |
| REQ-004 | Barter framework current | The synced files are byte-identical to Public; the launcher carries the reap fix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh session on a different machine or on Linux runs the hooks without a cd or node-not-found error.
- **SC-002**: Barter reflects the recent framework work with its own sk-code, sk-git and custom skills intact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A runtime does not set its `*_PROJECT_DIR` env var | Hook cd falls back to `$PWD` | The runner already runs hooks from the project root, which the relative script path requires |
| Risk | A live Barter session rewrites settings.local.json | Fix could be clobbered | Flagged to the operator; backup kept |
| Dependency | `CLAUDE_PROJECT_DIR` / `DEVIN_PROJECT_DIR` env vars | Portable cd | Claude and Devin already export these (devin hook used it) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime cost; the change is in the hook command string only.
- **NFR-P02**: The sync copies 322 files, bounded and fast.

### Security
- **NFR-S01**: No new surface; commands run the same scripts from a resolved root.
- **NFR-S02**: The quoted env var handles the space and pipe in the Barter directory name safely.

### Reliability
- **NFR-R01**: The `$PWD` fallback keeps the hook working if the env var is unset and the cwd is the root.
- **NFR-R02**: The Barter sync preserves the mirror's own skills and configs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; this is a config path fix.
- Maximum length: not applicable.
- Invalid format: each config was JSON-parse-checked after the edit.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: a live Barter session may rewrite its settings.local.json; flagged.

### State Transitions
- Partial completion: the fixer is idempotent; re-running normalizes any reintroduced hardcoding.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five hook configs plus a 322-file mirror sync |
| Risk | 14/25 | Cross-machine behavior change, bounded and reversible |
| Research | 12/20 | Sequential-thinking design, corruption diagnosis, env-var pattern |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; the codex env-var availability is covered by the `$PWD` fallback.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
