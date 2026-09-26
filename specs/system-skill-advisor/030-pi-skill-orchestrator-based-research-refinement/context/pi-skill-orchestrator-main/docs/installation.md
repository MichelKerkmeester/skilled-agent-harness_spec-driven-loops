# Installation

[Back to the main README](../README.md) · [Documentation index](README.md)

## Requirements

You need:

- Pi;
- Node.js 22.19.0 or newer;
- a terminal that can run Pi.

Check Pi:

```bash
pi --version
```

Check Node.js:

```bash
node --version
```

## Install from npm

After the package is published:

```bash
pi install npm:pi-skill-orchestrator
```

Restart Pi after installation. If Pi is already open, run:

```text
/reload
```

Confirm the package is installed:

```bash
pi list
```

## Install from GitHub

Use the public repository:

```bash
pi install https://github.com/badgids/pi-skill-orchestrator.git
```

For one project only, run the command from that project and add `-l`:

```bash
pi install -l https://github.com/badgids/pi-skill-orchestrator.git
```

## Install from a local checkout

Enter the repository first:

```bash
cd /path/to/pi-skill-orchestrator
```

Run the tests:

```bash
npm test
```

Install the local directory:

```bash
pi install "$(pwd)"
```

## Test without installing

Run the extension for one Pi session:

```bash
cd /path/to/pi-skill-orchestrator
pi -e ./src/index.ts
```

This is the best command for development testing.

## Update

For an npm install:

```bash
pi update npm:pi-skill-orchestrator
```

For a GitHub install:

```bash
pi update --extensions
```

Then restart Pi or run `/reload`.

## Uninstall

For a normal Pi package install:

```bash
pi remove npm:pi-skill-orchestrator
```

If you installed from GitHub, remove the same source you used to install it. `pi list` shows the configured package source.

Pi Skill Orchestrator stores profile data separately under `~/.pi/agent/skill-manager.json` and `~/.pi/agent/skill-profiles/`. Package removal does not require deleting those files.
