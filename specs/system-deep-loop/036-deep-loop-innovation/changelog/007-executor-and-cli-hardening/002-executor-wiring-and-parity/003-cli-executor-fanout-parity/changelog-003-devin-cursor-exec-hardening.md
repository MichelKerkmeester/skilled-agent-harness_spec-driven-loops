---
title: "Changelog: devin + cursor Fan-out Exec Hardening [007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening]"
description: "Re-map the devin and cursor lineage builders from live-verified CLI behavior so read-only leaves are genuinely read-only and workspace-write leaves never stall."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity`

### Summary

This phase re-maps the devin and cursor fan-out lineage builders from live-verified CLI behavior after live testing proved the mapped sandbox/permission flags wrong. Devin's `--sandbox` forces autonomous mode and ignores `--permission-mode`, so a read-only leaf could write; cursor in `-p` mode has all tools in an untrusted directory and refuses to run without a trust flag, and `--sandbox enabled` confines processes but still permits cwd writes. The goal is that a read-only leaf is genuinely read-only, a workspace-write leaf never stalls and keeps writes confined, and every non-interactive leaf clears its runtime's trust gate. The spec records its status as In Progress (~90%).
