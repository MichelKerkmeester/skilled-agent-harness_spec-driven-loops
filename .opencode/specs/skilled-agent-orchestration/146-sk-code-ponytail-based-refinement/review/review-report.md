---
title: "Deep Review Report: Packet-146 Implementation"
description: "5-iteration deep review (gpt-5.5-fast high) of the ponytail-based-refinement implementation across sk-code, sk-code-review, deep-improvement. Findings adversarially verified by the orchestrator."
importance_tier: "high"
---

# Deep Review Report — Packet-146 Implementation

**Method:** 5 read-only review iterations (`openai/gpt-5.5-fast`, variant high) across 5 dimensions, in 2 parallel waves; orchestrator owns all state writes (Gate-3 safe). Every finding was **adversarially verified by the orchestrator** against the real code before inclusion — 2 findings downgraded, 1 confirmed pre-existing.

**Scope reviewed:** the uncommitted packet-146 footprint — new guard scripts (`check-rule-copies.js`, `check-agent-mirror-sync.cjs`, `verify_stack_folders.py` + a test), the `mirror-sync-verify.cjs` normalizer change, two CI workflows, the `pre-commit` edit, the `.codex/agents/context.toml` fix, the doc/rule additions to sk-code + sk-code-review, and the 3 changelogs + 3 README edits.

**Verdict: REQUESTED_CHANGES** — the work is functional (all gates currently green), but the new guards have real coverage/robustness gaps and a few docs overclaim. No P0 blockers. **0 P0 · 5 P1 · 7 P2.**

> **Remediation (2026-06-13): COMPLETE.** All 12 findings (5 P1 + 7 P2) were fixed and verified; gates re-run green (canary exit 0, agent mirror-sync 12/12, stack-folders exit 0, mirror-sync vitest 3/3, comment-hygiene clean). Per-finding closure is in the Remediation section below. Playbook coverage for the new behaviors was subsequently added and executed (9/9 PASS — see `playbook-test-results.md`). The REQUESTED_CHANGES verdict above is retained as the historical review record.

---

## P1 — should fix before merge (all verified real)

| # | Finding | Evidence | Fix |
|---|---------|----------|-----|
| 1 | **Canary skips a live Iron Law copy.** `IRON_LAW_FILES` only checks `sk-code/SKILL.md` + `CLAUDE.md`; **`AGENTS.md:11`** also carries the Iron Law and can drift undetected. | `check-rule-copies.js:65-69`; confirmed `AGENTS.md:11` = "The Iron Law: NO completion claims…" | Add `AGENTS.md` to `IRON_LAW_FILES`. |
| 2 | **Canary validates only the first Iron Law line.** `.find()` stops at the first match, but **`sk-code/SKILL.md` has two** Iron Law lines — `:45` ("…fresh verification evidence from the detected surface") and `:140` ("…SURFACE-APPROPRIATE VERIFICATION"). Drift in `:140` is invisible — and the two are *already worded/cased differently*, so the canary it was meant to guard doesn't actually cover the in-file drift. | `check-rule-copies.js:103-117`; confirmed two `Iron Law` lines | Collect + validate **all** Iron Law lines per file; consider canonicalizing the two SKILL.md copies. |
| 3 | **Mirror normalizer over-masks — masks real format-specific drift.** `replace(/\.(?:toml\|mdc\|md)(?![A-Za-z0-9])/gi, …)` collapses **every** `.md/.toml/.mdc` mention, not just self-references, before token comparison. Concrete miss: canonical "use `config.md`" vs mirror "use `config.toml`" now compare equal. | `mirror-sync-verify.cjs:84` | Scope the extension collapse to the runtime self-reference clause only, or preserve filename+extension tokens outside it. |
| 4 | **CI guards fail open when the checker is missing.** Both `rule-canary-sync.yml` and `agent-mirror-sync.yml` `exit 0` (warning) if the script is absent — so a PR that deletes/moves a guard silently disables its own CI gate. | `rule-canary-sync.yml:18-20`, `agent-mirror-sync.yml:18-20` | Fail **closed** in CI when a required checker is missing (keep warn-only for the local pre-commit hook). |
| 5 | **Deletions bypass the mirror gate.** Both the workflow and the hook use `--diff-filter=ACM`, so deleting a `.claude`/`.codex` mirror produces no changed entry and passes clean — yet a deleted mirror **is** a desync. | `agent-mirror-sync.yml:27`, `pre-commit:45` | Include `D` in the filter and treat a deleted canonical/mirror as drift (unless the whole agent set is intentionally removed). |

---

## P2 — worth fixing (verified; lower priority)

| # | Finding | Evidence | Note |
|---|---------|----------|------|
| 6 | `check-agent-mirror-sync.cjs` treats a **missing `.opencode` canonical as "in sync"** — an orphan/stale runtime mirror reads green (probe confirmed). | `check-agent-mirror-sync.cjs:58-62` | Fail when a changed agent path has no canonical, or check mirror existence. |
| 7 | `verify_stack_folders.py` **orphan scan covers `references/` but not `assets/`** — an undeclared `assets/<surface>/` isn't flagged (the *declared*-surface binding does check both). | `verify_stack_folders.py:88` | Add an `assets/` orphan scan with the same non-surface exemptions. *(Downgraded from the seat's P1.)* |
| 8 | **Depth-alias §9.3 wording overstates implementation.** No code reads `SK_CODE_REVIEW_DEPTH` — but **no code reads `SK_CODE_REVIEW_MIN_CHANGED_LINES` either**; both are *agent-honored* skill env vars, so the alias is consistent with the existing M-2 idiom. The "resolved env > config > default" phrasing reads like a wired mechanism. | `sk-code-review/SKILL.md §9.3` | Reword §9.3 to say it's agent-honored advisory (same status as M-2), or wire it. *(Downgraded from the seats' P1 after verifying the M-2 parallel.)* |
| 9 | **Changelog overclaims the canary trigger** — v1.4.0.0 says it runs "on every push and pull request"; the workflow is `pull_request`-only. | `sk-code-review/changelog/v1.4.0.0.md:48` vs `rule-canary-sync.yml:2` | Correct the changelog (PR-only) or add a `push` trigger. |
| 10 | **deep-improvement README overclaims** "an agent edit cannot land with out-of-sync runtime copies" — the gate skips if node/checker is unavailable and CI only runs on PR→main. | `deep-improvement/README.md:80` | Qualify to the actual best-effort (pre-commit + PR) coverage, or fail closed + add push coverage. |
| 11 | The 3 changelogs' **"Files Changed" omit the README edits** that are part of the packet. | the 3 `changelog/*.md` Files-Changed lists | Add README rows or state the list excludes README/release-note edits. |
| 12 | **Pre-existing (not packet-146):** M-1/M-2 emit `Review status: COMMENTED (…)` parentheticals that vary from the strict §3 "exact final line" contract. | `sk-code-review/SKILL.md:472, :506` | Out of scope for this packet; flag for a future sk-code-review cleanup. |

---

## What held up (verified non-findings)

The reviewers explicitly cleared several things, confirmed by the orchestrator:
- The `ceiling:` convention is internally consistent with comment-hygiene — **not** allow-listing it is correct (allowed patterns short-circuit violation detection); a `ceiling:` comment carrying a forbidden id is still caught.
- The ceiling-comment downgrade rule correctly excludes security/auth/persistence/sandbox/public-contract/correctness.
- The Design Restraint Ladder placement is consistent with the phase flow (after surface+intent routing, before Phase 1 writes; Iron Law unchanged).
- The anti-stall rule does not override SCOPE-LOCK / HALT / Escalation Discipline as written.
- The needed-ness/removal prompt is bounded (current-requirement traceability + "would anything break?" + P2 default + removal-plan evidence).
- The `.codex/agents/context.toml` drift fix is exact vs canonical; the normalizer ordering comment is correct.
- All gates currently pass: canary exit 0, mirror-sync 12/12, stack-folders exit 0.

---

## Recommended fix order

1. **Robustness of the new guards (P1):** #2 (validate all Iron Law lines) + #1 (add AGENTS.md) — both in `check-rule-copies.js`; #3 (scope the normalizer regex); #4 (fail-closed CI); #5 (include deletions). These are small, localized edits to code I just shipped.
2. **Doc accuracy (P2):** #9 (changelog trigger), #10 (README overclaim), #11 (Files-Changed), #8 (depth-alias wording). Pure prose corrections.
3. **Coverage completeness (P2):** #6 (missing-canonical), #7 (assets orphan) — optional hardening.
4. **Defer:** #12 (pre-existing M-2/§3 tension) to a separate sk-code-review packet.

---

## Remediation

All 12 findings closed 2026-06-13 (the #12 "defer" recommendation was instead resolved in-place by documenting the contract exception).

| # | Pri | Fix landed | Status |
|---|-----|-----------|--------|
| 1 | P1 | `AGENTS.md` added to `IRON_LAW_FILES` in `check-rule-copies.js` | FIXED |
| 2 | P1 | Canary validates **every** Iron Law line per file (`.find` → `.filter`) | FIXED |
| 3 | P1 | Normalizer scoped to runtime agent-file paths; blanket `.md/.toml` collapse removed (`mirror-sync-verify.cjs`) | FIXED |
| 4 | P1 | Both CI workflows fail **closed** when their checker is missing | FIXED |
| 5 | P1 | Mirror gate covers deletions — `--diff-filter=ACMD` in `pre-commit` + workflow | FIXED |
| 6 | P2 | `check-agent-mirror-sync.cjs` flags an orphan canonical whose mirrors linger | FIXED |
| 7 | P2 | `verify_stack_folders.py` scans `assets/` orphans too (exempts `universal` + `scripts`) | FIXED |
| 8 | P2 | §9.3 reworded to "reviewing agent honors (env > config > default)" — advisory, like the §9.2 gate | FIXED |
| 9 | P2 | Changelog corrected: canary runs on pull requests to `main`, not "every push" | FIXED |
| 10 | P2 | deep-improvement README qualified — local hook fails open, CI-on-`main` is the fail-closed backstop | FIXED |
| 11 | P2 | README rows added to all three changelogs' Files Changed sections | FIXED |
| 12 | P2 | §3 contract now states the M-1/M-2 skip output (`Review status: COMMENTED` + reason) | FIXED |

Verification: `check-rule-copies.js` exit 0 + self-test 3/3; `check-agent-mirror-sync.cjs --all` 12/12; `verify_stack_folders.py` exit 0; `mirror-sync-verify.vitest.ts` 3/3; comment-hygiene clean on all changed assets.

<!-- ANCHOR:references -->
## Provenance

5 iterations recorded in `review/deep-review-state.jsonl`; per-dimension reviews in `review/iterations/iteration-00N.md`; deltas in `review/deltas/`. Model: `openai/gpt-5.5-fast` (variant high) ×5, read-only, orchestrator-written state. Every P1 was independently re-verified against the source — representative checks: [SOURCE: `AGENTS.md:11`] (Iron Law copy the canary skips), [SOURCE: `.opencode/skills/sk-code/SKILL.md:45,140`] (two Iron Law lines), [SOURCE: `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs:84`] (extension over-mask), [SOURCE: `.github/workflows/rule-canary-sync.yml:18-20`] (fail-open CI).
<!-- /ANCHOR:references -->

Review status: REQUESTED_CHANGES — remediated 2026-06-13 (all 12 findings closed; gates green; playbook coverage added + tested 9/9 PASS)
