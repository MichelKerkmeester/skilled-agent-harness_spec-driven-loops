---
title: "Implementation Plan: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane"
description: "Add a guardedOdCommands list to .codex/policy.json plus a parser-backed Bash precondition in pre-tool-use.ts that binds an od/daemon-cli.mjs invocation to its design-mutating write verb in the same segment and requires a same-command design-proof gate file, mirroring D4-R4's MCP-tool lane."
trigger_phrases:
  - "od cli bash lane plan"
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
    recent_action: "Mark plan gates and phases complete with one-line evidence"
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
# Implementation Plan: odCliPreconditions — guard Open Design `od` write verbs in the Codex Bash lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript hook + JSON policy data |
| **Hook** | `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` (the Codex PreToolUse Bash branch) |
| **Policy** | `.codex/policy.json` (repo-local, sibling to `bashDenylist` / `openDesignPreconditions`) |
| **Testing** | Vitest (`tests/codex-pre-tool-use.vitest.ts`) + a node runtime harness against the real `.codex/policy.json` |

### Overview

D4-R4 (the landed sibling phase) gates Open Design **MCP tool names** — `start_run`, `create_artifact`, `mcp__open-design__start_run`, and their wired variants — via `evaluateOpenDesignPrecondition`, which checks exact membership in `policy.openDesignPreconditions.guardedTools` and denies a guarded call lacking a valid `DESIGN_PROOF_TOKEN`.

The gap: Open Design is also driven through the `od` CLI, which the agent runs as a **Bash command**. Those calls reach the hook as `{ tool: 'Bash', tool_input: { command: '…' } }`, so `toolName` is `'Bash'`, never `start_run`. The D4-R4 name-membership lane never sees them, and they fall through to the existing Bash denylist, which only matches destructive shell patterns (`rm -rf /`, `git reset --hard`, …) — not Open Design design verbs. A `node "$OD_BIN" run start …` therefore fires a design build with **no proof-token check at all**.

This phase closes that bypass with a Bash-lane analogue of D4-R4: a `guardedOdCommands` list in `.codex/policy.json` plus a new parser-backed `evaluateOdCliPrecondition` branch in `pre-tool-use.ts`. The branch tokenizes the Bash command, binds an Open Design CLI invocation (bare `od`, `daemon-cli.mjs`, or `$OD_BIN`/`$OD_DAEMON_CLI_PATH`) to its **design-mutating write verb in the same command segment**, and requires a **same-command design-proof gate file** carrying a structurally valid token. Absent or cross-command token → `deny`. Read-only `od` verbs (`od run watch`, `od list`, `od ui list`, …) are never guarded and pass untouched.

The MCP-tool lane (D4-R4) is unchanged, and the existing 11/11 vitest suite must still pass; the new lane is purely additive.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D4-R4 MCP-tool lane shape confirmed (`evaluateOpenDesignPrecondition` runs first; `resolveGuardedOpenDesignTools` reads `policy.openDesignPreconditions.guardedTools`; `isStructurallyValidDesignProofToken` is the validator) — read from `pre-tool-use.ts`
- [x] Bash branch confirmed: `bashCommandFor` reads `command` / `tool_input.command` / `toolInput.command` / `input.command`; `denylistMatch` runs only for `tool: 'Bash'` — read from `pre-tool-use.ts`
- [x] Design-mutating `od` verb set derived from `od_cli_reference.md` §4/§5 + `guarded_proxy.md` `cliVerbs` + research §7 (D4-R5) and the spec — frozen to 5 verbs (`redesign` omitted)
- [x] Read-only `od` verb exemption set derived from `guarded_proxy.md` `exemptTransport.cliVerbs` + the read-only run verbs (`watch`/`info`/`list`) — landed as the `READ_ONLY_OD_COMMANDS` set
- [x] `od run redesign` resolved against the `od` CLI help — ABSENT; omitted from `guardedOdCommands`, `run start --conversation` follow-up covered by the `run start` guard (§3 Open Item)

### Definition of Done
- [x] `.codex/policy.json` carries a `guardedOdCommands` list (under `openDesignPreconditions`) covering the design-mutating `od` write verbs — 5 verbs present, applied by the orchestrator
- [x] `pre-tool-use.ts` adds `evaluateOdCliPrecondition`, invoked after the D4-R4 call and before the existing Bash denylist match — wired at the `handleCodexPreToolUse` order (D4-R4 lane → od-CLI lane → denylist)
- [x] A guarded `od run start …` (and its `$OD_BIN` / `daemon-cli.mjs` invocation forms) without a same-command valid gate file → `deny` — harness deny confirmed against the real source + policy
- [x] A read-only `od list` / `od run watch` / `od ui list` → no deny (`{}`) — confirmed allow via `READ_ONLY_OD_COMMANDS`
- [x] The MCP-tool lane (D4-R4) is byte-for-byte unchanged in behavior — guarded MCP names still deny, transport names still allow — harness confirmed
- [x] The existing Codex hook vitest suite still passes 11/11 — confirmed, test file unmodified; the additive `od`-lane coverage was delivered via the orchestrator harness (committed `describe` block deferred, see §3 / Limitations)
- [x] No spec/packet/phase IDs or spec paths in `.codex/policy.json` or `pre-tool-use.ts` (evergreen [HARD]) — durable `description` only; evergreen check clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Declarative policy data drives an already-wired enforcement style. `.codex/policy.json` owns the guarded-verb membership; `pre-tool-use.ts` owns the parser + token check. The new lane reuses the D4-R4 token validator (`isStructurallyValidDesignProofToken`) verbatim — same fail-closed semantics, different transport (a Bash command string + a gate file instead of an MCP `tool_input.designProofToken`).

### Enforcement home — recommendation

**Recommendation: the codex Bash lane (`.codex/policy.json` `guardedOdCommands` + `pre-tool-use.ts` `evaluateOdCliPrecondition`), NOT the proxy.**

Rationale:
1. `guarded_proxy.md` explicitly states it "defines a contract, not a running server," sitting at the **agent-side adapter boundary** for the MCP / HTTP / Skills surfaces. A raw Bash `od run start` bypasses that adapter entirely — that bypass is the whole reason D4-R5 exists. The proxy contract cannot observe or deny a shell command.
2. The Codex PreToolUse hook is the **only** place a raw `od` Bash invocation is observable before it executes. It already receives `{ tool: 'Bash', tool_input: { command } }`, already has the Bash-command extractor and the destructive denylist, and already hosts the D4-R4 token validator. The new lane is the lowest-friction home that *actually enforces*.
3. `guarded_proxy.md` keeps a one-line cross-reference (the CLI surface is enforced by the Codex Bash lane), but no enforcement logic moves there — keeping the contract a contract and the enforcement where the command is visible.

### The guarded `od`-CLI design-mutating verb set (the D4-R5 core)

Deny-by-default; each fires a design build / render / generation, or answers the build form, so each must carry a valid design-proof token:

| `od` verb (canonical) | Why design-mutating | Source |
|---|---|---|
| `od run start` | Fires turn 1 / commissions the build / spawns the inner agent | `od_cli_reference.md` §4/§5; `tool_surface.md` §5 |
| `od run redesign` | Re-generation pass (named by the brief / spec / research §7) — **NOT in the bundled `--help`; verify-live** | `spec.md` §1; research §7 (D4-R5) |
| `od ui respond` | Submits the discovery-form answer that **fires the build** | `tool_surface.md` §5; `guarded_proxy.md` `cliVerbs` |
| `od ui prefill` | Pre-fills a GenUI surface (shapes the build input) | `od_cli_reference.md` §4; `guarded_proxy.md` `cliVerbs` |
| `od ui revoke` | Revokes a GenUI surface | `od_cli_reference.md` §4; `guarded_proxy.md` `cliVerbs` |
| `od media generate` | Generates image/video/audio into the active project | `od_cli_reference.md` §4/§5; `guarded_proxy.md` `cliVerbs` |

**Recommended superset (implementer decision, design-feeding only):** `guarded_proxy.md` `cliVerbs` additionally lists design-feeding writes — `od artifacts create`, `od files write`, `od research search`, `od automation create`, `od automation run`, `od memory tree edit`, `od memory tree move`. Seeding these into `guardedOdCommands` widens coverage without false positives. **Do NOT add the non-design mutating ops** (`od daemon start/stop`, `od db vacuum`, `od plugin install/publish/login/trust`, `od connector execute`, `od desktop import`, `od auth internals`, `od diagnostics export`, `od project create`): they mutate but are not *design* work, so a **design**-proof token is the wrong key for them — gating them here would either wrongly demand a design token or invite a meaningless token. The brief's six are the must-have core; breadth beyond them is bounded by "design-feeding/mutating only."

### The read-only `od` exemption set (never block — pure transport)

`od run watch`, `od run info`, `od run list` (poll/inspect a run; the brief's `od run get` shorthand maps here), `od ui list`, `od ui show`, `od files list`, `od files read`, `od list`, `od design-systems list`, `od skills list`, `od doctor`, `od daemon status`, `od tools design-systems read`, `od automation list/view/show`, `od memory tree list/view/show`. These map to `guarded_proxy.md` `exemptTransport.cliVerbs` and MUST return `null` (fall through to allow).

### Parser-backed binding (the D4-R5 "same-segment / same-command" requirement)

`evaluateOdCliPrecondition(input, dependencies)`:

1. Return `null` immediately unless `toolName === 'Bash'` and a command string is present (so non-Bash and empty commands are untouched).
2. Split the command into **segments** on shell separators (`;`, `&&`, `||`, `|`, `&`, newlines). Binding is per-segment so `echo "od run start"` or `od list ; rm x` cannot be confused with a real invocation.
3. Within each segment, tokenize into argv-like words (minimal quote handling) and detect an Open Design CLI invocation: a word that is bare `od`, ends in `daemon-cli.mjs`, or is `$OD_BIN` / `${OD_BIN}` / `$OD_DAEMON_CLI_PATH`; or a `node` / `ELECTRON_RUN_AS_NODE=1 <electron>` invocation whose script argument is one of those.
4. Read the next non-flag tokens after the binary as `verb [subverb]` (e.g. `run start`, `ui respond`, `media generate`) and normalize to the `od <verb> <subverb>` canonical form used in the policy lists.
5. If a guarded verb is bound to a detected od-binary **in the same segment** → guarded. If it is a read-only exempt verb, or no od-binary is bound in that segment → not guarded.
6. For a guarded segment, require a **same-command gate file**: a token-file path referenced in that same command via `--design-proof <path>` (or an `OD_DESIGN_PROOF_FILE=<path>` env assignment in the same segment). Read the file, `JSON.parse` it, and validate with the existing `isStructurallyValidDesignProofToken` (or `dependencies.validateOpenDesignToken`). A gate file that is absent, unreadable, malformed, structurally invalid, or referenced in a **different** segment → `deny`. (Spec §1/§4: same-command carrier, deny cross-command.)
7. Any guarded verb without a valid same-command token → `{ decision: 'deny', reason: 'Guarded Open Design CLI command denied: missing or invalid design proof token' }`. Fail closed on any parser/read/validate exception.

**Why a gate file (not inline):** the MCP lane carries the structured token inline as `tool_input.designProofToken`; a Bash command string cannot carry structured JSON inline, so the token travels in a file the command references and the hook reads — the spec's "gate-file carrier."

### Data Flow / composition with D4-R4

`handleCodexPreToolUse(input, deps)` order:
1. `evaluateOpenDesignPrecondition` (D4-R4) — gates by **MCP tool name** membership. For `tool: 'Bash'`, `toolName='Bash'` is never in `guardedTools` → returns `null` → falls through. **Unchanged.**
2. **NEW** `evaluateOdCliPrecondition` (D4-R5) — fires only for `tool: 'Bash'`; binds an od invocation to a guarded verb in-segment and checks the gate file. Returns a deny decision, or `null`.
3. Existing Bash denylist lane (`bashCommandFor` + `denylistMatch`) — **unchanged**; runs after and still matches destructive shell patterns.

The two Open Design lanes are **disjoint by tool name** (D4-R4 ⇒ MCP names only; D4-R5 ⇒ `tool: 'Bash'` only) and **share one validator**. Every input the current 11 tests exercise — `git status`, `rm -rf /`, `git push --force main`, non-Bash tools — contains no `od` design verb, so the new branch returns `null`/`{}` for all of them: no regression. New tests cover the `od` lane additively.

### Open Item (verify-live)

`od run redesign` is named by the brief, this packet's `spec.md`, and research §7, but does **not** appear in the bundled `od --help` verb table (`od_cli_reference.md` §4 lists `od run <start|watch|cancel|list|info>`) and a grep of the `mcp-open-design` references finds no `redesign`. **RESOLVED: `redesign` is not a distinct live verb and was omitted from `guardedOdCommands`.** The redesign path is a follow-up `od run start --conversation <id> …`, which the `run start` guard already covers; the final guarded set is the 5 verbs `run start`, `ui respond`, `ui prefill`, `ui revoke`, `media generate`. Add `run redesign` only if a distinct verb ships live.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — confirm the lane and freeze the verb set
- [x] Re-confirm `evaluateOpenDesignPrecondition` runs first and the Bash branch is reached only when `toolName === 'Bash'` (`pre-tool-use.ts`) — confirmed; the od-CLI lane returns `null` for non-Bash
- [x] Freeze the guarded `od` write-verb set and the read-only exemption set — 5 guarded verbs frozen; `READ_ONLY_OD_COMMANDS` set landed
- [x] Resolve the `od run redesign` verb name against the `od` CLI help — ABSENT; omitted, `run start` covers the `--conversation` follow-up

### Phase 2: Core Implementation
- [x] Add `guardedOdCommands` (read-only exemption implicit — anything not listed and not read-only falls through) to `.codex/policy.json` under `openDesignPreconditions` — 5-verb list applied by the orchestrator
- [x] Add the policy types to `CodexPolicyFile` (`guardedOdCommands?: readonly string[]`) — added at the top-level and the nested `openDesignPreconditions` shape; `resolveGuardedOdCommands` reads both plus `toolPreconditions.openDesignPreconditions`
- [x] Implement `evaluateOdCliPrecondition(input, dependencies)` + the `splitShellSegments` / `tokenizeShellSegment` / `odExecutableIndex` / `odCommandCandidates` parser helpers in `pre-tool-use.ts` — landed (+331 lines, build record)
- [x] Implement the same-command gate-file reader (`--design-proof <path>` / `--design-proof=<path>` / `OD_DESIGN_PROOF_FILE=<path>`) via `extractDesignProofFilePath` + `hasValidDesignProofGateFile`, validated via the existing `isStructurallyValidDesignProofToken` — landed, no second validator
- [x] Wire `evaluateOdCliPrecondition` into `handleCodexPreToolUse` after the D4-R4 call and before the denylist match — wired; returns its deny decision or falls through on `null`
- [x] Keep `.codex/policy.json` and `pre-tool-use.ts` free of spec/packet/phase IDs and spec paths (evergreen [HARD]) — evergreen check clean

### Phase 3: Verification
- [x] `.codex/policy.json` parses as JSON — `node -e JSON.parse` exit 0
- [x] Deny-case: `od run start …` (bare), `node "$OD_BIN" run start …`, and `ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" run start …` without a valid same-command gate file → `deny` — harness confirmed; `od ui respond` / `od media generate` also deny
- [x] Allow-case: `od list`, `od run get`, `od run watch`, `od ui list`, `od files read` → `{}` — confirmed via `READ_ONLY_OD_COMMANDS`
- [x] Same-command binding: a gate file in a **different** segment → `deny`; the gate file in the **same** command with a fresh valid token → `{}`; an expired token → `deny` (`isValidTokenTimeWindow`)
- [x] MCP-tool lane unchanged: `start_run` / `mcp__open-design__start_run` without a token still deny; `get_run` / `list_projects` still `{}` — harness confirmed
- [x] No-regression: the existing Codex hook vitest suite passes 11/11 (test file unmodified); the `od`-lane coverage was delivered via the orchestrator harness, the committed additive `describe` block was deferred (Limitations 4)
- [x] Bash denylist intact: `rm -rf /` still denies with the existing reason — confirmed

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | `.codex/policy.json` parses with the new `guardedOdCommands` block | `node -e JSON.parse` or `python3 -m json.tool` |
| Unit (parser) | `tokenizeBashSegments` / `detectOdInvocation`: segment split, quote noise, `$OD_BIN` / `daemon-cli.mjs` / `node` forms | Vitest, additive `describe` |
| Unit (deny) | guarded `od` verb (all invocation forms) without a valid same-command gate file → deny; cross-command gate file → deny | Vitest + injected `readPolicy` / `validateOpenDesignToken` deps |
| Unit (allow) | read-only `od` verbs and `echo "od run start"` (no real binary) → `{}`; valid same-command gate file → `{}` | Vitest |
| Composition | MCP-name lane unchanged; ordinary Bash denylist unchanged | Vitest (the existing 11 + new) |
| Runtime | `handleCodexPreToolUse({tool:'Bash',tool_input:{command:'od run start …'}}, { policyPath: '<repo>/.codex/policy.json' })` against the real policy file | node harness (scratchpad only) |

The new tests follow the existing file's dependency-injection style (`readPolicy: () => policy`, optional `validateOpenDesignToken`) so they never read the real `.codex/policy.json` and cannot perturb the 11 existing results. The runtime harness uses the shipped `handleCodexPreToolUse(input, { policyPath })` entry point against the real policy file and lives in the session scratchpad, not the repo.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| D4-R2 executable PreToolUse branch (`evaluateOpenDesignPrecondition`) | Internal (landed) | Green | Establishes the precondition pattern the new lane mirrors |
| `isStructurallyValidDesignProofToken` token validator | Internal (landed) | Green | Reused verbatim by the Bash lane; without it the gate cannot validate |
| D4-R4 `openDesignPreconditions.guardedTools` policy block | Internal (landed) | Green | The MCP-name sibling lane that must remain unchanged |
| `guarded_proxy.md` `cliVerbs` / `exemptTransport.cliVerbs` | Internal (reference) | Green | Source of the guarded vs exempt CLI classification |
| `od_cli_reference.md` §4/§5 verb surface | Internal (reference) | Green | Source of canonical verb names and the multi-turn build flow |
| Live `od --help` for `run redesign` | External (Open Design app) | Green (resolved) | `redesign` is not a live verb; omitted, `run start` coverage handles the follow-up redesign path |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a legitimate read-only `od` command is denied, a non-`od` Bash command is denied, or the policy file fails to parse.
- **Procedure**: remove the `guardedOdCommands` block from `.codex/policy.json` (the branch resolves to an empty guarded set → fall-through), and/or `git revert` the `pre-tool-use.ts` change. The D4-R4 MCP-name lane and the destructive Bash denylist are untouched by either revert.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm lane + freeze verb set) ──> Phase 2 (Policy + parser branch) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Landed D4-R2/R4 branch | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (confirm lane + freeze verb set + verify-live `redesign`) | Low | 30 minutes |
| Implementation (policy block + parser + gate-file reader + wiring) | Medium | 2-3 hours |
| Verification (parser units + deny/allow + composition + 11/11) | Medium | 1.5-2 hours |
| **Total** | | **~4-5.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Captured pre-change `.codex/policy.json` and `pre-tool-use.ts` (git tracks both; `git diff` is the snapshot)
- [x] Confirmed read-only `od` verb names are absent from `guardedOdCommands` — the 5-verb list holds only design-mutating write verbs
- [x] Confirmed the vitest baseline is 11/11 before the change — and 11/11 after, test file unmodified

### Rollback Procedure
1. **Immediate**: delete the `guardedOdCommands` block from `.codex/policy.json` → guarded set resolves empty → lane inert.
2. **Code**: `git checkout -- .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` to drop `evaluateOdCliPrecondition` and the parser helper.
3. **Verify**: re-run the runtime harness — guarded `od` commands return `{}` (no enforcement), MCP-name lane and Bash denylist unaffected; re-run vitest for 11/11.

### Data Reversal
- **Has data migrations?** No — a JSON policy block and one TypeScript branch, fully reversible via VCS.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Bash-lane analogue of D4-R4: guardedOdCommands in .codex/policy.json + parser-backed
  evaluateOdCliPrecondition in pre-tool-use.ts; same DESIGN_PROOF_TOKEN validator, gate-file carrier
- Enforcement home = codex Bash lane (only place a raw od command is observable); MCP lane unchanged
-->
