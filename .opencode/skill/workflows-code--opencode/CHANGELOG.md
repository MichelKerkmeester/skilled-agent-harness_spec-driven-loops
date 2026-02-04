# Changelog - workflows-code--opencode

All notable changes to the workflows-code--opencode skill (multi-language OpenCode system code standards).

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-dev-environment)

---

## [**1.0.0**] - 2026-02-04

Initial release providing multi-language code standards for OpenCode system code across JavaScript, Python, Shell, and JSON/JSONC.

---

### New

1. **SKILL.md orchestrator** — 10-section structure with Use Case Router tables, Quick Reference with code examples
2. **Language-specific style guides** — 4 comprehensive guides:
   - `references/javascript/style_guide.md` — Node.js/ES modules, JSDoc, async patterns
   - `references/python/style_guide.md` — PEP 8, docstrings, type hints
   - `references/shell/style_guide.md` — POSIX compliance, error handling, shebang patterns
   - `references/jsonc/style_guide.md` — Schema references, comment conventions
3. **Universal patterns** — `references/shared/universal_patterns.md` for cross-language consistency
4. **Quality checklist** — `assets/code_quality_checklist.md` for pre-commit validation
5. **skill_advisor.py integration** — INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS for automatic routing

---

### Features

| Feature | Description |
|---------|-------------|
| **Language detection** | Automatic routing based on file extension |
| **Unified commenting** | WHY-focused comments, quantity limits (5/10 lines) |
| **Reference patterns** | T###, REQ-###, SEC-###, BUG-### prefixes |
| **Naming conventions** | snake_case (Python/Shell), camelCase (JS), kebab-case (files) |
| **Resource loading** | 3-tier system: ALWAYS, CONDITIONAL, ON_DEMAND |

---

### Skill Routing

```python
# INTENT_BOOSTERS added to skill_advisor.py
"opencode": ("workflows-code--opencode", 2.0),
"mcp": ("workflows-code--opencode", 1.5),
"python": ("workflows-code--opencode", 1.0),
"shell": ("workflows-code--opencode", 1.0),
"bash": ("workflows-code--opencode", 1.0),
"jsonc": ("workflows-code--opencode", 1.5),
```

---

### Notes

- Derived from workflows-code patterns, adapted for multi-language OpenCode context
- Inline commenting standards aligned with workflows-code (quantity limit, WHY not WHAT, no commented-out code)
- For web-specific projects (Webflow, vanilla JavaScript), use `workflows-code--web-dev`

---

*For older versions, see git history.*
