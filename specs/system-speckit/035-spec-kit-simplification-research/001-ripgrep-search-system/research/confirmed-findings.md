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
