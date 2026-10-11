# Iteration 008 — Playbook-side widening: the unchecked inline tier, a live wrong-line anchor in the canonical scenario, and the option check's canonical false positive

- Run: `2026-10-11T16:24:27.869Z` | Iteration 8 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: all five strategy key questions remain answered; no box is re-ticked. This iteration executes the dispatch's widening mandate over the playbook side — iteration 7 replayed the catalog side — and tests the proposed checks against the canonical literal-naming case the topic names. It closes no key question; it adds corpus-scale playbook evidence, a new live drift fixture, and one self-corrected measurement.

## Focus

1. Census the playbook corpus citation surface and split hard-gated markdown links from unchecked inline backticked citations.
2. Replay the path-existence half over the playbook-side inline citations, classifying every unresolved token under trailing-argument stripping and the migrated-root fallback.
3. Test the proposed scenario-options check and anchor resolution against the canonical literal-naming scenario and `create.sh`, the real case the topic cites.
4. Measure the expected-answer extraction surface (template conformance) across the playbook fleet.

## Actions Taken

1. Corpus census over 57 discovered `manual-testing-playbook` trees under `.skilled/skills`: 2,682 `.md` files (excluding `node_modules` and `z_archive`); extracted (a) markdown-link targets and (b) inline backticked `.skilled`/`.opencode` citations; resolved each from the repository root with `:line` and `#anchor` suffixes stripped.
2. Taxonomy pass: re-ran the unresolved set with trailing-argument stripping (a citation can carry a CLI argument inside the same backticks) and the `.opencode/specs/*` → `specs/*` migrated-root fallback; classified the remainder by token family.
3. Canonical-case adjudication: read the literal-naming scenario (lines 55–159) [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:77], tested its flag set against `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`, and verified the scenario's hard-coded `create.sh` line-1084 citation against the file's actual `PROVIDE-DESCRIPTIVE-SLUG` occurrences; re-measured corpus-wide `file` line N` code-line references with a backtick-tolerant pattern after the first pattern returned zero.
4. Conformance scan: counted `SCENARIO CONTRACT`, `Expected signals`, `### Expected`, `### Evidence` and `### Pass / Fail` sections across the corpus; sampled `sk-vision` scenarios for cross-tree structure [SOURCE: .skilled/skills/sk-vision/manual-testing-playbook/scene-understanding/detect.md:31].

## Findings

### F1 — The playbook citation surface splits cleanly: 1,271 distinct markdown links, all resolving; 706 distinct inline citations (2,064 instances), unchecked and carrying the unresolved population

The link half is already gated and behaves: across the corpus, `.skilled`/`.opencode`-prefixed markdown-link targets number 1,271 distinct, and repo-root resolution finds none unresolved — consistent with iteration 1's finding that the playbook validator resolves links hard and the operator-contract workflow runs it. The inline backticked half — the format most scenario commands and provenance lines use — numbers 706 distinct and 2,064 instances, and no validator resolves it. Raw repo-root resolution flags 111 distinct as dead; after stripping trailing arguments and applying the migrated-root fallback (next finding), 6 resolve and 102 remain. The unchecked surface is therefore real and corpus-scale, and it is exactly the surface the two modes' own scenarios are written in.

### F2 — The 102 dead inline citations decompose into five families, four of which no check should ever fail on

Arguments stripped and fallback applied: **30 placeholder/glob tokens** (`[###-short-name]/`, `<track>/<packet>/output`, `*.test.cjs` wildcards, `...` ellipses); **30 `.opencode/specs/**` historical-provenance paths** that even the `specs/*` fallback cannot resolve, e.g. the `Source phase:` line citing a pre-migration packet path [SOURCE: .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/state-safety/atomic-state-deferred-writer.md:123]; **10 runtime/generated paths** (`.skilled/release/runs/*`, `.skilled/logs/*`, `.state/*`); **10 migrated-named roots** (`.skilled/agents/`, `.skilled/changelog/`, `.skilled/commands/`, `.skilled/plugins/`); and **22 other**, which include candidate move drift such as `.skilled/skills/cli-opencode/SKILL.md` (the live skill sits under `cli-external-orchestration/`) — not adjudicated here, because a scenario may legitimately describe an installed layout rather than a repository layout. Consequence for the check: the playbook existence half needs the same expected-unresolved convention iteration 7 concluded for catalogs, plus a migrated-root fallback and trailing-argument stripping; the dead population is dominated by token families that would generate false positives at a rate no gate could accept, which strengthens the warn-only staging posture.

### F3 — New live fixture: the canonical scenario carries a stale code-line anchor, and no current or proposed scanner can see it

The failure-triage block instructs the operator to "confirm `create.sh` line 1084 contains `PROVIDE-DESCRIPTIVE-SLUG`" [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:138], with a second "near line 1084" reference at line 141. In today's `create.sh` the token occurs at lines 1060 and 1636, not 1084; lines 1082–1088 carry session-scaffold `print` statements, and the file is now 2,289 lines [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1636]. This is the wrong-line class — the same shape as the catalogs' `code-standards-alignment.md:76` case — but written as prose ("`` `create.sh` `` line 1084"), so it matches neither iteration 7's catalog `path:line` anchor scan (no `.skilled`-prefixed path) nor this iteration's inline-citation scan (no backticked path token). Corpus-wide, the backtick-tolerant `file` line N` pattern finds exactly 1 instance — this one. The extractor lesson is part of the fixture: the first measurement returned zero because the filename is backticked and the line number is not.

### F4 — The canonical option check false-positives on its own case: `--trace-warnings` is a Node runtime flag, not a `create.sh` option

The scenario's distinct flags are `--help --level --path --phase --phase-names --phases --short-name --trace-warnings`. Seven resolve to declared `create.sh` options; `--trace-warnings` does not and never did — it appears in the captured stderr as Node's `node --trace-warnings` hint [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:123]. A naive "every flag in the scenario must exist in the script the scenario names" check fails immediately on the flagship fixture. This reconfirms iteration 6's conclusion with the canonical case itself: command-grammar-aware attribution — which command each flag binds to — is the load-bearing cost of the option half, and it is the difference between a check that catches the historical `--phase-count` case and one that cries wolf on `--trace-warnings`.

### F5 — The expected-answer surface is template-conformant corpus-wide, but "Expected" is an excerpt, so the check is assertion extraction, not block comparison

Of the 2,682 files, 1,382 carry a `SCENARIO CONTRACT` block, 1,261 carry `Expected signals:`, 992 carry `### Expected`, 952 `### Evidence`, and 668 `### Pass / Fail` (denominator includes root/index files, so the scenario-file conformant share is higher). The same structure appears outside sk-doc's own trees, e.g. the `sk-vision` scenarios [SOURCE: .skilled/skills/sk-vision/manual-testing-playbook/scene-understanding/detect.md:31]. But block equality is the wrong check: the literal-naming `### Expected` block shows exactly 3 speckit warnings and exit 0 [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:87], while its `### Evidence` block additionally carries Node `ExperimentalWarning` lines, and the `### Pass / Fail` text explicitly reconciles the difference ("also contains Node ExperimentalWarning lines after the required 3 speckit warnings") [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:134]. The lightest expected-answer check can therefore extract and test the stated signals (count of warning lines, exit code, named flags) against the scenario's own command block, but the semantic question "is 3 the right phase count" remains execution-bound — that boundary should be stated in the spec, not engineered around.

## Questions Answered

- No new strategy key question; all five stay ticked from earlier iterations. This iteration discharges the widening mandate on the playbook side: the corpus census and link/inline split (F1), the unresolved taxonomy with the migrated-root fallback (F2), the canonical-case option check (F4), the expected-answer surface (F5), and one earlier iteration's measure re-verified and corrected (the code-line scan of F3).

## Questions Remaining

- None open. Synthesis residue additions for the implementation-ready spec: the playbook-side taxonomy (102 dead inline citations split 30 placeholder/glob, 30 historical provenance, 10 runtime/generated, 10 migrated-named, 22 other) with the "inline-only" scope for playbooks since links are already gated; the new live fixture at `spec-folder-literal-naming-create-sh-fallback.md:138`; the backtick-separated `file` line N` extractor case; the `--trace-warnings` false-positive fixture; and the Expected-excerpt vs Evidence-full consequence (assertion extraction, execution keeps the semantic tier).

## Next Focus

- Synthesis (iterations 9–10): fold the playbook-side evidence into the implementation-ready spec alongside iteration 7's catalog evidence. Open items for the authored spec: base-resolution order (repository root → `specs/*` fallback for `.opencode/specs` → skill-relative) with trailing-argument stripping; the expected-unresolved conventions (placeholder/glob, historical provenance, runtime/generated, migrated roots, annotated removals, unbuilt symlinks); anchor formats to cover (`path:line` tokens, inline backticked paths, and the single `` `file` line N`` prose form); the fixture set (scenario:138 wrong-line, `--trace-warnings` attribution, the catalog stale cluster and existence-scan regression from iteration 7); and the warn-only staging precedent before any gate hardens.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
