---
title: "sk-code-frontend"
description: "Stack-agnostic web frontend practice with a five-pass Figma check, bundled as read-only evidence for the sk-code hub."
trigger_phrases:
  - "web frontend practice"
  - "figma to code check"
version: 1.0.11.0
---

# sk-code-frontend

> Stack-agnostic frontend guidance for web work, with a five-pass check that compares a built screen against its Figma frame.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Web markup and CSS, accessibility, visual values, motion and Figma-to-code checks |
| **Invoke with** | The `sk-code` hub, or frontend vocabulary such as `figma frame check` and `css grid` |
| **Works on** | Any DOM and CSS app, whatever the framework, plus a Figma frame read beside the rendered build |
| **Produces** | Read-only guidance and a five-pass Figma verdict, with no file edits |

### What It Does

`sk-code-frontend` gives web work guidance that holds across frameworks, plus a five-pass check that compares a built screen with its Figma frame. It is a read-only surface of the `sk-code` hub, bundled beside a workflow mode or routed alone when no workflow mode scores. The packet writes nothing, so the acting agent applies the guidance. When the packet routes alone, `sk-code-quality` takes the author gates before completion.

---

## 2. QUICK START

**Step 1: Route the request.** The hub scores the request vocabulary. To see the decision, run the compiled route with a frontend concern.

```bash
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "check the keyboard focus ring on this dialog"
```

Expected output: one JSON line with `"action":"route"` and a `targets` entry whose `workflowMode` is `sk-code-frontend`, then exit 0. The response also names the backend, the policy hash and the generation.

**Step 2: Read the file the route loads.** Every frontend route loads `references/frontend-practice.md` first. A web request adds the web layer. A specific web request adds its topic file, and `ROUTER.md` names the exact set.

**Step 3: Check the packet.**

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook
```

Expected output: a `PASS package=sk-code/sk-code-frontend` line with `scenarios=11`, `violations=0` and `warnings=0`, then an `exit=0` line and exit code 0.

---

## 3. HOW IT WORKS

The hub's mode vocabulary lives in `hub-router.json`, and its frontend classes select this surface. When a workflow mode also scores, the hub bundles this packet after that mode as read-only evidence. When no workflow mode scores, the hub routes the packet alone.

Inside the packet the core loads first. `references/frontend-practice.md` holds the shared principles, the value precedence, the Figma rule and the overrides contract. A web intent adds `references/web-markup-and-css.md`, and a specific web intent adds the one topic file the change touches. Intents outside the web layer add the files the router maps for them and leave the web layer out.

The packet never edits a file. A project mode that changes a core or web-layer statement records the change under a `Frontend overrides` heading in its own `SKILL.md` with the action and the reason. The workflow references are symlinks to the hub's shared doctrine, and no intent maps them. The [phase guide](../shared/references/phase-detection.md) names the file that owns each phase. When no workflow mode scores, the acting agent applies the guidance and hands the author gates to `sk-code-quality` before it claims completion.

```text
                         ┌───────────────────────────────┐
                         │ Frontend request              │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ sk-code hub scores the        │
                         │ vocabulary                    │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ A workflow mode scores?       │
                         └───────────────┬───────────────┘
                                         │
                     ────────────────────┼────────────────────
               [YES] │                                  [NO] │
                     ▼                                       ▼
     ┌───────────────────────────────┐       ┌───────────────────────────────┐
     │ Quality or review mode leads  │       │ Frontend packet routes alone  │
     └───────────────┬───────────────┘       └───────────────┬───────────────┘
                     │                                       │
                     └───────────────────┬───────────────────┘
                                         ▼
                         ┌───────────────────────────────┐
                         │ frontend-practice.md loads    │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ Web layer or mapped topic     │
                         │ files load                    │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ Acting agent applies the      │
                         │ guidance                      │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ sk-code-quality applies the   │
                         │ author gates                  │
                         └───────────────────────────────┘
```

### The File Map

Each path resolves under the packet root. The router names the condition that loads each topic file.

| File | What it carries |
|---|---|
| `references/frontend-practice.md` | The eleven shared principles, value precedence, Figma as reference, the overrides contract and the pre-completion checklist |
| `references/web-markup-and-css.md` | The web layer: structure, forms, layout, responsive behavior, media, CSS architecture and framework sections |
| `references/web-elements-and-attributes.md` | Dialog, popover, disclosure, form-control attribute and resource-hint mechanics |
| `references/web-cascade-and-selectors.md` | Selector reach, cascade layers, specificity and component style boundaries |
| `references/web-layout-and-sizing.md` | Stacking, containing blocks, intrinsic sizing, container queries and scrolling |
| `references/web-accessibility-patterns.md` | Widget patterns, accessible names, focus behavior, live regions, browser preferences, form validation and error messaging |
| `references/web-performance-and-loading.md` | Vitals, resource loading, image delivery, fonts and main-thread work |
| `references/web-internationalization.md` | Locale, direction, bidirectional text, formatting and translation tolerance |
| `references/web-visual-values.md` | Spacing, type, colour, elevation, radius, image values, token roles and hard rules |
| `references/web-visual-hierarchy.md` | The hierarchy method, symptom diagnosis, the build procedure, UX laws and the review pass |
| `references/web-motion-and-interaction.md` | Inputs, touch and hit areas, focus and keyboard behavior, motion, performance and feedback |
| `references/figma-to-code.md` | Read-only inputs, the transport ladder, the five passes, the verdict and the red flags |
| `assets/tokens.css` | A contrast-verified starter token file for a project with no token layer of its own |
| `manual-testing-playbook/manual-testing-playbook.md` | The root index for eleven routing scenarios, one per intent |

### The Five-Pass Figma Check

A Figma frame records intended appearance and states, and it does not decide the code structure. The check gathers its read-only inputs first, then walks the five passes: same-width comparison, state by state, the render and source token checks, variable to token, range and access. The overall verdict is `PASS` only when all five pass. A pass that cannot run is recorded as `NOT RUN` with its reason, and the verdict then becomes `INCOMPLETE`.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the packet when a web interface change needs guidance that the project's own conventions leave open.

- A change touches page structure, a form, layout, responsive behavior, media, CSS architecture or a framework pattern.
- A spacing, type, colour, elevation, radius or motion value needs a decision.
- A screen looks wrong or needs a visual review.
- A built screen needs comparison with its Figma frame.

The packet owns guidance, not process. `sk-code-quality` edits scoped files and runs the author gate. `sk-code-review` produces findings and leaves the files alone. Browser evidence comes from the `mcp-browser-use` hub in whichever browser mode is installed, and a measured style reference comes from `sk-design-md-generator` before implementation starts.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | The hub that scores a request and bundles this packet beside a workflow mode |
| `sk-code-quality` | Applies author-side quality checks and fixes scoped files |
| `sk-code-review` | Reviews without editing and returns findings |
| `sk-code-ci` | The CI surface, for GitHub Actions evidence rather than web practice |
| `sk-code-skilled` | The system-code surface, for this framework's own code |
| `sk-design-md-generator` | Measures a style reference before the frontend work starts |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The route returns another packet or asks for disambiguation | The request carries no frontend vocabulary and no matching file extension | Name the concern in frontend terms, such as `web accessibility pattern` or `figma frame check` |
| `assets/tokens.css` never appears in a route | No intent maps it, so `RESOURCE_MAP` never emits it | Open it from the rule in `references/web-visual-values.md` when the project has no token layer |
| The Figma check ends `INCOMPLETE` | A pass could not run and was recorded `NOT RUN` | Supply the missing input or transport, or keep the reason so the verdict stays honest |
| Playbook validation fails | A scenario breaks the operator contract, or a cited local link does not resolve | Fix the file the output names, then rerun the check |

---

## 6. FAQ

### Does this packet edit my code?

No. The packet declares `Read, Bash, Grep, Glob` and no write tool. The acting agent applies a change, and `sk-code-quality` runs the author gates before completion.

### Which file loads first?

`references/frontend-practice.md` loads on every route. A web intent adds the web layer, and a specific web intent adds its topic file. An intent outside the web layer adds the files `ROUTER.md` maps for it and skips the web layer.

### Do I need a Figma connection to run the check?

No. The tool ladder starts with the official Figma MCP when the runtime has one, then the Framelink manual through Code Mode when it is registered, then `figma-ds-cli` with Figma Desktop running, then a static export marked as possibly stale. A pass that the available transport cannot supply is `NOT RUN`, and the overall verdict is `INCOMPLETE`.

### How is this different from sk-code-quality?

`sk-code-quality` is a workflow mode that edits scoped files to fix quality failures. `sk-code-frontend` is read-only evidence. The hub can bundle it beside the quality mode, or route it alone when no workflow mode scores.

---

## 7. VERIFICATION

Run each check from the repository root.

**README structure.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/README.md --type readme
```

Expected output: a `✅ VALID` line and `Total issues: 0`, then exit 0.

**Router replay.**

```bash
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4
```

Expected output: `PASS check 4: playbook expected_resource is emitted by the router` and `router-sync: 1/1 checks passed`, then exit 0.

**Router declarations.**

```bash
rg -n "## 3\. MACHINE ROUTER|^INTENT_SIGNALS|^RESOURCE_MAP|^DEFAULT_RESOURCE" .skilled/skills/sk-code/sk-code-frontend/ROUTER.md
```

Expected output: four lines that print `## 3. MACHINE ROUTER`, `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP`, then exit 0.

**Route decision.**

```bash
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "check the keyboard focus ring on this dialog"
```

Expected output: one JSON line with `"action":"route"` and `"workflowMode":"sk-code-frontend"`, then exit 0.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Packet identity, the bundling condition and the Frontend overrides contract |
| [`ROUTER.md`](./ROUTER.md) | Intent signals, the resource map and the topic-file conditions |
| [`references/frontend-practice.md`](./references/frontend-practice.md) | The eleven shared principles, value precedence and the overrides rule |
| [`references/web-markup-and-css.md`](./references/web-markup-and-css.md) | The web layer that turns the principles into DOM and CSS practice |
| [`references/figma-to-code.md`](./references/figma-to-code.md) | The five-pass check, the transport ladder and the verdict rule |
| [`references/web-visual-values.md`](./references/web-visual-values.md) | The value scales a frame or the tokens leave open |
| [`assets/tokens.css`](./assets/tokens.css) | The starter token file for a project with no token layer |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The root index for the eleven routing scenarios |
| [`../SKILL.md`](../SKILL.md) | The hub that scores a request and bundles this packet |
| [`../../sk-design/sk-design-md-generator/SKILL.md`](../../sk-design/sk-design-md-generator/SKILL.md) | The measured style reference that can precede frontend work |
