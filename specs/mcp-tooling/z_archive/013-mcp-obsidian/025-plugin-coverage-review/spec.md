---
title: "Spec — mcp-obsidian plugin-coverage review + scenario testing"
description: "Verify that every community plugin/theme supported by the mcp-obsidian skill is covered across all documentation surfaces, remediate the gaps, and headlessly test every plugin playbook scenario."
trigger_phrases:
  - "mcp-obsidian plugin coverage review"
  - "plugin coverage matrix"
  - "plugin playbook scenario testing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/z_archive/013-mcp-obsidian/025-plugin-coverage-review"
    last_updated_at: "2026-10-07T00:00:00Z"
    last_updated_by: "packet-reconstruction"
    recent_action: "No continuity update was recorded"
    next_safe_action: "None, the packet is archived"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-reconstruction"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec — mcp-obsidian plugin-coverage review + scenario testing

<!-- ANCHOR:metadata -->
## Status

- **Level:** 2
- **State:** complete
- **Type:** Read-only audit + headless scenario test (no runtime code changed by this packet; fixes landed in the 013 skill)

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## Purpose

Verify that every community plugin/theme supported by the `mcp-obsidian` skill is properly and completely covered across all documentation surfaces, remediate the gaps, and headlessly test every plugin playbook scenario. The review/test target is the shipped skill package at `.opencode/skills/mcp-tooling/mcp-obsidian/`, not this spec folder.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## Plugins in scope (11)

`beancount-finance`, `obsidian-tables`, `obsidian42-brat`, `iconic`, `health-md`, `charts`, `dataview`, `excalidraw`, `git`, `minimal`, `outliner`.

## Coverage question (per plugin)

Confirm each has: a reference set (data-model/workflows/troubleshooting/index), copyable assets, a feature-catalog card, a manual-testing playbook scenario (`OBS-0NN`), and SKILL.md router wiring (`PLUGIN_<X>` intent + resource map). Plus cross-cutting checks: no dangling links, accurate counts, template conformance, version hygiene, and file-layer safety.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## Acceptance criteria

- AC1: Every plugin confirmed present across all 5 surfaces, or each gap reported with `[SOURCE: file:line]` and remediated.
- AC2: A coverage matrix (11 × 5) with PASS/GAP per cell.
- AC3: Every plugin playbook scenario (`OBS-011..OBS-021`) headlessly executed with a PASS/FAIL/SKIP verdict backed by real command output.

<!-- /ANCHOR:success-criteria -->

## Outcome

All 11 plugins confirmed covered; the deep-review's real findings were remediated and shipped to v4; 10/11 scenarios PASS headlessly, 1 SKIP (BRAT, needs network). Full record in `review-report.md` and `scenario-test-results.md`; details in `implementation-summary.md`.

## Out of scope

Implementing further plugin features; vault data; installed plugin binaries; the visual in-app render step (needs a running Obsidian app).
