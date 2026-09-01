import { AptitudeQuestion } from '../../src/types';

export function getQuantitativeQuestions(): AptitudeQuestion[] {
  const list: AptitudeQuestion[] = [];
  let counter = 0;

  const addQ = (
    level_id: number,
    category: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    question: string,
    correctText: string,
    d1: string,
    d2: string,
    d3: string,
    exp: string
  ) => {
    counter++;
    const posIndex = (counter - 1) % 4;
    const letters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
    const correctLetter = letters[posIndex];

    const distractors = [d1, d2, d3];
    if (counter % 2 === 1) {
      const tmp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = tmp;
    }

    const opts: Record<'A' | 'B' | 'C' | 'D', string> = { A: '', B: '', C: '', D: '' };
    opts[correctLetter] = correctText;

    let distIdx = 0;
    for (const l of letters) {
      if (l !== correctLetter) {
        opts[l] = distractors[distIdx++] || '';
      }
    }

    list.push({
      question_id: `q_quant_l${level_id}_${counter}`,
      topic_id: 'quantitative',
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
      pool_type: 'learning',
    });
  };

  // Level 1: Percentages & Fractions (30 diverse questions with unique numbers and answers)
  const pData = [
    { p: 15, num: 240, ans: '36', d1: '40', d2: '32', d3: '48' },
    { p: 25, num: 360, ans: '90', d1: '85', d2: '95', d3: '100' },
    { p: 40, num: 150, ans: '60', d1: '55', d2: '65', d3: '70' },
    { p: 12, num: 500, ans: '60', d1: '50', d2: '65', d3: '72' },
    { p: 35, num: 200, ans: '70', d1: '65', d2: '75', d3: '80' },
    { p: 18, num: 450, ans: '81', d1: '78', d2: '84', d3: '90' },
    { p: 75, num: 320, ans: '240', d1: '230', d2: '250', d3: '260' },
    { p: 60, num: 180, ans: '108', d1: '102', d2: '114', d3: '120' },
    { p: 45, num: 400, ans: '180', d1: '170', d2: '190', d3: '200' },
    { p: 8, num: 625, ans: '50', d1: '45', d2: '55', d3: '60' },
    { p: 30, num: 270, ans: '81', d1: '75', d2: '87', d3: '93' },
    { p: 85, num: 140, ans: '119', d1: '112', d2: '124', d3: '128' },
    { p: 22, num: 350, ans: '77', d1: '72', d2: '82', d3: '88' },
    { p: 16, num: 650, ans: '104', d1: '98', d2: '110', d3: '116' },
    { p: 55, num: 280, ans: '154', d1: '146', d2: '160', d3: '168' },
  ];
  pData.forEach((d) => {
    addQ(
      1,
      'Percentages',
      'Easy',
      `What is ${d.p}% of ${d.num}?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.p}% of ${d.num} = (${d.p}/100) * ${d.num} = ${d.ans}.`
    );
  });

  const fData = [
    { n: 3, d: 8, ans: '37.5%', d1: '35.0%', d2: '40.0%', d3: '42.5%' },
    { n: 7, d: 20, ans: '35%', d1: '32%', d2: '38%', d3: '40%' },
    { n: 5, d: 16, ans: '31.25%', d1: '28.50%', d2: '33.75%', d3: '35.00%' },
    { n: 4, d: 25, ans: '16%', d1: '14%', d2: '18%', d3: '20%' },
    { n: 9, d: 40, ans: '22.5%', d1: '20.0%', d2: '24.5%', d3: '26.0%' },
    { n: 11, d: 50, ans: '22%', d1: '20%', d2: '24%', d3: '25%' },
    { n: 13, d: 20, ans: '65%', d1: '60%', d2: '70%', d3: '75%' },
    { n: 5, d: 8, ans: '62.5%', d1: '58.0%', d2: '65.0%', d3: '67.5%' },
    { n: 17, d: 25, ans: '68%', d1: '64%', d2: '72%', d3: '75%' },
    { n: 19, d: 50, ans: '38%', d1: '34%', d2: '42%', d3: '45%' },
    { n: 7, d: 8, ans: '87.5%', d1: '82.5%', d2: '90.0%', d3: '92.5%' },
    { n: 9, d: 25, ans: '36%', d1: '32%', d2: '40%', d3: '44%' },
    { n: 21, d: 50, ans: '42%', d1: '39%', d2: '45%', d3: '48%' },
    { n: 23, d: 40, ans: '57.5%', d1: '52.5%', d2: '60.0%', d3: '62.5%' },
    { n: 29, d: 50, ans: '58%', d1: '54%', d2: '62%', d3: '65%' },
  ];
  fData.forEach((d) => {
    addQ(
      1,
      'Fractions',
      'Medium',
      `Convert the fraction ${d.n}/${d.d} to an exact percentage.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `(${d.n} / ${d.d}) * 100% = ${d.ans}.`
    );
  });

  // Level 2: Profit & Loss & Discounts (30 diverse questions)
  const plData = [
    { cp: 250, p: 20, sp: '$300', d1: '$280', d2: '$320', d3: '$350' },
    { cp: 400, p: 15, sp: '$460', d1: '$440', d2: '$480', d3: '$500' },
    { cp: 180, p: 25, sp: '$225', d1: '$215', d2: '$235', d3: '$240' },
    { cp: 500, p: 12, sp: '$560', d1: '$540', d2: '$580', d3: '$600' },
    { cp: 320, p: 30, sp: '$416', d1: '$400', d2: '$432', d3: '$440' },
    { cp: 650, p: 10, sp: '$715', d1: '$700', d2: '$730', d3: '$750' },
    { cp: 120, p: 35, sp: '$162', d1: '$156', d2: '$168', d3: '$174' },
    { cp: 800, p: 18, sp: '$944', d1: '$920', d2: '$960', d3: '$980' },
    { cp: 450, p: 8, sp: '$486', d1: '$475', d2: '$498', d3: '$510' },
    { cp: 750, p: 16, sp: '$870', d1: '$850', d2: '$890', d3: '$910' },
    { cp: 360, p: 25, sp: '$450', d1: '$430', d2: '$470', d3: '$490' },
    { cp: 520, p: 15, sp: '$598', d1: '$580', d2: '$612', d3: '$625' },
    { cp: 280, p: 40, sp: '$392', d1: '$375', d2: '$405', d3: '$420' },
    { cp: 900, p: 22, sp: '$1098', d1: '$1050', d2: '$1120', d3: '$1150' },
    { cp: 600, p: 30, sp: '$780', d1: '$750', d2: '$810', d3: '$840' },
  ];
  plData.forEach((d) => {
    addQ(
      2,
      'Profit & Loss',
      'Easy',
      `An item is bought for $${d.cp} and sold with a ${d.p}% profit. Find the selling price.`,
      d.sp,
      d.d1,
      d.d2,
      d.d3,
      `SP = $${d.cp} * (1 + ${d.p}/100) = ${d.sp}.`
    );
  });

  const discData = [
    { mp: 400, disc: 15, sp: '$340', d1: '$320', d2: '$350', d3: '$360' },
    { mp: 650, disc: 20, sp: '$520', d1: '$500', d2: '$540', d3: '$560' },
    { mp: 250, disc: 10, sp: '$225', d1: '$215', d2: '$230', d3: '$240' },
    { mp: 800, disc: 25, sp: '$600', d1: '$580', d2: '$620', d3: '$640' },
    { mp: 550, disc: 30, sp: '$385', d1: '$370', d2: '$395', d3: '$410' },
    { mp: 300, disc: 5, sp: '$285', d1: '$275', d2: '$290', d3: '$295' },
    { mp: 900, disc: 12, sp: '$792', d1: '$780', d2: '$805', d3: '$820' },
    { mp: 720, disc: 15, sp: '$612', d1: '$598', d2: '$625', d3: '$640' },
    { mp: 480, disc: 35, sp: '$312', d1: '$300', d2: '$325', d3: '$340' },
    { mp: 1200, disc: 18, sp: '$984', d1: '$960', d2: '$1005', d3: '$1020' },
    { mp: 350, disc: 20, sp: '$280', d1: '$270', d2: '$290', d3: '$300' },
    { mp: 850, disc: 10, sp: '$765', d1: '$750', d2: '$780', d3: '$795' },
    { mp: 500, disc: 28, sp: '$360', d1: '$345', d2: '$375', d3: '$390' },
    { mp: 950, disc: 16, sp: '$798', d1: '$780', d2: '$815', d3: '$830' },
    { mp: 1500, disc: 25, sp: '$1125', d1: '$1100', d2: '$1150', d3: '$1200' },
  ];
  discData.forEach((d) => {
    addQ(
      2,
      'Discounts',
      'Medium',
      `An article with marked price $${d.mp} is offered at a ${d.disc}% discount. What is the payable price?`,
      d.sp,
      d.d1,
      d.d2,
      d.d3,
      `Payable = $${d.mp} * (1 - ${d.disc}/100) = ${d.sp}.`
    );
  });

  // Level 3: Simple & Compound Interest (30 questions)
  const siData = [
    { p: 1200, r: 5, t: 3, si: '$180', d1: '$160', d2: '$200', d3: '$220' },
    { p: 2500, r: 6, t: 2, si: '$300', d1: '$280', d2: '$320', d3: '$340' },
    { p: 800, r: 8, t: 4, si: '$256', d1: '$240', d2: '$270', d3: '$288' },
    { p: 3500, r: 4, t: 5, si: '$700', d1: '$650', d2: '$750', d3: '$800' },
    { p: 1500, r: 7, t: 2, si: '$210', d1: '$195', d2: '$225', d3: '$240' },
    { p: 4000, r: 5, t: 4, si: '$800', d1: '$750', d2: '$850', d3: '$900' },
    { p: 2000, r: 9, t: 3, si: '$540', d1: '$510', d2: '$570', d3: '$600' },
    { p: 5000, r: 6, t: 3, si: '$900', d1: '$850', d2: '$950', d3: '$1000' },
    { p: 1800, r: 8, t: 2, si: '$288', d1: '$270', d2: '$305', d3: '$320' },
    { p: 6000, r: 4, t: 3, si: '$720', d1: '$680', d2: '$760', d3: '$800' },
    { p: 3000, r: 7, t: 4, si: '$840', d1: '$800', d2: '$880', d3: '$920' },
    { p: 4500, r: 5, t: 2, si: '$450', d1: '$420', d2: '$480', d3: '$500' },
    { p: 7000, r: 3, t: 5, si: '$1050', d1: '$1000', d2: '$1100', d3: '$1150' },
    { p: 2200, r: 6, t: 4, si: '$528', d1: '$500', d2: '$550', d3: '$580' },
    { p: 8000, r: 5, t: 2, si: '$800', d1: '$750', d2: '$850', d3: '$900' },
  ];
  siData.forEach((d) => {
    addQ(
      3,
      'Simple Interest',
      'Easy',
      `Find the Simple Interest on $${d.p} at ${d.r}% per annum for ${d.t} years.`,
      d.si,
      d.d1,
      d.d2,
      d.d3,
      `SI = (P * R * T) / 100 = ($${d.p} * ${d.r} * ${d.t}) / 100 = ${d.si}.`
    );
  });

  const ciData = [
    { p: 1000, r: 10, t: 2, ci: '$210', d1: '$200', d2: '$220', d3: '$230' },
    { p: 2000, r: 5, t: 2, ci: '$205', d1: '$195', d2: '$215', d3: '$225' },
    { p: 5000, r: 8, t: 2, ci: '$832', d1: '$800', d2: '$850', d3: '$880' },
    { p: 3000, r: 10, t: 2, ci: '$630', d1: '$600', d2: '$650', d3: '$680' },
    { p: 4000, r: 6, t: 2, ci: '$494.40', d1: '$480.00', d2: '$510.00', d3: '$525.00' },
    { p: 8000, r: 5, t: 2, ci: '$820', d1: '$800', d2: '$840', d3: '$860' },
    { p: 1500, r: 12, t: 2, ci: '$381.60', d1: '$360.00', d2: '$395.00', d3: '$410.00' },
    { p: 6000, r: 10, t: 2, ci: '$1260', d1: '$1200', d2: '$1300', d3: '$1350' },
    { p: 10000, r: 4, t: 2, ci: '$816', d1: '$800', d2: '$835', d3: '$850' },
    { p: 2500, r: 8, t: 2, ci: '$416', d1: '$400', d2: '$430', d3: '$445' },
    { p: 7000, r: 6, t: 2, ci: '$865.20', d1: '$840.00', d2: '$885.00', d3: '$910.00' },
    { p: 12000, r: 5, t: 2, ci: '$1230', d1: '$1200', d2: '$1260', d3: '$1290' },
    { p: 4500, r: 10, t: 2, ci: '$945', d1: '$900', d2: '$975', d3: '$1000' },
    { p: 9000, r: 4, t: 2, ci: '$734.40', d1: '$720.00', d2: '$750.00', d3: '$770.00' },
    { p: 5500, r: 8, t: 2, ci: '$915.20', d1: '$880.00', d2: '$940.00', d3: '$960.00' },
  ];
  ciData.forEach((d) => {
    addQ(
      3,
      'Compound Interest',
      'Medium',
      `Calculate the Compound Interest on $${d.p} invested at ${d.r}% per annum compounded annually for ${d.t} years.`,
      d.ci,
      d.d1,
      d.d2,
      d.d3,
      `CI = P * (1 + R/100)^T - P = ${d.ci}.`
    );
  });

  // Level 4: Ratio & Proportion & Mixtures (30 questions)
  const ratioData = [
    { total: 600, r1: 2, r2: 3, ans: '$360', d1: '$240', d2: '$300', d3: '$400' },
    { total: 840, r1: 3, r2: 4, ans: '$480', d1: '$360', d2: '$450', d3: '$520' },
    { total: 750, r1: 2, r2: 3, ans: '$450', d1: '$300', d2: '$400', d3: '$500' },
    { total: 1000, r1: 3, r2: 7, ans: '$700', d1: '$300', d2: '$650', d3: '$750' },
    { total: 960, r1: 5, r2: 3, ans: '$360', d1: '$600', d2: '$400', d3: '$480' },
    { total: 1100, r1: 4, r2: 7, ans: '$700', d1: '$400', d2: '$650', d3: '$750' },
    { total: 540, r1: 4, r2: 5, ans: '$300', d1: '$240', d2: '$280', d3: '$320' },
    { total: 1350, r1: 4, r2: 5, ans: '$750', d1: '$600', d2: '$700', d3: '$800' },
    { total: 720, r1: 5, r2: 4, ans: '$320', d1: '$400', d2: '$350', d3: '$380' },
    { total: 1250, r1: 2, r2: 3, ans: '$750', d1: '$500', d2: '$700', d3: '$800' },
    { total: 1600, r1: 3, r2: 5, ans: '$1000', d1: '$600', d2: '$900', d3: '$1100' },
    { total: 420, r1: 2, r2: 5, ans: '$300', d1: '$120', d2: '$280', d3: '$320' },
    { total: 1440, r1: 5, r2: 7, ans: '$840', d1: '$600', d2: '$800', d3: '$900' },
    { total: 880, r1: 3, r2: 8, ans: '$640', d1: '$240', d2: '$600', d3: '$680' },
    { total: 2000, r1: 7, r2: 3, ans: '$600', d1: '$1400', d2: '$700', d3: '$800' },
  ];
  ratioData.forEach((d) => {
    addQ(
      4,
      'Ratio & Proportion',
      'Easy',
      `Divide $${d.total} between Person A and Person B in the ratio ${d.r1}:${d.r2}. What is Person B's share?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `B's share = (${d.r2} / ${d.r1 + d.r2}) * $${d.total} = ${d.ans}.`
    );
  });

  const mixData = [
    { c1: 40, c2: 0, mean: 30, ans: '3:1', d1: '2:1', d2: '4:1', d3: '1:2' },
    { c1: 50, c2: 0, mean: 40, ans: '4:1', d1: '3:1', d2: '5:1', d3: '2:1' },
    { c1: 60, c2: 20, mean: 30, ans: '1:3', d1: '1:2', d2: '2:3', d3: '3:4' },
    { c1: 80, c2: 30, mean: 50, ans: '2:3', d1: '3:2', d2: '1:2', d3: '3:4' },
    { c1: 75, c2: 25, mean: 45, ans: '2:3', d1: '3:5', d2: '1:2', d3: '4:5' },
    { c1: 90, c2: 40, mean: 60, ans: '2:3', d1: '1:2', d2: '3:4', d3: '4:5' },
    { c1: 70, c2: 20, mean: 50, ans: '3:2', d1: '2:3', d2: '4:3', d3: '1:1' },
    { c1: 85, c2: 35, mean: 55, ans: '2:3', d1: '3:4', d2: '1:2', d3: '5:6' },
    { c1: 100, c2: 40, mean: 80, ans: '2:1', d1: '3:1', d2: '1:2', d3: '4:1' },
    { c1: 65, c2: 15, mean: 45, ans: '3:2', d1: '2:3', d2: '1:1', d3: '4:3' },
    { c1: 95, c2: 45, mean: 65, ans: '2:3', d1: '3:5', d2: '1:2', d3: '4:5' },
    { c1: 120, c2: 50, mean: 80, ans: '3:4', d1: '2:3', d2: '4:5', d3: '1:2' },
    { c1: 110, c2: 60, mean: 90, ans: '3:2', d1: '2:3', d2: '4:3', d3: '1:1' },
    { c1: 130, c2: 70, mean: 100, ans: '1:1', d1: '2:1', d2: '1:2', d3: '3:2' },
    { c1: 150, c2: 80, mean: 115, ans: '1:1', d1: '3:2', d2: '2:3', d3: '4:3' },
  ];
  mixData.forEach((d) => {
    addQ(
      4,
      'Mixtures & Alligation',
      'Hard',
      `In what ratio must ingredient A ($${d.c1}/kg) and ingredient B ($${d.c2}/kg) be mixed to obtain a blend worth $${d.mean}/kg?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `By Alligation: (${d.mean} - ${d.c2}) : (${d.c1} - ${d.mean}) = ${d.ans}.`
    );
  });

  // Level 5: Time & Work (30 questions)
  const twData = [
    { a: 10, b: 15, ans: '6 days', d1: '5 days', d2: '7 days', d3: '8 days' },
    { a: 12, b: 24, ans: '8 days', d1: '6 days', d2: '9 days', d3: '10 days' },
    { a: 20, b: 30, ans: '12 days', d1: '10 days', d2: '14 days', d3: '15 days' },
    { a: 15, b: 30, ans: '10 days', d1: '8 days', d2: '12 days', d3: '14 days' },
    { a: 18, b: 36, ans: '12 days', d1: '9 days', d2: '14 days', d3: '15 days' },
    { a: 12, b: 18, ans: '7.2 days', d1: '6.5 days', d2: '8.0 days', d3: '8.5 days' },
    { a: 16, b: 48, ans: '12 days', d1: '10 days', d2: '14 days', d3: '16 days' },
    { a: 14, b: 21, ans: '8.4 days', d1: '7.5 days', d2: '9.0 days', d3: '9.5 days' },
    { a: 24, b: 40, ans: '15 days', d1: '12 days', d2: '18 days', d3: '20 days' },
    { a: 20, b: 60, ans: '15 days', d1: '12 days', d2: '18 days', d3: '20 days' },
    { a: 30, b: 60, ans: '20 days', d1: '15 days', d2: '25 days', d3: '28 days' },
    { a: 25, b: 75, ans: '18.75 days', d1: '16.50 days', d2: '20.25 days', d3: '22.00 days' },
    { a: 36, b: 72, ans: '24 days', d1: '20 days', d2: '28 days', d3: '30 days' },
    { a: 40, b: 60, ans: '24 days', d1: '20 days', d2: '28 days', d3: '32 days' },
    { a: 45, b: 90, ans: '30 days', d1: '25 days', d2: '35 days', d3: '40 days' },
  ];
  twData.forEach((d) => {
    addQ(
      5,
      'Time & Work',
      'Medium',
      `Worker A can do a task in ${d.a} days and Worker B in ${d.b} days. Working together, how many days will they take?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Time = (A * B) / (A + B) = (${d.a} * ${d.b}) / (${d.a} + ${d.b}) = ${d.ans}.`
    );
  });

  const pipeData = [
    { p1: 6, p2: 12, ans: '4 hours', d1: '3 hours', d2: '5 hours', d3: '6 hours' },
    { p1: 8, p2: 24, ans: '6 hours', d1: '4 hours', d2: '7 hours', d3: '8 hours' },
    { p1: 10, p2: 15, ans: '6 hours', d1: '5 hours', d2: '7 hours', d3: '8 hours' },
    { p1: 12, p2: 24, ans: '8 hours', d1: '6 hours', d2: '9 hours', d3: '10 hours' },
    { p1: 9, p2: 18, ans: '6 hours', d1: '5 hours', d2: '7 hours', d3: '8 hours' },
    { p1: 15, p2: 30, ans: '10 hours', d1: '8 hours', d2: '12 hours', d3: '14 hours' },
    { p1: 20, p2: 30, ans: '12 hours', d1: '10 hours', d2: '14 hours', d3: '15 hours' },
    { p1: 16, p2: 48, ans: '12 hours', d1: '10 hours', d2: '14 hours', d3: '16 hours' },
    { p1: 14, p2: 21, ans: '8.4 hours', d1: '7.5 hours', d2: '9.2 hours', d3: '10.0 hours' },
    { p1: 24, p2: 48, ans: '16 hours', d1: '12 hours', d2: '18 hours', d3: '20 hours' },
    { p1: 18, p2: 36, ans: '12 hours', d1: '10 hours', d2: '14 hours', d3: '15 hours' },
    { p1: 25, p2: 50, ans: '16.67 hours', d1: '14.50 hours', d2: '18.00 hours', d3: '20.00 hours' },
    { p1: 30, p2: 60, ans: '20 hours', d1: '15 hours', d2: '25 hours', d3: '28 hours' },
    { p1: 36, p2: 72, ans: '24 hours', d1: '20 hours', d2: '28 hours', d3: '30 hours' },
    { p1: 40, p2: 60, ans: '24 hours', d1: '20 hours', d2: '28 hours', d3: '32 hours' },
  ];
  pipeData.forEach((d) => {
    addQ(
      5,
      'Pipes & Cisterns',
      'Medium',
      `Pipe X fills a tank in ${d.p1} hours and Pipe Y in ${d.p2} hours. How long will both take together?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Time = (${d.p1} * ${d.p2}) / (${d.p1} + ${d.p2}) = ${d.ans}.`
    );
  });

  // Level 6: Speed, Distance & Trains (30 questions)
  const spData = [
    { kmh: 36, ans: '10 m/s', d1: '8 m/s', d2: '12 m/s', d3: '14 m/s' },
    { kmh: 54, ans: '15 m/s', d1: '12 m/s', d2: '18 m/s', d3: '20 m/s' },
    { kmh: 72, ans: '20 m/s', d1: '18 m/s', d2: '22 m/s', d3: '25 m/s' },
    { kmh: 90, ans: '25 m/s', d1: '22 m/s', d2: '28 m/s', d3: '30 m/s' },
    { kmh: 108, ans: '30 m/s', d1: '28 m/s', d2: '32 m/s', d3: '35 m/s' },
    { kmh: 126, ans: '35 m/s', d1: '30 m/s', d2: '38 m/s', d3: '40 m/s' },
    { kmh: 144, ans: '40 m/s', d1: '36 m/s', d2: '44 m/s', d3: '48 m/s' },
    { kmh: 162, ans: '45 m/s', d1: '40 m/s', d2: '48 m/s', d3: '50 m/s' },
    { kmh: 180, ans: '50 m/s', d1: '45 m/s', d2: '55 m/s', d3: '60 m/s' },
    { kmh: 45, ans: '12.5 m/s', d1: '10.0 m/s', d2: '14.0 m/s', d3: '15.0 m/s' },
    { kmh: 63, ans: '17.5 m/s', d1: '15.0 m/s', d2: '19.0 m/s', d3: '21.0 m/s' },
    { kmh: 81, ans: '22.5 m/s', d1: '20.0 m/s', d2: '24.0 m/s', d3: '26.0 m/s' },
    { kmh: 99, ans: '27.5 m/s', d1: '25.0 m/s', d2: '29.0 m/s', d3: '31.0 m/s' },
    { kmh: 117, ans: '32.5 m/s', d1: '30.0 m/s', d2: '34.0 m/s', d3: '36.0 m/s' },
    { kmh: 135, ans: '37.5 m/s', d1: '35.0 m/s', d2: '40.0 m/s', d3: '42.5 m/s' },
  ];
  spData.forEach((d) => {
    addQ(
      6,
      'Speed & Distance',
      'Easy',
      `Convert a speed of ${d.kmh} km/h into meters per second (m/s).`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.kmh} * (5/18) = ${d.ans}.`
    );
  });

  const trainData = [
    { len: 150, sec: 10, ans: '54 km/h', d1: '45 km/h', d2: '60 km/h', d3: '65 km/h' },
    { len: 200, sec: 12, ans: '60 km/h', d1: '50 km/h', d2: '65 km/h', d3: '72 km/h' },
    { len: 240, sec: 16, ans: '54 km/h', d1: '48 km/h', d2: '60 km/h', d3: '66 km/h' },
    { len: 300, sec: 15, ans: '72 km/h', d1: '64 km/h', d2: '80 km/h', d3: '85 km/h' },
    { len: 180, sec: 9, ans: '72 km/h', d1: '65 km/h', d2: '78 km/h', d3: '84 km/h' },
    { len: 250, sec: 10, ans: '90 km/h', d1: '80 km/h', d2: '95 km/h', d3: '100 km/h' },
    { len: 360, sec: 18, ans: '72 km/h', d1: '68 km/h', d2: '76 km/h', d3: '80 km/h' },
    { len: 280, sec: 14, ans: '72 km/h', d1: '65 km/h', d2: '78 km/h', d3: '82 km/h' },
    { len: 400, sec: 20, ans: '72 km/h', d1: '60 km/h', d2: '80 km/h', d3: '88 km/h' },
    { len: 350, sec: 14, ans: '90 km/h', d1: '82 km/h', d2: '96 km/h', d3: '102 km/h' },
    { len: 450, sec: 15, ans: '108 km/h', d1: '98 km/h', d2: '112 km/h', d3: '120 km/h' },
    { len: 500, sec: 25, ans: '72 km/h', d1: '65 km/h', d2: '80 km/h', d3: '85 km/h' },
    { len: 320, sec: 16, ans: '72 km/h', d1: '64 km/h', d2: '80 km/h', d3: '84 km/h' },
    { len: 600, sec: 30, ans: '72 km/h', d1: '66 km/h', d2: '78 km/h', d3: '84 km/h' },
    { len: 420, sec: 14, ans: '108 km/h', d1: '95 km/h', d2: '115 km/h', d3: '120 km/h' },
  ];
  trainData.forEach((d) => {
    addQ(
      6,
      'Trains & Streams',
      'Medium',
      `A train ${d.len} meters long crosses a pole in ${d.sec} seconds. What is its speed in km/h?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Speed = (${d.len} / ${d.sec}) * (18/5) = ${d.ans}.`
    );
  });

  // Level 7: Number System & HCF/LCM (30 questions)
  const numData = [
    { p: 105, ans: '7', d1: '9', d2: '3', d3: '1' },
    { p: 106, ans: '9', d1: '7', d2: '3', d3: '1' },
    { p: 107, ans: '3', d1: '7', d2: '9', d3: '1' },
    { p: 108, ans: '1', d1: '7', d2: '9', d3: '3' },
    { p: 201, ans: '7', d1: '1', d2: '9', d3: '3' },
    { p: 202, ans: '9', d1: '7', d2: '3', d3: '1' },
    { p: 203, ans: '3', d1: '9', d2: '7', d3: '1' },
    { p: 204, ans: '1', d1: '3', d2: '7', d3: '9' },
    { p: 301, ans: '7', d1: '3', d2: '1', d3: '9' },
    { p: 302, ans: '9', d1: '1', d2: '7', d3: '3' },
    { p: 303, ans: '3', d1: '7', d2: '9', d3: '1' },
    { p: 304, ans: '1', d1: '9', d2: '3', d3: '7' },
    { p: 405, ans: '7', d1: '1', d2: '3', d3: '9' },
    { p: 406, ans: '9', d1: '7', d2: '1', d3: '3' },
    { p: 407, ans: '3', d1: '9', d2: '7', d3: '1' },
  ];
  numData.forEach((d) => {
    addQ(
      7,
      'Number System',
      'Hard',
      `Find the unit digit of 7^${d.p}.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Powers of 7 cycle in (7, 9, 3, 1). ${d.p} mod 4 gives the index for unit digit ${d.ans}.`
    );
  });

  const hcfData = [
    { hcf: 6, lcm: 180, n1: 30, n2: '36', d1: '32', d2: '40', d3: '42' },
    { hcf: 8, lcm: 240, n1: 40, n2: '48', d1: '42', d2: '54', d3: '56' },
    { hcf: 12, lcm: 360, n1: 60, n2: '72', d1: '68', d2: '76', d3: '80' },
    { hcf: 15, lcm: 450, n1: 75, n2: '90', d1: '85', d2: '95', d3: '100' },
    { hcf: 9, lcm: 270, n1: 45, n2: '54', d1: '48', d2: '58', d3: '62' },
    { hcf: 14, lcm: 420, n1: 70, n2: '84', d1: '78', d2: '88', d3: '92' },
    { hcf: 16, lcm: 480, n1: 80, n2: '96', d1: '88', d2: '102', d3: '108' },
    { hcf: 10, lcm: 300, n1: 50, n2: '60', d1: '55', d2: '65', d3: '70' },
    { hcf: 18, lcm: 540, n1: 90, n2: '108', d1: '98', d2: '114', d3: '120' },
    { hcf: 20, lcm: 600, n1: 100, n2: '120', d1: '110', d2: '130', d3: '140' },
    { hcf: 7, lcm: 210, n1: 35, n2: '42', d1: '38', d2: '46', d3: '49' },
    { hcf: 11, lcm: 330, n1: 55, n2: '66', d1: '60', d2: '72', d3: '77' },
    { hcf: 13, lcm: 390, n1: 65, n2: '78', d1: '72', d2: '84', d3: '91' },
    { hcf: 17, lcm: 510, n1: 85, n2: '102', d1: '95', d2: '110', d3: '119' },
    { hcf: 25, lcm: 750, n1: 125, n2: '150', d1: '140', d2: '160', d3: '175' },
  ];
  hcfData.forEach((d) => {
    addQ(
      7,
      'HCF & LCM',
      'Medium',
      `The HCF of two numbers is ${d.hcf} and their LCM is ${d.lcm}. If one number is ${d.n1}, find the other.`,
      d.n2,
      d.d1,
      d.d2,
      d.d3,
      `Number 2 = (HCF * LCM) / Number 1 = (${d.hcf} * ${d.lcm}) / ${d.n1} = ${d.n2}.`
    );
  });

  // Level 8: Permutations & Probability (30 questions)
  const permData = [
    { n: 5, r: 2, ans: '10', d1: '8', d2: '12', d3: '15' },
    { n: 6, r: 2, ans: '15', d1: '12', d2: '18', d3: '20' },
    { n: 7, r: 2, ans: '21', d1: '18', d2: '24', d3: '28' },
    { n: 8, r: 2, ans: '28', d1: '24', d2: '32', d3: '36' },
    { n: 9, r: 2, ans: '36', d1: '30', d2: '40', d3: '45' },
    { n: 10, r: 2, ans: '45', d1: '40', d2: '50', d3: '55' },
    { n: 5, r: 3, ans: '10', d1: '15', d2: '20', d3: '25' },
    { n: 6, r: 3, ans: '20', d1: '15', d2: '24', d3: '30' },
    { n: 7, r: 3, ans: '35', d1: '28', d2: '42', d3: '48' },
    { n: 8, r: 3, ans: '56', d1: '48', d2: '64', d3: '70' },
    { n: 9, r: 3, ans: '84', d1: '72', d2: '90', d3: '96' },
    { n: 10, r: 3, ans: '120', d1: '100', d2: '135', d3: '150' },
    { n: 6, r: 4, ans: '15', d1: '12', d2: '18', d3: '24' },
    { n: 7, r: 4, ans: '35', d1: '28', d2: '40', d3: '45' },
    { n: 8, r: 4, ans: '70', d1: '60', d2: '80', d3: '90' },
  ];
  permData.forEach((d) => {
    addQ(
      8,
      'Permutations & Combinations',
      'Medium',
      `How many ways can a team of ${d.r} members be chosen from ${d.n} candidates?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `${d.n}C${d.r} = ${d.ans}.`
    );
  });

  const probData = [
    { red: 3, blue: 7, ans: '3/10', d1: '7/10', d2: '3/7', d3: '1/3' },
    { red: 5, blue: 15, ans: '1/4', d1: '1/3', d2: '3/4', d3: '1/5' },
    { red: 4, blue: 6, ans: '2/5', d1: '3/5', d2: '1/2', d3: '4/5' },
    { red: 6, blue: 14, ans: '3/10', d1: '7/10', d2: '2/5', d3: '1/2' },
    { red: 8, blue: 12, ans: '2/5', d1: '3/5', d2: '4/5', d3: '1/2' },
    { red: 7, blue: 21, ans: '1/4', d1: '1/3', d2: '3/4', d3: '1/5' },
    { red: 9, blue: 11, ans: '9/20', d1: '11/20', d2: '1/2', d3: '7/20' },
    { red: 5, blue: 20, ans: '1/5', d1: '4/5', d2: '1/4', d3: '1/6' },
    { red: 10, blue: 15, ans: '2/5', d1: '3/5', d2: '1/3', d3: '4/5' },
    { red: 6, blue: 18, ans: '1/4', d1: '3/4', d2: '1/3', d3: '1/5' },
    { red: 12, blue: 8, ans: '3/5', d1: '2/5', d2: '1/2', d3: '4/5' },
    { red: 14, blue: 6, ans: '7/10', d1: '3/10', d2: '4/5', d3: '1/2' },
    { red: 15, blue: 25, ans: '3/8', d1: '5/8', d2: '1/2', d3: '3/5' },
    { red: 18, blue: 12, ans: '3/5', d1: '2/5', d2: '1/2', d3: '4/5' },
    { red: 16, blue: 24, ans: '2/5', d1: '3/5', d2: '1/2', d3: '3/4' },
  ];
  probData.forEach((d) => {
    addQ(
      8,
      'Probability',
      'Medium',
      `A bag contains ${d.red} red and ${d.blue} blue marbles. What is the probability of picking a red marble at random?`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `P(Red) = ${d.red} / (${d.red} + ${d.blue}) = ${d.ans}.`
    );
  });

  // Level 9: Mensuration & Geometry (30 questions)
  const mensData = [
    { side: 12, ans: '144 sq cm', d1: '120 sq cm', d2: '160 sq cm', d3: '180 sq cm' },
    { side: 15, ans: '225 sq cm', d1: '200 sq cm', d2: '240 sq cm', d3: '250 sq cm' },
    { side: 18, ans: '324 sq cm', d1: '300 sq cm', d2: '340 sq cm', d3: '360 sq cm' },
    { side: 20, ans: '400 sq cm', d1: '380 sq cm', d2: '420 sq cm', d3: '450 sq cm' },
    { side: 25, ans: '625 sq cm', d1: '600 sq cm', d2: '650 sq cm', d3: '675 sq cm' },
    { side: 14, ans: '196 sq cm', d1: '180 sq cm', d2: '210 sq cm', d3: '225 sq cm' },
    { side: 16, ans: '256 sq cm', d1: '240 sq cm', d2: '270 sq cm', d3: '288 sq cm' },
    { side: 22, ans: '484 sq cm', d1: '450 sq cm', d2: '500 sq cm', d3: '520 sq cm' },
    { side: 30, ans: '900 sq cm', d1: '850 sq cm', d2: '950 sq cm', d3: '1000 sq cm' },
    { side: 24, ans: '576 sq cm', d1: '550 sq cm', d2: '600 sq cm', d3: '625 sq cm' },
    { side: 28, ans: '784 sq cm', d1: '750 sq cm', d2: '800 sq cm', d3: '840 sq cm' },
    { side: 35, ans: '1225 sq cm', d1: '1200 sq cm', d2: '1250 sq cm', d3: '1300 sq cm' },
    { side: 40, ans: '1600 sq cm', d1: '1500 sq cm', d2: '1700 sq cm', d3: '1800 sq cm' },
    { side: 32, ans: '1024 sq cm', d1: '1000 sq cm', d2: '1050 sq cm', d3: '1100 sq cm' },
    { side: 50, ans: '2500 sq cm', d1: '2400 sq cm', d2: '2600 sq cm', d3: '2700 sq cm' },
  ];
  mensData.forEach((d) => {
    addQ(
      9,
      'Mensuration',
      'Easy',
      `Find the area of a square with side length ${d.side} cm.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Area = Side^2 = ${d.side}^2 = ${d.ans}.`
    );
  });

  const geomData = [
    { a: 3, b: 4, ans: '5 cm', d1: '6 cm', d2: '7 cm', d3: '8 cm' },
    { a: 5, b: 12, ans: '13 cm', d1: '14 cm', d2: '15 cm', d3: '16 cm' },
    { a: 6, b: 8, ans: '10 cm', d1: '11 cm', d2: '12 cm', d3: '14 cm' },
    { a: 8, b: 15, ans: '17 cm', d1: '16 cm', d2: '18 cm', d3: '19 cm' },
    { a: 7, b: 24, ans: '25 cm', d1: '26 cm', d2: '27 cm', d3: '28 cm' },
    { a: 9, b: 12, ans: '15 cm', d1: '14 cm', d2: '16 cm', d3: '18 cm' },
    { a: 12, b: 16, ans: '20 cm', d1: '18 cm', d2: '22 cm', d3: '24 cm' },
    { a: 15, b: 20, ans: '25 cm', d1: '23 cm', d2: '27 cm', d3: '30 cm' },
    { a: 10, b: 24, ans: '26 cm', d1: '25 cm', d2: '28 cm', d3: '30 cm' },
    { a: 18, b: 24, ans: '30 cm', d1: '28 cm', d2: '32 cm', d3: '36 cm' },
    { a: 20, b: 21, ans: '29 cm', d1: '28 cm', d2: '31 cm', d3: '33 cm' },
    { a: 16, b: 30, ans: '34 cm', d1: '32 cm', d2: '36 cm', d3: '38 cm' },
    { a: 21, b: 28, ans: '35 cm', d1: '33 cm', d2: '37 cm', d3: '40 cm' },
    { a: 24, b: 32, ans: '40 cm', d1: '38 cm', d2: '42 cm', d3: '45 cm' },
    { a: 27, b: 36, ans: '45 cm', d1: '42 cm', d2: '48 cm', d3: '50 cm' },
  ];
  geomData.forEach((d) => {
    addQ(
      9,
      'Geometry',
      'Medium',
      `In a right-angled triangle with perpendicular legs of ${d.a} cm and ${d.b} cm, find the hypotenuse.`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `Hypotenuse = sqrt(${d.a}^2 + ${d.b}^2) = ${d.ans}.`
    );
  });

  // Level 10: Algebra & Data Interpretation (30 questions)
  const algData = [
    { k: 3, ans: '7', d1: '5', d2: '9', d3: '11' },
    { k: 4, ans: '14', d1: '12', d2: '16', d3: '18' },
    { k: 5, ans: '23', d1: '21', d2: '25', d3: '27' },
    { k: 6, ans: '34', d1: '32', d2: '36', d3: '38' },
    { k: 7, ans: '47', d1: '45', d2: '49', d3: '51' },
    { k: 8, ans: '62', d1: '60', d2: '64', d3: '66' },
    { k: 9, ans: '79', d1: '77', d2: '81', d3: '83' },
    { k: 10, ans: '98', d1: '96', d2: '100', d3: '102' },
    { k: 11, ans: '119', d1: '117', d2: '121', d3: '123' },
    { k: 12, ans: '142', d1: '140', d2: '144', d3: '146' },
    { k: 13, ans: '167', d1: '165', d2: '169', d3: '171' },
    { k: 14, ans: '194', d1: '192', d2: '196', d3: '198' },
    { k: 15, ans: '223', d1: '221', d2: '225', d3: '227' },
    { k: 16, ans: '254', d1: '252', d2: '256', d3: '258' },
    { k: 20, ans: '398', d1: '396', d2: '400', d3: '402' },
  ];
  algData.forEach((d) => {
    addQ(
      10,
      'Algebra',
      'Hard',
      `If (x + 1/x) = ${d.k}, evaluate (x^2 + 1/x^2).`,
      d.ans,
      d.d1,
      d.d2,
      d.d3,
      `(x + 1/x)^2 = x^2 + 1/x^2 + 2 => ${d.k}^2 - 2 = ${d.ans}.`
    );
  });

  const diData = [
    { total: 500, pct: 25, dept: 'Design', ans: '125 employees', d1: '100 employees', d2: '150 employees', d3: '175 employees' },
    { total: 800, pct: 15, dept: 'HR', ans: '120 employees', d1: '110 employees', d2: '130 employees', d3: '140 employees' },
    { total: 650, pct: 20, dept: 'Marketing', ans: '130 employees', d1: '120 employees', d2: '140 employees', d3: '150 employees' },
    { total: 1200, pct: 35, dept: 'Engineering', ans: '420 employees', d1: '400 employees', d2: '440 employees', d3: '460 employees' },
    { total: 900, pct: 18, dept: 'Operations', ans: '162 employees', d1: '150 employees', d2: '170 employees', d3: '180 employees' },
    { total: 750, pct: 30, dept: 'Sales', ans: '225 employees', d1: '210 employees', d2: '240 employees', d3: '250 employees' },
    { total: 1500, pct: 12, dept: 'Finance', ans: '180 employees', d1: '165 employees', d2: '195 employees', d3: '200 employees' },
    { total: 400, pct: 45, dept: 'Customer Support', ans: '180 employees', d1: '160 employees', d2: '190 employees', d3: '200 employees' },
    { total: 1100, pct: 22, dept: 'DevOps', ans: '242 employees', d1: '230 employees', d2: '255 employees', d3: '260 employees' },
    { total: 1400, pct: 16, dept: 'Legal', ans: '224 employees', d1: '210 employees', d2: '235 employees', d3: '245 employees' },
    { total: 950, pct: 28, dept: 'Product', ans: '266 employees', d1: '250 employees', d2: '275 employees', d3: '285 employees' },
    { total: 1600, pct: 14, dept: 'Security', ans: '224 employees', d1: '212 employees', d2: '236 employees', d3: '248 employees' },
    { total: 1800, pct: 25, dept: 'Research', ans: '450 employees', d1: '420 employees', d2: '480 employees', d3: '500 employees' },
    { total: 2000, pct: 8, dept: 'Executive', ans: '160 employees', d1: '140 employees', d2: '180 employees', d3: '200 employees' },
    { total: 2500, pct: 15, dept: 'Quality Assurance', ans: '375 employees', d1: '350 employees', d2: '400 employees', d3: '425 employees' },
  ];
  diData.forEach((d) => {
    addQ(
      10,
      'Data Interpretation',
      'Medium',
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
