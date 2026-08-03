# Convergence Report: mcp-webflow Packet Depth Audit

- **Loop type**: research (fan-out, 2 lineages)
- **Stop policy**: max-iterations (convergence telemetry-only)
- **Iterations completed**: 10 (luna-max-fast 5/5, sol-high-fast 5/5)
- **Lineages**: `luna-max-fast` (gpt-5.6-luna-fast, max), `sol-high-fast` (gpt-5.6-sol-fast, high)
- **Stop reason**: maxIterationsReached (both lineages)
- **Quality guards**: passed — source diversity (official hosted docs, OSS repo, packet files), focus alignment, no single-weak-source
- **Outcome**: 6 P0, 54 P1, 14 P2 findings merged across 74 registry entries (lineages merged without dedup)
- **First-run incident**: fan-out stalled at the 20-minute executor ceiling on luna iteration 5; resumed with `timeoutSeconds=3600` + `concurrency=2`; both lineages then completed. Parent-level synthesis was blocked by a workflow defect (`deep-research-auto.yaml` skips parent init under fan-out while `reduce-state.cjs` requires the parent config); the parent config was reconstructed and the owned merge/reduce steps re-run.
- **Artifacts**: `research.md` (canonical), `findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`
