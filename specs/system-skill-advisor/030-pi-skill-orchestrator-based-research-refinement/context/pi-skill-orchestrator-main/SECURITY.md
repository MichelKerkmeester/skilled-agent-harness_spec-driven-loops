# Security policy

[Back to the main README](README.md)

Pi extensions run with the user's permissions. Review extension code before installing it.

## Supported release

Security fixes are made on the current release line unless the project states otherwise.

## Report a vulnerability

Do not put secrets, private file contents, or a working exploit in a public issue.

Use GitHub private vulnerability reporting when it is enabled for this repository. If private reporting is not available, contact the maintainer through the [Badgids GitHub profile](https://github.com/badgids) before public disclosure.

Include:

- the affected version;
- the operating system;
- the Pi version;
- clear reproduction steps;
- the expected result;
- the actual result;
- the security impact.

## Security boundaries

Pi Skill Orchestrator intentionally does not:

- execute network requests;
- spawn shell commands;
- write to Pi's global `settings.json`;
- change `enableSkillCommands`;
- edit installed third-party skill files;
- store npm or GitHub credentials.

The release workflow is designed for npm trusted publishing through GitHub OIDC. It does not require a long-lived npm token in the repository.

The extension does read installed skill bodies when it loads a selected skill or resolves dependencies. The manager can also inspect skill bodies to calculate dependency information for its UI.
