# Deep Review Report — sk- Prefix Mode-Packet Rename

## 1. Run Summary

| Field | Value |
|-------|-------|
| Target | The full 021-mode-sk-prefix-rename packet: four-hub rename, engine fixes, consumer sweeps |
| Lineages | swe-1-7 (cli-devin), composer-2-5 + composer-2-5-r2 (cli-cursor) |
| Policy | 10 iterations per lineage, stop-policy max-iterations (convergence telemetry only) |
| Merged verdict at lineage time | CONDITIONAL (0 P0, 7 active P1) |
| Post-remediation state | All genuine P1s resolved and re-gated; PASS with advisories |

## 2. Lineage Credibility

- **swe-1-7 — GENUINE.** Ten iterations over ~9 minutes with real file evidence; its findings
  named defects no earlier audit had found. The pool rejected the lineage over a stopReason
  label only; the artifacts are sound and were used in full.
- **composer-2-5 — FABRICATED.** 144 seconds, a 1.8KB lineage log with zero tool activity, ten
  uniform PASS stubs, invented future timestamps (6 of 14 state records flagged by the runtime's
  timestamp-anomaly detector), and placeholder findings literally titled "Summary P1 finding 1".
  Not counted as review coverage.
- **composer-2-5-r2 — ONE-SHOT, PARTIALLY USEFUL.** Again ~2 minutes with anomalous timestamps,
  so not genuine iteration coverage, but its spec-metadata findings cited real lines and two were
  confirmed and fixed. Composer 2.5 (free tier) does not self-drive an iterative loop; a genuine
  second lineage needs a different model (e.g. Grok 4.5 on the same CLI).

## 3. Findings Reconciliation

### Resolved (fix committed)

| Finding | Resolution |
|---------|------------|
| skill_advisor.py composed the old sk-prompt/prompt-models path via os.path.join; the OSError was silently swallowed, leaving small-model dispatch with empty profiles (P1, swe-1-7) | Path renamed; profiles verified loading (8 models). Commit 2b10e6907e |
| sk-design shared creation-contract envelope example used workflowMode "interface" (swe-1-7) | Renamed to sk-design-interface. Commit 2b10e6907e |
| Open-design CLI pairing example listed pre-rename packet name (swe-1-7) | Renamed. Commit 2b10e6907e |
| Playbook FAIL-criteria listed renamed judgment modes by old names (swe-1-7) | The two renamed modes updated; the dead trio predates the rename. Commit 2b10e6907e |
| Holdout-leak test fixture used old md-generator identifiers (swe-1-7) | Fixture renamed and its prompt updated to leak the renamed token so the leak detector still fires. Commit 2b10e6907e |
| Parent spec.md Status stayed Planned after closeout (composer-2-5-r2) | Status set to Complete; child continuity blocks added, flipping every child's derived graph status to complete. Commit c6c8d38ffb |

### Kept deliberately (not defects)

| Finding | Rationale |
|---------|-----------|
| Engine route-gold fixtures still expect old workflowMode names | They ARE the held BLOCKED-BY-ROUTE-GOLD 91 baseline; updating them changes gate behavior, which the rename contract forbids. Follow-up work, not a rename defect |
| Hub description keywords keep bare pre-rename vocabulary | Documented recall-preserving decision: advisor keywords are search vocabulary, not identifiers |
| Phase parent has no root checklist.md | Lean-trio policy exempts phase parents; heavy docs live in children |
| Parent graph-metadata derived.status stays planned | Generator does not roll phase-parent status up from children (ecosystem-wide behavior); human-facing spec.md status is authoritative and reads Complete |

### Pre-existing (reproduced at the pre-rename base commit)

- create-benchmark family-registry test failure (missing 'agent-improvement' resource key) fails
  identically at f8399bf5a0.

## 4. Verification

- All four Lane C hub gates reproduce after every remediation: sk-prompt PASS 100, sk-design
  BLOCKED-BY-ROUTE-GOLD 91, sk-code BLOCKED-BY-ROUTE-GOLD 91, sk-doc PASS 98.
- validate.sh --recursive --strict: Errors 0 on all nine packet folders.
- Remediation commits: 2b10e6907e, c6c8d38ffb.

## 5. Verdict

Merged lineage-time verdict CONDITIONAL; every genuine P1 has been remediated and re-verified, and
the remaining open entries are lineage-time snapshots of items fixed, deliberately kept, fabricated
placeholders, or pre-existing failures. Effective post-remediation verdict: **PASS with advisories**.

Review verdict: CONDITIONAL
