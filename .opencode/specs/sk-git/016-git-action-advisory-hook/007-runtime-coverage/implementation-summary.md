---
title: "Implementation Summary: Runtime Coverage"
description: "Phase 7 of the git action advisory hook packet."
trigger_phrases:
  - "007-runtime-coverage docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/007-runtime-coverage"
    last_updated_at: "2026-07-28T08:00:00Z"
    last_updated_by: "glm-5-2"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Runtime Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

|| Field | Value |
||-------|-------|
|| **Spec Folder** | 007-runtime-coverage |
|| **Completed** | 2026-07-28 |
|| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four runtime adapters and a behavior-neutral style alignment of the five sk-git script files. Every adapter imports the existing hard-rule parser/evaluator, `GIT_CHECKS`, the lazy `createGitContext`, and the `GIT_SHAPE` gate; no rule engine, check registry, or context collector was duplicated.

- OpenCode plugin hooks `tool.execute.before` on `bash`, evaluates through the shared cores, and buffers at most 20 advisory events into the next `experimental.chat.system.transform`. It never writes to process stdout or stderr (the OpenCode plugin exemption tier) and never throws from a tool hook.
- Pi extension registers `pi.on("tool_call")` on `bash`, dynamic-imports the three shared `.mjs` modules by relative path, and returns a warning as `{ reason }` with no `block: true`. Fail open via try/catch returning `undefined`.
- Cursor proxy maps the `Shell` payload onto the shared hook's expected stdin JSON and forwards the shared hook's stdout verbatim. Fail open on spawn failure.
- Devin wiring appends the shared hook to `.devin/hooks.v1.json` under `PreToolUse` matcher `^exec$`, using the same `DEVIN_PROJECT_DIR` shell envelope and an approval-JSON fallback as its siblings.

Style alignment added boxed `╔═╗` COMPONENT headers, numbered `─── N. SECTION ───` dividers, complete JSDoc on exported functions, and camel-case locals. Behavior, messages, exports, and the one additive permitted export (`GIT_SHAPE`) are unchanged.

### Files Changed

|| File | Action | Purpose |
||------|--------|---------|
|| `sk-git/scripts/hooks/git-preflight-advisory.mjs` | Modified | Style-aligned; shared stdin hook for `Bash` and `exec` |
|| `sk-git/scripts/lib/git-rule-checks.mjs` | Modified | Style-aligned; exports `GIT_SHAPE` for the adapters |
|| `sk-git/scripts/lib/git-context.mjs` | Modified | Style-aligned |
|| `sk-git/scripts/lib/git-rule-checks.test.mjs` | Modified | Header/dividers only; test bodies unchanged |
|| `sk-git/scripts/lib/advisory-noise-audit.mjs` | Modified | Style-aligned |
|| `.opencode/plugins/mk-git-preflight-advisory.js` | Created | OpenCode plugin adapter |
|| `.pi/extensions/git-preflight-advisory.ts` | Created | Pi extension adapter |
|| `.cursor/hooks/git-preflight-advisory.mjs` | Created | Cursor Shell proxy |
|| `.cursor/hooks.json` | Modified | Registered the proxy under `preToolUse` matcher `Shell` |
|| `.devin/hooks.v1.json` | Modified | Registered the shared hook under `PreToolUse` matcher `^exec$` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One pass on the packet's established discipline: import the shared cores rather than copying them, keep every rule advisory, fail open on every error path, and re-run the whole gate after the change rather than assuming it held.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

|| Decision | Why |
||----------|-----|
| One shared hook serves Claude, Codex, and Devin; Cursor proxies to it | A second copy is a second thing to drift |
| OpenCode delivers via `experimental.chat.system.transform`, not stdout | Plugins must never print; the transform is the strongest legal sibling channel |
| Pi returns `{ reason }` without `block: true` | Advisory only; a hook error must never block the command |
|| Follow the phase 002/003 shape exactly | The foundation was built to be extended; deviating would create a second pattern |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

|| Check | Result |
||-------|--------|
|| Rule suite | PASS — 23/23 |
|| JS/MJS syntax (`node --check`) | PASS — 7/7 files |
|| Pi TypeScript (`node --check`) | PASS — type-stripping parser |
|| Cursor and Devin JSON parse | PASS |
|| Claude `Bash` simulation | PASS — advisory names `commit-scope-drops-untracked` |
|| `exec` simulation | PASS — advisory present |
|| Cursor `Shell` proxy simulation | PASS — shared hook stdout forwarded verbatim |
|| OpenCode in-process simulation | PASS — advisory in `output.system`, no stdout/stderr |
|| Pi in-process simulation | PASS — `{ reason }` with no `block` |
|| Silence cases (non-git, clean-tree ordinary commit) | PASS — zero stdout |
|| Suppression (`SKGIT_ADVISORY=0`, `SKGIT_ADVISORY_SKIP=commit`) | PASS — silent |
|| Comment hygiene | PASS — zero findings |
|| sk-code drift guards | PASS — all three guards |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The Pi extension was not compiled (`tsc` unavailable in this checkout; no `.pi/tsconfig.json`); import paths were verified to resolve and runtime execution exercised through an in-process simulation, not a live Pi session.
2. The OpenCode plugin delivery was verified by code review against the sibling `mk-skill-advisor.js` transform pattern and an in-process simulation, not by a live OpenCode TUI session.
3. The Cursor proxy was verified by stdin simulation, not by a live cursor-agent session.
4. No live Cursor editor, Devin host, Pi host, or OpenCode TUI session was launched; adapter contracts were exercised through real entrypoint or in-process simulations.
<!-- /ANCHOR:limitations -->
