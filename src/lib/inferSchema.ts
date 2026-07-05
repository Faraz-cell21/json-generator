import type {
  ArrayField,
  ArrayItemConfig,
  SchemaField,
  SchemaState,
} from "@/types/schema";
import { countNamedFields } from "@/types/schema";
import { calculateDepth } from "@/lib/schemaUtils";

const MAX_DEPTH = 12;
const MAX_JSON_BYTES = 1_000_000;

const STRING_NAME_PATTERNS: [RegExp, string][] = [
  [/^(first[_-]?name|fname)$/i, "person.firstName"],
  [/^(last[_-]?name|lname|surname)$/i, "person.lastName"],
  [/^(full[_-]?name)$/i, "person.fullName"],
  [/^name$/i, "person.fullName"],
  [/^(email|e[_-]?mail)$/i, "internet.email"],
  [/^(phone|mobile|tel)$/i, "phone.number"],
  [/^(city|town)$/i, "location.city"],
  [/^(country)$/i, "location.country"],
  [/^(zip|postal|postcode)$/i, "location.zipCode"],
  [/^(street|address)$/i, "location.streetAddress"],
  [/^(state|province)$/i, "location.state"],
  [/^(url|website|link|href)$/i, "internet.url"],
  [/^(avatar|image|photo|img|picture|thumbnail)$/i, "custom.randomImage"],
  [/^(uuid|guid)$/i, "string.uuid"],
  [/^(username|user[_-]?name)$/i, "internet.username"],
  [/^(password|passwd)$/i, "internet.password"],
  [/^(title)$/i, "book.title"],
  [/^(description|bio|summary)$/i, "lorem.paragraph"],
  [/^(company|organization|org)$/i, "company.name"],
  [/^(department)$/i, "commerce.department"],
  [/^(product)$/i, "commerce.productName"],
  [/^(color|colour)$/i, "color.human"],
  [/^(created|updated|modified|timestamp).*/i, "custom.dateTimeIso"],
  [/^(birthday|birthdate|dob)$/i, "custom.birthdateIso"],
  [/^(date)$/i, "custom.dateRecentIso"],
  [/^(id|_id)$/i, "string.uuid"],
];

const NUMBER_NAME_PATTERNS: [RegExp, string][] = [
  [/^(age)$/i, "custom.ageFull"],
  [/^(price|amount|cost|fee)$/i, "custom.price"],
  [/^(salary|income|revenue)$/i, "custom.salary"],
  [/^(rating|score)$/i, "custom.rating"],
  [/^(count|quantity|qty|total)$/i, "custom.quantity"],
  [/^(year)$/i, "custom.year"],
  [/^(month)$/i, "custom.month"],
  [/^(day)$/i, "custom.day"],
  [/^(latitude|lat)$/i, "custom.latitude"],
  [/^(longitude|lng|lon)$/i, "custom.longitude"],
  [/^(port)$/i, "custom.port"],
  [/^(percent|percentage)$/i, "custom.percentage"],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const URL_RE = /^https?:\/\//i;
const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

export interface InferSchemaResult {
  schema: SchemaState;
  suggestedRecords: number;
  fieldCount: number;
  depth: number;
}

export interface InferSchemaError {
  message: string;
}

function guessStringFaker(keyHint: string | undefined, value: string): string | undefined {
  if (keyHint) {
    for (const [pattern, fakerType] of STRING_NAME_PATTERNS) {
      if (pattern.test(keyHint)) return fakerType;
    }
  }

  if (EMAIL_RE.test(value)) return "internet.email";
  if (UUID_RE.test(value)) return "string.uuid";
  if (URL_RE.test(value)) {
    if (value.includes("picsum.photos")) return "custom.randomImage";
    return "internet.url";
  }
  if (ISO_DATE_RE.test(value)) return "custom.dateTimeIso";

  return undefined;
}

function guessNumberFaker(keyHint: string | undefined): string | undefined {
  if (!keyHint) return undefined;
  for (const [pattern, fakerType] of NUMBER_NAME_PATTERNS) {
    if (pattern.test(keyHint)) return fakerType;
  }
  return undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function jsonTypeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function inferArrayItemConfig(
  arr: unknown[],
  keyHint: string | undefined,
  depth: number
): ArrayItemConfig {
  if (arr.length === 0) {
    return { itemType: "string", count: 0 };
  }

  const itemTypes = arr.map((item) => jsonTypeOf(item));
  const uniqueTypes = new Set(itemTypes);

  const shouldBeTuple =
    uniqueTypes.size > 1 ||
    arr.some((item) => Array.isArray(item)) ||
    (arr.some(isPlainObject) &&
      arr.some((item) => !isPlainObject(item) && !Array.isArray(item)));

  if (shouldBeTuple) {
    return {
      itemType: "tuple",
      count: arr.length,
      tupleItems: arr.map((item, index) =>
        inferField(item, `${keyHint ?? "item"}_${index}`, depth + 1)
      ),
    };
  }

  const first = arr[0];

  if (isPlainObject(first)) {
    const objects = arr.filter(isPlainObject) as Record<string, unknown>[];
    return {
      itemType: "object",
      count: arr.length,
      fields: mergeObjectRecords(objects, depth + 1),
    };
  }

  if (Array.isArray(first)) {
    return {
      itemType: "array",
      count: arr.length,
      itemSchema: inferArrayItemConfig(first as unknown[], keyHint, depth + 1),
    };
  }

  const primitiveType = typeof first as "string" | "number" | "boolean";
  const field: ArrayItemConfig = {
    itemType: primitiveType,
    count: arr.length,
  };

  if (primitiveType === "string") {
    field.fakerType = guessStringFaker(keyHint, first as string);
  } else if (primitiveType === "number") {
    field.fakerType = guessNumberFaker(keyHint);
  }

  return field;
}

function inferField(
  value: unknown,
  keyHint: string | undefined,
  depth: number
): SchemaField {
  if (depth > MAX_DEPTH) {
    return { type: "string" };
  }

  if (value === null || value === undefined) {
    return { type: "string", fakerType: guessStringFaker(keyHint, "") };
  }

  if (typeof value === "boolean") {
    return { type: "boolean" };
  }

  if (typeof value === "number") {
    return {
      type: "number",
      fakerType: guessNumberFaker(keyHint),
    };
  }

  if (typeof value === "string") {
    return {
      type: "string",
      fakerType: guessStringFaker(keyHint, value),
    };
  }

  if (Array.isArray(value)) {
    const config = inferArrayItemConfig(value, keyHint, depth);
    if (config.itemType === "tuple") {
      return {
        type: "tuple",
        tupleItems: config.tupleItems ?? [],
      };
    }
    return { type: "array", ...config };
  }

  if (isPlainObject(value)) {
    const fields: SchemaState = {};
    for (const [key, child] of Object.entries(value)) {
      fields[key] = inferField(child, key, depth + 1);
    }
    return { type: "object", fields };
  }

  return { type: "string" };
}

function mergeObjectRecords(
  records: Record<string, unknown>[],
  depth: number
): SchemaState {
  const keys = new Set<string>();
  for (const record of records) {
    for (const key of Object.keys(record)) {
      keys.add(key);
    }
  }

  const fields: SchemaState = {};
  for (const key of keys) {
    const inferred = records
      .map((record) => record[key])
      .filter((value) => value !== undefined)
      .map((value) => inferField(value, key, depth));

    fields[key] =
      inferred.length === 1
        ? inferred[0]
        : inferred.reduce((merged, field) => mergeFields(merged, field, depth));
  }

  return fields;
}

function mergeArrayItemConfig(
  a: ArrayItemConfig,
  b: ArrayItemConfig,
  depth: number
): ArrayItemConfig {
  if (a.itemType === "tuple" || b.itemType === "tuple") {
    return { itemType: "string", count: Math.max(a.count ?? 0, b.count ?? 0) };
  }

  if (a.itemType !== b.itemType) {
    return { itemType: "string", count: Math.max(a.count ?? 0, b.count ?? 0) };
  }

  if (a.itemType === "object") {
    const aFields = a.fields ?? {};
    const bFields = b.fields ?? {};
    const keys = new Set([...Object.keys(aFields), ...Object.keys(bFields)]);
    const fields: SchemaState = {};
    for (const key of keys) {
      if (aFields[key] && bFields[key]) {
        fields[key] = mergeFields(aFields[key], bFields[key], depth);
      } else {
        fields[key] = aFields[key] ?? bFields[key];
      }
    }
    return {
      itemType: "object",
      count: Math.max(a.count ?? 0, b.count ?? 0),
      fields,
    };
  }

  if (a.itemType === "array" && a.itemSchema && b.itemSchema) {
    return {
      itemType: "array",
      count: Math.max(a.count ?? 0, b.count ?? 0),
      itemSchema: mergeArrayItemConfig(a.itemSchema, b.itemSchema, depth + 1),
    };
  }

  return {
    itemType: a.itemType,
    count: Math.max(a.count ?? 0, b.count ?? 0),
    fakerType: a.fakerType ?? b.fakerType,
  };
}

function mergeFields(
  a: SchemaField,
  b: SchemaField,
  depth: number
): SchemaField {
  if (a.type === b.type) {
    if (a.type === "object" && b.type === "object") {
      const keys = new Set([
        ...Object.keys(a.fields),
        ...Object.keys(b.fields),
      ]);
      const fields: SchemaState = {};
      for (const key of keys) {
        if (a.fields[key] && b.fields[key]) {
          fields[key] = mergeFields(a.fields[key], b.fields[key], depth);
        } else {
          fields[key] = a.fields[key] ?? b.fields[key];
        }
      }
      return { type: "object", fields };
    }

    if (a.type === "tuple" && b.type === "tuple") {
      const length = Math.max(a.tupleItems.length, b.tupleItems.length);
      const tupleItems: SchemaField[] = [];
      for (let i = 0; i < length; i++) {
        if (a.tupleItems[i] && b.tupleItems[i]) {
          tupleItems.push(mergeFields(a.tupleItems[i], b.tupleItems[i], depth));
        } else {
          tupleItems.push(a.tupleItems[i] ?? b.tupleItems[i]);
        }
      }
      return { type: "tuple", tupleItems };
    }

    if (a.type === "array" && b.type === "array") {
      return {
        type: "array",
        ...mergeArrayItemConfig(a, b, depth),
      };
    }

    if (a.type === "string" && b.type === "string") {
      return { type: "string", fakerType: a.fakerType ?? b.fakerType };
    }

    if (a.type === "number" && b.type === "number") {
      return { type: "number", fakerType: a.fakerType ?? b.fakerType };
    }

    return a;
  }

  if (a.type === "number" && b.type === "string") return b;
  if (a.type === "string" && b.type === "number") return a;
  if (a.type === "boolean" || b.type === "boolean") {
    return { type: "string" };
  }

  return { type: "string" };
}

function inferFromRoot(input: unknown): {
  schema: SchemaState;
  suggestedRecords: number;
} {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return {
        schema: {
          items: { type: "array", itemType: "string", count: 0 },
        },
        suggestedRecords: 1,
      };
    }

    if (input.every(isPlainObject)) {
      return {
        schema: mergeObjectRecords(input as Record<string, unknown>[], 0),
        suggestedRecords: input.length,
      };
    }

    if (input.every((item) => !isPlainObject(item))) {
      const config = inferArrayItemConfig(input, "items", 0);
      if (config.itemType === "tuple") {
        return {
          schema: {
            items: { type: "tuple", tupleItems: config.tupleItems ?? [] },
          },
          suggestedRecords: 1,
        };
      }
      return {
        schema: { items: { type: "array", ...config } },
        suggestedRecords: 1,
      };
    }

    return {
      schema: {
        items: inferField(input, "items", 0) as ArrayField,
      },
      suggestedRecords: 1,
    };
  }

  if (isPlainObject(input)) {
    const fields: SchemaState = {};
    for (const [key, value] of Object.entries(input)) {
      fields[key] = inferField(value, key, 0);
    }
    return { schema: fields, suggestedRecords: 1 };
  }

  return {
    schema: {
      value: inferField(input, "value", 0),
    },
    suggestedRecords: 1,
  };
}

export function inferSchemaFromJsonText(
  text: string
): InferSchemaResult | InferSchemaError {
  if (text.length > MAX_JSON_BYTES) {
    return { message: "JSON is too large. Please use a file under 1 MB." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { message: "Invalid JSON. Check brackets, quotes, and commas." };
  }

  const { schema, suggestedRecords } = inferFromRoot(parsed);

  if (countNamedFields(schema) === 0) {
    return { message: "No fields could be inferred from this JSON." };
  }

  return {
    schema,
    suggestedRecords: Math.min(1000, Math.max(1, suggestedRecords)),
    fieldCount: countNamedFields(schema),
    depth: calculateDepth(schema),
  };
}

export function isInferSchemaError(
  result: InferSchemaResult | InferSchemaError
): result is InferSchemaError {
  return "message" in result;
}
