---
title: "Session Handover Document: cli-cursor creation (030)"
description: "Packet extended from 7 to 17 phases across a hooks-focused session: .cursor/hooks.json registered and brought to Claude parity, MCP wired, two dead-wire defects found and fixed, hooks-category playbook re-executed, and discovery mirrors added for all three hook-config runtimes."
trigger_phrases: ["cli-cursor handover", "030 handover", "cursor cli continuation", "cursor hooks handover"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation"
    last_updated_at: "2026-07-24T18:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phases 010-017 shipped and pushed; packet validates 18/18 at 0/0"
    next_safe_action: "None required; see handover section 3.2 for opt-in work"
    blockers: []
    key_files: [".cursor/hooks.json", ".cursor/mcp.json", ".opencode/skills/sk-code/code-opencode/references/shared/hooks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-session", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Session Handover Document: cli-cursor creation (030)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

## 1. Handover Summary

- **From Session:** 2026-07-24 — hooks-focused continuation (phases 010-017)
- **To Session:** Optional — the packet is complete and pushed; remaining items are opt-in, not blocking
- **Phase Completed:** 010 through 017. The packet grew from 7 phases to 17.
- **Handover Time:** 2026-07-24
- **Recent action:** All work committed and pushed to `origin/skilled/v4.0.0.0` (HEAD `0c9a43195d`, 0 ahead / 0 behind). Packet validates `--recursive --strict` at **18/18 folders, 0 errors, 0 warnings**.

### What changed, in one line each

| Phase | Outcome |
|---|---|
| 010 | `.cursor/hooks.json` created and committed — the registration ADR-001 always specified but never shipped |
| 011 | Expanded toward Claude parity: `postToolUse` chain, `Task`-matcher guard, 5 repo-guard scripts |
| 012 | Hooks-category playbook re-executed independently — 3 PASS, 1 documented SKIP |
| 013 | All Cursor `.mjs` hooks aligned to `sk-code/code-opencode` P0 standards; `hooks.md` gained a Cursor section |
| 014 | `.cursor/hooks/` discovery mirror (13 symlinks) |
| 016 | `.cursor/mcp.json` symlinked; `mcp-route-guard.mjs` dead wire found and fixed, then wired |
| 017 | `.codex/hooks/` (16) and `.claude/hooks/` (18) discovery mirrors |

Phase 015 (`hook-code-style-cross-runtime`) belongs to a concurrent session, not this one.

---

## 2. Context Transfer

### 2.1 Key Decisions Made

- **`.cursor/hooks.json` uses relative paths and is committed.** Empirically confirmed Cursor pins hook-command cwd to the project root regardless of the invoking shell's directory, so relative paths are portable across clones. This is what made ADR-001's "committed to the repo" decision viable.
- **`.cursor/mcp.json` is a symlink to `.mcp.json`, not a copy.** Cursor's MCP schema is byte-compatible with Claude's (`mcpServers` / `command` string / `args` array / `env` object), confirmed from Cursor's own docs before acting. A copy would drift. `opencode.json` could **not** participate — different schema (`mcp` key, `command` as array, `environment`).
- **Runtime-specific payload normalization lives in the Cursor adapter, never in the shared core.** Both `post-tool-use.mjs` (`Shell`→`Bash`) and `mcp-route-guard.mjs` (split-field recombination) normalize at the adapter boundary, because the core is shared by four runtimes.
- **Discovery mirrors are organizational only; configs keep pointing at real paths.** Not a style preference — 4 Cursor scripts and 4 Codex/Claude scripts silently emit nothing when invoked through a symlink.
- **`spec-gate-prebind.mjs` was never touched** across 9 phases. It belongs to a concurrent session, is uncommitted and unreviewed; every phase that mentioned it hedged rather than wiring or editing it.

### 2.2 Blockers Encountered

- **A false "no MCP servers" premise** blocked `mcp-route-guard.mjs` for two phases. The operator challenged it; the repo in fact had 5 credential-free servers in `.mcp.json`. Root cause of the error: conflating "Cursor sees no servers" with "no servers exist." **Resolved in 016.**
- **`beforeSubmitPrompt` and `preCompact` remain dormant** under `cursor-agent 2026.07.23-e383d2b`. Registered for parity; re-verify against a future build. **Not resolved — a CLI-side limitation, not ours.**
- **`preCompact` is untestable in isolation** — no compaction-forcing flag exists in the CLI. **Not resolved; documented.**

### 2.3 Files Modified

**Runtime config (committed, live):**
- `.cursor/hooks.json` — 12 entries across 6 events
- `.cursor/mcp.json` — symlink to `../.mcp.json`
- `.codex/hooks.json`, `.claude/settings.json` — **deliberately unchanged**

**Hook adapters:**
- `mcp-server/hooks/cursor/` — `shared.ts`, `session-start.ts`, `session-end.ts`, `user-prompt-submit.ts` (new), `precompact.ts` (new), `post-tool-use.mjs` (new), `task-dispatch-guard.mjs` (new), `mcp-route-guard.mjs` (new, fixed)
- `runtime/hooks/cursor/` — `spec-gate-enforce.mjs`, `spec-gate-classify.mjs` (both restyled)

**Discovery mirrors (all symlinks, mode `120000`):**
- `.cursor/hooks/` (13), `.codex/hooks/` (16), `.claude/hooks/` (18) — each with a README

**Docs:**
- `sk-code/code-opencode/references/shared/hooks.md` — Cursor is now a first-class runtime alongside Claude/OpenCode/Copilot (was entirely absent)
- `cli-external-orchestration/feature-catalog/feature-catalog.md`, `cli-cursor/references/hook-contract.md`, playbook root + `hooks/` scenarios

### 2.4 Traps & Scar Tissue

Read this section before touching anything in this packet.

1. **A hook emitting nothing is usually SUCCESS, not failure.** Claude/Codex hooks approve by writing no output and exiting 0. Testing a hook in isolation cannot distinguish "approved silently" from "never ran." **Always compare against the same script's real-path invocation.** This exact mistake produced a false positive mid-session that would have wrongly flagged 4 healthy scripts.

2. **Symlink invocation silently kills some hooks.** Any hook compiled from a `.ts` source ending in `runCursorHook(import.meta.url, main)` compares `process.argv[1]` (stays the symlink path) against the ESM-resolved `import.meta.url` (resolves to the real path). They never match through a symlink, so `main()` never runs and nothing is emitted — not even the fail-open envelope. Affected: Cursor `session-start.js`/`session-end.js`/`user-prompt-submit.js`/`precompact.js`, Codex `session-start.js`/`user-prompt-submit.js`, Claude `session-prime.js`. **Never repoint a runtime config at a discovery mirror.**

3. **Do not generalize the above by file extension.** Claude's `user-prompt-submit.js` works fine through its symlink; Codex's identically-named sibling does not. The affected set must be determined per file.

4. **A proxy that forwards the wrong payload shape is invisible.** `mcp-route-guard.mjs` forwarded Cursor's bare `tool_name` to a core that only parses packed `mcp__<server>__<tool>` / `<server>_<tool>` forms. It matched nothing, always, while looking healthy. Cursor splits server and tool across `mcp_server_name` + `tool_name`. **When proxying between runtimes, test a real captured payload against the target's parser — reading the code is not enough.** The same class of bug was correctly avoided for `completion-evidence-stop.cjs` (it needs `last_assistant_message`, which Cursor's `sessionEnd` never carries — left unwired for that reason).

5. **A concurrent session actively writes this same working tree.** It wiped files three times in one turn (`017/spec.md` and both mirror READMEs, *after* successful writes). It also reverted `spec.md` `Successor` edits twice and created a colliding `015-` folder. **Verify files still exist immediately before committing; commit fast rather than batching.**

6. **Editing another session's spec.md stales its metadata.** A one-line `Successor` edit broke `SOURCE_FINGERPRINT` on their `graph-metadata.json`. Re-run `backfill-graph-metadata.js` on any folder whose docs you touch, even trivially.

7. **`cursor-agent -p` exits 0 even on auth failure.** Never use exit code as an auth or availability signal — inspect `cursor-agent about` output text.

8. **`--trust` is required** for a non-interactive `-p` dispatch against a fresh workspace directory, or the workspace-trust prompt silently blocks it.

---

## 3. For Next Session

### 3.1 Recommended Starting Point

Nothing is blocking. The packet is complete, pushed, and validating clean. Pick from §3.2 only to extend it.

### 3.2 Priority Tasks Remaining

| # | Task | Why it is open | Effort |
|---|---|---|---|
| 1 | Run the 17 non-hooks playbook scenarios (`CU-001..012`, `CU-015..019`) | Only the 4 hooks-category scenarios were independently re-executed; the operator scoped it that way | Medium — real dispatches; 2 are destructive/opt-in |
| 2 | Review + commit `spec-gate-prebind.mjs`, then wire it | Still a concurrent session's uncommitted file. **Until something opens the Gate-3 state, the `preToolUse` deny path is inert (fails open).** Highest-value remaining item — it activates enforcement | Small once reviewed |
| 3 | Re-verify `beforeSubmitPrompt` / `preCompact` against a newer `cursor-agent` | Registered but dormant on `2026.07.23-e383d2b`; a build change could activate them silently | Small |
| 4 | Wire `afterMCPExecution` | Confirmed firing, payload shape recorded (`result_json`, `duration`), but no Claude-side counterpart exists to proxy to | Small, needs a target first |
| 5 | Make `runCursorHook` symlink-tolerant | Would remove trap #2 entirely (resolve both sides through `realpathSync` before comparing). Touches shared code four runtimes depend on | Small code, wide blast radius |
| 6 | Fix `dispatch-audit-posttooluse.mjs` hardcoding `runtime: 'claude'` | Cursor-proxied audit lines are mislabeled. Cosmetic provenance drift | Trivial |

### 3.3 Critical Context to Load

1. `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` — **the canonical cross-runtime hook reference.** Now documents all four runtimes plus the split-shape and discovery-mirror caveats. Start here.
2. `.cursor/hooks.json` — live Cursor wiring (also read by the Cursor **editor**; changes have cross-surface impact).
3. `016-cursor-mcp-wiring-and-route-guard-fix/implementation-summary.md` — the dead-wire investigation, including the evidence table.
4. `014-cursor-hooks-discovery-mirror/implementation-summary.md` — the entrypoint-guard root cause.
5. `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` — 21 scenarios; its `EXECUTION POLICY` mandates real dispatches and PASS/FAIL/SKIP verdicts only.

---

## 4. Validation Checklist

- [x] `validate.sh 030-cli-cursor-creation --recursive --strict` → **18/18 PASSED, 0 errors, 0 warnings**
- [x] All work committed and pushed; `origin/skilled/v4.0.0.0` at `0c9a43195d`, 0 ahead / 0 behind
- [x] Discovery mirrors confirmed on the **remote** as mode `120000` (real symlinks, not path-text files)
- [x] `.codex/hooks.json` and `.claude/settings.json` confirmed byte-identical (never touched)
- [x] Every newly wired Cursor hook live-fire confirmed against a real dispatch, not inferred
- [x] `verify_alignment_drift.py` clean across both Cursor hook directories
- [x] No credentials in any new file; all symlink targets relative
- [x] `spec-gate-prebind.mjs` untouched throughout

---

## 5. Session Notes

The two most valuable outputs of this session were **not** the features — they were two defects found by refusing to accept plausible-looking evidence:

- The **MCP dead wire** surfaced only because the operator challenged a blocker I had written down as fact. The lesson generalizes: *"the tool reports none configured"* and *"none exist"* are different claims, and I collapsed them.
- The **false-positive sweep** would have shipped documentation flagging 4 healthy scripts as broken. It was caught by asking what would prove the reading wrong — comparing against the real path — rather than accepting that empty output meant failure.

Both are recorded in §2.4 because the same shapes will recur: a proxy that silently matches nothing, and a success signal indistinguishable from a failure signal.

One process note: the concurrent session sharing this working tree made file loss a recurring hazard. What worked was committing small units immediately rather than batching, and re-verifying file existence right before every commit. Anyone continuing here should assume the same conditions.
