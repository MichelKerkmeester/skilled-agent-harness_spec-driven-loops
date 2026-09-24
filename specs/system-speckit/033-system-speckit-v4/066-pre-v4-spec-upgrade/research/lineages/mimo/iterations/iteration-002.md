# Iteration 2: Per-rule mechanical-versus-authored classification

## Focus

Classify every residual rule class as mechanically transformable or content-required against its full detail patterns in the two harness data files, and widen the MECH hypothesis where the details show derivable data.

## Findings

1. **F-008 The 20 residual rule classes normalize to bounded pattern families.** A full census of every detail string in both data files shows that most classes are one or two families with instance-specific values. The extreme case is METADATA_DISK_PATH_CONSISTENCY: its 1,235 archived "patterns" are all one family, `<field>=<stored-path> expected=<disk-path>`. GENERATED_METADATA_INTEGRITY splits into six sub-kinds (FILE_MISSING, SPEC_FOLDER_PREFIXED, SOURCE_FINGERPRINT_MISSING, STATUS_NOT_IN_ENUM, STATUS_COMPLETE_EVIDENCE_MISMATCH, SCHEMA_INVALID) and GENERATED_METADATA_DRIFT into two (description, causal_summary). [SOURCE: scratch/harness/data/v3.0.0.0.final.jsonl, scratch/harness/data/v3.6.0.0.pipeline.jsonl, normalized detail census]

2. **F-009 STATUS_CROSS_DOC_CONSISTENCY is token canonicalization, not an evidence contradiction.** Its 274 detail lines form 94 distinct `status=X classified=Y` pairs. 97 lines differ only in case ("Status=Complete classified=complete"). The remainder are vocabulary embellishments of the classified token or evidence-derived classifications ("Not Started" classified=planned, "Draft" classified=planned, "Shipped — HOLD" classified=complete). The rule message itself carries the canonical target token, so the deterministic transform is to store the classified value in the status field. Two superficially similar raw values classify differently ("not-started (authoring step complete; no fixes applied)" classified=complete versus "not-started — findings carried as tasks; no fixes applied" classified=in-progress), so the transform must adopt the rule's classification and never re-derive it. [SOURCE: scratch/harness/data/*.jsonl, STATUS_CROSS_DOC_CONSISTENCY detail pair enumeration]

3. **F-010 The widened transform hypothesis reaches REQ-002 for the active corpora, in three tiers.** Tier M (deterministic transforms only): 138 of 170 (v3.0) and 927 of 1,007 (v3.6) active packets project to a pass. Tier M+T (plus templated stub and boilerplate classes): 143 of 170 and 962 of 1,007. Tier M+T+P (plus a bounded validator-policy layer): 170 of 170 and 1,007 of 1,007. Archived under REQ-004's explicit include: 62 to 99 to 186 (v3.0) and 743 to 796 to 911 (v3.6). Derived twice with independent classification engines; both agree on the M tier and on the full-coverage endpoint. The middle tier is classification-sensitive (which transforms count as safe templating is judgment), so the conservative map is reported. Upper bound caveat: the data truncates details to three per rule. [SOURCE: scratch/harness/data/*.jsonl, widened MECH projection, two derivations]

4. **F-011 The residual policy surface is bounded to four families.** FOLDER_NAMING (56 instances: non-numeric prefixes like 002b-, .backup-timestamp folders, and validator test fixtures whose names are test inputs, e.g. invalid-priority-tags), SPEC_DOC_INTEGRITY unresolvable broken markdown links (about 200 of 295), SPEC_DOC_SUFFICIENCY empty sections and missing-citation findings (about 30 of 170), and GREP_CONVENTION warn-level trigger-quality complaints (the majority of 256). Everything outside these families has a deterministic transform. [SOURCE: scratch/harness/data/*.jsonl, per-class route mapping]

5. **F-012 FILE_EXISTS and LEVEL_MATCH report the same absence twice.** FILE_EXISTS details are bare missing filenames (163 instances) and LEVEL_MATCH's "Required file missing for Level N: FILE" (223 instances) names the same absences at level scope. One stub-provisioning transform clears both classes for the same folder. Cost named: stubs are new files carrying templated provenance text, not historical documents. [SOURCE: scratch/harness/data/*.jsonl, raw FILE_EXISTS and LEVEL_MATCH detail samples]

6. **F-013 Entry status is computed on a different axis than the detail severity label.** validate-all.cjs records only entries with status "error", yet 10 active rows carry GREP_CONVENTION entries whose visible details all read severity=warn (6 at v3.6, 4 at v3.0). A "drop warnings" validator policy therefore cannot clear these rows. What sets the entry status is UNKNOWN until the rule implementation is read; candidate next check: the GREP_CONVENTION aggregator in the orchestrator source. [SOURCE: scratch/harness/validate-all.cjs (failing = entries with status 'error'), scratch/harness/data/*.jsonl warn-only row count]

7. **F-014 Truncation bounds every projection from above, but hides no whole rules.** Zero rows carry a failing rule with an empty detail list, so no failing rule is fully hidden. Rules with more than three details may still hide unclassified patterns inside a classified row. [SOURCE: scratch/harness/data/*.jsonl empty-detail scan]

## Sources Consulted

- scratch/harness/data/v3.0.0.0.final.jsonl and scratch/harness/data/v3.6.0.0.pipeline.jsonl (full detail census, pair enumeration, warn-only scan)
- scratch/harness/validate-all.cjs (failure semantics: failing = error-status entries)
- scratch/harness/classify.cjs (the MECH hypothesis being widened)
- spec.md sections 2 and 10 (question framing)
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs and runtime/scripts/append-mode-event.cjs (state-write contracts, for the deviation note)

## Assessment

- newInfoRatio: 0.7. The per-class verdicts, the three-tier projection and the status-token finding are new to this lineage. The rule inventory and residual baseline are iteration-1 knowledge this iteration refined rather than replaced.
- Questions considered: Q1 (per-rule routes), Q3 (where policy is unavoidable).
- Questions answered: partially Q1. Every one of the 20 classes now has a named route with its cost; Q1 closes when the routes are checked against the harness data at the packet level in synthesis.
- Confidence: projection tiers are DERIVED from OBSERVED counts plus a judgment-labeled class map; F-008, F-009, F-013, F-014 are OBSERVED.

## Reflection

- What worked: normalizing detail strings into pattern families before classifying, so instance-specific values stopped masquerading as distinct problems.
- What failed: my first status-pair regex was case-sensitive and silently matched zero rows; the corrected pass produced F-009's real distribution.
- Ruled out: "warn-severity detail implies a warning entry that strict ignores" (contradicted by F-013); "STATUS_CROSS_DOC_CONSISTENCY needs content judgment" (contradicted by F-009).

## Recommended Next Focus

Iteration 3: validator rule provenance. Read the rule implementations (runtime/lib/validation/orchestrator.ts, spec-doc-structure.ts, generated-metadata-integrity.ts) and their git history to classify each residual rule as a v4 contract addition versus a v3-era defect (Q2), and pin down the entry-status axis behind F-013 and the meaning of the detail-less TEMPLATE_SOURCE message.
