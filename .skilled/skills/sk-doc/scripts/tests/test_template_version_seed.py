"""Every sk-doc doc template seeds `version: 1.0.0.0` on the skill docs it creates.

Two kinds of template create skill docs: init_skill.py renders the scaffolds into a
new skill or parent hub, and an author copies the fenced frontmatter block of a
README, architecture or frontmatter template. The first is checked by scaffolding
both kinds and running the version gate over the result; the second by reading
each template's first fenced block under its heading.
"""
import re
import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
INIT_SKILL = SK_DOC / "sk-create-skill" / "scripts" / "init_skill.py"
ENGINE = SK_DOC / "shared" / "scripts" / "frontmatter-version.mjs"
SEED = re.compile(r"^version: 1\.0\.0\.0$", re.MULTILINE)


def _first_block_after(text: str, marker: str) -> str:
    """The frontmatter of the first fenced block after a marker line."""
    tail = text[text.index(marker):]
    block = re.search(r"^`{3,4}(?:yaml|markdown)\n(---\n.*?\n---)\n", tail, re.MULTILINE | re.DOTALL)
    assert block, f"no fenced frontmatter block after {marker!r}"
    return block.group(1)


def test_scaffolded_skill_and_hub_docs_carry_a_version(tmp_path):
    for args in (["demo-skill"], ["demo-hub", "--kind", "parent"]):
        result = subprocess.run([sys.executable, str(INIT_SKILL), *args, "--path", str(tmp_path)],
                                capture_output=True, text=True)
        assert result.returncode == 0, result.stdout + result.stderr
    gate = subprocess.run(["node", str(ENGINE), "gate", "--skills-root", str(tmp_path)],
                          capture_output=True, text=True)
    assert gate.returncode == 0, gate.stdout + gate.stderr
    assert re.search(r"ok=[1-9]", gate.stdout), gate.stdout


def test_new_skill_md_starts_at_the_initial_version(tmp_path):
    subprocess.run([sys.executable, str(INIT_SKILL), "demo-skill", "--path", str(tmp_path)],
                   capture_output=True, text=True, check=True)
    assert SEED.search((tmp_path / "demo-skill" / "SKILL.md").read_text(encoding="utf-8"))


def test_copied_template_blocks_seed_the_initial_version():
    cases = [
        ("sk-create-readme/assets/readme-template.md", "## 6. FILLABLE SCAFFOLD"),
        ("sk-create-readme/assets/readme-code-template.md", "Copy this scaffold"),
        ("sk-create-readme/assets/architecture-template.md", '````markdown\n---\ntitle: "Architecture'),
        ("sk-create-frontmatter/assets/frontmatter-templates.md", "### Skill Reference/Asset Frontmatter Template"),
        ("sk-create-frontmatter/assets/frontmatter-templates.md", "### Skill README Frontmatter Template"),
        ("sk-create-frontmatter/assets/frontmatter-templates.md", "### Feature Catalog Frontmatter Template"),
        ("sk-create-frontmatter/assets/frontmatter-templates.md", "### Testing Playbook Frontmatter Template"),
    ]
    missing = []
    for rel, marker in cases:
        block = _first_block_after((SK_DOC / rel).read_text(encoding="utf-8"), marker)
        if not SEED.search(block):
            missing.append(f"{rel} after {marker!r}")
    assert not missing, missing
