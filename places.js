/* Sneha & Daivik's September 2026 list. Ratings are intentionally uncapped. */
const CATEGORIES = {
  vibes: { label: 'Vibes', icon: '✧', subtitle: 'For the plot.' },
  food: { label: 'Food', icon: '♡', subtitle: 'One more bite.' },
  drinks: { label: 'Drinks', icon: '♧', subtitle: 'A little sip, a little gossip.' },
  dessert: { label: 'Dessert', icon: '✿', subtitle: 'Always room for something sweet.' }
};
const RAW_PLACES = {
  vibes: [
    ['Daintree LES Rooftop Bar',7], ['cloudM Rooftop Bar',6],
    ['Centurion Amex',9,'',1,true],
    ['Vintage Vangaurd 🎷',0,'Unique, still need seasoning.'],
    ['BBQ 🍖',10], ['Nebula',6.5], ['Beach & Benz',9], ['AKKA',7.5,'#Philly']
  ],
  food: [
    ['Rubirosa',7], ['L’industrie Pizza',8], ['Mughlai Indian Restaurant',6],
    ['Fire & Oak',7], ['Taco Bell',12,'sn was high asl'], ['Ninos 46',7],
    ['Bangalore Kitchen',9,'',2], ['Bikanervala',6.5], ['Honest JSQ',6.5],
    ['Golconda',8.5], ['Tacoria',3], ['Balaboosta',8.8], ['Park Rosa',6],
    ['Panda Express',5], ['The Ainsworth',8.9,'Hoboken'], ['Los Cuernos',4.1],
    ['Seppe',6.5], ['King Falafel',8.5], ['Jack’s Wife Freda',8.5],
    ['Ambassadors Clubhouse',10,'',1,true], ['CAVA',7.5], ['Parata Junction',7.5],
    ['Junoon',10,'',1,true], ['The Lola',8], ['Joe’s Pizza',7], ['Auntie Anne’s',5],
    ['The District',8], ['Tapville',8,'Happy hour'], ['Taverna Veranda',null],
    ['Domino’s Pizza',8], ['Pizza Twist',8], ['Whealth Kitchen',8], ['Estelle',0]
  ],
  drinks: [
    ['Spring Lounge',10,'fought for a nic here omg'], ['Balazem',8,'D’s rating'],
    ['Mixue',5], ['Blank Street',8,'',2], ['Manta',8.5],
    ['Electric Shuffle',9.5,'HAPPY HR'], ['The Storehouse',3],
    ['The Experimental Cocktail Club',8,'Sn vibed'], ['Undercote',8],
    ['Aperibar',2], ['Misree Chai',10], ['Boots and Bones',5], ['Skinners Loft',6]
  ],
  dessert: [
    ['Van Leeuwan Ice Cream',2], ['Salt & Straw',9], ['Torico Ice Cream',9,'',2],
    ['Sundaes Best',8.5], ['Venchi',9,'',2], ['Milk Sugar Love',9],
    ['The Original Fudge Kitchen',100], ['Maggies Munchies',4], ['Cold Stone',10]
  ]
};
const PLACES = Object.entries(RAW_PLACES).flatMap(([category, rows]) => rows.map(([name,rating,note='',visits=1,star=false]) => ({
  id: category+'-'+name.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''),
  name, rating, note, visits, star, category
})));
const DATES = [
  { id:'brooklyn-flea', name:'Brooklyn Flea Market', note:'A little treasure hunting.', icon:'🛍️' },
  { id:'musical', name:'See a musical', note:'Our next main-character moment.', icon:'🎭' },
  { id:'farmers-market', name:'Farmers market', note:'Flowers, fresh finds, us.', icon:'🍎' },
  { id:'broad-nosh', name:'Broad Nosh Bagels & Deli', note:'Biscoff cream cheese. That’s the plan.', icon:'🥯' },
  { id:'punjab-meet', name:'Punjab Meet House', note:'Jersey City', icon:'🍛' },
  { id:'batsu', name:'Batsu!', note:'A night for the plot.', icon:'🎟️' }
];
