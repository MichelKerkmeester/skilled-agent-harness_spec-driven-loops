# Iteration 005 — Local-LLM Legacy Hunt

## Focus
I scanned traceability surfaces for post-014/post-022 drift: current README/INSTALL/SKILL/reference markdown, committed runtime config notes, feature-catalog docs, setup docs, fixtures, and packet metadata while excluding the current review packet, frozen logs/evidence, z_archive, and the explicitly out-of-scope 021/022/027 packets. The pass targeted stale default claims around fixed Voyage or hf-local profiles, singleton sqlite filenames, rejected ONNX runtime wording, and obsolete model/dimension narratives, then filtered out accepted auto-cascade descriptions and prior iteration duplicates.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-005-001 | P2 | traceability | .opencode/skills/system-spec-kit/config/config.jsonc:25 | `"embeddingModel": "voyage-4"` | confirmed-residue | Replace the documentation-only semantic-search example with provider-neutral `auto`/profile-derived wording, or label `voyage-4` as only the Voyage-provider model rather than a fixed semantic-search setting. |
| L-005-002 | P1 | traceability | .opencode/skills/system-spec-kit/config/config.jsonc:28 | `"databasePath": ".opencode/skills/system-spec-kit/mcp_server/dist/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite",` | confirmed-residue | Update the doc-only config path to the active profile placeholder `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or the intended llama-cpp default example; do not show hf-local as the fixed memory index path. |
| L-005-003 | P1 | traceability | .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32 | "`check-native-modules.sh` ... attempts to load `better-sqlite3` plus optional `onnxruntime-node` and `sharp` installs" | confirmed-residue | Align the feature catalog with the current health probe, which checks `better-sqlite3` and optional `sharp` but no longer probes `onnxruntime-node`. |
| L-005-004 | P2 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:209 | "`@huggingface/transformers` ... brings `onnxruntime-common` as an internal transitive dependency" | confirmed-residue | Remove the current setup-path ONNX runtime reference or move it behind a narrowly scoped dependency-audit note so install guidance does not reintroduce rejected ONNX-backend terminology. |
| L-005-005 | P1 | traceability | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:609 | "`MEMORY_DB_PATH points directly to the active hf-local default profile database (${DEFAULT_HF_LOCAL_DB_FILE}) for disposable fixtures.`" | confirmed-residue | Change the generated fixture text to say disposable fixtures may pin a profile DB, and use the active profile placeholder or llama-cpp default rather than naming hf-local as the active default. |

## Iteration summary
- Files scanned: 5167
- New findings: 5 (P0=0, P1=3, P2=2)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation is close on traceability. Most remaining hits were accepted cascade wording, prior iteration duplicates (`PUBLIC_RELEASE.md`, shared README, `embedding_resilience.md`, cloud filename examples), intentional CocoIndex `voyage-code-3` alternatives, historical changelog/research artifacts, package-lock transitive ONNX entries, vitest temp `context-index.sqlite` idioms, or legacy model registries explicitly allowed by the prompt.
