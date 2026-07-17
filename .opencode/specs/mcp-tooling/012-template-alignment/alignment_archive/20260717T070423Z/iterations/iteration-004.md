# Alignment Iteration 004

## Dispatcher

- Resolved route: mode=alignment target_agent=deep-alignment
- Target agent definition loaded: true (`.opencode/agents/deep-alignment.md`)
- Execution: exactly one alignment iteration
- Session: `2026-07-17T06:31:50.774Z`; generation 1; lineage `new`
- Budget profile: `scan` (live adapter plus direct-validator P0 re-probes)

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-mobbin/assets/, .opencode/skills/mcp-tooling/mcp-mobbin/references/, .opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: `{"type":"paths","values":[".opencode/skills/mcp-tooling/mcp-mobbin/assets/",".opencode/skills/mcp-tooling/mcp-mobbin/references/",".opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md"]}`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md` (`asset`)
2. `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md` (`reference`)
3. `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md` (`reference`)
4. `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md` (`reference`)
5. `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md` (`readme`)

## Findings - New

### P0 Findings

1. **Manual asset omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:22` -- The first H2 is `THE REGISTERED MANUAL`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:22]
   - Lane identity: authority `sk-doc`; artifactClass `docs`; scope `.opencode/skills/mcp-tooling/mcp-mobbin/assets/`
   - Adapter fields: type `missing_required_section`; subcheck `template-conformance`; layer `deterministic`
   - Finding class: instance-only
   - Scope proof: `partition-corpus.cjs` included this asset in the dispatched Mobbin docs lane, and the direct validator reproduced the violation only for this artifact instance.
   - Affected surface hints: `Mobbin manual asset`, `sk-doc asset template`
   - reprobeEvidence: `validate_document.py ... --type asset --json` exited 1 with the blocking missing-`overview` result.

2. **Tool-surface reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:25` -- The first H2 is `THE LIVE-DISCOVERED TOOLS`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:25]
   - Lane identity: authority `sk-doc`; artifactClass `docs`; scope `.opencode/skills/mcp-tooling/mcp-mobbin/references/`
   - Adapter fields: type `missing_required_section`; subcheck `template-conformance`; layer `deterministic`
   - Finding class: instance-only
   - Scope proof: `partition-corpus.cjs` included this reference in the dispatched Mobbin docs lane, and the direct validator reproduced the violation only for this artifact instance.
   - Affected surface hints: `Mobbin tool-surface reference`, `sk-doc reference template`
   - reprobeEvidence: `validate_document.py ... --type reference --json` exited 1 with the blocking missing-`overview` result.

3. **Troubleshooting reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md:21` -- The first H2 is `SYMPTOM / CAUSE / FIX`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md:21]
   - Lane identity: authority `sk-doc`; artifactClass `docs`; scope `.opencode/skills/mcp-tooling/mcp-mobbin/references/`
   - Adapter fields: type `missing_required_section`; subcheck `template-conformance`; layer `deterministic`
   - Finding class: instance-only
   - Scope proof: `partition-corpus.cjs` included this reference in the dispatched Mobbin docs lane, and the direct validator reproduced the violation only for this artifact instance.
   - Affected surface hints: `Mobbin troubleshooting reference`, `sk-doc reference template`
   - reprobeEvidence: `validate_document.py ... --type reference --json` exited 1 with the blocking missing-`overview` result.

4. **Scripts README omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md:21` -- The first H2 is `install.sh`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md:21]
   - Lane identity: authority `sk-doc`; artifactClass `docs`; scope `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`
   - Adapter fields: type `missing_required_section`; subcheck `template-conformance`; layer `deterministic`
   - Finding class: instance-only
   - Scope proof: `partition-corpus.cjs` included this README in the dispatched Mobbin docs lane, and the direct validator reproduced the violation only for this artifact instance.
   - Affected surface hints: `Mobbin scripts README`, `sk-doc README template`
   - reprobeEvidence: `validate_document.py ... --type readme --json` exited 1 with the blocking missing-`overview` result.

### P1 Findings

None.

### P2 Findings

1. **Scripts README DQI is below the 75 floor** -- `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md:21` -- The live structure extractor reports DQI 52/100 (`needs_work`), including unnumbered H2s beginning at line 21 and 282 words against its 500-3000 README range. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md:21] [SOURCE: live `extract_structure.py` re-probe, DQI 52/100]
   - Lane identity: authority `sk-doc`; artifactClass `docs`; scope `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`
   - Adapter fields: type `dqi-below-threshold`; subcheck `template-conformance`; layer `deterministic`
   - Finding class: instance-only
   - Scope proof: the live adapter produced this DQI finding only for the scripts README in the five-artifact slice.
   - Affected surface hints: `Mobbin scripts README`, `sk-doc DQI policy`

## Verify-First Evidence

- Ran the live sk-doc adapter against all five artifacts; it returned four P0 findings and one P2 finding after its built-in per-finding suppression pass.
- Re-ran `.opencode/skills/sk-doc/shared/scripts/validate_document.py` directly with explicit document types. The manual asset, tool-surface reference, troubleshooting reference, and scripts README each exited 1 with `missing_required_section: overview`; `mcp-wiring.md` exited 0.
- Re-ran `extract_structure.py` directly for the scripts README; it reported DQI 52/100 (`needs_work`).
- Re-read every artifact's live headings with line numbers before classification. No pattern-only P0/P1 was filed.

## Known-Deviation Suppressions Applied

No finding was suppressed. The `compact-pointer-card-dqi` deviation was evaluated for the README P2 but did not match: suppression requires validator exit 0, while the README validator exited 1. Missing-section P0s are explicitly outside that deviation. No TOC, filename, frontmatter, or changelog candidate was produced.

## Edge Cases

- The reducer-owned findings registry was readable but had not incorporated the prior iteration records (`iterationsRun: 0`); the append-only state log and `partition-corpus.cjs` consistently resolved iteration 004 and this exact slice. The registry was not modified.
- General factual correctness of Mobbin tools, plans, and runtime behavior is outside this sk-doc creation-standard lane. No web verification or remediation was run.
- All five audited artifacts remained read-only.

## Confirmed-Clean Artifacts

- `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md` passed the live validator with no active finding.

## Ruled Out

- No P1 validator warnings: all five validator outputs contained empty warning arrays.
- No DQI findings for the manual asset, `mcp-wiring.md`, `tool-surface.md`, or `troubleshooting.md`: the live adapter returned none for those artifacts.
- No missing-TOC finding: the authority template sets `tocRequired: false` and the dormant known deviation also covers that detector category.
- No compact-pointer suppression for the scripts README because its validator-exit-zero precondition is false.

## Next Focus

`partition-corpus.cjs` returned this Mobbin lane with the five artifacts listed above and `remainingAfterThisSlice: 0`. This is the human-readable echo of the partitioner result: the dispatched lane slice is exhausted after iteration 004; no hand-authored next lane is selected here.
