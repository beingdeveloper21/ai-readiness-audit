import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Analyze endpoint
app.get("/analyze", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Add user agent to avoid being blocked
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    let score = 100;
    const issues = [];

    // Check 1: Page title
    const title = $("title").text().trim();
    if (!title) {
      issues.push({ text: "Missing page title", severity: "high" });
      score -= 10;
    }

    // Check 2: Meta description
    const metaDesc = $('meta[name="description"]').attr("content");
    if (!metaDesc) {
      issues.push({ text: "Missing meta description", severity: "high" });
      score -= 10;
    }

    // Check 3: H1 heading
    const h1Count = $("h1").length;
    if (h1Count === 0) {
      issues.push({ text: "No H1 heading found", severity: "high" });
      score -= 10;
    } else if (h1Count > 1) {
      issues.push({ text: "Multiple H1 headings (should have only one)", severity: "medium" });
      score -= 5;
    }

    // Check 4: FAQ section
    const bodyText = $("body").text().toLowerCase();
    const hasFaq = bodyText.includes("faq") || bodyText.includes("frequently asked");
    if (!hasFaq) {
      issues.push({ text: "No FAQ section detected", severity: "medium" });
      score -= 10;
    }

    // Check 5: Structured data (JSON-LD)
    const structuredData = $('script[type="application/ld+json"]').length;
    if (structuredData === 0) {
      issues.push({ text: "No structured data (Schema.org)", severity: "high" });
      score -= 10;
    }

    // Check 6: Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDesc = $('meta[property="og:description"]').attr("content");
    if (!ogTitle || !ogDesc) {
      issues.push({ text: "Missing Open Graph tags", severity: "medium" });
      score -= 10;
    }

    // Check 7: Blog or resources
    const hasBlog = bodyText.includes("blog") || bodyText.includes("resources") || bodyText.includes("articles");
    if (!hasBlog) {
      issues.push({ text: "No blog or resources section", severity: "medium" });
      score -= 5;
    }

    // Check 8: Internal links
    const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
    if (internalLinks < 3) {
      issues.push({ text: "Weak internal linking structure", severity: "medium" });
      score -= 5;
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    // Generate AI-style insight based on findings
    const aiInsight = generateAIInsight(score, issues, {
      hasTitle: !!title,
      hasMetaDesc: !!metaDesc,
      h1Count,
      hasStructuredData: structuredData > 0,
      hasOgTags: !!(ogTitle && ogDesc),
      hasBlog
    });

    res.json({ 
      score, 
      issues,
      details: {
        title: title || "Not found",
        hasMetaDesc: !!metaDesc,
        h1Count,
        hasStructuredData: structuredData > 0,
        hasOgTags: !!(ogTitle && ogDesc),
      },
      aiInsight
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ 
      error: "Could not fetch the website. It may be blocking requests or the URL is invalid." 
    });
  }
});

// Generate smart AI-style insight (rule-based, looks like AI)
function generateAIInsight(score, issues, details) {
  const highSeverity = issues.filter(i => i.severity === 'high').length;
  const mediumSeverity = issues.filter(i => i.severity === 'medium').length;

  let insight = "";

  if (score >= 90) {
    insight = "Excellent! This website demonstrates strong SEO fundamentals and is well-optimized for AI discovery systems. The presence of structured data, proper heading hierarchy, and meta elements suggests a technically sound approach to content organization.";
  } else if (score >= 75) {
    insight = "Good foundation with room for improvement. The site has basic SEO elements but lacks semantic richness that would enhance AI visibility. Adding structured data (Schema.org) and a FAQ section would significantly boost discoverability.";
  } else if (score >= 60) {
    insight = "The website shows moderate optimization but faces challenges in AI-driven search contexts. Key areas to address include implementing structured data markup and improving content depth for better semantic understanding.";
  } else {
    insight = "This site requires significant optimization for AI systems. The lack of fundamental SEO elements limits visibility in modern search paradigms. Prioritize adding meta descriptions, structured data, and a clear heading structure.";
  }

  // Add specific recommendations
  if (highSeverity > 2) {
    insight += " Critical: Address the high-severity issues immediately as they have the biggest impact on AI indexing.";
  } else if (details.hasStructuredData && !details.hasMetaDesc) {
    insight += " Note: While structured data is present, adding meta descriptions would complete the SEO profile.";
  } else if (!details.hasStructuredData && details.hasTitle) {
    insight += " Tip: Adding JSON-LD structured data would help AI systems better understand the page content.";
  }

  return insight;
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});