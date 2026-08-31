# REPO RULES

Repo-local operating rules. `AGENTS.md` **Gate 5 (§2)** makes reading this mandatory
before your first write of the session; this document then routes you to the one rule
file that governs what you are about to do. **It is a router, not a rulebook** — it
holds no rules of its own.

---

## 1. HOW TO USE THIS

1. **Match on the action you are about to take**, not the topic of the request.
2. **Load before the action.** A rule read afterwards is a post-mortem.
3. **A file already in context is not re-read.**
4. **Two triggers fire → load both.** They compose; the more specific wins on conflict.
5. **Nothing fires → `AGENTS.md` alone governs.** Do not hunt for a rule to apply.

### Precedence

| Level | Source | Can be overridden? |
|-------|--------|--------------------|
| 1 | Every `AGENTS.md` §1 hard blocker — the Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene — and every mandatory gate in §2 | No |
| 2 | An explicit, in-the-moment operator instruction | — it is the instruction |
| 3 | These rule files | Only by level 1 or 2 |
| 4 | General judgment | By anything above |

A rule file may tighten `AGENTS.md`. None relaxes a HARD BLOCK or authorizes what
`AGENTS.md` forbids. Gate 5 does not change that: it makes the **load** mandatory,
while what you load stays at level 3 — the obligation to read is tier 1, the content
is not.

---

## 2. TRIGGER TABLE

| You are about to… | Load | It settles |
|-------------------|------|-----------|
| Add a file, module, class, interface, option, layer, or dependency · generalize something that works · write "flexible", "future-proof", "might need", "best practice" · add a test beyond the coverage floor | [`overengineering.md`](repo-rules/overengineering.md) | Whether this should exist at all, and at what size |
| Touch a file outside the ask · fix something noticed in passing · rename, reformat, or delete beyond the named area · deviate from an approved plan | [`scope-discipline.md`](repo-rules/scope-discipline.md) | What is yours to change, and how to raise what isn't |
| Say "done", "works", "fixed", "passing", "no regressions" · report a result · quote a number · act on a tool's or sub-agent's success report · close out a turn | [`evidence-and-proof.md`](repo-rules/evidence-and-proof.md) | What counts as proof, how a green run lies, what an honest close-out contains |
| Hand work to another runtime: a CLI executor, sub-agent, fan-out lineage, or deep loop · compose the prompt one will act on · accept or quote what one returned · answer a judgment question from your own reading alone | [`delegation-and-orchestration.md`](repo-rules/delegation-and-orchestration.md) | The orchestrating posture, what a brief must carry, why one model is one opinion |
| Delete, overwrite, migrate, deploy, publish, send, install · force-push or rewrite history · change a shared contract · touch auth, data, or config | [`blast-radius.md`](repo-rules/blast-radius.md) | Reversibility, the rollback sentence, when to stop for a yes |
| Diagnose a failure · make a red check green · attempt the same fix twice · add a special case, retry, sleep, or broadened catch | [`root-cause.md`](repo-rules/root-cause.md) | Fixing the producer instead of the symptom, and when to level up to the seam |
| Answer without certainty · contradict the operator · fill a gap with a plausible guess · hit a contradiction between two things that must both be true | [`uncertainty-and-honesty.md`](repo-rules/uncertainty-and-honesty.md) | Confidence bands, UNKNOWN, contradiction halts |

---

## 3. INDEX

| Rule | Summary |
|------|---------|
| [Overengineering](repo-rules/overengineering.md) | Build the smallest thing that solves the stated problem; take a costlier move only by naming what fails at the cheaper one. |
| [Scope discipline](repo-rules/scope-discipline.md) | The requested scope is the deliverable — adjacent problems get named, not fixed. |
| [Evidence and proof](repo-rules/evidence-and-proof.md) | A claim is only as strong as the observation behind it. |
| [Delegation and orchestration](repo-rules/delegation-and-orchestration.md) | Delegating makes you the orchestrator; brief with evidence, and no single model's verdict closes a question. |
| [Blast radius](repo-rules/blast-radius.md) | Size effort to what the change can break; no irreversible step without a named rollback and a yes. |
| [Root cause](repo-rules/root-cause.md) | Fix the producer, not the symptom; every fix names the mechanism. |
| [Uncertainty and honesty](repo-rules/uncertainty-and-honesty.md) | Never fabricate; mark the confidence you actually have. |

Each file expands `AGENTS.md` and is bounded by it: where a rule file appears to
permit something `AGENTS.md` restricts, `AGENTS.md` wins and the rule file is wrong.

---

## 4. SCOPE OF THIS DOCUMENT

**In:** how to think and act — restraint, scope, evidence, risk, diagnosis, honesty,
and the posture to hold when work is handed to another runtime.

**Out:** skill routing, workflow selection, spec-folder mechanics, and the *mechanics*
of agent and CLI dispatch — which agent, which command, which model, which flags.
Those belong to `AGENTS.md` §2 and the skills it routes to, and are deliberately
absent here so each has exactly one place to change. The line is between plumbing and
posture: how to dispatch is theirs, how to think while dispatching is ours.
