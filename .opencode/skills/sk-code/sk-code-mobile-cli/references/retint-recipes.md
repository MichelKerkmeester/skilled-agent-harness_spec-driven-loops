---
title: Pi Remote Retint Recipes
description: Two worked, step-by-step retint recipes — a semantic-role retint and a component-token retint — each with the browser-free resolver proof steps.
trigger_phrases:
  - "retint recipes"
  - "semantic role retint"
  - "component token retint"
  - "browser-free resolver proof"
  - "retint one surface"
  - "resolver diff verification"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Retint Recipes

This reference gives two worked retint recipes: a semantic-role retint and a component-token retint. Each ends with the browser-free resolver proof required because the app's strict CSP renders it unstyled under headless CDP.

---

## 1. OVERVIEW

### Core Principle

Retint at the semantic-role or component-token layer — never the frozen primitive — and prove the change with the browser-free resolver diff, since screenshots prove nothing about colour here.

### When to Use

- Deciding whether a retint should move every surface using a role, or exactly one surface
- Retinting a semantic role system-wide (e.g. `--accent-ink`)
- Retinting a single component token scoped to one surface (e.g. `--model-sheet-accent`, `--slash-*`)
- Running the resolver-diff proof steps and command gate before claiming a retint is done

### Key Sources

- `token-library.md` — token model and the 45-declaration primitive propagation measurement
- `component-tokens.md` — component token inventory and per-surface scoping
- `theme-remap.md` — semantic role declarations and their theme blocks
- `verification.md` (`references/verification.md`) — browser-free resolver method and surface standards

---

## 2. WHY NOT JUST RETINT THE PRIMITIVE

The single largest measured propagation in this codebase is retinting the frozen primitive `--pi-clay`:
it cascades to **45 rendered declarations** across light, dark, and system — every accent fill, accent
text, and even `color-mix()`-derived accent border moves in lockstep (`token-library.md` §3). That number
is the ceiling for "how big can a retint get", and it is a fact about the **primitive** layer, not
something a workflow may reproduce by editing `--pi-clay` — the 8 `--pi-*` values are the frozen palette
contract (`references/verification.md`, surface standards). Both recipes below perform the same *shape*
of edit one layer up, where it is actually editable — the semantic role for a system-wide move, the
component token for a surface-scoped move.

---

## 3. RECIPE A — RETINT A SEMANTIC ROLE, SYSTEM-WIDE

**When:** you want every surface that plays a role to move together (e.g. every place reading the AA
text-accent role should shift).

**Worked example:** retint `--accent-ink`. It is read directly by declarations throughout `style.css`
and it is also the source every `-accent` component token in both component families aliases
(`--model-sheet-accent`, `--slash-accent` — see `component-tokens.md` §2–3), so a role-level edit here
moves the component surfaces too, without touching their own blocks.

1. **Locate every declaration.** `--accent-ink` is declared three times — `:root` (light), light value
   `#8a452f`; `:root[data-theme='dark']`, dark value `#f0b19a`; and the `prefers-color-scheme: dark`
   `:root[data-theme='system']` block, same dark value. All three currently read
   `var(--pi-accent-txt)` (`theme-remap.md` §2).
2. **Copy `style.css` to a scratch copy.** Never experiment on the real file — `verification.md` §3.
3. **Resolve BEFORE.** Resolve every custom property and declaration to its final value, per theme
   (light / dark / system), following `var()` chains from the copy.
4. **Apply the edit** to all three blocks (or to the value each aliases, if you are re-pointing the role
   at a different primitive — never a new literal that breaks the primitive chain without a documented
   reason).
5. **Resolve AFTER** the same way.
6. **Diff BEFORE vs AFTER.** `VANISHED` and `ADDED` must be **0** — you renamed no declaration's
   existence, only its value. `CHANGED` must cover exactly the declarations that read `--accent-ink`
   directly, plus `--model-sheet-accent` and `--slash-accent` (which alias it) in both themes — nothing
   in `--warning` (a sibling role that happens to share the same primitive source, but is a separate
   declaration; see `theme-remap.md` §2) should appear in the diff unless you also edited it.
7. **Run the command gate.** `npm run typecheck && npm run build && npm run test:web` — `contrast.test.tsx`
   must stay green in both themes.

---

## 4. RECIPE B — RETINT ONE COMPONENT TOKEN, ONE SURFACE

**When:** you want exactly one surface retinted and nothing else.

**Worked, measured example:** retinting the component token `--model-sheet-accent` changes only the
model-effort-sheet surface — its rows, nav buttons, policy/mutation rows, search-clear, reconcile button,
and unavailable state. There is **zero leak** into the slash panel, the diff view, artifacts, or the
composer (`token-library.md` §3, `component-tokens.md` §2).

1. **Locate the three blocks.** `--model-sheet-accent` is declared inside `.model-sheet-overlay` three
   times: the default (light) block, `:root[data-theme='dark'] .model-sheet-overlay`, and the
   `prefers-color-scheme: dark` `:root[data-theme='system'] .model-sheet-overlay` block
   (`component-tokens.md` §2).
2. **Copy `style.css` to a scratch copy**, same as recipe A.
3. **Resolve BEFORE**, per theme.
4. **Apply the edit** to the token inside `.model-sheet-overlay` in each of the three blocks you intend
   to change (edit all three if the retint should hold in every theme; edit one if it is theme-specific
   — state which in the change description either way).
5. **Resolve AFTER**, per theme.
6. **Diff BEFORE vs AFTER.** Every changed declaration must be inside `.model-sheet-overlay` (or a
   selector nested under it). If anything in `.slash-panel`, `.artifact-diff-add` /
   `.artifact-diff-remove`, or a routed page surface shows up in the diff, the edit landed on the wrong
   token (most likely the semantic role `--accent-ink` instead of the component token
   `--model-sheet-accent` — recipe A, not recipe B).
7. **Reload the catalog and the app** (`catalog.html`, then the running app) in both themes — the change
   should appear on the model-effort-sheet surface only, matching the resolver diff.
8. **Run the command gate.** `npm run typecheck && npm run build && npm run test:web`, contrast green
   in both themes.

The same eight steps apply verbatim to `--slash-*` — swap `.model-sheet-overlay` for `.slash-panel` and
the expected zero-leak surfaces for "everything except the slash panel".

---

## 5. HOW TO TELL WHICH RECIPE YOU NEED

| You want… | Recipe | Edit point |
| --- | --- | --- |
| Every surface using a role to move together | A | the semantic role, on `:root` (and its theme blocks) |
| Exactly one surface to move | B | the component token, inside that surface's own block |
| The whole app to move in lockstep | Neither — this is the frozen primitive layer | off-limits; escalate instead of editing `--pi-*` |

Both recipes are proof-gated the same way: the resolver diff shows exactly the intended `CHANGED` set
and `VANISHED` / `ADDED` at zero, and `npm run typecheck` / `build` / `test:web` all pass before any
"done" claim (`verification.md` §6).
