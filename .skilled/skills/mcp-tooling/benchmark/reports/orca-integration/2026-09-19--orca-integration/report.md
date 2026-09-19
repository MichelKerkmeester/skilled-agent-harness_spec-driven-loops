---
title: "mcp-tooling Orca integration benchmark"
description: "Dated source-router, advisor, preflight, and safety-matrix evidence for the Orca workflow-member integration."
version: 1.0.0.0
---

# mcp-tooling Orca integration benchmark

**Run label:** `2026-09-19--orca-integration`  
**Scope:** source hub integration, Orca read-only preflight, advisor routing, and negative ownership checks  
**Serving posture:** legacy authority; compiled activation is withheld by `stale-manifest`  
**Verdict:** PASS for executed read-only checks; SKIP for unauthorized mutation and publishing lanes

## Evidence artifacts

| Artifact | Purpose |
|---|---|
| `preflight-transcript.txt` | Redacted command summaries for executable, version, schema, guide, and runtime status |
| `routing-results.json` | Current-source router replay for positive Orca, blind holdout, negative, and defer prompts |
| `advisor-orca-cli.json` | Native advisor replay for the explicit `orca cli` phrase |
| `compiled-status.json` | Serving-authority and stale-manifest evidence |
| `redaction-check.txt` | Secret-pattern scan over this run directory |

## Results

| Scenario | Verdict | Evidence |
|---|---|---|
| ORCA-001 | PASS | `/usr/local/bin/orca`, version `1.4.205`, schema version 1, 234 local commands, and no MCP command signal |
| ORCA-002 | PASS | Version-matched guide JSON returned 221 content lines and browser, automation, and publishing references |
| ORCA-003 | SKIP | No separate authorized shell environment was provided for missing-executable recovery |
| ORCA-004 | PASS | Read-only `orca status --json` returned `ok: true` with a structured result |
| ORCA-005 | SKIP | No explicit mutation authorization or disposable worktree/terminal target |
| ORCA-006 | SKIP | No authorized disposable Orca browser tab/page |
| ORCA-007 | SKIP | No authorized disposable terminal for receipt and close testing |
| ORCA-008 | SKIP | No explicit artifact or skill publishing authorization |
| ORCA-009 | PASS | Source replay keeps Orca-managed prompts separate from generic tool ownership |
| ORCA-010 | PASS | `OpenOrca model label` produces `defer` and no `mcp-orca-cli` selection |
| ORCA-DEFER-001 | PASS | Hub-identity-only prompt produces `defer` with no selected mode |

## Interpretation

The source registry and router resolve the Orca positive prompt and the managed-workspace holdout to `mcp-orca-cli`. The negative OpenOrca and generic Git prompts do not select the Orca mode. The compiled front door was not treated as serving evidence: its status artifact records `servingAuthority: legacy` and `causeCode: stale-manifest`, so the source replay is reported as current source validation rather than compiled parity.

All skipped scenarios are safety skips, not claims of capability. No worktree, terminal input, browser mutation, authentication, automation, artifact publication, or skill sharing was performed by this run.
