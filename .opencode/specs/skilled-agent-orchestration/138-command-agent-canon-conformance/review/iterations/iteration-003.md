# Deep Review Iteration 003 — Security

## Dispatcher

- BINDING: target=.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance
- BINDING: maxIterations=5
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance
- Iteration 3 of 5; generation 1; resolved route: mode=review, target_agent=deep-review.
- Leaf review; no delegation; review target is read-only.
- Focus: security — trust boundaries, path handling, command execution, generated-file mutation, and home-directory assumptions.

## Files Reviewed

- sync-agents.cjs and sync-prompts.cjs, including source discovery, destination construction, and write loops.
- validate_document.py, including regexes, argparse choices, file reads, and --fix writes.
- All 13 canonical agent manifests; focused permission reads of deep-alignment and review, their Claude mirrors, and generated deep-alignment TOML.
- Phase-003/004 Codex parity and home-install contracts, prior state, and strategy.

## Findings - New

### P0 Findings

None. No confirmed code-execution or credential-exposure path was found.

### P1 Findings

1. **P1-004 [P1] Read-only deep-alignment is emitted with a workspace-write sandbox** — .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:138-149

   deep-alignment denies write, edit, and patch but allows Bash without a path or command scope (.opencode/agents/deep-alignment.md:6-21). deriveSandboxMode treats Bash as a writable tool, and deep-alignment is absent from HISTORICAL_SETTINGS; the generated .codex/agents/deep-alignment.toml therefore contains sandbox_mode = "workspace-write" at line 5. Prompt-only ALLOWED WRITE PATHS cannot substitute for an OS-level restriction.

   Finding class: permission-boundary
   Scope proof: The canonical manifests, Claude mirrors, and Codex outputs were inventoried; the generated TOML proves the resulting sandbox.
   Affected surface hints: ["deep-alignment", "sync-agents.cjs", "Codex sandbox", "OpenCode/Claude Bash permissions"]

   {"type":"security","claim":"A read-only deep-alignment agent is granted workspace-write by the Codex generator.","evidenceRefs":[".opencode/agents/deep-alignment.md:6-21",".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:20-37",".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:111-149",".codex/agents/deep-alignment.toml:3-7"],"counterevidenceSought":["Explicit deep-alignment historical override","Generated TOML sandbox value"],"alternativeExplanation":"The omission could be intentional, but the fallback and generated artifact both prove workspace-write.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Only if the runtime ignores sandbox_mode or does not expose Bash."}

2. **P1-005 [P1] Generated-output writers follow pre-existing symlinks outside their nominal output roots** — .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:142-147

   Both generators use fixed nominal roots, but listFiles/listOutputFiles ignore symlink entries and the write loops call writeFileSync without lstat, realpath containment, or no-follow semantics. A symlink at an expected generated filename is treated as missing during enumeration and followed during the normal write; a symlinked output directory has the same effect. No such links exist in the current checkout, which is counterevidence against an active instance, not a fix for the mutation path.

   Finding class: output-boundary
   Scope proof: Both reviewed mutation writers share the same unchecked destination construction.
   Affected surface hints: ["sync-agents.cjs", "sync-prompts.cjs", ".codex/agents", ".codex/prompts", "generated-file mutation"]

   {"type":"security","claim":"A pre-existing output symlink can redirect generation outside the nominal output root.","evidenceRefs":[".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:49-55",".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:241-257",".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:54-60",".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:132-149"],"counterevidenceSought":["Current output-tree symlink inventory","realpath/lstat/no-follow guards"],"alternativeExplanation":"No current links exist, but that does not constrain a future checkout or user-created link.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Only if the invoking runtime guarantees non-symlink roots and destinations."}

### P2 Findings

No new P2 findings. P2-002 is refined into P1-004 because the settings omission changes the effective sandbox boundary.

## Traceability Checks

- Agent permission boundary: FAIL — read-only deep-alignment has unscoped Bash, and Codex output is workspace-write.
- Generated-file containment: FAIL — nominal path joins are not symlink-safe.
- Prompt forwarding: PASS — no shell, eval, or exec path consumes prompt content.
- Validator input handling: PASS under the explicit CLI boundary — --type is allowlisted and the file path is the utility input.
- Validator regex safety: PASS by static inspection — no catastrophic nested quantifiers in reviewed patterns.
- Secrets scan: PASS — targeted secret/API-key/private-key patterns returned no matches.
- Home-directory install: NOT IMPLEMENTED — installation and stale-link repair are explicitly deferred, so no home installer was available to audit.

## Integration Evidence

- .codex/agents/deep-alignment.toml:5 confirms the sandbox consequence.
- The Claude mirrors expose Bash while the canonical manifests deny direct write/edit; deny-list semantics are not equivalent across runtimes.
- Phase 003/004 defer home-directory mutation; this remains carried P1-003.
- Read-only checks: sync-agents --check exits 1 for known stale ai-council/context outputs; sync-prompts --check exits 0 for 37 prompts.

## Edge Cases

- No current symlink entries exist in the inspected trees; the latent writer weakness remains.
- Source traversal does not recurse through symlink directories.
- validate_document.py accepts a caller-supplied file path by design; --type is constrained.
- P2-002 is a security refinement, not a duplicate active P2.

## Confirmed-Clean Surfaces

- sync-agents uses fixed repository-relative source/output roots and allowlisted agent basenames.
- Frontmatter extraction copies only name, description, and body; generated TOML uses safe JSON encoding when needed.
- sync-prompts forwards prompt content as text and never executes it.
- validate_document.py has no eval, exec, pickle, or YAML load path.
- The targeted secret scan returned no matches.

## Ruled Out

- Prompt-content command injection.
- Unsafe frontmatter deserialization or arbitrary property copying.
- Catastrophic validator ReDoS.
- Home-install symlink mutation, because no home-install implementation exists.

## Next Focus

- dimension: traceability
- focus area: Reconcile these security findings with checklist evidence, runtime parity claims, and parent/child completion contracts.
- reason: Security found two active P1s and refined P2-002; the next pass must prove packet-wide traceability.
- rotation status: queued
- blocked/productive carry-forward: P1-001, P1-002, P1-003, P1-004, P1-005.
- required evidence: child checklists, implementation summaries, cross-runtime permission/tool maps, and parent metadata.

Review verdict: CONDITIONAL

