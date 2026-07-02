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
  fields?: Record<string, FieldSchema>; // if itemType is object
}

export type SchemaInput = Record<string, FieldSchema>;

// Resolves a fakerType string like "person.firstName" into faker.person.firstName()
function resolveFaker(fakerType: string): unknown {
  const customNumberGenerators: Record<string, () => number> = {
    "custom.ageChild": () => faker.number.int({ min: 1, max: 18 }),
    "custom.ageAdult": () => faker.number.int({ min: 18, max: 65 }),
    "custom.ageFull": () => faker.number.int({ min: 1, max: 100 }),
    "custom.rating": () =>
      faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    "custom.ratingTen": () =>
      faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
    "custom.percentage": () => faker.number.int({ min: 0, max: 100 }),
    "custom.discount": () => faker.number.int({ min: 5, max: 50 }),
    "custom.scoreHundred": () => faker.number.int({ min: 0, max: 100 }),
    "custom.score": () => faker.number.int({ min: 0, max: 1000 }),
    "custom.quantitySmall": () => faker.number.int({ min: 1, max: 10 }),
    "custom.quantity": () => faker.number.int({ min: 1, max: 100 }),
    "custom.quantityLarge": () => faker.number.int({ min: 1, max: 1000 }),
    "custom.price": () =>
      faker.number.float({ min: 1, max: 999, fractionDigits: 2 }),
    "custom.salary": () => faker.number.int({ min: 30000, max: 150000 }),
    "custom.orderId": () => faker.number.int({ min: 100000, max: 999999 }),
    "custom.userId": () => faker.number.int({ min: 1000, max: 9999999 }),
    "custom.serialNumber": () =>
      faker.number.int({ min: 1000000000, max: 9999999999 }),
    "custom.year": () => faker.number.int({ min: 1990, max: 2030 }),
    "custom.month": () => faker.number.int({ min: 1, max: 12 }),
    "custom.day": () => faker.number.int({ min: 1, max: 31 }),
    "custom.hour": () => faker.number.int({ min: 0, max: 23 }),
    "custom.minute": () => faker.number.int({ min: 0, max: 59 }),
    "custom.httpStatus": () =>
      faker.helpers.arrayElement([200, 201, 204, 301, 400, 401, 403, 404, 500]),
    "custom.port": () => faker.number.int({ min: 1, max: 65535 }),
    "custom.pageNumber": () => faker.number.int({ min: 1, max: 500 }),
    "custom.index": () => faker.number.int({ min: 0, max: 99 }),
    "custom.byte": () => faker.number.int({ min: 0, max: 255 }),
    "custom.binary": () => faker.number.int({ min: 0, max: 1 }),
    "custom.heightCm": () => faker.number.int({ min: 140, max: 200 }),
    "custom.weightKg": () => faker.number.int({ min: 40, max: 120 }),
    "custom.temperature": () => faker.number.int({ min: -10, max: 40 }),
    "custom.latitude": () =>
      faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
    "custom.longitude": () =>
      faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
    "custom.stockPrice": () =>
      faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    "custom.employeeCount": () => faker.number.int({ min: 1, max: 500 }),
  };

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
      return current();
    }
    return String(current);
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
        return resolveFaker(fieldSchema.fakerType);
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
          return resolveFaker(fieldSchema.fakerType);
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