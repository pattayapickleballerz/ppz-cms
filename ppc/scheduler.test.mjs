import { SKILLS,CATEGORIES,roundRobin,scheduleSkillBlock,validateSchedule } from './scheduler.js';
import assert from 'node:assert/strict';
for(const skill of SKILLS){
 const teams=Object.fromEntries(CATEGORIES.map((c,ci)=>[c,Array.from({length:8},(_,i)=>skill+'-'+ci+'-'+i)]));
 const waves=scheduleSkillBlock(teams);
 assert.equal(waves.flat().length,72);
 assert.ok(waves.every(w=>w.length<=11));
 assert.equal(validateSchedule(waves,teams),true);
 for(const c of CATEGORIES)assert.equal(roundRobin(teams[c]).length,24);
 console.log(skill+': '+waves.length+' waves; 72 matches; unique opponents and courts OK');
}
console.log('PPC total: 216 matches.');
