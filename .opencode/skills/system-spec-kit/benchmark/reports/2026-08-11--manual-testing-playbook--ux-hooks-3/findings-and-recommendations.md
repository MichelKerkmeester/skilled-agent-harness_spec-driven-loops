# Findings And Recommendations

> system-spec-kit · doc · codex · gpt-5.6-luna
composer-2.5 · ux-hooks

1 failing scenario(s) grouped into 1 recorded pattern(s).

## 1. Dedup engine cadence passes via the compiled claude target (turn1 full, repeat route-only, shrink re-deliver, kill-switch, fail-open) but the runtime hook surface is non-functional: hooks.json registers dist/hooks/codex/user-prompt-submit.js which the build does not produce (dist has only claude/lib/pi), and the .codex/hooks/user-prompt-submit.js shim imports ./shared.js which never existed at HEAD (ERR_MODULE_NOT_FOUND). Runtime fails open with the registration's own diagnostic; the advisor brief never reaches codex.

Affects 1 scenario(s): ux-hooks-directive-lifecycle-dedup.

---

Grouping reflects only the reasons this run recorded. Scenarios whose reason was not captured are grouped together and need a re-run before they can be diagnosed.
