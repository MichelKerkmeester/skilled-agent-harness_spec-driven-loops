#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REFERENCE CHECKER EXTRACTORS
# ───────────────────────────────────────────────────────────────
"""Read-only typed reference extraction for code, docs, config, and shell."""

from __future__ import annotations

import json
import re
from pathlib import PurePosixPath
from typing import Any, Iterator

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None  # type: ignore[assignment]

from reference_checker_models import ReferenceObservation


# ───────────────────────────────────────────────────────────────
# 1. PATTERNS
# ───────────────────────────────────────────────────────────────

JAVASCRIPT_EXTENSIONS = frozenset({".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"})
MARKDOWN_EXTENSIONS = frozenset({".md", ".mdx"})
CONFIG_EXTENSIONS = frozenset({".json", ".jsonc", ".toml", ".yaml", ".yml"})
SHELL_EXTENSIONS = frozenset({".bash", ".sh", ".zsh"})
PATH_KEY_TOKENS = frozenset(
    {
        "bin",
        "command",
        "directory",
        "entry",
        "entrypoint",
        "file",
        "filename",
        "include",
        "location",
        "module",
        "path",
        "root",
        "script",
        "source",
        "target",
        "template",
        "workspace",
    }
)
REGISTRY_NAME_TOKENS = frozenset({"manifest", "package", "registry", "routes", "scripts"})

IMPORT_PATTERN = re.compile(
    r"(?:\b(?:import|export)\b(?:[^;\n]*?\bfrom\s*)?|\bimport\s*\()"
    r"\s*(?P<quote>['\"])(?P<value>[^'\"\n]+)(?P=quote)",
    re.MULTILINE,
)
REQUIRE_PATTERN = re.compile(r"\brequire\s*\((?P<expression>[^)\n]*)\)")
GLOB_PATTERN = re.compile(
    r"\b(?:fastGlob|glob|globSync|fg\.sync|fg)\s*\((?P<expression>[^)\n]*)\)"
)
MARKDOWN_LINK_PATTERN = re.compile(
    r"!?\[[^\]\n]*\]\(\s*(?P<value><[^>]+>|[^\s)]+)", re.MULTILINE
)
YAML_VALUE_PATTERN = re.compile(
    r"^(?P<indent>\s*)(?P<key>[A-Za-z0-9_.-]+)\s*:\s*(?P<value>.+?)\s*$"
)
TOML_VALUE_PATTERN = re.compile(
    r"^(?P<key>[A-Za-z0-9_.-]+)\s*=\s*(?P<value>.+?)\s*$"
)
SHELL_SOURCE_PATTERN = re.compile(
    r"(?:^|[;&|]\s*)(?:source|\.)\s+(?P<value>[^\s;&|]+)", re.MULTILINE
)
SHELL_EXECUTABLE_PATTERN = re.compile(
    r"(?:^|[;&|]\s*)(?P<value>\.{1,2}/[^\s;&|]+)", re.MULTILINE
)
QUOTED_LITERAL_PATTERN = re.compile(r"^\s*(?P<quote>['\"])(?P<value>.*)(?P=quote)\s*$")
# Repo-rooted path literals in any surrounding text (command strings, prose, code fences) that the
# structured extractors skip because the value is not a clean standalone path token. Only paths
# under a known repository root are matched; the checker keeps solely the ones equal to a rename
# source, so unrelated matches are filtered out. Closes the gap where a renamed path embedded in an
# instruction or example was left pointing at the old name.
LITERAL_PATH_PATTERN = re.compile(
    r"(?<![\w./-])((?:\.opencode|\.claude|\.codex|\.github)/[\w.-]+(?:/[\w.-]+)*)(?![\w/-])"
)


# ───────────────────────────────────────────────────────────────
# 2. SHARED HELPERS
# ───────────────────────────────────────────────────────────────


def _line_column(text: str, offset: int) -> tuple[int, int]:
    """Return one-based line and column numbers for a character offset."""
    line = text.count("\n", 0, offset) + 1
    last_newline = text.rfind("\n", 0, offset)
    column = offset + 1 if last_newline < 0 else offset - last_newline
    return line, column


def _observation(
    file: PurePosixPath,
    text: str,
    kind: str,
    raw_value: str,
    start: int,
    end: int,
    *,
    dynamic: bool = False,
    expression: str = "",
    automatic_disposition: str | None = None,
) -> ReferenceObservation:
    line, column = _line_column(text, start)
    return ReferenceObservation(
        file=file,
        reference_kind=kind,
        raw_value=raw_value,
        line=line,
        column=column,
        span_start=start,
        span_end=end,
        dynamic=dynamic,
        expression=expression,
        automatic_disposition=automatic_disposition,
    )


def _strip_quotes(value: str) -> str:
    value = value.strip().rstrip(",")
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def _looks_path_like(key: str, value: str) -> bool:
    """Keep structured-data extraction on values with filesystem semantics."""
    normalized_key = key.lower().replace("-", "_")
    key_parts = set(normalized_key.split("_"))
    if key_parts & PATH_KEY_TOKENS:
        return True
    if value.startswith(("./", "../", "/")):
        return True
    return ("/" in value or "\\" in value) and not any(char.isspace() for char in value)


def _config_kind(file: PurePosixPath, key: str) -> str:
    stem_tokens = set(file.stem.lower().replace("-", "_").split("_"))
    key_tokens = set(key.lower().replace("-", "_").split("_"))
    if stem_tokens & REGISTRY_NAME_TOKENS or key_tokens & {
        "command",
        "entry",
        "entrypoint",
        "module",
        "script",
    }:
        return "registry-path"
    return "config-path"


def _find_value_offset(text: str, value: str, cursor: int) -> int:
    offset = text.find(value, cursor)
    return cursor if offset < 0 else offset


# ───────────────────────────────────────────────────────────────
# 3. LANGUAGE EXTRACTORS
# ───────────────────────────────────────────────────────────────


def extract_javascript(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Extract static module references and dynamic require/glob sites."""
    observations: list[ReferenceObservation] = []

    for match in IMPORT_PATTERN.finditer(text):
        start, end = match.span("value")
        observations.append(
            _observation(file, text, "js-module", match.group("value"), start, end)
        )

    for match in REQUIRE_PATTERN.finditer(text):
        expression = match.group("expression").strip()
        literal = QUOTED_LITERAL_PATTERN.match(expression)
        expression_start = match.start("expression")
        if literal:
            raw_value = literal.group("value")
            relative_start = expression.find(raw_value)
            start = expression_start + relative_start
            observations.append(
                _observation(file, text, "js-module", raw_value, start, start + len(raw_value))
            )
        else:
            observations.append(
                _observation(
                    file,
                    text,
                    "dynamic-require",
                    expression,
                    expression_start,
                    match.end("expression"),
                    dynamic=True,
                    expression=expression,
                )
            )
    for match in GLOB_PATTERN.finditer(text):
        expression = match.group("expression").strip()
        literal = QUOTED_LITERAL_PATTERN.match(expression)
        automatic = "bounded-static-pattern" if literal else None
        raw_value = literal.group("value") if literal else expression
        start = match.start("expression")
        observations.append(
            _observation(
                file,
                text,
                "dynamic-glob",
                raw_value,
                start,
                match.end("expression"),
                dynamic=True,
                expression=expression,
                automatic_disposition=automatic,
            )
        )
    return observations


def extract_markdown(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Extract inline links and path-valued frontmatter without treating keys as paths."""
    observations = _extract_line_config(file, text, "yaml")
    for match in MARKDOWN_LINK_PATTERN.finditer(text):
        raw_value = match.group("value")
        if raw_value.startswith("<") and raw_value.endswith(">"):
            raw_value = raw_value[1:-1]
            start = match.start("value") + 1
        else:
            start = match.start("value")
        observations.append(
            _observation(file, text, "markdown-link", raw_value, start, start + len(raw_value))
        )
    return observations


def _walk_values(value: Any, key: str = "") -> Iterator[tuple[str, str]]:
    if isinstance(value, dict):
        for child_key, child_value in value.items():
            yield from _walk_values(child_value, str(child_key))
        return
    if isinstance(value, list):
        for child in value:
            yield from _walk_values(child, key)
        return
    if isinstance(value, str) and _looks_path_like(key, value):
        yield key, value


def _extract_json(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return _extract_line_config(file, text, "json")
    observations = []
    cursor = 0
    for key, raw_value in _walk_values(payload):
        start = _find_value_offset(text, raw_value, cursor)
        cursor = start + len(raw_value)
        observations.append(
            _observation(
                file,
                text,
                _config_kind(file, key),
                raw_value,
                start,
                start + len(raw_value),
            )
        )
    return observations


def _extract_toml(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    if tomllib is None:
        return _extract_line_config(file, text, "toml")
    try:
        payload = tomllib.loads(text)
    except tomllib.TOMLDecodeError:
        return _extract_line_config(file, text, "toml")
    observations = []
    cursor = 0
    for key, raw_value in _walk_values(payload):
        start = _find_value_offset(text, raw_value, cursor)
        cursor = start + len(raw_value)
        observations.append(
            _observation(
                file,
                text,
                _config_kind(file, key),
                raw_value,
                start,
                start + len(raw_value),
            )
        )
    return observations


def _extract_line_config(
    file: PurePosixPath, text: str, syntax: str
) -> list[ReferenceObservation]:
    pattern = TOML_VALUE_PATTERN if syntax == "toml" else YAML_VALUE_PATTERN
    observations = []
    offset = 0
    for line in text.splitlines(keepends=True):
        match = pattern.match(line.rstrip("\r\n"))
        if match:
            key = match.group("key")
            raw_value = _strip_quotes(match.group("value"))
            if _looks_path_like(key, raw_value):
                relative_start = line.find(raw_value)
                start = offset + max(relative_start, 0)
                observations.append(
                    _observation(
                        file,
                        text,
                        _config_kind(file, key),
                        raw_value,
                        start,
                        start + len(raw_value),
                    )
                )
        offset += len(line)
    return observations


def extract_config(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Extract path-valued JSON, YAML, and TOML values without treating keys as paths."""
    if file.suffix == ".json":
        return _extract_json(file, text)
    if file.suffix == ".toml":
        return _extract_toml(file, text)
    return _extract_line_config(file, text, "yaml")


def extract_shell(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Extract shell source operands, executable paths, and dynamic source sites."""
    observations = []
    source_spans: list[tuple[int, int]] = []
    for match in SHELL_SOURCE_PATTERN.finditer(text):
        raw_value = _strip_quotes(match.group("value"))
        start, end = match.span("value")
        source_spans.append((start, end))
        if any(marker in raw_value for marker in ("$", "`", "$(")):
            observations.append(
                _observation(
                    file,
                    text,
                    "dynamic-source",
                    raw_value,
                    start,
                    end,
                    dynamic=True,
                    expression=match.group("value"),
                )
            )
        else:
            observations.append(
                _observation(file, text, "shell-source", raw_value, start, end)
            )

    for match in SHELL_EXECUTABLE_PATTERN.finditer(text):
        start, end = match.span("value")
        if any(source_start <= start < source_end for source_start, source_end in source_spans):
            continue
        raw_value = _strip_quotes(match.group("value"))
        observations.append(
            _observation(file, text, "shell-executable", raw_value, start, end)
        )
    return observations


# ───────────────────────────────────────────────────────────────
# 4. DISPATCH
# ───────────────────────────────────────────────────────────────


def extract_literal_paths(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Extract repo-rooted path literals from any surrounding text, structured or not."""
    observations: list[ReferenceObservation] = []
    for match in LITERAL_PATH_PATTERN.finditer(text):
        value = match.group(1)
        start, end = match.span(1)
        observations.append(_observation(file, text, "config-path", value, start, end))
    return observations


def extract_references(file: PurePosixPath, text: str) -> list[ReferenceObservation]:
    """Dispatch one text file to its supported extractor, plus a literal-path sweep."""
    suffix = file.suffix.lower()
    if suffix in JAVASCRIPT_EXTENSIONS:
        typed = extract_javascript(file, text)
    elif suffix in MARKDOWN_EXTENSIONS:
        typed = extract_markdown(file, text)
    elif suffix in CONFIG_EXTENSIONS:
        typed = extract_config(file, text)
    elif suffix in SHELL_EXTENSIONS:
        typed = extract_shell(file, text)
    else:
        typed = []
    # A literal path already reported by the typed extractor at the same span stays single;
    # otherwise the sweep adds the embedded occurrences the structured pass could not see.
    covered = {(observation.span_start, observation.span_end) for observation in typed}
    merged = list(typed)
    for observation in extract_literal_paths(file, text):
        span = (observation.span_start, observation.span_end)
        if span in covered:
            continue
        if any(start <= observation.span_start and observation.span_end <= end for start, end in covered):
            continue
        merged.append(observation)
    return merged


__all__ = [
    "CONFIG_EXTENSIONS",
    "JAVASCRIPT_EXTENSIONS",
    "MARKDOWN_EXTENSIONS",
    "SHELL_EXTENSIONS",
    "extract_config",
    "extract_javascript",
    "extract_markdown",
    "extract_references",
    "extract_shell",
]
