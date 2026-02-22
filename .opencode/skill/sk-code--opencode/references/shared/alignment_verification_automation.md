# Alignment Verification Automation

This document describes the repeatable verifier introduced for recurring alignment drift checks.

<!-- ANCHOR:script -->
## Script

- Path: `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`
- Purpose: run lightweight, deterministic, behavior-neutral checks across OpenCode system languages.

<!-- /ANCHOR:script -->
<!-- ANCHOR:what-it-checks -->
## What it checks

- **Common (all scanned files)**: UTF-8 readability and LF line endings (flags CRLF).
- **JavaScript (`.js/.cjs`)**: requires `'use strict';` near file top.
- **JavaScript ESM (`.mjs`)**: strict-mode directive is not enforced.
- **TypeScript (`.ts/.tsx/.mts`)**: requires a `MODULE:` header marker near file top, except test files and pattern assets.
- **Python (`.py`)**: requires `#!/usr/bin/env python3` and module docstring near file top.
- **Shell (`.sh`)**: requires `#!/usr/bin/env bash` and `set -euo pipefail` near file top.
- **JSON (`.json`)**: strict parser validation via Python `json` module, with comment-aware fallback for `tsconfig*.json`.
- **JSONC (`.jsonc`)**: comment stripping followed by strict JSON parse.

### Severity model

- **ERROR**: parse/integrity findings (`COMMON-*`, `JSON-*`, `JSONC-*`) in active paths.
- **WARN**: style findings (`JS-*`, `TS-*`, `PY-*`, `SH-*`) by default.
- **Context-aware advisory downgrade**: any finding under archival/contextual paths is downgraded to `WARN`:
  - `z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples`, `fixtures`, and test-heavy paths.

<!-- /ANCHOR:what-it-checks -->
<!-- ANCHOR:usage -->
## Usage

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode
```

Strict CI mode:

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode --fail-on-warn
```

Notes:
- `--root` is repeatable; when omitted, current directory is scanned.
- Files are deduplicated by realpath when repeated/overlapping roots are provided.
- Output includes both rule id and severity (`[RULE] [ERROR|WARN]`).
- Exit code `0` means no blocking findings (warnings are non-blocking by default).
- Exit code `1` means one or more errors were found, or warnings were found with `--fail-on-warn`.
<!-- /ANCHOR:usage -->
