import { faker } from '@faker-js/faker';

export interface GeneratedEmployee {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  email: string;
}

export interface GeneratedSystemUser {
  username: string;
  password: string;
  employeeName: string;
  email: string;
}

/**
 * TestDataGenerator
 * Generates dynamic, realistic synthetic test datasets to prevent test collision in parallel runs.
 */
export class TestDataGenerator {
  /**
   * Generate random employee test record
   */
  generateEmployee(): GeneratedEmployee {
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName() || 'D';
    const lastName = faker.person.lastName();
    const employeeId = faker.string.numeric(5);
    const email = faker.internet.email({ firstName, lastName });

    return {
      firstName,
      middleName,
      lastName,
      employeeId,
      email,
    };
  }

  /**
   * Generate random system user credentials
   */
  generateSystemUser(): GeneratedSystemUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = `${firstName.toLowerCase()}.${faker.string.alphanumeric(4)}`;
    const password = `Test@${faker.string.alphanumeric(6)}!`;
    const email = faker.internet.email({ firstName, lastName });

    return {
      username,
      password,
      employeeName: `${firstName} ${lastName}`,
      email,
    };
  }

  /**
   * Generate random search query or term
   */
  generateSearchTerm(): string {
    return faker.word.noun();
  }
}
