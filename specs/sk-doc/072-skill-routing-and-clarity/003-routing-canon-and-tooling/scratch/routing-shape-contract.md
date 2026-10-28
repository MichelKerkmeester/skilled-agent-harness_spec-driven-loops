# Routing shape contract

One definition of the routing-shape check, implemented twice: in `package_skill.py` (the `/create:skill` default check) and in `parent-skill-check.cjs` (the `/create:skill-parent` default check). Both implementations must report the same findings for the same SKILL.md.

## 1. The canon (what the check enforces)

- **Hub** (a root with `mode-registry.json` and `hub-router.json`): keeps one root `ROUTER.md`. Its SKILL.md SMART ROUTING section is short prose that says how a prompt reaches a mode and points at `ROUTER.md`.
- **Mode packet** (a folder inside a hub): no `ROUTER.md`. Its SMART ROUTING section is 8 to 12 non-blank lines, and at most 180 words, of plain prose: what selects this packet, what it loads first, where the machine router is. Any machine router block sits in a final `## MACHINE ROUTER` section, the last H2 of the file. A packet whose leaves the hub `ROUTER.md` already names may carry no block.
- **Standalone skill** (neither hub file): the same short SMART ROUTING section, with its inline router in the final `## MACHINE ROUTER` section.
- The no-match outcome is named `UNKNOWN_FALLBACK` everywhere.
- The appendix heading is numbered like every other H2 (for example `## 8. MACHINE ROUTER`); the checks read the title with its number removed. A hub keeps its compiled-routing directive and its `UNKNOWN_FALLBACK_CHECKLIST` there, so its SMART ROUTING prose keeps its room.

## 2. Config file

Path: `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`. Env overrides for tests: `ROUTING_SHAPE_DEBT_FILE=<path>` for the ledger and `ROUTING_SHAPE_SKILLS_ROOT=<path>` for the skills root.

```json
{
  "description": "Skills still in the old routing shape, keyed by their path under .skilled/skills. ...",
  "maxSmartRoutingLines": 12,
  "maxSmartRoutingWords": 180,
  "debt": {
    "sk-code": {"lines": 67, "words": 800, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]},
    "sk-code/sk-code-review": {"lines": 312, "words": 3000, "machineBlocks": 2, "codes": ["RS-001", "RS-002"]}
  }
}
```

A missing or unreadable file means `maxSmartRoutingLines` 12, `maxSmartRoutingWords` 180 and an empty `debt` map. An entry that is not an object with exactly the four fields, non-negative integer counts and codes drawn from RS-001 to RS-004 is ignored, so that skill is held to the canon. A broken ledger can only tighten the check.

**Skill key:** the skill folder's path relative to the skills root (default `.skilled/skills`, resolved through symlinks), in forward-slash form, for example `sk-code` or `sk-code/sk-code-review`. A folder that is not strictly inside the skills root has no key and is never debt, so a same-named folder elsewhere cannot borrow an entry.

**Ratchet:** `sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` compares the live ledger with the frozen snapshot `tests/fixtures/routing-shape-known-debt-frozen.json`: no new key, no count above the snapshot, no code the snapshot does not record, and no higher top-level limit. The routing-registry-drift workflow runs it. Shrinking or removing an entry needs no snapshot change; growing one needs a visible edit to the snapshot.

## 3. Parsing SKILL.md

1. Drop the leading frontmatter block (`---` to the next `---`).
2. Track fences: a line whose stripped text starts with a run of three or more backticks, or three or more tildes, opens a fence and records that character and run length. While a fence is open, only a line whose stripped text is a run of the same character at least as long as the opening run, followed by nothing but whitespace, closes it. An **H2** is a line outside any fence that starts with `## `.
3. **Normalised title:** drop `## `, then a leading `^\d+[a-z]?\.\s*`, then leading non-word characters (emoji), trim, uppercase.
4. **SMART ROUTING section:** the first H2 whose normalised title starts with `SMART ROUTING`. Its body runs to the next H2 or the end of file.
5. **Line count:** body lines that are non-blank and are not exactly `---` once stripped. **Word count:** whitespace-separated tokens over those same lines.
6. **Machine line:** a line matching `^\s*(INTENT_SIGNALS|RESOURCE_MAP|UNKNOWN_FALLBACK_CHECKLIST)\s*=` or `^\s*def\s+(discover_markdown_resources|_guard_in_skill)\b`. **Machine block:** a fenced block with an inner machine line, at the 1-based line of its opening fence; or an unfenced run that starts at a machine line outside any fence and continues over blank lines, lines that start with a space or tab, and further machine lines, closing at any other line, an H2 or a fence opening, at the 1-based line of its first machine line.
7. **Appendix:** the H2 whose normalised title equals `MACHINE ROUTER`.

## 4. Rules

| Code | Finding | Message |
|---|---|---|
| RS-001 | SMART ROUTING line count above `maxSmartRoutingLines`, or word count above `maxSmartRoutingWords` (one finding per measure) | `routing shape RS-001: SMART ROUTING section has N lines (max M)` / `... has N words (max M)` |
| RS-002 | a machine block not inside the appendix | `routing shape RS-002: machine router block at line L is outside a final '## MACHINE ROUTER' section` |
| RS-003 | the appendix exists but is not the last H2 | `routing shape RS-003: '## MACHINE ROUTER' is not the last H2 section` |
| RS-004 | a mode packet (parent holds `mode-registry.json`) that holds `ROUTER.md` | `routing shape RS-004: mode packet carries its own ROUTER.md; the hub root ROUTER.md is the only router file` |

A skill with no SMART ROUTING section skips RS-001.

## 5. Known debt

For a skill whose key has a valid entry E:
- An RS-001 lines finding is tolerated while RS-001 is in `E.codes` and N is at most `E.lines`; the words finding likewise against `E.words`.
- RS-002 findings are tolerated while RS-002 is in `E.codes` and their number is at most `E.machineBlocks`.
- RS-003 and RS-004 are tolerated while the code is in `E.codes`.
- Any other finding is a violation. Its message gains ` (grew past its recorded known debt of R lines)`, `... R words)` or `... R machine block(s))` when the code is recorded but the count grew, or ` (not recorded in its known debt)` when the code is not recorded.
- Tolerated findings print as one advisory line: `routing shape: known debt, <codes> (migrate to the routing canon)`, each code once.
- A key whose skill has no finding prints the advisory `routing shape: known-debt entry is stale; remove <key>`.

## 6. Where each check applies it

- **/create:skill:** the blocking completion gate runs `validate_skill_package.py --strict`, which runs `package_skill.py --check --strict`, so a routing-shape finding blocks creation.
- **package_skill.py:** the skill folder it is given, of every kind (standalone, hub root, mode packet, surface packet). Violations are warnings that `--strict` promotes to errors (the promoted-marker list gains `routing shape RS-`). Known-debt and stale lines are never promoted. The existing smart-router marker check reads the SMART ROUTING body plus the MACHINE ROUTER body.
- **parent-skill-check.cjs:** check id `12b-routing-shape`, over the hub root SKILL.md and every mode packet SKILL.md named by `mode-registry.json` `modes[].packet`. Each violation is a `softFail`. Known debt is one `INFO` line per skill. A clean run prints `PASS: 12b-routing-shape: hub and N packet(s) follow the routing canon (K known debt)`.
