export interface FakerOption {
    label: string;
    value: string;
  }
  
  export const stringFakerOptions: FakerOption[] = [
    { label: "First Name", value: "person.firstName" },
    { label: "Last Name", value: "person.lastName" },
    { label: "Full Name", value: "person.fullName" },
    { label: "Email", value: "internet.email" },
    { label: "Phone", value: "phone.number" },
    { label: "Username", value: "internet.username" },
    { label: "Password", value: "internet.password" },
    { label: "Street Address", value: "location.streetAddress" },
    { label: "City", value: "location.city" },
    { label: "Country", value: "location.country" },
    { label: "Zip Code", value: "location.zipCode" },
    { label: "State", value: "location.state" },
    { label: "Company Name", value: "company.name" },
    { label: "Job Title", value: "person.jobTitle" },
    { label: "Department", value: "commerce.department" },
    { label: "Product Name", value: "commerce.productName" },
    { label: "Price", value: "commerce.price" },
    { label: "UUID", value: "string.uuid" },
    { label: "URL", value: "internet.url" },
    { label: "IP Address", value: "internet.ip" },
    { label: "Lorem Word", value: "lorem.word" },
    { label: "Lorem Sentence", value: "lorem.sentence" },
    { label: "Lorem Paragraph", value: "lorem.paragraph" },
    { label: "Color", value: "color.human" },
    { label: "Date (Past)", value: "date.past" },
    { label: "Date (Future)", value: "date.future" },
    { label: "Date (Recent)", value: "date.recent" },
    { label: "File Name", value: "system.fileName" },
    { label: "Mime Type", value: "system.mimeType" },
    { label: "User Agent", value: "internet.userAgent" },
    { label: "Word", value: "word.sample" },
  ];
  
  export const numberFakerOptions: FakerOption[] = [
    { label: "Random Int", value: "number.int" },
    { label: "Random Float", value: "number.float" },
  ];
  
  export const arrayItemTypes = [
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
    { label: "Boolean", value: "boolean" },
    { label: "Object", value: "object" },
  ];