---
title: "D4-R5 — odCliPreconditions parser-backed Bash lane + gate-file carrier"
description: "Add a parser-backed evaluateOdCliPrecondition Bash lane in pre-tool-use.ts that binds an od/daemon-cli.mjs invocation to its design-mutating write verb in the same segment and requires a same-command design-proof gate file, plus a guardedOdCommands list in .codex/policy.json, mirroring D4-R4's MCP-tool lane."
trigger_phrases:
  - "d4-r5 od cli bash lane"
  - "bash lane gate file design build"
  - "guarded od commands precondition"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/005-od-cli-bash-lane"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record codex self-protection + redesign-omitted decision"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts"
      - ".codex/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R5 — odCliPreconditions parser-backed Bash lane + gate-file carrier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Open Design is driven not only through MCP tools but also through the `od` CLI, which the agent runs as a Bash command. Those calls reach the Codex hook as `{ tool: 'Bash', tool_input: { command } }`, so `toolName` is `Bash` and the D4-R4 MCP-tool-name lane never sees them. They fall through to the destructive-command denylist, which matches shell patterns like `rm -rf /` but no Open Design verb. A `node "$OD_BIN" run start …` therefore fires a design build with no proof-token check at all — the CLI transport bypasses the name-membership gate entirely.

### Purpose
Add a parser-backed `evaluateOdCliPrecondition` Bash lane to `pre-tool-use.ts` plus a `guardedOdCommands` list to `.codex/policy.json`. The lane tokenizes the Bash command, binds an Open Design CLI invocation (bare `od`, `daemon-cli.mjs`, or `$OD_BIN` / `$OD_DAEMON_CLI_PATH`) to its design-mutating write verb in the same segment, and requires a same-command design-proof gate file carrying a structurally valid token. Absent, invalid, or cross-command token denies; read-only `od` verbs and non-`od` Bash pass untouched. It reuses the D4-R4 validator verbatim, so both transports share one fail-closed token check. This is defense-in-depth at the codex tool boundary; the D4-R1 guarded proxy remains the authoritative lane.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `evaluateOdCliPrecondition` and its parser helpers (`splitShellSegments`, `tokenizeShellSegment`, `odExecutableIndex`, `odCommandCandidates`, `extractDesignProofFilePath`, `hasValidDesignProofGateFile`, `resolveGuardedOdCommands`, the `READ_ONLY_OD_COMMANDS` set) in `pre-tool-use.ts`
- `CodexPolicyFile.guardedOdCommands` types, wired into `handleCodexPreToolUse` after the D4-R4 lane and before the denylist match
- `openDesignPreconditions.guardedOdCommands` in `.codex/policy.json` (the 5 design-mutating `od` write verbs)
- The same-command gate-file carrier (`--design-proof <path>` / `--design-proof=<path>` / `OD_DESIGN_PROOF_FILE=<path>`)
- Activation, deny-case, fresh-token allow, read-only allow, over-match allow, and no-regression verification against the real source and policy file

### Out of Scope
- The D4-R4 MCP-tool-name lane (`evaluateOpenDesignPrecondition`); it stays byte-for-byte unchanged
- Adding any read-only `od` verb to `guardedOdCommands`
- Gating non-design mutating `od` ops (`daemon start/stop`, `db vacuum`, `plugin *`, `connector execute`, `desktop import`, `auth internals`, `diagnostics export`, `project create`)
- A committed additive vitest `describe` block and the `guarded_proxy.md` cross-reference (deferred; see OPEN QUESTIONS)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modify | Add `evaluateOdCliPrecondition` + helpers + `guardedOdCommands` types; wire after the D4-R4 lane, before the denylist match |
| `.codex/policy.json` | Modify | Add `openDesignPreconditions.guardedOdCommands` (5 verbs) as a sibling of `guardedTools` / `bashDenylist` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parser-backed Bash lane fires only for `tool: 'Bash'` | `evaluateOdCliPrecondition` returns `null` for non-Bash, empty-command, and non-`od` inputs; runs after the D4-R4 lane, before the denylist |
| REQ-002 | Same-segment binding | A guarded `od` write verb is bound to a real od-binary in the same shell segment; `echo "od run start"` and an `od` substring in a path do not bind |
| REQ-003 | Deny without a valid same-command gate file | A guarded verb lacking a fresh, valid, in-command design-proof gate file is denied via the real source + policy |
| REQ-004 | Allow with a fresh token, allow read-only and over-match | A guarded verb with a valid same-command gate file allows; read-only `od` verbs and non-`od` Bash allow; no false positives |
| REQ-005 | No regression | The D4-R4 MCP-tool lane is unchanged, the Bash denylist still denies, and the Codex hook vitest passes 11/11 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reuse the single token validator | The Bash lane validates via `isStructurallyValidDesignProofToken` (or `dependencies.validateOpenDesignToken`); no second validator is introduced |
| REQ-007 | Keep the policy and hook evergreen | No spec, packet, or phase identifiers and no `specs/` paths in `.codex/policy.json` or `pre-tool-use.ts` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.codex/policy.json` carries `openDesignPreconditions.guardedOdCommands` with the 5 design-mutating verbs (`od run start`, `od ui respond`, `od ui prefill`, `od ui revoke`, `od media generate`) and parses as valid JSON.
- **SC-002**: A guarded `od` write verb (bare `od`, `node "$OD_BIN"`, `ELECTRON_RUN_AS_NODE=1 …`) without a valid same-command gate file is denied against the real source and policy.
- **SC-003**: A guarded verb with a fresh valid gate file allows, an expired token denies, read-only `od` verbs allow, and over-match bait (non-`od` Bash, `node build.js`, an `od` substring in a path, `echo "od run start"`) allows.
- **SC-004**: The D4-R4 MCP-tool lane is unchanged, the Bash denylist still denies `rm -rf /`, the vitest passes 11/11, and `tsc --noEmit` is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A read-only `od` verb gated | Legitimate transport is denied | Keep read-only verbs in `READ_ONLY_OD_COMMANDS`; verify `od list` / `od run get` / `od ui list` allow |
| Risk | An over-match false positive | A benign Bash command is denied | Per-segment binding; verify `echo "od run start"`, a path containing `od`, and `node build.js` allow |
| Risk | `od run redesign` named but not a live verb | Gating a non-existent verb adds no coverage | Omit `redesign`; `od run start --conversation` (the follow-up) is covered by the `run start` guard — RESOLVED in OPEN QUESTIONS |
| Risk | Codex cannot edit the policy that governs Codex | `cli-codex` cannot self-author the change | The orchestrator applied the 5-verb list and verified it independently — RESOLVED in OPEN QUESTIONS |
| Dependency | D4-R2/R4 PreToolUse branch + `isStructurallyValidDesignProofToken` | Without them the lane cannot validate or compose | Landed; the Bash lane reuses the validator and runs after the MCP-name lane |
| Dependency | `guarded_proxy.md` `cliVerbs` / `exemptTransport.cliVerbs` + `od_cli_reference.md` §4/§5 | Source of the guarded vs exempt CLI classification | Landed reference; the guarded and read-only sets are derived from them |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The gate file fails closed — a missing, unreadable, malformed, structurally invalid, or expired token denies the guarded verb (`isValidTokenTimeWindow` enforces `issuedAt <= now < expiresAt`).
- **NFR-S02**: The lane never denies a read-only `od` verb or a non-`od` Bash command; guarded membership covers design-mutating write verbs only.
- **NFR-S03**: Cross-command replay is denied — a gate file referenced in a different segment than the guarded verb does not satisfy the check.

### Defense-in-Depth
- **NFR-DD01**: This codex Bash lane is a second, independent net for the CLI transport. The D4-R1 guarded proxy remains the authoritative Open Design enforcement point.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Invocation Variants
- **Same verb, different binary**: bare `od run start`, `node "$OD_BIN" run start`, and `ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" run start` all bind via `odExecutableIndex`.
- **Substring noise**: `echo "od run start"` and a path containing `od` do not bind, because binding requires a real od-binary token in the segment.

### Failure Modes
- **Empty list**: If `guardedOdCommands` is empty, the lane returns `null` immediately and is inert/fail-open, no code revert needed.
- **Parser exception**: An internal parser/resolver error returns `null` (fall through). The token check is the fail-closed path, returning a deny on any gate-file read or validation failure.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One new branch plus eight parser/reader helpers in `pre-tool-use.ts`, and one policy list. The validator is reused, not re-implemented.
- **Risk concentration**: The material risks are an over-match false positive and a read-only verb wrongly gated; both are closed by per-segment binding and the explicit `READ_ONLY_OD_COMMANDS` set, and were exercised against the real source.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who should implement the edit to `.codex/policy.json` when the executor is Codex itself? **RESOLVED: The orchestrator. A Codex session is structurally barred from rewriting the policy that governs Codex (self-protection), so `cli-codex gpt-5.5 high fast` could edit only `pre-tool-use.ts`. The orchestrator applied `openDesignPreconditions.guardedOdCommands = ["od run start", "od ui respond", "od ui prefill", "od ui revoke", "od media generate"]` and verified the result independently. Sanctioned deviation, identical to D4-R4.**
- Is `od run redesign` a live verb that must be guarded? **RESOLVED: No. It is absent from the `od` CLI help; the redesign path is the follow-up `od run start --conversation`, already covered by the `run start` guard. `redesign` was omitted so the gate guards only real, design-mutating verbs; add it only if a distinct verb ships live.**
- Is this lane the authoritative Open Design gate? **RESOLVED: No. It is defense-in-depth at the codex tool boundary. The D4-R1 guarded proxy is the authoritative lane; this Bash lane closes the CLI transport the MCP-tool-name gate cannot observe.**
- Were the committed vitest block and the `guarded_proxy.md` cross-reference delivered? **RESOLVED: No, both deferred. Adversarial/parser coverage was delivered via the orchestrator's tsx harness against the real source (the shared test file is unmodified at 11/11); the committed `describe` block and the `guarded_proxy.md` one-line note were deferred because they touch shared/live files outside this build's minimal scope. Enforcement lives in the hook regardless.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Parser-backed evaluateOdCliPrecondition Bash lane + guardedOdCommands (5 verbs); same DESIGN_PROOF_TOKEN validator, gate-file carrier
- Deviations recorded: orchestrator applied the policy edit (codex self-protection); od run redesign omitted (verify-live); committed vitest block + guarded_proxy.md note deferred (live-file scope); defense-in-depth framing in RISKS/OPEN QUESTIONS
-->
</content>
