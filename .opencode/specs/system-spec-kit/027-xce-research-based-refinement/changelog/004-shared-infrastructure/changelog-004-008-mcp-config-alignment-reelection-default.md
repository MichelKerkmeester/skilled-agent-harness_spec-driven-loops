---
title: "MCP Config 1:1 Alignment and Daemon Re-election Default-On"
description: "Daemon re-election was on only because the runtime configs set SPECKIT_DAEMON_REELECTION; the launcher's own default was off. That default is now genuinely on in code (off only on explicit 0/off), and the four MCP runtime configs were sorted, cleaned and aligned 1:1: an invalid-JSON comma fixed, drift-prone _NOTE_* trivia trimmed, the legacy advisor env renamed, doc-triggers aligned, every env block alphabetised byte-identical."
trigger_phrases:
  - "004/008 mcp config alignment changelog"
  - "reelection default on launcher code"
  - "mcp config 1:1 aligned"
  - "027 004/008 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-14

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Daemon re-election was on only because the runtime configs set `SPECKIT_DAEMON_REELECTION`. The launcher's own `daemonReelectionEnabled` returned true exclusively for an explicit `1` or `on`, so an unconfigured launcher fell back to kill-on-disposal and every doc claimed the configs were the on-switch. That default is now genuinely on in the launcher code, off only when the flag is an explicit `0` or `off`, and the reelection unit suite asserts the inverted contract. In the same pass the four MCP runtime configs were sorted, cleaned and aligned 1:1. The `.claude/mcp.json` and its `.mcp.json` symlink carried an invalid-JSON missing comma in the code-index block (`"…CLIENTS": "64""_NOTE_CONTEXT_BUDGET"`) that made both unparseable. All four files were also inflated by drift-prone `_NOTE_*` pseudo-comment env keys (per-server token-budget estimates and full tool-list dumps) passed straight into the launcher environment, the skill-advisor block used the legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` name, `SPECKIT_ADVISOR_DOC_TRIGGERS` existed only in the codex config, and key ordering differed per file. The syntax error is fixed and the trivia notes are trimmed while the roughly seventeen operational and reference notes are kept and canonicalised to the correct "Node" hf-local wording. The now-redundant explicit reelection entries are dropped, the legacy advisor name is renamed to `MK_SKILL_ADVISOR_HOOK_DISABLED`, the doc-triggers flag is aligned across all four configs, and every server's env block is alphabetised so it is byte-identical across files (expressed in each file's schema: `env`, `environment`, or the TOML `[mcp_servers.X.env]` table). Embeddings were left as-is because Ollama is already preferred through `EMBEDDINGS_PROVIDER=auto` and `HF_EMBED_SERVER_URL` is only the shared hf-local fallback socket, not a HuggingFace forcing switch.

### Added

- None. This phase flips a launcher default, aligns and cleans the runtime configs and renames a legacy env. It adds no new capability.

### Changed

- `.opencode/bin/mk-spec-memory-launcher.cjs` — `daemonReelectionEnabled` default flipped from off to on (off only on explicit `0`/`off`), with the comment rewritten to the durable rationale
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-daemon-reelection.vitest.ts` — default assertion inverted (unset → on, `0`/`off` → off, others → on)
- `.claude/mcp.json` (`.mcp.json` symlink), `opencode.json`, `.codex/config.toml` — env blocks aligned 1:1: legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` renamed to `MK_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_ADVISOR_DOC_TRIGGERS=true` propagated to all four, redundant explicit reelection entries dropped, drift-prone `_NOTE_*` trivia trimmed, each server's env block alphabetised byte-identical
- `ENV_REFERENCE.md`, `mcp_server/README.md`, `feature_catalog.md` and its pipeline-architecture detail page, and the manual-testing playbook page — corrected to "on by default in the launcher code"; the historical `v3.5.0.4` changelog left intact as the as-of-release record

### Fixed

- The `.claude/mcp.json` and `.mcp.json` invalid-JSON missing comma in the code-index block. Both files were unparseable before this phase, regardless of the alignment work.
- An initial over-aggressive removal of all notes was corrected on user follow-up (commit `645bd69fb2`): the operational and reference notes were restored, canonicalised to "Node", and aligned 1:1, with only the drift-prone trivia removed.

### Verification

| Check | Result |
|-------|--------|
| Reelection unit suite | PASS: 5/5 with the inverted default (`launcher-daemon-reelection.vitest.ts`) |
| Flag truth table | PASS: unset / `1` / `on` / `yes` → true, `0` / `off` → false (node spot check) |
| Config parity | PASS: all four parse; each server's env block (functional vars plus kept notes) byte-identical; trivia notes, reelection entry and legacy key absent; INDEX defaults `false` |
| Doc-sync | PASS: zero stale "configs are the on-switch" claims in living docs (changelog excluded) |
| Comment hygiene | PASS: launcher and test clean (exit 0) |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Modified |
| `.claude/mcp.json` | Modified |
| `opencode.json` | Modified |
| `.codex/config.toml` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified |
| `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/daemon-ownership-reelection.md` | Modified |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/daemon-ownership-reelection.md` | Modified |

### Follow-Ups

- Live daemons and warm sessions keep the prior behavior until their next respawn or fresh session, when the launcher `.cjs` and the configs are re-read.
- `SPECKIT_ADVISOR_DOC_TRIGGERS` is now active in Claude Code and opencode too, not just codex. It is a dampened derived-lane signal, low-risk and intended repo-wide.
- A combined five-iteration deep review of this phase and `009` ran after ship. Two of its findings touched these config and launcher surfaces (the stale reelection comment and the `_NOTE_INDEX_DEFAULTS` selectable-subset note) and were remediated in commit `3dc7148f04`, documented in the `009` changelog.
- The `_NOTE_*` documentation keys in these configs were later de-numbered (for example `_NOTE_6_GET_VOYAGE_KEY` became `_NOTE_GET_VOYAGE_KEY`) and re-sorted into a logical per-server reading order in commit `daf9f28444`, with the four configs kept aligned 1:1.
