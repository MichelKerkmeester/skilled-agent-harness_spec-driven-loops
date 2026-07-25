---
title: "Implementation Summary: Devin hook parity"
description: "10 Devin hook adapters built and directly tested, with full lifecycle registration corrected to the documented nested schema; six lifecycle events are observed live under devin -p."
trigger_phrases: ["devin hook parity summary", "devin hooks.v1.json full coverage"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-25T10:09:43Z"
    last_updated_by: "opencode"
    recent_action: "Corrected phase status after documented-schema live verification"
    next_safe_action: "Use phase 011 evidence for current behavior"
    blockers: []
    key_files: [".devin/hooks.v1.json", "decision-record.md", "../004-devin-hook-adapter-layer/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events occur?", "Does run_subagent expose the expected live payload?", "Does a block-severity fixture exercise the deny branch end to end?"]
    answered_questions: ["Six lifecycle events fire under devin -p with the documented schema.", "Original 9-file matrix missed spec-gate-enforce.mjs; added as a 10th file."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 008-devin-hook-parity |
| **Completed** | 2026-07-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The remaining Devin hook adapters close the gap phase 004 deliberately left open: 10 new adapter files plus full `.devin/hooks.v1.json` lifecycle coverage. **Status correction (2026-07-25)**: the zero-firing pass used an unsupported wrapper schema. The corrected nested schema produced six lifecycle events under `devin -p`.

### Guard-core adapters (direct-core-call pattern)
- `cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs` -- `PreToolUse(^exec$)`, deny-capable, wraps `dispatch-rule-checks.mjs`.
- `cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs` -- `PostToolUse(^exec$)`, observe-only, wraps `dispatch-audit.mjs`.
- `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs` -- `PostToolUse(^edit$)`, wraps `post-edit-router.cjs`.
- `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` -- `PostToolUse(^edit$)`, wraps `freshness-core.cjs`.
- `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` -- `PreToolUse(^mcp__.*$)`, warn-only, registered and directly tested. No external non-`mk_` MCP family is currently registered, so no applicable live event was observed.
- `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` -- `PreToolUse(^run_subagent$)`, wraps `dispatch-guard.cjs`. Real adapter, deliberate divergence from Codex's fold-in (Devin's `run_subagent` is a genuine first-class dispatch tool).
- `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` (10th file, gap fix) -- `PreToolUse(^exec$|^edit$)`, deny-capable, calls `spec-gate-core.mjs`'s `evaluateMutation()` directly. Already scoped in the research (§10, C-02/C-05/G-01) but dropped from the original file matrix; caught and closed here.

### Lifecycle-completion adapters
- `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs` -- `Stop`, advisory, wraps `completion-evidence-sentinel.cjs`, standalone no-build-step `.cjs`.
- `system-spec-kit/mcp-server/hooks/devin/session-stop.ts` -- `Stop`, delegates to compiled `../claude/session-stop.js` via the shared `shared.ts` phase 004 built.
- `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` -- `PostCompaction`, bespoke (no Codex/Claude precedent). Devin fires *after* compaction with only `session_id` + a possibly-null `summary`, unlike Claude's before-compaction `PreCompact`. Implements the 5-step chain from the research: retain summary, rehydrate spec-folder continuity, bounded `memory_context(mode=resume)` fallback, provenance/length sanitization, emit `additionalContext` directly.

### `.devin/hooks.v1.json` (project root, extended)
Grew from phase 004's 2-event registration (3 command entries) to all 7 event categories Claude's `.claude/settings.json` covers: `SessionStart` (+4 wiring-only script registrations: `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`), `UserPromptSubmit` (unchanged), `PreToolUse` (5 matcher entries), `PostToolUse` (3 matcher entries), an explicit empty `PermissionRequest: []`, `Stop` (2 entries), `PostCompaction` (1 entry), `SessionEnd` (1 entry, `session-cleanup.sh` registered directly). The one genuine gap versus Claude is `PreCompact` -> `PostCompaction`, a documented semantic/naming divergence, not an omission.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read all 7 live Codex sibling adapters plus Claude's `task-dispatch-guard.cjs` template (Devin's `run_subagent` needed the Claude template, not Codex's fold-in) as the structural precedent for each new file.
2. Built each of the 9 originally-planned adapters, mirroring the proven stdin-read / fail-open / translate / emit pattern; `post-compaction.cjs` built bespoke per the research's own 5-step design (no precedent to port).
3. Caught and fixed two real authoring bugs in `post-compaction.cjs` before any test ran: a `&&`-chained `require()` line that would silently leave `createHash` undefined, and literal raw control-character bytes embedded in the sanitizer regex (replaced with proper `\x` escapes).
4. Typechecked `session-stop.ts` (`tsc --noEmit`, 0 errors), rebuilt `mcp-server` (`npm run build`), confirmed `dist/hooks/devin/session-stop.js` compiled.
5. Directly invoked all 9 adapters with realistic payloads (happy-path plus one deliberately dispatch-shaped command for `dispatch-preflight-lint.mjs`, which correctly returned a real advisory) -- all behaved as designed.
6. Cross-checked Devin's coverage against `.claude/settings.json`'s full 7-event-category hook inventory (the user's own explicit ask) and found a real gap: `spec-gate-enforce.mjs` (the `PreToolUse` gate-3 BLOCK) was never in the phase's file matrix, despite the research already scoping it (§10, C-02/C-05/G-01). Built it as a 10th file, mirroring the Codex sibling with Devin's `exec`/`edit` tool vocabulary.
7. Ran fail-open verification for every one of the 10 adapters against BOTH malformed-JSON stdin and valid-but-empty (`{}`) missing-field payloads -- a full matrix, not a subset (an earlier partial pass had only covered 4 of 10; closed the remaining 6 before claiming completion).
8. Extended `.devin/hooks.v1.json` with all new entries (JSON-validated), preserving phase 004's `SessionStart`/`UserPromptSubmit` entries verbatim.
9. The original wrapper-shaped re-test produced zero hook output. Phase 011 later corrected the schema and observed six lifecycle events with real payloads and model-visible adapter output.
10. Authored `README.md` in each of the 5 new `hooks/devin/` sibling directories; updated the 2 pre-existing `hooks/devin/README.md` files (`mcp-server/`, `runtime/`) to list the files newly landed in those same directories, correcting a now-stale claim in the `runtime/` README that `spec-gate-enforce.mjs` was "deliberately NOT built here."
11. Confirmed `git diff --stat` empty across all 9 runtime-neutral guard cores (the original 8 plus `spec-gate-core.mjs`).
12. Revised `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md` to reflect the real implementation, superseding the pre-implementation planning text rather than deleting it.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **`spec-gate-enforce.mjs` added as a 10th file, not in the original plan.** The research had already scoped this exact gap; it was dropped somewhere between research and the phase's own file matrix. Caught by explicitly re-diffing Devin's coverage against Claude's full hook inventory, per the user's own request -- not by re-reading the research a second time.
- **ADR-001 resolves to project-level registration.** The nested schema proves `.devin/hooks.v1.json` is the live path; no installer is needed.
- **`SessionEnd` registered directly, not folded into `Stop`.** Devin has the native event and the corrected-schema session observed it.
- **ADR-003's deny-capability verification remains a structural result.** Hooks are live, but no skill declares a `severity: block` fixture, so an end-to-end deny remains unobserved.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| SC-001: all 11 new/modified files exist, pass syntax/type checks | PASS -- `tsc --noEmit` 0 errors; `node --check` clean for every `.cjs`; every `.mjs` executes cleanly |
| SC-002: every adapter directly invoked with realistic + malformed/missing-field payloads | PASS -- full 10-adapter x {happy-path, malformed-JSON, missing-field} matrix |
| SC-003: `git diff --stat` on all 9 neutral cores is empty | PASS |
| `.devin/hooks.v1.json` JSON-validated (`python3 -c "json.load(...)"`) | PASS |
| Live corrected-schema re-test | PASS - six lifecycle events fired and real adapter context reached the model |
| Fail-open: malformed JSON, all 10 adapters | PASS -- exit 0, no crash, every adapter |
| Fail-open: valid-but-empty (`{}`) payload, all 10 adapters | PASS -- exit 0, no crash, every adapter |
| Deny-capability: `dispatch-preflight-lint.mjs` real dispatch-shaped command | PASS (warn path only) -- returned a real `stdin-redirect-required` advisory; the deny path itself was not end-to-end exercisable (no repo-wide `severity: block` fixture exists) |
| `spec-gate-enforce.mjs`: non-mutating tool, exec, edit-with-file_path, malformed stdin | PASS -- all 4 cases behaved correctly |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Two lifecycle events remain unobserved**: `PermissionRequest` and `PostCompaction` did not occur in the corrected-schema session.
2. **True interactive mode remains untested**, although `devin -p` support is directly proven.
3. **The deny path is structurally verified, not behaviorally verified** because no block-severity fixture exists.
4. **`run_subagent` remains unobserved live**, so its exact payload path still relies on tolerant fallbacks.
5. **The MCP route guard has no applicable external-family event yet**; phase 009 re-evaluates it.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../004-devin-hook-adapter-layer/implementation-summary.md` (predecessor, first two adapters and superseded negative test)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (updated evidence tables)
- `../009-devin-mcp-host-integration/spec.md` (re-evaluates `mcp-route-guard.cjs` dormancy)
