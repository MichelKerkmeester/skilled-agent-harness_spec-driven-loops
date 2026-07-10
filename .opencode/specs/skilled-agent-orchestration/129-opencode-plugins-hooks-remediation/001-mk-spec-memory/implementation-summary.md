---
title: "Implementation Summary [129/001-mk-spec-memory remediation]"
description: "Shipped the full mk-spec-memory plugin/hook remediation: F1/F2/F4-F13 and O1-O7 across the OpenCode plugin, Claude hooks, and message-schema bridge; F3 refuted. Adds a shared continuity-lifecycle contract + parity test and activates fail-open dist freshness enforcement."
trigger_phrases:
  - "mk-spec-memory remediation summary"
  - "mk-spec-memory implementation summary"
  - "opencode plugin remediation complete"
  - "continuity lifecycle contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/001-mk-spec-memory"
    last_updated_at: "2026-07-10T20:18:16.605Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped all 19 fixes (F1/F2/F4-F13, O1-O7); F3 refuted"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-spec-memory.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/plugin_bridges/continuity-lifecycle-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-mk-spec-memory |
| **Completed** | 2026-07-10 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Remediated the mk-spec-memory OpenCode plugin, its Claude SessionStart/PreCompact/Stop/UserPromptSubmit hooks, and the OpenCode message-schema bridge against the two-model (GPT-5.6-Sol + Opus 4.8) reconciled fix design. All 19 tracked findings that carried a fix design were implemented — the 11 P1 findings (`F1`, `F2`, `F4`-`F11`), the 3 P2 bugs (`F11`, `F12`, `F13`), and the 6 Opus iteration-2 additions (`O1`-`O7`). `F3` was re-examined in iteration-2 and **refuted**, so it correctly carries no fix.

The highest-value corrections make the hooks honest and bounded: the Stop autosave no longer reports a read-only reachability probe as a `deferred` save (`F2`); PreCompact now tails the transcript with a bounded backward read (`F4`), runs the whole post-stdin workload under one shared deadline that guarantees a persisted cache before the 3s cutoff (`F5`), builds text and payload-contract from a single merge so the cached contract describes the cached bytes (`F6`), and persists the compact cache before the best-effort authored snapshot (`O3`). SessionStart's resume pointer was retitled so the warm CLI fallback still injects real continuity (`F1`), and UserPromptSubmit now bounds its child and always emits exactly one `{}` on failure (`F8`, `O4`). The OpenCode plugin gained a per-session generation guard (`F11`), narrowed cache invalidation (`O6`), a stdin error handler (`O1`), a stdout byte cap matching Claude's `maxBuffer` (`O2`), sanitized config status (`F12`), and marker-hash dedupe (`O7`).

### Files Changed

| File | Action | Purpose (findings) |
|------|--------|--------------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Retitle resume pointer so warm fallback runs (`F1`) |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modified | Truthful autosave outcome (`F2`); post-parse producer fingerprint (`F7`); fresh-summary autosave gate (`O5`) |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modified | Bounded tail (`F4`); shared deadline (`F5`); single merge text+contract (`F6`); cache-before-snapshot (`O3`) |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Modified | Bounded child + top-level try/catch, always emit `{}` (`F8`, `O4`) |
| `.opencode/plugins/mk-spec-memory.js` | Modified | In-flight generation guard (`F11`); config status (`F12`); stdin error handler (`O1`); stdout cap (`O2`); narrowed invalidation (`O6`); marker-hash dedupe (`O7`) |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` | Modified | Lenient passthrough marker inspection (`F13`) |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/continuity-lifecycle-contract.md` | Created | Shared per-runtime recover/persist lifecycle contract (`F9`) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/continuity-lifecycle-parity.vitest.ts` | Created | Cross-runtime continuity-lifecycle parity test (`F9`) |
| `mcp_server/dist/**` (gitignored build artifact) | Rebuilt | Dist matches source; Claude SessionStart `--all` fail-open freshness check registered (`F10`) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fixes were implemented directly against the two-model reconciled fix design (`fix-design/fix-design.md`), which pairs an independent GPT-5.6-Sol and Opus 4.8 fix for every finding. Clustered findings were landed together as the design advised: the compact-inject.ts group (`F4`/`F5`/`F6`/`O3`) in one pass so the shared 3s PreCompact budget stays realistic; the plugin cache group (`F11` generation guard before `O6` narrowed invalidation); and user-prompt-submit.ts (`F8`/`O4`) as a single rewrite. `F10` rebuilt the Claude `dist` first, because `.claude/settings.json` executes the compiled `.js`, not the reviewed `.ts`. After the edits, the plugin/hook suites and the type-checker were run, and the `dist` was rebuilt so the fail-open freshness check reports fresh.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `F9` solved as a shared lifecycle contract + parity test, not by porting Claude PreCompact/Stop machinery into the OpenCode plugin | The divergence is partially intentional; both models judged a documented capability contract the correct deliverable rather than bolting transcript/Stop semantics onto an API that lacks the events. |
| `F10` freshness guard is **fail-open** (stderr WARN, never a hard block) | A hard block on stale dist could break live sessions; the immediate rebuild plus a fail-open diagnostic closes the drift without introducing a new session-breaking failure mode. |
| `F2` reports the real primary outcome instead of `deferred` | No durable retry queue exists, so a read-only probe cannot honestly claim a deferred save. |
| `F3` left unfixed | Re-examined in iteration-2 and refuted; fabricating a fix would be dishonest. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| Plugin test suite | Pass (188/189) | The single failure is the pre-existing `mk-goal-tool-path` deep-loops path artifact, unrelated to this packet — **not a regression**. |
| Type-check | Pass | 0 errors. |
| Dist rebuild | Pass | `mcp_server/dist` rebuilt from source (gitignored artifact); Claude SessionStart `--all` fail-open freshness check registered. |
| `F9` parity | Pass | New `continuity-lifecycle-parity.vitest.ts` asserts the shared recover/persist guarantee matrix. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`F2` durability** — the fix makes the outcome honest (`skipped`/`failed` rather than `deferred`); a durable autosave retry queue was intentionally not introduced, so a truly deferred-then-drained save remains future work.
2. **`F10` is fail-open by design** — a stale dist emits a stderr WARN and still executes; CI-side stale-dist enforcement is left as a follow-up rather than a hard runtime block.
3. **`F9` OpenCode persist event** — only a bounded persist hook would be wired if OpenCode exposes a compaction/idle event; where it does not, the divergence is documented as accepted rather than forced.
4. **Pre-existing suite failure** — the `mk-goal-tool-path` deep-loops path failure predates this packet and is out of scope here.

<!-- /ANCHOR:limitations -->
