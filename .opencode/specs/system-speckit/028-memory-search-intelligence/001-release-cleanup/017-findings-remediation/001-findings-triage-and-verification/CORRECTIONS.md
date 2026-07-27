# Triage corrections — verifier errors caught on spot-check

Three dispositions in the composer-set lane were produced from a corrupted worklist and are
corrected here. Root cause was ours, not the model's: the parser that normalized the manual
findings used a `**Path:**` regex that did not match pass-03's `- **Path:** ...` list formatting,
so all 12 pass-03 findings reached the verifier with an empty path. The verifier guessed
`.opencode/skills/` when every one of them lives under `.opencode/commands/`.

The parser is fixed and all 12 paths are repaired in `research/devin-findings.json`.

| Finding | Lane said | Corrected | Evidence |
|---------|-----------|-----------|----------|
| `devin-03:F1` | REFUTED — "no `.DS_Store` anywhere" | **REFUTED** (right answer, wrong evidence) | `.opencode/commands/.DS_Store` exists but `git ls-files` does not track it. The claim said *committed*; it is not. 28 untracked `.DS_Store` files exist repo-wide. |
| `devin-03:F9` | REFUTED — "no such directory under any skill" | **NOT REFUTED** | `.opencode/commands/create/assets/tests/` exists with `test_emitted_name_contract.py` and `fixtures/`. Referenced in 9 files, so the "no reachable runner" half still needs its own check. |
| `devin-03:F10` | REFUTED — "no such directory under any skill" | **NOT REFUTED** | `.opencode/commands/doctor/scripts/tests/` exists with `parent-skill-check-leaf-manifest.test.cjs`. |

## Why this matters more than the numbers

A false refutation is more dangerous than a false positive. A false positive gets caught downstream
when someone tries to act on it; a false refutation silently deletes a real finding from the record
and nothing ever looks at it again.

The error class is identical to the one that produced the audit's original false positives: a
reachability or existence search scoped to the wrong root. It has now appeared in the discovery
layer and in the verification layer. Any future verification pass must state the search root it
used, so a wrong root is visible in the evidence rather than hidden behind a verdict.

## Outstanding

Nine of the 45 findings in the `sol` lane share the same empty-path defect (`devin-03` F2-F8,
F11, F12, all CAT-1 or CAT-5). Their dispositions must be re-checked against the repaired paths
when that lane returns.
