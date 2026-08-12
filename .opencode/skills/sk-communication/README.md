---
title: sk-communication
description: Human-facing guide to the sk-communication skill, which surfaces the portable CLI communication-projection package that rewrites terse agent output into plain English while keeping canonical bytes unchanged.
trigger_phrases:
  - "sk-communication readme"
  - "communication projection skill guide"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# sk-communication

Make supported CLI and agent output read like careful plain English, without ever changing the underlying data.

## At a glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Wraps | `packages/cli-communication-projection/` |
| Routes on | "make CLI output readable", "claudish to english", "privacy-first rewrite", presentation tiers |
| Verify | `npm run check` in the package |

## Overview

Coding CLIs often emit terse, robotic status text. The communication-projection package rewrites it into readable prose behind privacy-first provider routing, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Anything unsafe or failed returns the exact original. This skill is the advisor-routable entry point: it does not duplicate the code, it routes a request to the right subsystem and enforces the load-bearing invariants.

## Quick start

1. Ask for a projection task, for example "rewrite this CLI output to plain English" or "wire up the projection layer" — the advisor loads this skill.
2. Read `SKILL.md` for the routing table, the two presentation tiers, and the rules.
3. Read `references/package-map.md` for the subsystem-to-path map and public entry points.
4. Integrate against the package's subpath exports and run `npm run check` from the package directory.

## Package map

See `references/package-map.md`. The implementation lives under `packages/cli-communication-projection/`, and its `docs/` folder holds install, configuration, privacy, support-matrix, rollback, and runbook guidance.

## Verification

- `ci-skill-root-metadata` reports the class-S root clean.
- `validate_skill_package.py` passes.
- The advisor recommends this skill for a projection prompt.
