---
title: Brand-First Authoring Lane
description: Authored-only palette, type, and voice workflow with measured-path refusal and a manual reviewed-conversion gate.
trigger_phrases:
  - "brand first lane"
  - "author a brand from a description"
  - "reviewed conversion"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Brand-First Authoring Lane

## 1. OVERVIEW

Use this lane when the operator explicitly wants a new brand direction authored from a product description. It creates proposals, not evidence. The measured extraction pipeline and style corpus remain separate authorities.

## 2. INPUTS AND OUTPUTS

Required input: one short product description naming product, audience, desired posture, constraints, and exclusions.

Required outputs:

- `AUTHORED-DESIGN.md`, rendered from `../authored-brand/authored-design-template.md`;
- `authored-tokens.json`, using `sk-design/authored-brand/v1`; and
- value records validated against `../authored-brand/authored-provenance-schema.md`.

Do not add a command or mode for this lane. It is a shared procedure used by the existing Interface and Foundations owners when the operator explicitly requests authored brand creation.

## 3. AUTHORING WORKFLOW

1. Preserve the input description verbatim as `sourceDescription`.
2. Author a brief-specific palette, type system, and voice. Do not select a named preset or present invented values as observations.
3. Give every independently usable value its own `id`, `value`, `origin: authored`, and provenance object.
4. Validate the complete record with `validateAuthoredBrand`.
5. Render `AUTHORED-DESIGN.md` and refresh both authored exports through `refreshAuthoredExports`.
6. Report the two authored filenames and the unresolved validation work. Never describe the result as measured or verified.

## 4. OVERWRITE POLICY

An authored run may create or replace only `AUTHORED-DESIGN.md` and `authored-tokens.json` in the selected output root. Re-running refreshes those two files as one authored export set.

`assertAuthoredDestination` rejects:

- `DESIGN.md`;
- `tokens.json`;
- any destination within a `styles` path;
- nested or renamed authored outputs; and
- any third filename.

The writer performs path validation before filesystem I/O. It exposes no measured writer and no conversion function. If a caller supplies a measured path, the run stops and the existing measured file remains byte-unchanged.

## 5. REVIEWED-CONVERSION PROCEDURE

An authored value may enter the measured corpus only after a human creates and signs a separate `reviewed-conversion` checklist artifact. This procedure is intentionally manual. `assertReviewedConversionArtifact` checks that the record is structurally complete; it does not perform conversion, write a measured file, or prove the reviewer's claims.

Copy this checklist into the project design evidence record and complete it by hand:

```markdown
# Reviewed conversion: [date and scope]

- Artifact type: `reviewed-conversion`
- Source artifact: `AUTHORED-DESIGN.md`
- Human reviewer name: [name]
- Reviewer role: [role]
- Review date: [ISO date/time]
- Reviewer signature: [same human name]

## Manual attestations

- [ ] I inspected the source provenance for every selected authored value.
- [ ] I reviewed independent measurement evidence for every selected value.
- [ ] I reviewed conflicts with existing measured values and consumers.
- [ ] I explicitly approve the listed selections for the named measured targets.

## Selections

| Authored value id | Measured target | Decision | Independent measurement evidence |
|---|---|---|---|
| [id] | [DESIGN.md, tokens.json, or styles] | approved/rejected | [one or more evidence references] |
```

The machine-readable companion record uses:

```json
{
  "artifactType": "reviewed-conversion",
  "sourceArtifact": "AUTHORED-DESIGN.md",
  "reviewerName": "A human reviewer",
  "reviewerRole": "Design system owner",
  "reviewedAt": "2026-07-22T18:00:00Z",
  "reviewerSignature": "A human reviewer",
  "attestations": [
    "source-provenance-reviewed",
    "measurement-evidence-reviewed",
    "target-conflicts-reviewed",
    "manual-approval-recorded"
  ],
  "selections": [
    {
      "authoredValueId": "palette.primary",
      "targetArtifact": "tokens.json",
      "decision": "approved",
      "measurementEvidence": ["contrast run and computed-color capture in the design evidence record"]
    }
  ]
}
```

After the checklist passes human review, the existing measured owner may manually recreate the approved value from the attached measurement evidence. Preserve the conversion record as lineage. Do not copy the authored record wholesale, strip its provenance, or use an automated `verified=true` flag.

## 6. HARD BOUNDARY

The invariant is structural:

`product description -> authored values -> AUTHORED-DESIGN.md + authored-tokens.json`

There is no automatic edge from authored exports to measured artifacts. The only permitted bridge is:

`authored value -> signed reviewed-conversion record -> independent measurement evidence -> existing measured owner`

Missing checklist, missing signature, missing attestation, missing evidence, or an evidence-free verified flag blocks the bridge. The authored lane never writes the measured destination, even after review.

## 7. CLEAN-ROOM AND ASSET BOUNDARY

The lane independently applies the research conclusion that authored and measured systems require separate authority. It copies no Hallmark code, prose, schema, or asset. Images, fonts, logos, and other third-party binaries remain outside this lane and require their own rights evidence.
