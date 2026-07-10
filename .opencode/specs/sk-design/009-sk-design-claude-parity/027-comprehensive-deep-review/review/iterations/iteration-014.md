# Iteration 014 - design-mcp-open-design Combined Pass

## Dimension

- Correctness, security, traceability, maintainability, and sk-doc conformance for `.opencode/skills/sk-design/design-mcp-open-design/**` only.
- Transport-axis rule applied: this packet is transport-only and does not decide design taste; design-affecting Open Design use must pair with `sk-design`.

## Files Reviewed

- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:20`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:46`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:239`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:277`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:278`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/references/mcp_wiring.md:17`
- `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:62`
- `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:78`
- `.opencode/skills/sk-design/design-mcp-open-design/README.md:100`
- `.opencode/skills/sk-design/design-mcp-open-design/README.md:108`
- `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:29`
- `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:54`
- `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:62`
- `.opencode/skills/sk-design/design-mcp-open-design/manual_testing_playbook/manual_testing_playbook.md:190`
- `.opencode/skills/sk-design/design-mcp-open-design/INSTALL_GUIDE.md:88`
- `.opencode/skills/sk-design/design-mcp-open-design/mcp-servers/open-design/README.md:3`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.0.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.4.0.1.md:1`
- `.opencode/skills/sk-design/mode-registry.json:145`
- `.opencode/skills/sk-design/mode-registry.json:148`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

#### P2-014-001 [P2] Secondary docs flatten guarded design-feeding reads into "always safe" reads

- File: `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:54`
- Evidence: The catalog says the read-only tools are "always safe to call" and includes design-bearing reads such as `get_active_context`, `get_project`, `get_file`, `search_files`, `get_artifact`, and `get_run` at `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:54`. The README repeats the same framing at `.opencode/skills/sk-design/design-mcp-open-design/README.md:100`. The canonical tool-surface reference defines a separate `feedsDesignDecision` axis and says guarded means `feedsDesignDecision OR mutatesWorkspace` at `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:62` through `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:68`, then marks `get_active_context`, `get_project`, `get_artifact`, `get_run`, `get_file`, and `search_files` as guarded design-feeding reads at `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:78` through `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:83`.
- Finding class: matrix/evidence
- Scope proof: The primary runtime contract is stronger and reduces severity: `SKILL.md` requires mandatory `sk-design` pairing before any generation or design-feeding read at `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:20` through `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:22`, and the feature catalog later restates the design-gate requirement at `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:62` through `.opencode/skills/sk-design/design-mcp-open-design/feature_catalog/feature_catalog.md:66`. The defect is therefore secondary-doc ambiguity rather than a broken runtime instruction.
- Affected surface hints: [`feature_catalog/feature_catalog.md`, `README.md`, `references/tool_surface.md`, `skDesignGate`]
- Recommendation: Replace "always safe" with "write-safe but guard design-feeding output" in the README/catalog read sections, and enumerate pure-transport reads separately from design-feeding reads to match `tool_surface.md`.

## Traceability Checks

- `spec_code`: PASS. The assigned review target exists and all inspected files were under `.opencode/skills/sk-design/design-mcp-open-design/**` except the required `mode-registry.json` and `review_core.md` cross-checks.
- `mode-registry transport entry`: PASS. `mode-registry.json:145` through `mode-registry.json:152` declares `packetKind:"transport"`, `backendKind:"od-cli-transport"`, allowed `[Read,Bash]`, forbidden `[Write,Edit,Task]`, and `mutatesWorkspace:false`, matching the packet's local scripts.
- `scripts security`: PASS. `install.sh`, `doctor.sh`, and `_common.sh` use quoted local app paths, do not use remote `curl|wget` installers, and report/verify local readiness only. `install.sh:26` through `install.sh:28` and `doctor.sh:109` through `doctor.sh:110` state that they do not wire MCP, start daemons, or mutate state.
- `mcp config traceability`: PASS with caveat. The packet documents this repo's Code Mode `.utcp_config.json` wiring as canonical at `mcp_wiring.md:146` through `mcp_wiring.md:163` and warns not to run native `od mcp install opencode` in this repo at `SKILL.md:235`.
- `mandatory pairing`: PASS. `SKILL.md:20` through `SKILL.md:22`, `SKILL.md:245`, `SKILL.md:278`, and `SKILL.md:290` make `sk-design` pairing a hard precondition for design-affecting Open Design use; no standalone design-judgment path was found in the primary runtime contract.
- `feature_catalog_code`: PARTIAL/P2. Feature catalog capability grouping matches the packet surface, but its "always safe" read wording conflicts with the two-axis guarded-read policy recorded in P2-014-001.
- `playbook_capability`: PASS. `manual_testing_playbook.md:190` through `manual_testing_playbook.md:195` includes negative and positive tests for the mandatory `sk-design` gate.
- `agent_cross_runtime`: PASS. No agents were dispatched. Transport docs distinguish opencode native wiring from this repo's Code Mode integration.
- `sk-doc conformance`: PASS with warnings. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-mcp-open-design --check` returned `Result: PASS` and seven warnings: `SKILL.md` exceeds the 3000-word recommendation, and six local changelog files are missing `version` frontmatter. These are recorded as conformance warnings, not counted as new blocking findings in this iteration.

## Verdict

PASS with advisories. One new P2 was found; no P0 or P1 findings were identified in the transport packet.

## Next Dimension

Proceed with the remaining Wave 4 `design-md-generator` iterations. Do not update the shared registry or strategy until the whole wave is ready to reduce.

Review verdict: PASS
