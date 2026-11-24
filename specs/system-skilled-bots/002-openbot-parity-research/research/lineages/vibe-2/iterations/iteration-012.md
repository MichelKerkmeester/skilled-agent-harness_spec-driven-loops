# Iteration 12: Reuse — the exact files and licences to lift

## Focus

Broadening pass. The design is settled across iterations 6 to 11, so this iteration answers the question a build packet asks first: **what can be lifted directly**, with the repo, path and licence for each, and what has to be rewritten because the host language or the storage differs.

## Actions Taken

1. Read every reference repo's `LICENSE` for its actual terms.
2. Sized rakazo's vault, secrets-guard and secret-matcher files.
3. Sized OpenBot's `computer-token.ts` and `computer-start.ts`.
4. Located turnstone's Fernet keyring to check whether its code is liftable.

## Findings

1. **The licences differ, and one is a hazard.** OpenBot is **MIT**; OpenMausBot, rakazo, turnstone and buzz are **Apache 2.0**; OpenGhost and hermes-muse are **MIT**; and **openhuman is GPL-3.0** — copyleft, so nothing from it can be lifted into a permissively licensed product. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1]
2. rakazo's `packages/core/src/integrations/vault.ts` is **174 lines of TypeScript**, Apache 2.0, and is the closest drop-in for the secret store's policy layer: `siteHost`, `secretAnswerRefusal` and the fixed-refusal vocabulary. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:1]
3. rakazo's `packages/core/src/node/secrets-guard.ts` is **188 lines** and is a **placeholder guard, not a store**: it refuses dev placeholders at startup rather than holding a value. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1]
4. rakazo's `packages/core/src/messages/secret-matcher.ts` is **199 lines** and is the leak-detection equivalent of skilled bots' `findSecretLiteral`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:1]
5. OpenBot's `shared/computer-token.ts` is **70 lines of TypeScript, MIT**, and is a self-contained HMAC derivation with a versioned label — liftable as-is if per-bot tokens are ever needed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1]
6. OpenBot's `shared/computer-start.ts` is **13 lines**: the container spec is configuration, not code, so there is nothing to lift. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1]
7. turnstone's keyring is **Python** (Fernet), so its *rule* is liftable and its code is not. [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests/test_mcp_crypto.py:1]
8. So the reuse list is **three TypeScript files from rakazo and one from OpenBot**, all permissive, totalling about 630 lines of reference rather than code to copy wholesale. [INFERENCE: from findings 2, 3, 4 and 5]

## The reuse table

| What | Repo | Path | Licence | Lift or rewrite |
| --- | --- | --- | --- | --- |
| Secret policy vocabulary | rakazo | `packages/core/src/integrations/vault.ts` (174 lines) | Apache 2.0 | **lift**, keep the NOTICE |
| Leak matcher | rakazo | `packages/core/src/messages/secret-matcher.ts` (199 lines) | Apache 2.0 | **lift**, compare against `findSecretLiteral` and keep the better one |
| Placeholder guard | rakazo | `packages/core/src/node/secrets-guard.ts` (188 lines) | Apache 2.0 | **lift the rule**, not the file: skilled bots has no dev placeholders |
| Per-bot token derivation | OpenBot | `shared/computer-token.ts` (70 lines) | MIT | **lift** if per-bot tokens are ever needed; not needed for a small team |
| Container spec | OpenBot | `shared/computer-start.ts` (13 lines) | MIT | **read as a checklist**, nothing to copy |
| Keyring rule | turnstone | `tests/test_mcp_crypto.py` and the crypto module | Apache 2.0 | **rewrite**: Python, and the rule is one paragraph |
| Masked-field injection | OpenBot | `api/openapi.yaml` `computer_request_secret` | MIT | **rewrite** as a no-echo prompt |
| Connection registry | OpenBot | `api/openapi.yaml` apps and connections | MIT | **rewrite**: the shape is the value, not the code |
| **Nothing** | openhuman | — | **GPL-3.0** | **do not lift** |

**Attribution.** Apache 2.0 files need the licence text and a `NOTICE` naming rakazo; MIT files need the copyright line. Both are one file each in the product's root, and both are cheaper than rewriting 174 lines of policy code.

## Ruled Out

- Lifting anything from openhuman: GPL-3.0 is copyleft, and a permissive product cannot absorb it.
- Lifting turnstone's OAuth runtime: it is Python, and the per-user path is dark by default, so the rule is worth more than the code.
- Copying OpenBot's connection registry: it is an OpenAPI description of a server this product does not have, so the shape transfers and the code does not.

## Dead Ends

- Looking for a TypeScript secret store in OpenBot: there is none. OpenBot's vault is server-side and its client only renders forms, so the only liftable TypeScript store in the eight repos is rakazo's.

## Edge Cases

- Ambiguous input: "reuse" could mean code to copy or designs to copy. Selected interpretation: code first, with designs marked as rewrite, because a build packet needs to know which is which.
- Contradictory evidence: iteration 5 recorded "all three comparison repos are Apache 2.0", which is true of the three it examined; this iteration widens the check to all eight and finds MIT and GPL-3.0 among them. Both records stand, and the wider check supersedes the narrower one.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1
- specs/system-skilled-bots/context/turnstone-main/LICENSE:1
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1
- specs/system-skilled-bots/context/buzz-main/LICENSE:1
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:1
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:1
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1
- specs/system-skilled-bots/context/turnstone-main/tests/test_mcp_crypto.py:1

## Assessment

- New information ratio: 0.85
- Questions addressed: what can be lifted directly, with repo, path and licence; what must be rewritten
- Questions answered: what can be lifted directly, with repo, path and licence; what must be rewritten

## Reflection

- What worked and why: reading all eight `LICENSE` files rather than trusting the earlier note. The earlier note was correct about the three repos it examined and wrong as a general statement, and the GPL-3.0 repo is the one that would have caused a real problem.
- What did not work and why: expecting OpenBot's vault to be liftable TypeScript. It is a server-side feature described in OpenAPI, so its value is the shape of the endpoints, not the code behind them.
- What I would do differently: check licences in the first iteration of any reuse question. A licence is a hard constraint on a design, and finding it at iteration 12 means eleven iterations of design that could have been constrained by it.

## Recommended Next Focus

The ranked build order: given three stores, one schema change, a reuse list and a terminal verdict, what order should a first build packet take, and what is the smallest first slice that proves the design?
