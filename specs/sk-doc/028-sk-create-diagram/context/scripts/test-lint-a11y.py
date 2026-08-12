#!/usr/bin/env python3
"""Adversarial tests for lint-skin.py's accessible-SVG contract."""

from __future__ import annotations

import importlib.util
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
LINTER = ROOT / "scripts/lint-skin.py"
BUILD_ICONS = ROOT / "scripts/build-icons.py"

VALID_SVG = """\
<svg xmlns="http://www.w3.org/2000/svg" role="img"
     aria-labelledby="fixture-title fixture-desc">
  <title id="fixture-title">Fixture diagram</title>
  <desc id="fixture-desc">Diagram showing a fixture connected to a result.</desc>
  <rect width="10" height="10"/>
</svg>
"""


def run_linter(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(LINTER), str(path)],
        capture_output=True,
        text=True,
        check=False,
    )


def require_failure(name: str, html: str, expected: str, directory: Path) -> None:
    path = directory / f"{name}.html"
    path.write_text(html, encoding="utf-8")
    result = run_linter(path)
    if result.returncode != 1:
        raise AssertionError(
            f"{name}: expected exit 1, got {result.returncode}\n{result.stdout}{result.stderr}"
        )
    if f"a11y: {expected}" not in result.stdout:
        raise AssertionError(
            f"{name}: missing expected a11y finding {expected!r}\n{result.stdout}"
        )
    print(f"OK: {name} rejected — {expected}")


def require_pass(name: str, html: str, directory: Path) -> None:
    path = directory / f"{name}.html"
    path.write_text(html, encoding="utf-8")
    result = run_linter(path)
    if result.returncode != 0:
        raise AssertionError(
            f"{name}: expected exit 0, got {result.returncode}\n{result.stdout}{result.stderr}"
        )
    if "a11y:" in result.stdout:
        raise AssertionError(f"{name}: unexpected a11y finding\n{result.stdout}")
    print(f"OK: {name} accepted")


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="lint-a11y-") as temp_dir:
        directory = Path(temp_dir)

        require_failure(
            "missing-role",
            VALID_SVG.replace(' role="img"', ""),
            'diagram <svg> must carry role="img"',
            directory,
        )
        require_failure(
            "unresolved-labelled-by",
            VALID_SVG.replace(
                'aria-labelledby="fixture-title fixture-desc"',
                'aria-labelledby="absent-title absent-desc"',
            ),
            "aria-labelledby references missing id(s): absent-title, absent-desc",
            directory,
        )
        require_failure(
            "labels-unrelated-elements",
            VALID_SVG.replace(' id="fixture-title"', "")
            .replace(' id="fixture-desc"', "")
            .replace(
                '  <rect width="10" height="10"/>',
                '  <g id="fixture-title"></g>\n'
                '  <g id="fixture-desc"></g>\n'
                '  <rect width="10" height="10"/>',
            ),
            "aria-labelledby must name the <title> and <desc> IDs",
            directory,
        )
        require_failure(
            "late-title",
            VALID_SVG.replace(
                '  <title id="fixture-title">Fixture diagram</title>\n  <desc',
                '  <defs></defs>\n  <title id="fixture-title">Fixture diagram</title>\n  <desc',
            ),
            "<title> must be the first child element of <svg>",
            directory,
        )
        require_failure(
            "empty-desc",
            VALID_SVG.replace(
                "Diagram showing a fixture connected to a result.", "  "
            ),
            "<desc> must not be empty",
            directory,
        )
        require_failure(
            "bare-ids",
            VALID_SVG.replace("fixture-title", "title").replace(
                "fixture-desc", "desc"
            ),
            'bare id="title" and id="desc" are not allowed',
            directory,
        )
        require_failure(
            "wrong-file-slug",
            VALID_SVG,
            'accessible-name IDs must match file slug "wrong-file-slug": '
            'expected "wrong-file-slug-title" / "wrong-file-slug-desc"',
            directory,
        )
        require_failure(
            "placeholder-ids",
            VALID_SVG.replace("fixture-title", "[diagram-slug]-title").replace(
                "fixture-desc", "[diagram-slug]-desc"
            ),
            "accessible-name IDs contain unresolved placeholder(s): "
            "[diagram-slug]-title, [diagram-slug]-desc",
            directory,
        )
        require_failure(
            "duplicate-naming-ids",
            VALID_SVG + VALID_SVG,
            'duplicate accessible-name id="fixture-desc" is not allowed',
            directory,
        )
        require_pass(
            "decorative",
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
            '<path d="M0 0h1v1z"/></svg>\n',
            directory,
        )

        spec = importlib.util.spec_from_file_location("build_icons", BUILD_ICONS)
        if spec is None or spec.loader is None:
            raise AssertionError("generated-icons: could not load build-icons.py")
        build_icons = importlib.util.module_from_spec(spec)
        previous_bytecode_setting = sys.dont_write_bytecode
        sys.dont_write_bytecode = True
        try:
            spec.loader.exec_module(build_icons)
        finally:
            sys.dont_write_bytecode = previous_bytecode_setting
        generated_icons = {
            "tabler": build_icons.normalize_tabler("<svg><path/></svg>"),
            "simple": build_icons.normalize_simple("<svg><path/></svg>"),
            "url": build_icons.normalize_url(
                '<svg viewBox="0 0 24 24"><path/></svg>'
            ),
            "devicon": build_icons.normalize_devicon("<svg><path/></svg>"),
            "logz": build_icons.normalize_logz("<svg><path/></svg>"),
        }
        for source, icon in generated_icons.items():
            slug = f"generated-{source}-icon"
            require_pass(
                slug,
                VALID_SVG.replace("fixture-title", f"{slug}-title")
                .replace("fixture-desc", f"{slug}-desc")
                .replace("</svg>", f"  {icon}\n</svg>"),
                directory,
            )

        project = directory / "baseline-project"
        (project / "scripts").mkdir(parents=True)
        (project / "skills/diagram-design/assets").mkdir(parents=True)
        (project / "skills/diagram-design/references").mkdir(parents=True)
        shutil.copy2(LINTER, project / "scripts/lint-skin.py")
        shutil.copy2(
            ROOT / "skills/diagram-design/references/style-guide.md",
            project / "skills/diagram-design/references/style-guide.md",
        )
        (project / "scripts/lint-skin-baseline.txt").write_text(
            "example-baseline.html\n", encoding="utf-8"
        )
        (project / "skills/diagram-design/assets/example-baseline.html").write_text(
            '<svg style="color: #123456"></svg>\n', encoding="utf-8"
        )
        baseline_result = subprocess.run(
            [
                sys.executable,
                str(project / "scripts/lint-skin.py"),
                "--all",
                "--baseline",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if baseline_result.returncode != 1:
            raise AssertionError(
                "baseline-a11y: expected exit 1, got "
                f"{baseline_result.returncode}\n"
                f"{baseline_result.stdout}{baseline_result.stderr}"
            )
        if "a11y: diagram <svg> must carry role=\"img\"" not in baseline_result.stdout:
            raise AssertionError(
                "baseline-a11y: missing expected accessibility finding\n"
                f"{baseline_result.stdout}"
            )
        if "color:" in baseline_result.stdout:
            raise AssertionError(
                "baseline-a11y: legacy visual finding was not exempted\n"
                f"{baseline_result.stdout}"
            )
        print("OK: baseline file receives a11y checks but keeps visual exemptions")

    print("All accessible-SVG lint cases passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
