# Changelog — 003: Observability + safe model-switch + cold-start timeout

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `mcp_server/handlers/embedder-status.ts` to add collectEmbeddingsStatus with provider resolution and live model-server metadata via HfLocalProvider.healthCheck() + getMetadata()
- Added read-only embeddings route to doctor manifest (doctor_embeddings.yaml) with no restart/kill/recover verbs
- Modified `shared/embeddings/providers/hf-local.ts` to add 404 loadedModel surfacing, onDimensionResolved hook, two-tier waitForReady, and getMetadata server-state fields
- Modified `shared/embeddings/factory.ts` to add reportHfLocalDimensionDrift (create-time + first-embed callback)
- Modified `shared/types.ts` to add optional serverState/loadStartedAt/loadProgressAt to ProviderMetadata
- Modified `.opencode/bin/mk-skill-advisor-launcher.cjs` to add HF_EMBEDDINGS_MODEL to CHILD_ENV_ALLOWLIST
- Modified `.opencode/commands/doctor/_routes.yaml` to add read-only embeddings route
- Added `.opencode/commands/doctor/assets/doctor_embeddings.yaml` read-only embeddings doctor workflow
- Updated ENV_REFERENCE.md and INSTALL_GUIDE.md to document first-embed download, health-states, and new env
- Updated embedder-status.vitest.ts and hf-local-client.vitest.ts for status payload, 404 surfacing, cold-start retry, dim-drift hook, and degrade-on-throw

## Why
Operators have no read-only view of embedder state. Model switches are unsafe: HF_EMBEDDINGS_MODEL is not in the advisor allowlist, the 404 loadedModel is discarded, and dimension drift is silent. The client cold-start timeout is shorter than the server's, so a healthy-but-downloading server is declared dead.

## Verification
- `tsc` (@spec-kit/shared + @spec-kit/mcp-server): PASS
- `node --check` (hf-model-server.cjs, mk-skill-advisor-launcher.cjs): PASS
- Embedder vitest suites (status, hf-local-client, auto-selection, embeddings): PASS — 45 passed / 8 skipped
- 4-lens adversarial review: 8 raised, 7 confirmed (1 P1 + 3 P2 dedup), all fixed; 1 refuted
- `validate.sh --strict` on this packet: PASS
