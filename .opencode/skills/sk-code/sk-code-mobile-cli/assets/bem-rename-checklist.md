---
title: BEM Class-Rename Checklist
description: Gate a CSS block--element class rename in the Pi Remote client — injective map, static and dynamic sites, state/data strings left alone, value and render proof.
trigger_phrases:
  - "bem rename checklist"
  - "css class rename pi remote"
  - "block--element rename complete"
  - "dynamic class rename audit"
  - "verify class rename behaviour-preserving"
  - "is- state class rename"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# BEM Class-Rename Checklist

Use this BEFORE claiming a CSS class rename (to `block--element` BEM) is complete or
behaviour-preserving. A mechanical rename breaks rendering silently through dynamic
construction sites and shared strings — only the render proof catches those.

---

## 1. INJECTIVE MAP

- [ ] Wrote an explicit old->new map; it is injective — no two old classes collapse onto one
  new class, and no new class collides with a name already in the tree
- [ ] For each new class, `rg -n "<new-class>" app-mobile/src` shows only the sites you intended
- [ ] `is-*` state prefixes are NOT block names — they stay single-dash state modifiers, never
  rewritten to `block--state`

---

## 2. STATIC OCCURRENCES

- [ ] Every literal occurrence replaced at token boundaries: `rg -nw "<old-class>" app-mobile/src`
  returns 0 in class and selector contexts (the `-w` word boundary avoids substring false hits)
- [ ] Checked both renderers and styles — `app-mobile/src/app.css` and every component `<style>`
  block: `rg -nw "<old-class>" app-mobile/src/app.css app-mobile/src -g '*.svelte'` -> 0

---

## 3. DYNAMIC CONSTRUCTION SITES

Every interpolated class must resolve to a real rule. Enumerate them:

`rg -n "['\"\`][a-z0-9-]+--\$\{|is-\$\{|['\"\`][a-z0-9-]+--['\"] *\+" app-mobile/src -g '*.svelte'`

- [ ] Template form `` `block--${kind}` `` realigned (e.g. the `is-${presentation.kind}` ternary in
  `app-mobile/src/pages/chat/chrome/button-plan-mode.svelte`)
- [ ] Concat form `'block--' + kind` and appended-modifier concats realigned (e.g. the
  `' is-plan-mode'` append in `app-mobile/src/pages/chat/chrome/session-composer.svelte`)
- [ ] Ternary form `cond ? 'a is-x' : 'a'` realigned (e.g.
  `app-mobile/src/pages/chat/chrome/composer-command-autocomplete.svelte`)
- [ ] COMPOUND / underscore kinds each land on a matching rule — kinds like `file_diff` and
  `needs_input` are built from arrays (see `ATTENTION_CLASSES` in
  `app-mobile/src/pages/home/push-settings.svelte`) and must match rules such as
  `.attention--needs_input` in `app-mobile/src/pages/inbox/screen-attention-inbox.svelte`:
  `rg -n "attention--needs_input|attention--finished|attention--error" app-mobile/src`

---

## 4. STATE AND DATA STRINGS LEFT ALONE

- [ ] `is-*` state classes kept single-dash — no `is--` double-dash introduced:
  `rg -n "is--" app-mobile/src` -> 0
- [ ] DOM ids, CSS custom-property names, and wire/protocol enum values that happen to share a
  class's string were NOT renamed — they are data, not classes (a `kind` enum like `file_diff`
  stays `file_diff` on the wire even where its class became `attention--needs_input`)

---

## 5. VALUE AND NAMING-GRAMMAR PROOF

- [ ] Filename grammar clean: `node scripts/naming/scan-naming.mjs` exits 0 (no component file
  name drifted out of kebab grammar during the pass)
- [ ] Token values preserved: `node scripts/token-identity.mjs verify app-mobile/src/app.css`
  reports 0 golden mismatches — rename-invariant, and confirms no `--token`-bearing selector
  lost its resolved value. A pre/post `diff` should show any renamed token-bearing context only
  as a matched VANISHED+ADDED pair at the SAME value, never a net loss

---

## 6. RENDER PROOF (the gate that actually catches a bad rename)

- [ ] `node scripts/catalog-smoke-cdp.mjs` exits 0 — every Storybook story renders in light AND
  dark with zero throws (exit 2 = a story threw)
- [ ] Manual before/after screenshot of the affected stories in both themes shows no
  rename-induced visual change (there is no automated pixel-diff gate — this step is manual)
- [ ] `npm run test:web` green

---

## 7. THE GATE

The rename is "done" only when: the map is injective; `rg -nw "<old-class>"` is 0 across
`app.css` and all `<style>` blocks; every dynamic/compound site resolves to a real rule;
`is-*` stayed single-dash and ids/custom-props/enums stayed as data; `scan-naming.mjs` and
`token-identity.mjs verify` pass; `catalog-smoke-cdp.mjs` is clean with a matching screenshot
pair; and `npm run test:web` is green.
