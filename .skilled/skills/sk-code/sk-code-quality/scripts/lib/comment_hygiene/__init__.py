#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE PACKAGE
# ───────────────────────────────────────────────────────────────

"""One module per concern of the comment-hygiene checker.

Usage: imported by `../check-comment-hygiene.sh`, which puts this package's folder on
`sys.path` from its own real path, so no install step is needed
Output: nothing of its own. `cli.main()` prints and returns the exit code, and the entry
point hands it the core violation table it exports
"""

from __future__ import annotations

__all__ = [
    "checker",
    "cli",
    "constructs",
    "families",
    "rules",
    "scanner",
]
