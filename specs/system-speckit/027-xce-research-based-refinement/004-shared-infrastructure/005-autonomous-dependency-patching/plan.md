---
title: "Implementation Plan: Autonomous Dependency Patching"
description: "Plan for an npm audit remediation script for OpenCode skill package lockfiles."
trigger_phrases:
  - "028 autonomous dependency patching plan"
  - "npm audit remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/005-autonomous-dependency-patching"
    last_updated_at: "2026-06-11T09:30:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Optimized implementation plan after final phase renumbering"
    next_safe_action: "Use implementation-summary.md for current verification evidence"
    blockers: []
---
# Implementation Plan: Autonomous Dependency Patching

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, npm, jq |
| **Surface** | OpenCode skill package roots |
| **Storage** | package.json and package-lock.json |
| **Testing** | Shell syntax, dry-run, npm audit |

### Overview

The implementation adds a lockfile-only remediation script that audits eligible package roots, applies supported npm override fixes, regenerates package locks without running scripts, and re-audits to verify results.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Current Hono advisory behavior reproduced with npm audit.
- [x] Target package roots identified.
- [x] Fixture mutation risk identified.

### Definition of Done

- [x] Script syntax passes `bash -n`.
- [x] Dry-run exits cleanly with fixtures excluded by default.
- [x] Target package roots report `found 0 vulnerabilities`.
- [x] Implementation evidence is recorded.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single shell entrypoint with small helper function for advisory range parsing.

### Key Components

- **Argument parser**: supports `--dry-run` and `--include-fixtures`.
- **Discovery**: finds lockfiles under the skills directory and excludes fixtures by default.
- **Audit parser**: reads npm audit JSON with jq.
- **Remediator**: writes npm overrides for simple supported ranges and regenerates lockfiles.
- **Verifier**: runs npm audit after remediation and records clean/patched/failed package roots.

### Data Flow

1. Discover eligible package lockfiles.
2. Run npm audit in each package root.
3. Convert supported advisory ranges into patched floors.
4. Apply override changes unless dry-run is enabled.
5. Regenerate lockfile metadata only.
6. Re-audit and summarize.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create phase folder and docs.
- [x] Add script entrypoint.

### Phase 2: Core Implementation

- [x] Add argument parsing.
- [x] Add fixture exclusion.
- [x] Add workspace detection.
- [x] Add advisory range parsing.
- [x] Add lockfile regeneration and audit verification.

### Phase 3: Verification

- [x] Run syntax check.
- [x] Run dry-run.
- [x] Run targeted npm audits.
- [x] Record implementation evidence.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Shell parse correctness | `bash -n` |
| Dry-run | Eligible root discovery and summary | `audit-and-fix.sh --dry-run` |
| Audit | Target package vulnerability state | `npm audit --audit-level=moderate` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm | Tooling | Green | Cannot audit or regenerate lockfiles |
| jq | Tooling | Green | Cannot parse audit JSON safely |
| Bash | Runtime | Green | Cannot execute remediation script |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert the phase docs and script if the automation path is not desired.
- Revert package manifest and lockfile changes if a patched dependency range conflicts with an upstream package.

<!-- /ANCHOR:rollback -->
