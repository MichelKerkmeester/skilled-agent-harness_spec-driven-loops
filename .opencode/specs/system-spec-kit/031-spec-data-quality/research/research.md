# Research Index: Spec-Kit Data Quality by Default

<!-- ANCHOR:research-index -->
This index frames the research for raising spec-kit data quality by default across three jobs: retrieval recall, AI instruction adherence and machine logic reading. It points at the Stage 0 external-findings brief and lists the seven angles plus the ranked candidates that the by-angle loop carries.

## Entry Point

- [Stage 0 external-findings brief](./stage-0-external-findings.md): a fresh-Opus online sweep of about thirty cited sources, all read-only, sorted into seven angles with ranked candidates and explicit caveats.

## The Seven Angles

1. **Retrieval**: embed chunks together with header path, context and global identifiers. Externally validated three ways. See Anthropic Contextual Retrieval https://www.anthropic.com/news/contextual-retrieval and metadata fusion arXiv 2512.05411 https://arxiv.org/html/2512.05411v1
2. **Adherence**: EARS patterns, the spec-kit pipeline, Kiro and Tessl steering and a three-tier constraint system. The honest ceiling is that no format fully guarantees agent adherence.
3. **Logic**: GraphRAG community hierarchy, LightRAG dual-level retrieval with incremental updates and typed heterogeneous graph edges.
4. **Metadata artifacts**: embedding-metadata block, per-doc quality score, semantic-intent tags, provenance and a temporal freshness block.
5. **Turso and libSQL**: native vector search and embedded replicas. Vendor-validated and not independently benchmarked.
6. **Automation**: markdown and prose linters, JSON-Schema frontmatter validation, LLM-as-judge scoring, drift-triggered re-embed and an enrichment pipeline.
7. **Reference repos**: the closest twins and the building blocks for a single-file retrieval store.

## Ranked Candidates

The brief ranks ten candidate techniques and tags each by the job it serves: retrieval, adherence or logic. The top two are header-path with global-id prefixing on every embedded chunk and metadata fusion applied once per field. See the brief for the full ranked list and the caveats.

## Status

- Stage 0 recorded.
- By-angle verification loop pending.
- Candidate verdict pending.
<!-- /ANCHOR:research-index -->
