---
title: "Skill Advisor Phase Changelogs"
description: "Index of phase-level changelogs for the 026/008 skill-advisor track. Each entry tells the story of what was broken before the phase, what shipped, and what changed for users."
trigger_phrases:
  - "skill advisor changelog"
  - "skill advisor history"
  - "008 phase changelog index"
importance_tier: "normal"
contextType: "implementation"
---

# Skill Advisor Phase Changelogs

Thirty-three phase changelogs cover the 008-skill-advisor track from 2026-04-09 through 2026-04-24. Together they describe the journey from "the skill advisor had 24 dead multi-word boosters, no graph relationships, and no hook surface" to "four runtimes inject a fresh advisor brief at prompt time with graph-derived boosts, native MCP tools, and 52/52 regression cases passing."

The skill advisor is the Gate 2 router that matches user prompts to the correct skill. It lives in `skill_advisor.py` (Python compatibility path), `mcp_server/skill_advisor/` (native TypeScript path), and `.opencode/plugins/spec-kit-skill-advisor.js` (OpenCode plugin). The hook surface (`hooks/*/user-prompt-submit.ts`) injects the recommendation into each runtime before the model sees the prompt.

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 001 | 2026-04-09 | [Search and Routing Tuning](./changelog-001-search-and-routing-tuning.md) | Five search-fusion and content-routing children plus three deep-research waves and a graph-metadata validation pass. |
| 001/R010 | 2026-04-13 | [Review 001/006/001: Search Fusion Tuning Pt-01](./changelog-001-review-006-search-routing-advisor-001-search-fusion-tuning-pt-01.md) | 10-iteration review. 0 P0, 7 P1 on root-packet drift after renumbering. |
| 001/R010 | 2026-04-13 | [Review 001/006/001: Search Fusion Tuning Pt-02 (impl)](./changelog-001-review-006-search-routing-advisor-001-search-fusion-tuning-pt-02.md) | 10-iteration implementation review. 0 P0, 1 P1 on test isolation. |
| 001/R010 | 2026-04-13 | [Review 001/006/002: Content Routing Accuracy Pt-01](./changelog-001-review-006-search-routing-advisor-002-content-routing-accuracy-pt-01.md) | 10-iteration review. 0 P0, 5 P1 on lineage drift and missing canonical docs. |
| 001/R010 | 2026-04-13 | [Review 001/006/003: Graph Metadata Validation Pt-01](./changelog-001-review-006-search-routing-advisor-003-graph-metadata-validation-pt-01.md) | 10-iteration review. 0 P0, 6 P1 on parser/cap drift and stale lineage. |
| 001/R010 | 2026-04-13 | [Review 001/006/003: Graph Metadata Validation Pt-02 (impl)](./changelog-001-review-006-search-routing-advisor-003-graph-metadata-validation-pt-02.md) | 10-iteration implementation review. 0 P0, 1 P1 on backfill failure containment. |
| 001/R010 | 2026-04-13 | [Review 001/010: Search and Routing Tuning Pt-02](./changelog-001-review-010-search-and-routing-tuning-pt-02.md) | 20-iteration review. 0 P0, 5 P1 on promotion-integrity defects. |
| 001/R010 | 2026-04-13 | [Review 001/010: Search and Routing Tuning Pt-03](./changelog-001-review-010-search-and-routing-tuning-pt-03.md) | 10-iteration review. 0 P0, 6 P1 on Stage 3 continuity handoff and packet closure. |
| 001/R010 | 2026-04-13 | [Review 001/010: Search and Routing Tuning Pt-07](./changelog-001-review-010-search-and-routing-tuning-pt-07.md) | 10-iteration review. 0 P0, 3 P1 on metadata-only continuity routing and Tier-3 doc drift. |
| 001/R010 | 2026-04-13 | [Review 001/010: Search and Routing Tuning Pt-11](./changelog-001-review-010-search-and-routing-tuning-pt-11.md) | 10-iteration review. FAIL verdict. 0 P0, 3 P1 on command-shaped metadata and stale backfill tests. |
| 001/R010 | 2026-04-11 | [Review: Search Fusion Tuning Prompts](./changelog-001-review-001-search-fusion-tuning-prompts.md) | Legacy review from the search-fusion tuning family. |
| 001/R010 | 2026-04-11 | [Review: Content Routing Accuracy Prompts](./changelog-001-review-002-content-routing-accuracy-prompts.md) | Legacy review from the content-routing accuracy family. |
| 001/R010 | 2026-04-11 | [Review: Graph Metadata Validation Prompts](./changelog-001-review-003-graph-metadata-validation-prompts.md) | Legacy review from the graph-metadata validation family. |
| 001/R010 | 2026-04-09 | [Research: Search and Routing Tuning Pt-01](./changelog-001-research-010-search-and-routing-tuning-pt-01.md) | Legacy deep-research first wave. |
| 001/R010 | 2026-04-10 | [Research: Search and Routing Tuning Pt-02](./changelog-001-research-010-search-and-routing-tuning-pt-02.md) | Legacy deep-research second wave. |
| 001/R010 | 2026-04-10 | [Research: Search and Routing Tuning Pt-03](./changelog-001-research-010-search-and-routing-tuning-pt-03.md) | Legacy deep-research third wave. |
| 002 | 2026-04-13 | [Skill Advisor Graph](./changelog-001-skill-advisor-graph.md) | 21 per-skill graph metadata files, compiled skill-graph.json, and graph-derived routing boosts. 44/44 regression cases. |
| 003 | 2026-04-15 | [Advisor Phrase Booster Tailoring](./changelog-002-advisor-phrase-booster-tailoring.md) | 36 dead multi-word/hyphenated INTENT boosters migrated to PHRASE. 33 new phrase routes. 52/52 regression cases. |
| 004 | 2026-04-19 | [Skill Advisor Docs and Code Alignment](./changelog-001-docs-and-code-alignment.md) | Hook-first docs, sk-code-opencode audit of Phase 020 TypeScript. 9 minor fixes. 118/118 tests. |
| 005 | 2026-04-19 | [Smart Router Remediation and OpenCode Plugin](./changelog-003-smart-router-remediation-and-opencode-plugin.md) | 6 smart-router fixes plus OpenCode plugin. ON_DEMAND hit rate 5.5% to 48.0%. Static CI check. Observe-only telemetry. |
| 006 | 2026-04-19 | [Deferred Remediation and Telemetry Run](./changelog-001-deferred-remediation-and-telemetry-run.md) | Static measurement harness, live-session wrapper, analyzer. 112/200 top-1 matches measured. 90% complete (Codex blocked). |
| 007 | 2026-04-19 | [Skill Advisor Hook Surface](./changelog-004-skill-advisor-hook-surface.md) | Cross-runtime hook surface. Claude/Gemini/Copilot/Codex parity. 200/200 corpus. Cache-hit p95 0.016ms. DQI 97 reference doc. |
| 007/R007 | 2026-04-19 | [Review 007/007: Hook Surface Tier2 Pt-01](./changelog-007-review-004-skill-advisor-hook-surface-tier2-pt-01.md) | Single-pass review. 2 P1: Copilot next-turn contract, pending Level 3 checklist. |
| 008 | 2026-04-20 | [Skill Graph Daemon and Advisor Unification](./changelog-002-skill-graph-daemon-and-advisor-unification.md) | Unified advisor architecture. Daemon freshness, native scorer, MCP surface, compatibility shims, promotion gates. |
| 008/R008 | 2026-04-20 | [Review 008/008: Daemon and Unification Pt-01](./changelog-008-review-002-skill-graph-daemon-and-advisor-unification-pt-01.md) | 4-iteration review. 3 P1: unavailable fail-open, scan authority, missing regression tests. |
| 009 | 2026-04-23 | [Skill Advisor Plugin Hardening](./changelog-002-skill-advisor-plugin-hardening.md) | Per-instance state, in-flight dedup, bounded payloads, LRU eviction. 30/30 tests. |
| 010 | 2026-04-23 | [Skill Advisor Standards Alignment](./changelog-003-skill-advisor-standards-alignment.md) | OpenCode Plugin Exemption Tier added. Plugin JSDoc and section dividers. No behavior changes. |
| 011 | 2026-04-24 | [Skill Advisor Hook Improvements](./changelog-001-skill-advisor-hook-improvements.md) | OpenCode threshold parity, Codex shared-brief normalization, public MCP workspace/threshold semantics, durable telemetry. |
| 011/R014 | 2026-04-24 | [Research 011/014: Hook Improvements Pt-02](./changelog-011-research-014-skill-advisor-hook-improvements-pt-02.md) | 10-iteration research. Parity and observability drift confirmed. CF-019 closed. |
| 011/R029 | 2026-04-24 | [Research 011/029: Hook Improvements Pt-01](./changelog-011-research-029-skill-advisor-hook-improvements-pt-01.md) | 10-iteration research. 5 P1: threshold split, cache drift, Codex bypass, static weights, write-only telemetry. |
| 011/R031 | 2026-04-24 | [Research 011/031: Gap Investigation Pt-01](./changelog-011-research-031-skill-advisor-gap-investigation-pt-01.md) | Gap investigation. 8 missed files: downstream docs, playbooks, and test gaps. 6 P1, 2 P2. |
| 008-012 | 2026-04-24 | [Skill Advisor Setup Command](./changelog-008-005-skill-advisor-setup-command.md) | Legacy setup-command changelog from the earlier numbering. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how we proved the change works
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Research-only and review-only phases mark Added/Changed/Fixed as "None" and fill Verification with artifact paths and finding counts.

Voice rules per `.opencode/skills/sk-doc/references/hvr_rules.md` apply throughout. Technical jargon includes a parenthetical definition on first use.

## Where to find the full story

- Per-phase spec folders live under `026/008/` and its children.
- Deep-research output for each research sub-phase lives at `<phase>/research/research.md`.
- Deep-review output for each review sub-phase lives at `<phase>/review/review-report.md`.
- Implementation summaries with detailed file changes live at `<phase>/implementation-summary.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Phase parents use `changelog/root.md` template. All other phases use `changelog/phase.md`.
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
- HVR rules are non-negotiable: no em-dashes, no semicolons in narrative prose
