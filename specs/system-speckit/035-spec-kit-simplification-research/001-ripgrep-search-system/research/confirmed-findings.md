---
title: "Confirmed findings: ripgrep search system"
description: "Every P1 and P2 row from the GLM 5.3 Flash research synthesis, reproduced or dropped in the main checkout, with the evidence observed and the remediation it was handed to."
trigger_phrases:
  - "ripgrep search system confirmed findings"
  - "retrieval drift reproduction"
  - "trigger index committed pair"
  - "retrofit convention relocation"
importance_tier: "important"
contextType: "research"
---
# Confirmed findings: ripgrep search system

Source: `lineages/glm-5-3-flash-ripgrep-search/research.md` (10 of 10 iterations, stop reason `maxIterationsReached`). Every row below was re-checked in the main checkout on 2026-09-06 before the remediation child `006-retrieval-drift-remediation` was opened. A row is **Confirmed** only when the cited line or the observed behavior was seen here; a row is **Dropped** when the check contradicted the claim.

---

## 1. P1 ROWS

| ID | Claim | Reproduction in this session | Disposition |
|----|-------|------------------------------|-------------|
| L1 | Four inconsistent corpus snapshots coexist; no whole-corpus verifier; doctor never compares hashes | At HEAD the index and `fixtures/corpus-manifest.json` agreed with each other but a fresh build differed by one path (`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/goal.md`), so the committed pair lagged the corpus. `latency-report.json` and `semantic-probes.json` pin manifest hash `c0806077…`, a snapshot no committed artifact carries. `doctor-speckit-retrieval.yaml` phase 0 read only presence, mtime and size. | Confirmed. Fixed in 006: doctor gained the O(1) committed-pair comparison and a `committed_pair_mismatch` signal; the retrieval README marks the five pinned fixtures as frozen acceptance evidence; the root document's maintenance row names the doctor as the verifier; the index and manifest were regenerated together. |
| L2 | A single-token phrase can only match by exact equality and the conventions do not say so | `lib/normalize.mjs` documents the size guard in the `scorePhrase` comment; `retrieval-conventions.md` section 8 had no mention. | Confirmed. Fixed in 006: section 8 now tells authors to declare two-token phrases and why. |
| L3 | The conventions describe a concept lane over an embedded index that does not exist | Lines 10, 33, 40 and 44 of `retrieval-conventions.md` named three lanes, concept search and "both index artifacts"; no embedded index exists anywhere under the skill. | Confirmed. Fixed in 006: two lanes, no concept lane, availability note names the generator. |
| L4 | The router's inline recipe omits `--hidden` and two globs and counts "two exclusion globs" | `search.md` line 27 said "the two exclusion globs"; its recipe at lines 99 to 101 lacked `--hidden`, `!**/.git/**` and `!**/scratch/**` while section 2.1 of the conventions carries all of them. | Confirmed. Fixed in 006: recipe made identical to section 2.1, count corrected. |
| L5 | Gate 1 has no mechanical executor; the hook-system table pairs the lookup with hook surfaces | No hook, adapter or plugin runs the lookup, which is true. The hook-system table's column is titled **Manual fallback**, so it records the lookup as the manual step, not as a hook. Gate 1 in the root document instructs the model to run it. | Dropped. The behavior is the documented design; nothing contradicts it. |
| L6 | The doctor staleness probe never checks manifest-hash consistency | The workflow declares a `manifest_hash_mismatch` signal that needs a fresh build, but no activity compares the committed index hash with the committed manifest hash, which is the cheap check that would have caught L1. | Confirmed with a correction: the signal exists, the activity did not. Fixed in 006 with L1. |
| L7 | `measure-cold-lookup.mjs` has no recurring caller | Only its own file, the two READMEs and one feature-catalog entry name it. | Confirmed. Fixed in 006: documented as acceptance-only and offered as an optional doctor activity that writes to packet scratch. |
| L8 | `retrofit-convention.mjs` is a completed one-time migration occupying the hot retrieval directory | 48,339 bytes; referenced by two tests, the two READMEs and `grep-convention.md`; the retrofit it performed closed with the memory decommission. | Confirmed. Fixed in 006: moved to `runtime/cli/ops/` with its imports repointed, both tests and every document updated. |
| L9 | Four fixtures have no runtime reader and `promptSetHash` is a dormant slot | `semantic-probes.json`, `recipe-execution.json` and `daemon-off-proof.json` have no reader outside `fixtures/`; `prompt-set.json` is read only by the trigger-index test; the generator writes `promptSetHash: null` with a comment reserving it. | Confirmed. Fixed in 006 by documentation: the README names the frozen set and the reserved slot. The slot stays because removing it changes every manifest hash for no reader. |

---

## 2. P2 ROWS

| Finding | Reproduction | Disposition |
|---------|--------------|-------------|
| `EXCLUSIONS` omits `dist` while `EXCLUDED_DIR_NAMES` prunes it | `lib/corpus.mjs` lines 32 to 40 versus line 78; the manifest recorded a policy the walker no longer applied. | Fixed: `**/dist/**` added, comment states the list is manifest identity, parity suite asserts every pruned name is recorded. The parity suite was already failing on `dist`; it now declares `dist` as the index-only divergence. |
| Section 9 lacks `dist` and the `.opencode/specs` alias rows | Both absent; the alias is a symlink and `canonicalRelativePath` folds it. | Fixed: two rows added. |
| Three match-class vocabularies | Presentation asset listed three labels, conventions section 5 described three prose classes, `lib/normalize.mjs` emits five. | Fixed: both documents now list the five labels in rank order. |
| README validation commands are broken as written | Both READMEs invoked `npx --prefix scripts` over `scripts/tests/…`, a directory that no longer exists. Working invocation verified: from `runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/…` (48 of 48 in the trigger-index suite). | Fixed in both READMEs, determinism check paths corrected. |
| `--limit 0` means unlimited and is undocumented | `lookup-trigger-index.mjs` line 200 to 201. | Fixed: header comment states it. |
| `sweep-memory-residue.mjs` is one-shot acceptance | No caller outside tests and docs. | Fixed: README row says so. |
| Zero-score `partial` tail fills listings; context agent reads the 3.8 MB index; router could pass `--no-index-hash`; `--triggers` is a router-only flag | All observed as described. | No change, recorded: the tail is the documented `partial` class and the presentation asset forbids re-sorting; the context agent has Bash denied so a file read is its only route; the presentation asset prints `indexHash`, so the hash stays; `--triggers` is documented in the router's own lane table. |
| Latency target prose says under 50 ms | No document under the skill or the command carries that figure. | Dropped: not reproduced. |

---

## 3. REPO RULE VERDICT

No retrieval repo rule. Gate 5 loads a rule on the first write of a session, while Gate 1 fires on every prompt, so a rule cannot carry the lookup instruction. The root document's footprint for retrieval is five lines: the Gate 1 step, the mandatory-tools row, the research entry point, the trigger-index maintenance row and the doctor row. None would move to a rule without losing the per-prompt trigger. The real duplication is that `CLAUDE.md` is a symlink to `AGENTS.md`, which is already zero-cost.

---

## 4. OPEN QUESTIONS CARRIED

1. Whether a parity consumer will ever pin `promptSetHash`; until one lands the slot is documented and inert.
2. Who owns whole-corpus regeneration between releases; the doctor now detects a split pair, the root document names the generator, and the program's own closeout regenerates the index.

---

## 6. ROUND TWO (DeepSeek V4 Flash max through DevPass, 10 iterations on the remediated tree)

Source: `lineages/deepseek-v4-flash-ripgrep-search/research.md`, stop reason `maxIterationsReached`, 8 P1 and 12 P2 rows plus 11 verified-positive and 5 re-verified decisions. Censused in the main checkout on 2026-09-07 before child `013-trigger-phrase-quality-enforcement` was opened.

### Verdict held

Child 006 landed its own scope: the committed pair matches, the concept-lane contradiction is gone, the router recipe is byte-identical to conventions §2.1, the retrofit relocation left no residue, and the doctor's pair signal exists. Every one of the eleven verified-positive rows was re-read and holds.

### P1 rows

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| V1 | The search presentation's §3 still maps `matchClass` to three labels the code never emits | `search-presentation.txt:106` said `exact`, `containment`, `token-coverage`; `normalize.mjs` and `rg-lane.mjs` emit five | Confirmed. Fixed: the five labels verbatim, and the filled example re-rendered |
| V2 | §3 documents two evidence-field names that do not exist and omits two that do | `rg-lane.mjs:69-72` emits `trigger_phrases`, `title-or-description`, `anchor-marker`, `body` | Confirmed. Fixed |
| N1 | The committed index holds hundreds of single-token phrases the convention bans | 352 single-token keys, 2,245 postings, 826 owning documents; 42 numeric-only keys among them | Confirmed. Fixed at the enforcement seam: the judge gains `single-token` and `numeric-only` classes, the generator counts every class in a `phraseQuality` bucket, and the residue sweep is now a documented owner task rather than a silent condition |
| N2 | 175 documents own a phrase from the convention's own warn list | 175, re-counted | Confirmed. The class already existed; it is now counted at generation time and read by the doctor |
| N3 | Sweep-produced fragments such as `ation` and `tion` pass every check | All eleven named fragments present as index keys | Confirmed. Caught by the `single-token` class |
| N4 | The shared judge has no class for single-token, numeric or fragment phrases | `judgeTriggerPhrase` had generic, fallback, stop-word, prose and folder-token classes only | Confirmed. Fixed; the judge moved to `lib/phrase-judge.mjs` so the generator can import it without the retrofit machinery |
| N5 | The doctor's `corpus_pollution` screen can only see five stale samples | `doctor-speckit-retrieval.yaml` screened sampled phrases inside the staleness pass | Confirmed. Fixed: the doctor reads the `phraseQuality` bucket of the committed diagnostics, independent of staleness; severity moved to medium because the phrases never rank |
| N7 | 164 repo-rules trigger phrases are unreachable by Gate 1 and §9 is silent about it | 9 files, 164 phrases; `CORPUS_ROOTS` has no repo-rules root | Confirmed as a documentation gap. Recorded decision: rule documents are loaded at Gate 5 through the trigger table, not retrieved at Gate 1, so they stay out of the index; §9 gains the row |

### P2 rows

| ID | Claim | Disposition |
|----|-------|-------------|
| V3 | The README diagram still draws the retrofit box and counts six scripts | Fixed: the box names `../ops/`, the count is five |
| V4 | Three documents count the recipes differently | Fixed: the README says three of the four documented recipes, naming the one composed by hand |
| V8 | `EXCLUSIONS` provenance is not derived | Recorded; the parity test guards the drift, which is the reason round one gave |
| V9 | The `**/tests/fixtures/**` row is undocumented in §9 | Fixed: the exclusion table gains the row and its reason |
| V10 | The doctor's pair check covers two of four generated artifacts | Fixed: the check compares all four `manifestHash` fields; `AGENTS.md` is the shared framework document and was not edited |
| N6 | Diagnostics carry no phrase-quality counts | Fixed by the bucket |
| N9, N10 | The lookup's three-character floor and eight-token cap are undocumented | Fixed: documented in §8 and the README |
| N11 | Save-path freshness wording is advisory | Recorded; the gate lives in the runtime tests as round one found |
| V13 | `phrase-variants.json` is published by default with no reader | Recorded decision: kept as the operator's trace of raw spellings, documented in the README and tested |
| V17 | Gate 1 hashes the index on every lookup unless told not to | Recorded; round one's kept decision confirmed |

### Re-verified decisions

L5 and L1 hold. L9's new nuance, that `semantic-probes.json` already pins a prompt-set hash the manifest slot was reserved for, is recorded; the slot stays because landing the value leaves the manifest hash stable. F6.2's source was not located in the main checkout either; recorded as unverifiable. Two round-one findings were worktree artifacts, as round two itself reports.

The corpus itself is not cleaned here: 826 documents across dozens of packets own single-token phrases, most of them authored by a repo-wide frontmatter sweep. That is a content decision for the packets' owners, now visible in every generator run and every doctor pass.
