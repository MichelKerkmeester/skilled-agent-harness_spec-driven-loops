---
title: "Implementation Summary: odCliPreconditions guards Open Design od write verbs in the Codex Bash lane"
description: "Post-build record for the parser-backed evaluateOdCliPrecondition Bash lane plus the guardedOdCommands policy list: the activation deny/allow proof, read-only and over-match allow, the codex self-protection policy deviation, vitest 11/11 + tsc clean, and the od run redesign omission."
trigger_phrases:
  - "od cli bash lane implementation summary"
  - "guarded od commands precondition record"
  - "design proof gate file bash summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/005-od-cli-bash-lane"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record od CLI Bash-lane gate, deny/allow proof, and codex self-protection deviation"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-od-cli-bash-lane |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `pre-tool-use.ts` `evaluateOdCliPrecondition` Bash lane + `.codex/policy.json` `openDesignPreconditions.guardedOdCommands` (5 verbs) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This phase closes the last open transport into Open Design from the Codex boundary: the `od` CLI run as a Bash command. The D4-R4 sibling gates Open Design **MCP tool names**, but a raw `od run start …` reaches the hook as `{ tool: 'Bash', tool_input: { command } }`, so `toolName` is `Bash` and the name-membership lane never sees it. Those calls used to fall straight through to the destructive-command denylist, which only matches shell patterns like `rm -rf /`, never a design verb. A `node "$OD_BIN" run start …` therefore fired a design build with no proof-token check at all. Now a guarded `od` write verb that arrives without a fresh, in-command design-proof gate file is denied at the Codex hook, while read-only `od` verbs, non-`od` Bash, and any legitimately tokened design command pass untouched.

This is defense-in-depth at the codex tool boundary, not the authoritative lane. The D4-R1 guarded proxy stays the primary enforcement point; this Bash lane is a second, independent net that catches the CLI transport the MCP-tool-name gate cannot observe.

### The parser-backed `od` Bash lane

`evaluateOdCliPrecondition` fires only for `tool: 'Bash'`. It splits the command into shell segments (`splitShellSegments`, honoring quotes and `;`/`&&`/`||`/`|`/`&`/newlines), tokenizes each segment (`tokenizeShellSegment`), and binds an Open Design CLI invocation to its write verb **within the same segment** (`odExecutableIndex` + `odCommandCandidates`). Per-segment binding is what stops `echo "od run start"` or a path containing `od` from being mistaken for a real invocation. If a guarded verb is bound to a real od-binary in that segment and is not also a read-only verb, the lane requires a valid same-command design-proof gate file; absent or invalid, it returns `deny`. The lane reuses the D4-R4 validator `isStructurallyValidDesignProofToken` verbatim, so both transports share one fail-closed token check and `isValidTokenTimeWindow` rejects an expired token (`issuedAt <= now < expiresAt`).

### The guarded `od` write-verb set

`guardedOdCommands` holds the design-mutating verbs: `od run start`, `od ui respond`, `od ui prefill`, `od ui revoke`, `od media generate`. Each fires a build, answers the build form, shapes a GenUI surface, or generates media, so each needs a valid design-proof token. `od run redesign` was **omitted**: it is not in the `od` CLI help, and its conversation follow-up is `od run start --conversation`, which the `run start` guard already covers. Read-only verbs are deliberately excluded so transport is never blocked; the `READ_ONLY_OD_COMMANDS` set (`od list`, `od run get`, `od run watch`, `od ui list`, `od files read`, and more) short-circuits to allow even if a guarded token-bearing word appears nearby.

### The same-command gate-file carrier

The MCP lane carries the structured token inline as `tool_input.designProofToken`; a Bash command string cannot carry structured JSON inline, so the token travels in a file the command references. `extractDesignProofFilePath` reads it from `--design-proof <file>`, `--design-proof=<file>`, or an `OD_DESIGN_PROOF_FILE=<file>` assignment in the same segment; `hasValidDesignProofGateFile` reads and `JSON.parse`s that file and validates it. A gate file that is missing, unreadable, malformed, structurally invalid, or referenced in a different segment fails the check and the guarded verb is denied.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modified (by `cli-codex gpt-5.5 high fast`, +331 lines, build record) | Added `evaluateOdCliPrecondition` and its helpers (`splitShellSegments`, `tokenizeShellSegment`, `odExecutableIndex`, `odCommandCandidates`, `extractDesignProofFilePath`, `hasValidDesignProofGateFile`, `resolveGuardedOdCommands`, the `READ_ONLY_OD_COMMANDS` set) plus the `CodexPolicyFile.guardedOdCommands` types; wired the lane into `handleCodexPreToolUse` after the D4-R4 MCP-tool lane and before the denylist match |
| `.codex/policy.json` | Modified (by the orchestrator) | Added `openDesignPreconditions.guardedOdCommands` = the 5 design-mutating `od` write verbs, activating the new lane |

Neither the committed Codex hook vitest file nor `guarded_proxy.md` was edited in this build. See Known Limitations 4 and 5.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build split across two implementers because of a self-protection constraint. `cli-codex gpt-5.5 high fast` authored the parser-backed lane and helpers in `pre-tool-use.ts` and reused the existing token validator rather than adding a second one. It could not edit `.codex/policy.json`: a Codex session is structurally barred from rewriting the policy that governs Codex itself. So the orchestrator applied `openDesignPreconditions.guardedOdCommands = ["od run start", "od ui respond", "od ui prefill", "od ui revoke", "od media generate"]` and verified the result independently. This mirrors the D4-R4 deviation exactly.

Acceptance was proven by the orchestrator against the **real** `pre-tool-use.ts` and the **real** populated `.codex/policy.json` through a tsx harness, not a fixture. With the list empty the lane is inert and `od` commands no-op. With the list active, guarded verbs (`od run start`, `od ui respond`, `od media generate`) without a token deny; the same verb with a fresh structurally valid gate file (via `--design-proof <file>`, `--design-proof=<file>`, or `OD_DESIGN_PROOF_FILE=<file>`) allows, and an expired token correctly denies because `isValidTokenTimeWindow` enforces the time window. Read-only verbs (`od list`, `od run get`, `od ui list`) allow. Over-match bait produces no false positive: non-`od` Bash, `node build.js`, a path containing `od`, and `echo "od run start"` all allow. The destructive Bash denylist still fires, the existing Codex hook vitest passes 11/11 with the test file unmodified, `tsc --noEmit` is clean, and the evergreen check is clean. This documentation re-verifies that work; it writes only the phase-folder docs and touches no live skill or `.codex` file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put enforcement in the Codex Bash lane, not the guarded proxy | The proxy is a contract, not a running server, and cannot observe a raw shell command; the Codex PreToolUse hook is the only place a raw `od` Bash call is visible before it runs |
| Bind binary to verb per shell segment | Per-segment binding is what makes `echo "od run start"`, an `od` substring in a path, and a cross-command gate file safe to ignore without false positives |
| Carry the token in a same-command gate file | A Bash command string cannot hold structured JSON inline, so the token travels in a file the command references and the hook reads and validates |
| Reuse `isStructurallyValidDesignProofToken`, no second validator | One shared fail-closed check keeps the two transports identical in semantics; only the carrier differs |
| Omit `od run redesign` from the guarded set | It is absent from the `od` CLI help; its follow-up is `od run start --conversation`, already covered by the `run start` guard, so guarding a non-existent verb would add no coverage |
| Let the orchestrator apply the policy edit | A Codex session cannot rewrite the policy that governs Codex; the orchestrator applied the 5-verb list and verified it independently |
| Frame this as defense-in-depth | The D4-R1 guarded proxy is the authoritative lane; this codex tool-boundary gate is a second independent net for the CLI transport |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.codex/policy.json` parses as JSON | PASS, `node -e JSON.parse` exit 0 |
| `guardedOdCommands` = 5 design-mutating verbs (`run start`, `ui respond`, `ui prefill`, `ui revoke`, `media generate`) | PASS, read against the real policy file |
| ACTIVATION deny: `od run start` no token | PASS, `decision: deny`, `Guarded Open Design CLI command denied: missing or invalid design proof token` |
| ACTIVATION deny: `od ui respond` / `od media generate` no token | PASS, same deny reason |
| Fresh-token allow: guarded verb with a valid same-command gate file (`--design-proof` / `--design-proof=` / `OD_DESIGN_PROOF_FILE=`) | PASS, empty allow |
| Expired-token deny: guarded verb with a structurally valid but expired token | PASS, `isValidTokenTimeWindow` rejects, deny |
| NO-BLOCK-TRANSPORT: read-only `od list` / `od run get` / `od ui list` | PASS, empty allow |
| NO FALSE POSITIVE: non-`od` Bash, `node build.js`, a path containing `od`, `echo "od run start"` | PASS, empty allow |
| INERT proof: empty `guardedOdCommands` → guarded verbs no-op/allow | PASS, lane returns `null` when the list is empty |
| MCP-tool lane (D4-R4) unchanged | PASS, guarded MCP names still deny, transport names still allow |
| Bash denylist intact: `rm -rf /` | PASS, still denied with the existing reason |
| No-regression: Codex hook vitest suite | PASS, 11/11, test file unmodified |
| TypeScript compile | PASS, `tsc --noEmit` clean |
| Evergreen: no spec/packet/phase IDs in the lane or the policy block | PASS, durable `description` only |
| Scope: no live skill or `.codex` file touched by this phase's doc work | PASS, only phase-folder docs written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Defense-in-depth, not the authoritative lane.** This codex Bash lane is a second net. The D4-R1 guarded proxy stays the primary Open Design enforcement point; do not treat this lane as the sole gate.
2. **Parser fails open, the gate file fails closed.** An internal parser/resolver exception in `evaluateOdCliPrecondition` returns `null` (fall through to allow), matching the hook's fail-open posture for non-decisions. The token check itself fails closed: a missing, unreadable, malformed, or expired gate file denies the guarded verb. The two postures are intentional and were both exercised.
3. **`od run redesign` not guarded.** It is absent from the `od` CLI help. If a distinct `redesign` verb ships later, add it to `guardedOdCommands`; until then `od run start --conversation` is covered by the `run start` guard.
4. **Adversarial coverage delivered via the orchestrator harness, not a committed vitest block.** Parser segmentation, every invocation form, deny/allow, cross-command, valid-token, and over-match were exercised by the tsx harness against the real source (scratchpad). The shared `tests/codex-pre-tool-use.vitest.ts` was left unmodified at 11/11; the planned additive `describe` block was deferred to keep the change additive and avoid editing the shared test file.
5. **`guarded_proxy.md` cross-reference deferred.** The planned one-line note pointing the CLI surface at the Codex Bash lane was not added; it targets a live `mcp-open-design` skill file outside this phase's writable scope. Enforcement lives in the hook regardless; the contract is unaffected.
6. **Policy edit applied by the orchestrator.** A Codex session cannot rewrite the policy that governs Codex, so `cli-codex` could not apply the `.codex/policy.json` change. The orchestrator applied the 5-verb list and verified it. See OPEN QUESTIONS in `spec.md`.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Parser-backed evaluateOdCliPrecondition Bash lane + guardedOdCommands policy list; same DESIGN_PROOF_TOKEN validator, gate-file carrier
- Deviation recorded: orchestrator applied the policy edit (codex self-protection); committed vitest block + guarded_proxy.md note deferred (live-file scope)
-->
</content>
</invoke>
