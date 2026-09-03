---
title: "Mode design plan — `sk-code-mobile-cli` surface packet (plan-only)"
trigger_phrases: []
---
# Mode design plan — `sk-code-mobile-cli` surface packet (plan-only)

> **Plan-only deliverable.** This document designs the future `sk-code-mobile-cli` SURFACE packet
> against the real `sk-code` hub contract **and** the `sk-create-skill` mode-creation standards. It
> authors **no** file under `.opencode/skills/`. Section 9 lists the exact files a follow-on build
> packet would create/edit and the gates it must pass.

## 1. Grounding — the authoritative contracts (cited)

### `sk-code` hub (the live target)
- **`sk-code/SKILL.md` §2 Smart Routing** — registry-driven; `mode-registry.json` is the single source
  of truth. The advisor routes any code query to the single identity `sk-code`; the hub picks the mode.
  Discriminator: **`workflowMode` / `packetKind` / `backendKind`**. Surfaces are advisor-invisible
  (`routingClass: metadata`, read-only `toolSurface`), bundled via `routerPolicy.outcomes.surfaceBundle`
  (workflow first, then surfaces). Compiled routing is default-on:
  `node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "<task>"`.
- **`sk-code/mode-registry.json`** — the two axes; the `sk-code-webflow` surface entry is the template.
- **`sk-code/hub-router.json`** — verified top-level keys `skill, version, routerPolicy, routerSignals,
  vocabularyClasses`; `routerSignals` is keyed by each `workflowMode`
  (`sk-code-quality, sk-code-review, sk-code-webflow, sk-code-opencode`); `vocabularyClasses` uses the
  `code-<surface>-*` prefix (`code-webflow-aliases`, `code-webflow-runtime`, …) — **not** `sk-code-…`.
- **`sk-code/ROUTER.md`** — `router_state: active` (non-empty `INTENT_SIGNALS` / `RESOURCE_MAP`).
- **`sk-code/shared/references/stack-detection.md`** — surface detection on CWD + changed/target files
  before intent; precedence **OPENCODE > WEBFLOW > UNKNOWN**.
- **Template packet `sk-code-webflow/`** — `README.md`, `SKILL.md`, `assets/`, `benchmark/`,
  `changelog/` (real files `v1.0.0.0.md`, `v1.1.0.0.md`), `manual-testing-playbook/`, `references/`
  (with `workflow-{implement,debug,verify}.md` **symlinked** to `../../shared/references/`). **No**
  `graph-metadata.json` / `description.json` at the packet level.

### `sk-create-skill` mode-creation standards (the rules the packet must satisfy)
- **`references/parent-skill/parent-skills-nested-packets.md`** — the canonical parent-hub method:
  one advisor identity, one `modes[]` array, the required `modes[]` fields, the surface-packet
  constraints, the packet companion-file policy, and the changelog/naming policy.
- **`references/shared/skill-root-metadata-contract.md`** — the two-class matrix. `sk-code` is a
  class-**H** hub (declares both `mode-registry.json` + `hub-router.json`). Packets are **not** their
  own roots: a nested `graph-metadata.json`/`description.json` is a `NESTED_IDENTITY` violation. The
  fleet gate is `scripts/ci-skill-root-metadata.cjs`.
- **`assets/parent-skill/scaffold/packet-skill-scaffold.md`** — the packet `SKILL.md` template.
- **`references/parent-skill/compiled-routing-lockstep-surfaces.json`** — `sk-code` is a listed
  compiled-routing lockstep hub surface, so registry/router edits must re-mint its compiled-route
  manifest and pass freshness.

### Reproducible evidence of the gap
```text
$ node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "code work on apps/pi-remote-web design system"
{"hubId":"sk-code","action":"defer","selectionKind":null,"targets":[], ... }
```
Code work on `apps/pi-remote-web/` routes to **`defer`** with **no targets** today; per
`stack-detection.md` the app (Vite/React, no WEBFLOW markers, outside `.opencode/`) resolves to
**UNKNOWN**. The planned surface closes this gap.

## 2. Packet identity + SKILL.md (per the scaffold template)

- Folder `.opencode/skills/sk-code/sk-code-mobile-cli/` — **`folder == packetSkillName`**,
  `grandfatheredFolderMismatch: false` (never create a new mismatch), matching the hub-prefixed
  surface convention (`sk-code-webflow`, `sk-code-opencode`).
- **No packet-level advisor metadata.** Surface packets carry no `graph-metadata.json` /
  `description.json` (the real webflow/opencode packets have none; `skill-root-metadata-contract.md`
  makes a nested one a `NESTED_IDENTITY` rejection). The surface is advisor-invisible under the hub's
  single `sk-code` identity; `mode-registry.json` / `hub-router.json` / `description.json` stay
  hub-only. The hub `graph-metadata.json` is the advisor identity and does not enumerate
  advisor-invisible surfaces — leave it unless the build-time gate says otherwise.
- **`SKILL.md` follows `packet-skill-scaffold.md`:** frontmatter `name: sk-code-mobile-cli`,
  `description:` (≤130 chars), **read-only** `allowed-tools: [Read, Bash, Grep, Glob]` (a surface
  packet never mutates), `version: 1.0.0.0`; body sections WHEN TO USE / SMART ROUTING / HOW IT WORKS /
  RULES (ALWAYS·NEVER·ESCALATE) / REFERENCES / SUCCESS CRITERIA / INTEGRATION POINTS. RULES must state
  it never acts as a separate advisor identity and never loads resources outside the packet.

## 3. `mode-registry.json` entry (hub file — edited by the build packet, not here)

One `modes[]` entry with every required field (`workflowMode, packetKind, backendKind, toolSurface,
packet, packetSkillName, grandfatheredFolderMismatch, aliases, advisorRouting`), mirroring the
`sk-code-webflow` surface entry and honoring the surface constraints (`packetKind:"surface"`,
`backendKind:"evidence-base"`, `mutatesWorkspace:false`, read-only allowed, write/edit/task forbidden,
`routingClass:"metadata"`):

```jsonc
{
  "workflowMode": "sk-code-mobile-cli",
  "packetKind": "surface",
  "backendKind": "evidence-base",
  "toolSurface": {
    "allowed": ["Read", "Bash", "Grep", "Glob"],
    "forbidden": ["Write", "Edit", "Task"],
    "mutatesWorkspace": false,
    "bashAllowlist": []
  },
  "packet": "sk-code-mobile-cli",
  "packetSkillName": "sk-code-mobile-cli",
  "grandfatheredFolderMismatch": false,
  "aliases": ["pi remote app", "mobile cli app", "pi-remote-web", "pi remote design system",
              "ds grammar edit", "token library edit", "designer-editable frontend"],
  "advisorRouting": { "routingClass": "metadata" }
}
```

Add `"sk-code-mobile-cli"` to `extensions.surface-axis.surfaces`. `aliases[]` must be **lowercase** and
**unique across all modes** (checked against quality/review/webflow/opencode aliases — the set above is
disjoint).

## 4. `hub-router.json` wiring (hub file — precise per the verified structure)

- **`routerSignals`** — add a signal keyed by the full `"sk-code-mobile-cli"` (as `routerSignals` keys
  every workflowMode), referencing the new vocabulary classes plus `hub-identity`.
- **`vocabularyClasses`** — add `code-mobile-cli-aliases` and `code-mobile-cli-runtime` (the `code-…`
  prefix, matching `code-webflow-aliases` — **not** `sk-code-…`). `sk-code` uses the **compositional**
  vocabulary strategy: each class carries the registry aliases **plus** surface keywords
  (`pi-remote-web`, `apps/pi-remote-web`, `@pi-remote`, `design system`, `@ds`, `token library`,
  `--pi-`, `model-sheet`). Keep aliases lowercase (router vocab is case-folded).
- **`routerPolicy.tieBreak`** — append `"sk-code-mobile-cli"` after the workflow modes and existing
  surfaces (tie-break lists workflow modes first, surfaces after).
- `surfaceBundle` already exists (the hub declares `surface-axis`); no `routerPolicy` reshape is needed.

## 5. Root `ROUTER.md` (stage-two — active)

`sk-code/ROUTER.md` is `router_state: active`, so if the surface exposes packet-local leaf resources
that stage-two should select, the build packet adds **equal-key** `INTENT_SIGNALS` / `RESOURCE_MAP`
entries whose paths resolve to typed `leaf-manifest.json` pairs (mirroring how `sk-code-webflow` /
`sk-code-opencode` leaves appear, if they do). If the surface adds no stage-two leaf routing beyond the
`SKILL.md` bundle, leave `ROUTER.md` unchanged — never author synthetic intents.

## 6. Surface-detection marker (`shared/references/stack-detection.md`)

Add a **PI_REMOTE** (Mobile-CLI) branch. Precedence **OPENCODE > PI_REMOTE > WEBFLOW > UNKNOWN**:
OPENCODE keeps top precedence (a `.opencode/` target always wins); PI_REMOTE matches this monorepo's
app paths, which carry no WEBFLOW markers, so it never contends with WEBFLOW and simply catches the app
work that falls to UNKNOWN today.

Markers (CWD or changed/target file): under `apps/pi-remote-web/`, `apps/pi-remote-relay/`, or a
`packages/pi-*` / `@pi-remote/*` workspace; fallback: the repo root declares the `@pi-remote/*` npm
workspaces. Guard: gated to these pi-remote paths so a generic Vite/React repo stays UNKNOWN (mirrors
the generic-Node guard). Add TEST CASE rows: `apps/pi-remote-web/… changed → PI_REMOTE`;
`apps/pi-remote-web marker AND changed .opencode/… → OPENCODE` (precedence holds).

## 7. Folded workflow doctrine (packet `references/` — symlinks, sanctioned by the doctrine)

Per `parent-skills-nested-packets.md` §7, a shared doctrine lives once under `shared/` and is
**symlinked** into each consuming packet. The build packet symlinks, exactly as `sk-code-webflow` does:
```text
sk-code-mobile-cli/references/workflow-implement.md -> ../../shared/references/workflow-implement.md
sk-code-mobile-cli/references/workflow-debug.md     -> ../../shared/references/workflow-debug.md
sk-code-mobile-cli/references/workflow-verify.md    -> ../../shared/references/workflow-verify.md
```

## 8. Packet companion files + encoded conventions

**Companion files (per the doctrine's packet policy):** `SKILL.md` (§2), `README.md`, and a **real**
`changelog/` with its own version file (`v1.0.0.0.md`) — changelogs are never symlinked and never point
at the hub changelog; `references/` (the workflow symlinks + Mobile-CLI standards) and `assets/` (any
verification scripts) as evidence material. `benchmark/` and `manual-testing-playbook/` are optional at
packet level (the webflow packet carries them).

**Encoded conventions the surface carries as read-only evidence** (so any workflow mode bundling it
applies them):
- **Token library layering** — primitive (`--pi-*`, 8 frozen values) → semantic role → component
  (`--model-sheet-*`, `--slash-*`, `--diff-*`). Retint a role at the semantic layer, a surface at the
  component layer; never edit a `--pi-*` value.
- **The `@ds` grammar** — `surface / slot / state / variant / edit / guardrail / catalog / theme`.
- **Editability guardrails** — the `@ds guardrail: do-not-edit` fences (frozen primitives, focus ring,
  state machines + status text, plan-mode overlay + atomic execute path, ≥44px targets,
  reduced-motion/contrast/forced-colors, redaction chip, bounded-reading overflow); CSS/token edits are
  presentation-only and cannot reach logic or the security boundary.
- **Verification command set** — `npm run typecheck` / `build` / `test:web` (incl. `contrast.test.tsx`),
  plus the browser-free token/rule resolvers and the catalog/shell structural 390px mount check this
  epic established (headless CDP renders the app unstyled under its CSP, so selector→value resolution,
  not pixel-diffing, is the authoritative gate).
- Points at the live evidence: `apps/pi-remote-web/src/design-system/tokens.md`, `.../designer-guide.md`,
  and `catalog.html`.

**Bundling result:** with the entry in place, `compiled-route.cjs --hub sk-code --prompt "<app task>"`
for a `apps/pi-remote-web/` target resolves the workflow mode and bundles `sk-code-mobile-cli` as
read-only evidence (`surfaceBundle`: workflow first, surface after) — e.g.
`[sk-code-quality, sk-code-mobile-cli]` — instead of today's `defer`.

## 9. Out of scope + the exact build-packet checklist

**Out of scope here:** authoring any file under `.opencode/skills/`. This packet produces only this plan.

A follow-on build packet (a separate, non-plan-only phase) creates/edits exactly:

New (packet `.opencode/skills/sk-code/sk-code-mobile-cli/`):
- `SKILL.md` (per `packet-skill-scaffold.md`, read-only tools) and `README.md`.
- `changelog/v1.0.0.0.md` (real file — not a symlink).
- `references/` — the three `workflow-*.md` symlinks to `../../shared/references/` + Mobile-CLI standards.
- `assets/` (optional — verification scripts); `benchmark/` + `manual-testing-playbook/` (optional).

Edited (hub `.opencode/skills/sk-code/`):
- `mode-registry.json` — the `modes[]` entry (§3) + `extensions.surface-axis.surfaces`.
- `hub-router.json` — `routerSignals["sk-code-mobile-cli"]`, `vocabularyClasses.code-mobile-cli-{aliases,
  runtime}`, and `routerPolicy.tieBreak` (§4).
- `shared/references/stack-detection.md` — the PI_REMOTE marker + precedence + TEST CASE rows (§6).
- `ROUTER.md` — only if the surface adds stage-two leaf routing (§5).

Regenerate + gate (build packet, not here):
- `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` to regenerate
  the hub `leaf-manifest.json`, then the same gate with no `--fix` must exit **0** (no `NESTED_IDENTITY`,
  no `FORBIDDEN_FILE`, generated freshness).
- Re-mint the compiled-route manifest (sk-code is a lockstep compiled-routing hub):
  `node .opencode/bin/compiled-route-manifest.cjs mint --hub sk-code --skill-root
  .opencode/skills/sk-code`, then its `freshness` action must pass.
- Keep vocab-sync clean (compositional strategy) and `aliases[]` lowercase + unique.

No app source, source value, or security posture changes at any point — the surface is read-only
evidence.
