---
title: "Autonomous Dependency Patching: npm Audit Detection and Lockfile-Only Remediation"
description: "A shell entrypoint scans eligible OpenCode skill package roots, audits dependencies, applies supported npm override remediation, regenerates lockfiles without running install scripts, and re-audits each root. All five package roots audit clean."
trigger_phrases:
  - "024 autonomous dependency patching changelog"
  - "npm audit lockfile remediation"
  - "skill package security audit"
  - "027 024 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/024-autonomous-dependency-patching` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

OpenCode skill package roots (system-spec-kit, system-skill-advisor, mcp-code-mode, and siblings) each carry their own npm lockfile, and security findings in those lockfiles had no automated detection or remediation path. This phase shipped a packet-local shell entrypoint that scans the eligible package roots, runs `npm audit` on each, applies supported npm override remediation, regenerates lockfiles without executing install scripts (the safety property: no arbitrary postinstall code runs during remediation), and re-audits to verify the result. The phase was authored as a standalone packet by a concurrent session and relocated into the 027 epic as phase 024 at epic close.

### Added

- `024-autonomous-dependency-patching/scripts/audit-and-fix.sh` — audit and remediation entrypoint over the eligible skill package roots

### Changed

- None outside the packet. Remediation is lockfile-only by design; no package source or runtime behavior changed in this phase.

### Fixed

- None. The shipped run found all audited roots already clean.

### Verification

| Check | Result |
|-------|--------|
| Shell syntax | PASS: `bash -n` on the entrypoint |
| Dry-run | PASS: `Clean (no changes): 5`, `Failed (unfixable): 0`, `All audits clean.` |
| system-skill-advisor audit | PASS: 0 vulnerabilities |
| system-spec-kit audit | PASS: 0 vulnerabilities |
| mcp-code-mode audit | PASS: 0 vulnerabilities |

### Files Changed

| File | Action |
|------|--------|
| `024-autonomous-dependency-patching/scripts/audit-and-fix.sh` | Created |

### Follow-Ups

- CI or pre-commit integration of the audit entrypoint remains optional and undecided.
