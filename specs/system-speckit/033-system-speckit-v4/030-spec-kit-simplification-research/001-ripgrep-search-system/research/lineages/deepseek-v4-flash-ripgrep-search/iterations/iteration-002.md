# Iteration 002 — Remediation verification, code/data-side residue

**Focus:** Verify the 006 code/data fixes landed completely: EXCLUSIONS record (REQ-003), committed pair regenerated (REQ-004), doctor committed-pair signal (REQ-005), retrofit import repointing (REQ-006), README test invocation validity (REQ-007), and the parity suite's new assertions. Recount every artifact state in this tree.

**Method:** Python census of `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, `semantic-probes.json`, `latency-report.json`; grep of `corpus.mjs` exclusion constants vs test assertions; inventory of the committed-pair comparison surface in the doctor YAML.

## Findings

### V5 — COMMITTED PAIR VERIFIED: INDEX AND MANIFEST CARRY THE SAME HASH (fix landed, positive)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json:2` (manifestHash) = `runtime/cli/retrieval/fixtures/corpus-manifest.json` manifestHash = `4baf2dbd19314a2e780841a3a972d40fc0b99cad6c51093472f5ded79e1235a1`; `generate-trigger-index.mjs:218` writes the pair from one build
- **Claimed vs actual:** REQ-004 requires the committed pair to match after regeneration. Actual: equal (compared by Python read of both files — no node tooling).
- **Severity:** verified-positive; record only.

### V6 — DOCTOR COMMITTED-PAIR CHECK PRESENT AND CHEAP (fix landed, positive)

- **Path:line:** `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:60-63` (signal definition, "Costs one JSON read per file and no corpus walk") and phase_0 activity at `:101` ("compare the manifestHash field of ... trigger-index.json with ... corpus-manifest.json")
- **Claimed vs actual:** L1/L6's shared vehicle landed: the signal exists AND the activity that fires it exists (round one's L6 correction said "the signal exists, the activity did not" — now both do).
- **Severity:** verified-positive; record only.

### V7 — RETROFIT RELOCATION CLOSED EVERY IMPORT AND TEST (fix landed, positive)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs` (whole); imports repointed — `ops/README.md:31` ("It imports `../retrieval/lib/` and `../retrieval/rg-wrapper.mjs`"), `lib/README.md:23,44-49` (consumer table lists `../ops/retrofit-convention.mjs`), `tests/retrieval-coverage-parity.vitest.ts:12`, `tests/retrofit-convention-pipeline.vitest.ts:21`, `grep-convention.md:42,412`
- **Claimed vs actual:** REQ-006 ("no document or import names the old path") — zero residue of `retrieval/retrofit-convention` outside `specs/` (grep). Every reference found names the ops path.
- **Severity:** verified-positive; record only.

### V8 — MANIFEST EXCLUSION RECORD: THE DERIVATION SHORTLIST ITEM WAS NOT EXECUTED; A TEST GUARDS IT INSTEAD (P2, carried shortlist)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:38-45` (EXCLUSIONS literal list) vs `:73` (EXCLUDED_DIR_NAMES Set) vs `:82` (FIXTURE_DIR_PATTERN); test `runtime/cli/tests/retrieval-coverage-parity.vitest.ts:222-229` ('manifest exclusion record')
- **Claimed vs actual:** Round-one shortlist item 6 ("Derive `EXCLUSIONS` from `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN`") was not executed — `EXCLUSIONS` remains a hand-maintained literal list with prose-glob rows (`**/{fixtures,__fixtures__,test-fixtures,*-fixtures}/** outside specs/` where "outside specs/" is annotation, not glob syntax). The production risk is now bounded: the parity test asserts `EXCLUDED_DIR_NAMES ⊆ EXCLUSIONS` (name or `**/name/**` form), so a future pruned-name without a row fails. What is still unguarded: an EXCLUSIONS row that NAMES a policy the walker never applies (see V9) and the scoped rules' rows (lineages/fixtures), which the test does not check.
- **Severity:** P2 — documented tradeoff (comment at :30-36 explains the record-keeping intent); not a regression.
- **Recommendation:** If derivation is wanted, generate `exclusions` into the manifest from the two policy constants and keep only the prose rows as commentary; otherwise leave as guarded.

### V9 — `**/tests/fixtures/**` EXCLUSIONS ROW IS REDUNDANT AND UNDOCUMENTED (P2)

- **Path:line:** `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:44`; policy `:80-83, :133`; conventions §9 exclusion table (`retrieval-conventions.md:286-305`)
- **Claimed vs actual:** The row reads as its own policy, but `FIXTURE_DIR_PATTERN` (line 82) already matches the directory name `fixtures` anywhere, and `isExcludedDirectory` (line 133) prunes it outside `specs/` — `tests/fixtures` is pruned by the same rule as any other `fixtures` dir. The conventions §9 table names the fixture-names row but has no `tests/fixtures` row, so the manifest records a rule no document names and no code implements separately.
- **Severity:** P2 — manifest identity includes a redundant string; a reader tracing EXCLUSIONS entries to §9 rows finds no entry for this one.
- **Recommendation:** (a) drop the row, or (b) add a §9 row / fold it into the fixture-names row's sentence.

### V10 — TWO OF FOUR GENERATED ARTIFACTS ARE OUTSIDE THE PAIR CHECK (P2)

- **Path:line:** generate-trigger-index.mjs:254-270 publishes FOUR artifacts (index, manifest, diagnostics, variants), all carrying `manifestHash`; doctor pair check covers index+manifest only (yaml:60-63, :101); `AGENTS.md:477` says "commit the regenerated index and manifest together"
- **Claimed vs actual:** The one committed-pair verifier (and the root-doc maintenance row) name two files. `generation-diagnostics.json` and `phrase-variants.json` each carry `manifestHash` (verified: both present in this tree's files), so a commit carrying fresh index+manifest but stale diagnostics/variants would be invisible to the doctor.
- **Severity:** P2 — variants has no runtime reader (impact low), diagnostics is read by the generator's own refusal reporting only; but the check could be three reads, not two.
- **Recommendation:** Extend the doctor's activity to compare diagnostics/variants manifestHash (three JSON reads, still no corpus walk), and name the four artifacts — or all four — in the AGENTS.md maintenance row.

## Ruled out this pass

- Manifest/diagnostics inconsistency: `generation-diagnostics.json` documentsScanned=28,562 == manifest includedPathCount=28,562; counts sum (ok 13,618 + missing-frontmatter 6,939 + valid-empty-list 7,942 + duplicate-phrase 62 + non-yaml-frontmatter 1 = 28,562); malformedDocuments=0 with ignoredMalformedDocuments=1 — the single non-yaml doc is the documented IGNORED_PATHS transcript (corpus.mjs:59-66, reason 'captured model transcript' — file exists at the listed path). No inconsistency found.

## Open questions

1. Should the doctor's pair check cover all four artifacts, or is index+manifest the intended scope with diagnostics/variants treated as acceptance-only too?
