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