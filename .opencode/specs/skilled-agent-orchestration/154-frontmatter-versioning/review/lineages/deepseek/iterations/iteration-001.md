# Iteration 1: Correctness

## Focus
D1 Correctness — verifying the phase-parent spec.md claims against actual child-phase implementation evidence, focusing on scope accuracy, phase map consistency, and continuity metadata integrity.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6 (spec.md, all 5 impl-summaries)
- New findings: P0=0 P1=2 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.70

## Findings

### P1, Required
- **F001**: Parent spec scope estimate (~2,500 in-scope files) overstates actual corpus by ~278 files. The engine computed 2,222 files total (manifest), and the actual versioned corpus is 2,210 + 12 skipped. This discrepancy means the spec's claimed scope is materially wrong — anyone reading the spec would expect ~11% more files than actually exist. `spec.md:74`, `003-apply-core-skill-docs/implementation-summary.md:57`, `004-apply-catalogs-and-playbooks/implementation-summary.md:59`

- **F002**: Parent scope table claims "~436 files" for core skill docs (Phase 003) but Phase 3's implementation delivered 457 versioned + 12 skipped = 469 total core docs — a 33-file (7.5%) undercount. The reader would plan for 33 fewer files than actually exist. `spec.md:103`, `003-apply-core-skill-docs/implementation-summary.md:60`

### P2, Suggestion
- **F003**: Phase-map table in parent spec says "~1,700 per-feature leaves" for Phase 4, but implementation delivered 1,753 catalog + playbook docs. Minor undercount (53 files, ~3%). `spec.md:120`, `004-apply-catalogs-and-playbooks/implementation-summary.md:59`

- **F004**: Continuity block `session_dedup.fingerprint` is a null sha256 (`sha256:0000...0000`), making session deduplication effectively disabled. While this is a phase-parent scaffolding artifact, it persists in the canonical spec.md. `spec.md:27`

- **F005**: Phase-parent `graph-metadata.json` may be stale — the parent has no `last_active_child_id` verification (the pointer field is expected by the Phase Parent Mode spec but wasn't checked against actual child completion status). `graph-metadata.json`

- **F006**: Four SKILL.md files with 3-part versions required manual normalization in Phase 3 (a bug path). The phase map doesn't mention this known pre-existing state, which could mislead anyone tracing forward from the parent spec. `spec.md:116-120`, `003-apply-core-skill-docs/implementation-summary.md:60`

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:74 vs impl-summaries | Scope claims don't match implementation counts |
| checklist_evidence | notApplicable | hard | — | No checklist.md at parent (correct per Phase Parent mode) |

## Assessment
- New findings ratio: 0.70 (2 P1 with weight 10 + 4 P2 with weight 4 = 14, out of max 20, so 0.70)
- Dimensions addressed: correctness
- Novelty justification: All findings are first-time observations — no prior iterations exist to refine against. The scope discrepancy (F001, F002) is non-obvious and requires cross-referencing the parent spec claims against actual implementation counts.

## Ruled Out
- Phase parent "missing checklist.md": Ruled out as a finding — Phase Parent content discipline explicitly forbids checklist.md at the parent level. The spec.md header says `FORBIDDEN: heavy docs: plan.md, tasks.md, checklist.md... belong in child phase folders only`. `spec.md:42-43`

## Claim Adjudication (P1 Findings)

### F001 Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "Parent spec scope estimate of ~2,500 in-scope markdown files overstates the actual corpus by ~278 files.",
  "evidenceRefs": [
    "spec.md:74",
    "003-apply-core-skill-docs/implementation-summary.md:57",
    "004-apply-catalogs-and-playbooks/implementation-summary.md:59",
    "005-verify-and-enforce/implementation-summary.md:57"
  ],
  "counterevidenceSought": "Searched for any manifest CSV or count file listing >2,500 files, checked if the 2,222 manifest excluded any file class listed as in-scope by the spec. The manifest covers all classes: SKILL.md, README.md, references/**, assets/**, feature_catalog/**, testing_playbook/** — no in-scope class is excluded. The spec may have estimated ~2,500 before the actual scan, or ~278 files were culled by exclude patterns not documented in the spec.",
  "alternativeExplanation": "The ~2,500 figure may have been a pre-scan estimate that was never updated after the engine computed the real manifest of 2,222 files. The discrepancy is spec drift, not an implementation omission.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the manifest is confirmed to actually cover 2,500+ files when accounting for additional doc classes (commands, agents, install_guides) that were included in the initial estimate, downgrade to P2 and note the exclusion boundary.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery — spec states ~2,500 but implementation evidence consistently shows 2,222" }
  ]
}
```

### F002 Claim Adjudication
```json
{
  "findingId": "F002",
  "claim": "Core-doc count ~436 in the parent scope table underestimates the actual 469 core docs by 33 files.",
  "evidenceRefs": [
    "spec.md:103",
    "003-apply-core-skill-docs/implementation-summary.md:60"
  ],
  "counterevidenceSought": "Checked if the 457+12 figure includes any docs not in the original ~436 estimate (e.g., if SKILL.md files were counted separately). The impl-summary says 457 versioned + 12 skipped = 469. The pre-existing SKILL.md count is 21 (22 in the table says 22 READMEs), giving 457-21-22=414 refs+assets. ~436 vs 469 is a 33-doc gap; possible that the original estimate excluded certain asset subdirectories.",
  "alternativeExplanation": "The ~436 pre-scan estimate may have used different glob patterns or excluded certain asset file types that were later included. The 7.5% increase is within planning margin but should be corrected in the spec for accuracy.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "If the 33-doc gap is accounted for by docs added AFTER the spec estimate was written (e.g., phase 1 itself created new reference docs), the original estimate was correct when written and this is a stale-documentation P2, not a P1 spec error.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery — spec claims 436 but actual count is 469" }
  ]
}
```

## Dead Ends
- None in this iteration.

## Recommended Next Focus
D2 Security — review the frontmatter-version engine for injection risks (YAML manipulation), secrets exposure via git commands, and trust boundaries between the deterministic engine and LLM-in-the-loop writes. Key files: `sk-doc/scripts/frontmatter-version.mjs`, `sk-doc/scripts/check-frontmatter-versions.sh`.

Review verdict: CONDITIONAL
