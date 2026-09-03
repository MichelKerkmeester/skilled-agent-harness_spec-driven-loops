---
title: "Decision Record: Roll the settled chrome across the whole chart corpus"
description: "Why every printed number binds to the corpus formatter, why the corner radius becomes a token ladder with a check behind it, and why one chrome row is carried without being applied."
trigger_phrases:
  - "chart chrome decisions"
  - "chart radius token decision"
  - "chart formatter binding"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded four settled decisions and one route decision left open"
    next_safe_action: "Test whether a length survives the palette block machinery"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the radius tokens live inside the palette sentinels or beside them"
    answered_questions:
      - "ADR-001: every number binds to the corpus formatter"
      - "ADR-002: the ladder is the change and tokens make it checkable"
      - "ADR-003: the mono face is a system stack"
      - "ADR-004: round tick dots are carried and not applied"
---
# Decision Record: Roll the settled chrome across the whole chart corpus

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Every printed number binds to the corpus formatter, never to a locale-dependent one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-003, REQ-004 |

---

### Context

The vendored source sets tooltip values in a mono face with tabular figures at
`src/registry/ui/recharts-tooltip.tsx:152-156`, and formats them with `toLocaleString` on the same
line. One lineage adopted the whole line in its first iteration. Its fourth iteration inspected
the corpus formatter and reversed itself, and the other lineage arrived at the same correction
independently.

The corpus formatter at `assets/templates/daily-line.html:122` fixes the thousands separator to a
comma rather than reading the host locale, rounds at six decimals to strip the dust binary
arithmetic leaves on an axis step, and prints an em dash for a value that is not a finite number.
A delivered file has to look on the machine that opens it exactly as it looked on the machine that
made it.

### Decision

The corpus adopts the visual treatment and rejects the formatting call. Every number keeps going
through the file's own `fmt`, and `toLocaleString` appears nowhere in the corpus.

### Consequences

- A chart emailed to a reader in another locale prints the same digits as the one the author saw.
- The mono treatment lands without touching the value pipeline, so the label diff after this phase
  should be empty apart from the face itself.

### Alternatives Rejected

- **Adopt the vendored line whole.** It would make grouping depend on the reader's operating
  system, which contradicts contract rule 12 and the reason the formatter exists.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The radius ladder is the change, and tokens are what make it checkable

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-006 |

---

### Context

The two lineages split on the corner radius and the split resolves by merging rather than by
choosing. One proposed a contextual ladder where a card, a tooltip, a swatch and a bar end each
sit on their own step, citing `src/app/globals.css:47-56` where a single knob drives four steps by
calculation. The other measured the corpus and found `border-radius: 10px` identical across all
twenty forms, then proposed writing that uniformity down as a formal convention.

Writing it down is close to what the corpus already does. The value is repeated twenty times and
nothing asserts that the twenty agree. The packet's own scripts document says a rule the tooling
does not check is a wish.

### Decision

Both land. The ladder is the change, so the corpus gains steps for the surfaces it actually draws.
Tokens are how the ladder becomes checkable, so the values live in the palette source and the
corpus check asserts them the way it already asserts colour.

### Consequences

- A twenty-first form copied from the skeleton inherits the ladder without its author knowing the
  ladder exists.
- A hand-typed corner fails the same way a hand-typed colour already fails.
- The phase pays for a checker change it could have deferred, which ADR-000 in `plan.md` argues is
  the right trade.

### Alternatives Rejected

- **Formalize 10px as a documented convention with no check.** That is the current state described
  more confidently, and the current state is one careless file away from breaking.
- **Ship the ladder and add the check in a later phase.** The later phase would inherit
  twenty-nine files that may already have drifted, with no baseline to compare against.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The mono face is a system stack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Both research lineages, phase 2 implementer |
| **Satisfies** | REQ-003, NFR-P02 |

---

### Context

The vendored source reaches its mono face through a bundled web font, declared at
`src/app/globals.css:16`. The template contract at section 5 forbids a web font along with every
other remote dependency, and the reason is stated there: a remote dependency keeps the file
working only while the network is up and the host still exists.

### Decision

The mono role resolves from a system stack. Every operating system the corpus targets ships a
monospaced face with tabular figures, and `font-variant-numeric: tabular-nums` is already in use
in the corpus at `assets/templates/daily-line.html:58`.

### Consequences

- The file still opens on a laptop with no network, which is the property the whole contract
  protects.
- The exact face differs between operating systems, so column alignment is guaranteed and letter
  shapes are not. Alignment is what tabular figures are for.
- Mono advances are wider than the sans advances the current label spacing was tuned against, so
  every width estimate in the corpus needs re-checking against a rendered page.

### Alternatives Rejected

- **Embed a mono face as a data URI.** It satisfies the no-network rule and breaks the
  one-file-a-reader-can-edit property, because the file grows by tens of kilobytes of base64 that
  nobody can read or change.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Round tick dots are carried and not applied

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Phase 2 implementer |
| **Satisfies** | REQ-009 |

---

### Context

One lineage kept a chrome row proposing round tick dots in place of tick marks, drawn from the
ECharts twin at `src/registry/charts/echarts-line-chart.tsx:775`. The row is real and it survived
that lineage's own sweep, so dropping it silently would lose a recommendation the research paid
for.

The corpus draws no tick marks. `grep -rn 'tick' assets/templates/` returns tick text and nothing
that draws a mark beside it, and the corpus notes elsewhere that it prints no axis lines either.

### Decision

The row is recorded here with its evidence and it is not applied. A replacement needs something to
replace.

### Consequences

- The recommendation stays findable, so a later phase does not rediscover it as a new idea.
- If phase 006 adds tick marks while correcting the contract, this row arrives with them rather
  than as an afterthought.

### Alternatives Rejected

- **Add tick marks so the dots have something to replace.** That inverts the recommendation into a
  reason to add chrome nobody asked for.
- **Drop the row.** A dropped row with no written reason is indistinguishable from an oversight.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Where the radius tokens live

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-03 |
| **Deciders** | Phase 2 implementer |
| **Satisfies** | REQ-006 |

---

### Context

`customProperties` in `scripts/check-corpus.cjs` walks `palette.chrome` and emits one custom
property per key, and `canonicalBlock` prints the result as the exact text every file has to carry
between its `CHART_PALETTE` sentinels. `checkPaletteSource` computes contrast ratios on
`chrome.ink` and `chrome.muted` only, so a non-colour key would flow through without a ratio being
taken of it.

That makes the cheap route available and it does not make it correct. The template contract says
the palette block is the only place in the file where a colour value appears, and a length is not
a colour.

### Decision

Undecided until tested. Route A adds the rungs to `palette.chrome` and changes no code. Route B
adds a sibling object to the palette source and teaches `customProperties` to read it, which keeps
`chrome` meaning colour. The deciding evidence is whether a length survives the existing block
machinery without a false contrast reading, and whether the contract sentence can be amended in
one line rather than rewritten.

### Consequences

- Route A ships faster and leaves a length inside an object every reader expects to hold colours.
- Route B costs a small function change and keeps the two vocabularies apart, which matters more
  once phase 005 adds a second media-scoped block.

### Alternatives Rejected

- **Put the radius tokens in each file's stylesheet outside the sentinels.** That is where they
  already effectively are, and it reproduces the unenforced duplication this phase exists to end.
<!-- /ANCHOR:adr-005 -->
