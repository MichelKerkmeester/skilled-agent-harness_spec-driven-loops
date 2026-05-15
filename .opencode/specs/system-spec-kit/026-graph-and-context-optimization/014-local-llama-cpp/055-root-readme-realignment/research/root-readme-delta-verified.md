# Root README delta — verified

Date: 2026-05-15
Pass 1 source: research/root-readme-context-bundle.json
Cross-checker: cli-opencode + deepseek-v4-pro

## Verdict per Pass 1 item

### Item 1: skill count (Pass 1 claimed DRIFTED)
- **Pass 1 status**: DRIFTED (19 → 20)
- **My verification**: `ls -d .opencode/skills/*/SKILL.md | wc -l` returns **20**. All 20 directories contain a SKILL.md file. The CLI-devin skill was added in commit `df8395f7e2` (`feat(cli-devin): Introduce Devin CLI orchestrator skill`). The README documents cli-devin at lines 847-849 in the CROSS-AI CLI subsection, so cli-devin IS acknowledged in prose — but the numeric count was not bumped.
- **My verdict**: **CONFIRMED**
- **Additional finding**: The README Skills Library section (lines 768-896) documents only 19 skills by name. The `deep-ai-council` skill (at `.opencode/skills/deep-ai-council/SKILL.md`) is entirely absent from the Skills Library. It is mentioned only as an agent (line 951, Agent Network section). Like `deep-research` and `deep-review`, `deep-ai-council` is both a skill AND an agent — it needs a listing under the Skills Library (likely under "OTHER" near line 880).
- **Final suggested rewrite**: `🎯 20 Skills` in all 5 locations (lines 7, 55, 770, 1415, 1491). Additionally, add a `deep-ai-council` skill entry to the OTHER subsection of the Skills Library.

### Item 2: 294-entry feature catalog (Pass 1 claimed UNVERIFIED)
- **Pass 1 status**: UNVERIFIED
- **My verification**: 
  - 22 categories: CONFIRMED. The feature_catalog.md contains 22 `## ` sections (1-22), and 22 per-category subdirectories exist (`01--retrieval` through `22--context-preservation`).
  - Entry count: `find feature_catalog/ -name '*.md' ! -name 'feature_catalog.md' ! -path '*/.github/*' | wc -l` returns **290** per-feature `.md` files across 22 categories (individual counts: 12+11+4+3+8+8+2+13+15+18+22+11+25+25+15+36+4+19+11+3+5+20 = 290).
  - The README claims **294** entries. The difference is 4 entries (~1.4% off).
- **My verdict**: **CONFIRMED-MOSTLY** — the 22 categories are exact; the entry count is slightly stale (290 actual vs 294 claimed). This is a minor discrepancy that probably does not warrant urgent correction, but the number should be updated to match reality.
- **Final suggested rewrite**: `290-entry reference across 22 categories` (lines 1125, 1454, 1477). Alternatively, re-audit the catalog to confirm whether 4 entries were removed or the count was miscounted originally.

## Drift Pass 1 missed (if any)

### M1: deep-ai-council skill missing from Skills Library (lines 768-896)

- **Section + line range**: `### 🎯 Skills Library`, lines 768-896
- **Claim verbatim**: The Skills Library header states "19 skills in `.opencode/skills/`" (line 770) and the section documents 19 skills but omits `deep-ai-council`.
- **Evidence of drift**: `deep-ai-council` has a SKILL.md at `.opencode/skills/deep-ai-council/SKILL.md` (verified by `ls` and `grep`), making it a first-class skill. It is also registered in `.opencode/skills/README.md` at line 60. The root README mentions `deep-ai-council` only as an agent (line 951, Agent Network section), never as a skill. The Skills Library should document all 20 skills including `deep-ai-council`.
- **Suggested rewrite**: Add a `deep-ai-council` entry under the OTHER subsection (near line 887, after `deep-agent-improvement`):

```
**deep-ai-council**
- Multi-seat planning council that dispatches diverse AI reasoning seats for strategic decisions
- Cross-seat critique and convergence checks produce evidence-backed recommendations
- Packet-local artifact persistence via `ai-council/**` output directory
```

### M2: Ambiguous scripts paths — `scripts/spec/` and `scripts/memory/` (lines 293, 303, 312)

- **Section + line range**: `#### Scripts and Validation`, lines 291-312
- **Claim verbatim**: "**Spec Management Scripts** (in `scripts/spec/`):" (line 293) and "**Memory Scripts** (in `scripts/memory/`):" (line 303)
- **Evidence of drift**: The README is document-root (repo root). No `scripts/spec/` or `scripts/memory/` directory exists at the repo root. A `scripts/` directory exists at root but contains different files (`setup-maintainer-filters.sh`, `archive.sh`, etc.). The actual paths are `.opencode/skills/system-spec-kit/scripts/spec/` and `.opencode/skills/system-spec-kit/scripts/memory/`. The Quick Start installation steps (lines 133-147) use the correct full paths, and the Features section's Spec Folder Structure diagram (line 232) uses a `specs/<###-feature-name>/` pattern that also resolves from the repo root — creating reader confusion when `scripts/spec/` suddenly expects an implicit prefix.
- **Suggested rewrite**: Change `scripts/spec/` to `.opencode/skills/system-spec-kit/scripts/spec/` and `scripts/memory/` to `.opencode/skills/system-spec-kit/scripts/memory/`. Similarly, line 312's `scripts/dist/` and `scripts/dist/memory/generate-context.js` should be `.opencode/skills/system-spec-kit/scripts/dist/...`.

## Drift Pass 1 over-flagged (if any)

None. Pass 1's two flagged items are both genuine: the skill count is indeed drifted (19→20, CONFIRMED), and the feature catalog entry count needed verification (UNVERIFIED, now resolved to CONFIRMED-MOSTLY with minor count discrepancy of 290 vs 294).

All 14 CURRENT items in Pass 1's bundle were spot-checked and are correct:
- Tool counts: 39 mk-spec-memory, 8 mk_skill_advisor, 10 mk_code_index, 7 code_mode, 1 cocoindex_code, 1 sequential_thinking = 66 total — all verified against `tool-schemas.ts` (39 entries in `TOOL_DEFINITIONS`), `opencode.json` config notes, and `.codex/config.toml`.
- Server names: `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `cocoindex_code`, `sequential_thinking`, `code_mode` — all confirmed in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, and `.gemini/settings.json`.
- Config file paths: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` — all exist.
- Path claims (spot-checks): `.opencode/skills/system-code-graph/SKILL.md`, `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js`, `.opencode/skills/system-skill-advisor/README.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `DEPLOYMENT.md`, `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`, `.opencode/skills/system-code-graph/feature_catalog/`, `.opencode/skills/system-code-graph/manual_testing_playbook/` — all resolve.
- Agent count: 11 agents in `.opencode/agents/` (excluding README.txt) — confirmed.
- Command count: 22 commands (6 spec_kit + 4 memory + 6 create + 2 improve + 3 doctor + 1 agent_router) — all 22 `.md` files confirmed present.
- Changelog path: `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` — confirmed.

## Command file inventory (verification)

```
spec_kit/   complete.md, deep-research.md, deep-review.md, implement.md, plan.md, resume.md  (6)
memory/     learn.md, manage.md, save.md, search.md                                           (4)
create/     agent.md, changelog.md, feature-catalog.md, folder_readme.md, sk-skill.md, testing-playbook.md (6)
improve/    agent.md, prompt.md                                                               (2)
doctor/     mcp.md, update.md  +  doctor.md (root)                                            (3)
root        agent_router.md                                                                   (1)
TOTAL: 6+4+6+2+3+1 = 22 ✅
```

## Final action list

A clear list of surgical edits the next pass (sonnet @markdown) should apply:

```
EDIT 1: README.md:7
  FROM: "11 agents, 19 skills, 22 command entry points"
  TO:   "11 agents, 20 skills, 22 command entry points"
  REASON: Skill count drifted from 19 to 20; cli-devin added in df8395f7e2

EDIT 2: README.md:55
  FROM: "| **🎯 19 Skills**        | Code, docs, git, prompts, MCP, research, review, improvement, cross-AI, and standalone system packages"
  TO:   "| **🎯 20 Skills**        | Code, docs, git, prompts, MCP, research, review, council, improvement, cross-AI, and standalone system packages"
  REASON: Skill count 19→20; added deep-ai-council to category description

EDIT 3: README.md:770
  FROM: "19 skills in `.opencode/skills/`, loaded on demand when Gate 2 matches a task"
  TO:   "20 skills in `.opencode/skills/`, loaded on demand when Gate 2 matches a task"
  REASON: Skill count 19→20

EDIT 4: README.md:1415
  FROM: "**Q: Do I need all 19 skills installed to use the framework?**"
  TO:   "**Q: Do I need all 20 skills installed to use the framework?**"
  REASON: Skill count 19→20

EDIT 5: README.md:1491
  FROM: "Documentation version: 4.10 | Last updated: 2026-05-15 | Framework: 11 agents, 19 skills, 22 commands, 66 MCP tools"
  TO:   "Documentation version: 4.11 | Last updated: 2026-05-15 | Framework: 11 agents, 20 skills, 22 commands, 66 MCP tools"
  REASON: Skill count 19→20; bump doc version

EDIT 6: README.md:after-line-887
  FROM: (insert after deep-agent-improvement entry, before the --- separator)
  TO:
"**deep-ai-council**
- Multi-seat planning council dispatching diverse AI reasoning seats for strategic decisions
- Cross-seat critique and convergence checks produce evidence-backed recommendations
- Packet-local artifact persistence via `ai-council/**` output directory
- Planning-only scope; agent counterpart listed in Agent Network (line 951)
"
  REASON: deep-ai-council skill exists at .opencode/skills/deep-ai-council/SKILL.md but is missing from Skills Library

EDIT 7: README.md:1454
  FROM: "A: The feature catalog is a 294-entry reference across 22 categories"
  TO:   "A: The feature catalog is a 290-entry reference across 22 categories"
  REASON: Actual count is 290 per-feature .md files (verified via find); 294 is stale

EDIT 8: README.md:1477
  FROM: "- **[→ Feature Catalog](.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md)** - 294-entry technical reference"
  TO:   "- **[→ Feature Catalog](.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md)** - 290-entry technical reference"
  REASON: Actual count is 290; 294 is stale

EDIT 9: README.md:1125
  FROM: "Validates against the 294-entry catalog structure across 22 categories"
  TO:   "Validates against the 290-entry catalog structure across 22 categories"
  REASON: Actual count is 290

EDIT 10: README.md:293
  FROM: "(in `scripts/spec/`):"
  TO:   "(in `.opencode/skills/system-spec-kit/scripts/spec/`):"
  REASON: Path does not resolve from repo root; actual path is under system-spec-kit/

EDIT 11: README.md:303
  FROM: "(in `scripts/memory/`):"
  TO:   "(in `.opencode/skills/system-spec-kit/scripts/memory/`):"
  REASON: Path does not resolve from repo root

EDIT 12: README.md:312
  FROM: "TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`."
  TO:   "TypeScript sources compile to `.opencode/skills/system-spec-kit/scripts/dist/`. The runtime entry point for memory saves is `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`."
  REASON: Path does not resolve from repo root
```

## Summary

- Pass 1 items confirmed: 1 (skill count DRIFTED)
- Pass 1 items refined: 1 (feature catalog: UNVERIFIED → CONFIRMED-MOSTLY, 290 not 294)
- Pass 1 items refuted: 0
- Pass 1 missed drift: 2 (deep-ai-council missing from Skills Library; ambiguous scripts paths)
- Total final edits required: 12
