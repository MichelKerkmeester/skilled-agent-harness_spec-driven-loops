# 014 Deep Review Report

**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Date:** 2026-05-12T22:59:00+02:00
**Packets reviewed:** 9 child packets + parent control file
**Total iterations:** 27

## Per-packet summary
| Packet | Iterations | P0 | P1 | P2 | Verdict |
|---|---:|---:|---:|---:|---|
| 001-prefix-registry-architecture | 2 | 0 | 0 | 2 | PASS |
| 002-model-installation-and-compat | 1 | 0 | 0 | 1 | PASS |
| 003-mcp-config-rollout | 3 | 1 | 2 | 1 | FAIL |
| 004-vec-store-rebuild | 5 | 1 | 5 | 5 | FAIL |
| 005-q4-quantization | 4 | 0 | 2 | 4 | CONDITIONAL |
| 006-bge-m3-hybrid-evaluation | 1 | 0 | 1 | 0 | CONDITIONAL |
| 007-voyage-cleanup-and-egress-monitoring | 4 | 0 | 3 | 4 | CONDITIONAL |
| 008-finalize-and-commit | 1 | 0 | 1 | 0 | CONDITIONAL |
| 009-cocoindex-ipc-fix | 5 | 1 | 5 | 5 | FAIL |
| parent control file | 1 | 0 | 1 | 0 | CONDITIONAL |

## Top P0 findings (must-fix before ship)
- `P0-003-001`: Codex spec_kit_memory bypasses `.opencode/bin/spec-kit-memory-launcher.cjs`, so `.env.local` Setup A overrides are not loaded on that runtime (`.codex/config.toml:9-14`).
- `P0-004-001`: 004 still fails its own CocoIndex serving requirement; `cocoindex_code.search` is documented as failing with `msgspec.DecodeError` (`004/implementation-summary.md:126`).
- `P0-009-001`: 009 does not restore source-code language indexing; explicit refresh/index remains Rust-core blocked (`009/spec.md:124`, `009/tasks.md:77`, `009/implementation-summary.md:99`).

## Top P1 findings (should-fix before ship)
- `P1-005-001`: q4 changes embedding space but dtype is not part of `EmbeddingProfile` or the DB filename, so fp32/q4 vectors can silently mix.
- `P1-007-001`: Voyage egress guard does not cover the most dangerous `auto` path, where `VOYAGE_API_KEY` makes `resolveProvider()` choose Voyage before any hf-local drift warning.
- `P1-007-002`: `tcpdump-verify.sh` uses `-i any`, which is not available in this macOS host's `tcpdump -D` interface list.
- `P1-PARENT-001`: parent phase map is stale and omits 009.
- `P1-009-001`: 009 verification used an isolated daemon/copied DB, not the live home daemon.

## Overall verdict
FAIL: significant rework is needed before shipping the full 014 tree.

The memory-side local embedding path has strong evidence, and smaller packets 001/002 are acceptable with advisories. The release-blocking work is narrower than the tree size suggests: fix Codex launcher parity, resolve or formally defer CocoIndex serving/indexing, and add dtype-aware DB identity or a hard reindex guard before recommending q4.
