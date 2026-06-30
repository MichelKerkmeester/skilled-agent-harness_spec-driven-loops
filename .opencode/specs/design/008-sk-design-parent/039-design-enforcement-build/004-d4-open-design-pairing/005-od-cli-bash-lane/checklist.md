---
title: "Verification Checklist: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane"
description: "Activation/deny, no-block-transport, same-command binding, MCP-lane invariance, 11/11 no-regression, JSON-validity, fix-completeness, and evergreen checks for the guardedOdCommands Bash lane."
trigger_phrases:
  - "od cli bash lane checklist"
  - "guarded od commands precondition"
  - "design proof gate file bash"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/005-od-cli-bash-lane"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0 items; defer the guarded_proxy doc cross-ref with reason"
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
# Verification Checklist: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
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

- [x] CHK-001 [P0] D4-R4 lane confirmed: `evaluateOpenDesignPrecondition` runs first; gates by MCP tool-name membership only; `tool: 'Bash'` always falls through it (`pre-tool-use.ts`)
  - **Evidence**: `handleCodexPreToolUse` calls `evaluateOpenDesignPrecondition` first; `toolName='Bash'` is never in `guardedTools`, so the MCP lane returns `null` for every `od` Bash command — the gap the new lane closes
- [x] CHK-002 [P0] Token validator reuse confirmed: `isStructurallyValidDesignProofToken` (and the `dependencies.validateOpenDesignToken` override) is the same validator both lanes use
  - **Evidence**: `hasValidDesignProofGateFile` calls `dependencies.validateOpenDesignToken ?? isStructurallyValidDesignProofToken`; identical to the D4-R4 path, no second validator
- [x] CHK-003 [P0] Guarded `od` write-verb set frozen from `od_cli_reference.md` §4/§5 + `guarded_proxy.md` `cliVerbs` + research §7
  - **Evidence**: final set 5 verbs `run start`, `ui respond`, `ui prefill`, `ui revoke`, `media generate`; `run redesign` dropped (not live, CHK-060); non-design mutating ops excluded
- [x] CHK-004 [P0] Read-only `od` exemption set frozen from `guarded_proxy.md` `exemptTransport.cliVerbs` + read-only run verbs (`get`/`watch`/`info`/`list`)
  - **Evidence**: landed as the `READ_ONLY_OD_COMMANDS` set; every exempt verb falls through; none appears in `guardedOdCommands`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `.codex/policy.json` is valid JSON after the `guardedOdCommands` block is added
  - **Evidence**: `node -e JSON.parse(...)` exit 0 (`JSON_VALID`)
- [x] CHK-011 [P0] `guardedOdCommands` holds the frozen guarded `od` write verbs in canonical `od <verb> <subverb>` form; nothing read-only is present
  - **Evidence**: `["od run start","od ui respond","od ui prefill","od ui revoke","od media generate"]` read from the real policy; read-only verbs absent
- [x] CHK-012 [P1] Existing `bashDenylist` / `bash_denylist` / `openDesignPreconditions.guardedTools` keys left untouched; `guardedOdCommands` added as a sibling
  - **Evidence**: prior blocks intact; the new key is purely additive under `openDesignPreconditions`
- [x] CHK-013 [P1] `evaluateOdCliPrecondition` returns `null` (not `{}`) for non-Bash, empty-command, non-`od`, and read-only-`od` inputs so the existing flow is preserved
  - **Evidence**: source returns `null` on those paths; only a guarded verb without a valid same-command token yields a deny decision

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACTIVATION / deny-case: a guarded `od` write verb (all invocation forms — bare `od`, `node "$OD_BIN"`, `ELECTRON_RUN_AS_NODE=1 …`) without a valid same-command gate file is DENIED
  - **Evidence**: harness → `{decision:'deny', reason:'Guarded Open Design CLI command denied: missing or invalid design proof token'}` for `run start`, `media generate`, `ui respond`
- [x] CHK-021 [P0] SAME-COMMAND BINDING: a guarded verb whose gate file is referenced in a DIFFERENT segment (`od run start … ; cat token.json`) → DENIED; the gate file in the SAME command with a fresh valid token → `{}`; an expired token → DENIED
  - **Evidence**: cross-command replay denied; co-located fresh token allowed; `isValidTokenTimeWindow` denies the expired token
- [x] CHK-022 [P0] NO-BLOCK-TRANSPORT: read-only `od` verbs (`od list`, `od run get`, `od run watch`, `od ui list`, `od files read`) return `{}`
  - **Evidence**: none of the exempt verbs is denied at runtime
- [x] CHK-023 [P0] NO FALSE POSITIVE: `echo "od run start"` (no real binary), an `od` substring in an unrelated path (`/usr/bin/od`), and `node build.js` return `{}`
  - **Evidence**: the parser binds a guarded verb only to a real od-binary invocation in the same segment
- [x] CHK-024 [P0] MCP-tool lane UNCHANGED: `start_run` and `mcp__open-design__start_run` without a token still deny; `get_run` / `list_projects` still `{}`
  - **Evidence**: harness confirmed D4-R4 behavior byte-for-byte identical
- [x] CHK-025 [P1] Bash denylist intact: `rm -rf /` still denies with the existing reason; `git status --short` → `{}`
  - **Evidence**: no regression to the destructive-command lane
- [x] CHK-026 [P0] No-regression: the existing Codex hook vitest suite passes 11/11 (test file unmodified); the `od`-lane adversarial cases were exercised via the orchestrator harness, the committed additive `describe` block was deferred (Limitations 4)
  - **Evidence**: `vitest run codex-pre-tool-use` → 11 passed (11); `tsc --noEmit` clean

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: this is `class-of-bug` (the CLI surface is one of four interchangeable transports for the same daemon; the Bash lane closes the transport that bypasses the MCP-name gate)
  - **Evidence**: documented as a transport-coverage gap, not an instance fix; see spec §2 Problem Statement
- [x] CHK-FIX-002 [P0] Cross-consumer inventory: confirm the new `guardedOdCommands` key is read only by `resolveGuardedOdCommands`; no other policy consumer regresses
  - **Evidence**: `resolveGuardedOdCommands` is the lone consumer; `bashDenylist` / `openDesignPreconditions.guardedTools` readers unchanged
- [x] CHK-FIX-003 [P0] Adversarial parser table tests for delimiter, quoting, joined-input, env-prefix, and outside-binary cases (segment split, `echo "od …"`, `$OD_BIN`, `ELECTRON_RUN_AS_NODE=1`, `/usr/bin/od`)
  - **Evidence**: each adversarial row exercised via the orchestrator tsx harness against the real source (the committed vitest block was deferred, Limitations 4)
- [x] CHK-FIX-004 [P1] Matrix axes and row count listed: {verb class: guarded-write, read-only, non-`od`, denylisted-Bash} × {invocation form: bare `od`, `node "$OD_BIN"`, electron-as-node, substring-noise} × {token: absent, cross-command, expired, valid}
  - **Evidence**: axes enumerated; the harness executed the guarded-deny, read-only-allow, over-match-allow, valid-token-allow, expired-deny, cross-command-deny, MCP-lane, and denylist rows
- [x] CHK-FIX-005 [P1] Hostile-state variant: confirm the gate-file reader fails closed on unreadable / non-JSON / structurally-invalid files and never throws out of the hook
  - **Evidence**: `hasValidDesignProofGateFile` wraps read + `JSON.parse` + validate in try/catch returning `false` (deny); `evaluateOdCliPrecondition` returns `null` on any outer parser exception — neither propagates

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No read-only / transport `od` verb added to `guardedOdCommands` (would block legitimate transport): `run get/watch/info/list`, `ui list/show`, `files list/read`, `list`, `design-systems list`, `skills list`, `doctor`, `daemon status`, `tools design-systems read`, `automation list/view/show`, `memory tree list/view/show` all absent
  - **Evidence**: all exempt verbs verified absent from the 5-entry list; `od list` + `od run get` + `od run watch` allow at runtime
- [x] CHK-031 [P0] All core design-mutating write verbs present (none dropped): `run start`, `ui respond`, `ui prefill`, `ui revoke`, `media generate` (`run redesign` not guarded — not a live verb)
  - **Evidence**: each guarded in every supported invocation form; `run redesign` resolution recorded at CHK-060
- [x] CHK-032 [P1] Non-design mutating ops explicitly NOT gated by the design-proof token (`daemon start/stop`, `db vacuum`, `plugin *`, `connector execute`, `desktop import`, `auth internals`, `diagnostics export`, `project create`)
  - **Evidence**: absent from `guardedOdCommands` — a design token is the wrong key for them

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths in `.codex/policy.json` or `pre-tool-use.ts` (or any code comment)
  - **Evidence**: the added policy block carries a durable `description` only; the hook comments keep the durable WHY; evergreen check clean
- [ ] CHK-041 [P1] `guarded_proxy.md` carries the one-line cross-reference that the CLI surface is enforced by the Codex Bash lane (no enforcement logic moved there)
  - **DEFERRED (documented reason)**: the cross-reference targets a live `mcp-open-design` skill file outside this phase's writable scope. The build touched only `pre-tool-use.ts` and `.codex/policy.json`; a grep of `guarded_proxy.md` finds no CLI/Bash-lane note. Enforcement lives in the hook regardless, so the contract is unaffected. Flagged for orchestrator follow-up (P1 deferral pending approval).
- [x] CHK-042 [P1] spec/plan/tasks synchronized with the final guarded/exempt verb sets and the `.codex/policy.json` + `pre-tool-use.ts` scope
  - **Evidence**: spec, plan, and tasks all reference the same 5-verb guarded set, the `READ_ONLY_OD_COMMANDS` exemption, and the two target files

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Runtime harness lives in the session scratchpad only; not committed to the repo
  - **Evidence**: the tsx harness against the real `pre-tool-use.ts` + `.codex/policy.json` ran from the session scratchpad, outside the repo
- [x] CHK-051 [P1] Scope held: only `.codex/policy.json` and `pre-tool-use.ts` were modified by the build; the additive vitest block and `guarded_proxy.md` note were deferred
  - **Evidence**: codex edited only `pre-tool-use.ts`; the orchestrator edited only `.codex/policy.json`; no adjacent cleanup; this doc work touched only the phase folder

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:verify-live -->
## Verify-Live (Open Item)

- [x] CHK-060 [P1] `od run redesign` confirmed against the `od` CLI help, or dropped in favor of `run start` covering the follow-up redesign path
  - **Evidence**: `redesign` is absent from the bundled help table and the `mcp-open-design` references; DROPPED from `guardedOdCommands`. `run start` covers the `--conversation` follow-up redesign path; documented as sufficient

<!-- /ANCHOR:verify-live -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 11 | 10/11 (CHK-041 deferred with reason) |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification against the real `pre-tool-use.ts` + populated `.codex/policy.json`)

**Deferral note**: CHK-041 (the `guarded_proxy.md` cross-reference) is a P1 documentation item deferred because it targets a live skill file outside this phase's writable scope. All P0 blockers pass; the deferral does not affect enforcement, which lives in the hook. Flagged for orchestrator follow-up.

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Activation = deny guarded od write verb without a valid same-command gate file
Critical guards = do-not-block-transport (read-only od verbs) + same-command binding (no cross-command replay) + over-match safety + MCP-lane invariance
-->
</content>
