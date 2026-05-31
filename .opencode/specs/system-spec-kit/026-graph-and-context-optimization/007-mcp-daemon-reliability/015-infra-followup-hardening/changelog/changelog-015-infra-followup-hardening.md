# Changelog — 015: Infra followup hardening

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Created changelog for child 001: Live coverage for the F2 clean-close reap barrier
- Created changelog for child 002: Substrate Code-Graph scenario tool-contract fix
- Created changelog for child 003: Worktree child-marker dispatch documentation
- Created changelog for child 004: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills
- Created changelog for child 005: Wire a second live code-graph daemon into the substrate stress harness
- Created changelog for child 006: Wire worktree-guard into the Claude SessionStart hook chain

## Why
This parent packet aggregates followup hardening tasks after the main infra investigations in 014. Each child addresses a specific followup item: live reap coverage, substrate scenarios, worktree dispatch rules, cli-* propagation, substrate 2nd daemon wiring, and SessionStart guard wiring.

## Verification
- All child changelogs created successfully
- validate.sh --strict (this packet): PASS
