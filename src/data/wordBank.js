const rows = (items) => items.map(([word, hint, hardHint]) => ({ word, hint, hardHint }));

export const WORD_BANK = {
  Food: rows([
    ['Pizza', 'Cheesy', 'Round'], ['Popcorn', 'Cinema', 'Popping'], ['Pancake', 'Fluffy', 'Stack'], ['Sushi', 'Chopsticks', 'Rolled'], ['Taco', 'Crispy', 'Folded'],
    ['Burger', 'Grill', 'Stacked'], ['Banana', 'Yellow', 'Peel'], ['Cookie', 'Crumbly', 'Baked'], ['Noodle', 'Slurpy', 'Long'], ['Watermelon', 'Picnic', 'Juicy'],
    ['Sandwich', 'Lunchbox', 'Layered'], ['Cupcake', 'Frosting', 'Tiny'], ['Carrot', 'Crunchy', 'Orange'], ['Ice cream', 'Scoop', 'Melting'], ['Pretzel', 'Salty', 'Twisted'],
    ['Soup', 'Bowl', 'Steamy'], ['Cheese', 'Dairy', 'Wedge'], ['Mango', 'Tropical', 'Stone'], ['Toast', 'Breakfast', 'Golden'], ['Doughnut', 'Glazed', 'Ring'],
    ['Dumplings', 'Steamed', 'Pleated'], ['Pineapple', 'Tropical', 'Spiky'], ['French fries', 'Ketchup', 'Crispy'], ['Pasta', 'Sauce', 'Twisted'], ['Nachos', 'Movie night', 'Layered'],
    ['Milkshake', 'Straw', 'Frosty'], ['Avocado', 'Toast', 'Creamy'], ['Lemonade', 'Summer', 'Sour'], ['Waffle', 'Breakfast', 'Grid'], ['Burrito', 'Wrapped', 'Portable']
  ]),
  Animals: rows([
    ['Penguin', 'Ice', 'Waddling'], ['Elephant', 'Trunk', 'Huge'], ['Giraffe', 'Tall', 'Spotted'], ['Dolphin', 'Ocean', 'Leaping'], ['Rabbit', 'Hops', 'Furry'],
    ['Tiger', 'Stripes', 'Roaming'], ['Owl', 'Night', 'Perched'], ['Kangaroo', 'Pouch', 'Bouncy'], ['Turtle', 'Shell', 'Slow'], ['Monkey', 'Banana', 'Climbing'],
    ['Parrot', 'Tropical', 'Talking'], ['Fox', 'Clever', 'Rusty'], ['Whale', 'Deep', 'Spout'], ['Panda', 'Bamboo', 'Clumsy'], ['Bee', 'Buzzing', 'Tiny'],
    ['Octopus', 'Tentacles', 'Ink'], ['Zebra', 'Stripes', 'Safari'], ['Frog', 'Pond', 'Hopping'], ['Butterfly', 'Garden', 'Winged'], ['Camel', 'Desert', 'Humped'],
    ['Hedgehog', 'Spines', 'Curling'], ['Flamingo', 'Pink', 'One-legged'], ['Sloth', 'Rainforest', 'Unhurried'], ['Peacock', 'Feathers', 'Showing off'], ['Llama', 'Mountains', 'Spitting'],
    ['Raccoon', 'Night', 'Masked'], ['Seal', 'Ocean', 'Whiskered'], ['Chameleon', 'Color', 'Camouflaged'], ['Bat', 'Cave', 'Upside down'], ['Lobster', 'Ocean', 'Clawed']
  ]),
  Places: rows([
    ['Airport', 'Travel', 'Terminal'], ['Library', 'Quiet', 'Shelves'], ['Beach', 'Sand', 'Shoreline'], ['Hospital', 'Nurses', 'Sterile'], ['Museum', 'History', 'Exhibits'],
    ['Castle', 'Royal', 'Towers'], ['School', 'Lessons', 'Bell'], ['Stadium', 'Crowd', 'Seats'], ['Market', 'Shopping', 'Bargains'], ['Campsite', 'Tent', 'Outdoors'],
    ['Bakery', 'Bread', 'Morning'], ['Playground', 'Swings', 'Children'], ['Lighthouse', 'Coast', 'Beacon'], ['Cinema', 'Tickets', 'Screen'], ['Farm', 'Harvest', 'Fields'],
    ['Train station', 'Departure', 'Platform'], ['Restaurant', 'Menu', 'Tables'], ['Aquarium', 'Glass', 'Fins'], ['Park', 'Trees', 'Benches'], ['Space station', 'Orbit', 'Docking'],
    ['Haunted house', 'Ghosts', 'Creaking'], ['Arcade', 'Tokens', 'High scores'], ['Rooftop', 'City', 'Above'], ['Submarine', 'Ocean', 'Underwater'], ['Desert island', 'Palm trees', 'Stranded'],
    ['Food truck', 'Street food', 'Wheels'], ['Hotel', 'Luggage', 'Check-in'], ['Cave', 'Stalactites', 'Underground'], ['Roller rink', 'Music', 'Wheels'], ['Observatory', 'Stars', 'Telescope']
  ]),
  Things: rows([
    ['Umbrella', 'Rain', 'Canopy'], ['Backpack', 'Travel', 'Straps'], ['Bicycle', 'Pedals', 'Wheels'], ['Candle', 'Flame', 'Wax'], ['Mirror', 'Reflection', 'Frame'],
    ['Pillow', 'Sleep', 'Soft'], ['Clock', 'Time', 'Ticking'], ['Key', 'Lock', 'Metal'], ['Camera', 'Photos', 'Lens'], ['Suitcase', 'Airport', 'Luggage'],
    ['Guitar', 'Music', 'Strings'], ['Scissors', 'Cutting', 'Blades'], ['Magnet', 'Fridge', 'Pulling'], ['Blanket', 'Warmth', 'Cozy'], ['Helmet', 'Safety', 'Headgear'],
    ['Lantern', 'Camping', 'Glowing'], ['Kite', 'Wind', 'Flying'], ['Toothbrush', 'Morning', 'Bristles'], ['Glasses', 'Vision', 'Frames'], ['Remote control', 'Buttons', 'Channel'],
    ['Yo-yo', 'String', 'Spinning'], ['Snow globe', 'Shaking', 'Tiny scene'], ['Compass', 'Direction', 'North'], ['Rubber duck', 'Bath', 'Floating'], ['Hourglass', 'Time', 'Trickling'],
    ['Binoculars', 'Far away', 'Two lenses'], ['Boomerang', 'Australia', 'Returning'], ['Telescope', 'Stars', 'Magnifying'], ['Skateboard', 'Tricks', 'Rolling'], ['Thermos', 'Drink', 'Insulated']
  ]),
  Jobs: rows([
    ['Doctor', 'Stethoscope', 'Caring'], ['Teacher', 'Classroom', 'Guiding'], ['Chef', 'Kitchen', 'Tasting'], ['Pilot', 'Cockpit', 'Flying'], ['Firefighter', 'Hose', 'Brave'],
    ['Artist', 'Canvas', 'Creative'], ['Dentist', 'Smile', 'Drill'], ['Farmer', 'Crops', 'Harvesting'], ['Mechanic', 'Garage', 'Repairing'], ['Detective', 'Clues', 'Observant'],
    ['Photographer', 'Camera', 'Framing'], ['Baker', 'Oven', 'Dough'], ['Astronaut', 'Rocket', 'Weightless'], ['Scientist', 'Lab', 'Curious'], ['Musician', 'Concert', 'Rhythm'],
    ['Gardener', 'Plants', 'Pruning'], ['Librarian', 'Books', 'Organized'], ['Coach', 'Team', 'Motivating'], ['Sailor', 'Harbor', 'Seafaring'], ['Designer', 'Sketches', 'Styling'],
    ['Magician', 'Stage', 'Misdirection'], ['Game designer', 'Levels', 'Inventing'], ['Park ranger', 'Wildlife', 'Trail guide'], ['Astronomer', 'Telescope', 'Stargazing'], ['Stunt performer', 'Action', 'Fearless'],
    ['Florist', 'Bouquets', 'Arranging'], ['Voice actor', 'Microphone', 'Characters'], ['Food critic', 'Restaurant', 'Judging'], ['Archaeologist', 'Ruins', 'Digging'], ['Inventor', 'Ideas', 'Prototypes']
  ]),
  'Movies & Fun': rows([
    ['Robot', 'Future', 'Metallic'], ['Wizard', 'Magic', 'Cloak'], ['Pirate', 'Treasure', 'Sailing'], ['Dragon', 'Fire', 'Mythic'], ['Superhero', 'Cape', 'Saving'],
    ['Clown', 'Circus', 'Makeup'], ['Zombie', 'Undead', 'Shuffling'], ['Princess', 'Crown', 'Fairytale'], ['Time machine', 'Future', 'Dial'], ['Detective story', 'Mystery', 'Whodunit'],
    ['Roller coaster', 'Thrills', 'Tracks'], ['Karaoke', 'Singing', 'Microphone'], ['Board game', 'Dice', 'Tabletop'], ['Treasure map', 'Adventure', 'X marks the spot'], ['Magic trick', 'Surprise', 'Sleight'],
    ['Fireworks', 'Celebration', 'Skyburst'], ['Puppet', 'Strings', 'Stage'], ['Costume', 'Disguise', 'Outfit'], ['Jigsaw puzzle', 'Pieces', 'Picture'], ['Campfire story', 'Spooky', 'Tales'],
    ['Alien invasion', 'UFO', 'Unexpected visitors'], ['Secret agent', 'Gadgets', 'Undercover'], ['Monster movie', 'Popcorn', 'Jump scare'], ['Escape room', 'Riddles', 'Countdown'], ['Supervillain', 'Evil plan', 'Dramatic'],
    ['Fortune teller', 'Crystal ball', 'Mysterious'], ['Ninja', 'Stealth', 'Silent'], ['Werewolf', 'Full moon', 'Howling'], ['Space opera', 'Galaxy', 'Epic'], ['Comedy show', 'Laughter', 'Punchline'],
    ['Plot twist', 'Unexpected', 'Surprise ending'], ['Stunt double', 'Action scene', 'Taking a fall'], ['Film premiere', 'Red carpet', 'Opening night'], ['Soundtrack', 'Movie', 'Theme music'], ['Clapperboard', 'Film set', 'Take two'],
    ['Movie trailer', 'Coming soon', 'Preview'], ['Cosplay contest', 'Costumes', 'Character'], ['Talent show', 'Spotlight', 'Applause'], ['Trivia night', 'Questions', 'Team answers'], ['Treasure hunt', 'Hidden clues', 'Final prize'],
    ['Improv comedy', 'No script', 'Made up on the spot'], ['Blooper reel', 'Outtakes', 'Forgot the line'], ['Cliffhanger', 'To be continued', 'Unfinished ending'], ['Masked ball', 'Fancy dress', 'Hidden identity'], ['Prank show', 'Surprise', 'Caught on camera']
  ]),
  Sports: rows([
    ['Football', 'Goalpost', 'Grass'], ['Basketball', 'Hoop', 'Dribble'], ['Tennis', 'Racket', 'Serve'], ['Swimming', 'Pool', 'Laps'], ['Cycling', 'Helmet', 'Pedaling'],
    ['Baseball', 'Diamond', 'Pitch'], ['Boxing', 'Gloves', 'Ring'], ['Skiing', 'Snow', 'Slopes'], ['Golf', 'Course', 'Swing'], ['Volleyball', 'Net', 'Bump'],
    ['Skateboarding', 'Ramp', 'Balance'], ['Archery', 'Target', 'Aim'], ['Surfing', 'Waves', 'Board'], ['Running', 'Race', 'Stride'], ['Cricket', 'Wicket', 'Bat'],
    ['Gymnastics', 'Balance', 'Routines'], ['Wrestling', 'Mat', 'Grapple'], ['Rowing', 'Oars', 'Water'], ['Badminton', 'Shuttlecock', 'Racket'], ['Horse riding', 'Saddle', 'Gallop'],
    ['Table tennis', 'Paddle', 'Fast rally'], ['Fencing', 'Sword', 'Touché'], ['Curling', 'Ice', 'Broom'], ['Rock climbing', 'Wall', 'Grip'], ['Dodgeball', 'Court', 'Duck'],
    ['Water polo', 'Pool', 'Teamwork'], ['Bowling', 'Pins', 'Strike'], ['Relay race', 'Baton', 'Handoff'], ['Parkour', 'Obstacles', 'Vaulting'], ['Sumo wrestling', 'Ring', 'Pushing']
  ]),
  Technology: rows([
    ['Laptop', 'Keyboard', 'Portable'], ['Robot vacuum', 'Floor', 'Automatic'], ['Smartphone', 'Pocket', 'Touchscreen'], ['Headphones', 'Music', 'Earpads'], ['Drone', 'Remote', 'Hovering'],
    ['Printer', 'Paper', 'Ink'], ['Satellite', 'Orbit', 'Signal'], ['Video game', 'Controller', 'Score'], ['Keyboard', 'Typing', 'Keys'], ['Internet', 'Websites', 'Connected'],
    ['Microphone', 'Voice', 'Recording'], ['Calculator', 'Numbers', 'Buttons'], ['Flash drive', 'Files', 'Tiny'], ['Smartwatch', 'Wrist', 'Digital'], ['Television', 'Remote', 'Broadcast'],
    ['Solar panel', 'Sunlight', 'Energy'], ['3D printer', 'Plastic', 'Layering'], ['Game console', 'Controller', 'Living-room'], ['Password', 'Security', 'Secret'], ['Search engine', 'Results', 'Query'],
    ['Virtual reality', 'Headset', 'Immersive'], ['Selfie stick', 'Phone', 'Extended reach'], ['Smart speaker', 'Voice', 'Assistant'], ['Robot arm', 'Factory', 'Precision'], ['Hologram', 'Light', 'Floating image'],
    ['Electric scooter', 'Commute', 'Charging'], ['Fitness tracker', 'Steps', 'Wrist'], ['QR code', 'Camera', 'Square'], ['Face recognition', 'Security', 'Biometric'], ['Game streaming', 'Live', 'Audience']
  ]),
  Nature: rows([
    ['Rainbow', 'Rain', 'Colors'], ['Mountain', 'Summit', 'Rocky'], ['Volcano', 'Lava', 'Erupting'], ['River', 'Water', 'Flowing'], ['Waterfall', 'Cliff', 'Cascading'],
    ['Sunflower', 'Yellow', 'Turning'], ['Cactus', 'Desert', 'Spines'], ['Thunderstorm', 'Lightning', 'Rolling'], ['Snowflake', 'Winter', 'Unique'], ['Pine tree', 'Evergreen', 'Needles'],
    ['Moonlight', 'Night', 'Silver'], ['Coral reef', 'Ocean', 'Colorful'], ['Cloud', 'Sky', 'Drifting'], ['Meadow', 'Wildflowers', 'Open'], ['Aurora', 'Northern', 'Shimmering'],
    ['Raindrop', 'Puddle', 'Falling'], ['Pebble', 'Riverbed', 'Smooth'], ['Sunset', 'Horizon', 'Orange'], ['Dandelion', 'Wish', 'Windblown'], ['Eucalyptus grove', 'Koalas', 'Fragrant leaves'],
    ['Tide pool', 'Seashore', 'Tiny ecosystem'], ['Hot spring', 'Geothermal', 'Steaming'], ['Meteor shower', 'Night sky', 'Streaking'], ['Mangrove', 'Coast', 'Roots'], ['Glacier', 'Ice', 'Slow-moving'],
    ['Sand dune', 'Desert', 'Shifting'], ['Bioluminescence', 'Ocean', 'Glowing'], ['Bamboo forest', 'Pandas', 'Tall stalks'], ['Tornado', 'Storm', 'Spinning'], ['Mushroom circle', 'Forest', 'Fairy ring']
  ]),
  Home: rows([
    ['Sofa', 'Living room', 'Cushions'], ['Kitchen', 'Cooking', 'Counters'], ['Shower', 'Water', 'Steam'], ['Refrigerator', 'Cold', 'Appliance'], ['Window', 'Glass', 'View'],
    ['Stairs', 'Upstairs', 'Steps'], ['Doorbell', 'Visitor', 'Ring'], ['Garden', 'Flowers', 'Backyard'], ['Garage', 'Car', 'Storage'], ['Bedroom', 'Sleep', 'Private'],
    ['Table', 'Dinner', 'Surface'], ['Chair', 'Sit', 'Four legs'], ['Curtain', 'Privacy', 'Fabric'], ['Lamp', 'Light', 'Shade'], ['Mailbox', 'Letters', 'Outside'],
    ['Chimney', 'Roof', 'Smoke'], ['Closet', 'Clothes', 'Hidden'], ['Doormat', 'Welcome', 'Floor'], ['Attic', 'Boxes', 'Upstairs'], ['Balcony', 'View', 'Railing'],
    ['Beanbag', 'Gaming', 'Sinking in'], ['Bookshelf', 'Reading', 'Spines'], ['Blender', 'Smoothie', 'Whirring'], ['Laundry basket', 'Clothes', 'Waiting'], ['Hammock', 'Garden', 'Swinging'],
    ['Vacuum cleaner', 'Dust', 'Suction'], ['Alarm clock', 'Morning', 'Snooze'], ['Plant pot', 'Windowsill', 'Roots'], ['Pantry', 'Snacks', 'Shelves'], ['Coat rack', 'Entryway', 'Hanging']
  ])
};

const descriptionTemplates = {
  Food: (entry) => `A food or ingredient often associated with ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`,
  Animals: (entry) => `An animal known for ${entry.hint.toLowerCase()}, and often described as ${entry.hardHint.toLowerCase()}.`,
  Places: (entry) => `A place connected with ${entry.hint.toLowerCase()}, often recognized by ${entry.hardHint.toLowerCase()}.`,
  Things: (entry) => `An everyday object associated with ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`,
  Jobs: (entry) => `A profession involving ${entry.hint.toLowerCase()}, often requiring someone who is ${entry.hardHint.toLowerCase()}.`,
  'Movies & Fun': (entry) => `A character, story, or entertainment idea tied to ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`,
  Sports: (entry) => `A sport involving ${entry.hint.toLowerCase()}, often featuring ${entry.hardHint.toLowerCase()}.`,
  Technology: (entry) => `A technology or digital tool connected with ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`,
  Nature: (entry) => `A natural feature or event associated with ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`,
  Home: (entry) => `A household space or object connected with ${entry.hint.toLowerCase()} and ${entry.hardHint.toLowerCase()}.`
};

for (const [category, entries] of Object.entries(WORD_BANK)) {
  for (const entry of entries) entry.description = descriptionTemplates[category](entry);
}

export const CATEGORY_NAMES = ['Random', ...Object.keys(WORD_BANK), 'Custom words'];

export function flattenWordBank(selectedCategories = CATEGORY_NAMES) {
  const categories = selectedCategories.includes('Random') || selectedCategories.length === 0
    ? Object.keys(WORD_BANK)
    : selectedCategories.filter((category) => WORD_BANK[category]);
  return categories.flatMap((category) => WORD_BANK[category].map((entry) => ({ ...entry, category })));
}

export function createCustomEntry(word, hint, hardHint = 'Mystery') {
  const cleanWord = word.trim();
  const cleanHint = hint.trim();
  const cleanHardHint = hardHint.trim() || 'Mystery';
  return {
    word: cleanWord,
    hint: cleanHint,
    hardHint: cleanHardHint,
    description: `A custom word connected with ${cleanHint.toLowerCase()} and ${cleanHardHint.toLowerCase()}.`,
    category: 'Custom words'
  };
}
