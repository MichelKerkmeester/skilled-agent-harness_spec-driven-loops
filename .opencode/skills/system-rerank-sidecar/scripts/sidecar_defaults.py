# ───────────────────────────────────────────────────────────────
# MODULE: System Rerank Sidecar — Canonical Default Constants
# ───────────────────────────────────────────────────────────────
"""Single source of truth for cross-launcher rerank-sidecar defaults.

Background (022/008 dedup): port 8765 + model name + revision hash were
previously duplicated as inline literals across 4 launcher surfaces:

- ``rerank_sidecar.py`` (FastAPI server) — Python literal
- ``ensure_rerank_sidecar.py`` (Python sibling launcher) — Python literal
- ``.opencode/bin/lib/ensure-rerank-sidecar.cjs`` (Node launcher) — JS literal
- ``scripts/start.sh`` + ``scripts/use-model.sh`` (Bash launchers) — Bash literals

Bash + Node cannot import Python constants directly, so the canonical
source lives here for the Python side; bash + cjs ship explicit cross-language
sync comments pointing to this module. The cross-language values MUST stay
in sync; a pytest/vitest invariant check can be added as a follow-on if
the cross-language drift risk materializes.

Env-var overrides (``RERANK_SIDECAR_PORT``, ``RERANK_MODEL_NAME``,
``RERANK_MODEL_REVISION``) take precedence at runtime; these constants are
the BUILT-IN defaults when those env vars are unset.
"""

from __future__ import annotations

# Canonical port for the local FastAPI rerank sidecar (loopback only).
# Bash mirror: scripts/start.sh:43 + scripts/use-model.sh:185 RERANK_SIDECAR_PORT default.
# Node mirror: .opencode/bin/lib/ensure-rerank-sidecar.cjs:19 DEFAULT_PORT.
DEFAULT_PORT = 8765

# Canonical default reranker model (per 023B follow-on; supersedes
# jina-reranker-v3 from the 2026-05-19 arc).
# Bash mirror: scripts/start.sh:71 + scripts/use-model.sh:32/41 RERANK_MODEL_NAME default.
# Node mirror: .opencode/bin/lib/ensure-rerank-sidecar.cjs:608 readConfigHashEnvValue default.
DEFAULT_MODEL_NAME = "Qwen/Qwen3-Reranker-0.6B"

# Canonical revision pin for the default model. Pinned to a specific
# commit hash for reproducibility; override via RERANK_MODEL_REVISION env
# var to test a different revision.
# Bash mirror: scripts/use-model.sh:41 example revision.
DEFAULT_MODEL_REVISION = "e61197ed45024b0ed8a2d74b80b4d909f1255473"
