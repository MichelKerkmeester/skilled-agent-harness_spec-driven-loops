#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README/DOCUMENTATION FORMAT VALIDATOR
# ───────────────────────────────────────────────────────────────

"""
README/Documentation Format Validator

Validates markdown documentation against template rules to ensure
consistent formatting with proper TOC, H2 emojis, and section structure.

Usage:
    python validate_document.py <document.md> [--type readme|code_folder|skill|reference|asset|agent|command|install_guide|security_policy|skill_router|spec|changelog]
    python validate_document.py <document.md> --json
    python validate_document.py <document.md> --fix [--dry-run]
    python validate_document.py <document.md> --blocking-only

Exit Codes:
    0 - Valid (no blocking errors)
    1 - Invalid (blocking errors found)
    2 - File not found or parse error

Citation drift advisory:
    The human report ends with any `cite-drift advisory:` lines that
    cite-drift-scan.mjs --advise prints for the document's file-and-line
    citations. They never change the exit code, and --json and
    --blocking-only skip them. JEV_FEATURE_CITE_DRIFT=0 and JEV_FEATURES=0
    skip the check, as does the older SKDOC_CITE_DRIFT_CHECK=0;
    SKDOC_CITE_DRIFT_OUT=<dir> records its model calls in <dir>/calls.jsonl.

Examples:
    python validate_document.py README.md
    python validate_document.py SKILL.md --type skill
    python validate_document.py doc.md --json
    python validate_document.py doc.md --fix --dry-run
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path, PurePosixPath
from typing import Any, Dict, List, Optional, Tuple


# Command frontmatter shares its description-budget, quote handling, and MCP-token
# rules with the sibling skill validator so the two never diverge on the same
# frontmatter. The sibling lives next to this file; fall back to local copies only if
# it cannot be imported, so this validator always stays runnable on its own.
try:
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from quick_validate import (  # type: ignore
        check_description_length as _check_description_length,
        strip_matching_quotes as _strip_matching_quotes,
        is_non_fq_mcp_token as _is_non_fq_mcp_token,
        iter_allowed_tools as _iter_allowed_tools,
        DESCRIPTION_SOFT_TARGET_COMMAND as _DESC_SOFT_COMMAND,
        DESCRIPTION_HARD_CAP as _DESC_HARD_CAP,
    )
except Exception:  # pragma: no cover - defensive fallback if the sibling is unavailable
    _DESC_SOFT_COMMAND, _DESC_HARD_CAP = 110, 1536

    def _strip_matching_quotes(value: str) -> str:
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            return value[1:-1]
        return value

    def _check_description_length(description, soft_target, hard_cap=_DESC_HARD_CAP):
        length = len(description)
        if length > hard_cap:
            return (
                f"Description is {length} chars, exceeds hard cap of {hard_cap} chars.",
                None,
            )
        if length > soft_target:
            return (None, f"Description is {length} chars, exceeds soft target of {soft_target}.")
        return (None, None)

    _MCP_NAMESPACE_RE = re.compile(r'^mcp_', re.IGNORECASE)
    _MCP_FQ_RE = re.compile(
        r'^mcp__[a-z0-9]+(?:[_-][a-z0-9]+)*__(?:\*|[a-z0-9]+(?:[_-][a-z0-9]+)*)$',
        re.IGNORECASE,
    )

    def _is_non_fq_mcp_token(token: str) -> bool:
        token = token.strip()
        return bool(_MCP_NAMESPACE_RE.match(token)) and not bool(_MCP_FQ_RE.match(token))

    def _iter_allowed_tools(tools_value: str):
        value = tools_value.strip()
        if value.startswith('[') and value.endswith(']'):
            value = value[1:-1]
        for token in value.split(','):
            token = token.strip()
            if token:
                yield token


# PyYAML ships with the system interpreter but not with every Homebrew install, so
# the frontmatter parse stays optional: without it, a line check still catches the
# common shapes a strict parser rejects and a key-by-key reader does not.
try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover - depends on the interpreter
    yaml = None  # type: ignore


# An argument-hint should summarize the invocation shape; the router body's
# EXECUTION TARGETS section is where the full flag surface is enumerated. This
# is a soft budget — over-budget hints warn, they never block registration.
_HINT_SOFT_BUDGET = 140


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F9FF"
    "\U00002600-\U000026FF"
    "\U00002700-\U000027BF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "]"
)

# Paths to exclude from validation (auto-generated, third-party, etc.)
EXCLUDED_PATH_PATTERNS = [
    '.pytest_cache',
    'node_modules',
    '__pycache__',
    '.git',
    'vendor',
    'dist',
    'build',
    '.venv',
    'venv',
]

# Third-party directories that use different README conventions
THIRD_PARTY_PATTERNS = [
    # Add third-party patterns here if needed
]

# Template directories with intentionally minimal placeholder READMEs
TEMPLATE_PATTERNS = [
    'system-spec-kit/templates/',  # Spec folder templates are minimal by design
]

# Fixture trees hold the shapes they exercise, so a fixture's structure is pinned by
# the test that reads it rather than by this validator's section conventions.
# `package_skill.py` exempts the same trees from its naming check for the same reason;
# this list is the section-content half of that reasoning.
FIXTURE_TREE_PATTERNS = [
    'sk-doc/scripts/tests/exclusions/',  # classification fixtures for the README audit
]

# A benchmark run folder (benchmark/reports/<run>/) holds a README plus the companion
# files the report contract names. Their shape belongs to that contract and to the
# renderer that writes them, not to the README section conventions.
BENCHMARK_COMPANION_NAMES = (
    'failed-runs.md',
    'source.md',
    'skill-benchmark-report.md',
    'findings-and-recommendations.md',
)

# A spec packet or phase folder name: three digits, an optional letter, then a
# dash. Such a name can end in "fixtures" and still be a packet, not a fixture tree.
SPEC_FOLDER_SEGMENT = re.compile(r'^\d{3}[a-z]?-')

# Runtime instruction files are the operating contract a coding agent loads at
# startup, so every section in one loads into every session. They keep their
# runtime's own template rather than a document type's required sections.
# Matched by exact name.
INSTRUCTION_FILE_NAMES = [
    'AGENTS.md',
]

# The DESIGN.md format spec and its sample outputs. Their section numbers are the
# format's own section ids, which the generator and its references cite, so
# renumbering them to this validator's conventions would break the format.
# Matched by path suffix, so a sibling such as writing-notes.md is still validated.
FORMAT_SPEC_FILES = [
    'sk-design-md-generator/references/design-md-format.md',
    'sk-design-md-generator/references/examples/linear/DESIGN.md',
    'sk-design-md-generator/references/examples/stripe/DESIGN.md',
    'sk-design-md-generator/references/examples/supabase/DESIGN.md',
    'sk-design-md-generator/references/examples/vercel/DESIGN.md',
]

# Specialized leaf-doc root dir names. Both the hyphen and underscore forms are
# accepted while the naming migration is in flight; the shared resolver is the
# single source of truth so this validator and the guards never diverge on which
# root names are recognized. Fall back to local copies so the validator still runs
# standalone if the sibling cannot be imported.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import render_exempt  # type: ignore
from naming_root_resolver import (  # type: ignore
    PLAYBOOK_ROOT_NAMES as PLAYBOOK_DIR_NAMES,
    CATALOG_ROOT_NAMES as CATALOG_DIR_NAMES,
    assert_supported_root_path,
)
from validation_switch import exit_if_validation_off  # type: ignore


def should_exclude_path(file_path: str) -> Tuple[bool, Optional[str]]:
    """Check if file path should be excluded from validation."""
    path_str = str(file_path)

    # Check excluded patterns (auto-generated, dependencies)
    for pattern in EXCLUDED_PATH_PATTERNS:
        if f'/{pattern}/' in path_str or f'\\{pattern}\\' in path_str:
            return True, f"Excluded: matches pattern '{pattern}'"

    # Check third-party patterns
    for pattern in THIRD_PARTY_PATTERNS:
        if pattern in path_str:
            return True, f"Third-party: matches pattern '{pattern}'"

    # Check template patterns (intentionally minimal)
    for pattern in TEMPLATE_PATTERNS:
        if pattern in path_str:
            return True, f"Template: matches pattern '{pattern}' (intentionally minimal)"

    # Check fixture trees: any path segment ending in "fixtures" (mirrors
    # package_skill.py's naming exemption), plus known fixture trees that a test
    # suite names for a different reason than the literal segment "fixtures".
    # A numbered segment such as `001-shared-mode-contracts-and-fixtures` names a
    # spec packet or phase, and skipping it would hide that packet's documents.
    # The singular "-fixture" folder name (review-output-fixture/) is the same kind
    # of tree, so it is matched as a folder segment rather than a file name.
    normalized = path_str.replace('\\', '/')
    folders = normalized.split('/')[:-1]
    if any(part.endswith(('fixtures', 'fixture')) and not SPEC_FOLDER_SEGMENT.match(part)
           for part in folders):
        return True, "Fixture tree: holds the shapes it exercises"
    for pattern in FIXTURE_TREE_PATTERNS:
        if pattern in normalized:
            return True, f"Fixture tree: matches pattern '{pattern}'"

    if normalized.rsplit('/', 1)[-1] in INSTRUCTION_FILE_NAMES:
        return True, "Instruction file: keeps its runtime's own section template"

    if any(normalized.endswith('/' + suffix) for suffix in FORMAT_SPEC_FILES):
        return True, "Format spec: its section numbers are the DESIGN.md format's ids"

    return False, None


# ───────────────────────────────────────────────────────────────
# 2. UTILITIES
# ───────────────────────────────────────────────────────────────

def load_template_rules(script_dir: Path) -> Dict[str, Any]:
    """Load template_rules.json from assets folder."""
    rules_path = script_dir.parent / "assets" / "template-rules.json"
    if not rules_path.exists():
        print(f"Error: template_rules.json not found at {rules_path}", file=sys.stderr)
        sys.exit(2)

    with open(rules_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_rules() -> Dict[str, Any]:
    """Load template rules for callers importing the validator module."""
    return load_template_rules(Path(__file__).resolve().parent)


def _detect_document_type_with_source(file_path: str, content: str, rules: Dict[str, Any]) -> Tuple[str, str]:
    """Detect document type and whether a path rule ('rule') or the README default ('default') decided it."""
    path_lower = str(file_path).lower()
    assert_supported_root_path(path_lower)
    portable_path = PurePosixPath(path_lower.replace('\\', '/'))

    if any(f'/{name}/' in path_lower or f'\\{name}\\' in path_lower for name in PLAYBOOK_DIR_NAMES):
        # A per-feature playbook leaf sits one level below the category root
        # (manual-testing-playbook/<category>/<feature>.md). Classify by that structural
        # position rather than an ordinal folder-name prefix, so category folders can be
        # named by meaning alone. The root index file (whose parent IS the
        # manual_testing_playbook dir) is intentionally excluded.
        if portable_path.parent.parent.name in PLAYBOOK_DIR_NAMES:
            return 'playbook_feature', 'rule'
    # Per-feature catalog leaves sit one level below the catalog root
    # (feature-catalog/<category>/<feature>.md). These carry the Validation And Tests
    # table whose Type taxonomy and placeholder rows the generic readme path misses.
    # Classify by structural position rather than an ordinal folder-name prefix; the
    # root index file (whose parent IS the feature_catalog dir) stays excluded.
    if any(f'/{name}/' in path_lower or f'\\{name}\\' in path_lower for name in CATALOG_DIR_NAMES):
        if portable_path.parent.parent.name in CATALOG_DIR_NAMES:
            return 'feature_catalog', 'rule'
    # A README inside a commands folder uses the .markdown extension so OpenCode does
    # not register it as a command, and the commands-folder rule would misread it.
    if portable_path.name == 'readme.markdown':
        return 'readme', 'rule'
    if '/command/' in path_lower or '\\command\\' in path_lower or '/commands/' in path_lower or '\\commands\\' in path_lower:
        return 'command', 'rule'
    # Changelog files: under .skilled/changelog/, .skilled/skills/*/changelog/,
    # or spec-folder nested changelog/ subdirectories. Files match v{VERSION}.md or changelog-*.md
    # The folder decides before any word in the name does, so a packet changelog
    # about install guides is still a changelog.
    if '/changelog/' in path_lower or '\\changelog\\' in path_lower:
        return 'changelog', 'rule'
    # An install guide is a document a skill owns next to its own SKILL.md, named
    # INSTALL-GUIDE.md. Classify it by that filename, the only thing that marks it.
    if 'install_guide' in Path(path_lower).stem or 'install-guide' in Path(path_lower).stem:
        return 'install_guide', 'rule'
    # A repository security policy is named SECURITY.md wherever it sits, the root or
    # .github/, and only that exact name marks it. The match is case-sensitive so a
    # lowercase security.md reference or playbook leaf keeps its own type.
    if Path(str(file_path)).name == 'SECURITY.md':
        return 'security_policy', 'rule'
    # A skill or mode keeps its machine router in a sibling ROUTER.md, and only that
    # exact name marks it. Without this rule a router fell back to README rules.
    if Path(str(file_path)).name == 'ROUTER.md':
        return 'skill_router', 'rule'
    # A companion file sits in a run folder below benchmark/reports/, either directly
    # (reports/<run>/) or under a grouping folder (reports/<group>/<run>/).
    if (portable_path.name in BENCHMARK_COMPANION_NAMES
            and '/benchmark/reports/' in f'/{portable_path.parent.parent.as_posix()}/'):
        return 'benchmark_companion', 'rule'
    if path_lower.endswith('readme.md'):
        return 'readme', 'rule'
    if path_lower.endswith('skill.md'):
        return 'skill', 'rule'
    if '/specs/' in path_lower or '\\specs\\' in path_lower:
        return 'spec', 'rule'
    if '/agents/' in path_lower or '\\agents\\' in path_lower or '/agent/' in path_lower or '\\agent\\' in path_lower:
        return 'agent', 'rule'
    if '/references/' in path_lower or '\\references\\' in path_lower:
        return 'reference', 'rule'
    # A skill scaffold is the template a renderer copies into SKILL.md, so the sections
    # it must carry are the ones that file needs, not the asset rule's Overview, which
    # no SKILL.md ever has. Name and the assets/ ancestor together mark a template;
    # either alone would also catch written documentation.
    if 'scaffold' in portable_path.stem and ('/assets/' in path_lower or '\\assets\\' in path_lower):
        return 'skill', 'rule'
    if '/assets/' in path_lower or '\\assets\\' in path_lower:
        return 'asset', 'rule'

    # Default to readme for general markdown
    return 'readme', 'default'


def detect_document_type(file_path: str, content: str, rules: Dict[str, Any]) -> str:
    """Detect document type from file path or content."""
    return _detect_document_type_with_source(file_path, content, rules)[0]


def has_emoji(text: str) -> bool:
    """Check if text contains an emoji."""
    return bool(EMOJI_PATTERN.search(text))


def extract_first_emoji(text: str) -> Optional[str]:
    """Extract the first emoji from text."""
    match = EMOJI_PATTERN.search(text)
    return match.group(0) if match else None


def normalize_section_name(name: str) -> str:
    """Normalize section name for lookup in rules."""
    name = EMOJI_PATTERN.sub('', name)
    name = name.strip().lower().replace(' ', '_')
    name = re.sub(r'[^a-z0-9_]', '', name)
    return name


def extract_section_name_text(text: str) -> str:
    """
    Extract the section name text after removing number prefix and emoji.

    Examples:
        "1. 📖 Overview" -> "Overview"
        "📖 OVERVIEW" -> "OVERVIEW"
        "1. Overview" -> "Overview"
    """
    # Remove leading number and dot (e.g., "1. ")
    text = re.sub(r'^\d+\.\s*', '', text)
    # Remove emoji
    text = EMOJI_PATTERN.sub('', text)
    # Clean up whitespace
    return text.strip()


# Patterns that separate a legitimate mixed-case token (a code identifier or a
# product/acronym name) from a header that simply was not uppercased. Each
# requires a lowercase run to follow every internal capital, so a scrambled word
# like "oVERVIEW" or "tITLE" — a lone lowercase letter in front of an all-caps
# run — matches none of them and is correctly rejected.
_CAMEL_CASE = re.compile(r'[a-z][a-z0-9]*(?:[A-Z][a-z0-9]+)+')       # renderBlocks, gate3Precedence
# Two or more capitalized segments: a single one (e.g. "Overview") is just a
# Title-Case word that must be uppercased, not a product name.
_PASCAL_CASE = re.compile(r'(?:[A-Z][a-z0-9]+){2,}')                  # JavaScript, OpenCode, MiMo
_ACRONYM_SUFFIX = re.compile(r'[A-Z]{2,}[a-z0-9]*')                   # OAuth, PDFs, AIs, HTTPStatus
# Irregular lowercase-first product names that no structural pattern can tell
# apart from garbage; keep this list explicit and small.
_PROPER_NOUN_WHITELIST = {'iOS', 'iPadOS', 'macOS', 'eBay', 'iPhone'}


def _is_identifier_or_proper_noun(token: str) -> bool:
    """A mixed-case token that is a code identifier or a product/acronym name."""
    return bool(
        _CAMEL_CASE.fullmatch(token)
        or _PASCAL_CASE.fullmatch(token)
        or _ACRONYM_SUFFIX.fullmatch(token)
        or token in _PROPER_NOUN_WHITELIST
    )


def _strip_nonprose(text: str) -> str:
    """
    Remove the parts of a header the ALL-CAPS rule must not police: code spans,
    autolinks, inline-link destinations (keeping the visible label), and balanced
    parenthetical groups (annotations and function-call args). Parentheses are
    matched by depth so a header like "API (legacy (v2) only)" is fully removed
    and a link whose URL itself contains parentheses never leaks a fragment — the
    two failure modes the earlier first-closing-paren regex got wrong.
    """
    text = re.sub(r'`[^`]*`', ' ', text)   # inline code spans first
    out = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch == '<':                       # autolink <https://...>
            j = text.find('>', i + 1)
            if j != -1:
                out.append(' ')
                i = j + 1
                continue
        if ch == '[':                       # inline link [label](url): keep label, drop the URL
            close = text.find(']', i + 1)
            if close != -1 and close + 1 < n and text[close + 1] == '(':
                out.append(' ' + text[i + 1:close] + ' ')
                depth, k = 0, close + 1
                while k < n:
                    if text[k] == '(':
                        depth += 1
                    elif text[k] == ')':
                        depth -= 1
                        if depth == 0:
                            k += 1
                            break
                    k += 1
                i = k
                continue
        if ch == '(':                       # function call, or a parenthetical annotation
            # A '(' with an identifier immediately before it (no space) is a
            # function name plus args, so drop the name too; a space before it
            # means a prose word followed by a parenthetical, so keep the word.
            while out and (out[-1].isalnum() or out[-1] in '_.'):
                out.pop()
            depth, k = 0, i
            while k < n:
                if text[k] == '(':
                    depth += 1
                elif text[k] == ')':
                    depth -= 1
                    if depth == 0:
                        k += 1
                        break
                k += 1
            out.append(' ')
            i = k
            continue
        out.append(ch)
        i += 1
    return ''.join(out)


def is_uppercase_section(text: str) -> bool:
    """
    Check whether a section name satisfies the ALL-CAPS rule.

    The rule applies to prose words only. Code spans, parenthetical annotations,
    function-call args, and link destinations are removed first; a code
    identifier (camelCase) or a product/acronym name (PascalCase, OAuth, PDFs)
    is then accepted as-is. A header fails only when a plain prose word is
    Title-Case, all-lowercase, or scrambled mixed-case.

    Examples:
        "OVERVIEW" -> True
        "Overview" -> False
        "oVERVIEW" -> False
        "INSTALLATION & SETUP" -> True
        "MODE DETECTION (`SP-001..SP-004`)" -> True
        "DEPTH LOOP renderBlocks" -> True
        "API (legacy (v2) only)" -> True
        "API <https://example.com/docs>" -> True
    """
    section_name = extract_section_name_text(text)
    for raw in re.split(r'[\s/,:;.\-—–&\'"?!→|]+', _strip_nonprose(section_name)):
        token = raw.strip('`()[]{}\'".,:;<>')
        letters = [c for c in token if c.isalpha()]
        if len(letters) < 2:
            continue
        if ''.join(letters).isupper():
            continue                       # ALL-CAPS prose word: fine
        if _is_identifier_or_proper_noun(token):
            continue                       # code identifier or product/acronym name
        return False                       # Title-Case, lowercase, or scrambled prose word
    # Nothing prose remained to enforce the rule on.
    return True


def make_uppercase_section(text: str) -> str:
    """
    Convert section name to ALL CAPS while preserving structure.

    Examples:
        "Overview" -> "OVERVIEW"
        "Quick Start" -> "QUICK START"
        "What's Next?" -> "WHAT'S NEXT?"
    """
    return text.upper()


# ───────────────────────────────────────────────────────────────
# 3. TOC VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_toc(content: str, doc_type_rules: Dict[str, Any], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate TABLE OF CONTENTS section."""
    errors = []

    if not doc_type_rules.get('tocRequired', False):
        return errors

    # Accept variations with emoji (📑) or without
    # Pattern: ## [optional emoji] TABLE OF CONTENTS
    toc_match = re.search(
        r'## (?:[^\w\s]\s+)?TABLE OF CONTENTS\s*\n(.*?)(?=\n---|\n## |\Z)',
        content,
        re.DOTALL | re.IGNORECASE
    )

    if not toc_match:
        errors.append({
            'type': 'missing_toc',
            'severity': 'blocking',
            'message': 'Missing TABLE OF CONTENTS section',
            'fix_hint': 'Add "## TABLE OF CONTENTS" section with linked entries'
        })
        return errors

    toc_content = toc_match.group(1)

    for line_num, line in enumerate(toc_content.strip().split('\n'), start=1):
        line = line.strip()
        if not line.startswith('- ['):
            continue

        # Double-dash anchors required for GitHub compatibility
        anchor_match = re.search(r'\(#(\d+)-([a-z])', line)
        if anchor_match:
            errors.append({
                'type': 'toc_single_dash_anchor',
                'severity': 'blocking',
                'message': f'TOC anchor uses single dash instead of double dash',
                'line': line,
                'fix_hint': f'Change "#N-" to "#N--" in anchor',
                'auto_fixable': True,
                'fix': line.replace(f'#{anchor_match.group(1)}-', f'#{anchor_match.group(1)}--')
            })

        entry_match = re.search(r'\[(.+?)\]', line)
        if entry_match:
            entry_text = entry_match.group(1)

            # Check for ALL CAPS (only for readme type which requires it)
            uppercase_required = doc_type_rules.get('tocUppercaseRequired', False)
            if uppercase_required and not is_uppercase_section(entry_text):
                section_text = extract_section_name_text(entry_text)
                # Build fixed entry: preserve number and emoji, uppercase the name
                # Pattern: "N. EMOJI name" -> "N. EMOJI NAME"
                fixed_entry = re.sub(
                    r'^(\d+\.\s*)([^\w\s]\s*)?(.+)$',
                    lambda m: f"{m.group(1)}{m.group(2) or ''}{m.group(3).upper()}",
                    entry_text
                )
                fixed_line = line.replace(f'[{entry_text}]', f'[{fixed_entry}]')

                errors.append({
                    'type': 'toc_not_uppercase',
                    'severity': 'blocking',
                    'message': f'TOC entry not ALL CAPS: "{entry_text}"',
                    'line': line,
                    'auto_fixable': True,
                    'fix': fixed_line,
                    'fix_hint': f'Change "{section_text}" to "{section_text.upper()}"'
                })

    return errors


# ───────────────────────────────────────────────────────────────
# 4. HEADER VALIDATION
# ───────────────────────────────────────────────────────────────

def _fenced_line_numbers(content: str) -> set:
    """1-based line numbers that fall inside fenced code blocks.

    Tracks the opening fence's backtick length so a longer outer fence (```` )
    keeps shorter inner fences (```) literal, and a closing fence must be at least
    as long as its opener with no info string. This is why a naive "any ``` opens,
    a bare ``` closes" scan mis-nests 4-backtick doc examples. Used so section
    numbering ignores numbered headers shown inside a copy-able template example —
    they are content, not document sections.
    """
    fenced = set()
    fence_len = 0
    for i, line in enumerate(content.split('\n'), start=1):
        stripped = line.strip()
        if stripped.startswith('```'):
            ticks = len(stripped) - len(stripped.lstrip('`'))
            info = stripped[ticks:].strip()
            fenced.add(i)
            if fence_len == 0:
                fence_len = ticks
            elif ticks >= fence_len and info == '':
                fence_len = 0
            continue
        if fence_len > 0:
            fenced.add(i)
    return fenced


_STRUCTURE_ENFORCEMENT_ENV = 'SKDOC_ENFORCE_STRUCTURE'


def is_repo_root_readme(file_path: str) -> bool:
    """Whether the file is the README at a repository root, the directory that holds
    `.git` (a folder in a checkout, a file in a linked worktree). That README separates
    its sections with `&nbsp;` lines instead of `---` rules, so the divider rule skips it."""
    path = Path(file_path).resolve()
    return path.name.lower() == 'readme.md' and (path.parent / '.git').exists()


def _structure_enforcement_enabled() -> bool:
    """Whether the general-path structure rules are enforced: a `---` divider between
    numbered ALL-CAPS H2 sections, no Table of Contents, and no navigation-anchor
    comments. Enforced by default. Set SKDOC_ENFORCE_STRUCTURE=0 to opt out, e.g. while
    migrating a doc set whose section structure has not been normalized yet."""
    return os.environ.get(_STRUCTURE_ENFORCEMENT_ENV, '1') != '0'


def _transparent_structure_line(line: str) -> bool:
    """Return whether a line is transparent when checking a section boundary."""
    stripped = line.strip()
    return not stripped or bool(re.fullmatch(r'<!--.*-->', stripped))


def _section_caps_ignoring_qualifier(title: str) -> bool:
    """A numbered H2 counts as a section heading when its text, minus any parenthetical
    qualifier, is uppercase. This keeps headings like "FILE-LAYER SURFACE (what the AI
    edits)" in scope while leaving genuinely title-case headings out."""
    core = re.sub(r'\([^)]*\)', '', title).strip()
    return bool(core) and core == core.upper()


def validate_general_structure(content: str, doc_type_rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate staged divider and navigation rules for the general path."""
    if not _structure_enforcement_enabled():
        return []

    errors: List[Dict[str, Any]] = []
    lines = content.splitlines()
    fenced_lines = _fenced_line_numbers(content)

    if doc_type_rules.get('h2DividerRequired', False):
        h2_pattern = re.compile(r'^##\s+(\d+)\.\s+(.+?)\s*$')
        numbered_h2_lines = []
        for line_number, line in enumerate(lines, start=1):
            if line_number in fenced_lines:
                continue
            match = h2_pattern.match(line)
            if match and _section_caps_ignoring_qualifier(match.group(2)):
                numbered_h2_lines.append(line_number)

        for line_number in numbered_h2_lines[1:]:
            previous = line_number - 1
            while previous > 0 and _transparent_structure_line(lines[previous - 1]):
                previous -= 1
            if previous == 0 or lines[previous - 1].strip() != '---':
                errors.append({
                    'type': 'general_h2_separator',
                    'rule_id': 'general_h2_separator',
                    'severity': 'blocking',
                    'message': 'Numbered ALL-CAPS H2 sections must be separated by `---`.',
                    'line': lines[line_number - 1],
                    'line_number': line_number,
                    'fix_hint': 'Add `---` immediately above the numbered H2 section.',
                })

    outside_body = '\n'.join(
        line for line_number, line in enumerate(lines, start=1)
        if line_number not in fenced_lines
    )
    if doc_type_rules.get('tocForbidden', False) and re.search(
        r'(?im)^\s*(?:#{1,6}\s+)?(?:\d+\.\s+)?TABLE OF CONTENTS\b',
        outside_body,
    ):
        errors.append({
            'type': 'general_no_toc',
            'rule_id': 'general_no_toc',
            'severity': 'blocking',
            'message': 'This document type must not contain a Table of Contents.',
            'fix_hint': 'Remove the Table of Contents and use numbered H2 sections for navigation.',
        })
    if doc_type_rules.get('anchorNavigationForbidden', False) and re.search(
        r'^[ \t]*<!--[ \t]*/?ANCHOR:[^>\r\n]*-->[ \t]*$',
        outside_body,
        re.IGNORECASE | re.MULTILINE,
    ):
        errors.append({
            'type': 'general_no_anchor',
            'rule_id': 'general_no_anchor',
            'severity': 'blocking',
            'message': 'This document type must not contain anchor-comment navigation.',
            'fix_hint': 'Remove navigation anchor comments and use numbered H2 sections instead.',
        })

    return errors


# ───────────────────────────────────────────────────────────────
# 4B. RENDER CHECKS
# ───────────────────────────────────────────────────────────────
#
# Each check reads rendered Markdown shape rather than section presence, so it
# skips YAML frontmatter and every line `_fenced_line_numbers` marks as code.
# A finding is always a warning: the classes are mechanical to spot but their
# repair is editorial, and only a strict packaging run promotes them.

_LIST_LINE = re.compile(r'^\s*(?:[-*+]|\d+[.)])\s+')
_H2_ANY = re.compile(r'^##(?!#)\s+(\S.*?)\s*$')
_H2_NUMBERED = re.compile(r'^##(?!#)\s+(\d+)([A-Za-z]?)\.\s+(\S.*?)\s*$')
_H3_ANY = re.compile(r'^###(?!#)\s+(\S.*?)\s*$')
_RULE_ID_H3 = re.compile(r'^###(?!#)\s+[A-Z]{1,4}\d+[a-z]?\.\s')
_SEPARATOR_LINE = re.compile(r'^\s*(?:-{3,}|\*{3,}|_{3,})\s*$')
_SETEXT_UNDERLINE = re.compile(r'^\s*(?:-{3,}|={3,})\s*$')
_HTML_COMMENT_LINE = re.compile(r'^\s*<!--.*-->\s*$')
_BARE_URL = re.compile(r'https?://')
_INLINE_CODE = re.compile(r'`[^`\n]*`')
_INLINE_LINK = re.compile(r'\[[^\]]*\]\([^)]*\)')
# An image inside a link, as a badge is, is masked first so the outer link matches.
_INLINE_IMAGE = re.compile(r'!\[[^\]]*\]\([^)]*\)')
_ANGLE_TAG = re.compile(r'<[^>\n]*>')
_LINK_DEFINITION = re.compile(r'^\s*\[[^\]]+\]:\s*\S+')
_SENTENCE_BREAK = re.compile(r'(?<=[.!?])\s+')
_WORD = re.compile(r'[a-z0-9]+')

# Advisory threshold for the intro/Purpose overlap. A restatement scores high
# because it reuses the Purpose's own vocabulary; a hook shares little.
_PURPOSE_OVERLAP_THRESHOLD = 0.6

# An intro sentence that announces the content instead of telling a reader when
# the file is worth opening: "The rules below cover ...", "This reference explains ...".
_INTRO_POINTER = re.compile(
    r'^(?:the\s+(?:sections?|examples?|tables?|steps?|rules?)\s+below\b'
    r'|this\s+(?:reference|asset|document|file|guide|page)\s+'
    r'(?:explains|covers|describes|documents|lists|shows|contains|outlines)\b)',
    re.IGNORECASE,
)

_FRONTMATTER_DESCRIPTION = re.compile(r'^description:\s*(.*?)\s*$')

# A cross-reference to a numbered section: "§8 EXAMPLES", "Section 4", or an
# optional leading file name such as "loop-state-and-gates.md §3". The title is
# optional because most prose cites the number alone.
# The cited file may be written bare, in a code span or as a markdown link,
# and each form names the same document.
_SECTION_REFERENCE = re.compile(
    r'(?:(?:`(?P<code>[\w./-]+\.md)`|\[[^\]\n]*\]\(<?(?P<link>[^)\s#>]+\.md)>?\)|(?P<file>[\w./-]+\.md))\s+)?'
    r'(?:§\s*|\b[Ss]ection\s+)'
    r'(?P<num>\d+)\b'
    r'(?:\s+(?P<title>[A-Z][A-Z0-9&/-]+(?:\s+[A-Z][A-Z0-9&/-]+)*)(?![a-z]))?'
)
_MD_FILE_NAME = re.compile(r'[\w./-]+\.md')


def _render_warning(check: str, message: str, line_number: int) -> Dict[str, Any]:
    """Build a render finding in the shape the other warnings use."""
    return {
        'type': check,
        'severity': 'warning',
        'message': message,
        'line': line_number,
        'line_number': line_number,
        'auto_fixable': False,
    }


def _frontmatter_line_numbers(lines: List[str]) -> set:
    """1-based line numbers of the YAML frontmatter block, delimiters included.

    Leading blank lines and HTML comments are skipped the way the frontmatter
    reader skips them. A block with no `key:` line is a thematic break and a
    later rule, not frontmatter, so its body lines stay in scope.
    """
    index = 0
    while index < len(lines):
        stripped = lines[index].strip()
        if not stripped or _HTML_COMMENT_LINE.match(lines[index]):
            index += 1
            continue
        break
    if index >= len(lines) or lines[index].strip() != '---':
        return set()
    for close in range(index + 1, len(lines)):
        if lines[close].strip() != '---':
            continue
        block = lines[index + 1:close]
        if not any(re.match(r'^[A-Za-z0-9_.-]+:', line) for line in block):
            return set()
        return set(range(index + 1, close + 2))
    return set()


def _is_list_line(line: str) -> bool:
    return bool(_LIST_LINE.match(line))


def _is_structural_line(line: str) -> bool:
    """Whether a line cannot be part of a prose paragraph."""
    stripped = line.strip()
    if not stripped:
        return True
    if stripped.startswith('#') or stripped.startswith('|') or stripped.startswith('>'):
        return True
    if _HTML_COMMENT_LINE.match(line) or _SEPARATOR_LINE.match(line):
        return True
    if line.startswith('    ') or line.startswith('\t'):
        return True
    return False


def _bold_label(line: str) -> Optional[str]:
    """The text of a line that opens with a `**label**` run, else None."""
    match = re.match(r'^\s*\*\*(.+?)\*\*', line)
    return match.group(1).strip() if match else None


def _label_key(label: str) -> str:
    return re.sub(r'[\s:.,;]+$', '', label).strip().lower()


def _is_placeholder_label(label: str) -> bool:
    return bool(re.fullmatch(
        r'[\[\(\{<]*\s*placeholder\s*[\]\)\}>]*',
        _label_key(label),
        re.IGNORECASE,
    ))


def _render_bold_label_join(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """Two adjacent non-list lines that both open with a bold label join."""
    issues: List[Dict[str, Any]] = []
    for index in range(len(lines) - 1):
        first_number, second_number = index + 1, index + 2
        if first_number in skip or second_number in skip:
            continue
        first, second = lines[index], lines[index + 1]
        if not first.strip() or not second.strip():
            continue
        if _is_list_line(first) or _is_list_line(second):
            continue
        first_label = _bold_label(first)
        second_label = _bold_label(second)
        if first_label is None or second_label is None:
            continue
        if _is_placeholder_label(first_label) or _is_placeholder_label(second_label):
            continue
        # A trailing hard break renders each label on its own line, so they never join.
        if first.endswith('  ') or first.endswith('\\'):
            continue
        issues.append(_render_warning(
            'render_bold_label_join',
            f'Consecutive bold labels "{first_label}" and "{second_label}" join into one paragraph; '
            'separate them or use list items.',
            second_number,
        ))
    return issues


def _render_setext_underline(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """A `---` or `===` line directly under a paragraph line becomes a heading."""
    issues: List[Dict[str, Any]] = []
    for index in range(1, len(lines)):
        line_number = index + 1
        if line_number in skip:
            continue
        if not _SETEXT_UNDERLINE.match(lines[index]):
            continue
        above_number = index
        if above_number in skip:
            continue
        above = lines[index - 1]
        if _is_list_line(above) or _is_structural_line(above):
            continue
        issues.append(_render_warning(
            'render_setext_underline',
            'A setext underline follows a paragraph line; add a blank line above the divider.',
            line_number,
        ))
    return issues


def _render_bare_url(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """A URL outside code, a link target and an autolink renders as raw text."""
    issues: List[Dict[str, Any]] = []
    for index, line in enumerate(lines):
        line_number = index + 1
        if line_number in skip or _LINK_DEFINITION.match(line):
            continue
        masked = _INLINE_CODE.sub(' ', line)
        masked = _INLINE_IMAGE.sub('image', masked)
        masked = _INLINE_LINK.sub(' ', masked)
        masked = _ANGLE_TAG.sub(' ', masked)
        if _BARE_URL.search(masked):
            issues.append(_render_warning(
                'render_bare_url',
                'Bare URL outside a link target; wrap it as [title](url).',
                line_number,
            ))
    return issues


def _first_numbered_h2(lines: List[str], skip: set) -> Optional[Tuple[int, Any]]:
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = _H2_NUMBERED.match(line)
        if match:
            return index + 1, match
    return None


def _render_overview_heading(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """The first numbered H2 names OVERVIEW and continues with another topic."""
    first = _first_numbered_h2(lines, skip)
    if first is None:
        return []
    line_number, match = first
    words = extract_section_name_text(match.group(3)).split()
    if len(words) > 1 and words[0].upper() == 'OVERVIEW':
        issues = [_render_warning(
            'render_overview_heading',
            f'The first H2 compounds OVERVIEW with "{" ".join(words[1:])}"; name it OVERVIEW '
            'and move the topic into a subsection.',
            line_number,
        )]
        return issues
    return []


def _render_overview_orientation(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """The first block under OVERVIEW is a fence, a table or a rule-id H3."""
    first = _first_numbered_h2(lines, skip)
    if first is None:
        return []
    line_number, match = first
    words = extract_section_name_text(match.group(3)).split()
    if not words or words[0].upper() != 'OVERVIEW':
        return []
    for index in range(line_number, len(lines)):
        stripped = lines[index].strip()
        if not stripped or _HTML_COMMENT_LINE.match(lines[index]):
            continue
        if re.fullmatch(r'-{3,}', stripped):
            continue
        if re.match(r'^#{1,2}\s', stripped):
            break
        if stripped.startswith('```') or stripped.startswith('~~~'):
            kind = 'a fenced block'
        elif stripped.startswith('|'):
            kind = 'a table'
        elif _RULE_ID_H3.match(stripped):
            kind = 'a rule-id subsection'
        else:
            break
        return [_render_warning(
            'render_overview_orientation',
            f'The OVERVIEW opens with {kind} instead of orienting prose; add Purpose or When to Use first.',
            index + 1,
        )]
    return []


def _overview_subsection_title(name: str) -> str:
    """A rule name as a heading title: "when_to_use" becomes "When to Use"."""
    words = name.replace('_', ' ').split()
    return ' '.join(
        word.lower() if word.lower() == 'to' else word.capitalize()
        for word in words
    )


def _render_overview_subsections(
    lines: List[str],
    skip: set,
    doc_type_rules: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """OVERVIEW opens with the document type's subsections in the listed order."""
    required = [
        normalize_section_name(name)
        for name in doc_type_rules.get('overviewSubsections') or []
    ]
    if not required:
        return []
    first = _first_numbered_h2(lines, skip)
    if first is None:
        return []
    line_number, match = first
    words = extract_section_name_text(match.group(3)).split()
    if not words or words[0].upper() != 'OVERVIEW':
        return []

    present: List[str] = []
    for index in range(line_number, len(lines)):
        if index + 1 in skip:
            continue
        stripped = lines[index].strip()
        if _H2_ANY.match(stripped):
            break
        heading = _H3_ANY.match(stripped)
        if heading:
            present.append(
                normalize_section_name(extract_section_name_text(heading.group(1)))
            )

    issues: List[Dict[str, Any]] = []
    opening = ' then '.join(_overview_subsection_title(name) for name in required)
    for name in required:
        if name in present:
            continue
        title = _overview_subsection_title(name)
        issues.append(_render_warning(
            'render_overview_subsections',
            f'OVERVIEW has no "### {title}" subsection; open it with {opening}.',
            line_number,
        ))
    if issues:
        return issues

    positions = [present.index(name) for name in required]
    if any(later < earlier for earlier, later in zip(positions, positions[1:])):
        ordered = ' before '.join(_overview_subsection_title(name) for name in required)
        issues.append(_render_warning(
            'render_overview_subsections',
            f'OVERVIEW subsections run out of order; put {ordered}.',
            line_number,
        ))
    elif present[:len(required)] != required:
        # The orienting subsections only orient when a reader meets them first.
        first = _overview_subsection_title(present[0])
        issues.append(_render_warning(
            'render_overview_subsections',
            f'OVERVIEW opens with "### {first}"; open it with {opening}.',
            line_number,
        ))
    return issues


def _prose_blocks(lines: List[str], skip: set) -> List[Tuple[int, str]]:
    """Prose paragraphs and list items as (start line, joined text)."""
    blocks: List[Tuple[int, str]] = []
    paragraph: List[str] = []
    start = 0

    def flush() -> None:
        nonlocal paragraph
        if paragraph:
            blocks.append((start, ' '.join(paragraph)))
            paragraph = []

    for index, line in enumerate(lines):
        line_number = index + 1
        stripped = line.strip()
        if line_number in skip or not stripped or _is_structural_line(line):
            flush()
            continue
        if _is_list_line(line):
            flush()
            blocks.append((line_number, stripped))
            continue
        if not paragraph:
            start = line_number
        paragraph.append(stripped)
    flush()
    return blocks


def _sentence_key(text: str) -> str:
    return ' '.join(text.split()).lower()


def _render_repeated_sentence(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """A pair of adjacent sentences repeats inside one paragraph or list item."""
    issues: List[Dict[str, Any]] = []
    for line_number, text in _prose_blocks(lines, skip):
        sentences = [part for part in _SENTENCE_BREAK.split(text) if part.strip()]
        seen = set()
        for index in range(len(sentences) - 1):
            pair = (_sentence_key(sentences[index]), _sentence_key(sentences[index + 1]))
            if pair in seen:
                issues.append(_render_warning(
                    'render_repeated_sentence',
                    'A sentence pair repeats in this paragraph or item; remove the duplicate.',
                    line_number,
                ))
                break
            seen.add(pair)
    return issues


def _render_repeated_label(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """The same bold label opens two adjacent non-list paragraphs."""
    issues: List[Dict[str, Any]] = []
    for index in range(len(lines) - 1):
        first_number, second_number = index + 1, index + 2
        if first_number in skip or second_number in skip:
            continue
        first, second = lines[index], lines[index + 1]
        if not first.strip() or not second.strip():
            continue
        if _is_list_line(first) or _is_list_line(second):
            continue
        first_label = _bold_label(first)
        second_label = _bold_label(second)
        if first_label is None or second_label is None:
            continue
        if _is_placeholder_label(first_label) or _is_placeholder_label(second_label):
            continue
        if _label_key(first_label) != _label_key(second_label):
            continue
        issues.append(_render_warning(
            'render_repeated_label',
            f'The bold label "{first_label}" opens two adjacent paragraphs; use one label per field.',
            second_number,
        ))
    return issues


def _render_h2_numbering(lines: List[str], skip: set, doc_type: str) -> List[Dict[str, Any]]:
    """A letter-suffixed, sub-numbered or unnumbered H2 among numbered ones."""
    if doc_type not in ('reference', 'asset', 'skill'):
        return []
    headings: List[Tuple[int, str]] = []
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = _H2_ANY.match(line)
        if match:
            headings.append((index + 1, match.group(1)))
    has_numbered = any(_H2_NUMBERED.match('## ' + title) for _, title in headings)
    issues: List[Dict[str, Any]] = []
    for line_number, title in headings:
        match = _H2_NUMBERED.match('## ' + title)
        if match and match.group(2):
            issues.append(_render_warning(
                'render_h2_numbering',
                f'H2 number carries a letter suffix ("{match.group(1)}{match.group(2)}."); use integers only.',
                line_number,
            ))
        elif re.match(r'^(\d+)\.(\d+)\.?\s+\S', title):
            # A dotted number is a sub-number: it names a child of the section
            # above it, and a level-one heading carries only the integer.
            issues.append(_render_warning(
                'render_h2_numbering',
                f'H2 "{title}" carries a sub-number; use an integer H2 or make it an H3.',
                line_number,
            ))
        elif not match and has_numbered:
            issues.append(_render_warning(
                'render_h2_numbering',
                f'Unnumbered H2 "{title}" among numbered peers; number every section.',
                line_number,
            ))
    return issues


def _render_h2_sequence(lines: List[str], skip: set, doc_type: str) -> List[Dict[str, Any]]:
    """A numbered H2 whose number is not the previous number plus one.

    A gap or a repeat leaves the reader without a position in the document and
    breaks the number-to-order promise the sections make, so the sequence starts
    at 1 and every numbered H2 has to continue it.
    """
    if doc_type not in ('reference', 'asset', 'skill'):
        return []
    issues: List[Dict[str, Any]] = []
    previous = 0
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = _H2_NUMBERED.match(line)
        # A letter-suffixed number is already reported by the numbering check.
        if not match or match.group(2):
            continue
        number = int(match.group(1))
        if number != previous + 1:
            message = (
                f'H2 number {number} follows {previous}; number sections 1, 2, 3 without gaps or repeats.'
                if previous else
                f'The first numbered H2 is {number}; number sections from 1.'
            )
            issues.append(_render_warning('render_h2_sequence', message, index + 1))
        previous = number
    return issues


def _heading_name(title: str) -> str:
    """Section text with any number prefix and emoji removed."""
    name = re.sub(r'^\d+[A-Za-z]?\.\s*', '', title)
    return EMOJI_PATTERN.sub('', name).strip()


def _is_related_section(name: str) -> bool:
    """A heading that opens with the word `related` and names no topic of its own.

    RELATED RESOURCES, RELATED COMMANDS and RELATED WORK list pointers, so they
    close the document. UNRELATED CHANGES and CORRELATED SIGNALS only contain the
    letters, and RELATED SPECS: UPDATE VS CREATE carries a topic after its colon,
    so none of them is the closing related section.
    """
    if ':' in name:
        return False
    tokens = [token for token in normalize_section_name(name).split('_') if token]
    return bool(tokens) and tokens[0] == 'related'


def _render_section_order(
    lines: List[str],
    skip: set,
    doc_type: str,
    doc_type_rules: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Declared first and last sections sit where the rules say they do."""
    first_section = doc_type_rules.get('firstSectionName')
    last_pattern = doc_type_rules.get('lastSectionPattern')
    headings: List[Tuple[int, str]] = []
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = _H2_ANY.match(line)
        if match:
            headings.append((index + 1, _heading_name(match.group(1))))
    if not headings:
        return []

    issues: List[Dict[str, Any]] = []
    if first_section:
        wanted = normalize_section_name(first_section)
        if not normalize_section_name(headings[0][1]).startswith(wanted):
            issues.append(_render_warning(
                'render_section_order',
                f'The first H2 should be "{first_section}"; found "{headings[0][1]}".',
                headings[0][0],
            ))

    if last_pattern:
        wanted = normalize_section_name(last_pattern)
        related_only = wanted == 'related'
        for position, (line_number, name) in enumerate(headings):
            matched = (
                _is_related_section(name) if related_only
                else wanted in normalize_section_name(name)
            )
            if not matched:
                continue
            trailing = headings[position + 1:]
            if not trailing:
                continue
            if len(trailing) == 1 and 'machine_router' in normalize_section_name(trailing[0][1]):
                continue
            issues.append(_render_warning(
                'render_section_order',
                f'"{name}" must be the last H2; it is followed by "{trailing[0][1]}".',
                line_number,
            ))

    if doc_type == 'skill_router':
        for position, (line_number, name) in enumerate(headings):
            if not _is_related_section(name):
                continue
            following = headings[position + 1:]
            if following and 'machine_router' in normalize_section_name(following[0][1]):
                continue
            issues.append(_render_warning(
                'render_section_order',
                'A related section in a skill router sits directly before MACHINE ROUTER.',
                line_number,
            ))
    return issues


def _intro_paragraph(lines: List[str], skip: set) -> Optional[Tuple[int, str]]:
    """The first prose paragraph after the H1."""
    start = None
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        if re.match(r'^#\s+\S', line):
            start = index + 1
            break
    if start is None:
        return None
    first_line = 0
    paragraph: List[str] = []
    for index in range(start, len(lines)):
        line_number = index + 1
        line = lines[index]
        stripped = line.strip()
        if line_number in skip or _HTML_COMMENT_LINE.match(line):
            if paragraph:
                break
            continue
        if not stripped or re.fullmatch(r'-{3,}', stripped):
            if paragraph:
                break
            continue
        if re.match(r'^#{1,6}\s', stripped) or _is_list_line(line) or _is_structural_line(line):
            break
        if not paragraph:
            first_line = line_number
        paragraph.append(stripped)
    if not paragraph:
        return None
    return first_line, ' '.join(paragraph)


def _first_sentence(text: str) -> str:
    parts = [part.strip() for part in _SENTENCE_BREAK.split(text) if part.strip()]
    return parts[0] if parts else ''


def _first_purpose_sentence(lines: List[str], skip: set) -> Optional[str]:
    """The first sentence under a Purpose heading, at H2 or H3 level."""
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = re.match(r'^#{2,3}\s+(.+?)\s*$', line)
        if not match:
            continue
        if 'purpose' not in normalize_section_name(_heading_name(match.group(1))):
            continue
        paragraph: List[str] = []
        for inner in range(index + 1, len(lines)):
            inner_number = inner + 1
            if inner_number in skip or _HTML_COMMENT_LINE.match(lines[inner]):
                if paragraph:
                    break
                continue
            stripped = lines[inner].strip()
            if not stripped or re.fullmatch(r'-{3,}', stripped):
                if paragraph:
                    break
                continue
            if re.match(r'^#{1,6}\s', stripped):
                break
            if _is_list_line(lines[inner]):
                if paragraph:
                    break
                return _first_sentence(_LIST_LINE.sub('', stripped))
            if _is_structural_line(lines[inner]):
                break
            paragraph.append(stripped)
        if paragraph:
            return _first_sentence(' '.join(paragraph))
    return None


def _token_overlap(first: str, second: str) -> float:
    """How much of the longer token run the two texts share, in order.

    A paraphrase that keeps the same vocabulary and sentence shape scores near
    one; a hook that names a different reader benefit scores low. Word order
    counts, so a restatement with one substituted word stays high while an
    unrelated sentence with the same domain nouns does not.
    """
    first_tokens = _WORD.findall(first.lower())
    second_tokens = _WORD.findall(second.lower())
    if not first_tokens or not second_tokens:
        return 0.0
    previous = list(range(len(second_tokens) + 1))
    for row, token in enumerate(first_tokens, start=1):
        current = [row]
        for column, other in enumerate(second_tokens, start=1):
            current.append(min(
                previous[column] + 1,
                current[column - 1] + 1,
                previous[column - 1] + (token != other),
            ))
        previous = current
    return 1.0 - previous[-1] / max(len(first_tokens), len(second_tokens))


def _render_intro_restates_purpose(lines: List[str], skip: set) -> List[Dict[str, Any]]:
    """The intro and the first Purpose sentence share most of their vocabulary."""
    intro = _intro_paragraph(lines, skip)
    if intro is None:
        return []
    purpose = _first_purpose_sentence(lines, skip)
    if not purpose:
        return []
    overlap = _token_overlap(intro[1], purpose)
    if overlap < _PURPOSE_OVERLAP_THRESHOLD:
        return []
    return [_render_warning(
        'render_intro_restates_purpose',
        f'The intro repeats the Purpose ({overlap:.2f} token overlap); make the intro a hook.',
        intro[0],
    )]


# Only the types that open with a hook: a reference or an asset earns a reader
# by saying when to open it, while a skill hub opens with its router.
_INTRO_CHECK_TYPES = ('reference', 'asset')


def _h1_line(lines: List[str], skip: set) -> Optional[int]:
    """1-based line number of the document's H1, when it carries one."""
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        if re.match(r'^#\s+\S', line):
            return index + 1
    return None


def _intro_sentences(text: str) -> List[str]:
    """The sentences of a paragraph, in order."""
    return [part.strip() for part in _SENTENCE_BREAK.split(text) if part.strip()]


def _frontmatter_description(lines: List[str]) -> Optional[str]:
    """The frontmatter `description` value, when the leading block carries one."""
    index = 0
    while index < len(lines) and not lines[index].strip():
        index += 1
    if index >= len(lines) or lines[index].strip() != '---':
        return None
    for line in lines[index + 1:]:
        if line.strip() == '---':
            break
        match = _FRONTMATTER_DESCRIPTION.match(line)
        if match:
            return _strip_matching_quotes(match.group(1))
    return None


def _render_intro_missing(lines: List[str], skip: set, doc_type: str) -> List[Dict[str, Any]]:
    """The H1 jumps straight into a section, leaving no hook for a skimming reader."""
    if doc_type not in _INTRO_CHECK_TYPES:
        return []
    heading = _h1_line(lines, skip)
    if heading is None:
        return []
    # Only a heading straight after the H1 leaves nothing to read; a callout,
    # list, table or fenced block there is an intro in another shape. Frontmatter
    # sits above the H1, so a skipped line below it is a fence.
    for index in range(heading, len(lines)):
        stripped = lines[index].strip()
        if index + 1 in skip:
            return []
        if not stripped or _HTML_COMMENT_LINE.match(lines[index]):
            continue
        if re.fullmatch(r'-{3,}', stripped):
            continue
        if not re.match(r'^#{2,6}\s', stripped):
            return []
        break
    return [_render_warning(
        'render_intro_missing',
        'No intro paragraph sits between the H1 and the first section; '
        'add a one- or two-sentence hook.',
        heading,
    )]


def _render_intro_pointer(lines: List[str], skip: set, doc_type: str) -> List[Dict[str, Any]]:
    """An intro sentence announces the content below instead of a moment to open it."""
    if doc_type not in _INTRO_CHECK_TYPES:
        return []
    intro = _intro_paragraph(lines, skip)
    if intro is None:
        return []
    issues: List[Dict[str, Any]] = []
    for sentence in _intro_sentences(intro[1]):
        if not _INTRO_POINTER.match(sentence):
            continue
        issues.append(_render_warning(
            'render_intro_pointer',
            f'The intro sentence "{sentence[:60]}" points at the content instead of '
            'saying when to open the file; rewrite it as a hook.',
            intro[0],
        ))
    return issues


def _render_intro_sentence_restates(
    lines: List[str],
    skip: set,
    doc_type: str,
) -> List[Dict[str, Any]]:
    """An intro sentence reuses the vocabulary of the Purpose or the description."""
    if doc_type not in _INTRO_CHECK_TYPES:
        return []
    intro = _intro_paragraph(lines, skip)
    if intro is None:
        return []
    sources: List[Tuple[str, str]] = []
    purpose = _first_purpose_sentence(lines, skip)
    if purpose:
        sources.append(('Purpose', purpose))
    description = _frontmatter_description(lines)
    if description:
        sources.append(('description', description))
    issues: List[Dict[str, Any]] = []
    for sentence in _intro_sentences(intro[1]):
        # A few-word fragment cannot restate anything, so it never warns.
        if len(_WORD.findall(sentence)) < 5:
            continue
        source_name = ''
        best = 0.0
        for name, text in sources:
            overlap = _token_overlap(sentence, text)
            if overlap > best:
                source_name, best = name, overlap
        if best < _PURPOSE_OVERLAP_THRESHOLD:
            continue
        issues.append(_render_warning(
            'render_intro_sentence_restates',
            f'The intro sentence "{sentence[:60]}" repeats the {source_name} '
            f'({best:.2f} overlap); say what the reader gets instead.',
            intro[0],
        ))
    return issues


def _numbered_section_titles(lines: List[str], skip: set) -> Dict[str, str]:
    """Numbered H2 titles keyed by number, emoji removed and uppercased."""
    titles: Dict[str, str] = {}
    for index, line in enumerate(lines):
        if index + 1 in skip:
            continue
        match = _H2_NUMBERED.match(line)
        if match:
            titles.setdefault(
                match.group(1),
                extract_section_name_text(match.group(3)).upper(),
            )
    return titles


def _checkout_root(path: Path) -> Optional[Path]:
    """The nearest ancestor of `path` holding a `.skilled` directory."""
    for parent in path.parents:
        if (parent / '.skilled').is_dir():
            return parent
    return None


def _resolve_reference_target(
    name: str,
    file_path: Optional[Path],
) -> Optional[Path]:
    """The cited file, looked up beside the current one and then at the checkout root."""
    if file_path is None:
        return None
    bases = [file_path.parent]
    root = _checkout_root(file_path)
    if root is not None:
        bases.append(root)
    for base in bases:
        candidate = base / name
        if candidate.is_file():
            return candidate
    return None


def _render_section_reference(
    lines: List[str],
    skip: set,
    file_path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """A cited section number exists in the cited document and keeps its name.

    Prose points at sections by number, so a renumbered or renamed section leaves
    a citation that resolves to nothing or to the wrong title. Without the source
    path there is no document to look a number up in, so the check stays quiet.
    """
    if file_path is None:
        return []
    own_titles = _numbered_section_titles(lines, skip)
    target_titles: Dict[str, Optional[Dict[str, str]]] = {}
    issues: List[Dict[str, Any]] = []
    for index, line in enumerate(lines):
        line_number = index + 1
        if line_number in skip:
            continue
        for match in _SECTION_REFERENCE.finditer(line):
            number = match.group('num')
            cited_title = match.group('title')
            name = match.group('file') or match.group('code') or match.group('link')
            if name:
                if name not in target_titles:
                    target = _resolve_reference_target(name, file_path)
                    titles: Optional[Dict[str, str]] = None
                    if target is not None:
                        try:
                            text = target.read_text(encoding='utf-8')
                        except OSError:
                            pass
                        else:
                            titles = _numbered_section_titles(
                                text.splitlines(),
                                _fenced_line_numbers(text),
                            )
                    target_titles[name] = titles
                titles = target_titles[name]
                if titles is None:
                    continue
                target_name = Path(name).name
            else:
                if not own_titles:
                    continue
                # A line that also names another file usually cites that file's
                # section, so its bare number says nothing about this document.
                if _MD_FILE_NAME.search(line):
                    continue
                titles = own_titles
                target_name = 'this file'
            actual = titles.get(number)
            # A capitalised word after a bare number is often prose, so a cited
            # title only counts when it names a real section of the target.
            names_a_section = bool(cited_title) and any(
                title.startswith(cited_title) for title in titles.values()
            )
            if actual is None:
                # A bare number in prose often cites a document named earlier in
                # the paragraph, so only a named file or a real title proves it.
                if name or names_a_section:
                    issues.append(_render_warning(
                        'render_section_reference',
                        f'"{match.group(0).strip()}" points at section {number}, but '
                        f'{target_name} has no section {number}.',
                        line_number,
                    ))
                continue
            if names_a_section and not actual.startswith(cited_title):
                issues.append(_render_warning(
                    'render_section_reference',
                    f'"{match.group(0).strip()}" names {cited_title}, but section '
                    f'{number} of {target_name} is {actual}.',
                    line_number,
                ))
    return issues


def validate_render_checks(
    content: str,
    doc_type: str,
    doc_type_rules: Dict[str, Any],
    file_path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """Run the rendered-shape checks for document types that opt in.

    The section-citation check runs for every type: a cited section number that
    no longer exists misleads the reader of a playbook or a catalog as much as
    one of a reference, while the shape checks encode the templates of the
    types that opt in. A type that records past state, such as a changelog,
    sets ``sectionReferenceChecks`` to false so its citations stay as written.
    """
    lines = content.splitlines()
    fenced = _fenced_line_numbers(content)
    skip = fenced | _frontmatter_line_numbers(lines)
    if not doc_type_rules.get('renderChecks', False):
        if not doc_type_rules.get('sectionReferenceChecks', True):
            return []
        return _render_section_reference(lines, skip, file_path)
    issues: List[Dict[str, Any]] = []
    issues.extend(_render_bold_label_join(lines, skip))
    issues.extend(_render_setext_underline(lines, skip))
    issues.extend(_render_bare_url(lines, skip))
    issues.extend(_render_overview_heading(lines, skip))
    issues.extend(_render_overview_orientation(lines, skip))
    issues.extend(_render_overview_subsections(lines, skip, doc_type_rules))
    issues.extend(_render_repeated_sentence(lines, skip))
    issues.extend(_render_repeated_label(lines, skip))
    issues.extend(_render_h2_numbering(lines, skip, doc_type))
    issues.extend(_render_h2_sequence(lines, skip, doc_type))
    issues.extend(_render_section_order(lines, skip, doc_type, doc_type_rules))
    issues.extend(_render_intro_restates_purpose(lines, skip))
    issues.extend(_render_intro_missing(lines, skip, doc_type))
    issues.extend(_render_intro_pointer(lines, skip, doc_type))
    issues.extend(_render_intro_sentence_restates(lines, skip, doc_type))
    issues.extend(_render_section_reference(lines, skip, file_path))
    return issues


def validate_h2_headers(content: str, doc_type_rules: Dict[str, Any], rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate H2 header format and emojis."""
    errors = []

    h2_pattern = re.compile(r'^## (\d+)\.\s+(.+)$', re.MULTILINE)
    matches = list(h2_pattern.finditer(content))
    fenced_lines = _fenced_line_numbers(content)

    if not matches:
        # No numbered H2 headers found - check if this is expected
        # Some documents might use different header styles
        return errors

    # A document may open on a deliberate section 0, such as a contract that
    # must be read before section 1, so the sequence starts at the first
    # number when that number is 0. Every later step must still add one.
    outer = [m for m in matches if content.count('\n', 0, m.start()) + 1 not in fenced_lines]
    expected_num = 0 if outer and int(outer[0].group(1)) == 0 else 1
    emoji_required = doc_type_rules.get('h2EmojiRequired', True)
    section_emojis = doc_type_rules.get('sectionEmojis', {})
    section_aliases = doc_type_rules.get('sectionAliases', {})

    for match in matches:
        num = int(match.group(1))
        title = match.group(2).strip()
        line = match.group(0)

        # A numbered header inside a fenced example (a copy-able skeleton) is
        # content, not a section, so it must not break or advance the outer
        # document sequence. Emoji/uppercase checks below intentionally still
        # apply to every match, keeping their behavior unchanged.
        header_line = content.count('\n', 0, match.start()) + 1
        if header_line not in fenced_lines:
            if num != expected_num:
                errors.append({
                    'type': 'non_sequential_numbering',
                    'severity': 'warning',
                    'message': f'Non-sequential section number: expected {expected_num}, found {num}',
                    'line': line
                })
            expected_num = num + 1

        if emoji_required:
            title_has_emoji = has_emoji(title)

            if not title_has_emoji:
                section_name = normalize_section_name(title)

                if section_name in section_aliases:
                    section_name = section_aliases[section_name]

                expected_emoji = section_emojis.get(section_name)

                # Fallback: match ignoring underscores for flexibility
                if not expected_emoji:
                    section_name_no_underscore = section_name.replace('_', '')
                    for key, emoji in section_emojis.items():
                        if key.replace('_', '') == section_name_no_underscore:
                            expected_emoji = emoji
                            break

                errors.append({
                    'type': 'missing_h2_emoji',
                    'severity': 'blocking',
                    'message': f'H2 header missing emoji: "{line}"',
                    'line': line,
                    'section_name': section_name,
                    'expected_emoji': expected_emoji,
                    'auto_fixable': expected_emoji is not None,
                    'fix': f'## {num}. {expected_emoji} {title}' if expected_emoji else None,
                    'fix_hint': f'Add {expected_emoji} after "{num}."' if expected_emoji else 'Add appropriate emoji after section number'
                })

        # Check for ALL CAPS (only for document types that require it)
        uppercase_required = doc_type_rules.get('h2UppercaseRequired', False)
        if uppercase_required and not is_uppercase_section(title):
            section_text = extract_section_name_text(title)
            # Extract emoji if present
            emoji = extract_first_emoji(title)

            if emoji:
                # Has emoji: "EMOJI name" -> "EMOJI NAME"
                title_after_emoji = EMOJI_PATTERN.sub('', title).strip()
                fixed_title = f'{emoji} {title_after_emoji.upper()}'
            else:
                # No emoji: just uppercase
                fixed_title = title.upper()

            errors.append({
                'type': 'h2_not_uppercase',
                'severity': 'blocking',
                'message': f'H2 header not ALL CAPS: "{line}"',
                'line': line,
                'auto_fixable': True,
                'fix': f'## {num}. {fixed_title}',
                'fix_hint': f'Change "{section_text}" to "{section_text.upper()}"'
            })

    return errors


# ───────────────────────────────────────────────────────────────
# 5. SECTION VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_required_sections(content: str, doc_type_rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check that required sections are present."""
    errors = []

    required = doc_type_rules.get('requiredSections', [])
    section_aliases = doc_type_rules.get('sectionAliases', {})

    # Compiled-contract commands are thin runtime dispatchers whose section content is
    # rendered from a compiled source at invocation, not written in the .md file, so
    # there is no prose section shape to require here.
    contract_marker = doc_type_rules.get('compiledContractMarker')
    if contract_marker and contract_marker in content:
        return errors

    # Build reverse alias map
    reverse_aliases = {}
    for alias, canonical in section_aliases.items():
        reverse_aliases.setdefault(canonical, []).append(alias)

    h2_pattern = re.compile(r'^## \d+\.\s+[^\n]+', re.MULTILINE)
    headers = h2_pattern.findall(content)

    # Keep both normalized and raw names for partial matching fallback
    found_sections = set()
    found_sections_raw = []
    for header in headers:
        match = re.search(r'^## \d+\.\s+(?:[^\w\s]\s+)?(.+)$', header)
        if match:
            raw_name = match.group(1).strip().lower()
            section_name = normalize_section_name(raw_name)
            found_sections.add(section_name)
            found_sections_raw.append(raw_name)

            if section_name in section_aliases:
                found_sections.add(section_aliases[section_name])

    # A router command is a thin dispatcher (verify agent -> resolve mode/args -> hand
    # off to owned presentation/workflow assets). It carries a router-specific section
    # vocabulary instead of the general purpose/instructions sections, so detect that
    # shape and require only the minimal router core, treating the rest as recommended.
    # A section counts as present if its canonical name is a found header OR a known
    # space-form alias of it normalizes (space->underscore) to a found header.
    def section_present(canonical: str) -> bool:
        if canonical in found_sections:
            return True
        for alias in reverse_aliases.get(canonical, []):
            if alias.replace(' ', '_') in found_sections:
                return True
        return False

    detect_primary = doc_type_rules.get('routerDetectPrimary', [])
    structural = doc_type_rules.get('routerStructuralSections', [])
    is_router = (
        any(section_present(sig) for sig in detect_primary)
        or sum(1 for sig in structural if section_present(sig)) >= 2
    )
    if is_router:
        required = doc_type_rules.get('routerRequiredSections', required)

    # A surface packet is a read-only evidence base a parent hub bundles beside a
    # workflow mode, not a workflow of its own, so it carries no WHEN TO USE, SMART
    # ROUTING or HOW IT WORKS. Its opening section says when the hub bundles it, which
    # marks the shape, and the packet is held to its evidence core instead.
    if any(section_present(sig) for sig in doc_type_rules.get('surfaceDetectPrimary', [])):
        required = doc_type_rules.get('surfaceRequiredSections', required)

    for req_section in required:
        found = req_section in found_sections

        if not found:
            aliases = reverse_aliases.get(req_section, [])
            for alias in aliases:
                if alias.replace(' ', '_') in found_sections:
                    found = True
                    break

        # Fuzzy match: accept if all required words appear in section name
        if not found:
            req_words = req_section.replace('_', ' ').split()
            for raw_section in found_sections_raw:
                if all(word in raw_section for word in req_words):
                    found = True
                    break

        if not found:
            errors.append({
                'type': 'missing_required_section',
                'severity': 'blocking',
                'message': f'Missing required section: {req_section}',
                'fix_hint': f'Add section with name containing "{req_section}"'
            })

    # Router shape beyond the minimal core is recommended, not required: surface any
    # missing canonical router section as a non-blocking warning so authors converge on
    # the full vocabulary without failing incremental migrations.
    if is_router:
        for rec_section in doc_type_rules.get('routerRecommendedSections', []):
            if not section_present(rec_section):
                errors.append({
                    'type': 'missing_recommended_router_section',
                    'severity': 'warning',
                    'message': f'Missing recommended router section: {rec_section}',
                    'fix_hint': f'Add a "{rec_section}" section (recommended for router commands)'
                })

    return errors


# ───────────────────────────────────────────────────────────────
# 6. AUTO-FIX
# ───────────────────────────────────────────────────────────────

def apply_fixes(content: str, errors: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Apply auto-fixes to content.

    Uses iterative approach: after each fix, re-validates and applies more fixes
    until no more fixes can be applied. This handles cases where multiple fixes
    affect the same line (e.g., single-dash anchor AND missing emoji).
    """
    fixed_content = content
    all_fixes_applied = []
    max_iterations = 10  # Safety limit

    for iteration in range(max_iterations):
        fixes_this_round = []

        for error in errors:
            if not error.get('auto_fixable'):
                continue

            fix = error.get('fix')
            original = error.get('line')

            if fix and original and original in fixed_content:
                fixed_content = fixed_content.replace(original, fix, 1)
                fixes_this_round.append({
                    'type': error['type'],
                    'original': original,
                    'fixed': fix
                })

        if not fixes_this_round:
            # No more fixes could be applied
            break

        all_fixes_applied.extend(fixes_this_round)

        # Re-validate to get updated error list with new line content
        # This allows subsequent fixes to find the modified lines
        # Re-run validation on the fixed content to get fresh errors
        script_dir = Path(__file__).resolve().parent
        rules = load_template_rules(script_dir)

        # Detect doc type from original errors or default to readme
        doc_type = 'readme'
        for e in errors:
            if 'skill' in str(e.get('line', '')).lower():
                doc_type = 'skill'
                break

        # Get fresh errors based on current fixed content
        doc_type_rules = rules.get('documentTypes', {}).get(doc_type, {})
        errors = []
        errors.extend(validate_toc(fixed_content, doc_type_rules, rules))
        errors.extend(validate_h2_headers(fixed_content, doc_type_rules, rules))

    return fixed_content, all_fixes_applied


# ───────────────────────────────────────────────────────────────
# 7. CODE-FOLDER VALIDATION
# ───────────────────────────────────────────────────────────────

_CODE_FOLDER_LINK_RE = re.compile(r'\[[^\]]+\]\(([^)]+)\)')
_CODE_FOLDER_INLINE_RE = re.compile(r'`([^`]+)`')
_CODE_FOLDER_PATH_EXTENSIONS = {
    '.cjs', '.css', '.html', '.js', '.json', '.md', '.mjs', '.py', '.sh',
    '.sql', '.toml', '.ts', '.tsx', '.txt', '.yaml', '.yml',
}
_CODE_FOLDER_TREE_GLYPHS = ('├', '└', '│', '──', '+--', '`--', '|--')


def _code_folder_fence_lines(content: str) -> Tuple[set, List[Dict[str, Any]]]:
    """Return fenced lines and errors for untagged fenced blocks."""
    fenced: set = set()
    errors: List[Dict[str, Any]] = []
    opening_line: Optional[int] = None
    opening_ticks = 0
    opening_info = ''

    for line_number, line in enumerate(content.splitlines(), start=1):
        match = re.match(r'^\s*(`{3,})(.*)$', line)
        if not match:
            if opening_line is not None:
                fenced.add(line_number)
            continue

        ticks = len(match.group(1))
        info = match.group(2).strip()
        fenced.add(line_number)
        if opening_line is None:
            opening_line = line_number
            opening_ticks = ticks
            opening_info = info
            if not info:
                errors.append({
                    'type': 'code_folder_fence_language',
                    'rule_id': 'code_folder_fence_language',
                    'severity': 'blocking',
                    'message': 'Fenced code block is missing a language tag.',
                    'line': line,
                    'line_number': line_number,
                    'fix_hint': 'Add a language tag after the opening fence.',
                })
        elif ticks >= opening_ticks and not info:
            opening_line = None
            opening_ticks = 0
            opening_info = ''

    if opening_line is not None:
        errors.append({
            'type': 'code_folder_fence_language',
            'rule_id': 'code_folder_fence_language',
            'severity': 'blocking',
            'message': 'Fenced code block is not closed.',
            'line_number': opening_line,
            'fix_hint': 'Close the fenced code block.',
        })

    return fenced, errors


def _code_folder_error(rule_id: str, message: str, line_number: Optional[int] = None) -> Dict[str, Any]:
    error: Dict[str, Any] = {
        'type': rule_id,
        'rule_id': rule_id,
        'severity': 'blocking',
        'message': message,
    }
    if line_number is not None:
        error['line_number'] = line_number
    return error


def _code_folder_has_tree(content: str, fenced: set) -> bool:
    lines = content.splitlines()
    for line_number, line in enumerate(lines, start=1):
        if line_number not in fenced or not any(glyph in line for glyph in _CODE_FOLDER_TREE_GLYPHS):
            continue
        return True
    return False


def _code_folder_has_flat_inventory(content: str, fenced: set, folder: Path) -> bool:
    lines = content.splitlines()
    body = '\n'.join(line for number, line in enumerate(lines, start=1) if number not in fenced)
    has_inventory_heading = bool(re.search(
        r'(?im)^\s*(?:#{1,6}\s+)?(?:\d+\.\s+)?(?:CONTENTS|FILES|KEY FILES)\b',
        body,
    ))
    # The package and structure names are ordinary words in prose, so they
    # count only as a real heading, and the files they list are read from that
    # section alone.
    section_heading = re.compile(r'^\s*#{1,6}\s+(?:\d+\.\s+)?(?:WHAT IS IN THE PACKAGE|STRUCTURE)\b', re.IGNORECASE)
    section_start = next(
        (number for number, line in enumerate(lines, start=1)
         if number not in fenced and section_heading.match(line)),
        None,
    )
    if not has_inventory_heading and section_start is None:
        return False
    if section_start is not None:
        section_end = next(
            (number for number, line in enumerate(lines, start=1)
             if number > section_start and number not in fenced and re.match(r'^##(?!#)\s', line)),
            len(lines) + 1,
        )
        # A fenced structure tree in that section lists files as well as a table does.
        section_lines = [
            line for number, line in enumerate(lines, start=1)
            if section_start < number < section_end and (
                number not in fenced
                or any(glyph in line for glyph in _CODE_FOLDER_TREE_GLYPHS)
            )
        ]
        section_body = '\n'.join(section_lines)
        body = section_body if not has_inventory_heading else body + '\n' + section_body

    expected_files = [
        child.name for child in folder.iterdir()
        if child.is_file() and child.name.lower() != 'readme.md'
    ]
    return all(re.search(rf'(?<![A-Za-z0-9_.-]){re.escape(name)}(?![A-Za-z0-9_.-])', body) for name in expected_files)


def _code_folder_heading_errors(content: str, fenced: set) -> List[Dict[str, Any]]:
    errors: List[Dict[str, Any]] = []
    headings: List[Tuple[int, int, str]] = []
    lines = content.splitlines()
    for line_number, line in enumerate(lines, start=1):
        if line_number in fenced:
            continue
        match = re.match(r'^##(?!#)\s+(.+?)\s*$', line)
        if match:
            headings.append((line_number, line_number, match.group(1)))

    expected_number = 1
    for line_number, _unused, title in headings:
        numbered = re.match(r'^(\d+)\.\s+(.+)$', title)
        if not numbered:
            errors.append(_code_folder_error(
                'code_folder_h2_numbering',
                f'H2 heading is not numbered: "## {title}".',
                line_number,
            ))
            continue

        number = int(numbered.group(1))
        heading_title = numbered.group(2).strip()
        if number != expected_number:
            errors.append(_code_folder_error(
                'code_folder_h2_sequence',
                f'H2 section numbering is not sequential: expected {expected_number}, found {number}.',
                line_number,
            ))
        expected_number = number + 1

        if heading_title != heading_title.upper():
            errors.append(_code_folder_error(
                'code_folder_h2_casing',
                f'H2 heading is not ALL CAPS: "## {title}".',
                line_number,
            ))

        previous = line_number - 1
        while previous > 0 and not lines[previous - 1].strip():
            previous -= 1
        if len(headings) > 1 and line_number != headings[0][0] and (previous == 0 or lines[previous - 1].strip() != '---'):
            errors.append(_code_folder_error(
                'code_folder_h2_separator',
                'Numbered H2 sections must be separated by `---`.',
                line_number,
            ))

    return errors


def _code_folder_reference_candidates(folder: Path, raw: str) -> List[Path]:
    target = raw.strip().strip('<>"\'`')
    target = target.split('#', 1)[0].split('?', 1)[0].rstrip('.,;:)')
    if not target or target.startswith(('#', '/', '~')):
        return []
    if re.match(r'^[A-Za-z][A-Za-z0-9+.-]*:', target):
        return []
    candidate = (folder / target).resolve()
    candidates = [candidate]
    if target.endswith('/') or candidate.is_dir():
        candidates.extend(candidate / index for index in ('README.md', 'index.ts', 'index.js', 'index.py'))
    if not candidate.suffix:
        candidates.extend(Path(f'{candidate}{extension}') for extension in _CODE_FOLDER_PATH_EXTENSIONS)
    return candidates


def _code_folder_reference_errors(content: str, file_path: Path, fenced: set) -> List[Dict[str, Any]]:
    errors: List[Dict[str, Any]] = []
    folder = file_path.parent.resolve()
    for line_number, line in enumerate(content.splitlines(), start=1):
        if line_number in fenced:
            continue
        for raw in _CODE_FOLDER_LINK_RE.findall(line):
            if not raw.strip().startswith(('./', '../')):
                continue
            candidates = _code_folder_reference_candidates(folder, raw)
            if candidates and not any(candidate.exists() for candidate in candidates):
                errors.append(_code_folder_error(
                    'code_folder_relative_link',
                    f'Relative link does not resolve from the README directory: {raw.strip()}.',
                    line_number,
                ))
        for inline in _CODE_FOLDER_INLINE_RE.findall(line):
            for raw in inline.split():
                token = raw.rstrip('.,;:()[]{}<>"\'')
                if not (
                    token.startswith(('./', '../'))
                    or (Path(token).suffix.lower() in _CODE_FOLDER_PATH_EXTENSIONS and '/' in token)
                ):
                    continue
                candidates = _code_folder_reference_candidates(folder, token)
                if candidates and not any(candidate.exists() for candidate in candidates):
                    errors.append(_code_folder_error(
                        'code_folder_inline_path',
                        f'Inline-code path does not resolve from the README directory: {token}.',
                        line_number,
                    ))
    return errors


def _code_folder_durability_errors(content: str, fenced: set) -> List[Dict[str, Any]]:
    patterns = (
        ('code_folder_packet_id', re.compile(r'\b(?:sk-[a-z0-9-]+/)?\d{3}/\d{3}\b', re.IGNORECASE)),
        ('code_folder_phase_id', re.compile(r'\b\d{3}-\d{3}\b')),
        ('code_folder_adr_id', re.compile(r'\bADR[- ]?\d+\b', re.IGNORECASE)),
        ('code_folder_commit_hash', re.compile(r'(?<![A-Za-z0-9])[0-9a-f]{7,40}(?![A-Za-z0-9])', re.IGNORECASE)),
        ('code_folder_specs_path', re.compile(r'(?<![A-Za-z0-9_])\.opencode/specs(?:/|$)', re.IGNORECASE)),
    )
    errors: List[Dict[str, Any]] = []
    for line_number, line in enumerate(content.splitlines(), start=1):
        if line_number in fenced:
            continue
        for rule_id, pattern in patterns:
            if pattern.search(line):
                errors.append(_code_folder_error(
                    rule_id,
                    'Durability rule rejected packet, phase, ADR, commit or mutable spec-path text.',
                    line_number,
                ))
    return errors


def validate_code_folder(content: str, file_path: str) -> List[Dict[str, Any]]:
    """Validate the opt-in code-folder README contract."""
    path = Path(file_path)
    fenced, errors = _code_folder_fence_lines(content)
    lines = content.splitlines()
    outside_body = '\n'.join(line for number, line in enumerate(lines, start=1) if number not in fenced)

    headings = re.findall(r'(?im)^##\s+(.+?)\s*$', outside_body)
    if not any(re.match(r'^\d+\.\s+OVERVIEW\b', heading) for heading in headings):
        errors.append(_code_folder_error('code_folder_required_overview', 'Code-folder README must contain a numbered OVERVIEW section.'))

    errors.extend(_code_folder_heading_errors(content, fenced))

    if re.search(r'(?im)^\s*(?:#+\s+)?TABLE OF CONTENTS\b', outside_body):
        errors.append(_code_folder_error('code_folder_no_toc', 'Code-folder README must not contain a Table of Contents.'))
    if re.search(r'<!--\s*/?ANCHOR\b', outside_body, re.IGNORECASE):
        errors.append(_code_folder_error('code_folder_no_anchor', 'Code-folder README must not contain anchor-comment navigation.'))

    try:
        direct_subdirectories = [child for child in path.parent.iterdir() if child.is_dir()]
    except OSError:
        direct_subdirectories = []
    if direct_subdirectories:
        if not _code_folder_has_tree(content, fenced):
            errors.append(_code_folder_error(
                'code_folder_directory_tree',
                'Folders with subdirectories require a fenced Directory Tree.',
            ))
    elif not _code_folder_has_flat_inventory(content, fenced, path.parent):
        errors.append(_code_folder_error(
            'code_folder_flat_inventory',
            'Flat folders require a complete CONTENTS, FILES, KEY FILES, WHAT IS IN THE PACKAGE or STRUCTURE inventory naming every file.',
        ))

    errors.extend(_code_folder_reference_errors(content, path, fenced))
    errors.extend(_code_folder_durability_errors(content, fenced))
    return errors


# ───────────────────────────────────────────────────────────────
# 8. MAIN VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_feature_catalog_table(content: str, doc_type_rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate a feature-catalog leaf's 'Validation And Tests' table.

    The generic readme path misses two drift classes here: placeholder rows (an em-dash File and Role
    with a filler Type) that pass as 'valid' while documenting no real coverage, and off-taxonomy Type
    values. The per-feature template's Type column is a curated canonical taxonomy (see
    `allowedValidationTypes` below); a value outside it (a bare em-dash, an unrecognized descriptive
    string) hides missing or mislabeled tests. Un-filled template rows (`{TEST_FILE_1}`) are skipped so
    a fresh scaffold does not fail.
    """
    errors: List[Dict[str, Any]] = []
    allowed = set(doc_type_rules.get('allowedValidationTypes', [
        'Automated test', 'Unit', 'Integration', 'Fixture', 'Benchmark', 'Schema',
        'Manual playbook', 'Reference', 'Vitest', 'Node test', 'MCP integration test', 'Test harness',
    ]))
    dash = {'—', '-', '–', ''}
    lines = content.split('\n')
    in_table = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if re.match(r'^\|\s*File\s*\|\s*Type\s*\|\s*Role\s*\|', stripped):
            in_table = True
            continue
        if not in_table:
            continue
        if not stripped.startswith('|'):
            in_table = False
            continue
        if re.match(r'^\|[\s|:\-]+\|$', stripped):  # |---|---|---| separator
            continue
        cells = [c.strip() for c in stripped.strip('|').split('|')]
        if len(cells) < 3:
            continue
        file_cell, type_cell, role_cell = cells[0], cells[1], cells[2]
        if '{' in file_cell or '{' in type_cell:  # un-filled template row
            continue
        if file_cell in dash and role_cell in dash:
            errors.append({
                'type': 'placeholder_validation_row',
                'line': i + 1, 'severity': 'blocking', 'auto_fixable': False,
                'message': (f"Placeholder validation-table row (File and Role are em-dashes, Type "
                            f"'{type_cell}') — replace with a real test file + role, or remove the row."),
            })
        type_bare = type_cell.strip('`').strip()
        # Advisory only: the live corpus still carries near-dupes/typos of the canonical taxonomy
        # (e.g. stray casing or wording variants) predating this taxonomy's adoption. Warn to surface
        # the drift for normalization rather than block catalogs that haven't been swept yet.
        if type_bare and type_bare not in allowed:
            errors.append({
                'type': 'off_taxonomy_validation_type',
                'line': i + 1, 'severity': 'warning', 'auto_fixable': False,
                'message': (f"Off-taxonomy validation Type '{type_bare}' — template canon is "
                            f"{' | '.join(sorted(allowed))} (advisory: taxonomy needs normalization)."),
            })
    return errors


def validate_agent_frontmatter(content: str, file_path: str) -> List[Dict[str, Any]]:
    """Validate an agent file's frontmatter against its runtime-specific schema.

    `.claude/agents/` files must use the `tools:` allow-list — Claude Code enforces only
    `tools:` and silently ignores `permission:`; an absent `tools:` inherits the parent
    session's full, unrestricted tool set (the AGT-02 defect class).
    `.opencode/agents/` files must use the `permission:` object — OpenCode enforces only
    `permission:` and silently ignores `tools:`.
    Runtime is detected from the file's own path (never a global default), matching the
    same path-resolution invariant AGT-01 depends on.
    """
    errors: List[Dict[str, Any]] = []

    path_str = str(file_path).replace('\\', '/')
    is_claude = '/.claude/agents/' in f'/{path_str}' or path_str.startswith('.claude/agents/')
    is_opencode = any(f'/{root}/agents/' in f'/{path_str}' for root in ('.skilled', '.opencode'))

    if not is_claude and not is_opencode:
        # Runtime cannot be determined from the path; skip schema enforcement rather than guess.
        return errors

    if not content.startswith('---'):
        errors.append({
            'type': 'agent_frontmatter_missing',
            'severity': 'blocking',
            'message': 'Agent file has no YAML frontmatter block',
            'fix_hint': 'Add a frontmatter block with name, description, and the runtime-correct schema (tools: or permission:)'
        })
        return errors

    lines = content.split('\n')
    end_idx = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            end_idx = i
            break

    if end_idx is None:
        errors.append({
            'type': 'agent_frontmatter_unclosed',
            'severity': 'blocking',
            'message': 'Agent frontmatter is not closed (missing closing ---)',
            'fix_hint': 'Close the frontmatter block with a trailing ---'
        })
        return errors

    raw = '\n'.join(lines[1:end_idx])

    tools_match = re.search(r'^tools:\s*(.*)$', raw, re.MULTILINE)
    has_tools = bool(tools_match and tools_match.group(1).strip())
    has_permission = bool(re.search(r'^permission:\s*(\{.*\}|\S.*)?\s*$', raw, re.MULTILINE))

    if is_claude:
        if not has_tools:
            errors.append({
                'type': 'agent_schema_missing_tools',
                'severity': 'blocking',
                'message': 'Claude Code agent (.claude/agents/) is missing a non-empty tools: allow-list — an absent or empty tools: inherits the parent session\'s full, unrestricted tool set',
                'fix_hint': 'Add "tools: Read, Write, Edit, ..." mapping the intended least-authority allow-list'
            })
        if has_permission:
            errors.append({
                'type': 'agent_schema_wrong_key_permission',
                'severity': 'warning',
                'message': 'Claude Code agent (.claude/agents/) has a permission: block, which Claude Code silently ignores',
                'fix_hint': 'Remove permission: and express the same intent via tools:'
            })
    elif is_opencode:
        if not has_permission:
            errors.append({
                'type': 'agent_schema_missing_permission',
                'severity': 'blocking',
                'message': 'OpenCode agent (.opencode/agents/) is missing a permission: object',
                'fix_hint': 'Add a permission: object with explicit allow/deny/ask values'
            })
        if has_tools:
            errors.append({
                'type': 'agent_schema_wrong_key_tools',
                'severity': 'warning',
                'message': 'OpenCode agent (.opencode/agents/) has a tools: key, which OpenCode silently ignores',
                'fix_hint': 'Remove tools: and express the same intent via permission:'
            })

    return errors


def validate_command_frontmatter(
    content: str,
    file_path: str,
    doc_type_rules: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Validate a command file's YAML frontmatter (description budget + tool permissions).

    Presence-conditional: files that resolve to the command type but carry no
    frontmatter block — compiled contract artifacts, legacy bodies, folder READMEs —
    are not command entry docs, so their own structural rules govern them and this
    check stays silent. Only a real frontmatter block is inspected.

    The description-budget, quote handling, and MCP-token rules are the same primitives
    the sibling skill validator uses, so the two agree on any command frontmatter. The
    command surface uses a comma-separated allowed-tools list and may carry <arg>
    placeholder notation in its description; both are accepted here by design.
    """
    errors: List[Dict[str, Any]] = []

    if not content.startswith('---'):
        return errors

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        errors.append({
            'type': 'command_frontmatter_unclosed',
            'severity': 'blocking',
            'message': 'Command frontmatter is not closed (missing closing ---)',
            'fix_hint': 'Close the frontmatter block with a trailing ---',
        })
        return errors

    frontmatter = match.group(1)

    required_fields = doc_type_rules.get('frontmatterFields', {}).get('required', ['description'])
    for field in required_fields:
        if not re.search(rf'^{re.escape(field)}:\s*\S', frontmatter, re.MULTILINE):
            errors.append({
                'type': 'command_frontmatter_missing_field',
                'severity': 'blocking',
                'message': f"Command frontmatter is missing required field '{field}'",
                'fix_hint': f"Add a single-line '{field}:' entry to the frontmatter",
            })

    # Description: reject YAML multiline block form first, then measure the user-visible value.
    if re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
        errors.append({
            'type': 'command_description_multiline',
            'severity': 'blocking',
            'message': 'Command description uses YAML multiline block format (must be single line after colon)',
            'fix_hint': 'Collapse the description onto one line after the colon',
        })
    else:
        desc_match = re.search(r'description:\s*(.+)', frontmatter)
        if desc_match:
            description = _strip_matching_quotes(desc_match.group(1))
            length_error, length_warning = _check_description_length(description, _DESC_SOFT_COMMAND)
            if length_error:
                errors.append({
                    'type': 'command_description_over_hard_cap',
                    'severity': 'blocking',
                    'message': length_error,
                    'fix_hint': 'Trim the description below the hard cap so the command registers',
                })
            elif length_warning:
                errors.append({
                    'type': 'command_description_over_soft_target',
                    'severity': 'warning',
                    'message': length_warning,
                    'fix_hint': 'Trim the description toward the soft target',
                })
            if '<' in description or '>' in description:
                errors.append({
                    'type': 'command_description_angle_brackets',
                    'severity': 'warning',
                    'message': 'Command description contains angle brackets (< or >) — allowed as <arg> placeholder notation; confirm it is not stray markup',
                    'fix_hint': 'If the brackets are not intentional <arg> notation, remove them',
                })
            if 'TODO' in description.upper():
                errors.append({
                    'type': 'command_description_todo',
                    'severity': 'warning',
                    'message': 'Command description contains a TODO placeholder — please complete it',
                    'fix_hint': 'Replace the TODO with the real description',
                })

    # argument-hint budget: the hint summarizes the invocation shape, EXECUTION
    # TARGETS enumerates the full flag surface. An over-budget hint is a soft
    # signal to move detail into the router body, never a hard failure.
    hint_match = re.search(r'^argument-hint:\s*(.+)$', frontmatter, re.MULTILINE)
    if hint_match:
        hint_value = _strip_matching_quotes(hint_match.group(1))
        if len(hint_value) > _HINT_SOFT_BUDGET:
            errors.append({
                'type': 'command_argument_hint_over_budget',
                'severity': 'warning',
                'message': (
                    f'argument-hint is {len(hint_value)} chars, over the soft budget of '
                    f'{_HINT_SOFT_BUDGET} — the hint should summarize; EXECUTION TARGETS enumerates'
                ),
                'fix_hint': 'Summarize the invocation in the hint; move the full flag list into the router body',
            })

    # allowed-tools: any token in the mcp_ namespace must be a fully-qualified
    # mcp__<server>__<tool> reference; a bare or server-only token is an
    # under-specified permission. Native tools and non-namespaced plugin tools pass.
    tools_match = re.search(r'^allowed-tools:\s*(.+)$', frontmatter, re.MULTILINE)
    if tools_match:
        for token in _iter_allowed_tools(tools_match.group(1)):
            if _is_non_fq_mcp_token(token):
                errors.append({
                    'type': 'command_allowed_tools_non_fq_mcp',
                    'severity': 'blocking',
                    'message': f"allowed-tools entry '{token}' is a non-fully-qualified MCP tool token — use mcp__<server>__<tool>",
                    'fix_hint': f"Replace '{token}' with its fully-qualified mcp__<server>__<tool> form",
                })

    # Ergonomics: a trailing `User request: $ARGUMENTS` raw-echo is a deprecated
    # idiom. The command already receives $ARGUMENTS; echoing it verbatim adds no
    # routing behavior and duplicates the argument surface the router resolves.
    # Warn, never block — it is harmless, just legacy.
    body = content[match.end():]
    if re.search(r'^User request:\s*\$ARGUMENTS\s*$', body, re.MULTILINE):
        errors.append({
            'type': 'command_raw_argument_echo',
            'severity': 'warning',
            'message': 'Command carries the deprecated `User request: $ARGUMENTS` raw-echo — the command already receives $ARGUMENTS; the echo adds no routing behavior',
            'fix_hint': 'Remove the raw-echo line; the router body resolves $ARGUMENTS directly',
        })

    return errors


# A changelog entry is findable only through the search metadata in its
# frontmatter, the same five keys a spec document carries. Only entry files are
# held to it: a version file or a packet-local changelog file. Any other document
# in a changelog folder, such as its README, keeps the structural rules alone.
CHANGELOG_ENTRY_NAME = re.compile(r'^(?:v\d+(?:\.\d+){1,3}|changelog-.+)\.md$')
CHANGELOG_VERSION_NAME = re.compile(r'^v(\d+(?:\.\d+){1,3})\.md$')


def _skip_leading_trivia(content: str) -> int:
    """Offset past leading whitespace and HTML comments.

    The trigger index skips both before it looks for the opening fence, so the
    check reads an entry's block exactly where the index reads it.
    """
    index = 0
    while index < len(content):
        if content[index] in ' \t\r\n':
            index += 1
            continue
        if content.startswith('<!--', index):
            close = content.find('-->', index + 4)
            if close == -1:
                break
            index = close + 3
            continue
        break
    return index


def _changelog_trigger_phrases(frontmatter: str) -> List[str]:
    """Read trigger_phrases from a frontmatter block, in list or inline form."""
    match = re.search(r'^trigger_phrases:[ \t]*(.*)$', frontmatter, re.MULTILINE)
    if not match:
        return []
    inline = match.group(1).strip()
    if inline:
        if inline.startswith('[') and inline.endswith(']'):
            items = [_strip_matching_quotes(item) for item in inline[1:-1].split(',')]
            return [item for item in items if item]
        return []
    phrases: List[str] = []
    for line in frontmatter[match.end():].split('\n')[1:]:
        member = re.match(r'^\s+-\s+(.+?)\s*$', line)
        if member:
            phrases.append(_strip_matching_quotes(member.group(1)))
        elif line.strip() and not line[0].isspace():
            break
    return [phrase for phrase in phrases if phrase]


def validate_changelog_frontmatter(
    content: str,
    file_path: str,
    doc_type_rules: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Validate the search metadata block of a changelog entry.

    Blocks an entry that has no frontmatter block, lacks a required key, declares
    no trigger phrase or, for a version file, declares no phrase naming its version.
    """
    errors: List[Dict[str, Any]] = []
    file_name = PurePosixPath(str(file_path).replace('\\', '/')).name
    if not CHANGELOG_ENTRY_NAME.match(file_name):
        return errors

    text = content[1:] if content.startswith('﻿') else content
    head = text[_skip_leading_trivia(text):]
    if not head.startswith('---'):
        errors.append({
            'type': 'changelog_frontmatter_missing',
            'severity': 'blocking',
            'message': 'Changelog entry has no frontmatter block, so the trigger index cannot find it',
            'fix_hint': 'Open the entry with the frontmatter block the sk-create-changelog Frontmatter Contract defines',
        })
        return errors

    match = re.match(r'^---[ \t]*\r?\n(.*?)\r?\n---', head, re.DOTALL)
    if not match:
        errors.append({
            'type': 'changelog_frontmatter_unclosed',
            'severity': 'blocking',
            'message': 'Changelog entry frontmatter is not closed (missing closing ---)',
            'fix_hint': 'Close the frontmatter block with a trailing ---',
        })
        return errors

    frontmatter = match.group(1)
    required_fields = doc_type_rules.get('frontmatterFields', {}).get('required', [])
    for field in required_fields:
        pattern = rf'^{re.escape(field)}:' if field == 'trigger_phrases' else rf'^{re.escape(field)}:[ \t]*\S'
        if not re.search(pattern, frontmatter, re.MULTILINE):
            errors.append({
                'type': 'changelog_frontmatter_missing_field',
                'severity': 'blocking',
                'message': f"Changelog entry frontmatter is missing required field '{field}'",
                'fix_hint': f"Add '{field}:' to the frontmatter block",
            })

    phrases = _changelog_trigger_phrases(frontmatter)
    if re.search(r'^trigger_phrases:', frontmatter, re.MULTILINE) and not phrases:
        errors.append({
            'type': 'changelog_trigger_phrases_empty',
            'severity': 'blocking',
            'message': 'Changelog entry declares no trigger phrase',
            'fix_hint': 'List the identity phrases for the entry path, then a topic phrase',
        })

    version = CHANGELOG_VERSION_NAME.match(file_name)
    if version and phrases:
        named = re.compile(rf'(?<![\d.]){re.escape(version.group(1))}(?![\d.])')
        if not any(named.search(phrase) for phrase in phrases):
            errors.append({
                'type': 'changelog_version_phrase_missing',
                'severity': 'blocking',
                'message': f"Changelog entry declares no trigger phrase naming its version {version.group(1)}",
                'fix_hint': f"Add the identity phrases, such as '<component> v{version.group(1)}'",
            })

    return errors


# The changelog contract omits internal labels and test accounting from prose.
# Released entries already carry some, so the check advises rather than blocks.
# Algorithm names such as SHA-256 and AES-256 share the letters-dash-digits shape
# of a decision or requirement id, so they are carved out by prefix.
CHANGELOG_INTERNAL_ID = re.compile(
    r'\b(?!(?:SHA|AES|RSA|CRC|DES)-)(?:[A-Z]{2,4}-\d{3}|T\d{3})\b'
)
CHANGELOG_TEST_COUNT = re.compile(r'\b\d+\s+(?:cases|tests|PASS lines)\b')
# An inline code span quotes a literal, such as the comment a fix stopped accepting.
CHANGELOG_CODE_SPAN = re.compile(r'`[^`\n]*`')


def validate_changelog_omissions(content: str, file_path: str) -> List[Dict[str, Any]]:
    """Flag internal ids and test counts in the prose of a changelog entry.

    The frontmatter block and the spec-folder blockquote are exempt: the quoted
    line is where the contract allows packet labels to live.
    """
    file_name = PurePosixPath(str(file_path).replace('\\', '/')).name
    if not CHANGELOG_ENTRY_NAME.match(file_name):
        return []

    text = content[1:] if content.startswith('﻿') else content
    offset = _skip_leading_trivia(text)
    head = text[offset:]
    fence = re.match(r'^---[ \t]*\r?\n.*?\r?\n---[ \t]*(?:\r?\n|$)', head, re.DOTALL)
    body = head[fence.end():] if fence else head

    ids: List[str] = []
    counts: List[str] = []
    for line in body.split('\n'):
        if line.lstrip().startswith('>'):
            continue
        prose = CHANGELOG_CODE_SPAN.sub('', line)
        ids.extend(CHANGELOG_INTERNAL_ID.findall(prose))
        counts.extend(CHANGELOG_TEST_COUNT.findall(prose))

    errors: List[Dict[str, Any]] = []
    if ids:
        errors.append({
            'type': 'changelog_internal_id',
            'severity': 'warning',
            'message': f"Changelog prose names an internal id ({', '.join(sorted(set(ids)))}); ids belong only on the spec-folder line",
            'fix_hint': 'Describe the behavior in plain words and drop the id',
        })
    if counts:
        errors.append({
            'type': 'changelog_test_count',
            'severity': 'warning',
            'message': f"Changelog prose carries a test count ({', '.join(sorted(set(counts)))}); the omission rule drops test counts",
            'fix_hint': 'State what the release now guarantees, not how many checks run',
        })
    return errors


# The value list belongs to sk-create-frontmatter, which owns the frontmatter contract;
# spec-kit's validator reads the same file, so spec docs and skill docs agree.
FRONTMATTER_VALUES_PATH = (
    Path(__file__).resolve().parents[2] / 'sk-create-frontmatter' / 'assets' / 'frontmatter-values.json'
)
_FRONTMATTER_VALUE_KEYS = (('contextType', 'contextType'), ('importance_tier', 'importanceTier'))
_FRONTMATTER_VALUES_UNREADABLE = object()


def _load_frontmatter_values() -> Any:
    """Read the shared value list; None when absent, a sentinel when unreadable.

    A checkout that never carried the file stays silent. One that carries an
    unparseable or wrongly shaped file degrades to a single advisory warning,
    so a broken list cannot turn the validator into a traceback.
    """
    try:
        with open(FRONTMATTER_VALUES_PATH, 'r', encoding='utf-8') as handle:
            values = json.load(handle)
    except FileNotFoundError:
        return None
    except (OSError, ValueError):
        return _FRONTMATTER_VALUES_UNREADABLE

    shape_ok = isinstance(values, dict) and all(
        isinstance(values.get(list_key), dict)
        and isinstance(values[list_key].get('canonical'), list)
        and isinstance(values[list_key].get('aliases'), (list, dict))
        for _, list_key in _FRONTMATTER_VALUE_KEYS
    )
    if not shape_ok:
        return _FRONTMATTER_VALUES_UNREADABLE
    return values


def _frontmatter_scalar(raw: str) -> str:
    """One YAML scalar as written after the key.

    A quoted value keeps everything between its quotes, and an unquoted value
    ends where ` #` starts a comment, so `planning # note` reads as `planning`.
    """
    value = raw.strip()
    quoted = re.match(r'^(["\'])(.*?)\1(?:\s+#.*)?$', value)
    if quoted:
        return quoted.group(2).strip()
    return re.sub(r'(?:^|\s+)#.*$', '', value).strip()


def _frontmatter_block(content: str) -> Tuple[Optional[str], int]:
    """Return the frontmatter block and the 0-based line index where it starts.

    Leading trivia is skipped the way the trigger index skips it, so a comment
    above the block does not hide the block from the check. A block that carries
    no plain key line is a thematic break, not frontmatter.
    """
    text = content[1:] if content.startswith('﻿') else content
    start = _skip_leading_trivia(text)
    head = text[start:]
    match = re.match(r'^---[ \t]*\r?\n(.*?)\r?\n---', head, re.DOTALL)
    if not match or not re.search(r'^[A-Za-z0-9_.-]+:[ \t]*', match.group(1), re.MULTILINE):
        return None, 0
    return match.group(1), text[:start].count('\n') + head[:match.start(1)].count('\n')


def _has_unescaped_inner_quote(value: str) -> bool:
    """Whether a double-quoted value closes before its last character.

    A backslash escapes the next character, so the first unescaped quote after
    the opening one ends the scalar. Anything but a trailing comment after it
    means the writer meant that quote as text, and a parser will not.
    """
    index = 1
    while index < len(value):
        if value[index] == '\\':
            index += 2
            continue
        if value[index] == '"':
            rest = value[index + 1:]
            return bool(rest.strip()) and not re.fullmatch(r'\s+#.*', rest)
        index += 1
    return False


def _fallback_yaml_problem(block: str) -> Optional[Tuple[int, str, str]]:
    """First line a strict parser would reject, as (index, detail, fix hint).

    Stands in for the parser when PyYAML is absent, for the three shapes a
    key-by-key read cannot see: an unquoted value holding ': ', an unquoted value
    that opens with a template placeholder, and a double-quoted value whose inner
    quote is unescaped. Block scalars, flow collections, list items and trailing
    comments are not part of a value, so they are skipped.
    """
    for index, line in enumerate(block.split('\n')):
        if not line or line[0] in ' \t#' or line.startswith('-'):
            continue
        found = re.match(r'^[^\s:#][^:]*:[ \t]*(.*)$', line)
        if not found:
            continue
        value = found.group(1).strip()
        if not value:
            continue
        if value.startswith('{{'):
            return (
                index,
                'an unquoted value opens a "{{" placeholder, which a parser reads as a flow mapping',
                'Quote the value so the placeholder stays a string, e.g. description: "{{title}}"',
            )
        if value.startswith('"'):
            if _has_unescaped_inner_quote(value):
                return (
                    index,
                    'a double-quoted value holds an unescaped inner double quote',
                    'Escape the inner quote as \\" or wrap the value in single quotes',
                )
            continue
        value = re.sub(r'(?:^|\s+)#.*$', '', value).strip()
        if not value or value[0] in "'|>{[":
            continue
        if ': ' in value:
            return (
                index,
                'an unquoted value contains ": "',
                'Quote the value so the colon stays inside the string, e.g. description: "Own it: the rules"',
            )
    return None


def validate_frontmatter_yaml(content: str) -> List[Dict[str, Any]]:
    """Block a frontmatter block that a strict YAML parser rejects.

    Every other frontmatter check reads keys line by line, so a block can satisfy
    them and still be unparseable: an unquoted value holding ': ' turns the rest
    of the line into a nested mapping. The parser reports its own line. Without
    PyYAML the line check catches an unquoted ': ', an unquoted '{{' placeholder
    and an unescaped inner double quote; other parse errors need the strict
    parser.
    """
    block, first_line = _frontmatter_block(content)
    if block is None:
        return []

    line: Optional[int] = None
    detail = ''
    hint = 'Quote the value so the colon stays inside the string, e.g. description: "Own it: the rules"'
    if yaml is not None:
        try:
            yaml.safe_load(block)
        except yaml.YAMLError as exc:
            mark = getattr(exc, 'problem_mark', None)
            line = first_line + mark.line + 1 if mark is not None else first_line + 1
            detail = getattr(exc, 'problem', None) or str(exc).splitlines()[0]
    else:
        problem = _fallback_yaml_problem(block)
        if problem is not None:
            offset, detail, hint = problem
            line = first_line + offset + 1

    if line is None:
        return []
    return [{
        'type': 'frontmatter_invalid_yaml',
        'severity': 'blocking',
        'message': f'Frontmatter is not valid YAML at line {line}: {detail}',
        'fix_hint': hint,
        'line_number': line,
        'auto_fixable': False,
    }]


def validate_frontmatter_values(content: str, values: Any) -> List[Dict[str, Any]]:
    """Warn when contextType or importance_tier is outside the shared list.

    Aliases are legal. A missing or empty value is left to the presence checks,
    so only a present value outside the list is reported. A list that exists but
    cannot be read yields one warning and skips the comparison.
    """
    if values is None:
        return []
    if values is _FRONTMATTER_VALUES_UNREADABLE:
        return [{
            'type': 'frontmatter_values_unreadable',
            'severity': 'warning',
            'message': f'Shared frontmatter value list {FRONTMATTER_VALUES_PATH} is unreadable, so no values were compared',
            'fix_hint': f'Restore {FRONTMATTER_VALUES_PATH} or remove it if this checkout should not carry the shared list',
            'auto_fixable': False,
        }]
    text = content[1:] if content.startswith('﻿') else content
    head = text[_skip_leading_trivia(text):]
    match = re.match(r'^---[ \t]*\r?\n(.*?)\r?\n---', head, re.DOTALL)
    if not match:
        return []
    lists = {
        'contextType': values['contextType'],
        'importanceTier': values['importanceTier'],
    }
    warnings: List[Dict[str, Any]] = []
    for field, list_key in _FRONTMATTER_VALUE_KEYS:
        found = re.search(rf'^{field}:[ \t]*(.+?)[ \t]*$', match.group(1), re.MULTILINE)
        if not found:
            continue
        value = _frontmatter_scalar(found.group(1)).lower()
        accepted = set(lists[list_key]['canonical']) | set(lists[list_key]['aliases'])
        if value and value not in accepted:
            canonical = ', '.join(lists[list_key]['canonical'])
            warnings.append({
                'type': 'frontmatter_value_outside_list',
                'severity': 'warning',
                'message': f'{field} "{value}" is not in the shared list',
                'fix_hint': f'Use one of {canonical}, or an alias listed in {FRONTMATTER_VALUES_PATH.name}',
                'auto_fixable': False,
            })
    return warnings


def exempt_consumer_for(file_path: str) -> Optional[str]:
    """Return the code file that depends on this doc's text, or None when none does.

    The ledger keys its docs relative to the skills root, so a path outside that
    root cannot match a record and is validated in full.
    """
    try:
        relative = Path(file_path).resolve().relative_to(render_exempt.skills_root())
    except ValueError:
        return None
    return render_exempt.load_exempt().get(relative.as_posix())


def validate_document(
    file_path: str,
    doc_type: Optional[str] = None,
    rules: Optional[Dict[str, Any]] = None,
    skip_exclusions: bool = False,
) -> Dict[str, Any]:
    """
    Validate a markdown document against template rules.

    Args:
        file_path: Path to the markdown file
        doc_type: Document type (readme, skill, etc.) - auto-detected if None
        rules: Template rules dict - loaded from JSON if None
        skip_exclusions: If True, validate even excluded paths

    Returns:
        dict: Validation result with errors, warnings, and summary
    """
    # Check path exclusions (unless explicitly skipped)
    if not skip_exclusions:
        excluded, reason = should_exclude_path(file_path)
        if excluded:
            return {
                'valid': True,
                'skipped': True,
                'skip_reason': reason,
                'document_type': 'unknown',
                'file_path': str(file_path),
                'blocking_errors': [],
                'warnings': [],
                'info': [],
                'total_issues': 0,
                'auto_fixable_count': 0,
                'exit_code': 0
            }

    if rules is None:
        script_dir = Path(__file__).resolve().parent
        rules = load_template_rules(script_dir)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return {
            'valid': False,
            'error': f'File not found: {file_path}',
            'exit_code': 2
        }
    except Exception as exc:
        return {
            'valid': False,
            'error': f"Error reading file ({type(exc).__name__}): {exc}",
            'exit_code': 2
        }

    # A doc whose exact text a code file depends on still gets checked, but its
    # findings are reported as advice with that reader named: rewriting the text is
    # the one fix that would break the code, so it must not fail the build.
    exempt_consumer = exempt_consumer_for(file_path)

    type_source = 'explicit'
    if doc_type is None:
        doc_type, type_source = _detect_document_type_with_source(file_path, content, rules)
    elif doc_type == 'code-folder':
        doc_type = 'code_folder'

    doc_type_rules = rules.get('documentTypes', {}).get(doc_type, {})

    if not doc_type_rules:
        return {
            'valid': True,
            'warnings': [f'Unknown document type: {doc_type}, using minimal validation'],
            'exit_code': 0
        }

    all_errors = []
    all_errors.extend(validate_toc(content, doc_type_rules, rules))
    all_errors.extend(validate_h2_headers(content, doc_type_rules, rules))
    if doc_type != 'code_folder':
        structure_rules = doc_type_rules
        if is_repo_root_readme(file_path):
            structure_rules = {**doc_type_rules, 'h2DividerRequired': False}
        all_errors.extend(validate_general_structure(content, structure_rules))
    all_errors.extend(validate_render_checks(content, doc_type, doc_type_rules, Path(file_path)))
    all_errors.extend(validate_required_sections(content, doc_type_rules))
    if doc_type == 'feature_catalog':
        all_errors.extend(validate_feature_catalog_table(content, doc_type_rules))
    if doc_type == 'agent':
        all_errors.extend(validate_agent_frontmatter(content, file_path))
    if doc_type == 'command':
        all_errors.extend(validate_command_frontmatter(content, file_path, doc_type_rules))
    if doc_type == 'changelog':
        all_errors.extend(validate_changelog_frontmatter(content, file_path, doc_type_rules))
        all_errors.extend(validate_changelog_omissions(content, file_path))
    if doc_type == 'code_folder':
        all_errors.extend(validate_code_folder(content, file_path))
    all_errors.extend(validate_frontmatter_yaml(content))
    all_errors.extend(validate_frontmatter_values(content, _load_frontmatter_values()))

    # README rules applied by default look like a README verdict, so say it was a fallback.
    if type_source == 'default':
        all_errors.append({
            'type': 'document_type_fallback',
            'severity': 'warning',
            'message': f'No document type rule matched {file_path}, so README rules were applied. Pass --type to choose the rule set.',
            'fix_hint': 'Pass --type <type> to validate against the intended rule set',
            'auto_fixable': False,
        })

    # An exempt doc's findings are demoted rather than dropped, so the reader that
    # owns the text still sees what would change and every finding says why it does
    # not block.
    if exempt_consumer:
        prefix = f'exempt (read by {exempt_consumer}): '
        for finding in all_errors:
            if finding.get('severity') == 'blocking':
                finding['severity'] = 'warning'
            finding['exempt_consumer'] = exempt_consumer
            finding['message'] = prefix + finding.get('message', '')

    blocking_errors = [e for e in all_errors if e.get('severity') == 'blocking']
    warnings = [e for e in all_errors if e.get('severity') == 'warning']
    info = [e for e in all_errors if e.get('severity') == 'info']

    valid = len(blocking_errors) == 0
    exit_code = 0 if valid else 1

    result = {
        'valid': valid,
        'document_type': doc_type,
        'file_path': str(file_path),
        'blocking_errors': blocking_errors,
        'warnings': warnings,
        'info': info,
        'total_issues': len(all_errors),
        'auto_fixable_count': sum(1 for e in all_errors if e.get('auto_fixable')),
        'exit_code': exit_code
    }
    if exempt_consumer:
        result['exempt_consumer'] = exempt_consumer
    return result


# ───────────────────────────────────────────────────────────────
# 8. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

# The advisory runs on the human report only: every batch caller in the
# repository reads --json, and the check makes model calls.
CITE_DRIFT_SCRIPT = Path(__file__).resolve().parent / 'cite-drift-scan.mjs'
# The shared master switch, the feature's own switch and the older name all
# stop the advisory before node is spawned.
CITE_DRIFT_SWITCHES = ('JEV_FEATURES', 'JEV_FEATURE_CITE_DRIFT', 'SKDOC_CITE_DRIFT_CHECK')
CITE_DRIFT_OFF_VALUES = ('0', 'false', 'no', 'off')
CITE_DRIFT_OUT = 'SKDOC_CITE_DRIFT_OUT'
CITE_DRIFT_PREFIX = 'cite-drift advisory:'
CITE_DRIFT_TIMEOUT_S = 90


def print_cite_drift_advisory(file_path: str) -> None:
    """Print the citation drift advisory for one validated document.

    The check asks Jev whether each in-range citation in the document still
    points at code that shows its claim. It never raises and never changes the
    exit code; a missing node, script, credential or citation prints nothing.

    Args:
        file_path: The document path as the caller gave it.
    """
    switches = (os.environ.get(name, '') for name in CITE_DRIFT_SWITCHES)
    if any(value.strip().lower() in CITE_DRIFT_OFF_VALUES for value in switches):
        return
    node = shutil.which('node')
    if node is None or not CITE_DRIFT_SCRIPT.is_file():
        return
    command = [node, str(CITE_DRIFT_SCRIPT), '--advise', file_path]
    out_dir = os.environ.get(CITE_DRIFT_OUT, '')
    if out_dir:
        command += ['--out', out_dir]
    try:
        proc = subprocess.run(
            command,
            stdin=subprocess.DEVNULL,
            capture_output=True,
            text=True,
            timeout=CITE_DRIFT_TIMEOUT_S,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return
    lines = [line for line in proc.stdout.splitlines() if line.startswith(CITE_DRIFT_PREFIX)]
    if lines:
        print()
        for line in lines:
            print(line)


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Validate markdown documentation against template rules',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('file', help='Markdown file to validate')
    parser.add_argument('--type', choices=['readme', 'code_folder', 'code-folder', 'skill', 'reference', 'asset', 'agent', 'command', 'install_guide', 'security_policy', 'skill_router', 'spec', 'changelog', 'playbook', 'playbook_feature', 'feature_catalog', 'benchmark_companion'],
                        help='Document type (auto-detected if not specified)')
    parser.add_argument('--json', action='store_true', help='Output results as JSON')
    parser.add_argument('--blocking-only', action='store_true', help='Show only blocking errors')
    parser.add_argument('--fix', action='store_true', help='Apply auto-fixes')
    parser.add_argument('--dry-run', action='store_true', help='Show fixes without applying (use with --fix)')
    parser.add_argument('--no-exclude', action='store_true',
                        help='Validate even excluded paths (pytest_cache, node_modules, etc.)')

    args = parser.parse_args()
    # --fix rewrites the document rather than judging it, so it keeps running.
    if not args.fix:
        exit_if_validation_off('validate_document.py')

    # Load rules
    script_dir = Path(__file__).resolve().parent
    rules = load_template_rules(script_dir)

    # Validate document
    result = validate_document(args.file, args.type, rules, skip_exclusions=args.no_exclude)

    # Handle file errors
    if 'error' in result:
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(result['exit_code'])

    # Handle skipped files
    if result.get('skipped'):
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"\n⏭️  SKIPPED: {args.file}")
            print(f"Reason: {result.get('skip_reason', 'Unknown')}")
            print("Use --no-exclude to validate anyway")
        sys.exit(0)

    # Apply fixes if requested. An exempt doc is never rewritten: a code file reads
    # its exact text, so an automatic fix is the one change that would break it.
    if args.fix and result.get('exempt_consumer'):
        print(f"Not fixing {args.file}: read by {result['exempt_consumer']}")
    elif args.fix and result.get('auto_fixable_count', 0) > 0:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = f.read()

        all_errors = result.get('blocking_errors', []) + result.get('warnings', [])
        fixed_content, fixes_applied = apply_fixes(content, all_errors)

        if fixes_applied:
            if args.dry_run:
                print("Fixes that would be applied (dry-run):")
                for fix in fixes_applied:
                    print(f"  - {fix['type']}")
                    print(f"    Original: {fix['original']}")
                    print(f"    Fixed:    {fix['fixed']}")
            else:
                with open(args.file, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                print(f"Applied {len(fixes_applied)} fixes to {args.file}")

                # Re-validate after fixes
                result = validate_document(args.file, args.type, rules, skip_exclusions=args.no_exclude)

    # Output results
    if args.json:
        # Clean up result for JSON output
        output = {
            'valid': result['valid'],
            'document_type': result['document_type'],
            'file_path': result['file_path'],
            'total_issues': result['total_issues'],
            'auto_fixable_count': result['auto_fixable_count'],
            'blocking_errors': result['blocking_errors'],
            'warnings': result['warnings'] if not args.blocking_only else []
        }
        if result.get('exempt_consumer'):
            output['exempt_consumer'] = result['exempt_consumer']
        print(json.dumps(output, indent=2))
    else:
        # Human-readable output
        status = "✅ VALID" if result['valid'] else "❌ INVALID"
        print(f"\n{status}: {args.file}")
        print(f"Document type: {result['document_type']}")
        if result.get('exempt_consumer'):
            print(f"Exempt: read by {result['exempt_consumer']}")
        print(f"Total issues: {result['total_issues']}")

        if result['blocking_errors']:
            print(f"\n🚫 Blocking errors ({len(result['blocking_errors'])}):")
            for error in result['blocking_errors']:
                print(f"  - [{error['type']}] {error['message']}")
                if error.get('line'):
                    print(f"    Line: {error['line'][:60]}...")
                if error.get('fix_hint'):
                    print(f"    Fix: {error['fix_hint']}")
                if error.get('auto_fixable'):
                    print(f"    Auto-fixable: Yes (use --fix)")

        if result['warnings'] and not args.blocking_only:
            print(f"\n⚠️ Warnings ({len(result['warnings'])}):")
            for warning in result['warnings']:
                print(f"  - [{warning['type']}] {warning['message']}")

        if result['auto_fixable_count'] > 0 and not args.fix:
            print(f"\n💡 {result['auto_fixable_count']} issues can be auto-fixed. Run with --fix")

        if not args.blocking_only:
            print_cite_drift_advisory(args.file)

    sys.exit(result['exit_code'])


if __name__ == '__main__':
    main()
