const fs = require("fs");
const painPointsPath = "memory/graph/nodes/PainPoints.json";
const ideasPath = "memory/graph/nodes/Ideas.json";
const feedPath = "memory/activity/feed.jsonl";

fs.writeFileSync("debug_log.txt", "Script started\n");

try {
  // Read files
  const painData = JSON.parse(fs.readFileSync(painPointsPath, "utf8"));
  let ideasData = { ideas: [], last_updated: "" };
  if (fs.existsSync(ideasPath)) {
    try {
        ideasData = JSON.parse(fs.readFileSync(ideasPath, "utf8"));
    } catch(e) {
        fs.appendFileSync("debug_log.txt", "Error reading ideas: " + e + "\n");
    }
  }

  fs.appendFileSync("debug_log.txt", `Loaded ${painData.pain_points.length} pain points\n`);

  // Sort pain points
  const topPains = (painData.pain_points || [])
    .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
    .slice(0, 10);

  const newIdeas = [];
  const currentIdeas = ideasData.ideas || [];

  // Helper to score idea
  const scoreIdea = (pain, angleUniqueness) => {
    // Formula from SOUL: (pain_frequency * 0.4) + (trend_momentum * 0.3) + (uniqueness * 0.2) + (urgency * 0.1)
    const freq = pain.frequency || 0;
    const trend = pain.trend_momentum || 0;
    const unique = angleUniqueness;
    const urgency = pain.urgency || 0;
    return Math.round((freq * 0.4) + (trend * 0.3) + (unique * 0.2) + (urgency * 0.1));
  };

  topPains.forEach(pain => {
    // Generate angles
    const angles = [
      { title: `Why ${pain.pain} is a symptom, not the disease`, uniqueness: 60 },
      { title: `The ${pain.pain} framework no one talks about`, uniqueness: 70 },
      { title: `I solved ${pain.pain} in 30 days. Here is how.`, uniqueness: 40 },
      { title: `Why everyone's advice on ${pain.pain} is wrong`, uniqueness: 80 },
      { title: `The 3 types of ${pain.pain} (and which one you have)`, uniqueness: 50 }
    ];

    angles.forEach(angle => {
      const score = scoreIdea(pain, angle.uniqueness);
      newIdeas.push({
        id: "idea_" + Math.random().toString(36).substr(2, 9),
        title: angle.title,
        angle: angle.title, // Using title as angle for simplicity
        addresses_pain: pain.id,
        score: score,
        status: score < 30 ? "archived" : "new",
        platform: score > 80 ? "linkedin" : "twitter",
        created_at: new Date().toISOString()
      });
    });
  });

  fs.appendFileSync("debug_log.txt", `Generated ${newIdeas.length} ideas\n`);

  const updatedIdeas = [...currentIdeas, ...newIdeas];
  const output = {
    ideas: updatedIdeas,
    last_updated: new Date().toISOString()
  };

  fs.writeFileSync(ideasPath, JSON.stringify(output, null, 2));

  // Log activity
  if (newIdeas.length > 0) {
      const sortedIdeas = newIdeas.sort((a, b) => b.score - a.score);
      const topIdea = sortedIdeas[0];
      const logEntry = {
        timestamp: new Date().toISOString(),
        agent: "IDEA_GENERATOR",
        action: "ideas_generated",
        message: `Generated ${newIdeas.length} ideas. Top: ${topIdea.title} (score: ${topIdea.score})`
      };
      
      // Ensure directory exists for feed
      const path = require("path");
      const dir = path.dirname(feedPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.appendFileSync(feedPath, JSON.stringify(logEntry) + "\n");
      
      // Output for the agent to report
      const summary = JSON.stringify(sortedIdeas.slice(0, 3));
      fs.writeFileSync("output_summary.json", summary);
      console.log(summary);
  } else {
      console.log("No new ideas generated.");
  }

} catch (err) {
  fs.appendFileSync("debug_log.txt", "Error: " + err + "\n");
  console.error(err);
}
