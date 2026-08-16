import RemoteKit
import Foundation
import OSLog

/// The half of the project launcher OpenCode can't provide: git repos on
/// this Mac that OpenCode has never opened. `GET /project` only knows
/// history; this walks the places people actually keep code so the phone
/// can start the agent somewhere new without ever touching the Mac.
///
/// Deliberately conservative: fixed well-known roots, shallow depth, and
/// heavy directories skipped by name. A wrong guess here costs a pointless
/// row on the phone; a greedy walk costs minutes of disk churn on every
/// refresh.
enum RepoDiscovery {
    private static let logger = Logger(
        subsystem: "com.timwilliams.opencodego", category: "discovery"
    )

    /// Where to look, relative to home. Missing roots are skipped silently.
    private static let roots = ["www", "Projects", "Developer", "Code", "src"]
    private static let maxDepth = 3
    /// Never descend into these: they are enormous, and a git repo inside
    /// one (a vendored dependency) is not a project anyone starts work in.
    private static let skipped: Set<String> = [
        "node_modules", "Pods", "vendor", ".build", "DerivedData",
        "Library", "dist", "build", "target",
    ]

    /// A scan is cheap but not free; results barely change minute to
    /// minute, so one answer serves a burst of refreshes.
    private static var cache: (at: Date, repos: [String])?
    private static let cacheWindow: TimeInterval = 60

    /// Absolute worktree paths of every discovered repo.
    static func repos() -> [String] {
        if let cache, Date().timeIntervalSince(cache.at) < cacheWindow {
            return cache.repos
        }
        let home = FileManager.default.homeDirectoryForCurrentUser
        var found: [String] = []
        for root in roots {
            walk(home.appendingPathComponent(root), depth: 0, into: &found)
        }
        cache = (Date(), found)
        logger.notice("discovered \(found.count) repos")
        return found
    }

    private static func walk(_ url: URL, depth: Int, into found: inout [String]) {
        let fm = FileManager.default
        var isDirectory: ObjCBool = false
        guard fm.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue
        else { return }
        if fm.fileExists(atPath: url.appendingPathComponent(".git").path) {
            found.append(url.path)
            // A repo's subdirectories are that repo, not more projects.
            return
        }
        guard depth < maxDepth,
              let children = try? fm.contentsOfDirectory(
                  at: url, includingPropertiesForKeys: [.isDirectoryKey],
                  options: [.skipsHiddenFiles]
              )
        else { return }
        for child in children {
            let name = child.lastPathComponent
            guard !skipped.contains(name) else { continue }
            walk(child, depth: depth + 1, into: &found)
        }
    }
}
