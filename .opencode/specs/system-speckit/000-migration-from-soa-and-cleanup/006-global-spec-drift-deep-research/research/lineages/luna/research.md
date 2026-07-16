# Spec Drift and Prior Context-Optimization Efforts

## 1. Research Charter
This lineage investigated spec drift and prior context-optimization efforts across `.opencode/specs/*`, using only cited repository evidence and lineage-local artifacts.

## 2. Executive Summary
Drift is systemic in mechanism but packet-local in manifestation. The recurring mechanisms are split authority across authored and generated surfaces, topology migration, stale status semantics, incomplete correction passes, and weak negative-knowledge capture. Prior work already established effective controls: manifest-backed aliases, phase-local evidence ownership, real corpus re-verification, layered freshness checks, and explicit ruled-out/current surfaces.

## 3. Scope and Method
Ten fresh-context leaf iterations used bounded filesystem search and targeted reads of high-signal packets. The code graph was unavailable because its index was empty, so prevalence claims are qualitative and file-count scans are treated as contaminated by archives, backups, scratch, and fixtures.

## 4. Key Findings
1. Parent packets increasingly separate navigation/aggregate status from child evidence. [SOURCE: `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md:55-60,83-111`]
2. Topology migration uses an explicit alias manifest and migration log; arithmetic path inference is prohibited. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md:64,106-148`]
3. Completion labels are scope-bounded, not proof of current truth. Status classifiers, implementation summaries, generated metadata, and research counts can disagree. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes/implementation-summary.md:59-116`]
4. Prior audits confirm documentation and metadata drift with direct source checks, while explicitly excluding already-current surfaces. [SOURCE: `.opencode/specs/system-code-graph/029-code-graph-doc-audit/review-report.md:10-18,33-45,69-111`]
5. Parent metadata drift can leave graph traversal current while continuity and descriptions are stale. [SOURCE: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-ai-small-model-rename/review/iterations/iteration-005.md:13-21,46-70`]

## 5. Prior Context-Optimization Efforts
The graph/context optimization program coordinated graph, memory, continuity, and operator tooling as themed phase tracks. The small-model optimization arc improved prompt composition but explicitly left runtime reliability patterns as a separate concern. The memory-search program added topology authority, metadata quality, freshness, and drift-remediation work.

## 6. Drift Taxonomy
- Topology drift: historical paths, aliases, moved phases.
- Status drift: labels not recognized or scope-complete claims overread as globally complete.
- Generated-surface drift: graph metadata, continuity, descriptions, and summaries disagree.
- Evidence drift: counts and claims become stale after concurrent edits or later corrections.
- Documentation drift: live behavior diverges from skill/reference documentation.

## 7. Systemic Versus Packet-Local
The mechanisms are systemic because they recur across system-speckit, system-code-graph, sk-prompt, and system-deep-loop. Individual contradictions remain packet-local until a manifest-scoped sweep confirms broader prevalence.

## 8. Controls Already Attempted
Manifest-backed migration authority; phase-local evidence ownership; status classifier and cross-document checks; baseline-aware freshness; evidence-substance validation; second-pass historical correction; direct source re-verification; explicit current/ruled-out recording.

## 9. Control Limitations
Classifier vocabularies can drift when duplicated. Correction passes can leave contradictory lines. Raw counts include non-packet artifacts. Generated metadata refresh can update one surface and miss another. No shared confidence rubric spans all sampled packets.

## 10. Evidence Quality
Strongest evidence is direct source inspection, real validator execution recorded by the packet, explicit correction history, and independent re-verification. Weak evidence is status labels, filename counts, or historical path mentions without authority context.

## 11. Eliminated Alternatives
- Treating every historical path as live drift — rejected by alias-manifest authority.
- Using completion status as current-truth proof — rejected by classifier and metadata drift evidence.
- Using raw corpus file counts as defect counts — rejected by archive/fixture contamination.
- Repeating grep-only passes without a packet denominator — no new evidence after iteration 9.

## 12. Divergence Map
- Investigated topology, status, generated metadata, documentation, evidence freshness, and correction quality.
- No divergent pivot was needed; default convergence reached the hard maximum.
- Remaining frontier: manifest-scoped prevalence, full authority map, and code-graph-backed relationship validation.

## 13. Open Questions
- What is the packet-root denominator after excluding archives, backups, scratch, and fixtures?
- Which generated surface is authoritative for each packet family?
- What is the prevalence of cross-surface metadata disagreement today?

## 14. Recommended Follow-up
Build a manifest-scoped inventory first, then run layered status/evidence/freshness checks and retain explicit negative findings. Do not edit packets from this research result alone.

## 15. Constraints and Gaps
The code graph index was empty. The run did not execute a full validator sweep, write parent specs, or save continuity. Quantitative prevalence is intentionally not claimed.

## 16. Sources
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes/implementation-summary.md`
- `.opencode/specs/system-code-graph/029-code-graph-doc-audit/review-report.md`
- `.opencode/specs/sk-prompt/004-sk-ai-small-model-rename/review/iterations/iteration-005.md`

## 17. Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 3 / 5 (qualitative; remaining questions are quantitative or authority-map gaps)
- Last 3 iteration summaries: run 8 minimum evidence bundle (0.10); run 9 contradiction check (0.06); run 10 final negative-knowledge pass (0.03)
- Convergence threshold: 0.05
- Average newInfoRatio: 0.382
- Quality note: source diversity and focus alignment passed qualitatively; quantitative prevalence remains open.
