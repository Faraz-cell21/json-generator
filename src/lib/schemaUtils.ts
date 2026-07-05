import type { ArrayItemConfig, SchemaField } from "@/types/schema";

function countFieldsInSchemaField(field: SchemaField): number {
  if (field.type === "object" && field.fields) {
    return countFields(field.fields);
  }
  if (field.type === "tuple" && field.tupleItems) {
    return field.tupleItems.reduce(
      (sum, item) => sum + 1 + countFieldsInSchemaField(item),
      0
    );
  }
  if (field.type === "array") {
    if (field.itemType === "object" && field.fields) {
      return countFields(field.fields);
    }
    if (field.itemType === "array" && field.itemSchema) {
      return countFieldsInArrayItem(field.itemSchema);
    }
    if (field.itemType === "tuple" && field.tupleItems) {
      return field.tupleItems.reduce(
        (sum, item) => sum + 1 + countFieldsInSchemaField(item),
        0
      );
    }
  }
  return 0;
}

function depthOfSchemaField(field: SchemaField): number {
  if (field.type === "object" && field.fields) {
    return calculateDepth(field.fields);
  }
  if (field.type === "tuple" && field.tupleItems.length > 0) {
    return (
      1 +
      Math.max(...field.tupleItems.map((item) => depthOfSchemaField(item)), 0)
    );
  }
  if (field.type === "array") {
    if (field.itemType === "object" && field.fields) {
      return calculateDepth(field.fields);
    }
    if (field.itemType === "array" && field.itemSchema) {
      return 1 + depthOfArrayItem(field.itemSchema);
    }
    if (field.itemType === "tuple" && field.tupleItems) {
      return (
        1 +
        Math.max(
          ...field.tupleItems.map((item) => depthOfSchemaField(item)),
          0
        )
      );
    }
  }
  return 0;
}

function countFieldsInArrayItem(item: ArrayItemConfig): number {
  if (item.itemType === "object" && item.fields) {
    return countFields(item.fields);
  }
  if (item.itemType === "array" && item.itemSchema) {
    return countFieldsInArrayItem(item.itemSchema);
  }
  if (item.itemType === "tuple" && item.tupleItems) {
    return item.tupleItems.reduce(
      (sum, itemField) => sum + 1 + countFieldsInSchemaField(itemField),
      0
    );
  }
  return 0;
}

function depthOfArrayItem(item: ArrayItemConfig): number {
  if (item.itemType === "object" && item.fields) {
    return calculateDepth(item.fields);
  }
  if (item.itemType === "array" && item.itemSchema) {
    return 1 + depthOfArrayItem(item.itemSchema);
  }
  if (item.itemType === "tuple" && item.tupleItems) {
    return (
      1 +
      Math.max(...item.tupleItems.map((itemField) => depthOfSchemaField(itemField)), 0)
    );
  }
  return 0;
}

export function countFields(schema: Record<string, any>): number {
  let count = 0;

  for (const key in schema) {
    count++;
    count += countFieldsInSchemaField(schema[key]);
  }

  return count;
}

export function calculateDepth(schema: Record<string, any>): number {
  let maxDepth = 1;

  for (const key in schema) {
    const depth = 1 + depthOfSchemaField(schema[key]);
    if (depth > maxDepth) maxDepth = depth;
  }

  return maxDepth;
}
