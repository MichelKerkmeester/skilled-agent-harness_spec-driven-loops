#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REFERENCE SECTION RENUMBERER
# ───────────────────────────────────────────────────────────────

"""
Bring reference docs to the reference format without changing what any section reference points at.

Usage:
    python renumber-references.py plan   <file-list> --out <dir> [--repo <dir>]
    python renumber-references.py apply  <file-list> --out <dir> [--repo <dir>]
    python renumber-references.py verify <file-list> --out <dir> [--repo <dir>] [--rev <git-rev>]
    python renumber-references.py preserved <file-list> --out <dir> [--repo <dir>] [--rev <git-rev>]

plan    builds the new text of every file in memory and writes the before/after table.
apply   runs plan, stops on any mismatch or unresolved reference, then writes the files.
verify  rescans files (on disk, or at a git revision) and checks every section reference resolves.
preserved  compares each file on disk with its git revision after removing the edits the tool is
        allowed to make, and lists any other line that differs.

Output: rewrite-table.tsv, left-alone.tsv and summary.txt in the --out directory.
"""

import argparse
import json
import posixpath
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SECTION_REF = re.compile(r"§\s?(\d+)(?:\.(\d+))?")
H2_NUMBERED = re.compile(r"^## (\d+)\.\s+(.*?)\s*$")
H3_NUMBERED = re.compile(r"^(#{3,6}) (\d+)\.(\d+)\b(.*)$")
FILE_TOKEN_BEFORE = re.compile(r"(?:^|[\s(\[`'\"*_])((?:[\w.-]+/)*[\w.-]+\.md)[`\])*_]*\s*$")
FILE_TOKEN_AFTER = re.compile(r"^\s+(?:of|in)\s+(?:the\s+|this\s+)?[`'\"]?((?:[\w.-]+/)*[\w.-]+\.md)")
RULE_AFTER = re.compile(r"^\s+rules?\b")
INHERIT_GAP = re.compile(r"^(?:\s*\([^)]*\))?\s*(?:\+|/|,|&|and|or|–|-)\s*$")

# Files whose own numbering this tool never changes, so a reference to them stays as written.
UNCHANGED_TARGETS = {"SKILL.md"}

# A bare reference the sentence context cannot place. Key: repo-relative file and 1-based line
# of the original text. Value: the file the reference belongs to.
REPO_RULES = "EXTERNAL:REPO RULES.md"
AGENTS = "EXTERNAL:AGENTS.md"
RR = ".skilled/skills/sk-doc/sk-create-repo-rule/references/"
TARGET_OVERRIDES: Dict[Tuple[str, int], str] = {
    (".skilled/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md", 159): "SKILL.md",
    (RR + "agents-md-integration.md", 57): REPO_RULES,
    (RR + "agents-md-integration.md", 63): REPO_RULES,
    (RR + "agents-md-integration.md", 129): REPO_RULES,
    (RR + "agents-md-integration.md", 172): REPO_RULES,
    (RR + "agents-md-integration.md", 173): REPO_RULES,
    (RR + "decision-tests.md", 50): AGENTS,
}


@dataclass
class Doc:
    rel: str
    lines: List[str]
    fenced: Set[int]
    fm_end: int
    h1: int
    h2_numbered: List[Tuple[int, int, str]]
    h2_unnumbered: List[Tuple[int, str]]
    final_newline: bool


@dataclass
class Ref:
    old_line: int
    start: int
    end: int
    major: int
    minor: Optional[int]
    target: str
    reason: str


@dataclass
class Plan:
    doc: Doc
    mode: str
    old_to_new: Dict[int, int]
    new_lines: List[str]
    new_pos: Dict[int, int]
    rows: List[dict] = field(default_factory=list)
    left_alone: List[dict] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    dividers_added: int = 0
    h3_shifted: int = 0

# ───────────────────────────────────────────────────────────────
# 2. PARSING
# ───────────────────────────────────────────────────────────────


def fenced_lines(lines: List[str]) -> Set[int]:
    """0-based indexes of lines inside a code fence, fence lines included.

    Mirrors the validator's fence rule so both tools agree on what is code.
    """
    fenced: Set[int] = set()
    fence_len = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("```"):
            ticks = len(stripped) - len(stripped.lstrip("`"))
            info = stripped[ticks:].strip()
            fenced.add(i)
            if fence_len == 0:
                fence_len = ticks
            elif ticks >= fence_len and info == "":
                fence_len = 0
            continue
        if fence_len > 0:
            fenced.add(i)
    return fenced


def parse_doc(rel: str, text: str) -> Doc:
    """Split a markdown file into the pieces the tool edits."""
    if "\r" in text:
        raise ValueError(f"{rel}: CRLF line endings are not handled")
    final_newline = text.endswith("\n")
    lines = text.split("\n")
    if final_newline:
        lines = lines[:-1]
    fm_end = -1
    if lines and lines[0] == "---":
        for i in range(1, len(lines)):
            if lines[i] == "---":
                fm_end = i
                break
    fenced = fenced_lines(lines)
    h1 = -1
    h2_numbered: List[Tuple[int, int, str]] = []
    h2_unnumbered: List[Tuple[int, str]] = []
    for i, line in enumerate(lines):
        if i <= fm_end or i in fenced:
            continue
        if h1 < 0 and line.startswith("# "):
            h1 = i
            continue
        numbered = H2_NUMBERED.match(line)
        if numbered:
            h2_numbered.append((i, int(numbered.group(1)), numbered.group(2)))
        elif line.startswith("## "):
            h2_unnumbered.append((i, line[3:].strip()))
    return Doc(rel, lines, fenced, fm_end, h1, h2_numbered, h2_unnumbered, final_newline)


def mask_refs(text: str) -> str:
    """Hide section numbers so two heading texts compare on their words."""
    return SECTION_REF.sub("§#", text)


def norm_text(text: str) -> str:
    return re.sub(r"\s+", " ", mask_refs(text)).strip().casefold()


def heading_index(lines: List[str]) -> Dict[str, str]:
    """Map 'N' and 'N.M' to the heading text, reading headings outside code fences."""
    fenced = fenced_lines(lines)
    index: Dict[str, str] = {}
    for i, line in enumerate(lines):
        if i in fenced:
            continue
        h2 = H2_NUMBERED.match(line)
        if h2:
            index.setdefault(h2.group(1), h2.group(2))
            continue
        h3 = H3_NUMBERED.match(line)
        if h3:
            index.setdefault(f"{h3.group(2)}.{h3.group(3)}", h3.group(4).strip())
    return index


def upper_outside_code(text: str) -> str:
    """Uppercase prose and leave inline code spans exactly as written."""
    if "``" in text:
        raise ValueError(f"double-backtick span in heading: {text}")
    parts = re.split(r"(`[^`]*`)", text)
    return "".join(p if p.startswith("`") and p.endswith("`") and len(p) > 1 else p.upper() for p in parts)

# ───────────────────────────────────────────────────────────────
# 3. REFERENCE CLASSIFICATION
# ───────────────────────────────────────────────────────────────


def resolve_token(token: str, from_rel: str, changed: Set[str]) -> str:
    """Name the file a path token points at: SKILL.md, a file in the change set, or EXTERNAL."""
    if token.split("/")[-1] == "SKILL.md":
        return "SKILL.md"
    if "/" in token:
        candidate = posixpath.normpath(posixpath.join(posixpath.dirname(from_rel), token))
        return candidate if candidate in changed else f"EXTERNAL:{token}"
    matches = [c for c in changed if posixpath.basename(c) == token]
    if len(matches) == 1:
        return matches[0]
    sibling = posixpath.join(posixpath.dirname(from_rel), token)
    if sibling in changed:
        return sibling
    if len(matches) > 1:
        raise ValueError(f"{from_rel}: ambiguous file token {token}: {matches}")
    return f"EXTERNAL:{token}"


def slug_pattern(changed: Set[str]) -> Optional[re.Pattern]:
    """Match a type slug written directly before a reference.

    A single-word slug (process, state) is also an ordinary word, so it only counts when it
    carries the `type-` prefix. A hyphenated slug (high-level) counts on its own.
    """
    slugs = sorted(
        {posixpath.basename(c)[5:-3] for c in changed if posixpath.basename(c).startswith("type-")},
        key=len,
        reverse=True,
    )
    if not slugs:
        return None
    every = "|".join(re.escape(s) for s in slugs)
    hyphenated = "|".join(re.escape(s) for s in slugs if "-" in s)
    return re.compile(r"\b(?:type-(" + every + r")|(" + hyphenated + r"))\s*$")


def classify_line(line: str, rel: str, old_line: int, changed: Set[str], slugs: Optional[re.Pattern]) -> List[Ref]:
    """Find every section reference on a line and decide which file each one belongs to."""
    refs: List[Ref] = []
    previous: Optional[Ref] = None
    for match in SECTION_REF.finditer(line):
        before = line[: match.start()]
        after = line[match.end():]
        minor = int(match.group(2)) if match.group(2) is not None else None
        target, reason = rel, "bare reference to this file"
        override = TARGET_OVERRIDES.get((rel, old_line))
        file_before = FILE_TOKEN_BEFORE.search(before)
        file_after = FILE_TOKEN_AFTER.match(after)
        slug_before = slugs.search(before) if slugs else None
        if override:
            target, reason = override, "override: the sentence belongs to another file than its bare number suggests"
        elif file_before:
            target = resolve_token(file_before.group(1), rel, changed)
            reason = f"file before: {file_before.group(1)}"
        elif file_after:
            target = resolve_token(file_after.group(1), rel, changed)
            reason = f"file after: {file_after.group(1)}"
        elif slug_before:
            slug = slug_before.group(1) or slug_before.group(2)
            target = resolve_token(f"type-{slug}.md", rel, changed)
            reason = f"type slug before: {slug}"
        elif RULE_AFTER.match(after):
            target, reason = "SKILL.md", "followed by 'rule N', a SKILL.md rule number"
        elif previous and INHERIT_GAP.match(line[previous.end : match.start()]):
            target, reason = previous.target, f"list continuation of the reference before it ({previous.reason})"
        ref = Ref(old_line, match.start(), match.end(), int(match.group(1)), minor, target, reason)
        refs.append(ref)
        previous = ref
    return refs

# ───────────────────────────────────────────────────────────────
# 4. PLANNING
# ───────────────────────────────────────────────────────────────


def is_transparent(line: str) -> bool:
    stripped = line.strip()
    return not stripped or bool(re.fullmatch(r"<!--.*-->", stripped))


def decide_numbering(doc: Doc) -> Tuple[str, Dict[int, int], bool, bool]:
    """Return (mode, old-to-new map, insert_overview, number_unnumbered)."""
    has_overview = any("overview" in title.casefold() for _, _, title in doc.h2_numbered)
    number_unnumbered = not doc.h2_numbered and bool(doc.h2_unnumbered)
    if not doc.h2_numbered and not doc.h2_unnumbered:
        return "no-sections", {}, True, False
    insert = not has_overview
    olds = [n for _, n, _ in doc.h2_numbered]
    if len(set(olds)) != len(olds):
        raise ValueError(f"{doc.rel}: duplicate section numbers {olds}")
    offset = 1 if insert else 0
    start = 1 + offset
    mapping = {old: start + pos for pos, old in enumerate(olds)}
    mode = "wrap-overview" if insert else ("renumber" if any(k != v for k, v in mapping.items()) else "format-only")
    return mode, mapping, insert, number_unnumbered


def rewrite_refs(text: str, refs: List[Ref], plan: Plan, maps: Dict[str, Dict[int, int]]) -> str:
    """Rewrite the numbers of every reference whose target file is renumbered."""
    pieces: List[str] = []
    cursor = 0
    for ref in refs:
        pieces.append(text[cursor : ref.start])
        original = text[ref.start : ref.end]
        target_map = maps.get(ref.target)
        if target_map is None:
            pieces.append(original)
            plan.left_alone.append(
                {"file": plan.doc.rel, "line": ref.old_line, "ref": original, "target": ref.target, "reason": ref.reason}
            )
        elif ref.major not in target_map:
            pieces.append(original)
            plan.errors.append(f"{plan.doc.rel}:{ref.old_line}: {original} has no section {ref.major} in {ref.target}")
        elif target_map[ref.major] == ref.major:
            pieces.append(original)
            plan.left_alone.append(
                {"file": plan.doc.rel, "line": ref.old_line, "ref": original, "target": ref.target, "reason": "section number unchanged"}
            )
        else:
            new_major = target_map[ref.major]
            space = " " if re.match(r"§\s", original) else ""
            new_text = f"§{space}{new_major}" + (f".{ref.minor}" if ref.minor is not None else "")
            pieces.append(new_text)
            plan.rows.append(
                {
                    "file": plan.doc.rel,
                    "old_line": ref.old_line,
                    "old_ref": original,
                    "new_ref": new_text,
                    "target": ref.target,
                    "reason": ref.reason,
                    "context": text.strip()[:110],
                    "key_old": f"{ref.major}" if ref.minor is None else f"{ref.major}.{ref.minor}",
                    "key_new": f"{new_major}" if ref.minor is None else f"{new_major}.{ref.minor}",
                }
            )
        cursor = ref.end
    pieces.append(text[cursor:])
    return "".join(pieces)


def apply_edits(plan: Plan, work: List[str], edits: List[dict]) -> None:
    """Apply hand-listed prose edits to one line each, recording a verifiable row per section pair."""
    for edit in edits:
        idx = edit["line"] - 1
        if idx >= len(work) or work[idx].count(edit["find"]) != 1:
            plan.errors.append(f"{plan.doc.rel}:{edit['line']}: edit text not found exactly once: {edit['find']}")
            continue
        context = work[idx].strip()[:110]
        work[idx] = work[idx].replace(edit["find"], edit["replace"])
        for old_key, new_key in edit["pairs"]:
            plan.rows.append(
                {
                    "file": plan.doc.rel,
                    "old_line": edit["line"],
                    "old_ref": edit["find"],
                    "new_ref": edit["replace"],
                    "target": edit["target"],
                    "reason": "listed edit: " + edit["note"],
                    "context": context,
                    "key_old": old_key,
                    "key_new": new_key,
                }
            )


def plan_file(
    doc: Doc,
    maps: Dict[str, Dict[int, int]],
    changed: Set[str],
    slugs: Optional[re.Pattern],
    edits: Optional[List[dict]] = None,
) -> Plan:
    """Build the new text of one file and record every reference it rewrites."""
    mode, mapping, insert, number_unnumbered = decide_numbering(doc)
    plan = Plan(doc, mode, mapping, [], {})
    work = list(doc.lines)
    apply_edits(plan, work, edits or [])
    if doc.h1 < 0:
        plan.errors.append(f"{doc.rel}: no H1")
        return plan
    h2_by_line = {i: (n, t) for i, n, t in doc.h2_numbered}
    unnumbered_by_line = {i: t for i, t in doc.h2_unnumbered} if number_unnumbered else {}
    unnumbered_order = {i: pos for pos, (i, _) in enumerate(doc.h2_unnumbered)} if number_unnumbered else {}

    entries: List[Tuple[Optional[int], str]] = []
    for i, line in enumerate(work):
        if i <= doc.fm_end:
            if SECTION_REF.search(line):
                plan.left_alone.append(
                    {"file": doc.rel, "line": i + 1, "ref": SECTION_REF.search(line).group(0), "target": "frontmatter", "reason": "frontmatter is not edited"}
                )
            entries.append((i, line))
            continue
        prefix, body = "", line
        heading_kind = None
        if i in h2_by_line and i not in doc.fenced:
            n, title = h2_by_line[i]
            prefix, body, heading_kind = f"## {mapping[n]}. ", title, "h2"
        elif i in unnumbered_by_line and i not in doc.fenced:
            prefix, body, heading_kind = f"## {2 + unnumbered_order[i]}. ", unnumbered_by_line[i], "h2"
        elif i not in doc.fenced:
            h3 = H3_NUMBERED.match(line)
            if h3 and int(h3.group(2)) in mapping:
                new_n = mapping[int(h3.group(2))]
                prefix = f"{h3.group(1)} {new_n}.{h3.group(3)}"
                body = h3.group(4)
                heading_kind = "h3"
                if new_n != int(h3.group(2)):
                    plan.h3_shifted += 1
        refs = classify_line(body, doc.rel, i + 1, changed, slugs)
        new_body = rewrite_refs(body, refs, plan, maps)
        if heading_kind == "h2":
            new_body = upper_outside_code(new_body)
        new_line = prefix + new_body if heading_kind else new_body
        entries.append((i, new_line))

    if insert:
        first_text = doc.h1 + 1
        while first_text < len(entries) and not entries[first_text][1].strip():
            first_text += 1
        has_intro = first_text < len(entries) and not (
            entries[first_text][1].startswith("## ") or entries[first_text][1].strip() == "---"
        )
        if not has_intro:
            plan.errors.append(f"{doc.rel}: no intro prose between the H1 and the first section to wrap")
            return plan
        entries[doc.h1 + 1 : first_text] = [(None, ""), (None, "## 1. OVERVIEW"), (None, "")]

    entries, plan.dividers_added = add_dividers(entries)
    plan.new_lines = [text for _, text in entries]
    plan.new_pos = {old: pos + 1 for pos, (old, _) in enumerate(entries) if old is not None}
    return plan


def add_dividers(entries: List[Tuple[Optional[int], str]]) -> Tuple[List[Tuple[Optional[int], str]], int]:
    """Put a `---` above every numbered H2 after the first one."""
    fenced = fenced_lines([text for _, text in entries])
    added = 0
    numbered = [k for k, (_, text) in enumerate(entries) if k not in fenced and H2_NUMBERED.match(text)]
    for k in reversed(numbered[1:]):
        q = k - 1
        while q >= 0 and is_transparent(entries[q][1]):
            q -= 1
        if q >= 0 and entries[q][1].strip() == "---":
            continue
        # A comment line between the content and the heading stays where it is, because a
        # marker such as a table's end sentinel must keep its place. The rule goes right above the heading.
        last_comment = q
        for j in range(q + 1, k):
            if entries[j][1].strip():
                last_comment = j
        entries[last_comment + 1 : k] = [(None, ""), (None, "---"), (None, "")]
        added += 1
    return entries, added

# ───────────────────────────────────────────────────────────────
# 5. VERIFICATION
# ───────────────────────────────────────────────────────────────


def verify_rows(plans: Dict[str, Plan], old_index: Dict[str, Dict[str, str]]) -> None:
    """Compare each rewritten reference's old target heading with the new one, read from the new text."""
    new_index = {rel: heading_index(p.new_lines) for rel, p in plans.items()}
    for plan in plans.values():
        for row in plan.rows:
            old_text = old_index[row["target"]].get(row["key_old"])
            new_text = new_index[row["target"]].get(row["key_new"])
            row["old_heading"] = old_text if old_text is not None else "(MISSING)"
            row["new_heading"] = new_text if new_text is not None else "(MISSING)"
            row["equal"] = old_text is not None and new_text is not None and norm_text(old_text) == norm_text(new_text)
            row["new_line"] = plans[row["file"]].new_pos.get(row["old_line"] - 1, -1)


def write_reports(plans: Dict[str, Plan], out: Path) -> Tuple[int, int, int]:
    out.mkdir(parents=True, exist_ok=True)
    rows = [row for p in plans.values() for row in p.rows]
    left = [row for p in plans.values() for row in p.left_alone]
    mismatches = sum(1 for r in rows if not r["equal"])
    cols = ["file", "old_line", "new_line", "old_ref", "new_ref", "target", "old_heading", "new_heading", "equal", "reason", "context"]
    with open(out / "rewrite-table.tsv", "w", encoding="utf-8") as fh:
        fh.write("\t".join(cols) + "\n")
        for r in rows:
            fh.write("\t".join(str(r[c]).replace("\t", " ") for c in cols) + "\n")
    with open(out / "left-alone.tsv", "w", encoding="utf-8") as fh:
        fh.write("file\tline\tref\ttarget\treason\n")
        for r in left:
            fh.write("\t".join(str(r[c]) for c in ["file", "line", "ref", "target", "reason"]) + "\n")
    lines = [f"files={len(plans)}", f"rows={len(rows)}", f"mismatches={mismatches}", f"left_alone={len(left)}"]
    for plan in plans.values():
        lines.append(
            f"{plan.doc.rel}\tmode={plan.mode}\trewritten={len(plan.rows)}\tleft={len(plan.left_alone)}"
            f"\th3_shifted={plan.h3_shifted}\tdividers_added={plan.dividers_added}\terrors={len(plan.errors)}"
        )
        lines.extend(f"  ERROR {e}" for e in plan.errors)
    (out / "summary.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    errors = sum(len(p.errors) for p in plans.values())
    return len(rows), mismatches, errors

# ───────────────────────────────────────────────────────────────
# 6. COMMANDS
# ───────────────────────────────────────────────────────────────


def read_files(repo: Path, rels: List[str]) -> Dict[str, Doc]:
    return {rel: parse_doc(rel, (repo / rel).read_text(encoding="utf-8")) for rel in rels}


def load_edits(path: Optional[str]) -> Dict[str, List[dict]]:
    grouped: Dict[str, List[dict]] = {}
    if not path:
        return grouped
    for edit in json.loads(Path(path).read_text(encoding="utf-8")):
        grouped.setdefault(edit["file"], []).append(edit)
    return grouped


def build_plans(
    repo: Path, rels: List[str], edits_path: Optional[str] = None
) -> Tuple[Dict[str, Plan], Dict[str, Dict[str, str]]]:
    docs = read_files(repo, rels)
    changed = set(rels)
    slugs = slug_pattern(changed)
    edits = load_edits(edits_path)
    maps = {rel: decide_numbering(doc)[1] for rel, doc in docs.items()}
    old_index = {rel: heading_index(doc.lines) for rel, doc in docs.items()}
    plans = {rel: plan_file(doc, maps, changed, slugs, edits.get(rel)) for rel, doc in docs.items()}
    for rel, listed in edits.items():
        if rel in plans:
            continue
        doc = parse_doc(rel, (repo / rel).read_text(encoding="utf-8"))
        plan = Plan(doc, "edit-only", {}, [], {})
        work = list(doc.lines)
        apply_edits(plan, work, listed)
        plan.new_lines = work
        plan.new_pos = {k: k + 1 for k in range(len(work))}
        plans[rel] = plan
    verify_rows(plans, old_index)
    return plans, old_index


def render(plan: Plan) -> str:
    text = "\n".join(plan.new_lines)
    return text + ("\n" if plan.doc.final_newline else "")


def cmd_plan(repo: Path, rels: List[str], out: Path, write: bool, edits_path: Optional[str]) -> int:
    plans, _ = build_plans(repo, rels, edits_path)
    rows, mismatches, errors = write_reports(plans, out)
    for rel, plan in plans.items():
        preview = out / "new" / rel
        preview.parent.mkdir(parents=True, exist_ok=True)
        preview.write_text(render(plan), encoding="utf-8")
    print(f"files={len(plans)} rows={rows} mismatches={mismatches} errors={errors}")
    if mismatches or errors:
        return 1
    if write:
        for rel, plan in plans.items():
            (repo / rel).write_text(render(plan), encoding="utf-8")
        print(f"wrote {len(plans)} files")
    return 0


def read_rev(repo: Path, rel: str, rev: Optional[str]) -> str:
    if rev is None:
        return (repo / rel).read_text(encoding="utf-8")
    return subprocess.run(
        ["git", "-c", "core.fsmonitor=false", "show", f"{rev}:{rel}"], cwd=repo, capture_output=True, text=True, check=True
    ).stdout


def cmd_verify(repo: Path, rels: List[str], out: Path, rev: Optional[str]) -> int:
    """Scan every reference and report any that points at a section the target file does not have."""
    docs = {rel: parse_doc(rel, read_rev(repo, rel, rev)) for rel in rels}
    changed = set(rels)
    slugs = slug_pattern(changed)
    index = {rel: heading_index(doc.lines) for rel, doc in docs.items()}
    skill_cache: Dict[str, Dict[str, str]] = {}
    dangling: List[str] = []
    total = 0
    for rel, doc in docs.items():
        for i, line in enumerate(doc.lines):
            if i <= doc.fm_end:
                continue
            for ref in classify_line(line, rel, i + 1, changed, slugs):
                key = f"{ref.major}" if ref.minor is None else f"{ref.major}.{ref.minor}"
                target = ref.target
                if target == "SKILL.md":
                    skill_path = posixpath.join(posixpath.dirname(rel).split("/references")[0], "SKILL.md")
                    if skill_path not in skill_cache:
                        skill_cache[skill_path] = heading_index(
                            parse_doc(skill_path, read_rev(repo, skill_path, rev)).lines
                        )
                    table = skill_cache[skill_path]
                elif target in index:
                    table = index[target]
                else:
                    continue
                total += 1
                if key not in table:
                    dangling.append(f"{rel}:{i + 1}: {SECTION_REF.search(line[ref.start:ref.end]).group(0)} -> {target} has no section {key}")
    out.mkdir(parents=True, exist_ok=True)
    label = rev or "disk"
    (out / f"verify-{label.replace('/', '_')}.txt").write_text(
        f"source={label}\nchecked={total}\ndangling={len(dangling)}\n" + "\n".join(dangling) + "\n", encoding="utf-8"
    )
    print(f"source={label} checked={total} dangling={len(dangling)}")
    for item in dangling:
        print("  " + item)
    return 1 if dangling else 0


def has_overview_heading(lines: List[str]) -> bool:
    fenced = fenced_lines(lines)
    return any(i not in fenced and re.match(r"^## \d+\. .*overview", line, re.I) for i, line in enumerate(lines))


def normalize_for_compare(lines: List[str], drop_inserted_overview: bool = False) -> List[str]:
    """Strip what the tool may change: section numbers, heading case, rules, blanks and an inserted overview heading."""
    fenced = fenced_lines(lines)
    kept: List[str] = []
    for i, line in enumerate(lines):
        if i not in fenced and (not line.strip() or line.strip() == "---" or (drop_inserted_overview and line == "## 1. OVERVIEW")):
            continue
        text = SECTION_REF.sub("§#", line)
        if i not in fenced:
            h2 = re.match(r"^## (?:\d+\. )?(.*)$", text)
            if h2:
                text = "## " + upper_outside_code(h2.group(1))
            else:
                text = re.sub(r"^(#{3,6}) \d+\.(\d+)\b", r"\1 #.\2", text)
        kept.append(text)
    return kept


def cmd_preserved(repo: Path, rels: List[str], out: Path, rev: str, edits_path: Optional[str]) -> int:
    """List every line that differs once the allowed edits are removed from both sides."""
    edits = load_edits(edits_path)
    problems: List[str] = []
    checked = list(rels) + [rel for rel in edits if rel not in rels]
    for rel in checked:
        old_lines = parse_doc(rel, read_rev(repo, rel, rev)).lines
        old = normalize_for_compare(old_lines)
        new_lines = parse_doc(rel, read_rev(repo, rel, None)).lines
        for edit in edits.get(rel, []):
            new_lines = [line.replace(edit["replace"], edit["find"]) for line in new_lines]
        new = normalize_for_compare(new_lines, drop_inserted_overview=not has_overview_heading(old_lines))
        if old == new:
            continue
        for k in range(max(len(old), len(new))):
            a = old[k] if k < len(old) else "(end)"
            b = new[k] if k < len(new) else "(end)"
            if a != b:
                problems.append(f"{rel}: compare line {k + 1}\n  old: {a[:160]}\n  new: {b[:160]}")
                break
    out.mkdir(parents=True, exist_ok=True)
    (out / "preserved.txt").write_text(f"files={len(checked)}\ndiffering={len(problems)}\n" + "\n".join(problems) + "\n", encoding="utf-8")
    print(f"files={len(checked)} differing={len(problems)}")
    for item in problems:
        print(item)
    return 1 if problems else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["plan", "apply", "verify", "preserved"])
    parser.add_argument("file_list")
    parser.add_argument("--out", required=True)
    parser.add_argument("--repo", default=".")
    parser.add_argument("--rev", default=None)
    parser.add_argument("--edits", default=None, help="JSON list of hand-listed prose edits")
    args = parser.parse_args()
    repo = Path(args.repo).resolve()
    rels = [line.strip() for line in Path(args.file_list).read_text().splitlines() if line.strip()]
    out = Path(args.out)
    if args.command == "verify":
        return cmd_verify(repo, rels, out, args.rev)
    if args.command == "preserved":
        return cmd_preserved(repo, rels, out, args.rev or "HEAD", args.edits)
    return cmd_plan(repo, rels, out, write=args.command == "apply", edits_path=args.edits)


if __name__ == "__main__":
    sys.exit(main())
