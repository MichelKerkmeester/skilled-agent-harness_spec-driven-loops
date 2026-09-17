# DOCS LAYER

The catalog documents its own components. Half of that documentation is generated on every build and
cannot drift; the other half is written by a person and can. Knowing which half you are reading is the
whole point of this document.

---

## WHAT GENERATES

`@storybook/svelte-vite` runs a TypeScript docgen over every `.svelte` file on every build. It reads
the component's `$props()` rune and its types, and extracts each prop's name, type, optionality,
default value and JSDoc. `@storybook/addon-docs` renders that as the props table on the component's
docs page.

Two consequences worth holding onto:

- **The props table cannot go stale.** It is re-derived from the types each build. If it disagrees
  with the component, the component changed and the table already followed.
- **Documenting a prop means writing JSDoc on it.** There is nowhere else to put it. A `/** */` above
  a member of the `Props` interface becomes that prop's description; without one, the table shows the
  bare type instead.

The catalog carries **100 docs pages beside 337 stories**. Every component tagged `autodocs` gets one.

---

## WHAT IS WRITTEN

A component-level description, set in the story meta:

```ts
parameters: {
  docs: { description: { component: 'One to three sentences.' } },
}
```

This is the half that rots, so it is kept small on purpose. A description earns its place only by
saying something a reader cannot learn from the props table or from the rendered story:

- what the component does when a host capability is **absent** — a story shows one branch;
- **which breakpoint** changes what, and to what — the canvas shows one width;
- where the data comes from when the component **takes no props** at all.

A description that restates the props table, lists props in sentences, or narrates what is visible in
the canvas is worse than none: it costs maintenance and tells the reader nothing.

---

## READING SOURCE WITHOUT LEAVING THE STORY

The **Source** panel sits first in the story view and opens by default. It shows the component's real
`.svelte` file — markup and scoped `<style>` included — highlighted, with line numbers and a copy
button. The file is read off disk and re-read on hot update, so it is what compiled rather than a
reconstruction.

Stories that render a wrapper or a composed scene have no single component file. Those show a note
rather than code, which is correct: there is nothing to show.

---

## MEASURING WHICH PAGES ARE WORTH READING

```bash
node scripts/docgen-coverage.mjs
```

Loads all 100 docs pages, reads each args table the way a reader sees it, and ranks them by how little
they convey. Writes `scripts/docgen-coverage.json`.

**It exits 0 with thin pages present.** A low score is the finding, not an error — a component driven
entirely by context legitimately has no props, and the ranking says where prose pays rather than which
component is deficient.

One trap is baked into the measurement and worth knowing before trusting any similar reading: the
Description column holds **either** a prop's prose **or**, when there is none, its bare type. Counting
non-empty cells therefore marks every prop documented. The audit classifies the cell instead, and the
classifier is checked against components whose answers are known.

---

## NO GATE SWEEPS THE DOCS PAGES

All four presentation gates filter `entry.type === 'story'`:

| Gate | File |
|---|---|
| Screenshot archive | `scripts/capture-screenshots.mjs` |
| CDP render smoke | `scripts/catalog-smoke-cdp.mjs` |
| UI audit | `scripts/ui-audit.mjs` |
| State visibility | `scripts/catalog-state-visibility.mjs` |

That filter is why enabling the docs layer disturbed none of them, and equally why **nothing checks a
docs page**. Declining a docs render gate was a decision taken on evidence: all 100 pages render with
zero page errors, so a gate would protect against nothing observed. The audit is re-runnable, so the
question costs little to re-ask if a page ever throws.

---

## WHEN YOU CHANGE A COMPONENT

- Adding or renaming a prop needs nothing: the table follows the types.
- Documenting a prop means adding JSDoc to it, not editing a docs page.
- Changing what a component does when a capability is absent, or at a breakpoint, is exactly the case
  where the written half needs updating — that is what it exists to carry.
