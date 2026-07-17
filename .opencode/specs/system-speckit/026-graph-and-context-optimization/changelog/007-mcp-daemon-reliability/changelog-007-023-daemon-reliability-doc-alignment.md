---
title: "Changelog: Daemon-reliability doc alignment [007-mcp-daemon-reliability/023-daemon-reliability-doc-alignment]"
description: "Chronological changelog for the Daemon-reliability doc alignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/023-daemon-reliability-doc-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The daemon-reliability features are now discoverable. They shipped as code plus spec packets (018-022), but a gpt-5.5 doc-alignment audit (cli-codex) plus a grep pre-scan found them in zero operator-facing surfaces: none of the 8 new env flags were in ENV_REFERENCE, there were no feature_catalog entries, no playbook scenarios, and no README or SKILL mentions. This packet closes that gap.

### Added

- 8 launcher/daemon flag rows to mcp_server/ENV_REFERENCE.md covering SPECKIT_LAUNCHER_LOG, _PATH, _MAX_BYTES, SPECKIT_LEASE_PROBE_RETRIES, _RETRY_TIMEOUT_MS, _RETRY_BACKOFF_MS, SPECKIT_STOP_HOOK_ORPHAN_SWEEP, and SPECKIT_DAEMON_REELECTION
- 5 feature_catalog entries (018, 019, 020, 022 under 14-pipeline-architecture; 021 under 16-tooling-and-scripts) with 5 index sections in feature_catalog.md
- 5 playbook scenarios 422-426 with 5 big-table rows, file-count self-check bumped 386 to 391, and scenario 419 cross-reference to the new 425 orphan-sweep fallback
- Lifecycle rows and flag pointers to mcp_server/README.md, bin/README.md, root README.md, database/README.md, and SKILL.md

### Changed

- Ran a gpt-5.5 doc-alignment audit and grep pre-scan confirming zero doc coverage for phases 018 through 022
- Defined entry slugs, playbook IDs 422-426, and the index/count invariants
- Verified count self-check (391 playbook, 325 catalog) and repo-wide markdown link check (0 broken across 3081 files)

### Fixed

- All 5 daemon-reliability features shipped with zero operator-facing documentation; this packet closes the gap across ENV_REFERENCE, feature_catalog, the manual testing playbook, all relevant READMEs, and SKILL.md

### Verification

- ENV_REFERENCE has all 8 new flags - PASS
- feature_catalog: 5 entries + 5 index sections - PASS
- playbook: 5 scenarios + 5 table rows - PASS
- playbook file-count self-check (391) - PASS
- catalog count prose (325) - PASS
- repo-wide markdown link check - PASS (0 broken / 3081 files)
- catalog SOURCE FILES grep-traceability - PASS (agent-verified)
- validate.sh --strict (this packet) - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/ENV_REFERENCE.md` | Modified | 8 launcher/daemon flag rows |
| `feature_catalog/14--pipeline-architecture/{mcp-launcher-persistent-log,lease-probe-retry-reap-hardening,mcp-code-index-reconnecting-proxy,daemon-ownership-reelection}.md + 16--tooling-and-scripts/orphan-sweep-stop-hook-activation.md` | Created | 5 catalog entries |
| `feature_catalog/feature_catalog.md` | Modified | 5 ### index sections |
| `manual_testing_playbook/.../{5 scenarios}.md` | Created | Scenarios 422-426 |
| `manual_testing_playbook/manual_testing_playbook.md` | Modified | 5 table rows + count 386->391 |
| `manual_testing_playbook/16--tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md` | Modified | 419 -> 425 cross-reference |
| `mcp_server/README.md, bin/README.md, root README.md, mcp_server/database/README.md, SKILL.md` | Modified | Lifecycle rows / flag pointers / artifact note |

### Follow-Ups

- Docs track default-off features. Phases 021 and 022 are documented as default-off/experimental; the docs describe the capability and its safety posture, not a live-by-default behavior.
- Phase 020 has no env flag. It is documented via the catalog/playbook and a README lifecycle row rather than an ENV_REFERENCE entry.
- Count invariant is shared. The playbook file-count self-check is a hand-maintained number; a concurrent session adding a scenario would require re-bumping it (verified at 391 just before commit).
