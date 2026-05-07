---
title: Resource Map — sk-improve-prompt → sk-prompt Skill Rename
description: Path ledger for packet 082 covering active rename touch sites, skipped historical scope, edge cases, and verification gates.
trigger_phrases:
  - "082 resource map"
  - "sk-improve-prompt rename resource map"
  - "082 file ledger"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename"
    last_updated_at: "2026-05-06T15:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Resource map frontmatter completed (P1 remediation from deep-review iter-5)"
    next_safe_action: "Final memory save + commit"
    blockers: []
    completion_pct: 100
---

# Resource Map — Packet 082 (sk-improve-prompt → sk-prompt)

This packet renames the skill `sk-improve-prompt` to `sk-prompt`. The `sk-` family prefix is retained; only the redundant `-improve-` segment is removed.

The agent name `@improve-prompt` and dispatcher command `/improve:prompt` stay unchanged. Only their body references to the renamed skill move from `sk-improve-prompt` to `sk-prompt`.

All paths below were verified from the repo root with `rg -l 'sk-improve-prompt' <path>` and counted with `rg -c 'sk-improve-prompt' <path>` unless the note says the path has a path-only rename impact.

---

## 1. RENAME TARGETS

| From | To | Notes |
|------|-----|-------|
| `.opencode/skills/sk-improve-prompt/` | `.opencode/skills/sk-prompt/` | Folder rename target; aggregate content count: 39 matching lines across 8 files |
| `.opencode/changelog/sk-improve-prompt` | `.opencode/changelog/sk-prompt` | Verified symlink path embed; currently points to `../skill/sk-improve-prompt/changelog` |
| String `sk-improve-prompt` | `sk-prompt` | Active non-historical references only |
| String `.opencode/skills/sk-improve-prompt/` | `.opencode/skills/sk-prompt/` | URL/path references in docs, agents, commands, graph metadata, and changelogs |

**Verified pre-discovery counts**

- Active non-spec implementation/doc surface: 47 files with refs.
- Active scope including current packet/spec continuity docs: 73 files with refs.
- Skill folder aggregate: 39 matching lines across 8 files.
- Highest concentration: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` with 31 matching lines.
- Historical/frozen scopes stay excluded from implementation phases.

---

## 2. AREA LEDGER (PHASE → AREA → REPRESENTATIVE PATHS)

### Phase 001 — Discovery impact map

| Area | Representative paths | Count | Category |
|------|----------------------|-------|----------|
| Pre-discovery command | `rg -l 'sk-improve-prompt' .` with historical excludes | 47 active non-spec files; 73 including active spec docs | MUST RENAME / NEEDS DECISION split |
| Current packet docs | `.opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/spec.md` | 17 | NEEDS DECISION: rename packet metadata intentionally names source and target |
| Phase child metadata | `.opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/{001,002,003,004,005,006}-*/{spec.md,description.json,graph-metadata.json}` | verified by `rg -l`; present in active grep | NEEDS DECISION: packet-local continuity may retain source-name context until completion |
| Cross-packet active spec refs | `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/{resource-map.md,spec.md,plan.md,checklist.md,tasks.md}` | verified by active grep | NEEDS DECISION: active but not in critical inventory |
| Active research refs | `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/{iterations/iteration-004.md,prompts/iteration-4.md,deltas/iter-004.jsonl,findings-registry.json}` | verified by active grep | NEEDS DECISION: research continuity, not an operational source surface |
| Repo-wide spec index | `.opencode/specs/descriptions.json` | verified by active grep | NEEDS DECISION: generated index; update through metadata tooling if included |

### Phase 002 — Skill folder rename + skill internals

| Area | Representative paths | Count | Category |
|------|----------------------|-------|----------|
| Skill folder root | `.opencode/skills/sk-improve-prompt/` | 39 aggregate | MUST RENAME |
| Skill frontmatter | `.opencode/skills/sk-improve-prompt/SKILL.md` | 1 | MUST RENAME |
| Skill README | `.opencode/skills/sk-improve-prompt/README.md` | 4 | MUST RENAME |
| Skill graph metadata | `.opencode/skills/sk-improve-prompt/graph-metadata.json` | 15 | MUST RENAME |
| Skill changelog | `.opencode/skills/sk-improve-prompt/changelog/v1.0.0.0.md` | 1 | MUST RENAME |
| Skill changelog | `.opencode/skills/sk-improve-prompt/changelog/v1.1.0.0.md` | 7 | MUST RENAME |
| Skill changelog | `.opencode/skills/sk-improve-prompt/changelog/v1.2.0.0.md` | 7 | MUST RENAME |
| Skill reference | `.opencode/skills/sk-improve-prompt/references/depth_framework.md` | 1 | MUST RENAME |
| Skill reference | `.opencode/skills/sk-improve-prompt/references/patterns_evaluation.md` | 0 | MUST RENAME path only via folder rename |
| Skill asset | `.opencode/skills/sk-improve-prompt/assets/cli_prompt_quality_card.md` | 3 | MUST RENAME |
| Skill assets | `.opencode/skills/sk-improve-prompt/assets/format_guide_json.md`, `.opencode/skills/sk-improve-prompt/assets/format_guide_markdown.md`, `.opencode/skills/sk-improve-prompt/assets/format_guide_yaml.md` | 0 each | MUST RENAME path only via folder rename |
| Changelog symlink | `.opencode/changelog/sk-improve-prompt` | 15 via symlink target | MUST RENAME or retarget symlink |
| Advisor skill graph | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | 5 | MUST RENAME: `hub_skills`, `signals`, `families`, `adjacency`, node entry |

### Phase 003 — `.opencode/` internals

| Sub-area | Representative paths | Count | Category |
|----------|----------------------|-------|----------|
| Advisor Python scoring | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | 31 | MUST RENAME |
| Advisor explicit lane | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | 9 | MUST RENAME |
| Advisor lexical lane | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | 1 | MUST RENAME |
| Advisor fusion lane | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | 1 | MUST RENAME |
| Advisor metadata | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | 1 | MUST RENAME |
| Advisor sync script | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh` | 1 | MUST RENAME |
| Routing accuracy fixtures | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` | 10 | MUST RENAME |
| Regression fixtures | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | 2 | MUST RENAME |
| Dispatcher command body | `.opencode/commands/improve/prompt.md` | 10 | MUST RENAME body refs only; command path/name unchanged |
| Dispatcher README | `.opencode/commands/improve/README.txt` | 2 | MUST RENAME body refs only |
| OpenCode agent body | `.opencode/agents/improve-prompt.md` | 9 | MUST RENAME body refs only; agent path/name unchanged |
| CLI Claude mirror | `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md`, `.opencode/skills/cli-claude-code/SKILL.md` | 1 each | MUST RENAME |
| CLI Claude manual playbook | `.opencode/skills/cli-claude-code/manual_testing_playbook/07--prompt-templates/002-clear-quality-card-5-check.md` | 1 | MUST RENAME |
| CLI Copilot mirror | `.opencode/skills/cli-copilot/assets/prompt_quality_card.md`, `.opencode/skills/cli-copilot/SKILL.md`, `.opencode/skills/cli-copilot/manual_testing_playbook/07--prompt-templates/002-clear-quality-card-application.md` | 1 each | MUST RENAME |
| CLI Codex mirror | `.opencode/skills/cli-codex/assets/prompt_quality_card.md`, `.opencode/skills/cli-codex/SKILL.md` | 1 each | MUST RENAME |
| CLI Gemini mirror | `.opencode/skills/cli-gemini/assets/prompt_quality_card.md`, `.opencode/skills/cli-gemini/SKILL.md` | 1 each | MUST RENAME |
| CLI Gemini manual playbook | `.opencode/skills/cli-gemini/manual_testing_playbook/07--prompt-templates/002-clear-quality-card-application.md` | 0 | NEEDS DECISION: verified exists but has no old-name content |
| CLI OpenCode mirror | `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | 1 | MUST RENAME |
| CLI OpenCode manual playbook | `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/002-clear-quality-card.md` | 2 | MUST RENAME |
| Deep agent improvement cross-refs | `.opencode/skills/deep-agent-improvement/SKILL.md`, `.opencode/skills/deep-agent-improvement/changelog/v1.1.0.0.md`, `.opencode/skills/deep-agent-improvement/graph-metadata.json` | 1 each | MUST RENAME |
| sk-code advisor docs | `.opencode/skills/sk-code/assets/opencode/checklists/mcp_server_authoring.md` | 2 | MUST RENAME |
| sk-code advisor playbook | `.opencode/skills/sk-code/manual_testing_playbook/04--skill-advisor-integration/001-advisor-probe-battery.md` | 1 | MUST RENAME |

### Phase 004 — Runtime mirrors

| Runtime | Representative paths | Count | Category |
|---------|----------------------|-------|----------|
| Claude agent mirror | `.claude/agents/improve-prompt.md` | 9 | MUST RENAME body refs only; agent file/name unchanged |
| Codex agent mirror | `.codex/agents/improve-prompt.toml` | 9 | MUST RENAME body refs only; agent file/name unchanged |
| Gemini agent mirror | `.gemini/agents/improve-prompt.md` | 9 | MUST RENAME body refs only; agent file/name unchanged |
| Gemini command README | `.gemini/commands/improve/README.txt` | 2 | MUST RENAME body refs only |
| Gemini create prompt command | `.gemini/commands/create/prompt.toml` | 2 | MUST RENAME verified body refs |

### Phase 005 — Root + active config

| Area | Representative paths | Count | Category |
|------|----------------------|-------|----------|
| Root README | `README.md` | 4 | MUST RENAME |
| Install guide | `.opencode/install_guides/SET-UP - AGENTS.md` | 2 | MUST RENAME |
| Install guide README | `.opencode/install_guides/README.md` | 3 | MUST RENAME |
| Skill catalog README | `.opencode/skills/README.md` | 4 | MUST RENAME |
| system-spec-kit changelog | `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md` | 1 | MUST RENAME |
| Smart-router measurement results | `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | 15 | NEEDS DECISION: generated measurement history; update only if forward-facing IDs are intentionally mutable |
| Smart-router measurement report | `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` | 1 | NEEDS DECISION: generated report table; update with results if regenerated |
| Agent orchestration changelog | `.opencode/changelog/agent-orchestration/v2.4.0.0.md` | 4 | MUST RENAME if active changelog policy allows forward correction |

### Phase 006 — Verification (no source mods)

| Verification | Tool | Expected |
|--------------|------|----------|
| Skill graph rebuild | `mcp__spec_kit_memory__advisor_rebuild` | Advisor graph reflects `sk-prompt`; stale cache cleared |
| Advisor probe 1 | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "improve this prompt with COSTAR" --threshold 0.0` | top skill is `sk-prompt` |
| Advisor probe 2 | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "enhance my prompt using CRISPE and CRAFT" --threshold 0.0` | top skill is `sk-prompt` |
| Advisor probe 3 | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "/improve:prompt make this clearer" --threshold 0.0` | command bridge still routes to prompt skill |
| Advisor probe 4 | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "create a sharper prompt for the routing evaluator" --threshold 0.0` | top skill is `sk-prompt` |
| Advisor probe 5 | `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "clear scoring for this prompt package" --threshold 0.0` | top skill is `sk-prompt` |
| Parent validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename --strict` | exit 0 |
| Child validation | Run strict validation for `001-discovery-impact-map` through `006-advisor-and-validate` | exit 0 for all six child folders |
| Final grep gate | `rg -l 'sk-improve-prompt' .` with historical excludes | zero active operational refs; allowed hits documented if packet-local source-name context remains |

---

## 3. EDGE CASES TO AUDIT IN PHASE 001

1. **Filename embeds**: `find . -name "*sk-improve-prompt*"` found `.opencode/skills/sk-improve-prompt`, `.opencode/changelog/sk-improve-prompt`, `.opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename`, plus `barter/coder/.opencode/...` nested-copy paths. The packet must decide whether only the canonical root `.opencode/` surfaces are in scope.
2. **JSON keys**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` contains `sk-improve-prompt` as object keys and graph IDs, not only values.
3. **URL paths**: docs and agents link to `.opencode/skills/sk-improve-prompt/` and `.opencode/skills/sk-improve-prompt/SKILL.md`; these become broken links after folder rename.
4. **Hardcoded skill IDs**: TS/Python constants use `'sk-improve-prompt'` as lookup keys in `skill_advisor.py`, `explicit.ts`, `lexical.ts`, and `fusion.ts`.
5. **Code-graph node IDs**: CocoIndex/code graph SQLite stores may have indexed old skill names; re-index after source rename.
6. **Memory database**: `context-index.sqlite` may have indexed `sk-improve-prompt`; rebuild or refresh memory indexes after rename.
7. **Test fixtures / regression cases**: `labeled-prompts.jsonl` and `skill_advisor_regression_cases.jsonl` encode expected skill IDs and must move to `sk-prompt`.
8. **Smart-router observability**: `smart-router-measurement-results.jsonl` and `smart-router-measurement-report.md` are generated historical measurements; update only forward-facing IDs or regenerate as a unit.
9. **Memory references**: `_memory.continuity` blocks and active `description.json` / `graph-metadata.json` files may contain packet/source-name context. Treat current packet docs and generated spec indexes as a Phase 001 decision, not a blind string replacement.

---

## 4. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Folder rename breaks active references mid-implementation | Medium | High | Phase 002 completes the folder/symlink rename and skill-local refs before dependent docs and runtime mirrors move. |
| Advisor cache stale during multi-phase run | High | Medium | Rebuild advisor after `skill-graph.json` changes and again in Phase 006 before probes. |
| `skill_advisor.py` edits miss a reference | Medium | High | Treat 31 matching lines as a concentrated checklist; use targeted `rg -n` before and after edit. |
| `skill-graph.json` key rename misses one of 5 locations | Medium | High | Update `hub_skills`, `signals`, `families`, `adjacency`, and node entry in the same edit, then rebuild graph. |
| cli-* mirror divergence | Medium | Medium | Update 5 mirror cards and parent routing refs together; run `check-prompt-quality-card-sync.sh`. |
| Historical/frozen scope accidentally rewritten | Medium | High | Use explicit grep excludes for `.opencode/specs/.../z_archive`, `.opencode/specs/z_future`, packets `054/055/061/063/067/070/079`, system packet `026`, and `.git`. |
| Phase order violation (003 before 002) | Medium | High | Enforce phase order: skill folder and local metadata first, then consumers and mirrors. |
| Symlink breakage under `.opencode/changelog/sk-improve-prompt` | Medium | Medium | Rename or retarget the verified symlink when the skill folder moves. |
| Current packet docs keep expected source-name hits after final grep | High | Low | Decide in Phase 001 whether packet-local source-name context is allowed or excluded from final grep. |

---

## 5. PHASE-AREA-PATH LEDGER

| Phase | MUST RENAME | SKIP | NEEDS DECISION |
|-------|-------------|------|----------------|
| 001 — Discovery impact map | N/A: inventory phase only | Frozen historical scopes listed below | Current packet docs, active research/spec continuity refs, `.opencode/specs/descriptions.json` |
| 002 — Skill folder + skill internals | `.opencode/skills/sk-improve-prompt/`, `.opencode/changelog/sk-improve-prompt`, skill `SKILL.md`, `README.md`, `graph-metadata.json`, changelogs, `depth_framework.md`, `cli_prompt_quality_card.md`, `format_guide_*.md`, `patterns_evaluation.md`, `skill-graph.json` | N/A | Whether `.opencode/changelog/sk-improve-prompt` is renamed as a symlink or regenerated by changelog tooling |
| 003 — `.opencode/` internals | `skill_advisor.py`, `explicit.ts`, `lexical.ts`, `fusion.ts`, advisor metadata, sync script, routing fixtures, `.opencode/commands/improve/*`, `.opencode/agents/improve-prompt.md`, cli-* mirrors, deep-agent-improvement refs, sk-code advisor docs | N/A | `.opencode/skills/cli-gemini/manual_testing_playbook/07--prompt-templates/002-clear-quality-card-application.md` has 0 refs; no content edit unless nearby mirror policy requires it |
| 004 — Runtime mirrors | `.claude/agents/improve-prompt.md`, `.codex/agents/improve-prompt.toml`, `.gemini/agents/improve-prompt.md`, `.gemini/commands/improve/README.txt`, `.gemini/commands/create/prompt.toml` | Agent and command filenames remain unchanged | N/A |
| 005 — Root + active config | `README.md`, `.opencode/install_guides/SET-UP - AGENTS.md`, `.opencode/install_guides/README.md`, `.opencode/skills/README.md`, `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md`, `.opencode/changelog/agent-orchestration/v2.4.0.0.md` | N/A | Smart-router observability JSONL/report: update only if considered forward-facing or regenerated |
| 006 — Advisor + validate | No source mods; rebuild graph, run probes, run strict validation, run final grep | N/A | Allowed final grep hits, if any, must be explicitly documented |

**Frozen historical scope: SKIP**

| Scope | Category |
|-------|----------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/**` | SKIP historical |
| `.opencode/specs/z_future/**` | SKIP future/historical research |
| `.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/**` | SKIP completed packet |
| `.opencode/specs/skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated/**` | SKIP completed packet |
| `.opencode/specs/skilled-agent-orchestration/061-agent-optimization/**` | SKIP completed packet |
| `.opencode/specs/skilled-agent-orchestration/063-skill-advisor-architecture-alignment/**` | SKIP completed packet |
| `.opencode/specs/skilled-agent-orchestration/067-mcp-figma-transfer/**` | SKIP completed packet |
| `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/**` | SKIP completed precedent packet |
| `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/**` | SKIP completed packet |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` | SKIP frozen phase tree |
| `.git/**` | SKIP VCS internals |

