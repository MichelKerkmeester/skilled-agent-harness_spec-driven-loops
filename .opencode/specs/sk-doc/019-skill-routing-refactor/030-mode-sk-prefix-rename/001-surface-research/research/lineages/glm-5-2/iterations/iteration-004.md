# Iteration 004 — Runtime mirrors, agents, benchmark gold, ordering, verification (Q4/Q5)

**Focus (Q4+Q5):** Ordering constraints and verification commands. Inspect runtime mirrors (`.claude/`,`.cursor/`,`.codex/`,`.devin/`), agent definitions, benchmark gold, and doctor parity scripts as verification levers.

**Lineage:** glm-5-2 | **Executor:** cli-devin glm-5-2 | **Status:** complete

---

## Approach

Verify whether runtime mirrors are symlinks or real copies. Inspect agent files for mode-key/path references. Confirm benchmark gold carries workflowMode values. Enumerate doctor routes as verification levers. Derive ordering constraints from the dependency graph.

## Findings

### Class H — Runtime mirrors (real directories, NOT symlinks in this worktree)

`.claude/SYNC.md` claims "commands, skills, specs and the changelog are whole-directory symlinks" [SOURCE: .claude/SYNC.md:8-9], but in THIS worktree they are REAL directories:
- `.claude/skills/sk-code` → `directory` (not symlink) [SOURCE: `file .claude/skills/sk-code` → "directory"; `ls -la` shows `drwxr-xr-x`, no `->` arrow]
- `.devin/skills/create-skill` → `directory` [SOURCE: `file .devin/skills/create-skill` → "directory"]
- `.claude/skills/` contains all four hubs (sk-code, sk-design, sk-doc, sk-prompt) plus cli-external-orchestration, mcp-*, system-* [SOURCE: ls .claude/skills/]
- `.devin/skills/` uses a DIFFERENT naming layer — advisor-facing skill names, not packet dirs: `create-skill`, `create-skill-parent`, `interface-design`, `interface-design-reference`, `prompt-improve`, plus deep-*, doctor-*, speckit-*, memory-* [SOURCE: ls .devin/skills/]

**Implication:** mirrors are SEPARATE consumer surfaces. Either (a) re-sync mirrors from `.opencode` after the rename, or (b) sweep each mirror's typed manifests separately. The `.devin/skills/` naming layer (`interface-design`, `interface-design-reference`, `prompt-improve`, `create-skill`, `create-skill-parent`) is a DISTINCT set of names that does NOT directly equal the workflowMode keys or packet dirs — it must be checked separately for whether the sk- prefix rename applies to it at all (likely NOT, since these are advisor skill identities, not mode keys). Carried to iteration 5.

### Class I — Agent definitions (hand-authored + generated)

Agents referencing mode keys / packet paths:
- `.opencode/agents/design.md:3` — prose: "routes to interface/foundations/motion/audit/md-generator modes plus the nested design-mcp-open-design transport" [SOURCE: .opencode/agents/design.md:3] — FREE PROSE mentioning mode keys (`interface`, `md-generator`, `design-mcp-open-design`); collision hazard for `interface`.
- `.opencode/agents/markdown.md:53,58,193-194,295` — `/create:skill`, `/create:skill-parent` slash commands + packet-dir paths (`.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`) [SOURCE: .opencode/agents/markdown.md:193-194]
- `.opencode/agents/prompt-improver.md:62-63,83,141,231,362` — `/prompt-improve` command + `.opencode/skills/sk-prompt/prompt-improve/SKILL.md` path [SOURCE: .opencode/agents/prompt-improver.md:63,141]
- `.opencode/agents/orchestrate.md`, `deep-alignment.md` — also matched (not field-verified this iteration)

Mirrors:
- `.claude/agents/` is a REAL fork (Claude dialect `tools:`), canonical for Cursor+Devin [SOURCE: .claude/SYNC.md:10-13]
- `.codex/agents/*.toml` are GENERATED from `.opencode/agents/` (Codex TOML dialect) [SOURCE: .claude/SYNC.md:16 "the generated Codex TOMLs"] — matches found: `.codex/agents/{deep-alignment,design,prompt-improver,orchestrate,markdown}.toml`

**Classification:** `.opencode/agents/` + `.claude/agents/` = HAND-AUTHORED (edit prose + paths); `.codex/agents/*.toml` = GENERATED (rebuild after `.opencode/agents/` changes).

### Class J — Benchmark gold (generated reports)

`.opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json` carries `workflowMode` fields with values `"quality"`, `"code-quality"` [SOURCE: .opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json:1045-1060]. Also `workflowMode: null` at :690. Benchmark reports exist under `skills/{sk-code,sk-design,sk-doc,sk-prompt,cli-external-orchestration,mcp-tooling}/benchmark/reports/` [SOURCE: grep]. These are GENERATED Lane-C skill-benchmark reports.
**Classification:** GENERATED — rebuild via the skill-benchmark runner; old reports become stale gold. The benchmark gold-scoring compares advisor routing against expected mode keys, so gold fixtures (expected-routing JSON) may need the new keys.

### Verification levers (Q5) — doctor routes + test guards

| Lever | Verifies | Path |
|-------|----------|------|
| `doctor-parent-skill` route | mode-registry/hub-router/leaf-manifest validity, registry↔directory reverse mapping, packetKind discriminator, no nested graph-metadata/description | `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (checks 2a,2b,3a,3b...) [SOURCE: :291-325] |
| `doctor-runtime-mirrors` route | mirror drift between `.opencode` and `.claude/.cursor/.codex/.devin` | `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` |
| `doctor-skill-graph-freshness` route | graph-metadata.json freshness vs packet content | `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` |
| `doctor-fable-mode` route | mode fable consistency | `.opencode/commands/doctor/scripts/fable-mode-check.cjs` |
| `doctor-skill-advisor` route | advisor metadata + command binding existence | `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` + `.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts` |
| `doctor-agent-roster-mirror` route | agent roster mirror parity | `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` |
| `route-validate` | route YAML mutation-class correctness | `.opencode/commands/doctor/scripts/route-validate.py` |
| design command surface check | command-metadata.json ↔ mode-registry ↔ command files parity | `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` + `interface-command-contract.test.mjs` |
| leaf-manifest test | leaf-manifest shape | `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` |

### Q4 — Ordering constraints

1. **Shared-packet dependency (HARD):** `create-skill` packet is shared by workflowModes `create-skill` and `create-skill-parent` [SOURCE: rename-map.json:60-74, sk-doc/mode-registry.json:19-40]. The dir rename `create-skill`→`sk-create-skill` updates BOTH modes' `packet`/`packetSkillName`/`advisorRouting.packetSkillName` fields simultaneously. `create-skill-parent` keeps key≠directory (workflowMode→`sk-create-skill-parent`, packet stays `sk-create-skill`).
2. **Registry↔directory reverse mapping (HARD):** `parent-skill-check.cjs` check 3 verifies every `modes[].packet` equals a real directory and vice versa [SOURCE: parent-skill-check.cjs:316-325]. So the directory rename and the `mode-registry.json` `packet`/`packetSkillName` field update MUST land together (the check passes only when both match).
3. **Typed manifests before generated artifacts:** `graph-metadata.json` and `description.json` are derived from packet dirs + SKILL.md [SOURCE: backfill-graph-metadata.ts:538, generate-description.ts]. Rebuild them AFTER dirs + manifests are renamed, not before.
4. **`.opencode/agents/` before `.codex/agents/*.toml`:** Codex TOMLs are generated from `.opencode/agents/` [SOURCE: .claude/SYNC.md:16]. Edit `.opencode/agents/` first, then regenerate `.codex/agents/`.
5. **`.opencode` before mirrors:** mirrors are real copies [SOURCE: file checks]. Edit `.opencode` source first, then re-sync `.claude/`,`.devin/`,`.cursor/` mirrors (or sweep each), then run `doctor-runtime-mirrors` to confirm parity.
6. **Command bindings after mode-registry `command` field:** command router `.md` files + YAML assets reference packet-dir paths and `workflowMode=<key>` literals; update after the registry `command`/`workflowMode` fields are renamed so `command-binding-existence` tests pass.
7. **Benchmark gold last:** regenerate benchmark reports after all routing surfaces use the new keys, so gold scoring matches the renamed advisor routing.

## What Worked
- `file <path>` + `ls -la` (no `->` arrow) definitively disproved the symlink claim for this worktree — a high-value correction of SYNC.md.
- Cross-referencing doctor route YAMLs with their `.cjs` scripts gave a concrete verification-lever table.

## What Failed / Ruled Out
- Did not field-verify `orchestrate.md`/`deep-alignment.md` agent mode-key references (only confirmed they match). Ruled out exhaustive agent prose enumeration — agents are flagged as a class with prose+path positions.
- Did not confirm whether `.devin/skills/` naming layer (`interface-design`, `prompt-improve`, etc.) is in scope for the sk- prefix rename — carried to iteration 5.

## Carried-Forward Open Questions
- Is the `.devin/skills/` advisor-skill-name layer (`interface-design`, `interface-design-reference`, `prompt-improve`, `create-skill`, `create-skill-parent`) in scope for the rename? (Hypothesis: NO — these are advisor skill identities, not mode keys; but the underlying SKILL.md content may reference packet dirs.)
- DB/cache consumers (spec open question) — still uninspected.
- Benchmark gold fixtures (expected-routing JSON) vs generated reports — which files hold the editable expected keys?

## Next Focus
Q5 finalization + DB/cache consumers (spec open question): inspect the skill-advisor MCP server for any DB/cache that stores mode keys (e.g. advisor state, embeddings), and resolve whether `.devin/skills/` naming is in scope. Broaden the cross-check frontier.

## newInfoRatio: 0.6
Novelty justification: established mirrors are real dirs (correcting SYNC.md), the `.devin/skills/` separate naming layer, agent hand-vs-generated split, benchmark gold as generated, a 9-row verification-lever table, and 7 ordering constraints including the shared-packet and registry↔directory hard dependencies. Builds on prior classes, so not fully novel.
