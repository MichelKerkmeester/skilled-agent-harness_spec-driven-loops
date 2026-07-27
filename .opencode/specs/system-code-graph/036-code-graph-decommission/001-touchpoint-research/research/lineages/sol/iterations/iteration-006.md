# Iteration 006 — Live Documentation and Doctrine

## Focus

Classify current documentation, doctrine, catalogs, install guidance, and operator instructions that would lie after runtime removal.

## Method

- Swept the repository with `rg --hidden --no-ignore` for exact server, skill, CLI, and tool identities.
- Excluded the active lineage and grouped `.opencode/specs/**`, changelogs, and benchmark reports as archival evidence.
- Read representative authority documents from every live family rather than treating broad phrase matches as equivalent.

## Findings

1. `AGENTS.md` is a live constitutional dependency, not incidental prose. It declares System Code Graph mandatory, routes structural search to graph tools, lists `mk_code_index` as a native MCP, prescribes `code_graph_scan` recovery, and documents the CLI fallback (`AGENTS.md:316`, `:342`, `:354`, `:378`, `:388`). Remove those claims and replace structural discovery with exact-text/filesystem guidance; root `CLAUDE.md` is the same physical file and is not a second edit.
2. Root `README.md` contains architecture diagrams, installation and runtime claims, an entire Code Graph capability section, MCP/tool counts, configuration examples, lifecycle claims, FAQs, and version totals (`README.md:101`, `:145-198`, `:590-657`, `:887`, `:1218-1225`, `:1357-1399`, `:1455`, `:1501`). This needs a coherent post-removal rewrite, not token deletion.
3. Installation guidance has two authorities: remove the dedicated `.opencode/install-guides/SET-UP - Code Graph.md`, and prune the Code Graph sections, bundle tables, validation commands, doctor examples, server totals, and skill lists from `.opencode/install-guides/README.md` (`:84`, `:319`, `:699-753`, `:855-899`, `:1519`, `:1566-1586`).
4. The skill catalog and Spec Kit doctrine advertise the retiring surface. Update `.opencode/skills/README.md:78`, `.opencode/skills/system-spec-kit/SKILL.md:441-449`, `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:42-43`, and remove the dedicated `.opencode/skills/system-spec-kit/constitutional/code-graph-scope-intent.md`.
5. Current Spec Kit documentation has a broad secondary blast radius: daemon CLI reference, environment reference, hook-system/configuration references, feature catalog, install guide, README, and manual-testing playbooks. Graph-only scenarios should be removed; mixed scenarios must retain memory/advisor behavior while dropping graph steps and expected signals.
6. Current Skill Advisor, deep-loop, CLI orchestration, `sk-code`, `sk-doc`, and `mcp-code-mode` documents contain graph routing, fallback, internal-server, or example claims. Remove only the structural MCP claims. Preserve deep-loop’s independent SQLite coverage graph and its convergence/upsert runtime.
7. `.opencode/skills/.code-graph-freshness-state/README.md` and its state directory are operational residue, not documentation to retain. Remove them after hook/plugin shutdown.
8. Repository-local runtime docs outside `.opencode` also require reconciliation: `.claude/CLAUDE.md` search routing, `.claude/SYNC.md` tool grants, `.codex` agent mirrors, `.github` hook/workflow descriptions, `.devin` hook configuration, and plugin/script READMEs.

## Classification Rule

Live authorities and generated/current manuals are mutation targets. `.opencode/specs/**`, changelogs, benchmark reports, and captured benchmark transcripts remain immutable historical evidence even when their wording becomes false in the new runtime.

## Telemetry

- Findings: 8
- New-information ratio: 0.78
- Convergence: above threshold; telemetry only under `max-iterations`
- Next angle: quantify and classify the archival record so it cannot leak into the edit plan
