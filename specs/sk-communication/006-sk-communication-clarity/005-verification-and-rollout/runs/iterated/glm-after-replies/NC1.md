Here is the packet, in plain terms: it decides which rule file you read before you act, what a code comment may contain and how a reply itself must read.

REPO RULES.md holds no rules of its own. It only routes. Take the thing you are about to do, say claiming done or diagnosing a failure, and match it against the trigger table. Every rule file the matching row names gets read before the action, because a rule read afterwards is only a post-mortem. If nothing fires, you stop there rather than hunting for a rule to apply.

The communication rules are the odd ones. Their trigger is the reply, not the repo, so they bind even in a turn that writes nothing. In practice: the first line carries the answer, one idea sits in one sentence, a list stops at five items, a table stays out of a reply, the close names what the reader does next. Two clauses of the pasted section hold with no trigger at all: delivery never weakens a claim, and when a style rule would weaken the answer, the answer wins.

The flagged directive, comment hygiene, fits in one sentence: a comment carries the reason the code behaves as it does, the durable WHY, and none of the paperwork. It means no ADR, REQ, CHK or task ids, no spec paths, no packet or phase numbers. Those are the least stable things in the repository. They get renamed, archived and closed while the code they describe keeps running, so the comment ends up pointing at nothing. A WHY goes stale exactly when the behavior changes, which is the moment you would fix the comment anyway. The ids still have a home, the tracker. They just do no work inside the source, where you are reading behavior and not paperwork. Because the directive is a hard blocker, no later instruction overrides it. The pre-commit gate makes that mechanical: a violation blocks the commit.

The same comment, both ways. This one names the paperwork:

```ts
// Implements REQ-231, see specs/auth/003-login/spec.md (ADR-17, phase 2)
```

This one names the reason the code exists:

```ts
// A short network drop must not log the user out, so the session is
// refreshed once per mount rather than on every request.
```

The first answers where the requirement came from. The second answers why the code exists.

Nothing is blocked on you. If one rule in the packet is still the foggy one, name it and it gets this treatment.
