---
title: "069 -- Entity normalization consolidation"
description: "This scenario validates Entity normalization consolidation for `069`. It focuses on Confirm shared normalization path."
audited_post_018: true
version: 3.6.0.17
---

# 069 -- Entity normalization consolidation

## 1. OVERVIEW

This scenario validates Entity normalization consolidation for `069`. It focuses on Confirm shared normalization path.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm shared normalization path.
- Real user request: `Please validate Entity normalization consolidation against the documented validation surface and tell me whether the expected signals are present: Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence.`
- Prompt: `Validate entity normalization consolidation across extraction and linking.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if extractor and linker produce identical normalized entities for all test inputs including unicode

---

## 3. TEST EXECUTION

### Prompt

```
Validate entity normalization consolidation across extraction and linking.
```

### Commands

1. feed unicode entities
2. compare extractor/linker outputs
3. verify parity

### Expected

Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
node --import ../scripts/node_modules/tsx/dist/loader.mjs --input-type=module -e 'import { normalizeEntityName as extractorNormalize, extractEntities } from "./lib/extraction/entity-extractor.ts"; import { normalizeEntityName as linkerNormalize } from "./lib/search/entity-linker.ts"; const inputs = ["TF-IDF", "Café Déjà Vu", "São Paulo", "naïve Bayes", "München Straße", "東京 Graph", "GraphQL🚀 Pipeline", "Crème brûlée", "  Résumé   Parser  "]; console.log("sharedFunctionIdentity", extractorNormalize === linkerNormalize); console.log("input | extractorNormalize | linkerNormalize | parity"); for (const input of inputs) { const extractor = extractorNormalize(input); const linker = linkerNormalize(input); console.log(`${input} | ${extractor} | ${linker} | ${extractor === linker}`); } const content = "## Café Déjà Vu\nUsing naïve Bayes with São Paulo\n\"München Straße\"\nImplements GraphQL🚀 Pipeline\nUsing TF-IDF\n"; const extracted = extractEntities(content); console.log("extractEntities", JSON.stringify(extracted)); console.log("extractedNormalizedComparison", JSON.stringify(extracted.map((entity) => ({ text: entity.text, extractor: extractorNormalize(entity.text), linker: linkerNormalize(entity.text), parity: extractorNormalize(entity.text) === linkerNormalize(entity.text) }))));'
```

Output:

```text
sharedFunctionIdentity true
input | extractorNormalize | linkerNormalize | parity
TF-IDF | tf idf | tf idf | true
Café Déjà Vu | café déjà vu | café déjà vu | true
São Paulo | são paulo | são paulo | true
naïve Bayes | naïve bayes | naïve bayes | true
München Straße | münchen straße | münchen straße | true
東京 Graph | 東京 graph | 東京 graph | true
GraphQL🚀 Pipeline | graphql pipeline | graphql pipeline | true
Crème brûlée | crème brûlée | crème brûlée | true
  Résumé   Parser   | résumé parser | résumé parser | true
extractEntities [{"text":"Vu\nUsing","type":"proper_noun","frequency":1},{"text":"Pipeline\nUsing","type":"proper_noun","frequency":1},{"text":"na","type":"key_phrase","frequency":1},{"text":"S","type":"key_phrase","frequency":1},{"text":"GraphQL","type":"key_phrase","frequency":1},{"text":"TF-IDF","type":"key_phrase","frequency":1},{"text":"Café Déjà Vu","type":"heading","frequency":1},{"text":"München Straße","type":"quoted","frequency":1}]
extractedNormalizedComparison [{"text":"Vu\nUsing","extractor":"vu using","linker":"vu using","parity":true},{"text":"Pipeline\nUsing","extractor":"pipeline using","linker":"pipeline using","parity":true},{"text":"na","extractor":"na","linker":"na","parity":true},{"text":"S","extractor":"s","linker":"s","parity":true},{"text":"GraphQL","extractor":"graphql","linker":"graphql","parity":true},{"text":"TF-IDF","extractor":"tf idf","linker":"tf idf","parity":true},{"text":"Café Déjà Vu","extractor":"café déjà vu","linker":"café déjà vu","parity":true},{"text":"München Straße","extractor":"münchen straße","linker":"münchen straße","parity":true}]
```

Focused verification command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npx vitest run tests/entity-extractor.vitest.ts tests/entity-linker.vitest.ts
```

Output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  101 passed (101)
   Start at  13:02:18
   Duration  377ms (transform 95ms, setup 19ms, import 115ms, tests 38ms, environment 0ms)
```

### Pass / Fail

- **PASS**: extractor and linker use the same normalization function (`sharedFunctionIdentity true`), every side-by-side unicode input returned `parity true`, every extracted entity comparison returned `parity:true`, and the focused extractor/linker tests passed (`Test Files 2 passed (2)`, `Tests 101 passed (101)`).

### Failure Triage

Verify shared normalization function is used by both paths; check unicode handling; inspect normalization rules for edge cases

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory-quality-and-indexing/entity-normalization-consolidation.md](../../feature_catalog/memory-quality-and-indexing/entity-normalization-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 069
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory-quality-and-indexing/entity-normalization-consolidation.md`
