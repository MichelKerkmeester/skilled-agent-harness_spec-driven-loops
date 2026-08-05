# Review Report — mcp-obsidian plugin coverage (FINAL)

> Two `/deep:review` cycles (cli-codex gpt-5.6-luna, max/fast, `--stop-policy=max-iterations`) against the `mcp-obsidian` skill, plus remediation. All findings were **independently re-verified against the real files** before acting (finding = hypothesis).

## 1. Outcome

**All real plugin-coverage gaps found across both cycles are resolved (5 fixes, each verified).** Every one of the 11 plugins is now covered across all 5 surfaces. The review's residual `CONDITIONAL` verdict is driven only by (a) a self-referential finding about this review packet's own scaffolding and (b) intentionally-retained honest-uncertainty markers — not by any skill-coverage gap.

## 2. Coverage matrix (11 plugins × 5 surfaces) — post-fix

| Surface | Before | After |
|---|---|---|
| References (data-model/workflows/troubleshooting/index) | 11/11 | 11/11 |
| Assets | 11/11 | 11/11 |
| Feature-catalog card | 11/11 | 11/11 |
| Playbook scenario (OBS-011..021) | 11 files, **3 indexed** in §12 | 11 files, **11 indexed** |
| Router intent (`PLUGIN_*`) | **10/11** (health-md missing) | **11/11** |

## 3. Review cycles

- **Cycle 1 (truncated 7/10):** crashed at iteration 7 on an infrastructure write-containment collision with a concurrent operator `/deep:review` on packet `038-fable-governor-pi-hook` (both fan-outs in one git tree; my guard reverted 8 of 038's untracked files — 038 lost its iterations 2–3, unrecoverable). Salvaged 3 findings; the findings had converged (identical i2–i7).
- **Cycle 2 (clean 10/10):** ran after fixing cycle-1 findings and serializing (no concurrent deep-review). Confirmed the 3 cycle-1 fixes resolved, and surfaced 2 new gaps the truncated run never reached. Verdict `CONDITIONAL` (2 P1 + 2 P2, deduped from 12 recurring).

## 4. Findings and resolutions (5 fixes)

| # | Finding (severity) | Fix | Verification |
|---|---|---|---|
| 1 | health-md has no router intent (P1, cycle 1) | Added `PLUGIN_HEALTH` to `INTENT_SIGNALS` + `RESOURCE_MAP` + specific-plugin tuple in `SKILL.md` | 11/11 router intents; all 4 health-md paths resolve |
| 2 | beancount playbook lacks throwaway isolation (P1, cycle 1) | Added explicit throwaway-scratch-ledger framing + teardown to OBS-011 | "throwaway" present (was 0) |
| 3 | VERIFY markers in newer data-models (P1→P2) | **Verified false-positive** — legitimate honest-uncertainty per the skill's own convention. Grounded the one cleanly-resolvable git marker from installed `main.js`; kept the rest (fabricating them is forbidden). Cycle 2 downgraded it to P2. | git field names source-grounded |
| 4 | `plugin-operation-logic.md` overview enumerated 5 plugins, omitted 6 newer (P1, cycle 2) | Extended the overview enumeration to all 11 | overview names 11 plugins |
| 5 | Playbook §12 indexed only 3 of 11 tie-ins; description said "three" (P2, cycle 2) | Added the 8 missing §12 scenario blocks (OBS-014..021); fixed §12 header range, description, and opening prose to 11 | §12 has 11 blocks; all 16 new links resolve; "eleven" |

## 5. Residual (not skill-coverage gaps — no further fix)

- **P1 (self-referential):** "target packet lacks normative review inputs" points at this review packet's own `review-report.md`/spec — an artifact of the fan-out review binding `review_target = spec_folder`. Not a skill gap.
- **P2 (intentional):** `VERIFY` markers on app-only / per-vault / source-inspection details are deliberate honest-uncertainty. Resolving them without live grounding would fabricate facts.

A third confirming rerun would still return `CONDITIONAL` for these two non-gap reasons, so it is not recommended as a gate.

## 6. Infrastructure lesson

Two concurrent deep-loop fan-outs in one git working tree mutually trip write-containment (each reverts the other's untracked files). Serialize deep-reviews, or isolate them per git worktree. A `system-deep-loop` runtime limitation, unrelated to mcp-obsidian.
