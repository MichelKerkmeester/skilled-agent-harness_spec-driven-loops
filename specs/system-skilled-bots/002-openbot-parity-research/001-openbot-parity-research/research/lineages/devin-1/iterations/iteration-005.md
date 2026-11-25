# Iteration 5: Frontier F-2-008 — the smallest sign-in and role model

## Focus
Frontier node F-2-008 (depth 2, scope OpenBot-main/app/src/lib/auth, OpenBot-main/docs/architecture.md, turnstone-main/docs/governance.md, .skilled/skills/system-skilled-bots/runtime/lib/identity.ts): What is the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's owner/admin/member split and turnstone's RBAC can be dropped?

## Actions Taken
- Read skilled bots' repository identity resolver and its precedence order.
- Read the state-root layout and its pinned-environment protections.
- Read OpenBot's sign-in, role and provisioning rules.
- Read OpenBot's single-user fallback conditions.
- Read turnstone's role and permission model and OpenGhost's permission modes.
- Read OpenMausBot's stated local-first posture.

## Findings
1. Skilled bots has no person identity at all. Its identity is the repository, `owner/name`, resolved in a fixed order — an installed job's pinned environment value, then `bots/config.json`, then the environment and the git origin — and an unknown identity is a refusal, never a fallback, so two unknown repositories can never share state. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:3-24] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:52-76]
2. Everything a run must not be able to write lives in a user-level state root outside every checkout, owner-only (`0o700`), and the state root an installed job carries in its environment outranks the checkout's config so a run with write access cannot redirect switches, holds or leases. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:3-25] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:29-38]
3. OpenBot's sign-in is enterprise-shaped by design: Google, Microsoft or Okta from the environment plus SAML and OpenID Connect providers registered at runtime and routed by email domain; one resolver answers both "whose threads are these" and "which bots may they run", so the two can never disagree. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:418-419]
4. OpenBot's administrative model is a floor plus delegation: `INITIAL_ADMIN_EMAILS` always makes an address an administrator, everybody else's role is decided on the People screen, every change writes an audit row, SCIM can provision people, and removing somebody deletes their sessions and denies their address. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:420-430]
5. OpenBot's single-user fallback is one flag plus an address restriction: with no identity provider the server refuses to start unless `OPENBOT_SINGLE_USER=true` declares every request the one fixed administrator, and it still refuses to start when any configured public URL resolves to a public address; loopback is silent and a private address is allowed with a warning. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:427]
6. Turnstone's minimal useful shape is three roles — admin, operator, viewer — with granular permission strings and API tokens, plus tool policies that decide allow, deny or ask per tool pattern. The roles are more than a small team needs; the read-only/operator split is the part worth keeping. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/governance.md:9-30]
7. OpenGhost uses three permission modes per session — Ask, Auto, Full access — rather than user roles. It is a posture chosen for the work, not an identity, and it is the cheapest way to express "this bot may act freely in its own folder but must ask outside it". [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/README.md:155]
8. OpenMausBot states the same posture skilled bots already has: local-first, bring-your-own-agent, no cloud requirement. None of the reference repos that target one person adds a sign-in system. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/README.md:9]
9. Smallest model for a few people on one machine or host: no sign-in service. Take the operator's identity from the host the team already trusts (OS user, SSH key, or a `--as <name>` flag on the CLI), record it on the three acts that matter (definition approval, needs-you answer, run record), and add one optional read-only viewer. Per-bot permission becomes one list of names or a group, checked when a run is enqueued or an answer is accepted. [INFERENCE: based on findings 1-8]
10. Gap: skilled bots records no actor anywhere. A definition approval records the source kind (`install`, `enable`, `manual-run`) but not who did it; a needs-you answer records text and time but not who answered; a run record has no requester field. Adding one `actor` string to those three records is the smallest change that makes the model above real. [INFERENCE: based on findings 1 and 2] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:29-36]

## Ruled Out
- Adding Better Auth or any identity provider. OpenBot needs it because it serves many organizations over the network; a small team on one host already has an identity in the OS or SSH layer.
- Copying the owner/admin/member split. Owner and admin are the same authority in OpenBot's own helper, so the three names collapse to two behaviours, and a few people do not need a delegation tree.
- Copying turnstone's permission strings. They exist to let an administrator compose custom roles across endpoints; a small team needs one gate, not a policy language.

## Dead Ends
- Looking for a user table in skilled bots' state root: there is none, only per-identity repository state.
- Treating the status index as an identity source: it is keyed by repository identity, not by person.

## Edge Cases
- Ambiguous input: "sign-in" could mean authenticating to a shared host or authenticating to a bot UI. The evidence supports host-level identity for the first and no separate sign-in for the second, because the CLI runs as the host user.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/identity.ts
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
- .skilled/skills/system-skilled-bots/runtime/lib/approval.ts
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/turnstone-main/docs/governance.md
- specs/system-skilled-bots/context/OpenGhost-main/README.md
- specs/system-skilled-bots/context/OpenMausBot-main/README.md

## Assessment
- New information ratio: 0.90
- Questions addressed: F-2-008 (sign-in and role model for a few people)
- Questions answered: F-2-008

## Reflection
- What worked and why: the identity resolver's precedence order and the state root's pinned-environment rule together answer the security half of the question without any new design. The remaining design work is one actor field and one permission list.
- What did not work and why: reading OpenBot's auth client files produced mostly hosted-sign-in plumbing; the architecture doc's security-boundaries list was the compact source.
- What I would do differently: read `repo-config.ts` for the identity pattern and retention defaults together, since both bound what a shared host can store.

## Recommended Next Focus
Frontier node F-2-009 (depth 2): shared versus per-person memory when a few people use the same bots, and what OpenBot's memory model does that per-bot files do not.
