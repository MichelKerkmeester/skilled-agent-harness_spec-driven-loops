import Foundation

/// What the composer has typed, understood as a possible slash command.
///
/// Kept as a parsing function rather than state so there is exactly one
/// definition of "is this a command" shared by the palette and the send
/// path — the classic way these two drift apart is two parsers.
public enum SlashInput {
    /// The command to run, but only when the name is one this Mac actually
    /// has. Everything else is prose, including:
    ///
    /// - a typo (`/sumarize`), which OpenCode answers with an opaque 500
    /// - a path (`/Users/tim/thing.swift — look at this`), which would
    ///   otherwise parse as a command named "Users"
    ///
    /// Checking against the real list is what makes both harmless. The
    /// palette gives feedback while typing, so a typo is visible before
    /// send rather than after.
    public static func command(_ text: String, known: [AgentCommand]) -> (name: String, arguments: String)? {
        guard let parsed = parse(text) else { return nil }
        guard known.contains(where: { $0.name == parsed.name }) else { return nil }
        return parsed
    }

    /// The raw split, regardless of whether the name is real.
    public static func parse(_ text: String) -> (name: String, arguments: String)? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix("/"), trimmed.count > 1 else { return nil }
        let body = trimmed.dropFirst()
        guard let space = body.firstIndex(where: { $0 == " " || $0 == "\n" }) else {
            return (String(body), "")
        }
        return (
            String(body[body.startIndex ..< space]),
            String(body[space...]).trimmingCharacters(in: .whitespacesAndNewlines)
        )
    }

    /// While the user is still typing the *name* — no space yet — the
    /// palette should be open and filtering. Once they've typed a space
    /// they're writing arguments, and the palette gets out of the way.
    public static func query(_ text: String) -> String? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix("/") else { return nil }
        let body = trimmed.dropFirst()
        guard !body.contains(" "), !body.contains("\n") else { return nil }
        return String(body)
    }
}
