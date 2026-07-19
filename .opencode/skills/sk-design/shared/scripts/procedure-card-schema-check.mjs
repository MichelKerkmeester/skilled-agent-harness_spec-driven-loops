// ============================================================================
// Procedure Card Schema Check
// ============================================================================
// Automates the Required-Field Lint from shared/procedure-card-schema.md §4
// (rules 1-7 and 9). Rules 8 and 10 (no copied source prose; read-only modes
// gain no write/execute authority) are semantic judgment calls this script
// cannot reliably automate — they stay a manual review item, called out
// explicitly in the output rather than silently skipped.

import { readFile } from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_FRONTMATTER_FIELDS = ["title", "description", "trigger_phrases", "importance_tier", "contextType", "version"];
const REQUIRED_FIELD_ROWS = ["Purpose", "Owning mode", "Source reference", "Trigger", "Output contract", "Proof gate", "Privacy rule"];

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const skillRoot = resolve(scriptDir, "..", "..");

function findProcedureCards(root) {
  const results = [];
  const walk = (dir) => {
    const inProceduresDir = dir.split("/").pop() === "procedures";
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (entry === "node_modules") continue;
        walk(full);
      } else if (st.isFile() && entry.endsWith(".md") && inProceduresDir) {
        results.push(full);
      }
    }
  };
  walk(root);
  return results;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const fields = {};
  for (const key of REQUIRED_FRONTMATTER_FIELDS) {
    const lineMatch = block.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
    fields[key] = lineMatch ? lineMatch[1].trim() : null;
  }
  return { fields, bodyStart: match.index + match[0].length };
}

function checkCard(filePath, source) {
  const failures = [];
  const frontmatter = parseFrontmatter(source);

  if (!frontmatter) {
    return [`missing or malformed frontmatter block`];
  }
  for (const key of REQUIRED_FRONTMATTER_FIELDS) {
    if (!frontmatter.fields[key]) failures.push(`frontmatter missing required field: ${key}`);
  }

  const body = source.slice(frontmatter.bodyStart);
  const lines = body.split("\n");

  const h1Index = lines.findIndex((l) => /^# /.test(l));
  if (h1Index === -1) {
    failures.push("no H1 title found");
    return failures;
  }
  const h1Title = lines[h1Index].replace(/^# /, "").trim();
  const frontmatterTitle = (frontmatter.fields.title ?? "").trim();
  if (frontmatterTitle && h1Title !== frontmatterTitle) {
    failures.push(`H1 title "${h1Title}" does not match frontmatter title "${frontmatterTitle}"`);
  }

  const h2Indices = [];
  lines.forEach((l, i) => {
    if (/^## /.test(l)) h2Indices.push(i);
  });

  const introLines = lines.slice(h1Index + 1, h2Indices[0] ?? lines.length).map((l) => l.trim()).filter(Boolean);
  if (introLines.length === 0) {
    failures.push("no intro sentence found between the H1 and the first H2");
  }

  if (h2Indices.length === 0) {
    failures.push("no H2 sections found (expected ## 1. REQUIRED FIELDS)");
    return failures;
  }
  const firstH2 = lines[h2Indices[0]].replace(/^## /, "").trim();
  if (firstH2 !== "1. REQUIRED FIELDS") {
    failures.push(`first H2 is "${firstH2}", expected "1. REQUIRED FIELDS"`);
  }

  h2Indices.forEach((idx, i) => {
    const heading = lines[idx].replace(/^## /, "").trim();
    const expectedPrefix = `${i + 1}.`;
    if (!heading.startsWith(expectedPrefix)) {
      failures.push(`H2 section "${heading}" is out of sequence (expected to start with "${expectedPrefix}")`);
    }
  });

  const requiredFieldsEnd = h2Indices.length > 1 ? h2Indices[1] : lines.length;
  const requiredFieldsBlock = lines.slice(h2Indices[0], requiredFieldsEnd);
  const headerLine = requiredFieldsBlock.find((l) => l.trim().startsWith("|"));
  if (!headerLine || headerLine.replace(/\s+/g, "") !== "|Field|Value|") {
    failures.push(`required-fields table header missing or malformed (expected "| Field | Value |")`);
  }

  const rows = requiredFieldsBlock
    .filter((l) => l.trim().startsWith("|") && !/^\|-+\|/.test(l.trim().replace(/\s+/g, "")))
    .slice(1); // drop the header row itself
  const rowNames = rows.map((r) => {
    const cells = r.split("|").map((c) => c.trim()).filter(Boolean);
    return cells[0];
  });

  REQUIRED_FIELD_ROWS.forEach((expected, i) => {
    if (rowNames[i] !== expected) {
      failures.push(`required-fields row ${i + 1} is "${rowNames[i] ?? "<missing>"}", expected "${expected}"`);
    }
  });

  rows.forEach((r) => {
    const cells = r.split("|").map((c) => c.trim()).filter(Boolean);
    const [name, value] = cells;
    if (name && (!value || value.length === 0)) {
      failures.push(`required-fields row "${name}" has an empty value`);
    }
  });

  return failures;
}

async function main() {
  const cards = findProcedureCards(skillRoot);
  const results = [];
  for (const filePath of cards) {
    const source = await readFile(filePath, "utf8");
    const failures = checkCard(filePath, source);
    results.push({ file: relative(skillRoot, filePath), failures });
  }

  const failingCards = results.filter((r) => r.failures.length > 0);
  const status = failingCards.length === 0 ? "pass" : "fail";

  console.log(JSON.stringify({
    status,
    cardCount: results.length,
    failingCardCount: failingCards.length,
    results,
    manualReviewOnly: [
      "Rule 8 (external sources cited by filename only, no copied source prose/prompt body/starter code) is not automated here — review by hand.",
      "Rule 10 (read-only modes gain no Write/Edit/Bash/execution authority through the card) is not automated here — review by hand.",
    ],
  }, null, 2));

  process.exit(status === "pass" ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "invalid", stage: "runtime", error: error instanceof Error ? error.message : String(error) }));
  process.exit(2);
});
