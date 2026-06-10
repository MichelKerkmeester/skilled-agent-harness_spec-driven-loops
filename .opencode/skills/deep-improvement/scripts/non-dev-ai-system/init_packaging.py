#!/usr/bin/env python3
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
import os, sys, json, shutil, argparse, tempfile, re, py_compile, traceback

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_ROOT = os.path.dirname(os.path.dirname(HERE))
TEMPLATES_DIR = os.path.join(SKILL_ROOT, "assets", "non_dev_ai_system", "templates")
SCHEMA_PATH = os.path.join(SKILL_ROOT, "assets", "non_dev_ai_system", "packaging_config.schema.json")

TEMPLATE_FILES = {
    "_loop/loop.py": "loop.py.template",
    "_loop/gauntlet.py": "gauntlet.py.template",
    "_gates/gates.py": "gates.py.template",
    "_gates/derive.py": "derive.py.template",
    "benchmark/run.sh": "run.sh.template",
    "benchmark/grader/regrade.py": "regrade.py.template",
    "benchmark/grader/grader_prompt.md": "grader_prompt.md.template",
    "benchmark/grader/deterministic_lint.py": "deterministic_lint.py.template",
    "benchmark/grader/calibrate.py": "calibrate.py.template",
}


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def validate_config(cfg):
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


def dimension_keys_ordered(dims):
    """Return dimension keys in the order they appear in the dict."""
    return list(dims.keys())


def build_placeholders(cfg, dest):
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
    variant_cases_lines = []
    bmi = harness["benchmark_mode_instructions"]
    preludes = harness.get("benchmark_variant_preludes", {})
    for v_name in fixtures["variants"]:
        prelude = preludes.get(v_name, "")
        instruction = bmi.get(v_name, "")
        # Replace template tokens with shell equivalents
        instruction = instruction.replace("{{CW}}", "$CW")
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
        "DIMENSIONS_KEYS": json.dumps(dim_keys),
        "DIMENSIONS_FLOORS": json.dumps(floors),
        "DIMENSIONS_MAXES": json.dumps(maxes),
        "FROZEN_SURFACE": json.dumps(cfg["frozen_surface"]),
        "ANCHORS": json.dumps(cfg["anchors"]),
        "TECHNIQUE_DOC_MAP": json.dumps(cfg["technique_doc_map"]),
        "DERIVED_COPIES": json.dumps(cfg["derived_copies"]),
        "SYNTHESIZED_SURFACES": json.dumps(cfg["synthesized_surfaces"]),
        "SKILL_FRONTMATTER": json.dumps(cfg.get("skill_reference_frontmatter", {})),
        "HARD_BLOCKER_WORDS": json.dumps(lexicon["hard_blocker_words"]),
        "HARD_BLOCKER_PATTERNS": json.dumps(lexicon["hard_blocker_patterns"]),
        "SOFT_PHRASE_PATTERNS": json.dumps(lexicon.get("soft_phrase_patterns", [])),

        # CSV-serialized placeholders
        "FIXTURES_VISIBLE_CSV": json.dumps(",".join(fixtures["visible"])),
        "FIXTURES_HELD_OUT_CSV": json.dumps(",".join(fixtures["held_out"])),
        "FIXTURES_VARIANTS_CSV": json.dumps(",".join(fixtures["variants"])),

        # Special bash-shell placeholders
        "VARIANTS_USAGE": variants_usage,
        "BENCHMARK_VARIANT_CASES": variant_cases,

        # Special grader prompt placeholders
        "GRADER_DIMS_DESCRIPTION": dim_descs,
        "GRADER_JSON_TEMPLATE": grader_json_template,
    }
    return p


def resolve_template(template_content, placeholders):
    """Replace all {{KEY}} placeholders with their values."""
    result = template_content

    # Sort by key length descending so longer keys match first (avoid partial matches)
    for key in sorted(placeholders, key=len, reverse=True):
        value = placeholders[key]
        result = result.replace("{{" + key + "}}", value)

    # Warn about any remaining {{...}} that weren't resolved
    remaining = re.findall(r"\{\{[A-Z_]+\}\}", result)
    if remaining:
        print(f"WARNING: unresolved placeholders remain: {remaining}", file=sys.stderr)

    return result


def render_all(dest, placeholders, report_only=False):
    """Render all templates into the destination directory."""
    rendered = {}
    for out_rel, tpl_name in TEMPLATE_FILES.items():
        tpl_path = os.path.join(TEMPLATES_DIR, tpl_name)
        if not os.path.exists(tpl_path):
            print(f"SKIP: template not found: {tpl_path}")
            continue
        with open(tpl_path, encoding="utf-8") as f:
            content = f.read()
        rendered_content = resolve_template(content, placeholders)
        out_path = os.path.join(dest, out_rel)
        if not report_only:
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(rendered_content)
            # Make .py and .sh files executable
            if out_rel.endswith((".py", ".sh")):
                os.chmod(out_path, 0o755)
        rendered[out_rel] = rendered_content
    return rendered


def write_gitignore(dest, report_only=False):
    """Write the .gitignore for loop state and benchmark results."""
    gi_path = os.path.join(dest, ".gitignore")
    lines = [
        "_loop/state/",
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


def print_checklist_commands(cfg, dest):
    """Print conformance checklist commands."""
    print("\n===== CONFORMANCE CHECKLIST COMMANDS =====")
    print(f"cd {dest}")
    print(f"python3 _gates/gates.py freeze")
    print(f"python3 _gates/derive.py check")
    print(f"python3 _loop/loop.py --dry-run")
    print(f"python3 _loop/gauntlet.py")
    print(f"")
    print("Verify items:")
    print("  - [ ] _loop/loop.py --dry-run exits 0")
    print("  - [ ] _gates/gates.py freeze; check exits 0")
    print("  - [ ] _gates/derive.py derive && check exits 0")
    print("  - [ ] All fixtures produce <DELIVERABLE> blocks")
    print("  - [ ] deterministic_lint.py enforces hard rules")
    print(f"  - [ ] Grader model ({cfg['models']['grader']}) is different family from proposer ({cfg['models']['proposer_family']})")
    print("  - [ ] _loop/gauntlet.py passes 10/10 dispatch-free")
    print("  - [ ] _loop/state/ is gitignored")


def verify_render(dest):
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


def main():
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
