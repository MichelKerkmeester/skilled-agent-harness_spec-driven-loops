#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README AUDIT (SK-DOC)
# ───────────────────────────────────────────────────────────────

"""
README Audit (Template Alignment + Freshness Drift)

Implements a deterministic README audit for:
1) sk-doc template alignment (via validate_document.py)
2) Freshness checks (broken references + key artifact coverage drift)

Scope rules:
- Include:
    - repo-root README.md
    - README files below .opencode, .claude, .pi, .github and scripts
- Exclude any path containing:
    - /z_archive/
    - /context/
    - /vendored/
    - /node_modules/
    - generated output, fixture payloads, parent-documented single-file zones
      and designated equivalent-orientation folders

Durable-directory discovery walks the same roots without following symlinks. A
manifest records the derived directories and the auditor compares a supplied
frozen manifest with a fresh derivation before reporting gaps.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import unquote


EXCLUDE_SEGMENTS = {"z_archive", "context", "vendored", "node_modules"}
SKIP_COVERAGE_SEGMENTS = {"templates", "examples"}
DURABLE_ROOT_NAMES = (".", ".opencode", ".claude", ".pi", ".github", "scripts")
DURABLE_FILE_EXTENSIONS = {
    ".bash", ".cjs", ".css", ".go", ".html", ".js", ".json", ".mjs", ".ps1",
    ".py", ".rs", ".scss", ".sh", ".sql", ".swift", ".toml", ".ts", ".tsx",
    ".txt", ".yaml", ".yml",
}
MANIFEST_BASELINE_COUNT = 501
MANIFEST_SCHEMA = 1

DISPOSITION_PATH_CLASSES = (
    "fixture_payload",
    "fixture_payload_positive",
    "benchmark_fixture",
    "equivalent_orientation",
    "parent_documented_tests",
    "parent_documented_single_file",
    "parent_documented_workspace",
    "parent_documented_hooks_lib",
    "parent_documented_hooks_pi_lib",
    "parent_documented_workspace_lib",
    "fixture_owned_readme",
    "generated_output",
    "generated_compiled_routing",
    "generated_archive",
    "self_documenting_script",
    "single_file_zone",
    "test_fixture_readme",
    "benchmark_seed",
    "benchmark_seed_src",
    "benchmark_seed_utils",
    "equivalent_sync_orientation",
)
MANIFEST_EXCLUDED_SEGMENTS = {".git", ".opencode/specs"}

KEY_ARTIFACTS_FILES = ("package.json", "SKILL.md")
KEY_ARTIFACTS_DIRS = ("scripts", "lib", "src", "handlers", "tools", "tests", "configs", "templates")

URL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:")

MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
INLINE_CODE_RE = re.compile(r"`([^`]+)`")

ALLOWED_LINK_EXTENSIONS = {
    ".md", ".py", ".sh", ".ts", ".tsx", ".js", ".mjs", ".cjs",
    ".json", ".yaml", ".yml", ".toml", ".sql", ".txt", ".html", ".css",
}
IMPLICIT_EXTENSIONS = (".md", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".sh", ".py")
INDEX_FILES = ("README.md", "index.ts", "index.tsx", "index.js", "index.mjs", "index.cjs")

SPECIAL_FILENAMES = {"package.json", "skill.md", "readme.md"}
PATH_PREFIX_HINTS = (
    "./", "../", ".opencode/", "specs/",
)
COMMAND_STYLE_PREFIXES = ("/anchor", "/memory:", "/speckit:", "/create:", "/docs:", "/mcp:")
TREE_GLYPHS = ("├", "└", "│", "──")


@dataclass(frozen=True)
class Finding:
    priority: str
    category: str
    file: str
    rule_type: str
    evidence: str
    remediation: str


def path_contains_excluded_segment(path: Path) -> bool:
    parts = {part.lower() for part in path.parts}
    return bool(parts & EXCLUDE_SEGMENTS)


def in_skip_coverage_bucket(path: Path) -> bool:
    parts = {part.lower() for part in path.parts}
    return bool(parts & SKIP_COVERAGE_SEGMENTS)


def _relative_path(repo_root: Path, path: Path) -> Path:
    try:
        return path.resolve().relative_to(repo_root.resolve())
    except ValueError:
        return path


def _path_text(path: Path) -> str:
    return str(path).replace('\\', '/').strip('/').lower()


def _orientation_has_overview_and_inventory(path: Path) -> bool:
    """Require an Overview and non-empty follow-on orientation section."""
    try:
        content = path.read_text(encoding='utf-8', errors='replace')
    except OSError:
        return False

    headings = list(re.finditer(r'(?im)^(#{1,2})\s+(.+?)\s*$', content))
    overview_index = next(
        (
            index
            for index, heading in enumerate(headings)
            if re.match(r'(?i)^(?:\d+[.)]\s*)?overview\b', heading.group(2).strip())
        ),
        None,
    )
    if overview_index is None:
        return False

    following_heading = next(iter(headings[overview_index + 1:]), None)
    if following_heading is None:
        return False
    body_start = following_heading.end()
    body_end = len(content)
    for following in headings:
        if following.start() > following_heading.start() and len(following.group(1)) <= len(following_heading.group(1)):
            body_end = following.start()
            break
    return bool(content[body_start:body_end].strip())


def classify_path(repo_root: Path, path: Path) -> Optional[str]:
    """Return a named exclusion class for a durable path, if one applies."""
    relative = _relative_path(repo_root, path)
    text = _path_text(relative)
    parts = set(relative.parts)

    if text.startswith('.opencode/specs') or '.opencode/specs/' in text:
        return 'generated_output'
    if any(segment in parts for segment in EXCLUDE_SEGMENTS):
        return 'excluded_path_segment'

    marker_classes = {
        'fixture-payload-positive': 'fixture_payload_positive',
        'fixture-payload': 'fixture_payload',
        'benchmark-fixture': 'benchmark_fixture',
        'benchmark-seed-src': 'benchmark_seed_src',
        'benchmark-seed-utils': 'benchmark_seed_utils',
        'benchmark-seed': 'benchmark_seed',
        'fixture-owned-readme': 'fixture_owned_readme',
        'generated-compiled-routing': 'generated_compiled_routing',
        'generated-archive': 'generated_archive',
        'generated-output': 'generated_output',
        'equivalent-sync-orientation': 'equivalent_sync_orientation',
        'equivalent-orientation': 'equivalent_orientation',
        'parent-documented-tests': 'parent_documented_tests',
        'parent-documented-hooks-lib': 'parent_documented_hooks_lib',
        'parent-documented-hooks-pi-lib': 'parent_documented_hooks_pi_lib',
        'parent-documented-workspace-lib': 'parent_documented_workspace_lib',
        'parent-documented-workspace': 'parent_documented_workspace',
        'single-file-zone': 'single_file_zone',
        'self-documenting-script': 'self_documenting_script',
        'test-fixture-readme': 'test_fixture_readme',
    }
    for marker, class_name in marker_classes.items():
        if marker in text:
            return class_name

    if 'compiled-routing' in text:
        return 'generated_compiled_routing'
    if 'runs-archive' in text:
        return 'generated_archive'
    if 'fixtures' in parts or 'fixture' in parts:
        return 'fixture_payload'
    if 'seed' in parts:
        return 'benchmark_seed'
    if 'benchmarks' in parts and ('eval' in parts or 'fixtures' in parts):
        return 'benchmark_fixture'
    if relative.name.lower() == 'sync.md' and '.claude' in parts:
        if _orientation_has_overview_and_inventory(path):
            return 'equivalent_orientation'
        return None
    if relative.name.lower() == 'readme.md' and 'fix-006-adversarial-path-traversal' in parts:
        return 'fixture_owned_readme'
    if any(relative.parts[index:index + 2] == ('scripts', 'tests') for index in range(max(0, len(relative.parts) - 5), len(relative.parts) - 1)):
        return 'parent_documented_tests'
    if relative.parts[-2:] == ('hooks', 'lib'):
        return 'parent_documented_hooks_lib'
    if relative.parts[-3:] == ('hooks', 'pi', 'lib'):
        return 'parent_documented_hooks_pi_lib'
    return None


def _is_durable_file(name: str) -> bool:
    path = Path(name)
    return path.name not in {'README.md', 'readme.md'} and (
        path.suffix.lower() in DURABLE_FILE_EXTENSIONS
        or path.name in {'Dockerfile', 'Makefile', 'SKILL.md'}
    )


def _walk_roots(repo_root: Path) -> Iterable[Tuple[Path, List[str], List[str]]]:
    roots = [repo_root]
    roots.extend(repo_root / name for name in DURABLE_ROOT_NAMES)
    seen: Set[str] = set()
    for root in roots:
        if not root.exists() or not root.is_dir():
            continue
        if root == repo_root:
            real = str(root.resolve()).lower()
            if real in seen:
                continue
            seen.add(real)
            filenames = [item.name for item in root.iterdir() if item.is_file() and not item.is_symlink()]
            yield root, [], filenames
            continue
        for directory, dirnames, filenames in os.walk(root, topdown=True, followlinks=False):
            directory_path = Path(directory)
            real = str(directory_path.resolve()).lower()
            if real in seen:
                dirnames[:] = []
                continue
            seen.add(real)
            dirnames[:] = [
                name for name in dirnames
                if not (directory_path / name).is_symlink()
                and name not in {'.git', 'node_modules', '__pycache__', '.pytest_cache', 'dist', 'build'}
            ]
            yield directory_path, dirnames, filenames


def build_durable_manifest(repo_root: Path) -> Dict[str, Any]:
    """Derive the durable-directory set from the current repository tree."""
    directories: Set[str] = set()
    for directory, _dirnames, filenames in _walk_roots(repo_root):
        relative = _relative_path(repo_root, directory)
        if classify_path(repo_root, directory):
            continue
        if relative.parts and relative.parts[0] == '.opencode' and len(relative.parts) > 1 and relative.parts[1] == 'specs':
            continue
        durable_files = [name for name in filenames if _is_durable_file(name)]
        has_readme = any(name.lower() == 'readme.md' for name in filenames)
        if len(durable_files) >= 5 or has_readme:
            directories.add('.' if str(relative) == '.' else relative.as_posix())

    ordered = sorted(directories)
    orientation_files = []
    sync_path = repo_root / '.claude' / 'SYNC.md'
    if sync_path.is_file() and _orientation_has_overview_and_inventory(sync_path):
        orientation_files.append({
            'directory': '.claude',
            'file': '.claude/SYNC.md',
            'class': 'equivalent_orientation',
        })
    return {
        'schema': MANIFEST_SCHEMA,
        'baseline_prose_count': MANIFEST_BASELINE_COUNT,
        'derived_count': len(ordered),
        'roots': list(DURABLE_ROOT_NAMES),
        'directories': ordered,
        'equivalent_orientations': orientation_files,
    }


def load_manifest(path: Path) -> Dict[str, Any]:
    data = json.loads(path.read_text(encoding='utf-8'))
    directories = data.get('directories') if isinstance(data, dict) else data
    if not isinstance(directories, list) or not all(isinstance(item, str) for item in directories):
        raise ValueError(f'Invalid durable-directory manifest: {path}')
    if isinstance(data, list):
        data = {'schema': MANIFEST_SCHEMA, 'directories': directories}
    data['directories'] = sorted(set(directories))
    return data


def manifest_reproduction(repo_root: Path, manifest_path: Optional[Path] = None) -> Dict[str, Any]:
    derived = build_durable_manifest(repo_root)
    if manifest_path is None:
        return {
            'manifest_path': None,
            'derived_count': derived['derived_count'],
            'baseline_prose_count': MANIFEST_BASELINE_COUNT,
            'raw_candidate_set_reproduced': True,
            'delta_from_baseline': derived['derived_count'] - MANIFEST_BASELINE_COUNT,
            'directories': derived['directories'],
            'exclusions': [],
            'gaps': [],
        }

    frozen = load_manifest(manifest_path)
    frozen_set = set(frozen['directories'])
    derived_set = set(derived['directories'])
    raw_candidate_set_reproduced = frozen_set == derived_set
    exclusions: List[Dict[str, str]] = []
    gaps: List[str] = []
    for orientation in frozen.get('equivalent_orientations', []):
        orientation_file = repo_root / str(orientation.get('file', ''))
        if _orientation_has_overview_and_inventory(orientation_file):
            exclusions.append({
                'directory': str(orientation.get('directory', '')),
                'class': str(orientation.get('class', 'equivalent_orientation')),
                'orientation_file': str(orientation.get('file', '')),
            })
    for directory in sorted(frozen_set):
        directory_path = repo_root / directory
        readme_exists = any((directory_path / name).is_file() for name in ('README.md', 'readme.md'))
        if readme_exists:
            continue
        exclusion = classify_path(repo_root, directory_path)
        if exclusion:
            exclusions.append({'directory': directory, 'class': exclusion})
        elif (
            (directory_path / 'SYNC.md').is_file()
            and _orientation_has_overview_and_inventory(directory_path / 'SYNC.md')
        ):
            exclusions.append({'directory': directory, 'class': 'equivalent_orientation'})
        else:
            gaps.append(directory)
    return {
        'manifest_path': str(manifest_path),
        'derived_count': derived['derived_count'],
        'frozen_count': len(frozen_set),
        'baseline_prose_count': frozen.get('baseline_prose_count', MANIFEST_BASELINE_COUNT),
        'delta_from_baseline': len(frozen_set) - MANIFEST_BASELINE_COUNT,
        'raw_candidate_set_reproduced': raw_candidate_set_reproduced,
        'directories': sorted(frozen_set),
        'exclusions': exclusions,
        'gaps': gaps,
        'equivalent_orientations': frozen.get('equivalent_orientations', []),
        'added_since_frozen': sorted(derived_set - frozen_set),
        'removed_since_frozen': sorted(frozen_set - derived_set),
    }


def normalize_reference_token(raw: str, source: str) -> Optional[str]:
    token = raw.strip().strip("\"'`<>")
    if not token:
        return None

    if source != "markdown_link" and " " in token:
        token = token.split(" ", 1)[0].strip("\"'")

    token = token.lstrip("(").rstrip(")")
    token = token.split("#", 1)[0].split("?", 1)[0].strip()
    token = unquote(token)
    token = token.rstrip(".,;:\"')")

    if not token:
        return None

    lower = token.lower()
    if "](" in token or "[/" in token:
        return None
    if "," in token:
        return None
    if any(glyph in token for glyph in TREE_GLYPHS):
        return None
    if token.startswith("#"):
        return None
    if lower.startswith(URL_PREFIXES):
        return None
    if token.startswith("file://"):
        token = token.replace("file://", "", 1)
        lower = token.lower()

    if "$" in token:
        return None
    if "<" in token or ">" in token:
        return None
    if token in {".js", ".ts", ".md", ".json", ".yaml", ".yml"}:
        return None
    if token.startswith("...") or token.endswith("..."):
        return None

    if "*" in token or "?" in token:
        return None
    if token.startswith("{") or token.endswith("}"):
        return None

    return token


def token_looks_like_path(token: str, source: str) -> bool:
    lower = token.lower()
    if lower.startswith(COMMAND_STYLE_PREFIXES):
        return False

    if token.startswith("~"):
        return False

    if token.startswith("./") or token.startswith("../"):
        return True
    if lower.startswith(".opencode/") or lower.startswith("specs/"):
        return True
    if token.startswith("/"):
        if lower.startswith("/.opencode/") or lower.startswith("/specs/"):
            return True
        suffix = Path(token).suffix.lower()
        return bool(suffix and suffix in ALLOWED_LINK_EXTENSIONS)

    if lower in SPECIAL_FILENAMES:
        return source in {"markdown_link", "tree_line"}

    if lower.startswith("tsconfig") and lower.endswith(".json"):
        return source in {"markdown_link", "tree_line"}

    if "/" in token:
        if token.endswith("/"):
            parts = [p for p in token.split("/") if p]
            if source == "inline_code":
                return (
                    token.startswith("./")
                    or token.startswith("../")
                    or lower.startswith(".opencode/")
                    or lower.startswith("specs/")
                )
            if source == "tree_line":
                return (
                    len(parts) >= 2
                    or token.startswith("./")
                    or token.startswith("../")
                    or lower.startswith(".opencode/")
                    or lower.startswith("specs/")
                )
            return token.startswith(PATH_PREFIX_HINTS)
        if source == "inline_code" and not (
            token.startswith("./")
            or token.startswith("../")
            or lower.startswith(".opencode/")
            or lower.startswith("specs/")
        ):
            return False
        if token.startswith(PATH_PREFIX_HINTS):
            return True
        return Path(token).suffix.lower() in ALLOWED_LINK_EXTENSIONS

    if source == "markdown_link":
        suffix = Path(token).suffix.lower()
        if suffix in ALLOWED_LINK_EXTENSIONS:
            return True

    return False


def extract_references(content: str) -> Set[str]:
    refs: Set[str] = set()

    def maybe_add(raw_token: str, source: str) -> None:
        token = normalize_reference_token(raw_token, source)
        if token and token_looks_like_path(token, source):
            refs.add(token)

    for raw in MARKDOWN_LINK_RE.findall(content):
        maybe_add(raw, "markdown_link")

    for raw_code in INLINE_CODE_RE.findall(content):
        for part in raw_code.split():
            maybe_add(part, "inline_code")

    for line in content.splitlines():
        if any(glyph in line for glyph in TREE_GLYPHS):
            cleaned = (
                line
                .replace("├──", " ")
                .replace("└──", " ")
                .replace("│", " ")
            )
            for part in re.split(r"\s+", cleaned):
                maybe_add(part, "tree_line")

    return refs


def resolve_reference_candidates(readme_path: Path, repo_root: Path, ref: str) -> List[Path]:
    raw = ref.strip()
    p = Path(raw)
    candidates: List[Path] = []

    def add_with_expansions(base: Path, original: str) -> None:
        candidates.append(base)

        has_trailing_slash = original.endswith("/")
        if has_trailing_slash:
            for index in INDEX_FILES:
                candidates.append(base / index)
            return

        if base.suffix:
            return

        for ext in IMPLICIT_EXTENSIONS:
            candidates.append(Path(f"{base}{ext}"))
        for index in INDEX_FILES:
            candidates.append(base / index)

    if p.is_absolute():
        add_with_expansions(p, raw)
        seen: Set[str] = set()
        uniq: List[Path] = []
        for candidate in candidates:
            key = str(candidate)
            if key not in seen:
                seen.add(key)
                uniq.append(candidate)
        return uniq

    add_with_expansions((readme_path.parent / p).resolve(), raw)
    add_with_expansions((repo_root / p).resolve(), raw)

    seen: Set[str] = set()
    uniq: List[Path] = []
    for candidate in candidates:
        key = str(candidate)
        if key not in seen:
            seen.add(key)
            uniq.append(candidate)
    return uniq


def classify_reference_status(readme_path: Path, repo_root: Path, ref: str) -> Tuple[bool, List[str]]:
    if ref.startswith("~"):
        return True, ["external_home_path_skipped"]

    parsed = Path(ref)
    if parsed.is_absolute():
        resolved = parsed.resolve()
        try:
            resolved.relative_to(repo_root)
        except ValueError:
            return True, ["external_absolute_path_skipped"]

    candidates = resolve_reference_candidates(readme_path, repo_root, ref)
    for candidate in candidates:
        if candidate.exists():
            return True, [str(candidate)]
    return False, [str(c) for c in candidates]


def find_readmes(repo_root: Path) -> List[Path]:
    """Find README files below every durable root without following symlinks."""
    readmes_by_realpath: Dict[str, Path] = {}
    for directory, _dirnames, filenames in _walk_roots(repo_root):
        relative = _relative_path(repo_root, directory)
        if relative.parts and relative.parts[0] == '.opencode' and len(relative.parts) > 1 and relative.parts[1] == 'specs':
            continue
        if classify_path(repo_root, directory):
            continue
        for filename in filenames:
            if filename.lower() != 'readme.md':
                continue
            path = directory / filename
            if not path.is_file() or path.is_symlink():
                continue
            real = path.resolve()
            key = str(real).lower()
            if key not in readmes_by_realpath:
                readmes_by_realpath[key] = real
    return sorted(readmes_by_realpath.values(), key=lambda p: str(_relative_path(repo_root, p)).lower())


def run_template_validation(validator: Path, repo_root: Path, readme: Path, document_type: str = 'readme') -> Dict[str, Any]:
    cmd = ["python3", str(validator), str(readme), "--type", document_type, "--json"]
    proc = subprocess.run(cmd, cwd=repo_root, capture_output=True, text=True, check=False)
    out = (proc.stdout or "").strip()
    if not out:
        return {
            "valid": False,
            "blocking_errors": [
                {
                    "type": "validator_no_output",
                    "message": "Validator returned no output.",
                    "line": "?",
                }
            ],
            "warnings": [],
            "raw_stderr": (proc.stderr or "").strip(),
            "return_code": proc.returncode,
        }
    try:
        parsed = json.loads(out)
    except json.JSONDecodeError:
        return {
            "valid": False,
            "blocking_errors": [
                {
                    "type": "validator_parse_error",
                    "message": "Validator output was not valid JSON.",
                    "line": "?",
                }
            ],
            "warnings": [],
            "raw_stdout": out,
            "raw_stderr": (proc.stderr or "").strip(),
            "return_code": proc.returncode,
        }

    return {
        "valid": bool(parsed.get("valid", False)),
        "blocking_errors": parsed.get("blocking_errors", []) or [],
        "warnings": parsed.get("warnings", []) or [],
        "return_code": proc.returncode,
    }


def artifact_presence(directory: Path) -> Dict[str, bool]:
    result: Dict[str, bool] = {}
    result["package.json"] = (directory / "package.json").is_file()
    result["tsconfig*.json"] = any(directory.glob("tsconfig*.json"))
    result["SKILL.md"] = (directory / "SKILL.md").is_file()
    for name in KEY_ARTIFACTS_DIRS:
        result[f"{name}/"] = (directory / name).is_dir()
    return result


def artifact_mentioned(content: str, refs: Set[str], key: str) -> bool:
    lower = content.lower()
    normalized_refs = {r.lower() for r in refs}

    if key == "package.json":
        return "package.json" in lower or any(Path(r).name == "package.json" for r in normalized_refs)

    if key == "SKILL.md":
        return "skill.md" in lower or any(Path(r).name == "skill.md" for r in normalized_refs)

    if key == "tsconfig*.json":
        if "tsconfig" in lower:
            return True
        for r in normalized_refs:
            name = Path(r).name
            if name.startswith("tsconfig") and name.endswith(".json"):
                return True
        return False

    if key.endswith("/"):
        dirname = key[:-1].lower()
        if f"{dirname}/" in lower:
            return True
        if re.search(rf"(^|[^a-z0-9_]){re.escape(dirname)}([^a-z0-9_]|$)", lower):
            return True
        for r in normalized_refs:
            parts = [part.lower() for part in Path(r).parts if part not in (".", "..")]
            if dirname in parts:
                return True
        return False

    return False


def generate_findings(
    repo_root: Path,
    per_file: List[Dict[str, Any]],
) -> List[Finding]:
    findings: List[Finding] = []

    for item in per_file:
        rel_file = item["file"]

        for error in item["blocking_errors"]:
            findings.append(
                Finding(
                    priority="P1",
                    category="Template Violations",
                    file=rel_file,
                    rule_type=str(error.get("type", "blocking_error")),
                    evidence=str(error.get("message", "Blocking template error")),
                    remediation="Update README structure/content to satisfy sk-doc readme validator blocking rules.",
                )
            )

        for warning in item["warnings"]:
            findings.append(
                Finding(
                    priority="P2",
                    category="Template Warnings",
                    file=rel_file,
                    rule_type=str(warning.get("type", "warning")),
                    evidence=str(warning.get("message", "Template warning")),
                    remediation="Update README to address sk-doc readme warning.",
                )
            )

        for broken in item["broken_references"]:
            checked_paths = broken.get("checked_paths", [])
            if isinstance(checked_paths, list):
                shown = checked_paths[:3]
                suffix = f" ... (+{len(checked_paths) - 3} more)" if len(checked_paths) > 3 else ""
                checked_display = " | ".join(shown) + suffix
            else:
                checked_display = str(checked_paths)
            findings.append(
                Finding(
                    priority="P1",
                    category="Freshness Drift (broken refs)",
                    file=rel_file,
                    rule_type="broken_reference",
                    evidence=f"Reference `{broken['reference']}` did not resolve ({checked_display}).",
                    remediation="Repair the reference target path or remove outdated reference.",
                )
            )

        for missing in item["missing_key_artifacts"]:
            findings.append(
                Finding(
                    priority="P2",
                    category="Coverage Drift (missing key artifacts)",
                    file=rel_file,
                    rule_type="missing_key_artifact_mention",
                    evidence=f"Directory contains `{missing}` but README does not mention it.",
                    remediation="Add or update a structure/overview section to include this artifact.",
                )
            )

    return findings


def render_markdown_report(
    repo_root: Path,
    inventory_file: Path,
    findings: List[Finding],
    per_file: List[Dict[str, Any]],
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    total = len(per_file)
    valid = sum(1 for x in per_file if x["template_status"] == "valid")
    invalid = total - valid
    p1 = [f for f in findings if f.priority == "P1"]
    p2 = [f for f in findings if f.priority == "P2"]

    p1_template = [f for f in p1 if f.category == "Template Violations"]
    p1_broken = [f for f in p1 if f.category == "Freshness Drift (broken refs)"]
    p2_coverage = [f for f in p2 if f.category == "Coverage Drift (missing key artifacts)"]

    batch_a_files = sorted({f.file for f in p1_template})
    batch_b_files = sorted({f.file for f in p1_broken})
    batch_c_files = sorted({f.file for f in p2_coverage})

    lines: List[str] = []
    lines.append("# README Audit Report")
    lines.append("")
    lines.append(f"- Generated: {now}")
    lines.append(f"- Repo root: `{repo_root}`")
    lines.append(f"- Inventory file: `{inventory_file}`")
    lines.append(f"- In-scope READMEs: **{total}**")
    lines.append(f"- Template valid: **{valid}**")
    lines.append(f"- Template invalid: **{invalid}**")
    lines.append(f"- P1 findings: **{len(p1)}**")
    lines.append(f"- P2 findings: **{len(p2)}**")
    lines.append("")
    lines.append("## P1 Template Violations")
    if not p1_template:
        lines.append("- None.")
    else:
        for f in p1_template:
            lines.append(
                f"- `{f.file}` | `{f.rule_type}` | {f.evidence} | Remediation: {f.remediation}"
            )

    lines.append("")
    lines.append("## P1 Freshness Drift (broken refs)")
    if not p1_broken:
        lines.append("- None.")
    else:
        for f in p1_broken:
            lines.append(
                f"- `{f.file}` | `{f.rule_type}` | {f.evidence} | Remediation: {f.remediation}"
            )

    lines.append("")
    lines.append("## P2 Coverage Drift (missing key artifacts)")
    if not p2_coverage:
        lines.append("- None.")
    else:
        for f in p2_coverage:
            lines.append(
                f"- `{f.file}` | `{f.rule_type}` | {f.evidence} | Remediation: {f.remediation}"
            )

    lines.append("")
    lines.append("## Grouped Fix Batches")
    lines.append("")
    lines.append("### Batch A: Fix template violations (required sections and format)")
    if batch_a_files:
        for file in batch_a_files:
            lines.append(f"- `{file}`")
    else:
        lines.append("- No files in this batch.")

    lines.append("")
    lines.append("### Batch B: Repair broken file/folder references")
    if batch_b_files:
        for file in batch_b_files:
            lines.append(f"- `{file}`")
    else:
        lines.append("- No files in this batch.")

    lines.append("")
    lines.append("### Batch C: Update structure sections for key artifacts")
    if batch_c_files:
        for file in batch_c_files:
            lines.append(f"- `{file}`")
    else:
        lines.append("- No files in this batch.")

    lines.append("")
    lines.append("## Post-Fix Verification Gate")
    lines.append("")
    lines.append("Run the same audit command again and verify:")
    lines.append("- `0` blocking template errors")
    lines.append("- `0` broken references")
    lines.append("- Remaining `P2` items only if intentionally accepted")
    lines.append("")
    lines.append("```bash")
    lines.append(
        "python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py "
        "--repo-root . "
        "--validator .opencode/skills/sk-doc/shared/scripts/validate_document.py "
        "--inventory-out /tmp/readme-audit-inventory.txt "
        "--json-out /tmp/readme-audit-report.json "
        "--markdown-out /tmp/readme-audit-report.md"
    )
    lines.append("```")

    return "\n".join(lines) + "\n"


def audit_readme_file(repo_root: Path, readme: Path, validator: Path, document_type: str = 'readme') -> Dict[str, Any]:
    content = readme.read_text(encoding="utf-8", errors="replace")
    references = sorted(extract_references(content))

    broken_refs: List[Dict[str, str]] = []
    for ref in references:
        ok, checked = classify_reference_status(readme, repo_root, ref)
        if not ok:
            broken_refs.append({"reference": ref, "checked_paths": checked})

    skip_coverage = in_skip_coverage_bucket(readme.relative_to(repo_root))
    missing_artifacts: List[str] = []
    if not skip_coverage:
        presence = artifact_presence(readme.parent)
        for key, exists in presence.items():
            if exists and not artifact_mentioned(content, set(references), key):
                missing_artifacts.append(key)
    else:
        presence = artifact_presence(readme.parent)

    template = run_template_validation(validator, repo_root, readme, document_type)

    return {
        "file": str(readme.relative_to(repo_root)),
        "document_type": document_type,
        "template_status": "valid" if template["valid"] else "invalid",
        "blocking_errors": template["blocking_errors"],
        "warnings": template["warnings"],
        "broken_references": broken_refs,
        "missing_key_artifacts": missing_artifacts,
        "coverage_skipped": skip_coverage,
        "key_artifacts_present": [k for k, exists in presence.items() if exists],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit README template alignment + freshness drift.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root path (default: current directory).",
    )
    parser.add_argument(
        "--validator",
        default=".opencode/skills/sk-doc/shared/scripts/validate_document.py",
        help="Path to validate_document.py",
    )
    parser.add_argument(
        "--inventory-out",
        help="Optional output file for deterministic README inventory list.",
    )
    parser.add_argument(
        "--json-out",
        help="Optional JSON report output path.",
    )
    parser.add_argument(
        "--markdown-out",
        help="Optional Markdown report output path.",
    )
    parser.add_argument(
        "--manifest",
        help="Optional frozen durable-directory manifest to reproduce and assert.",
    )
    parser.add_argument(
        "--document-type",
        choices=("readme", "code_folder", "code-folder"),
        default="readme",
        help="Validator document type. The code-folder mode is opt-in.",
    )
    return parser.parse_args()


def write_lines(path: Path, lines: Iterable[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()
    validator = Path(args.validator).resolve()

    if not repo_root.exists():
        raise FileNotFoundError(f"Repo root does not exist: {repo_root}")
    if not validator.exists():
        raise FileNotFoundError(f"Validator not found: {validator}")

    readmes = find_readmes(repo_root)
    if not readmes:
        raise RuntimeError("No README files found in scope.")

    manifest_path = Path(args.manifest).resolve() if args.manifest else None
    manifest = manifest_reproduction(repo_root, manifest_path)
    if manifest_path and not manifest['raw_candidate_set_reproduced']:
        raise RuntimeError(
            'Frozen durable-directory manifest does not reproduce the current walk: '
            f"added={len(manifest['added_since_frozen'])} removed={len(manifest['removed_since_frozen'])}"
        )

    if args.inventory_out:
        write_lines(Path(args.inventory_out).resolve(), [str(p.relative_to(repo_root)) for p in readmes])

    per_file = [audit_readme_file(repo_root, readme, validator, args.document_type) for readme in readmes]
    findings = generate_findings(repo_root, per_file)

    summary = {
        "readmes_total": len(per_file),
        "template_valid": sum(1 for x in per_file if x["template_status"] == "valid"),
        "template_invalid": sum(1 for x in per_file if x["template_status"] == "invalid"),
        "template_blocking_errors": sum(len(x["blocking_errors"]) for x in per_file),
        "template_warnings": sum(len(x["warnings"]) for x in per_file),
        "broken_references": sum(len(x["broken_references"]) for x in per_file),
        "missing_key_artifacts": sum(len(x["missing_key_artifacts"]) for x in per_file),
        "findings_p1": sum(1 for f in findings if f.priority == "P1"),
        "findings_p2": sum(1 for f in findings if f.priority == "P2"),
        "manifest_derived_count": manifest["derived_count"],
        "manifest_frozen_count": manifest.get("frozen_count", manifest["derived_count"]),
        "manifest_raw_candidate_set_reproduced": manifest["raw_candidate_set_reproduced"],
        "manifest_exclusions": len(manifest["exclusions"]),
        "manifest_gaps": len(manifest["gaps"]),
    }

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "repo_root": str(repo_root),
        "scope": {
            "include": [
                "README.md (repo root)",
                ".opencode/**/README.md",
                ".claude/**/README.md",
                ".pi/**/README.md",
                ".github/**/README.md",
                "scripts/**/README.md",
            ],
            "durable_roots": list(DURABLE_ROOT_NAMES),
            "exclude_path_segments": sorted(EXCLUDE_SEGMENTS),
            "skip_coverage_path_segments": sorted(SKIP_COVERAGE_SEGMENTS),
            "disposition_path_classes": list(DISPOSITION_PATH_CLASSES),
            "document_type": args.document_type,
        },
        "manifest": manifest,
        "summary": summary,
        "files": per_file,
        "findings": [
            {
                "priority": f.priority,
                "category": f.category,
                "file": f.file,
                "rule_type": f.rule_type,
                "evidence": f.evidence,
                "remediation": f.remediation,
            }
            for f in findings
        ],
    }

    if args.json_out:
        json_path = Path(args.json_out).resolve()
        json_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    markdown_report = render_markdown_report(
        repo_root=repo_root,
        inventory_file=Path(args.inventory_out).resolve() if args.inventory_out else Path("<not-saved>"),
        findings=findings,
        per_file=per_file,
    )
    if args.markdown_out:
        md_path = Path(args.markdown_out).resolve()
        md_path.parent.mkdir(parents=True, exist_ok=True)
        md_path.write_text(markdown_report, encoding="utf-8")

    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
