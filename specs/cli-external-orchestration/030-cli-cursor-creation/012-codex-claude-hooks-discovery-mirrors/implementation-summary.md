---
title: "Implementation Summary: Codex and Claude hooks discovery mirrors"
description: "Created .codex/hooks/ and .claude/hooks/ symlink mirrors and established per-file, by real-path comparison, exactly which of the 34 scripts do not behave identically through a symlink."
trigger_phrases: ["codex claude hooks mirror implementation"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/012-codex-claude-hooks-discovery-mirrors"
    last_updated_at: "2026-07-27T03:47:58Z"
    last_updated_by: "opencode"
    recent_action: "Linked successor phase 018."
    next_safe_action: "None; phase remains Complete."
    blockers: []
    key_files: [".codex/hooks/README.md", ".claude/hooks/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "codex-claude-hooks-discovery-mirrors", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 012-codex-claude-hooks-discovery-mirrors |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`.codex/hooks/` (16 symlinks) and `.claude/hooks/` (18 symlinks) now mirror exactly what each runtime's own config invokes, extending the `.cursor/hooks/` pattern to the two remaining hook-config-driven runtimes. Each mirror carries a README naming that runtime's affected scripts.

### Inventory, extracted not guessed
Both configs were parsed programmatically for every embedded `.opencode/...` path — necessary because Codex wraps each command in `bash -c '... && <script> || printf <fallback>'`, so the real target is not the literal `command` value. All 34 paths were confirmed to resolve before any link was created.

### The affected set, established per file
The Cursor mirror found that 4 of its 13 scripts silently emit nothing through a symlink. Whether that carried over was treated as an open question, not an inherited fact — and the answer differs per runtime and per file:

| Runtime | Identical through symlink | Differs |
|---|---|---|
| Codex | 14/16 | `session-start.js`, `user-prompt-submit.js` |
| Claude | 16/18 | `session-prime.js`, `install-codex-hooks.mjs` |

The three stdin-driven ones match the Cursor mechanism: their `.ts` source ends in an entrypoint guard comparing `process.argv[1]` (stays the symlink path) against `import.meta.url` (ESM-resolved to the real path). `install-codex-hooks.mjs` is a CLI utility rather than a hook, and its difference was not traced to that guard — the README says so rather than asserting a cause the evidence does not support.

### A false positive caught before it reached the docs
The first sweep tested each symlink in isolation and read "no output" as a tripped guard. That reading was wrong: `spec-gate-enforce.mjs`, `task-dispatch-guard.cjs`, `mcp-route-guard.cjs` and peers all approve by emitting nothing and exiting 0 — silence is their success path. The sweep was discarded and redone as a symlink-vs-real-path differential, the only method that separates the two cases. Four scripts that the first pass would have wrongly flagged came back clean.

That also disproved the tempting shortcut rule "all compiled `.js` hooks break through symlinks": Claude's `user-prompt-submit.js` works through its symlink while Codex's identically-named sibling does not. Both READMEs state this so nobody re-derives the wrong generalization.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Confirmed both runtime directories exist and neither had a `hooks/` folder; noted `.claude/` already symlinks `skills`, `commands`, `specs`, so the pattern was idiomatic there.
2. Parsed both configs with a regex reaching inside Codex's `bash -c` wrappers, deduplicated, and verified every path on disk.
3. Created both mirrors with relative targets and a basename-collision guard (unused in practice, but the flat-folder shape makes a future collision plausible).
4. Swept, misread the result, recognized the misread, and redid the sweep as a differential — the correction is recorded rather than quietly dropped.
5. Wrote a README per mirror listing that runtime's own affected scripts, so neither depends on the reader having seen the Cursor one.
6. Confirmed both runtime configs byte-identical afterward.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Mirror the invocation list, not the hook source tree.** Each mirror reflects what its config actually calls, so it stays an accurate index of live wiring; unwired files in the same directories are deliberately absent.
- **Determine the affected set empirically per runtime.** Carrying the Cursor finding across would have been faster and wrong in both directions — it would have over-flagged the silent-approve hooks and mis-stated which `.js` files are affected.
- **Do not root-cause `install-codex-hooks.mjs`.** It is a CLI utility, not a stdin hook; the guard explanation does not obviously apply, so the README reports the observed difference and stops there rather than inventing a mechanism.
- **Keep both runtime configs untouched.** Same conclusion as the Cursor mirror, now supported by each runtime's own evidence rather than by analogy.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| All extracted paths resolve (SC-001) | PASS — 16/16 Codex, 18/18 Claude |
| No broken symlinks (SC-002) | PASS |
| Per-file sweep completed (SC-003) | PASS — 34/34 compared against real path |
| Affected scripts named individually (SC-004) | PASS — 2 per runtime |
| False positive caught before documenting (SC-005) | PASS — first sweep discarded and redone |
| Both runtime configs unchanged (SC-006) | PASS |
| `validate.sh 030-cli-cursor-creation --recursive --strict` | PASS |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. `install-codex-hooks.mjs`'s differing output is reported but not root-caused; it is a CLI utility whose behavior may depend on argv or invocation context rather than the entrypoint guard.
2. OpenCode has no equivalent mirror — it has no `hooks.json`-style config to derive an invocation list from; its advice is delivered by plugin bridge.
3. Each mirror is a snapshot of its config at the time this phase ran; adding or removing a hook needs a matching mirror update, the same drift the existing maintenance checklist already covers per runtime.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.codex/hooks/README.md`, `.claude/hooks/README.md`
