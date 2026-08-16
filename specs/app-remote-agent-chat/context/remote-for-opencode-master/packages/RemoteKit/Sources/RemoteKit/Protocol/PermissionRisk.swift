import Foundation

/// How loudly to ask before doing something.
///
/// Reads and in-project edits are cheap to undo — version control is the
/// safety net, the same reasoning Anthropic uses to let them through with
/// less friction. What escalates: destruction, privilege, the network, and
/// anything reaching outside the project.
///
/// This lives in the shared package rather than the Mac adapter because
/// it is policy, not plumbing: it decides how loud a card is on the phone,
/// and a policy nobody can test is a policy nobody should trust.
public enum PermissionRisk: String, Sendable {
    case low, medium, high

    /// Substring matching on purpose: these appear mid-pipeline
    /// (`foo && rm -rf bar`) at least as often as at the start.
    static let dangerous = [
        "rm ", "rm -", "sudo", "chmod", "chown", "dd ", "mkfs",
        "curl", "wget", "ssh ", "scp ", "npm publish", "git push",
        "git reset --hard", "kill ", "launchctl", "defaults write",
        "> /", "shutdown", "reboot",
    ]
    static let harmless = ["git status", "git diff", "git log", "ls", "cat ", "echo ", "pwd"]

    public static func classify(permission: String?, patterns: [String]) -> PermissionRisk {
        let text = patterns.joined(separator: " ").lowercased()
        switch permission {
        case "read", "glob", "grep", "list", "lsp":
            return .low
        case "edit", "write", "patch":
            // A path climbing out of the project is not an in-project edit.
            return text.contains("..") ? .high : .low
        case "external_directory", "webfetch", "websearch":
            return .high
        case "bash":
            if dangerous.contains(where: { text.contains($0) }) { return .high }
            if harmless.contains(where: { text.hasPrefix($0) }) { return .low }
            return .medium
        default:
            return .medium
        }
    }
}
