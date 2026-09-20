---
title: "Tasks: Design authority for mcp-magicpath"
description: "Ordered work for binding the MagicPath mode to sk-design under the design agent persona and landing the changelog aggregation symlink."
trigger_phrases:
  - "design authority tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Design authority for mcp-magicpath

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the sibling transports' existing design pairing — evidence: `mcp-figma`, `mcp-refero` and `mcp-mobbin` all pair with `sk-design-md-generator`; `mcp-magicpath` matched zero occurrences of `sk-design` across its 28 files
- [x] T002 Decide which design skill this mode needs — evidence: `get_theme` returns named CSS variables and fonts, so the measure half is already satisfied by the API; the decide skill is what is missing, so `sk-design` rather than `sk-design-md-generator`
- [x] T003 Read the design agent's own contract before adopting it — evidence: the agent declares itself "LEAF-only and write-capable"; this transport declares `mutatesWorkspace:false` with `Write/Edit/Task` forbidden, so the two disagree in exactly one place
- [x] T004 [P] Record the changelog aggregation baseline — evidence: seven entries present (`mcp-aside-devtools`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-mobbin`, `mcp-refero`, `parent`); `mcp-magicpath`, `mcp-notion` and `mcp-obsidian` absent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Place the design authority ahead of everything else — evidence: phase detection now opens with `STEP 0: Adopt the design agent persona and load sk-design [MANDATORY, UNCONDITIONAL]`, and the Resource Loading Levels table gained its first `ALWAYS` row
- [x] T006 Write the pairing contract — evidence: `references/design-authority.md` created, carrying the ownership split table, the ungated-load rationale, the sibling divergence, the withheld write authority, and four named failure modes
- [x] T007 Resolve the authority conflict in the rules — evidence: `.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` ALWAYS rule 7 now states the persona is write-capable and the transport is not, and that the transport's narrower surface wins; ALWAYS rule 1 requires resolving the persona from the ACTIVE runtime's agent directory rather than a hardcoded path; the rule list grew from 6 to 7 with `allowed-tools` unchanged
- [x] T008 Give the withheld verdict an owner — evidence: the "When NOT to Use" design-judgment bullet rewritten, NEVER 6 now names `sk-design` as the owner instead of leaving it unassigned, a new NEVER 7 forbids answering without the pairing loaded, and a new ESCALATE 5 covers evidence conflicting with an `sk-design` decision
- [x] T009 [P] Update the packet's outward surfaces — evidence: `README.md` gained `sk-design`, the persona and `sk-design-md-generator` rows, the skip guidance corrected, both changelog rows and the new reference listed; version 1.0.0.0 to 1.1.0.0 in both `SKILL.md` and `README.md` including the self-referential verification row
- [x] T010 Attempt the machine-readable pairing, then revert it — evidence: an `mcp-magicpath` entry was written into `crossHubPairing`, the compiled-routing pre-push gate refused the push with `Routing inputs do not compile`, and the field was returned to `{}` per ADR-001; `registry-compiler.cjs:249-255` resolves its values as skill ids against `judgmentRegistries` and `sk-design` has no `mode-registry.json` to join that set
- [x] T011 Sweep the hub statements the binding invalidates — evidence: the transport-axis description rewritten to name the judgment owner per transport; `README.md`'s "Every design-affecting operation pairs in sk-design-md-generator", "Design work always pairs a transport with sk-design-md-generator" and "partner for the four design transports" all corrected; `SKILL.md`'s measured-reference bullet and `packetKind: "transport"` line corrected
- [x] T012 [P] Create the aggregation symlinks — evidence: `.opencode/changelog/mcp-tooling/mcp-magicpath -> ../../skills/mcp-tooling/mcp-magicpath/changelog` listing `v1.0.0.0.md` and `v1.1.0.0.md`; plus `mcp-notion` and `mcp-obsidian` under ADR-004
- [x] T013 [P] Write both changelog entries — evidence: packet `v1.1.0.0.md` and hub `v1.6.1.0.md`, each recording the change, the compatibility statement and the known limitations
- [x] T014 Regenerate the leaf manifest — evidence: `ci-skill-root-metadata.cjs --fix` reported `fixed=1`; `design-authority` present in the regenerated manifest
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Watch the audit fail before fixing it — evidence: `FAIL [H] mcp-tooling — STALE_GENERATED_FILE: leaf-manifest.json is stale (committed=26157199 fresh=e7efd9b6)`, `checked=14 passed=13 failed=1`
- [x] T016 Re-run the audit clean — evidence: `checked=14 passed=14 failed=0 fixed=0`, exit 0 read from the command itself rather than through a pipe
- [x] T017 Prove the tool surface did not change — evidence: the emitter still declares 14 tools, named `info,whoami,search_components,inspect_component,list_projects,list_components,list_teams,list_members,list_themes,get_theme,list_installed,selection,active_project,share_link`
- [x] T018 Prove the permission surface did not widen — evidence: `allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]` unchanged in the frontmatter; the registry still reports `forbidden: ["Write","Edit","Task"]` and `mutatesWorkspace: false`
- [x] T019 Sweep for residual false claims — evidence: zero matches for the three invalidated hub patterns across `README.md`, `SKILL.md` and `ROUTER.md`
- [x] T020 [P] Confirm the symlink did not break its neighbours — evidence: all eight entries in the aggregation directory resolve, including the six pre-existing siblings and `parent`
- [x] T021 [P] Confirm the registry still parses and its mode list is untouched — evidence: `mode-registry.json` parses; the nine `workflowMode` values are identical to the pre-change backup
- [x] T022 Bisect the compiled-routing failure rather than skipping the gate — evidence: holding the pre-change registry constant, the version bump compiled (`stale-manifest`, hash `80619309e451`) and the axis rewrite compiled (hash `0ed833d76d9f`), while `crossHubPairing` alone gave `compile-error` with a null hash; a bare `{"mcp-magicpath": "sk-design"}` failed identically, and an unrelated added extension key compiled fine, isolating the field rather than the shape
- [x] T023 Confirm the registry compiles after the reversal — evidence: `crossHubPairing` back to `{}` gives `stale-manifest` with hash `12f89accd785`, so the policy compiles again
- [x] T024 [P] Confirm every aggregation entry resolves after the amendment — evidence: all ten entries resolve, `mcp-notion` (1 file) and `mcp-obsidian` (20 files) included
- [x] T025 [P] Check whether the parent's `last_active_child_id` needs correcting — evidence: it reads `001-cli-transport-proof` while `last_active_at` is `null`, so the field was never stamped; it is tool-owned and derived, and hand-setting it would invent state the tooling never recorded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The design authority loads unconditionally, the transport is no wider than it was, and the mode appears in the aggregation directory
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] The authority conflict is resolved before any rule text is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The persona's write capability is documented as withheld, not inherited
- [x] CHK-011 [P0] The leaf manifest is generated, not hand-edited
- [x] CHK-012 [P1] The persona path resolves by runtime rather than being hardcoded
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] The fleet metadata audit passes with the packet's new reference present
- [x] CHK-022 [P0] The registered tool count and the permission list are unchanged
- [x] CHK-023 [P1] Every aggregation symlink resolves after the addition
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No hub statement survives claiming one design pairing covers all four transports
- [x] CHK-FIX-002 [P1] The divergence from the siblings is recorded as deliberate where a reader meets it
- [x] CHK-FIX-003 [P0] A blocked pre-push gate was diagnosed to root cause, not skipped with the escape hatch it offered
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Adopting the persona granted no tool the packet did not already hold
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] Both changelog entries record the change, its compatibility and its limitations
- [x] CHK-042 [P1] The reversal is recorded in a decision record rather than silently dropped
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---
