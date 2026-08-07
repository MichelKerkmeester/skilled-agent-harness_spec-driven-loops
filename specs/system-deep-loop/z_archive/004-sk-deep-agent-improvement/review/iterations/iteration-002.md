## Dispatcher

- Run: 2
- Mode: review
- Status: complete
- Focus: security - check renamed `deep-agent-improvement` scripts and command YAML references for unsafe shell/path handling, hardcoded secrets, auth/permission changes, broad permissions, path traversal risk, and unsafe public path disclosure.
- Budget profile: verify (selected for shell/path security evidence and compact P1 adjudication)
- Session: `rvw-2026-05-06T12:38:00Z`, generation 1, lineage `new`

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/SKILL.md`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`
- `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Unquoted workflow placeholders allow shell/path injection before script validation** -- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:128` -- The auto workflow defines user-provided `spec_folder` and `target_path` fields, but only requires `spec_folder` to be present and `target_path` to match an agent path in prose validation [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:37`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:40`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:56`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:59`]. Those placeholders are then interpolated unquoted into shell commands such as `mkdir -p {spec_folder}/...`, `--output={spec_folder}/...`, and `--agent={target_path}` [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:128`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:131`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:135`]. The confirm workflow repeats the same pattern [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:141`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:144`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:148`]. Because the scripts receive arguments only after the shell has expanded the command line, shell metacharacters or whitespace in these fields can redirect writes outside the intended packet or execute unintended shell fragments before Node code can apply path handling.
   - Finding class: cross-consumer
   - Scope proof: Same unquoted placeholder pattern appears in both auto and confirm workflow command surfaces for the same user-controlled fields; reviewed representative path-consuming scripts parse argv and write outputs but do not protect the shell invocation boundary [SOURCE: `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs:26`, `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs:188`, `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs:235`, `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs:26`, `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs:250`, `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:17`, `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:261`].
   - Affected surface hints: [`deep_start-agent-improvement-loop_auto.yaml`, `deep_start-agent-improvement-loop_confirm.yaml`, `spec_folder`, `target_path`, `candidate_path`]
   - Recommendation: Route user fields through an argument array or a quoting/escaping helper before command execution, and enforce canonical `spec_folder` and `.opencode/agents/*.md` path normalization before constructing shell commands.

```json
{
  "type": "claim_adjudication",
  "claim": "User-controlled workflow placeholders are interpolated unquoted into shell command strings, creating shell/path injection risk before script-level path handling can run.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:37",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:40",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:56",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:59",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:128",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:131",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:135",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:141",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:144",
    ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:148"
  ],
  "counterevidenceSought": "Checked workflow validation text for stronger path constraints and reviewed scan-integration, generate-profile, and run-benchmark argument parsing. The validation is prose-level in YAML, spec_folder has no charset/root constraint, and script parsing occurs after shell interpolation.",
  "alternativeExplanation": "The command runner may provide separate placeholder escaping outside the YAML text; that surface was not present in this packet, so severity is limited to P1 rather than P0.",
  "finalSeverity": "P1",
  "confidence": "medium-high",
  "downgradeTrigger": "Downgrade to P2 if the command dispatcher proves all placeholders are shell-escaped or passed as argv arrays before these command strings execute."
}
```

### P2 Findings

- None.

## Traceability Checks

- Security focus followed the strategy next focus for unsafe path handling, shell command regressions, secret exposure, and broadened permissions.
- Review stayed within the declared target and representative security files named by dispatch.
- Code graph was stale and not used as evidence.

## Integration Evidence

- Skill frontmatter grants `Read`, `Write`, `Edit`, `Bash`, `Glob`, and `Grep`; no auth/permission frontmatter expansion beyond those allowed tools was observed in the reviewed frontmatter [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:1`, `.opencode/skills/deep-agent-improvement/SKILL.md:4`].
- Auto workflow command surface inspected for init, scan, profile generation, scoring, benchmark, reducer, and journal command strings [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:128`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:131`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:135`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:165`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:177`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:192`].
- Confirm workflow command surface inspected for equivalent interactive-mode command strings [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:141`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:144`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:148`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:196`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:208`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:223`].

## Edge Cases

- Ambiguity: The YAML may be executed by a dispatcher that escapes placeholders out-of-band. No such escaping guarantee was present in the reviewed packet, so the finding is kept at P1 with a downgrade trigger rather than escalated to P0.
- Missing dependency: Runtime command-dispatch implementation was not expanded beyond the declared representative files; this prevents proving exploitability end-to-end.

## Confirmed-Clean Surfaces

- Reviewed `scan-integration.cjs`, `generate-profile.cjs`, and `run-benchmark.cjs` use Node file/path APIs rather than direct shell execution in the inspected path-consumer flows [SOURCE: `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs:9`, `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs:9`, `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:10`].
- No hardcoded credential literal was found in the reviewed `SKILL.md` frontmatter or the inspected command YAML snippets.

## Ruled Out

- No active P0: evidence shows a command-template injection boundary, but exploitability depends on the dispatcher passing malicious placeholder values without escaping.
- No separate finding for broad SKILL.md allowed tools: the skill is explicitly an improvement workflow that writes packet-local candidates and uses Bash, so the allowed tool list alone is not evidence of a rename-introduced security regression [SOURCE: `.opencode/skills/deep-agent-improvement/SKILL.md:4`, `.opencode/skills/deep-agent-improvement/SKILL.md:38`].

## Next Focus

- dimension: traceability
- focus area: Cross-check spec requirements, task/checklist claims, implementation evidence, and resource-map coverage, with special attention to current active P1 evidence mismatches.
- reason: Security completed with one active P1 command-placeholder shell/path handling issue.
- rotation status: correctness and security completed; rotate to traceability.
- blocked/productive carry-forward: Productive exact Grep/Read evidence; do not rely on stale code graph.
- required evidence: Cite file:line evidence for spec, checklist, implementation-summary, resource-map, command/workflow, and skill surfaces used in traceability claims.
