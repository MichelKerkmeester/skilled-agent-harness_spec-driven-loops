---
title: "Implementation Plan: OpenCode plugin runtime resolution"
description: "Repoint the OpenCode load-path symlink to the self-locating dist/plugin.js and correct the three docs that named the un-locatable hooks bundle."
trigger_phrases:
  - "sk-vision opencode plugin runtime resolution plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution/plan.md"
      - ".opencode/plugins/sk-vision.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-022-opencode-plugin-runtime-resolution"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenCode plugin runtime resolution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode plugin (bundled JS) + Markdown docs |
| **Framework** | `@opencode-ai/plugin`; `RuntimeClient` NDJSON bridge to `python/runtime.py` |
| **Storage** | `.opencode/plugins/sk-vision.js` symlink; three sk-vision docs |
| **Testing** | `repoRoot()` replication (Node); feature-catalog package validator |

### Overview
Point the OpenCode load-path symlink at `vision-runtime/dist/plugin.js`, the package `main` that lives inside the runtime package and therefore self-locates `python/runtime.py`. Correct the three docs that named the relocated `hooks/opencode/sk-vision.js` bundle as the load path. No change to shared runtime code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause verified. Evidence: `repoRoot()` replication shows the hooks bundle resolves `runtimeScript` to a non-existent path; `dist/plugin.js` resolves to the real one.
- [x] No feature loss confirmed. Evidence: both plugin sources register 13 tools and import the same `attachments.js`.

### Definition of Done
- [x] Symlink repointed; docs corrected; catalog validates. Evidence: `readlink`, residual grep clean, validator PASS.
- [ ] Live OpenCode spawn confirmed. Evidence: pending an OpenCode restart.
- [ ] Committed on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Location-dependent self-location: a bundled plugin's `repoRoot()` climbs from its own `import.meta.url`. The entry must therefore live inside `vision-runtime/` for the walk to reach `python/runtime.py`.

### Key Components
- **`.opencode/plugins/sk-vision.js`** — the OpenCode load path; a symlink whose target decides which bundle loads.
- **`vision-runtime/dist/plugin.js`** — the package `main`, built from `src/plugin.ts`, inside the runtime package → `repoRoot()` resolves.
- **`hooks/opencode/sk-vision.js`** — the relocated bundle, outside the package → `repoRoot()` fails.

### Data Flow
OpenCode → loads `.opencode/plugins/sk-vision.js` → `dist/plugin.js` → `RuntimeClient.repoRoot()` → `vision-runtime/python/runtime.py` → runtime spawns.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Repoint (done)
- [x] Symlink `.opencode/plugins/sk-vision.js` → `vision-runtime/dist/plugin.js`; ensure `dist/` is freshly built. Evidence: `readlink`; `bun run build`.

### Phase 2: Docs (done)
- [x] Correct `SKILL.md`, `README.md`, `feature-catalog/host-adapters/opencode-plugin.md`. Evidence: residual grep clean; catalog validator PASS.

### Phase 3: Verify (done / pending live)
- [x] `repoRoot()` replication proves the resolution both ways. Evidence: script output.
- [ ] OpenCode restart confirms a live spawn. Evidence: pending (not testable from a Claude session).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Resolution | `repoRoot()` for both symlink targets | Node replication of the walk |
| Doc integrity | catalog leaf/root parity + links | feature-catalog validator |
| Regression | Pi/Cursor/Devin paths unchanged | grep of the other host adapters |
| Live (pending) | OpenCode spawns the runtime | OpenCode restart + `sk_vision_status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `dist/plugin.js` built and present | Local | Available | OpenCode cannot launch the plugin |
| `node` symlink resolution (`import.meta.url` → real path) | Runtime | Available | `repoRoot()` would not climb from the true location |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the built plugin regresses OpenCode, or the runtime still will not spawn.
- **Procedure**: repoint `.opencode/plugins/sk-vision.js` back to `../skills/sk-vision/hooks/opencode/sk-vision.js` and revert the three doc edits. Single-symlink + doc reversion, all git-tracked.
<!-- /ANCHOR:rollback -->
