---
title: "Implementation Plan: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter"
description: "Four markdown surfaces, one JSON config and two changelog entries. The work is documentation plus one config edit; the only real engineering question is which of the two routes can be proven live before a row claims it works."
trigger_phrases:
  - "union alpha implementation plan"
  - "union alpha roster approach"
  - "openrouter section restore"
  - "pi enabledModels union alpha"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documentation plus one JSON config (`.pi/settings.json`) |
| **Framework** | system-spec-kit packet docs; `cli-external-orchestration` hub skills `cli-pi` and `cli-opencode` |
| **Storage** | None. Roster state lives in the two `providers-and-models.md` files; picker state lives in `.pi/settings.json` |
| **Testing** | Live CLI catalog reads (`pi --list-models`, `opencode models <provider>`), one real dispatch per route, and `validate.sh --strict` on this packet |

### Overview

Two rows per roster document, one restored provider section per roster document, one falsified count per skill, and two `enabledModels` strings. The edits are small and independent; the ordering below exists only so no document claims a route works before something has been run that would have failed if it did not.

The one genuine decision is already made and recorded in `spec.md` §3: the OpenRouter route comes back onto the roster rather than staying a fan-out-only exception, because a roster row is what makes a model dispatchable in a closed roster, and the operator asked for the roster. Everything else follows from reading the two catalogs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Closed roster with a single source of truth per skill. `SKILL.md` names the providers and deliberately does not restate their models; `references/providers-and-models.md` is the only place ids, thinking ceilings and per-provider id shapes are recorded. The rule the two skills have held since packet 068 is that two copies of a model list is how the two copies disagree, so this packet adds model detail in exactly one file per skill and adds only a provider name to `SKILL.md`.

### Key Components
- **`cli-pi/references/providers-and-models.md`**: the cli-pi roster. Gains an opencode-go row, a restored `### openrouter` section, and a rewritten retirement paragraph. It is the only file where all three of those edits meet.
- **`cli-opencode/references/providers-and-models.md`**: the cli-opencode roster. Gains the same two rows and no retirement paragraph, because that block only ever existed on the pi side.
- **Both `SKILL.md` files**: the provider name list and its count. No model ids.
- **`.pi/settings.json` `enabledModels`**: the pi picker filter. Entries follow `<provider>/<model-id>`, where the model id is the second column `pi --list-models` prints, which is why the OpenRouter entry is three segments and the opencode-go entry is two.

### Data Flow

A dispatch resolves in one direction: the operator reads the roster, names `--provider` and `--model` explicitly, and the CLI resolves the id against that provider's catalog. Nothing in this packet sits in that path at runtime — the rosters govern what a caller is permitted to name, and `enabledModels` governs what pi's interactive picker shows. The deep-loop fan-out is a separate path with its own allowlist, and this packet leaves it closed to both new ids.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no unit surface here, so verification is live-catalog reads and real dispatches.

**Re-read before writing, not after.** Every figure that lands in a row comes from a command run during implementation, not from this packet's prose: `pi --list-models` for the `context`, `max-out`, `thinking` and `images` columns on both routes, and `opencode models opencode-go` / `opencode models openrouter` for the ids as opencode resolves them. A stealth id can move between the day this plan was written and the day it is implemented, and the row is supposed to record the catalog, not this document.

**One dispatch per route — done, all four green.** Both CLIs were dispatched against both providers on 2026-09-17 and every one returned the expected token, so no row needs the "listing-only" hedge the cline-pass rows use for unverified ids. The OpenRouter half in particular is live, which was the one dependency that could have made half this packet undeliverable.

**The control is what made the thinking measurement worth anything.** The first instrument reached for was the `tokens.reasoning` counter, and it read `0` for both Union Alpha routes — a clean-looking result that would have been written straight into a roster row. Running the same probe against `opencode-go/glm-5.3-flash`, a documented reasoning model at the same tier, also produced `0`. The counter is blind in this opencode version, and only the `reasoning` **part type** in the event stream distinguishes: present for the control, absent for both Union Alpha routes. Any later attempt to settle the opencode-go thinking question must carry its own control, because the obvious reading of the obvious number was wrong here in the direction that does not look wrong.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **The OpenRouter credential**, present in `~/.pi/agent/auth.json` and `~/.local/share/opencode/auth.json` as of 2026-09-17. Both catalogs answer, which proves the stores are readable and not that the key authorizes a completion.
- **The upstream stealth id `stealth/union-alpha`**, free at $0 prompt and $0 completion in the OpenRouter catalog on 2026-09-17, and its opencode-go counterpart `union-alpha`. Either can be withdrawn without notice.
- **Packet 068**, whose retirement paragraph this packet rewrites. Its changelog entries are deliberately left alone.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive text plus two JSON strings, and nothing in the packet deletes a route or repoints an existing one.

- **Docs**: `git checkout -- .opencode/skills/cli-external-orchestration/cli-pi .opencode/skills/cli-external-orchestration/cli-opencode` restores all four markdown surfaces, and the two new changelog files are removed with `rm`.
- **`.pi/settings.json`**: remove the two `enabledModels` entries. No other key is touched, so a revert cannot disturb `defaultProvider` or `defaultModel`.
- **Runtime**: nothing to roll back. The deep-loop fan-out allowlist is untouched by design, so no dispatch path changes behavior and no other model's route moves.

The reversal is cheap because the one irreversible-feeling part, restoring a retired provider, is a paragraph rewrite rather than a credential or account action.
<!-- /ANCHOR:rollback -->

---
