# Research Synthesis: Should /interface:design Be Split?

## Lineage
- **Session ID:** fanout-glm-1785175007816-pn5cco
- **Executor:** cli-devin (glm-5-2)
- **Iterations:** 10 (forced; convergence before iteration 10 treated as telemetry only)
- **Stop reason:** max_iterations reached

## Verdict

**Not worth doing.** Splitting `/interface:design` into smaller commands is not justified by the evidence. No candidate seam has a value-to-cost ratio that clears the hard constraint (fixes a demonstrated current problem, is the smallest change that does so, states its cost). The one structural gap — motion-only prompts running the full static design process — is addressable by a mode-internal process-branching edit at 1/9th the file cost of a command split. The three demonstrated harms (stale references, naming drift, word-cap pressure) are all fixable with edits smaller than a split, and none is caused by the single-command shape.

---

## Ranked Recommendations (by value-to-cost)

### 1. Fix stale `/interface:motion` references — HIGH VALUE, TRIVIAL COST

**Confidence: High (0.95)**

**Demonstrated problem:** `design.md:27` and `design-reference.md:27` reference `/interface:motion`, a retired command. A user following the discriminator would try to invoke a command that does not exist — a live routing bug.

**Smallest fix:** Remove the two `Prefer /interface:motion when...` rows from `design.md:27` and `design-reference.md:27`.

**Cost:** ~15 minutes, 2 files, 2 line removals.

**Why it's the smallest change:** The references are consolidation residue (011-retirement-residue identified this as T005a). Removing them completes the retirement that 010-motion-merge started. No command split, no metadata change, no constraint propagation.

**Evidence:** [design.md:27], [design-reference.md:27], [SKILL.md:276], [README.md:67], [011-retirement-residue/tasks.md:58]

### 2. Fix `handoff` vs `build` naming drift — HIGH VALUE, TRIVIAL COST

**Confidence: High (0.95)**

**Demonstrated problem:** `command-metadata.json:167` says `--mode build: real UI loop and sk-code handoff manifest` but the argument grammar [metadata:73] declares `--mode direction|directions|redesign|preflight|handoff`. The lane label is `handoff` [metadata:165]; the surface says `build`. A user typing `--mode build` would get an unrecognized value.

**Smallest fix:** Change `build` to `handoff` in the surface string at `command-metadata.json:167`.

**Cost:** ~5 minutes, 1 line.

**Evidence:** [command-metadata.json:164-168, 73]

### 3. SKILL.md content reorganization for word-cap relief — MEDIUM VALUE, LOW COST

**Confidence: Medium (0.7)**

**Demonstrated problem:** design-interface/SKILL.md is at 4991/5000 words (99.8% capacity, 9 words of headroom). Any future addition requires a compensating cut. The consolidation moved ~200-400 words of motion content into this file.

**Smallest fix:** Move the Motion Design Workflow section [SKILL.md:218-222] and/or the motion reference descriptions [SKILL.md:310-319] to a `references/motion/SKILL.md` sub-document, keeping the inline INTENT_SIGNALS and RESOURCE_MAP entries (which the router must parse) in the main file. This is a content move within the same mode, not a command split.

**Cost:** ~2 hours, 2 files (create sub-document, trim main SKILL.md).

**Caveat:** The exact savings depend on how much prose can be moved without breaking the inline router. The INTENT_SIGNALS and RESOURCE_MAP blocks [SKILL.md:114-154] must stay in the main SKILL.md. The savings come from moving the prose descriptions (Motion Design Workflow, reference index entries) to the sub-document. Estimated savings: 150-300 words, buying ~3-6% headroom.

**Why not a command split:** The word cap is a SKILL.md constraint, not a command constraint. A command split would move content to a new SKILL.md but at the cost of ~9 new files and ~440 metadata lines. A content reorganization achieves the same word-cap relief at 1/9th the file cost.

**Evidence:** [SKILL.md:218-222, 310-319], spec.md context (5234→4991 trim)

### 4. Mode-internal process branching for motion-only prompts — MEDIUM VALUE, LOW COST

**Confidence: Medium (0.65)**

**Demonstrated problem:** Motion-only prompts (e.g., "animate this hover state") score only MOTION_* intents but still run STEP 0-4 (the static design process: ground → brainstorm → critique → build → self-critique). This is unnecessary overhead for tasks that only need the motion sub-chain.

**Smallest fix:** Add a conditional branch in SKILL.md's Phase Detection [SKILL.md:60-68]: if only MOTION_* intents score above threshold (no DESIGN_PRINCIPLES, REDESIGN_INTAKE, or VISUAL_SYSTEM hit), skip to the Motion Design Workflow section [SKILL.md:218]. This is a SKILL.md edit, not a command split.

**Cost:** ~1 hour, 1 file edit.

**Caveat:** The gap is confirmed by intent-scoring analysis (iteration 008), but the process-flow compensation (STEP 4 self-critique catches motion issues) means it may not produce visible user-facing harm. The gap is an efficiency issue, not a correctness issue. The mode's own contract [SKILL.md:48] says static hierarchy should be resolved first if unclear — the branch would need to respect this by checking whether the static hierarchy is already resolved before skipping.

**Evidence:** [SKILL.md:48, 60-68, 106-107, 114-132, 218-222]

---

## Not Worth Doing

### Split motion out as `/interface:motion` — LOW VALUE, HIGH COST

**Confidence: High (0.9) that this is not worth doing.**

**Why rejected:**
1. **No demonstrated harm caused by the single-command shape.** The three confirmed harms (stale refs, naming drift, word cap) are consolidation residue and metadata bugs, not structural flaws of having one command. All are fixable with edits smaller than a split.
2. **Reverses an incomplete consolidation.** 010-motion-merge is "In progress" [spec.md:157]. Re-adding `/interface:motion` before the consolidation completes creates a conflicting state. The reversal costs strictly more than the consolidation's sunk cost (iteration 009).
3. **The motion sub-chain is conditionally dependent, not independent.** SKILL.md:48 declares that static hierarchy must be resolved first if unclear. Motion is independent only when the layout is already resolved — the mode's own contract handles this.
4. **The middle path (process branching) addresses the gap at 1/9th the file cost.** Option D from iteration 005 solves the motion-only process overhead with a SKILL.md edit, not 9 new files.
5. **All six motion lanes are fixed-order phases, not independent jobs.** The restraint gate runs before timing/easing, which runs before micro-interactions, etc. (iteration 007). Splitting them into one command does not make them independent — they are still a sequential chain.

**Cost if pursued:** ~9 files, ~50 KB, ~440 metadata lines, 8 constraint field updates, 4 runtime mirrors, test updates, plus content move-back from design-interface to a new design-motion packet.

### Split preflight out as `/interface:preflight` — VERY LOW VALUE, HIGH COST

**Confidence: High (0.95) that this is not worth doing.**

**Why rejected:** Preflight is Phase 5 of one job — the final mechanical gate before shipping [SKILL.md:82]. It assumes the direction was already set in the same workflow. Its motion section (§10) assumes the restraint gate already ran [SKILL.md:222]. It is not designed to audit arbitrary external surfaces. No demonstrated independence.

### Split VISUAL_SYSTEM out — VERY LOW VALUE, HIGH COST

**Confidence: High (0.95) that this is not worth doing.**

**Why rejected:** VISUAL_SYSTEM is an internal lane ("static visual system inside the workflow" [metadata:158-162]), not an argument lane. It is a phase, not a job. The keyword overlap with DESIGN_PRINCIPLES means co-loading is correct behavior, not a collision.

### Split by argument lane (5 commands) — VERY LOW VALUE, VERY HIGH COST

**Confidence: High (0.95) that this is not worth doing.**

**Why rejected:** All 5 argument lanes (direction, directions, redesign, preflight, handoff) are sequential phases of one job (iteration 002). Splitting them into 5 commands would cost ~36 files, ~1760 metadata lines, 80 constraint field updates. No demonstrated harm justifies this.

---

## Five Research Questions Answered

### Q1: Lane seams — which intents co-occur and which never do?

**Answered (iteration 001):** Three co-occurrence clusters identified:
- **Core design process** (DESIGN_PRINCIPLES, REGISTER_DIALS, MECHANICAL_PREFLIGHT) — always together, share `brief-to-dials.md`.
- **Motion family** (6 MOTION_* intents) — always together, share `animation-decision-framework.md`, fixed-order chain.
- **Grounding/reference** (REAL_SYSTEM_GROUNDING, REAL_WORLD_REFERENCE) — sequential phases of one grounding job.

Non-co-occurring pairs: MOTION_* vs DESIGN_PRINCIPLES/VISUAL_SYSTEM/REDESIGN_INTAKE/COPY_MOCK_DATA/MECHANICAL_PREFLIGHT (zero shared files). The motion/static seam is the strongest candidate, but it is a conditional dependency, not an independence.

### Q2: Lanes — separable jobs vs sequential phases?

**Answered (iteration 002):** All 17 lanes (5 argument + 12 internal) are sequential phases of one job. Every internal lane says "inside the workflow" in its surface description. The six motion lanes are a fixed-order sub-chain. The one conditional exception: motion-only prompts can skip STEP 0-4, but the mode's contract [SKILL.md:48] says static hierarchy must be resolved first if unclear.

### Q3: Cost — what does a split actually cost?

**Answered (iterations 003-004):** Per new command: ~9 files, ~50 KB content, ~440 metadata lines, ~80 router lines, 4 runtime mirrors, test updates. The 4 hard machine constraints (next non-empty, preferSiblingWhen exact sibling set, typicallyBefore subsets next, handoff.nextOptions matches next) create quadratic constraint propagation: N new commands × M existing commands × 4 fields. The current 2-command topology is at a constraint complexity minimum.

### Q4: Middle path — separate concerns without multiplying commands?

**Answered (iteration 005):** Four middle-path options compared. Option D (mode-internal process branching) is the true middle path — it addresses the motion-only process gap with a SKILL.md edit at 1/9th the file cost of a split. Option A (richer `--mode` lanes) is the smallest change but does not solve the process gap. Subcommands collapse to either a richer lane or a full command. The status quo already separates concerns at the resource level but not the process level.

### Q5: Harm — what failure modes does the current shape produce?

**Answered (iterations 006, 008):** Three confirmed harms, none caused by the single-command shape:
1. Stale `/interface:motion` references (consolidation residue) — fixable in ~15 min.
2. `handoff` vs `build` naming drift (metadata bug) — fixable in ~5 min.
3. 5000-word cap pressure (partially from motion content) — fixable by SKILL.md content reorganization, not a command split.

No intent-scoring collision produces wrong routing (6 test cases, iteration 008). No wrong-command routing from lane ambiguity found. The intent scoring underloads in some cases but the process flow compensates.

---

## Confirmed vs Inferred

### Confirmed (file:line evidence)
- 17 INTENT_SIGNALS, resource-sharing clusters [SKILL.md:114-154]
- All 17 lanes are phases [metadata:127-234, SKILL.md:60-68]
- Per-command cost: ~9 files, ~440 metadata lines [file listing, metadata]
- 4 hard machine constraints [surface-check.mjs:358,916,983,1249]
- 2-command topology at constraint complexity minimum [surface-check.mjs analysis]
- Stale `/interface:motion` refs [design.md:27, design-reference.md:27]
- `handoff` vs `build` drift [metadata:167]
- 5000-word cap at 4991/5000 [spec.md context]
- 010-motion-merge "In progress" [spec.md:157]
- No intent-scoring misrouting [iter-008, 6 test cases]

### Inferred (would need additional evidence)
- Motion-only prompts running STEP 0-4 is "unnecessary overhead" — no user complaint confirms visible harm
- Process branching would solve the motion gap — not tested
- SKILL.md content reorganization would relieve word-cap pressure — exact savings depend on movable content

---

## Method

10 iterations, each with a distinct focus angle, grounded in files read directly:
1. INTENT_SIGNALS co-occurrence graph
2. Lane classification (separable jobs vs phases)
3. Decomposition cost quantification
4. Machine constraint deep dive
5. Middle-path comparison
6. Evidence of harm audit
7. Motion lanes conditional independence analysis
8. Intent-scoring collision testing (6 cases)
9. Consolidation reversal cost
10. Cross-cutting seam ranking by value-to-cost

All load-bearing claims cite file:line. All recommendations checked against the hard constraint (demonstrated problem, smallest fix, stated cost).
