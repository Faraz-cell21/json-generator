import { faker } from "@faker-js/faker";

export type FieldSchema =
  | PrimitiveField
  | ObjectField
  | ArrayField;

export interface PrimitiveField {
  type: "string" | "number" | "boolean";
  fakerType?: string;
}

export interface ObjectField {
  type: "object";
  fields: Record<string, FieldSchema>;
}

export interface ArrayField {
  type: "array";
  itemType: "string" | "number" | "boolean" | "object";
  fakerType?: string;
  count?: number;
  fields?: Record<string, FieldSchema>;
}

export type SchemaInput = Record<string, FieldSchema>;

const customStringGenerators: Record<string, () => string> = {
  "custom.sex": () =>
    faker.helpers.arrayElement([
      "male",
      "female",
      "intersex",
      "non-binary",
      "genderqueer",
      "agender",
      "other",
      "prefer not to say",
    ]),
  "custom.prefix": () =>
    faker.helpers.arrayElement([
      "Mr.",
      "Ms.",
      "Mrs.",
      "Miss",
      "Dr.",
      "Prof.",
      "Mx.",
    ]),
  "custom.protocol": () =>
    faker.helpers.arrayElement([
      "http",
      "https",
      "ftp",
      "ftps",
      "ws",
      "wss",
      "smtp",
      "imap",
      "pop3",
      "ssh",
    ]),
  "custom.creditCardIssuer": () =>
    faker.finance
      .creditCardIssuer()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  "custom.gitShortSha": () => faker.git.commitSha({ length: 7 }),
  "custom.language": () => faker.location.language().name,
  "custom.languageCode": () => faker.location.language().alpha2,
  "custom.monthName": () => faker.date.month(),
  "custom.airportName": () => faker.airline.airport().name,
  "custom.airportIata": () => faker.airline.airport().iataCode,
  "custom.flightNumber": () => faker.airline.flightNumber(),
  "custom.seatNumber": () => faker.airline.seat(),
  "custom.airlineName": () => faker.airline.airline().name,
  "custom.aircraftType": () => faker.airline.aircraftType(),
  "custom.recordLocator": () => faker.airline.recordLocator(),
  "custom.birthdateIso": () => faker.date.birthdate().toISOString().split("T")[0],
  "custom.datePastIso": () => faker.date.past().toISOString().split("T")[0],
  "custom.dateFutureIso": () => faker.date.future().toISOString().split("T")[0],
  "custom.dateRecentIso": () => faker.date.recent().toISOString().split("T")[0],
  "custom.dateTimeIso": () => faker.date.recent().toISOString(),
  "custom.chemicalElement": () => faker.science.chemicalElement().name,
  "custom.scienceUnit": () => {
    const unit = faker.science.unit();
    return `${unit.name} (${unit.symbol})`;
  },
};

const customNumberGenerators: Record<string, () => number> = {
  "custom.randomInt": () => faker.number.int({ min: 1, max: 10000 }),
  "custom.randomFloat": () =>
    faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
  "custom.bigInt": () => Number(faker.number.bigInt()),
  "custom.ageChildYoung": () => faker.number.int({ min: 1, max: 12 }),
  "custom.ageTeen": () => faker.number.int({ min: 13, max: 17 }),
  "custom.ageYoungAdult": () => faker.number.int({ min: 18, max: 25 }),
  "custom.ageAdult": () => faker.number.int({ min: 26, max: 40 }),
  "custom.ageMiddle": () => faker.number.int({ min: 41, max: 65 }),
  "custom.ageSenior": () => faker.number.int({ min: 66, max: 100 }),
  "custom.ageFull": () => faker.number.int({ min: 1, max: 100 }),
  "custom.rating": () =>
    faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
  "custom.ratingTen": () =>
    faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
  "custom.gpa": () =>
    faker.number.float({ min: 0, max: 4, fractionDigits: 2 }),
  "custom.creditScore": () => faker.number.int({ min: 300, max: 850 }),
  "custom.percentage": () => faker.number.int({ min: 0, max: 100 }),
  "custom.discount": () => faker.number.int({ min: 5, max: 50 }),
  "custom.scoreHundred": () => faker.number.int({ min: 0, max: 100 }),
  "custom.score": () => faker.number.int({ min: 0, max: 1000 }),
  "custom.percentile": () => faker.number.int({ min: 1, max: 99 }),
  "custom.rank": () => faker.number.int({ min: 1, max: 100 }),
  "custom.quantitySmall": () => faker.number.int({ min: 1, max: 10 }),
  "custom.quantity": () => faker.number.int({ min: 1, max: 100 }),
  "custom.quantityLarge": () => faker.number.int({ min: 1, max: 1000 }),
  "custom.price": () =>
    faker.number.float({ min: 1, max: 999, fractionDigits: 2 }),
  "custom.salary": () => faker.number.int({ min: 30000, max: 150000 }),
  "custom.revenue": () => faker.number.int({ min: 10000, max: 1000000 }),
  "custom.taxRate": () =>
    faker.number.float({ min: 5, max: 30, fractionDigits: 1 }),
  "custom.interestRate": () =>
    faker.number.float({ min: 1, max: 15, fractionDigits: 2 }),
  "custom.tipPercent": () => faker.number.int({ min: 10, max: 25 }),
  "custom.orderId": () => faker.number.int({ min: 100000, max: 999999 }),
  "custom.userId": () => faker.number.int({ min: 1000, max: 9999999 }),
  "custom.invoiceId": () => faker.number.int({ min: 1000000, max: 9999999 }),
  "custom.ticketNumber": () => faker.number.int({ min: 10000, max: 99999 }),
  "custom.serialNumber": () =>
    faker.number.int({ min: 1000000000, max: 9999999999 }),
  "custom.year": () => faker.number.int({ min: 1990, max: 2030 }),
  "custom.month": () => faker.number.int({ min: 1, max: 12 }),
  "custom.day": () => faker.number.int({ min: 1, max: 31 }),
  "custom.week": () => faker.number.int({ min: 1, max: 52 }),
  "custom.quarter": () => faker.number.int({ min: 1, max: 4 }),
  "custom.hour": () => faker.number.int({ min: 0, max: 23 }),
  "custom.minute": () => faker.number.int({ min: 0, max: 59 }),
  "custom.second": () => faker.number.int({ min: 0, max: 59 }),
  "custom.unixTimestamp": () =>
    Math.floor(faker.date.recent().getTime() / 1000),
  "custom.httpStatus": () =>
    faker.helpers.arrayElement([200, 201, 204, 301, 400, 401, 403, 404, 500]),
  "custom.port": () => faker.number.int({ min: 1, max: 65535 }),
  "custom.pageNumber": () => faker.number.int({ min: 1, max: 500 }),
  "custom.responseTimeMs": () => faker.number.int({ min: 10, max: 2000 }),
  "custom.timeoutSec": () => faker.number.int({ min: 1, max: 120 }),
  "custom.bandwidthMbps": () => faker.number.int({ min: 1, max: 1000 }),
  "custom.wifiChannel": () => faker.number.int({ min: 1, max: 11 }),
  "custom.subnetPrefix": () => faker.number.int({ min: 8, max: 30 }),
  "custom.index": () => faker.number.int({ min: 0, max: 99 }),
  "custom.byte": () => faker.number.int({ min: 0, max: 255 }),
  "custom.binary": () => faker.number.int({ min: 0, max: 1 }),
  "custom.heightCm": () => faker.number.int({ min: 140, max: 200 }),
  "custom.weightKg": () => faker.number.int({ min: 40, max: 120 }),
  "custom.bmi": () =>
    faker.number.float({ min: 16, max: 35, fractionDigits: 1 }),
  "custom.temperature": () => faker.number.int({ min: -10, max: 40 }),
  "custom.distanceKm": () => faker.number.int({ min: 1, max: 500 }),
  "custom.speedKmh": () => faker.number.int({ min: 20, max: 200 }),
  "custom.latitude": () =>
    faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
  "custom.longitude": () =>
    faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
  "custom.stockPrice": () =>
    faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
  "custom.exchangeRate": () =>
    faker.number.float({ min: 0.5, max: 2.5, fractionDigits: 4 }),
  "custom.cartItems": () => faker.number.int({ min: 1, max: 20 }),
  "custom.stockLevel": () => faker.number.int({ min: 0, max: 500 }),
  "custom.employeeCount": () => faker.number.int({ min: 1, max: 500 }),
  "custom.dice": () => faker.number.int({ min: 1, max: 6 }),
  "custom.lotteryNumber": () => faker.number.int({ min: 1, max: 49 }),
  "custom.floor": () => faker.number.int({ min: 1, max: 50 }),
  "custom.gradeLevel": () => faker.number.int({ min: 1, max: 12 }),
  "custom.followers": () => faker.number.int({ min: 0, max: 100000 }),
  "custom.likes": () => faker.number.int({ min: 0, max: 10000 }),
  "custom.views": () => faker.number.int({ min: 0, max: 1000000 }),
  "custom.memoryGb": () => faker.number.int({ min: 1, max: 64 }),
  "custom.storageGb": () =>
    faker.helpers.arrayElement([32, 64, 128, 256, 512, 1024, 2048]),
};

function formatFakerValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return value;
}

function resolveFaker(fakerType: string): unknown {
  if (fakerType in customStringGenerators) {
    return customStringGenerators[fakerType]();
  }

  if (fakerType in customNumberGenerators) {
    return customNumberGenerators[fakerType]();
  }

  try {
    const parts = fakerType.split(".");
    let current: any = faker;
    for (const part of parts) {
      current = current[part];
    }
    if (typeof current === "function") {
      return formatFakerValue(current());
    }
    return formatFakerValue(current);
  } catch {
    return faker.word.sample();
  }
}

function generateValue(fieldSchema: FieldSchema): unknown {
  switch (fieldSchema.type) {
    case "string":
      return fieldSchema.fakerType
        ? resolveFaker(fieldSchema.fakerType)
        : faker.word.sample();

    case "number":
      if (fieldSchema.fakerType) {
        const value = resolveFaker(fieldSchema.fakerType);
        return typeof value === "number" ? value : Number(value);
      }
      return faker.number.int({ min: 1, max: 1000 });

    case "boolean":
      return faker.datatype.boolean();

    case "object":
      return generateFromSchema(fieldSchema.fields);

    case "array": {
      const count = fieldSchema.count ?? faker.number.int({ min: 2, max: 5 });

      if (fieldSchema.itemType === "object" && fieldSchema.fields) {
        return Array.from({ length: count }, () =>
          generateFromSchema(fieldSchema.fields!)
        );
      }

      return Array.from({ length: count }, () => {
        if (fieldSchema.fakerType) {
          const value = resolveFaker(fieldSchema.fakerType);
          if (fieldSchema.itemType === "number") {
            return typeof value === "number" ? value : Number(value);
          }
          return value;
        }
        switch (fieldSchema.itemType) {
          case "number":
            return faker.number.int({ min: 1, max: 1000 });
          case "boolean":
            return faker.datatype.boolean();
          default:
            return faker.word.sample();
        }
      });
    }

    default:
      return null;
  }
}

export function generateFromSchema(
  schema: Record<string, FieldSchema>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in schema) {
    result[key] = generateValue(schema[key]);
  }
  return result;
}

export function generateRecords(
  schema: SchemaInput,
  count: number
): Record<string, unknown>[] {
  return Array.from({ length: count }, () => generateFromSchema(schema));
}
