import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const version = readFileSync(resolve(root, "VERSION"), "utf8").trim();
const readme = readFileSync(resolve(root, "README.md"), "utf8");
const changelog = readFileSync(resolve(root, "CHANGELOG.md"), "utf8");

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(pkg.name === "pi-skill-orchestrator", "package name must be pi-skill-orchestrator");
expect(pkg.version === version, "package.json version must match VERSION");
expect(readme.includes(`**Version:** \`${version}\``), "README version must match VERSION");
expect(changelog.includes(`## ${version} -`), "CHANGELOG must contain the current VERSION");
expect(pkg.author === "Alan Guice (Badgids)", "package author must be Alan Guice (Badgids)");
expect(pkg.license === "MIT", "package license must be MIT");
expect(pkg.repository?.url === "git+https://github.com/badgids/pi-skill-orchestrator.git", "repository URL is missing or incorrect");
expect(pkg.homepage === "https://github.com/badgids/pi-skill-orchestrator#readme", "homepage URL is missing or incorrect");
expect(pkg.bugs?.url === "https://github.com/badgids/pi-skill-orchestrator/issues", "bugs URL is missing or incorrect");
expect(pkg.publishConfig?.access === "public", "publishConfig.access must be public");
expect(pkg.engines?.node === ">=22.19.0", "Node.js minimum must remain >=22.19.0 for current Pi compatibility");
expect(Array.isArray(pkg.pi?.extensions) && pkg.pi.extensions.length === 1 && pkg.pi.extensions[0] === "./src/index.ts", "Pi package manifest must load ./src/index.ts");
expect(pkg.keywords?.includes("pi-package"), "package keywords must include pi-package");

for (const name of ["@earendil-works/pi-coding-agent", "@earendil-works/pi-tui", "typebox"]) {
  expect(pkg.peerDependencies?.[name] === "*", `${name} must be a '*' peer dependency`);
  expect(pkg.dependencies?.[name] === undefined, `${name} must not be a normal dependency`);
}

for (const requiredFile of ["src/", "docs/", "README.md", "CHANGELOG.md", "LICENSE", "VERSION"]) {
  expect(pkg.files?.includes(requiredFile), `npm files list must include ${requiredFile}`);
}

const license = readFileSync(resolve(root, "LICENSE"), "utf8");
expect(license.startsWith("MIT License\n"), "LICENSE must contain the MIT License");
expect(license.includes("Copyright (c) 2026 Alan Guice (Badgids)"), "LICENSE copyright attribution is missing");

if (failures.length) {
  console.error("Package check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Package metadata is release-ready for pi-skill-orchestrator ${version}.`);
