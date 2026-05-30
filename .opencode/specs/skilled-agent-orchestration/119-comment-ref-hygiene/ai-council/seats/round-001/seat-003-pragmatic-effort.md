---
round: 1
seat: seat-003
executor: simulated-pragmatic-lens
lens: Pragmatic (Effort / MVP)
status: ok
timestamp: 2026-05-30T00:00:00Z
simulated: true
---

# Seat 003 — Pragmatic / Effort

## Proposed Plan

Stop trying to make four runtimes "behave" via injected prose. The pre-commit gate
already gives a 100% deterministic guarantee at the only checkpoint that matters
(commit). The single highest-value, lowest-effort fix is to **harden the
runtime-agnostic gate and its install path**, then add ONE cheap prompt-time reminder
line for early feedback. Behavioral injection is a nice-to-have; the gate is the
guarantee.

## Reasoning (effort lens)

What does the WITHOUT-AGENTS.md test actually prove operationally? That LLM
self-correction is not a reliable control surface — it depends on the rule being in
context, and context is exactly what drifts (this is literally the problem statement
in spec.md §2: "attention drift by commit 20"). Spending engineering effort to make a
70-line markdown reliably steer four different models' generation is high-effort,
low-determinism work. The thing that already works deterministically — the pre-commit
gate — is where effort compounds.

Coverage-per-effort table (my core deliverable):

| Fix | Effort | Coverage | Determinism | Coverage/Effort |
| --- | --- | --- | --- | --- |
| A. Verify/repair pre-commit install on all clones (install-hooks.sh in setup, CI assert) | XS (~1h) | 100% at commit, all 5 runtimes | Deterministic | **HIGHEST** |
| B. Add a CI server-side check (re-run checker in pipeline) so `--no-verify` cannot bypass | S (~2h) | 100% at merge, bypass-proof | Deterministic | **HIGH** |
| C. One-line constitutional reminder in the shared advisor pipeline (all 5 prompt hooks) | S (~3h) | partial, probabilistic, early | Probabilistic | MEDIUM |
| D. Per-runtime hard system-prompt rule | M (~5h, 4x runtime quirks) | partial, probabilistic | Probabilistic | LOW |
| E. Build write-time hooks for the 4 runtimes that lack them | XL (blocked) | n/a | n/a | N/A (ADR-001..004: API doesn't exist) |

The trap in this briefing is that it frames the goal as "make the hooks enforce."
Hooks at prompt-time can only NUDGE; they cannot ENFORCE — a model can always ignore
injected text. The only true ENFORCEMENT surfaces are (1) Claude's PostToolUse (which
is warn-only anyway, exits 0) and (2) the git gate (which actually blocks). So the
pragmatic reframe: prompt injection buys earlier, cheaper feedback; the gate buys the
guarantee. Invest accordingly.

## The one prompt-time fix worth doing (and keeping cheap)

Fix C, scoped to ~20 tokens, riding the existing `additionalContext` channel:

> "Code comments: no spec-path / packet / ADR-/REQ-/CHK-/task ids. Keep the WHY,
> drop the label. (pre-commit will block violations.)"

Why it is worth the 3h: it gives Gemini/Codex/Devin/OpenCode sessions the same early
signal AGENTS.md currently provides, so violations get fixed at write time instead of
bouncing off the gate and forcing a re-edit cycle. The parenthetical naming the gate
is deliberate — it tells the model the rule is enforced, which empirically raises
compliance more than an unenforced "please."

## What I would NOT build

- Do not paste the constitutional markdown into context (token waste, banner
  blindness — agrees with seat-002).
- Do not attempt write-time hooks on the four runtimes (blocked — agrees with all
  seats; ADR-001..004 settled this).
- Do not over-tune the checker for the WITHOUT-AGENTS.md scenario — AGENTS.md will be
  present in normal operation; the WITHOUT test is a stress probe, not the steady
  state.

## Risks & Trade-offs

- Leaning on the gate means OpenCode/Codex/Gemini/Devin authors see the violation
  only at commit, costing a re-edit loop. Accepted: cheaper than chasing reliable
  generation-time steering. Fix C narrows this for cooperative models.
- Server-side CI (Fix B) needs CI infra that may not exist yet; if absent, Fix A
  alone still covers local commits.

## Assumptions and Evidence Gaps

- ASSUMPTION: the pre-commit gate is installed in the environments where these models
  run. The briefing says it is "confirmed working" — but the WITHOUT test models
  still WROTE the comment; they were not blocked at commit because the test measured
  the WRITE, not a commit attempt. GAP: confirm the gate actually fires in each
  runtime's commit path, not just in the maintainer's local repo.
- ASSUMPTION: a re-edit loop is acceptable UX for the non-Claude runtimes. Reasonable
  for an internal tooling repo.

## Alternative Challenged

REJECTED: "the fix is better prose / a stronger constitutional entry." The entry is
already well-written; the problem is it is not PUSHED and, even when pushed, prose is
probabilistic. More/better prose does not change the determinism class. Effort spent
polishing prose is effort not spent on the gate that actually guarantees the outcome.

## Confidence

80: High confidence that the gate is the real guarantee and behavioral injection is
secondary. The one soft spot is the unverified assumption that the gate is universally
installed in the runtimes' commit paths — if it is not, Fix A's priority is even
higher, not lower.
