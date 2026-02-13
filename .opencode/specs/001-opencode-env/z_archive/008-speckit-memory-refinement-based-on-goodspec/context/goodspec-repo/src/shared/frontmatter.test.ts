/**
 * Tests for frontmatter parser
 */

import { describe, it, expect } from "bun:test";
import {
  parseFrontmatter,
  hasFrontmatter,
  extractFrontmatterYaml,
} from "./frontmatter";

describe("frontmatter", () => {
  describe("parseFrontmatter", () => {
    it("should parse basic key-value pairs", () => {
      const content = `---
name: test-agent
description: A test agent
---
# Body content`;

      const result = parseFrontmatter(content);
      expect(result.data.name).toBe("test-agent");
      expect(result.data.description).toBe("A test agent");
      expect(result.body).toBe("# Body content");
    });

    it("should parse numbers", () => {
      const content = `---
temperature: 0.5
count: 42
---
Body`;

      const result = parseFrontmatter(content);
      expect(result.data.temperature).toBe(0.5);
      expect(result.data.count).toBe(42);
    });

    it("should parse booleans", () => {
      const content = `---
enabled: true
disabled: false
---
Body`;

      const result = parseFrontmatter(content);
      expect(result.data.enabled).toBe(true);
      expect(result.data.disabled).toBe(false);
    });

    it("should parse arrays", () => {
      const content = `---
tools:
  - read
  - write
  - bash
---
Body`;

      const result = parseFrontmatter(content);
      expect(result.data.tools).toEqual(["read", "write", "bash"]);
    });

    it("should handle content without frontmatter", () => {
      const content = "# Just a heading\n\nSome content";

      const result = parseFrontmatter(content);
      expect(result.data).toEqual({});
      expect(result.body).toBe("# Just a heading\n\nSome content");
    });

    it("should handle empty frontmatter", () => {
      const content = `---
---
Body content`;

      const result = parseFrontmatter(content);
      expect(result.data).toEqual({});
      expect(result.body).toBe("Body content");
    });

    it("should preserve original content", () => {
      const content = `---
name: test
---
Body`;

      const result = parseFrontmatter(content);
      expect(result.content).toBe(content);
    });

    it("should handle quoted strings", () => {
      const content = `---
name: "quoted value"
other: 'single quoted'
---
Body`;

      const result = parseFrontmatter(content);
      expect(result.data.name).toBe("quoted value");
      expect(result.data.other).toBe("single quoted");
    });

    it("should handle multiline body", () => {
      const content = `---
name: test
---

# Heading

Paragraph 1

Paragraph 2`;

      const result = parseFrontmatter(content);
      expect(result.body).toContain("# Heading");
      expect(result.body).toContain("Paragraph 1");
      expect(result.body).toContain("Paragraph 2");
    });
  });

  describe("hasFrontmatter", () => {
    it("should return true for content with frontmatter", () => {
      const content = `---
name: test
---
Body`;
      expect(hasFrontmatter(content)).toBe(true);
    });

    it("should return false for content without frontmatter", () => {
      const content = "# Just a heading";
      expect(hasFrontmatter(content)).toBe(false);
    });

    it("should handle leading whitespace", () => {
      const content = `  ---
name: test
---
Body`;
      expect(hasFrontmatter(content)).toBe(true);
    });
  });

  describe("extractFrontmatterYaml", () => {
    it("should extract yaml content", () => {
      const content = `---
name: test
value: 42
---
Body`;
      const yaml = extractFrontmatterYaml(content);
      expect(yaml).toContain("name: test");
      expect(yaml).toContain("value: 42");
    });

    it("should return null for content without frontmatter", () => {
      const content = "# Just a heading";
      expect(extractFrontmatterYaml(content)).toBeNull();
    });
  });
});
