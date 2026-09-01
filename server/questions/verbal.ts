import { AptitudeQuestion } from '../../src/types';

export function getVerbalQuestions(): AptitudeQuestion[] {
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
      question_id: `q_verb_l${level_id}_${counter}`,
      topic_id: 'verbal',
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

  // Level 1: Synonyms & Word Meanings (30 distinct words)
  const synData = [
    { word: 'ABUNDANT', ans: 'Plentiful', d1: 'Scarce', d2: 'Minimal', d3: 'Restricted', exp: 'Abundant means existing or available in large quantities; plentiful.' },
    { word: 'METICULOUS', ans: 'Thorough and precise', d1: 'Careless', d2: 'Hastily executed', d3: 'Vague', exp: 'Meticulous refers to showing great attention to detail and precision.' },
    { word: 'CANDID', ans: 'Frank and outspoken', d1: 'Deceitful', d2: 'Shy', d3: 'Guarded', exp: 'Candid means truthful and straightforward.' },
    { word: 'LUCID', ans: 'Clear and easily understood', d1: 'Confusing', d2: 'Murky', d3: 'Ambiguous', exp: 'Lucid means expressed clearly or easy to understand.' },
    { word: 'RESILIENT', ans: 'Able to recover quickly', d1: 'Fragile', d2: 'Rigid', d3: 'Feeble', exp: 'Resilient means capable of withstanding or recovering quickly from difficult conditions.' },
    { word: 'PRAGMATIC', ans: 'Practical and realistic', d1: 'Idealistic', d2: 'Theoretical', d3: 'Impractical', exp: 'Pragmatic deals with things sensibly and realistically based on practical considerations.' },
    { word: 'EPHEMERAL', ans: 'Short-lived and transient', d1: 'Permanent', d2: 'Eternal', d3: 'Enduring', exp: 'Ephemeral means lasting for a very short time.' },
    { word: 'ELOQUENT', ans: 'Fluent and persuasive in speech', d1: 'Inarticulate', d2: 'Silent', d3: 'Clumsy', exp: 'Eloquent means fluent or persuasive in speaking or writing.' },
    { word: 'AMIABLE', ans: 'Friendly and pleasant', d1: 'Hostile', d2: 'Aloof', d3: 'Bitter', exp: 'Amiable means having or displaying a friendly and pleasant manner.' },
    { word: 'DILIGENT', ans: 'Hard-working and dedicated', d1: 'Lazy', d2: 'Indifferent', d3: 'Sluggish', exp: 'Diligent means showing persistent care and effort in duties.' },
    { word: 'BENEVOLENT', ans: 'Kind and charitable', d1: 'Malevolent', d2: 'Cruel', d3: 'Selfish', exp: 'Benevolent means well-meaning and kindly.' },
    { word: 'UBIQUITOUS', ans: 'Omnipresent and widespread', d1: 'Rare', d2: 'Hidden', d3: 'Isolated', exp: 'Ubiquitous means present, appearing, or found everywhere.' },
    { word: 'ADVOCATE', ans: 'Support publicly', d1: 'Oppose', d2: 'Condemn', d3: 'Suppress', exp: 'To advocate is to publicly recommend or support.' },
    { word: 'TENACIOUS', ans: 'Persistent and determined', d1: 'Hesitant', d2: 'Weak', d3: 'Yielding', exp: 'Tenacious means tending to keep a firm hold of something; persistent.' },
    { word: 'FUTILE', ans: 'Pointless and ineffective', d1: 'Fruitful', d2: 'Effective', d3: 'Valuable', exp: 'Futile means incapable of producing any useful result; pointless.' },
    { word: 'GREGARIOUS', ans: 'Sociable and outgoing', d1: 'Solitary', d2: 'Introverted', d3: 'Reserved', exp: 'Gregarious means fond of company; sociable.' },
    { word: 'IMPARTIAL', ans: 'Unbiased and fair', d1: 'Prejudiced', d2: 'Biased', d3: 'Subjective', exp: 'Impartial means treating all rivals or disputants equally.' },
    { word: 'LETHARGIC', ans: 'Sluggish and apathetic', d1: 'Energetic', d2: 'Active', d3: 'Vigorous', exp: 'Lethargic means affected by lethargy; sluggish and drowsy.' },
    { word: 'NOVEL', ans: 'New and original', d1: 'Ancient', d2: 'Commonplace', d3: 'Outdated', exp: 'Novel means new and not like anything seen or known before.' },
    { word: 'OBSOLETE', ans: 'Outdated and no longer used', d1: 'Cutting-edge', d2: 'Contemporary', d3: 'Modern', exp: 'Obsolete means no longer produced or used; out of date.' },
    { word: 'PLAUSIBLE', ans: 'Credible and reasonable', d1: 'Implausible', d2: 'Absurd', d3: 'Unbelievable', exp: 'Plausible means seeming reasonable or probable.' },
    { word: 'QUENCH', ans: 'Satisfy or extinguish', d1: 'Ignite', d2: 'Deprive', d3: 'Aggravate', exp: 'Quench means to satisfy a thirst or extinguish a flame.' },
    { word: 'SCRUTINIZE', ans: 'Examine closely', d1: 'Ignore', d2: 'Overlook', d3: 'Glance past', exp: 'Scrutinize means to examine or inspect closely and thoroughly.' },
    { word: 'TACTFUL', ans: 'Diplomatic and discreet', d1: 'Blunt', d2: 'Rude', d3: 'Tactless', exp: 'Tactful means having or showing skill and sensitivity in dealing with others.' },
    { word: 'UNANIMOUS', ans: 'In complete agreement', d1: 'Divided', d2: 'Disputed', d3: 'Contested', exp: 'Unanimous means fully in agreement.' },
    { word: 'VIGILANT', ans: 'Watchful and alert', d1: 'Negligent', d2: 'Careless', d3: 'Asleep', exp: 'Vigilant means keeping careful watch for possible danger or difficulties.' },
    { word: 'WARY', ans: 'Cautious and guarded', d1: 'Trusting', d2: 'Reckless', d3: 'Rash', exp: 'Wary means feeling or showing caution about possible dangers or problems.' },
    { word: 'ZEALOUS', ans: 'Fervent and enthusiastic', d1: 'Indifferent', d2: 'Apathetic', d3: 'Uninterested', exp: 'Zealous means having or showing great zeal and passion.' },
    { word: 'AUTHENTIC', ans: 'Genuine and real', d1: 'Counterfeit', d2: 'Fake', d3: 'Spurious', exp: 'Authentic means of undisputed origin; genuine.' },
    { word: 'COGNIZANT', ans: 'Aware and mindful', d1: 'Ignorant', d2: 'Unconscious', d3: 'Unaware', exp: 'Cognizant means having knowledge or being aware of.' },
  ];
  synData.forEach((s) => {
    addQ(
      1,
      'Synonyms',
      'Easy',
      `Choose the exact synonym for the capitalized word:\n"${s.word}"`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      s.exp
    );
  });

  // Level 2: Antonyms & Word Opposites (30 distinct words)
  const antData = [
    { word: 'AFFLUENT', ans: 'Impoverished', d1: 'Wealthy', d2: 'Opulent', d3: 'Prosperous', exp: 'Affluent means wealthy; its direct antonym is impoverished.' },
    { word: 'COMPLIANT', ans: 'Defiant', d1: 'Obedient', d2: 'Submissive', d3: 'Yielding', exp: 'Compliant means willing to obey; the opposite is defiant.' },
    { word: 'DIVERGENT', ans: 'Convergent', d1: 'Deviating', d2: 'Disparate', d3: 'Separating', exp: 'Divergent means moving apart; the opposite is convergent.' },
    { word: 'EXPLICIT', ans: 'Ambiguous', d1: 'Definite', d2: 'Clear', d3: 'Unambiguous', exp: 'Explicit means stated clearly; the opposite is ambiguous or implicit.' },
    { word: 'FRUGAL', ans: 'Extravagant', d1: 'Thrifty', d2: 'Economical', d3: 'Sparing', exp: 'Frugal means sparing or economical with money; the opposite is extravagant.' },
    { word: 'HARMONIOUS', ans: 'Discordant', d1: 'Tuneful', d2: 'Peaceful', d3: 'Agreeable', exp: 'Harmonious means tuneful or agreement-based; opposite is discordant.' },
    { word: 'INTREPID', ans: 'Cowardly', d1: 'Fearless', d2: 'Brave', d3: 'Valiant', exp: 'Intrepid means fearless; the opposite is cowardly or timid.' },
    { word: 'JUDICIOUS', ans: 'Imprudent', d1: 'Wise', d2: 'Sensible', d3: 'Prudent', exp: 'Judicious means having good judgment; opposite is imprudent.' },
    { word: 'KINDLE', ans: 'Extinguish', d1: 'Ignite', d2: 'Spark', d3: 'Fuel', exp: 'Kindle means to start a flame; the opposite is extinguish.' },
    { word: 'LAVISH', ans: 'Austere', d1: 'Luxurious', d2: 'Grand', d3: 'Sumptuous', exp: 'Lavish means sumptuously rich; opposite is austere or meager.' },
    { word: 'MANDATORY', ans: 'Optional', d1: 'Compulsory', d2: 'Obligatory', d3: 'Required', exp: 'Mandatory means required; the opposite is optional.' },
    { word: 'NEBULOUS', ans: 'Distinct and clear', d1: 'Vague', d2: 'Hazy', d3: 'Cloudy', exp: 'Nebulous means vague or ill-defined; opposite is distinct and clear.' },
    { word: 'OPAQUE', ans: 'Transparent', d1: 'Murky', d2: 'Cloudy', d3: 'Dense', exp: 'Opaque means not able to be seen through; opposite is transparent.' },
    { word: 'PACIFY', ans: 'Provoke', d1: 'Soothe', d2: 'Calm', d3: 'Appease', exp: 'Pacify means to quell anger; the opposite is provoke or agitate.' },
    { word: 'QUIETUDE', ans: 'Turbulence', d1: 'Calmness', d2: 'Tranquility', d3: 'Stillness', exp: 'Quietude means state of stillness; opposite is turbulence.' },
    { word: 'RESTRAIN', ans: 'Liberate', d1: 'Suppress', d2: 'Restrict', d3: 'Curb', exp: 'Restrain means to hold back; opposite is liberate or unleash.' },
    { word: 'SERENE', ans: 'Agitated', d1: 'Placid', d2: 'Tranquil', d3: 'Peaceful', exp: 'Serene means calm and peaceful; opposite is agitated.' },
    { word: 'TURBULENT', ans: 'Placid and calm', d1: 'Stormy', d2: 'Chaotic', d3: 'Violent', exp: 'Turbulent means characterized by chaos; opposite is placid and calm.' },
    { word: 'URBANE', ans: 'Uncouth and crude', d1: 'Sophisticated', d2: 'Refined', d3: 'Polished', exp: 'Urbane means courteous and refined; opposite is uncouth.' },
    { word: 'VALIANT', ans: 'Craven', d1: 'Heroic', d2: 'Courageous', d3: 'Bold', exp: 'Valiant means showing courage; opposite is craven or cowardly.' },
    { word: 'WITHER', ans: 'Thrive and flourish', d1: 'Decay', d2: 'Fade', d3: 'Wilt', exp: 'Wither means to shrivel and decay; opposite is thrive and flourish.' },
    { word: 'EXONERATE', ans: 'Convict', d1: 'Absolve', d2: 'Acquit', d3: 'Pardon', exp: 'Exonerate means to clear of blame; opposite is convict or incriminate.' },
    { word: 'YIELDING', ans: 'Inflexible', d1: 'Supple', d2: 'Pliant', d3: 'Compliant', exp: 'Yielding means giving way easily; opposite is inflexible.' },
    { word: 'ZENITH', ans: 'Nadir', d1: 'Peak', d2: 'Apex', d3: 'Pinnacle', exp: 'Zenith is the highest point; opposite is nadir (the lowest point).' },
    { word: 'ARDUOUS', ans: 'Effortless', d1: 'Strenuous', d2: 'Demanding', d3: 'Exhausting', exp: 'Arduous means difficult and tiring; opposite is effortless.' },
    { word: 'BOISTEROUS', ans: 'Subdued', d1: 'Noisy', d2: 'Rowdy', d3: 'Clamorous', exp: 'Boisterous means noisy and energetic; opposite is subdued or quiet.' },
    { word: 'CONCEAL', ans: 'Reveal', d1: 'Hide', d2: 'Mask', d3: 'Disguise', exp: 'Conceal means to hide; opposite is reveal or disclose.' },
    { word: 'DESPICABLE', ans: 'Admirable', d1: 'Vile', d2: 'Contemptible', d3: 'Disgraceful', exp: 'Despicable means deserving hatred; opposite is admirable or praiseworthy.' },
    { word: 'ECLIPSE', ans: 'Illuminate', d1: 'Obscure', d2: 'Shadow', d3: 'Dim', exp: 'Eclipse means to block out or obscure; opposite is illuminate.' },
    { word: 'FEROCIOUS', ans: 'Gentle', d1: 'Fierce', d2: 'Savage', d3: 'Brutal', exp: 'Ferocious means savagely fierce; opposite is gentle or tame.' },
  ];
  antData.forEach((a) => {
    addQ(
      2,
      'Antonyms',
      'Easy',
      `Choose the most precise antonym (opposite) for the capitalized word:\n"${a.word}"`,
      a.ans,
      a.d1,
      a.d2,
      a.d3,
      a.exp
    );
  });

  // Level 3: Sentence Completion (30 distinct fill-in-the-blank questions)
  const scData = [
    { sent: 'Despite the severe storm, the captain remained completely ____ and guided the vessel safely to port.', ans: 'composed', d1: 'terrified', d2: 'agitated', d3: 'reckless', exp: 'The contrast word "Despite" indicates calm composure under adversity.' },
    { sent: 'The research team presented a ____ hypothesis supported by substantial empirical data.', ans: 'compelling', d1: 'flawed', d2: 'fictitious', d3: 'superficial', exp: 'Substantial empirical data makes a hypothesis compelling.' },
    { sent: 'Her presentation was so ____ that even non-technical stakeholders grasped the complex architecture.', ans: 'lucid', d1: 'convoluted', d2: 'abstruse', d3: 'redundant', exp: 'Easy understanding by non-technical audiences implies clarity and lucidity.' },
    { sent: 'The company instituted ____ security policies to prevent unauthorized data access.', ans: 'stringent', d1: 'lax', d2: 'negligent', d3: 'nominal', exp: 'Preventing unauthorized access requires stringent (strict) policies.' },
    { sent: 'Because of his ____ habits, he managed to accumulate significant savings on a modest income.', ans: 'frugal', d1: 'prodigal', d2: 'extravagant', d3: 'wasteful', exp: 'Accumulating savings on modest income points to frugal habits.' },
    { sent: 'The software update was designed to ____ the latency issues reported by active gamers.', ans: 'alleviate', d1: 'exacerbate', d2: 'compound', d3: 'prolong', exp: 'Updates aim to alleviate (lessen/reduce) performance problems.' },
    { sent: 'The treaty was signed in an atmosphere of mutual ____ and cordiality.', ans: 'goodwill', d1: 'animosity', d2: 'suspicion', d3: 'resentment', exp: 'Cordiality pairs with positive sentiment like goodwill.' },
    { sent: 'The architect chose durable materials to ensure the structural integrity remained ____ over decades.', ans: 'uncompromised', d1: 'vulnerable', d2: 'flimsy', d3: 'tenuous', exp: 'Durable materials ensure integrity remains uncompromised.' },
    { sent: 'His explanation was concise yet ____, addressing every nuance of the system design.', ans: 'comprehensive', d1: 'cursory', d2: 'vague', d3: 'fragmented', exp: 'Addressing every nuance makes an explanation comprehensive.' },
    { sent: 'The startup received ____ praise from industry critics for its innovative UI paradigm.', ans: 'unanimous', d1: 'hostile', d2: 'divided', d3: 'grudging', exp: 'High praise for innovation is frequently unanimous.' },
    { sent: 'Continuous deployment allows engineering teams to ship features with ____ velocity.', ans: 'unprecedented', d1: 'sluggish', d2: 'diminished', d3: 'stagnant', exp: 'Continuous deployment accelerates shipping speed to unprecedented levels.' },
    { sent: 'The committee rejected the proposal, citing its ____ financial projections.', ans: 'unrealistic', d1: 'accurate', d2: 'prudent', d3: 'solid', exp: 'Proposals are rejected due to unrealistic or unfeasible projections.' },
    { sent: 'A good mentor provides both constructive feedback and ____ encouragement.', ans: 'genuine', d1: 'insincere', d2: 'hostile', d3: 'grudging', exp: 'Effective mentoring pairs feedback with genuine encouragement.' },
    { sent: 'The new encryption protocol provides an ____ barrier against eavesdropping.', ans: 'impenetrable', d1: 'ineffectual', d2: 'fragile', d3: 'accessible', exp: 'Strong encryption aims to create an impenetrable security barrier.' },
    { sent: 'Her remarks were deliberately ____ to avoid taking a definitive political stance.', ans: 'equivocal', d1: 'blunt', d2: 'forthright', d3: 'candid', exp: 'Avoiding a definitive stance involves equivocal (ambiguous) phrasing.' },
    { sent: 'The database migration was executed with such precision that users noticed ____ downtime.', ans: 'zero', d1: 'excessive', d2: 'debilitating', d3: 'prolonged', exp: 'Precision execution results in minimal or zero downtime.' },
    { sent: 'The detective discovered a ____ clue that broke the cold case wide open.', ans: 'pivotal', d1: 'trivial', d2: 'redundant', d3: 'misleading', exp: 'A breakthrough clue is pivotal or decisive.' },
    { sent: 'In competitive markets, companies must remain ____ to adapt to shifting consumer demands.', ans: 'agile', d1: 'rigid', d2: 'inflexible', d3: 'stagnant', exp: 'Adapting to shifting demands requires agility.' },
    { sent: 'The documentary offered an ____ look at the challenges facing ocean ecosystems.', ans: 'insightful', d1: 'indifferent', d2: 'uninspired', d3: 'apathetic', exp: 'A well-crafted documentary provides insightful commentary.' },
    { sent: 'He handled the client\'s heated complaint with utmost ____ and professionalism.', ans: 'diplomacy', d1: 'arrogance', d2: 'rudeness', d3: 'indifference', exp: 'Heated situations require diplomacy and composure.' },
    { sent: 'The mathematical proof was acknowledged as ____, leaving no room for counter-argument.', ans: 'irrefutable', d1: 'dubious', d2: 'flawed', d3: 'untenable', exp: 'A definitive proof is irrefutable.' },
    { sent: 'Automated monitoring helps detect server anomalies before they turn into ____ failures.', ans: 'catastrophic', d1: 'minor', d2: 'negligible', d3: 'trivial', exp: 'Proactive detection avoids catastrophic cascading outages.' },
    { sent: 'The author\'s style is known for being ____, using few words to convey profound meanings.', ans: 'laconic', d1: 'verbose', d2: 'rambling', d3: 'prolix', exp: 'Using few words characterizes laconic or concise prose.' },
    { sent: 'The newly launched tablet features a display with ____ color accuracy and sharpness.', ans: 'exceptional', d1: 'mediocre', d2: 'substandard', d3: 'poor', exp: 'Flagship hardware highlights exceptional display clarity.' },
    { sent: 'Due to the drought, farmers faced an ____ shortage of irrigation water.', ans: 'acute', d1: 'insignificant', d2: 'surplus', d3: 'abundant', exp: 'Drought causes an acute (severe) shortage.' },
    { sent: 'The board praised the CEO\'s ____ vision that propelled the firm into global markets.', ans: 'strategic', d1: 'myopic', d2: 'shortsighted', d3: 'reckless', exp: 'Global expansion reflects sound strategic foresight.' },
    { sent: 'The scientist remained ____, refusing to draw conclusions before the full trials concluded.', ans: 'objective', d1: 'biased', d2: 'hasty', d3: 'dogmatic', exp: 'Waiting for full empirical results demonstrates scientific objectivity.' },
    { sent: 'The artist created a ____ sculpture blending modern metals with organic wood.', ans: 'striking', d1: 'bland', d2: 'generic', d3: 'monotonous', exp: 'Distinctive creative work is visually striking.' },
    { sent: 'Her dedication to open-source software earned her a ____ reputation in the developer community.', ans: 'stellar', d1: 'tarnished', d2: 'questionable', d3: 'notorious', exp: 'Strong dedication builds a stellar reputation.' },
    { sent: 'The contract contained a ____ clause that allowed termination under force majeure.', ans: 'specific', d1: 'cryptic', d2: 'hidden', d3: 'fictional', exp: 'Formal contracts specify explicit clauses for termination conditions.' },
  ];
  scData.forEach((s) => {
    addQ(
      3,
      'Sentence Completion',
      'Medium',
      `Select the word that best completes the sentence:\n"${s.sent}"`,
      s.ans,
      s.d1,
      s.d2,
      s.d3,
      s.exp
    );
  });

  // Level 4: Error Spotting & Grammar (30 distinct grammatical error sentences)
  const errData = [
    { sent: 'Neither the manager nor the employees [A] was present [B] at the mandatory meeting [C] yesterday morning [D].', ans: 'Segment [B] ("was present" -> "were present")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'With "neither... nor", the verb agrees with the nearer subject ("employees" -> plural "were present").' },
    { sent: 'Each of the participating candidates [A] have submitted their portfolio [B] before the official deadline [C] expired [D].', ans: 'Segment [B] ("have submitted" -> "has submitted")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Each" is singular and takes the singular verb "has submitted".' },
    { sent: 'The list of approved vendors [A] were updated [B] by the procurement team [C] last Friday [D].', ans: 'Segment [B] ("were updated" -> "was updated")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The head noun is singular "The list", which requires the singular verb "was updated".' },
    { sent: 'He is one of those engineers [A] who works [B] tirelessly on open-source [C] development [D].', ans: 'Segment [B] ("who works" -> "who work")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The relative pronoun "who" refers to the plural antecedent "engineers", requiring the plural verb "work".' },
    { sent: 'If I was the chief technology officer [A], I would refactor [B] the entire legacy codebase [C] immediately [D].', ans: 'Segment [A] ("If I was" -> "If I were")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Subjunctive mood for hypothetical conditions requires "If I were".' },
    { sent: 'She had barely sat down [A] when the fire alarm [B] started ringing loud [C] across the office [D].', ans: 'Segment [C] ("ringing loud" -> "ringing loudly")', d1: 'Segment [A]', d2: 'Segment [B]', d3: 'Segment [D]', exp: 'The verb "ringing" must be modified by the adverb "loudly", not the adjective "loud".' },
    { sent: 'Between you and I [A], the new system architecture [B] seems far more scalable [C] than the previous one [D].', ans: 'Segment [A] ("Between you and I" -> "Between you and me")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Prepositions like "between" take objective pronouns ("me", not "I").' },
    { sent: 'The company has invested [A] heavy in artificial intelligence [B] over the last [C] two fiscal quarters [D].', ans: 'Segment [B] ("heavy in" -> "heavily in")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The verb "invested" requires the adverb "heavily".' },
    { sent: 'None of the information provided [A] were accurate enough [B] to make a decisive [C] business judgment [D].', ans: 'Segment [B] ("were accurate" -> "was accurate")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Information" is an uncountable singular noun, so the verb must be "was accurate".' },
    { sent: 'The team completed the project [A] more quicker [B] than the client [C] originally anticipated [D].', ans: 'Segment [B] ("more quicker" -> "more quickly" or "quicker")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Double comparatives like "more quicker" are incorrect; use "more quickly".' },
    { sent: 'Ten miles are [A] a long distance [B] to walk on foot [C] without proper footwear [D].', ans: 'Segment [A] ("Ten miles are" -> "Ten miles is")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Units of distance, time, and money viewed as a single quantity take a singular verb ("is").' },
    { sent: 'She prefers reading technical documentation [A] than attending [B] lengthy introductory [C] video tutorials [D].', ans: 'Segment [B] ("than attending" -> "to attending")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The verb "prefer" takes the preposition "to", not "than" ("prefers X to Y").' },
    { sent: 'Scarcely had the server restarted [A] than a surge [B] of network requests [C] caused it to crash [D].', ans: 'Segment [B] ("than a surge" -> "when a surge")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The correlative pair is "Scarcely... when", not "Scarcely... than".' },
    { sent: 'Every student and every teacher [A] were present [B] at the annual science symposium [C] in the auditorium [D].', ans: 'Segment [B] ("were present" -> "was present")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Subjects preceded by "every" or "each" take singular verbs.' },
    { sent: 'The quality of the mobile displays [A] vary greatly [B] between different manufacturing [C] production batches [D].', ans: 'Segment [B] ("vary greatly" -> "varies greatly")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The head noun is singular "The quality", which requires "varies".' },
    { sent: 'No sooner had the keynote speaker begun [A] when the microphone [B] lost audio connection [C] suddenly [D].', ans: 'Segment [B] ("when the microphone" -> "than the microphone")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The correlative conjunction pair is "No sooner... than", not "when".' },
    { sent: 'The furniture in both conference rooms [A] were replaced [B] with ergonomic chairs [C] last weekend [D].', ans: 'Segment [B] ("were replaced" -> "was replaced")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Furniture" is uncountable and singular, requiring "was replaced".' },
    { sent: 'He is senior than me [A] in the engineering department [B] by at least [C] four years [D].', ans: 'Segment [A] ("senior than me" -> "senior to me")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Comparative adjectives ending in -ior (senior, junior, prior) take "to", not "than".' },
    { sent: 'She is capable to solve [A] the most challenging [B] algorithmic problems [C] with great ease [D].', ans: 'Segment [A] ("capable to solve" -> "capable of solving")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The correct idiom is "capable of + gerund" ("capable of solving").' },
    { sent: 'Although he worked hard [A], but he failed [B] to complete the project [C] before the deadline [D].', ans: 'Segment [B] ("but he failed" -> "he failed")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Do not pair "Although" with "but" in the same complex sentence.' },
    { sent: 'The news about the security breach [A] were broadcasted [B] across international media [C] yesterday [D].', ans: 'Segment [B] ("were broadcasted" -> "was broadcast")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"News" is singular ("was") and the past participle of broadcast is "broadcast".' },
    { sent: 'He walked as if the ground [A] belongs to him [B] wherever he went [C] in the building [D].', ans: 'Segment [B] ("belongs to him" -> "belonged to him")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The hypothetical clause following "as if" requires past tense ("belonged").' },
    { sent: 'The committee have decided [A] to adopt the new policy [B] unanimously after [C] lengthy deliberations [D].', ans: 'Segment [A] ("have decided" -> "has decided")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'A collective noun acting unanimously as a single unit takes a singular verb "has decided".' },
    { sent: 'He is superior than [A] all his competitors [B] in customer service [C] and response time [D].', ans: 'Segment [A] ("superior than" -> "superior to")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Adjectives like superior, inferior, and prior take "to", not "than".' },
    { sent: 'One should always keep [A] his promises [B] when dealing with [C] clients and partners [D].', ans: 'Segment [B] ("his promises" -> "one\'s promises")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The pronoun "one" must be paired with "one\'s", not "his" or "her".' },
    { sent: 'She insisted to pay [A] for the entire dinner [B] at the celebratory [C] team gathering [D].', ans: 'Segment [A] ("insisted to pay" -> "insisted on paying")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Insist" takes the preposition "on" followed by a gerund ("insisted on paying").' },
    { sent: 'The reason why he was absent [A] was because he fell ill [B] during the early hours [C] of the morning [D].', ans: 'Segment [B] ("was because" -> "was that")', d1: 'Segment [A]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'Saying "The reason... was because" is redundant; use "The reason... was that".' },
    { sent: 'Unless you do not submit [A] the required documentation [B], your application will be [C] rejected [D].', ans: 'Segment [A] ("Unless you do not submit" -> "Unless you submit")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Unless" already contains a negative meaning ("if not"); pairing with "do not" creates an erroneous double negative.' },
    { sent: 'He prevented me to access [A] the staging server [B] without prior [C] administrative authorization [D].', ans: 'Segment [A] ("prevented me to access" -> "prevented me from accessing")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: '"Prevent" takes "from + gerund" ("prevented me from accessing").' },
    { sent: 'He congratulated me for [A] winning the prestigious [B] hackathon grand prize [C] last evening [D].', ans: 'Segment [A] ("congratulated me for" -> "congratulated me on")', d1: 'Segment [B]', d2: 'Segment [C]', d3: 'Segment [D]', exp: 'The standard idiom is "congratulate someone ON something", not "for".' },
  ];
  errData.forEach((e) => {
    addQ(
      4,
      'Error Spotting',
      'Medium',
      `Identify the grammatically erroneous segment:\n"${e.sent}"`,
      e.ans,
      e.d1,
      e.d2,
      e.d3,
      e.exp
    );
  });

  // Level 5: Idioms & Phrases (30 distinct idioms)
  const idiomData = [
    { idiom: 'Bite the bullet', ans: 'Face a painful or difficult situation with courage', d1: 'Shoot a weapon accurately', d2: 'Eat food quickly', d3: 'Avoid taking responsibility' },
    { idiom: 'Break the ice', ans: 'Initiate conversation in a social setting to relieve tension', d1: 'Shatter frozen water', d2: 'Cancel an ongoing meeting', d3: 'Argue aggressively with someone' },
    { idiom: 'Burn the midnight oil', ans: 'Work or study late into the night', d1: 'Waste valuable electrical energy', d2: 'Start a fire accidentally', d3: 'Cook an elaborate meal' },
    { idiom: 'Call it a day', ans: 'Stop working on something for the rest of the day', d1: 'Give a name to a date', d2: 'Arrive early at an appointment', d3: 'Celebrate a milestone' },
    { idiom: 'Cut corners', ans: 'Do something in a cheap, hurried, or substandard way', d1: 'Take a geometric shortcut', d2: 'Trim paper precisely', d3: 'Follow strict rules' },
    { idiom: 'Hit the nail on the head', ans: 'Describe exactly what is causing a situation or state a precise truth', d1: 'Hammer a piece of wood', d2: 'Injure oneself while working', d3: 'Make an unfounded guess' },
    { idiom: 'Under the weather', ans: 'Feeling slightly unwell or sick', d1: 'Standing in heavy rain', d2: 'Predicting meteorological trends', d3: 'Traveling by airplane' },
    { idiom: 'Once in a blue moon', ans: 'Happening very rarely', d1: 'Occurring every month', d2: 'During a lunar eclipse', d3: 'Frequently and predictably' },
    { idiom: 'Spill the beans', ans: 'Disclose confidential or secret information prematurely', d1: 'Drop food on the floor', d2: 'Plant seeds in a garden', d3: 'Cook dinner for guests' },
    { idiom: 'The ball is in your court', ans: 'It is your turn to make the next decision or step', d1: 'Play a game of tennis', d2: 'A lost sports ball', d3: 'Winning a sports match' },
    { idiom: 'Throw in the towel', ans: 'Admit defeat or surrender', d1: 'Wash laundry thoroughly', d2: 'Clean up a spill', d3: 'Begin a boxing match' },
    { idiom: 'Blessing in disguise', ans: 'An apparent misfortune that eventually yields positive outcomes', d1: 'A secret religious ceremony', d2: 'A harmful event with no remedy', d3: 'A costume party outfit' },
    { idiom: 'A dime a dozen', ans: 'Very common and of little special value', d1: 'Extremely expensive and rare', d2: 'A collection of ten coins', d3: 'Antique currency' },
    { idiom: 'Add insult to injury', ans: 'Worsen an already unfavorable or painful situation', d1: 'Provide first aid medical treatment', d2: 'Apologize sincerely for mistakes', d3: 'File a legal complaint' },
    { idiom: 'Beat around the bush', ans: 'Avoid talking directly about the main issue', d1: 'Prune overgrown garden plants', d2: 'Search for lost items in the woods', d3: 'Speak boldly without hesitation' },
    { idiom: 'At the eleventh hour', ans: 'At the very last possible moment', d1: 'Late at night before midnight', d2: 'Early in the morning', d3: 'Precisely scheduled on time' },
    { idiom: 'Back to the drawing board', ans: 'Start planning a project anew after previous efforts failed', d1: 'Draw a technical sketch', d2: 'Return to school', d3: 'Erase a whiteboard' },
    { idiom: 'Barking up the wrong tree', ans: 'Pursuing a mistaken line of thought or accusing the wrong person', d1: 'Training a hunting dog', d2: 'Climbing a dangerous trunk', d3: 'Chopping firewood' },
    { idiom: 'Burn bridges', ans: 'Destroy relationships or connections making retreat impossible', d1: 'Demolish physical infrastructure', d2: 'Build river crossings', d3: 'Celebrate with bonfires' },
    { idiom: 'Cry over spilled milk', ans: 'Worry or complain about past mistakes that cannot be undone', d1: 'Clean up a kitchen mess', d2: 'Buy fresh groceries', d3: 'Complain about food quality' },
    { idiom: 'Curiosity killed the cat', ans: 'Being overly inquisitive can lead to trouble', d1: 'Cats are fragile animals', d2: 'Scientists solve mysteries', d3: 'Pets need veterinary care' },
    { idiom: 'Devil\'s advocate', ans: 'Arguing against an idea for the sake of exploring all perspectives', d1: 'An evil legal practitioner', d2: 'A deceitful individual', d3: 'A judge in a courtroom' },
    { idiom: 'Fit as a fiddle', ans: 'In excellent physical health and condition', d1: 'Skilled at playing violin', d2: 'Wearing tailored clothes', d3: 'Slim and delicate' },
    { idiom: 'Hear it on the grapevine', ans: 'Hear rumors or unofficial gossip about something', d1: 'Harvesting vineyard grapes', d2: 'Listening to audio recordings', d3: 'Reading an official newspaper' },
    { idiom: 'In the heat of the moment', ans: 'Overwhelmed by strong immediate emotion without reflection', d1: 'During a summer heatwave', d2: 'Near an open furnace', d3: 'Planning carefully ahead' },
    { idiom: 'Keep someone at arm\'s length', ans: 'Maintain distance and avoid developing close intimacy', d1: 'Measure cloth accurately', d2: 'Push someone physically', d3: 'Hug someone warmly' },
    { idiom: 'Leave no stone unturned', ans: 'Try every possible method to achieve an objective', d1: 'Clear rocks from a field', d2: 'Build a stone pathway', d3: 'Excavate archaeological sites' },
    { idiom: 'Piece of cake', ans: 'Something that is exceptionally easy to accomplish', d1: 'A sweet dessert slice', d2: 'A birthday party snack', d3: 'A complicated recipe' },
    { idiom: 'Steal someone\'s thunder', ans: 'Take credit for someone else\'s achievements or upstage them', d1: 'Create artificial lightning', d2: 'Predict approaching storms', d3: 'Make loud noise in a hall' },
    { idiom: 'Take with a grain of salt', ans: 'View a claim with skepticism and caution', d1: 'Season food before eating', d2: 'Preserve food in brine', d3: 'Accept statements unconditionally' },
  ];
  idiomData.forEach((i) => {
    addQ(
      5,
      'Idioms & Phrases',
      'Easy',
      `What is the accurate figurative meaning of the idiom:\n"${i.idiom}"?`,
      i.ans,
      i.d1,
      i.d2,
      i.d3,
      `Meaning and context: ${i.ans}.`
    );
  });

  // Level 6: One Word Substitution (30 distinct terms)
  const owsData = [
    { desc: 'One who looks at the bright side of things', ans: 'Optimist', d1: 'Pessimist', d2: 'Pacifist', d3: 'Fatalist' },
    { desc: 'One who looks at the dark or negative side of things', ans: 'Pessimist', d1: 'Optimist', d2: 'Altruist', d3: 'Hedonist' },
    { desc: 'A person who loves and works for the welfare of mankind', ans: 'Philanthropist', d1: 'Misanthrope', d2: 'Misogynist', d3: 'Egotist' },
    { desc: 'A person who hates or distrusts humankind', ans: 'Misanthrope', d1: 'Philanthropist', d2: 'Altruist', d3: 'Humanitarian' },
    { desc: 'One who knows everything', ans: 'Omniscient', d1: 'Omnipotent', d2: 'Omnipresent', d3: 'Polyglot' },
    { desc: 'One who is all-powerful', ans: 'Omnipotent', d1: 'Omniscient', d2: 'Omnipresent', d3: 'Invincible' },
    { desc: 'One who is present everywhere simultaneously', ans: 'Omnipresent', d1: 'Omniscient', d2: 'Omnipotent', d3: 'Transient' },
    { desc: 'A person who speaks many languages fluently', ans: 'Polyglot', d1: 'Linguist', d2: 'Orator', d3: 'Monoglot' },
    { desc: 'A remedy that is believed to cure all diseases or problems', ans: 'Panacea', d1: 'Placebo', d2: 'Antibiotic', d3: 'Elixir' },
    { desc: 'A handwritten document or musical work before publication', ans: 'Manuscript', d1: 'Transcript', d2: 'Scroll', d3: 'Draft' },
    { desc: 'A life history of a person written by that same person', ans: 'Autobiography', d1: 'Biography', d2: 'Memoir', d3: 'Monograph' },
    { desc: 'An account of someone\'s life written by another author', ans: 'Biography', d1: 'Autobiography', d2: 'Obituary', d3: 'Chronicle' },
    { desc: 'A person who cannot make a mistake or err', ans: 'Infallible', d1: 'Fallible', d2: 'Flawless', d3: 'Meticulous' },
    { desc: 'That which cannot be read due to illegibility', ans: 'Illegible', d1: 'Ineligible', d2: 'Unreadable', d3: 'Obscure' },
    { desc: 'A person who leaves their own country to settle in another', ans: 'Emigrant', d1: 'Immigrant', d2: 'Refugee', d3: 'Expatriate' },
    { desc: 'A person who comes to live permanently in a foreign country', ans: 'Immigrant', d1: 'Emigrant', d2: 'Tourist', d3: 'Nomad' },
    { desc: 'One who does not believe in the existence of God', ans: 'Atheist', d1: 'Theist', d2: 'Agnostic', d3: 'Devotee' },
    { desc: 'One who is uncertain or claims knowledge of God is impossible', ans: 'Agnostic', d1: 'Atheist', d2: 'Theist', d3: 'Fanatic' },
    { desc: 'A speech delivered without any prior preparation', ans: 'Extempore (or Impromptu)', d1: 'Monologue', d2: 'Dialogue', d3: 'Soliloquy' },
    { desc: 'A person who consumes human flesh', ans: 'Cannibal', d1: 'Carnivore', d2: 'Herbivore', d3: 'Omnivore' },
    { desc: 'Animals that feed exclusively on plants', ans: 'Herbivore', d1: 'Carnivore', d2: 'Omnivore', d3: 'Insectivore' },
    { desc: 'Animals that prey upon and eat flesh', ans: 'Carnivore', d1: 'Herbivore', d2: 'Omnivore', d3: 'Parasite' },
    { desc: 'One who eats both plants and animals', ans: 'Omnivore', d1: 'Carnivore', d2: 'Herbivore', d3: 'Vegetarian' },
    { desc: 'A doctor who specializes in treating skin diseases', ans: 'Dermatologist', d1: 'Cardiologist', d2: 'Neurologist', d3: 'Ophthalmologist' },
    { desc: 'A doctor who specializes in heart and cardiovascular diseases', ans: 'Cardiologist', d1: 'Dermatologist', d2: 'Pediatrician', d3: 'Orthopedic' },
    { desc: 'A specialist who studies and treats nervous system disorders', ans: 'Neurologist', d1: 'Nephrologist', d2: 'Oncologist', d3: 'Radiologist' },
    { desc: 'A place where dead bodies are kept for identification and post-mortem', ans: 'Mortuary (or Morgue)', d1: 'Cemetery', d2: 'Crematorium', d3: 'Sanatorium' },
    { desc: 'A place where books and reference media are housed for borrowing', ans: 'Library', d1: 'Museum', d2: 'Archive', d3: 'Auditorium' },
    { desc: 'A place where historical records and government documents are preserved', ans: 'Archives', d1: 'Library', d2: 'Armory', d3: 'Arsenal' },
    { desc: 'A state of lawlessness and total absence of government rule', ans: 'Anarchy', d1: 'Monarchy', d2: 'Oligarchy', d3: 'Democracy' },
  ];
  owsData.forEach((o) => {
    addQ(
      6,
      'One Word Substitution',
      'Medium',
      `Select the precise single word for the phrase:\n"${o.desc}"`,
      o.ans,
      o.d1,
      o.d2,
      o.d3,
      `Exact substitution: "${o.desc}" is an ${o.ans}.`
    );
  });

  // Level 7: Para Jumbles & Sentence Ordering (30 distinct puzzles)
  const pjData = [
    { p: 'P: Cloud computing enables on-demand access to shared compute resources.\nQ: These resources include servers, storage, applications, and network services.\nR: Users can provision them rapidly with minimal management overhead.\nS: As a result, businesses reduce capital infrastructure expenditure significantly.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - S - P - Q', exp: 'Logical flow: Definition (P) -> Elaboration (Q) -> User capability (R) -> Consequent benefit (S).' },
    { p: 'P: Clean code adheres to standardized formatting and naming conventions.\nQ: It makes maintenance seamless for future developers joining the project.\nR: This reduces bug frequency and accelerates delivery velocity.\nS: Consequently, engineering teams spend less time firefighting in production.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - S - P - R', d3: 'R - P - S - Q', exp: 'Logical flow: Property of clean code (P) -> Direct developer benefit (Q) -> Project impact (R) -> Outcome (S).' },
    { p: 'P: Version control systems record modifications to source files over time.\nQ: Developers can recall specific versions and revert unwanted bugs.\nR: Distributed tools like Git enable parallel branching across teams.\nS: This collaborative framework prevents code overwrite conflicts.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'Q - S - P - R', d3: 'S - R - Q - P', exp: 'Logical progression: Core function (P) -> Individual utility (Q) -> Team expansion (R) -> Collective resolution (S).' },
    { p: 'P: Agile methodologies emphasize iterative software development cycles.\nQ: Cross-functional teams collaborate in short sprints of two to four weeks.\nR: Continuous customer feedback informs the priorities of upcoming sprints.\nS: Thus, the final product remains closely aligned with evolving market needs.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - S - P - Q', exp: 'Concept (P) -> Mechanism (Q) -> Feedback loop (R) -> Strategic alignment (S).' },
    { p: 'P: Microservices divide large monoliths into small, independent services.\nQ: Each microservice communicates using lightweight protocols like HTTP or gRPC.\nR: Teams can deploy and scale services independently without global lockups.\nS: However, distributed tracing and network complexity must be carefully managed.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - R - S - P', d3: 'R - Q - P - S', exp: 'Definition (P) -> Inter-communication (Q) -> Primary advantage (R) -> Trade-off caution (S).' },
    { p: 'P: Relational databases organize structured data into indexed tables.\nQ: Primary and foreign keys enforce referential integrity across entities.\nR: Structured Query Language (SQL) enables powerful declarative queries.\nS: Transactional ACID guarantees ensure consistency even during power failures.', ans: 'P - Q - R - S', d1: 'Q - P - R - S', d2: 'S - R - Q - P', d3: 'R - P - S - Q', exp: 'Structure (P) -> Relationships (Q) -> Query interface (R) -> Reliability properties (S).' },
    { p: 'P: Continuous Integration (CI) automatically builds and tests every code commit.\nQ: Automated test suites verify unit logic and integration boundaries.\nR: When a build breaks, developers receive immediate notification to fix it.\nS: This practice prevents broken code from ever reaching production environments.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'S - Q - P - R', d3: 'Q - S - R - P', exp: 'Definition (P) -> Verification (Q) -> Feedback (R) -> Quality protection (S).' },
    { p: 'P: Object-Oriented Programming models real-world entities as objects.\nQ: Classes define attributes and methods that encapsulate internal state.\nR: Inheritance enables child classes to reuse and extend parent behaviors.\nS: Polymorphism allows different classes to respond uniquely to shared method calls.', ans: 'P - Q - R - S', d1: 'S - R - Q - P', d2: 'Q - P - R - S', d3: 'R - S - P - Q', exp: 'Foundational paradigm (P) -> Encapsulation (Q) -> Inheritance (R) -> Polymorphism (S).' },
    { p: 'P: Distributed caching stores frequent query responses in high-speed RAM.\nQ: In-memory stores like Redis return data in sub-millisecond latencies.\nR: This prevents repetitive query execution from overwhelming persistent databases.\nS: As a consequence, web applications achieve high concurrency and throughput.', ans: 'P - Q - R - S', d1: 'Q - S - P - R', d2: 'S - P - R - Q', d3: 'R - Q - P - S', exp: 'Mechanism (P) -> Technology (Q) -> Database protection (R) -> Throughput result (S).' },
    { p: 'P: Asynchronous JavaScript allows non-blocking execution in single-threaded runtimes.\nQ: Promises and async/await syntax handle long-running I/O operations elegantly.\nR: The event loop continues processing user input and rendering updates concurrently.\nS: Consequently, web applications remain smooth and responsive under load.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - R - P - S', d3: 'R - S - Q - P', exp: 'Concept (P) -> Syntax (Q) -> Event loop (R) -> UX outcome (S).' },
    { p: 'P: Encryption scrambles plaintext into unreadable ciphertext using cryptographic keys.\nQ: Symmetric ciphers use the same secret key for both encryption and decryption.\nR: Asymmetric ciphers use paired public and private keys for secure key exchange.\nS: Together, they establish secure end-to-end communication channels over HTTPS.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - Q - P - S', exp: 'Broad definition (P) -> Symmetric (Q) -> Asymmetric (R) -> Combined HTTPS protocol (S).' },
    { p: 'P: Load balancers distribute incoming network traffic across multiple server instances.\nQ: Health checks monitor each server and reroute traffic away from unhealthy nodes.\nR: This horizontal scaling architecture prevents single points of failure.\nS: Users experience continuous availability even during routine rolling deployments.', ans: 'P - Q - R - S', d1: 'S - R - Q - P', d2: 'Q - P - R - S', d3: 'R - S - P - Q', exp: 'Role (P) -> Monitoring (Q) -> Architecture benefit (R) -> High availability (S).' },
    { p: 'P: Containers package application source code together with all runtime dependencies.\nQ: Docker engine ensures identical execution across local dev and cloud clusters.\nR: This completely eliminates the classic "it works on my machine" dilemma.\nS: Deployment pipelines become fast, predictable, and fully reproducible.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'S - Q - P - R', d3: 'Q - S - R - P', exp: 'Packaging (P) -> Environment parity (Q) -> Problem solved (R) -> CI/CD benefit (S).' },
    { p: 'P: Automated monitoring collects system metrics, application logs, and network traces.\nQ: Time-series dashboards visualize CPU usage, memory consumption, and error rates.\nR: Threshold breach alerts notify on-call engineers via SMS or Slack immediately.\nS: This enables rapid incident response before customer experience is degraded.', ans: 'P - Q - R - S', d1: 'Q - P - R - S', d2: 'S - R - Q - P', d3: 'R - P - S - Q', exp: 'Data collection (P) -> Visualization (Q) -> Alerting (R) -> Incident remediation (S).' },
    { p: 'P: WebSockets provide full-duplex, persistent communication over a single TCP socket.\nQ: Unlike HTTP polling, either the client or server can push messages instantly.\nR: This low overhead makes WebSockets ideal for multiplayer games and live chat.\nS: Users receive immediate real-time updates without page refreshes.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - S - P - R', d3: 'R - Q - S - P', exp: 'Protocol definition (P) -> Comparison with polling (Q) -> Use cases (R) -> Real-time benefit (S).' },
    { p: 'P: Garbage collection automatically reclaims heap memory from unreachable objects.\nQ: Mark-and-sweep algorithms identify objects that have no remaining live references.\nR: Freeing unused memory prevents memory leaks and fatal out-of-memory crashes.\nS: Developers are relieved from tedious manual memory allocation and deallocation.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - P - Q', d3: 'R - Q - S - P', exp: 'Purpose (P) -> Algorithm mechanism (Q) -> System safety (R) -> Developer productivity (S).' },
    { p: 'P: Indexing in databases creates auxiliary lookup trees for specific table columns.\nQ: B-Trees and Hash indexes reduce query search complexity from O(N) to O(log N).\nR: While read queries become dramatically faster, write operations incur slight overhead.\nS: Therefore, index design requires balancing query frequency against insert volume.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'S - Q - P - R', d3: 'Q - S - R - P', exp: 'Concept (P) -> Algorithmic gain (Q) -> Trade-off (R) -> Architectural balance (S).' },
    { p: 'P: DNS translates human-readable domain names into numerical IP addresses.\nQ: Recursive resolvers query root, TLD, and authoritative name servers sequentially.\nR: Cached DNS records accelerate repeat lookups at ISP and browser levels.\nS: Browsers then establish direct TCP connections to the resolved web server.', ans: 'P - Q - R - S', d1: 'S - R - Q - P', d2: 'Q - P - R - S', d3: 'R - S - P - Q', exp: 'Function (P) -> Resolution hierarchy (Q) -> Caching (R) -> Connection establishment (S).' },
    { p: 'P: Search engine optimization (SEO) improves organic ranking on search engine result pages.\nQ: Technical SEO ensures fast loading speeds, mobile responsiveness, and clean sitemaps.\nR: High-quality content with relevant keywords attracts organic backlinks.\nS: Over time, web properties gain authoritative domain rank and sustained visitor traffic.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - Q - P - S', exp: 'Goal (P) -> Technical factors (Q) -> Content factors (R) -> Long-term ranking (S).' },
    { p: 'P: Progressive Web Apps (PWAs) deliver app-like experiences within standard browsers.\nQ: Service workers cache static assets and data for offline functionality.\nR: Web app manifests enable users to install the web app onto their mobile home screens.\nS: Businesses achieve cross-platform reach without managing multiple native app stores.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - R - P - S', d3: 'R - S - Q - P', exp: 'Definition (P) -> Offline mechanism (Q) -> Installability (R) -> Cross-platform ROI (S).' },
    { p: 'P: Machine learning algorithms learn statistical patterns directly from historical training data.\nQ: Supervised learning models map labeled input features to known target outputs.\nR: Hyperparameter tuning and validation checks prevent overfitting on noise.\nS: The trained model can then make accurate predictions on previously unseen datasets.', ans: 'P - Q - R - S', d1: 'Q - P - R - S', d2: 'S - R - Q - P', d3: 'R - P - S - Q', exp: 'Foundation (P) -> Supervised paradigm (Q) -> Model regularization (R) -> Generalization (S).' },
    { p: 'P: Responsive design adapts web layouts fluidly across smartphones, tablets, and desktops.\nQ: CSS media queries adjust column grids, font sizes, and image dimensions dynamically.\nR: Fluid flexbox and CSS grid layouts ensure components stack naturally on narrow viewports.\nS: Users enjoy an optimal visual reading and interaction experience on any device.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'S - Q - P - R', d3: 'Q - S - R - P', exp: 'Goal (P) -> Media queries (Q) -> Grid mechanics (R) -> Cross-device UX (S).' },
    { p: 'P: Serverless computing allows developers to deploy code without managing VM infrastructure.\nQ: Cloud providers automatically execute code in response to incoming events or API requests.\nR: Billing is calculated strictly on execution duration down to the millisecond.\nS: Organizations save operational overhead and eliminate idle compute costs.', ans: 'P - Q - R - S', d1: 'S - R - Q - P', d2: 'Q - P - R - S', d3: 'R - S - P - Q', exp: 'Model (P) -> Event-driven execution (Q) -> Pricing model (R) -> Operational savings (S).' },
    { p: 'P: Graph data structures represent non-linear relationships between interconnected nodes.\nQ: Edges define directional or bi-directional connections between pairs of vertices.\nR: Traversal algorithms like Breadth-First Search find the shortest path between nodes.\nS: Social networks and routing engines rely heavily on graphs for friend and path queries.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - Q - P - S', exp: 'Structure (P) -> Components (Q) -> Algorithms (R) -> Real-world applications (S).' },
    { p: 'P: Static site generators compile Markdown and components into pre-rendered HTML files.\nQ: These static assets are distributed globally across edge content delivery networks.\nR: Serving static HTML bypasses server-side runtime database queries entirely.\nS: This delivers near-instantaneous page loads and impenetrable server security.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - R - P - S', d3: 'R - S - Q - P', exp: 'Build step (P) -> CDN distribution (Q) -> Query avoidance (R) -> Speed & security (S).' },
    { p: 'P: Code linting tools automatically scan source code for syntax flaws and style violations.\nQ: Static analysis rules enforce uniform indentation, quote styles, and naming standards.\nR: Pre-commit hooks block non-compliant code before it can be pushed to remote repositories.\nS: Code reviews can then focus entirely on business logic rather than formatting debates.', ans: 'P - Q - R - S', d1: 'Q - P - R - S', d2: 'S - R - Q - P', d3: 'R - P - S - Q', exp: 'Tool purpose (P) -> Rule enforcement (Q) -> Automated gating (R) -> Review efficiency (S).' },
    { p: 'P: Dependency injection passes service dependencies into objects rather than hardcoding them.\nQ: This decouples components and adheres strictly to the Inversion of Control principle.\nR: Unit tests can easily substitute mock objects for external databases or third-party APIs.\nS: As a result, codebases become significantly more testable and modular.', ans: 'P - Q - R - S', d1: 'R - P - Q - S', d2: 'S - Q - P - R', d3: 'Q - S - R - P', exp: 'Mechanism (P) -> Architectural principle (Q) -> Testing advantage (R) -> Maintainability (S).' },
    { p: 'P: GraphQL enables clients to request exactly the data fields they require in a single query.\nQ: A strongly-typed schema defines types, relationships, and queries explicitly.\nR: This eliminates both the over-fetching and under-fetching common in traditional REST APIs.\nS: Mobile clients save cellular bandwidth and reduce battery consumption.', ans: 'P - Q - R - S', d1: 'S - R - Q - P', d2: 'Q - P - R - S', d3: 'R - S - P - Q', exp: 'Core benefit (P) -> Schema (Q) -> Solves REST flaws (R) -> Mobile efficiency (S).' },
    { p: 'P: Dark mode interfaces utilize dark background palettes with high-contrast text.\nQ: OLED displays consume significantly less battery power when rendering dark pixels.\nR: Dimmer screen illumination reduces eye fatigue during nighttime work sessions.\nS: Consequently, dark mode has become an essential user-configurable UI standard.', ans: 'P - Q - R - S', d1: 'Q - P - S - R', d2: 'S - R - Q - P', d3: 'R - Q - P - S', exp: 'Concept (P) -> Hardware efficiency (Q) -> Ergonomic benefit (R) -> Industry standard (S).' },
    { p: 'P: Continuous Deployment extends CI by automatically releasing validated builds to production.\nQ: Automated smoke tests and canary releases verify the deployment against real traffic.\nR: If error metrics spike, automated rollbacks instantly revert to the last stable release.\nS: This minimizes release risk while shipping updates to users multiple times a day.', ans: 'P - Q - R - S', d1: 'S - P - Q - R', d2: 'Q - R - P - S', d3: 'R - S - Q - P', exp: 'CD concept (P) -> Canary verification (Q) -> Automated rollback safety (R) -> Deployment speed (S).' },
  ];
  pjData.forEach((pj) => {
    addQ(
      7,
      'Para Jumbles',
      'Hard',
      `Rearrange the four scrambled sentences to form a coherent, logically connected paragraph:\n\n${pj.p}`,
      pj.ans,
      pj.d1,
      pj.d2,
      pj.d3,
      `Paragraph structure: ${pj.exp}`
    );
  });

  // Level 8: Active & Passive Voice (30 distinct transformation questions)
  const voiceData = [
    { act: 'The senior architect designed the distributed database schema.', pass: 'The distributed database schema was designed by the senior architect.', d1: 'The distributed database schema has designed by the senior architect.', d2: 'The senior architect was designing the database schema.', d3: 'The database schema is designed by the architect.' },
    { act: 'The QA engineer identified three critical security bugs.', pass: 'Three critical security bugs were identified by the QA engineer.', d1: 'Three critical security bugs had identified by the QA engineer.', d2: 'The QA engineer was identified by three bugs.', d3: 'Three critical security bugs are identified.' },
    { act: 'The automated pipeline deployed the application to production.', pass: 'The application was deployed to production by the automated pipeline.', d1: 'The application had deployed by the pipeline.', d2: 'The production is deploying the application.', d3: 'The automated pipeline was deployed.' },
    { act: 'The compiler caught several syntax errors during the build.', pass: 'Several syntax errors were caught by the compiler during the build.', d1: 'Several syntax errors have caught by the compiler.', d2: 'The compiler was caught by syntax errors.', d3: 'Several syntax errors are being caught.' },
    { act: 'The CEO announced the company expansion at the townhall.', pass: 'The company expansion was announced by the CEO at the townhall.', d1: 'The company expansion had announced by the CEO.', d2: 'The townhall was announced by the company expansion.', d3: 'The CEO was announced by expansion.' },
    { act: 'The DevOps engineer configured the Kubernetes ingress controller.', pass: 'The Kubernetes ingress controller was configured by the DevOps engineer.', d1: 'The Kubernetes ingress controller is configured by DevOps.', d2: 'The DevOps engineer was configured by Kubernetes.', d3: 'The ingress controller has configured.' },
    { act: 'The product designer crafted an intuitive onboarding flow.', pass: 'An intuitive onboarding flow was crafted by the product designer.', d1: 'An intuitive onboarding flow is crafted by product designer.', d2: 'The product designer was crafted by onboarding.', d3: 'An intuitive flow has crafted.' },
    { act: 'The database administrator restored the backup snapshot after the outage.', pass: 'The backup snapshot was restored by the database administrator after the outage.', d1: 'The backup snapshot had restored by the administrator.', d2: 'The outage was restored by the database administrator.', d3: 'The administrator was restored.' },
    { act: 'The research team published a groundbreaking paper on machine learning.', pass: 'A groundbreaking paper on machine learning was published by the research team.', d1: 'A groundbreaking paper had published by the team.', d2: 'The research team was published by paper.', d3: 'A groundbreaking paper is published.' },
    { act: 'The security specialist patched the zero-day vulnerability in the API gateway.', pass: 'The zero-day vulnerability in the API gateway was patched by the security specialist.', d1: 'The zero-day vulnerability had patched by the specialist.', d2: 'The security specialist was patched by the vulnerability.', d3: 'The API gateway has patched.' },
    { act: 'The algorithm sorted the array of integers in logarithmic time.', pass: 'The array of integers was sorted by the algorithm in logarithmic time.', d1: 'The array of integers has sorted by algorithm.', d2: 'The algorithm was sorted by array.', d3: 'The array is sorted.' },
    { act: 'The team completed all sprint backlog tasks ahead of schedule.', pass: 'All sprint backlog tasks were completed by the team ahead of schedule.', d1: 'All sprint backlog tasks had completed by team.', d2: 'The team was completed by backlog tasks.', d3: 'All tasks are completed.' },
    { act: 'The frontend engineer optimized the image assets for faster loading.', pass: 'The image assets were optimized by the frontend engineer for faster loading.', d1: 'The image assets have optimized by frontend engineer.', d2: 'The frontend engineer was optimized by image assets.', d3: 'The image assets is optimized.' },
    { act: 'The author wrote a bestselling novel about ancient civilizations.', pass: 'A bestselling novel about ancient civilizations was written by the author.', d1: 'A bestselling novel had written by author.', d2: 'The author was written by novel.', d3: 'A bestselling novel is written.' },
    { act: 'The mechanic repaired the car\'s transmission yesterday.', pass: 'The car\'s transmission was repaired by the mechanic yesterday.', d1: 'The car\'s transmission has repaired by mechanic.', d2: 'The mechanic was repaired by transmission.', d3: 'The car is repaired.' },
    { act: 'The committee approved the revised environmental guidelines.', pass: 'The revised environmental guidelines were approved by the committee.', d1: 'The revised environmental guidelines had approved by committee.', d2: 'The committee was approved by guidelines.', d3: 'The guidelines are approved.' },
    { act: 'The browser executed the JavaScript script asynchronously.', pass: 'The JavaScript script was executed asynchronously by the browser.', d1: 'The JavaScript script has executed asynchronously.', d2: 'The browser was executed by script.', d3: 'The script is executing.' },
    { act: 'The chef prepared a gourmet three-course meal for the guests.', pass: 'A gourmet three-course meal was prepared by the chef for the guests.', d1: 'A gourmet meal had prepared by chef.', d2: 'The chef was prepared by meal.', d3: 'A gourmet meal is prepared.' },
    { act: 'The auditor examined all financial transactions from the previous quarter.', pass: 'All financial transactions from the previous quarter were examined by the auditor.', d1: 'All financial transactions had examined by auditor.', d2: 'The auditor was examined by transactions.', d3: 'All transactions are examined.' },
    { act: 'The teacher praised the students for their outstanding project presentation.', pass: 'The students were praised by the teacher for their outstanding project presentation.', d1: 'The students had praised by teacher.', d2: 'The teacher was praised by project presentation.', d3: 'The students are praised.' },
    { act: 'The storm destroyed several power transmission lines across the county.', pass: 'Several power transmission lines were destroyed by the storm across the county.', d1: 'Several lines had destroyed by storm.', d2: 'The storm was destroyed by power lines.', d3: 'Several lines are destroyed.' },
    { act: 'The system administrator configured the firewall rules to block unauthorized IPs.', pass: 'The firewall rules were configured by the system administrator to block unauthorized IPs.', d1: 'The firewall rules had configured by administrator.', d2: 'The administrator was configured by firewall.', d3: 'The firewall rules are configured.' },
    { act: 'The company launched an innovative mobile banking application.', pass: 'An innovative mobile banking application was launched by the company.', d1: 'An innovative mobile banking application had launched by company.', d2: 'The company was launched by application.', d3: 'An application is launched.' },
    { act: 'The musician composed a symphony that moved the entire audience.', pass: 'A symphony that moved the entire audience was composed by the musician.', d1: 'A symphony had composed by musician.', d2: 'The musician was composed by symphony.', d3: 'A symphony is composed.' },
    { act: 'The detective solved the perplexing burglary mystery within two days.', pass: 'The perplexing burglary mystery was solved by the detective within two days.', d1: 'The mystery had solved by detective.', d2: 'The detective was solved by mystery.', d3: 'The mystery is solved.' },
    { act: 'The artist painted a vibrant mural on the public library wall.', pass: 'A vibrant mural was painted by the artist on the public library wall.', d1: 'A vibrant mural had painted by artist.', d2: 'The artist was painted by mural.', d3: 'A mural is painted.' },
    { act: 'The technician calibrated the laboratory sensors before the experiment.', pass: 'The laboratory sensors were calibrated by the technician before the experiment.', d1: 'The laboratory sensors had calibrated by technician.', d2: 'The technician was calibrated by sensors.', d3: 'The sensors are calibrated.' },
    { act: 'The director scheduled a mandatory all-hands briefing for Monday morning.', pass: 'A mandatory all-hands briefing was scheduled by the director for Monday morning.', d1: 'A mandatory briefing had scheduled by director.', d2: 'The director was scheduled by briefing.', d3: 'A briefing is scheduled.' },
    { act: 'The barista brewed a fresh pot of artisanal espresso.', pass: 'A fresh pot of artisanal espresso was brewed by the barista.', d1: 'A fresh pot of espresso had brewed by barista.', d2: 'The barista was brewed by espresso.', d3: 'A fresh pot is brewed.' },
    { act: 'The editor revised the manuscript to improve clarity and pacing.', pass: 'The manuscript was revised by the editor to improve clarity and pacing.', d1: 'The manuscript had revised by editor.', d2: 'The editor was revised by manuscript.', d3: 'The manuscript is revised.' },
  ];
  voiceData.forEach((v) => {
    addQ(
      8,
      'Active & Passive Voice',
      'Easy',
      `Convert the active sentence into correct passive voice:\n"${v.act}"`,
      v.pass,
      v.d1,
      v.d2,
      v.d3,
      `Passive voice transformation rule: Subject and object swap with appropriate past participle form ("was/were + V3").`
    );
  });

  // Level 9: Reading Comprehension & Inferences (30 distinct passages)
  const rcData = [
    { p: 'Passage: Photosynthesis in green plants converts solar energy into chemical energy stored as glucose, absorbing carbon dioxide and releasing vital oxygen.', q: 'What is the primary atmospheric gas released as a byproduct of photosynthesis?', ans: 'Oxygen', d1: 'Carbon dioxide', d2: 'Methane', d3: 'Nitrogen' },
    { p: 'Passage: The Doppler effect describes the perceived shift in frequency of a wave when the wave source and observer move relative to one another.', q: 'What condition causes the Doppler effect to occur?', ans: 'Relative motion between the wave source and observer', d1: 'Constant static distance between objects', d2: 'Extreme high temperatures in vacuum', d3: 'Complete absence of atmospheric air' },
    { p: 'Passage: Renewable energy sources, such as wind and solar, produce minimal greenhouse gases compared to fossil fuels, mitigating long-term climate risks.', q: 'What is the key environmental advantage of renewable energy highlighted in the passage?', ans: 'Generating minimal greenhouse gas emissions', d1: 'Requiring zero land area', d2: 'Operating without any initial capital cost', d3: 'Being immune to weather changes' },
    { p: 'Passage: Microprocessors execute machine instructions through a repeating fetch-decode-execute cycle orchestrated by the internal clock crystal.', q: 'What component coordinates the timing of instruction execution cycles?', ans: 'The internal clock crystal', d1: 'The external hard disk drive', d2: 'The operating system kernel', d3: 'The optical display monitor' },
    { p: 'Passage: Antibiotic resistance emerges when bacterial populations undergo mutations that allow them to survive exposure to therapeutic antimicrobial drugs.', q: 'How does antibiotic resistance develop in bacteria according to the text?', ans: 'Through genetic mutations that enable survival against antimicrobial drugs', d1: 'By consuming synthetic dietary vitamins', d2: 'Through viral immunization therapy', d3: 'By avoiding all contact with hosts' },
    { p: 'Passage: Open-source software licenses grant users the legal right to inspect, modify, and distribute source code freely under defined terms.', q: 'What fundamental freedom do open-source licenses provide developers?', ans: 'The right to inspect, modify, and redistribute source code', d1: 'Guaranteed lifetime monetary compensation', d2: 'Exemption from all legal copyright laws', d3: 'Free proprietary hardware servers' },
    { p: 'Passage: The human brain consumes approximately 20% of the body\'s total resting metabolic energy despite accounting for only 2% of body weight.', q: 'What is the relationship between brain mass and energy consumption described in the text?', ans: 'The brain uses a disproportionately large share (20%) of resting energy relative to its 2% mass', d1: 'Brain mass exactly equals energy percentage', d2: 'The brain requires zero metabolic energy', d3: 'Energy consumption is solely dependent on muscle mass' },
    { p: 'Passage: Coral reefs provide critical habitat for roughly 25% of all marine species while occupying less than 1% of the total ocean floor.', q: 'Why are coral reefs ecologically significant according to the passage?', ans: 'They support 25% of marine biodiversity despite occupying under 1% of ocean floor', d1: 'They produce 100% of global oceanic freshwater', d2: 'They eliminate all ocean currents', d3: 'They are completely immune to ocean temperatures' },
    { p: 'Passage: Artificial neural networks adjust internal synaptic weights through backpropagation to minimize predictive error on training data.', q: 'What is the purpose of backpropagation in artificial neural networks?', ans: 'To adjust weights in order to minimize predictive error', d1: 'To erase all training data permanently', d2: 'To increase memory latency in hardware', d3: 'To generate random numbers' },
    { p: 'Passage: The water cycle operates continuously through evaporation, condensation, precipitation, and collection back into oceans and aquifers.', q: 'Which process in the water cycle turns vapor back into liquid droplets?', ans: 'Condensation', d1: 'Evaporation', d2: 'Sublimation', d3: 'Transpiration' },
    { p: 'Passage: Plate tectonics explains continental drift and earthquake activity through the slow movement of lithospheric plates over the asthenosphere.', q: 'What geological phenomena are explained by plate tectonics according to the text?', ans: 'Continental drift and earthquake activity', d1: 'Ocean tides caused by lunar gravity', d2: 'Atmospheric cloud formation patterns', d3: 'Solar flare eruptions' },
    { p: 'Passage: Compilers translate high-level programming language code into low-level machine code before execution, enabling optimization.', q: 'What is the primary function of a compiler?', ans: 'Translating high-level source code into low-level machine code', d1: 'Interpreting source code line by line during runtime', d2: 'Executing code in the browser DOM', d3: 'Formatting CSS styles' },
    { p: 'Passage: Honeybees communicate the distance and direction of rich nectar sources to hive members through an intricate figure-eight waggle dance.', q: 'How do honeybees communicate the location of food to hive mates?', ans: 'Through a figure-eight waggle dance', d1: 'By emitting ultrasonic acoustic clicks', d2: 'By flashing bioluminescent colors', d3: 'Through telepathic signals' },
    { p: 'Passage: Moore\'s Law was an empirical observation by Gordon Moore that the number of transistors on a microchip roughly doubles every two years.', q: 'What did Moore\'s Law historically predict regarding microchips?', ans: 'Transistor density on microchips roughly doubles every two years', d1: 'Microchip retail prices double every month', d2: 'Software bug frequency decreases by half weekly', d3: 'Computer power consumption doubles annually' },
    { p: 'Passage: The ozone layer in the stratosphere shields life on Earth by absorbing the vast majority of harmful ultraviolet (UV) radiation from the Sun.', q: 'What vital protective role does the stratospheric ozone layer serve?', ans: 'Absorbing harmful solar ultraviolet (UV) radiation', d1: 'Trapping industrial greenhouse gases', d2: 'Creating lightning storms in the troposphere', d3: 'Reflecting radio waves back to orbit' },
    { p: 'Passage: In physics, the law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another.', q: 'What does the law of conservation of energy fundamentally assert?', ans: 'Energy cannot be created or destroyed, only transformed', d1: 'Energy naturally diminishes into nothingness', d2: 'Energy is created spontaneously in chemical reactions', d3: 'Kinetic energy cannot become potential energy' },
    { p: 'Passage: Asynchronous I/O operations allow computer programs to issue input/output requests without blocking CPU execution while waiting for responses.', q: 'What is the core benefit of asynchronous I/O described in the passage?', ans: 'The CPU continues executing other tasks without blocking on I/O responses', d1: 'I/O operations become completely instantaneous', d2: 'Storage devices no longer require electricity', d3: 'Memory leaks are eliminated automatically' },
    { p: 'Passage: Mitochondria are specialized cellular organelles responsible for generating adenosine triphosphate (ATP), the primary energy currency of eukaryotic cells.', q: 'What is the biological function of mitochondria in eukaryotic cells?', ans: 'Generating ATP, the main energy currency of the cell', d1: 'Synthesizing DNA strands in the nucleus', d2: 'Filtering extracellular toxins in blood', d3: 'Regulating body temperature directly' },
    { p: 'Passage: Public-key cryptography uses an asymmetric pair of keys: a public key for encryption and a distinct private key for decryption.', q: 'Which key is used to decrypt ciphertext in asymmetric public-key cryptography?', ans: 'The recipient\'s private key', d1: 'The sender\'s public key', d2: 'A shared symmetric password', d3: 'The Certificate Authority\'s root key' },
    { p: 'Passage: The Hubble Space Telescope operates outside the distorting effects of Earth\'s atmosphere, allowing it to capture ultra-sharp astronomical images.', q: 'Why does Hubble capture clearer images than ground telescopes according to the text?', ans: 'It operates above the distorting atmosphere of Earth', d1: 'It is closer to distant galaxies by millions of miles', d2: 'It uses larger glass mirrors than any ground telescope', d3: 'It only operates during solar eclipses' },
    { p: 'Passage: In economics, the law of supply and demand states that market equilibrium price is established where the quantity supplied equals quantity demanded.', q: 'How is market equilibrium price determined according to the law of supply and demand?', ans: 'At the point where quantity supplied equals quantity demanded', d1: 'By government decree alone', d2: 'By the maximum price consumers are willing to spend', d3: 'By raw manufacturing cost only' },
    { p: 'Passage: Vaccines stimulate the immune system to produce antibodies and memory cells without causing the active disease, conferring future immunity.', q: 'How do vaccines provide protective immunity?', ans: 'By stimulating antibody and memory cell production without causing disease', d1: 'By eliminating all viruses from the environment', d2: 'By directly altering human genetic DNA sequences', d3: 'By killing bacterial flora permanently' },
    { p: 'Passage: Deadlocks in concurrent operating systems occur when two or more processes are permanently blocked because each holds a resource needed by another.', q: 'What causes a deadlock in concurrent systems according to the passage?', ans: 'Processes blocked indefinitely while holding resources required by each other', d1: 'A power surge damaging the motherboard', d2: 'A single process executing an infinite loop', d3: 'Running out of disk storage space' },
    { p: 'Passage: The Doppler radar uses frequency shifts in reflected microwave pulses to measure the velocity of precipitation and severe wind currents.', q: 'What does Doppler radar measure using reflected frequency shifts?', ans: 'The velocity and movement of precipitation and winds', d1: 'The chemical composition of raindrops', d2: 'The atmospheric temperature at ground level', d3: 'The altitude of distant satellites' },
    { p: 'Passage: Semantic HTML utilizes descriptive markup tags such as <article>, <nav>, and <header> to convey document structure to browsers and screen readers.', q: 'What is the main purpose of semantic HTML tags described in the text?', ans: 'To convey meaningful document structure to browsers and assistive technologies', d1: 'To apply custom visual CSS colors automatically', d2: 'To execute JavaScript logic faster', d3: 'To reduce web server hosting costs' },
    { p: 'Passage: The greenhouse effect is a natural process where atmospheric gases trap infrared heat emitted from Earth\'s surface, maintaining habitable temperatures.', q: 'What role does the natural greenhouse effect play on Earth?', ans: 'Trapping heat radiation to maintain habitable planetary temperatures', d1: 'Preventing asteroids from entering the atmosphere', d2: 'Blocking all sunlight from reaching the ground', d3: 'Freezing ocean waters at the poles' },
    { p: 'Passage: RAID 1 (mirroring) duplicates identical data across two or more storage drives to provide fault tolerance against single-drive failures.', q: 'What is the primary purpose of RAID 1 storage configuration?', ans: 'Data mirroring across drives to provide fault tolerance against hardware failure', d1: 'Maximizing read and write throughput via data striping without parity', d2: 'Compressing files into encrypted ZIP archives', d3: 'Increasing storage capacity by summing all drive sizes' },
    { p: 'Passage: The human circulatory system transports oxygenated blood from the left ventricle of the heart through systemic arteries to body tissues.', q: 'From which chamber of the heart is oxygenated blood pumped into systemic circulation?', ans: 'The left ventricle', d1: 'The right atrium', d2: 'The right ventricle', d3: 'The pulmonary artery' },
    { p: 'Passage: In computing, caching stores duplicate data in fast-access memory so that subsequent requests for the same data can be served with lower latency.', q: 'Why is caching implemented in computing systems according to the text?', ans: 'To serve repeat data requests with lower latency from high-speed memory', d1: 'To permanently archive old records', d2: 'To replace persistent SQL databases entirely', d3: 'To encrypt sensitive user passwords' },
    { p: 'Passage: Glaciers act as natural freshwater reservoirs, storing snow during cold seasons and releasing meltwater gradually to sustain river basins in summer.', q: 'What ecological service do glaciers perform according to the passage?', ans: 'Storing frozen water and releasing meltwater to sustain rivers during dry seasons', d1: 'Increasing global ocean salt concentrations', d2: 'Preventing wind currents across continents', d3: 'Generating geothermal energy' },
  ];
  rcData.forEach((rc) => {
    addQ(
      9,
      'Reading Comprehension',
      'Medium',
      `${rc.p}\n\nQuestion: ${rc.q}`,
      rc.ans,
      rc.d1,
      rc.d2,
      rc.d3,
      `Passage comprehension: "${rc.ans}" is directly established in the text.`
    );
  });

  // Level 10: Verbal Analogies (30 distinct relationship pairs)
  const anData = [
    { pair: 'AUTHOR : NOVEL', ans: 'Composer : Symphony', d1: 'Doctor : Patient', d2: 'Teacher : Classroom', d3: 'Chef : Kitchen', rel: 'An author creates a novel; a composer creates a symphony (Creator : Creation).' },
    { pair: 'THERMOMETER : TEMPERATURE', ans: 'Barometer : Air Pressure', d1: 'Clock : Calendar', d2: 'Scale : Distance', d3: 'Ruler : Weight', rel: 'A thermometer measures temperature; a barometer measures air pressure (Instrument : Measurement).' },
    { pair: 'CARPENTER : HAMMER', ans: 'Surgeon : Scalpel', d1: 'Teacher : Desk', d2: 'Driver : Road', d3: 'Author : Bookstore', rel: 'A carpenter uses a hammer as a primary tool; a surgeon uses a scalpel (Professional : Tool).' },
    { pair: 'OASIS : DESERT', ans: 'Island : Ocean', d1: 'Mountain : Valley', d2: 'Tree : Forest', d3: 'River : Lake', rel: 'An oasis is a fertile water body surrounded by desert; an island is land surrounded by ocean.' },
    { pair: 'APPRENTICE : MASTER', ans: 'Novice : Expert', d1: 'Student : Desk', d2: 'Employee : Office', d3: 'Child : Toy', rel: 'An apprentice learns under a master; a novice is inexperienced compared to an expert.' },
    { pair: 'SEED : TREE', ans: 'Acorn : Oak', d1: 'Petal : Flower', d2: 'Root : Leaf', d3: 'Fruit : Stem', rel: 'A seed grows into a tree; an acorn specifically grows into an oak tree.' },
    { pair: 'FEATHER : BIRD', ans: 'Scale : Fish', d1: 'Fur : Snake', d2: 'Wool : Horse', d3: 'Claw : Cat', rel: 'Feathers cover a bird; scales cover a fish (Outer covering : Organism).' },
    { pair: 'TELESCOPE : ASTRONOMER', ans: 'Microscope : Biologist', d1: 'Camera : Painting', d2: 'Stethoscope : Patient', d3: 'Canvas : Sculptor', rel: 'An astronomer uses a telescope to observe distant phenomena; a biologist uses a microscope.' },
    { pair: 'RETRACT : STATEMENT', ans: 'Repeal : Legislation', d1: 'Publish : Article', d2: 'Sign : Contract', d3: 'Deny : Truth', rel: 'To retract is to formally withdraw a statement; to repeal is to withdraw legislation.' },
    { pair: 'CANVAS : PAINTER', ans: 'Marble : Sculptor', d1: 'Brush : Canvas', d2: 'Easel : Paint', d3: 'Clay : Pottery', rel: 'Canvas is the raw medium for a painter; marble is the medium for a sculptor.' },
    { pair: 'INSOMNIA : SLEEP', ans: 'Amnesia : Memory', d1: 'Hunger : Food', d2: 'Thirst : Water', d3: 'Fatigue : Rest', rel: 'Insomnia is the pathological lack of sleep; amnesia is the loss of memory.' },
    { pair: 'COMPASS : DIRECTION', ans: 'Clock : Time', d1: 'Map : Distance', d2: 'Scale : Height', d3: 'Anchor : Depth', rel: 'A compass indicates direction; a clock indicates time.' },
    { pair: 'GLOVE : HAND', ans: 'Sock : Foot', d1: 'Hat : Coat', d2: 'Shoe : Lace', d3: 'Ring : Neck', rel: 'A glove covers the hand; a sock covers the foot.' },
    { pair: 'SCALPEL : SURGEON', ans: 'Chisel : Sculptor', d1: 'Stethoscope : Nurse', d2: 'Trowel : Plumber', d3: 'Pen : Reader', rel: 'A scalpel is the precision cutting tool of a surgeon; a chisel is the carving tool of a sculptor.' },
    { pair: 'SOLDIER : REGIMENT', ans: 'Star : Constellation', d1: 'Ship : Port', d2: 'Flower : Vase', d3: 'Book : Library', rel: 'A soldier is an individual unit of a regiment; a star is a unit of a constellation.' },
    { pair: 'DICTIONARY : DEFINITION', ans: 'Atlas : Map', d1: 'Novel : Chapter', d2: 'Magazine : Photo', d3: 'Catalog : Price', rel: 'A dictionary provides definitions; an atlas provides maps.' },
    { pair: 'EPILOGUE : NOVEL', ans: 'Coda : Musical Symphony', d1: 'Prologue : Play', d2: 'Index : Appendix', d3: 'Preface : Chapter', rel: 'An epilogue concludes a novel; a coda concludes a musical piece.' },
    { pair: 'PETAL : FLOWER', ans: 'Leaf : Tree', d1: 'Stem : Root', d2: 'Branch : Bark', d3: 'Seed : Earth', rel: 'A petal is a component of a flower; a leaf is a component of a tree.' },
    { pair: 'CONDUCTOR : ORCHESTRA', ans: 'Director : Cast', d1: 'Actor : Audience', d2: 'Audience : Theater', d3: 'Musician : Score', rel: 'A conductor leads an orchestra; a director leads a theatrical cast.' },
    { pair: 'PHILATELIST : STAMPS', ans: 'Numismatist : Coins', d1: 'Botanist : Animals', d2: 'Astronomer : Rocks', d3: 'Geologist : Clouds', rel: 'A philatelist collects stamps; a numismatist collects coins.' },
    { pair: 'ARCHITECT : BUILDING', ans: 'Playwright : Drama', d1: 'Tenant : Apartment', d2: 'Builder : Brick', d3: 'Engineer : Tool', rel: 'An architect designs a building; a playwright writes a drama.' },
    { pair: 'METAPHOR : FIGURE OF SPEECH', ans: 'Iron : Metal', d1: 'Poem : Prose', d2: 'Word : Sentence', d3: 'Book : Page', rel: 'A metaphor is a specific type of figure of speech; iron is a type of metal (Instance : Category).' },
    { pair: 'DESERT : ARID', ans: 'Swamp : Humid', d1: 'Ocean : Dry', d2: 'Forest : Barren', d3: 'Mountain : Flat', rel: 'A desert is characteristically arid; a swamp is characteristically humid.' },
    { pair: 'HELMET : HEAD', ans: 'Shield : Body', d1: 'Boots : Hands', d2: 'Goggles : Mouth', d3: 'Armor : Horse', rel: 'A helmet protects the head; a shield protects the body.' },
    { pair: 'GULLIBLE : DECEIVED', ans: 'Fragile : Broken', d1: 'Strong : Defeated', d2: 'Wise : Fooled', d3: 'Careful : Injured', rel: 'A gullible person is easily deceived; a fragile object is easily broken.' },
    { pair: 'FLOCK : BIRDS', ans: 'School : Fish', d1: 'Pack : Cats', d2: 'Herd : Whales', d3: 'Swarm : Dogs', rel: 'A flock is a group of birds; a school is a group of fish (Collective noun).' },
    { pair: 'CANDLE : WAX', ans: 'Paper : Pulp', d1: 'Flame : Match', d2: 'Light : Darkness', d3: 'Wick : Ash', rel: 'A candle is made from wax; paper is made from pulp.' },
    { pair: 'PROLOGUE : PLAY', ans: 'Overture : Opera', d1: 'Epilogue : Novel', d2: 'Curtain : Stage', d3: 'Scene : Act', rel: 'A prologue introduces a play; an overture introduces an opera.' },
    { pair: 'TAILOR : NEEDLE', ans: 'Blacksmith : Anvil', d1: 'Baker : Oven', d2: 'Painter : Canvas', d3: 'Farmer : Crop', rel: 'A tailor works with a needle; a blacksmith works with an anvil.' },
    { pair: 'HYGROMETER : HUMIDITY', ans: 'Anemometer : Wind Speed', d1: 'Barometer : Temperature', d2: 'Altimeter : Direction', d3: 'Speedometer : Time', rel: 'A hygrometer measures humidity; an anemometer measures wind speed.' },
  ];
  anData.forEach((a) => {
    addQ(
      10,
      'Verbal Analogies',
      'Hard',
      `Find the pair of words that exhibits the exact same conceptual relationship as:\n[${a.pair}]`,
      a.ans,
      a.d1,
      a.d2,
      a.d3,
      `Analogy relationship: ${a.rel}`
    );
  });

  return list;
}
