---
title: "Local Embeddings Foundation Phase 012: q8 Default and v3 Remediation"
description: "Flipped hf-local memory dtype default to q8. Added dtype to EmbeddingProfile slug, JSON, equality, plus DB filename. Restored launcher parity across Claude, Gemini, plus Codex. Added pre-resolution Voyage egress guard, macOS tcpdump fix, plus CocoIndex search-only hardening."
trigger_phrases:
  - "q8 system default embeddings"
  - "dtype embedding profile key"
  - "v3 remediation local embeddings"
  - "launcher parity spec kit memory"
  - "hf-local q8 default"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Setup A's deep-review-v3 surfaced a cluster of drift findings: memory-side hf-local still defaulted to fp32 (roughly double the RAM of q8 at negligible quality loss), dtype was absent from the profile key so fp32 and q8 vectors could silently share the same sqlite file, three runtime launcher configs bypassed `.env.local` entirely, the Voyage egress guard fired too late in the resolution chain, the tcpdump helper script used a Linux interface name on macOS. CocoIndex search-only mode also trusted client-supplied project roots without validation.

This phase remediated all of those findings in one commit (`42aa114e3d`). The memory-side hf-local default is now q8. `EmbeddingProfile` carries dtype through slug, JSON, display, equality, plus DB filename, producing filenames such as `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`. Claude, Gemini, plus Codex runtime configs now route through `spec-kit-memory-launcher.cjs` so `.env.local` overrides load on those runtimes. A pre-resolution Voyage guard fires when `VOYAGE_API_KEY` is set with `EMBEDDINGS_PROVIDER=auto` before the auto-resolver can silently pick Voyage. The tcpdump script now defaults to `-i pktap` on macOS. CocoIndex validates project roots are inside `HOME` before opening sqlite.

### Added

- Pre-resolution Voyage auto-shadow guard in `factory.ts` that fires before the provider resolver builds its info list
- dtype field on `EmbeddingProfile` slug, JSON serialization, equality comparison, plus DB filename path in `profile.ts` plus `types.ts`
- dtype override documentation and `HF_EMBEDDINGS_DTYPE` env var notes in `.env.example`

### Changed

- `hf-local.ts` dtype default flipped from fp32 to q8 via `resolveDtype()` fallback
- `factory.ts` threads hf-local dtype through the startup profile construction path
- `.claude/mcp.json` routes `spec_kit_memory` through `.opencode/bin/spec-kit-memory-launcher.cjs`
- `.gemini/settings.json` routes `spec_kit_memory` through `.opencode/bin/spec-kit-memory-launcher.cjs`
- `.codex/config.toml` patched by main agent (Apple TCC blocks Codex self-writes) to route through launcher and note q8 filename shape
- `tcpdump-verify.sh` default interface switched from Linux `eth0` to macOS `pktap`, with `TCPDUMP_IFACE` env override

### Fixed

- fp32 and q8 vectors could silently overwrite each other in the same sqlite profile file. Dtype in the filename now isolates them.
- Launchers that bypassed `.env.local` caused Setup A env overrides to be silently ignored on Claude, Gemini, plus Codex runtimes. All three now route through the launcher.
- Voyage egress guard fired after the auto-resolver had already chosen Voyage. The guard now fires at the pre-resolution stage to catch the drift case.
- tcpdump script failed on macOS because it hardcoded a Linux interface name.
- CocoIndex search-only daemon accepted arbitrary client-supplied project roots before this phase added home-directory boundary validation.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Initial shared build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| dtype dist evidence | `grep -nE "(dtype.*sqlite|sqlite.*dtype)" .opencode/skills/system-spec-kit/shared/dist/embeddings/*.js` | PASS |
| Launcher grep | `rg "context-server\\.js|spec-kit-memory-launcher"` | Claude. Gemini. Codex PASS |
| Parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a --strict` | PASS. 0 errors. 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | `resolveDtype()` fallback changed to q8. dtype threaded into startup profile. |
| `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts` | dtype added to slug, JSON, display, equality, plus DB filename derivation. |
| `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` | `EmbeddingProfile` type extended with dtype field. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Startup profile construction threads dtype. Pre-resolution Voyage guard added. |
| `.claude/mcp.json` | `spec_kit_memory` server entry routes through `spec-kit-memory-launcher.cjs`. |
| `.gemini/settings.json` | `spec_kit_memory` server entry routes through `spec-kit-memory-launcher.cjs`. |
| `.codex/config.toml` | Launcher route and q8 filename note applied by main agent in 42aa114e3d. |
| `.env.example` | `HF_EMBEDDINGS_DTYPE` env var documented with fp32 and q4 as local override options. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh` | Default interface changed from Linux to macOS `pktap`. `TCPDUMP_IFACE` env override added. |

### Follow-Ups

- Codex config write was resolved by the main agent in 42aa114e3d. Apple TCC still blocks Codex from writing its own config directly. Future note-only changes to the Codex config should record a scratch patch for the main agent to apply.
- The unloaded CocoIndex status direct-read depends on `sqlite_vec` import and load. If extension loading fails, the daemon falls back to a 0-count response and logs a prompt to call `ccc index` to refresh.
- PAT rotation remains a user manual action and is intentionally out of scope.
