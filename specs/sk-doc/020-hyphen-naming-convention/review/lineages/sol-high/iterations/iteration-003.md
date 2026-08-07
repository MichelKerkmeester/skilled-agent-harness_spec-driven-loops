# Deep Review Iteration 003

## Dimension

Traceability — canonical packet identity and executable routing.

## Files Reviewed

- Root specification and metadata identity
- Phase 000 worktree specification, plan, tasks, and checklist
- Phase 001 decision record and identity-resolution checklist
- Corpus-wide packet-number/title references
- All graph metadata and explicit relative Markdown links

## Findings by Severity

### P0

None.

### P1

1. **F005 — Execution identity is split across packet 020, legacy 032, and branch slug 017.** The canonical folder, packet pointer, and metadata identify `sk-doc/020-hyphen-naming-convention` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:15`; SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:46`]. The first executable phase instead passes `032-hyphen-naming` to the allocator while predicting a branch and directory ending in `017-hyphen-naming` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/tasks.md:49`]. Phase 001 then defers “resolve the packet number” until after that worktree phase [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/checklist.md:55`].

### P2

None.

## Claim Adjudication

- Counterevidence sought: all graph IDs and packet pointers consistently use 020, so 032 is not a live path alias. Historical numbering does not explain live allocator input or the unrelated 017 output. Final P1. Downgrade when one identity is fixed before phase 000 and the allocator's actual grammar supplies the branch and directory names.

## Traceability Checks

- `spec_code`: fail — live execution fields contradict canonical packet metadata.
- `checklist_evidence`: fail — the identity decision occurs after the first identity-dependent action.
- Semantic requirement coverage is otherwise present in sampled phase 000 and phase 010 tasks/checklists.
- All 177 graph records are reciprocal and current; 680 Markdown files have no broken explicit relative links.

## Verdict

One new P1 traceability finding.

## Next Dimension

Maintainability — metadata consistency, generated provenance, templates, and operator-facing drift.

Review verdict: CONDITIONAL
