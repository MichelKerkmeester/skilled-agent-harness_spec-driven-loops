---
title: webflow
description: Read-only WEBFLOW surface evidence for the sk-code hub: frontend standards, implementation and performance patterns, CDN deployment, browser debug/verify. Bundled alongside a workflow mode, never a primary.
trigger_phrases:
  - "webflow frontend"
  - "webflow implementation"
  - "frontend standards"
version: 1.0.0.0
---

# webflow: Frontend Evidence (sk-code surface)

> Browser and Webflow frontend evidence, from CSS standards to CDN deployment, handed to the paired workflow mode the moment the hub sees a Webflow surface.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible). |
| **Carries** | Webflow/browser frontend evidence: CSS/HTML/JS standards, implementation + performance patterns, CDN deployment, browser debugging and verification. |
| **Reached by** | The hub bundling it alongside a workflow mode (implement/debug/verify) when it detects a Webflow surface. Never routed as a primary. |
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits. |

---

## 2. OVERVIEW

### Why This Surface Exists

A task touching Webflow-published pages or CDN-delivered client scripts needs frontend standards a general workflow mode does not carry on its own: CSS/HTML/JS conventions, CDN deploy steps, Core Web Vitals gates and browser-specific debugging. Without this surface, that knowledge would have to live inside the workflow mode itself or get reinvented per task, and a CSS fix could just as easily miss a performance regression it should have caught.

### What It Carries

This surface holds the Webflow/browser evidence: language standards for CSS, HTML and JavaScript, implementation patterns (Webflow, async, observers, forms, third-party, security), performance and Core Web Vitals remediation, CDN deployment and browser debugging/verification procedures. Detection markers are `src/2_javascript`, `webflow`, `--vw-` custom properties and CDN-delivered client scripts. Its sibling `code-opencode` carries `.opencode/` system-code evidence instead. The hub picks one surface by detection, and interaction-gated loading and CWV gates here are non-negotiable, never a report-only check.

---

## 3. LAYOUT

- `SKILL.md`: the surface contract, reference map and standards.
- `references/`: language standards (`css/`, `html/`, `javascript/`), `implementation/`, `performance/`, `deployment/`, `debugging/`, `verification/` and `shared/` (cross-language rules).
- `assets/`: `integrations/`, `patterns/`, `templates/`, `scripts/` plus the debugging/verification checklists.
- `changelog/`: release history.

See `SKILL.md` for the full reference map and the non-negotiable surface standards.
