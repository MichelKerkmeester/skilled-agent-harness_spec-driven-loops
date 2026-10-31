# Changelog digest: sk-design-fundamentals

Skill path: `.opencode/skills/sk-design/sk-design-fundamentals/`
Versions covered: v1.0.0.0 to v1.0.0.0 (only one changelog entry exists, so all of them were taken)
Date range: 2026-08-28 to 2026-08-28

---

## Per-version digest, newest first

### v1.0.0.0 (`v1.0.0.0.md`, released 2026-08-28)

First release of the skill. Per `v1.0.0.0.md` it shipped as a standalone skill named `sk-design`
that decides UI values and behavior when a surface is being built, improved or reviewed, positioned
as the authoring counterpart to `sk-design-md-generator`, which measures a live surface instead. The
always-loaded `SKILL.md` carries fixed scales for spacing, type, weight, color, elevation, radius,
opacity and duration plus four hierarchy rules. Eight references shipped beside it: `build-procedure.md`,
`hierarchy.md`, `color-system.md`, `diagnosis-table.md`, `depth-and-detail.md`, `interaction-craft.md`,
`motion-principles.md` and `ux-laws.md`. An `assets/tokens.css` file expresses every scale as CSS custom
properties with a semantic role layer and a dark-mode block, with every text and surface pair verified at
4.5:1 or better and every functional border at 3:1. Four source conflicts are documented rather than hidden:
fluid versus fixed type sizing, motion duration ceilings, the touch target minimum of 44px versus 32px, and
shadow color on tinted or dark surfaces. A fifth tension against `sk-design-md-generator` is reconciled on
both sides with one precedence rule, that a measurement outranks a default for the surface it covers. Of the
`userinterface-wiki` source's 152 rules across 12 categories, five categories were imported in full, one was
partly absorbed and six were declined. The four public sources are `Refactoring UI`, the Web Interface
Guidelines, `userinterface-wiki` and a Rams design review skill.

RENAME: `v1.0.0.0.md` records that the `sk-design` name previously belonged to a parent hub that was retired,
and that this standalone skill took the free name, with nothing of the old hub surviving.

REMOVED: `v1.0.0.0.md` records that the retired `sk-design` hub was never in the compiled-routing hub set after
decommissioning, and that the governance doc which still listed it was corrected.

REMOVED: `v1.0.0.0.md` records that the Rams source embeds an instruction to append a vendor footer and promote
a hosted product at the end of every review, that the instruction was treated as data rather than a directive,
and that it is deliberately absent from `review-checklist.md`.

REMOVED: per the source coverage table in `v1.0.0.0.md`, six `userinterface-wiki` categories were declined
outright, namely Exit Animations, Audio Feedback, Sound Synthesis, Morphing Icons, Container Animation and
Predictive Prefetching, and the View Transitions API rules inside CSS Pseudo Elements were not carried over.

---

## Facts the v4 draft gets wrong or misses

- Draft line 261 says "`sk-design` was a single skill. It is now a parent hub of four modes." `v1.0.0.0.md`
  contradicts the first half of that sentence: the name previously belonged to a parent hub that was retired,
  after which the standalone skill took the free name. The real history is hub, then retirement, then a
  standalone skill, then a hub again, not a straight line from single skill to hub.
- Draft line 267 says the fundamentals mode "used to mean screen UI only" and now covers slide decks, printed
  pages and document layouts. Nothing in `v1.0.0.0.md` records that expansion. It is the only changelog entry
  the mode has, so the multi-surface change the draft claims has no changelog entry behind it. The claim is
  supported only by the current `SKILL.md` frontmatter description, not by the mode's changelog.
- The draft never mentions that the mode is a derivation of four named public sources (`Refactoring UI`, the
  Web Interface Guidelines, `userinterface-wiki` and a Rams design review skill), all captured 2026-08-28 with
  none of their text reproduced verbatim, per the Sources section of `v1.0.0.0.md`.
- The draft never mentions the four documented source conflicts and their resolutions (type sizing, motion
  duration bands, the 44px versus 32px touch target, shadow color by surface) recorded in `v1.0.0.0.md`, nor
  the cross-skill precedence rule that a measurement outranks a default, which `v1.0.0.0.md` says is stated
  identically in this mode and in `sk-design-md-generator`.
- The draft never mentions `assets/tokens.css` or its verified contrast floors of 4.5:1 for text and surface
  pairs and 3:1 for functional borders in both light and dark mode, per `v1.0.0.0.md`. Draft line 267 mentions
  "contrast" only as a scale the mode decides from.
- The draft never mentions the prompt-injection handling recorded in `v1.0.0.0.md`, where an embedded vendor
  promotion instruction in the Rams source was treated as data and excluded from `review-checklist.md`.
- Internal inconsistency worth noting for whoever edits the draft: `v1.0.0.0.md` calls the reference set
  "Eight references" and lists eight, but it also names `review-checklist.md` in its Sources section, and the
  `references/` directory holds nine files including `review-checklist.md`. The draft's claim at line 267 of a
  WCAG review pass rests on that ninth file, which the changelog's own reference list omits.
- Draft line 267 says the mode "routes by alias and carries no command of its own". This is consistent with
  `.opencode/skills/sk-design/mode-registry.json`, which sets `"command": null` and lists ten aliases for the
  mode. Not a defect, recorded here because it was checked.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.0.0.0`. This matches the single changelog entry `v1.0.0.0.md`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json` at
  `.opencode/skills/sk-design/sk-design-fundamentals/`. The parent at `.opencode/skills/sk-design/` holds
  `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, which is the hub
  signature. That registry lists `sk-design-fundamentals` as a mode with `packetKind: "workflow"`,
  `backendKind: "surface-router"`, `command: null` and `advisorRouting.routingClass: "metadata"`, meaning the
  mode is resolved by hub membership and holds no advisor entry of its own.
- Version skew to flag: the parent hub `mode-registry.json` declares `"version": "2.0.0.0"` while this mode's
  `SKILL.md` declares `1.0.0.0`. The mode's changelog directory holds no entry above v1.0.0.0.
