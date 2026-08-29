---
title: Running the Catalog for Someone
description: How to start Storybook for a user who wants to look at the app, what to tell them, which port it serves on, and how to recover the failures that actually happen.
trigger_phrases:
  - "start storybook for me"
  - "open the component catalog"
  - "run storybook mobile cli"
  - "storybook port 6006"
  - "storybook will not start"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Running the Catalog for Someone

Starting Storybook is one command, but it is a long-running server, so how you start it decides
whether the user gets a link or a hung terminal.

---

## 1. OVERVIEW

### Core Principle

**Storybook is a server, not a task.** Start it in the background, tell the user the URL, and leave
it running. A foreground start blocks until the user kills it, which looks like a hang and loses you
the session.

### When to Use

- The user asks to see a component, a screen, or "the catalog"
- You need to look at a surface yourself before or after changing it
- A design question needs an answer that a screenshot cannot give (hover, focus, a live theme flip)
- You are about to re-capture the screenshot archive

### Key Sources

- `package.json` — the root `storybook`, `story:coverage`, `story:new` and `story:shots` scripts
- `app-mobile/package.json` — `storybook` and `build-storybook`
- `app-mobile/.storybook/main.ts` and `app-mobile/.storybook/preview.ts` — the catalog config and the two Design pages

### Prerequisites

`npm install` has been run at the repository root once. Nothing else — no Tailscale, no relay, no
device. The catalog renders components in isolation and talks to no backend.

---

## 2. STARTING IT

From the repository root:

```bash
npm run storybook
```

That delegates to `storybook dev -p 6006` in the web workspace. **Serve it in the background** and
hand the user the URL:

**http://localhost:6006**

It opens a browser automatically. First start compiles the catalog and takes noticeably longer than
subsequent ones; after that it hot-reloads on save, so leave it running while you edit.

### What to tell the user

Give them the URL and the two things they will not guess:

- **The theme switch is in the top toolbar** — system / light / dark, and every surface re-inks
  through the real tokens. The look is identical to the shipped app.
- **The Design section has a token playground.** Changing a token there moves every story at once and
  persists for their browser. It writes no stylesheet — see
  [`storybook.md`](storybook.md) for what that means and what the `flips` badge warns about.

---

## 3. THE STATIC BUILD

For anything that reads the catalog programmatically — the render gate, the audit, the archive, the
state-visibility gate — build once and point the tool at the output rather than at a dev server:

```bash
npm run build-storybook -w @pi-remote/web    # writes app-mobile/storybook-static
```

`npm run story:shots` does the build and the capture in one step, which is why it is the command to
run after a rendering change rather than the capture script alone.

**One build directory, one writer.** Every gate that needs a built catalog reads
`app-mobile/storybook-static`. Two concurrent builds corrupt it, so never run a build while another
agent or a background task is building — sequence them.

---

## 4. WHEN IT WILL NOT START

| Symptom | Cause | Fix |
|---|---|---|
| `EADDRINUSE` on 6006 | An earlier Storybook is still running | Reuse it — the URL already works — or stop that process first |
| Hangs with no URL | Started in the foreground | Nothing is wrong; it is serving. Background it instead |
| A story throws on open | A real runtime error in that component | `node scripts/catalog-smoke-cdp.mjs` names every throwing story at once |
| Blank surfaces, no styling | Reading a story from the static build over `file://` | Serve `storybook-static` over HTTP; the gates do this themselves |
| A component is missing entirely | It has no story yet | `npm run story:new <path>` scaffolds one; `npm run story:coverage` fails until it exists |

---

## 5. RULES

### ✅ ALWAYS

- Start it in the background and hand back the URL.
- Reuse a catalog that is already serving rather than starting a second one.
- Build the static catalog once and sequence anything that reads it.

### ❌ NEVER

- Block a turn on a foreground `npm run storybook`.
- Run two `build-storybook` invocations at once against the shared output directory.
- Point a user at a story you have not confirmed renders — check the smoke gate first.

---

## 6. RELATED REFERENCES

- [`storybook.md`](storybook.md) — what the catalog is for, both audiences, and the gate ladder.
- [`component-story-upkeep.md`](component-story-upkeep.md) — adding a story, and the coverage gate.
- [`screenshot-archive.md`](screenshot-archive.md) — the tracked archive and what its determinism is worth.
- [`../setup/device-preview.md`](../setup/device-preview.md) — seeing the whole app on a phone-shaped screen, rather than a component in isolation.
