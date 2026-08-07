# Research Synthesis — composer lineage

**Session:** `fanout-composer-1785175007816-pn5cco` · **Executor:** cli-cursor · composer-2.5  
**Iterations:** 10 (max-iterations stop) · **Avg newInfoRatio:** 0.87  
**Date:** 2026-07-27

---

## Executive Verdict

**Do not split `/interface:design` into additional public commands.** The consolidation's middle path — five `--mode` argument lanes plus twelve internal/hidden lanes backed by `command-metadata.json` `tasks[]` and mode-internal `INTENT_SIGNALS` routing — already decomposes the work without multiplying the command surface. Re-splitting would reverse a just-completed program phase, cost roughly five to six files and full sibling-graph rewiring per new command, and fix no demonstrated routing failure.

The smallest valuable changes address **confirmed** doc drift: remove stale `/interface:motion` discriminators, align `handoff` vs `build` lane naming, and continue in-SKILL.md deduplication under the 5000-word hard cap.

---

## 1. INTENT_SIGNALS / RESOURCE_MAP Co-occurrence (Q4)

### Always-together (not command seams)

| Cluster | Intents | Shared resources | Evidence |
|---------|---------|------------------|----------|
| **Baseline** | All 17 | `DEFAULT_RESOURCE`: design-principles, register, context-loading-contract | [SKILL.md:112](.opencode/skills/sk-design/design-interface/SKILL.md) |
| **Motion pipeline** | 6 MOTION_* | `animation-decision-framework.md` (all six); `performance-reduced-motion.md` (PERFORMANCE + ADVANCED_CRAFT) | [SKILL.md:148-153](.opencode/skills/sk-design/design-interface/SKILL.md) |
| **Preflight bridge** | MECHANICAL_PREFLIGHT + REGISTER_DIALS | `brief-to-dials.md` | [SKILL.md:142-138](.opencode/skills/sk-design/design-interface/SKILL.md) |
| **Content gate bridge** | MECHANICAL_PREFLIGHT + COPY_MOCK_DATA | `copy-and-mock-data.md` | [SKILL.md:142-143](.opencode/skills/sk-design/design-interface/SKILL.md) |
| **Handoff bridge** | MOTION_STRATEGY + REAL_UI_LOOP | `sk-code-handoff.md` | [SKILL.md:141,149](.opencode/skills/sk-design/design-interface/SKILL.md) |

### Never co-occur in RESOURCE_MAP (candidate seams — with caveat)

118 intent pairs share zero resources (e.g. REAL_WORLD_REFERENCE || VISUAL_SYSTEM, MECHANICAL_PREFLIGHT || MOTION_DECISION, VARIATION_DIVERSITY || REDESIGN_INTAKE). **Confirmed:** pairwise disjoint maps exist. **Inferred:** these are conditional-load boundaries, not job boundaries — the creation contract still runs register → brief → creative → critique → proof → handoff as one job, unioning intents as keywords hit ([SKILL.md:174-180](.opencode/skills/sk-design/design-interface/SKILL.md)).

### Keyword collisions (intent scoring)

| Keyword | Intents | Routing impact |
|---------|---------|----------------|
| `redesign` | DESIGN_PRINCIPLES, REDESIGN_INTAKE | Both score; REDESIGN_INTAKE adds preserve-constraint refs when `--mode redesign` |
| `existing design system` | REAL_UI_LOOP, REAL_SYSTEM_GROUNDING | Union load; no command switch |
| `reduced motion` | UX_QUALITY, MOTION_PERFORMANCE | Union load; command stays `/interface:design` |

Router keeps intents within ambiguity delta and unions resources ([SKILL.md:105-107](.opencode/skills/sk-design/design-interface/SKILL.md)). **No confirmed evidence** of wrong *command* selection from collisions.

---

## 2. Lane Taxonomy (Q1)

### Five argument lanes — job variants, not separate commands

| Lane | Intent | Job shape | Separable? |
|------|--------|-----------|------------|
| `direction` (default) | DESIGN_PRINCIPLES | Invent distinctive direction | Variant of one creative job |
| `directions` | VARIATION_DIVERSITY | Debias multiple options | Same job + debias procedure |
| `redesign` | REDESIGN_INTAKE | Reshape with preserve constraints | Same job + intake overlay |
| `preflight` | MECHANICAL_PREFLIGHT | Terminal mechanical gate | **Phase** (Proof), not new command |
| `handoff` | REAL_UI_LOOP | sk-code build manifest | **Phase** (Deliver), not new command |

[SOURCE: command-metadata.json:127-168](.opencode/skills/sk-design/command-metadata.json) · [design.md:60](.opencode/commands/interface/design.md) · [creation-contract.md:57-69](.opencode/skills/sk-design/shared/creation-contract.md)

### Twelve internal/hidden lanes — sequential phases

`quality`, `visual-system`, six `motion-*`, `register`, `copy-gate`, `grounding`, `transform`, `reference` are workflow phases inside the nine-stage contract, explicitly "not surfaced and not selectable" ([design.md:61-69](.opencode/commands/interface/design.md)). **Not command candidates.**

Motion internal lanes are **fixed-order phases** after the restraint gate ([SKILL.md:218-222](.opencode/skills/sk-design/design-interface/SKILL.md)) — splitting them would recreate the retired `/interface:motion` command the program just removed ([010-motion-merge/spec.md:63-67](.opencode/specs/sk-design/014-template-conformance/010-motion-merge/spec.md)).

---

## 3. Split Cost (Q2)

Per new public command (template: `/interface:design-reference`):

| Cost item | Count / constraint |
|-----------|-------------------|
| Command doc | 1 |
| YAML workflows (auto + confirm) | 2 |
| Presentation asset | 1 |
| `command-metadata.json` entry | ~150-250 lines |
| `mode-registry.json` row | 1 if new mode (registry is 1:1 mode:command today) |
| Runtime mirror (`.claude/`) | 1+ |
| **Validator binds** | `next` non-empty; `preferSiblingWhen` exact sibling set; `typicallyBefore` ⊆ `next`; `handoff.nextOptions` = `next` |
| Test rosters | `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs` |

[SOURCE: design-command-surface-check.mjs:357-360,916-917,978-983,1247-1248](.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs)

**Quantified minimum per command:** ~5-6 files + metadata + full sibling-graph revalidation across all interface commands. Three hypothetical splits ≈ **15-18 files** and high regression risk — against consolidation that spent effort *removing* this overhead ([spec.md:60-64](.opencode/specs/sk-design/014-template-conformance/013-design-command-decomposition-research/spec.md)).

---

## 4. Middle Paths (Q3)

The decomposition the research asks for **already exists**:

1. **`--mode` argument lanes** — public selector ([design.md:3](.opencode/commands/interface/design.md))
2. **`tasks[]` machine lanes** — 17 INTENT_SIGNALS with argument/internal/hidden class ([command-metadata.json:126-234](.opencode/skills/sk-design/command-metadata.json))
3. **Mode-internal routing** — INTENT_SIGNALS + RESOURCE_MAP + procedure cards ([SKILL.md:104-180](.opencode/skills/sk-design/design-interface/SKILL.md))
4. **Transform verbs** — taskProjections (bolder, quieter, distill, delight) without new commands ([command-metadata.json:236-292](.opencode/skills/sk-design/command-metadata.json))

Splitting would duplicate this layering while breaking `mode-registry.json`'s one-command-per-workflow-mode contract ([mode-registry.json:35-55](.opencode/skills/sk-design/mode-registry.json)).

---

## 5. Evidence of Harm (Q5)

| Failure mode | Status | Evidence |
|--------------|--------|----------|
| Stale `/interface:motion` discriminator | **Confirmed** | [design.md:27](.opencode/commands/interface/design.md), [design-reference.md:27](.opencode/commands/interface/design-reference.md); known T005a in 011-retirement-residue |
| SKILL.md 5000-word cap pressure | **Confirmed** | 4991 words (`package_skill.py --check`); 5235→4991 uncommitted dedup after motion merge |
| `handoff` vs `build` lane naming drift | **Confirmed** | [design.md:3](.opencode/commands/interface/design.md) vs [command-metadata.json:167](.opencode/skills/sk-design/command-metadata.json) |
| `auditFrame` stale in mode-registry | **Confirmed** | [mode-registry.json:27-33](.opencode/skills/sk-design/mode-registry.json) |
| Intent collisions causing wrong command | **Not demonstrated** | Collisions widen in-mode loads only |
| Preflight requests routed to wrong command | **Not demonstrated** | — |
| Operators confused by monolith | **Not demonstrated** | No playbook/test failure cited |

**Speculative (labelled):** SKILL.md size feels like a monolith → **rejected** as split justification; cap is packaging, fixed by dedup not command multiplication ([spec.md hard constraint](.opencode/specs/sk-design/014-template-conformance/013-design-command-decomposition-research/spec.md)).

---

## Ranked Recommendations (value-to-cost)

| Rank | Recommendation | Demonstrated problem | Cost | Confidence |
|------|----------------|---------------------|------|------------|
| **1** | Remove stale `Prefer /interface:motion` rows from `design.md` and `design-reference.md` | Retired command still in live discriminator | ~15 min, 2 files | **High** |
| **2** | Align `command-metadata.json` handoff lane surface from `--mode build` to `--mode handoff` | Naming drift vs command doc | ~5 min, 1 file | **High** |
| **3** | Continue SKILL.md prose dedup under 5000-word cap (in-progress working-tree pattern) | Validator at 4991/5000 words | ~1-2 hrs, 1 file | **High** |
| **4** | Remove `auditFrame` / audit wording from `mode-registry.json` transformVerbRouting | Stale post-audit-retirement metadata | ~30 min, 1-2 files + tests | **Medium** |
| **5** | Enrich `--mode` documentation in presentation asset (when to use each lane) | Inferred: lane discoverability | ~1 hr, 1 file | **Medium** (inferred benefit) |
| **6** | Add advisor/playbook scenario for preflight-only vs direction prompts | Inferred: lane routing clarity | ~2 hrs, playbook + fixtures | **Low-Medium** (inferred) |

---

## Not Worth Doing

| Proposal | Why rejected |
|----------|--------------|
| Split `/interface:design` because SKILL.md is large | No demonstrated routing failure; split does not shrink mode packet; violates hard constraint |
| Re-expose `/interface:motion` | Reverses 010-motion-merge; stale discriminator is the actual bug |
| `/interface:preflight` as standalone command | `--mode preflight` already works; audit fold was intentional |
| `/interface:directions` or `/interface:redesign` | Job variants of same creative task; lanes suffice |
| Split on RESOURCE_MAP non-co-occurrence alone | Conditional loading ≠ separable jobs |
| New modes to host split commands | Reintroduces 6-mode hub complexity consolidation removed |

---

## Confirmed vs Inferred Summary

**Confirmed (file/command evidence):** motion RESOURCE_MAP cluster; lane taxonomy in command-metadata; validator cost constraints; stale motion discriminator; word count 4991/5000; handoff/build naming drift; middle path already implemented via lanes.

**Inferred (would need operator/playbook data):** lane discoverability gaps; whether keyword collisions ever cause wrong procedure card selection in practice.

---

## Convergence

- **Stop reason:** max_iterations (10/10)
- **Early convergence:** Not acted on; iterations 8-10 broadened harm-evidence and seam-viability angles
- **Lineage artifacts:** `iterations/iteration-001.md` … `iteration-010.md`, `deep-research-state.jsonl`, `research.md` (this file)
