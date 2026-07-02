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