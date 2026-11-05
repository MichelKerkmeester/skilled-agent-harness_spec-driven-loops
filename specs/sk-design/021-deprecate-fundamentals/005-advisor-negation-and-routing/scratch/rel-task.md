TASK: update the Skilled release entry .skilled/changelog/skilled/v4.0.1.0.md so it covers this branch's work. The operator will republish its tag, so this release is being reopened: extend the entry in place and keep its version.
READ FIRST:
1. .skilled/skills/sk-doc/sk-create-changelog/SKILL.md section 7 step 4 (extending an open release) and assets/changelog-template.md (expanded shape, voice and ceilings).
2. The whole entry.
3. Evidence, the only sources: specs/sk-design/021-deprecate-fundamentals/spec.md, the implementation-summary.md of phases 001 to 004, and 005-advisor-negation-and-routing/scratch/facts.md sections 1 and 2.
WHAT TO FOLD IN (reader impact only, each fact once):
- The design hub retired its values mode, `sk-design-fundamentals`. Screen values, visual hierarchy and review, and motion and interaction now live in sk-code's frontend surface, with a starter `tokens.css`. sk-design keeps three modes (Style Reference extraction, charts, diagrams) and asks which artifact is wanted when a request has no signal.
- Design review requests bring in the frontend surface beside code review. Chart-choice questions reach the chart mode.
- The chart mode's documents no longer cite outside research.
- The skill advisor no longer reads a negated write ("don't write anything back") as a request to write docs.
RULES:
- The H4 "Open Design Values Go to `sk-design-fundamentals`" is now untrue. Rewrite it so it says where open values go now. Correct any other sentence the retirement makes untrue, including the frontmatter description if needed.
- Add the retirement under the Retired Surfaces section as one H4 and add glance bullets in section order. Widen the opening and Why This Release only as much as the new themes need. Keep the title and the version.
- Add the spec folder `specs/sk-design/021-deprecate-fundamentals` to the spec-folder line if the entry has one.
- Add one or two topic phrases to trigger_phrases.
- Plain declarative sentences. No em dash, no semicolon, no Oxford comma. No internal ids or test counts.
ALLOWED WRITE PATHS: .skilled/changelog/skilled/v4.0.1.0.md only.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY and paste the output:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/changelog/skilled/v4.0.1.0.md | tail -1
  python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/changelog/skilled/v4.0.1.0.md | grep "hard blockers"
  grep -n "sk-design-fundamentals" .skilled/changelog/skilled/v4.0.1.0.md
