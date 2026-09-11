# Iteration 2: D2 Security - trust boundary, rehomed env defaults, and transport names on callers

## Focus

- **Dimension(s)**: security (primary), correctness, maintainability
- **Scope investigated**: `.opencode/bin/system-skill-advisor-launcher.cjs` (the rehomed env defaults and the operator-visible action strings), `.opencode/skills/system-skill-advisor/runtime/lib/context/caller-context.ts` and `runtime/lib/auth/trusted-caller.ts` (the trusted-caller guard the mutation commands depend on), `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (the degraded path), `.opencode/plugins/system-skill-advisor.js` (bridge-named state and timeout env), `.pi/SYNC.md` and `.pi/extensions/README.md` (caller documentation)
- **Brief classes covered**: class 1 (surviving advisor MCP path/tool-id on a live surface), class 6 (names that outlived their referent: variables, comments, headers), and the brief's explicit ask to verify the prompt-time brief across daemon states
- **Reproduction constraint**: unchanged - read-only probes only; no CLI, test or npm execution

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.52

## Findings

### P0, Blocker

None. The trust guard itself is sound - see the verification below.

### P1, Required

- **F004**: the launcher tells operators it built an MCP server, and its two rehomed defaults are undocumented at the point of use, `.opencode/bin/system-skill-advisor-launcher.cjs:1235`, `:39`, `:1227`.

  ```
  $ rg -n "MCP|mcp-server" .opencode/bin/system-skill-advisor-launcher.cjs
  39:// Load project-local env overrides BEFORE spawning the MCP child. .env.local wins over
  1227:  // reinstalls node_modules under the real mcp-server and hangs the whole suite.
  1235:  actions.push('installed dependencies and built @spec-kit/system-skill-advisor MCP server');
  ```

  Line 1235 is not a comment: `actions` is the operator-visible record of what the artifact bootstrap did. Phase 005's job was to "reduce the launcher to a daemon supervisor"; a supervisor that reports having built an MCP server is the exact class of claim the brief asks about, and it is emitted at the moment an operator is already debugging a broken advisor.

  Counterevidence that keeps this at P1 rather than higher: the two load-bearing env settings the packet rehomed did land here, so the *behavior* is correct.

  ```
  $ rg -n "SPECKIT_ADVISOR_DOC_TRIGGERS|SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT" .opencode/bin/system-skill-advisor-launcher.cjs
  84:  SPECKIT_ADVISOR_DOC_TRIGGERS: 'true',
  85:  SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted',
  ```

  This independently confirms the packet's claim that the env blocks moved rather than vanished, and that the trust default survives without its MCP block. The defect is the reporting text, not the defaults.

- **F005**: the Pi runtime's own documentation and sync table describe a caller that no longer exists, `.pi/SYNC.md:29`, `.pi/extensions/README.md:25`, `:46`, `:70`.

  ```
  $ rg -n "system_skill_advisor|mcp-server" .pi/SYNC.md
  29:| `mcp.json` | **hand-authored** | — | Registers system_skill_advisor and code_mode |
  ```

  ```
  $ rg -n "advisor" opencode.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json
  (no output; exit 1)
  ```

  The sync table is a live maintenance contract - it tells a maintainer which files are hand-authored and what each one does - and `.pi/mcp.json` no longer registers the advisor, so the row is false. The same drift appears in the extension map, which documents the import path the Pi adapter used before the rename:

  ```
  $ rg -n "mcp-server" .pi/extensions/README.md
  25:| `prompt-advisor.ts` | `.opencode/skills/system-skill-advisor/hooks/pi/` |
  70:| `prompt-advisor.ts` | `input` | `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` `handleClaudeUserPromptSubmit()` ...
  ```

  ```
  $ rg -n "ADVISOR_HOOK_MODULE|ADVISOR_HOOK_FALLBACK_MODULE" -A1 .pi/extensions/prompt-advisor.ts
  52:const ADVISOR_HOOK_MODULE =
  53:  "../../.opencode/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js";
  54:const ADVISOR_HOOK_FALLBACK_MODULE =
  55:  "../../runtime/dist/hooks/claude/user-prompt-submit.js";
  ```

  The code was rewired to `runtime/`; the documentation was not. A maintainer who debugs the Pi brief from the documented path will look in a directory that does not exist.

  One observation about the fallback that is *not* raised as a finding, recorded for the replay pass: `ADVISOR_HOOK_FALLBACK_MODULE` resolves against the repository root (`<repo>/runtime/dist/...`), which also does not exist. It is a second-chance import inside a `try` whose failure degrades to the directives-only brief, so it is dead-but-harmless today. It is a candidate for the maintainability pass rather than a correctness defect.

### P2, Suggestion

- **F006**: the caller-context module still names the retired transport, `.opencode/skills/system-skill-advisor/runtime/lib/context/caller-context.ts:2`, `:7`, `:29`; consumers at `runtime/lib/auth/trusted-caller.ts:5`, `:15`, `:21`.

  ```
  $ rg -n "MCP|mcp" .opencode/skills/system-skill-advisor/runtime/lib/context/caller-context.ts
  2:// MODULE: Advisor MCP Caller Context
  7:export interface MCPCallerContext {
  29:    throw new Error('MCP caller context missing - handler called outside runWithCallerContext()');
  ```

  The type is now constructed by the daemon's socket dispatcher, not by an MCP handler, so the name and the error string both outlived the transport. Phase 007 explicitly kept code identifiers and raised them as defects rather than editing them; this finding is that raised defect, reproduced with current line evidence. Severity stays P2: no behavior depends on the name, and the error string still identifies the failing path.

  **Trust-boundary verification (no finding)**: the guard the mutation commands depend on fails closed and is not transport-coupled.

  ```
  $ rg -n "trusted === true|requires trusted caller" .opencode/skills/system-skill-advisor/runtime/lib/auth/trusted-caller.ts
  24:  if (callerContext?.trusted === true) {
  36:    error: `${toolName} requires trusted caller context`,
  ```

  Trust is resolved from the caller context alone, and `resolveTrustedCaller` reads only the daemon-side `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT` (`runtime/advisor-server.ts:206-208`), which the launcher supplies. Nothing in the guard consults MCP metadata, so the removal left no trust hole. The daemon-state behaviour of the brief's third verification item is traced statically in the "Ruled Out" section below.

- **F007**: the plugin's operator-facing status and tuning surface still speak the deleted bridge, `.opencode/plugins/system-skill-advisor.js:41`, `:374`, `:1456-1458`.

  ```
  $ rg -n "SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS|bridge_timeout_ms|last_bridge_status" --glob '!specs/**' --glob '!**/node_modules/**'
  .opencode/plugins/system-skill-advisor.js:374:  const envBridgeTimeoutMs = Number(process.env.SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS);
  .opencode/plugins/system-skill-advisor.js:1456:            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
  .opencode/plugins/system-skill-advisor.js:1457:            `last_bridge_status=${state.lastBridgeStatus}`,
  ```

  ```
  $ sed -n '40,42p' .opencode/plugins/system-skill-advisor.js
  const DEFAULT_BRIDGE_TIMEOUT_MS = 2500;
  ```

  Phase 005 deleted `plugin-bridges/` and phase 004 repointed the plugin at the CLI; the plugin now spawns a subprocess that is not a bridge, and its status line reports `last_bridge_status=` for a component that does not exist. The timeout knob is the sharper half: `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` is read by live code and documented in no live document (the only other hits are tests), so an operator who wants to raise the timeout has no discoverable name for it. Same class as F006 but with a load-bearing env surface, so it is recorded separately.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/bin/system-skill-advisor-launcher.cjs:84-85`; `.pi/extensions/prompt-advisor.ts:52-53` vs `.pi/extensions/README.md:70` | Two of the packet's normative claims verified true (env rehoming; callers repointed). The claim "no live surface names the removed transport" is still false, now on the launcher's action string and the Pi docs. |
| checklist_evidence | blocked | hard | `{spec_folder}/` has no `checklist.md` | Scheduled with the packet-claims pass. |
| feature_catalog_code | notApplicable | advisory | - | Not this dimension. |
| playbook_capability | notApplicable | advisory | - | Not this dimension. |

## Claim Adjudication

```json
{
  "findingId": "F004",
  "claim": "The launcher's operator-visible bootstrap record tells the operator it built an MCP server, and two comments in the same file still call the child an MCP child under the deleted mcp-server path.",
  "evidenceRefs": [
    ".opencode/bin/system-skill-advisor-launcher.cjs:1235",
    ".opencode/bin/system-skill-advisor-launcher.cjs:39",
    ".opencode/bin/system-skill-advisor-launcher.cjs:1227"
  ],
  "counterevidenceSought": "Checked whether the action string is unreachable (it is pushed on the real bootstrap path, after the vitest guard), whether the file was exempted in the packet's residue record (it is not listed), and whether the rehomed env defaults also failed (they did not - lines 84-85 carry them).",
  "alternativeExplanation": "The strings may be deliberately preserved as a rollback breadcrumb to the pre-decommission state. Rejected: the launcher's job is post-decommission supervision, the vitest guard at :1230 already prevents the path from running under tests, and no packet document records these three lines as an exemption.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if an exemption is added to the phase-007 residue record naming these three lines, or if the action string is reworded before the packet closes.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F005",
  "claim": ".pi/SYNC.md asserts that .pi/mcp.json registers the advisor, and .pi/extensions/README.md documents the Pi adapter importing the advisor hook from the deleted mcp-server/ path, while the adapter itself imports runtime/.",
  "evidenceRefs": [
    ".pi/SYNC.md:29",
    ".pi/extensions/README.md:70",
    ".pi/extensions/prompt-advisor.ts:52-53",
    ".opencode/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js:1"
  ],
  "counterevidenceSought": "Grepped all five runtime configs for an advisor declaration (zero hits, exit 1), read the adapter to confirm its real import path, and checked whether .pi docs were declared out of scope. Phase 007 recorded '.pi docs' as a known-stale carry-over with no owning phase, so the finding is real but pre-declared rather than newly discovered; the line evidence is what this pass adds.",
  "alternativeExplanation": "The docs may describe the pre-decommission state intentionally as a migration record. Rejected: SYNC.md is a live maintenance contract in the present tense ('Registers system_skill_advisor and code_mode'), and the extension README is the operator's map for debugging the brief - neither is a dated record.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Downgrade to P2 if the .pi tree is assigned an owning phase and the packet records that assignment, since the defect is then tracked rather than silent.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 0.52 (severity-weighted new 12.0 over cumulative 23.0 - two P1 at 5.0 each plus two P2 at 1.0 each, against the 11.0 already carried)
- Dimensions addressed: security, correctness, maintainability
- Novelty justification: the security dimension produced no P0/P1 of its own - the trust guard and the rehomed defaults verify clean - so the new findings are correctness-adjacent surface residue discovered while tracing the trust boundary outward to its callers. That is a genuine novelty drop from iteration 1, where an entire command family failed.

## Ruled Out

- **A trust hole left by the removed MCP metadata path**: `requireTrustedCaller` reads only `callerContext.trusted` (`trusted-caller.ts:24`), and the daemon resolves trust solely from its own environment (`advisor-server.ts:206-208`, `:218`), which the launcher supplies (`:85`). No transport marker participates. Evidence: the `rg` output in F006 plus the launcher grep in F004.
- **The prompt-time brief failing in any of the three daemon states** (static trace; the brief's third verification item):

  | State | Path | Evidence |
  |-------|------|----------|
  | warm | hook delegates to the CLI as the single front door; the daemon answers over the socket | `hooks/claude/user-prompt-submit.ts:272-275` ("The CLI is the single front door: it owns the warm-daemon probe and the local-scorer fallback") |
  | cold | the primary call omits the warm-only marker, so the CLI is allowed to start the daemon rather than refusing | `hooks/claude/user-prompt-submit.ts:277-285` (`buildCliBrief(prompt, {...timeoutMs}, ...)` with no warm-only flag) |
  | unreachable | the CLI answers from the local scorer, the envelope is marked degraded, freshness becomes `stale` rather than `unavailable`, and the brief still renders | `hooks/lib/skill-advisor-cli-fallback.ts:310-314` (`freshnessFrom`), `:413-414` (`degraded` fold), `:307-309` comment ("A degraded answer is still an answer") |

  This is a static trace, not an execution. The runtime cold-boot proof the packet's phase 008 owes is still owed; see Deferred in the report.
- **The spec-kit Claude hook shim pointing at the dead tree**: the shim's live target constant is correct post-rename. `rg -n "TARGET_REL" .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` returns `const TARGET_REL = 'skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js';` at line 19, and the compiled shim matches. The stale path for the same walk appears only in a *document*, which is iteration 3's business.
- **`SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` being an operator trap that silently drops a setting**: the name is still read by the code it belongs to, so an operator who sets it gets the documented behavior; the defect is the name and the missing documentation, not a lost setting.

## Dead Ends

- **Running the three daemon states for real** (`node .opencode/bin/skill-advisor.cjs advisor_recommend ... --warm-only`, then with the socket directory pointed at an empty temp dir): refused by write containment - a cold call starts the daemon and writes its database and socket under the workspace. The static trace above is the substitute, and the unrun check is carried into the report's Deferred Items rather than presented as verified.

## Recommended Next Focus

Iteration 3 (D3 Traceability): the surfaces *outside* the advisor package that still describe its transport - `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, and the install guides' advisor validation step.

Review verdict: CONDITIONAL
