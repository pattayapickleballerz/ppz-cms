/* PPC tournament scheduling engine — six unique opponents per team.
   8 teams per category, 3 categories per skill level, 11 courts.
   Pure functions: no database access. */
export const SKILLS = ["Beginner", "Intermediate", "Advanced"];
export const CATEGORIES = ["Men's Doubles", "Women's Doubles", "Mixed Doubles"];
export const COURTS = 11;
export const ROUNDS = 6;

export function roundRobin(teamIds) {
  if (!Array.isArray(teamIds) || teamIds.length !== 8 || new Set(teamIds).size !== 8) {
    throw new Error("Each category requires exactly eight distinct team IDs.");
  }
  const rotation = [...teamIds];
  const matches = [];
  for (let round = 1; round <= ROUNDS; round++) {
    for (let i = 0; i < 4; i++) {
      matches.push({round, teamA: rotation[i], teamB: rotation[7-i]});
    }
    rotation.splice(1, 0, rotation.pop());
  }
  return matches;
}

/* All three categories share the same 11 courts within one skill-level block.
   A wave is one court allocation cycle; rounds stay distinct per category.
   No team is scheduled twice within a wave. */
export function scheduleSkillBlock(teamsByCategory) {
  for (const category of CATEGORIES) {
    if (!teamsByCategory[category]) throw new Error("Missing category: " + category);
  }
  const matches = CATEGORIES.flatMap(category =>
    roundRobin(teamsByCategory[category]).map(match => ({...match, category}))
  );
  const waves = [];
  const pending = [...matches];
  while (pending.length) {
    const usedTeams = new Set();
    const wave = [];
    for (let i = 0; i < pending.length && wave.length < COURTS;) {
      const m = pending[i];
      if (usedTeams.has(m.teamA) || usedTeams.has(m.teamB)) {i++;continue;}
      wave.push({...m, court: wave.length+1, wave: waves.length+1});
      usedTeams.add(m.teamA);usedTeams.add(m.teamB);
      pending.splice(i,1);
    }
    if (!wave.length) throw new Error("Unable to allocate matches");
    waves.push(wave);
  }
  return waves;
}

export function validateSchedule(waves, teamsByCategory) {
  const all = waves.flat();
  if (all.length !== 72) throw new Error("Expected 72 matches per skill level");
  const counts = new Map(), opponents = new Map();
  for (const wave of waves) {
    if (wave.length > COURTS) throw new Error("Too many simultaneous matches");
    const playing = new Set(), courts = new Set();
    for (const m of wave) {
      if (playing.has(m.teamA) || playing.has(m.teamB)) throw new Error("Team double-booked");
      if (courts.has(m.court)) throw new Error("Court double-booked");
      playing.add(m.teamA);playing.add(m.teamB);courts.add(m.court);
      const allowed = new Set(teamsByCategory[m.category]);
      if (!allowed.has(m.teamA) || !allowed.has(m.teamB)) throw new Error("Cross-category match");
      for (const [team, opponent] of [[m.teamA,m.teamB],[m.teamB,m.teamA]]) {
        counts.set(team,(counts.get(team)||0)+1);
        const seen = opponents.get(team)||new Set();
        if (seen.has(opponent)) throw new Error("Repeat opponent");
        seen.add(opponent);opponents.set(team,seen);
      }
    }
  }
  for (const category of CATEGORIES) for (const team of teamsByCategory[category]) {
    if (counts.get(team)!==ROUNDS) throw new Error("Wrong match count");
  }
  return true;
}
