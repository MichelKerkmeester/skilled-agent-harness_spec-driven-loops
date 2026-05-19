"""Tests for tree-sitter code-aware chunking."""

from __future__ import annotations

from types import SimpleNamespace

from cocoindex.ops.text import RecursiveSplitter

from cocoindex_code.chunkers import CodeAwareSplitter
from cocoindex_code.indexer import _split_chunks


def _split(text: str, language: str, *, chunk_size: int = 1500) -> list:
    return CodeAwareSplitter(
        chunk_size=chunk_size,
        chunk_overlap=0,
        min_chunk_size=1,
    ).split(text, language)


def test_typescript_class_chunk_contains_full_body() -> None:
    chunks = _split(
        "export class Walker {\n"
        "  findFiles(): string[] {\n"
        "    return [];\n"
        "  }\n"
        "}\n",
        "typescript",
    )

    assert len(chunks) == 1
    assert "findFiles()" in chunks[0].text
    assert chunks[0].start.line == 1
    assert chunks[0].end.line == 5


def test_typescript_arrow_function_declaration_is_chunked() -> None:
    chunks = _split(
        "const helper = 1;\n"
        "export const findFiles = () => {\n"
        "  return [];\n"
        "};\n",
        "typescript",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("export const findFiles")
    assert "helper = 1" not in chunks[0].text


def test_python_class_chunk_contains_methods() -> None:
    chunks = _split(
        "class Indexer:\n"
        "    def parse(self):\n"
        "        return True\n"
        "\n"
        "VALUE = 1\n",
        "python",
    )

    assert len(chunks) == 1
    assert "def parse" in chunks[0].text
    assert chunks[0].start.line == 1
    assert chunks[0].end.line == 3


def test_python_decorated_function_includes_decorator() -> None:
    chunks = _split(
        "@cached\n"
        "def load():\n"
        "    return 1\n",
        "python",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("@cached")
    assert "def load" in chunks[0].text


def test_go_function_includes_doc_comment() -> None:
    chunks = _split(
        "package indexer\n"
        "\n"
        "// FindFiles walks the filesystem.\n"
        "func FindFiles() []string {\n"
        "  return nil\n"
        "}\n",
        "go",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("// FindFiles")
    assert "func FindFiles" in chunks[0].text


def test_rust_function_includes_doc_comment() -> None:
    chunks = _split(
        "/// Emits import edges.\n"
        "pub fn emit_edges() {\n"
        "}\n",
        "rust",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("/// Emits")
    assert "emit_edges" in chunks[0].text


def test_java_class_includes_javadoc() -> None:
    chunks = _split(
        "/** Parses source files. */\n"
        "public class Parser {\n"
        "  void parse() {}\n"
        "}\n",
        "java",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("/** Parses")
    assert "class Parser" in chunks[0].text


def test_javascript_jsdoc_inclusion() -> None:
    chunks = _split(
        "/** Resolves aliases. */\n"
        "function resolveAlias() {\n"
        "  return true;\n"
        "}\n",
        "javascript",
    )

    assert len(chunks) == 1
    assert chunks[0].text.startswith("/** Resolves")
    assert "resolveAlias" in chunks[0].text


def test_oversized_definition_uses_recursive_splitter_with_absolute_lines() -> None:
    body = "\n".join(f"  line_{i} = {i}" for i in range(30))
    chunks = _split(f"def huge():\n{body}\n", "python", chunk_size=80)

    assert len(chunks) > 1
    assert chunks[0].start.line == 1
    assert chunks[-1].end.line == 31


def test_unsupported_language_uses_recursive_splitter() -> None:
    text = "# Title\n\nSome prose content.\n"
    chunks = _split(text, "markdown")
    expected = RecursiveSplitter().split(
        text,
        chunk_size=1500,
        min_chunk_size=1,
        chunk_overlap=0,
        language="markdown",
    )

    assert chunks == expected


def test_indexer_dispatch_respects_code_aware_opt_out(monkeypatch) -> None:
    text = "def first():\n    return 1\n\ndef second():\n    return 2\n"
    monkeypatch.setattr(
        "cocoindex_code.indexer.config",
        SimpleNamespace(code_aware_chunking=False, tree_sitter_languages={}),
    )

    chunks = _split_chunks(
        text,
        language="python",
        chunk_size=1500,
        min_chunk_size=1,
        chunk_overlap=0,
    )
    expected = RecursiveSplitter().split(
        text,
        chunk_size=1500,
        min_chunk_size=1,
        chunk_overlap=0,
        language="python",
    )

    assert chunks == expected


def test_indexer_dispatch_uses_code_aware_for_supported_language(monkeypatch) -> None:
    text = "def first():\n    return 1\n\ndef second():\n    return 2\n"
    monkeypatch.setattr(
        "cocoindex_code.indexer.config",
        SimpleNamespace(code_aware_chunking=True, tree_sitter_languages={}),
    )

    chunks = _split_chunks(
        text,
        language="python",
        chunk_size=1500,
        min_chunk_size=1,
        chunk_overlap=0,
    )

    assert [chunk.start.line for chunk in chunks] == [1, 4]
    assert [chunk.text.splitlines()[0] for chunk in chunks] == ["def first():", "def second():"]
