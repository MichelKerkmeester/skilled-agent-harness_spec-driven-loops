---
title: "Implementation Summary"
description: "The advisor package directory is runtime/, the old name is gone from every path that resolves at runtime, and both prompt hooks answer from the renamed tree."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/006-runtime-package-rename"
    last_updated_at: "2026-09-11T14:40:00Z"
    last_updated_by: "executor"
    recent_action: "Renamed the package with git mv and carried every resolving path with it"
    next_safe_action: "Sweep the prose residue in phase 007, and resolve the two pre-existing defects recorded below"
    blockers: []
    key_files:
      - ".opencode/bin/system-skill-advisor-launcher.cjs"
      - ".opencode/bin/skill-advisor.cjs"
      - ".opencode/skills/system-skill-advisor/runtime/lib/freshness.ts"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-advisor-runtime-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The retrieval corpus was deliberately not regenerated; its 47 stale advisor doc paths are recorded below and need their own task"
    answered_questions:
      - "The rename is depth-neutral, so every relative import inside the package survived untouched"
      - "One CLI front door and both prompt hooks answer from the renamed tree with byte-identical brief text"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-package-rename |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
| **Base Commit** | `3def6d6c9b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor package directory moved from `mcp-server/` to `runtime/` with `git mv`, so git recorded 407 renames and history follows the files. The move is depth-neutral, which is why every `../../` relative import inside the package kept resolving without an edit.

The load-bearing part was not the move but the references. The old name survived in forms no path-shaped search finds: string elements split across lines in a `path.join` call, and bare `'mcp-server'` literals. Two of those were the CLI's own entry point and the module that computes the freshness signature, and each one alone was enough to break the front door.

### Reference classes carried with the rename

| Class | Examples |
|-------|----------|
| Front door and launcher | `.opencode/bin/skill-advisor.cjs`, `.opencode/bin/system-skill-advisor-launcher.cjs` |
| Plugin and its lib | `.opencode/plugins/system-skill-advisor.js`, `lib/opencode-message-identity.js` |
| Freshness package key | `system-spec-kit/runtime/cli/lib/dist-freshness.cjs`, now `system-skill-advisor/runtime` |
| Cross-package hook | `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` |
| Package internals | scripts, hooks, tsconfig, package.json, tests, and `lib/freshness.ts` |
| Skill and mode metadata | `graph-metadata.json`, two `mode-registry.json` files |
| CI and hooks | four GitHub workflows, `git-hooks/pre-commit`, `.gitignore` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How Was Delivered

The rename was verified by output equivalence rather than by a green exit code. Both prompt hooks were captured before the change and required to print the same bytes after it, which is what caught the freshness regression below.

Two failures surfaced only because the daemon was stopped before the hook ran, which is the cold path real sessions hit first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move with `git mv` rather than a copy and delete | History follows the files, and D1 requires it |
| Leave every `.md` untouched | 253 doc files carry the old path, mostly as runnable examples. Touching them is the repo-wide sweep this phase excludes, and no doc is machine-parsed for the old path |
| Revert the retrieval corpus regeneration | Regenerating rewrote 18,966 lines unrelated to the rename and changed advisor fusion scores. The minimal path fix is not separable because one generator run must write all four files as a pair |
| Leave the `mcpDir` identifier and `'mcp-server'` comments in place | A comment does not resolve at runtime. Renaming the identifier would also touch two test files that inject it by name, which is wider than the frozen scope |
| Add `.opencode/skills/*/runtime/database/` ignore lines instead of replacing the wildcard | The wildcard also covers `mcp-code-mode/mcp-server`, which this rename does not touch |
| Rebuild `system-spec-kit` after editing its hook source | The hook runs from `dist`, so the source edit alone had no effect |
| Delete the pre-rename `dist/` and rebuild clean | A surviving `dist/mcp-server/` would keep a missed reference working, and the failure would only appear after a later clean build |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Directory is `runtime/`, `mcp-server/` absent | PASS, 407 renames recorded |
| `npm --prefix .../runtime run build` | PASS, exit 0, emits `dist/runtime/*` |
| CLI `advisor_recommend` | PASS, status ok, sk-code 0.82/0.26, sk-doc 0.82/0.34 |
| Renamed package hook, cold daemon | PASS, `Advisor: live; ambiguous: sk-code 0.82/0.26 vs sk-doc 0.82/0.34 pass.` |
| Spec-kit shim, cold daemon | PASS, byte-identical to the pre-rename baseline |
| `cli-exit-taxonomy-smoke.cjs` | 3/4, all three skill-advisor cases PASS. The fourth is a pre-existing stale case, below |
| `plugins/tests/system-skill-advisor.test.cjs` | PASS, 27/27, exit 0 |
| `npx vitest run tests/hooks` from the package root | PASS, 7 files, 95/95, exit 0 |
| Old path in live code | PASS, no executable reference survives; token-join form clean; no old path in any compiled `dist` |

### Defects this phase fixed on the way

| Defect | Evidence |
|--------|----------|
| `lib/freshness.ts` resolved its script root and DB path under the old name | The daemon answered `Advisor: stale` after a cold start; the fix restored `live` |
| The CLI entry point used a split `path.join` form | `.opencode/bin/skill-advisor.cjs` would not have resolved its own dist |
| `system-spec-kit` shim printed `TARGET_UNRESOLVED` | Its compiled `dist` still held the old path; a rebuild was required |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing, not from this phase.** `cli-exit-taxonomy-smoke.cjs` fails one of four cases. The `SHIMS` map defines only `skill-advisor`, while a case still asks for `shim: 'code-index'`, so `spawnSync` runs `node undefined` and exits 1 instead of 64. The file is unmodified by this phase.

2. **Pre-existing, not from this phase.** `tests/launcher-bootstrap.vitest.ts` asserts the advisor's committed MCP trust default from `opencode.json`, which `eb53802beb` deliberately removed when the advisor was deregistered. `opencode.json` is untouched by this phase.

3. **Pre-existing, not from this phase.** `plugins/tests/system-spec-gate.test.cjs` imports from `system-spec-kit/mcp-server/`, a path retired by `aef7852400`. The same class of defect as this phase, in a sibling package.

4. **Deferred by decision.** The retrieval corpus keeps 47 stale advisor doc paths. The fix is a generator run that also rewrites 18,966 unrelated lines and shifts advisor scores, so it needs its own task and review.

5. **Prose residue for phase 007.** 253 documentation files still name the old directory, and the comments listed in the phase report were left in place on purpose.
<!-- /ANCHOR:limitations -->

---
