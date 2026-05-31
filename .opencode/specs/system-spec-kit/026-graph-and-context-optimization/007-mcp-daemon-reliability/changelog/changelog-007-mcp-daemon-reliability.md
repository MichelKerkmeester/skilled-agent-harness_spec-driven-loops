# Changelog — 007: MCP daemon reliability

**Shipped**: 2026-05-28
**Commit**: 4b2c5de6a3

## What Changed
- Created changelog for child 001: IPC socket dir canonicalize
- Created changelog for child 002: Code graph initial scan
- Created changelog for child 003: Daemon reliability research
- Created changelog for child 004: Nondestructive build
- Created changelog for child 005: Provider dispose
- Created changelog for child 006: Graceful exit watchdog
- Created changelog for child 007: Bridge liveness reap
- Created changelog for child 008: Spec memory graceful WAL checkpoint on close
- Created changelog for child 009: Shutdown durability
- Created changelog for child 010: At-rest WAL durability
- Created changelog for child 011: Deep review shutdown and codegraph
- Created changelog for child 012: Boot integrity retention probe
- Created changelog for child 013: Standalone save second-writer guard
- Created changelog for child 014: Infra memory DB and graph churn
- Created changelog for child 015: Infra followup hardening

## Why
This parent packet consolidates MCP daemon reliability work: socket-dir startup robustness, daemon-failure root-cause research + hardened roadmap, build-safety, and embedding-provider memory/supervision/bridge fixes that keep mk-spec-memory and mk_code_index healthy and self-recovering.

## Verification
- All child changelogs created successfully
- validate.sh --strict (this packet): PASS
