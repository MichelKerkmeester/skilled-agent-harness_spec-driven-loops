# Deep Review Iteration 004 - Security Pass

Session: `2026-05-07T17:08:57Z`
Generation: `1`
Lineage mode: `new`
Dimension: security
Focus: Stop-hook env override gating, workflow-resolved write authority, resolver containment, hook schema integrity, validation path handling
Verdict: **FAIL**

## Scope Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.claude/settings.local.json`
- `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skills/sk-code-review/references/review_core.md`

`review_core.md` was loaded before final severity calls. Its P1 standard covers injection exposure, privilege misuse, and required security gate failures; the new finding below meets that bar because a workflow-controlled path can become both a shell/JS interpolation sink and a write root.

## Findings

### P1-019 [P1] `spec_folder` is interpolated into executable workflow commands before containment is enforced

- File: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:118`
- Evidence: The workflow declares a containment requirement at line 136, but the executable steps interpolate raw `{spec_folder}` into `node -e` at line 118, into reducer shell commands at lines 856 and 1024, and into a JavaScript string in the Copilot executor at line 702. The shared resolver then accepts `path.resolve(specFolder)` at `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:201` and derives write roots with `path.join(resolved, mode)` at line 202. The reducer repeats `path.resolve(specFolder)` at `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172` and writes registry, strategy, dashboard, and resource-map files under that resolved directory at lines 1239-1245. A read-only probe confirmed `resolveArtifactRoot('/tmp/speckit-escape','review')` resolves to `/tmp/speckit-escape/review`, and `resolveArtifactRoot('../outside-spec','review')` resolves outside this repo's `Public` root.
- Finding class: cross-consumer
- Scope proof: `rg -n "spec_folder_is_within|resolveArtifactRoot\\('|reduce-state\\.cjs \\{spec_folder\\}|\\{spec_folder\\} --emit-resource-map" .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` found the declarative validation and the raw executable interpolations. `rg -n "path\\.resolve\\(specFolder\\)|writeUtf8\\(" .opencode/skills/system-spec-kit/shared/review-research-paths.cjs .opencode/skills/deep-review/scripts/reduce-state.cjs` found no containment check before write paths are derived.
- Affected surface hints: `["deep-review YAML runner", "review artifact resolver", "reduce-state writer", "cli-copilot executor"]`
- Recommendation: Move spec-folder validation into a shared code helper that canonicalizes against the repo root and allows only `specs/` or `.opencode/specs/` descendants, then pass the value to shell/Node via argv or environment variables instead of string interpolation. The resolver should reject absolute paths, `..` traversal, unresolved placeholders, and paths outside the approved specs roots before any command or write step uses the value.
- Claim: A malicious or malformed `spec_folder` can escape the intended review packet boundary and can be embedded into executable workflow commands before the claimed authority guard runs.
- EvidenceRefs: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:118`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:136`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:702`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:856`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1024`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:201`, `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`, `.opencode/skills/deep-review/scripts/reduce-state.cjs:1239`
- Counterevidence sought: an actual workflow runner layer that validates and shell-quotes `{spec_folder}` before every command render, a shared resolver containment check not visible in the reviewed files, or tests proving absolute paths, `../`, quotes, and shell metacharacters are rejected before line 118 executes.
- Alternative explanation: The YAML `step_preflight_contract` may be intended as the enforcement point. The reviewed file only documents that requirement; the executable commands still use the raw placeholder, and the resolver/reducer accept absolute and parent-traversal inputs directly.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Add executable containment tests for absolute paths, `../`, unresolved placeholders, quote injection, and shell metacharacters; update the YAML commands to pass sanitized argv/env values; and prove reducer writes cannot leave the workflow-approved spec folder.

### P2-004 [P2] Copilot target-authority guard is still non-functional in the imported module

- File: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:690`
- Evidence: The Copilot branch imports `buildCopilotPromptArg` from `executor-config.ts` at line 690 and calls it at line 714. A module export probe of `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` listed executor config exports only; `buildCopilotPromptArg` and `validateSpecFolder` are absent. `rg` found the helper only in YAML comments/calls and in `mcp_server/lib/deep-loop/README.md:64`, not in source or dist implementation files.
- Status: Still active; P1-019 covers the broader security failure. This item remains P2 because the current Copilot path fails before spawning `copilot`, so this specific missing helper is a broken control claim rather than the direct write-escape path.
- Recommendation: Implement and export the helper in source and dist, or remove the Copilot branch's authority-guard claims until the helper exists and is tested.

## Security Checks Without New Findings

- Stop hook env override: **pass**. Source and dist both gate `SPECKIT_GENERATE_CONTEXT_SCRIPT` behind exact `process.env.NODE_ENV === 'test' || process.env.SPECKIT_TEST === 'true'` checks at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43-47` and `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:33-36`. Empty, unset, or differently cased values do not enable the override.
- Source/dist sync for the Stop hook: **pass for the security-relevant hunk**. The compiled file mirrors the env gating semantics.
- Claude hook config schema: **pass**. `.claude/settings.local.json:30-80` uses the nested `hooks` arrays with fixed `bash -c` commands; no prompt content is interpolated into those configured commands.
- SessionStart and UserPromptSubmit injection spot-check: **pass**. The settings invoke fixed scripts, while the Claude UserPromptSubmit hook parses JSON and passes prompt text as data to `buildSkillAdvisorBrief` at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:149-169`.
- `validate.sh` command injection spot-check: **pass for shell injection**. The script stores the folder argument as data at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:126-131` and uses quoted variables/argv arrays for Node validators at lines 514-558. It does not enforce repo containment, but the reviewed usage is a local validator rather than an artifact writer.
- `skill_advisor.py` command injection spot-check: **pass**. Subprocess calls use argv arrays and JSON/stdin, e.g. the native bridge at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:314-322` and CLI input parsing at lines 3299-3371. The `--batch-file` option can read an arbitrary operator-supplied path, but that is explicit CLI behavior, not prompt-driven traversal.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| spec_code | fail | P1-019: workflow docs claim `spec_folder_is_within`, but executable resolver/reducer paths do not enforce it before command/write use. |
| checklist_evidence | fail | Prior P1-007 remains active from iteration 003. |
| skill_agent | pass | `deep-review` and `review_core.md` were loaded for this pass. |
| agent_cross_runtime | fail | Prior P1-017 remains active; this security pass did not resolve cross-runtime transcript evidence. |
| feature_catalog_code | fail | Prior source/dist/default drift findings remain active. |
| playbook_capability | mixed | Prior P1-018 remains active; no new playbook-specific security finding was raised. |

## Coverage and Ratio

- Prior findings: P0=0, P1=5, P2=4.
- Current active/carry-forward findings after this pass: P0=0, P1=6, P2=4.
- New findings this iteration: P1-019.
- Strengthened carried finding: P2-004 remains active with concrete missing-export evidence.
- New findings ratio: 1 / 10 = 0.1000.
- Coverage age: 0.

## Provisional Verdict

**FAIL**. The specific Stop-hook env override fix passes the security check, but the deep-review workflow still lacks enforceable containment for `spec_folder` before command execution and artifact writes. That keeps the track below the security bar.
