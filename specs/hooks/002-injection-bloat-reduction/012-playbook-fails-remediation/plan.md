---
title: "Design Plan: Manual Testing Playbook FAIL Remediation"
description: "Sequence the 30-row remediation across runtime scenario contracts, shared production seams, operator machine actions, documented SKIPs, and the 011 wrapper rerun."
status: "remediation planned; implementation pending"
completion_pct: 25
trigger_phrases:
  - "manual playbook FAIL remediation plan"
  - "runtime remediation matrix"
  - "playbook operator action checklist"
  - "zero FAIL rerun plan"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/012-playbook-fails-remediation"
    last_updated_at: "2026-08-08T16:27:56Z"
    last_updated_by: "claude"
    recent_action: "Authored five-doc remediation design from verified 30-fail reconciliation"
    next_safe_action: "Implement repo fixes and operator actions before rerunning suites"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/002-injection-bloat-reduction/011-playbook-results-automation/spec.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs"
      - ".opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
      - ".opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts"
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:77666eb650b8f62e5e9bac7a7a61d0a8dabfa26cb730d7c36d213f5dcc6809cf"
      session_id: "2026-08-08-hooks-002-012"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Design Plan: Manual Testing Playbook FAIL Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario contracts, Node.js CommonJS tools, TypeScript Pi extension, shell/Node mirror checks |
| **Framework** | Runtime-specific cli-external-orchestration playbooks with sk-doc and sk-git shared tooling |
| **Storage** | 011 wrapper output, one persisted `results.csv` per affected run, plus the existing report artifacts |
| **Testing** | Playbook validator, Pi and runtime mirror checks, hook payload tests, operator probes, and the 011 wrapper rerun |

### Overview

The follow-on consumes the verified reconciliation as a frozen input. It repairs shared causes at their owning production seams, updates each affected scenario to current runtime behavior, records machine-local prerequisites as an operator checklist, and turns four non-fixable cases into documented SKIPs. The final gate reruns the affected suites through 011 and asserts zero FAIL rows in the persisted results.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The 011 wrapper/results contract and the scoring authority are linked without copying their formulas.
- [x] All 30 manifest IDs have a verified class and in-repo-fixability assignment.
- [x] The exact scenario paths and shared production seams are named below.
- [x] Repository fixes, operator actions, and reclassifications are separate tracks.
- [x] The implementation packet explicitly remains pending.

### Definition of Done

- [ ] All 20 IN-REPO FIX rows are implemented and their owning checks pass.
- [ ] All six OPERATOR-ACTION prerequisites are applied on the test machine or their permitted SKIP fallback is recorded.
- [ ] All four RECLASSIFY-TO-SKIP rows have scenario-level reasons and produce SKIP.
- [ ] The affected suites run through 011 with zero FAIL rows in the persisted `results.csv` set.
- [ ] The scoped diff contains no machine-local configuration or generated report residue.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Remediation Tracks

1. **IN-REPO FIX** owns the 20 rows whose verified in-repo-fixable value is yes. Scenario files are updated alongside the shared skill, reference, hook, mirror, validator, compiler, or test seam that owns the behavior.
2. **OPERATOR-ACTION** owns the six rows whose verified value is operator-action. The repository receives only durable instructions and scenario prerequisites; profile files, hook installation, and trust state are changed on the operator machine.
3. **RECLASSIFY-TO-SKIP** owns the four rows whose verified value is no-becomes-SKIP. The scenario records the exact unavailable capability and stops without a false PASS. CU-011 has an equivalent conditional SKIP branch if its operator approval is not permitted.

### Shared Root Causes

- Codex profile-v2 migration affects CX-012, CX-013, CX-014, and CX-026.
- Codex child-state and command-shape drift affects CX-006, CX-008, CX-016, CX-017, CX-018, CX-021, and CX-022; CX-017 also separates headless resume from interactive fork.
- Codex review/cloud evidence oracles affect CX-003 and CX-028; CX-023 remains TTY-only.
- OpenCode variadic message/file argument ordering affects CO-004; the thin CLEAR card pointer affects CO-024.
- Pi mirror drift affects PI-009; duplicate scenario identity and paired tool event delivery affect PI-020; optional/cite-only MCP behavior affects PI-001, PI-011, and PI-012.
- Cursor trust state affects CU-011; runtime-derived roster membership affects CU-024; Shell payload delivery through the shared sk-git hook affects CU-026; plan output channels affect CU-004.
- Devin native skill surface and permission-mode roster affect DV-012, DV-014, and DV-015; print/interactive lifecycle boundaries affect DV-007 and DV-008.

### Contract Boundary

The follow-on uses the [011 manual scenario wrapper](../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs) and [011 results contract](../011-playbook-results-automation/spec.md). It delegates scoring to the [scoring contract](../../../../skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) and does not clone that contract into scenario files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The table below is the authoritative implementation matrix. IN-REPO FIX, OPERATOR-ACTION, and RECLASSIFY-TO-SKIP are remediation tracks; TOOL-BUG, STALE-PLAYBOOK, and ENVIRONMENTAL are the verified final classes.

### Codex

| ID | Final class | Track | Exact scenario file | Planned change |
|----|-------------|-------|---------------------|----------------|
| CX-012 | STALE-PLAYBOOK | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/review-profile.md` | Replace legacy profiles.review instructions with layered review.config.toml; operator creates the file and removes the obsolete base entry. |
| CX-013 | STALE-PLAYBOOK | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/context-profile.md` | Replace legacy profiles.context instructions with layered context.config.toml; operator creates the file and removes the obsolete base entry. |
| CX-014 | STALE-PLAYBOOK | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/debug-profile.md` | Replace legacy profiles.debug instructions with layered debug.config.toml; include child-state dispatch guidance; operator creates the file. |
| CX-016 | STALE-PLAYBOOK | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/full-auto-hooks.md` | Replace removed --full-auto with -c approval_policy=never --sandbox workspace-write; route writes through child fanout; operator reconciles installed Codex hooks. |
| CX-017 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork.md` | Add child state to write-bearing resume; test exec resume headlessly and use codex fork only in a TTY-capable subscenario. |
| CX-018 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/integration-patterns/generate-review-fix-cycle.md` | Replace prose-only pre-approval with production fanout or AI_SESSION_CHILD=1 and MK_SPEC_GATE_ENFORCE=0 dispatch. |
| CX-021 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/prompt-templates/prompt-templates-inventory.md` | Use the current Single-File Application section identity instead of the removed anchor; add child-state dispatch for the write step. |
| CX-022 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/prompt-templates/clear-scoring-quality-card.md` | Resolve the canonical sk-prompt CLEAR card pointer and add child-state dispatch for the fix write. |
| CX-023 | ENVIRONMENTAL | RECLASSIFY-TO-SKIP | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/built-in-tools/review-tui-command.md` | Require a TTY for /review; record SKIP — stdin is not a terminal when absent, and do not score exec review against the TUI output contract. |
| CX-026 | STALE-PLAYBOOK | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/research-profile.md` | Replace legacy profiles.research instructions with layered research.config.toml; operator creates the file and removes the obsolete base entry. |
| CX-028 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/codex-cloud/codex-cloud-dispatch.md` | Check shared codex login status and current cloud verbs instead of requiring a cloud-local auth flag. |
| CX-003 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/cli-invocation/codex-exec-review.md` | Use a deterministic defective changed line or accept a valid no-findings result; retain raw stdout/stderr before attributing parser failure. |
| CX-006 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/sandbox-modes/workspace-write-sandbox.md` | Run the sandbox write check as an authorized child through production fanout or the required child environment. |
| CX-008 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/sandbox-modes/approval-policies.md` | Put -a before exec, use -a never or -c approval_policy=never for headless checks, and split interactive policies into a TTY scenario. |

### OpenCode

| ID | Final class | Track | Exact scenario file | Planned change |
|----|-------------|-------|---------------------|----------------|
| CO-004 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/file-attachment-via-f-flag.md` | Put the prompt before variadic -f; document the message/file ordering constraint in `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md`. |
| CO-024 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/clear-quality-card.md` | Follow the canonical pointer from `.opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md` and validate the canonical CLEAR content. |

### Pi

| ID | Final class | Track | Exact scenario file | Planned change |
|----|-------------|-------|---------------------|----------------|
| PI-009 | TOOL-BUG | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/agent-bridge/pi-subagents-agent-parse.md` | Regenerate the nine stale .pi/agents/*.md mirrors with `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` and require the sync check to exit 0. |
| PI-011 | STALE-PLAYBOOK | RECLASSIFY-TO-SKIP | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/mcp-host-integration/stdio-mcp-transport-discovery.md` | Pin the cite-only transcript path and digest; if unavailable, record SKIP for the uninstalled/unapproved optional MCP host without installing it. |
| PI-012 | STALE-PLAYBOOK | RECLASSIFY-TO-SKIP | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/mcp-host-integration/streamable-http-positive-control.md` | Separate documented stdio lifecycle evidence from remote transport; record SKIP until a pinned live HTTP handshake exists. |
| PI-001 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/cli-invocation/default-invocation-and-settings-merge.md` | Remove exact 0.82.1 equality and mandatory optional-host assertions; validate current supported help/version behavior and make the host conditional SKIP. |
| PI-020 | TOOL-BUG | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md` | Give the git scenario a unique ID, capture paired tool_call/tool_result events under one toolCallId, and assert appended advisory content. Give the other scenario its own ID. |

### Cursor

| ID | Final class | Track | Exact scenario file | Planned change |
|----|-------------|-------|---------------------|----------------|
| CU-011 | ENVIRONMENTAL | OPERATOR-ACTION | `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/mcp-integration/mcp-list-list-tools.md` | Keep trust approval operator-controlled; run cursor-agent mcp enable <id> outside the repo, or record the documented unapproved-server SKIP branch. |
| CU-024 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/agents-skills-rules/command-roster-invocation.md` | Derive membership/count from `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` and `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/command-scope.cjs`; retain /speckit-plan behavior. |
| CU-026 | TOOL-BUG | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md` | Update `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` to accept Cursor Shell and workspace_roots[0], add payload tests under `.opencode/skills/sk-git/scripts/tests/git-preflight-advisory.test.mjs`, regenerate mirrors, and rewrite the scenario for the direct shared-hook route. |
| CU-004 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/execution-modes/plan-mode-read-only.md` | Prove exit/read-only behavior from a supported channel, retain stream-JSON events, and make content inspection TTY-only when the plan artifact is not exposed headlessly. |

### Devin

| ID | Final class | Track | Exact scenario file | Planned change |
|----|-------------|-------|---------------------|----------------|
| DV-012 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/subagents/roster-enumeration.md` | Make the 13 filesystem mirror targets authoritative, use canonical permission mode auto, and test one bounded read-only dispatch instead of requiring model-generated enumeration. |
| DV-014 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/commands-and-skills/skills-roster.md` | Replace the invented .devin/skills command mirror with native devin skills list discovery; remove command-count assertions. |
| DV-015 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/commands-and-skills/mirrored-command-invocation.md` | Remove the nonexistent .devin/skills/speckit-plan parity check and invoke a real discovered repository skill instead. |
| DV-007 | STALE-PLAYBOOK | IN-REPO FIX | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/hooks/confirmed-events-smoke-matrix.md` | Assert the five current print-reachable events; move SessionEnd to a separately observed interactive check instead of hard-pinning the old six-event print oracle. |
| DV-008 | STALE-PLAYBOOK | RECLASSIFY-TO-SKIP | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/hooks/permission-request-auto-vs-bypass.md` | Keep canonical mode names and PreToolUse coverage separate; record SKIP for the unavailable headless PermissionRequest comparison on the current runtime. |

### Shared Production Files

The runtime rows above are not complete until their shared owners are addressed:

| File | Follow-on change |
|------|-----------------|
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Replace removed flags, prose-only Gate-3 exemption guidance, and legacy profile-v2 instructions; point write-bearing examples to child fanout. |
| `.opencode/skills/cli-external-orchestration/cli-codex/references/cli-reference.md` | Document layered profiles, current global flag placement, cloud login status, and current resume/fork command split. |
| `.opencode/skills/cli-external-orchestration/cli-codex/references/agent-delegation.md` | Align profile-loading and child-dispatch guidance with the production adapter. |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | State that the positional message precedes variadic -f/--file. |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Keep optional MCP host/trust behavior and current package requirements explicit. |
| `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | Preserve paired handler delivery keyed by toolCallId; align the scenario with the actual tool-result boundary. |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Enforce duplicate Feature ID rejection for every package and expose the failure before report association. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs` | Preserve unique generated scenario identities when scenarios enter compiler/report inputs. |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` | Regenerate and verify the nine stale Pi agent mirrors. |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` | Derive Cursor command and hook mirror membership; do not add a conflicting hand-written Cursor proxy. |
| `.opencode/skills/sk-git/scripts/tests/git-preflight-advisory.test.mjs` | New payload coverage for Bash/exec compatibility, Cursor Shell, workspace-root fallback, and fail-open input handling. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Freeze the verified 30-row matrix and confirm every scenario path exists.
- Record the baseline sync-agents-pi.cjs --check, sync-runtime-mirrors.cjs --check, playbook validator, and current affected-suite results before edits.
- Capture the current Codex profile/hook and Cursor MCP prerequisites without changing them.
- Confirm the follow-on branch or worktree scope contains repository files only.

### Phase 2: Core Implementation

- Complete the Codex group using the matrix and shared Codex files.
- Complete the OpenCode group and its argument-order/reference update.
- Complete the Pi group, including nine mirror regenerations and scenario-ID/paired-handler protection.
- Complete the Cursor group, including shared hook payload support, tests, mirror check, roster derivation, and plan-channel oracle.
- Complete the Devin group against native discovery and current lifecycle behavior.
- Apply the shared-tool-fix group before rerunning any runtime scenario.
- Apply the OPERATOR-ACTION checklist on the operator machine; do not commit its files.
- Apply the RECLASSIFY-TO-SKIP scenario edits for the four no-becomes-SKIP cases.

### Phase 3: Verification

- Run focused production checks for every changed shared seam.
- Run the affected scenarios through 011's wrapper for Codex, OpenCode, Pi, Cursor, and Devin.
- Assert that each affected results.csv has zero FAIL rows and that every SKIP has a reason naming the runtime blocker.
- Re-run the playbook package validator and mirror checks.
- Inspect the scoped diff for stale flags, literal counts, duplicate IDs, old proxy claims, machine-local paths, and generated report residue.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or evidence |
|-----------|-------|------------------|
| Matrix | All 30 IDs, final class, track, exact scenario path | Reconciled matrix in this plan; fails-manifest.txt as input |
| Contract | Scenario structure, unique IDs, root/index linkage, documented SKIP reasons | `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` |
| Pi mirror | Nine stale generated agents and expected sync state | `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs --check` |
| Runtime mirrors | Cursor command/hook membership and direct shared-hook source | `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` |
| Hook unit | Bash/exec compatibility plus Cursor Shell/workspace-root payloads | New `.opencode/skills/sk-git/scripts/tests/git-preflight-advisory.test.mjs` |
| Pi extension | Paired tool events, one toolCallId, advisory appended on result | `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` tests and PI-020 scenario |
| Operator | Codex layered profiles, Codex hook installation, Cursor MCP approval | Operator checklist below; machine-local evidence only |
| Rerun | Affected scenarios and persisted outcome rows | 011 wrapper; zero FAIL assertion across affected `results.csv` |
| Regression | Existing runtime/tool behavior outside the affected rows | Focused changed-seam tests plus the parent-owned whole gate |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Verified 30-row reconciliation | Evidence | Confirmed | The first-pass investigation cannot override final classes |
| 011 wrapper and results contract | Internal | Confirmed | No authoritative PASS/SKIP/FAIL persistence without it |
| Codex 0.147 profile-v2 behavior | External/runtime | Confirmed in source evidence | Profile rows remain unavailable until operator state is migrated |
| Pi mirror and playbook validators | Internal | Available | Tool-bug rows cannot be verified without their checks |
| Cursor Shell payload shape | External/runtime | Confirmed in source evidence | CU-026 remains unresolved until the shared hook handles it |
| TTY and optional MCP host | Environment | Variable | Relevant scenarios must use documented SKIP when unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any changed-seam regression, new duplicate ID, mirror drift, incorrect trust mutation, nonzero FAIL count, or report row without a reason.
- **Repository procedure**: Revert the affected scenario/tool/test changes as one scoped change set; restore the previous mirror outputs with the owning sync tool; retain the 011 historical report folders.
- **Operator procedure**: Preserve the pre-migration Codex profile values before moving them into layered files. If a profile or hook check regresses, restore the previous local files and leave the scenario documented as blocked rather than mutating more state.
- **Trust procedure**: Do not revoke or rewrite Cursor MCP approval automatically. If approval is not allowed, keep the explicit SKIP path.
- **Verification**: Rerun the focused failing check and the affected 011 wrapper scenarios after rollback; completion remains blocked until the result set is interpretable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Verified reconciliation, 011 contract, current baseline | All implementation groups |
| Shared-tool-fix | Setup | Runtime scenario reruns |
| Runtime scenario fixes | Setup and relevant shared seam | Operator and full rerun |
| Operator actions | Setup and scenario prerequisites | Profile, hook, and trust scenarios |
| SKIP reclassification | Setup | Documented non-fixable outcomes |
| Rerun verification | All prior groups | Packet implementation completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Codex scenarios and shared guidance | High | One focused remediation cycle |
| OpenCode scenarios and reference contract | Low | One focused remediation cycle |
| Pi mirrors, identity guard, and MCP scenarios | High | One focused remediation cycle plus sync verification |
| Cursor hook, mirror, roster, and plan scenarios | High | One focused remediation cycle plus payload verification |
| Devin native-surface and lifecycle scenarios | Medium | One focused remediation cycle |
| Operator actions and SKIP reclassification | Medium | One operator validation pass |
| Wrapper rerun and diff audit | High | One complete affected-suite run |
| **Total** | **High** | **One bounded follow-on implementation and verification pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline command outputs are saved outside the packet's canonical docs.
- [ ] Codex profile values and hook state have a recoverable local backup.
- [ ] Cursor trust state is unchanged until the operator explicitly approves it.
- [ ] The affected 011 report destination is known and not baseline/.

### Rollback Procedure

1. Stop at the first failed authoritative check.
2. Revert only the scoped repository changes for the affected runtime or shared seam.
3. Restore operator-local files from the pre-migration backup when a local action regresses.
4. Re-run the focused check, then the affected 011 scenarios.
5. Preserve the failure evidence and leave the packet pending if zero FAIL rows are not established.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert repository edits, restore local configuration backups, and retain historical benchmark evidence.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for scope, requirements, and zero-FAIL success criteria.
- **Tasks**: See `tasks.md` for the runtime, shared-tool, operator, SKIP, and rerun work groups.
- **Checklist**: See `checklist.md` for evidence tokens and completion gates.
- **Implementation state**: See `implementation-summary.md`; remediation is not implemented by this packet.
<!-- /ANCHOR:cross-refs -->
