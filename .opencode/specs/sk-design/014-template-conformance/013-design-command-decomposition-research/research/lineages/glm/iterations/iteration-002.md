# Iteration 002 — Lane Classification: Separable Jobs vs Sequential Phases

**Focus:** Classify the 5 argument lanes and 12 internal lanes as genuinely separable jobs versus phases of one job.

## Evidence base

- `design.md:60-69` — the 5 argument lanes and 12 internal/hidden lanes
- `command-metadata.json:127-234` — the `tasks` array with lane/class/surface
- `design-interface/SKILL.md:60-68` — Phase Detection (STEP 0 through STEP 4)

## Findings

### The 5 argument lanes

| Lane | class | Intent | Separable job or phase? |
|------|-------|--------|--------------------------|
| `direction` | argument | DESIGN_PRINCIPLES | **Phase 1 of one job.** STEP 0-4 [SKILL.md:60-68] is a single sequential process: ground → brainstorm → critique → build → self-critique. `direction` is the default entry into this process. |
| `directions` | argument | VARIATION_DIVERSITY | **Phase 1b.** SKILL.md:265 mandates debias "when a brief asks for two or more." It is a conditional branch of the same STEP 0-4 process, not a separate job. You cannot produce debiased directions without first grounding the subject. |
| `redesign` | argument | REDESIGN_INTAKE | **Phase 0.** Redesign intake classifies greenfield/preserve/overhaul [SKILL.md:84, metadata:141-144] and protects URLs/nav/fields/legal copy. It runs BEFORE the design process, but it feeds directly into `direction`. It is a pre-condition gate, not an independent deliverable. |
| `preflight` | argument | MECHANICAL_PREFLIGHT | **Phase 5 (post-build).** SKILL.md:82, 247: the preflight card runs "before shipping" — after the direction is set and built. It is the final gate of the same job, not a separate job. You cannot preflight a surface that has no direction. |
| `handoff` | argument | REAL_UI_LOOP | **Phase 6 (post-build).** metadata:164-168: "real UI loop and sk-code handoff manifest." SKILL.md:81: "producing or iterating on real UI." It is the handoff phase after the design is done. Not independent. |

**Verdict:** All 5 argument lanes are **sequential phases of one job** (shape interface direction → critique → preflight → handoff). None is a genuinely separable job. The lane selector (`--mode`) chooses which phase to emphasize, not which independent job to run.

### The 12 internal/hidden lanes

| Lane | class | Intent | Separable? |
|------|-------|--------|------------|
| `quality` | internal | UX_QUALITY | Phase — quality floor checks run during/after build [SKILL.md:80] |
| `visual-system` | internal | VISUAL_SYSTEM | Phase — static system decisions inside the workflow [metadata:158-162] |
| `register` | internal | REGISTER_DIALS | Phase — always-load calibration, "not a chooser" [metadata:170-174] |
| `copy-gate` | internal | COPY_MOCK_DATA | Phase — content delivery gate inside the workflow [metadata:176-180] |
| `grounding` | internal | REAL_SYSTEM_GROUNDING | Phase — reuse-before-generate grounding phase [metadata:182-186] |
| `transform` | internal | TRANSFORM_APPLICATION | Phase — transform verb already routed here [metadata:188-192] |
| `reference` | hidden | REAL_WORLD_REFERENCE | Phase — real-world reference critique tooling [metadata:194-198] |
| `motion-decision` | internal | MOTION_DECISION | Phase — restraint gate before timing [metadata:200-204] |
| `motion-strategy` | internal | MOTION_STRATEGY | Phase — timing/easing after gate [metadata:206-210] |
| `motion-micro-interactions` | internal | MOTION_MICRO_INTERACTIONS | Phase — feedback patterns [metadata:212-216] |
| `motion-presence` | internal | MOTION_PRESENCE | Phase — enter/exit choreography [metadata:218-222] |
| `motion-performance` | internal | MOTION_PERFORMANCE | Phase — compositor safety [metadata:224-228] |
| `motion-advanced-craft` | internal | MOTION_ADVANCED_CRAFT | Phase — late-stage polish [metadata:230-234] |

**Verdict:** All 12 internal/hidden lanes are **phases of one job.** Every one says "inside the workflow" in its surface description. The six motion lanes are a fixed-order sub-chain (gate → strategy → micro → presence → performance → craft), which is explicitly a phase sequence, not independent jobs.

### The one possible exception: motion as a separable job

A prompt like "animate this hover state" or "add a reduced-motion equivalent to my page transition" does NOT need the static design process (STEP 0-4). It needs only the motion sub-chain. This is the one case where a lane cluster operates independently of the core design job.

However, SKILL.md:48 says: "If the static hierarchy is unclear before motion can help, resolve that first through this mode's static-system work rather than choreographing around an unclear layout." Motion is subordinate to static design even when motion is the primary ask. The mode itself declares the dependency.

## Candidate seam from lanes

Only **motion** has a case for being a separable job: a motion-only prompt can skip STEP 0-4. But the mode's own contract (SKILL.md:48) says static hierarchy must be resolved first, making motion conditionally dependent, not independent.

## What was tried and failed

- Checked whether `preflight` could be a separable job (independent pre-delivery review of someone else's design). SKILL.md:82 says preflight is "the final mechanical pass before shipping" — it assumes the direction was already set in this same workflow. The preflight card's motion section (§10) assumes the restraint gate already ran [SKILL.md:222]. It is not designed to audit arbitrary external surfaces. Not separable.

## Novelty justification

Confirmed that all 17 lanes are phases, not jobs, with one conditional exception (motion-only prompts). This directly answers Q2. newInfoRatio: 0.9 (mostly new — confirms the phase hypothesis with per-lane evidence).

[SOURCE: .opencode/commands/interface/design.md:60-69]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:127-234]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:60-68]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:48]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:82]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:222]
