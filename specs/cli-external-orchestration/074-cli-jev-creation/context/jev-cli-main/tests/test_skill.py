import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "jev-cli" / "SKILL.md"
REFERENCE = ROOT / "skills" / "jev-cli" / "references" / "cli.md"


class JevCliSkillTest(unittest.TestCase):
    def test_skill_has_portable_frontmatter_and_reference(self):
        text = SKILL.read_text()
        self.assertTrue(text.startswith("---\n"))
        frontmatter, body = text[4:].split("\n---\n", 1)
        self.assertRegex(frontmatter, r"(?m)^name: jev-cli$")
        self.assertRegex(frontmatter, r"(?m)^description: Use when ")
        self.assertIn("# jev-cli", body)
        self.assertIn("references/cli.md", body)
        self.assertTrue(REFERENCE.is_file())
        self.assertNotRegex(text + REFERENCE.read_text(), r"/Users/|TYPESAFE_API_KEY=|Bearer ")


if __name__ == "__main__":
    unittest.main()
