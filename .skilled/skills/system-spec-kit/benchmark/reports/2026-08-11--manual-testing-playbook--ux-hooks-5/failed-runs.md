# Failed Runs

> system-spec-kit · doc · devin · SWE-1.7 · ux-hooks

1 of 1 scenario(s) recorded a FAIL verdict.

## ux-hooks-directive-lifecycle-dedup

| Field | Value |
|---|---|
| Hub | system-spec-kit |
| Stage | documentation |
| Expected route | not recorded |
| Score | not recorded |
| Model | SWE-1.7 (ux-hooks) |

**Recorded reason.** Dedup engine cadence passes via the compiled claude target (turn1 full, repeat route-only, shrink re-deliver, kill-switch, fail-open) but the runtime hook surface is non-functional: hooks.json registers dist/hooks/devin/user-prompt-submit.js which the build does not produce (dist has only claude/lib/pi), and the .devin/hooks/user-prompt-submit.js shim imports ./shared.js which never existed at HEAD (ERR_MODULE_NOT_FOUND). Runtime fails open with the registration's own diagnostic; the advisor brief never reaches devin.
