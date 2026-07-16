# Iteration 9: Maintainability - template-copy drift

## Dispatcher

- Route: 'mode=review target_agent=deep-review'
- Scope: descendant-spec uniqueness, specificity proxies, and unresolved parent placeholders

## Files Reviewed

- All 175 descendant 'spec.md' files
- Root and component-parent phase maps
- All frontmatter descriptions and placeholder tokens

## Findings - Revalidated

### P0 Findings

None.

### P1 Findings

1. **F005 - Parent execution maps retain unresolved template placeholders (revalidated)** -- '.opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/spec.md:102' -- Beyond the sixteen handoff placeholders recorded in iteration 4, the component parent describes all fourteen children as '[Phase N scope]' [SOURCE: '.opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/spec.md:102-115']; the root likewise uses placeholder scopes for phases 009-011 [SOURCE: '.opencode/specs/sk-doc/032-hyphen-naming-convention/spec.md:220-223']. This broadens F005's template-residue surface without creating a duplicate finding.

~~~json
{"findingId":"F005","type":"traceability","claim":"Current parent phase maps contain placeholder scope text in addition to placeholder handoff criteria, leaving execution routing materially incomplete.","evidenceRefs":[".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/spec.md:102-115",".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/spec.md:124-140",".opencode/specs/sk-doc/032-hyphen-naming-convention/spec.md:220-238"],"counterevidenceSought":"Audited all 175 descendant specs for duplicate content and descriptions; leaf docs are unique, concentrating placeholder drift in parent rollups.","alternativeExplanation":"Parent rows could be navigational only, but their transition rules make these maps the aggregate execution and resume contract.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade when parent maps summarize concrete child scope and bind every handoff to executable evidence."}
~~~

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| 'spec_code' | fail | hard | component parent ':102-140'; root ':220-238' | Parent rollups retain template residue. |
| 'checklist_evidence' | pass | hard | 175 unique specs/descriptions | No exact leaf-document duplication found. |

## Integration Evidence

- All 175 descendant specs have distinct byte hashes and distinct frontmatter descriptions.
- Only one descendant spec contains TBD markers: the component parent already covered by F005.
- No exact duplicate spec clusters were found.

## Confirmed-Clean Surfaces

- Leaf specs are not bulk-identical template copies.
- Description metadata is unique per node.
- 171/175 descendant specs cite explicit repository paths; the four without them are phase parents.

## Ruled Out

- **Exact duplicate leaf specs**: zero duplicate hash groups.
- **Duplicate leaf descriptions**: zero groups.
- **Packet-wide TBD leakage**: isolated to the component parent.

## Next Focus

- Dimension: all
- Focus area: stabilization, active-finding adversarial replay, and terminal coverage accounting
- Required evidence: registry-to-source recheck, no-new-finding search, ten-run invariant, and synthesis readiness

## Assessment

- New findings: P0=0 P1=0 P2=0
- Revalidated findings: F005
- New findings ratio: 0.0
- Status: complete
- Verdict basis: no new finding; F005 surface broadened

Review verdict: CONDITIONAL
