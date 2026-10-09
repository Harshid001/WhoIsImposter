const rows = (items) => items.map(([word, hint, hardHint]) => ({ word, hint, hardHint }));

export const WORD_BANK = {
  Food: rows([
    ['Pizza', 'Cheesy', 'Round'], ['Popcorn', 'Cinema', 'Popping'], ['Pancake', 'Fluffy', 'Stack'], ['Sushi', 'Chopsticks', 'Rolled'], ['Taco', 'Crispy', 'Folded'],
    ['Burger', 'Grill', 'Stacked'], ['Banana', 'Yellow', 'Peel'], ['Cookie', 'Crumbly', 'Baked'], ['Noodle', 'Slurpy', 'Long'], ['Watermelon', 'Picnic', 'Juicy'],
    ['Sandwich', 'Lunchbox', 'Layered'], ['Cupcake', 'Frosting', 'Tiny'], ['Carrot', 'Crunchy', 'Orange'], ['Ice cream', 'Scoop', 'Melting'], ['Pretzel', 'Salty', 'Twisted'],
    ['Soup', 'Bowl', 'Steamy'], ['Cheese', 'Dairy', 'Wedge'], ['Mango', 'Tropical', 'Stone'], ['Toast', 'Breakfast', 'Golden'], ['Doughnut', 'Glazed', 'Ring']
  ]),
  Animals: rows([
    ['Penguin', 'Ice', 'Waddling'], ['Elephant', 'Trunk', 'Huge'], ['Giraffe', 'Tall', 'Spotted'], ['Dolphin', 'Ocean', 'Leaping'], ['Rabbit', 'Hops', 'Furry'],
    ['Tiger', 'Stripes', 'Roaming'], ['Owl', 'Night', 'Perched'], ['Kangaroo', 'Pouch', 'Bouncy'], ['Turtle', 'Shell', 'Slow'], ['Monkey', 'Banana', 'Climbing'],
    ['Parrot', 'Tropical', 'Talking'], ['Fox', 'Clever', 'Rusty'], ['Whale', 'Deep', 'Spout'], ['Panda', 'Bamboo', 'Clumsy'], ['Bee', 'Buzzing', 'Tiny'],
    ['Octopus', 'Tentacles', 'Ink'], ['Zebra', 'Stripes', 'Safari'], ['Frog', 'Pond', 'Hopping'], ['Butterfly', 'Garden', 'Winged'], ['Camel', 'Desert', 'Humped']
  ]),
  Places: rows([
    ['Airport', 'Travel', 'Terminal'], ['Library', 'Quiet', 'Shelves'], ['Beach', 'Sand', 'Shoreline'], ['Hospital', 'Nurses', 'Sterile'], ['Museum', 'History', 'Exhibits'],
    ['Castle', 'Royal', 'Towers'], ['School', 'Lessons', 'Bell'], ['Stadium', 'Crowd', 'Seats'], ['Market', 'Shopping', 'Bargains'], ['Campsite', 'Tent', 'Outdoors'],
    ['Bakery', 'Bread', 'Morning'], ['Playground', 'Swings', 'Children'], ['Lighthouse', 'Coast', 'Beacon'], ['Cinema', 'Tickets', 'Screen'], ['Farm', 'Harvest', 'Fields'],
    ['Train station', 'Departure', 'Platform'], ['Restaurant', 'Menu', 'Tables'], ['Aquarium', 'Glass', 'Fins'], ['Park', 'Trees', 'Benches'], ['Space station', 'Orbit', 'Docking']
  ]),
  Things: rows([
    ['Umbrella', 'Rain', 'Canopy'], ['Backpack', 'Travel', 'Straps'], ['Bicycle', 'Pedals', 'Wheels'], ['Candle', 'Flame', 'Wax'], ['Mirror', 'Reflection', 'Frame'],
    ['Pillow', 'Sleep', 'Soft'], ['Clock', 'Time', 'Ticking'], ['Key', 'Lock', 'Metal'], ['Camera', 'Photos', 'Lens'], ['Suitcase', 'Airport', 'Luggage'],
    ['Guitar', 'Music', 'Strings'], ['Scissors', 'Cutting', 'Blades'], ['Magnet', 'Fridge', 'Pulling'], ['Blanket', 'Warmth', 'Cozy'], ['Helmet', 'Safety', 'Headgear'],
    ['Lantern', 'Camping', 'Glowing'], ['Kite', 'Wind', 'Flying'], ['Toothbrush', 'Morning', 'Bristles'], ['Glasses', 'Vision', 'Frames'], ['Remote control', 'Buttons', 'Channel']
  ]),
  Jobs: rows([
    ['Doctor', 'Stethoscope', 'Caring'], ['Teacher', 'Classroom', 'Guiding'], ['Chef', 'Kitchen', 'Tasting'], ['Pilot', 'Cockpit', 'Flying'], ['Firefighter', 'Hose', 'Brave'],
    ['Artist', 'Canvas', 'Creative'], ['Dentist', 'Smile', 'Drill'], ['Farmer', 'Crops', 'Harvesting'], ['Mechanic', 'Garage', 'Repairing'], ['Detective', 'Clues', 'Observant'],
    ['Photographer', 'Camera', 'Framing'], ['Baker', 'Oven', 'Dough'], ['Astronaut', 'Rocket', 'Weightless'], ['Scientist', 'Lab', 'Curious'], ['Musician', 'Concert', 'Rhythm'],
    ['Gardener', 'Plants', 'Pruning'], ['Librarian', 'Books', 'Organized'], ['Coach', 'Team', 'Motivating'], ['Sailor', 'Harbor', 'Seafaring'], ['Designer', 'Sketches', 'Styling']
  ]),
  'Movies & Fun': rows([
    ['Robot', 'Future', 'Metallic'], ['Wizard', 'Magic', 'Cloak'], ['Pirate', 'Treasure', 'Sailing'], ['Dragon', 'Fire', 'Mythic'], ['Superhero', 'Cape', 'Saving'],
    ['Clown', 'Circus', 'Makeup'], ['Zombie', 'Undead', 'Shuffling'], ['Princess', 'Crown', 'Fairytale'], ['Time machine', 'Future', 'Dial'], ['Detective story', 'Mystery', 'Whodunit'],
    ['Roller coaster', 'Thrills', 'Tracks'], ['Karaoke', 'Singing', 'Microphone'], ['Board game', 'Dice', 'Tabletop'], ['Treasure map', 'Adventure', 'X'], ['Magic trick', 'Surprise', 'Sleight'],
    ['Fireworks', 'Celebration', 'Skyburst'], ['Puppet', 'Strings', 'Stage'], ['Costume', 'Disguise', 'Outfit'], ['Jigsaw puzzle', 'Pieces', 'Picture'], ['Campfire story', 'Spooky', 'Tales']
  ]),
  Sports: rows([
    ['Football', 'Goalpost', 'Grass'], ['Basketball', 'Hoop', 'Dribble'], ['Tennis', 'Racket', 'Serve'], ['Swimming', 'Pool', 'Laps'], ['Cycling', 'Helmet', 'Pedaling'],
    ['Baseball', 'Diamond', 'Pitch'], ['Boxing', 'Gloves', 'Ring'], ['Skiing', 'Snow', 'Slopes'], ['Golf', 'Course', 'Swing'], ['Volleyball', 'Net', 'Bump'],
    ['Skateboarding', 'Ramp', 'Balance'], ['Archery', 'Target', 'Aim'], ['Surfing', 'Waves', 'Board'], ['Running', 'Race', 'Stride'], ['Cricket', 'Wicket', 'Bat'],
    ['Gymnastics', 'Balance', 'Routines'], ['Wrestling', 'Mat', 'Grapple'], ['Rowing', 'Oars', 'Water'], ['Badminton', 'Shuttlecock', 'Racket'], ['Horse riding', 'Saddle', 'Gallop']
  ]),
  Technology: rows([
    ['Laptop', 'Keyboard', 'Portable'], ['Robot vacuum', 'Floor', 'Automatic'], ['Smartphone', 'Pocket', 'Touchscreen'], ['Headphones', 'Music', 'Earpads'], ['Drone', 'Remote', 'Hovering'],
    ['Printer', 'Paper', 'Ink'], ['Satellite', 'Orbit', 'Signal'], ['Video game', 'Controller', 'Score'], ['Keyboard', 'Typing', 'Keys'], ['Internet', 'Websites', 'Connected'],
    ['Microphone', 'Voice', 'Recording'], ['Calculator', 'Numbers', 'Buttons'], ['Flash drive', 'Files', 'Tiny'], ['Smartwatch', 'Wrist', 'Digital'], ['Television', 'Remote', 'Broadcast'],
    ['Solar panel', 'Sunlight', 'Energy'], ['3D printer', 'Plastic', 'Layering'], ['Game console', 'Controller', 'Living-room'], ['Password', 'Security', 'Secret'], ['Search engine', 'Results', 'Query']
  ]),
  Nature: rows([
    ['Rainbow', 'Rain', 'Colors'], ['Mountain', 'Summit', 'Rocky'], ['Volcano', 'Lava', 'Erupting'], ['River', 'Water', 'Flowing'], ['Waterfall', 'Cliff', 'Cascading'],
    ['Sunflower', 'Yellow', 'Turning'], ['Cactus', 'Desert', 'Spines'], ['Thunderstorm', 'Lightning', 'Rolling'], ['Snowflake', 'Winter', 'Unique'], ['Pine tree', 'Evergreen', 'Needles'],
    ['Moonlight', 'Night', 'Silver'], ['Coral reef', 'Ocean', 'Colorful'], ['Cloud', 'Sky', 'Drifting'], ['Meadow', 'Wildflowers', 'Open'], ['Aurora', 'Northern', 'Shimmering'],
    ['Raindrop', 'Puddle', 'Falling'], ['Pebble', 'Riverbed', 'Smooth'], ['Sunset', 'Horizon', 'Orange'], ['Dandelion', 'Wish', 'Windblown'], ['Cave', 'Darkness', 'Echoing']
  ]),
  Home: rows([
    ['Sofa', 'Living room', 'Cushions'], ['Kitchen', 'Cooking', 'Counters'], ['Shower', 'Water', 'Steam'], ['Refrigerator', 'Cold', 'Appliance'], ['Window', 'Glass', 'View'],
    ['Stairs', 'Upstairs', 'Steps'], ['Doorbell', 'Visitor', 'Ring'], ['Garden', 'Flowers', 'Backyard'], ['Garage', 'Car', 'Storage'], ['Bedroom', 'Sleep', 'Private'],
    ['Table', 'Dinner', 'Surface'], ['Chair', 'Sit', 'Four legs'], ['Curtain', 'Privacy', 'Fabric'], ['Lamp', 'Light', 'Shade'], ['Mailbox', 'Letters', 'Outside'],
    ['Chimney', 'Roof', 'Smoke'], ['Closet', 'Clothes', 'Hidden'], ['Doormat', 'Welcome', 'Floor'], ['Attic', 'Boxes', 'Upstairs'], ['Balcony', 'View', 'Railing']
  ])
};

export const CATEGORY_NAMES = ['Random', ...Object.keys(WORD_BANK), 'Custom words'];

export function flattenWordBank(selectedCategories = CATEGORY_NAMES) {
  const categories = selectedCategories.includes('Random') || selectedCategories.length === 0
    ? Object.keys(WORD_BANK)
    : selectedCategories.filter((category) => WORD_BANK[category]);
  return categories.flatMap((category) => WORD_BANK[category].map((entry) => ({ ...entry, category })));
}

export function createCustomEntry(word, hint, hardHint = 'Mystery') {
  return { word: word.trim(), hint: hint.trim(), hardHint: hardHint.trim() || 'Mystery', category: 'Custom words' };
}
