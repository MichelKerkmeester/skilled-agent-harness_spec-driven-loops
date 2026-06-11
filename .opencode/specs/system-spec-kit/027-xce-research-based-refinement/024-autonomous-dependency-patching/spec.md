---
title: "Autonomous Dependency Patching"
description: "Automate npm security audit detection and remediation across OpenCode skill package lockfiles."
trigger_phrases:
  - "028 autonomous dependency patching"
  - "npm audit fix"
  - "dependency security patch"
  - "lockfile vulnerability remediation"
  - "hono security fix"
  - "autonomous audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/024-autonomous-dependency-patching"
    last_updated_at: "2026-06-11T09:30:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Optimized packet docs and preserved requested phase number 028"
    next_safe_action: "Use the audit script as needed; CI/pre-commit integration remains optional"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "scripts/audit-and-fix.sh"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Autonomous Dependency Patching

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Phase** | 028 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

GitHub and npm security advisories can flag stale transitive dependencies in skill package lockfiles even when package ranges permit patched versions. The Hono advisories exposed the need for a repeatable remediation path across multiple package roots.

### Purpose

Provide an idempotent script that discovers skill package lockfiles, audits them, applies safe lockfile-only remediation, and verifies clean audit results without touching runtime installs.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scan package lockfiles under `.opencode/skills/`.
- Exclude benchmark/eval fixtures by default.
- Add or tighten npm `overrides` for supported advisory ranges.
- Regenerate lockfiles with `npm install --package-lock-only --ignore-scripts`.
- Run workspace audit-fix fallback for package roots with npm workspaces.
- Verify clean npm audit results.

### Out of Scope

- Non-npm dependency ecosystems.
- CI/pre-commit wiring.
- Runtime `node_modules` installation.
- Mutating frozen fixture lockfiles unless explicitly requested.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/audit-and-fix.sh` | Create | Autonomous audit and remediation script |
| `spec.md` | Create | Feature scope and success criteria |
| `plan.md` | Create | Implementation plan |
| `tasks.md` | Create | Task checklist |
| `implementation-summary.md` | Create | Verification evidence |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Audit all production skill package lockfiles | Dry-run lists eligible package roots and excludes fixtures by default |
| R2 | Remediate supported vulnerable packages | Script can add or tighten package overrides and regenerate lockfiles |
| R3 | Preserve fixture lockfiles by default | Benchmark/eval fixture locks are skipped unless `--include-fixtures` is passed |
| R4 | Handle workspace lockfiles | Workspace package roots run npm audit-fix fallback |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R5 | Avoid invalid semver writes | Unsupported advisory ranges are skipped with a warning |
| R6 | Produce clear operator output | Summary lists clean, patched, and failed package roots |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Script exits 0 with no changes when all eligible audits are clean.
- [x] Script excludes frozen fixtures by default.
- [x] Script uses a quiet boolean workspace detection path.
- [x] The three Hono-affected package roots report `found 0 vulnerabilities`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm | Script cannot audit or regenerate locks | Check command availability upfront |
| Dependency | jq | Script cannot parse audit JSON safely | Check command availability upfront |
| Risk | Fixture mutation | Benchmark seeds become invalid | Exclude fixture paths by default |
| Risk | Unsupported advisory range | Invalid override could be written | Skip unsupported ranges with warning |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If CI/pre-commit integration is added later, decide whether it should run dry-run only or apply lockfile fixes automatically.

<!-- /ANCHOR:questions -->
