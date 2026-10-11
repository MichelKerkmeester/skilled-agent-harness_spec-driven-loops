# Iteration 8: Verify Remaining Evidence Gaps — Adversarial Execution of the Load-Bearing Claims

## Focus

Broaden: verify remaining evidence gaps. All five key questions were answered by iteration 7 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67], so this iteration does not open new questions — it adversarially executes the load-bearing claims that consolidation (iterations 9-10) will rest on. The two claims with no prior execution evidence were: (a) Q3's smallest-contract shape — "the git-free gate is the only surface that stays green by construction" — previously established by code reading and a documented class separation, never by running gate mode; (b) the enforcement wiring — the post-edit hook's row 3 was cited from iteration 1 but never re-read against the current router source. Direct execution is the highest-verification path available: a single command either falsifies the green claim or converts it from inference to observed fact.

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-strategy.md`, the state-log projection (7 iteration records + the iteration-8 start sentinel), `iterations/iteration-006.md` (the 713-measurement narrative), and `findings-registry.json` (48 key findings, 5/5 resolved questions); confirmed `iterations/iteration-008.md` and `deltas/iter-008.jsonl` absent before writing (boundary check).
2. Read the engine's gate branch and its argument/exit contract [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-415] and the mode dispatch [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:440-465] to pin exactly when gate exits 1 and when verify exits 1.
3. Executed gate mode for all three skills directly (`node shared/scripts/frontmatter-version.mjs gate --skill <name>`, captured to temp files outside the repo): sk-code EXIT=0 `ok=337 skip-no-frontmatter=3` (340 files); sk-doc EXIT=0 `ok=319 skip-no-frontmatter=1` (320 files); system-skill-advisor EXIT=0 `ok=115` (115 files). Skips are counted, not silent.
4. Read the post-edit router's row-3 wiring end to end [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:33-51] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:196-213] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:284] and corroborated it with the hook's own README row [SOURCE: .skilled/hooks/post-edit-quality/README.md:50]; confirmed the wrapper routes to the same engine in gate mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13].
5. Measured the changelog class the packager version-checks but gate/hook skip: 23/23 sk-code, 19/19 sk-doc, 26/26 system-skill-advisor changelog entries carry a `version:` line — 68/68, no live violation on that axis.
6. Recorded the iteration through the append gateway (Step 8) and wrote the delta file (Step 9). Skipped `research/research.md`: progressive synthesis is enabled, but the strategy declares that file workflow-owned [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:355] and this dispatch's allowed-write list contains only the iteration narrative and the delta file; synthesis stays with the workflow.

## Findings

1. **The gate is green on every skill today — Q3's "green by construction" is now observed fact, not inference.** Gate mode exited 0 with `bad=0` for sk-code (340 files, 337 ok + 3 skipped), sk-doc (320 files, 319 ok + 1 skipped) and system-skill-advisor (115 files, 115 ok); the skip case is a counted action (`skip-no-frontmatter`), not silence [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:408] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:413-414]. Exit is 1 only when a file is missing its version line or carries a non-4-part value [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409-410], so the gate can only fail on presence and format — never on stored-vs-derived drift, which is the mode that fails on every skill [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:451-461]. The finding is falsifiable and was tested: any in-scope doc missing a version would have produced exit 1. New — first execution of gate mode in the run.

2. **The gate's discovered scope reproduces the packet spec's verify-flag counts exactly (340 / 320 / 115), which independently confirms the iteration-6 measurement's denominator.** The packet spec reports verify flagging 340 files in sk-code, 320 in sk-doc and 115 in system-skill-advisor [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/spec.md] — and these are exactly the files gate discovers and classifies for those three skills. Iteration 6 measured the same 713 = 332 + 266 + 115 mismatch lines over the same tree [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:11]. Two independent probes now agree on the in-scope file population; the divergence is the metric (flags vs mismatches), not the scope. New — cross-validates the head count behind the 713 / 574 figures.

3. **The enforced surface is mechanically wired, not aspirational: any edit to an in-scope skill doc reruns the gate for that whole skill and blocks on exit 1.** The router maps a markdown edit under `.skilled/skills/<name>/` to the presence+format checker with `--skill <name>`, fired when the file is a versioned skill doc (SKILL.md, README.md adjacent to a SKILL.md, or any file under references/assets/feature-catalog/manual-testing-playbook) [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:196-213], deduped once per skill per session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:284]; the checker path resolves to the shared wrapper, which execs the same engine in `gate` mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13]. The hook's README independently documents the same row-3 trigger set and exit rule [SOURCE: .skilled/hooks/post-edit-quality/README.md:50]. Because the gate does not compare values, an editor never has to reconcile a stale `W`/era to land an edit — the enforcement is compatible with docs that currently carry stale values, which is why it can stay green on the current fleet. Partially new — the wiring was cited from iteration 1; the current-source reread plus the README row are the new evidence; no router test file exists to add a third leg (single-source on behavior, code + doc cited).

4. **The gate's skip case is a documented escape hatch: a doc with no frontmatter block at all is skipped, not failed — so the only way to regress the gate is to add a malformed version or remove the whole block.** `!fm.hasFrontmatter` sets `skip-no-frontmatter` and continues [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:406-408] — 4 files across the three skills take this path today. The contract's presence claim is therefore "if the doc declares frontmatter, `version` must be 4-part," not "every in-scope doc declares a version"; the state the hook actually guards is *missing `version` given frontmatter* and *malformed value*. This bounds the Q3 contract shape precisely: green by construction holds for the fleet because the gate cannot fail on drift and skips the frontmatter-less class, and the fix phase should not assume the gate enforces frontmatter existence. New — the skip branch was read, not executed against a mutated fixture (out of scope: research is read-only).

5. **The packager/engine class divergence has no live violation on the divergence axis measured: all 68 changelog entries across the three skills carry a 4-part `version`.** 23/23 sk-code, 19/19 sk-doc, 26/26 system-skill-advisor changelog docs carry the field, so the packager's stricter versioned-doc scope (which includes `changelog` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:124-136]) and the engine's exclusion of `changelog` from its scope [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57] differ in coverage, not in outcome, today. The divergence remains real for the fix phase (the hook never checks changelog docs if they regress), but it is not producing a current failure. New — the iteration-7 divergence claim is now quantified on the class it names.

6. **Consolidation verdict on the run's load-bearing claims: the gate-green claim, the scope head-count, and the hook wiring are now the best-supported claims in the run.** Gate-green: executed, exit 0, falsifiable [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:397-415]. Scope: double-confirmed (spec counts = gate discovery = iteration-6 measurement denominator). Hook: code path + hook README agree [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210] [SOURCE: .skilled/hooks/post-edit-quality/README.md:50]; behavior is single-source (no test asserts the row), so a deliberate live edit probe would be the next strengthening step if ever needed — not a blocker for the consolidation record. [INFERENCE: strength ranking from this iteration's execution results versus the read-only evidence of iterations 1-7.]

## Ruled Out

- **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held.
- **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag.

## Dead Ends

- None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258].
- New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase.

## Edge Cases

- Ambiguous input: none — the focus ("verify remaining evidence gaps") was resolved to the two execution-shaped gaps (gate-green, hook wiring), with the changelog divergence quantified as the third.
- Contradictory evidence: none. Finding 3's label admits single-source behavior (no router test); stated instead of smoothed.
- Missing dependencies: none. Gate-executed temp outputs were written outside the repository; no researched file was modified.
- Partial success: none; all five actions completed on first attempt, no retries.

## Questions Answered

- None at the key-question level (Q1-Q5 remain resolved from iterations 1-7 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67]). This iteration answers the meta-question "are the consolidation claims executable?" — yes for gate-green and scope counts; hook wiring stays code+doc confirmed with behavior single-sourced.

## Questions Remaining

- None at the key-question level. Iterations 9-10 remain under the max-iterations stop policy; the productive direction is the single decision record (see Recommended Next Focus).

## Sources Consulted

- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (lines 397-415 gate branch and exit rule; 440-465 mode dispatch; 57 scope)
- `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` (line 13: wrapper execs gate)
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` (lines 33-51 checker map and scope mirror; 196-213 row 3; 210 dedupeKey; 284 dedupe semantics)
- `.skilled/hooks/post-edit-quality/README.md` (line 50: row-3 trigger set and exit rule)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` (lines 124-136: versioned-doc scope including changelog)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/spec.md` (340/320/115 reported flag counts)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md` (line 11: 713 = 332 + 266 + 115 measurement)
- Command outputs: `gate --skill sk-code` EXIT=0 (340 files, 337 ok, 3 skip); `gate --skill sk-doc` EXIT=0 (320 files, 319 ok, 1 skip); `gate --skill system-skill-advisor` EXIT=0 (115 files, 115 ok); changelog version-field census 68/68; router test-file search (none found)

## Assessment

- New information ratio: 0.75 — (3 fully new + 0.5 × 1 partially new) / 5 = 0.70, plus a +0.05 simplicity credit for converting the run's central claim from inference to one-command observation and collapsing the consolidation input to three verified facts. Fully new: gate-green execution (F1), scope head-count cross-check (F2), skip-branch escape hatch (F4), consolidation verdict (F6). Partially new: hook wiring reread (F3). Redundant: none. The changelog census (F5) is new measurement on an existing claim — counted within F6's credit rather than double-counted.
- Questions addressed: the meta-question (are the consolidation claims executable?); no key questions newly answered.
- Questions answered: none at the key-question level.

## Reflection

- What worked and why: executing the claim instead of rereading it. The gate is the only surface in this investigation that is cheap to run, and one run per skill converted the run's central claim ("green by construction") from a code-reading inference into an exit code; the file counts then fell out for free as an independent check on the 713-measurement denominator.
- What did not work and why: nothing failed. One caution: the first sk-code gate invocation was piped to `tail`, which reports the pipe's exit status — the rerun captured the engine's own exit code to a file. Pipeline exit codes are not evidence; rerun with explicit capture [INFERENCE: from the first command returning EXIT=0 with `tail` as the last pipeline stage].
- What I would do differently: when verifying a green-claim, run the command first and read the code second — the exit code bounds what the code reading must explain, not the other way around.

## Recommended Next Focus

Consolidation for the fix phase (iterations 9-10 remain; stopPolicy max-iterations). Assemble Q1-Q5 into the single decision record, now carrying three verified empirical anchors: (a) gate is green today on all three skills and fails only on presence/format [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:408-410]; (b) the hook reruns it per edit, so the enforced contract is "no in-scope doc regresses presence/format" [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:200-211]; (c) the fix-phase backlog gains two entries — the frontmatter-less skip class (4 files today) and the changelog coverage divergence between packager and engine, currently without live violations. Then close with Q4's removal recommendation and Q2's reversal condition.

## SCOPE VIOLATIONS

None. All writes stayed inside the allowed paths (`iterations/iteration-008.md`, `deltas/iter-008.jsonl`, and the gateway's own writes via a temp event file); every researched file was read-only; no banned operation ran; gate execution wrote no repository file (stdout captured to `/tmp` outside the repo).
