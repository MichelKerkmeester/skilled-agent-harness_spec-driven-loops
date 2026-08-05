# Spec — mcp-obsidian plugin-coverage review + scenario testing

## Status

- **Level:** 2
- **State:** complete
- **Type:** Read-only audit + headless scenario test (no runtime code changed by this packet; fixes landed in the 013 skill)

## Purpose

Verify that every community plugin/theme supported by the `mcp-obsidian` skill is properly and completely covered across all documentation surfaces, remediate the gaps, and headlessly test every plugin playbook scenario. The review/test target is the shipped skill package at `.opencode/skills/mcp-tooling/mcp-obsidian/`, not this spec folder.

## Plugins in scope (11)

`beancount-finance`, `obsidian-tables`, `obsidian42-brat`, `iconic`, `health-md`, `charts`, `dataview`, `excalidraw`, `git`, `minimal`, `outliner`.

## Coverage question (per plugin)

Confirm each has: a reference set (data-model/workflows/troubleshooting/index), copyable assets, a feature-catalog card, a manual-testing playbook scenario (`OBS-0NN`), and SKILL.md router wiring (`PLUGIN_<X>` intent + resource map). Plus cross-cutting checks: no dangling links, accurate counts, template conformance, version hygiene, and file-layer safety.

## Acceptance criteria

- AC1: Every plugin confirmed present across all 5 surfaces, or each gap reported with `[SOURCE: file:line]` and remediated.
- AC2: A coverage matrix (11 × 5) with PASS/GAP per cell.
- AC3: Every plugin playbook scenario (`OBS-011..OBS-021`) headlessly executed with a PASS/FAIL/SKIP verdict backed by real command output.

## Outcome

All 11 plugins confirmed covered; the deep-review's real findings were remediated and shipped to v4; 10/11 scenarios PASS headlessly, 1 SKIP (BRAT, needs network). Full record in `review-report.md` and `scenario-test-results.md`; details in `implementation-summary.md`.

## Out of scope

Implementing further plugin features; vault data; installed plugin binaries; the visual in-app render step (needs a running Obsidian app).
