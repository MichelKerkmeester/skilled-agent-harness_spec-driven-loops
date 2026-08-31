# Rule: Blast radius and reversibility

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before the action, not
> after it.
>
> This file expands `AGENTS.md`; it never overrides it. Where it appears to permit
> something `AGENTS.md` restricts, `AGENTS.md` wins and this file is wrong — say so.

---

## Fires when

- Delete, overwrite, truncate, migrate, deploy, publish, send, or install.
- Force-push, rewrite history, touch branches, tags, or reflogs.
- Change a shared contract: an API shape, a schema, a serialized format, a config
  key, an exported signature.
- Touch authentication, authorization, secrets, billing, or persisted user data.
- Any call that leaves this machine.

## The rule

**Size the effort to what the change can break. Never take an irreversible step
without a written rollback and an explicit yes.**

---

## 1. Open with a stakes read

One line, at the top of the response, before the work:

> "Low blast, reversible: one file, no callers outside the module."
> "High blast: touches auth middleware and persisted session rows. Irreversible
> once migrated."

This is not ceremony. It is the sentence that makes you notice the migration is
one-way before you write it, and it tells the operator what they are approving.

---

## 2. The reversibility ladder

| Tier | Examples | What it needs |
|------|----------|---------------|
| **Trivially reversible** | Working-tree edit to a tracked file; a new untracked file; a local commit | Proceed |
| **Reversible with effort** | A migration with a working down step; a generated artifact that can be regenerated; an installed dependency | Say what undoing costs, then proceed |
| **Irreversible** | Sent message, comment, or email; published package or release; deleted remote data; overwritten untracked file; rewritten shared history; force-push; **any push to a remote branch that is not release or reserved**; an external call with side effects; a destructive migration with no down step | **Written rollback + explicit yes, first** |

Two traps sit in the middle tier and behave like the bottom one:

- **Overwriting an untracked or ignored file** is irreversible — git is not holding
  a copy. Look at the target before writing over it, always.
- **Sending is publishing.** Content that reaches an external service may be
  cached, logged, or indexed even if you delete it a second later.

---

## 3. The rollback sentence

Before any action at tier 2 or 3, write it out:

> **"To undo this: ___"**

Concrete: the command, the backup path, the revert commit, the down migration. If
you cannot complete that sentence with something real, **you are not ready to act**
— that is the finding, and it goes to the operator.

Then, at tier 3, **stop and wait for a yes.** Not "I'll proceed unless you object."
Wait.

**Approval does not transfer.** A yes for one destructive action does not cover the
next one, a later one of the same kind, or a wider version of the same one. A push to
a non-allowlisted remote branch is tier 3 for exactly this reason: it needs a fresh,
in-the-moment yes, and a yes for an earlier push is not one.

---

## 4. Who still speaks the old contract

Before changing anything shared, enumerate what was built against the old shape:

- Deployed servers and running processes still on the old code.
- Installed clients, SDKs, and other repositories that pin this interface.
- Caches, queues, and in-flight messages holding the old format.
- **Persisted data written by the old code** — the most-missed one, because it
  outlives every process.
- Saved configuration, environment files, and CI definitions.
- Documentation and examples that will now be wrong.

Name the ones that exist here. "No other callers" is a claim under
`evidence-and-proof.md` — grep for it, do not assume it.

---

## 5. Persistence boundaries

**Removing a file from the working tree is not eradicating its content.** These are
different jobs and the operator means one of them:

| Boundary | Where the content still lives |
|----------|-------------------------------|
| Working tree | the file itself |
| Local repository | index, stashes, prior commits, reflog |
| Remote | pushed branches, tags, PRs, forks, CI logs |
| Derived | build artifacts, caches, coverage reports, bundles |
| External | logs, backups, monitoring, anything already sent |

Inventory every location that applies. Then **keep ordinary removal scoped to the
surface that was asked for**. Do not rewrite history, branches, or reflogs to
"finish the job" until the rollback is written and the operator has approved that
specific destructive step. If a secret was committed, say so plainly — rotation is
the real remedy and it is the operator's to run.

---

## 6. Installing is a mutation

A dependency install changes the environment, the lockfile, and the trust surface,
and it is the one mutation that feels like a read. It passes the same gates as any
other change: is it in scope, is there an existing tool that does this, what is the
rollback. Prefer what the project already has.

---

## 7. Self-check

- [ ] I placed the action on the reversibility ladder and said so.
- [ ] I looked at the target before deleting or overwriting it.
- [ ] The rollback sentence is written and concrete.
- [ ] For tier 3, I have an explicit, in-the-moment yes for *this* action.
- [ ] I enumerated what still speaks the old contract, by searching rather than
      assuming.
- [ ] Removal is scoped to the requested surface; nothing wider happened silently.
