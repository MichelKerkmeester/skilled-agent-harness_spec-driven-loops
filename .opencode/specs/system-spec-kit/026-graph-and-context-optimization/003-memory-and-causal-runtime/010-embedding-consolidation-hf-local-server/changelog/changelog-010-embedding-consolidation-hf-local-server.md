# Changelog — 010: Embedding consolidation and hf-local model server

**Shipped**: 2026-05-31
**Commit**: 4b2c5de6a3

## What Changed
- Phase parent for embedding consolidation and hf-local model server re-architecture
- All 6 child phases implemented: nomic-only consolidation, hf-model-server, hf-local-http-client, launcher-supervision, retire-sidecar, skill-advisor-shared-wiring
- Consolidated embedding stack on single default model (nomic-ai/nomic-embed-text-v1.5)
- Re-architected hf-local provider as launcher-supervised local HTTP model server

## Why
The embedding stack exposed too many local model choices across separate registries, dimension maps, provider defaults, type strings, and docs. The hf-local provider loaded transformers inside daemon/sidecar execution paths instead of using launcher-owned, health-probed local-service shape.

## Verification
Not recorded in source docs.
