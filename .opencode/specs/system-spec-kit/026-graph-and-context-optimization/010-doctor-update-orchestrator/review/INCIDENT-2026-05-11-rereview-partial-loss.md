---
title: "Incident: Re-review iteration narratives 1-9 lost due to worktree destruction during dispatch"
description: "Documents the 2026-05-11 worktree destruction event during the 013 re-review. Iter-10 narrative + state.jsonl + findings-registry + review-report.md survived. Verdict (PASS) is intact and evidence-backed; only narrative iteration files 1-9 lost."
date: 2026-05-11
event_type: data_loss
severity: low
---

# Incident — 013 Re-Review Partial Data Loss (2026-05-11)

## What happened

During the 10-iteration `/spec_kit:deep-review:auto` re-review on `010-doctor-update-orchestrator` (post-003-remediation verification, session `2026-05-11T09-15-00Z-rm8-013-deepseek-rereview`), the dispatch worktree at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/013-doctor-rereview` was substantially destroyed between iter-9 completion (~10:08 UTC) and iter-10 completion (~10:28 UTC).

**Surviving artifacts (preserved in this `review/` directory):**
- `deep-review-state.jsonl` — all 11 records present (config + restart event + 10 iteration records + 1 final adversarial_self_check event)
- `deep-review-findings-registry.json` — final adjudicated state: PASS, 0 P0, 0 P1, 4 P2 (advisories), all 10 clusters verified closed
- `iterations/iteration-010.md` — full final-verdict narrative with closure verification table for all 10 clusters
- `deltas/iter-010.jsonl` — iter-10 delta records
- `review-report.md` — canonical synthesis written by the main session AFTER iter-10 completion

**Lost artifacts:**
- `iterations/iteration-001.md` through `iteration-009.md` — narrative form
- `deltas/iter-001.jsonl` through `iter-009.jsonl` — structured delta form
- `prompts/iteration-{1..10}.md` — rendered iteration prompts
- `deep-review-config.json` — config (regenerable)
- `deep-review-strategy.md` — strategy (regenerable)
- `review_archive/2026-05-11T05-55-00Z-rm8-013-deepseek-original/` — original review packet copy inside worktree (NOTE: the original is still preserved in this repo at `<spec_folder>/review_archive/2026-05-11T05-55-00Z-rm8-013-deepseek-original/`, restored from commit `8d794afad`)

## Root cause

Concurrent parallel-session activity on `main`. Between worktree creation (commit `37ea931ce` at ~11:11 UTC local) and the loop driver's completion (~12:28 UTC local), 5 unrelated parallel commits landed on main (`b98945e62`, `4bf78a516`, `9ca34b1ec`, `2908deb22`, `a02e7d009`). The parallel session also appears to have stomped the worktree directory `/013-doctor-rereview/` — its `.git` pointer was removed and most of its files were deleted while the deep-review loop was still running. Files written AFTER the destruction wave (iter-10 outputs) survived because they were created in the residual directory after the cleanup occurred.

This is **NOT** an RM-8 scope violation by the deepseek-v4-pro executor. The agent did not delete its own prior outputs. The destruction was caused by an external session interacting with git worktree management. The agent's RM-8 hardening held — the dispatched agent did not perform any out-of-scope writes (state.jsonl is append-only and shows no scope_violation events).

## Impact on the verdict

**Zero.** The re-review verdict (PASS, hasAdvisories=true) is preserved and fully evidence-backed:

1. The final adjudicated **findings registry** survived and shows 0 P0, 0 P1, 4 P2 with detailed per-finding adjudication.
2. The **state log** survived with all 10 iteration records, each carrying per-iter findings counts + cluster closure status + adversarial adjudication outcomes.
3. The **iter-10 narrative** survived and contains the full Closure Verification table across all 10 clusters (A-J), all 4 P2 findings with full CLAIM ADJUDICATION schema, regression check, traceability checks, deferred findings list, and final verdict.
4. The **review-report.md** was synthesized from the surviving evidence and contains the 10-section canonical summary.

The lost iterations (1-9 narratives + 1-9 deltas + prompts + strategy/config) were duplicates of evidence preserved in higher-fidelity form in the state log + registry + iter-10 narrative. **No finding evidence was lost.**

## Verification of the surviving evidence

Re-readers can verify the verdict by inspecting:

- `review-report.md` §1 Executive Summary, §3 Closure Verification table, §4 Active P2 Findings (each with file:line citations)
- `iterations/iteration-010.md` §Closure Verification, §Findings by Severity, §Adversarial Self-Check Conclusion, §Verdict
- `deep-review-state.jsonl` — grep for `"verdict":"PASS"` returns multiple confirmations across iter records
- `deep-review-findings-registry.json` `.finalVerdict == "PASS"`, `.hasAdvisories == true`, `.findingsBySeverity == {P0:0, P1:0, P2:4}`, `.closureMatrix.clustersVerified == ["A","B","C","D","E","F","G","H","I","J"]`

## What this incident says about the workflow

1. **RM-8 prevention held.** Despite the destruction, the cli-opencode + deepseek-v4-pro executor itself did NOT cause scope violations. The hardened prompt + worktree isolation + commit baseline stack functioned correctly.

2. **Worktree isolation is not bulletproof against concurrent session interference.** A parallel session that touches git worktree management can stomp another session's worktree. For high-stakes multi-iteration dispatches, schedule them when no concurrent worktree-modifying activity is expected, OR add a worktree lock primitive (out of scope for this packet).

3. **The state log is the authoritative source of truth.** Per-iteration narrative markdown is a human-readable convenience; the append-only `deep-review-state.jsonl` + `deep-review-findings-registry.json` are the canonical record. They survived.

## Next steps

- **Verdict stands**: PASS (hasAdvisories=true). 013 phase parent is shippable.
- **Optional follow-on**: replay any of iter-1..9 if narrative-form is desired for archival completeness. The state log + iter-10 narrative are sufficient for normal operational purposes.
- **Workflow hardening**: add a `.git/worktrees/<name>/locked` marker or a session-id mutex to prevent concurrent worktree stomping. Separate packet.
