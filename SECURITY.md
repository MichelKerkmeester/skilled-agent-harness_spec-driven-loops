# Security Policy

Skilled installs hooks, runs shell commands and reads environment variables inside AI coding assistants, so a flaw here can reach the machine it runs on. Reports are welcome and handled privately.

---

## 1. 🔒 REPORTING A VULNERABILITY

Report it through GitHub's private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue or pull request for a security problem.

Include what you can of the following:

- The affected file, hook, command or skill
- Steps to reproduce, or a proof of concept
- The impact you expect, such as code execution, credential exposure or a sandbox escape

---

## 2. 🕑 WHAT HAPPENS NEXT

Every report is acknowledged. Once the problem is confirmed, the fix lands on `main` and the advisory is published with credit to the reporter, unless you ask to stay anonymous.

---

## 3. 📦 SUPPORTED VERSIONS

Only the latest release on `main` receives security fixes.

---

## 4. 🎯 SCOPE

In scope is everything this repository ships: `.skilled/` skills, commands, agents, hooks and scripts, and the runtime configuration under `.claude/`, `.codex/`, `.opencode/` and the other runtime folders.

Out of scope are the AI assistants themselves and third-party MCP servers, which should be reported to their own maintainers.
