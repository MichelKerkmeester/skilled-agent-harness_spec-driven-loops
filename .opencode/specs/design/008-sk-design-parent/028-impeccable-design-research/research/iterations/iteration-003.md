# Focus

Read the next untouched slice named by iteration 2: `cli/engine/detect-antipatterns.mjs` for detector catalog semantics and `docs/STYLE.md` for prose-denylist semantics. Crosswalk those against current `sk-design` audit and interface copy targets without reading unscoped CLI internals or provider duplicate trees.

# Actions Taken

1. Read prior iteration narratives and the state log. Iteration 1 covered shared design laws; iteration 2 covered audit, critique, polish, and harden command references.
2. Read the scoped detector entry file at `external/impeccable-main/cli/engine/detect-antipatterns.mjs`. The file is a public API facade, not the registry itself: it exports `ANTIPATTERNS` and helper accessors from `./registry/antipatterns.mjs`, and exports rule/check engines, but does not contain rule IDs or descriptions. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/cli/engine/detect-antipatterns.mjs:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/cli/engine/detect-antipatterns.mjs:13] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/cli/engine/detect-antipatterns.mjs:17]
3. Read `external/impeccable-main/docs/STYLE.md`, including its paragraph bar, prose principles, enforced denylist, and non-regex judgment patterns. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/docs/STYLE.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/docs/STYLE.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/docs/STYLE.md:88]
4. Opened current `sk-design` targets before classifying candidates: `design-interface/references/design-process/copy_and_mock_data.md`, `design-audit/references/ai_fingerprint_tells.md`, and `design-audit/references/anti_patterns_production.md`. Also searched `shared/register.md` and `shared/anti_slop_principles.md` for overlapping register and anti-slop rules.
5. Classified prose-denylist material into net-new copy-gate refinements, already-covered content discipline, and out-of-scope validator/editorial infrastructure.

# Findings

## Net-New Or More Specific Adoption Candidates

| ID | Classification | Impeccable source | Verified sk-design target | Finding | Minimal surgical edit |
| --- | --- | --- | --- | --- | --- |
| I3-F001 | NET-NEW copy specificity test | `docs/STYLE.md` line 5 and line 99 | `design-interface/references/design-process/copy_and_mock_data.md` has a self-audit for unclear referents, forced metaphor, and LLM-thoughtful copy at lines 65-76, but it does not include a product-specificity or competitor-swap test. | The strongest reusable prose rule is: every paragraph or visible copy block needs one sentence that could only belong to this product, surface, or domain. If a competitor name can be swapped in without falsifying it, the copy is generic. | Add to `copy_and_mock_data.md` Section 3 after the self-audit bullets: require one specific claim, example, name, number, or domain fact per paragraph/major text block; rewrite anything that survives a product-name swap. |
| I3-F002 | NET-NEW rhythm and structure check for brand/editorial copy | `docs/STYLE.md` lines 13-20 and lines 92-96 | `copy_and_mock_data.md` catches banned phrases and visible-string failures, but its content sweep at lines 145-159 does not check uniform sentence length, triadic list habits, five-section essay structure, or synthetic balance. | sk-design already catches copy cliches; impeccable adds a shape-level writing check that matters on landing pages, portfolio pages, long hero/supporting copy, and editorial brand surfaces. | Add a compact "shape and rhythm" check to `copy_and_mock_data.md` Section 8: vary sentence length and list counts, avoid repeated triads and formulaic intro/three-sections/conclusion layouts, and do not write equal-length pros/cons when the recommendation is clear. |
| I3-F003 | NET-NEW expansion to the banned phrase list | `docs/STYLE.md` lines 31-33, 40-42, 49-55, 67-75, and 80 | `copy_and_mock_data.md` already bans "Elevate", "Seamless", "Empower", "Delve", "Tapestry", and related AI-copy filler at line 57, but it lacks several impeccable terms and opener/transition patterns. | The sk-design copy gate should absorb a small subset of STYLE's denylist as UI/landing-page copy smells, not as a separate validator: `load-bearing`, `highest-leverage`, `biggest unlock`, `reflex defaults`, `collapses into monoculture`, unsupported `data-driven`, `robust`, `underscore`, `pivotal`, `in today's`, `gone are the days`, `whether you're`, `let's dive in`, `in summary`, `in conclusion`, `moreover`, and `furthermore`. | Extend the Section 3 banned filler list in `copy_and_mock_data.md`; keep the rule as an authoring/audit sweep, not build-time regex infrastructure. |
| I3-F004 | NET-NEW editorial opening guidance for longer visible copy | `docs/STYLE.md` lines 9-12 and lines 17-20 | `copy_and_mock_data.md` says copy must be specific, active, and register-consistent at lines 57-64 and 112-125, but it does not tell the author how to start a long section without throat-clearing. | For brand and editorial surfaces, "open with the wrong belief, strongest claim, or example" is a useful craft move. Product UI microcopy should remain functional, but long marketing sections benefit from this opener rule. | Add an optional brand/editorial subsection to `copy_and_mock_data.md`: for paragraphs longer than microcopy, start with a concrete claim, misconception, or example; do not open with guide-style throat-clearing. |

## Already Covered

| Impeccable slice | Verified coverage |
| --- | --- |
| Real names, real numbers, and grounded claims | STYLE says to use names and numbers at line 11. `copy_and_mock_data.md` already requires grounded or explicitly mock numbers and bans fake precision at lines 95-104; it also requires plausible names, brands, avatars, dates, and logos at lines 80-91. |
| Active voice and direct verbs | STYLE line 12 says verbs lead and nouns follow. `copy_and_mock_data.md` already requires active voice and stable action naming at line 60 and in the state-copy formulas at lines 121-123. |
| Marketing filler terms already in sk-design | STYLE bans `seamless`, `elevate`, `empower`, `delve`, and `tapestry` at lines 49-60. `copy_and_mock_data.md` already bans those same words at line 57. |
| One copy register and reader-respecting product voice | STYLE line 17 says not to pad suggestions with weak "consider" language. `copy_and_mock_data.md` already requires one register across the surface and posture-specific brand/product voice at lines 108-125. |
| Generic placeholder copy and generic alt text | `copy_and_mock_data.md` already bans lorem, placeholder labels, generic alt text, generic seeds, fake screenshots, and decorative captions at lines 41-49 and 129-141. STYLE's generic-copy concerns should refine this gate, not duplicate it. |
| Detector categories at a very high level | The detector facade exports rule families for borders, motion, glow, typography, layout, HTML patterns, browser/static/regex engines, and design-system checks at lines 17-35. sk-design already has audit homes for those categories: `ai_fingerprint_tells.md` lines 38-120 and `anti_patterns_production.md` lines 18-95. This is only category overlap; rule-level IDs and semantics remain unverified. |

## Scope-Blocked Or Out Of Scope

| Slice | Classification | Reason |
| --- | --- | --- |
| `ANTIPATTERNS` rule catalog IDs and descriptions | SCOPE-BLOCKED | The permitted file is a facade. It exports the catalog from `./registry/antipatterns.mjs` but does not contain IDs, categories, messages, or detector descriptions. Reading that registry would exceed this iteration's explicit corpus boundary. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/cli/engine/detect-antipatterns.mjs:13] |
| Detector CLI, browser, regex, static HTML, filesystem, and design-system plumbing | OUT-OF-SCOPE-INFRA | The facade exports those engines and checks at lines 17-46, but the research brief asks for rule semantics, not implementation plumbing. sk-design should not adopt a parallel detector engine. |
| `validateProse` build enforcement | OUT-OF-SCOPE-INFRA | STYLE frames its denylist as build-enforced by `scripts/build.js` at line 24. The reusable sk-design piece is the prose rule, not the external build step or regex allowlist policy. |
| Absolute em-dash and punctuation validator | RULED OUT FOR SK-DESIGN | STYLE bans em dashes and double hyphen substitutes at lines 82-86. That is an editorial house style, not a visual-design methodology rule; sk-design can prefer direct copy and varied sentence relationships without adding punctuation policing. |
| Full docs/README editorial brief | OUT-OF-SCOPE FOR SK-DESIGN | STYLE is written for homepage, sub-pages, command editorials, tutorials, and READMEs at line 3. sk-design should adopt only visible-product-copy and brand-surface guidance that affects UI/design output. |

# Questions Answered

- Q1 is partially answered for `docs/STYLE.md`: most content discipline overlaps with `copy_and_mock_data.md`, but four copy-gate refinements are genuinely useful and more specific.
- Q1 is not answered for detector rule semantics. The scoped detector file proves the catalog exists, but it does not expose the rule catalog content.
- Q2 is partially answered: all STYLE-derived adoption candidates belong in `design-interface/references/design-process/copy_and_mock_data.md`. Detector semantics, if later permitted, should crosswalk into existing `design-audit` references rather than a new system.
- Q3 is partially answered: adopt the prose denylist as authoring/audit guidance inside the existing copy gate; do not adopt build-time prose validation, a parallel detector engine, or another score/register system.

# Questions Remaining

- Q1 remains open for the actual anti-pattern catalog semantics unless a later iteration is allowed to read `cli/engine/registry/antipatterns.mjs` or another file that contains `ANTIPATTERNS` definitions.
- Q1 remains open for the remaining command references outside the audit cluster and for domain references such as brand, product, colorize, typeset, layout, animate, delight, bolder, quieter, shape, distill, clarify, craft, extract, document, and interaction-design.
- Q2 remains open for detector-derived targets after the catalog can be inspected.
- Q4 remains open until the backlog is prioritized across the remaining corpus slices.

# Next Focus

Read the brand/product/register and visual-craft command references next: `brand.md`, `product.md`, `colorize.md`, `typeset.md`, and `layout.md`. Crosswalk them against `shared/register.md`, `design-foundations` color/type/layout references, and `design-interface` process references. Carry forward one explicit blocker: detector catalog semantics cannot be extracted from `detect-antipatterns.mjs` alone under the current read boundary.
