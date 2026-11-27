# Iteration 5: Phase 008-vault — the three lifted rakazo files

## Focus

Phase 008-vault, which no frontier node covers and which the 003 synthesis calls the largest addendum. The phase lifts three rakazo files by name, so this iteration read each one for the mechanism the plan's "lifted with its notice" line does not state.

Scope read: `context/rakazo-main/packages/core/src/integrations/vault.ts`, `context/rakazo-main/packages/core/src/messages/secret-matcher.ts`, `context/rakazo-main/packages/core/src/node/secrets-guard.ts`, `003-openbot-parity-build/008-vault/spec.md`.

## Findings

1. **The lifted matcher carries a cost model and a hard state cap, and the plan's "lifted with its notice" line states neither.** `createSecretMatcher` scans each value in turn until the scans have cost about what building the one-pass matcher would — `BUILD_COST = 8`, "building costs about a Map write per code unit of the values, a scan a compare" — and only then builds the Aho–Corasick index [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:23-53]. The index itself is capped at `MAX_SECRET_MATCHER_STATES = 1_000_000`, past which it falls back to the per-value scan, because "very long values (keys of thousands of characters, each in several encodings) could push past what a Map holds" [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:16-21]. Phase 008 says the module is "rakazo's one-pass multi-value matcher, lifted with its notice and a statement of changes" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:119]. A builder who reimplements the matcher from its description will build the index unconditionally and can exhaust memory on a long key; the two constants are the part that makes the lift safe. (observed)

2. **The matcher returns merged ranges, not matches, and that is what stops a redactor leaving half a secret behind.** `ranges(text)` returns "the stretches values cover, in order, as [start, end); overlapping matches make one stretch" [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:5-12]. Phase 008's `leak-checks.md` holds "every check" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:55] and the plan names no rule for two secrets that overlap in one text. A redactor that replaces each match in turn leaves the tail of the longer secret in place when a shorter one sits inside it; the reference's merged-stretch return is the fix and it is one line of the lifted contract. (observed)

3. **The placeholder guard works by holding the known placeholder values and refusing a non-development environment that still carries one, and the plan's `bots secret set` has no such refusal.** `DEDICATED_SECRET_PLACEHOLDERS` is a `Set` of the dev and example values, `isDevSecretAllowed` gates on `RAKAZO_ALLOW_DEV_SECRETS`, `VITEST` and `NODE_ENV`, and `resolveAuthSecret` throws `RUNTIME_SECRETS_ERROR` when a non-dev environment holds `DEV_AUTH_SECRET_PLACEHOLDER` [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-55]. Phase 008 lifts `secrets-guard.ts` as "rakazo's placeholder guard and constant-time compare" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:120] and its `bots secret set` refuses nothing on the value's content. A secret whose value is `dev-secret-change-me-please-32chars` is worse than no secret, because the run records `secretsUsed` and the operator believes the key is set. (observed)

4. **The reference grants a secret to a set of bots; the plan grants a bot a list of secrets, and only the reference's direction survives a new bot.** `VaultBots` is `{ allBots: boolean; botIds: string[] }` — "which of the owner's bots may use an item: every one, or those in `botIds`" [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:40-41], and `vaultAccessControls` renders the picker from it [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:43-60]. Phase 008 parses a bot's `secrets:` field and injects the named values [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:3]. Both directions express the same pairs, but a bot added tomorrow gets nothing under the reference's model and gets whatever its author writes under the plan's. For a small team the plan's direction is the cheaper one to author and the reference's is the safer default; the evidence supports keeping the plan's field and adding the reference's `allBots` flag so a shared key can be granted once. (observed)

5. **The reference never shows the secret store's own error, only one of three fixed refusals, because the other errors could echo the value.** `secretAnswerRefusal` maps a server error to `"blocked" | "unchosen" | "full"` by exact message match and returns `undefined` for anything else, with the reason stated: "Its other errors could echo the value, so they are never shown" [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:25-38]. Phase 008's `leak-checks.md` covers redaction of a value in `stdout.log` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:55], which is a different rule: redaction removes a known value from text, while the reference's rule refuses to surface an unknown error at all. A keychain command that fails with the value in its argv or its message is the case the plan does not cover. (observed)

## Ruled Out

- **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it.
- **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them.
- **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4.

## Dead Ends

- A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above.
- A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none. The plan's per-bot direction and the reference's per-item direction are different designs, not conflicting claims.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:1-55
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-55
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:20-60
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:3, 50-55, 99-131
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:147
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:150-167
- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent at read time)

## Assessment

- New information ratio: 0.70
- Questions addressed: phase 008-vault
- Questions answered: none of the tracked questions; this is a broadening iteration

## Reflection

- What worked and why: reading the lifted files rather than the plan's description of them. The plan says "lifted with its notice" three times, and each file holds a constant or a return shape that the description omits and that a reimplementation would get wrong.
- What did not work and why: looking for a constant-time compare in the first 55 lines of `secrets-guard.ts`. The file is 188 lines and the compare is further down; the search cost one call and added nothing.
- What I would do differently: for a phase that lifts files by name, read the whole file rather than its head, because the mechanism is usually in the middle.

## Recommended Next Focus

Phase 011-messaging-channels: tinychannels is the only reference with a channel adapter contract, a capability vocabulary and a conformance suite, and the 003 synthesis calls 011 the widest phase.
