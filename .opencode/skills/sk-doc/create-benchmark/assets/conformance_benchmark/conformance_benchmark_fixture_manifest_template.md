---
title: "Conformance Benchmark Fixture-Manifest Template"
description: "Fillable scaffold for one conformance benchmark fixture-manifest.json — parseable oracle provenance, an explicit production-adapter import prohibition, clean-control identity, public and held-out fixture classes, hashes, mutations, and expected findings."
trigger_phrases:
  - "conformance benchmark fixture manifest template"
  - "fixture-manifest.json scaffold"
  - "independent oracle fixture manifest"
  - "held-out conformance fixtures"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE conformance-benchmark FIXTURE MANIFEST:
  <deep-loop-mode>/assets/conformance_benchmark/<benchmark-id>/fixtures/fixture-manifest.json

Usage:
  1. Copy ONLY the fenced json object below into the shipped
     fixtures/fixture-manifest.json. Shipped JSON carries no frontmatter,
     guidance prose, or comments.
  2. Fill every {{PLACEHOLDER}}, keep productionAdapterImportProhibited true,
     and add one fixtures[] object per on-disk fixture.
  3. Keep at least one clean control with no mutations and no expected findings,
     one public calibration fixture, and one held-out fixture.
  4. Derive expected findings from the independent oracle before production
     adapter implementation. The production adapter must not import or invoke it.
  5. Parse the shipped file as JSON and verify every recorded hash before use.
-->

## 1. OVERVIEW

The fenced block is the complete shipped `fixture-manifest.json`. It records stable
fixture inputs and oracle-derived expectations; it does not contain oracle or
adapter implementation logic.

## 2. FIXTURE MANIFEST

```json
{
  "schemaVersion": "{{SCHEMA_VERSION}}",
  "benchmarkId": "{{BENCHMARK_ID}}",
  "oracleProvenance": {
    "oracleId": "{{ORACLE_ID}}",
    "implementationPath": "{{ORACLE_IMPLEMENTATION_PATH}}",
    "versionOrCommit": "{{ORACLE_VERSION_OR_COMMIT}}",
    "verificationCommand": "{{ORACLE_VERIFICATION_COMMAND}}",
    "verifiedAt": "{{ORACLE_VERIFIED_AT_ISO_8601}}",
    "evidencePath": "{{ORACLE_PROVENANCE_EVIDENCE_PATH}}"
  },
  "productionAdapterImportProhibited": true,
  "cleanControlFixtureId": "{{CLEAN_CONTROL_FIXTURE_ID}}",
  "fixtureRoot": "{{REPO_RELATIVE_FIXTURE_ROOT}}",
  "fixtureRootHash": {
    "algorithm": "sha256",
    "value": "{{FIXTURE_ROOT_SHA256}}"
  },
  "fixtures": [
    {
      "id": "{{CLEAN_CONTROL_FIXTURE_ID}}",
      "classification": "public",
      "path": "{{CLEAN_CONTROL_FIXTURE_PATH}}",
      "hash": {
        "algorithm": "sha256",
        "value": "{{CLEAN_CONTROL_FIXTURE_SHA256}}"
      },
      "mutations": [],
      "expectedFindings": []
    },
    {
      "id": "{{PUBLIC_FIXTURE_ID}}",
      "classification": "public",
      "path": "{{PUBLIC_FIXTURE_PATH}}",
      "hash": {
        "algorithm": "sha256",
        "value": "{{PUBLIC_FIXTURE_SHA256}}"
      },
      "mutations": [
        {
          "id": "{{PUBLIC_MUTATION_ID}}",
          "operation": "{{PUBLIC_MUTATION_OPERATION}}",
          "target": "{{PUBLIC_MUTATION_TARGET}}",
          "description": "{{PUBLIC_MUTATION_DESCRIPTION}}"
        }
      ],
      "expectedFindings": [
        {
          "code": "{{PUBLIC_EXPECTED_FINDING_CODE}}",
          "severity": "{{PUBLIC_EXPECTED_P0_OR_P1_OR_P2}}",
          "dimension": "{{PUBLIC_EXPECTED_S1_TO_S5}}",
          "locations": [
            "{{PUBLIC_EXPECTED_FINDING_LOCATION}}"
          ]
        }
      ]
    },
    {
      "id": "{{HELD_OUT_FIXTURE_ID}}",
      "classification": "held-out",
      "path": "{{HELD_OUT_FIXTURE_PATH}}",
      "hash": {
        "algorithm": "sha256",
        "value": "{{HELD_OUT_FIXTURE_SHA256}}"
      },
      "mutations": [
        {
          "id": "{{HELD_OUT_MUTATION_ID}}",
          "operation": "{{HELD_OUT_MUTATION_OPERATION}}",
          "target": "{{HELD_OUT_MUTATION_TARGET}}",
          "description": "{{HELD_OUT_MUTATION_DESCRIPTION}}"
        }
      ],
      "expectedFindings": [
        {
          "code": "{{HELD_OUT_EXPECTED_FINDING_CODE}}",
          "severity": "{{HELD_OUT_EXPECTED_P0_OR_P1_OR_P2}}",
          "dimension": "{{HELD_OUT_EXPECTED_S1_TO_S5}}",
          "locations": [
            "{{HELD_OUT_EXPECTED_FINDING_LOCATION}}"
          ]
        }
      ]
    }
  ]
}
```

## 3. INDEPENDENCE AND CLASSIFICATION RULES

- `productionAdapterImportProhibited` stays the JSON boolean `true`. A production
  adapter importing or invoking the oracle invalidates the benchmark instrument.
- `public` fixtures may be used for adapter calibration and transparent regression
  tests. `held-out` fixtures must not be used to implement or tune the adapter.
- The clean-control ID must resolve to one fixture with empty `mutations` and empty
  `expectedFindings`; a non-zero result is an instrument-validity failure until
  investigated.
- Each expected finding carries the adapter-owned code, severity, dimension, and
  exact location produced by the independent oracle. Do not infer expectations
  from a production-adapter run.
- Hash the complete fixture root and each fixture after generation. Any content
  change requires a manifest update and a new evidence identity.

## 4. VALIDATION

After filling the placeholders and copying the block to the shipped manifest, run:

```bash
python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "{{SHIPPED_FIXTURE_MANIFEST_PATH}}"
```

Then verify `{{FIXTURE_ROOT_SHA256_COMMAND}}` and each per-fixture hash against the
manifest before dispatching a benchmark run.
