export type FieldType = "string" | "number" | "boolean" | "object" | "array";

export interface BaseField {
  type: FieldType;
}

export interface PrimitiveField extends BaseField {
  type: "string" | "number" | "boolean";
  fakerType?: string;
}

export interface ObjectField extends BaseField {
  type: "object";
  fields: Record<string, SchemaField>;
}

export interface ArrayField extends BaseField {
  type: "array";
  itemType: "string" | "number" | "boolean" | "object";
  fakerType?: string;
  count?: number;
  fields?: Record<string, SchemaField>; // when itemType is object
}

export type SchemaField = PrimitiveField | ObjectField | ArrayField;
export type SchemaState = Record<string, SchemaField>;

export const UNNAMED_FIELD_PREFIX = "__new_";

export function isUnnamedFieldKey(key: string): boolean {
  return key.startsWith(UNNAMED_FIELD_PREFIX);
}

export function hasUnnamedFields(schema: SchemaState): boolean {
  for (const key in schema) {
    if (isUnnamedFieldKey(key)) return true;
    const field = schema[key];
    if (field.type === "object" && hasUnnamedFields(field.fields)) return true;
    if (
      field.type === "array" &&
      field.itemType === "object" &&
      field.fields &&
      hasUnnamedFields(field.fields)
    ) {
      return true;
    }
  }
  return false;
}

export function countNamedFields(schema: SchemaState): number {
  let count = 0;
  for (const key in schema) {
    if (isUnnamedFieldKey(key)) continue;
    count++;
    const field = schema[key];
    if (field.type === "object") {
      count += countNamedFields(field.fields);
    } else if (field.type === "array" && field.itemType === "object" && field.fields) {
      count += countNamedFields(field.fields);
    }
  }
  return count;
}