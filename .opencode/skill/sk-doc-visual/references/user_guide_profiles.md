---
description: "User-guide artifact profiles for README and install-guide visualization in sk-doc-visual"
---

# Doc Visual — SpecKit User Guide Profiles

> LOAD PRIORITY: CONDITIONAL — load when `--artifact readme` or `--artifact install-guide` is set, or detector sees README/install guide structure.

Defines profile contracts for user-facing documentation artifacts so visual outputs stay consistent with SpecKit-style guidance and sk-doc templates.

---

## 1. OVERVIEW

This reference defines README and install-guide profile contracts, including detection rules, required sections, visual module mapping, and quality gates for artifact-aware rendering.

---

## 2. Profile Scope

Supported user-guide artifact IDs:
- `readme`
- `install-guide`

Profile behavior mirrors the `ArtifactProfile` model from `artifact_profiles.md` and is consumed by `/create:visual_html --mode create|analyze|verify` (internally routed to `generate|plan-review|diff-review|recap|fact-check`).

---

## 3. Detector Rules

Detector precedence (same global order):
1. Filename (`README.md`, `README`, `INSTALL_GUIDE.md`, `INSTALL.md`, `install-guide.md`).
2. Title/frontmatter (`README`, `Install Guide`, `Installation`, `Quick Start`).
3. Section signatures.
4. Anchor signatures.

Tie-breaker:
- If both match, prefer `install-guide` when step-by-step install sections are present.

---

## 4. readme Profile

| Field | Value |
|---|---|
| `id` | `readme` |
| `style_profile` | `README Ledger Profile` (default) |
| `required_sections` | `Hero/Overview`, `Quick Start`, `Documentation Overview`, `Memory Engine`, `Agent Network`, `Command Architecture`, `Skills Library`, `Gate System`, `Tool Integration`, `Extensibility`, `Configuration`, `Usage Examples`, `Troubleshooting`, `FAQ`, `Related Documents` |
| `required_anchors` | `top`, `quickstart`, `spec-kit-documentation`, `memory-engine`, `agent-network`, `command-architecture`, `skills-library`, `gate-system`, `tool-integration`, `extensibility`, `configuration`, `usage-examples`, `troubleshooting`, `faq`, `related-documents` |
| `required_cross_refs` | `INSTALL_GUIDE.md` (if present), main command/skill docs |
| `visual_modules` | `main-grid-shell`, `terminal-header`, `site-nav-link`, `toc-link`, `glass-card`, `code-window`, `data-table`, `copy-code-interaction`, `scroll-progress`, `footer` |
| `quality_checks` | `section_coverage_pct`, `anchor_coverage_pct`, `placeholder_count`, `broken_local_link_count`, `task_step_completeness` |

Recommended view mode:
- default: `artifact-dashboard`
- optional traceability: map README sections to referenced code/docs when `--traceability` is requested.

---

## 5. install-guide Profile

| Field | Value |
|---|---|
| `id` | `install-guide` |
| `style_profile` | `README Ledger Profile` |
| `required_sections` | `Prerequisites`, `Install`, `Configure`, `Verify`, `Troubleshooting`, `Uninstall` (if supported) |
| `required_anchors` | `prerequisites`, `install`, `verify`, `troubleshooting` |
| `required_cross_refs` | `README.md`, environment/config docs |
| `visual_modules` | `phase-timeline`, `dependency-checklist`, `verification-matrix`, `rollback-notes` |
| `quality_checks` | `step_order_integrity`, `command_block_completeness`, `verification_signal_presence`, `placeholder_count` |

Recommended view mode:
- default: `artifact-dashboard`
- traceability: show command-to-validation map (`install` -> `verify` -> `rollback`) when requested.

---

## 6. Mapping to Visual Templates

When source is user-guide content:

- Use `assets/templates/readme-guide-v2.html` as the default shell.
- Compose content with `assets/sections/*-section.html`, shared `assets/components/*.html`, and `assets/variables/*`.
- Use `assets/templates/drafts/*.html` for artifact-specific fallback layouts.
- Use `assets/templates/z_archive/*` only for legacy-reference diffs or explicit compatibility requests.

Output metadata requirements remain identical:
- `<meta name="ve-artifact-type" content="readme|install-guide">`
- `<meta name="ve-source-doc" content="<workspace-relative-path>">`
- `<meta name="ve-speckit-level" content="n/a">`
- `<meta name="ve-view-mode" content="artifact-dashboard|traceability-board">`

Style defaults:
- Use README Ledger token contract (`--bg`, `--surface`, `--text`, `--accent`, `--muted`, `--border`) with optional `--ve-*` aliases for compatibility.
- Use `Inter` + `JetBrains Mono` for README Ledger profile outputs.

---

## 7. User-Guide Quality Gates

Apply these gates before delivery:

1. All required sections for selected profile are represented.
2. No unresolved placeholders (`[YOUR_VALUE_HERE`, `[PLACEHOLDER]`).
3. Any command snippets include expected verify steps.
4. Cross-doc links resolve (`README` <-> `INSTALL_GUIDE`).
5. Navigation labels remain user-facing and avoid internal-only jargon.
