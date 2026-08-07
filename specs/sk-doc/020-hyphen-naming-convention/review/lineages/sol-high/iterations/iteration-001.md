# Deep Review Iteration 001

## Dimension

Correctness — generated topology and parent execution identity.

## Files Reviewed

- `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/spec.md`
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/graph-metadata.json`

## Findings by Severity

### P0

None.

### P1

1. **F001 — The authoritative phase tree is not reproducible from its generator.** The checked-in manifest contains four children under phase 005, including `004-reference-rewrite-executor` [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:104`], but the generator declares only three children [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149`]. A direct replay produced 175 nodes/156 leaves instead of the checked-in 176/157 and removed the executor node. This makes regeneration destructive and invalidates the manifest's provenance contract.

2. **F002 — The root execution contract retains superseded phase identities.** The current map defines phases 000–011 [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134`], while success criteria and risk mitigations still route work through former phases 014, 015, and old meanings for 007/009/011 [SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:168`; SOURCE: `.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:175`]. These are operational statements, not historical notes, so an executor can run the wrong phase or gate.

### P2

None.

## Claim Adjudication

- F001 counterevidence sought: the on-disk phase-005 parent and graph metadata both include the fourth child, confirming the manifest rather than the generator. Alternative explanation rejected: no documented post-process adds the node. Final severity P1; downgrade trigger is a byte-for-byte reproducible generator or an explicit non-generated manifest contract.
- F002 counterevidence sought: the current phase map, handoff table, and graph metadata consistently use 000–011. Alternative explanation rejected: the stale references are phrased as current mitigations and success criteria. Final severity P1; downgrade trigger is conversion to clearly labeled history with current phase destinations.

## Traceability Checks

- `spec_code`: fail — generated and checked-in topology disagree.
- `checklist_evidence`: partial — current leaf checklists exist, but the root routes some verification through obsolete phase identities.
- Overlay protocols: not applicable for this spec-folder pass.

## Search Ledger

- Covered: manifest reproduction, top-level directory parity, graph-child reciprocity, current/stale phase references.
- Ruled out: missing top-level phases, nonreciprocal graph children, malformed manifest JSON.
- Graph status: unavailable; exact filesystem and executable generator replay used.

## Verdict

Two active P1 correctness findings.

## Next Dimension

Security — mutation preconditions, stale-plan replay, and unsafe path operands.

Review verdict: CONDITIONAL
