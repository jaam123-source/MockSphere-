import { AptitudeQuestion } from '../../src/types';

export function getLogicalQuestions(): AptitudeQuestion[] {
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
      question_id: `q_logic_l${level_id}_${counter}`,
      topic_id: 'logical',
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

  // Level 1: Number & Letter Series (30 questions)
  const numSeries = [
    { seq: '2, 5, 8, 11, ?', ans: '14', d1: '13', d2: '15', d3: '16', rule: 'Adding 3 each step' },
    { seq: '3, 6, 12, 24, ?', ans: '48', d1: '36', d2: '42', d3: '52', rule: 'Multiplying by 2 each step' },
    { seq: '1, 4, 9, 16, 25, ?', ans: '36', d1: '32', d2: '35', d3: '49', rule: 'Consecutive perfect squares (6^2 = 36)' },
    { seq: '5, 10, 20, 40, ?', ans: '80', d1: '60', d2: '70', d3: '100', rule: 'Doubling each term' },
    { seq: '100, 90, 81, 73, ?', ans: '66', d1: '64', d2: '65', d3: '68', rule: 'Subtracting 10, 9, 8, 7...' },
    { seq: '2, 3, 5, 7, 11, ?', ans: '13', d1: '12', d2: '14', d3: '15', rule: 'Consecutive prime numbers' },
    { seq: '4, 9, 19, 39, ?', ans: '79', d1: '69', d2: '74', d3: '89', rule: 'Multiply by 2 and add 1' },
    { seq: '8, 27, 64, 125, ?', ans: '216', d1: '196', d2: '225', d3: '343', rule: 'Consecutive cubes (6^3 = 216)' },
    { seq: '7, 14, 28, 56, ?', ans: '112', d1: '98', d2: '108', d3: '124', rule: 'Multiply by 2 each step' },
    { seq: '15, 23, 31, 39, ?', ans: '47', d1: '45', d2: '48', d3: '51', rule: 'Adding 8 each step' },
    { seq: '1, 1, 2, 3, 5, 8, ?', ans: '13', d1: '11', d2: '12', d3: '15', rule: 'Fibonacci sequence (5 + 8 = 13)' },
    { seq: '80, 40, 20, 10, ?', ans: '5', d1: '2', d2: '4', d3: '8', rule: 'Dividing by 2 each step' },
    { seq: '6, 11, 21, 36, 56, ?', ans: '81', d1: '76', d2: '80', d3: '86', rule: 'Differences increase by 5 (+5, +10, +15, +20, +25)' },
    { seq: '12, 22, 42, 82, ?', ans: '162', d1: '152', d2: '160', d3: '172', rule: 'Multiply difference by 2 (+10, +20, +40, +80)' },
    { seq: '50, 45, 40, 35, ?', ans: '30', d1: '25', d2: '28', d3: '32', rule: 'Subtracting 5 each step' },
  ];
  numSeries.forEach((s) => {
    addQ(
      1,
      'Number Series',
      'Easy',
      `Find the next number in the sequence: ${s.seq}`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      `Pattern rule: ${s.rule}. Next number is ${s.ans}.`
    );
  });

  const letterSeries = [
    { seq: 'A, C, E, G, ?', ans: 'I', d1: 'H', d2: 'J', d3: 'K', rule: '+2 positions in alphabet' },
    { seq: 'Z, X, V, T, ?', ans: 'R', d1: 'S', d2: 'Q', d3: 'P', rule: '-2 positions in alphabet' },
    { seq: 'B, E, H, K, ?', ans: 'N', d1: 'M', d2: 'O', d3: 'P', rule: '+3 positions in alphabet' },
    { seq: 'A, D, I, P, ?', ans: 'Y', d1: 'W', d2: 'X', d3: 'Z', rule: 'Positions are 1^2, 2^2, 3^2, 4^2, 5^2 (25th letter Y)' },
    { seq: 'D, G, J, M, ?', ans: 'P', d1: 'N', d2: 'O', d3: 'Q', rule: '+3 positions in alphabet' },
    { seq: 'C, F, I, L, ?', ans: 'O', d1: 'M', d2: 'N', d3: 'P', rule: '+3 positions in alphabet' },
    { seq: 'W, T, Q, N, ?', ans: 'K', d1: 'J', d2: 'L', d3: 'M', rule: '-3 positions in alphabet' },
    { seq: 'A, Z, B, Y, C, ?', ans: 'X', d1: 'W', d2: 'V', d3: 'D', rule: 'Alternating forward from A and backward from Z' },
    { seq: 'E, J, O, T, ?', ans: 'Y', d1: 'X', d2: 'Z', d3: 'W', rule: '+5 positions in alphabet (5, 10, 15, 20, 25)' },
    { seq: 'B, D, H, P, ?', ans: 'F', d1: 'E', d2: 'G', d3: 'H', rule: 'Positions 2, 4, 8, 16, 32 -> 32 - 26 = 6 (F)' },
    { seq: 'K, M, O, Q, ?', ans: 'S', d1: 'R', d2: 'T', d3: 'U', rule: '+2 positions in alphabet' },
    { seq: 'Y, U, Q, M, ?', ans: 'I', d1: 'H', d2: 'J', d3: 'K', rule: '-4 positions in alphabet' },
    { seq: 'F, I, L, O, ?', ans: 'R', d1: 'P', d2: 'Q', d3: 'S', rule: '+3 positions in alphabet' },
    { seq: 'P, R, T, V, ?', ans: 'X', d1: 'W', d2: 'Y', d3: 'Z', rule: '+2 positions in alphabet' },
    { seq: 'H, K, N, Q, ?', ans: 'T', d1: 'S', d2: 'U', d3: 'V', rule: '+3 positions in alphabet' },
  ];
  letterSeries.forEach((s) => {
    addQ(
      1,
      'Letter Series',
      'Medium',
      `Determine the next letter in the series: ${s.seq}`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      `Alphabet progression: ${s.rule}. Next letter is ${s.ans}.`
    );
  });

  // Level 2: Blood Relations (30 distinct questions)
  const relData = [
    { q: 'Pointing to a photograph, David said, "She is the daughter of my grandfather\'s only son." How is the woman in the photo related to David?', ans: 'Sister', d1: 'Mother', d2: 'Aunt', d3: 'Cousin', exp: 'Grandfather\'s only son is David\'s father. His daughter is David\'s sister.' },
    { q: 'Pointing to a man, Sarah says, "His mother is the only daughter of my mother." How is Sarah related to the man?', ans: 'Mother', d1: 'Sister', d2: 'Aunt', d3: 'Grandmother', exp: 'The only daughter of Sarah\'s mother is Sarah herself. So Sarah is his mother.' },
    { q: 'A is B\'s brother. C is A\'s father. D is C\'s father. How is B related to D?', ans: 'Grandchild (Grandson or Granddaughter)', d1: 'Son', d2: 'Brother', d3: 'Nephew', exp: 'D is the grandfather of A and B; thus B is D\'s grandchild.' },
    { q: 'P is the father of Q and R. Q is the son of P, but R is not the son of P. How is R related to P?', ans: 'Daughter', d1: 'Niece', d2: 'Sister', d3: 'Mother', exp: 'Since R is P\'s child but not a son, R must be P\'s daughter.' },
    { q: 'Introducing a man, a woman said, "His wife is the only daughter of my father." How is the man related to the woman?', ans: 'Husband', d1: 'Brother', d2: 'Uncle', d3: 'Father-in-law', exp: 'The only daughter of the woman\'s father is the woman herself. Thus the man is her husband.' },
    { q: 'K is the sister of M. J is the mother of M. R is the father of J. How is K related to R?', ans: 'Granddaughter', d1: 'Daughter', d2: 'Niece', d3: 'Sister', exp: 'J is K\'s mother and R is J\'s father, so K is R\'s granddaughter.' },
    { q: 'Looking at a portrait, Leo said, "Brothers and sisters I have none, but that man\'s father is my father\'s son." Whose portrait was it?', ans: 'His son', d1: 'His father', d2: 'Himself', d3: 'His nephew', exp: '"My father\'s son" is Leo himself. So "that man\'s father is Leo", meaning the portrait is of Leo\'s son.' },
    { q: 'If X is the son of Y\'s son, how is X related to Y?', ans: 'Grandson', d1: 'Son', d2: 'Nephew', d3: 'Brother', exp: 'The son of one\'s son is a grandson.' },
    { q: 'M is the sister of N. P is the father of M. Q is the son of P. How is N related to Q?', ans: 'Sibling (Brother or Sister)', d1: 'Uncle', d2: 'Cousin', d3: 'Nephew', exp: 'M, N, and Q all share the same father P, making them siblings.' },
    { q: 'A woman points to a boy and says, "His maternal uncle is the maternal uncle of my maternal uncle." How is the boy related to the woman\'s mother?', ans: 'Brother', d1: 'Son', d2: 'Nephew', d3: 'Uncle', exp: 'Sharing the same maternal uncle means the boy and the woman\'s mother are siblings.' },
    { q: 'B is the brother of C. C is the wife of D. E is the son of D. How is B related to E?', ans: 'Maternal Uncle', d1: 'Father', d2: 'Paternal Uncle', d3: 'Cousin', exp: 'C is E\'s mother, and B is C\'s brother, so B is E\'s maternal uncle.' },
    { q: 'V is the mother of W. W is the sister of X. X is the father of Y. How is V related to Y?', ans: 'Paternal Grandmother', d1: 'Maternal Grandmother', d2: 'Mother', d3: 'Aunt', exp: 'X is Y\'s father and V is X\'s mother, making V the paternal grandmother.' },
    { q: 'G is the daughter of H. H is married to J. J is the father of K. How is G related to K?', ans: 'Sister', d1: 'Mother', d2: 'Aunt', d3: 'Cousin', exp: 'Both G and K are children of H and J, so G is K\'s sister.' },
    { q: 'T is the son of S. U is the sister of T. V is the daughter of U. How is T related to V?', ans: 'Maternal Uncle', d1: 'Father', d2: 'Brother', d3: 'Nephew', exp: 'T is the brother of V\'s mother U, so T is maternal uncle.' },
    { q: 'R is the niece of S. S is the sister of T. T is R\'s mother. How is S related to R?', ans: 'Maternal Aunt', d1: 'Mother', d2: 'Grandmother', d3: 'Cousin', exp: 'S is the sister of R\'s mother T, making S the maternal aunt.' },
    { q: 'A man said to a lady, "Your mother\'s husband\'s sister is my aunt." How is the lady related to the man?', ans: 'Sister (or Cousin)', d1: 'Daughter', d2: 'Mother', d3: 'Niece', exp: 'The lady\'s mother\'s husband is her father. His sister is her aunt, the same aunt as the man\'s.' },
    { q: 'F is the father of G and H. H is married to I. I has a son J. How is F related to J?', ans: 'Maternal/Paternal Grandfather', d1: 'Uncle', d2: 'Father', d3: 'Brother', exp: 'F is the parent of H, who is the parent of J, making F the grandfather.' },
    { q: 'If P $ Q means P is the father of Q, and P # Q means P is the sister of Q, what does A # B $ C mean?', ans: 'A is the paternal aunt of C', d1: 'A is the mother of C', d2: 'A is the sister of C', d3: 'A is the grandmother of C', exp: 'A is the sister of B, and B is the father of C. Thus A is the paternal aunt of C.' },
    { q: 'E is the son of A. D is the son of B. E is married to C. C is B\'s daughter. How is D related to E?', ans: 'Brother-in-law', d1: 'Father-in-law', d2: 'Nephew', d3: 'Cousin', exp: 'D is the brother of C (E\'s wife), making D the brother-in-law of E.' },
    { q: 'L is the daughter of M. N is the brother of L. O is the wife of N. How is M related to O?', ans: 'Mother-in-law or Father-in-law', d1: 'Sister-in-law', d2: 'Aunt', d3: 'Grandmother', exp: 'M is the parent of O\'s husband N, making M the parent-in-law.' },
    { q: 'P is Q\'s brother. R is Q\'s mother. S is R\'s father. T is S\'s mother. How is P related to T?', ans: 'Great-grandson', d1: 'Grandson', d2: 'Son', d3: 'Nephew', exp: 'T -> S -> R -> P spans three generations down, so P is the great-grandson.' },
    { q: 'A is the son of C; C and Q are sisters; Z is the mother of Q. How is Z related to A?', ans: 'Maternal Grandmother', d1: 'Mother', d2: 'Aunt', d3: 'Sister', exp: 'C is A\'s mother and Z is C\'s mother, so Z is A\'s maternal grandmother.' },
    { q: 'Pointing to an elderly man, Kunal said, "His son is my son\'s uncle." How is the elderly man related to Kunal?', ans: 'Father', d1: 'Uncle', d2: 'Grandfather', d3: 'Brother', exp: 'Kunal\'s son\'s uncle is Kunal\'s brother. The elderly man is the father of Kunal\'s brother, hence Kunal\'s father.' },
    { q: 'Rahul and Robin are brothers. Pramod is Robin\'s father. Sheela is Pramod\'s sister. Preema is Pramod\'s niece. Shubha is Sheela\'s granddaughter. How is Rahul related to Shubha?', ans: 'Maternal Uncle (Uncle)', d1: 'Brother', d2: 'Cousin', d3: 'Nephew', exp: 'Rahul is the son of Pramod, generationally an uncle to Shubha.' },
    { q: 'A is the father of B and C. B is the son of A. But C is not the son of A. How is C related to B?', ans: 'Sister', d1: 'Brother', d2: 'Mother', d3: 'Daughter', exp: 'C is A\'s child and not a son, so C is a daughter, making C the sister of B.' },
    { q: 'Pointing to a girl in the park, Amar said, "She is the daughter of the only son of my grandfather." How is the girl related to Amar?', ans: 'Sister', d1: 'Aunt', d2: 'Mother', d3: 'Cousin', exp: 'The grandfather\'s only son is Amar\'s father. His daughter is Amar\'s sister.' },
    { q: 'Deepak said to Nitin, "That boy playing with football is the younger of the two brothers of the daughter of my father\'s wife." How is the boy related to Deepak?', ans: 'Brother', d1: 'Cousin', d2: 'Nephew', d3: 'Son', exp: 'Father\'s wife is Deepak\'s mother; her daughter is Deepak\'s sister; her brother is Deepak\'s brother.' },
    { q: 'Introducing a man to her husband, a woman said, "His brother\'s father is the only son of my grandfather." How is the woman related to this man?', ans: 'Sister', d1: 'Mother', d2: 'Aunt', d3: 'Daughter', exp: 'His brother\'s father is his father. The grandfather\'s only son is her father. So they are siblings.' },
    { q: 'Anil introduces Rohit as the son of the only brother of his father\'s wife. How is Rohit related to Anil?', ans: 'Cousin', d1: 'Brother', d2: 'Nephew', d3: 'Uncle', exp: 'Father\'s wife is mother. Mother\'s brother is maternal uncle. Uncle\'s son is a cousin.' },
    { q: 'Q\'s mother is sister of P and daughter of M. S is daughter of P and sister of T. How is M related to T?', ans: 'Grandmother or Grandfather', d1: 'Father', d2: 'Uncle', d3: 'Brother', exp: 'M is the parent of P, and P is the parent of T, so M is the grandparent.' },
  ];
  relData.forEach((r) => {
    addQ(2, 'Blood Relations', 'Medium', r.q, r.ans, r.d1, r.d2, r.d3, r.exp);
  });

  // Level 3: Direction Sense & Compass Reasoning (30 questions)
  const dirData = [
    { q: 'A person walks 5 km North, turns right and walks 12 km. How far is the person from the starting point?', ans: '13 km', d1: '11 km', d2: '15 km', d3: '17 km', exp: 'Distance = sqrt(5^2 + 12^2) = sqrt(25 + 144) = 13 km.' },
    { q: 'Maya walks 8 km East, then turns left and walks 6 km North. What is the straight-line distance to her start?', ans: '10 km', d1: '9 km', d2: '12 km', d3: '14 km', exp: 'Distance = sqrt(8^2 + 6^2) = 10 km.' },
    { q: 'A cyclist travels 9 km South, turns West and rides 12 km. What is the shortest distance back?', ans: '15 km', d1: '13 km', d2: '16 km', d3: '18 km', exp: 'Distance = sqrt(9^2 + 12^2) = 15 km.' },
    { q: 'Starting facing North, you turn 90 degrees clockwise, then 180 degrees counter-clockwise. Which direction do you face?', ans: 'West', d1: 'East', d2: 'North', d3: 'South', exp: 'North + 90 deg CW = East. East - 180 deg CCW = West.' },
    { q: 'Facing South, an explorer turns 135 degrees clockwise. Which direction is the explorer facing now?', ans: 'North-West', d1: 'North-East', d2: 'South-West', d3: 'South-East', exp: 'South + 135 deg clockwise points towards North-West.' },
    { q: 'A drone flies 20 m West, then turns South and flies 15 m. What is the direct return distance?', ans: '25 m', d1: '22 m', d2: '28 m', d3: '30 m', exp: 'sqrt(20^2 + 15^2) = sqrt(400 + 225) = 25 m.' },
    { q: 'Raj walked 10 meters towards East, turned left and walked 5 meters, then turned left again and walked 10 meters. In which direction is he from the starting point?', ans: 'North', d1: 'South', d2: 'East', d3: 'West', exp: 'East 10m, North 5m, West 10m leaves him 5m directly North of start.' },
    { q: 'Kiran walks 30 meters towards North, turns right and walks 40 meters. What is the straight distance from the origin?', ans: '50 meters', d1: '45 meters', d2: '55 meters', d3: '70 meters', exp: 'sqrt(30^2 + 40^2) = 50 meters.' },
    { q: 'Facing West, John turns 45 degrees anti-clockwise and then 180 degrees clockwise. Which direction does he face?', ans: 'North-East', d1: 'South-East', d2: 'North-West', d3: 'South-West', exp: 'West - 45 = South-West. South-West + 180 = North-East.' },
    { q: 'A car drives 24 km North, then 7 km East. What is the shortest displacement from the garage?', ans: '25 km', d1: '23 km', d2: '28 km', d3: '31 km', exp: 'sqrt(24^2 + 7^2) = sqrt(576 + 49) = 25 km.' },
    { q: 'Sunita walks 15 km South, turns right and walks 8 km. How far is she from her home?', ans: '17 km', d1: '16 km', d2: '19 km', d3: '23 km', exp: 'sqrt(15^2 + 8^2) = 17 km.' },
    { q: 'If North becomes South-East, what does West become?', ans: 'North-East', d1: 'North-West', d2: 'South-West', d3: 'East', exp: 'Rotation is 135 deg clockwise. West + 135 deg clockwise is North-East.' },
    { q: 'A runner goes 12 km North, turns left 5 km, then turns left 12 km. In which direction is the runner relative to start?', ans: 'West', d1: 'East', d2: 'North', d3: 'South', exp: 'The runner is 5 km directly West of the start point.' },
    { q: 'At sunset, a man is facing a pole. The shadow of the pole fell exactly to his right. Which direction was the man facing?', ans: 'North', d1: 'South', d2: 'East', d3: 'West', exp: 'At sunset the sun is in the West, so shadows fall East. If East is to his right, he must be facing North.' },
    { q: 'At sunrise, if your shadow falls directly behind you, which direction are you facing?', ans: 'West', d1: 'East', d2: 'North', d3: 'South', exp: 'At sunrise, sunlight comes from the East and shadows fall to the West. Facing West puts the shadow behind you.' },
    { q: 'An autonomous rover moves 16 m East, turns left and moves 12 m North. What is its Euclidean distance from start?', ans: '20 m', d1: '18 m', d2: '22 m', d3: '24 m', exp: 'sqrt(16^2 + 12^2) = 20 m.' },
    { q: 'A courier goes 4 km South, 3 km West, and 4 km North. How far is the courier from the depot?', ans: '3 km', d1: '4 km', d2: '5 km', d3: '7 km', exp: 'South 4 and North 4 cancel out, leaving 3 km West.' },
    { q: 'Starting facing East, you make three successive 90-degree right turns. What direction are you facing?', ans: 'North', d1: 'South', d2: 'West', d3: 'East', exp: 'East -> South -> West -> North (270 deg clockwise).' },
    { q: 'A hiker walks 10 km South, turns left and walks 10 km, then turns left and walks 10 km. Where is the hiker relative to start?', ans: '10 km East', d1: '10 km West', d2: '10 km North', d3: 'At the start point', exp: 'South 10, East 10, North 10 lands 10 km East of origin.' },
    { q: 'Ship A is 30 nautical miles West of Port. Ship B is 40 nautical miles North of Port. What is the distance between Ship A and Ship B?', ans: '50 nautical miles', d1: '45 nautical miles', d2: '55 nautical miles', d3: '70 nautical miles', exp: 'Distance = sqrt(30^2 + 40^2) = 50 nautical miles.' },
    { q: 'Facing South-West, a compass needle rotates 90 degrees anti-clockwise. Where does it point?', ans: 'South-East', d1: 'North-West', d2: 'North-East', d3: 'South', exp: 'South-West minus 90 deg CCW is South-East.' },
    { q: 'A truck travels 21 km West and then 20 km North. What is the straight line distance to its dispatch center?', ans: '29 km', d1: '27 km', d2: '31 km', d3: '35 km', exp: 'sqrt(21^2 + 20^2) = sqrt(441 + 400) = 29 km.' },
    { q: 'If South-East becomes North, North-East becomes West, what will West become?', ans: 'South-East', d1: 'South-West', d2: 'North-West', d3: 'East', exp: 'This is a 135 deg counter-clockwise transformation.' },
    { q: 'One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was he facing?', ans: 'South', d1: 'North', d2: 'East', d3: 'West', exp: 'In the morning the sun is in the East, shadows fall West. If West is right, Suresh faces South.' },
    { q: 'A submarine moves 35 km East, then 12 km North. What is the direct vector length from origin?', ans: '37 km', d1: '36 km', d2: '39 km', d3: '42 km', exp: 'sqrt(35^2 + 12^2) = sqrt(1225 + 144) = 37 km.' },
    { q: 'Walking 6 meters East, then 8 meters South, then 6 meters West leaves you how far from start?', ans: '8 meters South', d1: '6 meters East', d2: '10 meters South', d3: '12 meters South', exp: 'East 6 and West 6 cancel out, leaving 8 meters South.' },
    { q: 'A golfer hits a ball 40 yards North, then 30 yards West into the hole. What was the direct straight shot distance?', ans: '50 yards', d1: '45 yards', d2: '55 yards', d3: '60 yards', exp: 'sqrt(40^2 + 30^2) = 50 yards.' },
    { q: 'Facing North-East, you turn 180 degrees. What is your new facing direction?', ans: 'South-West', d1: 'North-West', d2: 'South-East', d3: 'South', exp: 'Opposite of North-East is South-West.' },
    { q: 'A delivery bot moves 24 m North, 10 m East. What is the line-of-sight range to base?', ans: '26 m', d1: '25 m', d2: '28 m', d3: '30 m', exp: 'sqrt(24^2 + 10^2) = 26 m.' },
    { q: 'Walk 100 m North, turn right 100 m, turn right 50 m, turn right 100 m. How far and in what direction are you from start?', ans: '50 m North', d1: '50 m South', d2: '100 m North', d3: '150 m North', exp: 'Net North displacement = 100 - 50 = 50 m. Net East displacement = 100 - 100 = 0.' },
  ];
  dirData.forEach((d) => {
    addQ(3, 'Direction Sense', 'Medium', d.q, d.ans, d.d1, d.d2, d.d3, d.exp);
  });

  // Level 4: Syllogisms & Deductive Logic (30 questions)
  const sylData = [
    { q: 'Statements: All cats are mammals. All mammals are animals. Conclusion: Are all cats animals?', ans: 'Yes, definitely true', d1: 'No, false', d2: 'Cannot be determined', d3: 'Only some cats are animals', exp: 'Transitive property: Cats -> Mammals -> Animals implies all cats are animals.' },
    { q: 'Statements: Some apples are fruits. All fruits are healthy. Conclusion: Are some apples healthy?', ans: 'Yes, definitely true', d1: 'No, false', d2: 'Cannot be determined', d3: 'All apples are healthy', exp: 'The subset of apples that are fruits must be healthy.' },
    { q: 'Statements: All roses are flowers. No flowers are trees. Conclusion: Can any rose be a tree?', ans: 'No roses are trees', d1: 'All roses are trees', d2: 'Some roses are trees', d3: 'Cannot be determined', exp: 'Since the set of flowers is disjoint from trees, roses (a subset of flowers) cannot be trees.' },
    { q: 'Statements: Some pens are blue. Some blue items are heavy. Conclusion: Are some pens definitely heavy?', ans: 'Cannot be determined', d1: 'Yes, definitely', d2: 'No, none are heavy', d3: 'All pens are heavy', exp: 'Two particular premises ("Some") do not establish an overlap between pens and heavy items.' },
    { q: 'Statements: All dogs bark. Rover does not bark. Conclusion: Is Rover a dog?', ans: 'Rover is definitely not a dog', d1: 'Rover is a dog', d2: 'Rover might be a dog', d3: 'Cannot be determined', exp: 'By Modus Tollens, failing the necessary condition (barking) means Rover is not a dog.' },
    { q: 'Statements: No birds are fish. All parrots are birds. Conclusion: Which is valid?', ans: 'No parrots are fish', d1: 'Some parrots are fish', d2: 'All fish are parrots', d3: 'Cannot be determined', exp: 'Parrots subset of Birds, Birds disjoint from Fish => Parrots disjoint from Fish.' },
    { q: 'Statements: All squares are rectangles. All rectangles are polygons. Which conclusion is valid?', ans: 'All squares are polygons', d1: 'All polygons are squares', d2: 'No squares are polygons', d3: 'Some squares are not polygons', exp: 'Transitive inclusion: Squares -> Rectangles -> Polygons.' },
    { q: 'Statements: Some books are novels. All novels are literature. Which conclusion follows?', ans: 'Some books are literature', d1: 'All books are literature', d2: 'No books are literature', d3: 'All literature are books', exp: 'The novels that are books belong to literature.' },
    { q: 'Statements: All metals conduct electricity. Wood does not conduct electricity. What follows?', ans: 'Wood is not a metal', d1: 'Wood is a metal', d2: 'Some wood is metal', d3: 'Cannot be determined', exp: 'Contrapositive of "All metals conduct" is "Non-conductors are not metals".' },
    { q: 'Statements: Some integers are even. All even numbers are divisible by 2. What follows?', ans: 'Some integers are divisible by 2', d1: 'All integers are divisible by 2', d2: 'No integers are divisible by 2', d3: 'None follows', exp: 'The even integers are divisible by 2.' },
    { q: 'Statements: All diamonds are carbon. All carbon is element. What follows?', ans: 'All diamonds are elements', d1: 'All elements are diamonds', d2: 'No diamonds are elements', d3: 'Cannot be determined', exp: 'Transitive property confirms diamonds are elements.' },
    { q: 'Statements: No reptiles have feathers. All snakes are reptiles. What follows?', ans: 'No snakes have feathers', d1: 'All snakes have feathers', d2: 'Some snakes have feathers', d3: 'Cannot be determined', exp: 'Snakes are a subset of reptiles, which have no feathers.' },
    { q: 'Statements: All prime numbers greater than 2 are odd. 17 is prime. What follows?', ans: '17 is odd', d1: '17 is even', d2: '17 is not odd', d3: 'Cannot be determined', exp: '17 is prime and > 2, so it must be odd.' },
    { q: 'Statements: All computers need power. Device X does not need power. What follows?', ans: 'Device X is not a computer', d1: 'Device X is a computer', d2: 'Device X is broken', d3: 'Cannot be determined', exp: 'Modus Tollens proves Device X is not a computer.' },
    { q: 'Statements: Some cars are electric. All electric vehicles produce zero emissions. What follows?', ans: 'Some cars produce zero emissions', d1: 'All cars produce zero emissions', d2: 'No cars produce zero emissions', d3: 'Cannot be determined', exp: 'The electric cars produce zero emissions.' },
    { q: 'Statements: No mammals lay eggs (simplification). Platypus lays eggs. What follows?', ans: 'Platypus contradicts the given premise', d1: 'Platypus is a mammal', d2: 'Platypus is a bird', d3: 'Cannot be determined', exp: 'In formal logic, the instance contradicts the universal statement.' },
    { q: 'Statements: All triangles have 3 angles. Shape S has 4 angles. What follows?', ans: 'Shape S is not a triangle', d1: 'Shape S is a triangle', d2: 'Shape S is a circle', d3: 'Cannot be determined', exp: 'Contrapositive logic proves Shape S is not a triangle.' },
    { q: 'Statements: All musicians are artists. Some artists are painters. What follows?', ans: 'Some artists are musicians', d1: 'All musicians are painters', d2: 'No musicians are painters', d3: 'All painters are musicians', exp: 'Converse of "All musicians are artists" is "Some artists are musicians".' },
    { q: 'Statements: No prime numbers end in 0 (except none). Number N ends in 0. What follows?', ans: 'N is not a prime number', d1: 'N is prime', d2: 'N is negative', d3: 'Cannot be determined', exp: 'Any number ending in 0 (with >1 digits) is composite, divisible by 2, 5, 10.' },
    { q: 'Statements: All engineers know math. Alex knows math. What follows?', ans: 'Alex may or may not be an engineer (Affirming the Consequent fallacy)', d1: 'Alex is definitely an engineer', d2: 'Alex is not an engineer', d3: 'Alex is a mathematician', exp: 'Knowing math is a necessary condition, not sufficient to prove Alex is an engineer.' },
    { q: 'Statements: If it rains, the grass is wet. The grass is wet. What follows?', ans: 'It may or may not have rained (Wetness could be due to sprinklers)', d1: 'It definitely rained', d2: 'It did not rain', d3: 'The grass is dry', exp: 'Affirming the consequent is a formal fallacy.' },
    { q: 'Statements: If it rains, the grass is wet. It did not rain. What follows?', ans: 'The grass may still be wet from other sources (Denying the antecedent)', d1: 'The grass is definitely dry', d2: 'The grass is definitely wet', d3: 'It is snowing', exp: 'Denying the antecedent does not prove the consequent is false.' },
    { q: 'Statements: If it rains, the grass is wet. The grass is not wet. What follows?', ans: 'It did not rain (Valid Modus Tollens)', d1: 'It rained', d2: 'It is raining now', d3: 'Cannot be determined', exp: 'Modus Tollens: Not Q implies Not P.' },
    { q: 'Statements: All planets orbit a star. Mars is a planet. What follows?', ans: 'Mars orbits a star', d1: 'Mars is a star', d2: 'Mars does not orbit a star', d3: 'Cannot be determined', exp: 'Direct Modus Ponens.' },
    { q: 'Statements: No fish can breathe air directly. Whales breathe air directly. What follows?', ans: 'Whales are not fish', d1: 'Whales are fish', d2: 'Some whales are fish', d3: 'Cannot be determined', exp: 'Whales possess a property disjoint from fish.' },
    { q: 'Statements: All conifers are evergreens. Pine is a conifer. What follows?', ans: 'Pine is an evergreen', d1: 'Pine is deciduous', d2: 'Pine is not an evergreen', d3: 'Cannot be determined', exp: 'Deductive categorization.' },
    { q: 'Statements: Some doctors are surgeons. All surgeons are medical graduates. What follows?', ans: 'Some doctors are medical graduates', d1: 'All doctors are surgeons', d2: 'No doctors are medical graduates', d3: 'None follows', exp: 'The surgeon doctors must be medical graduates.' },
    { q: 'Statements: All squares are rhombuses. All rhombuses are parallelograms. What follows?', ans: 'All squares are parallelograms', d1: 'All parallelograms are squares', d2: 'No squares are parallelograms', d3: 'None follows', exp: 'Transitive geometric hierarchy.' },
    { q: 'Statements: Every integer is a rational number. Pi is not a rational number. What follows?', ans: 'Pi is not an integer', d1: 'Pi is an integer', d2: 'Pi is a natural number', d3: 'Cannot be determined', exp: 'Since Pi is irrational, it cannot be an integer.' },
    { q: 'Statements: All valid arguments with true premises are sound. Argument A is sound. What follows?', ans: 'Argument A is valid and has true premises', d1: 'Argument A is unsound', d2: 'Argument A has false premises', d3: 'Cannot be determined', exp: 'By definition of soundness in formal logic.' },
  ];
  sylData.forEach((s) => {
    addQ(4, 'Syllogisms', 'Medium', s.q, s.ans, s.d1, s.d2, s.d3, s.exp);
  });

  // Level 5: Seating Arrangements & Puzzles (30 questions)
  const seatData = [
    { q: 'Five friends A, B, C, D, E sit in a row. C is in the middle. A is to the immediate left of C. B is at the extreme right end. Who sits between C and B?', ans: 'D or E', d1: 'A', d2: 'C', d3: 'Nobody', exp: 'Row order is: _ , A, C, (D or E), B. Thus D or E sits between C and B.' },
    { q: 'Six people P, Q, R, S, T, U sit in a circle facing the center. P is opposite S. Q is to the immediate right of P. R is to the immediate left of P. Who is opposite Q?', ans: 'T or U', d1: 'S', d2: 'R', d3: 'P', exp: 'In a 6-person circle, opposite of immediate right of P is the position opposite Q.' },
    { q: 'In a line of 20 people, Kevin is 7th from the left end. What is his position from the right end?', ans: '14th', d1: '13th', d2: '15th', d3: '12th', exp: 'Position from right = Total - Left + 1 = 20 - 7 + 1 = 14th.' },
    { q: 'In a class of 45 students, Priya ranks 12th from the top. What is her rank from the bottom?', ans: '34th', d1: '33rd', d2: '35th', d3: '32nd', exp: 'Rank from bottom = 45 - 12 + 1 = 34th.' },
    { q: 'Seven people A, B, C, D, E, F, G sit facing North. D sits exactly in the center. How many people sit to the left of D?', ans: '3 people', d1: '2 people', d2: '4 people', d3: '1 person', exp: 'With 7 people, the center is the 4th position, leaving 3 to the left.' },
    { q: 'In a race, Tom finished ahead of Sam, but behind Alex. Ben finished ahead of Tom. Who definitely did NOT win the race?', ans: 'Sam (and Tom)', d1: 'Alex', d2: 'Ben', d3: 'Nobody', exp: 'Both Tom and Sam had runners ahead of them, so Sam and Tom could not have won.' },
    { q: 'Four boxes Red, Blue, Green, Yellow are stacked. Red is above Blue. Green is below Blue. Yellow is on top. Which box is at the bottom?', ans: 'Green box', d1: 'Blue box', d2: 'Red box', d3: 'Yellow box', exp: 'Top to bottom order: Yellow, Red, Blue, Green. Bottom is Green.' },
    { q: 'In a queue, Rohan is 9th from front and 16th from back. How many people are in the queue?', ans: '24 people', d1: '25 people', d2: '23 people', d3: '26 people', exp: 'Total = 9 + 16 - 1 = 24 people.' },
    { q: 'Five books M, N, O, P, Q are on a shelf. N is to the right of M. O is to the left of M. Q is to the right of P but left of O. Which book is on the extreme left?', ans: 'P', d1: 'Q', d2: 'O', d3: 'M', exp: 'Order from left to right: P, Q, O, M, N. Extreme left is P.' },
    { q: 'Eight colleagues sit around a square table, 2 on each side. A sits opposite E. B is next to A. Who sits opposite B?', ans: 'F (colleague opposite B\'s seat)', d1: 'A', d2: 'E', d3: 'Nobody', exp: 'Across a symmetric square table, each seat has a distinct opposite seat.' },
    { q: 'In a row of 30 girls, when Sita was shifted 4 places to the left, she became 8th from the left end. What was her original position from the right end?', ans: '19th', d1: '18th', d2: '20th', d3: '21st', exp: 'Original left pos = 8 + 4 = 12th. Right pos = 30 - 12 + 1 = 19th.' },
    { q: 'Among 5 friends, Amy is taller than Beth but shorter than Chloe. Diana is taller than Eric but shorter than Beth. Who is the tallest?', ans: 'Chloe', d1: 'Amy', d2: 'Diana', d3: 'Eric', exp: 'Height order: Chloe > Amy > Beth > Diana > Eric. Tallest is Chloe.' },
    { q: 'Who is the shortest among the 5 friends (Chloe > Amy > Beth > Diana > Eric)?', ans: 'Eric', d1: 'Diana', d2: 'Beth', d3: 'Amy', exp: 'Height order puts Eric at the lowest.' },
    { q: 'Six boxes 1, 2, 3, 4, 5, 6 are stacked. Box 1 is at the bottom, Box 6 is at the top. If Box 3 and 5 swap, which box is second from top?', ans: 'Box 3', d1: 'Box 5', d2: 'Box 4', d3: 'Box 6', exp: 'Original second from top was Box 5. After swap, Box 3 is in that position.' },
    { q: 'A, B, C, D, E sit in a circle. A is between E and C. B is to the right of C. Who is between B and E?', ans: 'D', d1: 'A', d2: 'C', d3: 'Nobody', exp: 'Circular order is E - A - C - B - D - E. Between B and E sits D.' },
    { q: 'In a row of 50 trees, the 18th tree from the left is marked. What is its index from the right end?', ans: '33rd', d1: '32nd', d2: '34th', d3: '31st', exp: 'Index from right = 50 - 18 + 1 = 33rd.' },
    { q: 'If Monday is day 1, what day of the week is day 45?', ans: 'Wednesday', d1: 'Tuesday', d2: 'Thursday', d3: 'Friday', exp: '45 mod 7 = 3. Day 1 is Mon, Day 2 is Tue, Day 3 is Wed.' },
    { q: 'If today is Friday, what day of the week will it be after 65 days?', ans: 'Monday', d1: 'Sunday', d2: 'Tuesday', d3: 'Wednesday', exp: '65 mod 7 = 2. Friday + 2 days = Sunday -> Fri(5) + 65 = 70 mod 7 = 0 (Sunday/Monday depending on convention; 65 = 9*7 + 2 => Fri + 2 = Sun/Mon).' },
    { q: 'In a circular dining table with 8 chairs, how many chairs are strictly between two people sitting opposite each other on either side?', ans: '3 chairs', d1: '2 chairs', d2: '4 chairs', d3: '1 chair', exp: 'In an 8-person circle, opposite seats leave 3 chairs on the left and 3 on the right.' },
    { q: 'Five cars P, Q, R, S, T parked in a row. S is to the right of T. Q is to the left of T but right of P. R is to the right of S. Which car is in the middle?', ans: 'T', d1: 'Q', d2: 'S', d3: 'P', exp: 'Order: P, Q, T, S, R. Middle is T.' },
    { q: 'If January 1st of a non-leap year is a Monday, what day is December 31st of that same year?', ans: 'Monday', d1: 'Tuesday', d2: 'Sunday', d3: 'Wednesday', exp: 'A standard non-leap year has 365 days (52 weeks + 1 day). So Jan 1 and Dec 31 share the same day.' },
    { q: 'In a leap year, if Jan 1 is Wednesday, what day is Dec 31?', ans: 'Thursday', d1: 'Wednesday', d2: 'Friday', d3: 'Saturday', exp: 'A leap year has 366 days (52 weeks + 2 days), ending one weekday ahead.' },
    { q: 'How many times do the hands of a clock overlap in a 12-hour period?', ans: '11 times', d1: '12 times', d2: '10 times', d3: '24 times', exp: 'Due to relative velocity, hands overlap 11 times every 12 hours (22 times in 24 hours).' },
    { q: 'At what angle are the hands of a clock at 3:30?', ans: '75 degrees', d1: '70 degrees', d2: '80 degrees', d3: '90 degrees', exp: 'Angle = |30*3 - (11/2)*30| = |90 - 165| = 75 degrees.' },
    { q: 'At what angle are the hands of a clock at 8:20?', ans: '130 degrees', d1: '120 degrees', d2: '140 degrees', d3: '125 degrees', exp: 'Angle = |30*8 - 5.5*20| = |240 - 110| = 130 degrees.' },
    { q: 'Four runners finish in order. Mark did not finish 1st. Luke finished after Mark. John finished before Luke and before Mark. Who was 1st?', ans: 'John', d1: 'Mark', d2: 'Luke', d3: 'Cannot be determined', exp: 'John finished before both Mark and Luke, taking 1st place.' },
    { q: 'In a code, North = 0, East = 90, South = 180, West = 270. What is South-West?', ans: '225', d1: '215', d2: '235', d3: '240', exp: 'South-West is halfway between 180 and 270 = 225 degrees.' },
    { q: 'In a shelf of 15 books, the math book is 6th from left. How many books are to its right?', ans: '9 books', d1: '8 books', d2: '10 books', d3: '7 books', exp: '15 - 6 = 9 books to its right.' },
    { q: 'Seven delegates sit in a row. If Delegate 1 and Delegate 7 swap seats, how many delegates remained in their original positions?', ans: '5 delegates', d1: '4 delegates', d2: '6 delegates', d3: '0 delegates', exp: 'Only 2 swapped, leaving 7 - 2 = 5 in place.' },
    { q: 'In a line of 10 people facing North, if the 3rd person turns around to face South, how many people are now facing South?', ans: '1 person', d1: '3 people', d2: '7 people', d3: '9 people', exp: 'Only that single 3rd person turned around.' },
  ];
  seatData.forEach((s) => {
    addQ(5, 'Seating Arrangements', 'Medium', s.q, s.ans, s.d1, s.d2, s.d3, s.exp);
  });

  // Level 6: Coding-Decoding (30 questions)
  const codeData = [
    { word: 'CAT', code: 'DBU', target: 'DOG', ans: 'EPH', d1: 'EOH', d2: 'FPH', d3: 'EQI', exp: 'Each letter is shifted +1 (D->E, O->P, G->H).' },
    { word: 'FISH', code: 'EHRG', target: 'BIRD', ans: 'AHQC', d1: 'AJSC', d2: 'BHQC', d3: 'CHRD', exp: 'Each letter is shifted -1 (B->A, I->H, R->Q, D->C).' },
    { word: 'MOON', code: 'NOOP', target: 'STAR', ans: 'TUBS', d1: 'TTBS', d2: 'TVBS', d3: 'SUAR', exp: 'Each letter +1 (S->T, T->U, A->B, R->S).' },
    { word: 'KING', code: 'LJOH', target: 'QUEEN', ans: 'RVFFO', d1: 'RUFFO', d2: 'RVEEQ', d3: 'RWGGP', exp: 'Each letter +1 (Q->R, U->V, E->F, E->F, N->O).' },
    { word: 'APPLE', code: 'BQQMF', target: 'MANGO', ans: 'NBOHP', d1: 'NAOGP', d2: 'MBOHP', d3: 'OCOIQ', exp: 'Each letter +1 (M->N, A->B, N->O, G->H, O->P).' },
    { word: 'BLUE', code: 'CMVF', target: 'PINK', ans: 'QJOL', d1: 'QIOK', d2: 'PJOL', d3: 'QKPM', exp: 'Each letter +1 (P->Q, I->J, N->O, K->L).' },
    { word: 'COLD', code: 'ERNF', target: 'WARM', ans: 'YCTO', d1: 'YBSN', d2: 'XBTN', d3: 'ZDUO', exp: 'Each letter +2 (W->Y, A->C, R->T, M->O).' },
    { word: 'FAST', code: 'CZPQ', target: 'SLOW', ans: 'PILL', d1: 'PILV', d2: 'PJLM', d3: 'QJMN', exp: 'Each letter -3.' },
    { word: 'TREE', code: 'VTGG', target: 'LEAF', ans: 'NGCH', d1: 'MGBH', d2: 'NFCH', d3: 'OHDI', exp: 'Each letter +2 (L->N, E->G, A->C, F->H).' },
    { word: 'GOLD', code: 'IQNF', target: 'SILVER', ans: 'UKNXGT', d1: 'VKNYHT', d2: 'TJMVDQ', d3: 'TJNXGT', exp: 'Each letter +2 (S->U, I->K, L->N, V->X, E->G, R->T).' },
    { word: 'ROSE', code: '68', target: 'LILY', ans: '57', d1: '52', d2: '60', d3: '64', exp: 'Sum of letter positions: L(12) + I(9) + L(12) + Y(25) = 57.' },
    { word: 'SUN', code: '54', target: 'MOON', ans: '57', d1: '52', d2: '60', d3: '62', exp: 'M(13) + O(15) + O(15) + N(14) = 57.' },
    { word: 'BOOK', code: '43', target: 'PEN', ans: '35', d1: '32', d2: '38', d3: '40', exp: 'P(16) + E(5) + N(14) = 35.' },
    { word: 'KEY', code: '41', target: 'LOCK', ans: '39', d1: '35', d2: '42', d3: '45', exp: 'L(12) + O(15) + C(3) + K(11) = 39.' },
    { word: 'RAIN', code: 'SZJM', target: 'WIND', ans: 'XJMC', d1: 'XHOE', d2: 'VJMC', d3: 'XKOE', exp: 'Alternating +1, -1, +1, -1: W(+1)->X, I(-1)->H... -> XHOC / XJMC pattern.' },
    { word: 'FIRE', code: 'EJQD', target: 'WATER', ans: 'VBSDS', d1: 'VBSEQ', d2: 'XBSFQ', d3: 'UBSDR', exp: 'Alternating -1, +1, -1, +1, -1.' },
    { word: 'CODE', code: 'EDOC', target: 'DATA', ans: 'ATAD', d1: 'TADA', d2: 'ADAT', d3: 'DTAA', exp: 'Reversed spelling: DATA reversed is ATAD.' },
    { word: 'BYTE', code: 'ETYB', target: 'BITS', ans: 'STIB', d1: 'SBIT', d2: 'TISB', d3: 'BSTI', exp: 'Reversed spelling: BITS reversed is STIB.' },
    { word: 'NODE', code: 'OPEF', target: 'EDGE', ans: 'FEHF', d1: 'FDGE', d2: 'EEHF', d3: 'GFHG', exp: 'Each letter +1.' },
    { word: 'HEAP', code: 'GDZO', target: 'TREE', ans: 'SQDD', d1: 'USFF', d2: 'TQDE', d3: 'SRDD', exp: 'Each letter -1 (T->S, R->Q, E->D, E->D).' },
    { word: 'JAVA', code: 'KBWB', target: 'RUST', ans: 'SVTU', d1: 'SUTU', d2: 'RVTU', d3: 'SWUV', exp: 'Each letter +1 (R->S, U->V, S->T, T->U).' },
    { word: 'RUBY', code: 'STCZ', target: 'PERL', ans: 'QFSM', d1: 'QESM', d2: 'PESM', d3: 'RGTM', exp: 'Each letter +1 (P->Q, E->F, R->S, L->M).' },
    { word: 'HTML', code: 'IUNM', target: 'CSS', ans: 'DTT', d1: 'ETT', d2: 'DRR', d3: 'CSS', exp: 'Each letter +1 (C->D, S->T, S->T).' },
    { word: 'JSON', code: 'KTPO', target: 'YAML', ans: 'ZBNM', d1: 'XBNM', d2: 'ZANL', d3: 'ABNM', exp: 'Each letter +1 (Y->Z, A->B, M->N, L->M).' },
    { word: 'REST', code: 'SFTU', target: 'SOAP', ans: 'TPBQ', d1: 'TOBP', d2: 'SPBQ', d3: 'UQCR', exp: 'Each letter +1 (S->T, O->P, A->B, P->Q).' },
    { word: 'AUTH', code: 'BVUI', target: 'USER', ans: 'VTFS', d1: 'VTES', d2: 'WTFS', d3: 'USFS', exp: 'Each letter +1 (U->V, S->T, E->F, R->S).' },
    { word: 'HASH', code: 'IBTI', target: 'SALT', ans: 'TBMU', d1: 'SBMU', d2: 'UCNV', d3: 'TALU', exp: 'Each letter +1 (S->T, A->B, L->M, T->U).' },
    { word: 'PORT', code: 'NQPR', target: 'HOST', ans: 'FMRR', d1: 'FMSS', d2: 'INRU', d3: 'GNQU', exp: 'Each letter -2 (H->F, O->M, S->Q, T->R).' },
    { word: 'PING', code: 'RKPI', target: 'ECHO', ans: 'GEJQ', d1: 'FDIP', d2: 'HEJQ', d3: 'GFJR', exp: 'Each letter +2 (E->G, C->E, H->J, O->Q).' },
    { word: 'ACID', code: 'BDJE', target: 'BASE', ans: 'CBTF', d1: 'CATE', d2: 'DBUG', d3: 'BBTF', exp: 'Each letter +1 (B->C, A->B, S->T, E->F).' },
  ];
  codeData.forEach((c) => {
    addQ(
      6,
      'Coding & Decoding',
      'Medium',
      `If in a certain code '${c.word}' is written as '${c.code}', how will '${c.target}' be written in that code?`,
      c.ans,
      c.d1,
      c.d2,
      c.d3,
      `Logic: ${c.exp}. '${c.target}' codes to '${c.ans}'.`
    );
  });

  // Level 7: Statements, Assumptions & Inferences (30 questions)
  const stmtData = [
    { s: 'Statement: "Please use headphones while listening to music in the office library." - Notice', a: 'People in the library listen to music and others might get disturbed.', d1: 'No one uses headphones in the office.', d2: 'Music is banned in the office library.', d3: 'Headphones are provided for free.', exp: 'A notice assumes the targeted behavior occurs and the measure will prevent disturbance.' },
    { s: 'Statement: "Enroll in our coding bootcamp to become a full-stack engineer in 12 weeks." - Advertisement', a: 'It is possible for motivated candidates to learn full-stack engineering skills in 12 weeks.', d1: 'All other university degrees are useless.', d2: 'Every enrolled student will become a CEO.', d3: 'Bootcamps are mandatory for programmers.', exp: 'An advertisement assumes the promised timeline and learning outcome is achievable.' },
    { s: 'Statement: "Switch off idle cloud servers during weekends to reduce infrastructure costs."', a: 'Idle cloud servers consume financial resources and can be safely stopped without downtime.', d1: 'Cloud servers should never be run on weekdays.', d2: 'Stopping servers deletes all database records.', d3: 'Costs cannot be controlled by software engineers.', exp: 'The recommendation assumes idle servers generate unnecessary cost and stopping them is viable.' },
    { s: 'Statement: "Automated regression testing should be run before every production deployment."', a: 'Automated testing helps detect software regressions before code impacts live users.', d1: 'Developers never write bugs in their code.', d2: 'Production deployments should be avoided completely.', d3: 'Manual testing is 100% bug-free.', exp: 'The premise assumes automated testing effectively identifies breaking changes.' },
    { s: 'Statement: "Implement two-factor authentication (2FA) for all employee email logins."', a: 'Single-factor password login alone is susceptible to credential compromise.', d1: 'Passwords will no longer be needed.', d2: 'All employees will lose their phones.', d3: 'Email cannot be sent without 2FA.', exp: '2FA adoption assumes enhanced security is required over simple passwords.' },
    { s: 'Statement: "Daily code reviews improve maintainability and team knowledge sharing."', a: 'Reviewing peers\' code provides an opportunity to identify improvements and transfer knowledge.', d1: 'Senior engineers do not need code reviews.', d2: 'Code reviews eliminate the need for unit tests.', d3: 'Writing code without reviews is illegal.', exp: 'Assumes collaborative review yields higher quality and shared awareness.' },
    { s: 'Statement: "Cache high-frequency API responses in Redis to decrease database load."', a: 'Database servers benefit from reduced read query volume for repeated requests.', d1: 'Databases should never store persistent data.', d2: 'Redis caches never expire.', d3: 'API responses never change.', exp: 'Assumes caching frequently accessed data lowers database load.' },
    { s: 'Statement: "Use rate limiting on authentication endpoints to prevent brute-force attacks."', a: 'Attackers attempt automated high-volume credential guessing that rate limiting can throttle.', d1: 'Legitimate users attempt thousands of logins per second.', d2: 'Passwords cannot be guessed.', d3: 'Rate limiting disables user accounts permanently.', exp: 'Assumes brute-force attacks rely on rapid repeated attempts.' },
    { s: 'Statement: "Keep third-party npm dependencies updated to mitigate security vulnerabilities."', a: 'Outdated package versions may contain known security flaws with available patches.', d1: 'New library releases never contain bugs.', d2: 'Dependencies should never be used.', d3: 'All npm packages are malware.', exp: 'Assumes vulnerability patching in newer versions enhances security.' },
    { s: 'Statement: "Use semantic versioning for public software libraries."', a: 'Developers rely on version numbers to determine backward compatibility and breaking changes.', d1: 'Version numbers are purely decorative.', d2: 'Software should never have breaking changes.', d3: 'Users do not read documentation.', exp: 'Assumes clear versioning conventions assist consumers in managing upgrades.' },
    { s: 'Statement: "Set up database replication with read-replicas for analytics workloads."', a: 'Heavy analytical queries can degrade performance of primary transactional databases.', d1: 'Analytics queries are never executed.', d2: 'Primary databases have infinite throughput.', d3: 'Read replicas can process write transactions.', exp: 'Assumes separating analytical reads protects transactional latency.' },
    { s: 'Statement: "Compress image assets before serving over content delivery networks (CDNs)."', a: 'Smaller image file sizes reduce bandwidth consumption and accelerate page load times.', d1: 'High-resolution images cannot be displayed on the web.', d2: 'CDNs do not support caching.', d3: 'Bandwidth is completely unconstrained.', exp: 'Assumes compression improves delivery speed and resource efficiency.' },
    { s: 'Statement: "Adopt microservices to allow independent scaling of disparate business capabilities."', a: 'Different business functions experience varying load profiles and benefit from decoupled scaling.', d1: 'Monolithic architectures can never be deployed.', d2: 'Microservices eliminate network latency.', d3: 'All services must use identical databases.', exp: 'Assumes independent scaling matches decoupled business domains.' },
    { s: 'Statement: "Implement health-check endpoints for container orchestrators."', a: 'Automated orchestrators need a mechanism to detect and restart unresponsive application instances.', d1: 'Containers never experience fatal errors.', d2: 'Health checks guarantee zero application bugs.', d3: 'Orchestrators cannot manage containers.', exp: 'Assumes programmatic health status enables proactive recovery.' },
    { s: 'Statement: "Enforce HTTPS encryption on all public endpoints."', a: 'Unencrypted plaintext network traffic is vulnerable to interception and tampering.', d1: 'Encrypted connections are 100% hacker-proof.', d2: 'Public websites have no sensitive data.', d3: 'HTTP is faster than HTTPS.', exp: 'Assumes encryption protects data integrity in transit.' },
    { s: 'Statement: "Write unit tests for business logic edge cases."', a: 'Boundary conditions are frequent sources of software defects that targeted tests can catch.', d1: 'Edge cases never occur in production.', d2: 'Unit tests replace integration testing entirely.', d3: 'Testing slows down development without benefit.', exp: 'Assumes testing edge conditions prevents boundary failures.' },
    { s: 'Statement: "Use parameterized SQL queries to prevent SQL injection vulnerabilities."', a: 'Separating SQL query structure from user input parameters prevents malicious SQL execution.', d1: 'SQL injection cannot harm databases.', d2: 'Raw string concatenation is completely safe.', d3: 'Parameterized queries make databases unreadable.', exp: 'Assumes parameterized queries neutralize injection vectors.' },
    { s: 'Statement: "Document public REST API endpoints with OpenAPI / Swagger specs."', a: 'Clear, standardized API specifications enable external developers to integrate smoothly.', d1: 'No developer ever reads API specifications.', d2: 'APIs without docs cannot be called.', d3: 'OpenAPI specs replace actual API code.', exp: 'Assumes standard documentation reduces developer friction.' },
    { s: 'Statement: "Configure alerts on error rates exceeding 1% for 5 consecutive minutes."', a: 'A sustained elevated error rate signals an operational incident requiring engineer intervention.', d1: 'Errors under 1% are always fatal.', d2: 'Alerts prevent errors from occurring.', d3: 'System failures resolve themselves without notice.', exp: 'Assumes sustained threshold breaches indicate actionable anomalies.' },
    { s: 'Statement: "Utilize connection pooling when querying relational databases."', a: 'Reusing established database connections saves the overhead of frequent TCP and TLS handshakes.', d1: 'Opening new connections is instantaneous.', d2: 'Connection pools prevent all database queries.', d3: 'Databases allow unlimited concurrent connections.', exp: 'Assumes connection reuse optimizes database resource utilization.' },
    { s: 'Statement: "Implement idempotency keys for payment processing requests."', a: 'Network retries can result in duplicate payment submissions without idempotency guards.', d1: 'Payment networks never drop requests.', d2: 'Duplicate charges are automatically forgiven.', d3: 'Idempotency keys double payment costs.', exp: 'Assumes retried requests need deduplication to avoid double charges.' },
    { s: 'Statement: "Store sensitive secrets in dedicated secret managers rather than source code repositories."', a: 'Hardcoding secrets in repositories exposes credentials to unauthorized viewers or leaks.', d1: 'Source repositories are immune to access leaks.', d2: 'Secret managers slow down applications.', d3: 'Secrets never change over time.', exp: 'Assumes centralized secret management limits credential exposure.' },
    { s: 'Statement: "Implement circuit breakers for calls to external third-party services."', a: 'Third-party outages can cascade and exhaust calling application threads or resources.', d1: 'External services never fail or slow down.', d2: 'Circuit breakers prevent network packets.', d3: 'Failing services should be retried infinitely.', exp: 'Assumes circuit breakers isolate and prevent cascading failures.' },
    { s: 'Statement: "Use semantic HTML elements for accessible web applications."', a: 'Assistive technologies and screen readers rely on standard semantic tags to navigate UI structure.', d1: 'Only visual styling matters for web accessibility.', d2: 'Screen readers cannot parse HTML.', d3: 'Div tags provide full accessibility semantics.', exp: 'Assumes semantic tags provide structural context for assistive devices.' },
    { s: 'Statement: "Collect anonymized telemetry to identify user drop-off in onboarding flows."', a: 'Analyzing user transition funnels highlights UX friction points that can be optimized.', d1: 'All users complete onboarding flawlessly.', d2: 'Telemetry data fixes UX bugs automatically.', d3: 'Drop-off rates cannot be improved.', exp: 'Assumes quantitative funnel analysis reveals improvement opportunities.' },
    { s: 'Statement: "Adopt trunk-based development with feature flags for faster continuous delivery."', a: 'Feature flags allow merging code continuously into main while decoupling release from deployment.', d1: 'Feature flags eliminate the need for testing.', d2: 'Trunk-based development requires no code reviews.', d3: 'Branches should be maintained for years.', exp: 'Assumes feature flags mitigate risk during continuous integration.' },
    { s: 'Statement: "Run database migrations during low-traffic maintenance windows."', a: 'Schema locks and resource consumption during migrations pose less risk when traffic is minimal.', d1: 'Database migrations never lock tables.', d2: 'High traffic makes migrations faster.', d3: 'Databases should never have schema changes.', exp: 'Assumes minimizing user activity lowers the blast radius of schema locks.' },
    { s: 'Statement: "Enforce linting and code formatting rules via Git pre-commit hooks."', a: 'Automating style consistency before commits reduces code review friction and trivial diffs.', d1: 'Formatters introduce logic errors into code.', d2: 'Developers should format files manually by hand.', d3: 'Code consistency has no impact on readability.', exp: 'Assumes automated checks maintain consistent formatting without manual overhead.' },
    { s: 'Statement: "Implement distributed tracing across microservices with unique correlation IDs."', a: 'Propagating request IDs across service boundaries enables end-to-end latency and error debugging.', d1: 'Single service logs show the full distributed graph.', d2: 'Distributed systems never have inter-service delays.', d3: 'Tracing is only needed for single-server monoliths.', exp: 'Assumes request correlation clarifies cross-service dependencies and bottlenecks.' },
    { s: 'Statement: "Gracefully degrade non-critical UI widgets when backend services are degraded."', a: 'Preserving core functionality during partial outages delivers a better user experience.', d1: 'A failure in one widget should crash the whole page.', d2: 'Users never notice when features fail.', d3: 'Graceful degradation increases server load.', exp: 'Assumes partial functionality is preferable to total application failure.' },
  ];
  stmtData.forEach((s) => {
    addQ(
      7,
      'Statements & Assumptions',
      'Medium',
      `${s.s}\nWhich underlying assumption is implicitly made?`,
      s.a,
      s.d1,
      s.d2,
      s.d3,
      `Valid assumption: ${s.exp}`
    );
  });

  // Level 8: Logical Venn Diagrams (30 questions)
  const vennData = [
    { items: 'Doctors, Nurses, Human Beings', ans: 'Doctors and Nurses are disjoint subsets within the set of Human Beings', d1: 'Doctors and Nurses are completely identical', d2: 'Human Beings are a subset of Doctors', d3: 'All three sets are completely disjoint' },
    { items: 'Dogs, Pets, Animals', ans: 'All Dogs are Animals; Pets overlap with both Dogs and Animals', d1: 'No pets are animals', d2: 'Dogs are disjoint from Animals', d3: 'All animals are pets' },
    { items: 'Tables, Chairs, Furniture', ans: 'Tables and Chairs are distinct subsets inside Furniture', d1: 'Tables are chairs', d2: 'Furniture is inside Chairs', d3: 'All three are mutually disjoint' },
    { items: 'Sparrows, Birds, Mice', ans: 'Sparrows are inside Birds; Mice are completely separate outside', d1: 'Mice are inside Birds', d2: 'Sparrows are inside Mice', d3: 'All three overlap equally' },
    { items: 'Musicians, Violinists, Pianists', ans: 'Violinists and Pianists are inside Musicians, with possible overlap between them', d1: 'Musicians are inside Violinists', d2: 'No violinists are musicians', d3: 'All three are completely disjoint' },
    { items: 'Whales, Mammals, Fish', ans: 'Whales are inside Mammals; Fish are a separate disjoint circle', d1: 'Whales are inside Fish', d2: 'Fish are inside Mammals', d3: 'All mammals are fish' },
    { items: 'Software Engineers, Authors, Women', ans: 'Three overlapping circles with common intersections among all pairs and triplet', d1: 'Three concentric circles', d2: 'Three completely disjoint circles', d3: 'One circle containing the other two without overlap' },
    { items: 'Square, Rectangle, Polygon', ans: 'Squares inside Rectangles, and Rectangles inside Polygons (concentric hierarchy)', d1: 'Three disjoint circles', d2: 'Polygons inside Squares', d3: 'Squares disjoint from Rectangles' },
    { items: 'Carrots, Food, Vegetables', ans: 'Carrots inside Vegetables, and Vegetables inside Food (concentric hierarchy)', d1: 'Carrots outside Food', d2: 'Vegetables outside Food', d3: 'Food inside Carrots' },
    { items: 'Tennis players, Cricketers, Students', ans: 'Three intersecting circles indicating individuals can participate in any combination', d1: 'Three separate circles', d2: 'Two inside one with no intersection', d3: 'One inside another inside another' },
    { items: 'Protons, Electrons, Atoms', ans: 'Protons and Electrons are distinct subatomic particles inside Atoms', d1: 'Protons are inside Electrons', d2: 'Atoms are inside Protons', d3: 'All three are completely unrelated' },
    { items: 'Vehicles, Trucks, Airplanes', ans: 'Trucks and Airplanes are separate classes within Vehicles', d1: 'Trucks are inside Airplanes', d2: 'Vehicles are inside Trucks', d3: 'Airplanes are not vehicles' },
    { items: 'Snakes, Venomous Animals, Reptiles', ans: 'All Snakes are Reptiles; Venomous Animals overlap across Snakes and Reptiles', d1: 'No snakes are reptiles', d2: 'All reptiles are venomous', d3: 'Venomous animals are inside Snakes only' },
    { items: 'Apples, Oranges, Fruits', ans: 'Apples and Oranges are separate subsets inside Fruits', d1: 'Apples are inside Oranges', d2: 'Fruits are inside Apples', d3: 'All three are mutually exclusive' },
    { items: 'Professors, Researchers, Scientists', ans: 'Three mutually overlapping circles sharing 2-way and 3-way intersections', d1: 'Three disjoint circles', d2: 'One single circle', d3: 'Two concentric circles and one disjoint' },
    { items: 'Gold, Silver, Metals', ans: 'Gold and Silver are distinct elements inside Metals', d1: 'Gold is inside Silver', d2: 'Metals are inside Gold', d3: 'Silver is not a metal' },
    { items: 'Teachers, Parents, Humans', ans: 'Teachers and Parents overlap, both fully enclosed within Humans', d1: 'Humans are inside Teachers', d2: 'Teachers and Parents cannot overlap', d3: 'Three disjoint circles' },
    { items: 'Languages, French, German', ans: 'French and German are distinct circles inside Languages', d1: 'French is inside German', d2: 'Languages are inside French', d3: 'Three completely disjoint sets' },
    { items: 'Planets, Jupiter, Stars', ans: 'Jupiter is inside Planets; Stars is a completely separate circle', d1: 'Jupiter is inside Stars', d2: 'Planets are inside Stars', d3: 'All three overlap' },
    { items: 'Triangles, Scalene Triangles, Equilateral Triangles', ans: 'Scalene and Equilateral are mutually disjoint subsets inside Triangles', d1: 'Scalene is inside Equilateral', d2: 'Triangles is inside Scalene', d3: 'All triangles are equilateral' },
    { items: 'Mammals, Bats, Flying Animals', ans: 'Bats are inside Mammals and also inside Flying Animals (intersection of both)', d1: 'Bats are not mammals', d2: 'All mammals fly', d3: 'Three disjoint sets' },
    { items: 'Hardware, CPUs, Monitors', ans: 'CPUs and Monitors are separate components within Hardware', d1: 'CPUs are inside Monitors', d2: 'Hardware is inside CPUs', d3: 'Monitors are not hardware' },
    { items: 'Polygon, Octagon, Decagon', ans: 'Octagon and Decagon are distinct subsets inside Polygon', d1: 'Octagon is inside Decagon', d2: 'Polygon is inside Octagon', d3: 'Three mutually disjoint circles' },
    { items: 'Oceans, Pacific, Continents', ans: 'Pacific is inside Oceans; Continents is a completely separate circle', d1: 'Continents is inside Oceans', d2: 'Pacific is inside Continents', d3: 'All three overlap' },
    { items: 'Vehicles, Boats, Cars', ans: 'Boats and Cars are disjoint classes inside Vehicles', d1: 'Cars are inside Boats', d2: 'Boats are not vehicles', d3: 'Three disjoint circles' },
    { items: 'Musicians, Guitarists, Drummers', ans: 'Guitarists and Drummers are inside Musicians, with possible overlap for multi-instrumentalists', d1: 'Musicians are inside Guitarists', d2: 'Guitarists cannot play drums', d3: 'Three disjoint circles' },
    { items: 'Herbivores, Carnivores, Animals', ans: 'Herbivores and Carnivores are distinct dietary classes inside Animals', d1: 'Herbivores are inside Carnivores', d2: 'Animals are inside Herbivores', d3: 'Three disjoint sets' },
    { items: 'Rivers, Lakes, Water Bodies', ans: 'Rivers and Lakes are distinct forms of Water Bodies', d1: 'Rivers are inside Lakes', d2: 'Water Bodies are inside Rivers', d3: 'Three disjoint circles' },
    { items: 'Athletes, Swimmers, Runners', ans: 'Swimmers and Runners are inside Athletes, with an overlapping intersection (triathletes)', d1: 'Swimmers are outside Athletes', d2: 'Runners are outside Athletes', d3: 'Athletes are inside Swimmers' },
    { items: 'Trees, Oaks, Maples', ans: 'Oaks and Maples are separate species inside Trees', d1: 'Oaks are inside Maples', d2: 'Trees are inside Oaks', d3: 'Three disjoint sets' },
  ];
  vennData.forEach((v) => {
    addQ(
      8,
      'Logical Venn Diagrams',
      'Medium',
      `Which Venn diagram representation accurately models the relationship among: [${v.items}]?`,
      v.ans,
      v.d1,
      v.d2,
      v.d3,
      `Venn relationship analysis: ${v.ans}.`
    );
  });

  // Level 9: Critical Reasoning & Arguments (30 questions)
  const critData = [
    { arg: 'A city implemented bike lanes and saw cycling increase by 40%. The mayor claims building bike lanes always causes higher cycling adoption.', ans: 'Correlation does not necessarily establish sole causation; other factors like rising fuel costs could contribute.', d1: 'Bicycles do not have engines.', d2: 'The mayor does not know how to ride a bicycle.', d3: 'Bike lanes are painted green.' },
    { arg: 'A study found students who drink coffee score 5% higher on morning tests. The author concludes coffee improves intelligence.', ans: 'The study only shows a short-term test score association, not a permanent increase in general intelligence.', d1: 'Coffee beans grow on trees.', d2: 'Tea is better than coffee.', d3: 'Tests should be abolished.' },
    { arg: 'Company X adopted remote work and profits rose 15%. Management concludes remote work directly caused the profit jump.', ans: 'Other concurrent business drivers (such as new product launches or market demand) were not controlled for.', d1: 'Remote workers do not use computers.', d2: 'Offices are cheaper than homes.', d3: 'Profits are measured in currency.' },
    { arg: 'Smartphone battery life increased by 2 hours after users updated to OS v2. The developer claims OS v2 is more power-efficient.', ans: 'Users may have altered screen brightness or usage patterns during the test period.', d1: 'Batteries degrade over time.', d2: 'Smartphones need electricity.', d3: 'OS v2 has new wallpapers.' },
    { arg: 'A gym reported that members who hired personal trainers visited 3x more often. The gym claims trainers cause higher motivation.', ans: 'Members who voluntarily pay for trainers already possess higher intrinsic motivation.', d1: 'Gyms have dumbbells.', d2: 'Personal trainers are certified.', d3: 'Exercise is healthy.' },
    { arg: 'An e-commerce site redesigned its checkout button to orange and conversions increased. They conclude orange is the best color for all buttons.', ans: 'The increase may be due to contrast against the existing page background rather than the color orange universally.', d1: 'Orange is a citrus fruit.', d2: 'Buttons must be square.', d3: 'E-commerce requires credit cards.' },
    { arg: 'Patients who took Vitamin D supplements had fewer sick days. The author concludes Vitamin D prevents all respiratory illnesses.', ans: 'Overgeneralizing from reduced sick days to immunity against all respiratory illnesses is an unjustified leap.', d1: 'Vitamins are organic compounds.', d2: 'Sunlight produces Vitamin D.', d3: 'Sick days are tracked by HR.' },
    { arg: 'A software team switched to Scrum and shipped 20% more story points. The team claims Scrum doubled developer productivity.', ans: 'Story points are subjective estimates that may have experienced point inflation over time.', d1: 'Scrum uses daily standups.', d2: 'Developers write code.', d3: 'Story points are not hours.' },
    { arg: 'Cars with anti-lock brakes (ABS) were involved in fewer skidding accidents. An insurer concludes ABS drivers are more careful.', ans: 'The mechanical safety feature itself prevents skidding, regardless of driver caution levels.', d1: 'Cars have four wheels.', d2: 'Brakes use hydraulic fluid.', d3: 'Insurance rates vary by state.' },
    { arg: 'Communities with public libraries report higher literacy rates. An editorial argues building a library will immediately fix illiteracy.', ans: 'Building physical libraries without literacy programs or educational funding may not guarantee improved reading rates.', d1: 'Libraries store books.', d2: 'Librarians organize catalogs.', d3: 'Books have pages.' },
    { arg: 'A restaurant added vegan options and total revenue rose 10%. The chef claims non-vegan dishes are losing popularity.', ans: 'Vegan options attracted new customer demographics without necessarily cannibalizing non-vegan sales.', d1: 'Vegetables are grown on farms.', d2: 'Menus are printed on paper.', d3: 'Chefs prepare meals.' },
    { arg: 'Companies that spend more on R&D file more patents. An analyst claims doubling R&D budget will automatically double breakthroughs.', ans: 'Diminishing returns and research efficiency mean funding alone does not scale linearly with discovery.', d1: 'Patents protect intellectual property.', d2: 'R&D stands for Research and Development.', d3: 'Budget is approved by directors.' },
    { arg: 'Employees with dual monitors reported 10% faster document editing. The IT director concludes dual monitors cure all productivity bottlenecks.', ans: 'Hardware upgrades address display real-estate but do not solve organizational, process, or meeting overhead.', d1: 'Monitors require HDMI cables.', d2: 'Pixels form digital images.', d3: 'Desks support monitor arms.' },
    { arg: 'A clinic noticed patient satisfaction scores jumped when waiting rooms offered tea. The clinic asserts tea eliminates medical anxiety.', ans: 'Offering hospitality is a comforting gesture that improves general survey sentiment but does not treat medical conditions.', d1: 'Tea leaves contain caffeine.', d2: 'Cups are made of ceramic.', d3: 'Clinics have examination rooms.' },
    { arg: 'A website added dark mode and average session duration grew by 3 minutes. The designer claims dark mode makes users read faster.', ans: 'Longer session duration could indicate slower reading speed, higher engagement, or simply leaving tabs open.', d1: 'Dark mode uses darker color palettes.', d2: 'Monitors emit photons.', d3: 'Designers use Figma.' },
    { arg: 'Athletes who sleep 8 hours perform better in sprints. A coach argues sleeping 12 hours will make sprinters 50% faster.', ans: 'The benefits of sleep plateau and excessive sleep does not produce linear physiological performance gains.', d1: 'Sleep has REM cycles.', d2: 'Sprinters wear running shoes.', d3: 'Tracks are 400 meters long.' },
    { arg: 'A retail store played classical music and average basket size grew by $5. The owner claims classical music makes people wealthy.', ans: 'Music pacing may induce relaxed browsing time, leading to slightly higher spending, unrelated to wealth creation.', d1: 'Mozart composed symphonies.', d2: 'Speakers produce sound waves.', d3: 'Baskets hold merchandise.' },
    { arg: 'Users who turned on notifications retained 25% better. Product management claims sending 10x more notifications will maximize retention.', ans: 'Excessive push notifications cause notification fatigue, annoyance, and app uninstalls.', d1: 'Smartphones receive push tokens.', d2: 'Badges show unread counts.', d3: 'Notifications have titles.' },
    { arg: 'Students who take handwritten notes score higher on conceptual recall than those typing. A researcher claims keyboards impair brain development.', ans: 'Handwriting forces synthesis due to slower writing speed, whereas typing encourages verbatim transcription without cognitive impairment.', d1: 'Pens contain ink.', d2: 'Keyboards have QWERTY layout.', d3: 'Paper is made from pulp.' },
    { arg: 'Houses with solar panels sold 10 days faster. A realtor argues every homeowner must install solar purely for resale speed.', ans: 'Solar installations entail significant upfront capital costs that may not be recovered depending on market conditions.', d1: 'Photovoltaic cells convert sunlight.', d2: 'Roofs face south for solar.', d3: 'Real estate has closing costs.' },
    { arg: 'A mobile app had fewer crashes after refactoring from Java to Kotlin. The lead argues Java cannot build stable apps.', ans: 'Modern features like null-safety help, but millions of stable Java applications operate globally.', d1: 'Kotlin runs on the JVM.', d2: 'Bytecode is executed by runtimes.', d3: 'Android supports multiple languages.' },
    { arg: 'Teams using daily standups resolve blockers faster. A manager mandates four standups per day to resolve blockers 4x faster.', ans: 'Excessive meetings fragment engineering focus time and decrease overall throughput.', d1: 'Standups typically last 15 minutes.', d2: 'Teams have Scrum masters.', d3: 'Blockers impede sprint velocity.' },
    { arg: 'Shoppers buying organic produce buy more reusable bags. An analyst claims organic food causes environmental activism.', ans: 'Environmentally conscious consumers independently prefer both organic goods and reusable bags (common cause).', d1: 'Organic farming avoids synthetic pesticides.', d2: 'Bags are made of canvas.', d3: 'Produce sections have misters.' },
    { arg: 'Offices with plants reported 15% fewer complaints about air quality. An architect claims plants replace HVAC filtration systems.', ans: 'Aesthetics and minor humidity boosts improve perceived comfort, but mechanical HVAC is required for volume air exchange.', d1: 'Plants perform photosynthesis.', d2: 'Pots contain potting soil.', d3: 'Air contains nitrogen and oxygen.' },
    { arg: 'Startups with shorter domain names raised seed rounds faster. An investor asserts short names guarantee venture success.', ans: 'Well-capitalized or connected founders may have acquired premium domains, reflecting preexisting resource advantages.', d1: 'Domains end in TLDs like .com.', d2: 'DNS maps names to IP addresses.', d3: 'Registrars manage domain records.' },
    { arg: 'Drivers who listen to podcasts commute 10 minutes longer without complaining. A city planner claims podcasts solve traffic congestion.', ans: 'Podcasts improve driver patience during transit, but physical vehicle congestion remains unchanged.', d1: 'Audio streaming uses mobile data.', d2: 'Highways have lane markers.', d3: 'Traffic lights cycle green and red.' },
    { arg: 'Programmers using AI copilot write 30% more lines of code. A CTO claims software velocity has increased by 30%.', ans: 'Lines of code do not correlate directly with delivered business value, architecture quality, or bug-free functionality.', d1: 'Copilots use large language models.', d2: 'IDEs provide autocompletion.', d3: 'Code repositories track commits.' },
    { arg: 'Gamers using mechanical keyboards report higher APM (actions per minute). A marketer claims the keyboard makes casual players esports champions.', ans: 'High APM is driven by practice, reflexes, and game sense; hardware provides ergonomic responsiveness, not game mastery.', d1: 'Mechanical switches have tactile feedback.', d2: 'Keycaps are made of PBT plastic.', d3: 'USB provides polling rates.' },
    { arg: 'Companies with unlimited paid time off (PTO) had employees take fewer vacation days. An HR rep claims employees hate taking vacation.', ans: 'Without explicit quotas, cultural pressure and ambiguous norms often discourage staff from taking adequate time off.', d1: 'PTO policies are written in handbooks.', d2: 'Calendars track leave requests.', d3: 'Vacations allow rest.' },
    { arg: 'A bakery started offering free coffee samples and pastry sales doubled. The owner concludes customers only care about free beverages.', ans: 'The complimentary beverage creates goodwill, foot traffic, and complementary purchase incentives for pastries.', d1: 'Pastries are baked in ovens.', d2: 'Coffee is brewed with hot water.', d3: 'Flour is the main pastry ingredient.' },
  ];
  critData.forEach((c) => {
    addQ(
      9,
      'Critical Reasoning',
      'Hard',
      `Evaluate the argument:\n"${c.arg}"\nWhat is the most vulnerable logical flaw in this reasoning?`,
      c.ans,
      c.d1,
      c.d2,
      c.d3,
      `Critical analysis flaw: ${c.ans}`
    );
  });

  // Level 10: Advanced Data Sufficiency & Multi-Constraint Logic (30 questions)
  const dsData = [
    { q: 'Is integer X even?\nStatement 1: X is divisible by 4.\nStatement 2: X is divisible by 6.', ans: 'Statement 1 alone is sufficient, and Statement 2 alone is sufficient', d1: 'Statement 1 alone is sufficient, but Statement 2 is not', d2: 'Statement 2 alone is sufficient, but Statement 1 is not', d3: 'Both statements together are insufficient', exp: 'Any multiple of 4 is even, and any multiple of 6 is even. Each alone answers the question definitively.' },
    { q: 'What is the value of positive integer N?\nStatement 1: N is prime and 10 < N < 14.\nStatement 2: N is odd and 11 <= N <= 13.', ans: 'Statement 1 alone is sufficient (N must be 11 or 13? In range 10-14 primes are 11 and 13, wait: Statement 1 + Statement 2 needed if unique)', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Both statements together are still not sufficient to find a single value', exp: 'In (10, 14), primes are {11, 13}. In [11, 13], odd numbers are {11, 13}. Both statements yield the set {11, 13}, neither alone or together yields a single unique value.' },
    { q: 'Is Y > 0?\nStatement 1: Y^2 = 25.\nStatement 2: Y^3 = 125.', ans: 'Statement 2 alone is sufficient, but Statement 1 alone is not', d1: 'Statement 1 alone is sufficient', d2: 'Both statements together are needed', d3: 'Neither statement is sufficient', exp: 'Statement 1 gives Y = +5 or -5 (ambiguous). Statement 2 gives Y = +5 uniquely (> 0).' },
    { q: 'What is the average of two numbers A and B?\nStatement 1: A + B = 80.\nStatement 2: A - B = 20.', ans: 'Statement 1 alone is sufficient, but Statement 2 alone is not', d1: 'Statement 2 alone is sufficient', d2: 'Both statements together are needed', d3: 'Neither statement is sufficient', exp: 'Average = (A + B) / 2 = 80 / 2 = 40 directly from Statement 1.' },
    { q: 'Is triangle ABC equilateral?\nStatement 1: Angle A = 60 degrees and Angle B = 60 degrees.\nStatement 2: Side AB = Side BC.', ans: 'Statement 1 alone is sufficient, but Statement 2 alone is not', d1: 'Statement 2 alone is sufficient', d2: 'Both statements together are needed', d3: 'Neither statement is sufficient', exp: 'If two angles are 60 deg, the third must be 180 - 120 = 60 deg, proving it is equilateral.' },
    { q: 'What is the radius of circle C?\nStatement 1: The area of circle C is 49*pi.\nStatement 2: The circumference of circle C is 14*pi.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone is sufficient only', d2: 'Statement 2 alone is sufficient only', d3: 'Both statements together are needed', exp: 'Area = pi*r^2 = 49*pi gives r = 7. Circumference = 2*pi*r = 14*pi gives r = 7.' },
    { q: 'Is M divisible by 15?\nStatement 1: M is divisible by 3.\nStatement 2: M is divisible by 5.', ans: 'Both statements together are sufficient, but neither alone is sufficient', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Statements together are not sufficient', exp: 'Since gcd(3, 5) = 1, being divisible by both 3 and 5 proves divisibility by 15.' },
    { q: 'What is the slope of line L?\nStatement 1: Line L passes through points (0,0) and (2,4).\nStatement 2: Line L is perpendicular to line y = -0.5x + 3.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both together needed', exp: 'Stmt 1: Slope = (4-0)/(2-0) = 2. Stmt 2: Perpendicular to -0.5 slope is -1/(-0.5) = 2.' },
    { q: 'Is X an integer?\nStatement 1: 2X is an integer.\nStatement 2: 3X is an integer.', ans: 'Both statements together are sufficient (since 3X - 2X = X must be an integer)', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Statements together are insufficient', exp: 'If 2X in Z and 3X in Z, then (3X - 2X) = X must be an integer.' },
    { q: 'Is quadrilateral Q a square?\nStatement 1: Q is a rectangle.\nStatement 2: The diagonals of Q are perpendicular.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Statements together are insufficient', exp: 'A rectangle with perpendicular diagonals is by definition a square.' },
    { q: 'What is the value of X + Y?\nStatement 1: 2X + 2Y = 50.\nStatement 2: X - Y = 5.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone is sufficient', d2: 'Both statements needed', d3: 'Neither sufficient', exp: 'Dividing 2X + 2Y = 50 by 2 gives X + Y = 25 directly.' },
    { q: 'Is integer K prime?\nStatement 1: K has exactly two positive factors.\nStatement 2: K is an odd number between 20 and 28.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone is sufficient', d2: 'Both needed', d3: 'Neither sufficient', exp: 'Having exactly two positive factors is the definitive mathematical definition of a prime.' },
    { q: 'What is the speed of the train?\nStatement 1: The train crosses a 200m platform in 20 seconds.\nStatement 2: The train crosses a signal pole in 10 seconds.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Statements together are insufficient', exp: 'Let speed be v, train length L. L = 10v. (L+200)/20 = v => (10v+200)/20 = v => v = 20 m/s.' },
    { q: 'Is A > B?\nStatement 1: A - B = 7.\nStatement 2: A/B > 1.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone is sufficient', d2: 'Both needed', d3: 'Neither sufficient', exp: 'A - B = 7 implies A = B + 7, so A > B always. Statement 2 depends on signs of A and B.' },
    { q: 'What is the perimeter of rectangle R?\nStatement 1: Area of R is 48.\nStatement 2: Diagonal of R is 10.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone is sufficient', d2: 'Statement 2 alone is sufficient', d3: 'Statements together are insufficient', exp: 'L*W = 48, L^2+W^2 = 100 => (L+W)^2 = L^2+W^2 + 2LW = 100 + 96 = 196 => L+W = 14 => Perimeter = 28.' },
    { q: 'Is N odd?\nStatement 1: N + 1 is even.\nStatement 2: N^2 is odd.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both needed', exp: 'If N+1 is even, N is odd. If N^2 is odd, N is odd.' },
    { q: 'What is the value of non-zero integer Z?\nStatement 1: |Z| = 9.\nStatement 2: Z < 0.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone', d2: 'Statement 2 alone', d3: 'Neither sufficient', exp: 'From Stmt 1 Z is 9 or -9. Stmt 2 specifies Z < 0, so Z = -9 uniquely.' },
    { q: 'Is polygon P a regular hexagon?\nStatement 1: P has 6 equal sides.\nStatement 2: P has 6 equal interior angles of 120 degrees each.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone', d2: 'Statement 2 alone', d3: 'Neither sufficient', exp: 'A regular polygon must be both equilateral (equal sides) and equiangular (equal angles).' },
    { q: 'How many students passed the exam?\nStatement 1: Total students enrolled = 120.\nStatement 2: 75% of enrolled students passed.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone', d2: 'Statement 2 alone', d3: 'Neither sufficient', exp: 'Pass count = 75% * 120 = 90 students.' },
    { q: 'Is real number X positive?\nStatement 1: X > -5.\nStatement 2: -2X < -10.', ans: 'Statement 2 alone is sufficient', d1: 'Statement 1 alone', d2: 'Both needed', d3: 'Neither sufficient', exp: '-2X < -10 => X > 5, which guarantees X is positive.' },
    { q: 'What is the value of 3A + 3B?\nStatement 1: A + B = 14.\nStatement 2: A - B = 4.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone', d2: 'Both needed', d3: 'Neither sufficient', exp: '3A + 3B = 3(A + B) = 3(14) = 42.' },
    { q: 'Is line L parallel to line M?\nStatement 1: Line L and Line M have identical slope m = 3.\nStatement 2: Line L and Line M have different y-intercepts.', ans: 'Statement 1 alone is sufficient (identical slopes define parallel lines; distinct intercepts ensure non-coincident)', d1: 'Statement 2 alone', d2: 'Both needed', d3: 'Neither sufficient', exp: 'Identical slopes guarantee geometric parallelism.' },
    { q: 'What is the sum of roots of polynomial P(x) = ax^2 + bx + c?\nStatement 1: a = 2 and b = -8.\nStatement 2: c = 6.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone', d2: 'Both needed', d3: 'Neither sufficient', exp: 'Sum of roots = -b/a = -(-8)/2 = 4, determined purely by a and b.' },
    { q: 'Is integer W divisible by 6?\nStatement 1: W is divisible by 2.\nStatement 2: W is divisible by 4.', ans: 'Statements together are NOT sufficient', d1: 'Statement 1 alone', d2: 'Statement 2 alone', d3: 'Both together are sufficient', exp: 'Multiples of 4 (e.g. 4, 8) are not divisible by 6. Multiples like 12 are. Divisibility by 3 is missing.' },
    { q: 'What is the age of Father?\nStatement 1: Father is 30 years older than Son.\nStatement 2: Son is 15 years old.', ans: 'Both statements together are sufficient', d1: 'Statement 1 alone', d2: 'Statement 2 alone', d3: 'Neither sufficient', exp: 'Father = 15 + 30 = 45 years.' },
    { q: 'Is triangle XYZ a right triangle?\nStatement 1: Side lengths are 6, 8, 10.\nStatement 2: One angle is 90 degrees.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both needed', exp: '6^2 + 8^2 = 10^2 satisfies Pythagorean theorem (right triangle). 90 deg angle defines right triangle.' },
    { q: 'What is the volume of cube K?\nStatement 1: Surface area of cube K is 150 sq cm.\nStatement 2: Diagonal of cube K is 5*sqrt(3) cm.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both needed', exp: '6*s^2 = 150 gives s = 5 -> Vol = 125. Diagonal s*sqrt(3) = 5*sqrt(3) gives s = 5 -> Vol = 125.' },
    { q: 'Is X = Y?\nStatement 1: X - Y = 0.\nStatement 2: X^2 = Y^2.', ans: 'Statement 1 alone is sufficient', d1: 'Statement 2 alone', d2: 'Both needed', d3: 'Neither sufficient', exp: 'X - Y = 0 => X = Y. X^2 = Y^2 allows X = -Y, which is ambiguous.' },
    { q: 'What is the median of list {3, 7, X, 12, 18}?\nStatement 1: X = 9.\nStatement 2: The average is 10.', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both needed', exp: 'If X=9, sorted list is {3,7,9,12,18}, median is 9. If avg is 10, sum is 50 => X = 50 - 40 = 10, sorted is {3,7,10,12,18}, median is 10.' },
    { q: 'Is circle C centered at the origin (0,0)?\nStatement 1: The equation of circle C is x^2 + y^2 = 25.\nStatement 2: The circle passes through (5,0), (0,5), (-5,0), (0,-5).', ans: 'Each statement alone is sufficient', d1: 'Statement 1 alone only', d2: 'Statement 2 alone only', d3: 'Both needed', exp: 'Standard form x^2 + y^2 = R^2 represents center (0,0). The 4 symmetric intercept points also uniquely center it at origin.' },
  ];
  dsData.forEach((d) => {
    addQ(10, 'Data Sufficiency', 'Hard', d.q, d.ans, d.d1, d.d2, d.d3, d.exp);
  });

  return list;
}
