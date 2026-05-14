---
title: "Skill Advisor: Manual Testing Playbook"
description: "Canonical sk-doc manual testing playbook for the Skill Advisor manual scenario corpus across native MCP tools, runtime hooks, compatibility, daemon state, indexing, lifecycle, scorer, and Python compatibility workflows."
---

# Skill Advisor: Manual Testing Playbook

This document combines the canonical manual-validation contract for the `skill_advisor` package into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while the per-feature files carry scenario-specific execution truth.

---

This playbook package follows the sk-doc manual testing playbook template. The current corpus is the historical operator scenario set merged into the canonical manual-testing package on 2026-05-07, with former `SAD-NNN` scenarios absorbed into their current `NC` and `CL` homes.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--native-mcp-tools/`
- `02--cli-hooks-and-plugin/`
- `03--compat-and-disable/`
- `04--operator-h5/`
- `05--auto-update-daemon/`
- `06--auto-indexing/`
- `07--lifecycle-routing/`
- `08--scorer-fusion/`
- `10--python-compat/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. NATIVE MCP TOOLS](#7--native-mcp-tools)
- [8. CLI HOOKS AND PLUGIN](#8--cli-hooks-and-plugin)
- [9. COMPAT AND DISABLE](#9--compat-and-disable)
- [10. OPERATOR H5](#10--operator-h5)
- [11. AUTO UPDATE DAEMON](#11--auto-update-daemon)
- [12. AUTO INDEXING](#12--auto-indexing)
- [13. LIFECYCLE ROUTING](#13--lifecycle-routing)
- [14. SCORER FUSION](#14--scorer-fusion)
- [15. PYTHON COMPAT](#15--python-compat)
- [16. AUTOMATED TEST CROSS-REFERENCE](#16--automated-test-cross-reference)
- [17. FEATURE CATALOG CROSS-REFERENCE INDEX](#17--feature-catalog-cross-reference-index)
- [18. LEGACY ID CROSS-REFERENCE](#18--legacy-id-cross-reference)

---

## 1. OVERVIEW

This playbook provides 42 deterministic scenario files across 9 categories validating the Skill Advisor surface. Scenario IDs use a multi-prefix scheme: `NC` for native MCP tools, `CL` for CLI hooks and plugin behavior, `CP` for compatibility and disable controls, `OP` for operator H5 states, `AU` for auto-update daemon behavior, `AI` for auto-indexing, `LC` for lifecycle routing, `SC` for scorer fusion, and `PC` for Python compatibility.

Coverage note (2026-05-07): the prior operator scenario corpus now lives under `manual_testing_playbook/` as the canonical manual validation package. Former `SAD-NNN` IDs are deprecated and mapped to current feature files in section 18. The source root index describes 43 scenarios, but the source category tree contains 42 `NNN-*.md` scenario files and no `CL-002`; this root playbook reflects the live file inventory.

### Realistic Test Model

1. A realistic user request is given to an operator or runtime.
2. The operator decides whether to call the native MCP tool, run a prompt-time hook, execute compatibility shims, or inspect daemon/indexing behavior.
3. The operator captures command transcripts, MCP envelopes, hook stdout/stderr, and final verdicts.
4. The scenario passes only when observed output is prompt-safe, user-visible, and consistent with the documented feature contract.

### What Each Feature File Should Explain

- The realistic user request or operational state that should trigger the behavior.
- The deterministic setup and execution steps.
- The expected signals and failure modes.
- The desired user-visible outcome.
- The implementation, automated test, or catalog anchors that justify the scenario.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Node.js and Python 3 are available.
3. The MCP server build is current:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
```

4. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless a scenario explicitly sets it.
5. Operators can call Skill Advisor MCP tools or run the documented Node/Python commands from the repo root.
6. Destructive or stateful scenarios use a disposable workspace copy unless the scenario explicitly validates the live checkout.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Scenario ID and per-feature file path.
- User request or operational condition used.
- Exact command transcript or MCP call payload.
- Full JSON output or a focused excerpt containing asserted fields.
- Exit code for shell commands.
- Hook stdout and stderr captured separately when hook scripts are involved.
- Final user-facing verdict with rationale.
- Triage notes for every `FAIL`, `PARTIAL`, or `SKIP`.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `bash: <command>`.
- MCP tool calls shown as `advisor_recommend({ key: value })` or the named advisor tool call.
- Hook stdin payloads shown as JSON piped into the compiled hook script.
- `->` separates sequential steps inside one scenario contract.
- File references use repo-root-relative paths unless otherwise stated.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`.
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`.
3. Scenario execution evidence.
4. Feature-to-scenario coverage map.
5. Triage notes for all non-pass outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present in the captured output.
4. Evidence is complete and readable.
5. Raw prompt text is not leaked into diagnostics, attribution, cache metadata, or trust-state fields unless the scenario explicitly validates input echo behavior.
6. Outcome rationale is explicit and references the user-visible behavior.

Scenario verdict:
- `PASS`: all acceptance checks true.
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete.
- `FAIL`: expected behavior missing, contradictory output appears, prompt text leaks, or a critical check failed.
- `SKIP`: a real sandbox, dependency, or runtime blocker prevents execution and is documented.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`.
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`.
- `FAIL`: any mapped scenario is `FAIL`.

### Release Readiness Rule

Release is `READY` only when all 42 scenario files are `PASS` or have an approved `SKIP` with a real blocker, and no prompt-safety, rebuild, daemon, indexing, lifecycle, scorer, or compatibility failure remains unresolved.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning for the canonical Skill Advisor manual test package. The scenario corpus is large enough to split across operators while keeping category ownership clear.

### Operational Rules

1. Probe build state first with the MCP server build command.
2. Run native MCP scenarios before hook scenarios so runtime failures can be separated from scorer or tool failures.
3. Run rebuild and daemon scenarios in disposable workspaces when validating repair or generated state.
4. Assign explicit scenario IDs before parallel execution.
5. Keep stdout, stderr, and MCP JSON evidence in scenario-specific files under `/tmp/skill-advisor-playbook/`.
6. After each wave, record verdicts and blockers before starting the next wave.

### Recommended Wave Plan

- **Wave 1**: `NC-001..NC-006` native MCP behavior.
- **Wave 2**: `CL-001`, `CL-003..CL-005` runtime hooks and plugin bridge.
- **Wave 3**: `CP-001..CP-004` compatibility and disable controls.
- **Wave 4**: `OP-001..OP-003` H5 operator states.
- **Wave 5**: `AU-001..AU-005` auto-update daemon behavior.
- **Wave 6**: `AI-001..AI-005` auto-indexing behavior.
- **Wave 7**: `LC-001..LC-005` lifecycle routing.
- **Wave 8**: `SC-001..SC-005` scorer fusion.
- **Wave 9**: `PC-001..PC-005` Python compatibility.

---

## 7. NATIVE MCP TOOLS

This category validates native mcp tools scenarios `NC-001..NC-006`.

| ID | Scenario | File |
|---|---|---|
| NC-001 | Native advisor_recommend Happy Path | [001-native-recommend-happy-path.md](01--native-mcp-tools/001-native-recommend-happy-path.md) |
| NC-002 | Native advisor_status Transitions | [002-native-status-transitions.md](01--native-mcp-tools/002-native-status-transitions.md) |
| NC-003 | Native advisor_validate Slice Bundle | [003-native-validate-slices.md](01--native-mcp-tools/003-native-validate-slices.md) |
| NC-004 | Ambiguous Brief Rendering | [004-ambiguous-brief-rendering.md](01--native-mcp-tools/004-ambiguous-brief-rendering.md) |
| NC-005 | Lifecycle Redirect Metadata | [005-lifecycle-redirect-metadata.md](01--native-mcp-tools/005-lifecycle-redirect-metadata.md) |
| NC-006 | Advisor Status and Rebuild Separation | [006-advisor-status-rebuild-separation.md](01--native-mcp-tools/006-advisor-status-rebuild-separation.md) |

---

## 8. CLI HOOKS AND PLUGIN

This category validates cli hooks and plugin scenarios `CL-001..CL-005`.

| ID | Scenario | File |
|---|---|---|
| CL-001 | Claude Code UserPromptSubmit Hook | [001-claude-user-prompt-submit.md](02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md) |
| CL-003 | Gemini CLI UserPromptSubmit Hook | [003-gemini-user-prompt-submit.md](02--cli-hooks-and-plugin/003-gemini-user-prompt-submit.md) |
| CL-004 | Codex CLI Native Hooks And Wrapper Fallback | [004-codex-hook-and-wrapper.md](02--cli-hooks-and-plugin/004-codex-hook-and-wrapper.md) |
| CL-005 | OpenCode Plugin Bridge | [005-opencode-plugin-bridge.md](02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md) |

---

## 9. COMPAT AND DISABLE

This category validates compat and disable scenarios `CP-001..CP-004`.

| ID | Scenario | File |
|---|---|---|
| CP-001 | Python Shim --stdin Mode | [001-python-shim-stdin.md](03--compat-and-disable/001-python-shim-stdin.md) |
| CP-002 | Force Local And Force Native Toggles | [002-force-local-force-native.md](03--compat-and-disable/002-force-local-force-native.md) |
| CP-003 | Global Disable Flag | [003-global-disable-flag.md](03--compat-and-disable/003-global-disable-flag.md) |
| CP-004 | Daemon Absent Fallback | [004-daemon-absent-fallback.md](03--compat-and-disable/004-daemon-absent-fallback.md) |

---

## 10. OPERATOR H5

This category validates operator h5 scenarios `OP-001..OP-003`.

| ID | Scenario | File |
|---|---|---|
| OP-001 | Degraded Daemon | [001-degraded-daemon.md](04--operator-h5/001-degraded-daemon.md) |
| OP-002 | Quarantined Daemon | [002-quarantined-daemon.md](04--operator-h5/002-quarantined-daemon.md) |
| OP-003 | Unavailable Daemon | [003-unavailable-daemon.md](04--operator-h5/003-unavailable-daemon.md) |

---

## 11. AUTO UPDATE DAEMON

This category validates auto update daemon scenarios `AU-001..AU-005`.

| ID | Scenario | File |
|---|---|---|
| AU-001 | Chokidar Watcher Narrow Scope | [001-watcher-narrow-scope.md](05--auto-update-daemon/001-watcher-narrow-scope.md) |
| AU-002 | Workspace Single-Writer Lease | [002-lease-single-writer.md](05--auto-update-daemon/002-lease-single-writer.md) |
| AU-003 | Daemon Lifecycle and SIGTERM | [003-daemon-lifecycle-shutdown.md](05--auto-update-daemon/003-daemon-lifecycle-shutdown.md) |
| AU-004 | Generation-Tagged Snapshot Publication | [004-generation-publication.md](05--auto-update-daemon/004-generation-publication.md) |
| AU-005 | Rebuild From Source on Corrupt SQLite | [005-rebuild-from-source.md](05--auto-update-daemon/005-rebuild-from-source.md) |

---

## 12. AUTO INDEXING

This category validates auto indexing scenarios `AI-001..AI-005`.

| ID | Scenario | File |
|---|---|---|
| AI-001 | Deterministic Derived Extraction | [001-derived-extraction.md](06--auto-indexing/001-derived-extraction.md) |
| AI-002 | A7 Sanitizer at Every Write Boundary | [002-sanitizer-boundaries.md](06--auto-indexing/002-sanitizer-boundaries.md) |
| AI-003 | Provenance Fingerprints and Trust Lanes | [003-provenance-and-trust-lanes.md](06--auto-indexing/003-provenance-and-trust-lanes.md) |
| AI-004 | DF/IDF Corpus Stats Active-Only | [004-corpus-df-idf.md](06--auto-indexing/004-corpus-df-idf.md) |
| AI-005 | Anti-Stuffing and Cardinality Caps | [005-anti-stuffing.md](06--auto-indexing/005-anti-stuffing.md) |

---

## 13. LIFECYCLE ROUTING

This category validates lifecycle routing scenarios `LC-001..LC-005`.

| ID | Scenario | File |
|---|---|---|
| LC-001 | Derived-Lane-Only Age Haircut | [001-age-haircut.md](07--lifecycle-routing/001-age-haircut.md) |
| LC-002 | Asymmetric Supersession Redirects | [002-supersession.md](07--lifecycle-routing/002-supersession.md) |
| LC-003 | Archive and Future Skills Indexed But Not Routed | [003-archive-handling.md](07--lifecycle-routing/003-archive-handling.md) |
| LC-004 | Schema v1 to v2 Additive Backfill | [004-schema-migration.md](07--lifecycle-routing/004-schema-migration.md) |
| LC-005 | Lifecycle-Level Rollback | [005-rollback-lifecycle.md](07--lifecycle-routing/005-rollback-lifecycle.md) |

---

## 14. SCORER FUSION

This category validates scorer fusion scenarios `SC-001..SC-005`.

| ID | Scenario | File |
|---|---|---|
| SC-001 | Five-Lane Analytical Fusion | [001-five-lane-fusion.md](08--scorer-fusion/001-five-lane-fusion.md) |
| SC-002 | Projection of Skill Nodes and Edges | [002-projection.md](08--scorer-fusion/002-projection.md) |
| SC-003 | Top-2 Ambiguity Window | [003-ambiguity.md](08--scorer-fusion/003-ambiguity.md) |
| SC-004 | Lane Contribution Attribution | [004-lane-attribution.md](08--scorer-fusion/004-lane-attribution.md) |
| SC-005 | Lane-by-Lane Ablation Protocol | [005-ablation.md](08--scorer-fusion/005-ablation.md) |

---

## 15. PYTHON COMPAT

This category validates python compat scenarios `PC-001..PC-005`.

| ID | Scenario | File |
|---|---|---|
| PC-001 | Python Shim --stdin Round-Trip | [001-stdin-mode.md](10--python-compat/001-stdin-mode.md) |
| PC-002 | --force-native and --force-local Toggles | [002-force-native-force-local.md](10--python-compat/002-force-native-force-local.md) |
| PC-003 | threshold Confidence Flag | [003-threshold-flag.md](10--python-compat/003-threshold-flag.md) |
| PC-004 | Python Regression Suite 52/52 | [004-regression-suite.md](10--python-compat/004-regression-suite.md) |
| PC-005 | Python Bench Runner | [005-bench-runner.md](10--python-compat/005-bench-runner.md) |

---

## 16. AUTOMATED TEST CROSS-REFERENCE

The active inventory check lives at `.opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts`. It verifies the root playbook rows, the live per-feature file inventory, and the 42-scenario package count.

| Area | Automated test anchors |
|---|---|
| Native MCP tools | `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts`; `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts` |
| Hooks and plugin | `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts`; `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-runtime-parity.vitest.ts` |
| Compatibility and Python entrypoints | `.opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts`; `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` |
| Scoring, lifecycle, indexing, and daemon state | `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts`; `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-privacy.vitest.ts` |

Validator limitation: `validate_document.py` validates this root document and per-feature documents individually, but it does not prove that every command can execute in the current sandbox. Operators must capture execution evidence during release review.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

| Scenario prefix | Category | Feature file directory |
|---|---|---|
| NC | Native MCP tools | `01--native-mcp-tools/` |
| CL | CLI hooks and plugin | `02--cli-hooks-and-plugin/` |
| CP | Compat and disable | `03--compat-and-disable/` |
| OP | Operator H5 | `04--operator-h5/` |
| AU | Auto update daemon | `05--auto-update-daemon/` |
| AI | Auto indexing | `06--auto-indexing/` |
| LC | Lifecycle routing | `07--lifecycle-routing/` |
| SC | Scorer fusion | `08--scorer-fusion/` |
| PC | Python compat | `10--python-compat/` |

Per-feature files include SOURCE FILES sections with implementation, catalog, and test anchors where the source scenario provided them.

---

## 18. LEGACY ID CROSS-REFERENCE

- SAD-001 -> NC-001 (01--native-mcp-tools/001-native-recommend-happy-path.md)
- SAD-002 -> NC-004 (01--native-mcp-tools/004-ambiguous-brief-rendering.md)
- SAD-003 -> CL-001 (02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md)
- SAD-004 -> NC-006 (01--native-mcp-tools/006-advisor-status-rebuild-separation.md)
