#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL INITIALIZER
# ───────────────────────────────────────────────────────────────

"""
Skill Initializer - Creates a new skill from template

Usage:
    init_skill.py <skill-name> --path <path>

Examples:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-api-helper --path skills/private
    init_skill.py custom-skill --path /custom/location
"""

import sys
from pathlib import Path


SKILL_TEMPLATE = """---
name: {skill_name}
description: This skill [TODO: Complete - what does it do?]. This skill should be used when [TODO: Complete - when to use it? Specific scenarios, file types, or tasks that trigger it.]
---

# {skill_title}

[TODO: 1-2 sentences explaining what this skill enables and its primary purpose]

---

## 1. 🎯 WHEN TO USE

**This skill should be used when**:
- [TODO: List specific scenarios when this skill applies]
- [TODO: File types or tasks that trigger it]
- [TODO: User goals or requirements]

**This skill should NOT be used for**:
- [TODO: List scenarios where skill is not appropriate]
- [TODO: Alternative approaches or tools]

---

## 2. 🛠️ HOW IT WORKS

[TODO: Brief explanation of the skill's process/workflow]

**Process**:
1. [TODO: Step 1]
2. [TODO: Step 2]
3. [TODO: Step 3]

**Output**: [TODO: What the skill produces/delivers]

---

## 3. 📋 [TODO: RENAME - Main Content Section]

[TODO: This is your primary content section. Rename based on skill type:
- For workflow skills: "IMPLEMENTATION STEPS" or "WORKFLOW"
- For tool skills: "OPERATIONS" or "CAPABILITIES"
- For reference skills: "GUIDELINES" or "STANDARDS"
- For technical skills: "USAGE" or "API REFERENCE"]

[TODO: Add your main content here:
- Code samples for technical skills
- Step-by-step procedures for workflows
- Concrete examples with realistic user requests
- Decision trees for complex processes
- References to scripts/references/assets as needed]

---

## 4. 📖 RULES

### ALWAYS

- [TODO: List required behaviors]
- [TODO: Best practices to follow]
- [TODO: Quality standards]

### NEVER

- [TODO: List forbidden actions]
- [TODO: Common mistakes to avoid]
- [TODO: Anti-patterns]

### ESCALATE IF

- [TODO: When to ask user for help]
- [TODO: Situations requiring clarification]
- [TODO: Blockers or edge cases]

---

## 5. 🎓 SUCCESS CRITERIA

**Task complete when**:
- ✅ [TODO: First success criterion]
- ✅ [TODO: Second success criterion]
- ✅ [TODO: Third success criterion]

---

## 6. 💡 EXAMPLES

### Example 1: [TODO: Name of scenario]

**Context**: [TODO: Describe the situation]

**Invocation**: [TODO: How user invokes this]

**Output**: [TODO: What gets produced]

---

### Example 2: [TODO: Name of scenario]

**Context**: [TODO: Describe the situation]

**Output**: [TODO: What gets produced]

---

## 7. 🔗 INTEGRATION POINTS

**Triggers**: [TODO: What activates this skill]

**Pairs With**:
- [TODO: Related skills or tools]
- [TODO: Complementary functionality]

**Outputs**:
- [TODO: What this skill produces]
- [TODO: Where output goes]

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [reference-name.md](./references/reference-name.md) - [TODO: Description]

### Templates
- [template-name.md](./assets/template-name.md) - [TODO: Description]

### Related Skills
- `skill-name` - [TODO: How it relates to this skill]

---

## 9. 🎯 QUICK REFERENCE

[TODO: Add quick lookup information:
- Key commands or syntax
- Common patterns
- File locations
- Important rules or constraints]

---

## 📚 BUNDLED RESOURCES

This skill includes example resource directories. Delete any you don't need:

### scripts/
Executable code (Python/Bash/etc.) for deterministic operations or repeatedly rewritten code.

**Examples**: `example.py` (see scripts/ directory)

**When to use**: Code that needs consistent execution, data processing, file manipulation

### references/
Documentation loaded into context to inform the agent's process.

**Examples**: `api_reference.md` (see references/ directory)

**When to use**: API docs, schemas, detailed workflows, domain knowledge

### assets/
Files used in output (not loaded into context).

**Examples**: `example_asset.txt` (see assets/ directory)

**When to use**: Templates, images, fonts, boilerplate code, sample data

**Note**: Delete unneeded directories - not every skill requires all three types.
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}

This is a placeholder script that can be executed directly.
Replace with actual implementation or delete if not needed.

Example real scripts from other skills:
- pdf/scripts/fill_fillable_fields.py - Fills PDF form fields
- pdf/scripts/convert_pdf_to_images.py - Converts PDF pages to images
"""

def main():
    print("This is an example script for {skill_name}")
    # TODO: Add actual script logic here
    # This could be data processing, file conversion, API calls, etc.

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference Documentation for {skill_title}

This is a placeholder for detailed reference documentation.
Replace with actual reference content or delete if not needed.

Example real reference docs from other skills:
- product-management/references/communication.md - Comprehensive guide for status updates
- product-management/references/context_building.md - Deep-dive on gathering context
- bigquery/references/ - API references and query examples

## When Reference Docs Are Useful

Reference docs are ideal for:
- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
- Information too lengthy for main SKILL.md
- Content that's only needed for specific use cases

## Structure Suggestions

### API Reference Example
- Overview
- Authentication
- Endpoints with examples
- Error codes
- Rate limits

### Workflow Guide Example
- Prerequisites
- Step-by-step instructions
- Common patterns
- Troubleshooting
- Best practices
"""

EXAMPLE_ASSET = """# Example Asset File

This placeholder represents where asset files would be stored.
Replace with actual asset files (templates, images, fonts, etc.) or delete if not needed.

Asset files are NOT intended to be loaded into context, but rather used within
the output the agent produces.

Example asset files from other skills:
- Brand guidelines: logo.png, slides_template.pptx
- Frontend builder: hello-world/ directory with HTML/React boilerplate
- Typography: custom-font.ttf, font-family.woff2
- Data: sample_data.csv, test_dataset.json

## Common Asset Types

- Templates: .pptx, .docx, boilerplate directories
- Images: .png, .jpg, .svg, .gif
- Fonts: .ttf, .otf, .woff, .woff2
- Boilerplate code: Project directories, starter files
- Icons: .ico, .svg
- Data files: .csv, .json, .xml, .yaml

Note: This is a text placeholder. Actual assets can be any file type.
"""


def title_case_skill_name(skill_name):
    """Convert hyphenated skill name to Title Case for display."""
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


def init_skill(skill_name, path):
    """
    Initialize a new skill directory with template SKILL.md.

    Args:
        skill_name: Name of the skill
        path: Path where the skill directory should be created

    Returns:
        Path to created skill directory, or None if error
    """
    # Determine skill directory path
    skill_dir = Path(path).resolve() / skill_name

    # Check if directory already exists
    if skill_dir.exists():
        print(f"❌ Error: Skill directory already exists: {skill_dir}")
        return None

    # Create skill directory
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"✅ Created skill directory: {skill_dir}")
    except Exception as e:
        print(f"❌ Error creating directory: {e}")
        return None

    # Create SKILL.md from template
    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(
        skill_name=skill_name,
        skill_title=skill_title
    )

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content)
        print("✅ Created SKILL.md")
    except Exception as e:
        print(f"❌ Error creating SKILL.md: {e}")
        return None

    # Create resource directories with example files
    try:
        # Create scripts/ directory with example script
        scripts_dir = skill_dir / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        example_script = scripts_dir / 'example.py'
        example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
        example_script.chmod(0o755)
        print("✅ Created scripts/example.py")

        # Create references/ directory with example reference doc
        references_dir = skill_dir / 'references'
        references_dir.mkdir(exist_ok=True)
        example_reference = references_dir / 'api_reference.md'
        example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title))
        print("✅ Created references/api_reference.md")

        # Create assets/ directory with example asset placeholder
        assets_dir = skill_dir / 'assets'
        assets_dir.mkdir(exist_ok=True)
        example_asset = assets_dir / 'example_asset.txt'
        example_asset.write_text(EXAMPLE_ASSET)
        print("✅ Created assets/example_asset.txt")
    except Exception as e:
        print(f"❌ Error creating resource directories: {e}")
        return None

    # Print next steps
    print(f"\n✅ Skill '{skill_name}' initialized successfully at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md to complete the TODO items and update the description")
    print("2. Customize or delete the example files in scripts/, references/, and assets/")
    print("3. Run the validator when ready to check the skill structure")

    return skill_dir


def main():
    if len(sys.argv) < 4 or sys.argv[2] != '--path':
        print("Usage: init_skill.py <skill-name> --path <path>")
        print("\nSkill name requirements:")
        print("  - Hyphen-case identifier (e.g., 'data-analyzer')")
        print("  - Lowercase letters, digits, and hyphens only")
        print("  - Max 40 characters")
        print("  - Must match directory name exactly")
        print("\nExamples:")
        print("  init_skill.py my-new-skill --path skills/public")
        print("  init_skill.py my-api-helper --path skills/private")
        print("  init_skill.py custom-skill --path /custom/location")
        sys.exit(1)

    skill_name = sys.argv[1]
    path = sys.argv[3]

    print(f"🚀 Initializing skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
