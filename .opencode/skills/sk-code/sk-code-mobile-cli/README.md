# mobile-cli: Pi Remote Design-System Evidence (sk-code surface)

The read-only evidence base a code workflow loads when it works on the **Pi Remote Mobile-CLI** app.
It carries the app's formalized design system so implementation, quality, review, debug, and verify
work honor the same token library, editability grammar, guardrails, and verification gate the app
actually ships under — instead of treating `apps/pi-remote-web/` as a generic, unowned frontend.

---

## 1. AT A GLANCE

| | |
| --- | --- |
| **Packet kind** | `surface` (read-only domain evidence) |
| **Backend** | `evidence-base` |
| **Tools** | read-only — `Read, Bash, Grep, Glob`; mutates nothing |
| **Advisor** | invisible (`routingClass: metadata`); reached only by hub bundling |
| **Detected surface** | `PI_REMOTE` — `apps/pi-remote-web/`, `apps/pi-remote-relay/`, `packages/pi-*`, `@pi-remote/*` |
| **Bundled with** | a workflow mode, e.g. `[sk-code-quality, sk-code-mobile-cli]` |
| **Frozen contracts** | ink-on-parchment tokens (Inter + Source Serif 4; WCAG AA; ≥44px) · read-only security posture |

---

## 2. OVERVIEW

### Why This Surface Exists

Before this packet, code work on `apps/pi-remote-web/` detected as **UNKNOWN**: a Vite/React app with no
Webflow markers and outside `.opencode/` fell through surface detection, so the hub could not
auto-load the app's token library, `@ds` grammar, or editability guardrails. A designer or an agent
editing the system had no surface telling them where the seams are and where the frozen lines sit. This
surface closes that gap: PI_REMOTE now detects, and the design-system evidence loads with the workflow.

### What It Carries

- **The token library** — the primitive → semantic → component three-layer model, the 8 frozen
  `--pi-*` values in light and dark, and the propagation rules a retint follows.
- **The `@ds` grammar** — the inline-comment editability vocabulary (`surface / slot / state / variant /
  edit / guardrail / catalog / theme`) migrated across the app's stylesheet and components.
- **The guardrails** — the `@ds guardrail: do-not-edit` fences and the architectural reason a
  presentation edit cannot cross into logic or the security boundary.
- **The verification gate** — the browser-free resolver method and the command set that prove a change
  preserved every frozen value in both themes.

### The Design-System Evidence Layer

The **live** artifacts live in the app repo and this surface points at them rather than copying them:
`apps/pi-remote-web/src/design-system/tokens.md`, `.../designer-guide.md`, and the live catalog
`apps/pi-remote-web/catalog.html`. The surface's own `references/` distill the standards a workflow must
apply; the app artifacts are the source of truth for the exact values and the browsable catalog.

---

## 3. QUICK START

A workflow bundling this surface should, in order:

1. Read `references/token-library.md` to place any color/spacing/radius change in the right layer
   (semantic role for a system-wide retint; component token for one surface; never a `--pi-*` primitive).
2. Read `references/ds-grammar.md` to find the `@ds` seam for the edit class (token / slot / state /
   layout) and confirm it is not inside a `@ds guardrail: do-not-edit` fence.
3. Make the change, then run `references/verification.md` — the browser-free resolvers plus
   `npm run typecheck` / `build` / `test:web` — to prove no frozen value moved and both themes still
   pass WCAG AA.

---

## 4. HOW IT WORKS

### The Surface Axis

`sk-code` declares a `surface-axis` extension: `packetKind: "surface"` entries are read-only
evidence bases bundled alongside a workflow mode, never advisor identities of their own. This packet is
the third surface, beside `sk-code-webflow` and `sk-code-opencode`.

### Detection and Bundling

Surface detection (in `../../shared/references/stack-detection.md`) resolves PI_REMOTE from the CWD and
changed/target files, at precedence **OPENCODE > PI_REMOTE > WEBFLOW > UNKNOWN** — OPENCODE still wins a
`.opencode/` target; PI_REMOTE catches the pi-remote app paths that previously fell to UNKNOWN. The hub
then bundles this surface behind the chosen workflow mode via `routerPolicy.outcomes.surfaceBundle`
(workflow ordered first, surface after).

---

## 5. INTEGRATION & NAVIGATION

### When The Hub Bundles This Surface

`node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "<pi-remote task>"` resolves the workflow
mode and appends `sk-code-mobile-cli` as read-only evidence — e.g. a quality gate on the app returns
`[sk-code-quality, sk-code-mobile-cli]`.

### Related Skills

- `../sk-code-webflow`, `../sk-code-opencode` — sibling read-only surfaces on the same axis.
- `../sk-code-quality`, `../sk-code-review` — workflow modes that bundle this surface.
- `../../shared/` — the implement → debug → verify doctrine this surface folds in via symlink.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish).

---

## 6. FAQ

**Does this surface edit the app?** No — it is read-only evidence. The bundled workflow mode makes edits;
this surface tells it the rules.

**Can I retint the app from here?** You change values in the app's `src/style.css` (through the workflow
mode); this surface tells you which layer to change and how the retint propagates. Never touch a
`--pi-*` primitive value.

**Why browser-free verification?** The app's strict CSP renders it unstyled under headless CDP, so
screenshots do not prove color. Resolving `style.css` to final values per theme does. See
`references/verification.md`.

**Is it advisor-routable?** No. It is `routingClass: metadata` and advisor-invisible; the advisor routes
the single `sk-code` identity and the hub bundles this surface.

---

## 7. VERIFICATION

- Packet conforms to the surface contract: `packetKind: surface`, `backendKind: evidence-base`, read-only
  `toolSurface`, `routingClass: metadata`, `folder == packetSkillName`, no packet-level advisor metadata.
- Fleet gate: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exits 0.
- Routing: `compiled-route.cjs --hub sk-code --prompt "code work on apps/pi-remote-web"` bundles this
  surface instead of returning `defer`.

---

## 8. RELATED DOCUMENTS

- `SKILL.md` — the surface contract, reference map, machine-readable routing, and standards.
- `references/` — the token library, `@ds` grammar, guardrails, verification, and the workflow doctrine.
- `changelog/` — release notes for this packet.
- `../../ROUTER.md`, `../../mode-registry.json`, `../../hub-router.json` — the parent hub's routing.
- The design-system spec: `specs/003-pi-remote-design-system/` in the Mobile-CLI app repo.
