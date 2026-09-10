# Research — upgrading sk-design-diagram to the sk-design-chart standard

**Run:** one lineage, GLM-5.3-Flash on cli-pi through the DevPass gateway at `--thinking max`,
five iterations under a `max-iterations` stop policy, one angle per iteration, 53 minutes.
**Findings:** 29, every one cited to a local file and line, in
`lineages/glm/iterations/iteration-001.md` through `-005.md`. The lineage's own running synthesis
(`lineages/glm/research.md`) carries iterations 1–4; the pi process ended after writing
iteration 5's file without appending its state record or the terminal synthesis, so the runner
marked the lineage failed on protocol. This file is the conductor's synthesis over all five.

## Verdict

Most of the chart standard transfers, and the research settles the three questions the parent
spec left open — by evidence, not preference:

- **One skin per file, all skins in one source.** 0 of 38 diagram files carry a
  `prefers-color-scheme` block; every dark value lives only in `template-dark.html`, every
  terminal value only in `example-loop-terminal.html`. The chart's dual-block model would cost
  27×2 and serve nobody: a diagram is exported at one ground. The palette *source* keeps light,
  dark and terminal; a file carries one sentinel block.
- **Keep the Google Fonts link; add fallback chains.** The onboarding doctrine itself defends
  Geist and Instrument Serif as load-bearing (`onboarding.md:87,139`). The chart's `no-external`
  family has a documented-exception precedent (`check-corpus.cjs:936-938`); the diagram's
  self-contained bar becomes "one whitelisted stylesheet, and every family declared with a
  fallback chain so the offline default renders structured rather than Times."
- **Keep onboarding and add an applicator; no second carried reference.** Extraction and
  application are already separate in the standard. The applicator's input is the diagram's own
  token source, `--default` reproduces the stock bytes, and the derivation record inherits the
  pin discipline (reference path + sha256) without carrying a second DESIGN.md.

## What the brief got wrong

The brief said 33 of 34 examples put `<title>` first and named `example-loop-terminal.html` as
the exception. Iteration 1 checked: the `<svg>` open tag spans lines 172–177 and `<title>` at
178 is the first child. The accessibility contract holds 34/34; the conductor's grep had been
fooled by a multi-line tag. Recorded here because a brief that carries a wrong fact into a
research run is the same defect as a doc that carries one into a corpus.

## What was measured

| Claim | Number | Where |
|---|---|---|
| Typed hex literals across 34 examples | 1,585 over 25 distinct values; 83% are four role values | it. 2 |
| Values absent from `foundations/style-guide.md` | 1 (`#3d4460`), which lives only in `type-high-level.md:418-419` | it. 1, 2 |
| Mandated marker trio (`arrow`, `arrow-accent`, `arrow-link`) | 11/34 define it; 23 fail; `id="dots"` unprefixed in 26/34 | it. 1 |
| 4px grid | fails in `example-flowchart.html:90-112`; the rule contradicts itself (`SKILL.md:403` vs `:337`) | it. 1 |
| Google Fonts | 38/38 files, the only remote host in any of them | it. 1, 3 |
| Contrast, computed | ink 11.8:1, muted 6.1:1, soft 3.48:1 (fails AA for 9px sublabels), accent 2.86:1 (below the standard's 3.0 emphasis gate) | it. 2, 3 |
| The 34 examples | 27 canonical (1:1 with the 27 type references) + 5 variant proofs + 2 import proofs; 0 decoration | it. 4 |
| Screenshots | 38/38, 1:1 with sources | it. 4 |
| Version fields | four, three values: SKILL 1.0.0.0, style-guide 1.0.0.5, playbook 1.0.0.5, README 1.0.0.7 | it. 4, 5 |
| `SKILL.md` | 37,116 bytes; the accessibility contract stated three times; 117 lines of router pseudocode ≈ 31% | it. 4 |
| Ownership | `SKILL.md:10` and both YAMLs say `sk-doc`; only `sk-design/mode-registry.json:89-110` registers it | it. 4 |

## The sort

Of 29 findings: **21 are enforceable by a checker family** (17 of them only after a contract
decision is signed), **6 are judged** (pairwise connector geometry until a 2D pass exists;
focal balance, type fit, the remove test, taste), **2 are phase governance** (the repaint and
the applicator are phases, not rules; their governance — `--default == stock`, copies not
in-place — is enforceable). The full sort is in `iterations/iteration-005.md` §6.

## The phases that follow, in the order the evidence forces

The order is not a preference. The mutation suite refuses a case whose base already fails, and
the corpus fails its own rules today (23/34 markers, the grid, 38/38 fonts); the CI doctrine is
"green with no backlog behind it"; the derivation record gates the applicator, the applicator
gates the repaint, the repaint gates the checker's families. So decisions first, mechanism
second, corpus third, assertions fourth, and the eye permanently last.

| Phase | Scope | Gate it ends on |
|---|---|---|
| **002 skin-contract** | Sign the seven decisions: the 4px exemption list (resolving `:403` vs `:337`); marker vocabulary and id-uniqueness scope; node and coral-element markup conventions; the self-contained bar (lean: keep the link + fallbacks); the emphasis mapping (accent 2.86 vs 3.0 — a departs row or a re-derivation); token-source scope (`#3d4460` promoted to a named role); the variant lattice (prove sketchy or descope). Write the derivation record: three lists, kinds, gates with `ungated` rows, tolerances, reference + sha256. Collapse to one locus each for the 4px rule, the accessibility contract, ownership and version; fix the two YAML names | Every one of the 25 values and both accent spellings traces to a primary + rule by grep; exactly one locus each; `--default-diff` defines stock |
| **003 applicator-and-sentinels** | `DIAGRAM_PALETTE:BEGIN skin=… :END` blocks, one per file, in the four templates; the applicator as a third hand-run script reading the token source, gates computed at apply against three grounds, copies to `--out` | `--default` over the four templates reproduces the stock bytes; below-threshold outputs refused |
| **004 corpus-and-catalog** | The derivation-driven repaint of 1,585 literals and four template roots (the deferred "v5.1" note discharged); 38 fresh captures; the sketchy proof or its descope; the question-keyed selection guide moves to `references/catalog.md` with machine columns, hand-verified in both directions; the one-locus pass over `SKILL.md` | examples − references = ∅; 38 PNGs re-captured; the shipped corpus passes every family to come, proven by a dress run |
| **005 checker-mutations-and-ci** | `check-diagram-corpus.cjs` with the families from iteration 1 as contracted, the derivation re-derivation, the catalog in both directions; the mutation suite with the four refusals, the completeness triple and reasoned exemptions; `.github/workflows/diagram-corpus.yml` grepping the literal `RESULT: PASSED` | Every registered family has a case or a reasoned exemption; every mutant fails its named family; CI green with no backlog |
| **006 capture-and-judgment** (permanent) | The playbook scenario formalized: a skin-pinned third capture requiring a different picture, the settled double-capture, the judged checklist; judgments that become computable graduate into the checker, logged, one way | A dated report per release through `run-manual-playbook-scenario.cjs`; no hand-authored report; every skip carries its reason |

## What this run could not settle

Whether connectors are marks (gated at 3.0) or structure (ungated); whether the accent departs
or re-derives; whether the PNGs are visually stale against the current skin (the vision tool was
unavailable to the lineage — the conductor's own read of four captures this week found them
current); whether the type-scale reflows the 4px grid under substitute fonts (unmeasured); the
precise ceiling wording in 26 of 27 type files. All of these are 002's decisions or 004's work.

## Run notes

The first launch was refused fail-fast for an unsupported `sandboxMode` field on cli-pi. The
runner's five-minute quiet watchdog fired once, at 17:27; initialisation landed at 15 minutes and
iterations followed at roughly eight-minute intervals. The lineage wrote all five iteration files
and stopped before its terminal records; the content is complete, the protocol is not, and the
runner said so.
