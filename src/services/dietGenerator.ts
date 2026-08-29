import { DietPreferences, DailyDietPlan, CyclePhase } from '../types';

export function generateDietPlan(prefs: DietPreferences, currentPhase: CyclePhase = 'follicular'): DailyDietPlan {
  const isVeg = prefs.dietPreference === 'vegetarian';
  const isVegan = prefs.dietPreference === 'vegan';
  const isEgg = prefs.dietPreference === 'eggitarian';
  const hasDairyAllergy = prefs.allergies.includes('dairy') || isVegan;
  const hasGlutenAllergy = prefs.allergies.includes('gluten');
  const hasNutAllergy = prefs.allergies.includes('nuts');

  // Hydration calculation: 30-35ml per kg baseline, adjusted for activity
  let targetLiters = 2.2;
  if (prefs.lifestyle === 'moderate') targetLiters = 2.5;
  if (prefs.lifestyle === 'high') targetLiters = 2.8;

  // Cycle phase nuances
  let cycleNote = '';
  if (currentPhase === 'menstrual') {
    cycleNote = 'Menstrual Phase: Emphasizing warming, iron-rich and easily digestible foods, magnesium, and warm herbal infusions.';
  } else if (currentPhase === 'follicular') {
    cycleNote = 'Follicular Phase: Prioritizing lean proteins, sprouted grains, and vibrant antioxidant-rich salads to support rising energy levels.';
  } else if (currentPhase === 'ovulatory') {
    cycleNote = 'Ovulatory Phase: Featuring fiber-dense veggies and glutathione-supporting foods to assist optimal liver and hormone metabolism.';
  } else {
    cycleNote = 'Luteal Phase: Focusing on complex carbohydrates (sweet potato, oats), zinc, B-vitamins, and healthy fats to support progesterone.';
  }

  // Breakfast options
  let bOptions: string[] = [];
  let bPortion = '1 medium bowl (approx 350-400 kcal)';
  let bWhy = 'Provides sustained glucose release without insulin spikes to maintain steady morning cortisol and energy.';

  if (isVegan) {
    bOptions = hasGlutenAllergy
      ? ['Warm quinoa porridge with chia seeds, blueberries, and sunflower butter', 'Tofu scramble with spinach, cherry tomatoes, and avocado']
      : ['Rolled oats cooked in almond milk with flaxseeds, walnuts, and sliced berries', 'Avocado toast on artisan sourdough with hemp hearts'];
  } else if (isVeg) {
    bOptions = hasDairyAllergy
      ? ['Chia pudding with coconut milk, pumpkin seeds, and raspberries', 'Vegetable poha/upma with roasted peanuts and lemon']
      : ['Greek yogurt bowl with raw honey, crushed almonds, and cinnamon', 'Paneer & bell pepper bhurji with toasted multi-grain bread'];
  } else if (isEgg) {
    bOptions = ['2 soft poached or scrambled pasture-raised eggs with wilted baby spinach & sourdough', 'Egg white vegetable omelette with avocado slices'];
  } else {
    bOptions = ['Pasture-raised soft scrambled eggs with smoked salmon or avocado and microgreens', 'Warm steel-cut oatmeal topped with Greek yogurt, berries, and hemp seeds'];
  }

  // Mid-Morning
  const midMorningSnacks: string[] = [];
  if (hasNutAllergy) {
    midMorningSnacks.push('1 crisp green apple with 2 tbsp pumpkin seeds', 'Carrot & cucumber sticks with homemade hummus');
  } else {
    midMorningSnacks.push('A handful of raw walnuts & 2 dried figs', 'Sliced organic apple with 1 tbsp almond butter');
  }
  const midHydration = '1 tall glass of warm lemon water with a pinch of Himalayan pink salt, or green tea.';

  // Lunch
  let lunchProtein = '';
  let lunchVeg = 'Steamed broccoli, grilled asparagus, and mixed leafy greens (arugula & spinach) dressed in extra virgin olive oil';
  let lunchCarbs = hasGlutenAllergy ? '1/2 cup cooked brown rice or quinoa' : '1/2 cup steamed quinoa, sweet potato cubes, or whole grain roti';
  let lunchPortion = '1 balanced plate: 1/2 vegetables, 1/4 clean protein, 1/4 complex carbohydrate.';
  let lunchWhy = 'Balanced macronutrient ratio stabilizes post-lunch energy and prevents afternoon sluggishness.';

  if (isVegan) {
    lunchProtein = '1 cup stewed organic lentils (dal/edamame) or grilled herb-marinated tempeh/tofu';
  } else if (isVeg) {
    lunchProtein = '1 cup spiced chickpea curry (chana) or 100g fresh paneer sautéed with turmeric';
  } else if (isEgg) {
    lunchProtein = '2 boiled eggs combined with 1/2 cup warm lentil soup or bean salad';
  } else {
    lunchProtein = '120g grilled lemon-herb chicken breast or baked wild salmon fillet';
  }

  // Evening
  const eveningSnacks = [
    'Cup of calming chamomile or ginger-cinnamon herbal infusion',
    hasNutAllergy ? 'Handful of roasted sunflower & pumpkin seeds with roasted makhana' : 'Small bowl of roasted makhana (fox nuts) and roasted almonds'
  ];

  // Dinner
  let dinnerTitle = 'Nourishing & Easy-to-Digest Evening Meal';
  let dinnerOptions: string[] = [];
  let dinnerPortion = 'Light to medium portion, consumed at least 2.5 hours before bedtime.';
  let dinnerWhy = 'Gentle on digestion to encourage deep, restorative REM sleep and overnight cellular recovery.';

  if (isVegan) {
    dinnerOptions = [
      'Hearty Mediterranean vegetable and lentil stew with roasted zucchini and zucchini noodles',
      'Warm tofu coconut curry over steamed cauliflower rice or brown rice'
    ];
  } else if (isVeg) {
    dinnerOptions = [
      'Warm vegetable soup paired with a paneer and vegetable stir-fry with sesame seeds',
      'Moong dal khichdi cooked with ghee, spinach, and cumin with cooling cucumber raita'
    ];
  } else if (isEgg) {
    dinnerOptions = [
      'Warm zucchini and egg-drop vegetable soup with a side of roasted sweet potatoes',
      'Stir-fried vegetables and tofu/egg scramble with garlic and ginger'
    ];
  } else {
    dinnerOptions = [
      'Baked white fish or tender grilled chicken over roasted butternut squash and sautéed kale',
      'Gentle vegetable and bone broth soup with shredded chicken breast'
    ];
  }

  // Why this plan points
  const whyPoints: string[] = [
    `Customized for your goal: ${prefs.goal.replace('_', ' ').toUpperCase()} with tailored nutrient density.`,
    `Structured for a ${prefs.lifestyle} activity level to ensure appropriate energy replenishment.`,
    `Strictly aligned with your ${prefs.dietPreference.replace('_', '-')} lifestyle and allergy preferences.`,
    `Incorporates cycle-synced nutrients (${currentPhase} phase) to support your natural vitality.`
  ];

  return {
    breakfast: {
      title: 'Energizing Morning Fuel',
      foodOptions: bOptions,
      portionGuidance: bPortion,
      whyUseful: bWhy,
      caloriesApprox: '350 – 420 kcal'
    },
    midMorning: {
      snack: midMorningSnacks,
      hydrationSuggestion: midHydration,
      whyUseful: 'Prevents midday energy drop and supports steady hydration.'
    },
    lunch: {
      protein: lunchProtein,
      vegetables: lunchVeg,
      wholeGrains: lunchCarbs,
      portionGuidance: lunchPortion,
      whyUseful: lunchWhy
    },
    evening: {
      snack: eveningSnacks,
      whyUseful: 'Stabilizes blood sugar between meals and prepares the body for evening relaxation.'
    },
    dinner: {
      title: dinnerTitle,
      foodOptions: dinnerOptions,
      portionGuidance: dinnerPortion,
      whyUseful: dinnerWhy,
      caloriesApprox: '400 – 480 kcal'
    },
    hydration: {
      targetLiters,
      glasses: Math.round(targetLiters / 0.25),
      guideline: `Target approximately ${targetLiters} Liters (${Math.round(targetLiters / 0.25)} standard 250ml glasses) throughout the day.`,
      timingTips: [
        'Drink 1-2 glasses shortly after waking up to rehydrate your tissues.',
        'Drink throughout the day between meals rather than chugging with large meals.',
        'Taper fluid intake 1.5 hours before sleep to ensure uninterrupted sleep cycles.'
      ]
    },
    whyThisPlan: whyPoints,
    cyclePhaseNote: cycleNote
  };
}
