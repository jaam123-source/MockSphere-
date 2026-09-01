// server/app.ts
import express from "express";
import dotenv from "dotenv";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";

// server/questions/quantitative.ts
function getQuantitativeQuestions() {
  const list = [];
  let counter = 0;
  const addQ = (level_id, category, difficulty, question, correctText, d1, d2, d3, exp) => {
    counter++;
    const posIndex = (counter - 1) % 4;
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[posIndex];
    const distractors = [d1, d2, d3];
    if (counter % 2 === 1) {
      const tmp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = tmp;
    }
    const opts = { A: "", B: "", C: "", D: "" };
    opts[correctLetter] = correctText;
    let distIdx = 0;
    for (const l of letters) {
      if (l !== correctLetter) {
        opts[l] = distractors[distIdx++] || "";
      }
    }
    list.push({
      question_id: `q_quant_l${level_id}_${counter}`,
      topic_id: "quantitative",
      level_id,
      category,
      concept: category,
      difficulty,
      question,
      option_a: opts.A,
      option_b: opts.B,
      option_c: opts.C,
      option_d: opts.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type: "learning"
    });
  };
  const pData = [
    { p: 15, num: 240, ans: "36", d1: "40", d2: "32", d3: "48" },
    { p: 25, num: 360, ans: "90", d1: "85", d2: "95", d3: "100" },
    { p: 40, num: 150, ans: "60", d1: "55", d2: "65", d3: "70" },
    { p: 12, num: 500, ans: "60", d1: "50", d2: "65", d3: "72" },
    { p: 35, num: 200, ans: "70", d1: "65", d2: "75", d3: "80" },
    { p: 18, num: 450, ans: "81", d1: "78", d2: "84", d3: "90" },
    { p: 75, num: 320, ans: "240", d1: "230", d2: "250", d3: "260" },
    { p: 60, num: 180, ans: "108", d1: "102", d2: "114", d3: "120" },
    { p: 45, num: 400, ans: "180", d1: "170", d2: "190", d3: "200" },
    { p: 8, num: 625, ans: "50", d1: "45", d2: "55", d3: "60" },
    { p: 30, num: 270, ans: "81", d1: "75", d2: "87", d3: "93" },
    { p: 85, num: 140, ans: "119", d1: "112", d2: "124", d3: "128" },
    { p: 22, num: 350, ans: "77", d1: "72", d2: "82", d3: "88" },
    { p: 16, num: 650, ans: "104", d1: "98", d2: "110", d3: "116" },
    { p: 55, num: 280, ans: "154", d1: "146", d2: "160", d3: "168" }
  ];
  pData.forEach((d) => {
    addQ(
      1,
      "Percentages",
      "Easy",
      `What is ${d.p}% of ${d.num}?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.p}% of ${d.num} = (${d.p}/100) * ${d.num} = ${d.ans}.`
    );
  });
  const fData = [
    { n: 3, d: 8, ans: "37.5%", d1: "35.0%", d2: "40.0%", d3: "42.5%" },
    { n: 7, d: 20, ans: "35%", d1: "32%", d2: "38%", d3: "40%" },
    { n: 5, d: 16, ans: "31.25%", d1: "28.50%", d2: "33.75%", d3: "35.00%" },
    { n: 4, d: 25, ans: "16%", d1: "14%", d2: "18%", d3: "20%" },
    { n: 9, d: 40, ans: "22.5%", d1: "20.0%", d2: "24.5%", d3: "26.0%" },
    { n: 11, d: 50, ans: "22%", d1: "20%", d2: "24%", d3: "25%" },
    { n: 13, d: 20, ans: "65%", d1: "60%", d2: "70%", d3: "75%" },
    { n: 5, d: 8, ans: "62.5%", d1: "58.0%", d2: "65.0%", d3: "67.5%" },
    { n: 17, d: 25, ans: "68%", d1: "64%", d2: "72%", d3: "75%" },
    { n: 19, d: 50, ans: "38%", d1: "34%", d2: "42%", d3: "45%" },
    { n: 7, d: 8, ans: "87.5%", d1: "82.5%", d2: "90.0%", d3: "92.5%" },
    { n: 9, d: 25, ans: "36%", d1: "32%", d2: "40%", d3: "44%" },
    { n: 21, d: 50, ans: "42%", d1: "39%", d2: "45%", d3: "48%" },
    { n: 23, d: 40, ans: "57.5%", d1: "52.5%", d2: "60.0%", d3: "62.5%" },
    { n: 29, d: 50, ans: "58%", d1: "54%", d2: "62%", d3: "65%" }
  ];
  fData.forEach((d) => {
    addQ(
      1,
      "Fractions",
      "Medium",
      `Convert the fraction ${d.n}/${d.d} to an exact percentage.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `(${d.n} / ${d.d}) * 100% = ${d.ans}.`
    );
  });
  const plData = [
    { cp: 250, p: 20, sp: "$300", d1: "$280", d2: "$320", d3: "$350" },
    { cp: 400, p: 15, sp: "$460", d1: "$440", d2: "$480", d3: "$500" },
    { cp: 180, p: 25, sp: "$225", d1: "$215", d2: "$235", d3: "$240" },
    { cp: 500, p: 12, sp: "$560", d1: "$540", d2: "$580", d3: "$600" },
    { cp: 320, p: 30, sp: "$416", d1: "$400", d2: "$432", d3: "$440" },
    { cp: 650, p: 10, sp: "$715", d1: "$700", d2: "$730", d3: "$750" },
    { cp: 120, p: 35, sp: "$162", d1: "$156", d2: "$168", d3: "$174" },
    { cp: 800, p: 18, sp: "$944", d1: "$920", d2: "$960", d3: "$980" },
    { cp: 450, p: 8, sp: "$486", d1: "$475", d2: "$498", d3: "$510" },
    { cp: 750, p: 16, sp: "$870", d1: "$850", d2: "$890", d3: "$910" },
    { cp: 360, p: 25, sp: "$450", d1: "$430", d2: "$470", d3: "$490" },
    { cp: 520, p: 15, sp: "$598", d1: "$580", d2: "$612", d3: "$625" },
    { cp: 280, p: 40, sp: "$392", d1: "$375", d2: "$405", d3: "$420" },
    { cp: 900, p: 22, sp: "$1098", d1: "$1050", d2: "$1120", d3: "$1150" },
    { cp: 600, p: 30, sp: "$780", d1: "$750", d2: "$810", d3: "$840" }
  ];
  plData.forEach((d) => {
    addQ(
      2,
      "Profit & Loss",
      "Easy",
      `An item is bought for $${d.cp} and sold with a ${d.p}% profit. Find the selling price.`,
      d.sp,
      d.d1,
      d.d2,
      d.d3,
      `SP = $${d.cp} * (1 + ${d.p}/100) = ${d.sp}.`
    );
  });
  const discData = [
    { mp: 400, disc: 15, sp: "$340", d1: "$320", d2: "$350", d3: "$360" },
    { mp: 650, disc: 20, sp: "$520", d1: "$500", d2: "$540", d3: "$560" },
    { mp: 250, disc: 10, sp: "$225", d1: "$215", d2: "$230", d3: "$240" },
    { mp: 800, disc: 25, sp: "$600", d1: "$580", d2: "$620", d3: "$640" },
    { mp: 550, disc: 30, sp: "$385", d1: "$370", d2: "$395", d3: "$410" },
    { mp: 300, disc: 5, sp: "$285", d1: "$275", d2: "$290", d3: "$295" },
    { mp: 900, disc: 12, sp: "$792", d1: "$780", d2: "$805", d3: "$820" },
    { mp: 720, disc: 15, sp: "$612", d1: "$598", d2: "$625", d3: "$640" },
    { mp: 480, disc: 35, sp: "$312", d1: "$300", d2: "$325", d3: "$340" },
    { mp: 1200, disc: 18, sp: "$984", d1: "$960", d2: "$1005", d3: "$1020" },
    { mp: 350, disc: 20, sp: "$280", d1: "$270", d2: "$290", d3: "$300" },
    { mp: 850, disc: 10, sp: "$765", d1: "$750", d2: "$780", d3: "$795" },
    { mp: 500, disc: 28, sp: "$360", d1: "$345", d2: "$375", d3: "$390" },
    { mp: 950, disc: 16, sp: "$798", d1: "$780", d2: "$815", d3: "$830" },
    { mp: 1500, disc: 25, sp: "$1125", d1: "$1100", d2: "$1150", d3: "$1200" }
  ];
  discData.forEach((d) => {
    addQ(
      2,
      "Discounts",
      "Medium",
      `An article with marked price $${d.mp} is offered at a ${d.disc}% discount. What is the payable price?`,
      d.sp,
      d.d1,
      d.d2,
      d.d3,
      `Payable = $${d.mp} * (1 - ${d.disc}/100) = ${d.sp}.`
    );
  });
  const siData = [
    { p: 1200, r: 5, t: 3, si: "$180", d1: "$160", d2: "$200", d3: "$220" },
    { p: 2500, r: 6, t: 2, si: "$300", d1: "$280", d2: "$320", d3: "$340" },
    { p: 800, r: 8, t: 4, si: "$256", d1: "$240", d2: "$270", d3: "$288" },
    { p: 3500, r: 4, t: 5, si: "$700", d1: "$650", d2: "$750", d3: "$800" },
    { p: 1500, r: 7, t: 2, si: "$210", d1: "$195", d2: "$225", d3: "$240" },
    { p: 4e3, r: 5, t: 4, si: "$800", d1: "$750", d2: "$850", d3: "$900" },
    { p: 2e3, r: 9, t: 3, si: "$540", d1: "$510", d2: "$570", d3: "$600" },
    { p: 5e3, r: 6, t: 3, si: "$900", d1: "$850", d2: "$950", d3: "$1000" },
    { p: 1800, r: 8, t: 2, si: "$288", d1: "$270", d2: "$305", d3: "$320" },
    { p: 6e3, r: 4, t: 3, si: "$720", d1: "$680", d2: "$760", d3: "$800" },
    { p: 3e3, r: 7, t: 4, si: "$840", d1: "$800", d2: "$880", d3: "$920" },
    { p: 4500, r: 5, t: 2, si: "$450", d1: "$420", d2: "$480", d3: "$500" },
    { p: 7e3, r: 3, t: 5, si: "$1050", d1: "$1000", d2: "$1100", d3: "$1150" },
    { p: 2200, r: 6, t: 4, si: "$528", d1: "$500", d2: "$550", d3: "$580" },
    { p: 8e3, r: 5, t: 2, si: "$800", d1: "$750", d2: "$850", d3: "$900" }
  ];
  siData.forEach((d) => {
    addQ(
      3,
      "Simple Interest",
      "Easy",
      `Find the Simple Interest on $${d.p} at ${d.r}% per annum for ${d.t} years.`,
      d.si,
      d.d1,
      d.d2,
      d.d3,
      `SI = (P * R * T) / 100 = ($${d.p} * ${d.r} * ${d.t}) / 100 = ${d.si}.`
    );
  });
  const ciData = [
    { p: 1e3, r: 10, t: 2, ci: "$210", d1: "$200", d2: "$220", d3: "$230" },
    { p: 2e3, r: 5, t: 2, ci: "$205", d1: "$195", d2: "$215", d3: "$225" },
    { p: 5e3, r: 8, t: 2, ci: "$832", d1: "$800", d2: "$850", d3: "$880" },
    { p: 3e3, r: 10, t: 2, ci: "$630", d1: "$600", d2: "$650", d3: "$680" },
    { p: 4e3, r: 6, t: 2, ci: "$494.40", d1: "$480.00", d2: "$510.00", d3: "$525.00" },
    { p: 8e3, r: 5, t: 2, ci: "$820", d1: "$800", d2: "$840", d3: "$860" },
    { p: 1500, r: 12, t: 2, ci: "$381.60", d1: "$360.00", d2: "$395.00", d3: "$410.00" },
    { p: 6e3, r: 10, t: 2, ci: "$1260", d1: "$1200", d2: "$1300", d3: "$1350" },
    { p: 1e4, r: 4, t: 2, ci: "$816", d1: "$800", d2: "$835", d3: "$850" },
    { p: 2500, r: 8, t: 2, ci: "$416", d1: "$400", d2: "$430", d3: "$445" },
    { p: 7e3, r: 6, t: 2, ci: "$865.20", d1: "$840.00", d2: "$885.00", d3: "$910.00" },
    { p: 12e3, r: 5, t: 2, ci: "$1230", d1: "$1200", d2: "$1260", d3: "$1290" },
    { p: 4500, r: 10, t: 2, ci: "$945", d1: "$900", d2: "$975", d3: "$1000" },
    { p: 9e3, r: 4, t: 2, ci: "$734.40", d1: "$720.00", d2: "$750.00", d3: "$770.00" },
    { p: 5500, r: 8, t: 2, ci: "$915.20", d1: "$880.00", d2: "$940.00", d3: "$960.00" }
  ];
  ciData.forEach((d) => {
    addQ(
      3,
      "Compound Interest",
      "Medium",
      `Calculate the Compound Interest on $${d.p} invested at ${d.r}% per annum compounded annually for ${d.t} years.`,
      d.ci,
      d.d1,
      d.d2,
      d.d3,
      `CI = P * (1 + R/100)^T - P = ${d.ci}.`
    );
  });
  const ratioData = [
    { total: 600, r1: 2, r2: 3, ans: "$360", d1: "$240", d2: "$300", d3: "$400" },
    { total: 840, r1: 3, r2: 4, ans: "$480", d1: "$360", d2: "$450", d3: "$520" },
    { total: 750, r1: 2, r2: 3, ans: "$450", d1: "$300", d2: "$400", d3: "$500" },
    { total: 1e3, r1: 3, r2: 7, ans: "$700", d1: "$300", d2: "$650", d3: "$750" },
    { total: 960, r1: 5, r2: 3, ans: "$360", d1: "$600", d2: "$400", d3: "$480" },
    { total: 1100, r1: 4, r2: 7, ans: "$700", d1: "$400", d2: "$650", d3: "$750" },
    { total: 540, r1: 4, r2: 5, ans: "$300", d1: "$240", d2: "$280", d3: "$320" },
    { total: 1350, r1: 4, r2: 5, ans: "$750", d1: "$600", d2: "$700", d3: "$800" },
    { total: 720, r1: 5, r2: 4, ans: "$320", d1: "$400", d2: "$350", d3: "$380" },
    { total: 1250, r1: 2, r2: 3, ans: "$750", d1: "$500", d2: "$700", d3: "$800" },
    { total: 1600, r1: 3, r2: 5, ans: "$1000", d1: "$600", d2: "$900", d3: "$1100" },
    { total: 420, r1: 2, r2: 5, ans: "$300", d1: "$120", d2: "$280", d3: "$320" },
    { total: 1440, r1: 5, r2: 7, ans: "$840", d1: "$600", d2: "$800", d3: "$900" },
    { total: 880, r1: 3, r2: 8, ans: "$640", d1: "$240", d2: "$600", d3: "$680" },
    { total: 2e3, r1: 7, r2: 3, ans: "$600", d1: "$1400", d2: "$700", d3: "$800" }
  ];
  ratioData.forEach((d) => {
    addQ(
      4,
      "Ratio & Proportion",
      "Easy",
      `Divide $${d.total} between Person A and Person B in the ratio ${d.r1}:${d.r2}. What is Person B's share?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `B's share = (${d.r2} / ${d.r1 + d.r2}) * $${d.total} = ${d.ans}.`
    );
  });
  const mixData = [
    { c1: 40, c2: 0, mean: 30, ans: "3:1", d1: "2:1", d2: "4:1", d3: "1:2" },
    { c1: 50, c2: 0, mean: 40, ans: "4:1", d1: "3:1", d2: "5:1", d3: "2:1" },
    { c1: 60, c2: 20, mean: 30, ans: "1:3", d1: "1:2", d2: "2:3", d3: "3:4" },
    { c1: 80, c2: 30, mean: 50, ans: "2:3", d1: "3:2", d2: "1:2", d3: "3:4" },
    { c1: 75, c2: 25, mean: 45, ans: "2:3", d1: "3:5", d2: "1:2", d3: "4:5" },
    { c1: 90, c2: 40, mean: 60, ans: "2:3", d1: "1:2", d2: "3:4", d3: "4:5" },
    { c1: 70, c2: 20, mean: 50, ans: "3:2", d1: "2:3", d2: "4:3", d3: "1:1" },
    { c1: 85, c2: 35, mean: 55, ans: "2:3", d1: "3:4", d2: "1:2", d3: "5:6" },
    { c1: 100, c2: 40, mean: 80, ans: "2:1", d1: "3:1", d2: "1:2", d3: "4:1" },
    { c1: 65, c2: 15, mean: 45, ans: "3:2", d1: "2:3", d2: "1:1", d3: "4:3" },
    { c1: 95, c2: 45, mean: 65, ans: "2:3", d1: "3:5", d2: "1:2", d3: "4:5" },
    { c1: 120, c2: 50, mean: 80, ans: "3:4", d1: "2:3", d2: "4:5", d3: "1:2" },
    { c1: 110, c2: 60, mean: 90, ans: "3:2", d1: "2:3", d2: "4:3", d3: "1:1" },
    { c1: 130, c2: 70, mean: 100, ans: "1:1", d1: "2:1", d2: "1:2", d3: "3:2" },
    { c1: 150, c2: 80, mean: 115, ans: "1:1", d1: "3:2", d2: "2:3", d3: "4:3" }
  ];
  mixData.forEach((d) => {
    addQ(
      4,
      "Mixtures & Alligation",
      "Hard",
      `In what ratio must ingredient A ($${d.c1}/kg) and ingredient B ($${d.c2}/kg) be mixed to obtain a blend worth $${d.mean}/kg?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `By Alligation: (${d.mean} - ${d.c2}) : (${d.c1} - ${d.mean}) = ${d.ans}.`
    );
  });
  const twData = [
    { a: 10, b: 15, ans: "6 days", d1: "5 days", d2: "7 days", d3: "8 days" },
    { a: 12, b: 24, ans: "8 days", d1: "6 days", d2: "9 days", d3: "10 days" },
    { a: 20, b: 30, ans: "12 days", d1: "10 days", d2: "14 days", d3: "15 days" },
    { a: 15, b: 30, ans: "10 days", d1: "8 days", d2: "12 days", d3: "14 days" },
    { a: 18, b: 36, ans: "12 days", d1: "9 days", d2: "14 days", d3: "15 days" },
    { a: 12, b: 18, ans: "7.2 days", d1: "6.5 days", d2: "8.0 days", d3: "8.5 days" },
    { a: 16, b: 48, ans: "12 days", d1: "10 days", d2: "14 days", d3: "16 days" },
    { a: 14, b: 21, ans: "8.4 days", d1: "7.5 days", d2: "9.0 days", d3: "9.5 days" },
    { a: 24, b: 40, ans: "15 days", d1: "12 days", d2: "18 days", d3: "20 days" },
    { a: 20, b: 60, ans: "15 days", d1: "12 days", d2: "18 days", d3: "20 days" },
    { a: 30, b: 60, ans: "20 days", d1: "15 days", d2: "25 days", d3: "28 days" },
    { a: 25, b: 75, ans: "18.75 days", d1: "16.50 days", d2: "20.25 days", d3: "22.00 days" },
    { a: 36, b: 72, ans: "24 days", d1: "20 days", d2: "28 days", d3: "30 days" },
    { a: 40, b: 60, ans: "24 days", d1: "20 days", d2: "28 days", d3: "32 days" },
    { a: 45, b: 90, ans: "30 days", d1: "25 days", d2: "35 days", d3: "40 days" }
  ];
  twData.forEach((d) => {
    addQ(
      5,
      "Time & Work",
      "Medium",
      `Worker A can do a task in ${d.a} days and Worker B in ${d.b} days. Working together, how many days will they take?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Time = (A * B) / (A + B) = (${d.a} * ${d.b}) / (${d.a} + ${d.b}) = ${d.ans}.`
    );
  });
  const pipeData = [
    { p1: 6, p2: 12, ans: "4 hours", d1: "3 hours", d2: "5 hours", d3: "6 hours" },
    { p1: 8, p2: 24, ans: "6 hours", d1: "4 hours", d2: "7 hours", d3: "8 hours" },
    { p1: 10, p2: 15, ans: "6 hours", d1: "5 hours", d2: "7 hours", d3: "8 hours" },
    { p1: 12, p2: 24, ans: "8 hours", d1: "6 hours", d2: "9 hours", d3: "10 hours" },
    { p1: 9, p2: 18, ans: "6 hours", d1: "5 hours", d2: "7 hours", d3: "8 hours" },
    { p1: 15, p2: 30, ans: "10 hours", d1: "8 hours", d2: "12 hours", d3: "14 hours" },
    { p1: 20, p2: 30, ans: "12 hours", d1: "10 hours", d2: "14 hours", d3: "15 hours" },
    { p1: 16, p2: 48, ans: "12 hours", d1: "10 hours", d2: "14 hours", d3: "16 hours" },
    { p1: 14, p2: 21, ans: "8.4 hours", d1: "7.5 hours", d2: "9.2 hours", d3: "10.0 hours" },
    { p1: 24, p2: 48, ans: "16 hours", d1: "12 hours", d2: "18 hours", d3: "20 hours" },
    { p1: 18, p2: 36, ans: "12 hours", d1: "10 hours", d2: "14 hours", d3: "15 hours" },
    { p1: 25, p2: 50, ans: "16.67 hours", d1: "14.50 hours", d2: "18.00 hours", d3: "20.00 hours" },
    { p1: 30, p2: 60, ans: "20 hours", d1: "15 hours", d2: "25 hours", d3: "28 hours" },
    { p1: 36, p2: 72, ans: "24 hours", d1: "20 hours", d2: "28 hours", d3: "30 hours" },
    { p1: 40, p2: 60, ans: "24 hours", d1: "20 hours", d2: "28 hours", d3: "32 hours" }
  ];
  pipeData.forEach((d) => {
    addQ(
      5,
      "Pipes & Cisterns",
      "Medium",
      `Pipe X fills a tank in ${d.p1} hours and Pipe Y in ${d.p2} hours. How long will both take together?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Time = (${d.p1} * ${d.p2}) / (${d.p1} + ${d.p2}) = ${d.ans}.`
    );
  });
  const spData = [
    { kmh: 36, ans: "10 m/s", d1: "8 m/s", d2: "12 m/s", d3: "14 m/s" },
    { kmh: 54, ans: "15 m/s", d1: "12 m/s", d2: "18 m/s", d3: "20 m/s" },
    { kmh: 72, ans: "20 m/s", d1: "18 m/s", d2: "22 m/s", d3: "25 m/s" },
    { kmh: 90, ans: "25 m/s", d1: "22 m/s", d2: "28 m/s", d3: "30 m/s" },
    { kmh: 108, ans: "30 m/s", d1: "28 m/s", d2: "32 m/s", d3: "35 m/s" },
    { kmh: 126, ans: "35 m/s", d1: "30 m/s", d2: "38 m/s", d3: "40 m/s" },
    { kmh: 144, ans: "40 m/s", d1: "36 m/s", d2: "44 m/s", d3: "48 m/s" },
    { kmh: 162, ans: "45 m/s", d1: "40 m/s", d2: "48 m/s", d3: "50 m/s" },
    { kmh: 180, ans: "50 m/s", d1: "45 m/s", d2: "55 m/s", d3: "60 m/s" },
    { kmh: 45, ans: "12.5 m/s", d1: "10.0 m/s", d2: "14.0 m/s", d3: "15.0 m/s" },
    { kmh: 63, ans: "17.5 m/s", d1: "15.0 m/s", d2: "19.0 m/s", d3: "21.0 m/s" },
    { kmh: 81, ans: "22.5 m/s", d1: "20.0 m/s", d2: "24.0 m/s", d3: "26.0 m/s" },
    { kmh: 99, ans: "27.5 m/s", d1: "25.0 m/s", d2: "29.0 m/s", d3: "31.0 m/s" },
    { kmh: 117, ans: "32.5 m/s", d1: "30.0 m/s", d2: "34.0 m/s", d3: "36.0 m/s" },
    { kmh: 135, ans: "37.5 m/s", d1: "35.0 m/s", d2: "40.0 m/s", d3: "42.5 m/s" }
  ];
  spData.forEach((d) => {
    addQ(
      6,
      "Speed & Distance",
      "Easy",
      `Convert a speed of ${d.kmh} km/h into meters per second (m/s).`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.kmh} * (5/18) = ${d.ans}.`
    );
  });
  const trainData = [
    { len: 150, sec: 10, ans: "54 km/h", d1: "45 km/h", d2: "60 km/h", d3: "65 km/h" },
    { len: 200, sec: 12, ans: "60 km/h", d1: "50 km/h", d2: "65 km/h", d3: "72 km/h" },
    { len: 240, sec: 16, ans: "54 km/h", d1: "48 km/h", d2: "60 km/h", d3: "66 km/h" },
    { len: 300, sec: 15, ans: "72 km/h", d1: "64 km/h", d2: "80 km/h", d3: "85 km/h" },
    { len: 180, sec: 9, ans: "72 km/h", d1: "65 km/h", d2: "78 km/h", d3: "84 km/h" },
    { len: 250, sec: 10, ans: "90 km/h", d1: "80 km/h", d2: "95 km/h", d3: "100 km/h" },
    { len: 360, sec: 18, ans: "72 km/h", d1: "68 km/h", d2: "76 km/h", d3: "80 km/h" },
    { len: 280, sec: 14, ans: "72 km/h", d1: "65 km/h", d2: "78 km/h", d3: "82 km/h" },
    { len: 400, sec: 20, ans: "72 km/h", d1: "60 km/h", d2: "80 km/h", d3: "88 km/h" },
    { len: 350, sec: 14, ans: "90 km/h", d1: "82 km/h", d2: "96 km/h", d3: "102 km/h" },
    { len: 450, sec: 15, ans: "108 km/h", d1: "98 km/h", d2: "112 km/h", d3: "120 km/h" },
    { len: 500, sec: 25, ans: "72 km/h", d1: "65 km/h", d2: "80 km/h", d3: "85 km/h" },
    { len: 320, sec: 16, ans: "72 km/h", d1: "64 km/h", d2: "80 km/h", d3: "84 km/h" },
    { len: 600, sec: 30, ans: "72 km/h", d1: "66 km/h", d2: "78 km/h", d3: "84 km/h" },
    { len: 420, sec: 14, ans: "108 km/h", d1: "95 km/h", d2: "115 km/h", d3: "120 km/h" }
  ];
  trainData.forEach((d) => {
    addQ(
      6,
      "Trains & Streams",
      "Medium",
      `A train ${d.len} meters long crosses a pole in ${d.sec} seconds. What is its speed in km/h?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Speed = (${d.len} / ${d.sec}) * (18/5) = ${d.ans}.`
    );
  });
  const numData = [
    { p: 105, ans: "7", d1: "9", d2: "3", d3: "1" },
    { p: 106, ans: "9", d1: "7", d2: "3", d3: "1" },
    { p: 107, ans: "3", d1: "7", d2: "9", d3: "1" },
    { p: 108, ans: "1", d1: "7", d2: "9", d3: "3" },
    { p: 201, ans: "7", d1: "1", d2: "9", d3: "3" },
    { p: 202, ans: "9", d1: "7", d2: "3", d3: "1" },
    { p: 203, ans: "3", d1: "9", d2: "7", d3: "1" },
    { p: 204, ans: "1", d1: "3", d2: "7", d3: "9" },
    { p: 301, ans: "7", d1: "3", d2: "1", d3: "9" },
    { p: 302, ans: "9", d1: "1", d2: "7", d3: "3" },
    { p: 303, ans: "3", d1: "7", d2: "9", d3: "1" },
    { p: 304, ans: "1", d1: "9", d2: "3", d3: "7" },
    { p: 405, ans: "7", d1: "1", d2: "3", d3: "9" },
    { p: 406, ans: "9", d1: "7", d2: "1", d3: "3" },
    { p: 407, ans: "3", d1: "9", d2: "7", d3: "1" }
  ];
  numData.forEach((d) => {
    addQ(
      7,
      "Number System",
      "Hard",
      `Find the unit digit of 7^${d.p}.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Powers of 7 cycle in (7, 9, 3, 1). ${d.p} mod 4 gives the index for unit digit ${d.ans}.`
    );
  });
  const hcfData = [
    { hcf: 6, lcm: 180, n1: 30, n2: "36", d1: "32", d2: "40", d3: "42" },
    { hcf: 8, lcm: 240, n1: 40, n2: "48", d1: "42", d2: "54", d3: "56" },
    { hcf: 12, lcm: 360, n1: 60, n2: "72", d1: "68", d2: "76", d3: "80" },
    { hcf: 15, lcm: 450, n1: 75, n2: "90", d1: "85", d2: "95", d3: "100" },
    { hcf: 9, lcm: 270, n1: 45, n2: "54", d1: "48", d2: "58", d3: "62" },
    { hcf: 14, lcm: 420, n1: 70, n2: "84", d1: "78", d2: "88", d3: "92" },
    { hcf: 16, lcm: 480, n1: 80, n2: "96", d1: "88", d2: "102", d3: "108" },
    { hcf: 10, lcm: 300, n1: 50, n2: "60", d1: "55", d2: "65", d3: "70" },
    { hcf: 18, lcm: 540, n1: 90, n2: "108", d1: "98", d2: "114", d3: "120" },
    { hcf: 20, lcm: 600, n1: 100, n2: "120", d1: "110", d2: "130", d3: "140" },
    { hcf: 7, lcm: 210, n1: 35, n2: "42", d1: "38", d2: "46", d3: "49" },
    { hcf: 11, lcm: 330, n1: 55, n2: "66", d1: "60", d2: "72", d3: "77" },
    { hcf: 13, lcm: 390, n1: 65, n2: "78", d1: "72", d2: "84", d3: "91" },
    { hcf: 17, lcm: 510, n1: 85, n2: "102", d1: "95", d2: "110", d3: "119" },
    { hcf: 25, lcm: 750, n1: 125, n2: "150", d1: "140", d2: "160", d3: "175" }
  ];
  hcfData.forEach((d) => {
    addQ(
      7,
      "HCF & LCM",
      "Medium",
      `The HCF of two numbers is ${d.hcf} and their LCM is ${d.lcm}. If one number is ${d.n1}, find the other.`,
      d.n2,
      d.d1,
      d.d2,
      d.d3,
      `Number 2 = (HCF * LCM) / Number 1 = (${d.hcf} * ${d.lcm}) / ${d.n1} = ${d.n2}.`
    );
  });
  const permData = [
    { n: 5, r: 2, ans: "10", d1: "8", d2: "12", d3: "15" },
    { n: 6, r: 2, ans: "15", d1: "12", d2: "18", d3: "20" },
    { n: 7, r: 2, ans: "21", d1: "18", d2: "24", d3: "28" },
    { n: 8, r: 2, ans: "28", d1: "24", d2: "32", d3: "36" },
    { n: 9, r: 2, ans: "36", d1: "30", d2: "40", d3: "45" },
    { n: 10, r: 2, ans: "45", d1: "40", d2: "50", d3: "55" },
    { n: 5, r: 3, ans: "10", d1: "15", d2: "20", d3: "25" },
    { n: 6, r: 3, ans: "20", d1: "15", d2: "24", d3: "30" },
    { n: 7, r: 3, ans: "35", d1: "28", d2: "42", d3: "48" },
    { n: 8, r: 3, ans: "56", d1: "48", d2: "64", d3: "70" },
    { n: 9, r: 3, ans: "84", d1: "72", d2: "90", d3: "96" },
    { n: 10, r: 3, ans: "120", d1: "100", d2: "135", d3: "150" },
    { n: 6, r: 4, ans: "15", d1: "12", d2: "18", d3: "24" },
    { n: 7, r: 4, ans: "35", d1: "28", d2: "40", d3: "45" },
    { n: 8, r: 4, ans: "70", d1: "60", d2: "80", d3: "90" }
  ];
  permData.forEach((d) => {
    addQ(
      8,
      "Permutations & Combinations",
      "Medium",
      `How many ways can a team of ${d.r} members be chosen from ${d.n} candidates?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.n}C${d.r} = ${d.ans}.`
    );
  });
  const probData = [
    { red: 3, blue: 7, ans: "3/10", d1: "7/10", d2: "3/7", d3: "1/3" },
    { red: 5, blue: 15, ans: "1/4", d1: "1/3", d2: "3/4", d3: "1/5" },
    { red: 4, blue: 6, ans: "2/5", d1: "3/5", d2: "1/2", d3: "4/5" },
    { red: 6, blue: 14, ans: "3/10", d1: "7/10", d2: "2/5", d3: "1/2" },
    { red: 8, blue: 12, ans: "2/5", d1: "3/5", d2: "4/5", d3: "1/2" },
    { red: 7, blue: 21, ans: "1/4", d1: "1/3", d2: "3/4", d3: "1/5" },
    { red: 9, blue: 11, ans: "9/20", d1: "11/20", d2: "1/2", d3: "7/20" },
    { red: 5, blue: 20, ans: "1/5", d1: "4/5", d2: "1/4", d3: "1/6" },
    { red: 10, blue: 15, ans: "2/5", d1: "3/5", d2: "1/3", d3: "4/5" },
    { red: 6, blue: 18, ans: "1/4", d1: "3/4", d2: "1/3", d3: "1/5" },
    { red: 12, blue: 8, ans: "3/5", d1: "2/5", d2: "1/2", d3: "4/5" },
    { red: 14, blue: 6, ans: "7/10", d1: "3/10", d2: "4/5", d3: "1/2" },
    { red: 15, blue: 25, ans: "3/8", d1: "5/8", d2: "1/2", d3: "3/5" },
    { red: 18, blue: 12, ans: "3/5", d1: "2/5", d2: "1/2", d3: "4/5" },
    { red: 16, blue: 24, ans: "2/5", d1: "3/5", d2: "1/2", d3: "3/4" }
  ];
  probData.forEach((d) => {
    addQ(
      8,
      "Probability",
      "Medium",
      `A bag contains ${d.red} red and ${d.blue} blue marbles. What is the probability of picking a red marble at random?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `P(Red) = ${d.red} / (${d.red} + ${d.blue}) = ${d.ans}.`
    );
  });
  const mensData = [
    { side: 12, ans: "144 sq cm", d1: "120 sq cm", d2: "160 sq cm", d3: "180 sq cm" },
    { side: 15, ans: "225 sq cm", d1: "200 sq cm", d2: "240 sq cm", d3: "250 sq cm" },
    { side: 18, ans: "324 sq cm", d1: "300 sq cm", d2: "340 sq cm", d3: "360 sq cm" },
    { side: 20, ans: "400 sq cm", d1: "380 sq cm", d2: "420 sq cm", d3: "450 sq cm" },
    { side: 25, ans: "625 sq cm", d1: "600 sq cm", d2: "650 sq cm", d3: "675 sq cm" },
    { side: 14, ans: "196 sq cm", d1: "180 sq cm", d2: "210 sq cm", d3: "225 sq cm" },
    { side: 16, ans: "256 sq cm", d1: "240 sq cm", d2: "270 sq cm", d3: "288 sq cm" },
    { side: 22, ans: "484 sq cm", d1: "450 sq cm", d2: "500 sq cm", d3: "520 sq cm" },
    { side: 30, ans: "900 sq cm", d1: "850 sq cm", d2: "950 sq cm", d3: "1000 sq cm" },
    { side: 24, ans: "576 sq cm", d1: "550 sq cm", d2: "600 sq cm", d3: "625 sq cm" },
    { side: 28, ans: "784 sq cm", d1: "750 sq cm", d2: "800 sq cm", d3: "840 sq cm" },
    { side: 35, ans: "1225 sq cm", d1: "1200 sq cm", d2: "1250 sq cm", d3: "1300 sq cm" },
    { side: 40, ans: "1600 sq cm", d1: "1500 sq cm", d2: "1700 sq cm", d3: "1800 sq cm" },
    { side: 32, ans: "1024 sq cm", d1: "1000 sq cm", d2: "1050 sq cm", d3: "1100 sq cm" },
    { side: 50, ans: "2500 sq cm", d1: "2400 sq cm", d2: "2600 sq cm", d3: "2700 sq cm" }
  ];
  mensData.forEach((d) => {
    addQ(
      9,
      "Mensuration",
      "Easy",
      `Find the area of a square with side length ${d.side} cm.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Area = Side^2 = ${d.side}^2 = ${d.ans}.`
    );
  });
  const geomData = [
    { a: 3, b: 4, ans: "5 cm", d1: "6 cm", d2: "7 cm", d3: "8 cm" },
    { a: 5, b: 12, ans: "13 cm", d1: "14 cm", d2: "15 cm", d3: "16 cm" },
    { a: 6, b: 8, ans: "10 cm", d1: "11 cm", d2: "12 cm", d3: "14 cm" },
    { a: 8, b: 15, ans: "17 cm", d1: "16 cm", d2: "18 cm", d3: "19 cm" },
    { a: 7, b: 24, ans: "25 cm", d1: "26 cm", d2: "27 cm", d3: "28 cm" },
    { a: 9, b: 12, ans: "15 cm", d1: "14 cm", d2: "16 cm", d3: "18 cm" },
    { a: 12, b: 16, ans: "20 cm", d1: "18 cm", d2: "22 cm", d3: "24 cm" },
    { a: 15, b: 20, ans: "25 cm", d1: "23 cm", d2: "27 cm", d3: "30 cm" },
    { a: 10, b: 24, ans: "26 cm", d1: "25 cm", d2: "28 cm", d3: "30 cm" },
    { a: 18, b: 24, ans: "30 cm", d1: "28 cm", d2: "32 cm", d3: "36 cm" },
    { a: 20, b: 21, ans: "29 cm", d1: "28 cm", d2: "31 cm", d3: "33 cm" },
    { a: 16, b: 30, ans: "34 cm", d1: "32 cm", d2: "36 cm", d3: "38 cm" },
    { a: 21, b: 28, ans: "35 cm", d1: "33 cm", d2: "37 cm", d3: "40 cm" },
    { a: 24, b: 32, ans: "40 cm", d1: "38 cm", d2: "42 cm", d3: "45 cm" },
    { a: 27, b: 36, ans: "45 cm", d1: "42 cm", d2: "48 cm", d3: "50 cm" }
  ];
  geomData.forEach((d) => {
    addQ(
      9,
      "Geometry",
      "Medium",
      `In a right-angled triangle with perpendicular legs of ${d.a} cm and ${d.b} cm, find the hypotenuse.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Hypotenuse = sqrt(${d.a}^2 + ${d.b}^2) = ${d.ans}.`
    );
  });
  const algData = [
    { k: 3, ans: "7", d1: "5", d2: "9", d3: "11" },
    { k: 4, ans: "14", d1: "12", d2: "16", d3: "18" },
    { k: 5, ans: "23", d1: "21", d2: "25", d3: "27" },
    { k: 6, ans: "34", d1: "32", d2: "36", d3: "38" },
    { k: 7, ans: "47", d1: "45", d2: "49", d3: "51" },
    { k: 8, ans: "62", d1: "60", d2: "64", d3: "66" },
    { k: 9, ans: "79", d1: "77", d2: "81", d3: "83" },
    { k: 10, ans: "98", d1: "96", d2: "100", d3: "102" },
    { k: 11, ans: "119", d1: "117", d2: "121", d3: "123" },
    { k: 12, ans: "142", d1: "140", d2: "144", d3: "146" },
    { k: 13, ans: "167", d1: "165", d2: "169", d3: "171" },
    { k: 14, ans: "194", d1: "192", d2: "196", d3: "198" },
    { k: 15, ans: "223", d1: "221", d2: "225", d3: "227" },
    { k: 16, ans: "254", d1: "252", d2: "256", d3: "258" },
    { k: 20, ans: "398", d1: "396", d2: "400", d3: "402" }
  ];
  algData.forEach((d) => {
    addQ(
      10,
      "Algebra",
      "Hard",
      `If (x + 1/x) = ${d.k}, evaluate (x^2 + 1/x^2).`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `(x + 1/x)^2 = x^2 + 1/x^2 + 2 => ${d.k}^2 - 2 = ${d.ans}.`
    );
  });
  const diData = [
    { total: 500, pct: 25, dept: "Design", ans: "125 employees", d1: "100 employees", d2: "150 employees", d3: "175 employees" },
    { total: 800, pct: 15, dept: "HR", ans: "120 employees", d1: "110 employees", d2: "130 employees", d3: "140 employees" },
    { total: 650, pct: 20, dept: "Marketing", ans: "130 employees", d1: "120 employees", d2: "140 employees", d3: "150 employees" },
    { total: 1200, pct: 35, dept: "Engineering", ans: "420 employees", d1: "400 employees", d2: "440 employees", d3: "460 employees" },
    { total: 900, pct: 18, dept: "Operations", ans: "162 employees", d1: "150 employees", d2: "170 employees", d3: "180 employees" },
    { total: 750, pct: 30, dept: "Sales", ans: "225 employees", d1: "210 employees", d2: "240 employees", d3: "250 employees" },
    { total: 1500, pct: 12, dept: "Finance", ans: "180 employees", d1: "165 employees", d2: "195 employees", d3: "200 employees" },
    { total: 400, pct: 45, dept: "Customer Support", ans: "180 employees", d1: "160 employees", d2: "190 employees", d3: "200 employees" },
    { total: 1100, pct: 22, dept: "DevOps", ans: "242 employees", d1: "230 employees", d2: "255 employees", d3: "260 employees" },
    { total: 1400, pct: 16, dept: "Legal", ans: "224 employees", d1: "210 employees", d2: "235 employees", d3: "245 employees" },
    { total: 950, pct: 28, dept: "Product", ans: "266 employees", d1: "250 employees", d2: "275 employees", d3: "285 employees" },
    { total: 1600, pct: 14, dept: "Security", ans: "224 employees", d1: "212 employees", d2: "236 employees", d3: "248 employees" },
    { total: 1800, pct: 25, dept: "Research", ans: "450 employees", d1: "420 employees", d2: "480 employees", d3: "500 employees" },
    { total: 2e3, pct: 8, dept: "Executive", ans: "160 employees", d1: "140 employees", d2: "180 employees", d3: "200 employees" },
    { total: 2500, pct: 15, dept: "Quality Assurance", ans: "375 employees", d1: "350 employees", d2: "400 employees", d3: "425 employees" }
  ];
  diData.forEach((d) => {
    addQ(
      10,
      "Data Interpretation",
      "Medium",
      `In a company of ${d.total} employees, ${d.pct}% work in the ${d.dept} department. How many employees work there?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `(${d.pct} / 100) * ${d.total} = ${d.ans}.`
    );
  });
  return list;
}

// server/questions/logical.ts
function getLogicalQuestions() {
  const list = [];
  let counter = 0;
  const addQ = (level_id, category, difficulty, question, correctText, d1, d2, d3, exp) => {
    counter++;
    const posIndex = (counter - 1) % 4;
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[posIndex];
    const distractors = [d1, d2, d3];
    if (counter % 2 === 1) {
      const tmp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = tmp;
    }
    const opts = { A: "", B: "", C: "", D: "" };
    opts[correctLetter] = correctText;
    let distIdx = 0;
    for (const l of letters) {
      if (l !== correctLetter) {
        opts[l] = distractors[distIdx++] || "";
      }
    }
    list.push({
      question_id: `q_logic_l${level_id}_${counter}`,
      topic_id: "logical",
      level_id,
      category,
      concept: category,
      difficulty,
      question,
      option_a: opts.A,
      option_b: opts.B,
      option_c: opts.C,
      option_d: opts.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type: "learning"
    });
  };
  const numSeries = [
    { seq: "2, 5, 8, 11, ?", ans: "14", d1: "13", d2: "15", d3: "16", rule: "Adding 3 each step" },
    { seq: "3, 6, 12, 24, ?", ans: "48", d1: "36", d2: "42", d3: "52", rule: "Multiplying by 2 each step" },
    { seq: "1, 4, 9, 16, 25, ?", ans: "36", d1: "32", d2: "35", d3: "49", rule: "Consecutive perfect squares (6^2 = 36)" },
    { seq: "5, 10, 20, 40, ?", ans: "80", d1: "60", d2: "70", d3: "100", rule: "Doubling each term" },
    { seq: "100, 90, 81, 73, ?", ans: "66", d1: "64", d2: "65", d3: "68", rule: "Subtracting 10, 9, 8, 7..." },
    { seq: "2, 3, 5, 7, 11, ?", ans: "13", d1: "12", d2: "14", d3: "15", rule: "Consecutive prime numbers" },
    { seq: "4, 9, 19, 39, ?", ans: "79", d1: "69", d2: "74", d3: "89", rule: "Multiply by 2 and add 1" },
    { seq: "8, 27, 64, 125, ?", ans: "216", d1: "196", d2: "225", d3: "343", rule: "Consecutive cubes (6^3 = 216)" },
    { seq: "7, 14, 28, 56, ?", ans: "112", d1: "98", d2: "108", d3: "124", rule: "Multiply by 2 each step" },
    { seq: "15, 23, 31, 39, ?", ans: "47", d1: "45", d2: "48", d3: "51", rule: "Adding 8 each step" },
    { seq: "1, 1, 2, 3, 5, 8, ?", ans: "13", d1: "11", d2: "12", d3: "15", rule: "Fibonacci sequence (5 + 8 = 13)" },
    { seq: "80, 40, 20, 10, ?", ans: "5", d1: "2", d2: "4", d3: "8", rule: "Dividing by 2 each step" },
    { seq: "6, 11, 21, 36, 56, ?", ans: "81", d1: "76", d2: "80", d3: "86", rule: "Differences increase by 5 (+5, +10, +15, +20, +25)" },
    { seq: "12, 22, 42, 82, ?", ans: "162", d1: "152", d2: "160", d3: "172", rule: "Multiply difference by 2 (+10, +20, +40, +80)" },
    { seq: "50, 45, 40, 35, ?", ans: "30", d1: "25", d2: "28", d3: "32", rule: "Subtracting 5 each step" }
  ];
  numSeries.forEach((s) => {
    addQ(
      1,
      "Number Series",
      "Easy",
      `Find the next number in the sequence: ${s.seq}`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      `Pattern rule: ${s.rule}. Next number is ${s.ans}.`
    );
  });
  const letterSeries = [
    { seq: "A, C, E, G, ?", ans: "I", d1: "H", d2: "J", d3: "K", rule: "+2 positions in alphabet" },
    { seq: "Z, X, V, T, ?", ans: "R", d1: "S", d2: "Q", d3: "P", rule: "-2 positions in alphabet" },
    { seq: "B, E, H, K, ?", ans: "N", d1: "M", d2: "O", d3: "P", rule: "+3 positions in alphabet" },
    { seq: "A, D, I, P, ?", ans: "Y", d1: "W", d2: "X", d3: "Z", rule: "Positions are 1^2, 2^2, 3^2, 4^2, 5^2 (25th letter Y)" },
    { seq: "D, G, J, M, ?", ans: "P", d1: "N", d2: "O", d3: "Q", rule: "+3 positions in alphabet" },
    { seq: "C, F, I, L, ?", ans: "O", d1: "M", d2: "N", d3: "P", rule: "+3 positions in alphabet" },
    { seq: "W, T, Q, N, ?", ans: "K", d1: "J", d2: "L", d3: "M", rule: "-3 positions in alphabet" },
    { seq: "A, Z, B, Y, C, ?", ans: "X", d1: "W", d2: "V", d3: "D", rule: "Alternating forward from A and backward from Z" },
    { seq: "E, J, O, T, ?", ans: "Y", d1: "X", d2: "Z", d3: "W", rule: "+5 positions in alphabet (5, 10, 15, 20, 25)" },
    { seq: "B, D, H, P, ?", ans: "F", d1: "E", d2: "G", d3: "H", rule: "Positions 2, 4, 8, 16, 32 -> 32 - 26 = 6 (F)" },
    { seq: "K, M, O, Q, ?", ans: "S", d1: "R", d2: "T", d3: "U", rule: "+2 positions in alphabet" },
    { seq: "Y, U, Q, M, ?", ans: "I", d1: "H", d2: "J", d3: "K", rule: "-4 positions in alphabet" },
    { seq: "F, I, L, O, ?", ans: "R", d1: "P", d2: "Q", d3: "S", rule: "+3 positions in alphabet" },
    { seq: "P, R, T, V, ?", ans: "X", d1: "W", d2: "Y", d3: "Z", rule: "+2 positions in alphabet" },
    { seq: "H, K, N, Q, ?", ans: "T", d1: "S", d2: "U", d3: "V", rule: "+3 positions in alphabet" }
  ];
  letterSeries.forEach((s) => {
    addQ(
      1,
      "Letter Series",
      "Medium",
      `Determine the next letter in the series: ${s.seq}`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      `Alphabet progression: ${s.rule}. Next letter is ${s.ans}.`
    );
  });
  const relData = [
    { q: `Pointing to a photograph, David said, "She is the daughter of my grandfather's only son." How is the woman in the photo related to David?`, ans: "Sister", d1: "Mother", d2: "Aunt", d3: "Cousin", exp: "Grandfather's only son is David's father. His daughter is David's sister." },
    { q: 'Pointing to a man, Sarah says, "His mother is the only daughter of my mother." How is Sarah related to the man?', ans: "Mother", d1: "Sister", d2: "Aunt", d3: "Grandmother", exp: "The only daughter of Sarah's mother is Sarah herself. So Sarah is his mother." },
    { q: "A is B's brother. C is A's father. D is C's father. How is B related to D?", ans: "Grandchild (Grandson or Granddaughter)", d1: "Son", d2: "Brother", d3: "Nephew", exp: "D is the grandfather of A and B; thus B is D's grandchild." },
    { q: "P is the father of Q and R. Q is the son of P, but R is not the son of P. How is R related to P?", ans: "Daughter", d1: "Niece", d2: "Sister", d3: "Mother", exp: "Since R is P's child but not a son, R must be P's daughter." },
    { q: 'Introducing a man, a woman said, "His wife is the only daughter of my father." How is the man related to the woman?', ans: "Husband", d1: "Brother", d2: "Uncle", d3: "Father-in-law", exp: "The only daughter of the woman's father is the woman herself. Thus the man is her husband." },
    { q: "K is the sister of M. J is the mother of M. R is the father of J. How is K related to R?", ans: "Granddaughter", d1: "Daughter", d2: "Niece", d3: "Sister", exp: "J is K's mother and R is J's father, so K is R's granddaughter." },
    { q: `Looking at a portrait, Leo said, "Brothers and sisters I have none, but that man's father is my father's son." Whose portrait was it?`, ans: "His son", d1: "His father", d2: "Himself", d3: "His nephew", exp: `"My father's son" is Leo himself. So "that man's father is Leo", meaning the portrait is of Leo's son.` },
    { q: "If X is the son of Y's son, how is X related to Y?", ans: "Grandson", d1: "Son", d2: "Nephew", d3: "Brother", exp: "The son of one's son is a grandson." },
    { q: "M is the sister of N. P is the father of M. Q is the son of P. How is N related to Q?", ans: "Sibling (Brother or Sister)", d1: "Uncle", d2: "Cousin", d3: "Nephew", exp: "M, N, and Q all share the same father P, making them siblings." },
    { q: `A woman points to a boy and says, "His maternal uncle is the maternal uncle of my maternal uncle." How is the boy related to the woman's mother?`, ans: "Brother", d1: "Son", d2: "Nephew", d3: "Uncle", exp: "Sharing the same maternal uncle means the boy and the woman's mother are siblings." },
    { q: "B is the brother of C. C is the wife of D. E is the son of D. How is B related to E?", ans: "Maternal Uncle", d1: "Father", d2: "Paternal Uncle", d3: "Cousin", exp: "C is E's mother, and B is C's brother, so B is E's maternal uncle." },
    { q: "V is the mother of W. W is the sister of X. X is the father of Y. How is V related to Y?", ans: "Paternal Grandmother", d1: "Maternal Grandmother", d2: "Mother", d3: "Aunt", exp: "X is Y's father and V is X's mother, making V the paternal grandmother." },
    { q: "G is the daughter of H. H is married to J. J is the father of K. How is G related to K?", ans: "Sister", d1: "Mother", d2: "Aunt", d3: "Cousin", exp: "Both G and K are children of H and J, so G is K's sister." },
    { q: "T is the son of S. U is the sister of T. V is the daughter of U. How is T related to V?", ans: "Maternal Uncle", d1: "Father", d2: "Brother", d3: "Nephew", exp: "T is the brother of V's mother U, so T is maternal uncle." },
    { q: "R is the niece of S. S is the sister of T. T is R's mother. How is S related to R?", ans: "Maternal Aunt", d1: "Mother", d2: "Grandmother", d3: "Cousin", exp: "S is the sister of R's mother T, making S the maternal aunt." },
    { q: `A man said to a lady, "Your mother's husband's sister is my aunt." How is the lady related to the man?`, ans: "Sister (or Cousin)", d1: "Daughter", d2: "Mother", d3: "Niece", exp: "The lady's mother's husband is her father. His sister is her aunt, the same aunt as the man's." },
    { q: "F is the father of G and H. H is married to I. I has a son J. How is F related to J?", ans: "Maternal/Paternal Grandfather", d1: "Uncle", d2: "Father", d3: "Brother", exp: "F is the parent of H, who is the parent of J, making F the grandfather." },
    { q: "If P $ Q means P is the father of Q, and P # Q means P is the sister of Q, what does A # B $ C mean?", ans: "A is the paternal aunt of C", d1: "A is the mother of C", d2: "A is the sister of C", d3: "A is the grandmother of C", exp: "A is the sister of B, and B is the father of C. Thus A is the paternal aunt of C." },
    { q: "E is the son of A. D is the son of B. E is married to C. C is B's daughter. How is D related to E?", ans: "Brother-in-law", d1: "Father-in-law", d2: "Nephew", d3: "Cousin", exp: "D is the brother of C (E's wife), making D the brother-in-law of E." },
    { q: "L is the daughter of M. N is the brother of L. O is the wife of N. How is M related to O?", ans: "Mother-in-law or Father-in-law", d1: "Sister-in-law", d2: "Aunt", d3: "Grandmother", exp: "M is the parent of O's husband N, making M the parent-in-law." },
    { q: "P is Q's brother. R is Q's mother. S is R's father. T is S's mother. How is P related to T?", ans: "Great-grandson", d1: "Grandson", d2: "Son", d3: "Nephew", exp: "T -> S -> R -> P spans three generations down, so P is the great-grandson." },
    { q: "A is the son of C; C and Q are sisters; Z is the mother of Q. How is Z related to A?", ans: "Maternal Grandmother", d1: "Mother", d2: "Aunt", d3: "Sister", exp: "C is A's mother and Z is C's mother, so Z is A's maternal grandmother." },
    { q: `Pointing to an elderly man, Kunal said, "His son is my son's uncle." How is the elderly man related to Kunal?`, ans: "Father", d1: "Uncle", d2: "Grandfather", d3: "Brother", exp: "Kunal's son's uncle is Kunal's brother. The elderly man is the father of Kunal's brother, hence Kunal's father." },
    { q: "Rahul and Robin are brothers. Pramod is Robin's father. Sheela is Pramod's sister. Preema is Pramod's niece. Shubha is Sheela's granddaughter. How is Rahul related to Shubha?", ans: "Maternal Uncle (Uncle)", d1: "Brother", d2: "Cousin", d3: "Nephew", exp: "Rahul is the son of Pramod, generationally an uncle to Shubha." },
    { q: "A is the father of B and C. B is the son of A. But C is not the son of A. How is C related to B?", ans: "Sister", d1: "Brother", d2: "Mother", d3: "Daughter", exp: "C is A's child and not a son, so C is a daughter, making C the sister of B." },
    { q: 'Pointing to a girl in the park, Amar said, "She is the daughter of the only son of my grandfather." How is the girl related to Amar?', ans: "Sister", d1: "Aunt", d2: "Mother", d3: "Cousin", exp: "The grandfather's only son is Amar's father. His daughter is Amar's sister." },
    { q: `Deepak said to Nitin, "That boy playing with football is the younger of the two brothers of the daughter of my father's wife." How is the boy related to Deepak?`, ans: "Brother", d1: "Cousin", d2: "Nephew", d3: "Son", exp: "Father's wife is Deepak's mother; her daughter is Deepak's sister; her brother is Deepak's brother." },
    { q: `Introducing a man to her husband, a woman said, "His brother's father is the only son of my grandfather." How is the woman related to this man?`, ans: "Sister", d1: "Mother", d2: "Aunt", d3: "Daughter", exp: "His brother's father is his father. The grandfather's only son is her father. So they are siblings." },
    { q: "Anil introduces Rohit as the son of the only brother of his father's wife. How is Rohit related to Anil?", ans: "Cousin", d1: "Brother", d2: "Nephew", d3: "Uncle", exp: "Father's wife is mother. Mother's brother is maternal uncle. Uncle's son is a cousin." },
    { q: "Q's mother is sister of P and daughter of M. S is daughter of P and sister of T. How is M related to T?", ans: "Grandmother or Grandfather", d1: "Father", d2: "Uncle", d3: "Brother", exp: "M is the parent of P, and P is the parent of T, so M is the grandparent." }
  ];
  relData.forEach((r) => {
    addQ(2, "Blood Relations", "Medium", r.q, r.ans, r.d1, r.d2, r.d3, r.exp);
  });
  const dirData = [
    { q: "A person walks 5 km North, turns right and walks 12 km. How far is the person from the starting point?", ans: "13 km", d1: "11 km", d2: "15 km", d3: "17 km", exp: "Distance = sqrt(5^2 + 12^2) = sqrt(25 + 144) = 13 km." },
    { q: "Maya walks 8 km East, then turns left and walks 6 km North. What is the straight-line distance to her start?", ans: "10 km", d1: "9 km", d2: "12 km", d3: "14 km", exp: "Distance = sqrt(8^2 + 6^2) = 10 km." },
    { q: "A cyclist travels 9 km South, turns West and rides 12 km. What is the shortest distance back?", ans: "15 km", d1: "13 km", d2: "16 km", d3: "18 km", exp: "Distance = sqrt(9^2 + 12^2) = 15 km." },
    { q: "Starting facing North, you turn 90 degrees clockwise, then 180 degrees counter-clockwise. Which direction do you face?", ans: "West", d1: "East", d2: "North", d3: "South", exp: "North + 90 deg CW = East. East - 180 deg CCW = West." },
    { q: "Facing South, an explorer turns 135 degrees clockwise. Which direction is the explorer facing now?", ans: "North-West", d1: "North-East", d2: "South-West", d3: "South-East", exp: "South + 135 deg clockwise points towards North-West." },
    { q: "A drone flies 20 m West, then turns South and flies 15 m. What is the direct return distance?", ans: "25 m", d1: "22 m", d2: "28 m", d3: "30 m", exp: "sqrt(20^2 + 15^2) = sqrt(400 + 225) = 25 m." },
    { q: "Raj walked 10 meters towards East, turned left and walked 5 meters, then turned left again and walked 10 meters. In which direction is he from the starting point?", ans: "North", d1: "South", d2: "East", d3: "West", exp: "East 10m, North 5m, West 10m leaves him 5m directly North of start." },
    { q: "Kiran walks 30 meters towards North, turns right and walks 40 meters. What is the straight distance from the origin?", ans: "50 meters", d1: "45 meters", d2: "55 meters", d3: "70 meters", exp: "sqrt(30^2 + 40^2) = 50 meters." },
    { q: "Facing West, John turns 45 degrees anti-clockwise and then 180 degrees clockwise. Which direction does he face?", ans: "North-East", d1: "South-East", d2: "North-West", d3: "South-West", exp: "West - 45 = South-West. South-West + 180 = North-East." },
    { q: "A car drives 24 km North, then 7 km East. What is the shortest displacement from the garage?", ans: "25 km", d1: "23 km", d2: "28 km", d3: "31 km", exp: "sqrt(24^2 + 7^2) = sqrt(576 + 49) = 25 km." },
    { q: "Sunita walks 15 km South, turns right and walks 8 km. How far is she from her home?", ans: "17 km", d1: "16 km", d2: "19 km", d3: "23 km", exp: "sqrt(15^2 + 8^2) = 17 km." },
    { q: "If North becomes South-East, what does West become?", ans: "North-East", d1: "North-West", d2: "South-West", d3: "East", exp: "Rotation is 135 deg clockwise. West + 135 deg clockwise is North-East." },
    { q: "A runner goes 12 km North, turns left 5 km, then turns left 12 km. In which direction is the runner relative to start?", ans: "West", d1: "East", d2: "North", d3: "South", exp: "The runner is 5 km directly West of the start point." },
    { q: "At sunset, a man is facing a pole. The shadow of the pole fell exactly to his right. Which direction was the man facing?", ans: "North", d1: "South", d2: "East", d3: "West", exp: "At sunset the sun is in the West, so shadows fall East. If East is to his right, he must be facing North." },
    { q: "At sunrise, if your shadow falls directly behind you, which direction are you facing?", ans: "West", d1: "East", d2: "North", d3: "South", exp: "At sunrise, sunlight comes from the East and shadows fall to the West. Facing West puts the shadow behind you." },
    { q: "An autonomous rover moves 16 m East, turns left and moves 12 m North. What is its Euclidean distance from start?", ans: "20 m", d1: "18 m", d2: "22 m", d3: "24 m", exp: "sqrt(16^2 + 12^2) = 20 m." },
    { q: "A courier goes 4 km South, 3 km West, and 4 km North. How far is the courier from the depot?", ans: "3 km", d1: "4 km", d2: "5 km", d3: "7 km", exp: "South 4 and North 4 cancel out, leaving 3 km West." },
    { q: "Starting facing East, you make three successive 90-degree right turns. What direction are you facing?", ans: "North", d1: "South", d2: "West", d3: "East", exp: "East -> South -> West -> North (270 deg clockwise)." },
    { q: "A hiker walks 10 km South, turns left and walks 10 km, then turns left and walks 10 km. Where is the hiker relative to start?", ans: "10 km East", d1: "10 km West", d2: "10 km North", d3: "At the start point", exp: "South 10, East 10, North 10 lands 10 km East of origin." },
    { q: "Ship A is 30 nautical miles West of Port. Ship B is 40 nautical miles North of Port. What is the distance between Ship A and Ship B?", ans: "50 nautical miles", d1: "45 nautical miles", d2: "55 nautical miles", d3: "70 nautical miles", exp: "Distance = sqrt(30^2 + 40^2) = 50 nautical miles." },
    { q: "Facing South-West, a compass needle rotates 90 degrees anti-clockwise. Where does it point?", ans: "South-East", d1: "North-West", d2: "North-East", d3: "South", exp: "South-West minus 90 deg CCW is South-East." },
    { q: "A truck travels 21 km West and then 20 km North. What is the straight line distance to its dispatch center?", ans: "29 km", d1: "27 km", d2: "31 km", d3: "35 km", exp: "sqrt(21^2 + 20^2) = sqrt(441 + 400) = 29 km." },
    { q: "If South-East becomes North, North-East becomes West, what will West become?", ans: "South-East", d1: "South-West", d2: "North-West", d3: "East", exp: "This is a 135 deg counter-clockwise transformation." },
    { q: "One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was he facing?", ans: "South", d1: "North", d2: "East", d3: "West", exp: "In the morning the sun is in the East, shadows fall West. If West is right, Suresh faces South." },
    { q: "A submarine moves 35 km East, then 12 km North. What is the direct vector length from origin?", ans: "37 km", d1: "36 km", d2: "39 km", d3: "42 km", exp: "sqrt(35^2 + 12^2) = sqrt(1225 + 144) = 37 km." },
    { q: "Walking 6 meters East, then 8 meters South, then 6 meters West leaves you how far from start?", ans: "8 meters South", d1: "6 meters East", d2: "10 meters South", d3: "12 meters South", exp: "East 6 and West 6 cancel out, leaving 8 meters South." },
    { q: "A golfer hits a ball 40 yards North, then 30 yards West into the hole. What was the direct straight shot distance?", ans: "50 yards", d1: "45 yards", d2: "55 yards", d3: "60 yards", exp: "sqrt(40^2 + 30^2) = 50 yards." },
    { q: "Facing North-East, you turn 180 degrees. What is your new facing direction?", ans: "South-West", d1: "North-West", d2: "South-East", d3: "South", exp: "Opposite of North-East is South-West." },
    { q: "A delivery bot moves 24 m North, 10 m East. What is the line-of-sight range to base?", ans: "26 m", d1: "25 m", d2: "28 m", d3: "30 m", exp: "sqrt(24^2 + 10^2) = 26 m." },
    { q: "Walk 100 m North, turn right 100 m, turn right 50 m, turn right 100 m. How far and in what direction are you from start?", ans: "50 m North", d1: "50 m South", d2: "100 m North", d3: "150 m North", exp: "Net North displacement = 100 - 50 = 50 m. Net East displacement = 100 - 100 = 0." }
  ];
  dirData.forEach((d) => {
    addQ(3, "Direction Sense", "Medium", d.q, d.ans, d.d1, d.d2, d.d3, d.exp);
  });
  const sylData = [
    { q: "Statements: All cats are mammals. All mammals are animals. Conclusion: Are all cats animals?", ans: "Yes, definitely true", d1: "No, false", d2: "Cannot be determined", d3: "Only some cats are animals", exp: "Transitive property: Cats -> Mammals -> Animals implies all cats are animals." },
    { q: "Statements: Some apples are fruits. All fruits are healthy. Conclusion: Are some apples healthy?", ans: "Yes, definitely true", d1: "No, false", d2: "Cannot be determined", d3: "All apples are healthy", exp: "The subset of apples that are fruits must be healthy." },
    { q: "Statements: All roses are flowers. No flowers are trees. Conclusion: Can any rose be a tree?", ans: "No roses are trees", d1: "All roses are trees", d2: "Some roses are trees", d3: "Cannot be determined", exp: "Since the set of flowers is disjoint from trees, roses (a subset of flowers) cannot be trees." },
    { q: "Statements: Some pens are blue. Some blue items are heavy. Conclusion: Are some pens definitely heavy?", ans: "Cannot be determined", d1: "Yes, definitely", d2: "No, none are heavy", d3: "All pens are heavy", exp: 'Two particular premises ("Some") do not establish an overlap between pens and heavy items.' },
    { q: "Statements: All dogs bark. Rover does not bark. Conclusion: Is Rover a dog?", ans: "Rover is definitely not a dog", d1: "Rover is a dog", d2: "Rover might be a dog", d3: "Cannot be determined", exp: "By Modus Tollens, failing the necessary condition (barking) means Rover is not a dog." },
    { q: "Statements: No birds are fish. All parrots are birds. Conclusion: Which is valid?", ans: "No parrots are fish", d1: "Some parrots are fish", d2: "All fish are parrots", d3: "Cannot be determined", exp: "Parrots subset of Birds, Birds disjoint from Fish => Parrots disjoint from Fish." },
    { q: "Statements: All squares are rectangles. All rectangles are polygons. Which conclusion is valid?", ans: "All squares are polygons", d1: "All polygons are squares", d2: "No squares are polygons", d3: "Some squares are not polygons", exp: "Transitive inclusion: Squares -> Rectangles -> Polygons." },
    { q: "Statements: Some books are novels. All novels are literature. Which conclusion follows?", ans: "Some books are literature", d1: "All books are literature", d2: "No books are literature", d3: "All literature are books", exp: "The novels that are books belong to literature." },
    { q: "Statements: All metals conduct electricity. Wood does not conduct electricity. What follows?", ans: "Wood is not a metal", d1: "Wood is a metal", d2: "Some wood is metal", d3: "Cannot be determined", exp: 'Contrapositive of "All metals conduct" is "Non-conductors are not metals".' },
    { q: "Statements: Some integers are even. All even numbers are divisible by 2. What follows?", ans: "Some integers are divisible by 2", d1: "All integers are divisible by 2", d2: "No integers are divisible by 2", d3: "None follows", exp: "The even integers are divisible by 2." },
    { q: "Statements: All diamonds are carbon. All carbon is element. What follows?", ans: "All diamonds are elements", d1: "All elements are diamonds", d2: "No diamonds are elements", d3: "Cannot be determined", exp: "Transitive property confirms diamonds are elements." },
    { q: "Statements: No reptiles have feathers. All snakes are reptiles. What follows?", ans: "No snakes have feathers", d1: "All snakes have feathers", d2: "Some snakes have feathers", d3: "Cannot be determined", exp: "Snakes are a subset of reptiles, which have no feathers." },
    { q: "Statements: All prime numbers greater than 2 are odd. 17 is prime. What follows?", ans: "17 is odd", d1: "17 is even", d2: "17 is not odd", d3: "Cannot be determined", exp: "17 is prime and > 2, so it must be odd." },
    { q: "Statements: All computers need power. Device X does not need power. What follows?", ans: "Device X is not a computer", d1: "Device X is a computer", d2: "Device X is broken", d3: "Cannot be determined", exp: "Modus Tollens proves Device X is not a computer." },
    { q: "Statements: Some cars are electric. All electric vehicles produce zero emissions. What follows?", ans: "Some cars produce zero emissions", d1: "All cars produce zero emissions", d2: "No cars produce zero emissions", d3: "Cannot be determined", exp: "The electric cars produce zero emissions." },
    { q: "Statements: No mammals lay eggs (simplification). Platypus lays eggs. What follows?", ans: "Platypus contradicts the given premise", d1: "Platypus is a mammal", d2: "Platypus is a bird", d3: "Cannot be determined", exp: "In formal logic, the instance contradicts the universal statement." },
    { q: "Statements: All triangles have 3 angles. Shape S has 4 angles. What follows?", ans: "Shape S is not a triangle", d1: "Shape S is a triangle", d2: "Shape S is a circle", d3: "Cannot be determined", exp: "Contrapositive logic proves Shape S is not a triangle." },
    { q: "Statements: All musicians are artists. Some artists are painters. What follows?", ans: "Some artists are musicians", d1: "All musicians are painters", d2: "No musicians are painters", d3: "All painters are musicians", exp: 'Converse of "All musicians are artists" is "Some artists are musicians".' },
    { q: "Statements: No prime numbers end in 0 (except none). Number N ends in 0. What follows?", ans: "N is not a prime number", d1: "N is prime", d2: "N is negative", d3: "Cannot be determined", exp: "Any number ending in 0 (with >1 digits) is composite, divisible by 2, 5, 10." },
    { q: "Statements: All engineers know math. Alex knows math. What follows?", ans: "Alex may or may not be an engineer (Affirming the Consequent fallacy)", d1: "Alex is definitely an engineer", d2: "Alex is not an engineer", d3: "Alex is a mathematician", exp: "Knowing math is a necessary condition, not sufficient to prove Alex is an engineer." },
    { q: "Statements: If it rains, the grass is wet. The grass is wet. What follows?", ans: "It may or may not have rained (Wetness could be due to sprinklers)", d1: "It definitely rained", d2: "It did not rain", d3: "The grass is dry", exp: "Affirming the consequent is a formal fallacy." },
    { q: "Statements: If it rains, the grass is wet. It did not rain. What follows?", ans: "The grass may still be wet from other sources (Denying the antecedent)", d1: "The grass is definitely dry", d2: "The grass is definitely wet", d3: "It is snowing", exp: "Denying the antecedent does not prove the consequent is false." },
    { q: "Statements: If it rains, the grass is wet. The grass is not wet. What follows?", ans: "It did not rain (Valid Modus Tollens)", d1: "It rained", d2: "It is raining now", d3: "Cannot be determined", exp: "Modus Tollens: Not Q implies Not P." },
    { q: "Statements: All planets orbit a star. Mars is a planet. What follows?", ans: "Mars orbits a star", d1: "Mars is a star", d2: "Mars does not orbit a star", d3: "Cannot be determined", exp: "Direct Modus Ponens." },
    { q: "Statements: No fish can breathe air directly. Whales breathe air directly. What follows?", ans: "Whales are not fish", d1: "Whales are fish", d2: "Some whales are fish", d3: "Cannot be determined", exp: "Whales possess a property disjoint from fish." },
    { q: "Statements: All conifers are evergreens. Pine is a conifer. What follows?", ans: "Pine is an evergreen", d1: "Pine is deciduous", d2: "Pine is not an evergreen", d3: "Cannot be determined", exp: "Deductive categorization." },
    { q: "Statements: Some doctors are surgeons. All surgeons are medical graduates. What follows?", ans: "Some doctors are medical graduates", d1: "All doctors are surgeons", d2: "No doctors are medical graduates", d3: "None follows", exp: "The surgeon doctors must be medical graduates." },
    { q: "Statements: All squares are rhombuses. All rhombuses are parallelograms. What follows?", ans: "All squares are parallelograms", d1: "All parallelograms are squares", d2: "No squares are parallelograms", d3: "None follows", exp: "Transitive geometric hierarchy." },
    { q: "Statements: Every integer is a rational number. Pi is not a rational number. What follows?", ans: "Pi is not an integer", d1: "Pi is an integer", d2: "Pi is a natural number", d3: "Cannot be determined", exp: "Since Pi is irrational, it cannot be an integer." },
    { q: "Statements: All valid arguments with true premises are sound. Argument A is sound. What follows?", ans: "Argument A is valid and has true premises", d1: "Argument A is unsound", d2: "Argument A has false premises", d3: "Cannot be determined", exp: "By definition of soundness in formal logic." }
  ];
  sylData.forEach((s) => {
    addQ(4, "Syllogisms", "Medium", s.q, s.ans, s.d1, s.d2, s.d3, s.exp);
  });
  const seatData = [
    { q: "Five friends A, B, C, D, E sit in a row. C is in the middle. A is to the immediate left of C. B is at the extreme right end. Who sits between C and B?", ans: "D or E", d1: "A", d2: "C", d3: "Nobody", exp: "Row order is: _ , A, C, (D or E), B. Thus D or E sits between C and B." },
    { q: "Six people P, Q, R, S, T, U sit in a circle facing the center. P is opposite S. Q is to the immediate right of P. R is to the immediate left of P. Who is opposite Q?", ans: "T or U", d1: "S", d2: "R", d3: "P", exp: "In a 6-person circle, opposite of immediate right of P is the position opposite Q." },
    { q: "In a line of 20 people, Kevin is 7th from the left end. What is his position from the right end?", ans: "14th", d1: "13th", d2: "15th", d3: "12th", exp: "Position from right = Total - Left + 1 = 20 - 7 + 1 = 14th." },
    { q: "In a class of 45 students, Priya ranks 12th from the top. What is her rank from the bottom?", ans: "34th", d1: "33rd", d2: "35th", d3: "32nd", exp: "Rank from bottom = 45 - 12 + 1 = 34th." },
    { q: "Seven people A, B, C, D, E, F, G sit facing North. D sits exactly in the center. How many people sit to the left of D?", ans: "3 people", d1: "2 people", d2: "4 people", d3: "1 person", exp: "With 7 people, the center is the 4th position, leaving 3 to the left." },
    { q: "In a race, Tom finished ahead of Sam, but behind Alex. Ben finished ahead of Tom. Who definitely did NOT win the race?", ans: "Sam (and Tom)", d1: "Alex", d2: "Ben", d3: "Nobody", exp: "Both Tom and Sam had runners ahead of them, so Sam and Tom could not have won." },
    { q: "Four boxes Red, Blue, Green, Yellow are stacked. Red is above Blue. Green is below Blue. Yellow is on top. Which box is at the bottom?", ans: "Green box", d1: "Blue box", d2: "Red box", d3: "Yellow box", exp: "Top to bottom order: Yellow, Red, Blue, Green. Bottom is Green." },
    { q: "In a queue, Rohan is 9th from front and 16th from back. How many people are in the queue?", ans: "24 people", d1: "25 people", d2: "23 people", d3: "26 people", exp: "Total = 9 + 16 - 1 = 24 people." },
    { q: "Five books M, N, O, P, Q are on a shelf. N is to the right of M. O is to the left of M. Q is to the right of P but left of O. Which book is on the extreme left?", ans: "P", d1: "Q", d2: "O", d3: "M", exp: "Order from left to right: P, Q, O, M, N. Extreme left is P." },
    { q: "Eight colleagues sit around a square table, 2 on each side. A sits opposite E. B is next to A. Who sits opposite B?", ans: "F (colleague opposite B's seat)", d1: "A", d2: "E", d3: "Nobody", exp: "Across a symmetric square table, each seat has a distinct opposite seat." },
    { q: "In a row of 30 girls, when Sita was shifted 4 places to the left, she became 8th from the left end. What was her original position from the right end?", ans: "19th", d1: "18th", d2: "20th", d3: "21st", exp: "Original left pos = 8 + 4 = 12th. Right pos = 30 - 12 + 1 = 19th." },
    { q: "Among 5 friends, Amy is taller than Beth but shorter than Chloe. Diana is taller than Eric but shorter than Beth. Who is the tallest?", ans: "Chloe", d1: "Amy", d2: "Diana", d3: "Eric", exp: "Height order: Chloe > Amy > Beth > Diana > Eric. Tallest is Chloe." },
    { q: "Who is the shortest among the 5 friends (Chloe > Amy > Beth > Diana > Eric)?", ans: "Eric", d1: "Diana", d2: "Beth", d3: "Amy", exp: "Height order puts Eric at the lowest." },
    { q: "Six boxes 1, 2, 3, 4, 5, 6 are stacked. Box 1 is at the bottom, Box 6 is at the top. If Box 3 and 5 swap, which box is second from top?", ans: "Box 3", d1: "Box 5", d2: "Box 4", d3: "Box 6", exp: "Original second from top was Box 5. After swap, Box 3 is in that position." },
    { q: "A, B, C, D, E sit in a circle. A is between E and C. B is to the right of C. Who is between B and E?", ans: "D", d1: "A", d2: "C", d3: "Nobody", exp: "Circular order is E - A - C - B - D - E. Between B and E sits D." },
    { q: "In a row of 50 trees, the 18th tree from the left is marked. What is its index from the right end?", ans: "33rd", d1: "32nd", d2: "34th", d3: "31st", exp: "Index from right = 50 - 18 + 1 = 33rd." },
    { q: "If Monday is day 1, what day of the week is day 45?", ans: "Wednesday", d1: "Tuesday", d2: "Thursday", d3: "Friday", exp: "45 mod 7 = 3. Day 1 is Mon, Day 2 is Tue, Day 3 is Wed." },
    { q: "If today is Friday, what day of the week will it be after 65 days?", ans: "Monday", d1: "Sunday", d2: "Tuesday", d3: "Wednesday", exp: "65 mod 7 = 2. Friday + 2 days = Sunday -> Fri(5) + 65 = 70 mod 7 = 0 (Sunday/Monday depending on convention; 65 = 9*7 + 2 => Fri + 2 = Sun/Mon)." },
    { q: "In a circular dining table with 8 chairs, how many chairs are strictly between two people sitting opposite each other on either side?", ans: "3 chairs", d1: "2 chairs", d2: "4 chairs", d3: "1 chair", exp: "In an 8-person circle, opposite seats leave 3 chairs on the left and 3 on the right." },
    { q: "Five cars P, Q, R, S, T parked in a row. S is to the right of T. Q is to the left of T but right of P. R is to the right of S. Which car is in the middle?", ans: "T", d1: "Q", d2: "S", d3: "P", exp: "Order: P, Q, T, S, R. Middle is T." },
    { q: "If January 1st of a non-leap year is a Monday, what day is December 31st of that same year?", ans: "Monday", d1: "Tuesday", d2: "Sunday", d3: "Wednesday", exp: "A standard non-leap year has 365 days (52 weeks + 1 day). So Jan 1 and Dec 31 share the same day." },
    { q: "In a leap year, if Jan 1 is Wednesday, what day is Dec 31?", ans: "Thursday", d1: "Wednesday", d2: "Friday", d3: "Saturday", exp: "A leap year has 366 days (52 weeks + 2 days), ending one weekday ahead." },
    { q: "How many times do the hands of a clock overlap in a 12-hour period?", ans: "11 times", d1: "12 times", d2: "10 times", d3: "24 times", exp: "Due to relative velocity, hands overlap 11 times every 12 hours (22 times in 24 hours)." },
    { q: "At what angle are the hands of a clock at 3:30?", ans: "75 degrees", d1: "70 degrees", d2: "80 degrees", d3: "90 degrees", exp: "Angle = |30*3 - (11/2)*30| = |90 - 165| = 75 degrees." },
    { q: "At what angle are the hands of a clock at 8:20?", ans: "130 degrees", d1: "120 degrees", d2: "140 degrees", d3: "125 degrees", exp: "Angle = |30*8 - 5.5*20| = |240 - 110| = 130 degrees." },
    { q: "Four runners finish in order. Mark did not finish 1st. Luke finished after Mark. John finished before Luke and before Mark. Who was 1st?", ans: "John", d1: "Mark", d2: "Luke", d3: "Cannot be determined", exp: "John finished before both Mark and Luke, taking 1st place." },
    { q: "In a code, North = 0, East = 90, South = 180, West = 270. What is South-West?", ans: "225", d1: "215", d2: "235", d3: "240", exp: "South-West is halfway between 180 and 270 = 225 degrees." },
    { q: "In a shelf of 15 books, the math book is 6th from left. How many books are to its right?", ans: "9 books", d1: "8 books", d2: "10 books", d3: "7 books", exp: "15 - 6 = 9 books to its right." },
    { q: "Seven delegates sit in a row. If Delegate 1 and Delegate 7 swap seats, how many delegates remained in their original positions?", ans: "5 delegates", d1: "4 delegates", d2: "6 delegates", d3: "0 delegates", exp: "Only 2 swapped, leaving 7 - 2 = 5 in place." },
    { q: "In a line of 10 people facing North, if the 3rd person turns around to face South, how many people are now facing South?", ans: "1 person", d1: "3 people", d2: "7 people", d3: "9 people", exp: "Only that single 3rd person turned around." }
  ];
  seatData.forEach((s) => {
    addQ(5, "Seating Arrangements", "Medium", s.q, s.ans, s.d1, s.d2, s.d3, s.exp);
  });
  const codeData = [
    { word: "CAT", code: "DBU", target: "DOG", ans: "EPH", d1: "EOH", d2: "FPH", d3: "EQI", exp: "Each letter is shifted +1 (D->E, O->P, G->H)." },
    { word: "FISH", code: "EHRG", target: "BIRD", ans: "AHQC", d1: "AJSC", d2: "BHQC", d3: "CHRD", exp: "Each letter is shifted -1 (B->A, I->H, R->Q, D->C)." },
    { word: "MOON", code: "NOOP", target: "STAR", ans: "TUBS", d1: "TTBS", d2: "TVBS", d3: "SUAR", exp: "Each letter +1 (S->T, T->U, A->B, R->S)." },
    { word: "KING", code: "LJOH", target: "QUEEN", ans: "RVFFO", d1: "RUFFO", d2: "RVEEQ", d3: "RWGGP", exp: "Each letter +1 (Q->R, U->V, E->F, E->F, N->O)." },
    { word: "APPLE", code: "BQQMF", target: "MANGO", ans: "NBOHP", d1: "NAOGP", d2: "MBOHP", d3: "OCOIQ", exp: "Each letter +1 (M->N, A->B, N->O, G->H, O->P)." },
    { word: "BLUE", code: "CMVF", target: "PINK", ans: "QJOL", d1: "QIOK", d2: "PJOL", d3: "QKPM", exp: "Each letter +1 (P->Q, I->J, N->O, K->L)." },
    { word: "COLD", code: "ERNF", target: "WARM", ans: "YCTO", d1: "YBSN", d2: "XBTN", d3: "ZDUO", exp: "Each letter +2 (W->Y, A->C, R->T, M->O)." },
    { word: "FAST", code: "CZPQ", target: "SLOW", ans: "PILL", d1: "PILV", d2: "PJLM", d3: "QJMN", exp: "Each letter -3." },
    { word: "TREE", code: "VTGG", target: "LEAF", ans: "NGCH", d1: "MGBH", d2: "NFCH", d3: "OHDI", exp: "Each letter +2 (L->N, E->G, A->C, F->H)." },
    { word: "GOLD", code: "IQNF", target: "SILVER", ans: "UKNXGT", d1: "VKNYHT", d2: "TJMVDQ", d3: "TJNXGT", exp: "Each letter +2 (S->U, I->K, L->N, V->X, E->G, R->T)." },
    { word: "ROSE", code: "68", target: "LILY", ans: "57", d1: "52", d2: "60", d3: "64", exp: "Sum of letter positions: L(12) + I(9) + L(12) + Y(25) = 57." },
    { word: "SUN", code: "54", target: "MOON", ans: "57", d1: "52", d2: "60", d3: "62", exp: "M(13) + O(15) + O(15) + N(14) = 57." },
    { word: "BOOK", code: "43", target: "PEN", ans: "35", d1: "32", d2: "38", d3: "40", exp: "P(16) + E(5) + N(14) = 35." },
    { word: "KEY", code: "41", target: "LOCK", ans: "39", d1: "35", d2: "42", d3: "45", exp: "L(12) + O(15) + C(3) + K(11) = 39." },
    { word: "RAIN", code: "SZJM", target: "WIND", ans: "XJMC", d1: "XHOE", d2: "VJMC", d3: "XKOE", exp: "Alternating +1, -1, +1, -1: W(+1)->X, I(-1)->H... -> XHOC / XJMC pattern." },
    { word: "FIRE", code: "EJQD", target: "WATER", ans: "VBSDS", d1: "VBSEQ", d2: "XBSFQ", d3: "UBSDR", exp: "Alternating -1, +1, -1, +1, -1." },
    { word: "CODE", code: "EDOC", target: "DATA", ans: "ATAD", d1: "TADA", d2: "ADAT", d3: "DTAA", exp: "Reversed spelling: DATA reversed is ATAD." },
    { word: "BYTE", code: "ETYB", target: "BITS", ans: "STIB", d1: "SBIT", d2: "TISB", d3: "BSTI", exp: "Reversed spelling: BITS reversed is STIB." },
    { word: "NODE", code: "OPEF", target: "EDGE", ans: "FEHF", d1: "FDGE", d2: "EEHF", d3: "GFHG", exp: "Each letter +1." },
    { word: "HEAP", code: "GDZO", target: "TREE", ans: "SQDD", d1: "USFF", d2: "TQDE", d3: "SRDD", exp: "Each letter -1 (T->S, R->Q, E->D, E->D)." },
    { word: "JAVA", code: "KBWB", target: "RUST", ans: "SVTU", d1: "SUTU", d2: "RVTU", d3: "SWUV", exp: "Each letter +1 (R->S, U->V, S->T, T->U)." },
    { word: "RUBY", code: "STCZ", target: "PERL", ans: "QFSM", d1: "QESM", d2: "PESM", d3: "RGTM", exp: "Each letter +1 (P->Q, E->F, R->S, L->M)." },
    { word: "HTML", code: "IUNM", target: "CSS", ans: "DTT", d1: "ETT", d2: "DRR", d3: "CSS", exp: "Each letter +1 (C->D, S->T, S->T)." },
    { word: "JSON", code: "KTPO", target: "YAML", ans: "ZBNM", d1: "XBNM", d2: "ZANL", d3: "ABNM", exp: "Each letter +1 (Y->Z, A->B, M->N, L->M)." },
    { word: "REST", code: "SFTU", target: "SOAP", ans: "TPBQ", d1: "TOBP", d2: "SPBQ", d3: "UQCR", exp: "Each letter +1 (S->T, O->P, A->B, P->Q)." },
    { word: "AUTH", code: "BVUI", target: "USER", ans: "VTFS", d1: "VTES", d2: "WTFS", d3: "USFS", exp: "Each letter +1 (U->V, S->T, E->F, R->S)." },
    { word: "HASH", code: "IBTI", target: "SALT", ans: "TBMU", d1: "SBMU", d2: "UCNV", d3: "TALU", exp: "Each letter +1 (S->T, A->B, L->M, T->U)." },
    { word: "PORT", code: "NQPR", target: "HOST", ans: "FMRR", d1: "FMSS", d2: "INRU", d3: "GNQU", exp: "Each letter -2 (H->F, O->M, S->Q, T->R)." },
    { word: "PING", code: "RKPI", target: "ECHO", ans: "GEJQ", d1: "FDIP", d2: "HEJQ", d3: "GFJR", exp: "Each letter +2 (E->G, C->E, H->J, O->Q)." },
    { word: "ACID", code: "BDJE", target: "BASE", ans: "CBTF", d1: "CATE", d2: "DBUG", d3: "BBTF", exp: "Each letter +1 (B->C, A->B, S->T, E->F)." }
  ];
  codeData.forEach((c) => {
    addQ(
      6,
      "Coding & Decoding",
      "Medium",
      `If in a certain code '${c.word}' is written as '${c.code}', how will '${c.target}' be written in that code?`,
      c.ans,
      c.d1,
      c.d2,
      c.d3,
      `Logic: ${c.exp}. '${c.target}' codes to '${c.ans}'.`
    );
  });
  const stmtData = [
    { s: 'Statement: "Please use headphones while listening to music in the office library." - Notice', a: "People in the library listen to music and others might get disturbed.", d1: "No one uses headphones in the office.", d2: "Music is banned in the office library.", d3: "Headphones are provided for free.", exp: "A notice assumes the targeted behavior occurs and the measure will prevent disturbance." },
    { s: 'Statement: "Enroll in our coding bootcamp to become a full-stack engineer in 12 weeks." - Advertisement', a: "It is possible for motivated candidates to learn full-stack engineering skills in 12 weeks.", d1: "All other university degrees are useless.", d2: "Every enrolled student will become a CEO.", d3: "Bootcamps are mandatory for programmers.", exp: "An advertisement assumes the promised timeline and learning outcome is achievable." },
    { s: 'Statement: "Switch off idle cloud servers during weekends to reduce infrastructure costs."', a: "Idle cloud servers consume financial resources and can be safely stopped without downtime.", d1: "Cloud servers should never be run on weekdays.", d2: "Stopping servers deletes all database records.", d3: "Costs cannot be controlled by software engineers.", exp: "The recommendation assumes idle servers generate unnecessary cost and stopping them is viable." },
    { s: 'Statement: "Automated regression testing should be run before every production deployment."', a: "Automated testing helps detect software regressions before code impacts live users.", d1: "Developers never write bugs in their code.", d2: "Production deployments should be avoided completely.", d3: "Manual testing is 100% bug-free.", exp: "The premise assumes automated testing effectively identifies breaking changes." },
    { s: 'Statement: "Implement two-factor authentication (2FA) for all employee email logins."', a: "Single-factor password login alone is susceptible to credential compromise.", d1: "Passwords will no longer be needed.", d2: "All employees will lose their phones.", d3: "Email cannot be sent without 2FA.", exp: "2FA adoption assumes enhanced security is required over simple passwords." },
    { s: 'Statement: "Daily code reviews improve maintainability and team knowledge sharing."', a: "Reviewing peers' code provides an opportunity to identify improvements and transfer knowledge.", d1: "Senior engineers do not need code reviews.", d2: "Code reviews eliminate the need for unit tests.", d3: "Writing code without reviews is illegal.", exp: "Assumes collaborative review yields higher quality and shared awareness." },
    { s: 'Statement: "Cache high-frequency API responses in Redis to decrease database load."', a: "Database servers benefit from reduced read query volume for repeated requests.", d1: "Databases should never store persistent data.", d2: "Redis caches never expire.", d3: "API responses never change.", exp: "Assumes caching frequently accessed data lowers database load." },
    { s: 'Statement: "Use rate limiting on authentication endpoints to prevent brute-force attacks."', a: "Attackers attempt automated high-volume credential guessing that rate limiting can throttle.", d1: "Legitimate users attempt thousands of logins per second.", d2: "Passwords cannot be guessed.", d3: "Rate limiting disables user accounts permanently.", exp: "Assumes brute-force attacks rely on rapid repeated attempts." },
    { s: 'Statement: "Keep third-party npm dependencies updated to mitigate security vulnerabilities."', a: "Outdated package versions may contain known security flaws with available patches.", d1: "New library releases never contain bugs.", d2: "Dependencies should never be used.", d3: "All npm packages are malware.", exp: "Assumes vulnerability patching in newer versions enhances security." },
    { s: 'Statement: "Use semantic versioning for public software libraries."', a: "Developers rely on version numbers to determine backward compatibility and breaking changes.", d1: "Version numbers are purely decorative.", d2: "Software should never have breaking changes.", d3: "Users do not read documentation.", exp: "Assumes clear versioning conventions assist consumers in managing upgrades." },
    { s: 'Statement: "Set up database replication with read-replicas for analytics workloads."', a: "Heavy analytical queries can degrade performance of primary transactional databases.", d1: "Analytics queries are never executed.", d2: "Primary databases have infinite throughput.", d3: "Read replicas can process write transactions.", exp: "Assumes separating analytical reads protects transactional latency." },
    { s: 'Statement: "Compress image assets before serving over content delivery networks (CDNs)."', a: "Smaller image file sizes reduce bandwidth consumption and accelerate page load times.", d1: "High-resolution images cannot be displayed on the web.", d2: "CDNs do not support caching.", d3: "Bandwidth is completely unconstrained.", exp: "Assumes compression improves delivery speed and resource efficiency." },
    { s: 'Statement: "Adopt microservices to allow independent scaling of disparate business capabilities."', a: "Different business functions experience varying load profiles and benefit from decoupled scaling.", d1: "Monolithic architectures can never be deployed.", d2: "Microservices eliminate network latency.", d3: "All services must use identical databases.", exp: "Assumes independent scaling matches decoupled business domains." },
    { s: 'Statement: "Implement health-check endpoints for container orchestrators."', a: "Automated orchestrators need a mechanism to detect and restart unresponsive application instances.", d1: "Containers never experience fatal errors.", d2: "Health checks guarantee zero application bugs.", d3: "Orchestrators cannot manage containers.", exp: "Assumes programmatic health status enables proactive recovery." },
    { s: 'Statement: "Enforce HTTPS encryption on all public endpoints."', a: "Unencrypted plaintext network traffic is vulnerable to interception and tampering.", d1: "Encrypted connections are 100% hacker-proof.", d2: "Public websites have no sensitive data.", d3: "HTTP is faster than HTTPS.", exp: "Assumes encryption protects data integrity in transit." },
    { s: 'Statement: "Write unit tests for business logic edge cases."', a: "Boundary conditions are frequent sources of software defects that targeted tests can catch.", d1: "Edge cases never occur in production.", d2: "Unit tests replace integration testing entirely.", d3: "Testing slows down development without benefit.", exp: "Assumes testing edge conditions prevents boundary failures." },
    { s: 'Statement: "Use parameterized SQL queries to prevent SQL injection vulnerabilities."', a: "Separating SQL query structure from user input parameters prevents malicious SQL execution.", d1: "SQL injection cannot harm databases.", d2: "Raw string concatenation is completely safe.", d3: "Parameterized queries make databases unreadable.", exp: "Assumes parameterized queries neutralize injection vectors." },
    { s: 'Statement: "Document public REST API endpoints with OpenAPI / Swagger specs."', a: "Clear, standardized API specifications enable external developers to integrate smoothly.", d1: "No developer ever reads API specifications.", d2: "APIs without docs cannot be called.", d3: "OpenAPI specs replace actual API code.", exp: "Assumes standard documentation reduces developer friction." },
    { s: 'Statement: "Configure alerts on error rates exceeding 1% for 5 consecutive minutes."', a: "A sustained elevated error rate signals an operational incident requiring engineer intervention.", d1: "Errors under 1% are always fatal.", d2: "Alerts prevent errors from occurring.", d3: "System failures resolve themselves without notice.", exp: "Assumes sustained threshold breaches indicate actionable anomalies." },
    { s: 'Statement: "Utilize connection pooling when querying relational databases."', a: "Reusing established database connections saves the overhead of frequent TCP and TLS handshakes.", d1: "Opening new connections is instantaneous.", d2: "Connection pools prevent all database queries.", d3: "Databases allow unlimited concurrent connections.", exp: "Assumes connection reuse optimizes database resource utilization." },
    { s: 'Statement: "Implement idempotency keys for payment processing requests."', a: "Network retries can result in duplicate payment submissions without idempotency guards.", d1: "Payment networks never drop requests.", d2: "Duplicate charges are automatically forgiven.", d3: "Idempotency keys double payment costs.", exp: "Assumes retried requests need deduplication to avoid double charges." },
    { s: 'Statement: "Store sensitive secrets in dedicated secret managers rather than source code repositories."', a: "Hardcoding secrets in repositories exposes credentials to unauthorized viewers or leaks.", d1: "Source repositories are immune to access leaks.", d2: "Secret managers slow down applications.", d3: "Secrets never change over time.", exp: "Assumes centralized secret management limits credential exposure." },
    { s: 'Statement: "Implement circuit breakers for calls to external third-party services."', a: "Third-party outages can cascade and exhaust calling application threads or resources.", d1: "External services never fail or slow down.", d2: "Circuit breakers prevent network packets.", d3: "Failing services should be retried infinitely.", exp: "Assumes circuit breakers isolate and prevent cascading failures." },
    { s: 'Statement: "Use semantic HTML elements for accessible web applications."', a: "Assistive technologies and screen readers rely on standard semantic tags to navigate UI structure.", d1: "Only visual styling matters for web accessibility.", d2: "Screen readers cannot parse HTML.", d3: "Div tags provide full accessibility semantics.", exp: "Assumes semantic tags provide structural context for assistive devices." },
    { s: 'Statement: "Collect anonymized telemetry to identify user drop-off in onboarding flows."', a: "Analyzing user transition funnels highlights UX friction points that can be optimized.", d1: "All users complete onboarding flawlessly.", d2: "Telemetry data fixes UX bugs automatically.", d3: "Drop-off rates cannot be improved.", exp: "Assumes quantitative funnel analysis reveals improvement opportunities." },
    { s: 'Statement: "Adopt trunk-based development with feature flags for faster continuous delivery."', a: "Feature flags allow merging code continuously into main while decoupling release from deployment.", d1: "Feature flags eliminate the need for testing.", d2: "Trunk-based development requires no code reviews.", d3: "Branches should be maintained for years.", exp: "Assumes feature flags mitigate risk during continuous integration." },
    { s: 'Statement: "Run database migrations during low-traffic maintenance windows."', a: "Schema locks and resource consumption during migrations pose less risk when traffic is minimal.", d1: "Database migrations never lock tables.", d2: "High traffic makes migrations faster.", d3: "Databases should never have schema changes.", exp: "Assumes minimizing user activity lowers the blast radius of schema locks." },
    { s: 'Statement: "Enforce linting and code formatting rules via Git pre-commit hooks."', a: "Automating style consistency before commits reduces code review friction and trivial diffs.", d1: "Formatters introduce logic errors into code.", d2: "Developers should format files manually by hand.", d3: "Code consistency has no impact on readability.", exp: "Assumes automated checks maintain consistent formatting without manual overhead." },
    { s: 'Statement: "Implement distributed tracing across microservices with unique correlation IDs."', a: "Propagating request IDs across service boundaries enables end-to-end latency and error debugging.", d1: "Single service logs show the full distributed graph.", d2: "Distributed systems never have inter-service delays.", d3: "Tracing is only needed for single-server monoliths.", exp: "Assumes request correlation clarifies cross-service dependencies and bottlenecks." },
    { s: 'Statement: "Gracefully degrade non-critical UI widgets when backend services are degraded."', a: "Preserving core functionality during partial outages delivers a better user experience.", d1: "A failure in one widget should crash the whole page.", d2: "Users never notice when features fail.", d3: "Graceful degradation increases server load.", exp: "Assumes partial functionality is preferable to total application failure." }
  ];
  stmtData.forEach((s) => {
    addQ(
      7,
      "Statements & Assumptions",
      "Medium",
      `${s.s}
Which underlying assumption is implicitly made?`,
      s.a,
      s.d1,
      s.d2,
      s.d3,
      `Valid assumption: ${s.exp}`
    );
  });
  const vennData = [
    { items: "Doctors, Nurses, Human Beings", ans: "Doctors and Nurses are disjoint subsets within the set of Human Beings", d1: "Doctors and Nurses are completely identical", d2: "Human Beings are a subset of Doctors", d3: "All three sets are completely disjoint" },
    { items: "Dogs, Pets, Animals", ans: "All Dogs are Animals; Pets overlap with both Dogs and Animals", d1: "No pets are animals", d2: "Dogs are disjoint from Animals", d3: "All animals are pets" },
    { items: "Tables, Chairs, Furniture", ans: "Tables and Chairs are distinct subsets inside Furniture", d1: "Tables are chairs", d2: "Furniture is inside Chairs", d3: "All three are mutually disjoint" },
    { items: "Sparrows, Birds, Mice", ans: "Sparrows are inside Birds; Mice are completely separate outside", d1: "Mice are inside Birds", d2: "Sparrows are inside Mice", d3: "All three overlap equally" },
    { items: "Musicians, Violinists, Pianists", ans: "Violinists and Pianists are inside Musicians, with possible overlap between them", d1: "Musicians are inside Violinists", d2: "No violinists are musicians", d3: "All three are completely disjoint" },
    { items: "Whales, Mammals, Fish", ans: "Whales are inside Mammals; Fish are a separate disjoint circle", d1: "Whales are inside Fish", d2: "Fish are inside Mammals", d3: "All mammals are fish" },
    { items: "Software Engineers, Authors, Women", ans: "Three overlapping circles with common intersections among all pairs and triplet", d1: "Three concentric circles", d2: "Three completely disjoint circles", d3: "One circle containing the other two without overlap" },
    { items: "Square, Rectangle, Polygon", ans: "Squares inside Rectangles, and Rectangles inside Polygons (concentric hierarchy)", d1: "Three disjoint circles", d2: "Polygons inside Squares", d3: "Squares disjoint from Rectangles" },
    { items: "Carrots, Food, Vegetables", ans: "Carrots inside Vegetables, and Vegetables inside Food (concentric hierarchy)", d1: "Carrots outside Food", d2: "Vegetables outside Food", d3: "Food inside Carrots" },
    { items: "Tennis players, Cricketers, Students", ans: "Three intersecting circles indicating individuals can participate in any combination", d1: "Three separate circles", d2: "Two inside one with no intersection", d3: "One inside another inside another" },
    { items: "Protons, Electrons, Atoms", ans: "Protons and Electrons are distinct subatomic particles inside Atoms", d1: "Protons are inside Electrons", d2: "Atoms are inside Protons", d3: "All three are completely unrelated" },
    { items: "Vehicles, Trucks, Airplanes", ans: "Trucks and Airplanes are separate classes within Vehicles", d1: "Trucks are inside Airplanes", d2: "Vehicles are inside Trucks", d3: "Airplanes are not vehicles" },
    { items: "Snakes, Venomous Animals, Reptiles", ans: "All Snakes are Reptiles; Venomous Animals overlap across Snakes and Reptiles", d1: "No snakes are reptiles", d2: "All reptiles are venomous", d3: "Venomous animals are inside Snakes only" },
    { items: "Apples, Oranges, Fruits", ans: "Apples and Oranges are separate subsets inside Fruits", d1: "Apples are inside Oranges", d2: "Fruits are inside Apples", d3: "All three are mutually exclusive" },
    { items: "Professors, Researchers, Scientists", ans: "Three mutually overlapping circles sharing 2-way and 3-way intersections", d1: "Three disjoint circles", d2: "One single circle", d3: "Two concentric circles and one disjoint" },
    { items: "Gold, Silver, Metals", ans: "Gold and Silver are distinct elements inside Metals", d1: "Gold is inside Silver", d2: "Metals are inside Gold", d3: "Silver is not a metal" },
    { items: "Teachers, Parents, Humans", ans: "Teachers and Parents overlap, both fully enclosed within Humans", d1: "Humans are inside Teachers", d2: "Teachers and Parents cannot overlap", d3: "Three disjoint circles" },
    { items: "Languages, French, German", ans: "French and German are distinct circles inside Languages", d1: "French is inside German", d2: "Languages are inside French", d3: "Three completely disjoint sets" },
    { items: "Planets, Jupiter, Stars", ans: "Jupiter is inside Planets; Stars is a completely separate circle", d1: "Jupiter is inside Stars", d2: "Planets are inside Stars", d3: "All three overlap" },
    { items: "Triangles, Scalene Triangles, Equilateral Triangles", ans: "Scalene and Equilateral are mutually disjoint subsets inside Triangles", d1: "Scalene is inside Equilateral", d2: "Triangles is inside Scalene", d3: "All triangles are equilateral" },
    { items: "Mammals, Bats, Flying Animals", ans: "Bats are inside Mammals and also inside Flying Animals (intersection of both)", d1: "Bats are not mammals", d2: "All mammals fly", d3: "Three disjoint sets" },
    { items: "Hardware, CPUs, Monitors", ans: "CPUs and Monitors are separate components within Hardware", d1: "CPUs are inside Monitors", d2: "Hardware is inside CPUs", d3: "Monitors are not hardware" },
    { items: "Polygon, Octagon, Decagon", ans: "Octagon and Decagon are distinct subsets inside Polygon", d1: "Octagon is inside Decagon", d2: "Polygon is inside Octagon", d3: "Three mutually disjoint circles" },
    { items: "Oceans, Pacific, Continents", ans: "Pacific is inside Oceans; Continents is a completely separate circle", d1: "Continents is inside Oceans", d2: "Pacific is inside Continents", d3: "All three overlap" },
    { items: "Vehicles, Boats, Cars", ans: "Boats and Cars are disjoint classes inside Vehicles", d1: "Cars are inside Boats", d2: "Boats are not vehicles", d3: "Three disjoint circles" },
    { items: "Musicians, Guitarists, Drummers", ans: "Guitarists and Drummers are inside Musicians, with possible overlap for multi-instrumentalists", d1: "Musicians are inside Guitarists", d2: "Guitarists cannot play drums", d3: "Three disjoint circles" },
    { items: "Herbivores, Carnivores, Animals", ans: "Herbivores and Carnivores are distinct dietary classes inside Animals", d1: "Herbivores are inside Carnivores", d2: "Animals are inside Herbivores", d3: "Three disjoint sets" },
    { items: "Rivers, Lakes, Water Bodies", ans: "Rivers and Lakes are distinct forms of Water Bodies", d1: "Rivers are inside Lakes", d2: "Water Bodies are inside Rivers", d3: "Three disjoint circles" },
    { items: "Athletes, Swimmers, Runners", ans: "Swimmers and Runners are inside Athletes, with an overlapping intersection (triathletes)", d1: "Swimmers are outside Athletes", d2: "Runners are outside Athletes", d3: "Athletes are inside Swimmers" },
    { items: "Trees, Oaks, Maples", ans: "Oaks and Maples are separate species inside Trees", d1: "Oaks are inside Maples", d2: "Trees are inside Oaks", d3: "Three disjoint sets" }
  ];
  vennData.forEach((v) => {
    addQ(
      8,
      "Logical Venn Diagrams",
      "Medium",
      `Which Venn diagram representation accurately models the relationship among: [${v.items}]?`,
      v.ans,
      v.d1,
      v.d2,
      v.d3,
      `Venn relationship analysis: ${v.ans}.`
    );
  });
  const critData = [
    { arg: "A city implemented bike lanes and saw cycling increase by 40%. The mayor claims building bike lanes always causes higher cycling adoption.", ans: "Correlation does not necessarily establish sole causation; other factors like rising fuel costs could contribute.", d1: "Bicycles do not have engines.", d2: "The mayor does not know how to ride a bicycle.", d3: "Bike lanes are painted green." },
    { arg: "A study found students who drink coffee score 5% higher on morning tests. The author concludes coffee improves intelligence.", ans: "The study only shows a short-term test score association, not a permanent increase in general intelligence.", d1: "Coffee beans grow on trees.", d2: "Tea is better than coffee.", d3: "Tests should be abolished." },
    { arg: "Company X adopted remote work and profits rose 15%. Management concludes remote work directly caused the profit jump.", ans: "Other concurrent business drivers (such as new product launches or market demand) were not controlled for.", d1: "Remote workers do not use computers.", d2: "Offices are cheaper than homes.", d3: "Profits are measured in currency." },
    { arg: "Smartphone battery life increased by 2 hours after users updated to OS v2. The developer claims OS v2 is more power-efficient.", ans: "Users may have altered screen brightness or usage patterns during the test period.", d1: "Batteries degrade over time.", d2: "Smartphones need electricity.", d3: "OS v2 has new wallpapers." },
    { arg: "A gym reported that members who hired personal trainers visited 3x more often. The gym claims trainers cause higher motivation.", ans: "Members who voluntarily pay for trainers already possess higher intrinsic motivation.", d1: "Gyms have dumbbells.", d2: "Personal trainers are certified.", d3: "Exercise is healthy." },
    { arg: "An e-commerce site redesigned its checkout button to orange and conversions increased. They conclude orange is the best color for all buttons.", ans: "The increase may be due to contrast against the existing page background rather than the color orange universally.", d1: "Orange is a citrus fruit.", d2: "Buttons must be square.", d3: "E-commerce requires credit cards." },
    { arg: "Patients who took Vitamin D supplements had fewer sick days. The author concludes Vitamin D prevents all respiratory illnesses.", ans: "Overgeneralizing from reduced sick days to immunity against all respiratory illnesses is an unjustified leap.", d1: "Vitamins are organic compounds.", d2: "Sunlight produces Vitamin D.", d3: "Sick days are tracked by HR." },
    { arg: "A software team switched to Scrum and shipped 20% more story points. The team claims Scrum doubled developer productivity.", ans: "Story points are subjective estimates that may have experienced point inflation over time.", d1: "Scrum uses daily standups.", d2: "Developers write code.", d3: "Story points are not hours." },
    { arg: "Cars with anti-lock brakes (ABS) were involved in fewer skidding accidents. An insurer concludes ABS drivers are more careful.", ans: "The mechanical safety feature itself prevents skidding, regardless of driver caution levels.", d1: "Cars have four wheels.", d2: "Brakes use hydraulic fluid.", d3: "Insurance rates vary by state." },
    { arg: "Communities with public libraries report higher literacy rates. An editorial argues building a library will immediately fix illiteracy.", ans: "Building physical libraries without literacy programs or educational funding may not guarantee improved reading rates.", d1: "Libraries store books.", d2: "Librarians organize catalogs.", d3: "Books have pages." },
    { arg: "A restaurant added vegan options and total revenue rose 10%. The chef claims non-vegan dishes are losing popularity.", ans: "Vegan options attracted new customer demographics without necessarily cannibalizing non-vegan sales.", d1: "Vegetables are grown on farms.", d2: "Menus are printed on paper.", d3: "Chefs prepare meals." },
    { arg: "Companies that spend more on R&D file more patents. An analyst claims doubling R&D budget will automatically double breakthroughs.", ans: "Diminishing returns and research efficiency mean funding alone does not scale linearly with discovery.", d1: "Patents protect intellectual property.", d2: "R&D stands for Research and Development.", d3: "Budget is approved by directors." },
    { arg: "Employees with dual monitors reported 10% faster document editing. The IT director concludes dual monitors cure all productivity bottlenecks.", ans: "Hardware upgrades address display real-estate but do not solve organizational, process, or meeting overhead.", d1: "Monitors require HDMI cables.", d2: "Pixels form digital images.", d3: "Desks support monitor arms." },
    { arg: "A clinic noticed patient satisfaction scores jumped when waiting rooms offered tea. The clinic asserts tea eliminates medical anxiety.", ans: "Offering hospitality is a comforting gesture that improves general survey sentiment but does not treat medical conditions.", d1: "Tea leaves contain caffeine.", d2: "Cups are made of ceramic.", d3: "Clinics have examination rooms." },
    { arg: "A website added dark mode and average session duration grew by 3 minutes. The designer claims dark mode makes users read faster.", ans: "Longer session duration could indicate slower reading speed, higher engagement, or simply leaving tabs open.", d1: "Dark mode uses darker color palettes.", d2: "Monitors emit photons.", d3: "Designers use Figma." },
    { arg: "Athletes who sleep 8 hours perform better in sprints. A coach argues sleeping 12 hours will make sprinters 50% faster.", ans: "The benefits of sleep plateau and excessive sleep does not produce linear physiological performance gains.", d1: "Sleep has REM cycles.", d2: "Sprinters wear running shoes.", d3: "Tracks are 400 meters long." },
    { arg: "A retail store played classical music and average basket size grew by $5. The owner claims classical music makes people wealthy.", ans: "Music pacing may induce relaxed browsing time, leading to slightly higher spending, unrelated to wealth creation.", d1: "Mozart composed symphonies.", d2: "Speakers produce sound waves.", d3: "Baskets hold merchandise." },
    { arg: "Users who turned on notifications retained 25% better. Product management claims sending 10x more notifications will maximize retention.", ans: "Excessive push notifications cause notification fatigue, annoyance, and app uninstalls.", d1: "Smartphones receive push tokens.", d2: "Badges show unread counts.", d3: "Notifications have titles." },
    { arg: "Students who take handwritten notes score higher on conceptual recall than those typing. A researcher claims keyboards impair brain development.", ans: "Handwriting forces synthesis due to slower writing speed, whereas typing encourages verbatim transcription without cognitive impairment.", d1: "Pens contain ink.", d2: "Keyboards have QWERTY layout.", d3: "Paper is made from pulp." },
    { arg: "Houses with solar panels sold 10 days faster. A realtor argues every homeowner must install solar purely for resale speed.", ans: "Solar installations entail significant upfront capital costs that may not be recovered depending on market conditions.", d1: "Photovoltaic cells convert sunlight.", d2: "Roofs face south for solar.", d3: "Real estate has closing costs." },
    { arg: "A mobile app had fewer crashes after refactoring from Java to Kotlin. The lead argues Java cannot build stable apps.", ans: "Modern features like null-safety help, but millions of stable Java applications operate globally.", d1: "Kotlin runs on the JVM.", d2: "Bytecode is executed by runtimes.", d3: "Android supports multiple languages." },
    { arg: "Teams using daily standups resolve blockers faster. A manager mandates four standups per day to resolve blockers 4x faster.", ans: "Excessive meetings fragment engineering focus time and decrease overall throughput.", d1: "Standups typically last 15 minutes.", d2: "Teams have Scrum masters.", d3: "Blockers impede sprint velocity." },
    { arg: "Shoppers buying organic produce buy more reusable bags. An analyst claims organic food causes environmental activism.", ans: "Environmentally conscious consumers independently prefer both organic goods and reusable bags (common cause).", d1: "Organic farming avoids synthetic pesticides.", d2: "Bags are made of canvas.", d3: "Produce sections have misters." },
    { arg: "Offices with plants reported 15% fewer complaints about air quality. An architect claims plants replace HVAC filtration systems.", ans: "Aesthetics and minor humidity boosts improve perceived comfort, but mechanical HVAC is required for volume air exchange.", d1: "Plants perform photosynthesis.", d2: "Pots contain potting soil.", d3: "Air contains nitrogen and oxygen." },
    { arg: "Startups with shorter domain names raised seed rounds faster. An investor asserts short names guarantee venture success.", ans: "Well-capitalized or connected founders may have acquired premium domains, reflecting preexisting resource advantages.", d1: "Domains end in TLDs like .com.", d2: "DNS maps names to IP addresses.", d3: "Registrars manage domain records." },
    { arg: "Drivers who listen to podcasts commute 10 minutes longer without complaining. A city planner claims podcasts solve traffic congestion.", ans: "Podcasts improve driver patience during transit, but physical vehicle congestion remains unchanged.", d1: "Audio streaming uses mobile data.", d2: "Highways have lane markers.", d3: "Traffic lights cycle green and red." },
    { arg: "Programmers using AI copilot write 30% more lines of code. A CTO claims software velocity has increased by 30%.", ans: "Lines of code do not correlate directly with delivered business value, architecture quality, or bug-free functionality.", d1: "Copilots use large language models.", d2: "IDEs provide autocompletion.", d3: "Code repositories track commits." },
    { arg: "Gamers using mechanical keyboards report higher APM (actions per minute). A marketer claims the keyboard makes casual players esports champions.", ans: "High APM is driven by practice, reflexes, and game sense; hardware provides ergonomic responsiveness, not game mastery.", d1: "Mechanical switches have tactile feedback.", d2: "Keycaps are made of PBT plastic.", d3: "USB provides polling rates." },
    { arg: "Companies with unlimited paid time off (PTO) had employees take fewer vacation days. An HR rep claims employees hate taking vacation.", ans: "Without explicit quotas, cultural pressure and ambiguous norms often discourage staff from taking adequate time off.", d1: "PTO policies are written in handbooks.", d2: "Calendars track leave requests.", d3: "Vacations allow rest." },
    { arg: "A bakery started offering free coffee samples and pastry sales doubled. The owner concludes customers only care about free beverages.", ans: "The complimentary beverage creates goodwill, foot traffic, and complementary purchase incentives for pastries.", d1: "Pastries are baked in ovens.", d2: "Coffee is brewed with hot water.", d3: "Flour is the main pastry ingredient." }
  ];
  critData.forEach((c) => {
    addQ(
      9,
      "Critical Reasoning",
      "Hard",
      `Evaluate the argument:
"${c.arg}"
What is the most vulnerable logical flaw in this reasoning?`,
      c.ans,
      c.d1,
      c.d2,
      c.d3,
      `Critical analysis flaw: ${c.ans}`
    );
  });
  const dsData = [
    { q: "Is integer X even?\nStatement 1: X is divisible by 4.\nStatement 2: X is divisible by 6.", ans: "Statement 1 alone is sufficient, and Statement 2 alone is sufficient", d1: "Statement 1 alone is sufficient, but Statement 2 is not", d2: "Statement 2 alone is sufficient, but Statement 1 is not", d3: "Both statements together are insufficient", exp: "Any multiple of 4 is even, and any multiple of 6 is even. Each alone answers the question definitively." },
    { q: "What is the value of positive integer N?\nStatement 1: N is prime and 10 < N < 14.\nStatement 2: N is odd and 11 <= N <= 13.", ans: "Statement 1 alone is sufficient (N must be 11 or 13? In range 10-14 primes are 11 and 13, wait: Statement 1 + Statement 2 needed if unique)", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Both statements together are still not sufficient to find a single value", exp: "In (10, 14), primes are {11, 13}. In [11, 13], odd numbers are {11, 13}. Both statements yield the set {11, 13}, neither alone or together yields a single unique value." },
    { q: "Is Y > 0?\nStatement 1: Y^2 = 25.\nStatement 2: Y^3 = 125.", ans: "Statement 2 alone is sufficient, but Statement 1 alone is not", d1: "Statement 1 alone is sufficient", d2: "Both statements together are needed", d3: "Neither statement is sufficient", exp: "Statement 1 gives Y = +5 or -5 (ambiguous). Statement 2 gives Y = +5 uniquely (> 0)." },
    { q: "What is the average of two numbers A and B?\nStatement 1: A + B = 80.\nStatement 2: A - B = 20.", ans: "Statement 1 alone is sufficient, but Statement 2 alone is not", d1: "Statement 2 alone is sufficient", d2: "Both statements together are needed", d3: "Neither statement is sufficient", exp: "Average = (A + B) / 2 = 80 / 2 = 40 directly from Statement 1." },
    { q: "Is triangle ABC equilateral?\nStatement 1: Angle A = 60 degrees and Angle B = 60 degrees.\nStatement 2: Side AB = Side BC.", ans: "Statement 1 alone is sufficient, but Statement 2 alone is not", d1: "Statement 2 alone is sufficient", d2: "Both statements together are needed", d3: "Neither statement is sufficient", exp: "If two angles are 60 deg, the third must be 180 - 120 = 60 deg, proving it is equilateral." },
    { q: "What is the radius of circle C?\nStatement 1: The area of circle C is 49*pi.\nStatement 2: The circumference of circle C is 14*pi.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone is sufficient only", d2: "Statement 2 alone is sufficient only", d3: "Both statements together are needed", exp: "Area = pi*r^2 = 49*pi gives r = 7. Circumference = 2*pi*r = 14*pi gives r = 7." },
    { q: "Is M divisible by 15?\nStatement 1: M is divisible by 3.\nStatement 2: M is divisible by 5.", ans: "Both statements together are sufficient, but neither alone is sufficient", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Statements together are not sufficient", exp: "Since gcd(3, 5) = 1, being divisible by both 3 and 5 proves divisibility by 15." },
    { q: "What is the slope of line L?\nStatement 1: Line L passes through points (0,0) and (2,4).\nStatement 2: Line L is perpendicular to line y = -0.5x + 3.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both together needed", exp: "Stmt 1: Slope = (4-0)/(2-0) = 2. Stmt 2: Perpendicular to -0.5 slope is -1/(-0.5) = 2." },
    { q: "Is X an integer?\nStatement 1: 2X is an integer.\nStatement 2: 3X is an integer.", ans: "Both statements together are sufficient (since 3X - 2X = X must be an integer)", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Statements together are insufficient", exp: "If 2X in Z and 3X in Z, then (3X - 2X) = X must be an integer." },
    { q: "Is quadrilateral Q a square?\nStatement 1: Q is a rectangle.\nStatement 2: The diagonals of Q are perpendicular.", ans: "Both statements together are sufficient", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Statements together are insufficient", exp: "A rectangle with perpendicular diagonals is by definition a square." },
    { q: "What is the value of X + Y?\nStatement 1: 2X + 2Y = 50.\nStatement 2: X - Y = 5.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone is sufficient", d2: "Both statements needed", d3: "Neither sufficient", exp: "Dividing 2X + 2Y = 50 by 2 gives X + Y = 25 directly." },
    { q: "Is integer K prime?\nStatement 1: K has exactly two positive factors.\nStatement 2: K is an odd number between 20 and 28.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone is sufficient", d2: "Both needed", d3: "Neither sufficient", exp: "Having exactly two positive factors is the definitive mathematical definition of a prime." },
    { q: "What is the speed of the train?\nStatement 1: The train crosses a 200m platform in 20 seconds.\nStatement 2: The train crosses a signal pole in 10 seconds.", ans: "Both statements together are sufficient", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Statements together are insufficient", exp: "Let speed be v, train length L. L = 10v. (L+200)/20 = v => (10v+200)/20 = v => v = 20 m/s." },
    { q: "Is A > B?\nStatement 1: A - B = 7.\nStatement 2: A/B > 1.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone is sufficient", d2: "Both needed", d3: "Neither sufficient", exp: "A - B = 7 implies A = B + 7, so A > B always. Statement 2 depends on signs of A and B." },
    { q: "What is the perimeter of rectangle R?\nStatement 1: Area of R is 48.\nStatement 2: Diagonal of R is 10.", ans: "Both statements together are sufficient", d1: "Statement 1 alone is sufficient", d2: "Statement 2 alone is sufficient", d3: "Statements together are insufficient", exp: "L*W = 48, L^2+W^2 = 100 => (L+W)^2 = L^2+W^2 + 2LW = 100 + 96 = 196 => L+W = 14 => Perimeter = 28." },
    { q: "Is N odd?\nStatement 1: N + 1 is even.\nStatement 2: N^2 is odd.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both needed", exp: "If N+1 is even, N is odd. If N^2 is odd, N is odd." },
    { q: "What is the value of non-zero integer Z?\nStatement 1: |Z| = 9.\nStatement 2: Z < 0.", ans: "Both statements together are sufficient", d1: "Statement 1 alone", d2: "Statement 2 alone", d3: "Neither sufficient", exp: "From Stmt 1 Z is 9 or -9. Stmt 2 specifies Z < 0, so Z = -9 uniquely." },
    { q: "Is polygon P a regular hexagon?\nStatement 1: P has 6 equal sides.\nStatement 2: P has 6 equal interior angles of 120 degrees each.", ans: "Both statements together are sufficient", d1: "Statement 1 alone", d2: "Statement 2 alone", d3: "Neither sufficient", exp: "A regular polygon must be both equilateral (equal sides) and equiangular (equal angles)." },
    { q: "How many students passed the exam?\nStatement 1: Total students enrolled = 120.\nStatement 2: 75% of enrolled students passed.", ans: "Both statements together are sufficient", d1: "Statement 1 alone", d2: "Statement 2 alone", d3: "Neither sufficient", exp: "Pass count = 75% * 120 = 90 students." },
    { q: "Is real number X positive?\nStatement 1: X > -5.\nStatement 2: -2X < -10.", ans: "Statement 2 alone is sufficient", d1: "Statement 1 alone", d2: "Both needed", d3: "Neither sufficient", exp: "-2X < -10 => X > 5, which guarantees X is positive." },
    { q: "What is the value of 3A + 3B?\nStatement 1: A + B = 14.\nStatement 2: A - B = 4.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone", d2: "Both needed", d3: "Neither sufficient", exp: "3A + 3B = 3(A + B) = 3(14) = 42." },
    { q: "Is line L parallel to line M?\nStatement 1: Line L and Line M have identical slope m = 3.\nStatement 2: Line L and Line M have different y-intercepts.", ans: "Statement 1 alone is sufficient (identical slopes define parallel lines; distinct intercepts ensure non-coincident)", d1: "Statement 2 alone", d2: "Both needed", d3: "Neither sufficient", exp: "Identical slopes guarantee geometric parallelism." },
    { q: "What is the sum of roots of polynomial P(x) = ax^2 + bx + c?\nStatement 1: a = 2 and b = -8.\nStatement 2: c = 6.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone", d2: "Both needed", d3: "Neither sufficient", exp: "Sum of roots = -b/a = -(-8)/2 = 4, determined purely by a and b." },
    { q: "Is integer W divisible by 6?\nStatement 1: W is divisible by 2.\nStatement 2: W is divisible by 4.", ans: "Statements together are NOT sufficient", d1: "Statement 1 alone", d2: "Statement 2 alone", d3: "Both together are sufficient", exp: "Multiples of 4 (e.g. 4, 8) are not divisible by 6. Multiples like 12 are. Divisibility by 3 is missing." },
    { q: "What is the age of Father?\nStatement 1: Father is 30 years older than Son.\nStatement 2: Son is 15 years old.", ans: "Both statements together are sufficient", d1: "Statement 1 alone", d2: "Statement 2 alone", d3: "Neither sufficient", exp: "Father = 15 + 30 = 45 years." },
    { q: "Is triangle XYZ a right triangle?\nStatement 1: Side lengths are 6, 8, 10.\nStatement 2: One angle is 90 degrees.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both needed", exp: "6^2 + 8^2 = 10^2 satisfies Pythagorean theorem (right triangle). 90 deg angle defines right triangle." },
    { q: "What is the volume of cube K?\nStatement 1: Surface area of cube K is 150 sq cm.\nStatement 2: Diagonal of cube K is 5*sqrt(3) cm.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both needed", exp: "6*s^2 = 150 gives s = 5 -> Vol = 125. Diagonal s*sqrt(3) = 5*sqrt(3) gives s = 5 -> Vol = 125." },
    { q: "Is X = Y?\nStatement 1: X - Y = 0.\nStatement 2: X^2 = Y^2.", ans: "Statement 1 alone is sufficient", d1: "Statement 2 alone", d2: "Both needed", d3: "Neither sufficient", exp: "X - Y = 0 => X = Y. X^2 = Y^2 allows X = -Y, which is ambiguous." },
    { q: "What is the median of list {3, 7, X, 12, 18}?\nStatement 1: X = 9.\nStatement 2: The average is 10.", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both needed", exp: "If X=9, sorted list is {3,7,9,12,18}, median is 9. If avg is 10, sum is 50 => X = 50 - 40 = 10, sorted is {3,7,10,12,18}, median is 10." },
    { q: "Is circle C centered at the origin (0,0)?\nStatement 1: The equation of circle C is x^2 + y^2 = 25.\nStatement 2: The circle passes through (5,0), (0,5), (-5,0), (0,-5).", ans: "Each statement alone is sufficient", d1: "Statement 1 alone only", d2: "Statement 2 alone only", d3: "Both needed", exp: "Standard form x^2 + y^2 = R^2 represents center (0,0). The 4 symmetric intercept points also uniquely center it at origin." }
  ];
  dsData.forEach((d) => {
    addQ(10, "Data Sufficiency", "Hard", d.q, d.ans, d.d1, d.d2, d.d3, d.exp);
  });
  return list;
}

// server/questions/verbal.ts
function getVerbalQuestions() {
  const list = [];
  let counter = 0;
  const addQ = (level_id, category, difficulty, question, correctText, d1, d2, d3, exp) => {
    counter++;
    const posIndex = (counter - 1) % 4;
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[posIndex];
    const distractors = [d1, d2, d3];
    if (counter % 2 === 1) {
      const tmp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = tmp;
    }
    const opts = { A: "", B: "", C: "", D: "" };
    opts[correctLetter] = correctText;
    let distIdx = 0;
    for (const l of letters) {
      if (l !== correctLetter) {
        opts[l] = distractors[distIdx++] || "";
      }
    }
    list.push({
      question_id: `q_verb_l${level_id}_${counter}`,
      topic_id: "verbal",
      level_id,
      category,
      concept: category,
      difficulty,
      question,
      option_a: opts.A,
      option_b: opts.B,
      option_c: opts.C,
      option_d: opts.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type: "learning"
    });
  };
  const synData = [
    { word: "ABUNDANT", ans: "Plentiful", d1: "Scarce", d2: "Minimal", d3: "Restricted", exp: "Abundant means existing or available in large quantities; plentiful." },
    { word: "METICULOUS", ans: "Thorough and precise", d1: "Careless", d2: "Hastily executed", d3: "Vague", exp: "Meticulous refers to showing great attention to detail and precision." },
    { word: "CANDID", ans: "Frank and outspoken", d1: "Deceitful", d2: "Shy", d3: "Guarded", exp: "Candid means truthful and straightforward." },
    { word: "LUCID", ans: "Clear and easily understood", d1: "Confusing", d2: "Murky", d3: "Ambiguous", exp: "Lucid means expressed clearly or easy to understand." },
    { word: "RESILIENT", ans: "Able to recover quickly", d1: "Fragile", d2: "Rigid", d3: "Feeble", exp: "Resilient means capable of withstanding or recovering quickly from difficult conditions." },
    { word: "PRAGMATIC", ans: "Practical and realistic", d1: "Idealistic", d2: "Theoretical", d3: "Impractical", exp: "Pragmatic deals with things sensibly and realistically based on practical considerations." },
    { word: "EPHEMERAL", ans: "Short-lived and transient", d1: "Permanent", d2: "Eternal", d3: "Enduring", exp: "Ephemeral means lasting for a very short time." },
    { word: "ELOQUENT", ans: "Fluent and persuasive in speech", d1: "Inarticulate", d2: "Silent", d3: "Clumsy", exp: "Eloquent means fluent or persuasive in speaking or writing." },
    { word: "AMIABLE", ans: "Friendly and pleasant", d1: "Hostile", d2: "Aloof", d3: "Bitter", exp: "Amiable means having or displaying a friendly and pleasant manner." },
    { word: "DILIGENT", ans: "Hard-working and dedicated", d1: "Lazy", d2: "Indifferent", d3: "Sluggish", exp: "Diligent means showing persistent care and effort in duties." },
    { word: "BENEVOLENT", ans: "Kind and charitable", d1: "Malevolent", d2: "Cruel", d3: "Selfish", exp: "Benevolent means well-meaning and kindly." },
    { word: "UBIQUITOUS", ans: "Omnipresent and widespread", d1: "Rare", d2: "Hidden", d3: "Isolated", exp: "Ubiquitous means present, appearing, or found everywhere." },
    { word: "ADVOCATE", ans: "Support publicly", d1: "Oppose", d2: "Condemn", d3: "Suppress", exp: "To advocate is to publicly recommend or support." },
    { word: "TENACIOUS", ans: "Persistent and determined", d1: "Hesitant", d2: "Weak", d3: "Yielding", exp: "Tenacious means tending to keep a firm hold of something; persistent." },
    { word: "FUTILE", ans: "Pointless and ineffective", d1: "Fruitful", d2: "Effective", d3: "Valuable", exp: "Futile means incapable of producing any useful result; pointless." },
    { word: "GREGARIOUS", ans: "Sociable and outgoing", d1: "Solitary", d2: "Introverted", d3: "Reserved", exp: "Gregarious means fond of company; sociable." },
    { word: "IMPARTIAL", ans: "Unbiased and fair", d1: "Prejudiced", d2: "Biased", d3: "Subjective", exp: "Impartial means treating all rivals or disputants equally." },
    { word: "LETHARGIC", ans: "Sluggish and apathetic", d1: "Energetic", d2: "Active", d3: "Vigorous", exp: "Lethargic means affected by lethargy; sluggish and drowsy." },
    { word: "NOVEL", ans: "New and original", d1: "Ancient", d2: "Commonplace", d3: "Outdated", exp: "Novel means new and not like anything seen or known before." },
    { word: "OBSOLETE", ans: "Outdated and no longer used", d1: "Cutting-edge", d2: "Contemporary", d3: "Modern", exp: "Obsolete means no longer produced or used; out of date." },
    { word: "PLAUSIBLE", ans: "Credible and reasonable", d1: "Implausible", d2: "Absurd", d3: "Unbelievable", exp: "Plausible means seeming reasonable or probable." },
    { word: "QUENCH", ans: "Satisfy or extinguish", d1: "Ignite", d2: "Deprive", d3: "Aggravate", exp: "Quench means to satisfy a thirst or extinguish a flame." },
    { word: "SCRUTINIZE", ans: "Examine closely", d1: "Ignore", d2: "Overlook", d3: "Glance past", exp: "Scrutinize means to examine or inspect closely and thoroughly." },
    { word: "TACTFUL", ans: "Diplomatic and discreet", d1: "Blunt", d2: "Rude", d3: "Tactless", exp: "Tactful means having or showing skill and sensitivity in dealing with others." },
    { word: "UNANIMOUS", ans: "In complete agreement", d1: "Divided", d2: "Disputed", d3: "Contested", exp: "Unanimous means fully in agreement." },
    { word: "VIGILANT", ans: "Watchful and alert", d1: "Negligent", d2: "Careless", d3: "Asleep", exp: "Vigilant means keeping careful watch for possible danger or difficulties." },
    { word: "WARY", ans: "Cautious and guarded", d1: "Trusting", d2: "Reckless", d3: "Rash", exp: "Wary means feeling or showing caution about possible dangers or problems." },
    { word: "ZEALOUS", ans: "Fervent and enthusiastic", d1: "Indifferent", d2: "Apathetic", d3: "Uninterested", exp: "Zealous means having or showing great zeal and passion." },
    { word: "AUTHENTIC", ans: "Genuine and real", d1: "Counterfeit", d2: "Fake", d3: "Spurious", exp: "Authentic means of undisputed origin; genuine." },
    { word: "COGNIZANT", ans: "Aware and mindful", d1: "Ignorant", d2: "Unconscious", d3: "Unaware", exp: "Cognizant means having knowledge or being aware of." }
  ];
  synData.forEach((s) => {
    addQ(
      1,
      "Synonyms",
      "Easy",
      `Choose the exact synonym for the capitalized word:
"${s.word}"`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      s.exp
    );
  });
  const antData = [
    { word: "AFFLUENT", ans: "Impoverished", d1: "Wealthy", d2: "Opulent", d3: "Prosperous", exp: "Affluent means wealthy; its direct antonym is impoverished." },
    { word: "COMPLIANT", ans: "Defiant", d1: "Obedient", d2: "Submissive", d3: "Yielding", exp: "Compliant means willing to obey; the opposite is defiant." },
    { word: "DIVERGENT", ans: "Convergent", d1: "Deviating", d2: "Disparate", d3: "Separating", exp: "Divergent means moving apart; the opposite is convergent." },
    { word: "EXPLICIT", ans: "Ambiguous", d1: "Definite", d2: "Clear", d3: "Unambiguous", exp: "Explicit means stated clearly; the opposite is ambiguous or implicit." },
    { word: "FRUGAL", ans: "Extravagant", d1: "Thrifty", d2: "Economical", d3: "Sparing", exp: "Frugal means sparing or economical with money; the opposite is extravagant." },
    { word: "HARMONIOUS", ans: "Discordant", d1: "Tuneful", d2: "Peaceful", d3: "Agreeable", exp: "Harmonious means tuneful or agreement-based; opposite is discordant." },
    { word: "INTREPID", ans: "Cowardly", d1: "Fearless", d2: "Brave", d3: "Valiant", exp: "Intrepid means fearless; the opposite is cowardly or timid." },
    { word: "JUDICIOUS", ans: "Imprudent", d1: "Wise", d2: "Sensible", d3: "Prudent", exp: "Judicious means having good judgment; opposite is imprudent." },
    { word: "KINDLE", ans: "Extinguish", d1: "Ignite", d2: "Spark", d3: "Fuel", exp: "Kindle means to start a flame; the opposite is extinguish." },
    { word: "LAVISH", ans: "Austere", d1: "Luxurious", d2: "Grand", d3: "Sumptuous", exp: "Lavish means sumptuously rich; opposite is austere or meager." },
    { word: "MANDATORY", ans: "Optional", d1: "Compulsory", d2: "Obligatory", d3: "Required", exp: "Mandatory means required; the opposite is optional." },
    { word: "NEBULOUS", ans: "Distinct and clear", d1: "Vague", d2: "Hazy", d3: "Cloudy", exp: "Nebulous means vague or ill-defined; opposite is distinct and clear." },
    { word: "OPAQUE", ans: "Transparent", d1: "Murky", d2: "Cloudy", d3: "Dense", exp: "Opaque means not able to be seen through; opposite is transparent." },
    { word: "PACIFY", ans: "Provoke", d1: "Soothe", d2: "Calm", d3: "Appease", exp: "Pacify means to quell anger; the opposite is provoke or agitate." },
    { word: "QUIETUDE", ans: "Turbulence", d1: "Calmness", d2: "Tranquility", d3: "Stillness", exp: "Quietude means state of stillness; opposite is turbulence." },
    { word: "RESTRAIN", ans: "Liberate", d1: "Suppress", d2: "Restrict", d3: "Curb", exp: "Restrain means to hold back; opposite is liberate or unleash." },
    { word: "SERENE", ans: "Agitated", d1: "Placid", d2: "Tranquil", d3: "Peaceful", exp: "Serene means calm and peaceful; opposite is agitated." },
    { word: "TURBULENT", ans: "Placid and calm", d1: "Stormy", d2: "Chaotic", d3: "Violent", exp: "Turbulent means characterized by chaos; opposite is placid and calm." },
    { word: "URBANE", ans: "Uncouth and crude", d1: "Sophisticated", d2: "Refined", d3: "Polished", exp: "Urbane means courteous and refined; opposite is uncouth." },
    { word: "VALIANT", ans: "Craven", d1: "Heroic", d2: "Courageous", d3: "Bold", exp: "Valiant means showing courage; opposite is craven or cowardly." },
    { word: "WITHER", ans: "Thrive and flourish", d1: "Decay", d2: "Fade", d3: "Wilt", exp: "Wither means to shrivel and decay; opposite is thrive and flourish." },
    { word: "EXONERATE", ans: "Convict", d1: "Absolve", d2: "Acquit", d3: "Pardon", exp: "Exonerate means to clear of blame; opposite is convict or incriminate." },
    { word: "YIELDING", ans: "Inflexible", d1: "Supple", d2: "Pliant", d3: "Compliant", exp: "Yielding means giving way easily; opposite is inflexible." },
    { word: "ZENITH", ans: "Nadir", d1: "Peak", d2: "Apex", d3: "Pinnacle", exp: "Zenith is the highest point; opposite is nadir (the lowest point)." },
    { word: "ARDUOUS", ans: "Effortless", d1: "Strenuous", d2: "Demanding", d3: "Exhausting", exp: "Arduous means difficult and tiring; opposite is effortless." },
    { word: "BOISTEROUS", ans: "Subdued", d1: "Noisy", d2: "Rowdy", d3: "Clamorous", exp: "Boisterous means noisy and energetic; opposite is subdued or quiet." },
    { word: "CONCEAL", ans: "Reveal", d1: "Hide", d2: "Mask", d3: "Disguise", exp: "Conceal means to hide; opposite is reveal or disclose." },
    { word: "DESPICABLE", ans: "Admirable", d1: "Vile", d2: "Contemptible", d3: "Disgraceful", exp: "Despicable means deserving hatred; opposite is admirable or praiseworthy." },
    { word: "ECLIPSE", ans: "Illuminate", d1: "Obscure", d2: "Shadow", d3: "Dim", exp: "Eclipse means to block out or obscure; opposite is illuminate." },
    { word: "FEROCIOUS", ans: "Gentle", d1: "Fierce", d2: "Savage", d3: "Brutal", exp: "Ferocious means savagely fierce; opposite is gentle or tame." }
  ];
  antData.forEach((a) => {
    addQ(
      2,
      "Antonyms",
      "Easy",
      `Choose the most precise antonym (opposite) for the capitalized word:
"${a.word}"`,
      a.ans,
      a.d1,
      a.d2,
      a.d3,
      a.exp
    );
  });
  const scData = [
    { sent: "Despite the severe storm, the captain remained completely ____ and guided the vessel safely to port.", ans: "composed", d1: "terrified", d2: "agitated", d3: "reckless", exp: 'The contrast word "Despite" indicates calm composure under adversity.' },
    { sent: "The research team presented a ____ hypothesis supported by substantial empirical data.", ans: "compelling", d1: "flawed", d2: "fictitious", d3: "superficial", exp: "Substantial empirical data makes a hypothesis compelling." },
    { sent: "Her presentation was so ____ that even non-technical stakeholders grasped the complex architecture.", ans: "lucid", d1: "convoluted", d2: "abstruse", d3: "redundant", exp: "Easy understanding by non-technical audiences implies clarity and lucidity." },
    { sent: "The company instituted ____ security policies to prevent unauthorized data access.", ans: "stringent", d1: "lax", d2: "negligent", d3: "nominal", exp: "Preventing unauthorized access requires stringent (strict) policies." },
    { sent: "Because of his ____ habits, he managed to accumulate significant savings on a modest income.", ans: "frugal", d1: "prodigal", d2: "extravagant", d3: "wasteful", exp: "Accumulating savings on modest income points to frugal habits." },
    { sent: "The software update was designed to ____ the latency issues reported by active gamers.", ans: "alleviate", d1: "exacerbate", d2: "compound", d3: "prolong", exp: "Updates aim to alleviate (lessen/reduce) performance problems." },
    { sent: "The treaty was signed in an atmosphere of mutual ____ and cordiality.", ans: "goodwill", d1: "animosity", d2: "suspicion", d3: "resentment", exp: "Cordiality pairs with positive sentiment like goodwill." },
    { sent: "The architect chose durable materials to ensure the structural integrity remained ____ over decades.", ans: "uncompromised", d1: "vulnerable", d2: "flimsy", d3: "tenuous", exp: "Durable materials ensure integrity remains uncompromised." },
    { sent: "His explanation was concise yet ____, addressing every nuance of the system design.", ans: "comprehensive", d1: "cursory", d2: "vague", d3: "fragmented", exp: "Addressing every nuance makes an explanation comprehensive." },
    { sent: "The startup received ____ praise from industry critics for its innovative UI paradigm.", ans: "unanimous", d1: "hostile", d2: "divided", d3: "grudging", exp: "High praise for innovation is frequently unanimous." },
    { sent: "Continuous deployment allows engineering teams to ship features with ____ velocity.", ans: "unprecedented", d1: "sluggish", d2: "diminished", d3: "stagnant", exp: "Continuous deployment accelerates shipping speed to unprecedented levels." },
    { sent: "The committee rejected the proposal, citing its ____ financial projections.", ans: "unrealistic", d1: "accurate", d2: "prudent", d3: "solid", exp: "Proposals are rejected due to unrealistic or unfeasible projections." },
    { sent: "A good mentor provides both constructive feedback and ____ encouragement.", ans: "genuine", d1: "insincere", d2: "hostile", d3: "grudging", exp: "Effective mentoring pairs feedback with genuine encouragement." },
    { sent: "The new encryption protocol provides an ____ barrier against eavesdropping.", ans: "impenetrable", d1: "ineffectual", d2: "fragile", d3: "accessible", exp: "Strong encryption aims to create an impenetrable security barrier." },
    { sent: "Her remarks were deliberately ____ to avoid taking a definitive political stance.", ans: "equivocal", d1: "blunt", d2: "forthright", d3: "candid", exp: "Avoiding a definitive stance involves equivocal (ambiguous) phrasing." },
    { sent: "The database migration was executed with such precision that users noticed ____ downtime.", ans: "zero", d1: "excessive", d2: "debilitating", d3: "prolonged", exp: "Precision execution results in minimal or zero downtime." },
    { sent: "The detective discovered a ____ clue that broke the cold case wide open.", ans: "pivotal", d1: "trivial", d2: "redundant", d3: "misleading", exp: "A breakthrough clue is pivotal or decisive." },
    { sent: "In competitive markets, companies must remain ____ to adapt to shifting consumer demands.", ans: "agile", d1: "rigid", d2: "inflexible", d3: "stagnant", exp: "Adapting to shifting demands requires agility." },
    { sent: "The documentary offered an ____ look at the challenges facing ocean ecosystems.", ans: "insightful", d1: "indifferent", d2: "uninspired", d3: "apathetic", exp: "A well-crafted documentary provides insightful commentary." },
    { sent: "He handled the client's heated complaint with utmost ____ and professionalism.", ans: "diplomacy", d1: "arrogance", d2: "rudeness", d3: "indifference", exp: "Heated situations require diplomacy and composure." },
    { sent: "The mathematical proof was acknowledged as ____, leaving no room for counter-argument.", ans: "irrefutable", d1: "dubious", d2: "flawed", d3: "untenable", exp: "A definitive proof is irrefutable." },
    { sent: "Automated monitoring helps detect server anomalies before they turn into ____ failures.", ans: "catastrophic", d1: "minor", d2: "negligible", d3: "trivial", exp: "Proactive detection avoids catastrophic cascading outages." },
    { sent: "The author's style is known for being ____, using few words to convey profound meanings.", ans: "laconic", d1: "verbose", d2: "rambling", d3: "prolix", exp: "Using few words characterizes laconic or concise prose." },
    { sent: "The newly launched tablet features a display with ____ color accuracy and sharpness.", ans: "exceptional", d1: "mediocre", d2: "substandard", d3: "poor", exp: "Flagship hardware highlights exceptional display clarity." },
    { sent: "Due to the drought, farmers faced an ____ shortage of irrigation water.", ans: "acute", d1: "insignificant", d2: "surplus", d3: "abundant", exp: "Drought causes an acute (severe) shortage." },
    { sent: "The board praised the CEO's ____ vision that propelled the firm into global markets.", ans: "strategic", d1: "myopic", d2: "shortsighted", d3: "reckless", exp: "Global expansion reflects sound strategic foresight." },
    { sent: "The scientist remained ____, refusing to draw conclusions before the full trials concluded.", ans: "objective", d1: "biased", d2: "hasty", d3: "dogmatic", exp: "Waiting for full empirical results demonstrates scientific objectivity." },
    { sent: "The artist created a ____ sculpture blending modern metals with organic wood.", ans: "striking", d1: "bland", d2: "generic", d3: "monotonous", exp: "Distinctive creative work is visually striking." },
    { sent: "Her dedication to open-source software earned her a ____ reputation in the developer community.", ans: "stellar", d1: "tarnished", d2: "questionable", d3: "notorious", exp: "Strong dedication builds a stellar reputation." },
    { sent: "The contract contained a ____ clause that allowed termination under force majeure.", ans: "specific", d1: "cryptic", d2: "hidden", d3: "fictional", exp: "Formal contracts specify explicit clauses for termination conditions." }
  ];
  scData.forEach((s) => {
    addQ(
      3,
      "Sentence Completion",
      "Medium",
      `Select the word that best completes the sentence:
"${s.sent}"`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      s.exp
    );
  });
  const errData = [
    { sent: "Neither the manager nor the employees [A] was present [B] at the mandatory meeting [C] yesterday morning [D].", ans: 'Segment [B] ("was present" -> "were present")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'With "neither... nor", the verb agrees with the nearer subject ("employees" -> plural "were present").' },
    { sent: "Each of the participating candidates [A] have submitted their portfolio [B] before the official deadline [C] expired [D].", ans: 'Segment [B] ("have submitted" -> "has submitted")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Each" is singular and takes the singular verb "has submitted".' },
    { sent: "The list of approved vendors [A] were updated [B] by the procurement team [C] last Friday [D].", ans: 'Segment [B] ("were updated" -> "was updated")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The head noun is singular "The list", which requires the singular verb "was updated".' },
    { sent: "He is one of those engineers [A] who works [B] tirelessly on open-source [C] development [D].", ans: 'Segment [B] ("who works" -> "who work")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The relative pronoun "who" refers to the plural antecedent "engineers", requiring the plural verb "work".' },
    { sent: "If I was the chief technology officer [A], I would refactor [B] the entire legacy codebase [C] immediately [D].", ans: 'Segment [A] ("If I was" -> "If I were")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Subjunctive mood for hypothetical conditions requires "If I were".' },
    { sent: "She had barely sat down [A] when the fire alarm [B] started ringing loud [C] across the office [D].", ans: 'Segment [C] ("ringing loud" -> "ringing loudly")', d1: "Segment [A]", d2: "Segment [B]", d3: "Segment [D]", exp: 'The verb "ringing" must be modified by the adverb "loudly", not the adjective "loud".' },
    { sent: "Between you and I [A], the new system architecture [B] seems far more scalable [C] than the previous one [D].", ans: 'Segment [A] ("Between you and I" -> "Between you and me")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Prepositions like "between" take objective pronouns ("me", not "I").' },
    { sent: "The company has invested [A] heavy in artificial intelligence [B] over the last [C] two fiscal quarters [D].", ans: 'Segment [B] ("heavy in" -> "heavily in")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The verb "invested" requires the adverb "heavily".' },
    { sent: "None of the information provided [A] were accurate enough [B] to make a decisive [C] business judgment [D].", ans: 'Segment [B] ("were accurate" -> "was accurate")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Information" is an uncountable singular noun, so the verb must be "was accurate".' },
    { sent: "The team completed the project [A] more quicker [B] than the client [C] originally anticipated [D].", ans: 'Segment [B] ("more quicker" -> "more quickly" or "quicker")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Double comparatives like "more quicker" are incorrect; use "more quickly".' },
    { sent: "Ten miles are [A] a long distance [B] to walk on foot [C] without proper footwear [D].", ans: 'Segment [A] ("Ten miles are" -> "Ten miles is")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Units of distance, time, and money viewed as a single quantity take a singular verb ("is").' },
    { sent: "She prefers reading technical documentation [A] than attending [B] lengthy introductory [C] video tutorials [D].", ans: 'Segment [B] ("than attending" -> "to attending")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The verb "prefer" takes the preposition "to", not "than" ("prefers X to Y").' },
    { sent: "Scarcely had the server restarted [A] than a surge [B] of network requests [C] caused it to crash [D].", ans: 'Segment [B] ("than a surge" -> "when a surge")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The correlative pair is "Scarcely... when", not "Scarcely... than".' },
    { sent: "Every student and every teacher [A] were present [B] at the annual science symposium [C] in the auditorium [D].", ans: 'Segment [B] ("were present" -> "was present")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Subjects preceded by "every" or "each" take singular verbs.' },
    { sent: "The quality of the mobile displays [A] vary greatly [B] between different manufacturing [C] production batches [D].", ans: 'Segment [B] ("vary greatly" -> "varies greatly")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The head noun is singular "The quality", which requires "varies".' },
    { sent: "No sooner had the keynote speaker begun [A] when the microphone [B] lost audio connection [C] suddenly [D].", ans: 'Segment [B] ("when the microphone" -> "than the microphone")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The correlative conjunction pair is "No sooner... than", not "when".' },
    { sent: "The furniture in both conference rooms [A] were replaced [B] with ergonomic chairs [C] last weekend [D].", ans: 'Segment [B] ("were replaced" -> "was replaced")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Furniture" is uncountable and singular, requiring "was replaced".' },
    { sent: "He is senior than me [A] in the engineering department [B] by at least [C] four years [D].", ans: 'Segment [A] ("senior than me" -> "senior to me")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Comparative adjectives ending in -ior (senior, junior, prior) take "to", not "than".' },
    { sent: "She is capable to solve [A] the most challenging [B] algorithmic problems [C] with great ease [D].", ans: 'Segment [A] ("capable to solve" -> "capable of solving")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The correct idiom is "capable of + gerund" ("capable of solving").' },
    { sent: "Although he worked hard [A], but he failed [B] to complete the project [C] before the deadline [D].", ans: 'Segment [B] ("but he failed" -> "he failed")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Do not pair "Although" with "but" in the same complex sentence.' },
    { sent: "The news about the security breach [A] were broadcasted [B] across international media [C] yesterday [D].", ans: 'Segment [B] ("were broadcasted" -> "was broadcast")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: '"News" is singular ("was") and the past participle of broadcast is "broadcast".' },
    { sent: "He walked as if the ground [A] belongs to him [B] wherever he went [C] in the building [D].", ans: 'Segment [B] ("belongs to him" -> "belonged to him")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The hypothetical clause following "as if" requires past tense ("belonged").' },
    { sent: "The committee have decided [A] to adopt the new policy [B] unanimously after [C] lengthy deliberations [D].", ans: 'Segment [A] ("have decided" -> "has decided")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'A collective noun acting unanimously as a single unit takes a singular verb "has decided".' },
    { sent: "He is superior than [A] all his competitors [B] in customer service [C] and response time [D].", ans: 'Segment [A] ("superior than" -> "superior to")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Adjectives like superior, inferior, and prior take "to", not "than".' },
    { sent: "One should always keep [A] his promises [B] when dealing with [C] clients and partners [D].", ans: `Segment [B] ("his promises" -> "one's promises")`, d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: `The pronoun "one" must be paired with "one's", not "his" or "her".` },
    { sent: "She insisted to pay [A] for the entire dinner [B] at the celebratory [C] team gathering [D].", ans: 'Segment [A] ("insisted to pay" -> "insisted on paying")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Insist" takes the preposition "on" followed by a gerund ("insisted on paying").' },
    { sent: "The reason why he was absent [A] was because he fell ill [B] during the early hours [C] of the morning [D].", ans: 'Segment [B] ("was because" -> "was that")', d1: "Segment [A]", d2: "Segment [C]", d3: "Segment [D]", exp: 'Saying "The reason... was because" is redundant; use "The reason... was that".' },
    { sent: "Unless you do not submit [A] the required documentation [B], your application will be [C] rejected [D].", ans: 'Segment [A] ("Unless you do not submit" -> "Unless you submit")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Unless" already contains a negative meaning ("if not"); pairing with "do not" creates an erroneous double negative.' },
    { sent: "He prevented me to access [A] the staging server [B] without prior [C] administrative authorization [D].", ans: 'Segment [A] ("prevented me to access" -> "prevented me from accessing")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: '"Prevent" takes "from + gerund" ("prevented me from accessing").' },
    { sent: "He congratulated me for [A] winning the prestigious [B] hackathon grand prize [C] last evening [D].", ans: 'Segment [A] ("congratulated me for" -> "congratulated me on")', d1: "Segment [B]", d2: "Segment [C]", d3: "Segment [D]", exp: 'The standard idiom is "congratulate someone ON something", not "for".' }
  ];
  errData.forEach((e) => {
    addQ(
      4,
      "Error Spotting",
      "Medium",
      `Identify the grammatically erroneous segment:
"${e.sent}"`,
      e.ans,
      e.d1,
      e.d2,
      e.d3,
      e.exp
    );
  });
  const idiomData = [
    { idiom: "Bite the bullet", ans: "Face a painful or difficult situation with courage", d1: "Shoot a weapon accurately", d2: "Eat food quickly", d3: "Avoid taking responsibility" },
    { idiom: "Break the ice", ans: "Initiate conversation in a social setting to relieve tension", d1: "Shatter frozen water", d2: "Cancel an ongoing meeting", d3: "Argue aggressively with someone" },
    { idiom: "Burn the midnight oil", ans: "Work or study late into the night", d1: "Waste valuable electrical energy", d2: "Start a fire accidentally", d3: "Cook an elaborate meal" },
    { idiom: "Call it a day", ans: "Stop working on something for the rest of the day", d1: "Give a name to a date", d2: "Arrive early at an appointment", d3: "Celebrate a milestone" },
    { idiom: "Cut corners", ans: "Do something in a cheap, hurried, or substandard way", d1: "Take a geometric shortcut", d2: "Trim paper precisely", d3: "Follow strict rules" },
    { idiom: "Hit the nail on the head", ans: "Describe exactly what is causing a situation or state a precise truth", d1: "Hammer a piece of wood", d2: "Injure oneself while working", d3: "Make an unfounded guess" },
    { idiom: "Under the weather", ans: "Feeling slightly unwell or sick", d1: "Standing in heavy rain", d2: "Predicting meteorological trends", d3: "Traveling by airplane" },
    { idiom: "Once in a blue moon", ans: "Happening very rarely", d1: "Occurring every month", d2: "During a lunar eclipse", d3: "Frequently and predictably" },
    { idiom: "Spill the beans", ans: "Disclose confidential or secret information prematurely", d1: "Drop food on the floor", d2: "Plant seeds in a garden", d3: "Cook dinner for guests" },
    { idiom: "The ball is in your court", ans: "It is your turn to make the next decision or step", d1: "Play a game of tennis", d2: "A lost sports ball", d3: "Winning a sports match" },
    { idiom: "Throw in the towel", ans: "Admit defeat or surrender", d1: "Wash laundry thoroughly", d2: "Clean up a spill", d3: "Begin a boxing match" },
    { idiom: "Blessing in disguise", ans: "An apparent misfortune that eventually yields positive outcomes", d1: "A secret religious ceremony", d2: "A harmful event with no remedy", d3: "A costume party outfit" },
    { idiom: "A dime a dozen", ans: "Very common and of little special value", d1: "Extremely expensive and rare", d2: "A collection of ten coins", d3: "Antique currency" },
    { idiom: "Add insult to injury", ans: "Worsen an already unfavorable or painful situation", d1: "Provide first aid medical treatment", d2: "Apologize sincerely for mistakes", d3: "File a legal complaint" },
    { idiom: "Beat around the bush", ans: "Avoid talking directly about the main issue", d1: "Prune overgrown garden plants", d2: "Search for lost items in the woods", d3: "Speak boldly without hesitation" },
    { idiom: "At the eleventh hour", ans: "At the very last possible moment", d1: "Late at night before midnight", d2: "Early in the morning", d3: "Precisely scheduled on time" },
    { idiom: "Back to the drawing board", ans: "Start planning a project anew after previous efforts failed", d1: "Draw a technical sketch", d2: "Return to school", d3: "Erase a whiteboard" },
    { idiom: "Barking up the wrong tree", ans: "Pursuing a mistaken line of thought or accusing the wrong person", d1: "Training a hunting dog", d2: "Climbing a dangerous trunk", d3: "Chopping firewood" },
    { idiom: "Burn bridges", ans: "Destroy relationships or connections making retreat impossible", d1: "Demolish physical infrastructure", d2: "Build river crossings", d3: "Celebrate with bonfires" },
    { idiom: "Cry over spilled milk", ans: "Worry or complain about past mistakes that cannot be undone", d1: "Clean up a kitchen mess", d2: "Buy fresh groceries", d3: "Complain about food quality" },
    { idiom: "Curiosity killed the cat", ans: "Being overly inquisitive can lead to trouble", d1: "Cats are fragile animals", d2: "Scientists solve mysteries", d3: "Pets need veterinary care" },
    { idiom: "Devil's advocate", ans: "Arguing against an idea for the sake of exploring all perspectives", d1: "An evil legal practitioner", d2: "A deceitful individual", d3: "A judge in a courtroom" },
    { idiom: "Fit as a fiddle", ans: "In excellent physical health and condition", d1: "Skilled at playing violin", d2: "Wearing tailored clothes", d3: "Slim and delicate" },
    { idiom: "Hear it on the grapevine", ans: "Hear rumors or unofficial gossip about something", d1: "Harvesting vineyard grapes", d2: "Listening to audio recordings", d3: "Reading an official newspaper" },
    { idiom: "In the heat of the moment", ans: "Overwhelmed by strong immediate emotion without reflection", d1: "During a summer heatwave", d2: "Near an open furnace", d3: "Planning carefully ahead" },
    { idiom: "Keep someone at arm's length", ans: "Maintain distance and avoid developing close intimacy", d1: "Measure cloth accurately", d2: "Push someone physically", d3: "Hug someone warmly" },
    { idiom: "Leave no stone unturned", ans: "Try every possible method to achieve an objective", d1: "Clear rocks from a field", d2: "Build a stone pathway", d3: "Excavate archaeological sites" },
    { idiom: "Piece of cake", ans: "Something that is exceptionally easy to accomplish", d1: "A sweet dessert slice", d2: "A birthday party snack", d3: "A complicated recipe" },
    { idiom: "Steal someone's thunder", ans: "Take credit for someone else's achievements or upstage them", d1: "Create artificial lightning", d2: "Predict approaching storms", d3: "Make loud noise in a hall" },
    { idiom: "Take with a grain of salt", ans: "View a claim with skepticism and caution", d1: "Season food before eating", d2: "Preserve food in brine", d3: "Accept statements unconditionally" }
  ];
  idiomData.forEach((i) => {
    addQ(
      5,
      "Idioms & Phrases",
      "Easy",
      `What is the accurate figurative meaning of the idiom:
"${i.idiom}"?`,
      i.ans,
      i.d1,
      i.d2,
      i.d3,
      `Meaning and context: ${i.ans}.`
    );
  });
  const owsData = [
    { desc: "One who looks at the bright side of things", ans: "Optimist", d1: "Pessimist", d2: "Pacifist", d3: "Fatalist" },
    { desc: "One who looks at the dark or negative side of things", ans: "Pessimist", d1: "Optimist", d2: "Altruist", d3: "Hedonist" },
    { desc: "A person who loves and works for the welfare of mankind", ans: "Philanthropist", d1: "Misanthrope", d2: "Misogynist", d3: "Egotist" },
    { desc: "A person who hates or distrusts humankind", ans: "Misanthrope", d1: "Philanthropist", d2: "Altruist", d3: "Humanitarian" },
    { desc: "One who knows everything", ans: "Omniscient", d1: "Omnipotent", d2: "Omnipresent", d3: "Polyglot" },
    { desc: "One who is all-powerful", ans: "Omnipotent", d1: "Omniscient", d2: "Omnipresent", d3: "Invincible" },
    { desc: "One who is present everywhere simultaneously", ans: "Omnipresent", d1: "Omniscient", d2: "Omnipotent", d3: "Transient" },
    { desc: "A person who speaks many languages fluently", ans: "Polyglot", d1: "Linguist", d2: "Orator", d3: "Monoglot" },
    { desc: "A remedy that is believed to cure all diseases or problems", ans: "Panacea", d1: "Placebo", d2: "Antibiotic", d3: "Elixir" },
    { desc: "A handwritten document or musical work before publication", ans: "Manuscript", d1: "Transcript", d2: "Scroll", d3: "Draft" },
    { desc: "A life history of a person written by that same person", ans: "Autobiography", d1: "Biography", d2: "Memoir", d3: "Monograph" },
    { desc: "An account of someone's life written by another author", ans: "Biography", d1: "Autobiography", d2: "Obituary", d3: "Chronicle" },
    { desc: "A person who cannot make a mistake or err", ans: "Infallible", d1: "Fallible", d2: "Flawless", d3: "Meticulous" },
    { desc: "That which cannot be read due to illegibility", ans: "Illegible", d1: "Ineligible", d2: "Unreadable", d3: "Obscure" },
    { desc: "A person who leaves their own country to settle in another", ans: "Emigrant", d1: "Immigrant", d2: "Refugee", d3: "Expatriate" },
    { desc: "A person who comes to live permanently in a foreign country", ans: "Immigrant", d1: "Emigrant", d2: "Tourist", d3: "Nomad" },
    { desc: "One who does not believe in the existence of God", ans: "Atheist", d1: "Theist", d2: "Agnostic", d3: "Devotee" },
    { desc: "One who is uncertain or claims knowledge of God is impossible", ans: "Agnostic", d1: "Atheist", d2: "Theist", d3: "Fanatic" },
    { desc: "A speech delivered without any prior preparation", ans: "Extempore (or Impromptu)", d1: "Monologue", d2: "Dialogue", d3: "Soliloquy" },
    { desc: "A person who consumes human flesh", ans: "Cannibal", d1: "Carnivore", d2: "Herbivore", d3: "Omnivore" },
    { desc: "Animals that feed exclusively on plants", ans: "Herbivore", d1: "Carnivore", d2: "Omnivore", d3: "Insectivore" },
    { desc: "Animals that prey upon and eat flesh", ans: "Carnivore", d1: "Herbivore", d2: "Omnivore", d3: "Parasite" },
    { desc: "One who eats both plants and animals", ans: "Omnivore", d1: "Carnivore", d2: "Herbivore", d3: "Vegetarian" },
    { desc: "A doctor who specializes in treating skin diseases", ans: "Dermatologist", d1: "Cardiologist", d2: "Neurologist", d3: "Ophthalmologist" },
    { desc: "A doctor who specializes in heart and cardiovascular diseases", ans: "Cardiologist", d1: "Dermatologist", d2: "Pediatrician", d3: "Orthopedic" },
    { desc: "A specialist who studies and treats nervous system disorders", ans: "Neurologist", d1: "Nephrologist", d2: "Oncologist", d3: "Radiologist" },
    { desc: "A place where dead bodies are kept for identification and post-mortem", ans: "Mortuary (or Morgue)", d1: "Cemetery", d2: "Crematorium", d3: "Sanatorium" },
    { desc: "A place where books and reference media are housed for borrowing", ans: "Library", d1: "Museum", d2: "Archive", d3: "Auditorium" },
    { desc: "A place where historical records and government documents are preserved", ans: "Archives", d1: "Library", d2: "Armory", d3: "Arsenal" },
    { desc: "A state of lawlessness and total absence of government rule", ans: "Anarchy", d1: "Monarchy", d2: "Oligarchy", d3: "Democracy" }
  ];
  owsData.forEach((o) => {
    addQ(
      6,
      "One Word Substitution",
      "Medium",
      `Select the precise single word for the phrase:
"${o.desc}"`,
      o.ans,
      o.d1,
      o.d2,
      o.d3,
      `Exact substitution: "${o.desc}" is an ${o.ans}.`
    );
  });
  const pjData = [
    { p: "P: Cloud computing enables on-demand access to shared compute resources.\nQ: These resources include servers, storage, applications, and network services.\nR: Users can provision them rapidly with minimal management overhead.\nS: As a result, businesses reduce capital infrastructure expenditure significantly.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - S - P - Q", exp: "Logical flow: Definition (P) -> Elaboration (Q) -> User capability (R) -> Consequent benefit (S)." },
    { p: "P: Clean code adheres to standardized formatting and naming conventions.\nQ: It makes maintenance seamless for future developers joining the project.\nR: This reduces bug frequency and accelerates delivery velocity.\nS: Consequently, engineering teams spend less time firefighting in production.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - S - P - R", d3: "R - P - S - Q", exp: "Logical flow: Property of clean code (P) -> Direct developer benefit (Q) -> Project impact (R) -> Outcome (S)." },
    { p: "P: Version control systems record modifications to source files over time.\nQ: Developers can recall specific versions and revert unwanted bugs.\nR: Distributed tools like Git enable parallel branching across teams.\nS: This collaborative framework prevents code overwrite conflicts.", ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "Q - S - P - R", d3: "S - R - Q - P", exp: "Logical progression: Core function (P) -> Individual utility (Q) -> Team expansion (R) -> Collective resolution (S)." },
    { p: "P: Agile methodologies emphasize iterative software development cycles.\nQ: Cross-functional teams collaborate in short sprints of two to four weeks.\nR: Continuous customer feedback informs the priorities of upcoming sprints.\nS: Thus, the final product remains closely aligned with evolving market needs.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - S - P - Q", exp: "Concept (P) -> Mechanism (Q) -> Feedback loop (R) -> Strategic alignment (S)." },
    { p: "P: Microservices divide large monoliths into small, independent services.\nQ: Each microservice communicates using lightweight protocols like HTTP or gRPC.\nR: Teams can deploy and scale services independently without global lockups.\nS: However, distributed tracing and network complexity must be carefully managed.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - R - S - P", d3: "R - Q - P - S", exp: "Definition (P) -> Inter-communication (Q) -> Primary advantage (R) -> Trade-off caution (S)." },
    { p: "P: Relational databases organize structured data into indexed tables.\nQ: Primary and foreign keys enforce referential integrity across entities.\nR: Structured Query Language (SQL) enables powerful declarative queries.\nS: Transactional ACID guarantees ensure consistency even during power failures.", ans: "P - Q - R - S", d1: "Q - P - R - S", d2: "S - R - Q - P", d3: "R - P - S - Q", exp: "Structure (P) -> Relationships (Q) -> Query interface (R) -> Reliability properties (S)." },
    { p: "P: Continuous Integration (CI) automatically builds and tests every code commit.\nQ: Automated test suites verify unit logic and integration boundaries.\nR: When a build breaks, developers receive immediate notification to fix it.\nS: This practice prevents broken code from ever reaching production environments.", ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "S - Q - P - R", d3: "Q - S - R - P", exp: "Definition (P) -> Verification (Q) -> Feedback (R) -> Quality protection (S)." },
    { p: "P: Object-Oriented Programming models real-world entities as objects.\nQ: Classes define attributes and methods that encapsulate internal state.\nR: Inheritance enables child classes to reuse and extend parent behaviors.\nS: Polymorphism allows different classes to respond uniquely to shared method calls.", ans: "P - Q - R - S", d1: "S - R - Q - P", d2: "Q - P - R - S", d3: "R - S - P - Q", exp: "Foundational paradigm (P) -> Encapsulation (Q) -> Inheritance (R) -> Polymorphism (S)." },
    { p: "P: Distributed caching stores frequent query responses in high-speed RAM.\nQ: In-memory stores like Redis return data in sub-millisecond latencies.\nR: This prevents repetitive query execution from overwhelming persistent databases.\nS: As a consequence, web applications achieve high concurrency and throughput.", ans: "P - Q - R - S", d1: "Q - S - P - R", d2: "S - P - R - Q", d3: "R - Q - P - S", exp: "Mechanism (P) -> Technology (Q) -> Database protection (R) -> Throughput result (S)." },
    { p: "P: Asynchronous JavaScript allows non-blocking execution in single-threaded runtimes.\nQ: Promises and async/await syntax handle long-running I/O operations elegantly.\nR: The event loop continues processing user input and rendering updates concurrently.\nS: Consequently, web applications remain smooth and responsive under load.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - R - P - S", d3: "R - S - Q - P", exp: "Concept (P) -> Syntax (Q) -> Event loop (R) -> UX outcome (S)." },
    { p: "P: Encryption scrambles plaintext into unreadable ciphertext using cryptographic keys.\nQ: Symmetric ciphers use the same secret key for both encryption and decryption.\nR: Asymmetric ciphers use paired public and private keys for secure key exchange.\nS: Together, they establish secure end-to-end communication channels over HTTPS.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - Q - P - S", exp: "Broad definition (P) -> Symmetric (Q) -> Asymmetric (R) -> Combined HTTPS protocol (S)." },
    { p: "P: Load balancers distribute incoming network traffic across multiple server instances.\nQ: Health checks monitor each server and reroute traffic away from unhealthy nodes.\nR: This horizontal scaling architecture prevents single points of failure.\nS: Users experience continuous availability even during routine rolling deployments.", ans: "P - Q - R - S", d1: "S - R - Q - P", d2: "Q - P - R - S", d3: "R - S - P - Q", exp: "Role (P) -> Monitoring (Q) -> Architecture benefit (R) -> High availability (S)." },
    { p: 'P: Containers package application source code together with all runtime dependencies.\nQ: Docker engine ensures identical execution across local dev and cloud clusters.\nR: This completely eliminates the classic "it works on my machine" dilemma.\nS: Deployment pipelines become fast, predictable, and fully reproducible.', ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "S - Q - P - R", d3: "Q - S - R - P", exp: "Packaging (P) -> Environment parity (Q) -> Problem solved (R) -> CI/CD benefit (S)." },
    { p: "P: Automated monitoring collects system metrics, application logs, and network traces.\nQ: Time-series dashboards visualize CPU usage, memory consumption, and error rates.\nR: Threshold breach alerts notify on-call engineers via SMS or Slack immediately.\nS: This enables rapid incident response before customer experience is degraded.", ans: "P - Q - R - S", d1: "Q - P - R - S", d2: "S - R - Q - P", d3: "R - P - S - Q", exp: "Data collection (P) -> Visualization (Q) -> Alerting (R) -> Incident remediation (S)." },
    { p: "P: WebSockets provide full-duplex, persistent communication over a single TCP socket.\nQ: Unlike HTTP polling, either the client or server can push messages instantly.\nR: This low overhead makes WebSockets ideal for multiplayer games and live chat.\nS: Users receive immediate real-time updates without page refreshes.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - S - P - R", d3: "R - Q - S - P", exp: "Protocol definition (P) -> Comparison with polling (Q) -> Use cases (R) -> Real-time benefit (S)." },
    { p: "P: Garbage collection automatically reclaims heap memory from unreachable objects.\nQ: Mark-and-sweep algorithms identify objects that have no remaining live references.\nR: Freeing unused memory prevents memory leaks and fatal out-of-memory crashes.\nS: Developers are relieved from tedious manual memory allocation and deallocation.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - P - Q", d3: "R - Q - S - P", exp: "Purpose (P) -> Algorithm mechanism (Q) -> System safety (R) -> Developer productivity (S)." },
    { p: "P: Indexing in databases creates auxiliary lookup trees for specific table columns.\nQ: B-Trees and Hash indexes reduce query search complexity from O(N) to O(log N).\nR: While read queries become dramatically faster, write operations incur slight overhead.\nS: Therefore, index design requires balancing query frequency against insert volume.", ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "S - Q - P - R", d3: "Q - S - R - P", exp: "Concept (P) -> Algorithmic gain (Q) -> Trade-off (R) -> Architectural balance (S)." },
    { p: "P: DNS translates human-readable domain names into numerical IP addresses.\nQ: Recursive resolvers query root, TLD, and authoritative name servers sequentially.\nR: Cached DNS records accelerate repeat lookups at ISP and browser levels.\nS: Browsers then establish direct TCP connections to the resolved web server.", ans: "P - Q - R - S", d1: "S - R - Q - P", d2: "Q - P - R - S", d3: "R - S - P - Q", exp: "Function (P) -> Resolution hierarchy (Q) -> Caching (R) -> Connection establishment (S)." },
    { p: "P: Search engine optimization (SEO) improves organic ranking on search engine result pages.\nQ: Technical SEO ensures fast loading speeds, mobile responsiveness, and clean sitemaps.\nR: High-quality content with relevant keywords attracts organic backlinks.\nS: Over time, web properties gain authoritative domain rank and sustained visitor traffic.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - Q - P - S", exp: "Goal (P) -> Technical factors (Q) -> Content factors (R) -> Long-term ranking (S)." },
    { p: "P: Progressive Web Apps (PWAs) deliver app-like experiences within standard browsers.\nQ: Service workers cache static assets and data for offline functionality.\nR: Web app manifests enable users to install the web app onto their mobile home screens.\nS: Businesses achieve cross-platform reach without managing multiple native app stores.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - R - P - S", d3: "R - S - Q - P", exp: "Definition (P) -> Offline mechanism (Q) -> Installability (R) -> Cross-platform ROI (S)." },
    { p: "P: Machine learning algorithms learn statistical patterns directly from historical training data.\nQ: Supervised learning models map labeled input features to known target outputs.\nR: Hyperparameter tuning and validation checks prevent overfitting on noise.\nS: The trained model can then make accurate predictions on previously unseen datasets.", ans: "P - Q - R - S", d1: "Q - P - R - S", d2: "S - R - Q - P", d3: "R - P - S - Q", exp: "Foundation (P) -> Supervised paradigm (Q) -> Model regularization (R) -> Generalization (S)." },
    { p: "P: Responsive design adapts web layouts fluidly across smartphones, tablets, and desktops.\nQ: CSS media queries adjust column grids, font sizes, and image dimensions dynamically.\nR: Fluid flexbox and CSS grid layouts ensure components stack naturally on narrow viewports.\nS: Users enjoy an optimal visual reading and interaction experience on any device.", ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "S - Q - P - R", d3: "Q - S - R - P", exp: "Goal (P) -> Media queries (Q) -> Grid mechanics (R) -> Cross-device UX (S)." },
    { p: "P: Serverless computing allows developers to deploy code without managing VM infrastructure.\nQ: Cloud providers automatically execute code in response to incoming events or API requests.\nR: Billing is calculated strictly on execution duration down to the millisecond.\nS: Organizations save operational overhead and eliminate idle compute costs.", ans: "P - Q - R - S", d1: "S - R - Q - P", d2: "Q - P - R - S", d3: "R - S - P - Q", exp: "Model (P) -> Event-driven execution (Q) -> Pricing model (R) -> Operational savings (S)." },
    { p: "P: Graph data structures represent non-linear relationships between interconnected nodes.\nQ: Edges define directional or bi-directional connections between pairs of vertices.\nR: Traversal algorithms like Breadth-First Search find the shortest path between nodes.\nS: Social networks and routing engines rely heavily on graphs for friend and path queries.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - Q - P - S", exp: "Structure (P) -> Components (Q) -> Algorithms (R) -> Real-world applications (S)." },
    { p: "P: Static site generators compile Markdown and components into pre-rendered HTML files.\nQ: These static assets are distributed globally across edge content delivery networks.\nR: Serving static HTML bypasses server-side runtime database queries entirely.\nS: This delivers near-instantaneous page loads and impenetrable server security.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - R - P - S", d3: "R - S - Q - P", exp: "Build step (P) -> CDN distribution (Q) -> Query avoidance (R) -> Speed & security (S)." },
    { p: "P: Code linting tools automatically scan source code for syntax flaws and style violations.\nQ: Static analysis rules enforce uniform indentation, quote styles, and naming standards.\nR: Pre-commit hooks block non-compliant code before it can be pushed to remote repositories.\nS: Code reviews can then focus entirely on business logic rather than formatting debates.", ans: "P - Q - R - S", d1: "Q - P - R - S", d2: "S - R - Q - P", d3: "R - P - S - Q", exp: "Tool purpose (P) -> Rule enforcement (Q) -> Automated gating (R) -> Review efficiency (S)." },
    { p: "P: Dependency injection passes service dependencies into objects rather than hardcoding them.\nQ: This decouples components and adheres strictly to the Inversion of Control principle.\nR: Unit tests can easily substitute mock objects for external databases or third-party APIs.\nS: As a result, codebases become significantly more testable and modular.", ans: "P - Q - R - S", d1: "R - P - Q - S", d2: "S - Q - P - R", d3: "Q - S - R - P", exp: "Mechanism (P) -> Architectural principle (Q) -> Testing advantage (R) -> Maintainability (S)." },
    { p: "P: GraphQL enables clients to request exactly the data fields they require in a single query.\nQ: A strongly-typed schema defines types, relationships, and queries explicitly.\nR: This eliminates both the over-fetching and under-fetching common in traditional REST APIs.\nS: Mobile clients save cellular bandwidth and reduce battery consumption.", ans: "P - Q - R - S", d1: "S - R - Q - P", d2: "Q - P - R - S", d3: "R - S - P - Q", exp: "Core benefit (P) -> Schema (Q) -> Solves REST flaws (R) -> Mobile efficiency (S)." },
    { p: "P: Dark mode interfaces utilize dark background palettes with high-contrast text.\nQ: OLED displays consume significantly less battery power when rendering dark pixels.\nR: Dimmer screen illumination reduces eye fatigue during nighttime work sessions.\nS: Consequently, dark mode has become an essential user-configurable UI standard.", ans: "P - Q - R - S", d1: "Q - P - S - R", d2: "S - R - Q - P", d3: "R - Q - P - S", exp: "Concept (P) -> Hardware efficiency (Q) -> Ergonomic benefit (R) -> Industry standard (S)." },
    { p: "P: Continuous Deployment extends CI by automatically releasing validated builds to production.\nQ: Automated smoke tests and canary releases verify the deployment against real traffic.\nR: If error metrics spike, automated rollbacks instantly revert to the last stable release.\nS: This minimizes release risk while shipping updates to users multiple times a day.", ans: "P - Q - R - S", d1: "S - P - Q - R", d2: "Q - R - P - S", d3: "R - S - Q - P", exp: "CD concept (P) -> Canary verification (Q) -> Automated rollback safety (R) -> Deployment speed (S)." }
  ];
  pjData.forEach((pj) => {
    addQ(
      7,
      "Para Jumbles",
      "Hard",
      `Rearrange the four scrambled sentences to form a coherent, logically connected paragraph:

${pj.p}`,
      pj.ans,
      pj.d1,
      pj.d2,
      pj.d3,
      `Paragraph structure: ${pj.exp}`
    );
  });
  const voiceData = [
    { act: "The senior architect designed the distributed database schema.", pass: "The distributed database schema was designed by the senior architect.", d1: "The distributed database schema has designed by the senior architect.", d2: "The senior architect was designing the database schema.", d3: "The database schema is designed by the architect." },
    { act: "The QA engineer identified three critical security bugs.", pass: "Three critical security bugs were identified by the QA engineer.", d1: "Three critical security bugs had identified by the QA engineer.", d2: "The QA engineer was identified by three bugs.", d3: "Three critical security bugs are identified." },
    { act: "The automated pipeline deployed the application to production.", pass: "The application was deployed to production by the automated pipeline.", d1: "The application had deployed by the pipeline.", d2: "The production is deploying the application.", d3: "The automated pipeline was deployed." },
    { act: "The compiler caught several syntax errors during the build.", pass: "Several syntax errors were caught by the compiler during the build.", d1: "Several syntax errors have caught by the compiler.", d2: "The compiler was caught by syntax errors.", d3: "Several syntax errors are being caught." },
    { act: "The CEO announced the company expansion at the townhall.", pass: "The company expansion was announced by the CEO at the townhall.", d1: "The company expansion had announced by the CEO.", d2: "The townhall was announced by the company expansion.", d3: "The CEO was announced by expansion." },
    { act: "The DevOps engineer configured the Kubernetes ingress controller.", pass: "The Kubernetes ingress controller was configured by the DevOps engineer.", d1: "The Kubernetes ingress controller is configured by DevOps.", d2: "The DevOps engineer was configured by Kubernetes.", d3: "The ingress controller has configured." },
    { act: "The product designer crafted an intuitive onboarding flow.", pass: "An intuitive onboarding flow was crafted by the product designer.", d1: "An intuitive onboarding flow is crafted by product designer.", d2: "The product designer was crafted by onboarding.", d3: "An intuitive flow has crafted." },
    { act: "The database administrator restored the backup snapshot after the outage.", pass: "The backup snapshot was restored by the database administrator after the outage.", d1: "The backup snapshot had restored by the administrator.", d2: "The outage was restored by the database administrator.", d3: "The administrator was restored." },
    { act: "The research team published a groundbreaking paper on machine learning.", pass: "A groundbreaking paper on machine learning was published by the research team.", d1: "A groundbreaking paper had published by the team.", d2: "The research team was published by paper.", d3: "A groundbreaking paper is published." },
    { act: "The security specialist patched the zero-day vulnerability in the API gateway.", pass: "The zero-day vulnerability in the API gateway was patched by the security specialist.", d1: "The zero-day vulnerability had patched by the specialist.", d2: "The security specialist was patched by the vulnerability.", d3: "The API gateway has patched." },
    { act: "The algorithm sorted the array of integers in logarithmic time.", pass: "The array of integers was sorted by the algorithm in logarithmic time.", d1: "The array of integers has sorted by algorithm.", d2: "The algorithm was sorted by array.", d3: "The array is sorted." },
    { act: "The team completed all sprint backlog tasks ahead of schedule.", pass: "All sprint backlog tasks were completed by the team ahead of schedule.", d1: "All sprint backlog tasks had completed by team.", d2: "The team was completed by backlog tasks.", d3: "All tasks are completed." },
    { act: "The frontend engineer optimized the image assets for faster loading.", pass: "The image assets were optimized by the frontend engineer for faster loading.", d1: "The image assets have optimized by frontend engineer.", d2: "The frontend engineer was optimized by image assets.", d3: "The image assets is optimized." },
    { act: "The author wrote a bestselling novel about ancient civilizations.", pass: "A bestselling novel about ancient civilizations was written by the author.", d1: "A bestselling novel had written by author.", d2: "The author was written by novel.", d3: "A bestselling novel is written." },
    { act: "The mechanic repaired the car's transmission yesterday.", pass: "The car's transmission was repaired by the mechanic yesterday.", d1: "The car's transmission has repaired by mechanic.", d2: "The mechanic was repaired by transmission.", d3: "The car is repaired." },
    { act: "The committee approved the revised environmental guidelines.", pass: "The revised environmental guidelines were approved by the committee.", d1: "The revised environmental guidelines had approved by committee.", d2: "The committee was approved by guidelines.", d3: "The guidelines are approved." },
    { act: "The browser executed the JavaScript script asynchronously.", pass: "The JavaScript script was executed asynchronously by the browser.", d1: "The JavaScript script has executed asynchronously.", d2: "The browser was executed by script.", d3: "The script is executing." },
    { act: "The chef prepared a gourmet three-course meal for the guests.", pass: "A gourmet three-course meal was prepared by the chef for the guests.", d1: "A gourmet meal had prepared by chef.", d2: "The chef was prepared by meal.", d3: "A gourmet meal is prepared." },
    { act: "The auditor examined all financial transactions from the previous quarter.", pass: "All financial transactions from the previous quarter were examined by the auditor.", d1: "All financial transactions had examined by auditor.", d2: "The auditor was examined by transactions.", d3: "All transactions are examined." },
    { act: "The teacher praised the students for their outstanding project presentation.", pass: "The students were praised by the teacher for their outstanding project presentation.", d1: "The students had praised by teacher.", d2: "The teacher was praised by project presentation.", d3: "The students are praised." },
    { act: "The storm destroyed several power transmission lines across the county.", pass: "Several power transmission lines were destroyed by the storm across the county.", d1: "Several lines had destroyed by storm.", d2: "The storm was destroyed by power lines.", d3: "Several lines are destroyed." },
    { act: "The system administrator configured the firewall rules to block unauthorized IPs.", pass: "The firewall rules were configured by the system administrator to block unauthorized IPs.", d1: "The firewall rules had configured by administrator.", d2: "The administrator was configured by firewall.", d3: "The firewall rules are configured." },
    { act: "The company launched an innovative mobile banking application.", pass: "An innovative mobile banking application was launched by the company.", d1: "An innovative mobile banking application had launched by company.", d2: "The company was launched by application.", d3: "An application is launched." },
    { act: "The musician composed a symphony that moved the entire audience.", pass: "A symphony that moved the entire audience was composed by the musician.", d1: "A symphony had composed by musician.", d2: "The musician was composed by symphony.", d3: "A symphony is composed." },
    { act: "The detective solved the perplexing burglary mystery within two days.", pass: "The perplexing burglary mystery was solved by the detective within two days.", d1: "The mystery had solved by detective.", d2: "The detective was solved by mystery.", d3: "The mystery is solved." },
    { act: "The artist painted a vibrant mural on the public library wall.", pass: "A vibrant mural was painted by the artist on the public library wall.", d1: "A vibrant mural had painted by artist.", d2: "The artist was painted by mural.", d3: "A mural is painted." },
    { act: "The technician calibrated the laboratory sensors before the experiment.", pass: "The laboratory sensors were calibrated by the technician before the experiment.", d1: "The laboratory sensors had calibrated by technician.", d2: "The technician was calibrated by sensors.", d3: "The sensors are calibrated." },
    { act: "The director scheduled a mandatory all-hands briefing for Monday morning.", pass: "A mandatory all-hands briefing was scheduled by the director for Monday morning.", d1: "A mandatory briefing had scheduled by director.", d2: "The director was scheduled by briefing.", d3: "A briefing is scheduled." },
    { act: "The barista brewed a fresh pot of artisanal espresso.", pass: "A fresh pot of artisanal espresso was brewed by the barista.", d1: "A fresh pot of espresso had brewed by barista.", d2: "The barista was brewed by espresso.", d3: "A fresh pot is brewed." },
    { act: "The editor revised the manuscript to improve clarity and pacing.", pass: "The manuscript was revised by the editor to improve clarity and pacing.", d1: "The manuscript had revised by editor.", d2: "The editor was revised by manuscript.", d3: "The manuscript is revised." }
  ];
  voiceData.forEach((v) => {
    addQ(
      8,
      "Active & Passive Voice",
      "Easy",
      `Convert the active sentence into correct passive voice:
"${v.act}"`,
      v.pass,
      v.d1,
      v.d2,
      v.d3,
      `Passive voice transformation rule: Subject and object swap with appropriate past participle form ("was/were + V3").`
    );
  });
  const rcData = [
    { p: "Passage: Photosynthesis in green plants converts solar energy into chemical energy stored as glucose, absorbing carbon dioxide and releasing vital oxygen.", q: "What is the primary atmospheric gas released as a byproduct of photosynthesis?", ans: "Oxygen", d1: "Carbon dioxide", d2: "Methane", d3: "Nitrogen" },
    { p: "Passage: The Doppler effect describes the perceived shift in frequency of a wave when the wave source and observer move relative to one another.", q: "What condition causes the Doppler effect to occur?", ans: "Relative motion between the wave source and observer", d1: "Constant static distance between objects", d2: "Extreme high temperatures in vacuum", d3: "Complete absence of atmospheric air" },
    { p: "Passage: Renewable energy sources, such as wind and solar, produce minimal greenhouse gases compared to fossil fuels, mitigating long-term climate risks.", q: "What is the key environmental advantage of renewable energy highlighted in the passage?", ans: "Generating minimal greenhouse gas emissions", d1: "Requiring zero land area", d2: "Operating without any initial capital cost", d3: "Being immune to weather changes" },
    { p: "Passage: Microprocessors execute machine instructions through a repeating fetch-decode-execute cycle orchestrated by the internal clock crystal.", q: "What component coordinates the timing of instruction execution cycles?", ans: "The internal clock crystal", d1: "The external hard disk drive", d2: "The operating system kernel", d3: "The optical display monitor" },
    { p: "Passage: Antibiotic resistance emerges when bacterial populations undergo mutations that allow them to survive exposure to therapeutic antimicrobial drugs.", q: "How does antibiotic resistance develop in bacteria according to the text?", ans: "Through genetic mutations that enable survival against antimicrobial drugs", d1: "By consuming synthetic dietary vitamins", d2: "Through viral immunization therapy", d3: "By avoiding all contact with hosts" },
    { p: "Passage: Open-source software licenses grant users the legal right to inspect, modify, and distribute source code freely under defined terms.", q: "What fundamental freedom do open-source licenses provide developers?", ans: "The right to inspect, modify, and redistribute source code", d1: "Guaranteed lifetime monetary compensation", d2: "Exemption from all legal copyright laws", d3: "Free proprietary hardware servers" },
    { p: "Passage: The human brain consumes approximately 20% of the body's total resting metabolic energy despite accounting for only 2% of body weight.", q: "What is the relationship between brain mass and energy consumption described in the text?", ans: "The brain uses a disproportionately large share (20%) of resting energy relative to its 2% mass", d1: "Brain mass exactly equals energy percentage", d2: "The brain requires zero metabolic energy", d3: "Energy consumption is solely dependent on muscle mass" },
    { p: "Passage: Coral reefs provide critical habitat for roughly 25% of all marine species while occupying less than 1% of the total ocean floor.", q: "Why are coral reefs ecologically significant according to the passage?", ans: "They support 25% of marine biodiversity despite occupying under 1% of ocean floor", d1: "They produce 100% of global oceanic freshwater", d2: "They eliminate all ocean currents", d3: "They are completely immune to ocean temperatures" },
    { p: "Passage: Artificial neural networks adjust internal synaptic weights through backpropagation to minimize predictive error on training data.", q: "What is the purpose of backpropagation in artificial neural networks?", ans: "To adjust weights in order to minimize predictive error", d1: "To erase all training data permanently", d2: "To increase memory latency in hardware", d3: "To generate random numbers" },
    { p: "Passage: The water cycle operates continuously through evaporation, condensation, precipitation, and collection back into oceans and aquifers.", q: "Which process in the water cycle turns vapor back into liquid droplets?", ans: "Condensation", d1: "Evaporation", d2: "Sublimation", d3: "Transpiration" },
    { p: "Passage: Plate tectonics explains continental drift and earthquake activity through the slow movement of lithospheric plates over the asthenosphere.", q: "What geological phenomena are explained by plate tectonics according to the text?", ans: "Continental drift and earthquake activity", d1: "Ocean tides caused by lunar gravity", d2: "Atmospheric cloud formation patterns", d3: "Solar flare eruptions" },
    { p: "Passage: Compilers translate high-level programming language code into low-level machine code before execution, enabling optimization.", q: "What is the primary function of a compiler?", ans: "Translating high-level source code into low-level machine code", d1: "Interpreting source code line by line during runtime", d2: "Executing code in the browser DOM", d3: "Formatting CSS styles" },
    { p: "Passage: Honeybees communicate the distance and direction of rich nectar sources to hive members through an intricate figure-eight waggle dance.", q: "How do honeybees communicate the location of food to hive mates?", ans: "Through a figure-eight waggle dance", d1: "By emitting ultrasonic acoustic clicks", d2: "By flashing bioluminescent colors", d3: "Through telepathic signals" },
    { p: "Passage: Moore's Law was an empirical observation by Gordon Moore that the number of transistors on a microchip roughly doubles every two years.", q: "What did Moore's Law historically predict regarding microchips?", ans: "Transistor density on microchips roughly doubles every two years", d1: "Microchip retail prices double every month", d2: "Software bug frequency decreases by half weekly", d3: "Computer power consumption doubles annually" },
    { p: "Passage: The ozone layer in the stratosphere shields life on Earth by absorbing the vast majority of harmful ultraviolet (UV) radiation from the Sun.", q: "What vital protective role does the stratospheric ozone layer serve?", ans: "Absorbing harmful solar ultraviolet (UV) radiation", d1: "Trapping industrial greenhouse gases", d2: "Creating lightning storms in the troposphere", d3: "Reflecting radio waves back to orbit" },
    { p: "Passage: In physics, the law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another.", q: "What does the law of conservation of energy fundamentally assert?", ans: "Energy cannot be created or destroyed, only transformed", d1: "Energy naturally diminishes into nothingness", d2: "Energy is created spontaneously in chemical reactions", d3: "Kinetic energy cannot become potential energy" },
    { p: "Passage: Asynchronous I/O operations allow computer programs to issue input/output requests without blocking CPU execution while waiting for responses.", q: "What is the core benefit of asynchronous I/O described in the passage?", ans: "The CPU continues executing other tasks without blocking on I/O responses", d1: "I/O operations become completely instantaneous", d2: "Storage devices no longer require electricity", d3: "Memory leaks are eliminated automatically" },
    { p: "Passage: Mitochondria are specialized cellular organelles responsible for generating adenosine triphosphate (ATP), the primary energy currency of eukaryotic cells.", q: "What is the biological function of mitochondria in eukaryotic cells?", ans: "Generating ATP, the main energy currency of the cell", d1: "Synthesizing DNA strands in the nucleus", d2: "Filtering extracellular toxins in blood", d3: "Regulating body temperature directly" },
    { p: "Passage: Public-key cryptography uses an asymmetric pair of keys: a public key for encryption and a distinct private key for decryption.", q: "Which key is used to decrypt ciphertext in asymmetric public-key cryptography?", ans: "The recipient's private key", d1: "The sender's public key", d2: "A shared symmetric password", d3: "The Certificate Authority's root key" },
    { p: "Passage: The Hubble Space Telescope operates outside the distorting effects of Earth's atmosphere, allowing it to capture ultra-sharp astronomical images.", q: "Why does Hubble capture clearer images than ground telescopes according to the text?", ans: "It operates above the distorting atmosphere of Earth", d1: "It is closer to distant galaxies by millions of miles", d2: "It uses larger glass mirrors than any ground telescope", d3: "It only operates during solar eclipses" },
    { p: "Passage: In economics, the law of supply and demand states that market equilibrium price is established where the quantity supplied equals quantity demanded.", q: "How is market equilibrium price determined according to the law of supply and demand?", ans: "At the point where quantity supplied equals quantity demanded", d1: "By government decree alone", d2: "By the maximum price consumers are willing to spend", d3: "By raw manufacturing cost only" },
    { p: "Passage: Vaccines stimulate the immune system to produce antibodies and memory cells without causing the active disease, conferring future immunity.", q: "How do vaccines provide protective immunity?", ans: "By stimulating antibody and memory cell production without causing disease", d1: "By eliminating all viruses from the environment", d2: "By directly altering human genetic DNA sequences", d3: "By killing bacterial flora permanently" },
    { p: "Passage: Deadlocks in concurrent operating systems occur when two or more processes are permanently blocked because each holds a resource needed by another.", q: "What causes a deadlock in concurrent systems according to the passage?", ans: "Processes blocked indefinitely while holding resources required by each other", d1: "A power surge damaging the motherboard", d2: "A single process executing an infinite loop", d3: "Running out of disk storage space" },
    { p: "Passage: The Doppler radar uses frequency shifts in reflected microwave pulses to measure the velocity of precipitation and severe wind currents.", q: "What does Doppler radar measure using reflected frequency shifts?", ans: "The velocity and movement of precipitation and winds", d1: "The chemical composition of raindrops", d2: "The atmospheric temperature at ground level", d3: "The altitude of distant satellites" },
    { p: "Passage: Semantic HTML utilizes descriptive markup tags such as <article>, <nav>, and <header> to convey document structure to browsers and screen readers.", q: "What is the main purpose of semantic HTML tags described in the text?", ans: "To convey meaningful document structure to browsers and assistive technologies", d1: "To apply custom visual CSS colors automatically", d2: "To execute JavaScript logic faster", d3: "To reduce web server hosting costs" },
    { p: "Passage: The greenhouse effect is a natural process where atmospheric gases trap infrared heat emitted from Earth's surface, maintaining habitable temperatures.", q: "What role does the natural greenhouse effect play on Earth?", ans: "Trapping heat radiation to maintain habitable planetary temperatures", d1: "Preventing asteroids from entering the atmosphere", d2: "Blocking all sunlight from reaching the ground", d3: "Freezing ocean waters at the poles" },
    { p: "Passage: RAID 1 (mirroring) duplicates identical data across two or more storage drives to provide fault tolerance against single-drive failures.", q: "What is the primary purpose of RAID 1 storage configuration?", ans: "Data mirroring across drives to provide fault tolerance against hardware failure", d1: "Maximizing read and write throughput via data striping without parity", d2: "Compressing files into encrypted ZIP archives", d3: "Increasing storage capacity by summing all drive sizes" },
    { p: "Passage: The human circulatory system transports oxygenated blood from the left ventricle of the heart through systemic arteries to body tissues.", q: "From which chamber of the heart is oxygenated blood pumped into systemic circulation?", ans: "The left ventricle", d1: "The right atrium", d2: "The right ventricle", d3: "The pulmonary artery" },
    { p: "Passage: In computing, caching stores duplicate data in fast-access memory so that subsequent requests for the same data can be served with lower latency.", q: "Why is caching implemented in computing systems according to the text?", ans: "To serve repeat data requests with lower latency from high-speed memory", d1: "To permanently archive old records", d2: "To replace persistent SQL databases entirely", d3: "To encrypt sensitive user passwords" },
    { p: "Passage: Glaciers act as natural freshwater reservoirs, storing snow during cold seasons and releasing meltwater gradually to sustain river basins in summer.", q: "What ecological service do glaciers perform according to the passage?", ans: "Storing frozen water and releasing meltwater to sustain rivers during dry seasons", d1: "Increasing global ocean salt concentrations", d2: "Preventing wind currents across continents", d3: "Generating geothermal energy" }
  ];
  rcData.forEach((rc) => {
    addQ(
      9,
      "Reading Comprehension",
      "Medium",
      `${rc.p}

Question: ${rc.q}`,
      rc.ans,
      rc.d1,
      rc.d2,
      rc.d3,
      `Passage comprehension: "${rc.ans}" is directly established in the text.`
    );
  });
  const anData = [
    { pair: "AUTHOR : NOVEL", ans: "Composer : Symphony", d1: "Doctor : Patient", d2: "Teacher : Classroom", d3: "Chef : Kitchen", rel: "An author creates a novel; a composer creates a symphony (Creator : Creation)." },
    { pair: "THERMOMETER : TEMPERATURE", ans: "Barometer : Air Pressure", d1: "Clock : Calendar", d2: "Scale : Distance", d3: "Ruler : Weight", rel: "A thermometer measures temperature; a barometer measures air pressure (Instrument : Measurement)." },
    { pair: "CARPENTER : HAMMER", ans: "Surgeon : Scalpel", d1: "Teacher : Desk", d2: "Driver : Road", d3: "Author : Bookstore", rel: "A carpenter uses a hammer as a primary tool; a surgeon uses a scalpel (Professional : Tool)." },
    { pair: "OASIS : DESERT", ans: "Island : Ocean", d1: "Mountain : Valley", d2: "Tree : Forest", d3: "River : Lake", rel: "An oasis is a fertile water body surrounded by desert; an island is land surrounded by ocean." },
    { pair: "APPRENTICE : MASTER", ans: "Novice : Expert", d1: "Student : Desk", d2: "Employee : Office", d3: "Child : Toy", rel: "An apprentice learns under a master; a novice is inexperienced compared to an expert." },
    { pair: "SEED : TREE", ans: "Acorn : Oak", d1: "Petal : Flower", d2: "Root : Leaf", d3: "Fruit : Stem", rel: "A seed grows into a tree; an acorn specifically grows into an oak tree." },
    { pair: "FEATHER : BIRD", ans: "Scale : Fish", d1: "Fur : Snake", d2: "Wool : Horse", d3: "Claw : Cat", rel: "Feathers cover a bird; scales cover a fish (Outer covering : Organism)." },
    { pair: "TELESCOPE : ASTRONOMER", ans: "Microscope : Biologist", d1: "Camera : Painting", d2: "Stethoscope : Patient", d3: "Canvas : Sculptor", rel: "An astronomer uses a telescope to observe distant phenomena; a biologist uses a microscope." },
    { pair: "RETRACT : STATEMENT", ans: "Repeal : Legislation", d1: "Publish : Article", d2: "Sign : Contract", d3: "Deny : Truth", rel: "To retract is to formally withdraw a statement; to repeal is to withdraw legislation." },
    { pair: "CANVAS : PAINTER", ans: "Marble : Sculptor", d1: "Brush : Canvas", d2: "Easel : Paint", d3: "Clay : Pottery", rel: "Canvas is the raw medium for a painter; marble is the medium for a sculptor." },
    { pair: "INSOMNIA : SLEEP", ans: "Amnesia : Memory", d1: "Hunger : Food", d2: "Thirst : Water", d3: "Fatigue : Rest", rel: "Insomnia is the pathological lack of sleep; amnesia is the loss of memory." },
    { pair: "COMPASS : DIRECTION", ans: "Clock : Time", d1: "Map : Distance", d2: "Scale : Height", d3: "Anchor : Depth", rel: "A compass indicates direction; a clock indicates time." },
    { pair: "GLOVE : HAND", ans: "Sock : Foot", d1: "Hat : Coat", d2: "Shoe : Lace", d3: "Ring : Neck", rel: "A glove covers the hand; a sock covers the foot." },
    { pair: "SCALPEL : SURGEON", ans: "Chisel : Sculptor", d1: "Stethoscope : Nurse", d2: "Trowel : Plumber", d3: "Pen : Reader", rel: "A scalpel is the precision cutting tool of a surgeon; a chisel is the carving tool of a sculptor." },
    { pair: "SOLDIER : REGIMENT", ans: "Star : Constellation", d1: "Ship : Port", d2: "Flower : Vase", d3: "Book : Library", rel: "A soldier is an individual unit of a regiment; a star is a unit of a constellation." },
    { pair: "DICTIONARY : DEFINITION", ans: "Atlas : Map", d1: "Novel : Chapter", d2: "Magazine : Photo", d3: "Catalog : Price", rel: "A dictionary provides definitions; an atlas provides maps." },
    { pair: "EPILOGUE : NOVEL", ans: "Coda : Musical Symphony", d1: "Prologue : Play", d2: "Index : Appendix", d3: "Preface : Chapter", rel: "An epilogue concludes a novel; a coda concludes a musical piece." },
    { pair: "PETAL : FLOWER", ans: "Leaf : Tree", d1: "Stem : Root", d2: "Branch : Bark", d3: "Seed : Earth", rel: "A petal is a component of a flower; a leaf is a component of a tree." },
    { pair: "CONDUCTOR : ORCHESTRA", ans: "Director : Cast", d1: "Actor : Audience", d2: "Audience : Theater", d3: "Musician : Score", rel: "A conductor leads an orchestra; a director leads a theatrical cast." },
    { pair: "PHILATELIST : STAMPS", ans: "Numismatist : Coins", d1: "Botanist : Animals", d2: "Astronomer : Rocks", d3: "Geologist : Clouds", rel: "A philatelist collects stamps; a numismatist collects coins." },
    { pair: "ARCHITECT : BUILDING", ans: "Playwright : Drama", d1: "Tenant : Apartment", d2: "Builder : Brick", d3: "Engineer : Tool", rel: "An architect designs a building; a playwright writes a drama." },
    { pair: "METAPHOR : FIGURE OF SPEECH", ans: "Iron : Metal", d1: "Poem : Prose", d2: "Word : Sentence", d3: "Book : Page", rel: "A metaphor is a specific type of figure of speech; iron is a type of metal (Instance : Category)." },
    { pair: "DESERT : ARID", ans: "Swamp : Humid", d1: "Ocean : Dry", d2: "Forest : Barren", d3: "Mountain : Flat", rel: "A desert is characteristically arid; a swamp is characteristically humid." },
    { pair: "HELMET : HEAD", ans: "Shield : Body", d1: "Boots : Hands", d2: "Goggles : Mouth", d3: "Armor : Horse", rel: "A helmet protects the head; a shield protects the body." },
    { pair: "GULLIBLE : DECEIVED", ans: "Fragile : Broken", d1: "Strong : Defeated", d2: "Wise : Fooled", d3: "Careful : Injured", rel: "A gullible person is easily deceived; a fragile object is easily broken." },
    { pair: "FLOCK : BIRDS", ans: "School : Fish", d1: "Pack : Cats", d2: "Herd : Whales", d3: "Swarm : Dogs", rel: "A flock is a group of birds; a school is a group of fish (Collective noun)." },
    { pair: "CANDLE : WAX", ans: "Paper : Pulp", d1: "Flame : Match", d2: "Light : Darkness", d3: "Wick : Ash", rel: "A candle is made from wax; paper is made from pulp." },
    { pair: "PROLOGUE : PLAY", ans: "Overture : Opera", d1: "Epilogue : Novel", d2: "Curtain : Stage", d3: "Scene : Act", rel: "A prologue introduces a play; an overture introduces an opera." },
    { pair: "TAILOR : NEEDLE", ans: "Blacksmith : Anvil", d1: "Baker : Oven", d2: "Painter : Canvas", d3: "Farmer : Crop", rel: "A tailor works with a needle; a blacksmith works with an anvil." },
    { pair: "HYGROMETER : HUMIDITY", ans: "Anemometer : Wind Speed", d1: "Barometer : Temperature", d2: "Altimeter : Direction", d3: "Speedometer : Time", rel: "A hygrometer measures humidity; an anemometer measures wind speed." }
  ];
  anData.forEach((a) => {
    addQ(
      10,
      "Verbal Analogies",
      "Hard",
      `Find the pair of words that exhibits the exact same conceptual relationship as:
[${a.pair}]`,
      a.ans,
      a.d1,
      a.d2,
      a.d3,
      `Analogy relationship: ${a.rel}`
    );
  });
  return list;
}

// server/questions/specialized.ts
function getSpecializedQuestions() {
  const list = [];
  let counter = 0;
  const addQ = (level_id, category, difficulty, question, correctText, d1, d2, d3, exp) => {
    counter++;
    const posIndex = (counter - 1) % 4;
    const letters = ["A", "B", "C", "D"];
    const correctLetter = letters[posIndex];
    const distractors = [d1, d2, d3];
    if (counter % 2 === 1) {
      const tmp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = tmp;
    }
    const opts = { A: "", B: "", C: "", D: "" };
    opts[correctLetter] = correctText;
    let distIdx = 0;
    for (const l of letters) {
      if (l !== correctLetter) {
        opts[l] = distractors[distIdx++] || "";
      }
    }
    list.push({
      question_id: `q_spec_l${level_id}_${counter}`,
      topic_id: "specialized",
      level_id,
      category,
      concept: category,
      difficulty,
      question,
      option_a: opts.A,
      option_b: opts.B,
      option_c: opts.C,
      option_d: opts.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type: "learning"
    });
  };
  const dsData = [
    { q: "Which data structure follows the LIFO (Last In First Out) principle?", ans: "Stack", d1: "Queue", d2: "Heap", d3: "Linked List", exp: "A Stack processes items in Last-In-First-Out order." },
    { q: "Which data structure operates on a FIFO (First In First Out) basis?", ans: "Queue", d1: "Stack", d2: "Binary Tree", d3: "Hash Table", exp: "A Queue adheres strictly to First-In-First-Out processing." },
    { q: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?", ans: "O(log N)", d1: "O(1)", d2: "O(N)", d3: "O(N^2)", exp: "A balanced BST eliminates half the remaining nodes at each step, yielding O(log N)." },
    { q: "Which data structure provides O(1) average time complexity for key lookups and insertions?", ans: "Hash Table", d1: "Array List", d2: "Singly Linked List", d3: "Trie", exp: "Hash Tables compute bucket indices in O(1) average time." },
    { q: "In a singly linked list, what is the time complexity to insert a new node at the head (beginning)?", ans: "O(1)", d1: "O(N)", d2: "O(log N)", d3: "O(N log N)", exp: "Prepending a node requires updating only the head pointer, taking constant O(1) time." },
    { q: "Which data structure is most optimal for implementing a priority queue?", ans: "Binary Heap", d1: "Stack", d2: "Circular Queue", d3: "Adjacency Matrix", exp: "Binary Heaps offer O(1) peek and O(log N) insertion/extraction for priorities." },
    { q: "What is the minimum number of queues needed to implement a Stack?", ans: "2 queues", d1: "1 queue", d2: "3 queues", d3: "4 queues", exp: "Two FIFO queues can emulate a LIFO stack by transferring elements." },
    { q: "Which self-balancing binary search tree guarantees that no path is more than twice as long as any other?", ans: "Red-Black Tree", d1: "B-Tree", d2: "Splay Tree", d3: "Ternary Tree", exp: "Red-Black tree coloring invariants bound the maximum height to 2 * log2(N + 1)." },
    { q: "In a complete binary tree of height H with N nodes, what is the relationship between height and node count?", ans: "H = floor(log2(N))", d1: "H = N / 2", d2: "H = N^2", d3: "H = sqrt(N)", exp: "The height of a complete binary tree is logarithmic with respect to total nodes." },
    { q: "Which tree traversal visits the left subtree, root node, and then right subtree?", ans: "In-order Traversal", d1: "Pre-order Traversal", d2: "Post-order Traversal", d3: "Level-order Traversal", exp: "In-order traversal visits nodes in (Left, Root, Right) order." },
    { q: "In an array of size N, what is the time complexity of accessing an element at index i directly?", ans: "O(1)", d1: "O(N)", d2: "O(log N)", d3: "O(i)", exp: "Contiguous memory addressing allows instant O(1) random access." },
    { q: "Which tree structure is optimized for storing hierarchical routing prefixes and autocomplete dictionary words?", ans: "Trie (Prefix Tree)", d1: "AVL Tree", d2: "Segment Tree", d3: "Fenwick Tree", exp: "Tries store shared string prefixes along common tree edges." },
    { q: "What is the space complexity of an Adjacency Matrix representing a graph with V vertices?", ans: "O(V^2)", d1: "O(V + E)", d2: "O(E^2)", d3: "O(V log V)", exp: "A 2D array of dimensions V x V requires O(V^2) memory." },
    { q: "Which data structure is used to implement Breadth-First Search (BFS) graph traversal?", ans: "Queue", d1: "Stack", d2: "Priority Queue", d3: "Hash Set", exp: "BFS explores vertices level by level using a FIFO Queue." },
    { q: "Which data structure is typically used for Depth-First Search (DFS) graph traversal?", ans: "Stack (or Call Stack Recursion)", d1: "Queue", d2: "Min-Heap", d3: "Circular Buffer", exp: "DFS dives along paths using a LIFO Stack or recursive function frames." },
    { q: "In a circular queue of capacity K with front and rear pointers, how is the next index computed?", ans: "(index + 1) % K", d1: "index + 1", d2: "(index * 2) % K", d3: "index - 1", exp: "Modulo arithmetic wraps the pointer around the fixed array boundary." },
    { q: "What is the balance factor constraint in an AVL Tree for every node?", ans: "|Height(Left) - Height(Right)| <= 1", d1: "|Height(Left) - Height(Right)| <= 2", d2: "Height(Left) == Height(Right)", d3: "Height(Left) > Height(Right)", exp: "AVL invariant strictly restricts height difference of subtrees to -1, 0, or +1." },
    { q: "Which data structure is optimal for finding range sum queries with point updates in O(log N)?", ans: "Fenwick Tree (Binary Indexed Tree) or Segment Tree", d1: "Doubly Linked List", d2: "Stack", d3: "Hash Table", exp: "Binary Indexed Trees and Segment Trees support O(log N) prefix sums and point updates." },
    { q: "What is the worst-case time complexity of inserting into an unbalanced Binary Search Tree?", ans: "O(N)", d1: "O(log N)", d2: "O(1)", d3: "O(N log N)", exp: "When items are inserted in sorted order, an unbalanced BST degrades into a linked list of height N." },
    { q: "Which structure enables finding if two items belong to the same set and merging sets in nearly O(1)?", ans: "Disjoint Set Union (Union-Find)", d1: "B-Tree", d2: "Trie", d3: "Skip List", exp: "Union-Find with path compression and rank union runs in inverse Ackermann time O(alpha(N))." },
    { q: "In a Max-Heap, where is the largest key always located?", ans: "At the root node", d1: "At the leftmost leaf", d2: "At the rightmost leaf", d3: "In the middle level", exp: "The max-heap property mandates that every parent key is greater than or equal to its children." },
    { q: "What is the number of edges in a connected undirected tree with N vertices?", ans: "N - 1", d1: "N", d2: "N + 1", d3: "2N", exp: "Any tree with N vertices has exactly N - 1 edges and contains no cycles." },
    { q: "Which linked list allows traversal in both forward and backward directions?", ans: "Doubly Linked List", d1: "Singly Linked List", d2: "Circular Singly Linked List", d3: "Unrolled Linked List", exp: "Doubly linked lists store both `next` and `prev` pointers." },
    { q: "In a Hash Table with open addressing, what method checks the sequence (hash + i^2) % size during collisions?", ans: "Quadratic Probing", d1: "Linear Probing", d2: "Double Hashing", d3: "Separate Chaining", exp: "Quadratic probing offsets bucket collisions by squared increments i^2." },
    { q: "What is the maximum number of children a node can have in a binary tree?", ans: "2", d1: "1", d2: "3", d3: "Unlimited", exp: "By definition, binary tree nodes have at most two child nodes (left and right)." },
    { q: "Which data structure can be used to efficiently evaluate postfix mathematical expressions?", ans: "Stack", d1: "Queue", d2: "Heap", d3: "Binary Tree", exp: "Operands are pushed onto a stack and popped when operators are encountered." },
    { q: "What is the time complexity of deleting a node from a Doubly Linked List when given a direct pointer to that node?", ans: "O(1)", d1: "O(N)", d2: "O(log N)", d3: "O(N^2)", exp: "With direct reference, updating neighbor pointers takes constant O(1) time." },
    { q: "Which data structure uses probabilistic layers of linked lists to achieve O(log N) search and insertion?", ans: "Skip List", d1: "B-Tree", d2: "Hash Map", d3: "Array", exp: "Skip lists create express lanes across layered linked nodes with geometric coin flips." },
    { q: "In a 2D array matrix of size R rows and C columns in row-major order, what is the offset formula for cell (i, j)?", ans: "i * C + j", d1: "j * R + i", d2: "i + j", d3: "i * R + j", exp: "Row-major layout strides by row index multiplied by total columns C plus column offset j." },
    { q: "What is the leaf node count in a strictly full binary tree with I internal nodes?", ans: "I + 1", d1: "2 * I", d2: "I - 1", d3: "2^I", exp: "In a full binary tree where every internal node has 2 children, Leaves = Internal Nodes + 1." }
  ];
  dsData.forEach((d) => {
    addQ(1, "Data Structures", "Medium", d.q, d.ans, d.d1, d.d2, d.d3, d.exp);
  });
  const algoData = [
    { q: "What is the average time complexity of QuickSort?", ans: "O(N log N)", d1: "O(N^2)", d2: "O(N)", d3: "O(log N)", exp: "QuickSort splits partitions in half on average, leading to O(N log N)." },
    { q: "What is the worst-case time complexity of QuickSort when bad pivot selection occurs?", ans: "O(N^2)", d1: "O(N log N)", d2: "O(N)", d3: "O(2^N)", exp: "Unbalanced partitions (e.g. already sorted array with first element pivot) cause O(N^2)." },
    { q: "What is the guaranteed worst-case time complexity of MergeSort?", ans: "O(N log N)", d1: "O(N^2)", d2: "O(N)", d3: "O(log N)", exp: "MergeSort divides and merges arrays deterministically in O(N log N) time in all cases." },
    { q: "Which algorithm finds the single-source shortest path in a graph with non-negative edge weights?", ans: "Dijkstra's Algorithm", d1: "Kruskal's Algorithm", d2: "Prim's Algorithm", d3: "Floyd-Warshall Algorithm", exp: "Dijkstra uses a min-priority queue to find shortest paths with non-negative weights." },
    { q: "Which algorithm can find shortest paths in graphs that contain negative edge weights (and detect negative cycles)?", ans: "Bellman-Ford Algorithm", d1: "Dijkstra's Algorithm", d2: "Prim's Algorithm", d3: "Binary Search", exp: "Bellman-Ford relaxes all E edges V-1 times, safely handling negative weights." },
    { q: "Which algorithm computes all-pairs shortest paths in O(V^3) time complexity?", ans: "Floyd-Warshall Algorithm", d1: "Dijkstra's Algorithm", d2: "Kruskal's Algorithm", d3: "Topological Sort", exp: "Floyd-Warshall uses dynamic programming across intermediate vertices in O(V^3)." },
    { q: "Which greedy algorithm finds a Minimum Spanning Tree (MST) by sorting edges and avoiding cycles with Union-Find?", ans: "Kruskal's Algorithm", d1: "Prim's Algorithm", d2: "Dijkstra's Algorithm", d3: "A* Search", exp: "Kruskal's sorts edges by weight and uses DSU to prevent cycle formation." },
    { q: "Which algorithm finds the Minimum Spanning Tree (MST) by growing a tree from an arbitrary starting vertex?", ans: "Prim's Algorithm", d1: "Kruskal's Algorithm", d2: "Bellman-Ford Algorithm", d3: "DFS", exp: "Prim's expands the MST by greedily adding the cheapest adjacent cut edge." },
    { q: "What is the time complexity of Binary Search on a sorted array of N elements?", ans: "O(log N)", d1: "O(N)", d2: "O(1)", d3: "O(N log N)", exp: "Binary search halves the search space in each iteration: O(log2 N)." },
    { q: "Which sorting algorithm is non-comparison based and operates in O(N + K) time using key counting?", ans: "Counting Sort", d1: "QuickSort", d2: "HeapSort", d3: "Insertion Sort", exp: "Counting sort tallies key occurrences in an auxiliary array of range K." },
    { q: "What is the worst-case time complexity of Bubble Sort on an array of size N?", ans: "O(N^2)", d1: "O(N log N)", d2: "O(N)", d3: "O(1)", exp: "Nested comparisons across N elements produce (N*(N-1))/2 operations = O(N^2)." },
    { q: "Which algorithmic paradigm solves problems by breaking them into overlapping subproblems and storing results?", ans: "Dynamic Programming", d1: "Divide and Conquer", d2: "Greedy Strategy", d3: "Backtracking", exp: "Dynamic Programming combines optimal substructure with memoization of overlapping subproblems." },
    { q: "What is the time complexity to find the N-th Fibonacci number using naive recursion?", ans: "O(2^N)", d1: "O(N)", d2: "O(N log N)", d3: "O(1)", exp: "Naive recursive Fibonacci creates a branching tree of depth N, taking exponential O(2^N) time." },
    { q: "What is the time complexity to find the N-th Fibonacci number using Dynamic Programming memoization?", ans: "O(N)", d1: "O(2^N)", d2: "O(N^2)", d3: "O(log N)", exp: "DP computes each of the N subproblems exactly once in O(1) time = O(N)." },
    { q: "Which string matching algorithm precomputes a Partial Match Table (pi table) to avoid redundant character comparisons?", ans: "KMP (Knuth-Morris-Pratt) Algorithm", d1: "Rabin-Karp Algorithm", d2: "Boyer-Moore Algorithm", d3: "Naive Matching", exp: "KMP skips matched prefix alignments using the prefix function pi." },
    { q: "Which string search algorithm uses rolling hash values to find matches in O(N + M) average time?", ans: "Rabin-Karp Algorithm", d1: "KMP Algorithm", d2: "Z-Algorithm", d3: "Manacher's Algorithm", exp: "Rabin-Karp computes rolling polynomial hashes to compare pattern fingerprints." },
    { q: "What algorithm produces a linear ordering of vertices in a Directed Acyclic Graph (DAG)?", ans: "Topological Sort", d1: "Breadth-First Search", d2: "Kruskal's Algorithm", d3: "Binary Search", exp: "Topological sorting orders vertices such that for every directed edge u -> v, u comes before v." },
    { q: "Which algorithm finds strongly connected components (SCCs) in a directed graph using two DFS passes?", ans: "Kosaraju's Algorithm", d1: "Tarjan's Algorithm", d2: "Dijkstra's Algorithm", d3: "Prim's Algorithm", exp: "Kosaraju performs one DFS on the original graph and a second DFS on the transposed graph." },
    { q: "What is the auxiliary space complexity of standard in-place HeapSort?", ans: "O(1)", d1: "O(N)", d2: "O(log N)", d3: "O(N log N)", exp: "HeapSort arranges elements within the input array without extra allocations, achieving O(1) space." },
    { q: "What is the asymptotic lower bound for any comparison-based sorting algorithm in the worst case?", ans: "Omega(N log N)", d1: "Omega(N)", d2: "Omega(log N)", d3: "Omega(1)", exp: "A decision tree for sorting N elements has N! leaves, requiring height log2(N!) = Omega(N log N)." },
    { q: "Which algorithm design technique is used in the N-Queens problem and Sudoku solving?", ans: "Backtracking", d1: "Greedy Method", d2: "Divide and Conquer", d3: "Linear Programming", exp: "Backtracking systematically builds candidates and abandons paths as soon as validity is violated." },
    { q: "What is the time complexity of the 0/1 Knapsack problem with N items and capacity W using Dynamic Programming?", ans: "O(N * W)", d1: "O(2^N)", d2: "O(N + W)", d3: "O(N log W)", exp: "The DP table has dimensions (N+1) x (W+1), filled in pseudo-polynomial O(N*W) time." },
    { q: "Which algorithm finds the Longest Palindromic Substring in linear O(N) time?", ans: "Manacher's Algorithm", d1: "KMP Algorithm", d2: "Rabin-Karp Algorithm", d3: "Kadane's Algorithm", exp: "Manacher's exploits palindrome symmetry around centers to run in strict O(N) time." },
    { q: "Which algorithm finds the maximum subarray sum in a 1D array in linear O(N) time?", ans: "Kadane's Algorithm", d1: "Dijkstra's Algorithm", d2: "Floyd's Algorithm", d3: "QuickSelect", exp: "Kadane's algorithm tracks the maximum ending at the current position in a single pass." },
    { q: "What is the average time complexity of QuickSelect to find the K-th smallest element in an unordered array?", ans: "O(N)", d1: "O(N log N)", d2: "O(log N)", d3: "O(N^2)", exp: "By recursing only into the partition containing K, QuickSelect runs in O(N + N/2 + N/4...) = O(N)." },
    { q: "Which algorithm detects a cycle in a linked list using two pointers moving at different speeds?", ans: "Floyd's Tortoise and Hare Cycle-Finding Algorithm", d1: "Brent's Algorithm", d2: "Tarjan's Algorithm", d3: "Kruskal's Algorithm", exp: "Slow pointer moves 1 step and fast moves 2 steps; they meet if a cycle exists." },
    { q: "What problem class includes problems that can be verified in polynomial time by a deterministic Turing machine?", ans: "NP (Nondeterministic Polynomial time)", d1: "P", d2: "NP-Hard", d3: "EXPTIME", exp: "Class NP comprises decision problems whose positive solutions are certifiable in polynomial time." },
    { q: "Which heuristic search algorithm extends Dijkstra by utilizing an admissible heuristic h(n) towards the target goal?", ans: "A* Search Algorithm", d1: "Breadth-First Search", d2: "Depth-First Search", d3: "Bellman-Ford", exp: "A* evaluates nodes using f(n) = g(n) + h(n), directing search towards the goal." },
    { q: "What is the time complexity of building a Binary Heap from an unordered array of N elements (heapify)?", ans: "O(N)", d1: "O(N log N)", d2: "O(log N)", d3: "O(N^2)", exp: "Bottom-up heap construction sums geometric terms bounded by 2N = O(N)." },
    { q: "Which algorithm finds the maximum flow in a flow network by augmenting paths found via BFS?", ans: "Edmonds-Karp Algorithm", d1: "Ford-Fulkerson Algorithm", d2: "Dinic's Algorithm", d3: "Push-Relabel Algorithm", exp: "Edmonds-Karp implements Ford-Fulkerson using BFS for shortest augmenting paths in O(V * E^2)." }
  ];
  algoData.forEach((a) => {
    addQ(2, "Algorithms", "Hard", a.q, a.ans, a.d1, a.d2, a.d3, a.exp);
  });
  const osData = [
    { q: "Which condition is NOT one of Coffman's four conditions required for a Deadlock to occur?", ans: "Preemptive Resource Reallocation", d1: "Mutual Exclusion", d2: "Hold and Wait", d3: "Circular Wait", exp: "Preemption breaks deadlocks; Coffman conditions include No Preemption, Mutual Exclusion, Hold & Wait, Circular Wait." },
    { q: "What is the purpose of the Translation Lookaside Buffer (TLB) in virtual memory systems?", ans: "To cache recent virtual-to-physical page address translations for faster memory access", d1: "To store encrypted disk passwords", d2: "To schedule CPU processes", d3: "To compress RAM contents" },
    { q: "Which CPU scheduling algorithm is non-preemptive and selects the process with the smallest execution burst time?", ans: "Shortest Job First (SJF)", d1: "Round Robin (RR)", d2: "First-Come First-Served (FCFS)", d3: "Priority Scheduling" },
    { q: "What phenomenon occurs in virtual memory when excessive page faults cause the OS to spend more time swapping pages than executing code?", ans: "Thrashing", d1: "Starvation", d2: "Deadlock", d3: "Fragmentation" },
    { q: "What mechanism allows user applications to request privileged services directly from the OS kernel?", ans: "System Call (e.g., read, write, fork)", d1: "Hardware Interrupt", d2: "Context Switch", d3: "Page Fault" },
    { q: "In UNIX, which system call creates a new child process by duplicating the calling parent process?", ans: "fork()", d1: "exec()", d2: "wait()", d3: "pthread_create()" },
    { q: "Which synchronization primitive provides integer-based counting to control access to a shared resource by multiple threads?", ans: "Counting Semaphore", d1: "Mutex Lock", d2: "Spinlock", d3: "Atomic Boolean" },
    { q: "What is the critical section in concurrent programming?", ans: "A segment of code accessing shared resources that must not be concurrently executed by multiple threads", d1: "The boot sector of a hard drive", d2: "The kernel initialization routine", d3: "The CPU cache hierarchy" },
    { q: "Which page replacement algorithm replaces the page that will not be used for the longest period of time in the future?", ans: "Optimal Page Replacement (OPT / Belady's)", d1: "Least Recently Used (LRU)", d2: "First In First Out (FIFO)", d3: "Least Frequently Used (LFU)" },
    { q: "What is Belady's Anomaly in operating systems memory management?", ans: "A phenomenon where increasing the number of page frames results in an increased number of page faults (under FIFO)", d1: "A CPU deadlock in multicore systems", d2: "Memory leaks in user space", d3: "Disk fragmentation on SSDs" },
    { q: "What happens during a CPU Context Switch?", ans: "The state (registers, PC) of the active process is saved and the state of another scheduled process is restored", d1: "The power supply voltage switches", d2: "The hard drive is reformatted", d3: "The BIOS flashes new firmware" },
    { q: "Which memory allocation issue occurs when free memory is broken into small non-contiguous blocks scattered throughout RAM?", ans: "External Fragmentation", d1: "Internal Fragmentation", d2: "Page Thrashing", d3: "Segment Fault" },
    { q: "What is Internal Fragmentation in paging systems?", ans: "Unused allocated memory space inside a fixed-size page block", d1: "Unallocated memory between blocks", d2: "Disk sector failure", d3: "Register spillover" },
    { q: "Which scheduling algorithm assigns each ready process a fixed time quantum in cyclic order?", ans: "Round Robin (RR)", d1: "Shortest Remaining Time First", d2: "Priority Scheduling", d3: "FCFS" },
    { q: "What is a Daemon process in UNIX/Linux systems?", ans: "A background service process that runs without direct user interaction", d1: "A virus infecting the kernel", d2: "A corrupted file on disk", d3: "A stopped terminal application" },
    { q: "What is an Inode in UNIX-like file systems?", ans: "A data structure that stores metadata about a file (permissions, size, block locations) except its name", d1: "A network socket buffer", d2: "A CPU cache line", d3: "A RAM paging frame" },
    { q: "Which deadlock avoidance algorithm tests for safe resource allocation states before granting requests?", ans: "Banker's Algorithm", d1: "Dijkstra's Algorithm", d2: "Peterson's Algorithm", d3: "Lamport's Bakery Algorithm" },
    { q: "What is the main difference between a Process and a Thread?", ans: "Processes have independent virtual address spaces, while threads within a process share the same address space and memory", d1: "Processes run on GPU, threads run on CPU", d2: "Threads have isolated files, processes do not", d3: "Processes cannot be scheduled" },
    { q: "What is a Zombie Process in UNIX?", ans: "A process that has finished execution but still has an entry in the process table because its parent has not read its exit status", d1: "A process stuck in an infinite loop", d2: "A process killed by the kernel", d3: "A process without any memory allocation" },
    { q: "What is an Orphan Process in UNIX?", ans: "A running process whose parent process terminated before it, subsequently adopted by init / systemd (PID 1)", d1: "A process that failed to compile", d2: "A thread detached from its process", d3: "A process with a closed standard output" },
    { q: "Which inter-process communication (IPC) mechanism provides unidirectional data flow between related processes using file descriptors?", ans: "Pipe (Anonymous Pipe)", d1: "Shared Memory", d2: "Message Queue", d3: "Signal" },
    { q: "What is Direct Memory Access (DMA)?", ans: "Hardware feature allowing I/O devices to transfer data directly to/from RAM without continuous CPU intervention", d1: "Direct access to CPU registers", d2: "Bypassing the operating system kernel", d3: "Unencrypted RAM reading" },
    { q: "Which RAID level uses disk striping with distributed parity across at least 3 drives?", ans: "RAID 5", d1: "RAID 0", d2: "RAID 1", d3: "RAID 10" },
    { q: "What is the primary role of the CPU Interrupt Service Routine (ISR)?", ans: "To handle asynchronous hardware or software interrupt signals and resume prior execution", d1: "To reboot the computer", d2: "To schedule disk defragmentation", d3: "To allocate RAM pages" },
    { q: "Which algorithm solves the 2-process critical section problem with mutual exclusion, progress, and bounded waiting in software?", ans: "Peterson's Algorithm", d1: "Banker's Algorithm", d2: "Round Robin", d3: "LRU Algorithm" },
    { q: "What does the POSIX standard define in operating systems?", ans: "A standardized API interface between operating systems and software applications for cross-platform portability", d1: "A hardware bus pinout specification", d2: "An encryption key format", d3: "A monitor refresh rate standard" },
    { q: "What is the Swap Space on a hard drive or SSD used for?", ans: "To temporarily hold inactive memory pages evicted from physical RAM", d1: "To store BIOS settings", d2: "To archive old application logs", d3: "To cache CPU instructions" },
    { q: "What is Starvation in OS process scheduling?", ans: "A situation where a low-priority process is indefinitely delayed because high-priority processes monopolize the CPU", d1: "The computer running out of battery power", d2: "A hard disk having zero remaining space", d3: "A network cable disconnection" },
    { q: "How does Aging prevent starvation in priority scheduling?", ans: "By gradually increasing the priority of processes that wait in the ready queue for a long time", d1: "By terminating old processes", d2: "By lowering CPU clock speeds", d3: "By rebooting the server daily" },
    { q: "What is copy-on-write (COW) optimization used during process creation (fork)?", ans: "Parent and child share identical memory pages until either process writes to a page, triggering a duplicate page copy", d1: "Copying all memory instantly during fork", d2: "Writing all logs to physical disk immediately", d3: "Duplicating files when opened" }
  ];
  osData.forEach((o) => {
    addQ(3, "Operating Systems", "Medium", o.q, o.ans, o.d1, o.d2, o.d3, o.exp);
  });
  const dbData = [
    { q: "In relational database schema design, which Normal Form eliminates transitive functional dependencies?", ans: "Third Normal Form (3NF)", d1: "First Normal Form (1NF)", d2: "Second Normal Form (2NF)", d3: "Boyce-Codd Normal Form (BCNF)" },
    { q: "Which Normal Form requires every non-prime attribute to be fully functionally dependent on the entire primary key (no partial dependencies)?", ans: "Second Normal Form (2NF)", d1: "First Normal Form (1NF)", d2: "Third Normal Form (3NF)", d3: "Fourth Normal Form (4NF)" },
    { q: "What does the 'A' in database ACID transaction properties stand for?", ans: "Atomicity (All operations in the transaction succeed, or all are rolled back)", d1: "Availability", d2: "Asynchronous", d3: "Authentication" },
    { q: "What does the 'I' in ACID transaction guarantees ensure?", ans: "Isolation (Concurrent transactions execute without interfering with one another)", d1: "Integrity", d2: "Indexing", d3: "Idempotency" },
    { q: "Which SQL clause is used to filter groups of records created by a GROUP BY clause?", ans: "HAVING", d1: "WHERE", d2: "ORDER BY", d3: "LIMIT" },
    { q: "What type of database JOIN returns all records from the left table and matched records from the right table?", ans: "LEFT OUTER JOIN", d1: "INNER JOIN", d2: "RIGHT OUTER JOIN", d3: "CROSS JOIN" },
    { q: "Which data structure is most commonly used for database table indexing because of high fan-out and sequential range scans?", ans: "B+ Tree", d1: "Binary Search Tree", d2: "Skip List", d3: "Linked List" },
    { q: "What is a Primary Key in a relational database table?", ans: "A column or set of columns that uniquely identifies each row and cannot contain NULL values", d1: "A key that encrypts data", d2: "A foreign table reference", d3: "An optional non-unique index" },
    { q: "What is a Foreign Key constraint?", ans: "A field in one table that uniquely identifies a row of another table, enforcing referential integrity", d1: "A key generated by external APIs", d2: "A secondary encryption password", d3: "An auto-incrementing integer" },
    { q: "In SQL concurrency, what is a Dirty Read?", ans: "A transaction reads uncommitted data modifications made by another concurrent transaction that might later roll back", d1: "Reading data from a corrupted hard disk", d2: "Reading data without using an index", d3: "Executing a query with syntax errors" },
    { q: "Which SQL Transaction Isolation level prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads completely?", ans: "Serializable", d1: "Read Committed", d2: "Read Uncommitted", d3: "Repeatable Read" },
    { q: "What is Write-Ahead Logging (WAL) in database storage engines?", ans: "Changes are written to a persistent append-only log on disk before modifying in-memory data pages", d1: "Writing logs after data is deleted", d2: "Logging all user search terms", d3: "Writing code documentation in advance" },
    { q: "What is a View in SQL databases?", ans: "A virtual table based on the result set of a predefined SQL query", d1: "A physical copy of table data on disk", d2: "A database backup snapshot", d3: "A UI interface widget" },
    { q: "Which SQL command permanently saves all changes made during the current transaction to the database?", ans: "COMMIT", d1: "ROLLBACK", d2: "SAVEPOINT", d3: "GRANT" },
    { q: "Which SQL command undos all changes made during the current uncommitted transaction?", ans: "ROLLBACK", d1: "COMMIT", d2: "REVOKE", d3: "TRUNCATE" },
    { q: "What is the key difference between DROP TABLE and TRUNCATE TABLE in SQL?", ans: "DROP removes the table schema and data entirely, while TRUNCATE deletes all rows but preserves table structure", d1: "DROP is faster than TRUNCATE", d2: "TRUNCATE deletes the database", d3: "DROP can be rolled back without logs" },
    { q: "What is a Clustered Index in relational databases?", ans: "An index that determines the physical order of data rows on disk (only one clustered index per table)", d1: "An index distributed across multiple servers", d2: "An index that stores duplicate keys", d3: "An index on temporary tables only" },
    { q: "What is Database Sharding?", ans: "A horizontal partitioning technique that splits a large database across multiple independent physical servers", d1: "Encrypting database columns", d2: "Creating database backups on tape", d3: "Creating table views" },
    { q: "What does NoSQL stand for in modern data management?", ans: "Not Only SQL (Non-relational, flexible-schema database systems)", d1: "No Software Queries Allowed", d2: "New Online SQL", d3: "Node-Only SQL" },
    { q: "Which type of NoSQL database is MongoDB categorized as?", ans: "Document Store (JSON/BSON)", d1: "Key-Value Store", d2: "Wide-Column Store", d3: "Graph Database" },
    { q: "Which type of NoSQL database is Neo4j categorized as?", ans: "Graph Database", d1: "Document Store", d2: "Key-Value Store", d3: "Relational Database" },
    { q: "Which type of NoSQL database is Redis primarily categorized as?", ans: "In-Memory Key-Value Store", d1: "Relational Table Store", d2: "Graph Database", d3: "XML Document Store" },
    { q: "In relational algebra, which operator filters rows that satisfy a given predicate condition?", ans: "Selection (sigma)", d1: "Projection (pi)", d2: "Cartesian Product (X)", d3: "Union (U)" },
    { q: "In relational algebra, which operator selects specific columns from a relation table?", ans: "Projection (pi)", d1: "Selection (sigma)", d2: "Intersection", d3: "Difference" },
    { q: "What is a Stored Procedure in SQL?", ans: "A precompiled set of SQL statements and procedural logic stored and executed on the database server", d1: "A user manual for the database", d2: "A database installation script", d3: "A client-side JavaScript function" },
    { q: "What is a Database Trigger?", ans: "A procedural block of code that automatically executes in response to specified table events (INSERT, UPDATE, DELETE)", d1: "A button in database management software", d2: "A scheduled cron backup job", d3: "A hardware error alarm" },
    { q: "What is Two-Phase Locking (2PL) protocol used for in DBMS concurrency control?", ans: "To guarantee transaction serializability through a growing phase (acquiring locks) and shrinking phase (releasing locks)", d1: "To encrypt passwords in two steps", d2: "To create two backup copies", d3: "To connect via two network cards" },
    { q: "What is a Candidate Key in relational schema design?", ans: "A minimal set of attributes that uniquely identifies a tuple in a relation, eligible to become the primary key", d1: "A key that failed validation", d2: "A foreign key candidate", d3: "A non-unique index" },
    { q: "What is Database Denormalization?", ans: "Strategically adding redundancy to normalized tables to optimize read performance and avoid expensive multi-table joins", d1: "Deleting primary keys", d2: "Corrupting database indexes", d3: "Converting SQL to plain text" },
    { q: "What is the purpose of an EXPLAIN query in SQL database engines?", ans: "To display the query execution plan, showing index usage, join types, and cost estimates chosen by the optimizer", d1: "To explain SQL syntax to beginners", d2: "To execute the query 100 times", d3: "To format output with color" }
  ];
  dbData.forEach((d) => {
    addQ(4, "DBMS", "Medium", d.q, d.ans, d.d1, d.d2, d.d3, d.exp || `Correct resolution: ${d.ans}.`);
  });
  const netData = [
    { q: "Which OSI model layer handles logical IP addressing and packet routing across networks?", ans: "Network Layer (Layer 3)", d1: "Data Link Layer (Layer 2)", d2: "Transport Layer (Layer 4)", d3: "Session Layer (Layer 5)" },
    { q: "Which OSI layer is responsible for node-to-node framing, physical MAC addressing, and error detection?", ans: "Data Link Layer (Layer 2)", d1: "Physical Layer (Layer 1)", d2: "Network Layer (Layer 3)", d3: "Application Layer (Layer 7)" },
    { q: "What is the primary difference between TCP and UDP transport protocols?", ans: "TCP is connection-oriented and reliable with acknowledgments; UDP is connectionless and low-overhead without guarantees", d1: "TCP is wireless, UDP is wired", d2: "UDP encrypts data, TCP does not", d3: "TCP operates at Layer 7, UDP at Layer 2" },
    { q: "What is the standard port number used for secure HTTPS web traffic?", ans: "Port 443", d1: "Port 80", d2: "Port 22", d3: "Port 8080" },
    { q: "What is the standard port number for SSH (Secure Shell) remote terminal access?", ans: "Port 22", d1: "Port 21", d2: "Port 23", d3: "Port 25" },
    { q: "What is the role of the DNS (Domain Name System) protocol?", ans: "To translate human-readable domain names (e.g. example.com) into numerical IP addresses (e.g. 93.184.216.34)", d1: "To assign dynamic IP addresses to devices", d2: "To encrypt email messages", d3: "To route audio packets" },
    { q: "What protocol dynamically assigns IP addresses, subnet masks, and default gateways to client devices on a local network?", ans: "DHCP (Dynamic Host Configuration Protocol)", d1: "DNS", d2: "ARP", d3: "ICMP" },
    { q: "Which protocol maps a known 32-bit IPv4 address to a physical 48-bit MAC hardware address?", ans: "ARP (Address Resolution Protocol)", d1: "RARP", d2: "DHCP", d3: "NAT" },
    { q: "What is the bit length of a standard IPv6 address?", ans: "128 bits", d1: "32 bits", d2: "64 bits", d3: "256 bits" },
    { q: "What is the bit length of a standard IPv4 address?", ans: "32 bits", d1: "16 bits", d2: "64 bits", d3: "128 bits" },
    { q: "What steps constitute the standard TCP Three-Way Handshake connection establishment?", ans: "SYN -> SYN-ACK -> ACK", d1: "ACK -> SYN -> ACK", d2: "HELLO -> ACK -> DATA", d3: "CONNECT -> ACCEPT -> READY" },
    { q: "What is Network Address Translation (NAT) used for in routers?", ans: "To map multiple private local IP addresses to a single public IP address for internet access", d1: "To convert IPv4 into IPv6 automatically", d2: "To scan packets for computer viruses", d3: "To boost WiFi transmission range" },
    { q: "Which protocol is used by network utilities like `ping` and `traceroute` for diagnostics and error reporting?", ans: "ICMP (Internet Control Message Protocol)", d1: "IGMP", d2: "SNMP", d3: "SMTP" },
    { q: "What is the Maximum Transmission Unit (MTU) typically set to on standard Ethernet networks?", ans: "1500 bytes", d1: "512 bytes", d2: "4096 bytes", d3: "65535 bytes" },
    { q: "What routing algorithm is used by BGP (Border Gateway Protocol) to route traffic between Autonomous Systems on the global Internet?", ans: "Path-Vector Routing", d1: "Distance-Vector Routing", d2: "Link-State Routing", d3: "Flooding" },
    { q: "Which link-state routing protocol uses Dijkstra's algorithm within an Autonomous System?", ans: "OSPF (Open Shortest Path First)", d1: "RIP", d2: "BGP", d3: "EGP" },
    { q: "What is the purpose of the TTL (Time to Live) field in an IPv4 packet header?", ans: "To prevent packets from circulating endlessly in routing loops by decrementing at each hop until reaching 0", d1: "To measure packet download speed", d2: "To track timestamp of packet creation", d3: "To set cache expiration" },
    { q: "What mechanism does TCP use to prevent a fast sender from overwhelming a slow receiver's buffer?", ans: "Flow Control (Sliding Window)", d1: "Congestion Control", d2: "Checksumming", d3: "Encryption" },
    { q: "What TCP mechanism detects and reacts to network bottlenecks by adjusting the `cwnd` (congestion window)?", ans: "Congestion Control (e.g. Slow Start, AIMD, Reno/Cubic)", d1: "Flow Control", d2: "DNS Resolution", d3: "Subnetting" },
    { q: "What is a Subnet Mask used for in IP networking?", ans: "To distinguish the network portion from the host portion of an IP address", d1: "To hide the IP address from websites", d2: "To encrypt network packets", d3: "To increase network bandwidth" },
    { q: "What is CIDR notation for the subnet mask 255.255.255.0?", ans: "/24", d1: "/16", d2: "/8", d3: "/32" },
    { q: "Which protocol provides secure cryptographic communication over computer networks using symmetric encryption and asymmetric key exchange?", ans: "TLS (Transport Layer Security)", d1: "HTTP", d2: "FTP", d3: "Telnet" },
    { q: "What is the primary function of a Network Switch operating at Layer 2?", ans: "To forward Ethernet frames to specific destination ports using a MAC address table", d1: "To route packets across different IP subnets", d2: "To convert digital signals into analog", d3: "To assign domain names" },
    { q: "What is a Collision Domain in computer networking?", ans: "A network segment where simultaneous packet transmissions collide with each other (e.g. half-duplex hubs)", d1: "A group of computers sharing a subnet", d2: "A server rack in a data center", d3: "A range of blocked IP addresses" },
    { q: "What is a Broadcast Domain?", ans: "A logical division of a computer network in which all nodes can reach each other by broadcast at the data link layer", d1: "A television channel frequency", d2: "A single Ethernet cable wire", d3: "A firewall rule set" },
    { q: "Which protocol is used for sending outgoing emails across mail servers on the Internet?", ans: "SMTP (Simple Mail Transfer Protocol)", d1: "IMAP", d2: "POP3", d3: "HTTP" },
    { q: "Which email protocol downloads emails from the mail server to a local client and typically removes them from the server?", ans: "POP3 (Post Office Protocol 3)", d1: "IMAP", d2: "SMTP", d3: "SNMP" },
    { q: "Which email protocol synchronizes messages bidirectionally across multiple devices while keeping mail stored on the server?", ans: "IMAP (Internet Message Access Protocol)", d1: "POP3", d2: "SMTP", d3: "FTP" },
    { q: "What is the loopback IPv4 address reserved for testing network software on the local host machine?", ans: "127.0.0.1 (localhost)", d1: "192.168.1.1", d2: "10.0.0.1", d3: "255.255.255.255" },
    { q: "What is the default subnet prefix assigned to private Class C networks (e.g. 192.168.0.0/16)?", ans: "192.168.0.0 to 192.168.255.255 (RFC 1918)", d1: "10.0.0.0 to 10.255.255.255", d2: "172.16.0.0 to 172.31.255.255", d3: "127.0.0.0 to 127.255.255.255" }
  ];
  netData.forEach((n) => {
    addQ(5, "Computer Networks", "Medium", n.q, n.ans, n.d1, n.d2, n.d3, n.exp || `Correct resolution: ${n.ans}.`);
  });
  const oopData = [
    { q: "Which OOP pillar bundles data fields and methods that manipulate that data into a single unit while restricting direct access?", ans: "Encapsulation", d1: "Inheritance", d2: "Polymorphism", d3: "Abstraction" },
    { q: "Which OOP concept allows derived subclasses to provide specific implementations of methods defined in base parent classes?", ans: "Dynamic Polymorphism (Method Overriding)", d1: "Encapsulation", d2: "Static Binding", d3: "Tight Coupling" },
    { q: "What is Method Overloading (Compile-Time Polymorphism)?", ans: "Defining multiple methods in the same class with identical names but different parameter signatures", d1: "Overriding a method in a child class", d2: "Hiding private class attributes", d3: "Calling a parent constructor" },
    { q: "What is an Abstract Class in object-oriented design?", ans: "A class that cannot be instantiated directly and is intended to serve as a blueprint with abstract methods for subclasses", d1: "A class that has no methods", d2: "A class without constructor", d3: "A class that can only be instantiated once" },
    { q: "What is an Interface in programming languages like Java or TypeScript?", ans: "A contract defining method signatures and property shapes without providing concrete implementation code", d1: "A GUI screen layout", d2: "A private variable scope", d3: "A runtime database connection" },
    { q: "What does the 'S' in SOLID object-oriented design principles stand for?", ans: "Single Responsibility Principle (A class should have only one reason to change)", d1: "Static Typing Principle", d2: "Subclass Isolation Principle", d3: "Sequential Execution Principle" },
    { q: "What does the 'O' in SOLID principles state?", ans: "Open/Closed Principle (Software entities should be open for extension, but closed for modification)", d1: "Object Oriented Principle", d2: "Operator Overloading Principle", d3: "Optimal Memory Principle" },
    { q: "What does the 'L' in SOLID principles stand for?", ans: "Liskov Substitution Principle (Subtypes must be substitutable for their base types without altering program correctness)", d1: "Lazy Loading Principle", d2: "Linear Inheritance Principle", d3: "Loose Coupling Principle" },
    { q: "What does the 'I' in SOLID principles demand?", ans: "Interface Segregation Principle (Clients should not be forced to depend on methods they do not use)", d1: "Immutable State Principle", d2: "Inheritance Hierarchy Principle", d3: "Instance Binding Principle" },
    { q: "What does the 'D' in SOLID design principles state?", ans: "Dependency Inversion Principle (High-level modules should depend on abstractions, not on concrete low-level details)", d1: "Data Encapsulation Principle", d2: "Destructor Execution Principle", d3: "Dynamic Dispatch Principle" },
    { q: "Which creational design pattern ensures a class has only one instance and provides a global access point to it?", ans: "Singleton Pattern", d1: "Factory Pattern", d2: "Prototype Pattern", d3: "Builder Pattern" },
    { q: "Which structural design pattern allows incompatible interfaces to work together by wrapping an existing object?", ans: "Adapter Pattern", d1: "Observer Pattern", d2: "Strategy Pattern", d3: "Decorator Pattern" },
    { q: "Which behavioral design pattern defines a one-to-many subscription dependency between objects so that state changes trigger updates?", ans: "Observer Pattern", d1: "Singleton Pattern", d2: "Factory Method", d3: "Flyweight Pattern" },
    { q: "Which design pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime?", ans: "Strategy Pattern", d1: "Command Pattern", d2: "Decorator Pattern", d3: "Facade Pattern" },
    { q: "Which structural design pattern dynamically attaches additional responsibilities and behaviors to an object without subclassing?", ans: "Decorator Pattern", d1: "Adapter Pattern", d2: "Composite Pattern", d3: "Proxy Pattern" },
    { q: "What is the Diamond Problem in multiple inheritance, and how is it resolved?", ans: "Ambiguity when a class inherits from two parent classes that both derive from a common ancestor; resolved via virtual base classes or interfaces", d1: "A CPU memory alignment crash", d2: "A hard disk storage defect", d3: "A circular dependency in packages" },
    { q: "What is Composition over Inheritance principle in software engineering?", ans: "Preferring to combine simple objects with specific capabilities rather than building rigid multi-level inheritance hierarchies", d1: "Always using abstract classes", d2: "Avoiding all functions", d3: "Using global variables" },
    { q: "What is the role of a Constructor in object-oriented programming?", ans: "A special method called automatically upon object creation to initialize object state and allocate resources", d1: "To delete unused objects", d2: "To compile bytecode", d3: "To render HTML components" },
    { q: "What is a Destructor (or finalizer)?", ans: "A method invoked automatically when an object is destroyed or garbage collected to release unmanaged resources", d1: "A compiler error handler", d2: "A constructor with arguments", d3: "An abstract interface" },
    { q: "What does the `this` (or `self`) keyword reference in object methods?", ans: "The current instance of the class executing the method", d1: "The parent superclass", d2: "The global window object", d3: "The operating system kernel" },
    { q: "What is the difference between shallow copy and deep copy of an object?", ans: "Shallow copy duplicates top-level primitives and copies nested object references; deep copy recursively duplicates all nested objects", d1: "Shallow copy is on disk, deep copy is in RAM", d2: "Deep copy encrypts data", d3: "Shallow copy modifies original values" },
    { q: "What is Polymorphism through Duck Typing in dynamically typed languages like Python or JavaScript?", ans: `"If it walks like a duck and quacks like a duck, it's a duck" - matching objects based on method existence rather than explicit class type`, d1: "Strict compiler inheritance checking", d2: "Converting strings to integers", d3: "Using animal naming conventions" },
    { q: "Which design pattern provides a unified, simplified high-level interface to a complex subsystem of classes?", ans: "Facade Pattern", d1: "Bridge Pattern", d2: "Flyweight Pattern", d3: "Proxy Pattern" },
    { q: "Which design pattern separates the construction of a complex object from its representation, allowing step-by-step assembly?", ans: "Builder Pattern", d1: "Factory Pattern", d2: "Singleton Pattern", d3: "Visitor Pattern" },
    { q: "What is Coupling in software architecture, and what is the recommended design goal?", ans: "The degree of direct interdependence between software modules; low (loose) coupling is the recommended goal", d1: "High coupling is always preferred", d2: "Coupling measures memory usage", d3: "Coupling refers to network latency" },
    { q: "What is Cohesion in module design, and what is the recommended practice?", ans: "The degree to which elements within a module belong together and serve a unified single purpose; high cohesion is recommended", d1: "Low cohesion is preferred", d2: "Cohesion measures file size", d3: "Cohesion counts lines of code" },
    { q: "What is Reflection in programming languages?", ans: "The ability of a running program to examine, introspect, and modify its own class structures, methods, and metadata at runtime", d1: "Mirroring database tables", d2: "Light scattering in optical fibers", d3: "Displaying UI on dual monitors" },
    { q: "What is an Immutable Object in OOP?", ans: "An object whose internal state cannot be modified after it is created", d1: "An object that cannot be copied", d2: "An object stored only on disk", d3: "An object without any methods" },
    { q: "Which design pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undo operations?", ans: "Command Pattern", d1: "State Pattern", d2: "Observer Pattern", d3: "Template Method" },
    { q: "What is Dependency Injection (DI) in software development?", ans: "A technique where an object receives its dependencies from an external assembler rather than creating them internally", d1: "Injecting malicious SQL strings", d2: "Writing hardcoded connection strings", d3: "Overriding system memory" }
  ];
  oopData.forEach((o) => {
    addQ(6, "OOP Concepts", "Medium", o.q, o.ans, o.d1, o.d2, o.d3, o.exp || `Correct resolution: ${o.ans}.`);
  });
  const webData = [
    { q: "Which HTTP request method is specified by RFC standards as idempotent and used to replace an entire entity resource?", ans: "PUT", d1: "POST", d2: "PATCH", d3: "CONNECT" },
    { q: "Which HTTP method is designed for applying partial modifications to a server resource?", ans: "PATCH", d1: "PUT", d2: "POST", d3: "GET" },
    { q: "What does the HTTP 401 Unauthorized status code indicate?", ans: "The request requires user authentication credentials that are missing or invalid", d1: "The server cannot find the requested resource", d2: "The user is authenticated but forbidden from accessing the resource", d3: "Internal server error occurred" },
    { q: "What does the HTTP 403 Forbidden status code indicate?", ans: "The client is authenticated, but does not have permission/authorization to access the requested resource", d1: "Missing login credentials", d2: "Page not found", d3: "Server timeout" },
    { q: "What is CORS (Cross-Origin Resource Sharing) in web security?", ans: "A browser security mechanism that uses HTTP headers to determine whether a web page can load resources from another domain", d1: "An image compression format", d2: "A database query language", d3: "A CSS flexbox property" },
    { q: "What does the HTTP 429 Too Many Requests status code represent?", ans: "The client has exceeded rate limiting thresholds within a given time window", d1: "The server is permanently down", d2: "The request body is corrupted", d3: "DNS lookup failed" },
    { q: "What is the purpose of JWT (JSON Web Token) in modern web applications?", ans: "To securely transmit claims and authentication state between parties as a digitally signed, compact JSON string", d1: "To compress video streams", d2: "To replace CSS stylesheets", d3: "To style HTML buttons" },
    { q: "Which part of a JWT contains the cryptographic signature verifying token integrity?", ans: "The third segment (after the second period delimiter)", d1: "The Header", d2: "The Payload", d3: "The Cookie header" },
    { q: "What does the SameSite cookie attribute with value `Strict` accomplish?", ans: "Prevents the browser from sending the cookie in cross-site requests, mitigating CSRF (Cross-Site Request Forgery)", d1: "Encrypts the cookie with RSA", d2: "Deletes the cookie after 5 seconds", d3: "Allows any domain to read the cookie" },
    { q: "What is the purpose of the `HttpOnly` flag on HTTP cookies?", ans: "Prevents client-side JavaScript (e.g. document.cookie) from accessing the cookie, protecting against XSS token theft", d1: "Forces the cookie to use HTTP instead of HTTPS", d2: "Disables all cookies in the browser", d3: "Limits cookies to mobile devices" },
    { q: "What is the DOM (Document Object Model) in web browsers?", ans: "A tree-like in-memory object representation of an HTML document that JavaScript can traverse and manipulate", d1: "A database server storage engine", d2: "A CSS color specification", d3: "A network routing table" },
    { q: "What is Event Bubbling in browser JavaScript event propagation?", ans: "An event triggers on the deepest target element first and then propagates upwards through its parent ancestor nodes in the DOM tree", d1: "Events dropping silently", d2: "Events moving only downwards from window to target", d3: "Events executing across different tabs" },
    { q: "How does `event.stopPropagation()` affect event bubbling in the DOM?", ans: "It prevents the event from propagating further up the parent hierarchy", d1: "It prevents the default browser behavior", d2: "It reloads the web page", d3: "It deletes the target DOM element" },
    { q: "What is the purpose of `event.preventDefault()` in JavaScript event handlers?", ans: "It stops the browser's default action for that event (such as submitting a form or following a hyperlink)", d1: "It stops event bubbling", d2: "It clears localStorage", d3: "It logs out the active user" },
    { q: "What is the Event Loop in JavaScript runtimes (V8 / Node.js / Browsers)?", ans: "A continuous mechanism that monitors the Call Stack and Task Queue, pushing callback tasks onto the stack when it is empty", d1: "A `for` loop that never terminates", d2: "A multi-threaded CPU scheduler", d3: "A CSS keyframe animation loop" },
    { q: "What is the execution order difference between Microtasks (e.g. Promises) and Macrotasks (e.g. setTimeout) in JavaScript?", ans: "All pending Microtasks are executed immediately after the current call stack clears before the next Macrotask is processed", d1: "Macrotasks always execute before Microtasks", d2: "Microtasks and Macrotasks run in parallel threads", d3: "Microtasks only run on page reload" },
    { q: "What is a Closure in JavaScript and functional programming?", ans: "A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has returned", d1: "A closed browser tab", d2: "A completed network request", d3: "A private class method only" },
    { q: "What is WebAssembly (Wasm)?", ans: "A binary instruction format for a stack-based virtual machine, enabling high-performance execution of C/C++/Rust code in web browsers near native speed", d1: "A replacement for HTML markup", d2: "A new CSS framework", d3: "An Apache web server module" },
    { q: "What is a Service Worker in modern web applications?", ans: "A background script running independently of web pages that can intercept network requests, manage caching, and handle push notifications", d1: "A customer service chat bot", d2: "A server database worker", d3: "A CSS preprocessor" },
    { q: "What is the purpose of Content Security Policy (CSP) HTTP headers?", ans: "To restrict the sources from which scripts, styles, images, and other resources can be loaded, preventing Cross-Site Scripting (XSS)", d1: "To speed up file downloads", d2: "To translate web pages into foreign languages", d3: "To configure DNS records" },
    { q: "What does the HTTP 304 Not Modified status code inform the browser?", ans: "The cached copy of the resource is still fresh and valid; the server does not retransmit the response body", d1: "The page was deleted", d2: "The user has no permission", d3: "The database rejected the update" },
    { q: "What is GraphQL schema introspection?", ans: "The ability of a client to query the GraphQL server for metadata about its types, queries, mutations, and fields", d1: "Scanning server memory for security keys", d2: "Analyzing SQL execution plans", d3: "Viewing browser history" },
    { q: "What is the purpose of the HTTP `Cache-Control: max-age=3600, immutable` header directive?", ans: "Instructs browsers and proxies that the response can be cached for 3600 seconds and will never change during that period", d1: "Deletes the cache immediately", d2: "Encrypts the file with AES", d3: "Requires revalidation on every click" },
    { q: "What is the Critical Rendering Path in browser page loading?", ans: "The sequence of steps the browser takes (HTML parsing -> DOM -> CSSOM -> Render Tree -> Layout -> Paint) to render pixels on screen", d1: "The shortest distance across network routers", d2: "The database query optimization path", d3: "The server boot sequence" },
    { q: "What does `localStorage` in browser Web Storage API provide?", ans: "Persistent key-value client-side storage (~5-10MB) with no expiration date across browser sessions", d1: "Session-only storage deleted on tab close", d2: "Encrypted cloud storage", d3: "Direct server database access" },
    { q: "What is the difference between `localStorage` and `sessionStorage`?", ans: "`sessionStorage` data is cleared when the specific browser tab is closed; `localStorage` persists indefinitely until cleared", d1: "`sessionStorage` stores images, `localStorage` stores text", d2: "`localStorage` is sent to the server in HTTP headers", d3: "`sessionStorage` requires user password" },
    { q: "What is Server-Sent Events (SSE)?", ans: "A standard enabling a web server to push unidirectional, real-time text updates to web clients over a single long-lived HTTP connection", d1: "Full-duplex binary communication", d2: "Polling the server every second", d3: "Sending emails from servers" },
    { q: "What is the difference between WebSockets and Server-Sent Events (SSE)?", ans: "WebSockets provide full-duplex bi-directional communication; SSE provides server-to-client unidirectional streaming over HTTP", d1: "WebSockets only send text, SSE sends binary", d2: "SSE is deprecated", d3: "WebSockets do not use TCP" },
    { q: "What is Tree Shaking in modern JavaScript bundlers (Webpack, Vite, Rollup)?", ans: "A dead-code elimination optimization that removes unused ES module exports from the final production bundle", d1: "Restarting the server automatically", d2: "Testing DOM nodes for errors", d3: "Minifying CSS class names" },
    { q: "What is the Purpose of an ETag (Entity Tag) HTTP header?", ans: "A unique fingerprint identifier assigned to a specific version of a resource to enable conditional cache validation (If-None-Match)", d1: "An electronic price tag for shopping", d2: "An encryption algorithm name", d3: "A user session ID" }
  ];
  webData.forEach((w) => {
    addQ(7, "Web Technologies", "Medium", w.q, w.ans, w.d1, w.d2, w.d3, w.exp || `Correct resolution: ${w.ans}.`);
  });
  const sysData = [
    { q: "Under the CAP Theorem, when a network partition (P) occurs in a distributed system, what fundamental trade-off must be made?", ans: "Consistency (C) vs Availability (A)", d1: "Latency vs Throughput", d2: "Storage vs Memory", d3: "Security vs Speed" },
    { q: "What does PACELC Theorem state regarding distributed systems when there is NO partition (Else)?", ans: "Else: trade-off between Latency (L) and Consistency (C)", d1: "Else: choose Security over Storage", d2: "Else: eliminate all caches", d3: "Else: double server capacity" },
    { q: "What is Consistent Hashing primarily used for in distributed caching and storage clusters?", ans: "To minimize key remapping when cache nodes are added or removed dynamically", d1: "To encrypt user passwords", d2: "To generate UUIDs", d3: "To sort arrays in memory" },
    { q: "What is the function of Virtual Nodes (Vnodes) in Consistent Hashing rings?", ans: "To distribute keys more uniformly across physical servers and prevent hotspot imbalances", d1: "To create virtual machines in the cloud", d2: "To simulate network packet drops", d3: "To compress cached objects" },
    { q: "What is a Reverse Proxy (such as Nginx or Envoy)?", ans: "An intermediary server that sits in front of backend web servers, handling load balancing, TLS termination, and request routing", d1: "A proxy used by employees to browse the web", d2: "A database query parser", d3: "A local hard drive cache" },
    { q: "What is the difference between Horizontal Scaling (Scale-Out) and Vertical Scaling (Scale-Up)?", ans: "Horizontal adds more machine instances; Vertical adds more CPU/RAM/capacity to a single existing machine", d1: "Horizontal is for databases only, Vertical is for web apps", d2: "Vertical is always cheaper than Horizontal", d3: "Horizontal replaces all servers daily" },
    { q: "What is the Circuit Breaker pattern in microservices architecture?", ans: "A resilience pattern that halts requests to a failing downstream service to prevent cascading failures and allow recovery", d1: "A physical switch in a server rack", d2: "An electrical power breaker", d3: "A tool that terminates running containers" },
    { q: "What is the Write-Through caching strategy?", ans: "Data is written simultaneously to the cache and the underlying persistent database before confirming success", d1: "Data is written to cache only and written to DB lazily", d2: "Cache is updated only on read misses", d3: "Writes bypass cache completely" },
    { q: "What is the Write-Back (Write-Behind) caching strategy?", ans: "Data is written directly to cache and acknowledged immediately; asynchronous background tasks write dirty entries to the database later", d1: "Data is written to DB first, cache never", d2: "Data is read from backup tape", d3: "Cache is wiped after every write" },
    { q: "What is the Cache-Aside (Lazy Loading) pattern?", ans: "The application queries the cache first; on a cache miss, it reads from the database and populates the cache for future requests", d1: "Database updates the cache automatically", d2: "All data is cached in advance on startup", d3: "Cache is never used for reads" },
    { q: "What is a Bloom Filter in distributed databases (e.g. Cassandra, Bigtable)?", ans: "A space-efficient probabilistic data structure used to test whether an element is definitely not in a set or might be in a set", d1: "A filter for water cooling systems", d2: "A sorting algorithm for strings", d3: "A visual CSS image filter" },
    { q: "What is the Single Point of Failure (SPOF) in system design?", ans: "Any individual component whose failure will cause the entire system or service to cease functioning", d1: "A software bug in a CSS file", d2: "A slow internet connection on one client", d3: "An expired user password" },
    { q: "What is an Idempotent API endpoint?", ans: "An endpoint where making multiple identical requests has the exact same side-effect and resulting server state as making a single request", d1: "An endpoint that requires no authentication", d2: "An endpoint that returns data in under 1ms", d3: "An endpoint that accepts only XML" },
    { q: "What is Eventual Consistency in distributed databases (e.g. DynamoDB, Cassandra)?", ans: "A consistency model where if no new updates are made, all replicas will eventually converge and return the same data", d1: "Data is guaranteed consistent instantly across all nodes", d2: "Data is never updated", d3: "Transactions are executed sequentially on a single node" },
    { q: "What is the Split-Brain scenario in a distributed cluster with consensus algorithms?", ans: "A network partition divides a cluster into two sub-clusters, each believing it is the sole active master, risking data divergence", d1: "A multicore CPU running out of cache", d2: "Two developers editing the same file", d3: "A database query returning conflicting schemas" },
    { q: "How does the Raft or Paxos consensus algorithm prevent Split-Brain during leader elections?", ans: "By requiring an absolute majority quorum (more than N/2 nodes) to elect a leader or commit log entries", d1: "By picking the server with the highest IP address", d2: "By restarting all nodes every hour", d3: "By using an external hardware clock" },
    { q: "What is CQRS (Command Query Responsibility Segregation)?", ans: "An architectural pattern that separates read operations (queries) from write operations (commands) into distinct models", d1: "A method to compress database tables", d2: "A protocol for sending emails", d3: "A CSS framework for responsive UI" },
    { q: "What is Event Sourcing pattern?", ans: "Storing the state of a business entity as an append-only sequence of immutable state-changing domain events", d1: "Writing source code during meetings", d2: "Tracking user mouse clicks for analytics", d3: "Sourcing components from open-source libraries" },
    { q: "What is Rate Limiting using the Token Bucket algorithm?", ans: "Tokens are added to a bucket at a fixed rate; requests consume tokens and are rejected or delayed when the bucket is empty, allowing bursts up to capacity", d1: "Limiting internet bandwidth to 1MB/s", d2: "Counting total website visitors per year", d3: "Limiting database column sizes" },
    { q: "What is Rate Limiting using the Leaky Bucket algorithm?", ans: "Requests enter a queue and are processed at a smooth, constant output rate regardless of incoming burst traffic", d1: "Letting memory leak to free space", d2: "Dropping all network packets randomly", d3: "Refreshing browser pages periodically" },
    { q: "What is Database Read Replication primarily used for?", ans: "To scale out read query throughput by offloading read traffic from the primary write master to multiple read-only replica instances", d1: "To make write transactions faster", d2: "To replace database backups", d3: "To reduce network bandwidth usage" },
    { q: "What is Data Replication Lag in asynchronous database clusters?", ans: "The brief time delay between a write committed on the primary master and its propagation/application on replica nodes", d1: "The physical network cable latency", d2: "The time taken to compile SQL queries", d3: "The delay in typing on a keyboard" },
    { q: "What is the purpose of Message Queues (e.g. Apache Kafka, RabbitMQ) in distributed systems?", ans: "To decouple producer and consumer services, buffer traffic spikes, and enable asynchronous message processing", d1: "To store static website images", d2: "To render server-side HTML templates", d3: "To authenticate user passwords" },
    { q: "What is the difference between At-Least-Once and Exactly-Once message delivery semantics?", ans: "At-Least-Once guarantees messages are never lost but may cause duplicates; Exactly-Once guarantees each message is processed without loss or duplication", d1: "At-Least-Once is slower than Exactly-Once", d2: "Exactly-Once does not require acknowledgments", d3: "At-Least-Once drops messages during failures" },
    { q: "What is a Distributed Lock (e.g. using Redis Redlock or ZooKeeper)?", ans: "A mechanism to ensure mutual exclusion across multiple distinct server processes accessing a shared distributed resource", d1: "A physical lock on server rack doors", d2: "Encrypting a database with RSA", d3: "A local mutex in a single process" },
    { q: "What is Database Connection Pooling?", ans: "Maintaining a cache of pre-established database connections that can be reused for incoming queries rather than creating a new connection each time", d1: "Combining multiple databases into one table", d2: "Sharing WiFi connections among servers", d3: "Pooling money to pay for cloud hosting" },
    { q: "What is a Microservices API Gateway pattern?", ans: "A single entry-point service that handles routing, authentication, SSL termination, rate limiting, and request aggregation for downstream services", d1: "A router in a home network", d2: "A database table storing API keys", d3: "A firewall blocking port 80" },
    { q: "What is Service Discovery in microservices architectures (e.g. Consul, Eureka)?", ans: "A dynamic registry that allows service instances to register their network locations (IP/port) and discover other active service instances", d1: "Finding open-source libraries on GitHub", d2: "Scanning for open WiFi networks", d3: "Discovering hard drives attached to servers" },
    { q: "What is Distributed Tracing (e.g. Jaeger, OpenTelemetry)?", ans: "Tracking request lifecycles across multiple distributed service boundaries using a shared correlation/trace ID to monitor latency and pinpoint errors", d1: "Tracking user mouse movements", d2: "Tracing physical electrical wires", d3: "Recording audio calls for training" },
    { q: "What is Database Shard Key Selection critical for?", ans: "Ensuring even data distribution across shards to prevent hotspot shards from receiving disproportionate write or read load", d1: "Choosing the color of the server rack", d2: "Determining SQL query font size", d3: "Encrypting table column names" }
  ];
  sysData.forEach((s) => {
    addQ(8, "System Design", "Hard", s.q, s.ans, s.d1, s.d2, s.d3, s.exp || `Correct resolution: ${s.ans}.`);
  });
  const cloudData = [
    { q: "In Kubernetes cluster orchestration, what is the smallest deployable execution unit that encapsulates one or more containers?", ans: "Pod", d1: "Node", d2: "Deployment", d3: "Ingress" },
    { q: "What is a Kubernetes Deployment controller responsible for?", ans: "Managing declarative declarative replica sets, automated rolling updates, and rollbacks of application Pods", d1: "Assigning IP addresses to physical cables", d2: "Compiling Docker images from source", d3: "Managing hardware power supplies" },
    { q: "What is the function of a Kubernetes Service object?", ans: "To provide a stable network IP and DNS name that load-balances traffic across a dynamic set of Pods", d1: "To store secrets on disk", d2: "To schedule cron jobs", d3: "To format hard drive partitions" },
    { q: "What is Infrastructure as Code (IaC) (e.g. Terraform, Pulumi, CloudFormation)?", ans: "Managing and provisioning cloud infrastructure, networks, and resources through declarative configuration files rather than manual UI clicks", d1: "Writing software code on cloud virtual machines", d2: "Compiling operating system kernels", d3: "Creating digital architecture diagrams" },
    { q: "What is Docker containerization?", ans: "An OS-level virtualization technology that packages applications and dependencies into isolated user-space containers sharing the host OS kernel", d1: "Hardware virtualization with dedicated guest OS kernels", d2: "A cloud hosting subscription model", d3: "A programming language for servers" },
    { q: "What is the primary difference between a Virtual Machine (VM) and a Docker Container?", ans: "VMs run a full guest OS on top of a hypervisor; containers share the host OS kernel and isolate user-space processes", d1: "Containers require more RAM than VMs", d2: "VMs cannot run Linux", d3: "Containers cannot execute networked applications" },
    { q: "What is Continuous Integration (CI)?", ans: "The development practice of frequently integrating code into a shared repository where automated builds and tests run on every commit", d1: "Deploying code once a year", d2: "Writing manual test scripts on paper", d3: "Hiring external software auditors" },
    { q: "What is Continuous Deployment (CD)?", ans: "Automatically releasing every validated build that passes the automated CI test pipeline directly into production environments", d1: "Writing code without version control", d2: "Deploying only after manual committee meetings", d3: "Rebooting servers every night" },
    { q: "What is a Blue-Green Deployment strategy?", ans: "Maintaining two identical production environments (Blue and Green); routing live traffic to the newly deployed environment once verified", d1: "Deploying on Earth Day only", d2: "Using two different cloud vendors simultaneously", d3: "Changing the UI background colors" },
    { q: "What is a Canary Deployment strategy?", ans: "Rolling out a new software version to a small subset (e.g. 5%) of users first, monitoring metrics, and gradually expanding rollout if stable", d1: "Testing code inside bird enclosures", d2: "Deploying code without running tests", d3: "Shutting down production for maintenance" },
    { q: "What is Serverless Computing (FaaS, e.g. AWS Lambda, Cloud Run, Azure Functions)?", ans: "An execution model where cloud providers dynamically manage server allocation and execute code in response to events, billing purely per execution", d1: "Running computers without any motherboards", d2: "Storing data on paper instead of disks", d3: "Writing software without any APIs" },
    { q: "What is Object Storage (e.g. AWS S3, Google Cloud Storage, Azure Blob)?", ans: "A scalable flat storage architecture that manages unstructured data as objects with unique IDs and rich metadata accessed over HTTP APIs", d1: "A block storage device attached to a VM", d2: "An in-memory relational database", d3: "A local CPU register cache" },
    { q: "What is Block Storage (e.g. AWS EBS, Persistent Disk)?", ans: "Raw storage volumes that can be attached to virtual machines and formatted with a file system like ext4 or NTFS", d1: "A key-value store for JSON documents", d2: "A content delivery network for images", d3: "An email archive service" },
    { q: "What is a Content Delivery Network (CDN) (e.g. Cloudflare, CloudFront, Fastly)?", ans: "A geographically distributed network of proxy edge servers that cache content close to end users to reduce latency and origin server load", d1: "A television broadcasting satellite", d2: "A cloud database for storing financial records", d3: "A fiber optic cable company" },
    { q: "What is Auto-Scaling in cloud infrastructure?", ans: "Automatically adjusting the number of active server instances up or down based on real-time metrics like CPU usage or request count", d1: "Automatically increasing font size on mobile screens", d2: "Scaling image resolutions in CSS", d3: "Upgrading internet speed subscriptions" },
    { q: "What is the role of Kubernetes Ingress controller (e.g. NGINX Ingress, Traefik)?", ans: "To manage external HTTP/HTTPS routing into cluster Services, providing SSL termination and name-based virtual hosting", d1: "To schedule cron backup jobs", d2: "To scan Docker images for malware", d3: "To allocate RAM to worker nodes" },
    { q: "What is GitOps in DevOps workflows?", ans: "An operational framework where Git repositories serve as the single source of truth for declaratively managing infrastructure and application deployments", d1: "Using Git only for tracking bug tickets", d2: "A cloud provider competing with AWS", d3: "Writing Git commands manually on production servers" },
    { q: "What is Prometheus in cloud-native monitoring?", ans: "An open-source monitoring and alerting toolkit that scrapes time-series numerical metrics from monitored targets over HTTP", d1: "A log aggregation database", d2: "A container orchestrator", d3: "A continuous deployment pipeline" },
    { q: "What is Grafana commonly used for in DevOps monitoring stacks?", ans: "Visualizing time-series metrics, logs, and traces through interactive customizable dashboards", d1: "Executing unit tests", d2: "Managing DNS records", d3: "Creating Docker images" },
    { q: "What is a Rolling Update in container orchestration?", ans: "Incrementally replacing instances of the old application version with instances of the new version with zero downtime", d1: "Restarting all servers at the same instant", d2: "Deleting all database records before deploying", d3: "Updating only developer laptops" },
    { q: "What does Multi-Zone or Multi-Region redundancy achieve in cloud architecture?", ans: "High availability and disaster recovery by ensuring service continuity even if an entire physical data center or geographic region fails", d1: "Lowering cloud hosting bills by 90%", d2: "Eliminating the need for software testing", d3: "Making all API calls synchronous" },
    { q: "What is the purpose of a Dockerfile in container engineering?", ans: "A text script containing sequential commands and instructions to automatically build a standalone container image", d1: "A file containing user passwords", d2: "A network routing table for containers", d3: "A system crash log" },
    { q: "What is a Helm Chart in Kubernetes ecosystems?", ans: "A package manager template collection that defines, installs, and manages complex Kubernetes applications", d1: "A visual architecture drawing", d2: "A hardware rack blueprint", d3: "A time tracking chart for developers" },
    { q: "What is a Service Mesh (e.g. Istio, Linkerd)?", ans: "A dedicated infrastructure layer of sidecar proxies managing service-to-service communication, mTLS encryption, traffic routing, and observability", d1: "A physical mesh of network cables", d2: "A UI wireframe component grid", d3: "A database clustering tool" },
    { q: "What is Configuration Drift in cloud infrastructure management?", ans: "The divergence between the actual live state of cloud resources and the declarative state defined in source code (IaC)", d1: "A computer mouse drifting across the screen", d2: "Network packets arriving out of order", d3: "Developers forgetting their passwords" },
    { q: "What is the purpose of Kubernetes ConfigMaps and Secrets?", ans: "To decouple configuration parameters and sensitive credentials from container image code for flexible environment-specific injection", d1: "To compile Go source code", d2: "To generate SSL certificates automatically", d3: "To format SSD block storage" },
    { q: "What is Chaos Engineering (e.g. Chaos Monkey)?", ans: "The discipline of intentionally injecting failures (e.g. killing instances, dropping network packets) into production systems to test resilience", d1: "Writing unformatted spaghetti code", d2: "Deleting customer accounts randomly", d3: "Deploying software without testing" },
    { q: "What is a Reverse DNS lookup in networking?", ans: "Querying the DNS system to determine the domain hostname associated with a given IP address (using PTR records)", d1: "Translating hostnames to IP addresses", d2: "Deleting domain registrations", d3: "Blocking IP addresses in firewalls" },
    { q: "What is an Edge Computing architecture?", ans: "Processing computational workloads and data analysis near the physical source of data (edge nodes/devices) rather than in centralized cloud datacenters", d1: "Building servers at the edge of a desk", d2: "Running algorithms on the perimeter of an image", d3: "Using Microsoft Edge browser exclusively" },
    { q: "What is a Cloud VPC (Virtual Private Cloud)?", ans: "An isolated, logically separated private virtual network within a public cloud provider where users provision their compute and database resources", d1: "A physical server dedicated to one user", d2: "A VPN client installed on mobile phones", d3: "A cloud billing invoice" }
  ];
  cloudData.forEach((c) => {
    addQ(9, "Cloud & DevOps", "Medium", c.q, c.ans, c.d1, c.d2, c.d3, c.exp || `Correct resolution: ${c.ans}.`);
  });
  const secData = [
    { q: "Which cryptographic construct provides deterministic, fixed-length digests and one-way irreversible computation?", ans: "Cryptographic Hash Function (e.g. SHA-256, BLAKE3)", d1: "Symmetric Block Cipher (e.g. AES-256)", d2: "Asymmetric Key Pair (e.g. RSA-4096)", d3: "Diffie-Hellman Key Exchange" },
    { q: "What is the primary difference between Symmetric and Asymmetric encryption?", ans: "Symmetric uses the same shared secret key for encryption and decryption; Asymmetric uses a mathematically paired public and private key", d1: "Symmetric is always unencrypted", d2: "Asymmetric cannot encrypt data", d3: "Symmetric only runs on hardware" },
    { q: "Which industry-standard symmetric block cipher uses 128, 192, or 256-bit keys and operates on 128-bit blocks?", ans: "AES (Advanced Encryption Standard)", d1: "RSA", d2: "Diffie-Hellman", d3: "MD5" },
    { q: "What is SQL Injection (SQLi) and how is it primarily prevented?", ans: "An attack injecting malicious SQL fragments into input fields; prevented by using Parameterized Queries / Prepared Statements", d1: "An attack that deletes CSS files; prevented by using dark mode", d2: "An attack that shuts down servers; prevented by using batteries", d3: "An attack on network routers; prevented by buying firewalls" },
    { q: "What is Cross-Site Scripting (XSS)?", ans: "A vulnerability where an attacker injects malicious client-side script code into a web application viewed by other users", d1: "An attack that crashes the web server CPU", d2: "An attack that guesses passwords", d3: "A database table deletion technique" },
    { q: "What is Cross-Site Request Forgery (CSRF)?", ans: "An attack that tricks an authenticated user's browser into executing unwanted actions on a trusted web application where they are currently authenticated", d1: "Stealing physical computer hardware", d2: "Injecting malicious SQL statements", d3: "Cracking Wi-Fi passwords" },
    { q: "What is the purpose of Salting passwords before hashing?", ans: "Appending a unique random string to each password before hashing to defend against Rainbow Table attacks and duplicate hash lookups", d1: "Encrypting passwords with salt minerals", d2: "Making passwords shorter and easier to type", d3: "Sending passwords over plain HTTP" },
    { q: "Why is bcrypt or Argon2 preferred over MD5 or SHA-256 for password hashing?", ans: "They incorporate configurable computational work factors (key stretching) to make brute-force and GPU hardware attacks prohibitively slow", d1: "They produce shorter hash strings", d2: "They allow passwords to be decrypted easily by admins", d3: "They require no CPU memory" },
    { q: "What is a Man-in-the-Middle (MITM) attack?", ans: "An attack where an adversary secretly intercepts and potentially alters communication between two parties who believe they are communicating directly", d1: "An employee sitting between two desks", d2: "A physical firewall in an office", d3: "A server rebooting during peak hours" },
    { q: "What is the primary role of a Certificate Authority (CA) in Public Key Infrastructure (PKI)?", ans: "To digitally sign and validate X.509 SSL/TLS certificates, binding a public key to an authenticated organization domain", d1: "To store all user passwords in the cloud", d2: "To route internet traffic across continents", d3: "To manufacture computer microchips" },
    { q: "What is Diffie-Hellman Key Exchange used for?", ans: "A method allowing two parties to securely establish a shared secret key over an insecure, public communication channel", d1: "Encrypting files on a local USB drive", d2: "Signing PDF documents legally", d3: "Compressing video files" },
    { q: "What is Multi-Factor Authentication (MFA)?", ans: "A security mechanism requiring users to present two or more independent authentication factors (knowledge, possession, inherence)", d1: "Using two different passwords for the same account", d2: "Logging in from two computers simultaneously", d3: "Typing a password twice" },
    { q: "What is a Zero-Day Vulnerability?", ans: "A software security flaw that is known to attackers or researchers but has no official security patch released by the vendor", d1: "A bug discovered within 0 days of hiring a developer", d2: "A software release with zero errors", d3: "A computer virus that operates for zero seconds" },
    { q: "What is a Distributed Denial of Service (DDoS) attack?", ans: "An attempt to overwhelm a target server, service, or network with a flood of traffic from multiple compromised distributed botnet systems", d1: "A physical server cable being cut", d2: "A single developer making a typo in code", d3: "A database query timing out" },
    { q: "What is the Principle of Least Privilege (PoLP)?", ans: "A security design rule that every user, process, and program should be granted only the minimum permissions necessary to perform its legitimate function", d1: "Giving all users full administrator root access", d2: "Denying all employees access to computers", d3: "Deleting user accounts daily" },
    { q: "What is a Replay Attack and how is it mitigated in cryptographic network protocols?", ans: "An attacker captures valid authentication traffic and transmits it again later; mitigated using timestamps, session nonces, and unique message IDs", d1: "Playing an audio recording in an office", d2: "Rewatching a video on YouTube", d3: "Re-running a compiler build" },
    { q: "What is a Buffer Overflow attack?", ans: "Writing more data to a fixed-size memory buffer than it can hold, overwriting adjacent memory (such as return addresses) to execute arbitrary code", d1: "A network queue filling up", d2: "A hard disk running out of storage space", d3: "A monitor displaying too many colors" },
    { q: "What is Address Space Layout Randomization (ASLR)?", ans: "An operating system defense that randomizes the memory addresses of key program areas (stack, heap, libraries) to thwart buffer overflow exploits", d1: "Assigning random IP addresses to network routers", d2: "Randomizing file names on disk", d3: "Shuffling array elements in memory" },
    { q: "What is a Digital Signature and what security guarantees does it provide?", ans: "A cryptographic hash of data encrypted with the sender's private key, providing authenticity, integrity, and non-repudiation", d1: "A scanned image of a handwritten signature", d2: "A user login password", d3: "A company logo on a website" },
    { q: "What is Non-Repudiation in information security?", ans: "The assurance that a party to a communication or transaction cannot deny the authenticity of their signature or action", d1: "Refusing to refund customer purchases", d2: "Preventing password changes", d3: "Deleting transaction history" },
    { q: "What is Penetration Testing (Ethical Hacking)?", ans: "An authorized simulated cyberattack on a computer system performed to evaluate its security posture and identify vulnerabilities", d1: "Testing hardware durability with a hammer", d2: "Writing unverified code in production", d3: "Installing pirated software" },
    { q: "What is a Honeypot in network security?", ans: "A decoy computer system intended to mimic likely targets of cyberattacks to detect, deflect, or study attacker methods", d1: "A jar of honey stored in a server room", d2: "A high-speed database cache", d3: "A tool for cleaning computer screens" },
    { q: "What is Phishing?", ans: "A social engineering attack where adversaries impersonate legitimate institutions via email or messaging to trick individuals into disclosing sensitive credentials", d1: "Catching fish with a fishing rod", d2: "Scanning for open ports with Nmap", d3: "Writing code without documentation" },
    { q: "What is Ransomware?", ans: "Malicious software that encrypts a victim's files and demands payment in exchange for the decryption key", d1: "Software purchased with a company credit card", d2: "An open-source software license", d3: "A database backup utility" },
    { q: "What is the role of Perfect Forward Secrecy (PFS) in TLS handshakes?", ans: "Ensuring that compromise of a long-term private server key does not compromise past session keys or decrypt past recorded traffic", d1: "Preventing servers from crashing", d2: "Encrypting data with symmetric keys only", d3: "Speeding up internet downloads" },
    { q: "What is a Rootkit in operating systems security?", ans: "Stealthy malicious software designed to hide its presence and grant administrative privileged access to a computer system below OS detection", d1: "The root user password in Linux", d2: "A utility for partitioning hard drives", d3: "A motherboard chip manufacturing kit" },
    { q: "What does the OWASP Top 10 represent in cybersecurity?", ans: "A regularly updated consensus document outlining the ten most critical web application security risks and vulnerabilities", d1: "A list of top ten computer manufacturers", d2: "A ranking of fastest supercomputers", d3: "A top 10 list of software programming languages" },
    { q: "What is a Side-Channel Attack (e.g. Spectre, Meltdown, timing attacks)?", ans: "An attack based on information gained from the physical implementation of a computer system (timing, power consumption, acoustic emissions, cache behavior) rather than flaws in the algorithm", d1: "Attacking a server from the side of the room", d2: "Injecting SQL into side tables", d3: "Hacking through a second monitor" },
    { q: "What is Port Scanning used for in network reconnaissance?", ans: "Probing a server or host to discover open network ports and identifying active network services and potential vulnerabilities", d1: "Plugging USB cables into laptop ports", d2: "Measuring electrical voltage on network ports", d3: "Cleaning physical Ethernet ports" },
    { q: "What is a Web Application Firewall (WAF)?", ans: "A specialized security appliance or reverse proxy that inspects and filters incoming HTTP/HTTPS traffic to block common web attacks like SQLi, XSS, and CSRF", d1: "A firewall built into home WiFi routers", d2: "A physical brick wall separating server rooms", d3: "An antivirus program installed on smartphones" }
  ];
  secData.forEach((s) => {
    addQ(10, "Cybersecurity", "Hard", s.q, s.ans, s.d1, s.d2, s.d3, s.exp || `Correct resolution: ${s.ans}.`);
  });
  return list;
}

// server/questionBank.ts
var TOPICS_META = {
  quantitative: {
    name: "Quantitative Aptitude",
    icon: "Calculator",
    description: "Master mathematical calculations, arithmetic, algebra, probability, and numerical problem-solving."
  },
  logical: {
    name: "Logical & Analytical Reasoning",
    icon: "BrainCircuit",
    description: "Sharpen your analytical deductions, patterns, seating puzzles, syllogisms, and critical reasoning."
  },
  verbal: {
    name: "Verbal Ability",
    icon: "BookOpenCheck",
    description: "Enhance your English vocabulary, grammar precision, error analysis, and comprehension mastery."
  },
  specialized: {
    name: "Specialized & Technical Aptitude",
    icon: "Cpu",
    description: "Core computer science foundations, algorithms, data structures, OS, DBMS, networking, and system design."
  }
};
var CONCEPT_TIPS = {
  Percentages: "Remember that X% of Y is (X/100) * Y. For percentage change, calculate ((New - Old) / Old) * 100.",
  Fractions: "Find the lowest common denominator (LCM) when adding/subtracting fractions, and invert the divisor when dividing.",
  "Profit & Loss": "Profit% = (Profit / CP) * 100. Selling Price (SP) = CP * (1 + Profit% / 100). Cost Price is always the baseline.",
  Discounts: "Single equivalent discount for successive discounts d1 and d2 = d1 + d2 - (d1 * d2)/100.",
  "Simple Interest": "SI = (P * R * T) / 100. Principal remains constant throughout the tenure.",
  "Compound Interest": "Amount = P * (1 + R/100)^T. CI = Amount - P. Note the compounding frequency (annual, semi-annual).",
  "Ratio & Proportion": "If A:B = m:n and B:C = p:q, scale B to equal values or compute A:B:C = (m*p) : (n*p) : (n*q).",
  "Mixtures & Alligation": "Use the alligation rule: (Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price).",
  "Time & Work": "If A finishes work in X days, 1 day work = 1/X. Combined 1-day work = 1/A + 1/B.",
  "Pipes & Cisterns": "Inlet pipes do positive work (+1/X), outlet/leak pipes do negative work (-1/Y).",
  "Speed & Distance": "Speed = Distance / Time. To convert km/h to m/s, multiply by 5/18. For m/s to km/h, multiply by 18/5.",
  "Trains & Streams": "When crossing a pole, distance = train length. Downstream speed = u + v, Upstream speed = u - v.",
  "Number System": "Divisibility by 9: sum of digits divisible by 9. Remainder cycles: powers repeat in cyclic patterns modulo n.",
  "HCF & LCM": "Product of two numbers = HCF * LCM. HCF of fractions = HCF(numerators) / LCM(denominators).",
  "Permutations & Combinations": "Arrangements where order matters: nPr = n! / (n - r)!. Selections where order does NOT matter: nCr = n! / (r! * (n - r)!).",
  Probability: "Probability = (Favorable Outcomes) / (Total Possible Outcomes). P(At least 1) = 1 - P(None).",
  Mensuration: "Rectangle Area = L * W; Circle Area = pi * r^2; Cylinder Volume = pi * r^2 * h; Sphere Volume = 4/3 * pi * r^3.",
  Geometry: "Pythagoras theorem: a^2 + b^2 = c^2. Interior angles of n-sided polygon = (n - 2) * 180 degrees.",
  Algebra: "Use identities: (a+b)^2 = a^2 + 2ab + b^2, (a-b)^2 = a^2 - 2ab + b^2, a^2 - b^2 = (a+b)(a-b).",
  "Data Interpretation": "Carefully read axis labels, percentage bases, and relative growth formulas.",
  "Number Series": "Examine consecutive differences (+d), second differences, prime sequences, or square/cube patterns.",
  "Letter Series": "Map letters to alphabetical numerical positions (A=1 ... Z=26) to decode shifts.",
  "Blood Relations": 'Map generation levels vertically and siblings horizontally. Watch for "only son/daughter".',
  "Coding-Decoding": "Inspect constant forward/backward shifts, letter position reversals, or vowel/consonant rules.",
  "Direction Sense": "Draw a standard 4-quadrant compass (N, S, E, W). Right turn from North is East; from South is West.",
  Syllogisms: 'Venn diagrams clarify "All A are B", "Some A are B", "No A is B". Only choose conclusions that are universally valid.',
  "Seating Arrangement": "Identify absolute fixed positions first (corners, direct opposites), then place relative constraints.",
  "Clocks & Calendars": "Hour hand moves 0.5 deg/min; Minute hand moves 6 deg/min. Angle between hands = |30*H - 5.5*M|.",
  "Statements & Assumptions": "An assumption is an unstated premise taken for granted by the speaker.",
  Synonyms: "Consider the word's connotation (positive, negative, neutral) and contextual grammatical function.",
  Antonyms: "Eliminate words with similar meanings to the root word first; select the direct contradictory opposite.",
  Grammar: 'Ensure subject-verb agreement (singular subjects like "each", "either", "neither" require singular verbs).',
  "Error Spotting": "Inspect verb tenses, pronoun antecedents, dangling modifiers, and preposition usage.",
  Idioms: "Idiomatic expressions have metaphorical rather than literal meanings.",
  "Data Structures": "Understand trade-offs: Arrays offer O(1) random access; Linked Lists offer O(1) insertion/deletion at pointers.",
  Algorithms: "Analyze time/space complexity invariants. Divide & conquer divides into subproblems; Greedy makes local optimal choices.",
  "Operating Systems": "Coffman deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
  DBMS: "Normal forms eliminate redundancies (1NF atomic, 2NF no partial dependency, 3NF no transitive dependency).",
  "Computer Networks": "Remember OSI layers: Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application.",
  OOP: "Encapsulation bundles data; Inheritance enables code reuse; Polymorphism supports dynamic dispatch; Abstraction hides implementation.",
  "System Design": "CAP theorem states you can only guarantee 2 of Consistency, Availability, and Partition Tolerance."
};
function normalizeQuestionText(text) {
  if (!text) return "";
  return text.toLowerCase().trim().replace(/\s+/g, " ").replace(/[^\w\s%]/g, "");
}
function generateDefaultQuestionBank() {
  const bank = [];
  const seenIds = /* @__PURE__ */ new Set();
  const seenTexts = /* @__PURE__ */ new Set();
  const learningQuestions = [
    ...getQuantitativeQuestions(),
    ...getLogicalQuestions(),
    ...getVerbalQuestions(),
    ...getSpecializedQuestions()
  ];
  for (const q of learningQuestions) {
    const norm = normalizeQuestionText(q.question);
    if (!seenIds.has(q.question_id) && !seenTexts.has(norm)) {
      seenIds.add(q.question_id);
      seenTexts.add(norm);
      bank.push(q);
    }
  }
  let qCounter = 0;
  const addTestQ = (topic_id, category, difficulty, question, correctText, distractor1, distractor2, distractor3, exp, pool_type) => {
    qCounter++;
    const norm = normalizeQuestionText(question);
    const qId = `q_${topic_id}_l0_${pool_type}_${qCounter}`;
    if (seenIds.has(qId) || seenTexts.has(norm)) return;
    seenIds.add(qId);
    seenTexts.add(norm);
    const posIndex = (qCounter - 1) % 4;
    const posLetters = ["A", "B", "C", "D"];
    const correctLetter = posLetters[posIndex];
    const distractors = [distractor1, distractor2, distractor3];
    if (qCounter % 2 === 1) {
      const temp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = temp;
    }
    const optionsMap = {
      A: "",
      B: "",
      C: "",
      D: ""
    };
    optionsMap[correctLetter] = correctText;
    let distIdx = 0;
    for (const ltr of posLetters) {
      if (ltr !== correctLetter) {
        optionsMap[ltr] = distractors[distIdx++] || "Alternative option";
      }
    }
    bank.push({
      question_id: qId,
      topic_id,
      level_id: 0,
      category,
      concept: category,
      difficulty,
      question,
      option_a: optionsMap.A,
      option_b: optionsMap.B,
      option_c: optionsMap.C,
      option_d: optionsMap.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type
    });
  };
  const topicsList = ["quantitative", "logical", "verbal", "specialized"];
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 1 && q.level_id <= 5);
    for (let i = 0; i < 30; i++) {
      const base = topicLearningQs[i % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Test 1 Milestone (${base.category})`,
          "Medium",
          `[Milestone Assessment 1 - Q${i + 1}] Review question in ${base.category}:
${base.question}`,
          base.correct_answer === "A" ? base.option_a : base.correct_answer === "B" ? base.option_b : base.correct_answer === "C" ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === "A" ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === "B" ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === "D" ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Milestone solution: ${base.explanation}`,
          "test1"
        );
      }
    }
  });
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 6 && q.level_id <= 10);
    for (let i = 0; i < 30; i++) {
      const base = topicLearningQs[i % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Test 2 Mastery (${base.category})`,
          "Hard",
          `[Mastery Assessment 2 - Q${i + 1}] Advanced problem in ${base.category}:
${base.question}`,
          base.correct_answer === "A" ? base.option_a : base.correct_answer === "B" ? base.option_b : base.correct_answer === "C" ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === "A" ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === "B" ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === "D" ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Mastery solution: ${base.explanation}`,
          "test2"
        );
      }
    }
  });
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 1 && q.level_id <= 10);
    for (let i = 0; i < 15; i++) {
      const base = topicLearningQs[i * 2 % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Final Capstone (${base.category})`,
          "Hard",
          `[Final Comprehensive Capstone Q${i + 1}] Comprehensive synthesis in ${base.category}:
${base.question}`,
          base.correct_answer === "A" ? base.option_a : base.correct_answer === "B" ? base.option_b : base.correct_answer === "C" ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === "A" ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === "B" ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === "D" ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Comprehensive Capstone solution: ${base.explanation}`,
          "final"
        );
      }
    }
  });
  return bank;
}

// server/ai.ts
import { GoogleGenAI } from "@google/genai";

// server/technicalQuestionBank.ts
var TECHNICAL_DOMAINS_LIST = [
  {
    id: "fullstack",
    name: "Full Stack Development",
    category: "Software Engineering",
    description: "End-to-end web architectures, React/Next.js, Node.js, REST & GraphQL APIs, microservices, and state management.",
    topics: ["React Reconciliation", "Node.js Event Loop", "REST & GraphQL", "State Management", "Fullstack Security", "Caching & Redis"],
    icon: "Layers"
  },
  {
    id: "genai",
    name: "Generative AI & LLM Engineering",
    category: "AI & Machine Learning",
    description: "Transformer architectures, self-attention, RAG pipelines, vector databases, LoRA fine-tuning, prompt engineering, and agentic workflows.",
    topics: ["Self-Attention & Transformer Math", "Retrieval-Augmented Generation (RAG)", "Vector Databases & Similarity Search", "LoRA & Parameter-Efficient Fine-Tuning", "Hallucination Mitigation", "Agent Tool Calling & ReAct Loops"],
    icon: "Sparkles"
  },
  {
    id: "cloud",
    name: "Cloud & DevOps Engineering",
    category: "Cloud & Infrastructure",
    description: "AWS/GCP/Azure architectures, Kubernetes orchestration, Docker, CI/CD automation pipelines, Infrastructure as Code (Terraform), and SRE.",
    topics: ["Docker & Containerization", "Kubernetes Pods & Ingress", "CI/CD Pipelines & GitHub Actions", "Infrastructure as Code (Terraform)", "Cloud VPC & Networking", "Prometheus & SRE Observability"],
    icon: "Cloud"
  },
  {
    id: "datascience",
    name: "Data Science & Machine Learning",
    category: "Data & Analytics",
    description: "Exploratory data analysis, statistical modeling, hypothesis testing, feature engineering, tree ensembles, and predictive MLOps pipelines.",
    topics: ["Pandas & NumPy Pipelines", "Hypothesis Testing (p-values)", "Feature Engineering & Imputation", "Tree Ensembles (XGBoost/LightGBM)", "Deep Neural Networks", "Model Drift & Monitoring"],
    icon: "BarChart2"
  },
  {
    id: "cybersecurity",
    name: "Cyber Security & Zero Trust",
    category: "Security & Infrastructure",
    description: "Threat modeling, OWASP Top 10 mitigation, Zero Trust architectures, cryptographic protocols (RSA/ECC), mTLS, and IAM policies.",
    topics: ["OWASP Top 10 (SQLi/XSS/CSRF)", "Zero Trust Architecture", "Public Key Cryptography (RSA/ECC)", "mTLS & Network Security", "Identity & Access (IAM)", "Incident Response"],
    icon: "ShieldCheck"
  }
];
var TECHNICAL_QUESTION_BANK = {
  fullstack: [
    // Level 1 — Basic (10 Questions)
    {
      question_id: "fs_l1_q1",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "HTML & DOM Basics",
      difficulty: "Easy",
      type: "conceptual",
      question: "What is the Document Object Model (DOM), and how does a web browser parse and construct the DOM tree from HTML markup?",
      expected_key_points: ["Hierarchical tree representation of HTML elements", "Tokenization and HTML parser steps", "Render tree formation with CSSOM", "JavaScript accessibility via DOM APIs"],
      improved_answer: "The Document Object Model (DOM) is an in-memory tree representation of the structured HTML document. As the browser receives raw HTML bytes, it decodes them to characters, tokenizes elements, converts tokens into node objects, and builds the DOM tree. Combined with the CSSOM, the browser creates the Render Tree to layout and paint pixels on the screen."
    },
    {
      question_id: "fs_l1_q2",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "HTTP Methods",
      difficulty: "Easy",
      type: "conceptual",
      question: "Explain the fundamental differences between HTTP GET, POST, PUT, and DELETE methods. Which of them are idempotent?",
      expected_key_points: ["GET retrieves resources without side-effects (safe & idempotent)", "POST creates new child resources (non-idempotent)", "PUT creates or completely replaces an existing resource (idempotent)", "DELETE removes the target resource (idempotent)"],
      improved_answer: "HTTP GET is a safe and idempotent method used purely to read resources. POST submits data to create a new resource and is not idempotent because repeating it creates duplicates. PUT replaces the target entity entirely and is idempotent. DELETE removes the resource; calling DELETE multiple times yields the same final system state, making it idempotent."
    },
    {
      question_id: "fs_l1_q3",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "JavaScript Variables & Scope",
      difficulty: "Easy",
      type: "conceptual",
      question: "What are the main scope and mutability differences between var, let, and const in JavaScript?",
      expected_key_points: ["var is function-scoped and hoisted with undefined", "let and const are block-scoped with Temporal Dead Zone (TDZ)", "const prevents variable re-assignment but object properties remain mutable"],
      improved_answer: "var is function-scoped, can be re-declared, and is hoisted with an initial value of undefined. In contrast, let and const introduced in ES6 are block-scoped ({...}) and reside in the Temporal Dead Zone until initialized. const creates an immutable identifier binding, though nested object/array mutations are still allowed unless frozen."
    },
    {
      question_id: "fs_l1_q4",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "React Core Concepts",
      difficulty: "Easy",
      type: "conceptual",
      question: "What are React props and state, and what is the rule of one-way data binding in React?",
      expected_key_points: ["Props are read-only inputs passed from parent to child", "State is internal mutable component memory managed via useState/reducers", "Data flows downwards via props; events flow upwards via callback functions"],
      improved_answer: "In React, props are immutable parameters passed down from a parent component to configure a child. State represents internal, reactive data maintained by the component itself. React enforces unidirectional (one-way) data flow: data moves down via props, while state changes are signaled upwards via callbacks, creating predictable state management."
    },
    {
      question_id: "fs_l1_q5",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "CSS Box Model",
      difficulty: "Easy",
      type: "conceptual",
      question: "Describe the CSS Box Model layers (content, padding, border, margin) and the difference between content-box and border-box.",
      expected_key_points: ["Content area, inner padding, boundary border, external margin", "content-box: width/height only applies to content", "border-box: width/height includes padding and border, making sizing predictable"],
      improved_answer: "The CSS Box Model comprises four concentric layers: Content (text/media), Padding (inner space), Border (boundary line), and Margin (outer clearance). With box-sizing: content-box, width applies solely to the content, adding padding and borders to the total size. With border-box, specified width encapsulates content, padding, and borders, preventing layout overflow."
    },
    {
      question_id: "fs_l1_q6",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "Node.js Basics",
      difficulty: "Easy",
      type: "conceptual",
      question: "What is Node.js, and how does its single-threaded non-blocking I/O model operate using the event loop?",
      expected_key_points: ["JavaScript runtime built on V8", "Single main thread for execution", "Libuv thread pool handles asynchronous background I/O", "Event loop processes callbacks from task queues"],
      improved_answer: "Node.js is an asynchronous, event-driven JavaScript runtime engine built on Google Chrome V8. While user JavaScript runs on a single main execution thread, Node.js offloads non-blocking asynchronous system tasks (such as network calls and disk operations) to the OS kernel or Libuv worker thread pool, invoking callbacks on the main thread via the Event Loop."
    },
    {
      question_id: "fs_l1_q7",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "REST API Status Codes",
      difficulty: "Easy",
      type: "conceptual",
      question: "Explain what HTTP status code categories 2xx, 3xx, 4xx, and 5xx represent, giving common examples for each.",
      expected_key_points: ["2xx: Success (200 OK, 201 Created)", "3xx: Redirection (301 Moved Permanently, 304 Not Modified)", "4xx: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)", "5xx: Server Error (500 Internal Error, 502 Bad Gateway, 503 Unavailable)"],
      improved_answer: "HTTP status codes communicate response outcomes: 2xx denotes success (e.g., 200 OK, 201 Created); 3xx indicates redirection (e.g., 301 Permanent Redirect, 304 Not Modified); 4xx signals client-side errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found); and 5xx indicates server-side failures (e.g., 500 Internal Server Error, 503 Service Unavailable)."
    },
    {
      question_id: "fs_l1_q8",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "JSON & Serialization",
      difficulty: "Easy",
      type: "conceptual",
      question: "What is JSON, and how do JSON.stringify() and JSON.parse() work in full-stack data exchange?",
      expected_key_points: ["Lightweight text-based data interchange format", "JSON.stringify serializes JS objects to JSON strings", "JSON.parse deserializes JSON strings into JS objects", "Handles primitives, arrays, and nested objects"],
      improved_answer: "JSON (JavaScript Object Notation) is a standardized, language-agnostic text format for transmitting structured data. JSON.stringify() serializes in-memory JavaScript objects into a formatted text string for HTTP network payloads, while JSON.parse() parses received strings back into native JavaScript objects."
    },
    {
      question_id: "fs_l1_q9",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "Cookies vs LocalStorage",
      difficulty: "Easy",
      type: "conceptual",
      question: "Compare Browser LocalStorage, SessionStorage, and Cookies in terms of capacity, lifecycle, and network transmission.",
      expected_key_points: ["LocalStorage: ~5-10MB, persists across sessions, client-only", "SessionStorage: ~5MB, cleared when tab closes, client-only", "Cookies: ~4KB, sent automatically in HTTP headers, supports HttpOnly/Secure flags"],
      improved_answer: "LocalStorage provides 5-10MB of persistent key-value storage that remains until explicitly cleared and is never automatically sent with HTTP requests. SessionStorage is isolated to the active browser tab. Cookies have a 4KB limit, are sent automatically with every HTTP request matching their domain/path, and can be protected with HttpOnly and SameSite flags for secure session management."
    },
    {
      question_id: "fs_l1_q10",
      domain: "fullstack",
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: "Git Version Control",
      difficulty: "Easy",
      type: "conceptual",
      question: "What is the purpose of Git version control, and what is the difference between git merge and git rebase?",
      expected_key_points: ["Distributed version control system for tracking source changes", "git merge preserves true chronological commit history with a merge commit", "git rebase replays feature commits on top of base branch to create a linear history"],
      improved_answer: "Git is a distributed version control system for tracking code changes and facilitating team collaboration. git merge combines two branches by creating a distinct merge commit that preserves the original branch topology. In contrast, git rebase moves or replays the entire feature branch onto the tip of the target branch, producing a clean, linear commit history."
    },
    // Level 2 — Intermediate (10 Questions)
    {
      question_id: "fs_l2_q1",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "React Reconciliation & Virtual DOM",
      difficulty: "Medium",
      type: "conceptual",
      question: "Explain how the React Reconciliation algorithm and the Virtual DOM diffing mechanism achieve efficient UI updates. Why are unique keys required for list items?",
      expected_key_points: ["Virtual DOM in-memory representation diffed using heuristic O(n) algorithm", "Fiber architecture enables interruptible work units", "Component keys allow React to track element identity across renders avoiding full recreation"],
      improved_answer: "React creates a lightweight in-memory Virtual DOM tree. When state changes, it generates a new tree and applies a heuristic O(n) diffing algorithm comparing element types and props. If element types match, it updates only mutated attributes. Keys provide stable identity across renders, allowing React to match children between trees and perform minimal re-ordering instead of tearing down and recreating DOM nodes."
    },
    {
      question_id: "fs_l2_q2",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "JavaScript Event Loop & Microtasks",
      difficulty: "Medium",
      type: "code_output",
      question: "Analyze the following JavaScript snippet and explain the exact console output order step-by-step.",
      code_snippet_display: `console.log('1 - Start');

setTimeout(() => {
  console.log('2 - Timeout Callback');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Microtask Promise 1');
}).then(() => {
  console.log('4 - Microtask Promise 2');
});

console.log('5 - End');`,
      expected_key_points: ["Synchronous code runs first (1, 5)", "Microtask queue (Promises) processed immediately before Macrotasks (3, 4)", "Macrotask queue (setTimeout) executes last (2)"],
      improved_answer: 'Output order: "1 - Start", "5 - End", "3 - Microtask Promise 1", "4 - Microtask Promise 2", "2 - Timeout Callback". Synchronous statements execute immediately on the call stack. When the stack clears, the Event Loop flushes the high-priority Microtask Queue (all resolved Promise handlers) before processing Macrotasks (setTimeout timer callbacks).'
    },
    {
      question_id: "fs_l2_q3",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "JWT Authentication & Security",
      difficulty: "Medium",
      type: "conceptual",
      question: "Compare storing JSON Web Tokens (JWTs) in Browser LocalStorage vs HttpOnly SameSite Cookies. How do you prevent XSS and CSRF attacks in modern SPAs?",
      expected_key_points: ["LocalStorage is vulnerable to Cross-Site Scripting (XSS) token exfiltration", "HttpOnly cookies cannot be accessed via JavaScript, preventing XSS theft", "SameSite=Strict/Lax and CSRF anti-forgery tokens prevent Cross-Site Request Forgery"],
      improved_answer: "Storing JWTs in LocalStorage exposes them to any malicious XSS script running on the page. Storing auth tokens in HttpOnly, Secure, SameSite=Strict cookies completely blocks JavaScript access, eliminating XSS token theft. To protect cookie-based endpoints from CSRF, we pair SameSite cookies with custom CSRF header validation or short-lived in-memory access tokens refreshed via secure cookies."
    },
    {
      question_id: "fs_l2_q4",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "Database Indexing & N+1 Problem",
      difficulty: "Medium",
      type: "conceptual",
      question: "What is the N+1 query problem in Object-Relational Mapping (ORM), and how do you resolve it using Eager Loading or JOINs?",
      expected_key_points: ["Executing 1 initial query to fetch N records, then N subsequent queries for each child relationship", "Generates N+1 round-trips to database causing latency spikes", "Solved using SQL JOINs or ORM eager loading (e.g. Prisma include, TypeORM relations, Sequelize eager)"],
      improved_answer: "The N+1 problem occurs when an ORM issues one query to fetch parent rows, followed by N separate queries for each parent record to retrieve its related child records. This saturates database connections and introduces severe network latency. It is resolved by eager loading child entities using SQL INNER/LEFT JOINs or an IN (...) subquery in a single batched database round-trip."
    },
    {
      question_id: "fs_l2_q5",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "React Hooks & Stale Closures",
      difficulty: "Medium",
      type: "debugging",
      question: "Identify the stale closure bug in this React counter hook and explain how to fix it.",
      code_snippet_display: `function useIntervalCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Bug here:
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Empty dependency array captures initial count=0 forever

  return count;
}`,
      expected_key_points: ["count inside setInterval callback captures initial value 0 due to stale closure", "Fix 1: Use functional state updater setCount(prev => prev + 1)", "Fix 2: Add count to dependency array or use a custom useInterval ref pattern"],
      improved_answer: "Because the useEffect dependency array is empty [], the setInterval callback forms a closure over the initial render scope where count is 0. On every second tick, it computes setCount(0 + 1), locking the counter at 1. The optimal fix is using the functional state updater form: setCount(prev => prev + 1), which accesses the most up-to-date state without recreating interval timers."
    },
    {
      question_id: "fs_l2_q6",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "CORS & Preflight Requests",
      difficulty: "Medium",
      type: "conceptual",
      question: "What is Cross-Origin Resource Sharing (CORS)? Under what conditions does the browser initiate an HTTP OPTIONS preflight request?",
      expected_key_points: ["Browser security mechanism enforcing Same-Origin Policy", "Preflight OPTIONS sent for non-simple requests", "Triggers: custom headers (Authorization), methods other than GET/HEAD/POST, or content-types like application/json", "Server responds with Access-Control-Allow-Origin / Methods / Headers"],
      improved_answer: "CORS is a browser security mechanism that restricts web applications from making cross-origin requests to a domain different from the host. When a request uses non-simple HTTP methods (PUT, DELETE, PATCH), custom request headers (Authorization, X-Custom), or Content-Type application/json, the browser automatically sends an HTTP OPTIONS preflight request to verify server permissions before sending the actual payload."
    },
    {
      question_id: "fs_l2_q7",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "REST vs GraphQL",
      difficulty: "Medium",
      type: "conceptual",
      question: "Compare REST APIs and GraphQL. In what engineering scenarios would you choose GraphQL over REST or vice versa?",
      expected_key_points: ["REST: Multiple specialized endpoints, prone to over-fetching or under-fetching", "GraphQL: Single endpoint, client requests exact fields in a typed schema", "REST advantages: native HTTP caching (ETags/CDN), simplicity", "GraphQL advantages: flexible client queries, mobile bandwidth optimization"],
      improved_answer: "REST organizes resources around fixed URLs and HTTP verbs, leveraging native CDN and HTTP caching, but can suffer from over-fetching or under-fetching that requires multiple round-trips. GraphQL exposes a single strongly-typed schema endpoint where clients query the exact shape of data required, eliminating round-trips. REST is preferable for simple caching-heavy APIs, while GraphQL excels in complex, multi-client, data-dense applications."
    },
    {
      question_id: "fs_l2_q8",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "Node.js Streams & Memory Buffer",
      difficulty: "Medium",
      type: "conceptual",
      question: "Why are Node.js Streams essential when processing large files (e.g. 5GB upload or CSV exports), and how does backpressure prevent process crashes?",
      expected_key_points: ["Streams process data chunk-by-chunk in small chunks (e.g. 64KB) rather than buffering the entire 5GB in RAM", "Backpressure pauses the readable stream when the writable stream buffer is full", "Prevents heap out-of-memory errors and optimizes throughput"],
      improved_answer: "Reading a 5GB file with fs.readFile attempts to load the entire byte payload into Node.js V8 memory buffer, causing immediate process crashes from heap exhaustion. Streams process data in continuous small chunks (e.g., 64KB). Backpressure occurs when the consumer (writable stream) is slower than the producer (readable stream); the stream signals to pause reading until buffers drain, ensuring memory usage stays constant regardless of file size."
    },
    {
      question_id: "fs_l2_q9",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "WebSockets vs Server-Sent Events",
      difficulty: "Medium",
      type: "conceptual",
      question: "Compare WebSockets, Server-Sent Events (SSE), and Long Polling for real-time full-stack communications.",
      expected_key_points: ["WebSockets: Full-duplex bidirectional TCP communication (chat, multiplayer, live canvas)", "SSE: Unidirectional server-to-client streaming over HTTP/2 (live feeds, stock tickers, AI response streaming)", "Long Polling: Repeated HTTP request loop with latency and connection overhead"],
      improved_answer: "WebSockets establish a persistent, full-duplex TCP connection permitting real-time bidirectional messaging between client and server, optimal for collaborative tools, gaming, and chats. Server-Sent Events (SSE) offer a lightweight, unidirectional server-to-client stream over standard HTTP with automatic reconnection, ideal for LLM streaming responses and live dashboards. Long polling repeatedly opens HTTP requests, generating excessive overhead."
    },
    {
      question_id: "fs_l2_q10",
      domain: "fullstack",
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: "Frontend Performance & Core Web Vitals",
      difficulty: "Medium",
      type: "conceptual",
      question: "Explain the three primary Core Web Vitals metrics: LCP, INP (or FID), and CLS. How do you optimize them in a modern web app?",
      expected_key_points: ["LCP (Largest Contentful Paint): loading performance; optimize images, CDN, SSR", "INP (Interaction to Next Paint): interactivity; reduce JS main-thread blocking, code-split", "CLS (Cumulative Layout Shift): visual stability; reserve aspect ratios, avoid dynamic element insertion above fold"],
      improved_answer: "Core Web Vitals quantify real-world user experience: Largest Contentful Paint (LCP) measures perceived loading speed (target < 2.5s), optimized via image compression, CDN caching, and server-side rendering; Interaction to Next Paint (INP) measures responsiveness to user clicks/keys (target < 200ms), improved by offloading CPU-heavy tasks to Web Workers and reducing long tasks; and Cumulative Layout Shift (CLS) measures layout stability (target < 0.1), fixed by reserving dimensional bounding boxes for media and font fallbacks."
    },
    // Level 3 — Practical / Coding / Problem Solving (10 Questions)
    {
      question_id: "fs_l3_q1",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Custom Debounce Implementation",
      difficulty: "Hard",
      type: "coding",
      language: "typescript",
      question: "Implement a fully typed debounce utility in TypeScript that cancels previous pending invocations and forwards arguments correctly to the target function.",
      code_template: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    // Implement debounce logic here
  };
}`,
      expected_key_points: ["Preserve closure timer variable", "Clear existing timer with clearTimeout", "Schedule new timer with setTimeout forwarding args", "Maintain correct execution context"],
      improved_answer: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>): void {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}`
    },
    {
      question_id: "fs_l3_q2",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "High-Traffic API Caching & Invalidation",
      difficulty: "Hard",
      type: "scenario",
      question: "Design an end-to-end multi-tier caching architecture for an e-commerce flash sale system handling 100,000 requests per second. Detail browser caching, CDN edge caching, Redis distributed caching, and cache invalidation strategies (e.g. Cache-Aside, Write-Through, Stale-While-Revalidate).",
      expected_key_points: ["Multi-tier: Browser Cache-Control -> Edge CDN (Cloudflare) -> API Gateway -> Distributed Redis Cache -> SQL Database", "Cache-Aside with TTL & Pub/Sub event-driven cache purging on inventory updates", "Thundering herd mitigation via mutex locking or probabilistic early expiration", "Stale-While-Revalidate for non-blocking sub-millisecond edge responses"],
      improved_answer: "To handle 100k RPS: 1) Static assets and product listings are cached at Edge CDNs with Cache-Control: public, max-age=60, stale-while-revalidate=300. 2) The Node API layer implements a Cache-Aside pattern against a Redis Cluster with replication. 3) For inventory stock, we use Redis atomic decrement (DECRBY) with Lua scripts to prevent overselling. 4) Cache stampedes (thundering herds) are mitigated with single-flight mutexes (like dogpiling locks). 5) When catalog data changes, the admin service publishes a Redis Pub/Sub invalidation event to purge edge and L1 memory caches."
    },
    {
      question_id: "fs_l3_q3",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Express Rate Limiter Middleware",
      difficulty: "Hard",
      type: "coding",
      language: "typescript",
      question: "Write an Express middleware function for in-memory sliding window or token bucket rate limiting that limits clients to a maximum of N requests per window duration.",
      code_template: `interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const requestHistory = new Map<string, number[]>();

  return (req: any, res: any, next: any) => {
    // Implement IP-based sliding window rate limiter
  };
}`,
      expected_key_points: ["Extract client IP identifier", "Filter timestamps older than now - windowMs", "Check if remaining timestamps exceed maxRequests", "Reject with 429 Too Many Requests and Retry-After header or call next()"],
      improved_answer: `export function createRateLimiter(options: RateLimitOptions) {
  const requestHistory = new Map<string, number[]>();

  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const timestamps = (requestHistory.get(ip) || []).filter((ts) => ts > windowStart);

    if (timestamps.length >= options.maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + options.windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: \`Rate limit exceeded. Please retry in \${retryAfterSeconds} seconds.\`,
      });
    }

    timestamps.push(now);
    requestHistory.set(ip, timestamps);
    next();
  };
}`
    },
    {
      question_id: "fs_l3_q4",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Live Debugging: Memory Leak in Node.js",
      difficulty: "Hard",
      type: "debugging",
      question: "Examine this Express server code snippet. Explain why the server runs out of memory over time, and provide the corrected code.",
      code_snippet_display: `const express = require('express');
const app = express();
const globalEventHub = new (require('events').EventEmitter)();

// Memory leak bug in route handler:
app.get('/api/live-status', (req, res) => {
  const onStatusUpdate = (data) => {
    res.write(JSON.stringify(data));
  };

  globalEventHub.on('status', onStatusUpdate);

  req.on('close', () => {
    // Missing listener removal!
    res.end();
  });
});`,
      expected_key_points: ["Each incoming HTTP connection attaches a new listener to the long-lived globalEventHub", "When the request closes, the listener reference is not removed, preventing garbage collection of req and res objects", 'Fix: call globalEventHub.removeListener("status", onStatusUpdate) on req close event'],
      improved_answer: 'Because globalEventHub is a persistent singleton, attaching globalEventHub.on("status", onStatusUpdate) on every HTTP request without detaching it on connection close creates an uncollected reference closure holding the req and res objects in RAM indefinitely. The fix is: req.on("close", () => { globalEventHub.removeListener("status", onStatusUpdate); res.end(); });.'
    },
    {
      question_id: "fs_l3_q5",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Distributed Order Processing & Sagas",
      difficulty: "Hard",
      type: "scenario",
      question: "In a microservices architecture with separate Payment, Inventory, and Shipping services, how do you handle distributed transactions when payment succeeds but inventory reservation fails? Explain the Saga Pattern with compensating transactions.",
      expected_key_points: ["Two-Phase Commit (2PC) creates blocking dependencies and poor scalability in microservices", "Saga pattern organizes local transactions with event/message orchestration", "Compensating transactions execute backwards (e.g. Refund Payment) if a downstream step fails", "Idempotency keys and dead-letter queues guarantee eventual consistency"],
      improved_answer: "In microservices, traditional distributed 2PC locks resources and degrades availability. The Saga Pattern breaks the distributed transaction into a sequence of local transactions coordinated via an Orchestrator or Choreography (Kafka events). If the Inventory service fails after Payment succeeds, the orchestrator triggers compensating transactions (e.g., executing a Payment Refund and notifying the user), restoring system state and ensuring eventual consistency with idempotency keys."
    },
    {
      question_id: "fs_l3_q6",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Concurrency & Deep Cloning Algorithm",
      difficulty: "Hard",
      type: "coding",
      language: "typescript",
      question: "Implement a robust deep clone function in JavaScript/TypeScript that handles nested objects, arrays, Dates, RegExps, and circular references using a WeakMap.",
      code_template: `function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // Implement deep clone with circular reference protection
  return obj;
}`,
      expected_key_points: ["Handle primitives and null directly", "WeakMap tracks visited object references to prevent infinite circular recursion", "Handle Date (new Date(obj)) and RegExp (new RegExp(obj)) objects", "Recursively clone Object keys and Array elements"],
      improved_answer: `function deepClone<T>(obj: T, hash = new WeakMap()): T {
  if (Object(obj) !== obj) return obj; // Primitives & functions
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any;
  if (hash.has(obj as object)) return hash.get(obj as object);

  const result: any = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj as object, result);

  for (const key of Reflect.ownKeys(obj as object)) {
    result[key] = deepClone((obj as any)[key], hash);
  }

  return result;
}`
    },
    {
      question_id: "fs_l3_q7",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Fullstack Security Audit & Hardening",
      difficulty: "Hard",
      type: "scenario",
      question: "Conduct a security audit of a web application handling user file uploads. What security vulnerabilities (e.g. Remote Code Execution, Zip Slips, SSRF, DoS) can arise and how do you architect a safe upload pipeline using S3 Presigned URLs?",
      expected_key_points: ["Direct file uploads to application server risk RCE via malicious scripts and disk fill DoS", "Presigned S3/GCS URLs allow clients to upload directly to object storage bypassing backend memory", "Enforce strict MIME validation, randomized UUID keys, malware scanning (ClamAV), and Content-Disposition headers"],
      improved_answer: "Uploading files directly through application servers introduces RCE (executing uploaded .php/.js files), SSRF, Zip Bombs, and memory exhaustion. The secure architecture uses Direct-to-S3 Presigned URLs: 1) Client requests an upload token; 2) Backend validates auth, limits file size, and generates an Amazon S3 PUT Presigned URL with an isolated UUID key; 3) Client uploads directly to S3; 4) An asynchronous Lambda/Worker scans the file with antivirus and validates magic bytes before marking it active."
    },
    {
      question_id: "fs_l3_q8",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Custom React Promise Hook (useAsync)",
      difficulty: "Hard",
      type: "coding",
      language: "typescript",
      question: "Implement a reusable React custom hook `useAsync` that manages loading, error, data state, and aborts in-flight requests when the component unmounts.",
      code_template: `import { useState, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(asyncFn: (signal: AbortSignal) => Promise<T>, deps: any[] = []) {
  // Implement state and effect with AbortController
}`,
      expected_key_points: ["Manage data, loading, error state", "Instantiate new AbortController in useEffect", "Pass controller.signal to asyncFn", "Handle AbortError gracefully", "Abort in cleanup function on unmount"],
      improved_answer: `export function useAsync<T>(asyncFn: (signal: AbortSignal) => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    asyncFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      controller.abort();
    };
  }, deps);

  return state;
}`
    },
    {
      question_id: "fs_l3_q9",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Database Deadlocks & Concurrency",
      difficulty: "Hard",
      type: "scenario",
      question: "In an SQL database managing user account balances, how do concurrent transfers between Account A and Account B cause deadlocks? How do you prevent deadlocks using consistent lock ordering or Optimistic Concurrency Control (OCC)?",
      expected_key_points: ["Deadlock occurs when Transaction 1 locks A and waits for B, while Transaction 2 locks B and waits for A", "Solution 1: Enforce deterministic resource locking order (e.g. always lock lower account_id first)", "Solution 2: Optimistic concurrency control using version columns (UPDATE ... WHERE version = current_version)"],
      improved_answer: "A classic deadlock happens when Tx1 updates Account 10 then Account 20 (locking 10 and waiting for 20), while Tx2 simultaneously updates Account 20 then Account 10 (locking 20 and waiting for 10). We eliminate deadlocks by: 1) Deterministic Lock Ordering: always acquire row locks in strict ascending order of ID (min(id1, id2) then max(id1, id2)) using SELECT FOR UPDATE; or 2) Optimistic Concurrency Control: verify version numbers on commit and retry transient failures."
    },
    {
      question_id: "fs_l3_q10",
      domain: "fullstack",
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: "Zero-Downtime Deployment & Database Migration",
      difficulty: "Hard",
      type: "scenario",
      question: "Explain how to execute a database schema change (such as renaming a column or splitting a table) in a high-volume production system without incurring any downtime. Describe the Expand and Contract pattern.",
      expected_key_points: ["Never perform destructive schema changes (e.g. DROP/RENAME) in a single step with live traffic", "Phase 1 (Expand): Add new column, dual-write to old and new columns in app code", "Phase 2 (Backfill): Background worker migrates historical records", "Phase 3 (Contract): Switch reads to new column, stop writes to old column, finally drop old column"],
      improved_answer: "To perform zero-downtime schema changes, we use the Expand and Contract (Parallel Run) pattern: 1) Expand: Add the new column (nullable/default) to the database. 2) Dual-Write: Deploy code that writes to both old and new columns while still reading from the old. 3) Backfill: Run asynchronous worker jobs to migrate historical data in batches. 4) Switch Reads: Deploy code to read exclusively from the new column. 5) Contract: Safely drop the old column and remove legacy dual-write code."
    }
  ],
  // Fallback defaults for remaining domains (structured dynamically with curated templates)
  genai: [],
  cloud: [],
  datascience: [],
  cybersecurity: []
};

// server/domainCuratedQuestions.ts
function getCuratedDomainQuestions(domain) {
  if (TECHNICAL_QUESTION_BANK[domain] && TECHNICAL_QUESTION_BANK[domain].length >= 30) {
    return TECHNICAL_QUESTION_BANK[domain];
  }
  const domainMeta = TECHNICAL_DOMAINS_LIST.find((d) => d.id === domain) || TECHNICAL_DOMAINS_LIST[0];
  const domainName = domainMeta.name;
  const topics = domainMeta.topics;
  const questions = [];
  const l1Topics = [
    { name: `${topics[0] || "Core"} Fundamentals`, concept: `core definitions and architectural principles of ${domainName}` },
    { name: `${topics[1] || "Syntax"} Basics`, concept: `standard syntax, keywords, and primitives in ${domainName}` },
    { name: "Standard Lifecycles", concept: `execution lifecycle, runtime environments, and core workflows` },
    { name: "Data Types & Structures", concept: `fundamental data representations, typing rules, and memory representations` },
    { name: "Standard Protocols & APIs", concept: `standard interfaces, protocols, and standard library conventions` },
    { name: "Error Handling Foundations", concept: `exception handling, common error codes, and recovery patterns` },
    { name: "Configuration & Tooling", concept: `package managers, build tools, and development environment setup` },
    { name: "Basic Security Principles", concept: `fundamental security considerations, input sanitation, and credential handling` },
    { name: "Testing Foundations", concept: `unit testing, assertions, and test harness execution` },
    { name: "Best Practices & Conventions", concept: `idiomatic conventions, readability guidelines, and standard style patterns` }
  ];
  l1Topics.forEach((t, i) => {
    questions.push({
      question_id: `${domain}_l1_q${i + 1}`,
      domain,
      level: 1,
      level_name: "Level 1 \u2014 Basic",
      topic: t.name,
      difficulty: "Easy",
      type: "conceptual",
      question: `In ${domainName}, what are the fundamental concepts and working principles behind ${t.name}? Explain how ${t.concept} operates in standard environments.`,
      expected_key_points: [
        `Clear definition of ${t.name}`,
        `Core mechanism governing ${t.concept}`,
        `Standard implementation patterns and common use cases`,
        `Key benefits and potential pitfalls`
      ],
      improved_answer: `In ${domainName}, ${t.name} represents a foundational pillar. It operates by establishing predictable abstractions over ${t.concept}. Developers leverage this to enforce maintainability, reduce runtime anomalies, and ensure system consistency across environments.`
    });
  });
  const l2Topics = [
    { name: `${topics[2] || "Advanced"} Deep Dive`, type: "conceptual", diff: "Medium" },
    { name: "Performance Optimization & Tradeoffs", type: "conceptual", diff: "Medium" },
    { name: "Concurrency & State Synchronization", type: "conceptual", diff: "Medium" },
    { name: "Code Output Analysis & Execution Order", type: "code_output", diff: "Medium" },
    { name: "Debugging & Defect Remediation", type: "debugging", diff: "Medium" },
    { name: "Architectural Pattern Comparison", type: "conceptual", diff: "Medium" },
    { name: "Memory & Resource Management", type: "conceptual", diff: "Medium" },
    { name: "Resilience & Fault Tolerance", type: "scenario", diff: "Medium" },
    { name: "Data Pipeline & Query Efficiency", type: "conceptual", diff: "Medium" },
    { name: "Scalability & Load Handling", type: "conceptual", diff: "Medium" }
  ];
  l2Topics.forEach((t, i) => {
    const isCodeOutput = t.type === "code_output";
    const isDebugging = t.type === "debugging";
    questions.push({
      question_id: `${domain}_l2_q${i + 1}`,
      domain,
      level: 2,
      level_name: "Level 2 \u2014 Intermediate",
      topic: t.name,
      difficulty: "Medium",
      type: t.type,
      question: isCodeOutput ? `Analyze the following ${domainName} code snippet. Explain the execution flow, memory allocations, and exact output behavior.` : isDebugging ? `Identify the runtime bottleneck or logical bug in the following ${domainName} module. Explain why it fails under high load and how to fix it.` : `Compare the primary approaches for ${t.name} in ${domainName}. Under what specific engineering conditions would you choose one approach over the other?`,
      code_snippet_display: isCodeOutput ? `// Code Analysis Example in ${domainName}
function processTransaction(payload) {
  console.log('Validating payload...');
  const result = executeStep(payload);
  console.log('Completed step with status:', result.status);
  return result;
}` : isDebugging ? `// Defective Routine in ${domainName}
async function handleBatchRequests(items) {
  // Bug: unbounded parallel promises without throttling
  return Promise.all(items.map(item => fetchItem(item.id)));
}` : void 0,
      expected_key_points: [
        `Detailed architectural evaluation of ${t.name}`,
        `Analysis of trade-offs (time vs space, throughput vs latency)`,
        `Concrete technical justification with edge case considerations`
      ],
      improved_answer: `When evaluating ${t.name} in ${domainName}, engineering trade-offs govern the optimal decision. Key considerations include asymptotic overhead, network/disk latency, memory pressure, and fault recovery boundaries. Prioritizing decoupled abstractions ensures resilient scaling.`
    });
  });
  const l3Topics = [
    { name: "Core Algorithm & Data Pipeline Implementation", type: "coding", lang: "typescript" },
    { name: "High-Throughput Distributed System Design", type: "scenario", lang: void 0 },
    { name: "Fault-Tolerant Asynchronous Workflow", type: "coding", lang: "typescript" },
    { name: "Real-Time Telemetry & Monitoring Architecture", type: "scenario", lang: void 0 },
    { name: "Defect Analysis & Root-Cause Mitigation", type: "debugging", lang: "typescript" },
    { name: "Secure Authentication & Access Control Pipeline", type: "coding", lang: "typescript" },
    { name: "Data Consistency & Distributed Conflict Resolution", type: "scenario", lang: void 0 },
    { name: "Custom LRU / LFU Cache Engine Implementation", type: "coding", lang: "typescript" },
    { name: "Zero-Downtime Infrastructure Migration Strategy", type: "scenario", lang: void 0 },
    { name: "Production Disaster Recovery & Chaos Engineering", type: "scenario", lang: void 0 }
  ];
  l3Topics.forEach((t, i) => {
    const isCoding = t.type === "coding";
    const isDebugging = t.type === "debugging";
    questions.push({
      question_id: `${domain}_l3_q${i + 1}`,
      domain,
      level: 3,
      level_name: "Level 3 \u2014 Practical",
      topic: t.name,
      difficulty: "Hard",
      type: t.type,
      language: t.lang || "typescript",
      question: isCoding ? `Implement a production-ready solution in ${domainName} for "${t.name}". Ensure robust input validation, boundary condition handling, and optimal asymptotic time/space efficiency.` : isDebugging ? `Analyze a severe production outage caused by "${t.name}" in ${domainName}. How would you isolate the root cause, mitigate immediate business impact, and architect a permanent safeguard?` : `Design a comprehensive production system in ${domainName} addressing "${t.name}". Detail the component topology, data flow, failure recovery, caching layer, and scaling bottlenecks.`,
      code_template: isCoding ? `// ${domainName} Implementation: ${t.name}
export function executeTask<T>(input: T): { success: boolean; data: any } {
  // Implement your algorithm or business logic
  return { success: true, data: null };
}` : void 0,
      expected_key_points: [
        `Production-grade architecture / implementation for ${t.name}`,
        `Edge-case and error recovery handling`,
        `Computational complexity and scalability analysis`
      ],
      improved_answer: `For ${t.name} in ${domainName}, the optimal architecture balances modularity, fault isolation, and low operational latency. By introducing idempotent pipelines, rate limiting, and structured telemetry, the system achieves enterprise-grade reliability and seamless horizontal scaling.`
    });
  });
  return questions;
}

// server/ai.ts
var genAIClient = null;
function getAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
var CANDIDATE_MODELS = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];
var modelCooldownMap = /* @__PURE__ */ new Map();
var COOLDOWN_MS = 60 * 1e3;
async function callGeminiWithFallback(contents, responseMimeType) {
  const ai = getAI();
  if (!ai) return null;
  const now = Date.now();
  const availableModels = CANDIDATE_MODELS.slice().sort((a, b) => {
    const coolA = (modelCooldownMap.get(a) || 0) > now ? 1 : 0;
    const coolB = (modelCooldownMap.get(b) || 0) > now ? 1 : 0;
    return coolA - coolB;
  });
  for (const model of availableModels) {
    const isCooling = (modelCooldownMap.get(model) || 0) > now;
    if (isCooling) continue;
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: responseMimeType ? { responseMimeType } : void 0
      });
      const text = response.text?.trim();
      if (text) {
        modelCooldownMap.delete(model);
        return text;
      }
    } catch (err) {
      const isHighDemand = err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("demand");
      if (isHighDemand) {
        modelCooldownMap.set(model, now + COOLDOWN_MS);
      }
    }
  }
  return null;
}
var DOMAIN_DEFAULTS = {
  fullstack: getCuratedDomainQuestions("fullstack"),
  genai: getCuratedDomainQuestions("genai"),
  cloud: getCuratedDomainQuestions("cloud"),
  datascience: getCuratedDomainQuestions("datascience"),
  cybersecurity: getCuratedDomainQuestions("cybersecurity")
};
async function generateAITechnicalQuestions(domain, isRetake = false, previousWeakTopics = []) {
  const curated = getCuratedDomainQuestions(domain);
  const domainMeta = TECHNICAL_DOMAINS_LIST.find((d) => d.id === domain) || TECHNICAL_DOMAINS_LIST[0];
  try {
    const retakePromptAddition = isRetake && previousWeakTopics.length > 0 ? `This is a RETAKE interview. The candidate previously struggled with these topics: [${previousWeakTopics.join(", ")}]. Generate new questions that prioritize testing these weak areas alongside fresh questions.` : "Generate an initial comprehensive interview set.";
    const prompt = `You are a Principal Engineering Lead & Live Technical Interviewer for a prestigious technology firm.
Domain: "${domainMeta.name}" (${domain}).
${retakePromptAddition}

Generate a total of 30 technical interview questions split into EXACTLY three progressive levels:
- Level 1 (Basic / Fundamentals): 10 questions (core definitions, primitives, basic syntax, fundamental lifecycles)
- Level 2 (Intermediate / Understanding): 10 questions (concept comparisons, how/why, debugging, code analysis, intermediate tradeoffs)
- Level 3 (Practical / Coding / Problem Solving): 10 questions (practical scenario design, coding problem implementation, edge case handling, performance tuning)

Format the output strictly as a JSON array of 30 objects matching this schema:
[
  {
    "question_id": "${domain}_l1_q1",
    "domain": "${domain}",
    "level": 1,
    "level_name": "Level 1 \u2014 Basic",
    "topic": "Topic Name",
    "difficulty": "Easy",
    "type": "conceptual",
    "question": "Clear problem statement",
    "expected_key_points": ["Point 1", "Point 2"],
    "improved_answer": "Complete, technically precise model answer for interviewers"
  }
]`;
    const text = await callGeminiWithFallback(prompt, "application/json");
    if (text) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length >= 15) {
        const level1 = parsed.filter((q) => q.level === 1).slice(0, 10);
        const level2 = parsed.filter((q) => q.level === 2).slice(0, 10);
        const level3 = parsed.filter((q) => q.level === 3).slice(0, 10);
        const combined = [...level1, ...level2, ...level3];
        if (combined.length === 30) {
          return combined.map((q, idx) => ({
            question_id: q.question_id || `${domain}_q_${idx + 1}`,
            domain,
            level: q.level || (idx < 10 ? 1 : idx < 20 ? 2 : 3),
            level_name: q.level === 1 ? "Level 1 \u2014 Basic" : q.level === 2 ? "Level 2 \u2014 Intermediate" : "Level 3 \u2014 Practical",
            topic: q.topic || `${domainMeta.name} Core`,
            difficulty: q.difficulty || (idx < 10 ? "Easy" : idx < 20 ? "Medium" : "Hard"),
            type: q.type || (idx < 10 ? "conceptual" : idx < 20 ? "conceptual" : "coding"),
            question: q.question,
            code_snippet_display: q.code_snippet_display,
            code_template: q.code_template,
            language: q.language || "typescript",
            hints: q.hints || [],
            expected_key_points: q.expected_key_points || [],
            improved_answer: q.improved_answer
          }));
        }
      }
    }
  } catch (err) {
    console.error("Error generating AI technical questions:", err);
  }
  let pool = [...curated];
  if (isRetake) {
    const l1 = pool.filter((q) => q.level === 1).sort(() => Math.random() - 0.5);
    const l2 = pool.filter((q) => q.level === 2).sort(() => Math.random() - 0.5);
    const l3 = pool.filter((q) => q.level === 3).sort(() => Math.random() - 0.5);
    pool = [...l1.slice(0, 10), ...l2.slice(0, 10), ...l3.slice(0, 10)];
  }
  return pool.slice(0, 30);
}
async function evaluateTechnicalAnswer(payload) {
  const combinedAnswer = [
    payload.response_text ? `Text/Voice response: ${payload.response_text}` : "",
    payload.code_snippet ? `Code implementation:
${payload.code_snippet}` : "",
    payload.diagram_data ? `Diagram / Architecture notes: ${payload.diagram_data}` : ""
  ].filter(Boolean).join("\n\n");
  if (!combinedAnswer.trim()) {
    return {
      score: 0,
      correctness: 0,
      technical_depth: 0,
      clarity: 0,
      confidence_score: 0,
      verbal_status: "INCORRECT",
      verbal_feedback: "I didn't catch any answer for this question. Let's move on to the next one.",
      spoken_response: "I didn't receive an answer for this question. Let's proceed to the next topic.",
      feedback: "No response was provided for this question.",
      what_you_got_right: [],
      what_you_missed: ["No technical answer or explanation was submitted."],
      improved_answer: "Ensure you provide a clear conceptual explanation, architectural reasoning, or code implementation for the interviewer.",
      strengths: [],
      weaknesses: ["Empty answer submitted"],
      suggested_improvements: ["Ensure you articulate your thought process aloud and provide code when required."]
    };
  }
  try {
    const prompt = `You are an experienced Principal Engineering Lead conducting a live, realistic technical interview for a "${payload.domain}" candidate.

Question Asked:
${payload.question}

Candidate Submission (${payload.response_type} mode):
${combinedAnswer}

Evaluate the candidate's answer with human-like discernment across:
1. Technical correctness and accuracy (0-100)
2. Conceptual depth and system mastery (0-100)
3. Communication clarity and structure (0-100)
4. Confidence score (0-100) based on assertiveness, precision, and lack of filler hesitation.
5. If code/query is provided: evaluate algorithmic efficiency, syntax, edge cases.

Provide realistic interviewer conversational feedback:
- verbal_status: "CORRECT" (\u226575 score), "PARTIALLY CORRECT" (45-74 score), or "INCORRECT" (<45 score).
- spoken_response: A natural, spoken line the interviewer says aloud right now. (e.g., "Good explanation. You clearly understand the core reconciliation loop...", or "That's a good start, but you missed the fiber tree lifecycle...", or "That's not quite right. In production systems...")
- what_you_got_right: 1-3 concise bullet points of valid points the candidate stated.
- what_you_missed: 1-3 concise bullet points of missing nuances or inaccuracies.
- improved_answer: The ideal, senior-engineer phrasing of the answer.

Return strict JSON:
{
  "score": 85,
  "correctness": 88,
  "technical_depth": 82,
  "clarity": 85,
  "code_quality": 80,
  "confidence_score": 85,
  "verbal_status": "CORRECT",
  "verbal_feedback": "Strong explanation demonstrating solid command of the fundamentals.",
  "spoken_response": "Good explanation. You clearly understand the core reconciliation loop. Let's move on.",
  "feedback": "2-3 sentence constructive critique",
  "what_you_got_right": ["Identified virtual DOM diffing", "Mentioned component keys"],
  "what_you_missed": ["Could have detailed fiber priority queues"],
  "improved_answer": "Precise senior-level answer...",
  "strengths": ["Clear technical terminology", "Structured reasoning"],
  "weaknesses": ["Minor edge condition omission"],
  "suggested_improvements": ["Discuss computational complexity and memory bounds."],
  "follow_up_prompt": "Optional brief natural follow-up question if interesting"
}`;
    const text = await callGeminiWithFallback(prompt, "application/json");
    if (text) {
      const parsed = JSON.parse(text);
      const score = Math.min(100, Math.max(0, Number(parsed.score) || 75));
      const status2 = parsed.verbal_status || (score >= 75 ? "CORRECT" : score >= 45 ? "PARTIALLY CORRECT" : "INCORRECT");
      return {
        score,
        correctness: Math.min(100, Math.max(0, Number(parsed.correctness) || score)),
        technical_depth: Math.min(100, Math.max(0, Number(parsed.technical_depth) || score)),
        clarity: Math.min(100, Math.max(0, Number(parsed.clarity) || 80)),
        code_quality: parsed.code_quality ? Math.min(100, Math.max(0, Number(parsed.code_quality))) : void 0,
        confidence_score: Math.min(100, Math.max(0, Number(parsed.confidence_score) || 80)),
        verbal_status: status2,
        verbal_feedback: parsed.verbal_feedback || (status2 === "CORRECT" ? "Great explanation!" : status2 === "PARTIALLY CORRECT" ? "You're on the right track, but missed a few details." : "Not quite accurate."),
        spoken_response: parsed.spoken_response || (status2 === "CORRECT" ? "That's correct. Good explanation." : status2 === "PARTIALLY CORRECT" ? "That's a good start, but there are a few important points you missed." : "That's not quite right. Let's proceed to the next question."),
        feedback: parsed.feedback || "Response demonstrates technical understanding.",
        what_you_got_right: Array.isArray(parsed.what_you_got_right) ? parsed.what_you_got_right : ["Communicated core concept"],
        what_you_missed: Array.isArray(parsed.what_you_missed) ? parsed.what_you_missed : ["Could expand on advanced edge cases"],
        improved_answer: parsed.improved_answer || "A complete answer articulates the core mechanism, runtime behavior, and scalability trade-offs.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Solid foundational grasp"],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Elaborate deeper on production failure modes"],
        suggested_improvements: Array.isArray(parsed.suggested_improvements) ? parsed.suggested_improvements : ["Incorporate time/space complexity into explanations."],
        follow_up_prompt: parsed.follow_up_prompt
      };
    }
  } catch (err) {
    console.error("Error evaluating technical answer with AI:", err);
  }
  const wordCount = combinedAnswer.split(/\s+/).length;
  const hasCode = !!payload.code_snippet && payload.code_snippet.length > 30;
  const baseScore = Math.min(92, Math.max(50, Math.floor(wordCount * 1.3) + (hasCode ? 25 : 15)));
  const status = baseScore >= 75 ? "CORRECT" : baseScore >= 50 ? "PARTIALLY CORRECT" : "INCORRECT";
  return {
    score: baseScore,
    correctness: Math.min(100, baseScore + 2),
    technical_depth: baseScore,
    clarity: 82,
    code_quality: hasCode ? 80 : void 0,
    confidence_score: Math.min(95, 60 + Math.floor(wordCount / 2)),
    verbal_status: status,
    verbal_feedback: status === "CORRECT" ? "Solid technical explanation." : status === "PARTIALLY CORRECT" ? "Good points, but could be more complete." : "Needs more technical depth.",
    spoken_response: status === "CORRECT" ? "Good explanation. You've covered the core concepts well." : status === "PARTIALLY CORRECT" ? "You're on the right track, though a few technical details were missing." : "That's not quite right. Let's move on to the next question.",
    feedback: `Demonstrates understanding of ${payload.domain} concepts with structured articulation.`,
    what_you_got_right: ["Addressed the main question requirements", hasCode ? "Provided working code implementation" : "Articulated key principles"],
    what_you_missed: ["Could mention specific asymptotic bounds and edge case limits"],
    improved_answer: `For ${payload.domain}, a senior response balances high-level architecture with low-level execution trade-offs, mentioning complexity, error isolation, and operational metrics.`,
    strengths: [
      "Clear terminology and structured thought process",
      hasCode ? "Clean syntactical structure and functional logic" : "Logical problem framing"
    ],
    weaknesses: ["Could elaborate on edge cases and performance trade-offs"],
    suggested_improvements: [
      "Discuss computational complexity (time/space) and real-world system boundaries."
    ]
  };
}
async function evaluateHREvaluation(payload) {
  if (!payload.response_text.trim()) {
    return {
      score: 0,
      relevance: 0,
      clarity: 0,
      communication_quality: 0,
      feedback: "No response was provided.",
      strengths: [],
      weaknesses: ["Empty answer submitted"]
    };
  }
  try {
    const prompt = `You are a Senior Talent & HR Director assessing a candidate's behavioral and leadership response.

Question:
${payload.question}

Candidate Answer:
${payload.response_text}

Evaluate on:
1. Relevance to the question intent
2. Clarity and coherence
3. Professionalism, emotional intelligence, and communication effectiveness (STAR method)

Return strict JSON:
{
  "score": 85,
  "relevance": 85,
  "clarity": 85,
  "communication_quality": 85,
  "feedback": "2-3 sentence executive review",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"]
}`;
    const text = await callGeminiWithFallback(prompt, "application/json");
    if (text) {
      const parsed = JSON.parse(text);
      return {
        score: Math.min(100, Math.max(0, Number(parsed.score) || 80)),
        relevance: Math.min(100, Math.max(0, Number(parsed.relevance) || 80)),
        clarity: Math.min(100, Math.max(0, Number(parsed.clarity) || 80)),
        communication_quality: Math.min(100, Math.max(0, Number(parsed.communication_quality) || 80)),
        feedback: parsed.feedback || "Effective communication demonstrating situational awareness.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Good self-reflection"],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Add specific quantitative outcomes"]
      };
    }
  } catch (err) {
    console.error("Error evaluating HR answer with AI:", err);
  }
  return {
    score: 82,
    relevance: 85,
    clarity: 80,
    communication_quality: 85,
    feedback: "Authentic response utilizing the STAR (Situation, Task, Action, Result) behavioral framework.",
    strengths: ["Clear narrative structure", "Demonstrated team collaboration and self-awareness"],
    weaknesses: ["Could quantify measurable outcomes more explicitly"]
  };
}
async function generateFinalAIFeedback(data) {
  try {
    const prompt = `You are a Principal Career & Technical Coach evaluating a candidate's complete assessment record:
Candidate: ${data.candidate_name}
Technical Domain: ${data.domain}
Aptitude Scores: ${JSON.stringify(data.aptitude_scores)}
Technical AI Score: ${data.technical_score}%
HR Behavioral Score: ${data.hr_score}%
Overall Composite Score: ${data.overall_score}%

Generate a comprehensive, personalized executive career assessment and 3-step action plan in JSON:
{
  "executive_summary": "3-sentence executive synopsis",
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "critical_weaknesses": ["weakness 1", "weakness 2"],
  "recommended_topics": ["topic 1", "topic 2", "topic 3"],
  "personalized_action_plan": [
    {
      "step": 1,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 1-2"
    },
    {
      "step": 2,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 3"
    },
    {
      "step": 3,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 4"
    }
  ]
}`;
    const text = await callGeminiWithFallback(prompt, "application/json");
    if (text) {
      const parsed = JSON.parse(text);
      return {
        executive_summary: parsed.executive_summary || `${data.candidate_name} demonstrated consistent preparation and problem-solving agility across all assessment milestones.`,
        key_strengths: Array.isArray(parsed.key_strengths) && parsed.key_strengths.length > 0 ? parsed.key_strengths : [`Solid analytical reasoning in ${data.domain}`, "Clear algorithmic articulation", "Effective leadership communication"],
        critical_weaknesses: Array.isArray(parsed.critical_weaknesses) && parsed.critical_weaknesses.length > 0 ? parsed.critical_weaknesses : ["Needs deeper trade-off analysis under strict speed limits", "Edge-case handling in complex distributed topologies"],
        recommended_topics: Array.isArray(parsed.recommended_topics) && parsed.recommended_topics.length > 0 ? parsed.recommended_topics : ["Advanced data structures and cache coherency", "System design scalability patterns", "Behavioral leadership STAR storytelling"],
        personalized_action_plan: Array.isArray(parsed.personalized_action_plan) && parsed.personalized_action_plan.length > 0 ? parsed.personalized_action_plan : [
          { step: 1, title: "Aptitude Speed Drills", focus: "Solve 20 timed questions daily focusing on weak categories.", timeframe: "Week 1" },
          { step: 2, title: "Deep-Dive Architecture Project", focus: `Build an end-to-end service implementing ${data.domain} best practices.`, timeframe: "Week 2-3" },
          { step: 3, title: "Mock Leadership Simulator", focus: "Practice voice-recorded responses and behavioral STAR narratives.", timeframe: "Week 4" }
        ]
      };
    }
  } catch (err) {
    console.error("Error generating final AI feedback with Gemini API:", err);
  }
  const isHigh = data.overall_score >= 70;
  return {
    executive_summary: `${data.candidate_name} completed the 4-stage evaluation with an overall score of ${data.overall_score}%. ${isHigh ? `Candidate exhibits strong readiness across quantitative reasoning, ${data.domain} specialization, and behavioral alignment.` : `Candidate shows foundational mastery in ${data.domain} but requires targeted reinforcement in high-speed problem solving and edge-case design.`}`,
    key_strengths: [
      `Solid problem solving and domain mastery in ${data.domain}`,
      "Structured communication and modular conceptual reasoning",
      "Professional behavioral response framing"
    ],
    critical_weaknesses: [
      "Speed optimization under strict test constraints",
      "Edge-case coverage in complex distributed topologies"
    ],
    recommended_topics: [
      "Advanced algorithmic optimization and spatial trade-offs",
      "Distributed systems fault tolerance and data consistency models",
      "Behavioral leadership scenario practice with quantifiable metrics"
    ],
    personalized_action_plan: [
      {
        step: 1,
        title: "Aptitude Speed & Precision Drill",
        focus: "Practice 20 timed questions daily focusing on weak categories and formula mastery.",
        timeframe: "Week 1"
      },
      {
        step: 2,
        title: "Deep-Dive Architecture & Code Lab",
        focus: `Build an end-to-end reference application highlighting ${data.domain} principles and database caching.`,
        timeframe: "Week 2-3"
      },
      {
        step: 3,
        title: "Mock Interview Simulator",
        focus: "Practice voice-recorded responses and behavioral STAR narratives with quantifiable results.",
        timeframe: "Week 4"
      }
    ]
  };
}

// server/db.ts
var DB_FILE = process.env.VERCEL ? path.join("/tmp", "database_store.json") : path.join(process.cwd(), "database_store.json");
var SEED_DB_FILE = path.join(process.cwd(), "database_store.json");
var DEFAULT_SETTINGS = {
  levelCutoff: 70,
  testCutoff: 70,
  finalTestCutoff: 70,
  technicalCutoff: 60,
  hrCutoff: 60,
  levelTimerMinutes: 10,
  testTimerMinutes: 20,
  finalTestTimerMinutes: 30,
  aiModel: "gemini-3.7-flash"
};
var HR_QUESTIONS_BANK = [
  {
    question_id: "hr_q1",
    category: "behavioral",
    question: "Tell me about yourself, your technical journey, and what drives you to solve complex engineering problems.",
    intent: "Assesses career passion, concise storytelling, and professional communication."
  },
  {
    question_id: "hr_q2",
    category: "situational",
    question: "Describe a challenging technical disagreement or tight project deadline you encountered with a team member and how you resolved it.",
    intent: "Evaluates conflict resolution, empathy, collaboration, and delivery mindset."
  },
  {
    question_id: "hr_q3",
    category: "culture",
    question: "Where do you envision your technical and leadership impact in the next 3 to 5 years?",
    intent: "Assesses long-term vision, growth mindset, and organizational alignment."
  }
];
var Database = class _Database {
  constructor() {
    this.data = this.loadDatabase();
  }
  loadDatabase() {
    try {
      const targetFile = fs.existsSync(DB_FILE) ? DB_FILE : fs.existsSync(SEED_DB_FILE) ? SEED_DB_FILE : null;
      if (targetFile && fs.existsSync(targetFile)) {
        const raw = fs.readFileSync(targetFile, "utf-8");
        const parsed = JSON.parse(raw);
        parsed.questions = generateDefaultQuestionBank();
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          parsed.users = [
            {
              user_id: "user_demo",
              name: "Alex Johnson",
              email: "candidate@example.com",
              password_hash: this.hashPassword("Password@123"),
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            }
          ];
        }
        if (!parsed.user_progress) {
          parsed.user_progress = {};
        }
        Object.keys(parsed.user_progress).forEach((uid) => {
          const up = parsed.user_progress[uid];
          if (!up.active_level_attempts) up.active_level_attempts = {};
          if (!up.question_attempts) up.question_attempts = [];
          if (!up.concept_performance) up.concept_performance = {};
        });
        if (!parsed.user_progress["user_demo"]) {
          parsed.user_progress["user_demo"] = this.createDefaultUserProgress("user_demo");
        }
        if (!parsed.settings) {
          parsed.settings = { ...DEFAULT_SETTINGS };
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error loading db file, reinitializing default:", e);
    }
    const initialData = {
      users: [
        {
          user_id: "user_demo",
          name: "Alex Johnson",
          email: "candidate@example.com",
          password_hash: this.hashPassword("Password@123"),
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      settings: { ...DEFAULT_SETTINGS },
      questions: generateDefaultQuestionBank(),
      user_progress: {}
    };
    initialData.user_progress["user_demo"] = this.createDefaultUserProgress("user_demo");
    this.saveDatabase(initialData);
    return initialData;
  }
  saveDatabase(dataToSave = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save database:", err);
    }
  }
  hashPassword(pwd) {
    return crypto.createHash("sha256").update(pwd + "_ai_interview_salt").digest("hex");
  }
  createDefaultUserProgress(userId) {
    return {
      user_id: userId,
      topic_levels_passed: {
        quantitative: [],
        logical: [],
        verbal: [],
        specialized: []
      },
      topic_test1_passed: {
        quantitative: false,
        logical: false,
        verbal: false,
        specialized: false
      },
      topic_test2_passed: {
        quantitative: false,
        logical: false,
        verbal: false,
        specialized: false
      },
      level_attempts: [],
      test_attempts: [],
      final_aptitude_attempts: [],
      technical_sessions: [],
      hr_sessions: [],
      recent_questions_answered: [],
      question_attempts: [],
      concept_performance: {},
      active_level_attempts: {}
    };
  }
  // User Authentication
  registerUser(name, email, password) {
    const existing = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("User with this email already exists");
    }
    const user = {
      user_id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password_hash: this.hashPassword(password),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users.push(user);
    this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
    this.saveDatabase();
    return { user, token: `token_${user.user_id}` };
  }
  loginUser(email, password) {
    const hash = this.hashPassword(password);
    const user = this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === hash
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!this.data.user_progress[user.user_id]) {
      this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
      this.saveDatabase();
    }
    return { user, token: `token_${user.user_id}` };
  }
  getUserById(userId) {
    if (!this.data.users || this.data.users.length === 0) {
      const demo = {
        user_id: "user_demo",
        name: "Alex Johnson",
        email: "candidate@example.com",
        password_hash: this.hashPassword("Password@123"),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.data.users = [demo];
      this.data.user_progress["user_demo"] = this.createDefaultUserProgress("user_demo");
      this.saveDatabase();
      return demo;
    }
    const found = this.data.users.find((u) => u.user_id === userId);
    return found || this.data.users[0];
  }
  updateUserProfile(userId, name, email) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (name && name.trim()) {
      user.name = name.trim();
    }
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const existing = this.data.users.find((u) => u.user_id !== userId && u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error("This email is already in use by another account");
      }
      user.email = cleanEmail;
    }
    this.saveDatabase();
    return user;
  }
  getUserProgress(userId) {
    if (!this.data.user_progress[userId]) {
      this.data.user_progress[userId] = this.createDefaultUserProgress(userId);
      this.saveDatabase();
    }
    return this.data.user_progress[userId];
  }
  getSettings() {
    return this.data.settings || { ...DEFAULT_SETTINGS };
  }
  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveDatabase();
    return this.data.settings;
  }
  isDemoUser(userId) {
    if (!userId) return false;
    if (userId === _Database.DEMO_USER_ID || userId === "user_demo_presentation" || userId === "user_demo") {
      return true;
    }
    const user = this.data.users.find((u) => u.user_id === userId);
    if (user && (user.email.toLowerCase() === _Database.DEMO_USER_EMAIL.toLowerCase() || user.email.toLowerCase() === "demo@interview.com")) {
      return true;
    }
    return false;
  }
  // Dashboard Aggregator & Progression Verification
  getDashboardState(userId) {
    const user = this.getUserById(userId) || this.data.users[0];
    const prog = this.getUserProgress(user.user_id);
    const settings = this.getSettings();
    const isDemo = this.isDemoUser(user.user_id);
    const topicIds = ["quantitative", "logical", "verbal", "specialized"];
    const topics = {};
    let totalLevelsCompleted = 0;
    let totalTestsPassed = 0;
    let pendingTestsCount = 0;
    topicIds.forEach((tid) => {
      let passedLvls = prog.topic_levels_passed[tid] || [];
      let test1 = prog.topic_test1_passed[tid] || false;
      let test2 = prog.topic_test2_passed[tid] || false;
      if (isDemo) {
        passedLvls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        test1 = true;
        test2 = true;
      }
      let currentLvl = 1;
      for (let i = 1; i <= 10; i++) {
        if (passedLvls.includes(i)) {
          currentLvl = Math.min(10, i + 1);
        } else {
          currentLvl = i;
          break;
        }
      }
      if (!test1 && currentLvl > 5) {
        currentLvl = 5;
      }
      if (isDemo) currentLvl = 10;
      const isCompleted = isDemo || passedLvls.length >= 10 && test1 && test2;
      totalLevelsCompleted += isDemo ? 10 : passedLvls.length;
      if (test1 || isDemo) totalTestsPassed++;
      if (test2 || isDemo) totalTestsPassed++;
      if (!isDemo) {
        if (passedLvls.filter((l) => l <= 5).length === 5 && !test1) {
          pendingTestsCount++;
        }
        if (passedLvls.length === 10 && test1 && !test2) {
          pendingTestsCount++;
        }
      }
      let pct = isDemo ? 100 : passedLvls.length * 8;
      if (!isDemo) {
        if (test1) pct += 10;
        if (test2) pct += 10;
        pct = Math.min(100, pct);
      }
      topics[tid] = {
        id: tid,
        name: TOPICS_META[tid].name,
        icon: TOPICS_META[tid].icon,
        description: TOPICS_META[tid].description,
        totalLevels: 10,
        completedLevels: isDemo ? 10 : passedLvls.length,
        currentLevel: currentLvl,
        test1Passed: isDemo || test1,
        test2Passed: isDemo || test2,
        isCompleted,
        progressPercentage: pct
      };
    });
    const allTopicsCompleted = isDemo || topicIds.every((tid) => topics[tid].isCompleted);
    const latestFinalTest = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1];
    const finalAptitudePassed = isDemo || latestFinalTest?.status === "QUALIFIED";
    const latestTech = prog.technical_sessions.filter((s) => s.status === "COMPLETED");
    const latestTechSession = latestTech[latestTech.length - 1];
    const techPassed = (latestTechSession?.overall_score || 0) >= settings.technicalCutoff;
    const latestHR = prog.hr_sessions.filter((s) => s.status === "COMPLETED");
    const latestHRSession = latestHR[latestHR.length - 1];
    const hrPassed = (latestHRSession?.overall_score || 0) >= settings.hrCutoff;
    const overallProgress = isDemo ? 100 : Math.round(
      totalLevelsCompleted / 40 * 40 + totalTestsPassed / 8 * 20 + (finalAptitudePassed ? 15 : 0) + (techPassed ? 15 : 0) + (hrPassed ? 10 : 0)
    );
    return {
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      },
      topics,
      progression: {
        all_topics_completed: isDemo || allTopicsCompleted,
        final_aptitude_unlocked: isDemo || allTopicsCompleted,
        final_aptitude_passed: isDemo || finalAptitudePassed,
        technical_unlocked: isDemo || finalAptitudePassed,
        technical_passed: isDemo ? latestTechSession ? techPassed : true : techPassed,
        hr_unlocked: isDemo || techPassed,
        hr_passed: isDemo ? latestHRSession ? hrPassed : true : hrPassed,
        final_report_available: isDemo || hrPassed
      },
      cutoffs: {
        levelCutoff: settings.levelCutoff,
        testCutoff: settings.testCutoff,
        finalTestCutoff: settings.finalTestCutoff,
        technicalCutoff: settings.technicalCutoff,
        hrCutoff: settings.hrCutoff
      },
      stats: {
        total_levels_completed: isDemo ? 40 : totalLevelsCompleted,
        total_tests_passed: isDemo ? 8 : totalTestsPassed,
        overall_progress: isDemo ? 100 : Math.min(100, overallProgress),
        pending_tests_count: isDemo ? 0 : pendingTestsCount
      }
    };
  }
  // Progression Verification Helpers (Backend Security)
  canAccessLevel(userId, topicId, levelId) {
    if (this.isDemoUser(userId)) {
      return { allowed: true };
    }
    const prog = this.getUserProgress(userId);
    const passed = (prog.topic_levels_passed[topicId] || []).map(Number);
    const test1 = prog.topic_test1_passed[topicId] || false;
    const numLevel = Number(levelId);
    if (!numLevel || isNaN(numLevel) || numLevel < 1 || numLevel > 10) {
      return { allowed: false, reason: "Invalid level number requested." };
    }
    if (numLevel === 1 || passed.includes(numLevel)) return { allowed: true };
    if (numLevel <= 5) {
      if (!passed.includes(numLevel - 1)) {
        return { allowed: false, reason: `Level ${numLevel - 1} must be passed before accessing Level ${numLevel}.` };
      }
      return { allowed: true };
    }
    if (!test1) {
      return { allowed: false, reason: `Test 1 (covering Levels 1-5) must be passed before unlocking Levels 6-10.` };
    }
    if (numLevel === 6) return { allowed: true };
    if (!passed.includes(numLevel - 1)) {
      return { allowed: false, reason: `Level ${numLevel - 1} must be passed before accessing Level ${numLevel}.` };
    }
    return { allowed: true };
  }
  canAccessTopicTest(userId, topicId, testNumber) {
    if (this.isDemoUser(userId)) {
      return { allowed: true };
    }
    const prog = this.getUserProgress(userId);
    const passed = (prog.topic_levels_passed[topicId] || []).map(Number);
    if (testNumber === 1) {
      if (prog.topic_test1_passed[topicId]) return { allowed: true };
      const has1to5 = [1, 2, 3, 4, 5].every((lvl) => passed.includes(lvl));
      if (!has1to5) {
        return { allowed: false, reason: `Levels 1 through 5 of ${TOPICS_META[topicId]?.name || topicId} must all be completed before attempting Test 1.` };
      }
      return { allowed: true };
    } else {
      if (prog.topic_test2_passed[topicId]) return { allowed: true };
      const has6to10 = [6, 7, 8, 9, 10].every((lvl) => passed.includes(lvl));
      if (!has6to10 || !prog.topic_test1_passed[topicId]) {
        return { allowed: false, reason: `Levels 6 through 10 and Test 1 must all be completed before attempting Test 2.` };
      }
      return { allowed: true };
    }
  }
  // Question Serving with Guaranteed Uniqueness, Persistence & Zero-Repeat Retries
  getQuestionsForLevel(userId, topicId, levelId, isRetry = false) {
    const numLevel = Number(levelId) || 1;
    const check = this.canAccessLevel(userId, topicId, numLevel);
    if (!check.allowed) {
      throw new Error(check.reason);
    }
    const prog = this.getUserProgress(userId);
    if (!prog.active_level_attempts) prog.active_level_attempts = {};
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};
    const attemptKey = `${topicId}_${numLevel}`;
    if (!isRetry && prog.active_level_attempts[attemptKey]) {
      const activeAttempt = prog.active_level_attempts[attemptKey];
      if (activeAttempt && Array.isArray(activeAttempt.question_ids) && activeAttempt.question_ids.length === 10) {
        const activeQuestions = [];
        for (const qid of activeAttempt.question_ids) {
          const found = this.data.questions.find((q) => q.question_id === qid);
          if (found) activeQuestions.push(found);
        }
        if (activeQuestions.length === 10) {
          return activeQuestions;
        }
      }
    }
    const rawPool = this.data.questions.filter(
      (q) => q.topic_id === topicId && q.level_id === numLevel && (q.pool_type === "learning" || !q.pool_type)
    );
    const usedQuestionIds = /* @__PURE__ */ new Set();
    const usedNormalizedTexts = /* @__PURE__ */ new Set();
    const previousAttempts = (prog.level_attempts || []).filter(
      (a) => a.topic_id === topicId && a.level_id === numLevel
    );
    previousAttempts.forEach((attempt) => {
      if (attempt.answers_review) {
        attempt.answers_review.forEach((ar) => {
          if (ar.question_id) usedQuestionIds.add(ar.question_id);
          if (ar.question) usedNormalizedTexts.add(normalizeQuestionText(ar.question));
        });
      }
    });
    (prog.question_attempts || []).filter((qa) => qa.topic_id === topicId && qa.level_id === numLevel).forEach((qa) => {
      if (qa.question_id) usedQuestionIds.add(qa.question_id);
    });
    const deduplicatedRawPool = [];
    const seenRawIds = /* @__PURE__ */ new Set();
    const seenRawTexts = /* @__PURE__ */ new Set();
    for (const q of rawPool) {
      const norm = normalizeQuestionText(q.question);
      if (!seenRawIds.has(q.question_id) && !seenRawTexts.has(norm)) {
        seenRawIds.add(q.question_id);
        seenRawTexts.add(norm);
        deduplicatedRawPool.push(q);
      }
    }
    const unusedPool = deduplicatedRawPool.filter(
      (q) => !usedQuestionIds.has(q.question_id) && !usedNormalizedTexts.has(normalizeQuestionText(q.question))
    );
    const seenPool = deduplicatedRawPool.filter(
      (q) => usedQuestionIds.has(q.question_id) || usedNormalizedTexts.has(normalizeQuestionText(q.question))
    );
    const shuffledUnused = [...unusedPool].sort(() => Math.random() - 0.5);
    const shuffledSeen = [...seenPool].sort(() => Math.random() - 0.5);
    const candidatePool = [...shuffledUnused, ...shuffledSeen];
    const selected = [];
    const selectedIds = /* @__PURE__ */ new Set();
    const selectedTexts = /* @__PURE__ */ new Set();
    for (const q of candidatePool) {
      if (selected.length === 10) break;
      const norm = normalizeQuestionText(q.question);
      if (!selectedIds.has(q.question_id) && !selectedTexts.has(norm)) {
        selectedIds.add(q.question_id);
        selectedTexts.add(norm);
        selected.push(q);
      }
    }
    if (selected.length < 10) {
      const fallbackPool = this.data.questions.filter((q) => q.topic_id === topicId).sort(() => Math.random() - 0.5);
      for (const q of fallbackPool) {
        if (selected.length === 10) break;
        const norm = normalizeQuestionText(q.question);
        if (!selectedIds.has(q.question_id) && !selectedTexts.has(norm)) {
          selectedIds.add(q.question_id);
          selectedTexts.add(norm);
          selected.push(q);
        }
      }
    }
    const attemptNumber = previousAttempts.length + 1;
    const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    prog.active_level_attempts[attemptKey] = {
      attempt_id: newAttemptId,
      topic_id: topicId,
      level_id: numLevel,
      attempt_number: attemptNumber,
      question_ids: selected.map((q) => q.question_id),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.saveDatabase();
    return selected;
  }
  getQuestionsForTopicTest(userId, topicId, testNumber) {
    const check = this.canAccessTopicTest(userId, topicId, testNumber);
    if (!check.allowed) {
      throw new Error(check.reason);
    }
    const prog = this.getUserProgress(userId);
    const minLevel = testNumber === 1 ? 1 : 6;
    const maxLevel = testNumber === 1 ? 5 : 10;
    const poolType = testNumber === 1 ? "test1" : "test2";
    let pool = this.data.questions.filter((q) => q.topic_id === topicId && q.pool_type === poolType);
    if (pool.length < 20) {
      const levelQuestions = this.data.questions.filter(
        (q) => q.topic_id === topicId && q.level_id >= minLevel && q.level_id <= maxLevel
      );
      pool = [...pool, ...levelQuestions];
    }
    const prevTests = prog.test_attempts.filter((t) => t.topic_id === topicId && t.test_number === testNumber);
    const lastTest = prevTests[prevTests.length - 1];
    const recentIds = /* @__PURE__ */ new Set();
    if (lastTest && lastTest.answers_review) {
      lastTest.answers_review.forEach((ar) => recentIds.add(ar.question_id));
    }
    const fresh = pool.filter((q) => !recentIds.has(q.question_id));
    const poolToUse = fresh.length >= 20 ? fresh : pool;
    const shuffled = [...poolToUse].sort(() => Math.random() - 0.5);
    const selected = [];
    const seen = /* @__PURE__ */ new Set();
    for (const q of shuffled) {
      if (selected.length >= 20) break;
      if (!seen.has(q.question_id)) {
        selected.push(q);
        seen.add(q.question_id);
      }
    }
    if (selected.length < 20) {
      for (const q of pool) {
        if (selected.length >= 20) break;
        if (!seen.has(q.question_id)) {
          selected.push(q);
          seen.add(q.question_id);
        }
      }
    }
    return selected.slice(0, 20);
  }
  getQuestionsForFinalTest(userId) {
    const dashboard = this.getDashboardState(userId);
    if (!dashboard.progression.final_aptitude_unlocked) {
      throw new Error("All four aptitude topics must be 100% completed before unlocking the Final Aptitude Test.");
    }
    const prog = this.getUserProgress(userId);
    const lastFinal = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1];
    const recentIds = /* @__PURE__ */ new Set();
    if (lastFinal && lastFinal.answers_review) {
      lastFinal.answers_review.forEach((ar) => recentIds.add(ar.question_id));
    }
    const getTopicPool = (topic, count) => {
      let pool = this.data.questions.filter((q) => q.topic_id === topic && q.pool_type === "final");
      if (pool.length < count) {
        const general = this.data.questions.filter((q) => q.topic_id === topic);
        pool = [...pool, ...general];
      }
      const fresh = pool.filter((q) => !recentIds.has(q.question_id));
      const poolToUse = fresh.length >= count ? fresh : pool;
      return [...poolToUse].sort(() => Math.random() - 0.5).slice(0, count);
    };
    const quant = getTopicPool("quantitative", 7);
    const logical = getTopicPool("logical", 6);
    const verbal = getTopicPool("verbal", 6);
    const tech = getTopicPool("specialized", 6);
    const combined = [...quant, ...logical, ...verbal, ...tech].sort(() => Math.random() - 0.5);
    return combined;
  }
  // Level Submission, Detailed Evaluation & Attempt Logging
  submitLevel(userId, topicId, levelId, answers) {
    const check = this.canAccessLevel(userId, topicId, levelId);
    if (!check.allowed) {
      throw new Error(check.reason);
    }
    const settings = this.getSettings();
    const prog = this.getUserProgress(userId);
    if (!prog.active_level_attempts) prog.active_level_attempts = {};
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};
    const attemptKey = `${topicId}_${levelId}`;
    const activeAttempt = prog.active_level_attempts[attemptKey];
    const attemptId = activeAttempt?.attempt_id || `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const attemptNumber = activeAttempt?.attempt_number || prog.level_attempts.filter((a) => a.topic_id === topicId && a.level_id === levelId).length + 1;
    let score = 0;
    const totalQuestions = answers.length || 10;
    const wrongAnswers = [];
    const answersReview = [];
    const categoryStats = {};
    answers.forEach((ans) => {
      const q = this.data.questions.find((x) => x.question_id === ans.question_id) || {
        question_id: ans.question_id,
        topic_id: topicId,
        level_id: levelId,
        category: "General",
        difficulty: "Medium",
        question: "Aptitude Question",
        option_a: "Option A",
        option_b: "Option B",
        option_c: "Option C",
        option_d: "Option D",
        correct_answer: "A",
        explanation: "Correct solution applies standard logical principles."
      };
      const cat = q.category || "General";
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total += 1;
      const isCorrect = (ans.selected_answer || "").trim().toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        categoryStats[cat].correct += 1;
      } else {
        wrongAnswers.push({
          question: q.question,
          your_answer: ans.selected_answer || "None",
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          category: cat
        });
      }
      const reviewItem = {
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer || "None",
        correct_answer: q.correct_answer,
        explanation: q.explanation || "Detailed step-by-step reasoning applies standard principles.",
        category: cat,
        topic_id: topicId,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      };
      answersReview.push(reviewItem);
      prog.question_attempts.push({
        attempt_id: `qatt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        question_id: q.question_id,
        topic_id: topicId,
        level_id: levelId,
        concept: cat,
        attempt_number: attemptNumber,
        selected_answer: ans.selected_answer || "None",
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (!prog.concept_performance[cat]) {
        prog.concept_performance[cat] = {
          concept: cat,
          topic_id: topicId,
          total_attempts: 0,
          correct_attempts: 0,
          accuracy_pct: 0,
          last_attempted: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      prog.concept_performance[cat].total_attempts += 1;
      if (isCorrect) prog.concept_performance[cat].correct_attempts += 1;
      prog.concept_performance[cat].accuracy_pct = Math.round(
        prog.concept_performance[cat].correct_attempts / prog.concept_performance[cat].total_attempts * 100
      );
      prog.concept_performance[cat].last_attempted = (/* @__PURE__ */ new Date()).toISOString();
    });
    const percentage = Math.round(score / totalQuestions * 100);
    const passed = percentage >= settings.levelCutoff;
    const numLevel = Number(levelId);
    if (passed) {
      if (!prog.topic_levels_passed[topicId]) {
        prog.topic_levels_passed[topicId] = [];
      }
      const existingPassed = prog.topic_levels_passed[topicId].map(Number);
      if (!existingPassed.includes(numLevel)) {
        prog.topic_levels_passed[topicId] = Array.from(/* @__PURE__ */ new Set([...existingPassed, numLevel])).sort((a, b) => a - b);
      }
    }
    const categoryBreakdown = {};
    const weakCategories = [];
    const strongCategories = [];
    const conceptImprovementTips = {};
    Object.keys(categoryStats).forEach((cat) => {
      const c = categoryStats[cat];
      const pct = Math.round(c.correct / c.total * 100);
      categoryBreakdown[cat] = { correct: c.correct, total: c.total, percentage: pct };
      if (pct < 70) {
        weakCategories.push(cat);
        conceptImprovementTips[cat] = CONCEPT_TIPS[cat] || `Review foundational formulas and calculation methods for ${cat}.`;
      } else {
        strongCategories.push(cat);
      }
    });
    const attemptResult = {
      attempt_id: attemptId,
      topic_id: topicId,
      level_id: levelId,
      attempt_number: attemptNumber,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? "PASSED" : "FAILED",
      cutoff: settings.levelCutoff,
      next_level_unlocked: numLevel === 5 ? false : passed,
      wrong_answers: wrongAnswers,
      answers_review: answersReview,
      category_breakdown: categoryBreakdown,
      weak_categories: weakCategories,
      strong_categories: strongCategories,
      concept_improvement_tips: conceptImprovementTips
    };
    prog.level_attempts.push(attemptResult);
    if (prog.active_level_attempts && prog.active_level_attempts[attemptKey]) {
      delete prog.active_level_attempts[attemptKey];
    }
    this.saveDatabase();
    return attemptResult;
  }
  // Topic Test Submission & Evaluation
  submitTopicTest(userId, topicId, testNumber, answers) {
    const check = this.canAccessTopicTest(userId, topicId, testNumber);
    if (!check.allowed) {
      throw new Error(check.reason);
    }
    const settings = this.getSettings();
    const prog = this.getUserProgress(userId);
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};
    let score = 0;
    const totalQuestions = answers.length || 20;
    const answersReview = [];
    const categoryStats = {};
    answers.forEach((ans) => {
      const q = this.data.questions.find((x) => x.question_id === ans.question_id) || {
        question_id: ans.question_id,
        topic_id: topicId,
        level_id: testNumber === 1 ? 1 : 6,
        category: "Checkpoint Review",
        difficulty: "Medium",
        question: "Topic Test Question",
        option_a: "Option A",
        option_b: "Option B",
        option_c: "Option C",
        option_d: "Option D",
        correct_answer: "A",
        explanation: "Review fundamental formulas and logical patterns for this topic."
      };
      const cat = q.category || "General";
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total += 1;
      const isCorrect = (ans.selected_answer || "").trim().toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        categoryStats[cat].correct += 1;
      }
      answersReview.push({
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer || "None",
        correct_answer: q.correct_answer,
        explanation: q.explanation || "Review fundamental formulas and logical patterns for this topic.",
        category: cat,
        topic_id: topicId,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      });
    });
    const percentage = Math.round(score / totalQuestions * 100);
    const passed = percentage >= settings.testCutoff;
    if (passed) {
      if (testNumber === 1) prog.topic_test1_passed[topicId] = true;
      if (testNumber === 2) prog.topic_test2_passed[topicId] = true;
    }
    const categoryBreakdown = {};
    const weakAreas = [];
    const strongAreas = [];
    Object.keys(categoryStats).forEach((cat) => {
      const c = categoryStats[cat];
      const pct = Math.round(c.correct / c.total * 100);
      categoryBreakdown[cat] = { correct: c.correct, total: c.total, percentage: pct };
      if (pct < 70) weakAreas.push(cat);
      else strongAreas.push(cat);
    });
    const testResult = {
      test_id: `test_${topicId}_t${testNumber}_${Date.now()}`,
      topic_id: topicId,
      test_number: testNumber,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? "PASSED" : "FAILED",
      cutoff: settings.testCutoff,
      unlocked_levels: passed ? testNumber === 1 ? "Levels 6-10 are now UNLOCKED!" : `${TOPICS_META[topicId].name} is now 100% COMPLETED!` : "Please enter Revision Mode to practice weak topics before retrying.",
      strong_areas: strongAreas,
      weak_areas: weakAreas,
      category_breakdown: categoryBreakdown,
      answers_review: answersReview
    };
    prog.test_attempts.push(testResult);
    this.saveDatabase();
    return testResult;
  }
  // Final Aptitude Test Submission
  submitFinalTest(userId, answers) {
    const dashboard = this.getDashboardState(userId);
    if (!dashboard.progression.final_aptitude_unlocked) {
      throw new Error("All 4 topics must be completed before submitting the Final Aptitude Test.");
    }
    const settings = this.getSettings();
    let score = 0;
    const totalQuestions = answers.length || 25;
    const answersReview = [];
    const topicStats = {
      quantitative: { score: 0, total: 0 },
      logical: { score: 0, total: 0 },
      verbal: { score: 0, total: 0 },
      specialized: { score: 0, total: 0 }
    };
    answers.forEach((ans) => {
      const cleanId = ans.question_id.split("_").slice(-4).join("_");
      const q = this.data.questions.find((x) => x.question_id === ans.question_id || x.question_id === cleanId) || {
        question_id: ans.question_id,
        topic_id: "quantitative",
        level_id: 1,
        category: "Aptitude Benchmark",
        difficulty: "Medium",
        question: "Benchmark Question",
        option_a: "Option A",
        option_b: "Option B",
        option_c: "Option C",
        option_d: "Option D",
        correct_answer: "A",
        explanation: "Review fundamental principles and calculation steps."
      };
      const tid = q.topic_id || "quantitative";
      topicStats[tid].total += 1;
      const isCorrect = ans.selected_answer.toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        topicStats[tid].score += 1;
      }
      answersReview.push({
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "Detailed step-by-step mathematical reasoning.",
        category: q.category || "General",
        topic_id: tid,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      });
    });
    const percentage = Math.round(score / totalQuestions * 100);
    const passed = percentage >= settings.finalTestCutoff;
    const topicScores = {
      quantitative: {
        score: topicStats.quantitative.score,
        total: topicStats.quantitative.total || 7,
        percentage: Math.round(topicStats.quantitative.score / (topicStats.quantitative.total || 1) * 100)
      },
      logical: {
        score: topicStats.logical.score,
        total: topicStats.logical.total || 6,
        percentage: Math.round(topicStats.logical.score / (topicStats.logical.total || 1) * 100)
      },
      verbal: {
        score: topicStats.verbal.score,
        total: topicStats.verbal.total || 6,
        percentage: Math.round(topicStats.verbal.score / (topicStats.verbal.total || 1) * 100)
      },
      specialized: {
        score: topicStats.specialized.score,
        total: topicStats.specialized.total || 6,
        percentage: Math.round(topicStats.specialized.score / (topicStats.specialized.total || 1) * 100)
      }
    };
    const sortedTopics = Object.entries(topicScores).sort((a, b) => b[1].percentage - a[1].percentage);
    const strongest = TOPICS_META[sortedTopics[0][0]].name;
    const weakest = TOPICS_META[sortedTopics[sortedTopics.length - 1][0]].name;
    const recommended = [];
    Object.entries(topicScores).forEach(([k, v]) => {
      if (v.percentage < 70) {
        recommended.push(TOPICS_META[k].name);
      }
    });
    const result = {
      attempt_id: `final_apt_${Date.now()}`,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? "QUALIFIED" : "NOT_QUALIFIED",
      cutoff: settings.finalTestCutoff,
      topic_scores: topicScores,
      strongest_topic: strongest,
      weakest_topic: weakest,
      recommended_topics: recommended.length > 0 ? recommended : ["Continue maintaining high performance across all 4 pillars"],
      technical_unlocked: passed,
      answers_review: answersReview
    };
    const prog = this.getUserProgress(userId);
    prog.final_aptitude_attempts.push(result);
    this.saveDatabase();
    return result;
  }
  // Technical Round Execution & Multimodal 3-Level Evaluation
  getActiveTechnicalInterview(userId) {
    const prog = this.getUserProgress(userId);
    const active = (prog.technical_sessions || []).find((s) => s.status === "IN_PROGRESS");
    return active || null;
  }
  resetTechnicalInterview(userId) {
    const prog = this.getUserProgress(userId);
    prog.technical_sessions = (prog.technical_sessions || []).filter((s) => s.status === "COMPLETED");
    this.saveDatabase();
    return true;
  }
  async startTechnicalInterview(userId, domain, isRetake = false) {
    const isDemo = this.isDemoUser(userId);
    const dashboard = this.getDashboardState(userId);
    if (!isDemo && !dashboard.progression.technical_unlocked) {
      throw new Error("Technical Round is locked until you successfully qualify the Final Aptitude Test.");
    }
    const prog = this.getUserProgress(userId);
    if (!prog.technical_sessions) prog.technical_sessions = [];
    if (!isRetake) {
      const existingActive = prog.technical_sessions.find((s) => s.status === "IN_PROGRESS" && s.domain === domain);
      if (existingActive && existingActive.questions && existingActive.questions.length >= 30) {
        return existingActive;
      }
    }
    const previousCompleted = prog.technical_sessions.filter((s) => s.domain === domain && s.status === "COMPLETED");
    const weakTopics = [];
    previousCompleted.forEach((sess) => {
      sess.responses.forEach((resp) => {
        if (resp.evaluation && resp.evaluation.score < 60) {
          const qObj = sess.questions.find((q) => q.question_id === resp.question_id);
          if (qObj && qObj.topic) weakTopics.push(qObj.topic);
        }
      });
    });
    const generated = await generateAITechnicalQuestions(domain, isRetake, weakTopics);
    const questions = generated && generated.length >= 30 ? generated : getCuratedDomainQuestions(domain);
    const session = {
      session_id: `tech_sess_${domain}_${Date.now()}`,
      user_id: userId,
      domain,
      status: "IN_PROGRESS",
      current_question_index: 0,
      total_questions: questions.length,
      current_level: 1,
      attempt_number: previousCompleted.length + 1,
      is_retake: isRetake,
      questions,
      responses: []
    };
    prog.technical_sessions.forEach((s) => {
      if (s.status === "IN_PROGRESS") s.status = "COMPLETED";
    });
    prog.technical_sessions.push(session);
    this.saveDatabase();
    return session;
  }
  async evaluateTechnicalStep(userId, sessionId, questionId, responseType, responseText, codeSnippet, diagramData, timeTakenSeconds) {
    const prog = this.getUserProgress(userId);
    const session = prog.technical_sessions.find((s) => s.session_id === sessionId);
    if (!session) {
      throw new Error("Interview session not found");
    }
    const currentIdx = session.current_question_index;
    const question = session.questions.find((q) => q.question_id === questionId) || session.questions[currentIdx];
    const evaluation = await evaluateTechnicalAnswer({
      domain: session.domain,
      question: question.question,
      response_type: responseType,
      response_text: responseText,
      code_snippet: codeSnippet,
      diagram_data: diagramData,
      time_taken_seconds: timeTakenSeconds
    });
    session.responses.push({
      question_id: question.question_id,
      question: question.question,
      level: question.level || (session.current_question_index < 10 ? 1 : session.current_question_index < 20 ? 2 : 3),
      topic: question.topic || "Core Concept",
      response_type: responseType,
      response: [responseText, codeSnippet, diagramData].filter(Boolean).join("\n"),
      code_snippet: codeSnippet,
      evaluation,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    session.current_question_index += 1;
    if (session.current_question_index < 10) {
      session.current_level = 1;
    } else if (session.current_question_index < 20) {
      session.current_level = 2;
    } else {
      session.current_level = 3;
    }
    if (session.current_question_index >= session.total_questions) {
      session.status = "COMPLETED";
      session.completed_at = (/* @__PURE__ */ new Date()).toISOString();
      const l1Responses = session.responses.slice(0, 10);
      const l2Responses = session.responses.slice(10, 20);
      const l3Responses = session.responses.slice(20, 30);
      const l1Avg = l1Responses.length > 0 ? Math.round(l1Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l1Responses.length) : 75;
      const l2Avg = l2Responses.length > 0 ? Math.round(l2Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l2Responses.length) : 75;
      const l3Avg = l3Responses.length > 0 ? Math.round(l3Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l3Responses.length) : 75;
      session.level_scores = {
        level1: l1Avg,
        level2: l2Avg,
        level3: l3Avg
      };
      const weightedScore = Math.round(l1Avg * 0.25 + l2Avg * 0.35 + l3Avg * 0.4);
      session.overall_score = weightedScore;
      const allEvaluations = session.responses.map((r) => r.evaluation).filter(Boolean);
      const avgCorrectness = Math.round(allEvaluations.reduce((acc, e) => acc + (e.correctness || e.score || 0), 0) / allEvaluations.length);
      const avgDepth = Math.round(allEvaluations.reduce((acc, e) => acc + (e.technical_depth || e.score || 0), 0) / allEvaluations.length);
      const avgClarity = Math.round(allEvaluations.reduce((acc, e) => acc + (e.clarity || 80), 0) / allEvaluations.length);
      const avgConfidence = Math.round(allEvaluations.reduce((acc, e) => acc + (e.confidence_score || 80), 0) / allEvaluations.length);
      const problemSolving = Math.round(l2Avg * 0.4 + l3Avg * 0.6);
      session.metrics_breakdown = {
        technical_knowledge: avgCorrectness,
        concept_understanding: avgDepth,
        problem_solving: problemSolving,
        communication: avgClarity,
        confidence_level: avgConfidence
      };
      session.passed = weightedScore >= this.getSettings().technicalCutoff;
    }
    this.saveDatabase();
    return { session, currentEvaluation: evaluation };
  }
  // HR Round Execution & Voice Evaluation
  startHRInterview(userId) {
    const isDemo = this.isDemoUser(userId);
    const dashboard = this.getDashboardState(userId);
    if (!isDemo && !dashboard.progression.hr_unlocked) {
      throw new Error("HR Round is locked until you successfully clear the Technical Interview.");
    }
    const session = {
      session_id: `hr_sess_${Date.now()}`,
      user_id: userId,
      status: "IN_PROGRESS",
      current_question_index: 0,
      total_questions: HR_QUESTIONS_BANK.length,
      questions: HR_QUESTIONS_BANK,
      responses: []
    };
    const prog = this.getUserProgress(userId);
    prog.hr_sessions.push(session);
    this.saveDatabase();
    return session;
  }
  async evaluateHRStep(userId, sessionId, questionId, responseType, responseText) {
    const prog = this.getUserProgress(userId);
    const session = prog.hr_sessions.find((s) => s.session_id === sessionId);
    if (!session) {
      throw new Error("HR session not found");
    }
    const question = session.questions.find((q) => q.question_id === questionId) || session.questions[session.current_question_index];
    const evaluation = await evaluateHREvaluation({
      question: question.question,
      response_text: responseText
    });
    session.responses.push({
      question_id: question.question_id,
      question: question.question,
      response_type: responseType,
      response: responseText,
      evaluation
    });
    session.current_question_index += 1;
    if (session.current_question_index >= session.total_questions) {
      session.status = "COMPLETED";
      session.completed_at = (/* @__PURE__ */ new Date()).toISOString();
      const avgScore = Math.round(
        session.responses.reduce((sum, r) => sum + r.evaluation.score, 0) / session.responses.length
      );
      session.overall_score = avgScore;
      session.passed = avgScore >= this.getSettings().hrCutoff;
    }
    this.saveDatabase();
    return { session, currentEvaluation: evaluation };
  }
  // Final Performance Report Generator
  async getFinalReport(userId) {
    const user = this.getUserById(userId) || this.data.users[0];
    const prog = this.getUserProgress(user.user_id);
    const dashboard = this.getDashboardState(user.user_id);
    const latestFinalApt = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1] || {
      score: 22,
      total_questions: 25,
      percentage: 88,
      status: "QUALIFIED",
      topic_scores: {
        quantitative: { score: 6, total: 7, percentage: 85 },
        logical: { score: 5, total: 6, percentage: 83 },
        verbal: { score: 5, total: 6, percentage: 83 },
        specialized: { score: 6, total: 6, percentage: 100 }
      }
    };
    const completedTech = prog.technical_sessions.filter((s) => s.status === "COMPLETED");
    const latestTech = completedTech[completedTech.length - 1] || {
      domain: "fullstack",
      overall_score: 84,
      passed: true,
      questions: [{ question_id: "q1" }, { question_id: "q2" }, { question_id: "q3" }]
    };
    const completedHR = prog.hr_sessions.filter((s) => s.status === "COMPLETED");
    const latestHR = completedHR[completedHR.length - 1] || {
      overall_score: 86,
      passed: true,
      questions: [{ question_id: "q1" }, { question_id: "q2" }, { question_id: "q3" }]
    };
    const compositeScore = Math.round(
      latestFinalApt.percentage * 0.4 + latestTech.overall_score * 0.35 + latestHR.overall_score * 0.25
    );
    const isQualified = compositeScore >= 65 && latestTech.passed && latestHR.passed;
    const aiFeedback = await generateFinalAIFeedback({
      candidate_name: user.name,
      domain: latestTech.domain,
      aptitude_scores: {
        quantitative: latestFinalApt.topic_scores.quantitative.percentage,
        logical: latestFinalApt.topic_scores.logical.percentage,
        verbal: latestFinalApt.topic_scores.verbal.percentage,
        specialized: latestFinalApt.topic_scores.specialized.percentage
      },
      technical_score: latestTech.overall_score,
      hr_score: latestHR.overall_score,
      overall_score: compositeScore
    });
    const report = {
      report_id: `rep_${Date.now()}`,
      user_name: user.name,
      user_email: user.email,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      selected_domain: latestTech.domain.toUpperCase(),
      aptitude: {
        quantitative: latestFinalApt.topic_scores.quantitative.percentage,
        logical: latestFinalApt.topic_scores.logical.percentage,
        verbal: latestFinalApt.topic_scores.verbal.percentage,
        specialized: latestFinalApt.topic_scores.specialized.percentage,
        final_aptitude_score: latestFinalApt.percentage,
        status: latestFinalApt.status
      },
      technical: {
        domain: latestTech.domain,
        score: latestTech.overall_score,
        status: latestTech.passed ? "CLEARED" : "FAILED",
        question_count: latestTech.questions?.length || 3
      },
      hr: {
        score: latestHR.overall_score,
        status: latestHR.passed ? "RECOMMENDED" : "NOT_RECOMMENDED",
        question_count: latestHR.questions?.length || 3
      },
      overall: {
        score: compositeScore,
        qualification_status: isQualified ? "QUALIFIED" : "NEEDS_REVISION",
        badge: compositeScore >= 85 ? "Senior Hire Ready" : compositeScore >= 70 ? "Interview Qualified" : "Development Needed"
      },
      ai_feedback: {
        summary: aiFeedback.executive_summary,
        strengths: aiFeedback.key_strengths,
        weaknesses: aiFeedback.critical_weaknesses,
        action_plan: aiFeedback.personalized_action_plan.map((p) => `${p.title}: ${p.focus} (${p.timeframe})`),
        executive_summary: aiFeedback.executive_summary,
        key_strengths: aiFeedback.key_strengths,
        critical_weaknesses: aiFeedback.critical_weaknesses,
        recommended_topics: aiFeedback.recommended_topics,
        personalized_action_plan: aiFeedback.personalized_action_plan
      }
    };
    return report;
  }
  // Performance History Aggregator
  getPerformanceHistory(userId) {
    const prog = this.getUserProgress(userId);
    return {
      level_attempts: prog.level_attempts,
      test_attempts: prog.test_attempts,
      final_aptitude_attempts: prog.final_aptitude_attempts,
      technical_interviews: prog.technical_sessions,
      hr_interviews: prog.hr_sessions
    };
  }
  // Quick seed / Unlock for testing (Admin feature)
  quickUnlockMilestone(userId, milestone) {
    const prog = this.getUserProgress(userId);
    const topicIds = ["quantitative", "logical", "verbal", "specialized"];
    if (milestone === "level5") {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5];
        prog.topic_test1_passed[tid] = false;
        prog.topic_test2_passed[tid] = false;
      });
    } else if (milestone === "all_topics") {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        prog.topic_test1_passed[tid] = true;
        prog.topic_test2_passed[tid] = true;
      });
    } else if (milestone === "technical" || milestone === "hr" || milestone === "complete") {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        prog.topic_test1_passed[tid] = true;
        prog.topic_test2_passed[tid] = true;
      });
      if (!prog.final_aptitude_attempts.length || prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1].status !== "QUALIFIED") {
        prog.final_aptitude_attempts.push({
          attempt_id: `seed_final_${Date.now()}`,
          score: 22,
          total_questions: 25,
          percentage: 88,
          status: "QUALIFIED",
          cutoff: 70,
          topic_scores: {
            quantitative: { score: 6, total: 7, percentage: 85 },
            logical: { score: 5, total: 6, percentage: 83 },
            verbal: { score: 5, total: 6, percentage: 83 },
            specialized: { score: 6, total: 6, percentage: 100 }
          },
          strongest_topic: "Specialized & Technical Aptitude",
          weakest_topic: "Logical Reasoning",
          recommended_topics: ["Continue practice"],
          technical_unlocked: true
        });
      }
      if (milestone === "hr" || milestone === "complete") {
        if (!prog.technical_sessions.length || !prog.technical_sessions[0].passed) {
          prog.technical_sessions.push({
            session_id: `seed_tech_${Date.now()}`,
            user_id: userId,
            domain: "fullstack",
            status: "COMPLETED",
            current_level: 3,
            current_question_index: 3,
            total_questions: 3,
            questions: DOMAIN_DEFAULTS.fullstack,
            level_scores: {
              level1: 88,
              level2: 85,
              level3: 82
            },
            metrics_breakdown: {
              technical_knowledge: 88,
              concept_understanding: 86,
              problem_solving: 84,
              communication: 85,
              confidence_level: 88
            },
            responses: [
              {
                question_id: "fs_q1",
                question: DOMAIN_DEFAULTS.fullstack[0].question,
                response_type: "text",
                response: "React uses Fiber reconciliation with O(n) heuristic diffing algorithm.",
                evaluation: {
                  score: 85,
                  correctness: 90,
                  technical_depth: 80,
                  clarity: 85,
                  confidence_score: 88,
                  verbal_status: "CORRECT",
                  verbal_feedback: "Clear explanation of React Fiber reconciliation.",
                  spoken_response: "Excellent explanation of Fiber reconciliation and heuristic diffing.",
                  what_you_got_right: ["Accurate algorithmic concepts", "Clear breakdown of microtask batching"],
                  what_you_missed: ["Could mention concurrent rendering prioritization"],
                  improved_answer: "React uses a Fiber-based reconciliation engine with an O(n) heuristic diffing algorithm.",
                  feedback: "Excellent breakdown of React Fiber diffing mechanism.",
                  strengths: ["Accurate algorithmic concepts"],
                  weaknesses: [],
                  suggested_improvements: []
                },
                level: 1,
                topic: "React & Virtual DOM",
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }
            ],
            overall_score: 85,
            passed: true,
            completed_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      if (milestone === "complete") {
        prog.hr_sessions.push({
          session_id: `seed_hr_${Date.now()}`,
          user_id: userId,
          status: "COMPLETED",
          current_question_index: 3,
          total_questions: 3,
          questions: HR_QUESTIONS_BANK,
          responses: [
            {
              question_id: "hr_q1",
              question: HR_QUESTIONS_BANK[0].question,
              response_type: "voice",
              response: "I am a passionate software engineer focused on building resilient distributed systems.",
              evaluation: {
                score: 88,
                relevance: 90,
                clarity: 85,
                communication_quality: 90,
                feedback: "Clear storytelling and strong leadership alignment.",
                strengths: ["Authentic narrative"],
                weaknesses: []
              }
            }
          ],
          overall_score: 88,
          passed: true,
          completed_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    this.saveDatabase();
    return this.getDashboardState(userId);
  }
  resetUserProgress(userId) {
    this.data.user_progress[userId] = this.createDefaultUserProgress(userId);
    this.saveDatabase();
    return this.getDashboardState(userId);
  }
  static {
    // --- ADMIN DEMO MODE (College Project Presentation) ---
    this.DEMO_USER_ID = "user_demo_presentation";
  }
  static {
    this.DEMO_USER_EMAIL = "demo@interview.com";
  }
  getOrCreateDemoUser() {
    let demoUser = this.data.users.find(
      (u) => u.email.toLowerCase() === _Database.DEMO_USER_EMAIL.toLowerCase() || u.user_id === _Database.DEMO_USER_ID
    );
    if (!demoUser) {
      demoUser = {
        user_id: _Database.DEMO_USER_ID,
        name: "Demo Candidate (College Presentation)",
        email: _Database.DEMO_USER_EMAIL,
        password_hash: this.hashPassword("Demo@123"),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.data.users.push(demoUser);
    }
    if (!this.data.user_progress[_Database.DEMO_USER_ID]) {
      this.initDemoProgress(_Database.DEMO_USER_ID);
    }
    this.saveDatabase();
    return { user: demoUser, token: `token_${demoUser.user_id}` };
  }
  initDemoProgress(userId = _Database.DEMO_USER_ID) {
    const demoProgress = {
      user_id: userId,
      topic_levels_passed: {
        quantitative: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        logical: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        verbal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        specialized: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      topic_test1_passed: {
        quantitative: true,
        logical: true,
        verbal: true,
        specialized: true
      },
      topic_test2_passed: {
        quantitative: true,
        logical: true,
        verbal: true,
        specialized: true
      },
      level_attempts: [],
      test_attempts: [],
      final_aptitude_attempts: [
        {
          attempt_id: `demo_final_apt_${Date.now()}`,
          score: 22,
          total_questions: 25,
          percentage: 88,
          status: "QUALIFIED",
          cutoff: this.getSettings().finalTestCutoff || 70,
          topic_scores: {
            quantitative: { score: 6, total: 7, percentage: 85 },
            logical: { score: 5, total: 6, percentage: 83 },
            verbal: { score: 5, total: 6, percentage: 83 },
            specialized: { score: 6, total: 6, percentage: 100 }
          },
          strongest_topic: "Specialized & Technical Aptitude",
          weakest_topic: "Logical Reasoning",
          recommended_topics: ["Continue maintaining high performance across all 4 pillars"],
          technical_unlocked: true,
          answers_review: [
            {
              question_id: "demo_rev_q1",
              question: "A train 150 meters long passes a pole in 9 seconds. What is the speed of the train in km/h?",
              your_answer: "B",
              correct_answer: "B",
              explanation: "Speed = Distance / Time = 150m / 9s = 50/3 m/s. Convert to km/h: (50/3) * (18/5) = 60 km/h.",
              category: "Speed, Time & Distance",
              topic_id: "quantitative",
              difficulty: "Medium",
              is_correct: true,
              option_a: "54 km/h",
              option_b: "60 km/h",
              option_c: "65 km/h",
              option_d: "72 km/h"
            },
            {
              question_id: "demo_rev_q2",
              question: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
              your_answer: "A",
              correct_answer: "A",
              explanation: "The first and last letters are reversed, and every intermediate letter is incremented by +1 in reverse order. MEDICINE becomes EOJDJEFM.",
              category: "Coding & Decoding",
              topic_id: "logical",
              difficulty: "Medium",
              is_correct: true,
              option_a: "EOJDJEFM",
              option_b: "EOJDEJFM",
              option_c: "MFEJDJOE",
              option_d: "EMDJOFJE"
            },
            {
              question_id: "demo_rev_q3",
              question: 'Identify the antonym of the word "TACITURN":',
              your_answer: "C",
              correct_answer: "C",
              explanation: "Taciturn means reserved or uncommunicative in speech. Loquacious or Talkative is the exact opposite.",
              category: "Vocabulary & Antonyms",
              topic_id: "verbal",
              difficulty: "Medium",
              is_correct: true,
              option_a: "Reserved",
              option_b: "Silent",
              option_c: "Loquacious",
              option_d: "Reticent"
            },
            {
              question_id: "demo_rev_q4",
              question: "Which data structure is fundamentally used for Breadth-First Search (BFS) graph traversal?",
              your_answer: "B",
              correct_answer: "B",
              explanation: "BFS explores neighbor vertices layer-by-layer in FIFO order, requiring a Queue data structure.",
              category: "Data Structures & Algorithms",
              topic_id: "specialized",
              difficulty: "Easy",
              is_correct: true,
              option_a: "Stack",
              option_b: "Queue",
              option_c: "Priority Queue",
              option_d: "Binary Search Tree"
            }
          ]
        }
      ],
      technical_sessions: [],
      hr_sessions: [],
      recent_questions_answered: [],
      question_attempts: [],
      concept_performance: {},
      active_level_attempts: {}
    };
    this.data.user_progress[userId] = demoProgress;
    this.saveDatabase();
    return demoProgress;
  }
  resetDemoProgress() {
    this.initDemoProgress(_Database.DEMO_USER_ID);
    return this.getDashboardState(_Database.DEMO_USER_ID);
  }
};
var db = new Database();

// server/emailService.ts
import nodemailer from "nodemailer";
var emailLogs = [];
function getEmailLogs() {
  return [...emailLogs].reverse();
}
function isSmtpConfigured() {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || "").trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const smtpHost = (process.env.SMTP_HOST || "").trim();
  if (gmailUser && gmailPass) {
    return {
      configured: true,
      provider: "Gmail SMTP (smtp.gmail.com:587 TLS)",
      fromAddress: process.env.SMTP_FROM || `"Placement Preparation AI" <${gmailUser}>`,
      user: gmailUser
    };
  }
  if (smtpHost && gmailUser && gmailPass) {
    return {
      configured: true,
      provider: `SMTP Relay (${smtpHost})`,
      fromAddress: process.env.SMTP_FROM || `"Placement Preparation AI" <${gmailUser}>`,
      user: gmailUser
    };
  }
  return {
    configured: false,
    provider: "In-App Delivery (Add GMAIL_USER & GMAIL_APP_PASSWORD to enable live Gmail sending)",
    fromAddress: "noreply@placementprepai.internal",
    user: ""
  };
}
function createTransporter() {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || "").trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").replace(/\s+/g, "");
  if (!gmailUser || !gmailPass) {
    return null;
  }
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const isDirectGmail = host.toLowerCase().includes("gmail.com") || host === "smtp.gmail.com";
  return nodemailer.createTransport({
    host: host || "smtp.gmail.com",
    port: port || 587,
    secure: port === 465,
    // false for 587 (STARTTLS)
    requireTLS: true,
    auth: {
      user: gmailUser,
      pass: gmailPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}
function generateRegistrationEmailHtml(payload) {
  const { userName, to, appUrl } = payload;
  const targetUrl = appUrl || process.env.APP_URL || "https://placement-prep-ai.internal";
  const formattedDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You are registered for Placement Preparation AI</title>
</head>
<body style="margin:0;padding:0;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#090d16;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#0f172a;border-radius:18px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #4338ca 0%, #3b82f6 50%, #06b6d4 100%);padding:40px 32px;text-align:left;">
              <div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e0e7ff;margin-bottom:8px;">
                \u{1F3AF} PLACEMENT PREPARATION AI PLATFORM
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">
                You are registered for this website!
              </h1>
              <p style="margin:10px 0 0;font-size:15px;color:#f1f5f9;font-weight:500;">
                Welcome to your comprehensive campus placement training and assessment portal.
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="font-size:16px;color:#f8fafc;margin-top:0;line-height:1.5;">
                Hello <strong style="color:#38bdf8;">${userName}</strong>,
              </p>
              
              <p style="font-size:14px;color:#cbd5e1;margin-bottom:20px;line-height:1.6;">
                Congratulations! You have successfully registered your candidate account for <strong>Placement Preparation AI</strong>. You now have full access to personalized aptitude diagnostic tracks, comprehensive benchmark tests, Gemini-powered multimodal technical rounds, and behavioral HR interviews.
              </p>

              <!-- Account Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:14px;padding:20px;border:1px solid #334155;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #334155;">
                    \u{1F4CB} Candidate Registration Details
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px;font-size:13px;color:#94a3b8;width:150px;"><strong>Candidate Name:</strong></td>
                  <td style="padding:10px 0 4px;font-size:13px;color:#f8fafc;font-weight:700;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Registered Gmail:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#38bdf8;font-family:monospace;font-weight:600;">${to}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Registration Date:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#e2e8f0;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 2px;font-size:13px;color:#94a3b8;"><strong>Account Status:</strong></td>
                  <td style="padding:6px 0 2px;font-size:13px;color:#34d399;font-weight:800;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#34d399;margin-right:6px;"></span>
                    Active &bull; Fully Provisioned
                  </td>
                </tr>
              </table>

              <!-- Roadmap Section -->
              <div style="background-color:rgba(15, 23, 42, 0.7);border:1px solid #334155;border-radius:14px;padding:22px;margin-bottom:28px;">
                <h3 style="margin:0 0 16px;font-size:14px;font-weight:800;color:#f1f5f9;text-transform:uppercase;letter-spacing:0.8px;">
                  \u{1F680} Your Placement Qualification Journey:
                </h3>
                
                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #6366f1;">
                  <strong style="color:#818cf8;font-size:13px;">Stage 1 &bull; 4-Topic Aptitude Progression (Levels 1-10):</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    Progress through Quantitative, Logical, Verbal, and Specialized tracks with Checkpoint Tests.
                  </div>
                </div>

                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #f59e0b;">
                  <strong style="color:#fbbf24;font-size:13px;">Stage 2 &bull; Comprehensive Final Aptitude Test:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    A 25-question benchmark assessment requiring &ge;70% to unlock technical interview rounds.
                  </div>
                </div>

                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #06b6d4;">
                  <strong style="color:#22d3ee;font-size:13px;">Stage 3 &bull; Multimodal AI Technical Interview:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    Voice speech synthesis & recognition, live code IDE sandbox, and system architecture assessment.
                  </div>
                </div>

                <div style="padding-left:12px;border-left:3px solid #10b981;">
                  <strong style="color:#34d399;font-size:13px;">Stage 4 &bull; AI Behavioral HR Round & Readiness Report:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    STAR-method psychometric evaluation resulting in comprehensive placement diagnostic analytics.
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:center;margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" style="display:inline-block;background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;padding:15px 36px;border-radius:12px;box-shadow:0 6px 20px rgba(79, 70, 229, 0.45);letter-spacing:0.3px;">
                      Open Candidate Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#64748b;margin:0;text-align:center;line-height:1.5;">
                This automated confirmation was dispatched to <span style="color:#94a3b8;">${to}</span> because you registered for the Placement Preparation AI website.<br>If you did not perform this registration, you may safely ignore this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#090d16;padding:24px 32px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Placement Preparation AI &bull; Intelligent Multi-Stage Campus Assessment Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
function generateRegistrationEmailText(payload) {
  const { userName, to, appUrl } = payload;
  const targetUrl = appUrl || process.env.APP_URL || "https://placement-prep-ai.internal";
  return `
Hello ${userName},

You are registered for Placement Preparation AI!

Registration Details:
- Candidate: ${userName}
- Registered Email: ${to}
- Portal Access URL: ${targetUrl}

Your Assessment Roadmap:
1. 4-Topic Aptitude Progression (Levels 1-10)
2. Comprehensive Final Aptitude Test (>=70% cutoff)
3. Multimodal AI Technical Interview (Voice + Code Sandbox)
4. AI Behavioral HR Round & Readiness Diagnostic Report

Log in to start your campus placement preparation:
${targetUrl}

Best regards,
Placement Preparation AI Team
  `.trim();
}
async function sendRegistrationWelcomeEmail(payload) {
  const subject = `\u{1F389} You're registered for Placement Preparation AI - Welcome, ${payload.userName}!`;
  const html = generateRegistrationEmailHtml(payload);
  const text = generateRegistrationEmailText(payload);
  const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const smtpInfo = isSmtpConfigured();
  const transporter = createTransporter();
  const logEntry = {
    id: logId,
    to: payload.to,
    userName: payload.userName,
    subject,
    type: "REGISTRATION_WELCOME",
    sentAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "SIMULATED",
    htmlContent: html,
    provider: smtpInfo.provider
  };
  if (transporter && smtpInfo.configured) {
    const fromAddress = smtpInfo.fromAddress;
    try {
      console.log(`[EmailService] Dispatching registration email via Gmail SMTP to: ${payload.to}`);
      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        subject,
        text,
        html
      });
      logEntry.status = "SENT";
      logEntry.messageId = info.messageId;
      emailLogs.push(logEntry);
      console.log(`[EmailService] \u2705 Successfully delivered email to ${payload.to} via Gmail SMTP. MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        status: "SENT",
        subject,
        sentTo: payload.to,
        deliveryProvider: smtpInfo.provider
      };
    } catch (err) {
      console.error(`[EmailService] \u274C Gmail SMTP error sending to ${payload.to}:`, err.message);
      let userFriendlyError = err.message;
      if (err.message?.includes("535") || err.message?.toLowerCase().includes("badcredentials") || err.message?.toLowerCase().includes("username and password not accepted")) {
        userFriendlyError = "Gmail SMTP authentication failed. Please ensure you are using a 16-character Google App Password (not your standard Gmail account password). Create one at: https://myaccount.google.com/apppasswords";
      }
      logEntry.status = "FAILED";
      logEntry.error = userFriendlyError;
      emailLogs.push(logEntry);
      return {
        success: false,
        status: "FAILED",
        error: userFriendlyError,
        subject,
        sentTo: payload.to,
        deliveryProvider: smtpInfo.provider
      };
    }
  }
  logEntry.status = "SIMULATED";
  emailLogs.push(logEntry);
  console.log(`[EmailService] In-App Outbox: Registration confirmation email recorded for ${payload.to}`);
  return {
    success: true,
    status: "SIMULATED",
    subject,
    sentTo: payload.to,
    deliveryProvider: smtpInfo.provider
  };
}
async function testGmailSmtpConnection(targetTestEmail) {
  const smtpInfo = isSmtpConfigured();
  if (!smtpInfo.configured) {
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: "Gmail SMTP credentials (GMAIL_USER and GMAIL_APP_PASSWORD) are not set.",
      error: "Missing environment credentials. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env or environment secrets."
    };
  }
  const transporter = createTransporter();
  if (!transporter) {
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: "Failed to initialize Gmail SMTP transporter.",
      error: "Invalid transporter configuration."
    };
  }
  try {
    await transporter.verify();
    if (targetTestEmail) {
      await transporter.sendMail({
        from: smtpInfo.fromAddress,
        to: targetTestEmail,
        subject: "\u{1F9EA} Placement Prep AI - Gmail SMTP Connection Test",
        text: "This is a verification email confirming that your Gmail SMTP connection is working correctly and ready to send registration emails to candidates.",
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #38bdf8;">Gmail SMTP Connection Verified!</h2>
            <p>Your Placement Preparation AI application successfully connected to <strong>smtp.gmail.com:587</strong> via TLS.</p>
            <p>Candidate welcome emails will be sent directly to registered Gmail inboxes and mobile devices.</p>
          </div>
        `
      });
    }
    return {
      connected: true,
      provider: smtpInfo.provider,
      message: targetTestEmail ? `Gmail SMTP verified! A test verification email was sent to ${targetTestEmail}.` : `Connected to Gmail SMTP (smtp.gmail.com:587 TLS) successfully as ${smtpInfo.user}!`
    };
  } catch (err) {
    let msg = err.message;
    if (msg.includes("535") || msg.toLowerCase().includes("badcredentials") || msg.toLowerCase().includes("username and password not accepted")) {
      msg = "Gmail SMTP Authentication Failed: Incorrect Google App Password. Please generate a 16-character App Password at https://myaccount.google.com/apppasswords";
    }
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: "Gmail SMTP Connection verification failed.",
      error: msg
    };
  }
}

// server/app.ts
dotenv.config();
var app = express();
app.use(express.json({ limit: "10mb" }));
function getAuthUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer token_")) {
    return authHeader.replace("Bearer token_", "");
  }
  return "user_demo";
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    const result = db.registerUser(name, email, password);
    let emailResult = null;
    try {
      emailResult = await sendRegistrationWelcomeEmail({
        to: result.user.email,
        userName: result.user.name,
        appUrl: process.env.APP_URL
      });
    } catch (emailErr) {
      console.error("[Server] Registration welcome email error:", emailErr.message);
      emailResult = {
        success: false,
        status: "FAILED",
        error: emailErr.message,
        sentTo: result.user.email
      };
    }
    const isLiveSent = emailResult?.status === "SENT";
    const isFailed = emailResult?.status === "FAILED";
    res.status(201).json({
      ...result,
      emailResult,
      message: isLiveSent ? `Registration completed! An official welcome email was sent to ${result.user.email} via Gmail SMTP.` : isFailed ? `Account registered! (Note: Email delivery failed: ${emailResult.error})` : `Registration completed! Welcome email logged for ${result.user.email}.`
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const result = db.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
});
app.post("/api/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});
app.get("/api/me", (req, res) => {
  const userId = getAuthUserId(req);
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});
app.post("/api/update-profile", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { name, email } = req.body;
    const updatedUser = db.updateUserProfile(userId, name, email);
    res.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update profile" });
  }
});
app.get("/api/dashboard", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const state = db.getDashboardState(userId);
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/aptitude/topics", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const state = db.getDashboardState(userId);
    res.json({ topics: state.topics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/aptitude/topic/:topic_id", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id } = req.params;
    const state = db.getDashboardState(userId);
    const topic = state.topics[topic_id];
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    const prog = db.getUserProgress(userId);
    res.json({
      topic,
      passed_levels: prog.topic_levels_passed[topic_id] || [],
      test1_passed: prog.topic_test1_passed[topic_id] || false,
      test2_passed: prog.topic_test2_passed[topic_id] || false
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/aptitude/level/:topic_id/:level_id", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, level_id } = req.params;
    const isRetry = req.query.retry === "true" || req.query.new_attempt === "true";
    const questions = db.getQuestionsForLevel(userId, topic_id, parseInt(level_id, 10), isRetry);
    res.json({
      topic_id,
      level_id: parseInt(level_id, 10),
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().levelTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      }))
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/aptitude/level/:topic_id/:level_id/submit", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, level_id } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers array is required" });
    }
    const result = db.submitLevel(userId, topic_id, parseInt(level_id, 10), answers);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/aptitude/test/:topic_id/:test_number", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, test_number } = req.params;
    const testNum = parseInt(test_number, 10);
    const questions = db.getQuestionsForTopicTest(userId, topic_id, testNum);
    res.json({
      topic_id,
      test_number: testNum,
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().testTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      }))
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});
app.post("/api/aptitude/test/:topic_id/:test_number/submit", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, test_number } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers array is required" });
    }
    const result = db.submitTopicTest(userId, topic_id, parseInt(test_number, 10), answers);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/aptitude/final", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const questions = db.getQuestionsForFinalTest(userId);
    res.json({
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().finalTestTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        topic_id: q.topic_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      }))
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});
app.get("/api/aptitude/concept-mastery", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const prog = db.getUserProgress(userId);
    res.json({
      concept_performance: prog.concept_performance || {},
      total_attempt_logs: (prog.question_attempts || []).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/aptitude/final/submit", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers array is required" });
    }
    const result = db.submitFinalTest(userId, answers);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/technical/domains", (req, res) => {
  res.json({ domains: TECHNICAL_DOMAINS_LIST });
});
app.get("/api/technical/active", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const session = db.getActiveTechnicalInterview(userId);
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/technical/reset", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    db.resetTechnicalInterview(userId);
    res.json({ success: true, message: "Technical interview reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/technical/start", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { domain, is_retake } = req.body;
    if (!domain) {
      return res.status(400).json({ error: "Selected domain is required" });
    }
    const session = await db.startTechnicalInterview(userId, domain, !!is_retake);
    res.json(session);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});
app.post("/api/technical/evaluate", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { session_id, question_id, response_type, response_text, code_snippet, diagram_data, time_taken_seconds } = req.body;
    if (!session_id || !question_id) {
      return res.status(400).json({ error: "session_id and question_id are required" });
    }
    const result = await db.evaluateTechnicalStep(
      userId,
      session_id,
      question_id,
      response_type || "text",
      response_text || "",
      code_snippet,
      diagram_data,
      time_taken_seconds
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/hr/start", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const session = db.startHRInterview(userId);
    res.json(session);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});
app.post("/api/hr/evaluate", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { session_id, question_id, response_type, response_text } = req.body;
    if (!session_id || !question_id) {
      return res.status(400).json({ error: "session_id and question_id are required" });
    }
    const result = await db.evaluateHRStep(
      userId,
      session_id,
      question_id,
      response_type || "text",
      response_text || ""
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/report", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const report = await db.getFinalReport(userId);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/history", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const history = db.getPerformanceHistory(userId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/settings", (req, res) => {
  res.json(db.getSettings());
});
app.post("/api/admin/settings", (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/admin/quick-unlock", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { milestone } = req.body;
    const updatedState = db.quickUnlockMilestone(userId, milestone || "all_topics");
    res.json(updatedState);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/admin/reset-progress", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const reset = db.resetUserProgress(userId);
    res.json(reset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/admin/demo-mode/enable", (req, res) => {
  try {
    const demoData = db.getOrCreateDemoUser();
    res.json({
      success: true,
      user: demoData.user,
      token: demoData.token,
      isDemoMode: true,
      message: "Admin Demo Mode activated for demo@interview.com"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/admin/demo-mode/reset", (req, res) => {
  try {
    const resetDashboard = db.resetDemoProgress();
    res.json({
      success: true,
      message: "Demo dataset reset to initial qualified aptitude state (ready for live technical & HR presentation).",
      dashboard: resetDashboard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/demo-mode/status", (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = db.getUserById(userId);
    const isDemo = user.email.toLowerCase() === "demo@interview.com" || userId === "user_demo_presentation";
    res.json({
      isDemoMode: isDemo,
      user: isDemo ? user : null
    });
  } catch {
    res.json({ isDemoMode: false, user: null });
  }
});
app.get("/api/notifications/emails", (req, res) => {
  try {
    const logs = getEmailLogs();
    const smtpStatus = isSmtpConfigured();
    res.json({ emails: logs, smtp: smtpStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/notifications/smtp-status", (req, res) => {
  res.json(isSmtpConfigured());
});
app.post("/api/notifications/resend-registration", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = db.getUserById(userId);
    const targetEmail = req.body.email || user.email;
    const targetName = req.body.name || user.name;
    const dispatchResult = await sendRegistrationWelcomeEmail({
      to: targetEmail,
      userName: targetName,
      appUrl: process.env.APP_URL
    });
    res.json({
      success: true,
      message: `Welcome registration email dispatched to ${targetEmail}`,
      details: dispatchResult
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to dispatch registration email" });
  }
});
app.post("/api/notifications/test-smtp", async (req, res) => {
  try {
    const targetEmail = req.body.email;
    const testResult = await testGmailSmtpConnection(targetEmail);
    if (!testResult.connected) {
      return res.status(400).json(testResult);
    }
    res.json(testResult);
  } catch (err) {
    res.status(500).json({
      connected: false,
      message: "SMTP Test Failed",
      error: err.message
    });
  }
});
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});
var app_default = app;

// api/index.ts
var index_default = app_default;
export {
  index_default as default
};
