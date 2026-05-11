---
description: Audit skill, command, and agent description budgets through the interactive confirm workflow.
argument-hint: "[--json] [--top-n=N] [--fail-over=N] [--project-ceiling=N]"
allowed-tools: Read, Bash, Glob
---
<!-- skill_agent: system-spec-kit -->

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup (resolves all inputs). YAML owns execution.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase below and resolve: `execution_mode`, `json_output`, `top_n`, `fail_over`, `project_ceiling`
> 2. Load the corresponding YAML from `assets/`:
>    - Confirm: `doctor_skill-budget.yaml`
> 3. Execute the YAML workflow using those resolved values
>
> All content below is reference for the YAML workflow. Read-only command — no mutations.

## CONSTRAINTS

- **ONLY MODE ()**: this doctor command is always interactive by design; deleted mode suffixes are invalid.
- **READ-ONLY.** This command never writes files, never modifies skill/command/agent descriptions, never re-indexes the advisor.
- **DO NOT** dispatch any agent from this document.
- **YAML START CONDITION**: do not load YAML until ALL inputs are bound: `execution_mode`, `json_output`, `top_n`, `fail_over`, `project_ceiling`.

> **Format:** `/doctor:skill-budget` [flags]
> Example: `/doctor:skill-budget`

## GATE 3 STATUS: EXEMPT

Read-only audit; no spec folder required. Diagnostic output only.

---

# 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response when no mode suffix is given. Lightweight read-only discovery is allowed (count surfaces); then ask any unresolved questions and wait.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   - default -> execution_mode = "INTERACTIVE", yaml = "doctor_skill-budget.yaml"
   - No suffix -> execution_mode = "INTERACTIVE", yaml = "doctor_skill-budget.yaml" (confirm is the only supported mode)

2. PARSE flags from $ARGUMENTS:
   ├─ --json                → json_output = TRUE  (default FALSE)
   ├─ --top-n=N             → top_n = N           (default 10)
   ├─ --fail-over=N         → fail_over = N       (default unset)
   ├─ --project-ceiling=N   → project_ceiling = N (default 5600)
   └─ Defaults: json_output=FALSE, top_n=10, fail_over=unset, project_ceiling=5600

3. ASK with a single prompt only if required flags are unresolved.

4. WAIT only when an unresolved flag question was asked

5. SET STATUS: PASSED
```

**Phase Output:** `execution_mode`, `json_output`, `top_n`, `fail_over`, `project_ceiling`

---

# Skill/Command/Agent Description Budget Audit

Walks all project surfaces that feed Claude Code's available-skills metadata budget and reports per-item char counts, top-N bloated items, project total, and headroom under the configured ceiling.

```yaml
role: Read-only auditor for the description budget across skills/commands/agents
purpose: Detect drift before Claude Code silently drops descriptions from auto-discovery
action: Run audit_descriptions.py with the resolved flags; print or pipe report
operating_mode:
  workflow: single_phase
  read_only: true
  mutations: none
```

## 1. PURPOSE

Packet 083 trimmed 36 frontmatter descriptions when the project hit ~10,050 chars and Claude Code dropped 15 from auto-discovery. Without a permanent audit tool, the same drift will recur silently as new skills are added. This command provides the audit that 083 should have shipped. It is composable: `--json --fail-over=5600` is the recommended pre-commit / CI invocation.

Reference: see `.opencode/skills/sk-doc/assets/frontmatter_templates.md` § "Description Budget & Trim Style" for the trim style guide. The audit script reuses constants from `.opencode/skills/sk-doc/scripts/quick_validate.py`.

---

## 2. USER INPUT

```text
$ARGUMENTS
```

---

## 3. CONTRACT

**Inputs:** Optional mode suffix () and flags (`--json`, `--top-n=N`, `--fail-over=N`, `--project-ceiling=N`).
**Outputs:** Human-readable table OR JSON envelope; `STATUS=<OK|FAIL>` and exit code (non-zero when over `--fail-over` threshold OR when any item exceeds the 1,536-char hard cap).

---

## 4. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
| ----- | ---- | ------- | ------- |
| 0 | Audit | Run `audit_descriptions.py` with resolved flags | Report (text or JSON), exit code |

Single-phase by design. Read-only. No multi-step gates.

---

## 5. KEY BEHAVIORS

### Surfaces Audited

| Surface | Path glob | Frontmatter format |
| ------- | --------- | ------------------ |
| Skills | `.opencode/skills/<name>/SKILL.md` | YAML |
| Commands | `.opencode/commands/**/*.md` (excl. `assets/` and `scripts/`) | YAML |
| Agents | `.opencode/agents/*.md`, `.claude/agents/*.md`, `.gemini/agents/*.md` | YAML |
| Agents (Codex) | `.codex/agents/*.toml` | TOML `description = "..."` |

Agents are reported unique-by-name with a `mirrored: N surfaces` annotation when the same name appears across multiple runtime dirs (most do).

### Constants (single source of truth)

| Constant | Value | Reference |
| -------- | ----:| --------- |
| Per-skill soft target | 130 | `quick_validate.py` `DESCRIPTION_SOFT_TARGET_SKILL` |
| Per-command soft target | 110 | `quick_validate.py` `DESCRIPTION_SOFT_TARGET_COMMAND` |
| Per-item hard cap | 1,536 | `quick_validate.py` `DESCRIPTION_HARD_CAP` (Claude Code limit) |
| Project soft-ceiling | 5,600 | This script `--project-ceiling` default |
| Claude Code default budget | 8,000 | `SLASH_COMMAND_TOOL_CHAR_BUDGET` |

---

## 6. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt:

- **INTERACTIVE**: `.opencode/commands/doctor/assets/doctor_skill-budget.yaml`

The YAML workflow is a single phase that calls `audit_descriptions.py` with resolved flags and surfaces the report.

---

## 7. OUTPUT FORMATS

**Success (text mode):**
```
======================================================================
Skill/Command/Agent Description Budget Audit (Packet 086)
======================================================================
Items audited: <N> (skills/commands/agents)
Project total: <N> chars
Headroom: <N> chars under ceiling
Top <N> by length: <table>
STATUS=OK
```

**Success (--json):**
```json
{
  "totalChars": 4423,
  "projectSoftCeiling": 5600,
  "headroomChars": 1177,
  "items": [...],
  "hardFails": [],
  "overSoft": [...],
  "exitOver": false
}
```

**Failure (over fail-over threshold OR hard-fail item):**
```
... (report) ...
FAIL: project total <N> > fail_over threshold <N>
STATUS=FAIL ERROR="description budget exceeded"
```

---

## 8. EXAMPLES

```
/doctor:skill-budget                     # Run audit, print human report
/doctor:skill-budget --json              # JSON envelope to stdout
/doctor:skill-budget --fail-over=5600    # Non-zero exit when over ceiling
/doctor:skill-budget --top-n=20          # Show top 20 instead of default 10
/doctor:skill-budget --json --fail-over=5600  # Recommended CI / pre-commit form
```

---

## 9. RELATED COMMANDS

| Command | Relationship |
| ------- | ------------ |
| `/doctor:skill-advisor` | Tunes scoring tables; can run after a budget trim re-orders top recommendations |
| `/create:sk-skill` | Per-create-time validation already runs `quick_validate.py` (Tier 2 of packet 086) |
| `/memory:save` | Refresh canonical continuity after acting on audit findings |

---

## 10. NEXT STEPS

| Condition | Suggested Action |
| --------- | --------------- |
| `STATUS=OK`, project under ceiling | No action |
| One or more items `OVER-SOFT` | Trim per `frontmatter_templates.md` § Description Budget & Trim Style |
| Any item `HARD-FAIL` (>1,536) | Hard-trim immediately; the harness will refuse to register the item |
| Total over project ceiling | Open a trim packet (similar to packet 083) |

**ALWAYS** end with: "What would you like to do next?"
