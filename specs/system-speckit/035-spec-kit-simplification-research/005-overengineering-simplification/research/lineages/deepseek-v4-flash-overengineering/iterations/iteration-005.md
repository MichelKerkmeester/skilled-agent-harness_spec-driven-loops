# Iteration 005 — KQ-R2a: the rule bodies (round one's explicit blind spot)

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 5 | focus: the 28 rule scripts + 3 Node helpers under `runtime/cli/rules/` — which duplicate, which are unreferenced, what the rules/README claim vs contain. Round one eliminated reading these bodies for read-budget ("rule bodies belong to the duplication pass" — eliminated-alternatives row 1); this pass reads their surfaces and caller sets.
Evidence reads: `runtime/cli/rules/` inventory (wc), `rules/README.md:57-84`, `check-grep-convention.sh` (head), helper-usage greps, graph-family headers, `check-links.sh:89-91`, `check-doc-pointers.sh` (full, run 1... re-verified), `runtime/cli/check-links.sh:3-11` compat shim. Reads cost: 6 bash calls. No node/validate/git.

## What exists (counted in this tree)

- 28 `check-*.sh` files + 3 Node helpers (canonical-save 258 L, grep-convention 550 L, metadata-disk-consistency 115 L) + README = 32 files; 4,748 LOC total.
- **26 of 28 scripts are registry rows** (unique script_path values in the 39-row registry); **2 are NOT**: `check-doc-pointers.sh` and `check-links.sh`.
- The 3 helpers are each used by exactly one wrapper script (verified: each helper name appears only in its own wrapper) — legit single-purpose helpers, and the greppable-convention node helper's rationale ("bash cannot parse YAML honestly", check-grep-convention.sh:12) is sound.
- Graph-metadata family = 4 scripts with 4 clearly distinct failure modes (presence / child-drift / child-identity / shape) — analogous to the F8 multiplex the census kept for per-row attribution; recorded as observed-kept, not a finding.
- The wikilink cluster: `runtime/cli/rules/check-links.sh` (151 L) + compat shim `runtime/cli/check-links.sh` (delegates) + `runtime/cli/check-markdown-links.cjs` (walks the tree for `[text](url)` links; header: "Complements check-links.sh (which validates wikilinks [[...]])"). `SPECKIT_VALIDATE_LINKS` defaults to false inside check-links.sh:89-91 and has zero other referrers in runtime/ — no workflow, no validate.sh, no hook sets it.

## Findings

**F2-10 [P2 — orphaned rule script, and its whole failure class is unguarded] `check-doc-pointers.sh` is not registered in the validator registry, is named by no caller, appears in no README inventory, and the rules/README's own "full rule list" claim is false.**
- Where: `runtime/cli/rules/check-doc-pointers.sh` (60 L, 0 references anywhere in `.opencode` outside itself — verified by full-tree grep); `runtime/cli/rules/README.md:69` ("The full rule list is the set of `check-*.sh` files in this directory plus three Node helpers") vs reality (28 files, 26 registry rows); registry `validator-registry.json` (no DOC_POINTERS row).
- What exists: a complete, self-contained checker asserting every backticked `references/` or `constitutional/` pointer in root AGENTS.md resolves on disk; its own header documents the failure class it exists to prevent ("was observed to lead a research lineage to a false conclusion").
- Cost: (a) a file in the rules dir that never runs — readers who trust the README's "full rule list" claim believe 28 rules exist where 26 do; (b) the AGENTS.md dead-pointer class (explicitly observed to bite a lineage) is unguarded by anything in the 39-rule set; (c) 60 lines + the directory's rule-ness tax with zero execution.
- Protects: nothing today; would protect the most-read surface's pointer integrity if registered.
- Severity: P2 (no live behavior broken; an unguarded documented failure class + a false inventory claim).
- Recommendation: **merge** — register it as one registry row (warn) so AGENTS.md pointer rot fails loud, and correct rules/README.md:69's claim to "26 registered + 2 optional/on-demand"; or, if the class is accepted as unguarded, **remove** the file and fix the README claim. Either way the README assertion must change; that assertion is independently a defect.

**F2-11 [P2 — on-demand tool with no caller, flag no one sets] The wikilink cluster (3 files + `SPECKIT_VALIDATE_LINKS`, default false) is referenced by zero workflows, zero validation paths, zero hooks.**
- Where: `runtime/cli/rules/check-links.sh:89-91` (env gate), `runtime/cli/check-links.sh:3-11` (compat shim), `runtime/cli/check-markdown-links.cjs` (header), `feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md:21` (describes the pair as complementary), `runtime/cli/README.md:88,128`.
- What exists: wikilink (`[[...]]`) validation + a markdown-link walker, both documented as the manual companion to the automated markdown-link-integrity guard; the flag's default false means the shim no-ops unless an operator sets it; nothing in the command surface or validation story mentions it.
- Cost: 3 files (~150+ L + cjs walker) + 1 flag + 3 doc sites maintained for a scan no workflow references; adherence = 0 (no agent is told to run it; the feature-catalog pair description implies both are live equivalently).
- Protects: wikilink integrity on manual invocation only.
- Severity: P2 (capability is documented but uncalled; the "documented, validated capability" bar protects it from outright deletion — so the fix is to give it a caller or accept the manual-only contract explicitly).
- Recommendation: **merge** — register `check-links.sh` as a warn rule row gated by the existing `SPECKIT_VALIDATE_LINKS` flag (the flag then has a real gate and `--strict` surfaces it), or demote both files to an explicit "manual, not part of validation" note in the rules/README and feature-catalog so no reader assumes the guard class is covered.

## Ruled out / corrections

- "The 4-script graph-metadata family duplicates" — NO: four distinct failure modes, consistent with the F8-attribution logic the census kept; observed-kept.
- "Helpers are dead" — NO: all three have exactly one wrapper consumer.
- "Rules dir = 28 registered rules" — corrected to 26 + 2 unregistered (the README claim is the defect, F2-10).

## Provisional counts

- 28 check-*.sh; 26 registry rows; 2 unregistered (doc-pointers, links); 3 helpers all used; 4,748 LOC total.
- Orphan references: check-doc-pointers.sh = 0; rule-body run is now covered at the surface level (per-file purpose + caller set); per-body duplication beyond the graph family was not re-litigated (round two budget: surface + caller-level only for the large scripts).
