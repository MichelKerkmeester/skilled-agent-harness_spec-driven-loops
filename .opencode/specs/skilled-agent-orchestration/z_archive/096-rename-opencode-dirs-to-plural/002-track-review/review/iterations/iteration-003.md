# Iteration 003 - D2 Security deep pass

## Dimension

Security. This pass audited hook integrity across Claude, Codex, Gemini, and OpenCode-facing config; sandbox and approval defaults in runtime configs and deep-loop YAML; workflow-resolved `spec_folder` write authority; env-driven path overrides; and cross-runtime leaf-agent parity.

## Files Reviewed

- `.claude/settings.local.json:30`
- `.claude/settings.local.json:37`
- `.claude/settings.local.json:73`
- `.codex/config.toml:3`
- `.codex/config.toml:4`
- `.codex/settings.json:2`
- `.codex/settings.json:8`
- `.codex/settings.json:30`
- `.gemini/settings.json:15`
- `.gemini/settings.json:76`
- `.gemini/settings.json:83`
- `.gemini/settings.json:125`
- `opencode.json:3`
- `opencode.json:8`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:89`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:118`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:674`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:678`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:690`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:710`
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:94`
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:743`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:55`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:262`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1173`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:16`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:42`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts:36`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:137`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:121`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:28`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:78`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:63`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:224`
- `.opencode/agents/deep-review.md:33`
- `.codex/agents/deep-review.toml:26`
- `.claude/agents/deep-review.md:33`
- `.gemini/agents/deep-review.md:15`

Additional checks:

- Parsed hook commands from `.claude/settings.local.json`, `.codex/settings.json`, and `.gemini/settings.json`: all hook binaries resolved and all referenced `dist/hooks/*` scripts existed.
- Ran resolver dry-runs for valid, empty/whitespace, template, traversal, repo-root, and `/tmp` `spec_folder` inputs.
- Hashed leaf-agent mirrors across `.opencode/agents`, `.claude/agents`, `.gemini/agents`, and `.codex/agents`; expected format/runtime differences exist, but deep-review write-boundary language is present in sampled mirrors.

## Findings by Severity

### P0

#### P1-001 [P0] Live runtime uses stale generated code-graph scope globs after plural rename

- Status this iteration: Carry-forward, unchanged. Security pass confirmed the same live-generated-code premise applies to hook files: Claude, Codex, and Gemini hook settings all invoke `mcp_server/dist/hooks/*`, so generated JS is live runtime surface.
- Evidence refs: `.claude/settings.local.json:37`, `.codex/settings.json:8`, `.gemini/settings.json:83`, `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`.
- Recommendation: rebuild `mcp_server/dist`, then guard live generated outputs against singular root path literals.

### P1

#### P1-005 [P1] Deep-loop artifact resolver accepts malformed `spec_folder` values that redirect review writes outside the approved packet

- Claim: The deep-review/deep-research workflow says `{spec_folder}` is the write authority, but the shared resolver accepts arbitrary, whitespace, template, absolute, and traversal values and derives `{artifact_dir}` from them without requiring containment under `.opencode/specs`.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:89`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:118`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:262`, `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:678`.
- Evidence: `step_resolve_artifact_root` passes raw `{spec_folder}` into `resolveArtifactRoot`. The resolver immediately does `path.resolve(specFolder)`, constructs `rootDir = path.join(resolved, mode)`, and later allocates child packets under that root. A dry-run showed `.` resolves to `<repo>/review`, whitespace resolves to `<repo>/   /review`, `/tmp/dr-escape` resolves to `/tmp/dr-escape/review`, `{spec_folder}` resolves to a literal template directory, and `.opencode/specs/../../..` resolves outside the repo into `.../Code_Environment/review`.
- Impact: under malformed setup/config, iteration markdown, JSONL deltas, state logs, and reducer outputs can be aimed outside the intended `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/` packet. The cli-codex branch uses `approval_policy=never` and `--sandbox workspace-write`, which prevents prompting but does not encode a packet-local write allowlist.
- Finding class: cross-consumer.
- Scope proof: the same shared resolver is the declared source for both review and research artifact roots; deep-review uses it in `reduce-state.cjs`, and deep-research YAML uses the same `{artifact_dir}` pattern.
- Recommendation: add a shared `validateSpecFolderForArtifacts` guard before `resolveArtifactRoot` returns paths. Reject empty/whitespace, unresolved `{...}` template tokens, absolute paths outside the repo, traversal escaping `.opencode/specs`, and folders without spec metadata. Then make post-dispatch validation assert every artifact path is inside the resolved packet root.

```json
{
  "claim": "Malformed spec_folder values can redirect deep-loop review/research artifacts outside the approved review packet because resolveArtifactRoot trusts raw input.",
  "evidenceRefs": [
    ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:118",
    ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200",
    ".opencode/skills/deep-review/scripts/reduce-state.cjs:1172",
    ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:678"
  ],
  "counterevidenceSought": "Dry-ran resolveArtifactRoot with valid, empty/whitespace, template, traversal, repo-root, and /tmp inputs; no rejection occurred.",
  "alternativeExplanation": "The outer command setup may usually provide a valid spec folder, but the resolver and reducer are shared safety boundaries and do not enforce that invariant themselves.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade only after a pre-resolver guard rejects malformed folders and post-dispatch validation proves all artifacts stay under the intended packet root."
}
```

#### P1-006 [P1] Claude Stop hook executes an env-selected autosave script before canonical path validation

- Claim: the live Claude Stop hook honors `SPECKIT_GENERATE_CONTEXT_SCRIPT` as the first autosave candidate and later executes the selected readable file with `process.execPath`, so a hostile or polluted session environment can replace the memory-save script that runs automatically on Stop.
- Evidence refs: `.claude/settings.local.json:73`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:121`, `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:28`, `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:78`.
- Evidence: `resolveGenerateContextScriptPath()` puts `process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT` before canonical repo-relative candidates and only checks readability. `runGenerateContextAutosave()` then spawns `process.execPath` with that path and JSON payload. `.claude/settings.local.json` wires `dist/hooks/claude/session-stop.js` into the live `Stop` event.
- Impact: automatic Stop-time execution can be redirected to arbitrary readable JavaScript if the session env is hostile. That is sensitive because Stop hooks run without an interactive approval moment and receive recent session context in the JSON payload.
- Finding class: instance-only.
- Scope proof: Gemini `session-stop` was checked and does not use this autosave-script env override. Codex hook paths inspected here also do not expose an equivalent script-path override.
- Recommendation: remove the env-selected script path from production Stop hooks, or gate it behind a test-only flag plus containment checks requiring the resolved realpath to sit under `.opencode/skills/system-spec-kit/scripts/dist/memory/`.

```json
{
  "claim": "Claude Stop autosave can execute an arbitrary env-selected JavaScript file because SPECKIT_GENERATE_CONTEXT_SCRIPT is trusted before canonical script paths.",
  "evidenceRefs": [
    ".claude/settings.local.json:73",
    ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38",
    ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:121",
    ".opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:78"
  ],
  "counterevidenceSought": "Checked Gemini and Codex hook sources for equivalent autosave script overrides; this exact executable-path override appears limited to Claude Stop.",
  "alternativeExplanation": "Operators who can set environment variables may already have local influence, but the hook still turns env pollution into automatic code execution at Stop without checking the canonical script boundary.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if the env override is documented as test-only and production hook launchers clear or pin this variable."
}
```

#### P1-002 [P1] Command-owned deep-review/deep-research YAML reads non-existent `sk-deep-*` skill paths

- Status this iteration: Carry-forward, unchanged.
- Security tie: the same YAML region that points to non-existent `sk-deep-*` paths also owns executor dispatch and prompt-pack rendering. Until corrected, fresh command-owned safety checks can fail before reaching validation.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`, `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:639`, `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:743`.
- Recommendation: replace stale skill paths with `.opencode/skills/deep-review` and `.opencode/skills/deep-research`.

#### P1-003 [P1] Skill advisor source still writes `.opencode/skill/.advisor-state`

- Status this iteration: Carry-forward, unchanged.
- Security tie: env and hook review found no new `.opencode/skill/` hook command survivor, but advisor state still writes to the singular root path and remains a rename-integrity blocker.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:276`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:45`.
- Recommendation: move advisor state to a plural or neutral cache path and add a root singular-directory guard.

#### P1-004 [P1] Packet 096 validation failure localizes to parent and `004-symlinks` anchor/doc sufficiency defects

- Status this iteration: Carry-forward, unchanged.
- Security tie: validation failure remains a required gate blocker before trusting packet 096 as fully audited.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:55`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:136`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/implementation-summary.md:31`.
- Recommendation: repair anchors/placeholders and rerun recursive strict validation.

### P2

#### P2-004 [P2] Deep-review YAML documents a Copilot target-authority guard that is not implemented or wired in the executor schema

- Claim: The deep-review auto YAML says `buildCopilotPromptArg` validates `spec_folder`, prepends a TARGET AUTHORITY preamble, and strips `--allow-all-tools` on malformed input, but the imported helper is absent from `executor-config.ts` and `cli-copilot` is not an allowed executor kind.
- Evidence refs: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:690`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:696`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:710`, `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:744`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7`.
- Impact: today this appears to fail closed because `cli-copilot` is not accepted by `EXECUTOR_KINDS`, but the YAML's security assurance is not backed by code. If the branch is re-enabled by config/schema drift, the guard will fail at import rather than enforce the advertised target authority.
- Finding class: matrix/evidence.
- Recommendation: either remove the dead Copilot branch and notes, or implement/export `buildCopilotPromptArg` with tests for empty, whitespace, template, traversal, and valid packet-local `spec_folder` inputs before adding `cli-copilot` to the schema.

## Traceability Checks

- `spec_code`: fail. The security contract says review artifacts are packet-local, but `resolveArtifactRoot` accepts malformed `spec_folder` values and redirects `{artifact_dir}` without containment.
- `checklist_evidence`: fail carried forward. Packet 096 validation remains failed from iteration 2 and is not re-run here.
- `skill_agent`: partial. Deep-review leaf-agent write-boundary instructions are present in sampled OpenCode, Claude, Gemini, and Codex mirrors, but the command workflow resolver does not enforce the same boundary in code.
- `agent_cross_runtime`: partial. Hook commands resolve and point to existing `dist/hooks/*` scripts across Claude/Codex/Gemini; OpenCode config has permissive local permissions including `external_directory`, and runtime mirrors are not byte-identical by design.
- `feature_catalog_code`: not applicable for this security pass.
- `playbook_capability`: not applicable for this security pass.

Hook command dry-run summary:

| Runtime | Hook entries checked | Binary | Script paths | Result |
|---|---:|---|---|---|
| Claude | 4 | `/opt/homebrew/bin/node` | `dist/hooks/claude/*.js` | Resolved; all scripts exist |
| Codex | 3 | `node` | `dist/hooks/codex/*.js` | Resolved; all scripts exist |
| Gemini | 5 | `node` | `dist/hooks/gemini/*.js` | Resolved; all scripts exist |

Ruled out:

- No hook command in the checked Claude/Codex/Gemini settings referenced `.opencode/skill/`, `.opencode/agent/`, `.opencode/command/`, or `sk-deep-*`.
- No missing hook script was found in the checked settings; every configured `dist/hooks/*` script exists.
- The sampled `deep-review` mirrors all include packet-local write-boundary language, so the parity issue is enforcement drift, not absent leaf-agent doctrine.

## Verdict

FAIL, `hasAdvisories=true`.

D2 Security converged for this pass, but it adds two required P1 fixes: artifact root resolution needs hard containment under the approved spec packet, and the Claude Stop autosave hook must not execute env-selected scripts in production. The prior P0 and three prior P1s remain active.

## Next Dimension

Iteration 4 should move to D3 Traceability: prompt-equality contract across the 16 RCAF playbooks, spec/checklist evidence for packets 093-096, and cross-runtime mirror parity where command YAML, agent files, and generated prompt packs claim the same authority boundaries.
