from __future__ import annotations

import re
from pathlib import Path

import pytest


CODE_INDEX_STACK = Path(__file__).resolve().parents[2]
PHASE2_SCRIPT = (
    CODE_INDEX_STACK
    / "011-rerank-model-fit-investigation"
    / "research"
    / "phase2-bench"
    / "run-phase2-smoke.sh"
)
EXTENDED_SCRIPT = (
    CODE_INDEX_STACK
    / "004-extended-bake-off"
    / "evidence"
    / "run-extended-bake-off-with-hybrid-rerank.sh"
)


def _load_extract_paths(script_path: Path):
    source = script_path.read_text()
    match = re.search(r"(?P<body>MIRROR_PREFIXES = .*?)(?=\n(?:def _norm|for i,))", source, re.S)
    assert match, f"could not locate helper block in {script_path}"
    namespace: dict[str, object] = {"re": re, "Path": Path}
    exec(match.group("body"), namespace)
    return namespace["_extract_paths"]


@pytest.fixture(params=[PHASE2_SCRIPT, EXTENDED_SCRIPT], ids=["phase2", "extended"])
def extract_paths(request):
    return _load_extract_paths(request.param)


def test_backtick_wrapped_mirror_path_is_recovered(extract_paths):
    stdout = "3. `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:12-18"
    assert extract_paths(stdout) == [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    ]


def test_import_and_require_wrappers_are_unwrapped_but_missing_paths_are_filtered(
    extract_paths,
):
    stdout = "\n".join(
        [
            "import('.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts')",
            "require('../../lib/structural-indexer.js')",
        ]
    )
    assert extract_paths(stdout) == [
        ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
    ]


def test_from_wrapper_is_unwrapped(extract_paths):
    stdout = "from '.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts';"
    assert extract_paths(stdout) == [
        ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    ]


def test_single_and_double_quote_wrappers_are_removed(extract_paths):
    stdout = "\n".join(
        [
            "'./measurement-fixtures.js'",
            '".opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts",',
        ]
    )
    assert extract_paths(stdout) == [
        ".opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts"
    ]


def test_line_ranges_are_stripped_and_order_is_deduped(extract_paths):
    stdout = "\n".join(
        [
            ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:31-42",
            ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:8",
            ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:31-42",
        ]
    )
    assert extract_paths(stdout) == [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py",
    ]


def test_empty_and_no_path_output_returns_empty_list(extract_paths):
    assert extract_paths("") == []
    assert extract_paths("score 0.82 symbol Config.from_env no filesystem token") == []


def test_existing_non_mirror_path_is_kept(extract_paths, tmp_path, monkeypatch):
    file_path = tmp_path / "src" / "real_module.py"
    file_path.parent.mkdir()
    file_path.write_text("pass\n")
    monkeypatch.chdir(tmp_path)
    assert extract_paths("./src/real_module.py:1") == ["./src/real_module.py"]
