# sk-design changelog digest

Skill path: `.opencode/skills/sk-design/`. Versions covered: v2.0.0.0 only (oldest to newest). The changelog directory holds exactly one entry, so "last 10" resolves to all of them. Date range: none, the entry carries no date field in its frontmatter or body.

---

## Per version, newest first

### v2.0.0.0 (`changelog/v2.0.0.0.md`)

`sk-design` stopped being a single skill and became a parent hub that projects one design identity and routes to whichever mode owns the decision being asked for. Four modes were registered in `mode-registry.json` and routed by `hub-router.json` plus the root `ROUTER.md`: `sk-design-fundamentals` as the default, `sk-design-md-generator`, `sk-design-chart` and `sk-design-diagram`. A new `/design:` command surface landed with `/design:extract`, `/design:chart` and `/design:diagram`, while fundamentals routes by alias and carries no command of its own. Rendered screenshots for every form the two canvas modes ship were added beside each mode rather than inside `assets/`, so a human-facing picture never enters a mode's loadable leaf set. RENAME: `sk-create-chart` became `sk-design-chart` and `sk-create-diagram` became `sk-design-diagram` as both left `sk-doc` and took this hub's name, with both hubs edited together so no phrase was claimed twice. Fundamentals stopped being a UI-only skill, so slide decks, printed layouts and document surfaces became first-class alongside screen UI while the WCAG review pass still applies only where the surface is a screen. The root `SKILL.md` took the shape `sk-code` and `sk-doc` use, meaning a surface router with a stated discriminator, an explicit routing rule and an unknown-input fallback. BREAKING: `resourceContractVersion` in `mode-registry.json` changed from the string `"1.0.0"` to the number `1`, matching every peer hub, because the string read as absent to a numeric check and had silently disabled the manifest byte-drift, target-collision and reachability checks. The mode table gained a command column so a reader sees the same command the registry declares. Explicitly not changed: mode tool surfaces, with `sk-design-md-generator` remaining the only mutating mode, the chart corpus contract and its checker, which moved unmodified, and authored spec-folder records, benchmark reports and run artifacts, which keep the old names because they describe what was on disk when they were written.

---

## Facts the v4 draft gets wrong or misses

- The `resourceContractVersion` fix is missing from the draft entirely. `changelog/v2.0.0.0.md` §2 records that it was the string `"1.0.0"`, that a numeric check read that as absent, and that three manifest checks (byte-drift, target-collision, reachability) were silently disabled until it became the number `1`. The draft's design section (lines 259 to 289) never mentions it. This is the one silently-broken-gate fact in the entry and it is the kind of thing an adopter of the hub contract needs.
- The draft never states that `sk-design-md-generator` is the only mutating mode. `changelog/v2.0.0.0.md` §3 records mode tool surfaces as unchanged with the md generator as the sole mutator. Draft line 268 describes what the md generator does but not that it is the only mode that writes.
- Draft line 267 credits fundamentals with adding "interaction guidelines, motion principles and a WCAG review pass". `changelog/v2.0.0.0.md` §2 only records the UI-only-to-any-surface widening and says the WCAG pass still applies solely where the surface is a screen. Interaction guidelines and motion principles are not claimed anywhere in this entry, so that part of the draft is unverified against the changelog rather than contradicted.
- Draft line 272 says chart and diagram "gained the routing they never had". `changelog/v2.0.0.0.md` does not make that claim. It records the rename and the move plus registry and router registration, so the draft is asserting a before-state the entry does not support.
- Draft line 272 says "The `/interface:*` family that preceded all this is gone", and draft line 443 lists `/interface:*` to `/design:*` as a rename to adopt. `changelog/v2.0.0.0.md` §1 introduces the `/design:` surface as new but never mentions `/interface:*`, so the removal of that family is not evidenced by this changelog.
- The draft misses the packaging detail that the rendered screenshots sit beside each mode rather than inside `assets/`, specifically so they stay out of a mode's loadable leaf set. Draft line 272 mentions the screenshots but not the placement rule or its reason. `changelog/v2.0.0.0.md` §1 carries both.
- The draft's "One honest caveat" at line 274 (the hub not yet resolving through the compiled router contract) has no counterpart in `changelog/v2.0.0.0.md`. Nothing in the entry contradicts it, but nothing in the entry supports it either.
- Nothing in the draft's design section is directly contradicted by the changelog. The four mode names, the three commands, fundamentals as the default and command-less, the sk-doc origin of chart and diagram, and the screen-to-any-surface widening all match `changelog/v2.0.0.0.md`.

Note on scope: the draft's material on the chart register, `apply-design-md.cjs`, the local style library, the SQLite style database and the Open Design transport removal (draft lines 278 to 289) has no coverage in `changelog/v2.0.0.0.md` at all. That is not necessarily a draft error, since only one changelog entry exists for this hub, but none of it can be verified from the changelog directory.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `2.0.0.0`. `mode-registry.json` and `hub-router.json` both carry the same `2.0.0.0`.
- Identity: parent hub. `mode-registry.json` sits at the skill root `.opencode/skills/sk-design/`, alongside `hub-router.json`, `description.json` and `graph-metadata.json`, which is the hub-only metadata set. `hub-router.json` sets `defaultMode` to `sk-design-fundamentals`.
- Modes in `mode-registry.json`, in registry order, with the command each declares:
  - `sk-design-fundamentals`, command `null`, routes by alias.
  - `sk-design-md-generator`, command `/design:extract`.
  - `sk-design-diagram`, command `/design:diagram`.
  - `sk-design-chart`, command `/design:chart`.
- All four are `packetKind: "workflow"` with `backendKind: "surface-router"`. Every mode's `advisorRouting.routingClass` is `metadata`, so each is resolved by hub membership and holds no advisor entry of its own.
