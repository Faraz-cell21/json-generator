export function countFields(schema: Record<string, any>): number {
    let count = 0;
    
    for (const key in schema) {
        count++;
        if (schema[key].type === "object" && schema[key].fields) {
            count += countFields(schema[key].fields);
        } else if (schema[key].type === "array" && schema[key].fields) {
            count += countFields(schema[key].fields);
        }
    }

    return count;
}

export function calculateDepth(schema: Record<string, any>): number {
    let maxDepth = 1;

    for (const key in schema) {
        if ((schema[key].type === "object" || schema[key].type === "array") && schema[key].fields) {
            const depth = 1 + calculateDepth(schema[key].fields);
            if (depth > maxDepth) {
                maxDepth = depth;
            }
        }
    }

    return maxDepth;
}