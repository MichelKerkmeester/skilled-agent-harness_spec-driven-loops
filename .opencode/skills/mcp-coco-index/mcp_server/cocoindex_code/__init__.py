#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COCOINDEX CODE PACKAGE
# ───────────────────────────────────────────────────────────────

"""CocoIndex Code - MCP server for indexing and querying codebases."""

import logging

logging.basicConfig(level=logging.WARNING)

from ._version import __version__  # noqa: E402


def main() -> None:
    from .server import main as _main

    _main()

__all__ = ["main", "__version__"]
