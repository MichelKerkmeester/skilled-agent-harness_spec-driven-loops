# Deep Review Iteration 005 — Cross-Runtime-Mirror-Consistency

**Date**: 2026-05-04
**Dispatcher**: @deep-review (LEAF, single-iteration)
**Dimension**: cross-runtime-mirror-consistency
**Budget Profile**: scan (9 tool calls)
**Status**: complete

---

## Files Reviewed

| File | Read | Purpose |
|---|---|---|
| `.opencode/agents/` (dir) | Glob | Canonical agent inventory (11 .md files) |
| `.claude/agents/` (dir) | Glob | Claude mirror agent inventory (11 .md files) |
| `.codex/agents/` (dir) | Glob | Codex mirror agent inventory (11 .toml + README.txt) |
| `.gemini/agents/` (dir) | Glob | Gemini mirror agent inventory (11 .md files) |
| `.opencode/agents/code.md` | Full read (492L) | Canonical code agent baseline |
| `.claude/agents/code.md` | Full read (492L) | Claude code agent mirror comparison |
| `.gemini/agents/code.md` | Full read (492L) | Gemini code agent mirror comparison |
| `.codex/agents/code.toml` | Partial read (60L) + Grep | Codex code agent mirror format comparison |
| `AGENTS.md` | Grep | Stale reference search (compose.sh, CORE+ADDENDUM, level_1) |
| `CLAUDE.md` | Grep | Stale reference search (compose.sh, CORE+ADDENDUM, level_1) |
| `.opencode/commands/create/assets/*.yaml` | Grep + Read | Stale template-path search |
| `.opencode/skills/` (dir) | Grep | Verify manifest .tmpl `packet_pointer` references use `level_2/3/3+` |
| `.claude/skills/` (dir) | Grep | Verify Claude skills directory references |

---

## Findings - New

### P1 Findings

1. **Code agent terminology drift — canonical `.opencode/` says "resolved route" / "router-selected guidance set"; mirrors say "detected stack" / "overlay"** — `.opencode/agents/code.md:179` vs `.claude/agents/code.md:179` / `.gemini/agents/code.md:179`; `.opencode/agents/code.md:311` vs `.claude/agents/code.md:311` / `.gemini/agents/code.md:311`
   
   Two specific divergences identified:
   - **Pre-Implementation checklist line 179**: `.opencode` canonical reads `"sk-code invoked or loaded for the resolved route; UNKNOWN or ambiguous routing escalated."` The `.claude` and `.gemini` mirrors read `"sk-code invoked or loaded for the detected stack; UNKNOWN stack or cross-stack mismatch escalated."` — substituting "resolved route" (describing the single-router architecture) with "detected stack" (implying a different architecture).
   - **ALWAYS rule line 311**: `.opencode` canonical reads `"Load sk-code first, then exactly one applicable router-selected guidance set (or none + escalate UNKNOWN)"` while `.claude`/`.gemini` mirrors read `"Load sk-code baseline first, then exactly one applicable overlay (or none + escalate UNKNOWN)"` — substituting "router-selected guidance set" with "overlay" and adding "baseline" qualifier to sk-code loading.
   
   The `.codex/agents/code.toml` aligns with the `.opencode` canonical on both lines. This means the CLAUDE and GEMINI runtimes will give the `@code` agent different instructions about how to load and interpret sk-code's router output. "Overlay" implies a two-tier architecture (baseline + overlay) that does not exist; the actual architecture is a single smart-router returning a guidance set.
   
   **Finding class**: terminology-drift
   **Scope proof**: Side-by-side diff: `.opencode/agents/code.md:179` vs `.claude/agents/code.md:179`; `.opencode/agents/code.md:311` vs `.claude/agents/code.md:311`; `.gemini/agents/code.md:179,311` match `.claude/`; `.codex/agents/code.toml:154,280` match `.opencode/`.
   **Affected surface hints**: [`.claude/agents/code.md`, `.gemini/agents/code.md`, `@code` agent behavior on CLAUDE/GEMINI runtimes, `sk-code` skill loading]
   
   **Claim Adjudication**:
   ```json
   {
     "type": "terminology-drift",
     "claim": "The .claude and .gemini code agent mirrors use different terminology ('detected stack'/'overlay') than the .opencode canonical ('resolved route'/'router-selected guidance set'), which could cause divergent agent behavior",
     "evidenceRefs": [
       ".opencode/agents/code.md:179",
       ".claude/agents/code.md:179",
       ".gemini/agents/code.md:179",
       ".opencode/agents/code.md:311",
       ".claude/agents/code.md:311",
       ".gemini/agents/code.md:311",
       ".codex/agents/code.toml:154,280"
     ],
     "counterevidenceSought": "Checked whether 'overlay' architecture exists in sk-code skill — it does not; the smart-router returns a flat guidance set. Verified .codex/ mirror aligns with .opencode/ canonical.",
     "alternativeExplanation": "These mirrors may have been generated from an earlier draft of the code agent or an intermediate version before terminology was finalized. The divergence is real and the mirrors lag the canonical.",
     "finalSeverity": "P1",
     "confidence": "HIGH",
     "downgradeTrigger": null
   }
   ```

2. **Stale `templates/level_1/` paths in create-agent workflow YAML files** — `.opencode/commands/create/assets/create_agent_auto.yaml:310-311` and `.opencode/commands/create/assets/create_agent_confirm.yaml:343-344`

   Both YAML workflow files reference non-existent template paths:
   ```
   templates:
   - .opencode/skills/system-spec-kit/templates/level_1/spec.md
   - .opencode/skills/system-spec-kit/templates/level_1/plan.md
   ```
   These `level_1/` directories were removed during the CORE+ADDENDUM→manifest migration (confirmed in Iteration 001). The actual templates live under `templates/manifest/spec.md.tmpl`, `templates/manifest/plan.md.tmpl`, etc. The YAML workflows would fail silently or fall back to a generic template if triggered, as the referenced paths do not exist. The actual create.sh script uses `copy_templates_batch` → `_manifest_template_path` → `templates/manifest/` correctly, so the YAML declarations are documentation-only drift — but they would guide a human or automated workflow to non-existent files.
   
   **Finding class**: stale-reference
   **Scope proof**: Glob `templates/level_1/*` = 0 matches; `templates/manifest/spec.md.tmpl` exists; `templates/manifest/plan.md.tmpl` exists. `create_agent_auto.yaml:310-311` and `create_agent_confirm.yaml:343-344` reference non-existent paths.
   **Affected surface hints**: [`.opencode/commands/create/assets/create_agent_auto.yaml`, `.opencode/commands/create/assets/create_agent_confirm.yaml`, `/create:agent` command]
   
   **Claim Adjudication**:
   ```json
   {
     "type": "stale-reference",
     "claim": "create-agent workflow YAML files reference templates/level_1/ paths that no longer exist after the manifest migration",
     "evidenceRefs": [
       ".opencode/commands/create/assets/create_agent_auto.yaml:310-311",
       ".opencode/commands/create/assets/create_agent_confirm.yaml:343-344"
     ],
     "counterevidenceSought": "Verified templates/level_1/ does not exist via Glob; confirmed templates/manifest/ is the active path; checked that create.sh uses _manifest_template_path to resolve templates correctly at runtime — the YAML references are documentation drift, not active code paths.",
     "alternativeExplanation": "These YAML files may be auto-generated or older workflow definitions that were not updated during the manifest migration. The active create.sh code correctly resolves templates, so the impact is limited to documentation/human-readability.",
     "finalSeverity": "P1",
     "confidence": "HIGH",
     "downgradeTrigger": null
   }
   ```

### P2 Findings

3. **`.codex/agents/` uses TOML format while `.opencode/`, `.claude/`, `.gemini/` use Markdown** — `.codex/agents/code.toml:1-8` vs `.opencode/agents/code.md:1-20`
   
   The Codex runtime uses `.toml` files with runtime-specific fields (`model = "gpt-5.4"`, `model_reasoning_effort = "high"`, `sandbox_mode = "workspace-write"`) that do not exist in the `.md` format used by OpenCode, Claude, and Gemini runtimes. The developer instructions (embedded in a TOML string) mirror the `.opencode` canonical content. This format difference is platform-appropriate but not documented anywhere in the agent mirroring contract.
   
   **Finding class**: format-variance
   **Scope proof**: `.codex/agents/code.toml:1-8` uses TOML; `.opencode/agents/code.md:1-20` uses YAML frontmatter + Markdown; `.claude/agents/code.md:1-20` same; `.gemini/agents/code.md:1-20` same.
   **Affected surface hints**: [`.codex/agents/*.toml`, Agent mirroring documentation (if any)]

4. **`.claude/agents/code.md:40` and `.gemini/agents/code.md:40` contain OpenCode-runtime-specific language** — `.claude/agents/code.md:40`, `.gemini/agents/code.md:40`
   
   Both mirrors state: `"permission.task: deny" blocks the Task tool at the OpenCode runtime layer.` This references "OpenCode runtime layer" in the Claude and Gemini mirrors. While "OpenCode" may refer to the task-tool mechanism generically, it creates confusion for operators on non-OpenCode runtimes. The `.opencode` canonical correctly references its own runtime.
   
   **Finding class**: runtime-reference-leak
   **Scope proof**: `.claude/agents/code.md:40` says "OpenCode runtime layer"; `.gemini/agents/code.md:40` says "OpenCode runtime layer"; `.opencode/agents/code.md:40` is correct for its runtime.
   **Affected surface hints**: [`.claude/agents/code.md`, `.gemini/agents/code.md`]

---

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| compose.sh references in agents | **CLEAN** | Grep for `compose\.sh` across all 4 agent directories, AGENTS.md, CLAUDE.md: 0 matches |
| CORE+ADDENDUM references in agents | **CLEAN** | Grep for `CORE.*ADDENDUM` across all agent directories: 0 matches |
| templates/core/ references in agents | **CLEAN** | Grep for `templates/core/` across all agent directories: 0 matches |
| templates/addendum/ references in agents | **CLEAN** | Grep for `templates/addendum/` across all agent directories: 0 matches |
| templates/level_1/ references (stale) | **FAIL** | 2 hits in `.opencode/commands/create/assets/*.yaml` (P1-005-002) |
| templates/level_N/ references in manifest .tmpl | **EXPECTED** | 35 hits in `templates/manifest/*.tmpl` as `packet_pointer` references — these are intentional template metadata, not stale paths |
| Agent inventory parity across runtimes | **PASS** | `.opencode/`: 11 agents, `.claude/`: 11 agents, `.codex/`: 11 agents + README, `.gemini/`: 11 agents — all 4 runtimes have the same agent set |
| @code agent content consistency | **FAIL** | Terminology drift between `.opencode` canonical and `.claude`/`.gemini` mirrors (P1-005-001); `.codex/` aligns with `.opencode/` |

---

## Integration Evidence

- **Command integration**: `.opencode/commands/create/assets/create_agent_auto.yaml` and `create_agent_confirm.yaml` — stale template references (P1-005-002)
- **YAML workflow**: `/create:agent` workflow definitions — affected by stale paths
- **Runtime mirroring**: `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` — mirrors structurally present but content-lag identified (P1-005-001)

---

## Edge Cases

1. **`.codex/agents/` uses TOML format**: Not a finding in itself — Codex CLI expects TOML agent definitions. However, this format difference means any automated mirror-validation tool must handle both `.md` and `.toml` formats. The content parity is good (same agent set, same instructions modulo format), but the format variance is undocumented.

2. **Terminology drift pattern**: The `.claude` and `.gemini` mirrors share the same divergent terminology ("detected stack", "overlay"), suggesting they were cloned from the same point-in-time version of the canonical agent. The `.codex` mirror was apparently regenerated or updated since, as it matches the current `.opencode` canonical. This implies a mirror-regeneration process that was run for `.codex/` but not `.claude/` or `.gemini/`.

3. **`.gemini/agents/improve-agent.md` initially appeared missing**: First glob pass showed 10 items, but re-glob confirmed 11 — the file exists. The initial count confusion stemmed from visual scan of the glob output, not an actual file absence.

---

## Confirmed-Clean Surfaces

- **No compose.sh stale references** in any agent file, AGENTS.md, or CLAUDE.md
- **No CORE+ADDENDUM stale references** in any agent file
- **`.codex/agents/` agent inventory** matches the canonical set (11 agents + README)
- **`.gemini/agents/` agent inventory** matches the canonical set (11 agents)
- **Manifest `.tmpl` packet_pointer references** all use valid `level_2/3/3+` paths
- **`sk-code` skill routing** consistently referenced as `.opencode/skills/sk-code/SKILL.md` across all 4 runtimes (correct canonical path)
- **AGENTS.md and CLAUDE.md** contain no stale template-path references

---

## Ruled Out

1. **`.codex/` missing agents**: Ruled out — directory contains 11 `.toml` files (same agent set as canonical).
2. **`.gemini/` missing improve-agent**: Ruled out — file confirmed present via direct glob.
3. **Stale `templates/level_2/`, `level_3/`, `level_3+/` references in manifest .tmpl**: These are `packet_pointer` metadata fields in the manifest template system, not stale file-system paths. They reference logical template identifiers, not directory paths.
4. **Runtime-specific model constraints causing behavior divergence**: The `.codex/` TOML includes `model = "gpt-5.4"` and `model_reasoning_effort = "high"` but these are runtime configuration fields, not instruction content. They do not produce divergent behavior.
5. **template-structure.js or spec-kit-docs.json references in agents**: None found. The agents do not reference implementation internals, so there is no inconsistency to report on this axis.

---

## Next Focus

- **Dimension**: cross-runtime-mirror-consistency — **COMPLETE** (final iteration)
- **Score**: 7/10
- **Summary**: The cross-runtime mirror infrastructure is structurally sound — all 4 runtimes have the same agent set (11 agents each) and the content is substantially equivalent. However, terminology drift between the `.opencode` canonical and the `.claude`/`.gemini` mirrors creates potential for divergent agent behavior on those runtimes. The stale `level_1/` paths in workflow YAML files are documentation drift, not active code paths. No `compose.sh` or `CORE+ADDENDUM` stale references remain in any agent file or top-level configuration. The `.codex/` mirror is the most current (aligns with `.opencode/` canonical terminology).
- **Recommended remediation**: Regenerate `.claude/agents/code.md` and `.gemini/agents/code.md` from the `.opencode/agents/code.md` canonical to resolve terminology drift (P1-005-001). Update `create_agent_auto.yaml` and `create_agent_confirm.yaml` to reference `templates/manifest/` paths (P1-005-002). Document the `.codex/` TOML format as expected platform variance (P2-005-003).

---

## Review Loop Summary

| Dimension | Iteration | P0 | P1 | P2 | Score |
|---|---|---|---|---|---|
| implementation-spec-alignment | 001 | 0 | 4 | 2 | 8/10 |
| code-correctness | 002 | 0 | 3 | 2 | 7/10 |
| template-rendering-correctness | 003 | 0 | 4 | 2 | 7/10 |
| validator-coverage | 004 | 0 | 3 | 2 | 6/10 |
| cross-runtime-mirror-consistency | 005 | 0 | 2 | 2 | 7/10 |
| **TOTAL** | | **0** | **16** | **10** | |

**Provisional verdict**: CONDITIONAL (16 P1 findings remain)
