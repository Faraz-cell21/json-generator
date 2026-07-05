export interface FakerOption {
  label: string;
  value: string;
}

export const stringFakerOptions: FakerOption[] = [
  // Person
  { label: "First Name", value: "person.firstName" },
  { label: "Last Name", value: "person.lastName" },
  { label: "Middle Name", value: "person.middleName" },
  { label: "Full Name", value: "person.fullName" },
  { label: "Prefix", value: "custom.prefix" },
  { label: "Suffix", value: "person.suffix" },
  { label: "Gender", value: "person.gender" },
  { label: "Sex", value: "custom.sex" },
  { label: "Bio", value: "person.bio" },
  { label: "Zodiac Sign", value: "person.zodiacSign" },
  { label: "Job Title", value: "person.jobTitle" },
  { label: "Job Area", value: "person.jobArea" },
  { label: "Job Descriptor", value: "person.jobDescriptor" },
  { label: "Job Type", value: "person.jobType" },

  // Internet
  { label: "Email", value: "internet.email" },
  { label: "Example Email", value: "internet.exampleEmail" },
  { label: "Username", value: "internet.username" },
  { label: "Display Name", value: "internet.displayName" },
  { label: "Password", value: "internet.password" },
  { label: "Domain Name", value: "internet.domainName" },
  { label: "Domain Suffix", value: "internet.domainSuffix" },
  { label: "Domain Word", value: "internet.domainWord" },
  { label: "URL", value: "internet.url" },
  { label: "Protocol", value: "custom.protocol" },
  { label: "IP Address", value: "internet.ip" },
  { label: "IPv4", value: "internet.ipv4" },
  { label: "IPv6", value: "internet.ipv6" },
  { label: "MAC Address", value: "internet.mac" },
  { label: "JWT", value: "internet.jwt" },
  { label: "JWT Algorithm", value: "internet.jwtAlgorithm" },
  { label: "HTTP Method", value: "internet.httpMethod" },
  { label: "User Agent", value: "internet.userAgent" },
  { label: "Emoji", value: "internet.emoji" },

  // Phone
  { label: "Phone", value: "phone.number" },
  { label: "IMEI", value: "phone.imei" },

  // Location
  { label: "Building Number", value: "location.buildingNumber" },
  { label: "Street", value: "location.street" },
  { label: "Street Address", value: "location.streetAddress" },
  { label: "Secondary Address", value: "location.secondaryAddress" },
  { label: "City", value: "location.city" },
  { label: "County", value: "location.county" },
  { label: "State", value: "location.state" },
  { label: "Zip Code", value: "location.zipCode" },
  { label: "Country", value: "location.country" },
  { label: "Country Code", value: "location.countryCode" },
  { label: "Continent", value: "location.continent" },
  { label: "Language", value: "custom.language" },
  { label: "Language Code", value: "custom.languageCode" },
  { label: "Direction", value: "location.direction" },
  { label: "Time Zone", value: "location.timeZone" },

  // Company & commerce
  { label: "Company Name", value: "company.name" },
  { label: "Catch Phrase", value: "company.catchPhrase" },
  { label: "Buzz Phrase", value: "company.buzzPhrase" },
  { label: "Department", value: "commerce.department" },
  { label: "Product Name", value: "commerce.productName" },
  { label: "Product", value: "commerce.product" },
  { label: "Product Adjective", value: "commerce.productAdjective" },
  { label: "Product Description", value: "commerce.productDescription" },
  { label: "Product Material", value: "commerce.productMaterial" },
  { label: "ISBN", value: "commerce.isbn" },
  { label: "UPC", value: "commerce.upc" },

  // Finance
  { label: "Money Amount", value: "finance.amount" },
  { label: "Account Name", value: "finance.accountName" },
  { label: "Account Number", value: "finance.accountNumber" },
  { label: "IBAN", value: "finance.iban" },
  { label: "BIC / SWIFT", value: "finance.bic" },
  { label: "Routing Number", value: "finance.routingNumber" },
  { label: "Credit Card Number", value: "finance.creditCardNumber" },
  { label: "Credit Card CVV", value: "finance.creditCardCVV" },
  { label: "Credit Card Issuer", value: "custom.creditCardIssuer" },
  { label: "Currency Code", value: "finance.currencyCode" },
  { label: "Currency Name", value: "finance.currencyName" },
  { label: "Currency Symbol", value: "finance.currencySymbol" },
  { label: "Bitcoin Address", value: "finance.bitcoinAddress" },
  { label: "Ethereum Address", value: "finance.ethereumAddress" },
  { label: "Litecoin Address", value: "finance.litecoinAddress" },
  { label: "PIN", value: "finance.pin" },
  { label: "Transaction Type", value: "finance.transactionType" },
  { label: "Transaction Description", value: "finance.transactionDescription" },

  // Vehicle
  { label: "Vehicle", value: "vehicle.vehicle" },
  { label: "Vehicle Manufacturer", value: "vehicle.manufacturer" },
  { label: "Vehicle Model", value: "vehicle.model" },
  { label: "Vehicle Type", value: "vehicle.type" },
  { label: "Vehicle Fuel", value: "vehicle.fuel" },
  { label: "VIN", value: "vehicle.vin" },
  { label: "Vehicle Color", value: "vehicle.color" },

  // Airline
  { label: "Airport Name", value: "custom.airportName" },
  { label: "Airport IATA", value: "custom.airportIata" },
  { label: "Airline", value: "custom.airlineName" },
  { label: "Flight Number", value: "custom.flightNumber" },
  { label: "Seat Number", value: "custom.seatNumber" },
  { label: "Aircraft Type", value: "custom.aircraftType" },
  { label: "Record Locator", value: "custom.recordLocator" },

  // Color & image
  { label: "Random Photo URL", value: "custom.randomImage" },
  { label: "Color Name", value: "color.human" },
  { label: "RGB Color", value: "color.rgb" },
  { label: "CSS Color Space", value: "color.cssSupportedSpace" },
  { label: "Avatar URL", value: "image.avatar" },
  { label: "Placeholder Image URL", value: "image.url" },

  // Date & time (ISO formatted)
  { label: "Birthdate (ISO)", value: "custom.birthdateIso" },
  { label: "Date (Past ISO)", value: "custom.datePastIso" },
  { label: "Date (Future ISO)", value: "custom.dateFutureIso" },
  { label: "Date (Recent ISO)", value: "custom.dateRecentIso" },
  { label: "DateTime (ISO)", value: "custom.dateTimeIso" },
  { label: "Month Name", value: "custom.monthName" },
  { label: "Weekday", value: "date.weekday" },

  // Lorem & words
  { label: "Word", value: "word.sample" },
  { label: "Noun", value: "word.noun" },
  { label: "Verb", value: "word.verb" },
  { label: "Adjective", value: "word.adjective" },
  { label: "Adverb", value: "word.adverb" },
  { label: "Lorem Word", value: "lorem.word" },
  { label: "Lorem Sentence", value: "lorem.sentence" },
  { label: "Lorem Paragraph", value: "lorem.paragraph" },
  { label: "Lorem Slug", value: "lorem.slug" },
  { label: "Lorem Text", value: "lorem.text" },
  { label: "Lorem Lines", value: "lorem.lines" },

  // Food, book, music, animal
  { label: "Dish", value: "food.dish" },
  { label: "Ingredient", value: "food.ingredient" },
  { label: "Spice", value: "food.spice" },
  { label: "Book Title", value: "book.title" },
  { label: "Book Author", value: "book.author" },
  { label: "Book Genre", value: "book.genre" },
  { label: "Song Name", value: "music.songName" },
  { label: "Artist", value: "music.artist" },
  { label: "Music Genre", value: "music.genre" },
  { label: "Animal Type", value: "animal.type" },
  { label: "Dog Breed", value: "animal.dog" },
  { label: "Cat Breed", value: "animal.cat" },

  // Tech & dev
  { label: "UUID", value: "string.uuid" },
  { label: "Nano ID", value: "string.nanoid" },
  { label: "Alphanumeric", value: "string.alphanumeric" },
  { label: "Hex String", value: "string.hexadecimal" },
  { label: "Git Branch", value: "git.branch" },
  { label: "Git Commit Message", value: "git.commitMessage" },
  { label: "Git Commit SHA", value: "git.commitSha" },
  { label: "Git Short SHA", value: "custom.gitShortSha" },
  { label: "MongoDB ObjectId", value: "database.mongodbObjectId" },
  { label: "DB Column Name", value: "database.column" },
  { label: "DB Engine", value: "database.engine" },
  { label: "Hacker Phrase", value: "hacker.phrase" },
  { label: "Chemical Element", value: "custom.chemicalElement" },
  { label: "Science Unit", value: "custom.scienceUnit" },

  // System
  { label: "File Name", value: "system.fileName" },
  { label: "File Path", value: "system.filePath" },
  { label: "Directory Path", value: "system.directoryPath" },
  { label: "File Extension", value: "system.fileExt" },
  { label: "Mime Type", value: "system.mimeType" },
  { label: "Semantic Version", value: "system.semver" },
  { label: "Cron Expression", value: "system.cron" },
];

export const numberFakerOptions: FakerOption[] = [
  // Native faker numbers
  { label: "Random Int (1-10000)", value: "custom.randomInt" },
  { label: "Random Float (0-100)", value: "custom.randomFloat" },
  { label: "Big Int", value: "custom.bigInt" },
  { label: "HTTP Status Code", value: "custom.httpStatus" },
  { label: "Network Port", value: "internet.port" },

  // Age
  { label: "Age (1-12)", value: "custom.ageChildYoung" },
  { label: "Age (13-17)", value: "custom.ageTeen" },
  { label: "Age (18-25)", value: "custom.ageYoungAdult" },
  { label: "Age (26-40)", value: "custom.ageAdult" },
  { label: "Age (41-65)", value: "custom.ageMiddle" },
  { label: "Age (66-100)", value: "custom.ageSenior" },
  { label: "Age (1-100)", value: "custom.ageFull" },

  // Ratings & scores
  { label: "Rating (1-5)", value: "custom.rating" },
  { label: "Rating (1-10)", value: "custom.ratingTen" },
  { label: "GPA (0-4)", value: "custom.gpa" },
  { label: "Credit Score (300-850)", value: "custom.creditScore" },
  { label: "Percentage (0-100)", value: "custom.percentage" },
  { label: "Discount (5-50%)", value: "custom.discount" },
  { label: "Score (0-100)", value: "custom.scoreHundred" },
  { label: "Score (0-1000)", value: "custom.score" },
  { label: "Percentile (1-99)", value: "custom.percentile" },
  { label: "Rank (1-100)", value: "custom.rank" },

  // Commerce & finance
  { label: "Price ($1-$999)", value: "custom.price" },
  { label: "Salary ($30k-$150k)", value: "custom.salary" },
  { label: "Revenue ($10k-$1M)", value: "custom.revenue" },
  { label: "Tax Rate (5-30%)", value: "custom.taxRate" },
  { label: "Interest Rate (1-15%)", value: "custom.interestRate" },
  { label: "Tip (10-25%)", value: "custom.tipPercent" },
  { label: "Stock Price", value: "custom.stockPrice" },
  { label: "Exchange Rate", value: "custom.exchangeRate" },

  // Quantities & inventory
  { label: "Quantity (1-10)", value: "custom.quantitySmall" },
  { label: "Quantity (1-100)", value: "custom.quantity" },
  { label: "Quantity (1-1000)", value: "custom.quantityLarge" },
  { label: "Cart Items (1-20)", value: "custom.cartItems" },
  { label: "Stock Level (0-500)", value: "custom.stockLevel" },
  { label: "Employee Count (1-500)", value: "custom.employeeCount" },

  // IDs & references
  { label: "Order ID", value: "custom.orderId" },
  { label: "User ID", value: "custom.userId" },
  { label: "Invoice ID", value: "custom.invoiceId" },
  { label: "Ticket Number", value: "custom.ticketNumber" },
  { label: "Serial Number", value: "custom.serialNumber" },

  // Date & time parts
  { label: "Year (1990-2030)", value: "custom.year" },
  { label: "Month (1-12)", value: "custom.month" },
  { label: "Day (1-31)", value: "custom.day" },
  { label: "Week (1-52)", value: "custom.week" },
  { label: "Quarter (1-4)", value: "custom.quarter" },
  { label: "Hour (0-23)", value: "custom.hour" },
  { label: "Minute (0-59)", value: "custom.minute" },
  { label: "Second (0-59)", value: "custom.second" },
  { label: "Unix Timestamp", value: "custom.unixTimestamp" },

  // Tech & network
  { label: "Port (1-65535)", value: "custom.port" },
  { label: "Page Number (1-500)", value: "custom.pageNumber" },
  { label: "Response Time ms (10-2000)", value: "custom.responseTimeMs" },
  { label: "Timeout sec (1-120)", value: "custom.timeoutSec" },
  { label: "Bandwidth Mbps (1-1000)", value: "custom.bandwidthMbps" },
  { label: "WiFi Channel (1-11)", value: "custom.wifiChannel" },
  { label: "Subnet Prefix (/8-/30)", value: "custom.subnetPrefix" },

  // Physical & geo
  { label: "Height cm (140-200)", value: "custom.heightCm" },
  { label: "Weight kg (40-120)", value: "custom.weightKg" },
  { label: "BMI (16-35)", value: "custom.bmi" },
  { label: "Temperature °C (-10 to 40)", value: "custom.temperature" },
  { label: "Distance km (1-500)", value: "custom.distanceKm" },
  { label: "Speed km/h (20-200)", value: "custom.speedKmh" },
  { label: "Latitude", value: "custom.latitude" },
  { label: "Longitude", value: "custom.longitude" },

  // Misc numeric
  { label: "Index (0-99)", value: "custom.index" },
  { label: "Byte (0-255)", value: "custom.byte" },
  { label: "Binary (0 or 1)", value: "custom.binary" },
  { label: "Dice Roll (1-6)", value: "custom.dice" },
  { label: "Lottery Number (1-49)", value: "custom.lotteryNumber" },
  { label: "Floor (1-50)", value: "custom.floor" },
  { label: "Grade Level (1-12)", value: "custom.gradeLevel" },
  { label: "Followers (0-100k)", value: "custom.followers" },
  { label: "Likes (0-10k)", value: "custom.likes" },
  { label: "Views (0-1M)", value: "custom.views" },
  { label: "Memory GB (1-64)", value: "custom.memoryGb" },
  { label: "Storage GB (32-2048)", value: "custom.storageGb" },
];

export const arrayItemTypes = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Object", value: "object" },
];
