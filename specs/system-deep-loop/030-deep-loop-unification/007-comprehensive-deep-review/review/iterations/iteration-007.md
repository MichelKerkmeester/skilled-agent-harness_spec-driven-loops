# Deep Review Iteration 007

## Dimension

Security — `deep-research` packet.

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:12`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.claude/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:4`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:340`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:345`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:352`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md:360`
- `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md:157`
- `.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:46`
- `.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:54`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2515`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2516`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2638`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:210`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:216`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:217`

## Findings By Severity

### P0

None.

### P1

#### DR-007-P1-001: External WebFetch content can reach a broad tool surface without prompt-injection or URL trust guardrails

- Claim: `deep-research` explicitly allows `WebFetch` alongside `Write`, `Edit`, `Bash`, and `Task`, and the iteration checklist tells agents to use `WebFetch`, but the packet-level rules only require citation/source-diversity and do not say to treat fetched pages as untrusted data, restrict URL/domain classes, or ignore instructions embedded in fetched content.
- EvidenceRefs: `.opencode/skills/system-deep-loop/deep-research/SKILL.md:4`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:340`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:345`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:352`, `.opencode/skills/system-deep-loop/deep-research/SKILL.md:360`, `.opencode/skills/system-deep-loop/deep-research/references/guides/quick_reference.md:157`, `.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:46`, `.opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:54`.
- CounterevidenceSought: Searched `deep-research` docs for `WebFetch`, `WebSearch`, `URL`, `domain`, `untrusted`, `trust`, `source`, and `citation`; found factual source quality guards and citation requirements, but no prompt-injection isolation rule or URL/domain boundary.
- AlternativeExplanation: A higher-priority runtime/system policy may already treat WebFetch output as untrusted and may constrain domains or tool use outside this packet.
- FinalSeverity: P1.
- Confidence: 0.84.
- DowngradeTrigger: Downgrade to P2 or close if the command/agent runtime has an enforceable WebFetch safety policy that blocks internal/credential URLs, marks fetched content as data-only, and prevents fetched page instructions from influencing `Write`, `Edit`, `Bash`, or `Task` calls.

#### DR-007-P1-002: Deep-research artifact writes are not contained to workspace/spec roots

- Claim: `reduce-state.cjs` resolves the caller-provided `specFolder` with `path.resolve()` and then writes registry, strategy, dashboard, and resource-map files under that resolved path. The shared resolver blocks shell metacharacters, but it does not require the resolved path to stay under the workspace, `.opencode/specs`, or `specs`, so a relative traversal or absolute path can route workflow writes outside the intended research packet.
- EvidenceRefs: `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2515`, `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2516`, `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2638`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:210`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:216`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:217`.
- CounterevidenceSought: Read the resolver branch through child-phase allocation and confirmed it rejects shell metacharacters before joining fixed artifact filenames, but did not find a workspace/spec-root containment check.
- AlternativeExplanation: Upstream `/deep:research` command parsing may canonicalize and validate `specFolder` before this reducer is called, leaving the reducer as an internal-only sink.
- FinalSeverity: P1.
- Confidence: 0.80.
- DowngradeTrigger: Downgrade to P2 if the command workflow proves `specFolder` is always pre-validated to a workspace-contained spec folder before every reducer invocation and no exported reducer/CLI path is considered supported input.

### P2

None new in this iteration.

## Traceability Checks

- `webfetch_guardrails`: fail — factual citation and source-diversity guards exist, but fetched-content instruction isolation and URL/domain restrictions were not found.
- `scripts_shell_external_input`: partial — `verify-yaml-script-paths.sh` uses fixed YAML paths and only checks checked-in script references; `reduce-state.cjs` writes through fixed artifact filenames but inherits uncontained `specFolder` resolution.
- `secrets_credentials`: pass — keyword scan across `deep-research` assets, references, scripts, docs, and benchmark artifacts found no committed API key/token/private-key pattern; matches were documentation words such as `token` or `sk-doc`.
- `allowed_tools_scope`: fail — `WebFetch` is justified by research actions, but `Write`, `Edit`, `Bash`, and `Task` remain broad when combined with unconstrained external fetches.
- `command_yaml_shell_boundaries`: not reviewed — command YAML is outside this iteration's declared target packet, so it was not widened into scope.

## Verdict

CONDITIONAL. Two new P1 findings require remediation or runtime-level counterevidence before the `deep-research` security surface should be considered clean.

## Next Dimension

Iteration 8 should continue the planned packet rotation with `deep-research` traceability. Do not re-count DR-007-P1-001 or DR-007-P1-002 as new; only verify whether packet docs, command entrypoints, agents, feature catalog, and manual-testing playbook consistently represent the live `deep-research` contracts.

Review verdict: CONDITIONAL
