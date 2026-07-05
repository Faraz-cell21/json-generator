export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "tuple";

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

export type ArrayItemType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "tuple";

export interface ArrayItemConfig {
  itemType: ArrayItemType;
  fakerType?: string;
  count?: number;
  fields?: Record<string, SchemaField>;
  itemSchema?: ArrayItemConfig;
  tupleItems?: SchemaField[];
}

export interface ArrayField extends BaseField, ArrayItemConfig {
  type: "array";
}

export interface TupleField extends BaseField {
  type: "tuple";
  tupleItems: SchemaField[];
}

export type SchemaField =
  | PrimitiveField
  | ObjectField
  | ArrayField
  | TupleField;

export type SchemaState = Record<string, SchemaField>;

export const UNNAMED_FIELD_PREFIX = "__new_";

export function isUnnamedFieldKey(key: string): boolean {
  return key.startsWith(UNNAMED_FIELD_PREFIX);
}

export function hasUnnamedFieldsInSchemaField(field: SchemaField): boolean {
  if (field.type === "object") {
    return hasUnnamedFields(field.fields);
  }
  if (field.type === "tuple") {
    return field.tupleItems.some(hasUnnamedFieldsInSchemaField);
  }
  if (field.type === "array") {
    if (field.itemType === "object" && field.fields) {
      return hasUnnamedFields(field.fields);
    }
    if (field.itemType === "array" && field.itemSchema) {
      return hasUnnamedFieldsInArrayItem(field.itemSchema);
    }
    if (field.itemType === "tuple" && field.tupleItems) {
      return field.tupleItems.some(hasUnnamedFieldsInSchemaField);
    }
  }
  return false;
}

function hasUnnamedFieldsInArrayItem(item: ArrayItemConfig): boolean {
  if (item.itemType === "object" && item.fields) {
    return hasUnnamedFields(item.fields);
  }
  if (item.itemType === "array" && item.itemSchema) {
    return hasUnnamedFieldsInArrayItem(item.itemSchema);
  }
  if (item.itemType === "tuple" && item.tupleItems) {
    return item.tupleItems.some(hasUnnamedFieldsInSchemaField);
  }
  return false;
}

function countNamedFieldsInSchemaField(field: SchemaField): number {
  if (field.type === "object") {
    return countNamedFields(field.fields);
  }
  if (field.type === "tuple") {
    return field.tupleItems.reduce(
      (sum, item) => sum + countNamedFieldsInSchemaField(item),
      0
    );
  }
  if (field.type === "array") {
    if (field.itemType === "object" && field.fields) {
      return countNamedFields(field.fields);
    }
    if (field.itemType === "array" && field.itemSchema) {
      return countNamedFieldsInArrayItem(field.itemSchema);
    }
    if (field.itemType === "tuple" && field.tupleItems) {
      return field.tupleItems.reduce(
        (sum, item) => sum + countNamedFieldsInSchemaField(item),
        0
      );
    }
  }
  return 0;
}

function countNamedFieldsInArrayItem(item: ArrayItemConfig): number {
  if (item.itemType === "object" && item.fields) {
    return countNamedFields(item.fields);
  }
  if (item.itemType === "array" && item.itemSchema) {
    return countNamedFieldsInArrayItem(item.itemSchema);
  }
  if (item.itemType === "tuple" && item.tupleItems) {
    return item.tupleItems.reduce(
      (sum, itemField) => sum + countNamedFieldsInSchemaField(itemField),
      0
    );
  }
  return 0;
}

export function hasUnnamedFields(schema: SchemaState): boolean {
  for (const key in schema) {
    if (isUnnamedFieldKey(key)) return true;
    if (hasUnnamedFieldsInSchemaField(schema[key])) return true;
  }
  return false;
}

export function countNamedFields(schema: SchemaState): number {
  let count = 0;
  for (const key in schema) {
    if (isUnnamedFieldKey(key)) continue;
    count++;
    count += countNamedFieldsInSchemaField(schema[key]);
  }
  return count;
}
