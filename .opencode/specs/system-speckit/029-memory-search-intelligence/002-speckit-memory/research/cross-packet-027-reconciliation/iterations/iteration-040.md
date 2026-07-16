# Iteration 40 (Round N adversarial): Over-deflation skeptic — deflations are SOUND

## Focus
Check the deflations (Q4/Q5/Q6/Q7/Q2) for FALSE NEGATIVES (wrongly-killed real opportunities). Read-only.

## Findings (newInfoRatio 0.3)
**The deflations are SOUND** — three of four residuals were already self-flagged in the seats' own most-likely-wrong sections (the pass largely confirms the deflations were honest about their edges).
- **Q4 sound-kill:** EXTEND is non-Beta-shaped (tier-locked `:106-109`, floor-gated `:111-113`, flat 30-day `:96-99`); no for/against ratio for a Beta posterior. The cross-run +30-day re-extension IS a real **sliding-TTL lifetime bug** (base resets to now each run), but the fix is an absolute deleteAfter ceiling — NOT a Beta transfer. iter-013 already named it. (027-internal hardening note.)
- **Q6 sound-kill** (tripwire, not resurrection): revisit the class-gate IF `SPECKIT_SEMANTIC_TRIGGERS` goes live; no in-repo evidence it's scheduled, and even live the conservative 0.84 gate makes the incremental value marginal.
- **Q7 sound-kill on the Beta-transfer**, but **MILD FALSE-NEGATIVE**: the lease-classification signal (`stale-pid`/`ppid-1-orphan`/`stale-heartbeat-reclaim`, `mk-code-index-launcher.cjs:429-455`) has a non-election home — telemetry/alerting over reclaim/orphan rates as a launcher-health metric (zero preconditions, low-effort, diagnoses flapping daemons). Not Beta-shaped, adjacent to the killed transfer.
- **Q2 sound-refutation:** CLI/import ingest paths write via `write-provenance.ts` governance + recall funnels through the canonical escaper; no untrusted-content ingest path survives. The only residual is the recall-side renderer (different axis, = C8).

## Net
Strongest resurrection = **Q7 lease-classification telemetry** (a small net-new launcher-health feature, NOT the killed Beta-for-election transfer).

## Next Focus
Add the Q7 lease-classification telemetry as a small net-new candidate; note the Q4 sliding-TTL ceiling as a 027-internal hardening. Deflations confirmed sound for the ledger.
