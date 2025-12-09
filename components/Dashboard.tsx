import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle, Map, Building2, Lock, Globe, PlayCircle } from 'lucide-react';
import { CivicReport, ReportStats } from '../types';
import ReportCard from './ReportCard';

interface DashboardProps {
  reports: CivicReport[];
  lockedLocation?: {
    country: string;
    state: string;
    lga: string;
  };
  organizationName?: string;
  isDemoMode?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

// COMPREHENSIVE STATIC WORLD DATA FOR DEMO PURPOSES
// This ensures that when a user selects a country, they see a "fully implemented" list of states/cities.
const STATIC_WORLD_DATA: Record<string, Record<string, string[]>> = {
  "Nigeria": {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
    "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
    "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
    "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
    "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
    "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
    "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
    "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
    "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
    "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
    "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
    "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
    "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
    "FCT": ["Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Abaji"],
    "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
    "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West"],
    "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
    "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
    "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
    "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
    "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
    "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
    "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
    "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
    "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
    "Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
    "Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
    "Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
    "Plateau": ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
    "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
    "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
    "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
    "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
    "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Chafe", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Zurmi"]
  },
  "Morocco": {
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Agdal-Ryad", "Hassan", "Yacoub El Mansour", "Skhirate-Témara", "Khemisset", "Sidi Kacem", "Sidi Slimane"],
    "Casablanca-Settat": ["Casablanca", "Mohammedia", "El Jadida", "Nouaceur", "Médiouna", "Benslimane", "Berrechid", "Settat", "Sidi Bennour"],
    "Fès-Meknès": ["Fès", "Meknès", "El Hajeb", "Ifrane", "Moulay Yacoub", "Sefrou", "Boulemane", "Taounate", "Taza"],
    "Marrakesh-Safi": ["Marrakesh", "Chichaoua", "Al Haouz", "El Kelâa des Sraghna", "Essaouira", "Rehamna", "Safi", "Youssoufia"],
    "Tangier-Tétouan-Al Hoceïma": ["Tangier-Assilah", "M'diq-Fnideq", "Tétouan", "Fahs-Anjra", "Larache", "Al Hoceïma", "Chefchaouen", "Ouezzane"],
    "Oriental": ["Oujda-Angad", "Nador", "Driouch", "Jerada", "Berkan", "Taourirt", "Guercif", "Figuig"],
    "Béni Mellal-Khénifra": ["Béni Mellal", "Azilal", "Fquih Ben Salah", "Khénifra", "Khouribga"],
    "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Midelt", "Tinghir", "Zagora"],
    "Souss-Massa": ["Agadir-Ida-Ou-Tanane", "Inezgane-Aït Melloul", "Chtouka-Aït Baha", "Taroudannt", "Tiznit", "Tata"],
    "Guelmim-Oued Noun": ["Guelmim", "Assa-Zag", "Tan-Tan", "Sidi Ifni"],
    "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Es-Semara"],
    "Dakhla-Oued Ed-Dahab": ["Oued Ed-Dahab", "Aousserd"]
  },
  "USA": {
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
    "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
    "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Port St. Lucie", "Tallahassee", "Cape Coral", "Fort Lauderdale"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Elgin", "Peoria", "Champaign", "Waukegan"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Altoona"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"],
    "Georgia": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell", "Johns Creek", "Albany"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Greenville"],
    "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Livonia", "Troy"]
  },
  "United Kingdom": {
    "England": ["London", "Birmingham", "Leeds", "Sheffield", "Manchester", "Liverpool", "Bristol", "Newcastle", "Sunderland", "Wolverhampton"],
    "Scotland": ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Paisley", "East Kilbride", "Livingston", "Hamilton", "Cumbernauld", "Kirkcaldy"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry", "Neath", "Cwmbran", "Bridgend", "Llanelli", "Merthyr Tydfil"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newtownabbey", "Bangor", "Craigavon", "Castlereagh", "Ballymena", "Newtownards", "Carrickfergus"]
  },
  "India": {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Kalyan-Dombivali", "Vasai-Virar City", "Aurangabad", "Navi Mumbai"],
    "Delhi": ["New Delhi", "North Delhi", "North West Delhi", "West Delhi", "South West Delhi", "South Delhi", "South East Delhi", "Central Delhi", "North East Delhi", "Shahdara", "East Delhi"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Tirunelveli", "Thoothukudi"]
  }
};

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "USA", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const Dashboard: React.FC<DashboardProps> = ({ reports, lockedLocation, organizationName, isDemoMode }) => {
  
  // --- CASCADING FILTER STATE ---
  // If lockedLocation is provided (for Organizations), initialize state with it.
  const [selectedCountry, setSelectedCountry] = useState<string>(lockedLocation?.country || 'All');
  const [selectedCity, setSelectedCity] = useState<string>(lockedLocation?.state || 'All'); 
  const [selectedTown, setSelectedTown] = useState<string>(lockedLocation?.lga || 'All'); 

  // --- 1. EXTRACT UNIQUE HIERARCHY VALUES ---
  const hierarchy = useMemo(() => {
    // Start with the comprehensive list of all countries
    const uniqueCountries = new Set<string>(ALL_COUNTRIES);
    
    // Cities (Level 1) depend on Country
    const citiesByCountry: Record<string, Set<string>> = {};
    // Towns (Level 2) depend on City
    const townsByCity: Record<string, Set<string>> = {};

    // 1A. POPULATE FROM STATIC WORLD DATA
    // This ensures dropdowns have values even if no reports exist yet
    Object.entries(STATIC_WORLD_DATA).forEach(([country, states]) => {
      uniqueCountries.add(country);
      
      if (!citiesByCountry[country]) citiesByCountry[country] = new Set();
      
      Object.entries(states).forEach(([state, towns]) => {
        citiesByCountry[country].add(state);
        
        if (!townsByCity[state]) townsByCity[state] = new Set();
        towns.forEach(town => townsByCity[state].add(town));
      });
    });

    // 1B. MERGE WITH ACTUAL REPORT DATA
    // This adds any locations found in reports that might not be in the static list
    reports.forEach(r => {
      const c = r.country || 'Unknown';
      const city = r.state || 'Unknown';
      const town = r.lga || 'Unknown';

      // Add Country
      uniqueCountries.add(c);

      // Add City to Country
      if (!citiesByCountry[c]) citiesByCountry[c] = new Set();
      citiesByCountry[c].add(city);

      // Add Town to City
      if (!townsByCity[city]) townsByCity[city] = new Set();
      townsByCity[city].add(town);
    });

    return { 
      countries: Array.from(uniqueCountries).sort(), 
      citiesByCountry, 
      townsByCity 
    };
  }, [reports]);

  // Reset child filters when parent changes - BUT ONLY if not locked
  useEffect(() => {
    if (!lockedLocation) {
      setSelectedCity('All');
      setSelectedTown('All');
    }
  }, [selectedCountry, lockedLocation]);

  useEffect(() => {
    if (!lockedLocation) {
      setSelectedTown('All');
    }
  }, [selectedCity, lockedLocation]);

  // --- 2. DETERMINE CURRENT SCOPE ---
  const currentScope = useMemo(() => {
    if (selectedTown !== 'All') return 'Town';
    if (selectedCity !== 'All') return 'City';
    if (selectedCountry !== 'All') return 'Country';
    return 'Global';
  }, [selectedCountry, selectedCity, selectedTown]);

  // --- 3. FILTER REPORTS ---
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (selectedCountry !== 'All' && r.country !== selectedCountry) return false;
      if (selectedCity !== 'All' && r.state !== selectedCity) return false;
      if (selectedTown !== 'All' && r.lga !== selectedTown) return false;
      return true;
    });
  }, [reports, selectedCountry, selectedCity, selectedTown]);

  // --- 4. GENERATE STATISTICS ---
  const stats: ReportStats = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const regionCount: Record<string, number> = {}; 
    let highUrgency = 0;

    filteredReports.forEach(r => {
      categoryCount[r.issue_type] = (categoryCount[r.issue_type] || 0) + 1;
      
      let groupingKey = "Unknown";
      if (currentScope === 'Global') groupingKey = r.country || "Unknown";
      else if (currentScope === 'Country') groupingKey = r.state || "Unknown";
      else if (currentScope === 'City') groupingKey = r.lga || "Unknown";
      else groupingKey = r.location || "Location"; 

      regionCount[groupingKey] = (regionCount[groupingKey] || 0) + 1;

      if (r.urgency === 'High') highUrgency++;
    });

    return {
      total: filteredReports.length,
      byCategory: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
      highUrgencyCount: highUrgency,
      byRegion: Object.entries(regionCount).map(([name, value]) => ({ name, value }))
    };
  }, [filteredReports, currentScope]);

  return (
    <div className="space-y-8">
      
      {/* COMMAND CENTER HEADER */}
      <div className={`text-white p-6 rounded-xl shadow-xl border border-slate-700 ${isDemoMode ? 'bg-slate-800' : 'bg-slate-900'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold text-sm tracking-wide uppercase">
                {isDemoMode ? 'Unified Command Center (Demo)' : lockedLocation ? organizationName || 'Organization View' : 'Global Operations Center'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {currentScope === 'Global' && "World View"}
              {currentScope === 'Country' && selectedCountry}
              {currentScope === 'City' && `${selectedCity}, ${selectedCountry}`}
              {currentScope === 'Town' && `${selectedTown}, ${selectedCity}`}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isDemoMode
                ? "Full access mode: Visualize data, switch regions, and act on reports without restriction."
                : lockedLocation 
                  ? "Your dashboard is restricted to your organization's jurisdiction." 
                  : "Aggregated data from all member nations."}
            </p>
          </div>
          
          <div className={`flex items-center space-x-2 p-2 rounded-lg border mt-4 md:mt-0 ${isDemoMode ? 'bg-amber-900/50 border-amber-700' : 'bg-slate-800/50 border-slate-600'}`}>
             {isDemoMode ? <PlayCircle className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-emerald-400" />}
             <span className={`text-xs font-mono ${isDemoMode ? 'text-amber-400' : 'text-emerald-400'}`}>
               {isDemoMode ? 'DEMO ENVIRONMENT' : 'SECURE CONNECTION'}
             </span>
          </div>
        </div>

        {/* CASCADING DROPDOWNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg">
           
           {/* 1. Country Selector */}
           <div>
             <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center">
               1. Country {lockedLocation && <Lock className="w-3 h-3 ml-1 text-slate-500"/>}
             </label>
             <select 
               value={selectedCountry}
               onChange={(e) => setSelectedCountry(e.target.value)}
               disabled={!!lockedLocation?.country}
               className={`w-full text-white text-sm p-2.5 rounded border outline-none ${!!lockedLocation?.country ? 'bg-slate-900 border-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-700 border-slate-600 focus:ring-2 focus:ring-blue-500'}`}
             >
               <option value="All">All Countries</option>
               {hierarchy.countries.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>

           {/* 2. City/State Selector */}
           <div>
             <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center">
               2. City / Region {lockedLocation?.state && <Lock className="w-3 h-3 ml-1 text-slate-500"/>}
             </label>
             <select 
               value={selectedCity}
               onChange={(e) => setSelectedCity(e.target.value)}
               disabled={selectedCountry === 'All' || !!lockedLocation?.state}
               className={`w-full text-white text-sm p-2.5 rounded border outline-none ${!!lockedLocation?.state ? 'bg-slate-900 border-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-700 border-slate-600 focus:ring-2 focus:ring-blue-500'}`}
             >
               <option value="All">All Cities / Regions</option>
               {selectedCountry !== 'All' && Array.from(hierarchy.citiesByCountry[selectedCountry] || []).sort().map(city => (
                 <option key={city} value={city}>{city}</option>
               ))}
               {lockedLocation?.state && <option value={lockedLocation.state}>{lockedLocation.state}</option>}
             </select>
           </div>

           {/* 3. Town/District Selector */}
           <div>
             <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center">
                3. Town / District {lockedLocation?.lga && <Lock className="w-3 h-3 ml-1 text-slate-500"/>}
             </label>
             <select 
               value={selectedTown}
               onChange={(e) => setSelectedTown(e.target.value)}
               disabled={selectedCity === 'All' || !!lockedLocation?.lga}
               className={`w-full text-white text-sm p-2.5 rounded border outline-none ${!!lockedLocation?.lga ? 'bg-slate-900 border-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-700 border-slate-600 focus:ring-2 focus:ring-blue-500'}`}
             >
               <option value="All">All Towns</option>
               {selectedCity !== 'All' && Array.from(hierarchy.townsByCity[selectedCity] || []).sort().map(town => (
                 <option key={town} value={town}>{town}</option>
               ))}
               {lockedLocation?.lga && <option value={lockedLocation.lga}>{lockedLocation.lga}</option>}
             </select>
           </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Reports</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Critical Priority</p>
            <p className="text-2xl font-bold text-slate-800">{stats.highUrgencyCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Scope</p>
            <p className="text-xl font-bold text-slate-800 truncate max-w-[140px]" title={currentScope}>
               {currentScope}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Top Issue</p>
            <p className="text-lg font-bold text-slate-800 truncate max-w-[140px]">
              {stats.byCategory.slice().sort((a,b) => b.value - a.value)[0]?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Issues by Category</h3>
          <div className="h-64 w-full">
            {stats.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* Breakdown by Geography */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {currentScope === 'Global' && "Breakdown by Country"}
            {currentScope === 'Country' && `Cities / Regions in ${selectedCountry}`}
            {currentScope === 'City' && `Towns / Districts in ${selectedCity}`}
            {currentScope === 'Town' && `Issues in ${selectedTown}`}
          </h3>
          <div className="h-64 w-full">
             {stats.byRegion.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byRegion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.byRegion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-5 h-5 text-slate-500" />
          <h3 className="text-xl font-bold text-slate-800">
             Reports in {selectedTown !== 'All' ? selectedTown : selectedCity !== 'All' ? selectedCity : selectedCountry !== 'All' ? selectedCountry : 'Global Feed'}
          </h3>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">No reports found for this specific location.</p>
            </div>
          ) : (
            filteredReports.slice().reverse().map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                isDemoMode={isDemoMode}
                viewerRole={isDemoMode ? 'organization' : undefined} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;