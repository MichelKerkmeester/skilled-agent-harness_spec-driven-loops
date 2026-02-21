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
- **JavaScript (`.js/.mjs/.cjs`)**: requires `'use strict';` near file top.
- **TypeScript (`.ts/.tsx`)**: requires a `MODULE:` header marker near file top.
- **Python (`.py`)**: requires `#!/usr/bin/env python3` and module docstring near file top.
- **Shell (`.sh`)**: requires `#!/usr/bin/env bash` and `set -euo pipefail` near file top.
- **JSON (`.json`)**: strict parser validation via Python `json` module.
- **JSONC (`.jsonc`)**: comment stripping followed by strict JSON parse.

<!-- /ANCHOR:what-it-checks -->
<!-- ANCHOR:usage -->
## Usage

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode
```

Notes:
- `--root` is repeatable; when omitted, current directory is scanned.
- Exit code `0` means no violations; exit code `1` means one or more actionable findings were reported.
<!-- /ANCHOR:usage -->
