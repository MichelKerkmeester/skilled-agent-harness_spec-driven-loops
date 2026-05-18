# Resource Map — 077 system-spec-kit + mcp-coco-index + sk-code OpenCode audit

Inventory of every file/path the 077 research touched or recommended, grouped by section. Generated at convergence/completion.

---

## READMEs

| Path | Note |
|---|---|
| `.opencode/skills/system-spec-kit/README.md` | Surveyed for MCP tool surface drift |
| `.opencode/skills/mcp-coco-index/README.md` | Surveyed for CLI vs MCP parity claims |
| `.opencode/skills/sk-code/README.md` | OpenCode scope claims (skills/agents/commands) |

## Documents (SKILL.md + references)

| Path | Note |
|---|---|
| `.opencode/skills/system-spec-kit/SKILL.md` | RESOURCE_MAP audit (F-001-001 ROLLOUT_FLAGS); Section 2 router contract |
| `.opencode/skills/mcp-coco-index/SKILL.md` | CLI/MCP decision tree; freshness warning (lines 316-318) |
| `.opencode/skills/sk-code/SKILL.md` | OPENCODE scope (lines 20-23); workflow-load (147-152); STACK_FOLDERS regression (F-008-001) |
| `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md` | F-001-005 stale relative link line 551-554 |
| `.opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md` | F-007-003 surface-coverage gap |
| `.opencode/skills/sk-code/references/router/intent_classification.md` | F-008-002 intent-taxonomy vs resource-map drift |
| `.opencode/skills/sk-code/references/router/resource_loading.md` | F-008-001 STACK_FOLDERS regression |
| `.opencode/skills/sk-code/references/router/phase_lifecycle.md` | F-008-004 spec-folder write naming-only |
| `.opencode/skills/sk-code/references/opencode/standards/quick_reference.md` | F-006-003 pre-domain path refs |
| `.opencode/skills/sk-code/references/opencode/config/quality_standards.md` | F-006-002 skills/agents/commands gap |

## Commands

| Path | Note |
|---|---|
| `.opencode/commands/spec_kit/complete.md` | F-009-001 review-time-only sk-code load (not authoring-time) |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Workflow integration target for Phase 2 remediation |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Same |

## Agents

| Path | Note |
|---|---|
| `.opencode/agents/code.md` | LEAF coder agent; consumer of sk-code resources during writes |
| `.opencode/agents/review.md` | LEAF reviewer; current consumer of sk-code (post-write) |

## Skills (touched)

| Path | Note |
|---|---|
| `.opencode/skills/system-spec-kit/` | Validator + MCP server + templates |
| `.opencode/skills/mcp-coco-index/` | Skill + MCP server (settings.py, server.py) |
| `.opencode/skills/sk-code/` | references/opencode/ + assets/opencode/ + SKILL.md |
| `.opencode/skills/sk-doc/` | Out of scope but referenced for changelog template usage |
| `.opencode/skills/deep-research/` | Iteration prompt-pack template + assets/strategy template |

## Specs (this packet + neighbors)

| Path | Note |
|---|---|
| `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/` | This packet |
| `.opencode/specs/skilled-agent-orchestration/068-sk-doc-organization/` | Predecessor — assets/ root reorg |
| `.opencode/specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/` | Just shipped sk-code v3.1.0.0 (out of scope here) |
| `.opencode/specs/skilled-agent-orchestration/076-sk-doc-missing-router-intents-bullet-aware-matrix/` | Most recent prior packet (different scope) |

## Scripts

| Path | Note |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | F-002-001 graph-metadata shape gap |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` | Surveyed; clean |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh` | F-002-002 phase rule gap |
| `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` | Surveyed; clean |
| `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js` | Used for 077 init |
| `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Used for 077 init |
| `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | Used for prior /memory:save |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | F-001-003 refresh_index default; F-003-001 tool dispatch |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | F-001-002 DEFAULT_EXCLUDED_PATTERNS |
| `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/scripts/dispatch-iter.sh` | This packet's per-iteration dispatcher |
| `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/scripts/run-loop.sh` | This packet's loop driver |

## Tests

(none directly executed; gaps surfaced in F-009-004, F-002-001/002, F-007-003)

## Config

| Path | Note |
|---|---|
| `.opencode/skills/sk-code/description.json` | Read for OpenCode keyword surface |
| `.opencode/skills/sk-code/SKILL.md` frontmatter | version 3.1.0.0 (just shipped) |
| `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/deep-research-config.json` | This packet's research config |

## Meta

| Path | Note |
|---|---|
| Memory rule (in CLAUDE.md MEMORY.md) | "DELETE not archive", "Stay on main", "cli-codex fast mode explicit" all honored in 077 |
| Phase 019 autonomous completion directive | Honored: 10 iterations dispatched in continuous run, no confirmation gates |

---

## SECTION COUNTS

| Section | Entries |
|---|---|
| READMEs | 3 |
| Documents | 10 |
| Commands | 3 |
| Agents | 2 |
| Skills | 5 |
| Specs | 4 |
| Scripts | 11 |
| Tests | 0 (gaps only) |
| Config | 3 |
| Meta | 2 |
| **Total** | **43** |

**Theme**: 43 distinct touched paths, concentrated in sk-code (16) + system-spec-kit scripts/docs (11) + mcp-coco-index server (5). Phase 1 remediation will primarily add 6-8 new files under `sk-code/assets/opencode/`; Phase 2-4 modify existing files across all three surfaces.
