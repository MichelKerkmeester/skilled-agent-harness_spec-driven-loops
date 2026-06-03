---
title: "Resource Map — sk-prompt-small-model ↔ cli-* prompt-knowledge architecture"
status: converged
date: 2026-06-03
---

# Resource Map — prompt-knowledge architecture (Layers 1–3)

A navigable index of every file the research touched, its role, its single-ownership status, and
the consolidated remediation item (C1–C10) that affects it. Paths are relative to repo root
`.opencode/skills/`.

## Layer 1 — `sk-prompt` (framework engine, forkable)

| Path | Role | Status | Touched by |
|------|------|--------|-----------|
| `sk-prompt/SKILL.md` | Defines the **closed 7-framework set** (`:38`, matrix `:257-265`) — RCAF/COSTAR/RACE/CIDI/TIDD-EC/CRISPE/CRAFT. STAR is **not** here (correct). | canonical | — (reference for C3) |
| `sk-prompt/assets/cli_prompt_quality_card.md` | **Canonical fast-path card**: framework table, CLEAR check, single precedence list + Tier-3 trigger prose (`:82-83`). The one source the 5 cli cards mirror. | canonical | C1 (pointer target) |
| `sk-prompt/references/patterns_evaluation.md` | Generic framework definitions + CLEAR scoring. | canonical | — |
| `sk-prompt/references/depth_framework.md` | DEPTH methodology. | canonical | — |

## Layer 2 — `sk-prompt-small-model` (per-model hub)

| Path | Role | Status | Touched by |
|------|------|--------|-----------|
| `sk-prompt-small-model/assets/model-profiles.json` | **Canonical registry** — per-model `recommended_frameworks` (primary/fallback/avoid/density/status) + `executors[]`. The DATA source. **Do not move.** | canonical | C9 (completeness check) |
| `sk-prompt-small-model/SKILL.md` | Hub front-door: dispatch matrix (`:112-123`), loading levels, ALWAYS/NEVER. `:150` lists STAR among sk-prompt frameworks (**phantom**); `§3 :131-133` holds a divergent new-provider checklist. | needs fix | **C3**, **C8** |
| `sk-prompt-small-model/references/models/_index.md` | Always-loaded profile index. `:21` swe-1.6 row mis-columns `STAR fallback`. | needs fix | **C4** |
| `references/models/swe-1.6.md` | Gold-standard profile (correct mechanics deferral `:182-184`). But `:84` falsely says "registry names…STAR as fallback" (contradicts own `:40-41`). | needs fix | **C3** |
| `references/models/minimax-m3.md` | Profile. `:124-135` embeds full `opencode run` wrapper (hub→mechanics leak). | needs fix | **C5** |
| `references/models/mimo-v2.5-pro.md` | Profile. `:143-153` embeds full `opencode run` wrapper (hub→mechanics leak). | needs fix | **C5** |
| `references/models/minimax-2.7.md` | Profile (empirical, benchmark 120/003). | ok | — |
| `references/models/deepseek-v4-pro.md` | **Cluster** clone (default-unverified). Card↔profile dead-spot. | cluster | **C6** |
| `references/models/kimi-k2.6.md` | **Cluster** clone. Card↔profile dead-spot. | cluster | **C6** |
| `references/models/qwen3.6.md` | **Cluster** clone + **sole discovery orphan** (cli-opencode-exclusive, no trigger). | cluster | **C6**, **C7** |
| `references/models/glm-5.1.md` | **Cluster** clone. Card↔profile dead-spot. | cluster | **C6** |
| `references/pattern-index.md` | Pattern→location index + new-provider checklist `§4 (:66-77)` (omits profile/_index/matrix rows → zero-weight entries). | needs fix | **C8** |
| `sk-prompt-small-model/graph-metadata.json` | Discovery metadata. minimax/mimo in `trigger_phrases` but missing from `intent_signals` + `enhances[].context`; `last_updated_at` frozen 2026-05-18. | needs fix | **C10** |

## Layer 3 — `cli-*` executors (mechanics only)

| Path | Role | Status | Touched by |
|------|------|--------|-----------|
| `cli-devin/SKILL.md` | Mechanics. `:368` precedence Tier-3 **matches** canonical (hybrid). `:191,:372` restate RCAF/STAR/BUILD (craft leak). | partial fix | **C2** |
| `cli-opencode/SKILL.md` | Mechanics. Precedence Tier-3 `:315` **drifted**. | needs fix | **C1** |
| `cli-codex/SKILL.md` | Mechanics. Precedence Tier-3 `:357` **drifted**. | needs fix | **C1** |
| `cli-gemini/SKILL.md` | Mechanics. Precedence Tier-3 `:310` **drifted**. | needs fix | **C1** |
| `cli-claude-code/SKILL.md` | Mechanics. Precedence Tier-3 `:351` **drifted**. | needs fix | **C1** |
| `cli-opencode/assets/prompt_quality_card.md` | Card. **Exemplar** — explicitly delegates craft (`:8-14`). Bundles deepseek/kimi/qwen/glm into a dir-only pointer (`:25`). | partial | **C6** (links) |
| `cli-devin/assets/prompt_quality_card.md` | Card. Links all 4 cluster models directly; holds the SWE-1.6 contract. | ok | C6 (reference) |
| `cli-opencode/graph-metadata.json` | Discovery. `trigger_phrases` carry minimax/mimo but not deepseek/kimi/qwen/glm. | needs fix | **C7** |

## Guard & automation

| Path | Role | Status | Touched by |
|------|------|--------|-----------|
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Sync guard. Checks only framework + CLEAR tables across 5 cards. Blind to SKILL.md, trigger prose, card↔profile links, registry fidelity. **Manual-only** (no CI/hook). | needs fix | **C9** |
| CI / hook config (`.github/workflows`, hooks) | No entry runs the guard today. | missing | **C9** |

## Research packet (this folder)

| Path | Role |
|------|------|
| `research/research.md` | Synthesis (this research's primary deliverable). |
| `research/resource-map.md` | This file. |
| `research/iterations/iteration-00{1..5}.md` | Per-iteration reports (summary + full account-2 plan-file report). |
| `research/deep-research-state.jsonl` | Accumulating state + operator-verification records. |

## Keystone → item map

- **K1 (pointer-ization):** C1, C2 — depends on C3.
- **K2 (guard + CI):** C8 → C9 — depends on C1, C8.
- **K3 (cluster treatment):** C6, C7 — C7 needs the dispatch-matrix confirmation.
- Standalone: C3 (→C4 tail), C5, C10.
