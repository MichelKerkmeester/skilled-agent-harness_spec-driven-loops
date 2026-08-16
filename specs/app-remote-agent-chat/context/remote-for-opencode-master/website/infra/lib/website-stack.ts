import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export interface WebsiteStackProps extends cdk.StackProps {
  /**
   * Custom domain (e.g. "remoteforopencode.com"). Requires the Route 53
   * hosted zone that registering the domain creates; www is aliased
   * alongside the apex. Omit to deploy on the CloudFront domain only.
   */
  domainName?: string;
  /**
   * The pre-rename domain (goforopencode.com). Copies shipped before the
   * rename poll its /downloads/appcast.xml forever, so the same
   * distribution keeps answering for it. Requires its hosted zone, and a
   * prior deploy that already moved `domainName` off it — the old Apex/Www
   * records must be gone before the Legacy* ones can claim those names.
   */
  legacyDomainName?: string;
}

/**
 * Static site on S3 + CloudFront, same shape as the Tomte site: a private
 * bucket that only CloudFront can read, clean URLs via a CloudFront
 * Function, and a `/downloads` prefix holding the signed dmg and the
 * Sparkle appcast that installed copies poll.
 */
export class WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // Releases live under /downloads. Losing the bucket would strand
      // every installed copy's update feed.
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // /download -> /download.html, / -> /index.html. Keeps URLs clean while
    // the bucket holds Astro's `build.format: "file"` output.
    const urlRewrite = new cloudfront.Function(this, "UrlRewrite", {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var req = event.request;
  var uri = req.uri;
  if (uri.endsWith("/")) {
    req.uri = uri + "index.html";
  } else if (!uri.includes(".")) {
    req.uri = uri + ".html";
  }
  return req;
}
`),
    });

    let certificate: acm.ICertificate | undefined;
    let zone: route53.IHostedZone | undefined;
    let legacyZone: route53.IHostedZone | undefined;
    if (props.domainName) {
      zone = route53.HostedZone.fromLookup(this, "Zone", {
        domainName: props.domainName,
      });
      if (props.legacyDomainName) {
        legacyZone = route53.HostedZone.fromLookup(this, "LegacyZone", {
          domainName: props.legacyDomainName,
        });
      }
      // CloudFront requires its certificate in us-east-1, which is where
      // this stack is pinned.
      certificate = new acm.Certificate(this, "Certificate", {
        domainName: props.domainName,
        subjectAlternativeNames: [
          `www.${props.domainName}`,
          ...(props.legacyDomainName
            ? [props.legacyDomainName, `www.${props.legacyDomainName}`]
            : []),
        ],
        validation:
          props.legacyDomainName && legacyZone
            ? acm.CertificateValidation.fromDnsMultiZone({
                [props.domainName]: zone,
                [`www.${props.domainName}`]: zone,
                [props.legacyDomainName]: legacyZone,
                [`www.${props.legacyDomainName}`]: legacyZone,
              })
            : acm.CertificateValidation.fromDns(zone),
      });
    }

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: urlRewrite,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        // Release artefacts: no URL rewriting (they have real extensions),
        // and a short TTL on the appcast so an update is noticed promptly
        // rather than after a day of edge caching.
        "/downloads/*": {
          origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: new cloudfront.CachePolicy(this, "DownloadsCache", {
            comment: "Short TTL so Sparkle sees new releases quickly",
            defaultTtl: cdk.Duration.minutes(5),
            minTtl: cdk.Duration.seconds(0),
            maxTtl: cdk.Duration.hours(1),
          }),
        },
      },
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: "/404.html" },
      ],
      domainNames: props.domainName
        ? [
            props.domainName,
            `www.${props.domainName}`,
            ...(props.legacyDomainName
              ? [props.legacyDomainName, `www.${props.legacyDomainName}`]
              : []),
          ]
        : undefined,
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    if (props.domainName && zone) {
      const target = route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      );
      new route53.ARecord(this, "Apex", { zone, target });
      new route53.ARecord(this, "Www", { zone, recordName: "www", target });
      new route53.AaaaRecord(this, "ApexV6", { zone, target });
      new route53.AaaaRecord(this, "WwwV6", { zone, recordName: "www", target });
      if (legacyZone) {
        new route53.ARecord(this, "LegacyApex", { zone: legacyZone, target });
        new route53.ARecord(this, "LegacyWww", { zone: legacyZone, recordName: "www", target });
        new route53.AaaaRecord(this, "LegacyApexV6", { zone: legacyZone, target });
        new route53.AaaaRecord(this, "LegacyWwwV6", { zone: legacyZone, recordName: "www", target });
      }
    }

    new cdk.CfnOutput(this, "SiteBucketName", { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, "DistributionId", { value: distribution.distributionId });
    new cdk.CfnOutput(this, "SiteUrl", {
      value: props.domainName
        ? `https://${props.domainName}`
        : `https://${distribution.distributionDomainName}`,
    });
  }
}
