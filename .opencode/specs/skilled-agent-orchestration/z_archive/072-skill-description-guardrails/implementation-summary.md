---
title: "Implementation Summary: Skill Description Budget Guardrails"
description: "Three-tier guardrails shipped: sk-doc authoring docs encode the trim style, quick_validate.py warns at create time, /doctor:skill-budget surfaces project-wide drift. Audit currently flags 14 over-soft items (incl. 6 untrimmed agents) — proposed 087 follow-on."
trigger_phrases:
  - "086 implementation summary"
  - "skill description guardrails summary"
  - "doctor skill-budget summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/072-skill-description-guardrails"
    last_updated_at: "2026-05-06T13:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Three-tier guardrails shipped"
    next_safe_action: "Open packet 087 to trim 6 untrimmed agent descriptions"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/commands/doctor/skill-budget.md"
      - ".opencode/commands/doctor/scripts/audit_descriptions.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-086"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill Description Budget Guardrails

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 086-skill-description-guardrails |
| **Completed** | 2026-05-06 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three-tier guardrails preventing the packet 083 description-bloat regression: (Tier 1) sk-doc authoring docs that bake in the trim style guide, (Tier 2) `quick_validate.py` description-length checks during `/create:sk-skill` and `/create:agent` flows, (Tier 3) a new read-only `/doctor:skill-budget` audit command that surfaces project-wide drift on demand or in CI.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` | Modified | Resolved the 200/300 contradiction; added "Description Budget & Trim Style" subsection with constants, drop/keep rules, stack-agnostic rule, sk-code 545→125 before/after example |
| `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | Modified | Fixed line 75 "150-300 chars" to match Tier 1 numbers; cross-link callout |
| `.opencode/skills/sk-doc/references/specific/skill_creation.md` | Modified | Updated frontmatter table at line 397; rewrote Pitfall 1 with bloated-description case + trim rules |
| `.opencode/skills/sk-doc/assets/agent_template.md` | Modified | Cross-link callout for description budget |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modified | Cross-link callout for description budget + mode-suffix preservation note |
| `.opencode/skills/sk-doc/scripts/quick_validate.py` | Modified | Added `DESCRIPTION_SOFT_TARGET_SKILL=130`, `DESCRIPTION_SOFT_TARGET_COMMAND=110`, `DESCRIPTION_HARD_CAP=1536`, `check_description_length()` helper, `--description-soft-target` CLI flag, auto-detect via parent path, soft-warn / hard-fail wired into `validate_skill()` |
| `.opencode/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | Created | 12-assertion test suite for description-length budget. Fixtures (under-target / at-target / over-soft / over-hard) are built in a `tempfile.TemporaryDirectory` at runtime — no persistent SKILL.md files under `.opencode/skills/` that runtime scanners (Codex, Claude Code, opencode) would treat as real skills. |
| `.opencode/commands/create/assets/create_sk_skill_confirm.yaml` | Modified | Step 4 now references description-budget check; added `description_soft_target_skill/command/hard_cap` thresholds + `description_length_warnings` output |
| `.opencode/commands/create/assets/create_agent_confirm.yaml` | Modified | Step 5b now runs quick_validate on agent frontmatter; added `description_budget` block + `description_length_warnings` output |
| `.opencode/commands/doctor/skill-budget.md` | Created | New `/doctor:skill-budget` entrypoint mirroring skill-advisor.md structure (read-only, 2 modes) |
| `.opencode/commands/doctor/assets/doctor_skill-budget_auto.yaml` | Created | Single-phase audit workflow |
| `.opencode/commands/doctor/assets/doctor_skill-budget_confirm.yaml` | Created | Audit + checkpoint workflow |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Created | Walks 4 surfaces (skills, commands, opencode/claude/gemini agents YAML + codex agents TOML), reuses Tier 2 constants, emits text + JSON, supports `--fail-over=N` |

### Runtime mirroring

The plan's T013 ("4 runtime symlink mirrors") proved unnecessary: `.claude/commands`, `.gemini/prompts`, and `.codex/prompts` are all directory-level symlinks to `.opencode/command`. The new `/doctor:skill-budget` entrypoint is auto-visible to all four runtimes. Confirmed: harness session-skills reminder lists `doctor:skill-budget` immediately after the file was written.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

### Approach

Layer-cake guardrails. Each tier is independently load-bearing and degrades gracefully without the others. Tier 1 docs declare the constants in prose; Tier 2 code mirrors them as Python module constants; Tier 3 reuses Tier 2's constants by `sys.path`-importing `quick_validate.py`. Single source of truth in code; doc-side numbers must stay in sync (validated visually, not enforced — small risk).

### Sequence

| Step | Action | Result |
|------|--------|--------|
| 1 | Plan-mode exploration (3 Explore agents in parallel) | Mapped current state across all three layers; zero existing description-budget enforcement |
| 2 | Plan-mode design (1 Plan agent) | Validated 3-tier split, confirmed numbers, identified hidden risks (multiline regex, TOML parsing, advisor boost-token interaction) |
| 3 | Spec folder scaffold (spec.md / plan.md / tasks.md) | Strict-validate-clean structure |
| 4 | Tier 1 docs (5 files, 0 code) | Resolved 200/300 contradiction; encoded trim style + stack-agnostic rule + sk-code 545→125 example |
| 5 | Tier 2 code (quick_validate.py + 4 fixtures + test runner) | 12/12 assertions pass; soft-warn vs hard-fail vs no-action all verified at boundaries |
| 6 | Tier 2 wire-in (2 YAMLs) | DQI fix-loop now references description-budget check |
| 7 | Tier 3 audit script | Walked all 4 surfaces; revealed actual project total (6,085 chars) and 14 over-soft items |
| 8 | Tier 3 entrypoint + workflow YAMLs | Read-only command live in harness immediately (verified via session reminder) |

### Constants (single source of truth, packet 086)

| Constant | Value | Defined in |
|----------|------:|------------|
| Per-skill soft target | 130 | `quick_validate.py` `DESCRIPTION_SOFT_TARGET_SKILL` |
| Per-command soft target | 110 | `quick_validate.py` `DESCRIPTION_SOFT_TARGET_COMMAND` |
| Per-item hard cap | 1,536 | `quick_validate.py` `DESCRIPTION_HARD_CAP` (Claude Code internal limit) |
| Project soft-ceiling | 5,600 | `audit_descriptions.py` `PROJECT_SOFT_CEILING_DEFAULT` |
| Claude Code default budget | 8,000 | Documented constant; `SLASH_COMMAND_TOOL_CHAR_BUDGET` |

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Standalone `/doctor:skill-budget` (not extension of `/doctor:skill-advisor`) | Routing concerns ≠ metadata concerns. skill-advisor is heavyweight (graph reindex, scoring tables); skill-budget is read-only and CI-friendly. Separating keeps each tool single-purpose. |
| Soft-warn at 130/110, hard-fail at 1536 | Soft targets match packet 083 actuals (avg 126 / avg 104) plus a few chars headroom. Hard cap is the Claude Code internal limit — any item over 1,536 fails to register; that's a hard error, not a warning. |
| Audit reuses `quick_validate.py` constants via `sys.path` import | Single source of truth in Python code. Doc-side numbers must stay in sync with code (small drift risk; documented). |
| Agents reported unique-by-name with `mirrored: N surfaces` annotation | Most agents are mirrored across .opencode/.claude/.gemini/.codex with identical text. Counting each surface separately would inflate the budget. Unique-by-name with mirror count is the most useful drift signal. |
| TOML parsing uses `tomllib` (Python 3.11+) with regex fallback | `.codex/agents/*.toml` is the only non-YAML surface. `tomllib` is in stdlib; regex fallback covers older Pythons defensively. |
| Skipped T013 (per-file runtime mirror symlinks) | Discovery: `.claude/commands`, `.gemini/prompts`, `.codex/prompts` are already directory-level symlinks. New entrypoint auto-mirrored. T013 was redundant. |
| Did NOT trim agent descriptions in this packet | Audit surfaced 6 over-soft agents (debug 306, multi-ai-council 179, code 178, deep-review 158, prompt-improver 144, orchestrate 134). Scope creep risk; opening packet 087 as the proper trim. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Evidence |
|-----------|--------|----------|
| Unit: quick_validate length check | PASS | `test_quick_validate_086.py` 12/12 assertions pass (under-target, at-target, over-soft, over-hard, helper contract) |
| Smoke: audit script runs | PASS | `audit_descriptions.py` walks 50 items (16 skills, 23 commands, 11 agents); reports total 6,085 chars |
| Behavioral: --fail-over exit codes | PASS | `--fail-over=4000` exits 1 (over threshold); `--fail-over=10000` exits 0 (under threshold) |
| Strict: spec folder validate.sh | PASS | After implementation-summary.md written: 0 errors / 0 warnings / RESULT: PASSED |
| Live: harness picks up new command | PASS | session-skills reminder lists `doctor:skill-budget` immediately after entrypoint MD was written |
| Drift detection (Tier 3 raison d'être) | PASS | Audit surfaced 14 over-soft items including 6 untrimmed agents — exactly the signal the tool exists to provide |

### Project budget after this packet

- **Before 086** (post-083 baseline): 4,423 chars project descriptions + ~1,554 unaccounted (agents not in 083 audit) = 5,977 chars
- **After 086**: 6,085 chars (delta +108 from this packet's own additions: `doctor:skill-budget` entrypoint frontmatter + a few minor edits surfacing in commands)
- **Headroom under 5,600 ceiling**: -485 chars (NEGATIVE — over ceiling but well under the 8,000 hard default; acceptable as the audit's first job is to surface this)
- **Headroom under 8,000 default**: 1,915 chars (no skills will be dropped at session start)

The negative headroom against the 5,600 soft ceiling is by design: it's the signal that triggers the proposed packet 087 agent-description trim. The audit detected this drift, which is the entire point of Tier 3.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Doc-side and code-side constants are not auto-synced.** Tier 1 docs hard-code `130/110/1,536/5,600`; Tier 2/3 code define them as Python constants. If a future tuning packet changes one, the other can drift. Mitigation: a dedicated test in 087 (or a follow-on) could grep the doc files for the numeric strings and assert they match `quick_validate.py` constants. Out of scope here.
2. **Tier 2 wire-in for `/create:agent` references but does not yet automatically invoke `quick_validate.py`.** The YAML now lists the call as a Step 5b activity, but actual execution depends on the @create agent following the activity list. A future packet should add an explicit non-blocking script invocation node so it runs deterministically rather than depending on agent compliance.
3. **Cross-checking description tokens vs `lib/scorer/lanes/explicit.ts` boost anchors is deferred.** Risk acknowledged in plan: a future trim could remove a routing-keyword anchor and silently degrade ranking. `--check-boost-anchors` flag was scoped out for first-implementation simplicity.
4. **Agent descriptions surfaced by audit (14 over-soft items) are NOT trimmed in this packet.** The audit's job is to surface drift. The trim is the proposed follow-on packet 087. Holding scope tight here.
5. **Built-in budget consumption (~2,400-char estimate)** remains opaque. `--include-builtins-estimate` flag is documented in the plan as a future addition; not implemented here.
6. **Codex's per-skill description cap is 1,024 chars** (observed during this packet from a Codex CLI scan error: `invalid description: exceeds maximum length of 1024 characters`). This is stricter than Claude Code's 1,536-char hard cap. The 130/110 soft target sits comfortably under both. The constant `DESCRIPTION_HARD_CAP = 1536` is preserved (Claude Code is the budget owner), but a follow-on packet may want to add a `DESCRIPTION_CODEX_CAP = 1024` and adjust `audit_descriptions.py` to surface a separate Codex-fail bucket. Right now: any item ≤ 1,536 will pass quick_validate but might still fail Codex's stricter scanner if it falls between 1,024 and 1,536. No item in the project is currently in that band.

<!-- /ANCHOR:limitations -->
