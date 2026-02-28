---
title: "SK-Doc-Visual Component Creation - Plan Stage"
description: "Level 3 planning docs for phase 002 extraction of additional sections and components."
trigger_phrases:
  - "component creation"
  - "section extraction"
  - "plan stage"
importance_tier: "normal"
contextType: "general"
---
# 002 Component Creation (Plan Stage)

This phase defines the Level 3 implementation plan for expanding `sk-doc-visual` preview assets from `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1-overview)
- [2. SCOPE BOUNDARY](#2-scope-boundary)
- [3. DOCUMENT MAP](#3-document-map)
- [4. SOURCE REFERENCE](#4-source-reference)
- [5. RELATED PHASES](#5-related-phases)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

- Level: 3 (architecture + verification required).
- Stage: planning only, equivalent intent to `/spec_kit:plan`.
- Goal: prepare extraction and file-creation plan for 12 additional sections and 5 additional components.

<!-- /ANCHOR:overview -->

## 2. SCOPE BOUNDARY
<!-- ANCHOR:scope-boundary -->

- In scope now: `README.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `memory/.gitkeep`, `scratch/.gitkeep`.
- Explicitly out of scope now: creating or modifying HTML preview files under `.opencode/skill/sk-doc-visual/assets/sections/` and `.opencode/skill/sk-doc-visual/assets/components/`.
- `implementation-summary.md` is intentionally deferred until implementation completion.

<!-- /ANCHOR:scope-boundary -->

## 3. DOCUMENT MAP
<!-- ANCHOR:document-map -->

| File | Purpose | Status |
|------|---------|--------|
| `spec.md` | Requirements, extraction matrix, success criteria, risks | Planned and authored |
| `plan.md` | Phased implementation approach, dependencies, rollback | Planned and authored |
| `tasks.md` | Pending implementation tasks grouped by phase | Planned and authored |
| `checklist.md` | Verification gates with plan-stage status | Planned and authored |
| `decision-record.md` | ADR for extraction and naming conventions | Planned and authored |

<!-- /ANCHOR:document-map -->

## 4. SOURCE REFERENCE
<!-- ANCHOR:source-reference -->

- Canonical source: `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.
- Existing convention baseline: `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html` and `.opencode/skill/sk-doc-visual/assets/components/code-window.html` include `../variables/*` stylesheets and `../variables/template-defaults.js`.

<!-- /ANCHOR:source-reference -->

## 5. RELATED PHASES
<!-- ANCHOR:related -->

- Previous phase: `../001-initial-set-up/`.
- Implementation handoff from this phase: execute `tasks.md` once plan is approved.

<!-- /ANCHOR:related -->
