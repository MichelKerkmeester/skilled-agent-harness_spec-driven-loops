# Alignment Iteration 002

## Dispatcher

- Resolved route: mode=alignment target_agent=deep-alignment
- Target agent definition loaded: true (`.opencode/agents/deep-alignment.md`)
- Execution: exactly one alignment iteration
- Session: `2026-07-17T06:31:50.774Z`; generation 1; lineage `new`
- Budget profile: `scan` (target 9-11 calls)

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/, .opencode/skills/mcp-tooling/mcp-aside-devtools/references/, .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: `{"type":"paths","values":[".opencode/skills/mcp-tooling/mcp-aside-devtools/assets/",".opencode/skills/mcp-tooling/mcp-aside-devtools/references/",".opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md"]}`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md` (`reference`)
2. `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md` (`readme`)

## Findings - New

### P0 Findings

1. **Reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md:21` -- The first H2 is `QUICK DIAGNOSTICS`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. The authority rule requires `overview` for `reference` documents. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md:21] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:264]
   - Finding class: instance-only
   - Scope proof: The artifact is the partitioner-selected reference in this lane's `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/` scope; direct validator execution reproduced the error only for this audited artifact.
   - Affected surface hints: `reference structure`, `overview section`, `sk-doc validator`
   - Claim: The live artifact lacks an H2 section recognized as `overview`.
   - reprobeEvidence: `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md --type reference --json` returned exit 1 with one blocking `missing_required_section` error.
   - matchesLiveReality: true

2. **Scripts README omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md:21` -- The first H2 is `install.sh`; the live sk-doc validator reports `missing_required_section: overview` and exits 1. The authority rule requires `overview` for `readme` documents. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md:21] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:5]
   - Finding class: instance-only
   - Scope proof: The artifact is the partitioner-selected README explicitly named by this lane's path scope; direct validator execution reproduced the error only for this audited artifact.
   - Affected surface hints: `README structure`, `overview section`, `sk-doc validator`
   - Claim: The live artifact lacks an H2 section recognized as `overview`.
   - reprobeEvidence: `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md --type readme --json` returned exit 1 with one blocking `missing_required_section` error.
   - matchesLiveReality: true

### P1 Findings

None.

### P2 Findings

1. **Scripts README DQI is below the 75 floor** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md:21` -- The live structure extractor reports DQI 53/100 (`needs_work`), including unnumbered H2s beginning at line 21 and 307 words against its 500-3000 README range. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md:21] [SOURCE: live `extract_structure.py` re-probe, DQI 53/100]
   - Finding class: instance-only
   - Scope proof: The score was produced directly for the partitioner-selected README in this lane; no sibling artifact was inferred from it.
   - Affected surface hints: `README structure`, `heading format`, `documentation depth`

## Verify-First Evidence

- Re-ran the sk-doc adapter against both artifacts; it returned one P0 for `troubleshooting.md`, and one P0 plus one P2 for `scripts/README.md`.
- Re-ran `validate_document.py` directly with explicit `--type reference` and `--type readme`; both commands exited 1 and independently reproduced the blocking missing-`overview` result.
- Re-ran `extract_structure.py` directly; `troubleshooting.md` scored 95/100 and `scripts/README.md` scored 53/100.
- Re-read both live files with line numbers immediately before classification. No pattern-only P0/P1 was filed.

## Known-Deviation Suppressions Applied

No finding was suppressed. The `compact-pointer-card-dqi` deviation was evaluated for the README P2 but did not match: suppression requires `validate_document.py` exit 0, while the same check exited 1 for a blocking missing `overview` section. The missing-section P0s are explicitly outside that deviation. The dormant TOC deviation produced no candidate finding.

## Edge Cases

- The authority's narrative core-standards table describes README enforcement as flexible, while the machine-readable template and live validator require an overview and emit a blocking error. The adapter contract maps validator blocking errors directly to P0, so this iteration follows the live authority validator and records the tension without inventing a separate finding.
- General factual correctness of Aside commands and URLs was ruled outside this sk-doc creation-standard lane; no external remediation or web verification was run.
- Audited artifacts remained read-only. No remediation was attempted.

## Confirmed-Clean Artifacts

None at whole-artifact level. `troubleshooting.md` is clean for the DQI subcheck (95/100) but retains the active P0 structural finding.

## Ruled Out

- No P1 validator warnings: both validator outputs contained an empty `warnings` array.
- No DQI finding for `troubleshooting.md`: its live score is 95/100.
- No missing-TOC finding for the README: the live template has `tocRequired: false`, consistent with the repo-wide TOC policy.
- No compact-pointer-card suppression for the README DQI finding because the required validator-exit-zero precondition is false.

## Next Focus

`partition-corpus.cjs` returned this lane with the two artifacts listed above and `remainingAfterThisSlice: 0`. This is the human-readable echo of the partitioner result: the dispatched lane slice is exhausted after iteration 002; no hand-authored next lane is selected here.
