# Iteration 002 — KQ-R3b: validator-registry rows 13-39, rule value second half

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | run 2 | focus: rows 13-39 grouped by family (graph-metadata, canonical-save, acceptance), header comments only, at most 12 reads.

Evidence reads (12 file reads in 3 bash calls + 1 test grep): headers of `check-frontmatter.sh`, `check-grep-convention.sh`, `check-canonical-save.sh`, `check-graph-metadata-child-identity.sh`, `check-graph-metadata-child-drift.sh`, `check-graph-metadata-shape.sh`, `validation/generated-metadata-integrity.ts`, `check-spec-doc-integrity.sh`, `check-complexity.sh`, `check-folder-naming.sh`, `check-template-source.sh`, `check-toc-policy.sh`; plus the iteration-1 read of `check-level-match.sh:1-12` (cited, not re-read); plus a test-tree grep of all 27 remaining rule ids in `runtime/cli/tests` and `runtime/tests`. No node/validate/git executed.

## Family judgments

**canonical-save (rows 31-35, one script `check-canonical-save.sh`)** — census F8 recorded the deliberate keep (five rows, one script, each row a distinct failure the report attributes). Header adds new signal only: grandfathering windows "Temporary rollout allowlist expires at 2026-05-01T00:00:00Z" and "save_lineage enforcement becomes hard ... on/after 2026-05-01T00:00:00Z" (lines 5-7). Today is 2026-09-07: both windows are expired; whether the body graduated or still carries dead time-branches is unread (open question; new evidence the census never examined).

**graph-metadata (rows 22-27 + strict 37-38, 8 rows)** — the children pair is coherent and documented: CHILD_DRIFT (warn, flag-gated) = children_ids MISSING on-disk children the union-merge writer would ADD; CHILD_IDENTITY (error) = children_ids entries whose leading identity is not the packet's current identity (entries the writer previously never pruned). One invariant, two directions, each header states its direction and the writer's merge semantics. The family problem is elsewhere: GENERATED_METADATA_INTEGRITY (strict TS bridge) re-validates the SAME two files (description.json, graph-metadata.json) "through the shared schemas plus the path-prefix and status-enum invariants" (generated-metadata-integrity.ts:3-6) — path-prefix is METADATA_DISK_PATH_CONSISTENCY's claim ("ids match the real on-disk spec-folder path"), shape is GRAPH_METADATA_SHAPE + DESCRIPTION_SHAPE's claim. 8 rows over two small JSON files, with the strict bridge duplicating three shell rows' invariants.

**acceptance (rows 7-8)** — judged in iteration 1: coverage (advisory) vs closure (gate) are distinct defect classes; census-kept (F6). No new evidence.

## Findings

**F3-04 [P2 — family-level redundancy] The metadata family is 8 rows over 2 files, and the strict bridge re-implements the shell rows' invariants.**
- Claim side: `runtime/cli/validation/generated-metadata-integrity.ts:3-6` — "Validates the description.json and graph-metadata.json a spec folder carries through the shared schemas plus the path-prefix and status-enum invariants".
- Actual: `rules/check-graph-metadata-shape.sh` (row 25, warn) validates graph-metadata.json shape; `rules/check-description-shape.sh` (row 27, warn, 0 tests) validates description.json shape; `rules/check-metadata-disk-consistency.sh` (row 26, error) checks the same "ids match the real on-disk path" invariant the bridge calls path-prefix. Three shell rows + one strict bridge over the same two objects; the only difference is enforcement layer (non-strict validate vs strict-only bridge) and grandfather mode.
- Severity: P2. Recommendation: **merge** — one schema-based checker (the bridge), retire or fold the three shell rows under strict; if the layered split is deliberate, each header must name the other surface.

**F3-05 [P2 — header convention violation + git dependency] `check-spec-doc-integrity.sh` has no Rule/Severity/Description comment block and names no rule id, unlike every sibling.**
- Claim side: registry row 29 — `script_path: rules/check-spec-doc-integrity.sh`, severity error, "Verifies inline markdown references resolve within spec docs".
- Actual: `check-spec-doc-integrity.sh:1-8` — "COMPONENT: CHECK-SPEC-DOC-INTEGRITY" banner then straight to `set -euo pipefail` and `git rev-parse --show-toplevel 2>/dev/null`; no `# Rule: SPEC_DOC_INTEGRITY` line, no `# Severity:` line, no `# Sourced by validate.sh and compatible with strict mode` line. It is the only rule script of the 20 read whose header cannot be matched to its registry row by an identifier — and whether it is sourced (like the others) or a standalone script is now ambiguous from the code itself.
- Severity: P2. Recommendation: **fix** the header to the sibling convention (or explicitly mark it standalone), and state the git dependency; round-two F2-10 fixed the rules README's rule-list claim, but this script's own header still cannot prove its registry membership.

**F3-06 [P2 — untested rows] Six rule ids have zero test files naming them: TOC_POLICY, AI_PROTOCOLS, GRAPH_METADATA_CHILD_IDENTITY, DESCRIPTION_SHAPE, SPEC_DOC_INTEGRITY, IMPROVEMENT_ARTIFACTS.**
- Claim side: the test-tree grep (runtime/cli/tests + runtime/tests, id-string search, dist excluded) returned 0 for each.
- Actual: 33 of 39 rows have ≥1 naming test; TEMPLATE_SOURCE's 39 is inflated by the SPECKIT_TEMPLATE_SOURCE env-var string appearing in many tests (counts are id-string based, not behavior-verified — a 0 could still be behavior-tested without the string; caveat stands).
- Severity: P2 per the angle (test-name coverage is the measurement). Recommendation: **fix** — add a naming test or fold each into an existing family test (TOC_POLICY, AI_PROTOCOLS, IMPROVEMENT_ARTIFACTS appear otherwise orphan-free; SPEC_DOC_INTEGRITY doubles as F3-05).

**F3-07 [P2 — dual validator] ANCHORS_VALID (native, row 9) and GREP_CONVENTION (shell, row 20) both validate anchor grammar.**
- Claim side: registry row 9 "Validates anchor syntax, pairing, order, and uniqueness"; `check-grep-convention.sh:8-11` — the greppable-corpus convention includes "anchor grammar".
- Actual: two surfaces enforce anchor grammar (orchestrator native check vs validate.sh shell scan), 7 vs 1 test files; the split is by execution layer, not by defect — nothing in either header says the other exists. (Iteration-1 open question 3 resolved.)
- Severity: P2. Recommendation: **document** the layer split in both headers, or **merge** the anchor-grammar scan into one surface.

**F3-08 [P2 — asymmetric tests within the children pair] GRAPH_METADATA_CHILD_IDENTITY (error severity, the harder check — stale rename residue the writer never prunes) has 0 naming tests while its sibling GRAPH_METADATA_CHILD_DRIFT (warn, flag-gated) has 1.**
- Claim side: F3-06's grep; `check-graph-metadata-child-identity.sh:3-8` (header states the writer's "never dropped" merge semantics that make this the only check catching permanent drift).
- Actual: the error-severity member of the pair — the one whose invariant cannot heal without a rename-aware writer — is the untested one.
- Severity: P2. Recommendation: **fix** (add the rename-residue fixture test).

**F3-09 [P2 — expired grandfather windows still stated] `check-canonical-save.sh:5-7` carries grandfathering comments with 2026-05-01 expiry dates; today is 2026-09-07.**
- Claim side: the header block "Grandfathering windows for the canonical-save hardening rollout: Temporary rollout allowlist expires at 2026-05-01T00:00:00Z; save_lineage enforcement becomes hard for graph writes on/after 2026-05-01T00:00:00Z".
- Actual: the body was not read (header-only mandate); if the time-branches still execute, they are dead code four months past expiry; if graduated, the header is stale documentation.
- Severity: P2. Recommendation: **verify** — grep the script for the date constants; graduate or delete the window branch; then fix the comment. (Body check recorded as open question; the census never examined this file's rollout scaffolding, so this is new signal, not a re-report.)

## Verified correct this iteration

- Children trio (DRIFT/IDENTITY/SHAPE) is not redundant: each header names a distinct children_ids/graph condition and derives from the same documented writer semantics; severities (warn+flag / error / warn) are coherent with what each protects.
- canonical-save: 5 rows, one script is the census-kept F8 shape; per-row failure attribution remains the stated reason.
- Acceptance pair stands as judged in iteration 1.
- FRONTMATTER_VALID vs FRONTMATTER_MEMORY_BLOCK (F3-02 resolution): the script validates top-level YAML frontmatter structure and required semantic values (authored docs); the ts row validates canonical `_memory` continuity frontmatter blocks (generated payload). Split is by object, plausible but not proven by headers — one sentence in each header naming the other surface would close it. Downgraded from "duplication candidate" to "undocumented split".
- COMPLEXITY_MATCH, FOLDER_NAMING, TEMPLATE_SOURCE, TOC_POLICY, GRAPH_METADATA_SHAPE headers each name distinct defect classes; no class-level overlap with a sibling beyond the family findings above.

## Open questions

1. Does check-canonical-save.sh's body still execute either 2026-05-01 window (dead code) or has it graduated (stale comment)? — needs one grep beyond the header budget.
2. Do the unread headers (check-ai-protocols.sh, check-normalizer-lint.sh, check-improvement-artifacts.sh, check-graph-metadata.sh, check-metadata-disk-consistency.sh, check-description-shape.sh, continuity-freshness.ts, generated-metadata-drift.ts) hide anything? Not read: 12-read cap.
3. Are the 0-count rows truly behavior-untested, or tested without naming the id? Test files not read (budget).
4. Is check-spec-doc-integrity.sh sourced by validate.sh or standalone? (Its header omits the sourced-mark line; body not read.)
