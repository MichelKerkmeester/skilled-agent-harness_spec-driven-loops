# sk-code-obsidian: Note Database Plugin Evidence (sk-code surface)

The read-only evidence base a code workflow loads when it works on the **Note Database** Obsidian
plugin. It carries the plugin's real, measured source conventions: and honestly labels the ones a
later phase still has to adopt: so implementation, quality, review, debug, and verify work honor the
same single-stylesheet model, `.db-*` class grammar, and verification gate the plugin actually ships
under, instead of treating the repository as generic, unowned Node.js.

---

## 1. AT A GLANCE

| | |
| --- | --- |
| **Packet kind** | `surface` (read-only domain evidence) |
| **Backend** | `evidence-base` |
| **Tools** | read-only: `Read, Bash, Grep, Glob`; mutates nothing |
| **Advisor** | invisible (`routingClass: metadata`); reached only by hub bundling |
| **Detected surface** | `OBSIDIAN`: `manifest.json` (`minAppVersion`), `esbuild.config.mjs`, `from "obsidian"` imports, `.db-*` classes in `styles.css` |
| **Bundled with** | a workflow mode, e.g. `[sk-code-quality, sk-code-obsidian]` |
| **Measured baseline** | `tsc --noEmit` clean · `build` clean · `vitest run` 386/49 files · `screenshots:verify` 180 entries · `lint` 115 known problems (not clean) |

---

## 2. OVERVIEW

### Why This Surface Exists

Before this packet, code work on the Note Database plugin detected as **UNKNOWN**: a generic
TypeScript/Node.js tree with no Webflow, Pi Remote, or `.opencode/` markers fell through surface
detection, so the hub could not auto-load the plugin's Obsidian API boundary, its single-stylesheet
grammar, its screenshot-fixture harness, or its real verification gate. This surface closes that gap:
OBSIDIAN now detects, and the plugin's design-system evidence loads with the workflow.

### What It Carries

- **The Obsidian API boundary**: the `Plugin`/`FileView`/`WorkspaceLeaf` surface `main.ts` consumes,
  and the `manifest.json` compatibility contract (`minAppVersion`, `isDesktopOnly: false`).
- **The single-stylesheet model**: `styles.css` as the one stylesheet (18,931 lines measured), the
  `.db-*` class grammar (1,196 distinct classes, 769 orphaned, 427 referenced by fixtures), and no
  component-scoped styles anywhere in the tree.
- **The screenshot-fixture harness contract**: hand-written fixture markup rendered against the real
  stylesheet in headless Chrome, not the live renderers; the freshness gate; and the stand-in files
  (`theme.css`, `runtime-vars.css`) for what Obsidian supplies at runtime.
- **The measured verification gate**: the exact commands and their current pass/fail counts, including
  the honest, non-zero lint baseline.
- **The target source conventions**: kebab-case naming, `MODULE:` banners, and paired folder docs,
  each labeled against the measured tree so a workflow never claims an unshipped convention is real.

### The Design-System Evidence Layer

Unlike `sk-code-mobile-cli`'s Svelte app, this plugin ships no separate design-system document or live
catalog. The **evidence for this surface is the plugin source itself**: `styles.css` (the class
grammar), `src/views/screenshot-fixtures.test.ts` (the invented-class guard), and
`tools/screenshots/manifest.json` (the capture freshness record) are the sources of truth this packet's
`references/` distill rather than duplicate.

### The Obsidian Plugin Repository

The Note Database plugin is a **separate repository from this skills hub**: the **Obsidian Plugin
repo**. Its source (`src/`, `tools/`), its `specs/`, `manifest.json`, and `styles.css` all live there;
it is the source of truth. This surface is that repo's read-only convention mirror inside `sk-code`.
When a code workflow runs on the plugin, the Obsidian Plugin repo is the working tree, so every
`src/…`, `tools/…`, and `styles.css` path this packet cites resolves there: not against this hub. The
Obsidian Plugin repository additionally symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and
`.devin` at its root back to this hub, so detection resolves OBSIDIAN by a resolved-realpath check
rather than a literal `.opencode/` path match.

---

## 3. QUICK START

A workflow bundling this surface should, in order:

1. Read `references/obsidian-api-boundary.md` to confirm which Obsidian API a change touches and
   whether `manifest.json`'s `minAppVersion`/`isDesktopOnly` contract constrains it.
2. Read `references/db-class-naming.md` before adding, renaming, or citing any `.db-*` class: never
   invent one; `src/views/screenshot-fixtures.test.ts` fails any class absent from `styles.css` and
   `src/`.
3. Make the change, then run `references/verification.md`'s gate, `npx tsc --noEmit`,
   `npm run build`, `npx vitest run`, and `npm run screenshots:verify`: and open any changed PNG
   before claiming the change is done.

---

## 4. HOW IT WORKS

### The Surface Axis

`sk-code` declares a `surface-axis` extension: `packetKind: "surface"` entries are read-only evidence
bases bundled alongside a workflow mode, never advisor identities of their own. This packet is the
fourth surface, beside `sk-code-webflow`, `sk-code-opencode`, and `sk-code-mobile-cli`.

### Detection and Bundling

Surface detection (in `../../shared/references/stack-detection.md`) resolves OBSIDIAN from the CWD and
changed/target files, at precedence **OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN**, OPENCODE
still wins a genuinely resolved `.opencode/` target; OBSIDIAN catches the plugin repository's own
paths, which would otherwise fall to UNKNOWN as generic Node.js. The hub then bundles this surface
behind the chosen workflow mode via `routerPolicy.outcomes.surfaceBundle` (workflow ordered first,
surface after).

---

## 5. INTEGRATION & NAVIGATION

### When The Hub Bundles This Surface

`node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "<obsidian plugin task>"` resolves the
workflow mode and appends `sk-code-obsidian` as read-only evidence, e.g. a quality gate on the plugin
returns `[sk-code-quality, sk-code-obsidian]`.

### Related Skills

- `../sk-code-webflow`, `../sk-code-opencode`, `../sk-code-mobile-cli`: sibling read-only surfaces on
  the same axis.
- `../sk-code-quality`, `../sk-code-review`: workflow modes that bundle this surface.
- `../../shared/`: the implement → debug → verify doctrine this surface folds in via symlink.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish).

---

## 6. FAQ

**Does this surface edit the plugin?** No: it is read-only evidence. The bundled workflow mode makes
edits; this surface tells it the rules.

**Can I add a new `.db-*` class from here?** You add it in the plugin's `styles.css` (through the
workflow mode); this surface tells you the naming grammar and the fixture-coverage check a new class
must pass. Never cite or invent a class this surface cannot find in `styles.css` or `src/`.

**Why is a screenshot not proof?** `npm run screenshots:verify` only checks that a capture's sources
have not changed since it was taken: it does not check what the PNG shows, and the harness renders
hand-written fixture markup, not the live plugin. See `references/screenshot-fixture-harness.md`.

**Are the `MODULE:` banners and kebab-case names real yet?** No. §3b of `SKILL.md` states plainly that
these are target conventions a later phase adopts; the measured tree today is PascalCase-dominant with
no banners and no folder docs.

**Is it advisor-routable?** No. It is `routingClass: metadata` and advisor-invisible; the advisor routes
the single `sk-code` identity and the hub bundles this surface.

---

## 7. VERIFICATION

- Packet conforms to the surface contract: `packetKind: surface`, `backendKind: evidence-base`, read-only
  `toolSurface`, `routingClass: metadata`, `folder == packetSkillName`, no packet-level advisor metadata.
- Fleet gate: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exits 0.
- Routing: `compiled-route.cjs --hub sk-code --prompt "code work on the Note Database plugin"` bundles
  this surface instead of returning `defer`.

---

## 8. RELATED DOCUMENTS

- `SKILL.md`: the surface contract, reference map, machine-readable routing, and standards.
- `references/`: the Obsidian API boundary, single-stylesheet ownership, `.db-*` grammar, screenshot
  harness, verification gate, and the target source conventions.
- `changelog/`: release notes for this packet.
- `../../ROUTER.md`, `../../mode-registry.json`, `../../hub-router.json`: the parent hub's routing.
- The **Obsidian Plugin repo**: the plugin source, `manifest.json`, and `styles.css`. This surface is
  its read-only evidence mirror; see §2 "The Obsidian Plugin Repository".
- `specs/sk-code/007-sk-code-obsidian-surface/`: this surface's own spec packet, which lives beside the
  skill in this repository rather than in the plugin repo it mirrors.
