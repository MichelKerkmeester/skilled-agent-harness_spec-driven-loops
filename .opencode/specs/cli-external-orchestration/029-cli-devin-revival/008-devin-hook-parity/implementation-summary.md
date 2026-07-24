---
title: "Implementation Summary: Devin hook parity"
description: "10 Devin hook adapters built (9 originally planned + spec-gate-enforce.mjs, a real gap found mid-implementation), .devin/hooks.v1.json extended to all 7 event categories Claude covers, re-confirmed dormant post-extension -- matching phase 004's finding exactly, no regression."
trigger_phrases: ["devin hook parity summary", "devin hooks.v1.json full coverage"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed all 10 adapters + hooks.v1.json extension, re-tested live, still dormant"
    next_safe_action: "Regenerate description/graph-metadata, validate --recursive --strict, commit"
    blockers: []
    key_files: [".devin/hooks.v1.json", "decision-record.md", "../004-devin-hook-adapter-layer/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does hook firing work in true interactive mode? Untestable from this environment (no TTY)."]
    answered_questions: ["Hooks stay dormant under devin -p regardless of hooks.v1.json's size/scope -- re-confirmed after the 2-event to 7-event-category extension.", "Original 9-file matrix missed spec-gate-enforce.mjs; added as a 10th file once the gap surfaced."]
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

The remaining Devin hook adapters closing the gap phase 004 deliberately left open (2 of 8 lifecycle events covered). This phase closes it completely: 10 new adapter files (9 originally planned + `spec-gate-enforce.mjs`, found missing from the plan mid-implementation) plus a fully-extended `.devin/hooks.v1.json`. **Confirmed dormant, matching phase 004 exactly**: re-tested live after the full extension, still zero hook firings under `devin -p`.

### Guard-core adapters (direct-core-call pattern)
- `cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs` -- `PreToolUse(^exec$)`, deny-capable, wraps `dispatch-rule-checks.mjs`.
- `cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs` -- `PostToolUse(^exec$)`, observe-only, wraps `dispatch-audit.mjs`.
- `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs` -- `PostToolUse(^edit$)`, wraps `post-edit-router.cjs`.
- `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` -- `PostToolUse(^edit$)`, wraps `freshness-core.cjs`.
- `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` -- `PreToolUse(^mcp__.*$)`, warn-only, wraps `mcp-route-guard.cjs` core. Dormant for two reasons (packet-wide `-p` finding + no external MCP family registered), forwarded to phase 009.
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
9. Re-tested live against the installed `devin 3000.2.17` binary (`devin -p "echo hook-parity-probe-..."`) with the fully-extended file in place -- zero hook output, matching phase 004's finding exactly. No regression introduced by the extension.
10. Authored `README.md` in each of the 5 new `hooks/devin/` sibling directories; updated the 2 pre-existing `hooks/devin/README.md` files (`mcp-server/`, `runtime/`) to list the files newly landed in those same directories, correcting a now-stale claim in the `runtime/` README that `spec-gate-enforce.mjs` was "deliberately NOT built here."
11. Confirmed `git diff --stat` empty across all 9 runtime-neutral guard cores (the original 8 plus `spec-gate-core.mjs`).
12. Revised `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md` to reflect the real implementation, superseding the pre-implementation planning text rather than deleting it.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **`spec-gate-enforce.mjs` added as a 10th file, not in the original plan.** The research had already scoped this exact gap; it was dropped somewhere between research and the phase's own file matrix. Caught by explicitly re-diffing Devin's coverage against Claude's full hook inventory, per the user's own request -- not by re-reading the research a second time.
- **ADR-001's live-test-and-branch plan collapsed to "moot."** Phase 004 had already proven the file is never consulted under `-p` at all; there was no discovery-order question left to answer, and no installer (`install-devin-hooks.mjs`) was needed for a problem that isn't location-dependent.
- **`SessionEnd` registered directly, not folded into `Stop`.** Devin has a real native `SessionEnd` event (Codex does not); the decision is structural (a real event exists to register against), not behavior-verified (live stdout-strictness is unobtainable while dormant).
- **ADR-003's deny-capability verification downgraded honestly, not silently.** The originally-planned live behavioral deny test was impossible for two combined reasons: hooks are dormant, and no skill in this repo declares a `severity: block` hard rule to trigger against even if they weren't. Recorded the actual, lesser evidence obtained (structural equivalence to the proven Codex/Claude deny branch + the shared core's own passing unit tests) rather than claiming the original test happened.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| SC-001: all 11 new/modified files exist, pass syntax/type checks | PASS -- `tsc --noEmit` 0 errors; `node --check` clean for every `.cjs`; every `.mjs` executes cleanly |
| SC-002: every adapter directly invoked with realistic + malformed/missing-field payloads | PASS -- full 10-adapter x {happy-path, malformed-JSON, missing-field} matrix |
| SC-003: `git diff --stat` on all 9 neutral cores is empty | PASS |
| `.devin/hooks.v1.json` JSON-validated (`python3 -c "json.load(...)"`) | PASS |
| Live re-test: `devin -p` against the fully-extended file | PASS (negative result as expected) -- zero hook output, matching phase 004 |
| Fail-open: malformed JSON, all 10 adapters | PASS -- exit 0, no crash, every adapter |
| Fail-open: valid-but-empty (`{}`) payload, all 10 adapters | PASS -- exit 0, no crash, every adapter |
| Deny-capability: `dispatch-preflight-lint.mjs` real dispatch-shaped command | PASS (warn path only) -- returned a real `stdin-redirect-required` advisory; the deny path itself was not end-to-end exercisable (no repo-wide `severity: block` fixture exists) |
| `spec-gate-enforce.mjs`: non-mutating tool, exec, edit-with-file_path, malformed stdin | PASS -- all 4 cases behaved correctly |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Zero live hook coverage today**, inherited unchanged from phase 004 -- confirmed to persist after this phase's full extension, not merely assumed to persist.
2. **True interactive mode remains untested** (no TTY in this environment) -- the one gap every dormancy finding in this packet (phases 001, 004, 008) has left open.
3. **`dispatch-preflight-lint.mjs`'s deny path is structurally verified, not behaviorally verified** -- no block-severity fixture exists repo-wide today to exercise it end-to-end, independent of the dormancy finding.
4. **`SessionEnd`'s stdout-strictness is a structural decision, not a behavior-verified one** -- cannot be resolved until hooks fire live at all.
5. **`mcp-route-guard.cjs` stays dormant for a second, independent reason** (no external MCP family registered under Devin yet) -- phase 009 re-evaluates this specifically.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../004-devin-hook-adapter-layer/implementation-summary.md` (predecessor, established the dormancy finding this phase re-confirms)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (updated evidence tables)
- `../009-devin-mcp-host-integration/spec.md` (re-evaluates `mcp-route-guard.cjs` dormancy)
