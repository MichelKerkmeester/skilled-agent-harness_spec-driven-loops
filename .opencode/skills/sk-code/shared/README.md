---
title: sk-code shared
description: Shared surface-router and cross-mode reference index for sk-code — navigation over the surface-detection, phase-lifecycle, workflow-doctrine, and universal-standards references (plus pattern assets) consumed by every sk-code mode.
importance_tier: normal
contextType: general
version: 1.0.0.1
---

# sk-code shared

> Cross-mode reference surface for `sk-code`: the surface router, phase lifecycle, shared workflow doctrine, universal standards, and pattern assets that every sk-code mode consumes. This is a navigation index — authoritative content lives in the linked files.

---

## 1. OVERVIEW

`shared/` holds the routing and doctrine references common to every sk-code surface packet (`code-webflow`, `code-opencode`) and workflow mode (`code-quality`, `code-review`). Surface detection resolves here first; the surface and workflow modes then load the specific references they need. For example, `code-quality` loads the universal quality standards below for its Phase 1.5 gate.

Layout:

- `references/` — routing keys, phase lifecycle, shared workflow doctrine, and stack-agnostic checklists.
- `references/universal/` — stack-agnostic standards shared across surfaces.
- `assets/patterns/` — executable pattern templates shipped with the skill.

---

## 2. REFERENCES — ROUTING & LIFECYCLE

| File | What it covers |
|---|---|
| [`references/stack-detection.md`](./references/stack-detection.md) | Surface detection (WEBFLOW / OPENCODE / UNKNOWN) plus OpenCode language sub-detection — the primary routing key, resolved from CWD and changed/target files before intent classification. |
| [`references/smart-routing.md`](./references/smart-routing.md) | Authoritative surface router: intent classification plus surface→resource maps for WEBFLOW, OPENCODE, and MOTION_DEV, with load tiers, verification commands, and the UNKNOWN fallback. |
| [`references/phase-detection.md`](./references/phase-detection.md) | Phase 1/2/3 development lifecycle (Implementation / Testing + Debugging / Verification) with per-surface resource expectations. |

---

## 3. REFERENCES — SHARED WORKFLOW DOCTRINE

Surface-agnostic workflow doctrine consumed by every surface packet; none of these define surface-specific standards or skill identity.

| File | What it covers |
|---|---|
| [`references/workflow-implement.md`](./references/workflow-implement.md) | Implementation doctrine: research and mutating build work after the router resolves the active surface. |
| [`references/workflow-debug.md`](./references/workflow-debug.md) | Debugging doctrine: root-cause diagnosis and scoped repair after a symptom, failing command, runtime error, quality failure, or verification failure. |
| [`references/workflow-verify.md`](./references/workflow-verify.md) | Verification doctrine: the non-mutating evidence phase that runs last, compares against baseline, applies falsifier discipline, and gates any done / works / complete / fixed / passing / ready claim. |

---

## 4. REFERENCES — CHECKLISTS

| File | What it covers |
|---|---|
| [`references/universal-verification-checklist.md`](./references/universal-verification-checklist.md) | Stack-agnostic verification gate to walk before any done / works / complete / passing claim across WEBFLOW or OPENCODE. |
| [`references/universal-debugging-checklist.md`](./references/universal-debugging-checklist.md) | Stack-agnostic 4-phase debugging workflow: reproduce reliably → identify root cause → test one hypothesis at a time → fix at source. |
| [`references/performance-loading-checklist.md`](./references/performance-loading-checklist.md) | Release gate for interaction-, viewport-, or idle-gated deferred loading — proves startup wins without a worse first-use experience. |

---

## 5. REFERENCES — UNIVERSAL STANDARDS (`references/universal/`)

| File | What it covers |
|---|---|
| [`references/universal/code-quality-standards.md`](./references/universal/code-quality-standards.md) | Stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate. |
| [`references/universal/code-style-guide.md`](./references/universal/code-style-guide.md) | Language-agnostic naming, file-structure, commenting, and formatting principles; stack-specific enforcement lives in each stack's standards doc. |
| [`references/universal/error-recovery.md`](./references/universal/error-recovery.md) | Surface-agnostic recovery decision tree — Document → Isolate → Verify prerequisites → Retry verbose → Escalate — for build, deploy, test, and runtime failures. |
| [`references/universal/multi-agent-research.md`](./references/universal/multi-agent-research.md) | Parallel-agent specialization model for comprehensive codebase analysis and performance audits when sequential investigation is too slow. |

---

## 6. ASSETS (`assets/patterns/`)

| Path | What it is |
|---|---|
| [`assets/patterns/validation-patterns.js`](./assets/patterns/validation-patterns.js) | Defense-in-depth, multi-layer validation pattern templates (production-ready). |
| [`assets/patterns/wait-patterns.js`](./assets/patterns/wait-patterns.js) | Observer-based async DOM waiting patterns (MutationObserver / IntersectionObserver) instead of polling. |
| [`assets/patterns/README.md`](./assets/patterns/README.md) | Code-facing README for the pattern scripts in this folder. |

---

## 7. RELATED

- [`../SKILL.md`](../SKILL.md) — the `sk-code` runtime contract that routes surfaces and workflow modes into these references.
- [`../code-quality/README.md`](../code-quality/README.md) — a workflow mode that consumes the universal quality standards above for its Phase 1.5 gate.
