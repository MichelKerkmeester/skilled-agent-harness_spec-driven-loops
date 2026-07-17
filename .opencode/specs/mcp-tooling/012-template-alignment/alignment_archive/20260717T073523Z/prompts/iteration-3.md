DEEP-ALIGNMENT
Resolved route: mode=alignment; target_agent=@deep-alignment; execution=single_alignment_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Alignment Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-alignment` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch. Execute EXACTLY ONE alignment iteration, then stop.

## STATE

Alignment Iteration: 3 of 8
Mode: alignment
Spec Folder: .opencode/specs/mcp-tooling/012-template-alignment
Alignment Packet Root: .opencode/specs/mcp-tooling/012-template-alignment/alignment
Session: 2026-07-17T07:05:11.246Z (generation 1, lineage restart)

## LANE (the maximum audit scope for THIS iteration)

- Lane Id: sk-doc::docs::.opencode/skills/mcp-tooling/mcp-refero/assets/, .opencode/skills/mcp-tooling/mcp-refero/references/, .opencode/skills/mcp-tooling/mcp-refero/scripts/README.md
- Authority: sk-doc
- Adapter: sk-doc
- Artifact Class: docs
- Scope: {"type":"paths","values":[".opencode/skills/mcp-tooling/mcp-refero/assets/",".opencode/skills/mcp-tooling/mcp-refero/references/",".opencode/skills/mcp-tooling/mcp-refero/scripts/README.md"]}
- Artifacts Slice (check exactly these this iteration): [{"path":".opencode/skills/mcp-tooling/mcp-refero/assets/utcp-refero-manual.md"},{"path":".opencode/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md"},{"path":".opencode/skills/mcp-tooling/mcp-refero/references/tool-surface.md"},{"path":".opencode/skills/mcp-tooling/mcp-refero/references/troubleshooting.md"},{"path":".opencode/skills/mcp-tooling/mcp-refero/scripts/README.md"}]

Check this slice's artifacts against the sk-doc authority's OWN creation-standard source, not general code or doc correctness. Stay inside this lane's authority/artifactClass/scope.

## CONVERGENCE PARAMS (informational; you do NOT compute the convergence decision)

- coverageThreshold: 1 (fraction of discovered artifacts that must be checked at least once)
- stabilityWindow: 2 (consecutive zero-new-findings iterations required)

Convergence is a two-signal AND-gate (coverage AND stability), evaluated by the orchestrating command between iterations via `deep-alignment/scripts/check-convergence.cjs`. Report `newFindingsRatio` honestly so that gate is truthful; never decide STOP yourself.

## ALIGNMENT CONTRACT (the two enforced invariants ARE this mode's adversarial check)

1. **Verify-first (Invariant 1):** any finding that claims drift from live reality MUST be re-probed directly against the real validator, CLI, registry, or source file before you assert it. Pattern-matching alone is never sufficient for an active P0/P1.
2. **Known-deviation suppression (Invariant 2):** check every candidate finding against its lane authority's known-deviation list (`references/adapters/<authority>_known_deviations.md`) before filing it. A match suppresses ONLY that finding, never the whole artifact and never a genuinely non-conformant sibling finding.
3. **Read-only by default:** never modify an audited artifact. Your only writes are the iteration file, the JSONL state log, and the write-once delta file.
4. **Gated remediation:** never run remediation of any kind.

## SEVERITY DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before assigning severity. Tag each finding by its lane identity (authority, artifactClass, scope) plus the adapter's own type/subcheck/layer fields. Do NOT tag findings by review dimension (correctness/security/traceability/maintainability) — that taxonomy does not apply in this mode.

## VERDICTS (per lane, rolled up by the reducer — never computed by you)

FAIL when an active P0 exists in the lane; CONDITIONAL when no active P0 but an active P1 remains; PASS when no active P0/P1. A genuine zero-findings result is a valid, complete PASS.

## STATE FILES

All paths are relative to the repo root.

- Config (read-only): .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-config.json
- Corpus (read-only): .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-corpus.json
- State Log (read + Bash-append): .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-state.jsonl
- Findings Registry (read-only, reducer-owned): .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-findings-registry.json
- Write this iteration's narrative to: .opencode/specs/mcp-tooling/012-template-alignment/alignment/iterations/iteration-003.md
- Write this iteration's delta file to: .opencode/specs/mcp-tooling/012-template-alignment/alignment/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents and do NOT use the Task tool.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold findings in context.
- Every audited artifact is READ-ONLY. Do not modify, rename, or delete any audited artifact, config, corpus, findings registry, report, command, skill, canonical agent, or runtime mirror.
- Resolve focus via `partition-corpus.cjs`; never guess the next lane or slice. Respect an exhausted lane/slice.
- Cite `[SOURCE: path:line]` or `[SOURCE: ref]` for every finding; `[INFERENCE: ...]` may support but never solely prove an active P0/P1.

- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to):**
  - `.opencode/specs/mcp-tooling/012-template-alignment/alignment/iterations/iteration-003.md`, this iteration's narrative markdown (Bash-create a new file)
  - `.opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-state.jsonl`, append-only JSONL state log (Bash `>>` append exactly ONE iteration record)
  - `.opencode/specs/mcp-tooling/012-template-alignment/alignment/deltas/iter-003.jsonl`, this iteration's write-once delta JSONL (Bash-create once)
- **BANNED OPERATIONS (NEVER execute against any path):** `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; writing, renaming, and deleting are scoped.
- **SCOPE VIOLATION PROTOCOL:** if your plan would require writing any path NOT in the allowed-write list, STOP that action and record it as an edge case in the iteration narrative instead. NEVER execute the out-of-scope mutation.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration. If any is missing or malformed, the iteration is incomplete.

1. **Iteration narrative markdown** at `.opencode/specs/mcp-tooling/012-template-alignment/alignment/iterations/iteration-003.md` (Bash heredoc create; the file must not already exist). Include sections: Dispatcher, Lane, Artifacts Checked, Findings - New (P0/P1/P2 subsections), Verify-First Evidence, Known-Deviation Suppressions Applied, Edge Cases, Confirmed-Clean Artifacts, Ruled Out, Next Focus. `Next Focus` is a human-readable echo of what `partition-corpus.cjs` returns, never a hand-authored plan.

2. **Canonical JSONL iteration record** APPENDED (single line, newline-terminated) to `.opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required route proof: `"iteration":<n>`, `"mode":"alignment"`, `"target_agent":"deep-alignment"`, `"agent_definition_loaded":true`, `"resolved_route":"Resolved route: mode=alignment target_agent=deep-alignment"`. Required alignment data: `run`, `status`, `laneId`, `authority`, `artifactClass`, `scope`, `artifactsChecked` (JSON array of the artifact paths you audited this iteration, not a bare count), `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`. Allowed `status`: `complete | timeout | error | stuck | insight | thought`. Append via `printf '%s\n' '<single-line-json>' >> .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-state.jsonl`; do NOT pretty-print and do NOT print to stdout only.

3. **Per-iteration delta file** at `.opencode/specs/mcp-tooling/012-template-alignment/alignment/deltas/iter-003.jsonl` (Bash-create once; never overwrite). Its first line MUST contain the same canonical iteration record as the state-log append, with `laneId` present, followed by structured `{"type":"finding","laneId":"...","finding":{...}}` lines (one per line) in the adapter's own raw finding shape.

If any hard-block invariant fails before you begin writing, do not write partial iteration artifacts — return an error status naming the failed invariant. A real zero-findings PASS is a complete, valid outcome; never manufacture a finding to look thorough, and never suppress a real P0 to avoid a FAIL verdict.
