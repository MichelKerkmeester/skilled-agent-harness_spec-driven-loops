---
title: "Calibration Offline/Live Gates and Privacy Governance"
description: "Deterministic replay, live-shadow divergence, privacy, retention, and reversible promotion rules."
importance_tier: "critical"
contextType: "implementation"
---
# Calibration Offline/Live Gates and Privacy Governance

## 1. Offline gate

The offline gate runs on a pinned corpus and EffectivePolicy identity. It:

1. verifies the scorer, router replay, and playbook scenario loader digests
   against trusted constants;
2. validates seal, privacy, provenance, coverage, and corpus identity;
3. obtains legacy-router observations in a read-only subprocess where the
   Stage-3 route exists;
4. derives typed shadow observations from corpus records by running the real
   `projectTypedRouteGold` and `projectLegacyObservation` chain; the separate
   fixture stores only post-label-lock, non-authority provenance;
5. projects `clarify|defer|reject` to empty legacy intents/resources;
6. calls the real exported `evaluateRouteGold` for every record;
7. computes per-slice reliability/ECE and enforces the strictest cell tolerance;
8. serializes replay output with the frozen canonical serializer and requires
   identical SHA-256 and bytes across at least three runs;
9. corrupts one observation and requires the real scorer to reject it;
10. re-hashes all three protected files and fails on any byte change.

This is Stage-3 shadow evidence. Rows using typed shadow observations are
reported `shadow-partial`; full route-gold against activated real hub scenarios
belongs to each Stage-4 canary. Gold is never auto-updated, and a needed scorer
edit is migration failure (synthesis §8.2, §9, §10).

## 2. Live gate

The live gate is non-authority shadow measurement. It receives only
privacy-filtered requests, locks intent labels before router output is revealed,
and computes the same per-slice ECE. A certificate is blocked when:

- live ECE exceeds the slice tolerance;
- `abs(liveEceBps - offlineEceBps)` exceeds 200 bps for actor/judgment mutating
  slices or 400 bps for evidence/transport non-mutating slices;
- the live sample misses the operational per-cell floor;
- policy or corpus identity differs from the offline run;
- any sample lacks deletion lineage or privacy approval.

Live observations are evidence only. They never change serving policy online,
select a destination, or grant authority. This answers the operational privacy
and retention concern without turning shadow traffic into training authority
(synthesis §11 open-q 7, §10).

## 3. Privacy and retention

Before sealing:

- deterministic PII scrubbing removes direct identifiers, secrets, unique
  organization names, personal contact data, and unnecessary local paths;
- every record is assigned a partition and opaque deletion key;
- an independent privacy reviewer, distinct from label authors, signs the
  generation;
- the validator confirms approval predates the seal.

Offline-authored and privacy-filtered live-shadow records use separate storage
partitions. The default retention window is 30 days for shadow traffic and 90
days for independently authored offline fixtures; a stricter legal or operator
limit wins. Deletion requests are fulfilled within seven days by deletion key.
Because sealed bytes cannot change in place, deletion retracts the affected
generation, invalidates its certificates, creates a new generation without the
record, and fenced-CAS promotes it after the gates pass.

## 4. Promotion and rollback

Promotion snapshots the candidate corpus, prior corpus, expected pointer token,
and policy identity. The final pointer change uses a token lock and fencing epoch
with an immediate preimage check. The prior byte-identical generation remains
available throughout the retention window. Rollback swaps the pointer back and
invalidates future claims tied to the retracted id; it cannot reverse an already
committed destination effect (synthesis §9, §10).
