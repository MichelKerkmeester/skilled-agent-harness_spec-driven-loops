# Legacy lane overlap measurement

Both name lists, the confirmed overlap count, the reviewed candidate pairs and one recommendation per lane.

## 1. Counting basis

The unit of comparison is the test name. A CLI line in `scratch/cli-vitest-names.txt` carries `file > suite > name`, so the name is the last ` > ` segment and the file and suite are kept only as provenance.

- **Normalization.** Both sides are lowercased and every character outside `a-z0-9` is removed before two names are compared.
- **Exact match.** A legacy name and a CLI test name are an exact match when their normalized forms are equal. One row is counted per CLI test that matches.
- **Candidate.** A legacy name is a candidate against a CLI name when the two share at least three content tokens of four or more characters. The tokens `test`, `tests`, `with`, `that`, `this`, `from`, `into`, `when`, `then`, `does`, `not`, `for`, `and`, `the` are ignored. Tokens are compared as sets, so a repeated word counts once.
- **Confirmed match.** Every candidate pair is read in both source files and marked `same` or `different`. `same` means the two tests assert the same behaviour, not merely a similar title.
- **Overlap count.** Exact matches plus candidate pairs marked `same`. Nothing else is counted.

## 2. CLI vitest project names

```text
tests/anchor-nesting-severity.vitest.ts > ANCHORS_VALID nesting severity > reports a nested anchor at error severity
tests/calculate-completeness-script.vitest.ts > calculate-completeness.sh > counts unfilled placeholders in a packet and reports partial completion
tests/calculate-completeness-script.vitest.ts > calculate-completeness.sh > fails with a non-zero status when the spec folder does not exist
tests/anchor-repair-sample.vitest.ts > anchor repair corpus sample > dry-runs and applies the repair on the frozen corpus sample of nested questions layouts
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > reports a name closed twice when it is opened once
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > passes a template-compliant packet
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > leaves a never-opened closer to the closed-but-never-opened finding
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > errors when an anchor opens inside another one
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > accepts the decision-record per-ADR nesting
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > reports a non-ADR anchor opened inside a decision record
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > ignores anchors inside a fenced block
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > ignores nested markers quoted inside inline code
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > still reports a real nested pair sharing a line with inline code
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > reports a closer moved above its opener
tests/anchor-contract.vitest.ts > ANCHORS_VALID anchor contract > fails the nested fixture without --strict while the ADR allowance passes
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > builds a session activity signal with tool, git, and transcript boosts
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4)
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > preserves observation decisions when no manual decisions exist
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > rejects structural blocker artifacts and keeps real blocker text
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > prefers the parent spec folder when git-status shows the highest activity there
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > promotes the parent folder when many children are recently active
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > renders filesystem-backed key_files and phase metadata into the saved memory
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > marks tied git-status candidates as low confidence (Priority 2.7 fall-through guard)
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > allows clear git-status winner through Priority 2.7 without falling through
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > marks tied session-activity candidates as low confidence (Priority 3.5 fall-through guard)
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > allows clear session-activity winner through Priority 3.5 without falling through
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > resolves a full .opencode/specs/category/parent/child path via CLI argument
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > resolves a multi-segment child path without prefix via basename fallback
tests/auto-detection-fixes.vitest.ts > phase 013 auto-detection fixes > resolves a bare child folder name via CLI argument child search
tests/alignment-drift-fixture-preservation.vitest.ts > alignment drift malformed fixture preservation > keeps the archived malformed fixture invalid JSON
tests/backfill-frontmatter.vitest.ts > backfill-frontmatter skipped directory handling > records unreadable directories while discovering specs roots
tests/backfill-frontmatter.vitest.ts > backfill-frontmatter skipped directory handling > records unreadable directories while collecting template files
tests/backfill-frontmatter.vitest.ts > backfill-frontmatter skipped directory handling > records unreadable directories while collecting spec files
tests/ascii-boxes.vitest.ts > ascii option boxes > adds a chosen marker to the selected option header
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T39: GAP A detects shared -> runtime/scripts imports across syntax variants
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > parses export-from, import type, and require() forms when checking shared neutrality
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T40: GAP B flags wrappers exceeding 50 substantive lines
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T41: GAP B flags wrappers missing child_process import
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T42: GAP B flags wrappers missing scripts/dist reference
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T43: GAP B catches wrapper bypasses (barrel re-exports and scripts import without spawn/exec)
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T44: legitimate thin wrappers pass GAP B checks
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > reports no violations when the fixture layout satisfies both architecture boundaries
tests/architecture-boundary-enforcement.vitest.ts > Architecture Boundary Enforcement > T45: valid runtime/scripts -> shared imports are not false positives
tests/card-sync.vitest.ts > authoring card sync > keeps the card, the router, the inventory and the checklist in agreement
tests/card-sync.vitest.ts > authoring card sync > passes on an unchanged copy of the skill root
tests/card-sync.vitest.ts > authoring card sync > runs every check after the first failure
tests/card-sync.vitest.ts > authoring card sync > reports a missing router instead of aborting on the first read
tests/card-sync.vitest.ts > authoring card sync > fails when the checklist still sends a reader to the templates root
tests/card-sync.vitest.ts > authoring card sync > fails when the checklist names no example route
tests/card-sync.vitest.ts > authoring card sync > fails when the checklist is missing
tests/card-sync.vitest.ts > authoring card sync > fails when the example route points at a folder that does not exist
tests/card-sync.vitest.ts > authoring card sync > fails when the card no longer names the checklist
tests/card-sync.vitest.ts > authoring card sync > reads every mode of the leaf inventory, not only the last one
tests/card-sync.vitest.ts > authoring card sync > refuses to report success when rg is missing
tests/canonical-sources-auto-discovery.vitest.ts > canonical sources auto-discovery > discovers canonical packet docs with relative links and role labels
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > creates description.json and graph-metadata.json when both are missing
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > creates only the missing file when one metadata artifact already exists
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > leaves existing metadata untouched when both files are already present
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > finds nested iterations directories below research subtrees
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > records directory traversal failures instead of crashing
tests/backfill-research-metadata.vitest.ts > backfill-research-metadata > supports dry-run and empty-research detection without writing files
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > fails when a live packet root has metadata but no root spec
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > fails when a live packet root graph metadata has empty source_docs
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > grandfathers missing save_lineage before the cutoff and fails after it
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > reports packet identity drift as a soft detector
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > reports description/graph freshness skew as a soft detector
tests/canonical-save-validation.vitest.ts > canonical-save validator rollout > passes the canonical-save rule pack on the full 026 tree with the grandfathering window
tests/archive-track.vitest.ts > archive.sh with tracks > archives a track packet into its own track and drops it from the list
tests/archive-track.vitest.ts > archive.sh with tracks > restores a track packet to its track and lists it again
tests/archive-track.vitest.ts > archive.sh with tracks > keeps the root archive for a packet at the specs root
tests/archive-track.vitest.ts > archive.sh with tracks > lists archived packets from every archive with the path that restores them
tests/archive-track.vitest.ts > archive.sh with tracks > leaves a symlinked track out of the list, since its packets cannot be moved from here
tests/archive-track.vitest.ts > archive.sh with tracks > refuses to restore a folder that is in a track but not in its archive
tests/archive-track.vitest.ts > archive.sh with tracks > refuses to restore from a z_archive outside the specs root
tests/archive-track.vitest.ts > archive.sh with tracks > refuses a packet that is already in a track archive
tests/archive-track.vitest.ts > archive.sh with tracks > archives a packet whose track has no graph-metadata.json without a refresh warning
tests/archive-track.vitest.ts > archive.sh with tracks > re-derives the recorded paths at the new location after an archive and a restore
tests/archive-track.vitest.ts > archive.sh with tracks > still archives, and names the repair command, when the re-derive script is missing
tests/archive-track.vitest.ts > archive.sh with tracks > still archives, and says so, when the writer is missing
tests/archive-track.vitest.ts > archive.sh with a linked argument > refuses an argument that is a link, and moves nothing, so no link is left dangling
tests/archive-track.vitest.ts > archive.sh with a linked argument > refuses an argument that reaches its packet through a linked track, before the packet moves
tests/archive-track.vitest.ts > archive.sh with a linked argument > refuses an absolute alias path through a linked track before archiving
tests/archive-track.vitest.ts > archive.sh with a linked argument > refuses a restore that reaches an archived packet through a linked track, and moves nothing
tests/archive-track.vitest.ts > archive.sh with a linked argument > refuses an absolute alias path through a linked track before restoring
tests/archive-track.vitest.ts > archive.sh with a linked argument > archives a plain absolute path under the physical specs root
tests/archive-track.vitest.ts > archive.sh with a linked argument > restores an archived packet through its real path
tests/archive-track.vitest.ts > archive.sh with phases > archives a phase into its parent's own z_archive, restores it there and leaves both lists alone
tests/archive-track.vitest.ts > archive.sh with phases > archives a phase of a packet at the specs root into that packet's archive, without a note when it has no metadata
tests/archive-track.vitest.ts > archive.sh with phases > lists phase archives, and leaves out an archive inside an archive or inside a research copy
tests/archive-track.vitest.ts > archive.sh with phases > refuses to restore from an archive inside an archived packet or a research copy
tests/archive-track.vitest.ts > archive.sh with phases > refuses to archive a numbered folder that is not a packet, track packet or phase
tests/archive-track.vitest.ts > archive.sh with phases > refuses to restore a folder nested below an archived packet
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > archives and restores a sub-track packet through the sub-track archive
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > refreshes the track above a sub-track when its own list is stale
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > archives and restores a phase parent inside a sub-track as one unit
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > never treats an undeclared folder or an archive folder as a packet home
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > lists packets archived inside a sub-track
tests/archive-track.vitest.ts > archive.sh with declared sub-tracks > accepts a sub-track name only directly below the track
tests/archive-track.vitest.ts > archive.sh round trip with the real tools > archives, validates, restores and validates a fixture packet with the real tools
tests/archive-track.vitest.ts > archive.sh round trip with the real tools > re-derives a packet nested in the moved one from its own path
tests/archive-track.vitest.ts > archive.sh round trip with the real tools > re-derives an archived phase with no parent, then its parent packet again on restore
tests/archive-track.vitest.ts > archive.sh round trip with the real tools > reports a re-derive it could not complete and keeps the move that already happened
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a root packet whose z_archive links outside specs, and changes neither side
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses to archive a folder reached through a link that points outside specs, and changes neither side
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a z_archive that links into the packet being archived, and leaves the packet whole
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a z_archive that links to a folder that is not a packet home, and leaves the packet whole
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a z_archive that links into another packet home, and leaves the packet whole
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a track packet whose track z_archive links outside specs, and leaves the track list alone
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a phase whose parent z_archive links outside specs
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses to restore a folder that is reachable only through a link outside specs
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses to restore through a z_archive that links to a folder that is not a packet home
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses to restore through a z_archive that links into another packet home
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses to restore onto a link at the target, and moves nothing
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a restore path with a . segment that reaches a folder through a linked z_archive
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a restore path with a .. segment, and moves nothing
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses an archive path with a . segment, and moves nothing
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses an archive path with a .. segment, and moves nothing
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a dangling z_archive under 'the specs root', moves nothing and creates no link target
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a dangling z_archive under 'a track', moves nothing and creates no link target
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a dangling z_archive under 'a phase parent', moves nothing and creates no link target
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a restore through a dangling z_archive, follows nothing and creates no link target
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses an archive whose target already holds a folder of that name, and changes neither side
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses an archive whose target is a dangling link, and changes neither side
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses a restore whose destination already holds a folder, and changes neither side
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > a declined archive prompt exits 0, says it was cancelled and moves nothing
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses when the specs root is a dangling link, and creates nothing through it
tests/archive-track.vitest.ts > archive.sh keeps every write under the specs root > refuses in a copy outside any repository whose derived root has no specs folder
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment orphan detection (F-020-D5-02) > detects an orphan in dist/tests/** (the subtree previously skipped before F-020-D5-02)
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment orphan detection (F-020-D5-02) > expands DIST_TARGETS beyond the original two roots (lib + scripts)
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment orphan detection (F-020-D5-02) > skips optional/empty dist roots silently rather than failing the build
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment orphan detection (F-020-D5-02) > honors the time-bounded allowlist for known stragglers from F-020-D5-03
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment orphan detection (F-020-D5-02) > confirms the orphan harness.js has been deleted from dist/tests/search-quality (F-020-D5-03)
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment freshness results > fails when dist-freshness reports a stale build
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment freshness results > skips an unprovisioned dist-freshness result
tests/check-source-dist-alignment-orphans.vitest.ts > check-source-dist-alignment freshness results > fails when the freshness check cannot run
tests/backfill-prune-report-gate.vitest.ts > backfill prune report gate > predicts the same retained on-disk children as prune apply
tests/backfill-prune-report-gate.vitest.ts > backfill prune report gate > drops a foreign-identity child on prune exactly as the prediction said
tests/backfill-prune-report-gate.vitest.ts > backfill prune report gate > refuses direct prune without a prior report and writes nothing
tests/backfill-prune-report-gate.vitest.ts > backfill prune report gate > applies reported candidates when the confirmation hash matches
tests/backfill-prune-report-gate.vitest.ts > backfill prune report gate > refuses apply when candidates changed after the report
tests/check-frontmatter-values.vitest.ts > FRONTMATTER_VALUES shell rule > passes canonical values and listed aliases, quoted or not and in any case
tests/check-frontmatter-values.vitest.ts > FRONTMATTER_VALUES shell rule > reads a value that carries a YAML inline comment as the value alone
tests/check-frontmatter-values.vitest.ts > FRONTMATTER_VALUES shell rule > warns, never fails, on a value outside the list and names the canonical values
tests/check-frontmatter-values.vitest.ts > FRONTMATTER_VALUES shell rule > reads only the leading frontmatter block, so a value in the body is ignored
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > passes clean tags and ignores URLs, prose, fences and prompts
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > resolves a citation whose path contains a plus sign
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > stays green on a packet with no tags
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > gives a fresh research lineage with one invented tag exactly one warning
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > names the new path of a moved tag and flags a gone one
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > resolves packet-root citations and uncommitted packet files
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > counts a tag under a gitignored folder once, with or without the file on disk
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > counts a citation under a symlinked directory as not ignored, without a fatal check-ignore
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > still warns as gone for a path outside every ignored folder
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > skips packets created on or before the cutoff
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > falls back to the default cutoff on a malformed override
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > falls back to the default cutoff on a date-shaped day that does not exist
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > resolves a tracked file whose name has a space, end to end
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > reads a spaced path whole by lending the match its lead words
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > splits a tag on commas and keeps each citation its own lead
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > splits a tag on semicolons and strips a backtick from each lead
tests/check-source-tags.vitest.ts > SOURCE_TAGS helper > yields nothing when a tag holds a URL or prose but no path:line
tests/check-source-tags.vitest.ts > SOURCE_TAGS shell rule > warns, never fails, and says a pass proves existence only
tests/check-source-tags.vitest.ts > SOURCE_TAGS shell rule > passes with a message that it checks existence, not support
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > reports a regression when a packet passes at the base and fails at the head
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > reports a pre-existing failure when the same rules fail at the base and the head
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > names only the head rules that the base was not already failing
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > fails closed when the head report does not parse
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > fails closed when the base report does not parse
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > grades a packet whose name holds a space and a non-ASCII letter
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > does not grade a packet copied under a scratch folder
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > still grades a packet whose name only contains the word scratch
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > hostile packet name > prints exactly one error annotation for the packet
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > hostile packet name > escapes the percent, colon and comma characters in the annotation file property
tests/ci-rule-set-comparison.vitest.ts > changed-packet gate rule-set comparison > hostile packet name > keeps the packet name from starting a line the runner reads as a workflow command
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline comparison > reports a first-run failure when no baseline was supplied
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline comparison > reports a regression when a folder passed in the baseline and fails now
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline comparison > reports a known failure when a folder failed in the baseline and still fails
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline fetch > records no baseline when no previous run is found
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline fetch > points BASELINE_REPORT at the downloaded report
tests/ci-rule-set-comparison.vitest.ts > weekly sweep baseline fetch > records no baseline when the downloaded report does not parse
tests/claude-code-native-dispatch-docs.vitest.ts > claude code native dispatch docs > says a subagent inherits the session effort and cites the official page
tests/contamination-filter.vitest.ts > filterContamination severity tracking > reports low severity for preamble-only input
tests/contamination-filter.vitest.ts > filterContamination severity tracking > escalates to high when low and high patterns co-occur
tests/contamination-filter.vitest.ts > filterContamination severity tracking > returns null severity when nothing matches
tests/contamination-filter.vitest.ts > filterContamination severity tracking > exports SEVERITY_RANK with low < medium < high
tests/contamination-filter.vitest.ts > filterContamination severity tracking > reports medium severity for orchestration-only input
tests/contamination-filter.vitest.ts > filterContamination severity tracking > escalates to medium when low and medium patterns co-occur
tests/contamination-filter.vitest.ts > filterContamination severity tracking > cleans git-like subjects containing medium-severity contamination
tests/contamination-filter.vitest.ts > filterContamination severity tracking > catches API Error prefix with status code
tests/contamination-filter.vitest.ts > filterContamination severity tracking > catches JSON error payload
tests/contamination-filter.vitest.ts > filterContamination severity tracking > catches request_id leak in text
tests/contamination-filter.vitest.ts > filterContamination severity tracking > downgrades tool title with path severity for sources whose capabilities expect transcript-style tool titles
tests/contamination-filter.vitest.ts > filterContamination severity tracking > preserves high severity for sources whose capabilities do not expect transcript-style tool titles
tests/contamination-filter.vitest.ts > filterContamination severity tracking > keeps the same downgrade behavior when only captureSource is provided
tests/contamination-filter.vitest.ts > filterContamination severity tracking > falls back to original severity when no source metadata is provided
tests/collect-session-data.vitest.ts > determineSessionStatus > returns BLOCKED when blockers text is present and unresolved
tests/collect-session-data.vitest.ts > determineSessionStatus > returns COMPLETED when the last observation narrative indicates completion
tests/collect-session-data.vitest.ts > determineSessionStatus > returns COMPLETED when an earlier observation indicates completion
tests/collect-session-data.vitest.ts > determineSessionStatus > returns IN_PROGRESS for a short session with no blockers
tests/collect-session-data.vitest.ts > determineSessionStatus > returns IN_PROGRESS when there are enough messages but no completion signal
tests/collect-session-data.vitest.ts > determineSessionStatus > returns COMPLETED when blockers exist but later observations show resolution
tests/collect-session-data.vitest.ts > determineSessionStatus > returns COMPLETED for high-activity sessions with no blockers or pending work
tests/collect-session-data.vitest.ts > determineSessionStatus > returns IN_PROGRESS when next steps were normalized into observations
tests/collect-session-data.vitest.ts > determineSessionStatus > returns COMPLETED when all explicit next steps are marked complete
tests/collect-session-data.vitest.ts > estimateCompletionPercent > returns 100 for a COMPLETED session
tests/collect-session-data.vitest.ts > estimateCompletionPercent > caps at 90 for a BLOCKED session
tests/collect-session-data.vitest.ts > estimateCompletionPercent > returns a positive value for an IN_PROGRESS session with tools and observations
tests/collect-session-data.vitest.ts > estimateCompletionPercent > gives higher completion when write tools dominate
tests/collect-session-data.vitest.ts > estimateCompletionPercent > returns 0 for a minimal IN_PROGRESS session with no messages or tools
tests/content-filter-parity.vitest.ts > content filter multi-cli parity > treats Copilot lifecycle events as built-in noise
tests/content-filter-parity.vitest.ts > content filter multi-cli parity > treats OpenCode reasoning markers as built-in noise
tests/content-filter-parity.vitest.ts > content filter multi-cli parity > treats single-line empty XML wrapper tags as built-in noise
tests/content-filter-parity.vitest.ts > content filter multi-cli parity > exports parity patterns through the shared NOISE_PATTERNS list
tests/content-filter-parity.vitest.ts > content filter multi-cli parity > keeps shared-prefix prompts when their bigram shingles diverge
tests/continuity-freshness.vitest.ts > continuity-freshness > passes when continuity is within the 10-minute freshness budget
tests/continuity-freshness.vitest.ts > continuity-freshness > warns when graph metadata is more than 10 minutes newer than continuity
tests/continuity-freshness.vitest.ts > continuity-freshness > skips cleanly when continuity frontmatter is missing
tests/continuity-freshness.vitest.ts > continuity-freshness > skips cleanly when graph metadata is missing
tests/continuity-freshness.vitest.ts > continuity-freshness > fails with a distinct code when graph metadata is unreadable JSON
tests/continuity-freshness.vitest.ts > continuity-freshness > treats continuity newer than graph metadata as benign clock drift
tests/continuity-freshness.vitest.ts > continuity-freshness > passes as fresh_completion when a completion claim carries a matching fingerprint
tests/continuity-freshness.vitest.ts > continuity-freshness > reports missing_fingerprint as a distinguishable skip, not the timestamp verdict
tests/continuity-freshness.vitest.ts > continuity-freshness > reports zero_fingerprint directly instead of the timestamp verdict (the closed-packet regression)
tests/continuity-freshness.vitest.ts > continuity-freshness > reports a hand-written label in the fingerprint slot as malformed_fingerprint, not as never recorded
tests/continuity-freshness.vitest.ts > continuity-freshness > gates the CLI on SPECKIT_COMPLETION_FRESHNESS while the exported function stays unguarded
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > refuses a repo-relative symlink that points outside the repository
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > refuses a dangling symlink
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > refuses an existing regular file
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > refuses the repository root
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > keeps a symlink whose target stays inside the repository, under the name it was given
tests/create-path-containment.vitest.ts > create.sh --path judges an existing symlink by its target > still creates a new folder that does not exist yet
tests/create-root-numbering.vitest.ts > create.sh numbering at the specs root > gives a second, differently named packet the next number
tests/create-root-numbering.vitest.ts > create.sh numbering at the specs root > numbers after the highest folder already in the root
tests/create-root-numbering.vitest.ts > create.sh numbering at the specs root > numbers after the highest numbered branch
tests/create-root-numbering.vitest.ts > create.sh numbering at the specs root > ignores a branch that only starts with digits, such as a date
tests/create-root-numbering.vitest.ts > create.sh numbering at the specs root > counts a remote-tracking ref it already has and leaves it in place
tests/create-root-numbering.vitest.ts > create.sh numbering of an appended phase > names a phase appended after two others Phase 3
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > replaces the template defaults with the packet slug and description
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > replaces AC template defaults with the slug phrase in Level 2 packets
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > seeds packet-type spec.md phrases from real phase, review and research scaffolds
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > seeds plan, tasks, and implementation-summary defaults with slug phrases
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > turns punctuation in the description into word breaks
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > trims a description that ends on stop words before seeding it
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > pins the description stop words in create.sh to the cleanup tool list
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > pins the template default phrases to their judge sets and shell lists
tests/create-root-numbering.vitest.ts > create.sh seeds trigger phrases > pins seed recipes for every template document kind
tests/create-root-numbering.vitest.ts > heal-spec-docs refills empty trigger phrases > writes the seeder phrases into plan, tasks, and implementation-summary
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses .. before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses ../x before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses ../../escaped before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses a/../../x before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses an absolute path before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses . before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses an empty segment before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > refuses a slash-only value before any folder is made
tests/create-track-containment.vitest.ts > create.sh refuses a --track that leaves specs/ > shows the original track value when refusing a trailing empty segment
tests/create-track-containment.vitest.ts > create.sh keeps every track that stays inside specs/ > creates specs/demo/001-probe for demo
tests/create-track-containment.vitest.ts > create.sh keeps every track that stays inside specs/ > creates specs/demo/sub/001-probe for demo/sub
tests/create-track-containment.vitest.ts > create.sh keeps every track that stays inside specs/ > treats an empty value as no track
tests/create-track-containment.vitest.ts > create.sh keeps every track that stays inside specs/ > honors a track that already exists as a symlink
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > declares the new packet and keeps --json stdout a single payload
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > declares a new phase parent too
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > leaves a track without graph-metadata.json alone
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > warns and still scaffolds when the track metadata cannot be read
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > names the writer when it is missing
tests/create-track-refresh.vitest.ts > create.sh --track refreshes its track root > touches no track when --track is absent
tests/create-track-refresh.vitest.ts > create.sh --path refreshes the track it lands in > declares a packet created by path in its track root
tests/create-track-refresh.vitest.ts > create.sh --path refreshes the track it lands in > leaves the track root alone for a folder nested inside a packet
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > numbers inside the sub-track and declares the packet at both levels
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > normalizes a trailing slash before refreshing both roots
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > seeds missing metadata while scaffolding in the declared sub-track and keeps the sweep clean
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > reports missing sub-track metadata as a pending dry-run change and names --apply as the creation path
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > warns when the sub-track metadata cannot be refreshed and leaves it unchanged
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > refuses an undeclared sub-track before writing a packet
tests/create-track-refresh.vitest.ts > create.sh --track refreshes a declared sub-track and its track > refreshes a flat track when --track has a trailing slash
tests/create-track-refresh.vitest.ts > create.sh refuses sub-track values the reader skips > reports the reader diagnostic when a declared sub-track owns spec.md
tests/create-track-refresh.vitest.ts > create.sh refuses sub-track values the reader skips > refuses a symlinked sub-track before writing through it
tests/create-track-refresh.vitest.ts > create.sh refuses sub-track values the reader skips > refuses a track with three path segments before creating specs/a
tests/create-track-refresh.vitest.ts > create.sh still refuses an invalid --track > refuses a parent segment before any folder is made
tests/create-track-refresh.vitest.ts > create.sh still refuses an invalid --track > refuses an absolute path before any folder is made
tests/create-track-refresh.vitest.ts > create.sh still refuses an invalid --track > refuses an empty segment before any folder is made
tests/create-track-refresh.vitest.ts > create.sh lists recent sibling packets > names a recent packet on stderr and keeps --json stdout parseable
tests/create-track-refresh.vitest.ts > create.sh lists recent sibling packets > names nothing when a phase child is appended to an existing parent
tests/create-track-refresh.vitest.ts > create.sh lists recent sibling packets > leaves out a packet older than the 14-day window
tests/create-track-refresh.vitest.ts > create.sh lists recent sibling packets > strips terminal control characters from a recent packet description
tests/create-track-refresh.vitest.ts > create.sh lists recent sibling packets > lists nothing for a versioned sub-folder run in an existing packet
tests/create-unknown-options.vitest.ts > create.sh option parsing > rejects an unknown option and writes nothing
tests/create-unknown-options.vitest.ts > create.sh option parsing > rejects a lone dash and writes nothing
tests/create-unknown-options.vitest.ts > create.sh option parsing > still writes goal.md for --with-goal
tests/create-without-build.vitest.ts > create.sh without a build > scaffolds a Level 2 packet and names the generated files it could not write
tests/create-without-build.vitest.ts > create.sh without a build > stops a phase parent that cannot get its description.json
tests/create-without-build.vitest.ts > create.sh without a build > reports the skip for a phase appended to an existing parent
tests/daemon-detect.vitest.ts > isProcessAlive > reports a live pid as alive
tests/daemon-detect.vitest.ts > isProcessAlive > reports a reaped pid as not alive
tests/daemon-detect.vitest.ts > isProcessAlive > rejects non-positive and non-integer pids without throwing
tests/daemon-detect.vitest.ts > spec-memory launcher lease detection > exposes no launcher-lease surface
tests/decision-confidence.vitest.ts > decision confidence calibration > keeps choice confidence modest when only alternatives are present
tests/decision-confidence.vitest.ts > decision confidence calibration > produces stronger choice confidence than rationale confidence when only the choice is explicit
tests/decision-confidence.vitest.ts > decision confidence calibration > produces stronger rationale confidence when the choice remains implicit
tests/decision-confidence.vitest.ts > decision confidence calibration > raises rationale confidence when rationale, tradeoffs, and evidence are present
tests/decision-confidence.vitest.ts > decision confidence calibration > maps explicit single confidence overrides to both new fields
tests/decision-confidence.vitest.ts > decision confidence calibration > clamps explicit confidence overrides into the normalized range
tests/decision-record-writer.vitest.ts > writeDecisionRecord > creates the record beside a level-marked spec and keeps the detected level
tests/decision-record-writer.vitest.ts > writeDecisionRecord > reads a bare decision record in a markerless packet as level 3
tests/decision-record-writer.vitest.ts > writeDecisionRecord > adds the level marker before creating the record so the level does not move
tests/decision-record-writer.vitest.ts > writeDecisionRecord > refuses to create a record without a spec and writes nothing
tests/decision-record-writer.vitest.ts > writeDecisionRecord > leaves the record byte-identical when the same entries are written twice
tests/decision-record-writer.vitest.ts > writeDecisionRecord > adds Q004 to a hand-written record without moving a byte before the new row
tests/decision-record-writer.vitest.ts > writeDecisionRecord > replaces the row for a known source key and leaves the appendix alone
tests/decision-record-writer.vitest.ts > writeDecisionRecord > replaces a same-key appendix item when the answer changes
tests/decision-record-writer.vitest.ts > writeDecisionRecord > keeps a repeated changed answer byte-identical
tests/decision-record-writer.vitest.ts > writeDecisionRecord > leaves another source key appendix item untouched when one answer changes
tests/decision-record-writer.vitest.ts > writeDecisionRecord > round-trips fenced questions, piped options and multi-line answers exactly
tests/decision-record-writer.vitest.ts > writeDecisionRecord > treats heading and anchor lines inside a fenced answer as text
tests/decision-record-writer.vitest.ts > writeDecisionRecord > fills the empty cells and escapes a pipe in the decision
tests/decision-record-writer.vitest.ts > writeDecisionRecord > inserts the first row right after the separator of an empty template table
tests/decision-record-writer.vitest.ts > writeDecisionRecord with hand-written rows > reuses the id of a plain-label hand-written item whose question and answer match
tests/decision-record-writer.vitest.ts > writeDecisionRecord with hand-written rows > reuses the id of a hand-written item with bolded labels
tests/decision-record-writer.vitest.ts > writeDecisionRecord with hand-written rows > reuses the id of a hand-written item with indented labels
tests/decision-record-writer.vitest.ts > writeDecisionRecord with hand-written rows > gives a new id when only the question of a hand-written item matches
tests/decision-record-writer.vitest.ts > recordConsumedKeys > records each source key once across repeated saves
tests/decision-record-writer.vitest.ts > recordConsumedKeys > matches capture-core paths for git roots, subfolders, symlinks and non-git folders
tests/decision-record-writer.vitest.ts > recordConsumedKeys > reads legacy consumed rows, skips their keys and leaves the legacy log unchanged
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > keeps primary docs aligned on canonical artifacts and the machine-readable capability source
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > keeps runtime mirrors aligned on reducer-owned boundaries
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > keeps command assets aligned on reducer execution and lifecycle controls
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > records manual stop before confirm-mode synthesis
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > never eagerly creates the archive root at init and archives lazily on restart (121/006)
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > uses the same canonical agent_file path in both auto and confirm YAMLs
tests/deep-research-contract-parity.vitest.ts > deep-research contract parity > exposes a machine-readable capability matrix for every supported runtime surface
tests/decision-table-matcher.vitest.ts > decision table matcher > parses every qualifying table and keeps escaped pipes inside cells
tests/decision-table-matcher.vitest.ts > decision table matcher > normalizes quotes, recommendation notes, line breaks, and whitespace
tests/decision-table-matcher.vitest.ts > decision table matcher > matches an answer whose queue line break is shown as a slash in the table
tests/decision-table-matcher.vitest.ts > decision table matcher > scores the same UTC day as matching date evidence
tests/decision-table-matcher.vitest.ts > decision table matcher > matches a shortened table option when the answer and other evidence agree
tests/decision-table-matcher.vitest.ts > decision table matcher > refuses a tie between rows with the same answer and near-identical topics
tests/decision-table-matcher.vitest.ts > decision table matcher > refuses a passing row when another answer-gated row is just below threshold
tests/decision-table-matcher.vitest.ts > decision table matcher > keeps records pending when the answer gate has no row
tests/decision-table-matcher.vitest.ts > decision table matcher > keeps an answer-gated row pending when its score is below threshold
tests/decision-table-matcher.vitest.ts > decision table matcher > refuses a row consumed by another key with a different recorded answer
tests/decision-table-matcher.vitest.ts > decision table matcher > lets the earlier queue record claim a row only once in the same run
tests/decision-table-matcher.vitest.ts > decision table matcher > returns identical results on rerun and on a fresh consumed-row list
tests/decision-table-matcher.vitest.ts > decision table matcher > prints the required summary counts
tests/deep-research-reducer.vitest.ts > deep-research reducer > writes idempotent registry, strategy, and dashboard outputs from iteration state
tests/deep-research-reducer.vitest.ts > deep-research reducer > DR-003: computes uncoveredQuestions from strategy questions minus answered union
tests/deep-research-reducer.vitest.ts > deep-research reducer > DR-003: reports no uncoveredQuestions when all strategy questions are answered
tests/deep-research-reducer.vitest.ts > deep-research reducer > resolves questions from iteration context and renders the canonical iteration number
tests/deep-research-reducer.vitest.ts > deep-research reducer > derives next focus from the latest answer when no carried-forward question is present
tests/deep-research-reducer.vitest.ts > deep-research reducer > falls back to the first strategy question when no answer can seed next focus
tests/deep-research-reducer.vitest.ts > deep-research reducer > keeps blocked-stop recovery ahead of derived next focus
tests/deep-research-reducer.vitest.ts > deep-research reducer > DR-005: deduplicates ruled-out directions by content hash while preserving first seen iteration
tests/deep-research-reducer.vitest.ts > deep-research reducer > prefers the latest lifecycle lineage and latest active synthesis_complete stop state
tests/deep-research-reducer.vitest.ts > deep-research reducer > T241: handles JSONL with parseable but schema-corrupt iteration entries
tests/deep-research-reducer.vitest.ts > deep-research reducer > T241: handles iteration with convergenceSignals as corrupt object
tests/deep-research-reducer.vitest.ts > deep-research reducer > T241: handles empty type field in JSONL entry
tests/deep-research-reducer.vitest.ts > deep-research reducer > DR-006: sorts unpadded iteration files numerically
tests/deep-review-auto-restart-contract.vitest.ts > deep-review auto restart command contract > exposes restart as a first-class auto setup input
tests/deep-review-auto-restart-contract.vitest.ts > deep-review auto restart command contract > applies restart before fan-out can spawn lineages
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > keeps primary deep-review docs aligned on canonical artifacts and lifecycle terms
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > keeps all runtime mirrors aligned on lifecycle and reducer boundaries
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > keeps command assets aligned on lifecycle controls and dual-read single-write migration
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > never eagerly creates the archive root at init and archives lazily on restart (121/006)
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > keeps the generated review contract aligned on artifact_dir semantics
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > uses the same canonical agent_file path in both auto and confirm YAMLs
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > command doc dimension list matches the supported dimension taxonomy
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > seeds review graph coverage from canonical dimensions/filesReviewed without gating on graphEvents, and both YAMLs agree
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > exposes a machine-readable capability matrix for every supported deep-review runtime
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > resolves individual deep-review runtime capabilities by ID
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > throws for unknown deep-review runtime IDs
tests/deep-review-contract-parity.vitest.ts > deep-review contract parity > keeps authoredArtifacts docs mentioning the manifest enum ids declared in their enumParityChecked
tests/deep-review-reducer-schema.vitest.ts > deep-review reducer and schema contract > keeps reducer, severity, and release-readiness schemas stable in the canonical assets
tests/deep-review-reducer-schema.vitest.ts > deep-review reducer and schema contract > wires reducer refresh and machine-owned report guidance into both review workflows
tests/deep-review-reducer-schema.vitest.ts > deep-review reducer and schema contract > documents reducer metrics and machine-owned report boundaries in the review references
tests/description-enrichment.vitest.ts > description enrichment > classifies placeholder stub patterns through the shared validator
tests/description-enrichment.vitest.ts > description enrichment > distinguishes activity-only, semantic, and high-confidence descriptions
tests/description-enrichment.vitest.ts > description enrichment > preserves git-derived modification magnitude and defaults non-git entries to unknown
tests/description-enrichment.vitest.ts > description enrichment > derives modification magnitude from change score, action, and commit-touch counts
tests/dist-freshness-walker.vitest.ts > scripts package sources > does not count the retrieval generator fixtures as sources
tests/dist-freshness-walker.vitest.ts > collectSourceFiles and symlinks > collects regular sources under the root
tests/dist-freshness-walker.vitest.ts > collectSourceFiles and symlinks > does not descend into a symlinked directory
tests/dist-freshness-walker.vitest.ts > collectSourceFiles and symlinks > skips a dangling symlink instead of throwing
tests/distinguishing-evidence-dedup.vitest.ts > distinguishing evidence deduplication > deduplicates repeated bullets and prefers file-line anchored evidence
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > repairs a Draft packet whose only errors are stale derived metadata in one run, and names the file
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > keeps stdout to one parseable report under --json and sends the notice to stderr
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > keeps stdout to one RESULT line under --quiet
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when the switch is 0, though the packet would qualify
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when the switch is false, though the packet would qualify
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when the switch is off, though the packet would qualify
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when CI is set
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when the status is In Progress
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when a content error sits beside the derived ones
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > writes nothing when validateFolder is called as a library on a qualifying packet
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > refuses on the status alone, the switch and CI, given a derived-only report
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > refuses a narrowed rule set and a run without --strict, given a derived-only report
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > keeps the first report, the repair hint and exit 2 when the repair child fails
tests/draft-auto-repair.vitest.ts > Draft auto-repair in the validate CLI > judges each child of a --recursive parent on its own status
tests/draft-auto-repair.vitest.ts > repair-derived.cjs dry run > leaves a qualifying Draft packet byte for byte as it was without --apply
tests/evidence-marker-audit.vitest.ts > parseMarkers: simple cases > classifies a simple closed marker as OK
tests/evidence-marker-audit.vitest.ts > parseMarkers: simple cases > classifies a marker with parens in content closed with `]` as OK
tests/evidence-marker-audit.vitest.ts > parseMarkers: simple cases > classifies a marker closed with `)` as malformed
tests/evidence-marker-audit.vitest.ts > parseMarkers: simple cases > classifies the classic 016 pattern `[EVIDENCE: hash — description)` as malformed
tests/evidence-marker-audit.vitest.ts > parseMarkers: simple cases > classifies a trailing `(verified)]` as OK false-positive-safe
tests/evidence-marker-audit.vitest.ts > parseMarkers: code contexts > skips markers inside inline backtick spans
tests/evidence-marker-audit.vitest.ts > parseMarkers: code contexts > skips markers inside fenced code blocks
tests/evidence-marker-audit.vitest.ts > parseMarkers: code contexts > still captures markers OUTSIDE a fenced block on the same file
tests/evidence-marker-audit.vitest.ts > parseMarkers: code contexts > handles backtick spans that close at end-of-line
tests/evidence-marker-audit.vitest.ts > parseMarkers: nested and multi-marker > handles nested `[brackets]` in marker content
tests/evidence-marker-audit.vitest.ts > parseMarkers: nested and multi-marker > handles multiple markers on the same line
tests/evidence-marker-audit.vitest.ts > parseMarkers: nested and multi-marker > treats paren-in-content with trailing `)` closer as malformed, not OK
tests/evidence-marker-audit.vitest.ts > parseMarkers: multi-line > marks a marker that crosses newline without closing as malformed when last char is `)`
tests/evidence-marker-audit.vitest.ts > parseMarkers: multi-line > marks a marker that trails off with no closer as unclosed
tests/evidence-marker-audit.vitest.ts > parseMarkers: multi-line > handles EOF while inside marker
tests/evidence-marker-audit.vitest.ts > auditFile + auditFolder rewrap > rewraps only the malformed `)` closers, preserves content parens
tests/evidence-marker-audit.vitest.ts > auditFile + auditFolder rewrap > does not rewrap `unclosed` markers (manual review required)
tests/evidence-marker-audit.vitest.ts > auditFile + auditFolder rewrap > scans nested subfolders and collects all markers
tests/evidence-marker-audit.vitest.ts > auditFile + auditFolder rewrap > auditFile returns per-file marker list
tests/fact-coercion.vitest.ts > coerceFactToText > passes a string through and reports its source shape
tests/fact-coercion.vitest.ts > coerceFactToText > drops a nullish value with a named reason instead of an empty string
tests/fact-coercion.vitest.ts > coerceFactsToText > keeps only the facts that coerce to non-empty text
tests/example-drift.vitest.ts > example drift guard > passes on the shipped examples
tests/example-drift.vitest.ts > example drift guard > fails when an example loses a required anchor
tests/example-drift.vitest.ts > example drift guard > fails when an example moves a section out of template order
tests/example-drift.vitest.ts > example drift guard > fails when a level has no example
tests/example-drift.vitest.ts > example drift guard > fails when a level folder is empty
tests/example-drift.vitest.ts > example drift guard > refuses to report success when rg is missing
tests/file-capture-structured-mode.vitest.ts > file capture structured mode > uses structured filesModified payloads to populate all frontmatter file counts
tests/file-capture-structured-mode.vitest.ts > file capture structured mode > falls back to git status when no explicit file list is provided
tests/frontmatter-template-literals.vitest.ts > frontmatter template literals > derives a missing description from the body after frontmatter
tests/frontmatter-template-literals.vitest.ts > frontmatter template literals > skips a retained frontmatter block before the body
tests/frontmatter-template-literals.vitest.ts > frontmatter template literals > reads the template again in a fresh run instead of a value an earlier run cached
tests/frontmatter-template-literals.vitest.ts > frontmatter template literals > re-reads a template that changed on disk within the same module instance
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > exposes a stable schema version
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > exposes the five categorical groups via GATE_3_VOCABULARY
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > every file-write trigger is a single token (not a phrase)
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > every memory-save and resume trigger is a phrase
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > read-only disqualifiers include analyze/review/audit/inspect/explain
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — vocabulary invariants > file-write list does NOT include analyze/decompose/phase (false-positive tokens)
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > lowercases and collapses whitespace
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > applies NFKC and strips soft hyphen / zero-width characters before matching
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > folds adversarial Unicode confusables into ASCII-safe normalized prompts
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > does not over-fold plain ASCII control inputs
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — normalization > tokenizes while preserving /, :, - and _
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — matchesEntry > matches a token only as a standalone word
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — matchesEntry > does NOT match a token that is a substring of another word
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — matchesEntry > matches a phrase as a substring of the normalized prompt
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 for "implement the feature"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 for "rename the helper"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 for "fix the bug"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 when soft hyphen hides a file-write token
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 when zero-width space hides a file-write token
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — positive matches (T-DOC-02) > triggers Gate 3 when soft hyphen and zero-width space appear together
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > does NOT trigger Gate 3 for "analyze the phase transition"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > does NOT trigger Gate 3 for "review the decomposition phase"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > does NOT trigger Gate 3 for "audit the synthesis phase"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > suppresses Gate 3 when "review" co-occurs with a file-write verb
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > recovers mixed read-only prompts with an explicit write tail
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > recovers mixed write and read-only verbs in either order
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > keeps standalone read-only prompts suppressed
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > does not treat write words in read-only descriptions as write instructions
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — read-only disqualifiers (T-DOC-02) > does NOT suppress Gate 3 for a save-memory trigger even with "review"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "save context"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "save memory"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "/memory:save"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "/speckit:resume"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "resume deep research"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > treats a standalone resume invocation as a Gate 3 trigger
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > keeps read-only questions about resume suppressed
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for "continue iteration"
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for broader resume/context continuity markers
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for direct speckit deep-research command prompts
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for direct speckit deep-review command prompts
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > triggers Gate 3 for deep-loop natural-language markers
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — save/resume/continue (T-DOC-03) > only treats :auto as deep-loop write marker when paired with speckit
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > does NOT trigger Gate 3 for pure greetings
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > does NOT trigger Gate 3 for pure question prompts
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > does NOT trigger Gate 3 for "show me" reads
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > keeps historical false-positive tokens read-only when no write tail exists
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > does NOT trigger Gate 3 for prompt-only generation in chat
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > does NOT trigger Gate 3 for read-only deep-loop references
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > confusable-folds Cyrillic homoglyphs into a file-write token
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > confusable-folds Greek epsilon into a file-write token
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — negative baselines > accent-folds Latin characters into a file-write token
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > keeps no-options triggering prompts backward compatible while surfacing prompt state
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > satisfies an autonomous triggered prompt with a valid pre-bound spec folder
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > does not satisfy an autonomous triggered prompt without a bound spec folder
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > keeps an interactive write prompt gated without a prior answer
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > keeps read-only research ungated even when options are present
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > satisfies an interactive prior answer after validating the bound folder
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > does not treat an interactive pre-bound confirm marker as a prior answer
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > satisfies an autonomous :confirm prompt when the bound folder and contract are valid
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > keeps child-agent re-classification satisfied when the contract is propagated
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > does not trust caller-supplied validation for an out-of-tree flags path
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > requires a non-empty autonomous write boundary
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > rejects an ambiguous target-path binding with more than one candidate
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > rejects metadata-missing and deprecated spec-folder bindings
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > resolves a bare phase parent to last_active_child_id when available
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — satisfaction and spec-folder binding validation > rejects a bare phase parent when no last_active_child_id is available
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — workspace root under either source-root name > skilled-only: validates a binding from a start inside the source tree against the repository root
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — workspace root under either source-root name > whole-link: validates a binding from a start inside the source tree against the repository root
tests/gate-3-classifier.vitest.ts > Gate 3 classifier — JSON snapshot > emits a structurally valid snapshot
tests/gate1-pointer-sync.vitest.ts > sync-gate1-pointers.cjs > reports drift before the blocks exist, writes them, then reports a clean tree
tests/gate1-pointer-sync.vitest.ts > sync-gate1-pointers.cjs > reports drift when a pointer block is edited by hand and is idempotent when rewritten
tests/gate1-pointer-sync.vitest.ts > sync-gate1-pointers.cjs > follows the root line when it changes
tests/gate1-pointer-sync.vitest.ts > sync-gate1-pointers.cjs > exits 2 when the root AGENTS.md carries no Gate 1 line
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > passes JSON-mode data and explicit CLI spec-folder override through main()
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > rejects the runtime-repository fallback before writing when cwd is outside a spec-kit repository
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > keeps save behavior when cwd is inside a spec-kit repository
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > forwards explicit --session-id to workflow
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > passes stdin JSON as preloaded collectedData and preserves an explicit CLI spec-folder override
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > passes inline JSON as preloaded collectedData using the payload spec folder when no explicit override is present
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > keeps target resolution and collectedData shape identical between --stdin and --json for the same payload
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > allows an empty JSON object through to workflow when an explicit CLI target is present
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > forwards explicit --full-auto to workflow without weakening CLI target authority
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > exits non-zero on malformed inline JSON before calling runWorkflow
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > exits non-zero when stdin/json mode has no explicit or payload target spec folder
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > exits non-zero when stdin/json mode resolves an invalid explicit target spec folder
tests/generate-context-cli-authority.vitest.ts > generate-context CLI authority > does not accumulate SIGINT or SIGTERM handlers across repeated module imports
tests/generate-context-help.vitest.ts > generate-context --help planner mode copy > states that only full-auto writes continuity fields
tests/generate-context-help.vitest.ts > generate-context --runtime > documents the runtime flag, every slug and the continuity pointer in help
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug claude
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug codex
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug opencode
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug pi
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug devin
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug dsh
tests/generate-context-help.vitest.ts > generate-context --runtime > accepts the known runtime slug cursor
tests/generate-context-help.vitest.ts > generate-context --runtime > rejects an unknown runtime through the argument-error path
tests/generate-context-help.vitest.ts > generate-context --runtime > rejects a missing runtime value
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > does not reap an aged lock owned by a live pid
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > reaps an aged lock owned by a dead pid
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > reaps an aged lock whose owner file is missing (unknown + stale)
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > refuses an unknown-owner lock that is still within the stale window
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > writes the owner record without leaving a temp artifact behind
tests/generate-context-save-lock.vitest.ts > generate-context canonical save lock > refreshes lock directory mtime while held
tests/generate-description-identity-safety.vitest.ts > generate-description explicit identity safety > restores caller-base identity when the safety flag is disabled
tests/generate-description-identity-safety.vitest.ts > generate-description explicit identity safety > uses specs-root identity when the safety flag is enabled
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > derives both fields from one precedence over the same source doc with field-specific limits
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > moves both fields together when the source doc flips
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > falls back through the precedence to the title heading when there is no Overview or Problem body
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > does not cut an over-limit synopsis mid-word
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > preserves an over-limit synopsis when the cut lands on a word boundary
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > ends a long first sentence in a v2.3 spec at its last clause boundary within the limit
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > keeps the word-boundary cut for a v2.2 spec
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > falls back to a word boundary when the only clause boundary would leave a stub
tests/generated-metadata-drift.vitest.ts > shared synopsis extractor (REQ-004, SC-003) > passes shorter synopsis strings through unchanged
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > computes a hash per present source doc and a doc edit changes it
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > persists source_doc_hashes on the derived metadata only when the flag is on
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > skips a spec.md that is a link to content outside the packet, as it skips a missing doc
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > hashes a spec.md link whose content stays inside the packet
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > skips research reached through a directory link that leaves the packet
tests/generated-metadata-drift.vitest.ts > source_doc_hashes freshness key (REQ-003, SC-004) > hashes research reached through a directory link that stays inside the packet
tests/generated-metadata-drift.vitest.ts > drift detection (REQ-002, SC-002) > reports drift when a doc changed after the stored synopsis
tests/generated-metadata-drift.vitest.ts > drift detection (REQ-002, SC-002) > reports no drift for an in-sync folder
tests/generated-metadata-drift.vitest.ts > drift detection (REQ-002, SC-002) > reports an empty derivation rather than drift when there is no source doc
tests/generated-metadata-drift.vitest.ts > no-write guarantee (REQ-005) > leaves the folder bytes unchanged across a drift check
tests/generated-metadata-drift.vitest.ts > grandfather report mode vs enforced verdict (REQ-001, SC-001) > maps drift to a non-blocking info under grandfather mode and a blocking error when enforced
tests/generated-metadata-drift.vitest.ts > grandfather report mode vs enforced verdict (REQ-001, SC-001) > passes a clean folder in both modes
tests/graph-key-file-declarations.vitest.ts > derived key files > keeps a declared bare filename that resolves to a real file
tests/graph-key-file-declarations.vitest.ts > derived key files > keeps a declared file that has no extension
tests/graph-key-file-declarations.vitest.ts > derived key files > drops a declared entry that resolves to nothing
tests/graph-key-file-declarations.vitest.ts > derived key files > does not promote a bare filename that only appears in prose
tests/graph-key-file-declarations.vitest.ts > derived key files > resolves a repository-relative declaration from a packet at the specs root
tests/graph-key-file-declarations.vitest.ts > derived key files > puts the packet's own documents first, since the list is capped
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > includes archived and future folders by default during dry-run traversal
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > skips archived packets only when active-only behavior is requested explicitly
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > rolls an all-complete phase parent to complete
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > rolls a mixed phase parent to in_progress
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > leaves a packet without graph-metadata children unchanged
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill > preserves an existing last_active_child_id during phase-parent rollup
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill exit status > exits 0 when every folder is read cleanly
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill exit status > exits 1 and names the folder when one graph file is corrupt
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill exit status > reports a folder whose write is refused as failed and not as changed
tests/graph-metadata-backfill.vitest.ts > graph metadata backfill exit status > refuses a root outside the repository and writes no graph metadata under it
tests/graph-metadata-backfill.vitest.ts > prune report destination > refuses a destination that is a symbolic link and leaves the link target untouched
tests/graph-metadata-backfill.vitest.ts > prune report destination > refuses a temporary name that already exists and leaves that file untouched
tests/graph-metadata-backfill.vitest.ts > prune report destination > replaces a link planted after the check instead of writing through it
tests/graph-metadata-backfill.vitest.ts > prune report destination > refuses a dangling link at the report name and keeps the link in place
tests/graph-metadata-backfill.vitest.ts > prune report destination > writes the prune report on apply at its fixed name, with the hash the summary returns
tests/graph-metadata-backfill.vitest.ts > prune report destination > refuses a report root with no .opencode anchor and writes no report there
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > derives a declared sub-track parent and keeps a phase child parent
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > derives no sub-track parent from a differently cased level or an archive folder
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > refreshes a graph-metadata.json file from canonical docs and preserves manual fields
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > preserves a curated status and chronology pointer on a lean phase-parent re-derive
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > does not rewrite graph-metadata.json when a re-derive yields no content delta
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > still rewrites when a real content change accompanies the re-derive
tests/graph-metadata-refresh.vitest.ts > graph metadata refresh path > drops persisted children whose leading identity is not the packet's own on refresh
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > ships a fixture directory for every expected case
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture missing > reports exactly one missing row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture malformed-or-unclosed > reports exactly one malformed-or-unclosed row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture non-yaml > reports exactly one non-yaml row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture wrong-list-type > reports exactly one wrong-list-type row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture non-string-members > reports exactly one non-string-members row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture oversized > reports exactly one oversized row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture duplicate > reports exactly one duplicate row
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > variant fixture valid-empty > reports no rows
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture alias-hit > reports exactly one alias-hit row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture generic-trigger > reports exactly one generic-trigger row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture 900-folder-token-fallback > reports exactly one generic-trigger row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture anchor-unmatched > reports exactly one anchor-unmatched row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture anchor-duplicate > reports exactly one anchor-duplicate row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > cross-cutting fixture naming-exception > reports exactly one naming-exception row at severity warn
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > populates path, line, category and reason on every diagnostic
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > stages every category at its decided severity
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > derives rule status from the severities of its rows
tests/grep-convention-rule.vitest.ts > GREP_CONVENTION rule > reports zero rows on the conforming fixture
tests/grep-convention.vitest.ts > variant classifier > resolves each of the eight fixtures to its own label
tests/grep-convention.vitest.ts > variant classifier > covers every label exactly once, so the eight partition the corpus
tests/grep-convention.vitest.ts > variant classifier > separates a document with no block from one whose block lacks the key
tests/grep-convention.vitest.ts > variant classifier > labels a well-formed populated list conforming, sub-counted apart from an empty one
tests/grep-convention.vitest.ts > variant classifier > treats a list past the member ceiling as oversized rather than deduplicating it
tests/grep-convention.vitest.ts > variant classifier > reads the declared members as written, before dedupe or normalization
tests/grep-convention.vitest.ts > per-variant handlers > leaves the malformed fixture byte-identical and reports exactly one row
tests/grep-convention.vitest.ts > per-variant handlers > skips non-yaml without rewriting a byte
tests/grep-convention.vitest.ts > per-variant handlers > skips wrong-list-type without rewriting a byte
tests/grep-convention.vitest.ts > per-variant handlers > skips non-string-members without rewriting a byte
tests/grep-convention.vitest.ts > per-variant handlers > skips oversized without rewriting a byte
tests/grep-convention.vitest.ts > per-variant handlers > never truncates an oversized phrase
tests/grep-convention.vitest.ts > per-variant handlers > accepts a valid empty list as conforming, with no diagnostic row
tests/grep-convention.vitest.ts > per-variant handlers > keeps the first duplicate in document order and reports every removal
tests/grep-convention.vitest.ts > per-variant handlers > deduplicates a flow sequence inside the one line whose members changed
tests/grep-convention.vitest.ts > per-variant handlers > emits one duplicate row per removed member
tests/grep-convention.vitest.ts > frontmatter creation > creates a block from the first heading and an empty list, never a fallback phrase
tests/grep-convention.vitest.ts > frontmatter creation > reports the canonical keys it will not synthesize
tests/grep-convention.vitest.ts > frontmatter creation > appends the key to an existing block without reordering or dropping anything
tests/grep-convention.vitest.ts > frontmatter creation > refuses to append a key into a block holding a single-line flow mapping
tests/grep-convention.vitest.ts > frontmatter creation > refuses to start a block on a canonical document it cannot finish
tests/grep-convention.vitest.ts > frontmatter creation > still creates a block on a non-canonical document
tests/grep-convention.vitest.ts > frontmatter creation > still adds the missing key when a canonical document already has a block
tests/grep-convention.vitest.ts > frontmatter creation > reports no degradation for an edit that leaves the block parseable
tests/grep-convention.vitest.ts > frontmatter creation > rewrites only the alias key line and preserves the members verbatim
tests/grep-convention.vitest.ts > frontmatter creation > reports every canonical key a block does not declare
tests/grep-convention.vitest.ts > phrase judge > rejects a single token, which can only ever match by exact equality
tests/grep-convention.vitest.ts > phrase judge > rejects a phrase that is only numbers, the residue of a packet id or a date
tests/grep-convention.vitest.ts > phrase judge > keeps the earlier classes ahead of the new ones and admits a two-token concept
tests/grep-convention.vitest.ts > anchor parser > reads a marker only when it is the whole line
tests/grep-convention.vitest.ts > anchor parser > accepts lower-kebab ids and the typed-id exception, and nothing else
tests/grep-convention.vitest.ts > anchor parser > reports an unmatched opener, an orphan closer and a duplicated id without repairing them
tests/grep-convention.vitest.ts > anchor parser > does not read a marker quoted inside a fenced example as a real marker
tests/grep-convention.vitest.ts > body preimage hasher > is unchanged by inserting a frontmatter block in front of a document that had none
tests/grep-convention.vitest.ts > body preimage hasher > is unchanged by adding or removing a whole-line anchor marker
tests/grep-convention.vitest.ts > body preimage hasher > is unchanged by any edit inside the frontmatter block
tests/grep-convention.vitest.ts > body preimage hasher > changes when a single body character changes
tests/grep-convention.vitest.ts > body preimage hasher > changes when a trailing newline is dropped, so terminators stay protected
tests/grep-convention.vitest.ts > body preimage hasher > protects a marker-shaped line that sits inside a fenced example
tests/grep-convention.vitest.ts > trigger allowlist filter > rejects every generic workflow word the convention names
tests/grep-convention.vitest.ts > trigger allowlist filter > rejects a phrase whose every token is a stop word
tests/grep-convention.vitest.ts > trigger allowlist filter > rejects a whole prose sentence
tests/grep-convention.vitest.ts > trigger allowlist filter > admits distinctive domain phrases
tests/grep-convention.vitest.ts > trigger allowlist filter > names the editor fallback that produced a session or context phrase
tests/grep-convention.vitest.ts > trigger allowlist filter > names the folder-token fallback shape without claiming to know the phrase came from it
tests/grep-convention.vitest.ts > trigger allowlist filter > partitions a list into what may be written and what is only reported
tests/grep-convention.vitest.ts > trigger allowlist filter > reports a fallback phrase without deleting or rewriting it
tests/grep-convention.vitest.ts > naming grammar > passes a conforming packet path
tests/grep-convention.vitest.ts > naming grammar > reports a directory that claims to be a packet but breaks the grammar
tests/grep-convention.vitest.ts > naming grammar > reports an uppercase basename and leaves ordinary directory names alone
tests/grep-convention.vitest.ts > diff classifier > buckets a frontmatter-only edit with nothing in the other bucket
tests/grep-convention.vitest.ts > diff classifier > buckets an inserted block as frontmatter
tests/grep-convention.vitest.ts > diff classifier > buckets a whole-line marker insertion as a marker
tests/grep-convention.vitest.ts > diff classifier > puts a body edit in the other bucket, which is what fails the diff rule
tests/grep-convention.vitest.ts > diff classifier > puts a marker inserted mid-paragraph in the other bucket
tests/grep-convention.vitest.ts > diff classifier > reports no change when nothing changed
tests/grep-convention.vitest.ts > diagnostics severity > marks the seven non-conforming variants and the preimage mismatch an error
tests/grep-convention.vitest.ts > diagnostics severity > marks every class a human still has to weigh a warning
tests/grep-convention.vitest.ts > diagnostics severity > emits no row at all for the conforming variant
tests/grep-convention.vitest.ts > diagnostics severity > reads severity from the table rather than from the caller
tests/grep-convention.vitest.ts > idempotence > re-planning a processed missing document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed malformed-or-unclosed document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed non-yaml document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed wrong-list-type document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed non-string-members document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed valid-empty document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed duplicate document changes nothing further
tests/grep-convention.vitest.ts > idempotence > re-planning a processed oversized document changes nothing further
tests/grep-convention.vitest.ts > idempotence > preserves the body preimage across every fixture that the handlers rewrite
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > dry-runs and removes a glued overlapping duplicate pair on apply
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > ignores duplicate marker examples in backtick and tilde fences
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > dry-runs and moves the nested questions opener on apply
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > does not pair an anchor across a ``` fence
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > does not pair an anchor across a ~~~ fence
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > reports a suffix collision without renaming the duplicate pair
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > leaves overlapping duplicate pairs unchanged when they are not glued
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > moves only marker lines when un-nesting questions
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > treats a flat questions anchor with a deeper Open Questions subheading as needing nothing
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > refuses the un-nesting when the OPEN QUESTIONS heading is already wrapped
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > preserves file mode and leaves the original intact when rename fails
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'extra spaces inside a marker comment …'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'the anchor token is case-sensitive: t…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'marker lookalikes inside ``` and ~~~ …'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'an opener and closer joined on one li…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'two openers joined on one line leave …'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'an unclosed fence before the question…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'a nested and a flat questions anchor …'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'an already flat document is byte-iden…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'a questions pair with no OPEN QUESTIO…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'a packet outside the named specs root…'
tests/heal-anchor-repair.vitest.ts > heal-spec-docs anchor repair mode > adversarial: 'fallback: a glued duplicate that does…'
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run rejects --mode and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run rejects --json and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair rejects --mode and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair rejects --json and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes rejects --mode and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes rejects --json and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes with --mode <name> --apply exits 2 and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run exits 2 and names an unknown flag, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair exits 2 and names an unknown flag, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes exits 2 and names an unknown flag, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run exits 2 and names a --folder that does not exist, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair exits 2 and names a --folder that does not exist, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes exits 2 and names a --folder that does not exist, and writes nothing
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run exits 2 and names a --roots that does not exist
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair exits 2 and names a --roots that does not exist
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes exits 2 and names a --roots that does not exist
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > default run accepts its known flags and heals the packet they name
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --anchor-repair accepts its known flags and heals the packet they name
tests/heal-arguments.vitest.ts > heal-spec-docs argument checks > --lane-modes accepts its known flags and heals the packet they name
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-positive
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-refuses-no-anchors
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-wraps-a-real-heading-past-an-example-marker-in-a-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-idempotence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-ends-after-trailing-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > anchor-wrap-ends-without-final-newline
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > lane-modes-cli-dry-run
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-positive
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-refuses-multiple-matches
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-refuses-no-target
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-idempotence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-ignores-fenced-links
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-skips-links-in-a-longer-outer-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-skips-links-after-a-tilde-line-inside-a-backtick-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-repoints-outside-a-normal-fence-only
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-skips-links-inside-inline-code-spans
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-skips-links-in-a-list-indented-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-preserves-angle-brackets-and-fragments
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-refuses-reference-definitions
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-ignores-scratch-and-memory-candidates
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > link-repoint-hostile-working-directory
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-positive
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archived
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-status-from-specs-root
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'z_archived look-alike stays live'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'z_archive-notes look-alike stays live'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'my_z_archive look-alike stays live'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: '.. segments resolving into z_archive …'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: '.. segments resolving out of z_archiv…'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'a doubled separator resolving into z_…'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'an ordinary active packet stays live'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-archive-placement: 'a document below no specs root falls …'
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-refuses-a-value-continued-on-the-next-line
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-refuses-authored
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-idempotence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > continuity-placeholders-ignores-authored-replace
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-positive
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-keeps-inline-declaration
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-refuses-a-closing-line-with-trailing-text
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-accepts-a-closing-line-with-trailing-spaces-and-crlf
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-refuses-missing-header
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-refuses-malformed
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > level-from-spec-idempotence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-positive
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-keeps-crlf
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-refuses-no-match
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-refuses-fenced-only-anchor
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-refuses-an-anchor-named-only-in-a-double-backtick-span
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-refuses-an-anchor-named-only-in-a-list-indented-fence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-refuses-a-closing-line-with-trailing-text
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-stamps-after-a-closing-line-with-trailing-spaces-and-crlf
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-stamps-past-fenced-extra
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > header-add-idempotence
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > lane-modes-order
tests/heal-lane-modes.vitest.ts > heal-spec-docs lane modes > lane-modes-sequence
tests/heal-provenance.vitest.ts > retired write flags > check-template-staleness.sh refuses --auto-upgrade before any work
tests/heal-provenance.vitest.ts > retired write flags > quality-audit.sh refuses --fix before any work
tests/heal-provenance.vitest.ts > heal-spec-docs provenance stamp > stamps an exact-anchor plan and leaves superset, subset and level-less plans alone
tests/heal-provenance.vitest.ts > heal-spec-docs provenance stamp > stamps an exact-anchor plan when spec.md declares its level only in frontmatter
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply leaves a symlinked spec.md and its outside target untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply leaves a symlinked tasks.md with an empty trigger list untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > --anchor-repair --apply leaves a symlinked spec.md and its outside target untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > --lane-modes --apply leaves a symlinked spec.md and its outside target untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply replaces a spec.md that becomes a link after it is read, and leaves the outside target untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply reports a dangling spec.md link as refused and does not create its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply refuses a symlinked spec.md whose target sits inside the same packet
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > default healer --apply changes no bytes on a plain packet with nothing left to heal
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > --anchor-repair --apply refuses a dangling spec.md and does not create its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > --lane-modes --apply refuses a dangling spec.md and does not create its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs symbolic link containment > a linked spec.md supplies no level to the packet documents beside it
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a linked --folder and leaves the packet behind the link untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --anchor-repair --apply refuses a linked --folder and leaves the packet behind the link untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --lane-modes --apply refuses a linked --folder and leaves the packet behind the link untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a dangling --folder and creates nothing at its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --anchor-repair --apply refuses a dangling --folder and creates nothing at its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --lane-modes --apply refuses a dangling --folder and creates nothing at its target
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > refuses a --folder reached through a linked component inside the specs root
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a --folder spelled through an alias of the specs root when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --anchor-repair --apply refuses a --folder spelled through an alias of the specs root when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --lane-modes --apply refuses a --folder spelled through an alias of the specs root when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a relative ../specs --folder run from a subdirectory when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --anchor-repair --apply refuses a relative ../specs --folder run from a subdirectory when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --lane-modes --apply refuses a relative ../specs --folder run from a subdirectory when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a --folder whose mid-path dot segment reaches a packet through a link
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --roots run refuses a plain --folder outside the given roots without blaming a link
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --roots run ignores a system symlink above a plain outside folder in the refusal
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --roots run keeps link wording when a linked parent resolves outside the given roots, and leaves that packet untouched
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a case-variant SPECS --folder when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a --folder inside a repository, reached through a link from a cwd outside every repository
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a --folder whose path enters a repository through an alias, from a cwd outside every repository
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > default run --apply refuses a --folder that no root or repository reaches when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --anchor-repair --apply refuses a --folder that no root or repository reaches when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs folder containment > --lane-modes --apply refuses a --folder that no root or repository reaches when no --roots is given
tests/heal-symlink-containment.vitest.ts > heal-spec-docs entry through a non-root directory > default run --apply refuses a --folder that enters a repository through an alias to a non-root directory in the specs tree, from a cwd outside every repository
tests/heal-symlink-containment.vitest.ts > heal-spec-docs entry through a non-root directory > default run --apply refuses a --folder that enters a repository through an alias to a directory beside the specs tree, from a cwd outside every repository
tests/heal-symlink-containment.vitest.ts > heal-spec-docs entry through a non-root directory > default run --apply refuses a --folder that enters a repository through an alias reached through a real directory outside every repository, from a cwd outside every repository
tests/heal-symlink-containment.vitest.ts > heal-spec-docs entry through a non-root directory > default run --apply refuses a --folder that enters a repository through an alias, with nothing linked below it
tests/heal-symlink-containment.vitest.ts > heal-spec-docs --folder argument value > --folder as the last argument is a usage error with no stack trace, and writes nothing
tests/heal-symlink-containment.vitest.ts > heal-spec-docs --folder argument value > --folder followed by another flag is a usage error with no stack trace, and writes nothing
tests/heal-symlink-containment.vitest.ts > heal-spec-docs --folder argument value > --roots as the last argument is a usage error with no stack trace, and writes nothing
tests/heal-target-parity.vitest.ts > heal-spec-docs target selection parity > each entrypoint discovers the same packets under --roots
tests/heal-target-parity.vitest.ts > heal-spec-docs target selection parity > each entrypoint defaults the specs root to the working directory
tests/heal-target-parity.vitest.ts > heal-spec-docs target selection parity > each entrypoint narrows to the one packet named by --folder, with or without --roots
tests/heal-target-parity.vitest.ts > heal-spec-docs target selection parity > the default and anchor-repair summaries count the same packets
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > reproduces the committed registration files byte for byte
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > points every drift message at the spec-kit runtime build, not at an installer
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > reports a hand-edited registration file and restores it in write mode, keeping the other settings keys
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > reports a Pi extension the registry names but the directory does not carry
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > renders each runtime in its own wrapper dialect from one binding
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > detaches a background binding on Cursor the way the project-dir runtimes do
tests/hook-registration-sync.vitest.ts > sync-hook-registrations.cjs > Devin edit-path bindings also match write
tests/host-trigger-index.vitest.ts > isHostRepository > treats a real .skilled directory in the root as the framework checkout
tests/host-trigger-index.vitest.ts > isHostRepository > returns false for this repository, which carries the source tree itself
tests/host-trigger-index.vitest.ts > isHostRepository > treats a .skilled entry resolving outside the root as a host
tests/host-trigger-index.vitest.ts > isHostRepository > treats a root carrying its own index directory as a host
tests/host-trigger-index.vitest.ts > isHostRepository > returns false for a root carrying no source tree at all
tests/host-trigger-index.vitest.ts > callerRepoRoot > resolves the checkout the caller works in
tests/host-trigger-index.vitest.ts > callerRepoRoot > reports null outside any checkout rather than guessing a root
tests/host-trigger-index.vitest.ts > callerRepoRoot > places the host index under the root
tests/host-trigger-index.vitest.ts > lookup index selection > reads the host index when the caller is a host and no --index is given
tests/host-trigger-index.vitest.ts > lookup index selection > keeps the packaged index when the caller carries no host index
tests/host-trigger-index.vitest.ts > bare generation inside a host > writes the host index and its sidecars without touching the packaged artifact
tests/host-trigger-index.vitest.ts > bare generation inside a host > checks the same host index a bare generation writes
tests/host-trigger-index.vitest.ts > owning host resolution > names the host holding the linked tree, whose index the project reads
tests/host-trigger-index.vitest.ts > owning host resolution > names no owner for the host itself, which holds its own tree
tests/host-trigger-index.vitest.ts > owning host resolution > falls back to the packaged index when the linked tree has no index of its own
tests/host-trigger-index.vitest.ts > lookup from a project linked into a host > reads the index the project keeps itself before its host is asked
tests/host-trigger-index.vitest.ts > lookup from a project linked into a host > reads the host index and scopes itself to the folder the project links to
tests/host-trigger-index.vitest.ts > lookup from a project linked into a host > drops the default scope when --spec-folder is given an empty value
tests/host-trigger-index.vitest.ts > bare generation inside a project linked into a host > refuses to index the project and names the host that holds the corpus
tests/host-trigger-index.vitest.ts > bare generation inside a project linked into a host > refuses a bare --check for the same reason
tests/host-trigger-index.vitest.ts > bare generation inside a project linked into a host > does not refuse a project that keeps its own index directory
tests/host-trigger-index.vitest.ts > host-named index directory > keeps the default directory when the host names none
tests/host-trigger-index.vitest.ts > host-named index directory > generates into the named directory and the lookup reads it
tests/host-trigger-index.vitest.ts > host-named index directory > counts the named directory, not the default, as the host signal
tests/host-trigger-index.vitest.ts > host-named index directory > lets a linked project read the directory its owning host names
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "../outside" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "/abs/index" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "." rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir ".skilled/index" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "specs/index" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir ".SKILLED/index" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "Specs/index" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir ".git/idx" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "node_modules/x" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir "" rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > rejects indexDir 42 rather than falling back
tests/host-trigger-index.vitest.ts > host-named index directory > ignores blank space around the directory name
tests/host-trigger-index.vitest.ts > host-named index directory > rejects a directory that is a link to somewhere outside the host
tests/host-trigger-index.vitest.ts > host-named index directory > rejects a directory that is a link into the corpus
tests/host-trigger-index.vitest.ts > host-named index directory > rejects a name that is already a regular file
tests/host-trigger-index.vitest.ts > host-named index directory > exits 2 from the legacy upgrade on a setting it cannot honor
tests/host-trigger-index.vitest.ts > host-named index directory > exits 2 from both scripts on a setting it cannot honor
tests/host-trigger-index.vitest.ts > host-named index directory > rejects settings [".index"] that are JSON but not an object
tests/host-trigger-index.vitest.ts > host-named index directory > rejects settings ".index" that are JSON but not an object
tests/host-trigger-index.vitest.ts > host-named index directory > rejects settings null that are JSON but not an object
tests/host-trigger-index.vitest.ts > host-named index directory > gives a linked project the packaged index when its host names a folder holding no index
tests/host-trigger-index.vitest.ts > host-named index directory > says on stderr that a named folder holds no index while the default one still does
tests/host-trigger-index.vitest.ts > host-named index directory > rejects a settings file that is not JSON
tests/import-policy-rules.vitest.ts > isProhibitedImportPath > blocks package imports for internal runtime roots and descendants
tests/import-policy-rules.vitest.ts > isProhibitedImportPath > blocks relative imports for internal runtime roots and descendants
tests/import-policy-rules.vitest.ts > isProhibitedImportPath > blocks normalized relative bypass attempts into internal runtime roots
tests/import-policy-rules.vitest.ts > isProhibitedImportPath > blocks sibling shared traversals and still allows public package imports
tests/inline-gate-renderer.vitest.ts > inline gate renderer > renders matching single-level blocks and strips marker lines
tests/inline-gate-renderer.vitest.ts > inline gate renderer > omits non-matching blocks while preserving surrounding whitespace
tests/inline-gate-renderer.vitest.ts > inline gate renderer > suppresses blank boundary lines from skipped top-level gates
tests/inline-gate-renderer.vitest.ts > inline gate renderer > supports multi-level lists
tests/inline-gate-renderer.vitest.ts > inline gate renderer > supports comma-list whitespace and trailing commas
tests/inline-gate-renderer.vitest.ts > inline gate renderer > rejects unknown expression levels instead of silently stripping blocks
tests/inline-gate-renderer.vitest.ts > inline gate renderer > renders same-line empty gates as empty content
tests/inline-gate-renderer.vitest.ts > inline gate renderer > supports nested gates
tests/inline-gate-renderer.vitest.ts > inline gate renderer > supports boolean expressions
tests/inline-gate-renderer.vitest.ts > inline gate renderer > ignores gate-looking text inside fenced code blocks
tests/inline-gate-renderer.vitest.ts > inline gate renderer > rejects unbalanced gates
tests/inline-gate-renderer.vitest.ts > inline gate renderer > renders multiple files to an output directory in one CLI process
tests/inline-gate-renderer.vitest.ts > inline gate renderer > reads a template path given before --level instead of waiting on stdin
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > runs without tsx or the TypeScript renderer
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > renders every shipped template at every level exactly as the TypeScript renderer does
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > matches the TypeScript renderer on nesting, expressions, empty gates and fences
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > reads the template from stdin when no file is given
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > reads a template path given before --level instead of waiting on stdin
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > keeps the basename of an --out-dir input without a .tmpl suffix
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on an unclosed gate
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on an unmatched close
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on an unknown level
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on an unsupported axis
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on an unclosed group
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > fails with the TypeScript renderer message on a dangling operator
tests/inline-gate-renderer-fallback.vitest.ts > inline gate renderer fallback > exits 2 with usage when --level or --out-dir files are missing
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > normalizes an empty object to defaults
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > handles missing FILE_PATH and path gracefully
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > coerces non-string FILE_PATH (number) to string
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > coerces non-string FILE_PATH (boolean) to string
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > rejects object FILE_PATH and uses default
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > rejects array DESCRIPTION and uses default
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > uses default for null FILE_PATH
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > prefers FILE_PATH over path when both present
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > falls back to path when FILE_PATH is absent
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > handles missing DESCRIPTION with default
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > defaults invalid MODIFICATION_MAGNITUDE to unknown
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > preserves valid MODIFICATION_MAGNITUDE
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > omits MODIFICATION_MAGNITUDE when not provided
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > trims and capitalizes ACTION
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > handles lowercase action field via fallback
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > drops invalid _provenance values
tests/input-normalizer-unit.vitest.ts > normalizeFileEntryLike via normalizeInputData > preserves valid _provenance values
tests/input-normalizer-unit.vitest.ts > normalizeInputData importanceTier propagation (BUG-006) > propagates importanceTier through slow path
tests/input-normalizer-unit.vitest.ts > normalizeInputData importanceTier propagation (BUG-006) > propagates importance_tier (snake_case) through slow path
tests/input-normalizer-unit.vitest.ts > normalizeInputData importanceTier propagation (BUG-006) > propagates importanceTier through fast path
tests/input-normalizer-unit.vitest.ts > normalizeInputData importanceTier propagation (BUG-006) > does not set importanceTier when not provided
tests/input-normalizer-unit.vitest.ts > normalizeInputData explicit memory metadata propagation > preserves explicit title, description, and causalLinks through the slow path
tests/input-normalizer-unit.vitest.ts > normalizeInputData explicit memory metadata propagation > preserves explicit title, description, and causal_links through the fast path
tests/input-normalizer-unit.vitest.ts > normalizeInputData fast-path string coercion and enrichment merge > coerces string arrays into structured fast-path objects
tests/input-normalizer-unit.vitest.ts > normalizeInputData fast-path string coercion and enrichment merge > merges slow-path enrichments when fast-path arrays are already present
tests/input-normalizer-unit.vitest.ts > normalizeInputData Phase 016 regressions > deduplicates duplicate observations in fast-path structured payloads
tests/input-normalizer-unit.vitest.ts > normalizeInputData Phase 016 regressions > propagates projectPhase through fast-path structured payloads
tests/input-normalizer-unit.vitest.ts > continuity fields in the save payload > accepts every snake_case and camelCase spelling without an unknown-field warning
tests/input-normalizer-unit.vitest.ts > continuity fields in the save payload > carries the fields through both normalization paths, treating an empty string as absent
tests/level-contract-fallback.vitest.ts > level contract fallback > runs without tsx or the TypeScript resolver
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level 1
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level 2
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level 3
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level 3+
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level phase
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level review
tests/level-contract-fallback.vitest.ts > level contract fallback > prints the same contract JSON as the TypeScript resolver for Level research
tests/level-contract-fallback.vitest.ts > level contract fallback > carries the optional and lifecycle docs create.sh scaffolds from
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects an unknown level with the TypeScript resolver message
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects a missing level row instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects an empty required core list instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects a non-array addon list instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects a document name that climbs out instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects a malformed lifecycle block instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects an unknown section gate level instead of printing a partial contract
tests/level-contract-fallback.vitest.ts > level contract fallback > rejects a missing frontmatter marker level instead of printing a partial contract
tests/level-contract-resolver.vitest.ts > resolveLevelContract > returns the Level 1 core document contract
tests/level-contract-resolver.vitest.ts > resolveLevelContract > keeps decision records lazy and carries acceptance criteria as a level add-on
tests/level-contract-resolver.vitest.ts > resolveLevelContract > keeps phase-parent contract lean
tests/level-contract-resolver.vitest.ts > resolveLevelContract > keeps review lazy add-ons opt-in
tests/level-contract-resolver.vitest.ts > resolveLevelContract > serializes section gate Map without leaking internal taxonomy fields
tests/level-contract-resolver.vitest.ts > resolveLevelContract > returns defensive copies across calls
tests/level-contract-resolver.vitest.ts > resolveLevelContract > normalizes invalid level errors to level-only vocabulary
tests/match-decision-table.vitest.ts > match-decision-table CLI > prints the row for each queued answer and writes nothing without --apply
tests/match-decision-table.vitest.ts > match-decision-table CLI > reads legacy root queue rows and deduplicates overlapping keys
tests/match-decision-table.vitest.ts > match-decision-table CLI > appends the packet and row id for each match, and a second --apply adds none
tests/match-decision-table.vitest.ts > match-decision-table CLI > lists only the session queues that still have pending records
tests/match-decision-table.vitest.ts > match-decision-table CLI > does not list a legacy root queue in --scan-orphans
tests/match-decision-table.vitest.ts > match-decision-table CLI > does not list another linked project session in --scan-orphans
tests/match-decision-table.vitest.ts > match-decision-table CLI > removes and prints the released consumed rows
tests/match-decision-table.vitest.ts > match-decision-table CLI > removes a key held only in the legacy root consumed log
tests/match-decision-table.vitest.ts > match-decision-table CLI > exits 2 with the usage when a required flag is missing
tests/match-decision-table.vitest.ts > match-decision-table CLI > exits 2 when the record path does not exist
tests/match-decision-table.vitest.ts > match-decision-table CLI > leaves answers pending and exits 0 when no table in the record can be read
tests/match-decision-table.vitest.ts > match-decision-table CLI > exits 2 in every mode when the project root is not a directory
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > warns when a v2.4 spec has no measured-behavior block
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > warns on an empty fence, and on a fence holding only an unfilled value token
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > passes a fence holding the command and its output
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > passes an N/A: line with a reason and warns on a bare N/A:
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > does not apply to a v2.3 spec, another template source or an unstamped spec
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > compares the stamp numerically, so v2.10 and v3.0 apply
tests/measured-behavior-rule.vitest.ts > MEASURED_BEHAVIOR shell rule > never reports fail, and the registry keeps the rule at warn severity
tests/memory-pipeline-regressions.vitest.ts > memory pipeline regressions > truncates memory titles at the last whole word
tests/memory-pipeline-regressions.vitest.ts > memory pipeline regressions > trims extracted outcomes back to a whole word boundary
tests/memory-pipeline-regressions.vitest.ts > memory pipeline regressions > filters generic single-word trigger phrases while preserving meaningful phrases
tests/memory-quality-phase2-pr3.vitest.ts > Phase 2 PR-3 importance-tier SSOT > keeps both serialized importance_tier locations aligned after the managed-frontmatter rewrite
tests/memory-quality-phase2-pr3.vitest.ts > Phase 2 PR-3 importance-tier SSOT > raises a HIGH-severity issue when frontmatter and MEMORY METADATA tiers drift apart
tests/memory-quality-phase2-pr3.vitest.ts > Phase 2 PR-3 importance-tier SSOT > ignores the template inline comment when the rendered tiers already match
tests/memory-quality-phase2-pr3.vitest.ts > Phase 2 PR-3 importance-tier SSOT > keeps the F-AC1 truncation fixture on a single resolved tier after Phase 2 lands
tests/memory-quality-phase3-pr6.vitest.ts > Phase 3 PR-6 decision precedence gate > F-AC2: preserves authored raw keyDecisions and emits no lexical placeholder titles
tests/memory-quality-phase3-pr6.vitest.ts > Phase 3 PR-6 decision precedence gate > preserves existing normalized/manual decision behavior when no raw keyDecisions exist
tests/memory-quality-phase3-pr6.vitest.ts > Phase 3 PR-6 decision precedence gate > keeps degraded lexical fallback alive when authored decisions are absent
tests/memory-quality-phase3-pr6.vitest.ts > Phase 3 PR-6 decision precedence gate > uses boundary-safe truncation for authored decision context when rationale text is long
tests/memory-quality-phase6-migration.vitest.ts > Phase 6 PR-13 trigger residual migration > flags junk residuals in dry-run mode, preserves useful anchors, and rewrites only trigger_phrases in apply mode
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > passes rich specific evidence
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > fails a single anchored prompt with no durable evidence
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > does not treat rendered template sections as primary evidence on their own
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > fails long content when the memory title stays generic
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > does not count placeholder file descriptions as primary evidence
tests/memory-sufficiency.vitest.ts > evaluateMemorySufficiency > counts spec-specific tool evidence as primary context
tests/memory-template-contract.vitest.ts > memory template contract validator > accepts the parser-contract probe when seeded from a rendered manifest template
tests/memory-template-contract.vitest.ts > memory template contract validator > accepts a structurally compliant memory
tests/memory-template-contract.vitest.ts > memory template contract validator > rejects missing anchor/id scaffolding for mandatory sections
tests/memory-template-contract.vitest.ts > memory template contract validator > rejects malformed trigger_phrases frontmatter shapes
tests/memory-template-contract.vitest.ts > memory template contract validator > rejects raw mustache leakage
tests/memory-template-contract.vitest.ts > memory template contract validator > enforces conditional section scaffolding only when optional sections are present
tests/memory-template-contract.vitest.ts > memory template contract validator > rejects missing blank line between frontmatter and body
tests/memory-template-contract.vitest.ts > memory template contract validator > rejects orphaned closing metadata anchors outside the metadata section
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > accepts memory with canonical-docs, overview, evidence
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > rejects memory missing canonical-docs anchor
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > rejects memory missing overview anchor
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > rejects memory missing evidence anchor
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > allows memory without old decisions section (no longer mandatory)
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > allows memory without old conversation section (no longer mandatory)
tests/memory-template-contract.vitest.ts > memory template contract validator > compact wrapper contract (phase 1) > allows memory without project-state-snapshot (no longer mandatory)
tests/migrate-generated-json.vitest.ts > migrate-generated-json enumerator > covers the z_archive and z_future trees
tests/migrate-generated-json.vitest.ts > migrate-generated-json enumerator > enumerates a folder that carries only description.json without spec.md
tests/migrate-generated-json.vitest.ts > migrate-generated-json scoped contract > calls the scoped path once per eligible folder and never the whole-tree walk
tests/migrate-generated-json.vitest.ts > migrate-generated-json scoped contract > records the z_future folder skipped on the writer rule, both files excluded
tests/migrate-generated-json.vitest.ts > migrate-generated-json scoped contract > regenerates each folder through the scoped backfill, never the --all walk
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > rewrites the description.json onto a specs-root-relative identity
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > leaves sibling folders untouched when regenerating one folder
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > is byte-stable on a second run, the migrated tree yields no diff
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > skips the description write on an unchanged second regeneration
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > passes the integrity validator with zero violations on eligible folders
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > refuses direct prune without a prior report and leaves graph metadata unchanged
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > writes a prune report and applies its reviewed candidate with a matching hash
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > refuses a prune when candidates changed after the report
tests/migrate-generated-json.vitest.ts > migrate-generated-json real run > refuses a prune report destination that is a symbolic link and leaves its target untouched
tests/multi-ai-council-advise-completion.vitest.ts > ai-council completion advisor > reports no advisories for a complete packet and exits 0
tests/multi-ai-council-advise-completion.vitest.ts > ai-council completion advisor > reports missing council-report.md despite seats and exits 0
tests/multi-ai-council-advise-completion.vitest.ts > ai-council completion advisor > reports missing council_complete event and exits 0
tests/multi-ai-council-advise-completion.vitest.ts > ai-council completion advisor > supports json and quiet modes without failing
tests/multi-ai-council-mirror-parity.vitest.ts > ai-council runtime mirror parity > keeps section headers, markers, and body size aligned across repo-managed runtimes
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > writes all artifacts for full council output
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > writes minimal artifacts using composition-table seat fallback
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > exits 1 without writes when strict-required sections are missing
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > parser export reports missing sections without filesystem writes
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > emits v1.1 metadata on all generated state lines
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > parses v1 state logs with implicit schema version
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > writes generate-context compatible payload when payload flag is present
tests/multi-ai-council-persist-artifacts.vitest.ts > ai-council persist-artifacts helper > does not write a memory payload when payload flag is absent
tests/multi-ai-council-validator.vitest.ts > Multi-AI Council validator awareness (packet 080) > passes strict validation with empty ai-council folder
tests/multi-ai-council-validator.vitest.ts > Multi-AI Council validator awareness (packet 080) > passes strict validation with only council-report.md
tests/multi-ai-council-validator.vitest.ts > Multi-AI Council validator awareness (packet 080) > passes strict validation with only seats folder
tests/multi-ai-council-validator.vitest.ts > Multi-AI Council validator awareness (packet 080) > passes strict validation with mixed arbitrary internals
tests/nested-changelog.vitest.ts > nested changelog generator > warns on stderr that it is deprecated and still prints usage on stdout
tests/nested-changelog.vitest.ts > nested changelog generator > warns that it is deprecated even when an argument is rejected
tests/nested-changelog.vitest.ts > nested changelog generator > builds a root changelog with phase coverage rollup
tests/nested-changelog.vitest.ts > nested changelog generator > confines an explicit output path to the project root
tests/nested-changelog.vitest.ts > nested changelog generator > writes a phase changelog into the parent packet changelog folder
tests/nested-changelog.vitest.ts > nested changelog generator > refuses --write for a packet with no changelog and writes nothing
tests/nested-changelog.vitest.ts > nested changelog generator > names a phase changelog by its packet and phase words
tests/nested-changelog.vitest.ts > nested changelog generator > names a root changelog by its packet words alone
tests/nested-changelog.vitest.ts > nested changelog generator > trims a long packet name and keeps the phase words whole
tests/nested-changelog.vitest.ts > nested changelog generator > renders frontmatter that parses and pastes every value literally
tests/nested-changelog.vitest.ts > nested changelog generator > keeps every Files Changed row when the summary lists 12 files
tests/nested-changelog.vitest.ts > nested changelog generator > keeps every Files Changed row when the summary lists 13 files
tests/nested-changelog.vitest.ts > nested changelog generator > removes an inline HTML comment, including one that spans a line break
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > PACKET_FAMILIES > should define 040 as the required primary corpus
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > PACKET_FAMILIES > should define 028 as an optional holdout
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > PACKET_FAMILIES > should define 042 as excluded
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > parseJSONL > should parse valid JSONL content
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > parseJSONL > should skip blank lines
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > parseJSONL > should track malformed lines with metadata (P1-4)
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > parseJSONL > should truncate long malformed line content to 200 chars (P1-4)
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > validateCorpusEntry > should accept a valid entry
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > validateCorpusEntry > should reject null input
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > validateCorpusEntry > should report missing required fields
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > validateCorpusEntry > should reject packet family 042
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > validateCorpusEntry > should reject empty iterations array
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should build corpus from 040 JSONL fixtures
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should build corpus from 028 with holdout warning
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should reject 042 corpus building
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should reject unknown packet family
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should build corpus from raw JSONL content
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should warn when graph metrics are unavailable (REQ-009)
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > emits replay metrics in the shape consumed by replayRun
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should error when no input source is provided
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should reject fixtures outside approved corpus roots
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > buildCorpus > should reject symlinked fixtures directories
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > saveCorpus / loadCorpus > should round-trip corpus through disk
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > saveCorpus / loadCorpus > should return an empty corpus for a missing corpus file
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-1: deterministic timestamps > should use provided timestamp in extractCorpusEntry
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-1: deterministic timestamps > should default to current time when no timestamp override
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-1: deterministic timestamps > should pass timestamp through buildCorpus to extractCorpusEntry
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-3: last terminal event wins > should use the LAST terminal event, not the first
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-3: last terminal event wins > should not pick an intermediate stop_decision over a later synthesis_complete
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-4: corrupted JSONL rejection > should reject traces where >20% of lines are malformed
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-4: corrupted JSONL rejection > should accept traces with malformed lines under 20% threshold
tests/optimizer-replay-corpus.vitest.ts > Replay Corpus Builder (T001) > P1-4: corrupted JSONL rejection > should include validationErrors array in corpus entry metadata
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkPrerequisites > should report all missing when no prerequisites exist
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkPrerequisites > should report partial missing
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkPrerequisites > should pass when all prerequisites exist
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkManifestBoundary > should allow tunable fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkManifestBoundary > should reject locked contract fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkManifestBoundary > should reject fields not in manifest
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > checkManifestBoundary > should reject mixed tunable and locked fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should produce advisory-accept when candidate improves
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should produce advisory-reject when candidate regresses
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should block promotion when manifest is missing
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should block promotion when candidate touches locked fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should always be advisory-only when prerequisites are missing (REQ-006)
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > should still be advisory-only even with all prerequisites met (Phase 4a scope)
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > evaluateCandidate > P1-2: advisoryOnly MUST be true even when all prerequisites are met
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > generatePromotionReport > should generate a complete advisory report
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > generatePromotionReport > should never set autoPromotionAllowed to true
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > generatePromotionReport > should include prerequisite gap in next steps when prerequisites are missing
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > P1-2: checkManifestBoundary range/type validation > should reject values below manifest minimum
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > P1-2: checkManifestBoundary range/type validation > should reject values above manifest maximum
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > P1-2: checkManifestBoundary range/type validation > should reject non-integer for integer type fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > P1-2: checkManifestBoundary range/type validation > should reject non-number for numeric fields
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > P1-2: checkManifestBoundary range/type validation > should accept values within manifest range
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > savePromotionReport > should persist report to disk
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > savePromotionReport > should reject report paths outside the dedicated audit directory
tests/optimizer-promote.vitest.ts > Advisory Promotion Gate (T007) > savePromotionReport > should reject symlinked report outputs
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > defineRubric > should create a rubric with default weights
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > defineRubric > should allow weight overrides
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > defineRubric > should report negative weights as validation errors
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > defineRubric > should report weights above 1 as validation errors
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > defineRubric > should report non-finite weights as validation errors
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > convergenceEfficiency > should score high for early convergence
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > convergenceEfficiency > should score 0 when not converged
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > convergenceEfficiency > should score 0 for max iterations used
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > recoverySuccessRate > should score 1.0 when no recovery was needed
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > recoverySuccessRate > should score based on success ratio
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > recoverySuccessRate > should score 0 for all failed recoveries
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > findingAccuracy > should score based on relevant/total ratio
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > findingAccuracy > should score 0 for no findings
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > synthesisQuality > should score high when relevant findings are preserved and the run converged
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > synthesisQuality > should score only the findings component when not converged
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > dimension scorers > synthesisQuality > should score 0 when no iterations were recorded
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > scoreRun > should produce per-dimension breakdown (REQ-003)
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > scoreRun > should mark unknown dimensions as unavailable (REQ-009)
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > scoreRun > should produce composite that reflects weighted average
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > clampScore > should clamp values to [0, 1]
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > clampScore > should return 0 for NaN
tests/optimizer-rubric.vitest.ts > Quality Rubric (T002) > clampScore > should return 0 for Infinity
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > evaluateConvergence > should detect convergence when newInfoRatio is below threshold
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > evaluateConvergence > should not converge when newInfoRatio is above threshold
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > evaluateConvergence > should detect stuck state after consecutive low-progress iterations
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > evaluateConvergence > should reset consecutiveLowProgress when progress resumes
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should replay a corpus entry deterministically
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should produce per-iteration signals
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should respect maxIterations from config
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should track findings across iterations
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > uses normalized corpus metrics for graph bonus decisions
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should handle empty iterations
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > replayRun > should distinguish configs when fixtures straddle convergence thresholds
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > compareResults > should detect improvements
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > compareResults > should detect regressions
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > compareResults > should report delta values
tests/optimizer-replay-runner.vitest.ts > Deterministic Replay Runner (T003) > compareResults > should flag convergence regression
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > createRNG > should produce deterministic sequences from the same seed
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > createRNG > should produce different sequences from different seeds
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > createRNG > should produce values in [0, 1)
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > sampleConfig > should sample values within parameter bounds
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > sampleConfig > should produce values at step intervals
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > countDecimals > should count decimal places
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > recordCandidate (T005 audit) > should record accepted candidates
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > recordCandidate (T005 audit) > should record rejected candidates with reason
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > recordCandidate (T005 audit) > should include comparison details when available
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > randomSearch > should complete search and return audit trail (REQ-008)
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > randomSearch > should produce deterministic results from the same seed
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > randomSearch > should record BOTH accepted and rejected candidates (REQ-008)
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > randomSearch > should respect bounded numeric parameter space (REQ-007)
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > randomSearch > should compute baseline score when baselineConfig is provided
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > evaluateConfig > should produce scores for a valid config
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > evaluateConfig > should return zero scores for empty corpus
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > compareScores > should detect composite improvement
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > compareScores > should detect composite regression
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > compareScores > should detect per-dimension regressions
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P1-1: deterministic timestamps in recordCandidate > should use provided timestamp for deterministic replay
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P1-1: deterministic timestamps in recordCandidate > should default to current time when no timestamp override
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P2-1: maxIterations in default param space > should include maxIterations in DEFAULT_PARAM_SPACE
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P2-1: maxIterations in default param space > should sample maxIterations within bounds
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P2-1: maxIterations in default param space > should reject custom parameter spaces with unknown fields
tests/optimizer-search.vitest.ts > Random Search Optimizer (T004) > P2-1: maxIterations in default param space > should reject custom parameter spaces with locked fields
tests/outsourced-agent-handback-docs.vitest.ts > outsourced agent handback docs > keeps remaining prompt templates aligned on richer payload guidance
tests/overview-boundary-safe-truncation.vitest.ts > overview boundary-safe truncation > keeps moderately long authored session summaries intact instead of forcing an ellipsis
tests/overview-boundary-safe-truncation.vitest.ts > overview boundary-safe truncation > falls back to the shared boundary-safe helper for very long summaries
tests/overview-boundary-safe-truncation.vitest.ts > overview boundary-safe truncation > does not raise the D1 reviewer check when the saved overview matches the full payload summary
tests/parent-spec-resolver.vitest.ts > parent spec resolver > returns the parent packet path for nested phase folders
tests/parent-spec-resolver.vitest.ts > parent spec resolver > returns an empty value for top-level packet folders
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > today through .opencode, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > today through .opencode, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > today through .opencode, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > skilled-only through .skilled, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > skilled-only through .skilled, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > skilled-only through .skilled, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .opencode, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .opencode, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .opencode, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .skilled, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .skilled, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > whole-link through .skilled, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .opencode, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .opencode, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .opencode, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .skilled, full tree: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .skilled, missing runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > per-entry through .skilled, missing runtime and runtime/cli: package, repository and shell resolvers name consistent roots
tests/package-root-parity.vitest.ts > root resolvers agree on the same fixture trees > a depth cap stops the walk short of a root that lies above it
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > today through .opencode: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > skilled-only through .skilled: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > whole-link through .opencode: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > whole-link through .skilled: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > per-entry through .opencode: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > per-entry through .skilled: a capped walk hoists to the root instead of returning its start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a caller-supplied sentinel is tested under both names
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a nested leak hoists above the outermost source-root segment
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > look-alike segments never count as a source root, and an exact segment below them does
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a dangling .opencode link falls back to the hoist, never to the start
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > today: a repository inside an ancestor named .skilled keeps its own root on full and capped walks
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > skilled-only: a repository inside an ancestor named .skilled keeps its own root on full and capped walks
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a walk capped at zero levels keeps a repository that sits under a directory named .skilled
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a sentinel under the legacy spec alias is tested as written, never under .skilled
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a sentinel spelled under .skilled/specs also tests the legacy .opencode/specs spelling
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a real .opencode tree beside the .skilled placeholder resolves from either tree
tests/package-root-parity.vitest.ts > the repository resolver treats .skilled and .opencode as one source tree > a start with no sentinel above it and no source-root segment is returned unchanged
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > today: selects .opencode
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > skilled-only: selects .skilled
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > whole-link: selects .skilled
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > per-entry: selects .skilled
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > an empty .skilled placeholder beside a real .opencode tree does not win
tests/package-root-parity.vitest.ts > the source-root selection picks the tree by its sentinel > a repository without the sentinel under either name has no source root
tests/path-containment.vitest.ts > write-boundary containment > accepts a not-yet-existing target inside the root and returns its resolved path
tests/path-containment.vitest.ts > write-boundary containment > rejects a lexical escape and an absolute path outside the root
tests/path-containment.vitest.ts > write-boundary containment > rejects a symlinked parent inside the root that points outside it
tests/path-containment.vitest.ts > write-boundary containment > accepts a symlinked parent that stays inside the root
tests/phase-status-from-payload.vitest.ts > phase and status capture > accepts explicit phase, status, and completion fields without unknown-field warnings
tests/phase-status-from-payload.vitest.ts > phase and status capture > falls back to contextType-derived phase and git-derived status when explicit fields are absent
tests/phase-status-from-payload.vitest.ts > phase and status capture > derives the phase for a planning session from the session list
tests/phase-status-from-payload.vitest.ts > phase and status capture > derives the phase for a debugging session from the session list
tests/phase-status-from-payload.vitest.ts > phase and status capture > derives the phase for a decision session from the session list
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > leaves a parent save pointer and its timestamp untouched
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > bubbles child saves up to the direct phase parent
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > stores a track-root pointer without rewriting its graph metadata
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > refreshes parent children_ids and last_save_at on child save
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > keeps concurrent child saves eventually consistent
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > leaves non-phase-parent saves without direct phase-parent ancestry untouched
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > schema validation on load — invalid graph-metadata is rejected before mutation > rejects a malformed last_active_at timestamp in the existing file
tests/phase-parent-pointer.vitest.ts > phase-parent pointer writes after canonical save > schema validation on load — invalid graph-metadata is rejected before mutation > rejects an empty string for last_active_child_id in the existing file
tests/playbook-provenance-paths.vitest.ts > playbook provenance lines > finds the package
tests/playbook-provenance-paths.vitest.ts > playbook provenance lines > every file carries exactly one provenance line in one of the two forms
tests/playbook-provenance-paths.vitest.ts > playbook provenance lines > every cited suite path resolves on disk
tests/phase-classification.vitest.ts > phase classification > resolves grep in debug output to Debugging
tests/phase-classification.vitest.ts > phase classification > normalizes Copilot view tool names to canonical read scoring
tests/phase-classification.vitest.ts > phase classification > prefers Implementation when edit/write tools are present despite research-heavy wording
tests/phase-classification.vitest.ts > phase classification > keeps non-contiguous phase returns as separate timeline segments
tests/phase-classification.vitest.ts > phase classification > recognizes test, documentation, and performance observations
tests/phase-classification.vitest.ts > phase classification > derives each supported flow pattern
tests/phase-classification.vitest.ts > phase classification > falls back to Discussion for low-signal exchanges without crashing
tests/phase-classification.vitest.ts > phase classification > exposes richer phase metadata through conversation extraction
tests/post-save-review.vitest.ts > reviewPostSaveQuality > passes when saved frontmatter matches the structured payload
tests/post-save-review.vitest.ts > reviewPostSaveQuality > detects title mismatch and missing trigger phrases as HIGH issues
tests/post-save-review.vitest.ts > computeReviewScorePenalty > caps accumulated penalties at -0.30
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > counts the v2.3 value token with its colon
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > counts the other markers strict validation reads
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > ignores bracketed prose that strict validation never flags
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > passes a template-compliant Level 3 packet
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > reads a v2.3 doc with the code-span, fence and all-markers rules
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > reads an older doc the way strict validation always has
tests/post-edit-placeholder-scan.vitest.ts > post-edit placeholder scan > keeps its usage exit code for a missing folder
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > runs the orchestrator built from this checkout
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > warns on a v2.3 doc with an unfilled token while the packet is a Draft
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > fails a v2.3 doc with an unfilled token once the status is not Draft
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > keeps the strict verdict for a v2.2 doc even while the packet is a Draft
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > never defers an open question, even in a v2.3 Draft
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED token gate > fails an in-progress v2.3 line that quotes a token and then leaves one unfilled
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a bare token gives warn in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a bare token keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a bare token gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a bare token keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a backticked token gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a backticked token keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a backticked token gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a backticked token keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a backticked token then a bare one gives warn in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a backticked token then a bare one keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a backticked token then a bare one gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a backticked token then a bare one keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a token inside a longer code span gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a token inside a longer code span keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a token inside a longer code span gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a token inside a longer code span keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a backtick fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a backtick fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a backtick fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a backtick fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a tilde fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a tilde fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a tilde fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a tilde fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a tilde fence quoting a backtick line, then a token in prose gives warn in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a tilde fence quoting a backtick line, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a tilde fence quoting a backtick line, then a token in prose gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a tilde fence quoting a backtick line, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a tilde fence quoting a backtick line, with the token inside gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a tilde fence quoting a backtick line, with the token inside keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a tilde fence quoting a backtick line, with the token inside gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a tilde fence quoting a backtick line, with the token inside keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a four-backtick fence quoting a three-backtick line, then a token in prose gives warn in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a four-backtick fence quoting a three-backtick line, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a four-backtick fence quoting a three-backtick line, then a token in prose gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a four-backtick fence quoting a three-backtick line, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a backtick fence whose inner line carries text after the markers gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a backtick fence whose inner line carries text after the markers keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a backtick fence whose inner line carries text after the markers gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a backtick fence whose inner line carries text after the markers keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a CRLF fence, then a token in prose gives warn in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a CRLF fence, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a CRLF fence, then a token in prose gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a CRLF fence, then a token in prose keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a closing fence followed by a non-breaking space gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a closing fence followed by a non-breaking space keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a closing fence followed by a non-breaking space gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a closing fence followed by a non-breaking space keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a fence never closed gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a fence never closed keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a fence never closed gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a fence never closed keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: an indented fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: an indented fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: an indented fence gives pass in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: an indented fence keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: the angle-bracket form gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: the angle-bracket form keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: the angle-bracket form gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: the angle-bracket form keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Draft: a [template: title gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Draft: a [template: title keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.3 Complete: a [template: title gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix > v2.2 Complete: a [template: title keeps its earlier verdicts
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Implemented as the only Status row gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Implemented in a later table under a Draft row gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Implementing as the only Status row gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Implementing in a later table under a Draft row gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Not implemented as the only Status row gives error in both
tests/placeholder-token-gate.vitest.ts > PLACEHOLDER_FILLED parity matrix, implemented statuses > v2.3 Not implemented in a later table under a Draft row gives warn in both
tests/process-sweep.vitest.ts > process sweep > never marks the current PID as eligible regardless of classification
tests/process-sweep.vitest.ts > process sweep > never marks ancestors as eligible even when they look orphaned
tests/process-sweep.vitest.ts > process sweep > preserves EPERM alive-but-unowned processes
tests/process-sweep.vitest.ts > process sweep > marks stale project PID locks eligible after exact path identity proof
tests/process-sweep.vitest.ts > process sweep > preserves expected warm daemons even with active port and owner-token evidence
tests/process-sweep.vitest.ts > process sweep > preserves external MCP stdio processes
tests/process-sweep.vitest.ts > process sweep > preserves browser sessions without known project markers
tests/process-sweep.vitest.ts > process sweep > refuses unknown owners
tests/process-sweep.vitest.ts > process sweep > marks orphaned project daemons eligible only with known project identity
tests/process-sweep.vitest.ts > process sweep > applies no signal even when the plan marks a row eligible
tests/process-sweep.vitest.ts > process sweep > reports a degraded inventory instead of an empty apply result
tests/process-sweep.vitest.ts > process sweep > does not plan process termination when inventory is degraded
tests/process-memory-harness.vitest.ts > process memory harness > parses ps rows with full commands intact
tests/process-memory-harness.vitest.ts > process memory harness > registers no project daemon rule by default
tests/process-memory-harness.vitest.ts > process memory harness > redacts owner tokens and API keys before storing command lines
tests/process-memory-harness.vitest.ts > process memory harness > classifies child and grandchild ancestry as current-session protected
tests/process-memory-harness.vitest.ts > process memory harness > classifies project daemons, expected daemons, and zombies without marking expected daemons killable
tests/process-memory-harness.vitest.ts > process memory harness > parses vm_stat and sysctl into byte estimates
tests/process-memory-harness.vitest.ts > process memory harness > classifies stale, live, invalid, empty, and zombie PID locks
tests/process-memory-harness.vitest.ts > process memory harness > builds a fixture snapshot with the required phase-002 evidence axes
tests/process-memory-harness.vitest.ts > process memory harness > builds snapshots from injected command output without shelling out
tests/process-memory-harness.vitest.ts > process memory harness > marks successful zero-row ps output as empty rather than ok
tests/process-memory-harness.vitest.ts > process memory harness > marks ps command failures as degraded inventory with an error
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-00a: progressive-validate.sh script exists
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-00b: validate.sh (dependency) exists
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-00c: --help flag exits 0 and prints usage
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-00d: --version flag exits 0
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-01: Level 1 Detect (equivalent to validate.sh) > T-PB2-01a: exit code matches validate.sh for a passing fixture
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-01: Level 1 Detect (equivalent to validate.sh) > T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-01: Level 1 Detect (equivalent to validate.sh) > T-PB2-01c: --level 1 stops after detect (no auto-fix mentions in output)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-02: Auto-fix — Missing dates corrected > T-PB2-02a: YYYY-MM-DD placeholder replaced with an ISO date
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-02: Auto-fix — Missing dates corrected > T-PB2-02b: [DATE] placeholder replaced with an ISO date
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-02: Auto-fix — Missing dates corrected > T-PB2-02c: date: TBD replaced with an ISO date
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-02: Auto-fix — Missing dates corrected > T-PB2-02d: files without date placeholders are left unchanged
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-03: Auto-fix — Heading levels normalized > T-PB2-03a: document starting at H2 is shifted so H2 becomes H1
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-03: Auto-fix — Heading levels normalized > T-PB2-03b: document already starting at H1 is not modified (heading-wise)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-03: Auto-fix — Heading levels normalized > T-PB2-03c: heading fix is logged in script output
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-04: Auto-fix — Whitespace normalized > T-PB2-04a: trailing whitespace removed from lines
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-04: Auto-fix — Whitespace normalized > T-PB2-04b: CRLF line endings normalized to LF
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-04: Auto-fix — Whitespace normalized > T-PB2-04c: file without whitespace issues is left unchanged
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-04: Auto-fix — Whitespace normalized > T-PB2-04d: whitespace fix is logged in script output
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-05: All auto-fixes logged with before/after diff > T-PB2-05a: [FIX] marker appears in output for each applied fix
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-05: All auto-fixes logged with before/after diff > T-PB2-05b: diff output present in --verbose mode
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-05: All auto-fixes logged with before/after diff > T-PB2-05c: --json output includes autoFixes array with fix records
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-05: All auto-fixes logged with before/after diff > T-PB2-05d: no [FIX] markers when no fixes are needed
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-06: Suggest level presents issues with guided options > T-PB2-06a: [SUGGEST] markers appear for fixable but non-auto-fixable issues
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-06: Suggest level presents issues with guided options > T-PB2-06b: suggestion includes rule name and remediation text
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-06: Suggest level presents issues with guided options > T-PB2-06c: no [SUGGEST] markers for fully passing spec
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-06: Suggest level presents issues with guided options > T-PB2-06d: --json output includes suggestions array
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-07: Report level produces structured output > T-PB2-07a: --level 4 output contains pipeline summary section
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-07: Report level produces structured output > T-PB2-07b: --json report includes version, pipelineLevel, folder, passed
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-07: Report level produces structured output > T-PB2-07c: JSON report pipelineLevel matches --level argument
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-07: Report level produces structured output > T-PB2-07d: JSON report folder matches input path
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-07: Report level produces structured output > T-PB2-07e: --level 4 is the default (omitting --level gives same as --level 4)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-08: --dry-run shows changes without applying > T-PB2-08a: file contents unchanged when --dry-run used
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-08: --dry-run shows changes without applying > T-PB2-08b: [DRY-RUN] marker appears in output
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-08: --dry-run shows changes without applying > T-PB2-08c: dry-run summary mentions how many fixes would be applied
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-08: --dry-run shows changes without applying > T-PB2-08d: --json dry-run report has dryRun:true
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-09: Exit code compatibility (0 / 1 / 2) > T-PB2-09a: exit 0 for a passing spec (full pipeline)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-09: Exit code compatibility (0 / 1 / 2) > T-PB2-09b: exit 2 for a failing spec (missing required files)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-09: Exit code compatibility (0 / 1 / 2) > T-PB2-09c: exit 1 for a spec with warnings (not errors)
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-09: Exit code compatibility (0 / 1 / 2) > T-PB2-09d: --strict promotes warnings to exit 2
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-09: Exit code compatibility (0 / 1 / 2) > T-PB2-09e: exit codes are not changed by auto-fixes in Level 2
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-10: --json produces parseable structured output > T-PB2-10a: --json output is valid JSON
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-10: --json produces parseable structured output > T-PB2-10b: JSON report has all required top-level fields
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-10: --json produces parseable structured output > T-PB2-10c: autoFixes object has count, applied, items, diffs fields
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-10: --json produces parseable structured output > T-PB2-10d: suggestions object has count and items fields
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-11/12/13: --level N controls pipeline depth > T-PB2-11: --level 1 output does NOT contain Level 2/3/4 headings
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-11/12/13: --level N controls pipeline depth > T-PB2-12: --level 2 output contains Level 2 heading but NOT Level 3/4
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-11/12/13: --level N controls pipeline depth > T-PB2-13: --level 3 output contains Level 3 heading but NOT Level 4 report
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-11/12/13: --level N controls pipeline depth > T-PB2-14: invalid --level value (0 or 5) causes exit 2
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-15: Edge cases > T-PB2-15a: missing folder argument exits 2 with error message
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-15: Edge cases > T-PB2-15b: non-existent folder exits 2 with error message
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-15: Edge cases > T-PB2-15c: unknown flag exits 2 with error message
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-15: Edge cases > T-PB2-15d: multiple .md files in folder all processed by auto-fix
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-16: --json with validation switched off > T-PB2-16a: level 1 prints only the skipped report on stdout
tests/progressive-validation.vitest.ts > Progressive Validation Pipeline > T-PB2-16: --json with validation switched off > T-PB2-16b: the full report carries skipped, and a normal run says false
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > explicit override (CHK-028) > returns explicit IMPLEMENTATION when caller provides "IMPLEMENTATION"
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > explicit override (CHK-028) > normalizes lowercase to uppercase
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > explicit override (CHK-028) > trims whitespace from explicit value
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > explicit override (CHK-028) > accepts all valid phases
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > falls back to detection when explicit is null
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > falls back to detection when explicit is invalid string
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > falls back to detection when explicit is undefined
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > detects RESEARCH for read-heavy tool counts
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > detects IMPLEMENTATION for write-heavy tool counts
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > detects PLANNING for decision observations with read-heavy counts
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > fallback detection when explicit is null/invalid (CHK-029) > defaults to RESEARCH when all tool counts are zero
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > project state snapshot integration > honors explicit projectPhase overrides when building the snapshot
tests/project-phase-e2e.vitest.ts > resolveProjectPhase > explicit contextType passthrough > honors all documented valid contextType overrides
tests/quality-audit-script.vitest.ts > quality-audit.sh > reports an empty root as a clean audit in text and JSON modes
tests/quality-audit-script.vitest.ts > quality-audit.sh > counts a folder whose validation is switched off as skipped, not as a pass
tests/quality-audit-script.vitest.ts > quality-audit.sh > rejects an unknown option with the misuse exit code
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > scores a clean session at 1.0 (no V-rule failures)
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > scores a session with five MEDIUM V-rule failures meaningfully below 0.90
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > scores a clean session higher than one with multiple V-rule failures
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > applies high-severity contamination cap at 0.60
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > contamination severity tiers > applies a small penalty for low severity contamination (no cap applied)
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > contamination severity tiers > caps medium severity contamination at 0.85
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > contamination severity tiers > caps high severity contamination at 0.60
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > contamination severity tiers > keeps low severity score above the 0.60 cap used for high severity
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > contamination severity tiers > treats null severity as medium (default behavior)
tests/quality-scorer-calibration.vitest.ts > scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts) > returns correct score01/score100 relationship for all result shapes
tests/recursive-child-manifest.vitest.ts > recursive child manifest boundary > checks manifest membership against git and fails closed without git
tests/recursive-child-manifest.vitest.ts > recursive child manifest boundary > validates the declared set and rejects an unlisted child
tests/reducer-backlog-remediation.vitest.ts > LG-0001: dashboard pause/stuck surfacing > returns PAUSED when the latest event is userPaused
tests/reducer-backlog-remediation.vitest.ts > LG-0001: dashboard pause/stuck surfacing > returns RECOVERING when the latest event is stuckRecovery
tests/reducer-backlog-remediation.vitest.ts > LG-0001: dashboard pause/stuck surfacing > a later iteration supersedes an earlier pause (back to RUNNING)
tests/reducer-backlog-remediation.vitest.ts > LG-0001: dashboard pause/stuck surfacing > a resumed event supersedes an earlier pause
tests/reducer-backlog-remediation.vitest.ts > LG-0001: dashboard pause/stuck surfacing > terminalStop still wins over a pause
tests/reducer-backlog-remediation.vitest.ts > LG-0005: carry scopeProof + affectedSurfaceHints > carries the documented findingDetails fields through deltaRecordToFinding
tests/reducer-backlog-remediation.vitest.ts > LG-0005: carry scopeProof + affectedSurfaceHints > defaults the fields when absent (backward compatible)
tests/reducer-backlog-remediation.vitest.ts > LG-0008: content_hash two-tier dedup > collapses cross-dimension restatements sharing a content_hash
tests/reducer-backlog-remediation.vitest.ts > LG-0008: content_hash two-tier dedup > falls back to file:line+title when content_hash is absent
tests/reducer-backlog-remediation.vitest.ts > LG-0008: content_hash two-tier dedup > keeps genuinely distinct findings separate
tests/reducer-backlog-remediation.vitest.ts > LG-0006: traceabilityChecks rollup > returns the latest summary + results
tests/reducer-backlog-remediation.vitest.ts > LG-0006: traceabilityChecks rollup > returns a zeroed rollup when no traceabilityChecks present
tests/reducer-backlog-remediation.vitest.ts > LG-0033: additive required-field validation > flags a record missing a type field
tests/reducer-backlog-remediation.vitest.ts > LG-0033: additive required-field validation > flags an out-of-range newFindingsRatio and missing severity keys
tests/reducer-backlog-remediation.vitest.ts > LG-0033: additive required-field validation > passes a fully valid iteration record with no warnings
tests/reducer-backlog-remediation.vitest.ts > end-to-end: registry carries the new fields > reduceReviewState exposes traceability + fieldWarnings and collapses dupes
tests/repo-era.vitest.ts > repository era report > counts unique packets, excludes artifacts, and includes archived packets
tests/repo-era.vitest.ts > repository era report > normalizes drifting headers and makes report totals agree with packet tallies
tests/repo-era.vitest.ts > repository era report > counts only stamps older than the first v4-era stamp as legacy
tests/repo-era.vitest.ts > repository era report > distinguishes v3 and v4 roots and flags a level document-set mismatch
tests/repo-era.vitest.ts > repository era report > ignores prose mentions of the legacy root when detecting layout residue
tests/repo-era.vitest.ts > repository era report > uses the YAML frontmatter level when marker and metadata table are absent
tests/repo-era.vitest.ts > repository era report > checks phase parents against the lean trio instead of their declared level
tests/repair-derived.vitest.ts > repair-derived > refuses a target outside the packet tree
tests/repair-derived.vitest.ts > repair-derived > refuses a packet folder argument that is a link to a packet outside the tree
tests/repair-derived.vitest.ts > repair-derived > refuses a packet folder reached through a linked parent directory outside the tree
tests/repair-derived.vitest.ts > repair-derived > refuses an unknown argument and a flag with no value
tests/repair-derived.vitest.ts > repair-derived > refuses a bare path rather than treating it as an unscoped run
tests/repair-derived.vitest.ts > repair-derived > accepts a repeated --folder and inspects each packet once
tests/repair-derived.vitest.ts > repair-derived > counts a folder given twice as one target
tests/repair-derived.vitest.ts > repair-derived > still refuses a bad --roots when a --folder is present
tests/repair-derived.vitest.ts > repair-derived > rewrites a stale recorded location from the packet path on disk
tests/repair-derived.vitest.ts > repair-derived > walks into an archive and rewrites an archived packet's recorded paths
tests/repair-derived.vitest.ts > repair-derived > sets the declared sub-track parent when a flat packet moves into a sub-track
tests/repair-derived.vitest.ts > repair-derived > clears the old parent when a packet moves from a sub-track into its track root
tests/repair-derived.vitest.ts > repair-derived > updates the parent when a packet moves between declared sub-tracks
tests/repair-derived.vitest.ts > repair-derived > leaves a flat packet parent and its review flag alone after a rename inside its track
tests/repair-derived.vitest.ts > repair-derived > keeps an old parent flagged for review when a packet moves to an undeclared folder
tests/repair-derived.vitest.ts > repair-derived > leaves a packet alone when nothing derived is wrong
tests/repair-derived.vitest.ts > repair-derived > reports repairable=0 and writes nothing for a clean packet in a dry run
tests/repair-derived.vitest.ts > repair-derived > reports without writing unless application is requested
tests/repair-derived.vitest.ts > repair-derived > names the re-derive in the plan whenever it edits a document
tests/repair-derived.vitest.ts > repair-derived > leaves a packet pointer outside the frontmatter alone
tests/repair-derived.vitest.ts > repair-derived > reports a repair it could not make and exits 2
tests/repair-derived.vitest.ts > repair-derived > changes nothing on a second run over the same packet
tests/repair-derived.vitest.ts > repair-derived > passes a packet it would otherwise repair when validation is switched off
tests/repair-derived.vitest.ts > repair-derived > does not write through a link planted at the predictable repair temp name
tests/repair-derived.vitest.ts > repair-derived > refuses a rewrite target that is a symbolic link and leaves its target untouched
tests/repair-derived.vitest.ts > repair-derived > leaves a rewrite target that links to a file inside the packet unread and unchanged
tests/repair-derived.vitest.ts > repair-derived > refuses to replace a rewrite target that became a link after planning, when the link points outside the packet
tests/repair-derived.vitest.ts > repair-derived > refuses to replace a rewrite target that became a link after planning, when the link points inside the packet
tests/repair-derived.vitest.ts > repair-derived > never reads an outside file through a rewrite target that became a link after planning
tests/repair-derived.vitest.ts > repair-derived > reports an unparseable description by file name and failure kind, never by its content
tests/repair-derived.vitest.ts > repair-derived > never opens an outside file through a packet document planted as a link after planning, in the re-derive too
tests/repair-derived.vitest.ts > repair-derived > re-derives a packet whose only link is a changelog pointing inside the packet
tests/repair-derived.vitest.ts > repair-derived > re-derives after repair when plan.md resolves inside the packet
tests/repair-derived.vitest.ts > repair-derived > refuses a needed re-derive when research is reached through a directory link outside the packet
tests/repair-derived.vitest.ts > repair-derived > re-derives when research is reached through a directory link inside the packet
tests/repair-derived.vitest.ts > repair-derived > does not re-derive over a linked graph-metadata.json, in the dry run or with --apply
tests/repair-derived.vitest.ts > repair-derived > refuses a dangling graph-metadata.json link in the dry run and with --apply, and creates nothing at its target
tests/repair-derived.vitest.ts > repair-derived > treats a dangling description.json link as absent and creates nothing at its target
tests/repair-derived.vitest.ts > repair-derived > treats a live plan.md link as absent: its outside level reaches no plan, output or written file
tests/repair-derived.vitest.ts > repair-derived > names the validator stderr when validate.sh exits 3, and exits non-zero
tests/repair-derived.vitest.ts > repair-derived > names the exit code and the stderr tail when the validator exits with no report
tests/research-template-gating.vitest.ts > research.md.tmpl level gating > level 3, 3+, and phase render identically (full document)
tests/research-template-gating.vitest.ts > research.md.tmpl level gating > level 1 renders a lean subset far smaller than the full document
tests/research-template-gating.vitest.ts > research.md.tmpl level gating > level 2 includes the mid tier but not the full tier
tests/research-template-gating.vitest.ts > research.md.tmpl level gating > no render leaks inline gate markers
tests/required-template-anchors.vitest.ts > required template anchors > matches the template-structure required set for every level and document
tests/required-template-anchors.vitest.ts > required template anchors > fails a v2.3 spec.md that lost its requirements section, naming the heading to restore
tests/required-template-anchors.vitest.ts > required template anchors > passes the same v2.3 packet with every section in place
tests/required-template-anchors.vitest.ts > required template anchors > keeps the earlier verdict for a v2.2 spec.md that lost the same section
tests/retrieval-coverage-parity.vitest.ts > root coverage parity > walks the roots the coverage decision names, in both lanes
tests/retrieval-coverage-parity.vitest.ts > root coverage parity > keeps every trigger-index root reachable under a ripgrep root
tests/retrieval-coverage-parity.vitest.ts > root coverage parity > keeps root README.md and the five runtime mirrors out of both lanes
tests/retrieval-coverage-parity.vitest.ts > exclusion coverage parity > walks research paths only when they meet the numbered packet and phase rules
tests/retrieval-coverage-parity.vitest.ts > exclusion coverage parity > agrees on every universally-excluded directory name
tests/retrieval-coverage-parity.vitest.ts > exclusion coverage parity > excludes each shared universal name in both lanes identically
tests/retrieval-coverage-parity.vitest.ts > exclusion coverage parity > keeps the three named scoped divergences exactly as documented, no more and no fewer
tests/retrieval-coverage-parity.vitest.ts > retrieval-conventions.md glob parity > carries a Section 2 recipe for every code path
tests/retrieval-coverage-parity.vitest.ts > manifest exclusion record > names every directory the walker prunes, so the manifest describes the policy that produced it
tests/retrieval-coverage-parity.vitest.ts > retrofit-convention.mjs exclusion parity > derives its effective exclusion set from the shared table minus its declared delta, and nothing else
tests/retrieval-coverage-parity.vitest.ts > retrofit-convention.mjs exclusion parity > carries a reason for every delta entry, and only subtracts names the shared table actually has
tests/retrieval-coverage-parity.vitest.ts > retrofit-convention.mjs exclusion parity > still does not exclude a research/lineages directory, the corpus compound rule this pipeline never adopted
tests/retrieval-coverage-parity.vitest.ts > sweep-memory-residue.mjs exclusion parity > derives its "anywhere" globs from the shared table minus the names its delta re-scopes, and nothing else
tests/retrieval-coverage-parity.vitest.ts > sweep-memory-residue.mjs exclusion parity > carries a reason for every delta entry
tests/retrieval-coverage-parity.vitest.ts > sweep-memory-residue.mjs exclusion parity > re-scopes .git to root-only rather than dropping it, and adds .worktrees with no counterpart in the shared table
tests/retrieval-coverage-parity.vitest.ts > sweep-memory-residue.mjs exclusion parity > still excludes research/lineages, converging with the corpus for the same reason
tests/retrieval-coverage-parity.vitest.ts > sweep-memory-residue.mjs exclusion parity > does not adopt the corpus fixture-directory exclusion - residue must still be reachable inside a fixture tree
tests/retrieval-repo-root.vitest.ts > DEFAULT_REPO_ROOT > resolves to the repository root, not the .skilled directory
tests/retrieval-repo-root.vitest.ts > DEFAULT_REPO_ROOT > walks up from any directory inside the skill tree to the same root
tests/retrieval-repo-root.vitest.ts > walkCorpus over the real repository > yields documents under every corpus root
tests/retrieval-repo-root.vitest.ts > corpus roots follow the source root a checkout carries > spells the roots under .opencode when that is the only source root
tests/retrieval-repo-root.vitest.ts > corpus roots follow the source root a checkout carries > keeps the canonical spelling where .skilled carries the tree
tests/retrieval-repo-root.vitest.ts > corpus roots follow the source root a checkout carries > refuses to build an index when no source root carries the sentinel
tests/retrofit-convention-pipeline.vitest.ts > scope walk > excludes archived, vendored and hidden trees
tests/retrofit-convention-pipeline.vitest.ts > scope walk > walks hidden trees only when asked
tests/retrofit-convention-pipeline.vitest.ts > scope walk > enumerates a document reachable through a symlink exactly once, under its own path
tests/retrofit-convention-pipeline.vitest.ts > scope walk > reads the track off a repo-relative path
tests/retrofit-convention-pipeline.vitest.ts > enumerate > freezes a manifest whose eight variant counts sum to the document total
tests/retrofit-convention-pipeline.vitest.ts > enumerate > records a body preimage for every enumerated document
tests/retrofit-convention-pipeline.vitest.ts > enumerate > inventories the alias hit without counting it as a variant
tests/retrofit-convention-pipeline.vitest.ts > enumerate > records both phrase measures and names the primary one
tests/retrofit-convention-pipeline.vitest.ts > enumerate > executes each of the three recipes once and reads the exit status
tests/retrofit-convention-pipeline.vitest.ts > enumerate > counts every structured match in the baseline, not one row per file
tests/retrofit-convention-pipeline.vitest.ts > enumerate > refuses a track that selects no document rather than freezing an empty manifest
tests/retrofit-convention-pipeline.vitest.ts > atomic processor > leaves the original untouched and removes its temporary file when the check fails
tests/retrofit-convention-pipeline.vitest.ts > atomic processor > renames into place when the candidate passes
tests/retrofit-convention-pipeline.vitest.ts > gates > rejects a candidate whose body region changed
tests/retrofit-convention-pipeline.vitest.ts > gates > rejects a candidate carrying a changed line outside frontmatter and markers
tests/retrofit-convention-pipeline.vitest.ts > gates > accepts a frontmatter-only candidate
tests/retrofit-convention-pipeline.vitest.ts > pipeline > plans a diff without writing a document
tests/retrofit-convention-pipeline.vitest.ts > pipeline > processes, then rescans clean, then writes nothing on a second run
tests/retrofit-convention-pipeline.vitest.ts > pipeline > holds the body preimage across the whole corpus after processing
tests/retrofit-convention-pipeline.vitest.ts > pipeline > refuses a document that moved since the manifest was frozen
tests/retrofit-convention-pipeline.vitest.ts > pipeline > names a stale manifest as staleness rather than as body damage
tests/retrofit-convention-pipeline.vitest.ts > pipeline > writes one diagnostics file per track so a per-track run keeps every track
tests/retrofit-convention-pipeline.vitest.ts > pipeline > reports a skip-and-report variant as handled rather than as residue
tests/retrofit-convention-pipeline.vitest.ts > pipeline > counts a refused unsafe edit as skipped by design, not as residue
tests/retrofit-convention-pipeline.vitest.ts > pipeline > reports an unprocessed missing variant as residue
tests/retrofit-convention-pipeline.vitest.ts > argument parsing > requires a known stage
tests/retrofit-convention-pipeline.vitest.ts > argument parsing > defaults the manifest into the artifact directory and trims a trailing slash off the track
tests/retrofit-convention-pipeline.vitest.ts > argument parsing > exposes the documented exit codes
tests/review-record-validation.vitest.ts > review-record packet type > resolves the review level to only spec.md and review/review-report.md
tests/review-record-validation.vitest.ts > review-record packet type > routes the review spec.md to the lean review template
tests/review-record-validation.vitest.ts > review-record packet type > validates a lean review-record folder at exit 0
tests/review-record-validation.vitest.ts > review-record packet type > fails a review-record folder that is missing review/review-report.md
tests/review-research-paths.vitest.ts > review-research path resolution > approves spec roots from a bidirectionally registered linked worktree
tests/review-research-paths.vitest.ts > review-research path resolution > rejects a worktree registration whose local backlink does not match
tests/review-research-paths.vitest.ts > review-research path resolution > uses the production resolver predicate to accept a registered worktree and reject a lookalike
tests/review-research-paths.vitest.ts > review-research path resolution > rejects a symlinked artifact directory before routing writes through it
tests/review-research-paths.vitest.ts > review-research path resolution > keeps root-spec research runs at the root spec folder
tests/review-research-paths.vitest.ts > review-research path resolution > returns flat for child-phase first run when rootDir is empty
tests/review-research-paths.vitest.ts > review-research path resolution > returns flat for nested first run when rootDir is empty
tests/review-research-paths.vitest.ts > review-research path resolution > reuses flat artifact when its config matches the current child target
tests/review-research-paths.vitest.ts > review-research path resolution > reuses an existing pt-NN packet for the same child target instead of allocating a sibling
tests/review-research-paths.vitest.ts > review-research path resolution > allocates pt-NN when prior pt-NN folders exist for non-matching targets
tests/review-research-paths.vitest.ts > review-research path resolution > allocates pt-NN when a flat artifact exists for a different target
tests/review-reducer-fail-closed.vitest.ts > deep-review reducer — fail-closed behavior > throws fail-closed corruption errors when JSONL is malformed and lenient is false
tests/review-reducer-fail-closed.vitest.ts > deep-review reducer — fail-closed behavior > surfaces a descriptive warning when a machine-owned strategy anchor is missing and still returns the computed registry
tests/review-reducer-fail-closed.vitest.ts > deep-review reducer — fail-closed behavior > with --lenient / createMissingAnchors the reducer still records corruption but does not block
tests/rg-wrapper-recipes.vitest.ts > recipe builders > spells the structured recipe exactly as the convention writes it
tests/rg-wrapper-recipes.vitest.ts > recipe builders > spells the path recipe exactly as the convention writes it
tests/rg-wrapper-recipes.vitest.ts > recipe builders > spells the count recipe exactly as the convention writes it
tests/rg-wrapper-recipes.vitest.ts > recipe builders > never combines an output mode with another
tests/rg-wrapper-recipes.vitest.ts > recipe builders > passes --no-config on every recipe, so ambient configuration cannot filter a result
tests/rg-wrapper-recipes.vitest.ts > recipe builders > keeps a phrase that opens with a hyphen out of the flag position
tests/rg-wrapper-recipes.vitest.ts > recipe builders > carries the same flag set as the shared retrieval lane
tests/rg-wrapper-recipes.vitest.ts > exit mapping > maps a match to exit 0 on every recipe
tests/rg-wrapper-recipes.vitest.ts > exit mapping > maps a clean miss to exit 1 and a valid empty result, never an error
tests/rg-wrapper-recipes.vitest.ts > exit mapping > maps a bad invocation to exit 2 and surfaces the stderr text
tests/rg-wrapper-recipes.vitest.ts > exit mapping > does not parse the empty stdout of a failed invocation as a miss
tests/rg-wrapper-recipes.vitest.ts > caller-side ranking > classifies an anchor marker hit as anchor evidence with its line number
tests/rg-wrapper-recipes.vitest.ts > caller-side ranking > excludes archived, vendored and scratch trees from every recipe
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > keeps one top-ranked row per file before applying the file limit
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > reports hidden file and match totals when the file limit cuts results
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > treats a zero limit as uncapped
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > prints every shaped file in the human summary when the limit exceeds twenty
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > prints the exact per-file and hidden-file elision strings
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > cuts the path and count recipes at the file limit and reports what it hid
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > lists every path and count at a zero limit, busiest file first
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > returns zero totals and an empty result for a clean structured miss
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > accepts whole non-negative limits and rejects invalid values
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > keeps the structured recipe free of --max-count and aligned with the shared lane
tests/rg-wrapper-recipes.vitest.ts > per-file flood control > ranks a frontmatter hit above a body hit
tests/rg-wrapper-recipes.vitest.ts > argument parsing > accepts a recipe, a phrase and the documented flags
tests/rg-wrapper-recipes.vitest.ts > argument parsing > searches the source root under the name the checkout gives it
tests/rg-wrapper-recipes.vitest.ts > argument parsing > refuses an unknown recipe, a missing phrase and an unknown flag
tests/runtime-memory-inputs.vitest.ts > loadCollectedData explicit data-file handling > rejects a missing explicit dataFile
tests/runtime-memory-inputs.vitest.ts > loadCollectedData explicit data-file handling > rejects invalid JSON from an explicit dataFile
tests/runtime-memory-inputs.vitest.ts > loadCollectedData explicit data-file handling > rejects validation failures from an explicit dataFile
tests/runtime-memory-inputs.vitest.ts > loadCollectedData explicit data-file handling > rejects an EACCES permission error from an explicit dataFile
tests/runtime-memory-inputs.vitest.ts > valid explicit dataFile happy path > loads and normalizes a valid explicit dataFile successfully
tests/runtime-memory-inputs.vitest.ts > valid explicit dataFile happy path > accepts the documented snake_case JSON shape without dropping prompts or context
tests/runtime-memory-inputs.vitest.ts > path traversal security > rejects a dataFile path that attempts directory traversal
tests/runtime-memory-inputs.vitest.ts > qualityAbortThreshold normalization > keeps canonical 0.0-1.0 thresholds unchanged
tests/runtime-memory-inputs.vitest.ts > qualityAbortThreshold normalization > auto-converts legacy 1-100 thresholds to the canonical 0.0-1.0 scale
tests/runtime-memory-inputs.vitest.ts > FILES field transformation > marks CLI-derived FILES with tool provenance and titles Copilot view as Read
tests/runtime-memory-inputs.vitest.ts > FILES field transformation > preserves FILES metadata in structured payloads when present
tests/runtime-memory-inputs.vitest.ts > FILES field transformation > keeps FILES backward-compatible when metadata is absent
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > preserves nextSteps through normalization into NEXT_ACTION without overwriting the summary
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > preserves next_steps for already-structured payloads without duplicating existing next-action facts
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > produces no Next Steps observation when nextSteps is an empty array
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > prefers camelCase nextSteps when both nextSteps and next_steps are present
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > documents behavior when the first next step is an empty string
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > honors explicit importanceTier through collectSessionData for non-expiring memories
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > honors explicit importance_tier through collectSessionData for temporary memories
tests/runtime-memory-inputs.vitest.ts > manual next-steps normalization > keeps auto-detected importanceTier behavior when no explicit tier is provided
tests/runtime-memory-inputs.vitest.ts > extractNextAction recentContext regex fallback > extracts next action from recentContext learning when observations have no matching next/todo facts
tests/runtime-memory-inputs.vitest.ts > extractNextAction recentContext regex fallback > truncates extractFromRecentContext result to 100 characters
tests/runtime-memory-inputs.vitest.ts > observation truncation prioritizes followup observations (M-005b) > preserves followup observations when total exceeds MAX_OBSERVATIONS
tests/runtime-memory-inputs.vitest.ts > observation truncation prioritizes followup observations (M-005b) > retains no more than MAX_OBSERVATIONS total after prioritization
tests/save-context-paths.vitest.ts > save-context path helpers > builds a session-scoped temp path from the session id
tests/save-context-paths.vitest.ts > save-context path helpers > returns a session-scoped example and flags only the legacy shared path
tests/save-continuity-write.vitest.ts > save writer continuity write > writes the payload fields into the leaf and keeps valid stored fields
tests/save-continuity-write.vitest.ts > save writer continuity write > drops a stored field that fails validation and names it
tests/save-continuity-write.vitest.ts > save writer continuity write > leaves every frontmatter line outside the continuity block and the body untouched
tests/save-continuity-write.vitest.ts > save writer continuity write > fails the save and writes nothing when a payload value is rejected
tests/save-continuity-write.vitest.ts > save writer continuity write > writes no continuity without continuity fields or outside --full-auto
tests/save-continuity-write.vitest.ts > save writer continuity write > stores the track root pointer only in the store, and resume lands on the leaf
tests/save-continuity-write.vitest.ts > save writer continuity write > routes a parent-targeted save by payload paths even when a valid pointer names another child
tests/save-continuity-write.vitest.ts > save writer continuity write > routes a parent-targeted save down the pointer chain when no payload path lies inside the tree
tests/save-continuity-write.vitest.ts > save writer continuity write > writes nothing and names the candidates when payload paths span two children
tests/save-continuity-write.vitest.ts > save writer continuity write > writes nothing when the only pointer names a child that no longer exists
tests/save-continuity-write.vitest.ts > save writer continuity write > writes nothing when the only pointer climbs out of the parent
tests/save-continuity-write.vitest.ts > save writer continuity write > writes nothing when the only pointer is not shaped like a child
tests/save-continuity-write.vitest.ts > save writer continuity write > writes a research record continuity into its spec.md
tests/save-continuity-write.vitest.ts > save writer continuity write > still writes no continuity into a non-research leaf without an implementation summary
tests/save-continuity-write.vitest.ts > save writer continuity write > stops the pointer walk below the specs root
tests/save-continuity-write.vitest.ts > save writer continuity write > stamps a completed leaf saved without continuity fields
tests/save-continuity-write.vitest.ts > save writer continuity write > stamps a completed leaf before the graph refresh, so the graph fingerprint matches
tests/save-continuity-write.vitest.ts > save writer session_ref > mints exactly the six pointer keys from the explicit inputs
tests/save-continuity-write.vitest.ts > save writer session_ref > mints the canonical claude locator kind directly
tests/save-continuity-write.vitest.ts > save writer session_ref > mints the canonical devin locator kind directly
tests/save-continuity-write.vitest.ts > save writer session_ref > mints the canonical pi locator kind directly
tests/save-continuity-write.vitest.ts > save writer session_ref > mints the canonical dsh locator kind directly
tests/save-continuity-write.vitest.ts > save writer session_ref > carries the stored pointer on a later save that cannot mint a new one
tests/save-continuity-write.vitest.ts > save writer session_ref > writes no pointer on a plan-only save
tests/save-continuity-write.vitest.ts > save writer session_ref > writes no pointer on a hybrid save
tests/save-continuity-write.vitest.ts > save writer session_ref > omits the pointer and names the reason when --runtime is given without --session-id
tests/save-continuity-write.vitest.ts > save writer session_ref > omits the pointer and names the reason when the session id fails the continuity shape
tests/save-continuity-write.vitest.ts > save writer session_ref > omits the pointer for a known runtime without a locator
tests/save-continuity-write.vitest.ts > save writer session_ref > ignores a payload-supplied pointer, names it and mints its own
tests/save-continuity-write.vitest.ts > save writer session_ref > never writes a payload-supplied pointer when the writer cannot mint one
tests/save-continuity-write.vitest.ts > save writer session_ref > drops a stored pointer that fails validation and names the field
tests/save-continuity-write.vitest.ts > save writer operator decisions > writes the decision into the leaf record and consumes its key
tests/save-continuity-write.vitest.ts > save writer operator decisions > writes operator decisions from a save that carries little else
tests/save-continuity-write.vitest.ts > save writer operator decisions > leaves the record byte-identical when the same save runs twice
tests/save-continuity-write.vitest.ts > save writer operator decisions > lists the entries and writes nothing outside --full-auto
tests/save-continuity-write.vitest.ts > save writer operator decisions > writes a cross-phase decision to the phase parent
tests/save-continuity-write.vitest.ts > save writer operator decisions > routes a local decision to the leaf the payload paths name
tests/save-continuity-write.vitest.ts > save writer operator decisions > writes nothing and leaves the key pending when the payload paths span two children
tests/save-continuity-write.vitest.ts > save writer operator decisions > fails the save and writes no record when a decision has no decided statement
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > level 1, untouched, reports no errors
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > level 2, untouched, reports no errors
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > level 3, untouched, reports no errors
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > a phase parent and its children, untouched, report no errors
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > creates every document its level contract calls for
tests/scaffold-passes-its-own-gate.vitest.ts > a scaffold passes the gate it ships with > derives its own graph metadata rather than leaving a guess
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > refreshes only the targeted packet and touches no sibling by default
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > accepts --spec-folder as the scoped target
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > rejects a missing target without --all
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > rejects an unknown argument
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > rejects a target that resolves outside a supported specs root
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > keeps the broad walk behind --all
tests/scoped-backfill-boundary.vitest.ts > scoped backfill boundary > cannot combine --all with a target
tests/scoped-backfill-boundary.vitest.ts > per-folder failure isolation > reports a corrupt folder failed while every healthy folder still refreshes
tests/scoped-backfill-boundary.vitest.ts > authoritative z_* exclusion helper > excludes only z_future from generated metadata while keeping z_archive
tests/scoped-backfill-boundary.vitest.ts > authoritative z_* exclusion helper > refuses a z_* prefixed folder in the description scanner by default
tests/scoped-backfill-boundary.vitest.ts > authoritative z_* exclusion helper > restores the prior scanner behavior when the flag is toggled off
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders required docs for Level 1 from manifest templates
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders required docs for Level 2 from manifest templates
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders required docs for Level 3 from manifest templates
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders required docs for Level 3+ from manifest templates
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders the phase-parent spec from the manifest template
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > renders each lazy add-on template with its stable anchor structure
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > scaffolds lazy add-ons only with explicit opt-in
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > keeps Level 1 as the minimum viable authored packet
tests/scaffold-golden-snapshots.vitest.ts > manifest template golden snapshots > carries verification in the merged tasks document and nowhere else
tests/scaffold-golden-snapshots.vitest.ts > review and research packet scaffolds > scaffolds a review packet with its nested document at the manifest path, validating strict untouched
tests/scaffold-golden-snapshots.vitest.ts > review and research packet scaffolds > scaffolds a research packet with its nested document at the manifest path, validating strict untouched
tests/scaffold-golden-snapshots.vitest.ts > review and research packet scaffolds > renders the review report and research spec templates from the manifest
tests/semantic-signal-golden.vitest.ts > semantic signal extractor golden coverage > keeps trigger extraction locked to the shared baseline for frozen inputs
tests/semantic-signal-golden.vitest.ts > semantic signal extractor golden coverage > returns trigger stats and preserves the baseline phrase order
tests/semantic-signal-golden.vitest.ts > semantic signal extractor golden coverage > applies balanced vs aggressive stopword profiles through one contract
tests/semantic-signal-golden.vitest.ts > semantic signal extractor golden coverage > supports ngram depth 1 through 4 without changing the public contract
tests/semantic-signal-golden.vitest.ts > semantic signal extractor golden coverage > keeps workflow topics, session topics, and summary trigger phrases aligned on the same dominant concepts
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > keeps natural-language prompts and responses that match hyphenated spec slugs
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > filters out unrelated prompts while keeping only spec-relevant stateless content
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > does not fall back to foreign-spec prompts when relevance filtering finds no safe match
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > keeps OpenCode tool evidence when command/output reference target spec files without direct filePath fields
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > extracts trigger phrases from merged specs that embed a second frontmatter block
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > extracts task progress and decisions from spec-folder docs without crashing on sparse inputs
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > degrades cleanly when git context is unavailable
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > keeps uncommitted file context in repositories that do not have a HEAD commit yet
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > reports detached HEAD metadata without losing commit context
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > keeps the full capped diff window when history exceeds the recent-commit limit
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > does not over-match similarly named spec folders when file targets do not overlap
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > prefers live observations over synthetic enrichment for project state snapshots
tests/session-enrichment.vitest.ts > stateless enrichment guardrails > re-exports stateless enrichment extractors through the barrel surface
tests/spec-affinity.vitest.ts > spec affinity evaluation > derives exact phrases and file targets from a target spec folder
tests/spec-affinity.vitest.ts > spec affinity evaluation > treats exact file-target references inside command text as valid spec anchors
tests/spec-affinity.vitest.ts > spec affinity evaluation > rejects same-workspace generic content when no spec-specific anchor is present
tests/spec-affinity.vitest.ts > spec affinity evaluation > filters single-word stopword trigger phrases from exact phrase anchors
tests/spec-affinity.vitest.ts > spec affinity evaluation > uses whole-phrase boundaries for exact phrase matches
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > prefers the canonical packet for an ambiguous unqualified identity
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > returns the canonical candidate for a new unqualified packet
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > falls back to a unique legacy-only packet for reads
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > preserves an explicit legacy-qualified path when canonical also exists
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > preserves an explicit canonical-qualified path when only legacy exists
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > preserves an absolute path without re-pointing it
tests/spec-root-canonical-resolver.vitest.ts > resolveSpecFolderCanonical > rejects unqualified traversal outside the canonical root
tests/spec-root-config-precedence.vitest.ts > spec root config precedence > orders canonical first while enumerating both existing roots
tests/spec-root-config-precedence.vitest.ts > spec root config precedence > falls back to the legacy root when it is the only existing root
tests/spec-root-config-precedence.vitest.ts > spec root config precedence > today: an alias of the canonical root dedupes to canonical and .skilled/specs is never listed
tests/spec-root-config-precedence.vitest.ts > spec root config precedence > skilled-only: an alias of the canonical root dedupes to canonical and .skilled/specs is never listed
tests/spec-root-config-precedence.vitest.ts > spec root config precedence > whole-link: an alias of the canonical root dedupes to canonical and .skilled/specs is never listed
tests/spec-root-collision-classifier.vitest.ts > classifySpecRootCollision > 'R1': 'canonical-only packet'
tests/spec-root-collision-classifier.vitest.ts > classifySpecRootCollision > 'R2': 'legacy-only packet'
tests/spec-root-collision-classifier.vitest.ts > classifySpecRootCollision > 'R3': 'valid relative root alias'
tests/spec-root-collision-classifier.vitest.ts > classifySpecRootCollision > 'R5': 'byte-identical duplicate packet'
tests/spec-root-collision-classifier.vitest.ts > classifySpecRootCollision > 'R6': 'divergent duplicate packet'
tests/spec-root-fallback-telemetry.vitest.ts > spec root fallback telemetry > starts with an empty clean compatibility window
tests/spec-root-fallback-telemetry.vitest.ts > spec root fallback telemetry > counts fallback hits and write attempts with their contexts
tests/spec-root-fallback-telemetry.vitest.ts > spec root fallback telemetry > treats either telemetry category as a dirty compatibility window
tests/spec-root-fallback-telemetry.vitest.ts > spec root fallback telemetry > resets counters and contexts back to a clean window
tests/spec-root-fallback-telemetry.vitest.ts > spec root fallback telemetry > returns contexts as a snapshot that cannot mutate internal state
tests/spec-root-fault-injection.vitest.ts > spec root migration fault injection > rejects a guarded write during the freeze and allows it after unfreeze
tests/spec-root-fault-injection.vitest.ts > spec root migration fault injection > restores the original packet byte-for-byte before writer unfreeze
tests/spec-root-fault-injection.vitest.ts > spec root migration fault injection > refuses destructive data rollback after a newer canonical write
tests/spec-root-fault-injection.vitest.ts > spec root migration fault injection > fails closed when cross-device fallback cannot publish its verified copy
tests/spec-root-independent-readers.vitest.ts > independent spec-root readers > prefers canonical metadata when both roots contain the same packet
tests/spec-root-independent-readers.vitest.ts > independent spec-root readers > retains legacy-only read fallback
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest > enumerates canonical packets when the legacy root is missing
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest > classifies the union of packet identities across independent roots
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest > produces stable content hashes independent of root spelling and directory order
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest > classifies a workspace-relative root alias without duplicate entries
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest > rejects an existing root that resolves outside the workspace
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest under each source-root layout > today: lists the legacy root by its .opencode spelling
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest under each source-root layout > whole-link: lists the legacy root by its .opencode spelling
tests/spec-root-migration-manifest.vitest.ts > buildMigrationManifest under each source-root layout > skilled-only: lists no legacy root, because the alias has no .skilled spelling
tests/spec-root-phase-pointer.vitest.ts > workflow phase-parent pointer refresh > updates the canonical parent from the resolved absolute child path
tests/spec-root-migration.vitest.ts > spec root migration > moves a legacy-only packet after quarantining its original bytes
tests/spec-root-migration.vitest.ts > spec root migration > restores the quarantined original byte-for-byte
tests/spec-root-migration.vitest.ts > spec root migration > defers a divergent duplicate without moving either packet
tests/spec-root-migration.vitest.ts > flipToTopLevelCanonical > flips specs/ to a real directory and .opencode/specs to a relative symlink
tests/spec-root-migration.vitest.ts > flipToTopLevelCanonical > refuses to run when a divergent-duplicate packet exists, and mutates nothing
tests/spec-root-migration.vitest.ts > migrateLegacyOnlyToCanonical under each source-root layout > today: moves a legacy-only packet reached through .opencode/specs
tests/spec-root-migration.vitest.ts > migrateLegacyOnlyToCanonical under each source-root layout > whole-link: moves a legacy-only packet reached through .opencode/specs
tests/spec-root-migration.vitest.ts > migrateLegacyOnlyToCanonical under each source-root layout > skilled-only: leaves a packet under .skilled/specs in place
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R1': 'canonical-only packet'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R2': 'legacy-only packet'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R3': 'valid relative root alias'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R4': 'independent roots with unique packets'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R5': 'byte-identical duplicate packet'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R6': 'divergent duplicate packet'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R7': 'dangling legacy alias'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R8': 'distinct plain legacy directory'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R9': 'plain file at legacy root'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > 'R10': 'misdirected external legacy alias'
tests/spec-root-validation-matrix.vitest.ts > spec root source validation matrix > keeps unqualified guarded writes canonical when no alias exists
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > today > 'R1': 'canonical-only packet'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > today > 'R3': 'valid relative root alias'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > today > 'R7': 'dangling legacy alias'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > skilled-only > 'R1': 'canonical-only packet'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > skilled-only > 'R3': 'valid relative root alias'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > skilled-only > 'R7': 'dangling legacy alias'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > whole-link > 'R1': 'canonical-only packet'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > whole-link > 'R3': 'valid relative root alias'
tests/spec-root-validation-matrix.vitest.ts > spec root matrix under each source-root layout > whole-link > 'R7': 'dangling legacy alias'
tests/spec-root-registry.vitest.ts > spec root resolver registry > contains only well-formed resolver entries
tests/spec-root-registry.vitest.ts > spec root resolver registry > every listed source path exists on disk
tests/spec-root-registry.vitest.ts > spec root resolver registry > has no registry coverage gaps
tests/spec-root-write-guard.vitest.ts > assertSpecWriteAllowed > allows a canonical-only packet while writers are unfrozen
tests/spec-root-write-guard.vitest.ts > assertSpecWriteAllowed > rejects a divergent duplicate and reports both roots
tests/spec-root-write-guard.vitest.ts > assertSpecWriteAllowed > rejects writes while the global writer freeze is active
tests/spec-root-write-guard.vitest.ts > assertSpecWriteAllowed > fails closed when no readable packet root can be established
tests/spec-root-writer-autosave.vitest.ts > spec-root autosave writer > resolves a bare packet identity to a legacy-only packet before saving
tests/spec-root-writer-autosave.vitest.ts > spec-root autosave writer > creates untracked packets under the canonical root
tests/spec-root-writer-autosave.vitest.ts > spec-root autosave writer > numbers a track packet from the canonical track folder
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > allows writes when no marker or process freeze exists
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > creates a durable marker and reports the freeze reason
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > observes the marker from a fresh module instance without overwriting it
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > atomically clears the marker and process state
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > fails closed for an ambiguous marker
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > fails closed when the runtime marker directory cannot be inspected
tests/spec-writer-freeze.vitest.ts > spec packet writer freeze > rejects an empty freeze reason without creating a marker
tests/stale-fallback.vitest.ts > stale trigger index fallback > finds an untracked unindexed document through the CLI
tests/stale-fallback.vitest.ts > stale trigger index fallback > skips documents under scratch and archive directories
tests/stale-fallback.vitest.ts > stale trigger index fallback > ignores a markdown file whose name is not a spec document
tests/stale-fallback.vitest.ts > stale trigger index fallback > includes the research summary and excludes documents nested under research
tests/stale-fallback.vitest.ts > stale trigger index fallback > reports fallback unavailable outside a Git work tree without a scored result
tests/stale-fallback.vitest.ts > stale trigger index fallback > walks the named root instead of the caller repository when one is given
tests/stale-fallback.vitest.ts > stale trigger index fallback > skips the scan when the index read lives outside the walked root
tests/stale-fallback.vitest.ts > stale trigger index fallback > does not count an indexed document among stale fallback files
tests/stale-fallback.vitest.ts > stale trigger index fallback > keeps an explicit index lookup index-only
tests/stale-fallback.vitest.ts > stale trigger index fallback > keeps fallback disabled when the CLI flag is set
tests/stale-fallback.vitest.ts > stale trigger index fallback > does not add fallback metadata when the index already matches
tests/stale-fallback.vitest.ts > stale trigger index fallback > scopes fallback results to the requested packet
tests/stale-fallback.vitest.ts > stale trigger index fallback > caps CLI results while reporting the total fallback candidates
tests/stale-fallback.vitest.ts > stale trigger index fallback > caps fallback reads at maxFiles and keeps the first path by code-unit order
tests/stale-fallback.vitest.ts > stale trigger index fallback > prints byte-identical JSON for repeated lookups on the same tree
tests/stale-fallback.vitest.ts > stale trigger index fallback > skips fallback metadata for a prompt with no eligible token
tests/stale-fallback.vitest.ts > stale trigger index fallback > prints fallback counts in human-readable output
tests/stale-fallback.vitest.ts > stale trigger index fallback > lists a repeated declared phrase only once in a fallback result
tests/stale-fallback.vitest.ts > stale trigger index fallback > finds a packet filed in a sub-track and applies the same exclusions there
tests/stale-fallback.vitest.ts > stale trigger index fallback > scopes fallback results to a sub-track
tests/stale-fallback.vitest.ts > stale trigger index fallback > refuses a scope that climbs out of the spec tree
tests/stale-fallback.vitest.ts > stale trigger index fallback > refuses a scope that reaches outside the spec tree through a link
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > accepts a declared sub-track when its parent has no metadata and skips refresh
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > smokes create.sh handling for each container in the reader's case matrix
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > keeps validation sub-track classification aligned with the reader across the case matrix
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > does not recurse through a child under a numbered specs-root folder
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > keeps archive parent handling aligned with the reader across the case matrix
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > keeps graph parent derivation aligned with the reader across the case matrix
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > keeps repair-derived parent repair aligned with the reader across the case matrix
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > creates a missing sub-track metadata file when archiving out of it
tests/subtrack-predicate-parity.vitest.ts > declared sub-track predicate parity > judges the track segment the way the reader does for every consumer
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > corrects a stale Draft parent-map row from the child spec status
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > leaves an already-correct parent-map row unchanged
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > does not force-complete explicitly in-progress or not-started children
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > reports descendant completion_pct mismatches without writing them
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > keeps rows idempotent and reports the same completion mismatches without writing files
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > leaves a lowercase complete map row unchanged when the child status is Complete
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > leaves a Done map row unchanged when the child status is Complete
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > uses only the leading child status when updating a map row
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > warns when a blank line ends the table and reports later children without rows
tests/sync-phase-map-status.vitest.ts > sync-phase-map-status > warns when a child has no Phase Documentation Map row
tests/strict-pass-freshness.vitest.ts > strict-pass freshness baseline handling > rejects a repository-local root symlink that resolves outside the repository
tests/strict-pass-freshness.vitest.ts > strict-pass freshness baseline handling > fails a current failure omitted from a partial baseline
tests/strict-pass-freshness.vitest.ts > strict-pass freshness baseline handling > reports a folder whose validation is switched off as skipped, never as a pass
tests/strict-pass-freshness.vitest.ts > strict-pass freshness baseline handling > does not let a skipped baseline row pass off a later failure as a known one
tests/strict-pass-freshness.vitest.ts > strict-pass freshness baseline handling > treats an empty loaded baseline as real baseline content
tests/symlinked-project-root.vitest.ts > project root for a repository that links .skilled > is the linked repository, not the runtime repository
tests/symlinked-project-root.vitest.ts > project root for a repository that links .skilled > is the repository top-level when the run starts in a subfolder
tests/symlinked-project-root.vitest.ts > project root for a repository that links .skilled > stays the runtime repository for a run inside the runtime repository itself
tests/symlinked-project-root.vitest.ts > project root for a repository that links .skilled > falls back to the runtime repository outside any project and says so on stderr
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > saves to the linked repository's own packet
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > saves a packet reached through a specs folder that links into another workspace
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > honours an explicit project root from a directory outside any repository
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > does not exit 0 on a save with nothing in it
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > rejects an unknown option the same way with and without --preserve-symlinks-main
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > refuses a --project-root that sits outside the working repository
tests/symlinked-project-root.vitest.ts > generate-context launched through the link > refuses a --project-root that does not exist
tests/task-enrichment.vitest.ts > isGenericContentTask > marks known generic task labels as generic
tests/task-enrichment.vitest.ts > isGenericContentTask > does not mark specific tasks as generic
tests/task-enrichment.vitest.ts > isContaminatedMemoryName > detects leaked template and instructional titles
tests/task-enrichment.vitest.ts > shouldEnrichTaskFromSpecTitle > blocks enrichment in JSON data mode
tests/task-enrichment.vitest.ts > shouldEnrichTaskFromSpecTitle > allows enrichment in stateless mode for generic tasks
tests/task-enrichment.vitest.ts > shouldEnrichTaskFromSpecTitle > skips enrichment for specific tasks even in stateless mode
tests/task-enrichment.vitest.ts > normalizeSpecTitleForMemory > strips spec-style prefixes and template suffixes from frontmatter titles
tests/task-enrichment.vitest.ts > normalizeSpecTitleForMemory > strips markdown heading noise and trailing punctuation
tests/task-enrichment.vitest.ts > slug outcome guardrail > keeps JSON mode behavior unchanged
tests/task-enrichment.vitest.ts > slug outcome guardrail > normalizes spec-prefixed frontmatter titles before slug generation
tests/task-enrichment.vitest.ts > slug outcome guardrail > uses spec-derived task in stateless mode
tests/task-enrichment.vitest.ts > slug outcome guardrail > keeps slug fallback in sync with generic-task classification
tests/task-enrichment.vitest.ts > slug outcome guardrail > falls back for JSON mode implementation-and-updates
tests/task-enrichment.vitest.ts > slug outcome guardrail > uses enriched spec title for stateless implementation-and-updates
tests/task-enrichment.vitest.ts > slug outcome guardrail > ignores contaminated task text and prefers specific alternatives
tests/task-enrichment.vitest.ts > slug outcome guardrail > strips literal mustache tokens from candidate titles before slug generation
tests/task-enrichment.vitest.ts > slug outcome guardrail > picks the best specific memory task from task, spec title, and folder base
tests/task-enrichment.vitest.ts > slug outcome guardrail > prefers specific session semantics over folder fallback when task and spec title are unusable
tests/task-enrichment.vitest.ts > slug outcome guardrail > skips spec title fallback in file-backed mode and preserves other specific candidates
tests/task-enrichment.vitest.ts > slug outcome guardrail > falls back to the folder base when file-backed mode has no usable candidates
tests/task-enrichment.vitest.ts > slug outcome guardrail > returns the first non-generic, non-contaminated content name
tests/task-enrichment.vitest.ts > memory quality lint gate > fails placeholder leakage for obvious empty generated values
tests/task-enrichment.vitest.ts > memory quality lint gate > does not treat quoted template tokens in session content as V6 leakage
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when tool_count is zero but execution evidence is present
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when foreign spec ids dominate the generated content
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when frontmatter trigger phrases reference a foreign spec id
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when low-volume foreign spec ids are scattered across multiple specs
tests/task-enrichment.vitest.ts > memory quality lint gate > allows child phase ids when the target spec folder contains a child spec.md
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when template instructional text leaks into the title
tests/task-enrichment.vitest.ts > memory quality lint gate > fails when a generic stub title survives into the rendered output
tests/task-enrichment.vitest.ts > memory quality lint gate > fails V10 when filesystem truth diverges sharply from captured transcript counts
tests/task-enrichment.vitest.ts > memory quality lint gate > passes V10 when small count differences stay within the tolerance window
tests/task-enrichment.vitest.ts > memory quality lint gate > passes V10 when file count difference is below the relaxed threshold
tests/task-enrichment.vitest.ts > memory quality lint gate > passes V10 when capturedFileCount is 0 (no file references in session)
tests/task-enrichment.vitest.ts > memory quality lint gate > passes V10 when filesystemFileCount is 0 (symmetric zero-count case)
tests/task-enrichment.vitest.ts > memory quality lint gate > passes practical generated memory content
tests/task-enrichment.vitest.ts > content filter contamination audit > applies configured noise patterns and emits an audit trail
tests/task-enrichment.vitest.ts > workflow seam guardrail > promotes strong recent-context semantics into quick summary through the real collector path
tests/task-enrichment.vitest.ts > workflow seam guardrail > splits captured, filesystem, and git file counts while treating filesystem truth as FILE_COUNT
tests/task-enrichment.vitest.ts > workflow seam guardrail > does not expose a legacy context filename for file-backed workflow saves
tests/task-enrichment.vitest.ts > workflow seam guardrail > records the three-stage contamination audit trail via structured logging
tests/task-enrichment.vitest.ts > workflow seam guardrail > preserves source provenance inputs without reviving a legacy rendered memory file
tests/task-enrichment.vitest.ts > workflow seam guardrail > allows stateless saves when captured files match code paths declared in the target spec without returning a legacy filename
tests/task-enrichment.vitest.ts > workflow seam guardrail > hard-blocks stateless saves via Block B when captured file paths do not overlap with target spec folder
tests/task-enrichment.vitest.ts > workflow seam guardrail > rejects thin explicit JSON saves with INSUFFICIENT_CONTEXT_ABORT
tests/task-enrichment.vitest.ts > workflow seam guardrail > uses canonical score01 when applying the workflow quality abort threshold
tests/task-enrichment.vitest.ts > workflow seam guardrail > does not let file-backed state leak into a later stateless workflow run or expose legacy filenames
tests/task-enrichment.vitest.ts > workflow seam guardrail > serializes overlapping workflow runs so per-run config state stays isolated
tests/task-enrichment.vitest.ts > workflow seam guardrail > keeps direct preloaded workflow saves off the retired contextFilename contract
tests/task-enrichment.vitest.ts > workflow seam guardrail > V11 fails when description contains API error text
tests/task-enrichment.vitest.ts > workflow seam guardrail > V11 fails when trigger phrases are error-dominated
tests/task-enrichment.vitest.ts > workflow seam guardrail > V11 passes on clean memory content
tests/task-enrichment.vitest.ts > workflow seam guardrail > strips broader leaked HTML outside fenced code blocks while preserving fenced HTML
tests/sweep-memory-residue.vitest.ts > attributeTerms > reports every term a line names, not just the leftmost
tests/sweep-memory-residue.vitest.ts > attributeTerms > keeps a longer tool name from being counted as its own prefix
tests/sweep-memory-residue.vitest.ts > attributeTerms > falls back to an explicit marker rather than dropping an unexplained hit
tests/sweep-memory-residue.vitest.ts > classifyLifecycle > treats a recorded-evidence directory as historical
tests/sweep-memory-residue.vitest.ts > classifyLifecycle > treats a JSONL file as historical wherever it sits
tests/sweep-memory-residue.vitest.ts > classifyLifecycle > treats an ordinary instruction path as live
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .env.example to env
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/skills/system-spec-kit/runtime/cli/tests/x.vitest.ts to tests
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/hooks/session-prime.sh to hooks
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .opencode/plugins/demo.js to plugins
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/bin/demo.cjs to bin
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .claude/agents/code.md to agents
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/commands/demo/run.md to commands
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .claude/mcp.json to config
tests/sweep-memory-residue.vitest.ts > classifySurface > routes opencode.json to config
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/skills/system-spec-kit/shared/embeddings.ts to code
tests/sweep-memory-residue.vitest.ts > classifySurface > routes .skilled/skills/sk-code/SKILL.md to skills
tests/sweep-memory-residue.vitest.ts > classifySurface > routes specs/demo/spec.md to docs
tests/sweep-memory-residue.vitest.ts > classifySurface > routes specs/demo/evidence/out.json to other
tests/sweep-memory-residue.vitest.ts > globToRegExp > lets a leading double star match at any depth including none
tests/sweep-memory-residue.vitest.ts > globToRegExp > keeps a single star inside one path segment
tests/sweep-memory-residue.vitest.ts > loadAllowlist > fails closed on an entry with no reason rather than dropping it
tests/sweep-memory-residue.vitest.ts > loadAllowlist > matches a plain entry by prefix and a starred entry as a glob
tests/sweep-memory-residue.vitest.ts > sweep > classifies live, historical and allowlisted hits, including inside the surviving package
tests/sweep-memory-residue.vitest.ts > sweep > refuses a root that is not a repository root instead of reporting a clean tree
tests/sweep-memory-residue.vitest.ts > sweep CLI > exits 1 while a live hit remains and emits parseable --json
tests/sweep-memory-residue.vitest.ts > sweep CLI > exits 0 once nothing live remains and writes the report where asked
tests/sweep-memory-residue.vitest.ts > sweep CLI > exits 2 when ripgrep cannot be executed
tests/sweep-memory-residue.vitest.ts > sweep CLI > exits 2 on an unknown argument rather than sweeping with a silent default
tests/template-phrase-cleanup-hardening.vitest.ts > template phrase cleanup hardening > renames a complete temporary write, retains its mode and reports hashes
tests/template-phrase-cleanup-hardening.vitest.ts > template phrase cleanup hardening > leaves the original file intact when rename fails
tests/template-phrase-cleanup-hardening.vitest.ts > template phrase cleanup hardening > reports no-frontmatter files with the fixer path and command
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > counts exact template blocks separately for live and archived packets
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > counts partial carriers separately from exact template blocks
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > ignores demo and quarantine snapshots under scratch and containment directories
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > keeps dry runs byte-identical and skips archived packets by default
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > replaces only the template blocks, preserves author phrases and reports file hashes
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > seeds acceptance criteria defaults as a single slug phrase
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > cleans exact and partial lists across plan, tasks, and implementation summaries
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > removes default phrases from a mixed list, keeps author phrases in order, and adds no seed
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > reseeds a list that carries only some of a kind defaults
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > reseeds a cut-off description phrase that ends on a stop word
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > drops a cut-off phrase when the trim empties it or repeats a phrase the list carries
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > leaves cut-off phrases in other document kinds untouched
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > never removes phrases outside the default set and reruns cleanly
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > does not reseed a slug phrase that already survives outside the template block
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > removes the template block when every seeded phrase already survives
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > reports and skips files with malformed frontmatter
tests/template-phrase-cleanup.vitest.ts > template phrase census and cleanup > returns exit code 2 when the census root is missing
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > blocks a newly added feature specification phrase
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > blocks a newly added context phrase
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > warns on a newly added single-token phrase without blocking
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > does not re-grade a negative phrase already in HEAD
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > skips the entire phrase gate when bypassed
tests/template-phrase-lint-hook.vitest.ts > pre-commit template phrase lint > honours the persistent registry switch for the phrase gate
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 1 spec section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 1 plan section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 1 tasks section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 1 implementation-summary section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 2 spec section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 2 plan section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 2 tasks section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 2 implementation-summary section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3 spec section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3 plan section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3 tasks section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3 implementation-summary section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3+ spec section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3+ plan section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3+ tasks section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > gives every Level 3+ implementation-summary section one fill line
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the acceptance-criteria.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the debug-delegation.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the decision-record.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the goal.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the handover.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the research.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > keeps every fill note in the timeline.md.tmpl add-on well formed
tests/template-fill-guidance.vitest.ts > template section fill guidance > rejects a fill note that has a GOOD example but no WEAK one
tests/template-phrase-integration.vitest.ts > template phrase seeding, cleanup and lint integration > seeds a packet, cleans a restored template block and blocks a newly added default
tests/template-phrase-provenance.vitest.ts > template phrase provenance > trims only the seeded phrase and leaves an authored eight-word phrase with the same shape
tests/template-phrase-provenance.vitest.ts > template phrase provenance > trims a seeded phrase whose source is the description.json identity rather than the frontmatter
tests/template-structure.vitest.ts > template structure helper > resolves live template paths by level and basename
tests/template-structure.vitest.ts > template structure helper > rejects missing or invalid CLI levels
tests/template-structure.vitest.ts > template structure helper > derives required header and anchor order from the active template contract
tests/template-structure.vitest.ts > template structure helper > treats optional template sections as allowed content instead of extra custom drift
tests/template-structure.vitest.ts > template structure helper > flags reordered required anchors and missing required headers on mutated documents
tests/template-structure.vitest.ts > template structure helper > supports dynamic decision-record contracts without hardcoding a single ADR title
tests/template-structure.vitest.ts > template structure helper > merges the phase-parent addendum into spec contracts for phase parent folders
tests/template-structure.vitest.ts > template structure helper > merges the phase-child addendum into spec contracts for child phase folders
tests/template-staleness-discovery.vitest.ts > template staleness discovery > counts only live packets under the spec root and never an archived, scratch, fixture or vendored one
tests/template-staleness-discovery.vitest.ts > template staleness discovery > reports no folders and exits clean for a root carrying no spec document root
tests/template-staleness-discovery.vitest.ts > template staleness discovery > keeps a numbered packet whose name ends in "-fixtures" while pruning an actual fixture directory
tests/template-staleness-discovery.vitest.ts > template staleness discovery > follows a spec root that is a symlink, as a host sharing one packet tree does
tests/template-staleness-discovery.vitest.ts > template staleness discovery > never reports a packet from a deep-run artifact tree or from a vendored Skilled copy
tests/template-staleness-discovery.vitest.ts > template staleness discovery > skips a git-ignored mirror under the spec root
tests/template-staleness-discovery.vitest.ts > template staleness discovery > skips a packet whose own spec.md is git-ignored
tests/template-staleness-discovery.vitest.ts > template staleness discovery > counts every folder when the root is not a git checkout, since there is nothing to ignore
tests/template-version-parity.vitest.ts > template version parity > declares in the manifest the version each shipped template declares in its marker
tests/template-version-parity.vitest.ts > template version parity > lists a version for every template a document entry names, and names no template that is missing
tests/template-version-parity.vitest.ts > template version parity > keeps the lazy add-on list identical across the four numbered levels
tests/template-version-parity.vitest.ts > template version parity > pins how the packet-type rows narrow the lazy list
tests/template-version-parity.vitest.ts > template version parity > points the staleness checker at the manifest that exists
tests/test-integration.vitest.ts > cross-cutting export surface parity > keeps the key scripts export surfaces available
tests/test-integration.vitest.ts > memory save workflow parity > preserves valid anchor comments through workflow HTML cleanup
tests/test-integration.vitest.ts > memory save workflow parity > preserves unclosed anchor openers for downstream validation
tests/test-integration.vitest.ts > memory save workflow parity > confirms generate-context.js compiled entrypoint exists
tests/title-builder-no-filename-suffix.vitest.ts > title builder legacy-filename compatibility > keeps the dashboard title free of legacy filename suffix garbage
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > relativizes single-value path keys
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > relativizes array-value path keys
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > deletes single path keys that resolve outside project
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > deletes array path keys when all entries resolve outside project
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > does not mutate the original input object
tests/tool-sanitizer.vitest.ts > sanitizeToolInputPaths > passes through non-path keys unchanged
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > returns canonical values unchanged
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > maps success aliases to completed
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > maps failure aliases to error
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > maps in-progress aliases to pending
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > returns unknown for unrecognized values
tests/tool-sanitizer.vitest.ts > normalizeToolStatus > is case-insensitive
tests/tool-sanitizer.vitest.ts > isApiErrorContent > detects API Error: NNN pattern
tests/tool-sanitizer.vitest.ts > isApiErrorContent > detects JSON error payloads
tests/tool-sanitizer.vitest.ts > isApiErrorContent > does not flag normal content
tests/tool-sanitizer.vitest.ts > isApiErrorContent > returns false for empty or non-string input
tests/tool-sanitizer.vitest.ts > sanitizeToolDescription > replaces absolute paths
tests/tool-sanitizer.vitest.ts > sanitizeToolDescription > truncates long descriptions
tests/track-roots.vitest.ts > track-root discovery > treats a linked sub-track description the same in both views
tests/track-roots.vitest.ts > track-root discovery > does not accept a differently cased level as a declaration
tests/track-roots.vitest.ts > track-root discovery > distinguishes a declared folder that also holds its own spec in both views
tests/track-roots.vitest.ts > track-root discovery > returns the same declared sub-tracks from the working tree and commit
tests/track-roots.vitest.ts > sweep-track-roots > passes when every track declares exactly its packets on disk
tests/track-roots.vitest.ts > sweep-track-roots > reports a track whose names differ even when the counts agree
tests/track-roots.vitest.ts > sweep-track-roots > reads a commit rather than the working tree with --rev
tests/track-roots.vitest.ts > sweep-track-roots > skips a symlinked track under --rev
tests/track-roots.vitest.ts > sweep-track-roots > passes an unsorted list that names each packet once
tests/track-roots.vitest.ts > sweep-track-roots > reports a packet declared more than once
tests/track-roots.vitest.ts > refresh-track-roots > reports what it would change and writes nothing without --apply
tests/track-roots.vitest.ts > refresh-track-roots > sets children_ids to the numbered packets on disk and changes nothing else
tests/track-roots.vitest.ts > refresh-track-roots > does not count a numbered folder with no spec.md as a packet
tests/track-roots.vitest.ts > refresh-track-roots > leaves a track that already matches byte for byte
tests/track-roots.vitest.ts > refresh-track-roots > drops a repeated entry on --apply and leaves the sweep clean
tests/track-roots.vitest.ts > refresh-track-roots > reports unreadable metadata, writes nothing to it and fails
tests/track-roots.vitest.ts > refresh-track-roots > refuses a symlinked sub-track metadata file and preserves its target
tests/track-roots.vitest.ts > refresh-track-roots > refuses a symlinked top-level metadata file and preserves its target
tests/track-roots.vitest.ts > refresh-track-roots > touches only the track named by --track
tests/track-roots.vitest.ts > refresh-track-roots > refreshes the immediate numbered children of a sub-track
tests/track-roots.vitest.ts > refresh-track-roots > calls missing sub-track metadata missing, not unreadable
tests/track-roots.vitest.ts > refresh-track-roots > seeds missing sub-track metadata so the sweep passes
tests/track-roots.vitest.ts > refresh-track-roots > leaves invalid sub-track metadata unchanged
tests/track-roots.vitest.ts > refresh-track-roots > reports a missing sub-track path and exits with usage status
tests/track-roots.vitest.ts > refresh-track-roots > leaves the sweep clean once every readable track is refreshed
tests/track-roots.vitest.ts > flat-tree refresh compatibility > keeps flat-tree metadata byte-identical after refresh
tests/track-roots.vitest.ts > sweep-track-roots with sub-tracks > reports the undeclared folder and symlink once without changing either view result
tests/track-roots.vitest.ts > sweep-track-roots with sub-tracks > fails a track that holds a flat packet beside a sub-track, in both views
tests/track-roots.vitest.ts > sweep-track-roots with sub-tracks > warns about a numbered folder without spec.md beside sub-tracks and still passes
tests/track-roots.vitest.ts > sweep-track-roots with sub-tracks > detects drift in a declared sub-track
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > removes phrases containing forward slash
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > removes phrases containing backslash
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > removes phrases with leading numeric prefix
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > preserves leading numeric phrases when they are explicitly manual
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > still rejects path-like manual phrases
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 1: path-like phrase removal > retains phrases without path separators
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 2: short token removal > removes single-character tokens not in allow-list
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 2: short token removal > removes two-character tokens not in allow-list
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 2: short token removal > retains allow-listed short tokens
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 2: short token removal > retains multi-word phrases where at least one word >= 3 chars
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 2: short token removal > removes multi-word phrases where all words < 3 chars and none in allow-list
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 3: n-gram shingle subset removal > removes shorter phrase that is substring of longer retained phrase
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 3: n-gram shingle subset removal > retains both phrases when neither is substring of the other
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > Stage 3: n-gram shingle subset removal > handles case-insensitive substring check
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > combined pipeline > applies all three stages in sequence
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > combined pipeline > returns empty array for all-filtered input
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > combined pipeline > returns empty array for empty input
tests/trigger-phrase-filter.vitest.ts > filterTriggerPhrases > combined pipeline > is idempotent — applying twice produces same output
tests/tree-thinning.vitest.ts > estimateTokenCount > T1-A: returns 0 for empty string
tests/tree-thinning.vitest.ts > estimateTokenCount > T1-B: estimates 1 token for 4 chars
tests/tree-thinning.vitest.ts > estimateTokenCount > T1-C: rounds up for partial chars
tests/tree-thinning.vitest.ts > estimateTokenCount > T1-D: scales linearly
tests/tree-thinning.vitest.ts > deriveParentPath > T2-A: returns parent directory
tests/tree-thinning.vitest.ts > deriveParentPath > T2-B: returns null for top-level filename
tests/tree-thinning.vitest.ts > deriveParentPath > T2-C: handles nested paths
tests/tree-thinning.vitest.ts > Merge threshold (200 tokens) — standard files > T4-A: file with 199 tokens is marked merged-into-parent
tests/tree-thinning.vitest.ts > Merge threshold (200 tokens) — standard files > T4-B: file with exactly 200 tokens is NOT merged (boundary: < 200)
tests/tree-thinning.vitest.ts > Merge threshold (200 tokens) — standard files > T4-C: file with 1 token is merged
tests/tree-thinning.vitest.ts > Merge threshold (200 tokens) — standard files > T4-D: merged files produce a MergedFileEntry per parent directory
tests/tree-thinning.vitest.ts > Merge threshold (200 tokens) — standard files > T4-E: files from different parents produce separate MergedFileEntry records
tests/tree-thinning.vitest.ts > Content-as-summary threshold (500 tokens) — standard files > T5-A: file with 499 tokens is content-as-summary
tests/tree-thinning.vitest.ts > Content-as-summary threshold (500 tokens) — standard files > T5-B: file with exactly 500 tokens is kept (boundary: < 500)
tests/tree-thinning.vitest.ts > Content-as-summary threshold (500 tokens) — standard files > T5-C: file with 600 tokens is kept
tests/tree-thinning.vitest.ts > No content loss during merge > T6-A: merged summary contains all child content
tests/tree-thinning.vitest.ts > No content loss during merge > T6-B: merged summary contains source path references
tests/tree-thinning.vitest.ts > No content loss during merge > T6-C: kept files retain their original content unchanged
tests/tree-thinning.vitest.ts > No content loss during merge > T6-D: content-as-summary files retain their original content
tests/tree-thinning.vitest.ts > No content loss during merge > T6-E: empty file list produces empty result with zero stats
tests/tree-thinning.vitest.ts > Stats correctness > T8-A: totalFiles matches input length
tests/tree-thinning.vitest.ts > Stats correctness > T8-B: thinnedCount counts only content-as-summary actions
tests/tree-thinning.vitest.ts > Stats correctness > T8-C: tokensSaved is non-negative
tests/tree-thinning.vitest.ts > Pre-pipeline boundary — thinning is pure, no side effects > T9-A: applyTreeThinning is a pure function — same input always produces same output
tests/tree-thinning.vitest.ts > Pre-pipeline boundary — thinning is pure, no side effects > T9-B: applyTreeThinning does not mutate input FileEntry objects
tests/tree-thinning.vitest.ts > Pre-pipeline boundary — thinning is pure, no side effects > T9-C: thinned entries preserve tokenCount from estimation
tests/tree-thinning.vitest.ts > Pre-pipeline boundary — thinning is pure, no side effects > T9-D: custom config overrides default thresholds
tests/tree-thinning.vitest.ts > Pre-pipeline boundary — thinning is pure, no side effects > T9-E: Stage 1 inputs (kept files) are identical to original content — no transformation
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > keeps the rebuild job free of any secret and grants it read access only
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > hands the token to the push step alone
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > runs no node, npm, npx, tsc, generator or repository script in the push job
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > uses only the pinned checkout action in the push job
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > checks out both jobs with the pinned action and without persisting the credential
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > scopes the push job to the push and to reading the run artifacts
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > binds the push job to the committed output of the rebuild job
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > uploads the bundle under the name and path the push job downloads, with a short retention
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > checks the fetched commit against the rebuild job output in the verify step
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > pins the push command to an explicit URL and a protocol allowance
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > job and step structure > checks the authentication and ruleset branch before the anchored race classification
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin moves before the push > exits 0 with a notice and pushes nothing
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin moves before the push > leaves origin on the race commit, with the rebuild unpushed
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin does not move > pushes the rebuild on top of the base and exits 0
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin does not move > ends the rebuild commit with the loop-guard trailer as its last line
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin does not move > marks the rebuild commit so the pushed commit starts no workflow run
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when origin does not move > publishes all four generated files rebuilt from the current corpus
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > the push URL and the protocol pin > ignores a planted pushurl, so the explicit URL is the only target and no helper runs
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > the push URL and the protocol pin > runs the same planted helper when the push names the remote, so the no-leak result is not vacuous
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > the push URL and the protocol pin > refuses the rewritten file transport under the pin and pushes nothing to the rewrite target
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > the push URL and the protocol pin > delivers the same push to the rewrite target once file is allowed, so the refusal is the pin
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > push failures > fails a non-race rejection that the remote reports as remote rejected
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > push failures > fails when only the remote message contains the words non-fast-forward
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > push failures > fails an authentication-style rejection and keeps the token guidance
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > bundle verification before the push > refuses a commit that changes a path outside the trigger index outputs
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > bundle verification before the push > refuses a bundle that holds more than the one rebuild commit
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (regenerate-partial) > fails the regenerate step
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (regenerate-partial) > makes no commit
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (regenerate-partial) > pushes nothing to origin
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-partial) > fails the commit step
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-partial) > makes no commit
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-partial) > pushes nothing to origin
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-partial) > stops on the exit check before the content check runs
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-complete) > fails the commit step
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-complete) > makes no commit
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-complete) > pushes nothing to origin
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > when the generator exits nonzero after writing (fresh-complete) > stops on the exit check before the content check runs
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > keeps the token and its header out of every step output, output file and repository config
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > keeps the token out of the generator environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > keeps the token out of the generator's parent process
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > never runs a hook during the workflow steps, which keep hooks off for every git command
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > runs the planted pre-commit hook on a control commit, so the hook records are live
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > keeps the token and its header out of every hook environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin moves before the push > never runs the pre-push hook
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > keeps the token and its header out of every step output, output file and repository config
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > keeps the token out of the generator environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > keeps the token out of the generator's parent process
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > never runs a hook during the workflow steps, which keep hooks off for every git command
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > runs the planted pre-commit hook on a control commit, so the hook records are live
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > keeps the token and its header out of every hook environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when origin does not move > never runs the pre-push hook
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > keeps the token and its header out of every step output, output file and repository config
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > keeps the token out of the generator environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > keeps the token out of the generator's parent process
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > never runs a hook during the workflow steps, which keep hooks off for every git command
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > runs the planted pre-commit hook on a control commit, so the hook records are live
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > keeps the token and its header out of every hook environment
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > hygiene when the push is refused for authentication > never runs the pre-push hook
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > reads the token from a readable parent as yes, so the clean parent results are not vacuous
tests/trigger-index-rebuild-workflow.vitest.ts > trigger-index rebuild workflow > keeps the generator and the upload out of the push job, which holds only the bundle
tests/trigger-index.vitest.ts > normalizeTriggerText > lowercases and folds separator runs into single spaces
tests/trigger-index.vitest.ts > normalizeTriggerText > folds non-ASCII characters into separators rather than keeping them
tests/trigger-index.vitest.ts > queryTokens > drops tokens below the candidate floor and reports why
tests/trigger-index.vitest.ts > queryTokens > keeps the first eight eligible tokens and reports the overflow
tests/trigger-index.vitest.ts > scorePhrase > ranks the four scoring classes the way the trigger lane does
tests/trigger-index.vitest.ts > scorePhrase > refuses a single-token phrase unless it equals the query exactly
tests/trigger-index.vitest.ts > judgeTriggerPhrase > rejects default phrases from all five templates as template-default
tests/trigger-index.vitest.ts > artifact encoding > interns each owning path once and addresses it by integer id
tests/trigger-index.vitest.ts > artifact encoding > carries no per-phrase token list, no raw spellings and no trigram postings
tests/trigger-index.vitest.ts > artifact encoding > moves the raw spellings to the variants sidecar rather than dropping them
tests/trigger-index.vitest.ts > artifact encoding > emits a canonically sorted encoding that survives a parse round trip
tests/trigger-index.vitest.ts > stableStringify > sorts integer-like keys lexicographically, unlike JSON.stringify
tests/trigger-index.vitest.ts > stableStringify > round-trips through JSON.parse to identical text
tests/trigger-index.vitest.ts > readTriggerPhrases > reads a well-formed list
tests/trigger-index.vitest.ts > readTriggerPhrases > reads the alias spelling and reports it while still yielding phrases
tests/trigger-index.vitest.ts > readTriggerPhrases > separates a valid empty list from a missing key
tests/trigger-index.vitest.ts > readTriggerPhrases > reports an unclosed frontmatter block by its opening line
tests/trigger-index.vitest.ts > readTriggerPhrases > reports a prose block between delimiters as non-YAML
tests/trigger-index.vitest.ts > readTriggerPhrases > accepts a YAML comment and a one-space indented sequence
tests/trigger-index.vitest.ts > readTriggerPhrases > reports a scalar where a sequence belongs
tests/trigger-index.vitest.ts > readTriggerPhrases > reports a non-string member instead of coercing it
tests/trigger-index.vitest.ts > readTriggerPhrases > reports a duplicate phrase once and keeps a single copy
tests/trigger-index.vitest.ts > readTriggerPhrases > truncates an oversized phrase and reports it rather than dropping it
tests/trigger-index.vitest.ts > walkCorpus > walks both roots, prunes excluded trees, and ignores non-markdown files
tests/trigger-index.vitest.ts > walkCorpus > skips what git ignores, keeps a tracked file that matches an ignore rule, and lists neither as skipped
tests/trigger-index.vitest.ts > walkCorpus > refuses a symlinked document whose target is outside the repository
tests/trigger-index.vitest.ts > walkCorpus > never indexes one document twice through a symlink
tests/trigger-index.vitest.ts > walkCorpus > records the same skipped paths before and after an install and a build
tests/trigger-index.vitest.ts > walkCorpus > folds the .opencode/specs alias onto its canonical path
tests/trigger-index.vitest.ts > walkCorpus > prunes fixture trees in the skills tree while keeping a spec packet named for fixtures
tests/trigger-index.vitest.ts > gitIgnoredPaths > runs git with core.fsmonitor turned off
tests/trigger-index.vitest.ts > generate > produces a byte-identical artifact on a second run over the same corpus
tests/trigger-index.vitest.ts > generate > emits a manifest that pins the corpus and leaves the prompt-set hash for the parity arm
tests/trigger-index.vitest.ts > generate > leaves the previous index untouched when the corpus turns malformed
tests/trigger-index.vitest.ts > generate > publishes when the only untrusted document is a listed ignored path
tests/trigger-index.vitest.ts > generate > still refuses an untrusted document that the ignored list does not name
tests/trigger-index.vitest.ts > generate > names a listed path that matched no document, so a dead exemption is visible
tests/trigger-index.vitest.ts > generate > ships an exemption list whose every entry carries a reason
tests/trigger-index.vitest.ts > generate > publishes a malformed corpus only under the explicit override
tests/trigger-index.vitest.ts > generate > counts phrase quality over the committed keys, by class, with the documents that own them
tests/trigger-index.vitest.ts > generate > judges each owner with its own folder tokens, so folder-token-fallback reaches the bucket
tests/trigger-index.vitest.ts > generate > counts every diagnostic category across one corpus
tests/trigger-index.vitest.ts > generate output paths > writes every sidecar beside an --out aimed elsewhere and leaves the tracked fixtures alone
tests/trigger-index.vitest.ts > generate output paths > writes a refused build's diagnostics beside --out rather than over the tracked fixture
tests/trigger-index.vitest.ts > generate output paths > keeps the tracked sidecars for the routine rebuild however its --out is spelled
tests/trigger-index.vitest.ts > generate --check > exits 0 when the index matches the corpus and writes nothing
tests/trigger-index.vitest.ts > generate --check > exits 1 and names the document when one was added after the index was built
tests/trigger-index.vitest.ts > publishJson > leaves the target and no temporary file behind when validation rejects
tests/trigger-index.vitest.ts > lookup > returns the score classes best first with ties broken by path
tests/trigger-index.vitest.ts > lookup > reports the full candidate count when results are limited
tests/trigger-index.vitest.ts > lookup > reports the full candidate count without truncation
tests/trigger-index.vitest.ts > lookup > treats a zero limit as unbounded while preserving the candidate count
tests/trigger-index.vitest.ts > lookup > counts only scored documents when scoring-only is enabled
tests/trigger-index.vitest.ts > lookup > admits a mid-word substring by scanning the phrase keys
tests/trigger-index.vitest.ts > lookup > returns nothing when every query token falls below the candidate floor
tests/trigger-index.vitest.ts > lookup > scopes results to a spec folder and its descendants
tests/trigger-index.vitest.ts > lookup > matches a spec folder exactly or as a prefix, like the SQL scope filter
tests/trigger-index.vitest.ts > lookup --scoring-only > returns totalCandidates in JSON when results are truncated
tests/trigger-index.vitest.ts > lookup --scoring-only > formats candidate counts for truncated and untruncated human output
tests/trigger-index.vitest.ts > lookup --scoring-only > shows why a row matched and explains a zero-score row in human output
tests/trigger-index.vitest.ts > lookup --scoring-only > exits 0 when a real phrase scores
tests/trigger-index.vitest.ts > lookup --scoring-only > returns no rows and exits 1 when nothing scores
tests/trigger-index.vitest.ts > lookup --scoring-only > keeps the score-0 row but exits 1 for a miss without the flag
tests/trigger-index.vitest.ts > loadIndex fails closed on a malformed artifact > refuses a posting that is not an array instead of skipping the phrase
tests/trigger-index.vitest.ts > loadIndex fails closed on a malformed artifact > refuses a path id outside the path table instead of dropping the document
tests/trigger-index.vitest.ts > loadIndex fails closed on a malformed artifact > refuses an artifact written at another schema version
tests/trigger-index.vitest.ts > loadIndex fails closed on a malformed artifact > still loads the artifact the generator published
tests/trigger-index.vitest.ts > lookup CLI limit contract > accepts only whole non-negative decimal integers for --limit
tests/trigger-index-root-mismatch.vitest.ts > generate-trigger-index root mismatch warning > names both roots when the working directory is another git repository
tests/trigger-index-root-mismatch.vitest.ts > generate-trigger-index root mismatch warning > stays quiet when the working directory is this repository
tests/trigger-index-root-mismatch.vitest.ts > generate-trigger-index root mismatch warning > stays quiet when --repo-root names the caller repository
tests/trigger-phrase-no-prose-bigrams.vitest.ts > trigger phrase workflow fixes > filters prose-derived bigram noise without exposing a legacy context filename
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > returns shorter text unchanged without appending an ellipsis
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > returns text exactly at the limit unchanged without appending an ellipsis
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > truncates longer text on a word boundary with the canonical ellipsis
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > handles representative 450, 520, and 900 character inputs at a 500 character limit
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > respects a custom ellipsis when provided
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > returns an empty string for empty input and zero or negative limits
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > uses exactly the single-character Unicode ellipsis instead of three ASCII dots
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > T240: handles astral-plane emoji without corrupting surrogate pairs
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > T240: handles CJK text that has no whitespace word boundaries
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > T240: handles mixed ASCII and astral Unicode
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > T240: string already within limit but with astral chars returns unchanged
tests/truncate-on-word-boundary.vitest.ts > truncateOnWordBoundary > T240: handles grapheme clusters (combining characters)
tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts > manual trigger phrase preservation > preserves manual DR finding ids verbatim through sanitization
tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts > manual trigger phrase preservation > keeps compact manual singleton anchors that extracted mode still filters
tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts > manual trigger phrase preservation > still rejects contamination in manual phrases
tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts > manual trigger phrase preservation > still rejects manual phrases that contain file-path fragments
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > rejects path fragments from folder leaks
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > rejects standalone stopwords and observed singleton leaks
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > rejects suspicious prefixes without blocking standalone domain nouns
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > rejects known synthetic bigrams from the frozen D3 corpus
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > preserves allowlisted short product names and legitimate phrases
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > deduplicates and preserves only kept phrases in wrapper output
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > observes zero false positives across the tuned category corpus
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > T237: whitespace-only strings should not count as valid trigger phrases
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > T237: mixed whitespace and valid phrases preserves only valid ones
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > T237: single whitespace character is rejected
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > T237: tab-only string is rejected
tests/trigger-phrase-sanitizer.vitest.ts > trigger-phrase sanitizer > T237: empty string is rejected
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > generate-context.js parseArguments rejects a misspelled --session-id
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > generate-description.js rejects a misspelled --description
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > env-reader-table.mjs rejects a misspelled --check
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > smart-router-measurement.js rejects a misspelled --no-record-telemetry
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > generate-command-routers.cjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > generate-command-routers.cjs accepts its documented --check flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > generate-command-routers.cjs rejects --check together with --write
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > dist-freshness.cjs exits 1 when check detects an unknown package
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > dist-freshness.cjs keeps exit 64 and names a misspelled flag in check-all
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > check-markdown-links.cjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > smart-router-analyze.js rejects a misspelled flag and leaves its workspace untouched
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > process-sweep.js rejects a misspelled flag after the plan subcommand
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > process-memory-harness.js rejects a misspelled flag after the snapshot subcommand
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > is-phase-parent.js exits 2 when the check command is missing its folder
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > is-phase-parent.js exits 2 and names an unknown command
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > check-frontmatter-values-helper.cjs exits 2 and names an unreadable input
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > check-source-tags-helper.mjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > check-native-modules.sh exits 1 when the version marker is missing
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > check-graph-metadata-child-drift.sh warns when the child scanner crashes
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > inline-gate-renderer.sh rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > inline-gate-renderer.sh JavaScript fallback rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > unactioned-recorded-failure-audit.mjs exits 2 and names a missing input
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > unactioned-recorded-failure-audit.mjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > ephemeral-pointer-audit.mjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > ephemeral-pointer-audit.mjs exits 2 and names a missing target
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > validate-command-tree-parity.sh keeps exit 64 when a required side is missing
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > template-phrase-lint.mjs answers --help with usage instead of a scan
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > template-phrase-lint.mjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > strict-pass-freshness.ts rejects a --roots value shaped like a flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > repo-era.mjs answers --help with usage instead of a JSON report
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > repo-era.mjs rejects a misspelled flag
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > evidence-marker-audit.ts rejects a misspelled flag alongside --folder=...
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > evidence-marker-audit.ts accepts the space form of --folder
tests/typo-flags.vitest.ts > typo-proof CLI flag handling > create.sh --help lists the --path option
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a packet whose document is a link out of the packet and leaves the link target as it was
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > does not copy a file read through a link into the reversibility manifest
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > writes the baseline under a fresh temporary name so a link planted at a guessable name is not written through
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > still repairs a link whose target stays inside the packet
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > does not read findings from a baseline that is a link out of the packet
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > leaves an archived spec.md that links to a file in the same packet, and that file, unchanged
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > leaves findings read through a linked baseline out of the apply census
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a packet whose document is a dangling link to a file 'inside the packet', and writes nothing
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a packet whose document is a dangling link to a file 'outside the repository', and writes nothing
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a document that links to a sibling packet, and leaves the sibling as it was
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > writes nothing for a passing packet that links inside itself, and keeps its baseline
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a default specs root that is a link to a directory outside the repository, with no --roots
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a reversibility manifest that is a link, and reuses no baseline from its target
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy link containment > refuses a dangling reversibility manifest link in dry run and apply
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy release apply lock > refuses --layout-map while the release apply lock exists, and writes nothing
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy release apply lock > refuses the dry run while the release apply lock exists, and writes nothing
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy release apply lock > refuses --apply while the release apply lock exists, and writes no packet or manifest
tests/upgrade-legacy-containment.vitest.ts > upgrade-legacy release apply lock > runs --layout-map and the dry run normally when no release apply lock exists
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > exits 0 on an empty specs tree and says it found nothing
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > dirty-tree-unwritable-manifest
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > reports a failing legacy packet on a dry run and writes nothing
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > dry run repairs a symlinked packet document only inside the preview
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > previews a packet whose link points at its own ancestor without following it
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > keeps an in-packet relative link in the preview and still refuses a self-referential one
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > dry-run Downgrades match the baseline recorded by apply
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > repairs with --apply, records what remains and leaves the packet passing
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > still fails validation on a fresh mistake beside recorded findings
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > refuses a root outside the repository
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > refuses a --roots argument with a ".." segment, before it resolves, and writes nothing
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > fills missing frontmatter keys and keeps an authored title as written
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > fills from the class defaults when a template cannot be read
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > groups each failing packet's errors by rule with a detail count
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > repairs a failing parent without touching its passing child
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > lists a packet once when the given roots overlap
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > leaves a spec folder copy inside a research tree untouched
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > leaves a root inside z_archive alone unless --include-archive is given
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > un-nests only the questions anchor in an archived packet and leaves every prose line as written
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > keeps an archived document mode under a restrictive umask
tests/upgrade-legacy-core-a.vitest.ts > upgrade-legacy > repairs a nested questions anchor on apply and shows it on the dry run
tests/upgrade-legacy-host-root.vitest.ts > upgrade-legacy run from a host repository > scans the host specs/ and leaves out a folder the host ignores
tests/upgrade-legacy-host-root.vitest.ts > upgrade-legacy run from a host repository > honours an explicit host root
tests/upgrade-legacy-host-root.vitest.ts > upgrade-legacy run outside a host repository > reads the repository the script lives in and prints no host line
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > records a detail the validator repeats once per copy
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > exits 2 and names a packet the tools cannot fix
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > names a document whose frontmatter it cannot read and leaves it as is
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > asks for the v4 layout, and the move it prints works on a v3 checkout
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > writes nothing when the first validation cannot be read
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > writes no phrase the judge rejects when it repairs a legacy packet
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > dirty-tree-writes-manifest
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > manifest-before-image-restores
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > keeps before-image bytes out of the manifest in sidecar files
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > prunes orphan before-image sidecars but keeps the ones the manifest references
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > no-git-refuses-apply
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > dirty-tree-idempotent
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > manifest-recovery
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > readme recovery resolves paths from the exported repository root
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > readme recovery reads a before-image sidecar and refuses a changed digest
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > readme recovery refuses an escaping sidecar name before it writes anything
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > readme recovery refuses a linked sidecar directory and writes nothing
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > stale-manifest-head-refuses-apply
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > stale-manifest-tree-refuses-apply
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > all-modes-sequence
tests/upgrade-legacy-core-b.vitest.ts > upgrade-legacy > records lane-mode refusals in mode, document and reason order
tests/upgrade-level-sections.vitest.ts > upgrade-level.sh section fragments > keeps level-one document structure when upgrading to level 2
tests/upgrade-level-sections.vitest.ts > upgrade-level.sh section fragments > keeps level-one document structure when upgrading to level 3
tests/upgrade-level-sections.vitest.ts > upgrade-level.sh section fragments > keeps the questions anchor directly above the renumbered heading on upgrade
tests/upgrade-level-sections.vitest.ts > upgrade-level.sh section fragments > stamps the implementation-summary it recreates on upgrade
tests/upgrade-legacy-refresh-markers.vitest.ts > upgrade-legacy --refresh-markers > lists a legacy marker in a dry run and moves it only under apply
tests/upgrade-legacy-refresh-markers.vitest.ts > upgrade-legacy --refresh-markers > refuses a document whose anchors do not prove the current marker
tests/upgrade-legacy-refresh-markers.vitest.ts > refreshMarker > leaves a document that carries no marker unchanged
tests/upgrade-legacy-refresh-markers.vitest.ts > refreshMarker > moves a stale marker on a current phase child
tests/upgrade-legacy-refresh-markers.vitest.ts > refreshMarker > leaves a current phase child at its own marker untouched
tests/upgrade-legacy-refresh-markers.vitest.ts > refreshMarker > refuses a foreign anchor on a stale marker but not on a current one
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > reports none without roots and v4 with a current root
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > plans the v3 move with and without the specs symlink, and the steps leave v4
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > moves a partial tree without collisions, keeps every file digest and skips finder metadata
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > lists one collision per reason with from and to, and plans no steps
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > writes nothing while it plans
tests/upgrade-legacy-layout.vitest.ts > planLayoutMove > serves --layout-map over the CLI and stays quiet when imported
tests/upgrade-legacy-layout.vitest.ts > upgrade-legacy layout links > plans no step through a .opencode link that leaves the repository
tests/utils-regressions.vitest.ts > utility regression coverage > forces missing array-backed flags to false
tests/utils-regressions.vitest.ts > utility regression coverage > ignores non-array decision alternatives
tests/utils-regressions.vitest.ts > utility regression coverage > switches generic fallback slugs to the hash fallback
tests/utils-regressions.vitest.ts > utility regression coverage > keeps iso timestamps in UTC while offsetting human-readable output
tests/validate-help-lists-every-rule.vitest.ts > validate.sh --help lists the whole registry > prints every rule id the registry declares
tests/validate-help-lists-every-rule.vitest.ts > validate.sh --help lists the whole registry > prints a heading for every category the registry uses
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T040-01 ignores metric-like numeric prefixes such as vector dimensions and diff line counts
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T040-02 ignores ADR-NNN contexts and ADR title slugs
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T040-03 derives the current spec from the last numbered segment of a nested file path
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T040-04 allows three scattered foreign IDs in decision records but not generic notes
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > allows limited predecessor and follow-on references in spec.md
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T040-05 preserves scattered-foreign detection for generic spec docs
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T047-01 allows four repeated foreign references in decision records under the relaxed dominates threshold
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T047-02 preserves strict dominates detection for plan documents
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T047-03 allowlists direct child spec IDs for parent handovers
tests/validate-memory-quality-v8-overreach.vitest.ts > V8 cross-spec overreach calibration > T047-04 preserves dominates detection for unrelated specs in parent handovers
tests/validate-memory-quality-v12-normalization.vitest.ts > V12 topical normalization > passes when the memory body uses slug-form phrases only
tests/validate-memory-quality-v12-normalization.vitest.ts > V12 topical normalization > passes when the memory body uses prose-form phrases only
tests/validate-memory-quality-v12-normalization.vitest.ts > V12 topical normalization > fails when the memory body has zero overlap with the spec trigger phrases
tests/validate-memory-quality-v12-normalization.vitest.ts > V12 topical normalization > resolves the spec folder correctly with and without filePath fallback
tests/validate-recursive-artifact-skip.vitest.ts > recursive validation artifact skip > validates a numbered child that kept plan.md but lost spec.md, instead of skipping it
tests/validate-recursive-artifact-skip.vitest.ts > recursive validation artifact skip > keeps an artifact-only child skipped and reports the skip on stderr, never on JSON stdout
tests/validate-recursive-artifact-skip.vitest.ts > recursive validation artifact skip > suppresses the skip notice under --quiet while still validating the lost-docs child
tests/validate-memory-quality-v8-regex-narrow.vitest.ts > V8 spec id extraction calibration > keeps only the legitimate spec slugs from the RCA evidence list
tests/validate-memory-quality-v8-regex-narrow.vitest.ts > V8 spec id extraction calibration > passes V8 for a good memory that only contains dates, session ids, and finding ids
tests/validate-memory-quality-v8-regex-narrow.vitest.ts > V8 spec id extraction calibration > still fails V8 for a fabricated foreign spec that dominates the memory body
tests/validate-runs-every-registry-rule.vitest.ts > validate.sh runs every registry rule > reports an entry for every rule id on a fresh Level 2 scaffold
tests/validate-skip-switch.vitest.ts > validate.sh off switch > skips with a report a JSON caller can parse when the environment turns it on
tests/validate-skip-switch.vitest.ts > validate.sh off switch > reads the switch from hook-flags.env when the environment leaves it unset
tests/validate-skip-switch.vitest.ts > validate.sh off switch > validates when the environment answers 0, empty or a value outside the truthy set
tests/validate-skip-switch.vitest.ts > validate.sh off switch > sends SPECKIT_VALIDATION=false through the same report
tests/validate-skip-switch.vitest.ts > validate.sh off switch > keeps stdout empty in text mode, still prints help and still rejects a missing folder
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > validates a declared sub-track folder as a container in strict mode
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > includes sub-track packets at track depth while skipping archives and symlinks
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > finds every packet name the track reader counts inside a sub-track
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > skips a symlinked numbered packet inside a sub-track
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > keeps the flat-track recursive folder list unchanged
tests/validate-subtrack.vitest.ts > recursive validation for declared sub-tracks > does not grant a container exemption to undeclared folders or packets
tests/validation-rule-metadata.vitest.ts > validation rule metadata > marks V10 as a soft rule that still allows write and index
tests/validation-rule-metadata.vitest.ts > validation rule metadata > keeps V8 as a hard write and index blocker
tests/validation-rule-metadata.vitest.ts > validation rule metadata > supports explicit write-only persistence when a rule blocks indexing but not writing
tests/validation-rule-metadata.vitest.ts > validation rule metadata > blocks indexing but allows write for V12 topical mismatch
tests/validation-rule-metadata.vitest.ts > validation rule metadata > triggers V12 when memory content has zero overlap with spec trigger_phrases
tests/validation-rule-metadata.vitest.ts > source capabilities > treats structured file input as the preferred structured save path
tests/validation-rule-metadata.vitest.ts > source capabilities > limits transcript-style tool-title downgrades to the capable source set
tests/validation-gate-hardening.vitest.ts > validation gate hardening > classifies complete and non-complete status variants
tests/validation-gate-hardening.vitest.ts > validation gate hardening > classifies "Implemented"/"Implementing" as complete without misclassifying "not implemented"
tests/validation-gate-hardening.vitest.ts > validation gate hardening > metadata disk drift is enforcing by default, advisory when disabled, enforcing when flagged
tests/validation-gate-hardening.vitest.ts > validation gate hardening > status drift is enforcing by default, advisory when disabled, enforcing when flagged
tests/validation-gate-hardening.vitest.ts > validation gate hardening > uses the shared status classifier for scaffold marker enforcement
tests/validation-gate-hardening.vitest.ts > validation gate hardening > reads the spec.md title of a v2.3 packet for a template token, and leaves an older packet as it was
tests/validation-gate-hardening.vitest.ts > validation gate hardening > classifies a v2.3 spec with a Draft row and then a Complete row as complete
tests/validation-gate-hardening.vitest.ts > validation gate hardening > does not defer a token as Draft work when a v2.3 spec also claims Complete
tests/validation-gate-hardening.vitest.ts > validation gate hardening > strict-pass freshness sweep is report-only and reports malformed validate output
tests/validation-gate-hardening.vitest.ts > validation gate hardening > reports a first-run status (not regression) for a failing folder with no baseline, but still reports regression against a real baseline
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > YAML syntax validation (CHK-027, CHK-028) > unclosed single-quoted string triggers V13 failure
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > YAML syntax validation (CHK-027, CHK-028) > unclosed double-quoted string triggers V13 failure
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > YAML syntax validation (CHK-027, CHK-028) > well-formed frontmatter passes V13
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > content density validation (CHK-029, CHK-030) > body with fewer than 50 non-whitespace chars triggers V13 failure
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > content density validation (CHK-029, CHK-030) > body with more than 50 non-whitespace chars passes V13
tests/validation-v13-v14-v12.vitest.ts > V13: frontmatter YAML integrity and content density > content density validation (CHK-029, CHK-030) > frontmatter characters do not count toward content density
tests/validation-v13-v14-v12.vitest.ts > V14: status/percentage contradiction (CHK-033) > status=complete + percentage=40 triggers V14 failure
tests/validation-v13-v14-v12.vitest.ts > V14: status/percentage contradiction (CHK-033) > status=complete + percentage=100 passes V14
tests/validation-v13-v14-v12.vitest.ts > V14: status/percentage contradiction (CHK-033) > status=in-progress + percentage=40 passes V14 (no contradiction)
tests/validation-v13-v14-v12.vitest.ts > V14: status/percentage contradiction (CHK-033) > status=complete without percentage passes V14
tests/validation-v13-v14-v12.vitest.ts > V12: topical coherence with spec_folder path normalization (CHK-031, CHK-032) > relative spec_folder resolves correctly and finds overlap
tests/validation-v13-v14-v12.vitest.ts > V12: topical coherence with spec_folder path normalization (CHK-031, CHK-032) > relative spec_folder with zero overlap triggers V12 failure
tests/validation-v13-v14-v12.vitest.ts > V12: topical coherence with spec_folder path normalization (CHK-031, CHK-032) > absolute spec_folder path works identically
tests/validation-engine-coherence.vitest.ts > validation engine coherence > treats a track directory as a track, not a packet
tests/validation-engine-coherence.vitest.ts > validation engine coherence > still grades a numbered packet that sits directly under specs
tests/validation-engine-coherence.vitest.ts > validation engine coherence > names the engine that produced the verdict
tests/validation-engine-coherence.vitest.ts > validation engine coherence > reports the engine in JSON output too
tests/validation-engine-coherence.vitest.ts > validation engine coherence > narrows the run to a named subset without changing how a rule decides
tests/validation-engine-coherence.vitest.ts > validation engine coherence > canonicalises rule aliases and hyphenated spellings
tests/validation-engine-coherence.vitest.ts > validation engine coherence > refuses a subset naming a rule that does not exist
tests/validation-engine-coherence.vitest.ts > validation engine coherence > refuses even when only one name in the subset is wrong
tests/validation-engine-coherence.vitest.ts > validation engine coherence > prints the detail lines that say what a finding actually found
tests/validation-engine-coherence.vitest.ts > validation engine coherence > emits parseable JSON for a phase parent when the mode comes from the environment
tests/validation-engine-coherence.vitest.ts > validation engine coherence > reports an opened but unterminated frontmatter block as its own fault
tests/validation-engine-coherence.vitest.ts > validation engine coherence > reports a declared-but-empty required frontmatter field
tests/validation-engine-coherence.vitest.ts > validation engine coherence > leaves a document with no frontmatter to the rules that own document shape
tests/validation-engine-coherence.vitest.ts > validation engine coherence > re-reads the rule subset on every in-process validation
tests/validation-engine-coherence.vitest.ts > validation engine coherence > skips the freshness rule unless it has been opted into
tests/validator-git-fsmonitor.vitest.ts > validator git calls turn the file-system monitor off > traces validate.sh through the orchestrator, every registry rule and their helpers
tests/validator-git-fsmonitor.vitest.ts > validator git calls turn the file-system monitor off > passes -c core.fsmonitor=false on every git call in that set
tests/workflow-canonical-save-metadata.vitest.ts > T-CNS-01 canonical save advances description.json.lastUpdated > writes fresh lastUpdated after a single canonical save
tests/workflow-canonical-save-metadata.vitest.ts > T-CNS-01 canonical save advances description.json.lastUpdated > advances lastUpdated monotonically across successive saves
tests/workflow-canonical-save-metadata.vitest.ts > T-CNS-01 canonical save advances description.json.lastUpdated > keeps lastUpdated assignment independent of memorySequence retry path
tests/workflow-canonical-save-metadata.vitest.ts > T-W1-CNS-04 refreshGraphMetadata is idempotent on unchanged content > preserves last_save_at on an unchanged re-derive, advances on an explicit save
tests/workflow-canonical-save-metadata.vitest.ts > T-W1-CNS-04 refreshGraphMetadata is idempotent on unchanged content > persists same_pass lineage when the canonical-save path requests it
tests/workflow-canonical-save-metadata.vitest.ts > full runWorkflow canonical-save metadata integration > plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at
tests/workflow-canonical-save-metadata.vitest.ts > full runWorkflow canonical-save metadata integration > full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at
tests/workflow-canonical-save-metadata.vitest.ts > full runWorkflow canonical-save metadata integration > prints the plan-only continuity-field notice in the summary and omits it for full-auto
tests/workflow-invariance.vitest.ts > workflow vocabulary invariance > keeps public surfaces free from new private taxonomy leaks
tests/workflow-invariance.vitest.ts > workflow vocabulary invariance > reports leaks from extra-path sentinels
tests/workflow-save-secret-scrub.vitest.ts > workflow durable save secret scrub > removes raw AWS and GitHub tokens before fields are persisted
tests/validator-registry-doc-count.vitest.ts > validator-registry.json versus the documented rule count > keeps every "<N>-rule registry" claim equal to the registry length
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > imports no indexing runtime
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > emits no memory index-scan follow-up
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > probes no spec-memory daemon
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > still refreshes graph metadata through the top-level API
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > points at the trigger-index generator instead of running it
tests/workflow-step115-daemon-guard.vitest.ts > canonical save follow-ups > exports no auto-index step
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > reports fresh when spec.md declares exactly what the committed index records for it
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > reports stale when a trigger phrase was added since the index was last generated
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > reports stale when a trigger phrase was removed since the index was last generated
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > reports stale on a one-word change even when the phrase count is unchanged (set-equality, not a fuzzy diff)
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > reports no-phrases when spec.md declares an empty trigger_phrases list
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > degrades to unavailable instead of throwing when spec.md is missing
tests/workflow-trigger-index-freshness.vitest.ts > checkTriggerIndexFreshness > degrades to unavailable instead of throwing when the index fails to parse
tests/workspace-identity.vitest.ts > workspace identity normalization > treats the repo-local .opencode directory as the canonical workspace anchor
tests/workspace-identity.vitest.ts > workspace identity normalization > accepts repo-root and nested paths that resolve to the same .opencode workspace
tests/workspace-identity.vitest.ts > workspace identity normalization > rejects unrelated repos even when their basenames are similar
tests/workspace-identity.vitest.ts > workspace identity normalization > keeps symlinked and trailing-slash variants equivalent
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > resolves a nested start in a .skilled-only checkout to the repository root
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > gives the repository root, never .skilled, when .opencode links to .skilled
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > keeps one workspace root for a real .opencode tree beside the .skilled placeholder
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > keeps a checkout whose own directory is named .skilled as the workspace root
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > keeps anchoring on the source root when a stray tree sits directly inside it
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > treats a bare directory named .skilled as a source root when no spec-kit skill decides
tests/workspace-identity.vitest.ts > workspace identity under either source-root name > rejects unrelated repositories whose anchors carry different names
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-plan.yaml: intake_triggered payload carries distinct folderState + startState fields
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-plan.yaml: intake_completed payload carries distinct folderState + startState fields
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-plan.yaml: folder_state is mapped explicitly to start_state via map_to_start_state (or equivalent)
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-complete.yaml: intake_triggered payload carries distinct folderState + startState fields
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-complete.yaml: intake_completed payload carries distinct folderState + startState fields
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > speckit-complete.yaml: folder_state is mapped explicitly to start_state via map_to_start_state (or equivalent)
tests/yaml-intake-event-payloads.vitest.ts > YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13) > no asset emits only one of the two vocabulary fields (regression: dropped-field collapse)
```

Line count: 2520.

## 3. Legacy lane names

```text
test-scripts-modules-js	T-001a: CONFIG object exists
test-scripts-modules-js	T-001b: SKILL_VERSION defined
test-scripts-modules-js	T-001c: PROJECT_ROOT defined
test-scripts-modules-js	T-001d: TEMPLATE_DIR defined
test-scripts-modules-js	T-001e: CONFIG has MAX_RESULT_PREVIEW
test-scripts-modules-js	T-001f: CONFIG has MAX_CONVERSATION_MESSAGES
test-scripts-modules-js	T-001g: getSpecsDirectories() returns non-empty array
test-scripts-modules-js	T-001h: findActiveSpecsDir() returns string or null
test-scripts-modules-js	T-001i: getAllExistingSpecsDirs() returns array
test-scripts-modules-js	T-002a: runWorkflow exported
test-scripts-modules-js	T-002f: extractKeyTopics exported
test-scripts-modules-js	T-002k: extractKeyTopics extracts topics
test-scripts-modules-js	T-003a: sanitizePath rejects null bytes (CWE-22)
test-scripts-modules-js	T-003b: sanitizePath rejects empty path
test-scripts-modules-js	T-003c: sanitizePath rejects null
test-scripts-modules-js	T-003d: sanitizePath accepts valid cwd path
test-scripts-modules-js	T-003e: sanitizePath rejects path outside allowed directories
test-scripts-modules-js	T-003i: sanitizePath default bases accept a path inside a linked .skilled
test-scripts-modules-js	T-003j: sanitizePath default bases accept a path inside a linked .opencode
test-scripts-modules-js	T-003k: sanitizePath default bases reject /etc/passwd
test-scripts-modules-js	T-003l: sanitizePath default bases reject a .. escape from a linked .skilled
test-scripts-modules-js	T-003f: getPathBasename extracts filename
test-scripts-modules-js	T-003g: getPathBasename handles Windows paths
test-scripts-modules-js	T-003h: getPathBasename handles empty input
test-scripts-modules-js	T-004a: normalizeInputData passes MCP data through
test-scripts-modules-js	T-004b: normalizeInputData transforms manual format
test-scripts-modules-js	T-004c: validateInputData throws on null
test-scripts-modules-js	T-004d: validateInputData accepts valid MCP data
test-scripts-modules-js	T-004e: validateInputData throws on invalid triggerPhrases
test-scripts-modules-js	T-004f: transformKeyDecision handles string
test-scripts-modules-js	T-004g: transformKeyDecision handles object
test-scripts-modules-js	T-004h: buildSessionSummaryObservation creates observation
test-scripts-modules-js	T-004i: transformOpenCodeCapture transforms capture data
test-scripts-modules-js	T-005a: validateDataStructure adds HAS_ flags
test-scripts-modules-js	T-005b: validateDataStructure sets false for empty arrays
test-scripts-modules-js	T-005c: ensureArrayOfObjects converts strings
test-scripts-modules-js	T-005d: ensureArrayOfObjects handles null
test-scripts-modules-js	T-005e: hasArrayContent for non-empty array
test-scripts-modules-js	T-005f: hasArrayContent for empty array
test-scripts-modules-js	T-005g: ARRAY_FLAG_MAPPINGS exists
test-scripts-modules-js	T-006a: structuredLog is a function
test-scripts-modules-js	T-006b: structuredLog handles info level
test-scripts-modules-js	T-006c: structuredLog handles warn level
test-scripts-modules-js	T-006d: structuredLog handles error level
test-scripts-modules-js	T-006e: structuredLog handles missing data parameter
test-scripts-modules-js	T-007e: truncateToolOutput truncates long output
test-scripts-modules-js	T-007f: truncateToolOutput preserves short output
test-scripts-modules-js	T-007g: summarizeExchange creates complete summary
test-scripts-modules-js	T-007h: extractKeyArtifacts export removed
test-scripts-modules-js	T-008a: detectToolCall finds explicit tool mention
test-scripts-modules-js	T-008b: detectToolCall finds function call syntax
test-scripts-modules-js	T-008c: detectToolCall returns null for no match
test-scripts-modules-js	T-008d: isProseContext detects prose usage
test-scripts-modules-js	T-008e: classifyConversationPhase detects Research
test-scripts-modules-js	T-008f: classifyConversationPhase detects Implementation
test-scripts-modules-js	T-008g: classifyConversationPhase detects Debugging
test-scripts-modules-js	T-009a: generate_anchor_id format
test-scripts-modules-js	T-009d: categorize_section detects decision
test-scripts-modules-js	T-009e: validate_anchor_uniqueness handles collisions
test-scripts-modules-js	T-009g: slugify creates valid slug
test-scripts-modules-js	T-010a: is_noise_content detects "User message"
test-scripts-modules-js	T-010b: is_noise_content detects "Assistant response"
test-scripts-modules-js	T-010c: is_noise_content allows real content
test-scripts-modules-js	T-010d: create_filter_pipeline returns pipeline
test-scripts-modules-js	T-010e: Pipeline filters noise prompts
test-scripts-modules-js	T-010j: NOISE_PATTERNS constant exists
test-scripts-modules-js	T-011a: detect_workflow_pattern returns linear
test-scripts-modules-js	T-011b: detect_workflow_pattern returns parallel
test-scripts-modules-js	T-011c: generate_workflow_flowchart creates ASCII art
test-scripts-modules-js	T-011d: generate_workflow_flowchart returns null for empty
test-scripts-modules-js	T-011e: build_phase_details creates detailed info
test-scripts-modules-js	T-011f: extract_flowchart_features returns features
test-scripts-modules-js	T-011g: get_pattern_use_cases returns array
test-scripts-modules-js	T-011h: classify_diagram_pattern detects patterns
test-scripts-modules-js	T-011i: PATTERNS constant exists
test-scripts-modules-js	T-011j: DIAGRAM_PATTERNS constant exists
test-scripts-modules-js	T-011k: COMPLEXITY constant exists
test-scripts-modules-js	T-012a: classify_message detects intent
test-scripts-modules-js	T-012b: classify_message detects implementation
test-scripts-modules-js	T-012c: classify_message detects decision
test-scripts-modules-js	T-012d: classify_message detects result
test-scripts-modules-js	T-012e: classify_messages organizes by type
test-scripts-modules-js	T-012f: extract_file_changes extracts file paths
test-scripts-modules-js	T-012g: generate_implementation_summary creates summary
test-scripts-modules-js	T-012h: format_summary_as_markdown creates markdown
test-scripts-modules-js	T-012i: MESSAGE_TYPES constant exists
test-scripts-modules-js	T-013a: create_session_data creates valid structure
test-scripts-modules-js	T-013b: create_conversation_data creates messages
test-scripts-modules-js	T-013c: create_decision_data creates decisions
test-scripts-modules-js	T-013d: create_diagram_data creates diagrams
test-scripts-modules-js	T-013f: requires_simulation detects null
test-scripts-modules-js	T-013g: requires_simulation detects simulation flag
test-scripts-modules-js	T-013h: requires_simulation allows real data
test-scripts-modules-js	T-014a: ALIGNMENT_CONFIG exists with threshold
test-scripts-modules-js	T-014b: extractConversationTopics extracts topics
test-scripts-modules-js	T-014c: extractObservationKeywords extracts keywords
test-scripts-modules-js	T-014d: parseSpecFolderTopic parses folder name
test-scripts-modules-js	T-014e: calculateAlignmentScore computes score
test-scripts-modules-js	T-014f: calculateAlignmentScore returns 0 for no match
test-scripts-modules-js	T-015a: setupContextDirectory is a function
test-scripts-modules-js	T-015b: setupContextDirectory rejects nonexistent paths
test-scripts-modules-js	T-016a: detectSpecFolder is a function
test-scripts-modules-js	T-016b: filterArchiveFolders removes archive folders
test-scripts-modules-js	T-016c: ALIGNMENT_CONFIG has archive patterns
test-scripts-modules-js	T-017a: loadCollectedData is a function
test-scripts-modules-js	T-019a: detectObservationType detects bugfix
test-scripts-modules-js	T-019b: detectObservationType detects feature
test-scripts-modules-js	T-019c: detectObservationType preserves explicit type
test-scripts-modules-js	T-019d: extractFilesFromData extracts from FILES
test-scripts-modules-js	T-019e: enhanceFilesWithSemanticDescriptions enhances files
test-scripts-modules-js	T-019f: buildObservationsWithAnchors adds anchors
test-scripts-modules-js	T-020a: extractConversations is a function
test-scripts-modules-js	T-020b: extractConversations returns simulation for null
test-scripts-modules-js	T-020c: extractConversations processes real data
test-scripts-modules-js	T-021a: extractDecisions is a function
test-scripts-modules-js	T-021b: extractDecisions returns simulation for null
test-scripts-modules-js	T-021c: extractDecisions processes manual decisions
test-scripts-modules-js	T-021d: extractDecisions calculates confidence counts
test-scripts-modules-js	T-022b: getChannel returns string
test-scripts-modules-js	T-022c: detectContextType classifies implementation
test-scripts-modules-js	T-022d: detectContextType classifies research
test-scripts-modules-js	T-022e: detectImportanceTier detects critical
test-scripts-modules-js	T-022f: detectProjectPhase classifies phase
test-scripts-modules-js	T-022g: countToolsByType counts tools
test-scripts-modules-js	T-022h: calculateSessionDuration computes duration
test-scripts-modules-js	T-022i: extractKeyTopics extracts topics
test-scripts-modules-js	T-023a: shouldAutoSave triggers at threshold
test-scripts-modules-js	T-023b: shouldAutoSave returns false below threshold
test-scripts-modules-js	T-023c: collectSessionData is a function
test-scripts-modules-js	T-024a-neg: workflow omits retired helpers
test-scripts-modules-js	T-026a: hasImplementationWork returns false for empty data
test-scripts-modules-js	T-026b: hasImplementationWork returns true for implementation observations
test-scripts-modules-js	T-026c: extractMainTopic extracts from spec folder
test-scripts-modules-js	T-026d: extractMainTopic extracts from observations
test-scripts-modules-js	T-026e: extractMainTopic returns fallback
test-scripts-modules-js	T-026f: extractWhatBuilt extracts implementations
test-scripts-modules-js	T-026g: extractWhatBuilt returns empty for non-impl obs
test-scripts-modules-js	T-026h: extractKeyFilesWithRoles assigns roles
test-scripts-modules-js	T-026i: extractKeyFilesWithRoles detects test file
test-scripts-modules-js	T-026j: generateExtensionGuide returns guide items
test-scripts-modules-js	T-026k: generateExtensionGuide detects API pattern
test-scripts-modules-js	T-026l: extractCodePatterns returns array
test-scripts-modules-js	T-026n: buildImplementationGuideData returns complete structure
test-scripts-modules-js	T-026o: buildImplementationGuideData returns false for no impl
test-scripts-modules-js	T-027a: extractActiveFile exported
test-scripts-modules-js	T-027b: extractNextAction exported
test-scripts-modules-js	T-027c: extractBlockers exported
test-scripts-modules-js	T-027d: buildFileProgress exported
test-scripts-modules-js	T-027e: calculateExpiryEpoch exported
test-scripts-modules-js	T-027f: detectRelatedDocs exported
test-scripts-modules-js	T-027g: detectSessionCharacteristics exported
test-scripts-modules-js	T-027h: buildProjectStateSnapshot exported
test-scripts-modules-js	T-027i: extractActiveFile finds file from observations
test-scripts-modules-js	T-027j: extractActiveFile falls back to files array
test-scripts-modules-js	T-027k: extractActiveFile returns N/A when no files
test-scripts-modules-js	T-027l: extractNextAction extracts from facts
test-scripts-modules-js	T-027m: extractNextAction returns default
test-scripts-modules-js	T-027n: extractBlockers finds blockers
test-scripts-modules-js	T-027o: extractBlockers returns None when no blockers
test-scripts-modules-js	T-027p: buildFileProgress returns array
test-scripts-modules-js	T-027q: buildFileProgress returns empty for null
test-scripts-modules-js	T-027r: calculateExpiryEpoch returns 0 for critical
test-scripts-modules-js	T-027s: calculateExpiryEpoch returns 0 for constitutional
test-scripts-modules-js	T-027t: calculateExpiryEpoch returns 7 days for temporary
test-scripts-modules-js	T-027u: calculateExpiryEpoch returns 90 days default
test-scripts-modules-js	T-027v: detectRelatedDocs returns array
test-scripts-modules-js	T-027w: detectSessionCharacteristics returns complete object
test-scripts-modules-js	T-027x: buildProjectStateSnapshot returns complete object
test-scripts-modules-js	T233-WR-001: wrapSectionsWithAnchors is exported
test-scripts-modules-js	T233-WR-002: wrapSectionsWithAnchors returns content string
test-scripts-modules-js	T233-WR-003: wrapSectionsWithAnchors returns anchorsAdded count
test-scripts-modules-js	T233-WR-004: wrapSectionsWithAnchors returns anchorsPreserved count
test-scripts-modules-js	T233-WR-005: wrapSectionsWithAnchors is idempotent
test-scripts-modules-js	T233-WR-006: Module exports shipped functions
test-scripts-modules-js	T-029a: create_simulation_phases returns array
test-scripts-modules-js	T-029b: create_simulation_phases has required structure
test-scripts-modules-js	T-029c: create_simulation_phases includes standard phases
test-scripts-modules-js	T-029d: create_simulation_flowchart returns string
test-scripts-modules-js	T-029e: create_simulation_flowchart contains ASCII art
test-scripts-modules-js	T-029f: create_simulation_flowchart accepts custom request
test-scripts-modules-js	T-030a: extract_spec_number extracts 042
test-scripts-modules-js	T-030b: extract_spec_number extracts 123
test-scripts-modules-js	T-030c: extract_spec_number returns 000 for no match
test-scripts-modules-js	T-030d: extract_spec_number returns 000 for short prefix
test-scripts-modules-js	T-030e: extract_spec_number preserves leading zeros
test-scripts-modules-js	T-031a: extract_decisions is a function
test-scripts-modules-js	T-031b: extract_decisions finds explicit choice
test-scripts-modules-js	T-031c: extract_decisions captures question context
test-scripts-modules-js	T-031d: extract_decisions handles option letter format
test-scripts-modules-js	T-031e: extract_decisions returns empty for no decisions
test-scripts-modules-js	T-031f: extract_decisions handles empty input
test-scripts-modules-js	T-031g: extract_decisions handles "chose" pattern
test-scripts-modules-js	T-031h: extract_decisions handles "user chose" pattern
test-scripts-modules-js	T-033b: promptUser is a function
test-scripts-modules-js	T-033c: promptUserChoice is a function
test-scripts-modules-js	T-033d: promptUser returns a Promise
test-scripts-modules-js	T-033e: promptUser returns default in non-interactive mode
test-scripts-modules-js	T-033f: promptUserChoice returns 1 in non-interactive mode
test-scripts-modules-js	T-034a: toRelativePath converts absolute to relative
test-scripts-modules-js	T-034b: toRelativePath handles empty input
test-scripts-modules-js	T-034c: toRelativePath handles null
test-scripts-modules-js	T-034d: toRelativePath handles long paths
test-scripts-modules-js	T-034e: isDescriptionValid rejects short descriptions
test-scripts-modules-js	T-034f: isDescriptionValid rejects garbage patterns
test-scripts-modules-js	T-034g: isDescriptionValid rejects heading patterns
test-scripts-modules-js	T-034h: isDescriptionValid rejects placeholder
test-scripts-modules-js	T-034i: isDescriptionValid accepts valid descriptions
test-scripts-modules-js	T-034i2: validateDescription rejects generic recent-commit stub
test-scripts-modules-js	T-034i3: validateDescription classifies low-context activity descriptions
test-scripts-modules-js	T-034i4: validateDescription accepts semantic descriptions
test-scripts-modules-js	T-034j: cleanDescription removes markdown
test-scripts-modules-js	T-034k: cleanDescription truncates long descriptions
test-scripts-modules-js	T-034l: cleanDescription capitalizes first letter
test-scripts-modules-js	T-008h: phase-classifier compatibility wrapper prefers Debugging for grep+error
test-scripts-modules-js	T-008i: phase-classifier preserves non-contiguous phase returns
test-scripts-modules-js	T-008j: phase-classifier derives Iterative Loop flow pattern
test-scripts-modules-js	T-036a: BOX constant exists with box characters
test-scripts-modules-js	T-036b: pad_text pads text to width
test-scripts-modules-js	T-036c: pad_text truncates long text
test-scripts-modules-js	T-036d: pad_text centers text
test-scripts-modules-js	T-036e: format_decision_header creates header
test-scripts-modules-js	T-036f: format_option_box creates option box
test-scripts-modules-js	T-036g: format_chosen_box creates chosen box
test-scripts-modules-js	T-036h: format_caveats_box creates caveats box
test-scripts-modules-js	T-036i: format_caveats_box returns empty for null
test-scripts-modules-js	T-036j: format_follow_up_box creates follow-up box
test-scripts-modules-js	T-036k: format_follow_up_box returns empty for empty array
test-scripts-modules-js	T-037a: extractTriggerPhrases is exported
test-scripts-modules-js	T-037b: extract_trigger_phrases is exported
test-scripts-modules-js	T-037c: extractTriggerPhrases extracts phrases
test-scripts-modules-js	T-037d: extractTriggerPhrases returns empty for null
test-scripts-modules-js	T-037e: extractTriggerPhrases returns empty for short text
test-scripts-modules-js	T-037f: CONFIG is exported
test-scripts-modules-js	T-037g: STOP_WORDS_ENGLISH is exported
test-scripts-modules-js	T-039a: validateContentAlignment is a function
test-scripts-modules-js	T-039b: validateFolderAlignment is a function
test-scripts-modules-js	T-039c: extractConversationTopics extracts OAuth topics
test-scripts-modules-js	T-039d: extractObservationKeywords extracts keywords
test-scripts-modules-js	T-039e: calculateAlignmentScore returns high score for match
test-scripts-modules-js	T-039f: calculateAlignmentScore returns low score for non-match
test-scripts-modules-js	T-039g: parseSpecFolderTopic parses nested names
test-scripts-modules-js	T-039h: ALIGNMENT_CONFIG has STOPWORDS
test-scripts-modules-js	T-040a: extractPhasesFromData is a function
test-scripts-modules-js	T-040b: extractPhasesFromData returns array for null
test-scripts-modules-js	T-040c: extractPhasesFromData returns empty for short sessions
test-scripts-modules-js	T-040d: extractPhasesFromData extracts phases
test-scripts-modules-js	T-040e: extractDiagrams is a function
test-scripts-modules-js	T-040f: extractDiagrams returns simulation for null
test-scripts-modules-js	T-040g: extractDiagrams processes real data
test-scripts-modules-js	T-040h: extractDiagrams includes AUTO_CONVERSATION_FLOWCHART
test-scripts-modules-js	T-041a: generateDecisionTree is a function
test-scripts-modules-js	T-041b: generateDecisionTree handles legacy format
test-scripts-modules-js	T-041c: generateDecisionTree handles object format
test-scripts-modules-js	T-041d: generateDecisionTree handles empty options
test-scripts-modules-js	T-041e: generateDecisionTree includes caveats
test-scripts-modules-js	T-041f: generateDecisionTree includes follow-up
test-scripts-modules-js	T-042a: parseArguments is a function
test-scripts-modules-js	T-042b: validateArguments is a function
test-scripts-modules-js	T-042c: isValidSpecFolder is a function
test-scripts-modules-js	T-042d: SPEC_FOLDER_PATTERN is a RegExp
test-scripts-modules-js	T-042e: SPEC_FOLDER_PATTERN matches valid folder names
test-scripts-modules-js	T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names
test-scripts-modules-js	T-042g: isValidSpecFolder accepts valid folder
test-scripts-modules-js	T-042h: isValidSpecFolder rejects invalid folder
test-scripts-modules-js	T-042i: isValidSpecFolder rejects non-specs path
test-scripts-modules-js	T-042j: SPEC_FOLDER_BASIC_PATTERN exists
test-extractors-loaders-js	EXT-CSData-001: collectSessionData exported
test-extractors-loaders-js	EXT-CSData-002: shouldAutoSave exported
test-extractors-loaders-js	EXT-CSData-003: extractPreflightPostflightData exported
test-extractors-loaders-js	EXT-CSData-004: calculateLearningIndex exported
test-extractors-loaders-js	EXT-CSData-005: getScoreAssessment exported
test-extractors-loaders-js	EXT-CSData-006: getTrendIndicator exported
test-extractors-loaders-js	EXT-CSData-007: generateLearningSummary exported
test-extractors-loaders-js	EXT-CSData-008: null score returns empty assessment
test-extractors-loaders-js	EXT-CSData-009: undefined score returns empty assessment
test-extractors-loaders-js	EXT-CSData-010: High score (90) is Strong
test-extractors-loaders-js	EXT-CSData-011: Score 70 is Good
test-extractors-loaders-js	EXT-CSData-012: Score 50 is Moderate
test-extractors-loaders-js	EXT-CSData-013: Score 25 is Limited
test-extractors-loaders-js	EXT-CSData-014: Score 10 is Minimal
test-extractors-loaders-js	EXT-CSData-015: Low uncertainty score
test-extractors-loaders-js	EXT-CSData-016: Medium-low uncertainty
test-extractors-loaders-js	EXT-CSData-017: Moderate uncertainty
test-extractors-loaders-js	EXT-CSData-018: High uncertainty
test-extractors-loaders-js	EXT-CSData-019: Very high uncertainty
test-extractors-loaders-js	EXT-CSData-020: Positive delta shows up arrow
test-extractors-loaders-js	EXT-CSData-021: Negative delta shows down arrow
test-extractors-loaders-js	EXT-CSData-022: Zero delta shows right arrow
test-extractors-loaders-js	EXT-CSData-023: Null delta shows right arrow
test-extractors-loaders-js	EXT-CSData-024: Positive reduction shows down (good)
test-extractors-loaders-js	EXT-CSData-025: Negative reduction shows up (bad)
test-extractors-loaders-js	EXT-CSData-026: Learning index calculation
test-extractors-loaders-js	EXT-CSData-027: Zero deltas = zero index
test-extractors-loaders-js	EXT-CSData-028: Null deltas handled as zero
test-extractors-loaders-js	EXT-CSData-029: Index capped at 100
test-extractors-loaders-js	EXT-CSData-030: Preflight knowledge score extracted
test-extractors-loaders-js	EXT-CSData-031: Preflight knowledge score correct
test-extractors-loaders-js	EXT-CSData-032: Postflight knowledge score correct
test-extractors-loaders-js	EXT-CSData-033: Delta has correct format
test-extractors-loaders-js	EXT-CSData-034: Learning index calculated
test-extractors-loaders-js	EXT-CSData-035: Gaps closed is array
test-extractors-loaders-js	EXT-CSData-036: New gaps is array
test-extractors-loaders-js	EXT-CSData-037: Missing data returns null
test-extractors-loaders-js	EXT-CSData-038: Learning summary provided even with no data
test-extractors-loaders-js	EXT-CSData-039: Learning summary contains relevant keywords
test-extractors-loaders-js	EXT-CSData-040: Low learning index generates message
test-extractors-loaders-js	EXT-CSData-041: Zero messages no auto-save
test-extractors-loaders-js	EXT-CSData-042: Object facts contribute to pending task extraction
test-extractors-loaders-js	EXT-CSData-043: Observation truncation logs counts without content
test-extractors-loaders-js	EXT-Session-001: generateSessionId exported
test-extractors-loaders-js	EXT-Session-002: getChannel exported
test-extractors-loaders-js	EXT-Session-003: detectContextType exported
test-extractors-loaders-js	EXT-Session-004: detectImportanceTier exported
test-extractors-loaders-js	EXT-Session-005: detectProjectPhase exported
test-extractors-loaders-js	EXT-Session-006: extractActiveFile exported
test-extractors-loaders-js	EXT-Session-007: extractNextAction exported
test-extractors-loaders-js	EXT-Session-008: extractBlockers exported
test-extractors-loaders-js	EXT-Session-009: buildFileProgress exported
test-extractors-loaders-js	EXT-Session-010: countToolsByType exported
test-extractors-loaders-js	EXT-Session-011: calculateSessionDuration exported
test-extractors-loaders-js	EXT-Session-012: calculateExpiryEpoch exported
test-extractors-loaders-js	EXT-Session-013: extractKeyTopics exported
test-extractors-loaders-js	EXT-Session-014: detectSessionCharacteristics exported
test-extractors-loaders-js	EXT-Session-015: buildProjectStateSnapshot exported
test-extractors-loaders-js	EXT-Session-016: Session ID format correct
test-extractors-loaders-js	EXT-Session-017: Session IDs are unique
test-extractors-loaders-js	EXT-Session-018: getChannel returns string
test-extractors-loaders-js	EXT-Session-019: Channel is non-empty
test-extractors-loaders-js	EXT-Session-020: Empty tools = general
test-extractors-loaders-js	EXT-Session-021: Read-heavy = research
test-extractors-loaders-js	EXT-Session-022: Write-heavy = implementation
test-extractors-loaders-js	EXT-Session-023: With decisions = planning
test-extractors-loaders-js	EXT-Session-024: Web-heavy = research
test-extractors-loaders-js	EXT-Session-025: Core path = critical
test-extractors-loaders-js	EXT-Session-026: Security path = critical
test-extractors-loaders-js	EXT-Session-027: Planning context = important
test-extractors-loaders-js	EXT-Session-028: Normal path/context = normal
test-extractors-loaders-js	EXT-Session-029: Empty + few messages = RESEARCH
test-extractors-loaders-js	EXT-Session-030: Write-heavy = IMPLEMENTATION
test-extractors-loaders-js	EXT-Session-031: Decisions + read-heavy = PLANNING
test-extractors-loaders-js	EXT-Session-032: extractActiveFile returns string
test-extractors-loaders-js	EXT-Session-033: extractNextAction returns string
test-extractors-loaders-js	EXT-Session-034: extractBlockers detects blocker keywords
test-extractors-loaders-js	EXT-Session-035: No blockers returns None
test-extractors-loaders-js	EXT-Session-036: buildFileProgress returns array
test-extractors-loaders-js	EXT-Session-037: File status is EXISTS
test-extractors-loaders-js	EXT-Session-038: countToolsByType returns object
test-extractors-loaders-js	EXT-Session-039: Read count exists
test-extractors-loaders-js	EXT-Session-040: Edit count exists
test-extractors-loaders-js	EXT-Session-041: Duration format correct
test-extractors-loaders-js	EXT-Session-042: Empty prompts = N/A
test-extractors-loaders-js	EXT-Session-043: Constitutional never expires
test-extractors-loaders-js	EXT-Session-044: Critical never expires
test-extractors-loaders-js	EXT-Session-045: Temporary expires in 7 days
test-extractors-loaders-js	EXT-Session-046: Normal expires in 90 days
test-extractors-loaders-js	EXT-Session-047: extractKeyTopics returns array
test-extractors-loaders-js	EXT-Session-048: Relevant topics extracted
test-extractors-loaders-js	EXT-Session-049: Stopwords filtered
test-extractors-loaders-js	EXT-Session-050: contextType exists
test-extractors-loaders-js	EXT-Session-051: importanceTier exists
test-extractors-loaders-js	EXT-Session-052: decisionCount is number
test-extractors-loaders-js	EXT-Session-053: toolCounts is object
test-extractors-loaders-js	EXT-Session-054: Snapshot has projectPhase
test-extractors-loaders-js	EXT-Session-055: Snapshot has activeFile
test-extractors-loaders-js	EXT-Session-056: Snapshot has lastAction
test-extractors-loaders-js	EXT-Session-057: Snapshot has nextAction
test-extractors-loaders-js	EXT-Session-058: Snapshot has blockers
test-extractors-loaders-js	EXT-Session-059: Snapshot has fileProgress array
test-extractors-loaders-js	EXT-Decision-001: extractDecisions exported
test-extractors-loaders-js	EXT-Decision-002: Simulation returns DECISIONS
test-extractors-loaders-js	EXT-Decision-003: DECISION_COUNT is number
test-extractors-loaders-js	EXT-Decision-004: DECISIONS is array
test-extractors-loaders-js	EXT-Decision-005: Correct decision count
test-extractors-loaders-js	EXT-Decision-006: Decision has TITLE
test-extractors-loaders-js	EXT-Decision-007: Decision has CONTEXT
test-extractors-loaders-js	EXT-Decision-008: Decision has OPTIONS array
test-extractors-loaders-js	EXT-Decision-009: Decision has CHOSEN
test-extractors-loaders-js	EXT-Decision-010: Decision has RATIONALE
test-extractors-loaders-js	EXT-Decision-010a: CHOICE_CONFIDENCE is number
test-extractors-loaders-js	EXT-Decision-010b: RATIONALE_CONFIDENCE is number
test-extractors-loaders-js	EXT-Decision-011: CONFIDENCE is number
test-extractors-loaders-js	EXT-Decision-012: Decision has ANCHOR_ID
test-extractors-loaders-js	EXT-Decision-013: Decision has IMPORTANCE
test-extractors-loaders-js	EXT-Decision-013a: CHOICE_CONFIDENCE normalized
test-extractors-loaders-js	EXT-Decision-013b: RATIONALE_CONFIDENCE normalized
test-extractors-loaders-js	EXT-Decision-014: HAS_PROS is boolean
test-extractors-loaders-js	EXT-Decision-015: HAS_CONS is boolean
test-extractors-loaders-js	EXT-Decision-016: PROS is array
test-extractors-loaders-js	EXT-Decision-017: CONS is array
test-extractors-loaders-js	EXT-Decision-018: HIGH_CONFIDENCE_COUNT is number
test-extractors-loaders-js	EXT-Decision-019: MEDIUM_CONFIDENCE_COUNT is number
test-extractors-loaders-js	EXT-Decision-020: LOW_CONFIDENCE_COUNT is number
test-extractors-loaders-js	EXT-Decision-021: FOLLOWUP_COUNT is number
test-extractors-loaders-js	EXT-Decision-022: Manual decisions count correct
test-extractors-loaders-js	EXT-Decision-023: Manual decision has TITLE
test-extractors-loaders-js	EXT-Decision-024: Manual decision has ANCHOR_ID
test-extractors-loaders-js	EXT-Decision-025: Importance is valid tier
test-extractors-loaders-js	EXT-Decision-026: Empty observations = 0 decisions
test-extractors-loaders-js	EXT-Decision-027: _manualDecision enriches chosen approach and confidence
test-extractors-loaders-js	EXT-Decision-028: split confidence derives legacy confidence conservatively
test-extractors-loaders-js	EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists
test-extractors-loaders-js	EXT-File-001: detectObservationType exported
test-extractors-loaders-js	EXT-File-002: extractFilesFromData exported
test-extractors-loaders-js	EXT-File-003: enhanceFilesWithSemanticDescriptions exported
test-extractors-loaders-js	EXT-File-004: buildObservationsWithAnchors exported
test-extractors-loaders-js	EXT-File-005: Explicit type preserved
test-extractors-loaders-js	EXT-File-006: Bug keywords = bugfix
test-extractors-loaders-js	EXT-File-007: Implement keywords = feature
test-extractors-loaders-js	EXT-File-008: Refactor keywords = refactor
test-extractors-loaders-js	EXT-File-009: Decision keywords = decision
test-extractors-loaders-js	EXT-File-010: Research keywords = research
test-extractors-loaders-js	EXT-File-011: Discovery keywords = discovery
test-extractors-loaders-js	EXT-File-012: Test keywords = test
test-extractors-loaders-js	EXT-File-012b: Documentation keywords = documentation
test-extractors-loaders-js	EXT-File-012c: Performance keywords = performance
test-extractors-loaders-js	EXT-File-012d: No keywords = observation
test-extractors-loaders-js	EXT-File-013: extractFilesFromData returns array
test-extractors-loaders-js	EXT-File-014: File has FILE_PATH
test-extractors-loaders-js	EXT-File-015: File has DESCRIPTION
test-extractors-loaders-js	EXT-File-016: Duplicate files deduplicated
test-extractors-loaders-js	EXT-File-016b: Normalized path-equivalent files deduplicated
test-extractors-loaders-js	EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH
test-extractors-loaders-js	EXT-File-017: Legacy format supported
test-extractors-loaders-js	EXT-File-018: buildObservationsWithAnchors returns array
test-extractors-loaders-js	EXT-File-019: Observation has TYPE
test-extractors-loaders-js	EXT-File-020: Observation has TITLE
test-extractors-loaders-js	EXT-File-021: Observation has NARRATIVE
test-extractors-loaders-js	EXT-File-022: Observation has ANCHOR_ID
test-extractors-loaders-js	EXT-File-023: HAS_FILES is boolean
test-extractors-loaders-js	EXT-File-024: HAS_FACTS is boolean
test-extractors-loaders-js	EXT-File-025: All anchor IDs unique
test-extractors-loaders-js	EXT-File-026: Caller-side null filtering preserves valid observations
test-extractors-loaders-js	EXT-File-027: Semantic description applied
test-extractors-loaders-js	EXT-File-028: Object facts are rendered instead of dropped
test-extractors-loaders-js	EXT-Conv-001: extractConversations exported
test-extractors-loaders-js	EXT-Conv-002: Simulation returns MESSAGES
test-extractors-loaders-js	EXT-Conv-003: MESSAGE_COUNT is number
test-extractors-loaders-js	EXT-Conv-004: MESSAGES is array
test-extractors-loaders-js	EXT-Conv-005: MESSAGE_COUNT is number
test-extractors-loaders-js	EXT-Conv-006: DURATION exists
test-extractors-loaders-js	EXT-Conv-007: FLOW_PATTERN exists
test-extractors-loaders-js	EXT-Conv-008: PHASE_COUNT is number
test-extractors-loaders-js	EXT-Conv-009: PHASES is array
test-extractors-loaders-js	EXT-Conv-010: TOOL_COUNT is number
test-extractors-loaders-js	EXT-Conv-011: Message has TIMESTAMP
test-extractors-loaders-js	EXT-Conv-012: Message has ROLE
test-extractors-loaders-js	EXT-Conv-013: Message has CONTENT
test-extractors-loaders-js	EXT-Conv-014: Message has TOOL_CALLS array
test-extractors-loaders-js	EXT-Conv-015: Valid FLOW_PATTERN
test-extractors-loaders-js	EXT-Conv-016: AUTO_GENERATED_FLOW exists
test-extractors-loaders-js	EXT-Conv-017: Empty data returns MESSAGES array
test-extractors-loaders-js	EXT-Conv-018: Empty data MESSAGE_COUNT is 0
test-extractors-loaders-js	EXT-Conv-019: DATE in ISO format
test-extractors-loaders-js	EXT-Conv-020: Object facts still drive conversation tool-call detection
test-extractors-loaders-js	EXT-Conv-021: UNIQUE_PHASE_COUNT is number
test-extractors-loaders-js	EXT-Conv-022: TOPIC_CLUSTERS is array
test-extractors-loaders-js	EXT-Conv-023: Non-contiguous phases remain separate segments
test-extractors-loaders-js	EXT-Impl-001: hasImplementationWork exported
test-extractors-loaders-js	EXT-Impl-002: extractMainTopic exported
test-extractors-loaders-js	EXT-Impl-003: extractWhatBuilt exported
test-extractors-loaders-js	EXT-Impl-004: extractKeyFilesWithRoles exported
test-extractors-loaders-js	EXT-Impl-005: generateExtensionGuide exported
test-extractors-loaders-js	EXT-Impl-006: extractCodePatterns exported
test-extractors-loaders-js	EXT-Impl-007: buildImplementationGuideData exported
test-extractors-loaders-js	EXT-Impl-008: Detects implementation work
test-extractors-loaders-js	EXT-Impl-009: No work with empty data
test-extractors-loaders-js	EXT-Impl-010: Research-only not implementation
test-extractors-loaders-js	EXT-Impl-011: Topic from folder name
test-extractors-loaders-js	EXT-Impl-012: Topic from observations is string
test-extractors-loaders-js	EXT-Impl-013: extractWhatBuilt returns array
test-extractors-loaders-js	EXT-Impl-014: Feature has FEATURE_NAME
test-extractors-loaders-js	EXT-Impl-015: Feature has DESCRIPTION
test-extractors-loaders-js	EXT-Impl-016: Duplicate features deduplicated
test-extractors-loaders-js	EXT-Impl-017: extractKeyFilesWithRoles returns array
test-extractors-loaders-js	EXT-Impl-018: Key file has FILE_PATH
test-extractors-loaders-js	EXT-Impl-019: Key file has ROLE
test-extractors-loaders-js	EXT-Impl-020: Test file role detected
test-extractors-loaders-js	EXT-Impl-021: Config file role detected
test-extractors-loaders-js	EXT-Impl-022: generateExtensionGuide returns array
test-extractors-loaders-js	EXT-Impl-023: Guide has GUIDE_TEXT
test-extractors-loaders-js	EXT-Impl-024: extractCodePatterns returns array
test-extractors-loaders-js	EXT-Impl-027: Guide detected
test-extractors-loaders-js	EXT-Impl-028: Guide has TOPIC
test-extractors-loaders-js	EXT-Impl-029: Guide has IMPLEMENTATIONS
test-extractors-loaders-js	EXT-Impl-030: Guide has IMPL_KEY_FILES
test-extractors-loaders-js	EXT-Impl-031: Guide has EXTENSION_GUIDES
test-extractors-loaders-js	EXT-Impl-032: Guide has PATTERNS
test-extractors-loaders-js	EXT-Impl-033: No guide when no impl work
test-extractors-loaders-js	EXT-Diag-001: extractPhasesFromData exported
test-extractors-loaders-js	EXT-Diag-002: extractDiagrams exported
test-extractors-loaders-js	EXT-Diag-003: extractPhasesFromData returns array
test-extractors-loaders-js	EXT-Diag-004: Phase has PHASE_NAME
test-extractors-loaders-js	EXT-Diag-005: Phase has DURATION
test-extractors-loaders-js	EXT-Diag-006: Phase has ACTIVITIES array
test-extractors-loaders-js	EXT-Diag-007: Null data returns simulation phases
test-extractors-loaders-js	EXT-Diag-008: Short session returns array
test-extractors-loaders-js	EXT-Diag-009: extractDiagrams returns DIAGRAMS array
test-extractors-loaders-js	EXT-Diag-010: DIAGRAM_COUNT is number
test-extractors-loaders-js	EXT-Diag-011: HAS_AUTO_GENERATED is true
test-extractors-loaders-js	EXT-Diag-012: FLOW_TYPE exists
test-extractors-loaders-js	EXT-Diag-013: AUTO_CONVERSATION_FLOWCHART exists
test-extractors-loaders-js	EXT-Diag-014: AUTO_DECISION_TREES is array
test-extractors-loaders-js	EXT-Diag-015: DIAGRAM_TYPES is array
test-extractors-loaders-js	EXT-Diag-016: PATTERN_SUMMARY is array
test-extractors-loaders-js	EXT-Diag-017: ASCII art processing works
test-extractors-loaders-js	EXT-Diag-018: Simulation returns DIAGRAMS
test-extractors-loaders-js	LOAD-001: loadCollectedData exported
test-extractors-loaders-js	LOAD-003: loadCollectedData reads a data file inside a linked .skilled
test-extractors-loaders-js	EXT-IDX-001: extractFilesFromData re-exported
test-extractors-loaders-js	EXT-IDX-002: extractDiagrams re-exported
test-extractors-loaders-js	EXT-IDX-003: extractConversations re-exported
test-extractors-loaders-js	EXT-IDX-004: extractDecisions re-exported
test-extractors-loaders-js	EXT-IDX-005: collectSessionData re-exported
test-extractors-loaders-js	EXT-IDX-006: detectObservationType re-exported
test-extractors-loaders-js	EXT-IDX-007: buildObservationsWithAnchors re-exported
test-extractors-loaders-js	EXT-IDX-008: generateSessionId re-exported
test-extractors-loaders-js	EXT-IDX-009: getChannel re-exported
test-extractors-loaders-js	EXT-IDX-010: buildImplementationGuideData re-exported
test-extractors-loaders-js	ERR-001: Empty object returns observation
test-extractors-loaders-js	ERR-002: Null/undefined properties handled
test-extractors-loaders-js	ERR-003: Null FILES handled
test-extractors-loaders-js	ERR-004: Invalid file objects handled
test-extractors-loaders-js	ERR-005: Empty arrays return object
test-extractors-loaders-js	ERR-006: Null properties handled
test-extractors-loaders-js	ERR-007: Null facts handled
test-extractors-loaders-js	ERR-008: Empty narrative handled
test-extractors-loaders-js	ERR-009: Empty string returns array
test-extractors-loaders-js	ERR-010: Null summary returns array
test-extractors-loaders-js	ERR-011: Invalid date handled
test-extractors-loaders-js	INT-001: Files and observations extracted together
test-extractors-loaders-js	INT-002: Decisions and diagrams extracted together
test-extractors-loaders-js	INT-003: Conversations with phases extracted
test-extractors-loaders-js	INT-004: Session characteristics detected
test-extractors-loaders-js	INT-005: Implementation guide built
test-phase-validation-js	phase-detection/below-threshold: recommended_phases
test-phase-validation-js	phase-detection/below-threshold: phase_score
test-phase-validation-js	phase-detection/below-threshold: suggested_phase_count
test-phase-validation-js	phase-detection/boundary: recommended_phases
test-phase-validation-js	phase-detection/boundary: phase_score
test-phase-validation-js	phase-detection/boundary: suggested_phase_count
test-phase-validation-js	phase-detection/above-threshold: recommended_phases
test-phase-validation-js	phase-detection/above-threshold: phase_score
test-phase-validation-js	phase-detection/above-threshold: suggested_phase_count
test-phase-validation-js	phase-detection/extreme-scale: recommended_phases
test-phase-validation-js	phase-detection/extreme-scale: phase_score
test-phase-validation-js	phase-detection/extreme-scale: suggested_phase_count
test-phase-validation-js	phase-detection/no-risk-factors: recommended_phases
test-phase-validation-js	phase-detection/no-risk-factors: phase_score
test-phase-validation-js	phase-detection/no-risk-factors: suggested_phase_count
test-phase-validation-js	recommend-level default-on: recommended_phases field present without --recommend-phases
test-phase-validation-js	recommend-level default-on: phase_score field present without --recommend-phases
test-phase-validation-js	recommend-level default-on: suggested_phase_count field present without --recommend-phases
test-phase-validation-js	phase-2/single-phase: PHASE_MODE true
test-phase-validation-js	phase-2/single-phase: PHASE_COUNT
test-phase-validation-js	phase-2/single-phase: creates 001-foundation/spec.md
test-phase-validation-js	phase-2/multi-phase: PHASE_MODE true
test-phase-validation-js	phase-2/multi-phase: PHASE_COUNT
test-phase-validation-js	phase-2/multi-phase: creates 001-foundation/spec.md
test-phase-validation-js	phase-2/multi-phase: creates 002-implementation/spec.md
test-phase-validation-js	phase-2/multi-phase: creates 003-stabilization/spec.md
test-phase-validation-js	phase-2/named-phases: PHASE_MODE true
test-phase-validation-js	phase-2/named-phases: PHASE_COUNT
test-phase-validation-js	phase-2/named-phases: creates 001-planning/spec.md
test-phase-validation-js	phase-2/named-phases: creates 002-delivery/spec.md
test-phase-validation-js	phase-2/error-cases: invalid args return non-zero exit
test-phase-validation-js	phase-validation/flat-spec: validates the parent alone
test-phase-validation-js	phase-validation/one-phase: validates every phase child
test-phase-validation-js	phase-validation/one-phase: validate.sh auto-enables recursive mode when phase children exist
test-phase-validation-js	phase-validation/three-phase: validates every phase child
test-phase-validation-js	phase-validation/three-phase: validate.sh auto-enables recursive mode when phase children exist
test-phase-validation-js	phase-validation/mixed-levels: validates every phase child
test-phase-validation-js	phase-validation/mixed-levels: validate.sh auto-enables recursive mode when phase children exist
test-phase-validation-js	phase-validation/empty-child: validates every phase child
test-phase-validation-js	phase-validation/empty-child: empty child produces validation errors
test-phase-validation-js	phase-validation/empty-child: validate.sh auto-enables recursive mode when phase children exist
test-phase-validation-js	phase-validation/broken-links: validates every phase child
test-phase-validation-js	phase-validation/broken-links: validate.sh auto-enables recursive mode when phase children exist
test-phase-validation-js	path-safety: create.sh rejects outside --subfolder path
test-phase-validation-js	path-safety: create.sh reports allowed root containment error
test-phase-validation-js	path-safety: create.sh rejects symlink escape path
test-phase-validation-js	path-safety: create.sh enforces canonical containment for symlink path
test-phase-validation-js	path-safety: archive.sh rejects paths outside specs root
test-phase-validation-js	path-safety: archive.sh reports outside-specs-root rejection
test-phase-validation-js	path-safety: archive.sh rejects restore from non-archive path
test-phase-validation-js	path-safety: archive.sh reports restore containment error
test-phase-system-js	recommend-level below-threshold-no-phase: recommended_phases
test-phase-system-js	recommend-level below-threshold-no-phase: phase_score
test-phase-system-js	recommend-level below-threshold-no-phase: suggested_phase_count
test-phase-system-js	recommend-level threshold-hit-level-gate-blocks: recommended_phases
test-phase-system-js	recommend-level threshold-hit-level-gate-blocks: phase_score
test-phase-system-js	recommend-level threshold-hit-level-gate-blocks: suggested_phase_count
test-phase-system-js	recommend-level above-threshold-two-phase: recommended_phases
test-phase-system-js	recommend-level above-threshold-two-phase: phase_score
test-phase-system-js	recommend-level above-threshold-two-phase: suggested_phase_count
test-phase-system-js	recommend-level extreme-scale-four-phase: recommended_phases
test-phase-system-js	recommend-level extreme-scale-four-phase: phase_score
test-phase-system-js	recommend-level extreme-scale-four-phase: suggested_phase_count
test-phase-system-js	recommend-level no-risk-factors-level-gate: recommended_phases
test-phase-system-js	recommend-level no-risk-factors-level-gate: phase_score
test-phase-system-js	recommend-level no-risk-factors-level-gate: suggested_phase_count
test-phase-system-js	create.sh parent mode: PHASE_MODE true
test-phase-system-js	create.sh parent mode: first append phase count
test-phase-system-js	create.sh parent mode: 001-foundation created
test-phase-system-js	create.sh parent mode: 002-implementation created
test-phase-system-js	create.sh parent mode: second append phase count
test-phase-system-js	create.sh parent mode: 003-stabilization created
test-phase-system-js	create.sh parent mode: phase-map section not duplicated
test-phase-system-js	create.sh parent mode: appended phase row continues the phase-map table
test-phase-system-js	create.sh parent mode: append updates handoff rows for new phase transition
test-phase-system-js	create.sh parent mode: append removes single-phase placeholder handoff row
test-phase-system-js	create.sh parent mode: absolute phase numbering in child header
test-phase-system-js	create.sh parent mode: predecessor links to prior phase
test-validation-system-cjs	Level detection: Bold level in table
test-validation-system-cjs	Level detection: Bold level 2
test-validation-system-cjs	Level detection: Bold level 3
test-validation-system-cjs	Level detection: Non-bold level
test-validation-system-cjs	Level detection: YAML frontmatter style
test-validation-system-cjs	Level detection: Inline Level: N
test-validation-system-cjs	Level detection: Inline Level N
test-validation-system-cjs	Level inference: L1 from file absence
test-validation-system-cjs	Level inference: L2 from merged verification
test-validation-system-cjs	Level inference: L3 from decision-record.md
test-validation-system-cjs	L1 required files present
test-validation-system-cjs	L2 scaffolds no standalone checklist
test-validation-system-cjs	L3 adds decision-record.md
test-validation-system-cjs	Missing spec.md detected
test-validation-system-cjs	Impl-summary required after completion
test-validation-system-cjs	Placeholder pattern: YOUR_VALUE_HERE
test-validation-system-cjs	Placeholder pattern: NEEDS CLARIFICATION
test-validation-system-cjs	Placeholder pattern: Mustache placeholder
test-validation-system-cjs	Placeholder in code block ignored
test-validation-system-cjs	Placeholder in inline code detected
test-validation-system-cjs	Valid content has no placeholders
test-validation-system-cjs	Fixture 005 has placeholders
test-validation-system-cjs	Valid anchor pairs
test-validation-system-cjs	Unclosed anchor detection
test-validation-system-cjs	Orphaned closing anchor detection
test-validation-system-cjs	Nested anchors valid
test-validation-system-cjs	Duplicate anchor IDs rejected
test-validation-system-cjs	spec.md required sections present
test-validation-system-cjs	Missing section detection
test-validation-system-cjs	Case-insensitive section matching
test-validation-system-cjs	Checklist P0/P1 sections
test-validation-system-cjs	Decision-record ADR sections
test-validation-system-cjs	Exit code 0 = PASS
test-validation-system-cjs	Exit code 1 = WARN
test-validation-system-cjs	Exit code 2 = ERROR
test-validation-system-cjs	Compliant fixture: exit 0
test-validation-system-cjs	Empty folder: exit 2 (ERROR)
test-validation-system-cjs	Placeholder fixture: exit 2 (ERROR)
test-validation-system-cjs	--strict mode: warnings become errors
test-validation-system-cjs	SPECKIT_STRICT=true env var
test-validation-system-cjs	--json produces valid JSON
test-validation-system-cjs	JSON has required fields
test-validation-system-cjs	JSON passed is boolean
test-validation-system-cjs	JSON entries is array
test-validation-system-cjs	JSON summary has error/warning counts
test-validation-system-cjs	Level mismatch detection
test-validation-system-cjs	File presence hint detection
test-validation-system-cjs	L2 missing checklist.md detection
test-validation-system-cjs	All 33 rule scripts exist
test-validation-system-cjs	check-files.sh has run_check()
test-validation-system-cjs	check-placeholders.sh has run_check()
test-validation-system-cjs	check-comment-hygiene.sh has run_check()
test-validation-system-cjs	check-scaffold-never-touched.sh has run_check()
test-validation-system-cjs	check-status-cross-doc-consistency.sh has run_check()
test-validation-system-cjs	check-level.sh has run_check()
test-validation-system-cjs	check-ac-coverage.sh has run_check()
test-validation-system-cjs	check-ac-closure.sh has run_check()
test-validation-system-cjs	check-toc-policy.sh has run_check()
test-validation-system-cjs	check-ai-protocols.sh has run_check()
test-validation-system-cjs	check-complexity.sh has run_check()
test-validation-system-cjs	check-folder-naming.sh has run_check()
test-validation-system-cjs	check-frontmatter.sh has run_check()
test-validation-system-cjs	check-frontmatter-values.sh has run_check()
test-validation-system-cjs	check-source-tags.sh has run_check()
test-validation-system-cjs	check-measured-behavior.sh has run_check()
test-validation-system-cjs	check-grep-convention.sh has run_check()
test-validation-system-cjs	check-level-match.sh has run_check()
test-validation-system-cjs	check-graph-metadata.sh has run_check()
test-validation-system-cjs	check-graph-metadata-child-drift.sh has run_check()
test-validation-system-cjs	check-graph-metadata-child-identity.sh has run_check()
test-validation-system-cjs	check-graph-metadata-shape.sh has run_check()
test-validation-system-cjs	check-metadata-disk-consistency.sh has run_check()
test-validation-system-cjs	check-description-shape.sh has run_check()
test-validation-system-cjs	check-normalizer-lint.sh has run_check()
test-validation-system-cjs	check-spec-doc-integrity.sh has run_check()
test-validation-system-cjs	check-template-source.sh has run_check()
test-validation-system-cjs	check-canonical-save-root-spec.sh has run_check()
test-validation-system-cjs	check-canonical-save-source-docs.sh has run_check()
test-validation-system-cjs	check-canonical-save-lineage.sh has run_check()
test-validation-system-cjs	check-canonical-save-packet-identity.sh has run_check()
test-validation-system-cjs	check-canonical-save-description-graph-freshness.sh has run_check()
test-validation-system-cjs	check-links.sh has run_check()
test-validation-system-cjs	validate.sh orchestrator exists
test-validation-system-cjs	Sufficient fixture count
test-validation-system-cjs	Fixtures for valid
test-validation-system-cjs	Fixtures for invalid
test-validation-system-cjs	Fixtures for anchors
test-validation-system-cjs	Fixtures for evidence
test-validation-system-cjs	Fixtures for priority
test-validation-system-cjs	Fixtures for level
test-validation-system-cjs	Fixtures for placeholder
test-validation-system-cjs	Fixture exists: 001-empty-folder
test-validation-system-cjs	Fixture exists: 002-valid-level1
test-validation-system-cjs	Fixture exists: 003-valid-level2
test-validation-system-cjs	Fixture exists: 004-valid-level3
test-validation-system-cjs	Fixture exists: 005-unfilled-placeholders
test-validation-system-cjs	Fixture exists: 006-missing-required-files
test-validation-system-cjs	Fixture exists: 007-valid-anchors
test-validation-system-cjs	Fixture exists: 008-invalid-anchors
test-validation-system-cjs	Quiet mode minimal output
test-validation-system-cjs	Quiet mode reduces output
test-validation-sh	[Positive Tests (should PASS or WARN)] Compliant Level 2 template fixture
test-validation-sh	[Positive Tests (should PASS or WARN)] Extra-header fixture warns without failing
test-validation-sh	[Level Declaration Tests (should PASS or WARN)] Explicit level declaration on compliant fixture
test-validation-sh	[Warning Tests (should WARN)] Template extra-header fixture warns
test-validation-sh	[Sections Present Tests (should FAIL on missing)] Missing required spec header now fails
test-validation-sh	[Negative Tests (should FAIL)] Missing required files (no spec.md)
test-validation-sh	[Negative Tests (should FAIL)] Unfilled placeholders
test-validation-sh	[Negative Tests (should FAIL)] Invalid anchors (unclosed, mismatched, orphaned)
test-validation-sh	[Negative Tests (should FAIL)] Empty folder (all L1 files missing)
test-validation-sh	[Negative Tests (should FAIL)] Missing plan.md (L1)
test-validation-sh	[Negative Tests (should FAIL)] Missing tasks.md (L1)
test-validation-sh	[Negative Tests (should FAIL)] Level 3 missing decision-record.md
test-validation-sh	[Negative Tests (should FAIL)] Missing required header fails
test-validation-sh	[Negative Tests (should FAIL)] Reordered required header fails
test-validation-sh	[Negative Tests (should FAIL)] Missing required anchor fails
test-validation-sh	[Negative Tests (should FAIL)] Reordered required anchor fails
test-validation-sh	[Anchor Edge Cases] Compliant anchor order passes
test-validation-sh	[Anchor Edge Cases] Missing required anchor fails
test-validation-sh	[Anchor Edge Cases] Reordered required anchor fails
test-validation-sh	[Placeholder Edge Cases] Compliant fixture stays placeholder-free
test-validation-sh	[Placeholder Edge Cases] Multiple placeholders across files (all detected)
test-validation-sh	[Placeholder Edge Cases] Placeholder case variations (detected)
test-validation-sh	[CLI Options Tests] --json produces valid JSON with required fields
test-validation-sh	[CLI Options Tests] --strict mode: warnings stay advisory
test-validation-sh	[CLI Options Tests] --quiet mode: minimal output
test-validation-sh	[CLI Options Tests] Env var: SPECKIT_STRICT=true
test-validation-sh	[CLI Options Tests] Compliant fixture remains stable across default rule order
test-validation-sh	[Exact Exit Code Tests] Exact exit 0: compliant fixture
test-validation-sh	[Exact Exit Code Tests] Exact exit 1: unknown option
test-validation-sh	[Exact Exit Code Tests] Exact exit 2: validation error
test-validation-sh	[Exact Exit Code Tests] Exact exit 3: missing folder
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L1: All files present
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L2: All files present (includes checklist)
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L3: All files present (includes decision-record)
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing spec.md
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing plan.md
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing tasks.md
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] L3: Missing decision-record.md
test-validation-extended-sh	[Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing)
test-validation-extended-sh	[Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1
test-validation-extended-sh	[Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2
test-validation-extended-sh	[Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] No placeholders
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] [YOUR_VALUE_HERE:] detected
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] Template provenance token in a title detected
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] Multiple placeholders
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] Case variations ignored by canonical shell markers
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] In code block (ignored)
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] In inline code (ignored)
test-validation-extended-sh	[Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] In memory/ (skipped)
test-validation-extended-sh	[Individual Rule: COMMENT_HYGIENE_MARKER (check-comment-hygiene.sh)] No markers
test-validation-extended-sh	[Individual Rule: COMMENT_HYGIENE_MARKER (check-comment-hygiene.sh)] Marker detected
test-validation-extended-sh	[Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Scaffold marker with Complete status detected
test-validation-extended-sh	[Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Genuinely complete docs pass
test-validation-extended-sh	[Shared Status Classifier] Not Started classifies as planned
test-validation-extended-sh	[Shared Enforcement Flag Parsing] Enforce flag matrix applies to both rules
test-validation-extended-sh	[Metadata Parse Errors] Malformed generated metadata emits a warning
test-validation-extended-sh	[Individual Rule: LEVEL_DECLARED (check-level.sh)] Level detection (isolated=inferred)
test-validation-extended-sh	[Individual Rule: LEVEL_DECLARED (check-level.sh)] Inferred level (info)
test-validation-extended-sh	[Individual Rule: LEVEL_DECLARED (check-level.sh)] Level 0 (fallback)
test-validation-extended-sh	[Individual Rule: LEVEL_DECLARED (check-level.sh)] Level 5 out of range
test-validation-extended-sh	[Individual Rule: LEVEL_DECLARED (check-level.sh)] Level without bold
test-validation-extended-sh	[Individual Rule: AI_PROTOCOL (check-ai-protocols.sh)] L3 (missing protocol=warn)
test-validation-extended-sh	[Individual Rule: AI_PROTOCOL (check-ai-protocols.sh)] L1 (skipped)
test-validation-extended-sh	[Individual Rule: AI_PROTOCOL (check-ai-protocols.sh)] L2 (skipped)
test-validation-extended-sh	[Individual Rule: LEVEL_MATCH (check-level-match.sh)] L1 (level declared)
test-validation-extended-sh	[Individual Rule: LEVEL_MATCH (check-level-match.sh)] L2 (level consistency)
test-validation-extended-sh	[Individual Rule: LEVEL_MATCH (check-level-match.sh)] L3 (level consistency)
test-validation-extended-sh	[Individual Rule: COMPLEXITY_MATCH (check-complexity.sh)] L1 complexity check
test-validation-extended-sh	[Individual Rule: COMPLEXITY_MATCH (check-complexity.sh)] L2 complexity check
test-validation-extended-sh	[Individual Rule: COMPLEXITY_MATCH (check-complexity.sh)] L3 complexity check
test-validation-extended-sh	[Orchestrator: Valid Fixtures (Exit 0 or 1)] 053-template-compliant-level2 passes cleanly
test-validation-extended-sh	[Orchestrator: Warning Fixtures (Exit 0)] 054-template-extra-header warns
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 001-empty-folder fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 005-unfilled-placeholders fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 006-missing-required-files fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 008-invalid-anchors fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 028-level3-missing-decision fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 032-missing-plan fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 035-missing-tasks fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 036-multiple-placeholders fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 055-template-missing-header fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 056-template-reordered-header fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 057-template-missing-anchor fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 058-template-reordered-anchor fails
test-validation-extended-sh	[Orchestrator: Error Fixtures (Exit 2)] 072 scaffold marker fails through default registry bridge
test-validation-extended-sh	[Exit Code Verification] Exit 0: Compact compliant fixture returns pass
test-validation-extended-sh	[Exit Code Verification] Exit 0: Warning fixture returns warn
test-validation-extended-sh	[Exit Code Verification] Exit 2: Errors return fail
test-validation-extended-sh	[Exit Code Verification] Exit 2: Missing files return fail
test-validation-extended-sh	[Exit Code Verification] Exit 2: Missing required header returns fail
test-validation-extended-sh	[Exit Code Verification] Exact exit 0: compliant fixture
test-validation-extended-sh	[Exit Code Verification] Exact exit 1: unknown option
test-validation-extended-sh	[Exit Code Verification] Exact exit 2: validation error
test-validation-extended-sh	[Exit Code Verification] Exact exit 3: missing folder
test-validation-extended-sh	[JSON Output Mode] --json compact compliant fixture produces valid JSON
test-validation-extended-sh	[JSON Output Mode] --json warning fixture produces valid JSON
test-validation-extended-sh	[JSON Output Mode] --json error fixture produces valid JSON
test-validation-extended-sh	[CLI Options] --strict: warnings stay advisory
test-validation-extended-sh	[CLI Options] --verbose: detailed compact output
test-validation-extended-sh	[CLI Options] --quiet: minimal output (compact pass)
test-validation-extended-sh	[CLI Options] --quiet: minimal output (warn)
test-validation-extended-sh	[CLI Options] --quiet: minimal output (error)
test-validation-extended-sh	[CLI Options] SPECKIT_STRICT=true env var
test-validation-extended-sh	[Edge Cases: Anchor Scenarios] Compliant anchor order passes cleanly
test-validation-extended-sh	[Edge Cases: Anchor Scenarios] Missing required anchor fails
test-validation-extended-sh	[Edge Cases: Anchor Scenarios] Reordered required anchor fails
test-validation-extended-sh	[Edge Cases: Evidence Patterns] Compliant evidence citations pass cleanly
test-validation-extended-sh	[Edge Cases: Placeholder Contexts] Compliant fixture stays placeholder-free cleanly
test-validation-extended-sh	[Edge Cases: Placeholder Contexts] Multiple across files detected
test-validation-extended-sh	[Edge Cases: Placeholder Contexts] Case variations detected
test-validation-extended-sh	[Edge Cases: Level Detection] Explicit level on compliant fixture passes cleanly
test-validation-extended-sh	[Edge Cases: Level Detection] Level 0 invalid (error from mismatch)
test-validation-extended-sh	[Edge Cases: Level Detection] Level 5 out of range (error from mismatch)
test-validation-extended-sh	[Edge Cases: Special Directories] Compliant fixture stays stable without special directories
check-ac-closure-sh	cutoff day itself is grandfathered
check-ac-closure-sh	after cutoff, missing document blocks
check-ac-closure-sh	before cutoff, missing document advisory
check-ac-closure-sh	pre-cutoff completion claim stays advisory
check-ac-closure-sh	pre-cutoff dangling waiver stays advisory
check-ac-closure-sh	completion claim with unmet criterion
check-ac-closure-sh	unmet criterion mid-flight does not block
check-ac-closure-sh	all met is closeable
check-ac-closure-sh	bold id still counts
check-ac-closure-sh	backticked id still counts
check-ac-closure-sh	lowercase id still counts
check-ac-closure-sh	unparseable id is reported
check-ac-closure-sh	unbalanced fence is reported
check-ac-closure-sh	duplicate ids are reported
check-ac-closure-sh	status 'Not Complete' is not a completion claim
check-ac-closure-sh	status 'Incomplete' is not a completion claim
check-ac-closure-sh	status 'Abandoned' is not a completion claim
check-ac-closure-sh	status 'Blocked - nothing done yet' is not a completion
check-ac-closure-sh	extra column does not shift Status
check-ac-closure-sh	escaped pipe does not shift Status
check-ac-closure-sh	fenced ADR does not satisfy a waiver
check-ac-closure-sh	bold list ADR satisfies a waiver
check-ac-closure-sh	table-row ADR satisfies a waiver
check-ac-closure-sh	ADR-1 and ADR-001 are the same record
check-ac-closure-sh	waiver citing a missing ADR fails
check-ac-closure-sh	waiver naming no ADR fails
check-ac-closure-sh	every cited ADR must exist
check-ac-closure-sh	non-boolean flag keeps the gate on
check-ac-closure-sh	malformed cutoff falls back, not grandfather-all
check-ac-coverage-sh	prose verification counts as no evidence
check-ac-coverage-sh	file:line in the Verification cell is evidence
check-ac-coverage-sh	a waived criterion needs no citation
check-ac-coverage-sh	a superseded criterion needs no citation
check-ac-coverage-sh	cited and retired count, prose and blank do not
check-ac-coverage-sh	an extra column does not shift Verification
check-ac-coverage-sh	a column before AC-ID does not zero the count
check-ac-coverage-sh	an Incomplete packet does not activate the gate
check-ac-coverage-sh	a fenced example is not a criterion
check-ac-coverage-sh	canonical doc alone activates the gate
check-ac-coverage-sh	a criteria table with no rows is a no-op
check-ac-coverage-sh	no criteria and no source is inactive
check-ac-coverage-sh	the gate stays off below Level 2
check-ac-coverage-sh	the merged tasks document is the traceability source
check-ac-coverage-sh	a stray pre-merge copy is not a source
check-ac-coverage-sh	tasks.md without the protocol anchor is not a source
check-ac-coverage-sh	enforce fails a post-cutoff packet under the floor
check-ac-coverage-sh	enforce stays advisory on or before the cutoff
check-ac-coverage-sh	enforce stays advisory with no creation date
check-ac-coverage-sh	a later cutoff grandfathers the packet
check-ac-coverage-sh	a malformed cutoff falls back to the default
check-ac-coverage-sh	without the switch a post-cutoff packet is advisory
check-ac-coverage-sh	a Complete criteria document activates the gate alone
check-ac-coverage-sh	a Draft criteria document with no summary stays inacti
check-ac-coverage-sh	a Manual-infeasible row with a rationale counts, a bar
check-ac-coverage-sh	the parser lists every citation of a counted row
check-ac-coverage-sh	empty id and citation lists are written as -
check-ac-coverage-sh	a citation inside the file resolves
check-ac-coverage-sh	a missing file and line 0 or past the end do not
check-ac-coverage-sh	a directory and an ellipsis path do not resolve
check-ac-coverage-sh	the root is tried after the packet folder
check-ac-coverage-sh	an empty list reports nothing
check-ac-coverage-sh	unresolved citations are named with their AC id
check-ac-coverage-sh	an unresolved citation still counts as coverage
check-ac-coverage-sh	resolving citations add no detail
check-ac-coverage-sh	the ratio before the cited file exists
check-ac-coverage-sh	the ratio after the cited file exists is the same
check-ac-coverage-sh	a path from the repository root resolves
check-ac-coverage-sh	the legacy table names an unresolved citation
check-ac-coverage-sh	the legacy ratio is unchanged
check-ac-coverage-sh	a resolving legacy citation adds no detail
check-ac-coverage-sh	citations joined by a comma or semicolon split cleanly
check-ac-coverage-sh	a line number too long to be real does not resolve
check-ac-coverage-sh	a citation that climbs out of the folder resolves only
check-ac-coverage-sh	a legacy row naming two ids reports only real misses
check-graph-metadata-child-drift-sh	missing child → advisory (status=pass, ADVISORY message, names 001-foo)
check-graph-metadata-child-drift-sh	missing child + enforce → status=warn naming 001-foo (--strict escalates)
check-graph-metadata-child-drift-sh	listed child → clean pass in advisory and enforce (no drift)
check-graph-metadata-child-drift-sh	foreign other-parent/001-foo does not satisfy local 001-foo
check-graph-metadata-child-drift-sh	cross-track track-b/900-shared-name/001-foo does not satisfy local track-a/900-shared-name/001-foo
check-graph-metadata-child-drift-sh	own-track track-a/900-shared-name/001-foo correctly satisfies local child
check-graph-metadata-child-drift-sh	underscore folder 010_experiment flagged (writer pattern, not strict slug)
check-graph-metadata-child-drift-sh	extra listed entry 999-gone (not on disk) → still pass under enforce
check-graph-metadata-child-drift-sh	leaf with no numbered children → pass under enforce (no false positive)
check-graph-metadata-child-drift-sh	scanner unavailable → enforce warns (fail-closed), advisory stays clean
check-graph-metadata-child-drift-sh	default path: flag OFF → orchestrator pass (advisory), flag ON → orchestrator warn
check-graph-metadata-child-drift-sh	reconciled parent → orchestrator pass under enforce (no false positive)
check-graph-metadata-shape-last-active-child-sh	Full packet_id whose basename resolves → status=pass (no spurious warn)
check-graph-metadata-shape-last-active-child-sh	Stale pointer (neither full path nor basename exists) → status=warn
test-phase-system-sh	create.sh --phase defaults to 3 phases
test-phase-system-sh	Default phase run created 3 child folders
test-phase-system-sh	New phase parent's map lists all 3 phases and keeps no row marker
test-phase-system-sh	Append mode reports 2 newly created phases
test-phase-system-sh	Append mode created sequential child folders under parent
test-phase-system-sh	Appended phase child headers link predecessor and successor correctly
test-phase-system-sh	Appended phase rows continue the parent's phase-map table
test-phase-system-sh	New-parent creation still invokes the description generator for the parent
test-phase-system-sh	Append mode never invokes the description generator against the existing parent's path
test-phase-system-sh	Append mode still generates description.json for the newly created child phase
test-phase-system-sh	A new parent's first child is labeled Phase 1
test-phase-system-sh	Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title
```

Line count: 928.

## 4. Exact name matches

None. The two lists share no normalized test name.

Exact matches: 0.
Overlap count: 6

The count is 0 exact matches plus the 6 candidate pairs marked `same` in section 6.

## 5. Candidate pairs

245 candidate pairs. Each pair id is stable for this report.

| Pair | Legacy name | Lane | CLI test name | Shared tokens |
|---|---|---|---|---|
| P001 | T-001g: getSpecsDirectories() returns non-empty array | test-scripts-modules-js | returns empty array for all-filtered input | array, empty, returns |
| P002 | T-001g: getSpecsDirectories() returns non-empty array | test-scripts-modules-js | returns empty array for empty input | array, empty, returns |
| P003 | T-003e: sanitizePath rejects path outside allowed directories | test-scripts-modules-js | rejects a lexical escape and an absolute path outside the root | outside, path, rejects |
| P004 | T-004a: normalizeInputData passes MCP data through | test-scripts-modules-js | passes JSON-mode data and explicit CLI spec-folder override through main() | data, passes, through |
| P005 | T-026a: hasImplementationWork returns false for empty data | test-scripts-modules-js | returns false for empty or non-string input | empty, false, returns |
| P006 | T-026c: extractMainTopic extracts from spec folder | test-scripts-modules-js | extracts task progress and decisions from spec-folder docs without crashing on sparse inputs | extracts, folder, spec |
| P007 | T-034k: cleanDescription truncates long descriptions | test-scripts-modules-js | truncates long descriptions | descriptions, long, truncates |
| P008 | T-008i: phase-classifier preserves non-contiguous phase returns | test-scripts-modules-js | keeps non-contiguous phase returns as separate timeline segments | contiguous, phase, returns |
| P009 | T-008j: phase-classifier derives Iterative Loop flow pattern | test-scripts-modules-js | derives each supported flow pattern | derives, flow, pattern |
| P010 | T-036k: format_follow_up_box returns empty for empty array | test-scripts-modules-js | returns empty array for all-filtered input | array, empty, returns |
| P011 | T-036k: format_follow_up_box returns empty for empty array | test-scripts-modules-js | returns empty array for empty input | array, empty, returns |
| P012 | T-042e: SPEC_FOLDER_PATTERN matches valid folder names | test-scripts-modules-js | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | folder, spec, valid |
| P013 | T-042e: SPEC_FOLDER_PATTERN matches valid folder names | test-scripts-modules-js | matches a spec folder exactly or as a prefix, like the SQL scope filter | folder, matches, spec |
| P014 | T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names | test-scripts-modules-js | rejects metadata-missing and deprecated spec-folder bindings | folder, rejects, spec |
| P015 | T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names | test-scripts-modules-js | exits non-zero when stdin/json mode resolves an invalid explicit target spec folder | folder, invalid, spec |
| P016 | EXT-Session-021: Read-heavy = research | test-extractors-loaders-js | detects RESEARCH for read-heavy tool counts | heavy, read, research |
| P017 | EXT-Session-022: Write-heavy = implementation | test-extractors-loaders-js | prefers Implementation when edit/write tools are present despite research-heavy wording | heavy, implementation, write |
| P018 | EXT-Session-022: Write-heavy = implementation | test-extractors-loaders-js | detects IMPLEMENTATION for write-heavy tool counts | heavy, implementation, write |
| P019 | EXT-Session-030: Write-heavy = IMPLEMENTATION | test-extractors-loaders-js | prefers Implementation when edit/write tools are present despite research-heavy wording | heavy, implementation, write |
| P020 | EXT-Session-030: Write-heavy = IMPLEMENTATION | test-extractors-loaders-js | detects IMPLEMENTATION for write-heavy tool counts | heavy, implementation, write |
| P021 | EXT-Session-031: Decisions + read-heavy = PLANNING | test-extractors-loaders-js | detects PLANNING for decision observations with read-heavy counts | heavy, planning, read |
| P022 | EXT-Session-035: No blockers returns None | test-extractors-loaders-js | returns IN_PROGRESS for a short session with no blockers | blockers, returns, session |
| P023 | EXT-Decision-022: Manual decisions count correct | test-extractors-loaders-js | suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4) | decision, decisions, manual |
| P024 | EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists | test-extractors-loaders-js | suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4) | decision, manual, observation |
| P025 | EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH | test-extractors-loaders-js | uses the same canonical agent_file path in both auto and confirm YAMLs | canonical, file, path |
| P026 | EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH | test-extractors-loaders-js | uses the same canonical agent_file path in both auto and confirm YAMLs | canonical, file, path |
| P027 | EXT-Conv-017: Empty data returns MESSAGES array | test-extractors-loaders-js | returns empty array for all-filtered input | array, empty, returns |
| P028 | EXT-Conv-017: Empty data returns MESSAGES array | test-extractors-loaders-js | returns empty array for empty input | array, empty, returns |
| P029 | EXT-Conv-023: Non-contiguous phases remain separate segments | test-extractors-loaders-js | keeps non-contiguous phase returns as separate timeline segments | contiguous, segments, separate |
| P030 | EXT-Diag-008: Short session returns array | test-extractors-loaders-js | returns IN_PROGRESS for a short session with no blockers | returns, session, short |
| P031 | ERR-009: Empty string returns array | test-extractors-loaders-js | returns false for empty or non-string input | empty, returns, string |
| P032 | ERR-009: Empty string returns array | test-extractors-loaders-js | returns empty array for all-filtered input | array, empty, returns |
| P033 | ERR-009: Empty string returns array | test-extractors-loaders-js | returns empty array for empty input | array, empty, returns |
| P034 | ERR-009: Empty string returns array | test-extractors-loaders-js | T1-A: returns 0 for empty string | empty, returns, string |
| P035 | ERR-009: Empty string returns array | test-extractors-loaders-js | returns an empty string for empty input and zero or negative limits | empty, returns, string |
| P036 | phase-detection/below-threshold: phase_score | test-phase-validation-js | keeps an answer-gated row pending when its score is below threshold | below, score, threshold |
| P037 | phase-detection/below-threshold: suggested_phase_count | test-phase-validation-js | passes V10 when file count difference is below the relaxed threshold | below, count, threshold |
| P038 | recommend-level default-on: phase_score field present without --recommend-phases | test-phase-validation-js | accepts explicit phase, status, and completion fields without unknown-field warnings | field, phase, without |
| P039 | recommend-level default-on: suggested_phase_count field present without --recommend-phases | test-phase-validation-js | accepts explicit phase, status, and completion fields without unknown-field warnings | field, phase, without |
| P040 | phase-validation/flat-spec: validates the parent alone | test-phase-validation-js | archives a phase into its parent's own z_archive, restores it there and leaves both lists alone | alone, parent, phase |
| P041 | phase-validation/flat-spec: validates the parent alone | test-phase-validation-js | leaves a flat packet parent and its review flag alone after a rename inside its track | alone, flat, parent |
| P042 | phase-validation/flat-spec: validates the parent alone | test-phase-validation-js | renders the phase-parent spec from the manifest template | parent, phase, spec |
| P043 | phase-validation/flat-spec: validates the parent alone | test-phase-validation-js | merges the phase-parent addendum into spec contracts for phase parent folders | parent, phase, spec |
| P044 | phase-validation/empty-child: validates every phase child | test-phase-validation-js | returns flat for child-phase first run when rootDir is empty | child, empty, phase |
| P045 | phase-validation/empty-child: empty child produces validation errors | test-phase-validation-js | returns flat for child-phase first run when rootDir is empty | child, empty, phase |
| P046 | phase-validation/empty-child: validate.sh auto-enables recursive mode when phase children exist | test-phase-validation-js | returns flat for child-phase first run when rootDir is empty | child, empty, phase |
| P047 | path-safety: create.sh rejects outside --subfolder path | test-phase-validation-js | rejects a lexical escape and an absolute path outside the root | outside, path, rejects |
| P048 | path-safety: create.sh rejects symlink escape path | test-phase-validation-js | rejects a lexical escape and an absolute path outside the root | escape, path, rejects |
| P049 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | keeps the root archive for a packet at the specs root | archive, root, specs |
| P050 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses to restore from a z_archive outside the specs root | archive, outside, root, specs |
| P051 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | archives a plain absolute path under the physical specs root | path, root, specs |
| P052 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | archives a phase of a packet at the specs root into that packet's archive, without a note when it has no metadata | archive, root, specs |
| P053 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses a root packet whose z_archive links outside specs, and changes neither side | archive, outside, root, specs |
| P054 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses to archive a folder reached through a link that points outside specs, and changes neither side | archive, outside, specs |
| P055 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses a track packet whose track z_archive links outside specs, and leaves the track list alone | archive, outside, specs |
| P056 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses a phase whose parent z_archive links outside specs | archive, outside, specs |
| P057 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses a dangling z_archive under 'the specs root', moves nothing and creates no link target | archive, root, specs |
| P058 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses in a copy outside any repository whose derived root has no specs folder | outside, root, specs |
| P059 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | uses specs-root identity when the safety flag is enabled | root, safety, specs |
| P060 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | adversarial: 'a packet outside the named specs root…' | outside, root, specs |
| P061 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | continuity-placeholders-archive-status-from-specs-root | archive, root, specs |
| P062 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | continuity-placeholders-archive-placement: 'a document below no specs root falls …' | archive, root, specs |
| P063 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | default run --apply refuses a --folder that enters a repository through an alias to a non-root directory in the specs tree, from a cwd outside every repository | outside, root, specs |
| P064 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects a lexical escape and an absolute path outside the root | outside, path, rejects, root |
| P065 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects a symlinked parent inside the root that points outside it | outside, rejects, root |
| P066 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects a target that resolves outside a supported specs root | outside, rejects, root, specs |
| P067 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects unqualified traversal outside the canonical root | outside, rejects, root |
| P068 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects an existing root that resolves outside the workspace | outside, rejects, root |
| P069 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | rejects a repository-local root symlink that resolves outside the repository | outside, rejects, root |
| P070 | path-safety: archive.sh rejects paths outside specs root | test-phase-validation-js | refuses a default specs root that is a link to a directory outside the repository, with no --roots | outside, root, specs |
| P071 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | keeps the root archive for a packet at the specs root | archive, root, specs |
| P072 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses to restore from a z_archive outside the specs root | archive, outside, root, specs |
| P073 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | archives a plain absolute path under the physical specs root | path, root, specs |
| P074 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | archives a phase of a packet at the specs root into that packet's archive, without a note when it has no metadata | archive, root, specs |
| P075 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses a root packet whose z_archive links outside specs, and changes neither side | archive, outside, root, specs |
| P076 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses to archive a folder reached through a link that points outside specs, and changes neither side | archive, outside, specs |
| P077 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses a track packet whose track z_archive links outside specs, and leaves the track list alone | archive, outside, specs |
| P078 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses a phase whose parent z_archive links outside specs | archive, outside, specs |
| P079 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses a dangling z_archive under 'the specs root', moves nothing and creates no link target | archive, root, specs |
| P080 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses in a copy outside any repository whose derived root has no specs folder | outside, root, specs |
| P081 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | uses specs-root identity when the safety flag is enabled | root, safety, specs |
| P082 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | adversarial: 'a packet outside the named specs root…' | outside, root, specs |
| P083 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | continuity-placeholders-archive-status-from-specs-root | archive, root, specs |
| P084 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | continuity-placeholders-archive-placement: 'a document below no specs root falls …' | archive, root, specs |
| P085 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | default run --apply refuses a --folder that enters a repository through an alias to a non-root directory in the specs tree, from a cwd outside every repository | outside, root, specs |
| P086 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | reports null outside any checkout rather than guessing a root | outside, reports, root |
| P087 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | rejects a lexical escape and an absolute path outside the root | outside, path, root |
| P088 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | rejects a target that resolves outside a supported specs root | outside, root, specs |
| P089 | path-safety: archive.sh reports outside-specs-root rejection | test-phase-validation-js | refuses a default specs root that is a link to a directory outside the repository, with no --roots | outside, root, specs |
| P090 | path-safety: archive.sh rejects restore from non-archive path | test-phase-validation-js | refuses a restore path with a . segment that reaches a folder through a linked z_archive | archive, path, restore |
| P091 | path-safety: archive.sh reports restore containment error | test-phase-validation-js | refuses a restore path with a . segment that reaches a folder through a linked z_archive | archive, path, restore |
| P092 | recommend-level below-threshold-no-phase: phase_score | test-phase-system-js | keeps an answer-gated row pending when its score is below threshold | below, score, threshold |
| P093 | recommend-level below-threshold-no-phase: suggested_phase_count | test-phase-system-js | passes V10 when file count difference is below the relaxed threshold | below, count, threshold |
| P094 | create.sh parent mode: PHASE_MODE true | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P095 | create.sh parent mode: first append phase count | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P096 | create.sh parent mode: second append phase count | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P097 | create.sh parent mode: phase-map section not duplicated | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P098 | create.sh parent mode: appended phase row continues the phase-map table | test-phase-system-js | names nothing when a phase child is appended to an existing parent | appended, parent, phase |
| P099 | create.sh parent mode: appended phase row continues the phase-map table | test-phase-system-js | reports the skip for a phase appended to an existing parent | appended, parent, phase |
| P100 | create.sh parent mode: appended phase row continues the phase-map table | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P101 | create.sh parent mode: append updates handoff rows for new phase transition | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P102 | create.sh parent mode: append removes single-phase placeholder handoff row | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P103 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | names nothing when a phase child is appended to an existing parent | child, parent, phase |
| P104 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | resolves a bare phase parent to last_active_child_id when available | child, parent, phase |
| P105 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | rejects a bare phase parent when no last_active_child_id is available | child, parent, phase |
| P106 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | preserves an existing last_active_child_id during phase-parent rollup | child, parent, phase |
| P107 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | derives a declared sub-track parent and keeps a phase child parent | child, parent, phase |
| P108 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | bubbles child saves up to the direct phase parent | child, parent, phase |
| P109 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | updates the canonical parent from the resolved absolute child path | absolute, child, parent |
| P110 | create.sh parent mode: absolute phase numbering in child header | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P111 | create.sh parent mode: predecessor links to prior phase | test-phase-system-js | refuses a phase whose parent z_archive links outside specs | links, parent, phase |
| P112 | create.sh parent mode: predecessor links to prior phase | test-phase-system-js | emits parseable JSON for a phase parent when the mode comes from the environment | mode, parent, phase |
| P113 | Level detection: YAML frontmatter style | test-validation-system-cjs | uses the YAML frontmatter level when marker and metadata table are absent | frontmatter, level, yaml |
| P114 | Level inference: L3 from decision-record.md | test-validation-system-cjs | reads a bare decision record in a markerless packet as level 3 | decision, level, record |
| P115 | Empty folder: exit 2 (ERROR) | test-validation-system-cjs | maps a clean miss to exit 1 and a valid empty result, never an error | empty, error, exit |
| P116 | JSON has required fields | test-validation-system-cjs | T-PB2-10b: JSON report has all required top-level fields | fields, json, required |
| P117 | check-frontmatter-values.sh has run_check() | test-validation-system-cjs | check-frontmatter-values-helper.cjs exits 2 and names an unreadable input | check, frontmatter, values |
| P118 | check-source-tags.sh has run_check() | test-validation-system-cjs | check-source-tags-helper.mjs rejects a misspelled flag | check, source, tags |
| P119 | check-graph-metadata.sh has run_check() | test-validation-system-cjs | check-graph-metadata-child-drift.sh warns when the child scanner crashes | check, graph, metadata |
| P120 | check-graph-metadata-child-drift.sh has run_check() | test-validation-system-cjs | treats continuity newer than graph metadata as benign clock drift | drift, graph, metadata |
| P121 | check-graph-metadata-child-drift.sh has run_check() | test-validation-system-cjs | check-graph-metadata-child-drift.sh warns when the child scanner crashes | check, child, drift, graph, metadata |
| P122 | check-graph-metadata-child-identity.sh has run_check() | test-validation-system-cjs | check-graph-metadata-child-drift.sh warns when the child scanner crashes | check, child, graph, metadata |
| P123 | check-graph-metadata-shape.sh has run_check() | test-validation-system-cjs | check-graph-metadata-child-drift.sh warns when the child scanner crashes | check, graph, metadata |
| P124 | check-canonical-save-source-docs.sh has run_check() | test-validation-system-cjs | keeps primary docs aligned on canonical artifacts and the machine-readable capability source | canonical, docs, source |
| P125 | check-canonical-save-lineage.sh has run_check() | test-validation-system-cjs | persists same_pass lineage when the canonical-save path requests it | canonical, lineage, save |
| P126 | check-canonical-save-packet-identity.sh has run_check() | test-validation-system-cjs | prefers the canonical packet for an ambiguous unqualified identity | canonical, identity, packet |
| P127 | check-canonical-save-description-graph-freshness.sh has run_check() | test-validation-system-cjs | reports description/graph freshness skew as a soft detector | description, freshness, graph |
| P128 | check-canonical-save-description-graph-freshness.sh has run_check() | test-validation-system-cjs | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, graph, save |
| P129 | check-canonical-save-description-graph-freshness.sh has run_check() | test-validation-system-cjs | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, graph, save |
| P130 | Fixture exists: 006-missing-required-files | test-validation-system-cjs | T-PB2-09b: exit 2 for a failing spec (missing required files) | files, missing, required |
| P131 | [Positive Tests (should PASS or WARN)] Compliant Level 2 template fixture | test-validation-sh | passes a template-compliant Level 3 packet | compliant, level, template |
| P132 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | test-validation-sh | level-from-spec-refuses-missing-header | header, missing, spec |
| P133 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | test-validation-sh | exits 1 without writes when strict-required sections are missing | missing, required, sections |
| P134 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | test-validation-sh | should report missing required fields | missing, required, should |
| P135 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | test-validation-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | missing, required, spec |
| P136 | [Negative Tests (should FAIL)] Missing required files (no spec.md) | test-validation-sh | should report missing required fields | missing, required, should |
| P137 | [Negative Tests (should FAIL)] Missing required files (no spec.md) | test-validation-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | files, missing, required, spec |
| P138 | [Negative Tests (should FAIL)] Empty folder (all L1 files missing) | test-validation-sh | should return an empty corpus for a missing corpus file | empty, missing, should |
| P139 | [Negative Tests (should FAIL)] Empty folder (all L1 files missing) | test-validation-sh | keeps stdout empty in text mode, still prints help and still rejects a missing folder | empty, folder, missing |
| P140 | [Negative Tests (should FAIL)] Level 3 missing decision-record.md | test-validation-sh | reads a bare decision record in a markerless packet as level 3 | decision, level, record |
| P141 | [Negative Tests (should FAIL)] Missing required header fails | test-validation-sh | should report missing required fields | missing, required, should |
| P142 | [Negative Tests (should FAIL)] Missing required anchor fails | test-validation-sh | fails when an example loses a required anchor | anchor, fails, required |
| P143 | [Negative Tests (should FAIL)] Missing required anchor fails | test-validation-sh | should report missing required fields | missing, required, should |
| P144 | [Negative Tests (should FAIL)] Reordered required anchor fails | test-validation-sh | fails when an example loses a required anchor | anchor, fails, required |
| P145 | [Anchor Edge Cases] Missing required anchor fails | test-validation-sh | fails when an example loses a required anchor | anchor, fails, required |
| P146 | [Anchor Edge Cases] Reordered required anchor fails | test-validation-sh | fails when an example loses a required anchor | anchor, fails, required |
| P147 | [CLI Options Tests] --json produces valid JSON with required fields | test-validation-sh | T-PB2-10b: JSON report has all required top-level fields | fields, json, required |
| P148 | [Exact Exit Code Tests] Exact exit 0: compliant fixture | test-validation-sh | T-PB2-01a: exit code matches validate.sh for a passing fixture | code, exit, fixture |
| P149 | [Exact Exit Code Tests] Exact exit 0: compliant fixture | test-validation-sh | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | code, exit, fixture |
| P150 | [Exact Exit Code Tests] Exact exit 1: unknown option | test-validation-sh | rejects an unknown option with the misuse exit code | code, exit, option, unknown |
| P151 | [Exact Exit Code Tests] Exact exit 3: missing folder | test-validation-sh | keeps its usage exit code for a missing folder | code, exit, folder, missing |
| P152 | [Exact Exit Code Tests] Exact exit 3: missing folder | test-validation-sh | returns exit code 2 when the census root is missing | code, exit, missing |
| P153 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing spec.md | test-validation-extended-sh | creates only the missing file when one metadata artifact already exists | exists, file, missing |
| P154 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing spec.md | test-validation-extended-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | files, missing, spec |
| P155 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing plan.md | test-validation-extended-sh | creates only the missing file when one metadata artifact already exists | exists, file, missing |
| P156 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing tasks.md | test-validation-extended-sh | creates only the missing file when one metadata artifact already exists | exists, file, missing |
| P157 | [Individual Rule: FILE_EXISTS (check-files.sh)] L3: Missing decision-record.md | test-validation-extended-sh | creates only the missing file when one metadata artifact already exists | exists, file, missing |
| P158 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | test-validation-extended-sh | creates only the missing file when one metadata artifact already exists | exists, file, missing |
| P159 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | test-validation-extended-sh | records the z_future folder skipped on the writer rule, both files excluded | files, folder, rule |
| P160 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | test-validation-extended-sh | should return an empty corpus for a missing corpus file | empty, file, missing |
| P161 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | test-validation-extended-sh | is-phase-parent.js exits 2 when the check command is missing its folder | check, folder, missing |
| P162 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | test-validation-extended-sh | keeps stdout empty in text mode, still prints help and still rejects a missing folder | empty, folder, missing |
| P163 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | test-validation-extended-sh | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | folder, spec, valid |
| P164 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | test-validation-extended-sh | --roots run refuses a plain --folder outside the given roots without blaming a link | folder, outside, roots |
| P165 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | test-validation-extended-sh | --roots run ignores a system symlink above a plain outside folder in the refusal | folder, outside, roots |
| P166 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | test-validation-extended-sh | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | folder, spec, valid |
| P167 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | test-validation-extended-sh | --roots run refuses a plain --folder outside the given roots without blaming a link | folder, outside, roots |
| P168 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | test-validation-extended-sh | --roots run ignores a system symlink above a plain outside folder in the refusal | folder, outside, roots |
| P169 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | test-validation-extended-sh | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | folder, spec, valid |
| P170 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | test-validation-extended-sh | --roots run refuses a plain --folder outside the given roots without blaming a link | folder, outside, roots |
| P171 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | test-validation-extended-sh | --roots run ignores a system symlink above a plain outside folder in the refusal | folder, outside, roots |
| P172 | [Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] Template provenance token in a title detected | test-validation-extended-sh | reads the spec.md title of a v2.3 packet for a template token, and leaves an older packet as it was | template, title, token |
| P173 | [Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Scaffold marker with Complete status detected | test-validation-extended-sh | uses the shared status classifier for scaffold marker enforcement | marker, scaffold, status |
| P174 | [Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Genuinely complete docs pass | test-validation-extended-sh | v2.3 Complete: a fence never closed gives pass in both | complete, never, pass |
| P175 | [Shared Status Classifier] Not Started classifies as planned | test-validation-extended-sh | uses the shared status classifier for scaffold marker enforcement | classifier, shared, status |
| P176 | [Metadata Parse Errors] Malformed generated metadata emits a warning | test-validation-extended-sh | emits v1.1 metadata on all generated state lines | emits, generated, metadata |
| P177 | [Orchestrator: Valid Fixtures (Exit 0 or 1)] 053-template-compliant-level2 passes cleanly | test-validation-extended-sh | passes a template-compliant packet | compliant, passes, template |
| P178 | [Orchestrator: Valid Fixtures (Exit 0 or 1)] 053-template-compliant-level2 passes cleanly | test-validation-extended-sh | passes a template-compliant Level 3 packet | compliant, passes, template |
| P179 | [Orchestrator: Error Fixtures (Exit 2)] 001-empty-folder fails | test-validation-extended-sh | fails when a level folder is empty | empty, fails, folder |
| P180 | [Orchestrator: Error Fixtures (Exit 2)] 001-empty-folder fails | test-validation-extended-sh | maps a clean miss to exit 1 and a valid empty result, never an error | empty, error, exit |
| P181 | [Orchestrator: Error Fixtures (Exit 2)] 006-missing-required-files fails | test-validation-extended-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | exit, files, missing, required |
| P182 | [Orchestrator: Error Fixtures (Exit 2)] 006-missing-required-files fails | test-validation-extended-sh | validate-command-tree-parity.sh keeps exit 64 when a required side is missing | exit, missing, required |
| P183 | [Orchestrator: Error Fixtures (Exit 2)] 072 scaffold marker fails through default registry bridge | test-validation-extended-sh | traces validate.sh through the orchestrator, every registry rule and their helpers | orchestrator, registry, through |
| P184 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | test-validation-extended-sh | T-PB2-01a: exit code matches validate.sh for a passing fixture | code, exit, fixture |
| P185 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | test-validation-extended-sh | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | code, exit, fixture |
| P186 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | test-validation-extended-sh | returns exit code 2 when the census root is missing | code, exit, returns |
| P187 | [Exit Code Verification] Exit 0: Warning fixture returns warn | test-validation-extended-sh | T-PB2-01a: exit code matches validate.sh for a passing fixture | code, exit, fixture |
| P188 | [Exit Code Verification] Exit 0: Warning fixture returns warn | test-validation-extended-sh | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | code, exit, fixture |
| P189 | [Exit Code Verification] Exit 0: Warning fixture returns warn | test-validation-extended-sh | returns exit code 2 when the census root is missing | code, exit, returns |
| P190 | [Exit Code Verification] Exit 2: Missing files return fail | test-validation-extended-sh | keeps its usage exit code for a missing folder | code, exit, missing |
| P191 | [Exit Code Verification] Exit 2: Missing files return fail | test-validation-extended-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | exit, files, missing |
| P192 | [Exit Code Verification] Exit 2: Missing files return fail | test-validation-extended-sh | returns exit code 2 when the census root is missing | code, exit, missing |
| P193 | [Exit Code Verification] Exit 2: Missing required header returns fail | test-validation-extended-sh | keeps its usage exit code for a missing folder | code, exit, missing |
| P194 | [Exit Code Verification] Exit 2: Missing required header returns fail | test-validation-extended-sh | T-PB2-09b: exit 2 for a failing spec (missing required files) | exit, missing, required |
| P195 | [Exit Code Verification] Exit 2: Missing required header returns fail | test-validation-extended-sh | returns exit code 2 when the census root is missing | code, exit, missing, returns |
| P196 | [Exit Code Verification] Exit 2: Missing required header returns fail | test-validation-extended-sh | validate-command-tree-parity.sh keeps exit 64 when a required side is missing | exit, missing, required |
| P197 | [Exit Code Verification] Exact exit 0: compliant fixture | test-validation-extended-sh | T-PB2-01a: exit code matches validate.sh for a passing fixture | code, exit, fixture |
| P198 | [Exit Code Verification] Exact exit 0: compliant fixture | test-validation-extended-sh | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | code, exit, fixture |
| P199 | [Exit Code Verification] Exact exit 1: unknown option | test-validation-extended-sh | rejects an unknown option with the misuse exit code | code, exit, option, unknown |
| P200 | [Exit Code Verification] Exact exit 3: missing folder | test-validation-extended-sh | keeps its usage exit code for a missing folder | code, exit, folder, missing |
| P201 | [Exit Code Verification] Exact exit 3: missing folder | test-validation-extended-sh | returns exit code 2 when the census root is missing | code, exit, missing |
| P202 | [JSON Output Mode] --json compact compliant fixture produces valid JSON | test-validation-extended-sh | T-PB2-10a: --json output is valid JSON | json, output, valid |
| P203 | [JSON Output Mode] --json warning fixture produces valid JSON | test-validation-extended-sh | T-PB2-10a: --json output is valid JSON | json, output, valid |
| P204 | [JSON Output Mode] --json error fixture produces valid JSON | test-validation-extended-sh | T-PB2-10a: --json output is valid JSON | json, output, valid |
| P205 | [Edge Cases: Anchor Scenarios] Missing required anchor fails | test-validation-extended-sh | fails when an example loses a required anchor | anchor, fails, required |
| P206 | [Edge Cases: Anchor Scenarios] Reordered required anchor fails | test-validation-extended-sh | fails when an example loses a required anchor | anchor, fails, required |
| P207 | [Edge Cases: Level Detection] Explicit level on compliant fixture passes cleanly | test-validation-extended-sh | passes a template-compliant Level 3 packet | compliant, level, passes |
| P208 | after cutoff, missing document blocks | check-ac-closure-sh | grandfathers missing save_lineage before the cutoff and fails after it | after, cutoff, missing |
| P209 | before cutoff, missing document advisory | check-ac-closure-sh | grandfathers missing save_lineage before the cutoff and fails after it | before, cutoff, missing |
| P210 | malformed cutoff falls back, not grandfather-all | check-ac-closure-sh | falls back to the default cutoff on a malformed override | back, cutoff, falls, malformed |
| P211 | malformed cutoff falls back, not grandfather-all | check-ac-closure-sh | falls back to the default cutoff on a date-shaped day that does not exist | back, cutoff, falls |
| P212 | file:line in the Verification cell is evidence | check-ac-coverage-sh | deduplicates repeated bullets and prefers file-line anchored evidence | evidence, file, line |
| P213 | the merged tasks document is the traceability source | check-ac-coverage-sh | carries verification in the merged tasks document and nowhere else | document, merged, tasks |
| P214 | a malformed cutoff falls back to the default | check-ac-coverage-sh | falls back to the default cutoff on a malformed override | back, cutoff, default, falls, malformed |
| P215 | a malformed cutoff falls back to the default | check-ac-coverage-sh | falls back to the default cutoff on a date-shaped day that does not exist | back, cutoff, default, falls |
| P216 | the root is tried after the packet folder | check-ac-coverage-sh | numbers after the highest folder already in the root | after, folder, root |
| P217 | the root is tried after the packet folder | check-ac-coverage-sh | leaves the track root alone for a folder nested inside a packet | folder, packet, root |
| P218 | an empty list reports nothing | check-ac-coverage-sh | reports no-phrases when spec.md declares an empty trigger_phrases list | empty, list, reports |
| P219 | a path from the repository root resolves | check-ac-coverage-sh | resolves a repository-relative declaration from a packet at the specs root | repository, resolves, root |
| P220 | a path from the repository root resolves | check-ac-coverage-sh | resolves to the repository root, not the .skilled directory | repository, resolves, root |
| P221 | a path from the repository root resolves | check-ac-coverage-sh | rejects a repository-local root symlink that resolves outside the repository | repository, resolves, root |
| P222 | a path from the repository root resolves | check-ac-coverage-sh | readme recovery resolves paths from the exported repository root | repository, resolves, root |
| P223 | a path from the repository root resolves | check-ac-coverage-sh | resolves a nested start in a .skilled-only checkout to the repository root | repository, resolves, root |
| P224 | Default phase run created 3 child folders | test-phase-system-sh | merges the phase-child addendum into spec contracts for child phase folders | child, folders, phase |
| P225 | New phase parent's map lists all 3 phases and keeps no row marker | test-phase-system-sh | archives a phase into its parent's own z_archive, restores it there and leaves both lists alone | lists, parent, phase |
| P226 | New phase parent's map lists all 3 phases and keeps no row marker | test-phase-system-sh | derives a declared sub-track parent and keeps a phase child parent | keeps, parent, phase |
| P227 | New phase parent's map lists all 3 phases and keeps no row marker | test-phase-system-sh | keeps phase-parent contract lean | keeps, parent, phase |
| P228 | Appended phase child headers link predecessor and successor correctly | test-phase-system-sh | names nothing when a phase child is appended to an existing parent | appended, child, phase |
| P229 | Appended phase rows continue the parent's phase-map table | test-phase-system-sh | names nothing when a phase child is appended to an existing parent | appended, parent, phase |
| P230 | Appended phase rows continue the parent's phase-map table | test-phase-system-sh | reports the skip for a phase appended to an existing parent | appended, parent, phase |
| P231 | Append mode still generates description.json for the newly created child phase | test-phase-system-sh | stops a phase parent that cannot get its description.json | description, json, phase |
| P232 | Append mode still generates description.json for the newly created child phase | test-phase-system-sh | emits parseable JSON for a phase parent when the mode comes from the environment | json, mode, phase |
| P233 | Append mode still generates description.json for the newly created child phase | test-phase-system-sh | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, json, mode |
| P234 | Append mode still generates description.json for the newly created child phase | test-phase-system-sh | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, json, mode |
| P235 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | names nothing when a phase child is appended to an existing parent | child, parent, phase |
| P236 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | resolves a bare phase parent to last_active_child_id when available | child, parent, phase |
| P237 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | rejects a bare phase parent when no last_active_child_id is available | child, parent, phase |
| P238 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | preserves an existing last_active_child_id during phase-parent rollup | child, parent, phase |
| P239 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | derives a declared sub-track parent and keeps a phase child parent | child, parent, phase |
| P240 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | bubbles child saves up to the direct phase parent | child, parent, phase |
| P241 | A new parent's first child is labeled Phase 1 | test-phase-system-sh | returns flat for child-phase first run when rootDir is empty | child, first, phase |
| P242 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | test-phase-system-sh | creates description.json and graph-metadata.json when both are missing | description, graph, metadata |
| P243 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | test-phase-system-sh | leaves a packet without graph-metadata children unchanged | children, graph, metadata |
| P244 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | test-phase-system-sh | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, graph, metadata |
| P245 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | test-phase-system-sh | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | description, graph, metadata |

## 6. Substantive review

One row per candidate pair. Each row was read in both source files and marked `same` or `different`; the reference on each side is the line that was read. `same` means the two tests assert the same behaviour, not merely a similar title.

Unreviewed candidate pairs: 0

| Verdict | Pair | Legacy name | Legacy source | CLI test name | CLI source |
|---|---|---|---|---|---|
| different | P001 | T-001g: getSpecsDirectories() returns non-empty array | tests/test-scripts-modules.js:146 | returns empty array for all-filtered input | tests/trigger-phrase-filter.vitest.ts:129 |
| different | P002 | T-001g: getSpecsDirectories() returns non-empty array | tests/test-scripts-modules.js:146 | returns empty array for empty input | tests/trigger-phrase-filter.vitest.ts:134 |
| different | P003 | T-003e: sanitizePath rejects path outside allowed directories | tests/test-scripts-modules.js:226 | rejects a lexical escape and an absolute path outside the root | tests/path-containment.vitest.ts:41 |
| different | P004 | T-004a: normalizeInputData passes MCP data through | tests/test-scripts-modules.js:286 | passes JSON-mode data and explicit CLI spec-folder override through main() | tests/generate-context-cli-authority.vitest.ts:114 |
| different | P005 | T-026a: hasImplementationWork returns false for empty data | tests/test-scripts-modules.js:1452 | returns false for empty or non-string input | tests/tool-sanitizer.vitest.ts:157 |
| different | P006 | T-026c: extractMainTopic extracts from spec folder | tests/test-scripts-modules.js:1466 | extracts task progress and decisions from spec-folder docs without crashing on sparse inputs | tests/session-enrichment.vitest.ts:250 |
| different | P007 | T-034k: cleanDescription truncates long descriptions | tests/test-scripts-modules.js:2055 | truncates long descriptions | tests/tool-sanitizer.vitest.ts:171 |
| same | P008 | T-008i: phase-classifier preserves non-contiguous phase returns | tests/test-scripts-modules.js:622 | keeps non-contiguous phase returns as separate timeline segments | tests/phase-classification.vitest.ts:48 |
| same | P009 | T-008j: phase-classifier derives Iterative Loop flow pattern | tests/test-scripts-modules.js:628 | derives each supported flow pattern | tests/phase-classification.vitest.ts:102 |
| different | P010 | T-036k: format_follow_up_box returns empty for empty array | tests/test-scripts-modules.js:2170 | returns empty array for all-filtered input | tests/trigger-phrase-filter.vitest.ts:129 |
| different | P011 | T-036k: format_follow_up_box returns empty for empty array | tests/test-scripts-modules.js:2170 | returns empty array for empty input | tests/trigger-phrase-filter.vitest.ts:134 |
| different | P012 | T-042e: SPEC_FOLDER_PATTERN matches valid folder names | tests/test-scripts-modules.js:2535 | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | tests/gate-3-classifier.vitest.ts:479 |
| different | P013 | T-042e: SPEC_FOLDER_PATTERN matches valid folder names | tests/test-scripts-modules.js:2535 | matches a spec folder exactly or as a prefix, like the SQL scope filter | tests/trigger-index.vitest.ts:926 |
| different | P014 | T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names | tests/test-scripts-modules.js:2548 | rejects metadata-missing and deprecated spec-folder bindings | tests/gate-3-classifier.vitest.ts:618 |
| different | P015 | T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names | tests/test-scripts-modules.js:2548 | exits non-zero when stdin/json mode resolves an invalid explicit target spec folder | tests/generate-context-cli-authority.vitest.ts:380 |
| different | P016 | EXT-Session-021: Read-heavy = research | tests/test-extractors-loaders.js:475 | detects RESEARCH for read-heavy tool counts | tests/project-phase-e2e.vitest.ts:139 |
| different | P017 | EXT-Session-022: Write-heavy = implementation | tests/test-extractors-loaders.js:476 | prefers Implementation when edit/write tools are present despite research-heavy wording | tests/phase-classification.vitest.ts:39 |
| different | P018 | EXT-Session-022: Write-heavy = implementation | tests/test-extractors-loaders.js:476 | detects IMPLEMENTATION for write-heavy tool counts | tests/project-phase-e2e.vitest.ts:148 |
| different | P019 | EXT-Session-030: Write-heavy = IMPLEMENTATION | tests/test-extractors-loaders.js:490 | prefers Implementation when edit/write tools are present despite research-heavy wording | tests/phase-classification.vitest.ts:39 |
| same | P020 | EXT-Session-030: Write-heavy = IMPLEMENTATION | tests/test-extractors-loaders.js:490 | detects IMPLEMENTATION for write-heavy tool counts | tests/project-phase-e2e.vitest.ts:148 |
| same | P021 | EXT-Session-031: Decisions + read-heavy = PLANNING | tests/test-extractors-loaders.js:492 | detects PLANNING for decision observations with read-heavy counts | tests/project-phase-e2e.vitest.ts:157 |
| different | P022 | EXT-Session-035: No blockers returns None | tests/test-extractors-loaders.js:519 | returns IN_PROGRESS for a short session with no blockers | tests/collect-session-data.vitest.ts:82 |
| different | P023 | EXT-Decision-022: Manual decisions count correct | tests/test-extractors-loaders.js:668 | suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4) | tests/auto-detection-fixes.vitest.ts:270 |
| same | P024 | EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists | tests/test-extractors-loaders.js:761 | suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4) | tests/auto-detection-fixes.vitest.ts:270 |
| different | P025 | EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH | tests/test-extractors-loaders.js:830 | uses the same canonical agent_file path in both auto and confirm YAMLs | tests/deep-research-contract-parity.vitest.ts:117 |
| different | P026 | EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH | tests/test-extractors-loaders.js:830 | uses the same canonical agent_file path in both auto and confirm YAMLs | tests/deep-review-contract-parity.vitest.ts:162 |
| different | P027 | EXT-Conv-017: Empty data returns MESSAGES array | tests/test-extractors-loaders.js:961 | returns empty array for all-filtered input | tests/trigger-phrase-filter.vitest.ts:129 |
| different | P028 | EXT-Conv-017: Empty data returns MESSAGES array | tests/test-extractors-loaders.js:961 | returns empty array for empty input | tests/trigger-phrase-filter.vitest.ts:134 |
| same | P029 | EXT-Conv-023: Non-contiguous phases remain separate segments | tests/test-extractors-loaders.js:1017 | keeps non-contiguous phase returns as separate timeline segments | tests/phase-classification.vitest.ts:48 |
| different | P030 | EXT-Diag-008: Short session returns array | tests/test-extractors-loaders.js:1177 | returns IN_PROGRESS for a short session with no blockers | tests/collect-session-data.vitest.ts:82 |
| different | P031 | ERR-009: Empty string returns array | tests/test-extractors-loaders.js:1457 | returns false for empty or non-string input | tests/tool-sanitizer.vitest.ts:157 |
| different | P032 | ERR-009: Empty string returns array | tests/test-extractors-loaders.js:1457 | returns empty array for all-filtered input | tests/trigger-phrase-filter.vitest.ts:129 |
| different | P033 | ERR-009: Empty string returns array | tests/test-extractors-loaders.js:1457 | returns empty array for empty input | tests/trigger-phrase-filter.vitest.ts:134 |
| different | P034 | ERR-009: Empty string returns array | tests/test-extractors-loaders.js:1457 | T1-A: returns 0 for empty string | tests/tree-thinning.vitest.ts:35 |
| different | P035 | ERR-009: Empty string returns array | tests/test-extractors-loaders.js:1457 | returns an empty string for empty input and zero or negative limits | tests/truncate-on-word-boundary.vitest.ts:134 |
| different | P036 | phase-detection/below-threshold: phase_score | tests/test-phase-validation.js:195 | keeps an answer-gated row pending when its score is below threshold | tests/decision-table-matcher.vitest.ts:144 |
| different | P037 | phase-detection/below-threshold: suggested_phase_count | tests/test-phase-validation.js:195 | passes V10 when file count difference is below the relaxed threshold | tests/task-enrichment.vitest.ts:727 |
| different | P038 | recommend-level default-on: phase_score field present without --recommend-phases | tests/test-phase-validation.js:231 | accepts explicit phase, status, and completion fields without unknown-field warnings | tests/phase-status-from-payload.vitest.ts:11 |
| different | P039 | recommend-level default-on: suggested_phase_count field present without --recommend-phases | tests/test-phase-validation.js:235 | accepts explicit phase, status, and completion fields without unknown-field warnings | tests/phase-status-from-payload.vitest.ts:11 |
| different | P040 | phase-validation/flat-spec: validates the parent alone | tests/test-phase-validation.js:350 | archives a phase into its parent's own z_archive, restores it there and leaves both lists alone | tests/archive-track.vitest.ts:331 |
| different | P041 | phase-validation/flat-spec: validates the parent alone | tests/test-phase-validation.js:350 | leaves a flat packet parent and its review flag alone after a rename inside its track | tests/repair-derived.vitest.ts:489 |
| different | P042 | phase-validation/flat-spec: validates the parent alone | tests/test-phase-validation.js:350 | renders the phase-parent spec from the manifest template | tests/scaffold-golden-snapshots.vitest.ts:99 |
| different | P043 | phase-validation/flat-spec: validates the parent alone | tests/test-phase-validation.js:350 | merges the phase-parent addendum into spec contracts for phase parent folders | tests/template-structure.vitest.ts:155 |
| different | P044 | phase-validation/empty-child: validates every phase child | tests/test-phase-validation.js:354 | returns flat for child-phase first run when rootDir is empty | tests/review-research-paths.vitest.ts:160 |
| different | P045 | phase-validation/empty-child: empty child produces validation errors | tests/test-phase-validation.js:354 | returns flat for child-phase first run when rootDir is empty | tests/review-research-paths.vitest.ts:160 |
| different | P046 | phase-validation/empty-child: validate.sh auto-enables recursive mode when phase children exist | tests/test-phase-validation.js:354 | returns flat for child-phase first run when rootDir is empty | tests/review-research-paths.vitest.ts:160 |
| different | P047 | path-safety: create.sh rejects outside --subfolder path | tests/test-phase-validation.js:410 | rejects a lexical escape and an absolute path outside the root | tests/path-containment.vitest.ts:41 |
| different | P048 | path-safety: create.sh rejects symlink escape path | tests/test-phase-validation.js:434 | rejects a lexical escape and an absolute path outside the root | tests/path-containment.vitest.ts:41 |
| different | P049 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | keeps the root archive for a packet at the specs root | tests/archive-track.vitest.ts:116 |
| different | P050 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses to restore from a z_archive outside the specs root | tests/archive-track.vitest.ts:165 |
| different | P051 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | archives a plain absolute path under the physical specs root | tests/archive-track.vitest.ts:310 |
| different | P052 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | archives a phase of a packet at the specs root into that packet's archive, without a note when it has no metadata | tests/archive-track.vitest.ts:353 |
| different | P053 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses a root packet whose z_archive links outside specs, and changes neither side | tests/archive-track.vitest.ts:658 |
| different | P054 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses to archive a folder reached through a link that points outside specs, and changes neither side | tests/archive-track.vitest.ts:679 |
| different | P055 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses a track packet whose track z_archive links outside specs, and leaves the track list alone | tests/archive-track.vitest.ts:741 |
| different | P056 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses a phase whose parent z_archive links outside specs | tests/archive-track.vitest.ts:760 |
| different | P057 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses a dangling z_archive under 'the specs root', moves nothing and creates no link target | tests/archive-track.vitest.ts:928 |
| different | P058 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses in a copy outside any repository whose derived root has no specs folder | tests/archive-track.vitest.ts:1031 |
| different | P059 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | uses specs-root identity when the safety flag is enabled | tests/generate-description-identity-safety.vitest.ts:57 |
| different | P060 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | adversarial: 'a packet outside the named specs root…' | tests/heal-anchor-repair.vitest.ts:111 |
| different | P061 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | continuity-placeholders-archive-status-from-specs-root | tests/heal-lane-modes.vitest.ts:1122 |
| different | P062 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | continuity-placeholders-archive-placement: 'a document below no specs root falls …' | tests/heal-lane-modes.vitest.ts:1199 |
| different | P063 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | default run --apply refuses a --folder that enters a repository through an alias to a non-root directory in the specs tree, from a cwd outside every repository | tests/heal-symlink-containment.vitest.ts:817 |
| different | P064 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects a lexical escape and an absolute path outside the root | tests/path-containment.vitest.ts:41 |
| different | P065 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects a symlinked parent inside the root that points outside it | tests/path-containment.vitest.ts:48 |
| different | P066 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects a target that resolves outside a supported specs root | tests/scoped-backfill-boundary.vitest.ts:111 |
| different | P067 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects unqualified traversal outside the canonical root | tests/spec-root-canonical-resolver.vitest.ts:77 |
| different | P068 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects an existing root that resolves outside the workspace | tests/spec-root-migration-manifest.vitest.ts:158 |
| different | P069 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | rejects a repository-local root symlink that resolves outside the repository | tests/strict-pass-freshness.vitest.ts:93 |
| different | P070 | path-safety: archive.sh rejects paths outside specs root | tests/test-phase-validation.js:448 | refuses a default specs root that is a link to a directory outside the repository, with no --roots | tests/upgrade-legacy-containment.vitest.ts:276 |
| different | P071 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | keeps the root archive for a packet at the specs root | tests/archive-track.vitest.ts:116 |
| different | P072 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses to restore from a z_archive outside the specs root | tests/archive-track.vitest.ts:165 |
| different | P073 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | archives a plain absolute path under the physical specs root | tests/archive-track.vitest.ts:310 |
| different | P074 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | archives a phase of a packet at the specs root into that packet's archive, without a note when it has no metadata | tests/archive-track.vitest.ts:353 |
| different | P075 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses a root packet whose z_archive links outside specs, and changes neither side | tests/archive-track.vitest.ts:658 |
| different | P076 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses to archive a folder reached through a link that points outside specs, and changes neither side | tests/archive-track.vitest.ts:679 |
| different | P077 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses a track packet whose track z_archive links outside specs, and leaves the track list alone | tests/archive-track.vitest.ts:741 |
| different | P078 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses a phase whose parent z_archive links outside specs | tests/archive-track.vitest.ts:760 |
| different | P079 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses a dangling z_archive under 'the specs root', moves nothing and creates no link target | tests/archive-track.vitest.ts:928 |
| different | P080 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses in a copy outside any repository whose derived root has no specs folder | tests/archive-track.vitest.ts:1031 |
| different | P081 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | uses specs-root identity when the safety flag is enabled | tests/generate-description-identity-safety.vitest.ts:57 |
| different | P082 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | adversarial: 'a packet outside the named specs root…' | tests/heal-anchor-repair.vitest.ts:111 |
| different | P083 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | continuity-placeholders-archive-status-from-specs-root | tests/heal-lane-modes.vitest.ts:1122 |
| different | P084 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | continuity-placeholders-archive-placement: 'a document below no specs root falls …' | tests/heal-lane-modes.vitest.ts:1199 |
| different | P085 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | default run --apply refuses a --folder that enters a repository through an alias to a non-root directory in the specs tree, from a cwd outside every repository | tests/heal-symlink-containment.vitest.ts:817 |
| different | P086 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | reports null outside any checkout rather than guessing a root | tests/host-trigger-index.vitest.ts:189 |
| different | P087 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | rejects a lexical escape and an absolute path outside the root | tests/path-containment.vitest.ts:41 |
| different | P088 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | rejects a target that resolves outside a supported specs root | tests/scoped-backfill-boundary.vitest.ts:111 |
| different | P089 | path-safety: archive.sh reports outside-specs-root rejection | tests/test-phase-validation.js:451 | refuses a default specs root that is a link to a directory outside the repository, with no --roots | tests/upgrade-legacy-containment.vitest.ts:276 |
| different | P090 | path-safety: archive.sh rejects restore from non-archive path | tests/test-phase-validation.js:461 | refuses a restore path with a . segment that reaches a folder through a linked z_archive | tests/archive-track.vitest.ts:850 |
| different | P091 | path-safety: archive.sh reports restore containment error | tests/test-phase-validation.js:464 | refuses a restore path with a . segment that reaches a folder through a linked z_archive | tests/archive-track.vitest.ts:850 |
| different | P092 | recommend-level below-threshold-no-phase: phase_score | tests/test-phase-system.js:100 | keeps an answer-gated row pending when its score is below threshold | tests/decision-table-matcher.vitest.ts:144 |
| different | P093 | recommend-level below-threshold-no-phase: suggested_phase_count | tests/test-phase-system.js:100 | passes V10 when file count difference is below the relaxed threshold | tests/task-enrichment.vitest.ts:727 |
| different | P094 | create.sh parent mode: PHASE_MODE true | tests/test-phase-system.js:178 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P095 | create.sh parent mode: first append phase count | tests/test-phase-system.js:179 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P096 | create.sh parent mode: second append phase count | tests/test-phase-system.js:194 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P097 | create.sh parent mode: phase-map section not duplicated | tests/test-phase-system.js:199 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P098 | create.sh parent mode: appended phase row continues the phase-map table | tests/test-phase-system.js:206 | names nothing when a phase child is appended to an existing parent | tests/create-track-refresh.vitest.ts:360 |
| different | P099 | create.sh parent mode: appended phase row continues the phase-map table | tests/test-phase-system.js:206 | reports the skip for a phase appended to an existing parent | tests/create-without-build.vitest.ts:89 |
| different | P100 | create.sh parent mode: appended phase row continues the phase-map table | tests/test-phase-system.js:206 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P101 | create.sh parent mode: append updates handoff rows for new phase transition | tests/test-phase-system.js:210 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P102 | create.sh parent mode: append removes single-phase placeholder handoff row | tests/test-phase-system.js:214 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P103 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | names nothing when a phase child is appended to an existing parent | tests/create-track-refresh.vitest.ts:360 |
| different | P104 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | resolves a bare phase parent to last_active_child_id when available | tests/gate-3-classifier.vitest.ts:633 |
| different | P105 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | rejects a bare phase parent when no last_active_child_id is available | tests/gate-3-classifier.vitest.ts:652 |
| different | P106 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | preserves an existing last_active_child_id during phase-parent rollup | tests/graph-metadata-backfill.vitest.ts:237 |
| different | P107 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | derives a declared sub-track parent and keeps a phase child parent | tests/graph-metadata-refresh.vitest.ts:104 |
| different | P108 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | bubbles child saves up to the direct phase parent | tests/phase-parent-pointer.vitest.ts:96 |
| different | P109 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | updates the canonical parent from the resolved absolute child path | tests/spec-root-phase-pointer.vitest.ts:77 |
| different | P110 | create.sh parent mode: absolute phase numbering in child header | tests/test-phase-system.js:218 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P111 | create.sh parent mode: predecessor links to prior phase | tests/test-phase-system.js:219 | refuses a phase whose parent z_archive links outside specs | tests/archive-track.vitest.ts:760 |
| different | P112 | create.sh parent mode: predecessor links to prior phase | tests/test-phase-system.js:219 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P113 | Level detection: YAML frontmatter style | tests/test-validation-system.cjs:306 | uses the YAML frontmatter level when marker and metadata table are absent | tests/repo-era.vitest.ts:379 |
| different | P114 | Level inference: L3 from decision-record.md | tests/test-validation-system.cjs:339 | reads a bare decision record in a markerless packet as level 3 | tests/decision-record-writer.vitest.ts:194 |
| different | P115 | Empty folder: exit 2 (ERROR) | tests/test-validation-system.cjs:938 | maps a clean miss to exit 1 and a valid empty result, never an error | tests/rg-wrapper-recipes.vitest.ts:164 |
| different | P116 | JSON has required fields | tests/test-validation-system.cjs:1044 | T-PB2-10b: JSON report has all required top-level fields | tests/progressive-validation.vitest.ts:985 |
| different | P117 | check-frontmatter-values.sh has run_check() | tests/test-validation-system.cjs:1208 | check-frontmatter-values-helper.cjs exits 2 and names an unreadable input | tests/typo-flags.vitest.ts:219 |
| different | P118 | check-source-tags.sh has run_check() | tests/test-validation-system.cjs:1208 | check-source-tags-helper.mjs rejects a misspelled flag | tests/typo-flags.vitest.ts:229 |
| different | P119 | check-graph-metadata.sh has run_check() | tests/test-validation-system.cjs:1208 | check-graph-metadata-child-drift.sh warns when the child scanner crashes | tests/typo-flags.vitest.ts:254 |
| different | P120 | check-graph-metadata-child-drift.sh has run_check() | tests/test-validation-system.cjs:1208 | treats continuity newer than graph metadata as benign clock drift | tests/continuity-freshness.vitest.ts:200 |
| different | P121 | check-graph-metadata-child-drift.sh has run_check() | tests/test-validation-system.cjs:1208 | check-graph-metadata-child-drift.sh warns when the child scanner crashes | tests/typo-flags.vitest.ts:254 |
| different | P122 | check-graph-metadata-child-identity.sh has run_check() | tests/test-validation-system.cjs:1208 | check-graph-metadata-child-drift.sh warns when the child scanner crashes | tests/typo-flags.vitest.ts:254 |
| different | P123 | check-graph-metadata-shape.sh has run_check() | tests/test-validation-system.cjs:1208 | check-graph-metadata-child-drift.sh warns when the child scanner crashes | tests/typo-flags.vitest.ts:254 |
| different | P124 | check-canonical-save-source-docs.sh has run_check() | tests/test-validation-system.cjs:1208 | keeps primary docs aligned on canonical artifacts and the machine-readable capability source | tests/deep-research-contract-parity.vitest.ts:49 |
| different | P125 | check-canonical-save-lineage.sh has run_check() | tests/test-validation-system.cjs:1208 | persists same_pass lineage when the canonical-save path requests it | tests/workflow-canonical-save-metadata.vitest.ts:262 |
| different | P126 | check-canonical-save-packet-identity.sh has run_check() | tests/test-validation-system.cjs:1208 | prefers the canonical packet for an ambiguous unqualified identity | tests/spec-root-canonical-resolver.vitest.ts:35 |
| different | P127 | check-canonical-save-description-graph-freshness.sh has run_check() | tests/test-validation-system.cjs:1208 | reports description/graph freshness skew as a soft detector | tests/canonical-save-validation.vitest.ts:188 |
| different | P128 | check-canonical-save-description-graph-freshness.sh has run_check() | tests/test-validation-system.cjs:1208 | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |
| different | P129 | check-canonical-save-description-graph-freshness.sh has run_check() | tests/test-validation-system.cjs:1208 | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |
| different | P130 | Fixture exists: 006-missing-required-files | tests/test-validation-system.cjs:1287 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P131 | [Positive Tests (should PASS or WARN)] Compliant Level 2 template fixture | tests/test-validation.sh:746 | passes a template-compliant Level 3 packet | tests/post-edit-placeholder-scan.vitest.ts:65 |
| different | P132 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | tests/test-validation.sh:769 | level-from-spec-refuses-missing-header | tests/heal-lane-modes.vitest.ts:1402 |
| different | P133 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | tests/test-validation.sh:769 | exits 1 without writes when strict-required sections are missing | tests/multi-ai-council-persist-artifacts.vitest.ts:107 |
| different | P134 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | tests/test-validation.sh:769 | should report missing required fields | tests/optimizer-replay-corpus.vitest.ts:140 |
| different | P135 | [Sections Present Tests (should FAIL on missing)] Missing required spec header now fails | tests/test-validation.sh:769 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P136 | [Negative Tests (should FAIL)] Missing required files (no spec.md) | tests/test-validation.sh:776 | should report missing required fields | tests/optimizer-replay-corpus.vitest.ts:140 |
| different | P137 | [Negative Tests (should FAIL)] Missing required files (no spec.md) | tests/test-validation.sh:776 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P138 | [Negative Tests (should FAIL)] Empty folder (all L1 files missing) | tests/test-validation.sh:779 | should return an empty corpus for a missing corpus file | tests/optimizer-replay-corpus.vitest.ts:333 |
| different | P139 | [Negative Tests (should FAIL)] Empty folder (all L1 files missing) | tests/test-validation.sh:779 | keeps stdout empty in text mode, still prints help and still rejects a missing folder | tests/validate-skip-switch.vitest.ts:84 |
| different | P140 | [Negative Tests (should FAIL)] Level 3 missing decision-record.md | tests/test-validation.sh:782 | reads a bare decision record in a markerless packet as level 3 | tests/decision-record-writer.vitest.ts:194 |
| different | P141 | [Negative Tests (should FAIL)] Missing required header fails | tests/test-validation.sh:783 | should report missing required fields | tests/optimizer-replay-corpus.vitest.ts:140 |
| different | P142 | [Negative Tests (should FAIL)] Missing required anchor fails | tests/test-validation.sh:785 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P143 | [Negative Tests (should FAIL)] Missing required anchor fails | tests/test-validation.sh:785 | should report missing required fields | tests/optimizer-replay-corpus.vitest.ts:140 |
| different | P144 | [Negative Tests (should FAIL)] Reordered required anchor fails | tests/test-validation.sh:786 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P145 | [Anchor Edge Cases] Missing required anchor fails | tests/test-validation.sh:785 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P146 | [Anchor Edge Cases] Reordered required anchor fails | tests/test-validation.sh:786 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P147 | [CLI Options Tests] --json produces valid JSON with required fields | tests/test-validation.sh:814 | T-PB2-10b: JSON report has all required top-level fields | tests/progressive-validation.vitest.ts:985 |
| different | P148 | [Exact Exit Code Tests] Exact exit 0: compliant fixture | tests/test-validation.sh:827 | T-PB2-01a: exit code matches validate.sh for a passing fixture | tests/progressive-validation.vitest.ts:257 |
| different | P149 | [Exact Exit Code Tests] Exact exit 0: compliant fixture | tests/test-validation.sh:827 | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | tests/progressive-validation.vitest.ts:266 |
| different | P150 | [Exact Exit Code Tests] Exact exit 1: unknown option | tests/test-validation.sh:828 | rejects an unknown option with the misuse exit code | tests/quality-audit-script.vitest.ts:66 |
| different | P151 | [Exact Exit Code Tests] Exact exit 3: missing folder | tests/test-validation.sh:830 | keeps its usage exit code for a missing folder | tests/post-edit-placeholder-scan.vitest.ts:95 |
| different | P152 | [Exact Exit Code Tests] Exact exit 3: missing folder | tests/test-validation.sh:830 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P153 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing spec.md | tests/test-validation-extended.sh:868 | creates only the missing file when one metadata artifact already exists | tests/backfill-research-metadata.vitest.ts:67 |
| different | P154 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing spec.md | tests/test-validation-extended.sh:868 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P155 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing plan.md | tests/test-validation-extended.sh:869 | creates only the missing file when one metadata artifact already exists | tests/backfill-research-metadata.vitest.ts:67 |
| different | P156 | [Individual Rule: FILE_EXISTS (check-files.sh)] L1: Missing tasks.md | tests/test-validation-extended.sh:870 | creates only the missing file when one metadata artifact already exists | tests/backfill-research-metadata.vitest.ts:67 |
| different | P157 | [Individual Rule: FILE_EXISTS (check-files.sh)] L3: Missing decision-record.md | tests/test-validation-extended.sh:871 | creates only the missing file when one metadata artifact already exists | tests/backfill-research-metadata.vitest.ts:67 |
| different | P158 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | tests/test-validation-extended.sh:872 | creates only the missing file when one metadata artifact already exists | tests/backfill-research-metadata.vitest.ts:67 |
| different | P159 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | tests/test-validation-extended.sh:872 | records the z_future folder skipped on the writer rule, both files excluded | tests/migrate-generated-json.vitest.ts:184 |
| different | P160 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | tests/test-validation-extended.sh:872 | should return an empty corpus for a missing corpus file | tests/optimizer-replay-corpus.vitest.ts:333 |
| different | P161 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | tests/test-validation-extended.sh:872 | is-phase-parent.js exits 2 when the check command is missing its folder | tests/typo-flags.vitest.ts:204 |
| different | P162 | [Individual Rule: FILE_EXISTS (check-files.sh)] Empty folder (all missing) | tests/test-validation-extended.sh:872 | keeps stdout empty in text mode, still prints help and still rejects a missing folder | tests/validate-skip-switch.vitest.ts:84 |
| different | P163 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | tests/test-validation-extended.sh:876 | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | tests/gate-3-classifier.vitest.ts:479 |
| different | P164 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | tests/test-validation-extended.sh:876 | --roots run refuses a plain --folder outside the given roots without blaming a link | tests/heal-symlink-containment.vitest.ts:594 |
| different | P165 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 002-valid-level1 | tests/test-validation-extended.sh:876 | --roots run ignores a system symlink above a plain outside folder in the refusal | tests/heal-symlink-containment.vitest.ts:614 |
| different | P166 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | tests/test-validation-extended.sh:877 | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | tests/gate-3-classifier.vitest.ts:479 |
| different | P167 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | tests/test-validation-extended.sh:877 | --roots run refuses a plain --folder outside the given roots without blaming a link | tests/heal-symlink-containment.vitest.ts:594 |
| different | P168 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 003-valid-level2 | tests/test-validation-extended.sh:877 | --roots run ignores a system symlink above a plain outside folder in the refusal | tests/heal-symlink-containment.vitest.ts:614 |
| different | P169 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | tests/test-validation-extended.sh:878 | satisfies an autonomous triggered prompt with a valid pre-bound spec folder | tests/gate-3-classifier.vitest.ts:479 |
| different | P170 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | tests/test-validation-extended.sh:878 | --roots run refuses a plain --folder outside the given roots without blaming a link | tests/heal-symlink-containment.vitest.ts:594 |
| different | P171 | [Individual Rule: FOLDER_NAMING (check-folder-naming.sh)] Outside spec roots: 045-valid-sections | tests/test-validation-extended.sh:878 | --roots run ignores a system symlink above a plain outside folder in the refusal | tests/heal-symlink-containment.vitest.ts:614 |
| different | P172 | [Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh)] Template provenance token in a title detected | tests/test-validation-extended.sh:884 | reads the spec.md title of a v2.3 packet for a template token, and leaves an older packet as it was | tests/validation-gate-hardening.vitest.ts:233 |
| different | P173 | [Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Scaffold marker with Complete status detected | tests/test-validation-extended.sh:898 | uses the shared status classifier for scaffold marker enforcement | tests/validation-gate-hardening.vitest.ts:217 |
| different | P174 | [Individual Rule: SCAFFOLD_NEVER_TOUCHED (check-scaffold-never-touched.sh)] Genuinely complete docs pass | tests/test-validation-extended.sh:899 | v2.3 Complete: a fence never closed gives pass in both | tests/placeholder-token-gate.vitest.ts:212 |
| different | P175 | [Shared Status Classifier] Not Started classifies as planned | tests/test-validation-extended.sh:903 | uses the shared status classifier for scaffold marker enforcement | tests/validation-gate-hardening.vitest.ts:217 |
| different | P176 | [Metadata Parse Errors] Malformed generated metadata emits a warning | tests/test-validation-extended.sh:911 | emits v1.1 metadata on all generated state lines | tests/multi-ai-council-persist-artifacts.vitest.ts:131 |
| different | P177 | [Orchestrator: Valid Fixtures (Exit 0 or 1)] 053-template-compliant-level2 passes cleanly | tests/test-validation-extended.sh:953 | passes a template-compliant packet | tests/anchor-contract.vitest.ts:68 |
| different | P178 | [Orchestrator: Valid Fixtures (Exit 0 or 1)] 053-template-compliant-level2 passes cleanly | tests/test-validation-extended.sh:953 | passes a template-compliant Level 3 packet | tests/post-edit-placeholder-scan.vitest.ts:65 |
| different | P179 | [Orchestrator: Error Fixtures (Exit 2)] 001-empty-folder fails | tests/test-validation-extended.sh:961 | fails when a level folder is empty | tests/example-drift.vitest.ts:79 |
| different | P180 | [Orchestrator: Error Fixtures (Exit 2)] 001-empty-folder fails | tests/test-validation-extended.sh:961 | maps a clean miss to exit 1 and a valid empty result, never an error | tests/rg-wrapper-recipes.vitest.ts:164 |
| different | P181 | [Orchestrator: Error Fixtures (Exit 2)] 006-missing-required-files fails | tests/test-validation-extended.sh:963 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P182 | [Orchestrator: Error Fixtures (Exit 2)] 006-missing-required-files fails | tests/test-validation-extended.sh:963 | validate-command-tree-parity.sh keeps exit 64 when a required side is missing | tests/typo-flags.vitest.ts:378 |
| different | P183 | [Orchestrator: Error Fixtures (Exit 2)] 072 scaffold marker fails through default registry bridge | tests/test-validation-extended.sh:973 | traces validate.sh through the orchestrator, every registry rule and their helpers | tests/validator-git-fsmonitor.vitest.ts:140 |
| different | P184 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | tests/test-validation-extended.sh:981 | T-PB2-01a: exit code matches validate.sh for a passing fixture | tests/progressive-validation.vitest.ts:257 |
| different | P185 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | tests/test-validation-extended.sh:981 | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | tests/progressive-validation.vitest.ts:266 |
| different | P186 | [Exit Code Verification] Exit 0: Compact compliant fixture returns pass | tests/test-validation-extended.sh:981 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P187 | [Exit Code Verification] Exit 0: Warning fixture returns warn | tests/test-validation-extended.sh:982 | T-PB2-01a: exit code matches validate.sh for a passing fixture | tests/progressive-validation.vitest.ts:257 |
| different | P188 | [Exit Code Verification] Exit 0: Warning fixture returns warn | tests/test-validation-extended.sh:982 | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | tests/progressive-validation.vitest.ts:266 |
| different | P189 | [Exit Code Verification] Exit 0: Warning fixture returns warn | tests/test-validation-extended.sh:982 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P190 | [Exit Code Verification] Exit 2: Missing files return fail | tests/test-validation-extended.sh:984 | keeps its usage exit code for a missing folder | tests/post-edit-placeholder-scan.vitest.ts:95 |
| different | P191 | [Exit Code Verification] Exit 2: Missing files return fail | tests/test-validation-extended.sh:984 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P192 | [Exit Code Verification] Exit 2: Missing files return fail | tests/test-validation-extended.sh:984 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P193 | [Exit Code Verification] Exit 2: Missing required header returns fail | tests/test-validation-extended.sh:985 | keeps its usage exit code for a missing folder | tests/post-edit-placeholder-scan.vitest.ts:95 |
| different | P194 | [Exit Code Verification] Exit 2: Missing required header returns fail | tests/test-validation-extended.sh:985 | T-PB2-09b: exit 2 for a failing spec (missing required files) | tests/progressive-validation.vitest.ts:930 |
| different | P195 | [Exit Code Verification] Exit 2: Missing required header returns fail | tests/test-validation-extended.sh:985 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P196 | [Exit Code Verification] Exit 2: Missing required header returns fail | tests/test-validation-extended.sh:985 | validate-command-tree-parity.sh keeps exit 64 when a required side is missing | tests/typo-flags.vitest.ts:378 |
| different | P197 | [Exit Code Verification] Exact exit 0: compliant fixture | tests/test-validation-extended.sh:986 | T-PB2-01a: exit code matches validate.sh for a passing fixture | tests/progressive-validation.vitest.ts:257 |
| different | P198 | [Exit Code Verification] Exact exit 0: compliant fixture | tests/test-validation-extended.sh:986 | T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture | tests/progressive-validation.vitest.ts:266 |
| different | P199 | [Exit Code Verification] Exact exit 1: unknown option | tests/test-validation-extended.sh:987 | rejects an unknown option with the misuse exit code | tests/quality-audit-script.vitest.ts:66 |
| different | P200 | [Exit Code Verification] Exact exit 3: missing folder | tests/test-validation-extended.sh:989 | keeps its usage exit code for a missing folder | tests/post-edit-placeholder-scan.vitest.ts:95 |
| different | P201 | [Exit Code Verification] Exact exit 3: missing folder | tests/test-validation-extended.sh:989 | returns exit code 2 when the census root is missing | tests/template-phrase-cleanup.vitest.ts:550 |
| different | P202 | [JSON Output Mode] --json compact compliant fixture produces valid JSON | tests/test-validation-extended.sh:997 | T-PB2-10a: --json output is valid JSON | tests/progressive-validation.vitest.ts:977 |
| different | P203 | [JSON Output Mode] --json warning fixture produces valid JSON | tests/test-validation-extended.sh:998 | T-PB2-10a: --json output is valid JSON | tests/progressive-validation.vitest.ts:977 |
| different | P204 | [JSON Output Mode] --json error fixture produces valid JSON | tests/test-validation-extended.sh:999 | T-PB2-10a: --json output is valid JSON | tests/progressive-validation.vitest.ts:977 |
| different | P205 | [Edge Cases: Anchor Scenarios] Missing required anchor fails | tests/test-validation-extended.sh:1021 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P206 | [Edge Cases: Anchor Scenarios] Reordered required anchor fails | tests/test-validation-extended.sh:1022 | fails when an example loses a required anchor | tests/example-drift.vitest.ts:50 |
| different | P207 | [Edge Cases: Level Detection] Explicit level on compliant fixture passes cleanly | tests/test-validation-extended.sh:1036 | passes a template-compliant Level 3 packet | tests/post-edit-placeholder-scan.vitest.ts:65 |
| different | P208 | after cutoff, missing document blocks | tests/check-ac-closure.sh:47 | grandfathers missing save_lineage before the cutoff and fails after it | tests/canonical-save-validation.vitest.ts:157 |
| different | P209 | before cutoff, missing document advisory | tests/check-ac-closure.sh:48 | grandfathers missing save_lineage before the cutoff and fails after it | tests/canonical-save-validation.vitest.ts:157 |
| different | P210 | malformed cutoff falls back, not grandfather-all | tests/check-ac-closure.sh:124 | falls back to the default cutoff on a malformed override | tests/check-source-tags.vitest.ts:208 |
| different | P211 | malformed cutoff falls back, not grandfather-all | tests/check-ac-closure.sh:124 | falls back to the default cutoff on a date-shaped day that does not exist | tests/check-source-tags.vitest.ts:214 |
| different | P212 | file:line in the Verification cell is evidence | tests/check-ac-coverage.sh:70 | deduplicates repeated bullets and prefers file-line anchored evidence | tests/distinguishing-evidence-dedup.vitest.ts:10 |
| different | P213 | the merged tasks document is the traceability source | tests/check-ac-coverage.sh:139 | carries verification in the merged tasks document and nowhere else | tests/scaffold-golden-snapshots.vitest.ts:190 |
| different | P214 | a malformed cutoff falls back to the default | tests/check-ac-coverage.sh:176 | falls back to the default cutoff on a malformed override | tests/check-source-tags.vitest.ts:208 |
| different | P215 | a malformed cutoff falls back to the default | tests/check-ac-coverage.sh:176 | falls back to the default cutoff on a date-shaped day that does not exist | tests/check-source-tags.vitest.ts:214 |
| different | P216 | the root is tried after the packet folder | tests/check-ac-coverage.sh:233 | numbers after the highest folder already in the root | tests/create-root-numbering.vitest.ts:78 |
| different | P217 | the root is tried after the packet folder | tests/check-ac-coverage.sh:233 | leaves the track root alone for a folder nested inside a packet | tests/create-track-refresh.vitest.ts:160 |
| different | P218 | an empty list reports nothing | tests/check-ac-coverage.sh:234 | reports no-phrases when spec.md declares an empty trigger_phrases list | tests/workflow-trigger-index-freshness.vitest.ts:121 |
| different | P219 | a path from the repository root resolves | tests/check-ac-coverage.sh:278 | resolves a repository-relative declaration from a packet at the specs root | tests/graph-key-file-declarations.vitest.ts:101 |
| different | P220 | a path from the repository root resolves | tests/check-ac-coverage.sh:278 | resolves to the repository root, not the .skilled directory | tests/retrieval-repo-root.vitest.ts:33 |
| different | P221 | a path from the repository root resolves | tests/check-ac-coverage.sh:278 | rejects a repository-local root symlink that resolves outside the repository | tests/strict-pass-freshness.vitest.ts:93 |
| different | P222 | a path from the repository root resolves | tests/check-ac-coverage.sh:278 | readme recovery resolves paths from the exported repository root | tests/upgrade-legacy-core-b.vitest.ts:361 |
| different | P223 | a path from the repository root resolves | tests/check-ac-coverage.sh:278 | resolves a nested start in a .skilled-only checkout to the repository root | tests/workspace-identity.vitest.ts:102 |
| different | P224 | Default phase run created 3 child folders | tests/test-phase-system.sh:141 | merges the phase-child addendum into spec contracts for child phase folders | tests/template-structure.vitest.ts:170 |
| different | P225 | New phase parent's map lists all 3 phases and keeps no row marker | tests/test-phase-system.sh:149 | archives a phase into its parent's own z_archive, restores it there and leaves both lists alone | tests/archive-track.vitest.ts:331 |
| different | P226 | New phase parent's map lists all 3 phases and keeps no row marker | tests/test-phase-system.sh:149 | derives a declared sub-track parent and keeps a phase child parent | tests/graph-metadata-refresh.vitest.ts:104 |
| different | P227 | New phase parent's map lists all 3 phases and keeps no row marker | tests/test-phase-system.sh:149 | keeps phase-parent contract lean | tests/level-contract-resolver.vitest.ts:50 |
| different | P228 | Appended phase child headers link predecessor and successor correctly | tests/test-phase-system.sh:185 | names nothing when a phase child is appended to an existing parent | tests/create-track-refresh.vitest.ts:360 |
| different | P229 | Appended phase rows continue the parent's phase-map table | tests/test-phase-system.sh:195 | names nothing when a phase child is appended to an existing parent | tests/create-track-refresh.vitest.ts:360 |
| different | P230 | Appended phase rows continue the parent's phase-map table | tests/test-phase-system.sh:195 | reports the skip for a phase appended to an existing parent | tests/create-without-build.vitest.ts:89 |
| different | P231 | Append mode still generates description.json for the newly created child phase | tests/test-phase-system.sh:242 | stops a phase parent that cannot get its description.json | tests/create-without-build.vitest.ts:75 |
| different | P232 | Append mode still generates description.json for the newly created child phase | tests/test-phase-system.sh:242 | emits parseable JSON for a phase parent when the mode comes from the environment | tests/validation-engine-coherence.vitest.ts:130 |
| different | P233 | Append mode still generates description.json for the newly created child phase | tests/test-phase-system.sh:242 | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |
| different | P234 | Append mode still generates description.json for the newly created child phase | tests/test-phase-system.sh:242 | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |
| different | P235 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | names nothing when a phase child is appended to an existing parent | tests/create-track-refresh.vitest.ts:360 |
| different | P236 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | resolves a bare phase parent to last_active_child_id when available | tests/gate-3-classifier.vitest.ts:633 |
| different | P237 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | rejects a bare phase parent when no last_active_child_id is available | tests/gate-3-classifier.vitest.ts:652 |
| different | P238 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | preserves an existing last_active_child_id during phase-parent rollup | tests/graph-metadata-backfill.vitest.ts:237 |
| different | P239 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | derives a declared sub-track parent and keeps a phase child parent | tests/graph-metadata-refresh.vitest.ts:104 |
| different | P240 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | bubbles child saves up to the direct phase parent | tests/phase-parent-pointer.vitest.ts:96 |
| different | P241 | A new parent's first child is labeled Phase 1 | tests/test-phase-system.sh:262 | returns flat for child-phase first run when rootDir is empty | tests/review-research-paths.vitest.ts:160 |
| different | P242 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | tests/test-phase-system.sh:275 | creates description.json and graph-metadata.json when both are missing | tests/backfill-research-metadata.vitest.ts:49 |
| different | P243 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | tests/test-phase-system.sh:275 | leaves a packet without graph-metadata children unchanged | tests/graph-metadata-backfill.vitest.ts:223 |
| different | P244 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | tests/test-phase-system.sh:275 | plan-only mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |
| different | P245 | Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title | tests/test-phase-system.sh:275 | full-auto mode advances description.json.lastUpdated and creates graph-metadata.json.derived.last_save_at | tests/workflow-canonical-save-metadata.vitest.ts:10 |

## 7. Per-lane recommendation

Every lane keeps at least one name with no confirmed CLI counterpart, so no lane earns `narrow`. The covered list names the confirmed pairs; the uncovered count covers every remaining name attributed to the lane in section 3.

Recommendation: keep test-scripts-modules-js — covered: 2 of 266 names: T-008i: phase-classifier preserves non-contiguous phase returns; T-008j: phase-classifier derives Iterative Loop flow pattern. Uncovered: 264 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-extractors-loaders-js — covered: 4 of 268 names: EXT-Session-030: Write-heavy = IMPLEMENTATION; EXT-Session-031: Decisions + read-heavy = PLANNING; EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists; EXT-Conv-023: Non-contiguous phases remain separate segments. Uncovered: 264 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-phase-validation-js — covered: none of 51 names. Uncovered: 51 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-phase-system-js — covered: none of 27 names. Uncovered: 27 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-validation-system-cjs — covered: none of 101 names. Uncovered: 101 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-validation-sh — covered: none of 31 names. Uncovered: 31 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-validation-extended-sh — covered: none of 84 names. Uncovered: 84 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep check-ac-closure-sh — covered: none of 29 names. Uncovered: 29 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep check-ac-coverage-sh — covered: none of 45 names. Uncovered: 45 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep check-graph-metadata-child-drift-sh — covered: none of 12 names. Uncovered: 12 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep check-graph-metadata-shape-last-active-child-sh — covered: none of 2 names. Uncovered: 2 names, every name attributed to this lane in section 3 that is not in the covered list.
Recommendation: keep test-phase-system-sh — covered: none of 12 names. Uncovered: 12 names, every name attributed to this lane in section 3 that is not in the covered list.

`narrow` was not written for any lane because the condition for it, every name in the lane confirmed against a CLI test, is false for all twelve.

## 8. Method and limits

- The lane list records a name against the lane that printed it; the twelve commands come from `test:legacy` and `test:validation` in the CLI package manifest.
- `test-validation.sh` and `test-validation-extended.sh` are collected in `--list` mode, because that is where each prints a stable `[category] name` entry. The other ten lanes are collected from their normal run output.
- The CLI list comes from `vitest list` and no CLI test runs to produce it. The lane list costs one run of each lane.
- The comparison is name-based. A `same` verdict means the two tests were read and assert the same behaviour; it is not a proof that the coverage is interchangeable under every input.
- Runtime skips are not distinguished: the CLI list holds every declared name, and a lane that skipped a test still contributes no name for it.
- The 161 s and 490 s figures are the pre-split baseline from run 43174399120. This report does not re-time either lane.

