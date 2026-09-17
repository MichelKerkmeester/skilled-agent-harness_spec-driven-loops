#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Git subprocess environment isolation
# ---------------------------------------------------------------------------
"""Strip the git repository/config redirectors from a subprocess environment.

git resolves its target repository and config from these variables IN PREFERENCE
to the working directory. Any helper that isolates a throwaway or fixture repo
only by ``cwd``/``git -C <dir>`` will, if the parent process has one of these set
(routine inside a git worktree), write to whatever the variable points at instead
of the intended directory. Because git worktrees share one ``.git/config``, that
means the real repository. Passing the result of :func:`scrub_git_env` as the
subprocess ``env`` makes ``-C``/``cwd`` the only thing that selects the repo.
"""

from __future__ import annotations

import os
from collections.abc import Mapping

GIT_ENV_REDIRECTORS = frozenset({
    "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_CONFIG", "GIT_CONFIG_GLOBAL", "GIT_CONFIG_SYSTEM", "GIT_CONFIG_COUNT",
    "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
})


def scrub_git_env(base: Mapping[str, str] | None = None) -> dict[str, str]:
    """Return a copy of an environment mapping (default: the process environment)
    without the git repository/config redirectors."""
    source = os.environ if base is None else base
    return {key: value for key, value in source.items() if key not in GIT_ENV_REDIRECTORS}
