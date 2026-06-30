---
title: "Implementation Summary: TSConfig References Restructure"
description: "Removed the system-code-graph tsconfig project reference so included system-spec-kit shared TypeScript sources emit into the extracted system-code-graph dist tree. Verified fresh build output and launcher startup without missing-module errors."
trigger_phrases:
  - "009 tsconfig references restructure summary"
  - "system code graph shared dist emit complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure"
    last_updated_at: "2026-05-14T16:26:51Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-009"
    recent_action: "Implemented and verified Option A"
    next_safe_action: "Stage and commit from a Git-writable shell"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/tsconfig.json"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-009-tsconfig-references-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-tsconfig-references-restructure |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The system-code-graph TypeScript config no longer declares a project reference to `../system-spec-kit/shared`. The existing include list now owns direct emit for the shared TypeScript sources, producing the runtime files under `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/` during a clean extracted build.

### Original TSConfig Diff

```diff
-  "references": [
-    {
-      "path": "../system-spec-kit/shared"
-    }
-  ],
   "include": [
     "mcp_server/**/*.ts",
     "../system-spec-kit/mcp_server/**/*.ts",
     "../system-spec-kit/shared/**/*.ts",
     "../system-skill-advisor/mcp_server/**/*.ts"
   ],
```

The `paths` aliases stayed unchanged because TypeScript accepted the config and emitted the required files without further changes.

### Fresh Emit Evidence

The final verification moved both stale `dist/system-spec-kit` output and `dist/system-code-graph/tsconfig.tsbuildinfo` aside before rebuilding, so incremental state could not mask missing output.

Newly emitted shared outputs include:

| Emitted File | Why It Matters |
|--------------|----------------|
| `dist/system-spec-kit/shared/unicode-normalization.js` | Original missing runtime import that broke MCP startup. |
| `dist/system-spec-kit/shared/unicode-normalization.d.ts` | Declaration output for the same shared module. |
| `dist/system-spec-kit/shared/index.js` | Shared package entry output in the extracted dist tree. |
| `dist/system-spec-kit/shared/normalization.js` | Shared normalization runtime dependency. |
| `dist/system-spec-kit/shared/embeddings.js` | Shared embedding runtime dependency. |
| `dist/system-spec-kit/shared/utils/path-security.js` | Shared utility runtime dependency. |

The full `--listEmittedFiles` run also re-emitted existing included system-spec-kit MCP support files such as `dist/system-spec-kit/mcp_server/lib/utils/index-scope.js`, which the launcher imports through system-code-graph code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/tsconfig.json` | Modified | Drop the project reference that prevented shared sources from emitting into this dist tree. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure/` | Created | Document this fix and verification. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation used Option A. Removing the project reference was enough; no source imports needed to change, and the `@spec-kit/shared/*` path mapping did not conflict with direct emit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove only the `references` block | The failure was emit ownership, not import spelling. |
| Keep `paths` aliases | They did not block typecheck or fresh emit. |
| Avoid Option B | Source rewrites would touch system-skill-advisor and system-spec-kit surfaces without being necessary. |
| Move `tsconfig.tsbuildinfo` aside for final verification | A partial clean left stale incremental metadata that skipped some output. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-check for existing `009-*` child | PASS, no matching folder returned. |
| `npx tsc` in `.opencode/skills/system-code-graph` | EXPECTED FAIL in network-disabled runtime; attempted registry lookup for `tsc` and exited 1. |
| `node node_modules/typescript/bin/tsc --listEmittedFiles` in `.opencode/skills/system-code-graph` | PASS, exit 0. |
| `ls .opencode/skills/system-code-graph/dist/system-spec-kit/shared/unicode-normalization.js` | PASS, file exists. |
| `ls .opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/lib/utils/index-scope.js` | PASS, file exists after build-info clean. |
| `timeout 8 node .opencode/bin/system-code-graph-launcher.cjs </dev/null 2>&1 \| head -10` | PASS, printed env-loading lines only; no `Cannot find module`. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASS, exit 0 with 59 non-blocking warnings from existing generated/source style checks. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/023-tsconfig-references-restructure --strict` | PASS, exit 0 after compacting `spec.md` continuity frontmatter. |
| `git add -- .opencode/skills/system-code-graph/tsconfig.json .opencode/specs/.../009-tsconfig-references-restructure` | BLOCKED, sandbox denied `.git/index.lock`; commit not created. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Exact `npx tsc` is not usable in this network-disabled runtime.** It attempted to fetch `tsc` from npm. The local TypeScript compiler under `node_modules/typescript/bin/tsc` was used for the successful build verification instead.
2. **Generated dist is verification output.** The committed durable fix is the tsconfig change; generated dist files remain untracked build artifacts.
3. **Git metadata writes are blocked.** Staging failed at `.git/index.lock`, so the changes are left unstaged and `COMMIT_SHA=uncommitted`.
<!-- /ANCHOR:limitations -->
