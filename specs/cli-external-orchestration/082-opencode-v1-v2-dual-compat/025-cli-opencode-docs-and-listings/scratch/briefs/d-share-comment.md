ROLE: You correct one two-line code comment. Change nothing else.

FILE: `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`

FIND these two comment lines above the `'share-requires-confirmation'` check:
```
  // --share publishes the session; flag for confirmation (advisory — can't verify consent
  // here). `--share=<value>` publishes exactly as the bare flag does.
```
REPLACE them with:
```
  // --share publishes nothing: OpenCode 1.19.3 keeps it as a hidden, deprecated flag that
  // only prints a warning, and OpenCode 2 `run` has no such flag. A dispatch that passes it,
  // bare or as `--share=<value>`, still expects a share, so the advisory names the flag.
```
Do not change the check itself, its id or any other line.

VERIFY: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` (report pass/fail counts and exit code) and `git diff -- .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` (report it).
