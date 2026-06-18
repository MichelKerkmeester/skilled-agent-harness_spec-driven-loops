# What Changed in 143: sk-interface-design Became a Standalone Design Judgment Skill

> Spec 143 shipped `sk-interface-design` from vendored frontend-design guidance into a standalone, validated design judgment skill with data-backed critique, real-world reference grounding, smart routing and matching reader-facing docs.

---

## THE UNIFYING PRINCIPLE

The packet followed one rule. A design skill should sharpen judgment, not take over implementation. It should help an agent understand the subject, name the expected default, critique that default and make a deliberate visual choice. It should not become a style preset menu, a component gallery, a trend copier or a second coding skill.

That rule explains the shape of every phase. The skill starts with a strong point of view from Anthropic's frontend-design guidance. It gains data, references and real-world grounding only where they improve critique. It hands build work back to `sk-code`, treats Mobbin and Refero as one-reference calibration tools, keeps Open Design as an external transport partner rather than an internal dependency and documents the behavior in a catalog and playbook.

That rule shaped every section below.

---

## 1. DESIGN JUDGMENT AS A FIRST-CLASS SKILL

**Before**

The framework had coding and tool skills, but no reusable design judgment surface. UI tasks could be implemented, but they did not reliably start from subject-specific visual direction, palette discipline, type choice or an explicit critique of AI-default layouts.

**After**

`sk-interface-design` exists as a house skill in the `sk-code` family. It preserves Anthropic's frontend-design guidance in `references/design_principles.md`, ships a lean runtime `SKILL.md`, carries its Apache-2.0 license and registers in advisor metadata. `sk-code` gained the reciprocal sibling edge, the skill catalog and root README counts moved from 22 to 23, and advisor routing returned the skill as the top match for a design prompt with confidence 0.92 and uncertainty 0.12.

**Impact**

Future UI work now has a deliberate design entry point. The skill tells an agent to ground the design in the subject, avoid templated AI defaults, make palette and type choices on purpose and critique the plan before building.

**Why a skill**

Design judgment is reusable across interfaces but distinct from implementation. Keeping it in `sk-interface-design` lets `sk-code` continue to own build standards and verification while giving UI work a stronger front door.

---

## 2. FROM GUIDANCE TO MEASURED DESIGN DATA

**Before**

The installed skill had strong principles but no local design data. It could say "avoid the default" in qualitative terms, but it did not ship measured CSV-backed references, a distilled quality floor or a query helper.

**After**

The `ui-ux-pro-max` research phase produced a cross-checked merge recommendation. The follow-up merge adopted 8 MIT data CSVs under `assets/data/`, added `ux_quality_reference.md`, added `design_inventory.md` and added optional stdlib-only query search through `design_search.py` and `design_search_core.py`. The merge kept `SKILL.md` lean at 1437 words, kept `design_principles.md` byte-for-byte unchanged and blocked generator or persistence behavior by excluding `design_system`, `--design-system`, `--persist` and generated `design-system/` writes.

**Impact**

The skill can now critique against a quality floor and pattern inventory without becoming a design-system generator. It has more evidence, but it still loads as guidance and optional search.

**Why query-only**

The data is there to sharpen judgment. It is not there to create artifacts, persist design systems or override the actual product surface. Query-only search keeps the capability safe and bounded.

---

## 3. DOCUMENTATION BECAME A USER SURFACE

**Before**

The skill had runtime instructions and references, but it lacked the reader-facing doc surfaces used by the house documentation system. There was no full feature catalog, no manual testing playbook and no aligned asset README.

**After**

The doc alignment phase used three markdown agents in parallel to create `feature_catalog/`, `manual_testing_playbook/` and aligned references under the `sk-doc` templates. It added `assets/data/README.md`, reconciled `SKILL.md` pointers and fixed graph metadata counts. Later realignment phases updated those docs for the parity protocol, then for Mobbin and Refero smart routing, ending with 13 features after the parity pass and 10 manual scenarios after the routing pass.

**Impact**

Readers can now understand what the skill does, what surfaces implement each feature and how an operator tests the behavior. The docs are not a sidecar. They are the user-facing contract for the skill.

**Why keep the catalog even though it is unusual for `sk-*`**

The feature catalog is non-idiomatic for the `sk-*` family, but it was explicitly requested and it makes this skill's expanding design behavior legible. The follow-up notes preserve that context so readers understand why this skill differs from its siblings.

---

## 4. PARITY WITH CLAUDE DESIGN BECAME A SHARED LOOP

**Before**

Claude Design parity was only a research target. The framework did not yet have a shared protocol connecting design judgment to MagicPath preview fidelity, revision grammar and adherence to a visual direction.

**After**

Two research phases mapped the target. Phase 005 studied Claude Design parity for `sk-interface-design` and `mcp-magicpath` and merged 15 findings. Phase 006 widened the lens to v0, Lovable, Bolt, Figma Make, Subframe and adjacent tools, then merged 8 net-new findings. Phase 007 built the keystone as `claude_design_parity.md`, wired both skills to it and added `mcp-magicpath/scripts/design_fidelity.py` to fetch or download a component's `previewImageUrl`. The loop deliberately uses `previewImageUrl`, not a gated canvas URL, and it does not add named style levers or presets.

**Impact**

The two skills now share a single protocol for real-UI comparison without bloating either runtime file. `sk-interface-design` owns judgment and critique. `mcp-magicpath` owns the transport-side fidelity helper.

**Why not add style presets**

The research did not justify turning the skill into a style chooser. The stronger pattern is adherence to a described direction, comparison to a preview image and revision through critique. Presets would make the skill feel powerful while weakening the judgment it exists to provide.

---

## 5. REAL-WORLD REFERENCES BECAME CRITIQUE-AGAINST GROUNDING

**Before**

The skill could critique against its built-in AI-default calibration and, before decoupling, against design-system reads through Open Design. It had no direct way to inspect the shipped-UI median for a category like pricing, onboarding or app navigation.

**After**

Phase 009 added Mobbin and Refero manuals to `.utcp_config.json`, authored `design_references_mcp.md`, `mobbin_tools.md` and `refero_tools.md`, then wired the references into `SKILL.md` and `design_inventory.md`. The endpoints returned auth challenges, all 10 tools resolved after reload and OAuth, and `mobbin_search_screens` returned real screen data on Node 24. Phase 011 changed the behavior from passive ON_DEMAND use to a hybrid gate: act with initiative when a reference clearly helps and a subscription is connected, ask when borderline and fall back otherwise. Phase 012 added catalog and playbook coverage for that routing.

**Impact**

The skill can name the expected real-world look and depart from it intentionally. It does not copy, reuse tokens or pick from a gallery. One reference calibrates the default, then the skill designs away from it.

**Why one reference**

One reference is enough to name the median. More references would turn critique into browsing and increase the risk that the agent copies a trend instead of making a deliberate choice.

---

## 6. OPEN DESIGN WAS DECOUPLED FROM THE LIVE SKILL

**Before**

`sk-interface-design` had about 101 references to the internal `mcp-open-design` skill and the Open Design app across 23 files. That made the design skill read like it depended on a private transport, which weakened its portability.

**After**

Phase 010 removed Open Design naming from live `sk-interface-design` content, moved `claude_design_parity.md` to vendor-neutral `real_ui_loop.md` and added `mcp-open-design/references/design_parity_transport.md` as the transport-side half. `mcp-open-design` still names `sk-interface-design` as its mandatory judgment partner, but `sk-interface-design` no longer names `mcp-open-design`. The reverse relationship stayed intact, and repo-wide live refs were repointed.

**Impact**

`sk-interface-design` now reads as a standalone Apache-2.0 skill that an external user can adopt alone. Open Design remains a consumer of its judgment, not a dependency embedded into it.

**Why one-way integration**

The design skill should be portable. Transport skills can require design judgment, but design judgment should not require a specific transport to make sense.

---

## 7. VALIDATION AND KNOWN LIMITS

**Before**

The work was a sequence of ideas: install the skill, test data adoption, explore parity, add reference grounding and clean up coupling. Each had risk around scope creep, bloated runtime files, undocumented behavior or live-tool assumptions.

**After**

The phases recorded concrete verification. `package_skill.py` validated `sk-interface-design` across install, data, docs and parity phases. `skill_graph_validate` returned `errorCount 0` after the reciprocal edge. Deep research fan-outs completed with 2 of 2 lineages succeeded for phases 002, 005 and 006. `validate_document.py` returned 0 issues on the catalog, playbook and reference docs where run. `validate.sh --strict` passed on the research, parity, decoupling and realignment phases where recorded. Mobbin and Refero resolved and invoked after the Code Mode launcher was pinned to Node 24.

**Impact**

The packet is not just documented as complete. Its main behavior changes have direct validation evidence, and its limits are named.

**Why preserve the caveats**

The live reference path depends on connected subscriptions, and the real-UI loop still needs end-to-end exercise on a live MagicPath project. The skill-advisor graph can also lag until a rescan. Naming these limits makes the completed state usable without pretending every adjacent operation is finished.

---

## CURRENT STATE

`sk-interface-design` is shipped as a standalone design judgment skill. It carries preserved frontend-design principles, measured design data, quality references, optional query-only search, `sk-doc` catalog and playbook surfaces, a vendor-neutral real-UI loop, Mobbin and Refero reference grounding, smart initiative/ask routing and decoupled Open Design portability.

The packet's 12 phase children are complete. The skill guides design and leaves implementation to `sk-code`. Mobbin and Refero provide critique-against grounding when connected. Open Design remains a one-way consumer through its own transport docs. The catalog and playbook now mirror the shipped capabilities, and the remaining caveats are operational: rescan advisor metadata when needed, connect subscriptions for live references and exercise the full real-UI loop on a live MagicPath project before treating that loop as proven end-to-end.
