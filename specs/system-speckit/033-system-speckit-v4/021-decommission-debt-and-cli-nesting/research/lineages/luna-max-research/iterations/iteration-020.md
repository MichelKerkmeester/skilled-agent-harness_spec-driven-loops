# Iteration 20: Final cross-angle audit

## Focus

Reconcile the remaining named surfaces and the highest-severity findings before
phase_synthesis. This is the required twentieth iteration; convergence telemetry
does not terminate the loop because the configured stop policy is
`max-iterations`.

## Findings

No additional distinct finding was promoted in this final cross-check. The
remaining `mcp-server` references in the bounded active files are either the
separate `system-skill-advisor` owner or already recorded runtime failure
guidance; the sampled active authority files did not expose a new zvec or
system-plugins path beyond the detector-coverage gap in LUNA-058. The unresolved
P1 findings remain open and are carried into synthesis.

## Ruled Out

- The Pi extension's `system-skill-advisor/mcp-server` reference is explicitly an in-process advisor owner, and the root README identifies the advisor as a separate standalone package; it is not the retired system-spec-kit runtime identity. [SOURCE: .pi/extensions/README.md:23-30,67-74] [SOURCE: README.md:304-310]
- The remaining Devin `mcp-server` text is the already-recorded failure guidance attached to the runtime adapter, not a newly discovered registration target. [SOURCE: .devin/hooks.v1.json:2-9,137-149]
- No new active zvec or system-plugins target was found in the exact authority files sampled for this final pass. [INFERENCE: bounded exact-file scan of active authority paths]

## Dead Ends

- Recounting LUNA-058 as a new live hit would duplicate the detector's term-set coverage gap; this iteration keeps it as a synthesis input.
- Reclassifying the explicit convergence threshold as a stop condition would contradict the frozen `max-iterations` policy; the loop is complete only after iteration 20.

## Edge Cases

- A future owner may legitimately use a package path containing `mcp-server`; ownership and caller context must remain part of residue classification.
- Absence from the sampled authority files is not a proof of repository-wide absence; LUNA-058 records why the automated detector cannot provide that proof.

## Questions Remaining

- Q1-Q7 remain partially answered rather than closed: the loop found live residue, test/doc/gate debt, successor gaps, and path-contract failures, while several intentional non-goals and owner boundaries were ruled out.
- Synthesis must preserve confirmed versus inferred labels and the smallest fixes for LUNA-001 through LUNA-059.

## Sources Consulted

- [SOURCE: .pi/extensions/README.md:23-30,67-74]
- [SOURCE: README.md:304-310]
- [SOURCE: .devin/hooks.v1.json:2-9,137-149]
- [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/research/lineages/luna-max-research/deep-research-config.json:3-9,18,37]

## Assessment

- New information ratio: 0.28
- Questions addressed: Q1, Q2, Q3, Q4, Q5, Q6, Q7
- Questions answered: none newly; all seven remain partial/open for synthesis
- Confidence: high for the bounded owner-boundary rulings; medium for the absence claim because this was not a repository-wide sweep

## Reflection

- What worked and why: checking ownership context prevented generic `mcp-server` wording from becoming a duplicate retired-runtime finding.
- What did not work and why: no new evidence crossed the threshold for a distinct finding in the final bounded pass.
- What I would do differently: carry the evidence matrix and the three gate/path false-green findings into synthesis with an explicit stop-policy note.

## Recommended Next Focus

Phase synthesis: emit the lineage-local resource map, compile the full research report and convergence appendix, record the max-iterations stop reason, and preserve the user-mandated skip of spec writeback, validation, and continuity-writer writes outside this lineage.
