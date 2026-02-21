---
description: "Activation triggers, use cases including performance audit, and exclusion criteria for the Chrome DevTools orchestrator skill"
---
# When To Use

Defines when to activate this skill and when to use alternative tools instead.

## Activation Triggers

**Use when**:
- User mentions "browser debugging", "Chrome DevTools", "CDP" explicitly
- User asks to inspect, test, or automate browser tasks with lightweight CLI approach
- User wants screenshots, HAR files, console logs, or network inspection via terminal
- User mentions "bdg" or "browser-debugger-cli" explicitly
- User needs quick DOM queries, cookie manipulation, or JavaScript execution in browser
- User wants terminal-based browser automation with Unix pipe composability
- User needs production-ready automation scripts for CI/CD browser testing

**Automatic Triggers**:
- "bdg", "browser-debugger-cli" mentioned explicitly
- "lightweight browser debugging" or "quick CDP access"
- "terminal-based browser automation"
- "screenshot without Puppeteer"

## When NOT to Use

**Do not use for**:
- Complex UI testing suites requiring sophisticated frameworks (use Puppeteer/Playwright)
- Heavy multi-step automation workflows better suited for frameworks
- Cross-browser testing (bdg supports Chrome/Chromium/Edge only)
- Visual regression testing or complex test frameworks
- When user explicitly requests Puppeteer, Playwright, or Selenium

## Cross References
- [[routing-decision|Routing Decision]] -- CLI vs MCP selection logic
- [[how-it-works|How It Works]] -- Tool comparison overview