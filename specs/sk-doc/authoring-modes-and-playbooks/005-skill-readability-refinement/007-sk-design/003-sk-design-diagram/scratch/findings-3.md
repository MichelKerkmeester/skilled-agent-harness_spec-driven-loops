### .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/worked-example.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/worked-example.md:23 | 3, 4 | §1 repeats the intro's first sentence almost word for word, and the overview has no Purpose or When to Use heading. The page states its contents twice before naming an outcome. | Replace lines 21-23 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Gives a failing tree something to compare against, property by property.

    ### When to Use

    Use it as a shape to model a real decision tree on — replace the support-triage content with sourced nodes rather than copying it verbatim.
    ```
    The dropped sentence's claim (a compact validator-passing tree plus a breakdown of why it passes) is the intro's first sentence already, so every claim survives.

### .skilled/skills/sk-design/sk-design-diagram/references/catalog.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/catalog.md:13 | 3 | There is no intro after the H1. The page opens directly on `## 1. OVERVIEW`, so a reader gets no hook. | Insert after line 13: `Each row turns one reader question into one type and the canonical example that draws it, so the choice is made in one pass.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/catalog.md:17 | 4 | OVERVIEW is one six-sentence paragraph with no Purpose or When to Use, packing the machine-read contract, the bidirectional guarantee, the rewrite licence and the two ceiling rules. | Replace lines 15-17 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    The table between the sentinels below is machine-read: the corpus check matches its columns by header name rather than by position. Every row resolves to a canonical example under `assets/diagrams/`, and every canonical example appears in exactly one row.

    ### When to Use

    Read this before choosing a type.

    ### Reading the table

    - Prose outside the sentinels is never asserted on, so rewrite this page freely.
    - A ceiling cell carries the number and qualifier its own type file states.
    - `No stated ceiling` means the file states none of its own, so the general budget of 9 nodes and 12 arrows applies.
    ```

### .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:73 | 7 | Four independent refusal rules sit in one paragraph, so a reader scanning for whether a command is allowed has to parse prose. | Replace lines 73-76 with:
    ```markdown
    - There is no force option.
    - A URL is refused by name rather than fetched, and an URL as the first argument is refused before anything else is parsed.
    - A `--forms` list may not be combined with `--all`.
    - Writing inside `assets/diagrams/` is refused: the stock forms are immutable, and this script only ever writes copies.
    ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:167 | 5 | The role table selects values by `markOnPaper` and the text gate, but both thresholds and the departure rule are defined three sections later in §7, after the reader has applied the rule. | Move lines 206-218 to immediately after line 158, prefix them with `### The gates a selection must clear`, and leave §7 opening at line 220 with `Every selected form's full palette is derived and gated in memory before any file is written.`
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:268 | 6 | The `system=<id>` refusal sits at the end of §8, after every step it governs, so a reader learns a form was ineligible only after choosing and theming it. | Delete line 268 and add it as the last bullet of the §2 refusal list: `- A form that already carries `system=<id>` is refused by name; theming is applied to a stock form.`

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/README.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md:21 | 4, 6 | §1 has no Purpose or When to Use, and it says every value is "one of four kinds" while the fourth bullet is a retired key that applies to files rather than values. A live taxonomy and a migration note sit in one list. | Replace lines 19-26 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Classifies every diagram-skin value as hand-picked, derived or fixed, and records the rule or source behind it.

    ### When to Use

    Open it when a value's origin is in question, before a re-theme, or when the corpus check reports a drift.

    Every color role the diagram skin themes appears in exactly one of three lists: LIGHT (§2), DARK (§3) and TERMINAL (§4). Every value in those lists is exactly one of three kinds:

    - **primary**: a value chosen by hand, stated verbatim. A re-theme replaces primaries and nothing else.
    - **derived**: computed from a primary by a stated rule, for example `ink` at an alpha. This is stricter than the style guide's prose, which also calls `soft` and `link` "derived" although no rule reproduces them.
    - **fixed**: a value that never re-themes. Onboarding and hand-edits of the skin leave it untouched.

    ### Retired key: `untokenized`

    **untokenized** used to be a fourth kind, applying to files rather than values: it marked a file exempt from this record because it carried its own fixed skin. The key is gone. The one file that held the exemption carried a tone the dark skin never defined, at 4.44:1 under the text gate, so the exemption was hiding a defect rather than recording a decision; repointing that tone onto the dark muted role emptied the list and the key went with it. Every form now regenerates from this record.
    ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md:28 | 9 | "The applicator of a later phase reads this record" carries a development-phase reference into the body. | Replace with: `The applicator reads this record, and the corpus checker re-derives every value marked **derived** from the primaries recorded here.`

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md:66 | 1 | `### Colors` and `### Fonts` are H3 siblings of `### Step 2 — extract colors and fonts` rather than its children, so the outline reads as two extra steps and Step 2 as an empty heading. | Change `### Colors` at line 66 and `### Fonts` at line 79 to `#### Colors` and `#### Fonts`.

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md:17 | 3 | There is no intro after the H1. The page opens on `## 1. OVERVIEW`, so a reader gets no hook before the four dials. | Insert after line 17: `Open this before an import is redrawn or an export is sized.` followed by a blank line and `---`.

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md:15 | 3 | The intro opens with a pointer sentence, `This is the reference implementation of ...`, which names the artifact instead of telling the reader when to open it. | Replace line 15 with `The whole router in one piece, so a route can be followed from a request to the files it loads without leaving the page.` and move the old contract clauses into the §1 Purpose block below.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md:21 | 4, 7 | §1 has no Purpose or When to Use, and its first sentence packs the four router pieces into one clause. | Replace lines 19-24 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    The rules in [`../../ROUTER.md#3-machine-router`](../../ROUTER.md#3-machine-router) §3 (MACHINE ROUTER) are the contract; this file is the reference implementation, one way to hold them, kept whole here so the skill contract does not carry a fifth of its bytes as code.

    ### When to Use

    Read it when the routing rules have to be followed as working code.

    Four pieces carry the whole router:

    - the intent model that scores a request
    - the resource map that answers each winning intent
    - the load levels that say how much a run brings in
    - the UNKNOWN fallback for a request that scores nothing

    Read them in that order and the route a request takes is one pass down the file.
    ```
