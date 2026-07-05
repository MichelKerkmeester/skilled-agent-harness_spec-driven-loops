# Iteration 009: agent_cross_runtime — runtime SKILL.md and command file parity

## Focus

- Dimension: traceability (overlay: agent_cross_runtime)
- Goal: verify that the deep-review skill's runtime mirrors
  (OpenCode, Claude, Codex) are byte-identical or have only
  expected per-runtime translations, with no undocumented drift.

## Scorecard

- Dimensions covered: traceability (agent_cross_runtime overlay)
- Files reviewed: 3 SKILL.md mirrors + 3 agent definitions +
  3 review.md command files
- New findings: P0=0 P1=0 P2=1
- Refined findings: 1 (F022 refined: now covers SKILL.md parity
  and command parity, in addition to the agent definition
  parity)
- New findings ratio: 0 (no P0 or P1 findings; cross-runtime
  parity is strong)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

- **F029 — Cross-runtime parity for the deep-review skill surface
  is strong: 3 SKILL.md mirrors are byte-identical (30201 bytes),
  3 review.md command files are byte-identical (880 bytes), 3
  agent definitions are 2 byte-identical + 1 with 4 lines of
  expected frontmatter/perms difference** —
  Per `ls -la` and `diff` outputs at
  `iterations/iteration-009.md:7-50`:
  - `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` (30201 bytes)
  - `.claude/skills/deep-loop-workflows/deep-review/SKILL.md` (30201 bytes) — byte-identical to OpenCode
  - `.codex/skills/deep-loop-workflows/deep-review/SKILL.md` (30201 bytes) — byte-identical to OpenCode
  - `.opencode/commands/deep/review.md` (880 bytes)
  - `.claude/commands/deep/review.md` (880 bytes) — byte-identical
  - `.codex/commands/deep/review.md` (880 bytes) — byte-identical
  - `.opencode/agents/deep-review.md` (33338 bytes)
  - `.codex/agents/deep-review.md` (33338 bytes) — byte-identical
  - `.claude/agents/deep-review.md` (33214 bytes) — differs in
    description quotes, `tools:` array vs `permission:` block,
    and path convention line (4 lines of difference)
  This is the expected cross-runtime parity shape — OpenCode is
  the canonical source; Claude translates the permission block to
  a `tools:` allowlist per its runtime model; Codex mirrors
  OpenCode. The doc-staleness audit (2026-07-04 archive) did not
  explicitly verify the SKILL.md or review.md parity, only the
  feature catalog and playbook rows. This iteration's observation
  is that the parity extends to all skill surfaces, not just the
  catalog rows.
  - Category: traceability (with cross-runtime confirmation)
  - Source evidence: `diff` outputs at
    `iterations/iteration-009.md:43-50`.
  - Affected surface hints: `["cross-runtime parity surface",
    "deep-review skill surface"]`

## Refinements

- **F022 refined** — Originally recorded as "OpenCode/Codex
  agents are byte-identical; Claude differs in 4 lines." This
  iteration's deeper dive confirms the parity extends across
  the full skill surface (SKILL.md × 3, command.md × 3, agent
  definition × 3), not just the agent definitions. The 4-line
  Claude difference is the only per-runtime translation in the
  entire deep-review surface.

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | pass     | hard     | parity between 3 runtimes verified             | 3-way byte-identity or expected translation |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | partial  | advisory | SKILL.md mirrors are byte-identical            | F029 |
| agent_cross_runtime| pass    | advisory | this iteration IS the protocol run             | All findings; F022 refined |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer (covered in iteration 007) |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer (covered in iteration 008) |

## Assessment

- newFindingsRatio: 0 (clean-overlay iteration)
- dimensionsAddressed: traceability (agent_cross_runtime overlay)
- noveltyJustification: extends F022 to the full skill surface
  (SKILL.md + command.md + agent definition); only one
  per-runtime translation point (Claude's `permission:` block).

## Ruled Out

- The worktree-local SKILL.md files (e.g.,
  `.worktrees/0001-mcp-front-proxy/.opencode/skills/deep-review/SKILL.md`)
  are in separate work contexts and out of scope for the
  cross-runtime parity check. Each worktree is its own
  cross-runtime mirror; not relevant to the
  `.opencode/.../SKILL.md` ↔ `.claude/.../SKILL.md` ↔
  `.codex/.../SKILL.md` parity check.
- The 4-line Claude agent difference is documented and expected
  (per-runtime translation of the same intent).

## Dead Ends

- Trying to derive a "parity score" by counting identical
  lines: the SKILL.md mirrors are byte-identical, so a count
  would be 100% — not a useful metric. The Claude agent's
  4-line difference is the only per-runtime translation point
  in the entire surface.

## Recommended Next Focus

Iteration 010: test suite coverage and contract validation —
verify the test file count, the `__test` export seam count,
and the test runner invocation pattern match the parent
phase-map and the test architecture phase-018 narrative.

## Claim Adjudication

```json
{"findingId":"F029","claim":"Cross-runtime parity for the deep-review skill is strong: 3 SKILL.md mirrors are byte-identical (30201 bytes), 3 review.md command files are byte-identical (880 bytes), 3 agent definitions are 2 byte-identical + 1 with 4 lines of expected frontmatter/perms difference.","evidenceRefs":[".opencode/skills/deep-loop-workflows/deep-review/SKILL.md",".claude/skills/deep-loop-workflows/deep-review/SKILL.md",".codex/skills/deep-loop-workflows/deep-review/SKILL.md",".opencode/commands/deep/review.md",".claude/commands/deep/review.md",".codex/commands/deep/review.md",".opencode/agents/deep-review.md",".codex/agents/deep-review.md",".claude/agents/deep-review.md"],"counterevidenceSought":"Re-ran ls -la and diff for all 9 files; byte-identity and 4-line difference confirmed.","alternativeExplanation":"Could be that the Claude path convention difference (`.claude/agents/*.md` vs `.opencode/agents/*.md`) implies a real semantic drift, but both are correct per their runtime model.","finalSeverity":"P2","confidence":0.99,"downgradeTrigger":"None — the parity observation is structural, not a defect."}
```

Review verdict: PASS