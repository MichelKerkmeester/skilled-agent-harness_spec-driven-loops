#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: Lane D Packaging Scaffolder
# ───────────────────────────────────────────────────────────────
"""Lane D packaging scaffolder for the deep-improvement skill.

Reads ONE packaging config JSON, validates it against the Lane D schema, renders all
parameterized templates into the target packaging root, and prints the conformance
checklist commands.

Usage:
  python3 init_packaging.py --config <packaging_config.json> [--dest <packaging_root>] [--check-only]

  --config      Path to the packaging config JSON (required).
  --dest        Target packaging root (overrides packaging_root in the config).
  --check-only  Render to a temp dir, report, do NOT touch the destination.

Idempotent: re-running overwrites rendered files but never removes user data.
Stdlib-only: no external Python dependencies beyond what ships with Python 3.9+.
"""
import argparse
import json
import os
import py_compile
import re
import sys
import tempfile
from typing import Any, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_ROOT = os.path.dirname(os.path.dirname(HERE))
TEMPLATES_DIR = os.path.join(SKILL_ROOT, "assets", "non_dev_ai_system", "templates")
SCHEMA_PATH = os.path.join(SKILL_ROOT, "assets", "non_dev_ai_system", "packaging_config.schema.json")

TEMPLATE_FILES = {
    "benchmark/_loop/loop.py": "loop.py.template",
    "benchmark/_loop/gauntlet.py": "gauntlet.py.template",
    "benchmark/_gates/gates.py": "gates.py.template",
    "benchmark/_gates/derive.py": "derive.py.template",
    "benchmark/run.sh": "run.sh.template",
    "benchmark/grader/regrade.py": "regrade.py.template",
    "benchmark/grader/grader_prompt.md": "grader_prompt.md.template",
    "benchmark/grader/deterministic_lint.py": "deterministic_lint.py.template",
    "benchmark/grader/calibrate.py": "calibrate.py.template",
}


def load_json(path: str) -> Any:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def validate_config(cfg: dict[str, Any]) -> list[str]:
    """Plain-Python schema validation. Returns a list of error strings (empty => valid)."""
    errs = []

    required = [
        "packaging_root", "system_name", "dimensions", "score_total", "ship_threshold",
        "self_score_regex", "frozen_surface", "anchors", "technique_doc_map",
        "derived_copies", "synthesized_surfaces", "fixtures", "models", "harness", "lexicon",
    ]
    for r in required:
        if r not in cfg:
            errs.append(f"missing required field: {r}")

    if not isinstance(cfg.get("dimensions"), dict) or len(cfg.get("dimensions", {})) < 1:
        errs.append("dimensions must be a non-empty object")
    else:
        for k, v in cfg["dimensions"].items():
            if not re.match(r"^[A-Z]$", k):
                errs.append(f"dimension key '{k}' must be a single uppercase letter")
            if not isinstance(v, dict):
                errs.append(f"dimension '{k}' value must be an object")
            else:
                for f in ("floor", "max"):
                    val = v.get(f)
                    if not isinstance(val, int) or val < 0:
                        errs.append(f"dimension '{k}.{f}' must be a non-negative integer")

    ssr = cfg.get("self_score_regex", "")
    if isinstance(ssr, str) and ('"' in ssr or "\n" in ssr):
        errs.append("self_score_regex must not contain double quotes or newlines (it is embedded in a Python r\"...\" literal)")

    if not isinstance(cfg.get("score_total"), int) or cfg["score_total"] < 1:
        errs.append("score_total must be a positive integer")
    if not isinstance(cfg.get("ship_threshold"), int) or cfg["ship_threshold"] < 1:
        errs.append("ship_threshold must be a positive integer")

    if not isinstance(cfg.get("frozen_surface"), list) or len(cfg.get("frozen_surface", [])) < 1:
        errs.append("frozen_surface must be a non-empty array")
    else:
        for i, entry in enumerate(cfg["frozen_surface"]):
            if not isinstance(entry, dict):
                errs.append(f"frozen_surface[{i}] must be an object")
            else:
                if "frozen_name" not in entry:
                    errs.append(f"frozen_surface[{i}] missing frozen_name")
                if "live_relpath" not in entry:
                    errs.append(f"frozen_surface[{i}] missing live_relpath")

    if not isinstance(cfg.get("anchors"), list) or len(cfg.get("anchors", [])) < 1:
        errs.append("anchors must be a non-empty array")

    if not isinstance(cfg.get("technique_doc_map"), dict) or len(cfg.get("technique_doc_map", {})) < 1:
        errs.append("technique_doc_map must be a non-empty object")

    if not isinstance(cfg.get("derived_copies"), list):
        errs.append("derived_copies must be an array")
    else:
        for i, entry in enumerate(cfg["derived_copies"]):
            if not isinstance(entry, dict) or not entry.get("src_relpath"):
                errs.append(f"derived_copies[{i}] must be an object with a non-empty src_relpath")
            sr = entry.get("src_root") if isinstance(entry, dict) else None
            if sr is not None and (not isinstance(sr, str) or not sr or sr.startswith("/") or ".." in sr.split("/")):
                errs.append(f"derived_copies[{i}].src_root must be a non-empty packaging-relative path (no leading '/', no '..')")
                continue
            if not isinstance(entry.get("targets"), list) or not entry["targets"]:
                errs.append(f"derived_copies[{i}].targets must be a non-empty array")
                continue
            for j, target in enumerate(entry["targets"]):
                if not isinstance(target, dict) or not target.get("relpath"):
                    errs.append(f"derived_copies[{i}].targets[{j}] must be an object with a non-empty relpath")
                    continue
                mode = target.get("mode", "copy")
                if mode not in ("copy", "symlink"):
                    errs.append(f"derived_copies[{i}].targets[{j}].mode must be 'copy' or 'symlink'")
                if mode == "symlink":
                    if not target.get("link_target"):
                        errs.append(f"derived_copies[{i}].targets[{j}] mode=symlink requires a non-empty link_target")
                    if target.get("is_skill_ref") or target.get("transform", "none") != "none":
                        errs.append(f"derived_copies[{i}].targets[{j}] mode=symlink cannot combine with is_skill_ref/transform")
                elif target.get("transform", "none") not in ("none", "skill_strip"):
                    errs.append(f"derived_copies[{i}].targets[{j}].transform must be 'none' or 'skill_strip'")

    if not isinstance(cfg.get("synthesized_surfaces"), list):
        errs.append("synthesized_surfaces must be an array")

    fixtures = cfg.get("fixtures", {})
    for f in ("visible", "held_out", "variants"):
        if not isinstance(fixtures.get(f), list) or len(fixtures.get(f, [])) < 1:
            errs.append(f"fixtures.{f} must be a non-empty array")

    models = cfg.get("models", {})
    for m in ("proposer", "grader", "proposer_family"):
        if not isinstance(models.get(m), str) or not models.get(m):
            errs.append(f"models.{m} must be a non-empty string")

    harness = cfg.get("harness", {})
    if not isinstance(harness.get("benchmark_mode_instructions"), dict) or len(harness.get("benchmark_mode_instructions", {})) < 1:
        errs.append("harness.benchmark_mode_instructions must be a non-empty object")

    lexicon = cfg.get("lexicon", {})
    if not isinstance(lexicon.get("hard_blocker_words"), list) or len(lexicon.get("hard_blocker_words", [])) < 1:
        errs.append("lexicon.hard_blocker_words must be a non-empty array")
    if not isinstance(lexicon.get("hard_blocker_patterns"), list) or len(lexicon.get("hard_blocker_patterns", [])) < 1:
        errs.append("lexicon.hard_blocker_patterns must be a non-empty array")

    return errs


def dimension_keys_ordered(dims: dict[str, Any]) -> list[str]:
    """Return dimension keys in the order they appear in the dict."""
    return list(dims.keys())



def py_lit(value: Any) -> str:
    """Render a config value as a Python literal for .py templates.

    json.dumps emits JSON booleans/null (true/false/null), which are NameErrors when the
    rendered token lands in Python source; repr emits valid Python for the same data.
    """
    return repr(value)

def build_placeholders(cfg: dict[str, Any], dest: Optional[str]) -> dict[str, str]:
    """Build the full placeholder map from the config."""
    dims = cfg["dimensions"]
    dim_keys = dimension_keys_ordered(dims)
    fixtures = cfg["fixtures"]
    models = cfg["models"]
    harness = cfg["harness"]
    lexicon = cfg["lexicon"]

    packaging_root = dest if dest else cfg.get("packaging_root", "")
    packaging_root_parent = os.path.dirname(packaging_root)
    worktree_subdir = cfg.get("worktree_subdir", os.path.basename(packaging_root))

    # Floors and maxes as separate JSON objects
    floors = {k: v["floor"] for k, v in dims.items()}
    maxes = {k: v["max"] for k, v in dims.items()}

    # Worktree prefix
    wt_prefix = cfg.get("worktree_prefix", "")
    if not wt_prefix:
        # Auto-slug from worktree_subdir
        wt_prefix = re.sub(r"[^a-z0-9]+", "-", worktree_subdir.lower()).strip("-") + "-loop-"

    # Manifest note
    manifest_note = cfg.get("manifest_note", f"Immutable {cfg['system_name']} scoring surface.")

    # System name short
    sys_name_short = cfg.get("system_name_short", cfg["system_name"])

    # Grader prompt: dimension descriptions and JSON template
    dim_descs = ", ".join(f"{k} out of {v['max']}" for k, v in dims.items())
    json_template_dim_keys = [f'"{k}": 0' for k in dim_keys]
    grader_json_template = '{' + ", ".join(json_template_dim_keys) + ', "total": 0, "floors_met": true, "notes": "one short line"}'

    # Variants for bash
    variants_usage = "|".join(fixtures["variants"])

    # Benchmark variant cases (bash case statements)
    def _sh_dq(text: str) -> str:
        """Escape for a double-quoted sh context (the SYS=\"...\" assignment).
        Backslash, double quote and backtick are escaped; $ is preserved ONLY for the
        deliberate $CW substitution below, so escape $ first and restore the token after."""
        out = text.replace("\\", "\\\\").replace('"', '\\"').replace("`", "\\`").replace("$", "\\$")
        return out

    variant_cases_lines = []
    bmi = harness["benchmark_mode_instructions"]
    preludes = harness.get("benchmark_variant_preludes", {})
    # Every prelude key must name a declared variant.
    unknown_preludes = sorted(set(preludes) - set(fixtures["variants"]))
    if unknown_preludes:
        sys.exit(f"init_packaging: benchmark_variant_preludes keys not in fixtures.variants: {unknown_preludes}")
    for v_name in fixtures["variants"]:
        prelude = preludes.get(v_name, "")
        instruction = _sh_dq(bmi.get(v_name, ""))
        # Replace template tokens with shell equivalents (after escaping, restore the variable ref)
        instruction = instruction.replace("\\${{CW}}", "$CW").replace("{{CW}}", "$CW")
        if prelude:
            variant_cases_lines.append(f'  {v_name})\n    {prelude}\n    SYS="{instruction}" ;;')
        else:
            variant_cases_lines.append(f'  {v_name})\n    SYS="{instruction}" ;;')
    variant_cases = "\n".join(variant_cases_lines)

    # Build the map
    p = {
        "PACKAGING_ROOT": packaging_root,
        "PACKAGING_ROOT_PARENT": packaging_root_parent,
        "PACKAGING_ROOT_ENV": cfg.get("packaging_root_env", "CW_ROOT"),
        "SYSTEM_NAME": cfg["system_name"],
        "SYSTEM_NAME_SHORT": sys_name_short,
        "WORKTREE_PREFIX": wt_prefix,
        "WORKTREE_SUBDIR": worktree_subdir,
        "MANIFEST_NOTE": manifest_note,
        "SCORE_TOTAL": str(cfg["score_total"]),
        "SHIP_THRESHOLD": str(cfg["ship_threshold"]),
        "SELF_SCORE_REGEX": cfg["self_score_regex"],
        "PROPOSER_MODEL": models["proposer"],
        "GRADER_MODEL": models["grader"],
        "PROPOSER_FAMILY": models["proposer_family"],

        # JSON-serialized placeholders
        "DIMENSIONS_KEYS": py_lit(dim_keys),
        "DIMENSIONS_FLOORS": py_lit(floors),
        "DIMENSIONS_MAXES": py_lit(maxes),
        "FROZEN_SURFACE": py_lit(cfg["frozen_surface"]),
        # The grader rubric is the anchored scoring subset of the frozen surface,
        # never the full surface that includes the large hard-rules doc.
        "RUBRIC_FROZEN_FILES": py_lit([e["frozen_name"] for e in cfg["frozen_surface"] if e.get("in_rubric", bool(e.get("section_anchor")))]),
        "ANCHORS": py_lit(cfg["anchors"]),
        "TECHNIQUE_DOC_MAP": py_lit(cfg["technique_doc_map"]),
        "DERIVE_SOURCE_ROOT": py_lit(cfg.get("derive_source_root", "knowledge base")),
        "DERIVED_COPIES": py_lit(cfg["derived_copies"]),
        "SYNTHESIZED_SURFACES": py_lit(cfg["synthesized_surfaces"]),
        "SKILL_FRONTMATTER": py_lit(cfg.get("skill_reference_frontmatter", {})),
        "HARD_BLOCKER_WORDS": py_lit(lexicon["hard_blocker_words"]),
        "HARD_BLOCKER_PATTERNS": py_lit(lexicon["hard_blocker_patterns"]),
        "SOFT_PHRASE_PATTERNS": py_lit(lexicon.get("soft_phrase_patterns", [])),

        # CSV-serialized placeholders
        "FIXTURES_VISIBLE_CSV": py_lit(",".join(fixtures["visible"])),
        "FIXTURES_HELD_OUT_CSV": py_lit(",".join(fixtures["held_out"])),
        "FIXTURES_VARIANTS_CSV": py_lit(",".join(fixtures["variants"])),

        # Special bash-shell placeholders
        "VARIANTS_USAGE": variants_usage,
        "BENCHMARK_VARIANT_CASES": variant_cases,

        # Special grader prompt placeholders
        "GRADER_DIMS_DESCRIPTION": dim_descs,
        "GRADER_JSON_TEMPLATE": grader_json_template,
    }
    return p


def resolve_template(template_content: str, placeholders: dict[str, str]) -> str:
    """Replace all {{KEY}} placeholders with their values."""
    result = template_content

    # Sort by key length descending so longer keys match first (avoid partial matches)
    for key in sorted(placeholders, key=len, reverse=True):
        value = placeholders[key]
        result = result.replace("{{" + key + "}}", value)

    # Unresolved placeholders are fatal: py_compile only protects .py files, so a broken
    # markdown/shell render would otherwise ship silently
    remaining = re.findall(r"\{\{[A-Z_]+\}\}", result)
    if remaining:
        sys.exit(f"FATAL: unresolved placeholders remain: {remaining}")

    return result


def render_all(dest: str, placeholders: dict[str, str], report_only: bool = False) -> dict[str, str]:
    """Render all templates into the destination directory.

    Two-phase for atomicity: phase 1 renders EVERY template in memory, so any
    template or placeholder error aborts before a single file is written; phase
    2 writes the complete set. A re-run remains idempotent.
    """
    rendered = {}
    for out_rel, tpl_name in TEMPLATE_FILES.items():
        tpl_path = os.path.join(TEMPLATES_DIR, tpl_name)
        if not os.path.exists(tpl_path):
            print(f"SKIP: template not found: {tpl_path}")
            continue
        with open(tpl_path, encoding="utf-8") as f:
            content = f.read()
        rendered[out_rel] = resolve_template(content, placeholders)
    if not report_only:
        for out_rel, rendered_content in rendered.items():
            out_path = os.path.join(dest, out_rel)
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(rendered_content)
            # Make .py and .sh files executable
            if out_rel.endswith((".py", ".sh")):
                os.chmod(out_path, 0o755)
    return rendered


def write_gitignore(dest: str, report_only: bool = False) -> None:
    """Write the .gitignore for loop state and benchmark results."""
    gi_path = os.path.join(dest, ".gitignore")
    lines = [
        "benchmark/_loop/state/",
        "benchmark/results/",
        "__pycache__/",
    ]
    if not report_only:
        if os.path.exists(gi_path):
            existing = set(l.strip() for l in open(gi_path).readlines() if l.strip() and not l.startswith("#"))
            needed = set(l for l in lines if l.strip())
            merged = sorted(existing | needed)
            with open(gi_path, "w") as f:
                f.write("\n".join(merged) + "\n")
        else:
            with open(gi_path, "w") as f:
                f.write("\n".join(lines) + "\n")


def print_checklist_commands(cfg: dict[str, Any], dest: str) -> None:
    """Print conformance checklist commands."""
    print("\n===== CONFORMANCE CHECKLIST COMMANDS =====")
    print(f"cd {dest}")
    print(f"python3 benchmark/_gates/gates.py freeze")
    print(f"python3 benchmark/_gates/derive.py check")
    print(f"python3 benchmark/_loop/loop.py --dry-run")
    print(f"python3 benchmark/_loop/gauntlet.py")
    print(f"")
    print("Verify items:")
    print("  - [ ] benchmark/_loop/loop.py --dry-run exits 0")
    print("  - [ ] benchmark/_gates/gates.py freeze; check exits 0")
    print("  - [ ] benchmark/_gates/derive.py derive && check exits 0")
    print("  - [ ] All fixtures produce <DELIVERABLE> blocks")
    print("  - [ ] deterministic_lint.py enforces hard rules")
    print(f"  - [ ] Grader model ({cfg['models']['grader']}) is different family from proposer ({cfg['models']['proposer_family']})")
    print("  - [ ] benchmark/_loop/gauntlet.py battery fully green (9 attacks, 10 checks, dispatch-free)")
    print("  - [ ] benchmark/_loop/state/ is gitignored")


def verify_render(dest: str) -> list[str]:
    """Run py_compile on all rendered .py files. Returns list of errors."""
    errors = []
    for out_rel in sorted(TEMPLATE_FILES):
        if not out_rel.endswith(".py"):
            continue
        out_path = os.path.join(dest, out_rel)
        if not os.path.exists(out_path):
            errors.append(f"MISSING: {out_rel}")
            continue
        try:
            py_compile.compile(out_path, doraise=True)
        except py_compile.PyCompileError as e:
            errors.append(f"COMPILE ERROR in {out_rel}: {e}")
    return errors


def main() -> None:
    ap = argparse.ArgumentParser(description="Lane D packaging scaffolder")
    ap.add_argument("--config", required=True, help="Path to packaging_config.json")
    ap.add_argument("--dest", default=None, help="Target packaging root (overrides config)")
    ap.add_argument("--check-only", action="store_true", help="Render to temp dir, do not write destination")
    args = ap.parse_args()

    # Load config
    if not os.path.exists(args.config):
        sys.exit(f"Config file not found: {args.config}")
    cfg = load_json(args.config)

    # Validate
    errs = validate_config(cfg)
    if errs:
        print("VALIDATION ERRORS:", file=sys.stderr)
        for e in errs:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)
    print(f"Config validated ({len(cfg['dimensions'])} dimensions: {list(cfg['dimensions'])})")

    # Determine destination
    dest = args.dest or cfg.get("packaging_root", "")
    if not dest:
        sys.exit("No destination: provide --dest or set packaging_root in config")

    placeholders = build_placeholders(cfg, dest)

    if args.check_only:
        with tempfile.TemporaryDirectory(prefix="deep-improvement-check-") as tmpdir:
            render_all(tmpdir, placeholders)
            write_gitignore(tmpdir, report_only=True)
            print(f"\nRendered to temp dir: {tmpdir}")
            print(f"(check-only mode — destination NOT modified)")
            errors = verify_render(tmpdir)
            if errors:
                print("\nPyCompile ERRORS:", file=sys.stderr)
                for e in errors:
                    print(f"  {e}", file=sys.stderr)
                sys.exit(1)
            print("\nAll .py files compile cleanly.")
            print_checklist_commands(cfg, dest)
    else:
        print(f"Rendering into: {dest}")
        render_all(dest, placeholders)
        write_gitignore(dest)
        print("Done.")

        errors = verify_render(dest)
        if errors:
            print("\nPyCompile ERRORS:", file=sys.stderr)
            for e in errors:
                print(f"  {e}", file=sys.stderr)
            sys.exit(1)
        print("All .py files compile cleanly.")
        print_checklist_commands(cfg, dest)


if __name__ == "__main__":
    main()
