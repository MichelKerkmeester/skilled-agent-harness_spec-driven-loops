# Routing shape contract

One definition of the routing-shape check, implemented twice: in `package_skill.py` (the `/create:skill` default check) and in `parent-skill-check.cjs` (the `/create:skill-parent` default check). Both implementations must report the same findings for the same SKILL.md.

## 1. The canon (what the check enforces)

- **Hub** (a root with `mode-registry.json` and `hub-router.json`): keeps one root `ROUTER.md`. Its SKILL.md SMART ROUTING section is short prose that says how a prompt reaches a mode and points at `ROUTER.md`.
- **Mode packet** (a folder inside a hub): no `ROUTER.md`. Its SMART ROUTING section is 8 to 12 non-blank lines of plain prose: what selects this packet, what it loads first, where the machine router is. Any machine router block sits in a final `## MACHINE ROUTER` section, the last H2 of the file. A packet whose leaves the hub `ROUTER.md` already names may carry no block.
- **Standalone skill** (neither hub file): the same short SMART ROUTING section, with its inline router in the final `## MACHINE ROUTER` section.
- The no-match outcome is named `UNKNOWN_FALLBACK` everywhere.

## 2. Config file

Path: `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`. Env override for tests: `ROUTING_SHAPE_DEBT_FILE=<path>`.

```json
{
  "description": "Skills still in the old routing shape. Each entry records the SMART ROUTING line count it was listed with; the check fails the skill if that count grows. Remove an entry when the skill moves to the routing canon.",
  "maxSmartRoutingLines": 12,
  "debt": {
    "sk-code": 68,
    "sk-code/sk-code-review": 313
  }
}
```

A missing or unreadable file means `maxSmartRoutingLines` 12 and an empty `debt` map.

**Skill key:** when the skill folder's parent holds `mode-registry.json`, the key is `<parent-folder-name>/<folder-name>`; otherwise it is `<folder-name>`.

## 3. Parsing SKILL.md

1. Drop the leading frontmatter block (`---` to the next `---`).
2. Track fences: a line whose stripped text starts with ```` ``` ```` or `~~~` toggles in-fence. An **H2** is a line outside any fence that starts with `## `.
3. **Normalised title:** drop `## `, then a leading `^\d+[a-z]?\.\s*`, then leading non-word characters (emoji), trim, uppercase.
4. **SMART ROUTING section:** the first H2 whose normalised title starts with `SMART ROUTING`. Its body runs to the next H2 or the end of file.
5. **Line count:** body lines that are non-blank and are not exactly `---` once stripped.
6. **Machine block:** a fenced block with an inner line matching `^\s*(INTENT_SIGNALS|RESOURCE_MAP)\s*=` or `^\s*def\s+(discover_markdown_resources|_guard_in_skill)\b`. Its line is the 1-based line of the opening fence in the whole file.
7. **Appendix:** the H2 whose normalised title equals `MACHINE ROUTER`.

## 4. Rules

| Code | Finding | Message |
|---|---|---|
| RS-001 | SMART ROUTING line count above `maxSmartRoutingLines` | `routing shape RS-001: SMART ROUTING section has N lines (max M)` |
| RS-002 | a machine block not inside the appendix | `routing shape RS-002: machine router block at line L is outside a final '## MACHINE ROUTER' section` |
| RS-003 | the appendix exists but is not the last H2 | `routing shape RS-003: '## MACHINE ROUTER' is not the last H2 section` |
| RS-004 | a mode packet (parent holds `mode-registry.json`) that holds `ROUTER.md` | `routing shape RS-004: mode packet carries its own ROUTER.md; the hub root ROUTER.md is the only router file` |

A skill with no SMART ROUTING section skips RS-001.

## 5. Known debt

For a skill whose key is in `debt` with recorded count R:
- RS-001 is tolerated while N is at most R. When N exceeds R it is a violation, and the message gains ` (grew past its recorded known debt of R)`.
- RS-002, RS-003 and RS-004 are tolerated.
- Tolerated findings print as one advisory line: `routing shape: known debt, <codes> (migrate to the routing canon)`.
- A key whose skill has no finding prints the advisory `routing shape: known-debt entry is stale; remove <key>`.

## 6. Where each check applies it

- **package_skill.py:** the skill folder it is given, of every kind (standalone, hub root, mode packet, surface packet). Violations are warnings that `--strict` promotes to errors (the promoted-marker list gains `routing shape RS-`). Known-debt and stale lines are never promoted. The existing smart-router marker check reads the SMART ROUTING body plus the MACHINE ROUTER body.
- **parent-skill-check.cjs:** check id `12b-routing-shape`, over the hub root SKILL.md and every mode packet SKILL.md named by `mode-registry.json` `modes[].packet`. Each violation is a `softFail`. Known debt is one `INFO` line per skill. A clean run prints `PASS: 12b-routing-shape: hub and N packet(s) follow the routing canon (K known debt)`.
