"""Deterministic query expansion for code identifier recall."""

from __future__ import annotations

import re
from dataclasses import dataclass
from itertools import islice, product

_TOKEN_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*")
_ACRONYM_BOUNDARY_RE = re.compile(r"([A-Z]+)([A-Z][a-z])")
_LOWER_UPPER_BOUNDARY_RE = re.compile(r"([a-z0-9])([A-Z])")
_WORD_RE = re.compile(r"[A-Za-z0-9]+")
_FTS5_QUOTE_RE = re.compile(r'"')
_SYNONYM_CAP = 8
_MAX_EXPANDABLE_CONTENT_WORDS = 4
_STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "before",
    "by",
    "for",
    "from",
    "in",
    "into",
    "is",
    "of",
    "on",
    "or",
    "over",
    "that",
    "the",
    "to",
    "with",
}

_DEFAULT_SYNONYMS: dict[str, list[str]] = {
    "adapter": ["wrapper", "bridge"],
    "build": ["compile", "bundle"],
    "config": ["settings", "options"],
    "create": ["add", "make", "new"],
    "delete": ["remove", "purge"],
    "emit": ["publish", "send"],
    "file": ["path", "document"],
    "files": ["paths", "documents"],
    "finder": ["walker", "search"],
    "init": ["initialize", "setup", "bootstrap"],
    "index": ["scan", "catalog"],
    "indexer": ["scanner", "cataloger"],
    "load": ["fetch", "read", "get"],
    "memory": ["context", "state"],
    "parser": ["lexer", "tokenizer"],
    "rerank": ["rescore", "rank"],
    "save": ["persist", "store", "write"],
    "search": ["find", "lookup"],
    "structural": ["symbol", "syntax"],
    "util": ["helper", "tool"],
    "walker": ["finder", "iterator", "traverser"],
}

_VERB_TO_NOUN_SYNONYMS: dict[str, list[str]] = {
    "find": ["finder"],
    "rank": ["ranker"],
    "rerank": ["reranker"],
    "scan": ["scanner"],
    "walk": ["walker"],
}


@dataclass(frozen=True)
class ExpandedQuery:
    """Expanded query payload consumed by vector and FTS5 search."""

    original: str
    dense_variants: list[str]
    fts5_clause: str
    expansion_applied: bool


def _dedupe_preserve_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value and value not in seen:
            result.append(value)
            seen.add(value)
    return result


def _normalize_word(word: str) -> str:
    return word.strip().lower()


def split_compound_identifier(token: str) -> list[str]:
    """Split camelCase, PascalCase, snake_case, kebab-case, and SCREAMING_SNAKE tokens."""
    stripped = token.strip()
    if not stripped:
        return []

    separated = re.sub(r"[_-]+", " ", stripped)
    separated = _ACRONYM_BOUNDARY_RE.sub(r"\1 \2", separated)
    separated = _LOWER_UPPER_BOUNDARY_RE.sub(r"\1 \2", separated)
    return [_normalize_word(part) for part in _WORD_RE.findall(separated)]


def generate_identifier_variants(words: list[str]) -> list[str]:
    """Generate common identifier spellings for a phrase, capped at six variants."""
    normalized = [_normalize_word(word) for word in words if _normalize_word(word)]
    if not normalized:
        return []

    first, *rest = normalized
    titled = [word[:1].upper() + word[1:] for word in normalized]
    variants = [
        first + "".join(word[:1].upper() + word[1:] for word in rest),
        "_".join(normalized),
        "".join(titled),
        "-".join(normalized),
        "_".join(normalized).upper(),
        "".join(normalized),
    ]
    return _dedupe_preserve_order(variants)[:6]


def apply_synonyms(
    words: list[str],
    synonym_dict: dict[str, list[str]],
) -> list[list[str]]:
    """Return single-hop synonym word-list alternatives with bounded combinations."""
    normalized_words = [_normalize_word(word) for word in words if _normalize_word(word)]
    if not normalized_words:
        return []

    choices: list[list[str]] = []
    for word in normalized_words:
        alternatives = [word]
        alternatives.extend(
            _normalize_word(item)
            for item in synonym_dict.get(word, [])
            if isinstance(item, str) and _normalize_word(item)
        )
        alternatives.extend(_VERB_TO_NOUN_SYNONYMS.get(word, []))
        choices.append(_dedupe_preserve_order(alternatives))

    variants: list[list[str]] = []
    seen: set[tuple[str, ...]] = set()
    for candidate in islice(product(*choices), _SYNONYM_CAP):
        key = tuple(candidate)
        if key in seen:
            continue
        variants.append(list(candidate))
        seen.add(key)
    return variants


def _extract_words(query: str) -> list[str]:
    words: list[str] = []
    for token in _TOKEN_RE.findall(query):
        words.extend(split_compound_identifier(token))
    return words


def _quote_fts5_phrase(value: str) -> str:
    escaped = _FTS5_QUOTE_RE.sub('""', value)
    return f'"{escaped}"'


def _build_fts5_clause(words: list[str], variants: list[str]) -> str:
    terms = _dedupe_preserve_order([*words, *variants])
    return " OR ".join(_quote_fts5_phrase(term) for term in terms if term.strip())


def _content_words(words: list[str]) -> list[str]:
    return [word for word in words if word not in _STOPWORDS]


def _phrase_candidates(words: list[str]) -> list[list[str]]:
    content_words = _content_words(words)
    if len(content_words) < 2:
        return [content_words or words]
    return [content_words]


def _expanded_variant_pool(
    query: str,
    words: list[str],
    synonym_dict: dict[str, list[str]],
) -> list[str]:
    candidates = _phrase_candidates(words)
    variants = [query]
    for word_list in apply_synonyms(candidates[0], synonym_dict):
        phrase = " ".join(word_list)
        variants.append(phrase)
        variants.extend(generate_identifier_variants(word_list))
    return _dedupe_preserve_order(variants)


def expand_query(
    query: str,
    synonym_dict: dict[str, list[str]],
    max_variants: int,
    fts5_compliant: bool = True,
) -> ExpandedQuery:
    """Expand natural language query text into dense variants and an FTS5 OR clause."""
    if max_variants < 1:
        return ExpandedQuery(
            original=query,
            dense_variants=[query],
            fts5_clause=query,
            expansion_applied=False,
        )

    original = query
    stripped = query.strip()
    if not stripped:
        return ExpandedQuery(
            original=original,
            dense_variants=[original],
            fts5_clause=original,
            expansion_applied=False,
        )

    words = _extract_words(stripped)
    if not words:
        return ExpandedQuery(
            original=original,
            dense_variants=[original],
            fts5_clause=original,
            expansion_applied=False,
        )

    if len(_content_words(words)) > _MAX_EXPANDABLE_CONTENT_WORDS:
        return ExpandedQuery(
            original=original,
            dense_variants=[original],
            fts5_clause=original,
            expansion_applied=False,
        )

    variant_pool = _expanded_variant_pool(stripped, words, synonym_dict)
    dense_variants = variant_pool[:max_variants]
    fts5_clause = (
        _build_fts5_clause(words, variant_pool)
        if fts5_compliant
        else " OR ".join(variant_pool)
    )
    return ExpandedQuery(
        original=original,
        dense_variants=dense_variants,
        fts5_clause=fts5_clause,
        expansion_applied=dense_variants != [stripped],
    )
