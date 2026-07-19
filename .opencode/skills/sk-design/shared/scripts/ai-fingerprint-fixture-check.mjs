// ============================================================================
// AI Fingerprint Fixture Check
// ============================================================================

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const registryUrl = new URL("design-audit/assets/ai-fingerprint-registry.json", skillRootUrl);
const fixtureRootUrl = new URL("design-audit/assets/ai-fingerprint-fixtures/", skillRootUrl);

const CHECK_MATCHERS = new Map([
  [
    normalizeCheck(
      "Detect any single element with border: 1px solid and a box-shadow blur radius of 16px or more."
    ),
    { tellId: "ghost-card-border-plus-shadow", matches: matchesGhostCardBorderPlusShadow }
  ],
  [
    normalizeCheck("Detect border-radius values of 24px or more on cards, sections, panels, or text inputs."),
    { tellId: "over-rounded-cards", matches: matchesOverRoundedCards }
  ],
  [
    normalizeCheck(
      "Detect SVGs with sketch or doodle class names, feTurbulence or feDisplacementMap grain filters, or crude low-path scene illustrations."
    ),
    { tellId: "sketchy-svg-illustration", matches: matchesSketchySvgIllustration }
  ],
  [
    normalizeCheck("Detect repeating-linear-gradient used as a section or body background."),
    { tellId: "diagonal-stripe-background", matches: matchesDiagonalStripeBackground }
  ],
  [
    normalizeCheck("Detect letter-spacing values tighter than -0.04em on display or hero headings."),
    { tellId: "element-tracking-on-display-type", matches: matchesElementTrackingOnDisplayType }
  ],
  [
    normalizeCheck("Detect body copy containing a word followed by theater as meta-criticism copy."),
    { tellId: "theater-meta-criticism-copy", matches: matchesTheaterMetaCriticism }
  ],
  [
    normalizeCheck("Detect :hover transforms on img elements or parent-hover patterns that animate a child image."),
    { tellId: "image-hover-animation", matches: matchesImageHoverAnimation }
  ],
  [
    normalizeCheck(
      "Detect a body or page background in the light warm-neutral band, or warm-paper token names used as the page background."
    ),
    { tellId: "cream-or-sand-body-background", matches: matchesCreamOrSandBodyBackground }
  ],
  [
    normalizeCheck(
      "Detect a small uppercase tracked label repeated above three or more section headings, including numbered markers used as universal section kickers."
    ),
    { tellId: "eyebrow-above-every-section", matches: matchesEyebrowAboveEverySection }
  ],
  [
    normalizeCheck("Detect the same scroll-triggered fade-and-rise animation applied uniformly to most or all top-level sections."),
    { tellId: "uniform-section-fade-and-rise", matches: matchesUniformSectionFadeAndRise }
  ]
]);

const options = parseArgs(process.argv.slice(2));
const jsonMode = options.json;

if (options.errors.length > 0) {
  emitAndExit(
    {
      status: "invalid",
      stage: "usage",
      errors: options.errors,
      failures: []
    },
    2
  );
}

main().catch((error) => {
  emitAndExit(
    {
      status: "invalid",
      stage: "runtime",
      errors: [error instanceof Error ? error.message : String(error)],
      failures: []
    },
    2
  );
});

async function main() {
  const registry = await readJson(options.registry ?? registryUrl);
  const rootUrl = directoryUrl(options.fixtures ?? fixtureRootUrl);
  const prepared = prepareRegistryRows(registry);
  const failures = [...prepared.errors];
  let sampleCount = 0;

  for (const row of prepared.rows) {
    for (const sample of ["clean", "tell"]) {
      const fixtureUrl = new URL(`${row.fixture_id}/${sample}.html`, rootUrl);
      let source;

      try {
        source = await readFile(fixtureUrl, "utf8");
      } catch {
        failures.push(`${row.fixture_id}/${sample}.html: missing or unreadable fixture`);
        continue;
      }

      sampleCount += 1;
      const actual = detectTellIds(source, prepared.rows);
      const expected = sample === "tell" ? [row.tell_id] : [];

      if (!sameSet(actual, expected)) {
        failures.push(
          `${row.fixture_id}/${sample}.html: expected ${formatList(expected)}, got ${formatList(actual)}`
        );
      }
    }
  }

  const status = failures.length > 0 ? "fail" : "pass";
  emitAndExit(
    {
      status,
      stage: status === "pass" ? "complete" : "fixture-scan",
      metadata: {
        registryRowCount: prepared.rows.length,
        matcherCount: CHECK_MATCHERS.size,
        sampleCount
      },
      failures
    },
    status === "pass" ? 0 : 1
  );
}

function parseArgs(args) {
  const parsed = {
    registry: null,
    fixtures: null,
    json: false,
    errors: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--registry" || arg === "--fixtures") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        parsed.errors.push(`${arg} requires a path value`);
      } else if (arg === "--registry") {
        parsed.registry = value;
        index += 1;
      } else {
        parsed.fixtures = value;
        index += 1;
      }
      continue;
    }

    parsed.errors.push(`unknown argument: ${arg}`);
  }

  return parsed;
}

async function readJson(source) {
  const raw = await readFile(source, "utf8");
  return JSON.parse(raw);
}

function prepareRegistryRows(registry) {
  if (!Array.isArray(registry)) {
    return {
      rows: [],
      errors: ["registry root must be an array"]
    };
  }

  const rows = [];
  const errors = [];

  for (const [index, row] of registry.entries()) {
    const label = typeof row?.tell_id === "string" ? row.tell_id : `row[${index}]`;
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push(`${label}: registry row must be an object`);
      continue;
    }

    const matcher = CHECK_MATCHERS.get(normalizeCheck(row.deterministic_check));
    if (!matcher) {
      errors.push(`${label}: no matcher for deterministic_check`);
      continue;
    }

    if (matcher.tellId !== row.tell_id) {
      errors.push(`${label}: deterministic_check maps to ${matcher.tellId}`);
      continue;
    }

    if (typeof row.fixture_id !== "string" || row.fixture_id.length === 0) {
      errors.push(`${label}: fixture_id must be a non-empty string`);
      continue;
    }

    rows.push({ ...row, matcher });
  }

  return { rows, errors };
}

function detectTellIds(source, rows) {
  return rows
    .filter((row) => row.matcher.matches(source))
    .map((row) => row.tell_id)
    .sort();
}

function extractStyleBlocks(source) {
  const blocks = [];
  const re = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = re.exec(source)) !== null) {
    blocks.push(match[1]);
  }

  return blocks;
}

function extractRules(source) {
  const rules = [];

  for (const block of extractStyleBlocks(source)) {
    const re = /([^{}]+)\{([^{}]+)\}/g;
    let match;

    while ((match = re.exec(block)) !== null) {
      rules.push({
        selector: match[1].trim(),
        declarations: match[2].trim()
      });
    }
  }

  return rules;
}

function extractDeclarationBlocks(source) {
  const blocks = extractRules(source).map((rule) => rule.declarations);
  const inlineStyleRe = /\sstyle=(["'])([\s\S]*?)\1/gi;
  let match;

  while ((match = inlineStyleRe.exec(source)) !== null) {
    blocks.push(match[2]);
  }

  return blocks;
}

function declarationValue(declarations, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|;)\\s*${escaped}\\s*:\\s*([^;]+)`, "i");
  const match = re.exec(declarations);
  return match ? match[1].trim() : null;
}

function cssLengthToPx(value, unit) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (!unit || unit.toLowerCase() === "px") return numeric;
  if (unit.toLowerCase() === "rem" || unit.toLowerCase() === "em") return numeric * 16;
  return null;
}

function cssLengths(value) {
  const lengths = [];
  const re = /(-?\d*\.?\d+)(px|rem|em)?/gi;
  let match;

  while ((match = re.exec(value)) !== null) {
    const px = cssLengthToPx(match[1], match[2] || "px");
    if (px !== null) lengths.push(px);
  }

  return lengths;
}

function maxCssLength(value) {
  const lengths = cssLengths(value);
  return lengths.length > 0 ? Math.max(...lengths) : null;
}

function hasBorderOnePxSolid(declarations) {
  return /(?:^|;)\s*border\s*:\s*1px\s+solid\b/i.test(declarations);
}

function hasShadowBlurAtLeast(declarations, minimumPx) {
  const value = declarationValue(declarations, "box-shadow");
  if (!value) return false;

  return value.split(/,(?![^()]*\))/).some((shadow) => {
    const lengths = cssLengths(shadow);
    const blur = lengths[2];
    return typeof blur === "number" && blur >= minimumPx;
  });
}

function hasBorderRadiusAtLeast(declarations, minimumPx) {
  const value = declarationValue(declarations, "border-radius");
  const radius = value ? maxCssLength(value) : null;
  return typeof radius === "number" && radius >= minimumPx;
}

function matchesGhostCardBorderPlusShadow(source) {
  return extractDeclarationBlocks(source).some(
    (declarations) => hasBorderOnePxSolid(declarations) && hasShadowBlurAtLeast(declarations, 16)
  );
}

function matchesOverRoundedCards(source) {
  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const targetsContainer = /\b(card|panel|section|input)\b/.test(selector)
      || /(^|[\s,])section\b/.test(selector)
      || /(^|[\s,])input\b/.test(selector);
    return targetsContainer && hasBorderRadiusAtLeast(rule.declarations, 24);
  });
}

function matchesSketchySvgIllustration(source) {
  const svgRe = /<svg\b[\s\S]*?<\/svg>/gi;
  let match;

  while ((match = svgRe.exec(source)) !== null) {
    if (
      /class\s*=\s*["'][^"']*(?:sketch|doodle)/i.test(match[0])
      || /<feTurbulence\b/i.test(match[0])
      || /<feDisplacementMap\b/i.test(match[0])
      || /data-scene\s*=\s*["'](?:low-path|crude)/i.test(match[0])
    ) {
      return true;
    }
  }

  return false;
}

function matchesDiagonalStripeBackground(source) {
  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const isSurface = /\b(body|section|main)\b/.test(selector)
      || /\.(?:page|hero|surface)\b/.test(selector);
    const background = declarationValue(rule.declarations, "background")
      || declarationValue(rule.declarations, "background-image");
    return isSurface && Boolean(background) && /repeating-linear-gradient\s*\(/i.test(background);
  });
}

function matchesElementTrackingOnDisplayType(source) {
  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const isDisplay = /\b(h1|hero|display|title)\b/.test(selector);
    const value = declarationValue(rule.declarations, "letter-spacing");
    if (!isDisplay || !value) return false;

    const match = /(-?\d*\.?\d+)em/i.exec(value);
    return match ? Number(match[1]) < -0.04 : false;
  });
}

function extractVisibleBodyText(source) {
  const bodyMatch = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(source);
  const body = bodyMatch ? bodyMatch[1] : source;

  return body
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesTheaterMetaCriticism(source) {
  return /\b(\w+)\s+theater\b/i.test(extractVisibleBodyText(source));
}

function matchesImageHoverAnimation(source) {
  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const transform = declarationValue(rule.declarations, "transform");
    if (!transform || !/:hover/.test(selector)) return false;
    return /\bimg\b/.test(selector) || /(?:group-hover|parent-hover|image|photo|media)/.test(selector);
  });
}

function parseHexColor(value) {
  const match = /#([0-9a-f]{3}|[0-9a-f]{6})\b/i.exec(value);
  if (!match) return null;

  const hex = match[1].length === 3
    ? match[1].split("").map((char) => `${char}${char}`).join("")
    : match[1];

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

function parseRgbColor(value) {
  const match = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value);
  if (!match) return null;

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3])
  };
}

function isLightWarmNeutral(value) {
  if (/(?:--|var\(--)(?:paper|cream|sand|bone|linen|ivory)\b/i.test(value)) {
    return true;
  }

  const color = parseHexColor(value) || parseRgbColor(value);
  if (!color) return false;

  return color.r >= 235
    && color.g >= 225
    && color.b >= 205
    && color.r >= color.g
    && color.g >= color.b
    && color.r - color.b >= 8;
}

function matchesCreamOrSandBodyBackground(source) {
  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const isPage = /\bbody\b/.test(selector) || /\.(?:page|app|shell)\b/.test(selector);
    const background = declarationValue(rule.declarations, "background")
      || declarationValue(rule.declarations, "background-color");
    return isPage && Boolean(background) && isLightWarmNeutral(background);
  });
}

function matchesEyebrowAboveEverySection(source) {
  const labelBeforeHeading = /<(?:p|span|div)\b[^>]*class=["'][^"']*(?:eyebrow|kicker|section-label)[^"']*["'][^>]*>[\s\S]*?<\/(?:p|span|div)>\s*<h[1-4]\b/gi;
  const labels = [...source.matchAll(labelBeforeHeading)];
  if (labels.length < 3) return false;

  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const value = declarationValue(rule.declarations, "letter-spacing");
    const spacing = value ? maxCssLength(value) : null;
    return /(?:eyebrow|kicker|section-label)/.test(selector)
      && /text-transform\s*:\s*uppercase/i.test(rule.declarations)
      && typeof spacing === "number"
      && spacing >= 0.08 * 16;
  });
}

function matchesUniformSectionFadeAndRise(source) {
  const sectionCount = [...source.matchAll(/<section\b/gi)].length;
  const revealSectionCount = [...source.matchAll(/<section\b[^>]*(?:class=["'][^"']*\breveal\b|data-reveal=["']?true|data-motion=["']reveal)/gi)].length;
  if (sectionCount === 0 || revealSectionCount < 3 || revealSectionCount / sectionCount < 0.75) {
    return false;
  }

  return extractRules(source).some((rule) => {
    const selector = rule.selector.toLowerCase();
    const transform = declarationValue(rule.declarations, "transform");
    return /(?:\.reveal|\[data-reveal\]|\[data-motion=["']?reveal["']?\])/.test(selector)
      && /opacity\s*:\s*0\b/i.test(rule.declarations)
      && Boolean(transform)
      && /translateY\(\s*(?:[1-9]\d*|\d+\.\d+)(?:px|rem|em)/i.test(transform)
      && /(?:transition|animation)\s*:/i.test(rule.declarations);
  });
}

function normalizeCheck(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function directoryUrl(value) {
  const url = value instanceof URL ? value : pathToFileURL(resolve(value));
  const text = url.href.endsWith("/") ? url.href : `${url.href}/`;
  return new URL(text);
}

function sameSet(actual, expected) {
  if (actual.length !== expected.length) return false;
  const have = new Set(actual);
  return expected.every((item) => have.has(item));
}

function formatList(values) {
  return `[${values.join(", ")}]`;
}

function emitAndExit(report, exitCode) {
  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(exitCode);
  }

  if (report.status === "pass") {
    console.log(
      `PASS ai-fingerprint-fixture-check: registryRows=${report.metadata.registryRowCount} samples=${report.metadata.sampleCount} matcherCount=${report.metadata.matcherCount}`
    );
  } else {
    console.error(`FAIL ai-fingerprint-fixture-check: ${report.stage}`);
    for (const error of report.errors ?? report.failures ?? []) {
      console.error(`- ${error}`);
    }
  }

  process.exit(exitCode);
}
