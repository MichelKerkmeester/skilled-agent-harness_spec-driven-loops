import Foundation

/// The phone-facing shapes of mobile protocol v1. These deliberately do NOT
/// mirror OpenCode's API models — the Mac adapter maps whatever the
/// installed OpenCode version returns into these, and the phone is coupled
/// only to this file. Fields are optional wherever a future Mac might
/// reasonably omit them; the phone must render around absence, not crash.
/// See docs/protocol-v1.md for the verified OpenCode calls behind each.

/// What this Mac's OpenCode installation can do — sent on `ready`, so the
/// phone can enable or hide features before asking for anything.
public struct Capabilities: Codable, Equatable, Sendable {
    public var opencodeVersion: String?
    public var permissions: Bool?
    public var questions: Bool?
    public var diffs: Bool?

    public init(
        opencodeVersion: String? = nil, permissions: Bool? = nil,
        questions: Bool? = nil, diffs: Bool? = nil
    ) {
        self.opencodeVersion = opencodeVersion
        self.permissions = permissions
        self.questions = questions
        self.diffs = diffs
    }
}

/// A place the agent can work: a project OpenCode has opened before, or a
/// git repo the Mac companion discovered that OpenCode hasn't seen yet
/// (`known == false`) — the launcher offers both.
public struct Project: Codable, Hashable, Identifiable, Sendable {
    public var id: String
    /// Absolute path on the Mac. Displayed by its last component; the full
    /// path is detail, not identity, on a phone screen.
    public var worktree: String
    public var name: String?
    public var updated: Date?
    /// False for discovered-but-never-opened repos.
    public var known: Bool?

    public init(
        id: String, worktree: String, name: String? = nil,
        updated: Date? = nil, known: Bool? = nil
    ) {
        self.id = id
        self.worktree = worktree
        self.name = name
        self.updated = updated
        self.known = known
    }

    public var displayName: String {
        name ?? worktree.split(separator: "/").last.map(String.init) ?? worktree
    }
}

/// One OpenCode session — a thread the user can continue from the phone.
public struct Session: Codable, Hashable, Identifiable, Sendable {
    public var id: String
    public var title: String?
    /// The project worktree it belongs to.
    public var directory: String?
    public var updated: Date?

    public init(id: String, title: String? = nil, directory: String? = nil, updated: Date? = nil) {
        self.id = id
        self.title = title
        self.directory = directory
        self.updated = updated
    }
}

/// The agent wants to do something and is blocked until someone answers.
/// This is the object the approval sheet renders — everything the user
/// needs to decide is here, because fetching more mid-decision is exactly
/// the round trip a phone can't afford.
public struct PermissionRequest: Codable, Equatable, Identifiable, Sendable {
    public var id: String
    public var sessionID: String?
    /// What class of thing: "bash", "edit", …
    public var permission: String?
    /// The concrete ask, e.g. the exact command.
    public var patterns: [String]?
    /// What an "always" reply would whitelist — shown so "always allow"
    /// is an informed choice, not a mystery toggle.
    public var always: [String]?
    /// "low" | "medium" | "high". Drives how loud the card is.
    ///
    /// Anthropic reports users approve 93% of permission prompts, and a
    /// card that looks identical every time is optimising for exactly that
    /// habituation — varying presentation by risk is the empirically
    /// supported answer.
    public var risk: String?

    public init(
        id: String, sessionID: String? = nil, permission: String? = nil,
        patterns: [String]? = nil, always: [String]? = nil, risk: String? = nil
    ) {
        self.id = id
        self.sessionID = sessionID
        self.permission = permission
        self.patterns = patterns
        self.always = always
        self.risk = risk
    }

    public enum Risk: String {
        /// Reversible and inside the project — git makes the cost of a
        /// wrong edit small.
        case low
        case medium
        /// Destructive, privileged, networked, or outside the workspace.
        case high
    }

    public var riskLevel: Risk { Risk(rawValue: risk ?? "") ?? .medium }
}

/// A file riding along with a prompt — a screenshot, a photo of a
/// whiteboard, a log. The bytes travel inline (base64) because the Mac
/// hosting a URL the model could fetch would mean exposing something, and
/// not exposing anything is the point of this product.
///
/// The phone shrinks images before they get here; see PromptAttachment on
/// the phone side for why a 12MP original is nobody's friend on cellular.
public struct Attachment: Codable, Hashable, Identifiable, Sendable {
    public var id: String
    public var name: String
    /// "image/jpeg", "application/pdf", "text/plain"…
    public var mime: String
    /// Base64 of the file's bytes.
    public var data: String

    public init(id: String = UUID().uuidString, name: String, mime: String, data: String) {
        self.id = id
        self.name = name
        self.mime = mime
        self.data = data
    }

    /// Roughly what this costs on the wire (base64 is 4 bytes per 3).
    public var byteCount: Int { data.count * 3 / 4 }
}

/// An agent the session can run as. The important one is `plan`, which
/// OpenCode describes as "Plan mode. Disallows all edit tools" — the
/// safest possible mode for someone steering from a phone, and the reason
/// this is worth surfacing at all.
public struct AgentInfo: Codable, Hashable, Identifiable, Sendable {
    public var name: String
    public var description: String?
    /// "primary" | "subagent" | "all". Only primary agents are pickable
    /// for a session.
    public var mode: String?

    public var id: String { name }

    public init(name: String, description: String? = nil, mode: String? = nil) {
        self.name = name
        self.description = description
        self.mode = mode
    }
}

/// One item on the agent's own plan for the turn.
public struct TodoItem: Codable, Hashable, Identifiable, Sendable {
    public var id: String
    public var content: String
    /// "pending" | "in_progress" | "completed" | "cancelled"
    public var status: String

    public init(id: String = UUID().uuidString, content: String, status: String) {
        self.id = id
        self.content = content
        self.status = status
    }

    public var done: Bool { status == "completed" }
    public var active: Bool { status == "in_progress" }
    public var cancelled: Bool { status == "cancelled" }
}

/// The state of the working tree — everything the agent has changed,
/// accumulated, rather than one turn's worth.
public struct WorkingChanges: Codable, Hashable, Sendable {
    public var branch: String?
    public var defaultBranch: String?
    public var files: [FileDiff]
    /// "git" (working tree vs HEAD) or "branch" (vs the default branch —
    /// what a reviewer would see in a pull request).
    public var mode: String?

    public init(
        branch: String? = nil, defaultBranch: String? = nil,
        files: [FileDiff], mode: String? = nil
    ) {
        self.branch = branch
        self.defaultBranch = defaultBranch
        self.files = files
        self.mode = mode
    }

    public var additions: Int { files.reduce(0) { $0 + ($1.additions ?? 0) } }
    public var deletions: Int { files.reduce(0) { $0 + ($1.deletions ?? 0) } }
}

/// A slash command the user's OpenCode offers — built in (`/init`,
/// `/review`), user-authored in `.opencode/command/*.md`, an MCP prompt, or
/// a skill.
///
/// Deliberately carries no template. OpenCode expands the template itself
/// when we invoke the command by name, so the phone never parses one, never
/// substitutes `$ARGUMENTS`, and never has an opinion about template syntax
/// — which is exactly the coupling that would break on their next release.
/// The templates are also enormous (several KB each); shipping them to a
/// phone would be pointless bytes.
public struct AgentCommand: Codable, Hashable, Identifiable, Sendable {
    public var name: String
    public var description: String?
    /// "command" | "skill" | "mcp" — worth showing, since a skill behaves
    /// rather differently from a one-shot command.
    public var source: String?
    /// What the command expects after its name, e.g. ["$ARGUMENTS"]. Empty
    /// means it takes none.
    public var hints: [String]?
    /// Runs in a subagent rather than this session.
    public var subtask: Bool?

    public var id: String { name }

    public init(
        name: String, description: String? = nil, source: String? = nil,
        hints: [String]? = nil, subtask: Bool? = nil
    ) {
        self.name = name
        self.description = description
        self.source = source
        self.hints = hints
        self.subtask = subtask
    }

    /// True when the command wants something typed after it.
    public var takesArguments: Bool { !(hints ?? []).isEmpty }
}

/// One model the user can pick, flattened from OpenCode's provider config.
public struct AgentModel: Codable, Hashable, Identifiable, Sendable {
    public var providerID: String
    public var modelID: String
    /// Display name ("Claude Opus 5"), falling back to the raw id.
    public var name: String
    /// Display name of the provider it belongs to ("Anthropic").
    public var provider: String
    /// Can it think before answering? Worth surfacing — on a phone the
    /// difference is minutes.
    public var reasoning: Bool?
    /// Can it accept images/files? Gates the attachment UI when that lands.
    public var attachment: Bool?

    public var id: String { "\(providerID)/\(modelID)" }

    public init(
        providerID: String, modelID: String, name: String, provider: String,
        reasoning: Bool? = nil, attachment: Bool? = nil
    ) {
        self.providerID = providerID
        self.modelID = modelID
        self.name = name
        self.provider = provider
        self.reasoning = reasoning
        self.attachment = attachment
    }
}

/// The agent is asking the user something — distinct from a permission:
/// there's nothing to allow, just a decision only the user can make.
public struct QuestionRequest: Codable, Hashable, Identifiable, Sendable {
    public var id: String
    public var sessionID: String?
    public var questions: [QuestionItem]

    public init(id: String, sessionID: String? = nil, questions: [QuestionItem]) {
        self.id = id
        self.sessionID = sessionID
        self.questions = questions
    }
}

public struct QuestionItem: Codable, Hashable, Sendable {
    public var question: String
    /// Very short label (chip-sized).
    public var header: String?
    public var options: [QuestionOption]
    public var multiple: Bool?
    /// True when a free-text answer is allowed alongside the options.
    public var custom: Bool?

    public init(
        question: String, header: String? = nil, options: [QuestionOption],
        multiple: Bool? = nil, custom: Bool? = nil
    ) {
        self.question = question
        self.header = header
        self.options = options
        self.multiple = multiple
        self.custom = custom
    }
}

public struct QuestionOption: Codable, Hashable, Sendable {
    public var label: String
    public var description: String?

    public init(label: String, description: String? = nil) {
        self.label = label
        self.description = description
    }
}

/// One file's worth of change from a turn, as a unified patch — the review
/// screen's unit.
public struct FileDiff: Codable, Hashable, Sendable {
    public var file: String
    public var patch: String?
    public var additions: Int?
    public var deletions: Int?
    /// "modified" | "added" | "deleted"
    public var status: String?

    public init(
        file: String, patch: String? = nil, additions: Int? = nil,
        deletions: Int? = nil, status: String? = nil
    ) {
        self.file = file
        self.patch = patch
        self.additions = additions
        self.deletions = deletions
        self.status = status
    }
}

/// One streaming piece of a running turn. Flattened from OpenCode's
/// message-part events into the little the phone actually renders; `type`
/// mirrors OpenCode's part types ("text", "reasoning", "tool", "step-start",
/// "step-finish", "patch") without promising the phone all of them.
public struct TurnPart: Codable, Equatable, Sendable {
    public var type: String
    /// The part's stable id, so a replayed or re-sent snapshot updates in
    /// place instead of appending a duplicate.
    public var id: String?
    /// text/reasoning: the accumulated content so far.
    public var text: String?
    /// tool: which tool.
    public var tool: String?
    /// tool: "pending" | "running" | "completed" | "error".
    public var status: String?

    public init(
        type: String, id: String? = nil, text: String? = nil,
        tool: String? = nil, status: String? = nil
    ) {
        self.type = type
        self.id = id
        self.text = text
        self.tool = tool
        self.status = status
    }
}
