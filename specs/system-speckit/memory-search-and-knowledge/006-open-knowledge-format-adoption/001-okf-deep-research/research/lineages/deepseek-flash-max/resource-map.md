# Resource Map — OKF adoption deep research (lineage deepseek-flash-max)

Session `fanout-deepseek-flash-max-1791092550011-hh7wyn`, 2026-10-04. One row per resource actually consulted, with what it contributed. Repository claims cite `file:line` inside the iteration files; this map records the inventory.

## Repository documents (read)

| Resource | Contributed |
|---|---|
| `.skilled/skills/system-spec-kit/SKILL.md` | Packet lifecycle, two completion gates, retrieval/continuity summary, declared losses |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Naming rules, level requirements, special folders, research/review layout |
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Phase-parent lean trio, detection rule, Phase Documentation Map |
| `.skilled/skills/system-spec-kit/references/structure/grep-convention.md` | Five canonical frontmatter keys, retrofit rules, anchor grammar |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Two retrieval lanes, recipes, exit mapping, coverage/exclusion policy |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Rule registry semantics, severities, AC closure/coverage, strict-only checks |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Continuity fields/limits, writer contract, metadata refresh, fingerprints, systemd save path |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Packet-local changelog generation (log.md analogue) |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Level contract (levels 1/2/3/3+, phase/review/research), goal budget |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` + packet-types | Template anchors, frontmatter canon, phase-parent shape |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | 40 rules incl. LINKS_VALID, metadata shape/drift rules |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh` | Required-field enforcement, grandfathering |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-description-shape.sh`, `check-graph-metadata-shape.sh` | Generated-pair shape checks |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Exclusion set, fail-closed frontmatter behavior |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Corpus walk behavior |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Registry-driven orchestration, --strict |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Retrofit limits (never authors content) |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Index shape and size (13,150 paths / 33,666 phrases) |
| `.skilled/commands/speckit/search.md`, `resume.md` | Command-level retrieval/resume contracts |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Advisor graph, routing phrases from skill metadata, exit taxonomy |
| `.skilled/hooks/post-edit-quality/README.md` | Warn-only hook contract |
| `specs/system-speckit/050-open-knowledge-format-adoption/**` | Packet docs, description.json, graph-metadata.json examples |
| `scratch/seed/okf-SPEC.md`, `scratch/seed/okf-README.md` | OKF v0.2 spec and README (seed; sha256-verified) |

## Web sources

| URL | Contributed |
|---|---|
| `https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing` | Announcement, v0.1 framing, design principles, LLM-wiki lineage, Knowledge Catalog ingest |
| `https://github.com/GoogleCloudPlatform/open-knowledge-format` | Canonical home; tree, README, SPEC.md |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/SPEC.md` | Hash-verified spec |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/src/reference_agent/bundle/document.py` | Executable semantics: type-only, verified normalization, trust tiers, staleness |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/tests/test_document.py` | Document-model tests |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/index.md` | Practice index shape |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/log.md` | Practice log shape; frontmatter divergence observed |
| `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/computations/revenue-ytd.md` | Full-family concept example |
| `https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf` | Frozen snapshot + redirect; Knowledge Catalog context |
| `https://api.github.com/search/repositories?q=open+knowledge+format+okf` | 370-repo ecosystem census |
| `https://api.github.com/search/repositories?q=okf+conformance` | 16 conformance-tooling repos; no canonical suite |
| `https://github.com/scaccogatto/okf-skills` | Independent Claude Code toolchain |
| `https://github.com/zosmaai/pi-llm-wiki` | Independent pi/Obsidian implementation |
| `https://github.com/serradura/okf` | Independent Ruby/MCP/TUI toolchain |
| `https://agents.md/` | Adjacent standard |
| `https://llmstxt.org/` | Adjacent standard |
| `https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` | Adjacent standard |

## Live runs

| Run | Observed result |
|---|---|
| `lookup-trigger-index.mjs -- "open knowledge format adoption"` | 0 results, 593 candidate phrases |
| `lookup-trigger-index.mjs -- "folder structure reference"` | 1 exact hit |
| rg recipe §2.2 for literal `Open Knowledge Format` | 4 packet docs |
| sha256 of seed / upstream / frozen SPEC.md | identical (`26aa5da0…`) |
| `find`/`rg` corpus counts | 41,265 md; 23,413 non-archive; 4,548 spec.md; 10 index.md; 0 log.md |
