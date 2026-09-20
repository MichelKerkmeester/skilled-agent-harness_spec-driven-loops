---
title: "P5 Objective Persona-Injection Sweep"
trigger_phrases: []
---
# P5 Objective Persona-Injection Sweep

Deterministic grep/audit across the two in-scope trees (`cli-external-orchestration`, `sk-prompt`) at worktree branch `skilled/v4.0.0.0`. Goal: prove every external-CLI dispatch surface documents + enforces persona injection, and no dispatch instruction sanctions a persona-less dispatch.

## Sweep 1 — persona-injection rule present in every mode + hub

| Surface | Rule present |
|---------|-------------|
| `cli-devin/SKILL.md` | ✓ (ALWAYS Rule 17) |
| `cli-opencode/SKILL.md` | ✓ (ALWAYS Rule 18) |
| `cli-claude-code/SKILL.md` | ✓ (ALWAYS Rule 14) |
| `cli-codex/SKILL.md` | ✓ (ALWAYS Rule 17) |
| `cli-cursor/SKILL.md` | ✓ (ALWAYS Rule 17) |
| `cli-pi/SKILL.md` | ✓ (ALWAYS bullet 11) |
| hub `SKILL.md` | ✓ (ALWAYS bullet + REFERENCES bullet) |

## Sweep 2 — canonical section + hub link

- `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` → `## 6. PERSONA INJECTION` present (1).
- hub `SKILL.md` → `Persona-injection contract (canonical)` REFERENCES bullet present (1).

## Sweep 3 — each mode rule cites the canonical card + "Persona Injection"

All six modes ✓ (`cli-prompt-quality-card.md` … "Persona Injection").

## Sweep 4 — negative proof

`rg` for any ALWAYS/NEVER guidance sanctioning a bare, persona-less dispatch (excluding the enforcement rule's own "never a bare task" / "a persona-less dispatch runs…" phrasing): **no rule sanctioning a persona-less dispatch found**. Example invocations in the HOW-IT-WORKS sections (e.g. `devin -p -- "<prompt>"`) are illustrative shape references, not instructions to omit the persona; the ALWAYS rule now governs every dispatch.

## Sweep 5 — thin cards inherit §6 by reference

All six `cli-*/assets/prompt-quality-card.md` thin cards delegate to the canonical card, so they inherit the new §6 Persona Injection by reference — no per-card edit needed (and none made).

## Gate

- `validate.sh --recursive --strict` on the packet: 5/5 folders PASSED, Errors:0 Warnings:0.
- Commit-time guards on the card edit (`check-prompt-quality-card-sync.sh`): PASS (tables not inlined, Tier-3 pointer-only, registry complete).

## Regression delta

- **Baseline (pre-packet):** 0 external-CLI dispatch surfaces documented/enforced persona injection; the discipline existed only for native in-runtime dispatch (`orchestrate.md` Agent Loading Protocol).
- **After:** 6/6 mode SKILLs + hub carry the enforcement rule; 1 canonical section in the card; 6/6 modes reference it; 6/6 thin cards inherit it. Docs-only additions to shipped skills — no routing/registry/behavior change; recursive validate clean; no functional regression.
