# Iteration 010 — Cross-Cutting View: Ranking All Candidate Seams by Value-to-Cost

**Focus:** Consolidate all candidate seams identified across iterations 1-9, rank each by value-to-cost with explicit confidence, and separate confirmed findings from inferred ones. This is the final broadening angle before synthesis — not the synthesis itself.

## Candidate seams inventory

### Seam 1: Motion vs static design (the strongest candidate)

**Evidence for:** Six MOTION_* intents share one gate file and never share resources with DESIGN_PRINCIPLES, VISUAL_SYSTEM, REDESIGN_INTAKE, COPY_MOCK_DATA, or MECHANICAL_PREFLIGHT [iter-001]. Motion is conditionally independent — a motion-only prompt can skip STEP 0-4 [iter-007]. The retired `/interface:motion` command was the previous home for this cluster [iter-009].

**Evidence against:** SKILL.md:48 declares motion conditionally dependent on static hierarchy. The 010-motion-merge consolidation is still in progress and spent effort removing this exact command [iter-009]. Re-adding it costs ~9 files, ~440 metadata lines, 8 constraint updates [iter-003]. No demonstrated harm is caused by the single-command shape [iter-006]. The process-branching middle path (Option D) addresses the gap at 1/9 the file cost [iter-005].

**Value:** Low — addresses a conditional independence that the mode already handles via intent scoring, with a process-flow gap fixable by a SKILL.md edit.
**Cost:** High — ~9 files, ~440 metadata lines, 8 constraint updates, 4 runtime mirrors, reversal of an incomplete consolidation.
**Confidence:** High (0.9) that this is NOT worth doing as a command split.

### Seam 2: Preflight vs design

**Evidence for:** MECHANICAL_PREFLIGHT shares `brief-to-dials.md` with REGISTER_DIALS but its other two files are preflight-only [iter-001]. Preflight is a post-build phase [iter-002].

**Evidence against:** Preflight is Phase 5 of one job, not a separable job [iter-002]. It assumes the direction was already set in the same workflow [SKILL.md:82]. The preflight card's motion section assumes the restraint gate already ran [SKILL.md:222]. A separate preflight command could not audit arbitrary external surfaces — it is designed as the final gate of this workflow.

**Value:** Very low — no demonstrated independence; preflight is structurally a phase.
**Cost:** High — same per-command overhead as Seam 1.
**Confidence:** High (0.95) that this is NOT worth doing.

### Seam 3: VISUAL_SYSTEM vs the rest

**Evidence for:** 11 foundations files are VISUAL_SYSTEM-exclusive [iter-001]. VISUAL_SYSTEM keywords overlap with DESIGN_PRINCIPLES but the resource sets are disjoint.

**Evidence against:** VISUAL_SYSTEM is an internal lane, not an argument lane [metadata:158-162]. It is "static visual system inside the workflow" — a phase, not a job [iter-002]. The keyword overlap means intent scoring frequently co-selects both, which is correct (color system design needs both principles and foundations). No demonstrated harm from the current arrangement.

**Value:** Very low — no independence; co-loading is correct behavior.
**Cost:** High.
**Confidence:** High (0.95) that this is NOT worth doing.

### Seam 4: Redesign intake vs direction

**Evidence for:** REDESIGN_INTAKE has its own resource (`redesign-intake.md`) and classifies greenfield/preserve/overhaul [iter-001].

**Evidence against:** It is Phase 0 — a pre-condition gate that feeds directly into `direction` [iter-002]. It is already an argument lane (`--mode redesign`) [metadata:141-144]. No demonstrated harm.

**Value:** Very low — already addressable as a lane; no independence.
**Cost:** High.
**Confidence:** High (0.95) that this is NOT worth doing.

### Seam 5: Handoff vs design

**Evidence for:** REAL_UI_LOOP has its own resources (`real-ui-loop.md`, `sk-code-handoff.md`) [iter-001].

**Evidence against:** It is Phase 6 — the handoff phase after design is done [iter-002]. Already an argument lane (`--mode handoff`) [metadata:164-168]. No demonstrated harm.

**Value:** Very low — already addressable as a lane; no independence.
**Cost:** High.
**Confidence:** High (0.95) that this is NOT worth doing.

## Non-split recommendations identified across iterations

### Recommendation A: Fix stale `/interface:motion` references [iter-006]

**Demonstrated problem:** `design.md:27` and `design-reference.md:27` reference a retired command, creating a live routing bug.
**Smallest fix:** Remove the 2 stale `Prefer /interface:motion` rows.
**Cost:** ~15 minutes, 2 files.
**Confidence:** High (0.95) — confirmed by file:line evidence.

### Recommendation B: Fix `handoff` vs `build` naming drift [iter-006]

**Demonstrated problem:** `command-metadata.json:167` says `--mode build` but the grammar [metadata:73] says `--mode handoff`.
**Smallest fix:** Change `build` to `handoff` in the surface description (or vice versa, aligning the grammar).
**Cost:** ~5 minutes, 1 line.
**Confidence:** High (0.95) — confirmed by file:line evidence.

### Recommendation C: SKILL.md content reorganization for word-cap relief [iter-006]

**Demonstrated problem:** SKILL.md is at 4991/5000 words (99.8% capacity, 9 words headroom).
**Smallest fix:** Move the Motion Design Workflow section [SKILL.md:218-222] and/or the 6 MOTION_* RESOURCE_MAP entries to a `references/motion/SKILL.md` sub-document referenced from the main SKILL.md. This is a content move, not a command split.
**Cost:** ~2 hours, 2 files (create sub-document, trim main SKILL.md).
**Confidence:** Medium (0.7) — the word-cap pressure is confirmed, but the exact savings depend on how much content can be moved without breaking the router's inline INTENT_SIGNALS/RESOURCE_MAP (which must stay in the main SKILL.md for the router to parse them).

### Recommendation D: Mode-internal process branching for motion-only prompts [iter-005, iter-007]

**Demonstrated problem:** Motion-only prompts still run STEP 0-4 (the static design process) even when only MOTION_* intents score. This is unnecessary overhead for motion-only tasks.
**Smallest fix:** Add a conditional branch in SKILL.md's Phase Detection: if only MOTION_* intents score above threshold, skip to the Motion Design Workflow section. This is a SKILL.md edit, not a command split.
**Cost:** ~1 hour, 1 file edit.
**Confidence:** Medium (0.65) — the gap is confirmed by intent-scoring analysis [iter-008], but the process-flow compensation (STEP 4 self-critique catches motion issues) means the gap may not produce visible user-facing harm. The gap is an efficiency issue, not a correctness issue.

## Confirmed vs inferred findings

### Confirmed (file:line evidence)
- 17 INTENT_SIGNALS, 6 MOTION_* intents sharing one gate file [SKILL.md:114-154]
- All 17 lanes are phases, not jobs [metadata:127-234, SKILL.md:60-68]
- Per-command cost: ~9 files, ~50 KB, ~440 metadata lines [file listing, metadata]
- 4 hard machine constraints [surface-check.mjs:358,916,983,1249]
- 2-command topology is at constraint complexity minimum [surface-check.mjs analysis]
- Stale `/interface:motion` in design.md:27 and design-reference.md:27 [file:line]
- `handoff` vs `build` drift in metadata:167 [file:line]
- 5000-word cap pressure (4991/5000) [spec.md context]
- 010-motion-merge is "In progress" [spec.md:157]
- No intent-scoring collision produces wrong routing [iter-008 test cases]

### Inferred (would need additional evidence to confirm)
- Motion-only prompts running STEP 0-4 is "unnecessary overhead" — inferred from the intent-scoring analysis; no user complaint or observable failure confirms this
- Process branching (Option D) would solve the motion gap — inferred from the design; not tested
- SKILL.md content reorganization would relieve word-cap pressure — inferred; exact savings depend on how much content is movable without breaking the inline router

## What was tried and failed

- Searched for a 6th candidate seam (copy/mock-data vs the rest). COPY_MOCK_DATA has its own resource but is a content gate inside the workflow [metadata:176-180], not a separable job. Not a seam.

## Novelty justification

First cross-cutting ranking of all candidate seams with value-to-cost and confidence. The key finding: no seam has a value-to-cost ratio that justifies a split, and 4 non-split recommendations address the demonstrated harms at 1/100th the cost. newInfoRatio: 0.6 (partially new — consolidates and ranks prior findings; the ranking itself is new).

[SOURCE: all prior iterations + cited file:line evidence]
