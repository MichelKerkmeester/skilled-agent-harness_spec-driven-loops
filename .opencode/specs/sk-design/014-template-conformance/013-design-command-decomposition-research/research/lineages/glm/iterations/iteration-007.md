# Iteration 007 — Motion Lanes: Separable Job or Fixed-Order Phases?

**Focus:** Deep-dive the six motion lanes to determine whether they constitute a separable job (candidate for a split) or a fixed-order phase chain (not a candidate).

## Evidence

- `SKILL.md:218-222` — Motion Design Workflow (gate-first ordering)
- `SKILL.md:148-153` — MOTION_* RESOURCE_MAP entries
- `SKILL.md:127-132` — MOTION_* INTENT_SIGNALS
- `metadata:200-234` — six motion lane entries, all class "internal"
- `design.md:63-68` — six motion lane surface descriptions, all "inside the workflow"

## The fixed-order chain

SKILL.md:220 mandates: "run the restraint gate before any timing or easing choice." SKILL.md:222 adds: "the pre-flight card's motion section (§10) assumes the gate already ran."

The ordering is:

```
MOTION_DECISION (restraint gate)
    ↓ if gate passes
MOTION_STRATEGY (timing/easing/material)
    ↓
MOTION_MICRO_INTERACTIONS (hover/focus/active/loading)
    ↓ or parallel
MOTION_PRESENCE (enter/exit, AnimatePresence)
    ↓
MOTION_PERFORMANCE (reduced-motion, compositor safety)
    ↓
MOTION_ADVANCED_CRAFT (origin-aware, late polish)
```

Every MOTION_* intent except MOTION_DECISION loads `animation-decision-framework.md` [SKILL.md:148-153] — the restraint gate file. This means the gate is a **pre-condition for all motion work**, not a peer of the other motion intents. The other five intents are downstream phases that depend on the gate's outcome.

## Are the six motion lanes a separable job?

**Argument for separable:** A prompt like "add a reduced-motion equivalent to my page transition" or "choreograph the exit animation for this modal" does not need the static design process (STEP 0-4). It needs only the motion sub-chain. The motion intents have zero resource overlap with DESIGN_PRINCIPLES, VISUAL_SYSTEM, REDESIGN_INTAKE, COPY_MOCK_DATA, or MECHANICAL_PREFLIGHT (iteration 001 finding).

**Argument against separable:** SKILL.md:48 says: "If the static hierarchy is unclear before motion can help, resolve that first through this mode's static-system work rather than choreographing around an unclear layout." The mode declares that motion is **conditionally dependent** on static design — if the layout is unclear, motion cannot proceed independently. This is not a hard dependency (motion CAN proceed if the layout is already clear), but it is a declared dependency.

**Resolution:** The motion sub-chain is a **conditionally independent job**. It is independent when the static hierarchy is already resolved (the common case for motion-only requests like "animate this hover"). It is dependent when the static hierarchy is unclear (which the mode's contract says to resolve first). This is the one case where a lane cluster can operate as a standalone job.

## Would a command split help here?

If motion were a separate command (`/interface:motion` — which was the retired command), a user could invoke it directly for motion-only tasks. But:

1. **The retired command is still referenced as stale** in `design.md:27` and `design-reference.md:27` (iteration 006 finding). The retirement was supposed to remove this command, and the residue is a demonstrated bug. Re-adding the command would make the stale references correct again — but it would also reverse the consolidation that the program just completed.

2. **The 010-motion-merge packet is still "In progress"** [spec.md:157]. The consolidation has not finished. Re-adding `/interface:motion` before the consolidation completes would create a conflicting state: one packet is trying to retire the command while another would be re-adding it.

3. **The mode's own contract handles the conditional independence** via intent scoring (iteration 005, Option C): a motion-only prompt scores only MOTION_* intents and loads only motion resources. The gap is at the process level (STEP 0-4 still runs), not the resource level. Option D (process branching, iteration 005) addresses this gap with a SKILL.md edit, not a command split.

## What was tried and failed

- Checked whether the six motion lanes could be split into TWO commands (e.g., "motion-decision" as a gate command, "motion-execution" as the rest). This fails because the gate's output (pass/fail + motion budget) is consumed immediately by MOTION_STRATEGY — they are a single transaction, not two independent jobs. Splitting them would require a handoff between commands, which the contract forbids: "Public commands never invoke public commands" [interface-command-contract.test.mjs:71].

## Novelty justification

First conditional-independence analysis of the motion sub-chain. The finding that motion is conditionally independent but addressable via process branching (not a command split) refines the iteration 005 conclusion. newInfoRatio: 0.7 (partially new — refines prior findings with the dependency analysis).

[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:48,127-153,218-222]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:200-234]
[SOURCE: .opencode/commands/interface/design.md:63-68]
[SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:71]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/spec.md:157]
