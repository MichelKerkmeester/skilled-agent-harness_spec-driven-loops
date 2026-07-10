// ============================================================================
// AI Fingerprint Registry Check
// ============================================================================

import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const REQUIRED_FIELDS = [
  "tell_id",
  "model_family",
  "self_defect_prompt",
  "deterministic_check",
  "fixture_id",
  "severity_floor",
  "owner"
];

const MODEL_FAMILIES = new Set(["opencode", "gemini", "general"]);
const SEVERITY_FLOORS = new Set(["P0", "P1", "P2", "P3"]);
const OWNERS = new Set(["foundations", "interface", "motion", "sk-code"]);
const SLUG_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

const scriptUrl = new URL(import.meta.url);
const skillRootUrl = new URL("../../", scriptUrl);
const catalogUrl = new URL("design-audit/references/ai_fingerprint_tells.md", skillRootUrl);
const registryUrl = new URL("design-audit/assets/ai_fingerprint_registry.json", skillRootUrl);
const fixtureRootUrl = new URL("design-audit/assets/ai_fingerprint_fixtures/", skillRootUrl);

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
  const [catalogSource, registry] = await Promise.all([
    readFile(options.catalog ?? catalogUrl, "utf8"),
    readJson(options.registry ?? registryUrl)
  ]);

  const catalogTells = parseCatalogTells(catalogSource);
  const validation = validateRegistry(registry, catalogTells);
  const fixtureFailures = await validateFixtureFiles(
    validation.rows,
    directoryUrl(options.fixturesRoot ?? fixtureRootUrl)
  );
  const failures = [...validateCatalog(catalogTells), ...validation.errors, ...fixtureFailures];
  const status = failures.length > 0 ? "fail" : "pass";

  emitAndExit(
    {
      status,
      stage: status === "pass" ? "complete" : "parity",
      metadata: {
        catalogTellCount: catalogTells.length,
        registryRowCount: validation.rows.length,
        requiredFieldCount: REQUIRED_FIELDS.length,
        fixtureRoot: directoryUrl(options.fixturesRoot ?? fixtureRootUrl).href
      },
      failures
    },
    status === "pass" ? 0 : 1
  );
}

function parseArgs(args) {
  const parsed = {
    catalog: null,
    registry: null,
    fixturesRoot: null,
    json: false,
    errors: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--catalog" || arg === "--registry" || arg === "--fixtures-root") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        parsed.errors.push(`${arg} requires a path value`);
      } else if (arg === "--catalog") {
        parsed.catalog = value;
        index += 1;
      } else if (arg === "--registry") {
        parsed.registry = value;
        index += 1;
      } else {
        parsed.fixturesRoot = value;
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

function parseCatalogTells(source) {
  const tells = [];
  let currentFamily = null;

  for (const line of source.split(/\r?\n/)) {
    const familyMatch = line.match(/^##\s+\d+\.\s+(.+?)\s*$/);
    if (familyMatch) {
      currentFamily = familyFromHeading(familyMatch[1]);
      continue;
    }

    if (!currentFamily) {
      continue;
    }

    const tellMatch = line.match(/^###\s+(?:\d+(?:\.\d+)*\s+)?(.+?)\s*$/);
    if (!tellMatch) {
      continue;
    }

    const title = tellMatch[1].trim();
    tells.push({
      tell_id: slugify(title),
      title,
      model_family: currentFamily
    });
  }

  return tells;
}

function familyFromHeading(heading) {
  const normalized = heading.toLowerCase();

  if (normalized.includes("opencode-lineage tells")) {
    return "opencode";
  }

  if (normalized.includes("gemini tells")) {
    return "gemini";
  }

  if (normalized.includes("2026-general tells")) {
    return "general";
  }

  return null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateCatalog(catalogTells) {
  const errors = [];
  const seen = new Set();

  if (catalogTells.length === 0) {
    errors.push("catalog: no AI fingerprint tells found");
  }

  for (const tell of catalogTells) {
    if (!SLUG_PATTERN.test(tell.tell_id)) {
      errors.push(`catalog tell ${tell.title}: tell_id ${tell.tell_id} is malformed`);
    }

    if (seen.has(tell.tell_id)) {
      errors.push(`catalog tell ${tell.tell_id}: duplicate catalog slug`);
    } else {
      seen.add(tell.tell_id);
    }
  }

  return errors;
}

function validateRegistry(registry, catalogTells) {
  const errors = [];

  if (!Array.isArray(registry)) {
    return {
      rows: [],
      errors: ["registry root must be an array"]
    };
  }

  const rows = registry;
  const rowByTellId = new Map();
  const catalogByTellId = new Map(catalogTells.map((tell) => [tell.tell_id, tell]));

  rows.forEach((row, index) => {
    const label = rowLabel(row, index);

    if (!isPlainObject(row)) {
      errors.push(`${label}: row must be an object`);
      return;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!Object.hasOwn(row, field)) {
        errors.push(`${label}: missing required field ${field}`);
      } else if (typeof row[field] !== "string" || row[field].trim().length === 0) {
        errors.push(`${label}: ${field} must be a non-empty string`);
      }
    }

    for (const field of Object.keys(row)) {
      if (!REQUIRED_FIELDS.includes(field)) {
        errors.push(`${label}: unknown field ${field}`);
      }
    }

    if (typeof row.tell_id === "string" && row.tell_id.trim().length > 0) {
      if (!SLUG_PATTERN.test(row.tell_id)) {
        errors.push(`${label}: tell_id must be a lowercase hyphen slug`);
      }

      if (rowByTellId.has(row.tell_id)) {
        errors.push(`${label}: duplicate tell_id also used by ${rowByTellId.get(row.tell_id)}`);
      } else {
        rowByTellId.set(row.tell_id, label);
      }
    }

    if (typeof row.model_family === "string" && !MODEL_FAMILIES.has(row.model_family)) {
      errors.push(`${label}: model_family must be one of ${[...MODEL_FAMILIES].join(", ")}`);
    }

    if (typeof row.severity_floor === "string" && !SEVERITY_FLOORS.has(row.severity_floor)) {
      errors.push(`${label}: severity_floor must be one of ${[...SEVERITY_FLOORS].join(", ")}`);
    }

    if (typeof row.owner === "string" && !OWNERS.has(row.owner)) {
      errors.push(`${label}: owner must be one of ${[...OWNERS].join(", ")}`);
    }

    if (typeof row.fixture_id === "string" && !SLUG_PATTERN.test(row.fixture_id)) {
      errors.push(`${label}: fixture_id must be a lowercase hyphen slug`);
    }
  });

  for (const tell of catalogTells) {
    const row = rows.find((candidate) => candidate?.tell_id === tell.tell_id);
    if (!row) {
      errors.push(`catalog tell ${tell.tell_id}: missing registry row`);
      continue;
    }

    if (row.model_family !== tell.model_family) {
      errors.push(
        `registry row ${tell.tell_id}: model_family ${row.model_family} does not match catalog ${tell.model_family}`
      );
    }
  }

  for (const row of rows) {
    if (typeof row?.tell_id === "string" && row.tell_id.length > 0 && !catalogByTellId.has(row.tell_id)) {
      errors.push(`registry row ${row.tell_id}: no matching catalog tell`);
    }
  }

  return {
    rows,
    errors: errors.sort()
  };
}

async function validateFixtureFiles(rows, rootUrl) {
  const errors = [];

  await Promise.all(rows.map(async (row, index) => {
    if (typeof row?.fixture_id !== "string" || row.fixture_id.trim().length === 0) {
      return;
    }

    if (!SLUG_PATTERN.test(row.fixture_id)) {
      return;
    }

    const label = rowLabel(row, index);
    const dirUrl = new URL(`${row.fixture_id}/`, rootUrl);
    const cleanUrl = new URL(`${row.fixture_id}/clean.html`, rootUrl);
    const tellUrl = new URL(`${row.fixture_id}/tell.html`, rootUrl);

    if (!(await existsAs(dirUrl, "directory"))) {
      errors.push(`${label}: fixture directory ${row.fixture_id}/ is missing`);
      return;
    }

    if (!(await existsAs(cleanUrl, "file"))) {
      errors.push(`${label}: fixture ${row.fixture_id}/clean.html is missing`);
    }

    if (!(await existsAs(tellUrl, "file"))) {
      errors.push(`${label}: fixture ${row.fixture_id}/tell.html is missing`);
    }
  }));

  return errors.sort();
}

async function existsAs(url, kind) {
  try {
    const entry = await stat(url);
    return kind === "directory" ? entry.isDirectory() : entry.isFile();
  } catch {
    return false;
  }
}

function rowLabel(row, index) {
  if (typeof row?.tell_id === "string" && row.tell_id.length > 0) {
    return `registry row ${row.tell_id}`;
  }

  return `registry row [${index}]`;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function directoryUrl(value) {
  const url = value instanceof URL ? value : pathToFileURL(resolve(value));
  const text = url.href.endsWith("/") ? url.href : `${url.href}/`;
  return new URL(text);
}

function emitAndExit(report, exitCode) {
  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(exitCode);
  }

  if (report.status === "pass") {
    console.log(
      `PASS ai-fingerprint-registry-check: catalogTells=${report.metadata.catalogTellCount} registryRows=${report.metadata.registryRowCount}`
    );
  } else {
    console.error(`FAIL ai-fingerprint-registry-check: ${report.stage}`);
    for (const error of report.errors ?? report.failures ?? []) {
      console.error(`- ${error}`);
    }
  }

  process.exit(exitCode);
}
