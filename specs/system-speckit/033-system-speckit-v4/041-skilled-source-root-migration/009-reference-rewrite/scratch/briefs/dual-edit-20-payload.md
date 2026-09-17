## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts`

OLD:

~~~~text
    .replace(/^specs\//u, '')
    .replace(/^\.opencode\//u, '');
}
~~~~

NEW:

~~~~text
    .replace(/^specs\//u, '')
    .replace(/^\.(?:skilled|opencode)\//u, '');
}
~~~~
