"""Tests for deterministic query expansion."""

from __future__ import annotations

from cocoindex_code.retrieval.query_expansion import (
    _DEFAULT_SYNONYMS,
    apply_synonyms,
    expand_query,
    generate_identifier_variants,
    split_compound_identifier,
)


def test_split_camel_case_identifier() -> None:
    assert split_compound_identifier("findFiles") == ["find", "files"]


def test_split_snake_case_identifier() -> None:
    assert split_compound_identifier("memory_save") == ["memory", "save"]


def test_split_pascal_case_identifier() -> None:
    assert split_compound_identifier("RerankerAdapter") == ["reranker", "adapter"]


def test_split_kebab_case_identifier() -> None:
    assert split_compound_identifier("code-graph-indexer") == ["code", "graph", "indexer"]


def test_split_screaming_snake_identifier() -> None:
    assert split_compound_identifier("HF_LOCAL_MODEL") == ["hf", "local", "model"]


def test_already_split_token_is_idempotent() -> None:
    assert split_compound_identifier("walker") == ["walker"]


def test_generate_identifier_variants_caps_at_six() -> None:
    variants = generate_identifier_variants(["memory", "save"])

    assert variants == [
        "memorySave",
        "memory_save",
        "MemorySave",
        "memory-save",
        "MEMORY_SAVE",
        "memorysave",
    ]


def test_generate_identifier_variants_deduplicates_single_word() -> None:
    assert generate_identifier_variants(["parser"]) == ["parser", "Parser", "PARSER"]


def test_apply_synonyms_includes_all_direct_alternatives() -> None:
    variants = apply_synonyms(["walker"], {"walker": ["finder", "iterator", "traverser"]})

    assert variants == [["walker"], ["finder"], ["iterator"], ["traverser"]]


def test_apply_synonyms_caps_combinations() -> None:
    variants = apply_synonyms(
        ["memory", "save", "adapter"],
        {
            "memory": ["context", "state"],
            "save": ["persist", "store", "write"],
            "adapter": ["wrapper", "bridge"],
        },
    )

    assert len(variants) == 8
    assert variants[0] == ["memory", "save", "adapter"]


def test_expand_query_produces_fts5_or_clause() -> None:
    expanded = expand_query("memory save", _DEFAULT_SYNONYMS, max_variants=6)

    assert expanded.expansion_applied is True
    assert '"memory"' in expanded.fts5_clause
    assert '"save"' in expanded.fts5_clause
    assert '"memorySave"' in expanded.fts5_clause
    assert " OR " in expanded.fts5_clause


def test_expand_query_deduplicates_dense_variants() -> None:
    expanded = expand_query("parser", {"parser": ["parser", "lexer"]}, max_variants=6)

    assert len(expanded.dense_variants) == len(set(expanded.dense_variants))
    assert expanded.dense_variants[0] == "parser"


def test_expand_query_prioritizes_synonym_phrases_over_identifier_spellings() -> None:
    expanded = expand_query("find files", _DEFAULT_SYNONYMS, max_variants=6)

    assert expanded.dense_variants == [
        "find files",
        "find paths",
        "find documents",
        "finder files",
        "finder paths",
        "finder documents",
    ]
    assert "findFiles" not in expanded.dense_variants


def test_expand_query_caps_total_variant_pool_for_fts5() -> None:
    expanded = expand_query(
        "memory save adapter",
        {
            "memory": ["context", "state"],
            "save": ["persist", "store", "write"],
            "adapter": ["wrapper", "bridge"],
        },
        max_variants=6,
    )

    assert expanded.fts5_clause.count(" OR ") + 1 <= 23


def test_expand_query_max_variants_zero_is_noop() -> None:
    expanded = expand_query("memory save", _DEFAULT_SYNONYMS, max_variants=0)

    assert expanded.dense_variants == ["memory save"]
    assert expanded.fts5_clause == "memory save"
    assert expanded.expansion_applied is False


def test_expand_query_empty_query_is_noop() -> None:
    expanded = expand_query("   ", _DEFAULT_SYNONYMS, max_variants=6)

    assert expanded.original == "   "
    assert expanded.dense_variants == ["   "]
    assert expanded.fts5_clause == "   "
    assert expanded.expansion_applied is False


def test_expand_query_long_sentence_is_noop_by_default() -> None:
    query = "query-time path class adjustment that favors implementation files"
    expanded = expand_query(
        query,
        _DEFAULT_SYNONYMS,
        max_variants=6,
    )

    assert expanded.dense_variants == [query]
    assert expanded.fts5_clause == query
    assert expanded.expansion_applied is False
