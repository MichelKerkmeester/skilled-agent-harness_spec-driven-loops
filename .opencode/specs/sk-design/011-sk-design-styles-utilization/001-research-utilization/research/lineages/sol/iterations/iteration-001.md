# Iteration 1: Corpus Inventory and Mode-Contract Mapping

## Focus

Inventory the current `sk-design/styles/` corpus, quantify representative bundle and document characteristics, and map the available artifacts to the hub and five mode contracts. The prompt describes an approximately 1,290-style library, but the on-disk corpus was changing during this iteration; this report therefore treats every count as a timestamped snapshot rather than a stable total. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-1.md:16-24]

## Actions Taken

1. Discovered the style corpus and all six `sk-design` contracts, while confirming that the intended iteration and delta files did not already exist.
2. Ran a read-only corpus inventory; the first pass exposed the non-style `_harness` directory and was replaced by a `*/DESIGN.md`-anchored bundle inventory.
3. Quantified bundle completeness, byte-size distributions, `DESIGN.md` line-count distributions, token scalar-leaf distributions, JSON validity, and dominant top-level token shapes.
4. Read the hub plus interface, foundations, motion, audit, and md-generator contracts to identify their existing routing and evidence boundaries.
5. Read compact, median, and large representative artifacts (`19-86`, `base44`, `clickup`, `kobu`, and `column`) and performed the narrowest freshness recheck needed to explain the changing count.

## Findings

1. **The corpus was actively growing during the iteration, so its cardinality is not presently a stable indexing input.** Three read-only snapshots observed 974, then 977, then 981 complete style bundles; the final snapshot at `2026-07-18T09:31:30.875369Z` showed newly modified bundles arriving roughly every 9–10 seconds. This conflicts with, but may be progressing toward, the prompt's approximately 1,290-style estimate. A build should pin a revision or wait for a quiescence window before publishing count/checksum metadata. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-1.md:16-24] [INFERENCE: deterministic read-only inventories of `.opencode/skills/sk-design/styles/*/DESIGN.md` during this iteration, plus bundle mtimes from the final snapshot]

2. **A style is a uniform six-artifact bundle, but the artifact classes differ sharply in context cost.** At the stable 977-bundle measurement point, all 977 bundles contained `DESIGN.md`, `design-tokens.json`, `css-variables.css`, `tailwind-v4.css`, `source.md`, and one `*-canonical.json`, totaling 85,374,474 bytes. Median sizes were 51,109 bytes for canonical JSON, 19,584 for `DESIGN.md`, 9,936 for design tokens, 2,119 for CSS variables, 1,555 for Tailwind, and 780 for provenance. The representative source file explicitly enumerates the five generated siblings; `source.md` itself is the sixth artifact. [SOURCE: .opencode/skills/sk-design/styles/kobu/source.md:1-12] [INFERENCE: deterministic byte and completeness aggregation over the 977 `*/DESIGN.md`-anchored bundles]

3. **The two most useful retrieval payloads serve different purposes: `DESIGN.md` preserves a coherent design identity, while `design-tokens.json` supports deterministic field-level filtering.** Across the 977-bundle snapshot, `DESIGN.md` ranged from 169 to 537 lines (median 373), while token documents ranged from 46 to 667 scalar leaves (median 202). Kobu's reference ties its aesthetic thesis to named colors, typography, spacing, components, and explicit do/don't constraints; the compact 19–86 JSON expresses the same machine-readable token primitives plus extraction metadata. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:1-18] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:159-177] [SOURCE: .opencode/skills/sk-design/styles/19-86/design-tokens.json:1-20] [SOURCE: .opencode/skills/sk-design/styles/19-86/design-tokens.json:43-89] [INFERENCE: line and scalar-leaf distributions from all 977 measured bundles]

4. **The token schema is regular enough for a compact structural index without flattening every value into embeddings.** All 977 sampled `design-tokens.json` files parsed successfully. The three dominant top-level shapes covered 961/977 bundles and shared `$extensions`, `color`, `font`, `spacing`, `surface`, and `typography`, with `radius` and/or `shadow` as the principal variations. The smallest sample has two colors and one font, while the largest begins with a much denser semantic palette; this makes per-axis counts, names, descriptions, and provenance useful deterministic ranking features. [SOURCE: .opencode/skills/sk-design/styles/19-86/design-tokens.json:1-20] [SOURCE: .opencode/skills/sk-design/styles/base44/design-tokens.json:1-80] [SOURCE: .opencode/skills/sk-design/styles/clickup/design-tokens.json:1-100] [INFERENCE: JSON validation and top-level-shape aggregation over all 977 measured token documents]

5. **Existing contracts imply mode-specific consumption rather than one universal retrieval payload.** The hub should route and carry only a compact candidate manifest because it explicitly owns no per-mode logic; its smallest-useful-mode policy is already the first relevance filter. [SOURCE: .opencode/skills/sk-design/SKILL.md:13-15] [SOURCE: .opencode/skills/sk-design/SKILL.md:140-142] The provisional mode mapping is:
   - **interface:** load one coherent candidate's `DESIGN.md` plus `source.md` as a grounding reference, then critique/deviate rather than copy; the contract asks for real-system grounding and says a real-world reference is one reference, never copied. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-90]
   - **foundations:** retrieve axis-specific `design-tokens.json` slices (color, type, layout/spacing), optionally joined to the selected `DESIGN.md` rationale; its router is explicitly axis-based and permits multi-axis loading only when the task needs it. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:55-80] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:85-103]
   - **motion:** retrieve only motion-bearing fields or matching narrative sections when present; otherwise do not load a style merely because it matches static aesthetics, because the contract routes by temporal concern and makes static-token coordination on-demand. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:51-66] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:97-113]
   - **audit:** retrieve the selected reference's do/don't constraints, provenance, and relevant token slices as comparison evidence, not as a replacement for target evidence; the contract owns slop/token-misuse detection and requires evidence-specific audit resources. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23-29] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-115]
   - **md-generator:** do not let corpus retrieval override live measured extraction; use at most one corpus pair for STUDY/format calibration because this mode captures and validates source truth and its examples are explicitly one-at-a-time study artifacts. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-15] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:109-122]

6. **Provenance is present, but the representative metadata is not a complete rights record.** Kobu's `source.md` records a Refero style URL, original site, screenshot, style UUID, and capture timestamp, but no explicit license or allowed-use field. Retrieval results therefore need provenance surfaced alongside every candidate, and later research must test license-field coverage corpus-wide rather than assuming a reference is reusable because it is indexed. [SOURCE: .opencode/skills/sk-design/styles/kobu/source.md:3-12] [INFERENCE: absence of an explicit license field in the representative provenance record limits what can be concluded about reuse rights]

## Questions Answered

- Current corpus-shape subquestion: answered for the measured 977-bundle snapshot, with the later 981-bundle freshness observation explicitly separated.
- Provisional mode-to-artifact fit: answered sufficiently to constrain later substrate evaluation, but not enough to close the compound mode-consumption key question.

## Questions Remaining

All five registry key questions remain open. This iteration narrows the evidence base but does not yet choose a substrate, settle coherent-style versus synthesis rules, define anti-slop proof gates, specify refresh tooling, or rank strategies by leverage and cost.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-1.md:16-24`
- `.opencode/skills/sk-design/SKILL.md:13-15,140-184,203-204`
- `.opencode/skills/sk-design/design-interface/SKILL.md:16-17,71-90`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:55-103`
- `.opencode/skills/sk-design/design-motion/SKILL.md:51-113`
- `.opencode/skills/sk-design/design-audit/SKILL.md:23-29,95-115`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:10-15,109-122`
- `.opencode/skills/sk-design/styles/kobu/DESIGN.md:1-180`
- `.opencode/skills/sk-design/styles/kobu/source.md:1-12`
- `.opencode/skills/sk-design/styles/19-86/design-tokens.json:1-90`
- `.opencode/skills/sk-design/styles/base44/design-tokens.json:1-140`
- `.opencode/skills/sk-design/styles/clickup/design-tokens.json:1-100`
- `.opencode/skills/sk-design/styles/column/DESIGN.md:1-100`
- Read-only Python inventory outputs for bundle counts, completeness, byte/line/leaf distributions, JSON validity, schema shapes, and mtimes.

## Assessment

- New information ratio: 1.00
- Novelty calculation: 6 fully new findings, 0 partially new, 0 redundant; `(6 + 0.5 × 0) / 6 = 1.00`.
- Questions addressed: retrieval substrate constraints; per-mode consumption; provenance/size/staleness risks.
- Questions answered: no full registry key question closed; two assigned-focus subquestions were answered.
- Edge case: contradictory evidence — the prompt's approximately 1,290 estimate and three changing on-disk counts cannot yet be reconciled as one stable corpus total.

## Reflection

- **What worked and why:** anchoring bundles on `*/DESIGN.md` excluded infrastructure and exposed a highly regular six-file unit; pairing aggregate measurements with compact/median/large samples kept quantitative facts connected to real document semantics.
- **What did not work and why:** the first directory-based scan treated `_harness` as a style and failed when `DESIGN.md` was absent. Broad directory count is therefore not a valid corpus cardinality measure.
- **What I would do differently:** run future inventory/build experiments against a pinned commit or after a defined quiescence interval, record a corpus manifest hash, and separate ingestion-in-progress from published-index state.

## Dead Ends or Ruled Out

- Counting every direct child of `styles/` as a style: ruled out because `_harness` is infrastructure, not a six-artifact style bundle.
- Treating `~1,290` as a stable current total: ruled out until the active corpus write/import process settles or a revision is pinned.
- Loading the full corpus, or even all `DESIGN.md` files, into a mode context: ruled out by the measured 85.4 MB bundle footprint and roughly 373-line median narrative; retrieval must stage compact metadata before selected artifacts. [INFERENCE: corpus-size and document-length measurements in this iteration]

## Next Focus

After confirming or pinning a quiescent corpus snapshot, compare a layered retrieval design — deterministic manifest/filtering first, lexical and/or embedding ranking second, then mode-specific artifact hydration — against repository-native indexing patterns. Measure index size, query determinism, context payload, refresh behavior, and failure handling without implementing the index.
