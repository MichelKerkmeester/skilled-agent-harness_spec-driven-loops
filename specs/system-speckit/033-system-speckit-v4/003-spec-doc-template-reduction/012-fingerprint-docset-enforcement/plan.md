---
title: "Implementation Plan: Fingerprint Docset Enforcement"
description: "Land the migration before the rule, so no packet is ever in the combination the new rule rejects."
trigger_phrases:
  - "fingerprint docset plan"
  - "stamp only migration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fingerprint Docset Enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Order is the whole plan. The new rule rejects a fingerprint without a marker; 3,840 packets are
in exactly that state today. Landing the rule first fails the entire fleet at once. The migration
therefore lands first, and the rule second, so the rejected combination never exists in a
committed tree.

The migration stamps only. Reusing `backfill-graph-metadata.ts` would be faster and would also
recompute every digest, silently absorbing the drift this packet exists to expose — which is the
same mistake in a new place.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

Three changes, in dependency order.

**The migration** reads each `graph-metadata.json`, and when `source_fingerprint` is present and
`source_fingerprint_docset` is absent, adds the marker key and writes the file back with every
other byte preserved. It touches nothing else. Idempotent by construction: a file that already
has the key is skipped.

**The schema rule** attaches to the existing graph-metadata schema as a cross-field refinement
rather than a field-level requirement, because the marker is only mandatory in the presence of a
fingerprint — a packet with neither stays legal.

**The integrity rule** stops treating an absent marker as a skip. The distinction that survives:
a marker that is present and older still skips, because absorbing a generation bump is the
marker's actual job.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION STEPS

| Step | Work | Gate before the next step |
|------|------|---------------------------|
| 1 | Write the stamp-only migration and run it against a copied sample | A diff showing exactly one added key per file |
| 2 | Run the migration across the tree | The fingerprint-without-marker count reaches 0 |
| 3 | Add the schema refinement | A packet in the rejected combination fails; a packet with neither field passes |
| 4 | Flip the integrity rule off the skip | A stamped packet with drift now reports a mismatch |
| 5 | Invert the test case that pins the defect, add presence cases | The new cases fail against pre-change code |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

Every case below must be watched failing against the current code before the fix, because the
defect this packet repairs is precisely a test that passed while the gate did nothing.

- A fingerprint with no marker: currently skips silently, must fail.
- Deleting the marker to suppress a known mismatch: currently silences, must fail.
- A stamped packet with real drift: must report the mismatch the stamp did not erase.
- An older present marker: must still skip, unchanged.
- Migration idempotence: a second run produces an empty diff.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

| Dependency | Why | Risk if unavailable |
|------------|-----|---------------------|
| `graph-metadata-schema.ts` | Owns the document contract | None; it is in-repo |
| Existing generation constant | The migration stamps whatever the current generation is | Stamping a wrong value asserts a comparison never run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK

The migration is one added key per file, so reverting is a revert of its commit — no data is
destroyed and no digest is rewritten. That property is the reason for stamp-only: a migration
that recomputed digests could not be rolled back, because the pre-migration digests would be gone.

Roll back in reverse order. The rule must come out before the migration, or the tree fails
validation in the window between.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## L2: AFFECTED SURFACES

| Surface | Effect |
|---------|--------|
| Every spec packet | Gains one metadata key |
| Strict validation | Begins reporting mismatches it currently returns none for |
| Any tooling reading `graph-metadata.json` | Sees a key that was optional become reliably present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Depends on 010 having shipped the marker. Independent of 013, which touches different files.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT

| Step | Estimate |
|------|----------|
| Migration | Small — one file walk, one key |
| Schema and integrity rules | Small |
| Tests including negative controls | Medium — the controls are the point |
| Reviewing a 3,840-file diff | Medium — sample-based, since the change shape is uniform |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ROLLBACK DETAIL

Each step is its own commit so any one can be reverted alone. The migration commit is
mechanically verifiable: every changed file should differ by exactly one added line.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- `bash scripts/tests/fingerprint-docset-generation.sh` passes, including the inverted case.
- `validate.sh <packet> --strict` reports `RESULT: PASSED` on this packet.
- The fingerprint-without-marker count is 0.
- A second migration run leaves the tree clean.
<!-- /ANCHOR:quality-gates -->
