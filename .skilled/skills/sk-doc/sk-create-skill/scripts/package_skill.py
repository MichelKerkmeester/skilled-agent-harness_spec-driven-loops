#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL PACKAGER
# ───────────────────────────────────────────────────────────────

"""
Skill Packager - Creates a distributable zip file of a skill folder

Validates against skill creation standards:
- skill_creation.md: Overall skill requirements
- skill_md_template.md: SKILL.md structure requirements
- skill_reference_template.md: Reference file requirements
- skill_asset_template.md: Asset file requirements

Usage:
    python package_skill.py <path/to/skill-folder> [output-directory]
    python package_skill.py <path/to/skill-folder> --check  # Validate only, don't package

Example:
    python package_skill.py .skilled/skills/my-skill
    python package_skill.py .skilled/skills/my-skill ./dist
    python package_skill.py .skilled/skills/my-skill --check
"""

import argparse
import json
import os
import re
import sys
import zipfile
from pathlib import Path
from typing import Any, Dict, List, NamedTuple, Optional, Tuple

try:
    import yaml
except ImportError:
    yaml = None

try:
    import os as _os
    import sys as _sys

    _sys.path.insert(0, _os.path.join(_os.path.dirname(__file__), '..', '..', 'shared', 'scripts'))
    from skill_contract import description_budget as _description_budget
except Exception:
    _description_budget = None

_SHARED_SCRIPTS = Path(__file__).resolve().parents[2] / 'shared' / 'scripts'
sys.path.insert(0, str(_SHARED_SCRIPTS))
from naming_root_resolver import find_unsupported_root_dirs  # type: ignore

# ───────────────────────────────────────────────────────────────
# 1. VALIDATION CONSTANTS (aligned with skill_creation.md)
# ───────────────────────────────────────────────────────────────

# Required frontmatter fields (version is required for skills per the versioning standard)
REQUIRED_FRONTMATTER_FIELDS = ['name', 'description', 'allowed-tools', 'version']

# Optional frontmatter fields (validated if present, but not required)
OPTIONAL_FRONTMATTER_FIELDS = []

# Recommended frontmatter fields (warning if missing)
RECOMMENDED_FRONTMATTER_FIELDS = []

# Required SKILL.md sections (from skill_md_template.md)
# Note: HOW IT WORKS and HOW TO USE are treated as equivalent
REQUIRED_SECTIONS = [
    'WHEN TO USE',
    'SMART ROUTING',  # Section 2 per skill_creation.md
    'HOW IT WORKS',  # Also accepts 'HOW TO USE'
    'RULES',
    'REFERENCES',  # Section 5 per skill_creation.md (can be combined with SMART ROUTING)
]

# Alternative section names (for flexible matching)
# REFERENCES can be part of "SMART ROUTING & REFERENCES" combined header
SECTION_ALIASES = {
    'HOW IT WORKS': ['HOW IT WORKS', 'HOW TO USE'],
    'REFERENCES': ['REFERENCES', 'SMART ROUTING & REFERENCES'],
    'SMART ROUTING': ['SMART ROUTING', 'SMART ROUTING & REFERENCES'],
}

# Recommended sections (warning if missing)
RECOMMENDED_SECTIONS = [
    'SUCCESS CRITERIA',
    'INTEGRATION POINTS',
    'RELATED RESOURCES',
]

# Valid file extensions for each resource type.
# TypeScript scripts run through tsx or a build step, so they ship beside the
# other script sources.
VALID_SCRIPT_EXTENSIONS = ['.py', '.sh', '.bash', '.js', '.cjs', '.mjs', '.ts']
# Data files a script reads in place: hook path lists are resolved by path from
# the scripts that own them, so moving them under assets/ breaks their readers.
VALID_SCRIPT_DATA_EXTENSIONS = ['.txt']
VALID_REFERENCE_EXTENSIONS = ['.md']
VALID_ASSET_EXTENSIONS = ['.md', '.yaml', '.yml', '.json', '.txt', '.html', '.css', '.js']

# Size limits
MAX_SKILL_MD_WORDS = 5000
RECOMMENDED_MAX_WORDS = 3000
MAX_SKILL_MD_LINES = 3000

# ───────────────────────────────────────────────────────────────
# Resource-doc contract (skill_reference_template.md / skill_asset_template.md /
# frontmatter_versioning.md). These checks are emitted as WARNINGS, not hard
# errors: a repo-wide blast-radius sweep found a majority of legitimate skills
# would newly fail on at least one (kebab-case model files, version-less
# changelog entries, router skills without the canonical pseudocode), so the
# new contract is advisory to stay backward-compatible. See validate_skill().

# 5-field doc-frontmatter block required on every reference/asset markdown file.
# Enum VALUES intentionally NOT enforced: real skills use contextType values
# beyond the template's `general` (implementation/planning/research/reference/
# decision) and importance_tier `high` alongside normal/important. Presence only.
REQUIRED_RESOURCE_FRONTMATTER_FIELDS = [
    'title',
    'description',
    'trigger_phrases',
    'importance_tier',
    'contextType',
]

# Which .md files must carry a 4-part `version` in frontmatter. Follows
# frontmatter-version.mjs inScope(): every doc under the skill carries its own
# edition except test input, generated output and spec-doc examples. Two
# differences are deliberate: the skill's top-level changelog entries are checked
# here for their release version, which the engine skips, and SKILL.md is left to
# validate_frontmatter, so a SKILL.md under tests/ or fixtures/ is not checked here.
VERSION_SKIPPED_DIRS = {'scratch', 'node_modules', '.git', 'dist'}
VERSION_DOC_SUBTREES = {'references', 'assets', 'feature-catalog', 'manual-testing-playbook'}
VERSION_TEST_DIRS = {'tests', 'fixtures'}
VERSION_CORPUS_DIRS = {'runtime', 'benchmark', 'behavior-benchmark'}

# Subtrees whose .md files are reference/asset docs requiring the 5-field block.
# README.md is a distinct doc class and is exempt.
RESOURCE_DOC_SUBTREES = ['references', 'assets']

# Exact names and subtree classes owned by interpreters, tools, or generated
# output. Their spellings are contracts rather than authored filesystem slugs.
TOOL_MANDATED_FILENAMES = {
    '.utcp_config.json',
    'LICENSE',
    'action.yaml',
    'action.yml',
    'conftest.py',
    'mcp_config.json',
    'package-lock.json',
}
# Documentation whose name is the contract: an all-caps stem is how these are
# addressed across the repo and by the tools that read them, so it is not a
# slug an author may lowercase. Covers README/SKILL/ROUTER/DESIGN and the
# install, architecture, contract and reference docs that follow the same rule.
ALL_CAPS_DOC_RE = re.compile(r'^[A-Z][A-Z0-9+-]*$')
# Subtrees whose leaf names are identifiers rather than filesystem slugs.
# Behavior-benchmark scenarios are addressed as `<PREFIX>-NNN-<slug>` scenario
# IDs, and fixtures deliberately carry the shapes they exercise, so neither is
# free to be renamed into kebab-case without breaking what refers to it.
EXEMPT_SUBTREES = {
    'benchmarks',
    'changelog',
    'database',
    'dist',
    'node_modules',
    'reports',
    'scenarios',
    'z_archive',
}
KEBAB_CASE_SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*\+?$')
# A name may carry uppercase identifier segments among its kebab segments, as
# scenario and matrix-runner files do: the segment addresses a case by its ID
# rather than describing where the file sits, so lowercasing it renames the case.
IDENTIFIER_TOKEN_SLUG_RE = re.compile(
    r'^(?:[a-z0-9]+|[A-Z][A-Z0-9]*)(?:-+(?:[a-z0-9]+|[A-Z][A-Z0-9]*))*$'
)

# Smart-router resilience markers expected in SKILL.md Section 2 (SMART ROUTING)
# per skill_smart_router.md. A skill carrying the canonical pseudocode block
# names all three; missing markers flag a stale/absent router pattern.
SMART_ROUTER_MARKERS = [
    'discover_markdown_resources',
    '_guard_in_skill',
    'UNKNOWN_FALLBACK',
]

# Routing canon: a skill's SMART ROUTING section is short prose, and the machine
# router lives in the skill's own sibling ROUTER.md, which SKILL.md links to.
# Every skill and mode packet owns that file, so a `## MACHINE ROUTER` section
# left in SKILL.md is a second home for the router. Skills still in the old shape
# are listed in the known-debt ledger, keyed by their path relative to the skills
# root and recording the line count, word count, machine-block count and finding
# codes they were listed with, so a recorded shape is tolerated while it stays the
# shape the entry describes.
ROUTING_SHAPE_DEBT_FILE_ENV = 'ROUTING_SHAPE_DEBT_FILE'
ROUTING_SHAPE_DEBT_PATH = Path(__file__).resolve().parent / 'routing-shape-known-debt.json'
ROUTING_SHAPE_SKILLS_ROOT_ENV = 'ROUTING_SHAPE_SKILLS_ROOT'
ROUTING_SHAPE_MAX_LINES = 12
ROUTING_SHAPE_MAX_WORDS = 180
# The finding codes a debt entry may record as tolerated.
ROUTING_SHAPE_CODES = ('RS-001', 'RS-002', 'RS-003', 'RS-004', 'RS-005')
# A recorded code is migration debt for the cause the ledger was written against:
# a router file that has not moved yet, or the section it still keeps at the end
# of SKILL.md. A machine block in the routing prose, a section left mid-file and
# a router that leaves the folder are never that shape, so the entry's code
# cannot excuse them.
ROUTING_SHAPE_TOLERATED_CAUSES = {
    'RS-002': ('trailing-section',),
    'RS-004': ('missing-router',),
}
ROUTING_SHAPE_CAUSE_NOTES = {
    'RS-002': "a recorded RS-002 tolerates only a trailing '## MACHINE ROUTER' section",
    'RS-004': 'a recorded RS-004 tolerates only a missing ROUTER.md',
}
# The sibling document that owns a skill's machine router. SKILL.md points at it
# with a relative link, so a runtime that selects the skill reaches the router
# on demand instead of loading it with the skill.
ROUTING_SHAPE_ROUTER_FILE = 'ROUTER.md'
# A fenced or indented block holding any of these is a machine router, not
# prose: the two maps and the checklist are router data, the two functions are
# router helpers, so none of them belongs in SKILL.md at all.
ROUTING_SHAPE_MACHINE_LINE_RE = re.compile(
    r'^(?:\s*(?:INTENT_SIGNALS|RESOURCE_MAP|UNKNOWN_FALLBACK_CHECKLIST)\s*='
    r'|\s*def\s+(?:discover_markdown_resources|_guard_in_skill)\b)'
)
# A markdown link's target, read from prose only: a fenced sample of the pattern
# is not the link itself, an image is not a link, and the destination is compared
# as written rather than read up to its first space.
MARKDOWN_LINK_TARGET_RE = re.compile(r'(?<!!)\[[^\]]*\]\(\s*([^)]*?)\s*\)')

# 4-part version pattern X.Y.Z.W (frontmatter_versioning.md).
VERSION_4PART_RE = re.compile(r'^\d+\.\d+\.\d+\.\d+$')

# Findings promoted from warning -> error under --strict. These are the create-skill
# contract requirements (description budget, RULES subsections, resource-doc frontmatter,
# smart-router markers, placeholder/TODO completeness). Recommended-section, file-type,
# and generated-path naming findings stay advisory outside strict mode.
STRICT_PROMOTED_MARKERS = [
    "exceeds soft target",            # description budget (validate_frontmatter)
    "contains TODO placeholder",      # incomplete description
    "RULES section missing",          # ALWAYS/NEVER/ESCALATE subsections
    "has no frontmatter",             # resource-doc 5-field block absent
    "missing frontmatter field",      # resource-doc 5-field block incomplete
    "missing 'version' in frontmatter",  # versioned doc-class
    "is not 4-part",                  # bad version on doc-class
    "missing smart-router marker",    # SMART ROUTING resilience markers
    "routing shape RS-",              # routing canon (SMART ROUTING length, appendix, packet ROUTER.md)
    "SMART ROUTING must be its own H2 section",  # non-standalone/merged routing heading
    "Placeholder file should be removed",  # example_*/placeholder_*/sample_* files
    "must use kebab-case",           # generated package path contract
]


# ───────────────────────────────────────────────────────────────
# 2. VALIDATION FUNCTIONS
# ───────────────────────────────────────────────────────────────

def validate_frontmatter(content: str) -> Tuple[bool, str, List[str], Dict[str, str]]:
    """Validate SKILL.md frontmatter against skill_md_template.md requirements.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings, parsed_frontmatter).
    """
    warnings = []
    parsed = {}

    if not content.startswith('---'):
        return False, "No YAML frontmatter found (file should start with ---)", warnings, parsed

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format (missing closing ---)", warnings, parsed

    frontmatter = match.group(1)

    structured_frontmatter = None
    if yaml is not None:
        try:
            loaded_frontmatter = yaml.safe_load(frontmatter)
        except Exception:
            loaded_frontmatter = None
        if isinstance(loaded_frontmatter, dict):
            structured_frontmatter = loaded_frontmatter

    if structured_frontmatter is not None:
        for field in REQUIRED_FRONTMATTER_FIELDS:
            if field not in structured_frontmatter:
                return False, f"Missing required field '{field}' in frontmatter", warnings, parsed
        name = str(structured_frontmatter['name']).strip()
        parsed['name'] = name
    else:
        for field in REQUIRED_FRONTMATTER_FIELDS:
            if f'{field}:' not in frontmatter:
                return False, f"Missing required field '{field}' in frontmatter", warnings, parsed

        name_match = re.search(r'name:\s*(.+)', frontmatter)
        name = None
        if name_match:
            name = name_match.group(1).strip().strip('"\'')
            parsed['name'] = name

    if name is not None:
        # Hyphen-case: lowercase with hyphens only
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' must be hyphen-case (lowercase letters, digits, and hyphens only)", warnings, parsed
        if name.startswith('-') or name.endswith('-'):
            return False, f"Name '{name}' cannot start or end with hyphen", warnings, parsed
        if '--' in name:
            return False, f"Name '{name}' cannot contain consecutive hyphens", warnings, parsed

    if structured_frontmatter is not None:
        description = str(structured_frontmatter['description']).strip()
        if '\n' in description or re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
            return False, "Description uses YAML multiline block format (must be single line after colon)", warnings, parsed
        if not description:
            return False, "Description appears to be empty or multiline (must be single line after colon)", warnings, parsed
        parsed['description'] = description
    else:
        # YAML multiline block format not allowed
        if re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
            return False, "Description uses YAML multiline block format (must be single line after colon)", warnings, parsed

        desc_match = re.search(r'description:\s*(.+)', frontmatter)
        if desc_match:
            description = desc_match.group(1).strip().strip('"\'')
            parsed['description'] = description
        else:
            return False, "Description appears to be empty or multiline (must be single line after colon)", warnings, parsed

    # Angle brackets break OpenCode XML parsing
    if '<' in description or '>' in description:
        return False, "Description cannot contain angle brackets (< or >) - breaks OpenCode parsing", warnings, parsed

    if 'TODO' in description.upper():
        warnings.append("Description contains TODO placeholder - please complete it")

    # Description budget: ≤130 soft target (see skill_contract.json).
    budget = _description_budget('skill') if _description_budget else {}
    soft = int(budget.get('softMax', 130))
    hard = int(budget.get('hardCap', 1536))
    description_length = len(description)
    if description_length > hard:
        return False, (
            f"Description {description_length} chars exceeds hard cap {hard} — "
            "skill will fail to register"
        ), warnings, parsed
    elif description_length > soft:
        warnings.append(
            f"Description {description_length} chars exceeds soft target of {soft}"
        )

    if structured_frontmatter is not None:
        tools_value = structured_frontmatter['allowed-tools']
        parsed['allowed-tools'] = tools_value
        if not isinstance(tools_value, list):
            return False, f"allowed-tools must use array format [Tool1, Tool2], found: {tools_value}", warnings, parsed
    else:
        tools_match = re.search(r'allowed-tools:\s*(.+)', frontmatter)
        if tools_match:
            tools_value = tools_match.group(1).strip()
            parsed['allowed-tools'] = tools_value

            # Array format required: [Tool1, Tool2]
            if tools_value and not tools_value.startswith('['):
                if ',' in tools_value:
                    return False, f"allowed-tools must use array format [Tool1, Tool2], found: {tools_value}", warnings, parsed

    # version is required (enforced by REQUIRED_FRONTMATTER_FIELDS above) and must be 4-part X.Y.Z.W.
    if structured_frontmatter is not None:
        parsed['version'] = str(structured_frontmatter['version']).strip()
    else:
        version_match = re.search(r'^version:\s*(.+)', frontmatter, flags=re.MULTILINE)
        if version_match:
            parsed['version'] = version_match.group(1).strip()

    if 'version' in parsed:
        version_value = parsed['version'].strip().strip('"\'')
        if not re.match(r'^\d+\.\d+\.\d+\.\d+$', version_value):
            return False, (
                f"version '{version_value}' must be 4-part X.Y.Z.W "
                f"(see sk-create-frontmatter/references/frontmatter-versioning.md)"
            ), warnings, parsed

    return True, "Frontmatter valid", warnings, parsed


def get_packet_kind(content: str) -> str:
    """Return metadata.packetKind (lowercased) from SKILL.md frontmatter, or ''.

    Surface packets bundle a hub sub-surface and use a surface-shaped section
    layout rather than the standalone create-skill section contract, so the
    section / RULES / smart-router shape checks and the description soft-target
    do not apply to them. Frontmatter, naming, size, and resource-doc contracts
    still do.
    """
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return ''
    frontmatter = match.group(1)
    if yaml is not None:
        try:
            data = yaml.safe_load(frontmatter)
        except Exception:
            data = None
        if isinstance(data, dict):
            meta = data.get('metadata')
            if isinstance(meta, dict) and meta.get('packetKind') is not None:
                return str(meta.get('packetKind')).strip().lower()
    kind_match = re.search(r'packetKind:\s*([A-Za-z0-9_-]+)', frontmatter)
    return kind_match.group(1).strip().lower() if kind_match else ''


def validate_sections(content: str, is_hub: bool = False) -> Tuple[bool, str, List[str]]:
    """Validate SKILL.md has required sections per skill_md_template.md.

    Args:
        content: Raw SKILL.md file content.
        is_hub: Whether the skill is a hub whose modes carry the recommended
            sections, so only the required section contract applies.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    h2_pattern = r'^##\s+(.+?)\s*$'
    headings = re.findall(h2_pattern, content, re.MULTILINE)
    headings_upper = []
    for heading in headings:
        heading = re.sub(r'^\d+\.\s*', '', heading).strip()
        heading = re.sub(r'^[^\w]+', '', heading).strip()
        headings_upper.append(heading.upper())

    missing_required = []
    for section in REQUIRED_SECTIONS:
        aliases = SECTION_ALIASES.get(section, [section])
        # Fleet headings extend canonical names, so matching remains substring-based.
        found = any(alias in h for h in headings_upper for alias in aliases)
        if not found:
            missing_required.append(section)

    if missing_required:
        return False, f"Missing required sections: {', '.join(missing_required)}", warnings

    # A hub routes through ROUTER.md and its modes carry the standalone layout,
    # so the recommended sections are not a hub requirement.
    if not is_hub:
        for section in RECOMMENDED_SECTIONS:
            found = any(section in h for h in headings_upper)
            if not found:
                warnings.append(f"Missing recommended section: {section}")

    return True, "Sections valid", warnings


def validate_rules_section(content: str) -> Tuple[bool, str, List[str]]:
    """Validate RULES section has required subsections per skill_md_template.md.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    # Anchored to a line start so a `### Rules` subsection or a heading such as `## 6. DESIGN RULES` is not read as the section.
    rules_match = re.search(r'^##\s+(?:\d+\.\s*)?(?:[\U0001F300-\U0001F9FF]\s*)?RULES\b.*?\n(.*?)(?=\n##\s|\Z)', content, re.DOTALL | re.IGNORECASE | re.MULTILINE)

    if not rules_match:
        return True, "No RULES section to validate", warnings

    rules_content = rules_match.group(1)

    # Required subsections per skill_md_template.md
    required_subsections = [
        ('✅', 'ALWAYS'),
        ('❌', 'NEVER'),
        ('⚠️', 'ESCALATE'),
    ]

    for emoji, keyword in required_subsections:
        if keyword not in rules_content.upper():
            warnings.append(f"RULES section missing '{emoji} {keyword}' subsection")

    return True, "RULES section valid", warnings


def validate_content_size(content: str) -> Tuple[bool, str, List[str]]:
    """Validate SKILL.md size constraints per skill_creation.md.

    Args:
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    
    lines = content.split('\n')
    words = len(content.split())
    
    if len(lines) > MAX_SKILL_MD_LINES:
        warnings.append(f"SKILL.md has {len(lines)} lines (max recommended: {MAX_SKILL_MD_LINES})")
    
    if words > MAX_SKILL_MD_WORDS:
        return False, f"SKILL.md exceeds word limit ({words} words, max: {MAX_SKILL_MD_WORDS})", warnings
    elif words > RECOMMENDED_MAX_WORDS:
        warnings.append(f"SKILL.md has {words} words (recommended max: {RECOMMENDED_MAX_WORDS})")
    
    return True, "Content size valid", warnings


def validate_resources(skill_path: Path) -> Tuple[bool, str, List[str]]:
    """Validate optional resource folders per skill_asset_template.md and skill_reference_template.md.

    Args:
        skill_path: Path to the skill directory.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    scripts_dir = skill_path / 'scripts'
    refs_dir = skill_path / 'references'
    assets_dir = skill_path / 'assets'

    if scripts_dir.exists():
        accepted_suffixes = VALID_SCRIPT_EXTENSIONS + VALID_SCRIPT_DATA_EXTENSIONS
        for file in scripts_dir.iterdir():
            if file.is_file() and file.name != 'README.md' and file.suffix not in accepted_suffixes:
                warnings.append(
                    f"Unexpected file type in scripts/: {file.name} "
                    f"(expected: {', '.join(accepted_suffixes)}, README.md)"
                )

    # References: recurse into domain subfolders (legacy code scanned top level
    # only). Generated path naming is checked separately across the whole tree.
    if refs_dir.exists():
        for file in refs_dir.rglob('*'):
            if file.is_file() and file.name != 'README.md':
                rel = file.relative_to(skill_path)
                if file.suffix not in VALID_REFERENCE_EXTENSIONS:
                    warnings.append(f"Unexpected file type in references/: {rel} (expected: .md)")

    placeholder_patterns = ['example_*', 'placeholder_*', 'sample_*']
    for pattern in placeholder_patterns:
        for folder in [scripts_dir, refs_dir, assets_dir]:
            if folder.exists():
                for file in folder.glob(pattern):
                    warnings.append(f"Placeholder file should be removed or renamed: {file}")

    return True, "Resources valid", warnings


# A hub at a repository root declares this mode-registry extension. Its
# repoPaths name the top-level entries that belong to the repository, such as
# spec packets and exports, so no check here reads them as part of the skill.
REPO_ROOT_HUB_EXTENSION = 'repo-root-hub'


def _repo_root_hub(skill_path: Path) -> Optional[Dict[str, object]]:
    """Return the repo-root-hub declaration of a hub, or None when it has none."""
    try:
        registry = json.loads((skill_path / 'mode-registry.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None
    extensions = registry.get('extensions') if isinstance(registry, dict) else None
    if not isinstance(extensions, dict) or REPO_ROOT_HUB_EXTENSION not in extensions:
        return None
    declaration = extensions[REPO_ROOT_HUB_EXTENSION]
    return declaration if isinstance(declaration, dict) else {}


def repo_root_paths(skill_path: Path) -> frozenset:
    """Return the top-level names a repo-root hub declares as repository entries."""
    declaration = _repo_root_hub(skill_path) or {}
    listed = declaration.get('repoPaths')
    return frozenset(p for p in listed if isinstance(p, str)) if isinstance(listed, list) else frozenset()


def skill_folder_id(skill_path: Path) -> str:
    """Return the id a skill's folder stands for.

    A repository folder is named for people ("Product Owner"), so a repo-root hub
    stands for its folder name in kebab case. Every other skill stands for its
    folder name as it is.
    """
    if _repo_root_hub(skill_path) is None:
        return skill_path.name
    return re.sub(r'[^a-z0-9]+', '-', skill_path.name.lower()).strip('-')


def _is_python_package_directory(path: Path) -> bool:
    """Return whether a directory is an importable Python package."""
    return path.is_dir() and (path / '__init__.py').is_file()


def _is_exempt_package_path(path: Path, relative_path: Path, repo_paths: frozenset = frozenset()) -> bool:
    """Return whether a package path keeps a tool- or interpreter-owned name."""
    if relative_path.parts and relative_path.parts[0] in repo_paths:
        return True
    if any(part.startswith('.') for part in relative_path.parts):
        return True
    if any(part in EXEMPT_SUBTREES for part in relative_path.parts):
        return True
    # Dunder directories are a language convention (Python packages, Jest
    # __mocks__/__snapshots__), not authored slugs a maintainer may rename.
    if any(part.startswith('__') and part.endswith('__') for part in relative_path.parts):
        return True
    # Fixture trees hold the shapes they exercise, so their leaf names mirror
    # the inputs under test rather than naming a place in the package. The
    # directory name varies (fixture, fixtures, runtime-fixture), and a mirrored
    # project layout carries names no slug rule can reshape.
    if any(part.endswith(('fixture', 'fixtures')) for part in relative_path.parts):
        return True
    # A leading underscore marks a module as internal to its directory; the
    # marker is the meaning, so stripping it to satisfy a slug rule changes it.
    if path.name.startswith('_'):
        return True
    # A test file is named for the symbol it exercises, so its stem mirrors that
    # symbol's own casing rather than describing a place in the package.
    if any(path.name.endswith(suffix)
           for suffix in ('.test.ts', '.test.js', '.vitest.ts', '.spec.ts', '.test.cjs')):
        return True
    if path.is_dir():
        return _is_python_package_directory(path)
    if path.name in TOOL_MANDATED_FILENAMES:
        return True
    if ALL_CAPS_DOC_RE.fullmatch(path.name.split('.')[0]):
        return True
    if path.suffix == '.py' or path.name.endswith('.tsbuildinfo'):
        return True
    return False


def validate_generated_paths(skill_path: Path) -> Tuple[bool, str, List[str]]:
    """Check package-relative names against the kebab-case output contract.

    Args:
        skill_path: Path to the skill directory.

    Returns:
        Tuple of (is_valid, message, warnings). Findings remain warnings for
        debt-tolerant reads and are promoted by strict validation and packaging.
    """
    warnings = []
    repo_paths = repo_root_paths(skill_path)

    for path in sorted(skill_path.rglob('*')):
        relative_path = path.relative_to(skill_path)
        if _is_exempt_package_path(path, relative_path, repo_paths):
            continue

        slug = path.name if path.is_dir() else path.name.split('.')[0]
        if KEBAB_CASE_SLUG_RE.fullmatch(slug):
            continue
        if IDENTIFIER_TOKEN_SLUG_RE.fullmatch(slug):
            continue

        path_kind = 'directory' if path.is_dir() else 'file'
        warnings.append(
            f"Generated package {path_kind} '{relative_path}' must use kebab-case "
            "(lowercase letters, digits, and hyphens)"
        )

    return True, "Generated package paths checked", warnings


def _extract_frontmatter_block(content: str) -> Optional[str]:
    """Return the raw YAML frontmatter block of a markdown file, or None.

    Args:
        content: Raw markdown file content.

    Returns:
        The text between the opening and closing ``---`` fences, or None when the
        file has no frontmatter (frontmatter-less docs are skipped, not failed).
    """
    if not content.startswith('---'):
        return None
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None
    return match.group(1)


def _iter_subtree_markdown(skill_path: Path, subtrees: List[str]):
    """Yield (path, subtree_name) for every .md file under the given subtrees.

    Recurses into nested folders (the legacy validator only scanned the top
    level of each resource folder, so docs in domain subfolders went unchecked).
    """
    for subtree in subtrees:
        base = skill_path / subtree
        if not base.exists():
            continue
        for file in sorted(base.rglob('*.md')):
            if file.is_file():
                yield file, subtree


def _is_versioned_doc(dirs: Tuple[str, ...], name: str) -> bool:
    """True when a doc at these skill-relative dirs must carry a version."""
    if 'changelog' in dirs:
        # The skill's own changelog entries carry their release; the engine skips every changelog folder.
        return dirs[0] == 'changelog'
    if name == 'SKILL.md' or any(d in VERSION_TEST_DIRS for d in dirs):
        return False
    if any(d in VERSION_DOC_SUBTREES for d in dirs):
        return True
    if any(d in VERSION_CORPUS_DIRS for d in dirs):
        return False
    return '/templates/examples/' not in '/' + '/'.join(dirs) + '/'


def _iter_versioned_docs(skill_path: Path):
    """Yield every .md file under the skill that must carry a version.

    Walks with pruning so node_modules and scratch are never entered, and skips
    symlinks, which the engine's walker does not follow either.
    """
    repo_paths = repo_root_paths(skill_path)
    for dirpath, dirnames, filenames in os.walk(skill_path):
        dirs = Path(dirpath).relative_to(skill_path).parts
        skipped = VERSION_SKIPPED_DIRS | (repo_paths if not dirs else frozenset())
        dirnames[:] = sorted(d for d in dirnames if d not in skipped)
        for name in sorted(filenames):
            if not dirs and name in repo_paths:
                continue
            file = Path(dirpath) / name
            if name.endswith('.md') and not file.is_symlink() and _is_versioned_doc(dirs, name):
                yield file


def _has_skill_frontmatter_signature(frontmatter: str) -> bool:
    """True when a doc's frontmatter is a SKILL.md template, not a resource doc.

    A scaffold template renders verbatim into a new skill's SKILL.md, so its
    frontmatter is skill frontmatter (``name`` plus ``allowed-tools``) rather
    than the reference/asset 5-field block. Such files are judged by the
    SKILL.md contract, so the resource-doc block does not apply to them.
    Resource docs never carry ``allowed-tools``, so this signature is exclusive.
    """
    has_name = re.search(r'^name:', frontmatter, re.MULTILINE) is not None
    has_tools = re.search(r'^allowed-tools:', frontmatter, re.MULTILINE) is not None
    return has_name and has_tools


def validate_resource_frontmatter(skill_path: Path) -> Tuple[bool, str, List[str]]:
    """Validate reference/asset doc frontmatter per the sk-doc templates.

    Enforces (as WARNINGS) the 5-field doc block on every reference/asset
    markdown file and a 4-part ``version`` on every versioned doc-class file.
    README.md is exempt from the 5-field block (distinct doc class). Files
    without frontmatter are skipped.

    Args:
        skill_path: Path to the skill directory.

    Returns:
        Tuple of (is_valid, message, warnings). Always valid=True; findings are
        advisory warnings so the new contract stays backward-compatible.
    """
    warnings = []

    # 5-field block on reference/asset docs (README.md exempt).
    for file, _subtree in _iter_subtree_markdown(skill_path, RESOURCE_DOC_SUBTREES):
        if file.name == 'README.md':
            continue
        frontmatter = _extract_frontmatter_block(file.read_text(encoding='utf-8'))
        if frontmatter is None:
            warnings.append(
                f"Resource doc '{file.relative_to(skill_path)}' has no frontmatter "
                f"(expected 5-field block: {', '.join(REQUIRED_RESOURCE_FRONTMATTER_FIELDS)})"
            )
            continue
        if _has_skill_frontmatter_signature(frontmatter):
            continue
        missing = [
            field for field in REQUIRED_RESOURCE_FRONTMATTER_FIELDS
            if not re.search(rf'^{field}:', frontmatter, re.MULTILINE)
        ]
        if missing:
            warnings.append(
                f"Resource doc '{file.relative_to(skill_path)}' missing frontmatter "
                f"field(s): {', '.join(missing)}"
            )

    # 4-part version on every versioned doc-class file that has frontmatter.
    for file in _iter_versioned_docs(skill_path):
        frontmatter = _extract_frontmatter_block(file.read_text(encoding='utf-8'))
        if frontmatter is None:
            continue  # frontmatter-less docs are skipped, not failed
        version_match = re.search(r'^version:\s*(.+)$', frontmatter, re.MULTILINE)
        if not version_match:
            warnings.append(
                f"Doc '{file.relative_to(skill_path)}' missing 'version' in frontmatter "
                f"(4-part X.Y.Z.W per frontmatter_versioning.md)"
            )
            continue
        version_value = version_match.group(1).strip().strip('"\'')
        if not VERSION_4PART_RE.match(version_value):
            warnings.append(
                f"Doc '{file.relative_to(skill_path)}' has version '{version_value}' "
                f"that is not 4-part X.Y.Z.W"
            )

    return True, "Resource frontmatter checked", warnings


class MachineRouterSection(NamedTuple):
    """Span of a `## MACHINE ROUTER` section's body and whether it closes the file."""

    body_from: int
    body_to: int
    is_last: bool


class RoutingShape(NamedTuple):
    """Routing sections parsed from a SKILL.md, as the routing canon reads them."""

    smart_line_count: Optional[int]
    machine_block_lines: List[int]
    appendix: Optional[MachineRouterSection]
    smart_word_count: Optional[int]


class RoutingShapeFinding(NamedTuple):
    """One routing-shape rule break and the ledger cause it may be tolerated under."""

    code: str
    message: str
    cause: str


def _routing_shape_title(line: str) -> str:
    """Return an H2's title with numbering and leading emoji or punctuation removed."""
    title = re.sub(r'^##\s+', '', line)
    title = re.sub(r'^\d+[a-z]?\.\s*', '', title)
    title = re.sub(r'^[^\w]+', '', title)
    return title.strip().upper()


def parse_routing_shape(content: str) -> RoutingShape:
    """Parse a SKILL.md's routing sections per the routing canon.

    Frontmatter, fences and H2s are read in one pass because only a fence's
    state decides whether a `## ` line is a heading: templates inside a fenced
    block routinely carry their own `##` headings, and those are not sections.
    A fence closes only on a run of the character that opened it, at least as
    long, so a triple-backtick block nested in a four-backtick one stays inner
    text. A machine line outside every fence opens an indented machine block
    that runs until a line that is neither blank, indented nor a machine line.
    The SMART ROUTING word count covers the same lines as its line count.
    """
    lines = content.split('\n')
    first = 0
    if lines and lines[0].strip() == '---':
        for index in range(1, len(lines)):
            if lines[index].strip() == '---':
                first = index + 1
                break

    headings: List[Tuple[int, str]] = []
    machine_block_lines: List[int] = []
    fence_char: Optional[str] = None
    fence_run = 0
    fence_open: Optional[int] = None
    inner: List[str] = []
    unfenced_open = False
    for index in range(first, len(lines)):
        stripped = lines[index].strip()
        run_char = stripped[:1] if stripped[:1] in ('`', '~') else ''
        run_len = len(stripped) - len(stripped.lstrip(run_char)) if run_char else 0
        if fence_char is not None:
            if run_char == fence_char and run_len >= fence_run and not stripped[run_len:]:
                if any(ROUTING_SHAPE_MACHINE_LINE_RE.match(line) for line in inner):
                    machine_block_lines.append(fence_open + 1)
                fence_char = None
                fence_run = 0
                fence_open = None
            else:
                inner.append(lines[index])
            continue
        if run_len >= 3:
            fence_char = run_char
            fence_run = run_len
            fence_open = index
            inner = []
            unfenced_open = False
            continue
        if lines[index].startswith('## '):
            headings.append((index, _routing_shape_title(lines[index])))
            unfenced_open = False
            continue
        if ROUTING_SHAPE_MACHINE_LINE_RE.match(lines[index]):
            if not unfenced_open:
                machine_block_lines.append(index + 1)
                unfenced_open = True
            continue
        if unfenced_open and stripped and not lines[index][:1].isspace():
            unfenced_open = False
    machine_block_lines.sort()

    smart_index = next(
        (i for i, (_index, title) in enumerate(headings) if title.startswith('SMART ROUTING')),
        -1,
    )
    appendix_index = next(
        (i for i, (_index, title) in enumerate(headings) if title == 'MACHINE ROUTER'),
        -1,
    )

    smart_line_count: Optional[int] = None
    smart_word_count: Optional[int] = None
    if smart_index != -1:
        start = headings[smart_index][0] + 1
        end = headings[smart_index + 1][0] if smart_index + 1 < len(headings) else len(lines)
        counted = [line for line in lines[start:end] if line.strip() not in ('', '---')]
        smart_line_count = len(counted)
        smart_word_count = sum(len(line.split()) for line in counted)

    appendix = None
    if appendix_index != -1:
        appendix = MachineRouterSection(
            body_from=headings[appendix_index][0] + 1,
            body_to=(
                headings[appendix_index + 1][0]
                if appendix_index + 1 < len(headings)
                else len(lines)
            ),
            is_last=appendix_index == len(headings) - 1,
        )

    return RoutingShape(smart_line_count, machine_block_lines, appendix, smart_word_count)


def load_routing_shape_debt() -> Tuple[int, int, Dict[str, Dict[str, Any]]]:
    """Read the routing-shape known-debt ledger as (line limit, word limit, entries).

    An absent or unreadable ledger means the canon applies to every skill, so a
    broken ledger can only tighten the check, never silently excuse a skill. An
    entry that does not record every count and code the check reads is ignored
    for the same reason.
    """
    path = Path(os.environ.get(ROUTING_SHAPE_DEBT_FILE_ENV) or ROUTING_SHAPE_DEBT_PATH)
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return ROUTING_SHAPE_MAX_LINES, ROUTING_SHAPE_MAX_WORDS, {}
    if not isinstance(data, dict):
        return ROUTING_SHAPE_MAX_LINES, ROUTING_SHAPE_MAX_WORDS, {}

    line_limit = data.get('maxSmartRoutingLines')
    if not isinstance(line_limit, int) or isinstance(line_limit, bool) or line_limit <= 0:
        line_limit = ROUTING_SHAPE_MAX_LINES
    word_limit = data.get('maxSmartRoutingWords')
    if not isinstance(word_limit, int) or isinstance(word_limit, bool) or word_limit <= 0:
        word_limit = ROUTING_SHAPE_MAX_WORDS

    debt: Dict[str, Dict[str, Any]] = {}
    recorded_entries = data.get('debt')
    if isinstance(recorded_entries, dict):
        for key, entry in recorded_entries.items():
            if not isinstance(entry, dict) or set(entry) != {'lines', 'words', 'machineBlocks', 'codes'}:
                continue
            counts = [entry['lines'], entry['words'], entry['machineBlocks']]
            if any(
                not isinstance(count, int) or isinstance(count, bool) or count < 0
                for count in counts
            ):
                continue
            codes = entry['codes']
            if not isinstance(codes, list) or any(
                not isinstance(code, str) or code not in ROUTING_SHAPE_CODES for code in codes
            ):
                continue
            debt[str(key)] = entry
    return line_limit, word_limit, debt


def _fenced_spans(content: str) -> List[Tuple[int, int]]:
    """Return the (start, end) character offsets of every fenced block.

    A fence opens on a run of at least three backticks or tildes and closes only
    on a run of the same character at least as long, so a triple-backtick block
    nested in a four-backtick one stays inner text. The rule is the one the
    section scan applies line by line, because both read the same document and
    must agree on which lines are the skill speaking and which are a sample.
    """
    spans: List[Tuple[int, int]] = []
    fence_char: Optional[str] = None
    fence_run = 0
    fence_from = 0
    offset = 0
    for line in content.split('\n'):
        stripped = line.strip()
        run_char = stripped[:1] if stripped[:1] in ('`', '~') else ''
        run_len = len(stripped) - len(stripped.lstrip(run_char)) if run_char else 0
        if fence_char is not None:
            if run_char == fence_char and run_len >= fence_run and not stripped[run_len:]:
                spans.append((fence_from, offset + len(line)))
                fence_char = None
                fence_run = 0
        elif run_len >= 3:
            fence_char = run_char
            fence_run = run_len
            fence_from = offset
        offset += len(line) + 1
    if fence_char is not None:
        spans.append((fence_from, offset))
    return spans


def _router_file_findings(skill_path: Path) -> List[RoutingShapeFinding]:
    """Return the RS-004 finding when a skill owns no router file of its own.

    Every skill and every mode packet carries a sibling ROUTER.md, so a missing
    file is a router with nowhere to live. A directory, or a file whose real
    path leaves the folder, is not that skill's router either: a link to a
    parent's or a sibling's file would let two skills share one declaration and
    hide which of them never moved.
    """
    router_file = skill_path / ROUTING_SHAPE_ROUTER_FILE
    if not router_file.exists() and not router_file.is_symlink():
        return [RoutingShapeFinding(
            'RS-004',
            f"routing shape RS-004: no sibling {ROUTING_SHAPE_ROUTER_FILE} beside SKILL.md; "
            'every skill and mode packet owns one',
            'missing-router',
        )]
    if not router_file.is_file():
        return [RoutingShapeFinding(
            'RS-004',
            f"routing shape RS-004: sibling {ROUTING_SHAPE_ROUTER_FILE} is not a regular file "
            f'({router_file})',
            'router-structure',
        )]
    resolved = router_file.resolve()
    try:
        resolved.relative_to(skill_path.resolve())
    except ValueError:
        return [RoutingShapeFinding(
            'RS-004',
            f"routing shape RS-004: sibling {ROUTING_SHAPE_ROUTER_FILE} resolves outside "
            f'the skill folder ({resolved})',
            'router-structure',
        )]
    return []


def _unfenced_body_lines(content: str) -> List[str]:
    """Return SKILL.md's body lines outside every fenced block.

    The frontmatter block is not body, and a fenced sample is text rather than
    a link, so neither can place the pointer. The fence spans come from the
    same scan the section parser trusts, so the two agree on what is prose.
    """
    lines = content.split('\n')
    first = 0
    if lines and lines[0].strip() == '---':
        for index in range(1, len(lines)):
            if lines[index].strip() == '---':
                first = index + 1
                break

    body_lines = lines[first:]
    fenced = _fenced_spans('\n'.join(body_lines))
    body: List[str] = []
    offset = 0
    for line in body_lines:
        line_start = offset
        offset += len(line) + 1
        if any(start <= line_start < end for start, end in fenced):
            continue
        body.append(line)
    return body


def _router_pointer_findings(skill_path: Path, content: str) -> List[RoutingShapeFinding]:
    """Return the RS-005 finding when SKILL.md carries no pointer to its router.

    The pointer is a markdown link, on one body line, whose destination is the
    sibling ROUTER.md once a leading "./" and any "#anchor" are stripped. The
    link may sit on a heading line. Nothing weaker counts: prose that merely
    names the file loads it for nobody, an angle-bracketed or titled destination
    is a different target, a label split across lines is not one link, a link in
    the frontmatter is not in the body, and a path through a child folder names
    that folder's file rather than the sibling. The target must also resolve to
    a file inside the skill folder, because a stale path points at nothing.
    """
    named: List[str] = []
    for line in _unfenced_body_lines(content):
        for match in MARKDOWN_LINK_TARGET_RE.finditer(line):
            raw = match.group(1).strip()
            target = raw.split('#', 1)[0]
            if target.startswith('./'):
                target = target[2:]
            if target != ROUTING_SHAPE_ROUTER_FILE:
                continue
            named.append(raw)
            try:
                pointer_target = (skill_path / target).resolve()
                pointer_target.relative_to(skill_path.resolve())
            except (OSError, ValueError):
                continue
            if pointer_target.is_file():
                return []
    if not named:
        return [RoutingShapeFinding(
            'RS-005',
            f'routing shape RS-005: no relative markdown link to the sibling '
            f'{ROUTING_SHAPE_ROUTER_FILE}',
            'pointer',
        )]
    return [RoutingShapeFinding(
        'RS-005',
        f"routing shape RS-005: the link to '{named[0]}' does not resolve to a file "
        'inside the skill folder',
        'pointer',
    )]


def routing_shape_findings(
    shape: RoutingShape,
    limit: int,
    word_limit: int,
    skill_path: Path,
    content: str,
) -> List[RoutingShapeFinding]:
    """Return a finding for each routing-shape rule a skill breaks."""
    findings: List[RoutingShapeFinding] = []

    if shape.smart_line_count is not None and shape.smart_line_count > limit:
        findings.append(RoutingShapeFinding(
            'RS-001',
            f"routing shape RS-001: SMART ROUTING section has {shape.smart_line_count} lines (max {limit})",
            'lines',
        ))

    if shape.smart_word_count is not None and shape.smart_word_count > word_limit:
        findings.append(RoutingShapeFinding(
            'RS-001',
            f"routing shape RS-001: SMART ROUTING section has {shape.smart_word_count} words (max {word_limit})",
            'words',
        ))

    # The router has one home, and it is the sibling file. A section left in
    # SKILL.md is a second declaration whether or not it holds a code block,
    # because a reader that finds the section routes from it while the sibling
    # file stays the declaration the checks trust. A machine block in the
    # routing prose is the same declaration without the heading.
    if shape.appendix is not None:
        findings.append(RoutingShapeFinding(
            'RS-002',
            f"routing shape RS-002: '## MACHINE ROUTER' section at line "
            f"{shape.appendix.body_from} belongs in the sibling {ROUTING_SHAPE_ROUTER_FILE}",
            'trailing-section' if shape.appendix.is_last else 'appendix-order',
        ))

    for line in shape.machine_block_lines:
        index = line - 1
        in_appendix = (
            shape.appendix is not None
            and shape.appendix.body_from <= index < shape.appendix.body_to
        )
        if not in_appendix:
            findings.append(RoutingShapeFinding(
                'RS-002',
                f"routing shape RS-002: machine router block at line {line} is outside any "
                f"'## MACHINE ROUTER' section and belongs in the sibling {ROUTING_SHAPE_ROUTER_FILE}",
                'machine-block',
            ))

    if shape.appendix is not None and not shape.appendix.is_last:
        findings.append(RoutingShapeFinding(
            'RS-003',
            "routing shape RS-003: '## MACHINE ROUTER' is not the last H2 section",
            'appendix-order',
        ))

    findings.extend(_router_file_findings(skill_path))
    findings.extend(_router_pointer_findings(skill_path, content))

    return findings


def _routing_shape_key(skill_path: Path) -> Optional[str]:
    """Return the known-debt key for a skill, or None when it sits outside the skills root.

    The key is the skill's path relative to the skills root, so a folder that
    only shares a debt skill's basename is not read as that skill, and a None
    key never matches a ledger entry.
    """
    override = os.environ.get(ROUTING_SHAPE_SKILLS_ROOT_ENV)
    root = Path(override).resolve() if override else Path(__file__).resolve().parents[3]
    try:
        relative = Path(skill_path).resolve().relative_to(root)
    except ValueError:
        return None
    if relative == Path('.'):
        return None
    return relative.as_posix()


def validate_routing_shape(skill_path: Path, content: str) -> Tuple[bool, str, List[str]]:
    """Check SKILL.md against the routing canon, tolerating recorded known debt.

    A skill recorded in the known-debt ledger keeps the shape it was listed with
    while that shape does not grow: its line and word counts are tolerated up to
    the recorded values. A recorded RS-002 excuses only the router section still
    left at the end of SKILL.md, and a recorded RS-004 only a router file that
    has not moved yet; a machine block in the routing prose or a router outside
    the folder is never that shape. Every other finding is a warning that
    --strict promotes to an error.

    Args:
        skill_path: Path to the skill directory.
        content: Raw SKILL.md file content.

    Returns:
        Tuple of (is_valid, message, warnings). Always valid=True.
    """
    warnings: List[str] = []
    line_limit, word_limit, debt = load_routing_shape_debt()
    key = _routing_shape_key(skill_path)
    shape = parse_routing_shape(content)
    findings = routing_shape_findings(
        shape,
        line_limit,
        word_limit,
        skill_path,
        content,
    )

    entry = debt.get(key) if key is not None else None
    if entry is None:
        warnings.extend(finding.message for finding in findings)
        return True, "Routing shape checked", warnings

    recorded_codes = entry['codes']
    tolerated: List[str] = []
    for finding in findings:
        if finding.code == 'RS-001':
            # RS-001 covers two independent metrics, and the cause names which one.
            is_line_count = finding.cause == 'lines'
            recorded = entry['lines'] if is_line_count else entry['words']
            unit = 'lines' if is_line_count else 'words'
            actual = (shape.smart_line_count if is_line_count else shape.smart_word_count) or 0
            if 'RS-001' in recorded_codes and actual <= recorded:
                tolerated.append(finding.code)
            elif 'RS-001' in recorded_codes:
                warnings.append(
                    f"{finding.message} (grew past its recorded known debt of {recorded} {unit})"
                )
            else:
                warnings.append(f"{finding.message} (not recorded in its known debt)")
            continue

        if finding.code not in recorded_codes:
            warnings.append(f"{finding.message} (not recorded in its known debt)")
            continue

        tolerated_causes = ROUTING_SHAPE_TOLERATED_CAUSES.get(finding.code)
        if tolerated_causes is None or finding.cause in tolerated_causes:
            tolerated.append(finding.code)
        else:
            warnings.append(
                f"{finding.message} ({ROUTING_SHAPE_CAUSE_NOTES[finding.code]})"
            )

    if tolerated:
        unique_codes: List[str] = []
        for code in tolerated:
            if code not in unique_codes:
                unique_codes.append(code)
        warnings.append(
            f"routing shape: known debt, {', '.join(unique_codes)} (migrate to the routing canon)"
        )
    elif not findings:
        warnings.append(f"routing shape: known-debt entry is stale; remove {key}")

    return True, "Routing shape checked", warnings


def _sibling_router_content(skill_path: Path) -> Optional[str]:
    """Return the sibling ROUTER.md text, or None when the skill has no router file."""
    router_file = skill_path / ROUTING_SHAPE_ROUTER_FILE
    if not router_file.is_file():
        return None
    try:
        return router_file.read_text(encoding='utf-8')
    except OSError:
        return None


def validate_smart_router(
    content: str,
    router_content: Optional[str] = None,
) -> Tuple[bool, str, List[str]]:
    """Validate that the routing prose names the smart-router markers.

    Checks for the canonical smart-router resilience markers
    (discover_markdown_resources, _guard_in_skill, UNKNOWN_FALLBACK) per
    skill_smart_router.md. Findings are WARNINGS so router skills using a
    different documented pattern are not hard-failed.

    Args:
        content: Raw SKILL.md file content.
        router_content: Raw sibling ROUTER.md content, when the skill declares
            its router in that file. The pseudocode lives there once the router
            moves out of SKILL.md, so the markers are read from it too.

    Returns:
        Tuple of (is_valid, message, warnings). Always valid=True.
    """
    warnings = []

    # Isolate the SMART ROUTING section body (handles numbered + emoji headers
    # and the combined "SMART ROUTING & REFERENCES" form).
    section_match = re.search(
        r'^##\s+(?:\d+\.\s*)?(?:[\U0001F300-\U0001F9FF]\s*)?SMART ROUTING'
        r'.*?\n(.*?)(?=\n##\s|\Z)',
        content,
        re.DOTALL | re.IGNORECASE | re.MULTILINE,
    )
    if not section_match:
        # A heading that only CONTAINS "SMART ROUTING" (e.g. "When To Use + Smart
        # Routing") satisfies validate_sections' substring test but hides the router
        # from the start-anchored extraction above, so the marker check below would be
        # skipped. Flag the non-standalone heading instead of passing silently.
        merged = re.search(r'^##\s+.*SMART ROUTING', content, re.IGNORECASE | re.MULTILINE)
        if merged:
            warnings.append(
                "SMART ROUTING must be its own H2 section; found it merged into "
                "another heading (split into a standalone '## SMART ROUTING')"
            )
            return True, "SMART ROUTING heading is not standalone", warnings
        # Truly absent — validate_sections() already errors on a missing section.
        return True, "No SMART ROUTING section to validate", warnings

    section_body = section_match.group(1)
    # A machine router may live in the final appendix of an unmoved skill or in
    # the sibling ROUTER.md, so the markers are searched across the routing
    # prose, that appendix body and the router document.
    appendix = parse_routing_shape(content).appendix
    if appendix is not None:
        lines = content.split('\n')
        section_body = section_body + '\n' + '\n'.join(lines[appendix.body_from:appendix.body_to])
    if router_content:
        section_body = section_body + '\n' + router_content
    missing = [marker for marker in SMART_ROUTER_MARKERS if marker not in section_body]
    if missing:
        warnings.append(
            f"SMART ROUTING section missing smart-router marker(s): "
            f"{', '.join(missing)} (see skill_smart_router.md pseudocode)"
        )

    return True, "Smart router checked", warnings


def validate_name_matches_folder(skill_path: Path, parsed_frontmatter: Dict[str, str]) -> Tuple[bool, str, List[str]]:
    """Validate that frontmatter 'name' matches the folder name per skill_md_template.md.

    Args:
        skill_path: Path to the skill directory.
        parsed_frontmatter: Dict of parsed frontmatter key-value pairs.

    Returns:
        Tuple of (is_valid, error_message, warnings).
    """
    warnings = []
    
    folder_name = skill_folder_id(skill_path)
    frontmatter_name = parsed_frontmatter.get('name', '')
    
    if folder_name != frontmatter_name:
        named = 'kebab-case folder name' if folder_name != skill_path.name else 'folder name'
        return False, f"Frontmatter name '{frontmatter_name}' must match {named} '{folder_name}'", warnings
    
    return True, "Name matches folder", warnings


def _partition_strict(warnings: List[str]) -> Tuple[List[str], List[str]]:
    """Split strict contract findings from advisory warnings."""
    promoted = []
    advisory = []

    for warning in warnings:
        target = promoted if any(marker in warning for marker in STRICT_PROMOTED_MARKERS) else advisory
        target.append(warning)

    return promoted, advisory


def validate_skill(skill_path: Path, strict: bool = False) -> Tuple[bool, str, List[str]]:
    """Comprehensive skill validation aligned with all skill creation documentation.

    Args:
        skill_path: Path to the skill directory.
        strict: Promote contract-required warnings to validation errors.

    Returns:
        Tuple of (is_valid, message, warnings).
    """
    skill_path = Path(skill_path)
    all_warnings = []
    skill_md = skill_path / 'SKILL.md'

    repo_paths = repo_root_paths(skill_path)
    unsupported_roots = [
        root for root in find_unsupported_root_dirs(skill_path)
        if root.relative_to(skill_path).parts[0] not in repo_paths
    ]
    if unsupported_roots:
        return False, f"Unsupported catalog/playbook root: {unsupported_roots[0]}", all_warnings

    if not skill_md.exists():
        return False, "SKILL.md not found", all_warnings

    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"Failed to read SKILL.md: {str(e)}", all_warnings

    is_surface = get_packet_kind(content) == 'surface'
    # A hub root describes every mode it routes to, so its description carries a
    # whole family rather than one skill's purpose. The soft target is sized for
    # a standalone skill; the hard cap still applies to both.
    is_hub = (skill_path / 'mode-registry.json').is_file()

    valid, message, warnings, parsed = validate_frontmatter(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_name_matches_folder(skill_path, parsed)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    # Surface packets bundle a hub sub-surface and use a surface-shaped section
    # layout, not the standalone create-skill section / RULES contract.
    if not is_surface:
        valid, message, warnings = validate_sections(content, is_hub=is_hub)
        all_warnings.extend(warnings)
        if not valid:
            return False, message, all_warnings

        valid, message, warnings = validate_rules_section(content)
        all_warnings.extend(warnings)
        if not valid:
            return False, message, all_warnings

    valid, message, warnings = validate_content_size(content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_resources(skill_path)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    valid, message, warnings = validate_generated_paths(skill_path)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    # Resource-doc frontmatter contract (5-field block + 4-part version) and
    # smart-router markers. Emitted as warnings (see VERSION_DOC_SUBTREES
    # comment) so the hardened contract does not break validation repo-wide.
    valid, message, warnings = validate_resource_frontmatter(skill_path)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    # A hub delegates routing to its root ROUTER.md, the stage-two control
    # document enforced by the root-router contract, so its SKILL.md carries no
    # inline discovery pseudocode to find. Every other skill is checked, and a
    # skill that moved its router to its own ROUTER.md is checked through that
    # file, where the pseudocode now lives.
    routes_via_root_router = (
        is_hub and (skill_path / ROUTING_SHAPE_ROUTER_FILE).is_file()
    )
    if not is_surface and not routes_via_root_router:
        valid, message, warnings = validate_smart_router(
            content, _sibling_router_content(skill_path)
        )
        all_warnings.extend(warnings)
        if not valid:
            return False, message, all_warnings

    # The routing canon binds every skill kind: a hub root, a mode packet, a
    # surface packet and a standalone skill each keep their routing prose short,
    # own a sibling ROUTER.md and point SKILL.md at it.
    valid, message, warnings = validate_routing_shape(skill_path, content)
    all_warnings.extend(warnings)
    if not valid:
        return False, message, all_warnings

    if strict:
        promoted, advisory = _partition_strict(all_warnings)
        if is_surface or is_hub:
            # Surface and hub descriptions bundle a whole sub-surface or mode
            # family; the 130-char soft target is a standalone-skill target, so
            # keep it advisory here.
            advisory = advisory + [p for p in promoted if 'exceeds soft target' in p]
            promoted = [p for p in promoted if 'exceeds soft target' not in p]
        if promoted:
            return (
                False,
                f"Strict mode: {len(promoted)} contract requirement(s) unmet — "
                + "; ".join(promoted),
                advisory,
            )

    return True, "Skill is valid!", all_warnings


# ───────────────────────────────────────────────────────────────
# 3. PACKAGING FUNCTIONS
# ───────────────────────────────────────────────────────────────

def package_skill(skill_path_str: str, output_dir: Optional[str] = None) -> Optional[Path]:
    """Package a skill folder into a zip file.

    Args:
        skill_path_str: Path to the skill folder.
        output_dir: Optional output directory for the zip file (defaults to cwd).

    Returns:
        Path to the created zip file, or None on error.
    """
    skill_path = Path(skill_path_str).resolve()

    if not skill_path.exists():
        print(f"❌ Error: Skill folder not found: {skill_path}")
        return None

    if not skill_path.is_dir():
        print(f"❌ Error: Path is not a directory: {skill_path}")
        return None

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        print(f"❌ Error: SKILL.md not found in {skill_path}")
        return None

    print("🔍 Validating skill against creation standards...")
    valid, message, warnings = validate_skill(skill_path, strict=True)

    if not valid:
        print(f"❌ Validation failed: {message}")
        print("   Please fix the validation errors before packaging.")
        return None

    print(f"✅ {message}")

    if warnings:
        print(f"\n⚠️  {len(warnings)} warning(s):")
        for warning in warnings:
            print(f"   • {warning}")
        print()

    skill_name = skill_path.name
    if output_dir:
        output_path = Path(output_dir).resolve()
        output_path.mkdir(parents=True, exist_ok=True)
    else:
        output_path = Path.cwd()

    zip_filename = output_path / f"{skill_name}.zip"

    try:
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zip_resolved = zip_filename.resolve()
            repo_paths = repo_root_paths(skill_path)
            file_count = 0
            for file_path in skill_path.rglob('*'):
                if file_path.is_file():
                    # An in-tree output archive would recursively package its partial contents.
                    if file_path.resolve() == zip_resolved:
                        continue

                    rel_parts = file_path.relative_to(skill_path).parts
                    # A repo-root hub ships the skill, not the repository around it.
                    if rel_parts[0] in repo_paths:
                        continue
                    # Hidden ancestors and cache directories contain non-distributable files.
                    if any(part.startswith('.') or part == '__pycache__' for part in rel_parts):
                        continue
                    if file_path.suffix in ['.pyc', '.pyo']:
                        continue

                    arcname = file_path.relative_to(skill_path.parent)
                    zipf.write(file_path, arcname)
                    print(f"  📄 Added: {arcname}")
                    file_count += 1

        print(f"\n✅ Successfully packaged {file_count} files to: {zip_filename}")
        return zip_filename

    except OSError as e:
        print(f"❌ Error creating zip file: {e}")
        return None


def check_only(skill_path_str: str, strict: bool = False) -> bool:
    """Validate a skill without packaging.

    Args:
        skill_path_str: Path to the skill folder.
        strict: Promote contract-required warnings to validation errors.

    Returns:
        True if valid, False otherwise.
    """
    skill_path = Path(skill_path_str).resolve()
    
    if not skill_path.exists():
        print(f"❌ Error: Skill folder not found: {skill_path}")
        return False
    
    if not skill_path.is_dir():
        print(f"❌ Error: Path is not a directory: {skill_path}")
        return False
    
    print(f"🔍 Validating skill: {skill_path.name}")
    if strict:
        print("(strict mode)")
    print("=" * 50)
    
    valid, message, warnings = validate_skill(skill_path, strict=strict)
    
    if valid:
        print(f"\n✅ {message}")
    else:
        print(f"\n❌ {message}")
    
    if warnings:
        print(f"\n⚠️  {len(warnings)} warning(s):")
        for warning in warnings:
            print(f"   • {warning}")
    
    print("\n" + "=" * 50)
    print(f"Result: {'PASS' if valid else 'FAIL'}")
    
    return valid


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """CLI entry point for skill packaging."""
    parser = argparse.ArgumentParser(
        description="Validate and optionally package a skill folder into a zip archive."
    )
    parser.add_argument(
        'skill_path',
        help="Path to the skill folder",
    )
    parser.add_argument(
        'output_dir',
        nargs='?',
        default=None,
        help="Optional output directory for the zip package",
    )
    parser.add_argument(
        '--check',
        action='store_true',
        help="Validate only; do not create a package",
    )
    parser.add_argument(
        '--json',
        dest='json_mode',
        action='store_true',
        help="Output validation results as JSON",
    )
    parser.add_argument(
        '--strict',
        action='store_true',
        help="Under --check/--json, promote contract-required warnings to errors",
    )
    args = parser.parse_args()

    check_mode = args.check
    json_mode = args.json_mode
    skill_path = args.skill_path
    output_dir = args.output_dir

    if json_mode:
        skill_path_obj = Path(skill_path).resolve()
        if not skill_path_obj.exists() or not skill_path_obj.is_dir():
            print(json.dumps({
                'valid': False,
                'message': f'Skill folder not found or not a directory: {skill_path}',
                'warnings': [],
                'path': str(skill_path_obj)
            }, indent=2))
            sys.exit(1)

        valid, message, warnings = validate_skill(skill_path_obj, strict=args.strict)
        print(json.dumps({
            'valid': valid,
            'message': message,
            'warnings': warnings,
            'path': str(skill_path_obj)
        }, indent=2))
        sys.exit(0 if valid else 1)

    elif check_mode:
        result = check_only(skill_path, strict=args.strict)
        sys.exit(0 if result else 1)

    else:
        print(f"📦 Packaging skill: {skill_path}")
        if output_dir:
            print(f"   Output directory: {output_dir}")
        print()

        result = package_skill(skill_path, output_dir)
        sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
