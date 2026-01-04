# Changelog

All notable changes to the **workflows-code** skill are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.0.2.8**] - 2026-01-02

Asset path updates for documentation skill restructure.

#### Changed
- Updated path references to `workflows-documentation` assets across 9 files

---

## [**1.0.2.4**] - 2026-01-01

Resource loading optimization and reorganization.

#### Changed
- **Priority-based resource loading**: Added P1/P2/P3 priority levels for asset loading
- **References reorganized**: Moved reference files into 5 sub-folders for better organization
- **Code style alignment**: Standardized JS files with snake_case naming and 3-line headers

#### Added
- `implementation-summary.md` template now required for all spec levels

---

## [**1.0.0.5**] - 2025-12-29

Deployment workflows added.

#### Changed
- Quick Reference updated with CDN deployment workflow
- Quick Reference updated with JS minification workflow

---

## [**1.0.0.4**] - 2025-12-29

Skill standardization release.

#### Added
- `cdn_deployment` reference
- `minification_guide` reference

#### Changed
- Standardized RELATED RESOURCES section in SKILL.md
- Standardized asset structure

---

## [**1.0.0.0**] - 2025-12-29

First official release of the workflows-code skill.

#### Added
- **Code Workflow Orchestrator**: Stack-agnostic development lifecycle management
- Implementation lifecycle (plan, code, verify)
- CDN deployment workflows
- JavaScript minification workflows
- Project-specific pattern detection and asset loading
