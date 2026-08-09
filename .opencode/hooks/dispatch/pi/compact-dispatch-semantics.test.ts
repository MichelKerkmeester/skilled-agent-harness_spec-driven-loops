// ──────────────────────────────────────────────────────────────────
// MODULE: Pi Compact Dispatch Semantics
// ──────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from "vitest";

import {
  PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG,
  PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE,
  PI_SUBAGENT_DISPATCH_DIRECTIVE,
  isPiCompactDirectivePrototypeEnabled,
} from "../../../skills/system-skill-advisor/hooks/pi/prompt-advisor";

type SemanticCheck = {
  readonly name: string;
  readonly preserves: (directive: string) => boolean;
};

const SEMANTIC_CHECKS: readonly SemanticCheck[] = [
  {
    name: "native pi-subagents default",
    preserves: (directive) =>
      directive.includes("native pi-subagents") &&
      (directive.includes("[DEFAULT]") || directive.includes("by default")),
  },
  {
    name: "current-turn user cli-* override only",
    preserves: (directive) =>
      directive.includes("THIS turn's user text explicitly names one") ||
      directive.includes("current-turn user cli-* only"),
  },
  {
    name: "cli-X/SKILL.md preload on override",
    preserves: (directive) =>
      directive.includes("cli-X/SKILL.md") &&
      (directive.includes("read that") || directive.includes("preload")),
  },
  {
    name: "advisor and model anti-signals",
    preserves: (directive) =>
      directive.toLowerCase().includes("advisor") &&
      directive.toLowerCase().includes("model") &&
      (directive.includes("never trigger cli-* dispatch") ||
        directive.includes("signals never override")),
  },
  {
    name: "child-prompt exclusion",
    preserves: (directive) =>
      directive.includes("Do not inject this line into child prompts") ||
      directive.includes("no child-prompt injection"),
  },
];

const DIRECTIVES = [
  ["full", PI_SUBAGENT_DISPATCH_DIRECTIVE],
  ["compact", PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE],
] as const;

const initialPrototypeFlag = process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG];

afterEach(() => {
  if (initialPrototypeFlag === undefined) {
    delete process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG];
  } else {
    process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG] = initialPrototypeFlag;
  }
});

describe.each(DIRECTIVES)("%s Pi dispatch directive", (_variant, directive) => {
  it.each(SEMANTIC_CHECKS)("preserves $name", ({ preserves }) => {
    expect(preserves(directive)).toBe(true);
  });
});

describe("compact Pi dispatch directive activation", () => {
  it("stays disabled unless the prototype flag is explicitly enabled", () => {
    delete process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG];
    expect(isPiCompactDirectivePrototypeEnabled()).toBe(false);

    process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG] = "0";
    expect(isPiCompactDirectivePrototypeEnabled()).toBe(false);

    process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG] = "1";
    expect(isPiCompactDirectivePrototypeEnabled()).toBe(true);
  });
});
