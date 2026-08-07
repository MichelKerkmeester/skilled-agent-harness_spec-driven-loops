# Edit Evidence E — cli-* Smart Router Harmonization

Date: 2026-05-15
Trigger: Post-058 follow-up. User asked "Check the smart routers in the cli skills" + agreed to recommendations: (1) harmonize cli-devin to shared helper, (2) fix shared_smart_router.md doc bug.

## Background

The sk-doc smart-router template (`.opencode/skills/sk-doc/assets/skill/skill_smart_router.md`) defines 4 canonical patterns. The cli-* family wraps those patterns into a single shared helper at `.opencode/skills/system-spec-kit/references/cli/shared_smart_router.md`. Five cli-* sibling skills depend on the helper, but pre-058-E only 4 of 5 actually implemented the full provider-specific dictionary set (`INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS`, `UNKNOWN_FALLBACK_CHECKLIST`). cli-devin had `INTENT_SIGNALS` + a hardcoded `ROUTING_KEY = "devin"` + a prose intent table, but lacked the other 3 dictionaries and the `route_devin_resources` reference.

Per-skill parity before 058-E:

| Skill | INTENT_SIGNALS | RESOURCE_MAP | LOADING_LEVELS | UNKNOWN_FALLBACK_CHECKLIST | route_*_resources |
|---|:---:|:---:|:---:|:---:|:---:|
| cli-claude-code | yes | yes | yes | yes | yes |
| cli-codex | yes | yes | yes | yes | yes |
| cli-gemini | yes | yes | yes | yes | yes |
| cli-opencode | yes | yes | yes | yes | yes |
| cli-devin | yes | NO | NO | NO | NO |

shared_smart_router.md doc-bug: line 8 said "five cli-* sibling skills" but the parenthetical enumerated only four (cli-devin omitted). Line 125 provider-slug list said `copilot` instead of `devin`.

## Edits applied

### cli-devin/SKILL.md (448 -> 468 lines, +20)

Replaced the Smart Router subsection's prose intent table with the standard shared-helper-aligned dictionaries:

- **Kept** `INTENT_SIGNALS` dict (already present); removed the spurious `UNKNOWN_FALLBACK` keyed intent (the shared helper handles unknown via `max(scores.values()) == 0` check).
- **Removed** the hardcoded `ROUTING_KEY = "devin"` constant (shared `get_routing_key()` derives this at routing time).
- **Removed** the prose `Intent | Reference Load` table (now encoded in `RESOURCE_MAP`).
- **Added** `RESOURCE_MAP` dict: intent → list of reference file paths (translated from the prior prose table).
- **Added** `LOADING_LEVELS` dict: ALWAYS / ON_DEMAND_KEYWORDS / ON_DEMAND.
- **Added** `UNKNOWN_FALLBACK_CHECKLIST` list: 4 disambiguation prompts.
- **Added** "Call sequence" section + `route_devin_resources(task)` reference paragraph (mirrors the pattern in cli-codex/cli-claude-code/cli-gemini/cli-opencode).

### shared_smart_router.md (167 lines, 2 single-line edits)

- **Line 8**: added `cli-devin` to the parenthetical enumeration of cli-* sibling skills. The "five" count now matches the listed names.
- **Line 125**: replaced `copilot` with `devin` in the provider-slug list. Copilot is not a cli-* skill; devin is the actual 5th sibling.

## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type skill` on cli-devin/SKILL.md | VALID, 0 issues |
| `validate_document.py --type reference` on shared_smart_router.md | VALID, 0 issues |
| Per-cli-* parity check (5 dicts: INTENT_SIGNALS, RESOURCE_MAP, LOADING_LEVELS, UNKNOWN_FALLBACK_CHECKLIST, route_*_resources reference) | 5/5 skills now uniform |
| 058 packet strict-validate | PASS, 0 errors / 0 warnings |

## Outcome

All 5 cli-* sibling skills (cli-claude-code, cli-codex, cli-devin, cli-gemini, cli-opencode) are now byte-aligned to the shared smart-router helper pattern. The sk-doc smart-router template's 4 patterns are fully implemented via the shared helper, and every sibling supplies the 4 required provider-specific dictionaries inline.

Future cli-* additions just need: INTENT_SIGNALS + RESOURCE_MAP + LOADING_LEVELS + UNKNOWN_FALLBACK_CHECKLIST inline, plus updating the shared file's "five" count and the provider-slug list.
