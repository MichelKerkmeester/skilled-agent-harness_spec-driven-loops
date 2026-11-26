---
title: "Design: secret name grammar, environment key and keychain account"
description: "The one name grammar the vault accepts, the map from a name to its child environment key, the keychain account a name is stored under, the accept and refuse sets the tests use and the upgrade note for bots that declared secrets before the vault existed."
trigger_phrases:
  - "secret name grammar"
  - "secret environment key mapping"
  - "keychain account name"
  - "vault upgrade note"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Secret name grammar, environment key and keychain account

This note closes gaps 1, 2 and 6 of the plan-depth research for this phase. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:154-159] The grammar and the environment key are already fixed by the packet contract, and this phase adopts them as written: see `contracts/records.md` section 8, "Name grammar" and "Environment key". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:291] Nothing below changes them. What this note adds is where the grammar is checked, the exact accept and refuse sets, the keychain account and the upgrade path.

Paths are repository-relative. `L/` means `.skilled/skills/system-skilled-bots/runtime/lib/`.

---

## 1. THE GRAMMAR

| Rule | Value | Source |
|------|-------|--------|
| Pattern | `^[a-z0-9][a-z0-9-]*$`, the bot id pattern | `contracts/records.md` section 8. The pattern is `BOT_ID_PATTERN` today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88] |
| Length | 1 to 64 characters | `contracts/records.md` section 8 |
| One constant | `secrets.ts` exports `SECRET_NAME_PATTERN` as the same regex object `BOT_ID_PATTERN` and `SECRET_NAME_MAX = 64`. `definition.ts` imports neither: it keeps its own `BOT_ID_PATTERN` and adds the length check beside it, because `definition.ts` may import only its own group and `secrets.ts` imports `state-root.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md:52] | decided here |

**Where it is checked.** Two places, one rule.

1. **Definition parse.** After `optionalString` returns a value for `secrets` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:263-267], a value that fails the pattern or is longer than 64 characters returns `{ ok: false, reason: 'secret-name-invalid', detail: 'expected lowercase letters, digits and hyphens, starting with a letter or digit, at most 64 characters' }`. The checker prints it as `definition.secret-name-invalid` and a run refuses `definition-malformed` with that reason as its detail (`contracts/refusals.md` section 2, definition parse row). An empty or whitespace-only value never reaches the pattern: `optionalString` refuses it first as `secrets-invalid` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:205-209], and that existing reason is kept.
2. **Verb.** `bots secret set <name>` and `bots secret forget <name>` check the name in `bots.cjs` before any runtime call, and refuse `bots: secret-name-invalid: <name>` with exit 2 (`contracts/refusals.md` section 3.7). An empty name on the verb, `bots secret set ""`, is `secret-name-invalid` too, because the verb has no `optionalString` in front of it.

### 1.1 Accept and refuse sets

The tests use exactly these rows. `tests/secrets.vitest.ts` feeds each one to `parseDefinition` and to the verb check.

| Input | Verdict | Why |
|-------|---------|-----|
| `demo` | accept | the planted name |
| `a` | accept | one character |
| `0` | accept | a digit may start |
| `slack-app-token` | accept | 011 uses it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:76] |
| `a--b` | accept | the pattern allows a run of hyphens |
| `demo-` | accept | the pattern allows a trailing hyphen |
| 64 times `a` | accept | the bound |
| 65 times `a` | refuse | over the bound |
| `../etc/passwd` | refuse | a slash and dots |
| `demo/x` | refuse | a path separator |
| `-demo` | refuse | a leading hyphen |
| `Demo` | refuse | upper case |
| `demo_key` | refuse | an underscore, which is what keeps the environment map injective |
| `demo key` | refuse | a space |
| `démo` | refuse | outside ASCII |
| empty, on the verb | refuse | no character |

---

## 2. THE ENVIRONMENT KEY

The key is `SKILLED_BOT_SECRET_` plus the name upper-cased, with each hyphen turned into an underscore (`contracts/records.md` section 8). One function, `secretEnvKey(name)` in `secrets.ts`, computes it, and the runner and the dispatch-env key list both call it.

| Name | Key |
|------|-----|
| `demo` | `SKILLED_BOT_SECRET_DEMO` |
| `slack-app-token` | `SKILLED_BOT_SECRET_SLACK_APP_TOKEN` |
| `a--b` | `SKILLED_BOT_SECRET_A__B` |
| `demo-` | `SKILLED_BOT_SECRET_DEMO_` |
| `0` | `SKILLED_BOT_SECRET_0` |

**Why it cannot collide.** Upper-casing is one to one on `[a-z0-9]`, and the hyphen to underscore swap is one to one because the grammar admits no underscore. So two different names always give two different keys, and the inverse map (lower-case, underscore to hyphen) recovers the name. A test asserts the inverse on every accept row of section 1.1.

---

## 3. THE KEYCHAIN ACCOUNT

The index is per identity under one state root, while the OS keychain is one per OS user. A keychain item keyed by the bare name would let one identity's `forget demo` delete another identity's value, and would let a test run under a scratch state root overwrite the operator's real `demo`. So the keychain item carries a scope.

| Attribute | Value |
|-----------|-------|
| service | `skilled-bots` |
| account | `<name>@<scope>` |
| scope | the first 12 lowercase hex characters of the SHA-256 of `realpathSync(<identity folder>/secrets)` |

The scope is derived, never stored, so `contracts/records.md` section 8 gains no key. `realpath` is taken on the folder `ensureIdentityState` has already created, so `set` and a later run of the same identity under the same state root compute the same scope even when one path reads `/var/...` and the other `/private/var/...`. The longest account is 64 + 1 + 12 = 77 characters, which is what the line bound in `backends.md` section 2.3 is computed from.

Moving a state root to a new path changes the scope, so every keychain entry under it reads as absent and a run refuses `secret-unknown`. That is the safe direction: a moved root never reads another root's value. The operator runs `bots secret set` again for each name. `backends.md` section 5 states this beside the other backend transitions.

---

## 4. UPGRADE NOTE

Before this phase the `secrets` field is parsed and read by nothing, and the template says so. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57] [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:20-21] After it, the same field changes meaning in two ways, and a bot that runs today can stop running.

1. **A name outside the grammar stops the bot from parsing.** A `BOT.md` that wrote an environment variable name, such as `secrets: GITHUB_TOKEN`, is refused `secret-name-invalid` by the checker and `definition-malformed` at run time.
2. **A name the store does not hold refuses the run.** A `BOT.md` with `secrets: demo` and no stored `demo` is refused `secret-unknown` with exit 4 before dispatch.

The note, verbatim, that the builder adds to `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` and to the template comment:

> **Upgrading to the vault.** `secrets` now names one entry in the vault, and the child reads its value from `SKILLED_BOT_SECRET_<NAME>`. Before you upgrade, for every `BOT.md` that sets `secrets`: rename the value to lowercase letters, digits and hyphens if it is not already (`GITHUB_TOKEN` becomes `github-token`), run `bots secret set <name>` once, and change the bot body to read `SKILLED_BOT_SECRET_<NAME>` instead of the old variable. A bot whose name is not stored is refused `secret-unknown` and starts no child.

**Revert.** `contracts/versioning.md` section 2 lists no closed-list key for 008, because the run record keeps keys it does not know. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md:23-36] A reverted runtime ignores `posture.secretsUsed` and the `secrets/` folder, and reads `secrets` as a policy again. The store stays under the state root, and the operator removes it with `bots secret forget` before the revert, or by removing `<identity>/secrets/` and the keychain items with service `skilled-bots` by hand after it.

---

## 5. VERIFY

Each command runs here with no tty and reads no secret.

| Claim | Command | Prints |
|-------|---------|--------|
| The bot id pattern is the grammar | `rg -n "BOT_ID_PATTERN = " .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | `88:export const BOT_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;` |
| An empty `secrets` refuses before the grammar | `rg -n "expected a non-empty string" .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | one line, 207 |
| The contract fixes the grammar and the key | `rg -c "SKILLED_BOT_SECRET_SLACK_APP_TOKEN" specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` | `1` |
| The template still says the field is unenforced | `rg -n "does not enforce" .skilled/skills/system-skilled-bots/assets/bot-template.txt` | one line, 20, until T025 lands |
