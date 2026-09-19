---
title: "Implementation Summary: Orca CLI mcp-tooling specification"
description: "Summary of the implementation-ready planning packet, its evidence, and the follow-on work intentionally left deferred."
trigger_phrases:
  - "Orca specification summary"
  - "mcp-orca handoff"
  - "Orca validation evidence"
  - "deferred Orca implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/021-mcp-orca-cli"
    last_updated_at: "2026-09-19T12:31:05Z"
    last_updated_by: "implementation-owner"
    recent_action: "Integrated mcp-orca-cli and mcp-tooling routing surfaces"
    next_safe_action: "Obtain explicit authorization for live mutation/publishing tests or compiled-route activation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-021-mcp-orca-cli"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Can an authorized disposable Orca worktree or terminal mutate this repository?"
      - "When may the compiled-routing activation manifest be refreshed and promoted?"
    answered_questions:
      - "The packet is flat Level 3."
      - "The runtime posture is evidence-gated conservative."
      - "The installed Orca 1.4.205 registry has no native MCP command."
      - "The CLI-only leaf and ten-mode hub integration passed structural, package, and manifest gates."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Orca CLI mcp-tooling specification

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-mcp-orca-cli |
| **Status** | Complete — Orca leaf and mcp-tooling integration delivered; compiled serving and live mutating lanes deferred |
| **Completed** | 2026-09-19 |
| **Level** | 3 |
| **Deliverable** | Production leaf packet and coordinated hub integration, with explicit operator-gated follow-up |
<!-- /ANCHOR:metadata -->
## What Was Delivered

This packet records the authorized implementation continuation for the Orca CLI bridge. It carries the live executable facts, the nested workflow leaf, the mcp-tooling registry and two routing layers, the single advisor graph identity, the generated manifest, human documentation, playbooks, benchmark evidence, and release entries.

The implementation uses the inspected `/usr/local/bin/orca` version `1.4.205` surface. `orca agent-context --json` reported 234 commands and no native Orca MCP command, so the packet remains CLI-only and does not invent a Code Mode manual. The registry keeps a conservative workflow classification with `mutatesWorkspace: true` while controlled repository mutation remains unproven.

Live mutation, publishing, authentication, and browser-driving scenarios remain operator-gated; the benchmark records their specific `SKIP` blockers. Compiled serving is also not claimed because the activation status is `legacy` with cause `stale-manifest`.

### Delivered Files

| File or Surface | Action | Evidence |
|---|---|---|
| `.pi/skills/mcp-tooling/mcp-orca-cli/` | Created | Leaf package, install guide, four references, manual playbook, and changelog. |
| `.pi/skills/mcp-tooling/{mode-registry.json,hub-router.json,ROUTER.md}` | Modified | Ten-mode registry/router and packet-qualified resource routing. |
| `.pi/skills/mcp-tooling/{SKILL.md,README.md,description.json,graph-metadata.json}` | Modified | Hub contract, inventory, advisor identity, and version 1.7.0.0 metadata. |
| `.pi/skills/mcp-tooling/leaf-manifest.json` | Regenerated | Canonical generator reports ten reachable modes including mcp-orca-cli. |
| `.pi/skills/mcp-tooling/manual-testing-playbook/` | Modified | Ten primary scenarios, eight holdouts, and Orca ownership boundaries. |
| `.skilled/skills/mcp-tooling/benchmark/reports/orca-integration/` | Created | Redacted preflight, route/advisor replay, stale-manifest, and safety-skip artifacts. |
| `specs/mcp-tooling/021-mcp-orca-cli/` | Reconciled | Planning packet now reflects delivered integration and remaining gates. |

## How It Was Delivered

The authorized preflight resolved the executable, version, local command schema, version-matched guide, conditional references, and runtime status. The observed registry was checked for an MCP command before the backend was fixed as CLI-only. No installation, credential exposure, authentication, worktree mutation, terminal input, browser mutation, or publishing was performed.

The leaf was then package-validated, wired into the ten-mode hub, checked against the parent invariants, and included through canonical manifest regeneration. Current-source positive/negative routing and the system advisor were replayed; compiled-route status was recorded as legacy/stale rather than treated as serving evidence.

## Key Decisions

| Decision | Why |
|----------|-----|
| Flat Level 3 packet | Keeps coupled routing and safety decisions together; matches the operator's choice | Larger document; future changes still need disciplined task ownership | 9/10 |
| Workflow member with conservative mutation posture | Orca worktrees and terminals can change state; the runtime evidence supports a CLI-only bridge but not a read-only claim | Requires explicit gates for state-changing lanes | 10/10 |
| Existing advisor identity with narrow aliases | Matches hub architecture and reduces false positives | Requires coordinated vocabulary updates | 10/10 |
| Compiled activation deferred | Avoids publishing stale generated runtime state while the activation manifest is stale | The source router remains the authoritative current path | 10/10 |

## Verification

| Check | Result |
|-------|--------|
| Official source and live CLI preflight | PASS — `/usr/local/bin/orca` 1.4.205, schema version 1, 234 commands, version-matched guide and conditional references captured. |
| Leaf package validation | PASS — `package_skill.py .../mcp-orca-cli --check`. |
| Parent hub invariant check | PASS — ten modes, router contracts, manifest reachability, and version 1.7.0.0. |
| Generated manifest | PASS — canonical regeneration fixed the manifest; no-fix byte check passes. |
| Source route and advisor replay | PASS — Orca positives route to `mcp-orca-cli`; generic Git/OpenOrca negatives defer; explicit advisor prompts select mcp-tooling. |
| Strict spec validation | PASS — final command must print `RESULT: PASSED`. |
| Manual safety matrix | SKIP where authorization or disposable targets were absent; no state-changing Orca action was performed. |
| Compiled serving | DEFERRED — status is `legacy` with `stale-manifest`; no compiled-serving claim is made. |
| Scoped diff and comment hygiene | PASS for the Orca-owned scope; unrelated pre-existing scratch files remain outside this task. |

## Known Limitations

1. Exact flags and command arguments remain version-matched to the installed guide; the packet does not promise compatibility with another Orca release.
2. The inspected CLI registry exposes no native MCP command. Official app-level MCP integrations are outside this packet until a separate callable surface is verified.
3. Repository mutation, terminal receipts, browser-driving, authentication, automation, artifact sharing, and skill publishing were not exercised; the manual report records each safety skip and its blocker.
4. The compiled activation manifest is stale, so the runtime continues to use legacy routing. Refreshing or promoting compiled serving is a separate operator-controlled runtime publication step.
5. The bounded DeepSeek/cli-pi review remains supplemental evidence; local files, command output, and repository gates remain authoritative.

## Conformance Remediation Addendum (2026-09-19)

A later operator-directed pass brought the leaf packet into full sk-doc / sk-create-skill template conformance. The integration facts above are unchanged by this pass; only document structure, voice, and version identity moved.

### What Changed

| Surface | Change | Evidence |
|---------|--------|----------|
| `references/*.md` (4 files) | Re-shelled to the skill-reference template: full frontmatter with trigger phrases, 1-2 sentence intro, required OVERVIEW, numbered ALL-CAPS H2s, `---` dividers, HVR-clean prose. All observed Orca 1.4.205 facts preserved. | `validate_document.py --type reference`: 4/4 VALID, 0 issues. |
| `README.md` | Restructured to the skill README template: `---` dividers, four-row AT A GLANCE, problem-first OVERVIEW with narrative hook, INTEGRATION & NAVIGATION ownership table, HVR-clean prose. | `validate_document.py --type readme`: VALID, 0 issues (baseline was 6 blocking separator errors plus HVR hits). |
| `manual-testing-playbook/` | Restructured into the split-package shape: root directory playbook plus six category folders with ten per-feature scenario files, each carrying the full execution contract and source metadata. The persistence-contract marker is present. | Root playbook `--type playbook` VALID, 0 issues; 10/10 scenario files `--type playbook_feature` VALID, 0 issues. |
| `changelog/` | Renamed `v1.0.0.0.md` to `v0.1.0.0.md` and set every leaf frontmatter version to 0.1.0.0, matching the mcp-notion and mcp-obsidian first-version convention. The hub stays at 1.7.0.0. | Version sweep: 18/18 leaf files at 0.1.0.0; changelog validator VALID; no residual v1.0.0.0 self-references. |
| This packet | Added the conformance tasks and acceptance criteria AC-009 through AC-012 with evidence. | Strict validation rerun below. |

### Post-Remediation Gates

| Check | Result |
|-------|--------|
| Leaf package validation | PASS — `package_skill.py .../mcp-orca-cli --check`. |
| Parent hub invariant check | PASS — OK with 0 warnings at hub version 1.7.0.0; no manifest regeneration was needed because the playbook files are not manifest leaves. |
| Metadata fleet check | PASS — checked=13, passed=13, failed=0, fixed=0. |
| Leaf document validators | PASS — reference 4/4, readme, playbook root, and 10 scenario files all VALID with 0 issues. |
| HVR scripted checks | PASS — em dash, semicolon, Oxford comma, and banned-word greps return no matches in the leaf README and all four references. |
| Read-only cli-devin review | Dispatched over the restructured README, references, and playbook; findings triaged below. |

### Residual Out-of-Scope Observations

`SKILL.md` and `INSTALL-GUIDE.md` carry pre-existing Oxford-comma prose that predates this pass and sits outside the frozen remediation scope. They passed `package_skill.py --check` as shipped. A later voice pass over those two files would close the remaining HVR gap in the leaf.
