---
title: "Implementation Summary: CLI Mode + Hub Persona-Injection Enforcement"
description: "Applied the P2 persona-injection contract to six mode SKILLs and the hub via a pre-written-block cli-devin build, verified tool-free by cline/DeepSeek (APPROVE 98/100), and reconciled by the orchestrator."
trigger_phrases:
  - "cli mode enforcement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/003-cli-mode-enforcement"
    last_updated_at: "2026-08-19T11:12:00Z"
    last_updated_by: "claude"
    recent_action: "6 modes + hub carry persona rule; cline APPROVE 98/100; cli-pi parity fixed"
    next_safe_action: "Author P4 sk-prompt alignment (004-sk-prompt-alignment)"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-003-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cli-mode-enforcement |
| **Completed** | 2026-08-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One persona-injection enforcement rule added to each of the six external-CLI mode `SKILL.md` files, plus two bullets in the hub `SKILL.md` — `13 insertions(+)`, 0 deletions across 7 files. Each mode rule states that mode's native-surface-vs-inline verdict from contract `§3`, resolves the persona runtime-aware per AGENTS.md §7, maps subtasks to the right agent, and references the canonical card.

- **`cli-claude-code` Rule 14** — NATIVE via `claude -p --agent <name>` (resolves `.claude/agents/<name>.md`); INLINE fallback on bare `-p`. Cites DESIGN_DISPATCH_MANIFEST `Rule 11`.
- **`cli-cursor` Rule 17** — NATIVE file-convention surface (`.cursor/agents` + `.claude/agents` mirror all 13 agents); INLINE fallback on bare `cursor-agent -p`.
- **`cli-devin` Rule 17** — NATIVE `run_subagent` (`.devin/agents/<name>/AGENT.md` mirror); INLINE fallback on bare `devin -p`.
- **`cli-opencode` Rule 18** — PARTIAL via a primary (`--agent orchestrate` → Task subagent); else INLINE.
- **`cli-codex` Rule 17** — NO native surface (`.codex/agents/*.toml` is TUI-only); INLINE mandatory.
- **`cli-pi` bullet 11** — NO native surface on `pi -p`; INLINE mandatory (given the failure-consequence clause in reconciliation for parity).
- **Hub** — one `✅ ALWAYS` bullet (persona on every dispatch; mechanic lives per-mode) + one `REFERENCES` bullet to the canonical contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Rule 17 (native `run_subagent`; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Rule 18 (partial via primary; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modify | Rule 14 (native `--agent`; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | Rule 17 (no native; inline mandatory) |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Rule 17 (native file-convention; inline fallback) |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Bullet 11 (no native; inline mandatory) |
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Modify | Hub ALWAYS bullet + REFERENCES bullet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dual-executor, dogfooded. The orchestrator pre-wrote the exact rule text per file from contract `§3`/`§7` (its design authority). `cli-devin` (Gemini 3.7 Flash @ high, `gemini-3-7-flash-high`) applied the seven insertions with the `markdown` agent persona inlined verbatim — dogfooding the exact rule this phase adds. The build ran `--permission-mode accept-edits` under `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 ... </dev/null`; the only rejected tool call was the executor's final `git diff` (bash is not auto-approved under `accept-edits`), which the orchestrator ran itself. An independent `cli-opencode`/cline dispatch (DeepSeek V4 Flash @ xhigh, `review` persona, run TOOL-FREE because the cline-pass transport leaks DeepSeek tool-call markup) verified each rule against contract `§3`. The orchestrator reconciled the one P2 finding and ran the authoritative gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Orchestrator pre-writes exact blocks; `cli-devin` inserts verbatim | Honors the plan-named build executor while keeping a weak model's error surface on shipped files near zero |
| Build persona = `markdown` | The work is scoped markdown/doc maintenance of `.md` skill files; dogfoods persona injection on the build dispatch itself |
| Verify runs tool-free | The cline-pass endpoint does not parse DeepSeek's tool-call format; inlining all source avoids the markup leak and returns a clean review |
| `cli-pi` rule as bullet 11, not a numbered rule | `cli-pi` ALWAYS uses bullets, not a numbered list — matching the file's own structure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Diff is pure insertion | PASS — `git diff --stat` = `13 insertions(+)`, 0 deletions, only the 7 target files |
| All 6 modes + hub carry the rule | PASS — `rg "persona"` + per-file diff inspection |
| Each verdict matches contract `§3` | PASS — independent cline/DeepSeek review, C1 PASS 7/7 |
| Cross-references correct | PASS — C4: card path depth + DESIGN_DISPATCH_MANIFEST Rule 11/14 exact |
| Independent tool-free review | PASS — APPROVE, 98/100, zero P0/P1, one P2 reconciled |
| `validate.sh --strict` | see below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Forward reference to the canonical card.** Every mode rule references `cli-prompt-quality-card.md` "Persona Injection", a section P4 (`004-sk-prompt-alignment`) creates. The reference is intentional and resolves before merge; per-folder `validate.sh` does not check cross-file link targets, so it does not block this phase.
2. **Verifier's baseline caveat resolved here.** The tool-free cline review flagged a MEDIUM caveat that it could not confirm each file's pre-insertion rule count. That is resolved deterministically by the orchestrator's scoped `git diff`: the inserted numbers (14/17/17/17/18/11) fit each file's actual ALWAYS list, and the diff is insertion-only.
<!-- /ANCHOR:limitations -->
