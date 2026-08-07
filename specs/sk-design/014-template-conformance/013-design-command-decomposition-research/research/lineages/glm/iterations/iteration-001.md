# Iteration 001 — INTENT_SIGNALS Co-occurrence Graph

**Focus:** Map which of the 17 INTENT_SIGNALS share resources (co-occur) and which never overlap, using RESOURCE_MAP as the evidence base.

## Method

Read `design-interface/SKILL.md` lines 114-154 (INTENT_SIGNALS + RESOURCE_MAP). Built a resource-sharing matrix: two intents "co-occur" if their RESOURCE_MAP entries share at least one file, or if a realistic prompt would score both above the ambiguity delta (weight 4, delta 1.0 per `select_intents`).

## Findings

### Resource-sharing clusters (CONFIRMED — file:line evidence)

**Cluster A — Core design process (always-together):**
- `DESIGN_PRINCIPLES` → `references/design-process/design-principles.md` [SKILL.md:136]
- `REGISTER_DIALS` → `references/design-process/brief-to-dials.md` [SKILL.md:138]
- `MECHANICAL_PREFLIGHT` → includes `brief-to-dials.md` [SKILL.md:142]

`brief-to-dials.md` is shared between REGISTER_DIALS and MECHANICAL_PREFLIGHT. Both are ALWAYS-loaded per the Resource Loading Levels table [SKILL.md:75-76]. These three intents are the load-bearing spine of every design task — they never operate independently.

**Cluster B — Motion family (always-together, gate-first ordering):**
- `MOTION_DECISION` → `animation-decision-framework.md` [SKILL.md:148]
- `MOTION_STRATEGY` → `animation-decision-framework.md` + `motion-strategy.md` + `corpus-map.md` + `sk-code-handoff.md` [SKILL.md:149]
- `MOTION_MICRO_INTERACTIONS` → `animation-decision-framework.md` + `micro-interactions.md` + `motion-pattern-cards.md` [SKILL.md:150]
- `MOTION_PRESENCE` → `animation-decision-framework.md` + `animate-presence-patterns.md` + `animate-presence-checklist.md` [SKILL.md:151]
- `MOTION_PERFORMANCE` → `animation-decision-framework.md` + `performance-reduced-motion.md` + `motion-performance-failure-card.md` [SKILL.md:152]
- `MOTION_ADVANCED_CRAFT` → `animation-decision-framework.md` + `advanced-craft.md` + `performance-reduced-motion.md` [SKILL.md:153]

All six MOTION_* intents share `animation-decision-framework.md` (the restraint gate). SKILL.md:218-222 mandates fixed-order sequencing: the restraint gate runs FIRST, then timing/easing, then micro-interactions, then presence, then performance, then advanced craft. This is a **sequential phase chain**, not a set of independent jobs. `performance-reduced-motion.md` is shared between MOTION_PERFORMANCE and MOTION_ADVANCED_CRAFT.

**Cluster C — Grounding/reference (co-occur on real-system tasks):**
- `REAL_SYSTEM_GROUNDING` → `design-inventory.md` [SKILL.md:145]
- `REAL_WORLD_REFERENCE` → `design-references-mcp.md` + `mobbin-tools.md` + `refero-tools.md` [SKILL.md:146]

No shared files between these two, but SKILL.md:266 (ALWAYS #8) couples them: "decide whether a real-world reference would sharpen the default to deviate from" runs after grounding. They are sequential phases of one grounding job, not independent commands.

### Non-co-occurring intent pairs (candidate seams)

**DESIGN_PRINCIPLES vs MOTION_DECISION:** No shared resources. `design-principles.md` is never in any MOTION_* RESOURCE_MAP entry. A prompt like "design a landing page" scores DESIGN_PRINCIPLES but not MOTION_DECISION. A prompt like "animate this hover state" scores MOTION_DECISION but not DESIGN_PRINCIPLES. **These never co-occur.**

**MECHANICAL_PREFLIGHT vs MOTION_*:** `mechanical-defaults.md` and `copy-and-mock-data.md` are never in any MOTION_* entry. The preflight card (`interface-preflight-card.md`) has a motion section (§10 per SKILL.md:222) but that is a check, not motion design. **Preflight and motion design are non-co-occurring.**

**REDESIGN_INTAKE vs MOTION_*:** `redesign-intake.md` is never in any MOTION_* entry. Redesign classification (greenfield/preserve/overhaul) is a static-system concern; motion comes later. **Non-co-occurring.**

**COPY_MOCK_DATA vs MOTION_*:** `copy-and-mock-data.md` appears only in COPY_MOCK_DATA and MECHANICAL_PREFLIGHT. Never in MOTION_*. **Non-co-occurring.**

**VISUAL_SYSTEM vs MOTION_*:** The entire `references/foundations/` tree (11 files) is VISUAL_SYSTEM-only [SKILL.md:147]. No MOTION_* intent loads any foundations reference. **VISUAL_SYSTEM and MOTION_* are non-co-occurring.**

## Candidate seams identified

1. **Motion vs static design** — the strongest seam. Six MOTION_* intents share one gate file and never share resources with DESIGN_PRINCIPLES, VISUAL_SYSTEM, REDESIGN_INTAKE, COPY_MOCK_DATA, or MECHANICAL_PREFLIGHT.
2. **Preflight vs design** — MECHANICAL_PREFLIGHT shares `brief-to-dials.md` with REGISTER_DIALS but its other two files (`mechanical-defaults.md`, `interface-preflight-card.md`) are preflight-only. Partial seam.
3. **VISUAL_SYSTEM vs the rest** — 11 foundations files are VISUAL_SYSTEM-exclusive, but VISUAL_SYSTEM keywords overlap heavily with DESIGN_PRINCIPLES ("color system", "design tokens", "dark mode"), so intent scoring would frequently select both. Weak seam.

## What was tried and failed

- Attempted to find a seam between VARIATION_DIVERSITY and DESIGN_PRINCIPLES: `variation-diversity.md` is VARIATION_DIVERSITY-only, but SKILL.md:265 (ALWAYS #7) mandates debias "when a brief asks for two or more" — it is a conditional phase of the design process, not an independent job. Not a seam.

## Novelty justification

First mapping of the actual resource-sharing graph. The motion/static seam is confirmed by zero shared files. The preflight seam is partial. The VISUAL_SYSTEM seam is weak due to keyword overlap. newInfoRatio: 1.0 (fully new — no prior iteration).

[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:114-154]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:218-222]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:265-266]
