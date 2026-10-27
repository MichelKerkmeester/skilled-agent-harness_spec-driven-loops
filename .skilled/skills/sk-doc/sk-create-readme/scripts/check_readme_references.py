#!/usr/bin/env python3
"""Check local README links, file references, and command paths.

Usage: python3 check_readme_references.py [--self-test] README.md [...]

Relative links and inline file references resolve from the README directory.
Repository-root command anchors such as ``.skilled/...`` are resolved from
the Git repository root when the README documents a command run from that root.
Fence info strings containing ``example`` explicitly mark illustrative paths.

Tokens that only look like paths are not checked: slash commands such as
``/doctor:git``, home paths such as ``~/.zshrc``, absolute paths outside the
repository (``/dev/null``, HTTP routes, ``/path/to/...`` placeholders), file
types such as ``*.ts``, and slashed words without a suffix or trailing slash
(``provider/model`` ids, ``HTTP/UDS``, branch names), ``<placeholder>``
tokens, and quoted shell arguments that contain spaces. A bare name such as
``graph-metadata.json`` that is not beside the README passes when a tracked
file or folder of that name, or a ``.tmpl`` template that renders it, exists in
the repository, and a path that starts with a skill folder name resolves from
that skill. A fenced tree whose first
line is a folder resolves its entries under that folder, and a fenced line
drawn inside a box (``│ ... │``) is diagram prose, so only its anchored paths
are checked.

Four narrow classes pass without existing in the checkout, each because the
path is absent by design: a path the repository's ``.gitignore`` excludes
(build output such as ``dist/``), a bare ``name.js`` whose ``name.ts`` source is
tracked, a path a hub README names per mode that every child mode folder (a
subfolder holding ``SKILL.md``) holds, and the per-repository config the doctor
commands create on demand (``.sk-code/quality.json`` and ``.sk-git/``, exact
tokens only). The argument of an output flag (``-o file.txt``) names a file the
command writes, so it is not checked.

Any other known-good reference that cannot exist in the checkout is named in a
README-level marker block. Each entry suppresses that exact token in that README
only, needs a reason, and fails when it matches no unresolved reference, so a
marker cannot outlive its cause::

    <!-- readme-check
    allow-ref worktrees/ | a git branch namespace, not a folder
    allow-count two example files | the next two bullets name both files
    -->

``allow-count`` entries belong to ``check_derived_readme_counts.py``, which
reads the same block.
"""

from __future__ import annotations

import argparse
import glob
import re
import shlex
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "shared" / "scripts"))
from validation_switch import exit_if_validation_off  # type: ignore  # noqa: E402


FENCE_PATTERN = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
LINK_PATTERN = re.compile(r"\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)")
INLINE_PATTERN = re.compile(r"`([^`\n]+)`")
TRAILING_PUNCTUATION = ".,;:!?)]}>'\""
KNOWN_SUFFIXES = {
    ".bash",
    ".cjs",
    ".css",
    ".json",
    ".js",
    ".mjs",
    ".md",
    ".plist",
    ".py",
    ".sh",
    ".ts",
    ".tsx",
    ".txt",
    ".yml",
    ".yaml",
}
REPOSITORY_ROOT_PREFIXES = (
    ".github/",
    ".skilled/", ".opencode/",
    ".claude/", ".codex/", ".cursor/", ".devin/", ".hermes/", ".pi/",
    "specs/",
    "opencode.json",
    ".utcp_config.json",
    "package.json",
)
ANCHORED_PREFIXES = ("./", "../", "/") + REPOSITORY_ROOT_PREFIXES
SLASH_COMMAND_PATTERN = re.compile(r"/[A-Za-z][\w-]*(?::[\w*-]+)?")
BOX_TEXT_PATTERN = re.compile(r"^\s*│.*│\s*$")
TREE_ENTRY_PATTERN = re.compile(r"[├└]──\s*(\S+)")
# An absolute path under a user home still fails: it leaks one machine's layout.
MACHINE_PATH_PREFIXES = ("/Users/", "/home/")
_TRACKED_NAMES: dict[Path, tuple[set[str], dict[str, Path]]] = {}
MARKER_OPEN = re.compile(r"^\s*<!--\s*readme-check\s*$")
MARKER_DIRECTIVES = ("allow-ref", "allow-count")
OUTPUT_FLAGS = {"-o", "--output", "--out"}
# Per-repository config the doctor commands create on demand, so no checkout ships it.
ON_DEMAND_PATHS = {
    ".sk-code/quality.json": "created by /doctor:sk-code quality",
    ".sk-git/": "created by /doctor:git standards",
}


@dataclass(frozen=True)
class Reference:
    line: int
    raw: str
    kind: str
    example: bool = False
    span: str = ""
    tree_root: str = ""


@dataclass(frozen=True)
class Resolution:
    reference: Reference
    resolved: bool
    detail: str


def repository_root(readme: Path) -> Path:
    """Return the checkout root without depending on the caller's CWD."""
    result = subprocess.run(
        ["git", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
        check=True,
        capture_output=True,
        text=True,
    )
    return Path(result.stdout.strip()).resolve()


def clean_candidate(value: str) -> str:
    """Normalize a Markdown or shell token while retaining meaningful dots."""
    candidate = value.strip().strip("`<>'\"")
    if "#" in candidate:
        candidate, _fragment = candidate.split("#", 1)
    candidate = candidate.rstrip(TRAILING_PUNCTUATION)
    return candidate


def looks_like_path(value: str) -> bool:
    """Recognize file and directory tokens without treating prose as paths."""
    if not value or value.startswith(("-", "@", "$", "~")):
        return False
    if "://" in value or value.startswith(("#", "mailto:")):
        return False
    if ":" in value and "/" not in value:
        return False
    if any(character in value for character in "(){}<>\""):
        return False
    if value in {"//", "/", "Node.js", "node:test", ".d.ts"} or value in KNOWN_SUFFIXES:
        return False
    if SLASH_COMMAND_PATTERN.fullmatch(value):
        return False
    if value.startswith("*.") and "/" not in value:
        return False
    if value.startswith(ANCHORED_PREFIXES):
        return True
    if "/" in value and ("*" not in value and "?" not in value):
        return value.endswith("/") or Path(value).suffix.lower() in KNOWN_SUFFIXES
    if ("*" in value or "?" in value) and Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    if Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    return value in {"README.md", "pre-commit", "package.json"}


def token_candidates(value: str) -> Iterable[str]:
    """Yield path-like shell tokens from a code span or command line."""
    value = value.rstrip()
    if value.endswith("\\"):
        value = value[:-1]
    try:
        tokens = shlex.split(value, comments=False, posix=True)
    except ValueError:
        tokens = value.split()
    previous = ""
    for token in tokens:
        stripped = token.strip()
        writes_output, previous = previous in OUTPUT_FLAGS, stripped
        if writes_output:
            continue
        if any(character.isspace() for character in stripped):
            continue
        if stripped.startswith("<") and stripped.rstrip(".,;:!?)]}'\"").endswith(">"):
            continue
        if re.match(r"[A-Za-z_][A-Za-z0-9_]*=", stripped):
            continue
        cleaned = clean_candidate(token)
        if looks_like_path(cleaned):
            yield cleaned


def extract_references(text: str) -> list[Reference]:
    """Extract links, inline paths, and command paths with source line numbers."""
    references: list[Reference] = []
    active_fence: str | None = None
    example_fence = False
    fence_first_line = False
    tree_root: str | None = None
    tree_stack: list[tuple[int, str]] = []

    for line_number, line in enumerate(text.splitlines(), start=1):
        fence_match = FENCE_PATTERN.match(line)
        if fence_match:
            marker = fence_match.group(1)
            if active_fence is None:
                active_fence = marker[0]
                example_fence = "example" in fence_match.group(2).lower().split()
                fence_first_line = True
                tree_root = None
                tree_stack = []
            elif marker[0] == active_fence:
                active_fence = None
                example_fence = False
            continue

        if example_fence:
            continue

        for match in LINK_PATTERN.finditer(line):
            candidate = clean_candidate(match.group(1))
            if candidate and not candidate.startswith(("http://", "https://", "mailto:")):
                references.append(Reference(line_number, candidate, "link"))

        for match in INLINE_PATTERN.finditer(line):
            span = clean_candidate(match.group(1)) if " " in match.group(1).strip() else ""
            for candidate in token_candidates(match.group(1)):
                references.append(Reference(line_number, candidate, "inline", span=span))

        if active_fence is not None:
            if fence_first_line and line.strip():
                fence_first_line = False
                head = re.split(r"\s#", line, maxsplit=1)[0].strip()
                if head.endswith("/") and " " not in head and looks_like_path(head):
                    tree_root = head
            rest = line
            entry = TREE_ENTRY_PATTERN.search(line)
            if tree_root is not None and entry is not None:
                column = entry.start()
                while tree_stack and tree_stack[-1][0] >= column:
                    tree_stack.pop()
                name = clean_candidate(entry.group(1))
                prefix = tree_root + "".join(folder for _column, folder in tree_stack)
                if name.endswith("/"):
                    tree_stack.append((column, name))
                placeholder = any(character in prefix for character in "<>{}")
                if looks_like_path(name) and not name.startswith(ANCHORED_PREFIXES) and not placeholder:
                    references.append(Reference(line_number, prefix + name, "tree", tree_root=tree_root))
                rest = line[entry.end():]
            boxed = BOX_TEXT_PATTERN.match(line) is not None
            for candidate in token_candidates(rest):
                if boxed and not candidate.startswith(ANCHORED_PREFIXES):
                    continue
                references.append(Reference(line_number, candidate, "command"))

    return references


@dataclass(frozen=True)
class MarkerEntry:
    line: int
    directive: str
    token: str
    reason: str


def parse_markers(text: str) -> tuple[list[MarkerEntry], list[tuple[int, str]], str]:
    """Read readme-check blocks and return entries, malformed lines and the text with blocks blanked."""
    entries: list[MarkerEntry] = []
    errors: list[tuple[int, str]] = []
    lines = text.splitlines()
    inside = False
    for index, line in enumerate(lines):
        if not inside:
            inside = MARKER_OPEN.match(line) is not None
            if inside:
                lines[index] = ""
            continue
        lines[index] = ""
        body = line.strip()
        if body.startswith("-->"):
            inside = False
            continue
        if not body:
            continue
        directive, _space, rest = body.partition(" ")
        token, bar, reason = rest.partition("|")
        if directive not in MARKER_DIRECTIVES:
            errors.append((index + 1, f"unknown readme-check directive {directive!r}"))
        elif not bar or not token.strip() or not reason.strip():
            errors.append((index + 1, f"{directive} entry needs '<token> | <reason>'"))
        else:
            entries.append(MarkerEntry(index + 1, directive, token.strip(), reason.strip()))
    if inside:
        errors.append((len(lines), "readme-check block is not closed with -->"))
    return entries, errors, "\n".join(lines)


def tracked_names(root: Path) -> tuple[set[str], dict[str, Path]]:
    """Return tracked file and folder names plus skill folders by name, cached per root."""
    if root not in _TRACKED_NAMES:
        result = subprocess.run(
            ["git", "-c", "core.fsmonitor=false", "-C", str(root), "ls-files", "-z"],
            check=False,
            capture_output=True,
            text=True,
        )
        names: set[str] = set()
        skills: dict[str, Path] = {}
        for relative in result.stdout.split("\0"):
            if not relative:
                continue
            parts = relative.split("/")
            names.add(parts[-1])
            names.update(f"{part}/" for part in parts[:-1])
            if parts[-1] == "SKILL.md" and parts[:2] == [".skilled", "skills"] and len(parts) in (4, 5):
                skills.setdefault(parts[-2], root.joinpath(*parts[:-1]))
        _TRACKED_NAMES[root] = (names, skills)
    return _TRACKED_NAMES[root]


def candidate_paths(candidate: str, base: Path, root: Path, kind: str = "link") -> list[Path]:
    """Resolve a literal or glob from the README directory and safe root anchors."""
    if candidate.rstrip("/") == base.name:
        return [base]
    if candidate.startswith("/"):
        return [Path(candidate)]
    paths = [base / candidate]
    if candidate.startswith(REPOSITORY_ROOT_PREFIXES):
        root_path = root / candidate
        if root_path not in paths:
            paths.append(root_path)
    head, _slash, tail = candidate.partition("/")
    if kind == "tree":
        # A tree drawn from the README's own folder names it from a parent, as in runtime/hooks/.
        segments = candidate.split("/")
        for depth in range(1, min(len(segments), len(base.parts))):
            if list(base.parts[-depth:]) == segments[:depth]:
                paths.append(base.joinpath(*segments[depth:]))
    if kind != "link" and tail:
        skill = tracked_names(root)[1].get(head)
        if skill is not None:
            paths.append(skill.parent / candidate)
    return paths


def outside_repository(raw: str, root: Path) -> bool:
    """Name an absolute path that is not a repository reference and is not a machine path."""
    if not raw.startswith("/") or raw.startswith(MACHINE_PATH_PREFIXES):
        return False
    try:
        Path(raw).resolve().relative_to(root)
    except ValueError:
        return True
    return False


def ignored_by_git(relative: str, root: Path) -> bool:
    """Ask git whether the tracked .gitignore excludes a repository-relative path."""
    result = subprocess.run(
        ["git", "-c", "core.fsmonitor=false", "-C", str(root), "check-ignore", "--no-index", "-q", "--", relative],
        check=False,
        capture_output=True,
    )
    return result.returncode == 0


def gitignored(raw: str, readme: Path, root: Path) -> bool:
    """Tell whether the repository's tracked .gitignore excludes a path, as build output is."""
    if raw.startswith("/") or "*" in raw or "?" in raw:
        return False
    # A README kept inside an ignored folder would pass every relative path, broken ones too, so
    # an extensionless sibling name probes whether the folder's contents are ignored as a whole.
    if ignored_by_git(str((readme.parent / "readme-check-probe").relative_to(root)), root):
        return False
    base = readme.parent
    bases = [base] + ([root] if raw.startswith(REPOSITORY_ROOT_PREFIXES) else [])
    for start in bases:
        try:
            relative = (start / raw).resolve().relative_to(root)
        except ValueError:
            continue
        if ignored_by_git(str(relative) + ("/" if raw.endswith("/") else ""), root):
            return True
    return False


def per_mode_path(raw: str, base: Path) -> bool:
    """Tell whether a hub README names a path that every child mode folder holds."""
    if raw.startswith(ANCHORED_PREFIXES) or "/" not in raw.rstrip("/") or "*" in raw:
        return False
    modes = [child for child in base.iterdir() if child.is_dir() and (child / "SKILL.md").is_file()]
    return len(modes) >= 2 and all((mode / raw).exists() for mode in modes)


def absent_by_design(raw: str, readme: Path, root: Path) -> str:
    """Name why an unresolved path is absent from every checkout by design, or return ''."""
    if raw in ON_DEMAND_PATHS:
        return f"per-repository config {ON_DEMAND_PATHS[raw]}"
    if "/" not in raw and raw.endswith(".js") and f"{raw[:-3]}.ts" in tracked_names(root)[0]:
        return f"compiled from tracked {raw[:-3]}.ts"
    if per_mode_path(raw, readme.parent):
        return "held by every child mode folder"
    if gitignored(raw, readme, root):
        return "excluded by .gitignore"
    return ""


def resolve_reference(reference: Reference, readme: Path, root: Path) -> Resolution:
    """Resolve one reference and reject broken or escaping symlink targets."""
    resolution = resolve_literal(reference, reference.raw, readme, root)
    if resolution.resolved or reference.kind == "link":
        return resolution
    if reference.tree_root:
        # A tree root that names no real folder is the README folder under another name.
        tree_root = resolve_literal(reference, reference.tree_root, readme, root)
        if not tree_root.resolved:
            return resolve_literal(reference, reference.raw[len(reference.tree_root):], readme, root)
        return resolution
    if reference.span.endswith(reference.raw) and reference.span != reference.raw:
        whole = resolve_literal(reference, reference.span, readme, root)
        if whole.resolved:
            return whole
        if "/" not in reference.span.rstrip("/") and reference.span in tracked_names(root)[0]:
            return Resolution(reference, True, f"tracked name {reference.span}")
    bare = reference.raw
    names = tracked_names(root)[0]
    if "/" not in bare.rstrip("/") and "*" not in bare and (bare in names or f"{bare}.tmpl" in names):
        return Resolution(reference, True, f"tracked name {bare}")
    reason = absent_by_design(bare, readme, root)
    if reason:
        return Resolution(reference, True, reason)
    return resolution


def resolve_literal(reference: Reference, raw: str, readme: Path, root: Path) -> Resolution:
    """Resolve one literal or glob from every candidate base."""
    for candidate_path in candidate_paths(raw, readme.parent, root, reference.kind):
        matches = sorted(glob.glob(str(candidate_path), recursive=True)) if any(
            marker in str(candidate_path) for marker in ("*", "?")
        ) else [str(candidate_path)]
        for match in matches:
            path = Path(match)
            if not path.exists():
                continue
            resolved = path.resolve()
            try:
                resolved.relative_to(root)
            except ValueError:
                return Resolution(reference, False, "resolves outside the repository")
            return Resolution(reference, True, str(resolved))
    return Resolution(reference, False, "path does not exist")


def check_readme(readme_arg: str) -> tuple[list[Resolution], Path | None]:
    """Check one README and return reference receipts plus a read error."""
    readme = Path(readme_arg).resolve()
    if not readme.is_file():
        return [], readme
    try:
        root = repository_root(readme)
        text = readme.read_text(encoding="utf-8")
    except (OSError, subprocess.CalledProcessError):
        return [], readme
    entries, errors, text = parse_markers(text)
    references = [
        reference for reference in extract_references(text)
        if not outside_repository(reference.raw, root)
    ]
    allowed = {entry.token: entry for entry in entries if entry.directive == "allow-ref"}
    used: set[str] = set()
    resolutions: list[Resolution] = []
    for reference in references:
        resolution = resolve_reference(reference, readme, root)
        entry = allowed.get(reference.raw)
        if not resolution.resolved and entry is not None:
            used.add(entry.token)
            resolution = Resolution(reference, True, f"allowed: {entry.reason}")
        resolutions.append(resolution)
    for line, message in errors:
        resolutions.append(Resolution(Reference(line, "readme-check", "marker"), False, message))
    for token, entry in allowed.items():
        if token not in used:
            resolutions.append(Resolution(
                Reference(entry.line, token, "marker"), False, "allow-ref matches no unresolved reference",
            ))
    return resolutions, None


def print_result(readme_arg: str, resolutions: list[Resolution], missing: Path | None) -> bool:
    """Print a human-readable verdict for one README."""
    if missing is not None:
        print(f"FAIL {readme_arg}: README is missing or unreadable")
        return False
    failures = [item for item in resolutions if not item.resolved]
    allowed = sum(1 for item in resolutions if item.detail.startswith("allowed: "))
    examples = 0
    for item in resolutions:
        if item.reference.example:
            examples += 1
        if not item.resolved:
            print(
                f"  line {item.reference.line}: {item.reference.kind} "
                f"{item.reference.raw!r}: {item.detail}"
            )
    status = "PASS" if not failures else "FAIL"
    print(
        f"{status} {readme_arg}: references={len(resolutions)} "
        f"unresolved={len(failures)} examples={examples} allowed={allowed}"
    )
    return not failures


def run_self_test() -> int:
    """Exercise valid, missing, example-fence, path-shaped prose and broken-path cases."""
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / ".git").mkdir()
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True)
        (root / "docs").mkdir()
        (root / "docs" / "README.md").write_text(
            "[source](../source.md)\n\n```bash\n./run.sh\n```\n\n"
            "```bash example\n./illustrative.sh\n```\n",
            encoding="utf-8",
        )
        (root / "source.md").write_text("source\n", encoding="utf-8")
        (root / "docs" / "run.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
        valid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or not print_result("self-test-positive", valid, None):
            return 1

        (root / "docs" / "README.md").write_text("```bash\n./missing.sh\n```\n", encoding="utf-8")
        invalid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or print_result("self-test-negative", invalid, None):
            return 1

        for relative in (
            "elsewhere/graph-metadata.json", "elsewhere/addons/x.md",
            "templates/phase.spec.md.tmpl", "REPO RULES.md",
            ".skilled/skills/tool/SKILL.md", ".skilled/skills/tool/scripts/run.py",
            "docs/pkg/a.py", "docs/pkg/sub/b.py",
        ):
            (root / relative).parent.mkdir(parents=True, exist_ok=True)
            (root / relative).write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        _TRACKED_NAMES.clear()
        (root / "docs" / "README.md").write_text(
            "Run `/doctor:git` or `/deep:*`, edit `~/.zshrc`, pipe to `/dev/null`, call `/api/embed`.\n"
            "Pick `openai/gpt-6` over `HTTP/UDS`, match `*.ts` and `.d.ts`.\n"
            "Read `graph-metadata.json`, `addons/`, the `phase.spec.md` template and `REPO RULES.md`.\n"
            "Run `tool/scripts/run.py` with `<path/to/file.md>`.\n\n"
            "```bash\ncodex exec \\\n  \"Edit src/missing.ts now\" \\\n```\n\n"
            "```text\npkg/\n├── a.py\n└── sub/\n    └── b.py\n```\n\n"
            "```text\n┌──────────┐\n│ scratch/ │\n└──────────┘\n```\n",
            encoding="utf-8",
        )
        shaped, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or not print_result("self-test-path-shaped-prose", shaped, None):
            return 1

        # A stale tree root still fails, but its entries resolve from the README folder.
        (root / "docs" / "README.md").write_text("```text\nold-name/\n└── pkg/\n```\n", encoding="utf-8")
        stale_root, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or [item.reference.raw for item in stale_root if not item.resolved] != ["old-name/"]:
            print("FAIL self-test-stale-tree-root")
            return 1

        for label, body in (
            ("untracked-bare-name", "`nowhere-at-all.json`\n"),
            ("unanchored-missing-file", "`lib/missing.py`\n"),
            ("missing-tree-entry", "```text\npkg/\n└── gone.py\n```\n"),
            ("machine-path", "`/Users/someone/file.md`\n"),
        ):
            (root / "docs" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "docs" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1

        # A marker suppresses only its own token: a broken path beside it still fails.
        (root / "docs" / "README.md").write_text(
            "Branches live under `gone-ns/`, next to `lib/broken.py`.\n\n"
            "<!-- readme-check\nallow-ref gone-ns/ | a git branch namespace, not a folder\n-->\n",
            encoding="utf-8",
        )
        marked, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or [item.reference.raw for item in marked if not item.resolved] != ["lib/broken.py"]:
            print("FAIL self-test-marker-scope")
            return 1
        for label, body in (
            ("marker-unused", "`docs/`\n\n<!-- readme-check\nallow-ref docs/ | exists, so the entry is stale\n-->\n"),
            ("marker-no-reason", "`gone-ns/`\n\n<!-- readme-check\nallow-ref gone-ns/\n-->\n"),
            ("marker-unclosed", "`gone-ns/`\n\n<!-- readme-check\nallow-ref gone-ns/ | reason\n"),
        ):
            (root / "docs" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "docs" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1

        # Each absent-by-design class passes its own case and never an ordinary missing path.
        (root / ".gitignore").write_text("build/\n", encoding="utf-8")
        for relative in ("hub/a/SKILL.md", "hub/a/refs/x.md", "hub/a/refs/y.md", "hub/b/SKILL.md",
                         "hub/b/refs/x.md", "src/gen.ts"):
            (root / relative).parent.mkdir(parents=True, exist_ok=True)
            (root / relative).write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        _TRACKED_NAMES.clear()
        (root / "hub" / "README.md").write_text(
            "Each mode keeps `refs/x.md`. Output lands in `build/out.js`. It runs `gen.js`.\n"
            "Config lives in `.sk-git/` and `.sk-code/quality.json`. Run `tool -o out.txt`.\n",
            encoding="utf-8",
        )
        classes, missing = check_readme(str(root / "hub" / "README.md"))
        if missing is not None or not print_result("self-test-absent-by-design", classes, None):
            return 1
        for label, body in (
            ("class-not-every-mode", "`refs/y.md`\n"),
            ("class-not-ignored", "`src/out.js`\n"),
            ("class-no-ts-source", "`other.js`\n"),
            ("class-config-near-miss", "`.sk-gitx/`\n"),
            ("class-not-output-flag", "`tool out.txt`\n"),
        ):
            (root / "hub" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "hub" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1
        # Inside an ignored folder every relative path is ignored, so the rule must not apply there.
        (root / "build").mkdir(exist_ok=True)
        (root / ".gitignore").write_text("build/\nstate/*/*\n!state/*/README.md\n", encoding="utf-8")
        (root / "state" / "lane").mkdir(parents=True)
        (root / "state" / "lane" / "README.md").write_text("`gone.md`\n", encoding="utf-8")
        broken, missing = check_readme(str(root / "state" / "lane" / "README.md"))
        if missing is not None or print_result("self-test-class-readme-reincluded-in-ignored-folder", broken, None):
            return 1
        (root / "build" / "README.md").write_text("`gone.md`\n", encoding="utf-8")
        broken, missing = check_readme(str(root / "build" / "README.md"))
        if missing is not None or print_result("self-test-class-readme-in-ignored-folder", broken, None):
            return 1
    print("SELF-TEST PASS: positive, negative, example-fence, path-shaped prose, broken-path, "
          "marker and absent-by-design cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readmes", nargs="*", help="README paths to check")
    parser.add_argument("--self-test", action="store_true", help="run built-in behavior checks")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run the reference gate."""
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return run_self_test()
    exit_if_validation_off("check_readme_references.py", argv)
    if not args.readmes:
        print("No README paths supplied", file=sys.stderr)
        return 2
    results = [print_result(path, *check_readme(path)) for path in args.readmes]
    print(
        f"SUMMARY files={len(results)} pass={sum(results)} "
        f"fail={len(results) - sum(results)}"
    )
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
