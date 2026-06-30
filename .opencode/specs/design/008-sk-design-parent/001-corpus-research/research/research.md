# Deep-Research Synthesis — Restructuring `sk-design-interface` into an `sk-design` Parent

> **Packet:** `154-sk-design-parent/001-corpus-research` · **Loop:** deep-research (4-model fan-out) · **Status:** consolidated synthesis for the phase-002 architecture decision gate.
> **Question:** How to restructure the existing `sk-design-interface` skill into a PARENT skill `sk-design` containing 4–7 focused design SUB-SKILLS, grounded in the external design-skills corpus. Three outputs: (1) optimal sub-skill taxonomy with scope + corpus sources; (2) structural-model evidence (single hub with nested mode packets vs. umbrella router over a sibling family); (3) per-child onboarding + backward-compat, folding in `sk-design-interface` and `sk-design-md-generator`.

---

## 1. Summary

All four model lineages independently conclude that `sk-design` should be a **family of focused design sub-skills under one parent**, and that the existing internal split — visual *invention* (`sk-design-interface`) vs. measured *extraction* (`sk-design-md-generator`) — is the correct seam to generalize. Three of four lineages (opus48-claude2, gpt55fast, mimo25pro) recommend the **umbrella-router-over-siblings** structural model; one (kimi27) dissents toward a **hub-with-nested-packets** model on advisor-identity grounds. The corpus ships working exemplars of *both* models (`impeccable` is an explicit hub; `designer-skills` is an explicit umbrella; `ui-skills-root` is a thin router), so the decision is governed by **our family's coupling profile, not by corpus preference** — and that profile (heterogeneous runtimes, independently-invokable children, existing cross-repo references to the flat `sk-design-*` names) tips it decisively to umbrella. On grain, lineages cluster at **5–6 children**; the recommended set is **5 core + 1 optional**, with the strongest single synthesis being the opus48 finding that the corpus has two orthogonal axes — **domain** (interface / foundations / motion) × **mode** (build / audit / refine) — which the taxonomy must respect rather than collapse.

---

## 2. Method

This was a **4-model heterogeneous fan-out** over the same research brief, each lineage running its own iterative deep-research loop with convergence detection, then merged:

| Lineage | Model | Iterations | Stop / convergence | Notes |
|---|---|---|---|---|
| **opus48-claude2** | Claude Opus 4.8 (xhigh) | 15 | maxIterationsReached; convergence 0.85 | Deepest run; produced the finalized taxonomy + corpus-source map + coupling signal matrix. Strongest lineage. |
| **gpt55fast** | GPT-5.5 (fast) | 5 | converged (no taxonomy-changing evidence after iter 5) | Tightest, decision-oriented; 283 lines. |
| **kimi27** | Kimi K2.7 | 7 | maxIterationsReached | The lone hub dissent; leans on `deep-loop-workflows` precedent. |
| **mimo25pro** | MiMo V2.5 Pro | 8 (registry says 16 in brief; lineage frontmatter records 8) | converged | Produced **no structured findings-registry** (8 findings salvaged from prose only) — its prose is the sole record of its findings and is treated as primary below. |

The merged `deep-research-findings-registry.json` carries 20 key findings across opus+kimi+gpt with `_lineages` attribution; `fanout-attribution.md` records per-lineage convergence and that mimo's 8 findings were salvaged. **Findings below carry model attribution**: agreements across ≥2 lineages are flagged HIGH confidence; single-lineage claims are flagged as such. Where the four diverge (notably structural model and grain), the divergence is stated rather than averaged away.

> **Attribution caveat.** The merged registry was built from `gpt55fast`, `kimi27`, and `opus48-claude2` only; mimo25pro's findings exist solely in its prose synthesis and are merged in by hand here. Treat mimo's unique points (below) as single-lineage unless another lineage corroborates.

---

## 3. Key Findings

Consolidated and de-duplicated across the 20 registry findings plus mimo's prose. Confidence reflects cross-lineage agreement.

### 3.1 Structural-model findings

- **[HIGH — opus48, gpt55, mimo25; kimi27 dissents] The corpus does not prescribe one structural model; it ships both.** opus48 isolates **three structural exemplars**: hub (`impeccable`), umbrella (`designer-skills`), router (`ui-skills-root`) (registry F26). Therefore the choice is decided by *our* coupling, not by copying the corpus.
- **[HIGH — opus48, confirmed in corpus] `impeccable` is a complete hub-with-nested-mode-packets skill** and is the de-facto parent template for the hub option (registry F23, F27). It runs a once-per-session Setup that loads shared context + register + the AI-slop test, exposes a single 24-row Commands table whose modes are `reference/<command>.md` packets loaded *selectively*, has explicit "Routing rules", and `pin`/`unpin` to promote hot modes to shortcuts [SOURCE: external/impeccable.md:13-21,119-168]. `audit.md` confirms the shared-context hub: it checks anti-patterns "from the parent impeccable skill (already loaded in this context)" [SOURCE: external/audit.md:60-64].
- **[HIGH — gpt55, opus48, mimo25] `designer-skills` is an umbrella of independently-installable siblings** organized by category/plugin as the stable structural unit — 9 plugins / 97 skills in the design-practice collection — where "installing more doesn't slow things down" (à-la-carte load) [SOURCE: external/designer-skills-main/README.md:61-77,200] (registry f-plugin-family).
- **[HIGH — gpt55, opus48] The corpus explicitly favors routing to the smallest useful context** rather than co-loading a broad design blob: `ui-skills-root` says prefer 1 skill, use 2 for two angles, 3 only for broad work, never more than 3 [SOURCE: external/ui-skills-root.md:20-29,41-59] (registry f-router-small-context).
- **[HIGH — opus48; corroborated by gpt55, mimo25] Coupling asymmetry is the deciding signal.** `sk-design-interface` is pure judgment; `sk-design-md-generator` carries a Playwright/ts-node extraction backend; they share only the DESIGN.md contract [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14] (registry F32, f-existing-boundary). opus48's signal matrix tallies **5 umbrella · 1 hub · 2 neutral** (registry F46).
- **[SINGLE — kimi27, dissent] A hub preserves a single advisor identity.** kimi argues `deep-loop-workflows` is the closest internal precedent (one advisor-discoverable skill, one `graph-metadata.json`, a `mode-registry.json` routing to nested packets) and that an umbrella would *fragment the advisor surface*, risking generic prompts ("make this look good") routing to the wrong child [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:57-68] (registry f4). This is the principal cross-model disagreement (see §7).

### 3.2 Taxonomy findings

- **[HIGH — opus48, gpt55, kimi27, mimo25] Evaluation/refinement must be its own child, not buried inside creation guidance.** audit/critique/polish/harden are distinct workflows with distinct evidence and verification contracts [SOURCE: external/audit.md:8-10] (registry f-quality-separate); all four lineages give quality/critique/audit its own child.
- **[HIGH — opus48 (explicit), implicit in all] The corpus has two orthogonal axes: domain × mode.** domain = interface/layout/color/motion; mode = build/audit/refine (registry F20). This is the cleanest organizing principle and explains why "audit" (a mode) and "color" (a domain) are different kinds of child.
- **[HIGH — all four] The existing internal family already exists as cross-referencing siblings with no parent** (registry F31); both skills' graph-metadata already name each other as siblings of the `sk-design-*` family. Formalizing a parent is the natural next step.
- **[HIGH — all four] `sk-design-interface` folds into the flagship/direction child; `sk-design-md-generator` folds into the system/spec/extraction child.** Unanimous across lineages (registry f3; gpt §6; mimo §4; opus §2).
- **[MEDIUM — opus48 explicit, others implicit] Named-aesthetic presets** (`brutalist`/`minimalist`/`soft`/`apple-bento`) belong as a `references/aesthetics/` library under the interface child, not as their own children [SOURCE: external/stitch-skill.md:29-35], [SOURCE: external/apple-bento-grid-main/SKILL.md].
- **[MEDIUM — gpt55, kimi27, mimo25; opus48 omits] Some lineages carve a distinct "strategy"/framing child or a "presentation/delivery" child** from `designer-skills`' `ux-strategy`, `design-ops`, and `apple-bento` — opus48 instead treats UX-strategy as an *adjacent* family out of scope and presentation as an *optional* output child. Grain disagreement (see §4, §7).

### 3.3 Onboarding / backward-compat findings

- **[HIGH — opus48, kimi27, gpt55, mimo25] Legacy trigger phrases and the flat names must be preserved.** opus48: keeping flat `sk-design-*` child names makes backward-compat *free* under the umbrella model = zero reference rewrites (registry F52). kimi: preserve all existing triggers as registry aliases (registry f5). mimo: keep `sk-design-interface` as a thin redirect for a migration window.
- **[HIGH — opus48, kimi27] Children are invisible to memory search / skill-graph until advisor rebuild + skill-graph scan run** — the discovery gate is the real onboarding step, validated at routing confidence ≥0.8 [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:1-12].

### 3.4 Unique findings from mimo25pro (prose-only — single-lineage)

mimo produced no findings-registry, so these survive only in its synthesis:

- **A maximally domain-sliced taxonomy is viable.** mimo proposes 6 *domain-pure* children — visual, color, motion, layout, a11y, interaction — splitting color and layout out of "foundations" entirely. This is the only lineage that fully decomposes the static-visual domain (opus48 keeps `foundations` as one child but warns it is "the softest merge"; mimo's split is the concrete form that re-split would take).
- **Concrete absorption accounting for designer-skills-main's 97 skills:** ~55 absorbed into the craft sub-skills, ~46 dropped as process skills already covered by `deep-research`/`deep-review`/`sk-code`/`sk-doc`/`sk-git`, and **8 cognitive laws** (Hick's, Miller's, Fitts's, Doherty, Aesthetic-Usability, Von Restorff, Proximity, Common Region) hoisted to **parent shared references**. No other lineage quantifies the absorption or proposes a shared cognitive-laws layer.
- **An explicit effort estimate:** ~10–16 days across the family (parent 1d; visual rename+expand 2–3d; each new child 1–2d/2–3d; md-generator update 0.5d).
- **A bounded compatibility window** (proposes 28 days for the `sk-design-interface` redirect) rather than a permanent alias.
- **An a11y-as-its-own-child stance:** mimo is the only lineage to elevate accessibility to a standalone child (`sk-design-a11y`) rather than folding it into a broader audit/quality child.

---

## 4. Recommended Sub-Skill Taxonomy

**Count: 5 core children + 1 optional** (the opus48 recommendation, registry F42, which sits in the consensus 5–6 band and is the only lineage with a finalized corpus-source map). Where another lineage's naming or grain differs, it is noted inline.

> Inclusion test (opus48): a cluster earns its own child when it is (a) deep, (b) independently invokable, and (c) has its own reference corpus. The organizing logic is **domain × mode** (registry F20): most children are domains; `design-audit` is the *mode* child that cross-cuts all domains.

### Core children

**1. `sk-design-interface`** *(flagship — keep the name; folds existing `sk-design-interface`)*
- **Scope:** decide and build a distinctive, non-templated interface direction — grounding → token-system brainstorm → anti-AI-default critique → build → self-critique; N-direction exploration; in-place redesign; interface writing.
- **Boundary vs. siblings:** owns *direction & build*; delegates token math → foundations, motion → motion, review → audit, artifact capture → spec.
- **Corpus sources:** existing `sk-design-interface` references (`design_principles`, `variation_diversity`, `real_ui_loop`) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167]; `taste-skill`, `gpt-tasteskill`, `bencium-innovative-ux-designer`, `emil-design-eng`, `impeccable` (identity/craft/shape), `make-interfaces-feel-better`, `design-lab` (explore), `redesign-skill` (apply); aesthetic presets `brutalist`/`minimalist`/`soft`/`apple-bento` as a `references/aesthetics/` library [SOURCE: external/stitch-skill.md:29-35].
- *Lineage naming:* gpt55 = `sk-design-interface` (or alias `sk-design-craft`); kimi27 = `sk-design-direction`; mimo25 = `sk-design-visual`. All map to this child.

**2. `sk-design-foundations`** *(new)*
- **Scope:** the static visual system — color (OKLCH, palettes, contrast, gamut, theming, dark mode), typography (scale, pairing, measure), layout/spacing/hierarchy/grid, responsive/adapt.
- **Boundary:** owns *what the static system IS*; not motion, not direction-from-scratch. **Soft merge** — structure internals as `color/`, `type/`, `layout/` so a split to discrete children is mechanical (see §7).
- **Corpus sources:** `oklch-skill` (+ sub-refs), `colorize`, `layout`, `baseline`, `adapt` [SOURCE: external/oklch-skill.md:10-90], [SOURCE: external/layout.md:24-148]; designer-skills `ui-design` + `design-systems` token/theming clusters [SOURCE: external/designer-skills-main/README.md:72,70].
- *Lineage divergence:* mimo25 splits this into `sk-design-color` + `sk-design-layout` (domain-pure); kimi27 keeps it as one `sk-design-foundations`; gpt55 rolls foundations into `sk-design-interface` + `sk-design-system` rather than a standalone child.

**3. `sk-design-motion`** *(new)*
- **Scope:** the temporal layer — purposeful animation, micro-interactions, transitions, motion materials, reduced-motion; framer-motion/GSAP patterns.
- **Boundary:** owns *motion build*; motion-performance *review* lives in audit (motion references it) [SOURCE: external/animate.md:108-208], [SOURCE: external/interaction-design.md:51-272].
- **Corpus sources:** `animate`, `interaction-design`, `delight`, `morphing-icons`, `12-principles-of-animation`, `mastering-animate-presence`; designer-skills `interaction-design` motion cluster.
- *Lineage divergence:* gpt55 and kimi27 fold interaction-behavior + motion together (`sk-design-interaction`); mimo25 splits motion (animation) from interaction (behavior/state machines) into two children.

**4. `sk-design-audit`** *(new — the cross-cutting MODE child)*
- **Scope:** cross-cutting QA & critique — a11y, performance, responsive, theming, anti-pattern/slop detection, design-quality scoring, production hardening; shared P0–P3 severity + 5-dimension `/20` contract.
- **Boundary:** owns *review/score/harden* (reports + targeted fixes); does not invent direction [SOURCE: external/audit.md:12-105], [SOURCE: external/fixing-accessibility.md:33-136].
- **Corpus sources:** `audit`, `critique`, `polish`, `harden`, `optimize`, `fixing-accessibility`, `fixing-motion-performance`, `baseline` (constraint mode), `pseudo-elements`, `clarify`; designer-skills `visual-critique` (7) + `accessibility-audit`.
- *Lineage naming:* gpt55 = `sk-design-quality`; kimi27 = `sk-design-critique`; mimo25 elevates accessibility into a separate `sk-design-a11y` (the lone split here). The shared P0–P3 + `/20` contract aligns with `sk-code-review`.

**5. `sk-design-spec`** *(folds existing `sk-design-md-generator`)*
- **Scope:** the DESIGN.md / Style-Reference artifact layer — **extract** from a live site (the md-generator Playwright backend) AND **author** from taste directives (the stitch approach).
- **Boundary:** owns the *DESIGN.md contract* that interface/foundations/sk-code consume [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14], [SOURCE: external/stitch-skill.md:9-26].
- **Corpus sources:** existing `sk-design-md-generator` references + a new "author" path from `stitch-skill`; designer-skills `design-token` + `documentation-template`.
- *Lineage naming:* gpt55 = `sk-design-system` (exposing `sk-design-md-generator` as alias/entrypoint); kimi27 = `sk-design-system`; mimo25 keeps `sk-design-md-generator` as-is and only cross-links it. All keep the Playwright extraction backend intact and the cardinal-fidelity rule untouched [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:248-255].

### Optional child

**6. `sk-design-output`** *(optional — decide at phase-002)*
- **Scope:** static/presentation graphics — posters, slides, bento stat-cards.
- **Corpus sources:** `canvas-design`, `frontend-slides`, `slidev`, `apple-bento` [SOURCE: external/apple-bento-grid-main/SKILL.md].
- **Status:** opus48 defers (keep or fold into interface references); kimi27 makes it a full child (`sk-design-presentation`); gpt55 makes it `sk-design-delivery` (presentation + design-ops handoff). If dropped, its sources become references under interface.

### Placement of the two existing skills (explicit)

| Existing skill | Folds into | Mechanism | Unanimous? |
|---|---|---|---|
| `sk-design-interface` | Child **1** (flagship; same name) | Augment, don't replace — add aesthetics presets, craft/shape/redesign/explore packets, register split, slop test | Yes (all 4) |
| `sk-design-md-generator` | Child **5** `sk-design-spec` (gpt/kimi: `sk-design-system`) | Move/alias the whole skill incl. `backend/` Playwright pipeline; add an "author" mode; keep extract backend + cardinal-fidelity rule intact | Yes (all 4) |

### Out of scope / adjacent (opus48; corroborated)
`output-skill` (generic anti-truncation utility) and `ui-skills-root` (CLI selector) are meta/infra, not design children (kimi27 and gpt55 agree on `output-skill`). designer-skills' process plugins — `design-research`, `prototyping-testing`, `design-ops` (mostly), `designer-toolkit`, `ux-strategy` — are a UX-strategy/process family adjacent to an interface-*build* family [SOURCE: external/designer-skills-main/README.md:69-77]. gpt55 dissents by promoting `ux-strategy` to a `sk-design-strategy` child and `design-ops` into `sk-design-delivery`.

---

## 5. Structural-Model Recommendation

**Recommendation: umbrella-router parent over a sibling family, with a parent-owned shared design-base, and hub-style internal structure *inside* the interface child.** This is the 3-of-4 majority (opus48, gpt55, mimo25); kimi27 dissents toward a pure hub.

### Corpus evidence for each model

| Model | In-corpus exemplar | What it demonstrates | Evidence |
|---|---|---|---|
| **Hub** (one identity, nested mode packets) | `impeccable` | Setup loads shared context/register/slop-test once; one Commands table of 24 `reference/<command>.md` packets loaded selectively; explicit routing rules; `pin` promotes hot modes | [SOURCE: external/impeccable.md:13-21,119-186]; [SOURCE: external/audit.md:60-64] |
| **Umbrella** (thin parent dispatches to à-la-carte siblings) | `designer-skills` | 9 plugins / 97 skills by category; independently installable; "installing more doesn't slow things down" | [SOURCE: external/designer-skills-main/README.md:61-77,200] |
| **Router** (pre-step selecting smallest useful context) | `ui-skills-root` | Choose category → load smallest useful skill → never more than 3 | [SOURCE: external/ui-skills-root.md:20-29,41-59] |

### The deciding evidence: coupling asymmetry

The corpus is split, so the call falls to **our family's coupling**, where opus48's signal matrix is the strongest artifact (registry F46 — **5 umbrella · 1 hub · 2 neutral**):

- **Runtime is heterogeneous (→ umbrella).** A monolithic hub would co-load `sk-design-md-generator`'s Playwright/ts-node backend with pure-judgment children on every design request [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:206-294]. gpt55 makes the same point: hub setup loads context + command refs + design system before proceeding, "heavy for every design request" [SOURCE: external/impeccable.md:13-21], and the tool contracts diverge sharply (Playwright extraction vs. creative two-pass) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:94-115].
- **Children are independently invokable (→ umbrella/router).** audit, color, motion, spec are all invoked alone.
- **Backward-compat (→ umbrella).** Existing flat `sk-design-*` names are referenced across `sk-code`, `sk-code-review`, `mcp-figma`, `mcp-open-design`, and CLAUDE.md; nesting them breaks those references, flat siblings don't [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202].
- **Advisor precision (→ umbrella).** Distinct named children give sharper triggers.

The hub's genuine wins — a shared anti-slop/token/slop-test base, a single "sk-design" door, in-hub routing, and `pin` — are **all recoverable inside an umbrella**: a parent-owned shared-base reference, one parent entry skill, and a registry router. So the recommendation keeps **hub structure where it pays off (inside the interface child, mirroring `impeccable`)** while making the *family* an umbrella.

### What would change the call

- **kimi27's strongest counter:** if the dominant real-world usage is generic ("make this look good") rather than domain-specific, a **single advisor identity** (hub, à la `deep-loop-workflows`) routes better than N sibling triggers and avoids fragmenting the advisor surface [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:57-68]. The missing signal is **advisor/usage telemetry** (absent in this research) — opus48 flags the same gap. If telemetry showed mostly-generic entry, the call could flip to hub, or to an umbrella with a strong default-to-interface route (which both gpt55 and mimo25 already build in).
- If the family stays at the **2 existing skills + nothing new** for long, the parent is over-engineering; the umbrella only earns out once ≥4 children exist.

---

## 6. Per-Child Onboarding & Backward-Compatibility

### How each existing skill folds in

- **`sk-design-interface` → flagship child (same name).** Augment, do not replace: add the aesthetics-preset library, craft/shape/redesign/explore packets, the register split (brand vs product), and the AI-slop test; preserve the Apache-2.0 vendored base + `LICENSE.txt`; bump version. Move only *family-level routing* up to the parent; keep design-process references, variation diversity, the real-UI loop, and the quality floor child-owned (gpt55 §6.2; kimi27 §8.1) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167].
- **`sk-design-md-generator` → spec/system child.** Move the entire skill — including the embedded `backend/` TypeScript Playwright pipeline, references, examples, install guide — into the child (kimi27 §8.1) [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:204-247]. opus48 prefers an **alias rather than a hard rename** so the referenced name keeps resolving; add the stitch "author" mode; leave the extract backend and cardinal-fidelity rule intact [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-425].
- **New children** (foundations, motion, audit, [output]) are authored from their corpus clusters with `SKILL.md` + `references/` + `feature_catalog/` + `manual_testing_playbook/`, each with "When to use / When not to use / Pairs well with" (gpt55 §6; kimi27 §8.3).
- **Discovery gate (the real onboarding step):** author each child's frontmatter + trigger phrases, then run **advisor rebuild + skill-graph scan** and validate routing at **≥0.8** — children are invisible to memory search and the graph until this runs (opus48 §4; kimi27 §8.3) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:1-12].
- **Shared base added additively:** children keep self-contained references until the parent base resolves; de-dup only after routing validates, so no mid-migration rules gap (opus48 §4).
- mimo25 adds an **8-cognitive-laws shared reference** at the parent and an explicit **~10–16 day** effort estimate (single-lineage).

### Blast radius for `sk-design-interface`

`sk-design-interface` is referenced by **`mcp-open-design`** (the MANDATORY design-judgment co-load — see CLAUDE.md §Dispatch Rules and the skill's own description), **`mcp-figma`**, **`sk-code`**, **`sk-code-review`**, and **CLAUDE.md gates** (the "UI / design work" routing row and the Open Design dispatch rule). Under each structural model:

| Surface | Umbrella (keep flat name) — RECOMMENDED | Hub (nest under `sk-design`) |
|---|---|---|
| `mcp-open-design` mandatory co-load | **No change** — `sk-design-interface` still resolves | Breaks unless the reference is rewritten to the hub + mode, or an alias is added |
| CLAUDE.md design-routing + Open Design dispatch rule | **No change** | Must update the gate text to name the parent/mode |
| `sk-code` / `sk-code-review` / `mcp-figma` cross-refs | **No change** | Each cross-ref must be repointed or aliased |
| Existing user muscle-memory / trigger phrases | Preserved as-is | Preserved only via registry aliases |

This is the single largest compat argument for the umbrella: **flat sibling names mean zero reference rewrites** (opus48 registry F52). kimi27 accepts the same blast radius but proposes to neutralize it with **registry aliases** mapping every legacy trigger to the nested packet (registry f5); mimo25 proposes a **time-boxed redirect** (~28 days) from the old name. All three mechanisms (flat-keep, alias, redirect) preserve current behavior; they differ only in how much rewiring the hub demands.

### Suggested migration → phases (opus48)
003 scaffold parent (+ registry + shared base) → 004 onboard existing (register, alias, additive base, advisor/skill-graph rebuild; gate: existing references resolve + routing ≥0.8) → 005 build foundations/motion/audit (+ decide output) → 006 advisor rebuild + skill-graph scan + `validate.sh --recursive` + routing-regression. Each phase validates independently; children stay individually invocable so no phase dark-launches a broken family.

---

## 7. Open Questions / Disagreements

1. **Structural model — the principal disagreement (3 umbrella vs. 1 hub).** opus48 + gpt55 + mimo25 say umbrella-over-siblings; kimi27 says hub-with-nested-packets, citing the `deep-loop-workflows` precedent and a single advisor identity. The unresolved factual gap on both sides is **advisor/usage telemetry**: does real usage enter generically (favors hub / strong-default umbrella) or domain-specifically (favors umbrella)? No lineage had this data.
2. **Grain — 5 vs. 6 vs. 7 children.** opus48 = 5 core + 1 optional; kimi27 = 6 (adds presentation); gpt55 = 6 (adds strategy + delivery, drops a standalone foundations/motion split); mimo25 = 6 domain-pure (visual/color/motion/layout/a11y/interaction). The disagreement concentrates on three seams:
   - **foundations as one child vs. color+layout split** (opus48/kimi keep; mimo splits; gpt absorbs).
   - **motion vs. interaction** as one child or two (gpt/kimi merge; mimo/opus separate motion from interaction-behavior).
   - **a11y inside audit vs. standalone** (only mimo elevates it).
3. **A "strategy" child?** gpt55 carves `sk-design-strategy` from `ux-strategy`; opus48 explicitly puts UX-strategy *out of scope* as an adjacent process family. Unresolved whether brief-framing belongs in the design-build family at all.
4. **`sk-design-md-generator` naming:** canonical rename to `sk-design-spec`/`sk-design-system` vs. keep-name-as-alias. opus48 and mimo favor preserving the name (alias/redirect); gpt/kimi favor a broader child name with the old name exposed as an entrypoint.
5. **Optional output/presentation/delivery child:** keep, fold, or merge with handoff. opus48 defers; kimi makes it a child; gpt makes it a delivery child including design-ops handoff.
6. **Shared-base governance:** opus48 flags the shared base as *hidden coupling* — it must be versioned, with children pinned to a base version and regression-tested on change.
7. **Thin evidence flags:** (a) mimo25's iteration count is inconsistent (brief says 16, lineage frontmatter says 8) and its findings are prose-only — its unique claims (domain-pure split, 97-skill absorption math, day estimates, 28-day window, a11y-as-child) are **single-lineage and unverified by the registry**. (b) kimi27 explicitly left ~10 standalone corpus docs (`adapt`, `distill`, `quieter`, `canvas-design`, `harden`, `stitch-skill`, `baseline`, `emil-design-eng`, `bencium-innovative-ux-designer`, `gpt-tasteskill`) un-deep-read, so its child placements for those are provisional. (c) `fanout-attribution.md` lists every lineage's Kind/Model/Convergence as "unknown/n/a" except opus48 (0.85), so per-lineage convergence rigor beyond opus48 is not independently recorded.

---

<!-- ANCHOR:references -->
## 8. References

### Lineage sources (this fan-out)
- `001-corpus-research/research/lineages/opus48-claude2/research.md` (Opus 4.8, 15 iters — finalized taxonomy + corpus-source map + coupling matrix)
- `001-corpus-research/research/lineages/gpt55fast/research.md` (GPT-5.5, 5 iters converged)
- `001-corpus-research/research/lineages/kimi27/research.md` (Kimi K2.7, 7 iters — hub dissent)
- `001-corpus-research/research/lineages/mimo25pro/research.md` (MiMo V2.5 Pro — prose-only findings)
- `001-corpus-research/research/deep-research-findings-registry.json` (merged 20 findings, opus+kimi+gpt, with `_lineages`)
- `001-corpus-research/research/fanout-attribution.md`

### Corpus — structural exemplars
- `external/impeccable.md` (hub exemplar + parent template)
- `external/designer-skills-main/README.md` (umbrella exemplar; 9 plugins / 97 skills design-practice collection)
- `external/ui-skills-root.md` (router exemplar; smallest-useful-context rule)
- `external/audit.md` (confirms impeccable as shared-context hub; the 5-dimension /20 + P0–P3 contract)

### Corpus — child source clusters (selected)
- Interface/taste: `external/{taste-skill,gpt-tasteskill,bencium-innovative-ux-designer,emil-design-eng,make-interfaces-feel-better,design-lab,redesign-skill,stitch-skill}.md`
- Foundations: `external/{oklch-skill,colorize,layout,baseline,adapt}.md`; designer-skills `ui-design` + `design-systems`
- Motion: `external/{animate,interaction-design,delight,morphing-icons,12-principles-of-animation,mastering-animate-presence}.md`
- Audit/quality: `external/{audit,critique,polish,harden,optimize,fixing-accessibility,fixing-motion-performance,clarify,pseudo-elements}.md`; designer-skills `visual-critique`
- Output/presentation: `external/{canvas-design,frontend-slides,slidev}.md`; `external/apple-bento-grid-main/{SKILL.md,design-system.md}`
- Aesthetic presets: `external/{brutalist-skill,minimalist-skill,soft-skill,bolder,quieter,distill}.md`

### Existing skills + internal precedents
- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `.opencode/skills/deep-loop-workflows/SKILL.md` (hub-with-nested-packets internal precedent — kimi27's anchor)
- `.opencode/skills/sk-code/SKILL.md` (multi-surface hub precedent)
- Packet: `.opencode/specs/design/008-sk-design-parent/spec.md`, `001-corpus-research/spec.md`
<!-- /ANCHOR:references -->
