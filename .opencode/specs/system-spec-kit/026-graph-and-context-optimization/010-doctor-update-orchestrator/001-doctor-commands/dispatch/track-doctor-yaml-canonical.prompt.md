# Codex dispatch: Doctor YAML canonical-banner alignment + Markdown entrypoint cleanup

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7. The user just deleted 21 doctor mode YAMLs (all `_auto`, `_apply`, `_apply-confirm`, `_default` modes). Only `_confirm` (interactive, status-gated, prompts every mutation) remains for each command, plus the two `mcp_debug` / `mcp_install` operations.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands/`

Branch: stay on `main`. Do not branch.

## CANONICAL TEMPLATE (read first, treat as locked)

`.opencode/commands/improve/assets/improve_deep-agent-improvement_auto.yaml`
`.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml`

Both use the canonical banner + section pattern:

```yaml
# ─────────────────────────────────────────────────────────────────
# <COMMAND>: <PURPOSE> (<MODE>)
# ─────────────────────────────────────────────────────────────────
role: <one-line>
purpose: <one-line>
action: <pipeline phrase>

# ─────────────────────────────────────────────────────────────────
# OPERATING MODE
# ─────────────────────────────────────────────────────────────────
operating_mode: { ... }

# ─────────────────────────────────────────────────────────────────
# UPSTREAM ASSETS
# ─────────────────────────────────────────────────────────────────
upstream_assets: { ... }   # spec/ADR pointers from 001-doctor-commands

# ─────────────────────────────────────────────────────────────────
# USER INPUTS
# ─────────────────────────────────────────────────────────────────
user_inputs: { ... }

# ─────────────────────────────────────────────────────────────────
# FIELD HANDLING
# ─────────────────────────────────────────────────────────────────
field_handling: { ... }

# ─────────────────────────────────────────────────────────────────
# MUTATION BOUNDARIES
# ─────────────────────────────────────────────────────────────────
mutation_boundaries: { ... }   # allowed_targets + forbidden_targets

# ─────────────────────────────────────────────────────────────────
# WORKFLOW
# ─────────────────────────────────────────────────────────────────
workflow: { phase_1_*: ..., phase_2_*: ... }

# ─────────────────────────────────────────────────────────────────
# OUTPUT FORMAT
# ─────────────────────────────────────────────────────────────────
output_format: |
  ...
```

Banner separators are exactly `# ─` (75 chars wide) followed by `# SECTION NAME` followed by another `# ─`.

## TASK 1: Restructure these 5 YAMLs to canonical banner pattern

Files (each currently lacks proper banner sections — keep all existing content; just add the visual banners + reorganize sections in canonical order):

1. `.opencode/commands/doctor/assets/doctor_causal-graph_confirm.yaml` (currently 2 banners — header only)
2. `.opencode/commands/doctor/assets/doctor_cocoindex_confirm.yaml` (0 banners)
3. `.opencode/commands/doctor/assets/doctor_deep-loop_confirm.yaml` (0 banners)
4. `.opencode/commands/doctor/assets/doctor_update_confirm.yaml` (0 banners)
5. `.opencode/commands/doctor/assets/doctor_skill-budget_confirm.yaml` (uses non-canonical schema — `command:` / `mode:` / `inputs:` / `phases:` — REWRITE to canonical schema while preserving the audit_script and audit-prompt logic)

For files 1-4: the canonical sections (role/purpose/action/operating_mode/upstream_assets/user_inputs/field_handling/mutation_boundaries/workflow/output_format) are already present. Just add the `# ─` banner separators in canonical order between them. Do NOT delete or rename any keys; just visual structure.

For file 5 (skill-budget_confirm): rewrite to use `role:` / `purpose:` / `action:` / `operating_mode:` / `user_inputs:` / `field_handling:` / `workflow:` keys instead of `command:` / `mode:` / `inputs:` / `phases:`. Map the existing `inputs.execution_mode/json_output/top_n/fail_over/project_ceiling` to `user_inputs:` block. Map existing `phases.phase_0_audit/phase_1_checkpoint/...` to `workflow:` block. Read-only nature → `mutation_boundaries:` with `allowed_targets: []` (read-only) and `forbidden_targets: ["**/*"]` plus a `read_only: true` invariant. Leave the audit_script reference + frontmatter_templates.md doc reference intact (move into `upstream_assets:`).

## TASK 2: Verify already-canonical YAMLs (5 files) — no edits unless drift detected

Skim these and confirm they already match the banner pattern. Touch ONLY if they fail the banner check:

- `.opencode/commands/doctor/assets/doctor_code-graph_confirm.yaml` (22 banners ✓)
- `.opencode/commands/doctor/assets/doctor_memory_confirm.yaml` (20 banners ✓)
- `.opencode/commands/doctor/assets/doctor_skill-advisor_confirm.yaml` (24 banners ✓)
- `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` (16 banners ✓)
- `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` (16 banners ✓)

## TASK 3: Update 10 Markdown entrypoints to remove deleted-mode references

Files:
- `.opencode/commands/doctor/causal-graph.md`
- `.opencode/commands/doctor/cocoindex.md`
- `.opencode/commands/doctor/code-graph.md`
- `.opencode/commands/doctor/deep-loop.md`
- `.opencode/commands/doctor/memory.md`
- `.opencode/commands/doctor/skill-advisor.md`
- `.opencode/commands/doctor/skill-budget.md`
- `.opencode/commands/doctor/update.md`
- `.opencode/commands/doctor/mcp_debug.md`
- `.opencode/commands/doctor/mcp_install.md`

For each:

1. Read the current file
2. Remove ANY mention of `:auto`, `:apply`, `:apply-confirm`, `:default` modes — these are now invalid invocations
3. Remove references to deleted YAML asset paths (`doctor_*_auto.yaml`, `doctor_*_apply.yaml`, `doctor_*_apply-confirm.yaml`, `doctor_*_default.yaml`)
4. Document `:confirm` as the ONLY mode for the 8 mode-suffixed commands; document `mcp_debug` / `mcp_install` as standalone operations with no mode suffix
5. Update the "When to use which mode" section (if present) to reflect: only one mode (interactive `:confirm`) — explain that the doctor commands are always interactive by design
6. Preserve all other content (purpose, when to use, examples, gotchas)

## HARD CONSTRAINTS

1. Do NOT touch the 21 already-deleted YAML paths — they're gone, not just hidden.
2. Stay on `main`. Do not branch.
3. Do NOT modify spec packet docs (`001-doctor-commands/{spec,plan,tasks,checklist,decision-record,implementation-summary,resource-map}.md`) — that is a follow-on packet's scope.
4. Do NOT modify `migration-manifest.json`.
5. After all 15 file edits, run `python3 -c "import yaml; yaml.safe_load(open('FILE'))"` per YAML to confirm valid syntax.
6. Final report should list:
   - 5 YAMLs restructured (banner-aligned)
   - 5 YAMLs verified-as-already-canonical
   - 10 Markdown entrypoints cleaned of deleted-mode references
   - YAML syntax validation summary

## VERIFICATION COMMAND

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Banner count per surviving YAML (should each have >=14 banners after fix)
for f in .opencode/commands/doctor/assets/*.yaml; do
  n=$(grep -c "^# ─" "$f")
  echo "$(basename "$f"): $n banner separators"
done

# YAML syntax validation
for f in .opencode/commands/doctor/assets/*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "OK: $(basename $f)" || echo "FAIL: $(basename $f)"
done

# Markdown entrypoint sanity — should NOT mention :auto / :apply / :apply-confirm / :default
for f in .opencode/commands/doctor/*.md; do
  drift=$(grep -cE ":(auto|apply|apply-confirm|default)" "$f")
  echo "$(basename "$f"): $drift hits of deleted mode names"
done
```

Target: every YAML reports >=10 banners; every YAML is syntactically valid; every Markdown reports 0 drift.

## OUTPUT REQUIREMENT

After completion, print:
1. List of files modified (5 YAMLs + 10 Markdown = 15 files)
2. Banner-count audit (paste the output of the banner-count loop)
3. YAML syntax audit (paste the OK/FAIL list)
4. Markdown drift audit (paste the drift counts)
5. If any file remains drifted: short note explaining why
