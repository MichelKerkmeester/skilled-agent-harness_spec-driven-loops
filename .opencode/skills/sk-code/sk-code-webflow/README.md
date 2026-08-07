---
title: webflow
description: Frontend evidence for Webflow and browser work in the sk-code hub: language standards, implementation and performance patterns, CDN deployment and browser debugging and verification, bundled with a workflow mode when the hub detects the surface, never a primary.
trigger_phrases:
  - "webflow frontend"
  - "webflow implementation"
  - "frontend standards"
version: 1.1.0.0
---

# webflow: Frontend Evidence (sk-code surface)

> Webflow pages and CDN-delivered client scripts follow frontend standards a general workflow mode does not carry. This read-only surface hands the working mode that evidence the moment the hub detects the surface, so nothing gets reinvented per task.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible) |
| **Carries** | Webflow and browser frontend evidence: language standards, implementation and performance patterns, CDN deployment, browser debugging and verification |
| **Reached by** | The hub bundling it with a workflow mode (implement, debug, verify) when it detects a Webflow surface. Never routed as a primary |
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits |

---

## 2. OVERVIEW

### Why This Surface Exists

A task touching Webflow-published pages or CDN-delivered client scripts needs frontend standards a general workflow mode does not carry on its own: CSS conventions, HTML conventions, JavaScript conventions, CDN deploy steps, Core Web Vitals gates and browser-specific debugging. Without this surface that knowledge would have to live inside the workflow mode itself or get reinvented per task. A CSS fix could then miss a performance regression it should have caught.

### What It Carries

This surface holds the Webflow and browser evidence in five domains: language standards, implementation patterns, performance and Core Web Vitals remediation, CDN deployment, browser debugging and verification procedures. Detection markers are `src/2_javascript`, `webflow`, `--vw-` custom properties and CDN-delivered client scripts. Its sibling `code-opencode` carries `.opencode/` system-code evidence instead. The hub picks one surface by detection. The interaction-gated loading and Core Web Vitals gates here are non-negotiable, never a report-only check.

### The Frontend Evidence Layer

| Domain | What the surface covers |
|---|---|
| **CSS standards** | style guides and quality standards under `references/css/` |
| **HTML standards** | style guide and quality standards under `references/html/` |
| **JavaScript standards** | style guides and quality standards under `references/javascript/` |
| **Implementation patterns** | Webflow patterns, async and observer patterns, forms and focus workflows, third-party integrations, security patterns and animation under `references/implementation/` |
| **Performance** | Core Web Vitals remediation, resource loading, interaction-gated loading and Webflow constraints under `references/performance/` |
| **Deployment** | CDN deployment, minification workflow, staging and production checks under `references/deployment/` |
| **Debugging** | systematic debugging workflows and error recovery under `references/debugging/` |
| **Verification** | gate and automated options, requirements and checklists under `references/verification/` |
| **Shared tier** | cross-language rules and enforcement under `references/shared/` |
| **Assets** | integrations, patterns, templates and scripts under `assets/`, plus the debugging and verification checklists |

---

## 3. QUICK START

**Step 1: Let the hub detect the surface.** The hub watches for `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one fires, it bundles this packet with the active workflow mode.

**Step 2: Load the standards for the languages the task touches.** Each language tier under `references/` opens with a style guide and the quality standards that apply to it. A frontend task legitimately spans all three tiers.

**Step 3: Pull the workflow reference for the active phase.** Implementation, debugging, verification, performance and deployment references sit under `references/`, with the debugging and verification checklists under `assets/`. Success looks like a task that follows the reference before touching code and runs the checklist before claiming completion.

**Step 4: Respect the gates.** Interaction-gated loading and Core Web Vitals are gates, not reports. Heavy vendors load on interaction or visibility, never eagerly.

---

## 4. HOW IT WORKS

### The Surface Axis

The sk-code hub splits frontend work along two axes. Workflow modes own the implement-to-verify process. Surface packets own the read-only evidence. This packet is `packetKind: surface` with a `toolSurface` of Read, Bash, Grep and Glob only. It mutates nothing. The paired workflow mode owns every edit and test. Each commit runs through that mode.

Because the packet is advisor-invisible, it never gets routed as a primary. A request naming frontend work lands on a workflow mode with this evidence attached. The mode acts on it.

### Detection and Bundling

Detection is deterministic. The hub matches `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts, then picks one surface by detection, so a task gets this packet or its sibling, not both.

The workflow mode pulls the references and assets on demand. The surface stays out of the way until the active phase needs a standard, a pattern, a checklist or a procedure.

---

## 5. INTEGRATION & NAVIGATION

### When The Hub Bundles This Surface

Use this surface when the task touches Webflow-published pages or CDN-delivered client scripts, when the active workflow phase needs a frontend standard, an implementation pattern, a performance remediation, a deployment step or a browser debugging or verification procedure. Formal findings-first review hands off to `code-review`. Author-side quality gates hand off to `code-quality`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that detects the surface and bundles it with the active workflow mode |
| `code-opencode` | Sibling surface carrying `.opencode/` system-code evidence, picked by the same detection |
| `code-review` | Owns formal findings-first review after the workflow phases |
| `code-quality` | Owns author-side quality gates |

---

## 6. FAQ

**Q: Why is this packet read-only and advisor-invisible?**

A: It is evidence, not a worker. A surface that mutated would blur who owns the edit. A surface that routed as a primary could send a task to a packet that cannot act. The workflow mode owns the action. The surface supplies the standards.

**Q: What happens when a frontend task does not match this surface's markers?**

A: The hub picks the surface by detection, so `.opencode/` system-code work matches `code-opencode` instead. The workflow mode proceeds with the references the bundled surface carries.

---

## 7. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/sk-code-webflow/README.md --type readme` reports zero issues |
| Surface checklists | `assets/webflow-debugging-checklist.md` and `assets/webflow-verification-checklist.md` cover the browser debugging and verification gates |
| Manual playbook | `manual-testing-playbook/manual-testing-playbook.md` runs every scenario behind the checklists |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Surface contract, full reference map and the non-negotiable standards |
| [`references/shared/cross-language-rules.md`](./references/shared/cross-language-rules.md) | Cross-language rules shared by every language tier |
| [`assets/webflow-debugging-checklist.md`](./assets/webflow-debugging-checklist.md) | Browser debugging checklist used by the debug phase |
| [`assets/webflow-verification-checklist.md`](./assets/webflow-verification-checklist.md) | Browser verification checklist used by the verify phase |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the surface evidence |
| [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) | Release history for this surface |
