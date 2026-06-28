---
title: "Tasks: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane"
description: "Ordered tasks to add guardedOdCommands to .codex/policy.json, implement the parser-backed evaluateOdCliPrecondition + same-command gate-file reader in pre-tool-use.ts, and verify deny/allow, same-segment binding, MCP-lane invariance, and 11/11 no-regression."
trigger_phrases:
  - "od cli bash lane tasks"
  - "guarded od commands precondition"
  - "design proof gate file bash"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/005-od-cli-bash-lane"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark od Bash-lane tasks complete; defer guarded_proxy cross-ref to live scope"
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
# Tasks: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Confirm the Bash lane and freeze the guarded/exempt verb sets (30 minutes)._


- [x] T001 Confirm `evaluateOpenDesignPrecondition` runs first and the Bash branch is reached only when `toolName === 'Bash'`; confirm `bashCommandFor` reads `command` / `tool_input.command` / `toolInput.command` / `input.command` (`.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`) [8m] — confirmed; `evaluateOdCliPrecondition` returns `null` for non-Bash, runs after the D4-R4 call
- [x] T002 Freeze the guarded `od` write-verb set — final set 5 verbs: `run start`, `ui respond`, `ui prefill`, `ui revoke`, `media generate`; `run redesign` dropped (not live); the optional design-feeding superset and all non-design mutating ops (`daemon start/stop`, `db vacuum`, `plugin *`, `connector execute`, `desktop import`, `auth internals`, `diagnostics export`, `project create`) excluded [10m] — frozen
- [x] T003 Freeze the read-only exemption set (never block): `run get/watch/info/list`, `ui list/show`, `files list/read`, `list`, `design-systems list`, `skills list`, `doctor`, `daemon status`, `tools design-systems read`, `automation list/view/show`, `memory tree list/view/show` [5m] — landed as the `READ_ONLY_OD_COMMANDS` set
- [x] T004 Resolve `od run redesign` against the `od` CLI help; if absent, drop it and rely on `run start` covering the follow-up redesign path (`run start --conversation <id>`) [7m] — ABSENT; dropped, `run start` covers the follow-up

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Policy block + parser-backed precondition + gate-file reader + wiring (2-3 hours)._


### Policy data
- [x] T005 Add `guardedOdCommands` as a key under `openDesignPreconditions`, holding the frozen guarded `od` write verbs in canonical `od <verb> <subverb>` form (`.codex/policy.json`) [20m] — `["od run start","od ui respond","od ui prefill","od ui revoke","od media generate"]`, applied by the orchestrator
- [x] T006 Verify NO read-only `od` verb appears in `guardedOdCommands`; anything not listed (and not read-only) falls through to allow (`.codex/policy.json`) [8m] — list holds 5 design-mutating verbs only; read-only verbs absent
- [x] T007 Add no spec/packet/phase IDs or spec paths; the block carries a durable `description` only; keep `bashDenylist` / `bash_denylist` / `openDesignPreconditions.guardedTools` untouched (`.codex/policy.json`) [5m] — additive sibling; prior blocks intact; evergreen

### Hook types + parser
- [x] T008 Add `guardedOdCommands?: readonly string[]` to `CodexPolicyFile`; add `resolveGuardedOdCommands(dependencies)` mirroring `resolveGuardedOpenDesignTools` (`pre-tool-use.ts`) [15m] — types added top-level + nested; resolver reads all three policy locations
- [x] T009 Implement `splitShellSegments(command)` — split on `;`, `&&`, `||`, `|`, `&`, newlines with quote handling — and `tokenizeShellSegment` + `odExecutableIndex` (bare `od`, `*daemon-cli.mjs`, `$OD_BIN` / `${OD_BIN}` / `$OD_DAEMON_CLI_PATH`, or a `node` / `ELECTRON_RUN_AS_NODE=1 <electron>` invocation whose script arg is one of those) (`pre-tool-use.ts`) [40m] — landed
- [x] T010 Bind the detected binary to the next non-flag `verb [subverb]` in the SAME segment via `odCommandCandidates` and classify against `guardedOdCommands` (guarded) vs read-only/not-listed (allow) (`pre-tool-use.ts`) [25m] — landed

### Gate-file carrier + token check
- [x] T011 Implement the same-command gate-file reader: `extractDesignProofFilePath` reads `--design-proof <path>`, `--design-proof=<path>`, or `OD_DESIGN_PROOF_FILE=<path>` from the SAME segment; `hasValidDesignProofGateFile` reads + `JSON.parse`s the file; validates via `dependencies.validateOpenDesignToken ?? isStructurallyValidDesignProofToken` (`pre-tool-use.ts`) [30m] — landed, single shared validator
- [x] T012 Deny on absent / unreadable / malformed / structurally-invalid / expired token, and on a gate file in a DIFFERENT segment than the guarded verb (cross-command); the token check fails closed (`isValidTokenTimeWindow` enforces the time window) (`pre-tool-use.ts`) [20m] — landed; `hasValidDesignProofGateFile` returns `false` on any read/parse/validate failure

### Wiring
- [x] T013 Implement `evaluateOdCliPrecondition(input, dependencies)` returning `null` for non-Bash / empty-command / non-`od` / read-only-`od`, and `{ decision: 'deny', reason: 'Guarded Open Design CLI command denied: missing or invalid design proof token' }` for a guarded verb without a valid same-command token (`pre-tool-use.ts`) [20m] — landed; parser exceptions fall through (`null`)
- [x] T014 Wire `evaluateOdCliPrecondition` into `handleCodexPreToolUse` AFTER the D4-R4 `evaluateOpenDesignPrecondition` call and BEFORE the existing denylist match; return its decision when non-null, else fall through (`pre-tool-use.ts`) [10m] — wired in that exact order
- [x] T015 Confirm no spec/packet/phase IDs or spec paths added to `pre-tool-use.ts`; comments keep the durable WHY only (evergreen [HARD]) (`pre-tool-use.ts`) [5m] — evergreen check clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_JSON validity, deny/allow, same-segment binding, MCP-lane invariance, and 11/11 no-regression (1.5-2 hours)._


### JSON validity
- [x] T016 Parse the policy file (`node -e "JSON.parse(require('fs').readFileSync('.codex/policy.json','utf8'))"`) — expect exit 0 [3m] — exit 0, `JSON_VALID`

### Deny-case (activation proof)
- [x] T017 Guarded deny, all invocation forms: `od run start …`, `node "$OD_BIN" run start …`, `ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" run start …`, and `od media generate …` / `od ui respond …` — each without a valid same-command gate file → `deny` [20m] — harness deny confirmed against the real source + policy
- [x] T018 Cross-command deny: `od run start … ; cat token.json` (gate file in a different segment) → `deny` [8m] — same-segment binding rejects the cross-command gate file
- [x] T018a Expired-token deny: a guarded verb with a structurally valid but expired gate file → `deny` [—] — `isValidTokenTimeWindow` enforces `issuedAt <= now < expiresAt`

### Allow-case (no-block-transport)
- [x] T019 Read-only `od` verbs unaffected: `od list`, `od run get`, `od run watch`, `od ui list`, `od files read` → `{}` [10m] — confirmed via `READ_ONLY_OD_COMMANDS`
- [x] T020 No false positive: `echo "od run start"` (no real binary), an `od`-substring in an unrelated path (`/usr/bin/od`), and `node build.js` → `{}` [8m] — per-segment binding requires a real od-binary; no over-match
- [x] T021 Valid token allow: a guarded `od run start … --design-proof <gatefile>` (and the `--design-proof=` / `OD_DESIGN_PROOF_FILE=` forms) with a fresh structurally valid same-command gate file → `{}` [10m] — confirmed

### Composition (MCP lane unchanged + Bash denylist intact)
- [x] T022 MCP-name lane unchanged: `start_run` and `mcp__open-design__start_run` without a token still `deny`; `get_run` / `list_projects` still `{}` [8m] — harness confirmed, D4-R4 behavior identical
- [x] T023 Bash denylist intact: `rm -rf /` still denies with the existing reason; `git status --short` → `{}` [4m] — confirmed

### No-regression + new tests
- [x] T024 Run the existing Codex hook vitest suite (`vitest run codex-pre-tool-use` from `.opencode/skills/system-spec-kit/mcp_server/`) → 11/11, test file unmodified [6m] — 11/11 passed; `tsc --noEmit` clean
- [x] T025 [P] Adversarial parser coverage — segmentation, all invocation forms, deny/allow, cross-command, expired-token, valid-token, and over-match — exercised against the real source [30m] — DELIVERED via the orchestrator's tsx harness (scratchpad); the committed additive `describe('Codex PreToolUse od-CLI design lane')` block in `tests/codex-pre-tool-use.vitest.ts` was DEFERRED (deviation) to keep the change additive and leave the shared test file unmodified at 11/11

### Documentation
- [ ] T026 Add the one-line cross-reference in `guarded_proxy.md` that the CLI surface is enforced by the Codex Bash lane (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [8m] — DEFERRED (P2): targets a live `mcp-open-design` skill file outside this phase's writable scope; the build touched only `pre-tool-use.ts` and `.codex/policy.json`. Enforcement lives in the hook regardless. Flagged for orchestrator follow-up.
- [x] T027 Mark all checklist.md items with evidence (`checklist.md`) [5m] — all P0 verified; the single P1 doc cross-ref (CHK-041) deferred with reason

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation + verification tasks marked `[x]` (T026 doc cross-ref deferred, P2, live-file scope)
- [x] No `[B]` blocked tasks remaining
- [x] `.codex/policy.json` is valid JSON with the `guardedOdCommands` block (5 verbs)
- [x] Guarded `od` write verbs (all invocation forms) without a valid same-command gate file are DENIED
- [x] Read-only `od` verbs and non-`od` Bash are unaffected (`{}`); over-match bait allows
- [x] Same-command binding enforced (cross-command gate file → deny); expired token → deny
- [x] MCP-tool lane (D4-R4) unchanged; existing vitest passes 11/11; `tsc --noEmit` clean
- [x] checklist.md fully verified (one P1 doc cross-ref deferred with documented reason)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Ordered: confirm lane + freeze verb set -> policy block + parser + gate-file reader + wiring -> verify
- Effort estimates per task; explicit verification tasks (deny/allow/cross-command/over-match/composition/11-11)
- Adversarial coverage via the orchestrator harness; committed vitest block + guarded_proxy.md note deferred (live-file scope)
-->
</content>
