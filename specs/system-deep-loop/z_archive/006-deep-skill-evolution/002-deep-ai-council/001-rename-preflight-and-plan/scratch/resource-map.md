# Resource Map — packet 115 (deep-ai-council rename)

**Baseline date**: 2026-05-21
**Repo-wide rg count**: 375 files containing `deep-ai-council`
**Live surfaces (in scope)**: ~125 files
**Historical surfaces (preserve as provenance)**: ~250 files

Source data: `scratch/rg/rg-baseline-before-files.txt` (per-file list), `scratch/rg/rg-baseline-before-counts.txt` (per-file hit counts).

---

## 1. LIVE SURFACES — per phase

### Phase 002 — Skill directory rename (`.opencode/skills/deep-ai-council/` → `sk-ai-council/`)

| Sub-group | Files | Hits | Action |
|---|---|---|---|
| Skill root files (SKILL.md, README.md, description.json, graph-metadata.json) | 4 | 8+16+~5+12 = ~41 | Edit all `deep-ai-council` → `sk-ai-council` |
| `references/*.md` (command_wiring, folder_layout, output_schema, etc.) | ~5-8 | ~30-40 | Same |
| `assets/*.json` | ~3 | ~5 | Same (path fields only) |
| `scripts/*` (Bash + Python + 2 internal READMEs) | ~10-15 | ~15-20 | Same |
| `feature_catalog/**.md` (01--runtime-routing-and-rename/* etc) | ~10-15 | ~20-30 | Body content edit; HISTORICAL slug `01-runtime-agent-renamed-to-deep-ai-council.md` preserved |
| `manual_testing_playbook/**.md` | ~15-20 | ~50-60 | Body content edit; slugs preserved |
| `changelog/v3.0.0.0.md` (NEW) | 1 | n/a | Create |
| `changelog/v1.0.0.0.md` + `v2*.md` | preserved | n/a | DO NOT EDIT (historical version state) |

**Phase 002 file scope**: `.opencode/skills/deep-ai-council/**` (whole tree) → `.opencode/skills/sk-ai-council/**` after `git mv`. Plus new v3.0.0.0.md. Exclude `changelog/v1.0.0.0.md` + `changelog/v2*.md` from edits.

### Phase 003 — Agent runtime rename (4 runtimes)

| File | Action |
|---|---|
| `.opencode/agents/deep-ai-council.md` | `git mv` → `ai-council.md`; frontmatter `name: ai-council`; body refs to `Read(.opencode/skills/sk-ai-council/SKILL.md)` |
| `.claude/agents/deep-ai-council.md` | Same |
| `.codex/agents/deep-ai-council.toml` | Same (TOML frontmatter syntax) |
| `.gemini/agents/deep-ai-council.md` | Same |
| `.opencode/agents/README.txt` | Update agent inventory: `deep-ai-council` → `ai-council` |
| `.claude/agents/README.txt` | Same |
| `.codex/agents/README.txt` | Same |
| `.gemini/agents/README.txt` | Same |

**Phase 003 file scope**: 4 agent files (renamed + edited) + 4 agent README.txt files.

### Phase 004 — Cross-skill graph metadata + TypeScript code

| File | Action |
|---|---|
| `.opencode/skills/deep-research/graph-metadata.json` | Update `enhances`/`related_to`/`siblings` entries pointing at `deep-ai-council` → `sk-ai-council` |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Same |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Same |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Same |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` (10 hits) | Update routing string constants; preserve regex shape |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` (7 hits) | Update assertions to expect `ai-council` agent name across all 4 runtimes |

**Phase 004 file scope**: 6 files (4 graph metadata + 2 TS).

### Phase 005 — Root docs + skills index

| File | Action |
|---|---|
| `README.md` (line 935 skill catalog) | `**deep-ai-council**` → `**sk-ai-council**` + agent listing if present |
| `AGENTS.md` (line 162 Quick Reference; line 336 Agent Definition) | `@deep-ai-council` → `@ai-council`; "deep-ai-council" → "sk-ai-council" for skill refs |
| `CLAUDE.md` | Symlink to AGENTS.md — automatic |
| `.opencode/skills/README.md` (skills index) | Update skill listing |

**Phase 005 file scope**: 3 files (AGENTS.md/README.md/skills-README) — CLAUDE.md is a symlink.

### Mention-only minor refs (which phase?)

Files in 113/103/110/108/102/027/099/114 spec folders + sk-code-review/sk-doc/cli-devin/deep-review/system-code-graph with 1-2 hits each. These are mostly historical references in spec docs — preserve. Will verify case-by-case in 001 cli-devin dispatch.

---

## 2. HISTORICAL SURFACES — preserve as provenance

| Group | Files | Reason |
|---|---|---|
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/**` | 63 | Originating packet; documents the work that created deep-ai-council |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` | 150 | Research track citing the skill under its original name |
| `.opencode/skills/deep-ai-council/changelog/v1.0.0.0.md` + `v2*.md` | 2-3 | Historical version state |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-{19,20}/per-probe.jsonl` | 2 | Frozen bench fixtures (serialized data records prior-name state) |
| Other 113/103/110/108/102/027/114/099 spec docs | ~10-15 | Historical refs in past packet docs |
| Internal HISTORICAL SLUGS in feature_catalog + manual_testing_playbook | n/a (slugs in 002 scope) | Slug names like `01-runtime-agent-renamed-to-deep-ai-council.md` document a prior 2026-05-10 rename event; preserve filename, edit body content |

---

## 3. NAMING CONVENTION DECISIONS

- **Skill**: `deep-ai-council` → `sk-ai-council` (joins sk-util family: sk-code, sk-doc, sk-prompt, sk-git, sk-prompt-models)
- **Agent**: `deep-ai-council` → `ai-council` (drops `deep-` prefix; agents do not use `sk-` per existing convention)
- **Skill graph family** in graph-metadata.json: stays `sk-util` (matches sk-prompt etc.)
- **Skill category** in graph-metadata.json: stays `utility` (matches sk-prompt)

---

## 4. CLI-DEVIN SWE-1.6 DISPATCH PLAN (Phase 001 work)

3 parallel jobs to verify the rename plan against each surface group:

1. **Job-1**: Skill body + sibling skill graph metadata (Phase 002 + 004's graph subset)
2. **Job-2**: 4 runtime agent files + root docs + skills-index (Phase 003 + 005)
3. **Job-3**: TypeScript code/tests (Phase 004's TS subset)

Each job follows cli-devin/SKILL.md contract: RCAF framework via sk-prompt; medium-density pre-planning (3-4 ordered steps with acceptance); bundle-gate "standard"; `--model swe-1.6 --permission-mode auto -p --prompt-file ... </dev/null`. Returns JSON of `{file_path, edit_recipe, verification_command}` per in-scope file.

Bundle gate verification per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]]:
- Grep-verify cited file paths exist on disk.
- Cross-check symbols/lines vs my own reads.
- Smoke-run validation_commands when bundles propose them.
- Unclassified count must be 0.

---

## 5. RENAME-PLAN.JSON CONTRACT (emitted by Phase 001)

`rename-plan.json` is the conflict-prevention contract enforced across phases 002-005. Schema:

```json
{
  "phases": {
    "002": {
      "file_scope": [".opencode/skills/deep-ai-council/**"],
      "exclude": ["changelog/v1.0.0.0.md", "changelog/v2*.md"],
      "rename_dir": {"from": ".opencode/skills/deep-ai-council", "to": ".opencode/skills/sk-ai-council"},
      "literal_substitution": {"deep-ai-council": "sk-ai-council"}
    },
    "003": {
      "file_scope": [
        ".opencode/agents/deep-ai-council.md",
        ".claude/agents/deep-ai-council.md",
        ".codex/agents/deep-ai-council.toml",
        ".gemini/agents/deep-ai-council.md",
        ".opencode/agents/README.txt",
        ".claude/agents/README.txt",
        ".codex/agents/README.txt",
        ".gemini/agents/README.txt"
      ],
      "rename_files": [
        {"from": ".opencode/agents/deep-ai-council.md", "to": ".opencode/agents/ai-council.md"},
        {"from": ".claude/agents/deep-ai-council.md", "to": ".claude/agents/ai-council.md"},
        {"from": ".codex/agents/deep-ai-council.toml", "to": ".codex/agents/ai-council.toml"},
        {"from": ".gemini/agents/deep-ai-council.md", "to": ".gemini/agents/ai-council.md"}
      ],
      "literal_substitution": {"deep-ai-council": "ai-council", ".opencode/skills/deep-ai-council/": ".opencode/skills/sk-ai-council/"}
    },
    "004": {
      "file_scope": [
        ".opencode/skills/deep-research/graph-metadata.json",
        ".opencode/skills/deep-agent-improvement/graph-metadata.json",
        ".opencode/skills/system-spec-kit/graph-metadata.json",
        ".opencode/skills/system-skill-advisor/graph-metadata.json",
        ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts",
        ".opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts"
      ],
      "literal_substitution_per_file": {
        "graph-metadata.json files": {"deep-ai-council": "sk-ai-council"},
        "explicit.ts": {"deep-ai-council": "sk-ai-council"},
        "vitest.ts": {"deep-ai-council": "ai-council (for agent slug assertions)", "or sk-ai-council (for skill assertions)"}
      }
    },
    "005": {
      "file_scope": [
        "README.md",
        "AGENTS.md",
        ".opencode/skills/README.md"
      ],
      "literal_substitution": {
        "deep-ai-council": "sk-ai-council (skill mentions)",
        "@deep-ai-council": "@ai-council (agent mentions)",
        ".opencode/skills/deep-ai-council/": ".opencode/skills/sk-ai-council/ (paths in hook glob)"
      }
    }
  },
  "exclude_all_phases": [
    ".opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/**",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/**",
    ".opencode/skills/deep-ai-council/changelog/v1.0.0.0.md",
    ".opencode/skills/deep-ai-council/changelog/v2*.md",
    ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/**"
  ]
}
```

**Disjoint scope invariant**: file_scope lists in 002/003/004/005 are mutually exclusive. Phase 006 verifies via jq intersection check that no file appears in multiple phase scopes.

---

## 6. CRITICAL ATTENTION POINTS

1. **Agent vs skill name divergence**: After rename, the agent `@ai-council` loads `.opencode/skills/sk-ai-council/SKILL.md`. Agent body content must be updated to reference the new SKILL.md path. This is a one-way coupling — the agent body changes, the skill body doesn't reference the agent.

2. **TypeScript code routing**: `explicit.ts` is part of the advisor's lane scorer. String constants matching agent/skill slugs affect routing behavior. Need to read the file's full context to understand whether `deep-ai-council` appears as a single literal or as a regex source.

3. **Vitest parity test**: `multi-ai-council-runtime-parity.vitest.ts` asserts that all 4 runtime agent files have the same content (or specific matching properties). After rename, the parity test must be updated to assert against the new filename + frontmatter `name`.

4. **Historical slug vs body**: The feature_catalog/manual_testing_playbook slugs `01-runtime-agent-renamed-to-deep-ai-council.md` document the PRIOR rename event from 2026-05-10. Slug PRESERVED; body content edited to use new skill/agent names where they describe current state.
