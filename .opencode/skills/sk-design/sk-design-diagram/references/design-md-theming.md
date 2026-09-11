---
title: "Theming a diagram from DESIGN.md"
description: "The local, gated path from a v3 Style Reference to a diagram delivery: how each structural role is derived, what the terminal skin requires, and what a themed block records."
trigger_phrases:
  - "theme diagram from DESIGN.md"
  - "apply style reference to diagram"
  - "design-md diagram delivery"
  - "diagram role mapping"
  - "terminal skin reference gate"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Theming a diagram from DESIGN.md

`DESIGN.md` is a style reference, not a diagram form. The diagram packet applies one locally
available v3 reference to a copy of a form: it never fetches a reference, never repaints the stock
forms, and never guesses a colour a reference did not hold.

---

## 1. OVERVIEW

### Purpose

Gives a diagram delivery the look of a measured or hand-written brand reference the same way a
chart delivery already gets it, with the diagram's own role vocabulary — structural chrome across
three skins — derived, gated and recorded rather than mapped across from the chart's series model.

### When to Use

- A request names a `DESIGN.md`, a design system, or a look found somewhere that a reference
  generator has turned into a v3 reference file.
- A themed diagram copy is wanted for review while the stock corpus stays untouched.
- The stock look itself is wanted as one reference among several: `--default` is the reference the
  corpus's own palette is written down in.

### Core Principle

A role is filled by what the reference says about it, and when the reference says nothing the role
is either derived mechanically from a role it did say something about, or it keeps the stock value
and the run says so by name. The stock accent's recorded departure is never re-derived into a pass
for a themed value.

### Key Sources

- The applicator: [`apply-design-md.cjs`](../scripts/apply-design-md.cjs).
- The token source it reads on every run for roles, gates and departures:
  [`diagram-palette.json`](../assets/style-reference/harness-diagram/diagram-palette.json).
- Contrast arithmetic, shared with the corpus checker: [`color-gates.cjs`](../scripts/color-gates.cjs).
- The carried reference `--default` derives from and the corpus was written from:
  [`harness-diagram/DESIGN.md`](../assets/style-reference/harness-diagram/DESIGN.md), whose
  [`origin.md`](../assets/style-reference/harness-diagram/origin.md) records that it was authored
  from the packet's palette rather than measured from a product.

---

## 2. THE COMMAND

```bash
node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs \
  path/to/DESIGN.md --forms template-full --out scratch/themed
```

| Argument | Meaning |
| --- | --- |
| `<path>` or `--default` | The reference to theme from. `--default` reads the carried reference above; a path must be a local file. |
| `--forms a,b` | The forms to write, by file base name (`template`, `template-dark`, `template-full`, `template-terminal`). |
| `--all` | Every form in `assets/diagrams/`. |
| `--out <dir>` | Where the copies are written. Required; the directory is created after every gate has passed. |

There is no force option. A URL is refused by name rather than fetched, and an URL as the first
argument is refused before anything else is parsed. A `--forms` list may not be combined with
`--all`. Writing inside `assets/diagrams/` is refused: the stock forms are immutable, and this
script only ever writes copies.

A sibling `tokens.json` beside the reference is read when present, for its `darkMode` support flag
only; no flag passes it explicitly, because a reference that carries one carries it beside itself.

The out directory mirrors the source set, so files that are not forms — the library `README.md` —
travel unchanged.

`--default --all --out <dir>` must reproduce the stock forms byte for byte:

```bash
node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs \
  --default --all --out /tmp/dmd-default
diff -rq /tmp/dmd-default assets/diagrams   # no output
```

That diff is the property that says the carried reference and the corpus have not drifted apart. It
holds because the reference declares every role this corpus uses, so the derivation reproduces each
stock value exactly rather than approximately.

---

## 3. WHAT THE PARSER READS

The parser follows the v3 headings rather than searching for arbitrary prose:

| Reference section | Required shape | Used for |
| --- | --- | --- |
| `## Tokens — Colors` | `Name`, `Value`, `Token`, `Role` table | Tier-one role declarations, and the row pool every selection rule measures |
| `## Tokens — Typography` | First typeface heading plus its immediate `Substitute` line | Shape check only; a diagram carries its font stacks as CSS variables |
| `## Tokens — Spacing & Shapes` → `### Border Radius` | `Element`, `Value` table | Shape check only; a diagram carries its corners as inline attributes |

A missing heading, table, substitute or terminator is reported by name and stops the run. A
reference with fewer than four usable six-digit colour rows is refused the same way. Six-digit
values are the rows the selection rules can measure; the alpha-composed `rule`, `rule-solid` and
`accent-tint` rows are read by tier one but never enter that pool.

The typography and radius sections are read but not applied. A reference missing either is not a
complete v3 reference — the same contract the chart sibling enforces — and the corpus's corners and
font stacks are not what a colour table is applied to.

---

## 4. THE ROLE RULE: TWO TIERS

Every role of every skin is filled by the first of these two tiers that has an answer.

**Tier one — the reference names the role.** A `Token` cell naming a diagram role directly, in the
shape `--color-<role>`, `--color-<role> (dark)` or `--color-<role> (terminal)`, fills that role
verbatim from the same row's `Value`. A bare `--color-<role>` fills the light skin; `(dark)` and
`(terminal)` fill the skin they name. A Token cell naming anything else — a generic
`--color-primary`, a chart token, a custom-property this vocabulary does not define — is ignored,
and the role falls through to tier two.

**Tier two — the plan's selection rules.** For any role no `Token` cell names, §5's rules select a
row, derive a value mechanically, or fall back. Tier two is unchanged by the tier-one rule, and it
is the whole derivation for a reference written in another vocabulary.

### Why tier one exists

A tier-one rule is what makes `--default` exact. The selection rules cannot reproduce this corpus
on their own, because they were written to generalise over a generic table and the corpus is one
particular reading of one particular table:

- The lightest background-tagged row in any faithful reference of this language is the near-white
  backend fill, not the off-white ground, so a pure rule picks `#ffffff` for `paper`.
- The four darkest neutral rows in the carried reference order as `#0a0a0a`, `#141414`, `#1b1b1b`,
  `#2b2b2b`; the stock terminal skin assigns `#141414` to `paper` and `#1b1b1b` to `bar`, which is
  not the order a luminance-ascending group produces.
- `high-level-chevron` is deliberately not the ink in this corpus (`#3d4460` against `#2d3142`),
  while tier two aliases it to the selected ink.

Filling each role from the reference's own declaration removes all three disagreements without
weakening the rules: a reference that says `--color-paper` has answered the question `paper` asks,
and the tier-two rules stay the answer for a reference that has not.

---

## 5. THE ROLE-MAPPING TABLE

`light` / `dark` mean the skin the target form's marker declares. `isBackground`, `isText`,
`isChromatic` (saturation ≥ 24%) and "lightest/darkest" are the same primitives the chart sibling
applies to a parsed `Colors` table; both grounds are picked independently from the same row pool.

| Role | Skin(s) | Tier-two selection | Fallback when none can fill it |
| --- | --- | --- | --- |
| `paper` | light | Lightest row naming a background, surface, canvas, ground, panel or fill | Never fails — the lightest row of the table |
| `paper` | dark | Darkest row by the same test | Never fails — the darkest row of the table |
| `ink` | light | Darkest neutral row naming text, foreground or ink | Never fails — the darkest row of the table |
| `ink` | dark | Lightest row by the same test | Never fails — the lightest row of the table |
| `muted` | light, dark | Neutral text-tagged row nearest `textOnPaper` against `paper`, excluding the ink's row; a tone under the gate is mixed toward the ink by the least amount that clears it | The ink let out toward `paper` as far as the text gate allows |
| `accent` | light, dark | The single most-saturated chromatic row clearing `markOnPaper` against `paper` — one pick, not a ladder | The run fails by name: a themed accent is never excused by the stock value's recorded departure |
| `paper-2` | light | Second-lightest background-tagged row after `paper`, else the second-lightest row overall | Collapses to `paper`, logged in the mapping line |
| `soft` | light, dark, terminal | One step along the table's neutral text ladder past `muted`, in the direction the ground leaves free; never held to the text gate, since it carries structure only | `muted` mixed toward `paper` by a fixed half step — a stated synthetic value |
| `rule` | light, dark | Composed: the chosen `ink` at alpha 0.12 | Never fails; no row dependency |
| `rule-solid` | light, dark | Composed: the chosen `muted` at alpha 0.25 | Never fails |
| `accent-tint` | light | Composed: the chosen `accent` at alpha 0.08 | Never fails |
| `accent-tint` | terminal | Composed: the chosen `accent` at alpha 0.12 | Never fails |
| `link` | light, dark | A chromatic row naming link, anchor, interactive or hyperlink; absent that tag, the second most-saturated chromatic row that clears `markOnPaper` and sits ≥ 30° of hue from `accent` | Keeps the stock value, unthemed, and the mapping line says so |
| `backend-fill` | light | Background-tagged row distinct from and lighter than `paper` (the stock value is near-white against an off-white ground) | Collapses to `paper`, logged |
| `high-level-chevron` | light | Not selected from the table: aliased to the chosen `ink` | Never fails |
| `series-1` … `series-5` | light, opt-in | Chromatic rows clearing `markOnPaper`, taken greedily by hue distance from the hues already chosen, then neutral text tones darkest-first with the ink held back last | A form declaring a `series-N` role is refused by name under `--forms`, and skipped with a note under `--all`, when fewer than five slots fill |
| `page`, `bar`, `paper`, `border` | terminal | The four darkest distinct neutral or background-tagged rows, by luminance ascending: `page` darkest, then `bar`, then `paper`, then `border` | The whole terminal skin stays stock, and the run says so |
| `ink`, `muted`, `soft` | terminal | The dark skin's rules run against the terminal `paper` | The dark skin's fallbacks |
| `accent`, `accent-tint` | terminal | The dark skin's rules run against the terminal `paper` | The dark skin's rules |

---

## 6. THE TERMINAL CONDITIONAL

The terminal skin is a third, structurally different register with no chart equivalent, and it is
themed only when the reference actually supports a dark environment. Both conditions must hold:

1. The reference declares dark support — a `**Theme:**` line naming dark, or a sibling `tokens.json`
   with a supported `darkMode`.
2. The table supplies at least four distinct usable neutral or background-tagged rows darker than
   its chosen light `paper`.

When either fails, all nine terminal roles keep the token source's values and the run prints a
`NOTE` naming the reason. A terminal-skinned form named through `--forms` fails by name instead,
because a caller who asked for that form specifically asked for a skin no reference qualified; under
`--all` the form is written with its stock bytes and the note says so.

Four dark layers cannot be invented from a light-only table. That is the failure this gate exists to
prevent: a delivery that claims a dark register the reference never described.

---

## 7. GATES BEFORE WRITING

Thresholds are read from `diagram-palette.json` on every run; the colour arithmetic is the same
module the corpus checker uses, so one transfer curve and one rounding produce both results.

- `textOnPaper` (4.5:1) applies to `ink`, `muted` and `soft` — the roles that may carry text.
- `markOnPaper` (3.0:1) applies to `accent` and every other gated role against its own ground.
- `accentAgainstInk` (1.5:1) applies to `accent` against the skin's `ink`.
- The token source's `ungated` list, its structure roles (`paper`, `page`, a second paper tone,
  terminal `soft`) and its non-hex composed roles are not measured: `backend-fill`, `bar`,
  `border`, `high-level-chevron`, `page`, `rule`, `rule-solid` and `series-1..5` sit in that list.
- A value under its gate is excused only when the skin, the role and the measured ratio all match a
  recorded departure. Three are recorded: the light accent at 2.863:1, the light `soft` at 3.48:1
  and the terminal `soft` at 2.76:1. A themed value that lands on one of those measurements would be
  excused the same way; a themed accent that misses the mark gate is refused instead.

Every selected form's full palette is derived and gated in memory before any file is written. One
failure anywhere aborts the whole run:

```text
FAILURE template light accent ratio=1.89:1 gate=markOnPaper 3:1 against #f5f5f5: nearest clearing value #ca7956
RESULT: FAILED
```

A pass prints one `MAPPING` line per role per skin — which tier filled it, from which row, and its
ratio against the ground — then writes the selected forms and ends with `RESULT: PASSED`. Exit code
`0` is a pass, `1` is a failed gate, `2` is an unusable input (no reference, a URL, a missing
heading, a refusal to write into the stock directory).

---

## 8. WHAT CHANGES IN A DELIVERY

### The block and the literals

The palette block's own declarations are rewritten value by value, preserving every other byte of
each line: indentation, role name, spacing before the value and any trailing comment.

Outside the block, every literal a role's stock value matches is remapped too, because the corpus
keeps some roles as plain hex in the markup — `#4f5d75` on an arrow marker, `#eb6c36` on an accent
marker, `#ffffff` on a panel — and a block-only substitution would leave those marks stock. The map
is built from the stock skin's values, so a themed literal is always recognised against the bytes
the file actually carries. A six-digit hex literal the stock skin does not carry is refused by name
rather than guessed; a shorthand or eight-digit hex is not a role literal and is left alone.

### Provenance, and when it is written

A theme that repaints the block rewrites its marker and records where the values came from:

```css
/* DIAGRAM_PALETTE:BEGIN skin=light system=design-md */
/* DESIGN.md provenance: path=.opencode/skills/.../DESIGN.md sha256=<64 hex> generator=1.0.0.0 */
```

The path is repository-relative when the reference lives inside the repository, and the one given on
the command line otherwise. The hash is the SHA-256 of the input file.

A reference that derives exactly what the block already carries writes neither: the block keeps its
stock marker and no comment is inserted. Provenance says where a value came from, and a block whose
values are the file's own has nothing to vouch for. That is also what makes the identity run
observable — `--default` writes the stock bytes because the carried reference is the corpus's own
palette written down, not because a comparison was loosened. The rule is per block: a reference that
repaints one skin and not another stamps only the block it changed.

A form that already carries `system=<id>` is refused by name; theming is applied to a stock form.

---

## 9. RELATED

- [`apply-diagram-tokens.cjs`](../scripts/apply-diagram-tokens.cjs) — the stock-palette applicator;
  it repaints the same corpus from `diagram-palette.json` and is unchanged by this path.
- [`check-diagram-corpus.cjs`](../scripts/check-diagram-corpus.cjs) — the corpus checker, including
  the `derivation-gates` family that gates a palette block's inline values.
- [`foundations/style-guide.md`](foundations/style-guide.md) — the role vocabulary a themed delivery
  still speaks.
- [`foundations/derivation-record.md`](foundations/derivation-record.md) — why each stock value is
  what it is.
