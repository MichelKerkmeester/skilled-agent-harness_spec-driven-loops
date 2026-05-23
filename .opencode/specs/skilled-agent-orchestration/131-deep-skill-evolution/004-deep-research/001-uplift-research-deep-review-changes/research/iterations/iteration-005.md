# Iteration 5 — Adversarial on Deep-Research Artifacts (captured from devin log)

## Summary
Adversarial review on deep-research's actual code/docs/YAML/test surfaces. Found 1 P1 + 2 P2 findings (devin's `1/2/0` count line was P1/P2/P0 not P0/P1/P2). Ruled out: off-by-one errors, race conditions, missing error handling, schema validity, placeholder mismatches, orphaned MCP tool references.

## Findings

### P1 (Required)

- [DR-006] Lexical sort bug in iteration file ordering — `.opencode/skills/deep-research/scripts/reduce-state.cjs:874`
  Evidence: lexical sort causes `iteration-10.md` to sort before `iteration-2.md` (string compare instead of numeric)
  Recommended fix: numeric sort on the trailing iteration number (parseInt regex extract OR padded comparison)

### P2 (Suggestions)

- [DR-007] Missing resource_map detection step in confirm YAML — `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`
  Evidence: auto YAML has resource_map.emit detection but confirm YAML doesn't
  Recommended fix: add symmetric step

- [DR-008] Stale tool references in SKILL.md allowed-tools — `.opencode/skills/deep-research/SKILL.md`
  Evidence: `allowed-tools` frontmatter list may reference tools removed in 118 OR superseded by deep-loop-runtime scripts
  Recommended fix: audit + prune list against current MCP surface

## Verification (PASS notes, no findings)

- ✓ No off-by-one errors in iteration counters
- ✓ No race conditions in state mutation
- ✓ Schema validity OK on assets/*.yaml
- ✓ No orphaned MCP tool references for the 4 deleted deep_loop_graph_*
- ✓ No placeholder mismatches in prompt_pack_iteration.md.tmpl

## Convergence Signal

- newFindings: 3
- newFindingsRatio (vs cumulative ~52): 0.058 — well below 0.10 threshold
- Cumulative: 0 P0 / 16 P1+5 / 7 P2 (combining 118-applicability uplift + deep-research-specific)
