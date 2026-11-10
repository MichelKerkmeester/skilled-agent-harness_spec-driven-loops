# Deep Review Iteration 2

## Dispatcher

- Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Mode: review
- Executor: cli-codex, gpt-6-luna
- Dimension: security
- steer.md was checked and absent. State, registry, configuration, and strategy were read before this pass.

## Dimension

Security: traced local-* symlink containment, tracked-output exclusion, and the staged-path commit guard.

## Files Reviewed

- .skilled/scripts/git-hooks/pre-commit — path pattern and cached diff filter, lines 100–119.
- .gitignore — private-root patterns, lines 230–239.
- specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md — guard contract and success criteria, lines 136–149.
- specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md — containment and generator requirements, lines 202–213.
- .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts — canonical-root containment, lines 21–61.
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts — link admission, lines 727–754.
- .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts — trusted link in source signature, lines 143–150.
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py — Python equivalent containment, lines 155–208.
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py — local-name and symlink exclusions, lines 200–211.
- .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs — local-name exclusion before traversal, lines 55–67.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Packet completion status contradicts active phase records** — specs/sk-code/013-private-surface-skills/spec.md:50 — Carried forward from iteration 1; the conflicting root and phase 2 status records remain unresolved. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/spec.md:34]
   Finding ID: LUNA-R1-P1-001
   Finding class: phase_status_drift
   Scope proof: This concerns the declared completion and phase-transition state of the target packet.
   Affected surface hints: packet-status, phase-transition, completion-gate
   Case: An operator uses the parent Complete state to stop while a child phase still lists open work.

### P2 Findings

1. **Staged type-change paths bypass the local-skill guard** — .skilled/scripts/git-hooks/pre-commit:111 — The path-name regex is applied only after a cached diff query filtered to ACMR; a Git type-change status T is omitted, so a previously tracked local-* path changing file type bypasses the hook. [SOURCE: .skilled/scripts/git-hooks/pre-commit:105] [SOURCE: .skilled/scripts/git-hooks/pre-commit:111] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md:136] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md:148]
   Finding ID: LUNA-R2-P2-001
   Finding class: commit_guard_diff_filter_gap
   Scope proof: The pre-commit hook and its phase 1 guard contract are in the declared review scope.
   Affected surface hints: pre-commit-guard, private-skill-path, publication-boundary
   Case: A path already tracked at a local-* name changes from a symlink to a regular file containing private bytes; its T status is filtered out before the guard pattern runs.
   Confidence: 0.76. The edge requires an already tracked local-* path; a fresh added path is caught.
   Recommendation: Include type-change entries in the staged-path scan and cover this path transition.

## Traceability Checks

- spec_code: partial — the phase 1 guard's status filter leaves an unexamined type-change edge.
- checklist_evidence: partial — the phase 1 success criterion covers staged path refusal, but no tests were run in this review.
- skill_agent and agent_cross_runtime: partial — TypeScript and Python containment checks use equivalent canonical-path and relative-boundary logic.
- feature_catalog_code and playbook_capability: pending for the later traceability pass.

## Integration Evidence

The eight-root private-path regex runs only on paths returned by the cached diff filter. The graph compiler and Hermes mirror skip local-* names before reading entries, while the TypeScript and Python advisor readers follow a link only when it resolves under a trusted root. [SOURCE: .skilled/scripts/git-hooks/pre-commit:105] [SOURCE: .skilled/scripts/git-hooks/pre-commit:111] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:200] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:59] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155]

## Edge Cases

- The phase 1 comment explains why staged deletions are excluded, but ACMR also omits type changes; no clean-room test was executed.
- The guard still covers ordinary added, modified, copied, and renamed paths under all eight roots.
- A new local-* path is normally ignored; the type-change gap requires a local-* path already present in the index.

## Confirmed-Clean Surfaces

- TypeScript private-link containment uses realpath plus relative-path boundary checks, rejecting parent traversal and prefix-similar siblings. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21]
- Python uses the same realpath and relative boundary approach. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155]
- Compiler and Hermes paths skip local-* before probing the entry, consistent with the phase 3 requirements. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:203] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:59]

## Ruled Out

- Trusted-root prefix escape through a sibling path was checked in both runtime helpers and not found; they compare relative paths rather than string prefixes.

## Next Dimension

Traceability. Cross-check phase requirements against implementation and acceptance evidence, including generated retrieval/corpus surfaces and the completed-phase records.

## Next Focus

- Dimension: traceability
- Focus area: compare phase requirements, task completion marks, acceptance evidence, and the implementation summaries for the claimed closure state.
- Reason: the packet exposes a status contradiction and relies on many generated artifact proofs; verify those claims against their evidence pointers.
- Rotation status: first pass
- Blocked/productive carry-forward: direct source reads worked; graph traversal remains unavailable under lineage scope.
- Required evidence: current requirement rows, task/acceptance status, and referenced implementation surfaces.

## SCOPE VIOLATIONS

- The YAML graph seed and per-iteration graph upsert target packet-root graph metadata outside the bound lineage path. Those writes remain skipped; this pass used graphless search coverage.
- The prior out-of-scope continuity write is recorded in iteration 1; no new outside-lineage write was made in this pass.

## Verdict

The carried P1 remains open; one scoped P2 guard gap was found. No P0 was found.

Review verdict: CONDITIONAL
