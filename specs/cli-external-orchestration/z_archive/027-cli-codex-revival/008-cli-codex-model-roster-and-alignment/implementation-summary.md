---
title: "Implementation Summary: cli-codex model roster + codex-hook doc alignment"
description: "Completed summary of the cli-codex roster expansion: four fast-tier models with per-model ceilings, a 20/20 live model×effort matrix, six shipped docs plus a 1.6.0.0 changelog, and a stale codex-surface claim corrected."
trigger_phrases: ["cli-codex model roster summary", "codex roster status"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped 1.6.0.0 roster docs; 20/20 live matrix passed"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 008-cli-codex-model-roster-and-alignment |
| **Status** | Complete |
| **Level** | 3 |
| **Predecessor** | `../007-codex-hook-parity` |
| **Started** | 2026-07-14 |
| **Completed** | 2026-07-14 |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

Delivered:
- **Live verification matrix** — all twenty model×effort cells dispatched through `codex exec` (ChatGPT OAuth, `service_tier=fast`, read-only, ~5s latency), 20/20 PASS, captured in the CX-002 playbook (ADR-003).
- **Four-model roster** — `SKILL.md` (bumped `1.5.0.0` → `1.6.0.0`), `README.md`, and `references/cli_reference.md` now document `gpt-5.5` (default), `gpt-5.6-luna`, `gpt-5.6-terra`, and `gpt-5.6-sol` on the `fast` tier with per-model reasoning-effort ceilings (ADR-001).
- **Extended effort scale** — `max` and `ultra` added above `xhigh` in the effort-value tables and the `assets/prompt_templates.md` model-override note.
- **CX-002 reframe** — the `gpt_5_5_model_lock.md` scenario now verifies "default pin + roster verification"; filename and id kept, index + global precondition #6 updated (ADR-002).
- **Changelog** — new `changelog/v1.6.0.0.md`.
- **Alignment fix** — the stale "`.codex/` is not present" claim in `sk-code/code-opencode/assets/checklists/agent_authoring.md` corrected to reflect the live `.codex/` mirror.

### Live matrix (model / effort cells)

| Model | Effort levels verified | Ceiling | Cells |
|---|---|---|---|
| `gpt-5.5` (default) | low · medium · high · xhigh | `xhigh` | 4/4 |
| `gpt-5.6-luna` | low · medium · high · xhigh · max | `max` | 5/5 |
| `gpt-5.6-terra` | low · medium · high · xhigh · max | `max` | 5/5 |
| `gpt-5.6-sol` | low · medium · high · xhigh · max · ultra | `ultra` | 6/6 |
| **Total** | | | **20/20** |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work runs in an isolated git worktree (`.worktrees/0038-codex-hook-parity`, branch `wt/0038-codex-hook-parity`); node validators run from the main tree against worktree paths because the worktree lacks the gitignored `dist/`. Verification came first: the twenty-cell matrix was dispatched read-only and every cell recorded before a single roster line was written, so no documented model ID is a phantom. The per-model ceiling contract was then expressed once and mirrored into each consuming doc. The stale codex-surface claim was corrected independently in the `code-opencode` checklist. No runtime code, codex hook adapter, or installer was touched — those belong to the sibling `007-codex-hook-parity`.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Document the full four-model roster with per-model effort ceilings; keep `gpt-5.5 medium` as the default | Accepted |
| ADR-002 | Reframe the CX-002 playbook in place (keep filename `gpt_5_5_model_lock.md` + id `CX-002`) | Accepted |
| ADR-003 | Verify every model×level live before documenting it (20/20 matrix first) | Accepted |

See `decision-record.md` for full ADR documentation.
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|---|---|---|
| `validate.sh --strict` | Pass | Errors: 0 (closeout run) |
| Live model×effort matrix | Pass | `codex exec`, `service_tier=fast`, read-only: 20/20 cells returned correctly |
| Per-model ceilings hold live | Pass | `gpt-5.5` 4/4 (≤`xhigh`), `gpt-5.6-luna` 5/5 (≤`max`), `gpt-5.6-terra` 5/5 (≤`max`), `gpt-5.6-sol` 6/6 (only model reaching `ultra`) |
| Roster consistent across docs | Pass | Same four models + ceilings in `SKILL.md` `1.6.0.0`, `README.md`, `cli_reference.md` |
| Default dispatch unchanged | Pass | `SKILL.md` still resolves "nothing specified" to `gpt-5.5 medium fast` |
| CX-002 reframed without index break | Pass | Filename `gpt_5_5_model_lock.md` + id `CX-002` kept; index + precondition #6 updated |
| Stale `.codex/` claim corrected | Pass | `agent_authoring.md` now describes the live mirror (`hooks.json`, `config.toml`, `.codex/agents/*.toml`) |
| Out-of-scope surfaces untouched | Pass | No codex hook adapter, installer, or `.codex/hooks.json` changed |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

1. **`gpt-5.6-terra` has no config profile.** It is confirmed callable directly via `-m gpt-5.6-terra`, and the docs say so, but there is no `[profiles.*]` entry for it. Defining a repo-level profile is a noted out-of-scope follow-up.
2. **`gpt-5.6-sol` profile caps below its ceiling.** The `sol-verify` config profile pins `xhigh`, while the model itself reaches `ultra`; the docs document the model ceiling (`ultra`) and note the profile pin so a caller can reach `ultra` by naming the model with `-c model_reasoning_effort="ultra"` rather than the profile.
3. **CX-002 filename/title drift.** The scenario file stays `gpt_5_5_model_lock.md` while its content now verifies the full roster; this mild drift was accepted (ADR-002) to keep the playbook index and `CX-002` references intact.
4. **Reindex owed.** The renamed/expanded cli-codex docs still need a memory reindex once the primary checkout reconciles to origin/v4; this is a follow-up, not a blocker.
<!-- /ANCHOR:limitations -->
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

The roster is a single per-model ceiling contract (`gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`) grounded in a live 20-cell callability matrix and mirrored into every consuming doc. The default dispatch path (`gpt-5.5 medium fast`) is untouched, so the change is purely additive for existing callers; the GPT-5.6 models are opt-in per dispatch by naming the model within its documented ceiling. The stale codex-surface claim fix is an independent doc correction with no coupling to the roster work.
<!-- /ANCHOR:architecture-summary -->
