## Edit 1

File: `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs`

OLD:

~~~~text
    }

    const underSkillsRoot = segments[0] === '.opencode' && segments[1] === 'skills' && segments.length >= 4;

    // Row 3: frontmatter-versions -- versioned skill doc, scoped by --skill.
~~~~

NEW:

~~~~text
    }

    // The source tree sits under .skilled or .opencode, and a runtime reports an edit
    // by its real path, which names .skilled even where .opencode links to it.
    const underSkillsRoot = ['.skilled', '.opencode'].includes(segments[0]) && segments[1] === 'skills' && segments.length >= 4;

    // Row 3: frontmatter-versions -- versioned skill doc, scoped by --skill.
~~~~

## Edit 2

File: `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs`

OLD:

~~~~text
        checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.wikilinks),
        args: [path.join(projectDir, '.opencode', 'skills', skillName)],
        surfaceRule: 'exit1',
~~~~

NEW:

~~~~text
        checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.wikilinks),
        args: [path.join(projectDir, segments[0], 'skills', skillName)],
        surfaceRule: 'exit1',
~~~~
