# Iteration 35: D4-A4 - Minimum Executable Open Design PreToolUse Gate

## Focus

This iteration investigated the D4-A4 angle: the current `mcp-open-design` design gate is expressed as `design_gate()` / `require_sk_interface_design()` pseudocode, so the enforceable question is the smallest executable Codex `PreToolUse` hook change that can return `{"decision":"deny"}` before Open Design receives a design-affecting tool call.

Scope stayed inside research. No live `sk-design`, `mcp-open-design`, command, hook, or CLI files were edited.

## Actions Taken

1. Re-read the deep-research quick reference and output contract, then checked the active strategy and last D4 iterations so this pass did not re-cover the direct-MCP, Bash CLI, or caller-asserted exemption findings.
2. Verified the current Open Design gate language in `mcp-open-design`: the mandatory pairing is real prose, while the executable-looking `design_gate()` block is inside a markdown pseudocode router. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:175]
3. Read the registered Codex hook path and the hook implementation to verify whether any executable branch can currently inspect non-Bash Open Design tool calls. [SOURCE: .codex/settings.json:32] [SOURCE: .codex/settings.json:37] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:206] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:216]
4. Exercised the shipped hook function directly with three cases: `Bash` + `git reset --hard` returned `decision: deny`; `open-design.start_run` returned `{}`; `mcp-open-design.start_run` returned `{}`. This confirmed the hook mechanism can deny, but the current matcher cannot see the Open Design tool class.

## Findings

### Finding 1: The Open Design gate is mandatory prose plus pseudocode, not an executing boundary

Severity: P1. Label: ENFORCEABLE once moved into a hook/proxy fixture; ADVISORY while it remains markdown router text.

The Open Design skill correctly states the policy: Open Design is transport, not taste, and any generation or design-feeding read must load `sk-design` first. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The routing table repeats that RUN and design-feeding READ require `sk-design`. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:78] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:92]

The enforcement-looking part is not executable. It is a markdown Python sketch: `design_gate(intents, feeds_design_decision)` calls `require_sk_interface_design()`, then `route_open_design_resources()` calls that gate. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:168] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:175] There is no corresponding function in the registered hook path, and the default `feeds_design_decision: bool = False` also leaves the critical exemption bit caller-supplied. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:171]

Buildable recommendation: keep the markdown gate as operator guidance, but make the real gate live in `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` behind a policy key such as `openDesignPreconditions`. The hook should deny before the daemon receives a matching Open Design tool call when the input lacks a valid `skDesignGate`.

### Finding 2: Codex already has an executable PreToolUse hook that can deny, but it is Bash-only

Severity: P1. Label: ENFORCEABLE.

The repo-local Codex settings register a `PreToolUse` command that runs the compiled hook. [SOURCE: .codex/settings.json:32] [SOURCE: .codex/settings.json:37] The hook output type already supports `{"decision":"deny","reason":"..."}`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:51] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:55]

The current implementation immediately returns `{}` unless the tool name is exactly `Bash`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:216] The focused test suite locks that behavior in place for `Edit`, `Read`, and `Write`, proving non-Bash tools intentionally emit no decision today. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:60] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:68]

Buildable recommendation: insert an Open Design branch before the Bash-only return:

```text
const openDesignDecision = evaluateOpenDesignPrecondition(input, policy);
if (openDesignDecision) return openDesignDecision;
if (toolNameFor(input) !== "Bash") return {};
```

The minimum branch needs only three pieces: normalize the tool name, extract the tool input object, and validate `tool_input.skDesignGate`. If the normalized tool name is one of the guarded Open Design write/destructive tools and the gate token is absent or invalid, return `decision: "deny"`.

### Finding 3: The current policy file cannot express an Open Design design gate

Severity: P1. Label: ENFORCEABLE.

The checked-in policy is a Bash denylist: its only operative keys are `bashDenylist` and `bash_denylist`. [SOURCE: .codex/policy.json:4] [SOURCE: .codex/policy.json:24] The TypeScript policy interface mirrors that same shape and has no Open Design precondition field. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:44] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:49]

The Open Design tool surface is concrete enough to seed the policy. The mutating set is `create_artifact`, `write_file`, `create_project`, `start_run`, and `cancel_run`; the destructive set is `delete_file` and `delete_project`. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:50] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:56] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:58] The same document already says every mutating or destructive verb must be gated. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:91] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:96]

Buildable recommendation: add policy like this:

```json
{
  "openDesignPreconditions": {
    "toolNamePatterns": [
      "start_run",
      "open-design.start_run",
      "open_design.start_run",
      "mcp__open_design__start_run",
      "mcp-open-design.start_run"
    ],
    "guardedTools": [
      "create_artifact",
      "write_file",
      "create_project",
      "start_run",
      "cancel_run",
      "delete_file",
      "delete_project"
    ],
    "requiredGate": "skDesignGate"
  }
}
```

The first implementation should test several namespace forms because the exact Codex MCP payload string is still an open question from iteration 32. The deterministic invariant is simpler than the naming uncertainty: any recognized guarded Open Design tool without `skDesignGate` denies.

### Finding 4: The design-gate branch must fail closed, unlike the current Bash policy

Severity: P1. Label: ENFORCEABLE.

The existing hook catches all errors and returns `{}`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:234] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:235] The tests explicitly preserve fail-open behavior when policy loading throws. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:89] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts:99]

That is acceptable for a starter Bash denylist, but wrong for a deny-by-default design precondition. A malformed token, unreadable token source, stale hash, unsupported version, or checker exception must deny the guarded Open Design call; otherwise the gate can be bypassed by making the validator error.

Buildable recommendation: separate policy failure semantics:

```text
try evaluateOpenDesignPrecondition(...)
catch err if tool looks like guarded Open Design -> deny("Open Design sk-design gate could not be validated")

try evaluateBashDenylist(...)
catch err -> {}
```

This keeps the legacy Bash safety posture intact while making the new design gate deterministic.

### Finding 5: The token can reuse current `sk-design` proof primitives, but the hook needs machine fields

Severity: P2. Label: ENFORCEABLE for token shape and freshness; ADVISORY for aesthetic quality.

`sk-design` already requires a context manifest before dispatch or design/build decisions. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] It also blocks palette, layout, motion, copy, accessibility, score, release, and readiness claims until the supporting files are named. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] The proof card has a deterministic checker for proof-field completeness and READY status. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

Those primitives are useful inputs, but a PreToolUse hook needs inspectable fields, not prose. Minimum `skDesignGate` fields:

```json
{
  "version": 1,
  "issuedAt": "ISO-8601",
  "expiresAt": "ISO-8601",
  "surface": "settings-page",
  "taskType": "generation",
  "register": "Brand|Product",
  "workflowModes": ["interface", "foundations"],
  "loadedFiles": [{"path": "...", "sha256": "sha256:..."}],
  "routeTelemetryId": "optional",
  "proofDigest": "sha256:optional"
}
```

The hook can deterministically check required keys, expiry, workflow-mode minimums, and file hashes. It cannot prove that the final design is tasteful; the later proof card and visual review still own that advisory layer.

## Questions Answered

- Q3, partially answered: a deny-by-default Codex gate can be built as an actual `PreToolUse` branch in `pre-tool-use.ts`, using the existing `decision: "deny"` output contract and a new `openDesignPreconditions` policy lane.
- The minimum executable denial is not another `design_gate()` helper inside `mcp-open-design`. It is a hook-level matcher that runs before the tool call reaches Open Design.
- The enforceable core is: guarded Open Design tool name + missing/invalid `skDesignGate` -> deny. Taste quality, visual judgment, and final output quality remain advisory/runtime-evaluation concerns.

## Questions Remaining

- What exact tool-name strings does Codex emit for Open Design MCP calls in a live payload: bare `start_run`, server-qualified `open-design.start_run`, `mcp__open_design__start_run`, or another form?
- Should the first build support only direct MCP tool calls, or also add the iteration 33 Bash CLI matcher in the same policy change?
- Where should `skDesignGate` be minted, and how should short-lived gate material expire without being replayable across sessions?
- OpenCode and Claude Code parity remains unresolved until their equivalent pre-tool interception surface or a guarded MCP proxy is verified.

## Next Focus

D4-A5 should pin the token minting and expiry design: where `skDesignGate` is produced, how it binds to route telemetry/proof-card content, and how a stale or replayed token is rejected across direct MCP, Bash CLI, and any future guarded proxy.
