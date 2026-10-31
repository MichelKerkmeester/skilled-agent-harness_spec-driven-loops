# Iteration 005 — OKF ecosystem and comparable standards

- **Focus (charter 5):** The Google Cloud article, Knowledge Catalog, reference agent and visualizer, community write-ups, the LLM-wiki pattern, comparable standards (`llms.txt`, Agent Skills `SKILL.md` frontmatter, `AGENTS.md`). Sources beyond the seed link.
- **Status:** complete
- **NewInfoRatio:** 0.90
- **Novelty:** First record of OKF's provenance story (announcement article, Karpathy LLM-wiki lineage), of independent third-party tooling around it, and of the three adjacent standards it is often compared with; exact source URLs recorded.

## Findings

### F1 — OKF's public story: a format, not a platform (Google Cloud blog, 2026-06-12)

- "Introducing the Open Knowledge Format" by Sam McVeety and Amir Hormati; published June 12, 2026; **v0.1 at publication** — the v0.2 trust/lifecycle work postdates the announcement.
- It frames OKF as "formaliz[ing] the LLM-wiki pattern into a portable, interoperable format", citing Andrej Karpathy's LLM Wiki gist as the crisp articulation; the article names the neighbour patterns: Obsidian vaults wired to agents, the `AGENTS.md`/`CLAUDE.md` family, repos of `index.md`/`log.md` artifacts, "metadata as code".
- Three named design principles: (1) minimally opinionated — exactly one required field, `type`; (2) producer/consumer independence — format is the contract, tooling at each end swappable; (3) format, not platform.
- Shipped alongside the spec: an enrichment agent (BigQuery walk + LLM web pass), a static HTML visualizer, three sample bundles; and "we have also updated Google Cloud's Knowledge Catalog to be able to ingest Open Knowledge Format".
- Article source: `[SOURCE: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing]`.

### F2 — Knowledge Catalog is the industrial consumer

- The `GoogleCloudPlatform/knowledge-catalog` repository describes Knowledge Catalog (formerly Dataplex) as "an AI-powered data catalog and metadata management platform … a dynamic knowledge graph"; the repo holds tools, agents and samples; disclaimer: "not an official Google product".
- The `okf/` directory there is the frozen snapshot with the redirect notice; its SPEC.md has the same sha256 as canonical (verified iteration 4).
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/main/README.md]`

### F3 — Independent third-party tooling exists and is non-trivial (GitHub search, 2026-10-04)

- Repository search for `open knowledge format okf` returned **370 repositories**. Representative examples observed:
  - `scaccogatto/okf-skills` (406★) — Claude Code plugin + agent skills + GitHub Action + read-only MCP server; "backed by a deterministic conformance checker"; documents itself in `.okf/`; validates on every push.
  - `zosmaai/pi-llm-wiki` (602★) — self-maintaining Obsidian-compatible knowledge base for `pi`; "Native Open Knowledge Format (OKF) v0.2 support"; deterministic indexes and logs; MCP surface.
  - `serradura/okf` (172★) — Ruby gem, Docker image, MCP server (14 tools), CLI/graph/TUI surfaces; "speaking OKF v0.2"; message: "gives that reasoning somewhere to live".
  - Others: `0dust/OKFy`, `jyjeanne/okf-rs`, `openknowledge-sh/openknowledge`, `sniperunder123/okf-knowledge`, `jkroepke/okf-crossplane-v2`, `OWOX/models`.
- Signal: multiple independent implementations across runtimes (Claude Code, pi, Ruby, Rust) and surfaces (plugins, MCP, GitHub Actions) within one release cycle; none controlled by Google.
- `[SOURCE: https://api.github.com/search/repositories?q=open+knowledge+format+okf]`; `[SOURCE: https://github.com/scaccogatto/okf-skills]`; `[SOURCE: https://github.com/zosmaai/pi-llm-wiki]`; `[SOURCE: https://github.com/serradura/okf]`

### F4 — Adjacent standards, and how OKF differs

- **AGENTS.md** (`https://agents.md/`): "a simple, open format for guiding coding agents, used by over 60k open-source projects"; one instruction file per project ("README for agents"); adopted across Codex, Jules, Aider, goose, opencode, Zed, Warp, VS Code, Devin, Factory. Job: operating instructions, not knowledge concepts.
- **llms.txt v2** (`https://llmstxt.org/`): a proposal (Jeremy Howard, Sept 2024, modified Aug 2026) for a single curated entry-point file per website; "thousands of sites publish" one; Chrome Lighthouse audits for it; OpenAI/Anthropic/Gemini publish their own. Job: one curated pointer file; no frontmatter model, no concept type, no trust/lifecycle families.
- **Agent Skills** (`https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills`, Oct 16 2025; open standard Dec 18 2025): a skill is a directory with `SKILL.md` whose YAML frontmatter requires `name` and `description`; the agent preloads name+description of every skill, then loads bodies on demand — "progressive disclosure" as an explicit mechanism. Job: procedural capability packaging; OKF is declarative knowledge packaging.
- Positioning: OKF sits closest to the LLM-wiki/AGENTS.md lineage but adds a typed concept model with trust and lifecycle metadata; it is farther from llms.txt (single file, no schema) and complementary to Agent Skills (skills do work; concepts describe what is true).

### F5 — Adoption risks visible in the ecosystem (feeds iteration 9)

- Version churn: announcement shipped v0.1, canonical repo is v0.2 within the same year; v0.2 itself has two named breaking changes from v0.1 (`okf-SPEC.md:796-830`).
- Fragmenting toolkits: 370 repos, mostly single-maintainer; no conformance registry or certification; "conformance" is three permissive rules (`okf-SPEC.md:736-762`), so "OKF-compatible" claims are weakly comparable across tools.
- The ecosystem proof is real but young: star counts and release cadence observed, no evidence of large-scale organizational deployments beyond Knowledge Catalog ingest (UNKNOWN: production adoption numbers — not found in reviewed sources).

## Sources

- `[SOURCE: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing]` — announcement, June 12 2026; v0.1 framing; design principles; Knowledge Catalog ingest.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/main/README.md]`
- `[SOURCE: https://api.github.com/search/repositories?q=open+knowledge+format+okf]` — 370 repos (2026-10-04).
- `[SOURCE: https://github.com/scaccogatto/okf-skills]`
- `[SOURCE: https://github.com/zosmaai/pi-llm-wiki]`
- `[SOURCE: https://github.com/serradura/okf]`
- `[SOURCE: https://agents.md/]` — "used by over 60k open-source projects".
- `[SOURCE: https://llmstxt.org/]` — v2 proposal; Lighthouse audit; lab adoption.
- `[SOURCE: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills]` — Agent Skills; required `name`/`description`; progressive disclosure.
- `[SOURCE: scratch/seed/okf-SPEC.md:736-830]` — conformance minimalism and v0.1→v0.2 changes.

## Open questions carried forward

- Do the community toolkits settle on field conventions beyond the spec that spec-kit should copy or avoid? (iteration 9)
- Is OKF's third-party ecosystem a reason to adopt that survives the blast-radius analysis? (iterations 7-9)

## Next focus

Iteration 6 — Crosswalk: field-by-field and file-by-file mapping between spec-kit and OKF; what matches, what is missing on each side, what conflicts.

## Negative knowledge (tried, failed / dead ends)

- Direct web search engines were not queried (no API key); discovery used the GitHub API search, raw files, and known project URLs. This bounds ecosystem coverage: the search found the most-starred repositories, not every write-up. Recorded as a coverage limit, not a finding.
