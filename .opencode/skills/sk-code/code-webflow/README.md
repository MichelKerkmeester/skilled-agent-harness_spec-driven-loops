---
title: webflow
description: Read-only WEBFLOW surface evidence for the sk-code hub — frontend standards, implementation and performance patterns, CDN deployment, browser debug/verify. Bundled alongside a workflow mode; never a primary.
trigger_phrases:
  - "webflow frontend"
  - "webflow implementation"
  - "frontend standards"
version: 1.0.0.0
---

# webflow — Frontend Evidence (sk-code surface)

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible). |
| **Carries** | Webflow/browser frontend evidence: CSS/HTML/JS standards, implementation + performance patterns, CDN deployment, browser debugging and verification. |
| **Reached by** | The hub bundling it alongside a workflow mode (implement/debug/verify) when it detects a Webflow surface — never routed as a primary. |
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests, and commits. |

## 2. LAYOUT

- `SKILL.md` — the surface contract, reference map, and standards.
- `references/` — `css/`, `html/`, `javascript/` (language standards); `implementation/`, `performance/`, `deployment/`; `debugging/`, `verification/`; `shared/` (cross-language rules).
- `assets/` — `integrations/`, `patterns/`, `templates/`, `scripts/` + the debugging/verification checklists.
- `changelog/` — release history.

See `SKILL.md` for the full reference map and the non-negotiable surface standards.
