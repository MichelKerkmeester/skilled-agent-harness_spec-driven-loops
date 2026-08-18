---
title: "Feature Specification: OpenCode plugin runtime resolution"
description: "Repoint the OpenCode plugin load path to the built dist/plugin.js so RuntimeClient.repoRoot() can locate python/runtime.py, fixing the RUNTIME_UNAVAILABLE regression, and correct the docs that named the un-locatable hooks bundle."
trigger_phrases:
  - "sk-vision opencode plugin runtime unavailable"
  - "sk-vision opencode plugin not loading"
  - "sk-vision repoRoot runtime.py resolution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution"
    last_updated_at: "2026-08-18T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Repointed the OpenCode plugin symlink to dist/plugin.js; docs fixed."
    next_safe_action: "Restart OpenCode to confirm the spawn, then commit."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution/spec.md"
      - ".opencode/plugins/sk-vision.js"
      - ".opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-022-opencode-plugin-runtime-resolution"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: OpenCode plugin runtime resolution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `021-mcp-server-process-lifecycle` |
| **Handoff Criteria** | The OpenCode plugin load path resolves to a bundle that can locate `python/runtime.py`, so the runtime spawns instead of returning `RUNTIME_UNAVAILABLE`; the docs name that load path correctly. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

sk-vision reaches OpenCode as an in-process plugin loaded through `.opencode/plugins/sk-vision.js`. The build emits two OpenCode bundles: `vision-runtime/dist/plugin.js` (from `src/plugin.ts`, the package `main`) and a relocated copy `hooks/opencode/sk-vision.js` (from `hooks/opencode/sk-vision.ts`). A commit that consolidated host adapters under `hooks/` repointed the load-path symlink at the relocated copy — and that copy cannot start the runtime.

**Deliverables**: the load-path symlink resolves to the self-locating `dist/plugin.js`, and the three docs that described the load path are corrected.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode returns `RUNTIME_UNAVAILABLE` for every `sk_vision_*` call because the plugin never spawns its Python runtime. The plugin bundle constructs a `RuntimeClient`, whose `repoRoot()` walks up from the bundle's own `import.meta.url` looking for `../python/runtime.py`. When the loaded bundle is `hooks/opencode/sk-vision.js`, that file lives *outside* `vision-runtime/`, so the walk never finds `python/runtime.py`, falls back to `process.cwd()`, and resolves `runtimeScript` to `<cwd>/python/runtime.py` — which does not exist. `spawn` fails, the client is marked broken, and every tool call returns `RUNTIME_UNAVAILABLE`.

### Purpose
Load the OpenCode plugin from a bundle that lives inside the runtime package (`vision-runtime/dist/plugin.js`), so `repoRoot()` resolves the real `python/runtime.py` and the runtime spawns. Only OpenCode is affected: Pi loads the runtime *source*, so `RuntimeClient`'s own `import.meta.url` already resolves inside `vision-runtime/src/`, and Cursor/Devin launch the MCP server directly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint `.opencode/plugins/sk-vision.js` from `hooks/opencode/sk-vision.js` to `vision-runtime/dist/plugin.js`.
- Correct the three docs that named the hooks bundle as the OpenCode load path (`SKILL.md`, `README.md`, `feature-catalog/host-adapters/opencode-plugin.md`).

### Out of Scope
- Pi, Cursor, and Devin adapters — unaffected by this defect.
- Changing `RuntimeClient.repoRoot()` or the build (the alternative fix; a bundle that lives inside the runtime package already resolves correctly, so no shared-runtime change is needed).
- Removing the now-redundant `hooks/opencode/sk-vision.ts`/`.js` parallel adapter (noted as a follow-up).
- Committing or pushing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/sk-vision.js` | Update | Symlink target → `../skills/sk-vision/vision-runtime/dist/plugin.js` |
| `.opencode/skills/sk-vision/SKILL.md` | Update | Name `dist/plugin.js` as the load target; carry the self-location reason |
| `.opencode/skills/sk-vision/README.md` | Update | Same load-path correction |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md` | Update | "re-exports (real file)" → "symlink resolves to"; add the self-location reason |

### Verification evidence
- `repoRoot()` replication: `hooks/opencode/sk-vision.js` → `runtimeScript = <repo>/python/runtime.py` (missing → spawn fails); `dist/plugin.js` → `runtimeScript = vision-runtime/python/runtime.py` (exists → spawns).
- `dist/plugin.js` is feature-complete: same 13 tools and the same `attachments.js` auto-inspect hook as the hooks bundle.
- Feature-catalog validator PASS (0 violations) after the doc edits.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime resolves | The OpenCode load path resolves to a bundle whose `repoRoot()` yields an existing `python/runtime.py` |
| REQ-002 | No feature loss | The new load target registers the same 13 tools and the same auto-inspect attachment hook |
| REQ-003 | Other hosts untouched | Pi, Cursor, and Devin adapters are unchanged and keep working |
| REQ-004 | Docs match reality | No doc claims the load path resolves to `hooks/opencode/sk-vision.js` |
| REQ-005 | No shared-runtime change | `RuntimeClient` / build are not modified, so Pi and the MCP server are not put at risk |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] The load-path symlink resolves to `vision-runtime/dist/plugin.js`. Evidence: `readlink .opencode/plugins/sk-vision.js`.
- [x] `repoRoot()` for the new target yields an existing `python/runtime.py`; for the old target it does not. Evidence: replication script output (spawn vs fail).
- [x] The new target is feature-complete. Evidence: `src/plugin.ts` and `hooks/opencode/sk-vision.ts` both register the 13 tools and import the same `attachments.js`.
- [x] Pi/Cursor/Devin unaffected. Evidence: Pi loads source (its `RuntimeClient` `import.meta.url` resolves inside `vision-runtime/src/`); no change to their paths.
- [x] Docs corrected and the catalog validates. Evidence: no residual hooks-bundle load-path claim; feature-catalog validator PASS.
- [ ] Live OpenCode session spawns the runtime. Evidence: pending an OpenCode restart (not testable from a Claude session).
- [ ] Changes committed on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The redundant `hooks/opencode/` adapter drifts from `src/plugin.ts` | Confusion over which is canonical | Docs now name `src/plugin.ts` → `dist/plugin.js` as the loaded source; removing the parallel adapter is a named follow-up |
| Risk | A `git checkout`/clean reverts the symlink to the broken committed target | Regression returns | This packet exists to commit the corrected target durably |
| Dependency | `dist/plugin.js` present and fresh | OpenCode cannot launch without it | Rebuilt via `bun run build`; `hooks/README.md` documents the fresh-checkout build step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Repoint the symlink, or change `repoRoot()`/build so the hooks bundle can self-locate? **A**: Repoint — `dist/plugin.js` is the package `main` and already self-locates; changing shared runtime code would risk the two hosts that work.
- **Q**: Why is only OpenCode affected? **A**: OpenCode loads a bundle whose `import.meta.url` is the bundle's location; Pi loads source, so `RuntimeClient`'s url resolves inside `vision-runtime/src/`.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
