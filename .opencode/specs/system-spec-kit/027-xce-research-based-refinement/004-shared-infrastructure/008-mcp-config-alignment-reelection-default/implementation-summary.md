---
title: "Implementation Summary: MCP Config 1:1 Alignment and Daemon Re-election Default-On"
description: "Flipped the launcher SPECKIT_DAEMON_REELECTION default from off to on (off only on explicit 0/off), and sorted/cleaned/aligned the four MCP runtime configs 1:1 — JSON syntax fixed, all _NOTE_* stripped, redundant reelection entry dropped, legacy advisor env renamed, doc-triggers aligned. Embeddings left as-is (Ollama already preferred)."
trigger_phrases:
  - "mcp config alignment summary"
  - "reelection default on shipped"
  - "config 1:1 aligned summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default"
    last_updated_at: "2026-06-14T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped reelection default-on + MCP config 1:1 alignment"
    next_safe_action: "None; complete. Adoption on next session / launcher respawn"
    blockers: []
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
| **Status** | Complete |
| **Level** | 1 |
| **Parent** | `../spec.md` (004-shared-infrastructure phase parent) |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Implementation Commit** | `c67a972b88` |
| **Completed** | 2026-06-14 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`daemonReelectionEnabled` in `mk-spec-memory-launcher.cjs` now returns true unless `SPECKIT_DAEMON_REELECTION` is explicitly `0` or `off`, so daemon re-election is genuinely on by default in the launcher code instead of on only because each runtime config set it. The lone reader is this one function (the code-index and skill-advisor launchers never read the flag); the pure helpers `contextServerSpawnIo` and `shouldReleaseDaemonForReelection` are unchanged. The unit suite's default assertion was inverted (unset→on, `0`/`off`→off, others→on) and passes 5/5, and the five living docs that claimed "code default stays off, configs are the on-switch" (ENV_REFERENCE, mcp_server README, feature_catalog plus its pipeline-architecture detail page, and the manual-testing playbook page) were corrected to "on by default in the launcher code." The historical `v3.5.0.4` changelog was left intact as the accurate as-of-release record.

The four MCP runtime configs were sorted, cleaned, and aligned 1:1. `.mcp.json` is a symlink to `.claude/mcp.json`, so there are three real files: `.claude/mcp.json`, `opencode.json`, and `.codex/config.toml`. The invalid-JSON missing comma in the code-index block (`"…CLIENTS": "64""_NOTE_CONTEXT_BUDGET"`) was fixed; all ~25 `_NOTE_*` pseudo-comment keys — which were being passed into the launcher's real environment — were removed; the now-redundant explicit `SPECKIT_DAEMON_REELECTION` entries were dropped (the code default covers them); the legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was renamed to `MK_SKILL_ADVISOR_HOOK_DISABLED`; the codex-only `SPECKIT_ADVISOR_DOC_TRIGGERS=true` was aligned across all four; and every server's env block was alphabetised so it is byte-identical across files (expressed in each file's schema: `env` / `environment` / TOML `[mcp_servers.X.env]`).

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Parallel exploration mapped the four configs, the single flag read site, and the embedding-provider selection. Two user decisions set the scope: strip all notes (aggressive), and leave embeddings as-is. The reelection flip was a one-line change plus a comment rewrite; before touching the configs, the two durability stress tests were checked to confirm they set the flag explicitly (`spawnOwner(enabled)` / `startSession(…, enabled)` both write `'1'`/`'0'`), so the default flip could not silently break them. The three real configs were rewritten cleanly rather than edited in place, which also removed the JSON syntax error and the trailing commas. A python3 (`json` + `tomllib`) parse-and-compare script proved all four parse and each server's env block is identical across files with no banned keys. The implementation landed as a single scoped commit `c67a972b88` (10 files, none under `.opencode/specs/027`) using `git commit --only` so it could not sweep in a concurrent session's large in-flight 027 restructure. This spec-folder documentation was authored afterward, once that restructure committed and the tree settled.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- One atomic commit, not two: the code-default flip and the config-entry removal are interdependent (dropping the config entry is only safe because the code default is now on), so splitting them would create a revert hazard.
- Notes removed entirely (user choice): the `_NOTE_*` keys are non-functional documentation that leaked into the launcher environment; the same content lives in ENV_REFERENCE.md and README.
- `SPECKIT_ADVISOR_DOC_TRIGGERS` aligned up, not down: its (removed) note said "enabled for this repo," so propagating it to all four configs matches intent; it is a dampened derived-lane signal, low-risk to enable in Claude/opencode too.
- Embeddings untouched: Ollama is already preferred via `EMBEDDINGS_PROVIDER=auto`; `HF_EMBED_SERVER_URL` is only the shared hf-local fallback socket, and removing it would break the shared-socket model between mk-spec-memory and mk_skill_advisor.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reelection unit suite | PASS: 5/5 with the inverted default (`launcher-daemon-reelection.vitest.ts`) |
| Flag truth table | PASS: unset/`1`/`on`/`yes`→true, `0`/`off`→false (node spot check) |
| Launcher syntax | PASS: `node --check` clean |
| Config parity | PASS: all four parse; env blocks byte-identical per server; zero `_NOTE_*` / reelection / legacy keys |
| Doc-sync | PASS: zero stale "on-switch" claims in living docs (changelog excluded) |
| Comment hygiene | PASS: launcher + test clean (exit 0) |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Live daemons and warm sessions keep the prior behavior until their next respawn / session start; the config and launcher `.cjs` changes activate on the next session.
- `.mcp.json` is a symlink to `.claude/mcp.json`; editing the real target updates both, but a tool that refuses to write through symlinks must target `.claude/mcp.json` directly.
- The default flip changes behavior for any launcher invoked without these runtime configs (previously off, now on); this is the intended outcome and is bounded by the idle self-exit and orphan sweeper.

<!-- /ANCHOR:limitations -->
