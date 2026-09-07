# Iteration 004 — Acceptance-criteria rules post-remediation (RQ4)

- Angle: AC_CLOSURE and AC_COVERAGE as they now stand, the enforce switch the 010 lane implemented, the marker rule's checked set, and a RECOUNTED repo-wide evidence census (round one's numbers are not reused).
- Verdict: AC_CLOSURE landed exactly as the summary claims (error severity; post-cutoff L2+ presence fail; completion-claim-only unmet blocking; ADR-backed waivers; phase/review/research exempt via `_acc_numeric_level`); AC_COVERAGE's enforce switch is real (fail branches :381-383, :394-396); ENV-REFERENCE + .env.example document both switches. What did not land: the lane that shipped the "cite file:line" rule wrote its own acceptance-criteria.md with ZERO file:line citations — its own analyzer will mark all six rows malformed and score 0/6, and the enforce switch (now implemented) would fail the very packet that documented it. Plus: the marker rule still does not check the default-scaffolded AC, and the coverage regex counts times and URL ports as evidence.
- Findings: 4 (1×P1, 3×P2). Tool calls: 7/12.

## Findings

### f-iter004-001 [P1] — the remediation lane's own acceptance-criteria.md carries zero file:line evidence
- THE CLAIM: the rule the 010 lane just rewrote requires "Cite file:line in the Verification cell of each criterion" (check-ac-coverage.sh:384-387, RULE_REMEDIATION) — and its own packet is the showcase.
- WHAT THE CODE DOES: `check-ac-coverage.sh:214-225` (`has_file_line`) counts a Met row covered only when the Verification cell matches `file:NN`; non-empty evidence without it is `malformed` (:234-238). Reading 010's own acceptance-criteria.md:22-28: AC-001 "smoke scaffolds listed goal.md with two directive anchors…" (no file:line), AC-002 "`spec-doc-structure.ts` no longer carries the hardcoded pair…" (no :NN), AC-003 "`template-version-parity.vitest.ts` passed after the five reconciliations" (no :NN), AC-004 "the checker reported 7,807 documents…" (no :NN), AC-005 "the two under-floor branches in `check-ac-coverage.sh` set the failing status…" (no :NN), AC-006 "residue search returned only historical notes…" (no :NN) — all six are evidence-malformed by the rule's own definition. Score under it: 0/6 covered, 6 malformed, advisory under floor (0.9 → required 6).
- WHY IT MATTERS: the new `SPECKIT_AC_COVERAGE_ENFORCE=true` branch (check-ac-coverage.sh:381-387) would FAIL the packet that added it; and the lane's verification table claimed validate.sh --strict PASSED, which is true only because the default is advisory — the enforcement story is untested against the lane's own artifact.
- SEVERITY: P1 (wrong-or-unused: the canonical evidence surface of the packet whose whole point was template/evidence alignment).
- RECOMMENDATION: fix — retro-cite the six rows with file:line (the implementation summary's own "Files Changed" table supplies them).

### f-iter004-002 [P2] — repo-wide census, recounted in this tree
- THE CLAIM (round one's f-iter004-004): "Met rows common but rarely file:line-cited (advisory-malformed, not covered)".
- COUNTED IN THIS TREE: 157 acceptance-criteria.md files under specs/; 138 contain at least one `| Met ` row; 31 of those 138 contain at least one file:line-style citation in some row (grep `\.(sh|ts|js|md):[0-9]`). = 22% of Met-bearing files carry any file:line; the modal row cites prose or a bare filename. The evidence-malformed class round one recorded persists and includes 011/012 lanes and 010 itself.
- SEVERITY: P2 (the floor is advisory today; with ENFORCE flipped the repo is ~78% failing).
- RECOMMENDATION: document — the enforced mode will light up the majority of the repo; the maintainer should treat the floor as aspirational until the malformed class is addressed (or lower the floor and raise it over time).

### f-iter004-003 [P2] — TEMPLATE_SOURCE checks only required docs; the default-scaffolded AC is invisible
- THE CLAIM: the marker rule's header says it checks "spec documents" for SPECKIT_TEMPLATE_SOURCE (check-template-source.sh:19-21) and reads "docs defined by the Level contract" (:52-55).
- WHAT THE CODE DOES: the contract's `docs` command returns requiredCoreDocs + requiredAddonDocs only (template-structure.js:190-194) — at L2/3/3+ that is spec.md, plan.md, tasks.md (requiredAddonDocs [] everywhere, spec-kit-docs.json:554,1049,1604). acceptance-criteria.md — scaffolded BY DEFAULT at L2/3/3+ (create.sh:460-465) and carrying a marker in its template (templates/addons/acceptance-criteria.md.tmpl) — is not in the checked set; neither is goal.md/decision-record.md/resource-map.md (all template-backed, all unchecked when present).
- SEVERITY: P2 (authoring-drift detection gap; the rule's purpose — "proves files were created from official templates, not from scratch" — silently excludes the one author-facing doc create.sh writes by default beyond the core triple).
- RECOMMENDATION: fix — include optionalAddonDocs and the flag-scaffoldable lazy docs in the marker rule's set (or document the scope: "required docs only").

### f-iter004-004 [P2] — has_file_line counts times and URL ports as evidence
- THE CLAIM: a Verification cell must cite "file:line".
- WHAT THE CODE DOES: `has_file_line` (check-ac-coverage.sh:215 in canonical, :262 in traceability) matches `(^|[[:space:](`])[^[:space:]|()`]+:[0-9]+(...)` — any token, colon, digit-run. A cell reading "Ran at 09:05" or citing `https://host:8080` matches and counts as COVERED; a timestamp "… at 2026-09-07 08:34" with the time at line end also matches. With ENFORCE on, a false positive flips a fail to a pass.
- SEVERITY: P2 (advisory today; the new enforce switch amplifies the misclassification).
- RECOMMENDATION: fix — require the pre-colon token to look like a path/identifier with a known extension or no digits-colon shape at the left of a field (e.g. exclude bare `HH:MM`).

## What worked
- Reading 010's own AC after the rule's analyzer gave the strongest single finding of the lane: the "showcase packet" approach works when the showcase is tested against the rule it shipped.

## Ruled out (this iteration)
- phase parents are subject to AC_CLOSURE despite never being scaffolded with AC: RULED OUT — `_acc_numeric_level` ("phase"→"") falls to 1 (check-ac-closure.sh:24-25, 245-249): "gate not active below Level 2"; phase-definitions.md:99 says heavy docs live in children, consistent.
- SPECKIT_AC_COVERAGE_ENFORCE documented but unconsumed (round one's f-iter005-004 fixed?): RULED OUT — the fail branch is real and ENV-REFERENCE.md:166-168 + .env.example:137 document it; the fix landed.
- ENV-REFERENCE omits the closure flags: RULED OUT — SPECKIT_AC_CLOSURE (:169) and CUTOFF (:170) are documented.

## Carried questions
- CQ-006: the traceability fallback (tasks.md) — with phase children at Level 1, tasks.md has no verification section (create.sh:35-40 comment) — does AC_COVERAGE level/lifecycle gating spare them? (harmless; note for synthesis).
