---
description: "User-guide artifact profiles for README and install-guide visualization in sk-visual-explainer"
---

# Visual Explainer — SpecKit User Guide Profiles

> LOAD PRIORITY: CONDITIONAL — load when `--artifact readme` or `--artifact install-guide` is set, or detector sees README/install guide structure.

Defines profile contracts for user-facing documentation artifacts so visual outputs stay consistent with SpecKit-style guidance and sk-documentation templates.

---

## Overview

This reference defines README and install-guide profile contracts, including detection rules, required sections, visual module mapping, and quality gates for artifact-aware rendering.

---

## 1. Profile Scope

Supported user-guide artifact IDs:
- `readme`
- `install-guide`

Profile behavior mirrors the `ArtifactProfile` model from `speckit_artifact_profiles.md` and is consumed by `generate`, `plan-review`, and `fact-check` commands.

---

## 2. Detector Rules

Detector precedence (same global order):
1. Filename (`README.md`, `README`, `INSTALL_GUIDE.md`, `INSTALL.md`, `install-guide.md`).
2. Title/frontmatter (`README`, `Install Guide`, `Installation`, `Quick Start`).
3. Section signatures.
4. Anchor signatures.

Tie-breaker:
- If both match, prefer `install-guide` when step-by-step install sections are present.

---

## 3. readme Profile

| Field | Value |
|---|---|
| `id` | `readme` |
| `required_sections` | `Overview`, `Features`, `Quick Start` or `Getting Started`, `Usage`, `Troubleshooting` |
| `required_anchors` | `overview`, `quick-start` or `getting-started`, `usage` |
| `required_cross_refs` | `INSTALL_GUIDE.md` (if present), main command/skill docs |
| `visual_modules` | `persona-summary`, `feature-grid`, `quick-start-path`, `faq-callouts` |
| `quality_checks` | `section_coverage_pct`, `placeholder_count`, `broken_local_link_count`, `task_step_completeness` |

Recommended view mode:
- default: `artifact-dashboard`
- optional traceability: map README sections to referenced code/docs when `--traceability` is requested.

---

## 4. install-guide Profile

| Field | Value |
|---|---|
| `id` | `install-guide` |
| `required_sections` | `Prerequisites`, `Install`, `Configure`, `Verify`, `Troubleshooting`, `Uninstall` (if supported) |
| `required_anchors` | `prerequisites`, `install`, `verify`, `troubleshooting` |
| `required_cross_refs` | `README.md`, environment/config docs |
| `visual_modules` | `phase-timeline`, `dependency-checklist`, `verification-matrix`, `rollback-notes` |
| `quality_checks` | `step_order_integrity`, `command_block_completeness`, `verification_signal_presence`, `placeholder_count` |

Recommended view mode:
- default: `artifact-dashboard`
- traceability: show command-to-validation map (`install` -> `verify` -> `rollback`) when requested.

---

## 5. Mapping to Visual Templates

When source is user-guide content:

- Use `speckit-artifact-dashboard.html` for default rendering.
- Use `speckit-traceability-board.html` only when `--traceability` is explicitly enabled.

Output metadata requirements remain identical:
- `<meta name="ve-artifact-type" content="readme|install-guide">`
- `<meta name="ve-source-doc" content="<workspace-relative-path>">`
- `<meta name="ve-speckit-level" content="n/a">`
- `<meta name="ve-view-mode" content="artifact-dashboard|traceability-board">`

---

## 6. User-Guide Quality Gates

Apply these gates before delivery:

1. All required sections for selected profile are represented.
2. No unresolved placeholders (`[YOUR_VALUE_HERE`, `[PLACEHOLDER]`).
3. Any command snippets include expected verify steps.
4. Cross-doc links resolve (`README` <-> `INSTALL_GUIDE`).
5. Navigation labels remain user-facing and avoid internal-only jargon.
