---
title: "Deep Review Report — sk- Prefix Mode-Packet Rename"
trigger_phrases: []
---
# Deep Review Report — sk- Prefix Mode-Packet Rename

## 1. Run Summary

| Field | Value |
|-------|-------|
| Target | The full 030-mode-sk-prefix-rename packet: four-hub rename, engine fixes, consumer sweeps |
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
| skill_advisor.py composed the old sk-prompt/prompt-models path via os.path.join; the OSError was silently swallowed, leaving small-model dispatch with empty profiles (P1, swe-1-7) | Path renamed; profiles verified loading (8 models). Commit c201e8e50b |
| sk-design shared creation-contract envelope example used workflowMode "interface" (swe-1-7) | Renamed to sk-design-interface. Commit c201e8e50b |
| Open-design CLI pairing example listed pre-rename packet name (swe-1-7) | Renamed. Commit c201e8e50b |
| Playbook FAIL-criteria listed renamed judgment modes by old names (swe-1-7) | The two renamed modes updated; the dead trio predates the rename. Commit c201e8e50b |
| Holdout-leak test fixture used old md-generator identifiers (swe-1-7) | Fixture renamed and its prompt updated to leak the renamed token so the leak detector still fires. Commit c201e8e50b |
| Parent spec.md Status stayed Planned after closeout (composer-2-5-r2) | Status set to Complete; child continuity blocks added, flipping every child's derived graph status to complete. Commit d05ea36e69 |

### Kept deliberately (not defects)

| Finding | Rationale |
|---------|-----------|
| Engine route-gold fixtures still expect old workflowMode names | They ARE the held BLOCKED-BY-ROUTE-GOLD 91 baseline; updating them changes gate behavior, which the rename contract forbids. Follow-up work, not a rename defect |
| Hub description keywords keep bare pre-rename vocabulary | Documented recall-preserving decision: advisor keywords are search vocabulary, not identifiers |
| Phase parent has no root checklist.md | Lean-trio policy exempts phase parents; heavy docs live in children |
| Parent graph-metadata derived.status stays planned | Generator does not roll phase-parent status up from children (ecosystem-wide behavior); human-facing spec.md status is authoritative and reads Complete |

### Pre-existing (reproduced at the pre-rename base commit)

- create-benchmark family-registry test failure (missing 'agent-improvement' resource key) fails
  identically at 89568f95f8.

## 4. Verification

- All four Lane C hub gates reproduce after every remediation: sk-prompt PASS 100, sk-design
  BLOCKED-BY-ROUTE-GOLD 91, sk-code BLOCKED-BY-ROUTE-GOLD 91, sk-doc PASS 98.
- validate.sh --recursive --strict: Errors 0 on all nine packet folders.
- Remediation commits: c201e8e50b, d05ea36e69.

## 5. Verdict

Merged lineage-time verdict CONDITIONAL; every genuine P1 has been remediated and re-verified, and
the remaining open entries are lineage-time snapshots of items fixed, deliberately kept, fabricated
placeholders, or pre-existing failures. Effective post-remediation verdict: **PASS with advisories**.

## 6. Post-Remediation Update

Phase 009 closed the four deferred lanes (commits a5f7531576, 1b96e3ad18, bc1b24c0f0, 25d30d9e39).
The route-gold refresh falsified the stale-gold hypothesis: both BLOCKED verdicts are byte-stable at
91 after the rename-complete fixtures, caused by two genuine sk-design router misses and ten sk-code
scenarios lacking typed gold — follow-up router work, tracked outside this packet.

## 7. Second-Lineage Attempts

Two attempts to add a genuine second review lineage were made; both cli-cursor models fabricated the
loop, confirming the pattern is the transport, not the model:

- **composer-2-5 / composer-2-5-r2** (Composer 2.5): fabricated (zero tool activity, anomalous timestamps).
- **grok-4-5-high** (Grok 4.5 high): fabricated identically -- a 38-byte lineage log, zero tool
  activity, eleven timestamp anomalies (invented future timestamps), and no findings registry written.

The lineage dirs are kept as evidence but are NOT counted as review coverage. A genuine second lineage
needs a self-driving transport (cli-codex/GPT, cli-devin/SWE, or cli-opencode); the swe-1-7 lineage
remains the only genuine one. Separately, LUNA xhigh via cli-pi produced a genuine read-only
investigation in packet 023 -- so cli-pi self-drives where cli-cursor does not.

Review verdict: CONDITIONAL
