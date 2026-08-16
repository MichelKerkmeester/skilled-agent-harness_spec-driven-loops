import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

/// How images are sized for the wire — the conventions Tomte validated in
/// production, adopted verbatim so both apps behave the same way.
///
/// Two things matter here. First, ImageIO rather than a redraw: it honours
/// EXIF orientation and never decodes more than the thumbnail it was asked
/// for, so a 48MP HEIC doesn't become 200 MB of RAM on the way to becoming
/// 300 KB of JPEG. Second, the numbers: a vision tower resamples its input
/// to a fixed grid well under 900px, so pixels past these bounds are cost
/// without signal.
public enum ImageShaping {
    /// The display copy's bound. Far above what the model keeps, low enough
    /// that a phone photo lands in the low hundreds of KB.
    public static let maxEdge: CGFloat = 1024
    public static let quality: CGFloat = 0.7
    /// Refuse anything still bigger than this after the shrink — a hostile
    /// or pathological source. Well above what maxEdge/quality produce.
    public static let maxBytes = 2 << 20

    /// The transit copy's bound: for a constrained wire, not for eyes.
    /// Half to a third the size at no cost to the answer.
    static let transitEdge: CGFloat = 800
    static let transitQuality: CGFloat = 0.55

    /// Downscale-and-transcode whatever the picker produced — HEIC off the
    /// camera, PNG from a screenshot, anything ImageIO reads. Nil when the
    /// bytes aren't an image; the caller tells the user.
    public static func downscaledJPEG(
        from data: Data, maxEdge: CGFloat = ImageShaping.maxEdge,
        quality: CGFloat = ImageShaping.quality
    ) -> Data? {
        guard let source = CGImageSourceCreateWithData(data as CFData, nil),
              let image = CGImageSourceCreateThumbnailAtIndex(source, 0, [
                  kCGImageSourceCreateThumbnailFromImageAlways: true,
                  kCGImageSourceThumbnailMaxPixelSize: maxEdge,
                  kCGImageSourceCreateThumbnailWithTransform: true,
              ] as CFDictionary)
        else { return nil }
        let out = NSMutableData()
        guard let destination = CGImageDestinationCreateWithData(
            out, UTType.jpeg.identifier as CFString, 1, nil
        ) else { return nil }
        CGImageDestinationAddImage(
            destination, image,
            [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary
        )
        guard CGImageDestinationFinalize(destination) else { return nil }
        return out as Data
    }

    /// The image sized for a constrained wire. Falls back to what it was
    /// given if the re-encode fails or somehow came out bigger.
    public static func transitJPEG(from data: Data) -> Data {
        guard let smaller = downscaledJPEG(
            from: data, maxEdge: transitEdge, quality: transitQuality
        ), smaller.count < data.count else { return data }
        return smaller
    }
}

public extension Wire.Request {
    /// This request sized for a constrained path — the punched UDP stream
    /// on cellular, where every kilobyte is seconds. Images shrink to their
    /// transit copy; everything else travels as-is, since text and PDFs are
    /// already compressed inside the seal (see Wire.Squeeze).
    ///
    /// The phone's own transcript keeps whatever it displayed; only what
    /// goes to the model is re-sized.
    func thinned() -> Wire.Request {
        guard let attachments, !attachments.isEmpty else { return self }
        var out = self
        out.attachments = attachments.map { attachment in
            guard attachment.mime.hasPrefix("image/"),
                  let raw = Data(base64Encoded: attachment.data)
            else { return attachment }
            var thinner = attachment
            thinner.data = ImageShaping.transitJPEG(from: raw).base64EncodedString()
            thinner.mime = "image/jpeg"
            return thinner
        }
        return out
    }
}
