# REPO RULES

Repo-local operating rules for this repository. `AGENTS.md` §3 binds you to this
document; this document routes you to the one rule file that governs what you are
about to do.

**This file is a router, not a rulebook.** It holds no rules of its own. Match your
situation in the trigger table, open that file, follow it. Everything else stays
unread.

---

## 1. HOW TO USE THIS

1. **Match on what you are about to do**, not on the topic of the request. The
   trigger is the action, not the subject matter.
2. **Load the matched file before the action it governs** — before the first edit,
   not after. A rule read afterwards is a post-mortem.
3. **A file already in context is not re-read.**
4. **Two triggers fire → load both.** They are written to compose; where they
   appear to conflict, the more specific trigger wins.
5. **Nothing fires → `AGENTS.md` alone governs.** Do not go looking for a rule to
   apply.

### Precedence

| Level | Source | Can be overridden? |
|-------|--------|--------------------|
| 1 | Every `AGENTS.md` §1 hard blocker — the Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene — and every mandatory gate in §2 | No |
| 2 | An explicit, in-the-moment operator instruction | — it is the instruction |
| 3 | These rule files | Only by level 1 or 2 |
| 4 | General judgment | By anything above |

A rule file may tighten `AGENTS.md`. None of them relaxes a HARD BLOCK, and none
authorizes an action `AGENTS.md` forbids.

---

## 2. TRIGGER TABLE

| You are about to… | Load | It settles |
|-------------------|------|-----------|
| Add a file, module, class, interface, option, layer, or dependency · generalize something that works · write "flexible", "future-proof", "might need", "best practice" · add a test beyond the coverage floor | [`repo-rules/overengineering.md`](repo-rules/overengineering.md) | Whether this should exist at all, and at what size |
| Touch a file outside the ask · fix something you noticed in passing · rename, reformat, or delete beyond the named area · deviate from an approved plan | [`repo-rules/scope-discipline.md`](repo-rules/scope-discipline.md) | What is yours to change, and how to raise what isn't |
| Say "done", "works", "fixed", "passing", "no regressions" · report a result · quote a number · act on a tool's or sub-agent's success report · close out a turn | [`repo-rules/evidence-and-proof.md`](repo-rules/evidence-and-proof.md) | What counts as proof, how a green run lies, and what an honest close-out contains |
| Delete, overwrite, migrate, deploy, publish, send, install · force-push or rewrite history · change a shared contract · touch auth, data, or config | [`repo-rules/blast-radius.md`](repo-rules/blast-radius.md) | Reversibility, the rollback sentence, and when to stop for a yes |
| Diagnose a failure · make a red check green · attempt the same fix twice · add a special case, retry, sleep, or broadened catch | [`repo-rules/root-cause.md`](repo-rules/root-cause.md) | Fixing the producer instead of the symptom, and when to level up to the seam |
| Answer without certainty · contradict the operator · fill a gap with a plausible guess · hit a contradiction between two things that must both be true | [`repo-rules/uncertainty-and-honesty.md`](repo-rules/uncertainty-and-honesty.md) | Confidence bands, UNKNOWN, and contradiction halts |

---

## 3. INDEX

| Rule | One-line summary |
|------|------------------|
| [Overengineering](repo-rules/overengineering.md) | Build the smallest thing that solves the stated problem; climb a rung only by naming what fails below it. |
| [Scope discipline](repo-rules/scope-discipline.md) | The requested scope is the deliverable — adjacent problems get named, not fixed. |
| [Evidence and proof](repo-rules/evidence-and-proof.md) | A claim is only as strong as the observation behind it. |
| [Blast radius](repo-rules/blast-radius.md) | Size effort to what the change can break; no irreversible step without a named rollback and a yes. |
| [Root cause](repo-rules/root-cause.md) | Fix the producer, not the symptom; every fix names the mechanism. |
| [Uncertainty and honesty](repo-rules/uncertainty-and-honesty.md) | Never fabricate; mark the confidence you actually have. |

Each rule file expands `AGENTS.md` and is bounded by it: where a rule file appears to
permit something `AGENTS.md` restricts, `AGENTS.md` wins and the rule file is wrong.

---

## 4. SCOPE OF THIS DOCUMENT

**In:** how to think and act — restraint, scope, evidence, risk, diagnosis, honesty.

**Out:** skill routing, workflow selection, spec-folder mechanics, and agent
dispatch. Those are owned by `AGENTS.md` §2 and the skills it routes to, and are
deliberately absent here so there is exactly one place to change them.
