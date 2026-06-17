# Iteration 5 — Wave 3 (generate) — seat opus-3 (claude-opus-4-8)

- Lens: rule-invariant-validation
- Status: complete | exit=0 | duration=169s | findings=5 | newInfoRatio=0.65
- Focus: Could a ponytail-style canary-phrase guard protect sk-code/sk-code-review refs + 3-runtime mirrors?
- Dispatch: claude account-2 CLI, --model opus --permission-mode plan (read-only; stdout-only rule applied)
- KEY EMPIRICAL FINDING: Iron Law wording already drifted across 3 copies; router-sync vitest is NOT CI-gated.

## Seat output

Evidence gathering complete. Both target guards confirmed, the ponytail invariant logic read in full, and — critically — I found that the Iron Law is *already* drifted across three copies and that the router-sync vitest is **not** CI-gated. Here is my analysis.

---

## opus-3 · lens: rule-invariant-validation · iteration 005/10

### What ponytail's `check-rule-copies.js` actually does

Two distinct mechanisms in one script (`.../146.../external/ponytail-main/scripts/check-rule-copies.js`):

1. **Byte-equality for compact copies** (lines 19–35): `AGENTS.md` body is the canonical source; five host adapters (`.cursor/.windsurf/.clinerules/.github/.kiro`) are normalized (frontmatter stripped) and compared `!==`. Drift → fail.
2. **Canary-phrase presence for the un-comparable copies** (lines 42–58): `SKILL.md` is longer than the compact body so it *cannot* be byte-compared. Instead, 4 load-bearing phrases (`'ONE runnable check'`, `'input validation at trust boundaries'`, …) must appear **verbatim** in both `SKILL.md` and `AGENTS.md`. The comment at lines 37–41 is the key doctrine: *"canary, not full equality… Changing a rule's wording trips this, which is the reminder to propagate it everywhere."*

This is precisely the gap the repo's existing guards leave open.

### What the two existing guards cover — and don't

- **router-sync vitest** (`sk-code-router-sync.vitest.ts`) guards **paths**: every `RESOURCE_MAP` entry points at a real file; every routable doc is covered; prose-named explicit paths exist in the machine block. Its own header is explicit: *"Per-intent placement cannot be compared… this guard pins the machine block to the two things that… stay checkable."* It says nothing about **wording**.
- **comment-hygiene** guards the **absence** of forbidden tokens (`ADR-/REQ-/phase-N`) in code comments. The inverse of a canary.
- **3-runtime mirror** is a *convention*, not a guard — nothing asserts the `.opencode/.claude/.codex` agent bodies stay phrase-aligned.

A canary guard is **orthogonal** to all three: it asserts **presence + identity of load-bearing wording** across copies. That is net-new coverage.

### The single most important empirical finding

The Iron Law is **already drifted across three copies** (grep-confirmed):
- `sk-code/SKILL.md:45` → "no completion claim without fresh verification evidence from the detected surface."
- `sk-code/SKILL.md:140` → "NO COMPLETION CLAIMS WITHOUT RUNNING **SURFACE**-APPROPRIATE VERIFICATION."
- `CLAUDE.md:11` → "NO completion claims without running **stack**-appropriate verification."

So a naïve byte-equality canary would fail *on day one* — which is itself the value (it surfaces an existing inconsistency), but it also dictates the correct design: **canonicalize first, then lock a minimal stable substring**, never lock all three variants verbatim (that would freeze the inconsistency).

### Highest-value canary target: the `Review status:` triplet

`sk-code-review/SKILL.md:372` states downstream automation parses the final line by **exact string match**; the changelog `v1.3.0.0.md:13` confirms retry/gating logic depends on it. The three exact strings recur in **four files** that must stay byte-identical: `SKILL.md:350/354/358`, `README.md:89/92/152`, `changelog/v1.3.0.0.md:13`, `references/pr_state_dedup.md:64`. A stray "APPROVE" vs "APPROVED" or Markdown-bolding silently breaks dispatcher gating — the textbook load-bearing-phrase case.

### Wiring (Q2) — and a sharp caveat

The router-sync vitest is **NOT CI-gated** (grep of `.github/workflows/` for `vitest` → empty; it runs only via `npx vitest run` or the Lane C benchmark). The *proven* CI gate pattern is a standalone script invoked from a workflow yml: `comment-hygiene.yml` runs `check-comment-hygiene.sh`; `prompt-card-sync.yml` runs `check-prompt-quality-card-sync.sh`. **Therefore a canary guard should be a standalone node/py script wired into a new `.github/workflows/*.yml`, NOT a vitest** — else it inherits router-sync's non-gated status. Mirror `check-comment-hygiene.test.sh` (run_case-style fixtures) for the unit test.

### Cross-runtime (Q3)

Yes, with the canary mechanism specifically (not byte-equality): `.opencode/agents/review.md` ≈ `.claude/agents/review.md` share body text, but `.codex/agents/review.toml` is a different format wrapper — byte-compare is impossible, exactly ponytail's `SKILL.md`-vs-`AGENTS.md` situation. Lock shared invariants like "codebase-agnostic", "baseline+router standards contract", "security/correctness minimums remain mandatory". **But** note these agents deliberately use a *different* verdict vocabulary — "APPROVE/REQUEST CHANGES/BLOCK" (`review.md:264`) — than the skill's `Review status:` final line. Do **not** canary-link those two; they are separate contracts.

### Negative knowledge (Q4)

Ponytail locks only **4** phrases — discipline, not coverage. Over-guarding wording turns every legitimate reword into a CI failure and trains contributors to route around it. Do NOT canary-lock: the Iron Law's current variant strings (canonicalize first); version numbers / file counts ("18 per-feature sub-files"); example paths (`src/foo.ts:42`); the agent summary-header vocabulary; or any frequently-reworded descriptive prose. Lock only phrases that are (a) parsed by automation, or (b) safety invariants whose meaning must not silently shift.

```json
{"seat":"opus-3","lens":"rule-invariant-validation","findings":[{"id":"F1","title":"Canary-lock the Review status: triplet — automation parses it by exact string match","ponytail_source":"external/ponytail-main/scripts/check-rule-copies.js","target":"sk-code-review:SKILL.md (+ README.md, changelog/v1.3.0.0.md, references/pr_state_dedup.md)","mechanism":"Assert the exact strings 'Review status: APPROVED' / 'Review status: REQUESTED_CHANGES' / 'Review status: COMMENTED' appear verbatim across all four files; fail CI on any spelling/casing/bold drift. Downstream dispatcher gating greps the final line (SKILL.md:372, changelog v1.3.0.0).","recommendation":"Standalone node script check-rule-copies.js in sk-code-review/scripts/ that includes these 3 as INVARIANTS across the 4 source files.","value":"high","effort":"S","integration_risk":"Low — strings are already stable; guard just freezes them. Must scope to the contract files, not casual mentions.","redundant_with":"Not redundant: router-sync guards paths, comment-hygiene guards token-absence; neither guards wording.","confidence":"high"},{"id":"F2","title":"Iron Law is ALREADY drifted 3 ways — canary forces canonicalization, must not lock variants verbatim","ponytail_source":"external/ponytail-main/scripts/check-rule-copies.js","target":"sk-code:SKILL.md (lines 45,140) + CLAUDE.md:11","mechanism":"Three wordings exist: 'fresh verification evidence from the detected surface' / 'SURFACE-APPROPRIATE VERIFICATION' / 'stack-appropriate verification'. A byte-canary fails day one. Correct design: pick one canonical sentence, then lock a minimal stable substring (e.g. 'NO COMPLETION CLAIMS WITHOUT').","recommendation":"First canonicalize the Iron Law wording across SKILL.md+CLAUDE.md (separate edit), THEN add a canary on the minimal invariant substring. Locking before canonicalizing would freeze a known inconsistency.","value":"high","effort":"M","integration_risk":"Medium — requires a wording-canonicalization decision before the guard is safe to enable.","redundant_with":"None — this is a real latent defect no existing guard catches.","confidence":"high"},{"id":"F3","title":"Cross-runtime review-agent mirror canary (.opencode/.claude/.codex) — phrase-canary, not byte-equality","ponytail_source":"external/ponytail-main/scripts/check-rule-copies.js (lines 37-58, SKILL.md-vs-AGENTS.md canary path)","target":"sk-code-review consumers: .opencode/agents/review.md, .claude/agents/review.md, .codex/agents/review.toml","mechanism":".md vs .toml wrappers make byte-compare impossible (exactly ponytail's longer-SKILL.md case). Assert shared invariants — 'codebase-agnostic', 'baseline+router standards contract', 'security/correctness minimums remain mandatory' — survive in all three.","recommendation":"Add these to the same canary script's cross-mirror INVARIANTS list. Do NOT link the agents' 'APPROVE/REQUEST CHANGES/BLOCK' header vocab to the skill's 'Review status:' contract — they are deliberately distinct surfaces.","value":"medium","effort":"M","integration_risk":"Medium — risk of over-coupling two intentionally-different verdict vocabularies; keep the locked set narrow.","redundant_with":"Partially overlaps the 3-runtime mirror *convention*, but that convention has no enforcing guard today.","confidence":"medium"},{"id":"F4","title":"Wire as a standalone script + new workflow yml — NOT a vitest (router-sync vitest is not CI-gated)","ponytail_source":"external/ponytail-main/scripts/check-rule-copies.js","target":"sk-code-review:scripts/check-rule-copies.js + .github/workflows/rule-canary-sync.yml","mechanism":"grep of .github/workflows confirms NO vitest runs in CI; router-sync.vitest.ts is local/benchmark-only. The proven gate pattern is script-from-yml (comment-hygiene.yml→check-comment-hygiene.sh; prompt-card-sync.yml→check-prompt-quality-card-sync.sh).","recommendation":"Author check-rule-copies.js (node, mirrors ponytail) + check-rule-copies.test.sh (mirrors check-comment-hygiene.test.sh run_case fixtures); add rule-canary-sync.yml mirroring comment-hygiene.yml. Putting it in vitest would silently inherit non-gated status.","value":"high","effort":"S","integration_risk":"Low — reuses two existing, working CI patterns verbatim.","redundant_with":"None — this is the integration design, complementary to F1-F3.","confidence":"high"},{"id":"F5","title":"Negative-knowledge guardrail: keep the canary set tiny; lock only parsed-or-safety phrases","ponytail_source":"external/ponytail-main/scripts/check-rule-copies.js (only 4 INVARIANTS by design)","target":"sk-code:SKILL.md + sk-code-review:SKILL.md (scope discipline)","mechanism":"Each locked phrase is a permanent edit speed-bump. Over-guarding blocks legitimate rewording and breeds escape-hatch noise. Ponytail intentionally caps at 4 phrases and provides NO escape for invariants (friction is the point).","recommendation":"Lock ONLY: (a) automation-parsed strings (Review status triplet), (b) safety invariants (Iron Law minimal substring). Never lock: version numbers, file counts ('18 sub-files'), example paths, descriptive prose, agent summary-header vocab. No hygiene-ok-style escape on locked phrases; instead keep the SET small.","value":"medium","effort":"S","integration_risk":"Low — this is a constraint, not new code; prevents the guard from becoming an obstruction.","redundant_with":"None — defines the boundary that makes F1-F4 safe.","confidence":"high"}],"newInfoRatio":0.65,"negative_knowledge":["A byte-equality canary on the Iron Law would fail immediately — three live wordings exist (surface-appropriate / stack-appropriate / fresh-verification-evidence); canonicalize before locking.","Do NOT canary-link the review *agents'* 'APPROVE/REQUEST CHANGES/BLOCK' summary header to the *skill's* 'Review status: APPROVED|REQUESTED_CHANGES|COMMENTED' final-line contract — they are deliberately separate surfaces.","Do NOT implement the guard as a vitest: no vitest is CI-gated in this repo, so it would not actually block PRs (unlike ponytail's npm-test-gated script).","Do NOT over-populate the invariant list — ponytail caps at 4; locking reworded prose, version numbers, or file counts converts every legitimate edit into a CI failure.","The canary guards WORDING; the existing router-sync guard guards PATHS — they are orthogonal, so the canary does not subsume or replace router-sync."]}
```

Stdout is the only deliverable per the ROLE contract — no plan file written, no ExitPlanMode/AskUserQuestion called.
